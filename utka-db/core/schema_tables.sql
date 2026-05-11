-- Таблицы для схем ref / status / core (PostgreSQL).
-- Перед выполнением создайте схемы: utka-db/core/create_database.sql

SET search_path TO public;

-- ========= ref: справочники =========

CREATE TABLE ref.currency
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code        VARCHAR(3) NOT NULL UNIQUE,
    name        VARCHAR    NOT NULL,
    description VARCHAR    NOT NULL,
    is_active   BOOLEAN    NOT NULL
);

CREATE TABLE ref.expense_category
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code        VARCHAR NOT NULL UNIQUE,
    name        VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    is_active   BOOLEAN NOT NULL
);

CREATE TABLE ref.payment_channel
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code        VARCHAR NOT NULL UNIQUE,
    name        VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    is_active   BOOLEAN NOT NULL
);

-- ========= status: статусы по основным сущностям =========

CREATE TABLE status.user_status
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code        VARCHAR NOT NULL UNIQUE,
    name        VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    is_active   BOOLEAN NOT NULL
);

CREATE TABLE status.account_status
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code        VARCHAR NOT NULL UNIQUE,
    name        VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    is_active   BOOLEAN NOT NULL
);

CREATE TABLE status.wallet_status
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code        VARCHAR NOT NULL UNIQUE,
    name        VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    is_active   BOOLEAN NOT NULL
);

CREATE TABLE status.transaction_status
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code        VARCHAR NOT NULL UNIQUE,
    name        VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    is_active   BOOLEAN NOT NULL
);

-- ========= core: основные таблицы =========

CREATE TABLE core."user"
(
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username     VARCHAR   NOT NULL UNIQUE,
    password     VARCHAR   NOT NULL,
    email        VARCHAR UNIQUE,
    display_name VARCHAR,
    role         VARCHAR(16) NOT NULL DEFAULT 'USER',
    status_id    BIGINT    NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT fk_user_user_status FOREIGN KEY (status_id) REFERENCES status.user_status (id)
);

CREATE TABLE core.accountEntity
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    amount      NUMERIC(20, 4),
    currency_id BIGINT NOT NULL,
    status_id   BIGINT NOT NULL,
    CONSTRAINT fk_account_user FOREIGN KEY (user_id) REFERENCES core."user" (id) ON DELETE RESTRICT,
    CONSTRAINT fk_account_currency FOREIGN KEY (currency_id) REFERENCES ref.currency (id),
    CONSTRAINT fk_account_account_status FOREIGN KEY (status_id) REFERENCES status.account_status (id)
);

CREATE TABLE core.walletEntity
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id  BIGINT NOT NULL,
    amount      NUMERIC(20, 4),
    status_id   BIGINT NOT NULL,
    CONSTRAINT fk_wallet_account FOREIGN KEY (account_id) REFERENCES core.accountEntity (id) ON DELETE RESTRICT,
    CONSTRAINT fk_wallet_wallet_status FOREIGN KEY (status_id) REFERENCES status.wallet_status (id)
);

CREATE TABLE core."transaction"
(
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    wallet_id       BIGINT         NOT NULL,
    sum             NUMERIC(20, 4) NOT NULL,
    current_balance NUMERIC(20, 4) NOT NULL,
    description     VARCHAR(255),
    processed_at    TIMESTAMP      NOT NULL DEFAULT now(),
    status_id       BIGINT         NOT NULL,
    CONSTRAINT fk_transaction_wallet FOREIGN KEY (wallet_id) REFERENCES core.walletEntity (id) ON DELETE RESTRICT,
    CONSTRAINT fk_transaction_transaction_status FOREIGN KEY (status_id) REFERENCES status.transaction_status (id)
);
