/**
 * S&OP 프론트엔드 사전 테스트 서버
 * ─────────────────────────────────────────
 * 모드 1 (프록시): 운영 서버 API를 프록시하여 실제 데이터로 테스트
 *   PROXY_TARGET=http://운영서버IP:8080 node test-server.js
 *
 * 모드 2 (Mock): 인증 우회 + 모의 응답으로 UI 레이아웃/기능만 테스트
 *   node test-server.js
 *
 * 포트: TEST_PORT 환경변수 또는 기본 3000
 */

const express = require('express');
const path = require('path');
const app = express();

const PORT = parseInt(process.env.TEST_PORT || '3000', 10);
const PROXY_TARGET = process.env.PROXY_TARGET || ''; // e.g. http://10.x.x.x:8080

app.use(express.json({ limit: '50mb' }));

/* ── 정적 파일 서빙 (프론트엔드) ── */
app.use(express.static(path.join(__dirname, 'web')));

/* ── 프록시 모드 ── */
if (PROXY_TARGET) {
    const { createProxyMiddleware } = require('http-proxy-middleware');
    console.log(`[테스트서버] 프록시 모드 — API 요청을 ${PROXY_TARGET}으로 전달합니다.`);

    app.use('/sales-api', createProxyMiddleware({
        target: PROXY_TARGET,
        changeOrigin: true,
        cookieDomainRewrite: '',
        onProxyRes(proxyRes) {
            // 쿠키 도메인 제거 (크로스 도메인 세션 유지)
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
                proxyRes.headers['set-cookie'] = setCookie.map(cookie =>
                    cookie.replace(/;\s*Domain=[^;]*/gi, '')
                          .replace(/;\s*Secure/gi, '')
                          .replace(/;\s*SameSite=[^;]*/gi, '; SameSite=Lax')
                );
            }
        },
        onError(err, req, res) {
            console.error(`[프록시 오류] ${req.method} ${req.url}:`, err.message);
            res.status(502).json({ error: '운영 서버 연결 실패', detail: err.message });
        }
    }));

} else {
    /* ── Mock 모드 — 인증 우회 + 모의 데이터 ── */
    console.log('[테스트서버] Mock 모드 — 인증 우회 + 모의 데이터를 사용합니다.');

    // ── Auth Mock ──
    app.post('/sales-api/auth/login', (req, res) => {
        res.json({ user_id: 'test', user_name: '테스트 사용자', role: 'ADMIN', authenticated: true });
    });
    app.get('/sales-api/auth/me', (req, res) => {
        res.json({ user_id: 'test', user_name: '테스트 사용자', role: 'ADMIN', authenticated: true });
    });
    app.post('/sales-api/auth/logout', (req, res) => {
        res.json({ success: true });
    });

    // ── 공통 ApiResponse 래퍼 (Spring Boot 서버 응답 형식 동일) ──
    function apiResponse(content = [], page = 0, size = 500) {
        return {
            success: true,
            data: {
                content,
                total_pages: 1,
                total_elements: content.length,
                last: true,
                number: page,
                size,
            },
        };
    }
    function apiResponseList(list = []) {
        return { success: true, data: list };
    }
    function apiResponseEmpty() {
        return {
            success: true,
            data: {
                content: [],
                total_pages: 0,
                total_elements: 0,
                last: true,
                number: 0,
                size: 500,
            },
        };
    }

    // ── 생산계획현황 (SnopRecord) Mock ──
    const mockSnopRecords = [];
    const categories = ['음료', '간식', '유제품'];
    const lines = ['라인A', '라인B', '라인C'];
    const itemCodes = [
        'SSN-DSO0010A', 'SSN-DSO0008A', 'SSN-BEV0001A', 'SSN-SNK0002A',
        'SSN-DRY0003A', 'SSN-BEV0004A', 'SSN-SNK0005A', 'SSN-DRY0006A',
    ];
    const months = ['2026-06', '2026-07', '2026-08', '2026-09'];

    itemCodes.forEach((code, idx) => {
        months.forEach((month, mi) => {
            mockSnopRecords.push({
                id: idx * 100 + mi + 1,
                item_code: code,
                item_name: `자재-${code}`,
                category: categories[idx % categories.length],
                production_line: lines[idx % lines.length],
                plan_month: month,
                sales_actual: Math.floor(Math.random() * 100) + 10,
                sales_plan: Math.floor(Math.random() * 120) + 20,
                production_actual: Math.floor(Math.random() * 80) + 5,
                production_plan: Math.floor(Math.random() * 100) + 15,
                beginning_inventory: Math.floor(Math.random() * 500) + 50,
                available_inventory: Math.floor(Math.random() * 400) + 40,
                target_ending_inventory: Math.floor(Math.random() * 200) + 30,
                capacity_limit: Math.floor(Math.random() * 150) + 50,
                inventory_unit: 'BOX',
            });
        });
    });

    app.get('/sales-api/snop-records', (req, res) => {
        const page = parseInt(req.query.page || '0', 10);
        const size = parseInt(req.query.size || '500', 10);
        const start = page * size;
        const slice = mockSnopRecords.slice(start, start + size);
        res.json(apiResponse(slice, page, size));
    });

    // ── 자재 연결 마스터 Mock ──
    const mockMaterialLinkages = [
        { id: 1, legacy_item_code: 'SSN-DSO0008A', legacy_item_name: '자재-SSN-DSO0008A',
          renewal_item_code: 'SSN-DSO0010A', renewal_item_name: '자재-SSN-DSO0010A' },
    ];
    app.get('/sales-api/material-linkages', (req, res) => {
        res.json(apiResponse(mockMaterialLinkages));
    });

    // ── 리뉴얼 자재 연결 (SAP) Mock ──
    const mockRenewalLinkages = [
        {
            id: 1,
            legacy_item_code: 'SSN-DSO0010A',   // 신규코드
            legacy_item_name: '자재-SSN-DSO0010A',
            renewal_item_code_1: 'SSN-DSO0008A', // 기존코드1
            renewal_item_name_1: '자재-SSN-DSO0008A',
            is_active: true,
        },
    ];
    app.get('/sales-api/renewal-material-linkages', (req, res) => {
        res.json(apiResponse(mockRenewalLinkages));
    });

    // ── 빈 리스트 반환 엔드포인트들 ──
    const emptyEndpoints = [
        'sales-plan-uploads', 'sales-channels', 'line-capa-plans', 'line-item-masters',
        'sales-plan-upload-logs', 'production-change-logs', 'sales-plan-upload-history',
        'optimal-inventory-baselines', 'recent-sales-averages', 'base-material-masters',
        'monthly-closings', 'plant-storage-locations',
    ];
    emptyEndpoints.forEach((ep) => {
        app.get(`/sales-api/${ep}`, (req, res) => {
            res.json(apiResponseEmpty());
        });
    });

    // ── RFC 수동실행 Mock ──
    app.post('/sales-api/rfc-interface/execute/:rfcId', (req, res) => {
        const rfcId = req.params.rfcId;
        console.log(`[Mock] RFC 수동실행 요청: ${rfcId}`);
        res.json({ message: `${rfcId} 실행 요청이 접수되었습니다 (Mock)`, status: 'ACCEPTED' });
    });

    // ── 인터페이스 이력 Mock ──
    app.get('/sales-api/interface-histories', (req, res) => {
        res.json(apiResponseEmpty());
    });

    // ── 기타 POST/PUT/DELETE — 성공 응답 ──
    app.post('/sales-api/{*rest}', (req, res) => {
        console.log(`[Mock] POST ${req.path}`);
        res.json({ success: true, data: { id: Date.now(), ...req.body }, message: '저장되었습니다 (Mock)' });
    });
    app.put('/sales-api/{*rest}', (req, res) => {
        console.log(`[Mock] PUT ${req.path}`);
        res.json({ success: true, data: { ...req.body }, message: '수정되었습니다 (Mock)' });
    });
    app.delete('/sales-api/{*rest}', (req, res) => {
        console.log(`[Mock] DELETE ${req.path}`);
        res.json({ success: true, message: '삭제되었습니다 (Mock)' });
    });

    // ── 기타 GET — 빈 응답 ──
    app.get('/sales-api/{*rest}', (req, res) => {
        console.log(`[Mock] GET ${req.path} — 빈 응답`);
        res.json(apiResponseEmpty());
    });
}

/* ── SPA 폴백 — index.html ── */
app.get('{*rest}', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

/* ── 서버 시작 ── */
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════╗');
    console.log('║   S&OP 프론트엔드 사전 테스트 서버                    ║');
    console.log('╠═══════════════════════════════════════════════════╣');
    console.log(`║  포트: ${PORT}                                       ║`);
    console.log(`║  모드: ${PROXY_TARGET ? '프록시 → ' + PROXY_TARGET : 'Mock (인증 우회 + 모의 데이터)'}`);
    console.log('║                                                   ║');
    console.log('║  사용법:                                            ║');
    console.log('║  - Mock 모드:   node test-server.js               ║');
    console.log('║  - 프록시 모드: PROXY_TARGET=http://서버IP:8080 \\   ║');
    console.log('║                 node test-server.js               ║');
    console.log('╚═══════════════════════════════════════════════════╝');
    console.log('');
});
