==============================================
 TEAM TASK MANAGER — MERN + JWT
==============================================

A full-stack team task manager with role-based access control (Admin / Member).
Admins manage projects, members and tasks; Members see and update only what's assigned to them.

----------------------------------------------
 FEATURES
----------------------------------------------
- JWT-based authentication (signup, login, logout) with bcrypt password hashing
- Role-based access control (admin vs member) enforced via Express middleware
- Projects: title, description, deadline, members, createdBy
- Tasks: title, description, project, assignedTo, status, priority, dueDate
  * Status: Pending, In Progress, Completed
  * Priority: Low, Medium, High
  * Overdue auto-detected when dueDate < now and status != Completed
- Dashboard: total projects, total/pending/in-progress/completed/overdue tasks with progress bars
- Clean responsive UI (cards, tables, status & priority badges)
- REST API with input validation (express-validator)

----------------------------------------------
 TECH STACK
----------------------------------------------
Frontend : React 18 (Vite) + React Router + Axios
Backend  : Node.js + Express
Database : MongoDB (Mongoose)
Auth     : JWT + bcryptjs
Deploy   : Railway (two services: backend + frontend)

----------------------------------------------
 FOLDER STRUCTURE
----------------------------------------------
team-task-manager/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── project.controller.js
│   │   ├── task.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── project.routes.js
│   │   ├── task.routes.js
│   │   └── dashboard.routes.js
│   ├── seed/seed.js
│   ├── utils/generateToken.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/client.js
│   │   ├── components/ (Navbar, ProtectedRoute)
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/ (Landing, Login, Signup, Dashboard, Projects,
│   │   │           ProjectDetails, CreateProject, Tasks, CreateTask)
│   │   ├── utils/helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
└── README.txt

----------------------------------------------
 INSTALLATION (LOCAL)
----------------------------------------------
Prereqs: Node.js >= 18, MongoDB running locally OR a MongoDB Atlas URI.

1) Backend
   cd backend
   cp .env.example .env        # then edit values
   npm install
   npm run seed                # creates demo admin + member + sample data
   npm start                   # runs on http://localhost:5000

2) Frontend
   cd frontend
   cp .env.example .env        # set VITE_API_URL=http://localhost:5000/api
   npm install
   npm run dev                 # runs on http://localhost:5173

----------------------------------------------
 ENVIRONMENT VARIABLES
----------------------------------------------
backend/.env
   MONGO_URI=mongodb+srv://USER:PASS@cluster/team_task_manager
   JWT_SECRET=replace_with_long_random_string
   PORT=5000
   CLIENT_URL=http://localhost:5173      # comma-separate multiple origins, or "*"

frontend/.env
   VITE_API_URL=http://localhost:5000/api

----------------------------------------------
 API ENDPOINTS
----------------------------------------------
Auth (public):
   POST   /api/auth/signup        { name, email, password, role? }
   POST   /api/auth/login         { email, password }
   GET    /api/auth/me            (auth) returns current user

Users (auth):
   GET    /api/users              list users (used to assign members)

Projects (auth, create/update/delete = admin):
   POST   /api/projects           { title, description, deadline, members[] }
   GET    /api/projects           admin: all, member: only projects they belong to
   GET    /api/projects/:id       project + its tasks
   PUT    /api/projects/:id
   DELETE /api/projects/:id

Tasks (auth, create/delete = admin; members can only update status of own tasks):
   POST   /api/tasks              { title, description, project, assignedTo, status, priority, dueDate }
   GET    /api/tasks              admin: all, member: only tasks assigned to them
   GET    /api/tasks/:id
   PUT    /api/tasks/:id          admin: any field; member: status only on own task
   DELETE /api/tasks/:id

Dashboard (auth):
   GET    /api/dashboard/stats    { totalProjects, totalTasks, pending, inProgress, completed, overdue }

All authed routes require:  Authorization: Bearer <JWT>

----------------------------------------------
 ROLE-BASED ACCESS CONTROL
----------------------------------------------
Admin:
  - Create / edit / delete projects
  - Add team members to projects
  - Create / edit / delete tasks, assign tasks
  - View ALL projects, tasks, dashboard data

Member:
  - View only projects they are members of
  - View only tasks assigned to them
  - Update STATUS of their own tasks (no other field, no other user's tasks)
  - Cannot create projects or tasks

Enforced by:
  - middleware/auth.js  -> protect (JWT) and adminOnly (role gate)
  - controllers         -> ownership filtering on list/get/update

----------------------------------------------
 DEPLOYMENT ON RAILWAY
----------------------------------------------
Recommended: deploy backend and frontend as TWO Railway services from the same repo.

A) MongoDB
   Either add the MongoDB plugin in Railway (gives you a MONGO_URL),
   or use MongoDB Atlas and copy its connection string.

B) Backend service
   1. New Project -> Deploy from GitHub repo -> select this repo
   2. Set "Root Directory" = backend
   3. Variables:
        MONGO_URI   = <your mongo connection string>
        JWT_SECRET  = <long random string>
        PORT        = 5000      (Railway will inject its own PORT — server uses process.env.PORT)
        CLIENT_URL  = https://<your-frontend>.up.railway.app
   4. Build command:  npm install
   5. Start command:  npm start
   6. (Once) open Railway "Run Command" or local shell pointed at the deployed DB:
        npm run seed
      to create demo accounts.

C) Frontend service
   1. New Service in the same project -> Deploy from GitHub repo
   2. Set "Root Directory" = frontend
   3. Variables:
        VITE_API_URL = https://<your-backend>.up.railway.app/api
   4. Build command:  npm install && npm run build
   5. Start command:  npm run preview     (Vite preview server, binds to $PORT)
   6. After both are live, update backend CLIENT_URL with the frontend URL and redeploy.

CORS:
   server.js whitelists CLIENT_URL (comma-separated supported, "*" allowed).
   Make sure the deployed frontend URL matches exactly.

----------------------------------------------
 DEMO CREDENTIALS
----------------------------------------------
Admin:
   email:    admin@test.com
   password: Admin@123

Member:
   email:    member@test.com
   password: Member@123

(Created by `npm run seed` in backend/.)

----------------------------------------------
 LIVE APPLICATION URL
----------------------------------------------
Frontend: <REPLACE_WITH_RAILWAY_FRONTEND_URL>
Backend : <REPLACE_WITH_RAILWAY_BACKEND_URL>

----------------------------------------------
 GITHUB REPOSITORY
----------------------------------------------
<REPLACE_WITH_GITHUB_REPO_LINK>

----------------------------------------------
 DEMO VIDEO SCRIPT (suggested 2–3 min)
----------------------------------------------
0:00  Intro — "Hi, this is Team Task Manager — a MERN app with JWT auth and role-based access."
0:15  Show landing page; click Login.
0:25  Login as admin@test.com / Admin@123. Land on Admin Dashboard — explain the stat cards
      (total projects, total/pending/in-progress/completed/overdue tasks).
0:55  Open Projects page. Create a new project (title, description, deadline, pick members).
1:25  Open the project; create a new task (assignee, priority, status, due date).
1:50  Go to Tasks; show status update select and the "Overdue" badge for past-due tasks.
2:05  Logout. Login as member@test.com / Member@123.
2:15  Show that the Member dashboard counts only their tasks; Projects/Tasks lists are filtered.
2:30  Update a task status as the member; show that admin-only actions (delete, create) aren't available.
2:50  Outro — mention tech stack (React, Node, Express, MongoDB, JWT) and Railway deployment.

==============================================
