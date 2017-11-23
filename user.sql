-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 2017-11-23 20:04:54
-- 服务器版本： 10.1.26-MariaDB
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `snake`
--

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `uid` int(11) NOT NULL,
  `uname` varchar(16) NOT NULL,
  `upwd` varchar(512) NOT NULL,
  `avatar` varchar(256) NOT NULL,
  `pnumber` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`uid`, `uname`, `upwd`, `avatar`, `pnumber`) VALUES
(1, '', '', '', ''),
(2, '1234', '$2a$10$4m6zbmK1fpDRMt.K7HDBGuVX1Xx3jHWtveNIk4/avDT29g7yylB0u', 'c:UsersDELLDesktop?????/public/avatar/15096380817393918.png', '18225518850'),
(3, '12345', '$2a$10$VpFj8ZLTuwKe3BS4dS8D9OI.1pDt3fwV7SQgyNA95ARJRiSPzeEc.', 'c:UsersDELLDesktop?????/public/avatar/15096392214935615.png', '18225518850'),
(4, '123457', '$2a$10$aod100G3nnrKyMndgkHVWOVN5jK.Y.5/IlI7D75S4QXPnKEUuOgBG', 'c:UsersDELLDesktop?????/public/avatar/15096393597225535.png', '18225518850'),
(5, '1234578', '$2a$10$3067ASxu3TRPVyyEdDCZXeAjHgCCYfDtqt1CNqL9AUfCv72wy1fcm', 'c:UsersDELLDesktop?????/public/avatar/15096393954718728.png', '18225518850'),
(6, '1234578y', '$2a$10$zGFOHS5gab2KqULVlGudEeDQWwo3.jYkS68hVVS0xI.DvhdFY1kTK', 'c:UsersDELLDesktop?????/public/avatar/15096396379097704.png', '18225518850'),
(7, '123636', '$2a$10$iGJpcDPYU3RI2Z5PN8rD2OQQmSHMynbaM3eZyQKV2WiynWntHG97W', 'c:UsersDELLDesktop?????/public/avatar/15096411445795294.png', '18225518850'),
(8, '123636s', '$2a$10$GawlIjNj5lzdS7UVX7GBjues22IQ/8MeJjctQUQL4eVB9G7GHWWEe', 'c:UsersDELLDesktop?????/public/avatar/15096411682829904.png', '18225518850'),
(9, 'dingding', '$2a$10$xbET2cS28XylDWO.adAfBuV2NkggkLhFZV3g1rk5f2Q8UvZqy3dn.', 'c:UsersDELLDesktop?????/img/2.jpg', '18225518850');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uid`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
