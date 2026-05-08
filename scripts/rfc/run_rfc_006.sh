#!/bin/bash
# ============================================================
# SNOP_RFC_006: 리뉴얼 자재 연결 동기화 (SAP -> S&OP)
# 대상테이블: MOD_SALES_RENEWAL_MATERIAL_LINKAGE
# 처리방식: new_update_type 1=Insert, 2=Update by item_code(legacy_item_code)
# 등록자/변경자: IF, 등록일시/수정일시 자동기록
#
# 필드 매핑:
#   RFC hierarchy_name  -> hierarchy_name
#   RFC item_code       -> legacy_item_code (기존 자재 코드)
#   RFC item_name       -> legacy_item_name (기존 자재 명칭)
#   RFC item_code_1~5   -> renewal_item_code_1~5
#   RFC item_name_1~5   -> renewal_item_name_1~5
#   RFC is_active       -> is_active (1=활성화, 2=비활성화)
#   RFC new_update_type -> 1=Insert, 2=Update
#
# RFC param: 1개 (A 또는 B 값)
# ============================================================
# 사용법: 인터페이스 마스터관리 > 실행명령어 필드에 아래 경로 등록
#   /home/user/webapp/scripts/rfc/run_rfc_006.sh
# ============================================================

set -e

# 설정
SOP_BASE_URL="${SOP_BASE_URL:-http://localhost:8080}"
SOP_RFC_ENDPOINT="${SOP_BASE_URL}/api/rfc/SNOP_RFC_006"
SAP_RFC_URL="${SAP_RFC_URL:-}"
RFC_PARAM="${RFC_PARAM:-A}"
LOG_PREFIX="[RFC-006]"

echo "${LOG_PREFIX} 리뉴얼자재연결 동기화 시작 - $(date '+%Y-%m-%d %H:%M:%S')"
echo "${LOG_PREFIX} S&OP 엔드포인트: ${SOP_RFC_ENDPOINT}"
echo "${LOG_PREFIX} RFC 파라미터: ${RFC_PARAM}"

# Step 1: SAP RFC 호출하여 데이터 수신
# SAP RFC URL이 설정되어 있으면 SAP에서 데이터를 가져옴
# 설정되어 있지 않으면 S&OP 수신 대기 상태 확인 (빈 데이터 전송)
if [ -n "${SAP_RFC_URL}" ]; then
    echo "${LOG_PREFIX} SAP RFC 호출: ${SAP_RFC_URL} (param: ${RFC_PARAM})"
    SAP_RESPONSE=$(curl -s -X POST "${SAP_RFC_URL}" \
        -H 'Content-Type: application/json' \
        -d "{\"rfc_id\":\"SNOP_RFC_006\", \"param\":\"${RFC_PARAM}\"}" \
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

# 결과 확인
STATUS=$(echo "${RESULT}" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status','UNKNOWN'))" 2>/dev/null || echo "UNKNOWN")
echo "${LOG_PREFIX} 상태: ${STATUS}"

if [ "${STATUS}" = "SUCCESS" ] || [ "${STATUS}" = "PARTIAL_SUCCESS" ]; then
    echo "${LOG_PREFIX} 리뉴얼자재연결 동기화 완료 - $(date '+%Y-%m-%d %H:%M:%S')"
    exit 0
else
    echo "${LOG_PREFIX} 리뉴얼자재연결 동기화 실패 - $(date '+%Y-%m-%d %H:%M:%S')"
    exit 1
fi
