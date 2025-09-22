# Tech Assignment - Customer Management App 
A full-stack web application  for managing customer and address information. Built using React for the frontend, Node.js and Express for the backend, and SQLite as the database.

## 🛠 Tools & Libraries Used

### 🖥️ Frontend
![React](https://img.shields.io/badge/Frontend-React-blue)
![CSS](https://img.shields.io/badge/Styling-CSS3-blueviolet)
- React.js (with Class Components)
- CSS (Responsive styling)
- React Router for navigation
- React Icons
- React Pop-up
- axios

### 🌐 Backend
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/API-Express-red)
- Node.js
- Express.js
- CORS for cross-origin requests
- sqlite3 for database access
- nodemon for server auto-reloading

### 💽 Database
![SQLite](https://img.shields.io/badge/Database-SQLite3-lightgrey)
- SQLite (with `sqlite3` and `sqlite` packages)
- Used **SQLite CLI** to create and manage tables directly and generate the `.db` file (`customersInfo.db`), which is accessed by the Node.js backend via the `sqlite3` and `sqlite` packages.

`customersInfo.db` has two tables: one for `customers` and one for their `addresses`.

### `customers` Table Schema



| Column      | Type    | Constraints               | Description              |
|-------------|---------|---------------------------|--------------------------|
| id          | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier        |
| first_name  | TEXT    | NOT NULL                  | Customer's first name    |
| last_name   | TEXT    | NOT NULL                  | Customer's last name     |
| phone_number| TEXT    | NOT NULL UNIQUE           | Customer's phone number  |

---

### `addresses` Table Schema

| Column         | Type    | Constraints               | Description              |
|----------------|---------|---------------------------|--------------------------|
| id             | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier        |
| customer_id    | INTEGER | FOREIGN KEY (customers)   | Links to the customer    |
| address_details| TEXT    | NOT NULL                  | Street, building, etc.   |
| city           | TEXT    | NOT NULL                  | City name                |
| state          | TEXT    | NOT NULL                  | State name               |
| pin_code       | TEXT    | NOT NULL                  | Postal/ZIP code          |


This structure creates a **one-to-many relationship**:  
👉 One customer can have multiple addresses.



### 📂 Folder Structure
```
customer-management-app/
│
├── client/                 # React frontend
│   |
│   ├── src/
│       ├── components/     # UI Components
│       │   ├── Banner/
│       │   ├── CreateCustomerForm/
│       │   ├── CustomerDetailsPage/
│       │   ├── CustomerFormPage/
│       │   ├── CustomerListPage/
│       │   ├── EditAndDeletePopUp/
│       │   ├── EditCustomerForm/
│       │   └── FiltersGroup/
│       ├── Data/           # Shared data (cities, states)
│       ├── App.js          # React root entry point
│
│   
│   
│
├── server/                 # Node.js backend
│   ├── customersInfo.db    # SQLite database
│   ├── index.js            # Express server
│   ├── index.http          # API test requests 
│
│
└── README.md
```
