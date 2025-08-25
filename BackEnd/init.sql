-- Black Market 데이터베이스 초기화 스크립트
-- 이 스크립트는 PostgreSQL 컨테이너 시작 시 자동으로 실행됩니다.

-- 데이터베이스가 존재하지 않으면 생성
SELECT 'CREATE DATABASE blackmarket'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'blackmarket')\gexec

-- 사용자 권한 설정
GRANT ALL PRIVILEGES ON DATABASE blackmarket TO blackmarket_user;

-- 확장 프로그램 설치 (필요한 경우)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 초기 데이터 삽입 (선택사항)
-- 예시 도전과제 데이터
-- INSERT INTO achievements (achievement_id, name, description, icon_url) VALUES
-- (1, '첫 거래', '첫 번째 거래를 완료했습니다', '/icons/first-trade.png'),
-- (2, '거래왕', '10번의 거래를 완료했습니다', '/icons/trade-master.png'),
-- (3, '포인트 부자', '10000 포인트를 보유했습니다', '/icons/rich.png')
-- ON CONFLICT (achievement_id) DO NOTHING;