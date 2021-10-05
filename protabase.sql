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
  `Allergiename` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idAllergie`),
  UNIQUE KEY `idAllergie_UNIQUE` (`idAllergie`),
  UNIQUE KEY `Allergiename_UNIQUE` (`Allergiename`)
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
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client` (
  `idClient` int NOT NULL AUTO_INCREMENT,
  `Clientname` varchar(45) NOT NULL,
  `ClientIdentiteimg` varchar(45) DEFAULT NULL,
  `ClientID` varchar(45) NOT NULL,
  PRIMARY KEY (`idClient`,`ClientID`),
  UNIQUE KEY `idClient_UNIQUE` (`idClient`),
  UNIQUE KEY `ClientID_UNIQUE` (`ClientID`),
  UNIQUE KEY `ClientIdentiteimg_UNIQUE` (`ClientIdentiteimg`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (1,'JuTerrible','https://imgidentite.fr','JuTerrible');
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_has_allergie`
--

DROP TABLE IF EXISTS `client_has_allergie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_has_allergie` (
  `client_idClient` int NOT NULL,
  `allergie_idAllergie` int NOT NULL,
  PRIMARY KEY (`client_idClient`,`allergie_idAllergie`),
  KEY `fk_client_has_allergie_allergie1_idx` (`allergie_idAllergie`),
  KEY `fk_client_has_allergie_client1_idx` (`client_idClient`),
  CONSTRAINT `fk_client_has_allergie_allergie1` FOREIGN KEY (`allergie_idAllergie`) REFERENCES `allergie` (`idAllergie`),
  CONSTRAINT `fk_client_has_allergie_client1` FOREIGN KEY (`client_idClient`) REFERENCES `client` (`idClient`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_has_allergie`
--

LOCK TABLES `client_has_allergie` WRITE;
/*!40000 ALTER TABLE `client_has_allergie` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_has_allergie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_has_traitement`
--

DROP TABLE IF EXISTS `client_has_traitement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_has_traitement` (
  `client_idClient` int NOT NULL,
  `traitement_idTraitement` int NOT NULL,
  PRIMARY KEY (`client_idClient`,`traitement_idTraitement`),
  KEY `fk_client_has_traitement_traitement1_idx` (`traitement_idTraitement`),
  KEY `fk_client_has_traitement_client1_idx` (`client_idClient`),
  CONSTRAINT `fk_client_has_traitement_traitement1` FOREIGN KEY (`traitement_idTraitement`) REFERENCES `traitement` (`idTraitement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_has_traitement`
--

LOCK TABLES `client_has_traitement` WRITE;
/*!40000 ALTER TABLE `client_has_traitement` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_has_traitement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drugs`
--

DROP TABLE IF EXISTS `drugs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drugs` (
  `idDrug` int NOT NULL AUTO_INCREMENT,
  `drugName` varchar(45) NOT NULL,
  `drugValue` varchar(45) NOT NULL,
  `drugIdImg` varchar(45) NOT NULL,
  `drugDescription` varchar(45) DEFAULT NULL,
  `drugPrice` float DEFAULT NULL,
  PRIMARY KEY (`idDrug`),
  UNIQUE KEY `idDrug_UNIQUE` (`idDrug`),
  UNIQUE KEY `drugName_UNIQUE` (`drugName`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drugs`
--

LOCK TABLES `drugs` WRITE;
/*!40000 ALTER TABLE `drugs` DISABLE KEYS */;
INSERT INTO `drugs` VALUES (1,'protaprane','F&è\"éèàà','https://imagedelelementconcerne.png','1 cachet par jour',0);
/*!40000 ALTER TABLE `drugs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `traitement`
--

DROP TABLE IF EXISTS `traitement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `traitement` (
  `idTraitement` int NOT NULL AUTO_INCREMENT,
  `Traitementname` varchar(45) DEFAULT NULL,
  `TraitementExpirationDate` date DEFAULT NULL,
  `TraitementValiditeDate` date DEFAULT NULL,
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
  CONSTRAINT `fk_traitement_has_drugs_drugs1` FOREIGN KEY (`drugs_idDrug`) REFERENCES `drugs` (`idDrug`),
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-05 15:33:44
