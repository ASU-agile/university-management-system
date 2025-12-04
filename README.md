# University Management System
A simple university management system built with Vite + React and Node.js.  
Currently, the **Facilities Module** is implemented.

## Features
### Facilities Module
- **Users**
  - View available rooms
  - Book rooms
- **Admin**
  - Add rooms
  - Edit rooms
  - Delete rooms
  - Register users

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Package Manager:** npm

## Project Structure
```

root/
 ├── backend/      # Express backend
 ├── frontend/     # Vite + React frontend 
 └── README.md

```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/ASU-agile/university-management-system.git
cd university-management-system
git checkout dev

### 2. Open the Project in VS Code
Open the folder normally.

### 3. Backend Setup
```bash
cd backend
npm install
npm start
```
Backend should be running on **port 5000**.

### 4. Frontend Setup
Open a new terminal in VS Code.
```bash
cd frontend
npm install
npm run dev
```
You should get a local URL like:
```
http://localhost:15731
```
Open it in your browser.

##**Deployment**
###**Backend**

The backend is deployed on Railway. All changes merged into the dev branch are automatically deployed.

Live API URL: [University Management System](https://ums-production-7f8b.up.railway.app/)
