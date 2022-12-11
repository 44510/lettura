-- Your SQL goes here
CREATE TABLE IF NOT EXISTS channels (
  id INTEGER NOT NULL PRIMARY KEY,
  uuid VARCHAR NOT NULL UNIQUE,
  title VARCHAR NOT NULL,
  link VARCHAR NOT NULL,
  feed_url VARCHAR NOT NULL,
  image VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  pub_date DATETIME NOT NULL,
  sync_interval INTEGER NOT NULL DEFAULT 0,
  last_sync_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sort INTEGER NOT NULL DEFAULT 0,
  create_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("link", "title")
);


CREATE TABLE IF NOT EXISTS articles (
  id INTEGER NOT NULL PRIMARY KEY,
  uuid VARCHAR NOT NULL UNIQUE,
  channel_uuid VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  link VARCHAR NOT NULL,
  feed_url VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  content VARCHAR NOT NULL,
  pub_date DATETIME NOT NULL,
  author VARCHAR NOT NULL,
  create_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_status INTEGER NOT NULL DEFAULT 1,  -- 1: 未读 2: 已读
  UNIQUE("link", "title")
);
