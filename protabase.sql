-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: protabase
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `allergie`
--

DROP TABLE IF EXISTS `allergie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allergie` (
  `idAllergie` int NOT NULL AUTO_INCREMENT,
  `medicamentInterdit` int NOT NULL,
  `allergieNom` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idAllergie`,`medicamentInterdit`),
  UNIQUE KEY `idAllergie_UNIQUE` (`idAllergie`),
  UNIQUE KEY `Allergiename_UNIQUE` (`allergieNom`),
  KEY `fk_allergie_drug1_idx` (`medicamentInterdit`),
  CONSTRAINT `fk_allergie_drug1` FOREIGN KEY (`medicamentInterdit`) REFERENCES `drug` (`idDrug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allergie`
--

LOCK TABLES `allergie` WRITE;
/*!40000 ALTER TABLE `allergie` DISABLE KEYS */;
/*!40000 ALTER TABLE `allergie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compte`
--

DROP TABLE IF EXISTS `compte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compte` (
  `idCompte` int NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `mdp` varchar(100) DEFAULT NULL,
  `compteType` varchar(45) NOT NULL,
  PRIMARY KEY (`idCompte`),
  UNIQUE KEY `pseudo_UNIQUE` (`pseudo`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `idcompte_UNIQUE` (`idCompte`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compte`
--

LOCK TABLES `compte` WRITE;
/*!40000 ALTER TABLE `compte` DISABLE KEYS */;
INSERT INTO `compte` VALUES (8,'Deranger','derangerdupont12@gmail.com','M.Valette','Docteur'),(9,'Beranger','berangerdupont12@gmail.com','mdp','Client'),(10,'Gerome','gerome@gmail.com','Azerty','Admin'),(12,'Admin','admin@gmail.com','admin','Admin'),(13,'lagaffe','lagaffe@unknow.com','Lagaffe1!','Client');
/*!40000 ALTER TABLE `compte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drug`
--

DROP TABLE IF EXISTS `drug`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drug` (
  `idDrug` int NOT NULL AUTO_INCREMENT,
  `drugName` varchar(45) NOT NULL,
  `drugValue` varchar(45) NOT NULL,
  `drugIdImg` varchar(45) NOT NULL,
  `drugDescription` varchar(45) DEFAULT NULL,
  `drugPrice` float DEFAULT NULL,
  `drugStock` int(10) unsigned zerofill DEFAULT NULL COMMENT 'les stock actuel de l''hopital, on l''emèche de descendre en dessous de 0 car il n''y a pas de stock imaginaire',
  PRIMARY KEY (`idDrug`),
  UNIQUE KEY `idDrug_UNIQUE` (`idDrug`),
  UNIQUE KEY `drugName_UNIQUE` (`drugName`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drug`
--

LOCK TABLES `drug` WRITE;
/*!40000 ALTER TABLE `drug` DISABLE KEYS */;
INSERT INTO `drug` VALUES (1,'protaprane','ProtaPranne','https://imagedelelementconcerne.png','1 cachet par jour',0,NULL);
/*!40000 ALTER TABLE `drug` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `traitement`
--

DROP TABLE IF EXISTS `traitement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `traitement` (
  `idTraitement` int NOT NULL AUTO_INCREMENT,
  `traitementNom` varchar(45) DEFAULT NULL,
  `traitementExpirationDate` date DEFAULT NULL,
  `traitementValiditeDate` date DEFAULT NULL,
  PRIMARY KEY (`idTraitement`),
  UNIQUE KEY `idTraitement_UNIQUE` (`idTraitement`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `traitement`
--

LOCK TABLES `traitement` WRITE;
/*!40000 ALTER TABLE `traitement` DISABLE KEYS */;
INSERT INTO `traitement` VALUES (1,'protatraitement','2022-10-05','2010-10-05');
/*!40000 ALTER TABLE `traitement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `traitement_has_drugs`
--

DROP TABLE IF EXISTS `traitement_has_drugs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `traitement_has_drugs` (
  `traitement_idTraitement` int NOT NULL,
  `drugs_idDrug` int NOT NULL,
  PRIMARY KEY (`traitement_idTraitement`,`drugs_idDrug`),
  KEY `fk_traitement_has_drugs_drugs1_idx` (`drugs_idDrug`),
  KEY `fk_traitement_has_drugs_traitement_idx` (`traitement_idTraitement`),
  CONSTRAINT `fk_traitement_has_drugs_drugs1` FOREIGN KEY (`drugs_idDrug`) REFERENCES `drug` (`idDrug`),
  CONSTRAINT `fk_traitement_has_drugs_traitement` FOREIGN KEY (`traitement_idTraitement`) REFERENCES `traitement` (`idTraitement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `traitement_has_drugs`
--

LOCK TABLES `traitement_has_drugs` WRITE;
/*!40000 ALTER TABLE `traitement_has_drugs` DISABLE KEYS */;
/*!40000 ALTER TABLE `traitement_has_drugs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `idUtilisateur` int NOT NULL AUTO_INCREMENT,
  `idCompte` int NOT NULL,
  `nom` varchar(45) NOT NULL,
  `prenom` varchar(45) DEFAULT NULL,
  `adresse` varchar(45) DEFAULT NULL,
  `idImg` varchar(500) DEFAULT NULL,
  `codeBarre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idUtilisateur`,`idCompte`),
  UNIQUE KEY `idClient_UNIQUE` (`idUtilisateur`),
  UNIQUE KEY `ClientIdentiteimg_UNIQUE` (`idImg`),
  UNIQUE KEY `clientCodeBarre_UNIQUE` (`codeBarre`),
  KEY `fk_client_compte1_idx` (`idCompte`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (1,0,'JuTerrible','RiTerrible','25 avenues des problemes','https://imgidentite.fr',NULL),(2,8,'Lagaffe','Deranger',NULL,'https://www.soartstudio.fr/wp-content/uploads/2019/09/Identite-1.jpg','chocolat'),(3,9,'Lagaffe','Beranger',NULL,'https://static9.depositphotos.com/1074452/1184/i/600/depositphotos_11843630-stock-photo-jpg-key-shows-image-format.jpg',NULL),(4,10,'Lagaffe','Gerome',NULL,'https://www.soartstudio.fr/wp-content/uploads/2023/09/Identite-1.jpg',NULL),(5,12,'Monsigneur','Administrateur',NULL,'https://img-19.ccm2.net/cI8qqj-finfDcmx6jMK6Vr-krEw=/1500x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg','vanille'),(6,13,'Gaston','Lagaffe',NULL,'zmgrlmhndlnhboglsj,epfsporn gs',NULL);
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur_a_allergie`
--

DROP TABLE IF EXISTS `utilisateur_a_allergie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur_a_allergie` (
  `utilisateur_idClient` int NOT NULL,
  `allergie_idAllergie` int NOT NULL,
  PRIMARY KEY (`utilisateur_idClient`,`allergie_idAllergie`),
  KEY `fk_client_has_allergie_allergie1_idx` (`allergie_idAllergie`),
  KEY `fk_client_has_allergie_client1_idx` (`utilisateur_idClient`),
  CONSTRAINT `fk_client_has_allergie_allergie1` FOREIGN KEY (`allergie_idAllergie`) REFERENCES `allergie` (`idAllergie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur_a_allergie`
--

LOCK TABLES `utilisateur_a_allergie` WRITE;
/*!40000 ALTER TABLE `utilisateur_a_allergie` DISABLE KEYS */;
/*!40000 ALTER TABLE `utilisateur_a_allergie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur_a_traitement`
--

DROP TABLE IF EXISTS `utilisateur_a_traitement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur_a_traitement` (
  `utilisateur_idClient` int NOT NULL,
  `traitement_idTraitement` int NOT NULL,
  PRIMARY KEY (`utilisateur_idClient`,`traitement_idTraitement`),
  KEY `fk_client_has_traitement_traitement1_idx` (`traitement_idTraitement`),
  KEY `fk_client_has_traitement_client1_idx` (`utilisateur_idClient`),
  CONSTRAINT `fk_client_has_traitement_traitement1` FOREIGN KEY (`traitement_idTraitement`) REFERENCES `traitement` (`idTraitement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur_a_traitement`
--

LOCK TABLES `utilisateur_a_traitement` WRITE;
/*!40000 ALTER TABLE `utilisateur_a_traitement` DISABLE KEYS */;
/*!40000 ALTER TABLE `utilisateur_a_traitement` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-15 15:25:10
