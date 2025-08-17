# Black Market DB Schema

## 1. `Users` (사용자)
사용자 계정 정보를 저장합니다.

| Column Name         | Data Type      | Constraints                 | Description                            |
| ------------------- | -------------- | --------------------------- | -------------------------------------- |
| `user_id`           | INT or UUID    | **Primary Key**, Auto-increment | 사용자의 고유 식별자                   |
| `username`          | VARCHAR(50)    | **Unique**, Not Null        | 사용자 닉네임                          |
| `email`             | VARCHAR(255)   | **Unique**, Not Null        | 로그인 및 연락에 사용하는 이메일       |
| `password_hash`     | VARCHAR(255)   | Not Null                    | 해시 처리된 사용자 비밀번호            |
| `profile_image_url` | VARCHAR(255)   | Nullable                    | 프로필 이미지 URL                      |
| `points_balance`    | DECIMAL(15, 2) | Not Null, Default: 0        | 사용자가 보유한 포인트/재화            |
| `created_at`        | TIMESTAMP      | Default: CURRENT_TIMESTAMP  | 계정 생성 시각                         |
| `last_login_at`     | TIMESTAMP      | Nullable                    | 마지막 로그인 시각                     |

---

## 2. `Listings` (판매 게시물)
사용자가 판매하고자 하는 아이템을 등록하는 게시물입니다.

| Column Name      | Data Type      | Constraints                | Description                            |
| ---------------- | -------------- | -------------------------- | -------------------------------------- |
| `listing_id`     | INT or UUID    | **Primary Key**, Auto-increment | 판매 게시물의 고유 식별자              |
| `seller_id`      | INT or UUID    | **Foreign Key (Users)**    | 판매자 ID                              |
| `item_name`      | VARCHAR(100)   | Not Null                   | 판매 아이템 이름 (예: "게임 포인트")   |
| `item_description`| TEXT           | Nullable                   | 아이템 상세 설명                       |
| `quantity`       | INT            | Not Null                   | 판매 수량                              |
| `price_per_unit` | DECIMAL(15, 2) | Not Null                   | 단위당 가격                            |
| `status`         | VARCHAR(20)    | Not Null, Default: 'active'| 상태 ('active', 'sold', 'cancelled')   |
| `created_at`     | TIMESTAMP      | Default: CURRENT_TIMESTAMP | 게시물 등록 시각                       |
| `expires_at`     | TIMESTAMP      | Nullable                   | 게시물 만료 시각                       |

---

## 3. `Trades` (거래 내역)
구매자와 판매자 간의 실제 거래가 성사되었을 때의 기록입니다.

| Column Name   | Data Type      | Constraints                | Description                      |
| ------------- | -------------- | -------------------------- | -------------------------------- |
| `trade_id`    | INT or UUID    | **Primary Key**, Auto-increment | 거래의 고유 식별자               |
| `listing_id`  | INT or UUID    | **Foreign Key (Listings)** | 원본 판매 게시물 ID              |
| `buyer_id`    | INT or UUID    | **Foreign Key (Users)**    | 구매자 ID                        |
| `seller_id`   | INT or UUID    | **Foreign Key (Users)**    | 판매자 ID                        |
| `quantity`    | INT            | Not Null                   | 거래된 수량                      |
| `total_price` | DECIMAL(15, 2) | Not Null                   | 총 거래 금액                     |
| `traded_at`   | TIMESTAMP      | Default: CURRENT_TIMESTAMP | 거래 성사 시각                   |

---

## 4. `Chat_Rooms` (채팅방)
사용자 간의 1:1 또는 그룹 채팅방 정보를 관리합니다.

| Column Name   | Data Type   | Constraints                | Description                      |
| ------------- | ----------- | -------------------------- | -------------------------------- |
| `room_id`     | INT or UUID | **Primary Key**, Auto-increment | 채팅방의 고유 식별자             |
| `created_at`  | TIMESTAMP   | Default: CURRENT_TIMESTAMP | 채팅방 생성 시각                 |

## 5. `Chat_Participants` (채팅방 참여자)
어떤 사용자가 어떤 채팅방에 참여하는지 연결하는 테이블입니다.

| Column Name | Data Type   | Constraints                          | Description          |
| ----------- | ----------- | ------------------------------------ | -------------------- |
| `room_id`   | INT or UUID | **Foreign Key (Chat_Rooms)**, **Primary Key** | 채팅방 ID            |
| `user_id`   | INT or UUID | **Foreign Key (Users)**, **Primary Key**      | 참여자 ID            |

## 6. `Chat_Messages` (채팅 메시지)
채팅방에서 주고받은 메시지를 저장합니다.

| Column Name  | Data Type   | Constraints                | Description                      |
| ------------ | ----------- | -------------------------- | -------------------------------- |
| `message_id` | INT or UUID | **Primary Key**, Auto-increment | 메시지의 고유 식별자             |
| `room_id`    | INT or UUID | **Foreign Key (Chat_Rooms)** | 메시지가 속한 채팅방 ID          |
| `sender_id`  | INT or UUID | **Foreign Key (Users)**    | 메시지를 보낸 사용자 ID          |
| `content`    | TEXT        | Not Null                   | 메시지 내용                      |
| `sent_at`    | TIMESTAMP   | Default: CURRENT_TIMESTAMP | 메시지 전송 시각                 |
| `is_read`    | BOOLEAN     | Not Null, Default: false   | 상대방의 읽음 여부               |

---

## 7. `Achievements` (도전과제)
달성 가능한 모든 도전과제의 목록입니다.

| Column Name     | Data Type    | Constraints        | Description          |
| --------------- | ------------ | ------------------ | -------------------- |
| `achievement_id`| INT          | **Primary Key**    | 도전과제 고유 식별자 |
| `name`          | VARCHAR(100) | Not Null           | 도전과제 이름        |
| `description`   | TEXT         | Not Null           | 도전과제 설명        |
| `icon_url`      | VARCHAR(255) | Nullable           | 도전과제 아이콘 URL  |

## 8. `User_Achievements` (사용자별 도전과제 달성)
사용자가 어떤 도전과제를 언제 달성했는지 기록합니다.

| Column Name   | Data Type   | Constraints                          | Description          |
| ------------- | ----------- | ------------------------------------ | -------------------- |
| `user_id`     | INT or UUID | **Foreign Key (Users)**, **Primary Key**      | 사용자 ID            |
| `achievement_id`| INT       | **Foreign Key (Achievements)**, **Primary Key** | 달성한 도전과제 ID   |
| `earned_at`   | TIMESTAMP   | Default: CURRENT_TIMESTAMP           | 달성 시각            |
