-- ----------------------------
-- Table structure for `paper`
-- ----------------------------
DROP TABLE IF EXISTS paper;
CREATE TABLE paper (
  paper_id bigint NOT NULL PRIMARY KEY IDENTITY(1,1),
  name varchar(100) NOT NULL,
  number int NOT NULL,
  detail varchar(200),
);

-- ----------------------------
-- Records of paper
-- ----------------------------
SET IDENTITY_INSERT dbo.paper ON;
INSERT INTO paper(paper_id, name, number, detail) VALUES (1, '机器学习', 2, 'mlmlmlml');
INSERT INTO paper(paper_id, name, number, detail) VALUES (2, '深度学习', 3, 'dldldl');
INSERT INTO paper(paper_id, name, number, detail) VALUES (3, '大数据', 4, 'bdbdbd');
SET IDENTITY_INSERT dbo.paper OFF;