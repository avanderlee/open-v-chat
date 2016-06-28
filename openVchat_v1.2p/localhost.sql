-- phpMyAdmin SQL Dump
-- version 2.6.1
-- http://www.phpmyadmin.net
-- 
-- Host: localhost
-- Generation Time: Jul 24, 2006 at 08:25 PM
-- Server version: 4.1.10
-- PHP Version: 5.0.3
-- 
-- Database: `openvchat`
-- 
CREATE DATABASE `openvchat` DEFAULT CHARACTER SET latin1 COLLATE latin1_general_ci;
USE openvchat;

-- --------------------------------------------------------

-- 
-- Table structure for table `detail_friend_list`
-- 

CREATE TABLE `detail_friend_list` (
  `usr_user_id` varchar(10) collate latin1_general_ci NOT NULL default '',
  `usr_friend_id` varchar(10) collate latin1_general_ci NOT NULL default '',
  `group_seq` int(11) NOT NULL default '0',
  PRIMARY KEY  (`usr_user_id`,`usr_friend_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci COMMENT='List of user friend';


-- --------------------------------------------------------

-- 
-- Table structure for table `mst_group`
-- 

CREATE TABLE `mst_group` (
  `seq` int(11) NOT NULL auto_increment,
  `usr_user_id` varchar(10) collate latin1_general_ci NOT NULL default '',
  `group_name` varchar(15) collate latin1_general_ci NOT NULL default '',
  PRIMARY KEY  (`seq`,`usr_user_id`),
  KEY `usr_user_id` (`usr_user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci COMMENT='Master group for user' AUTO_INCREMENT=6 ;


-- --------------------------------------------------------

-- 
-- Table structure for table `mst_icon`
-- 

CREATE TABLE `mst_icon` (
  `icon_id` int(11) NOT NULL default '0',
  `icon_char` varchar(5) collate latin1_general_ci NOT NULL default '',
  PRIMARY KEY  (`icon_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci COMMENT='table for the list icon';

-- 
-- Dumping data for table `mst_icon`
-- 

INSERT INTO `mst_icon` VALUES (1, ':)');
INSERT INTO `mst_icon` VALUES (2, ':(');
INSERT INTO `mst_icon` VALUES (3, ':)~');
INSERT INTO `mst_icon` VALUES (4, ':d');
INSERT INTO `mst_icon` VALUES (5, ';;)');
INSERT INTO `mst_icon` VALUES (6, '>:d<');
INSERT INTO `mst_icon` VALUES (7, ':-/');
INSERT INTO `mst_icon` VALUES (8, ':x');
INSERT INTO `mst_icon` VALUES (9, ':">');
INSERT INTO `mst_icon` VALUES (10, ':p');
INSERT INTO `mst_icon` VALUES (11, ':*');
INSERT INTO `mst_icon` VALUES (12, '=((');
INSERT INTO `mst_icon` VALUES (13, ':o');
INSERT INTO `mst_icon` VALUES (14, 'x(');
INSERT INTO `mst_icon` VALUES (15, 'b-(');
INSERT INTO `mst_icon` VALUES (16, 'b-)');
INSERT INTO `mst_icon` VALUES (17, '=p~');
INSERT INTO `mst_icon` VALUES (18, '[s]');
INSERT INTO `mst_icon` VALUES (19, '>:)');
INSERT INTO `mst_icon` VALUES (20, ':((');
INSERT INTO `mst_icon` VALUES (21, ':))');
INSERT INTO `mst_icon` VALUES (22, ':|');
INSERT INTO `mst_icon` VALUES (23, 'T_T');
INSERT INTO `mst_icon` VALUES (24, '=))');
INSERT INTO `mst_icon` VALUES (25, '0:-)');
INSERT INTO `mst_icon` VALUES (26, ':dV');
INSERT INTO `mst_icon` VALUES (27, ':-h');
INSERT INTO `mst_icon` VALUES (28, '|.|');
INSERT INTO `mst_icon` VALUES (29, '^.^');
INSERT INTO `mst_icon` VALUES (30, '-.-!');
INSERT INTO `mst_icon` VALUES (31, ':-&');
INSERT INTO `mst_icon` VALUES (32, '~x(');
INSERT INTO `mst_icon` VALUES (33, ';))');
INSERT INTO `mst_icon` VALUES (34, '=o~');
INSERT INTO `mst_icon` VALUES (35, '(:|');
INSERT INTO `mst_icon` VALUES (36, '$.$');
INSERT INTO `mst_icon` VALUES (37, 'b-((');
INSERT INTO `mst_icon` VALUES (38, '=.=!');
INSERT INTO `mst_icon` VALUES (39, '^_^!');
INSERT INTO `mst_icon` VALUES (40, ';((');

-- --------------------------------------------------------

-- 
-- Table structure for table `mst_user`
-- 

CREATE TABLE `mst_user` (
  `user_id` varchar(10) collate latin1_general_ci NOT NULL default '',
  `password` varchar(32) collate latin1_general_ci NOT NULL default '',
  PRIMARY KEY  (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci COMMENT='master user chat';

-- --------------------------------------------------------

-- 
-- Table structure for table `txn_msg_chat`
-- 

CREATE TABLE `txn_msg_chat` (
  `usr_from` varchar(10) collate latin1_general_ci NOT NULL default '',
  `usr_to` varchar(10) collate latin1_general_ci NOT NULL default '',
  `dcrea` datetime NOT NULL default '0000-00-00 00:00:00',
  `seq` bigint(20) NOT NULL auto_increment,
  `msg` text collate latin1_general_ci NOT NULL,
  `b` varchar(4) collate latin1_general_ci NOT NULL default '',
  `i` varchar(6) collate latin1_general_ci NOT NULL default '',
  `u` varchar(9) collate latin1_general_ci NOT NULL default '',
  `fo` varchar(20) collate latin1_general_ci NOT NULL default '',
  `s` int(11) NOT NULL default '0',
  PRIMARY KEY  (`usr_from`,`usr_to`,`dcrea`,`seq`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci COMMENT='transaction table for user' AUTO_INCREMENT=1 ;

-- 
-- Dumping data for table `txn_msg_chat`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `txn_user_status`
-- 

CREATE TABLE `txn_user_status` (
  `usr_user_id` varchar(10) collate latin1_general_ci NOT NULL default '',
  `status` varchar(30) collate latin1_general_ci NOT NULL default '',
  `dmodi` datetime NOT NULL default '0000-00-00 00:00:00',
  `dlogin` datetime default NULL,
  PRIMARY KEY  (`usr_user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci COMMENT='transaction table for user';

-- --------------------------------------------------------

-- 
-- Table structure for table `mst_room`
-- 

CREATE TABLE `mst_room` (
  `room_id` varchar(10) collate latin1_general_ci NOT NULL,
  `password` varchar(32) collate latin1_general_ci default NULL,
  `dcrea` datetime NOT NULL,
  PRIMARY KEY  (`room_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- 
-- Dumping data for table `mst_room`
-- 

INSERT INTO `mst_room` VALUES ('~openVchat', NULL, '2010-08-09 00:00:00');

-- --------------------------------------------------------

-- 
-- Table structure for table `dtl_room_member`
-- 

CREATE TABLE `dtl_room_member` (
  `r_room_id` varchar(10) collate latin1_general_ci NOT NULL,
  `usr_user_id` varchar(10) collate latin1_general_ci NOT NULL,
  `dcrea` datetime NOT NULL,
  `dcheck` datetime default NULL,
  PRIMARY KEY  (`r_room_id`,`usr_user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
