-- save user info and role info
DROP PROCEDURE IF EXISTS insert_user_and_roles
GO
CREATE PROCEDURE insert_user_and_roles
	@userId BIGINT OUT,
	@userName VARCHAR(50),
	@userPassword VARCHAR(50),
	@userEmail VARCHAR(50),
	@userInfo TEXT,
	@headImg TEXT,
	@createTime DATETIME OUT,
	@roleIds VARCHAR(200)
AS
BEGIN
	SET @createTime=getdate();
	INSERT INTO sys_user(user_name, user_password, user_email, user_info, head_img, create_time)
	VALUES(@userName, @userPassword, @userEmail, @userInfo, @headImg, @createTime);
	SELECT @userId=@@IDENTITY;
	-- SET @roleIds=CONCAT(',', @roleIds, ',');
	INSERT INTO sys_user_role(user_id, role_id)
	SELECT @userId, id from sys_role
	WHERE CHARINDEX(CAST(id AS VARCHAR(50)), @roleIds) > 0;
	--WHERE CHARINDEX(@roleIds, CONCAT(',', id, ',')) > 0;
END