#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  S_OPsys AI Drive 복원 스크립트
#  - AI Drive의 백업 파일에서 소스코드 + DB 데이터 복원
#  사용법: ./restore_from_aidrive.sh [백업파일명]
#    인자 없으면 최신 백업 자동 선택
# ─────────────────────────────────────────────────────────
set -euo pipefail

PROJECT_DIR="/home/user/webapp"
AIDRIVE_BACKUP_DIR="/mnt/aidrive/S_OPsys_backups"
DB_DATA_DIR="${PROJECT_DIR}/module-sales/data"
RESTORE_TMP="/tmp/s_opsys_restore_tmp"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# ── 1. 백업 파일 결정 ──
if [ -n "${1:-}" ]; then
    BACKUP_FILE="${AIDRIVE_BACKUP_DIR}/$1"
else
    BACKUP_FILE=$(ls -1t "${AIDRIVE_BACKUP_DIR}"/S_OPsys_backup_*.tar.gz 2>/dev/null | head -1)
fi

if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ 복원할 백업 파일을 찾을 수 없습니다."
    echo ""
    echo "사용법: $0 [백업파일명]"
    echo ""
    echo "사용 가능한 백업 목록:"
    ls -1t "${AIDRIVE_BACKUP_DIR}"/S_OPsys_backup_*.tar.gz 2>/dev/null | while read -r f; do
        echo "  $(basename "$f")  ($(du -sh "$f" | cut -f1))"
    done
    exit 1
fi

BACKUP_NAME=$(basename "$BACKUP_FILE")
BACKUP_SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)

echo "━━━ S_OPsys 복원 시작 ━━━"
echo "  백업 파일: $BACKUP_NAME"
echo "  파일 크기: $BACKUP_SIZE"
echo ""

# ── 2. 확인 ──
read -p "⚠️  현재 소스코드와 DB가 백업 내용으로 덮어씌워집니다. 계속하시겠습니까? (y/N) " confirm
if [[ "$confirm" != [yY] ]]; then
    echo "복원 취소"
    exit 0
fi

# ── 3. 로컬로 복사 후 압축 해제 ──
log "백업 파일을 로컬로 복사 중..."
rm -rf "$RESTORE_TMP"
mkdir -p "$RESTORE_TMP"
cp "$BACKUP_FILE" "/tmp/${BACKUP_NAME}"
cd "$RESTORE_TMP"
tar -xzf "/tmp/${BACKUP_NAME}"
log "압축 해제 완료"

# ── 4. 메타 정보 표시 ──
if [ -f "$RESTORE_TMP/meta/backup_info.txt" ]; then
    echo ""
    cat "$RESTORE_TMP/meta/backup_info.txt"
    echo ""
fi

# ── 5. 소스코드 복원 ──
log "소스코드 복원 중..."
if [ -d "$RESTORE_TMP/source" ]; then
    # .git 폴더와 데이터는 보존하고 소스만 복원
    rsync -a --exclude='.git' --exclude='module-sales/data' \
        "$RESTORE_TMP/source/" "$PROJECT_DIR/"
    log "소스코드 복원 완료"
else
    log "⚠️  소스코드 디렉토리 없음, 건너뜀"
fi

# ── 6. DB 데이터 복원 ──
log "MariaDB 데이터베이스 복원 중..."
if [ -f "$RESTORE_TMP/db/snop_db.sql" ]; then
    if command -v mariadb >/dev/null 2>&1; then
        mariadb -u snop_user -psnop_pass1234 snop_db < "$RESTORE_TMP/db/snop_db.sql" 2>/dev/null && \
            log "MariaDB 데이터베이스 복원 완료" || \
            log "⚠️  MariaDB 복원 실패"
    elif command -v mysql >/dev/null 2>&1; then
        mysql -u snop_user -psnop_pass1234 snop_db < "$RESTORE_TMP/db/snop_db.sql" 2>/dev/null && \
            log "MariaDB 데이터베이스 복원 완료" || \
            log "⚠️  MariaDB 복원 실패"
    else
        log "⚠️  mariadb/mysql 클라이언트를 찾을 수 없음"
    fi
else
    log "⚠️  DB 백업 데이터 없음, 건너뜀"
fi

# ── 7. 정리 ──
rm -rf "$RESTORE_TMP"
rm -f "/tmp/${BACKUP_NAME}"

echo ""
echo "✅ 복원 완료!"
echo ""
echo "다음 단계:"
echo "  1. cd $PROJECT_DIR/module-sales && ./gradlew build -x test"
echo "  2. java -jar build/libs/module-sales-1.0.0.jar"
echo "  3. http://localhost:8080 접속 확인"
