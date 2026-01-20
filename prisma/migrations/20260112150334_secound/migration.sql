-- DropForeignKey
ALTER TABLE `consultation` DROP FOREIGN KEY `Consultation_psy_id_fkey`;

-- AlterTable
ALTER TABLE `consultation` MODIFY `psy_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_psy_id_fkey` FOREIGN KEY (`psy_id`) REFERENCES `Psy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
