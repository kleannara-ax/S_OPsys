# SAP JCo 라이브러리 설치 안내

이 폴더에 SAP JCo 라이브러리 파일을 넣어주세요.

## 필요 파일 (Linux 서버)

| 파일 | 용도 |
|------|------|
| `sapjco3.jar` | Java 라이브러리 (필수) |
| `libsapjco3.so` | Linux 네이티브 라이브러리 (필수) |

## 설치 방법

```bash
# 1. 이 폴더에 파일 복사
cp /다운로드경로/sapjco3.jar ./module-sales/libs/
cp /다운로드경로/libsapjco3.so ./module-sales/libs/

# 2. 네이티브 라이브러리 경로 설정 (서버 실행 시)
export LD_LIBRARY_PATH=/프로젝트경로/module-sales/libs:$LD_LIBRARY_PATH

# 3. 앱 실행
java -Djava.library.path=./module-sales/libs -jar app.jar
```

## 버전 정보
- SAP JCo 3.0.6 이상 권장
- SAP Marketplace에서 다운로드 (라이선스 필요)
