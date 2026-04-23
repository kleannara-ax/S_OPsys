-- ============================================================
--  S_OPsys 샘플 데이터 (MariaDB)
--  실행: mariadb -u snop_user -psnop_pass1234 snop_db < scripts/seed_sample_data.sql
-- ============================================================

SET NAMES utf8mb4;

-- ────────────────────────────────────────────
-- 1. 자재마스터 (MOD_SALES_BASE_MATERIAL_MASTER) - 25건
-- ────────────────────────────────────────────
INSERT INTO mod_sales_base_material_master
  (scm_area, hierarchy_name, production_unit, item_code, item_name, conversion1, conversion2, conversion3, conversion5, conversion_ratio, vendor_name, moq, created_by, created_at, updated_by, updated_at)
VALUES
  ('식품사업부','과자류','EA','MAT-001','초코파이 12P',1.0,12.0,360.0,432.0,1.200,'(주)오리온',500,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','과자류','EA','MAT-002','포카칩 오리지널',1.0,6.0,180.0,216.0,1.200,'(주)오리온',300,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','과자류','EA','MAT-003','꼬북칩 콘스프',1.0,8.0,240.0,312.0,1.300,'(주)오리온',400,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','빵류','EA','MAT-004','카스타드 6P',1.0,6.0,120.0,150.0,1.250,'(주)롯데제과',600,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','빵류','EA','MAT-005','몽쉘 크림케이크',1.0,12.0,360.0,468.0,1.300,'(주)롯데제과',400,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','음료류','EA','MAT-006','밀키스 250ml',1.0,30.0,900.0,1080.0,1.200,'(주)롯데칠성',1000,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','음료류','EA','MAT-007','칠성사이다 500ml',1.0,24.0,720.0,864.0,1.200,'(주)롯데칠성',800,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','라면류','EA','MAT-008','신라면 멀티팩',1.0,5.0,200.0,260.0,1.300,'(주)농심',1000,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','라면류','EA','MAT-009','짜파게티 멀티팩',1.0,5.0,200.0,250.0,1.250,'(주)농심',800,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','라면류','EA','MAT-010','안성탕면 멀티팩',1.0,5.0,200.0,240.0,1.200,'(주)농심',600,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('생활용품사업부','세제류','EA','MAT-011','퍼실 파워젤 2.7L',1.0,4.0,160.0,208.0,1.300,'한국헨켈',300,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('생활용품사업부','세제류','EA','MAT-012','다우니 섬유유연제 1L',1.0,6.0,180.0,234.0,1.300,'P&G코리아',500,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('생활용품사업부','위생용품','EA','MAT-013','크리넥스 티슈 3겹',1.0,6.0,240.0,288.0,1.200,'유한킴벌리',400,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('생활용품사업부','위생용품','EA','MAT-014','좋은느낌 생리대',1.0,10.0,300.0,360.0,1.200,'유한킴벌리',600,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','유제품','EA','MAT-015','서울우유 1L',1.0,12.0,360.0,432.0,1.200,'서울우유협동조합',1000,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','유제품','EA','MAT-016','매일 바이오 플레인',1.0,10.0,300.0,390.0,1.300,'매일유업',800,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','냉동식품','EA','MAT-017','비비고 왕교자 350g',1.0,8.0,320.0,416.0,1.300,'CJ제일제당',500,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','냉동식품','EA','MAT-018','비비고 한섬만두 400g',1.0,8.0,320.0,384.0,1.200,'CJ제일제당',500,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','조미료','EA','MAT-019','다시다 쇠고기 300g',1.0,10.0,200.0,260.0,1.300,'CJ제일제당',600,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','조미료','EA','MAT-020','해찬들 고추장 1kg',1.0,6.0,180.0,216.0,1.200,'CJ제일제당',400,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('OEM사업부','OEM과자','EA','MAT-021','OEM 비스킷 A',1.0,10.0,300.0,390.0,1.300,'(주)크라운제과',200,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('OEM사업부','OEM음료','EA','MAT-022','OEM 이온음료 B',1.0,24.0,720.0,936.0,1.300,'(주)동아오츠카',300,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('OEM사업부','OEM라면','EA','MAT-023','OEM 컵라면 C',1.0,12.0,360.0,432.0,1.200,'(주)팔도',400,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','과자류','EA','MAT-024','새우깡 오리지널',1.0,8.0,240.0,288.0,1.200,'(주)농심',500,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('식품사업부','과자류','EA','MAT-025','양파링',1.0,6.0,180.0,234.0,1.300,'(주)농심',400,'SYSTEM',NOW(),'SYSTEM',NOW());

-- ────────────────────────────────────────────
-- 2. S&OP 레코드 (MOD_SALES_SNOP_RECORD) - 자재 25개 × 3개월
-- ────────────────────────────────────────────
INSERT INTO mod_sales_snop_record
  (item_code, item_name, category, production_line, plant_code, vendor_name, moq, plan_month,
   sales_plan, sales_actual, production_plan, production_actual, production_remaining,
   beginning_inventory, available_inventory, inventory_unit, target_ending_inventory,
   optimal_inventory_2025, capacity_limit, notes, priority,
   created_by, created_at, updated_by, updated_at)
VALUES
  -- 2026-03 (전월)
  ('MAT-001','초코파이 12P','과자류','LINE-A','P200','(주)오리온',500,'2026-03',12000,11800,12500,12200,300,5000,5400,'EA',5500,5000,15000,'3월 실적',1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-002','포카칩 오리지널','과자류','LINE-A','P200','(주)오리온',300,'2026-03',8000,7500,8500,8200,300,3000,3700,'EA',3500,3000,10000,NULL,2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-003','꼬북칩 콘스프','과자류','LINE-A','P200','(주)오리온',400,'2026-03',6000,6200,6500,6500,0,2500,2800,'EA',2800,2500,8000,NULL,3,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-004','카스타드 6P','빵류','LINE-B','P300','(주)롯데제과',600,'2026-03',9000,8800,9500,9300,200,4000,4500,'EA',4200,4000,12000,NULL,2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-005','몽쉘 크림케이크','빵류','LINE-B','P300','(주)롯데제과',400,'2026-03',5000,5200,5500,5500,0,2000,2300,'EA',2200,2000,7000,NULL,3,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-006','밀키스 250ml','음료류','LINE-C','P200','(주)롯데칠성',1000,'2026-03',20000,19500,21000,20800,200,8000,9300,'EA',9000,8000,25000,NULL,1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-007','칠성사이다 500ml','음료류','LINE-C','P200','(주)롯데칠성',800,'2026-03',15000,14800,15500,15200,300,6000,6400,'EA',6500,6000,18000,NULL,2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-008','신라면 멀티팩','라면류','LINE-D','P400','(주)농심',1000,'2026-03',25000,24500,26000,25800,200,10000,11300,'EA',11000,10000,30000,'인기상품',1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-009','짜파게티 멀티팩','라면류','LINE-D','P400','(주)농심',800,'2026-03',10000,9800,10500,10300,200,4000,4500,'EA',4500,4000,12000,NULL,2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-010','안성탕면 멀티팩','라면류','LINE-D','P400','(주)농심',600,'2026-03',7000,6800,7500,7300,200,3000,3500,'EA',3200,3000,9000,NULL,3,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-015','서울우유 1L','유제품','LINE-E','P500','서울우유협동조합',1000,'2026-03',30000,29500,31000,30500,500,12000,13000,'EA',12500,12000,35000,'냉장배송',1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-017','비비고 왕교자 350g','냉동식품','LINE-F','P300','CJ제일제당',500,'2026-03',15000,14500,15500,15200,300,6000,6700,'EA',6500,6000,18000,NULL,1,'SYSTEM',NOW(),'SYSTEM',NOW()),

  -- 2026-04 (당월)
  ('MAT-001','초코파이 12P','과자류','LINE-A','P200','(주)오리온',500,'2026-04',13000,NULL,13500,NULL,13500,5400,5400,'EA',5800,5000,15000,'4월 계획',1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-002','포카칩 오리지널','과자류','LINE-A','P200','(주)오리온',300,'2026-04',8500,NULL,9000,NULL,9000,3700,3700,'EA',3800,3000,10000,NULL,2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-003','꼬북칩 콘스프','과자류','LINE-A','P200','(주)오리온',400,'2026-04',6500,NULL,7000,NULL,7000,2800,2800,'EA',3000,2500,8000,NULL,3,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-004','카스타드 6P','빵류','LINE-B','P300','(주)롯데제과',600,'2026-04',9500,NULL,10000,NULL,10000,4500,4500,'EA',4500,4000,12000,NULL,2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-005','몽쉘 크림케이크','빵류','LINE-B','P300','(주)롯데제과',400,'2026-04',5500,NULL,6000,NULL,6000,2300,2300,'EA',2500,2000,7000,NULL,3,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-006','밀키스 250ml','음료류','LINE-C','P200','(주)롯데칠성',1000,'2026-04',22000,NULL,23000,NULL,23000,9300,9300,'EA',9500,8000,25000,'여름 성수기',1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-007','칠성사이다 500ml','음료류','LINE-C','P200','(주)롯데칠성',800,'2026-04',16000,NULL,17000,NULL,17000,6400,6400,'EA',7000,6000,18000,'여름 성수기',2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-008','신라면 멀티팩','라면류','LINE-D','P400','(주)농심',1000,'2026-04',24000,NULL,25000,NULL,25000,11300,11300,'EA',12000,10000,30000,NULL,1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-009','짜파게티 멀티팩','라면류','LINE-D','P400','(주)농심',800,'2026-04',10500,NULL,11000,NULL,11000,4500,4500,'EA',4800,4000,12000,NULL,2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-010','안성탕면 멀티팩','라면류','LINE-D','P400','(주)농심',600,'2026-04',7500,NULL,8000,NULL,8000,3500,3500,'EA',3500,3000,9000,NULL,3,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-011','퍼실 파워젤 2.7L','세제류','LINE-G','P500','한국헨켈',300,'2026-04',4000,NULL,4500,NULL,4500,1500,1500,'EA',2000,1500,6000,NULL,3,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-012','다우니 섬유유연제 1L','세제류','LINE-G','P500','P&G코리아',500,'2026-04',6000,NULL,6500,NULL,6500,2500,2500,'EA',3000,2500,8000,NULL,3,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-013','크리넥스 티슈 3겹','위생용품','LINE-G','P500','유한킴벌리',400,'2026-04',8000,NULL,8500,NULL,8500,3500,3500,'EA',4000,3500,10000,NULL,2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-015','서울우유 1L','유제품','LINE-E','P500','서울우유협동조합',1000,'2026-04',32000,NULL,33000,NULL,33000,13000,13000,'EA',13500,12000,35000,'냉장배송',1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-016','매일 바이오 플레인','유제품','LINE-E','P500','매일유업',800,'2026-04',10000,NULL,10500,NULL,10500,4000,4000,'EA',4500,4000,12000,NULL,2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-017','비비고 왕교자 350g','냉동식품','LINE-F','P300','CJ제일제당',500,'2026-04',16000,NULL,17000,NULL,17000,6700,6700,'EA',7000,6000,18000,NULL,1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-018','비비고 한섬만두 400g','냉동식품','LINE-F','P300','CJ제일제당',500,'2026-04',8000,NULL,8500,NULL,8500,3500,3500,'EA',3800,3000,10000,NULL,2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-019','다시다 쇠고기 300g','조미료','LINE-F','P300','CJ제일제당',600,'2026-04',5000,NULL,5500,NULL,5500,2000,2000,'EA',2500,2000,7000,NULL,3,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-020','해찬들 고추장 1kg','조미료','LINE-F','P300','CJ제일제당',400,'2026-04',4000,NULL,4500,NULL,4500,1800,1800,'EA',2000,1800,6000,NULL,3,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-021','OEM 비스킷 A','OEM과자','LINE-H','P400','(주)크라운제과',200,'2026-04',3000,NULL,3500,NULL,3500,1200,1200,'EA',1500,1200,5000,'OEM',4,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-024','새우깡 오리지널','과자류','LINE-A','P200','(주)농심',500,'2026-04',10000,NULL,10500,NULL,10500,4200,4200,'EA',4500,4000,12000,NULL,2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-025','양파링','과자류','LINE-A','P200','(주)농심',400,'2026-04',5000,NULL,5500,NULL,5500,2100,2100,'EA',2300,2000,7000,NULL,3,'SYSTEM',NOW(),'SYSTEM',NOW()),

  -- 2026-05 (익월)
  ('MAT-001','초코파이 12P','과자류','LINE-A','P200','(주)오리온',500,'2026-05',14000,NULL,14500,NULL,14500,5800,5800,'EA',6000,5000,15000,'5월 예측',1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-002','포카칩 오리지널','과자류','LINE-A','P200','(주)오리온',300,'2026-05',9000,NULL,9500,NULL,9500,3800,3800,'EA',4000,3000,10000,NULL,2,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-006','밀키스 250ml','음료류','LINE-C','P200','(주)롯데칠성',1000,'2026-05',25000,NULL,26000,NULL,26000,9500,9500,'EA',10000,8000,25000,'여름 성수기 피크',1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-008','신라면 멀티팩','라면류','LINE-D','P400','(주)농심',1000,'2026-05',23000,NULL,24000,NULL,24000,12000,12000,'EA',12500,10000,30000,NULL,1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-015','서울우유 1L','유제품','LINE-E','P500','서울우유협동조합',1000,'2026-05',33000,NULL,34000,NULL,34000,13500,13500,'EA',14000,12000,35000,NULL,1,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-017','비비고 왕교자 350g','냉동식품','LINE-F','P300','CJ제일제당',500,'2026-05',17000,NULL,18000,NULL,18000,7000,7000,'EA',7500,6000,18000,NULL,1,'SYSTEM',NOW(),'SYSTEM',NOW());

-- ────────────────────────────────────────────
-- 3. 라인 CAPA 계획 (MOD_SALES_LINE_CAPA_PLAN)
-- ────────────────────────────────────────────
INSERT INTO mod_sales_line_capa_plan
  (line_category, production_line, plan_month, daily_capa, daily_operating_hours, planned_operating_days, computed_capa, note, created_by, created_at, updated_by, updated_at)
VALUES
  ('과자','LINE-A','2026-04',2500,16,25,1000000.00,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('과자','LINE-A','2026-05',2500,16,26,1040000.00,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('빵','LINE-B','2026-04',1800,16,25,720000.00,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('빵','LINE-B','2026-05',1800,16,26,748800.00,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('음료','LINE-C','2026-04',5000,20,25,2500000.00,'24시간 가동 가능','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('음료','LINE-C','2026-05',5000,20,26,2600000.00,'성수기 풀가동','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('라면','LINE-D','2026-04',3000,16,25,1200000.00,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('라면','LINE-D','2026-05',3000,16,26,1248000.00,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('유제품','LINE-E','2026-04',4000,20,25,2000000.00,'냉장라인','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('유제품','LINE-E','2026-05',4000,20,26,2080000.00,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('냉동/조미료','LINE-F','2026-04',2000,16,25,800000.00,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('냉동/조미료','LINE-F','2026-05',2000,16,26,832000.00,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('생활용품','LINE-G','2026-04',1500,12,25,450000.00,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('OEM','LINE-H','2026-04',1000,12,20,240000.00,'OEM 전용','SYSTEM',NOW(),'SYSTEM',NOW());

-- ────────────────────────────────────────────
-- 4. 라인별 아이템 마스터 (MOD_SALES_LINE_ITEM_MASTER)
-- ────────────────────────────────────────────
INSERT INTO mod_sales_line_item_master
  (item_code, production_line, hourly_throughput, created_by, created_at, updated_by, updated_at)
VALUES
  ('MAT-001','LINE-A',500,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-002','LINE-A',400,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-003','LINE-A',450,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-024','LINE-A',420,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-025','LINE-A',380,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-004','LINE-B',350,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-005','LINE-B',300,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-006','LINE-C',1200,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-007','LINE-C',1000,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-008','LINE-D',800,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-009','LINE-D',700,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-010','LINE-D',650,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-015','LINE-E',1500,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-016','LINE-E',1000,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-017','LINE-F',600,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-018','LINE-F',550,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-019','LINE-F',500,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-020','LINE-F',480,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-011','LINE-G',300,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-012','LINE-G',350,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-013','LINE-G',400,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-021','LINE-H',250,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-022','LINE-H',600,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('MAT-023','LINE-H',350,'SYSTEM',NOW(),'SYSTEM',NOW());

-- ────────────────────────────────────────────
-- 5. 자재연계 (MOD_SALES_MATERIAL_LINKAGE)
-- ────────────────────────────────────────────
INSERT INTO mod_sales_material_linkage
  (legacy_item_code, legacy_item_name, renewal_item_code, renewal_item_name, effective_month, note, created_by, created_at, updated_by, updated_at)
VALUES
  ('OLD-001','초코파이 구형','MAT-001','초코파이 12P','2026-01','패키지 리뉴얼','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('OLD-002','포카칩 구형','MAT-002','포카칩 오리지널','2026-01','패키지 리뉴얼','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('OLD-008','신라면 구형','MAT-008','신라면 멀티팩','2025-12','멀티팩 전환','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('OLD-015','서울우유 구형','MAT-015','서울우유 1L','2026-02','용량 변경','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('OLD-017','왕교자 구형','MAT-017','비비고 왕교자 350g','2026-03','브랜드 변경','SYSTEM',NOW(),'SYSTEM',NOW());

-- ────────────────────────────────────────────
-- 6. 판매채널 (MOD_SALES_CHANNEL)
-- ────────────────────────────────────────────
INSERT INTO mod_sales_channel
  (channel_key, channel_name, description, created_by, created_at, updated_by, updated_at)
VALUES
  ('MART','대형마트','이마트, 홈플러스, 롯데마트 등','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('CVS','편의점','GS25, CU, 세븐일레븐, 이마트24','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('ONLINE','온라인','쿠팡, 네이버, 자사몰 등','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('SSM','기업형슈퍼','GS더프레시, 홈플러스익스프레스 등','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('WHOLESALE','도매','도매시장, B2B 거래처','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('EXPORT','수출','해외 수출 채널','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('OEM','OEM','OEM/PB 전용 채널','SYSTEM',NOW(),'SYSTEM',NOW());

-- ────────────────────────────────────────────
-- 7. 최적재고기준 (MOD_SALES_OPTIMAL_INVENTORY_BASELINE)
-- ────────────────────────────────────────────
INSERT INTO mod_sales_optimal_inventory_baseline
  (base_year, category, optimal_quantity, notes, created_by, created_at, updated_by, updated_at)
VALUES
  ('2026','과자류',5000,'월평균 판매량 15일분','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026','빵류',4000,'유통기한 고려 10일분','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026','음료류',8000,'성수기(여름) 20일분 기준','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026','라면류',10000,'비상식량 수요 포함','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026','유제품',12000,'냉장 보관 한계 고려','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026','냉동식품',6000,'냉동 보관 15일분','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026','세제류',2000,'비식품 30일분','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026','위생용품',3500,'비식품 30일분','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026','조미료',2000,'장기보관 가능 30일분','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2025','과자류',4500,'전년도 기준','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2025','음료류',7000,'전년도 기준','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2025','라면류',9000,'전년도 기준','SYSTEM',NOW(),'SYSTEM',NOW());

-- ────────────────────────────────────────────
-- 8. 최근 판매 평균 (MOD_SALES_RECENT_SALES_AVERAGE)
-- ────────────────────────────────────────────
INSERT INTO mod_sales_recent_sales_average
  (base_month, item_code, m3, m2, m1, total, average, note, created_by, created_at, updated_by, updated_at)
VALUES
  ('2026-04','MAT-001',11500,11800,12000,35300,11767,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026-04','MAT-002',7200,7500,7800,22500,7500,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026-04','MAT-003',5800,6000,6200,18000,6000,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026-04','MAT-006',18000,19500,20000,57500,19167,'여름 상승 추세','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026-04','MAT-007',13500,14800,15000,43300,14433,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026-04','MAT-008',23000,24500,25000,72500,24167,'스테디셀러','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026-04','MAT-015',28000,29500,30000,87500,29167,'우유 안정적','SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026-04','MAT-017',13500,14500,15000,43000,14333,NULL,'SYSTEM',NOW(),'SYSTEM',NOW()),
  ('2026-04','MAT-024',9000,9500,10000,28500,9500,NULL,'SYSTEM',NOW(),'SYSTEM',NOW());

-- ────────────────────────────────────────────
-- 9. 판매계획 업로드 (MOD_SALES_PLAN_UPLOAD) - 주요 품목 채널별
-- ────────────────────────────────────────────
INSERT INTO mod_sales_plan_upload
  (plan_month, item_code, channel, standard_quantity, promotion_quantity, quantity, note, created_by, created_at, updated_by, updated_at)
VALUES
  ('2026-04','MAT-001','MART',5000,1000,6000,NULL,'planner',NOW(),'planner',NOW()),
  ('2026-04','MAT-001','CVS',3000,500,3500,NULL,'planner',NOW(),'planner',NOW()),
  ('2026-04','MAT-001','ONLINE',2500,1000,3500,'쿠팡 프로모션','planner',NOW(),'planner',NOW()),
  ('2026-04','MAT-008','MART',10000,2000,12000,NULL,'planner',NOW(),'planner',NOW()),
  ('2026-04','MAT-008','CVS',5000,1000,6000,NULL,'planner',NOW(),'planner',NOW()),
  ('2026-04','MAT-008','ONLINE',4000,2000,6000,'온라인 할인전','planner',NOW(),'planner',NOW()),
  ('2026-04','MAT-006','MART',8000,2000,10000,NULL,'planner',NOW(),'planner',NOW()),
  ('2026-04','MAT-006','CVS',6000,1000,7000,NULL,'planner',NOW(),'planner',NOW()),
  ('2026-04','MAT-006','ONLINE',4000,1000,5000,NULL,'planner',NOW(),'planner',NOW()),
  ('2026-04','MAT-015','MART',15000,2000,17000,'우유 할인행사','planner',NOW(),'planner',NOW()),
  ('2026-04','MAT-015','CVS',5000,0,5000,NULL,'planner',NOW(),'planner',NOW()),
  ('2026-04','MAT-015','ONLINE',8000,2000,10000,NULL,'planner',NOW(),'planner',NOW()),
  ('2026-05','MAT-001','MART',5500,1500,7000,'5월 프로모션','planner',NOW(),'planner',NOW()),
  ('2026-05','MAT-006','MART',10000,3000,13000,'여름 성수기','planner',NOW(),'planner',NOW()),
  ('2026-05','MAT-008','MART',9000,2000,11000,NULL,'planner',NOW(),'planner',NOW());

-- ────────────────────────────────────────────
-- 10. 인터페이스 실행관리 (MOD_INTERFACE_EXECUTION) - 스케줄 설정
-- ────────────────────────────────────────────
INSERT INTO mod_interface_execution
  (interface_id, interface_name, schedule_type, execution_time, interval_minutes, cron_expression, is_active, next_execution_at, description, created_by, created_at, updated_by, updated_at)
VALUES
  ('SNOP_RFC_001','자재마스터 동기화','DAILY','06:00',NULL,NULL,1,'2026-04-13 06:00:00','매일 06시 자재마스터 동기화','admin',NOW(),'admin',NOW()),
  ('SNOP_RFC_002','일자별재고 동기화','DAILY','07:00',NULL,NULL,1,'2026-04-13 07:00:00','매일 07시 재고 동기화','admin',NOW(),'admin',NOW()),
  ('SNOP_RFC_003','생산실적 동기화','HOURLY',NULL,60,NULL,1,'2026-04-12 09:00:00','1시간 간격 생산실적 수집','admin',NOW(),'admin',NOW()),
  ('SNOP_RFC_004','판매실적 동기화','HOURLY',NULL,60,NULL,1,'2026-04-12 09:00:00','1시간 간격 판매실적 수집','admin',NOW(),'admin',NOW()),
  ('SNOP_RFC_006','리뉴얼자재연결 동기화','DAILY','06:30',NULL,NULL,1,'2026-04-17 06:30:00','매일 06:30 리뉴얼자재연결 동기화','admin',NOW(),'admin',NOW());

-- ────────────────────────────────────────────
-- 11. 인터페이스 마스터 관리 (MOD_INTERFACE_MASTER) - SNOP_RFC_006 추가
-- ────────────────────────────────────────────
INSERT INTO mod_interface_master
  (interface_id, interface_name, sender, receiver, rfc_url, rfc_param, exec_command, created_by, created_at, updated_by, updated_at)
VALUES
  ('SNOP_RFC_006','리뉴얼자재연결','SAP','S&OP','/api/rfc/SNOP_RFC_006','{"param":"A"}','/home/user/webapp/scripts/rfc/run_rfc_006.sh','admin',NOW(),'admin',NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ────────────────────────────────────────────
-- 완료
-- ────────────────────────────────────────────
SELECT '샘플 데이터 등록 완료' AS result;
