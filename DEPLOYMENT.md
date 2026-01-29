# 🚀 Deployment Guide for Job Scheduler

This guide will help you deploy the Job Scheduler application to:
- **Frontend:** Netlify
- **Backend:** Render
- **Database:** Aiven (Free MySQL)

---

## Step 1: Set Up MySQL on Aiven (Free)

### 1.1 Create Aiven Account
1. Go to [https://aiven.io](https://aiven.io)
2. Click **"Start Free"** and sign up
3. Verify your email

### 1.2 Create MySQL Service
1. Click **"Create service"**
2. Select **MySQL**
3. Choose **Free plan** (Hobbyist)
4. Select a region close to you (e.g., Google Cloud - Iowa)
5. Name it: `job-scheduler-db`
6. Click **"Create service"**

### 1.3 Get Connection Details
Once the service is running (green status):
1. Click on your MySQL service
2. Go to **Overview** tab
3. Note down these values:
   - **Host:** something.aivencloud.com
   - **Port:** 12345
   - **User:** avnadmin
   - **Password:** (click to reveal)
   - **Database:** defaultdb

### 1.4 Create the Jobs Table
1. In Aiven, go to **"Query"** tab
2. Run this SQL:

```sql
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    taskName VARCHAR(255) NOT NULL,
    payload JSON,
    priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
    status ENUM('pending', 'running', 'completed') NOT NULL DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completedAt TIMESTAMP NULL,
    INDEX idx_status (status),
    INDEX idx_priority (priority)
);
```

---

## Step 2: Deploy Backend on Render

### 2.1 Create Render Account
1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repos

### 2.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo: `abhijithwinddaa/Dotix---Assignment`
3. Configure:
   - **Name:** `job-scheduler-backend`
   - **Region:** Oregon (US West)
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### 2.3 Set Environment Variables
In **Environment** section, add these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `DB_HOST` | `your-aiven-host.aivencloud.com` |
| `DB_PORT` | `12345` (from Aiven) |
| `DB_USER` | `avnadmin` |
| `DB_PASSWORD` | `your-aiven-password` |
| `DB_NAME` | `defaultdb` |
| `WEBHOOK_URL` | `https://webhook.site/your-id` |

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (~2-5 minutes)
3. Copy your backend URL: `https://job-scheduler-backend.onrender.com`

---

## Step 3: Deploy Frontend on Netlify

### 3.1 Create Netlify Account
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Sign up with GitHub
3. Authorize Netlify

### 3.2 Import Project
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub**
3. Select repo: `abhijithwinddaa/Dotix---Assignment`

### 3.3 Configure Build Settings
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`

### 3.4 Set Environment Variable
Click **"Add environment variable"**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://job-scheduler-backend.onrender.com/api` |

> ⚠️ Replace with YOUR actual Render backend URL!

### 3.5 Deploy
1. Click **"Deploy site"**
2. Wait for build (~1-2 minutes)
3. Your site will be live at: `https://your-site-name.netlify.app`

---

## Step 4: Verify Deployment

1. Open your Netlify URL
2. Create a test job
3. Run the job
4. Verify status changes: pending → running → completed
5. Check webhook.site for received data

---

## 🔧 Troubleshooting

### Backend not connecting to database?
1. Check Aiven SSL settings - may need to enable SSL in connection
2. Update `backend/src/database/connection.js` to include SSL config:
```javascript
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }  // Add this for Aiven
});
```

### CORS errors?
The backend already has CORS enabled for all origins. If issues persist, update `backend/src/app.js`:
```javascript
app.use(cors({
    origin: 'https://your-frontend.netlify.app'
}));
```

---

## 📋 Final Checklist

- [ ] Aiven MySQL database created and table added
- [ ] Backend deployed on Render with env variables
- [ ] Frontend deployed on Netlify with VITE_API_URL
- [ ] Test job creation and running works
- [ ] Webhook triggers on completion

---

## 📤 Submission Links

After deployment, you'll have:

1. **GitHub:** https://github.com/abhijithwinddaa/Dotix---Assignment
2. **Frontend:** https://your-site.netlify.app
3. **Backend:** https://job-scheduler-backend.onrender.com
