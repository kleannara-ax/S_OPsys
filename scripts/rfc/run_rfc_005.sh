#!/bin/bash
# ============================================================
# SNOP_RFC_005: 월말마감실적 동기화 (SAP → S&OP)
# 대상테이블: MOD_SALES_MONTHLY_CLOSING
# 처리방식: closing_month + item_code 동일 건 DELETE 후 INSERT
# 등록자/수정자: IF, 등록일시/수정일시 자동기록
#
# 인풋 파라미터:
#   - 년월(YYYYMM) 형식으로 입력 가능 (ex. 202604)
#   - 파라미터 없으면 시스템 날짜 기준 전월 데이터 자동 처리
#   - 인터페이스 마스터관리의 rfc_param 필드에서 읽어서 전달
#
# 실행 데이터:
#   - ending_inventory   : 월말재고
#   - production_actual  : 월생산실적
#   - sales_actual       : 월판매실적
# ============================================================
# 사용법:
#   /home/user/webapp/scripts/rfc/run_rfc_005.sh          → 전월 자동
#   /home/user/webapp/scripts/rfc/run_rfc_005.sh 202604   → 2026-04 지정
#
# 인터페이스 마스터관리 > 실행명령어 필드에 등록:
#   /home/user/webapp/scripts/rfc/run_rfc_005.sh
# 인터페이스 마스터관리 > RFC 파라미터 필드에 년월 입력:
#   "202604" (따옴표 포함 또는 미포함 모두 가능)
# ============================================================

set -e

# 인풋 파라미터 (년월 YYYYMM)
INPUT_YEAR_MONTH="${1:-}"

# 설정
SOP_BASE_URL="${SOP_BASE_URL:-http://localhost:8080}"
SOP_RFC_ENDPOINT="${SOP_BASE_URL}/api/rfc/SNOP_RFC_005"
SAP_RFC_URL="${SAP_RFC_URL:-}"
LOG_PREFIX="[RFC-005]"

echo "${LOG_PREFIX} 월말마감실적 동기화 시작 - $(date '+%Y-%m-%d %H:%M:%S')"
echo "${LOG_PREFIX} S&OP 엔드포인트: ${SOP_RFC_ENDPOINT}"

if [ -n "${INPUT_YEAR_MONTH}" ]; then
    echo "${LOG_PREFIX} 인풋 파라미터(년월): ${INPUT_YEAR_MONTH}"
else
    echo "${LOG_PREFIX} 인풋 파라미터 없음 → 전월 자동 처리"
fi

# rfc_param JSON 구성
RFC_PARAM_JSON=""
if [ -n "${INPUT_YEAR_MONTH}" ]; then
    RFC_PARAM_JSON=", \"rfc_param\": \"${INPUT_YEAR_MONTH}\""
fi

# Step 1: SAP RFC 호출하여 데이터 수신
if [ -n "${SAP_RFC_URL}" ]; then
    echo "${LOG_PREFIX} SAP RFC 호출: ${SAP_RFC_URL}"

    SAP_REQUEST_BODY="{\"rfc_id\":\"SNOP_RFC_005\""
    if [ -n "${INPUT_YEAR_MONTH}" ]; then
        SAP_REQUEST_BODY="${SAP_REQUEST_BODY}, \"year_month\":\"${INPUT_YEAR_MONTH}\""
    fi
    SAP_REQUEST_BODY="${SAP_REQUEST_BODY}}"

    SAP_RESPONSE=$(curl -s -X POST "${SAP_RFC_URL}" \
        -H 'Content-Type: application/json' \
        -d "${SAP_REQUEST_BODY}" \
        --connect-timeout 30 \
        --max-time 300)

    if [ $? -ne 0 ]; then
        echo "${LOG_PREFIX} ERROR: SAP RFC 호출 실패"
        exit 1
    fi

    echo "${LOG_PREFIX} SAP 응답 수신 완료"

    # Step 2: SAP에서 받은 데이터를 S&OP API로 전송
    RESULT=$(curl -s -X POST "${SOP_RFC_ENDPOINT}" \
        -H 'Content-Type: application/json' \
        -d "{\"data\": ${SAP_RESPONSE}, \"execution_type\": \"SCHEDULED\"${RFC_PARAM_JSON}}" \
        --connect-timeout 30 \
        --max-time 300)
else
    echo "${LOG_PREFIX} SAP RFC URL 미설정 - S&OP 수신 대기 상태 확인"
    RESULT=$(curl -s -X POST "${SOP_RFC_ENDPOINT}" \
        -H 'Content-Type: application/json' \
        -d "{\"data\":[], \"execution_type\":\"SCHEDULED\"${RFC_PARAM_JSON}}" \
        --connect-timeout 30 \
        --max-time 300)
fi

echo "${LOG_PREFIX} 실행 결과: ${RESULT}"

# 결과 확인
STATUS=$(echo "${RESULT}" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status','UNKNOWN'))" 2>/dev/null || echo "UNKNOWN")
echo "${LOG_PREFIX} 상태: ${STATUS}"

if [ "${STATUS}" = "SUCCESS" ] || [ "${STATUS}" = "PARTIAL_SUCCESS" ]; then
    echo "${LOG_PREFIX} 월말마감실적 동기화 완료 - $(date '+%Y-%m-%d %H:%M:%S')"
    exit 0
else
    echo "${LOG_PREFIX} 월말마감실적 동기화 실패 - $(date '+%Y-%m-%d %H:%M:%S')"
    exit 1
fi
