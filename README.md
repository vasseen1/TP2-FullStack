# TP2 FullStack - Application de Gestion d'Événements

Application web complète de gestion d'événements et d'artistes, développée avec Spring Boot (backend) et Angular (frontend), déployée avec Docker.

## 📋 Table des matières

- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Architecture du projet](#architecture-du-projet)
- [Installation et lancement](#installation-et-lancement)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [API Backend](#api-backend)

## 🛠 Technologies utilisées

### Backend
- **Java 17**
- **Spring Boot**
- **Hibernate/JPA**
- **Maven**

### Frontend
- **Angular CLI 20.3.9**
- **TypeScript**
- **HTML/CSS**
- **Nginx** (pour le déploiement)

### DevOps
- **Docker**
- **Docker Compose**

## 📦 Prérequis

- [Docker](https://www.docker.com/get-started) (version 20.10 ou supérieure)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 ou supérieure)

## 🏗 Architecture du projet

```
TP2-FullStack/
├── docker-compose.yml          # Configuration Docker Compose
├── Dockerfile                  # Dockerfile du backend
├── insert.sh                   # Script d'initialisation des données
├── event-0.0.1-SNAPSHOT.jar   # Application Spring Boot
└── tp-projet/                 # Application Angular
    ├── Dockerfile
    ├── nginx.conf
    ├── src/
    └── package.json
```

L'application est composée de 3 services Docker :
- **backend** : API REST Spring Boot (port 8080)
- **frontend** : Application Angular servie par Nginx (port 4200)
- **init-data** : Service d'initialisation des données au démarrage

## 🚀 Installation et lancement

### Lancement avec Docker (recommandé)

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd TP2-FullStack
   ```

2. **Rendre le script d'initialisation exécutable**
   ```bash
   chmod +x insert.sh
   ```

3. **Lancer l'application**
   ```bash
   docker-compose up --build
   ```

4. **Accéder à l'application**
   - Frontend : [http://localhost:4200](http://localhost:4200)
   - Backend API : [http://localhost:8080](http://localhost:8080)

### Arrêter l'application

```bash
docker-compose down
```

### Nettoyer complètement (supprimer les volumes)

```bash
docker-compose down -v
```

## 💻 Utilisation

### Lancement en développement (sans Docker)

#### Backend
```bash
java -jar event-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd tp-projet
npm install
ng serve
```

L'application sera accessible sur [http://localhost:4200](http://localhost:4200)

## 📁 Structure du projet

### Backend
```
src/
├── main/
│   ├── java/
│   │   └── com/example/event/
│   │       ├── controller/      # Contrôleurs REST
│   │       ├── model/           # Entités JPA
│   │       ├── repository/      # Repositories
│   │       └── service/         # Services métier
│   └── resources/
│       └── application.properties
```

### Frontend
```
tp-projet/src/
├── app/
│   ├── components/              # Composants Angular
│   ├── services/                # Services Angular
│   └── models/                  # Modèles TypeScript
├── assets/                      # Ressources statiques
└── styles.css                   # Styles globaux
```

## 🔌 API Backend

### Événements

- **GET** `/events` - Liste tous les événements
- **GET** `/events/{id}` - Détails d'un événement
- **POST** `/events` - Créer un événement
- **PUT** `/events/{id}` - Modifier un événement
- **DELETE** `/events/{id}` - Supprimer un événement

### Artistes

- **GET** `/artists` - Liste tous les artistes
- **GET** `/artists/{id}` - Détails d'un artiste
- **POST** `/artists` - Créer un artiste
- **PUT** `/artists/{id}` - Modifier un artiste
- **DELETE** `/artists/{id}` - Supprimer un artiste

### Associations

- **POST** `/events/{eventId}/artists/{artistId}` - Associer un artiste à un événement
- **DELETE** `/events/{eventId}/artists/{artistId}` - Retirer un artiste d'un événement

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte aux différentes tailles d'écran :
- Desktop (> 768px)
- Tablette (480px - 768px)
- Mobile (< 480px)

## 🐛 Dépannage

### Le frontend affiche "Welcome to nginx"
Vérifiez que le fichier `nginx.conf` pointe bien vers `/usr/share/nginx/html/browser`

### Le script d'initialisation ne fonctionne pas
Assurez-vous que :
- Le script `insert.sh` est exécutable : `chmod +x insert.sh`
- Le script utilise `backend:8080` et non `localhost:8080`

### Erreur de connexion au backend
Vérifiez que le healthcheck du backend fonctionne :
```bash
docker-compose ps
```

## 📝 Licence

Ce projet est développé dans le cadre d'un TP académique.

## 👥 Auteurs

Projet réalisé par [Votre Nom]

---

**Note** : Pour toute question ou problème, n'hésitez pas à ouvrir une issue sur le repository.