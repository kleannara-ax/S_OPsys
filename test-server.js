/**
 * S&OP 프론트엔드 사전 테스트 서버
 * ─────────────────────────────────────────
 * 모드 1 (스냅샷 — 권장): 운영 서버에서 추출한 실제 데이터로 테스트
 *   1) 운영 사이트 콘솔에서 extract-data.js 실행 → snop-data-export.json 다운로드
 *   2) 해당 파일을 이 폴더에 복사
 *   3) node test-server.js  (자동 감지)
 *
 * 모드 2 (프록시): 운영 서버 API를 직접 프록시
 *   PROXY_TARGET=https://snop.kleannara.com node test-server.js
 *
 * 모드 3 (Mock): 인증 우회 + 임의 데이터로 UI 레이아웃만 테스트
 *   MOCK=1 node test-server.js
 *
 * 데이터 업로드 API:
 *   POST /test-api/upload-snapshot  (JSON body로 직접 업로드)
 *
 * 포트: TEST_PORT 환경변수 또는 기본 3000
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = parseInt(process.env.TEST_PORT || '3000', 10);
const PROXY_TARGET = process.env.PROXY_TARGET || '';
const FORCE_MOCK = process.env.MOCK === '1';
const SNAPSHOT_FILE = path.join(__dirname, 'snop-data-export.json');

/* ── CORS — 운영 사이트 콘솔에서 테스트 서버로 데이터 전송 허용 (최우선 등록) ── */
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.set('Access-Control-Max-Age', '86400');
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

app.use(express.json({ limit: '100mb' }));

/* ── 정적 파일 서빙 (프론트엔드) ── */
app.use(express.static(path.join(__dirname, 'web')));

/* ── 스냅샷 데이터 저장소 ── */
let snapshotData = null;

function loadSnapshot() {
    if (fs.existsSync(SNAPSHOT_FILE)) {
        try {
            const raw = fs.readFileSync(SNAPSHOT_FILE, 'utf8');
            snapshotData = JSON.parse(raw);
            const keys = Object.keys(snapshotData).filter(k => snapshotData[k] !== null);
            console.log(`[스냅샷] ${SNAPSHOT_FILE} 로드 완료 — ${keys.length}개 엔드포인트`);
            keys.forEach(k => {
                const d = snapshotData[k];
                const count = d?.data?.content?.length ?? d?.data?.length ?? '?';
                console.log(`  ├ ${k}: ${count}건`);
            });
            return true;
        } catch (e) {
            console.error(`[스냅샷] ${SNAPSHOT_FILE} 파싱 오류:`, e.message);
            return false;
        }
    }
    return false;
}

/* ── 스냅샷 데이터 업로드 API ── */
app.post('/test-api/upload-snapshot', (req, res) => {
    try {
        snapshotData = req.body;
        fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshotData, null, 2), 'utf8');
        const keys = Object.keys(snapshotData).filter(k => snapshotData[k] !== null);
        console.log(`[스냅샷] 업로드 완료 — ${keys.length}개 엔드포인트`);
        res.json({ success: true, message: `${keys.length}개 데이터셋 저장 완료`, endpoints: keys });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

/* 스냅샷 상태 확인 */
app.get('/test-api/status', (req, res) => {
    const mode = snapshotData ? '스냅샷 (실제 데이터)' : PROXY_TARGET ? '프록시' : 'Mock (임의 데이터)';
    const endpoints = snapshotData ? Object.keys(snapshotData).filter(k => snapshotData[k] !== null) : [];
    res.json({ mode, hasSnapshot: !!snapshotData, endpoints, snapshotFile: SNAPSHOT_FILE });
});

/* ── 프록시 모드 ── */
if (PROXY_TARGET && !FORCE_MOCK) {
    const { createProxyMiddleware } = require('http-proxy-middleware');
    console.log(`[테스트서버] 프록시 모드 — API 요청을 ${PROXY_TARGET}으로 전달합니다.`);

    app.use('/sales-api', createProxyMiddleware({
        target: PROXY_TARGET,
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '',
        onProxyRes(proxyRes) {
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
    /* ── 스냅샷 or Mock 모드 ── */
    const hasSnapshot = loadSnapshot();
    if (hasSnapshot) {
        console.log('[테스트서버] 스냅샷 모드 — 운영 서버 실제 데이터를 사용합니다.');
    } else {
        console.log('[테스트서버] Mock 모드 — 인증 우회 + 임의 데이터를 사용합니다.');
    }

    // ── Users Mock 데이터 (in-memory) ──
    let mockUsers = [
        {
            id: 1, user_id: 'admin', user_name: '관리자', password: 'admin1234',
            email: 'admin@company.com', department: '시스템관리', role: 'ADMIN',
            is_active: true, last_login_at: new Date().toISOString(),
            created_at: '2025-01-01T00:00:00', updated_at: new Date().toISOString(),
        },
        {
            id: 2, user_id: 'planner', user_name: '계획담당자', password: 'plan1234',
            email: 'planner@company.com', department: 'SCM기획', role: 'USER',
            is_active: true, last_login_at: null,
            created_at: '2025-01-01T00:00:00', updated_at: new Date().toISOString(),
        },
    ];
    let mockUserIdSeq = 3;

    // ── 메뉴 권한 Mock 데이터 (파일 영속화) ──
    // { userId: [viewId, viewId, ...] }
    const PERM_FILE = path.join(__dirname, 'mock-menu-permissions.json');
    let mockMenuPermissions = {};
    try {
        if (fs.existsSync(PERM_FILE)) {
            mockMenuPermissions = JSON.parse(fs.readFileSync(PERM_FILE, 'utf8'));
            console.log('[Mock] 메뉴 권한 파일 로드:', Object.keys(mockMenuPermissions).length, '명');
        }
    } catch (e) { /* 무시 */ }

    // ── Auth Mock (항상 인증 통과) ──
    app.post('/sales-api/auth/login', (req, res) => {
        const loginId = req.body?.user_id || req.body?.userId || 'admin';
        const user = mockUsers.find(u => u.user_id === loginId) || mockUsers[0];
        const allowedViews = mockMenuPermissions[user.user_id] || [];
        res.json({
            user_id: user.user_id, user_name: user.user_name,
            role: user.role, authenticated: true,
            allowed_views: allowedViews,
        });
    });
    app.get('/sales-api/auth/me', (req, res) => {
        // 기본 admin으로 응답
        const allowedViews = mockMenuPermissions['admin'] || [];
        res.json({
            user_id: 'admin', user_name: '관리자',
            role: 'ADMIN', authenticated: true,
            allowed_views: allowedViews,
        });
    });
    app.post('/sales-api/auth/logout', (req, res) => {
        res.json({ success: true });
    });

    // ── Users CRUD Mock ──
    app.get('/sales-api/users', (req, res) => {
        res.json({ success: true, data: mockUsers });
    });
    app.get('/sales-api/users/:id', (req, res) => {
        const user = mockUsers.find(u => u.id === parseInt(req.params.id));
        if (user) return res.json({ success: true, data: user });
        res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    });
    app.post('/sales-api/users', (req, res) => {
        const newUser = { id: mockUserIdSeq++, ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        mockUsers.push(newUser);
        res.status(201).json({ success: true, data: newUser, message: '사용자 등록 완료' });
    });
    app.put('/sales-api/users/:id', (req, res) => {
        const idx = mockUsers.findIndex(u => u.id === parseInt(req.params.id));
        if (idx >= 0) {
            mockUsers[idx] = { ...mockUsers[idx], ...req.body, updated_at: new Date().toISOString() };
            return res.json({ success: true, data: mockUsers[idx], message: '사용자 수정 완료' });
        }
        res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    });
    app.delete('/sales-api/users/:id', (req, res) => {
        mockUsers = mockUsers.filter(u => u.id !== parseInt(req.params.id));
        res.json({ success: true, message: '삭제되었습니다.' });
    });
    app.patch('/sales-api/users/:id/reset-password', (req, res) => {
        const user = mockUsers.find(u => u.id === parseInt(req.params.id));
        if (user) user.password = req.body?.password || 'password1234';
        res.json({ success: true, message: '비밀번호가 초기화되었습니다.' });
    });

    // ── 메뉴 권한 API Mock ──
    app.get('/sales-api/user-menu-permissions', (req, res) => {
        // 전체 권한 목록 반환
        const all = [];
        Object.entries(mockMenuPermissions).forEach(([userId, views]) => {
            views.forEach(viewId => all.push({ user_id: userId, view_id: viewId, allowed: true }));
        });
        res.json({ success: true, data: all });
    });
    app.get('/sales-api/user-menu-permissions/:userId', (req, res) => {
        const views = mockMenuPermissions[req.params.userId] || [];
        const perms = views.map(v => ({ user_id: req.params.userId, view_id: v, allowed: true }));
        res.json({ success: true, data: perms });
    });
    app.put('/sales-api/user-menu-permissions/:userId', (req, res) => {
        const views = req.body?.views || [];
        mockMenuPermissions[req.params.userId] = views;
        try { fs.writeFileSync(PERM_FILE, JSON.stringify(mockMenuPermissions, null, 2), 'utf8'); } catch (e) { /* 무시 */ }
        console.log(`[Mock] 메뉴 권한 저장: ${req.params.userId} → [${views.join(', ')}]`);
        res.json({ success: true, message: '메뉴 권한이 저장되었습니다.' });
    });

    // ── 공통 ApiResponse 래퍼 ──
    function apiResponse(content = [], page = 0, size = 500) {
        return {
            success: true,
            data: {
                content,
                total_pages: Math.ceil(content.length / size) || 1,
                total_elements: content.length,
                last: true,
                number: page,
                size,
            },
        };
    }
    function apiResponseEmpty() {
        return { success: true, data: { content: [], total_pages: 0, total_elements: 0, last: true, number: 0, size: 500 } };
    }

    // ── 엔드포인트 ↔ 스냅샷 키 매핑 ──
    const endpointKeyMap = {
        'snop-records': 'snopRecords',
        'material-linkages': 'materialLinkages',
        'renewal-material-linkages': 'renewalMaterialLinkages',
        'sales-plan-uploads': 'salesPlanUploads',
        'sales-channels': 'salesChannels',
        'line-capa-plans': 'lineCapaPlans',
        'line-item-masters': 'lineItemMasters',
        'optimal-inventory-baselines': 'optimalInventoryBaselines',
        'recent-sales-averages': 'recentSalesAverages',
        'base-material-masters': 'baseMaterialMasters',
        'monthly-closings': 'monthlyClosings',
        'interface-histories': 'interfaceHistories',
        'plant-storage': 'plantStorageLocations',
        'sales-plan-upload-logs': 'salesPlanUploadLogs',
        'production-change-logs': 'productionChangeLogs',
        'sales-plan-upload-history': 'salesPlanUploadHistory',
        'interface-executions': 'interfaceExecutions',
        'interface-masters': 'interfaceMasters',
    };

    // ── 스냅샷 데이터 서빙 (동적) ──
    function serveSnapshotOrMock(endpoint, req, res, mockFallback) {
        const key = endpointKeyMap[endpoint];
        if (snapshotData && key && snapshotData[key]) {
            // 스냅샷 데이터를 그대로 반환 (서버 원본 응답 형식 유지)
            const data = snapshotData[key];

            // 페이지네이션 지원: snop-records 등
            if (req.query.page !== undefined && data?.data?.content) {
                const page = parseInt(req.query.page || '0', 10);
                const size = parseInt(req.query.size || '500', 10);
                const allContent = data.data.content;
                const start = page * size;
                const slice = allContent.slice(start, start + size);
                return res.json({
                    success: true,
                    data: {
                        content: slice,
                        total_pages: Math.ceil(allContent.length / size),
                        total_elements: allContent.length,
                        last: start + size >= allContent.length,
                        number: page,
                        size,
                    },
                });
            }
            return res.json(data);
        }
        // 스냅샷에 없으면 Mock 폴백
        if (mockFallback) {
            return mockFallback(req, res);
        }
        return res.json(apiResponseEmpty());
    }

    // ── 모든 GET /sales-api/* 엔드포인트 등록 ──
    const allEndpoints = Object.keys(endpointKeyMap);
    allEndpoints.forEach(ep => {
        app.get(`/sales-api/${ep}`, (req, res) => {
            serveSnapshotOrMock(ep, req, res);
        });
    });

    // ── Mock 랜덤 데이터 (스냅샷 없을 때 fallback) ──
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
                item_code: code, item_name: `자재-${code}`,
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

    // ── RFC 수동실행 Mock ──
    app.post('/sales-api/rfc-interface/execute/:rfcId', (req, res) => {
        console.log(`[Mock] RFC 수동실행 요청: ${req.params.rfcId}`);
        res.json({ success: true, data: { message: `${req.params.rfcId} 실행 요청 접수 (테스트)`, status: 'ACCEPTED' } });
    });
    app.post('/sales-api/interface-histories/manual-execute/:ifId', (req, res) => {
        console.log(`[Mock] 수동실행: ${req.params.ifId}`);
        res.json({ success: true, data: { status: 'SUCCESS', processed_count: 1 } });
    });

    // ── 기타 POST/PUT/DELETE — 성공 응답 ──
    app.post('/sales-api/{*rest}', (req, res) => {
        console.log(`[Mock] POST ${req.path}`);
        res.json({ success: true, data: { id: Date.now(), ...req.body }, message: '저장되었습니다 (테스트)' });
    });
    app.put('/sales-api/{*rest}', (req, res) => {
        console.log(`[Mock] PUT ${req.path}`);
        res.json({ success: true, data: { ...req.body }, message: '수정되었습니다 (테스트)' });
    });
    app.delete('/sales-api/{*rest}', (req, res) => {
        console.log(`[Mock] DELETE ${req.path}`);
        res.json({ success: true, message: '삭제되었습니다 (테스트)' });
    });

    // ── 기타 GET — 빈 응답 ──
    app.get('/sales-api/{*rest}', (req, res) => {
        console.log(`[Mock] GET ${req.path}`);
        res.json(apiResponseEmpty());
    });
}

/* ── SPA 폴백 ── */
app.get('{*rest}', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

/* ── 서버 시작 ── */
app.listen(PORT, '0.0.0.0', () => {
    const mode = snapshotData ? '스냅샷 (실제 운영 데이터)'
        : PROXY_TARGET ? `프록시 → ${PROXY_TARGET}`
        : 'Mock (임의 데이터)';
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║   S&OP 프론트엔드 사전 테스트 서버                        ║');
    console.log('╠═══════════════════════════════════════════════════════╣');
    console.log(`║  포트: ${PORT}`);
    console.log(`║  모드: ${mode}`);
    console.log('║                                                       ║');
    console.log('║  실제 데이터 사용법:                                     ║');
    console.log('║  1. 운영 사이트(snop.kleannara.com)에 로그인             ║');
    console.log('║  2. F12 → Console에 extract-data.js 내용 붙여넣기       ║');
    console.log('║  3. 다운로드된 snop-data-export.json을 이 폴더에 복사     ║');
    console.log('║  4. 서버 재시작: node test-server.js                    ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log('');
});
