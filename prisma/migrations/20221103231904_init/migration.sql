-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `postId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Like` ADD COLUMN `commentId` INTEGER NULL,
    ADD COLUMN `postId` INTEGER NULL;
