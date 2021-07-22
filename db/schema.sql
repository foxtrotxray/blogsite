CREATE TABLE "authors" (
	"author_id" serial NOT NULL,
	"author_name" character varying(100) NOT NULL,
	"author_password" TEXT NOT NULL,
	CONSTRAINT "authors_pk" PRIMARY KEY ("author_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "articles" (
	"article_id" serial NOT NULL,
	"author_id" int NOT NULL,
	"published" timestamp with time zone NOT NULL,
	"title" character varying(510) NOT NULL UNIQUE,
	"content" TEXT NOT NULL,
	CONSTRAINT "articles_pk" PRIMARY KEY ("article_id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "articles" ADD CONSTRAINT "articles_fk0" FOREIGN KEY ("author_id") REFERENCES "authors"("author_id");