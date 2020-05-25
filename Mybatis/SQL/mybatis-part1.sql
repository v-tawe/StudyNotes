CREATE DATABASE mybatis 



use mybatis;
GO

ALTER DATABASE mybatis
COLLATE Chinese_PRC_CI_AS;
GO

SELECT * from ::fn_helpcollations()

CREATE table country (
	id integer primary key IDENTITY(1,1),
	countryname varchar(100) null,
	countrycode varchar(100) null,
);

DROP table country;
DELETE FROM country;

insert country(countryname, countrycode) values(N'Chinese', 'CN'), ('Amercia', 'EN'), ('Janpan', 'JA')
insert country(countryname, countrycode) values(N'印度','IN')

select * from dbo.country

