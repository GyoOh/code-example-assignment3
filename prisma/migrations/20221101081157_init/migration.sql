/*
  Warnings:

  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `totalComments` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalLikes` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Comment` MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Like` MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `code` TEXT NOT NULL,
    MODIFY `totalComments` INTEGER NOT NULL DEFAULT 0,
    MODIFY `totalLikes` INTEGER NOT NULL DEFAULT 0;
