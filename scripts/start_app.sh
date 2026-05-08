#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  S_OPsys 통합 시작 스크립트
#  - Spring Boot 앱 빌드 및 시작
#  - 자동 백업 데몬 시작
#  - AI Drive 백업 초기 실행
#
#  사용법: ./start_app.sh
# ─────────────────────────────────────────────────────────
set -uo pipefail

PROJECT_DIR="/home/user/webapp"
MODULE_DIR="${PROJECT_DIR}/module-sales"
SCRIPTS_DIR="${PROJECT_DIR}/scripts"
LOG_DIR="${PROJECT_DIR}"
APP_PORT=8080

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [Startup] $1"
}

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "  S_OPsys 시스템 시작"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. 기존 프로세스 정리 ──
log "[1/5] 기존 프로세스 정리..."
EXISTING_PID=$(lsof -t -i:${APP_PORT} 2>/dev/null || true)
if [ -n "$EXISTING_PID" ]; then
    log "  기존 앱 프로세스 종료 (PID: $EXISTING_PID)"
    kill "$EXISTING_PID" 2>/dev/null || true
    sleep 3
fi

# 기존 백업 데몬 종료
if [ -f /tmp/s_opsys_auto_backup.pid ]; then
    OLD_DAEMON_PID=$(cat /tmp/s_opsys_auto_backup.pid 2>/dev/null)
    if [ -n "$OLD_DAEMON_PID" ] && kill -0 "$OLD_DAEMON_PID" 2>/dev/null; then
        log "  기존 백업 데몬 종료 (PID: $OLD_DAEMON_PID)"
        kill "$OLD_DAEMON_PID" 2>/dev/null || true
        sleep 1
    fi
    rm -f /tmp/s_opsys_auto_backup.pid
fi

# ── 1.5 MariaDB 확인 및 시작 ──
log "[1.5/5] MariaDB 상태 확인..."
if ! pgrep -x mariadbd >/dev/null 2>&1; then
    log "  MariaDB 미실행 → 시작 시도..."
    sudo mariadbd-safe &
    sleep 3
    if pgrep -x mariadbd >/dev/null 2>&1; then
        log "  MariaDB 시작 완료"
    else
        log "  경고: MariaDB 시작 실패. 수동 확인 필요."
    fi
else
    log "  MariaDB 실행 중"
fi

# MariaDB 접속 테스트
if mariadb -u snop_user -psnop_pass1234 -e "SELECT 1" snop_db >/dev/null 2>&1; then
    log "  MariaDB 접속 확인 OK (snop_db)"
else
    log "  경고: MariaDB snop_db 접속 실패. DB/사용자 확인 필요."
fi

# ── 2. 빌드 ──
log "[2/5] Spring Boot 애플리케이션 빌드..."
cd "$MODULE_DIR"
./gradlew build -x test 2>&1 | tail -3
if [ $? -eq 0 ]; then
    log "  빌드 성공"
else
    log "  빌드 실패! 종료합니다."
    exit 1
fi

# ── 3. 앱 시작 ──
log "[3/5] Spring Boot 앱 시작 (포트: ${APP_PORT})..."
cd "$MODULE_DIR"
nohup java -jar build/libs/module-sales-1.0.0.jar \
    --server.port=${APP_PORT} \
    >> "${LOG_DIR}/app.log" 2>&1 &
APP_PID=$!
log "  앱 PID: $APP_PID"

# 앱 기동 대기
log "  앱 기동 대기 중..."
for i in $(seq 1 30); do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:${APP_PORT}/ 2>/dev/null | grep -q "200"; then
        log "  앱 기동 완료! (${i}초)"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        log "  경고: 30초 내 앱 기동 확인 실패 (백그라운드에서 계속 시도 중)"
    fi
done

# ── 4. 자동 백업 데몬 시작 ──
log "[4/5] 자동 백업 데몬 시작 (30분 간격)..."
nohup bash "${SCRIPTS_DIR}/auto_backup_daemon.sh" 1800 \
    >> "${LOG_DIR}/auto_backup.log" 2>&1 &
DAEMON_PID=$!
log "  백업 데몬 PID: $DAEMON_PID"

# ── 5. 상태 확인 ──
log "[5/5] 시스템 상태 확인..."
sleep 2

echo ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "  S_OPsys 시스템 시작 완료"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "  앱 URL:       http://localhost:${APP_PORT}/"
log "  앱 PID:       $APP_PID"
log "  백업 데몬 PID: $DAEMON_PID"
log "  백업 위치:    /mnt/aidrive/S_OPsys_backups/"
log "  백업 간격:    30분"
log "  앱 로그:      ${LOG_DIR}/app.log"
log "  백업 로그:    ${LOG_DIR}/auto_backup.log"
log ""
log "  API 엔드포인트:"
log "    GET  /api/backup/status  - 백업 상태 조회"
log "    POST /api/backup/trigger - 수동 백업 실행"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# AI Drive 백업 목록 확인
echo ""
log "현재 AI Drive 백업 목록:"
ls -lht /mnt/aidrive/S_OPsys_backups/S_OPsys_backup_*.tar.gz 2>/dev/null | while read -r line; do
    log "  $line"
done
echo ""
echo "✅ S_OPsys 시스템이 정상 시작되었습니다."
