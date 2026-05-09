-- Ядро БД: создание схем перед таблицами.
-- Полный DDL таблиц лежит в корне репозитория: sql/schema_tables.sql
-- Пример сидов: sql/fill_refs_and_statuses.sql

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS status;
CREATE SCHEMA IF NOT EXISTS ref;
