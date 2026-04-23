#!/bin/bash
# ============================================================
# SNOP_RFC_003: 생산실적 동기화 (SAP → S&OP)
# 대상테이블: MOD_SALES_SNOP_RECORD
# 처리방식: plan_month+item_code+plant_code 매칭건 update
# 등록자/수정자: IF, 등록일시/수정일시 자동기록
# ============================================================
# 사용법: 인터페이스 마스터관리 > 실행명령어 필드에 아래 경로 등록
#   /home/user/webapp/scripts/rfc/run_rfc_003.sh
# ============================================================

set -e

# 설정
SOP_BASE_URL="${SOP_BASE_URL:-http://localhost:8080}"
SOP_RFC_ENDPOINT="${SOP_BASE_URL}/api/rfc/SNOP_RFC_003"
SAP_RFC_URL="${SAP_RFC_URL:-}"
LOG_PREFIX="[RFC-003]"

echo "${LOG_PREFIX} 생산실적 동기화 시작 - $(date '+%Y-%m-%d %H:%M:%S')"
echo "${LOG_PREFIX} S&OP 엔드포인트: ${SOP_RFC_ENDPOINT}"

# Step 1: SAP RFC 호출하여 생산실적 데이터 수신
if [ -n "${SAP_RFC_URL}" ]; then
    echo "${LOG_PREFIX} SAP RFC 호출: ${SAP_RFC_URL}"
    SAP_RESPONSE=$(curl -s -X POST "${SAP_RFC_URL}" \
        -H 'Content-Type: application/json' \
        -d '{"rfc_id":"SNOP_RFC_003"}' \
        --connect-timeout 30 \
        --max-time 300)
    
    if [ $? -ne 0 ]; then
        echo "${LOG_PREFIX} ERROR: SAP RFC 호출 실패"
        exit 1
    fi
    
    echo "${LOG_PREFIX} SAP 응답 수신 완료"
    
    # Step 2: S&OP API로 전송
    RESULT=$(curl -s -X POST "${SOP_RFC_ENDPOINT}" \
        -H 'Content-Type: application/json' \
        -d "{\"data\": ${SAP_RESPONSE}, \"execution_type\": \"SCHEDULED\"}" \
        --connect-timeout 30 \
        --max-time 300)
else
    echo "${LOG_PREFIX} SAP RFC URL 미설정 - S&OP 수신 대기 상태 확인"
    RESULT=$(curl -s -X POST "${SOP_RFC_ENDPOINT}" \
        -H 'Content-Type: application/json' \
        -d '{"data":[], "execution_type":"SCHEDULED"}' \
        --connect-timeout 30 \
        --max-time 300)
fi

echo "${LOG_PREFIX} 실행 결과: ${RESULT}"

STATUS=$(echo "${RESULT}" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status','UNKNOWN'))" 2>/dev/null || echo "UNKNOWN")
echo "${LOG_PREFIX} 상태: ${STATUS}"

if [ "${STATUS}" = "SUCCESS" ] || [ "${STATUS}" = "PARTIAL_SUCCESS" ]; then
    echo "${LOG_PREFIX} 생산실적 동기화 완료 - $(date '+%Y-%m-%d %H:%M:%S')"
    exit 0
else
    echo "${LOG_PREFIX} 생산실적 동기화 실패 - $(date '+%Y-%m-%d %H:%M:%S')"
    exit 1
fi
