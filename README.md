# Job Scheduler & Automation System

A full-stack job scheduling and automation dashboard that allows users to create background jobs, run them, track their status, and trigger webhooks upon completion.

> **Note**: This project was built as a skill test assignment for Dotix Technologies.

---

## 📋 Features

- ✅ Create jobs with task name, priority, and JSON payload
- ✅ View all jobs in a dashboard table
- ✅ Filter jobs by status (pending/running/completed) and priority (Low/Medium/High)
- ✅ Run jobs with simulated 3-second processing
- ✅ View detailed job information in a side panel
- ✅ Automatic webhook trigger on job completion
- ✅ Real-time status updates (pending → running → completed)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MySQL |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

## 📁 Project Structure

```
job-scheduler/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateJobForm.jsx    # Modal form to create jobs
│   │   │   ├── Filters.jsx          # Status & priority filters
│   │   │   ├── JobDetail.jsx        # Side panel for job details
│   │   │   └── JobTable.jsx         # Main table component
│   │   ├── pages/
│   │   │   └── Dashboard.jsx        # Main dashboard page
│   │   ├── services/
│   │   │   └── api.js               # API calls to backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/                     # Express Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   └── jobController.js     # Request handlers
│   │   ├── routes/
│   │   │   └── jobs.js              # API route definitions
│   │   ├── services/
│   │   │   ├── jobService.js        # Database CRUD operations
│   │   │   └── webhookService.js    # Webhook trigger logic
│   │   ├── database/
│   │   │   ├── connection.js        # MySQL connection pool
│   │   │   └── schema.sql           # Database schema
│   │   └── app.js                   # Express server entry
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Schema (ER Diagram)

```
┌─────────────────────────────────────────────────────┐
│                       JOBS                           │
├─────────────────────────────────────────────────────┤
│ id           │ INT (PK, AUTO_INCREMENT)             │
│ taskName     │ VARCHAR(255) NOT NULL                │
│ payload      │ JSON                                 │
│ priority     │ ENUM('Low', 'Medium', 'High')        │
│ status       │ ENUM('pending','running','completed')│
│ createdAt    │ TIMESTAMP (auto)                     │
│ updatedAt    │ TIMESTAMP (auto update)              │
│ completedAt  │ TIMESTAMP (nullable)                 │
├─────────────────────────────────────────────────────┤
│ INDEXES: idx_status, idx_priority                   │
└─────────────────────────────────────────────────────┘
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs` | Create a new job |
| GET | `/api/jobs` | Get all jobs (with optional filters) |
| GET | `/api/jobs/:id` | Get single job details |
| POST | `/api/run-job/:id` | Run a job (triggers processing) |

---

### 1. Create Job
```http
POST /api/jobs
Content-Type: application/json

{
  "taskName": "Send Email",
  "priority": "High",
  "payload": { "email": "user@example.com", "subject": "Hello" }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "id": 1,
    "taskName": "Send Email",
    "priority": "High",
    "payload": { "email": "user@example.com", "subject": "Hello" },
    "status": "pending"
  }
}
```

---

### 2. Get All Jobs
```http
GET /api/jobs
GET /api/jobs?status=pending
GET /api/jobs?priority=High
GET /api/jobs?status=completed&priority=High
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    { "id": 1, "taskName": "...", "status": "pending", ... },
    { "id": 2, "taskName": "...", "status": "completed", ... }
  ]
}
```

---

### 3. Get Job by ID
```http
GET /api/jobs/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "taskName": "Send Email",
    "payload": { "email": "user@example.com" },
    "priority": "High",
    "status": "completed",
    "createdAt": "2026-01-06T10:00:00.000Z",
    "updatedAt": "2026-01-06T10:00:05.000Z",
    "completedAt": "2026-01-06T10:00:05.000Z"
  }
}
```

---

### 4. Run Job
```http
POST /api/run-job/:id
```

**Flow:**
1. Status changes to `running`
2. API responds immediately
3. After 3 seconds, status changes to `completed`
4. Webhook is triggered automatically

**Response (200):**
```json
{
  "success": true,
  "message": "Job started running",
  "data": { "id": 1, "status": "running" }
}
```

---

## 🔗 Webhook Integration

When a job completes, the system automatically sends a POST request to the configured webhook URL.

### Webhook Payload
```json
{
  "jobId": 1,
  "taskName": "Send Email",
  "priority": "High",
  "payload": { "email": "user@example.com" },
  "completedAt": "2026-01-06T10:00:05.000Z"
}
```

### How Webhook Works

```
Job Status: COMPLETED
        │
        ▼
┌───────────────────┐
│  webhookService   │
│  sendWebhook()    │
└─────────┬─────────┘
          │
          ▼ POST Request
┌───────────────────┐
│   webhook.site    │
│  (or any URL)     │
└───────────────────┘
```

### Setting Up Webhook for Testing
1. Visit [https://webhook.site](https://webhook.site)
2. Copy your unique URL
3. Add it to `backend/.env`:
   ```
   WEBHOOK_URL=https://webhook.site/your-unique-id
   ```
4. Run a job and check webhook.site to see the received data

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm

### Step 1: Clone the Repository
```bash
git clone https://github.com/abhijithwinddaa/Dotix---Assignment.git
cd job-scheduler
```

### Step 2: Set Up MySQL Database
```bash
# Open MySQL Workbench or terminal
mysql -u root -p

# Run the schema file (creates database and table)
source backend/src/database/schema.sql
```

### Step 3: Configure Backend
```bash
cd backend
npm install

# Copy and edit environment file
cp .env.example .env
# Update .env with your MySQL password and webhook URL
```

### Step 4: Start Backend Server
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Step 5: Start Frontend Server
```bash
cd ../frontend
npm install
npm run dev
# Opens on http://localhost:5173
```

### Step 6: Test the Application
1. Open http://localhost:5173 in your browser
2. Click "Create Job" and fill the form
3. Click "Run" button on a pending job
4. Watch status change: pending → running → completed
5. Check webhook.site for received webhook data

---

## 🧪 Testing with API Calls

### Using PowerShell
```powershell
# Create a job
Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/jobs `
  -ContentType "application/json" `
  -Body '{"taskName":"Test Job","priority":"High","payload":{"key":"value"}}'

# Get all jobs
Invoke-RestMethod -Uri http://localhost:5000/api/jobs

# Run a job (replace 1 with actual job ID)
Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/run-job/1
```

### Using curl (Git Bash / Linux / Mac)
```bash
# Create a job
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"taskName":"Test Job","priority":"High","payload":{"key":"value"}}'

# Get all jobs
curl http://localhost:5000/api/jobs

# Run a job
curl -X POST http://localhost:5000/api/run-job/1
```

---

## 🤖 AI Usage Disclosure

This project was built with AI assistance as permitted by the assignment guidelines.

### AI Tools Used
| Tool | Model | Purpose |
|------|-------|---------|
| Gemini Code Assist | Claude 3.5 Sonnet | Code generation, architecture design, documentation |

### What AI Helped With

1. **Project Structure** - Setting up the folder structure and boilerplate code
2. **Backend Development** - Writing Express routes, controllers, services, and database operations
3. **Frontend Development** - Building React components with Tailwind CSS styling
4. **Database Design** - Designing the MySQL schema with proper indexes
5. **Webhook Integration** - Implementing outbound webhook functionality
6. **Documentation** - Writing this README and code comments
7. **Debugging** - Fixing issues like dotenv configuration and port conflicts

### Development Approach
The development was done through a conversational approach:
1. Provided the full assignment requirements document
2. Discussed architecture and tech stack choices
3. Requested React instead of Next.js for familiarity
4. Specified preference for simple, clean UI
5. Iteratively built and tested each component
6. Fixed issues as they arose (database connection, webhook configuration)

---

## 📷 Screenshots

*Screenshots of the working application*

### Dashboard View
- Shows all jobs in a table with status badges
- Filter dropdowns for status and priority
- Create Job button in header

### Create Job Form
- Modal form with task name, priority dropdown, and JSON payload textarea
- Validation for required fields and JSON format

### Job Detail View
- Side panel showing full job details
- Formatted JSON payload display
- Timestamps and status information

### Webhook Received
- Screenshot from webhook.site showing received job data

---

## 👤 Author

**Abhijith**
- GitHub: [@abhijithwinddaa](https://github.com/abhijithwinddaa)

---

## 📝 License

This project was created for the Dotix Technologies Full Stack Developer skill test assessment.
#   D o t i x - - - A s s i g n m e n t  
 