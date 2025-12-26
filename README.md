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
git checkout feature/sprint1

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

### Database Migration: Office Hours
If you're using Supabase (recommended), create an `office_hours` table to persist staff office hours. A migration SQL file has been added at `backend/db/migrations/create_office_hours.sql` — run it in the Supabase SQL editor.

Table schema includes: `id`, `staff_id` (references `users.id`), `day`, `start_time`, `end_time`, `location`, and `created_at`.

API Endpoints added:
- `GET /api/staff/:id/office-hours` — fetch office hours for staff member
- `POST /api/staff/:id/office-hours` — replace office hours (body: `{ hours: [{ day, start_time, end_time, location? }, ...] }`)
- `GET /api/staff/:id/subjects` — fetch subjects assigned to a staff member
- `POST /api/staff/:id/subjects` — replace subject assignments for a staff member (body: `{ subject_ids: [1,2,3] }`)

Database Migrations:
- `backend/db/migrations/create_office_hours.sql` — add `office_hours` table
- `backend/db/migrations/create_staff_subjects.sql` — add `staff_subjects` join table for assigning staff to subjects

Notes:
- Run the two SQL migrations in your Supabase SQL editor to persist data.
- Consider adding server-side authorization checks to ensure only admins can POST `/api/staff/:id/subjects` (currently the UI prevents others, but backend checks are recommended).


