<p align="center">
  <img src="assets/logo.png" alt="VIBENET Logo" height="100">
</p>

> **CONNECT. FEEL. SYNC.**

VIBENET is a dynamic, full-stack post-sharing web application designed to let users seamlessly connect, share thoughts, upload media, and engage with each other in real-time. Built with a highly responsive frontend and a powerful serverless backend.

---

## 🚀 Features

* **Secure Authentication:** User signup, login, and logout functionalities powered entirely by Supabase Auth.
* **Post Creation & Media Uploads:** Users can write posts and upload accompanying images directly to Supabase Storage Buckets.
* **Smart CRUD Permissions:** Users have full control (Edit/Delete) over their own posts, while other users' content remains strictly protected.
* **Social Interactions:** Real-time engagement features including a persistent **Like System** and **Comment Tracking**.
* **Responsive UI:** A sleek, modern, and mobile-friendly design built utilizing Bootstrap 5 utility classes and custom CSS.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+ / Pure Vanilla JS)
* **UI Framework:** Bootstrap 5
* **Backend-as-a-Service (BaaS):** Supabase
    * *Authentication* (User Management & Sessions)
    * *Database* (PostgreSQL Database for CRUD, Likes, and Comments)
    * *Storage* (Buckets for managing user-uploaded post images)

---

## 📁 Project Structure

```text
├── index.html          # Main application interface (Login)
├── css/
│   └── style.css       # Custom styling and design overrides
├── js/
│   ├── auth.js         # Supabase authentication logic
│   ├── app.js          # Main feed management, CRUD operations, likes, and comments


⚙️ Setup & Installation Instructions

Follow these steps to set up and run VIBENET on your local machine:

1. Clone the Repository
First, clone the repository to your local system:

Bash
git clone https://github.com/maheenfarooqui/Post-App.git
cd Post-App

2. Configure Supabase Backend
Go to the Supabase Dashboard and create a new project.

Set up your database tables for posts, comments, and likes.

Create a public Storage Bucket named images to host post media uploads.

Enable Row Level Security (RLS) on your tables to ensure data isolation.

3. Connect Environment Keys
Create a configuration file (e.g., js/config.js) within your project and initialize your Supabase client using your project credentials:

JavaScript
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
4. How to Run the Project Locally
Since this is a pure Vanilla JS application, you can run it using any local development server:

Using VS Code Live Server (Recommended):

Open the project folder in VS Code.

Right-click on the index.html file.

Select "Open with Live Server". The application will automatically launch in your default browser.

Using NodeJS (Alternative):
If you have http-server installed globally, run the following command in your terminal:

Bash
npx http-server
🔒 Security & Row Level Security (RLS) Policies
To maintain data integrity and strict privacy, backend access is guarded by specific RLS policies:

SELECT: Allows all authenticated users to read posts, comments, and likes.

INSERT: Restricts content creation features strictly to active, authenticated user sessions.

UPDATE / DELETE: Ensures a user can only modify or delete a row if auth.uid() == user_id matches their account.
└── assets/
    ├── logo.png        # Full application logo
    └── logoicon.png    # Application icon
