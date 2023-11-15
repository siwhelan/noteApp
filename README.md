# noteApp 📝📚🔍

`noteApp` is a microservice API designed for efficient note management. It offers functionalities to store, update, retrieve, and delete notes.

## Features
### 🖋️ Note Management
- **Store**: Securely save notes.
- **Update**: Easily modify existing notes.
- **Retrieve**: Access notes anytime.
- **Delete**: Remove unneeded notes.

### 🧪 Testing
- Comprehensive tests for reliability.

### 🏗️ Structure
- **Models**: Efficient data handling.
- **Public/CSS**: User-friendly styling.
- **Routes**: Effective request handling.
- **Views**: Enhanced user interaction.

### 📚 Languages Used
- **EJS**: Templating.
- **JavaScript**: Core functionality.
- **CSS**: Styling.
- **Dockerfile**: Containerization.

## ⚙️ Configuration
Create a `.env` file in the root with:
- `MONGO_URI=mongodb://mongo_db:27017/yourDatabaseName`

## 🚀 Getting Started
### 📦 With npm
1. Clone the repo.
2. Navigate to the directory.
3. Install dependencies: `npm install`.
4. Start the app: `npm start`.
5. Visit `http://localhost:3000`.

### 🐳 With Docker Compose
1. Clone the repo.
2. Navigate to the directory.
3. Start the app: `docker-compose up`.
4. Visit `http://localhost:3000`.

*Note: Includes MongoDB (`noteApp_db_container`) and Node API (`noteApp_API_container`). MongoDB is accessible on port 2717. Ensure Docker and Docker Compose are installed.*

## 👐 Contributing
Feedback, bug reports, and contributions are welcome! 👋
