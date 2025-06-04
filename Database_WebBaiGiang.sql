CREATE TABLE `Vai_Tro` (
  `ID` int PRIMARY KEY AUTO_INCREMENT,
  `Ten_Vai_Tro` varchar(50),
  `Mo_Ta` text,
  `Trang_Thai` boolean DEFAULT true
);

CREATE TABLE `Tai_Khoan` (
  `ID` int PRIMARY KEY AUTO_INCREMENT,
  `Email` varchar(255) UNIQUE,
  `Mat_Khau` varchar(255),
  `Vai_Tro_ID` int,
  `Lan_Dau_Dang_Nhap` boolean DEFAULT true,
  `Ngay_Tao` datetime DEFAULT (now()),
  `Ngay_Cap_Nhat` datetime,
  `Trang_Thai` boolean DEFAULT true
);

CREATE TABLE `Bo_Mon` (
  `ID` int PRIMARY KEY AUTO_INCREMENT,
  `Ten_Bo_Mon` varchar(255) NOT NULL,
  `Mo_Ta` text,
  `Trang_Thai` boolean DEFAULT true
);

CREATE TABLE `Giang_Vien` (
  `ID` int PRIMARY KEY AUTO_INCREMENT,
  `Tai_Khoan_ID` int,
  `Ho_Ten` varchar(255) NOT NULL,
  `Hinh_Anh` varchar(500),
  `Bo_Mon_ID` int,
  `Ngay_Tao` datetime DEFAULT (now()),
  `Trang_Thai` boolean DEFAULT true
);

CREATE TABLE `Khoa_Hoc` (
  `ID` int PRIMARY KEY AUTO_INCREMENT,
  `Ten_Khoa_Hoc` varchar(255) NOT NULL,
  `Chuong` varchar(255),
  `Noi_Dung` varchar(255),
  `Mo_Ta` text,
  `Giang_Vien_ID` int NOT NULL,
  `Ngay_Bat_Dau` date,
  `Ngay_Ket_Thuc` date,
  `Trang_Thai` boolean DEFAULT true
);

CREATE TABLE `Lop_Hoc` (
  `ID` int PRIMARY KEY AUTO_INCREMENT,
  `Ten_Lop_Hoc` varchar(255) NOT NULL,
  `Khoa_Hoc_ID` int NOT NULL,
  `Giang_Vien_ID` int NOT NULL,
  `Mo_Ta` text,
  `Ngay_Tao` datetime DEFAULT (now()),
  `Trang_Thai` boolean DEFAULT true
);

CREATE TABLE `Sinh_Vien` (
  `ID` int PRIMARY KEY AUTO_INCREMENT,
  `Tai_Khoan_ID` int NOT NULL,
  `Ho_Ten` varchar(255) NOT NULL,
  `MSSV` varchar(20) UNIQUE NOT NULL,
  `Hinh_Anh` varchar(500),
  `Ngay_Them` datetime DEFAULT (now()),
  `Trang_Thai` boolean DEFAULT true
);

CREATE TABLE `Sinh_Vien_Lop_Hoc` (
  `ID` int PRIMARY KEY AUTO_INCREMENT,
  `Sinh_Vien_ID` int NOT NULL,
  `Lop_Hoc_ID` int NOT NULL,
  `Ngay_Tham_Gia` datetime DEFAULT (now()),
  `Trang_Thai` boolean DEFAULT true
);

CREATE TABLE `Hoc_Phan` (
  `ID` int PRIMARY KEY AUTO_INCREMENT,
  `Ten_Hoc_Phan` varchar(255) NOT NULL,
  `Mo_Ta` text,
  `Khoa_Hoc_ID` int NOT NULL,
  `Thu_Tu` int DEFAULT 1,
  `Trang_Thai` boolean DEFAULT true
);

CREATE TABLE `Tien_Do_Hoc_Tap` (
  `ID` int PRIMARY KEY AUTO_INCREMENT,
  `Sinh_Vien_ID` int NOT NULL,
  `Khoa_Hoc_ID` int NOT NULL,
  `Hoan_Thanh` boolean DEFAULT false,
  `Ngay_Bat_Dau` datetime,
  `Ngay_Hoan_Thanh` datetime
);

CREATE TABLE `Danh_Gia_Khoa_Hoc` (
  `ID` int PRIMARY KEY AUTO_INCREMENT,
  `Khoa_Hoc_ID` int NOT NULL,
  `Sinh_Vien_ID` int NOT NULL,
  `Noi_Dung_Danh_Gia` text,
  `Ngay_Danh_Gia` datetime DEFAULT (now()),
  `Trang_Thai` boolean DEFAULT true
);

CREATE TABLE `Thu_Vien_Tai_Lieu` (
  `ID` int PRIMARY KEY AUTO_INCREMENT,
  `Ten_Tai_Lieu` varchar(255) NOT NULL,
  `Mo_Ta` text,
  `Loai_Tai_Lieu` enum(PDF,DOC,PPT,VIDEO,AUDIO,HINH_ANH,KHAC) NOT NULL,
  `Duong_Dan_File` varchar(500) NOT NULL,
  `Nguoi_Upload_ID` int NOT NULL,
  `Khoa_Hoc_ID` int,
  `Lop_Hoc_ID` int,
  `Ngay_Upload` datetime DEFAULT (now()),
  `Trang_Thai` boolean DEFAULT true
);

CREATE UNIQUE INDEX `Sinh_Vien_Lop_Hoc_index_0` ON `Sinh_Vien_Lop_Hoc` (`Sinh_Vien_ID`, `Lop_Hoc_ID`);

CREATE UNIQUE INDEX `Tien_Do_Hoc_Tap_index_1` ON `Tien_Do_Hoc_Tap` (`Sinh_Vien_ID`, `Khoa_Hoc_ID`);

CREATE UNIQUE INDEX `Danh_Gia_Khoa_Hoc_index_2` ON `Danh_Gia_Khoa_Hoc` (`Khoa_Hoc_ID`, `Sinh_Vien_ID`);

ALTER TABLE `Tai_Khoan` ADD FOREIGN KEY (`Vai_Tro_ID`) REFERENCES `Vai_Tro` (`ID`);

ALTER TABLE `Giang_Vien` ADD FOREIGN KEY (`Tai_Khoan_ID`) REFERENCES `Tai_Khoan` (`ID`);

ALTER TABLE `Giang_Vien` ADD FOREIGN KEY (`Bo_Mon_ID`) REFERENCES `Bo_Mon` (`ID`);

ALTER TABLE `Khoa_Hoc` ADD FOREIGN KEY (`Giang_Vien_ID`) REFERENCES `Giang_Vien` (`ID`);

ALTER TABLE `Lop_Hoc` ADD FOREIGN KEY (`Khoa_Hoc_ID`) REFERENCES `Khoa_Hoc` (`ID`);

ALTER TABLE `Lop_Hoc` ADD FOREIGN KEY (`Giang_Vien_ID`) REFERENCES `Giang_Vien` (`ID`);

ALTER TABLE `Sinh_Vien` ADD FOREIGN KEY (`Tai_Khoan_ID`) REFERENCES `Tai_Khoan` (`ID`);

ALTER TABLE `Sinh_Vien_Lop_Hoc` ADD FOREIGN KEY (`Sinh_Vien_ID`) REFERENCES `Sinh_Vien` (`ID`);

ALTER TABLE `Sinh_Vien_Lop_Hoc` ADD FOREIGN KEY (`Lop_Hoc_ID`) REFERENCES `Lop_Hoc` (`ID`);

ALTER TABLE `Hoc_Phan` ADD FOREIGN KEY (`Khoa_Hoc_ID`) REFERENCES `Khoa_Hoc` (`ID`);

ALTER TABLE `Tien_Do_Hoc_Tap` ADD FOREIGN KEY (`Sinh_Vien_ID`) REFERENCES `Sinh_Vien` (`ID`);

ALTER TABLE `Tien_Do_Hoc_Tap` ADD FOREIGN KEY (`Khoa_Hoc_ID`) REFERENCES `Khoa_Hoc` (`ID`);

ALTER TABLE `Danh_Gia_Khoa_Hoc` ADD FOREIGN KEY (`Khoa_Hoc_ID`) REFERENCES `Khoa_Hoc` (`ID`);

ALTER TABLE `Danh_Gia_Khoa_Hoc` ADD FOREIGN KEY (`Sinh_Vien_ID`) REFERENCES `Sinh_Vien` (`ID`);

ALTER TABLE `Thu_Vien_Tai_Lieu` ADD FOREIGN KEY (`Nguoi_Upload_ID`) REFERENCES `Tai_Khoan` (`ID`);

ALTER TABLE `Thu_Vien_Tai_Lieu` ADD FOREIGN KEY (`Khoa_Hoc_ID`) REFERENCES `Khoa_Hoc` (`ID`);

ALTER TABLE `Thu_Vien_Tai_Lieu` ADD FOREIGN KEY (`Lop_Hoc_ID`) REFERENCES `Lop_Hoc` (`ID`);

ALTER TABLE `Thu_Vien_Tai_Lieu` ADD FOREIGN KEY (`Loai_Tai_Lieu`) REFERENCES `Thu_Vien_Tai_Lieu` (`Duong_Dan_File`);

ALTER TABLE `Lop_Hoc` ADD FOREIGN KEY (`Ngay_Tao`) REFERENCES `Hoc_Phan` (`Mo_Ta`);
