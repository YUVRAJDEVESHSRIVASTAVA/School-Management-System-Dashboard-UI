-- School Management System – PostgreSQL Schema
-- Hibernate ddl-auto=update will create/alter these automatically.
-- Run this manually if you need to reset the DB.

CREATE TABLE IF NOT EXISTS students (
    id               BIGSERIAL PRIMARY KEY,
    roll_number      VARCHAR(50)  UNIQUE NOT NULL,
    name             VARCHAR(100) NOT NULL,
    date_of_birth    DATE,
    student_class    VARCHAR(10)  NOT NULL,
    section          VARCHAR(5)   NOT NULL,
    email            VARCHAR(100),
    phone            VARCHAR(20),
    admission_date   DATE
);

CREATE TABLE IF NOT EXISTS teachers (
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    email          VARCHAR(100) UNIQUE,
    phone          VARCHAR(20),
    subject        VARCHAR(100),
    qualification  VARCHAR(100),
    joining_date   DATE
);

CREATE TABLE IF NOT EXISTS marks (
    id              BIGSERIAL PRIMARY KEY,
    student_id      BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject         VARCHAR(100) NOT NULL,
    marks_obtained  INT DEFAULT 0,
    total_marks     INT DEFAULT 100,
    exam_type       VARCHAR(50),
    exam_date       DATE
);

CREATE TABLE IF NOT EXISTS attendance (
    id          BIGSERIAL PRIMARY KEY,
    student_id  BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date        DATE   NOT NULL,
    status      VARCHAR(10) NOT NULL CHECK (status IN ('PRESENT','ABSENT','LATE'))
);

CREATE TABLE IF NOT EXISTS results (
    id                    BIGSERIAL PRIMARY KEY,
    student_id            BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    exam_type             VARCHAR(50),
    total_marks_obtained  INT DEFAULT 0,
    total_marks           INT DEFAULT 100,
    percentage            NUMERIC(5,2),
    grade                 VARCHAR(5),
    result_date           DATE
);