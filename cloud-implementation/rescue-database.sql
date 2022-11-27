CREATE DATABASE rescue;
USE rescue;

CREATE TABLE messages(
  nodeId INT PRIMARY KEY,
  severity VARCHAR(255);
  latitude DOUBLE(15,15),
  longitude DOUBLE(15,15)
 );
