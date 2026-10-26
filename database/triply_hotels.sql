-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: triply
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destination_id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `image` text,
  `rating` decimal(2,1) DEFAULT '0.0',
  `price_per_night` decimal(10,2) DEFAULT '0.00',
  `location` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_hotels_destination` (`destination_id`),
  CONSTRAINT `fk_hotels_destination` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (1,1,'Matfen Hall','https://upload.wikimedia.org/wikipedia/commons/2/2b/Piers_Gate_-_geograph.org.uk_-_935628.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled',4.7,120.00,'Northumberland'),(2,2,'Penrhiw Priory',NULL,4.5,145.00,'Pembrokeshire'),(3,3,'Hotel Portmeirion','https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Aerial_image_of_Portmeirion%2C_Gwynedd%2C_Wales_%28Cymru%29_-_pentref_Eidalaidd%2C_Rhagfyr_2022_35.jpg/1280px-Aerial_image_of_Portmeirion%2C_Gwynedd%2C_Wales_%28Cymru%29_-_pentref_Eidalaidd%2C_Rhagfyr_2022_35.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.8,180.00,'Portmeirion'),(4,4,'Aram Hotel Masuleh',NULL,4.6,210.00,'Masuleh'),(5,5,'Kandovan Laleh International Rocky Hotel','https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/20231118_Laleh_Hotel_Kandovan.jpg/1280px-20231118_Laleh_Hotel_Kandovan.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.9,260.00,'Kandovan'),(6,6,'Alimestan Eco Lodge',NULL,4.7,320.00,'Filband'),(7,7,'Amasra Diamond Hotel',NULL,4.5,120.00,'Amasra'),(8,8,'Gökçeada Helios Hotel',NULL,4.8,145.00,'Gökçeada'),(9,9,'Liya Boutique Hotel & Suites',NULL,4.6,180.00,'Akyaka'),(10,10,'Abha Palace Hotel','https://upload.wikimedia.org/wikipedia/commons/8/88/Abha_from_Abha_Palace_Hotel.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled',4.9,210.00,'Rijal Almaa'),(11,11,'Shada Hotel Al Ula',NULL,4.7,260.00,'Al Disah'),(12,12,'Al Baha Palace Hotel',NULL,4.5,320.00,'Dhee Ayn'),(13,13,'Hatta Guest House',NULL,4.8,120.00,'Wadi Shawka'),(14,14,'Al Wathba, a Luxury Collection Desert Resort & Spa',NULL,4.6,145.00,'Al Wathba'),(15,15,'Moon Retreat by Sharjah Collection',NULL,4.9,180.00,'Mleiha'),(16,16,'Gadara Rent Room',NULL,4.7,210.00,'Umm Qais'),(17,17,'Dana Guesthouse',NULL,4.5,260.00,'Dana'),(18,18,'Ajloun Forest Reserve Cabins',NULL,4.8,320.00,'Ajloun'),(19,19,'Vardzia Resort',NULL,4.6,120.00,'Vardzia'),(20,20,'Martvili Palace',NULL,4.9,145.00,'Martvili Canyon'),(21,21,'Guest House Omalo',NULL,4.7,180.00,'Omalo'),(22,22,'Siwa Paradise Hotel','https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Siwa_Safari_Paradise_Hotel_%2879928%29.jpg/1280px-Siwa_Safari_Paradise_Hotel_%2879928%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.5,210.00,'Siwa Oasis'),(23,23,'Beir El Gabal Hotel',NULL,4.8,260.00,'Dakhla Oasis'),(24,24,'Helnan Auberge Fayoum',NULL,4.6,320.00,'Fayoum'),(25,25,'Arawan Boutique Hotel',NULL,4.9,120.00,'Tannourine'),(26,26,'Beit El Barbara',NULL,4.7,145.00,'Barbara'),(27,27,'Gaits of Glory Resort',NULL,4.5,180.00,'Kfar Matta'),(28,28,'Our Habitas Ras Abrouq',NULL,4.8,210.00,'Zekreet'),(29,29,'Al Sultan Beach Resort',NULL,4.6,260.00,'Al Thakira'),(30,30,'Al Sultan Beach Resort',NULL,4.9,320.00,'Purple Island'),(31,31,'The Heritage Village','https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Heritage_Village-Dubai2855.jpg/1280px-Heritage_Village-Dubai2855.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.7,120.00,'Failaka Island'),(32,32,'Jumeirah Messilah Beach Hotel & Spa',NULL,4.5,145.00,'Kubbar Island'),(33,33,'The Abdali Boulevard Hotel','https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Abdali_Boulevard_-_December_2024.jpg/1280px-Abdali_Boulevard_-_December_2024.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.8,180.00,'Al Abdali'),(34,34,'Al Misfah Hospitality Inn',NULL,4.6,210.00,'Misfat Al Abriyeen'),(35,35,'Anantara Al Jabal Al Akhdar Resort','https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Anantara_Hotel_1_%2836681370374%29.jpg/1280px-Anantara_Hotel_1_%2836681370374%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.9,260.00,'Wadi Bani Habib'),(36,36,'White Sugardunes Beach Resort',NULL,4.7,320.00,'Al Khaluf'),(37,37,'Hawar Resort by Mantis',NULL,4.5,120.00,'Hawar Islands'),(38,38,'Raffles Al Areen Palace Bahrain',NULL,4.8,145.00,'Al Areen'),(39,39,'The Gulf Hotel Bahrain','https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Durrat_Al_Bahrain%2C_Persian_Gulf.JPG/1280px-Durrat_Al_Bahrain%2C_Persian_Gulf.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.6,180.00,'A\'ali'),(40,40,'Hotel Les Amandiers','https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Tafraout_panorama_of_city_centre.JPG/1280px-Tafraout_panorama_of_city_centre.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.9,210.00,'Tafraoute'),(41,41,'Caiat Lounge Refuge',NULL,4.7,260.00,'Akchour'),(42,42,'Legzira Beach Hotel',NULL,4.5,320.00,'Legzira'),(43,43,'Royal Rihana',NULL,4.8,120.00,'Ain Draham'),(44,44,'La Cigale Tabarka',NULL,4.6,145.00,'Tabarka'),(45,45,'Azul Chenini',NULL,4.9,180.00,'Chenini'),(46,46,'Kinabalu Pine Resorts','https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Mount._Kinabalu_-_panoramio.jpg/1280px-Mount._Kinabalu_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.7,210.00,'Kundasang'),(47,47,'Harbour View Hotel Sekinchan',NULL,4.5,260.00,'Sekinchan'),(48,48,'Belum Rainforest Resort','https://upload.wikimedia.org/wikipedia/commons/a/a8/Belum_Rainforest_Resort_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled',4.8,320.00,'Belum'),(49,49,'Khanom Beach Resort & Spa',NULL,4.6,120.00,'Khanom'),(50,50,'Cape Kudu Hotel',NULL,4.9,145.00,'Koh Yao Noi'),(51,51,'Nan Boutique Hotel',NULL,4.7,180.00,'Nan'),(52,52,'Wae Rebo Homestay',NULL,4.5,210.00,'Wae Rebo'),(53,53,'Swiss-Belresort Belitung',NULL,4.8,260.00,'Belitung'),(54,54,'NIHI Sumba','https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Nihi_Sumba.jpg/1280px-Nihi_Sumba.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.6,320.00,'Sumba'),(55,55,'Khinalig Shaiq Guest House',NULL,4.9,120.00,'Khinaliq'),(56,56,'Lahij Rashad Ismayilov Hotel',NULL,4.7,145.00,'Lahic'),(57,57,'Ismayilli Resort Hotel','https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Ilham_Aliyev_and_First_Lady_Mehriban_Aliyeva_attended_inauguration_of_%E2%80%9CBasgal_Resort_%26_Spa%E2%80%9D_hotel_in_Ismayilli_02.jpg/1280px-Ilham_Aliyev_and_First_Lady_Mehriban_Aliyeva_attended_inauguration_of_%E2%80%9CBasgal_Resort_%26_Spa%E2%80%9D_hotel_in_Ismayilli_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.5,180.00,'Ismayilli'),(58,58,'Maison du Clos','https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Jouy-en-Josas_Maison_Blum.jpg/1280px-Jouy-en-Josas_Maison_Blum.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.8,210.00,'Pérouges'),(59,59,'La Bastide de Moustiers',NULL,4.6,260.00,'Moustiers-Sainte-Marie'),(60,60,'Maison Lapopie','https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Maison_Bordes_01.jpg/1280px-Maison_Bordes_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',4.9,320.00,'Saint-Cirq-Lapopie');
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-26  9:35:34
