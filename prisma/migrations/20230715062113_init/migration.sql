-- CreateTable
CREATE TABLE "album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "album_artists_artist" (
    "albumId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,

    PRIMARY KEY ("albumId", "artistId"),
    CONSTRAINT "album_artists_artist_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "album" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "album_artists_artist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "song_artists_artist" (
    "songId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,

    PRIMARY KEY ("songId", "artistId"),
    CONSTRAINT "song_artists_artist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "song_artists_artist_songId_fkey" FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "trackNum" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "imgSong" TEXT NOT NULL,
    "quality" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "refreshed" BOOLEAN NOT NULL,
    "albumId" INTEGER,
    CONSTRAINT "song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "album" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "song_genres_genre" (
    "songId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    PRIMARY KEY ("songId", "genreId"),
    CONSTRAINT "song_genres_genre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "song_genres_genre_songId_fkey" FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "lastLoginAt" DATETIME NOT NULL,
    "yandexToken" TEXT NOT NULL,
    "yandexTokenLife" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "IDX_bce2fa2c71f571a2443d218d1f" ON "album_artists_artist"("artistId");

-- CreateIndex
CREATE INDEX "IDX_042267cf16006041192432f831" ON "album_artists_artist"("albumId");

-- CreateIndex
CREATE INDEX "song_artists_artist_songId_idx" ON "song_artists_artist"("songId");

-- CreateIndex
CREATE INDEX "song_artists_artist_artistId_idx" ON "song_artists_artist"("artistId");

-- CreateIndex
CREATE INDEX "song_genres_genre_songId_idx" ON "song_genres_genre"("songId");

-- CreateIndex
CREATE INDEX "song_genres_genre_genreId_idx" ON "song_genres_genre"("genreId");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
