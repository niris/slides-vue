DROP TABLE IF EXISTS post;
CREATE TABLE post(
	id      SERIAL PRIMARY KEY,
	created_at timestamp not null default CURRENT_TIMESTAMP,
	message TEXT
);
DROP TABLE IF EXISTS comment;
CREATE TABLE comment(
	id      SERIAL PRIMARY KEY,
	post_id SERIAL not null,
	created_at timestamp not null default CURRENT_TIMESTAMP,
	message TEXT,

	CONSTRAINT fk_post
		FOREIGN KEY(post_id)
			REFERENCES post(id)
			ON DELETE CASCADE
);
