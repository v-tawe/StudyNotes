-- delete user info and roel info
DROP PROCEDURE IF EXISTS delete_user_by_id
GO
CREATE PROCEDURE delete_user_by_id @userId BIGINT
AS
BEGIN
	DELETE FROM sys_user_role WHERE user_id = @userId;
	DELETE FROM sys_user WHERE id=@userId;
END