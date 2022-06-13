-- get all user info by user_id
CREATE PROCEDURE select_user_by_id
	@userId BIGINT,
	@userName VARCHAR(50) Output,
	@userPassword VARCHAR(50) Output,
	@userEmail VARCHAR(50) Output,
	@userInfo TEXT Output,
	@headImg TEXT Output,
	@createTime DATETIME Output
AS
BEGIN
	SELECT @userName=user_name, @userPassword=user_password, @userEmail=user_email, @userInfo=user_info, @headImg=head_img, @createTime=create_time
	FROM sys_user
	WHERE id=@userId;
END