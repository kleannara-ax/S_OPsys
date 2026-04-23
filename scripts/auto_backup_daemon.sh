#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  S_OPsys 자동 백업 데몬
#  - 지정 간격(기본 30분)마다 AI Drive에 자동 백업
#  - Git 변경 감지: 변경 없으면 백업 건너뜀
#  - 앱 시작 시 즉시 1회 백업 후 주기 실행
#  사용법: ./auto_backup_daemon.sh [간격(초), 기본 1800]
# ─────────────────────────────────────────────────────────
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_SCRIPT="${SCRIPT_DIR}/backup_to_aidrive.sh"
PROJECT_DIR="/home/user/webapp"
INTERVAL="${1:-1800}"   # 기본 30분
PID_FILE="/tmp/s_opsys_auto_backup.pid"
LAST_HASH_FILE="/tmp/s_opsys_last_backup_hash"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [AutoBackup] $1"
}

# ── PID 관리 ──
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE" 2>/dev/null)
    if kill -0 "$OLD_PID" 2>/dev/null; then
        log "자동 백업 데몬이 이미 실행 중입니다 (PID: $OLD_PID)"
        exit 0
    fi
fi
echo $$ > "$PID_FILE"

cleanup() {
    rm -f "$PID_FILE"
    log "자동 백업 데몬 종료"
    exit 0
}
trap cleanup SIGTERM SIGINT EXIT

# ── 변경 감지 함수 ──
get_project_hash() {
    cd "$PROJECT_DIR"
    # Git tracked 파일의 해시 + untracked 파일 목록
    (
        git diff HEAD --stat 2>/dev/null
        git status --porcelain 2>/dev/null
        # DB 파일 변경도 감지
        # MariaDB 테이블 상태 해시로 변경 감지
        mariadb -u snop_user -psnop_pass1234 -e "SHOW TABLE STATUS FROM snop_db" 2>/dev/null | md5sum || true
    ) | md5sum | cut -d' ' -f1
}

has_changes() {
    local current_hash
    current_hash=$(get_project_hash)
    
    if [ -f "$LAST_HASH_FILE" ]; then
        local last_hash
        last_hash=$(cat "$LAST_HASH_FILE" 2>/dev/null)
        if [ "$current_hash" = "$last_hash" ]; then
            return 1  # 변경 없음
        fi
    fi
    
    echo "$current_hash" > "$LAST_HASH_FILE"
    return 0  # 변경 있음
}

# ── 메인 루프 ──
log "━━━ S_OPsys 자동 백업 데몬 시작 ━━━"
log "  백업 간격: ${INTERVAL}초 ($(( INTERVAL / 60 ))분)"
log "  백업 스크립트: ${BACKUP_SCRIPT}"
log "  PID: $$"

# 시작 시 즉시 1회 백업
log "초기 백업 실행..."
bash "$BACKUP_SCRIPT" 2>&1 | while IFS= read -r line; do
    log "$line"
done
INIT_HASH=$(get_project_hash)
echo "$INIT_HASH" > "$LAST_HASH_FILE"
log "초기 백업 완료"

while true; do
    sleep "$INTERVAL"
    
    if has_changes; then
        log "변경 감지됨 → 백업 실행"
        bash "$BACKUP_SCRIPT" 2>&1 | while IFS= read -r line; do
            log "$line"
        done
    else
        log "변경 없음 → 백업 건너뜀"
    fi
done
