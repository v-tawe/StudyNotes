/*
SQLyog Ultimate v12.08 (64 bit)
MySQL - 5.7.29-log : Database - project_crowd
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`project_crowd` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `project_crowd`;

/*Table structure for table `inner_admin_role` */

DROP TABLE IF EXISTS `inner_admin_role`;

CREATE TABLE `inner_admin_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

/*Data for the table `inner_admin_role` */

insert  into `inner_admin_role`(`id`,`admin_id`,`role_id`) values (15,1,22),(16,514,17),(17,514,18),(18,514,20),(19,11,2),(20,11,3),(21,11,4),(22,775,3),(23,775,1),(24,776,2),(25,776,4);

/*Table structure for table `inner_role_auth` */

DROP TABLE IF EXISTS `inner_role_auth`;

CREATE TABLE `inner_role_auth` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) DEFAULT NULL,
  `auth_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

/*Data for the table `inner_role_auth` */

insert  into `inner_role_auth`(`id`,`role_id`,`auth_id`) values (13,3,1),(14,3,8),(15,4,4),(16,4,5),(17,4,3);

/*Table structure for table `t_address` */

DROP TABLE IF EXISTS `t_address`;

CREATE TABLE `t_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `receive_name` char(100) DEFAULT NULL COMMENT '收件人',
  `phone_num` char(100) DEFAULT NULL COMMENT '手机号',
  `address` char(200) DEFAULT NULL COMMENT '收货地址',
  `member_id` int(11) DEFAULT NULL COMMENT '用户 id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `t_address` */

insert  into `t_address`(`id`,`receive_name`,`phone_num`,`address`,`member_id`) values (1,'51','18050952279','51',1);

/*Table structure for table `t_admin` */

DROP TABLE IF EXISTS `t_admin`;

CREATE TABLE `t_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login_acct` varchar(255) NOT NULL,
  `user_pswd` char(100) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `create_time` char(19) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_acct` (`login_acct`)
) ENGINE=InnoDB AUTO_INCREMENT=782 DEFAULT CHARSET=utf8;

/*Data for the table `t_admin` */

insert  into `t_admin`(`id`,`login_acct`,`user_pswd`,`user_name`,`email`,`create_time`) values (1,'j','$2a$10$XByQmKyf4bosbCFkS6GRd.lRT/6iYVj81ARnif/THZK5/ROjpW4.2','哈哈哈','jie@qq.com','2020-05-16 12:36:55'),(775,'adminOperator','$2a$10$XByQmKyf4bosbCFkS6GRd.lRT/6iYVj81ARnif/THZK5/ROjpW4.2','AAoo','ao@qq.com',NULL),(776,'roleOperator','$2a$10$XByQmKyf4bosbCFkS6GRd.lRT/6iYVj81ARnif/THZK5/ROjpW4.2','RRoo','ro@qq.com',NULL),(777,'admin01','222','admin01','aa@qq.com',NULL),(781,'admin02','22222','admn02','aa@qq.com',NULL);

/*Table structure for table `t_auth` */

DROP TABLE IF EXISTS `t_auth`;

CREATE TABLE `t_auth` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `t_auth` */

insert  into `t_auth`(`id`,`name`,`title`,`category_id`) values (1,'','用户模块',NULL),(2,'user:delete','删除',1),(3,'user:get','查询',1),(4,'','角色模块',NULL),(5,'role:delete','删除',4),(6,'role:get','查询',4),(7,'role:add','新增',4),(8,'user:save','保存',1);

/*Table structure for table `t_member` */

DROP TABLE IF EXISTS `t_member`;

CREATE TABLE `t_member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login_acct` varchar(255) NOT NULL,
  `user_pswd` char(200) NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `auth_status` int(4) DEFAULT NULL COMMENT '实名认证状态0-未实名认证，1-实名认证申请中，2-已实名认证',
  `user_type` int(4) DEFAULT NULL COMMENT '0-个人，1-企业',
  `real_name` varchar(255) DEFAULT NULL,
  `card_num` varchar(255) DEFAULT NULL,
  `acct_type` int(4) DEFAULT NULL COMMENT '0-企业，1-个体，2-个人，3-政府',
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_acct` (`login_acct`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `t_member` */

insert  into `t_member`(`id`,`login_acct`,`user_pswd`,`user_name`,`email`,`auth_status`,`user_type`,`real_name`,`card_num`,`acct_type`) values (1,'1','$2a$10$FFviAzguIJ8tr6IvFyExIOHbiYxkoEHP7Szo23lDcWgvBH2EZ0NBq','1','1',1,1,'1','1',1),(2,'ai','$2a$10$MkhpenVea0BEbDAOjwPG/OvPpxZSyFA7J0mWvfi9utHulPDRmlPCG','爱','1@qq.com',1,1,'1','1',1),(3,'hh','$2a$10$o87LFz6PgGrj1T6p0aeysOSvttSaO2tbGE7yUxw0VCrHKcF3dvbYG','jie','11@qq.com',NULL,NULL,NULL,NULL,NULL),(4,'aaa','$2a$10$ZwV7zSX9hr9DX5G1F9dlIOAQa3.XlgC9pv7FM948qE2BlVaHhK.6u','aaa','jie@qq.com',NULL,NULL,NULL,NULL,NULL),(5,'jie','$2a$10$qfdccYFiiI387RPyK3koSehz4eaML4S8eHTlqff25IFj7bJ5djmfy','aaa','jie@qq.com',NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `t_member_confirm_info` */

DROP TABLE IF EXISTS `t_member_confirm_info`;

CREATE TABLE `t_member_confirm_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `memberid` int(11) DEFAULT NULL COMMENT '会员 id',
  `paynum` varchar(200) DEFAULT NULL COMMENT '易付宝企业账号',
  `cardnum` varchar(200) DEFAULT NULL COMMENT '法人身份证号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `t_member_confirm_info` */

insert  into `t_member_confirm_info`(`id`,`memberid`,`paynum`,`cardnum`) values (1,NULL,'111','111');

/*Table structure for table `t_member_launch_info` */

DROP TABLE IF EXISTS `t_member_launch_info`;

CREATE TABLE `t_member_launch_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `memberid` int(11) DEFAULT NULL COMMENT '会员 id',
  `description_simple` varchar(255) DEFAULT NULL COMMENT '简单介绍',
  `description_detail` varchar(255) DEFAULT NULL COMMENT '详细介绍',
  `phone_num` varchar(255) DEFAULT NULL COMMENT '联系电话',
  `service_num` varchar(255) DEFAULT NULL COMMENT '客服电话',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;

/*Data for the table `t_member_launch_info` */

insert  into `t_member_launch_info`(`id`,`memberid`,`description_simple`,`description_detail`,`phone_num`,`service_num`) values (1,1,'i am mao','我是猫哥','123456','654321'),(2,2,'2','2','2','2'),(51,51,'51','51','51','51');

/*Table structure for table `t_menu` */

DROP TABLE IF EXISTS `t_menu`;

CREATE TABLE `t_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `icon` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

/*Data for the table `t_menu` */

insert  into `t_menu`(`id`,`pid`,`name`,`url`,`icon`) values (1,NULL,'系统权限菜单',NULL,'glyphicon glyphicon-th-list'),(2,1,' 控 制 面 板 ','main.htm','glyphicon glyphicon-dashboard'),(3,1,'权限管理',NULL,'glyphicon glyphicon glyphicon-tasks'),(4,3,'用 户 维 护','user/index.htm','glyphicon glyphicon-user'),(5,3,' 角 色 维 护 ','role/index.htm','glyphicon glyphicon-king'),(6,3,' 菜 单 维 护 ','permission/index.htm','glyphicon glyphicon-lock'),(7,1,' 业 务 审 核 ',NULL,'glyphicon glyphicon-ok'),(8,7,'实 名 认 证 审 核','auth_cert/index.htm','glyphicon glyphicon-check'),(9,7,' 广 告 审 核 ','auth_adv/index.htm','glyphicon glyphicon-check'),(10,7,' 项 目 审 核 ','auth_project/index.htm','glyphicon glyphicon-check'),(11,1,' 业 务 管 理 ',NULL,'glyphicon glyphicon-th-large'),(12,11,' 资 质 维 护 ','cert/index.htm','glyphicon glyphicon-picture'),(13,11,' 分 类 管 理 ','certtype/index.htm','glyphicon glyphicon-equalizer'),(14,11,' 流 程 管 理 ','process/index.htm','glyphicon glyphicon-random'),(15,11,' 广 告 管 理 ','advert/index.htm','glyphicon glyphicon-hdd'),(16,11,' 消 息 模 板 ','message/index.htm','glyphicon glyphicon-comment'),(17,11,' 项 目 分 类 ','projectType/index.htm','glyphicon glyphicon-list'),(18,11,' 项 目 标 签 ','tag/index.htm','glyphicon glyphicon-tags'),(19,1,' 参 数 管 理 ','param/index.htm','glyphicon glyphicon-list-alt');

/*Table structure for table `t_order` */

DROP TABLE IF EXISTS `t_order`;

CREATE TABLE `t_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `order_num` char(100) DEFAULT NULL COMMENT '订单号',
  `pay_order_num` char(100) DEFAULT NULL COMMENT '支付宝流水号',
  `order_amount` double(10,5) DEFAULT NULL COMMENT '订单金额',
  `invoice` int(11) DEFAULT NULL COMMENT '是否开发票（0 不开，1 开）',
  `invoice_title` char(100) DEFAULT NULL COMMENT '发票抬头',
  `order_remark` char(100) DEFAULT NULL COMMENT '订单备注',
  `address_id` char(100) DEFAULT NULL COMMENT '收货地址 id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;

/*Data for the table `t_order` */

insert  into `t_order`(`id`,`order_num`,`pay_order_num`,`order_amount`,`invoice`,`invoice_title`,`order_remark`,`address_id`) values (1,'1','1',1.00000,1,'1','1','1'),(2,'2','2',2.00000,2,'2','2','2'),(3,'3','3',3.00000,3,'3','3','3'),(51,'51','51',51.00000,51,'51','51','51'),(52,'20200529095119F080873C98AC4F2C86CB77D045888455','2020052922001443050500679311',612.00000,0,'','备注','1');

/*Table structure for table `t_order_project` */

DROP TABLE IF EXISTS `t_order_project`;

CREATE TABLE `t_order_project` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `project_name` char(200) DEFAULT NULL COMMENT '项目名称',
  `launch_name` char(100) DEFAULT NULL COMMENT '发起人',
  `return_content` char(200) DEFAULT NULL COMMENT '回报内容',
  `return_count` int(11) DEFAULT NULL COMMENT '回报数量',
  `support_price` int(11) DEFAULT NULL COMMENT '支持单价',
  `freight` int(11) DEFAULT NULL COMMENT '配送费用',
  `order_id` int(11) DEFAULT NULL COMMENT '订单表的主键',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `t_order_project` */

insert  into `t_order_project`(`id`,`project_name`,`launch_name`,`return_content`,`return_count`,`support_price`,`freight`,`order_id`) values (1,'51','51','51',51,11,51,52);

/*Table structure for table `t_project` */

DROP TABLE IF EXISTS `t_project`;

CREATE TABLE `t_project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_name` varchar(255) DEFAULT NULL COMMENT '项目名称',
  `project_description` varchar(255) DEFAULT NULL COMMENT '项目描述',
  `money` bigint(11) DEFAULT NULL COMMENT '筹集金额',
  `day` int(11) DEFAULT NULL COMMENT '筹集天数',
  `status` int(4) DEFAULT NULL COMMENT '0-即将开始，1-众筹中，2-众筹成功，3-众筹失败 ',
  `deploydate` varchar(10) DEFAULT NULL COMMENT '项目发起时间',
  `supportmoney` bigint(11) DEFAULT NULL COMMENT '已筹集到的金额',
  `supporter` int(11) DEFAULT NULL COMMENT '支持人数',
  `completion` int(3) DEFAULT NULL COMMENT '百分比完成度',
  `memberid` int(11) DEFAULT NULL COMMENT '发起人的会员 id',
  `createdate` varchar(19) DEFAULT NULL COMMENT '项目创建时间',
  `follower` int(11) DEFAULT NULL COMMENT '关注人数',
  `header_picture_path` varchar(255) DEFAULT NULL COMMENT '头图路径',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;

/*Data for the table `t_project` */

insert  into `t_project`(`id`,`project_name`,`project_description`,`money`,`day`,`status`,`deploydate`,`supportmoney`,`supporter`,`completion`,`memberid`,`createdate`,`follower`,`header_picture_path`) values (1,'1','1',1,1,1,'1',1,1,1,1,'1',1,'http://jie123456.oss-cn-shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(3,'3','3',3,3,3,'3',3,3,3,3,'3',3,'http://jie123456.oss-cn-shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(4,'4','4',4,4,4,'4',4,4,4,4,'4',4,'http://jie123456.oss-cn-shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(11,'11','11',11,11,11,'11',11,11,11,11,'11',11,'http://jie123456.oss-cn-shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(21,'21','21',21,21,21,'21',21,21,21,21,'21',21,'http://jie123456.oss-cn-shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(28,'brotherMao','就是帅！',NULL,30,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'http://jie123456.oss-cn-shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(31,'31','31',31,31,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'http://jie123456.oss-cn-shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(41,'41','41',41,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'http://jie123456.oss-cn-shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(51,'51','51',51,51,51,'2020-5-20',51,51,51,51,'51',51,'http://jie123456.oss-cn-shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg');

/*Table structure for table `t_project_item_pic` */

DROP TABLE IF EXISTS `t_project_item_pic`;

CREATE TABLE `t_project_item_pic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectid` int(11) DEFAULT NULL,
  `item_pic_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;

/*Data for the table `t_project_item_pic` */

insert  into `t_project_item_pic`(`id`,`projectid`,`item_pic_path`) values (1,1,'shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(2,2,'shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(3,3,'shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(4,4,'shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(5,1,'shenzhen.aliyuncs.com/20200525/bb3f3ca8083b40ccba4253f2e85b4af5.jpg'),(27,28,'http://jie123456.oss-cn-shenzhen.aliyuncs.com/20200525/f370c1a4016c4e6fa44afdfce1c87dc2.jpg'),(51,51,'http://jie123456.oss-cn-shenzhen.aliyuncs.com/20200525/f370c1a4016c4e6fa44afdfce1c87dc2.jpg');

/*Table structure for table `t_project_tag` */

DROP TABLE IF EXISTS `t_project_tag`;

CREATE TABLE `t_project_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectid` int(11) DEFAULT NULL,
  `tagid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8;

/*Data for the table `t_project_tag` */

insert  into `t_project_tag`(`id`,`projectid`,`tagid`) values (79,28,9),(80,28,7),(81,28,4);

/*Table structure for table `t_project_type` */

DROP TABLE IF EXISTS `t_project_type`;

CREATE TABLE `t_project_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectid` int(11) DEFAULT NULL,
  `typeid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

/*Data for the table `t_project_type` */

insert  into `t_project_type`(`id`,`projectid`,`typeid`) values (55,1,1),(56,2,2),(57,3,3),(58,4,4),(59,11,1),(60,21,1),(61,31,1),(62,41,1),(63,51,1);

/*Table structure for table `t_return` */

DROP TABLE IF EXISTS `t_return`;

CREATE TABLE `t_return` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectid` int(11) DEFAULT NULL,
  `type` int(4) DEFAULT NULL COMMENT '0 - 实物回报， 1 虚拟物品回报',
  `supportmoney` int(11) DEFAULT NULL COMMENT '支持金额',
  `content` varchar(255) DEFAULT NULL COMMENT '回报内容',
  `count` int(11) DEFAULT NULL COMMENT '回报产品限额，“0”为不限回报数量',
  `signalpurchase` int(11) DEFAULT NULL COMMENT '是否设置单笔限购',
  `purchase` int(11) DEFAULT NULL COMMENT '具体限购数量',
  `freight` int(11) DEFAULT NULL COMMENT '运费，“0”为包邮',
  `invoice` int(4) DEFAULT NULL COMMENT '0 - 不开发票， 1 - 开发票',
  `returndate` int(11) DEFAULT NULL COMMENT '项目结束后多少天向支持者发送回报',
  `describ_pic_path` varchar(255) DEFAULT NULL COMMENT '说明图片路径',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;

/*Data for the table `t_return` */

insert  into `t_return`(`id`,`projectid`,`type`,`supportmoney`,`content`,`count`,`signalpurchase`,`purchase`,`freight`,`invoice`,`returndate`,`describ_pic_path`) values (1,1,0,10,'以身相许',5,0,8,0,0,15,'http://jie123456.oss-cn-shenzhen.aliyuncs.com/20200525/8f0002d0a8824898a8bef58cbd498abe.jpg'),(3,3,3,3,'3',3,3,NULL,3,3,3,'3'),(51,51,51,11,'51',51,51,51,51,51,51,'51');

/*Table structure for table `t_role` */

DROP TABLE IF EXISTS `t_role`;

CREATE TABLE `t_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `t_role` */

insert  into `t_role`(`id`,`name`) values (1,'经理'),(2,'部长'),(3,'经理操作者'),(4,'部长操作者');

/*Table structure for table `t_tag` */

DROP TABLE IF EXISTS `t_tag`;

CREATE TABLE `t_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `t_tag` */

/*Table structure for table `t_type` */

DROP TABLE IF EXISTS `t_type`;

CREATE TABLE `t_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '分类名称',
  `remark` varchar(255) DEFAULT NULL COMMENT '分类介绍',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `t_type` */

insert  into `t_type`(`id`,`name`,`remark`) values (1,'科技','开启智慧未来'),(2,'设计','创建改变未来'),(3,'农业','网络天下肥美'),(4,'公益','汇聚点点矮星');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
