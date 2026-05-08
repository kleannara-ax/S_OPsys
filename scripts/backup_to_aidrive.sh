#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  S_OPsys 자동 백업 스크립트
#  - 소스코드 + DB 데이터를 tar.gz로 AI Drive에 저장
#  - 최근 5개 백업만 유지 (오래된 백업 자동 삭제)
# ─────────────────────────────────────────────────────────
set -euo pipefail

# ── 설정 ──
PROJECT_DIR="/home/user/webapp"
AIDRIVE_BACKUP_DIR="/mnt/aidrive/S_OPsys_backups"
DB_DATA_DIR="${PROJECT_DIR}/module-sales/data"
MAX_BACKUPS=5
TIMESTAMP=$(date +"%Y-%m-%d_%H%M%S")
BACKUP_NAME="S_OPsys_backup_${TIMESTAMP}.tar.gz"
LOCAL_TMP="/tmp/s_opsys_backup_tmp"
LOG_FILE="${PROJECT_DIR}/backup.log"

log() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "$msg"
    echo "$msg" >> "$LOG_FILE" 2>/dev/null || true
}

log "━━━ S_OPsys 백업 시작 ━━━"

# ── 1. AI Drive 백업 디렉토리 생성 ──
if [ ! -d "$AIDRIVE_BACKUP_DIR" ]; then
    sudo mkdir -p "$AIDRIVE_BACKUP_DIR" 2>/dev/null || mkdir -p "$AIDRIVE_BACKUP_DIR"
    sudo chown -R "$(id -u):$(id -g)" "$AIDRIVE_BACKUP_DIR" 2>/dev/null || true
    log "AI Drive 백업 디렉토리 생성: $AIDRIVE_BACKUP_DIR"
fi

# ── 2. 임시 디렉토리에 백업 대상 수집 ──
rm -rf "$LOCAL_TMP"
mkdir -p "$LOCAL_TMP/source"
mkdir -p "$LOCAL_TMP/db"
mkdir -p "$LOCAL_TMP/meta"

# 소스코드 복사 (빌드 결과물, .git, node_modules 등 제외)
log "소스코드 수집 중..."
cd "$PROJECT_DIR"
tar cf - \
    --exclude='.git' \
    --exclude='build' \
    --exclude='.gradle' \
    --exclude='node_modules' \
    --exclude='*.jar' \
    --exclude='module-sales/data' \
    --exclude='backup.log' \
    --exclude='supervisord.*' \
    --exclude='*.sock' \
    --exclude='*.pid' \
    . 2>/dev/null | (cd "$LOCAL_TMP/source" && tar xf -)
log "소스코드 수집 완료"

# MariaDB 데이터베이스 덤프
log "MariaDB 데이터베이스 백업 중..."
if command -v mariadb-dump >/dev/null 2>&1; then
    mariadb-dump -u snop_user -psnop_pass1234 snop_db > "$LOCAL_TMP/db/snop_db.sql" 2>/dev/null && \
        log "MariaDB 데이터베이스 백업 완료" || \
        log "⚠️  MariaDB 덤프 실패 (서버 미실행 또는 접속 불가)"
elif command -v mysqldump >/dev/null 2>&1; then
    mysqldump -u snop_user -psnop_pass1234 snop_db > "$LOCAL_TMP/db/snop_db.sql" 2>/dev/null && \
        log "MariaDB 데이터베이스 백업 완료" || \
        log "⚠️  MariaDB 덤프 실패 (서버 미실행 또는 접속 불가)"
else
    log "⚠️  mariadb-dump/mysqldump 명령어를 찾을 수 없음"
fi

# 메타 정보 저장
cat > "$LOCAL_TMP/meta/backup_info.txt" <<EOF
━━━ S_OPsys 백업 정보 ━━━
백업 시각: $(date '+%Y-%m-%d %H:%M:%S %Z')
프로젝트: S_OPsys (S&OP 계획 시스템)
소스 경로: $PROJECT_DIR
Git 브랜치: $(cd "$PROJECT_DIR" && git branch --show-current 2>/dev/null || echo 'N/A')
Git 커밋: $(cd "$PROJECT_DIR" && git log --oneline -1 2>/dev/null || echo 'N/A')
파일 수: $(find "$LOCAL_TMP/source" -type f 2>/dev/null | wc -l)
DB 파일: $(ls -lh "$LOCAL_TMP/db/" 2>/dev/null || echo '없음')
━━━━━━━━━━━━━━━━━━━━━━━
EOF

log "메타 정보 기록 완료"

# ── 3. tar.gz 아카이브 생성 (로컬에서 먼저) ──
LOCAL_ARCHIVE="/tmp/${BACKUP_NAME}"
log "아카이브 생성 중: ${BACKUP_NAME}"
cd "$LOCAL_TMP"
tar -czf "$LOCAL_ARCHIVE" source/ db/ meta/
ARCHIVE_SIZE=$(du -sh "$LOCAL_ARCHIVE" | cut -f1)
log "아카이브 생성 완료 (크기: ${ARCHIVE_SIZE})"

# ── 4. AI Drive로 복사 (단일 파일) ──
log "AI Drive로 전송 중..."
cp "$LOCAL_ARCHIVE" "${AIDRIVE_BACKUP_DIR}/${BACKUP_NAME}"
log "AI Drive 전송 완료: ${AIDRIVE_BACKUP_DIR}/${BACKUP_NAME}"

# ── 5. 오래된 백업 삭제 (최근 MAX_BACKUPS개만 유지) ──
BACKUP_COUNT=$(ls -1t "${AIDRIVE_BACKUP_DIR}"/S_OPsys_backup_*.tar.gz 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
    DELETE_COUNT=$((BACKUP_COUNT - MAX_BACKUPS))
    log "오래된 백업 ${DELETE_COUNT}개 삭제 중 (최근 ${MAX_BACKUPS}개 유지)..."
    ls -1t "${AIDRIVE_BACKUP_DIR}"/S_OPsys_backup_*.tar.gz 2>/dev/null \
        | tail -n "$DELETE_COUNT" \
        | while read -r old_backup; do
            rm -f "$old_backup"
            log "  삭제: $(basename "$old_backup")"
        done
fi

# ── 6. 정리 ──
rm -rf "$LOCAL_TMP"
rm -f "$LOCAL_ARCHIVE"

# ── 7. 최종 백업 목록 표시 ──
log "━━━ 현재 AI Drive 백업 목록 ━━━"
ls -lht "${AIDRIVE_BACKUP_DIR}"/S_OPsys_backup_*.tar.gz 2>/dev/null | while read -r line; do
    log "  $line"
done

log "━━━ S_OPsys 백업 완료 ━━━"
echo ""
echo "✅ 백업 완료: ${AIDRIVE_BACKUP_DIR}/${BACKUP_NAME} (${ARCHIVE_SIZE})"
