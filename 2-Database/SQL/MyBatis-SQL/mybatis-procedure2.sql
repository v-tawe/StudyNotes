-- get all paged user info by user_name and page_index
CREATE PROCEDURE select_user_page
	@userName VARCHAR(50),
	@_offset BIGINT,
	@_limit BIGINT,
	@total BIGINT OUT
AS
BEGIN
	SELECT @total=count(*) FROM sys_user WHERE user_name like concat('%', @userName, '%');
	SELECT TOP (@_limit) * FROM sys_user WHERE user_name like concat('%', @userName, '%') AND id NOT IN (SELECT TOP (@_offset) id FROM sys_user);
END