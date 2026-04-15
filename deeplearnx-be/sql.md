# DeepLearnX — Database Schema

> Database: **PostgreSQL**

```sql
-- ============================================================
-- users
-- ============================================================
CREATE TABLE users (
    id                    BIGSERIAL    PRIMARY KEY,
    email                 VARCHAR(255) NOT NULL UNIQUE,
    password              VARCHAR(255) NOT NULL,
    username              VARCHAR(255) NOT NULL UNIQUE,
    full_name             VARCHAR(255),
    roles                 TEXT[],
    status                VARCHAR(50)  NOT NULL,            -- ACTIVE | LOCKED
    failed_login_attempts INT          NOT NULL DEFAULT 0,
    created_at            TIMESTAMP,
    updated_at            TIMESTAMP,
    created_by            VARCHAR(100),
    updated_by            VARCHAR(100)
);

-- ============================================================
-- user_approves
-- Lưu các yêu cầu tạo / cập nhật / xoá / khoá / mở khoá / đăng ký user,
-- chờ được duyệt trước khi apply vào bảng users.
-- Khi query, JOIN với users để lấy username, email, full_name, roles.
-- ============================================================
CREATE TABLE user_approves (
    id         BIGSERIAL   PRIMARY KEY,
    user_id    BIGINT,                          -- NULL khi action = CREATE
    action     VARCHAR(50)  NOT NULL,           -- REGISTER | CREATE | UPDATE | DELETE | LOCK | UNLOCK
    status     VARCHAR(50)  NOT NULL,           -- APPROVING | APPROVED | REJECTED
    payload    TEXT,                            -- JSON payload (dùng cho REGISTER / CREATE / UPDATE)
    username   VARCHAR(255),                    -- snapshot tại thời điểm tạo request
    email      VARCHAR(255),
    full_name  VARCHAR(255),
    roles      TEXT[],
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT fk_user_approves_user FOREIGN KEY (user_id) REFERENCES users (id)
);

-- ============================================================
-- courses
-- ============================================================
CREATE TABLE courses (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(255),
    slug        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    user_id     BIGINT       NOT NULL,
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP,
    created_by  VARCHAR(100),
    updated_by  VARCHAR(100),
    CONSTRAINT fk_courses_user FOREIGN KEY (user_id) REFERENCES users (id)
);

-- ============================================================
-- lessons
-- ============================================================
CREATE TABLE lessons (
    id        BIGSERIAL    PRIMARY KEY,
    title     VARCHAR(255),
    slug      VARCHAR(255),
    video_url VARCHAR(255),
    position  INT,
    course_id BIGINT NOT NULL,
    CONSTRAINT fk_lessons_course    FOREIGN KEY (course_id) REFERENCES courses (id),
    CONSTRAINT uq_lessons_course_slug UNIQUE (course_id, slug)
);

-- ============================================================
-- schedules
-- ============================================================
CREATE TABLE schedules (
    id           BIGSERIAL    PRIMARY KEY,
    user_id      BIGINT       NOT NULL,
    title        VARCHAR(255) NOT NULL,
    content      TEXT,
    scheduled_at TIMESTAMP    NOT NULL,
    status       VARCHAR(50)  NOT NULL,          -- PENDING | COMPLETED | CANCELLED
    created_at   TIMESTAMP,
    updated_at   TIMESTAMP,
    created_by   VARCHAR(100),
    updated_by   VARCHAR(100),
    CONSTRAINT fk_schedules_user FOREIGN KEY (user_id) REFERENCES users (id)
);
```
