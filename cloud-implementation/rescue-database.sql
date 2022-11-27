CREATE DATABASE rescue;
USE rescue;

CREATE TABLE messages(
  nodeId INT PRIMARY KEY,
  severity VARCHAR(255),
  latitude VARCHAR(255),
  longitude VARCHAR(255)
 );
