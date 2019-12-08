DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product VARCHAR(100) NOT NULL,
  department VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE cart(
  id INT NOT NULL AUTO_INCREMENT,
  product VARCHAR(100) DEFAULT "",
  price DECIMAL(10,2) DEFAULT 0,
  quantity INT DEFAULT 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product, department, price, stock)
VALUES ('72" Flat Screen TV', "Electronics", 600.00, 6), ("VR Headset", "Electronics", 400.00, 9), ("Wireless Bluetooth Earbuds", "Electronics", 200.00, 12);

INSERT INTO products (product, department, price, stock)
VALUES ("Cordless Power Drill", "Hardware", 100.00, 8), ("Ratchet Set", "Hardware", 50.00, 12), ("Table Saw", "Hardware", 800.00, 4);

INSERT INTO products (product, department, price, stock)
VALUES ("'Monopolize' Board Game", "Games/Toys", 15.00, 20), ("'Bug-Man' Action Figure", "Games/Toys", 10.00, 30), ("'Space Battles' Starfighter Model Kit", "Games/Toys", 25.00, 40);

INSERT INTO products (product, department, price, stock)
VALUES ("Mountain Bike", "Sporting Goods", 300.00, 5), ("Hockey Goalie Mask", "Sporting Goods", 170.00, 7), ("Golf Club Bag", "Sporting Goods", 100.00, 9);
