-- Database: libraryDB

-- Drop tables if they exist
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS __drizzle_migrations;

-- Create tables

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(255) NOT NULL,
  publisher VARCHAR(100),
  genre VARCHAR(31),
  "isbnNo" VARCHAR(13) NOT NULL UNIQUE,
  "numOfPages" INTEGER NOT NULL,
  "totalNumOfCopies" INTEGER NOT NULL,
  "availableNumberOfCopies" INTEGER NOT NULL,
  "imageUrl" VARCHAR(255)
);

CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  "phoneNumber" VARCHAR(10),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('librarian', 'member'))
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (book_id) REFERENCES books(id),
  UNIQUE (member_id, book_id)
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  "bookId" INTEGER NOT NULL,
  "memberId" INTEGER NOT NULL,
  "issueDate" VARCHAR(255) NOT NULL,
  "dueDate" VARCHAR(255) NOT NULL,
  "returnDate" VARCHAR(255),
  status VARCHAR(10) NOT NULL
);

CREATE TABLE __drizzle_migrations (
  id SERIAL PRIMARY KEY,
  hash TEXT NOT NULL,
  created_at BIGINT
);

-- Insert data

INSERT INTO books (title, author, publisher, genre, "isbnNo", "numOfPages", "totalNumOfCopies", "availableNumberOfCopies", "imageUrl") VALUES
('The Rust Programming Language (Covers Rust 2018)', 'Steve Klabnik, Carol Nichols', 'No Starch Press', 'Computers', '9781718500457', 561, 10, 3, NULL),
('Introduction to Programming Languages', 'Arvind Kumar Bansal', 'CRC Press', 'Computers', '9781466565159', 624, 10, 5, NULL),
('COMPUTER PROGRAMMING IN C, SECOND EDITION', 'RAJARAMAN, V.', 'PHI Learning Pvt. Ltd.', 'Computers', '9789388028341', 400, 4, 3, NULL),
('Python Programming in Context', 'Bradley N. Miller, David L. Ranum, Julie Anderson', 'Jones & Bartlett Learning', 'Computers', '9781284175554', 516, 11, 10, NULL),
('Core Python Programming', 'Wesley Chun', 'Prentice Hall Professional', 'Computers', '9780130260369', 805, 3, 1, NULL);

INSERT INTO members ("firstName", "lastName", email, "phoneNumber", password, role) VALUES
('Shashu', 'Patel', 'sh@gmail.com', '9519511595', '$2b$10$rptZ2gNyB8sAJHJhlfxeS.Z0wxyYioS1ByvkGaqZ6c0Zo6nXOeKGC', 'member'),
('Shashu', 'Patel', 'sha@gmail.com', '9519511595', '$2b$10$UBSA5W.RAwbMmHlOGvoAU.eVhF/8Ddj/axxob02GrnCt199j2WZL.', 'librarian'),
('Akshay', 'bhat', 'ak@gmail.com', '8585858585', '$2b$10$hUgMRqGwNml6uZlHW0Bmd.mbJ.6NaNkckDiseJrqHAW4ML0VyM4z2', 'member'),
('Bro', 'bro', 'shashub1717@gmail.com', '7799779977', '$2b$10$f.OzgGHOCCd.hW3A4q9h2eetG7HDPzy8mrFkmKxQ4Z92wRlOpwydu', 'member'),
('Shashank', 'B', 'shashankpatel1616@gmail.com', NULL, '', 'member');

INSERT INTO favorites (member_id, book_id) VALUES
(1, 1),
(1, 2);

INSERT INTO transactions ("bookId", "memberId", "issueDate", "dueDate", "returnDate", status) VALUES
(1, 16, 'Wednesday, 2024-09-04, 11:15:49', 'Wednesday, 2024-09-05, 11:15:49', 'Monday, 2024-09-16, 07:13:07', 'returned'),
(1, 7, 'Wednesday, 2024-09-04, 11:16:33', 'Wednesday, 2024-09-03, 11:16:33', 'Monday, 2024-09-16, 07:13:08', 'returned'),
(1, 16, 'Wednesday, 2024-09-04, 11:16:34', 'Wednesday, 2024-09-07, 11:16:34', 'Monday, 2024-09-09, 09:57:45', 'returned'),
(1, 7, 'Wednesday, 2024-09-04, 11:16:36', 'Wednesday, 2024-09-18, 11:16:36', 'Monday, 2024-09-09, 06:23:56', 'returned'),
(2, 16, 'Wednesday, 2024-09-04, 17:01:27', 'Wednesday, 2024-09-18, 17:01:27', 'Monday, 2024-09-09, 06:23:36', 'returned');

INSERT INTO __drizzle_migrations (hash, created_at) VALUES
('76487c0616ea0b635dab9552d2e38a13340a57b1580bea79ecd4cba5e0634c8c', 1721729690706);