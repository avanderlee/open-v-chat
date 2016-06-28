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
