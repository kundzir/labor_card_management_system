-- Labor Card Management System Database Schema
-- Based on Python code structure for MySQL implementation

CREATE DATABASE IF NOT EXISTS labor_card_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE labor_card_db;

-- Production Areas Table
CREATE TABLE production_area (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Work Types Table
CREATE TABLE wp_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    production_area_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (production_area_id) REFERENCES production_area(id) ON DELETE CASCADE,
    UNIQUE KEY uk_wp_type_area_code (production_area_id, code)
);

-- Work Sub-types Table
CREATE TABLE wp_sub_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wp_type_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wp_type_id) REFERENCES wp_type(id) ON DELETE CASCADE,
    UNIQUE KEY uk_wp_sub_type_code (wp_type_id, code)
);

-- Scrap Types Table
CREATE TABLE scrap_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order Information Table
CREATE TABLE order_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    item_number VARCHAR(50) NOT NULL,
    item_description TEXT,
    quantity_planned INT DEFAULT 0,
    quantity_completed INT DEFAULT 0,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_number (order_number),
    INDEX idx_item_number (item_number)
);

-- Workers Personal Information Table
CREATE TABLE workers_personal_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    personal_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    position VARCHAR(100),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_personal_id (personal_id)
);

-- Work Card Production Data Table
CREATE TABLE work_card_data_prod (
    id INT AUTO_INCREMENT PRIMARY KEY,
    worker_id INT NOT NULL,
    production_area_id INT NOT NULL,
    wp_type_id INT NOT NULL,
    wp_sub_type_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    item_number VARCHAR(50) NOT NULL,
    shift INT NOT NULL CHECK (shift IN (1, 2, 3)),
    start_time TIMESTAMP NOT NULL,
    finish_time TIMESTAMP NULL,
    good_parts INT DEFAULT 0,
    scrap_parts INT DEFAULT 0,
    material_usage DECIMAL(10, 3) DEFAULT 0,
    strips_rolls INT DEFAULT 0,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers_personal_info(id) ON DELETE CASCADE,
    FOREIGN KEY (production_area_id) REFERENCES production_area(id) ON DELETE CASCADE,
    FOREIGN KEY (wp_type_id) REFERENCES wp_type(id) ON DELETE CASCADE,
    FOREIGN KEY (wp_sub_type_id) REFERENCES wp_sub_type(id) ON DELETE CASCADE,
    FOREIGN KEY (order_number) REFERENCES order_info(order_number) ON DELETE CASCADE,
    INDEX idx_worker_shift_date (worker_id, shift, DATE(start_time)),
    INDEX idx_order_item (order_number, item_number),
    INDEX idx_production_area_date (production_area_id, DATE(start_time))
);

-- Work Card Quality Data Table
CREATE TABLE work_card_data_quality (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_card_prod_id INT NOT NULL,
    scrap_type_id INT NOT NULL,
    scrap_quantity INT NOT NULL DEFAULT 0,
    scrap_reason TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registered_by INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (work_card_prod_id) REFERENCES work_card_data_prod(id) ON DELETE CASCADE,
    FOREIGN KEY (scrap_type_id) REFERENCES scrap_type(id) ON DELETE CASCADE,
    FOREIGN KEY (registered_by) REFERENCES workers_personal_info(id) ON DELETE CASCADE,
    INDEX idx_work_card_prod (work_card_prod_id),
    INDEX idx_scrap_type_date (scrap_type_id, DATE(registered_at))
);

-- Insert sample data for testing
INSERT INTO production_area (name, code, description) VALUES
('Лінія виробництва А', 'PROD_A', 'Основна лінія виробництва деталей'),
('Лінія виробництва Б', 'PROD_B', 'Додаткова лінія виробництва'),
('Контроль якості', 'QC', 'Відділ контролю якості продукції'),
('Упакування', 'PACK', 'Дільниця упакування готової продукції');

INSERT INTO wp_type (production_area_id, name, code, description) VALUES
(1, 'Формування', '26', 'Формування заготовок'),
(1, 'Обробка', '29', 'Механічна обробка деталей'),
(2, 'Зварювання', '30', 'Зварювальні роботи'),
(3, 'Контроль', '40', 'Контроль якості продукції'),
(4, 'Упакування', '50', 'Упакування готових виробів');

INSERT INTO wp_sub_type (wp_type_id, name, code, description) VALUES
(1, 'Формування А', '26A', 'Формування деталей типу А'),
(1, 'Формування Б', '26B', 'Формування деталей типу Б'),
(2, 'Обробка фрезерна', '29F', 'Фрезерна обробка'),
(2, 'Обробка токарна', '29T', 'Токарна обробка'),
(3, 'Зварювання аргон', '30A', 'Аргонне зварювання'),
(4, 'Вихідний контроль', '40O', 'Контроль готової продукції'),
(5, 'Первинне упакування', '50P', 'Упакування у первинну тару');

INSERT INTO scrap_type (name, code, description) VALUES
('Дефект форми', 'FORM_DEF', 'Неправильна форма деталі'),
('Розмірний брак', 'SIZE_DEF', 'Невідповідність розмірів'),
('Поверхневий дефект', 'SURF_DEF', 'Дефекти поверхні'),
('Матеріальний брак', 'MAT_DEF', 'Дефекти матеріалу'),
('Інший брак', 'OTHER', 'Інші види браку');

INSERT INTO order_info (order_number, item_number, item_description, quantity_planned) VALUES
('ORD-2024-001', 'ITEM-A001', 'Деталь корпусу А', 100),
('ORD-2024-002', 'ITEM-B002', 'Кріпильний елемент Б', 500),
('ORD-2024-003', 'ITEM-C003', 'Опорний елемент С', 250),
('ORD-2024-004', 'ITEM-D004', 'З\'єднувальна муфта Д', 75);

INSERT INTO workers_personal_info (personal_id, first_name, last_name, middle_name, position, department) VALUES
('123456', 'Іван', 'Петренко', 'Олександрович', 'Оператор верстата', 'Виробництво'),
('234567', 'Марія', 'Коваленко', 'Іванівна', 'Контролер якості', 'Контроль якості'),
('345678', 'Петро', 'Сидоренко', 'Васильович', 'Зварювальник', 'Виробництво'),
('456789', 'Олена', 'Мельниченко', 'Петрівна', 'Пакувальник', 'Упакування');