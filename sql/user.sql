DROP TABLE IF EXISTS `User`

CREATE TABLE `User`(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `email` varchar(255) DEFAULT NULL unique,
    `phonenumber` varchar(255) DEFAULT NULL unique,
    `password` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
)