-- Пример начальных данных — выполняйте после создания таблиц (порядок важен из‑за FK).

INSERT INTO status.user_status (code, name, sort_order, is_terminal) VALUES
    ('active', 'Активен', 10, false),
    ('blocked', 'Заблокирован', 20, false),
    ('deleted', 'Удалён', 30, true);

INSERT INTO status.wallet_status (code, name, sort_order, is_terminal) VALUES
    ('active', 'Активен', 10, false),
    ('closed', 'Закрыт', 20, true);

INSERT INTO status.transaction_status (code, name, sort_order, is_terminal) VALUES
    ('draft', 'Черновик', 10, false),
    ('posted', 'Учтена', 20, false),
    ('cancelled', 'Отменена', 30, true);

INSERT INTO ref.currency (code, name, description, is_active) VALUES
    ('RUB', 'Российский рубль', 'Основная валюта по умолчанию', true),
    ('USD', 'Доллар США', 'Иностранная валюта', true);

INSERT INTO ref.payment_channel (code, name, sort_order) VALUES
    ('card', 'Карта', 10),
    ('cash', 'Наличные', 20),
    ('online', 'Онлайн', 30);

INSERT INTO ref.expense_category (code, name, sort_order) VALUES
    ('food', 'Еда', 10),
    ('impulse', 'Импульсивные траты', 20),
    ('other', 'Прочее', 99);
