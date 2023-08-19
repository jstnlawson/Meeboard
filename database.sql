
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "samples" (
	"id" SERIAL PRIMARY KEY,
	"sample_name" VARCHAR (80) UNIQUE NOT NULL,
	"audio_URL" VARCHAR (2083) UNIQUE NOT NULL,
	"user_id" INT REFERENCES "user"
	);