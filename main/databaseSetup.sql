CREATE TABLE games (
    "code" CHAR(6) PRIMARY KEY,
    "status" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "impostor" TEXT,
    "players" JSONB NOT NULL,
    "expires_at" TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);
