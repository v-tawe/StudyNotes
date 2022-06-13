using mybatis2
create table sys_user 
(
	id					bigint not null primary key IDENTITY(1,1),
	user_name			varchar(50),
	user_password     varchar(50),
	user_email        varchar(50),
	user_info          text,
	head_img           text,
	create_time       datetime,
);

create table sys_role 
(
	id                  bigint not null primary key IDENTITY(1,1),
	role_name          varchar(50),
	enabled            int,
	create_by          bigint,
	create_time       datetime,
);
create table sys_privilege (
	id                  bigint not null primary key IDENTITY(1,1),
	privilege_name    varchar(50),
	privilege_url     varchar(200),
);

create table sys_user_role (
	user_id           bigint,
	role_id            bigint,
);

create table sys_role_privilege 
(
	role_id            bigint,
	privilege_id      bigint
);


SET IDENTITY_INSERT sys_user ON
INSERT INTO sys_user(id, user_name, user_password, user_email, user_info, head_img, create_time) VALUES (1, 'admin', '123456', 'admin@mybatis.tk', '管理员', null, '2016-04-01 17:00:58');
INSERT INTO sys_user(id, user_name, user_password, user_email, user_info, head_img, create_time) VALUES (1001, 'test', '123456', 'test@mybatis.tk', '测试用户', null, '2016-04-01 17:01:52');
SET IDENTITY_INSERT sys_user OFF

SET IDENTITY_INSERT sys_role ON
INSERT INTO sys_role VALUES ('管理员', '1', '1', '2016-04-01 17:02:14');
INSERT INTO sys_role VALUES ('普通用户', '1', '1', '2016-04-01 17:02:34');
SET IDENTITY_INSERT sys_role OFF
INSERT INTO sys_user_role VALUES ('1', '1');
INSERT INTO sys_user_role VALUES ('1', '2');
INSERT INTO sys_user_role VALUES ('1001', '2');
SET IDENTITY_INSERT sys_privilege ON
INSERT INTO sys_privilege(id, privilege_name, privilege_url) VALUES (1, '用户管理', '/users');
INSERT INTO sys_privilege(id, privilege_name, privilege_url) VALUES (2, '角色管理', '/roles');
INSERT INTO sys_privilege(id, privilege_name, privilege_url) VALUES (3, '系统日志', '/logs');
INSERT INTO sys_privilege(id, privilege_name, privilege_url) VALUES (4, '人员维护', '/persons');
INSERT INTO sys_privilege(id, privilege_name, privilege_url) VALUES (5, '单位维护', '/companies');
SET IDENTITY_INSERT sys_privilege OFF
INSERT INTO sys_role_privilege VALUES ('1', '1');
INSERT INTO sys_role_privilege VALUES ('1', '3');
INSERT INTO sys_role_privilege VALUES ('1', '2');
INSERT INTO sys_role_privilege VALUES ('2', '4');
INSERT INTO sys_role_privilege VALUES ('2', '5');

select * from dbo.country

SELECT * from ::fn_helpcollations()

ALTER DATABASE mybatis
COLLATE Chinese_PRC_CI_AS;
GO

select top 10 * from sys_user;
select top 10 * from sys_role;

select SCOPE_IDENTITY()
