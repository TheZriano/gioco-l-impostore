CREATE TABLE games (
    "code" CHAR(6) PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "players" JSONB NOT NULL,
    "expires_at" TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);
