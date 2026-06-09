/**
 * 운영 서버 데이터 추출 스크립트
 * ─────────────────────────────────
 * 사용법:
 * 1. https://snop.kleannara.com/ 에 로그인
 * 2. 브라우저 개발자 도구(F12) → Console 탭
 * 3. 아래 코드를 콘솔에 붙여넣기 → Enter
 * 4. 자동으로 JSON 파일이 다운로드됨
 * 5. 다운로드된 파일을 여기에 업로드
 */

(async function extractAllData() {
    const TEST_SERVER = 'https://3000-izmvs2pbk4x102eklx28l-a402f90a.sandbox.novita.ai';

    const endpoints = [
        { key: 'snopRecords', url: '/sales-api/snop-records?page=0&size=5000' },
        { key: 'materialLinkages', url: '/sales-api/material-linkages?page=0&size=5000' },
        { key: 'renewalMaterialLinkages', url: '/sales-api/renewal-material-linkages?page=0&size=5000' },
        { key: 'salesPlanUploads', url: '/sales-api/sales-plan-uploads?page=0&size=5000' },
        { key: 'salesChannels', url: '/sales-api/sales-channels?page=0&size=5000' },
        { key: 'lineCapaPlans', url: '/sales-api/line-capa-plans?page=0&size=5000' },
        { key: 'lineItemMasters', url: '/sales-api/line-item-masters?page=0&size=5000' },
        { key: 'optimalInventoryBaselines', url: '/sales-api/optimal-inventory-baselines?page=0&size=5000' },
        { key: 'recentSalesAverages', url: '/sales-api/recent-sales-averages?page=0&size=5000' },
        { key: 'baseMaterialMasters', url: '/sales-api/base-material-masters?page=0&size=5000' },
        { key: 'monthlyClosings', url: '/sales-api/monthly-closings?page=0&size=5000' },
        { key: 'interfaceHistories', url: '/sales-api/interface-histories?page=0&size=5000' },
        { key: 'plantStorageLocations', url: '/sales-api/plant-storage' },
    ];

    const result = {};
    let success = 0;
    let fail = 0;

    for (const ep of endpoints) {
        try {
            console.log(`추출 중: ${ep.key} (${ep.url})`);
            const res = await fetch(ep.url, { credentials: 'same-origin' });
            if (res.ok) {
                result[ep.key] = await res.json();
                success++;
                console.log(`  ✅ ${ep.key} 완료`);
            } else {
                result[ep.key] = null;
                fail++;
                console.warn(`  ❌ ${ep.key} 실패: HTTP ${res.status}`);
            }
        } catch (e) {
            result[ep.key] = null;
            fail++;
            console.error(`  ❌ ${ep.key} 오류:`, e.message);
        }
    }

    // snop-records 페이지네이션 전체 조회
    try {
        const firstPage = result.snopRecords;
        const data = firstPage?.data;
        if (data && data.total_pages > 1) {
            console.log(`snop-records 추가 페이지 조회: 총 ${data.total_pages} 페이지`);
            const allContent = [...(data.content || [])];
            for (let page = 1; page < data.total_pages && page < 50; page++) {
                const res = await fetch(`/sales-api/snop-records?page=${page}&size=5000`, { credentials: 'same-origin' });
                if (res.ok) {
                    const pageData = await res.json();
                    if (pageData?.data?.content) {
                        allContent.push(...pageData.data.content);
                    }
                }
            }
            result.snopRecords.data.content = allContent;
            result.snopRecords.data.total_pages = 1;
            console.log(`  ✅ snop-records 전체: ${allContent.length}건`);
        }
    } catch (e) {
        console.warn('snop-records 페이지네이션 추가 조회 실패:', e.message);
    }

    console.log(`\n📦 데이터 추출 완료! 성공=${success}, 실패=${fail}`);
    console.log(`테스트 서버(${TEST_SERVER})로 전송 중...`);

    // 테스트 서버로 직접 전송
    try {
        const uploadRes = await fetch(`${TEST_SERVER}/test-api/upload-snapshot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result),
        });
        const uploadResult = await uploadRes.json();
        if (uploadResult.success) {
            console.log(`\n🎉 전송 완료! ${uploadResult.message}`);
            console.log(`테스트 URL: ${TEST_SERVER}`);
            console.log('위 URL을 새로고침하면 실제 데이터가 표시됩니다.');
        } else {
            throw new Error(uploadResult.error || '전송 실패');
        }
    } catch (uploadErr) {
        console.error('❌ 테스트 서버 전송 실패:', uploadErr.message);
        console.log('대안: JSON 파일로 다운로드합니다...');
        // 전송 실패 시 파일 다운로드 fallback
        const json = JSON.stringify(result, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'snop-data-export.json';
        a.click();
        URL.revokeObjectURL(url);
        console.log('snop-data-export.json 다운로드 완료 — 이 파일을 수동으로 업로드해주세요.');
    }
})();
