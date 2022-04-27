-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema nodejs
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema nodejs
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `nodejs` DEFAULT CHARACTER SET utf8 ;
USE `nodejs` ;

-- -----------------------------------------------------
-- Table `nodejs`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nodejs`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  `age` INT UNSIGNED NOT NULL,
  `married` TINYINT NOT NULL,
  `comment` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb3
COMMENT = '사용자 정보';


-- -----------------------------------------------------
-- Table `nodejs`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nodejs`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `commenter` INT NOT NULL,
  `comment` VARCHAR(100) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `commenter_idx` (`commenter` ASC) VISIBLE,
  CONSTRAINT `commenter`
    FOREIGN KEY (`commenter`)
    REFERENCES `nodejs`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = '댓글';


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
