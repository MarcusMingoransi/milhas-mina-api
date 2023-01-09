/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "first_name" TEXT NOT NULL DEFAULT 'Marcus',
ADD COLUMN     "last_name" TEXT NOT NULL DEFAULT 'Mingoransi',
ADD COLUMN     "password" TEXT;
