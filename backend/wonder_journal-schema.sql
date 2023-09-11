CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE moments (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE
);

CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  url TEXT,
  type TEXT,
  moment_id INTEGER NOT NULL
    REFERENCES moments ON DELETE CASCADE
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE
);

CREATE TABLE moments_tags (
  tag_id INTEGER  
    REFERENCES tags ON DELETE CASCADE,
  moment_id INTEGER
    REFERENCES moments ON DELETE CASCADE,
  PRIMARY KEY (tag_id, moment_id)
);
