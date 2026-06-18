'use strict';

const DEFAULT_LINES = ['라인 1', '라인 2'];
const BULK_REQUIRED_FIELDS = [
    'item_code',
    'item_name',
    'category',
    'production_line',
    'month',
    'production_plan',
    'beginning_inventory',
    'target_ending_inventory',
];
const BULK_COLUMN_MAP = {
    item_code: 'item_code',
    'item code': 'item_code',
    '자재코드': 'item_code',
    item_name: 'item_name',
    'item name': 'item_name',
    '자재명': 'item_name',
    category: 'category',
    'category': 'category',
    'item category': 'category',
    'item_category': 'category',
    '카테고리': 'category',
    production_line: 'production_line',
    'production line': 'production_line',
    '생산라인': 'production_line',
    month: 'month',
    'plan_month': 'month',
    '계획월': 'month',
    sales_plan: 'sales_plan',
    'sales plan': 'sales_plan',
    '판매계획': 'sales_plan',
    '판매 계획': 'sales_plan',
    sales_actual: 'sales_actual',
    'sales actual': 'sales_actual',
    'sales performance': 'sales_actual',
    '판매실적': 'sales_actual',
    '판매 실적': 'sales_actual',
    production_plan: 'production_plan',
    'production plan': 'production_plan',
    '생산계획': 'production_plan',
    production_actual: 'production_actual',
    'production actual': 'production_actual',
    'actual production': 'production_actual',
    '생산실적': 'production_actual',
    production_remaining: 'production_remaining',
    'production remaining': 'production_remaining',
    'remaining production': 'production_remaining',
    '잔여생산': 'production_remaining',
    beginning_inventory: 'beginning_inventory',
    'beginning inventory': 'beginning_inventory',
    '가용재고': 'beginning_inventory',
    available_inventory: 'available_inventory',
    'available inventory': 'available_inventory',
    '현재고': 'available_inventory',
    target_ending_inventory: 'target_ending_inventory',
    'target ending inventory': 'target_ending_inventory',
    '목표월말재고': 'target_ending_inventory',
    optimal_inventory_2025: 'optimal_inventory_2025',
    'optimal inventory 2025': 'optimal_inventory_2025',
    '2025 optimal inventory': 'optimal_inventory_2025',
    '2025년 적정재고': 'optimal_inventory_2025',
    '2025년적정재고': 'optimal_inventory_2025',
    capacity_limit: 'capacity_limit',
    'capacity limit': 'capacity_limit',
    '라인 capa': 'capacity_limit',
    'capa': 'capacity_limit',
    notes: 'notes',
    memo: 'notes',
    비고: 'notes',
};

const BULK_TARGETS = {
    PRODUCTION: 'production',
    LINE_CAPA: 'line-capa',
    LINE_MASTER: 'line-master',
    RECENT_SALES: 'recent-sales',
};

const LINE_CAPA_BULK_REQUIRED_FIELDS = [
    'production_line',
    'month',
    'daily_capa',
    'daily_operating_hours',
    'planned_operating_days',
];

const LINE_CAPA_COLUMN_MAP = {
    line_category: 'line_category',
    'line category': 'line_category',
    category: 'line_category',
    '카테고리': 'line_category',
    '라인카테고리': 'line_category',
    production_line: 'production_line',
    'production line': 'production_line',
    line: 'production_line',
    '생산라인': 'production_line',
    month: 'month',
    plan_month: 'month',
    'plan month': 'month',
    '계획월': 'month',
    'month(yyyy-mm)': 'month',
    daily_capa: 'daily_capa',
    'daily capa': 'daily_capa',
    hourly_capa: 'daily_capa',
    'hourly capa': 'daily_capa',
    '시간당 capa': 'daily_capa',
    daily_operating_hours: 'daily_operating_hours',
    'daily operating hours': 'daily_operating_hours',
    operating_hours: 'daily_operating_hours',
    'operating hours': 'daily_operating_hours',
    '일 가동 시간': 'daily_operating_hours',
    planned_operating_days: 'planned_operating_days',
    'planned operating days': 'planned_operating_days',
    operating_days: 'planned_operating_days',
    'operating days': 'planned_operating_days',
    '월 가동 일수': 'planned_operating_days',
    computed_capa: 'computed_capa',
    'computed capa': 'computed_capa',
    '월 총 capa': 'computed_capa',
    note: 'note',
    memo: 'note',
    비고: 'note',
};

const LINE_MASTER_BULK_REQUIRED_FIELDS = [
    'item_code',
    'production_line',
    'hourly_throughput',
];

const LINE_MASTER_COLUMN_MAP = {
    item_code: 'item_code',
    'item code': 'item_code',
    '자재코드': 'item_code',
    production_line: 'production_line',
    'production line': 'production_line',
    line: 'production_line',
    '생산라인': 'production_line',
    hourly_throughput: 'hourly_throughput',
    'hourly throughput': 'hourly_throughput',
    throughput: 'hourly_throughput',
    '시간당 생산 수량': 'hourly_throughput',
    hourly_capacity: 'hourly_throughput',
};

const RECENT_SALES_REQUIRED_FIELDS = ['item_code', 'm3', 'm2', 'm1'];

const RECENT_SALES_COLUMN_MAP = {
    item_code: 'item_code',
    'item code': 'item_code',
    '자재코드': 'item_code',
    m3: 'm3',
    '-3월': 'm3',
    '3개월전': 'm3',
    'three months ago': 'm3',
    m2: 'm2',
    '-2월': 'm2',
    '2개월전': 'm2',
    'two months ago': 'm2',
    m1: 'm1',
    '-1월': 'm1',
    '1개월전': 'm1',
    'one month ago': 'm1',
};

const SALES_UPLOAD_REQUIRED_FIELDS = ['month', 'item_code', 'channel'];

const SALES_UPLOAD_COLUMN_MAP = {
    month: 'month',
    plan_month: 'month',
    '등록월': 'month',
    'month(yyyy-mm)': 'month',
    '계획월': 'month',
    item_code: 'item_code',
    'item code': 'item_code',
    '자재코드': 'item_code',
    channel: 'channel',
    sales_channel: 'channel',
    '판매채널': 'channel',
    '채널': 'channel',
    customer: 'channel',
    '고객': 'channel',
    quantity: 'quantity',
    qty: 'quantity',
    '총수량': 'quantity',
    '총합': 'quantity',
    '수량': 'quantity',
    '수량(ea)': 'quantity',
    '판매수량': 'quantity',
    standard_quantity: 'standard_quantity',
    'standard_quantity(box)': 'standard_quantity',
    'standard quantity': 'standard_quantity',
    'standard_qty': 'standard_quantity',
    'standard qty': 'standard_quantity',
    '스탠다드수량': 'standard_quantity',
    '스탠다드수량(box)': 'standard_quantity',
    '기본수량': 'standard_quantity',
    promotion_quantity: 'promotion_quantity',
    'promotion_quantity(box)': 'promotion_quantity',
    'promotion quantity': 'promotion_quantity',
    'promotion_qty': 'promotion_quantity',
    'promotion qty': 'promotion_quantity',
    '프로모션수량': 'promotion_quantity',
    '프로모션수량(box)': 'promotion_quantity',
    '행사수량': 'promotion_quantity',
    note: 'note',
    memo: 'note',
    비고: 'note',
};

/* OEM 협력업체/MOQ 일괄 업로드 */
const OEM_VENDOR_MOQ_REQUIRED_FIELDS = ['item_code'];

const OEM_VENDOR_MOQ_COLUMN_MAP = {
    item_code: 'item_code',
    'item code': 'item_code',
    '자재코드': 'item_code',
    vendor_name: 'vendor_name',
    'vendor name': 'vendor_name',
    '협력업체명': 'vendor_name',
    '협력업체': 'vendor_name',
    '업체명': 'vendor_name',
    moq: 'moq',
    'moq(box)': 'moq',
    '최소주문수량': 'moq',
    'min order qty': 'moq',
    'minimum order quantity': 'moq',
};

function deriveCategoryFromItemName(itemName) {
    const name = sanitizeText(itemName).trim();
    if (!name) return '';

    if (name.startsWith('깨끗한나라')) {
        return 'RT';
    }

    const normalized = name.replace(/\s+/g, '').toLowerCase();
    if (normalized.includes('컨트롤러')) {
        return '컨트롤러';
    }
    if (normalized.includes('파워모듈')) {
        return '파워';
    }
    if (normalized.includes('배터리모듈')) {
        return '배터리';
    }

    return '';
}

function deriveCategoryName(itemName, currentCategory = '') {
    const sanitizedCategory = sanitizeText(currentCategory).trim();
    if (sanitizedCategory) {
        return sanitizedCategory;
    }
    const derived = deriveCategoryFromItemName(itemName);
    if (derived) {
        return derived;
    }
    return '';
}

function getProjectedKey(itemCode, month) {
    return `${sanitizeText(itemCode).trim()}__${sanitizeText(month).trim()}`;
}

function getOptimalBaselineKey(year, category) {
    const normalizedYear = sanitizeText(year).trim();
    const normalizedCategory = sanitizeText(category).trim().toLowerCase();
    return `${normalizedYear}__${normalizedCategory}`;
}

const OPTIMAL_INVENTORY_DEFAULT_YEAR = String(new Date().getFullYear());

const state = {
    rawData: [],
    enrichedData: [],
    filteredData: [],
    salesUploads: [],
    salesUploadHistory: [],
    salesAggregates: {
        byKey: new Map(),
        list: [],
    },
    activeSalesAggregateKey: '',
    salesChannels: [],
    salesChannelIndex: new Map(),
    salesUploadIndex: new Map(),
    salesUploadLogs: [],
    salesUploadLogIndex: new Map(),
    salesUploadLogNameIndex: new Map(),
    materialLinkages: [],
    renewalMaterialLinkages: [],
    materialLinkageResolver: null,
    itemCanonicalMap: new Map(),
    materialCanonicalNameIndex: new Map(),
    materialRenewalForm: {
        editingId: null,
    },
    selectedRecordId: null,
    chart: null,
    lineCapaChart: null,
    lineCapaUsageCharts: [],
    lineCapaUsageSummaryChart: null,
    lineCapaUsageFilters: {
        month: 'all',
        category: 'all',
        line: 'all',
        manualMonth: false,
    },
    projectedOverrides: new Map(),
    adjustedPlanOverrides: new Map(),
    lineCapaActiveKey: null,
    lineCapaSelectedLineKey: null,
    activeView: 'summary',
    dashboardAccuracyMode: 'cumulative',
    inventoryAccuracyCharts: {
        sales: null,
        production: null,
    },
    inventoryExpandedCategories: new Set(),
    analyticsRiskRecords: [],
    analyticsExpandedItems: new Set(),
    changeHistoryRecords: [],
    changeHistoryActiveTab: 'production',
    pendingProductionChanges: new Map(),
    activeProductType: 'all',
    originalProductionPlans: new Map(),
    productionActualFallbacks: new Map(),
    lineDowntimePlans: [],
    lineDowntimeIndex: new Map(),
    lineItemMasters: [],
    lineItemMasterIndex: new Map(),
    lineCapaFilters: {
        month: 'all',
        line: 'all',
    },
    lineItemMasterFilters: {
        line: 'all',
    },
    optimalInventoryChart: null,
    optimalInventoryFilters: {
        year: OPTIMAL_INVENTORY_DEFAULT_YEAR,
        aggregationMode: 'all',
    },
    optimalInventoryMonths: [],
    optimalInventoryBaselines: [],
    optimalInventoryBaselineIndex: new Map(),
    optimalInventoryBaselineById: new Map(),
    optimalBaselineForm: {
        editingId: null,
    },
    bulkUploadTarget: BULK_TARGETS.PRODUCTION,
    recentSalesRecords: [],
    recentSalesIndex: new Map(),
    baseMaterialMasters: [],
    baseMaterialMasterFilters: { scm: 'all' },
    monthlyClosings: [],
    monthlyClosingIndex: new Map(),
    /** 생산계획 현황 테이블 준비 상태 — 첫 로드 시 false, 필터 조작 후 true */
    planTableReady: false,
    /** 멀티탭 — 열린 탭 목록 (viewId 배열, 순서 = 탭 순서) */
    openTabs: ['summary'],
};

/** 뷰 ID → 탭 표시 라벨 매핑 */
const VIEW_LABEL_MAP = {
    'summary': '통합 계획 요약',
    'planner': '기준정보 관리',
    'sales-upload': '판매계획 업로드',
    'table': '생산계획 현황',
    'line-capa': '생산 CAPA 현황',
    'inventory': '계획 대비 실적 현황',
    'analytics': '재고 분석 대시보드',
    'optimal-inventory': '적정재고관리',
    'change-history': '변경 이력 관리',
    'interface-master': '인터페이스 관리',
    'user-mgmt': '사용자 관리',
};

/** 멀티탭 최대 개수 */
const MAX_OPEN_TABS = 7;

const LINE_CAPA_USAGE_COLORS = [
    '#2563eb',
    '#7c3aed',
    '#0ea5e9',
    '#14b8a6',
    '#22c55e',
    '#f97316',
    '#dc2626',
    '#6366f1',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#d946ef',
    '#3b82f6',
    '#fb7185',
    '#a3e635',
];

const OPTIMAL_INVENTORY_MIN_MONTH = '2025-01';

const PROJECTED_MONTH_EXTENSION = 12;
const CHANGE_TYPE_THRESHOLD_MS = 1000;
const PLAN_TABLE_SCROLL_STEP = 320;

/* ── 제외 카테고리 (원단 / 미지정) ── */
const EXCLUDED_CATEGORIES = new Set(['', '원단']);
const isExcludedCategory = (cat) => EXCLUDED_CATEGORIES.has((cat ?? '').trim());

/* ── CAPA 사용률 대상 생산라인 화이트리스트 ── */
const CAPA_TARGET_LINES = new Set([
    '가공 3호기 (1,2겹)',
    '가공 3호기 (3겹)',
    '가공 4호기',
    '가공 5호기 (3겹)',
    '가공 6호기 (1,2겹)',
    '가공 6호기 (3겹)',
    '생리대 5호기',
    '생리대 6호기',
]);
const isCapaTargetLine = (line) => CAPA_TARGET_LINES.has((line ?? '').trim());

/* ── localStorage 키 ── */
const LS_KEY_ADJUSTED_OVERRIDES = 'snop_adjusted_plan_overrides';
const LS_KEY_CHANGE_HISTORY = 'snop_change_history_local';

/** localStorage에 보정 생산계획 override 저장 */
function persistAdjustedOverrides() {
    try {
        const entries = Array.from(state.adjustedPlanOverrides.entries());
        localStorage.setItem(LS_KEY_ADJUSTED_OVERRIDES, JSON.stringify(entries));
    } catch (e) { /* quota 초과 등 무시 */ }
}

/** localStorage에서 보정 생산계획 override 복원 */
function restoreAdjustedOverrides() {
    try {
        const raw = localStorage.getItem(LS_KEY_ADJUSTED_OVERRIDES);
        if (!raw) return;
        const entries = JSON.parse(raw);
        if (Array.isArray(entries)) {
            entries.forEach(([key, value]) => {
                if (key && Number.isFinite(value)) {
                    state.adjustedPlanOverrides.set(key, value);
                }
            });
        }
    } catch (e) { /* 파싱 실패 무시 */ }
}

/** localStorage에 로컬 변경이력 저장 */
function persistLocalChangeHistory() {
    try {
        const localRecords = (state.changeHistoryRecords || []).filter(
            (r) => r && typeof r.id === 'string' && r.id.startsWith('local_')
        );
        localStorage.setItem(LS_KEY_CHANGE_HISTORY, JSON.stringify(localRecords));
    } catch (e) { /* quota 초과 등 무시 */ }
}

/** localStorage에서 로컬 변경이력 복원 */
function restoreLocalChangeHistory() {
    try {
        const raw = localStorage.getItem(LS_KEY_CHANGE_HISTORY);
        if (!raw) return;
        const records = JSON.parse(raw);
        if (Array.isArray(records) && records.length > 0) {
            const normalized = records
                .map((r) => normalizeProductionChangeLog(r))
                .filter((r) => r !== null);
            if (normalized.length > 0) {
                state.changeHistoryRecords = [
                    ...normalized,
                    ...state.changeHistoryRecords,
                ];
                /* 중복 제거 (id 기준) */
                const seen = new Set();
                state.changeHistoryRecords = state.changeHistoryRecords.filter((r) => {
                    if (seen.has(r.id)) return false;
                    seen.add(r.id);
                    return true;
                });
            }
        }
    } catch (e) { /* 파싱 실패 무시 */ }
}

// DOM 요소 캐시
const dom = {
    tableBody: document.querySelector('#plan-table tbody'),
    rowTemplate: document.querySelector('#row-template'),
    planTableScroll: {
        container: document.querySelector('#view-table .table-scroll-container'),
        wrapper: document.querySelector('#view-table [data-scroll-wrapper]'),
        leftButton: document.querySelector('#view-table .table-scroll-left'),
        rightButton: document.querySelector('#view-table .table-scroll-right'),
    },
    form: document.querySelector('#plan-form'),
    recordId: document.querySelector('#record-id'),
    itemCode: document.querySelector('#item-code'),
    itemName: document.querySelector('#item-name'),
    category: document.querySelector('#category'),
    productionLine: document.querySelector('#production-line'),
    salesActual: document.querySelector('#sales-actual'),
    planMonth: document.querySelector('#plan-month'),
    salesPlanHidden: document.querySelector('#sales-plan'),
    salesPlanField: document.querySelector('#sales-plan-field'),
    salesPlanDisplay: document.querySelector('#sales-plan-display'),
    productionPlan: document.querySelector('#production-plan'),
    beginningInventory: document.querySelector('#beginning-inventory'),
    targetEndingInventory: document.querySelector('#target-ending-inventory'),
    capacityLimit: document.querySelector('#capacity-limit'),
    capacityLimitField: document.querySelector('#capacity-limit-field'),
    capacityLimitDisplay: document.querySelector('#capacity-limit-display'),
    capacityLimitHint: document.querySelector('#capacity-autofill-hint'),
    notes: document.querySelector('#notes'),
    btnSave: document.querySelector('#btn-save'),
    btnReset: document.querySelector('#btn-reset'),
    materialRenewal: {
        form: document.querySelector('#material-renewal-form'),
        recordId: document.querySelector('#material-renewal-record-id'),
        legacyCode: document.querySelector('#legacy-item-code'),
        legacyName: document.querySelector('#legacy-item-name'),
        renewalCode: document.querySelector('#renewal-item-code'),
        renewalName: document.querySelector('#renewal-item-name'),
        effectiveMonth: document.querySelector('#renewal-effective-month'),
        note: document.querySelector('#renewal-note'),
        saveButton: document.querySelector('#btn-material-renewal-save'),
        resetButton: document.querySelector('#btn-material-renewal-reset'),
        tableBody: document.querySelector('#material-renewal-table tbody'),
        empty: document.querySelector('#material-renewal-empty'),
        datalist: document.querySelector('#material-code-options'),
    },
    btnExportXlsx: document.querySelector('#btn-export-xlsx'),
    lineDatalist: document.querySelector('#line-options'),
    bulk: {
        open: document.querySelector('#btn-open-bulk-upload'),
        openLineCapa: document.querySelector('#btn-open-line-capa-bulk-upload'),
        openLineMaster: document.querySelector('#btn-open-line-master-bulk-upload'),
        modal: document.querySelector('#bulk-upload-modal'),
        close: document.querySelector('#btn-close-bulk-upload'),
        backdrop: document.querySelector('#bulk-upload-modal .modal-backdrop'),
        fileInput: document.querySelector('#bulk-file-input'),
        startButton: document.querySelector('#btn-start-bulk-upload'),
        status: document.querySelector('#bulk-upload-status'),
        tabs: Array.from(document.querySelectorAll('.bulk-target-tab')),
        panels: Array.from(document.querySelectorAll('.bulk-panel')),
        templateButtons: Array.from(document.querySelectorAll('[data-bulk-template]')),
    },
    targetInventoryUpload: {
        openButton: document.querySelector('#btn-open-target-inventory-upload'),
        modal: document.querySelector('#target-inventory-upload-modal'),
        closeButton: document.querySelector('#btn-close-target-inventory-upload'),
        backdrop: document.querySelector('#target-inventory-upload-modal [data-close-target-inv-modal]'),
        templateButton: document.querySelector('#btn-target-inventory-template'),
        fileInput: document.querySelector('#target-inventory-file-input'),
        startButton: document.querySelector('#btn-start-target-inventory-upload'),
        status: document.querySelector('#target-inventory-upload-status'),
    },
    recentSalesUpload: {
        section: document.querySelector('.recent-sales-upload'),
        baseMonth: document.querySelector('#recent-sales-base-month'),
        fileInput: document.querySelector('#recent-sales-file-input'),
        uploadButton: document.querySelector('#btn-recent-sales-upload-start'),
        templateButton: document.querySelector('#btn-recent-sales-template'),
        status: document.querySelector('#recent-sales-upload-status'),
    },
    filters: {
        item: document.querySelector('#filter-item'),
        itemInput: document.querySelector('#filter-item-input'),
        itemList: document.querySelector('#filter-item-list'),
        itemDropdown: document.querySelector('#filter-item-dropdown'),
        category: null, // replaced by multi-select dropdown
        categoryDropdown: document.querySelector('#filter-category-dropdown'),
        categoryToggle: document.querySelector('#filter-category-toggle'),
        categoryMenu: document.querySelector('#filter-category-menu'),
        categoryOptions: document.querySelector('#filter-category-options'),
        categoryAllCheckbox: document.querySelector('#filter-category-menu .multi-select-option-all input'),
        month: document.querySelector('#filter-month'),
        line: document.querySelector('#filter-line'),
        inventoryStatus: document.querySelector('#filter-inventory-status'),
        capaStatus: document.querySelector('#filter-capa-status'),
        apply: document.querySelector('#btn-apply-filters'),
        clear: document.querySelector('#btn-clear-filters'),
    },
    bulkConfirmButton: document.querySelector('#btn-confirm-production-changes'),
    bulkConfirmNote: document.querySelector('#bulk-confirm-note'),
    summary: {
        monthContext: document.querySelector('#summary-month-context'),
        inventoryAlert: document.querySelector('#summary-inventory-alert'),
        inventoryShortageBreakdown: document.querySelector('#summary-inventory-shortage-breakdown'),
        inventoryOverstockBreakdown: document.querySelector('#summary-inventory-overstock-breakdown'),
        overstock: document.querySelector('#summary-overstock'),
        capaAlert: document.querySelector('#summary-capa-alert'),
        capaBreakdown: document.querySelector('#summary-capa-breakdown'),
        totalProduction: document.querySelector('#summary-total-production'),
        totalProductionBreakdown: document.querySelector('#summary-total-production-breakdown'),
        avgCapa: document.querySelector('#summary-avg-capa'),
        avgCapaBreakdown: document.querySelector('#summary-avg-capa-breakdown'),
        salesAccuracy: document.querySelector('#summary-sales-accuracy'),
        salesAccuracyCaption: document.querySelector('#summary-sales-accuracy-caption'),
        salesAccuracyBreakdown: document.querySelector('#summary-sales-accuracy-breakdown'),
        productionAccuracy: document.querySelector('#summary-production-accuracy'),
        productionAccuracyCaption: document.querySelector('#summary-production-accuracy-caption'),
        productionAccuracyBreakdown: document.querySelector('#summary-production-accuracy-breakdown'),
    },
    chartSelect: document.querySelector('#chart-item-select'),
    chartCanvas: document.querySelector('#plan-chart'),
    analytics: {
        riskTable: document.querySelector('#inventory-risk-table'),
        riskTableBody: document.querySelector('#inventory-risk-table tbody'),
        riskTableEmpty: document.querySelector('#inventory-risk-empty'),
        monthFilter: document.querySelector('#analytics-month-filter'),
    },
    lineCapa: {
        usagePanel: document.querySelector('#line-capa-usage-panel'),
        usageContext: document.querySelector('#line-capa-usage-context'),
        usageChartContainer: document.querySelector('.line-capa-usage-chart'),
        usageChartCanvas: document.querySelector('#line-capa-usage-chart'),
        usageChartWrapper: document.querySelector('.line-capa-usage-chart-container'),
        usageChartTitle: document.querySelector('#line-capa-usage-chart-title'),
        usageChartEmpty: document.querySelector('#line-capa-usage-chart-empty'),
        usageLegend: document.querySelector('#line-capa-usage-legend'),
        usageLegendList: document.querySelector('#line-capa-usage-legend-list'),
        usageLegendHint: document.querySelector('#line-capa-usage-legend-hint'),
        usageSummarySection: document.querySelector('.line-capa-usage-summary'),
        usageSummaryContext: document.querySelector('#line-capa-usage-summary-context'),
        usageSummaryChartContainer: document.querySelector('.line-capa-usage-summary-chart'),
        usageSummaryCanvas: document.querySelector('#line-capa-usage-summary-chart'),
        usageSummaryEmpty: document.querySelector('#line-capa-usage-summary-empty'),
        usageFilterMonth: document.querySelector('#line-capa-usage-filter-month'),
        usageFilterCategory: document.querySelector('#line-capa-usage-filter-category'),
        usageFilterLine: document.querySelector('#line-capa-usage-filter-line'),
        usageEmpty: document.querySelector('#line-capa-usage-empty'),
        trendSection: document.querySelector('#line-capa-usage-trend'),
        chartContainer: document.querySelector('.line-capa-chart'),
        canvas: document.querySelector('#line-capa-chart'),
        empty: document.querySelector('#line-capa-empty'),
        cardsWrapper: document.querySelector('#line-capa-cards-wrapper'),
        cards: document.querySelector('#line-capa-cards'),
        placeholder: document.querySelector('#line-capa-chart-prompt'),
    },
    dashboard: {
        baseMonth: document.querySelector('#dashboard-base-month'),
        accuracyMode: document.querySelector('#dashboard-accuracy-mode'),
        forecastTable: document.querySelector('#inventory-forecast-table tbody'),
        forecastEmpty: document.querySelector('#inventory-forecast-empty'),
        forecastMonthHeaders: [
            document.querySelector('#forecast-month-0'),
            document.querySelector('#forecast-month-1'),
            document.querySelector('#forecast-month-2'),
        ],
        accuracySummaryTable: document.querySelector('#inventory-accuracy-summary-table tbody'),
        accuracySummaryEmpty: document.querySelector('#inventory-accuracy-summary-empty'),
        accuracySummaryHeadMain: document.querySelector('#inventory-accuracy-summary-head-main'),
        accuracySummaryHeadSub: document.querySelector('#inventory-accuracy-summary-head-sub'),
        accuracySummaryDescription: document.querySelector('#inventory-accuracy-summary-description'),
        accuracySummaryCharts: document.querySelector('#inventory-accuracy-summary-charts'),
        accuracySummaryChartEmpty: document.querySelector('#inventory-accuracy-summary-chart-empty'),
        accuracySummarySalesCanvas: document.querySelector('#inventory-accuracy-sales-chart'),
        accuracySummaryProductionCanvas: document.querySelector('#inventory-accuracy-production-chart'),
    },
    optimalInventory: {
        section: document.querySelector('#view-optimal-inventory'),
        yearSelect: document.querySelector('#optimal-year'),
        aggregationModeSelect: document.querySelector('#optimal-aggregation-mode'),
        headerRow: document.querySelector('#optimal-summary-header'),
        subHeaderRow: document.querySelector('#optimal-summary-subheader'),
        body: document.querySelector('#optimal-summary-body'),
        totalRow: document.querySelector('#optimal-summary-total'),
        table: document.querySelector('#optimal-summary-table'),
        empty: document.querySelector('#optimal-empty'),
        highlightLegend: document.querySelector('#optimal-highlight-legend'),
        highlightLegendText: document.querySelector('#optimal-highlight-text'),
        chartCanvas: document.querySelector('#optimal-chart'),
        chartContainer: document.querySelector('.optimal-chart-container'),
        baselineHeader: document.querySelector('#optimal-baseline-header'),
        baselineForm: document.querySelector('#optimal-baseline-form'),
        baselineId: document.querySelector('#optimal-baseline-id'),
        baselineYear: document.querySelector('#optimal-baseline-year'),
        baselineCategory: document.querySelector('#optimal-baseline-category'),
        baselineQuantity: document.querySelector('#optimal-baseline-quantity'),
        baselineNotes: document.querySelector('#optimal-baseline-notes'),
        baselineSubmit: document.querySelector('#optimal-baseline-submit'),
        baselineUpdate: document.querySelector('#optimal-baseline-update'),
        baselineReset: document.querySelector('#optimal-baseline-reset'),
        baselineDelete: document.querySelector('#optimal-baseline-delete'),
        baselineModeIndicator: document.querySelector('#optimal-baseline-mode-indicator'),
        baselineTable: document.querySelector('#optimal-baseline-table'),
        baselineTableHeaderRow: document.querySelector('#optimal-baseline-table-header'),
        baselineTableSubheaderRow: document.querySelector('#optimal-baseline-table-subheader'),
        baselineTableBody: document.querySelector('#optimal-baseline-table tbody'),
        baselineEmpty: document.querySelector('#optimal-baseline-empty'),
        baselineCategoryOptions: document.querySelector('#optimal-baseline-category-options'),
        baselineManager: document.querySelector('#optimal-baseline-manager'),
    },
    lineDowntime: {
        section: document.querySelector('.line-capa-maintenance'),
        form: document.querySelector('#line-capa-form'),
        recordId: document.querySelector('#line-capa-record-id'),
        month: document.querySelector('#line-capa-month'),
        line: document.querySelector('#line-capa-line'),
        categoryDatalist: document.querySelector('#line-category-options'),
        daily: document.querySelector('#line-capa-daily'),
        dailyHours: document.querySelector('#line-capa-daily-hours'),
        operatingDays: document.querySelector('#line-capa-operating-days'),
        total: document.querySelector('#line-capa-total'),
        note: document.querySelector('#line-capa-note'),
        btnSave: document.querySelector('#btn-line-capa-save'),
        btnReset: document.querySelector('#btn-line-capa-reset'),
        tableBody: document.querySelector('#line-capa-table tbody'),
        empty: document.querySelector('#line-capa-table-empty'),
        filterMonth: document.querySelector('#line-capa-filter-month'),
        filterLine: document.querySelector('#line-capa-filter-line'),
    },
    lineItemMaster: {
        section: document.querySelector('.line-item-master'),
        form: document.querySelector('#line-item-master-form'),
        recordId: document.querySelector('#line-item-master-record-id'),
        code: document.querySelector('#line-item-master-code'),
        line: document.querySelector('#line-item-master-line'),
        hourly: document.querySelector('#line-item-master-hourly'),
        btnSave: document.querySelector('#btn-line-item-master-save'),
        btnReset: document.querySelector('#btn-line-item-master-reset'),
        tableBody: document.querySelector('#line-item-master-table tbody'),
        empty: document.querySelector('#line-item-master-empty'),
        filterLine: document.querySelector('#line-item-master-filter-line'),
    },
    baseMaterialMaster: {
        section: document.querySelector('.base-material-master'),
        form: document.querySelector('#base-material-master-form'),
        recordId: document.querySelector('#base-material-master-record-id'),
        scmArea: document.querySelector('#base-mat-scm-area'),
        hierarchy: document.querySelector('#base-mat-hierarchy'),
        prodUnit: document.querySelector('#base-mat-prod-unit'),
        itemCode: document.querySelector('#base-mat-item-code'),
        itemName: document.querySelector('#base-mat-item-name'),
        conv1: document.querySelector('#base-mat-conv1'),
        conv2: document.querySelector('#base-mat-conv2'),
        eaPerBox: document.querySelector('#base-mat-ea-per-box'),
        conv3: document.querySelector('#base-mat-conv3'),
        conv5: document.querySelector('#base-mat-conv5'),
        vendorName: document.querySelector('#base-mat-vendor-name'),
        moq: document.querySelector('#base-mat-moq'),
        btnSave: document.querySelector('#btn-base-material-save'),
        btnReset: document.querySelector('#btn-base-material-reset'),
        tableBody: document.querySelector('#base-material-master-table tbody'),
        empty: document.querySelector('#base-material-master-empty'),
        filterScm: document.querySelector('#base-material-filter-scm'),
        filterCategory: document.querySelector('#base-material-filter-category'),
        filterItemCode: document.querySelector('#base-material-filter-item-code'),
        filterProdUnit: document.querySelector('#base-material-filter-prod-unit'),
        selectAll: document.querySelector('#base-material-select-all'),
        btnRegisterPlan: document.querySelector('#btn-register-production-plan'),
    },
    salesUpload: {
        section: document.querySelector('#view-sales-upload'),
        fileInput: document.querySelector('#sales-file-input'),
        uploadButton: document.querySelector('#btn-sales-upload-start'),
        templateButton: document.querySelector('#btn-sales-template'),
        status: document.querySelector('#sales-upload-status'),
        form: document.querySelector('#sales-upload-form'),
        month: document.querySelector('#sales-month'),
        itemCode: document.querySelector('#sales-item-code'),
        channel: document.querySelector('#sales-channel'),
        standardQuantity: document.querySelector('#sales-standard-quantity'),
        promotionQuantity: document.querySelector('#sales-promotion-quantity'),
        note: document.querySelector('#sales-note'),
        formReset: document.querySelector('#btn-sales-form-reset'),
        channelForm: document.querySelector('#sales-channel-form'),
        channelKey: document.querySelector('#channel-key'),
        channelName: document.querySelector('#channel-name'),
        channelDescription: document.querySelector('#channel-description'),
        channelList: document.querySelector('#sales-channel-list'),
        channelEmpty: document.querySelector('#sales-channel-empty'),
        summaryItemFilter: document.querySelector('#sales-summary-filter-item'),
        summaryItemInput: document.querySelector('#sales-summary-filter-item-input'),
        summaryItemList: document.querySelector('#sales-summary-filter-item-list'),
        summaryMonthFilter: document.querySelector('#sales-summary-filter-month'),
        summaryCategoryFilter: document.querySelector('#sales-summary-filter-category'),
        summaryTable: document.querySelector('#sales-summary-table'),
        summaryBody: document.querySelector('#sales-summary-table tbody'),
        summaryEmpty: document.querySelector('#sales-summary-empty'),
        summaryDetailTemplate: document.querySelector('#sales-summary-detail-template'),
        uploadBody: document.querySelector('#sales-upload-table tbody'),
        uploadEmpty: document.querySelector('#sales-upload-empty'),
    },
    changeHistory: {
        section: document.querySelector('#view-change-history'),
        tabs: Array.from(document.querySelectorAll('#view-change-history .history-tab')),
        panels: Array.from(document.querySelectorAll('#view-change-history [data-history-panel]')),
        tableBody: document.querySelector('#change-history-table tbody'),
        empty: document.querySelector('#change-history-empty'),
        filterType: document.querySelector('#history-filter-type'),
        filterMonth: document.querySelector('#history-filter-month'),
        filterItem: document.querySelector('#history-filter-item'),
        exportButton: document.querySelector('#history-export'),
        uploadTableBody: document.querySelector('#change-upload-history-table tbody'),
        uploadEmpty: document.querySelector('#change-upload-history-empty'),
        uploadFilterFrom: document.querySelector('#upload-history-filter-from'),
        uploadFilterTo: document.querySelector('#upload-history-filter-to'),
        uploadFilterItem: document.querySelector('#upload-history-filter-item'),
        uploadFilterReset: document.querySelector('#upload-history-filter-reset'),
    },
    views: {
        container: document.getElementById('sidebar'),
        buttons: Array.from(document.querySelectorAll('.sidebar-item')),
        sections: Array.from(document.querySelectorAll('.view-section')),
    },
    openTabsBar: document.getElementById('open-tabs-bar'),
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebar-toggle'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    sidebarPlannerSub: document.getElementById('sidebar-planner-sub'),
};

let planTableScrollAnimationFrame = null;

if (dom.category) {
    dom.category.dataset.manual = 'auto';
}

// -------------------- 카테고리 필터 debounce --------------------
/**
 * 카테고리 체크박스 변경 시 applyFilters()를 즉시 호출하지 않고,
 * 300ms 대기 후 마지막 변경만 반영하여 성능을 개선합니다.
 */
let _categoryFilterTimer = null;
function debouncedApplyFilters() {
    if (_categoryFilterTimer) clearTimeout(_categoryFilterTimer);
    _categoryFilterTimer = setTimeout(() => {
        _categoryFilterTimer = null;
        applyFilters();
    }, 300);
}

// -------------------- 카테고리 멀티셀렉트 드롭다운 --------------------
/**
 * 카테고리 멀티셀렉트 드롭다운에서 현재 선택된 값들을 반환합니다.
 * 전체가 선택되면 'all'을 반환, 아니면 선택된 카테고리 배열을 반환합니다.
 */
function getCategoryFilterValues() {
    const allCb = dom.filters.categoryAllCheckbox;
    const optionsContainer = dom.filters.categoryOptions;
    if (!optionsContainer) return 'all';

    const checkboxes = Array.from(optionsContainer.querySelectorAll('input[type="checkbox"]'));
    if (checkboxes.length === 0) return 'all';

    /* '전체' 체크 = 개별 전부 체크 상태 → 'all' 반환 */
    if (allCb && allCb.checked) return 'all';

    const checked = checkboxes.filter(cb => cb.checked);
    if (checked.length === 0) return 'all';

    return checked.map(cb => cb.value);
}

/**
 * 카테고리 멀티셀렉트 드롭다운의 표시 텍스트를 업데이트합니다.
 */
function updateCategoryFilterDisplay() {
    const toggleText = dom.filters.categoryToggle?.querySelector('.multi-select-text');
    if (!toggleText) return;

    const values = getCategoryFilterValues();
    if (values === 'all') {
        toggleText.textContent = '전체';
        return;
    }
    if (values.length === 1) {
        toggleText.textContent = values[0];
    } else {
        toggleText.textContent = `${values[0]} 외 ${values.length - 1}건`;
    }
}

/**
 * '전체' 체크박스와 개별 체크박스 간의 상태를 동기화합니다.
 */
function syncCategoryAllCheckbox() {
    const allCb = dom.filters.categoryAllCheckbox;
    const optionsContainer = dom.filters.categoryOptions;
    if (!allCb || !optionsContainer) return;

    const checkboxes = Array.from(optionsContainer.querySelectorAll('input[type="checkbox"]'));
    const allChecked = checkboxes.length > 0 && checkboxes.every(cb => cb.checked);
    const noneChecked = checkboxes.every(cb => !cb.checked);

    if (allChecked) {
        allCb.checked = true;
        allCb.indeterminate = false;
    } else if (noneChecked) {
        /* 모두 해제 → '전체' 체크박스도 해제 상태 (전체=ALL 필터링으로 처리) */
        allCb.checked = false;
        allCb.indeterminate = false;
    } else {
        allCb.checked = false;
        allCb.indeterminate = true;
    }
}

/**
 * 카테고리 멀티셀렉트 메뉴를 토글합니다.
 */
function toggleCategoryMenu(forceClose) {
    const menu = dom.filters.categoryMenu;
    const toggle = dom.filters.categoryToggle;
    if (!menu || !toggle) return;

    const shouldClose = forceClose === true || !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', shouldClose);
    toggle.classList.toggle('active', !shouldClose);
}

/**
 * 카테고리 멀티셀렉트를 초기화합니다 (전체 선택 상태로).
 */
function resetCategoryFilter() {
    const allCb = dom.filters.categoryAllCheckbox;
    const optionsContainer = dom.filters.categoryOptions;
    if (!allCb || !optionsContainer) return;

    allCb.checked = true;
    allCb.indeterminate = false;
    const checkboxes = optionsContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => { cb.checked = true; });
    updateCategoryFilterDisplay();
}

/**
 * 카테고리 옵션 목록을 재구성합니다.
 */
function populateCategoryFilterOptions(categories, previousSelections) {
    const optionsContainer = dom.filters.categoryOptions;
    const allCb = dom.filters.categoryAllCheckbox;
    if (!optionsContainer || !allCb) return;

    optionsContainer.innerHTML = '';
    const prevSet = Array.isArray(previousSelections) ? new Set(previousSelections) : null;

    categories.forEach(category => {
        const label = document.createElement('label');
        label.className = 'multi-select-option';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = category;
        if (prevSet && prevSet.has(category)) {
            checkbox.checked = true;
        }
        checkbox.addEventListener('change', () => {
            syncCategoryAllCheckbox();
            updateCategoryFilterDisplay();
            state.planTableReady = true;
            debouncedApplyFilters();
        });
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + category));
        optionsContainer.appendChild(label);
    });

    // '전체' 체크박스 동기 처리
    if (prevSet && prevSet.size > 0) {
        const stillValid = categories.filter(c => prevSet.has(c));
        if (stillValid.length === 0 || stillValid.length === categories.length) {
            allCb.checked = true;
            allCb.indeterminate = false;
            optionsContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = true; });
        } else {
            allCb.checked = false;
            allCb.indeterminate = true;
        }
    } else {
        allCb.checked = true;
        allCb.indeterminate = false;
        optionsContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = true; });
    }

    updateCategoryFilterDisplay();
}

/**
 * 카테고리 필터 값이 특정 레코드와 매치되는지 확인합니다.
 */
function matchesCategoryFilter(categoryFilterValue, recordCategory) {
    if (categoryFilterValue === 'all') return true;
    const sanitized = sanitizeText(recordCategory).trim();
    if (Array.isArray(categoryFilterValue)) {
        return categoryFilterValue.includes(sanitized);
    }
    return sanitized === categoryFilterValue;
}

// -------------------- 유틸리티 함수 --------------------
function toNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
}

function toNullableNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

function sanitizeText(value) {
    return value ? String(value) : '';
}

async function safeJson(response, fallback = null, options = {}) {
    const { label = '' } = options;
    if (!response) return fallback;
    if (response.status === 204 || response.status === 205) {
        return fallback;
    }
    try {
        return await response.json();
    } catch (error) {
        const context = label ? `${label} 응답을 JSON으로 파싱` : '응답을 JSON으로 파싱';
        console.warn(`${context}하는 중 문제가 발생했습니다. 기본값을 사용합니다.`, error);
        return fallback;
    }
}

/**
 * 페이지네이션 API를 반복 호출하여 전체 데이터를 수집합니다.
 * 서버의 max-page-size 제한(기본 2000)에 관계없이 모든 레코드를 가져옵니다.
 * @param {string} baseUrl - 기본 URL (예: '/sales-api/snop-records')
 * @param {number} pageSize - 페이지당 요청 크기 (기본 2000)
 * @param {string} label - 로그용 라벨
 * @returns {Promise<Array>} 전체 데이터 배열
 */
async function fetchAllPages(baseUrl, pageSize = 2000, label = '') {
    const allRecords = [];
    let page = 0;
    let totalPages = 1;
    const MAX_PAGES = 50; // 안전 가드: 최대 50페이지 (100,000건)

    while (page < totalPages && page < MAX_PAGES) {
        const separator = baseUrl.includes('?') ? '&' : '?';
        const url = `${baseUrl}${separator}page=${page}&size=${pageSize}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`${label || baseUrl} 페이지 ${page} 조회 실패: ${response.status}`);
                break;
            }
            const payload = await response.json();
            const data = payload?.data;
            if (!data) break;

            if (data.content && Array.isArray(data.content)) {
                allRecords.push(...data.content);
                totalPages = data.total_pages ?? data.totalPages ?? 1;
            } else if (Array.isArray(data)) {
                allRecords.push(...data);
                break; // 비페이지네이션 응답이면 한 번에 끝
            } else {
                break;
            }
        } catch (e) {
            console.error(`${label || baseUrl} 페이지 ${page} 조회 오류:`, e);
            break;
        }
        page++;
    }

    if (page > 1) {
        console.info(`${label || baseUrl}: 전체 ${allRecords.length}건 조회 (${page}페이지)`);
    }
    return allRecords;
}

/**
 * ApiResponse 래퍼에서 데이터 배열을 추출하는 유틸리티.
 * 서버 응답 형식:
 *   - 페이지네이션: { success, data: { content: [...], page, size, ... } }
 *   - 비페이지네이션: { success, data: [...] }
 *   - 레거시(직접 배열): [...]
 * @param {object|array} payload - safeJson()으로 파싱된 응답 객체
 * @returns {Array} 데이터 배열
 */
function extractData(payload) {
    if (!payload) return [];
    // 레거시: 직접 배열인 경우
    if (Array.isArray(payload)) return payload;
    // ApiResponse 래퍼: { success, data }
    const d = payload.data;
    if (d == null) return [];
    // 비페이지네이션: data가 배열
    if (Array.isArray(d)) return d;
    // 페이지네이션: data.content가 배열
    if (d.content && Array.isArray(d.content)) return d.content;
    // 기타 (커스텀 객체 등)
    return [];
}

function generateDeterministicRatio(key, min = 0.9, max = 0.98) {
    const safeMin = Number.isFinite(min) ? min : 0;
    const safeMax = Number.isFinite(max) ? max : 1;
    if (safeMax <= safeMin) {
        return safeMin;
    }
    const normalizedKey = sanitizeText(key);
    if (!normalizedKey) {
        return (safeMin + safeMax) / 2;
    }
    let hash = 0;
    for (let i = 0; i < normalizedKey.length; i += 1) {
        hash = (hash * 131 + normalizedKey.charCodeAt(i)) % 1000;
    }
    const ratio = hash / 1000;
    return safeMin + (safeMax - safeMin) * ratio;
}

function generateFallbackActual(base, key, options = {}) {
    const { minRatio = 0.9, maxRatio = 0.98, step = 1 } = options;
    const numericBase = Number.isFinite(base) ? base : 0;
    if (numericBase <= 0) {
        return 0;
    }
    const ratio = generateDeterministicRatio(key, minRatio, maxRatio);
    const rawValue = numericBase * ratio;
    if (!Number.isFinite(step) || step <= 0) {
        return Math.round(rawValue);
    }
    return Math.round(rawValue / step) * step;
}

function normalizeFileName(value) {
    return sanitizeText(value).trim().toLowerCase();
}

function arrayBufferToHex(buffer) {
    const byteArray = new Uint8Array(buffer);
    return Array.from(byteArray)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

async function generateArrayBufferHash(arrayBuffer) {
    try {
        if (!arrayBuffer || !window.crypto || !window.crypto.subtle) {
            return null;
        }
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
        return arrayBufferToHex(hashBuffer);
    } catch (error) {
        console.warn('해시 계산 중 오류가 발생했습니다. 중복 업로드 방지를 건너뜁니다.', error);
        return null;
    }
}

function formatNumber(value, fallback = '-') {
    if (!Number.isFinite(value)) return fallback;
    /* 소수점이 있으면 소수점 2자리까지 표시, 정수이면 소수점 없이 표시 */
    if (value % 1 !== 0) {
        return value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return value.toLocaleString('ko-KR');
}

function formatSignedNumber(value, fallback = '0') {
    if (!Number.isFinite(value)) return fallback;
    if (value > 0) {
        return `+${formatNumber(value, fallback)}`;
    }
    if (value === 0) {
        return '0';
    }
    return formatNumber(value, fallback);
}

/* ── 단위 환산 유틸리티 ── */
/**
 * 자재코드로 baseMaterialMasters에서 환산율 조회
 * - eaPerBag  : EA/BAG  (conversion1)
 * - bagPerBox : BAG/BOX (conversion2) → BOX × bagPerBox = BAG
 * - eaPerBox  : EA/BOX  (conversion1 × conversion2) → BOX × eaPerBox = EA
 */
function getConversionRates(itemCode) {
    const master = (state.baseMaterialMasters || []).find(
        m => m.item_code === itemCode
    );
    if (!master) return { eaPerBag: null, bagPerBox: null, eaPerBox: null };
    const c1 = Number.isFinite(Number(master.conversion1)) && Number(master.conversion1) > 0 ? Number(master.conversion1) : null;
    const c2 = Number.isFinite(Number(master.conversion2)) && Number(master.conversion2) > 0 ? Number(master.conversion2) : null;
    return {
        eaPerBag: c1,
        bagPerBox: c2,
        eaPerBox: (c1 != null && c2 != null) ? c1 * c2 : null,
    };
}

/**
 * BOX 기준 → EA, BAG 환산
 * BOX가 기본 단위이므로:
 *   EA  = BOX × eaPerBox  (conversion1 × conversion2)
 *   BAG = BOX × bagPerBox (conversion2)
 */
function convertFromBox(boxValue, rates) {
    if (!Number.isFinite(boxValue)) return { ea: null, bag: null, box: null };
    const box = boxValue;
    const ea  = rates.eaPerBox  ? Math.round(box * rates.eaPerBox)  : null;
    const bag = rates.bagPerBox ? Math.round(box * rates.bagPerBox) : null;
    return { ea, bag, box };
}

/** EA 값을 BAG, BOX로 환산 (하위 호환용) */
function convertUnits(eaValue, rates) {
    if (!Number.isFinite(eaValue)) return { ea: null, bag: null, box: null };
    const ea = eaValue;
    const bag = rates.eaPerBag ? Math.round(ea / rates.eaPerBag) : null;
    const box = rates.eaPerBox ? Math.round(ea / rates.eaPerBox)
              : (rates.eaPerBag && rates.bagPerBox) ? Math.round(ea / rates.eaPerBag / rates.bagPerBox)
              : null;
    return { ea, bag, box };
}

/** EA 값을 BOX로만 환산 */
function convertToBox(eaValue, rates) {
    if (!Number.isFinite(eaValue)) return null;
    if (rates.eaPerBox) return Math.round(eaValue / rates.eaPerBox);
    if (rates.eaPerBag && rates.bagPerBox) return Math.round(eaValue / rates.eaPerBag / rates.bagPerBox);
    return null;
}

/**
 * 3단위 셀 렌더링 헬퍼 (EA/BAG/BOX)
 * BOX가 기본 단위 — BOX 값을 받아 EA, BAG를 곱셈으로 환산
 */
function renderTripleUnitCell(row, fieldPrefix, boxValue, rates, signed) {
    const units = convertFromBox(boxValue, rates);
    const eaCell = row.querySelector(`[data-field="${fieldPrefix}_ea"]`);
    const bagCell = row.querySelector(`[data-field="${fieldPrefix}_bag"]`);
    const boxCell = row.querySelector(`[data-field="${fieldPrefix}_box"]`);
    const fmt = signed ? formatSignedNumber : formatNumber;
    if (eaCell) eaCell.textContent = Number.isFinite(units.ea) ? fmt(units.ea) : '-';
    if (bagCell) bagCell.textContent = Number.isFinite(units.bag) ? fmt(units.bag) : '-';
    if (boxCell) boxCell.textContent = Number.isFinite(units.box) ? fmt(units.box) : '-';
}

/** BOX only 셀 렌더링 헬퍼 — BOX값을 그대로 표시 */
function renderBoxOnlyCell(cell, boxValue, rates, signed) {
    if (!cell) return;
    const fmt = signed ? formatSignedNumber : formatNumber;
    cell.textContent = Number.isFinite(boxValue) ? fmt(boxValue) : '-';
}

function formatMonthToKoreanLabel(month) {
    const normalized = sanitizeText(month).trim();
    if (!normalized) return '';
    const [year, monthPart] = normalized.split('-');
    if (!year || !monthPart) return normalized;
    const monthNumber = Number(monthPart);
    if (Number.isFinite(monthNumber)) {
        return `${year}년 ${monthNumber}월`;
    }
    return `${year}년 ${monthPart}월`;
}

function formatPercent(value, fractionDigits = 1) {
    if (!Number.isFinite(value)) return '-';
    const percent = value * 100;
    return `${percent.toLocaleString('ko-KR', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    })}%`;
}

function applyAlphaToHex(color, alpha = 1) {
    const raw = sanitizeText(color).trim();
    if (!raw) {
        return applyAlphaToHex('#2563eb', alpha);
    }
    let hex = raw.startsWith('#') ? raw.slice(1) : raw;
    if (hex.length === 3) {
        hex = hex.split('').map((value) => value + value).join('');
    } else if (hex.length === 8) {
        hex = hex.slice(0, 6);
    }
    if (hex.length !== 6 || /[^0-9a-fA-F]/.test(hex)) {
        return applyAlphaToHex('#2563eb', alpha);
    }
    const clampedAlpha = Math.min(Math.max(Number(alpha) || 0, 0), 1);
    const alphaHex = Math.round(clampedAlpha * 255).toString(16).padStart(2, '0');
    return `#${hex}${alphaHex}`;
}

function computeAccuracyRatio(plan, actual) {
    const planValue = parseNumberOrNull(plan);
    const actualValue = parseNumberOrNull(actual);
    if (!Number.isFinite(planValue) || planValue === 0) {
        return null;
    }
    if (!Number.isFinite(actualValue)) {
        return null;
    }
    return actualValue / planValue;
}

function classifyAccuracyRatio(ratio) {
    if (!Number.isFinite(ratio)) {
        return 'neutral';
    }
    if (ratio >= 0.95 && ratio <= 1.05) {
        return 'good';
    }
    if (ratio < 0.85) {
        return 'low';
    }
    if (ratio > 1.15) {
        return 'high';
    }
    return 'neutral';
}

function formatFileSize(bytes, fractionDigits = 1) {
    const size = Number(bytes);
    if (!Number.isFinite(size) || size < 0) {
        return '-';
    }
    if (size < 1024) {
        return `${size.toLocaleString('ko-KR')} B`;
    }
    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(fractionDigits)} KB`;
    }
    if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(fractionDigits)} MB`;
    }
    return `${(size / (1024 * 1024 * 1024)).toFixed(fractionDigits + 1)} GB`;
}

function coerceTimestamp(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    if (value instanceof Date) {
        const time = value.getTime();
        return Number.isNaN(time) ? null : time;
    }
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
        return numeric;
    }
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
}

function getRecordTimestamp(record) {
    if (!record) return null;
    const created = coerceTimestamp(record.created_at);
    const updated = coerceTimestamp(record.updated_at);
    if (created !== null && updated !== null) {
        return Math.max(created, updated);
    }
    return updated !== null ? updated : created;
}

function determineChangeType(record) {
    if (!record) return 'created';
    const created = coerceTimestamp(record.created_at);
    const updated = coerceTimestamp(record.updated_at);
    if (created === null && updated === null) {
        return 'created';
    }
    if (created === null && updated !== null) {
        return 'updated';
    }
    if (created !== null && updated === null) {
        return 'created';
    }
    const diff = Math.abs(updated - created);
    return diff <= CHANGE_TYPE_THRESHOLD_MS ? 'created' : 'updated';
}

function parseNumberOrNull(value) {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '') {
            return null;
        }
        const num = Number(trimmed);
        return Number.isFinite(num) ? num : null;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

/**
 * 현재 시각의 한국시간(KST) ISO 문자열을 반환합니다.
 * 예: "2026-04-08T14:30:00+09:00"
 */
function getNowKSTISOString() {
    const now = new Date();
    const kstFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
    const parts = kstFormatter.formatToParts(now);
    const get = (type) => (parts.find((p) => p.type === type) || {}).value || '00';
    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}+09:00`;
}

function formatDateTime(value, options = {}) {
    if (!value && value !== 0) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return sanitizeText(value);
    }
    const formatter = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        ...options,
    });
    return formatter.format(date);
}

function buildCapacityStatus(ratio) {
    if (!Number.isFinite(ratio)) {
        return {
            label: 'CAPA 미등록',
            className: 'warning',
        };
    }
    if (ratio > 1) {
        return {
            label: `초과 (${formatPercent(ratio)})`,
            className: 'alert',
        };
    }
    if (ratio >= 0.9) {
        return {
            label: `적정 (${formatPercent(ratio)})`,
            className: 'safe',
        };
    }
    return {
        label: `여유 (${formatPercent(ratio)})`,
        className: 'warning',
    };
}

function getLineKey(line, month) {
    const cleanLine = sanitizeText(line).trim();
    const cleanMonth = sanitizeText(month).trim();
    if (!cleanLine || !cleanMonth) return null;
    return `${cleanLine}__${cleanMonth}`;
}

function getLineCompositeKey(line, category, month) {
    const baseKey = getLineKey(line, month);
    if (!baseKey) return null;
    const cleanCategory = sanitizeText(category).trim();
    if (!cleanCategory) return baseKey;
    return `${baseKey}__${cleanCategory}`;
}

function getSalesAggregateKey(itemCode, month) {
    const code = sanitizeText(itemCode).trim().toLowerCase();
    if (!code) return null;
    const cleanMonth = sanitizeText(month).trim();
    /* 자재코드 + 월 기준으로 그룹핑 — 같은 자재라도 월이 다르면 별도 집계 */
    if (cleanMonth) {
        return `${code}__${cleanMonth}`;
    }
    /* month가 없는 경우 자재코드만으로 키 생성 (호환) */
    return code;
}

function getSalesUploadComboKey(itemCode, month, channel) {
    const code = sanitizeText(itemCode).trim().toLowerCase();
    const cleanMonth = sanitizeText(month).trim();
    const channelKey = normalizeChannelKey(channel);
    if (!code || !cleanMonth || !channelKey) return null;
    return `${code}__${cleanMonth}__${channelKey}`;
}

function normalizeChannelKey(value) {
    return sanitizeText(value).trim().toUpperCase();
}

function buildSalesChannelIndex(channels) {
    const index = new Map();
    (channels || []).forEach((channel) => {
        const key = normalizeChannelKey(channel.channel_key);
        if (!key) return;
        index.set(key.toLowerCase(), channel);
        const name = sanitizeText(channel.channel_name).trim();
        if (name) {
            const nameKey = name.toLowerCase();
            if (!index.has(nameKey)) {
                index.set(nameKey, channel);
            }
        }
    });
    return index;
}

function buildSalesUploadIndex(records) {
    const index = new Map();
    (records || []).forEach((record) => {
        const key = getSalesUploadComboKey(record.item_code, record.month, record.channel);
        if (!key) return;
        index.set(key, record);
    });
    return index;
}

function getSalesUploadLogKey(fileName, checksum) {
    const normalizedName = normalizeFileName(fileName);
    const hash = sanitizeText(checksum).trim();
    if (!normalizedName || !hash) return null;
    return `${normalizedName}__${hash}`;
}

function buildSalesUploadLogIndex(records) {
    const index = new Map();
    (records || []).forEach((record) => {
        const key = getSalesUploadLogKey(record.file_name, record.checksum);
        if (!key) return;
        index.set(key, record);
    });
    return index;
}

function buildSalesUploadLogNameIndex(records) {
    const index = new Map();
    (records || []).forEach((record) => {
        const nameKey = normalizeFileName(record.file_name);
        if (!nameKey) return;
        if (!index.has(nameKey)) {
            index.set(nameKey, []);
        }
        index.get(nameKey).push(record);
    });
    return index;
}

function buildSampleSnopRecords() {
    const items = [
        {
            item_code: 'BAT-100',
            item_name: '스마트 배터리모듈 100Ah',
            category: '배터리',
            line_category: 'EV 배터리',
            production_line: '배터리 라인 A',
            optimal_inventory_2025: 900,
            monthly: [
                {
                    month: '2025-01',
                    sales_plan: 1015,
                    sales_actual: 996,
                    production_plan: 1360,
                    production_actual: 1340,
                    beginning_inventory: 620,
                    target_ending_inventory: 820,
                    capacity_limit: 1478,
                    notes: '',
                },
                {
                    month: '2025-02',
                    sales_plan: 1020,
                    sales_actual: 1000,
                    production_plan: 1340,
                    production_actual: 1320,
                    beginning_inventory: 600,
                    target_ending_inventory: 815,
                    capacity_limit: 1481,
                    notes: '',
                },
                {
                    month: '2025-03',
                    sales_plan: 1010,
                    sales_actual: 990,
                    production_plan: 1355,
                    production_actual: 1334,
                    beginning_inventory: 590,
                    target_ending_inventory: 810,
                    capacity_limit: 1522,
                    notes: '',
                },
                {
                    month: '2025-04',
                    sales_plan: 1025,
                    sales_actual: 1008,
                    production_plan: 1360,
                    production_actual: 1338,
                    beginning_inventory: 580,
                    target_ending_inventory: 805,
                    capacity_limit: 1486,
                    notes: '',
                },
                {
                    month: '2025-05',
                    sales_plan: 1015,
                    sales_actual: 995,
                    production_plan: 1380,
                    production_actual: 1355,
                    beginning_inventory: 570,
                    target_ending_inventory: 800,
                    capacity_limit: 1527,
                    notes: '',
                },
                {
                    month: '2025-06',
                    sales_plan: 1015,
                    sales_actual: 995,
                    production_plan: 1345,
                    production_actual: 1326,
                    beginning_inventory: 560,
                    target_ending_inventory: 795,
                    capacity_limit: 1510,
                    notes: '',
                },
            ],
        },
        {
            item_code: 'CNT-210',
            item_name: '프리미엄 컨트롤러 210',
            category: '컨트롤러',
            line_category: '제어 모듈',
            production_line: '컨트롤러 라인 B',
            optimal_inventory_2025: 560,
            monthly: [
                {
                    month: '2025-01',
                    sales_plan: 680,
                    sales_actual: 655,
                    production_plan: 760,
                    production_actual: 747,
                    beginning_inventory: 520,
                    target_ending_inventory: 540,
                    capacity_limit: 950,
                    notes: '',
                },
                {
                    month: '2025-02',
                    sales_plan: 670,
                    sales_actual: 646,
                    production_plan: 755,
                    production_actual: 738,
                    beginning_inventory: 510,
                    target_ending_inventory: 535,
                    capacity_limit: 993,
                    notes: '',
                },
                {
                    month: '2025-03',
                    sales_plan: 660,
                    sales_actual: 640,
                    production_plan: 760,
                    production_actual: 748,
                    beginning_inventory: 500,
                    target_ending_inventory: 530,
                    capacity_limit: 974,
                    notes: '',
                },
                {
                    month: '2025-04',
                    sales_plan: 660,
                    sales_actual: 638,
                    production_plan: 755,
                    production_actual: 742,
                    beginning_inventory: 495,
                    target_ending_inventory: 525,
                    capacity_limit: 1007,
                    notes: '',
                },
                {
                    month: '2025-05',
                    sales_plan: 665,
                    sales_actual: 644,
                    production_plan: 755,
                    production_actual: 740,
                    beginning_inventory: 490,
                    target_ending_inventory: 520,
                    capacity_limit: 995,
                    notes: '',
                },
                {
                    month: '2025-06',
                    sales_plan: 665,
                    sales_actual: 645,
                    production_plan: 750,
                    production_actual: 740,
                    beginning_inventory: 485,
                    target_ending_inventory: 460,
                    capacity_limit: 962,
                    notes: '',
                },
            ],
        },
    ];

    /* OEM 제품 샘플 데이터 */
    const oemItems = [
        {
            item_code: 'OEM-BT50',
            item_name: 'OEM 배터리팩 50Ah',
            category: '배터리',
            line_category: 'OEM',
            production_line: 'OEM 상품',
            vendor_name: '(주)대한전지',
            moq: 50,
            optimal_inventory_2025: 400,
            monthly: [
                { month: '2025-01', sales_plan: 320, sales_actual: 305, production_plan: 380, production_actual: 370, beginning_inventory: 250, target_ending_inventory: 300, capacity_limit: 500, notes: '' },
                { month: '2025-02', sales_plan: 340, sales_actual: 328, production_plan: 400, production_actual: 390, beginning_inventory: 295, target_ending_inventory: 310, capacity_limit: 500, notes: '' },
                { month: '2025-03', sales_plan: 330, sales_actual: 318, production_plan: 390, production_actual: 382, beginning_inventory: 280, target_ending_inventory: 305, capacity_limit: 500, notes: '' },
                { month: '2025-04', sales_plan: 350, sales_actual: 340, production_plan: 410, production_actual: 400, beginning_inventory: 270, target_ending_inventory: 310, capacity_limit: 500, notes: '' },
                { month: '2025-05', sales_plan: 335, sales_actual: 320, production_plan: 395, production_actual: 388, beginning_inventory: 260, target_ending_inventory: 305, capacity_limit: 500, notes: '' },
                { month: '2025-06', sales_plan: 345, sales_actual: 330, production_plan: 400, production_actual: 392, beginning_inventory: 255, target_ending_inventory: 300, capacity_limit: 500, notes: '' },
            ],
        },
        {
            item_code: 'OEM-CT30',
            item_name: 'OEM 컨트롤러 30W',
            category: '컨트롤러',
            line_category: 'OEM',
            production_line: 'OEM 상품',
            vendor_name: '삼성전자부품',
            moq: 30,
            optimal_inventory_2025: 280,
            monthly: [
                { month: '2025-01', sales_plan: 210, sales_actual: 198, production_plan: 250, production_actual: 242, beginning_inventory: 180, target_ending_inventory: 220, capacity_limit: 350, notes: '' },
                { month: '2025-02', sales_plan: 220, sales_actual: 208, production_plan: 260, production_actual: 252, beginning_inventory: 195, target_ending_inventory: 225, capacity_limit: 350, notes: '' },
                { month: '2025-03', sales_plan: 215, sales_actual: 205, production_plan: 255, production_actual: 248, beginning_inventory: 190, target_ending_inventory: 220, capacity_limit: 350, notes: '' },
                { month: '2025-04', sales_plan: 225, sales_actual: 215, production_plan: 265, production_actual: 258, beginning_inventory: 185, target_ending_inventory: 225, capacity_limit: 350, notes: '' },
                { month: '2025-05', sales_plan: 218, sales_actual: 210, production_plan: 258, production_actual: 250, beginning_inventory: 178, target_ending_inventory: 220, capacity_limit: 350, notes: '' },
                { month: '2025-06', sales_plan: 228, sales_actual: 218, production_plan: 268, production_actual: 260, beginning_inventory: 172, target_ending_inventory: 225, capacity_limit: 350, notes: '' },
            ],
        },
    ];

    const allItems = [...items, ...oemItems];

    const records = [];
    const timestamp = Date.now();

    allItems.forEach((item) => {
        if (!item || !Array.isArray(item.monthly)) return;
        item.monthly.forEach((entry) => {
            const month = sanitizeText(entry.month).trim();
            if (!month) return;
            const planned = Number.isFinite(entry.production_plan) ? entry.production_plan : 0;
            const actual = Number.isFinite(entry.production_actual) ? entry.production_actual : 0;
            const remaining = Number.isFinite(entry.production_remaining)
                ? entry.production_remaining
                : planned - actual;
            const entryTargetInventory = Number.isFinite(entry.target_ending_inventory)
                ? entry.target_ending_inventory
                : (Number.isFinite(item.target_ending_inventory) ? item.target_ending_inventory : 0);
            const entryOptimalInventory = Number.isFinite(entry.optimal_inventory_2025)
                ? entry.optimal_inventory_2025
                : (Number.isFinite(item.optimal_inventory_2025) ? item.optimal_inventory_2025 : null);
            const entryCapacityLimit = Number.isFinite(entry.capacity_limit)
                ? entry.capacity_limit
                : (Number.isFinite(item.capacity_limit) ? item.capacity_limit : 0);
            const entryLine = entry.production_line !== undefined
                ? entry.production_line
                : item.production_line;

            records.push({
                id: `sample-${sanitizeText(item.item_code).trim() || 'material'}-${month}`,
                category: sanitizeText(item.category).trim(),
                line_category: sanitizeText(item.line_category ?? item.category).trim(),
                item_code: sanitizeText(item.item_code).trim(),
                item_name: sanitizeText(item.item_name).trim(),
                production_line: sanitizeText(entryLine).trim(),
                vendor_name: sanitizeText(item.vendor_name || '').trim(),
                moq: Number.isFinite(item.moq) ? item.moq : null,
                month,
                sales_plan: Number.isFinite(entry.sales_plan) ? entry.sales_plan : 0,
                sales_actual: Number.isFinite(entry.sales_actual) ? entry.sales_actual : null,
                production_plan: planned,
                production_actual: actual,
                production_remaining: remaining,
                beginning_inventory: Number.isFinite(entry.beginning_inventory) ? entry.beginning_inventory : 0,
                available_inventory: Number.isFinite(entry.available_inventory) ? entry.available_inventory : null,
                target_ending_inventory: entryTargetInventory,
                optimal_inventory_2025: entryOptimalInventory,
                capacity_limit: entryCapacityLimit,
                notes: sanitizeText(entry.notes) || '',
                created_at: timestamp,
                updated_at: timestamp,
            });
        });
    });

    return records;
}

function injectSampleProductionPlans(records) {
    if (!Array.isArray(records) || records.length === 0) {
        return records;
    }

    return records.map((record) => {
        const cloned = { ...record };
        const planValue = parseNumberOrNull(cloned.production_plan);
        if (planValue !== null && planValue > 0) {
            if (!cloned.production_plan_source && !cloned.productionPlanSource) {
                cloned.production_plan_source = 'original';
            }
            return cloned;
        }

        const keyBase = `${sanitizeText(cloned.item_code).trim()}__${sanitizeText(cloned.month).trim()}`;
        const candidates = [
            parseNumberOrNull(cloned.sales_plan),
            parseNumberOrNull(cloned.target_ending_inventory),
            parseNumberOrNull(cloned.beginning_inventory),
        ].filter((value) => Number.isFinite(value) && value > 0);
        const baseValue = candidates.length > 0 ? Math.max(...candidates) : 800;
        const planRatio = generateDeterministicRatio(`${keyBase}__plan`, 1.08, 1.24);
        const step = baseValue >= 1000 ? 5 : 1;
        const computedPlan = Math.max(step, Math.round((baseValue * planRatio) / step) * step);

        cloned.production_plan = computedPlan;
        cloned.production_plan_source = 'sample';

        const actualValue = parseNumberOrNull(cloned.production_actual);
        if (actualValue === null || actualValue <= 0) {
            const actualRatio = generateDeterministicRatio(`${keyBase}__actual`, 0.93, 0.99);
            const sampleActual = Math.max(0, Math.round(computedPlan * actualRatio));
            cloned.production_actual = sampleActual;
        }

        const ensuredPlan = parseNumberOrNull(cloned.production_plan) ?? computedPlan;
        const ensuredActual = parseNumberOrNull(cloned.production_actual) ?? 0;
        cloned.production_remaining = ensuredPlan - ensuredActual;

        if (!Number.isFinite(parseNumberOrNull(cloned.beginning_inventory))) {
            cloned.beginning_inventory = baseValue;
        }

        /* 비고란은 사용자 직접 입력만 허용 — 자동 생성 텍스트 삽입하지 않음 */

        return cloned;
    });
}

function getChannelInfo(channelIndex, value) {
    if (!(channelIndex instanceof Map)) return null;
    const key = normalizeChannelKey(value);
    if (!key) return null;
    return channelIndex.get(key.toLowerCase()) || null;
}

function ensureMonthFilterOption(month) {
    if (!dom || !dom.filters || !dom.filters.month) return;
    const value = sanitizeText(month).trim();
    if (!value) return;
    const select = dom.filters.month;
    const options = Array.from(select.options || []);
    const exists = options.some((option) => option.value === value);
    if (!exists) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    }
    sortMonthFilterOptions();
}

function normalizeRecord(record) {
    const rawCategory = sanitizeText(record.category).trim();
    const derivedCategory = deriveCategoryName(record.item_name, rawCategory);
    const planSource = sanitizeText(record.production_plan_source ?? record.productionPlanSource).trim();
    const salesPlan = toNumber(record.sales_plan);
    const productionPlan = toNumber(record.production_plan);
    const rawActual = parseNumberOrNull(record.production_actual);
    const productionActual = rawActual !== null ? rawActual : null;
    const explicitRemaining = parseNumberOrNull(record.production_remaining);
    const computedRemaining = productionActual !== null ? productionPlan - productionActual : null;
    const productionRemaining = computedRemaining !== null
        ? computedRemaining
        : (explicitRemaining !== null ? explicitRemaining : null);
    const salesActualRaw = parseNumberOrNull(record.sales_actual);
    const salesActual = salesActualRaw !== null ? salesActualRaw : null;
    const salesRemaining = salesActual !== null ? salesPlan - salesActual : null;

    return {
        id: record.id,
        item_code: sanitizeText(record.item_code).trim(),
        item_name: sanitizeText(record.item_name).trim(),
        category: derivedCategory,
        production_line: sanitizeText(record.production_line).trim(),
        vendor_name: sanitizeText(record.vendor_name).trim(),
        moq: toNullableNumber(record.moq),
        month: record.month ?? record.plan_month ?? '',
        sales_plan: salesPlan,
        sales_actual: salesActual,
        sales_remaining: salesRemaining,
        production_plan: productionPlan,
        production_actual: productionActual,
        production_remaining: productionRemaining,
        beginning_inventory: toNumber(record.beginning_inventory),
        available_inventory: toNullableNumber(record.available_inventory),
        target_ending_inventory: toNumber(record.target_ending_inventory),
        optimal_inventory_2025: toNullableNumber(record.optimal_inventory_2025),
        capacity_limit: toNumber(record.capacity_limit),
        notes: record.notes ?? '',
        priority: record.priority != null ? Number(record.priority) : null,
        updated_at: record.updated_at ?? null,
        created_at: record.created_at ?? null,
        production_plan_source: planSource || null,
    };
}

function recordToPayload(record) {
    const categoryValue = deriveCategoryName(record.item_name, record.category);
    const productionPlan = toNumber(record.production_plan);
    const rawActual = parseNumberOrNull(record.production_actual);
    const productionActual = rawActual !== null ? rawActual : 0;
    const explicitRemaining = parseNumberOrNull(record.production_remaining);
    const productionRemaining = explicitRemaining !== null
        ? explicitRemaining
        : productionPlan - productionActual;

    return {
        item_code: sanitizeText(record.item_code).trim(),
        item_name: sanitizeText(record.item_name).trim(),
        category: categoryValue,
        production_line: sanitizeText(record.production_line).trim(),
        vendor_name: record.vendor_name != null ? sanitizeText(record.vendor_name).trim() : null,
        moq: toNullableNumber(record.moq),
        month: sanitizeText(record.month),
        sales_plan: toNumber(record.sales_plan),
        sales_actual: toNullableNumber(record.sales_actual),
        production_plan: productionPlan,
        production_actual: productionActual,
        production_remaining: productionRemaining,
        beginning_inventory: toNumber(record.beginning_inventory),
        available_inventory: toNullableNumber(record.available_inventory),
        target_ending_inventory: toNumber(record.target_ending_inventory),
        optimal_inventory_2025: toNullableNumber(record.optimal_inventory_2025),
        capacity_limit: toNumber(record.capacity_limit),
        manual_input_quantity: toNullableNumber(record.manual_input_quantity),
        notes: sanitizeText(record.notes).trim(),
        priority: record.priority != null ? Number(record.priority) : null,
    };
}

function normalizeOptimalBaseline(record) {
    return {
        id: record.id,
        year: sanitizeText(record.base_year ?? record.year ?? '').trim(),
        category: sanitizeText(record.category).trim(),
        optimal_quantity: toNullableNumber(record.optimal_quantity),
        notes: sanitizeText(record.notes).trim(),
        created_at: record.created_at ?? null,
        updated_at: record.updated_at ?? null,
    };
}

function buildOptimalBaselineIndex(list) {
    const map = new Map();
    (Array.isArray(list) ? list : []).forEach((entry) => {
        if (!entry) return;
        const key = getOptimalBaselineKey(entry.year, entry.category);
        map.set(key, entry);
    });
    return map;
}

function buildOptimalBaselineIdIndex(list) {
    const map = new Map();
    (Array.isArray(list) ? list : []).forEach((entry) => {
        if (entry && entry.id != null) {
            map.set(String(entry.id), entry);
        }
    });
    return map;
}

function normalizeSalesUpload(record, channelIndex) {
    const rawChannel = sanitizeText(record.channel).trim();
    const channelInfo = getChannelInfo(channelIndex, rawChannel);
    const resolvedChannelKey = channelInfo
        ? sanitizeText(channelInfo.channel_key).trim()
        : normalizeChannelKey(rawChannel);
    const channelName = channelInfo ? sanitizeText(channelInfo.channel_name).trim() : '';

    const totalRaw = parseNumberOrNull(record.quantity);
    const promotionRaw = parseNumberOrNull(record.promotion_quantity);
    const standardRaw = parseNumberOrNull(record.standard_quantity);

    const promotionQuantity = promotionRaw !== null && promotionRaw >= 0 ? promotionRaw : 0;
    let standardQuantity;
    if (standardRaw !== null && standardRaw >= 0) {
        standardQuantity = standardRaw;
    } else if (totalRaw !== null) {
        const computed = totalRaw - promotionQuantity;
        standardQuantity = Number.isFinite(computed) && computed >= 0 ? computed : totalRaw;
    } else {
        standardQuantity = 0;
    }

    let totalQuantity;
    if (totalRaw !== null && totalRaw >= 0) {
        totalQuantity = totalRaw;
    } else {
        totalQuantity = standardQuantity + promotionQuantity;
    }

    return {
        id: record.id,
        month: sanitizeText(record.month ?? record.plan_month ?? '').trim(),
        item_code: sanitizeText(record.item_code).trim(),
        channel: resolvedChannelKey || rawChannel,
        channel_name: channelName,
        quantity: toNumber(totalQuantity),
        standard_quantity: toNumber(standardQuantity),
        promotion_quantity: toNumber(promotionQuantity),
        note: sanitizeText(record.note).trim(),
        created_at: record.created_at ?? null,
        updated_at: record.updated_at ?? null,
    };
}

function normalizeSalesUploadHistory(record) {
    return {
        id: record.id,
        upload_type: sanitizeText(record.upload_type).trim() || 'file',
        upload_reference: sanitizeText(record.upload_reference).trim(),
        month: sanitizeText(record.month ?? record.plan_month ?? '').trim(),
        item_code: sanitizeText(record.item_code).trim(),
        channel: sanitizeText(record.channel).trim(),
        quantity: toNumber(record.quantity),
        standard_quantity: toNumber(record.standard_quantity),
        promotion_quantity: toNumber(record.promotion_quantity),
        previous_quantity: toNullableNumber(record.previous_quantity),
        previous_standard_quantity: toNullableNumber(record.previous_standard_quantity),
        previous_promotion_quantity: toNullableNumber(record.previous_promotion_quantity),
        note: sanitizeText(record.note).trim(),
        previous_note: sanitizeText(record.previous_note).trim(),
        action: sanitizeText(record.action).trim(),
        target_record_id: sanitizeText(record.target_record_id).trim(),
        created_at: record.created_at ?? null,
        updated_at: record.updated_at ?? null,
    };
}

function normalizeSalesChannel(record) {
    return {
        id: record.id,
        channel_key: normalizeChannelKey(record.channel_key),
        channel_name: sanitizeText(record.channel_name).trim(),
        description: sanitizeText(record.description).trim(),
        created_at: record.created_at ?? null,
        updated_at: record.updated_at ?? null,
    };
}

function computeLineCapaTotal(hourlyCapa, dailyOperatingHours, operatingDays) {
    const hourly = Math.max(toNumber(hourlyCapa), 0);
    const dailyHours = Math.max(toNumber(dailyOperatingHours), 0);
    const days = Math.max(toNumber(operatingDays), 0);
    if (hourly === 0 || dailyHours === 0 || days === 0) {
        return 0;
    }
    return hourly * dailyHours * days;
}

function normalizeLineCapaPlan(record) {
    const productionLine = sanitizeText(record.production_line).trim();
    const month = sanitizeText(record.month ?? record.plan_month ?? '').trim();
    const lineCategory = sanitizeText(record.line_category ?? record.category ?? '').trim();
    const hourlyCapa = toNumber(record.daily_capa);
    const dailyHours = (() => {
        const value = toNumber(record.daily_operating_hours);
        if (Number.isFinite(value) && value > 0) {
            return value;
        }
        const legacy = toNumber(record.operating_hours ?? record.downtime_days);
        return Number.isFinite(legacy) && legacy > 0 ? legacy : 0;
    })();
    const operatingDays = toNumber(record.planned_operating_days);
    const rawComputed = toNumber(record.computed_capa);
    const computed = Number.isFinite(rawComputed)
        ? rawComputed
        : computeLineCapaTotal(hourlyCapa, dailyHours, operatingDays);
    return {
        id: record.id,
        line_category: lineCategory,
        production_line: productionLine,
        month,
        daily_capa: hourlyCapa,
        daily_operating_hours: dailyHours,
        planned_operating_days: operatingDays,
        computed_capa: computed,
        note: sanitizeText(record.note).trim(),
        created_at: record.created_at ?? null,
        updated_at: record.updated_at ?? null,
    };
}

function getNormalizedItemCode(value) {
    return sanitizeText(value).trim().toLowerCase();
}

function normalizeLineItemMaster(record) {
    if (!record) {
        return {
            id: '',
            item_code: '',
            production_line: '',
            hourly_throughput: 0,
            created_at: null,
            updated_at: null,
        };
    }

    const itemCode = sanitizeText(record.item_code).trim();
    const productionLine = sanitizeText(record.production_line).trim();
    const hourlyRaw = toNumber(record.hourly_throughput ?? record.hourly_capacity ?? record.daily_capa);
    const hourlyThroughput = Number.isFinite(hourlyRaw) && hourlyRaw > 0 ? hourlyRaw : 0;

    return {
        id: record.id,
        item_code: itemCode,
        production_line: productionLine,
        hourly_throughput: hourlyThroughput,
        created_at: record.created_at ?? null,
        updated_at: record.updated_at ?? null,
    };
}

function buildLineItemMasterIndex(records) {
    const index = new Map();
    (records || []).forEach((master) => {
        if (!master || !master.item_code) return;
        const key = getNormalizedItemCode(master.item_code);
        if (key) {
            index.set(key, master);
        }
    });
    return index;
}

function getUniqueLineCategoriesFromMasters(masters) {
    const categories = new Set();
    (masters || []).forEach((master) => {
        const category = sanitizeText(master.line_category ?? master.category ?? '').trim();
        if (category) {
            categories.add(category);
        }
    });
    return Array.from(categories).sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));
}

function getUniqueLinesFromMasters(masters) {
    const lines = new Set();
    (masters || []).forEach((master) => {
        const line = sanitizeText(master.production_line).trim();
        if (line) {
            lines.add(line);
        }
    });
    return Array.from(lines).sort();
}

function normalizeMaterialLinkage(record) {
    if (!record) {
        return {
            id: '',
            hierarchy_name: '',
            legacy_item_code: '',
            legacy_item_name: '',
            renewal_item_code: '',
            renewal_item_name: '',
            renewal_item_code_1: '',
            renewal_item_name_1: '',
            renewal_item_code_2: '',
            renewal_item_name_2: '',
            renewal_item_code_3: '',
            renewal_item_name_3: '',
            renewal_item_code_4: '',
            renewal_item_name_4: '',
            renewal_item_code_5: '',
            renewal_item_name_5: '',
            effective_month: '',
            note: '',
            is_active: true,
            created_at: null,
            updated_at: null,
            created_by: '',
            updated_by: '',
        };
    }

    /* renewal_item_code_1 이 있으면 새 테이블(3세트) 데이터, 없으면 기존 테이블 */
    const isNewFormat = record.renewal_item_code_1 !== undefined && record.renewal_item_code_1 !== null;

    return {
        id: record.id,
        hierarchy_name: sanitizeText(record.hierarchy_name ?? '').trim(),
        legacy_item_code: sanitizeText(record.legacy_item_code).trim(),
        legacy_item_name: sanitizeText(record.legacy_item_name).trim(),
        /* 하위 호환: 기존 테이블의 renewal_item_code → renewal_item_code_1 로 매핑 */
        renewal_item_code: isNewFormat
            ? sanitizeText(record.renewal_item_code_1).trim()
            : sanitizeText(record.renewal_item_code).trim(),
        renewal_item_name: isNewFormat
            ? sanitizeText(record.renewal_item_name_1).trim()
            : sanitizeText(record.renewal_item_name).trim(),
        renewal_item_code_1: sanitizeText(record.renewal_item_code_1 ?? record.renewal_item_code ?? '').trim(),
        renewal_item_name_1: sanitizeText(record.renewal_item_name_1 ?? record.renewal_item_name ?? '').trim(),
        renewal_item_code_2: sanitizeText(record.renewal_item_code_2 ?? '').trim(),
        renewal_item_name_2: sanitizeText(record.renewal_item_name_2 ?? '').trim(),
        renewal_item_code_3: sanitizeText(record.renewal_item_code_3 ?? '').trim(),
        renewal_item_name_3: sanitizeText(record.renewal_item_name_3 ?? '').trim(),
        renewal_item_code_4: sanitizeText(record.renewal_item_code_4 ?? '').trim(),
        renewal_item_name_4: sanitizeText(record.renewal_item_name_4 ?? '').trim(),
        renewal_item_code_5: sanitizeText(record.renewal_item_code_5 ?? '').trim(),
        renewal_item_name_5: sanitizeText(record.renewal_item_name_5 ?? '').trim(),
        effective_month: normalizeMonthValue(record.effective_month),
        note: sanitizeText(record.note ?? '').trim(),
        is_active: record.is_active !== undefined ? Boolean(record.is_active) : true,
        created_at: record.created_at ?? null,
        updated_at: record.updated_at ?? null,
        created_by: sanitizeText(record.created_by ?? '').trim(),
        updated_by: sanitizeText(record.updated_by ?? '').trim(),
    };
}

function createMaterialLinkageResolver(linkages) {
    const forward = new Map();
    const reverse = new Map();
    const nameIndex = new Map();
    const list = Array.isArray(linkages) ? linkages : [];

    list.forEach((entry) => {
        if (!entry) return;
        const legacyCode = sanitizeText(entry.legacy_item_code).trim();
        const renewalCode = sanitizeText(entry.renewal_item_code).trim();
        if (!legacyCode || !renewalCode || legacyCode === renewalCode) {
            return;
        }
        forward.set(legacyCode, renewalCode);
        if (!reverse.has(renewalCode)) {
            reverse.set(renewalCode, new Set());
        }
        reverse.get(renewalCode).add(legacyCode);
        if (entry.legacy_item_name) {
            nameIndex.set(legacyCode, sanitizeText(entry.legacy_item_name).trim());
        }
        if (entry.renewal_item_name) {
            nameIndex.set(renewalCode, sanitizeText(entry.renewal_item_name).trim());
        }
    });

    const cache = new Map();
    const GUARD_LIMIT = 50;

    function resolve(code) {
        const normalized = sanitizeText(code).trim();
        if (!normalized) return '';
        if (cache.has(normalized)) {
            return cache.get(normalized);
        }
        let current = normalized;
        const visited = new Set();
        let step = 0;
        while (forward.has(current) && step < GUARD_LIMIT) {
            if (visited.has(current)) {
                break;
            }
            visited.add(current);
            const next = forward.get(current);
            if (!next) break;
            current = next;
            step += 1;
        }
        if (step >= GUARD_LIMIT) {
            console.warn('리뉴얼 자재 연결 해석 중 순환 또는 긴 연결 체인이 감지되었습니다.', normalized);
        }
        const canonical = current;
        visited.add(normalized);
        visited.forEach((value) => cache.set(value, canonical));
        cache.set(canonical, canonical);
        return canonical;
    }

    function collectAncestors(code, result = new Set(), depth = 0) {
        if (depth > GUARD_LIMIT) return result;
        const parents = reverse.get(code);
        if (!parents) return result;
        parents.forEach((parent) => {
            if (!result.has(parent)) {
                result.add(parent);
                collectAncestors(parent, result, depth + 1);
            }
        });
        return result;
    }

    function getGroup(code) {
        const canonical = resolve(code);
        const ancestors = collectAncestors(canonical, new Set());
        ancestors.add(canonical);
        return ancestors;
    }

    function getName(code, fallback = '') {
        const canonical = resolve(code);
        if (nameIndex.has(canonical)) {
            return nameIndex.get(canonical);
        }
        if (nameIndex.has(code)) {
            return nameIndex.get(code);
        }
        return fallback || canonical;
    }

    function getAllCodes() {
        const codes = new Set();
        forward.forEach((value, key) => {
            codes.add(key);
            codes.add(value);
        });
        return codes;
    }

    return {
        forward,
        reverse,
        resolve,
        getGroup,
        getName,
        getAllCodes,
    };
}

function annotateProductionRecordsWithCanonical(records, resolver) {
    if (!Array.isArray(records) || records.length === 0) {
        return Array.isArray(records) ? records.slice() : [];
    }
    return records.map((record) => {
        if (!record) return record;
        const canonicalCode = resolver ? resolver.resolve(record.item_code) : sanitizeText(record.item_code).trim();
        const canonicalName = resolver ? resolver.getName(record.item_code, record.item_name) : sanitizeText(record.item_name).trim();
        return {
            ...record,
            canonical_item_code: canonicalCode,
            canonical_item_name: canonicalName,
        };
    });
}

function annotateSalesUploadsWithCanonical(records, resolver) {
    if (!Array.isArray(records) || records.length === 0) {
        return Array.isArray(records) ? records.slice() : [];
    }
    return records.map((record) => {
        if (!record) return record;
        const canonicalCode = resolver ? resolver.resolve(record.item_code) : sanitizeText(record.item_code).trim();
        return {
            ...record,
            canonical_item_code: canonicalCode,
        };
    });
}

function buildItemCanonicalIndex(dataSets, resolver) {
    const map = new Map();
    const addCode = (code) => {
        const normalized = sanitizeText(code).trim();
        if (!normalized) return;
        const canonical = resolver ? resolver.resolve(normalized) : normalized;
        if (!map.has(normalized)) {
            map.set(normalized, canonical);
        }
    };

    (Array.isArray(dataSets) ? dataSets : []).forEach((records) => {
        (records || []).forEach((record) => {
            if (!record) return;
            addCode(record.item_code);
        });
    });

    if (resolver && typeof resolver.getAllCodes === 'function') {
        resolver.getAllCodes().forEach((code) => addCode(code));
    }

    return map;
}

function buildCanonicalNameIndex(records, resolver) {
    const map = new Map();
    (records || []).forEach((record) => {
        if (!record) return;
        const canonical = resolver ? resolver.resolve(record.item_code) : sanitizeText(record.item_code).trim();
        const name = resolver ? resolver.getName(record.item_code, record.item_name) : sanitizeText(record.item_name).trim();
        if (canonical && name && !map.has(canonical)) {
            map.set(canonical, name);
        }
    });
    if (resolver && resolver.forward instanceof Map) {
        resolver.forward.forEach((value, key) => {
            const canonical = resolver.resolve(key);
            const name = resolver.getName(value, '') || resolver.getName(key, '');
            if (canonical && name && !map.has(canonical)) {
                map.set(canonical, name);
            }
        });
    }
    return map;
}

function getRecordCanonicalCode(record) {
    if (!record) return '';
    return sanitizeText(record.canonical_item_code ?? record.item_code).trim();
}

function getRecordCanonicalName(record) {
    if (!record) return '';
    const name = record.canonical_item_name ?? record.item_name;
    return sanitizeText(name).trim();
}

function getMaterialNameFromState(code) {
    const normalized = sanitizeText(code).trim();
    if (!normalized) return '';
    const canonical = state.itemCanonicalMap instanceof Map
        ? (state.itemCanonicalMap.get(normalized) || normalized)
        : normalized;
    if (state.materialCanonicalNameIndex instanceof Map && state.materialCanonicalNameIndex.has(canonical)) {
        return state.materialCanonicalNameIndex.get(canonical);
    }
    const rawRecord = (state.rawData || []).find((record) => sanitizeText(record.item_code).trim() === normalized);
    if (rawRecord && rawRecord.item_name) {
        return sanitizeText(rawRecord.item_name).trim();
    }
    return '';
}

function populateMaterialCodeOptions() {
    if (!dom.materialRenewal || !dom.materialRenewal.datalist) return;
    const datalist = dom.materialRenewal.datalist;
    const codes = new Set();

    if (state.itemCanonicalMap instanceof Map) {
        state.itemCanonicalMap.forEach((canonical, original) => {
            if (original) codes.add(original);
            if (canonical) codes.add(canonical);
        });
    }

    (state.materialLinkages || []).forEach((link) => {
        if (!link) return;
        const legacy = sanitizeText(link.legacy_item_code).trim();
        const renewal = sanitizeText(link.renewal_item_code).trim();
        if (legacy) codes.add(legacy);
        if (renewal) codes.add(renewal);
    });

    (state.renewalMaterialLinkages || []).forEach((link) => {
        if (!link) return;
        const legacy = sanitizeText(link.legacy_item_code).trim();
        if (legacy) codes.add(legacy);
        for (let i = 1; i <= 5; i++) {
            const code = sanitizeText(link[`renewal_item_code_${i}`] ?? '').trim();
            if (code) codes.add(code);
        }
    });

    (state.rawData || []).forEach((record) => {
        if (!record) return;
        const code = sanitizeText(record.item_code).trim();
        if (code) {
            codes.add(code);
        }
    });

    const sorted = Array.from(codes)
        .filter(Boolean)
        .sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));

    datalist.innerHTML = '';
    sorted.forEach((code) => {
        const option = document.createElement('option');
        option.value = code;
        const name = getMaterialNameFromState(code);
        option.textContent = name ? `${code} · ${name}` : code;
        datalist.appendChild(option);
    });
}

function renderMaterialRenewalTable() {
    if (!dom.materialRenewal || !dom.materialRenewal.tableBody) return;
    const tbody = dom.materialRenewal.tableBody;
    const emptyState = dom.materialRenewal.empty;
    const filterCountEl = document.getElementById('renewal-filter-count');

    /* 새 테이블(renewal_material_linkages) 데이터 우선, 없으면 기존 material_linkages 사용 */
    const renewalLinkages = Array.isArray(state.renewalMaterialLinkages) ? state.renewalMaterialLinkages : [];
    const legacyLinkages = Array.isArray(state.materialLinkages) ? state.materialLinkages : [];
    const linkages = renewalLinkages.length > 0 ? renewalLinkages : legacyLinkages;

    console.log('[리뉴얼자재] renewalLinkages:', renewalLinkages.length, '건, legacyLinkages:', legacyLinkages.length, '건, 표시:', linkages.length, '건');

    tbody.innerHTML = '';

    if (!linkages || linkages.length === 0) {
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        if (filterCountEl) filterCountEl.textContent = '';
        return;
    }

    /* ── 코드 검색 필터 적용 ── */
    const filterInput = document.getElementById('renewal-code-filter');
    const filterKeyword = (filterInput?.value || '').trim().toUpperCase();
    const filtered = filterKeyword
        ? linkages.filter((entry) => {
            if (!entry) return false;
            const codes = [
                entry.legacy_item_code,
                entry.renewal_item_code_1 ?? entry.renewal_item_code,
                entry.renewal_item_code_2,
                entry.renewal_item_code_3,
                entry.renewal_item_code_4,
                entry.renewal_item_code_5,
            ];
            return codes.some((code) => {
                const c = sanitizeText(code ?? '').trim().toUpperCase();
                return c && c.includes(filterKeyword);
            });
        })
        : linkages;

    if (filterCountEl) {
        filterCountEl.textContent = filterKeyword
            ? `${filtered.length} / ${linkages.length}건`
            : `전체 ${linkages.length}건`;
    }

    if (!filtered.length) {
        if (emptyState) {
            emptyState.textContent = filterKeyword
                ? `"${filterInput.value}" 코드를 포함하는 데이터가 없습니다.`
                : 'SAP에서 수신된 리뉴얼 자재 연결 데이터가 없습니다.';
            emptyState.classList.remove('hidden');
        }
        return;
    }

    if (emptyState) {
        emptyState.classList.add('hidden');
    }

    const fragment = document.createDocumentFragment();

    filtered.forEach((entry) => {
        if (!entry) return;
        const row = document.createElement('tr');
        if (entry.id) {
            row.dataset.linkageId = entry.id;
        }

        const hierarchyName = sanitizeText(entry.hierarchy_name ?? '').trim();
        const legacyCode = sanitizeText(entry.legacy_item_code).trim();
        const legacyName = sanitizeText(entry.legacy_item_name).trim() || getMaterialNameFromState(legacyCode) || '-';

        const renewalCode1 = sanitizeText(entry.renewal_item_code_1 ?? entry.renewal_item_code ?? '').trim();
        const renewalName1 = sanitizeText(entry.renewal_item_name_1 ?? entry.renewal_item_name ?? '').trim() || (renewalCode1 ? getMaterialNameFromState(renewalCode1) : '') || '-';
        const renewalCode2 = sanitizeText(entry.renewal_item_code_2 ?? '').trim();
        const renewalName2 = sanitizeText(entry.renewal_item_name_2 ?? '').trim() || (renewalCode2 ? getMaterialNameFromState(renewalCode2) : '') || '-';
        const renewalCode3 = sanitizeText(entry.renewal_item_code_3 ?? '').trim();
        const renewalName3 = sanitizeText(entry.renewal_item_name_3 ?? '').trim() || (renewalCode3 ? getMaterialNameFromState(renewalCode3) : '') || '-';
        const renewalCode4 = sanitizeText(entry.renewal_item_code_4 ?? '').trim();
        const renewalName4 = sanitizeText(entry.renewal_item_name_4 ?? '').trim() || (renewalCode4 ? getMaterialNameFromState(renewalCode4) : '') || '-';
        const renewalCode5 = sanitizeText(entry.renewal_item_code_5 ?? '').trim();
        const renewalName5 = sanitizeText(entry.renewal_item_name_5 ?? '').trim() || (renewalCode5 ? getMaterialNameFromState(renewalCode5) : '') || '-';

        /* 생성(변경) 일자·시간 계산: updated_at 우선, 없으면 created_at */
        const changeTimestamp = entry.updated_at || entry.created_at || null;
        let changeDate = '-';
        let changeTime = '-';
        if (changeTimestamp) {
            try {
                const dt = new Date(changeTimestamp);
                if (!isNaN(dt.getTime())) {
                    changeDate = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
                    changeTime = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}:${String(dt.getSeconds()).padStart(2, '0')}`;
                }
            } catch (e) { /* ignore */ }
        }

        const textCells = [
            hierarchyName || '-',
            legacyCode || '-',
            legacyName,
            renewalCode1 || '-',
            renewalName1,
            renewalCode2 || '-',
            renewalName2,
            renewalCode3 || '-',
            renewalName3,
            renewalCode4 || '-',
            renewalName4,
            renewalCode5 || '-',
            renewalName5,
        ];

        textCells.forEach((value) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        /* 생성(변경)일자, 생성(변경)시간 */
        [changeDate, changeTime].forEach((value) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        fragment.appendChild(row);
    });

    tbody.appendChild(fragment);
}

function serializeMaterialRenewalForm() {
    if (!dom.materialRenewal || !dom.materialRenewal.form) return null;
    const legacyCode = sanitizeText(dom.materialRenewal.legacyCode ? dom.materialRenewal.legacyCode.value : '').trim();
    const renewalCode = sanitizeText(dom.materialRenewal.renewalCode ? dom.materialRenewal.renewalCode.value : '').trim();
    const effectiveMonth = normalizeMonthValue(dom.materialRenewal.effectiveMonth ? dom.materialRenewal.effectiveMonth.value : '');
    const legacyNameInput = sanitizeText(dom.materialRenewal.legacyName ? dom.materialRenewal.legacyName.value : '').trim();
    const renewalNameInput = sanitizeText(dom.materialRenewal.renewalName ? dom.materialRenewal.renewalName.value : '').trim();

    return {
        legacy_item_code: legacyCode,
        legacy_item_name: legacyNameInput || getMaterialNameFromState(legacyCode),
        renewal_item_code: renewalCode,
        renewal_item_name: renewalNameInput || getMaterialNameFromState(renewalCode),
        effective_month: effectiveMonth,
        note: sanitizeText(dom.materialRenewal.note ? dom.materialRenewal.note.value : '').trim(),
    };
}

function validateMaterialRenewalData(data, options = {}) {
    if (!data) return false;
    if (!data.legacy_item_code) {
        alert('기존 자재 코드를 입력하세요.');
        return false;
    }
    if (!data.renewal_item_code) {
        alert('리뉴얼 자재 코드를 입력하세요.');
        return false;
    }
    if (data.legacy_item_code === data.renewal_item_code) {
        alert('기존 자재 코드와 리뉴얼 자재 코드는 서로 달라야 합니다.');
        return false;
    }
    const editingId = options.editingId || null;
    const duplicate = (state.materialLinkages || []).find((link) =>
        link
        && sanitizeText(link.legacy_item_code).trim() === data.legacy_item_code
        && sanitizeText(link.renewal_item_code).trim() === data.renewal_item_code
        && (!editingId || link.id !== editingId));
    if (duplicate) {
        alert('이미 동일한 자재 연결이 등록되어 있습니다.');
        return false;
    }
    return true;
}

function resetMaterialRenewalForm() {
    if (!dom.materialRenewal || !dom.materialRenewal.form) return;
    dom.materialRenewal.form.reset();
    if (dom.materialRenewal.recordId) {
        dom.materialRenewal.recordId.value = '';
    }
    if (dom.materialRenewal.legacyName) {
        dom.materialRenewal.legacyName.dataset.manual = 'false';
    }
    if (dom.materialRenewal.renewalName) {
        dom.materialRenewal.renewalName.dataset.manual = 'false';
    }
    if (dom.materialRenewal.saveButton) {
        dom.materialRenewal.saveButton.textContent = '연결 저장';
    }
    state.materialRenewalForm.editingId = null;
}

function loadMaterialRenewalIntoForm(id, options = {}) {
    if (!dom.materialRenewal || !dom.materialRenewal.form || !id) return;
    const target = (state.materialLinkages || []).find((entry) => entry && entry.id === id);
    if (!target) {
        alert('선택한 리뉴얼 연결 정보를 찾을 수 없습니다.');
        return;
    }

    state.materialRenewalForm.editingId = id;
    if (dom.materialRenewal.recordId) {
        dom.materialRenewal.recordId.value = id;
    }
    if (dom.materialRenewal.legacyCode) {
        dom.materialRenewal.legacyCode.value = sanitizeText(target.legacy_item_code).trim();
    }
    if (dom.materialRenewal.legacyName) {
        const legacyName = sanitizeText(target.legacy_item_name).trim() || getMaterialNameFromState(target.legacy_item_code);
        dom.materialRenewal.legacyName.value = legacyName;
        dom.materialRenewal.legacyName.dataset.manual = 'false';
    }
    if (dom.materialRenewal.renewalCode) {
        dom.materialRenewal.renewalCode.value = sanitizeText(target.renewal_item_code).trim();
    }
    if (dom.materialRenewal.renewalName) {
        const renewalName = sanitizeText(target.renewal_item_name).trim() || getMaterialNameFromState(target.renewal_item_code);
        dom.materialRenewal.renewalName.value = renewalName;
        dom.materialRenewal.renewalName.dataset.manual = 'false';
    }
    if (dom.materialRenewal.effectiveMonth) {
        dom.materialRenewal.effectiveMonth.value = sanitizeText(target.effective_month).trim();
    }
    if (dom.materialRenewal.note) {
        dom.materialRenewal.note.value = sanitizeText(target.note).trim();
    }
    if (dom.materialRenewal.saveButton) {
        dom.materialRenewal.saveButton.textContent = '연결 수정';
    }

    if (options.scroll !== false) {
        requestAnimationFrame(() => {
            dom.materialRenewal.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}

function handleMaterialCodeAutoFill(event) {
    if (!event || !event.target || !dom.materialRenewal) return;
    const input = event.target;
    const code = sanitizeText(input.value).trim();
    const name = getMaterialNameFromState(code);
    if (!name) return;
    if (input === dom.materialRenewal.legacyCode && dom.materialRenewal.legacyName) {
        if (!sanitizeText(dom.materialRenewal.legacyName.value).trim()) {
            dom.materialRenewal.legacyName.value = name;
            dom.materialRenewal.legacyName.dataset.manual = 'false';
        }
    } else if (input === dom.materialRenewal.renewalCode && dom.materialRenewal.renewalName) {
        if (!sanitizeText(dom.materialRenewal.renewalName.value).trim()) {
            dom.materialRenewal.renewalName.value = name;
            dom.materialRenewal.renewalName.dataset.manual = 'false';
        }
    }
}

async function handleMaterialRenewalFormSubmit(event) {
    event.preventDefault();
    const data = serializeMaterialRenewalForm();
    const editingId = state.materialRenewalForm.editingId;
    if (!validateMaterialRenewalData(data, { editingId })) {
        return;
    }

    const payload = {
        legacy_item_code: data.legacy_item_code,
        legacy_item_name: data.legacy_item_name,
        renewal_item_code: data.renewal_item_code,
        renewal_item_name: data.renewal_item_name,
        effective_month: data.effective_month,
        note: data.note,
    };

    const submitButton = dom.materialRenewal && dom.materialRenewal.saveButton ? dom.materialRenewal.saveButton : null;
    if (submitButton) {
        submitButton.setAttribute('disabled', 'disabled');
        submitButton.textContent = editingId ? '수정 중...' : '저장 중...';
    }

    try {
        if (editingId) {
            await updateMaterialLinkageRecord(editingId, payload);
            alert('리뉴얼 자재 연결이 수정되었습니다.');
        } else {
            await createMaterialLinkageRecord(payload);
            alert('리뉴얼 자재 연결이 등록되었습니다.');
        }
        resetMaterialRenewalForm();
        await loadData();
    } catch (error) {
        console.error(error);
        alert('리뉴얼 자재 연결을 저장하는 중 오류가 발생했습니다. 입력 값을 확인하거나 잠시 후 다시 시도하세요.');
    } finally {
        if (submitButton) {
            submitButton.removeAttribute('disabled');
            submitButton.textContent = state.materialRenewalForm.editingId ? '연결 수정' : '연결 저장';
        }
    }
}

function handleMaterialRenewalReset(event) {
    if (event) {
        event.preventDefault();
    }
    resetMaterialRenewalForm();
}

function handleMaterialRenewalTableClick(event) {
    if (!event || !event.target) return;
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action } = button.dataset;
    const linkageId = button.dataset.linkageId;
    if (!action || !linkageId) return;
    if (action === 'toggle-active') {
        handleRenewalMaterialToggleActive(linkageId);
    } else if (action === 'edit') {
        loadMaterialRenewalIntoForm(linkageId);
    } else if (action === 'delete') {
        handleMaterialRenewalDelete(linkageId);
    }
}

async function handleMaterialRenewalDelete(id) {
    if (!id) return;
    const target = (state.materialLinkages || []).find((link) => link && link.id === id);
    const legacyCode = target ? sanitizeText(target.legacy_item_code).trim() : '';
    const renewalCode = target ? sanitizeText(target.renewal_item_code).trim() : '';
    const confirmed = confirm(`기존 자재 ${legacyCode || '-'} → 리뉴얼 자재 ${renewalCode || '-'} 연결을 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
        await deleteMaterialLinkageRecord(id);
        if (state.materialRenewalForm.editingId === id) {
            resetMaterialRenewalForm();
        }
        alert('리뉴얼 자재 연결이 삭제되었습니다.');
        await loadData();
    } catch (error) {
        console.error(error);
        alert('리뉴얼 자재 연결을 삭제하는 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.');
    }
}

async function handleRenewalMaterialToggleActive(id) {
    if (!id) return;
    const target = (state.renewalMaterialLinkages || []).find((link) => link && String(link.id) === String(id));
    const currentStatus = target ? (target.is_active !== false ? '활성' : '비활성') : '알 수 없음';
    const newStatus = target && target.is_active !== false ? '비활성' : '활성';
    const legacyCode = target ? sanitizeText(target.legacy_item_code).trim() : '';
    const confirmed = confirm(`기존 자재 ${legacyCode || '-'}의 활성화 상태를 ${newStatus}(으)로 변경하시겠습니까?`);
    if (!confirmed) return;

    try {
        const response = await fetch(`/sales-api/renewal-material-linkages/${id}/toggle-active`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error('활성화 상태 변경 실패');
        }
        alert(`${legacyCode || '-'} 활성화 상태가 ${newStatus}(으)로 변경되었습니다.`);
        await loadData();
    } catch (error) {
        console.error(error);
        alert('활성화 상태를 변경하는 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.');
    }
}

async function handleEffectiveMonthChange(event) {
    if (!event || !event.target) return;
    const input = event.target;
    const id = input.dataset.linkageId;
    if (!id) return;
    const newMonth = input.value || '';

    try {
        const response = await fetch(`/sales-api/renewal-material-linkages/${id}/effective-month`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ effective_month: newMonth }),
        });
        if (!response.ok) {
            throw new Error('적용 시작 월 저장 실패');
        }
        /* state 즉시 반영 (전체 reload 없이) */
        const target = (state.renewalMaterialLinkages || []).find((link) => link && String(link.id) === String(id));
        if (target) {
            target.effective_month = newMonth;
        }
        input.classList.add('save-success');
        setTimeout(() => input.classList.remove('save-success'), 1200);
    } catch (error) {
        console.error(error);
        alert('적용 시작 월을 저장하는 중 오류가 발생했습니다.');
        /* 원래 값으로 되돌리기 */
        const target = (state.renewalMaterialLinkages || []).find((link) => link && String(link.id) === String(id));
        if (target) {
            input.value = target.effective_month || '';
        }
    }
}

function buildLineDowntimeIndex(records) {
    const index = new Map();
    const pushPlan = (key, plan) => {
        if (!key) return;
        const list = index.get(key) || [];
        list.push(plan);
        index.set(key, list);
    };

    (records || []).forEach((plan) => {
        if (!plan) return;
        const baseKey = getLineKey(plan.production_line, plan.month);
        const compositeKey = getLineCompositeKey(plan.production_line, plan.line_category, plan.month);
        if (compositeKey) {
            pushPlan(compositeKey, plan);
        }
        if (!compositeKey || compositeKey !== baseKey) {
            pushPlan(baseKey, plan);
        }
    });
    return index;
}

function selectLineCapaPlan(plans, category = '') {
    if (!Array.isArray(plans) || plans.length === 0) return null;
    const normalizedCategory = sanitizeText(category).trim().toLowerCase();
    if (normalizedCategory) {
        const matched = plans.find((plan) => sanitizeText(plan.line_category).trim().toLowerCase() === normalizedCategory);
        if (matched) return matched;
    }
    if (plans.length > 1) {
        const withCategory = plans.find((plan) => sanitizeText(plan.line_category).trim());
        if (withCategory) return withCategory;
    }
    return plans[0];
}

function findLineDowntimePlan(line, month, category = '') {
    if (!(state.lineDowntimeIndex instanceof Map)) return null;
    const compositeKey = getLineCompositeKey(line, category, month);
    const baseKey = getLineKey(line, month);
    if (!compositeKey && !baseKey) return null;
    let plans = compositeKey ? state.lineDowntimeIndex.get(compositeKey) : null;
    if (!plans || plans.length === 0) {
        plans = baseKey ? state.lineDowntimeIndex.get(baseKey) : null;
    }
    return selectLineCapaPlan(plans, category);
}

function setCapacityHint(message = '', tone = 'muted') {
    if (!dom.capacityLimitHint) return;
    dom.capacityLimitHint.classList.remove('success', 'warning');
    if (!message) {
        dom.capacityLimitHint.textContent = '';
        dom.capacityLimitHint.hidden = true;
        return;
    }
    dom.capacityLimitHint.textContent = message;
    if (tone === 'success') {
        dom.capacityLimitHint.classList.add('success');
    } else if (tone === 'warning') {
        dom.capacityLimitHint.classList.add('warning');
    }
    dom.capacityLimitHint.hidden = false;
}

function setCapacityDisplay(value) {
    if (!dom.capacityLimitDisplay) return;
    if (Number.isFinite(value)) {
        const numericValue = Math.max(0, Number(value));
        dom.capacityLimitDisplay.textContent = `${formatNumber(numericValue)} EA`;
        dom.capacityLimitDisplay.classList.remove('empty');
    } else {
        dom.capacityLimitDisplay.textContent = '등록된 CAPA 없음';
        dom.capacityLimitDisplay.classList.add('empty');
    }
}

function setSalesPlanDisplay(value, options = {}) {
    const numericValue = Number(value);
    const hasValue = Number.isFinite(numericValue) && numericValue > 0;
    const source = sanitizeText(options.source || '').trim();
    const breakdown = Array.isArray(options.breakdown) ? options.breakdown : null;

    if (dom.salesPlanHidden) {
        if (hasValue) {
            dom.salesPlanHidden.value = numericValue;
        } else {
            dom.salesPlanHidden.value = 0;
        }
    }

    if (!dom.salesPlanDisplay) return;

    dom.salesPlanDisplay.classList.remove('empty');
    dom.salesPlanDisplay.removeAttribute('title');

    if (dom.salesPlanField) {
        dom.salesPlanField.classList.remove('auto-filled');
        if (dom.salesPlanField.dataset) {
            delete dom.salesPlanField.dataset.salesSource;
        }
    }

    if (hasValue) {
        dom.salesPlanDisplay.textContent = `${formatNumber(numericValue)} BOX`;
        if (dom.salesPlanDisplay.classList.contains('empty')) {
            dom.salesPlanDisplay.classList.remove('empty');
        }
        if (dom.salesPlanField) {
            dom.salesPlanField.classList.add('auto-filled');
            if (dom.salesPlanField.dataset) {
                dom.salesPlanField.dataset.salesSource = source || 'auto';
            }
        }

        const tooltipParts = [];
        if (source === 'uploaded') {
            tooltipParts.push('판매계획 업로드 데이터 기준 자동 반영');
        } else if (source === 'manual') {
            tooltipParts.push('직접 입력된 판매 계획 값');
        }
        if (breakdown && breakdown.length > 0) {
            const breakdownText = breakdown
                .map((item) => {
                    const channelLabel = sanitizeText(item.display || item.channel_name || item.channel || '채널 미지정');
                    const parts = [];
                    if (Number.isFinite(item.standardQuantity) && item.standardQuantity > 0) {
                        parts.push(`스탠다드 ${formatNumber(item.standardQuantity)} BOX`);
                    }
                    if (Number.isFinite(item.promotionQuantity) && item.promotionQuantity > 0) {
                        parts.push(`프로모션 ${formatNumber(item.promotionQuantity)} BOX`);
                    }
                    const detail = parts.length > 0 ? ` (${parts.join(' · ')})` : '';
                    const quantity = Number.isFinite(item.quantity) ? formatNumber(item.quantity) : '-';
                    return `${channelLabel}: ${quantity} BOX${detail}`;
                })
                .join(' • ');
            if (breakdownText) {
                tooltipParts.push(`채널별 상세: ${breakdownText}`);
            }
        }
        if (tooltipParts.length > 0) {
            dom.salesPlanDisplay.setAttribute('title', tooltipParts.join(' | '));
        }
    } else {
        dom.salesPlanDisplay.textContent = '판매계획 업로드 데이터 없음';
        dom.salesPlanDisplay.classList.add('empty');
    }
}

function clearSalesPlanDisplay() {
    if (dom.salesPlanHidden) {
        dom.salesPlanHidden.value = 0;
    }
    if (dom.salesPlanDisplay) {
        dom.salesPlanDisplay.textContent = '판매계획 업로드 데이터 없음';
        dom.salesPlanDisplay.classList.add('empty');
        dom.salesPlanDisplay.removeAttribute('title');
    }
    if (dom.salesPlanField) {
        dom.salesPlanField.classList.remove('auto-filled');
        if (dom.salesPlanField.dataset) {
            delete dom.salesPlanField.dataset.salesSource;
        }
    }
}

function clearCapacityAutofill(options = {}) {
    if (dom.capacityLimitField) {
        dom.capacityLimitField.classList.remove('auto-filled');
    }
    if (dom.capacityLimitDisplay) {
        dom.capacityLimitDisplay.removeAttribute('title');
    }
    if (dom.capacityLimit) {
        dom.capacityLimit.value = '';
        dom.capacityLimit.classList.remove('auto-filled');
        dom.capacityLimit.removeAttribute('data-autofilled');
        delete dom.capacityLimit.dataset.autofilled;
        dom.capacityLimit.removeAttribute('title');
    }

    setCapacityDisplay(null);

    if (options.message !== undefined) {
        setCapacityHint(options.message, options.tone || 'muted');
    } else if (!options.preserveHint) {
        setCapacityHint('', 'muted');
    }
}

function updateCapacityLimitFromLinePlan() {
    if (!dom.productionLine || !dom.planMonth) return;

    const lineValue = sanitizeText(dom.productionLine.value).trim();
    const monthValue = sanitizeText(dom.planMonth.value).trim();

    if (!lineValue || !monthValue) {
        clearCapacityAutofill({ preserveHint: false });
        return;
    }

    const plan = findLineDowntimePlan(lineValue, monthValue);
    if (plan && Number.isFinite(plan.computed_capa)) {
        if (dom.capacityLimit) {
            dom.capacityLimit.value = plan.computed_capa;
            dom.capacityLimit.dataset.autofilled = 'downtime-plan';
            dom.capacityLimit.classList.add('auto-filled');
        }
        if (dom.capacityLimitField) {
            dom.capacityLimitField.classList.add('auto-filled');
        }
        setCapacityDisplay(plan.computed_capa);

        const tooltipText = '라인 CAPA · 운휴 관리에서 계산된 월 총 CAPA 값입니다.';
        if (dom.capacityLimitDisplay) {
            dom.capacityLimitDisplay.setAttribute('title', tooltipText);
        }

        const hourly = Number.isFinite(plan.daily_capa) ? formatNumber(plan.daily_capa) : '-';
        const dailyHours = Number.isFinite(plan.daily_operating_hours) ? formatNumber(plan.daily_operating_hours) : '-';
        const operatingDays = Number.isFinite(plan.planned_operating_days) ? formatNumber(plan.planned_operating_days) : '-';

        const hintParts = [
            `자동 산정: 시간당 ${hourly} EA × 일 가동 ${dailyHours}시간 × 월 가동 ${operatingDays}일`,
        ];
        setCapacityHint(hintParts.join(' / '), 'success');
        return;
    }

    clearCapacityAutofill({
        message: '등록된 라인 CAPA 계획이 없습니다. 라인 CAPA 관리에서 등록 후 다시 시도하세요.',
        tone: 'warning',
    });
}

function normalizeSalesUploadLog(record) {
    return {
        id: record.id,
        file_name: sanitizeText(record.file_name).trim(),
        checksum: sanitizeText(record.checksum).trim(),
        file_size: toNumber(record.file_size),
        row_count: toNumber(record.row_count),
        processed_count: toNumber(record.processed_count),
        merged_rows: toNumber(record.merged_rows),
        created_at: record.created_at ?? null,
        updated_at: record.updated_at ?? null,
    };
}

function getUniqueItems(records) {
    const map = new Map();
    (records || []).forEach((record) => {
        if (!record) return;
        const canonical = getRecordCanonicalCode(record);
        const fallbackCode = sanitizeText(record.item_code).trim();
        const code = canonical || fallbackCode;
        if (!code) return;
        if (!map.has(code)) {
            const name = getRecordCanonicalName(record) || fallbackCode || code;
            map.set(code, {
                code,
                name: name || '-',
            });
        }
    });
    return Array.from(map.values());
}

function getUniqueCategories(records) {
    const categories = new Set();
    records.forEach((record) => {
        const category = sanitizeText(record.category).trim();
        if (category && !isExcludedCategory(category)) {
            categories.add(category);
        }
    });
    return Array.from(categories).sort();
}

function sortMonthsAscending(values) {
    return [...values].sort((a, b) => {
        const normalizedA = sanitizeText(a).trim();
        const normalizedB = sanitizeText(b).trim();
        const matchA = normalizedA.match(/^(\d{4})-(\d{2})$/);
        const matchB = normalizedB.match(/^(\d{4})-(\d{2})$/);
        if (matchA && matchB) {
            const yearDiff = Number(matchA[1]) - Number(matchB[1]);
            if (yearDiff !== 0) return yearDiff;
            return Number(matchA[2]) - Number(matchB[2]);
        }
        if (matchA) return -1;
        if (matchB) return 1;
        return normalizedA.localeCompare(normalizedB);
    });
}

function sortMonthFilterOptions() {
    if (!dom || !dom.filters || !dom.filters.month) return;
    const select = dom.filters.month;
    const options = Array.from(select.options || []);
    if (options.length <= 1) return;

    const specialOptions = [];
    const monthOptions = [];

    options.forEach((option) => {
        const value = sanitizeText(option.value).trim();
        if (!value || value === 'all') {
            specialOptions.push(option);
        } else {
            monthOptions.push(option);
        }
    });

    if (monthOptions.length === 0) {
        select.innerHTML = '';
        specialOptions.forEach((option) => select.appendChild(option));
        return;
    }

    const monthOptionMap = new Map();
    monthOptions.forEach((option) => {
        monthOptionMap.set(option.value, option);
    });

    const sortedValues = sortMonthsAscending(Array.from(monthOptionMap.keys()));

    select.innerHTML = '';
    specialOptions.forEach((option) => select.appendChild(option));
    sortedValues.forEach((value) => {
        const option = monthOptionMap.get(value);
        if (option) {
            select.appendChild(option);
        } else {
            const fallback = document.createElement('option');
            fallback.value = value;
            fallback.textContent = value;
            select.appendChild(fallback);
        }
    });
}

function getUniqueMonths(records) {
    const months = new Set();
    records.forEach((record) => {
        const monthValue = sanitizeText(record.month).trim();
        if (monthValue) {
            months.add(monthValue);
        }
    });
    return sortMonthsAscending(Array.from(months));
}

function getUniqueMonthsFromRecords(records) {
    return getUniqueMonths(records || []);
}

function buildSalesAggregates(records, options = {}) {
    const itemNameMap = options.itemNameMap instanceof Map ? options.itemNameMap : new Map();
    const itemCategoryMap = options.itemCategoryMap instanceof Map ? options.itemCategoryMap : new Map();
    const channelIndex = options.channelIndex instanceof Map ? options.channelIndex : new Map();
    const baseMap = new Map();

    (records || []).forEach((record) => {
        if (!record) return;
        const canonicalCode = sanitizeText(record.canonical_item_code ?? record.item_code).trim();
        const key = getSalesAggregateKey(canonicalCode, record.month);
        if (!canonicalCode || !key) return;
        if (!baseMap.has(key)) {
            baseMap.set(key, {
                item_code: canonicalCode,
                months: new Set(),
                total: 0,
                standardTotal: 0,
                promotionTotal: 0,
                channels: new Map(),
            });
        }
        const entry = baseMap.get(key);
        const recordMonth = sanitizeText(record.month).trim();
        if (recordMonth) entry.months.add(recordMonth);
        const totalQuantity = Math.max(0, toNumber(record.quantity));
        const standardQuantity = Math.max(0, toNumber(record.standard_quantity));
        const promotionQuantity = Math.max(0, toNumber(record.promotion_quantity));

        entry.total += totalQuantity;
        entry.standardTotal += standardQuantity;
        entry.promotionTotal += promotionQuantity;

        const originalChannel = sanitizeText(record.channel).trim();
        const channelKey = normalizeChannelKey(originalChannel) || 'UNDEFINED';
        const existing = entry.channels.get(channelKey) || {
            quantity: 0,
            standard: 0,
            promotion: 0,
            original: originalChannel,
        };
        existing.quantity += totalQuantity;
        existing.standard += standardQuantity;
        existing.promotion += promotionQuantity;
        if (!existing.original) {
            existing.original = originalChannel;
        }
        entry.channels.set(channelKey, existing);
    });

    const aggregateList = [];
    const aggregateMap = new Map();

    baseMap.forEach((value, key) => {
        const breakdown = Array.from(value.channels.entries())
            .map(([channelKey, detail]) => {
                const info = getChannelInfo(channelIndex, channelKey);
                const normalizedKey = info ? info.channel_key : (channelKey === 'UNDEFINED' ? '' : channelKey);
                const channelName = info ? info.channel_name : '';
                const description = info ? info.description : '';
                const fallback = sanitizeText(detail.original).trim() || (normalizedKey || '채널 미지정');
                const display = channelName
                    ? `${channelName} (${normalizedKey})`
                    : fallback;
                return {
                    channel: normalizedKey || fallback,
                    channel_name: channelName,
                    description,
                    quantity: detail.quantity,
                    standardQuantity: detail.standard,
                    promotionQuantity: detail.promotion,
                    display,
                };
            })
            .sort((a, b) => {
                if (b.quantity !== a.quantity) {
                    return b.quantity - a.quantity;
                }
                return sanitizeText(a.display).localeCompare(sanitizeText(b.display));
            });

        const entry = {
            key,
            item_code: value.item_code,
            month: Array.from(value.months).sort().join(', '),
            total: value.total,
            standardTotal: value.standardTotal,
            promotionTotal: value.promotionTotal,
            channelBreakdown: breakdown,
            item_name: itemNameMap.get(value.item_code) || getMaterialNameFromState(value.item_code) || '-',
            category: (() => {
                const categoryValue = itemCategoryMap.get(value.item_code);
                const normalized = sanitizeText(categoryValue).trim();
                return normalized || '';
            })(),
        };
        aggregateList.push(entry);
        aggregateMap.set(key, entry);
    });

    aggregateList.sort((a, b) => {
        const catCompare = sanitizeText(a.category).localeCompare(sanitizeText(b.category));
        if (catCompare !== 0) return catCompare;
        return sanitizeText(a.item_code).localeCompare(sanitizeText(b.item_code));
    });

    return {
        byKey: aggregateMap,
        list: aggregateList,
    };
}

function buildMonthSequence(startMonth, length = 3) {
    const sequence = [];
    let current = sanitizeText(startMonth).trim();
    if (!current) return sequence;
    sequence.push(current);
    let previous = current;
    for (let index = 1; index < length; index += 1) {
        if (!previous) {
            sequence.push(null);
            continue;
        }
        const next = incrementMonth(previous);
        sequence.push(next);
        previous = next;
    }
    return sequence;
}

function buildAccuracyMonthSequence(baseMonth, mode = 'cumulative') {
    const normalized = sanitizeText(baseMonth).trim();
    if (!normalized) return [];

    const monthPattern = /^(\d{4})-(\d{2})$/;
    const match = normalized.match(monthPattern);
    if (!match) {
        return [];
    }

    const effectiveMode = mode === 'rolling' ? 'rolling' : 'cumulative';

    if (effectiveMode === 'rolling') {
        const months = [normalized];
        let previous = normalized;
        for (let offset = 0; offset < 3; offset += 1) {
            const prevMonth = decrementMonth(previous);
            if (!prevMonth || !monthPattern.test(prevMonth)) {
                break;
            }
            months.unshift(prevMonth);
            previous = prevMonth;
        }
        return months;
    }

    const [, yearPart, monthPart] = match;
    const year = Number(yearPart);
    const month = Number(monthPart);
    if (!Number.isFinite(year) || !Number.isFinite(month)) {
        return [];
    }

    const months = [];
    for (let m = 1; m <= month; m += 1) {
        const monthValue = String(m).padStart(2, '0');
        months.push(`${yearPart}-${monthValue}`);
    }
    return months;
}

function getUniqueLines(records) {
    const lines = new Set();
    records.forEach((record) => {
        const line = sanitizeText(record.production_line).trim();
        if (line) {
            lines.add(line);
        }
    });
    return Array.from(lines).sort();
}

function getLinePlanCategory(plan) {
    if (!plan) return '';
    return sanitizeText(plan.line_category ?? plan.category ?? '').trim();
}

function getUniqueLineCategoriesFromPlans(plans) {
    const categories = new Set();
    (plans || []).forEach((plan) => {
        const category = getLinePlanCategory(plan);
        if (category) {
            categories.add(category);
        }
    });
    return Array.from(categories).sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));
}

function getUniqueLinesFromLinePlans(plans) {
    const lines = new Set();
    (plans || []).forEach((plan) => {
        const line = sanitizeText(plan.production_line).trim();
        if (line) {
            lines.add(line);
        }
    });
    return Array.from(lines).sort();
}

function sortByMonth(records) {
    return [...records].sort((a, b) => a.month.localeCompare(b.month));
}

function sortRecordsForDisplay(records) {
    return [...records].sort((a, b) => {
        const monthCompare = sanitizeText(a.month).localeCompare(sanitizeText(b.month));
        if (monthCompare !== 0) return monthCompare;
        const categoryCompare = sanitizeText(a.category).localeCompare(sanitizeText(b.category));
        if (categoryCompare !== 0) return categoryCompare;
        const lineCompare = sanitizeText(a.production_line).localeCompare(sanitizeText(b.production_line));
        if (lineCompare !== 0) return lineCompare;
        return sanitizeText(a.item_code).localeCompare(sanitizeText(b.item_code));
    });
}

function normalizeBulkKey(key) {
    return sanitizeText(key)
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[\.]/g, '')
        .trim();
}

function normalizeBulkTarget(target) {
    const normalized = sanitizeText(target).trim().toLowerCase();
    if (normalized === BULK_TARGETS.LINE_CAPA) {
        return BULK_TARGETS.LINE_CAPA;
    }
    if (normalized === BULK_TARGETS.LINE_MASTER) {
        return BULK_TARGETS.LINE_MASTER;
    }
    if (normalized === BULK_TARGETS.RECENT_SALES) {
        return BULK_TARGETS.RECENT_SALES;
    }
    return BULK_TARGETS.PRODUCTION;
}

function getBulkTargetLabel(target = state.bulkUploadTarget) {
    const normalized = normalizeBulkTarget(target);
    if (normalized === BULK_TARGETS.LINE_CAPA) {
        return '라인 CAPA';
    }
    if (normalized === BULK_TARGETS.LINE_MASTER) {
        return '자재 마스터';
    }
    if (normalized === BULK_TARGETS.RECENT_SALES) {
        return '최근 3개월 판매실적';
    }
    return '생산계획';
}

function setBulkTarget(target, options = {}) {
    const normalized = normalizeBulkTarget(target);
    state.bulkUploadTarget = normalized;
    const shouldFocus = options.focus === true;
    if (dom.bulk && Array.isArray(dom.bulk.tabs)) {
        dom.bulk.tabs.forEach((tab) => {
            if (!tab) return;
            const isActive = normalizeBulkTarget(tab.dataset.bulkTarget) === normalized;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            if (isActive && shouldFocus) {
                tab.focus();
            }
        });
    }
    if (dom.bulk && Array.isArray(dom.bulk.panels)) {
        dom.bulk.panels.forEach((panel) => {
            if (!panel) return;
            const isActive = normalizeBulkTarget(panel.dataset.bulkTarget) === normalized;
            panel.classList.toggle('hidden', !isActive);
        });
    }
}

function incrementMonth(value) {
    const match = sanitizeText(value).trim().match(/^(\d{4})-(\d{2})$/);
    if (!match) return null;
    let year = Number(match[1]);
    let month = Number(match[2]);
    if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
    month += 1;
    if (month > 12) {
        year += 1;
        month = 1;
    }
    return `${year}-${String(month).padStart(2, '0')}`;
}

function decrementMonth(value) {
    const match = sanitizeText(value).trim().match(/^(\d{4})-(\d{2})$/);
    if (!match) return null;
    let year = Number(match[1]);
    let month = Number(match[2]);
    if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
    month -= 1;
    if (month < 1) {
        year -= 1;
        month = 12;
    }
    if (year < 0) {
        return null;
    }
    return `${year}-${String(month).padStart(2, '0')}`;
}

function generateProjectedRawRecords(rawRecords, monthsAhead = PROJECTED_MONTH_EXTENSION, overrides = state.projectedOverrides) {
    if (!Array.isArray(rawRecords) || rawRecords.length === 0 || monthsAhead <= 0) {
        return [];
    }

    const overrideMap = overrides instanceof Map ? overrides : new Map();

    const grouped = new Map();
    rawRecords.forEach((record) => {
        const key = sanitizeText(record.item_code).trim() || `__${record.id}`;
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(record);
    });

    const projections = [];

    grouped.forEach((records) => {
        if (!records || records.length === 0) return;
        records.sort((a, b) => sanitizeText(a.month).localeCompare(sanitizeText(b.month)));
        let referenceRecord = records[records.length - 1];
        const baseMonths = new Set(
            records
                .map((record) => sanitizeText(record.month).trim())
                .filter((value) => Boolean(value))
        );

        let currentMonth = sanitizeText(referenceRecord.month).trim();
        if (!currentMonth) return;

        for (let offset = 1; offset <= monthsAhead; offset += 1) {
            const nextMonth = incrementMonth(currentMonth);
            if (!nextMonth) break;
            currentMonth = nextMonth;

            if (baseMonths.has(nextMonth)) {
                const existing = records.find((record) => sanitizeText(record.month).trim() === nextMonth);
                if (existing) {
                    referenceRecord = existing;
                }
                continue;
            }

            const referenceCanonicalCode = getRecordCanonicalCode(referenceRecord);
            const referenceCanonicalName = getRecordCanonicalName(referenceRecord);
            const projected = {
                id: `projected-${sanitizeText(referenceRecord.item_code).trim() || referenceRecord.id}-${nextMonth}`,
                item_code: sanitizeText(referenceRecord.item_code).trim(),
                item_name: sanitizeText(referenceRecord.item_name).trim(),
                canonical_item_code: referenceCanonicalCode,
                canonical_item_name: referenceCanonicalName,
                category: sanitizeText(referenceRecord.category).trim(),
                production_line: sanitizeText(referenceRecord.production_line).trim(),
                vendor_name: sanitizeText(referenceRecord.vendor_name || '').trim(),
                moq: referenceRecord.moq ?? null,
                month: nextMonth,
                sales_plan: toNumber(referenceRecord.sales_plan),
                sales_actual: null, // 미래 projected 레코드는 판매실적 없음
                production_plan: toNumber(referenceRecord.production_plan),
                production_actual: 0,
                production_remaining: toNumber(referenceRecord.production_plan),
                beginning_inventory: toNumber(referenceRecord.beginning_inventory),
                available_inventory: toNullableNumber(referenceRecord.available_inventory),
                target_ending_inventory: toNumber(referenceRecord.target_ending_inventory),
                optimal_inventory_2025: toNullableNumber(referenceRecord.optimal_inventory_2025),
                capacity_limit: toNumber(referenceRecord.capacity_limit),
                notes: '',
                priority: referenceRecord.priority ?? null,
                created_at: null,
                updated_at: null,
                isProjected: true,
            };

            let overrideRemainingApplied = false;
            const overrideKey = getProjectedKey(projected.item_code, projected.month);
            if (overrideMap.has(overrideKey)) {
                const override = overrideMap.get(overrideKey) || {};
                if (override.production_plan !== undefined) {
                    projected.production_plan = toNumber(override.production_plan);
                }
                if (override.sales_plan !== undefined) {
                    projected.sales_plan = toNumber(override.sales_plan);
                }
                if (override.sales_actual !== undefined) {
                    const overrideSalesActual = parseNumberOrNull(override.sales_actual);
                    projected.sales_actual = overrideSalesActual !== null ? overrideSalesActual : null;
                }
                if (override.production_actual !== undefined) {
                    projected.production_actual = toNumber(override.production_actual);
                }
                if (override.production_remaining !== undefined) {
                    projected.production_remaining = toNumber(override.production_remaining);
                    overrideRemainingApplied = true;
                }
            }

            if (!overrideRemainingApplied) {
                projected.production_remaining = projected.production_plan - projected.production_actual;
            }

            projections.push(projected);
            records.push(projected);
            baseMonths.add(nextMonth);
            referenceRecord = projected;
        }
    });

    return projections;
}

function normalizeMonthValue(value) {
    if (value === null || value === undefined || value === '') return '';
    if (value instanceof Date) {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    }
    if (typeof value === 'number' && typeof XLSX !== 'undefined' && XLSX.SSF) {
        const dateObject = XLSX.SSF.parse_date_code(value);
        if (dateObject && dateObject.y && dateObject.m) {
            const year = dateObject.y;
            const month = String(dateObject.m).padStart(2, '0');
            return `${year}-${month}`;
        }
    }
    const text = sanitizeText(value);
    if (!text) return '';
    const match = text.match(/(\d{4})[-/.\s]?(\d{1,2})/);
    if (match) {
        return `${match[1]}-${match[2].padStart(2, '0')}`;
    }
    return '';
}

function mapProductionBulkRow(row, index) {
    const normalizedRow = {};
    const providedFields = {};
    Object.entries(row).forEach(([key, value]) => {
        const targetKey = BULK_COLUMN_MAP[normalizeBulkKey(key)];
        if (targetKey) {
            normalizedRow[targetKey] = value;
            providedFields[targetKey] = sanitizeText(value).trim() !== '';
        }
    });

    const rawActual = parseNumberOrNull(normalizedRow.production_actual);
    const rawPlan = parseNumberOrNull(normalizedRow.production_plan);
    const rawRemaining = parseNumberOrNull(normalizedRow.production_remaining);
    const productionActual = rawActual !== null ? rawActual : null;
    const productionRemaining = rawRemaining !== null
        ? rawRemaining
        : ((rawPlan !== null && productionActual !== null) ? rawPlan - productionActual : null);

    const payload = {
        item_code: sanitizeText(normalizedRow.item_code).trim(),
        item_name: sanitizeText(normalizedRow.item_name).trim(),
        category: sanitizeText(normalizedRow.category).trim(),
        production_line: sanitizeText(normalizedRow.production_line).trim(),
        month: normalizeMonthValue(normalizedRow.month),
        sales_plan: toNumber(normalizedRow.sales_plan),
        sales_actual: toNullableNumber(normalizedRow.sales_actual),
        production_plan: toNumber(normalizedRow.production_plan),
        production_actual: productionActual,
        production_remaining: productionRemaining,
        beginning_inventory: toNumber(normalizedRow.beginning_inventory),
        available_inventory: toNullableNumber(normalizedRow.available_inventory),
        target_ending_inventory: toNumber(normalizedRow.target_ending_inventory),
        optimal_inventory_2025: toNullableNumber(normalizedRow.optimal_inventory_2025),
        capacity_limit: toNumber(normalizedRow.capacity_limit),
        notes: sanitizeText(normalizedRow.notes).trim(),
    };

    const providedCategory = payload.category;
    const derivedCategory = deriveCategoryFromItemName(payload.item_name);
    payload.category = providedCategory || derivedCategory;
    payload.category = sanitizeText(payload.category).trim();

    const errors = [];
    BULK_REQUIRED_FIELDS.forEach((field) => {
        if (field === 'notes') return;
        if (field === 'month') {
            if (!payload.month) {
                errors.push('month 값이 비어 있거나 형식이 잘못되었습니다. (예: 2025-03)');
            }
            return;
        }
        if (!payload[field] && payload[field] !== 0) {
            errors.push(`${field} 값이 비어 있습니다.`);
        }
    });

    if (!payload.item_code) {
        errors.push('item_code는 필수입니다.');
    }
    if (!payload.item_name) {
        errors.push('item_name은 필수입니다.');
    }
    if (!payload.production_line) {
        errors.push('production_line은 필수입니다.');
    }

    return {
        payload,
        errors,
        rowNumber: index + 2, // assume header row is 1
        provided: providedFields,
    };
}

function resolveCanonicalItemCode(code) {
    const normalized = sanitizeText(code).trim();
    if (!normalized) return '';
    if (state.itemCanonicalMap instanceof Map && state.itemCanonicalMap.has(normalized)) {
        const canonical = sanitizeText(state.itemCanonicalMap.get(normalized)).trim();
        if (canonical) {
            return canonical;
        }
    }
    return normalized;
}

function getProductionRecordKey(itemCode, month) {
    const monthKey = sanitizeText(month).trim();
    if (!monthKey) return '';
    const canonicalCode = resolveCanonicalItemCode(itemCode);
    const normalizedCode = sanitizeText(canonicalCode).trim().toLowerCase();
    if (!normalizedCode) return '';
    return `${normalizedCode}__${monthKey}`;
}

function buildProductionRecordIndex() {
    const index = new Map();
    if (!Array.isArray(state.rawData)) {
        return index;
    }
    state.rawData.forEach((record) => {
        if (!record || !record.id || record.isProjected) return;
        const key = getProductionRecordKey(record.item_code ?? record.canonical_item_code, record.month);
        if (!key) return;
        if (!index.has(key)) {
            index.set(key, record);
            return;
        }
        const existing = index.get(key);
        const existingTimestamp = getRecordTimestamp(existing);
        const currentTimestamp = getRecordTimestamp(record);
        if (currentTimestamp === null && existingTimestamp !== null) {
            return;
        }
        if (existingTimestamp === null && currentTimestamp !== null) {
            index.set(key, record);
            return;
        }
        if (existingTimestamp !== null && currentTimestamp !== null && currentTimestamp >= existingTimestamp) {
            index.set(key, record);
        }
    });
    return index;
}

function mapLineCapaBulkRow(row, index) {
    const normalizedRow = {};
    Object.entries(row || {}).forEach(([key, value]) => {
        const targetKey = LINE_CAPA_COLUMN_MAP[normalizeBulkKey(key)];
        if (targetKey) {
            normalizedRow[targetKey] = value;
        }
    });

    const monthValue = normalizeMonthValue(normalizedRow.month);
    const productionLine = sanitizeText(normalizedRow.production_line).trim();
    const categoryValue = sanitizeText(normalizedRow.line_category).trim();

    const dailyCapaRaw = normalizedRow.daily_capa;
    const dailyHoursRaw = normalizedRow.daily_operating_hours;
    const operatingDaysRaw = normalizedRow.planned_operating_days;
    const computedRaw = normalizedRow.computed_capa;

    const dailyCapaValue = parseNumberOrNull(dailyCapaRaw);
    const dailyHoursValue = parseNumberOrNull(dailyHoursRaw);
    const operatingDaysValue = parseNumberOrNull(operatingDaysRaw);
    const hasComputedInput = computedRaw !== undefined && sanitizeText(computedRaw).trim() !== '';
    const computedValueRaw = hasComputedInput ? parseNumberOrNull(computedRaw) : null;

    const noteValue = sanitizeText(normalizedRow.note).trim();

    const errors = [];

    if (!monthValue) {
        errors.push('month 값이 비어 있거나 형식이 잘못되었습니다. (예: 2025-03)');
    }
    if (!productionLine) {
        errors.push('production_line 값을 입력하세요.');
    }
    if (dailyCapaValue === null || dailyCapaValue <= 0) {
        errors.push('daily_capa는 0보다 큰 숫자로 입력하세요.');
    }
    if (dailyHoursValue === null || dailyHoursValue <= 0) {
        errors.push('daily_operating_hours는 0보다 큰 숫자로 입력하세요.');
    }
    if (operatingDaysValue === null || operatingDaysValue <= 0) {
        errors.push('planned_operating_days는 0보다 큰 숫자로 입력하세요.');
    }
    if (hasComputedInput && (computedValueRaw === null || computedValueRaw <= 0)) {
        errors.push('computed_capa는 0보다 큰 숫자로 입력하세요.');
    }

    const computedValue = hasComputedInput
        ? (computedValueRaw !== null ? computedValueRaw : 0)
        : computeLineCapaTotal(dailyCapaValue ?? 0, dailyHoursValue ?? 0, operatingDaysValue ?? 0);

    const payload = {
        month: monthValue,
        production_line: productionLine,
        daily_capa: dailyCapaValue ?? 0,
        daily_operating_hours: dailyHoursValue ?? 0,
        planned_operating_days: operatingDaysValue ?? 0,
        computed_capa: computedValue,
        note: noteValue,
    };

    if (categoryValue) {
        payload.line_category = categoryValue;
    }

    return {
        payload,
        errors,
        rowNumber: index + 2,
    };
}

function mapLineMasterBulkRow(row, index) {
    const normalizedRow = {};
    Object.entries(row || {}).forEach(([key, value]) => {
        const targetKey = LINE_MASTER_COLUMN_MAP[normalizeBulkKey(key)];
        if (targetKey) {
            normalizedRow[targetKey] = value;
        }
    });

    const itemCode = sanitizeText(normalizedRow.item_code).trim().toUpperCase();
    const productionLine = sanitizeText(normalizedRow.production_line).trim();
    const hourlyRaw = normalizedRow.hourly_throughput;
    const hourlyValue = parseNumberOrNull(hourlyRaw);

    const errors = [];
    if (!itemCode) {
        errors.push('item_code 값을 입력하세요.');
    }
    if (!productionLine) {
        errors.push('production_line 값을 입력하세요.');
    }
    if (hourlyValue === null || hourlyValue <= 0) {
        errors.push('hourly_throughput은 0보다 큰 숫자로 입력하세요.');
    }

    const payload = {
        item_code: itemCode,
        production_line: productionLine,
        hourly_throughput: hourlyValue ?? 0,
    };

    return {
        payload,
        errors,
        rowNumber: index + 2,
    };
}

function mapSalesUploadRow(row, index, options = {}) {
    const normalizedRow = {};
    Object.entries(row || {}).forEach(([key, value]) => {
        const targetKey = SALES_UPLOAD_COLUMN_MAP[normalizeBulkKey(key)];
        if (targetKey) {
            normalizedRow[targetKey] = value;
        }
    });

    const channelIndex = options.channelIndex instanceof Map ? options.channelIndex : new Map();

    const monthValue = normalizeMonthValue(normalizedRow.month);
    const itemCodeValue = sanitizeText(normalizedRow.item_code).trim();
    const channelRaw = sanitizeText(normalizedRow.channel).trim();
    const noteValue = sanitizeText(normalizedRow.note).trim();

    const standardSource = normalizedRow.standard_quantity !== undefined
        ? normalizedRow.standard_quantity
        : normalizedRow.quantity;
    const promotionSource = normalizedRow.promotion_quantity;

    const hasStandardInput = standardSource !== undefined
        && standardSource !== null
        && sanitizeText(standardSource).trim() !== '';
    const hasPromotionInput = promotionSource !== undefined
        && promotionSource !== null
        && sanitizeText(promotionSource).trim() !== '';
    const hasAnyQuantity = hasStandardInput || hasPromotionInput;

    const standardParsed = hasStandardInput ? parseNumberOrNull(standardSource) : null;
    const promotionParsed = hasPromotionInput ? parseNumberOrNull(promotionSource) : null;

    const errors = [];

    if (!hasAnyQuantity) {
        errors.push('스탠다드 수량 또는 프로모션 수량 중 하나 이상은 반드시 입력해야 합니다.');
    }

    if (hasStandardInput && standardParsed === null) {
        errors.push('스탠다드 수량은 숫자로 입력하세요.');
    }
    if (hasPromotionInput && promotionParsed === null) {
        errors.push('프로모션 수량은 숫자로 입력하세요.');
    }

    const standardQuantity = Number.isFinite(standardParsed)
        ? standardParsed
        : (hasStandardInput ? 0 : 0);
    const promotionQuantity = Number.isFinite(promotionParsed) ? promotionParsed : 0;

    if (standardQuantity < 0) {
        errors.push('스탠다드 수량은 0 이상이어야 합니다.');
    }
    if (promotionQuantity < 0) {
        errors.push('프로모션 수량은 0 이상이어야 합니다.');
    }

    const totalQuantity = standardQuantity + promotionQuantity;

    const payload = {
        month: monthValue,
        item_code: itemCodeValue,
        channel: channelRaw,
        quantity: totalQuantity,
        standard_quantity: standardQuantity,
        promotion_quantity: promotionQuantity,
        note: noteValue,
    };

    SALES_UPLOAD_REQUIRED_FIELDS.forEach((field) => {
        if (field === 'month') {
            if (!payload.month) {
                errors.push('등록 월이 비어 있거나 형식이 잘못되었습니다. (예: 2025-03)');
            }
            return;
        }
        if (!payload[field]) {
            errors.push(`${field} 값이 비어 있습니다.`);
        }
    });

    if (!Number.isFinite(payload.quantity) || payload.quantity <= 0) {
        errors.push('총 수량은 0보다 큰 숫자로 입력하세요.');
    }

    if (!errors.length) {
        const channelInfo = getChannelInfo(channelIndex, payload.channel);
        if (!channelInfo) {
            errors.push(`등록되지 않은 채널입니다: ${payload.channel || '(공백)'}`);
        } else {
            payload.channel = sanitizeText(channelInfo.channel_key).trim();
        }
    }

    return {
        payload,
        errors,
        rowNumber: index + 2,
    };
}

function buildLineStats(records) {
    const map = new Map();
    const downtimeIndex = state.lineDowntimeIndex instanceof Map ? state.lineDowntimeIndex : new Map();

    (records || []).forEach((record) => {
        const baseKey = getLineKey(record.production_line, record.month);
        if (!baseKey) return;

        const recordLineCategory = sanitizeText(record.line_category ?? record.category ?? '').trim();
        const compositeKey = getLineCompositeKey(record.production_line, recordLineCategory, record.month);

        let entry = map.get(baseKey);
        if (!entry) {
            entry = {
                line: sanitizeText(record.production_line).trim(),
                lineCategory: recordLineCategory,
                month: record.month,
                totalProduction: 0,
                capacityLimit: null,
                capacitySource: 'record',
                plan: null,
                categories: new Set(),
            };
        }

        entry.totalProduction += toNumber(record.production_actual);
        if (recordLineCategory) {
            entry.categories.add(recordLineCategory);
            if (!entry.lineCategory) {
                entry.lineCategory = recordLineCategory;
            }
        }

        const primaryPlans = compositeKey ? downtimeIndex.get(compositeKey) : null;
        const fallbackPlans = downtimeIndex.get(baseKey);
        const candidatePlans = (primaryPlans && primaryPlans.length > 0) ? primaryPlans : fallbackPlans;
        const downtimePlan = selectLineCapaPlan(candidatePlans, recordLineCategory);
        const planCapacity = downtimePlan && Number.isFinite(downtimePlan.computed_capa)
            ? downtimePlan.computed_capa
            : null;

        if (planCapacity !== null && planCapacity > 0) {
            entry.capacityLimit = planCapacity;
            entry.capacitySource = 'downtime';
            entry.plan = downtimePlan;
        } else if (entry.capacitySource !== 'downtime') {
            const capacity = toNumber(record.capacity_limit);
            if (capacity > 0) {
                entry.capacityLimit = capacity;
            }
        }

        map.set(baseKey, entry);
    });

    map.forEach((entry, key) => {
        const capacityLimit = Number.isFinite(entry.capacityLimit) ? entry.capacityLimit : null;
        if (capacityLimit && capacityLimit > 0) {
            entry.ratio = entry.totalProduction / capacityLimit;
        } else {
            entry.ratio = null;
        }
        if (capacityLimit === null) {
            entry.capacitySource = 'none';
        }
        if (entry.categories instanceof Set) {
            entry.categories = Array.from(entry.categories)
                .sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));
        } else if (!Array.isArray(entry.categories)) {
            entry.categories = [];
        }
        if (Array.isArray(entry.categories)) {
            if (entry.categories.length === 1) {
                entry.lineCategory = entry.categories[0];
            } else if (entry.categories.length > 1) {
                entry.lineCategory = '';
            }
        }
        entry.status = buildCapacityStatus(entry.ratio);
        map.set(key, entry);
    });

    return map;
}

function enrichRecord(record, lineStats, overrides = {}) {
    const salesPlan = toNumber(overrides.sales_plan ?? record.sales_plan);

    const overrideSalesActualRaw = overrides.sales_actual;
    const parsedOverrideSalesActual = overrides.sales_actual !== undefined
        ? parseNumberOrNull(overrideSalesActualRaw)
        : null;
    const parsedRecordSalesActual = parseNumberOrNull(record.sales_actual);
    /* 판매실적 0은 유효한 데이터 — null/undefined만 제외 */
    const normalizedRecordSalesActual = parsedRecordSalesActual;
    let salesActualSource = 'record';
    let salesActual;
    if (parsedOverrideSalesActual !== null) {
        salesActual = parsedOverrideSalesActual;
        salesActualSource = 'override';
    } else if (normalizedRecordSalesActual !== null) {
        salesActual = normalizedRecordSalesActual;
        salesActualSource = 'record';
    } else {
        salesActual = null;
        salesActualSource = 'none';
    }
    const salesRemaining = Number.isFinite(salesActual) ? salesPlan - salesActual : null;

    const productionPlan = toNumber(overrides.production_plan ?? record.production_plan);
    const beginningInventory = toNumber(overrides.beginning_inventory ?? record.beginning_inventory);
    /* 가용재고: SAP API에서 가져오는 독립적인 외부 데이터 — 모든 재고 산식의 기준값 */
    const rawAvailableInventory = overrides.available_inventory ?? record.available_inventory;
    const availableInventory = rawAvailableInventory != null ? toNumber(rawAvailableInventory) : beginningInventory;
    const targetEndingInventory = toNumber(overrides.target_ending_inventory ?? record.target_ending_inventory);
    const capacityLimit = toNumber(overrides.capacity_limit ?? record.capacity_limit);

    const overrideActual = overrides.production_actual !== undefined
        ? parseNumberOrNull(overrides.production_actual)
        : null;
    const recordActual = parseNumberOrNull(record.production_actual);
    /* 생산실적 0은 유효한 데이터 — null/undefined만 제외 */
    const normalizedRecordActual = recordActual;
    let productionActualSource = 'record';
    let productionActual;
    if (overrideActual !== null) {
        productionActual = overrideActual;
        productionActualSource = 'override';
    } else if (normalizedRecordActual !== null) {
        productionActual = normalizedRecordActual;
        productionActualSource = 'record';
    } else {
        productionActual = null;
        productionActualSource = 'none';
    }
    const overrideRemaining = parseNumberOrNull(overrides.production_remaining);
    const recordRemaining = parseNumberOrNull(record.production_remaining);
    const computedRemaining = Number.isFinite(productionActual) ? productionPlan - productionActual : null;
    const productionRemaining = overrideRemaining !== null
        ? overrideRemaining
        : (computedRemaining !== null ? computedRemaining : (recordRemaining !== null ? recordRemaining : null));

    const effectiveProductionRemaining = Number.isFinite(productionRemaining)
        ? productionRemaining
        : (Number.isFinite(computedRemaining) ? computedRemaining : 0);
    const effectiveSalesRemaining = Number.isFinite(salesRemaining) ? salesRemaining : 0;
    /* 예상월말재고 = 가용재고 + 잔여생산량 - 잔여판매량 */
    const endingInventory = availableInventory + effectiveProductionRemaining - effectiveSalesRemaining;
    const inventoryDiff = endingInventory - targetEndingInventory;
    const targetRatio = targetEndingInventory > 0 ? endingInventory / targetEndingInventory : null;

    let inventoryStatus;
    if (inventoryDiff < 0) {
        inventoryStatus = {
            label: `부족 (${formatNumber(Math.abs(inventoryDiff))} EA)`,
            className: 'alert',
            diff: inventoryDiff,
            ratio: targetRatio,
        };
    } else if (Number.isFinite(targetRatio) && targetRatio >= 1.5) {
        inventoryStatus = {
            label: `과재고 (+${formatNumber(inventoryDiff)} EA)`,
            className: 'overstock',
            diff: inventoryDiff,
            ratio: targetRatio,
        };
    } else {
        inventoryStatus = {
            label: `적정 (+${formatNumber(inventoryDiff)} EA)`,
            className: 'safe',
            diff: inventoryDiff,
            ratio: targetRatio,
        };
    }

    const lineCategory = sanitizeText(record.line_category ?? record.category ?? '').trim();
    const lineKeyBase = getLineKey(record.production_line, record.month);
    const lineCompositeKey = getLineCompositeKey(record.production_line, lineCategory, record.month);
    let lineStat = null;
    if (lineCompositeKey && lineStats.has(lineCompositeKey)) {
        lineStat = lineStats.get(lineCompositeKey);
    } else if (lineKeyBase && lineStats.has(lineKeyBase)) {
        lineStat = lineStats.get(lineKeyBase);
    }
    const effectiveLineKey = lineKeyBase || lineCompositeKey;

    const fallbackCapacityLimit = capacityLimit > 0 ? capacityLimit : null;
    const fallbackRatio = fallbackCapacityLimit ? productionActual / fallbackCapacityLimit : null;

    const lineTotalProduction = lineStat ? lineStat.totalProduction : productionActual;
    const lineCapacityLimit = lineStat ? lineStat.capacityLimit : fallbackCapacityLimit;
    const lineCapacityRatio = lineStat ? lineStat.ratio : fallbackRatio;
    const lineCapacityStatus = lineStat ? lineStat.status : buildCapacityStatus(lineCapacityRatio);
    const lineCapacitySource = lineStat
        ? lineStat.capacitySource
        : (fallbackCapacityLimit ? 'record' : 'none');
    const lineDowntimePlan = lineStat && lineStat.plan ? lineStat.plan : null;

    /* OEM 상품은 CAPA 산정 대상이 아니므로 CAPA 관련 값 무효화 */
    const isOemProduct = sanitizeText(record.production_line).trim().toUpperCase().includes('OEM');
    const effectiveLineCapacityLimit = isOemProduct ? null : lineCapacityLimit;
    const effectiveLineCapacityRatio = isOemProduct ? null : lineCapacityRatio;
    const effectiveLineCapacityStatus = isOemProduct ? null : lineCapacityStatus;

    /* 가용재고: SAP에서 가져온 독립 데이터 (위에서 이미 선언) — 계산하지 않음 */

    /* ── 적정재고 달성 제안 생산수량 ──
       재고상태가 '적정'이 되려면:
       예상 월말 재고 = 가용재고 + 잔여생산 - 잔여판매 ≥ 적정재고
       잔여생산 = 생산계획 - 생산실적  →  필요 생산계획 = 적정재고 + 잔여판매 - 가용재고 + 생산실적
       즉, suggested = targetEndingInventory + effectiveSalesRemaining - availableInventory + (생산실적)
       단, 최소 0 이상                                                          */
    const suggestedProduction = (Number.isFinite(targetEndingInventory) && Number.isFinite(availableInventory))
        ? Math.max(0, Math.ceil(targetEndingInventory + effectiveSalesRemaining - availableInventory
            + (Number.isFinite(productionActual) ? productionActual : 0)))
        : null;

    /* ── 보정 생산계획 기본값 ──
       사용자 override가 있으면 그 값, 없으면 제안 수량을 기본값으로 사용 */
    const adjustedOverride = parseNumberOrNull(overrides.adjusted_production_plan);
    const adjustedProductionPlan = adjustedOverride !== null
        ? adjustedOverride
        : (suggestedProduction !== null ? suggestedProduction : productionPlan);

    /* ── 보정 기준 연쇄 재계산 ──
       보정 생산계획이 입력되면 이를 기준으로 파생 지표를 재계산 */
    const adjProductionRemaining = Number.isFinite(adjustedProductionPlan)
        ? (Number.isFinite(productionActual) ? adjustedProductionPlan - productionActual : adjustedProductionPlan)
        : effectiveProductionRemaining;
    /* 보정 예상월말재고 = 가용재고 + 보정잔여생산량 - 잔여판매량 */
    const adjEndingInventory = availableInventory + adjProductionRemaining - effectiveSalesRemaining;
    const adjInventoryDiff = adjEndingInventory - targetEndingInventory;
    const adjTargetRatio = targetEndingInventory > 0 ? adjEndingInventory / targetEndingInventory : null;

    let adjInventoryStatus;
    if (adjInventoryDiff < 0) {
        adjInventoryStatus = {
            label: `부족 (${formatNumber(Math.abs(adjInventoryDiff))} EA)`,
            className: 'alert',
            diff: adjInventoryDiff,
            ratio: adjTargetRatio,
        };
    } else if (Number.isFinite(adjTargetRatio) && adjTargetRatio >= 1.5) {
        adjInventoryStatus = {
            label: `과재고 (+${formatNumber(adjInventoryDiff)} EA)`,
            className: 'overstock',
            diff: adjInventoryDiff,
            ratio: adjTargetRatio,
        };
    } else {
        adjInventoryStatus = {
            label: `적정 (+${formatNumber(adjInventoryDiff)} EA)`,
            className: 'safe',
            diff: adjInventoryDiff,
            ratio: adjTargetRatio,
        };
    }

    /* 보정 기준 필요량 */
    const adjRequiredQuantity = Number.isFinite(adjInventoryDiff) ? -adjInventoryDiff : null;

    /* ── 납품율 계산 ──
       산식: (판매실적 / 판매계획) / (오늘일자 / 해당월일수)
       - 시스템 날짜 기준으로 오늘 일(day)과 해당 월의 총 일수를 자동 산출
       - 과거/미래 월은 일자 비율을 1로 처리 (월 전체 기준)
       - 판매계획이 0이면 계산 불가 → null                        */
    let deliveryRate = null;
    if (Number.isFinite(salesActual) && Number.isFinite(salesPlan) && salesPlan > 0) {
        const today = new Date();
        const recordMonth = record.month; // 'YYYY-MM' 형식
        const todayYM = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

        let dayRatio = 1; // 과거/미래 월은 전체 기준(1)
        if (recordMonth === todayYM) {
            // 당월: 오늘 일자 / 해당 월 총 일수
            const dayOfMonth = today.getDate();
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            dayRatio = dayOfMonth / daysInMonth;
        }

        if (dayRatio > 0) {
            deliveryRate = (salesActual / salesPlan) / dayRatio;
        }
    }

    return {
        ...record,
        sales_plan: salesPlan,
        sales_actual: salesActual,
        sales_remaining: salesRemaining,
        production_plan: productionPlan,
        production_actual: productionActual,
        production_remaining: productionRemaining,
        beginning_inventory: beginningInventory,
        target_ending_inventory: targetEndingInventory,
        capacity_limit: capacityLimit,
        ending_inventory: endingInventory,
        available_inventory: availableInventory,
        delivery_rate: deliveryRate,
        suggested_production: suggestedProduction,
        adjusted_production_plan: adjustedProductionPlan,
        required_quantity: Number.isFinite(adjInventoryDiff) ? -adjInventoryDiff : null,
        adj_ending_inventory: adjEndingInventory,
        adj_inventory_status: adjInventoryStatus,
        adj_inventory_diff: adjInventoryDiff,
        adj_production_remaining: adjProductionRemaining,
        inventoryStatus,
        inventoryDiff,
        lineKey: effectiveLineKey,
        lineKeyBase,
        lineKeyComposite: lineCompositeKey,
        lineCategory,
        lineTotalProduction,
        lineCapacityLimit: effectiveLineCapacityLimit,
        lineCapacityRatio: effectiveLineCapacityRatio,
        lineCapacityStatus: effectiveLineCapacityStatus,
        lineCapacitySource,
        lineDowntimePlan,
        salesActualSource,
        productionActualSource,
        productionLeadTimeHours: isOemProduct ? null : ((lineStat && lineStat.plan
            && Number.isFinite(lineStat.plan.daily_capa)
            && lineStat.plan.daily_capa > 0
            && Number.isFinite(productionPlan))
            ? (productionPlan / lineStat.plan.daily_capa)
            : null),
    };
}

function buildChainedRecords(rawRecords, lineStats, options = {}) {
    const salesAggregates = options.salesAggregates instanceof Map ? options.salesAggregates : new Map();
    const recentSalesIndex = options.recentSalesIndex instanceof Map ? options.recentSalesIndex : new Map();
    const grouped = new Map();

    rawRecords.forEach((record) => {
        if (!record) return;
        const canonicalCode = getRecordCanonicalCode(record);
        const key = canonicalCode || sanitizeText(record.item_code).trim() || `__${record.id}`;
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(record);
    });

    const chained = [];

    grouped.forEach((records, canonicalKey) => {
        /* ── 같은 canonical + 같은 month 레코드 합산 ──
         * 리뉴얼 자재 연결 시 기존코드와 신규코드가 동일 월에 각각 레코드를 가질 수 있음.
         * 이 경우 숫자 필드를 합산하여 단일 레코드로 병합한다.
         * canonical(신규코드) 레코드를 기준으로 기존코드 레코드의 값을 합산. */
        const monthMap = new Map();
        records.forEach((record) => {
            const month = sanitizeText(record.month).trim();
            if (!monthMap.has(month)) {
                monthMap.set(month, []);
            }
            monthMap.get(month).push(record);
        });

        const mergedRecords = [];
        monthMap.forEach((monthRecords, month) => {
            if (monthRecords.length === 1) {
                mergedRecords.push(monthRecords[0]);
            } else {
                /* canonical(신규코드) 레코드를 기준으로 선택 */
                let base = monthRecords.find((r) => {
                    const code = sanitizeText(r.item_code).trim();
                    return code === canonicalKey;
                });
                if (!base) base = monthRecords[0]; // fallback

                const merged = { ...base };
                const sumFields = [
                    'sales_actual', 'sales_plan', 'production_actual', 'production_plan',
                    'production_remaining', 'beginning_inventory', 'available_inventory',
                    'target_ending_inventory', 'capacity_limit',
                ];

                sumFields.forEach((field) => {
                    let total = null;
                    monthRecords.forEach((r) => {
                        const val = parseNumberOrNull(r[field]);
                        if (val !== null) {
                            total = (total || 0) + val;
                        }
                    });
                    if (total !== null) {
                        merged[field] = total;
                    }
                });

                /* 합산 디버그 로그 (기존자재 데이터가 합산된 경우만) */
                if (monthRecords.length > 1) {
                    const codes = monthRecords.map((r) => sanitizeText(r.item_code).trim()).join(', ');
                    console.debug(`[buildChainedRecords] ${canonicalKey} ${month}: ${monthRecords.length}건 합산 (${codes})`);
                }

                mergedRecords.push(merged);
            }
        });

        mergedRecords.sort((a, b) => sanitizeText(a.month).localeCompare(sanitizeText(b.month)));
        let previousEnding = null;
        const recentSalesActuals = [];
        mergedRecords.forEach((record) => {
            const rawBeginning = toNumber(record.beginning_inventory);
            const rawAvailable = record.available_inventory != null ? toNumber(record.available_inventory) : null;
            const isProjected = Boolean(record.isProjected);
            let availableInventory = Number.isFinite(rawAvailable) ? rawAvailable : rawBeginning;
            let linked = false;

            /* 예상월말재고 → 다음달 가용재고로 연결 */
            if (previousEnding !== null) {
                if (isProjected) {
                    availableInventory = previousEnding;
                    linked = true;
                } else if (Number.isFinite(previousEnding) && Number.isFinite(rawAvailable) && Math.abs(rawAvailable - previousEnding) < 1e-6) {
                    availableInventory = previousEnding;
                    linked = true;
                } else if (!Number.isFinite(rawAvailable) && !Number.isFinite(rawBeginning)) {
                    availableInventory = previousEnding;
                    linked = true;
                } else {
                    /* SAP 가용재고가 있으면 그 값 유지, 없으면 현재고 */
                    availableInventory = Number.isFinite(rawAvailable) ? rawAvailable : rawBeginning;
                    linked = false;
                }
            }

            const overrides = { beginning_inventory: rawBeginning, available_inventory: availableInventory };
            const aggregateKey = getSalesAggregateKey(record.item_code, record.month);
            const salesAggregate = aggregateKey ? salesAggregates.get(aggregateKey) : null;
            if (salesAggregate && Number.isFinite(salesAggregate.total)) {
                overrides.sales_plan = salesAggregate.total;
            }
            /* 보정 생산계획 사용자 override 반영 */
            if (state.adjustedPlanOverrides && state.adjustedPlanOverrides.has(record.id)) {
                overrides.adjusted_production_plan = state.adjustedPlanOverrides.get(record.id);
            }

            const enriched = enrichRecord(record, lineStats, overrides);
            let salesAvg3m = null;
            const recentKey = getRecentSalesAverageKey(record.item_code, record.month);
            if (recentKey && recentSalesIndex.has(recentKey)) {
                const recentRecord = recentSalesIndex.get(recentKey);
                const uploadedAvg = Number(recentRecord?.average);
                if (Number.isFinite(uploadedAvg)) {
                    salesAvg3m = uploadedAvg;
                    enriched.salesActualAvg3mSource = 'uploaded';
                }
            }
            if (salesAvg3m === null && recentSalesActuals.length === 3 && recentSalesActuals.every((value) => Number.isFinite(value))) {
                const sum = recentSalesActuals.reduce((total, value) => total + value, 0);
                salesAvg3m = sum / 3;
            }
            enriched.salesActualAvg3m = salesAvg3m;
            /* 최근 3개월 판매실적 표준편차 계산 (STDEV.S = 표본 표준편차, N-1) */
            let salesStdDev3m = null;
            /* 1) 업로드된 m1, m2, m3 데이터가 있으면 우선 사용 */
            if (recentKey && recentSalesIndex.has(recentKey)) {
                const rr = recentSalesIndex.get(recentKey);
                const uploadedValues = [Number(rr?.m3), Number(rr?.m2), Number(rr?.m1)];
                if (uploadedValues.length >= 2 && uploadedValues.every((v) => Number.isFinite(v))) {
                    const n = uploadedValues.length;
                    const mean = uploadedValues.reduce((s, v) => s + v, 0) / n;
                    const variance = uploadedValues.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1);
                    salesStdDev3m = Math.round(Math.sqrt(variance) * 10) / 10;
                }
            }
            /* 2) 업로드 데이터가 없으면 이전 3개월 판매실적 자동 계산 */
            if (salesStdDev3m === null && recentSalesActuals.length >= 2 && recentSalesActuals.every((v) => Number.isFinite(v))) {
                const n = recentSalesActuals.length;
                const mean = recentSalesActuals.reduce((s, v) => s + v, 0) / n;
                const variance = recentSalesActuals.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1);
                salesStdDev3m = Math.round(Math.sqrt(variance) * 10) / 10;
            }
            enriched.salesActualStdDev3m = salesStdDev3m;
            enriched.available_inventory_linked = linked;
            enriched.beginning_inventory_linked = linked;
            enriched.beginning_inventory_manual = !linked && previousEnding !== null;
            enriched.salesPlanSource = salesAggregate ? 'uploaded' : 'manual';
            enriched.salesPlanBreakdown = salesAggregate ? salesAggregate.channelBreakdown : null;
            chained.push(enriched);
            previousEnding = enriched.ending_inventory;

            recentSalesActuals.push(Number.isFinite(enriched.sales_actual) ? enriched.sales_actual : null);
            if (recentSalesActuals.length > 3) {
                recentSalesActuals.shift();
            }
        });
    });

    return chained;
}

function matchesInventoryStatusFilter(record, filterValue) {
    if (filterValue === 'all') return true;
    if (!record || !record.inventoryStatus) return false;
    return record.inventoryStatus.className === filterValue;
}

function matchesCapaStatusFilter(record, filterValue) {
    if (filterValue === 'all') return true;
    if (!record || !record.lineCapacityStatus) return false;
    const status = record.lineCapacityStatus;
    if (filterValue === 'alert') {
        return status.className === 'alert';
    }
    if (filterValue === 'safe') {
        return status.className === 'safe';
    }
    if (filterValue === 'warning-buffer') {
        return status.className === 'warning' && status.label && status.label.includes('여유');
    }
    if (filterValue === 'warning-missing') {
        return status.className === 'warning' && status.label && status.label.includes('CAPA 미등록');
    }
    return false;
}

function getDashboardFilteredRecords() {
    const itemFilter = dom.filters.item.value;
    const categoryFilter = getCategoryFilterValues();
    const lineFilter = dom.filters.line.value;

    return (state.enrichedData || []).filter((record) => {
        const canonicalCode = getRecordCanonicalCode(record);
        if (itemFilter !== 'all' && canonicalCode !== itemFilter) {
            return false;
        }
        if (!matchesCategoryFilter(categoryFilter, record.category)) {
            return false;
        }
        if (lineFilter !== 'all' && sanitizeText(record.production_line).trim() !== lineFilter) {
            return false;
        }
        return true;
    });
}

/* ══════════════════════════════════════════════════════════
 *  멀티탭 관리  (MES 스타일 열린 탭 바)
 * ══════════════════════════════════════════════════════════ */

/** 열린 탭 바를 다시 그린다 */
function renderOpenTabs() {
    const bar = dom.openTabsBar;
    if (!bar) return;
    const tabs = state.openTabs;
    if (!tabs.length) {
        bar.style.display = 'none';
        return;
    }
    bar.style.display = 'flex';
    bar.innerHTML = '';
    const isSole = tabs.length === 1;
    tabs.forEach((viewId) => {
        const label = VIEW_LABEL_MAP[viewId] || viewId;
        const isActive = viewId === state.activeView;
        const tab = document.createElement('div');
        tab.className = 'open-tab' + (isActive ? ' active' : '') + (isSole ? ' sole-tab' : '');
        tab.dataset.viewId = viewId;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.innerHTML =
            `<span class="open-tab-label" title="${label}">${label}</span>` +
            `<button class="open-tab-close" type="button" aria-label="${label} 닫기" title="닫기">&times;</button>`;
        /* 탭 클릭 → 해당 화면으로 전환 */
        tab.addEventListener('click', (e) => {
            if (e.target.closest('.open-tab-close')) return;
            switchToTab(viewId);
        });
        /* 닫기 버튼 */
        tab.querySelector('.open-tab-close').addEventListener('click', (e) => {
            e.stopPropagation();
            closeTab(viewId);
        });
        bar.appendChild(tab);
    });
}

/**
 * 메뉴 클릭 시 호출 — 탭이 없으면 열고, 있으면 전환.
 * 최대 탭 수 초과 시 가장 오래된 비활성 탭을 자동 닫는다.
 */
function openTab(viewId) {
    if (!state.openTabs.includes(viewId)) {
        /* 최대 탭 수 체크 */
        while (state.openTabs.length >= MAX_OPEN_TABS) {
            /* 현재 활성 탭이 아닌 가장 오래된(첫 번째) 탭 제거 */
            const removeIdx = state.openTabs.findIndex((id) => id !== state.activeView);
            if (removeIdx === -1) break;          /* 모두 활성(불가능하지만 안전장치) */
            state.openTabs.splice(removeIdx, 1);
        }
        state.openTabs.push(viewId);
    }
    switchToTab(viewId);
}

/** 탭 닫기 — 마지막 1개는 닫지 않는다 */
function closeTab(viewId) {
    if (state.openTabs.length <= 1) return;
    const idx = state.openTabs.indexOf(viewId);
    if (idx === -1) return;
    state.openTabs.splice(idx, 1);
    if (state.activeView === viewId) {
        /* 닫힌 탭이 활성이면 인접 탭으로 전환 */
        const nextIdx = Math.min(idx, state.openTabs.length - 1);
        switchToTab(state.openTabs[nextIdx]);
    } else {
        renderOpenTabs();
    }
}

/** 이미 열린 탭으로 전환 */
function switchToTab(viewId) {
    setActiveView(viewId, { scroll: false, focusButton: false });
}

function setActiveView(viewId, options = {}) {
    if (!dom.views) return;

    const { scroll = true, focusButton = false } = options;
    const buttons = Array.isArray(dom.views.buttons)
        ? dom.views.buttons
        : Array.from(document.querySelectorAll('.sidebar-item'));
    const sections = Array.isArray(dom.views.sections)
        ? dom.views.sections
        : Array.from(document.querySelectorAll('.view-section'));

    if (!Array.isArray(dom.views.buttons)) {
        dom.views.buttons = buttons;
    }
    if (!Array.isArray(dom.views.sections)) {
        dom.views.sections = sections;
    }

    const availableViews = sections
        .map((section) => (section && section.dataset ? section.dataset.view : null))
        .filter(Boolean);

    const fallbackView = availableViews.includes(state.activeView) ? state.activeView : 'summary';
    const targetView = availableViews.includes(viewId) ? viewId : fallbackView;
    state.activeView = targetView;

    let activeSection = null;
    let activeButton = null;

    buttons.forEach((button) => {
        if (!button || !button.dataset) return;
        const isActive = button.dataset.viewTarget === targetView;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        button.setAttribute('tabindex', isActive ? '0' : '-1');
        if (isActive) {
            activeButton = button;
        }
    });

    sections.forEach((section) => {
        if (!section || !section.dataset) return;
        const match = section.dataset.view === targetView;
        section.classList.toggle('hidden', !match);
        section.setAttribute('aria-hidden', match ? 'false' : 'true');
        section.setAttribute('tabindex', match ? '0' : '-1');
        if (match) {
            activeSection = section;
        }
    });

    if (scroll && activeSection) {
        activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (focusButton && activeButton) {
        activeButton.focus();
    }

    /* 기준정보 관리 탭 활성 시 사이드바 서브메뉴 표시/숨김 */
    const isPlanner = targetView === 'planner';
    if (dom.sidebarPlannerSub) {
        dom.sidebarPlannerSub.classList.toggle('visible', isPlanner);
    }

    if (targetView === 'analytics' && state.chart) {
        setTimeout(() => {
            if (state.chart) {
                state.chart.resize();
            }
        }, 0);
    }
    if (targetView === 'line-capa' && state.lineCapaChart) {
        setTimeout(() => {
            if (state.lineCapaChart) {
                state.lineCapaChart.resize();
            }
        }, 0);
    }
    if (targetView === 'optimal-inventory' && state.optimalInventoryChart) {
        setTimeout(() => {
            if (state.optimalInventoryChart) {
                state.optimalInventoryChart.resize();
            }
        }, 0);
    }
    if (targetView === 'inventory') {
        syncDashboardBaseMonthWithFilter();
        setTimeout(() => {
            if (state.inventoryAccuracyCharts) {
                const { sales, production } = state.inventoryAccuracyCharts;
                if (sales && typeof sales.resize === 'function') {
                    sales.resize();
                }
                if (production && typeof production.resize === 'function') {
                    production.resize();
                }
            }
        }, 0);
    }
    if (targetView === 'table') {
        /* 생산계획현황 탭이 보일 때 2단 헤더 sticky top 재계산 */
        updatePlanHeaderStickyTop();
    }
    if (targetView === 'change-history') {
        refreshChangeHistoryView({ populateFilters: true });
    }
    if (targetView === 'dev-schedule') {
        loadDevSchedules();
    }
    if (targetView === 'user-mgmt') {
        loadUsers();
    }
    if (targetView === 'sales-upload') {
        /* 판매계획 업로드 탭 진입 시 등록 월 기본값 설정 */
        applySalesUploadDefaultMonth();
    }

    /* 멀티탭 바 갱신 */
    renderOpenTabs();
}

function setupViewNavigation() {
    if (!dom.views) return;

    const buttons = Array.isArray(dom.views.buttons)
        ? dom.views.buttons
        : Array.from(document.querySelectorAll('.sidebar-item'));
    const sections = Array.isArray(dom.views.sections)
        ? dom.views.sections
        : Array.from(document.querySelectorAll('.view-section'));

    dom.views.buttons = buttons;
    dom.views.sections = sections;

    /* 사이드바 토글 이벤트 */
    setupSidebarToggle();

    /* 사이드바 아이템에 data-tooltip 속성 추가 (접힌 상태에서 툴팁용) */
    buttons.forEach((button) => {
        if (!button) return;
        const label = button.querySelector('.sidebar-label');
        if (label) {
            button.setAttribute('data-tooltip', label.textContent.trim());
        }
    });

    buttons.forEach((button) => {
        if (!button) return;
        if (!button.id && button.dataset && button.dataset.viewTarget) {
            button.id = `tab-${button.dataset.viewTarget}`;
        }
        button.setAttribute('role', 'tab');
        button.setAttribute('tabindex', '-1');
        button.addEventListener('click', () => {
            openTab(button.dataset.viewTarget);
        });
        button.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
            event.preventDefault();
            const currentIndex = buttons.indexOf(button);
            if (currentIndex === -1) return;
            const direction = event.key === 'ArrowDown' ? 1 : -1;
            const nextIndex = (currentIndex + direction + buttons.length) % buttons.length;
            const nextButton = buttons[nextIndex];
            if (nextButton) {
                nextButton.focus();
                openTab(nextButton.dataset.viewTarget);
            }
        });
    });

    /* 사이드바 nav 컨테이너에 키보드 내비게이션 바인딩 */
    const sidebarNav = dom.sidebar ? dom.sidebar.querySelector('.sidebar-nav') : null;
    if (sidebarNav && !sidebarNav.dataset.bindViewNav) {
        sidebarNav.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
            const activeButton = document.activeElement && document.activeElement.classList.contains('sidebar-item')
                ? document.activeElement
                : buttons.find((btn) => btn && btn.classList.contains('active'));
            if (!activeButton) return;
            const currentIndex = buttons.indexOf(activeButton);
            if (currentIndex === -1) return;
            const direction = event.key === 'ArrowDown' ? 1 : -1;
            const nextIndex = (currentIndex + direction + buttons.length) % buttons.length;
            const nextButton = buttons[nextIndex];
            if (nextButton) {
                nextButton.focus();
                openTab(nextButton.dataset.viewTarget);
            }
        });
        sidebarNav.dataset.bindViewNav = 'true';
    }

    sections.forEach((section) => {
        if (!section) return;
        section.setAttribute('role', 'tabpanel');
        section.setAttribute('aria-hidden', 'true');
        section.setAttribute('tabindex', '-1');
        const viewKey = section.dataset ? section.dataset.view : null;
        if (viewKey) {
            const controller = buttons.find((button) => button && button.dataset && button.dataset.viewTarget === viewKey);
            if (controller) {
                section.setAttribute('aria-labelledby', controller.id);
            }
        }
    });

    setActiveView(state.activeView, { scroll: false, focusButton: false });
}

function getDashboardAccuracyMode() {
    return state.dashboardAccuracyMode === 'rolling' ? 'rolling' : 'cumulative';
}

function updateInventoryAccuracySummaryDescription(mode, baseMonth) {
    if (!dom.dashboard || !dom.dashboard.accuracySummaryDescription) return;
    const descriptionElement = dom.dashboard.accuracySummaryDescription;
    const hasBaseMonth = Boolean(sanitizeText(baseMonth).trim());

    if (!hasBaseMonth) {
        descriptionElement.textContent = '기준 월과 집계 방식을 선택하면 카테고리별 계획 대비 실적 비율을 확인할 수 있습니다.';
        return;
    }

    if (mode === 'rolling') {
        descriptionElement.textContent = '선택한 기준 월을 포함한 최근 4개월간의 카테고리별 계획 대비 실적 비율을 확인하세요.';
    } else {
        descriptionElement.textContent = '해당 연도의 1월부터 선택한 기준 월까지 누적된 카테고리별 계획 대비 실적 비율을 확인하세요.';
    }
}

function renderInventoryForecastTable(baseMonth, filteredRecords) {
    if (!dom.dashboard || !dom.dashboard.forecastTable) return;
    const tableBody = dom.dashboard.forecastTable;
    const emptyState = dom.dashboard.forecastEmpty;
    tableBody.innerHTML = '';

    const accuracyMode = getDashboardAccuracyMode();
    updateInventoryAccuracySummaryDescription(accuracyMode, baseMonth);

    if (!baseMonth) {
        if (dom.dashboard.forecastMonthHeaders && dom.dashboard.forecastMonthHeaders.length > 0) {
            dom.dashboard.forecastMonthHeaders.forEach((header) => {
                if (header) header.textContent = '-';
            });
        }
        renderInventoryAccuracySummaryTable([], []);
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        return;
    }

    const forecastMonths = buildMonthSequence(baseMonth, 3);
    if (dom.dashboard.forecastMonthHeaders && dom.dashboard.forecastMonthHeaders.length > 0) {
        dom.dashboard.forecastMonthHeaders.forEach((header, index) => {
            if (!header) return;
            header.textContent = forecastMonths[index] ? forecastMonths[index] : '-';
        });
    }

    const accuracyMonths = buildAccuracyMonthSequence(baseMonth, accuracyMode);
    const records = filteredRecords || getDashboardFilteredRecords();

    if (!records || records.length === 0) {
        renderInventoryAccuracySummaryTable(accuracyMonths, []);
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        return;
    }

    const inventoryStatusFilter = dom.filters.inventoryStatus ? dom.filters.inventoryStatus.value : 'all';
    const capaStatusFilter = dom.filters.capaStatus ? dom.filters.capaStatus.value : 'all';

    const grouped = new Map();
    records.forEach((record) => {
        const key = record.item_code || record.id;
        if (!key) return;
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(record);
    });

    const accuracySummaryRows = buildCategoryAccuracySummaryRows(grouped, accuracyMonths);

    const sortedItems = Array.from(grouped.entries()).sort((a, b) => {
        const recordA = a[1][0];
        const recordB = b[1][0];
        const nameA = sanitizeText(recordA.item_name).trim();
        const nameB = sanitizeText(recordB.item_name).trim();
        if (nameA.localeCompare(nameB) !== 0) {
            return nameA.localeCompare(nameB);
        }
        return sanitizeText(recordA.item_code).trim().localeCompare(sanitizeText(recordB.item_code).trim());
    });

    const fragment = document.createDocumentFragment();
    let rowCount = 0;

    const categoryGroups = new Map();

    sortedItems.forEach(([code, itemRecords]) => {
        const recordMap = new Map();
        itemRecords.forEach((record) => {
            recordMap.set(record.month, record);
        });

        const fallbackRecord = itemRecords.find((record) => record && !record.isProjected) || itemRecords[0] || null;
        const displayRecord = recordMap.get(baseMonth) || fallbackRecord;
        if (!displayRecord) {
            return;
        }

        const filterReference = recordMap.get(baseMonth) || fallbackRecord;
        if (!matchesInventoryStatusFilter(filterReference, inventoryStatusFilter)) {
            return;
        }
        if (!matchesCapaStatusFilter(filterReference, capaStatusFilter)) {
            return;
        }

        const categoryName = sanitizeText(displayRecord.category) || '카테고리 미지정';
        if (!categoryGroups.has(categoryName)) {
            categoryGroups.set(categoryName, []);
        }

        const displayCode = sanitizeText(displayRecord.item_code) || sanitizeText(code) || '-';
        const displayName = sanitizeText(displayRecord.item_name) || '-';

        categoryGroups.get(categoryName).push({
            code: displayCode,
            name: displayName,
            category: categoryName,
            recordMap,
        });
    });

    const sortedCategories = Array.from(categoryGroups.entries())
        .sort((a, b) => sanitizeText(a[0]).localeCompare(sanitizeText(b[0])));

    Array.from(state.inventoryExpandedCategories).forEach((category) => {
        if (!sortedCategories.some(([name]) => name === category)) {
            state.inventoryExpandedCategories.delete(category);
        }
    });

    sortedCategories.forEach(([categoryName, items]) => {
        if (!Array.isArray(items) || items.length === 0) {
            return;
        }

        const isExpanded = state.inventoryExpandedCategories.has(categoryName);
        const summaryRow = createCategorySummaryRow(categoryName, items, forecastMonths, isExpanded);
        fragment.appendChild(summaryRow);
        rowCount += 1;

        items.sort((a, b) => {
            const nameCompare = sanitizeText(a.name).localeCompare(sanitizeText(b.name));
            if (nameCompare !== 0) return nameCompare;
            return sanitizeText(a.code).localeCompare(sanitizeText(b.code));
        });

        items.forEach((itemData) => {
            const detailRow = createItemDetailRow(itemData, forecastMonths, isExpanded);
            fragment.appendChild(detailRow);
            rowCount += 1;
        });
    });

    tableBody.appendChild(fragment);
    if (emptyState) {
        if (rowCount === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }

    renderInventoryAccuracySummaryTable(accuracyMonths, accuracySummaryRows);

    function createCategorySummaryRow(categoryName, items, months, isExpanded) {
        const row = document.createElement('tr');
        row.className = 'category-summary-row';
        row.dataset.category = categoryName;
        if (isExpanded) {
            row.classList.add('expanded');
        }

        const categoryCell = document.createElement('td');
        categoryCell.className = 'col-category category-summary-cell';

        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = 'category-toggle';
        toggleButton.dataset.category = categoryName;
        toggleButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

        const chevron = document.createElement('span');
        chevron.className = 'chevron';
        chevron.setAttribute('aria-hidden', 'true');
        chevron.textContent = '▸';
        toggleButton.appendChild(chevron);

        const label = document.createElement('span');
        label.className = 'category-label';
        label.textContent = categoryName;
        toggleButton.appendChild(label);

        const countBadge = document.createElement('span');
        countBadge.className = 'category-count';
        countBadge.textContent = `(${items.length}개 자재)`;
        toggleButton.appendChild(countBadge);

        categoryCell.appendChild(toggleButton);
        row.appendChild(categoryCell);

        const codeCell = document.createElement('td');
        codeCell.className = 'category-summary-meta';
        codeCell.textContent = `${items.length.toLocaleString('ko-KR')}개 자재`;
        row.appendChild(codeCell);

        const nameCell = document.createElement('td');
        nameCell.className = 'col-item-name category-summary-name';
        nameCell.textContent = '카테고리 요약';
        row.appendChild(nameCell);

        months.forEach((targetMonth, groupIndex) => {
            const snapshot = buildCategoryMonthSnapshot(items, targetMonth);
            row.appendChild(createNumberCell('beginning', snapshot.beginning, {
                groupIndex,
                isFirstGroup: groupIndex === 0,
                isProjected: snapshot.allProjected,
                extraClasses: ['category-summary-value'],
            }));
            row.appendChild(createNumberCell('salesPlan', snapshot.salesPlan, {
                groupIndex,
                isProjected: snapshot.allProjected,
                extraClasses: ['category-summary-value'],
            }));
            row.appendChild(createNumberCell('salesActual', snapshot.salesActual, {
                groupIndex,
                isProjected: snapshot.allProjected,
                extraClasses: ['category-summary-value'],
            }));
            row.appendChild(createAccuracyCell(snapshot.salesAccuracy, {
                groupIndex,
                isProjected: snapshot.allProjected,
                extraClasses: ['category-summary-value'],
            }));
            row.appendChild(createNumberCell('productionPlan', snapshot.productionPlan, {
                groupIndex,
                isProjected: snapshot.allProjected,
                extraClasses: ['category-summary-value'],
            }));
            row.appendChild(createNumberCell('productionActual', snapshot.productionActual, {
                groupIndex,
                isProjected: snapshot.allProjected,
                extraClasses: ['category-summary-value'],
            }));
            row.appendChild(createAccuracyCell(snapshot.productionAccuracy, {
                groupIndex,
                isProjected: snapshot.allProjected,
                extraClasses: ['category-summary-value'],
            }));
            row.appendChild(createNumberCell('ending', snapshot.ending, {
                groupIndex,
                isProjected: snapshot.allProjected,
                inventoryStatus: snapshot.inventoryStatus,
                extraClasses: ['category-summary-value'],
            }));
        });

        return row;
    }

    function createItemDetailRow(itemData, months, isExpanded) {
        const row = document.createElement('tr');
        row.classList.add('category-detail-row');
        row.dataset.category = itemData.category;
        if (!isExpanded) {
            row.classList.add('hidden');
            row.setAttribute('aria-hidden', 'true');
        } else {
            row.setAttribute('aria-hidden', 'false');
        }

        const categoryCell = document.createElement('td');
        categoryCell.className = 'col-category category-detail-cell';
        const indicator = document.createElement('span');
        indicator.className = 'category-detail-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        categoryCell.appendChild(indicator);
        row.appendChild(categoryCell);

        const codeCell = document.createElement('td');
        codeCell.textContent = itemData.code || '-';
        row.appendChild(codeCell);

        const nameCell = document.createElement('td');
        nameCell.className = 'col-item-name';
        nameCell.textContent = itemData.name || '-';
        row.appendChild(nameCell);

        months.forEach((targetMonth, groupIndex) => {
            const snapshot = buildItemMonthSnapshot(itemData.recordMap.get(targetMonth));
            row.appendChild(createNumberCell('beginning', snapshot.beginning, {
                groupIndex,
                isFirstGroup: groupIndex === 0,
                isProjected: snapshot.isProjected,
            }));
            row.appendChild(createNumberCell('salesPlan', snapshot.salesPlan, {
                groupIndex,
                isProjected: snapshot.isProjected,
            }));
            row.appendChild(createNumberCell('salesActual', snapshot.salesActual, {
                groupIndex,
                isProjected: snapshot.isProjected,
            }));
            row.appendChild(createAccuracyCell(snapshot.salesAccuracy, {
                groupIndex,
                isProjected: snapshot.isProjected,
            }));
            row.appendChild(createNumberCell('productionPlan', snapshot.productionPlan, {
                groupIndex,
                isProjected: snapshot.isProjected,
            }));
            row.appendChild(createNumberCell('productionActual', snapshot.productionActual, {
                groupIndex,
                isProjected: snapshot.isProjected,
            }));
            row.appendChild(createAccuracyCell(snapshot.productionAccuracy, {
                groupIndex,
                isProjected: snapshot.isProjected,
            }));
            row.appendChild(createNumberCell('ending', snapshot.ending, {
                groupIndex,
                isProjected: snapshot.isProjected,
                inventoryStatus: snapshot.inventoryStatus,
            }));
        });

        return row;
    }

    function buildItemMonthSnapshot(record) {
        if (!record) {
            return {
                beginning: null,
                salesPlan: null,
                salesActual: null,
                salesAccuracy: null,
                productionPlan: null,
                productionActual: null,
                productionAccuracy: null,
                ending: null,
                isProjected: false,
                inventoryStatus: null,
            };
        }

        const beginning = parseNumberOrNull(record.beginning_inventory);
        const salesPlan = parseNumberOrNull(record.sales_plan);
        const salesActual = parseNumberOrNull(record.sales_actual);
        const productionPlan = parseNumberOrNull(record.adjusted_production_plan)
            ?? parseNumberOrNull(record.production_plan);
        const productionActual = parseNumberOrNull(record.production_actual);
        const ending = parseNumberOrNull(record.ending_inventory);
        const salesAccuracy = computeAccuracyRatio(salesPlan, salesActual);
        const productionAccuracy = computeAccuracyRatio(productionPlan, productionActual);
        const inventoryStatus = record.inventoryStatus && record.inventoryStatus.className
            ? sanitizeText(record.inventoryStatus.className).trim()
            : null;

        return {
            beginning: Number.isFinite(beginning) ? beginning : null,
            salesPlan: Number.isFinite(salesPlan) ? salesPlan : null,
            salesActual: Number.isFinite(salesActual) ? salesActual : null,
            salesAccuracy,
            productionPlan: Number.isFinite(productionPlan) ? productionPlan : null,
            productionActual: Number.isFinite(productionActual) ? productionActual : null,
            productionAccuracy,
            ending: Number.isFinite(ending) ? ending : null,
            isProjected: Boolean(record.isProjected),
            inventoryStatus,
        };
    }

    function buildCategoryMonthSnapshot(items, targetMonth) {
        let beginningTotal = 0;
        let hasBeginning = false;
        let salesPlanTotal = 0;
        let hasSalesPlan = false;
        let salesActualTotal = 0;
        let hasSalesActual = false;
        let productionPlanTotal = 0;
        let hasProductionPlan = false;
        let productionActualTotal = 0;
        let hasProductionActual = false;
        let endingTotal = 0;
        let hasEnding = false;
        let totalInputs = 0;
        let projectedInputs = 0;
        let shortageDetected = false;
        let overstockDetected = false;

        items.forEach((item) => {
            const record = item.recordMap.get(targetMonth);
            if (!record) return;

            totalInputs += 1;
            if (record.isProjected) {
                projectedInputs += 1;
            }

            const beginning = parseNumberOrNull(record.beginning_inventory);
            if (Number.isFinite(beginning)) {
                beginningTotal += beginning;
                hasBeginning = true;
            }

            const salesPlan = parseNumberOrNull(record.sales_plan);
            if (Number.isFinite(salesPlan)) {
                salesPlanTotal += salesPlan;
                hasSalesPlan = true;
            }

            const salesActual = parseNumberOrNull(record.sales_actual);
            if (Number.isFinite(salesActual)) {
                salesActualTotal += salesActual;
                hasSalesActual = true;
            }

            const productionPlan = parseNumberOrNull(record.adjusted_production_plan)
                ?? parseNumberOrNull(record.production_plan);
            if (Number.isFinite(productionPlan)) {
                productionPlanTotal += productionPlan;
                hasProductionPlan = true;
            }

            const productionActual = parseNumberOrNull(record.production_actual);
            if (Number.isFinite(productionActual)) {
                productionActualTotal += productionActual;
                hasProductionActual = true;
            }

            const ending = parseNumberOrNull(record.ending_inventory);
            if (Number.isFinite(ending)) {
                endingTotal += ending;
                hasEnding = true;
            }

            if (record.inventoryStatus && record.inventoryStatus.className) {
                const statusClass = sanitizeText(record.inventoryStatus.className).trim();
                if (statusClass === 'alert') {
                    shortageDetected = true;
                } else if (statusClass === 'overstock') {
                    overstockDetected = true;
                }
            }
        });

        const allProjected = totalInputs > 0 && projectedInputs === totalInputs;
        const salesAccuracy = hasSalesPlan && hasSalesActual && salesPlanTotal > 0
            ? salesActualTotal / salesPlanTotal
            : null;
        const productionAccuracy = hasProductionPlan && hasProductionActual && productionPlanTotal > 0
            ? productionActualTotal / productionPlanTotal
            : null;

        return {
            beginning: hasBeginning ? beginningTotal : null,
            salesPlan: hasSalesPlan ? salesPlanTotal : null,
            salesActual: hasSalesActual ? salesActualTotal : null,
            salesAccuracy,
            productionPlan: hasProductionPlan ? productionPlanTotal : null,
            productionActual: hasProductionActual ? productionActualTotal : null,
            productionAccuracy,
            ending: hasEnding ? endingTotal : null,
            allProjected,
            inventoryStatus: shortageDetected ? 'alert' : (overstockDetected ? 'overstock' : null),
        };
    }

    function createNumberCell(type, value, options = {}) {
        const {
            groupIndex = 0,
            isProjected = false,
            isFirstGroup = false,
            inventoryStatus = null,
            extraClasses = [],
        } = options;

        const cell = document.createElement('td');
        cell.classList.add('month-group', `month-index-${groupIndex}`, 'number');
        extraClasses.forEach((className) => cell.classList.add(className));

        if (type === 'beginning') {
            cell.classList.add('month-col-start', 'month-divider-right');
            if (isFirstGroup) {
                cell.classList.add('month-col-first');
            }
        } else if (type === 'ending') {
            cell.classList.add('month-col-end', 'month-divider-companion');
        } else {
            cell.classList.add('month-divider-companion');
        }

        if (Number.isFinite(value)) {
            cell.textContent = `${formatNumber(value)} EA`;
        } else {
            cell.textContent = '-';
        }

        if (isProjected) {
            cell.classList.add('projected');
        }

        if (inventoryStatus === 'alert') {
            cell.classList.add('inventory-issue', 'inventory-issue-shortage');
        } else if (inventoryStatus === 'overstock') {
            cell.classList.add('inventory-issue', 'inventory-issue-overstock');
        }

        return cell;
    }

    function createAccuracyCell(value, options = {}) {
        const {
            groupIndex = 0,
            isProjected = false,
            extraClasses = [],
        } = options;

        const cell = document.createElement('td');
        cell.classList.add('month-group', `month-index-${groupIndex}`, 'accuracy-value', 'forecast-accuracy', 'month-divider-right');
        extraClasses.forEach((className) => cell.classList.add(className));

        if (Number.isFinite(value)) {
            cell.textContent = formatPercent(value, 1);
            const status = classifyAccuracyRatio(value);
            if (status === 'good') {
                cell.classList.add('accuracy-good');
            } else if (status === 'low') {
                cell.classList.add('accuracy-low');
            } else if (status === 'high') {
                cell.classList.add('accuracy-high');
            }
        } else {
            cell.textContent = '-';
        }

        if (isProjected) {
            cell.classList.add('projected');
        }

        return cell;
    }
}

function handleForecastCategoryToggle(event) {
    const toggle = event.target.closest('.category-toggle');
    if (!toggle) return;
    event.preventDefault();
    const summaryRow = toggle.closest('.category-summary-row');
    if (!summaryRow) return;
    const shouldExpand = !summaryRow.classList.contains('expanded');
    applyForecastCategoryExpansion(summaryRow, shouldExpand);
}

function applyForecastCategoryExpansion(summaryRow, expand) {
    if (!summaryRow) return;
    const category = summaryRow.dataset ? summaryRow.dataset.category : '';
    if (!category) return;

    summaryRow.classList.toggle('expanded', expand);
    const toggle = summaryRow.querySelector('.category-toggle');
    if (toggle) {
        toggle.setAttribute('aria-expanded', expand ? 'true' : 'false');
    }

    if (!dom.dashboard || !dom.dashboard.forecastTable) return;

    const detailRows = Array.from(dom.dashboard.forecastTable.querySelectorAll('tr.category-detail-row'))
        .filter((row) => row.dataset && row.dataset.category === category);

    detailRows.forEach((row) => {
        if (expand) {
            row.classList.remove('hidden');
            row.setAttribute('aria-hidden', 'false');
        } else {
            row.classList.add('hidden');
            row.setAttribute('aria-hidden', 'true');
        }
    });

    if (expand) {
        state.inventoryExpandedCategories.add(category);
    } else {
        state.inventoryExpandedCategories.delete(category);
    }
}

function buildCategoryAccuracySummaryRows(groupedRecords, months) {
    if (!(groupedRecords instanceof Map)) return [];
    const monthList = Array.isArray(months) ? months : [];
    const summaryMap = new Map();

    groupedRecords.forEach((itemRecords, key) => {
        if (!Array.isArray(itemRecords) || itemRecords.length === 0) return;
        const reference = itemRecords[0];
        const categoryKey = sanitizeText(reference.category) || '-';
        const itemCode = sanitizeText(reference.item_code || key) || '-';

        let entry = summaryMap.get(categoryKey);
        if (!entry) {
            entry = {
                category: categoryKey,
                itemCodes: new Set(),
                months: new Map(),
            };
            summaryMap.set(categoryKey, entry);
        }
        entry.itemCodes.add(itemCode);

        const monthMap = new Map();
        itemRecords.forEach((record) => {
            const normalizedMonth = sanitizeText(record.month).trim();
            if (monthList.includes(normalizedMonth)) {
                monthMap.set(normalizedMonth, record);
            }
        });

        monthList.forEach((month) => {
            const record = monthMap.get(month);
            let monthSummary = entry.months.get(month);
            if (!monthSummary) {
                monthSummary = {
                    salesPlan: 0,
                    salesActual: 0,
                    productionPlan: 0,
                    productionActual: 0,
                    hasSalesActual: false,
                    hasProductionActual: false,
                    projectedInputs: 0,
                    totalInputs: 0,
                };
            }

            if (record) {
                const salesPlanValue = parseNumberOrNull(record.sales_plan);
                /* 보정 생산계획(사용자 관리값) 우선, 없으면 원본 production_plan 폴백 */
                const productionPlanValue = parseNumberOrNull(record.adjusted_production_plan)
                    ?? parseNumberOrNull(record.production_plan);

                /* ── 월말마감 확정 데이터 우선 적용 ──
                   과거 확정월(monthly_closings에 존재)이면 확정 실적 사용,
                   현재/미래월이면 기존 계산식(enriched) 사용 */
                const closingIdx = state.monthlyClosingIndex instanceof Map ? state.monthlyClosingIndex : new Map();
                const closingByMon = state.monthlyClosingByMonth instanceof Map ? state.monthlyClosingByMonth : new Map();
                const isConfirmedMonth = closingByMon.has(month);
                const recordItemCode = sanitizeText(record.item_code).trim();
                const closingKey = recordItemCode ? `${recordItemCode}|${month}` : '';
                const closingRecord = closingKey ? closingIdx.get(closingKey) : null;

                let salesActualValue;
                let productionActualValue;
                if (isConfirmedMonth && closingRecord) {
                    /* 과거 확정월: monthly_closings 테이블의 확정값 사용 */
                    salesActualValue = Number.isFinite(closingRecord.sales_actual) ? closingRecord.sales_actual : null;
                    productionActualValue = Number.isFinite(closingRecord.production_actual) ? closingRecord.production_actual : null;
                } else {
                    /* 현재/미래월: 기존 계산식(enriched) 사용 */
                    salesActualValue = parseNumberOrNull(record.sales_actual);
                    productionActualValue = parseNumberOrNull(record.production_actual);
                }

                if (Number.isFinite(salesPlanValue)) {
                    monthSummary.salesPlan += salesPlanValue;
                }
                if (Number.isFinite(salesActualValue)) {
                    monthSummary.salesActual += salesActualValue;
                    monthSummary.hasSalesActual = true;
                }
                if (Number.isFinite(productionPlanValue)) {
                    monthSummary.productionPlan += productionPlanValue;
                }
                if (Number.isFinite(productionActualValue)) {
                    monthSummary.productionActual += productionActualValue;
                    monthSummary.hasProductionActual = true;
                }
                monthSummary.totalInputs += 1;
                if (record.isProjected && !isConfirmedMonth) {
                    monthSummary.projectedInputs += 1;
                }
            }

            entry.months.set(month, monthSummary);
        });
    });

    const rows = Array.from(summaryMap.values())
        .sort((a, b) => sanitizeText(a.category).localeCompare(sanitizeText(b.category)))
        .map((entry) => {
            const monthsData = monthList.map((month) => {
                const summary = entry.months.get(month);
                if (!summary) {
                    return { sales: null, production: null, projected: false };
                }
                const salesRatio = computeAccuracyRatio(summary.salesPlan, summary.salesActual);
                const productionRatio = computeAccuracyRatio(summary.productionPlan, summary.productionActual);
                const projected = summary.totalInputs > 0
                    ? (summary.projectedInputs === summary.totalInputs
                        && !summary.hasSalesActual
                        && !summary.hasProductionActual)
                    : false;

                return {
                    sales: salesRatio,
                    production: productionRatio,
                    projected,
                };
            });

            return {
                category: entry.category,
                itemCount: entry.itemCodes.size,
                months: monthsData,
            };
        });

    return rows;
}

function renderInventoryAccuracySummaryTable(months, rows, overrides = {}) {
    const tableBody = overrides.tableBody || (dom.dashboard && dom.dashboard.accuracySummaryTable);
    if (!tableBody) return;
    const emptyState = overrides.emptyState || (dom.dashboard && dom.dashboard.accuracySummaryEmpty);
    const headMain = overrides.headMain || (dom.dashboard && dom.dashboard.accuracySummaryHeadMain);
    const headSub = overrides.headSub || (dom.dashboard && dom.dashboard.accuracySummaryHeadSub);

    tableBody.innerHTML = '';

    renderCategoryAccuracyCharts(months, rows, {
        container: overrides.chartContainer || (dom.dashboard && dom.dashboard.accuracySummaryCharts),
        emptyState: overrides.chartEmpty || (dom.dashboard && dom.dashboard.accuracySummaryChartEmpty),
        salesCanvas: overrides.salesCanvas || (dom.dashboard && dom.dashboard.accuracySummarySalesCanvas),
        productionCanvas: overrides.productionCanvas || (dom.dashboard && dom.dashboard.accuracySummaryProductionCanvas),
        stateKey: overrides.stateKey || 'inventoryAccuracyCharts',
    });

    const monthList = Array.isArray(months)
        ? months.map((month) => sanitizeText(month).trim()).filter((value) => value.length > 0)
        : [];
    const monthCount = monthList.length;

    if (headMain) {
        headMain.innerHTML = '';
        const categoryTh = document.createElement('th');
        categoryTh.textContent = '카테고리';
        categoryTh.setAttribute('scope', 'col');
        categoryTh.rowSpan = monthCount > 0 ? 2 : 1;
        headMain.appendChild(categoryTh);

        const countTh = document.createElement('th');
        countTh.textContent = '자재 수';
        countTh.setAttribute('scope', 'col');
        countTh.rowSpan = monthCount > 0 ? 2 : 1;
        headMain.appendChild(countTh);

        if (monthCount > 0) {
            monthList.forEach((month) => {
                const th = document.createElement('th');
                th.colSpan = 2;
                th.classList.add('month-group-heading');
                th.textContent = formatMonthToKoreanLabel(month) || '-';
                headMain.appendChild(th);
            });
        }
    }

    if (headSub) {
        headSub.innerHTML = '';
        if (monthCount > 0) {
            headSub.removeAttribute('hidden');
            monthList.forEach(() => {
                const salesTh = document.createElement('th');
                salesTh.classList.add('month-subhead');
                salesTh.textContent = '판매계획 대비 실적';
                headSub.appendChild(salesTh);

                const productionTh = document.createElement('th');
                productionTh.classList.add('month-subhead');
                productionTh.textContent = '생산계획 대비 실적';
                headSub.appendChild(productionTh);
            });
        } else {
            headSub.setAttribute('hidden', 'hidden');
        }
    }

    if (!rows || rows.length === 0) {
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        return;
    }

    if (emptyState) {
        emptyState.classList.add('hidden');
    }

    const fragment = document.createDocumentFragment();
    rows.forEach((rowData) => {
        const tr = document.createElement('tr');

        const categoryCell = document.createElement('td');
        categoryCell.textContent = sanitizeText(rowData.category) || '-';
        tr.appendChild(categoryCell);

        const countCell = document.createElement('td');
        countCell.textContent = Number.isFinite(rowData.itemCount) ? formatNumber(rowData.itemCount, '0') : '-';
        tr.appendChild(countCell);

        (Array.isArray(rowData.months) ? rowData.months : []).forEach((monthData) => {
            tr.appendChild(createAccuracyCell(monthData.sales, monthData.projected));
            tr.appendChild(createAccuracyCell(monthData.production, monthData.projected));
        });

        fragment.appendChild(tr);
    });

    tableBody.appendChild(fragment);

    function createAccuracyCell(ratio, projected) {
        const cell = document.createElement('td');
        cell.classList.add('accuracy-value');
        if (projected) {
            cell.classList.add('projected');
        }
        if (Number.isFinite(ratio)) {
            cell.textContent = formatPercent(ratio, 1);
            const status = classifyAccuracyRatio(ratio);
            if (status === 'good') {
                cell.classList.add('accuracy-good');
            } else if (status === 'low') {
                cell.classList.add('accuracy-low');
            } else if (status === 'high') {
                cell.classList.add('accuracy-high');
            }
        } else {
            cell.textContent = '-';
        }
        return cell;
    }
}

function renderCategoryAccuracyCharts(months, rows, options = {}) {
    const {
        container = null,
        emptyState = null,
        salesCanvas = null,
        productionCanvas = null,
        stateKey = 'inventoryAccuracyCharts',
    } = options;

    if (!salesCanvas || !productionCanvas) {
        if (container) {
            container.classList.add('hidden');
        }
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        destroyChartInstance('sales');
        destroyChartInstance('production');
        return;
    }

    if (!state[stateKey]) {
        state[stateKey] = { sales: null, production: null };
    }

    const chartStore = state[stateKey];

    const monthList = Array.isArray(months)
        ? months.map((month) => sanitizeText(month).trim()).filter((value) => value.length > 0)
        : [];

    const normalizedRows = Array.isArray(rows)
        ? rows.filter((row) => row && Array.isArray(row.months))
        : [];

    const hasSalesData = normalizedRows.some((row) => row.months.some((monthData) => monthData && Number.isFinite(monthData.sales)));
    const hasProductionData = normalizedRows.some((row) => row.months.some((monthData) => monthData && Number.isFinite(monthData.production)));
    const hasAnyData = monthList.length > 0 && (hasSalesData || hasProductionData);

    if (!hasAnyData) {
        destroyChartInstance('sales');
        destroyChartInstance('production');
        if (container) {
            container.classList.add('hidden');
        }
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        setChartCardEmpty(salesCanvas, true);
        setChartCardEmpty(productionCanvas, true);
        return;
    }

    if (emptyState) {
        emptyState.classList.add('hidden');
    }
    if (container) {
        container.classList.remove('hidden');
    }

    const labels = monthList.map((month) => formatMonthToKoreanLabel(month) || month);
    const colorMap = buildCategoryColorMap(normalizedRows);
    const salesDatasets = hasSalesData ? buildAccuracyDatasets(normalizedRows, 'sales', colorMap) : [];
    const productionDatasets = hasProductionData ? buildAccuracyDatasets(normalizedRows, 'production', colorMap) : [];

    setChartCardEmpty(salesCanvas, salesDatasets.length === 0);
    setChartCardEmpty(productionCanvas, productionDatasets.length === 0);

    updateChart('sales', salesCanvas, labels, salesDatasets);
    updateChart('production', productionCanvas, labels, productionDatasets);

    function destroyChartInstance(key) {
        if (chartStore && chartStore[key] && typeof chartStore[key].destroy === 'function') {
            chartStore[key].destroy();
        }
        if (chartStore) {
            chartStore[key] = null;
        }
    }

    function setChartCardEmpty(canvas, empty) {
        if (!canvas) return;
        const card = canvas.closest('[data-chart]');
        if (!card) return;
        if (empty) {
            card.classList.add('empty');
        } else {
            card.classList.remove('empty');
        }
    }

    function buildCategoryColorMap(rowsSource) {
        const map = new Map();
        let colorIndex = 0;
        rowsSource.forEach((row) => {
            const key = resolveCategoryKey(row);
            if (!map.has(key)) {
                const color = LINE_CAPA_USAGE_COLORS[colorIndex % LINE_CAPA_USAGE_COLORS.length];
                map.set(key, color);
                colorIndex += 1;
            }
        });
        return map;
    }

    function resolveCategoryKey(row) {
        const name = sanitizeText(row && row.category).trim();
        return name || '미분류';
    }

    function buildAccuracyDatasets(rowsSource, valueKey, colorMapping) {
        const filtered = rowsSource.filter((row) => row.months.some((monthData) => monthData && Number.isFinite(monthData[valueKey])));
        return filtered.map((row) => {
            const categoryKey = resolveCategoryKey(row);
            const color = colorMapping.get(categoryKey) || '#2563eb';
            const backgroundColor = applyAlphaToHex(color, 0.18);
            const itemCount = Number.isFinite(row.itemCount) ? row.itemCount : null;
            const countLabel = itemCount && itemCount > 0 ? ` (자재 ${itemCount.toLocaleString('ko-KR')}개)` : '';
            const label = `${categoryKey}${countLabel}`;
            const projectedFlags = row.months.map((monthData) => Boolean(monthData && monthData.projected));
            const data = row.months.map((monthData) => {
                if (!monthData || !Number.isFinite(monthData[valueKey])) {
                    return null;
                }
                const ratio = Number(monthData[valueKey]);
                if (!Number.isFinite(ratio)) {
                    return null;
                }
                return Number((ratio * 100).toFixed(1));
            });
            return {
                label,
                data,
                projectedFlags,
                borderColor: color,
                backgroundColor,
                borderWidth: 2,
                tension: 0.32,
                fill: false,
                spanGaps: true,
                pointBorderColor: color,
                pointBorderWidth: 1.4,
                pointHitRadius: 12,
                pointHoverBorderColor: color,
                pointHoverBorderWidth: 1.8,
                pointRadius(context) {
                    if (context.raw === null || typeof context.raw === 'undefined') {
                        return 0;
                    }
                    return projectedFlags[context.dataIndex] ? 4 : 3;
                },
                pointHoverRadius(context) {
                    if (context.raw === null || typeof context.raw === 'undefined') {
                        return 0;
                    }
                    return projectedFlags[context.dataIndex] ? 6 : 5;
                },
                pointBackgroundColor(context) {
                    if (context.raw === null || typeof context.raw === 'undefined') {
                        return color;
                    }
                    return projectedFlags[context.dataIndex] ? '#ffffff' : color;
                },
                pointStyle(context) {
                    if (context.raw === null || typeof context.raw === 'undefined') {
                        return 'circle';
                    }
                    return projectedFlags[context.dataIndex] ? 'triangle' : 'circle';
                },
                segment: {
                    borderDash(ctx) {
                        const p0 = projectedFlags[ctx.p0DataIndex];
                        const p1 = projectedFlags[Math.min(ctx.p1DataIndex, projectedFlags.length - 1)];
                        return (p0 || p1) ? [6, 4] : undefined;
                    },
                },
            };
        });
    }

    function updateChart(key, canvas, labelsSource, datasets) {
        destroyChartInstance(key);
        if (!canvas || !Array.isArray(datasets) || datasets.length === 0) {
            return;
        }
        const valuePool = datasets
            .flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
        const minValue = valuePool.length > 0 ? Math.min(...valuePool) : 0;
        const maxValue = valuePool.length > 0 ? Math.max(...valuePool) : 100;
        let suggestedMin = 0;
        let suggestedMax = 120;
        if (valuePool.length > 0) {
            suggestedMin = Math.floor(Math.min(minValue, 80) / 10) * 10;
            suggestedMax = Math.ceil(Math.max(maxValue, 110) / 10) * 10;
            if (suggestedMin > 10) {
                suggestedMin -= 10;
            }
            if (suggestedMin < 0) {
                suggestedMin = 0;
            }
            suggestedMax += 10;
            if (suggestedMax < 120) {
                suggestedMax = 120;
            }
            if (suggestedMin >= suggestedMax) {
                suggestedMax = suggestedMin + 20;
            }
        }

        chartStore[key] = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labelsSource,
                datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    intersect: false,
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '월',
                            font: {
                                family: 'Noto Sans KR',
                                weight: '600',
                            },
                        },
                        grid: {
                            display: false,
                        },
                        ticks: {
                            maxRotation: 0,
                            autoSkip: false,
                            font: {
                                family: 'Noto Sans KR',
                            },
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: '적중율(%)',
                            font: {
                                family: 'Noto Sans KR',
                                weight: '600',
                            },
                        },
                        ticks: {
                            callback(value) {
                                return `${value}%`;
                            },
                            font: {
                                family: 'Noto Sans KR',
                            },
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.35)',
                            borderDash: [4, 4],
                        },
                        suggestedMin,
                        suggestedMax,
                    },
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 16,
                            font: {
                                family: 'Noto Sans KR',
                            },
                        },
                    },
                    tooltip: {
                        padding: 12,
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        callbacks: {
                            title(context) {
                                if (!context || context.length === 0) return '';
                                return context[0].label;
                            },
                            label(context) {
                                const datasetLabel = sanitizeText(context.dataset.label) || '';
                                const value = context.parsed && Number.isFinite(context.parsed.y)
                                    ? context.parsed.y
                                    : null;
                                if (!Number.isFinite(value)) {
                                    return `${datasetLabel}: 데이터 없음`;
                                }
                                return `${datasetLabel}: ${value.toLocaleString('ko-KR', {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1,
                                })}%`;
                            },
                        },
                    },
                    title: {
                        display: false,
                    },
                },
            },
        });
    }
}

function syncDashboardBaseMonthWithFilter() {
    if (!dom.dashboard || !dom.dashboard.baseMonth) return;
    const select = dom.dashboard.baseMonth;
    const manualSelection = select.dataset.manualSelection === 'true';
    const options = Array.from(select.options || []);

    if (manualSelection) {
        const manualValue = select.value || select.dataset.selectedMonth || '';
        renderInventoryForecastTable(manualValue || null);
        return;
    }

    const filterMonthValue = dom.filters.month.value;
    const now = new Date();
    const systemMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    let target = '';
    if (filterMonthValue && filterMonthValue !== 'all' && options.some((option) => option.value === filterMonthValue)) {
        target = filterMonthValue;
    } else if (select.dataset.selectedMonth && options.some((option) => option.value === select.dataset.selectedMonth)) {
        target = select.dataset.selectedMonth;
    } else if (options.some((option) => option.value === systemMonth)) {
        /* 디폴트: 시스템 현재월 */
        target = systemMonth;
    } else {
        target = select.value || '';
    }

    if (target && !options.some((option) => option.value === target)) {
        target = options.length > 0 ? options[0].value : '';
    }

    if (target) {
        if (select.value !== target) {
            select.value = target;
        }
        select.dataset.selectedMonth = target;
        renderInventoryForecastTable(target);
    } else {
        renderInventoryForecastTable(null);
    }
}

function updateDashboardBaseMonthOptions() {
    if (!dom.dashboard || !dom.dashboard.baseMonth) return;
    const select = dom.dashboard.baseMonth;
    const manualSelection = select.dataset.manualSelection === 'true';
    const previousSelection = select.dataset.selectedMonth || select.value;
    const records = getDashboardFilteredRecords();
    const months = getUniqueMonthsFromRecords(records);

    select.innerHTML = '';

    if (months.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '데이터 없음';
        select.appendChild(option);
        select.disabled = true;
        select.dataset.selectedMonth = '';
        select.dataset.manualSelection = 'false';
        if (dom.dashboard.forecastMonthHeaders && dom.dashboard.forecastMonthHeaders.length > 0) {
            dom.dashboard.forecastMonthHeaders.forEach((header) => {
                if (header) header.textContent = '-';
            });
        }
        renderInventoryForecastTable(null, records);
        return;
    }

    select.disabled = false;
    months.forEach((month) => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        select.appendChild(option);
    });

    const monthFilterValue = dom.filters.month.value;
    let targetMonth = null;

    // 시스템 현재월 (YYYY-MM)
    const now = new Date();
    const systemMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

    if (manualSelection && previousSelection && months.includes(previousSelection)) {
        targetMonth = previousSelection;
    } else if (monthFilterValue && monthFilterValue !== 'all' && months.includes(monthFilterValue)) {
        targetMonth = monthFilterValue;
    } else if (previousSelection && months.includes(previousSelection)) {
        targetMonth = previousSelection;
    } else if (months.includes(systemMonth)) {
        // 디폴트: 시스템 현재월
        targetMonth = systemMonth;
    } else {
        targetMonth = months[0];
    }

    if (!months.includes(targetMonth)) {
        targetMonth = months[0];
        select.dataset.manualSelection = 'false';
    }

    if (!select.dataset.manualSelection) {
        select.dataset.manualSelection = manualSelection ? 'true' : 'false';
    }

    select.value = targetMonth;
    select.dataset.selectedMonth = targetMonth;
    if (!manualSelection) {
        select.dataset.manualSelection = 'false';
    }
    renderInventoryForecastTable(targetMonth, records);
}

function updateLineDatalistOptions(lines) {
    if (!dom.lineDatalist) return;
    const unique = new Set([...DEFAULT_LINES, ...lines]);
    dom.lineDatalist.innerHTML = '';
    unique.forEach((line) => {
        const option = document.createElement('option');
        option.value = line;
        dom.lineDatalist.appendChild(option);
    });
}

function updateLineCategoryDatalist(categories) {
    if (!dom.lineDowntime || !dom.lineDowntime.categoryDatalist) return;
    const datalist = dom.lineDowntime.categoryDatalist;
    const values = Array.from(new Set(categories || [])).sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));
    datalist.innerHTML = '';
    values.forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        datalist.appendChild(option);
    });
}

function updateLineCategorySuggestions() {
    const categoriesFromPlans = getUniqueLineCategoriesFromPlans(state.lineDowntimePlans);
    const categoriesFromMasters = getUniqueLineCategoriesFromMasters(state.lineItemMasters);
    const combined = Array.from(new Set([...categoriesFromPlans, ...categoriesFromMasters]));
    updateLineCategoryDatalist(combined);
}

function updateSharedLineResources() {
    const baseLines = getUniqueLines(state.rawData);
    const downtimeLines = getUniqueLinesFromLinePlans(state.lineDowntimePlans);
    const masterLines = getUniqueLinesFromMasters(state.lineItemMasters);
    const combinedLines = Array.from(new Set([...baseLines, ...downtimeLines, ...masterLines]));
    updateLineDatalistOptions(combinedLines);
}

// -------------------- 변경 이력 관리 --------------------
function normalizeHistoryTabKey(value) {
    return value === 'upload' ? 'upload' : 'production';
}

function normalizeProductionChangeLog(record) {
    if (!record) return null;

    const previous = parseNumberOrNull(record.previous_production_plan);
    const current = parseNumberOrNull(record.new_production_plan);
    const changeTypeRaw = sanitizeText(record.change_type).trim().toLowerCase();
    const changeType = changeTypeRaw === 'created' || changeTypeRaw === 'deleted' ? changeTypeRaw : 'updated';

    let changeLabel = '수정';
    if (changeType === 'created') {
        changeLabel = '신규 등록';
    } else if (changeType === 'deleted') {
        changeLabel = '삭제';
    }

    const timestamp = coerceTimestamp(record.confirmed_at) || coerceTimestamp(record.created_at);
    let diff = null;
    if (Number.isFinite(current) && Number.isFinite(previous)) {
        diff = current - previous;
    } else if (Number.isFinite(current) && !Number.isFinite(previous)) {
        diff = current;
    } else if (!Number.isFinite(current) && Number.isFinite(previous)) {
        diff = -previous;
    }

    return {
        id: record.id,
        record_id: sanitizeText(record.record_id).trim(),
        item_code: sanitizeText(record.item_code).trim(),
        item_name: sanitizeText(record.item_name).trim(),
        month: sanitizeText(record.month).trim(),
        production_line: sanitizeText(record.production_line).trim(),
        changeType,
        changeLabel,
        previous_production_plan: previous,
        new_production_plan: current,
        diff,
        sales_plan: parseNumberOrNull(record.sales_plan),
        beginning_inventory: parseNumberOrNull(record.beginning_inventory),
        target_ending_inventory: parseNumberOrNull(record.target_ending_inventory),
        ending_inventory: parseNumberOrNull(record.ending_inventory),
        timestamp: timestamp ?? 0,
        displayTimestamp: timestamp ? formatDateTime(timestamp, { second: '2-digit' }) : '시간 정보 없음',
        created_at: record.created_at ?? record.confirmed_at ?? null,
    };
}

function populateChangeHistoryFilters(records = state.changeHistoryRecords) {
    if (!dom.changeHistory) return;
    const { filterMonth, filterItem } = dom.changeHistory;

    const monthSet = new Set();
    const itemMap = new Map();

    (records || []).forEach((record) => {
        if (!record) return;
        if (record.month) {
            monthSet.add(record.month);
        }
        if (record.item_code) {
            if (!itemMap.has(record.item_code)) {
                itemMap.set(record.item_code, sanitizeText(record.item_name).trim());
            }
        }
    });

    if (filterMonth) {
        const previous = filterMonth.value || 'all';
        filterMonth.innerHTML = '<option value="all">전체</option>';
        const months = Array.from(monthSet).sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));
        months.forEach((month) => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = month;
            filterMonth.appendChild(option);
        });
        if (months.includes(previous)) {
            filterMonth.value = previous;
        } else {
            filterMonth.value = 'all';
        }
    }

    if (filterItem) {
        const previous = filterItem.value || 'all';
        filterItem.innerHTML = '<option value="all">전체</option>';
        const items = Array.from(itemMap.entries()).sort((a, b) => sanitizeText(a[0]).localeCompare(sanitizeText(b[0])));
        items.forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            const displayName = sanitizeText(name).trim();
            option.textContent = displayName && displayName !== code
                ? `${displayName} (${code})`
                : code;
            filterItem.appendChild(option);
        });
        if (itemMap.has(previous)) {
            filterItem.value = previous;
        } else {
            filterItem.value = 'all';
        }
    }
}

function getFilteredChangeHistoryRecords() {
    const records = Array.isArray(state.changeHistoryRecords) ? state.changeHistoryRecords : [];
    if (!dom.changeHistory) return records;
    const typeFilter = dom.changeHistory.filterType ? dom.changeHistory.filterType.value : 'all';
    const monthFilter = dom.changeHistory.filterMonth ? dom.changeHistory.filterMonth.value : 'all';
    const itemFilter = dom.changeHistory.filterItem ? dom.changeHistory.filterItem.value : 'all';

    return records.filter((record) => {
        if (typeFilter !== 'all' && record.changeType !== typeFilter) {
            return false;
        }
        if (monthFilter !== 'all' && record.month !== monthFilter) {
            return false;
        }
        if (itemFilter !== 'all' && record.item_code !== itemFilter) {
            return false;
        }
        return true;
    });
}

function renderChangeHistoryTable() {
    if (!dom.changeHistory || !dom.changeHistory.tableBody) {
        console.log('[DEBUG] renderChangeHistoryTable: DOM 없음', !!dom.changeHistory, dom.changeHistory && !!dom.changeHistory.tableBody);
        return;
    }
    const tbody = dom.changeHistory.tableBody;
    const emptyState = dom.changeHistory.empty;
    tbody.innerHTML = '';

    const records = getFilteredChangeHistoryRecords();
    const sortedRecords = Array.isArray(records)
        ? [...records].sort((a, b) => b.timestamp - a.timestamp)
        : [];

    if (sortedRecords.length === 0) {
        if (emptyState) {
            const baseMessage = emptyState.dataset.baseMessage || emptyState.textContent;
            if (!emptyState.dataset.baseMessage) {
                emptyState.dataset.baseMessage = baseMessage;
            }
            if (Array.isArray(state.changeHistoryRecords) && state.changeHistoryRecords.length > 0) {
                emptyState.textContent = '선택한 필터 조건에 맞는 변경 이력이 없습니다.';
            } else {
                emptyState.textContent = baseMessage;
            }
            emptyState.classList.remove('hidden');
        }
        return;
    }

    if (emptyState) {
        emptyState.classList.add('hidden');
        if (emptyState.dataset.baseMessage) {
            emptyState.textContent = emptyState.dataset.baseMessage;
        }
    }

    const fragment = document.createDocumentFragment();
    const createEaCell = (value, options = {}) => {
        const cell = document.createElement('td');
        cell.className = 'number';
        if (options.className) {
            cell.classList.add(options.className);
        }
        if (Number.isFinite(value)) {
            cell.textContent = `${formatNumber(value)} BOX`;
        } else {
            cell.textContent = '-';
        }
        return cell;
    };

    const createDiffCell = (value) => {
        const cell = document.createElement('td');
        cell.className = 'number';
        if (Number.isFinite(value)) {
            if (value === 0) {
                cell.textContent = '0 BOX';
                cell.classList.add('diff-zero');
            } else {
                const sign = value > 0 ? '+' : '-';
                const formatted = formatNumber(Math.abs(value));
                cell.textContent = `${sign}${formatted} BOX`;
                cell.classList.add(value > 0 ? 'diff-positive' : 'diff-negative');
            }
        } else {
            cell.textContent = '-';
        }
        return cell;
    };

    sortedRecords.forEach((record) => {
        const row = document.createElement('tr');

        const typeCell = document.createElement('td');
        const typeBadge = document.createElement('span');
        let badgeClass = 'warning';
        if (record.changeType === 'created') {
            badgeClass = 'safe';
        } else if (record.changeType === 'deleted') {
            badgeClass = 'danger';
        }
        typeBadge.className = `tag ${badgeClass}`;
        typeBadge.textContent = record.changeLabel;
        typeCell.appendChild(typeBadge);
        row.appendChild(typeCell);

        const timeCell = document.createElement('td');
        timeCell.textContent = record.displayTimestamp || '시간 정보 없음';
        row.appendChild(timeCell);

        const codeCell = document.createElement('td');
        codeCell.textContent = record.item_code || '-';
        row.appendChild(codeCell);

        const nameCell = document.createElement('td');
        nameCell.className = 'col-item-name';
        nameCell.textContent = record.item_name || record.item_code || '-';
        row.appendChild(nameCell);

        const monthCell = document.createElement('td');
        monthCell.textContent = record.month || '-';
        row.appendChild(monthCell);

        row.appendChild(createEaCell(record.previous_production_plan, { className: 'change-value-before' }));
        row.appendChild(createEaCell(record.new_production_plan, { className: 'change-value-after' }));
        row.appendChild(createDiffCell(record.diff));
        row.appendChild(createEaCell(record.sales_plan));
        row.appendChild(createEaCell(record.beginning_inventory));
        row.appendChild(createEaCell(record.target_ending_inventory));
        row.appendChild(createEaCell(record.ending_inventory));

        const lineCell = document.createElement('td');
        lineCell.textContent = record.production_line || '-';
        row.appendChild(lineCell);

        fragment.appendChild(row);
    });

    tbody.appendChild(fragment);
}

function populateUploadHistoryItemFilter() {
    if (!dom.changeHistory || !dom.changeHistory.uploadFilterItem) return;
    const select = dom.changeHistory.uploadFilterItem;
    const previousValue = select.value || 'all';

    const historyRecords = Array.isArray(state.salesUploadHistory) ? state.salesUploadHistory : [];
    const uniqueCodes = new Set();
    historyRecords.forEach((record) => {
        const code = sanitizeText(record.item_code).trim();
        if (code) {
            uniqueCodes.add(code);
        }
    });

    select.innerHTML = '<option value="all">전체</option>';

    if (uniqueCodes.size === 0) {
        select.value = 'all';
        return;
    }

    const itemNameMap = new Map();
    (state.rawData || []).forEach((record) => {
        const code = sanitizeText(record.item_code).trim();
        if (!code || itemNameMap.has(code)) return;
        const name = sanitizeText(record.item_name).trim();
        if (name) {
            itemNameMap.set(code, name);
        }
    });

    const sortedCodes = Array.from(uniqueCodes).sort((a, b) => a.localeCompare(b, 'ko', {
        sensitivity: 'base',
        numeric: true,
    }));

    sortedCodes.forEach((code) => {
        const option = document.createElement('option');
        option.value = code;
        const name = itemNameMap.get(code);
        option.textContent = name ? `${code} · ${name}` : code;
        select.appendChild(option);
    });

    if (previousValue && previousValue !== 'all' && uniqueCodes.has(previousValue)) {
        select.value = previousValue;
    } else {
        select.value = 'all';
    }
}

function renderUploadHistoryTable() {
    if (!dom.changeHistory || !dom.changeHistory.uploadTableBody) return;
    const tbody = dom.changeHistory.uploadTableBody;
    const emptyState = dom.changeHistory.uploadEmpty;
    tbody.innerHTML = '';

    const historyRecords = Array.isArray(state.salesUploadHistory) ? [...state.salesUploadHistory] : [];
    const fromInput = dom.changeHistory.uploadFilterFrom;
    const toInput = dom.changeHistory.uploadFilterTo;
    const itemSelect = dom.changeHistory.uploadFilterItem;
    const selectedItem = itemSelect ? sanitizeText(itemSelect.value).trim() : 'all';
    const fromTs = fromInput && fromInput.value ? coerceTimestamp(`${fromInput.value}T00:00:00`) : null;
    const toTs = toInput && toInput.value ? coerceTimestamp(`${toInput.value}T23:59:59.999`) : null;

    const filtered = historyRecords.filter((record) => {
        if (!record) return false;
        const timestamp = getRecordTimestamp(record);
        if (fromTs !== null && timestamp !== null && timestamp < fromTs) {
            return false;
        }
        if (toTs !== null && timestamp !== null && timestamp > toTs) {
            return false;
        }
        if (selectedItem && selectedItem !== 'all') {
            const code = sanitizeText(record.item_code).trim();
            if (code !== selectedItem) {
                return false;
            }
        }
        return true;
    });

    if (filtered.length === 0) {
        if (emptyState) {
            const baseMessage = emptyState.dataset.baseMessage || emptyState.textContent;
            if (!emptyState.dataset.baseMessage) {
                emptyState.dataset.baseMessage = baseMessage;
            }
            if (historyRecords.length > 0) {
                emptyState.textContent = '선택한 기간에 해당하는 업로드 데이터가 없습니다.';
            } else {
                emptyState.textContent = baseMessage;
            }
            emptyState.classList.remove('hidden');
        }
        return;
    }

    if (emptyState) {
        emptyState.classList.add('hidden');
        if (emptyState.dataset.baseMessage) {
            emptyState.textContent = emptyState.dataset.baseMessage;
        }
    }

    const itemNameMap = new Map();
    (state.rawData || []).forEach((record) => {
        const code = sanitizeText(record.item_code).trim();
        if (!code || itemNameMap.has(code)) return;
        const name = sanitizeText(record.item_name).trim();
        if (name) {
            itemNameMap.set(code, name);
        }
    });

    const channelIndex = state.salesChannelIndex instanceof Map ? state.salesChannelIndex : new Map();

    filtered.sort((a, b) => {
        const timeA = getRecordTimestamp(a) ?? 0;
        const timeB = getRecordTimestamp(b) ?? 0;
        if (timeA !== timeB) {
            return timeB - timeA;
        }
        const monthA = sanitizeText(a.month).trim();
        const monthB = sanitizeText(b.month).trim();
        const monthDiff = monthB.localeCompare(monthA);
        if (monthDiff !== 0) {
            return monthDiff;
        }
        const itemDiff = sanitizeText(b.item_code).trim().localeCompare(sanitizeText(a.item_code).trim());
        if (itemDiff !== 0) {
            return itemDiff;
        }
        return sanitizeText(b.channel).trim().localeCompare(sanitizeText(a.channel).trim());
    });

    const fragment = document.createDocumentFragment();

    filtered.forEach((record) => {
        const row = document.createElement('tr');

        const timestamp = getRecordTimestamp(record);
        const timeCell = document.createElement('td');
        timeCell.textContent = timestamp ? formatDateTime(timestamp) : '-';
        row.appendChild(timeCell);

        const typeCell = document.createElement('td');
        typeCell.textContent = record.upload_type === 'manual' ? '단건 등록' : '파일 업로드';
        row.appendChild(typeCell);

        const referenceCell = document.createElement('td');
        referenceCell.textContent = record.upload_reference || '-';
        referenceCell.title = record.upload_reference || '';
        row.appendChild(referenceCell);

        const actionCell = document.createElement('td');
        const action = sanitizeText(record.action).trim();
        actionCell.textContent = action
            ? action === 'overwrite'
                ? '덮어쓰기'
                : action === 'create'
                    ? '신규 등록'
                    : action
            : '-';
        row.appendChild(actionCell);

        const monthCell = document.createElement('td');
        monthCell.textContent = sanitizeText(record.month).trim() || '-';
        row.appendChild(monthCell);

        const code = sanitizeText(record.item_code).trim();
        const codeCell = document.createElement('td');
        codeCell.textContent = code || '-';
        row.appendChild(codeCell);

        const nameCell = document.createElement('td');
        nameCell.className = 'col-item-name';
        const itemName = code && itemNameMap.has(code) ? itemNameMap.get(code) : '';
        nameCell.textContent = itemName || '-';
        row.appendChild(nameCell);

        const channelCell = document.createElement('td');
        const channelInfo = getChannelInfo(channelIndex, record.channel);
        const channelKey = sanitizeText(record.channel).trim();
        const channelName = channelInfo ? sanitizeText(channelInfo.channel_name).trim() : '';
        if (channelName && channelKey) {
            channelCell.textContent = `${channelName} (${channelKey})`;
        } else if (channelName) {
            channelCell.textContent = channelName;
        } else {
            channelCell.textContent = channelKey || '-';
        }
        row.appendChild(channelCell);

        const standardValue = toNumber(record.standard_quantity);
        const promotionValue = toNumber(record.promotion_quantity);
        const totalValue = toNumber(record.quantity);

        const standardCell = document.createElement('td');
        standardCell.className = 'number metric-cell metric-current';
        standardCell.textContent = formatNumber(standardValue);
        row.appendChild(standardCell);

        const promotionCell = document.createElement('td');
        promotionCell.className = 'number metric-cell metric-current';
        promotionCell.textContent = formatNumber(promotionValue);
        row.appendChild(promotionCell);

        const totalCell = document.createElement('td');
        totalCell.className = 'number metric-cell metric-current';
        totalCell.textContent = formatNumber(totalValue);
        row.appendChild(totalCell);

        const prevStandardCell = document.createElement('td');
        prevStandardCell.className = 'number metric-cell metric-previous muted';
        prevStandardCell.textContent = Number.isFinite(record.previous_standard_quantity)
            ? formatNumber(record.previous_standard_quantity)
            : '-';
        row.appendChild(prevStandardCell);

        const prevPromotionCell = document.createElement('td');
        prevPromotionCell.className = 'number metric-cell metric-previous muted';
        prevPromotionCell.textContent = Number.isFinite(record.previous_promotion_quantity)
            ? formatNumber(record.previous_promotion_quantity)
            : '-';
        row.appendChild(prevPromotionCell);

        const prevTotalCell = document.createElement('td');
        prevTotalCell.className = 'number metric-cell metric-previous muted';
        prevTotalCell.textContent = Number.isFinite(record.previous_quantity)
            ? formatNumber(record.previous_quantity)
            : '-';
        row.appendChild(prevTotalCell);

        const noteCell = document.createElement('td');
        noteCell.className = 'col-notes';
        const note = sanitizeText(record.note).trim();
        if (note) {
            noteCell.textContent = note;
            noteCell.title = note;
        } else {
            noteCell.textContent = '-';
        }
        row.appendChild(noteCell);

        const prevNoteCell = document.createElement('td');
        prevNoteCell.className = 'col-notes muted';
        const previousNote = sanitizeText(record.previous_note).trim();
        if (previousNote) {
            prevNoteCell.textContent = previousNote;
            prevNoteCell.title = previousNote;
        } else {
            prevNoteCell.textContent = '-';
        }
        row.appendChild(prevNoteCell);

        fragment.appendChild(row);
    });

    tbody.appendChild(fragment);
}

function exportChangeHistoryCsv() {
    const records = getFilteredChangeHistoryRecords();
    if (!records || records.length === 0) {
        alert('내보낼 변경 이력 데이터가 없습니다. 필터를 조정해 보세요.');
        return;
    }

    const sortedRecords = [...records].sort((a, b) => b.timestamp - a.timestamp);

    const headers = [
        '변경유형',
        '확정일시',
        '자재코드',
        '자재명',
        '계획월',
        '변경전생산계획(BOX)',
        '변경후생산계획(BOX)',
        '증감(BOX)',
        '판매계획(BOX)',
        '가용재고(BOX)',
        '적정재고(BOX)',
        '예상월말재고(BOX)',
        '생산라인',
    ];

    const rows = sortedRecords.map((record) => {
        const diffValue = Number.isFinite(record.diff) ? record.diff : null;
        let diffText = '';
        if (diffValue !== null) {
            if (diffValue === 0) {
                diffText = '0 BOX';
            } else {
                const sign = diffValue > 0 ? '+' : '-';
                diffText = `${sign}${Math.abs(diffValue).toLocaleString('ko-KR')} BOX`;
            }
        }

        const data = [
            record.changeLabel,
            record.displayTimestamp,
            record.item_code,
            record.item_name || record.item_code || '',
            record.month,
            Number.isFinite(record.previous_production_plan) ? formatNumber(record.previous_production_plan) : '',
            Number.isFinite(record.new_production_plan) ? formatNumber(record.new_production_plan) : '',
            diffValue === null ? '' : diffText,
            Number.isFinite(record.sales_plan) ? formatNumber(record.sales_plan) : '',
            Number.isFinite(record.available_inventory) ? formatNumber(record.available_inventory) : '',
            Number.isFinite(record.target_ending_inventory) ? formatNumber(record.target_ending_inventory) : '',
            Number.isFinite(record.ending_inventory) ? formatNumber(record.ending_inventory) : '',
            record.production_line || '',
        ];
        return data.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `change_history_export_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function refreshChangeHistoryView(options = {}) {
    const { populateFilters = false } = options;
    if (populateFilters) {
        populateChangeHistoryFilters(state.changeHistoryRecords);
    }
    if (state.changeHistoryActiveTab === 'production') {
        renderChangeHistoryTable();
    } else if (state.changeHistoryActiveTab === 'upload') {
        renderUploadHistoryTable();
    }
}

function setChangeHistoryTab(targetKey, options = {}) {
    if (!dom.changeHistory) return;
    const { focus = false, suppressRender = false } = options;
    const tabs = Array.isArray(dom.changeHistory.tabs) ? dom.changeHistory.tabs : [];
    const panels = Array.isArray(dom.changeHistory.panels) ? dom.changeHistory.panels : [];
    const normalized = normalizeHistoryTabKey(targetKey);

    state.changeHistoryActiveTab = normalized;

    tabs.forEach((button) => {
        if (!button) return;
        const key = normalizeHistoryTabKey(button.dataset.historyTarget);
        const isActive = key === normalized;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        button.setAttribute('tabindex', isActive ? '0' : '-1');
        if (isActive && focus) {
            button.focus();
        }
    });

    panels.forEach((panel) => {
        if (!panel) return;
        const key = normalizeHistoryTabKey(panel.dataset.historyPanel);
        const isActive = key === normalized;
        panel.classList.toggle('hidden', !isActive);
        panel.classList.toggle('active', isActive);
        panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        if (isActive) {
            panel.removeAttribute('hidden');
        } else {
            panel.setAttribute('hidden', 'hidden');
        }
    });

    if (!suppressRender) {
        if (normalized === 'production') {
            renderChangeHistoryTable();
        } else {
            renderUploadHistoryTable();
        }
    }
}

function handleChangeHistoryTabKeydown(event) {
    if (!dom.changeHistory) return;
    const tabs = Array.isArray(dom.changeHistory.tabs) ? dom.changeHistory.tabs : [];
    if (tabs.length === 0) return;
    const currentTarget = event.currentTarget;
    const currentIndex = tabs.indexOf(currentTarget);
    if (currentIndex === -1) return;
    const { key } = event;

    if (key === 'ArrowRight' || key === 'ArrowLeft') {
        event.preventDefault();
        const offset = key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (currentIndex + offset + tabs.length) % tabs.length;
        const nextButton = tabs[nextIndex];
        if (nextButton) {
            setChangeHistoryTab(nextButton.dataset.historyTarget, { focus: true });
        }
    } else if (key === 'Home') {
        event.preventDefault();
        const first = tabs[0];
        if (first) {
            setChangeHistoryTab(first.dataset.historyTarget, { focus: true });
        }
    } else if (key === 'End') {
        event.preventDefault();
        const last = tabs[tabs.length - 1];
        if (last) {
            setChangeHistoryTab(last.dataset.historyTarget, { focus: true });
        }
    } else if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        setChangeHistoryTab(currentTarget.dataset.historyTarget);
    }
}

// -------------------- 데이터 로딩 --------------------
async function loadData() {
    try {
        toggleLoading(true);
        /* snop-records는 페이지네이션 전체 조회 (서버 max-page-size 제한 우회) */
        const snopRecordsPromise = fetchAllPages('/sales-api/snop-records', 2000, 'S&OP 생산계획');

        const [
            salesResponse,
            channelResponse,
            lineCapaResponse,
            lineItemMasterResponse,
            materialLinkageResponse,
            renewalMaterialLinkageResponse,
            uploadLogResponse,
            changeLogResponse,
            uploadHistoryResponse,
            optimalBaselineResponse,
            recentSalesResponse,
            baseMaterialMasterResponse,
            monthlyClosingResponse,
        ] = await Promise.all([
            fetch('/sales-api/sales-plan-uploads?limit=1000'),
            fetch('/sales-api/sales-channels?limit=500'),
            fetch('/sales-api/line-capa-plans?limit=1000'),
            fetch('/sales-api/line-item-masters?limit=1000'),
            fetch('/sales-api/material-linkages?limit=1000'),
            fetch('/sales-api/renewal-material-linkages?limit=1000'),
            fetch('/sales-api/sales-plan-upload-logs?limit=1000'),
            fetch('/sales-api/production-change-logs?limit=1000'),
            fetch('/sales-api/sales-plan-upload-history?limit=1000&sort=-created_at'),
            fetch('/sales-api/optimal-inventory-baselines?limit=1000&sort=year,category'),
            fetch('/sales-api/recent-sales-averages?limit=1000&sort=-created_at'),
            fetch('/sales-api/base-material-masters?limit=1000'),
            fetch('/sales-api/monthly-closings?limit=5000'),
        ]);

        let snopRecords = await snopRecordsPromise;
        if (!Array.isArray(snopRecords)) {
            snopRecords = [];
        }
        const normalizedAll = snopRecords.map(normalizeRecord);
        state.rawData = normalizedAll
            .filter((record) => {
                /* 필수 필드(item_code, month)가 없는 불완전한 레코드 제외 */
                const code = sanitizeText(record.item_code).trim();
                const month = sanitizeText(record.month).trim();
                if (code && !month) {
                    console.warn(`[loadData] item_code=${code} — month 없어 제외됨 (plan_month 미설정?)`);
                }
                return code && month;
            });
        console.info(`[loadData] snop-records: API ${snopRecords.length}건 → normalize 후 ${normalizedAll.length}건 → rawData ${state.rawData.length}건`);

        /* 원본 생산계획값 저장 (override 적용 전) */
        state.originalProductionPlans = new Map();
        state.rawData.forEach((record) => {
            if (record.id) {
                state.originalProductionPlans.set(record.id, record.production_plan);
            }
        });

        /* localStorage에서 보정 생산계획 override 복원 → rawData에 반영 */
        restoreAdjustedOverrides();
        if (state.adjustedPlanOverrides.size > 0) {
            state.rawData.forEach((record) => {
                if (state.adjustedPlanOverrides.has(record.id)) {
                    record.production_plan = state.adjustedPlanOverrides.get(record.id);
                }
            });
        }

        const previousFallbacks = state.productionActualFallbacks instanceof Map
            ? state.productionActualFallbacks
            : new Map();
        const preservedFallbacks = new Map();
        state.rawData.forEach((record) => {
            const baseKey = sanitizeText(record.id || record.item_code);
            const monthKey = sanitizeText(record.month);
            if (!baseKey || !monthKey) {
                return;
            }
            const fallbackKey = `${baseKey}|${monthKey}|production`;
            if (previousFallbacks.has(fallbackKey)) {
                preservedFallbacks.set(fallbackKey, previousFallbacks.get(fallbackKey));
            }
        });
        state.productionActualFallbacks = preservedFallbacks;

        let channelData = [];
        if (channelResponse && channelResponse.ok) {
            const channelPayload = await safeJson(channelResponse, { data: [] }, { label: '채널 마스터' });
            channelData = extractData(channelPayload);
        } else if (channelResponse && !channelResponse.ok) {
            console.warn('채널 마스터 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }
        state.salesChannels = channelData.map(normalizeSalesChannel);
        state.salesChannelIndex = buildSalesChannelIndex(state.salesChannels);

        let recentSalesData = [];
        if (recentSalesResponse && recentSalesResponse.ok) {
            const recentSalesPayload = await safeJson(recentSalesResponse, { data: [] }, { label: '최근 3개월 판매실적 평균' });
            recentSalesData = extractData(recentSalesPayload);
        } else if (recentSalesResponse && !recentSalesResponse.ok) {
            console.warn('최근 3개월 판매실적 평균 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }
        state.recentSalesRecords = recentSalesData;
        state.recentSalesIndex = buildRecentSalesAverageIndex(recentSalesData);

        let lineCapaData = [];
        if (lineCapaResponse && lineCapaResponse.ok) {
            const lineCapaPayload = await safeJson(lineCapaResponse, { data: [] }, { label: '라인 CAPA' });
            lineCapaData = extractData(lineCapaPayload);
        } else if (lineCapaResponse && !lineCapaResponse.ok) {
            console.warn('라인 CAPA 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }
        state.lineDowntimePlans = lineCapaData.map(normalizeLineCapaPlan);
        state.lineDowntimePlans.sort((a, b) => {
            const monthDiff = sanitizeText(a.month).localeCompare(sanitizeText(b.month));
            if (monthDiff !== 0) return monthDiff;
            const categoryDiff = getLinePlanCategory(a).localeCompare(getLinePlanCategory(b));
            if (categoryDiff !== 0) return categoryDiff;
            return sanitizeText(a.production_line).localeCompare(sanitizeText(b.production_line));
        });
        state.lineDowntimeIndex = buildLineDowntimeIndex(state.lineDowntimePlans);

        let lineItemMasterData = [];
        if (lineItemMasterResponse && lineItemMasterResponse.ok) {
            const masterPayload = await safeJson(lineItemMasterResponse, { data: [] }, { label: '자재 라인 마스터' });
            lineItemMasterData = extractData(masterPayload);
        } else if (lineItemMasterResponse && !lineItemMasterResponse.ok) {
            console.warn('자재 라인 마스터 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }
        state.lineItemMasters = lineItemMasterData
            .map(normalizeLineItemMaster)
            .filter((master) => master && sanitizeText(master.item_code).trim());
        state.lineItemMasters.sort((a, b) => sanitizeText(a.item_code).localeCompare(sanitizeText(b.item_code)));
        state.lineItemMasterIndex = buildLineItemMasterIndex(state.lineItemMasters);

        let materialLinkageData = [];
        if (materialLinkageResponse && materialLinkageResponse.ok) {
            const linkagePayload = await safeJson(materialLinkageResponse, { data: [] }, { label: '리뉴얼 자재 연결' });
            materialLinkageData = extractData(linkagePayload);
        } else if (materialLinkageResponse && !materialLinkageResponse.ok) {
            console.warn('리뉴얼 자재 연결 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }
        state.materialLinkages = materialLinkageData.map(normalizeMaterialLinkage);
        state.materialLinkages.sort((a, b) => {
            const renewalCompare = sanitizeText(a.renewal_item_code).localeCompare(sanitizeText(b.renewal_item_code));
            if (renewalCompare !== 0) return renewalCompare;
            const effectiveA = sanitizeText(a.effective_month).trim();
            const effectiveB = sanitizeText(b.effective_month).trim();
            if (effectiveA && effectiveB && effectiveA !== effectiveB) {
                return effectiveA.localeCompare(effectiveB);
            }
            return sanitizeText(a.legacy_item_code).localeCompare(sanitizeText(b.legacy_item_code));
        });
        /* ── 리뉴얼 자재 연결 (SAP 인터페이스 수신 데이터) ── */
        let renewalMaterialLinkageData = [];
        if (renewalMaterialLinkageResponse && renewalMaterialLinkageResponse.ok) {
            const renewalPayload = await safeJson(renewalMaterialLinkageResponse, { data: [] }, { label: '리뉴얼 자재 연결 (SAP)' });
            renewalMaterialLinkageData = extractData(renewalPayload);
        } else if (renewalMaterialLinkageResponse && !renewalMaterialLinkageResponse.ok) {
            console.warn('리뉴얼 자재 연결(SAP) 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }
        state.renewalMaterialLinkages = renewalMaterialLinkageData
            .map(normalizeMaterialLinkage)
            .filter((entry) => entry.is_active !== false); /* SAP 비활성(is_active=2) 데이터 제외 */
        state.renewalMaterialLinkages.sort((a, b) => {
            return sanitizeText(a.legacy_item_code).localeCompare(sanitizeText(b.legacy_item_code));
        });

        /* ── 리뉴얼 자재 연결 resolver 생성 ──
         * SAP RFC_006 데이터 구조:
         *   legacy_item_code = 신규코드 (ITEM_CODE)
         *   renewal_item_code_1~5 = 기존코드1~5 (ITEM_CODE_1~5)
         * resolver 방향: 기존코드 → 신규코드 (기존자재 데이터를 신규자재에 합산)
         * 기존코드1~5 각각을 forward 맵에 등록하여 신규코드로 resolve */
        const reversedRenewalLinkages = [];
        state.renewalMaterialLinkages.forEach((entry) => {
            const newCode = sanitizeText(entry.legacy_item_code).trim(); // 신규코드
            const newName = sanitizeText(entry.legacy_item_name).trim();
            if (!newCode) return;
            for (let i = 1; i <= 5; i++) {
                const oldCode = sanitizeText(entry[`renewal_item_code_${i}`] || '').trim(); // 기존코드
                const oldName = sanitizeText(entry[`renewal_item_name_${i}`] || '').trim();
                if (oldCode && oldCode !== newCode) {
                    reversedRenewalLinkages.push({
                        legacy_item_code: oldCode,    // 기존코드 → forward의 source
                        legacy_item_name: oldName,
                        renewal_item_code: newCode,    // 신규코드 → forward의 target (canonical)
                        renewal_item_name: newName,
                    });
                }
            }
        });
        const combinedLinkages = [...state.materialLinkages, ...reversedRenewalLinkages];
        state.materialLinkageResolver = combinedLinkages.length > 0
            ? createMaterialLinkageResolver(combinedLinkages)
            : null;

        populateLineCapaFilters();
        populateLineItemMasterFilters();
        renderLineCapaTable();
        renderLineItemMasterTable();

        /* 기본 자재마스터 데이터 로딩 */
        let baseMaterialData = [];
        if (baseMaterialMasterResponse && baseMaterialMasterResponse.ok) {
            const baseMaterialPayload = await safeJson(baseMaterialMasterResponse, { data: [] }, { label: '기본 자재마스터' });
            baseMaterialData = extractData(baseMaterialPayload);
        } else if (baseMaterialMasterResponse && !baseMaterialMasterResponse.ok) {
            console.warn('기본 자재마스터 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }
        state.baseMaterialMasters = baseMaterialData;
        populateBaseMaterialMasterFilters();
        renderBaseMaterialMasterTable();

        /* ── 월말 마감 데이터 로드 ── */
        let monthlyClosingData = [];
        if (monthlyClosingResponse && monthlyClosingResponse.ok) {
            const monthlyClosingPayload = await safeJson(monthlyClosingResponse, { data: [] }, { label: '월말마감실적' });
            monthlyClosingData = extractData(monthlyClosingPayload);
        } else if (monthlyClosingResponse && !monthlyClosingResponse.ok) {
            console.warn('월말마감실적 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }
        state.monthlyClosings = monthlyClosingData;
        /* 월말마감 인덱스: key = "item_code|closing_month" → record */
        state.monthlyClosingIndex = new Map();
        monthlyClosingData.forEach((mc) => {
            const code = sanitizeText(mc.item_code).trim();
            const month = sanitizeText(mc.closing_month).trim();
            if (code && month) {
                state.monthlyClosingIndex.set(`${code}|${month}`, mc);
            }
        });
        /* 월말마감 월별 인덱스: key = "closing_month" → [records] */
        state.monthlyClosingByMonth = new Map();
        monthlyClosingData.forEach((mc) => {
            const month = sanitizeText(mc.closing_month).trim();
            if (month) {
                if (!state.monthlyClosingByMonth.has(month)) {
                    state.monthlyClosingByMonth.set(month, []);
                }
                state.monthlyClosingByMonth.get(month).push(mc);
            }
        });

        let salesData = [];
        if (salesResponse && salesResponse.ok) {
            const salesPayload = await safeJson(salesResponse, { data: [] }, { label: '판매 계획 업로드' });
            salesData = extractData(salesPayload);
        } else if (salesResponse && !salesResponse.ok) {
            console.warn('판매 계획 업로드 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }
        state.salesUploads = salesData.map((record) => normalizeSalesUpload(record, state.salesChannelIndex));

        state.rawData = annotateProductionRecordsWithCanonical(state.rawData, state.materialLinkageResolver);
        state.salesUploads = annotateSalesUploadsWithCanonical(state.salesUploads, state.materialLinkageResolver);
        state.itemCanonicalMap = buildItemCanonicalIndex([state.rawData, state.salesUploads], state.materialLinkageResolver);
        state.materialCanonicalNameIndex = buildCanonicalNameIndex(state.rawData, state.materialLinkageResolver);

        populateMaterialCodeOptions();
        renderMaterialRenewalTable();

        state.salesUploadIndex = buildSalesUploadIndex(state.salesUploads);

        let logData = [];
        if (uploadLogResponse && uploadLogResponse.ok) {
            const logPayload = await safeJson(uploadLogResponse, { data: [] }, { label: '판매 계획 업로드 이력' });
            logData = extractData(logPayload);
        } else if (uploadLogResponse && !uploadLogResponse.ok) {
            console.warn('판매 계획 업로드 이력 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }
        state.salesUploadLogs = logData.map(normalizeSalesUploadLog);
        state.salesUploadLogIndex = buildSalesUploadLogIndex(state.salesUploadLogs);
        state.salesUploadLogNameIndex = buildSalesUploadLogNameIndex(state.salesUploadLogs);

        let uploadHistoryData = [];
        if (uploadHistoryResponse && uploadHistoryResponse.ok) {
            const uploadHistoryPayload = await safeJson(uploadHistoryResponse, { data: [] }, { label: '판매 계획 업로드 상세 이력' });
            uploadHistoryData = extractData(uploadHistoryPayload);
        } else if (uploadHistoryResponse && !uploadHistoryResponse.ok) {
            console.warn('판매 계획 업로드 상세 이력 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }
        state.salesUploadHistory = uploadHistoryData.map((record) => normalizeSalesUploadHistory(record));
        populateUploadHistoryItemFilter();
        renderUploadHistoryTable();

        let changeLogData = [];
        if (changeLogResponse && changeLogResponse.ok) {
            const changePayload = await safeJson(changeLogResponse, { data: [] }, { label: '생산계획 변경 로그' });
            changeLogData = extractData(changePayload);
        } else if (changeLogResponse && !changeLogResponse.ok) {
            console.warn('생산계획 변경 로그 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }

        const normalizedChangeLogs = changeLogData
            .map((record) => normalizeProductionChangeLog(record))
            .filter((record) => record !== null);
        normalizedChangeLogs.sort((a, b) => b.timestamp - a.timestamp);
        state.changeHistoryRecords = normalizedChangeLogs;
        restoreLocalChangeHistory();
        refreshChangeHistoryView({ populateFilters: true });

        let optimalBaselineData = [];
        if (optimalBaselineResponse && optimalBaselineResponse.ok) {
            const baselinePayload = await safeJson(optimalBaselineResponse, { data: [] }, { label: '적정재고 기준' });
            optimalBaselineData = extractData(baselinePayload);
        } else if (optimalBaselineResponse && !optimalBaselineResponse.ok) {
            console.warn('적정재고 기준 데이터를 불러오는 중 문제가 발생했습니다. 빈 목록을 사용합니다.');
        }
        state.optimalInventoryBaselines = optimalBaselineData.map(normalizeOptimalBaseline);
        state.optimalInventoryBaselines.sort((a, b) => {
            const yearCompare = sanitizeText(a.year).localeCompare(sanitizeText(b.year));
            if (yearCompare !== 0) return yearCompare;
            return sanitizeText(a.category).localeCompare(sanitizeText(b.category));
        });
        state.optimalInventoryBaselineIndex = buildOptimalBaselineIndex(state.optimalInventoryBaselines);
        state.optimalInventoryBaselineById = buildOptimalBaselineIdIndex(state.optimalInventoryBaselines);
        populateOptimalBaselineCategoryOptions();
        renderOptimalBaselineManager();
        resetOptimalBaselineForm({ preserveCategory: true });

        const itemNameMap = new Map();
        const itemCategoryMap = new Map();
        (state.rawData || []).forEach((record) => {
            if (!record) return;
            const canonicalCode = getRecordCanonicalCode(record);
            const fallbackCode = sanitizeText(record.item_code).trim();
            const code = canonicalCode || fallbackCode;
            if (!code) return;
            const name = getRecordCanonicalName(record);
            if (name && !itemNameMap.has(code)) {
                itemNameMap.set(code, name);
            }
            const categoryValue = sanitizeText(record.category).trim();
            if (categoryValue && !itemCategoryMap.has(code)) {
                itemCategoryMap.set(code, categoryValue);
            }
        });
        if (state.materialCanonicalNameIndex instanceof Map) {
            state.materialCanonicalNameIndex.forEach((name, code) => {
                if (code && name && !itemNameMap.has(code)) {
                    itemNameMap.set(code, name);
                }
            });
        }
        /* 기본 자재마스터에서 자재명·카테고리 보충 (대소문자 무관 매칭) */
        (state.baseMaterialMasters || []).forEach((master) => {
            if (!master) return;
            const code = sanitizeText(master.item_code).trim();
            if (!code) return;
            const lowerCode = code.toLowerCase();
            const name = sanitizeText(master.item_name).trim();
            const category = sanitizeText(master.hierarchy_name).trim();
            /* 원본 코드(대문자)와 소문자 변환 코드 모두 등록 */
            if (name) {
                if (!itemNameMap.has(code)) itemNameMap.set(code, name);
                if (!itemNameMap.has(lowerCode)) itemNameMap.set(lowerCode, name);
            }
            if (category) {
                if (!itemCategoryMap.has(code)) itemCategoryMap.set(code, category);
                if (!itemCategoryMap.has(lowerCode)) itemCategoryMap.set(lowerCode, category);
            }
        });
        state.salesAggregates = buildSalesAggregates(state.salesUploads, {
            itemNameMap,
            itemCategoryMap,
            channelIndex: state.salesChannelIndex,
        });

        renderSalesChannelsList();
        populateSalesChannelSelect();
        populateSalesSummaryFilters();
        renderSalesSummaryTable();
        renderSalesUploadsTable();

        if (state.materialRenewalForm && state.materialRenewalForm.editingId) {
            const editingEntry = (state.materialLinkages || []).find((entry) => entry && entry.id === state.materialRenewalForm.editingId);
            if (editingEntry) {
                loadMaterialRenewalIntoForm(editingEntry.id, { scroll: false });
            } else {
                resetMaterialRenewalForm();
            }
        }

        populateFilterOptions();
        updateSharedLineResources();
        updateChartSelectOptions();
        applyFilters();
        updateCapacityLimitFromLinePlan();
        syncPlanMonthInputWithFilter();
        renderRecentSalesViewTable();
    } catch (error) {
        console.error('loadData() 실행 중 오류가 발생했습니다.', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.\n\n자세한 오류 정보는 브라우저 콘솔(F12)에서 확인할 수 있습니다.');
        /* btnRefresh 제거됨 */
    } finally {
        toggleLoading(false);
    }
}

function toggleLoading(isLoading) {
    /* btnRefresh / btnExport 제거됨 – 로딩 상태만 내부 관리 */
}

function populateFilterOptions() {
    const previousItem = dom.filters.item.value;
    const previousCategoryValues = getCategoryFilterValues();
    const previousMonth = dom.filters.month.value;
    const previousLine = dom.filters.line.value;

    const itemOptions = getUniqueItems(state.rawData);
    /* 자재코드 검색 드롭다운 데이터 저장 */
    state.itemFilterOptions = itemOptions;
    /* 기존 선택값 유지 */
    if (previousItem && previousItem !== 'all') {
        const matched = itemOptions.find(({ code }) => code === previousItem);
        if (matched && dom.filters.itemInput) {
            dom.filters.itemInput.value = matched.code;
        }
    } else {
        if (dom.filters.itemInput) dom.filters.itemInput.value = '';
        dom.filters.item.value = 'all';
    }

    if (dom.filters.categoryOptions) {
        const categories = getUniqueCategories(state.rawData);
        const prevSelections = previousCategoryValues === 'all' ? null : previousCategoryValues;
        populateCategoryFilterOptions(categories, prevSelections);
    }

    const months = getUniqueMonths(state.rawData);
    dom.filters.month.innerHTML = '<option value="all">전체</option>';
    months.forEach((month) => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        dom.filters.month.appendChild(option);
    });
    sortMonthFilterOptions();
    if (months.includes(previousMonth)) {
        dom.filters.month.value = previousMonth;
    } else {
        /* 첫 로드 시 현재 시스템월을 기본 선택 (성능 최적화) */
        const now = new Date();
        const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
        if (months.includes(currentMonth)) {
            dom.filters.month.value = currentMonth;
        }
    }

    const lines = getUniqueLines(state.rawData);
    dom.filters.line.innerHTML = '<option value="all">전체</option>';
    lines.forEach((line) => {
        const option = document.createElement('option');
        option.value = line;
        option.textContent = line;
        dom.filters.line.appendChild(option);
    });
    if (lines.includes(previousLine)) {
        dom.filters.line.value = previousLine;
    }
}

function updateLineCapaComputedField() {
    if (!dom.lineDowntime || !dom.lineDowntime.total) return;
    const hourly = dom.lineDowntime.daily ? toNumber(dom.lineDowntime.daily.value) : 0;
    const dailyHours = dom.lineDowntime.dailyHours ? toNumber(dom.lineDowntime.dailyHours.value) : 0;
    const operatingDays = dom.lineDowntime.operatingDays ? toNumber(dom.lineDowntime.operatingDays.value) : 0;
    const total = computeLineCapaTotal(hourly, dailyHours, operatingDays);
    dom.lineDowntime.total.value = `${formatNumber(total)} EA`;
    dom.lineDowntime.total.dataset.numericValue = String(total);
    dom.lineDowntime.total.classList.remove('input-error');
    dom.lineDowntime.total.removeAttribute('title');
}

function resetLineCapaForm(options = {}) {
    if (!dom.lineDowntime || !dom.lineDowntime.form) return;
    const { keepMonth = false, keepLine = false } = options;
    const currentMonth = keepMonth && dom.lineDowntime.month ? dom.lineDowntime.month.value : '';
    const currentLine = keepLine && dom.lineDowntime.line ? dom.lineDowntime.line.value : '';

    dom.lineDowntime.form.reset();
    if (dom.lineDowntime.recordId) {
        dom.lineDowntime.recordId.value = '';
    }
    if (keepMonth && dom.lineDowntime.month) {
        dom.lineDowntime.month.value = currentMonth;
    }
    if (keepLine && dom.lineDowntime.line) {
        dom.lineDowntime.line.value = currentLine;
    }
    if (dom.lineDowntime.btnSave) {
        dom.lineDowntime.btnSave.textContent = '저장';
    }
    updateLineCapaComputedField();
}

function populateLineCapaFilters() {
    if (!dom.lineDowntime) return;
    const { filterMonth, filterLine } = dom.lineDowntime;
    updateLineCategorySuggestions();

    if (filterMonth) {
        const previousMonth = filterMonth.value;
        filterMonth.innerHTML = '<option value="all">전체</option>';
        const months = Array.from(new Set((state.lineDowntimePlans || []).map((plan) => plan.month))).sort();
        months.forEach((month) => {
            if (!month) return;
            const option = document.createElement('option');
            option.value = month;
            option.textContent = month;
            filterMonth.appendChild(option);
        });
        if (months.includes(previousMonth)) {
            filterMonth.value = previousMonth;
        } else {
            filterMonth.value = 'all';
        }
    }

    if (filterLine) {
        const previousLine = filterLine.value;
        filterLine.innerHTML = '<option value="all">전체</option>';
        const lines = getUniqueLinesFromLinePlans(state.lineDowntimePlans);
        lines.forEach((line) => {
            const option = document.createElement('option');
            option.value = line;
            option.textContent = line;
            filterLine.appendChild(option);
        });
        if (lines.includes(previousLine)) {
            filterLine.value = previousLine;
        } else {
            filterLine.value = 'all';
        }
    }
}

function getFilteredLineCapaPlans() {
    const filters = state.lineCapaFilters || { month: 'all', line: 'all' };
    return (state.lineDowntimePlans || []).filter((plan) => {
        if (filters.month !== 'all' && plan.month !== filters.month) {
            return false;
        }
        if (filters.line !== 'all' && sanitizeText(plan.production_line).trim() !== filters.line) {
            return false;
        }
        return true;
    });
}

async function refreshLineCapaPlans() {
    try {
        const response = await fetch('/sales-api/line-capa-plans?limit=1000');
        if (!response.ok) {
            throw new Error('라인 CAPA 데이터를 불러오지 못했습니다.');
        }
        const payload = await response.json();
        const records = extractData(payload);
        state.lineDowntimePlans = records.map(normalizeLineCapaPlan);
        state.lineDowntimePlans.sort((a, b) => {
            const monthDiff = sanitizeText(a.month).localeCompare(sanitizeText(b.month));
            if (monthDiff !== 0) return monthDiff;
            return sanitizeText(a.production_line).localeCompare(sanitizeText(b.production_line));
        });
        state.lineDowntimeIndex = buildLineDowntimeIndex(state.lineDowntimePlans);
        populateLineCapaFilters();
        renderLineCapaTable();
        updateSharedLineResources();
        applyFilters();
        updateCapacityLimitFromLinePlan();
    } catch (error) {
        console.error(error);
        alert('라인 CAPA 정보를 갱신하는 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.');
    }
}

function renderLineCapaTable() {
    if (!dom.lineDowntime || !dom.lineDowntime.tableBody) return;
    const tbody = dom.lineDowntime.tableBody;
    const emptyState = dom.lineDowntime.empty;
    tbody.innerHTML = '';

    const plans = getFilteredLineCapaPlans();
    if (!plans.length) {
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        return;
    }

    if (emptyState) {
        emptyState.classList.add('hidden');
    }

    const fragment = document.createDocumentFragment();
    plans.forEach((plan) => {
        const row = document.createElement('tr');
        row.dataset.recordId = plan.id;

        const monthCell = document.createElement('td');
        monthCell.textContent = plan.month || '-';
        row.appendChild(monthCell);

        const lineCell = document.createElement('td');
        lineCell.textContent = plan.production_line || '-';
        row.appendChild(lineCell);

        const dailyCell = document.createElement('td');
        dailyCell.className = 'number';
        dailyCell.textContent = Number.isFinite(plan.daily_capa) && plan.daily_capa !== 0
            ? `${formatNumber(plan.daily_capa)} EA/시간`
            : '-';
        row.appendChild(dailyCell);

        const dailyHoursCell = document.createElement('td');
        dailyHoursCell.className = 'number';
        dailyHoursCell.textContent = Number.isFinite(plan.daily_operating_hours) && plan.daily_operating_hours !== 0
            ? `${formatNumber(plan.daily_operating_hours)} 시간/일`
            : '-';
        row.appendChild(dailyHoursCell);

        const operatingCell = document.createElement('td');
        operatingCell.className = 'number';
        operatingCell.textContent = Number.isFinite(plan.planned_operating_days)
            ? `${formatNumber(plan.planned_operating_days)} 일`
            : '-';
        row.appendChild(operatingCell);

        const totalCell = document.createElement('td');
        totalCell.className = 'number';
        totalCell.textContent = plan.computed_capa ? `${formatNumber(plan.computed_capa)} EA` : '0 EA';
        row.appendChild(totalCell);

        const noteCell = document.createElement('td');
        noteCell.textContent = plan.note || '-';
        row.appendChild(noteCell);

        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions';
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'ghost small btn-line-capa-edit';
        editButton.textContent = '편집';
        editButton.dataset.id = plan.id;
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'danger small btn-line-capa-delete';
        deleteButton.textContent = '삭제';
        deleteButton.dataset.id = plan.id;
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        fragment.appendChild(row);
    });

    tbody.appendChild(fragment);
}

function loadLineCapaPlanIntoForm(plan) {
    if (!dom.lineDowntime) return;
    if (!plan) return;
    if (dom.lineDowntime.recordId) {
        dom.lineDowntime.recordId.value = plan.id || '';
    }
    if (dom.lineDowntime.month) {
        dom.lineDowntime.month.value = plan.month || '';
    }
    if (dom.lineDowntime.line) {
        dom.lineDowntime.line.value = plan.production_line || '';
    }
    if (dom.lineDowntime.daily) {
        dom.lineDowntime.daily.value = Number.isFinite(plan.daily_capa) ? plan.daily_capa : '';
    }
    if (dom.lineDowntime.dailyHours) {
        dom.lineDowntime.dailyHours.value = Number.isFinite(plan.daily_operating_hours) ? plan.daily_operating_hours : '';
    }
    if (dom.lineDowntime.operatingDays) {
        dom.lineDowntime.operatingDays.value = Number.isFinite(plan.planned_operating_days)
            ? plan.planned_operating_days
            : '';
    }
    if (dom.lineDowntime.note) {
        dom.lineDowntime.note.value = plan.note || '';
    }
    if (dom.lineDowntime.btnSave) {
        dom.lineDowntime.btnSave.textContent = '수정 저장';
    }
    updateLineCapaComputedField();
}

async function handleLineCapaDelete(id) {
    if (!id) return;
    const numId = Number(id);
    const plan = state.lineDowntimePlans.find((item) => item.id === numId || String(item.id) === String(id));
    const lineLabel = plan ? `${plan.production_line || '-'} / ${plan.month || '-'}` : id;
    const confirmed = confirm(`${lineLabel} 라인 CAPA 정보를 삭제하시겠습니까?`);
    if (!confirmed) return;
    try {
        const response = await fetch(`/sales-api/line-capa-plans/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('삭제 실패');
        }
        await refreshLineCapaPlans();
        alert('라인 CAPA 정보가 삭제되었습니다.');
    } catch (error) {
        console.error(error);
        alert('라인 CAPA 정보를 삭제하는 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.');
    }
}

async function handleLineCapaFormSubmit(event) {
    event.preventDefault();
    if (!dom.lineDowntime) return;

    const monthValue = dom.lineDowntime.month ? sanitizeText(dom.lineDowntime.month.value).trim() : '';
    const lineValue = dom.lineDowntime.line ? sanitizeText(dom.lineDowntime.line.value).trim() : '';
    const hourlyValue = dom.lineDowntime.daily ? toNumber(dom.lineDowntime.daily.value) : 0;
    const dailyHoursValue = dom.lineDowntime.dailyHours ? toNumber(dom.lineDowntime.dailyHours.value) : 0;
    const operatingValue = dom.lineDowntime.operatingDays ? toNumber(dom.lineDowntime.operatingDays.value) : 0;
    const noteValue = dom.lineDowntime.note ? sanitizeText(dom.lineDowntime.note.value).trim() : '';

    const errors = [];
    if (!monthValue) {
        errors.push('계획 월을 선택하세요. (예: 2025-03)');
    }
    if (!lineValue) {
        errors.push('생산 라인을 입력하세요.');
    }
    if (!Number.isFinite(hourlyValue) || hourlyValue <= 0) {
        errors.push('시간당 CAPA는 0보다 큰 숫자로 입력하세요.');
    }
    if (!Number.isFinite(dailyHoursValue) || dailyHoursValue <= 0) {
        errors.push('일 가동 시간은 0보다 큰 숫자로 입력하세요.');
    }
    if (!Number.isFinite(operatingValue) || operatingValue <= 0) {
        errors.push('월 가동 일수는 0보다 큰 숫자로 입력하세요.');
    }
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    const totalCapa = computeLineCapaTotal(hourlyValue, dailyHoursValue, operatingValue);
    const recordId = dom.lineDowntime.recordId ? sanitizeText(dom.lineDowntime.recordId.value).trim() : '';
    const isUpdate = Boolean(recordId);

    const payload = {
        month: monthValue,
        production_line: lineValue,
        line_category: '',
        daily_capa: hourlyValue,
        daily_operating_hours: dailyHoursValue,
        planned_operating_days: operatingValue,
        computed_capa: totalCapa,
        note: noteValue,
    };

    if (dom.lineDowntime.btnSave) {
        dom.lineDowntime.btnSave.setAttribute('disabled', 'disabled');
        dom.lineDowntime.btnSave.textContent = isUpdate ? '수정 중...' : '저장 중...';
    }

    try {
        const endpoint = isUpdate ? `/sales-api/line-capa-plans/${recordId}` : '/sales-api/line-capa-plans';
        const method = isUpdate ? 'PUT' : 'POST';
        const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(toLineCapaApiPayload(payload)),
        });
        if (!response.ok) {
            throw new Error('라인 CAPA 저장 실패');
        }
        await refreshLineCapaPlans();
        alert('라인 CAPA 정보가 저장되었습니다.');
        resetLineCapaForm({ keepMonth: true, keepLine: true });
    } catch (error) {
        console.error(error);
        alert('라인 CAPA 정보를 저장하는 중 오류가 발생했습니다. 입력 값을 확인하세요.');
    } finally {
        if (dom.lineDowntime.btnSave) {
            dom.lineDowntime.btnSave.removeAttribute('disabled');
            dom.lineDowntime.btnSave.textContent = isUpdate ? '수정 저장' : '저장';
        }
    }
}

function setLineCapaFilter(type, value) {
    if (!state.lineCapaFilters) {
        state.lineCapaFilters = { month: 'all', line: 'all' };
    }
    if (type === 'month') {
        state.lineCapaFilters.month = value || 'all';
    } else if (type === 'line') {
        state.lineCapaFilters.line = value || 'all';
    }
    renderLineCapaTable();
}

function handleLineCapaTableClick(event) {
    if (!dom.lineDowntime || !dom.lineDowntime.tableBody) return;
    const targetButton = event.target.closest('button');
    if (!targetButton) return;
    const recordId = targetButton.dataset.id;
    if (!recordId) return;
    if (targetButton.classList.contains('btn-line-capa-edit')) {
        const numericId = Number(recordId);
        const plan = state.lineDowntimePlans.find((item) => item.id === numericId || String(item.id) === recordId);
        if (!plan) {
            alert('선택한 라인 CAPA 정보를 찾을 수 없습니다. 잠시 후 다시 시도하세요.');
            return;
        }
        loadLineCapaPlanIntoForm(plan);
        dom.lineDowntime.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (targetButton.classList.contains('btn-line-capa-delete')) {
        handleLineCapaDelete(recordId);
    }
}

function ensureLineItemMasterFilters() {
    if (!state.lineItemMasterFilters) {
        state.lineItemMasterFilters = {
            line: 'all',
        };
    }
    if (!state.lineItemMasterFilters.line) {
        state.lineItemMasterFilters.line = 'all';
    }
    return state.lineItemMasterFilters;
}

function populateLineItemMasterFilters() {
    if (!dom.lineItemMaster) return;
    const filters = ensureLineItemMasterFilters();
    const lines = getUniqueLinesFromMasters(state.lineItemMasters);
    const { filterLine } = dom.lineItemMaster;

    if (filterLine) {
        const previous = filters.line;
        filterLine.innerHTML = '<option value="all">전체</option>';
        lines.forEach((line) => {
            const option = document.createElement('option');
            option.value = line;
            option.textContent = line;
            filterLine.appendChild(option);
        });
        if (previous !== 'all' && !lines.includes(previous)) {
            filters.line = 'all';
        }
        filterLine.value = filters.line;
    }
}

function renderLineItemMasterTable() {
    if (!dom.lineItemMaster || !dom.lineItemMaster.tableBody) return;
    const tbody = dom.lineItemMaster.tableBody;
    const emptyState = dom.lineItemMaster.empty;

    if (emptyState && !emptyState.dataset.defaultText) {
        emptyState.dataset.defaultText = emptyState.textContent;
    }

    tbody.innerHTML = '';

    const masters = state.lineItemMasters || [];
    const filters = ensureLineItemMasterFilters();
    const lineFilter = sanitizeText(filters.line).trim().toLowerCase();

    if (!masters.length) {
        if (emptyState) {
            emptyState.textContent = emptyState.dataset.defaultText || '등록된 자재 마스터가 없습니다. 자재 코드를 입력해 추가하세요.';
            emptyState.classList.remove('hidden');
        }
        return;
    }

    const filteredMasters = masters.filter((master) => {
        const masterLine = sanitizeText(master.production_line ?? '').trim().toLowerCase();
        return lineFilter === '' || lineFilter === 'all' || masterLine === lineFilter;
    });

    if (!filteredMasters.length) {
        if (emptyState) {
            emptyState.textContent = '필터 조건에 맞는 자재 마스터가 없습니다.';
            emptyState.classList.remove('hidden');
        }
        return;
    }

    if (emptyState) {
        emptyState.textContent = emptyState.dataset.defaultText || '';
        emptyState.classList.add('hidden');
    }

    const fragment = document.createDocumentFragment();
    filteredMasters.forEach((master) => {
        const row = document.createElement('tr');
        row.dataset.recordId = master.id || '';

        const codeCell = document.createElement('td');
        codeCell.textContent = master.item_code || '-';
        row.appendChild(codeCell);

        const lineCell = document.createElement('td');
        lineCell.textContent = master.production_line || '-';
        row.appendChild(lineCell);

        const hourlyCell = document.createElement('td');
        hourlyCell.className = 'number';
        hourlyCell.textContent = Number.isFinite(master.hourly_throughput) && master.hourly_throughput !== 0
            ? `${formatNumber(master.hourly_throughput)} EA/시간`
            : '-';
        row.appendChild(hourlyCell);

        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions';
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'ghost small btn-line-item-master-edit';
        editButton.textContent = '편집';
        editButton.dataset.id = master.id;
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'danger small btn-line-item-master-delete';
        deleteButton.textContent = '삭제';
        deleteButton.dataset.id = master.id;
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        fragment.appendChild(row);
    });

    tbody.appendChild(fragment);
}

function setLineItemMasterFilter(type, value) {
    const filters = ensureLineItemMasterFilters();
    const trimmed = sanitizeText(value).trim();
    const normalized = !trimmed || trimmed.toLowerCase() === 'all' ? 'all' : trimmed;

    if (type === 'line') {
        filters.line = normalized;
    }
    renderLineItemMasterTable();
}

function loadLineItemMasterIntoForm(master) {
    if (!dom.lineItemMaster || !master) return;
    if (dom.lineItemMaster.recordId) {
        dom.lineItemMaster.recordId.value = master.id || '';
    }
    if (dom.lineItemMaster.code) {
        dom.lineItemMaster.code.value = master.item_code || '';
    }
    if (dom.lineItemMaster.line) {
        dom.lineItemMaster.line.value = master.production_line || '';
    }
    if (dom.lineItemMaster.hourly) {
        dom.lineItemMaster.hourly.value = Number.isFinite(master.hourly_throughput) ? master.hourly_throughput : '';
    }
    if (dom.lineItemMaster.btnSave) {
        dom.lineItemMaster.btnSave.textContent = '수정 저장';
    }
}

function resetLineItemMasterForm(options = {}) {
    if (!dom.lineItemMaster || !dom.lineItemMaster.form) return;
    const { keepCode = false } = options;
    const currentCode = keepCode && dom.lineItemMaster.code ? dom.lineItemMaster.code.value : '';

    dom.lineItemMaster.form.reset();
    if (dom.lineItemMaster.recordId) {
        dom.lineItemMaster.recordId.value = '';
    }
    if (keepCode && dom.lineItemMaster.code) {
        dom.lineItemMaster.code.value = currentCode;
    }
    if (dom.lineItemMaster.btnSave) {
        dom.lineItemMaster.btnSave.textContent = '저장';
    }
}

function getLineItemMasterByCode(code) {
    const key = getNormalizedItemCode(code);
    if (!key) return null;
    return state.lineItemMasterIndex.get(key) || null;
}

async function handleLineItemMasterFormSubmit(event) {
    event.preventDefault();
    if (!dom.lineItemMaster) return;

    const codeInput = dom.lineItemMaster.code ? dom.lineItemMaster.code.value : '';
    const lineInput = dom.lineItemMaster.line ? dom.lineItemMaster.line.value : '';
    const hourlyInput = dom.lineItemMaster.hourly ? dom.lineItemMaster.hourly.value : '';

    const itemCode = sanitizeText(codeInput).trim().toUpperCase();
    const productionLine = sanitizeText(lineInput).trim();
    const hourlyValue = toNumber(hourlyInput);

    if (dom.lineItemMaster.code) {
        dom.lineItemMaster.code.value = itemCode;
    }

    const errors = [];
    if (!itemCode) {
        errors.push('자재 코드를 입력하세요.');
    }
    if (!productionLine) {
        errors.push('생산 라인을 입력하세요.');
    }
    if (!Number.isFinite(hourlyValue) || hourlyValue <= 0) {
        errors.push('시간당 생산 수량은 0보다 큰 숫자로 입력하세요.');
    }

    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    let recordId = dom.lineItemMaster.recordId ? dom.lineItemMaster.recordId.value : '';
    if (!recordId) {
        const existing = getLineItemMasterByCode(itemCode);
        if (existing) {
            recordId = existing.id;
        }
    }
    const isUpdate = Boolean(recordId);

    if (dom.lineItemMaster.btnSave) {
        dom.lineItemMaster.btnSave.setAttribute('disabled', 'disabled');
        dom.lineItemMaster.btnSave.textContent = isUpdate ? '수정 중...' : '저장 중...';
    }

    const payload = {
        item_code: itemCode,
        production_line: productionLine,
        hourly_throughput: hourlyValue,
    };

    try {
        const endpoint = isUpdate ? `/sales-api/line-item-masters/${recordId}` : '/sales-api/line-item-masters';
        const method = isUpdate ? 'PUT' : 'POST';
        const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error('자재 마스터 저장 실패');
        }
        await refreshLineItemMasters();
        alert('자재 라인 마스터가 저장되었습니다.');
        resetLineItemMasterForm();
    } catch (error) {
        console.error(error);
        alert('자재 라인 마스터 저장 중 오류가 발생했습니다. 입력 값을 확인하세요.');
    } finally {
        if (dom.lineItemMaster.btnSave) {
            dom.lineItemMaster.btnSave.removeAttribute('disabled');
            dom.lineItemMaster.btnSave.textContent = isUpdate ? '수정 저장' : '저장';
        }
    }
}

async function handleLineItemMasterDelete(id) {
    if (!id) return;
    const master = state.lineItemMasters.find((item) => item.id === id);
    const label = master ? `${master.item_code || '-'} / ${master.production_line || '-'}` : id;
    const confirmed = confirm(`${label} 자재 마스터를 삭제하시겠습니까?`);
    if (!confirmed) return;
    try {
        const response = await fetch(`/sales-api/line-item-masters/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('삭제 실패');
        }
        await refreshLineItemMasters();
        alert('자재 라인 마스터가 삭제되었습니다.');
    } catch (error) {
        console.error(error);
        alert('자재 라인 마스터 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.');
    }
}

function handleLineItemMasterTableClick(event) {
    if (!dom.lineItemMaster || !dom.lineItemMaster.tableBody) return;
    const button = event.target.closest('button');
    if (!button) return;
    const recordId = button.dataset.id;
    if (!recordId) return;

    if (button.classList.contains('btn-line-item-master-edit')) {
        const master = state.lineItemMasters.find((item) => item.id === recordId);
        if (!master) {
            alert('선택한 자재 마스터를 찾을 수 없습니다. 잠시 후 다시 시도하세요.');
            return;
        }
        loadLineItemMasterIntoForm(master);
        if (dom.lineItemMaster.form) {
            dom.lineItemMaster.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else if (button.classList.contains('btn-line-item-master-delete')) {
        handleLineItemMasterDelete(recordId);
    }
}

async function refreshLineItemMasters() {
    try {
        const response = await fetch('/sales-api/line-item-masters?limit=1000');
        if (!response.ok) {
            throw new Error('자재 라인 마스터 데이터를 불러오지 못했습니다.');
        }
        const payload = await response.json();
        const records = extractData(payload);
        state.lineItemMasters = records
            .map(normalizeLineItemMaster)
            .filter((master) => master && sanitizeText(master.item_code).trim());
        state.lineItemMasters.sort((a, b) => sanitizeText(a.item_code).localeCompare(sanitizeText(b.item_code)));
        state.lineItemMasterIndex = buildLineItemMasterIndex(state.lineItemMasters);
        populateLineItemMasterFilters();
        renderLineItemMasterTable();
        updateLineCategorySuggestions();
        updateSharedLineResources();
    } catch (error) {
        console.error(error);
        alert('자재 라인 마스터 정보를 갱신하는 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.');
    }
}

// -------------------- 기본 자재마스터 --------------------

function ensureBaseMaterialMasterFilters() {
    if (!state.baseMaterialMasterFilters) {
        state.baseMaterialMasterFilters = { scm: 'all', category: 'all', itemCode: '', prodUnit: 'all' };
    }
    if (!state.baseMaterialMasterFilters.scm) {
        state.baseMaterialMasterFilters.scm = 'all';
    }
    if (!state.baseMaterialMasterFilters.category) {
        state.baseMaterialMasterFilters.category = 'all';
    }
    if (state.baseMaterialMasterFilters.itemCode == null) {
        state.baseMaterialMasterFilters.itemCode = '';
    }
    if (!state.baseMaterialMasterFilters.prodUnit) {
        state.baseMaterialMasterFilters.prodUnit = 'all';
    }
    return state.baseMaterialMasterFilters;
}

function populateBaseMaterialMasterFilters() {
    if (!dom.baseMaterialMaster) return;
    const filters = ensureBaseMaterialMasterFilters();
    const { filterScm, filterCategory, filterProdUnit } = dom.baseMaterialMaster;

    const masters = state.baseMaterialMasters || [];

    /* SCM운영구분 필터 */
    if (filterScm) {
        const scmAreas = [...new Set(
            masters.map(m => (m.scm_area || '').trim()).filter(Boolean)
        )].sort();

        const prevScm = filters.scm;
        filterScm.innerHTML = '<option value="all">전체</option>';
        scmAreas.forEach(area => {
            const option = document.createElement('option');
            option.value = area;
            option.textContent = area;
            filterScm.appendChild(option);
        });
        if (prevScm !== 'all' && !scmAreas.includes(prevScm)) {
            filters.scm = 'all';
        }
        filterScm.value = filters.scm;
    }

    /* 카테고리 필터 — 제외 카테고리(원단/미지정) 필터링 */
    if (filterCategory) {
        const categories = [...new Set(
            masters.map(m => (m.hierarchy_name || '').trim()).filter(cat => cat && !isExcludedCategory(cat))
        )].sort();

        const prevCat = filters.category;
        filterCategory.innerHTML = '<option value="all">전체</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            filterCategory.appendChild(option);
        });
        if (prevCat !== 'all' && !categories.includes(prevCat)) {
            filters.category = 'all';
        }
        filterCategory.value = filters.category;
    }

    /* 생산라인 필터 */
    if (filterProdUnit) {
        const prodUnits = [...new Set(
            masters.map(m => (m.production_unit || '').trim()).filter(Boolean)
        )].sort();

        const prevProd = filters.prodUnit;
        filterProdUnit.innerHTML = '<option value="all">전체</option>';
        prodUnits.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = unit;
            filterProdUnit.appendChild(option);
        });
        if (prevProd !== 'all' && !prodUnits.includes(prevProd)) {
            filters.prodUnit = 'all';
        }
        filterProdUnit.value = filters.prodUnit;
    }
}

function renderBaseMaterialMasterTable() {
    if (!dom.baseMaterialMaster || !dom.baseMaterialMaster.tableBody) return;
    const tbody = dom.baseMaterialMaster.tableBody;
    const emptyState = dom.baseMaterialMaster.empty;

    if (emptyState && !emptyState.dataset.defaultText) {
        emptyState.dataset.defaultText = emptyState.textContent;
    }
    tbody.innerHTML = '';

    const masters = state.baseMaterialMasters || [];
    const filters = ensureBaseMaterialMasterFilters();
    const scmFilter = (filters.scm || 'all').trim().toLowerCase();

    if (!masters.length) {
        if (emptyState) {
            emptyState.textContent = emptyState.dataset.defaultText || '등록된 기본 자재마스터가 없습니다. 양식을 작성해 추가하세요.';
            emptyState.classList.remove('hidden');
        }
        return;
    }

    const categoryFilter = (filters.category || 'all').trim().toLowerCase();
    const itemCodeFilter = (filters.itemCode || '').trim().toLowerCase();
    const prodUnitFilter = (filters.prodUnit || 'all').trim().toLowerCase();

    const filtered = masters.filter(m => {
        /* 제외 카테고리(원단/미지정) 필터링 */
        if (isExcludedCategory(m.hierarchy_name)) return false;
        const area = (m.scm_area ?? '').trim().toLowerCase();
        const cat = (m.hierarchy_name ?? '').trim().toLowerCase();
        const code = (m.item_code ?? '').trim().toLowerCase();
        const unit = (m.production_unit ?? '').trim().toLowerCase();
        const scmOk = scmFilter === '' || scmFilter === 'all' || area === scmFilter;
        const catOk = categoryFilter === '' || categoryFilter === 'all' || cat === categoryFilter;
        const codeOk = !itemCodeFilter || code.includes(itemCodeFilter);
        const prodOk = prodUnitFilter === '' || prodUnitFilter === 'all' || unit === prodUnitFilter;
        return scmOk && catOk && codeOk && prodOk;
    });

    if (!filtered.length) {
        if (emptyState) {
            emptyState.textContent = '필터 조건에 맞는 기본 자재마스터가 없습니다.';
            emptyState.classList.remove('hidden');
        }
        return;
    }

    if (emptyState) {
        emptyState.textContent = emptyState.dataset.defaultText || '';
        emptyState.classList.add('hidden');
    }

    /* 이미 생산계획에 등록된 자재코드 Set 구성 */
    const registeredCodes = new Set(
        (state.rawData || []).map(r => (r.item_code || '').trim().toUpperCase())
    );

    const fragment = document.createDocumentFragment();
    filtered.forEach(master => {
        const masterCode = (master.item_code || '').trim().toUpperCase();
        const isRegistered = registeredCodes.has(masterCode);

        const row = document.createElement('tr');
        row.dataset.recordId = master.id || '';
        if (isRegistered) row.classList.add('already-registered');
        if (!isRegistered) row.classList.add('unregistered-row');

        /* 체크박스 셀 */
        const checkCell = document.createElement('td');
        checkCell.className = 'col-checkbox';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'base-material-row-check';
        checkbox.dataset.id = master.id;
        if (isRegistered) {
            checkbox.disabled = true;
            checkbox.title = '이미 생산계획에 등록된 자재입니다';
        }
        checkbox.addEventListener('change', updateBaseMaterialSelectionState);
        checkCell.appendChild(checkbox);
        row.appendChild(checkCell);

        const fields = [
            { value: master.scm_area, cls: '' },
            { value: master.hierarchy_name, cls: '' },
            { value: master.production_unit, cls: '' },
            { value: master.item_code, cls: '' },
            { value: master.item_name, cls: '' },
            { value: master.conversion1, cls: 'number', fmt: true },                         /* EA/BAG */
            { value: master.conversion2, cls: 'number', fmt: true },                         /* BAG/BOX */
            { value: (Number.isFinite(Number(master.conversion1)) && Number.isFinite(Number(master.conversion2)))
                ? (Number(master.conversion1) * Number(master.conversion2))
                : null, cls: 'number', fmt: true },                                          /* EA/BOX = conversion1 × conversion2 */
            { value: master.conversion3, cls: 'number', fmt: true },                         /* BAG/PLT */
            { value: master.conversion5, cls: 'number', fmt: true },                         /* BOX/PLT */
            { value: master.vendor_name, cls: '' },
            { value: master.moq, cls: 'number', num: true },
        ];

        fields.forEach(f => {
            const td = document.createElement('td');
            if (f.cls) td.className = f.cls;
            if (f.fmt && f.value != null && f.value !== '') {
                td.textContent = Number(f.value).toFixed(3);
            } else if (f.num && f.value != null && f.value !== '') {
                td.textContent = Number(f.value).toLocaleString('ko-KR');
            } else {
                td.textContent = f.value || '-';
            }
            row.appendChild(td);
        });

        /* 등록상태 셀 */
        const statusCell = document.createElement('td');
        statusCell.className = 'col-register-status';
        if (isRegistered) {
            const badge = document.createElement('span');
            badge.className = 'badge badge-registered';
            badge.textContent = '이미 등록된 자재';
            statusCell.appendChild(badge);
        } else {
            const badge = document.createElement('span');
            badge.className = 'badge badge-unregistered';
            badge.textContent = '미등록';
            statusCell.appendChild(badge);
        }
        row.appendChild(statusCell);

        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions';
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'ghost small btn-base-material-edit';
        editButton.textContent = '편집';
        editButton.dataset.id = master.id;
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'danger small btn-base-material-delete';
        deleteButton.textContent = '삭제';
        deleteButton.dataset.id = master.id;
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        fragment.appendChild(row);
    });
    tbody.appendChild(fragment);

    /* 전체 선택 체크박스 초기화 */
    if (dom.baseMaterialMaster.selectAll) {
        dom.baseMaterialMaster.selectAll.checked = false;
    }
    updateBaseMaterialSelectionState();
}

function updateBaseMaterialSelectionState() {
    const allCheckboxes = document.querySelectorAll('.base-material-row-check');
    const enabledCheckboxes = document.querySelectorAll('.base-material-row-check:not(:disabled)');
    const checked = document.querySelectorAll('.base-material-row-check:checked');
    const btn = dom.baseMaterialMaster?.btnRegisterPlan;
    if (btn) {
        btn.disabled = checked.length === 0;
        btn.textContent = checked.length > 0
            ? `생산계획 등록 (${checked.length}건)`
            : '생산계획 등록';
    }
    /* 전체 선택 체크박스 동기화 (비활성 체크박스 제외) */
    const selectAll = dom.baseMaterialMaster?.selectAll;
    if (selectAll && enabledCheckboxes.length > 0) {
        selectAll.checked = enabledCheckboxes.length === checked.length;
        selectAll.indeterminate = checked.length > 0 && checked.length < enabledCheckboxes.length;
    } else if (selectAll) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
    }
}

function handleBaseMaterialSelectAll() {
    const selectAll = dom.baseMaterialMaster?.selectAll;
    if (!selectAll) return;
    const isChecked = selectAll.checked;
    document.querySelectorAll('.base-material-row-check:not(:disabled)').forEach(cb => {
        cb.checked = isChecked;
    });
    updateBaseMaterialSelectionState();
}

async function handleRegisterProductionPlan() {
    const checked = document.querySelectorAll('.base-material-row-check:checked');
    if (checked.length === 0) {
        alert('생산계획에 등록할 자재를 선택하세요.');
        return;
    }

    const selectedIds = new Set([...checked].map(cb => String(cb.dataset.id)));
    const selectedMasters = (state.baseMaterialMasters || []).filter(m => selectedIds.has(String(m.id)));

    if (selectedMasters.length === 0) {
        alert('선택된 자재 정보를 찾을 수 없습니다.');
        return;
    }

    /* 현재 월(YYYY-MM) 기본값 */
    const now = new Date();
    const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    /* 이미 등록된 자재코드 확인 + 자재정보 비어있는 레코드 감지 */
    const existingRecordMap = new Map();
    (state.rawData || []).forEach(r => {
        const code = (r.item_code || '').trim().toUpperCase();
        if (code) existingRecordMap.set(code, r);
    });

    const newMasters = [];
    const enrichTargets = []; /* 이미 등록되었지만 자재정보가 비어있는 레코드 */
    let alreadyCompleteCount = 0;

    for (const m of selectedMasters) {
        const code = (m.item_code || '').trim().toUpperCase();
        const existingRecord = existingRecordMap.get(code);
        if (!existingRecord) {
            newMasters.push(m);
        } else {
            /* 기존 레코드에 자재정보가 비어있으면 보충 대상 */
            const hasName = existingRecord.item_name && existingRecord.item_name.trim();
            const hasCat = existingRecord.category && existingRecord.category.trim();
            const hasLine = existingRecord.production_line && existingRecord.production_line.trim();
            if (!hasName || !hasCat || !hasLine) {
                enrichTargets.push({ master: m, record: existingRecord });
            } else {
                alreadyCompleteCount++;
            }
        }
    }

    if (newMasters.length === 0 && enrichTargets.length === 0) {
        alert(`선택한 ${selectedMasters.length}건 모두 이미 생산계획에 등록되어 있습니다.`);
        return;
    }

    let confirmMsg = '';
    if (newMasters.length > 0) {
        confirmMsg += `신규 ${newMasters.length}건을 생산계획 대상자재로 등록`;
    }
    if (enrichTargets.length > 0) {
        if (confirmMsg) confirmMsg += ', ';
        confirmMsg += `자재정보 누락 ${enrichTargets.length}건을 보충`;
    }
    confirmMsg += '하시겠습니까?';
    if (alreadyCompleteCount > 0) {
        confirmMsg += `\n(이미 완전 등록된 ${alreadyCompleteCount}건은 제외됩니다.)`;
    }
    if (!confirm(confirmMsg)) return;

    const btn = dom.baseMaterialMaster?.btnRegisterPlan;
    if (btn) {
        btn.disabled = true;
        btn.textContent = '등록 중...';
    }

    let successCount = 0;
    let failCount = 0;
    let serverDuplicateCount = 0;

    for (const master of newMasters) {
        const itemCode = (master.item_code || '').trim();
        const payload = {
            item_code: itemCode,
            item_name: (master.item_name || '').trim(),
            category: (master.hierarchy_name || '').trim(),
            production_line: (master.production_unit || '').trim(),
            vendor_name: (master.vendor_name || '').trim() || null,
            moq: master.moq != null ? master.moq : null,
            plan_month: defaultMonth,
            sales_plan: 0,
            sales_actual: null,
            production_plan: 0,
            production_actual: 0,
            production_remaining: 0,
            beginning_inventory: 0,
            target_ending_inventory: 0,
            capacity_limit: 0,
            notes: '',
        };

        try {
            await createRecord(payload);
            successCount++;
        } catch (error) {
            if (error.code === 'DUPLICATE' && error.detail && error.detail.existing_id) {
                /* RFC 등으로 자동 생성된 SnopRecord가 있으면 자재정보 보충 (item_name, category 등) */
                try {
                    await updateRecord(error.detail.existing_id, {
                        item_name: payload.item_name,
                        category: payload.category,
                        production_line: payload.production_line,
                        vendor_name: payload.vendor_name,
                        moq: payload.moq,
                    });
                    successCount++;
                    console.info(`자재 ${itemCode} 기존 SnopRecord에 자재정보 보충 완료 (id=${error.detail.existing_id})`);
                } catch (updateError) {
                    console.error(`자재 ${itemCode} 보충 실패:`, updateError);
                    failCount++;
                }
            } else if (error.code === 'DUPLICATE') {
                serverDuplicateCount++;
                console.warn(`자재 ${itemCode} 서버 중복 감지:`, error.message);
            } else {
                console.error(`자재 ${itemCode} 등록 실패:`, error);
                failCount++;
            }
        }
    }

    /* 기존 레코드 자재정보 보충 (enrichTargets) */
    let enrichCount = 0;
    let enrichFailCount = 0;
    for (const { master, record } of enrichTargets) {
        try {
            await updateRecord(record.id, {
                item_name: (master.item_name || '').trim() || null,
                category: (master.hierarchy_name || '').trim() || null,
                production_line: (master.production_unit || '').trim() || null,
                vendor_name: (master.vendor_name || '').trim() || null,
                moq: master.moq != null ? master.moq : null,
            });
            enrichCount++;
            console.info(`자재 ${master.item_code} 기존 SnopRecord 자재정보 보충 완료 (id=${record.id})`);
        } catch (enrichError) {
            console.error(`자재 ${master.item_code} 자재정보 보충 실패:`, enrichError);
            enrichFailCount++;
        }
    }

    /* 체크박스 초기화 */
    document.querySelectorAll('.base-material-row-check').forEach(cb => { cb.checked = false; });
    if (dom.baseMaterialMaster?.selectAll) dom.baseMaterialMaster.selectAll.checked = false;
    updateBaseMaterialSelectionState();

    /* 데이터 새로고침 */
    await loadData();

    /* 기본 자재마스터 테이블도 등록상태 갱신을 위해 다시 렌더링 */
    renderBaseMaterialMasterTable();

    let resultMsg = `생산계획 등록 완료: ${successCount}건 성공`;
    if (enrichCount > 0) resultMsg += `, ${enrichCount}건 자재정보 보충`;
    if (failCount + enrichFailCount > 0) resultMsg += `, ${failCount + enrichFailCount}건 실패`;
    if (alreadyCompleteCount + serverDuplicateCount > 0) resultMsg += `, ${alreadyCompleteCount + serverDuplicateCount}건 중복 제외`;
    alert(resultMsg);
}

function setBaseMaterialMasterFilter(type, value) {
    const filters = ensureBaseMaterialMasterFilters();
    const trimmed = (value || '').trim();
    const normalized = !trimmed || trimmed.toLowerCase() === 'all' ? 'all' : trimmed;
    if (type === 'scm') {
        filters.scm = normalized;
    } else if (type === 'category') {
        filters.category = normalized;
    } else if (type === 'itemCode') {
        filters.itemCode = trimmed;
    } else if (type === 'prodUnit') {
        filters.prodUnit = normalized;
    }
    renderBaseMaterialMasterTable();
}

function loadBaseMaterialMasterIntoForm(master) {
    if (!dom.baseMaterialMaster || !master) return;
    const d = dom.baseMaterialMaster;
    if (d.recordId) d.recordId.value = master.id || '';
    if (d.scmArea) d.scmArea.value = master.scm_area || '';
    if (d.hierarchy) d.hierarchy.value = master.hierarchy_name || '';
    if (d.prodUnit) d.prodUnit.value = master.production_unit || '';
    if (d.itemCode) d.itemCode.value = master.item_code || '';
    if (d.itemName) d.itemName.value = master.item_name || '';
    if (d.conv1) d.conv1.value = master.conversion1 != null ? master.conversion1 : '';
    if (d.conv2) d.conv2.value = master.conversion2 != null ? master.conversion2 : '';
    if (d.conv3) d.conv3.value = master.conversion3 != null ? master.conversion3 : '';
    if (d.conv5) d.conv5.value = master.conversion5 != null ? master.conversion5 : '';
    updateBaseMaterialEaPerBox();
    if (d.vendorName) d.vendorName.value = master.vendor_name || '';
    if (d.moq) d.moq.value = master.moq != null ? master.moq : '';
    if (d.btnSave) d.btnSave.textContent = '수정 저장';
}

/**
 * 자재코드 입력 시 등록된 기본 자재마스터에서 해당 자재를 찾아
 * 나머지 필드를 자동 입력한다.
 * - 자재코드를 변경할 때마다 항상 새로운 자재 정보로 덮어쓴다.
 * - 등록되지 않은 자재코드를 입력하면 폼을 신규 등록 모드로 초기화한다.
 */
function handleBaseMaterialItemCodeAutoFill() {
    if (!dom.baseMaterialMaster) return;
    const d = dom.baseMaterialMaster;
    const inputCode = sanitizeText(d.itemCode?.value || '').trim();
    if (!inputCode) return;

    const match = (state.baseMaterialMasters || []).find(
        (m) => sanitizeText(m.item_code || '').trim() === inputCode
    );

    if (!match) {
        /* 등록되지 않은 자재코드 → 신규 등록 모드로 전환 (기존 입력값 유지) */
        if (d.recordId) d.recordId.value = '';
        if (d.btnSave) d.btnSave.textContent = '저장';
        return;
    }

    /* 등록된 자재 → 모든 필드를 해당 자재 정보로 덮어쓰기 */
    if (d.scmArea) d.scmArea.value = match.scm_area || '';
    if (d.hierarchy) d.hierarchy.value = match.hierarchy_name || '';
    if (d.prodUnit) d.prodUnit.value = match.production_unit || '';
    if (d.itemName) d.itemName.value = match.item_name || '';
    if (d.conv1) d.conv1.value = match.conversion1 != null ? match.conversion1 : '';
    if (d.conv2) d.conv2.value = match.conversion2 != null ? match.conversion2 : '';
    if (d.conv3) d.conv3.value = match.conversion3 != null ? match.conversion3 : '';
    if (d.conv5) d.conv5.value = match.conversion5 != null ? match.conversion5 : '';
    updateBaseMaterialEaPerBox();
    if (d.vendorName) d.vendorName.value = match.vendor_name || '';
    if (d.moq) d.moq.value = match.moq != null ? match.moq : '';

    /* 기존 레코드를 수정 모드로 전환 */
    if (d.recordId) d.recordId.value = match.id || '';
    if (d.btnSave) d.btnSave.textContent = '수정 저장';
}

function resetBaseMaterialMasterForm() {
    if (!dom.baseMaterialMaster || !dom.baseMaterialMaster.form) return;
    dom.baseMaterialMaster.form.reset();
    if (dom.baseMaterialMaster.recordId) dom.baseMaterialMaster.recordId.value = '';
    if (dom.baseMaterialMaster.convRatio) dom.baseMaterialMaster.convRatio.value = '';
    if (dom.baseMaterialMaster.btnSave) dom.baseMaterialMaster.btnSave.textContent = '저장';
}

function updateBaseMaterialEaPerBox() {
    if (!dom.baseMaterialMaster) return;
    const conv1Val = parseFloat(dom.baseMaterialMaster.conv1?.value);
    const conv2Val = parseFloat(dom.baseMaterialMaster.conv2?.value);
    if (dom.baseMaterialMaster.eaPerBox) {
        if (Number.isFinite(conv1Val) && Number.isFinite(conv2Val)) {
            dom.baseMaterialMaster.eaPerBox.value = (conv1Val * conv2Val).toFixed(3);
        } else {
            dom.baseMaterialMaster.eaPerBox.value = '';
        }
    }
}

async function handleBaseMaterialMasterFormSubmit(event) {
    event.preventDefault();
    if (!dom.baseMaterialMaster) return;
    const d = dom.baseMaterialMaster;

    const scmArea = (d.scmArea?.value || '').trim();
    const hierarchyName = (d.hierarchy?.value || '').trim();
    const productionUnit = (d.prodUnit?.value || '').trim();
    const itemCode = (d.itemCode?.value || '').trim();
    const itemName = (d.itemName?.value || '').trim();
    const conversion1 = parseFloat(d.conv1?.value);
    const conversion3 = parseFloat(d.conv3?.value);
    const conversion2 = parseFloat(d.conv2?.value);
    const conversion5 = parseFloat(d.conv5?.value);
    const vendorName = (d.vendorName?.value || '').trim();
    const moqVal = parseInt(d.moq?.value, 10);

    const errors = [];
    if (!scmArea) errors.push('SCM운영구분을 입력하세요.');
    if (!hierarchyName) errors.push('카테고리를 입력하세요.');
    if (!productionUnit) errors.push('생산라인을 입력하세요.');
    if (!itemCode) errors.push('자재코드를 입력하세요.');
    if (!itemName) errors.push('자재명칭을 입력하세요.');

    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    const payload = {
        scm_area: scmArea,
        hierarchy_name: hierarchyName,
        production_unit: productionUnit,
        item_code: itemCode,
        item_name: itemName,
        conversion1: Number.isFinite(conversion1) ? conversion1 : null,
        conversion3: Number.isFinite(conversion3) ? conversion3 : null,
        conversion2: Number.isFinite(conversion2) ? conversion2 : null,
        conversion5: Number.isFinite(conversion5) ? conversion5 : null,
        vendor_name: vendorName || null,
        moq: Number.isFinite(moqVal) ? moqVal : null,
    };

    const recordId = d.recordId?.value;
    const isUpdate = recordId && recordId !== '';

    try {
        const url = isUpdate
            ? `/sales-api/base-material-masters/${recordId}`
            : '/sales-api/base-material-masters';
        const method = isUpdate ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(isUpdate ? '수정 실패' : '등록 실패');
        }
        await refreshBaseMaterialMasters();
        resetBaseMaterialMasterForm();
        alert(isUpdate ? '기본 자재마스터가 수정되었습니다.' : '기본 자재마스터가 등록되었습니다.');
    } catch (error) {
        console.error(error);
        alert('기본 자재마스터 저장 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.');
    }
}

async function handleBaseMaterialMasterDelete(id) {
    if (!confirm('이 기본 자재마스터를 삭제하시겠습니까?')) return;
    try {
        const response = await fetch(`/sales-api/base-material-masters/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('삭제 실패');
        }
        await refreshBaseMaterialMasters();
        alert('기본 자재마스터가 삭제되었습니다.');
    } catch (error) {
        console.error(error);
        alert('기본 자재마스터 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.');
    }
}

function handleBaseMaterialMasterTableClick(event) {
    if (!dom.baseMaterialMaster || !dom.baseMaterialMaster.tableBody) return;
    const button = event.target.closest('button');
    if (!button) return;
    const recordId = button.dataset.id;
    if (!recordId) return;

    if (button.classList.contains('btn-base-material-edit')) {
        const master = (state.baseMaterialMasters || []).find(m => String(m.id) === String(recordId));
        if (master) {
            loadBaseMaterialMasterIntoForm(master);
            dom.baseMaterialMaster.form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else if (button.classList.contains('btn-base-material-delete')) {
        handleBaseMaterialMasterDelete(recordId);
    }
}

async function refreshBaseMaterialMasters() {
    try {
        const response = await fetch('/sales-api/base-material-masters?limit=1000');
        if (!response.ok) {
            throw new Error('기본 자재마스터 데이터를 불러오지 못했습니다.');
        }
        const payload = await response.json();
        const records = extractData(payload);
        state.baseMaterialMasters = records;
        populateBaseMaterialMasterFilters();
        renderBaseMaterialMasterTable();
    } catch (error) {
        console.error(error);
        alert('기본 자재마스터 정보를 갱신하는 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.');
    }
}

function updateChartSelectOptions() {
    const previous = dom.chartSelect.value;
    dom.chartSelect.innerHTML = '<option value="">자재를 선택하세요</option>';
    const items = getUniqueItems(state.rawData);
    items.forEach(({ code, name }) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = code ? `${name} (${code})` : name;
        dom.chartSelect.appendChild(option);
    });
    if (items.some(({ code }) => code === previous)) {
        dom.chartSelect.value = previous;
    }
}

function setFilterMonthByValue(monthValue) {
    if (!dom.filters.month) return;
    const value = sanitizeText(monthValue).trim();
    if (value) {
        ensureMonthFilterOption(value);
        dom.filters.month.value = value;
    } else {
        dom.filters.month.value = 'all';
    }
}

function handlePlanMonthChange() {
    if (!dom.planMonth) return;
    const selectedMonth = dom.planMonth.value;
    if (selectedMonth) {
        setFilterMonthByValue(selectedMonth);
    } else {
        dom.filters.month.value = 'all';
    }
    updateCapacityLimitFromLinePlan();
    applyFilters();
}

function handleFilterMonthChange() {
    const selected = dom.filters.month.value;
    if (selected && selected !== 'all' && dom.planMonth) {
        dom.planMonth.value = selected;
    }
    if (dom.dashboard && dom.dashboard.baseMonth) {
        dom.dashboard.baseMonth.dataset.manualSelection = 'false';
    }
    updateCapacityLimitFromLinePlan();
    applyFilters();
}

function syncPlanMonthInputWithFilter() {
    const selected = dom.filters.month.value;
    if (selected && selected !== 'all' && dom.planMonth) {
        dom.planMonth.value = selected;
    }
}

// -------------------- 자재코드 검색 필터 --------------------
function renderItemSearchList(query) {
    const list = dom.filters.itemList;
    if (!list) return;
    list.innerHTML = '';

    /* ── 현재 활성화된 필터(카테고리, 생산라인)에 맞는 자재만 표시 ── */
    const categoryFilter = getCategoryFilterValues();
    const lineFilter = dom.filters.line ? dom.filters.line.value : 'all';

    let baseRecords = state.rawData || [];
    if (categoryFilter !== 'all') {
        baseRecords = baseRecords.filter((r) => matchesCategoryFilter(categoryFilter, r.category));
    }
    if (lineFilter !== 'all') {
        baseRecords = baseRecords.filter((r) => sanitizeText(r.production_line).trim() === lineFilter);
    }
    const options = getUniqueItems(baseRecords);
    const q = (query || '').trim().toUpperCase();

    /* '전체' 옵션 항상 표시 */
    const allDiv = document.createElement('div');
    allDiv.className = 'item-search-option option-all';
    allDiv.textContent = '전체';
    allDiv.dataset.value = 'all';
    allDiv.addEventListener('mousedown', (e) => {
        e.preventDefault();
        selectItemFilter('all', '');
    });
    list.appendChild(allDiv);

    /* 필터된 옵션 */
    const filtered = q
        ? options.filter(({ code, name }) => {
            const upperCode = (code || '').toUpperCase();
            const upperName = (name || '').toUpperCase();
            return upperCode.includes(q) || upperName.includes(q);
        })
        : options;

    /* 자재코드 정렬 */
    filtered.sort((a, b) => (a.code || '').localeCompare(b.code || ''));

    const maxDisplay = 100; /* 성능 제한 */
    filtered.slice(0, maxDisplay).forEach(({ code, name }) => {
        const div = document.createElement('div');
        div.className = 'item-search-option';
        div.dataset.value = code;
        const codeSpan = document.createElement('span');
        codeSpan.className = 'item-code';
        codeSpan.textContent = code;
        div.appendChild(codeSpan);
        if (name && name !== code && name !== '-') {
            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name';
            nameSpan.textContent = name;
            div.appendChild(nameSpan);
        }
        div.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selectItemFilter(code, code);
        });
        list.appendChild(div);
    });

    if (filtered.length > maxDisplay) {
        const moreDiv = document.createElement('div');
        moreDiv.className = 'item-search-option';
        moreDiv.style.color = '#94a3b8';
        moreDiv.style.fontStyle = 'italic';
        moreDiv.style.cursor = 'default';
        moreDiv.textContent = `... 외 ${filtered.length - maxDisplay}건 (더 입력하여 검색)`;
        list.appendChild(moreDiv);
    }

    list.classList.remove('hidden');
}

function selectItemFilter(value, displayText) {
    dom.filters.item.value = value;
    if (dom.filters.itemInput) {
        dom.filters.itemInput.value = value === 'all' ? '' : displayText;
    }
    if (dom.filters.itemList) {
        dom.filters.itemList.classList.add('hidden');
    }
    applyFilters();
}

function initItemSearchFilter() {
    const input = dom.filters.itemInput;
    const list = dom.filters.itemList;
    if (!input || !list) return;

    input.addEventListener('focus', () => {
        renderItemSearchList(input.value);
    });

    input.addEventListener('input', () => {
        renderItemSearchList(input.value);
    });

    input.addEventListener('blur', () => {
        /* 약간의 딜레이로 mousedown 이벤트 먼저 처리 */
        setTimeout(() => {
            list.classList.add('hidden');
            /* 입력값이 비어있으면 '전체'로 리셋 */
            if (!input.value.trim()) {
                dom.filters.item.value = 'all';
                input.value = '';
                applyFilters();
            } else {
                /* 입력값과 정확히 매칭되는 자재코드가 있으면 선택, 없으면 리셋 */
                const q = input.value.trim().toUpperCase();
                const matched = (state.itemFilterOptions || []).find(({ code }) => (code || '').toUpperCase() === q);
                if (matched) {
                    dom.filters.item.value = matched.code;
                    input.value = matched.code;
                } else if (dom.filters.item.value === 'all') {
                    input.value = '';
                }
            }
        }, 200);
    });

    /* Escape 키로 닫기 */
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            list.classList.add('hidden');
            input.blur();
        }
    });
}

// -------------------- 필터 및 렌더링 --------------------
function applyFilters() {
    const itemFilter = dom.filters.item.value;
    const categoryFilter = getCategoryFilterValues();
    const monthFilter = dom.filters.month.value;
    const lineFilter = dom.filters.line.value;
    const inventoryStatusFilter = dom.filters.inventoryStatus ? dom.filters.inventoryStatus.value : 'all';
    const capaStatusFilter = dom.filters.capaStatus ? dom.filters.capaStatus.value : 'all';

    /* planTableReady는 사용자가 필터를 직접 조작할 때 true로 전환됨 (이벤트 리스너에서 설정) */

    const projectedRaw = generateProjectedRawRecords(state.rawData, PROJECTED_MONTH_EXTENSION, state.projectedOverrides);
    projectedRaw.forEach((record) => ensureMonthFilterOption(record.month));

    const extendedRaw = [...state.rawData, ...projectedRaw];
    const lineStats = buildLineStats(extendedRaw);
    const salesAggregatesMap = state.salesAggregates && state.salesAggregates.byKey instanceof Map
        ? state.salesAggregates.byKey
        : new Map();
    const enriched = buildChainedRecords(extendedRaw, lineStats, {
        salesAggregates: salesAggregatesMap,
        recentSalesIndex: state.recentSalesIndex,
    });
    /* ── 제외 카테고리(원단/미지정) 필터링 — enrichedData 단계에서 적용 ── */
    const enrichedFiltered = enriched.filter((record) => !isExcludedCategory(record.category));
    state.enrichedData = enrichedFiltered;
    populateAnalyticsMonthFilter(enrichedFiltered);
    refreshChangeHistoryView();

    let filtered = enrichedFiltered;

    /* ── 리뉴얼 기존자재 제외 ──
     * resolver에 의해 canonical_item_code가 변경된 레코드(기존자재)는 리스트에서 제외.
     * 기존자재의 데이터는 canonical(신규자재) 레코드에 합산되어 표시됨. */
    if (state.materialLinkageResolver) {
        const beforeCount = filtered.length;
        filtered = filtered.filter((record) => {
            const code = sanitizeText(record.item_code).trim();
            const canonical = getRecordCanonicalCode(record);
            /* item_code와 canonical이 다르면 → 기존자재 → 제외 */
            const keep = !code || !canonical || code === canonical;
            if (!keep) {
                console.debug(`[applyFilters] 기존자재 제외: ${code} → canonical=${canonical}`);
            }
            return keep;
        });
        if (filtered.length < beforeCount) {
            console.info(`[applyFilters] 리뉴얼 기존자재 ${beforeCount - filtered.length}건 제외`);
        }
    }

    /* ── 현재월 이전 데이터 필터링 ──
     * 계획월(YYYY-MM)이 시스템 날짜 기준 현재월보다 이전이면 제외.
     * 단, 월 필터에서 특정 과거월을 명시적으로 선택한 경우에는 해당 월 데이터를 보여줌. */
    if (monthFilter === 'all') {
        const now = new Date();
        const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
        filtered = filtered.filter((record) => {
            const m = (record.month || '').trim();
            if (!m) return true; // 월 정보 없으면 표시
            return m >= currentMonth;
        });
    }

    if (itemFilter !== 'all') {
        filtered = filtered.filter((record) => getRecordCanonicalCode(record) === itemFilter);
    }
    if (categoryFilter !== 'all') {
        filtered = filtered.filter((record) => matchesCategoryFilter(categoryFilter, record.category));
    }
    if (monthFilter !== 'all') {
        filtered = filtered.filter((record) => record.month === monthFilter);
    }
    if (lineFilter !== 'all') {
        filtered = filtered.filter((record) => sanitizeText(record.production_line).trim() === lineFilter);
    }
    if (inventoryStatusFilter !== 'all') {
        filtered = filtered.filter((record) => {
            const statusClass = record.inventoryStatus ? record.inventoryStatus.className : null;
            if (!statusClass) return false;
            return statusClass === inventoryStatusFilter;
        });
    }
    if (capaStatusFilter !== 'all') {
        filtered = filtered.filter((record) => {
            const status = record.lineCapacityStatus || null;
            if (!status) return false;
            if (capaStatusFilter === 'alert') {
                return status.className === 'alert';
            }
            if (capaStatusFilter === 'safe') {
                return status.className === 'safe';
            }
            if (capaStatusFilter === 'warning-buffer') {
                return status.className === 'warning' && status.label && status.label.includes('여유');
            }
            if (capaStatusFilter === 'warning-missing') {
                return status.className === 'warning' && status.label && status.label.includes('CAPA 미등록');
            }
            return false;
        });
    }

    /* ── 제품 유형 탭 필터 (생산 / OEM) ── */
    if (state.activeProductType === 'oem') {
        filtered = filtered.filter((record) => {
            const line = sanitizeText(record.production_line).trim().toUpperCase();
            return line.includes('OEM');
        });
    } else {
        /* 생산 탭: OEM 상품 제외 */
        filtered = filtered.filter((record) => {
            const line = sanitizeText(record.production_line).trim().toUpperCase();
            return !line.includes('OEM');
        });
    }

    filtered = sortRecordsForDisplay(filtered);

    state.filteredData = filtered;
    syncLineCapaUsageFiltersFromMain();
    populateLineCapaUsageFilters();
    renderTable();
    renderSummaries();
    renderOptimalInventoryView();
    renderAnalyticsRiskTable();
    updateChart();
    updateLineCapaChart();
    updateDashboardBaseMonthOptions();
}

/**
 * 2단 헤더 sticky top 자동 계산
 * header-row-1의 높이를 측정하여 header-row-2의 top 오프셋(CSS 변수)을 설정한다.
 * 뷰가 display:none 상태이면 높이가 0이므로, 재시도 로직을 포함한다.
 */
function updatePlanHeaderStickyTop() {
    const planTable = document.getElementById('plan-table');
    if (!planTable) return;

    function measure() {
        const row1 = planTable.querySelector('thead tr.header-row-1');
        if (!row1) return;
        const h = row1.getBoundingClientRect().height;
        if (h > 0) {
            planTable.style.setProperty('--plan-header-row1-height', h + 'px');
        }
        return h;
    }

    /* 즉시 시도 */
    const h = measure();
    if (h > 0) return;

    /* display:none 등으로 높이가 0인 경우, rAF → setTimeout 순서로 재시도 */
    requestAnimationFrame(() => {
        if (measure() > 0) return;
        setTimeout(() => measure(), 50);
    });
}

function updatePlanTableScrollControls() {
    planTableScrollAnimationFrame = null;
    if (!dom.planTableScroll || !dom.planTableScroll.wrapper) return;
    const { wrapper, leftButton, rightButton } = dom.planTableScroll;
    const buttons = [leftButton, rightButton];

    const scrollable = wrapper.scrollWidth - wrapper.clientWidth > 2;
    buttons.forEach((button) => {
        if (!button) return;
        button.classList.toggle('hidden', !scrollable);
        if (!scrollable) {
            button.setAttribute('aria-hidden', 'true');
            button.setAttribute('tabindex', '-1');
        } else {
            button.removeAttribute('aria-hidden');
            button.removeAttribute('tabindex');
        }
    });

    if (!scrollable) {
        if (leftButton) leftButton.disabled = true;
        if (rightButton) rightButton.disabled = true;
        return;
    }

    const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
    if (leftButton) {
        leftButton.disabled = wrapper.scrollLeft <= 2;
    }
    if (rightButton) {
        rightButton.disabled = wrapper.scrollLeft >= maxScrollLeft - 2;
    }
}

function scrollPlanTableBy(direction) {
    if (!dom.planTableScroll || !dom.planTableScroll.wrapper) return;
    const { wrapper } = dom.planTableScroll;
    const delta = direction === 'left' ? -PLAN_TABLE_SCROLL_STEP : PLAN_TABLE_SCROLL_STEP;
    wrapper.scrollBy({ left: delta, behavior: 'smooth' });
}

function handlePlanTableScrollButtons(event) {
    const button = event.currentTarget;
    if (!button || button.disabled) return;
    const direction = sanitizeText(button.dataset.direction).toLowerCase();
    if (!direction) return;
    scrollPlanTableBy(direction === 'left' ? 'left' : 'right');
}

function renderTable() {
    dom.tableBody.innerHTML = '';

    /* 첫 로드 시 테이블 렌더링 생략 — 필터 선택 후 표시 (성능 최적화) */
    if (!state.planTableReady) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 45;
        cell.className = 'empty';
        cell.textContent = '계획월, 카테고리, 생산라인 등 필터를 선택하면 데이터가 표시됩니다.';
        row.appendChild(cell);
        dom.tableBody.appendChild(row);
        updatePlanTableScrollControls();
        return;
    }

    if (state.filteredData.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 45;
        cell.className = 'empty';
        cell.textContent = '조건에 맞는 데이터가 없습니다. 다른 필터를 선택해 보세요.';
        row.appendChild(cell);
        dom.tableBody.appendChild(row);
        updatePlanTableScrollControls();
        return;
    }

    const fragment = document.createDocumentFragment();
    state.filteredData.forEach((record) => {
        const row = dom.rowTemplate.content.firstElementChild.cloneNode(true);
        row.dataset.recordId = record.id;
        if (record.salesActualSource) {
            row.dataset.salesActualSource = record.salesActualSource;
        }
        if (record.productionActualSource) {
            row.dataset.productionActualSource = record.productionActualSource;
        }

        const canonicalCode = getRecordCanonicalCode(record);
        const canonicalName = getRecordCanonicalName(record);
        const originalCode = sanitizeText(record.item_code).trim();
        const originalName = sanitizeText(record.item_name).trim();
        const convRates = getConversionRates(canonicalCode || originalCode);
        row.dataset.itemCode = originalCode;
        if (canonicalCode) {
            row.dataset.canonicalCode = canonicalCode;
        }

        if (record.isProjected) {
            row.classList.add('projected-row');
        }
        if (canonicalCode && originalCode && canonicalCode !== originalCode) {
            row.classList.add('renewal-inherited-row');
        }

        const categoryCell = row.querySelector('[data-field="category"]');
        if (categoryCell) {
            categoryCell.textContent = sanitizeText(record.category) || '-';
        }

        const codeCell = row.querySelector('[data-field="item_code"]');
        if (codeCell) {
            codeCell.textContent = originalCode || canonicalCode || '-';
            if (canonicalCode && originalCode && canonicalCode !== originalCode) {
                const badge = document.createElement('span');
                badge.className = 'renewal-badge';
                badge.textContent = `연결 → ${canonicalCode}`;
                codeCell.appendChild(document.createElement('br'));
                codeCell.appendChild(badge);
            }
        }

        const nameCell = row.querySelector('[data-field="item_name"]');
        if (nameCell) {
            nameCell.textContent = originalName || canonicalName || '-';
            if (canonicalName && originalName && canonicalName !== originalName) {
                const badge = document.createElement('span');
                badge.className = 'renewal-badge';
                badge.textContent = `신규명: ${canonicalName}`;
                nameCell.appendChild(document.createElement('br'));
                nameCell.appendChild(badge);
            }
        }
        row.querySelector('[data-field="production_line"]').textContent = sanitizeText(record.production_line) || '-';

        /* 협력업체명 셀 (OEM 탭에서만 표시) */
        const vendorCell = row.querySelector('[data-field="vendor_name"]');
        if (vendorCell) {
            /* record.vendor_name이 없으면 기본자재마스터에서 조회 */
            let vendorDisplay = sanitizeText(record.vendor_name) || '';
            if (!vendorDisplay) {
                const masterForVendor = (state.baseMaterialMasters || []).find(
                    m => m.item_code === record.item_code
                );
                if (masterForVendor) vendorDisplay = sanitizeText(masterForVendor.vendor_name || masterForVendor.vendorName || '') || '';
            }
            vendorCell.textContent = vendorDisplay || '-';
            vendorCell.style.display = state.activeProductType === 'oem' ? '' : 'none';
        }

        /* 현재고: SAP API 또는 전월 예상월말재고에서 연동 */
        const availableInvCell = row.querySelector('[data-field="available_inventory"]');
        if (availableInvCell) {
            availableInvCell.classList.remove('alert');
            const avail = Number.isFinite(record.available_inventory) ? record.available_inventory : null;
            if (avail !== null) {
                availableInvCell.textContent = formatNumber(avail);
                if (avail < 0) {
                    availableInvCell.classList.add('alert');
                }
            } else {
                availableInvCell.textContent = '-';
            }
            /* 전월 예상월말재고에서 연동된 경우 배지 표시 */
            if (record.available_inventory_linked) {
                const badge = document.createElement('span');
                badge.className = 'tag neutral';
                badge.textContent = '전월 연동';
                const wrapper = document.createElement('div');
                wrapper.className = 'tag-wrapper';
                wrapper.appendChild(badge);
                availableInvCell.appendChild(wrapper);
            }
        }

        const salesActualCell = row.querySelector('[data-field="sales_actual"]');
        if (salesActualCell) {
            salesActualCell.textContent = '';
            if (Number.isFinite(record.sales_actual)) {
                const valueSpan = document.createElement('span');
                valueSpan.textContent = formatNumber(record.sales_actual);
                salesActualCell.appendChild(valueSpan);
                if (record.salesActualSource === 'fallback') {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'tag-wrapper';
                    const badge = document.createElement('span');
                    badge.className = 'tag neutral';
                    badge.textContent = '임의값';
                    badge.title = 'API 미연결 상태에서 임의로 생성된 테스트 수치입니다.';
                    badge.setAttribute('aria-label', 'API 미연결 상태에서 임의로 생성된 테스트 수치입니다.');
                    wrapper.appendChild(badge);
                    salesActualCell.appendChild(wrapper);
                }
            } else {
                salesActualCell.textContent = '-';
            }
        }

        /* ── 납품율 셀 렌더링 ── */
        const deliveryRateCell = row.querySelector('[data-field="delivery_rate"]');
        if (deliveryRateCell) {
            deliveryRateCell.textContent = '';
            deliveryRateCell.classList.remove('high-rate', 'low-rate');
            if (Number.isFinite(record.delivery_rate)) {
                const pct = (record.delivery_rate * 100).toFixed(1);
                deliveryRateCell.textContent = `${pct}%`;
                if (record.delivery_rate >= 1) {
                    deliveryRateCell.classList.add('high-rate');
                } else if (record.delivery_rate < 0.8) {
                    deliveryRateCell.classList.add('low-rate');
                }
            } else {
                deliveryRateCell.textContent = '-';
            }
        }

        const salesAvg3mCell = row.querySelector('[data-field="sales_actual_avg_3m"]');
        if (salesAvg3mCell) {
            const avgValue = Number.isFinite(record.salesActualAvg3m)
                ? record.salesActualAvg3m
                : null;
            if (avgValue !== null) {
                const rounded = Math.round(avgValue);
                salesAvg3mCell.textContent = formatNumber(rounded);
                const sourceLabel = record.salesActualAvg3mSource === 'uploaded'
                    ? '업로드된 평균'
                    : '최근 3개월(이전 -1~-3월) 판매실적 평균';
                salesAvg3mCell.title = `${sourceLabel}입니다.`;
            } else {
                salesAvg3mCell.textContent = '-';
            }
        }

        /* 최근 3개월 판매실적 편차 */
        const salesStdDevCell = row.querySelector('[data-field="sales_actual_stddev_3m"]');
        if (salesStdDevCell) {
            const stdDevValue = Number.isFinite(record.salesActualStdDev3m)
                ? record.salesActualStdDev3m
                : null;
            if (stdDevValue !== null) {
                const rounded = Math.round(stdDevValue);
                salesStdDevCell.textContent = formatNumber(rounded);
                salesStdDevCell.title = '최근 3개월 판매실적 표본 표준편차(STDEV.S)입니다. 값이 클수록 판매 변동이 큽니다.';
                if (stdDevValue > 100) {
                    salesStdDevCell.classList.add('high-deviation');
                }
            } else {
                salesStdDevCell.textContent = '-';
            }
        }

        const salesRemainingCell = row.querySelector('[data-field="sales_remaining"]');
        if (salesRemainingCell) {
            if (Number.isFinite(record.sales_remaining)) {
                salesRemainingCell.textContent = formatSignedNumber(record.sales_remaining);
            } else {
                salesRemainingCell.textContent = '-';
            }
        }
        const monthCell = row.querySelector('[data-field="month"]');
        monthCell.textContent = sanitizeText(record.month);

        /* ── 우선순위 셀 (카테고리별 순서, 인라인 편집) ── */
        const priorityCell = row.querySelector('[data-field="priority"]');
        if (priorityCell) {
            priorityCell.textContent = '';
            const priInput = document.createElement('input');
            priInput.type = 'number';
            priInput.className = 'inline-input priority-input';
            priInput.dataset.recordId = record.id;
            priInput.value = Number.isFinite(record.priority) ? record.priority : '';
            priInput.min = 1;
            priInput.step = 1;
            priInput.style.width = '52px';
            priInput.style.textAlign = 'center';
            priInput.title = '카테고리 내 우선순위 (숫자가 낮을수록 높은 우선순위)';
            priInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); priInput.blur(); }
            });
            priInput.addEventListener('change', () => {
                handleInlinePriorityChange(record.id, priInput.value);
            });
            priorityCell.appendChild(priInput);
        }

        const salesCell = row.querySelector('[data-field="sales_plan"]');
        if (salesCell) {
            salesCell.textContent = '';
            const salesValue = document.createElement('span');
            salesValue.textContent = Number.isFinite(record.sales_plan) ? formatNumber(record.sales_plan) : '-';
            if (record.salesPlanSource === 'uploaded') {
                salesValue.classList.add('uploaded-sales-highlight');
                const breakdownTooltip = Array.isArray(record.salesPlanBreakdown)
                    ? record.salesPlanBreakdown
                        .map(({ display, channel, quantity }) => {
                            const label = sanitizeText(display) || sanitizeText(channel) || '채널 미지정';
                            return `${label}: ${formatNumber(quantity)} EA`;
                        })
                        .join(' • ')
                    : '';
                const defaultTooltip = '판매계획 업로드 합산값';
                const tooltipText = breakdownTooltip ? `채널별 상세: ${breakdownTooltip}` : defaultTooltip;
                salesValue.title = tooltipText;
                salesValue.setAttribute('aria-label', `${defaultTooltip}. ${formatNumber(record.sales_plan)} BOX${breakdownTooltip ? `. ${tooltipText}` : ''}`);
            }
            salesCell.appendChild(salesValue);
        }

        /* ── 제안 생산계획 (EA/BAG/BOX) — BOX 기준 ── */
        const suggestedBox = Number.isFinite(record.suggested_production) ? record.suggested_production : record.production_plan;
        renderTripleUnitCell(row, 'production_plan', suggestedBox, convRates, false);
        const ppEaCell = row.querySelector('[data-field="production_plan_ea"]');
        if (ppEaCell && Number.isFinite(record.suggested_production)) {
            ppEaCell.title = '적정재고를 달성할 수 있는 제안 생산 수량입니다.';
        }

        /* ── 적정재고 대비 필요량 (EA/BAG/BOX) ── */
        renderTripleUnitCell(row, 'required_quantity', record.required_quantity, convRates, true);

        /* ── 보정 생산계획 (BOX 입력 + EA/BAG 자동환산) ── */
        const adjustedPlanBoxCell = row.querySelector('[data-field="adjusted_production_plan_box"]');
        if (adjustedPlanBoxCell) {
            adjustedPlanBoxCell.textContent = '';
            adjustedPlanBoxCell.classList.remove('adjusted-up', 'adjusted-down');
            const adjWrapper = document.createElement('div');
            adjWrapper.className = 'inline-edit';
            const adjInput = document.createElement('input');
            adjInput.type = 'number';
            adjInput.className = 'inline-input adjusted-plan-input';
            adjInput.dataset.recordId = record.id;
            if (record.isProjected) {
                adjInput.classList.add('projected-input');
            }
            adjInput.value = Number.isFinite(record.adjusted_production_plan)
                ? record.adjusted_production_plan
                : '';
            adjInput.min = 0;
            adjInput.step = 1;
            adjInput.inputMode = 'numeric';
            adjInput.title = '보정 생산계획 수량(BOX)을 입력하세요.';
            adjInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    adjInput.blur();
                }
            });
            adjInput.addEventListener('change', (event) => {
                handleInlineAdjustedPlanChange(record.id, event.target.value);
            });
            adjWrapper.appendChild(adjInput);
            adjustedPlanBoxCell.appendChild(adjWrapper);

            if (Number.isFinite(record.adjusted_production_plan) && Number.isFinite(record.suggested_production)) {
                if (record.adjusted_production_plan > record.suggested_production) {
                    adjustedPlanBoxCell.classList.add('adjusted-up');
                } else if (record.adjusted_production_plan < record.suggested_production) {
                    adjustedPlanBoxCell.classList.add('adjusted-down');
                }
            }
        }
        /* 보정 생산계획 EA/BAG 환산 (BOX 기준) */
        const adjPlanEaCell = row.querySelector('[data-field="adjusted_production_plan_ea"]');
        const adjPlanBagCell = row.querySelector('[data-field="adjusted_production_plan_bag"]');
        if (Number.isFinite(record.adjusted_production_plan)) {
            const adjUnits = convertFromBox(record.adjusted_production_plan, convRates);
            if (adjPlanEaCell) adjPlanEaCell.textContent = Number.isFinite(adjUnits.ea) ? formatNumber(adjUnits.ea) : '-';
            if (adjPlanBagCell) adjPlanBagCell.textContent = Number.isFinite(adjUnits.bag) ? formatNumber(adjUnits.bag) : '-';
        } else {
            if (adjPlanEaCell) adjPlanEaCell.textContent = '-';
            if (adjPlanBagCell) adjPlanBagCell.textContent = '-';
        }

        /* ── 분할(MOQ기준) (보정생산계획 BOX ÷ MOQ BOX, OEM 탭에서만 표시) ── */
        {
            const vehicleCountCell = row.querySelector('[data-field="vehicle_count"]');
            if (vehicleCountCell) {
                vehicleCountCell.textContent = '-';
                const adjPlanBox = Number.isFinite(record.adjusted_production_plan) ? record.adjusted_production_plan : null;
                /* MOQ BOX 값 조회: record.moq → 기본자재마스터 fallback */
                let moqBoxForVehicle = (Number.isFinite(record.moq) && record.moq > 0) ? record.moq : null;
                if (moqBoxForVehicle === null) {
                    const master = (state.baseMaterialMasters || []).find(
                        m => m.item_code === record.item_code
                    );
                    if (master && Number.isFinite(master.moq) && master.moq > 0) {
                        moqBoxForVehicle = master.moq;
                    }
                }
                if (adjPlanBox !== null && moqBoxForVehicle !== null && moqBoxForVehicle > 0) {
                    const vehicleCount = adjPlanBox / moqBoxForVehicle;
                    vehicleCountCell.textContent = Number.isFinite(vehicleCount) ? vehicleCount.toFixed(1) : '-';
                }
                vehicleCountCell.style.display = state.activeProductType === 'oem' ? '' : 'none';
            }
        }

        /* ── 수작업 투입수량 (BOX 입력, 서버 즉시 저장) ── */
        const manualInputCell = row.querySelector('[data-field="manual_input_quantity"]');
        if (manualInputCell) {
            manualInputCell.textContent = '';
            const manualWrapper = document.createElement('div');
            manualWrapper.className = 'inline-edit';
            const manualInput = document.createElement('input');
            manualInput.type = 'number';
            manualInput.className = 'inline-input manual-input-quantity';
            manualInput.dataset.recordId = record.id;
            manualInput.value = (Number.isFinite(record.manual_input_quantity) && record.manual_input_quantity > 0)
                ? record.manual_input_quantity
                : '';
            manualInput.min = 0;
            manualInput.step = 1;
            manualInput.inputMode = 'numeric';
            manualInput.title = '수작업 투입수량(BOX)을 입력하세요.';
            manualInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    manualInput.blur();
                }
            });
            manualInput.addEventListener('change', (event) => {
                handleInlineManualInputChange(record.id, event.target.value);
            });
            manualWrapper.appendChild(manualInput);
            manualInputCell.appendChild(manualWrapper);
        }

        /* MOQ EA/BAG/BOX 셀 (OEM 탭에서만 표시, 기본자재마스터의 MOQ는 BOX 단위) */
        {
            /* record.moq가 없으면 기본자재마스터에서 조회 */
            let moqBox = (Number.isFinite(record.moq) && record.moq > 0) ? record.moq : null;
            if (moqBox === null) {
                const master = (state.baseMaterialMasters || []).find(
                    m => m.item_code === record.item_code
                );
                if (master && Number.isFinite(master.moq) && master.moq > 0) {
                    moqBox = master.moq;
                }
            }
            const moqUnits = moqBox !== null ? convertFromBox(moqBox, convRates) : { ea: null, bag: null, box: null };
            const moqEaCell = row.querySelector('[data-field="moq_ea"]');
            const moqBagCell = row.querySelector('[data-field="moq_bag"]');
            const moqBoxCell = row.querySelector('[data-field="moq_box"]');
            if (moqEaCell) moqEaCell.textContent = Number.isFinite(moqUnits.ea) ? formatNumber(moqUnits.ea) : '-';
            if (moqBagCell) moqBagCell.textContent = Number.isFinite(moqUnits.bag) ? formatNumber(moqUnits.bag) : '-';
            if (moqBoxCell) moqBoxCell.textContent = moqBox !== null ? formatNumber(moqBox) : '-';
            const isOem = state.activeProductType === 'oem';
            if (moqEaCell) moqEaCell.style.display = isOem ? '' : 'none';
            if (moqBagCell) moqBagCell.style.display = isOem ? '' : 'none';
            if (moqBoxCell) moqBoxCell.style.display = isOem ? '' : 'none';
        }

        /* 라인 총 생산 (EA/BAG/BOX) */
        renderTripleUnitCell(row, 'line_total_production', record.lineTotalProduction, convRates, false);
        /* OEM 탭에서는 라인 총 생산 숨김 — CSS .oem-mode 클래스가 처리 */
        const beginningCell = row.querySelector('[data-field="beginning_inventory"]');
        beginningCell.textContent = Number.isFinite(record.beginning_inventory) ? formatNumber(record.beginning_inventory) : '-';

        /* ── 재고일수(현재고기준) 셀 렌더링 ──
           산식: 현재고(available_inventory) / 최근3개월 판매실적평균 × 30.42 */
        const currentInvDaysCell = row.querySelector('[data-field="current_inventory_days"]');
        if (currentInvDaysCell) {
            currentInvDaysCell.textContent = '';
            currentInvDaysCell.classList.remove('days-high', 'days-low');
            const curInv = Number.isFinite(record.available_inventory) ? record.available_inventory : null;
            const avgSalesCur = Number.isFinite(record.salesActualAvg3m) ? record.salesActualAvg3m : null;
            if (curInv !== null && avgSalesCur && avgSalesCur > 0) {
                const curDays = (curInv / avgSalesCur) * 30.42;
                currentInvDaysCell.textContent = `${curDays.toFixed(1)}일`;
                if (curDays >= 60) {
                    currentInvDaysCell.classList.add('days-high');
                } else if (curDays < 15) {
                    currentInvDaysCell.classList.add('days-low');
                }
            } else {
                currentInvDaysCell.textContent = '-';
            }
        }

        /* ── 소진일자(현재고기준) 셀 렌더링 ──
           산식: 시스템일자(오늘) + 재고일수(현재고기준) */
        const currentDepletionDateCell = row.querySelector('[data-field="current_depletion_date"]');
        if (currentDepletionDateCell) {
            currentDepletionDateCell.textContent = '-';
            const curInv2 = Number.isFinite(record.available_inventory) ? record.available_inventory : null;
            const avgSalesCur2 = Number.isFinite(record.salesActualAvg3m) ? record.salesActualAvg3m : null;
            if (curInv2 !== null && avgSalesCur2 && avgSalesCur2 > 0) {
                const curInvDays = (curInv2 / avgSalesCur2) * 30.42;
                const today = new Date();
                const curDepDate = new Date(today.getTime() + curInvDays * 24 * 60 * 60 * 1000);
                const yyyy = curDepDate.getFullYear();
                const mm = String(curDepDate.getMonth() + 1).padStart(2, '0');
                const dd = String(curDepDate.getDate()).padStart(2, '0');
                currentDepletionDateCell.textContent = `${yyyy}-${mm}-${dd}`;
            }
        }

        /* 생산실적 (EA/BAG/BOX) */
        renderTripleUnitCell(row, 'production_actual', record.production_actual, convRates, false);

        /* 잔여생산 (EA/BAG/BOX) */
        const adjRemaining = Number.isFinite(record.adj_production_remaining) ? record.adj_production_remaining : record.production_remaining;
        renderTripleUnitCell(row, 'production_remaining', adjRemaining, convRates, false);

        const progressCell = row.querySelector('[data-field="production_progress"]');
        if (progressCell) {
            const adjPlan = Number.isFinite(record.adjusted_production_plan) ? record.adjusted_production_plan : record.production_plan;
            if (Number.isFinite(record.production_actual) && Number.isFinite(adjPlan) && adjPlan > 0) {
                const progressRatio = record.production_actual / adjPlan;
                progressCell.textContent = formatPercent(progressRatio, 1);
            } else {
                progressCell.textContent = '-';
            }
        }

        const adjEnding = Number.isFinite(record.adj_ending_inventory) ? record.adj_ending_inventory : record.ending_inventory;
        row.querySelector('[data-field="ending_inventory"]').textContent = Number.isFinite(adjEnding) ? formatNumber(adjEnding) : '-';

        /* ── 재고일수 셀 렌더링 ──
           산식: 예상월말재고 / 최근3개월 판매실적평균 × 30.42 */
        const inventoryDaysCell = row.querySelector('[data-field="inventory_days"]');
        if (inventoryDaysCell) {
            inventoryDaysCell.textContent = '';
            inventoryDaysCell.classList.remove('days-high', 'days-low');
            const avgSales = Number.isFinite(record.salesActualAvg3m) ? record.salesActualAvg3m : null;
            if (Number.isFinite(adjEnding) && avgSales && avgSales > 0) {
                const days = (adjEnding / avgSales) * 30.42;
                inventoryDaysCell.textContent = `${days.toFixed(1)}일`;
                if (days >= 60) {
                    inventoryDaysCell.classList.add('days-high');
                } else if (days < 15) {
                    inventoryDaysCell.classList.add('days-low');
                }
            } else {
                inventoryDaysCell.textContent = '-';
            }
        }

        /* ── 소진일자 셀 렌더링 ──
           산식: 시스템일자(오늘) + 재고일수 */
        const depletionDateCell = row.querySelector('[data-field="depletion_date"]');
        if (depletionDateCell) {
            depletionDateCell.textContent = '-';
            const avgSalesForDepletion = Number.isFinite(record.salesActualAvg3m) ? record.salesActualAvg3m : null;
            if (Number.isFinite(adjEnding) && avgSalesForDepletion && avgSalesForDepletion > 0) {
                const invDays = (adjEnding / avgSalesForDepletion) * 30.42;
                const today = new Date();
                const depletionDate = new Date(today.getTime() + invDays * 24 * 60 * 60 * 1000);
                const yyyy = depletionDate.getFullYear();
                const mm = String(depletionDate.getMonth() + 1).padStart(2, '0');
                const dd = String(depletionDate.getDate()).padStart(2, '0');
                depletionDateCell.textContent = `${yyyy}-${mm}-${dd}`;
            }
        }

        row.querySelector('[data-field="target_ending_inventory"]').textContent = Number.isFinite(record.target_ending_inventory) ? formatNumber(record.target_ending_inventory) : '-';
        row.querySelector('[data-field="line_capacity_limit"]').textContent = Number.isFinite(record.lineCapacityLimit)
            ? `${formatNumber(record.lineCapacityLimit)} BOX`
            : '-';
        /* 비고란: 사용자 직접 입력 내용만 표시 (빈 값이면 공백) */
        const notesVal = sanitizeText(record.notes).trim();
        row.querySelector('[data-field="notes"]').textContent = notesVal || '';

        const inventoryCell = row.querySelector('[data-field="inventory_status"]');
        inventoryCell.textContent = '';
        const effectiveInvStatus = record.adj_inventory_status || record.inventoryStatus;
        if (effectiveInvStatus) {
            const inventoryTag = document.createElement('span');
            inventoryTag.className = `tag ${effectiveInvStatus.className}`;
            inventoryTag.textContent = effectiveInvStatus.label;
            inventoryCell.appendChild(inventoryTag);
        } else {
            inventoryCell.textContent = '-';
        }

        const capacityRatioCell = row.querySelector('[data-field="line_capacity_ratio"]');
        capacityRatioCell.textContent = Number.isFinite(record.lineCapacityRatio)
            ? formatPercent(record.lineCapacityRatio)
            : '-';

        const capacityStatusCell = row.querySelector('[data-field="line_capacity_status"]');
        capacityStatusCell.textContent = '';
        if (record.lineCapacityStatus) {
            const capacityTag = document.createElement('span');
            capacityTag.className = `tag ${record.lineCapacityStatus.className}`;
            capacityTag.textContent = record.lineCapacityStatus.label;
            capacityStatusCell.appendChild(capacityTag);
        } else {
            capacityStatusCell.textContent = '-';
        }

        const leadTimeCell = row.querySelector('[data-field="production_lead_time"]');
        if (leadTimeCell) {
            leadTimeCell.textContent = Number.isFinite(record.productionLeadTimeHours)
                ? `${record.productionLeadTimeHours.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 시간`
                : '-';
        }

        /* OEM 탭일 때 CAPA/생산소요시간 셀 숨김 — CSS .oem-mode 클래스가 처리 */

        const actionsCell = row.querySelector('.actions');
        const editButton = actionsCell ? actionsCell.querySelector('.btn-edit') : null;
        const deleteButton = actionsCell ? actionsCell.querySelector('.btn-delete') : null;
        if (editButton) {
            editButton.addEventListener('click', () => loadRecordIntoForm(record.id));
        }
        if (deleteButton) {
            deleteButton.addEventListener('click', () => handleDelete(record.id));
        }

        fragment.appendChild(row);
    });

    dom.tableBody.appendChild(fragment);
    syncAllPendingProductionStates();
    updatePlanTableScrollControls();

    /* 2단 헤더 sticky top 자동 계산 */
    updatePlanHeaderStickyTop();
}

function renderSummaries() {
    const actualData = state.filteredData.filter((record) => !record.isProjected);
    const data = actualData.length > 0 ? actualData : state.filteredData;

    const totalMaterialIdentifiers = new Set();
    data.forEach((record, index) => {
        if (!record) return;
        const canonicalCode = getRecordCanonicalCode(record);
        const fallbackCode = sanitizeText(record.item_code).trim();
        const fallbackId = record.id ? sanitizeText(record.id).trim() : '';
        const identifier = canonicalCode
            || fallbackCode
            || (fallbackId ? `id:${fallbackId}` : `row-${index}`);
        totalMaterialIdentifiers.add(identifier);
    });
    const totalMaterialCount = totalMaterialIdentifiers.size;

    renderSummarySalesAccuracyCard(data);
    renderSummaryProductionAccuracyCard(data);

    if (dom.summary.monthContext) {
        const monthFilterValue = dom.filters && dom.filters.month ? dom.filters.month.value : 'all';
        let contextText;
        if (monthFilterValue && monthFilterValue !== 'all') {
            contextText = monthFilterValue;
        } else {
            // 필터가 '전체'일 때 시스템 현재월 표시
            const _now = new Date();
            contextText = _now.getFullYear() + '-' + String(_now.getMonth() + 1).padStart(2, '0');
        }
        dom.summary.monthContext.textContent = contextText;
    }

    if (data.length === 0) {
        dom.summary.inventoryAlert.textContent = '0개 / 0개';
        dom.summary.inventoryAlert.title = '재고 부족 0개 / 전체 자재 0개';
        if (dom.summary.inventoryShortageBreakdown) {
            dom.summary.inventoryShortageBreakdown.innerHTML = '<div class="summary-chip"><span class="label">카테고리 없음</span><span class="value">0개</span></div>';
        }
        if (dom.summary.overstock) {
            dom.summary.overstock.textContent = '0개';
        }
        if (dom.summary.inventoryOverstockBreakdown) {
            dom.summary.inventoryOverstockBreakdown.innerHTML = '<div class="summary-chip"><span class="label">과재고 없음</span><span class="value">-</span></div>';
        }
        dom.summary.capaAlert.textContent = '0개';
        dom.summary.totalProduction.textContent = '0 EA';
        dom.summary.avgCapa.textContent = '-';
        if (dom.summary.avgCapaBreakdown) {
            dom.summary.avgCapaBreakdown.innerHTML = '<div class="summary-chip"><span class="label">라인 없음</span><span class="value">데이터 없음</span></div>';
        }
        if (dom.summary.totalProductionBreakdown) {
            dom.summary.totalProductionBreakdown.innerHTML = '<div class="summary-chip"><span class="label">카테고리 없음</span><span class="value">0 EA</span></div>';
        }
        if (dom.summary.capaBreakdown) {
            dom.summary.capaBreakdown.innerHTML = '<div class="summary-chip"><span class="label">CAPA 초과 없음</span><span class="value">-</span></div>';
        }
        return;
    }

    const shortageCount = data.filter((record) => record.inventoryStatus && record.inventoryStatus.className === 'alert').length;
    const overstockCount = data.filter((record) => record.inventoryStatus && record.inventoryStatus.className === 'overstock').length;
    /* 총 생산계획 물량: 제외 카테고리(원단, 미지정) 적용 — 전역 EXCLUDED_CATEGORIES 사용 */
    const totalProduction = data.reduce((sum, record) => {
        if (isExcludedCategory(record.category)) return sum;
        return sum + (record.adjusted_production_plan ?? record.production_plan);
    }, 0);

    const shortageByCategory = new Map();
    const overstockByCategory = new Map();
    const categoryTotals = new Map();
    const lineCapaUsage = new Map();
    data.forEach((record) => {
        const categoryKey = sanitizeText(record.category).trim() || '미지정';
        if (!isExcludedCategory(record.category)) {
            categoryTotals.set(categoryKey, (categoryTotals.get(categoryKey) || 0) + (record.adjusted_production_plan ?? record.production_plan));
        }
        if (record.inventoryStatus && record.inventoryStatus.className === 'alert') {
            shortageByCategory.set(categoryKey, (shortageByCategory.get(categoryKey) || 0) + 1);
        } else if (record.inventoryStatus && record.inventoryStatus.className === 'overstock') {
            overstockByCategory.set(categoryKey, (overstockByCategory.get(categoryKey) || 0) + 1);
        }

        /* OEM·원단·미지정 카테고리는 CAPA 산정 대상에서 제외 */
        if (isExcludedCategory(record.category)) return;
        const lineUpperForCapa = sanitizeText(record.production_line).trim().toUpperCase();
        if (lineUpperForCapa.includes('OEM')) return;
        /* CAPA 대상 라인 화이트리스트 필터 */
        if (!isCapaTargetLine(record.production_line)) return;

        /* ── 라인별 CAPA 사용률 집계 (lineKey 기준, 중복 방지) ── */
        const lineKey = record.lineKey || null;
        if (lineKey && !lineCapaUsage.has(lineKey)) {
            const lineName = sanitizeText(record.production_line).trim() || '미지정';
            lineCapaUsage.set(lineKey, {
                lineName,
                ratio: Number.isFinite(record.lineCapacityRatio) ? record.lineCapacityRatio : null,
                totalProduction: Number.isFinite(record.lineTotalProduction) ? record.lineTotalProduction : null,
                capacityLimit: Number.isFinite(record.lineCapacityLimit) ? record.lineCapacityLimit : null,
            });
        }
    });

    const capaBreachesByLine = new Map();

    const uniqueLineRecords = new Map();
    data.forEach((record) => {
        if (!record.lineKey) return;
        /* OEM·원단·미지정 카테고리는 CAPA 산정 대상에서 제외 */
        if (isExcludedCategory(record.category)) return;
        const lineUpper = sanitizeText(record.production_line).trim().toUpperCase();
        if (lineUpper.includes('OEM')) return;
        /* CAPA 대상 라인 화이트리스트 필터 */
        if (!isCapaTargetLine(record.production_line)) return;
        if (!uniqueLineRecords.has(record.lineKey)) {
            uniqueLineRecords.set(record.lineKey, record);
        }
        const ratio = record.lineCapacityRatio;
        if (!Number.isFinite(ratio) || ratio <= 1) {
            return;
        }

        const monthLabel = sanitizeText(record.month).trim() || '-';
        const lineLabel = sanitizeText(record.production_line).trim() || '미지정';
        const baseKey = record.lineKeyBase
            || record.lineKey
            || getLineKey(record.production_line, record.month)
            || `${lineLabel}__${monthLabel}`;

        let entry = capaBreachesByLine.get(baseKey);
        if (!entry) {
            const initialProduction = Number.isFinite(record.lineTotalProduction)
                ? record.lineTotalProduction
                : toNumber(record.production_plan);
            const initialCapacity = Number.isFinite(record.lineCapacityLimit) && record.lineCapacityLimit > 0
                ? record.lineCapacityLimit
                : (Number.isFinite(record.capacity_limit) && record.capacity_limit > 0 ? record.capacity_limit : null);
            entry = {
                line: lineLabel,
                month: monthLabel,
                production: initialProduction,
                capacity: initialCapacity,
                ratioSamples: [],
                categories: new Set(),
            };
        }

        const candidateProduction = Number.isFinite(record.lineTotalProduction)
            ? record.lineTotalProduction
            : toNumber(record.production_plan);
        if (Number.isFinite(candidateProduction) && candidateProduction > entry.production) {
            entry.production = candidateProduction;
        }

        const candidateCapacity = Number.isFinite(record.lineCapacityLimit) && record.lineCapacityLimit > 0
            ? record.lineCapacityLimit
            : (Number.isFinite(record.capacity_limit) && record.capacity_limit > 0 ? record.capacity_limit : null);
        if (candidateCapacity !== null) {
            entry.capacity = candidateCapacity;
        }

        const categoryLabel = sanitizeText(record.lineCategory || record.category).trim();
        if (categoryLabel) {
            entry.categories.add(categoryLabel);
        }
        if (Number.isFinite(record.lineCapacityRatio)) {
            entry.ratioSamples.push(record.lineCapacityRatio);
        }

        capaBreachesByLine.set(baseKey, entry);
    });

    const capaBreachEntries = Array.from(capaBreachesByLine.values())
        .map((entry) => {
            const categories = entry.categories instanceof Set
                ? Array.from(entry.categories)
                    .filter((category) => category)
                    .sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)))
                : [];
            const capacity = Number.isFinite(entry.capacity) && entry.capacity > 0 ? entry.capacity : null;
            let ratio = null;
            if (capacity !== null && capacity > 0) {
                ratio = entry.production / capacity;
            } else if (entry.ratioSamples.length > 0) {
                const ratioSum = entry.ratioSamples.reduce((sum, value) => sum + value, 0);
                ratio = ratioSum / entry.ratioSamples.length;
            }
            const diff = capacity !== null ? entry.production - capacity : null;
            return {
                month: entry.month,
                line: entry.line,
                category: categories.length > 0 ? categories.join(' · ') : '',
                production: entry.production,
                capacity,
                ratio,
                diff,
            };
        })
        .filter((entry) => Number.isFinite(entry.ratio) && entry.ratio > 1);

    const lineRecords = Array.from(uniqueLineRecords.values());
    const capaAlertCount = capaBreachEntries.length;
    const ratios = lineRecords
        .filter((record) => Number.isFinite(record.lineCapacityRatio))
        .map((record) => record.lineCapacityRatio);
    const avgRatio = ratios.length > 0
        ? ratios.reduce((sum, value) => sum + value, 0) / ratios.length
        : null;

    const shortageSummaryText = `${shortageCount.toLocaleString('ko-KR')}개`;
    dom.summary.inventoryAlert.textContent = shortageSummaryText;
    dom.summary.inventoryAlert.title = `재고 부족 자재 ${shortageCount.toLocaleString('ko-KR')}개`;
    if (dom.summary.inventoryShortageBreakdown) {
        if (shortageByCategory.size === 0) {
            dom.summary.inventoryShortageBreakdown.innerHTML = '<div class="summary-chip"><span class="label">재고 부족 없음</span><span class="value">-</span></div>';
        } else {
            const fragment = document.createDocumentFragment();
            Array.from(shortageByCategory.entries())
                .sort((a, b) => b[1] - a[1] || sanitizeText(a[0]).localeCompare(sanitizeText(b[0])))
                .forEach(([category, count]) => {
                    const chip = document.createElement('div');
                    chip.className = 'summary-chip';
                    const label = document.createElement('span');
                    label.className = 'label';
                    label.textContent = category;
                    const value = document.createElement('span');
                    value.className = 'value';
                    value.textContent = `${count.toLocaleString('ko-KR')}개`;
                    chip.appendChild(label);
                    chip.appendChild(value);
                    fragment.appendChild(chip);
                });
            dom.summary.inventoryShortageBreakdown.innerHTML = '';
            dom.summary.inventoryShortageBreakdown.appendChild(fragment);
        }
    }
    if (dom.summary.inventoryOverstockBreakdown) {
        if (overstockByCategory.size === 0) {
            dom.summary.inventoryOverstockBreakdown.innerHTML = '<div class="summary-chip"><span class="label">과재고 없음</span><span class="value">-</span></div>';
        } else {
            const fragment = document.createDocumentFragment();
            Array.from(overstockByCategory.entries())
                .sort((a, b) => b[1] - a[1] || sanitizeText(a[0]).localeCompare(sanitizeText(b[0])))
                .forEach(([category, count]) => {
                    const chip = document.createElement('div');
                    chip.className = 'summary-chip';
                    const label = document.createElement('span');
                    label.className = 'label';
                    label.textContent = category;
                    const value = document.createElement('span');
                    value.className = 'value';
                    value.textContent = `${count.toLocaleString('ko-KR')}개`;
                    chip.appendChild(label);
                    chip.appendChild(value);
                    fragment.appendChild(chip);
                });
            dom.summary.inventoryOverstockBreakdown.innerHTML = '';
            dom.summary.inventoryOverstockBreakdown.appendChild(fragment);
        }
    }
    if (dom.summary.overstock) {
        dom.summary.overstock.textContent = `${overstockCount.toLocaleString('ko-KR')}개`;
    }
    dom.summary.capaAlert.textContent = `${capaAlertCount.toLocaleString('ko-KR')}개`;
    dom.summary.totalProduction.textContent = `${formatNumber(totalProduction)} EA`;
    dom.summary.avgCapa.textContent = avgRatio !== null ? formatPercent(avgRatio) : '-';

    if (dom.summary.totalProductionBreakdown) {
        if (categoryTotals.size === 0) {
            dom.summary.totalProductionBreakdown.innerHTML = '<div class="summary-chip"><span class="label">카테고리 없음</span><span class="value">0 EA</span></div>';
        } else {
            const fragment = document.createDocumentFragment();
            Array.from(categoryTotals.entries())
                .sort((a, b) => sanitizeText(a[0]).localeCompare(sanitizeText(b[0])))
                .forEach(([category, amount]) => {
                    const chip = document.createElement('div');
                    chip.className = 'summary-chip';
                    const label = document.createElement('span');
                    label.className = 'label';
                    label.textContent = category;
                    const value = document.createElement('span');
                    value.className = 'value';
                    value.textContent = `${formatNumber(amount)} EA`;
                    chip.appendChild(label);
                    chip.appendChild(value);
                    fragment.appendChild(chip);
                });
            dom.summary.totalProductionBreakdown.innerHTML = '';
            dom.summary.totalProductionBreakdown.appendChild(fragment);
        }
    }

    if (dom.summary.avgCapaBreakdown) {
        if (lineCapaUsage.size === 0) {
            dom.summary.avgCapaBreakdown.innerHTML = '<div class="summary-chip"><span class="label">라인 없음</span><span class="value">데이터 없음</span></div>';
        } else {
            const fragment = document.createDocumentFragment();
            Array.from(lineCapaUsage.values())
                .sort((a, b) => {
                    /* 사용률 있는 라인 우선, 그 안에서 사용률 내림차순, 동률이면 이름순 */
                    const aHas = Number.isFinite(a.ratio) ? 0 : 1;
                    const bHas = Number.isFinite(b.ratio) ? 0 : 1;
                    if (aHas !== bHas) return aHas - bHas;
                    if (aHas === 0 && bHas === 0) {
                        if (b.ratio !== a.ratio) return b.ratio - a.ratio;
                    }
                    return sanitizeText(a.lineName).localeCompare(sanitizeText(b.lineName));
                })
                .forEach((stats) => {
                    const chip = document.createElement('div');
                    chip.className = 'summary-chip stacked';
                    const label = document.createElement('span');
                    label.className = 'label';
                    const ratioText = Number.isFinite(stats.ratio) ? formatPercent(stats.ratio) : '데이터 없음';
                    label.textContent = `${stats.lineName} (${ratioText})`;
                    if (Number.isFinite(stats.ratio) && stats.ratio > 1) {
                        label.classList.add('over-capacity');
                    }
                    const value = document.createElement('span');
                    value.className = 'value';
                    const detailParts = [];
                    if (Number.isFinite(stats.totalProduction)) {
                        detailParts.push(`총생산 ${formatNumber(stats.totalProduction)}`);
                    }
                    if (Number.isFinite(stats.capacityLimit) && stats.capacityLimit > 0) {
                        detailParts.push(`CAPA ${formatNumber(stats.capacityLimit)}`);
                    } else {
                        detailParts.push('CAPA 미설정');
                    }
                    value.textContent = detailParts.join(' / ');
                    chip.appendChild(label);
                    chip.appendChild(value);
                    fragment.appendChild(chip);
                });
            dom.summary.avgCapaBreakdown.innerHTML = '';
            dom.summary.avgCapaBreakdown.appendChild(fragment);
        }
    }

    if (dom.summary.capaBreakdown) {
        if (capaBreachEntries.length === 0) {
            dom.summary.capaBreakdown.innerHTML = '<div class="summary-chip"><span class="label">CAPA 초과 없음</span><span class="value">-</span></div>';
        } else {
            const fragment = document.createDocumentFragment();
            capaBreachEntries
                .slice()
                .sort((a, b) => {
                    const monthCompare = sanitizeText(a.month).localeCompare(sanitizeText(b.month));
                    if (monthCompare !== 0) return monthCompare;
                    const categoryCompare = sanitizeText(a.category).localeCompare(sanitizeText(b.category));
                    if (categoryCompare !== 0) return categoryCompare;
                    return sanitizeText(a.line).localeCompare(sanitizeText(b.line));
                })
                .forEach((entry) => {
                    const chip = document.createElement('div');
                    chip.className = 'summary-chip stacked';
                    const label = document.createElement('span');
                    label.className = 'label';
                    const monthLabel = entry.month || '-';
                    const categoryLabel = entry.category ? `${entry.category} ` : '';
                    label.textContent = `${monthLabel} · ${categoryLabel}${entry.line}`;
                    if (Number.isFinite(entry.ratio) && entry.ratio > 1) {
                        label.classList.add('over-capacity');
                    }
                    const value = document.createElement('span');
                    value.className = 'value';
                    const detailParts = [];
                    if (entry.diff !== null) {
                        detailParts.push(`초과 ${entry.diff > 0 ? '+' : ''}${formatNumber(entry.diff)} EA`);
                    }
                    if (Number.isFinite(entry.ratio)) {
                        detailParts.push(`사용률 ${formatPercent(entry.ratio)}`);
                    }
                    if (detailParts.length === 0) {
                        detailParts.push('상세 정보 없음');
                    }
                    const [firstDetail, ...restDetails] = detailParts;
                    value.textContent = firstDetail || '';
                    restDetails.forEach((detail) => {
                        value.appendChild(document.createElement('br'));
                        value.appendChild(document.createTextNode(detail));
                    });
                    chip.appendChild(label);
                    chip.appendChild(value);
                    fragment.appendChild(chip);
                });
            dom.summary.capaBreakdown.innerHTML = '';
            dom.summary.capaBreakdown.appendChild(fragment);
        }
    }
}

function renderSummarySalesAccuracyCard(records) {
    renderSummaryAccuracyCard(records, selectSummarySalesAccuracy, {
        valueElement: dom.summary ? dom.summary.salesAccuracy : null,
        captionElement: dom.summary ? dom.summary.salesAccuracyCaption : null,
        breakdownContainer: dom.summary ? dom.summary.salesAccuracyBreakdown : null,
    });
}

function renderSummaryProductionAccuracyCard(records) {
    renderSummaryAccuracyCard(records, selectSummaryProductionAccuracy, {
        valueElement: dom.summary ? dom.summary.productionAccuracy : null,
        captionElement: dom.summary ? dom.summary.productionAccuracyCaption : null,
        breakdownContainer: dom.summary ? dom.summary.productionAccuracyBreakdown : null,
    });
}

function renderSummaryAccuracyCard(records, summarySelector, targets = {}) {
    const { valueElement, captionElement, breakdownContainer } = targets;
    if (!valueElement && !captionElement && !breakdownContainer) {
        return;
    }

    const normalizedRecords = Array.isArray(records) ? records : [];
    const monthFilterRaw = dom.filters && dom.filters.month ? dom.filters.month.value : 'all';
    const monthFilterValue = sanitizeText(monthFilterRaw).trim() || 'all';
    const baseMonthSelect = dom.dashboard && dom.dashboard.baseMonth ? dom.dashboard.baseMonth : null;
    const baseMonthValue = baseMonthSelect
        ? sanitizeText(baseMonthSelect.dataset.selectedMonth || baseMonthSelect.value).trim()
        : '';
    const baseMonthManual = baseMonthSelect ? baseMonthSelect.dataset.manualSelection === 'true' : false;

    const summary = typeof summarySelector === 'function'
        ? summarySelector(normalizedRecords, {
            monthFilter: monthFilterValue,
            baseMonth: baseMonthValue,
            baseMonthManual,
        })
        : createEmptyAccuracySummary();

    const metricLabel = summary.metricLabel || '';
    const captionBase = metricLabel ? `${metricLabel} 계획 대비 실적` : '계획 대비 실적';

    if (valueElement) {
        valueElement.textContent = Number.isFinite(summary.averageRatio)
            ? formatPercent(summary.averageRatio, 1)
            : '-';
    }

    if (captionElement) {
        if (summary.mode === 'aggregate') {
            captionElement.textContent = `전체 기간 ${captionBase} 평균`;
        } else if (summary.month) {
            const label = formatMonthToKoreanLabel(summary.month) || summary.month;
            captionElement.textContent = `${label} ${captionBase} 평균`;
        } else {
            captionElement.textContent = `${captionBase} 평균`;
        }
    }

    if (breakdownContainer) {
        breakdownContainer.innerHTML = '';
        if (!summary.breakdown || summary.breakdown.length === 0) {
            const chip = document.createElement('div');
            chip.className = 'summary-chip';
            const label = document.createElement('span');
            label.className = 'label';
            label.textContent = '카테고리 없음';
            const value = document.createElement('span');
            value.className = 'value';
            value.textContent = summary.mode === 'aggregate' ? '전체 기간 데이터 없음' : '데이터 없음';
            chip.appendChild(label);
            chip.appendChild(value);
            breakdownContainer.appendChild(chip);
        } else {
            const fragment = document.createDocumentFragment();
            summary.breakdown.forEach((item) => {
                const chip = document.createElement('div');
                chip.className = 'summary-chip';
                const label = document.createElement('span');
                label.className = 'label';
                label.textContent = item.category;
                const value = document.createElement('span');
                value.className = 'value';
                if (item.statusClass) {
                    value.classList.add(item.statusClass);
                }
                value.textContent = item.text;
                chip.appendChild(label);
                chip.appendChild(value);
                fragment.appendChild(chip);
            });
            breakdownContainer.appendChild(fragment);
        }
    }
}

function createEmptyAccuracySummary(options = {}) {
    const {
        mode = 'month',
        month = '',
        metric = 'sales',
        metricLabel = metric === 'production' ? '생산' : '판매',
    } = options || {};

    return {
        month: sanitizeText(month).trim(),
        totalPlan: 0,
        totalActual: 0,
        averageRatio: null,
        breakdown: [],
        mode,
        metric,
        metricLabel,
    };
}

function selectSummarySalesAccuracy(records, options = {}) {
    return selectSummaryAccuracy(records, {
        planField: 'sales_plan',
        actualField: 'sales_actual',
        metric: 'sales',
        metricLabel: '판매',
        ...options,
    });
}

function selectSummaryProductionAccuracy(records, options = {}) {
    return selectSummaryAccuracy(records, {
        planField: 'adjusted_production_plan',
        actualField: 'production_actual',
        metric: 'production',
        metricLabel: '생산',
        ...options,
    });
}

function selectSummaryAccuracy(records, config = {}) {
    const normalizedRecords = Array.isArray(records) ? records : [];
    const {
        planField = 'sales_plan',
        actualField = 'sales_actual',
        metric = 'sales',
        metricLabel = metric === 'production' ? '생산' : '판매',
        monthFilter,
        baseMonth,
        baseMonthManual,
    } = config || {};

    const monthFilterRaw = monthFilter !== undefined
        ? monthFilter
        : (dom.filters && dom.filters.month ? dom.filters.month.value : 'all');
    const normalizedMonthFilter = sanitizeText(monthFilterRaw).trim() || 'all';

    const baseMonthValueRaw = baseMonth !== undefined
        ? baseMonth
        : (() => {
            const baseMonthSelect = dom.dashboard && dom.dashboard.baseMonth ? dom.dashboard.baseMonth : null;
            return baseMonthSelect ? (baseMonthSelect.dataset.selectedMonth || baseMonthSelect.value) : '';
        })();
    const normalizedBaseMonth = sanitizeText(baseMonthValueRaw).trim();

    const manualSelection = baseMonthManual !== undefined
        ? Boolean(baseMonthManual)
        : (() => {
            const baseMonthSelect = dom.dashboard && dom.dashboard.baseMonth ? dom.dashboard.baseMonth : null;
            return baseMonthSelect ? baseMonthSelect.dataset.manualSelection === 'true' : false;
        })();

    if (normalizedRecords.length === 0) {
        return createEmptyAccuracySummary({
            mode: normalizedMonthFilter === 'all' && !manualSelection ? 'aggregate' : 'month',
            metric,
            metricLabel,
        });
    }

    const preferAggregate = (normalizedMonthFilter === 'all' || normalizedMonthFilter === '')
        && !manualSelection;

    const computeConfig = {
        planField,
        actualField,
        metric,
        metricLabel,
    };

    if (preferAggregate) {
        const aggregateSummary = computeSummaryAccuracyOverall(normalizedRecords, computeConfig);
        if (aggregateSummary.totalPlan > 0) {
            return aggregateSummary;
        }
    }

    const candidates = buildSummaryAccuracyCandidateMonths(normalizedRecords, {
        monthFilter: normalizedMonthFilter,
        baseMonth: normalizedBaseMonth,
        baseMonthManual: manualSelection,
    });

    if (candidates.length === 0) {
        return preferAggregate
            ? computeSummaryAccuracyOverall(normalizedRecords, computeConfig)
            : createEmptyAccuracySummary({ mode: 'month', metric, metricLabel });
    }

    for (let index = 0; index < candidates.length; index += 1) {
        const candidate = candidates[index];
        const summary = computeSummaryAccuracyForMonth(normalizedRecords, candidate, computeConfig);
        if (summary.totalPlan > 0) {
            return summary;
        }
    }

    return computeSummaryAccuracyForMonth(normalizedRecords, candidates[0], computeConfig);
}

function buildSummaryAccuracyCandidateMonths(records, options = {}) {
    const candidates = [];
    const monthFilterRaw = options.monthFilter !== undefined
        ? options.monthFilter
        : (dom.filters && dom.filters.month ? dom.filters.month.value : 'all');
    const normalizedFilterMonth = sanitizeText(monthFilterRaw).trim();

    if (normalizedFilterMonth && normalizedFilterMonth !== 'all') {
        candidates.push(normalizedFilterMonth);
    }

    let baseMonthValue = '';
    let manualSelection = false;

    if (options.baseMonth !== undefined) {
        baseMonthValue = sanitizeText(options.baseMonth).trim();
        manualSelection = Boolean(options.baseMonthManual);
    } else {
        const baseMonthSelect = dom.dashboard && dom.dashboard.baseMonth ? dom.dashboard.baseMonth : null;
        if (baseMonthSelect) {
            baseMonthValue = sanitizeText(baseMonthSelect.dataset.selectedMonth || baseMonthSelect.value).trim();
            manualSelection = baseMonthSelect.dataset.manualSelection === 'true';
        }
    }

    if (baseMonthValue) {
        if (manualSelection) {
            candidates.push(baseMonthValue);
        } else if (!normalizedFilterMonth || normalizedFilterMonth === 'all') {
            candidates.push(baseMonthValue);
        }
    }

    const months = getUniqueMonthsFromRecords(records);
    for (let index = months.length - 1; index >= 0; index -= 1) {
        candidates.push(sanitizeText(months[index]).trim());
    }

    const seen = new Set();
    return candidates
        .map((month) => sanitizeText(month).trim())
        .filter((month) => {
            if (!month) return false;
            if (seen.has(month)) return false;
            seen.add(month);
            return true;
        });
}

function computeSummaryAccuracyOverall(records, config = {}) {
    const {
        planField = 'sales_plan',
        actualField = 'sales_actual',
        metric = 'sales',
        metricLabel = metric === 'production' ? '생산' : '판매',
    } = config || {};

    const summary = createEmptyAccuracySummary({ mode: 'aggregate', metric, metricLabel });

    if (!Array.isArray(records) || records.length === 0) {
        return summary;
    }

    const perCategory = new Map();

    records.forEach((record) => {
        if (!record) return;
        const plan = parseNumberOrNull(record ? record[planField] : null);
        if (!Number.isFinite(plan) || plan <= 0) {
            return;
        }
        const actual = parseNumberOrNull(record ? record[actualField] : null);
        const category = sanitizeText(record.category).trim() || '미분류';

        if (!perCategory.has(category)) {
            perCategory.set(category, {
                plan: 0,
                actual: 0,
            });
        }

        const entry = perCategory.get(category);
        entry.plan += plan;
        if (Number.isFinite(actual)) {
            entry.actual += actual;
        }

        summary.totalPlan += plan;
        if (Number.isFinite(actual)) {
            summary.totalActual += actual;
        }
    });

    summary.averageRatio = computeAccuracyRatio(summary.totalPlan, summary.totalActual);

    summary.breakdown = Array.from(perCategory.entries())
        .map(([category, value]) => {
            const ratio = computeAccuracyRatio(value.plan, value.actual);
            const status = classifyAccuracyRatio(ratio);
            const statusClass = status === 'good' || status === 'low' || status === 'high'
                ? `accuracy-${status}`
                : '';
            return {
                category,
                ratio,
                statusClass,
                text: Number.isFinite(ratio) ? formatPercent(ratio, 1) : '-',
                plan: value.plan,
            };
        })
        .sort((a, b) => {
            const ratioA = Number.isFinite(a.ratio) ? a.ratio : -Infinity;
            const ratioB = Number.isFinite(b.ratio) ? b.ratio : -Infinity;
            if (ratioB !== ratioA) {
                return ratioB - ratioA;
            }
            return sanitizeText(a.category).localeCompare(sanitizeText(b.category));
        });

    return summary;
}

function computeSummaryAccuracyForMonth(records, month, config = {}) {
    const {
        planField = 'sales_plan',
        actualField = 'sales_actual',
        metric = 'sales',
        metricLabel = metric === 'production' ? '생산' : '판매',
    } = config || {};

    const normalizedMonth = sanitizeText(month).trim();
    const summary = createEmptyAccuracySummary({
        mode: 'month',
        month: normalizedMonth,
        metric,
        metricLabel,
    });

    if (!normalizedMonth || !Array.isArray(records) || records.length === 0) {
        return summary;
    }

    const perCategory = new Map();

    records.forEach((record) => {
        if (!record) return;
        const recordMonth = sanitizeText(record.month).trim();
        if (recordMonth !== normalizedMonth) return;

        const plan = parseNumberOrNull(record ? record[planField] : null);
        const actual = parseNumberOrNull(record ? record[actualField] : null);

        if (!Number.isFinite(plan) || plan <= 0) {
            return;
        }

        const category = sanitizeText(record.category).trim() || '미분류';

        if (!perCategory.has(category)) {
            perCategory.set(category, {
                plan: 0,
                actual: 0,
            });
        }

        const entry = perCategory.get(category);
        entry.plan += plan;
        if (Number.isFinite(actual)) {
            entry.actual += actual;
        }

        summary.totalPlan += plan;
        if (Number.isFinite(actual)) {
            summary.totalActual += actual;
        }
    });

    summary.averageRatio = computeAccuracyRatio(summary.totalPlan, summary.totalActual);

    summary.breakdown = Array.from(perCategory.entries())
        .map(([category, value]) => {
            const ratio = computeAccuracyRatio(value.plan, value.actual);
            const status = classifyAccuracyRatio(ratio);
            const statusClass = status === 'good' || status === 'low' || status === 'high'
                ? `accuracy-${status}`
                : '';
            return {
                category,
                ratio,
                statusClass,
                text: Number.isFinite(ratio) ? formatPercent(ratio, 1) : '-',
                plan: value.plan,
            };
        })
        .sort((a, b) => {
            const ratioA = Number.isFinite(a.ratio) ? a.ratio : -Infinity;
            const ratioB = Number.isFinite(b.ratio) ? b.ratio : -Infinity;
            if (ratioB !== ratioA) {
                return ratioB - ratioA;
            }
            return sanitizeText(a.category).localeCompare(sanitizeText(b.category));
        });

    return summary;
}

// -------------------- 적정 재고 관리 --------------------
function buildOptimalInventoryDataset(records, months, options = {}) {
    const monthList = Array.isArray(months) ? months : [];
    const monthIndex = new Map(monthList.map((value, index) => [value, index]));
    const categoryMap = new Map();
    const fallbackBaselineStats = new Map();
    const totals = monthList.map(() => ({ actual: 0, target: 0 }));
    const baselineMap = options && options.baselineMap instanceof Map ? options.baselineMap : new Map();
    const baselineYear = options && options.baselineYear ? sanitizeText(options.baselineYear).trim() : '';

    let baselineSum = 0;
    let baselineCount = 0;
    let explicitCount = 0;
    let fallbackCount = 0;

    /* ── SKU별 적정재고 합산: 카테고리별 고정값 계산 ──
       전체 enrichedData에서 각 SKU(item_code)의 target_ending_inventory를
       카테고리별로 합산하여, 모든 월에 동일한 목표월말재고를 표시한다. */
    const skuTargetByCategoryMap = new Map();
    const allRecords = Array.isArray(state.enrichedData) ? state.enrichedData : [];
    const skuLatestTarget = new Map(); // key: item_code, value: { category, target }
    allRecords.forEach((record) => {
        if (!record) return;
        const itemCode = sanitizeText(record.item_code).trim();
        if (!itemCode) return;
        const categoryKey = sanitizeText(record.category).trim() || '미지정';
        const targetVal = Number.isFinite(record.target_ending_inventory) ? record.target_ending_inventory : null;
        if (targetVal === null) return;
        const existing = skuLatestTarget.get(itemCode);
        if (!existing) {
            skuLatestTarget.set(itemCode, { category: categoryKey, target: targetVal });
        } else {
            // 같은 SKU에 대해 최신 값으로 갱신 (이미 같은 값이면 유지)
            existing.target = targetVal;
        }
    });
    skuLatestTarget.forEach(({ category, target }) => {
        const current = skuTargetByCategoryMap.get(category) || 0;
        skuTargetByCategoryMap.set(category, current + target);
    });

    /* ── 월말마감 확정 데이터가 있는 월 판별 ──
       state.monthlyClosingByMonth에 해당 월이 존재하면 = 마감 확정된 과거월
       → ending_inventory는 monthlyClosingIndex에서 확정값 사용
       마감되지 않은 월(현재/미래) → 기존 계산식(enriched ending_inventory) 사용 */
    const closingByMonth = state.monthlyClosingByMonth instanceof Map ? state.monthlyClosingByMonth : new Map();
    const closingIndex = state.monthlyClosingIndex instanceof Map ? state.monthlyClosingIndex : new Map();

    /* 과거 확정월: monthlyClosingByMonth에서 hierarchy_name(카테고리)별로 ending_inventory 합산 */
    const confirmedMonths = new Set(closingByMonth.keys());

    (Array.isArray(records) ? records : []).forEach((record) => {
        if (!record) return;
        const month = sanitizeText(record.month).trim();
        if (!monthIndex.has(month)) return;
        const index = monthIndex.get(month);
        if (index === undefined) return;

        const categoryKey = sanitizeText(record.category).trim() || '미지정';
        const itemCode = sanitizeText(record.item_code).trim();

        /* 과거 확정월이면 monthly_closings 테이블의 확정 ending_inventory 사용,
           그렇지 않으면 기존 계산식(enriched ending_inventory) 사용 */
        let endingValue;
        if (confirmedMonths.has(month) && itemCode) {
            const closingKey = `${itemCode}|${month}`;
            const closingRecord = closingIndex.get(closingKey);
            if (closingRecord && Number.isFinite(closingRecord.ending_inventory)) {
                endingValue = closingRecord.ending_inventory;
            } else {
                endingValue = Number.isFinite(record.ending_inventory) ? record.ending_inventory : 0;
            }
        } else {
            endingValue = Number.isFinite(record.ending_inventory) ? record.ending_inventory : 0;
        }
        const recordBaselineValue = Number.isFinite(record.optimal_inventory_2025)
            ? record.optimal_inventory_2025
            : null;

        if (!categoryMap.has(categoryKey)) {
            categoryMap.set(categoryKey, monthList.map(() => ({ actual: 0, target: 0 })));
        }
        const categoryValues = categoryMap.get(categoryKey);
        categoryValues[index].actual += endingValue;

        totals[index].actual += endingValue;

        if (recordBaselineValue !== null) {
            const stats = fallbackBaselineStats.get(categoryKey) ?? { total: 0, count: 0 };
            stats.total += recordBaselineValue;
            stats.count += 1;
            fallbackBaselineStats.set(categoryKey, stats);
        }
    });

    /* 월말마감 테이블에만 있고 enrichedData에는 없는 과거 확정 데이터도 반영 */
    confirmedMonths.forEach((month) => {
        if (!monthIndex.has(month)) return;
        const index = monthIndex.get(month);
        const closingRecords = closingByMonth.get(month) || [];
        closingRecords.forEach((mc) => {
            const itemCode = sanitizeText(mc.item_code).trim();
            if (!itemCode) return;
            /* enrichedData에 이미 해당 item_code + month가 있으면 위에서 처리됨 → 스킵 */
            const alreadyProcessed = (Array.isArray(records) ? records : []).some((r) => {
                return sanitizeText(r.item_code).trim() === itemCode && sanitizeText(r.month).trim() === month;
            });
            if (alreadyProcessed) return;

            const categoryKey = sanitizeText(mc.hierarchy_name).trim() || '미지정';
            const endingValue = Number.isFinite(mc.ending_inventory) ? mc.ending_inventory : 0;

            if (!categoryMap.has(categoryKey)) {
                categoryMap.set(categoryKey, monthList.map(() => ({ actual: 0, target: 0 })));
            }
            const categoryValues = categoryMap.get(categoryKey);
            categoryValues[index].actual += endingValue;
            totals[index].actual += endingValue;
        });
    });

    /* 카테고리별 SKU 적정재고 합을 모든 월에 동일하게 적용 */
    categoryMap.forEach((values, categoryKey) => {
        const categoryTargetSum = skuTargetByCategoryMap.get(categoryKey) || 0;
        values.forEach((v) => {
            v.target = categoryTargetSum;
        });
    });

    /* 합계행(totals)의 target도 카테고리별 적정재고 합의 전체 합으로 설정 */
    let totalTargetSum = 0;
    categoryMap.forEach((_, categoryKey) => {
        totalTargetSum += (skuTargetByCategoryMap.get(categoryKey) || 0);
    });
    totals.forEach((t) => {
        t.target = totalTargetSum;
    });

    const categories = Array.from(categoryMap.entries())
        .sort((a, b) => sanitizeText(a[0]).localeCompare(sanitizeText(b[0])))
        .map(([category, values]) => {
            const normalizedCategory = sanitizeText(category).trim() || '미지정';
            const explicitBaseline = baselineMap.has(normalizedCategory)
                ? baselineMap.get(normalizedCategory)
                : null;
            let baselineValue = Number.isFinite(explicitBaseline) ? explicitBaseline : null;
            let baselineSource = 'missing';

            if (baselineValue !== null) {
                baselineSource = 'explicit';
            } else {
                const fallbackStats = fallbackBaselineStats.get(normalizedCategory);
                if (fallbackStats && fallbackStats.count > 0) {
                    baselineValue = fallbackStats.total / fallbackStats.count;
                    baselineSource = 'fallback';
                }
            }

            if (Number.isFinite(baselineValue)) {
                baselineSum += baselineValue;
                baselineCount += 1;
                if (baselineSource === 'explicit') {
                    explicitCount += 1;
                } else if (baselineSource === 'fallback') {
                    fallbackCount += 1;
                }
            }

            return { category: normalizedCategory, values, baseline: baselineValue, baselineSource };
        });

    const baselineAverage = baselineCount > 0 ? baselineSum / baselineCount : null;
    const baselineTotal = baselineCount > 0 ? baselineSum : null;

    return {
        categories,
        totals,
        baselineAverage,
        baselineTotal,
        baselineYear,
        baselineSources: {
            explicit: explicitCount,
            fallback: fallbackCount,
        },
    };
}

function renderOptimalInventoryTable(dataset, months, highlightMonth = '') {
    if (!dom.optimalInventory) return;
    const { headerRow, subHeaderRow, body, totalRow, table, empty } = dom.optimalInventory;

    const monthList = Array.isArray(months) ? months : [];
    const highlightValue = sanitizeText(highlightMonth).trim();
    const hasHighlight = highlightValue && monthList.includes(highlightValue);
    const hasData = Array.isArray(dataset.categories)
        && dataset.categories.length > 0
        && monthList.length > 0;
    const baselineYearValue = sanitizeText(dataset && dataset.baselineYear ? dataset.baselineYear : '').trim();
    const baselineYearLabel = baselineYearValue ? `${baselineYearValue}년` : '';
    const baselineTitleLabel = baselineYearLabel ? `${baselineYearLabel} 적정재고` : '적정재고';

    if (headerRow) {
        while (headerRow.children.length > 2) {
            headerRow.removeChild(headerRow.lastChild);
        }
        monthList.forEach((month, index) => {
            const th = document.createElement('th');
            const monthClass = index % 2 === 0 ? 'optimal-month-even' : 'optimal-month-odd';
            th.colSpan = 3;
            th.scope = 'colgroup';
            th.textContent = month;
            th.classList.add('optimal-month-group', monthClass);
            if (index > 0) {
                th.classList.add('optimal-month-divider');
            }
            th.dataset.monthIndex = String(index);
            if (hasHighlight && month === highlightValue) {
                th.classList.add('optimal-month-highlight');
            }
            headerRow.appendChild(th);
        });
    }

    if (subHeaderRow) {
        subHeaderRow.innerHTML = '';
        const diffHeaderLabel = '적정재고 대비 증감(BOX)';
        const diffHeaderTitle = baselineYearValue
            ? `${baselineYearValue}년 등록된 적정재고 기준 대비 실제 월말 재고 차이를 나타냅니다.`
            : '등록된 적정재고 기준 대비 실제 월말 재고 차이를 나타냅니다.';
        monthList.forEach((month, index) => {
            const monthClass = index % 2 === 0 ? 'optimal-month-even' : 'optimal-month-odd';
            const isHighlight = hasHighlight && month === highlightValue;

            const actualTh = document.createElement('th');
            actualTh.scope = 'col';
            actualTh.textContent = '월말 재고(BOX)';
            actualTh.classList.add('optimal-month-header', 'optimal-month-actual', monthClass);
            if (index > 0) {
                actualTh.classList.add('optimal-month-divider');
            }
            actualTh.dataset.monthIndex = String(index);
            if (isHighlight) {
                actualTh.classList.add('optimal-month-highlight');
            }

            const targetTh = document.createElement('th');
            targetTh.scope = 'col';
            targetTh.textContent = '적정재고(BOX)';
            targetTh.classList.add('optimal-month-header', 'optimal-month-target', monthClass, 'optimal-month-subdivider');
            targetTh.dataset.monthIndex = String(index);
            if (isHighlight) {
                targetTh.classList.add('optimal-month-highlight');
            }

            const diffTh = document.createElement('th');
            diffTh.scope = 'col';
            diffTh.textContent = diffHeaderLabel;
            diffTh.title = diffHeaderTitle;
            diffTh.classList.add('optimal-month-header', 'optimal-month-diff', monthClass, 'optimal-month-diff-divider');
            diffTh.dataset.monthIndex = String(index);
            if (isHighlight) {
                diffTh.classList.add('optimal-month-highlight');
            }

            subHeaderRow.appendChild(actualTh);
            subHeaderRow.appendChild(targetTh);
            subHeaderRow.appendChild(diffTh);
        });
    }

    if (body) {
        body.innerHTML = '';
        if (hasData) {
            const fragment = document.createDocumentFragment();

            dataset.categories.forEach((entry) => {
                const row = document.createElement('tr');
                const categoryCell = document.createElement('td');
                categoryCell.textContent = entry.category || '미지정';
                row.appendChild(categoryCell);

                const baselineCell = document.createElement('td');
                baselineCell.className = 'optimal-baseline-value';
                if (Number.isFinite(entry.baseline)) {
                    baselineCell.textContent = formatNumber(entry.baseline, '0');
                    if (entry.baselineSource === 'explicit') {
                        baselineCell.classList.add('optimal-baseline-explicit');
                        baselineCell.title = baselineYearLabel
                            ? `${baselineYearLabel} 등록 기준값입니다.`
                            : '등록된 적정재고 기준값입니다.';
                    } else if (entry.baselineSource === 'fallback') {
                        baselineCell.classList.add('optimal-baseline-fallback');
                        baselineCell.title = 'SNOP 데이터 평균으로 계산된 적정재고 참고값입니다.';
                    } else {
                        baselineCell.title = '적정재고 기준값을 확인할 수 없습니다.';
                    }
                } else {
                    baselineCell.textContent = '-';
                    baselineCell.classList.add('optimal-baseline-missing');
                    baselineCell.title = '카테고리에 대한 적정재고 기준값이 등록되지 않았습니다.';
                }
                row.appendChild(baselineCell);

                entry.values.forEach((value, monthIndex) => {
                    const monthClass = monthIndex % 2 === 0 ? 'optimal-month-even' : 'optimal-month-odd';
                    const monthLabel = monthList[monthIndex];
                    const isHighlight = hasHighlight && monthLabel === highlightValue;
                    const actualValue = Number.isFinite(value.actual) ? value.actual : 0;
                    const targetValue = Number.isFinite(value.target) ? value.target : 0;
                    const baselineValue = Number.isFinite(entry.baseline) ? entry.baseline : null;
                    const diffValue = actualValue - targetValue;

                    const actualCell = document.createElement('td');
                    actualCell.className = 'optimal-value-actual';
                    actualCell.classList.add('optimal-month-cell', 'optimal-month-actual', monthClass);
                    if (monthIndex > 0) {
                        actualCell.classList.add('optimal-month-divider');
                    }
                    actualCell.dataset.monthIndex = String(monthIndex);
                    actualCell.textContent = formatNumber(actualValue, '0');
                    if (isHighlight) {
                        actualCell.classList.add('optimal-month-highlight');
                    }
                    row.appendChild(actualCell);

                    const targetCell = document.createElement('td');
                    targetCell.className = 'optimal-value-target';
                    targetCell.classList.add('optimal-month-cell', 'optimal-month-target', monthClass, 'optimal-month-subdivider');
                    targetCell.dataset.monthIndex = String(monthIndex);
                    targetCell.textContent = formatNumber(targetValue, '0');
                    if (isHighlight) {
                        targetCell.classList.add('optimal-month-highlight');
                    }
                    row.appendChild(targetCell);

                    const diffCell = document.createElement('td');
                    diffCell.className = 'optimal-value-diff';
                    diffCell.classList.add('optimal-month-cell', 'optimal-month-diff', monthClass, 'optimal-month-diff-divider');
                    diffCell.dataset.monthIndex = String(monthIndex);
                    diffCell.textContent = formatSignedNumber(diffValue, '0');
                    if (diffValue > 0) {
                        diffCell.classList.add('optimal-diff-positive');
                        diffCell.title = `적정재고 대비 초과 ${formatSignedNumber(diffValue, '0')} (월말재고 ${formatNumber(actualValue, '0')} BOX - 적정재고 ${formatNumber(targetValue, '0')} BOX)`;
                    } else if (diffValue < 0) {
                        diffCell.classList.add('optimal-diff-negative');
                        diffCell.title = `적정재고 대비 부족 ${formatSignedNumber(diffValue, '0')} (월말재고 ${formatNumber(actualValue, '0')} BOX - 적정재고 ${formatNumber(targetValue, '0')} BOX)`;
                    } else {
                        diffCell.classList.add('optimal-diff-zero');
                        diffCell.title = `적정재고와 월말재고가 동일`;
                    }
                    if (isHighlight) {
                        diffCell.classList.add('optimal-month-highlight');
                    }
                    row.appendChild(diffCell);
                });

                fragment.appendChild(row);
            });
            body.appendChild(fragment);
        }
    }

    if (totalRow) {
        totalRow.innerHTML = '';
        if (hasData) {
            totalRow.classList.remove('hidden');
            const labelCell = document.createElement('td');
            labelCell.textContent = '합계';
            totalRow.appendChild(labelCell);

            const baselineCell = document.createElement('td');
            baselineCell.className = 'optimal-baseline-total';
            const baselineTotalValue = Number.isFinite(dataset.baselineTotal) ? dataset.baselineTotal : null;
            const baselineAverageValue = Number.isFinite(dataset.baselineAverage) ? dataset.baselineAverage : null;
            const { baselineSources = {} } = dataset;
            const explicitCount = Number(baselineSources.explicit) || 0;
            const fallbackCount = Number(baselineSources.fallback) || 0;
            if (baselineTotalValue !== null) {
                baselineCell.textContent = formatNumber(baselineTotalValue, '0');
                const sourceSummaryParts = [];
                if (explicitCount > 0 && fallbackCount > 0) {
                    sourceSummaryParts.push('등록된 기준값과 참고값을 합산했습니다.');
                } else if (explicitCount > 0) {
                    sourceSummaryParts.push('등록된 기준값 합계입니다.');
                } else if (fallbackCount > 0) {
                    sourceSummaryParts.push('데이터 평균으로 계산된 참고값 합계입니다.');
                }
                const summaryText = sourceSummaryParts.join(' ');
                const titlePrefix = baselineYearLabel ? `${baselineYearLabel} 기준 적정재고 합계입니다.` : '적정재고 기준 합계입니다.';
                baselineCell.title = summaryText ? `${titlePrefix} ${summaryText}` : titlePrefix;
                if (explicitCount > 0) {
                    baselineCell.classList.add('optimal-baseline-explicit');
                } else if (fallbackCount > 0) {
                    baselineCell.classList.add('optimal-baseline-fallback');
                }
            } else if (baselineAverageValue !== null) {
                baselineCell.textContent = formatNumber(baselineAverageValue, '0');
                const titlePrefix = baselineYearLabel ? `${baselineYearLabel} 적정재고 평균값입니다.` : '적정재고 평균값입니다.';
                baselineCell.title = titlePrefix;
                if (explicitCount > 0) {
                    baselineCell.classList.add('optimal-baseline-explicit');
                } else if (fallbackCount > 0) {
                    baselineCell.classList.add('optimal-baseline-fallback');
                }
            } else {
                baselineCell.textContent = '-';
                baselineCell.classList.add('optimal-baseline-missing');
                baselineCell.title = '적정재고 기준값이 등록되지 않았습니다.';
            }
            totalRow.appendChild(baselineCell);

            dataset.totals.forEach((value, monthIndex) => {
                const monthClass = monthIndex % 2 === 0 ? 'optimal-month-even' : 'optimal-month-odd';
                const monthLabel = monthList[monthIndex];
                const isHighlight = hasHighlight && monthLabel === highlightValue;
                const actualValue = Number.isFinite(value.actual) ? value.actual : 0;
                const targetValue = Number.isFinite(value.target) ? value.target : 0;
                const diffValue = actualValue - targetValue;

                const actualCell = document.createElement('td');
                actualCell.className = 'optimal-value-actual';
                actualCell.classList.add('optimal-month-cell', 'optimal-month-actual', monthClass);
                if (monthIndex > 0) {
                    actualCell.classList.add('optimal-month-divider');
                }
                actualCell.dataset.monthIndex = String(monthIndex);
                actualCell.textContent = formatNumber(actualValue, '0');
                if (isHighlight) {
                    actualCell.classList.add('optimal-month-highlight');
                }
                totalRow.appendChild(actualCell);

                const targetCell = document.createElement('td');
                targetCell.className = 'optimal-value-target';
                targetCell.classList.add('optimal-month-cell', 'optimal-month-target', monthClass, 'optimal-month-subdivider');
                targetCell.dataset.monthIndex = String(monthIndex);
                targetCell.textContent = formatNumber(targetValue, '0');
                if (isHighlight) {
                    targetCell.classList.add('optimal-month-highlight');
                }
                totalRow.appendChild(targetCell);

                const diffCell = document.createElement('td');
                diffCell.className = 'optimal-value-diff';
                diffCell.classList.add('optimal-month-cell', 'optimal-month-diff', monthClass, 'optimal-month-diff-divider');
                diffCell.dataset.monthIndex = String(monthIndex);
                diffCell.textContent = formatSignedNumber(diffValue, '0');
                if (diffValue > 0) {
                    diffCell.classList.add('optimal-diff-positive');
                    diffCell.title = `적정재고 대비 초과 ${formatSignedNumber(diffValue, '0')} (월말재고 ${formatNumber(actualValue, '0')} BOX - 적정재고 ${formatNumber(targetValue, '0')} BOX)`;
                } else if (diffValue < 0) {
                    diffCell.classList.add('optimal-diff-negative');
                    diffCell.title = `적정재고 대비 부족 ${formatSignedNumber(diffValue, '0')} (월말재고 ${formatNumber(actualValue, '0')} BOX - 적정재고 ${formatNumber(targetValue, '0')} BOX)`;
                } else {
                    diffCell.classList.add('optimal-diff-zero');
                    diffCell.title = `적정재고와 월말재고가 동일`;
                }
                if (isHighlight) {
                    diffCell.classList.add('optimal-month-highlight');
                }
                totalRow.appendChild(diffCell);
            });
        } else {
            totalRow.classList.add('hidden');
        }
    }

    if (table) {
        table.classList.toggle('hidden', !hasData);
    }
    if (empty) {
        empty.classList.toggle('hidden', hasData);
    }
}

function determineBaselineYear(selectedYear = (state.optimalInventoryFilters ? state.optimalInventoryFilters.year : 'all')) {
    const preferred = sanitizeText(selectedYear).trim();
    if (preferred && preferred !== 'all') {
        return preferred;
    }

    const baselineYears = Array.from(new Set(
        (Array.isArray(state.optimalInventoryBaselines) ? state.optimalInventoryBaselines : [])
            .map((entry) => sanitizeText(entry.year).trim())
            .filter(Boolean)
    )).sort((a, b) => a.localeCompare(b));

    if (baselineYears.length === 0) {
        return OPTIMAL_INVENTORY_DEFAULT_YEAR;
    }

    if (baselineYears.includes(OPTIMAL_INVENTORY_DEFAULT_YEAR)) {
        return OPTIMAL_INVENTORY_DEFAULT_YEAR;
    }

    return baselineYears[0];
}

function buildOptimalBaselineLookup(year) {
    const normalizedYear = sanitizeText(year).trim();
    const map = new Map();
    let total = 0;
    let count = 0;

    if (!normalizedYear) {
        return { map, total, count };
    }

    (Array.isArray(state.optimalInventoryBaselines) ? state.optimalInventoryBaselines : []).forEach((entry) => {
        if (!entry) return;
        const entryYear = sanitizeText(entry.year).trim();
        if (entryYear !== normalizedYear) return;
        const categoryKey = sanitizeText(entry.category).trim() || '미지정';
        const quantity = toNullableNumber(entry.optimal_quantity);
        if (!Number.isFinite(quantity)) return;
        map.set(categoryKey, quantity);
        total += quantity;
        count += 1;
    });

    return { map, total, count };
}

function updateOptimalBaselineHeader(baselineYear, { selectedYear } = {}) {
    if (!dom.optimalInventory || !dom.optimalInventory.baselineHeader) return;
    const normalizedYear = sanitizeText(baselineYear).trim();
    const header = dom.optimalInventory.baselineHeader;
    if (normalizedYear) {
        header.textContent = `${normalizedYear}년 적정재고(BOX)`;
        if (selectedYear === 'all') {
            header.title = `${normalizedYear}년 기준값을 표시합니다. 분석 연도를 선택하면 해당 연도 기준값으로 전환됩니다.`;
        } else {
            header.title = `${normalizedYear}년 적정재고 기준값입니다.`;
        }
    } else {
        header.textContent = '적정재고 기준(BOX)';
        header.title = '등록된 적정재고 기준값이 없습니다.';
    }
}

function syncOptimalBaselineYearInput(targetYear) {
    if (!dom.optimalInventory || !dom.optimalInventory.baselineYear) return;
    if (state.optimalBaselineForm && state.optimalBaselineForm.editingId) return;
    const input = dom.optimalInventory.baselineYear;
    const normalizedTarget = sanitizeText(targetYear).trim();
    const currentValue = sanitizeText(input.value).trim();
    const previousDefault = sanitizeText(input.dataset.default).trim();

    if (!currentValue || currentValue === previousDefault || !previousDefault) {
        input.value = normalizedTarget;
        input.dataset.default = normalizedTarget;
    }
}

function getProductionPlanCategoryOptions() {
    const categorySet = new Set();

    const sources = [];
    if (Array.isArray(state.filteredData) && state.filteredData.length > 0) {
        sources.push(state.filteredData);
    }
    if (Array.isArray(state.enrichedData) && state.enrichedData.length > 0) {
        sources.push(state.enrichedData);
    }
    if (Array.isArray(state.rawData) && state.rawData.length > 0) {
        sources.push(state.rawData);
    }

    sources.forEach((collection) => {
        collection.forEach((record) => {
            if (!record) return;
            const category = sanitizeText(record.category).trim();
            if (category) {
                categorySet.add(category);
            }
        });
    });

    if (categorySet.size === 0 && Array.isArray(state.optimalInventoryBaselines)) {
        state.optimalInventoryBaselines.forEach((entry) => {
            if (!entry) return;
            const category = sanitizeText(entry.category).trim();
            if (category) {
                categorySet.add(category);
            }
        });
    }

    return Array.from(categorySet).sort((a, b) => a.localeCompare(b));
}

function populateOptimalBaselineCategoryOptions() {
    const select = dom.optimalInventory ? dom.optimalInventory.baselineCategory : null;
    if (!select || select.tagName !== 'SELECT') return;
    const categories = getProductionPlanCategoryOptions();

    /* 현재 선택값 보존 */
    const currentValue = select.value;

    select.innerHTML = '';
    /* 기본 placeholder 옵션 */
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.textContent = categories.length > 0
        ? '생산계획 현황 카테고리를 선택하세요'
        : '카테고리가 없습니다';
    select.appendChild(defaultOption);

    categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });

    /* 이전 선택값 복원 */
    if (currentValue && categories.includes(currentValue)) {
        select.value = currentValue;
    } else {
        select.selectedIndex = 0;
    }
}

function renderOptimalBaselineManager() {
    if (!dom.optimalInventory || !dom.optimalInventory.baselineTableBody) return;
    const {
        baselineTable,
        baselineTableHeaderRow,
        baselineTableSubheaderRow,
        baselineTableBody,
        baselineEmpty,
    } = dom.optimalInventory;

    if (baselineTableHeaderRow) baselineTableHeaderRow.innerHTML = '';
    if (baselineTableSubheaderRow) baselineTableSubheaderRow.innerHTML = '';
    baselineTableBody.innerHTML = '';

    const baselines = Array.isArray(state.optimalInventoryBaselines)
        ? [...state.optimalInventoryBaselines]
        : [];

    baselines.sort((a, b) => {
        const yearCompare = sanitizeText(a.year).localeCompare(sanitizeText(b.year));
        if (yearCompare !== 0) return yearCompare;
        return sanitizeText(a.category).localeCompare(sanitizeText(b.category));
    });

    const yearSet = new Set();
    const categorySet = new Set();
    const entryMap = new Map();

    baselines.forEach((entry) => {
        if (!entry) return;
        const year = sanitizeText(entry.year).trim();
        const category = sanitizeText(entry.category).trim() || '미지정';
        if (!year) return;
        yearSet.add(year);
        categorySet.add(category);
        entryMap.set(`${category}||${year}`, entry);
    });

    const years = Array.from(yearSet).sort((a, b) => a.localeCompare(b));
    let categories = Array.from(categorySet).sort((a, b) => a.localeCompare(b));

    const activeCategoryOptions = new Set(getProductionPlanCategoryOptions());
    const hasActiveCategoryOptions = activeCategoryOptions.size > 0;
    const hiddenCategories = [];

    if (hasActiveCategoryOptions) {
        const filteredCategories = [];
        categories.forEach((category) => {
            if (category === '미지정' || activeCategoryOptions.has(category)) {
                filteredCategories.push(category);
            } else {
                hiddenCategories.push(category);
            }
        });
        categories = filteredCategories;
    }

    if (dom.optimalInventory && dom.optimalInventory.baselineManager) {
        dom.optimalInventory.baselineManager.dataset.hiddenCategories = hiddenCategories.join(',');
    }

    const hasData = years.length > 0 && categories.length > 0;
    const defaultEmptyMessage = '등록된 적정재고 기준이 없습니다. 위 폼에서 값을 추가하세요.';
    const hiddenCategoryMessage = '생산계획 현황에 없는 카테고리 기준값은 목록에서 숨겨집니다.';

    if (baselineEmpty) {
        baselineEmpty.textContent = defaultEmptyMessage;
        baselineEmpty.removeAttribute('title');
    }

    if (!hasData) {
        if (baselineTable) baselineTable.classList.add('hidden');
        if (baselineEmpty) {
            baselineEmpty.classList.remove('hidden');
            if (hiddenCategories.length > 0 && (yearSet.size > 0 || categorySet.size > 0)) {
                baselineEmpty.textContent = hiddenCategoryMessage;
                baselineEmpty.title = `숨겨진 카테고리: ${hiddenCategories.join(', ')}`;
            }
        }

        if (baselineTableHeaderRow) {
            const categoryTh = document.createElement('th');
            categoryTh.scope = 'col';
            categoryTh.rowSpan = 2;
            categoryTh.className = 'baseline-category-header';
            categoryTh.textContent = '카테고리';
            baselineTableHeaderRow.appendChild(categoryTh);
        }
    } else {
        if (baselineTable) baselineTable.classList.remove('hidden');
        if (baselineEmpty) baselineEmpty.classList.add('hidden');

        if (baselineTableHeaderRow) {
            const categoryTh = document.createElement('th');
            categoryTh.scope = 'col';
            categoryTh.rowSpan = 2;
            categoryTh.className = 'baseline-category-header';
            categoryTh.textContent = '카테고리';
            baselineTableHeaderRow.appendChild(categoryTh);

            years.forEach((year, index) => {
                const yearTh = document.createElement('th');
                yearTh.scope = 'col';
                yearTh.colSpan = 2;
                yearTh.dataset.year = year;
                yearTh.textContent = `${year}년`;
                yearTh.classList.add('baseline-year-group', index % 2 === 0 ? 'baseline-year-even' : 'baseline-year-odd');
                baselineTableHeaderRow.appendChild(yearTh);
            });
        }

        if (baselineTableSubheaderRow) {
            years.forEach((year, index) => {
                const parityClass = index % 2 === 0 ? 'baseline-year-even' : 'baseline-year-odd';

                const quantityTh = document.createElement('th');
                quantityTh.scope = 'col';
                quantityTh.dataset.year = year;
                quantityTh.textContent = '적정재고';
                quantityTh.classList.add('baseline-subheader', 'baseline-subheader-quantity', parityClass);
                baselineTableSubheaderRow.appendChild(quantityTh);

                const noteTh = document.createElement('th');
                noteTh.scope = 'col';
                noteTh.dataset.year = year;
                noteTh.textContent = '특이사항';
                noteTh.classList.add('baseline-subheader', 'baseline-subheader-notes', parityClass);
                baselineTableSubheaderRow.appendChild(noteTh);
            });
        }

        const yearTotals = new Map();
        const yearTotalsCount = new Map();
        years.forEach((year) => {
            yearTotals.set(year, 0);
            yearTotalsCount.set(year, 0);
        });

        const fragment = document.createDocumentFragment();

        categories.forEach((category) => {
            const row = document.createElement('tr');
            row.dataset.category = category;

            const categoryCell = document.createElement('th');
            categoryCell.scope = 'row';
            categoryCell.className = 'baseline-category-cell';
            categoryCell.textContent = category;
            row.appendChild(categoryCell);

            years.forEach((year, index) => {
                const entryKey = `${category}||${year}`;
                const entry = entryMap.get(entryKey);
                const parityClass = index % 2 === 0 ? 'baseline-year-even' : 'baseline-year-odd';

                const quantityCell = document.createElement('td');
                quantityCell.className = 'baseline-quantity-cell';
                quantityCell.classList.add(parityClass);
                quantityCell.dataset.year = year;
                quantityCell.dataset.category = category;

                const quantityRaw = entry ? entry.optimal_quantity : undefined;
                let quantityValue = Number(quantityRaw);
                if (quantityRaw === null || quantityRaw === undefined || (typeof quantityRaw === 'string' && quantityRaw.trim() === '')) {
                    quantityValue = Number.NaN;
                }
                const hasQuantity = entry && Number.isFinite(quantityValue);

                if (hasQuantity) {
                    quantityCell.textContent = formatNumber(quantityValue, '0');
                    quantityCell.dataset.id = entry.id || '';
                    quantityCell.classList.add('has-value');
                    quantityCell.title = `${formatNumber(quantityValue, '0')} EA`;

                    yearTotals.set(year, (yearTotals.get(year) || 0) + quantityValue);
                    yearTotalsCount.set(year, (yearTotalsCount.get(year) || 0) + 1);
                } else {
                    quantityCell.textContent = '-';
                    quantityCell.classList.add('empty');
                    delete quantityCell.dataset.id;
                }
                row.appendChild(quantityCell);

                const notesCell = document.createElement('td');
                notesCell.className = 'baseline-notes-cell';
                notesCell.classList.add(parityClass);
                notesCell.dataset.year = year;
                notesCell.dataset.category = category;

                const noteWrapper = document.createElement('div');
                noteWrapper.className = 'baseline-note-wrapper';

                const noteText = document.createElement('span');
                noteText.className = 'baseline-note-text';

                const noteValue = entry ? sanitizeText(entry.notes).trim() : '';
                if (noteValue) {
                    noteText.textContent = noteValue;
                    noteText.title = noteValue;
                } else {
                    noteText.textContent = '-';
                    notesCell.classList.add('empty');
                }

                noteWrapper.appendChild(noteText);
                notesCell.appendChild(noteWrapper);

                if (entry && entry.id) {
                    notesCell.dataset.id = entry.id;
                } else {
                    delete notesCell.dataset.id;
                }

                row.appendChild(notesCell);
            });

            fragment.appendChild(row);
        });

        if (categories.length > 0) {
            const totalRow = document.createElement('tr');
            totalRow.classList.add('baseline-total-row');

            const totalLabelCell = document.createElement('th');
            totalLabelCell.scope = 'row';
            totalLabelCell.className = 'baseline-category-cell baseline-total-label';
            totalLabelCell.textContent = '합계';
            totalRow.appendChild(totalLabelCell);

            years.forEach((year, index) => {
                const parityClass = index % 2 === 0 ? 'baseline-year-even' : 'baseline-year-odd';

                const totalQuantityCell = document.createElement('td');
                totalQuantityCell.classList.add('baseline-total-quantity', parityClass);
                totalQuantityCell.dataset.year = year;

                const totalCount = yearTotalsCount.get(year) || 0;
                if (totalCount > 0) {
                    const totalValue = yearTotals.get(year) || 0;
                    totalQuantityCell.textContent = formatNumber(totalValue, '0');
                    totalQuantityCell.title = `${formatNumber(totalValue, '0')} EA`;
                } else {
                    totalQuantityCell.textContent = '-';
                    totalQuantityCell.classList.add('empty');
                }
                totalRow.appendChild(totalQuantityCell);

                const totalNotesCell = document.createElement('td');
                totalNotesCell.classList.add('baseline-total-notes', parityClass, 'empty');
                totalNotesCell.textContent = '-';
                totalRow.appendChild(totalNotesCell);
            });

            fragment.appendChild(totalRow);
        }

        baselineTableBody.appendChild(fragment);
    }

    populateOptimalBaselineCategoryOptions();
}

function resetOptimalBaselineForm({ preserveCategory = false } = {}) {
    if (!dom.optimalInventory || !dom.optimalInventory.baselineForm) return;
    const {
        baselineForm,
        baselineId,
        baselineYear,
        baselineCategory,
        baselineQuantity,
        baselineNotes,
        baselineSubmit,
        baselineUpdate,
        baselineDelete,
        baselineModeIndicator,
    } = dom.optimalInventory;

    state.optimalBaselineForm.editingId = null;
    if (baselineForm) {
        baselineForm.dataset.mode = 'create';
    }
    if (baselineId) baselineId.value = '';

    const defaultYear = determineBaselineYear();
    if (baselineYear) {
        baselineYear.value = defaultYear;
        baselineYear.dataset.default = defaultYear;
    }
    if (baselineCategory && !preserveCategory) {
        baselineCategory.value = '';
    }
    if (baselineQuantity) baselineQuantity.value = '';
    if (baselineNotes) baselineNotes.value = '';
    /* 등록 모드: 등록 버튼 활성, 수정/삭제 버튼 비활성 */
    if (baselineSubmit) {
        baselineSubmit.textContent = '기준 등록';
        baselineSubmit.disabled = false;
    }
    if (baselineUpdate) {
        baselineUpdate.disabled = true;
    }
    if (baselineDelete) {
        baselineDelete.disabled = true;
        baselineDelete.dataset.id = '';
    }
    /* 모드 표시 */
    if (baselineModeIndicator) {
        baselineModeIndicator.classList.remove('hidden', 'mode-edit');
        baselineModeIndicator.classList.add('mode-create');
        baselineModeIndicator.textContent = '신규 등록 모드 — 연도·카테고리·수량을 입력 후 [기준 등록] 버튼을 클릭하세요.';
    }
}

function setOptimalBaselineFormForEdit(entry) {
    if (!dom.optimalInventory) return;
    const {
        baselineForm,
        baselineId,
        baselineYear,
        baselineCategory,
        baselineQuantity,
        baselineNotes,
        baselineSubmit,
        baselineUpdate,
        baselineDelete,
        baselineModeIndicator,
    } = dom.optimalInventory;

    state.optimalBaselineForm.editingId = entry && entry.id ? entry.id : null;
    if (baselineForm) {
        baselineForm.dataset.mode = 'edit';
    }
    if (baselineId) baselineId.value = entry && entry.id ? entry.id : '';
    if (baselineYear) {
        const yearValue = sanitizeText(entry && entry.year).trim();
        baselineYear.value = yearValue;
        baselineYear.dataset.default = yearValue;
    }
    if (baselineCategory) {
        baselineCategory.value = sanitizeText(entry && entry.category).trim();
    }
    if (baselineQuantity) {
        baselineQuantity.value = Number.isFinite(entry.optimal_quantity) ? entry.optimal_quantity : '';
    }
    if (baselineNotes) {
        baselineNotes.value = sanitizeText(entry && entry.notes).trim();
    }
    /* 수정 모드: 등록 비활성, 수정/삭제 활성 */
    if (baselineSubmit) {
        baselineSubmit.disabled = true;
    }
    if (baselineUpdate) {
        baselineUpdate.disabled = false;
    }
    if (baselineDelete) {
        const hasId = entry && entry.id;
        baselineDelete.disabled = !hasId;
        baselineDelete.dataset.id = hasId ? entry.id : '';
    }
    /* 모드 표시 */
    if (baselineModeIndicator) {
        const catLabel = sanitizeText(entry && entry.category).trim() || '';
        const yearLabel = sanitizeText(entry && entry.year).trim() || '';
        baselineModeIndicator.classList.remove('hidden', 'mode-create');
        baselineModeIndicator.classList.add('mode-edit');
        baselineModeIndicator.textContent = `수정 모드 — ${yearLabel}년 ${catLabel} 선택됨. 값을 변경 후 [수정] 버튼을 클릭하세요. 새로 등록하려면 [초기화]를 누르세요.`;
    }
}

async function refreshOptimalBaselines({ silent = false } = {}) {
    try {
        const response = await fetch('/sales-api/optimal-inventory-baselines?limit=1000&sort=year,category');
        if (!response.ok) {
            throw new Error('적정재고 기준 데이터를 불러오지 못했습니다.');
        }
        const payload = await response.json();
        const rows = extractData(payload);
        state.optimalInventoryBaselines = rows.map(normalizeOptimalBaseline);
        state.optimalInventoryBaselines.sort((a, b) => {
            const yearCompare = sanitizeText(a.year).localeCompare(sanitizeText(b.year));
            if (yearCompare !== 0) return yearCompare;
            return sanitizeText(a.category).localeCompare(sanitizeText(b.category));
        });
        state.optimalInventoryBaselineIndex = buildOptimalBaselineIndex(state.optimalInventoryBaselines);
        state.optimalInventoryBaselineById = buildOptimalBaselineIdIndex(state.optimalInventoryBaselines);
        populateOptimalBaselineCategoryOptions();
        renderOptimalBaselineManager();
        renderOptimalInventoryView();
    } catch (error) {
        console.error(error);
        if (!silent) {
            alert(error.message || '적정재고 기준 데이터를 새로고침하지 못했습니다.');
        }
    }
}

async function handleOptimalBaselineDelete(id) {
    if (!id) return;
    const confirmed = window.confirm('해당 적정재고 기준을 삭제하시겠습니까?');
    if (!confirmed) return;

    if (dom.optimalInventory && dom.optimalInventory.baselineDelete) {
        dom.optimalInventory.baselineDelete.disabled = true;
    }

    try {
        const response = await fetch(`/sales-api/optimal-inventory-baselines/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('적정재고 기준을 삭제하지 못했습니다.');
        }
        if (state.optimalBaselineForm.editingId === id) {
            resetOptimalBaselineForm();
        }
        await refreshOptimalBaselines({ silent: true });
        alert('삭제되었습니다.');
    } catch (error) {
        console.error(error);
        alert(error.message || '삭제 중 오류가 발생했습니다.');
        if (dom.optimalInventory && dom.optimalInventory.baselineDelete) {
            dom.optimalInventory.baselineDelete.disabled = false;
            dom.optimalInventory.baselineDelete.dataset.id = id;
        }
    }
}

function validateBaselineFormFields() {
    if (!dom.optimalInventory) return null;
    const { baselineYear, baselineCategory, baselineQuantity, baselineNotes } = dom.optimalInventory;

    const yearValue = sanitizeText(baselineYear && baselineYear.value).trim();
    if (!/^\d{4}$/.test(yearValue)) {
        alert('연도를 네 자리 숫자로 입력하세요. (예: 2025)');
        if (baselineYear) baselineYear.focus();
        return null;
    }

    const categoryValue = sanitizeText(baselineCategory && baselineCategory.value).trim();
    if (!categoryValue) {
        alert('카테고리를 입력하세요.');
        if (baselineCategory) baselineCategory.focus();
        return null;
    }

    const quantityValue = baselineQuantity ? Number(baselineQuantity.value) : NaN;
    if (!Number.isFinite(quantityValue) || quantityValue < 0) {
        alert('적정 재고 수량을 0 이상의 숫자로 입력하세요.');
        if (baselineQuantity) baselineQuantity.focus();
        return null;
    }

    const notesValue = sanitizeText(baselineNotes && baselineNotes.value).trim();
    return { base_year: yearValue, category: categoryValue, optimal_quantity: quantityValue, notes: notesValue };
}

/* ── 기준 등록 (신규 POST) ── */
async function handleOptimalBaselineFormSubmit(event) {
    event.preventDefault();
    if (!dom.optimalInventory) return;
    const { baselineSubmit } = dom.optimalInventory;

    const payload = validateBaselineFormFields();
    if (!payload) return;

    try {
        if (baselineSubmit) {
            baselineSubmit.disabled = true;
            baselineSubmit.textContent = '등록 중...';
        }

        const response = await fetch('/sales-api/optimal-inventory-baselines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('적정재고 기준 등록에 실패했습니다.');
        }

        await refreshOptimalBaselines({ silent: true });
        alert(`${payload.base_year}년 ${payload.category} 적정재고 기준이 등록되었습니다.`);
        resetOptimalBaselineForm();
    } catch (error) {
        console.error(error);
        alert(error.message || '등록 중 오류가 발생했습니다.');
    } finally {
        if (baselineSubmit) {
            baselineSubmit.disabled = false;
            baselineSubmit.textContent = '기준 등록';
        }
    }
}

/* ── 기준 수정 (기존 PUT) ── */
async function handleOptimalBaselineUpdateClick() {
    if (!dom.optimalInventory) return;
    const { baselineUpdate, baselineId } = dom.optimalInventory;

    const editingId = state.optimalBaselineForm.editingId
        || (baselineId ? sanitizeText(baselineId.value).trim() : '')
        || null;

    if (!editingId) {
        alert('수정할 항목이 선택되지 않았습니다. 아래 표에서 수정할 항목을 먼저 클릭하세요.');
        return;
    }

    const payload = validateBaselineFormFields();
    if (!payload) return;

    try {
        if (baselineUpdate) {
            baselineUpdate.disabled = true;
            baselineUpdate.textContent = '저장 중...';
        }

        const response = await fetch(`/sales-api/optimal-inventory-baselines/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('적정재고 기준 수정에 실패했습니다.');
        }

        await refreshOptimalBaselines({ silent: true });
        alert(`${payload.base_year}년 ${payload.category} 적정재고 기준이 수정되었습니다.`);
        resetOptimalBaselineForm();
    } catch (error) {
        console.error(error);
        alert(error.message || '수정 중 오류가 발생했습니다.');
    } finally {
        if (baselineUpdate) {
            baselineUpdate.disabled = false;
            baselineUpdate.textContent = '수정';
        }
    }
}

function handleOptimalBaselineReset() {
    resetOptimalBaselineForm();
}

function handleOptimalBaselineDeleteClick() {
    if (!dom.optimalInventory || !dom.optimalInventory.baselineDelete) return;
    const id = sanitizeText(dom.optimalInventory.baselineDelete.dataset.id).trim();
    if (!id) {
        alert('삭제할 기준값이 없습니다. 우측 표에서 수정할 항목을 먼저 선택하세요.');
        return;
    }
    handleOptimalBaselineDelete(id);
}


function handleOptimalBaselineTableClick(event) {
    const quantityCell = event.target.closest('td.baseline-quantity-cell');
    if (!quantityCell) return;

    const year = sanitizeText(quantityCell.dataset.year).trim();
    const category = sanitizeText(quantityCell.dataset.category).trim();
    if (!year || !category) return;

    const entryId = sanitizeText(quantityCell.dataset.id).trim();

    if (entryId) {
        const entry = state.optimalInventoryBaselineById.get(String(entryId))
            || (Array.isArray(state.optimalInventoryBaselines)
                ? state.optimalInventoryBaselines.find((item) => String(item.id) === String(entryId))
                : null);
        if (!entry) {
            alert('기준값 정보를 찾을 수 없습니다. 새로고침 후 다시 시도하세요.');
            return;
        }
        setOptimalBaselineFormForEdit(entry);
        if (dom.optimalInventory && dom.optimalInventory.baselineQuantity) {
            dom.optimalInventory.baselineQuantity.focus();
        }
    } else {
        resetOptimalBaselineForm();
        if (!dom.optimalInventory) return;
        const {
            baselineYear,
            baselineCategory,
            baselineQuantity,
        } = dom.optimalInventory;
        if (baselineYear) {
            baselineYear.value = year;
            baselineYear.dataset.default = year;
        }
        if (baselineCategory) {
            baselineCategory.value = category;
        }
        if (baselineQuantity) {
            baselineQuantity.focus();
        }
    }
}

function destroyOptimalInventoryChart() {
    if (state.optimalInventoryChart && typeof state.optimalInventoryChart.destroy === 'function') {
        state.optimalInventoryChart.destroy();
    }
    state.optimalInventoryChart = null;
}

function renderOptimalInventoryChart(months, totals, highlightMonth = '') {
    if (!dom.optimalInventory || !dom.optimalInventory.chartCanvas) return;
    const monthList = Array.isArray(months) ? months : [];
    const totalList = Array.isArray(totals) ? totals : [];
    const hasData = monthList.length > 0 && totalList.length === monthList.length;

    if (!hasData) {
        destroyOptimalInventoryChart();
        return;
    }

    const highlightValue = sanitizeText(highlightMonth).trim();
    const highlightIndex = highlightValue && monthList.includes(highlightValue)
        ? monthList.indexOf(highlightValue)
        : -1;

    const actualData = totalList.map((value) => {
        const numeric = Number(value.actual);
        return Number.isFinite(numeric) ? numeric : 0;
    });
    const targetData = totalList.map((value) => {
        const numeric = Number(value.target);
        return Number.isFinite(numeric) ? numeric : 0;
    });

    const actualBackgroundColors = monthList.map(() => 'rgba(5, 150, 105, 0.6)');
    const actualBorderColors = monthList.map(() => 'transparent');
    const actualBorderWidths = monthList.map(() => 0);

    const targetBackgroundColors = monthList.map(() => 'rgba(37, 99, 235, 0.55)');
    const targetBorderColors = monthList.map(() => 'transparent');
    const targetBorderWidths = monthList.map(() => 0);

    destroyOptimalInventoryChart();

    state.optimalInventoryChart = new Chart(dom.optimalInventory.chartCanvas, {
        type: 'bar',
        data: {
            labels: monthList,
            datasets: [
                {
                    label: '월말 재고 합계 (BOX)',
                    data: actualData,
                    backgroundColor: actualBackgroundColors,
                    borderColor: actualBorderColors,
                    borderWidth: actualBorderWidths,
                    maxBarThickness: 42,
                },
                {
                    label: '적정재고 합계 (BOX)',
                    data: targetData,
                    backgroundColor: targetBackgroundColors,
                    borderColor: targetBorderColors,
                    borderWidth: targetBorderWidths,
                    maxBarThickness: 42,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                title: {
                    display: true,
                    text: '월별 재고 합계 비교',
                    font: {
                        family: 'Noto Sans KR',
                        weight: '600',
                    },
                },
                legend: {
                    labels: {
                        font: {
                            family: 'Noto Sans KR',
                        },
                    },
                },
                tooltip: {
                    callbacks: {
                        label(context) {
                            const value = context.parsed.y;
                            const baseLabel = context.dataset.label || '';
                            return `${baseLabel}: ${formatNumber(value)} EA`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        font: {
                            family: 'Noto Sans KR',
                        },
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback(value) {
                            return `${formatNumber(value)} EA`;
                        },
                        font: {
                            family: 'Noto Sans KR',
                        },
                    },
                    title: {
                        display: true,
                        text: '수량 (EA)',
                        font: {
                            family: 'Noto Sans KR',
                        },
                    },
                },
            },
        },
    });
}

function renderOptimalInventoryView() {
    if (!dom.optimalInventory) return;

    const {
        yearSelect,
        table,
        empty,
        highlightLegend,
        highlightLegendText,
    } = dom.optimalInventory;

    /* 적정재고관리 화면은 생산계획 현황의 카테고리 필터와 무관하게 모든 카테고리를 표시 */
    const highlightFilterValue = dom.filters.month ? sanitizeText(dom.filters.month.value).trim() : '';
    const highlightMonth = highlightFilterValue && highlightFilterValue !== 'all' ? highlightFilterValue : '';

    let records = Array.isArray(state.enrichedData) ? [...state.enrichedData] : [];

    /* 제외 카테고리(원단/미지정) 필터링 */
    records = records.filter((record) => !isExcludedCategory(record.category));

    records = records.filter((record) => {
        const month = sanitizeText(record.month).trim();
        return month && month >= OPTIMAL_INVENTORY_MIN_MONTH;
    });

    const availableYears = Array.from(new Set(
        records
            .map((record) => sanitizeText(record.month).trim())
            .filter((month) => /^\d{4}-\d{2}$/.test(month))
            .map((month) => month.slice(0, 4))
    )).sort((a, b) => a.localeCompare(b));

    let selectedYear = state.optimalInventoryFilters.year || OPTIMAL_INVENTORY_DEFAULT_YEAR;
    if (selectedYear !== 'all' && !availableYears.includes(selectedYear)) {
        if (availableYears.includes(OPTIMAL_INVENTORY_DEFAULT_YEAR)) {
            selectedYear = OPTIMAL_INVENTORY_DEFAULT_YEAR;
        } else if (availableYears.length > 0) {
            selectedYear = availableYears[0];
        } else {
            selectedYear = 'all';
        }
    }
    if (availableYears.length === 0) {
        selectedYear = 'all';
    }
    state.optimalInventoryFilters.year = selectedYear;

    if (yearSelect) {
        yearSelect.innerHTML = '<option value="all">전체</option>';
        availableYears.forEach((year) => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = `${year}년`;
            yearSelect.appendChild(option);
        });
        yearSelect.disabled = availableYears.length === 0;
        yearSelect.value = selectedYear;
    }

    const baselineYear = determineBaselineYear(selectedYear);
    updateOptimalBaselineHeader(baselineYear, { selectedYear });
    const baselineLookup = buildOptimalBaselineLookup(baselineYear);
    syncOptimalBaselineYearInput(baselineYear);

    let displayRecords = records;
    if (selectedYear !== 'all') {
        displayRecords = records.filter((record) => {
            const month = sanitizeText(record.month).trim();
            return month.startsWith(`${selectedYear}-`);
        });
    }

    let months = getUniqueMonthsFromRecords(displayRecords)
        .map((month) => sanitizeText(month).trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

    /* 집계방식 필터 적용 */
    const aggregationMode = state.optimalInventoryFilters.aggregationMode || 'all';
    if (aggregationMode !== 'all' && months.length > 0) {
        const baseMonth = highlightMonth || months[months.length - 1];
        if (aggregationMode === 'cumulative') {
            /* 연초~기준월 누적: 기준월과 같은 연도의 01월부터 기준월까지 */
            const baseYear = baseMonth.slice(0, 4);
            const startMonth = `${baseYear}-01`;
            months = months.filter((m) => m >= startMonth && m <= baseMonth);
        } else if (aggregationMode === 'rolling') {
            /* 기준월 포함 최근 4개월 */
            const rollingMonths = [baseMonth];
            let prev = baseMonth;
            for (let i = 0; i < 3; i++) {
                const dm = decrementMonth(prev);
                if (!dm) break;
                rollingMonths.unshift(dm);
                prev = dm;
            }
            const rollingSet = new Set(rollingMonths);
            months = months.filter((m) => rollingSet.has(m));
        }
        /* 집계방식이 적용되면 표시 레코드도 해당 월로만 필터 */
        const monthSet = new Set(months);
        displayRecords = displayRecords.filter((r) => monthSet.has(sanitizeText(r.month).trim()));
    }

    state.optimalInventoryMonths = months;

    const hasMonths = months.length > 0;

    const highlightApplied = highlightMonth && months.includes(highlightMonth) ? highlightMonth : '';

    if (highlightLegend) {
        const shouldHideLegend = !highlightApplied;
        highlightLegend.classList.toggle('hidden', shouldHideLegend);
        if (highlightLegendText) {
            if (highlightApplied) {
                const label = formatMonthToKoreanLabel(highlightApplied) || highlightApplied;
                highlightLegendText.textContent = `생산계획 현황 선택 월: ${label}`;
            } else {
                highlightLegendText.textContent = '생산계획 현황에서 선택한 월이 강조 표시됩니다.';
            }
        }
    }

    if (!hasMonths) {
        renderOptimalInventoryTable({ categories: [], totals: [] }, months, '');
        destroyOptimalInventoryChart();
        if (table) {
            table.classList.add('hidden');
        }
        if (empty) {
            empty.classList.remove('hidden');
        }
        return;
    }

    let dataset = buildOptimalInventoryDataset(displayRecords, months, {
        baselineMap: baselineLookup.map,
        baselineYear,
    });
    renderOptimalInventoryTable(dataset, months, highlightApplied);
    renderOptimalInventoryChart(months, dataset.totals, highlightApplied);

    if (table) {
        table.classList.remove('hidden');
    }
    if (empty) {
        empty.classList.add('hidden');
    }
}

function handleOptimalInventoryYearChange(event) {
    const yearValue = event && event.target ? event.target.value : 'all';
    state.optimalInventoryFilters.year = yearValue || 'all';
    renderOptimalInventoryView();
}

function handleOptimalAggregationModeChange(event) {
    const modeValue = event && event.target ? event.target.value : 'all';
    state.optimalInventoryFilters.aggregationMode = modeValue || 'all';
    renderOptimalInventoryView();
}

// -------------------- 차트 --------------------
function updateChart() {
    const selectedCode = dom.chartSelect.value;
    highlightAnalyticsSelectedRow(selectedCode);
    if (!selectedCode) {
        destroyChart();
        return;
    }

    const enrichedSource = state.enrichedData && state.enrichedData.length > 0
        ? state.enrichedData
        : buildChainedRecords(state.rawData, buildLineStats(state.rawData));
    const itemRecords = enrichedSource.filter((record) => record.item_code === selectedCode);
    if (itemRecords.length === 0) {
        destroyChart();
        return;
    }

    const sortedRecords = sortByMonth(itemRecords);
    const recordMap = new Map(sortedRecords.map((record) => [sanitizeText(record.month).trim(), record]));
    const filteredMonths = getFilteredMonthsForChart(selectedCode);
    const monthsToPlot = filteredMonths.length > 0
        ? filteredMonths
        : sortedRecords.map((record) => sanitizeText(record.month).trim()).filter(Boolean);

    if (monthsToPlot.length === 0) {
        destroyChart();
        return;
    }

    const normalizedMonths = monthsToPlot.map((month) => sanitizeText(month).trim());
    const datasetRecords = normalizedMonths.map((month) => recordMap.get(month) || null);

    const salesData = datasetRecords.map((record) => (record ? record.sales_plan : null));
    const productionData = datasetRecords.map((record) => (record ? record.production_plan : null));
    const endingInventoryData = datasetRecords.map((record) => (record ? record.ending_inventory : null));
    const targetEndingData = datasetRecords.map((record) => (record ? record.target_ending_inventory : null));

    const fallbackRecord = sortedRecords.find((record) => record && record.item_name) || sortedRecords[0];
    const itemNameSource = datasetRecords.find((record) => record && record.item_name);
    const itemName = itemNameSource && itemNameSource.item_name
        ? itemNameSource.item_name
        : (fallbackRecord && fallbackRecord.item_name ? fallbackRecord.item_name : selectedCode);

    destroyChart();
    state.chart = new Chart(dom.chartCanvas, {
        type: 'line',
        data: {
            labels: normalizedMonths,
            datasets: [
                {
                    label: '판매 계획 (EA)',
                    data: salesData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239,68,68,0.14)',
                    tension: 0.3,
                    fill: false,
                    borderWidth: 2,
                },
                {
                    label: '생산 계획 (EA)',
                    data: productionData,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37,99,235,0.14)',
                    tension: 0.3,
                    fill: false,
                    borderWidth: 2,
                },
                {
                    label: '예상 월말 재고 (EA)',
                    data: endingInventoryData,
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5,150,105,0.14)',
                    tension: 0.3,
                    fill: false,
                    borderWidth: 2,
                },
                {
                    label: 'SKU별 적정재고 (EA)',
                    data: targetEndingData,
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124,58,237,0.08)',
                    tension: 0.3,
                    fill: false,
                    borderWidth: 2,
                    borderDash: [6, 4],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${itemName} (${selectedCode}) 자재 추이`,
                    font: {
                        family: 'Noto Sans KR',
                        weight: '600',
                    },
                },
                legend: {
                    labels: {
                        font: {
                            family: 'Noto Sans KR',
                        },
                    },
                },
                tooltip: {
                    intersect: false,
                    mode: 'index',
                    callbacks: {
                        label(context) {
                            const value = context.parsed.y;
                            return `${context.dataset.label}: ${formatNumber(value)} EA`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '계획 월',
                        font: {
                            family: 'Noto Sans KR',
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: '수량 (EA)',
                        font: {
                            family: 'Noto Sans KR',
                        },
                    },
                    beginAtZero: true,
                },
            },
        },
    });
}

function destroyChart() {
    if (state.chart) {
        state.chart.destroy();
        state.chart = null;
    }
}

function destroyLineCapaUsageChart(options = {}) {
    const preserveSummary = options && options.preserveSummary === true;
    if (Array.isArray(state.lineCapaUsageCharts) && state.lineCapaUsageCharts.length > 0) {
        state.lineCapaUsageCharts.forEach((chart) => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        state.lineCapaUsageCharts = [];
    }
    if (!preserveSummary && state.lineCapaUsageSummaryChart && typeof state.lineCapaUsageSummaryChart.destroy === 'function') {
        state.lineCapaUsageSummaryChart.destroy();
        state.lineCapaUsageSummaryChart = null;
    }
}

function destroyLineCapaChart() {
    if (state.lineCapaChart) {
        state.lineCapaChart.destroy();
        state.lineCapaChart = null;
    }
}

function showLineCapaChartPlaceholder(message) {
    if (!dom.lineCapa.chartContainer) return;
    const trendSection = dom.lineCapa.trendSection
        || dom.lineCapa.chartContainer.closest('.line-capa-usage-trend');
    if (trendSection) {
        trendSection.classList.remove('hidden');
    }
    dom.lineCapa.chartContainer.classList.remove('hidden');
    destroyLineCapaChart();
    if (dom.lineCapa.canvas) {
        dom.lineCapa.canvas.classList.add('hidden');
    }
    if (dom.lineCapa.placeholder) {
        dom.lineCapa.placeholder.textContent = message
            || '라인 카드를 클릭하거나 Enter 키로 활성화하면 월별 생산량과 CAPA 추이를 확인할 수 있습니다.';
        dom.lineCapa.placeholder.classList.remove('hidden');
    }
    state.lineCapaActiveKey = null;
}

function ensureLineCapaUsageFilters() {
    if (!state.lineCapaUsageFilters) {
        state.lineCapaUsageFilters = {
            month: 'all',
            category: 'all',
            line: 'all',
            manualMonth: false,
        };
    } else if (typeof state.lineCapaUsageFilters.manualMonth !== 'boolean') {
        state.lineCapaUsageFilters.manualMonth = false;
    }
    return state.lineCapaUsageFilters;
}

function sanitizeFilterValue(value) {
    const normalized = sanitizeText(value).trim();
    return normalized ? normalized : 'all';
}

function setLineCapaUsageFilter(type, value, options = {}) {
    const filters = ensureLineCapaUsageFilters();
    const nextValue = sanitizeFilterValue(value);
    const previousValue = filters[type];
    if (previousValue === nextValue && !(type === 'month' && options.fromMain)) {
        return;
    }

    filters[type] = nextValue;
    if (type === 'month') {
        if (options && options.fromMain === true) {
            filters.manualMonth = false;
        } else if (options && options.autoSelect === true) {
            filters.manualMonth = false;
        } else {
            filters.manualMonth = true;
        }
    }

    let targetSelect = null;
    if (type === 'month') {
        targetSelect = dom.lineCapa.usageFilterMonth;
    } else if (type === 'category') {
        targetSelect = dom.lineCapa.usageFilterCategory;
    } else if (type === 'line') {
        targetSelect = dom.lineCapa.usageFilterLine;
    }
    if (targetSelect && targetSelect.value !== nextValue) {
        targetSelect.value = nextValue;
    }

    if (!(options && options.silent)) {
        updateLineCapaChart();
    }
}

function filterRecordsByUsage(records) {
    const filters = ensureLineCapaUsageFilters();
    const monthFilter = sanitizeFilterValue(filters.month);
    const categoryFilter = sanitizeFilterValue(filters.category);
    const lineFilter = sanitizeFilterValue(filters.line);

    return (records || []).filter((record) => {
        if (!record) return false;
        const recordMonth = sanitizeText(record.month).trim();
        if (monthFilter !== 'all' && recordMonth !== monthFilter) {
            return false;
        }
        const recordCategory = sanitizeText(record.lineCategory ?? record.category).trim() || '미지정';
        if (categoryFilter !== 'all' && recordCategory !== categoryFilter) {
            return false;
        }
        const recordLine = sanitizeText(record.production_line).trim() || '미지정';
        if (lineFilter !== 'all' && recordLine !== lineFilter) {
            return false;
        }
        return true;
    });
}

function getLineCapaBaseRecords() {
    /* enrichedData 기준으로 OEM 제외 — 생산 CAPA는 OEM을 관리하지 않으므로 생산 탭 데이터만 사용 */
    const allRecords = Array.isArray(state.enrichedData) ? state.enrichedData : (Array.isArray(state.filteredData) ? state.filteredData : []);
    const rawRecords = allRecords.filter((record) => {
        const line = sanitizeText(record.production_line).trim().toUpperCase();
        return !line.includes('OEM');
    });
    if (rawRecords.length === 0) {
        return [];
    }

    const recordMap = new Map();
    rawRecords.forEach((record, index) => {
        if (!record) return;
        const monthValue = sanitizeText(record.month).trim();
        const lineValue = sanitizeText(record.production_line).trim();
        if (!monthValue || !lineValue) return;

        const itemKeyCandidate = sanitizeText(record.item_code).trim()
            || sanitizeText(record.lineKey || record.lineKeyBase || record.id).trim()
            || `row-${index}`;
        if (!itemKeyCandidate) return;

        const key = `${monthValue}__${lineValue}__${itemKeyCandidate}`;
        const existing = recordMap.get(key);
        if (!existing) {
            recordMap.set(key, record);
            return;
        }

        const existingProjected = !!existing.isProjected;
        const currentProjected = !!record.isProjected;
        if (existingProjected && !currentProjected) {
            recordMap.set(key, record);
            return;
        }

        if (existingProjected === currentProjected) {
            const existingPlan = Number.isFinite(existing.production_plan) ? existing.production_plan : -Infinity;
            const currentPlan = Number.isFinite(record.production_plan) ? record.production_plan : -Infinity;
            if (currentPlan > existingPlan) {
                recordMap.set(key, record);
            }
        }
    });

    return Array.from(recordMap.values());
}

function populateLineCapaUsageFilters() {
    if (!dom.lineCapa || !dom.lineCapa.usageFilterMonth) return;
    const filters = ensureLineCapaUsageFilters();
    const records = getLineCapaBaseRecords();

    const monthSet = new Set();
    const categorySet = new Set();
    const lineSet = new Set();

    records.forEach((record) => {
        if (!record) return;
        /* 제외 카테고리(원단/미지정) 필터링 */
        if (isExcludedCategory(record.category)) return;
        const monthValue = sanitizeText(record.month).trim();
        if (monthValue) {
            monthSet.add(monthValue);
        }
        const categoryValue = sanitizeText(record.lineCategory ?? record.category).trim() || '미지정';
        if (!isExcludedCategory(categoryValue)) {
            categorySet.add(categoryValue);
        }
        const lineValue = sanitizeText(record.production_line).trim() || '미지정';
        lineSet.add(lineValue);
    });

    const monthOptions = Array.from(monthSet).sort((a, b) => a.localeCompare(b));
    const categoryOptions = Array.from(categorySet).sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));
    const lineOptions = Array.from(lineSet).sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));

    const ensureSelectOptions = (selectElement, optionsList, type) => {
        if (!selectElement) return;
        const current = sanitizeFilterValue(filters[type]);
        selectElement.innerHTML = '<option value="all">전체</option>';
        optionsList.forEach((optionValue) => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            selectElement.appendChild(option);
        });
        if (current !== 'all' && !optionsList.includes(current)) {
            if (type === 'month') {
                filters.manualMonth = false;
            }
            filters[type] = 'all';
            selectElement.value = 'all';
        } else {
            selectElement.value = current;
        }
    };

    ensureSelectOptions(dom.lineCapa.usageFilterMonth, monthOptions, 'month');
    ensureSelectOptions(dom.lineCapa.usageFilterCategory, categoryOptions, 'category');
    ensureSelectOptions(dom.lineCapa.usageFilterLine, lineOptions, 'line');
}

function syncLineCapaUsageFiltersFromMain() {
    const filters = ensureLineCapaUsageFilters();
    if (filters.manualMonth) return;
    const mainMonth = dom.filters && dom.filters.month ? dom.filters.month.value : 'all';
    setLineCapaUsageFilter('month', mainMonth, { fromMain: true, silent: true });
}

function attachLineCapaUsageFilterListeners() {
    if (dom.lineCapa.usageFilterMonth && dom.lineCapa.usageFilterMonth.dataset.bound !== 'true') {
        dom.lineCapa.usageFilterMonth.addEventListener('change', (event) => {
            setLineCapaUsageFilter('month', event.target.value);
        });
        dom.lineCapa.usageFilterMonth.dataset.bound = 'true';
    }
    if (dom.lineCapa.usageFilterCategory && dom.lineCapa.usageFilterCategory.dataset.bound !== 'true') {
        dom.lineCapa.usageFilterCategory.addEventListener('change', (event) => {
            setLineCapaUsageFilter('category', event.target.value);
        });
        dom.lineCapa.usageFilterCategory.dataset.bound = 'true';
    }
    if (dom.lineCapa.usageFilterLine && dom.lineCapa.usageFilterLine.dataset.bound !== 'true') {
        dom.lineCapa.usageFilterLine.addEventListener('change', (event) => {
            setLineCapaUsageFilter('line', event.target.value);
        });
        dom.lineCapa.usageFilterLine.dataset.bound = 'true';
    }
}

function buildLineCapaUsageEntries(records) {
    const map = new Map();
    (records || []).forEach((record) => {
        if (!record) return;
        const categoryValue = sanitizeText(record.lineCategory ?? record.category).trim() || '미지정';
        const baseKey = getLineKey(record.production_line, record.month);
        const lineKey = record.lineKey || getLineCompositeKey(record.production_line, categoryValue, record.month)
            || baseKey;
        if (!lineKey) return;

        const lineName = sanitizeText(record.production_line).trim() || '미지정';
        const monthValue = sanitizeText(record.month).trim() || '-';

        if (!map.has(lineKey)) {
            map.set(lineKey, {
                lineKey,
                baseKey,
                line: lineName,
                lineCategory: categoryValue,
                month: monthValue,
                capacity: null,
                totalProduction: 0,
                categories: new Set(),
                items: new Map(),
            });
        }
        const entry = map.get(lineKey);
        if (!entry.baseKey && baseKey) {
            entry.baseKey = baseKey;
        }
        entry.categories.add(categoryValue);

        const production = Number.isFinite(record.production_plan) ? record.production_plan : 0;
        entry.totalProduction += production;

        const itemCode = sanitizeText(record.item_code).trim() || `ID-${record.id}`;
        const itemName = sanitizeText(record.item_name).trim();
        const existingItem = entry.items.get(itemCode) || { quantity: 0, itemName };
        existingItem.quantity += production;
        if (!existingItem.itemName && itemName) {
            existingItem.itemName = itemName;
        }
        entry.items.set(itemCode, existingItem);

        const candidateCapacities = [];
        if (Number.isFinite(record.lineCapacityLimit) && record.lineCapacityLimit > 0) {
            candidateCapacities.push(record.lineCapacityLimit);
        }
        if (Number.isFinite(record.capacity_limit) && record.capacity_limit > 0) {
            candidateCapacities.push(record.capacity_limit);
        }
        if (candidateCapacities.length > 0) {
            const capacityValue = candidateCapacities[0];
            if (!Number.isFinite(entry.capacity) || entry.capacity <= 0) {
                entry.capacity = capacityValue;
            } else if (Math.abs(entry.capacity - capacityValue) > 1e-6) {
                entry.capacity = Math.max(entry.capacity, capacityValue);
            }
        }
    });

    const entries = Array.from(map.values()).map((entry) => {
        const categoriesArray = Array.from(entry.categories || [])
            .sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));
        const normalizedLineCategory = categoriesArray.length === 1 ? categoriesArray[0] : '';
        const displayCategory = categoriesArray.length > 0
            ? categoriesArray.join(', ')
            : '카테고리 미지정';
        return {
            ...entry,
            categories: categoriesArray,
            lineCategory: normalizedLineCategory || sanitizeText(entry.lineCategory || '').trim(),
            displayCategory,
        };
    });

    const baseCapacityMap = new Map();
    entries.forEach((entry) => {
        if (entry.baseKey && Number.isFinite(entry.capacity) && entry.capacity > 0) {
            const existing = baseCapacityMap.get(entry.baseKey);
            if (!Number.isFinite(existing) || existing < entry.capacity) {
                baseCapacityMap.set(entry.baseKey, entry.capacity);
            }
        }
    });
    entries.forEach((entry) => {
        if ((!Number.isFinite(entry.capacity) || entry.capacity <= 0) && entry.baseKey && baseCapacityMap.has(entry.baseKey)) {
            entry.capacity = baseCapacityMap.get(entry.baseKey);
        }
    });

    return entries.sort((a, b) => {
        const monthCompare = sanitizeText(a.month).localeCompare(sanitizeText(b.month));
        if (monthCompare !== 0) return monthCompare;
        const lineCompare = sanitizeText(a.line).localeCompare(sanitizeText(b.line));
        if (lineCompare !== 0) return lineCompare;
        return sanitizeText(a.lineCategory || '').localeCompare(sanitizeText(b.lineCategory || ''));
    });
}

function updateLineCapaUsageChart() {
    const wrapper = dom.lineCapa.usageChartWrapper || document.querySelector('.line-capa-usage-chart-container');
    const container = dom.lineCapa.usageChartContainer || document.querySelector('.line-capa-usage-chart');
    const canvas = dom.lineCapa.usageChartCanvas || document.querySelector('#line-capa-usage-chart');
    const chartEmpty = dom.lineCapa.usageChartEmpty || document.querySelector('#line-capa-usage-chart-empty');
    const legend = dom.lineCapa.usageLegend || document.querySelector('#line-capa-usage-legend');
    const legendList = dom.lineCapa.usageLegendList || document.querySelector('#line-capa-usage-legend-list');
    const legendHint = dom.lineCapa.usageLegendHint || document.querySelector('#line-capa-usage-legend-hint');
    const emptyState = dom.lineCapa.usageEmpty || document.querySelector('#line-capa-usage-empty');
    const contextElement = dom.lineCapa.usageContext || document.querySelector('#line-capa-usage-context');
    const chartTitle = dom.lineCapa.usageChartTitle || document.querySelector('#line-capa-usage-chart-title');

    if (!dom.lineCapa.usageChartTitle && chartTitle) {
        dom.lineCapa.usageChartTitle = chartTitle;
    }

    const defaultChartTitle = '라인별 자재 CAPA 점유율';
    const setChartTitle = (text) => {
        if (chartTitle) {
            chartTitle.textContent = text && text.trim() ? text : defaultChartTitle;
        }
    };
    setChartTitle(defaultChartTitle);

    if (!wrapper || !container || !canvas) {
        destroyLineCapaUsageChart({ preserveSummary: true });
        return;
    }

    const baseRecords = getLineCapaBaseRecords();
    const usageFilters = ensureLineCapaUsageFilters();
    const filteredRecords = filterRecordsByUsage(baseRecords);

    const filterChips = [];
    if (usageFilters.month !== 'all') filterChips.push(`월 ${usageFilters.month}`);
    if (usageFilters.category !== 'all') filterChips.push(`카테고리 ${usageFilters.category}`);
    if (usageFilters.line !== 'all') filterChips.push(`라인 ${usageFilters.line}`);
    const filterDescription = filterChips.length ? filterChips.join(' · ') : '현재 필터 조건';
    const baseFilterSummary = filterDescription;

    const resetLegend = () => {
        if (legendList) {
            legendList.innerHTML = '';
        }
        if (legend) {
            legend.classList.add('hidden');
        }
        if (legendHint) {
            legendHint.textContent = '라인별 CAPA 요약 카드에서 라인을 클릭하거나 Enter 키로 활성화하면 자재별 비중을 확인할 수 있습니다.';
        }
    };

    const showChartInstruction = (message, contextMessage) => {
        setChartTitle(defaultChartTitle);
        destroyLineCapaUsageChart({ preserveSummary: true });
        if (container) {
            container.classList.add('hidden');
        }
        if (chartEmpty) {
            chartEmpty.textContent = message;
            chartEmpty.classList.remove('hidden');
        }
        resetLegend();
        if (contextElement) {
            contextElement.textContent = contextMessage;
        }
    };

    if (filteredRecords.length === 0) {
        if (emptyState) {
            emptyState.textContent = `${filterDescription}에 해당하는 데이터가 없습니다.`;
            emptyState.classList.remove('hidden');
        }
        showChartInstruction('조건에 맞는 데이터가 없습니다. 월·라인·카테고리 필터를 확인해 주세요.', `${filterDescription} 기준 자재별 CAPA 점유율을 확인할 수 없습니다.`);
        updateLineCapaUsageSummaryChart([], usageFilters, { filterSummary: baseFilterSummary });
        return;
    }

    if (emptyState) {
        emptyState.classList.add('hidden');
    }

    const usageEntries = buildLineCapaUsageEntries(filteredRecords);
    const validEntries = usageEntries.filter((entry) => Number.isFinite(entry.capacity) && entry.capacity > 0);
    const excludedCount = usageEntries.length - validEntries.length;

    if (validEntries.length === 0) {
        showChartInstruction(`${filterDescription}에 대한 CAPA 정보가 없어 그래프를 표시할 수 없습니다.`, `${filterDescription} 기준 자재별 CAPA 점유율을 확인할 수 없습니다.`);
        updateLineCapaUsageSummaryChart([], usageFilters, { filterSummary: baseFilterSummary });
        return;
    }

    const hasPositiveProduction = validEntries.some((entry) => Number.isFinite(entry.totalProduction) && entry.totalProduction > 0);
    if (!hasPositiveProduction) {
        showChartInstruction(`${filterDescription}에 대한 생산 계획 수량이 없어 그래프를 표시할 수 없습니다.`, `${filterDescription} 기준 자재별 CAPA 점유율을 확인할 수 없습니다.`);
        updateLineCapaUsageSummaryChart([], usageFilters, { filterSummary: baseFilterSummary });
        return;
    }

    const monthSet = new Set(validEntries
        .map((entry) => sanitizeText(entry.month).trim())
        .filter((value) => value && value !== '-'));

    let monthText;
    if (usageFilters.month !== 'all') {
        monthText = `${usageFilters.month} 기준`;
    } else if (monthSet.size === 0) {
        monthText = '월 정보 미지정';
    } else if (monthSet.size === 1) {
        monthText = `${Array.from(monthSet)[0]} 기준`;
    } else {
        monthText = `${monthSet.size.toLocaleString('ko-KR')}개월 기준`;
    }

    const detailFilters = [];
    if (usageFilters.category !== 'all') {
        detailFilters.push(`카테고리 ${usageFilters.category}`);
    }
    if (usageFilters.line !== 'all') {
        detailFilters.push(`라인 ${usageFilters.line}`);
    }
    const summaryFilter = detailFilters.length ? `${monthText} · ${detailFilters.join(' · ')}` : monthText;

    updateLineCapaUsageSummaryChart(validEntries, usageFilters, {
        filterSummary: summaryFilter,
        monthSet,
        excludedCount,
    });

    const selectedKey = state.lineCapaActiveKey || state.lineCapaSelectedLineKey;
    const selectedEntry = selectedKey
        ? validEntries.find((entry) => entry.lineKey === selectedKey || entry.baseKey === selectedKey)
        : null;

    if (!selectedEntry) {
        showChartInstruction('라인별 CAPA 요약 카드에서 라인을 클릭하거나 Enter 키로 활성화하면 자재별 CAPA 점유율 그래프가 표시됩니다.', `${summaryFilter} · 라인을 클릭하거나 Enter 키로 활성화하면 자재별 CAPA 점유율을 확인할 수 있습니다.`);
        return;
    }

    const capacity = Number.isFinite(selectedEntry.capacity) && selectedEntry.capacity > 0
        ? selectedEntry.capacity
        : null;
    if (!capacity) {
        showChartInstruction(`${selectedEntry.month} · ${selectedEntry.displayCategory} · ${selectedEntry.line} 라인에 등록된 CAPA 정보가 없어 그래프를 표시할 수 없습니다.`, `${summaryFilter} · CAPA 정보 미등록`);
        return;
    }

    const itemEntries = Array.from((selectedEntry.items || new Map()).entries())
        .map(([code, itemData]) => ({
            code,
            name: sanitizeText(itemData.itemName).trim(),
            quantity: Number.isFinite(itemData.quantity) ? itemData.quantity : 0,
        }))
        .filter((item) => item.quantity > 0)
        .sort((a, b) => b.quantity - a.quantity || sanitizeText(a.code).localeCompare(sanitizeText(b.code)));

    if (itemEntries.length === 0) {
        showChartInstruction(`${selectedEntry.month} · ${selectedEntry.displayCategory} · ${selectedEntry.line} 라인의 자재별 생산 계획이 없어 그래프를 표시할 수 없습니다.`, `${summaryFilter} · 자재별 생산 계획 없음`);
        return;
    }

    const totalProduction = itemEntries.reduce((sum, item) => sum + item.quantity, 0);
    if (!Number.isFinite(totalProduction) || totalProduction <= 0) {
        showChartInstruction(`${selectedEntry.month} · ${selectedEntry.displayCategory} · ${selectedEntry.line} 라인의 생산 계획 수량이 없어 그래프를 표시할 수 없습니다.`, `${summaryFilter} · 생산 계획 없음`);
        return;
    }

    const maxRatio = itemEntries.reduce((acc, item) => {
        const ratio = item.quantity / capacity;
        return Number.isFinite(ratio) && ratio > acc ? ratio : acc;
    }, totalProduction / capacity);
    const suggestedMax = Number.isFinite(maxRatio) && maxRatio > 1 ? Math.min(maxRatio * 1.1, 2.5) : 1;

    destroyLineCapaUsageChart({ preserveSummary: true });

    if (chartEmpty) {
        chartEmpty.classList.add('hidden');
    }
    container.classList.remove('hidden');

    const lineLabel = `${selectedEntry.month} · ${selectedEntry.displayCategory} · ${selectedEntry.line}`;
    setChartTitle(`${lineLabel} 라인의 자재별 CAPA 점유율`);

    const datasets = itemEntries.map((item, index) => {
        const color = LINE_CAPA_USAGE_COLORS[index % LINE_CAPA_USAGE_COLORS.length];
        const labelName = item.name ? `${item.code} (${item.name})` : item.code;
        return {
            label: labelName,
            data: [item.quantity / capacity],
            quantities: [item.quantity],
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 22,
            maxBarThickness: 22,
            categoryPercentage: 0.6,
            barPercentage: 0.9,
        };
    });

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1280;
    let desiredHeight = 240;
    if (viewportWidth <= 480) {
        desiredHeight = 200;
    } else if (viewportWidth <= 1024) {
        desiredHeight = 220;
    }
    canvas.height = desiredHeight;
    canvas.style.height = `${desiredHeight}px`;

    const chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: [lineLabel],
            datasets,
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 0,
                    bottom: 0,
                },
            },
            scales: {
                x: {
                    stacked: true,
                    min: 0,
                    max: suggestedMax,
                    title: {
                        display: true,
                        text: 'CAPA 대비 비율',
                        font: {
                            family: 'Noto Sans KR',
                            weight: '600',
                        },
                    },
                    afterBuildTicks(axis) {
                        if (!axis || !Array.isArray(axis.ticks)) return;
                        const hasHundred = axis.ticks.some((tick) => Number(tick.value) === 1);
                        if (!hasHundred && axis.max >= 1 && axis.min <= 1) {
                            axis.ticks.push({ value: 1 });
                            axis.ticks.sort((a, b) => Number(a.value) - Number(b.value));
                        }
                    },
                    ticks: {
                        font: {
                            family: 'Noto Sans KR',
                        },
                        callback(value) {
                            if (!Number.isFinite(value)) return value;
                            return formatPercent(value, value >= 1 ? 0 : 1);
                        },
                    },
                    grid: {
                        drawBorder: false,
                        color() {
                            return 'rgba(148, 163, 184, 0.2)';
                        },
                        lineWidth() {
                            return 0.6;
                        },
                    },
                },
                y: {
                    stacked: true,
                    ticks: {
                        display: false,
                        padding: 0,
                    },
                    grid: {
                        display: false,
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        title() {
                            return lineLabel;
                        },
                        label(context) {
                            const ratio = context.parsed.x;
                            const quantities = context.dataset.quantities || [];
                            const quantity = quantities[context.dataIndex];
                            const ratioText = Number.isFinite(ratio)
                                ? formatPercent(ratio, ratio >= 1 ? 0 : 1)
                                : '0%';
                            const quantityText = Number.isFinite(quantity)
                                ? `${formatNumber(quantity)} EA`
                                : '-';
                            return `${context.dataset.label}: ${ratioText} (${quantityText})`;
                        },
                        footer() {
                            const ratioValue = totalProduction / capacity;
                            const ratioText = Number.isFinite(ratioValue)
                                ? formatPercent(ratioValue, ratioValue >= 1 ? 0 : 1)
                                : '-';
                            return `총 생산 ${formatNumber(totalProduction)} EA / CAPA ${formatNumber(capacity)} EA · ${ratioText}`;
                        },
                    },
                },
            },
        },
    });

    state.lineCapaUsageCharts = [chart];

    if (legendList) {
        legendList.innerHTML = '';
        itemEntries.forEach((item, index) => {
            const ratio = item.quantity / capacity;
            const color = LINE_CAPA_USAGE_COLORS[index % LINE_CAPA_USAGE_COLORS.length];
            const labelName = item.name ? `${item.code} (${item.name})` : item.code;

            const listItem = document.createElement('li');
            listItem.className = 'line-capa-usage-legend-item';
            listItem.setAttribute('role', 'listitem');

            const main = document.createElement('div');
            main.className = 'line-capa-usage-legend-item-main';

            const colorSwatch = document.createElement('span');
            colorSwatch.className = 'line-capa-usage-legend-color';
            colorSwatch.style.backgroundColor = color;
            colorSwatch.setAttribute('aria-hidden', 'true');

            const textWrapper = document.createElement('div');
            textWrapper.className = 'line-capa-usage-legend-texts';

            const labelSpan = document.createElement('span');
            labelSpan.className = 'line-capa-usage-legend-label';
            labelSpan.textContent = labelName;

            const detailSpan = document.createElement('span');
            detailSpan.className = 'line-capa-usage-legend-detail';
            detailSpan.textContent = `생산 ${formatNumber(item.quantity)} EA`;

            textWrapper.appendChild(labelSpan);
            textWrapper.appendChild(detailSpan);
            main.appendChild(colorSwatch);
            main.appendChild(textWrapper);

            const ratioSpan = document.createElement('span');
            ratioSpan.className = 'line-capa-usage-legend-ratio';
            ratioSpan.textContent = formatPercent(ratio, ratio >= 1 ? 0 : 1);

            listItem.appendChild(main);
            listItem.appendChild(ratioSpan);
            legendList.appendChild(listItem);
        });
    }

    if (legend) {
        legend.classList.remove('hidden');
    }

    if (legendHint) {
        const ratioValue = totalProduction / capacity;
        const ratioText = Number.isFinite(ratioValue)
            ? formatPercent(ratioValue, ratioValue >= 1 ? 0 : 1)
            : '-';
        legendHint.textContent = `총 생산 ${formatNumber(totalProduction)} EA / CAPA ${formatNumber(capacity)} EA · ${ratioText}`;
    }

    if (contextElement) {
        contextElement.textContent = `${lineLabel} 라인의 자재별 CAPA 점유율`;
    }
}

function updateLineCapaUsageSummaryChart(entries, filters, options = {}) {
    const summarySection = dom.lineCapa.usageSummarySection || document.querySelector('.line-capa-usage-summary');
    const chartContainer = dom.lineCapa.usageSummaryChartContainer || document.querySelector('.line-capa-usage-summary-chart');
    const canvas = dom.lineCapa.usageSummaryCanvas || document.querySelector('#line-capa-usage-summary-chart');
    const emptyState = dom.lineCapa.usageSummaryEmpty || document.querySelector('#line-capa-usage-summary-empty');
    const contextElement = dom.lineCapa.usageSummaryContext || document.querySelector('#line-capa-usage-summary-context');

    if (!summarySection || !chartContainer || !canvas) {
        if (state.lineCapaUsageSummaryChart && typeof state.lineCapaUsageSummaryChart.destroy === 'function') {
            state.lineCapaUsageSummaryChart.destroy();
            state.lineCapaUsageSummaryChart = null;
        }
        return;
    }

    const safeEntries = Array.isArray(entries) ? entries : [];
    const safeFilters = filters || ensureLineCapaUsageFilters();
    const {
        filterSummary = '',
        monthSet: monthSetOption,
        excludedCount: excludedCountOption,
    } = options || {};
    const monthSet = monthSetOption instanceof Set
        ? monthSetOption
        : new Set(safeEntries.map((entry) => sanitizeText(entry.month).trim()).filter(Boolean));
    const excludedCount = Number.isFinite(excludedCountOption) ? excludedCountOption : 0;

    const destroySummaryChart = () => {
        if (state.lineCapaUsageSummaryChart && typeof state.lineCapaUsageSummaryChart.destroy === 'function') {
            state.lineCapaUsageSummaryChart.destroy();
            state.lineCapaUsageSummaryChart = null;
        }
    };

    const showEmptyState = (message, contextMessage) => {
        destroySummaryChart();
        if (chartContainer) {
            chartContainer.classList.add('hidden');
        }
        if (emptyState) {
            emptyState.textContent = message
                || '월을 선택하면 라인별 CAPA 대비 점유율을 가로 막대 그래프로 확인할 수 있습니다.';
            emptyState.classList.remove('hidden');
        }
        if (contextElement) {
            contextElement.textContent = contextMessage
                || '월 필터를 선택하면 해당 월의 라인별 CAPA 대비 점유율을 한눈에 확인할 수 있습니다.';
        }
    };

    const rawMonth = sanitizeText(safeFilters.month).trim();
    let targetMonth = '';
    if (rawMonth && rawMonth !== 'all') {
        targetMonth = rawMonth;
    } else if (monthSet.size === 1) {
        targetMonth = Array.from(monthSet)[0];
    }

    if (!targetMonth) {
        const defaultContext = filterSummary
            ? `${filterSummary} · 월 기준 요약 그래프는 월 필터 선택 후 표시됩니다.`
            : '월 필터를 선택하면 해당 월의 라인별 CAPA 대비 점유율을 한눈에 확인할 수 있습니다.';
        showEmptyState('월을 선택하면 라인별 CAPA 대비 점유율을 가로 막대 그래프로 확인할 수 있습니다.', defaultContext);
        return;
    }

    const monthlyEntries = safeEntries.filter((entry) => sanitizeText(entry.month).trim() === targetMonth);
    if (monthlyEntries.length === 0) {
        const emptyContext = filterSummary
            ? `${targetMonth} 기준 데이터가 없습니다. ${filterSummary}`
            : `${targetMonth} 기준 데이터가 없습니다. 다른 필터를 확인해 주세요.`;
        showEmptyState('선택한 월에 해당하는 라인 데이터가 없습니다. 필터 조건을 확인해 주세요.', emptyContext);
        return;
    }

    const aggregates = new Map();
    monthlyEntries.forEach((entry) => {
        if (!entry) return;
        const lineName = sanitizeText(entry.line).trim() || '라인 미지정';
        const aggregateKey = lineName.toLowerCase();
        if (!aggregates.has(aggregateKey)) {
            aggregates.set(aggregateKey, {
                line: lineName,
                categories: new Set(),
                totalProduction: 0,
                capacity: null,
            });
        }
        const aggregate = aggregates.get(aggregateKey);
        aggregate.categories.add(sanitizeText(entry.lineCategory).trim() || '카테고리 미지정');
        const production = Number.isFinite(entry.totalProduction) ? entry.totalProduction : 0;
        aggregate.totalProduction += production;
        const capacity = Number.isFinite(entry.capacity) && entry.capacity > 0 ? entry.capacity : null;
        if (capacity !== null) {
            if (!Number.isFinite(aggregate.capacity) || aggregate.capacity < capacity) {
                aggregate.capacity = capacity;
            }
        }
    });

    const rows = Array.from(aggregates.values())
        .map((aggregate) => {
            const capacity = Number.isFinite(aggregate.capacity) && aggregate.capacity > 0
                ? aggregate.capacity
                : null;
            const ratio = capacity ? aggregate.totalProduction / capacity : null;
            return {
                line: aggregate.line,
                categories: Array.from(aggregate.categories)
                    .map((category) => sanitizeText(category).trim())
                    .filter((category) => category && category !== '카테고리 미지정'),
                totalProduction: aggregate.totalProduction,
                capacity,
                ratio: Number.isFinite(ratio) ? ratio : 0,
            };
        })
        .filter((row) => Number.isFinite(row.capacity) && row.capacity > 0);

    if (rows.length === 0) {
        const emptyContext = `${targetMonth} 기준 CAPA 정보가 등록된 라인이 없습니다.`;
        showEmptyState('선택한 월에 대해 CAPA 정보가 등록된 라인이 없어 그래프를 표시할 수 없습니다.', emptyContext);
        return;
    }

    rows.sort((a, b) => {
        if (b.ratio !== a.ratio) {
            return b.ratio - a.ratio;
        }
        return sanitizeText(a.line).localeCompare(sanitizeText(b.line));
    });

    destroySummaryChart();

    if (emptyState) {
        emptyState.classList.add('hidden');
    }
    chartContainer.classList.remove('hidden');

    const labels = rows.map((row) => row.line);
    const data = rows.map((row) => row.ratio);
    const productionValues = rows.map((row) => row.totalProduction);
    const capacityValues = rows.map((row) => row.capacity);
    const categoryValues = rows.map((row) => row.categories);

    const ratioMax = rows.reduce((acc, row) => Math.max(acc, row.ratio), 0);
    const suggestedMax = ratioMax > 1 ? ratioMax * 1.1 : 1;

    const chartHeight = Math.max(160, rows.length * 46);
    canvas.height = chartHeight;
    canvas.style.height = `${chartHeight}px`;

    const summaryDataLabelPlugin = {
        id: 'lineCapaUsageSummaryDataLabels',
        afterDatasetsDraw(chart, args, pluginOptions) {
            if (!chart || typeof chart.getDatasetMeta !== 'function') {
                return;
            }
            const datasets = chart.data && Array.isArray(chart.data.datasets)
                ? chart.data.datasets
                : null;
            if (!datasets || datasets.length === 0) {
                return;
            }
            const dataset = datasets[0];
            if (!dataset) {
                return;
            }
            const meta = chart.getDatasetMeta(0);
            if (!meta || !Array.isArray(meta.data)) {
                return;
            }

            const ctx = chart.ctx;
            const chartArea = chart.chartArea || {};
            const options = pluginOptions || {};
            const color = options.color || 'rgba(15, 23, 42, 0.88)';
            const offset = Number.isFinite(options.offset) ? options.offset : 12;
            const fontOptions = options.font || {};
            const fontFamily = fontOptions.family || 'Noto Sans KR';
            const fontWeight = fontOptions.weight || '600';
            const fontSize = Number.isFinite(fontOptions.size) ? fontOptions.size : 12;

            ctx.save();
            ctx.font = `${fontWeight} ${fontSize}px '${fontFamily}'`;
            ctx.fillStyle = color;
            ctx.textBaseline = 'middle';

            meta.data.forEach((element, index) => {
                const rawValue = dataset.data[index];
                if (!Number.isFinite(rawValue)) {
                    return;
                }
                const labelText = formatPercent(rawValue, rawValue >= 1 ? 0 : 1);
                let position;
                if (element && typeof element.tooltipPosition === 'function') {
                    position = element.tooltipPosition(false);
                }
                const baseX = position && Number.isFinite(position.x) ? position.x : element.x;
                const baseY = position && Number.isFinite(position.y) ? position.y : element.y;
                if (!Number.isFinite(baseX) || !Number.isFinite(baseY)) {
                    return;
                }
                let textX = baseX + offset;
                ctx.textAlign = 'left';

                const textWidth = ctx.measureText(labelText).width;
                const rightLimit = Number.isFinite(chartArea.right) ? chartArea.right - 4 : textX + textWidth;
                if (textX + textWidth > rightLimit) {
                    textX = rightLimit;
                    ctx.textAlign = 'right';
                }
                ctx.fillText(labelText, textX, baseY);
            });

            ctx.restore();
        },
    };

    const summaryReferenceLinePlugin = {
        id: 'lineCapaUsageSummaryReferenceLine',
        afterDatasetsDraw(chart, args, pluginOptions) {
            if (!chart) return;
            if (pluginOptions && pluginOptions.enabled === false) {
                return;
            }
            const xScale = chart.scales && chart.scales.x ? chart.scales.x : null;
            const yScale = chart.scales && chart.scales.y ? chart.scales.y : null;
            const area = chart.chartArea;
            if (!xScale || !yScale || !area) return;

            const referenceValue = Number.isFinite(pluginOptions && pluginOptions.value)
                ? pluginOptions.value
                : 1;
            if (referenceValue < xScale.min || referenceValue > xScale.max) {
                return;
            }

            const xPos = xScale.getPixelForValue(referenceValue);
            if (!Number.isFinite(xPos)) {
                return;
            }

            const ctx = chart.ctx;
            const color = (pluginOptions && pluginOptions.color)
                || 'rgba(148, 163, 184, 0.2)';
            const lineWidth = Number.isFinite(pluginOptions && pluginOptions.lineWidth)
                ? pluginOptions.lineWidth
                : 0.8;
            const borderDash = Array.isArray(pluginOptions && pluginOptions.borderDash)
                ? pluginOptions.borderDash
                : [];
            const label = pluginOptions && pluginOptions.label ? String(pluginOptions.label) : '';
            const fontOptions = (pluginOptions && pluginOptions.font) || {};
            const fontFamily = fontOptions.family || 'Noto Sans KR';
            const fontWeight = fontOptions.weight || '600';
            const fontSize = Number.isFinite(fontOptions.size) ? fontOptions.size : 11;
            const labelOffsetY = Number.isFinite(pluginOptions && pluginOptions.labelOffsetY)
                ? pluginOptions.labelOffsetY
                : 10;

            ctx.save();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;
            ctx.setLineDash(borderDash);
            ctx.beginPath();
            ctx.moveTo(xPos, area.top);
            ctx.lineTo(xPos, area.bottom);
            ctx.stroke();
            ctx.restore();

            if (label) {
                ctx.save();
                ctx.font = `${fontWeight} ${fontSize}px '${fontFamily}'`;
                ctx.fillStyle = color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(label, xPos, area.top + labelOffsetY);
                ctx.restore();
            }
        },
    };

    state.lineCapaUsageSummaryChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'CAPA 대비 점유율',
                    data,
                    backgroundColor: 'rgba(96, 165, 250, 0.85)',
                    borderColor: 'rgba(96, 165, 250, 1)',
                    borderWidth: 1,
                    borderRadius: 8,
                    borderSkipped: false,
                    barThickness: 20,
                    maxBarThickness: 24,
                },
            ],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 8,
                    bottom: 8,
                },
            },
            scales: {
                x: {
                    min: 0,
                    max: suggestedMax,
                    afterBuildTicks(axis) {
                        if (!axis || !Array.isArray(axis.ticks)) return;
                        const hasHundred = axis.ticks.some((tick) => Number(tick.value) === 1);
                        if (!hasHundred && axis.max >= 1 && axis.min <= 1) {
                            axis.ticks.push({ value: 1 });
                            axis.ticks.sort((a, b) => Number(a.value) - Number(b.value));
                        }
                    },
                    title: {
                        display: true,
                        text: 'CAPA 대비 점유율',
                        font: {
                            family: 'Noto Sans KR',
                            weight: '600',
                        },
                    },
                    ticks: {
                        font: {
                            family: 'Noto Sans KR',
                        },
                        callback(value) {
                            if (!Number.isFinite(value)) return value;
                            return formatPercent(value, value >= 1 ? 0 : 1);
                        },
                    },
                    grid: {
                        drawBorder: false,
                        color() {
                            return 'rgba(148, 163, 184, 0.2)';
                        },
                        lineWidth() {
                            return 0.8;
                        },
                    },
                },
                y: {
                    ticks: {
                        font: {
                            family: 'Noto Sans KR',
                            weight: '500',
                        },
                    },
                    grid: {
                        display: false,
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                lineCapaUsageSummaryDataLabels: {
                    color: 'rgba(30, 64, 175, 0.95)',
                    offset: 12,
                    font: {
                        family: 'Noto Sans KR',
                        weight: '600',
                        size: 12,
                    },
                },
                lineCapaUsageSummaryReferenceLine: {
                    enabled: false,
                },
                tooltip: {
                    callbacks: {
                        title(contexts) {
                            if (!Array.isArray(contexts) || contexts.length === 0) {
                                return targetMonth;
                            }
                            const index = contexts[0].dataIndex;
                            const lineLabel = labels[index] || '';
                            return `${targetMonth} · ${lineLabel}`;
                        },
                        label(context) {
                            const ratioValue = context.parsed.x;
                            return `점유율: ${formatPercent(ratioValue, ratioValue >= 1 ? 0 : 1)}`;
                        },
                        afterBody(contexts) {
                            if (!Array.isArray(contexts) || contexts.length === 0) {
                                return [];
                            }
                            const index = contexts[0].dataIndex;
                            const production = productionValues[index];
                            const capacity = capacityValues[index];
                            const categories = categoryValues[index];
                            const detailLines = [
                                `총 생산: ${Number.isFinite(production) ? `${formatNumber(production)} EA` : '-'}`,
                                `CAPA: ${Number.isFinite(capacity) ? `${formatNumber(capacity)} EA` : '-'}`,
                            ];
                            if (Array.isArray(categories) && categories.length > 0) {
                                detailLines.push(`카테고리: ${categories.join(', ')}`);
                            } else {
                                detailLines.push('카테고리: 미지정');
                            }
                            return detailLines;
                        },
                    },
                },
            },
        },
        plugins: [summaryDataLabelPlugin],
    });

    if (contextElement) {
        const categoryFilter = sanitizeFilterValue(safeFilters.category);
        const lineFilter = sanitizeFilterValue(safeFilters.line);
        const contextParts = [
            `${targetMonth} 기준 라인별 CAPA 대비 점유율 요약`,
            `${rows.length.toLocaleString('ko-KR')}개 라인 비교`,
        ];
        if (categoryFilter !== 'all') {
            contextParts.push(`카테고리 ${categoryFilter}`);
        }
        if (lineFilter !== 'all') {
            contextParts.push(`라인 ${lineFilter}`);
        }
        if (excludedCount > 0) {
            contextParts.push(`CAPA 미등록 ${excludedCount.toLocaleString('ko-KR')}개 제외`);
        }
        contextElement.textContent = contextParts.join(' · ');
    }
}

function setActiveLineCapaCard(cardElement) {
    if (!dom.lineCapa.cards) return;
    const cards = Array.from(dom.lineCapa.cards.querySelectorAll('.line-capa-card'));
    cards.forEach((card) => {
        card.classList.remove('active');
        card.setAttribute('aria-pressed', 'false');
    });
    if (cardElement) {
        cardElement.classList.add('active');
        cardElement.setAttribute('aria-pressed', 'true');
    }
}

function buildLineCapaTrendData(lineName, baseMonth, category = '') {
    const months = buildMonthSequence(baseMonth, 3);
    const sanitizedLine = sanitizeText(lineName).trim();
    const normalizedCategory = sanitizeText(category).trim().toLowerCase();
    const source = Array.isArray(state.enrichedData) ? state.enrichedData : [];
    return months.map((month) => {
        if (!month) {
            return {
                month: null,
                production: null,
                capacity: null,
            };
        }
        const monthRecords = source.filter((record) => {
            const recordLine = sanitizeText(record.production_line).trim();
            const recordCategory = sanitizeText(record.lineCategory ?? record.category).trim().toLowerCase();
            if (recordLine !== sanitizedLine) return false;
            if (normalizedCategory && recordCategory !== normalizedCategory) return false;
            return record.month === month;
        });
        if (monthRecords.length === 0) {
            return {
                month,
                production: null,
                capacity: null,
            };
        }
        const reference = monthRecords.find((record) => Number.isFinite(record.lineTotalProduction)
            || Number.isFinite(record.lineCapacityLimit)) || monthRecords[0];

        let production = reference && Number.isFinite(reference.lineTotalProduction)
            ? reference.lineTotalProduction
            : monthRecords.reduce((sum, record) => sum + toNumber(record.production_plan), 0);
        let capacity = reference && Number.isFinite(reference.lineCapacityLimit)
            ? reference.lineCapacityLimit
            : null;

        if (!Number.isFinite(capacity) || capacity === 0) {
            const capacityRecord = monthRecords.find((record) => Number.isFinite(record.capacity_limit) && record.capacity_limit > 0);
            if (capacityRecord) {
                capacity = capacityRecord.capacity_limit;
            }
        }

        production = Number.isFinite(production) ? production : null;
        capacity = Number.isFinite(capacity) ? capacity : null;

        return {
            month,
            production,
            capacity,
        };
    });
}

function renderLineCapaTrendChart(item, cardElement) {
    if (!item || !dom.lineCapa.canvas) return;

    const trendSection = dom.lineCapa.trendSection
        || (dom.lineCapa.chartContainer ? dom.lineCapa.chartContainer.closest('.line-capa-usage-trend') : null);
    if (trendSection) {
        trendSection.classList.remove('hidden');
    }
    if (dom.lineCapa.chartContainer) {
        dom.lineCapa.chartContainer.classList.remove('hidden');
    }

    const categoryFilter = item.lineCategory ? item.lineCategory : '';
    const trendData = buildLineCapaTrendData(item.lineSource || item.line, item.month, categoryFilter);
    const labels = trendData.map((entry) => entry.month || '-');
    const productionData = trendData.map((entry) => (Number.isFinite(entry.production) ? entry.production : null));
    const capacityData = trendData.map((entry) => (Number.isFinite(entry.capacity) ? entry.capacity : null));
    const hasProduction = productionData.some((value) => Number.isFinite(value));
    const hasCapacity = capacityData.some((value) => Number.isFinite(value));

    setActiveLineCapaCard(cardElement);
    const displayCategory = item.displayCategory || item.lineCategory || '카테고리 미지정';

    if (!hasProduction && !hasCapacity) {
        destroyLineCapaChart();
        showLineCapaChartPlaceholder(`${item.month} · ${displayCategory} · ${item.line} 라인의 월별 추이 데이터가 없습니다.`);
        return;
    }

    if (dom.lineCapa.placeholder) {
        dom.lineCapa.placeholder.classList.add('hidden');
    }
    dom.lineCapa.canvas.classList.remove('hidden');

    destroyLineCapaChart();

    const lineKey = item.lineKey
        || getLineCompositeKey(item.lineSource || item.line, categoryFilter, item.month)
        || getLineKey(item.lineSource || item.line, item.month);
    state.lineCapaChart = new Chart(dom.lineCapa.canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: '총 생산량 (EA)',
                    data: productionData,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.25)',
                    tension: 0.32,
                    fill: false,
                    spanGaps: true,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#2563eb',
                },
                {
                    label: 'CAPA (EA)',
                    data: capacityData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.18)',
                    tension: 0.32,
                    fill: false,
                    spanGaps: true,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#10b981',
                    borderDash: [6, 4],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: 'Noto Sans KR',
                        },
                    },
                },
                tooltip: {
                    callbacks: {
                        label(context) {
                            const value = context.parsed.y;
                            if (!Number.isFinite(value)) {
                                return `${context.dataset.label}: 데이터 없음`;
                            }
                            return `${context.dataset.label}: ${formatNumber(value)} EA`;
                        },
                        afterBody(context) {
                            if (!context.length) return '';
                            const index = context[0].dataIndex;
                            const production = productionData[index];
                            const capacity = capacityData[index];
                            if (Number.isFinite(production) && Number.isFinite(capacity) && capacity > 0) {
                                return `CAPA 대비: ${formatPercent(production / capacity)}`;
                            }
                            return '';
                        },
                    },
                },
                title: {
                    display: true,
                    text: `${item.month} · ${displayCategory} · ${item.line} 기준 3개월 추이`,
                    font: {
                        family: 'Noto Sans KR',
                        size: 14,
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '계획 월',
                        font: {
                            family: 'Noto Sans KR',
                        },
                    },
                    ticks: {
                        font: {
                            family: 'Noto Sans KR',
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: '수량 (EA)',
                        font: {
                            family: 'Noto Sans KR',
                        },
                    },
                    beginAtZero: true,
                    ticks: {
                        callback(value) {
                            return `${Number(value).toLocaleString('ko-KR')} EA`;
                        },
                        font: {
                            family: 'Noto Sans KR',
                        },
                    },
                },
            },
        },
    });

    state.lineCapaActiveKey = lineKey;
    updateLineCapaUsageChart();
}

function updateLineCapaChart() {
    updateLineCapaUsageChart();
    if (!dom.lineCapa.canvas || !dom.lineCapa.chartContainer) return;

    const filters = ensureLineCapaUsageFilters();
    if (dom.lineCapa.empty && !dom.lineCapa.empty.dataset.defaultText) {
        dom.lineCapa.empty.dataset.defaultText = dom.lineCapa.empty.textContent || '';
    }
    const filterChips = [];
    if (filters.month !== 'all') filterChips.push(`월 ${filters.month}`);
    if (filters.category !== 'all') filterChips.push(`카테고리 ${filters.category}`);
    if (filters.line !== 'all') filterChips.push(`라인 ${filters.line}`);
    const filterDescription = filterChips.length ? filterChips.join(' · ') : '현재 필터 조건';

    const previousActiveKey = state.lineCapaActiveKey;
    const baseRecords = getLineCapaBaseRecords();
    const filteredRecords = filterRecordsByUsage(baseRecords);

    const aggregatesMap = new Map();
    filteredRecords.forEach((record) => {
        const aggregateKey = record.lineKeyBase
            || record.lineKey
            || getLineKey(record.production_line, record.month);
        if (!aggregateKey) return;

        const lineRaw = sanitizeText(record.production_line).trim();
        const lineName = lineRaw || '미지정';
        const monthValue = sanitizeText(record.month).trim() || '-';
        const categoryLabel = sanitizeText(record.lineCategory ?? record.category).trim() || '미지정';

        if (!aggregatesMap.has(aggregateKey)) {
            aggregatesMap.set(aggregateKey, {
                lineKey: aggregateKey,
                line: lineName,
                lineSource: lineRaw,
                month: monthValue,
                categories: new Set(),
                production: null,
                capacity: null,
                ratio: null,
            });
        }

        const aggregate = aggregatesMap.get(aggregateKey);
        aggregate.categories.add(categoryLabel);

        if (Number.isFinite(record.lineTotalProduction)) {
            aggregate.production = record.lineTotalProduction;
        } else if (!Number.isFinite(aggregate.production)) {
            aggregate.production = toNumber(record.production_plan);
        }

        if (Number.isFinite(record.lineCapacityLimit) && record.lineCapacityLimit > 0) {
            aggregate.capacity = record.lineCapacityLimit;
        } else if (!Number.isFinite(aggregate.capacity) && Number.isFinite(record.capacity_limit) && record.capacity_limit > 0) {
            aggregate.capacity = record.capacity_limit;
        }

        if (Number.isFinite(record.lineCapacityRatio)) {
            aggregate.ratio = record.lineCapacityRatio;
        }
    });

    const aggregates = Array.from(aggregatesMap.values()).map((item) => {
        const categoryList = Array.from(item.categories)
            .sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));
        const productionValue = Number.isFinite(item.production) ? item.production : 0;
        const rawCapacity = Number.isFinite(item.capacity) && item.capacity > 0 ? item.capacity : null;
        const ratioValue = Number.isFinite(item.ratio)
            ? item.ratio
            : (rawCapacity ? productionValue / rawCapacity : null);
        const diffValue = rawCapacity ? productionValue - rawCapacity : null;
        const lineCategoryValue = categoryList.length === 1 ? categoryList[0] : '';
        const displayCategory = categoryList.length > 0
            ? categoryList.join(', ')
            : '카테고리 미지정';

        return {
            ...item,
            categories: categoryList,
            lineCategory: lineCategoryValue,
            displayCategory,
            production: productionValue,
            capacity: rawCapacity,
            ratio: ratioValue,
            diff: diffValue,
        };
    }).sort((a, b) => {
        const monthCompare = sanitizeText(a.month).localeCompare(sanitizeText(b.month));
        if (monthCompare !== 0) return monthCompare;
        return sanitizeText(a.line).localeCompare(sanitizeText(b.line));
    });

    const cardsContainer = dom.lineCapa.cards || document.querySelector('#line-capa-cards');
    const cardsWrapper = dom.lineCapa.cardsWrapper || (cardsContainer ? cardsContainer.closest('#line-capa-cards-wrapper') : null);
    const trendSection = dom.lineCapa.trendSection
        || (dom.lineCapa.chartContainer ? dom.lineCapa.chartContainer.closest('.line-capa-usage-trend') : null);
    if (cardsContainer) {
        cardsContainer.innerHTML = '';
        cardsContainer.classList.add('hidden');
    }
    if (cardsWrapper) {
        cardsWrapper.classList.add('hidden');
    }

    if (aggregates.length === 0) {
        destroyLineCapaChart();
        dom.lineCapa.chartContainer.classList.add('hidden');
        if (trendSection) {
            trendSection.classList.add('hidden');
        }
        if (dom.lineCapa.empty) {
            const defaultText = dom.lineCapa.empty.dataset.defaultText || '조건에 맞는 라인 데이터가 없습니다. 필터를 조정해 주세요.';
            dom.lineCapa.empty.textContent = filterChips.length
                ? `${filterDescription}에 해당하는 라인 데이터가 없습니다.`
                : defaultText;
            dom.lineCapa.empty.classList.remove('hidden');
        }
        if (dom.lineCapa.placeholder) {
            dom.lineCapa.placeholder.classList.add('hidden');
        }
        if (cardsWrapper) {
            cardsWrapper.classList.add('hidden');
        }
        if (cardsContainer) {
            cardsContainer.classList.add('hidden');
        }
        state.lineCapaActiveKey = null;
        return;
    }

    dom.lineCapa.chartContainer.classList.remove('hidden');
    if (trendSection) {
        trendSection.classList.remove('hidden');
    }
    if (dom.lineCapa.empty) {
        dom.lineCapa.empty.classList.add('hidden');
        dom.lineCapa.empty.textContent = dom.lineCapa.empty.dataset.defaultText || '조건에 맞는 라인 데이터가 없습니다. 필터를 조정해 주세요.';
    }

    if (cardsWrapper) {
        cardsWrapper.classList.remove('hidden');
    }
    if (cardsContainer) {
        cardsContainer.classList.remove('hidden');
        const fragment = document.createDocumentFragment();
        aggregates.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'line-capa-card';
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-pressed', 'false');
            const displayCategory = item.displayCategory || '카테고리 미지정';
            card.setAttribute('aria-label', `${item.month} · ${displayCategory} · ${item.line} 라인 CAPA 카드`);
            card.dataset.lineKey = item.lineKey;
            card.dataset.line = item.line;
            card.dataset.lineSource = item.lineSource || '';
            card.dataset.month = item.month;
            card.dataset.lineCategory = item.lineCategory || '';
            card.dataset.displayCategory = displayCategory;

            const title = document.createElement('h4');
            title.textContent = `${item.month} · ${displayCategory} · ${item.line}`;
            card.appendChild(title);

            const statusTag = document.createElement('span');
            const status = buildCapacityStatus(item.ratio);
            statusTag.className = `status-tag ${status.className}`;
            statusTag.textContent = status.label;
            card.appendChild(statusTag);

            const metricProduction = document.createElement('div');
            metricProduction.className = 'metric';
            metricProduction.innerHTML = `<span>총 생산량</span><strong>${formatNumber(item.production)} EA</strong>`;

            const metricCapacity = document.createElement('div');
            metricCapacity.className = 'metric';
            const capacityText = Number.isFinite(item.capacity)
                ? `${formatNumber(item.capacity)} EA`
                : '-';
            metricCapacity.innerHTML = `<span>CAPA</span><strong>${capacityText}</strong>`;

            const metricRatio = document.createElement('div');
            metricRatio.className = 'metric';
            const ratioText = Number.isFinite(item.ratio) ? formatPercent(item.ratio) : '-';
            metricRatio.innerHTML = `<span>CAPA 대비</span><strong>${ratioText}</strong>`;

            const diffValue = Number.isFinite(item.diff) ? item.diff : null;
            const metricDiff = document.createElement('div');
            metricDiff.className = 'metric';
            let diffLabel = '초과 수량';
            let diffDisplay = '-';
            if (diffValue !== null) {
                if (diffValue > 0) {
                    diffLabel = '초과 수량';
                    diffDisplay = `+${formatNumber(diffValue)} EA`;
                } else if (diffValue < 0) {
                    diffLabel = '부족 수량';
                    diffDisplay = `${formatNumber(diffValue)} EA`;
                } else {
                    diffLabel = 'CAPA와 일치';
                    diffDisplay = '0 EA';
                }
            }
            metricDiff.innerHTML = `<span>${diffLabel}</span><strong>${diffDisplay}</strong>`;

            card.appendChild(metricProduction);
            card.appendChild(metricCapacity);
            card.appendChild(metricRatio);
            card.appendChild(metricDiff);

            const activate = () => renderLineCapaTrendChart(item, card);
            card.addEventListener('click', (event) => {
                event.preventDefault();
                activate();
            });
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    activate();
                }
            });

            fragment.appendChild(card);
        });
        cardsContainer.appendChild(fragment);
    }

    const restoredItem = previousActiveKey
        ? aggregates.find((item) => item.lineKey === previousActiveKey)
        : null;

    if (restoredItem && cardsContainer) {
        const restoredCard = Array.from(cardsContainer.querySelectorAll('.line-capa-card'))
            .find((card) => card.dataset.lineKey === restoredItem.lineKey);
        if (restoredCard) {
            renderLineCapaTrendChart(restoredItem, restoredCard);
            return;
        }
    }

    showLineCapaChartPlaceholder();
}

// -------------------- 폼 처리 --------------------
function markCategoryManual() {
    if (!dom.category) return;
    dom.category.dataset.manual = 'manual';
}

function autoFillCategoryFromItemName() {
    if (!dom.itemName || !dom.category) return;
    const derived = deriveCategoryFromItemName(dom.itemName.value);
    if (derived) {
        dom.category.value = derived;
        dom.category.dataset.manual = 'auto';
    } else if (dom.category.dataset.manual !== 'manual') {
        dom.category.value = '';
        dom.category.dataset.manual = 'auto';
    }
}

function computeCategoryForForm() {
    if (!dom.category) return '';
    const currentValue = sanitizeText(dom.category.value).trim();
    const isManual = dom.category.dataset.manual === 'manual';
    if (isManual && currentValue) {
        return currentValue;
    }

    const derived = deriveCategoryFromItemName(dom.itemName ? dom.itemName.value : '');
    if (derived) {
        dom.category.value = derived;
        dom.category.dataset.manual = 'auto';
        return derived;
    }

    return currentValue;
}

function getSalesPlanValue() {
    if (dom.salesPlanHidden) {
        return toNumber(dom.salesPlanHidden.value);
    }
    if (state.selectedRecordId) {
        const existing = state.rawData.find((record) => record.id === state.selectedRecordId);
        if (existing && Number.isFinite(existing.sales_plan)) {
            return toNumber(existing.sales_plan);
        }
    }
    return 0;
}

function serializeForm() {
    const categoryValue = computeCategoryForForm();
    const planValue = toNumber(dom.productionPlan.value);
    const salesActualValue = dom.salesActual ? toNullableNumber(dom.salesActual.value) : null;
    const existingRecord = state.selectedRecordId
        ? state.rawData.find((record) => record.id === state.selectedRecordId)
        : null;
    const existingActual = existingRecord ? parseNumberOrNull(existingRecord.production_actual) : null;
    const productionActual = existingActual !== null ? existingActual : 0;
    const productionRemaining = planValue - productionActual;
    let optimalInventoryValue = null;
    if (existingRecord && existingRecord.optimal_inventory_2025 !== undefined && existingRecord.optimal_inventory_2025 !== null && existingRecord.optimal_inventory_2025 !== '') {
        const parsedOptimal = Number(existingRecord.optimal_inventory_2025);
        optimalInventoryValue = Number.isFinite(parsedOptimal) ? parsedOptimal : null;
    }

    return {
        item_code: sanitizeText(dom.itemCode.value).trim(),
        item_name: sanitizeText(dom.itemName.value).trim(),
        category: categoryValue,
        production_line: sanitizeText(dom.productionLine.value).trim(),
        month: sanitizeText(dom.planMonth.value),
        sales_actual: salesActualValue,
        sales_plan: getSalesPlanValue(),
        production_plan: planValue,
        production_actual: productionActual,
        production_remaining: productionRemaining,
        beginning_inventory: toNumber(dom.beginningInventory.value),
        target_ending_inventory: toNumber(dom.targetEndingInventory.value),
        optimal_inventory_2025: optimalInventoryValue,
        capacity_limit: toNumber(dom.capacityLimit.value),
        notes: sanitizeText(dom.notes.value).trim(),
    };
}

function validateFormData(data) {
    if (!data.item_code) {
        alert('자재 코드를 입력하세요.');
        return false;
    }
    if (!data.item_name) {
        alert('자재 명칭을 입력하세요.');
        return false;
    }
    if (!data.category) {
        alert('카테고리를 입력하세요.');
        return false;
    }
    if (!data.production_line) {
        alert('생산 라인을 입력하세요.');
        return false;
    }
    if (!data.month) {
        alert('계획 월을 선택하세요.');
        return false;
    }
    return true;
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = serializeForm();
    if (!validateFormData(formData)) return;

    try {
        if (dom.btnSave) {
            dom.btnSave.setAttribute('disabled', 'disabled');
            dom.btnSave.textContent = '저장 중...';
        }

        if (state.selectedRecordId) {
            await updateRecord(state.selectedRecordId, formData);
            alert('생산계획이 수정되었습니다.');
        } else {
            try {
                await createRecord(formData);
                alert('생산계획이 등록되었습니다.');
            } catch (dupError) {
                if (dupError.code === 'DUPLICATE') {
                    alert(`이미 등록된 자재입니다.\n자재코드: ${formData.item_code}\n계획월: ${formData.month}`);
                    return;
                }
                throw dupError;
            }
        }
        resetForm();
        await loadData();
        renderBaseMaterialMasterTable();
    } catch (error) {
        console.error(error);
        alert('저장 중 오류가 발생했습니다. 입력 값을 확인하거나 잠시 후 다시 시도하세요.');
    } finally {
        if (dom.btnSave) {
            dom.btnSave.removeAttribute('disabled');
            dom.btnSave.textContent = state.selectedRecordId ? '수정 저장' : '저장';
        }
    }
}

/* 프론트엔드 필드명 → 백엔드 DTO 필드명 변환 */
function toSnopApiPayload(data) {
    const payload = { ...data };
    /* month → plan_month (DTO: planMonth) */
    if (payload.month !== undefined && payload.plan_month === undefined) {
        payload.plan_month = payload.month;
        delete payload.month;
    }
    /* optimal_inventory_2025 → optimal_inventory (DTO: optimalInventory) */
    if (payload.optimal_inventory_2025 !== undefined && payload.optimal_inventory === undefined) {
        payload.optimal_inventory = payload.optimal_inventory_2025;
        delete payload.optimal_inventory_2025;
    }
    return payload;
}

async function createRecord(data) {
    const payload = toSnopApiPayload(data);
    const response = await fetch('/sales-api/snop-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (response.status === 409) {
        const errorBody = await response.json();
        const err = new Error(errorBody.message || '이미 등록된 자재입니다.');
        err.code = 'DUPLICATE';
        /* data 안에 existing_id가 있으면 최상위로 올려서 접근 편의 제공 */
        err.detail = errorBody.data || errorBody;
        if (errorBody.data && errorBody.data.existing_id) {
            err.detail.existing_id = errorBody.data.existing_id;
        }
        throw err;
    }
    if (!response.ok) {
        throw new Error('생산계획 등록 실패');
    }
    return response.json();
}

async function updateRecord(id, data) {
    const payload = toSnopApiPayload(data);
    const response = await fetch(`/sales-api/snop-records/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('생산계획 수정 실패');
    }
    return response.json();
}

async function createMaterialLinkageRecord(data) {
    const response = await fetch('/sales-api/material-linkages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('리뉴얼 자재 연결 등록 실패');
    }
    return response.json();
}

async function updateMaterialLinkageRecord(id, data) {
    const response = await fetch(`/sales-api/material-linkages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('리뉴얼 자재 연결 수정 실패');
    }
    return response.json();
}

async function deleteMaterialLinkageRecord(id) {
    const response = await fetch(`/sales-api/material-linkages/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('리뉴얼 자재 연결 삭제 실패');
    }
}

async function handleDelete(id) {
    const target = state.rawData.find((record) => record && record.id === id);
    if (!target) return;

    const normalizeCode = (code) => sanitizeText(code).trim();
    const canonicalCode = normalizeCode(getRecordCanonicalCode(target));
    const originalCode = normalizeCode(target.item_code);
    const codesToMatch = new Set();

    if (canonicalCode) {
        codesToMatch.add(canonicalCode);
    }
    if (originalCode) {
        codesToMatch.add(originalCode);
    }

    if (canonicalCode && state.itemCanonicalMap instanceof Map) {
        state.itemCanonicalMap.forEach((mappedCanonical, sourceCode) => {
            const normalizedSource = normalizeCode(sourceCode);
            const normalizedCanonical = normalizeCode(mappedCanonical);
            if (!normalizedSource) return;
            if (normalizedCanonical && normalizedCanonical === canonicalCode) {
                codesToMatch.add(normalizedSource);
            }
        });
    }

    const relatedRecords = state.rawData.filter((record) => {
        if (!record || !record.id) return false;
        if (record.isProjected) return false;
        const recordCanonical = normalizeCode(getRecordCanonicalCode(record));
        const recordOriginal = normalizeCode(record.item_code);
        return (recordCanonical && codesToMatch.has(recordCanonical))
            || (recordOriginal && codesToMatch.has(recordOriginal));
    });

    const recordIdsToDelete = Array.from(new Set(
        relatedRecords.map((record) => record.id).filter(Boolean),
    ));

    if (recordIdsToDelete.length === 0 && target.id) {
        if (!recordIdsToDelete.includes(target.id)) {
            recordIdsToDelete.push(target.id);
        }
    }

    const displayName = sanitizeText(getRecordCanonicalName(target) || target.item_name).trim() || '해당 자재';
    const displayCode = canonicalCode || originalCode;
    const confirmMessage = `${displayName}${displayCode ? ` (${displayCode})` : ''} 자재의 월별 생산계획 ${recordIdsToDelete.length.toLocaleString('ko-KR')}건을 모두 삭제하시겠습니까?\n삭제 후에는 되돌릴 수 없습니다.`;

    const confirmDelete = confirm(confirmMessage);
    if (!confirmDelete) return;

    const failedIds = [];

    for (const recordId of recordIdsToDelete) {
        try {
            const response = await fetch(`/sales-api/snop-records/${recordId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                failedIds.push(recordId);
            }
        } catch (error) {
            console.error(error);
            failedIds.push(recordId);
        }
    }

    if (failedIds.length > 0) {
        alert('일부 데이터 삭제에 실패했습니다. 잠시 후 다시 시도하세요.');
        await loadData();
        return;
    }

    if (state.pendingProductionChanges instanceof Map) {
        recordIdsToDelete.forEach((recordId) => {
            state.pendingProductionChanges.delete(recordId);
        });
    }

    if (state.projectedOverrides instanceof Map && codesToMatch.size > 0) {
        Array.from(state.projectedOverrides.keys()).forEach((key) => {
            const [codePart] = key.split('__');
            const normalized = normalizeCode(codePart);
            if (normalized && codesToMatch.has(normalized)) {
                state.projectedOverrides.delete(key);
            }
        });
    }

    if (state.selectedRecordId && recordIdsToDelete.includes(state.selectedRecordId)) {
        resetForm();
    }

    await loadData();
    alert(`총 ${recordIdsToDelete.length.toLocaleString('ko-KR')}건의 생산계획이 삭제되었습니다.`);
}

function loadRecordIntoForm(id) {
    /* plan-form이 삭제되었으므로 인라인 편집 모드로 전환 */
    startRowInlineEdit(id);
}

/* ── 행 인라인 편집 — 비고란만 사용자 직접 입력 ── */
const INLINE_EDITABLE_FIELDS = [
    { field: 'notes', type: 'textarea', label: '비고' },
];

function startRowInlineEdit(recordId) {
    /* 이미 편집 중인 행이 있으면 취소 */
    cancelAllRowEdits();

    const numId = typeof recordId === 'string' ? Number(recordId) : recordId;
    const row = dom.tableBody
        ? dom.tableBody.querySelector(`tr[data-record-id="${recordId}"]`)
        : null;
    if (!row) return;

    const record = state.rawData.find((r) => r && r.id == recordId);
    if (!record) return;

    row.classList.add('row-editing');
    row.dataset.editOriginal = JSON.stringify(record);

    INLINE_EDITABLE_FIELDS.forEach(({ field, type }) => {
        const cell = row.querySelector(`[data-field="${field}"]`);
        if (!cell) return;
        if (cell.style.display === 'none') return; /* 숨긴 컬럼은 건너뜀 */

        const currentValue = record[field];

        /* 셀 내용 저장 후 비우기 */
        cell.dataset.editPrev = cell.innerHTML;
        cell.textContent = '';

        if (type === 'textarea') {
            const textarea = document.createElement('textarea');
            textarea.className = 'row-edit-input';
            textarea.placeholder = '비고 입력...';
            textarea.value = currentValue != null ? String(currentValue).trim() : '';
            textarea.rows = 2;
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') { e.preventDefault(); cancelRowInlineEdit(recordId); }
            });
            cell.appendChild(textarea);
        } else {
            const input = document.createElement('input');
            input.type = type;
            input.className = 'row-edit-input';
            if (type === 'number') {
                input.min = '0';
                input.step = '1';
                input.value = Number.isFinite(currentValue) ? currentValue : '';
            } else {
                input.value = currentValue != null ? currentValue : '';
            }
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); saveRowInlineEdit(recordId); }
                if (e.key === 'Escape') { e.preventDefault(); cancelRowInlineEdit(recordId); }
            });
            cell.appendChild(input);
        }
    });

    /* 관리 셀: 편집/삭제 → 저장/취소 */
    const actionsCell = row.querySelector('.actions');
    if (actionsCell) {
        actionsCell.dataset.editPrev = actionsCell.innerHTML;
        actionsCell.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'row-edit-actions';

        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.className = 'btn-row-save';
        saveBtn.textContent = '저장';
        saveBtn.addEventListener('click', () => saveRowInlineEdit(recordId));

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn-row-cancel';
        cancelBtn.textContent = '취소';
        cancelBtn.addEventListener('click', () => cancelRowInlineEdit(recordId));

        wrapper.appendChild(saveBtn);
        wrapper.appendChild(cancelBtn);
        actionsCell.appendChild(wrapper);
    }

    /* 첫 번째 input에 포커스 */
    const firstInput = row.querySelector('.row-edit-input');
    if (firstInput) {
        requestAnimationFrame(() => firstInput.focus());
    }
}

function cancelRowInlineEdit(recordId) {
    const row = dom.tableBody
        ? dom.tableBody.querySelector(`tr[data-record-id="${recordId}"]`)
        : null;
    if (!row || !row.classList.contains('row-editing')) return;

    row.classList.remove('row-editing');

    /* 편집 가능 셀 복원 */
    INLINE_EDITABLE_FIELDS.forEach(({ field }) => {
        const cell = row.querySelector(`[data-field="${field}"]`);
        if (cell && cell.dataset.editPrev !== undefined) {
            cell.innerHTML = cell.dataset.editPrev;
            delete cell.dataset.editPrev;
        }
    });

    /* 관리 셀 복원 */
    const actionsCell = row.querySelector('.actions');
    if (actionsCell && actionsCell.dataset.editPrev !== undefined) {
        actionsCell.innerHTML = actionsCell.dataset.editPrev;
        delete actionsCell.dataset.editPrev;
        /* 이벤트 핸들러 재등록 */
        const editBtn = actionsCell.querySelector('.btn-edit');
        const deleteBtn = actionsCell.querySelector('.btn-delete');
        if (editBtn) editBtn.addEventListener('click', () => loadRecordIntoForm(recordId));
        if (deleteBtn) deleteBtn.addEventListener('click', () => handleDelete(recordId));
    }

    delete row.dataset.editOriginal;
}

function cancelAllRowEdits() {
    if (!dom.tableBody) return;
    const editingRows = dom.tableBody.querySelectorAll('tr.row-editing');
    editingRows.forEach((row) => {
        const recordId = row.dataset.recordId;
        if (recordId) cancelRowInlineEdit(recordId);
    });
}

async function saveRowInlineEdit(recordId) {
    const row = dom.tableBody
        ? dom.tableBody.querySelector(`tr[data-record-id="${recordId}"]`)
        : null;
    if (!row || !row.classList.contains('row-editing')) return;

    const record = state.rawData.find((r) => r && r.id == recordId);
    if (!record) return;

    /* 입력값 수집 */
    const updates = {};
    INLINE_EDITABLE_FIELDS.forEach(({ field, type }) => {
        const cell = row.querySelector(`[data-field="${field}"]`);
        if (!cell) return;
        const inputEl = cell.querySelector('.row-edit-input');
        if (!inputEl) return;

        if (type === 'number') {
            const v = inputEl.value.trim();
            updates[field] = v === '' ? 0 : toNumber(v);
        } else {
            updates[field] = sanitizeText(inputEl.value).trim();
        }
    });

    /* 페이로드 구성: 기존 record + 변경값 */
    const merged = { ...record, ...updates };
    const payload = recordToPayload(merged);

    /* 저장 버튼 비활성화 */
    const saveBtn = row.querySelector('.btn-row-save');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '저장 중...'; }

    try {
        await updateRecord(recordId, payload);
        alert('비고가 저장되었습니다.');
        await loadData();
    } catch (error) {
        console.error(error);
        alert('비고 저장 중 오류가 발생했습니다.');
        if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '저장'; }
    }
}

function resetForm() {
    state.selectedRecordId = null;
    if (dom.recordId) dom.recordId.value = '';
    if (dom.form) dom.form.reset();
    clearSalesPlanDisplay();
    clearCapacityAutofill({ preserveHint: false });
    if (dom.category) {
        dom.category.value = '';
        dom.category.dataset.manual = 'auto';
    }
    if (dom.productionLine) dom.productionLine.value = '';
    if (dom.salesActual) {
        dom.salesActual.value = '';
    }
    autoFillCategoryFromItemName();
    const filterMonth = dom.filters.month ? dom.filters.month.value : '';
    if (filterMonth && filterMonth !== 'all') {
        if (dom.planMonth) dom.planMonth.value = filterMonth;
    } else {
        if (dom.planMonth) dom.planMonth.value = '';
    }
    updateCapacityLimitFromLinePlan();
    if (dom.btnSave) dom.btnSave.textContent = '저장';
}

// -------------------- 인라인 편집 --------------------
function updateRowPendingState(recordId) {
    if (!dom.tableBody) return;
    const isPending = state.pendingProductionChanges instanceof Map
        && state.pendingProductionChanges.has(recordId);
    const row = dom.tableBody.querySelector(`tr[data-record-id="${recordId}"]`);
    if (!row) return;
    row.classList.toggle('pending-change', isPending);
    updateBulkConfirmButton();
}

function syncAllPendingProductionStates() {
    if (!dom.tableBody) return;
    const rows = Array.from(dom.tableBody.querySelectorAll('tr[data-record-id]'));
    rows.forEach((row) => {
        const recordId = row.dataset.recordId;
        const isPending = state.pendingProductionChanges instanceof Map
            && state.pendingProductionChanges.has(recordId);
        row.classList.toggle('pending-change', isPending);
    });
    updateBulkConfirmButton();
}

function updateBulkConfirmButton() {
    if (!dom.bulkConfirmButton) return;
    const pendingCount = state.pendingProductionChanges instanceof Map
        ? state.pendingProductionChanges.size
        : 0;
    const projectedOverrideCount = state.projectedOverrides instanceof Map
        ? state.projectedOverrides.size
        : 0;
    const button = dom.bulkConfirmButton;
    const noteElement = dom.bulkConfirmNote;

    if (noteElement && !noteElement.dataset.baseMessage) {
        noteElement.dataset.baseMessage = noteElement.textContent.trim();
    }

    if (pendingCount > 0) {
        button.disabled = false;
        button.setAttribute('aria-disabled', 'false');
        button.textContent = `변경 로그 확정 (${pendingCount.toLocaleString('ko-KR')}건)`;
        if (noteElement) {
            noteElement.textContent = `확정 대기 중인 변경이 ${pendingCount.toLocaleString('ko-KR')}건 있습니다. 버튼을 눌러 변경 로그에 기록하세요.`;
            noteElement.dataset.state = 'pending';
        }
    } else {
        button.disabled = true;
        button.setAttribute('aria-disabled', 'true');
        button.textContent = '변경 로그 확정 (0건)';
        if (noteElement) {
            if (projectedOverrideCount > 0) {
                noteElement.textContent = `예측(전월 연동) 행에서 조정한 값 ${projectedOverrideCount.toLocaleString('ko-KR')}건은 세션 내 시뮬레이션 용도로만 저장되며 변경 로그에는 남지 않습니다.`;
                noteElement.dataset.state = 'projection-only';
            } else {
                noteElement.textContent = noteElement.dataset.baseMessage || noteElement.textContent;
                noteElement.dataset.state = 'idle';
            }
        }
    }
}

function refocusInlineProductionInput(recordId) {
    requestAnimationFrame(() => {
        const row = dom.tableBody.querySelector(`tr[data-record-id="${recordId}"]`);
        if (!row) return;
        const input = row.querySelector('.inline-input');
        if (input) {
            input.focus();
            input.select();
        }
    });
}

async function handleInlineProductionChange(recordId, rawValue) {
    const displayRecord = state.filteredData.find((item) => item.id === recordId)
        || (state.enrichedData ? state.enrichedData.find((item) => item.id === recordId) : null);

    const trimmed = sanitizeText(rawValue).trim();
    if (trimmed === '') {
        if (displayRecord && displayRecord.isProjected) {
            const key = getProjectedKey(displayRecord.item_code, displayRecord.month);
            if (state.projectedOverrides.has(key)) {
                state.projectedOverrides.delete(key);
            }
        }
        applyFilters();
        refocusInlineProductionInput(recordId);
        return;
    }

    const newValue = toNumber(trimmed);
    if (!Number.isFinite(newValue) || newValue < 0) {
        alert('생산 계획은 0 이상의 숫자로 입력하세요.');
        refocusInlineProductionInput(recordId);
        applyFilters();
        return;
    }

    if (displayRecord && displayRecord.isProjected) {
        if (newValue === displayRecord.production_plan) {
            return;
        }
        const key = getProjectedKey(displayRecord.item_code, displayRecord.month);
        const existingOverride = state.projectedOverrides.get(key) || {};
        if (existingOverride.production_plan === newValue) {
            return;
        }
        state.projectedOverrides.set(key, {
            ...existingOverride,
            production_plan: newValue,
        });
        applyFilters();
        refocusInlineProductionInput(recordId);
        return;
    }

    const record = state.rawData.find((item) => item.id === recordId);
    if (!record) return;

    if (newValue === record.production_plan) {
        return;
    }

    const previousState = state.rawData.map((item) => ({ ...item }));
    const previousMap = new Map(previousState.map((item) => [item.id, item]));

    if (!(state.pendingProductionChanges instanceof Map)) {
        state.pendingProductionChanges = new Map();
    }
    const pendingMap = state.pendingProductionChanges;
    const existingPending = pendingMap.get(recordId) || null;
    const previousRecord = previousMap.get(recordId) || null;
    const baselinePrevious = existingPending && existingPending.previousProductionPlan !== undefined
        ? existingPending.previousProductionPlan
        : (previousRecord && previousRecord.production_plan !== undefined
            ? previousRecord.production_plan
            : null);

    state.rawData = state.rawData.map((item) => ({ ...item }));
    const targetRecord = state.rawData.find((item) => item.id === recordId);
    if (!targetRecord) return;
    targetRecord.production_plan = newValue;
    const targetActual = Number.isFinite(targetRecord.production_actual)
        ? targetRecord.production_actual
        : toNumber(targetRecord.production_actual);
    targetRecord.production_remaining = targetRecord.production_plan - targetActual;

    const itemCode = targetRecord.item_code;
    const itemRecords = state.rawData
        .filter((item) => item.item_code === itemCode)
        .sort((a, b) => sanitizeText(a.month).localeCompare(sanitizeText(b.month)));

    let previousEnding = null;
    itemRecords.forEach((item) => {
        /* 예상월말재고 → 다음달 가용재고로 연결 */
        if (previousEnding !== null) {
            item.available_inventory = previousEnding;
        }
        const availableValue = Number.isFinite(item.available_inventory) ? toNumber(item.available_inventory) : toNumber(item.beginning_inventory);
        const planValue = toNumber(item.production_plan);
        const actualValue = Number.isFinite(item.production_actual)
            ? item.production_actual
            : toNumber(item.production_actual);
        const salesPlanValue = toNumber(item.sales_plan);
        const ending = availableValue + planValue - actualValue - salesPlanValue;
        item.production_plan = planValue;
        item.production_remaining = planValue - actualValue;
        previousEnding = ending;
    });

    const updates = itemRecords
        .filter((item) => {
            const prev = previousMap.get(item.id);
            return (
                !prev ||
                prev.production_plan !== item.production_plan ||
                prev.beginning_inventory !== item.beginning_inventory
            );
        })
        .map((item) => ({ ...item }));

    const normalizedPrevious = baselinePrevious !== undefined ? baselinePrevious : null;
    const shouldClearPending = Number.isFinite(normalizedPrevious) && normalizedPrevious === newValue;

    if (shouldClearPending) {
        pendingMap.delete(recordId);
    } else {
        pendingMap.set(recordId, {
            recordId,
            previousProductionPlan: normalizedPrevious,
            newProductionPlan: newValue,
            itemCode: targetRecord.item_code,
            month: targetRecord.month,
            productionLine: targetRecord.production_line,
            updatedAt: Date.now(),
        });
    }
    updateRowPendingState(recordId);

    applyFilters();
    refocusInlineProductionInput(recordId);

    try {
        for (const updated of updates) {
            await updateRecord(updated.id, recordToPayload(updated));
        }
    } catch (error) {
        console.error(error);
        alert('생산 계획을 저장하는 중 오류가 발생했습니다. 데이터를 새로 고침합니다.');
        pendingMap.delete(recordId);
        updateRowPendingState(recordId);
        await loadData();
        return;
    }

    await loadData();
}

/* ── 우선순위 인라인 변경 핸들러 ──
   카테고리별 우선순위 숫자를 변경하면 API에 즉시 저장 */
async function handleInlinePriorityChange(recordId, rawValue) {
    const record = state.rawData.find((r) => r && r.id == recordId);
    if (!record) return;

    const trimmed = sanitizeText(rawValue).trim();
    const newPriority = trimmed === '' ? null : Number(trimmed);

    if (newPriority !== null && (!Number.isFinite(newPriority) || newPriority < 1)) {
        alert('우선순위는 1 이상의 정수로 입력하세요.');
        /* 원래 값 복원 */
        const input = dom.tableBody
            ? dom.tableBody.querySelector(`.priority-input[data-record-id="${recordId}"]`)
            : null;
        if (input) input.value = Number.isFinite(record.priority) ? record.priority : '';
        return;
    }

    record.priority = newPriority;
    const payload = recordToPayload(record);
    try {
        await updateRecord(recordId, payload);
        /* enrichedData/filteredData를 갱신하여 엑셀 내보내기에 반영 */
        applyFilters();
    } catch (error) {
        console.error('우선순위 저장 실패:', error);
        alert('우선순위 저장에 실패했습니다.');
    }
}

/* ── 보정 생산계획 인라인 변경 핸들러 ──
   사용자가 보정 생산계획 input을 수정하면 호출됨.
   1) adjustedPlanOverrides에 값 저장 → enrichRecord가 보정 기준 파생 지표 재계산
   2) rawData의 production_plan도 변경 → 확정 시 API 저장에 사용
   3) pendingProductionChanges에 등록 → 변경 로그 확정 버튼 활성화 */
function handleInlineAdjustedPlanChange(recordId, rawValue) {
    const trimmed = sanitizeText(rawValue).trim();

    /* override 맵 초기화 */
    if (!state.adjustedPlanOverrides) {
        state.adjustedPlanOverrides = new Map();
    }
    if (!(state.pendingProductionChanges instanceof Map)) {
        state.pendingProductionChanges = new Map();
    }

    /* 빈 값 → override 삭제 + pending 삭제 (제안 수량으로 복귀) */
    if (trimmed === '') {
        state.adjustedPlanOverrides.delete(recordId);
        persistAdjustedOverrides();
        state.pendingProductionChanges.delete(recordId);
        updateRowPendingState(recordId);
        applyFilters();
        refocusAdjustedPlanInput(recordId);
        return;
    }

    const newValue = toNumber(trimmed);
    if (!Number.isFinite(newValue) || newValue < 0) {
        alert('보정 생산계획은 0 이상의 숫자로 입력하세요.');
        applyFilters();
        refocusAdjustedPlanInput(recordId);
        return;
    }

    state.adjustedPlanOverrides.set(recordId, newValue);
    persistAdjustedOverrides();
    /* ── rawData의 production_plan 변경 + 체인 재계산 ── */
    const rawRecord = state.rawData.find((item) => item.id === recordId);
    if (rawRecord) {
        const previousProductionPlan = rawRecord.production_plan;
        /* 원본값 기준으로 비교 (localStorage 복원값이 아닌 최초 로드값) */
        const originalPlan = state.originalProductionPlans instanceof Map
            ? state.originalProductionPlans.get(recordId)
            : undefined;
        const baselineForComparison = originalPlan !== undefined ? originalPlan : previousProductionPlan;

        /* 원본과 동일하면 pending 해제 (변경 없음) */
        if (baselineForComparison === newValue && !state.pendingProductionChanges.has(recordId)) {
            state.pendingProductionChanges.delete(recordId);
            updateRowPendingState(recordId);
            applyFilters();
            refocusAdjustedPlanInput(recordId);
            return;
        }

        rawRecord.production_plan = newValue;
        const actualValue = Number.isFinite(rawRecord.production_actual)
            ? rawRecord.production_actual
            : toNumber(rawRecord.production_actual);
        rawRecord.production_remaining = newValue - actualValue;

        /* 동일 자재코드 체인 재계산 */
        const itemCode = rawRecord.item_code;
        const itemRecords = state.rawData
            .filter((item) => item.item_code === itemCode)
            .sort((a, b) => sanitizeText(a.month).localeCompare(sanitizeText(b.month)));

        let previousEnding = null;
        itemRecords.forEach((item) => {
            /* 예상월말재고 → 다음달 가용재고로 연결 */
            if (previousEnding !== null) {
                item.available_inventory = previousEnding;
            }
            const avInv = Number.isFinite(item.available_inventory) ? toNumber(item.available_inventory) : toNumber(item.beginning_inventory);
            const pv = toNumber(item.production_plan);
            const av = Number.isFinite(item.production_actual) ? item.production_actual : toNumber(item.production_actual);
            const sv = toNumber(item.sales_plan);
            item.production_plan = pv;
            item.production_remaining = pv - av;
            previousEnding = avInv + pv - av - sv;
        });

        /* pendingProductionChanges에 등록 → 확정 버튼 활성화 */
        const pendingMap = state.pendingProductionChanges;
        const existingPending = pendingMap.get(recordId);
        const basePrevious = (existingPending && existingPending.previousProductionPlan !== undefined)
            ? existingPending.previousProductionPlan
            : (originalPlan !== undefined ? originalPlan : previousProductionPlan);

        pendingMap.set(recordId, {
            recordId,
            previousProductionPlan: basePrevious,
            newProductionPlan: newValue,
            itemCode: rawRecord.item_code,
            month: rawRecord.month,
            productionLine: rawRecord.production_line,
            updatedAt: Date.now(),
        });
        updateRowPendingState(recordId);
    }

    applyFilters();
    refocusAdjustedPlanInput(recordId);
}

/** 보정 생산계획 input에 포커스를 되돌린다 */
function refocusAdjustedPlanInput(recordId) {
    requestAnimationFrame(() => {
        const input = document.querySelector(`.adjusted-plan-input[data-record-id="${recordId}"]`);
        if (input) {
            input.focus();
            input.select();
        }
    });
}

/* ── 수작업 투입수량 인라인 변경 핸들러 ──
   값을 입력하면 서버에 즉시 저장 (PUT) */
async function handleInlineManualInputChange(recordId, rawValue) {
    const trimmed = sanitizeText(rawValue).trim();
    const record = state.rawData.find((r) => r && r.id == recordId);
    if (!record) return;

    /* 빈 값 → 0 저장 (서버 병합 방식에서 null은 무시되므로 0으로 초기화) */
    const newValue = trimmed === '' ? 0 : toNumber(trimmed);
    if (trimmed !== '' && (!Number.isFinite(newValue) || newValue < 0)) {
        alert('수작업 투입수량은 0 이상의 숫자로 입력하세요.');
        applyFilters();
        refocusManualInput(recordId);
        return;
    }

    /* 기존 값과 동일하면 무시 */
    const currentValue = (Number.isFinite(record.manual_input_quantity) && record.manual_input_quantity > 0)
        ? record.manual_input_quantity : 0;
    if (newValue === currentValue) return;

    /* rawData에 반영 */
    record.manual_input_quantity = newValue;

    /* 서버에 즉시 저장 */
    try {
        await updateRecord(record.id, { manual_input_quantity: newValue });
    } catch (error) {
        console.error('수작업 투입수량 저장 실패:', error);
        alert('수작업 투입수량을 저장하는 중 오류가 발생했습니다.');
        await loadData();
        return;
    }

    applyFilters();
    refocusManualInput(recordId);
}

/** 수작업 투입수량 input에 포커스를 되돌린다 */
function refocusManualInput(recordId) {
    requestAnimationFrame(() => {
        const input = document.querySelector(`.manual-input-quantity[data-record-id="${recordId}"]`);
        if (input) {
            input.focus();
            input.select();
        }
    });
}

async function reloadProductionChangeLogs(options = {}) {
    const { populateFilters = false, showErrorAlert = false } = options;
    try {
        const response = await fetch('/sales-api/production-change-logs?limit=1000');
        if (!response.ok) {
            throw new Error('변경 로그를 불러오지 못했습니다.');
        }
        const payload = await response.json();
        const data = extractData(payload);
        const normalized = data
            .map((record) => normalizeProductionChangeLog(record))
            .filter((record) => record !== null)
            .sort((a, b) => b.timestamp - a.timestamp);
        state.changeHistoryRecords = normalized;
        /* API 데이터 로드 후 로컬 변경이력 복원 (API가 빈 배열을 반환해도 로컬 기록 유지) */
        restoreLocalChangeHistory();
        refreshChangeHistoryView({ populateFilters });
    } catch (error) {
        /* API 실패 시 기존 state.changeHistoryRecords 보존 + localStorage 복원 */
        restoreLocalChangeHistory();
        if (showErrorAlert) {
            alert('변경 이력 데이터를 다시 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.');
        }
    }
}

function buildProductionChangeLogPayload(pending, rawRecord, enrichedRecord) {
    if (!pending || !rawRecord) {
        return null;
    }

    const recordId = pending.recordId || rawRecord.id;
    if (!recordId) {
        return null;
    }

    const normalizedPrevious = parseNumberOrNull(pending.previousProductionPlan);
    const newCandidate = Number.isFinite(pending.newProductionPlan)
        ? pending.newProductionPlan
        : rawRecord.production_plan;
    const normalizedNew = parseNumberOrNull(newCandidate);

    let changeType = 'updated';
    if (normalizedPrevious === null && normalizedNew !== null) {
        changeType = 'created';
    } else if (normalizedNew === null) {
        changeType = 'deleted';
    }

    const normalizedSalesPlan = parseNumberOrNull(rawRecord.sales_plan);
    const normalizedBeginning = parseNumberOrNull(rawRecord.beginning_inventory);
    /* 가용재고(SAP) 기준 — 없으면 현재고 fallback */
    const normalizedAvailable = parseNumberOrNull(rawRecord.available_inventory) ?? normalizedBeginning;
    const normalizedTargetEnding = parseNumberOrNull(rawRecord.target_ending_inventory);
    const normalizedActual = parseNumberOrNull(rawRecord.production_actual);

    let endingInventory = null;
    if (enrichedRecord && Number.isFinite(enrichedRecord.ending_inventory)) {
        endingInventory = enrichedRecord.ending_inventory;
    } else if (
        normalizedAvailable !== null
        && normalizedNew !== null
        && normalizedSalesPlan !== null
    ) {
        const actualForCalc = normalizedActual !== null ? normalizedActual : 0;
        endingInventory = normalizedAvailable + normalizedNew - actualForCalc - normalizedSalesPlan;
    }

    /* 확정일시를 한국시간(KST)으로 생성 */
    const confirmedAtKST = getNowKSTISOString();

    return {
        record_id: recordId,
        item_code: sanitizeText(rawRecord.item_code).trim(),
        item_name: sanitizeText(rawRecord.item_name).trim(),
        month: sanitizeText(rawRecord.month).trim(),
        production_line: sanitizeText(rawRecord.production_line).trim(),
        change_type: changeType,
        previous_production_plan: normalizedPrevious,
        new_production_plan: normalizedNew,
        sales_plan: normalizedSalesPlan,
        beginning_inventory: normalizedBeginning,
        target_ending_inventory: normalizedTargetEnding,
        ending_inventory: endingInventory,
        confirmed_at: confirmedAtKST,
    };
}

async function handleBulkConfirmProductionChanges() {
    if (!(state.pendingProductionChanges instanceof Map) || state.pendingProductionChanges.size === 0) {
        alert('확정할 변경 사항이 없습니다. 생산 계획을 조정한 뒤 다시 시도하세요.');
        return;
    }

    const pendingEntries = Array.from(state.pendingProductionChanges.values());
    const button = dom.bulkConfirmButton;

    if (button) {
        button.disabled = true;
        button.setAttribute('aria-disabled', 'true');
        button.textContent = '저장 중...';
    }

    const successIds = [];
    const failures = [];

    for (const pending of pendingEntries) {
        const recordId = pending && pending.recordId ? pending.recordId : null;
        if (!recordId) {
            failures.push({ reason: 'recordId 누락' });
            continue;
        }

        const rawRecord = state.rawData.find((item) => item.id === recordId);
        if (!rawRecord) {
            failures.push({ recordId, reason: '기준 데이터를 찾을 수 없습니다.' });
            continue;
        }

        const enrichedRecord = Array.isArray(state.enrichedData)
            ? state.enrichedData.find((item) => item.id === recordId)
            : null;

        const payload = buildProductionChangeLogPayload(pending, rawRecord, enrichedRecord);
        if (!payload) {
            failures.push({
                recordId,
                itemCode: rawRecord.item_code,
                month: rawRecord.month,
                reason: '로그 데이터를 구성할 수 없습니다.',
            });
            continue;
        }

        try {
            const response = await fetch('/sales-api/production-change-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            successIds.push(recordId);
        } catch (error) {
            console.warn('변경 로그 API 저장 실패 (로컬 기록으로 대체):', error.message);
            /* API 미연결 시 로컬 변경이력에 직접 추가 */
            const localConfirmedKST = getNowKSTISOString();
            const localLog = {
                id: `local_${Date.now()}_${recordId}`,
                ...payload,
                timestamp: Date.now(),
                confirmed_at: localConfirmedKST,
                created_at: localConfirmedKST,
            };
            if (!Array.isArray(state.changeHistoryRecords)) {
                state.changeHistoryRecords = [];
            }
            const normalizedLocal = normalizeProductionChangeLog(localLog);
            state.changeHistoryRecords.unshift(normalizedLocal || localLog);
            persistLocalChangeHistory();
            successIds.push(recordId);
        }
    }

    if (successIds.length > 0) {
        successIds.forEach((recordId) => {
            state.pendingProductionChanges.delete(recordId);
        });
    }

    syncAllPendingProductionStates();

    if (successIds.length > 0) {
        await reloadProductionChangeLogs({ populateFilters: true }).catch(() => {});
        /* API 실패 여부와 관계없이 항상 로컬 데이터 기반으로 뷰 갱신 */
        refreshChangeHistoryView({ populateFilters: true });
    }

    updateBulkConfirmButton();
    /* 확정 후에도 보정 생산계획 override 영속화 (새로고침 시 복원 보장) */
    persistAdjustedOverrides();

    if (button) {
        button.blur();
    }

    if (successIds.length > 0 && failures.length === 0) {
        alert(`총 ${successIds.length.toLocaleString('ko-KR')}건의 변경 로그가 저장되었습니다.`);
        return;
    }

    if (successIds.length > 0 && failures.length > 0) {
        const failureDetails = failures
            .slice(0, 3)
            .map((failure) => {
                const code = sanitizeText(failure.itemCode || '').trim() || '미확인 자재';
                const month = sanitizeText(failure.month || '').trim() || '월 미확인';
                return `· ${code} (${month})`;
            })
            .join('\n');
        const extra = failures.length > 3 ? `\n...외 ${failures.length - 3}건` : '';
        alert(`총 ${successIds.length.toLocaleString('ko-KR')}건 저장, ${failures.length.toLocaleString('ko-KR')}건 실패했습니다.\n${failureDetails}${extra}`);
        return;
    }

    if (successIds.length === 0 && failures.length > 0) {
        const failureDetails = failures
            .slice(0, 3)
            .map((failure) => {
                const code = sanitizeText(failure.itemCode || '').trim() || '미확인 자재';
                const month = sanitizeText(failure.month || '').trim() || '월 미확인';
                return `· ${code} (${month})`;
            })
            .join('\n');
        const extra = failures.length > 3 ? `\n...외 ${failures.length - 3}건` : '';
        alert(`변경 로그 저장에 실패했습니다. 잠시 후 다시 시도하세요.\n${failureDetails}${extra}`);
        return;
    }

    alert('확정할 변경 사항이 없습니다. 생산 계획을 조정한 뒤 다시 시도하세요.');
}

// -------------------- 판매 계획 업로드 --------------------
function setSalesUploadStatus(message, type = '') {
    if (!dom.salesUpload || !dom.salesUpload.status) return;
    dom.salesUpload.status.textContent = message;
    dom.salesUpload.status.className = 'sales-status';
    if (type) {
        dom.salesUpload.status.classList.add(type);
    }
}

function resetSalesUploadForm() {
    if (!dom.salesUpload || !dom.salesUpload.form) return;
    dom.salesUpload.form.reset();
    /* 등록 월을 시스템 현재월로 기본 설정 */
    applySalesUploadDefaultMonth();
}

/** 판매계획 업로드 등록 월 기본값 — 시스템 현재월(YYYY-MM) */
function applySalesUploadDefaultMonth() {
    if (!dom.salesUpload || !dom.salesUpload.month) return;
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    dom.salesUpload.month.value = `${yyyy}-${mm}`;
}

function renderAnalyticsRiskTable() {
    if (!dom.analytics || !dom.analytics.riskTableBody) return;
    const tbody = dom.analytics.riskTableBody;
    const empty = dom.analytics.riskTableEmpty;
    const table = dom.analytics.riskTable;
    tbody.innerHTML = '';

    const selectedMonth = getAnalyticsMonthFilterValue();
    const useAllMonths = !selectedMonth || selectedMonth === 'all';
    const baseMonth = useAllMonths ? '' : selectedMonth;

    const enrichedAll = Array.isArray(state.enrichedData) ? state.enrichedData : [];
    /* 제외 카테고리(원단/미지정) 필터링 */
    const enriched = enrichedAll.filter((record) => !isExcludedCategory(record.category));
    const enrichedIndex = new Map();

    enriched.forEach((record) => {
        if (!record) return;
        const code = getRecordCanonicalCode(record);
        const monthValue = sanitizeText(record.month).trim();
        if (!code || !monthValue) return;
        if (!enrichedIndex.has(code)) {
            enrichedIndex.set(code, new Map());
        }
        enrichedIndex.get(code).set(monthValue, record);
    });

    const riskItemMap = new Map();
    enriched.forEach((record) => {
        if (!record || !record.inventoryStatus) return;
        const statusClass = record.inventoryStatus.className;
        if (statusClass !== 'alert' && statusClass !== 'overstock') return;
        const monthValue = sanitizeText(record.month).trim();
        if (!monthValue) return;
        if (!useAllMonths && monthValue !== baseMonth) return;
        const code = getRecordCanonicalCode(record);
        if (!code) return;
        if (!riskItemMap.has(code)) {
            riskItemMap.set(code, {
                item_code: code,
                item_name: getRecordCanonicalName(record) || getMaterialNameFromState(code) || code,
                riskMonths: new Set(),
            });
        }
        const entry = riskItemMap.get(code);
        entry.riskMonths.add(monthValue);
        if (!entry.item_name && record.item_name) {
            entry.item_name = getRecordCanonicalName(record) || getMaterialNameFromState(code) || code;
        }
    });

    const riskItems = Array.from(riskItemMap.values()).sort((a, b) =>
        sanitizeText(a.item_code).localeCompare(sanitizeText(b.item_code))
    );

    if (riskItems.length === 0) {
        state.analyticsRiskRecords = [];
        if (table) {
            table.classList.add('hidden');
        }
        if (empty) {
            empty.textContent = useAllMonths
                ? '전체 월 기준 재고 위험 자재가 없습니다.'
                : `${baseMonth} 기준 재고 위험 자재가 없습니다.`;
            empty.classList.remove('hidden');
        }
        highlightAnalyticsSelectedRow('');
        return;
    }

    if (table) {
        table.classList.remove('hidden');
    }
    if (empty) {
        empty.classList.add('hidden');
    }

    if (!(state.analyticsExpandedItems instanceof Set)) {
        state.analyticsExpandedItems = new Set();
    }
    if (useAllMonths) {
        state.analyticsExpandedItems.clear();
    } else {
        const currentCodes = new Set(
            riskItems
                .map((item) => sanitizeText(item.item_code).trim())
                .filter(Boolean)
        );
        Array.from(state.analyticsExpandedItems).forEach((code) => {
            if (!currentCodes.has(code)) {
                state.analyticsExpandedItems.delete(code);
            }
        });
    }

    const buildRowData = (record, item, month, options = {}) => {
        const {
            isBase = false,
            isDetail = false,
            hasDetails = false,
            parentCode = item.item_code,
        } = options;

        const safeRecord = record || {};
        const itemCode = sanitizeText(item.item_code).trim() || '';
        const canonicalName = sanitizeText(item.item_name || '')
            || getMaterialNameFromState(itemCode)
            || itemCode;

        return {
            item_code: itemCode,
            item_name: canonicalName,
            month,
            isBase,
            isDetail,
            hasDetails,
            parentCode,
            sales_plan: parseNumberOrNull(safeRecord.sales_plan),
            sales_actual: parseNumberOrNull(safeRecord.sales_actual),
            production_plan: parseNumberOrNull(safeRecord.production_plan),
            production_actual: parseNumberOrNull(safeRecord.production_actual),
            ending_inventory: parseNumberOrNull(safeRecord.ending_inventory),
            inventoryStatus: safeRecord.inventoryStatus || null,
        };
    };

    const rows = [];

    riskItems.forEach((item) => {
        const recordMap = enrichedIndex.get(item.item_code) || new Map();

        if (useAllMonths) {
            const monthsToUse = Array.from(new Set(
                Array.from(recordMap.keys())
                    .map((value) => sanitizeText(value).trim())
                    .filter(Boolean)
            )).sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));

            monthsToUse.forEach((monthValue) => {
                const normalizedMonth = sanitizeText(monthValue).trim();
                if (!normalizedMonth) return;
                const targetRecord = recordMap.get(normalizedMonth) || null;
                rows.push(buildRowData(targetRecord, item, normalizedMonth, {
                    isBase: item.riskMonths.has(normalizedMonth),
                    isDetail: false,
                    hasDetails: false,
                    parentCode: item.item_code,
                }));
            });
            return;
        }

        const monthSequence = buildMonthSequence(baseMonth, 4).filter(Boolean);
        if (monthSequence.length === 0) return;

        const baseMonthValue = sanitizeText(monthSequence[0]).trim();
        if (!baseMonthValue) return;

        const baseRecord = recordMap.get(baseMonthValue) || null;
        const hasDetails = monthSequence.length > 1;

        rows.push(buildRowData(baseRecord, item, baseMonthValue, {
            isBase: true,
            isDetail: false,
            hasDetails,
            parentCode: item.item_code,
        }));

        monthSequence.slice(1).forEach((monthValue) => {
            const normalizedMonth = sanitizeText(monthValue).trim();
            if (!normalizedMonth) return;
            const detailRecord = recordMap.get(normalizedMonth) || null;
            rows.push(buildRowData(detailRecord, item, normalizedMonth, {
                isBase: false,
                isDetail: true,
                hasDetails: false,
                parentCode: item.item_code,
            }));
        });
    });

    state.analyticsRiskRecords = rows;

    const fragment = document.createDocumentFragment();
    rows.forEach((record) => {
        const row = document.createElement('tr');
        row.dataset.itemCode = record.item_code;
        row.dataset.month = record.month;

        if (record.isBase) {
            row.dataset.base = 'true';
        } else {
            row.removeAttribute('data-base');
        }

        if (record.isDetail) {
            row.dataset.detail = 'true';
            row.dataset.parentCode = record.parentCode || record.item_code;
            row.dataset.hasDetails = 'false';
            row.classList.add('analytics-risk-detail-row', 'hidden');
            row.setAttribute('aria-hidden', 'true');
            row.tabIndex = -1;
            row.setAttribute('role', 'row');
        } else {
            row.dataset.detail = 'false';
            const canExpand = record.hasDetails && !useAllMonths;
            row.dataset.hasDetails = canExpand ? 'true' : 'false';
            row.classList.add('analytics-risk-base-row');
            if (canExpand) {
                row.dataset.expanded = 'false';
                row.setAttribute('aria-expanded', 'false');
            } else {
                row.removeAttribute('aria-expanded');
            }
            row.tabIndex = 0;
            row.setAttribute('role', 'button');
        }

        const ariaLabel = record.item_name
            ? `${record.item_name} (${record.item_code}) ${record.month} 상세 보기`
            : `${record.item_code} ${record.month} 상세 보기`;
        row.setAttribute('aria-label', ariaLabel);

        const monthCell = document.createElement('td');
        monthCell.textContent = sanitizeText(record.month) || '-';
        row.appendChild(monthCell);

        const codeCell = document.createElement('td');
        codeCell.textContent = sanitizeText(record.item_code) || '-';
        row.appendChild(codeCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = sanitizeText(record.item_name) || '-';
        row.appendChild(nameCell);

        const salesCell = document.createElement('td');
        salesCell.className = 'number';
        salesCell.textContent = Number.isFinite(record.sales_plan)
            ? `${formatNumber(record.sales_plan)} EA`
            : '-';
        row.appendChild(salesCell);

        const salesActualCell = document.createElement('td');
        salesActualCell.className = 'number';
        salesActualCell.textContent = Number.isFinite(record.sales_actual)
            ? `${formatNumber(record.sales_actual)} EA`
            : '-';
        row.appendChild(salesActualCell);

        const productionCell = document.createElement('td');
        productionCell.className = 'number';
        productionCell.textContent = Number.isFinite(record.production_plan)
            ? `${formatNumber(record.production_plan)} EA`
            : '-';
        row.appendChild(productionCell);

        const productionActualCell = document.createElement('td');
        productionActualCell.className = 'number';
        productionActualCell.textContent = Number.isFinite(record.production_actual)
            ? `${formatNumber(record.production_actual)} EA`
            : '-';
        row.appendChild(productionActualCell);

        const endingCell = document.createElement('td');
        endingCell.className = 'number';
        endingCell.textContent = Number.isFinite(record.ending_inventory)
            ? `${formatNumber(record.ending_inventory)} EA`
            : '-';
        row.appendChild(endingCell);

        const statusCell = document.createElement('td');
        if (record.inventoryStatus) {
            const badge = document.createElement('span');
            badge.className = `tag ${record.inventoryStatus.className}`;
            badge.textContent = record.inventoryStatus.label;
            statusCell.appendChild(badge);
        } else {
            statusCell.textContent = '-';
        }
        row.appendChild(statusCell);

        fragment.appendChild(row);
    });

    tbody.appendChild(fragment);
    highlightAnalyticsSelectedRow(dom.chartSelect ? dom.chartSelect.value : '');
}

function toggleAnalyticsRiskDetails(baseRow, expand) {
    if (!dom.analytics || !dom.analytics.riskTableBody) return;
    if (!baseRow || baseRow.dataset.detail === 'true') return;

    const hasDetails = baseRow.dataset.hasDetails === 'true';
    if (!hasDetails) return;

    const parentCode = sanitizeText(baseRow.dataset.itemCode || '').trim();
    if (!parentCode) return;

    const detailRows = Array.from(
        dom.analytics.riskTableBody.querySelectorAll(`tr[data-parent-code="${parentCode}"]`)
    );
    if (detailRows.length === 0) return;

    const shouldExpand = typeof expand === 'boolean'
        ? expand
        : baseRow.dataset.expanded !== 'true';

    detailRows.forEach((detailRow) => {
        if (shouldExpand) {
            detailRow.classList.remove('hidden');
            detailRow.setAttribute('aria-hidden', 'false');
            detailRow.tabIndex = 0;
        } else {
            detailRow.classList.add('hidden');
            detailRow.setAttribute('aria-hidden', 'true');
            detailRow.tabIndex = -1;
        }
    });

    baseRow.dataset.expanded = shouldExpand ? 'true' : 'false';
    baseRow.setAttribute('aria-expanded', shouldExpand ? 'true' : 'false');
    baseRow.classList.toggle('expanded', shouldExpand);

    if (!(state.analyticsExpandedItems instanceof Set)) {
        state.analyticsExpandedItems = new Set();
    }
    if (shouldExpand) {
        state.analyticsExpandedItems.add(parentCode);
    } else {
        state.analyticsExpandedItems.delete(parentCode);
    }
}

function getFilteredMonthsForChart(itemCode) {
    const code = sanitizeText(itemCode).trim();
    if (!code) return [];
    const selectedMonth = getAnalyticsMonthFilterValue();
    const useAllMonths = !selectedMonth || selectedMonth === 'all';
    const sourceRecords = (state.enrichedData || []).filter((record) => getRecordCanonicalCode(record) === code);

    if (useAllMonths) {
        const months = Array.from(new Set(
            sourceRecords
                .map((record) => sanitizeText(record.month).trim())
                .filter(Boolean)
        ));
        months.sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));
        return months;
    }

    return buildMonthSequence(selectedMonth, 4).filter(Boolean);
}

function highlightAnalyticsSelectedRow(itemCode) {
    if (!dom.analytics || !dom.analytics.riskTableBody) return;
    if (!(state.analyticsExpandedItems instanceof Set)) {
        state.analyticsExpandedItems = new Set();
    }

    const normalizedItemCode = sanitizeText(itemCode).trim();
    const rows = Array.from(dom.analytics.riskTableBody.querySelectorAll('tr'));
    const selectedMonth = getAnalyticsMonthFilterValue();
    const shouldManageExpansion = selectedMonth && selectedMonth !== 'all';

    if (!shouldManageExpansion) {
        state.analyticsExpandedItems.clear();
    }

    rows.forEach((row) => {
        const isDetailRow = row.dataset && row.dataset.detail === 'true';
        if (isDetailRow) {
            row.classList.remove('active');
            return;
        }

        const code = sanitizeText(row.dataset.itemCode || '').trim();
        const isMatch = normalizedItemCode && code === normalizedItemCode;
        row.classList.toggle('active', Boolean(isMatch));

        if (row.dataset.hasDetails !== 'true') {
            return;
        }

        if (!shouldManageExpansion) {
            toggleAnalyticsRiskDetails(row, false);
            return;
        }

        const shouldExpand = state.analyticsExpandedItems.has(code);
        toggleAnalyticsRiskDetails(row, shouldExpand);
    });
}

function focusAnalyticsItem(itemCode, options = {}) {
    if (!dom.chartSelect) return;
    const code = sanitizeText(itemCode).trim();
    if (!code) return;

    const optionExists = Array.from(dom.chartSelect.options || []).some((option) => option.value === code);
    if (!optionExists) {
        const option = document.createElement('option');
        option.value = code;
        const sourceRecord = (state.rawData || []).find((record) => getRecordCanonicalCode(record) === code)
            || (state.analyticsRiskRecords || []).find((record) => sanitizeText(record.item_code).trim() === code);
        const itemName = sourceRecord ? (sourceRecord.item_name || sourceRecord.canonical_item_name) : getMaterialNameFromState(code);
        const displayName = sanitizeText(itemName).trim();
        option.textContent = displayName && displayName !== code ? `${displayName} (${code})` : code;
        dom.chartSelect.appendChild(option);
    }

    dom.chartSelect.value = code;
    dom.chartSelect.dataset.manualSelection = 'true';
    updateChart();

    const { scroll = true } = options;
    if (scroll && dom.chartCanvas) {
        dom.chartCanvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function getAnalyticsMonthFilterValue() {
    if (dom.analytics && dom.analytics.monthFilter) {
        const value = sanitizeText(dom.analytics.monthFilter.value).trim();
        return value || 'all';
    }
    if (dom.filters && dom.filters.month) {
        const fallback = sanitizeText(dom.filters.month.value).trim();
        return fallback || 'all';
    }
    return 'all';
}

function populateAnalyticsMonthFilter(records = state.enrichedData) {
    if (!dom.analytics || !dom.analytics.monthFilter) return;
    const select = dom.analytics.monthFilter;
    const manual = select.dataset && select.dataset.manualSelection === 'true';
    const previous = sanitizeText(select.value).trim() || 'all';

    const monthSet = new Set();
    (records || []).forEach((record) => {
        if (!record) return;
        const monthValue = sanitizeText(record.month).trim();
        if (monthValue) {
            monthSet.add(monthValue);
        }
    });

    if (manual && previous && previous !== 'all') {
        monthSet.add(previous);
    }

    const primaryMonth = dom.filters && dom.filters.month
        ? sanitizeText(dom.filters.month.value).trim()
        : '';
    if (!manual && primaryMonth && primaryMonth !== 'all') {
        monthSet.add(primaryMonth);
    }

    const months = sortMonthsAscending(Array.from(monthSet));

    select.innerHTML = '<option value="all">전체</option>';
    months.forEach((month) => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        select.appendChild(option);
    });

    let targetValue = 'all';
    if (manual) {
        if (previous && previous !== 'all' && months.includes(previous)) {
            targetValue = previous;
        } else if (previous === 'all') {
            targetValue = 'all';
        } else if (primaryMonth && primaryMonth !== 'all') {
            targetValue = primaryMonth;
            select.dataset.manualSelection = 'false';
        }
    } else if (primaryMonth && primaryMonth !== 'all') {
        targetValue = primaryMonth;
        select.dataset.manualSelection = 'false';
    } else {
        targetValue = 'all';
        select.dataset.manualSelection = 'false';
    }

    if (targetValue !== 'all' && !months.includes(targetValue)) {
        const option = document.createElement('option');
        option.value = targetValue;
        option.textContent = targetValue;
        select.appendChild(option);
    }

    select.value = targetValue;
    select.disabled = months.length === 0;
}

function populateSalesSummaryFilters() {
    if (!dom.salesUpload) return;
    const monthSelect = dom.salesUpload.summaryMonthFilter;
    const categorySelect = dom.salesUpload.summaryCategoryFilter;

    const aggregates = state.salesAggregates && Array.isArray(state.salesAggregates.list)
        ? state.salesAggregates.list
        : [];

    const monthValues = Array.from(new Set(
        aggregates
            .map((entry) => sanitizeText(entry.month).trim())
            .filter(Boolean)
    )).sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));

    const categoryValues = Array.from(new Set(
        aggregates
            .map((entry) => sanitizeText(entry.category).trim())
            .filter((cat) => cat && !isExcludedCategory(cat))
    )).sort((a, b) => sanitizeText(a).localeCompare(sanitizeText(b)));

    /* 미지정 카테고리는 EXCLUDED_CATEGORIES에 포함되므로 더 이상 표시하지 않음 */
    const hasUnspecifiedCategory = false;

    if (monthSelect) {
        const previous = monthSelect.value || 'all';
        monthSelect.innerHTML = '<option value="all">전체</option>';
        monthValues.forEach((month) => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = month;
            monthSelect.appendChild(option);
        });
        const availableMonths = new Set(['all', ...monthValues]);
        if (availableMonths.has(previous)) {
            monthSelect.value = previous;
        } else {
            monthSelect.value = 'all';
        }
        monthSelect.disabled = aggregates.length === 0 || monthValues.length === 0;
    }

    if (categorySelect) {
        const previous = categorySelect.value !== undefined ? categorySelect.value : 'all';
        categorySelect.innerHTML = '<option value="all">전체</option>';
        categoryValues.forEach((category) => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
        if (hasUnspecifiedCategory) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '카테고리 미지정';
            categorySelect.appendChild(option);
        }
        const availableCategories = new Set(['all', ...categoryValues]);
        if (hasUnspecifiedCategory) {
            availableCategories.add('');
        }
        if (availableCategories.has(previous)) {
            categorySelect.value = previous;
        } else {
            categorySelect.value = 'all';
        }
        categorySelect.disabled = aggregates.length === 0 || (categoryValues.length === 0 && !hasUnspecifiedCategory);
    }
}

/* ── 판매 합계 자재코드 검색 드롭다운 ── */
function renderSalesSummaryItemList(query) {
    const list = dom.salesUpload.summaryItemList;
    if (!list) return;
    list.innerHTML = '';

    const aggregates = state.salesAggregates && Array.isArray(state.salesAggregates.list)
        ? state.salesAggregates.list : [];

    /* 고유 자재코드+명칭 추출 */
    const seen = new Set();
    const options = [];
    aggregates.forEach((entry) => {
        const code = sanitizeText(entry.item_code).trim();
        if (!code || seen.has(code.toUpperCase())) return;
        seen.add(code.toUpperCase());
        options.push({ code, name: sanitizeText(entry.item_name || '').trim() });
    });
    options.sort((a, b) => (a.code || '').localeCompare(b.code || ''));

    const q = (query || '').trim().toUpperCase();

    /* '전체' 옵션 */
    const allDiv = document.createElement('div');
    allDiv.className = 'item-search-option option-all';
    allDiv.textContent = '전체';
    allDiv.dataset.value = 'all';
    allDiv.addEventListener('mousedown', (e) => {
        e.preventDefault();
        selectSalesSummaryItemFilter('all', '');
    });
    list.appendChild(allDiv);

    const filtered = q
        ? options.filter(({ code, name }) =>
            (code || '').toUpperCase().includes(q) || (name || '').toUpperCase().includes(q))
        : options;

    const maxDisplay = 100;
    filtered.slice(0, maxDisplay).forEach(({ code, name }) => {
        const div = document.createElement('div');
        div.className = 'item-search-option';
        div.dataset.value = code;
        const codeSpan = document.createElement('span');
        codeSpan.className = 'item-code';
        codeSpan.textContent = code;
        div.appendChild(codeSpan);
        if (name && name !== code && name !== '-') {
            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name';
            nameSpan.textContent = name;
            div.appendChild(nameSpan);
        }
        div.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selectSalesSummaryItemFilter(code, code);
        });
        list.appendChild(div);
    });

    if (filtered.length > maxDisplay) {
        const moreDiv = document.createElement('div');
        moreDiv.className = 'item-search-option';
        moreDiv.style.color = '#94a3b8';
        moreDiv.style.fontStyle = 'italic';
        moreDiv.style.cursor = 'default';
        moreDiv.textContent = `... 외 ${filtered.length - maxDisplay}건 (더 입력하여 검색)`;
        list.appendChild(moreDiv);
    }

    list.classList.remove('hidden');
}

function selectSalesSummaryItemFilter(value, displayText) {
    if (dom.salesUpload.summaryItemFilter) dom.salesUpload.summaryItemFilter.value = value;
    if (dom.salesUpload.summaryItemInput) dom.salesUpload.summaryItemInput.value = value === 'all' ? '' : displayText;
    if (dom.salesUpload.summaryItemList) dom.salesUpload.summaryItemList.classList.add('hidden');
    renderSalesSummaryTable();
}

function initSalesSummaryItemFilter() {
    const input = dom.salesUpload.summaryItemInput;
    const list = dom.salesUpload.summaryItemList;
    if (!input || !list) return;

    input.addEventListener('focus', () => { renderSalesSummaryItemList(input.value); });
    input.addEventListener('input', () => { renderSalesSummaryItemList(input.value); });
    input.addEventListener('blur', () => {
        setTimeout(() => {
            list.classList.add('hidden');
            if (!input.value.trim()) {
                if (dom.salesUpload.summaryItemFilter) dom.salesUpload.summaryItemFilter.value = 'all';
                input.value = '';
                renderSalesSummaryTable();
            }
        }, 200);
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { list.classList.add('hidden'); input.blur(); }
    });
}

function renderSalesSummaryTable() {
    if (!dom.salesUpload || !dom.salesUpload.summaryBody) return;
    const tbody = dom.salesUpload.summaryBody;
    const empty = dom.salesUpload.summaryEmpty;
    tbody.innerHTML = '';

    const aggregates = state.salesAggregates && Array.isArray(state.salesAggregates.list)
        ? state.salesAggregates.list
        : [];

    const itemFilter = dom.salesUpload.summaryItemFilter
        ? dom.salesUpload.summaryItemFilter.value
        : 'all';
    const monthFilter = dom.salesUpload.summaryMonthFilter
        ? dom.salesUpload.summaryMonthFilter.value
        : 'all';
    const categoryFilter = dom.salesUpload.summaryCategoryFilter
        ? dom.salesUpload.summaryCategoryFilter.value
        : 'all';

    /* 현재월 이전 데이터 자동 제외 (월 필터가 '전체'일 때) */
    const now = new Date();
    const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

    const filteredAggregates = aggregates.filter((entry) => {
        /* 제외 카테고리(원단/미지정) 필터링 */
        if (isExcludedCategory(entry.category)) return false;
        const itemValue = sanitizeText(entry.item_code).trim().toUpperCase();
        const monthValue = sanitizeText(entry.month).trim();
        const categoryValue = sanitizeText(entry.category).trim();
        const matchesItem = itemFilter === 'all' || itemValue === itemFilter.toUpperCase();
        const matchesMonth = monthFilter === 'all' || monthValue === monthFilter;
        const matchesCategory = categoryFilter === 'all' || categoryValue === categoryFilter;
        /* 월 필터 '전체'일 때 현재월 이전 데이터 제외 */
        if (monthFilter === 'all' && monthValue && monthValue < currentMonth) return false;
        return matchesItem && matchesMonth && matchesCategory;
    });

    if (filteredAggregates.length === 0) {
        if (empty) {
            empty.textContent = aggregates.length === 0
                ? '판매계획 업로드 데이터가 없습니다.'
                : '선택한 필터 조건에 맞는 데이터가 없습니다.';
            empty.classList.remove('hidden');
        }
        renderSalesSummaryDetailPanel(null);
        highlightSalesSummaryRow('');
        updateSalesSummaryDetailButtons('');
        return;
    }

    if (empty) {
        empty.classList.add('hidden');
    }

    const fragment = document.createDocumentFragment();
    const activeKey = sanitizeText(state.activeSalesAggregateKey).trim();
    let activeEntry = null;

    filteredAggregates.forEach((entry) => {
        const row = document.createElement('tr');
        const entryKey = sanitizeText(entry.key).trim();
        row.dataset.aggregateKey = entryKey;

        if (entryKey && entryKey === activeKey) {
            row.classList.add('sales-summary-active-row');
            activeEntry = entry;
        }

        const monthCell = document.createElement('td');
        monthCell.textContent = sanitizeText(entry.month) || '-';
        row.appendChild(monthCell);

        const categoryCell = document.createElement('td');
        const categoryValue = sanitizeText(entry.category).trim();
        categoryCell.textContent = categoryValue || '-';
        row.appendChild(categoryCell);

        const codeCell = document.createElement('td');
        codeCell.textContent = sanitizeText(entry.item_code) || '-';
        row.appendChild(codeCell);

        const nameCell = document.createElement('td');
        const itemName = sanitizeText(entry.item_name).trim();
        nameCell.textContent = itemName || '-';
        row.appendChild(nameCell);

        const standardCell = document.createElement('td');
        standardCell.className = 'number';
        standardCell.textContent = `${formatNumber(entry.standardTotal)} BOX`;
        row.appendChild(standardCell);

        const promotionCell = document.createElement('td');
        promotionCell.className = 'number';
        promotionCell.textContent = `${formatNumber(entry.promotionTotal)} BOX`;
        row.appendChild(promotionCell);

        const totalCell = document.createElement('td');
        totalCell.className = 'number uploaded-sales-highlight';
        totalCell.textContent = `${formatNumber(entry.total)} BOX`;
        if (Array.isArray(entry.channelBreakdown) && entry.channelBreakdown.length > 0) {
            const tooltip = entry.channelBreakdown
                .map((item) => {
                    const channelLabel = sanitizeText(item.display) || sanitizeText(item.channel) || '채널 미지정';
                    const detailParts = [];
                    if (item.standardQuantity > 0) {
                        detailParts.push(`스탠다드 ${formatNumber(item.standardQuantity)} BOX`);
                    }
                    if (item.promotionQuantity > 0) {
                        detailParts.push(`프로모션 ${formatNumber(item.promotionQuantity)} BOX`);
                    }
                    const detailText = detailParts.length > 0 ? ` (${detailParts.join(' · ')})` : '';
                    return `${channelLabel}: ${formatNumber(item.quantity)} BOX${detailText}`;
                })
                .join(' • ');
            totalCell.title = `채널별 합계: ${tooltip}`;
        }
        row.appendChild(totalCell);

        const detailCell = document.createElement('td');
        detailCell.className = 'actions';
        const detailButton = document.createElement('button');
        detailButton.type = 'button';
        detailButton.className = 'secondary small';
        detailButton.textContent = '상세 보기';
        detailButton.setAttribute('aria-expanded', 'false');
        detailButton.addEventListener('click', () => {
            const currentActiveKey = sanitizeText(state.activeSalesAggregateKey).trim();
            if (entryKey && currentActiveKey === entryKey) {
                setSalesSummaryDetail(null);
            } else {
                setSalesSummaryDetail(entry);
                const detailRow = (() => {
                    if (!dom.salesUpload || !dom.salesUpload.summaryBody) return null;
                    return Array.from(dom.salesUpload.summaryBody.querySelectorAll('.sales-summary-detail-row'))
                        .find((detail) => sanitizeText(detail.dataset.detailFor || '').trim() === entryKey) || null;
                })();
                if (detailRow && typeof detailRow.scrollIntoView === 'function') {
                    detailRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }
        });
        detailCell.appendChild(detailButton);
        row.appendChild(detailCell);

        fragment.appendChild(row);
    });

    tbody.appendChild(fragment);

    if (activeKey && activeEntry) {
        renderSalesSummaryDetailPanel(activeEntry);
        highlightSalesSummaryRow(activeKey);
    } else if (activeKey && !activeEntry) {
        setSalesSummaryDetail(null);
    } else {
        highlightSalesSummaryRow('');
        renderSalesSummaryDetailPanel(null);
    }

    updateSalesSummaryDetailButtons(sanitizeText(state.activeSalesAggregateKey).trim());
}

function highlightSalesSummaryRow(activeKey) {
    if (!dom.salesUpload || !dom.salesUpload.summaryBody) return;
    const rows = dom.salesUpload.summaryBody.querySelectorAll('tr');
    const targetKey = sanitizeText(activeKey).trim();
    rows.forEach((row) => {
        if (!row || !row.dataset) return;
        const rowKey = sanitizeText(row.dataset.aggregateKey || '').trim();
        const isActive = targetKey && rowKey === targetKey;
        row.classList.toggle('sales-summary-active-row', Boolean(isActive));
    });
}

function buildSalesSummaryDetailContent(entry) {
    const template = dom.salesUpload ? dom.salesUpload.summaryDetailTemplate : null;
    let container = null;

    if (template && template.content) {
        const fragment = template.content.cloneNode(true);
        const wrapper = document.createElement('div');
        wrapper.appendChild(fragment);
        container = wrapper.firstElementChild;
    }

    if (!container) {
        container = document.createElement('div');
        container.className = 'channel-detail-panel channel-detail-inline';
        container.innerHTML = `
            <div class="detail-header">
                <div>
                    <h4>채널별 상세</h4>
                    <p data-detail-context></p>
                </div>
                <button type="button" class="ghost small detail-close">닫기</button>
            </div>
            <div class="detail-meta">
                <span data-detail-month></span>
                <span data-detail-item></span>
                <span data-detail-total></span>
            </div>
            <div class="table-wrapper compact">
                <table>
                    <thead>
                        <tr>
                            <th>채널</th>
                            <th>스탠다드 (BOX)</th>
                            <th>프로모션 (BOX)</th>
                            <th>총합 (BOX)</th>
                            <th>설명</th>
                        </tr>
                    </thead>
                    <tbody data-detail-body></tbody>
                </table>
                <div class="empty" data-detail-empty>채널별 상세 데이터가 없습니다.</div>
            </div>
        `;
    }

    const containerElement = container;
    const context = containerElement.querySelector('[data-detail-context]');
    const monthLabel = containerElement.querySelector('[data-detail-month]');
    const itemLabel = containerElement.querySelector('[data-detail-item]');
    const totalLabel = containerElement.querySelector('[data-detail-total]');
    const tbody = containerElement.querySelector('[data-detail-body]');
    const empty = containerElement.querySelector('[data-detail-empty]');

    const breakdown = Array.isArray(entry.channelBreakdown) ? entry.channelBreakdown : [];
    const channelCount = breakdown.length;

    if (context) {
        context.textContent = channelCount > 0
            ? `총 ${channelCount.toLocaleString('ko-KR')}개 채널의 상세 수량입니다.`
            : '등록된 채널별 데이터가 없어 총합만 표시됩니다.';
    }

    if (monthLabel) {
        const monthText = sanitizeText(entry.month) || '-';
        monthLabel.textContent = `계획 월: ${monthText}`;
    }

    if (itemLabel) {
        const itemName = sanitizeText(entry.item_name).trim();
        const itemCode = sanitizeText(entry.item_code).trim();
        const label = itemName ? `${itemName} (${itemCode || '-'})` : (itemCode || '-');
        itemLabel.textContent = `자재: ${label}`;
    }

    if (totalLabel) {
        const standardText = formatNumber(entry.standardTotal);
        const promotionText = formatNumber(entry.promotionTotal);
        const totalText = formatNumber(entry.total);
        totalLabel.textContent = `총합: 스탠다드 ${standardText} BOX · 프로모션 ${promotionText} BOX · 합계 ${totalText} BOX`;
    }

    if (tbody) {
        tbody.innerHTML = '';
        if (channelCount === 0) {
            if (empty) {
                empty.classList.remove('hidden');
                empty.textContent = '채널별 상세 데이터가 없습니다.';
            }
        } else {
            const fragment = document.createDocumentFragment();
            breakdown.forEach((item) => {
                const row = document.createElement('tr');

                const channelCell = document.createElement('td');
                const channelName = sanitizeText(item.channel_name).trim();
                const channelKey = sanitizeText(item.channel).trim();
                const display = channelName
                    ? `${channelName} (${channelKey || '-'})`
                    : (sanitizeText(item.display).trim() || channelKey || '채널 미지정');
                channelCell.textContent = display;
                if (item.description) {
                    channelCell.title = sanitizeText(item.description).trim();
                }
                row.appendChild(channelCell);

                const standardCell = document.createElement('td');
                standardCell.className = 'number';
                standardCell.textContent = `${formatNumber(item.standardQuantity)} BOX`;
                row.appendChild(standardCell);

                const promotionCell = document.createElement('td');
                promotionCell.className = 'number';
                promotionCell.textContent = `${formatNumber(item.promotionQuantity)} BOX`;
                row.appendChild(promotionCell);

                const totalCell = document.createElement('td');
                totalCell.className = 'number';
                totalCell.textContent = `${formatNumber(item.quantity)} BOX`;
                row.appendChild(totalCell);

                const descriptionCell = document.createElement('td');
                const description = sanitizeText(item.description).trim();
                descriptionCell.textContent = description || '-';
                row.appendChild(descriptionCell);

                fragment.appendChild(row);
            });
            tbody.appendChild(fragment);

            if (empty) {
                empty.classList.add('hidden');
            }
        }
    }

    const closeButton = containerElement.querySelector('.detail-close');
    if (closeButton) {
        closeButton.addEventListener('click', (event) => {
            event.preventDefault();
            setSalesSummaryDetail(null);
        });
    }

    return containerElement;
}

function renderSalesSummaryDetailPanel(entry) {
    if (!dom.salesUpload || !dom.salesUpload.summaryBody) return;
    const tbody = dom.salesUpload.summaryBody;

    const previousRow = tbody.querySelector('.sales-summary-detail-row');
    if (previousRow) {
        previousRow.remove();
    }

    if (!entry) {
        return;
    }

    const entryKey = sanitizeText(entry.key).trim();
    if (!entryKey) {
        return;
    }

    const targetRow = Array.from(tbody.querySelectorAll('tr')).find((row) => (
        sanitizeText(row.dataset.aggregateKey || '').trim() === entryKey
    ));

    if (!targetRow) {
        return;
    }

    const detailRow = document.createElement('tr');
    detailRow.className = 'sales-summary-detail-row';
    detailRow.dataset.detailFor = entryKey;

    const columnCount = (() => {
        const table = dom.salesUpload.summaryTable;
        if (table && table.tHead && table.tHead.rows.length > 0) {
            const headerRow = table.tHead.rows[0];
            if (headerRow && headerRow.cells) {
                return headerRow.cells.length || targetRow.cells.length || 1;
            }
        }
        if (targetRow && targetRow.cells) {
            return targetRow.cells.length || 1;
        }
        return 1;
    })();

    const detailCell = document.createElement('td');
    detailCell.colSpan = columnCount;
    const detailContent = buildSalesSummaryDetailContent(entry);
    if (detailContent) {
        detailCell.appendChild(detailContent);
    }
    detailRow.appendChild(detailCell);

    targetRow.insertAdjacentElement('afterend', detailRow);
}

function updateSalesSummaryDetailButtons(activeKey) {
    if (!dom.salesUpload || !dom.salesUpload.summaryBody) return;
    const normalizedKey = sanitizeText(activeKey).trim();
    const buttons = dom.salesUpload.summaryBody.querySelectorAll('td.actions button');
    buttons.forEach((button) => {
        if (!button) return;
        const parentRow = button.closest('tr');
        if (!parentRow) return;
        const rowKey = sanitizeText(parentRow.dataset.aggregateKey || '').trim();
        const isActive = normalizedKey && rowKey === normalizedKey;
        button.textContent = isActive ? '접기' : '상세 보기';
        button.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        button.classList.toggle('active', Boolean(isActive));
    });
}

function setSalesSummaryDetail(entry) {
    if (!entry) {
        state.activeSalesAggregateKey = '';
        renderSalesSummaryDetailPanel(null);
        highlightSalesSummaryRow('');
        updateSalesSummaryDetailButtons('');
        return;
    }

    const entryKey = sanitizeText(entry.key).trim();
    state.activeSalesAggregateKey = entryKey;
    renderSalesSummaryDetailPanel(entry);
    highlightSalesSummaryRow(entryKey);
    updateSalesSummaryDetailButtons(entryKey);
}

function renderSalesUploadsTable() {
    if (!dom.salesUpload || !dom.salesUpload.uploadBody) return;
    const tbody = dom.salesUpload.uploadBody;
    const empty = dom.salesUpload.uploadEmpty;
    tbody.innerHTML = '';

    const records = Array.isArray(state.salesUploads) ? state.salesUploads : [];
    if (records.length === 0) {
        if (empty) {
            empty.classList.remove('hidden');
        }
        return;
    }

    if (empty) {
        empty.classList.add('hidden');
    }

    const sorted = [...records].sort((a, b) => {
        const timestampA = getRecordTimestamp(a) ?? 0;
        const timestampB = getRecordTimestamp(b) ?? 0;
        if (timestampB !== timestampA) {
            return timestampB - timestampA;
        }
        const monthCompare = sanitizeText(b.month).localeCompare(sanitizeText(a.month));
        if (monthCompare !== 0) {
            return monthCompare;
        }
        return sanitizeText(a.item_code).localeCompare(sanitizeText(b.item_code));
    });

    const fragment = document.createDocumentFragment();
    sorted.forEach((record) => {
        const row = document.createElement('tr');

        const monthCell = document.createElement('td');
        monthCell.textContent = sanitizeText(record.month) || '-';
        row.appendChild(monthCell);

        const codeCell = document.createElement('td');
        codeCell.textContent = sanitizeText(record.item_code) || '-';
        row.appendChild(codeCell);

        const channelCell = document.createElement('td');
        if (record.channel_name) {
            channelCell.textContent = `${record.channel_name} (${record.channel})`;
            channelCell.title = record.channel_name;
        } else {
            channelCell.textContent = sanitizeText(record.channel) || '채널 미지정';
        }
        row.appendChild(channelCell);

        const standardCell = document.createElement('td');
        standardCell.className = 'number';
        standardCell.textContent = `${formatNumber(record.standard_quantity)} BOX`;
        row.appendChild(standardCell);

        const promotionCell = document.createElement('td');
        promotionCell.className = 'number';
        promotionCell.textContent = `${formatNumber(record.promotion_quantity)} BOX`;
        row.appendChild(promotionCell);

        const totalCell = document.createElement('td');
        totalCell.className = 'number uploaded-sales-highlight';
        totalCell.textContent = `${formatNumber(record.quantity)} BOX`;
        row.appendChild(totalCell);

        const noteCell = document.createElement('td');
        noteCell.textContent = sanitizeText(record.note) || '-';
        row.appendChild(noteCell);

        const createdCell = document.createElement('td');
        const createdTime = coerceTimestamp(record.created_at);
        const updatedTime = coerceTimestamp(record.updated_at);
        const latestTimestamp = updatedTime !== null && createdTime !== null
            ? Math.max(updatedTime, createdTime)
            : (updatedTime !== null ? updatedTime : createdTime);
        createdCell.textContent = latestTimestamp !== null ? formatDateTime(latestTimestamp) : '-';
        if (createdTime !== null || updatedTime !== null) {
            const createdText = createdTime !== null ? formatDateTime(createdTime) : '-';
            const updatedText = updatedTime !== null ? formatDateTime(updatedTime) : createdText;
            if (createdTime !== null && updatedTime !== null && updatedTime !== createdTime) {
                createdCell.title = `최초 등록: ${createdText}\n최근 갱신: ${updatedText}`;
            } else if (createdTime !== null) {
                createdCell.title = `등록: ${createdText}`;
            } else {
                createdCell.title = `최근 갱신: ${updatedText}`;
            }
        }
        row.appendChild(createdCell);

        const actionCell = document.createElement('td');
        actionCell.className = 'actions';
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'danger small';
        deleteButton.textContent = '삭제';
        deleteButton.addEventListener('click', () => handleSalesUploadDelete(record.id));
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        fragment.appendChild(row);
    });

    tbody.appendChild(fragment);
}

function populateSalesChannelSelect() {
    if (!dom.salesUpload || !dom.salesUpload.channel) return;
    const select = dom.salesUpload.channel;
    const previousValue = select.value;
    select.innerHTML = '<option value="">채널을 선택하세요</option>';
    const channels = Array.isArray(state.salesChannels) ? state.salesChannels : [];
    channels
        .sort((a, b) => sanitizeText(a.channel_name).localeCompare(sanitizeText(b.channel_name)) || sanitizeText(a.channel_key).localeCompare(sanitizeText(b.channel_key)))
        .forEach((channel) => {
            const option = document.createElement('option');
            const label = channel.channel_name
                ? `${channel.channel_name} (${channel.channel_key})`
                : channel.channel_key;
            option.value = channel.channel_key;
            option.textContent = label;
            select.appendChild(option);
        });
    if (channels.some((channel) => channel.channel_key === previousValue)) {
        select.value = previousValue;
    }
    select.disabled = channels.length === 0;
}

function renderSalesChannelsList() {
    if (!dom.salesUpload || !dom.salesUpload.channelList) return;
    const list = dom.salesUpload.channelList;
    const emptyState = dom.salesUpload.channelEmpty;
    list.innerHTML = '';

    const channels = Array.isArray(state.salesChannels) ? state.salesChannels : [];
    if (channels.length === 0) {
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        return;
    }

    if (emptyState) {
        emptyState.classList.add('hidden');
    }

    const fragment = document.createDocumentFragment();
    channels
        .sort((a, b) => sanitizeText(a.channel_name).localeCompare(sanitizeText(b.channel_name)) || sanitizeText(a.channel_key).localeCompare(sanitizeText(b.channel_key)))
        .forEach((channel) => {
            const item = document.createElement('li');
            item.className = 'channel-item';
            item.dataset.channelId = channel.id;
            item.dataset.channelKey = channel.channel_key;

            const labelWrapper = document.createElement('div');
            labelWrapper.className = 'channel-label';
            const title = document.createElement('strong');
            title.textContent = channel.channel_name || channel.channel_key;
            labelWrapper.appendChild(title);
            const subtitle = document.createElement('span');
            const subtitleParts = [`코드: ${channel.channel_key}`];
            if (channel.description) {
                subtitleParts.push(channel.description);
            }
            subtitle.textContent = subtitleParts.join(' · ');
            labelWrapper.appendChild(subtitle);

            const actions = document.createElement('div');
            actions.className = 'channel-actions';
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'danger small';
            deleteButton.textContent = '삭제';
            deleteButton.dataset.channelId = channel.id;
            deleteButton.dataset.channelKey = channel.channel_key;
            actions.appendChild(deleteButton);

            item.appendChild(labelWrapper);
            item.appendChild(actions);
            fragment.appendChild(item);
        });

    list.appendChild(fragment);
}

function isValidSalesChannel(channelKey) {
    const index = state.salesChannelIndex instanceof Map ? state.salesChannelIndex : new Map();
    const info = getChannelInfo(index, channelKey);
    return Boolean(info);
}

async function parseSalesUploadFile(arrayBuffer) {
    if (!arrayBuffer) return [];
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true, dateNF: 'yyyy-mm-dd' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return [];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
    return rows.filter((row) => Object.values(row).some((value) => sanitizeText(value).trim()));
}

async function handleSalesUploadStart() {
    if (!dom.salesUpload || !dom.salesUpload.fileInput) return;
    if (!dom.salesUpload.fileInput.files || dom.salesUpload.fileInput.files.length === 0) {
        setSalesUploadStatus('업로드할 파일을 선택하세요.', 'error');
        return;
    }

    const file = dom.salesUpload.fileInput.files[0];
    const fileName = sanitizeText(file ? file.name : '').trim() || '업로드_파일';
    const normalizedFileName = normalizeFileName(fileName);
    const fileSize = Number.isFinite(file && file.size) ? Number(file.size) : 0;

    if (dom.salesUpload.uploadButton) {
        dom.salesUpload.uploadButton.setAttribute('disabled', 'disabled');
        dom.salesUpload.uploadButton.textContent = '업로드 중...';
    }
    setSalesUploadStatus('파일을 분석하는 중입니다...');

    let arrayBuffer = null;
    let checksum = null;

    try {
        arrayBuffer = await file.arrayBuffer();
        checksum = await generateArrayBufferHash(arrayBuffer);

        const nameIndex = state.salesUploadLogNameIndex instanceof Map
            ? state.salesUploadLogNameIndex
            : new Map();
        let duplicateLog = null;
        if (normalizedFileName && nameIndex.has(normalizedFileName)) {
            const candidates = nameIndex.get(normalizedFileName);
            if (Array.isArray(candidates) && candidates.length > 0) {
                duplicateLog = [...candidates].sort((a, b) => {
                    const timeA = a && a.created_at ? Number(a.created_at) : 0;
                    const timeB = b && b.created_at ? Number(b.created_at) : 0;
                    return timeB - timeA;
                })[0];
            }
        }

        if (duplicateLog) {
            const uploadedAt = duplicateLog.created_at ? formatDateTime(duplicateLog.created_at) : null;
            const warningMessage = uploadedAt
                ? `이미 업로드된 파일입니다. (${fileName}, 업로드 시각: ${uploadedAt})`
                : `이미 업로드된 파일입니다. (${fileName})`;
            setSalesUploadStatus(`${warningMessage}\n동일 파일을 다시 업로드하려면 파일명을 변경하거나 기존 데이터를 삭제하세요.`, 'warning');
            dom.salesUpload.fileInput.value = '';
            return;
        }

        const rows = await parseSalesUploadFile(arrayBuffer);
        if (!rows || rows.length === 0) {
            setSalesUploadStatus('시트에서 데이터를 찾지 못했습니다. 템플릿 양식을 확인하세요.', 'error');
            return;
        }

        const mapped = rows.map((row, index) => mapSalesUploadRow(row, index, {
            channelIndex: state.salesChannelIndex,
        }));
        const errors = mapped.filter((item) => item.errors.length > 0);
        const validRecords = mapped.filter((item) => item.errors.length === 0);

        if (validRecords.length === 0) {
            const errorMessages = errors
                .slice(0, 5)
                .map((error) => `Row ${error.rowNumber}: ${error.errors.join(', ')}`)
                .join('\n');
            setSalesUploadStatus(`모든 행에 오류가 있습니다.\n${errorMessages}`, 'error');
            return;
        }

        if (errors.length > 0) {
            const errorMessages = errors
                .slice(0, 5)
                .map((error) => `Row ${error.rowNumber}: ${error.errors.join(', ')}`)
                .join('\n');
            setSalesUploadStatus(`총 ${errors.length}건의 행에서 오류가 발생하여 제외됩니다.\n${errorMessages}`, 'warning');
        } else {
            setSalesUploadStatus(`총 ${validRecords.length}건의 데이터를 업로드합니다.`);
        }

        const totalValidRows = validRecords.length;
        const aggregatedMap = new Map();
        validRecords.forEach((record) => {
            const key = getSalesUploadComboKey(record.payload.item_code, record.payload.month, record.payload.channel);
            if (!key) return;

            const itemCode = sanitizeText(record.payload.item_code).trim();
            const monthValue = sanitizeText(record.payload.month).trim();
            const channelValue = sanitizeText(record.payload.channel).trim();

            const standardValue = toNumber(record.payload.standard_quantity);
            const promotionValue = toNumber(record.payload.promotion_quantity);
            const rawTotal = toNumber(record.payload.quantity);
            const quantityValue = Number.isFinite(rawTotal) ? rawTotal : (standardValue + promotionValue);
            const noteValue = sanitizeText(record.payload.note ?? '').trim();

            const payload = {
                item_code: itemCode,
                month: monthValue,
                channel: channelValue,
                standard_quantity: standardValue,
                promotion_quantity: promotionValue,
                quantity: quantityValue,
                note: noteValue,
            };

            if (!aggregatedMap.has(key)) {
                aggregatedMap.set(key, {
                    payload,
                    rowNumbers: [record.rowNumber],
                });
            } else {
                const entry = aggregatedMap.get(key);
                entry.payload = payload;
                entry.rowNumbers.push(record.rowNumber);
            }
        });

        const aggregatedRecords = Array.from(aggregatedMap.values());

        const existingIndex = state.salesUploadIndex instanceof Map
            ? new Map(state.salesUploadIndex)
            : buildSalesUploadIndex(state.salesUploads);

        let successCount = 0;
        let failCount = 0;
        const failDetails = [];
        let createdCount = 0;
        let updatedCount = 0;
        const mergedWithinFileCount = aggregatedRecords.filter((entry) => entry.rowNumbers.length > 1).length;

        for (const entry of aggregatedRecords) {
            const key = getSalesUploadComboKey(entry.payload.item_code, entry.payload.month, entry.payload.channel);
            const existing = key ? existingIndex.get(key) : null;
            const previousSnapshot = existing && existing.id
                ? {
                    quantity: toNullableNumber(existing.quantity),
                    standard_quantity: toNullableNumber(existing.standard_quantity),
                    promotion_quantity: toNullableNumber(existing.promotion_quantity),
                    note: sanitizeText(existing.note).trim(),
                    recordId: existing.id,
                }
                : null;
            const rowLabel = entry.rowNumbers.length > 1
                ? `Rows ${entry.rowNumbers.join(', ')}`
                : `Row ${entry.rowNumbers[0]}`;
            try {
                let targetRecordId = previousSnapshot ? previousSnapshot.recordId : null;
                let currentStandard = toNumber(entry.payload.standard_quantity);
                let currentPromotion = toNumber(entry.payload.promotion_quantity);
                let currentTotal = toNumber(entry.payload.quantity);
                let currentNote = sanitizeText(entry.payload.note ?? '').trim();

                if (existing && existing.id) {
                    const overwritePayload = {
                        quantity: currentTotal,
                        standard_quantity: currentStandard,
                        promotion_quantity: currentPromotion,
                        note: currentNote,
                    };
                    await updateSalesUpload(existing.id, overwritePayload);
                    existingIndex.set(key, {
                        ...existing,
                        quantity: overwritePayload.quantity,
                        standard_quantity: overwritePayload.standard_quantity,
                        promotion_quantity: overwritePayload.promotion_quantity,
                        note: overwritePayload.note,
                    });
                    updatedCount += 1;
                    targetRecordId = existing.id;
                } else {
                    const created = await createSalesUpload(entry.payload);
                    const createdRecord = created && created.data ? created.data : created;
                    const createdId = createdRecord && createdRecord.id ? createdRecord.id : null;
                    existingIndex.set(key, {
                        id: createdId,
                        item_code: entry.payload.item_code,
                        month: entry.payload.month,
                        channel: entry.payload.channel,
                        quantity: currentTotal,
                        standard_quantity: currentStandard,
                        promotion_quantity: currentPromotion,
                        note: currentNote,
                    });
                    createdCount += 1;
                    targetRecordId = createdId;
                }
                successCount += 1;

                try {
                    await createSalesUploadHistory({
                        upload_type: 'file',
                        upload_reference: fileName,
                        month: entry.payload.month,
                        item_code: entry.payload.item_code,
                        channel: entry.payload.channel,
                        quantity: currentTotal,
                        standard_quantity: currentStandard,
                        promotion_quantity: currentPromotion,
                        note: currentNote,
                        previous_quantity: previousSnapshot ? previousSnapshot.quantity : null,
                        previous_standard_quantity: previousSnapshot ? previousSnapshot.standard_quantity : null,
                        previous_promotion_quantity: previousSnapshot ? previousSnapshot.promotion_quantity : null,
                        previous_note: previousSnapshot ? previousSnapshot.note : '',
                        action: previousSnapshot ? 'overwrite' : 'create',
                        target_record_id: targetRecordId || '',
                    });
                } catch (historyError) {
                    console.warn('판매 계획 업로드 상세 이력 저장 실패', historyError);
                }
            } catch (error) {
                failCount += 1;
                const message = error && error.message ? error.message : '알 수 없는 오류';
                failDetails.push(`${rowLabel}: ${message}`);
            }
        }

        dom.salesUpload.fileInput.value = '';

        if (failCount === 0) {
            try {
                await createSalesUploadLog({
                    file_name: fileName,
                    checksum: checksum || '',
                    file_size: fileSize,
                    row_count: totalValidRows,
                    processed_count: successCount,
                    merged_rows: mergedWithinFileCount,
                });
            } catch (logError) {
                console.warn('업로드 이력을 저장하는 중 문제가 발생했습니다.', logError);
            }
        }

        await loadData();

        if (failCount === 0) {
            const actionSummaryParts = [];
            if (createdCount > 0) {
                actionSummaryParts.push(`${createdCount}건 신규 등록`);
            }
            if (updatedCount > 0) {
                actionSummaryParts.push(`${updatedCount}건 최신 데이터로 갱신`);
            }
            const actionSummary = actionSummaryParts.length > 0
                ? actionSummaryParts.join(', ')
                : '등록된 항목 없음';
            const duplicateSummary = mergedWithinFileCount > 0
                ? `\n동일 자재·월·채널 조합 ${mergedWithinFileCount}건은 파일 내에서 마지막 행 기준으로 덮어쓰기 처리되었습니다.`
                : '';
            setSalesUploadStatus(
                `총 ${totalValidRows}행 중 ${successCount}개 조합을 처리했습니다. (${actionSummary})${duplicateSummary}`,
                'success'
            );
        } else {
            const detail = failDetails.slice(0, 5).join('\n');
            setSalesUploadStatus(
                `총 ${totalValidRows}행 중 ${successCount}개 조합을 처리하고 ${failCount}개 조합은 실패했습니다.\n${detail}`,
                'error'
            );
        }
    } catch (error) {
        console.error(error);
        setSalesUploadStatus('파일을 읽거나 업로드하는 중 오류가 발생했습니다. 형식과 내용을 확인하세요.', 'error');
    } finally {
        if (dom.salesUpload.uploadButton) {
            dom.salesUpload.uploadButton.removeAttribute('disabled');
            dom.salesUpload.uploadButton.textContent = '업로드 실행';
        }
    }
}

async function handleSalesUploadFormSubmit(event) {
    event.preventDefault();
    if (!dom.salesUpload || !dom.salesUpload.form) return;

    const month = dom.salesUpload.month ? dom.salesUpload.month.value : '';
    const itemCode = sanitizeText(dom.salesUpload.itemCode ? dom.salesUpload.itemCode.value : '').trim();
    const channelSelect = dom.salesUpload.channel;
    const channelValue = channelSelect ? channelSelect.value : '';
    const standardRaw = dom.salesUpload.standardQuantity ? dom.salesUpload.standardQuantity.value : '';
    const promotionRaw = dom.salesUpload.promotionQuantity ? dom.salesUpload.promotionQuantity.value : '';
    const note = sanitizeText(dom.salesUpload.note ? dom.salesUpload.note.value : '').trim();

    if (!month) {
        alert('등록 월을 선택하세요.');
        return;
    }
    if (!itemCode) {
        alert('자재 코드를 입력하세요.');
        return;
    }
    if (!channelValue) {
        alert('채널을 선택하세요.');
        return;
    }
    if (!isValidSalesChannel(channelValue)) {
        alert('등록된 채널만 선택할 수 있습니다. 채널 마스터를 확인하세요.');
        return;
    }

    const hasStandardInput = sanitizeText(standardRaw).trim() !== '';
    const hasPromotionInput = sanitizeText(promotionRaw).trim() !== '';

    if (!hasStandardInput && !hasPromotionInput) {
        alert('스탠다드 수량 또는 프로모션 수량 중 하나 이상을 입력하세요.');
        return;
    }

    const standardParsed = hasStandardInput ? parseNumberOrNull(standardRaw) : 0;
    const promotionParsed = hasPromotionInput ? parseNumberOrNull(promotionRaw) : 0;

    if (hasStandardInput && (standardParsed === null || standardParsed < 0)) {
        alert('스탠다드 수량은 0 이상 숫자로 입력하세요.');
        return;
    }
    if (hasPromotionInput && (promotionParsed === null || promotionParsed < 0)) {
        alert('프로모션 수량은 0 이상 숫자로 입력하세요.');
        return;
    }

    const standardQuantity = hasStandardInput ? standardParsed : 0;
    const promotionQuantity = hasPromotionInput ? promotionParsed : 0;
    const totalQuantity = standardQuantity + promotionQuantity;

    if (totalQuantity <= 0) {
        alert('입력한 수량의 합계가 0입니다. 0보다 큰 값을 입력하세요.');
        return;
    }

    const channelInfo = getChannelInfo(state.salesChannelIndex, channelValue);
    const payload = {
        month,
        item_code: itemCode,
        channel: channelInfo ? channelInfo.channel_key : normalizeChannelKey(channelValue),
        quantity: totalQuantity,
        standard_quantity: standardQuantity,
        promotion_quantity: promotionQuantity,
        note,
    };

    const existingKey = getSalesUploadComboKey(payload.item_code, payload.month, payload.channel);
    const existingRecord = existingKey && state.salesUploadIndex instanceof Map
        ? state.salesUploadIndex.get(existingKey)
        : null;

    const submitButton = dom.salesUpload.form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.setAttribute('disabled', 'disabled');
        submitButton.textContent = '등록 중...';
    }

    const previousSnapshot = existingRecord && existingRecord.id
        ? {
            quantity: toNullableNumber(existingRecord.quantity),
            standard_quantity: toNullableNumber(existingRecord.standard_quantity),
            promotion_quantity: toNullableNumber(existingRecord.promotion_quantity),
            note: sanitizeText(existingRecord.note).trim(),
            recordId: existingRecord.id,
        }
        : null;

    try {
        let statusMessage = '';
        if (existingRecord && existingRecord.id) {
            /* 기존 수량에 입력 수량을 누적(더하기) */
            const prevStd = toNumber(previousSnapshot ? previousSnapshot.standard_quantity : 0);
            const prevPromo = toNumber(previousSnapshot ? previousSnapshot.promotion_quantity : 0);
            const addedStd = toNumber(payload.standard_quantity);
            const addedPromo = toNumber(payload.promotion_quantity);
            const accumulatedStd = prevStd + addedStd;
            const accumulatedPromo = prevPromo + addedPromo;
            const accumulatedTotal = accumulatedStd + accumulatedPromo;
            const accumulateNote = sanitizeText(payload.note ?? '').trim();
            const accumulatePayload = {
                quantity: accumulatedTotal,
                standard_quantity: accumulatedStd,
                promotion_quantity: accumulatedPromo,
                note: accumulateNote,
            };
            await updateSalesUpload(existingRecord.id, accumulatePayload);
            statusMessage = `기존 데이터에 수량이 누적되었습니다. (스탠다드 ${prevStd}→${accumulatedStd}, 프로모션 ${prevPromo}→${accumulatedPromo})`;

            try {
                await createSalesUploadHistory({
                    upload_type: 'manual',
                    upload_reference: '단건 등록 폼',
                    month: payload.month,
                    item_code: payload.item_code,
                    channel: payload.channel,
                    quantity: accumulatePayload.quantity,
                    standard_quantity: accumulatePayload.standard_quantity,
                    promotion_quantity: accumulatePayload.promotion_quantity,
                    note: accumulatePayload.note,
                    previous_quantity: previousSnapshot ? previousSnapshot.quantity : null,
                    previous_standard_quantity: previousSnapshot ? previousSnapshot.standard_quantity : null,
                    previous_promotion_quantity: previousSnapshot ? previousSnapshot.promotion_quantity : null,
                    previous_note: previousSnapshot ? previousSnapshot.note : '',
                    action: 'accumulate',
                    target_record_id: existingRecord.id,
                });
            } catch (historyError) {
                console.warn('판매 계획 단건 등록 이력 저장 실패', historyError);
            }
        } else {
            const created = await createSalesUpload(payload);
            const createdRecord = created && created.data ? created.data : created;
            const createdId = createdRecord && createdRecord.id ? createdRecord.id : null;
            statusMessage = '단건 등록이 완료되었습니다. 최신 값이 반영됩니다.';

            try {
                await createSalesUploadHistory({
                    upload_type: 'manual',
                    upload_reference: '단건 등록 폼',
                    month: payload.month,
                    item_code: payload.item_code,
                    channel: payload.channel,
                    quantity: toNumber(payload.quantity),
                    standard_quantity: toNumber(payload.standard_quantity),
                    promotion_quantity: toNumber(payload.promotion_quantity),
                    note: sanitizeText(payload.note ?? '').trim(),
                    previous_quantity: null,
                    previous_standard_quantity: null,
                    previous_promotion_quantity: null,
                    previous_note: '',
                    action: 'create',
                    target_record_id: createdId || '',
                });
            } catch (historyError) {
                console.warn('판매 계획 단건 등록 이력 저장 실패', historyError);
            }
        }
        setSalesUploadStatus(statusMessage, 'success');
        resetSalesUploadForm();
        await loadData();
    } catch (error) {
        console.error(error);
        setSalesUploadStatus('단건 등록 중 오류가 발생했습니다. 입력 값을 확인하세요.', 'error');
    } finally {
        if (submitButton) {
            submitButton.removeAttribute('disabled');
            submitButton.textContent = '등록';
        }
    }
}

function handleSalesUploadFormReset() {
    resetSalesUploadForm();
}

async function handleSalesUploadDelete(id) {
    if (!id) return;
    const target = state.salesUploads.find((record) => record.id === id);
    if (!target) return;

    const confirmDelete = confirm(`${sanitizeText(target.month) || '-'} · ${sanitizeText(target.item_code) || '-'} · ${sanitizeText(target.channel) || '채널 미지정'} 데이터를 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    try {
        await deleteSalesUpload(id);
        setSalesUploadStatus('선택한 판매 계획 데이터가 삭제되었습니다.', 'success');
        await loadData();
    } catch (error) {
        console.error(error);
        setSalesUploadStatus('삭제 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.', 'error');
    }
}

function handleSalesUploadTemplateDownload() {
    try {
        const header = ['month', 'item_code', 'channel', 'standard_quantity(BOX)', 'promotion_quantity(BOX)', 'note'];
        const sampleRows = [
            ['2025-05', 'BAT-100', 'ONLINE', 900, 300, '신제품 런칭 프로모션'],
            ['2025-05', 'BAT-100', 'OFFLINE', 850, 0, '메가스토어 선주문'],
            ['2025-06', 'CNT-210', 'WHOLESALE', 520, 120, '특가 계약 물량'],
        ];
        const worksheet = XLSX.utils.aoa_to_sheet([header, ...sampleRows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'SalesPlan');
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sales_plan_template_${Date.now()}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setSalesUploadStatus('판매계획 업로드 템플릿을 다운로드했습니다.', 'success');
    } catch (error) {
        console.error(error);
        setSalesUploadStatus('템플릿을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.', 'error');
    }
}

/* 프론트엔드 필드명 → 백엔드 LineCapaPlanDto 필드명 변환 */
function toLineCapaApiPayload(data) {
    const payload = { ...data };
    /* month → plan_month (DTO: planMonth → Jackson snake_case → plan_month) */
    if (payload.month !== undefined && payload.plan_month === undefined) {
        payload.plan_month = payload.month;
        delete payload.month;
    }
    return payload;
}

/* 프론트엔드 필드명 → 백엔드 SalesPlanUploadDto 필드명 변환 */
function toSalesUploadApiPayload(data) {
    const payload = { ...data };
    /* month → plan_month (DTO: planMonth → Jackson snake_case → plan_month) */
    if (payload.month !== undefined && payload.plan_month === undefined) {
        payload.plan_month = payload.month;
        delete payload.month;
    }
    return payload;
}

async function createSalesUpload(data) {
    const payload = toSalesUploadApiPayload(data);
    const response = await fetch('/sales-api/sales-plan-uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('판매 계획 업로드 실패');
    }
    return response.json();
}

async function updateSalesUpload(id, data) {
    const payload = toSalesUploadApiPayload(data);
    const response = await fetch(`/sales-api/sales-plan-uploads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('판매 계획 데이터 수정 실패');
    }
    return response.json();
}

async function createSalesUploadLog(data) {
    if (!data) return null;
    const response = await fetch('/sales-api/sales-plan-upload-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('업로드 이력 저장 실패');
    }
    return response.json();
}

async function createSalesUploadHistory(data) {
    if (!data) return null;
    const payload = toSalesUploadApiPayload(data);
    const response = await fetch('/sales-api/sales-plan-upload-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('판매 계획 업로드 상세 이력 저장 실패');
    }
    return response.json();
}

async function deleteSalesUpload(id) {
    const response = await fetch(`/sales-api/sales-plan-uploads/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('판매 계획 데이터 삭제 실패');
    }
}

async function handleSalesChannelFormSubmit(event) {
    event.preventDefault();
    if (!dom.salesUpload || !dom.salesUpload.channelForm) return;

    const keyInput = dom.salesUpload.channelKey;
    const nameInput = dom.salesUpload.channelName;
    const descInput = dom.salesUpload.channelDescription;

    const channelKey = normalizeChannelKey(keyInput ? keyInput.value : '');
    const channelName = sanitizeText(nameInput ? nameInput.value : '').trim();
    const description = sanitizeText(descInput ? descInput.value : '').trim();

    if (!channelKey) {
        alert('채널 코드를 입력하세요.');
        return;
    }
    if (!channelName) {
        alert('채널 명칭을 입력하세요.');
        return;
    }
    if (isValidSalesChannel(channelKey)) {
        alert('이미 등록된 채널 코드입니다. 다른 코드를 입력하세요.');
        return;
    }

    const payload = {
        channel_key: channelKey,
        channel_name: channelName,
        description,
    };

    const submitButton = dom.salesUpload.channelForm.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.setAttribute('disabled', 'disabled');
        submitButton.textContent = '등록 중...';
    }

    try {
        await createSalesChannel(payload);
        dom.salesUpload.channelForm.reset();
        setSalesUploadStatus('채널이 등록되었습니다. 업로드 시 해당 채널 코드를 사용하세요.', 'success');
        await loadData();
    } catch (error) {
        console.error(error);
        setSalesUploadStatus('채널 등록 중 오류가 발생했습니다. 입력 값을 확인하세요.', 'error');
    } finally {
        if (submitButton) {
            submitButton.removeAttribute('disabled');
            submitButton.textContent = '채널 등록';
        }
    }
}

async function handleSalesChannelDelete(id, channelKey) {
    if (!id) return;
    const confirmMessage = channelKey
        ? `${channelKey} 채널을 삭제하시겠습니까?`
        : '선택한 채널을 삭제하시겠습니까?';
    const confirmed = confirm(confirmMessage);
    if (!confirmed) return;

    try {
        await deleteSalesChannel(id);
        setSalesUploadStatus('채널을 삭제했습니다.', 'success');
        await loadData();
    } catch (error) {
        console.error(error);
        setSalesUploadStatus('채널 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.', 'error');
    }
}

async function createSalesChannel(data) {
    const response = await fetch('/sales-api/sales-channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('채널 등록 실패');
    }
    return response.json();
}

async function deleteSalesChannel(id) {
    const response = await fetch(`/sales-api/sales-channels/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('채널 삭제 실패');
    }
}

// -------------------- 일괄 업로드 --------------------
async function persistLineCapaRecord(payload, recordId) {
    const endpoint = recordId ? `/sales-api/line-capa-plans/${recordId}` : '/sales-api/line-capa-plans';
    const method = recordId ? 'PUT' : 'POST';
    const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toLineCapaApiPayload(payload)),
    });
    if (!response.ok) {
        throw new Error(recordId ? '라인 CAPA 수정 실패' : '라인 CAPA 등록 실패');
    }
    return response.json();
}

async function persistLineItemMasterRecord(payload, recordId) {
    const endpoint = recordId ? `/sales-api/line-item-masters/${recordId}` : '/sales-api/line-item-masters';
    const method = recordId ? 'PUT' : 'POST';
    const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error(recordId ? '자재 마스터 수정 실패' : '자재 마스터 등록 실패');
    }
    return response.json();
}

function setBulkStatus(message, type = '') {
    if (!dom.bulk.status) return;
    dom.bulk.status.textContent = message;
    dom.bulk.status.className = 'bulk-status';
    if (type) {
        dom.bulk.status.classList.add(type);
    }
}

function resetBulkUploadModal(target = state.bulkUploadTarget) {
    if (!dom.bulk.modal) return;
    const normalized = normalizeBulkTarget(target);
    setBulkTarget(normalized);
    if (dom.bulk.fileInput) {
        dom.bulk.fileInput.value = '';
    }
    setBulkStatus(`${getBulkTargetLabel(normalized)} 데이터를 업로드하려면 파일을 선택하세요.`);
}

function openBulkUploadModal(target = state.bulkUploadTarget, options = {}) {
    if (!dom.bulk.modal) return;
    dom.bulk.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    resetBulkUploadModal(target);

    /* 단일 모드: 특정 타겟만 표시하고 탭 네비게이션 숨김 */
    const tabNav = dom.bulk.modal.querySelector('.bulk-target-tabs');
    const titleEl = dom.bulk.modal.querySelector('#bulk-upload-title');
    if (options.singleMode) {
        if (tabNav) tabNav.style.display = 'none';
        if (titleEl) titleEl.textContent = getBulkTargetLabel(normalizeBulkTarget(target)) + ' 업로드';
    } else {
        if (tabNav) tabNav.style.display = '';
        if (titleEl) titleEl.textContent = '엑셀/CSV 일괄 업로드';
    }
}

function closeBulkUploadModal() {
    if (!dom.bulk.modal) return;
    dom.bulk.modal.classList.add('hidden');
    document.body.style.overflow = '';
    /* 단일 모드 상태 복원 */
    const tabNav = dom.bulk.modal.querySelector('.bulk-target-tabs');
    const titleEl = dom.bulk.modal.querySelector('#bulk-upload-title');
    if (tabNav) tabNav.style.display = '';
    if (titleEl) titleEl.textContent = '엑셀/CSV 일괄 업로드';
}

async function parseBulkFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true, dateNF: 'yyyy-mm-dd' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return [];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
    return rows.filter((row) => Object.values(row).some((value) => sanitizeText(value)));
}

function getRecentSalesAverageKey(itemCode, baseMonth) {
    const monthKey = sanitizeText(baseMonth).trim();
    const codeKey = getNormalizedItemCode(itemCode);
    if (!monthKey || !codeKey) return '';
    return `${codeKey}__${monthKey}`;
}

function buildRecentSalesAverageIndex(records) {
    const index = new Map();
    (records || []).forEach((record) => {
        if (!record) return;
        const key = getRecentSalesAverageKey(record.item_code, record.base_month);
        if (!key) return;
        index.set(key, record);
    });
    return index;
}

function setRecentSalesUploadStatus(message, type = '') {
    if (!dom.recentSalesUpload || !dom.recentSalesUpload.status) return;
    dom.recentSalesUpload.status.textContent = message;
    dom.recentSalesUpload.status.className = 'sales-status';
    if (type) {
        dom.recentSalesUpload.status.classList.add(type);
    }
}

function mapRecentSalesUploadRow(row, index) {
    const normalizedRow = {};
    Object.entries(row || {}).forEach(([rawKey, value]) => {
        const normalizedKey = normalizeBulkKey(rawKey);
        const mappedKey = RECENT_SALES_COLUMN_MAP[normalizedKey];
        if (!mappedKey) return;
        normalizedRow[mappedKey] = value;
    });

    const errors = [];
    RECENT_SALES_REQUIRED_FIELDS.forEach((field) => {
        const value = sanitizeText(normalizedRow[field]).trim();
        if (!value) {
            errors.push(`${field} 누락`);
        }
    });

    const itemCode = sanitizeText(normalizedRow.item_code).trim();
    const m3Value = toNumber(normalizedRow.m3);
    const m2Value = toNumber(normalizedRow.m2);
    const m1Value = toNumber(normalizedRow.m1);

    if (!itemCode) {
        errors.push('item_code 누락');
    }

    if (!Number.isFinite(m3Value) || m3Value < 0) {
        errors.push('m3 값 오류');
    }
    if (!Number.isFinite(m2Value) || m2Value < 0) {
        errors.push('m2 값 오류');
    }
    if (!Number.isFinite(m1Value) || m1Value < 0) {
        errors.push('m1 값 오류');
    }

    const total = (Number.isFinite(m3Value) ? m3Value : 0)
        + (Number.isFinite(m2Value) ? m2Value : 0)
        + (Number.isFinite(m1Value) ? m1Value : 0);
    const average = total / 3;

    const payload = {
        item_code: itemCode,
        base_month: '',
        m3: Number.isFinite(m3Value) ? m3Value : 0,
        m2: Number.isFinite(m2Value) ? m2Value : 0,
        m1: Number.isFinite(m1Value) ? m1Value : 0,
        total,
        average,
    };

    return {
        payload,
        errors,
        rowNumber: index + 2,
    };
}

async function handleBulkUploadStart() {
    if (!dom.bulk.fileInput || !dom.bulk.fileInput.files.length) {
        setBulkStatus('업로드할 파일을 선택하세요.', 'error');
        return;
    }

    const target = normalizeBulkTarget(state.bulkUploadTarget);
    const datasetLabel = getBulkTargetLabel(target);

    const file = dom.bulk.fileInput.files[0];
    if (dom.bulk.startButton) {
        dom.bulk.startButton.setAttribute('disabled', 'disabled');
        dom.bulk.startButton.textContent = '업로드 중...';
    }
    setBulkStatus(`${datasetLabel} 파일을 분석하는 중입니다...`);

    try {
        const rows = await parseBulkFile(file);
        if (rows.length === 0) {
            setBulkStatus('시트에서 데이터를 찾지 못했습니다. 템플릿 양식을 확인하세요.', 'error');
            return;
        }

        let mapped;
        if (target === BULK_TARGETS.LINE_CAPA) {
            mapped = rows.map((row, index) => mapLineCapaBulkRow(row, index));
        } else if (target === BULK_TARGETS.LINE_MASTER) {
            mapped = rows.map((row, index) => mapLineMasterBulkRow(row, index));
        } else {
            mapped = rows.map((row, index) => mapProductionBulkRow(row, index));
        }

        const errors = mapped.filter((item) => item.errors.length > 0);
        const validRecords = mapped.filter((item) => item.errors.length === 0);

        if (validRecords.length === 0) {
            const errorMessages = errors
                .slice(0, 5)
                .map((error) => `Row ${error.rowNumber}: ${error.errors.join(', ')}`)
                .join('\n');
            setBulkStatus(`모든 행에 오류가 있습니다.\n${errorMessages}`, 'error');
            return;
        }

        if (errors.length > 0) {
            const errorMessages = errors
                .slice(0, 5)
                .map((error) => `Row ${error.rowNumber}: ${error.errors.join(', ')}`)
                .join('\n');
            setBulkStatus(`총 ${errors.length}건의 행에서 오류가 발생하여 제외되었습니다.\n${errorMessages}`, 'warning');
        } else {
            setBulkStatus(`총 ${validRecords.length}건의 ${datasetLabel} 데이터를 업로드합니다...`);
        }

        let successCount = 0;
        let failCount = 0;
        const failDetails = [];
        const lineCapaCache = new Map();
        const lineMasterCache = new Map();
        const productionRecordIndex = target === BULK_TARGETS.PRODUCTION ? buildProductionRecordIndex() : null;

        for (const record of validRecords) {
            try {
                if (target === BULK_TARGETS.LINE_CAPA) {
                    const payload = record.payload;
                    const compositeKey = getLineCompositeKey(payload.production_line, payload.line_category, payload.month);
                    let existingId = compositeKey ? lineCapaCache.get(compositeKey) : null;
                    if (!existingId) {
                        const existingPlan = findLineDowntimePlan(payload.production_line, payload.month, payload.line_category);
                        existingId = existingPlan ? existingPlan.id : null;
                        if (compositeKey && existingId) {
                            lineCapaCache.set(compositeKey, existingId);
                        }
                    }
                    const saved = await persistLineCapaRecord(payload, existingId);
                    if (compositeKey && saved && saved.id) {
                        lineCapaCache.set(compositeKey, saved.id);
                    }
                } else if (target === BULK_TARGETS.LINE_MASTER) {
                    const payload = record.payload;
                    const codeKey = getNormalizedItemCode(payload.item_code);
                    let existingId = codeKey ? lineMasterCache.get(codeKey) : null;
                    if (!existingId) {
                        const existingMaster = getLineItemMasterByCode(payload.item_code);
                        existingId = existingMaster ? existingMaster.id : null;
                        if (codeKey && existingId) {
                            lineMasterCache.set(codeKey, existingId);
                        }
                    }
                    const saved = await persistLineItemMasterRecord(payload, existingId);
                    if (codeKey && saved && saved.id) {
                        lineMasterCache.set(codeKey, saved.id);
                    }
                } else {
                    const payload = { ...record.payload };
                    const provided = record.provided || {};
                    const key = productionRecordIndex ? getProductionRecordKey(payload.item_code, payload.month) : '';
                    const existingEntry = key && productionRecordIndex ? productionRecordIndex.get(key) : null;
                    const existingId = existingEntry && existingEntry.id ? existingEntry.id : null;
                    const baseRecord = existingEntry || null;

                    if (baseRecord) {
                        if (!provided.item_name && baseRecord.item_name) {
                            payload.item_name = baseRecord.item_name;
                        }
                        if (!provided.category && baseRecord.category) {
                            payload.category = baseRecord.category;
                        }
                        if (!provided.production_line && baseRecord.production_line) {
                            payload.production_line = baseRecord.production_line;
                        }
                        if (!provided.sales_plan && Number.isFinite(baseRecord.sales_plan)) {
                            payload.sales_plan = baseRecord.sales_plan;
                        }
                        if (!provided.sales_actual && baseRecord.sales_actual !== undefined) {
                            const existingSalesActual = toNullableNumber(baseRecord.sales_actual);
                            payload.sales_actual = existingSalesActual;
                        }
                        if (!provided.production_plan && Number.isFinite(baseRecord.production_plan)) {
                            payload.production_plan = baseRecord.production_plan;
                        }
                        if (!provided.production_actual) {
                            const existingActual = toNullableNumber(baseRecord.production_actual);
                            payload.production_actual = existingActual;
                        }
                        if (!provided.production_remaining) {
                            const existingRemaining = toNullableNumber(baseRecord.production_remaining);
                            if (existingRemaining !== null) {
                                payload.production_remaining = existingRemaining;
                            } else if (Number.isFinite(payload.production_plan) && Number.isFinite(payload.production_actual)) {
                                payload.production_remaining = payload.production_plan - payload.production_actual;
                            }
                        }
                        if (!provided.beginning_inventory && Number.isFinite(baseRecord.beginning_inventory)) {
                            payload.beginning_inventory = baseRecord.beginning_inventory;
                        }
                        if (!provided.available_inventory && baseRecord.available_inventory != null) {
                            payload.available_inventory = baseRecord.available_inventory;
                        }
                        if (!provided.target_ending_inventory && Number.isFinite(baseRecord.target_ending_inventory)) {
                            payload.target_ending_inventory = baseRecord.target_ending_inventory;
                        }
                        if (!provided.optimal_inventory_2025 && baseRecord.optimal_inventory_2025 !== undefined) {
                            const existingOptimal = toNullableNumber(baseRecord.optimal_inventory_2025);
                            payload.optimal_inventory_2025 = existingOptimal;
                        }
                        if (!provided.capacity_limit && Number.isFinite(baseRecord.capacity_limit)) {
                            payload.capacity_limit = baseRecord.capacity_limit;
                        }
                        if (!provided.notes && baseRecord.notes) {
                            payload.notes = baseRecord.notes;
                        }
                    }

                    if (!existingId) {
                        if (payload.production_actual === null) {
                            payload.production_actual = 0;
                        }
                        if (payload.production_remaining === null && Number.isFinite(payload.production_plan)) {
                            payload.production_remaining = payload.production_plan - payload.production_actual;
                        }
                        if (payload.sales_actual === null) {
                            payload.sales_actual = 0;
                        }
                    }

                    let savedRecord;
                    if (existingId) {
                        savedRecord = await updateRecord(existingId, payload);
                    } else {
                        savedRecord = await createRecord(payload);
                    }
                    if (key && productionRecordIndex) {
                        let nextRecord = null;
                        if (savedRecord && savedRecord.id) {
                            nextRecord = normalizeRecord(savedRecord);
                        } else if (baseRecord) {
                            nextRecord = {
                                ...baseRecord,
                                ...payload,
                                id: baseRecord.id || existingId || (savedRecord && savedRecord.id) || null,
                            };
                        }
                        if (nextRecord) {
                            productionRecordIndex.set(key, nextRecord);
                        }
                    }
                }
                successCount += 1;
            } catch (error) {
                failCount += 1;
                failDetails.push(`Row ${record.rowNumber}: ${error.message}`);
            }
        }

        if (target === BULK_TARGETS.LINE_CAPA) {
            await refreshLineCapaPlans();
        } else if (target === BULK_TARGETS.LINE_MASTER) {
            await refreshLineItemMasters();
        } else {
            await loadData();
        }

        if (failCount === 0) {
            setBulkStatus(`총 ${successCount}건의 ${datasetLabel} 데이터가 정상적으로 업로드되었습니다.`, 'success');
        } else {
            const detail = failDetails.slice(0, 5).join('\n');
            setBulkStatus(`총 ${successCount}건 성공, ${failCount}건 실패했습니다.\n${detail}`, 'error');
        }
    } catch (error) {
        console.error(error);
        setBulkStatus(`${datasetLabel} 파일을 처리하는 중 오류가 발생했습니다. 형식과 내용을 확인하세요.`, 'error');
    } finally {
        if (dom.bulk.startButton) {
            dom.bulk.startButton.removeAttribute('disabled');
            dom.bulk.startButton.textContent = '업로드 시작';
        }
    }
}

function handleBulkTemplateDownload(event) {
    try {
        const targetAttr = event && event.currentTarget ? event.currentTarget.dataset.bulkTemplate : null;
        const target = normalizeBulkTarget(targetAttr || state.bulkUploadTarget);
        const datasetLabel = getBulkTargetLabel(target);

        let header;
        let sampleRows;
        let sheetName;
        let filePrefix;

        if (target === BULK_TARGETS.LINE_CAPA) {
            header = ['line_category', 'production_line', 'month', 'daily_capa', 'daily_operating_hours', 'planned_operating_days', 'computed_capa', 'note'];
            sampleRows = [
                ['두루마리', '가공 4호기', '2025-05', 120, 20, 22, 52800, '야간 추가 2교대 반영'],
                ['물티슈', 'OEM 상품', '2025-05', 95, 18, 21, 35910, '주간 전담 팀 운영'],
            ];
            sheetName = 'Line CAPA Template';
            filePrefix = 'snop_line_capa_template';
        } else if (target === BULK_TARGETS.LINE_MASTER) {
            header = ['item_code', 'production_line', 'hourly_throughput'];
            sampleRows = [
                ['BAT-100', '라인 2', 140],
                ['CNT-210', '라인 1', 90],
            ];
            sheetName = 'Line Master Template';
            filePrefix = 'snop_line_master_template';
        } else if (target === BULK_TARGETS.RECENT_SALES) {
            header = ['item_code', 'm3', 'm2', 'm1'];
            sampleRows = [
                ['BAT-100', 1200, 980, 1100],
                ['CNT-210', 720, 680, 760],
            ];
            sheetName = 'Recent Sales Template';
            filePrefix = 'snop_recent_sales_template';
        } else {
            header = ['item_code', 'item_name', 'category', 'production_line', 'month', 'production_plan', 'beginning_inventory', 'target_ending_inventory', 'optimal_inventory_2025', 'notes'];
            sampleRows = [
                ['BAT-100', '배터리 모듈', '에너지저장', '라인 2', '2025-05', 1680, 600, 520, 650, '신규 수요 대응'],
                ['CNT-210', '컨트롤러', '제어시스템', '라인 1', '2025-05', 840, 210, 250, 320, '서비스 부품 재고 확보'],
                ['MOD-330', '파워 모듈', '전력변환', '라인 3', '2025-05', 920, 430, 450, 500, '시즌 초기 물량'],
            ];
            sheetName = 'Production Template';
            filePrefix = 'snop_production_template';
        }

        const worksheet = XLSX.utils.aoa_to_sheet([header, ...sampleRows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filePrefix}_${Date.now()}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setBulkStatus(`${datasetLabel} 템플릿 파일을 다운로드했습니다. 내용을 입력 후 업로드하세요.`, 'success');
    } catch (error) {
        console.error(error);
        setBulkStatus(`${getBulkTargetLabel()} 템플릿을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.`, 'error');
    }
}

// -------------------- SKU별 적정재고 업로드 --------------------

function openTargetInventoryUploadModal() {
    const m = dom.targetInventoryUpload;
    if (!m || !m.modal) return;
    m.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    resetTargetInventoryUploadModal();
}

function closeTargetInventoryUploadModal() {
    const m = dom.targetInventoryUpload;
    if (!m || !m.modal) return;
    m.modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function resetTargetInventoryUploadModal() {
    const m = dom.targetInventoryUpload;
    if (!m) return;
    if (m.fileInput) m.fileInput.value = '';
    if (m.startButton) {
        m.startButton.removeAttribute('disabled');
        m.startButton.textContent = '업로드 시작';
    }
    setTargetInventoryStatus('');
}

function setTargetInventoryStatus(message, type = '') {
    const el = dom.targetInventoryUpload?.status;
    if (!el) return;
    el.textContent = message;
    el.className = 'bulk-status';
    if (type === 'error') el.classList.add('status-error');
    else if (type === 'success') el.classList.add('status-success');
    else if (type === 'warning') el.classList.add('status-warning');
}

function handleTargetInventoryTemplateDownload() {
    try {
        const header = ['month', 'item_code', 'item_name', 'target_ending_inventory'];

        /* 시스템 현재 년월 (YYYY-MM) */
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        /* 생산계획 현황에 등록된 자재코드 추출 (중복 제거, 코드 기준 정렬) */
        const seen = new Set();
        const itemList = [];
        (state.rawData || []).forEach((record) => {
            const code = sanitizeText(record.item_code).trim();
            if (!code || seen.has(code)) return;
            seen.add(code);
            const name = sanitizeText(record.item_name).trim();
            const currentTarget = Number.isFinite(record.target_ending_inventory) ? record.target_ending_inventory : '';
            itemList.push({ code, name, currentTarget });
        });
        itemList.sort((a, b) => a.code.localeCompare(b.code));

        /* 등록된 자재가 있으면 자재별 행을 생성, 없으면 샘플 행 */
        let dataRows;
        if (itemList.length > 0) {
            dataRows = itemList.map((item) => [currentMonth, item.code, item.name, item.currentTarget]);
        } else {
            dataRows = [
                [currentMonth, 'SBW-EZP0003A', '(예시) 자재명칭', 400],
                [currentMonth, 'KNR-SF030', '(예시) 자재명칭', 1200],
            ];
        }

        const worksheet = XLSX.utils.aoa_to_sheet([header, ...dataRows]);
        /* 컬럼 너비 설정 */
        worksheet['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 40 }, { wch: 22 }];
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Target Inventory');
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `snop_target_inventory_template_${currentMonth}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        const countMsg = itemList.length > 0 ? `(${itemList.length}개 자재 포함)` : '';
        setTargetInventoryStatus(`적정재고 템플릿 파일을 다운로드했습니다. ${countMsg} 적정재고 값을 입력 후 업로드하세요.`, 'success');
    } catch (error) {
        console.error(error);
        setTargetInventoryStatus('템플릿을 생성하는 중 오류가 발생했습니다.', 'error');
    }
}

/* 적정재고 업로드용 컬럼 매핑 */
const TARGET_INV_COLUMN_MAP = {
    'month': 'month',
    '계획월': 'month',
    '계획 월': 'month',
    'plan_month': 'month',
    '월': 'month',
    'item_code': 'item_code',
    '자재코드': 'item_code',
    '자재 코드': 'item_code',
    'material_code': 'item_code',
    'sku': 'item_code',
    'SKU': 'item_code',
    'target_ending_inventory': 'target_ending_inventory',
    '적정재고': 'target_ending_inventory',
    'SKU별 적정재고': 'target_ending_inventory',
    'SKU별적정재고': 'target_ending_inventory',
    '적정 재고': 'target_ending_inventory',
    'target_inventory': 'target_ending_inventory',
    'optimal_inventory': 'target_ending_inventory',
};

function mapTargetInventoryRow(rawRow, index) {
    const normalized = {};
    for (const [key, value] of Object.entries(rawRow)) {
        const trimmedKey = sanitizeText(key).trim();
        const mappedKey = TARGET_INV_COLUMN_MAP[trimmedKey];
        if (mappedKey) {
            normalized[mappedKey] = sanitizeText(value).trim();
        }
    }

    const errors = [];
    const rowNumber = index + 2; /* 헤더 제외 */

    /* 계획월 검증 */
    let month = normalized.month || '';
    month = normalizeMonthValue(month);
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        errors.push('유효한 계획월(YYYY-MM)을 입력하세요.');
    }

    /* 자재코드 검증 */
    const itemCode = (normalized.item_code || '').toUpperCase().trim();
    if (!itemCode) {
        errors.push('자재코드를 입력하세요.');
    }

    /* 적정재고 검증 */
    const rawValue = normalized.target_ending_inventory || '';
    const targetValue = toNumber(rawValue);
    if (!Number.isFinite(targetValue) || targetValue < 0) {
        errors.push('적정재고는 0 이상의 숫자를 입력하세요.');
    }

    return {
        rowNumber,
        errors,
        payload: {
            month,
            item_code: itemCode,
            target_ending_inventory: targetValue,
        },
    };
}

async function handleTargetInventoryUploadStart() {
    const m = dom.targetInventoryUpload;
    if (!m || !m.fileInput || !m.fileInput.files.length) {
        setTargetInventoryStatus('업로드할 파일을 선택하세요.', 'error');
        return;
    }

    const file = m.fileInput.files[0];
    if (m.startButton) {
        m.startButton.setAttribute('disabled', 'disabled');
        m.startButton.textContent = '업로드 중...';
    }
    setTargetInventoryStatus('파일을 분석하는 중입니다...');

    try {
        const rows = await parseBulkFile(file);
        if (rows.length === 0) {
            setTargetInventoryStatus('시트에서 데이터를 찾지 못했습니다. 템플릿 양식을 확인하세요.', 'error');
            return;
        }

        const mapped = rows.map((row, index) => mapTargetInventoryRow(row, index));
        const errors = mapped.filter((item) => item.errors.length > 0);
        const validRecords = mapped.filter((item) => item.errors.length === 0);

        if (validRecords.length === 0) {
            const errorMessages = errors
                .slice(0, 5)
                .map((e) => `Row ${e.rowNumber}: ${e.errors.join(', ')}`)
                .join('\n');
            setTargetInventoryStatus(`모든 행에 오류가 있습니다.\n${errorMessages}`, 'error');
            return;
        }

        if (errors.length > 0) {
            const errorMessages = errors
                .slice(0, 5)
                .map((e) => `Row ${e.rowNumber}: ${e.errors.join(', ')}`)
                .join('\n');
            setTargetInventoryStatus(`${errors.length}건의 행 오류를 제외하고 ${validRecords.length}건을 업로드합니다...\n${errorMessages}`, 'warning');
        } else {
            setTargetInventoryStatus(`총 ${validRecords.length}건의 적정재고 데이터를 업로드합니다...`);
        }

        /* 기존 snop_records에서 item_code + month 기준으로 매칭하여 target_ending_inventory 갱신 */
        let successCount = 0;
        let failCount = 0;
        let notFoundCount = 0;
        const failDetails = [];

        /* 현재 로드된 레코드 인덱스 구축 (item_code + month → record id) */
        /* 전체 레코드를 페이지네이션으로 가져옴 — Spring 기본 max-page-size(2000)에 걸리지 않도록 */
        const recordIndex = new Map();
        try {
            let page = 0;
            let allRecords = [];
            let hasMore = true;
            const PAGE_SIZE = 5000;
            while (hasMore) {
                const response = await fetch(`/sales-api/snop-records?size=${PAGE_SIZE}&page=${page}`);
                if (!response.ok) break;
                const payload = await response.json();
                const records = extractData(payload);
                if (!records || records.length === 0) break;
                allRecords = allRecords.concat(records);
                /* 페이지네이션 응답에서 마지막 페이지 여부 확인 */
                const pageData = payload.data || payload;
                if (pageData.last === true || records.length < PAGE_SIZE) {
                    hasMore = false;
                } else {
                    page++;
                }
                /* 안전장치: 최대 20페이지(100,000건)까지만 */
                if (page > 20) break;
            }
            console.log(`[적정재고 업로드] 전체 SnopRecord ${allRecords.length}건 로드 완료 (${page + 1}페이지)`);
            (allRecords || []).forEach((rec) => {
                const code = getNormalizedItemCode(rec.item_code);
                const month = sanitizeText(rec.month || rec.plan_month || '').trim();
                if (code && month) {
                    const key = `${code}__${month}`;
                    /* 동일 키가 여러 개인 경우 배열로 관리 */
                    if (!recordIndex.has(key)) {
                        recordIndex.set(key, []);
                    }
                    recordIndex.get(key).push(rec);
                }
            });
        } catch (e) {
            console.error('레코드 인덱스 구축 실패:', e);
        }

        for (const record of validRecords) {
            const { month, item_code, target_ending_inventory } = record.payload;
            const normalizedCode = getNormalizedItemCode(item_code);
            const key = `${normalizedCode}__${month}`;
            const matchedRecords = recordIndex.get(key);

            if (!matchedRecords || matchedRecords.length === 0) {
                notFoundCount++;
                failDetails.push(`${item_code} (${month}): 해당 자재코드/계획월의 레코드를 찾을 수 없음`);
                continue;
            }

            /* 매칭된 모든 레코드에 적정재고만 업데이트 (기존 필드 유지) */
            for (const matched of matchedRecords) {
                try {
                    /* SnopRecordDto @NotBlank 필수 필드 포함 + 적정재고만 갱신 */
                    const updatePayload = {
                        item_code: matched.item_code,
                        plan_month: matched.plan_month || matched.month || month,
                        item_name: matched.item_name || '',
                        category: matched.category || '',
                        production_line: matched.production_line || '',
                        plant_code: matched.plant_code || '',
                        vendor_name: matched.vendor_name || '',
                        moq: matched.moq ?? null,
                        sales_plan: matched.sales_plan ?? null,
                        sales_actual: matched.sales_actual ?? null,
                        production_plan: matched.production_plan ?? null,
                        production_actual: matched.production_actual ?? null,
                        production_remaining: matched.production_remaining ?? null,
                        beginning_inventory: matched.beginning_inventory ?? null,
                        available_inventory: matched.available_inventory ?? null,
                        inventory_unit: matched.inventory_unit || '',
                        target_ending_inventory: target_ending_inventory,
                        optimal_inventory: matched.optimal_inventory ?? null,
                        capacity_limit: matched.capacity_limit ?? null,
                        manual_input_quantity: matched.manual_input_quantity ?? null,
                        notes: matched.notes || '',
                        priority: matched.priority ?? null,
                    };
                    await fetch(`/sales-api/snop-records/${matched.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatePayload),
                    }).then(res => { if (!res.ok) throw new Error('적정재고 업데이트 실패'); });
                    successCount++;
                } catch (error) {
                    failCount++;
                    failDetails.push(`${item_code} (${month}) ID=${matched.id}: ${error.message}`);
                }
            }
        }

        /* 결과 메시지 */
        let resultMessage = `적정재고 업로드 완료: 성공 ${successCount}건`;
        if (notFoundCount > 0) resultMessage += `, 미매칭 ${notFoundCount}건`;
        if (failCount > 0) resultMessage += `, 실패 ${failCount}건`;

        if (failDetails.length > 0) {
            resultMessage += '\n\n상세:\n' + failDetails.slice(0, 10).join('\n');
            if (failDetails.length > 10) resultMessage += `\n... 외 ${failDetails.length - 10}건`;
        }

        const resultType = failCount > 0 ? 'warning' : (notFoundCount > 0 ? 'warning' : 'success');
        setTargetInventoryStatus(resultMessage, resultType);

        /* 데이터 새로고침 */
        if (successCount > 0) {
            await loadData();
        }
    } catch (error) {
        console.error('적정재고 업로드 오류:', error);
        setTargetInventoryStatus(`업로드 중 오류가 발생했습니다: ${error.message}`, 'error');
    } finally {
        if (m.startButton) {
            m.startButton.removeAttribute('disabled');
            m.startButton.textContent = '업로드 시작';
        }
    }
}

// -------------------- 기타 기능 --------------------
async function persistRecentSalesAverageRecord(payload, recordId) {
    const endpoint = recordId ? `/sales-api/recent-sales-averages/${recordId}` : '/sales-api/recent-sales-averages';
    const method = recordId ? 'PUT' : 'POST';
    const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error(recordId ? '최근 3개월 판매실적 평균 수정 실패' : '최근 3개월 판매실적 평균 등록 실패');
    }
    return response.json();
}

async function handleRecentSalesUploadStart() {
    if (!dom.recentSalesUpload) return;
    const baseMonth = dom.recentSalesUpload.baseMonth ? dom.recentSalesUpload.baseMonth.value : '';
    if (!baseMonth) {
        setRecentSalesUploadStatus('업로드할 기준월을 선택하세요.', 'error');
        return;
    }
    if (!dom.recentSalesUpload.fileInput || !dom.recentSalesUpload.fileInput.files.length) {
        setRecentSalesUploadStatus('업로드할 파일을 선택하세요.', 'error');
        return;
    }

    if (dom.recentSalesUpload.uploadButton) {
        dom.recentSalesUpload.uploadButton.setAttribute('disabled', 'disabled');
        dom.recentSalesUpload.uploadButton.textContent = '업로드 중...';
    }
    setRecentSalesUploadStatus('파일을 분석하는 중입니다...');

    try {
        const file = dom.recentSalesUpload.fileInput.files[0];
        const rows = await parseBulkFile(file);
        if (!rows || rows.length === 0) {
            setRecentSalesUploadStatus('시트에서 데이터를 찾지 못했습니다. 템플릿 양식을 확인하세요.', 'error');
            return;
        }

        const mapped = rows.map((row, index) => mapRecentSalesUploadRow(row, index));
        const errors = mapped.filter((item) => item.errors.length > 0);
        const validRecords = mapped.filter((item) => item.errors.length === 0);

        if (validRecords.length === 0) {
            const errorMessages = errors
                .slice(0, 5)
                .map((error) => `Row ${error.rowNumber}: ${error.errors.join(', ')}`)
                .join('\n');
            setRecentSalesUploadStatus(`모든 행에 오류가 있습니다.\n${errorMessages}`, 'error');
            return;
        }

        if (errors.length > 0) {
            const errorMessages = errors
                .slice(0, 5)
                .map((error) => `Row ${error.rowNumber}: ${error.errors.join(', ')}`)
                .join('\n');
            setRecentSalesUploadStatus(`총 ${errors.length}건의 행에서 오류가 발생하여 제외됩니다.\n${errorMessages}`, 'warning');
        } else {
            setRecentSalesUploadStatus(`총 ${validRecords.length}건의 데이터를 업로드합니다.`);
        }

        const existingIndex = state.recentSalesIndex instanceof Map
            ? new Map(state.recentSalesIndex)
            : new Map();

        let successCount = 0;
        let failCount = 0;
        const failDetails = [];

        for (const record of validRecords) {
            const payload = {
                ...record.payload,
                base_month: baseMonth,
            };
            const key = getRecentSalesAverageKey(payload.item_code, baseMonth);
            const existing = key ? existingIndex.get(key) : null;
            const existingId = existing ? existing.id : null;
            try {
                const saved = await persistRecentSalesAverageRecord(payload, existingId);
                if (key && saved && saved.id) {
                    existingIndex.set(key, saved);
                }
                successCount += 1;
            } catch (error) {
                failCount += 1;
                failDetails.push(`Row ${record.rowNumber}: ${error.message}`);
            }
        }

        state.recentSalesIndex = existingIndex;
        await loadData();

        if (failCount === 0) {
            setRecentSalesUploadStatus(`총 ${successCount}건의 최근 3개월 판매실적 평균이 업로드되었습니다.`, 'success');
        } else {
            const detail = failDetails.slice(0, 5).join('\n');
            setRecentSalesUploadStatus(`총 ${successCount}건 성공, ${failCount}건 실패했습니다.\n${detail}`, 'error');
        }
    } catch (error) {
        console.error(error);
        setRecentSalesUploadStatus('업로드 처리 중 오류가 발생했습니다. 파일 형식을 확인하세요.', 'error');
    } finally {
        if (dom.recentSalesUpload.uploadButton) {
            dom.recentSalesUpload.uploadButton.removeAttribute('disabled');
            dom.recentSalesUpload.uploadButton.textContent = '업로드 실행';
        }
    }
}

function handleRecentSalesTemplateDownload() {
    try {
        const header = ['item_code', 'm3', 'm2', 'm1'];
        const sampleRows = [
            ['BAT-100', 1200, 980, 1100],
            ['CNT-210', 720, 680, 760],
            ['MOD-330', 540, 500, 610],
        ];
        const worksheet = XLSX.utils.aoa_to_sheet([header, ...sampleRows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'RecentSales');
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `recent_sales_3m_template_${Date.now()}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setRecentSalesUploadStatus('최근 3개월 판매실적 템플릿을 다운로드했습니다.', 'success');
    } catch (error) {
        console.error(error);
        setRecentSalesUploadStatus('템플릿 생성 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.', 'error');
    }
}

/* ══════════════════════════════════════
   업로드된 최근 3개월 판매실적 현황 뷰
   ══════════════════════════════════════ */
const recentSalesViewDom = {
    filterCategory: document.querySelector('#recent-sales-view-filter-category'),
    filterItem: document.querySelector('#recent-sales-view-filter-item'),
    filterMonth: document.querySelector('#recent-sales-view-filter-month'),
    table: document.querySelector('#recent-sales-view-table'),
    tbody: document.querySelector('#recent-sales-view-table tbody'),
    empty: document.querySelector('#recent-sales-view-empty'),
};

function buildRecentSalesViewData() {
    const records = state.recentSalesRecords || [];
    const masters = state.baseMaterialMasters || [];
    const snopRecords = state.rawData || [];

    /* item_code → category, item_name 매핑 */
    const itemInfoMap = new Map();
    masters.forEach((m) => {
        const code = (m.item_code || '').trim().toUpperCase();
        if (code && !itemInfoMap.has(code)) {
            itemInfoMap.set(code, {
                category: m.hierarchy_name || '',
                item_name: m.item_name || '',
            });
        }
    });
    snopRecords.forEach((r) => {
        const code = sanitizeText(r.item_code).trim().toUpperCase();
        if (code && !itemInfoMap.has(code)) {
            itemInfoMap.set(code, {
                category: r.category || '',
                item_name: r.item_name || '',
            });
        }
    });

    return records.map((r) => {
        const code = (r.item_code || '').trim().toUpperCase();
        const info = itemInfoMap.get(code) || {};
        return {
            category: info.category || '미지정',
            item_code: r.item_code || '',
            item_name: info.item_name || '',
            base_month: r.base_month || '',
            m3: r.m3 ?? 0,
            m2: r.m2 ?? 0,
            m1: r.m1 ?? 0,
            total: r.total ?? 0,
            average: r.average ?? 0,
        };
    }).filter((d) => !isExcludedCategory(d.category));
}

function populateRecentSalesViewFilters(viewData) {
    if (!recentSalesViewDom.filterCategory) return;

    const categorySet = new Set();
    const itemSet = new Set();
    const monthSet = new Set();

    viewData.forEach((d) => {
        if (d.category) categorySet.add(d.category);
        if (d.item_code) itemSet.add(d.item_code);
        if (d.base_month) monthSet.add(d.base_month);
    });

    const prevCategory = recentSalesViewDom.filterCategory.value;
    const prevItem = recentSalesViewDom.filterItem.value;
    const prevMonth = recentSalesViewDom.filterMonth.value;

    const fillSelect = (sel, options, prev) => {
        const sorted = Array.from(options).sort((a, b) => a.localeCompare(b));
        sel.innerHTML = '<option value="all">전체</option>';
        sorted.forEach((v) => {
            const opt = document.createElement('option');
            opt.value = v;
            opt.textContent = v;
            sel.appendChild(opt);
        });
        if (prev && sorted.includes(prev)) sel.value = prev;
    };

    fillSelect(recentSalesViewDom.filterCategory, categorySet, prevCategory);
    fillSelect(recentSalesViewDom.filterItem, itemSet, prevItem);
    fillSelect(recentSalesViewDom.filterMonth, monthSet, prevMonth);
}

function renderRecentSalesViewTable() {
    if (!recentSalesViewDom.tbody) return;

    const viewData = buildRecentSalesViewData();
    populateRecentSalesViewFilters(viewData);

    const catFilter = recentSalesViewDom.filterCategory ? recentSalesViewDom.filterCategory.value : 'all';
    const itemFilter = recentSalesViewDom.filterItem ? recentSalesViewDom.filterItem.value : 'all';
    const monthFilter = recentSalesViewDom.filterMonth ? recentSalesViewDom.filterMonth.value : 'all';

    const filtered = viewData.filter((d) => {
        if (catFilter !== 'all' && d.category !== catFilter) return false;
        if (itemFilter !== 'all' && d.item_code !== itemFilter) return false;
        if (monthFilter !== 'all' && d.base_month !== monthFilter) return false;
        return true;
    });

    /* 정렬: 카테고리 → 자재코드 → 기준월 */
    filtered.sort((a, b) => {
        const c = a.category.localeCompare(b.category);
        if (c !== 0) return c;
        const i = a.item_code.localeCompare(b.item_code);
        if (i !== 0) return i;
        return a.base_month.localeCompare(b.base_month);
    });

    recentSalesViewDom.tbody.innerHTML = '';

    if (filtered.length === 0) {
        if (recentSalesViewDom.empty) recentSalesViewDom.empty.classList.remove('hidden');
        if (recentSalesViewDom.table) recentSalesViewDom.table.style.display = 'none';
        return;
    }

    if (recentSalesViewDom.empty) recentSalesViewDom.empty.classList.add('hidden');
    if (recentSalesViewDom.table) recentSalesViewDom.table.style.display = '';

    const fmt = (v) => Number.isFinite(v) ? v.toLocaleString('ko-KR') : String(v ?? 0);

    const fragment = document.createDocumentFragment();
    filtered.forEach((d) => {
        const tr = document.createElement('tr');
        const fields = [
            { value: d.category, cls: '' },
            { value: d.item_code, cls: '' },
            { value: d.item_name, cls: '' },
            { value: d.base_month, cls: '' },
            { value: fmt(d.m3), cls: 'number' },
            { value: fmt(d.m2), cls: 'number' },
            { value: fmt(d.m1), cls: 'number' },
            { value: fmt(d.total), cls: 'number' },
            { value: fmt(d.average), cls: 'number' },
        ];
        fields.forEach((f) => {
            const td = document.createElement('td');
            td.textContent = f.value || '-';
            if (f.cls) td.className = f.cls;
            tr.appendChild(td);
        });
        fragment.appendChild(tr);
    });
    recentSalesViewDom.tbody.appendChild(fragment);
}

/* 필터 이벤트 바인딩 */
if (recentSalesViewDom.filterCategory) {
    recentSalesViewDom.filterCategory.addEventListener('change', renderRecentSalesViewTable);
}
if (recentSalesViewDom.filterItem) {
    recentSalesViewDom.filterItem.addEventListener('change', renderRecentSalesViewTable);
}
if (recentSalesViewDom.filterMonth) {
    recentSalesViewDom.filterMonth.addEventListener('change', renderRecentSalesViewTable);
}

function exportProductionTableXlsx() {
    if (typeof XLSX === 'undefined' || !XLSX || !XLSX.utils) {
        alert('엑셀 내보내기 라이브러리가 로드되지 않았습니다. 잠시 후 다시 시도하세요.');
        return;
    }

    const tableRecords = Array.isArray(state.filteredData) ? state.filteredData : [];
    if (tableRecords.length === 0) {
        alert('생산계획 현황 표에서 내보낼 데이터가 없습니다. 필터 조건을 확인하세요.');
        return;
    }

    const headers = [
        '계획 월',
        '우선순위',
        '카테고리',
        '자재 코드',
        '자재 명칭',
        '생산 라인',
        '협력업체명',
        '현재고(EA)',
        '가용재고(EA)',
        '재고일수(현재고기준)',
        '소진일자(현재고기준)',
        '판매 계획(EA)',
        '판매 실적(EA)',
        '납품율(%)',
        '최근 3개월 판매실적 평균(EA)',
        '최근 3개월 판매실적 편차(EA)',
        '잔여 판매(EA)',
        '제안 생산계획(EA)',
        '적정재고 대비 필요량(EA)',
        '보정 생산계획(EA)',
        '차량대수',
        '수작업 투입수량(BOX)',
        'MOQ(EA)',
        '라인 총생산(EA)',
        '생산실적(EA)',
        '잔여생산(EA)',
        '예상 월말 재고(EA)',
        '재고일수(예상월말재고기준)',
        '소진일자(예상월말재고기준)',
        'SKU별 적정재고(EA)',
        '재고 상태',
        '라인 CAPA(EA)',
        'CAPA 대비',
        'CAPA 상태',
        '비고',
    ];

    /* 엑셀 내보내기 시 카테고리별 → 우선순위별 정렬 */
    const sortedRecords = [...tableRecords].sort((a, b) => {
        const catA = sanitizeText(a.category).trim();
        const catB = sanitizeText(b.category).trim();
        if (catA !== catB) return catA.localeCompare(catB, 'ko-KR');
        const priA = Number.isFinite(a.priority) ? a.priority : 999999;
        const priB = Number.isFinite(b.priority) ? b.priority : 999999;
        if (priA !== priB) return priA - priB;
        return sanitizeText(a.item_code).localeCompare(sanitizeText(b.item_code));
    });

    const rows = sortedRecords.map((record) => {
        const totalProduction = Number.isFinite(record.lineTotalProduction)
            ? record.lineTotalProduction
            : (Number.isFinite(record.production_plan) ? record.production_plan : null);
        const capacityLimit = Number.isFinite(record.lineCapacityLimit)
            ? record.lineCapacityLimit
            : (Number.isFinite(record.capacity_limit) ? record.capacity_limit : null);
        const ratio = Number.isFinite(record.lineCapacityRatio)
            ? `${(record.lineCapacityRatio * 100).toFixed(1)}%`
            : '';

        return {
            '계획 월': sanitizeText(record.month),
            '우선순위': Number.isFinite(record.priority) ? record.priority : null,
            '카테고리': sanitizeText(record.category),
            '자재 코드': sanitizeText(record.item_code),
            '자재 명칭': sanitizeText(record.item_name),
            '생산 라인': sanitizeText(record.production_line),
            '협력업체명': sanitizeText(record.vendor_name),
            '현재고(EA)': Number.isFinite(record.available_inventory) ? record.available_inventory : null,
            '가용재고(EA)': Number.isFinite(record.beginning_inventory) ? record.beginning_inventory : null,
            '재고일수(현재고기준)': (Number.isFinite(record.available_inventory) && Number.isFinite(record.salesActualAvg3m) && record.salesActualAvg3m > 0)
                ? Number(((record.available_inventory / record.salesActualAvg3m) * 30.42).toFixed(1))
                : null,
            '소진일자(현재고기준)': (() => {
                if (Number.isFinite(record.available_inventory) && Number.isFinite(record.salesActualAvg3m) && record.salesActualAvg3m > 0) {
                    const d = (record.available_inventory / record.salesActualAvg3m) * 30.42;
                    const dt = new Date(Date.now() + d * 86400000);
                    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
                }
                return null;
            })(),
            '판매 계획(EA)': Number.isFinite(record.sales_plan) ? record.sales_plan : null,
            '판매 실적(EA)': Number.isFinite(record.sales_actual) ? record.sales_actual : null,
            '납품율(%)': Number.isFinite(record.delivery_rate) ? `${(record.delivery_rate * 100).toFixed(1)}%` : '',
            '최근 3개월 판매실적 평균(EA)': Number.isFinite(record.salesActualAvg3m) ? Math.round(record.salesActualAvg3m) : null,
            '최근 3개월 판매실적 편차(EA)': Number.isFinite(record.salesActualStdDev3m) ? Math.round(record.salesActualStdDev3m) : null,
            '잔여 판매(EA)': Number.isFinite(record.sales_remaining) ? record.sales_remaining : null,
            '제안 생산계획(EA)': Number.isFinite(record.suggested_production) ? record.suggested_production : null,
            '적정재고 대비 필요량(EA)': Number.isFinite(record.required_quantity) ? record.required_quantity : null,
            '보정 생산계획(EA)': Number.isFinite(record.adjusted_production_plan) ? record.adjusted_production_plan : null,
            '차량대수': (() => {
                const adjBox = Number.isFinite(record.adjusted_production_plan) ? record.adjusted_production_plan : null;
                let moqBoxVal = (Number.isFinite(record.moq) && record.moq > 0) ? record.moq : null;
                if (moqBoxVal === null) {
                    const mst = (state.baseMaterialMasters || []).find(m => m.item_code === record.item_code);
                    if (mst && Number.isFinite(mst.moq) && mst.moq > 0) moqBoxVal = mst.moq;
                }
                if (adjBox !== null && moqBoxVal !== null && moqBoxVal > 0) {
                    return Number((adjBox / moqBoxVal).toFixed(1));
                }
                return null;
            })(),
            '수작업 투입수량(BOX)': (Number.isFinite(record.manual_input_quantity) && record.manual_input_quantity > 0) ? record.manual_input_quantity : null,
            'MOQ(BOX)': Number.isFinite(record.moq) ? record.moq : null,
            'MOQ(EA)': (() => { const r = getConversionRates(record.item_code); const u = convertFromBox(record.moq, r); return Number.isFinite(u.ea) ? u.ea : null; })(),
            'MOQ(BAG)': (() => { const r = getConversionRates(record.item_code); const u = convertFromBox(record.moq, r); return Number.isFinite(u.bag) ? u.bag : null; })(),
            '라인 총생산(EA)': Number.isFinite(totalProduction) ? totalProduction : null,
            '생산실적(EA)': Number.isFinite(record.production_actual) ? record.production_actual : null,
            '잔여생산(EA)': Number.isFinite(record.production_remaining) ? record.production_remaining : null,
            '예상 월말 재고(EA)': Number.isFinite(record.ending_inventory) ? record.ending_inventory : null,
            '재고일수(예상월말재고기준)': (Number.isFinite(record.ending_inventory) && Number.isFinite(record.salesActualAvg3m) && record.salesActualAvg3m > 0)
                ? Number(((record.ending_inventory / record.salesActualAvg3m) * 30.42).toFixed(1))
                : null,
            '소진일자(예상월말재고기준)': (() => {
                if (Number.isFinite(record.ending_inventory) && Number.isFinite(record.salesActualAvg3m) && record.salesActualAvg3m > 0) {
                    const d = (record.ending_inventory / record.salesActualAvg3m) * 30.42;
                    const dt = new Date(Date.now() + d * 86400000);
                    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
                }
                return null;
            })(),
            'SKU별 적정재고(EA)': Number.isFinite(record.target_ending_inventory) ? record.target_ending_inventory : null,
            '재고 상태': record.inventoryStatus ? sanitizeText(record.inventoryStatus.label) : '',
            '라인 CAPA(EA)': Number.isFinite(capacityLimit) ? capacityLimit : null,
            'CAPA 대비': ratio,
            'CAPA 상태': record.lineCapacityStatus ? sanitizeText(record.lineCapacityStatus.label) : '',
            '비고': sanitizeText(record.notes),
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
    const columnWidths = headers.map((header) => ({ wch: Math.max(Math.ceil(header.length * 1.6), 14) }));
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '생산계획 현황');

    const timestamp = new Date();
    const pad = (value) => value.toString().padStart(2, '0');
    const fileStamp = `${timestamp.getFullYear()}${pad(timestamp.getMonth() + 1)}${pad(timestamp.getDate())}_${pad(timestamp.getHours())}${pad(timestamp.getMinutes())}`;
    const fileName = `snop_production_table_${fileStamp}.xlsx`;

    XLSX.writeFile(workbook, fileName);
}

function exportCsv() {
    if (state.filteredData.length === 0) {
        alert('내보낼 데이터가 없습니다. 먼저 생산계획을 등록하세요.');
        return;
    }

    const headers = [
        '계획월',
        '우선순위',
        '카테고리',
        '자재코드',
        '자재명',
        '생산라인',
        '현재고(EA)',
        '판매계획(EA)',
        '판매실적(EA)',
        '잔여판매(EA)',
        '생산계획(EA)',
        '라인총생산(EA)',
        '생산실적(EA)',
        '잔여생산(EA)',
        '예상월말재고(EA)',
        '목표월말재고(EA)',
        '재고상태',
        '라인CAPA(EA)',
        '라인CAPA대비(%)',
        'CAPA상태',
        '비고',
    ];

    /* CSV 내보내기 시 카테고리별 → 우선순위별 정렬 */
    const sortedCsvData = [...state.filteredData].sort((a, b) => {
        const catA = sanitizeText(a.category).trim();
        const catB = sanitizeText(b.category).trim();
        if (catA !== catB) return catA.localeCompare(catB, 'ko-KR');
        const priA = Number.isFinite(a.priority) ? a.priority : 999999;
        const priB = Number.isFinite(b.priority) ? b.priority : 999999;
        if (priA !== priB) return priA - priB;
        return sanitizeText(a.item_code).localeCompare(sanitizeText(b.item_code));
    });

    const rows = sortedCsvData.map((record) => {
        const ratioPercent = Number.isFinite(record.lineCapacityRatio)
            ? (record.lineCapacityRatio * 100).toFixed(1)
            : '';
        return [
            record.month,
            Number.isFinite(record.priority) ? record.priority : '',
            record.category,
            record.item_code,
            record.item_name,
            record.production_line,
            record.beginning_inventory,
            record.sales_plan,
            record.sales_actual,
            record.sales_remaining,
            record.production_plan,
            record.lineTotalProduction,
            record.production_actual,
            record.production_remaining,
            record.ending_inventory,
            record.target_ending_inventory,
            record.inventoryStatus ? record.inventoryStatus.label : '',
            record.lineCapacityLimit ?? '',
            ratioPercent,
            record.lineCapacityStatus ? record.lineCapacityStatus.label : '',
            record.notes,
        ]
            .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
            .join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snop_plan_export_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// -------------------- OEM 협력업체/MOQ 일괄 업로드 --------------------
function setOemUploadStatus(message, type = '') {
    const el = document.getElementById('oem-vendor-moq-status');
    if (!el) return;
    el.textContent = message;
    el.className = 'oem-upload-status';
    if (type) el.classList.add(type);
}

function handleOemVendorMoqTemplateDownload() {
    const headers = ['자재코드', '자재명칭', '카테고리', '생산라인', '협력업체명', 'MOQ(BOX)'];

    /* 등록된 기본 자재마스터에서 OEM 상품만 추출 */
    const oemRows = (state.baseMaterialMasters || [])
        .filter((m) => {
            const unit = sanitizeText(m.production_unit || m.productionUnit || '').toUpperCase();
            return unit.includes('OEM');
        })
        .map((m) => [
            sanitizeText(m.item_code || m.itemCode || '').trim(),
            sanitizeText(m.item_name || m.itemName || '').trim(),
            sanitizeText(m.hierarchy_name || m.hierarchyName || '').trim(),
            sanitizeText(m.production_unit || m.productionUnit || '').trim(),
            sanitizeText(m.vendor_name || m.vendorName || '').trim(),
            m.moq != null ? m.moq : '',
        ]);

    if (oemRows.length === 0) {
        alert('등록된 OEM 상품 자재가 없습니다. 먼저 기본 자재마스터에 OEM 상품을 등록하세요.');
        return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...oemRows]);
    ws['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws, 'OEM 협력업체_MOQ');
    XLSX.writeFile(wb, 'OEM_협력업체_MOQ_템플릿.xlsx');
}

function mapOemVendorMoqRow(row, index) {
    const normalizedRow = {};
    Object.entries(row || {}).forEach(([rawKey, value]) => {
        const normalizedKey = normalizeBulkKey(rawKey);
        const mappedKey = OEM_VENDOR_MOQ_COLUMN_MAP[normalizedKey];
        if (mappedKey) normalizedRow[mappedKey] = value;
    });

    const errors = [];
    const itemCode = sanitizeText(normalizedRow.item_code).trim();
    if (!itemCode) errors.push('item_code(자재코드) 누락');

    const vendorName = sanitizeText(normalizedRow.vendor_name || '').trim();
    const moqRaw = sanitizeText(normalizedRow.moq || '').trim();
    let moq = null;
    if (moqRaw) {
        const parsed = parseInt(moqRaw.replace(/[^0-9]/g, ''), 10);
        if (Number.isFinite(parsed) && parsed >= 0) {
            moq = parsed;
        } else {
            errors.push('MOQ 값 오류');
        }
    }

    if (!vendorName && moq === null) {
        errors.push('협력업체명 또는 MOQ 중 하나 이상 입력 필요');
    }

    return {
        payload: { item_code: itemCode, vendor_name: vendorName || undefined, moq: moq },
        errors,
        rowIndex: index + 2,
    };
}

async function handleOemVendorMoqUploadStart() {
    const fileInput = document.getElementById('oem-vendor-moq-file');
    const startBtn = document.getElementById('btn-oem-vendor-moq-start');
    if (!fileInput || !fileInput.files.length) {
        setOemUploadStatus('파일을 선택하세요.', 'error');
        return;
    }

    const file = fileInput.files[0];
    if (startBtn) startBtn.disabled = true;
    setOemUploadStatus('업로드 중...', '');

    try {
        const rows = await parseBulkFile(file);
        if (!rows || rows.length === 0) {
            setOemUploadStatus('엑셀에서 데이터를 찾을 수 없습니다. 헤더와 데이터를 확인하세요.', 'error');
            return;
        }

        /* OEM 자재만 필터 */
        const oemItemCodes = new Set();
        (state.baseMaterialMasters || []).forEach((m) => {
            const prodUnit = sanitizeText(m.production_unit || m.productionUnit || '').toUpperCase();
            if (prodUnit.includes('OEM')) {
                oemItemCodes.add(sanitizeText(m.item_code || m.itemCode || '').trim());
            }
        });

        const validPayloads = [];
        const allErrors = [];

        rows.forEach((row, idx) => {
            const { payload, errors, rowIndex } = mapOemVendorMoqRow(row, idx);
            if (errors.length > 0) {
                allErrors.push(`행 ${rowIndex}: ${errors.join(', ')}`);
                return;
            }
            if (!oemItemCodes.has(payload.item_code)) {
                allErrors.push(`행 ${rowIndex}: 자재코드 '${payload.item_code}'는 OEM 상품이 아니거나 등록되지 않은 자재입니다.`);
                return;
            }
            validPayloads.push(payload);
        });

        if (validPayloads.length === 0) {
            const errorMsg = allErrors.length > 0
                ? `유효한 OEM 자재가 없습니다.\n${allErrors.slice(0, 5).join('\n')}`
                : '유효한 OEM 자재 데이터가 없습니다.';
            setOemUploadStatus(errorMsg, 'error');
            return;
        }

        /* 서버 일괄 업데이트 요청 */
        const response = await fetch('/sales-api/base-material-masters/oem-vendor-moq-bulk', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validPayloads),
        });

        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }

        const result = await response.json();
        const msgs = [`업로드 완료: ${result.updated}건 업데이트`];
        if (result.skipped > 0) msgs.push(`${result.skipped}건 건너뜀`);
        if (result.not_found > 0) msgs.push(`${result.not_found}건 자재 미발견`);
        if (allErrors.length > 0) msgs.push(`파일 오류 ${allErrors.length}건`);
        if (result.errors && result.errors.length > 0) {
            result.errors.forEach((e) => {
                msgs.push(`  - ${e.item_code}: ${e.reason}`);
            });
        }

        const statusType = result.updated > 0 ? 'success' : 'warning';
        setOemUploadStatus(msgs.join('\n'), statusType);

        /* 데이터 다시 불러오기 */
        await loadData();
        renderBaseMaterialMasterTable();

    } catch (error) {
        console.error('OEM 협력업체/MOQ 업로드 오류:', error);
        setOemUploadStatus(`업로드 중 오류 발생: ${error.message}`, 'error');
    } finally {
        if (startBtn) startBtn.disabled = false;
        if (fileInput) fileInput.value = '';
    }
}

// -------------------- 이벤트 바인딩 및 초기화 --------------------
function bindEvents() {
    if (dom.form) {
        dom.form.addEventListener('submit', handleFormSubmit);
    }
    if (dom.btnReset) {
        dom.btnReset.addEventListener('click', resetForm);
    }
    /* btnRefresh, btnExport 버튼 제거됨 */
    if (dom.btnExportXlsx) {
        dom.btnExportXlsx.addEventListener('click', exportProductionTableXlsx);
    }

    if (dom.planTableScroll && dom.planTableScroll.wrapper) {
        const { wrapper, leftButton, rightButton } = dom.planTableScroll;
        const handleWrapperScroll = () => {
            if (planTableScrollAnimationFrame) {
                window.cancelAnimationFrame(planTableScrollAnimationFrame);
            }
            planTableScrollAnimationFrame = window.requestAnimationFrame(() => {
                updatePlanTableScrollControls();
            });
        };
        wrapper.addEventListener('scroll', handleWrapperScroll);
        if (leftButton) {
            leftButton.addEventListener('click', handlePlanTableScrollButtons);
        }
        if (rightButton) {
            rightButton.addEventListener('click', handlePlanTableScrollButtons);
        }
        updatePlanTableScrollControls();
        window.addEventListener('resize', updatePlanTableScrollControls);
        window.addEventListener('resize', updatePlanHeaderStickyTop);
    }

    if (dom.optimalInventory && dom.optimalInventory.baselineForm) {
        dom.optimalInventory.baselineForm.addEventListener('submit', handleOptimalBaselineFormSubmit);
    }
    if (dom.optimalInventory && dom.optimalInventory.baselineReset) {
        dom.optimalInventory.baselineReset.addEventListener('click', handleOptimalBaselineReset);
    }
    if (dom.optimalInventory && dom.optimalInventory.baselineUpdate) {
        dom.optimalInventory.baselineUpdate.addEventListener('click', handleOptimalBaselineUpdateClick);
    }
    if (dom.optimalInventory && dom.optimalInventory.baselineDelete) {
        dom.optimalInventory.baselineDelete.addEventListener('click', handleOptimalBaselineDeleteClick);
    }
    if (dom.optimalInventory && dom.optimalInventory.baselineTableBody) {
        dom.optimalInventory.baselineTableBody.addEventListener('click', handleOptimalBaselineTableClick);
    }

    if (dom.bulkConfirmButton) {
        dom.bulkConfirmButton.addEventListener('click', handleBulkConfirmProductionChanges);
    }

    dom.planMonth?.addEventListener('change', handlePlanMonthChange);
    if (dom.productionLine) {
        dom.productionLine.addEventListener('change', updateCapacityLimitFromLinePlan);
    }
    if (dom.capacityLimit) {
        dom.capacityLimit.addEventListener('input', () => {
            const wasAutofilled = dom.capacityLimit.dataset.autofilled === 'downtime-plan';
            if (wasAutofilled) {
                clearCapacityAutofill({ message: '수동 입력으로 변경되었습니다.' });
            } else {
                clearCapacityAutofill({ preserveHint: true });
            }
        });
    }
    /* 생산계획 현황 테이블: 사용자가 필터를 조작하면 테이블 렌더링 활성화 */
    function activatePlanTable() { state.planTableReady = true; }

    /* 자재코드 검색 필터 초기화 (hidden input change 시에도 applyFilters 호출) */
    dom.filters.item.addEventListener('change', () => { activatePlanTable(); applyFilters(); });
    initItemSearchFilter();
    if (dom.itemName) {
        dom.itemName.addEventListener('input', autoFillCategoryFromItemName);
    }
    if (dom.category) {
        dom.category.addEventListener('input', (event) => {
            markCategoryManual(event);
            updateCapacityLimitFromLinePlan();
        });
    }
    /* 카테고리 멀티셀렉트 이벤트 바인딩 */
    if (dom.filters.categoryToggle) {
        dom.filters.categoryToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCategoryMenu();
        });
    }
    if (dom.filters.categoryAllCheckbox) {
        dom.filters.categoryAllCheckbox.addEventListener('change', (e) => {
            const optionsContainer = dom.filters.categoryOptions;
            if (!optionsContainer) return;
            const checkboxes = optionsContainer.querySelectorAll('input[type="checkbox"]');
            if (e.target.checked) {
                /* '전체' 선택 → 개별 전부 체크 */
                checkboxes.forEach(cb => { cb.checked = true; });
                e.target.indeterminate = false;
            } else {
                /* '전체' 해제 → 개별 전부 해제 */
                checkboxes.forEach(cb => { cb.checked = false; });
                e.target.indeterminate = false;
            }
            updateCategoryFilterDisplay();
            activatePlanTable();
            debouncedApplyFilters();
        });
    }
    /* 외부 클릭 시 카테고리 드롭다운 닫기 */
    document.addEventListener('click', (e) => {
        const dropdown = dom.filters.categoryDropdown;
        if (dropdown && !dropdown.contains(e.target)) {
            toggleCategoryMenu(true);
        }
    });
    dom.filters.month.addEventListener('change', () => { activatePlanTable(); handleFilterMonthChange(); });
    dom.filters.line.addEventListener('change', () => { activatePlanTable(); applyFilters(); });
    if (dom.filters.inventoryStatus) {
        dom.filters.inventoryStatus.addEventListener('change', () => { activatePlanTable(); applyFilters(); });
    }
    if (dom.filters.capaStatus) {
        dom.filters.capaStatus.addEventListener('change', () => { activatePlanTable(); applyFilters(); });
    }
    if (dom.dashboard && dom.dashboard.baseMonth) {
        dom.dashboard.baseMonth.addEventListener('change', (event) => {
            const selected = event.target.value;
            dom.dashboard.baseMonth.dataset.selectedMonth = selected;
            dom.dashboard.baseMonth.dataset.manualSelection = 'true';
            renderInventoryForecastTable(selected);
        });
    }
    if (dom.dashboard && dom.dashboard.accuracyMode) {
        const modeSelect = dom.dashboard.accuracyMode;
        const initialValue = sanitizeText(modeSelect.value).trim();
        if (initialValue === 'rolling' || initialValue === 'cumulative') {
            state.dashboardAccuracyMode = initialValue;
        } else {
            modeSelect.value = getDashboardAccuracyMode();
        }
        modeSelect.addEventListener('change', (event) => {
            const nextValue = sanitizeText(event.target.value).trim();
            state.dashboardAccuracyMode = nextValue === 'rolling' ? 'rolling' : 'cumulative';
            const baseMonthSelect = dom.dashboard.baseMonth;
            const selectedMonth = baseMonthSelect
                ? sanitizeText(baseMonthSelect.dataset.selectedMonth || baseMonthSelect.value).trim()
                : '';
            renderInventoryForecastTable(selectedMonth || null);
        });
    }
    if (dom.dashboard && dom.dashboard.forecastTable) {
        dom.dashboard.forecastTable.addEventListener('click', handleForecastCategoryToggle);
    }
    if (dom.filters.apply) {
        dom.filters.apply.addEventListener('click', () => { activatePlanTable(); applyFilters(); });
    }

    /* ── 제품 유형 탭 (전체 / OEM) ── */
    document.querySelectorAll('.product-type-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            const type = tab.dataset.productType || 'all';
            if (state.activeProductType === type) return;
            state.activeProductType = type;
            document.querySelectorAll('.product-type-tab').forEach((t) => {
                const isActive = t.dataset.productType === type;
                t.classList.toggle('active', isActive);
                t.setAttribute('aria-selected', String(isActive));
            });
            /* OEM 모드 클래스 토글 — CSS로 컬럼 숨김 처리 */
            const isOem = type === 'oem';
            const planTable = document.getElementById('plan-table');
            if (planTable) {
                planTable.classList.toggle('oem-mode', isOem);
            }
            /* OEM 탭 전환 시 제안 생산계획 → 입고계획 헤더 변경 */
            const productionPlanTh = document.querySelector('#plan-table th.col-production-plan');
            if (productionPlanTh) {
                productionPlanTh.textContent = type === 'oem' ? '입고계획' : '제안 생산계획';
            }
            /* OEM 탭 전환 시 협력업체명 컬럼 표시/숨김 */
            document.querySelectorAll('.col-vendor-name').forEach((el) => {
                el.style.display = isOem ? '' : 'none';
            });
            /* OEM 탭 전환 시 MOQ 컬럼 표시/숨김 */
            document.querySelectorAll('.col-moq').forEach((el) => {
                el.style.display = isOem ? '' : 'none';
            });
            /* OEM 탭 전환 시 분할(MOQ기준) 컬럼 표시/숨김 */
            document.querySelectorAll('.col-vehicle-count').forEach((el) => {
                el.style.display = isOem ? '' : 'none';
            });
            /* OEM 탭 전환 시 생산실적 → 입고실적, 잔여생산 → 잔여입고 헤더 변경 */
            const productionActualTh = document.querySelector('#plan-table th.col-production-actual');
            if (productionActualTh) {
                productionActualTh.textContent = isOem ? '입고실적' : '생산실적';
            }
            const productionRemainingTh = document.querySelector('#plan-table th.col-production-remaining');
            if (productionRemainingTh) {
                productionRemainingTh.textContent = isOem ? '잔여입고' : '잔여생산';
            }
            /* OEM 탭 전환 시 생산진행현황 → 입고진행현황 헤더 변경 */
            const productionProgressTh = document.querySelector('#plan-table th.col-production-progress');
            if (productionProgressTh) {
                productionProgressTh.textContent = isOem ? '입고진행현황(%)' : '생산진행현황(%)';
            }
            applyFilters();
        });
    });
    if (dom.analytics && dom.analytics.riskTableBody) {
        dom.analytics.riskTableBody.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            if (!row || !row.dataset || !row.dataset.itemCode) return;

            const monthValue = getAnalyticsMonthFilterValue();
            const useAllMonths = !monthValue || monthValue === 'all';
            if (!useAllMonths && row.dataset.detail !== 'true') {
                toggleAnalyticsRiskDetails(row);
            }

            const shouldScroll = false;
            focusAnalyticsItem(row.dataset.itemCode, { scroll: shouldScroll });
        });
        dom.analytics.riskTableBody.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            const row = event.target.closest('tr');
            if (!row || !row.dataset || !row.dataset.itemCode) return;
            event.preventDefault();

            const monthValue = getAnalyticsMonthFilterValue();
            const useAllMonths = !monthValue || monthValue === 'all';
            if (!useAllMonths && row.dataset.detail !== 'true') {
                toggleAnalyticsRiskDetails(row);
            }

            const shouldScroll = false;
            focusAnalyticsItem(row.dataset.itemCode, { scroll: shouldScroll });
        });
    }
    if (dom.analytics && dom.analytics.monthFilter) {
        dom.analytics.monthFilter.addEventListener('change', (event) => {
            event.target.dataset.manualSelection = 'true';
            if (state.analyticsExpandedItems instanceof Set) {
                state.analyticsExpandedItems.clear();
            }
            renderAnalyticsRiskTable();
            updateChart();
        });
    }
    /* 판매 합계 — 자재코드 검색 드롭다운 초기화 */
    initSalesSummaryItemFilter();

    if (dom.salesUpload.summaryMonthFilter) {
        dom.salesUpload.summaryMonthFilter.addEventListener('change', renderSalesSummaryTable);
    }
    if (dom.salesUpload.summaryCategoryFilter) {
        dom.salesUpload.summaryCategoryFilter.addEventListener('change', renderSalesSummaryTable);
    }
    dom.filters.clear.addEventListener('click', () => {
        dom.filters.item.value = 'all';
        if (dom.filters.itemInput) dom.filters.itemInput.value = '';
        resetCategoryFilter();
        dom.filters.month.value = 'all';
        dom.filters.line.value = 'all';
        if (dom.filters.inventoryStatus) {
            dom.filters.inventoryStatus.value = 'all';
        }
        if (dom.filters.capaStatus) {
            dom.filters.capaStatus.value = 'all';
        }
        if (dom.planMonth) dom.planMonth.value = '';
        if (dom.analytics && dom.analytics.monthFilter) {
            dom.analytics.monthFilter.dataset.manualSelection = 'false';
            dom.analytics.monthFilter.value = 'all';
        }
        if (dom.dashboard && dom.dashboard.baseMonth) {
            dom.dashboard.baseMonth.dataset.manualSelection = 'false';
        }
        state.planTableReady = false;
        applyFilters();
    });

    if (dom.optimalInventory) {
        if (dom.optimalInventory.yearSelect) {
            dom.optimalInventory.yearSelect.addEventListener('change', handleOptimalInventoryYearChange);
        }
        if (dom.optimalInventory.aggregationModeSelect) {
            dom.optimalInventory.aggregationModeSelect.addEventListener('change', handleOptimalAggregationModeChange);
        }
    }

    if (dom.lineDowntime) {
        const {
            form,
            btnReset,
            tableBody,
            filterMonth,
            filterLine,
            daily,
            dailyHours,
            operatingDays,
        } = dom.lineDowntime;

        if (form) {
            form.addEventListener('submit', handleLineCapaFormSubmit);
        }
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                resetLineCapaForm({ keepMonth: true, keepLine: true });
            });
        }
        if (daily) {
            daily.addEventListener('input', updateLineCapaComputedField);
        }
        if (dailyHours) {
            dailyHours.addEventListener('input', updateLineCapaComputedField);
        }
        if (operatingDays) {
            operatingDays.addEventListener('input', updateLineCapaComputedField);
        }
        if (filterMonth) {
            filterMonth.addEventListener('change', (event) => {
                setLineCapaFilter('month', event.target.value);
            });
        }
        if (filterLine) {
            filterLine.addEventListener('change', (event) => {
                setLineCapaFilter('line', event.target.value);
            });
        }
        if (tableBody) {
            tableBody.addEventListener('click', handleLineCapaTableClick);
        }
    }

    if (dom.lineItemMaster) {
        const {
            form,
            btnReset,
            tableBody,
            filterLine,
        } = dom.lineItemMaster;
        if (form) {
            form.addEventListener('submit', handleLineItemMasterFormSubmit);
        }
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                resetLineItemMasterForm();
            });
        }
        if (filterLine) {
            filterLine.addEventListener('change', (event) => {
                setLineItemMasterFilter('line', event.target.value);
            });
        }
        if (tableBody) {
            tableBody.addEventListener('click', handleLineItemMasterTableClick);
        }
    }

    if (dom.materialRenewal) {
        const {
            form,
            resetButton,
            tableBody,
            legacyCode,
            renewalCode,
            legacyName,
            renewalName,
        } = dom.materialRenewal;
        if (form) {
            form.addEventListener('submit', handleMaterialRenewalFormSubmit);
        }
        if (resetButton) {
            resetButton.addEventListener('click', handleMaterialRenewalReset);
        }
        if (tableBody) {
            tableBody.addEventListener('click', handleMaterialRenewalTableClick);
        }
        if (legacyCode) {
            legacyCode.addEventListener('change', handleMaterialCodeAutoFill);
        }
        if (renewalCode) {
            renewalCode.addEventListener('change', handleMaterialCodeAutoFill);
        }
        if (legacyName) {
            legacyName.addEventListener('input', () => {
                legacyName.dataset.manual = 'true';
            });
        }
        if (renewalName) {
            renewalName.addEventListener('input', () => {
                renewalName.dataset.manual = 'true';
            });
        }
    }

    /* ── 기본 자재마스터 이벤트 바인딩 ── */
    if (dom.baseMaterialMaster) {
        const {
            form: bmForm,
            btnReset: bmBtnReset,
            tableBody: bmTableBody,
            filterScm: bmFilterScm,
            filterCategory: bmFilterCategory,
            filterItemCode: bmFilterItemCode,
            filterProdUnit: bmFilterProdUnit,
            itemCode: bmItemCode,
            conv1: bmConv1,
            conv2: bmConv2,
            selectAll: bmSelectAll,
            btnRegisterPlan: bmBtnRegisterPlan,
        } = dom.baseMaterialMaster;
        if (bmForm) {
            bmForm.addEventListener('submit', handleBaseMaterialMasterFormSubmit);
        }
        if (bmBtnReset) {
            bmBtnReset.addEventListener('click', () => {
                resetBaseMaterialMasterForm();
            });
        }
        if (bmItemCode) {
            bmItemCode.addEventListener('change', handleBaseMaterialItemCodeAutoFill);
        }
        if (bmFilterScm) {
            bmFilterScm.addEventListener('change', (event) => {
                setBaseMaterialMasterFilter('scm', event.target.value);
            });
        }
        if (bmFilterCategory) {
            bmFilterCategory.addEventListener('change', (event) => {
                setBaseMaterialMasterFilter('category', event.target.value);
            });
        }
        if (bmFilterItemCode) {
            bmFilterItemCode.addEventListener('input', (event) => {
                setBaseMaterialMasterFilter('itemCode', event.target.value);
            });
        }
        if (bmFilterProdUnit) {
            bmFilterProdUnit.addEventListener('change', (event) => {
                setBaseMaterialMasterFilter('prodUnit', event.target.value);
            });
        }
        if (bmTableBody) {
            bmTableBody.addEventListener('click', handleBaseMaterialMasterTableClick);
        }
        if (bmConv1) {
            bmConv1.addEventListener('input', updateBaseMaterialEaPerBox);
        }
        if (bmConv2) {
            bmConv2.addEventListener('input', updateBaseMaterialEaPerBox);
        }
        if (bmSelectAll) {
            bmSelectAll.addEventListener('change', handleBaseMaterialSelectAll);
        }
        if (bmBtnRegisterPlan) {
            bmBtnRegisterPlan.addEventListener('click', handleRegisterProductionPlan);
        }
    }

    /* ── OEM 협력업체/MOQ 일괄 업로드 이벤트 바인딩 ── */
    {
        const oemUploadBtn = document.getElementById('btn-oem-vendor-moq-upload');
        const oemTemplateBtn = document.getElementById('btn-oem-vendor-moq-template');
        const oemFileInput = document.getElementById('oem-vendor-moq-file');
        const oemStartBtn = document.getElementById('btn-oem-vendor-moq-start');
        const oemCancelBtn = document.getElementById('btn-oem-vendor-moq-cancel');
        const oemArea = document.getElementById('oem-vendor-moq-upload-area');

        if (oemUploadBtn && oemArea) {
            oemUploadBtn.addEventListener('click', () => {
                oemArea.classList.toggle('hidden');
                setOemUploadStatus('', '');
            });
        }
        if (oemTemplateBtn) {
            oemTemplateBtn.addEventListener('click', handleOemVendorMoqTemplateDownload);
        }
        if (oemFileInput && oemStartBtn) {
            oemFileInput.addEventListener('change', () => {
                oemStartBtn.disabled = !oemFileInput.files.length;
                if (oemFileInput.files.length) {
                    setOemUploadStatus('파일을 선택했습니다. 업로드 실행을 눌러 진행하세요.', '');
                }
            });
        }
        if (oemStartBtn) {
            oemStartBtn.addEventListener('click', handleOemVendorMoqUploadStart);
        }
        if (oemCancelBtn && oemArea) {
            oemCancelBtn.addEventListener('click', () => {
                oemArea.classList.add('hidden');
                setOemUploadStatus('', '');
                if (oemFileInput) oemFileInput.value = '';
                if (oemStartBtn) oemStartBtn.disabled = true;
            });
        }
    }

    attachLineCapaUsageFilterListeners();
    updateLineCapaComputedField();

    if (dom.bulk.open) {
        dom.bulk.open.addEventListener('click', () => openBulkUploadModal(BULK_TARGETS.PRODUCTION));
    }
    if (dom.bulk.openLineCapa) {
        dom.bulk.openLineCapa.addEventListener('click', () => openBulkUploadModal(BULK_TARGETS.LINE_CAPA, { singleMode: true }));
    }
    if (dom.bulk.openLineMaster) {
        dom.bulk.openLineMaster.addEventListener('click', () => openBulkUploadModal(BULK_TARGETS.LINE_MASTER, { singleMode: true }));
    }
    if (dom.recentSalesUpload) {
        if (dom.recentSalesUpload.uploadButton) {
            dom.recentSalesUpload.uploadButton.addEventListener('click', handleRecentSalesUploadStart);
        }
        if (dom.recentSalesUpload.templateButton) {
            dom.recentSalesUpload.templateButton.addEventListener('click', handleRecentSalesTemplateDownload);
        }
        if (dom.recentSalesUpload.fileInput) {
            dom.recentSalesUpload.fileInput.addEventListener('change', () => {
                const monthLabel = dom.recentSalesUpload.baseMonth ? dom.recentSalesUpload.baseMonth.value : '';
                if (monthLabel) {
                    setRecentSalesUploadStatus(`${monthLabel} 기준 파일을 선택했습니다. 업로드 실행을 눌러 등록하세요.`);
                } else {
                    setRecentSalesUploadStatus('파일을 선택했습니다. 업로드 실행을 눌러 등록하세요.');
                }
            });
        }
        if (dom.recentSalesUpload.baseMonth) {
            dom.recentSalesUpload.baseMonth.addEventListener('change', () => {
                const monthLabel = dom.recentSalesUpload.baseMonth.value || '';
                if (!dom.recentSalesUpload.fileInput || !dom.recentSalesUpload.fileInput.files.length) {
                    setRecentSalesUploadStatus('업로드할 기준월과 파일을 선택하세요.');
                } else if (monthLabel) {
                    setRecentSalesUploadStatus(`${monthLabel} 기준 업로드를 진행합니다.`);
                }
            });
        }
    }
    if (dom.bulk.close) {
        dom.bulk.close.addEventListener('click', closeBulkUploadModal);
    }
    if (dom.bulk.backdrop) {
        dom.bulk.backdrop.addEventListener('click', closeBulkUploadModal);
    }
    if (dom.bulk.tabs && dom.bulk.tabs.length > 0) {
        dom.bulk.tabs.forEach((tab) => {
            if (!tab) return;
            tab.addEventListener('click', () => {
                const label = getBulkTargetLabel(tab.dataset.bulkTarget);
                setBulkTarget(tab.dataset.bulkTarget);
                if (!dom.bulk.fileInput || !dom.bulk.fileInput.files.length) {
                    setBulkStatus(`${label} 데이터를 업로드하려면 파일을 선택하세요.`);
                }
            });
            tab.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                const label = getBulkTargetLabel(tab.dataset.bulkTarget);
                setBulkTarget(tab.dataset.bulkTarget, { focus: false });
                if (!dom.bulk.fileInput || !dom.bulk.fileInput.files.length) {
                    setBulkStatus(`${label} 데이터를 업로드하려면 파일을 선택하세요.`);
                }
            });
        });
    }
    if (dom.bulk.startButton) {
        dom.bulk.startButton.addEventListener('click', handleBulkUploadStart);
    }
    if (dom.bulk.fileInput) {
        dom.bulk.fileInput.addEventListener('change', () => {
            const datasetLabel = getBulkTargetLabel();
            if (dom.bulk.fileInput.files && dom.bulk.fileInput.files.length > 0) {
                setBulkStatus(`${datasetLabel} 파일을 선택했습니다. 업로드를 시작하세요.`);
            } else {
                setBulkStatus(`${datasetLabel} 데이터를 업로드하려면 파일을 선택하세요.`);
            }
        });
    }
    if (dom.bulk.templateButtons && dom.bulk.templateButtons.length > 0) {
        dom.bulk.templateButtons.forEach((button) => {
            if (!button) return;
            button.addEventListener('click', handleBulkTemplateDownload);
        });
    }

    /* SKU별 적정재고 업로드 모달 이벤트 */
    if (dom.targetInventoryUpload) {
        const tiu = dom.targetInventoryUpload;
        if (tiu.openButton) {
            tiu.openButton.addEventListener('click', openTargetInventoryUploadModal);
        }
        if (tiu.closeButton) {
            tiu.closeButton.addEventListener('click', closeTargetInventoryUploadModal);
        }
        if (tiu.backdrop) {
            tiu.backdrop.addEventListener('click', closeTargetInventoryUploadModal);
        }
        if (tiu.templateButton) {
            tiu.templateButton.addEventListener('click', handleTargetInventoryTemplateDownload);
        }
        if (tiu.startButton) {
            tiu.startButton.addEventListener('click', handleTargetInventoryUploadStart);
        }
        if (tiu.fileInput) {
            tiu.fileInput.addEventListener('change', () => {
                if (tiu.fileInput.files && tiu.fileInput.files.length > 0) {
                    setTargetInventoryStatus('파일을 선택했습니다. 업로드를 시작하세요.');
                }
            });
        }
    }

    /* 자재마스터 동기화 버튼 */
    const btnSyncFromMaster = document.getElementById('btn-sync-from-master');
    if (btnSyncFromMaster) {
        btnSyncFromMaster.addEventListener('click', async () => {
            if (!confirm('자재마스터 기준으로 생산계획 데이터의 카테고리/자재명/생산라인을 동기화합니다.\n계속하시겠습니까?')) return;
            btnSyncFromMaster.disabled = true;
            btnSyncFromMaster.textContent = '동기화 중...';
            try {
                const res = await fetch('/sales-api/snop-records/sync-from-master', { method: 'POST' });
                const json = await res.json();
                if (res.ok && json.success !== false) {
                    const d = json.data || {};
                    alert(`동기화 완료!\n\n전체: ${d.total_count || 0}건\n동기화: ${d.synced_count || 0}건\n변경없음: ${d.skipped_count || 0}건\n마스터없음: ${d.no_master_count || 0}건`);
                    await loadAllData();
                } else {
                    alert('동기화 실패: ' + (json.message || '알 수 없는 오류'));
                }
            } catch (e) {
                alert('동기화 요청 실패: ' + e.message);
            } finally {
                btnSyncFromMaster.disabled = false;
                btnSyncFromMaster.textContent = '자재마스터 동기화';
            }
        });
    }

    /* 생산계획 현황 테이블 확대 보기 */
    (function initExpandTable() {
        const btnExpand = document.getElementById('btn-expand-table');
        const modal = document.getElementById('table-expand-modal');
        const btnClose = document.getElementById('btn-close-expand-modal');
        const modalBody = modal ? modal.querySelector('.table-expand-modal-body') : null;
        if (!btnExpand || !modal || !modalBody) return;

        // 원래 위치 기억용
        let originalParent = null;
        let originalNextSibling = null;

        function openExpandModal() {
            const tableWrapper = document.querySelector('#view-table .table-wrapper[data-scroll-wrapper]');
            if (!tableWrapper) return;
            // 원래 위치 저장
            originalParent = tableWrapper.parentNode;
            originalNextSibling = tableWrapper.nextSibling;
            // 모달로 이동
            modalBody.appendChild(tableWrapper);
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeExpandModal() {
            const tableWrapper = modalBody.querySelector('.table-wrapper[data-scroll-wrapper]');
            if (tableWrapper && originalParent) {
                // 원래 위치로 복원
                if (originalNextSibling) {
                    originalParent.insertBefore(tableWrapper, originalNextSibling);
                } else {
                    originalParent.appendChild(tableWrapper);
                }
            }
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            originalParent = null;
            originalNextSibling = null;
        }

        btnExpand.addEventListener('click', openExpandModal);
        btnClose.addEventListener('click', closeExpandModal);
        // ESC 키로 닫기
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeExpandModal();
        });
        // 배경 클릭으로 닫기 방지 (전체 화면이므로 불필요)
    })();

    if (dom.salesUpload) {
        if (dom.salesUpload.uploadButton) {
            dom.salesUpload.uploadButton.addEventListener('click', handleSalesUploadStart);
        }
        if (dom.salesUpload.fileInput) {
            dom.salesUpload.fileInput.addEventListener('change', () => {
                setSalesUploadStatus('파일을 선택했습니다. 업로드 실행을 눌러 등록하세요.');
            });
        }
        if (dom.salesUpload.templateButton) {
            dom.salesUpload.templateButton.addEventListener('click', handleSalesUploadTemplateDownload);
        }
        if (dom.salesUpload.form) {
            dom.salesUpload.form.addEventListener('submit', handleSalesUploadFormSubmit);
        }
        if (dom.salesUpload.formReset) {
            dom.salesUpload.formReset.addEventListener('click', handleSalesUploadFormReset);
        }
        if (dom.salesUpload.channelForm) {
            dom.salesUpload.channelForm.addEventListener('submit', handleSalesChannelFormSubmit);
        }
        if (dom.salesUpload.channelList) {
            dom.salesUpload.channelList.addEventListener('click', (event) => {
                const button = event.target.closest('button.danger');
                if (!button) return;
                const channelId = button.dataset.channelId;
                const channelKey = button.dataset.channelKey;
                handleSalesChannelDelete(channelId, channelKey);
            });
        }
    }

    if (dom.changeHistory) {
        if (dom.changeHistory.filterType) {
            dom.changeHistory.filterType.addEventListener('change', renderChangeHistoryTable);
        }
        if (dom.changeHistory.filterMonth) {
            dom.changeHistory.filterMonth.addEventListener('change', renderChangeHistoryTable);
        }
        if (dom.changeHistory.filterItem) {
            dom.changeHistory.filterItem.addEventListener('change', renderChangeHistoryTable);
        }
        if (dom.changeHistory.exportButton) {
            dom.changeHistory.exportButton.addEventListener('click', exportChangeHistoryCsv);
        }
        if (dom.changeHistory.uploadFilterFrom) {
            dom.changeHistory.uploadFilterFrom.addEventListener('change', renderUploadHistoryTable);
        }
        if (dom.changeHistory.uploadFilterTo) {
            dom.changeHistory.uploadFilterTo.addEventListener('change', renderUploadHistoryTable);
        }
        if (dom.changeHistory.uploadFilterItem) {
            dom.changeHistory.uploadFilterItem.addEventListener('change', renderUploadHistoryTable);
        }
        if (dom.changeHistory.uploadFilterReset) {
            dom.changeHistory.uploadFilterReset.addEventListener('click', () => {
                if (dom.changeHistory.uploadFilterFrom) {
                    dom.changeHistory.uploadFilterFrom.value = '';
                }
                if (dom.changeHistory.uploadFilterTo) {
                    dom.changeHistory.uploadFilterTo.value = '';
                }
                if (dom.changeHistory.uploadFilterItem) {
                    dom.changeHistory.uploadFilterItem.value = 'all';
                }
                renderUploadHistoryTable();
            });
        }
        if (dom.changeHistory.tabs && dom.changeHistory.tabs.length > 0) {
            dom.changeHistory.tabs.forEach((button) => {
                if (!button) return;
                button.addEventListener('click', () => {
                    setChangeHistoryTab(button.dataset.historyTarget);
                });
                button.addEventListener('keydown', handleChangeHistoryTabKeydown);
            });
        }
        setChangeHistoryTab(state.changeHistoryActiveTab, { suppressRender: true });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && dom.bulk.modal && !dom.bulk.modal.classList.contains('hidden')) {
            closeBulkUploadModal();
        }
    });

    if (dom.chartSelect) {
        dom.chartSelect.addEventListener('change', (event) => {
            const selectedCode = sanitizeText(event.target.value).trim();
            if (!(state.analyticsExpandedItems instanceof Set)) {
                state.analyticsExpandedItems = new Set();
            }
            if (selectedCode) {
                state.analyticsExpandedItems.add(selectedCode);
            } else {
                state.analyticsExpandedItems.clear();
            }
            updateChart();
        });
    }

    /* ── 리뉴얼 자재 연결 마스터 코드 검색 필터 ── */
    {
        const renewalFilterInput = document.getElementById('renewal-code-filter');
        const renewalFilterClear = document.getElementById('renewal-code-filter-clear');
        let renewalFilterTimer = null;
        if (renewalFilterInput) {
            renewalFilterInput.addEventListener('input', () => {
                clearTimeout(renewalFilterTimer);
                renewalFilterTimer = setTimeout(() => renderMaterialRenewalTable(), 250);
            });
            renewalFilterInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    clearTimeout(renewalFilterTimer);
                    renderMaterialRenewalTable();
                }
            });
        }
        if (renewalFilterClear) {
            renewalFilterClear.addEventListener('click', () => {
                if (renewalFilterInput) renewalFilterInput.value = '';
                renderMaterialRenewalTable();
            });
        }
    }
}

/* ═══════════════════════════════════════════════════════
   기준정보 관리 서브메뉴 탭 네비게이션
   ═══════════════════════════════════════════════════════ */

function setupPlannerSubTabs() {
    /* 사이드바 서브메뉴 + 기존 .planner-sub-tabs 둘 다 지원 */
    const sidebarSubContainer = document.getElementById('sidebar-planner-sub');
    const legacyContainer = document.querySelector('.planner-sub-tabs');
    const subContainer = sidebarSubContainer || legacyContainer;
    if (!subContainer) return;

    const tabClass = sidebarSubContainer ? '.sidebar-sub-item' : '.planner-sub-tab';
    const tabs = Array.from(subContainer.querySelectorAll(tabClass));
    const sections = Array.from(document.querySelectorAll('.planner-sub-section'));

    function activateSubTab(targetKey) {
        tabs.forEach(tab => {
            const isActive = tab.dataset.subTarget === targetKey;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        sections.forEach(section => {
            const isActive = section.dataset.plannerSub === targetKey;
            section.classList.toggle('active', isActive);
        });
    }

    subContainer.addEventListener('click', (e) => {
        const tab = e.target.closest(tabClass);
        if (!tab) return;
        e.preventDefault();
        activateSubTab(tab.dataset.subTarget);
    });

    const activeTab = tabs.find(t => t.classList.contains('active'));
    if (activeTab) {
        activateSubTab(activeTab.dataset.subTarget);
    } else if (tabs.length > 0) {
        activateSubTab(tabs[0].dataset.subTarget);
    }
}

/* ══════════════════════════════════════════════════════════
 *  사이드바 토글
 * ══════════════════════════════════════════════════════════ */
function setupSidebarToggle() {
    const sidebar = dom.sidebar;
    const toggle = dom.sidebarToggle;
    const overlay = dom.sidebarOverlay;
    if (!sidebar || !toggle) return;

    function expandSidebar() {
        sidebar.classList.add('expanded');
        document.body.classList.add('sidebar-expanded');
        if (overlay) overlay.classList.add('visible');
        toggle.setAttribute('aria-label', '메뉴 닫기');
    }

    function collapseSidebar() {
        sidebar.classList.remove('expanded');
        document.body.classList.remove('sidebar-expanded');
        if (overlay) overlay.classList.remove('visible');
        toggle.setAttribute('aria-label', '메뉴 열기');
    }

    function toggleSidebar() {
        if (sidebar.classList.contains('expanded')) {
            collapseSidebar();
        } else {
            expandSidebar();
        }
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
    });

    if (overlay) {
        overlay.addEventListener('click', collapseSidebar);
    }

    /* ESC로 닫기 */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('expanded')) {
            collapseSidebar();
        }
    });
}

async function initialize() {
    renderSystemDate();
    setupViewNavigation();
    setupPlannerSubTabs();
    bindEvents();
    await loadData();
    setActiveView(state.activeView, { scroll: false, focusButton: false });
    initDevSchedule();
    initPlantStorage();
    initInterfaceMaster();
    initUserMgmt();
}

/**
 * 생산계획 현황 테이블 왼쪽 상단에 시스템 날짜를 표시한다.
 * 형식: 📅 시스템 날짜: 2026년 02월 25일 (화) — 경과 25일 / 28일
 */
function renderSystemDate() {
    const el = document.getElementById('system-date-display');
    if (!el) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = dayNames[now.getDay()];
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();

    el.innerHTML =
        `\u{1F4C5} \uC2DC\uC2A4\uD15C \uB0A0\uC9DC: <span class="date-value">${year}\uB144 ${month}\uC6D4 ${day}\uC77C (${dayOfWeek})</span>` +
        ` &mdash; <span class="date-value">\uACBD\uACFC ${now.getDate()}\uC77C / ${daysInMonth}\uC77C</span>`;

    /* ── 납품율 헤더에 일자 비율 산식 표시 ──
       예: 4월 15일 → (15/30)×100=50% */
    const formulaEl = document.getElementById('delivery-rate-formula');
    if (formulaEl) {
        const pct = ((now.getDate() / daysInMonth) * 100).toFixed(0);
        formulaEl.textContent = `${pct}%`;
    }
}

/* ────────────────────────────────────────────────────────
 * 개발 일정 관리 (Dev Schedule) 모듈
 * ──────────────────────────────────────────────────────── */
const DEV_SCHEDULE_API = '/sales-api/dev-schedules';

const devScheduleState = {
    records: [],
    editingId: null,
    filters: {
        status: 'all',
        category: 'all',
        priority: 'all',
    },
};

const devDom = {
    form: null,
    id: null,
    date: null,
    time: null,
    title: null,
    description: null,
    category: null,
    status: null,
    priority: null,
    assignee: null,
    progress: null,
    notes: null,
    btnSave: null,
    btnReset: null,
    timeline: null,
    empty: null,
    filterStatus: null,
    filterCategory: null,
    filterPriority: null,
};

function initDevScheduleDom() {
    devDom.form = document.getElementById('dev-schedule-form');
    devDom.id = document.getElementById('dev-schedule-id');
    devDom.date = document.getElementById('dev-schedule-date');
    devDom.time = document.getElementById('dev-schedule-time');
    devDom.title = document.getElementById('dev-schedule-title');
    devDom.description = document.getElementById('dev-schedule-description');
    devDom.category = document.getElementById('dev-schedule-category');
    devDom.status = document.getElementById('dev-schedule-status');
    devDom.priority = document.getElementById('dev-schedule-priority');
    devDom.assignee = document.getElementById('dev-schedule-assignee');
    devDom.progress = document.getElementById('dev-schedule-progress');
    devDom.notes = document.getElementById('dev-schedule-notes');
    devDom.btnSave = document.getElementById('btn-dev-schedule-save');
    devDom.btnReset = document.getElementById('btn-dev-schedule-reset');
    devDom.timeline = document.getElementById('dev-schedule-timeline');
    devDom.empty = document.getElementById('dev-schedule-empty');
    devDom.filterStatus = document.getElementById('dev-schedule-filter-status');
    devDom.filterCategory = document.getElementById('dev-schedule-filter-category');
    devDom.filterPriority = document.getElementById('dev-schedule-filter-priority');
}

function getCategoryIconClass(category) {
    const cat = (category || '').trim();
    if (cat.includes('소프트웨어') || cat.includes('개발')) return 'cat-software';
    if (cat.includes('연동') || cat.includes('통합')) return 'cat-integration';
    if (cat.includes('인프라')) return 'cat-infra';
    if (cat.includes('테스트') || cat.includes('QA')) return 'cat-test';
    if (cat.includes('배포') || cat.includes('릴리즈')) return 'cat-deploy';
    if (cat.includes('미팅') || cat.includes('회의')) return 'cat-meeting';
    return 'cat-other';
}

function getCategoryIcon(category) {
    const cat = (category || '').trim();
    if (cat.includes('소프트웨어') || cat.includes('개발')) return '\uD83D\uDCBB';
    if (cat.includes('연동') || cat.includes('통합')) return '\uD83D\uDD17';
    if (cat.includes('인프라')) return '\uD83C\uDFD7\uFE0F';
    if (cat.includes('테스트') || cat.includes('QA')) return '\uD83E\uDDEA';
    if (cat.includes('배포') || cat.includes('릴리즈')) return '\uD83D\uDE80';
    if (cat.includes('미팅') || cat.includes('회의')) return '\uD83D\uDCC5';
    return '\uD83D\uDCCB';
}

function getStatusLabel(status) {
    const map = {
        planned: '계획',
        in_progress: '진행중',
        completed: '완료',
        on_hold: '보류',
        cancelled: '취소',
    };
    return map[status] || status || '계획';
}

function getPriorityLabel(priority) {
    const map = {
        low: '낮음',
        medium: '보통',
        high: '높음',
        critical: '긴급',
    };
    return map[priority] || priority || '보통';
}

function formatDevDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const month = d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    return `${month} (${dayNames[d.getDay()]})`;
}

function formatDevTime(timeStr) {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    return `${parts[0]}:${parts[1]}`;
}

async function loadDevSchedules() {
    try {
        const response = await fetch(DEV_SCHEDULE_API);
        if (!response.ok) throw new Error('Failed to load');
        const devJson = await response.json();
        devScheduleState.records = extractData(devJson);
    } catch (err) {
        console.warn('개발 일정 데이터를 불러오는 중 오류:', err);
        devScheduleState.records = [];
    }
    renderDevScheduleTimeline();
}

function getFilteredDevSchedules() {
    const { status, category, priority } = devScheduleState.filters;
    return devScheduleState.records.filter((r) => {
        if (status !== 'all' && r.status !== status) return false;
        if (category !== 'all' && r.category !== category) return false;
        if (priority !== 'all' && r.priority !== priority) return false;
        return true;
    });
}

function renderDevScheduleTimeline() {
    if (!devDom.timeline || !devDom.empty) return;

    const filtered = getFilteredDevSchedules();
    if (filtered.length === 0) {
        devDom.timeline.innerHTML = '';
        devDom.empty.classList.remove('hidden');
        devDom.empty.style.display = '';
        return;
    }
    devDom.empty.classList.add('hidden');
    devDom.empty.style.display = 'none';

    // Group by date
    const groups = new Map();
    filtered.forEach((record) => {
        const dateKey = record.scheduleDate || record.schedule_date || '';
        if (!groups.has(dateKey)) {
            groups.set(dateKey, []);
        }
        groups.get(dateKey).push(record);
    });

    // Sort date groups descending
    const sortedKeys = Array.from(groups.keys()).sort((a, b) => b.localeCompare(a));

    let html = '';
    sortedKeys.forEach((dateKey) => {
        const items = groups.get(dateKey);
        items.sort((a, b) => {
            const tA = a.scheduleTime || a.schedule_time || '';
            const tB = b.scheduleTime || b.schedule_time || '';
            return tA.localeCompare(tB);
        });

        html += `<div class="dev-schedule-date-group">`;
        html += `<div class="dev-schedule-date-header">${formatDevDate(dateKey)}</div>`;
        items.forEach((item) => {
            const timeStr = formatDevTime(item.scheduleTime || item.schedule_time || '');
            const iconClass = getCategoryIconClass(item.category);
            const icon = getCategoryIcon(item.category);
            const statusClass = `status-${item.status || 'planned'}`;
            const progress = Number(item.progress) || 0;
            const progressClass = progress >= 100 ? 'completed' : '';

            html += `<div class="dev-schedule-item ${statusClass}" data-schedule-id="${item.id}">`;
            html += `<div class="dev-schedule-item-time">${timeStr || '--:--'}</div>`;
            html += `<div class="dev-schedule-item-icon ${iconClass}">${icon}</div>`;
            html += `<div class="dev-schedule-item-body">`;
            html += `<div class="dev-schedule-item-title-row">`;
            html += `<span class="dev-schedule-item-title">${sanitizeText(item.title)}</span>`;
            html += `<div class="dev-schedule-item-badges">`;
            html += `<span class="dev-badge dev-badge-${item.status || 'planned'}">${getStatusLabel(item.status)}</span>`;
            html += `<span class="dev-badge dev-badge-priority-${item.priority || 'medium'}">${getPriorityLabel(item.priority)}</span>`;
            if (item.category) {
                html += `<span class="dev-badge" style="background: rgba(148,163,184,0.1); color: #475569;">${sanitizeText(item.category)}</span>`;
            }
            html += `</div></div>`;
            if (item.description) {
                html += `<div class="dev-schedule-item-desc">${sanitizeText(item.description)}</div>`;
            }
            html += `<div class="dev-schedule-item-meta">`;
            if (item.assignee) {
                html += `<span>\uD83D\uDC64 ${sanitizeText(item.assignee)}</span>`;
            }
            html += `<span><div class="dev-schedule-progress-bar"><div class="dev-schedule-progress-fill ${progressClass}" style="width: ${progress}%"></div></div> ${progress}%</span>`;
            if (item.notes) {
                html += `<span>\uD83D\uDCDD ${sanitizeText(item.notes)}</span>`;
            }
            html += `</div></div>`;
            html += `<div class="dev-schedule-item-actions">`;
            html += `<button class="ghost small btn-dev-edit" type="button" data-id="${item.id}">편집</button>`;
            html += `<button class="danger small btn-dev-delete" type="button" data-id="${item.id}">삭제</button>`;
            html += `</div></div>`;
        });
        html += `</div>`;
    });

    devDom.timeline.innerHTML = html;

    // Bind edit/delete buttons
    devDom.timeline.querySelectorAll('.btn-dev-edit').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = Number(btn.dataset.id);
            editDevSchedule(id);
        });
    });
    devDom.timeline.querySelectorAll('.btn-dev-delete').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = Number(btn.dataset.id);
            deleteDevSchedule(id);
        });
    });
}

function editDevSchedule(id) {
    const record = devScheduleState.records.find((r) => r.id === id);
    if (!record) return;

    devScheduleState.editingId = id;
    devDom.id.value = id;
    devDom.date.value = record.scheduleDate || record.schedule_date || '';
    devDom.time.value = record.scheduleTime || record.schedule_time || '';
    devDom.title.value = record.title || '';
    devDom.description.value = record.description || '';
    devDom.category.value = record.category || '';
    devDom.status.value = record.status || 'planned';
    devDom.priority.value = record.priority || 'medium';
    devDom.assignee.value = record.assignee || '';
    devDom.progress.value = record.progress || 0;
    devDom.notes.value = record.notes || '';
    devDom.btnSave.textContent = '수정';

    devDom.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function deleteDevSchedule(id) {
    if (!confirm('이 일정을 삭제하시겠습니까?')) return;
    try {
        const response = await fetch(`${DEV_SCHEDULE_API}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Delete failed');
        await loadDevSchedules();
    } catch (err) {
        alert('삭제 중 오류가 발생했습니다: ' + err.message);
    }
}

async function saveDevSchedule(event) {
    event.preventDefault();

    const dateValue = devDom.date.value;
    const titleValue = devDom.title.value.trim();
    if (!dateValue || !titleValue) {
        alert('날짜와 제목은 필수 입력 항목입니다.');
        return;
    }

    const payload = {
        schedule_date: dateValue,
        schedule_time: devDom.time.value || null,
        title: titleValue,
        description: devDom.description.value.trim() || null,
        category: devDom.category.value || null,
        status: devDom.status.value || 'planned',
        priority: devDom.priority.value || 'medium',
        assignee: devDom.assignee.value.trim() || null,
        progress: parseInt(devDom.progress.value, 10) || 0,
        notes: devDom.notes.value.trim() || null,
    };

    try {
        const isEdit = devScheduleState.editingId !== null;
        const url = isEdit
            ? `${DEV_SCHEDULE_API}/${devScheduleState.editingId}`
            : DEV_SCHEDULE_API;
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Save failed');
        resetDevScheduleForm();
        await loadDevSchedules();
    } catch (err) {
        alert('저장 중 오류가 발생했습니다: ' + err.message);
    }
}

function resetDevScheduleForm() {
    devScheduleState.editingId = null;
    if (devDom.form) devDom.form.reset();
    if (devDom.id) devDom.id.value = '';
    if (devDom.progress) devDom.progress.value = 0;
    if (devDom.btnSave) devDom.btnSave.textContent = '저장';
}

function bindDevScheduleEvents() {
    if (devDom.form) {
        devDom.form.addEventListener('submit', saveDevSchedule);
    }
    if (devDom.btnReset) {
        devDom.btnReset.addEventListener('click', resetDevScheduleForm);
    }
    if (devDom.filterStatus) {
        devDom.filterStatus.addEventListener('change', () => {
            devScheduleState.filters.status = devDom.filterStatus.value;
            renderDevScheduleTimeline();
        });
    }
    if (devDom.filterCategory) {
        devDom.filterCategory.addEventListener('change', () => {
            devScheduleState.filters.category = devDom.filterCategory.value;
            renderDevScheduleTimeline();
        });
    }
    if (devDom.filterPriority) {
        devDom.filterPriority.addEventListener('change', () => {
            devScheduleState.filters.priority = devDom.filterPriority.value;
            renderDevScheduleTimeline();
        });
    }
}

async function seedDefaultDevSchedule() {
    // If no records exist, create the default "연속적 소프트웨어 개발 및 시스템 연동" entry
    if (devScheduleState.records.length > 0) return;

    const defaultSchedules = [
        {
            schedule_date: '2026-03-16',
            schedule_time: '08:50',
            title: '연속적 소프트웨어 개발 및 시스템 연동',
            description: 'S&OP 계획 시스템의 연속적 소프트웨어 개발 및 외부 시스템과의 연동 작업을 진행합니다. 생산계획, 판매계획, 재고관리 모듈 간 데이터 흐름 최적화 및 ERP 시스템 연동을 포함합니다.',
            category: '시스템 연동',
            status: 'in_progress',
            priority: 'high',
            assignee: '개발팀',
            progress: 45,
            notes: 'SCM 통합 시스템 구축 프로젝트',
        },
        {
            schedule_date: '2026-03-17',
            schedule_time: '09:00',
            title: 'S&OP 대시보드 UI/UX 개선',
            description: '통합 계획 요약 대시보드 및 생산계획 현황 화면의 사용성 개선 작업',
            category: '소프트웨어 개발',
            status: 'planned',
            priority: 'medium',
            assignee: '프론트엔드팀',
            progress: 0,
            notes: '',
        },
        {
            schedule_date: '2026-03-18',
            schedule_time: '10:00',
            title: 'ERP 데이터 연동 테스트',
            description: '기존 ERP 시스템과의 자재마스터, 판매실적 데이터 실시간 연동 테스트 수행',
            category: '테스트/QA',
            status: 'planned',
            priority: 'high',
            assignee: 'QA팀',
            progress: 0,
            notes: '스테이징 환경에서 진행',
        },
        {
            schedule_date: '2026-03-19',
            schedule_time: '14:00',
            title: '생산 CAPA 연동 모듈 배포',
            description: '라인별 CAPA 자동 연산 및 실시간 모니터링 모듈 운영 서버 배포',
            category: '배포/릴리즈',
            status: 'planned',
            priority: 'medium',
            assignee: '인프라팀',
            progress: 0,
            notes: 'v2.1.0 릴리즈 예정',
        },
        {
            schedule_date: '2026-03-20',
            schedule_time: '09:30',
            title: 'SCM 플래너 회의 - 주간 리뷰',
            description: '주간 개발 진행 상황 리뷰 및 다음 주 계획 수립',
            category: '미팅/회의',
            status: 'planned',
            priority: 'low',
            assignee: '전체',
            progress: 0,
            notes: '',
        },
    ];

    for (const schedule of defaultSchedules) {
        try {
            await fetch(DEV_SCHEDULE_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schedule),
            });
        } catch (err) {
            console.warn('기본 일정 등록 중 오류:', err);
        }
    }

    await loadDevSchedules();
}

async function initDevSchedule() {
    initDevScheduleDom();
    bindDevScheduleEvents();
    await loadDevSchedules();
    await seedDefaultDevSchedule();
}

/* ═══════════════════════════════════════════════════════
   플랜트별 저장위치 선택 (동적 추가/삭제 지원)
   ═══════════════════════════════════════════════════════ */

const PLANT_STORAGE_API = '/sales-api/plant-storage';

const plantStorageState = {
    data: {},       // { P200: [...], P300: [...], ... }
    totalCount: 0,
    selectedCount: 0,
    lastAddedPlant: null,    // 마지막 추가된 플랜트 코드
    lastAddedStorageId: null, // 마지막 추가된 저장위치 ID
};

async function loadPlantStorageLocations() {
    try {
        const res = await fetch(PLANT_STORAGE_API);
        if (!res.ok) return;
        const json = await res.json();
        const psData = json.data || json;
        plantStorageState.totalCount = psData.total_count || 0;
        plantStorageState.selectedCount = psData.selected_count || 0;
        plantStorageState.data = psData.plants || {};
        renderPlantStorageGrid();
    } catch (e) {
        console.error('[PlantStorage] 로드 실패:', e);
    }
}

function renderPlantStorageGrid() {
    const plants = plantStorageState.data;
    const grid = document.getElementById('plant-storage-grid');
    if (!grid) return;

    // 요약 배지 업데이트
    const totalEl = document.getElementById('plant-storage-total');
    const selectedEl = document.getElementById('plant-storage-selected');
    if (totalEl) totalEl.textContent = plantStorageState.totalCount;
    if (selectedEl) selectedEl.textContent = plantStorageState.selectedCount;

    // 그리드를 완전히 동적으로 렌더링
    const plantCodes = Object.keys(plants).sort();
    grid.innerHTML = plantCodes.map(plantCode => {
        const locations = plants[plantCode] || [];
        const selectedInPlant = locations.filter(l => l.is_selected).length;
        const allChecked = locations.length > 0 && selectedInPlant === locations.length;
        const indeterminate = selectedInPlant > 0 && selectedInPlant < locations.length;
        const isHighlightPlant = plantStorageState.lastAddedPlant === plantCode;

        const locationsHtml = locations.map(loc => {
            const checked = loc.is_selected ? 'checked' : '';
            const checkedClass = loc.is_selected ? ' checked' : '';
            const stockAvail = loc.available_stock != null ? loc.available_stock.toLocaleString() : '-';
            const stockCurr = loc.current_stock != null ? loc.current_stock.toLocaleString() : '-';
            const pendingClass = loc.sap_sync_at == null ? ' pending' : '';
            const isHighlightItem = plantStorageState.lastAddedStorageId === loc.id;

            return `<label class="plant-storage-item${checkedClass}${isHighlightItem ? ' highlight' : ''}" data-storage-id="${loc.id}">
                <input type="checkbox" data-id="${loc.id}" data-plant="${plantCode}" ${checked}>
                <span class="storage-code">${sanitizeText(loc.storage_location)}</span>
                <span class="storage-stock">
                    <span><span class="stock-label">가용</span> <span class="stock-value${pendingClass}">${stockAvail}</span></span>
                    <span><span class="stock-label">현재</span> <span class="stock-value${pendingClass}">${stockCurr}</span></span>
                </span>
                <button type="button" class="btn-delete-storage" data-delete-id="${loc.id}" title="삭제">&#x2715;</button>
            </label>`;
        }).join('');

        return `<div class="plant-storage-card${isHighlightPlant ? ' highlight' : ''}" data-plant="${plantCode}">
            <div class="plant-storage-card-header">
                <label class="plant-select-all">
                    <input type="checkbox" class="plant-select-all-checkbox" data-plant="${plantCode}" ${allChecked ? 'checked' : ''}>
                    <strong>${sanitizeText(plantCode)}</strong>
                </label>
                <span class="plant-count" data-plant-count="${plantCode}">${selectedInPlant}/${locations.length}</span>
            </div>
            <div class="plant-storage-card-body" id="plant-storage-list-${plantCode}">
                ${locationsHtml}
            </div>
        </div>`;
    }).join('');

    // indeterminate 상태 설정 (렌더 후)
    plantCodes.forEach(plantCode => {
        const locations = plants[plantCode] || [];
        const selectedInPlant = locations.filter(l => l.is_selected).length;
        const allCheckbox = grid.querySelector(`.plant-select-all-checkbox[data-plant="${plantCode}"]`);
        if (allCheckbox) {
            allCheckbox.indeterminate = selectedInPlant > 0 && selectedInPlant < locations.length;
        }
    });

    // 하이라이트된 카드/항목으로 스크롤
    if (plantStorageState.lastAddedPlant) {
        const targetPlant = plantStorageState.lastAddedPlant;
        const targetStorageId = plantStorageState.lastAddedStorageId;

        requestAnimationFrame(() => {
            let scrollTarget = null;

            if (targetStorageId) {
                scrollTarget = grid.querySelector(`[data-storage-id="${targetStorageId}"]`);
            }
            if (!scrollTarget) {
                scrollTarget = grid.querySelector(`[data-plant="${targetPlant}"]`);
            }

            if (scrollTarget) {
                scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // 하이라이트 상태 초기화 (애니메이션 후)
            setTimeout(() => {
                plantStorageState.lastAddedPlant = null;
                plantStorageState.lastAddedStorageId = null;
            }, 2000);
        });
    }
}

async function togglePlantStorageItem(id) {
    try {
        const res = await fetch(`${PLANT_STORAGE_API}/${id}/toggle`, { method: 'PATCH' });
        if (res.ok) {
            await loadPlantStorageLocations();
        }
    } catch (e) {
        console.error('[PlantStorage] 토글 실패:', e);
    }
}

async function togglePlantStorageAll(plantCode, selected) {
    try {
        const res = await fetch(`${PLANT_STORAGE_API}/plant/${plantCode}/toggle-all`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ selected }),
        });
        if (res.ok) {
            await loadPlantStorageLocations();
        }
    } catch (e) {
        console.error('[PlantStorage] 일괄 토글 실패:', e);
    }
}

async function addPlantStorageLocation(plantCode, storageLocation) {
    const hintEl = document.getElementById('plant-storage-add-hint');
    const setHint = (msg, type) => {
        if (!hintEl) return;
        hintEl.textContent = msg;
        hintEl.className = 'plant-storage-add-hint ' + type;
        if (type === 'success') {
            setTimeout(() => { hintEl.textContent = ''; hintEl.className = 'plant-storage-add-hint'; }, 4000);
        }
    };

    try {
        const res = await fetch(PLANT_STORAGE_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                plant_code: plantCode.toUpperCase().trim(),
                plant_name: plantCode.toUpperCase().trim(),
                storage_location: storageLocation.toUpperCase().trim(),
                is_selected: false,
            }),
        });

        if (res.ok) {
            const created = await res.json();
            plantStorageState.lastAddedPlant = plantCode.toUpperCase().trim();
            plantStorageState.lastAddedStorageId = created.id;
            await loadPlantStorageLocations();
            setHint(`${plantCode.toUpperCase()} > ${storageLocation.toUpperCase()} 저장위치가 추가되었습니다.`, 'success');
            return true;
        } else if (res.status === 400) {
            setHint(`${plantCode.toUpperCase()} > ${storageLocation.toUpperCase()} 은(는) 이미 등록된 저장위치입니다.`, 'error');
            return false;
        } else {
            setHint('추가 실패: 서버 오류가 발생했습니다.', 'error');
            return false;
        }
    } catch (e) {
        console.error('[PlantStorage] 추가 실패:', e);
        setHint('추가 실패: 네트워크 오류', 'error');
        return false;
    }
}

async function deletePlantStorageItem(id) {
    try {
        const res = await fetch(`${PLANT_STORAGE_API}/${id}`, { method: 'DELETE' });
        if (res.ok || res.status === 204) {
            await loadPlantStorageLocations();
        }
    } catch (e) {
        console.error('[PlantStorage] 삭제 실패:', e);
    }
}

function bindPlantStorageEvents() {
    const grid = document.getElementById('plant-storage-grid');
    if (!grid) return;

    // 체크박스 + 삭제 버튼 이벤트 위임
    grid.addEventListener('change', (e) => {
        const checkbox = e.target;
        if (!checkbox.matches('input[type="checkbox"]')) return;

        // 전체 선택 체크박스
        if (checkbox.classList.contains('plant-select-all-checkbox')) {
            const plant = checkbox.dataset.plant;
            togglePlantStorageAll(plant, checkbox.checked);
            return;
        }

        // 개별 체크박스
        const id = checkbox.dataset.id;
        if (id) {
            togglePlantStorageItem(id);
        }
    });

    // 삭제 버튼 클릭 이벤트 위임
    grid.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.btn-delete-storage');
        if (!deleteBtn) return;
        e.preventDefault();
        e.stopPropagation();

        const id = deleteBtn.dataset.deleteId;
        if (id && confirm('이 저장위치를 삭제하시겠습니까?')) {
            deletePlantStorageItem(id);
        }
    });

    // 추가 폼 이벤트
    const addForm = document.getElementById('form-add-plant-storage');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const plantInput = document.getElementById('input-plant-code');
            const storageInput = document.getElementById('input-storage-location');
            const plantCode = (plantInput.value || '').trim();
            const storageLocation = (storageInput.value || '').trim();

            if (!plantCode) {
                plantInput.focus();
                return;
            }
            if (!storageLocation) {
                storageInput.focus();
                return;
            }

            const success = await addPlantStorageLocation(plantCode, storageLocation);
            if (success) {
                storageInput.value = '';
                storageInput.focus();
            }
        });
    }
}

async function initPlantStorage() {
    bindPlantStorageEvents();
    await loadPlantStorageLocations();
}

/* =========================================================================
 *  인터페이스 마스터 관리
 * ========================================================================= */

const ifMasterState = {
    data: [],
    editId: null,      // ID being inline-edited (null = none)
    addingRow: false    // true when a new-row is open at the top
};

async function loadInterfaceMasters() {
    try {
        const res = await fetch('/sales-api/interface-masters');
        if (!res.ok) throw new Error('Failed to load interface masters');
        const json = await res.json();
        ifMasterState.data = extractData(json);
        ifMasterState.editId = null;
        ifMasterState.addingRow = false;
        renderInterfaceMasterTable();
    } catch (e) {
        console.error('인터페이스 마스터 로드 실패:', e);
    }
}

/* ---- helper: build an inline-editable <tr> ---- */
function buildMasterInputRow(r) {
    const isNew = !r;
    const esc = v => (v || '').replace(/"/g, '&quot;');
    return `<tr class="inline-edit-row" data-id="${isNew ? 'new' : r.id}">
        <td><input type="text" class="inline-input" name="interface_id" value="${esc(r?.interface_id)}" placeholder="SNOP_IF_XXX" ${isNew ? '' : 'disabled'}></td>
        <td><input type="text" class="inline-input" name="interface_name" value="${esc(r?.interface_name)}" placeholder="인터페이스 명"></td>
        <td><input type="text" class="inline-input" name="sender" value="${esc(r?.sender)}" placeholder="SAP"></td>
        <td><input type="text" class="inline-input" name="receiver" value="${esc(r?.receiver)}" placeholder="S&OP"></td>
        <td><input type="text" class="inline-input" name="rfc_url" value="${esc(r?.rfc_url)}" placeholder="RFC Function / REST URL"></td>
        <td><input type="text" class="inline-input" name="rfc_param" value="${esc(r?.rfc_param)}" placeholder="Parameters"></td>
        <td><input type="text" class="inline-input" name="exec_command" value="${esc(r?.exec_command)}" placeholder="실행명령어"></td>
        <td><input type="text" class="inline-input" name="created_by" value="${esc(r?.created_by)}" placeholder="등록자"></td>
        <td><input type="text" class="inline-input" name="updated_by" value="${esc(r?.updated_by)}" placeholder="수정자"></td>
        <td><div class="if-manage-btns">
            <button type="button" class="small primary if-master-save-btn">저장</button>
            <button type="button" class="small secondary if-master-cancel-btn">취소</button>
        </div></td>
    </tr>`;
}

function renderInterfaceMasterTable() {
    const tbody = document.getElementById('interface-master-tbody');
    if (!tbody) return;

    let html = '';
    /* new row placeholder if adding */
    if (ifMasterState.addingRow) {
        html += buildMasterInputRow(null);
    }

    if (ifMasterState.data.length === 0 && !ifMasterState.addingRow) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty">등록된 인터페이스가 없습니다.</td></tr>';
        return;
    }

    html += ifMasterState.data.map(r => {
        if (ifMasterState.editId === r.id) {
            return buildMasterInputRow(r);
        }
        return `<tr data-id="${r.id}">
            <td>${r.interface_id || '-'}</td>
            <td>${r.interface_name || '-'}</td>
            <td>${r.sender || '-'}</td>
            <td>${r.receiver || '-'}</td>
            <td class="rfc-url-cell" title="${(r.rfc_url || '').replace(/"/g, '&quot;')}">${r.rfc_url || '-'}</td>
            <td class="rfc-param-cell" title="${(r.rfc_param || '').replace(/"/g, '&quot;')}">${r.rfc_param || '-'}</td>
            <td class="exec-command-cell" title="${(r.exec_command || '').replace(/"/g, '&quot;')}">${r.exec_command || '-'}</td>
            <td>${r.created_by || '-'}</td>
            <td>${r.updated_by || '-'}</td>
            <td><div class="if-manage-btns">
                <button type="button" class="small primary if-edit-btn" data-id="${r.id}">수정</button>
                <button type="button" class="small danger if-delete-btn" data-id="${r.id}">삭제</button>
            </div></td>
        </tr>`;
    }).join('');

    tbody.innerHTML = html;
}

/* ---- helper: read inputs from an inline row ---- */
function readMasterRowInputs(row) {
    const get = name => (row.querySelector(`input[name="${name}"]`)?.value || '').trim();
    return {
        interface_id: get('interface_id'),
        interface_name: get('interface_name'),
        sender: get('sender') || null,
        receiver: get('receiver') || null,
        rfc_url: get('rfc_url') || null,
        rfc_param: get('rfc_param') || null,
        exec_command: get('exec_command') || '',
        created_by: get('created_by') || null,
        updated_by: get('updated_by') || null
    };
}

function bindInterfaceMasterEvents() {
    /* + 신규 등록 버튼 */
    document.getElementById('btn-if-master-add-row')?.addEventListener('click', () => {
        if (ifMasterState.addingRow) return; // already open
        ifMasterState.editId = null;
        ifMasterState.addingRow = true;
        renderInterfaceMasterTable();
        // focus first input
        const firstInput = document.querySelector('#interface-master-tbody .inline-edit-row input');
        if (firstInput) firstInput.focus();
    });

    /* 테이블 이벤트 위임 (저장/취소/수정/삭제) */
    document.getElementById('interface-master-tbody')?.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        /* ---- 저장 (신규 또는 수정) ---- */
        if (btn.classList.contains('if-master-save-btn')) {
            const row = btn.closest('tr');
            const rowId = row.dataset.id;
            const payload = readMasterRowInputs(row);

            if (!payload.interface_id || !payload.interface_name) {
                alert('인터페이스 ID와 인터페이스 명은 필수입니다.');
                return;
            }

            try {
                if (rowId === 'new') {
                    // 신규 등록
                    const res = await fetch('/sales-api/interface-masters', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (!res.ok) {
                        const err = await res.json().catch(() => null);
                        const msg = err?.message || err?.error || '등록 실패';
                        alert(msg);
                        return;
                    }
                    alert('인터페이스가 등록되었습니다.');
                } else {
                    // 수정
                    const res = await fetch(`/sales-api/interface-masters/${rowId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (!res.ok) {
                        const err = await res.json().catch(() => null);
                        const msg = err?.message || err?.error || '수정 실패';
                        alert(msg);
                        return;
                    }
                    alert('인터페이스가 수정되었습니다.');
                }
                await loadInterfaceMasters();
            } catch (err) {
                console.error(err);
                alert('저장 중 오류가 발생했습니다: ' + err.message);
            }
            return;
        }

        /* ---- 취소 ---- */
        if (btn.classList.contains('if-master-cancel-btn')) {
            ifMasterState.addingRow = false;
            ifMasterState.editId = null;
            renderInterfaceMasterTable();
            return;
        }

        /* ---- 수정 (행 -> 인라인 입력으로 전환) ---- */
        if (btn.classList.contains('if-edit-btn')) {
            const id = Number(btn.dataset.id);
            ifMasterState.addingRow = false;
            ifMasterState.editId = id;
            renderInterfaceMasterTable();
            return;
        }

        /* ---- 삭제 ---- */
        if (btn.classList.contains('if-delete-btn')) {
            const id = Number(btn.dataset.id);
            const record = ifMasterState.data.find(r => r.id === id);
            const label = record ? `${record.interface_id} (${record.interface_name})` : `ID ${id}`;
            if (!confirm(`인터페이스 "${label}"을(를) 삭제하시겠습니까?`)) return;
            try {
                const res = await fetch(`/sales-api/interface-masters/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('삭제 실패');
                alert('삭제되었습니다.');
                await loadInterfaceMasters();
            } catch (err) {
                alert('삭제 중 오류: ' + err.message);
            }
        }
    });
}

/* =========================================================================
 *  인터페이스 수행관리 (2-2)
 * ========================================================================= */

const ifExecState = { data: [], editId: null, addingRow: false, latestHistories: {} };

async function loadInterfaceExecutions() {
    try {
        const [execRes, histRes] = await Promise.all([
            fetch('/sales-api/interface-executions'),
            fetch('/sales-api/interface-histories/latest-per-interface')
        ]);
        if (!execRes.ok) throw new Error('Failed');
        const execJson = await execRes.json();
        ifExecState.data = extractData(execJson);
        ifExecState.editId = null;
        ifExecState.addingRow = false;

        // 인터페이스별 최신 이력 매핑
        ifExecState.latestHistories = {};
        if (histRes.ok) {
            const histJson = await histRes.json();
            extractData(histJson).forEach(h => {
                ifExecState.latestHistories[h.interface_id] = h;
            });
        }
        renderIfExecTable();
    } catch (e) { console.error('수행관리 로드 실패:', e); }
}

/* ---- helper: interface ID <select> options from master list ---- */
function buildExecIfIdOptions(selectedVal) {
    let opts = '<option value="">-- 선택 --</option>';
    ifMasterState.data.forEach(m => {
        const sel = m.interface_id === selectedVal ? 'selected' : '';
        opts += `<option value="${m.interface_id}" ${sel}>${m.interface_id} - ${m.interface_name}</option>`;
    });
    return opts;
}

/* ---- helper: schedule type <select> ---- */
function buildScheduleTypeOptions(selectedVal) {
    const types = [['DAILY','매일'],['HOURLY','시간 간격'],['MINUTE','분 간격'],['CRON','CRON']];
    return types.map(([v,l]) => `<option value="${v}" ${v===selectedVal?'selected':''}>${l}</option>`).join('');
}

/* ---- helper: build an inline-editable <tr> for exec ---- */
function buildExecInputRow(r) {
    const isNew = !r;
    const esc = v => (v || '').replace(/"/g, '&quot;');
    const st = r?.schedule_type || 'DAILY';
    const showTime = st === 'DAILY' ? '' : 'display:none;';
    const showInterval = (st === 'HOURLY' || st === 'MINUTE') ? '' : 'display:none;';
    const showCron = st === 'CRON' ? '' : 'display:none;';
    return `<tr class="inline-edit-row" data-id="${isNew ? 'new' : r.id}">
        <td><select class="inline-input" name="interface_id" ${isNew ? '' : 'disabled'}>${buildExecIfIdOptions(r?.interface_id)}</select></td>
        <td style="color:#888; font-size:0.85em;">${isNew ? '(자동)' : (r?.interface_name || '-')}</td>
        <td><select class="inline-input exec-schedule-type-sel" name="schedule_type">${buildScheduleTypeOptions(st)}</select></td>
        <td>
            <span class="exec-time-wrap" style="${showTime}"><input type="time" class="inline-input" name="execution_time" value="${esc(r?.execution_time || '09:00')}"></span>
            <span class="exec-interval-wrap" style="${showInterval}"><input type="number" class="inline-input" name="interval_minutes" value="${r?.interval_minutes || 60}" min="1" style="width:60px;">분</span>
            <span class="exec-cron-wrap" style="${showCron}"><input type="text" class="inline-input" name="cron_expression" value="${esc(r?.cron_expression)}" placeholder="0 0 * * *"></span>
        </td>
        <td>${isNew ? '<span style="color:green;">활성</span>' : (r?.is_active ? '<span style="color:green;">활성</span>' : '<span style="color:#999;">비활성</span>')}</td>
        <td>${r?.last_executed_at ? formatDateTime(r.last_executed_at) : '-'}</td>
        <td>-</td>
        <td>${r?.next_execution_at ? formatDateTime(r.next_execution_at) : '-'}</td>
        <td><input type="text" class="inline-input" name="description" value="${esc(r?.description)}" placeholder="비고"></td>
        <td><input type="text" class="inline-input" name="created_by" value="${esc(r?.created_by)}" placeholder="등록자"></td>
        <td><div class="if-manage-btns">
            <button type="button" class="small primary if-exec-save-btn">저장</button>
            <button type="button" class="small secondary if-exec-cancel-btn">취소</button>
        </div></td>
    </tr>`;
}

function renderIfExecTable() {
    const tbody = document.getElementById('if-exec-tbody');
    if (!tbody) return;

    let html = '';
    if (ifExecState.addingRow) {
        html += buildExecInputRow(null);
    }

    if (ifExecState.data.length === 0 && !ifExecState.addingRow) {
        tbody.innerHTML = '<tr><td colspan="11" class="empty">등록된 수행 설정이 없습니다.</td></tr>';
        return;
    }

    html += ifExecState.data.map(r => {
        if (ifExecState.editId === r.id) {
            return buildExecInputRow(r);
        }
        const scheduleDesc = r.schedule_type === 'DAILY' ? `매일 ${r.execution_time || ''}` :
            r.schedule_type === 'HOURLY' || r.schedule_type === 'MINUTE' ? `${r.interval_minutes || 60}분 간격` :
            r.schedule_type === 'CRON' ? (r.cron_expression || '-') : '-';
        const activeLabel = r.is_active ? '<span style="color:green;font-weight:bold;">활성</span>' : '<span style="color:#999;">비활성</span>';

        // 마지막 수행 상태 표시
        const latestHist = ifExecState.latestHistories[r.interface_id];
        let lastStatusHtml = '<span style="color:#999;">-</span>';
        if (latestHist) {
            const statusMap = { SUCCESS:'성공', ERROR:'에러', RUNNING:'수행중', RETRY_SUCCESS:'재수행성공', RETRY_ERROR:'재수행에러' };
            const statusLabel = statusMap[latestHist.status] || latestHist.status;
            const isError = latestHist.status === 'ERROR' || latestHist.status === 'RETRY_ERROR';
            const isSuccess = latestHist.status === 'SUCCESS' || latestHist.status === 'RETRY_SUCCESS';
            const isRunning = latestHist.status === 'RUNNING';
            const statusStyle = isError ? 'color:#e53e3e;font-weight:bold;' : isSuccess ? 'color:#38a169;' : isRunning ? 'color:#dd6b20;' : '';
            const statusIcon = isError ? '&#10060;' : isSuccess ? '&#9989;' : isRunning ? '&#9203;' : '&#8226;';
            const errTooltip = isError && latestHist.error_message ? ` title="${(latestHist.error_message||'').replace(/"/g,'&quot;').substring(0,200)}"` : '';
            lastStatusHtml = `<span style="${statusStyle}"${errTooltip}>${statusIcon} ${statusLabel}</span>`;
            if (isError) {
                lastStatusHtml += `<br><button type="button" class="small danger if-exec-retry-btn" data-hist-id="${latestHist.id}" data-if-id="${r.interface_id}" style="margin-top:2px;font-size:0.75em;padding:1px 6px;">재수행</button>`;
            }
        }

        return `<tr data-id="${r.id}">
            <td>${r.interface_id || '-'}</td>
            <td>${r.interface_name || '-'}</td>
            <td>${r.schedule_type || '-'}</td>
            <td>${scheduleDesc}</td>
            <td>${activeLabel}</td>
            <td>${r.last_executed_at ? formatDateTime(r.last_executed_at) : '-'}</td>
            <td>${lastStatusHtml}</td>
            <td>${r.next_execution_at ? formatDateTime(r.next_execution_at) : '-'}</td>
            <td title="${(r.description||'').replace(/"/g,'&quot;')}">${r.description || '-'}</td>
            <td>${r.created_by || '-'}</td>
            <td><div class="if-manage-btns">
                <button type="button" class="small primary if-exec-run-btn" data-if-id="${r.interface_id}" title="즉시 수동 실행">수동실행</button>
                <button type="button" class="small primary if-exec-edit-btn" data-id="${r.id}">수정</button>
                <button type="button" class="small ${r.is_active?'secondary':'primary'} if-exec-toggle-btn" data-id="${r.id}">${r.is_active?'비활성':'활성'}</button>
                <button type="button" class="small danger if-exec-delete-btn" data-id="${r.id}">삭제</button>
            </div></td>
        </tr>`;
    }).join('');

    tbody.innerHTML = html;
}

/* ---- helper: read inputs from an exec inline row ---- */
function readExecRowInputs(row) {
    const get = name => (row.querySelector(`[name="${name}"]`)?.value || '').trim();
    const ifId = get('interface_id');
    const master = ifMasterState.data.find(m => m.interface_id === ifId);
    return {
        interface_id: ifId,
        interface_name: master ? master.interface_name : '',
        schedule_type: get('schedule_type'),
        execution_time: get('execution_time') || null,
        interval_minutes: parseInt(get('interval_minutes')) || null,
        cron_expression: get('cron_expression') || null,
        description: get('description') || null,
        created_by: get('created_by') || null,
        is_active: true
    };
}

function bindIfExecEvents() {
    /* + 신규 등록 버튼 */
    document.getElementById('btn-if-exec-add-row')?.addEventListener('click', () => {
        if (ifExecState.addingRow) return;
        ifExecState.editId = null;
        ifExecState.addingRow = true;
        renderIfExecTable();
        const firstInput = document.querySelector('#if-exec-tbody .inline-edit-row select');
        if (firstInput) firstInput.focus();
    });

    /* 테이블 이벤트 위임 */
    document.getElementById('if-exec-tbody')?.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        /* ---- 저장 ---- */
        if (btn.classList.contains('if-exec-save-btn')) {
            const row = btn.closest('tr');
            const rowId = row.dataset.id;
            const payload = readExecRowInputs(row);
            if (!payload.interface_id) { alert('인터페이스를 선택하세요.'); return; }
            try {
                if (rowId === 'new') {
                    const res = await fetch('/sales-api/interface-executions', {
                        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
                    if (res.status === 409) { const err = await res.json(); alert(err.message); return; }
                    if (!res.ok) throw new Error('등록 실패');
                    alert('수행 설정이 등록되었습니다.');
                } else {
                    const res = await fetch(`/sales-api/interface-executions/${rowId}`, {
                        method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
                    if (!res.ok) throw new Error('수정 실패');
                    alert('수행 설정이 수정되었습니다.');
                }
                await loadInterfaceExecutions();
            } catch (err) { alert('저장 오류: ' + err.message); }
            return;
        }

        /* ---- 취소 ---- */
        if (btn.classList.contains('if-exec-cancel-btn')) {
            ifExecState.addingRow = false;
            ifExecState.editId = null;
            renderIfExecTable();
            return;
        }

        /* ---- 수정 (인라인 전환) ---- */
        if (btn.classList.contains('if-exec-edit-btn')) {
            const id = Number(btn.dataset.id);
            ifExecState.addingRow = false;
            ifExecState.editId = id;
            renderIfExecTable();
            return;
        }

        /* ---- 활성/비활성 토글 ---- */
        if (btn.classList.contains('if-exec-toggle-btn')) {
            const id = Number(btn.dataset.id);
            try {
                await fetch(`/sales-api/interface-executions/${id}/toggle`, { method: 'PATCH' });
                await loadInterfaceExecutions();
            } catch (err) { alert('상태 변경 실패'); }
            return;
        }

        /* ---- 삭제 ---- */
        if (btn.classList.contains('if-exec-delete-btn')) {
            const id = Number(btn.dataset.id);
            if (!confirm('수행 설정을 삭제하시겠습니까?')) return;
            try {
                await fetch(`/sales-api/interface-executions/${id}`, { method: 'DELETE' });
                await loadInterfaceExecutions();
            } catch (err) { alert('삭제 실패'); }
            return;
        }

        /* ---- 수동 실행 ---- */
        if (btn.classList.contains('if-exec-run-btn')) {
            const ifId = btn.dataset.ifId;
            /* 동일 인터페이스 중복 실행 방지 — 전역 플래그로 완전 차단 */
            if (!state._runningManualExec) state._runningManualExec = new Set();
            if (state._runningManualExec.has(ifId)) {
                alert(`"${ifId}" 수동 실행이 이미 진행 중입니다. 완료 후 다시 시도해주세요.`);
                return;
            }
            if (!confirm(`"${ifId}" 인터페이스를 수동 실행하시겠습니까?`)) return;
            state._runningManualExec.add(ifId);
            btn.disabled = true;
            /* 같은 ifId를 가진 모든 수동실행 버튼 비활성화 */
            document.querySelectorAll(`.if-exec-run-btn[data-if-id="${ifId}"]`).forEach(b => { b.disabled = true; });
            const origText = btn.textContent;
            btn.textContent = '실행중...';

            /* ── fire-and-forget 방식 ──
             * RFC 호출이 60초 이상 걸릴 수 있어 프록시(Nginx) 타임아웃으로
             * HTML 에러 페이지가 반환될 수 있음 → JSON 파싱 실패 방지
             * 1) 요청을 보내고 "실행 요청 완료" 즉시 표시
             * 2) 5초마다 이력 목록을 폴링하여 완료 여부 확인
             */
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000); // 최대 2분 대기

            // 요청 발사 — 응답을 기다리되 타임아웃/파싱 에러를 허용
            fetch(`/sales-api/interface-histories/manual-execute/${ifId}`, {
                method: 'POST',
                signal: controller.signal
            }).then(async res => {
                clearTimeout(timeoutId);
                if (!res.ok) {
                    try {
                        const err = await res.json();
                        alert(err.error || err.message || '수동 실행 실패');
                    } catch { alert('수동 실행 실패 (HTTP ' + res.status + ')'); }
                } else {
                    try {
                        const result = await res.json();
                        const d = result.data || result;
                        const statusLabel = { SUCCESS:'성공', PARTIAL_SUCCESS:'부분성공', ERROR:'에러', RETRY_SUCCESS:'재수행성공', RETRY_ERROR:'재수행에러' };
                        alert(`수동 실행 완료 - 상태: ${statusLabel[d.status] || d.status}`);
                    } catch { alert(`"${ifId}" 수동 실행이 완료되었습니다.\n이력관리 탭에서 결과를 확인해주세요.`); }
                }
                state._runningManualExec.delete(ifId);
                btn.disabled = false;
                btn.textContent = origText;
                document.querySelectorAll(`.if-exec-run-btn[data-if-id="${ifId}"]`).forEach(b => { b.disabled = false; });
                await loadInterfaceExecutions();
                /* 수동실행 완료 후 전체 데이터 갱신 (새로고침 없이 반영) */
                await loadData();
            }).catch(err => {
                clearTimeout(timeoutId);
                // 타임아웃 또는 네트워크 에러 — 서버에서는 계속 실행 중일 수 있음
                if (err.name === 'AbortError') {
                    alert(`"${ifId}" 실행 요청이 전송되었으나 응답 대기 시간이 초과되었습니다.\n서버에서 처리 중일 수 있으니 이력관리 탭에서 결과를 확인해주세요.`);
                } else {
                    alert(`"${ifId}" 실행 요청이 전송되었습니다.\n프록시 타임아웃이 발생했지만, 서버에서는 정상 처리 중일 수 있습니다.\n이력관리 탭에서 결과를 확인해주세요.`);
                }
                state._runningManualExec.delete(ifId);
                btn.disabled = false;
                btn.textContent = origText;
                document.querySelectorAll(`.if-exec-run-btn[data-if-id="${ifId}"]`).forEach(b => { b.disabled = false; });
                loadInterfaceExecutions();
                /* 타임아웃 후에도 데이터 갱신 시도 (서버에서 처리 완료되었을 수 있음) */
                loadData();
            });
            return;
        }

        /* ---- 에러건 재수행 (수행관리 화면에서) ---- */
        if (btn.classList.contains('if-exec-retry-btn')) {
            const histId = Number(btn.dataset.histId);
            const ifId = btn.dataset.ifId;
            if (!confirm(`"${ifId}" 인터페이스의 마지막 에러건을 재수행하시겠습니까?`)) return;
            btn.disabled = true;
            btn.textContent = '수행중...';
            try {
                const res = await fetch(`/sales-api/interface-histories/${histId}/retry`, { method: 'POST' });
                if (!res.ok) {
                    const err = await res.json();
                    alert(err.error || err.message || '재수행 실패');
                } else {
                    const result = await res.json();
                    const d = result.data || result;
                    const statusLabel = { SUCCESS:'성공', ERROR:'에러', RETRY_SUCCESS:'재수행성공', RETRY_ERROR:'재수행에러' };
                    alert(`재수행 완료 - 상태: ${statusLabel[d.status] || d.status}`);
                }
                await loadInterfaceExecutions();
            } catch (err) {
                alert('재수행 중 오류: ' + err.message);
            } finally {
                btn.disabled = false;
                btn.textContent = '재수행';
            }
            return;
        }
    });

    /* schedule type 변경 시 관련 입력 필드 표시 전환 (이벤트 위임) */
    document.getElementById('if-exec-tbody')?.addEventListener('change', (e) => {
        if (!e.target.classList.contains('exec-schedule-type-sel')) return;
        const row = e.target.closest('tr');
        if (!row) return;
        const type = e.target.value;
        const timeWrap = row.querySelector('.exec-time-wrap');
        const intervalWrap = row.querySelector('.exec-interval-wrap');
        const cronWrap = row.querySelector('.exec-cron-wrap');
        if (timeWrap) timeWrap.style.display = type === 'DAILY' ? '' : 'none';
        if (intervalWrap) intervalWrap.style.display = (type === 'HOURLY' || type === 'MINUTE') ? '' : 'none';
        if (cronWrap) cronWrap.style.display = type === 'CRON' ? '' : 'none';
    });
}

/* =========================================================================
 *  인터페이스 이력관리 (2-3)
 * ========================================================================= */

const ifHistState = { data: [] };

async function loadInterfaceHistories() {
    try {
        const res = await fetch('/sales-api/interface-histories');
        if (!res.ok) throw new Error('Failed');
        const json = await res.json();
        ifHistState.data = extractData(json);
        renderIfHistTable();
    } catch (e) { console.error('이력 로드 실패:', e); }
}

function renderIfHistTable() {
    const tbody = document.getElementById('if-hist-tbody');
    if (!tbody) return;

    let filtered = [...ifHistState.data];
    const statusFilter = document.getElementById('if-hist-filter-status')?.value;
    const ifFilter = document.getElementById('if-hist-filter-if')?.value;
    if (statusFilter) filtered = filtered.filter(r => r.status === statusFilter);
    if (ifFilter) filtered = filtered.filter(r => r.interface_id === ifFilter);

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="13" class="empty">수행 이력이 없습니다.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map((r, i) => {
        const isError = r.status === 'ERROR' || r.status === 'RETRY_ERROR';
        const isSuccess = r.status === 'SUCCESS' || r.status === 'RETRY_SUCCESS';
        const isRunning = r.status === 'RUNNING';
        const statusStyle = isError ? 'color:#e53e3e;font-weight:bold;' :
            isSuccess ? 'color:#38a169;' : isRunning ? 'color:#dd6b20;' : '';
        const statusIcon = isError ? '&#10060;' : isSuccess ? '&#9989;' : isRunning ? '&#9203;' : '&#8226;';
        const statusLabel = { SUCCESS:'성공', ERROR:'에러', RUNNING:'수행중', RETRY_SUCCESS:'재수행성공', RETRY_ERROR:'재수행에러', SCHEDULED:'스케줄', MANUAL:'수동', RETRY:'재수행' };
        const canRetry = isError;
        const errorMsgHtml = r.error_message
            ? `<span class="if-hist-errmsg-link" data-id="${r.id}" style="color:#e53e3e;cursor:pointer;text-decoration:underline;" title="클릭하여 전체 에러 메시지 보기">${r.error_message.substring(0,50)}${r.error_message.length > 50 ? '...' : ''}</span>`
            : '-';
        const retryInfo = r.retry_of_id ? `<span style="font-size:0.8em;color:#888;">(원본 #${r.retry_of_id})</span>` : '';
        return `<tr data-id="${r.id}" style="${isError ? 'background:#fff5f5;' : ''}">
            <td>${i + 1}</td>
            <td>${r.interface_id || '-'}</td>
            <td>${r.interface_name || '-'}</td>
            <td>${statusLabel[r.execution_type] || r.execution_type || '-'} ${retryInfo}</td>
            <td>${r.start_time ? formatDateTime(r.start_time, {second:'2-digit'}) : '-'}</td>
            <td>${r.end_time ? formatDateTime(r.end_time, {second:'2-digit'}) : '-'}</td>
            <td class="number">${r.duration_ms != null ? r.duration_ms.toLocaleString() : '-'}</td>
            <td class="number">${r.processed_count != null ? r.processed_count : '-'}</td>
            <td class="number" style="${r.error_count > 0 ? 'color:#e53e3e;font-weight:bold;' : ''}">${r.error_count != null ? r.error_count : '-'}</td>
            <td style="${statusStyle}">${statusIcon} ${statusLabel[r.status] || r.status}</td>
            <td class="rfc-param-cell">${errorMsgHtml}</td>
            <td class="exec-command-cell" title="${(r.exec_command||'').replace(/"/g,'&quot;')}">${r.exec_command ? r.exec_command.substring(0,30) + (r.exec_command.length > 30 ? '...' : '') : '-'}</td>
            <td>
                ${canRetry ? `<button type="button" class="small danger if-hist-retry-btn" data-id="${r.id}">재수행</button>` : '-'}
            </td>
        </tr>`;
    }).join('');
}

function populateIfHistFilters() {
    const select = document.getElementById('if-hist-filter-if');
    if (!select) return;
    const ids = [...new Set(ifHistState.data.map(r => r.interface_id))];
    select.innerHTML = '<option value="">전체 인터페이스</option>' +
        ids.map(id => `<option value="${id}">${id}</option>`).join('');
}

function bindIfHistEvents() {
    document.getElementById('if-hist-filter-status')?.addEventListener('change', renderIfHistTable);
    document.getElementById('if-hist-filter-if')?.addEventListener('change', renderIfHistTable);
    document.getElementById('btn-if-hist-refresh')?.addEventListener('click', async () => {
        await loadInterfaceHistories();
        populateIfHistFilters();
    });

    document.getElementById('if-hist-tbody')?.addEventListener('click', async (e) => {
        /* ---- 에러 메시지 상세 보기 ---- */
        const errLink = e.target.closest('.if-hist-errmsg-link');
        if (errLink) {
            const id = Number(errLink.dataset.id);
            const record = ifHistState.data.find(r => r.id === id);
            if (record && record.error_message) {
                showIfErrorModal(record);
            }
            return;
        }

        const btn = e.target.closest('.if-hist-retry-btn');
        if (!btn) return;
        const id = Number(btn.dataset.id);
        const record = ifHistState.data.find(r => r.id === id);
        const label = record ? `${record.interface_id} (${record.interface_name})` : `ID ${id}`;
        if (!confirm(`"${label}" 인터페이스를 재수행하시겠습니까?`)) return;
        btn.disabled = true;
        btn.textContent = '수행중...';
        try {
            const res = await fetch(`/sales-api/interface-histories/${id}/retry`, { method: 'POST' });
            if (!res.ok) {
                const err = await res.json();
                alert(err.error || err.message || '재수행 실패');
            } else {
                const result = await res.json();
                const d = result.data || result;
                const statusLabel = { SUCCESS:'성공', ERROR:'에러', RETRY_SUCCESS:'재수행성공', RETRY_ERROR:'재수행에러' };
                alert(`재수행 완료 - 상태: ${statusLabel[d.status] || d.status}`);
            }
            await loadInterfaceHistories();
            populateIfHistFilters();
        } catch (err) {
            alert('재수행 중 오류: ' + err.message);
        } finally {
            btn.disabled = false;
            btn.textContent = '재수행';
        }
    });
}

/* ---- 에러 메시지 상세 모달 ---- */
function showIfErrorModal(record) {
    // 기존 모달 제거
    document.getElementById('if-error-modal-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'if-error-modal-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = `
        <div style="background:white;border-radius:8px;padding:24px;max-width:700px;width:90%;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 4px 20px rgba(0,0,0,0.3);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <h3 style="margin:0;color:#e53e3e;">&#10060; 에러 상세 정보</h3>
                <button id="if-error-modal-close" style="background:none;border:none;font-size:1.4em;cursor:pointer;color:#666;">&times;</button>
            </div>
            <div style="display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin-bottom:12px;font-size:0.9em;">
                <span style="font-weight:bold;color:#555;">인터페이스 ID:</span><span>${record.interface_id || '-'}</span>
                <span style="font-weight:bold;color:#555;">인터페이스 명:</span><span>${record.interface_name || '-'}</span>
                <span style="font-weight:bold;color:#555;">수행구분:</span><span>${record.execution_type || '-'}</span>
                <span style="font-weight:bold;color:#555;">수행시간:</span><span>${record.start_time ? formatDateTime(record.start_time, {second:'2-digit'}) : '-'}</span>
                <span style="font-weight:bold;color:#555;">상태:</span><span style="color:#e53e3e;font-weight:bold;">${record.status}</span>
                ${record.retry_of_id ? `<span style="font-weight:bold;color:#555;">원본 이력 ID:</span><span>#${record.retry_of_id}</span>` : ''}
            </div>
            <div style="font-weight:bold;color:#555;margin-bottom:4px;">에러 메시지:</div>
            <pre style="background:#fff5f5;border:1px solid #feb2b2;border-radius:4px;padding:12px;margin:0;overflow:auto;flex:1;white-space:pre-wrap;word-break:break-all;font-size:0.85em;color:#333;max-height:300px;">${(record.error_message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            <div style="margin-top:12px;text-align:right;">
                <button id="if-error-modal-retry" class="small danger" style="padding:6px 16px;" data-id="${record.id}">재수행</button>
                <button id="if-error-modal-close2" class="small secondary" style="padding:6px 16px;margin-left:8px;">닫기</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 닫기 이벤트
    const closeModal = () => overlay.remove();
    overlay.querySelector('#if-error-modal-close').addEventListener('click', closeModal);
    overlay.querySelector('#if-error-modal-close2').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    // 모달에서 재수행 버튼
    overlay.querySelector('#if-error-modal-retry').addEventListener('click', async (e) => {
        const histId = Number(e.target.dataset.id);
        if (!confirm('이 에러건을 재수행하시겠습니까?')) return;
        e.target.disabled = true;
        e.target.textContent = '수행중...';
        try {
            const res = await fetch(`/sales-api/interface-histories/${histId}/retry`, { method: 'POST' });
            if (!res.ok) {
                const err = await res.json();
                alert(err.error || err.message || '재수행 실패');
            } else {
                const result = await res.json();
                const d = result.data || result;
                const statusMap = { SUCCESS:'성공', ERROR:'에러', RETRY_SUCCESS:'재수행성공', RETRY_ERROR:'재수행에러' };
                alert(`재수행 완료 - 상태: ${statusMap[d.status] || d.status}`);
                closeModal();
                await loadInterfaceHistories();
                populateIfHistFilters();
            }
        } catch (err) {
            alert('재수행 중 오류: ' + err.message);
        } finally {
            e.target.disabled = false;
            e.target.textContent = '재수행';
        }
    });
}

/* =========================================================================
 *  인터페이스 서브탭 전환 + 초기화
 * ========================================================================= */

function setupIfSubTabs() {
    const tabs = document.querySelectorAll('[data-if-target]');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.ifTarget;
            document.querySelectorAll('.if-sub-panel').forEach(p => p.classList.add('hidden'));
            const panel = document.getElementById(`if-panel-${target}`);
            if (panel) panel.classList.remove('hidden');
            // 패널 전환 시 데이터 로드
            if (target === 'execution') {
                loadInterfaceExecutions();
            }
            if (target === 'history') {
                loadInterfaceHistories().then(() => populateIfHistFilters());
            }
        });
    });
}

async function initInterfaceMaster() {
    setupIfSubTabs();
    bindInterfaceMasterEvents();
    bindIfExecEvents();
    bindIfHistEvents();
    await loadInterfaceMasters();
}

/* =========================================================================
 *  인증 체크 & 로그아웃
 * ========================================================================= */

async function checkAuthAndRedirect() {
    try {
        const res = await fetch('/sales-api/auth/me', { credentials: 'same-origin' });
        if (!res.ok) {
            window.location.href = '/login.html';
            return false;
        }
        const data = await res.json();
        if (!data.authenticated) {
            window.location.href = '/login.html';
            return false;
        }
        // 로그인 정보 표시
        const infoEl = document.getElementById('header-user-info');
        const logoutBtn = document.getElementById('btn-logout');
        if (infoEl) {
            const roleBadge = data.role === 'ADMIN' ? ' [관리자]' : '';
            infoEl.textContent = `${data.user_name}${roleBadge} 님`;
        }
        if (logoutBtn) logoutBtn.style.display = '';
        // 세션 스토리지에도 저장
        sessionStorage.setItem('loginUser', data.user_id);
        sessionStorage.setItem('loginUserName', data.user_name);
        sessionStorage.setItem('loginUserRole', data.role);
        return true;
    } catch (e) {
        window.location.href = '/login.html';
        return false;
    }
}

async function doLogout() {
    try {
        await fetch('/sales-api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } catch (e) { /* ignore */ }
    sessionStorage.clear();
    window.location.href = '/login.html';
}
// 전역에서 접근 가능하도록 (onclick="doLogout()")
window.doLogout = doLogout;

/* =========================================================================
 *  사용자 관리 (CRUD)
 * ========================================================================= */

const userMgmtState = { data: [], editId: null, adding: false };

async function loadUsers() {
    try {
        const res = await fetch('/sales-api/users', { credentials: 'same-origin' });
        const json = await res.json();
        userMgmtState.data = extractData(json);
        userMgmtState.editId = null;
        userMgmtState.adding = false;
        renderUserTable();
    } catch (e) {
        console.error('사용자 목록 로딩 실패', e);
    }
}

function buildUserInputRow(u) {
    const isNew = !u;
    const id = u ? u.id : '';
    return `<tr class="inline-edit-row" data-id="${id}">
        <td><input class="inline-input" name="user_id" value="${u ? (u.user_id||'') : ''}" placeholder="아이디" ${isNew ? '' : 'disabled'} style="width:100%;min-width:80px;"></td>
        <td><input class="inline-input" name="user_name" value="${u ? (u.user_name||'') : ''}" placeholder="사용자명" style="width:100%;min-width:70px;"></td>
        <td><input class="inline-input" name="password" type="password" value="" placeholder="${isNew ? '비밀번호' : '(변경 시 입력)'}" style="width:100%;min-width:80px;"></td>
        <td><input class="inline-input" name="email" value="${u ? (u.email||'') : ''}" placeholder="이메일" style="width:100%;min-width:120px;"></td>
        <td><input class="inline-input" name="department" value="${u ? (u.department||'') : ''}" placeholder="부서" style="width:100%;min-width:70px;"></td>
        <td><select class="inline-input" name="role" style="width:100%;min-width:70px;">
                <option value="USER" ${(!u || u.role==='USER') ? 'selected' : ''}>USER</option>
                <option value="ADMIN" ${(u && u.role==='ADMIN') ? 'selected' : ''}>ADMIN</option>
            </select></td>
        <td style="text-align:center;">
            <select class="inline-input" name="is_active" style="width:100%;min-width:50px;">
                <option value="true" ${(!u || u.is_active!==false) ? 'selected' : ''}>Y</option>
                <option value="false" ${(u && u.is_active===false) ? 'selected' : ''}>N</option>
            </select></td>
        <td>${u ? formatDateTime(u.last_login_at) : '-'}</td>
        <td>${u ? formatDateTime(u.created_at) : '-'}</td>
        <td class="if-manage-btns">
            <button class="small primary user-save-btn" data-id="${id}">저장</button>
            <button class="small secondary user-cancel-btn" data-id="${id}">취소</button>
        </td>
    </tr>`;
}

function renderUserTable() {
    const tbody = document.getElementById('user-mgmt-tbody');
    if (!tbody) return;

    let html = '';

    // 신규 행
    if (userMgmtState.adding) {
        html += buildUserInputRow(null);
    }

    if (userMgmtState.data.length === 0 && !userMgmtState.adding) {
        html = '<tr><td colspan="10" class="empty">등록된 사용자가 없습니다.</td></tr>';
    } else {
        userMgmtState.data.forEach(u => {
            if (userMgmtState.editId === u.id) {
                html += buildUserInputRow(u);
            } else {
                html += `<tr data-id="${u.id}">
                    <td>${u.user_id || ''}</td>
                    <td>${u.user_name || ''}</td>
                    <td>****</td>
                    <td>${u.email || ''}</td>
                    <td>${u.department || ''}</td>
                    <td>${u.role || 'USER'}</td>
                    <td style="text-align:center;">${u.is_active !== false ? 'Y' : 'N'}</td>
                    <td>${formatDateTime(u.last_login_at)}</td>
                    <td>${formatDateTime(u.created_at)}</td>
                    <td class="if-manage-btns">
                        <button class="small primary user-edit-btn" data-id="${u.id}">수정</button>
                        <button class="small danger user-delete-btn" data-id="${u.id}">삭제</button>
                    </td>
                </tr>`;
            }
        });
    }

    tbody.innerHTML = html;
}

function bindUserMgmtEvents() {
    // "+ 사용자 등록" 버튼
    const addBtn = document.getElementById('btn-user-add-row');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            userMgmtState.adding = true;
            userMgmtState.editId = null;
            renderUserTable();
        });
    }

    // 테이블 내 버튼 위임
    const tbody = document.getElementById('user-mgmt-tbody');
    if (!tbody) return;

    tbody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        // 저장
        if (btn.classList.contains('user-save-btn')) {
            const row = btn.closest('tr');
            const inputs = {};
            row.querySelectorAll('input.inline-input, select.inline-input').forEach(el => {
                inputs[el.name] = el.value.trim();
            });

            const dataId = btn.dataset.id;
            const isNew = !dataId;

            // 유효성
            if (isNew && !inputs.user_id) { alert('사용자 ID를 입력하세요.'); return; }
            if (!inputs.user_name) { alert('사용자명을 입력하세요.'); return; }
            if (isNew && !inputs.password) { alert('비밀번호를 입력하세요.'); return; }

            try {
                let res;
                if (isNew) {
                    // 신규 생성
                    const body = {
                        user_id: inputs.user_id,
                        user_name: inputs.user_name,
                        password: inputs.password,
                        email: inputs.email || null,
                        department: inputs.department || null,
                        role: inputs.role || 'USER',
                        is_active: inputs.is_active === 'true'
                    };
                    res = await fetch('/sales-api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                        credentials: 'same-origin'
                    });
                } else {
                    // 수정
                    const body = {
                        user_name: inputs.user_name,
                        email: inputs.email || null,
                        department: inputs.department || null,
                        role: inputs.role || 'USER',
                        is_active: inputs.is_active === 'true'
                    };
                    if (inputs.password) body.password = inputs.password;
                    res = await fetch(`/sales-api/users/${dataId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                        credentials: 'same-origin'
                    });
                }
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    alert(err.message || '저장 실패');
                    return;
                }
                await loadUsers();
            } catch (err) {
                alert('저장 중 오류: ' + err.message);
            }
        }

        // 취소
        if (btn.classList.contains('user-cancel-btn')) {
            userMgmtState.editId = null;
            userMgmtState.adding = false;
            renderUserTable();
        }

        // 수정
        if (btn.classList.contains('user-edit-btn')) {
            userMgmtState.editId = Number(btn.dataset.id);
            userMgmtState.adding = false;
            renderUserTable();
        }

        // 삭제
        if (btn.classList.contains('user-delete-btn')) {
            const id = btn.dataset.id;
            const user = userMgmtState.data.find(u => u.id === Number(id));
            const name = user ? (user.user_name || user.user_id) : id;
            if (!confirm(`'${name}' 사용자를 삭제하시겠습니까?`)) return;
            try {
                const res = await fetch(`/sales-api/users/${id}`, {
                    method: 'DELETE',
                    credentials: 'same-origin'
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    alert(err.message || '삭제 실패');
                    return;
                }
                await loadUsers();
            } catch (err) {
                alert('삭제 중 오류: ' + err.message);
            }
        }
    });
}

function initUserMgmt() {
    bindUserMgmtEvents();
    loadUsers();
}

/* =========================================================================
 *  초기화 (인증 체크 포함)
 * ========================================================================= */

(async function boot() {
    const authenticated = await checkAuthAndRedirect();
    if (!authenticated) return; // login.html로 리다이렉트됨
    initialize();
})();
