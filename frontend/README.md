# 🚀 Fullstack Соціальна Мережа

## 📌 Опис проєкту
Цей проєкт є Fullstack додатком соціальної мережі, побудованим за допомогою **React + Vite** (Frontend) та **Node.js + Express + MongoDB (Mongoose)** (Backend).  
Користувачі можуть реєструватися, авторизуватися та переглядати свої профілі.

## 🛠️ Технології
### 📌 **Frontend**
- ⚛ **React** + **Vite**
- 🎨 **SCSS** (Модульні стилі)
- 🚦 **React Router**
- 📦 **Redux Toolkit** (Збереження стану)
- 📡 **Axios** (Запити до API)

### 📌 **Backend**
- 🛠️ **Node.js + Express**
- 💾 **MongoDB + Mongoose**
- 🔐 **JWT (JSON Web Token)**
- 🛡️ **BCrypt** (Хешування паролів)
- 📬 **Express Validator** (Валідація полів)

---

## 📁 **Структура проєкту**


fullstack_project
│── backend/             # Серверна частина
│   ├── controllers/     # Контролери (логіка API)
│   ├── models/         # Моделі Mongoose
│   ├── routes/         # Маршрути Express
│   ├── middleware/     # Middleware (перевірка токена)
│   ├── server.js       # Головний файл сервера
│
│── frontend/            # Клієнтська частина
│   ├── src/
│   │   ├── components/  # Компоненти React
│   │   ├── pages/       # Сторінки (Login, Register, Profile, Home)
│   │   ├── redux/       # Сховище Redux
│   │   ├── styles/      # SCSS стилі
│   │   ├── App.jsx      # Головний компонент
│   │   ├── main.jsx     # Точка входу
│
│── README.md            # Цей файл 😉


🔧 Як запустити проєкт
📌 1. Клонування репозиторію
         git clone https://github.com/your-username/
         cd social-network

📌 2. Налаштування Backend
cd backend
npm install

 Налаштуйте .env у папці backend:
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key

 Запускаємо сервер:
   npm start

📌 3. Налаштування Frontend
          cd frontend
          npm install
 Запускаємо React-додаток:
   npm run dev

🔐 Функціонал
✅ Реєстрація та вхід (з JWT)
✅ Перевірка токена при завантаженні сторінки
✅ Захищений маршрут /profile
✅ Збереження стану в Redux
✅ Вихід із системи


📜 API Маршрути
📌 Аутентифікація
Метод	Маршрут	                Опис
POST	/api/auth/register	    Реєстрація користувача
POST	/api/auth/login	        Авторизація користувача
GET	    /api/auth/me	        Отримання даних про користувача

📌 Автор
👤 Андрій



 


