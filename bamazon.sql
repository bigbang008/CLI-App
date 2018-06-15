DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT auto_increment NOT NULL,-- (unique id for each product)
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
    price DECIMAL (10,2) NOT NULL,
	stock_quantity int,
    primary key (item_id)
);

ALTER TABLE products AUTO_INCREMENT = 100;