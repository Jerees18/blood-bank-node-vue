# BloodConnect - Execution & Setup Guide

This document outlines the necessary software tools, key project executables, and the step-by-step instructions required to run the **BloodConnect - Smart Blood Donation Platform** locally on your machine.

---

## 1. Required Software Tools
To successfully run this project, you need the following environment and tools. Since this is a Full-Stack application, tools are required for both the Backend and Frontend.

**Core Environment (Required for both Backend & Frontend):**
*   **Node.js**: The JavaScript runtime required to execute the backend server and run the frontend build tools (Vite). (Version 18.x or higher is recommended).
    *   *Download*: [https://nodejs.org/](https://nodejs.org/)
*   **npm (Node Package Manager)**: Comes pre-installed with Node.js. Used to install all necessary packages for both API and UI.
    *   *Documentation*: [https://www.npmjs.com/](https://www.npmjs.com/)

**Frontend Tools (UI):**
*   **Vue.js 3 & Vite**: The frontend framework and development server. *(These do not need to be downloaded separately; they are installed automatically when you run `npm install` in the frontend folder)*.
    *   *Learn More*: [Vue.js](https://vuejs.org/) | [Vite](https://vitejs.dev/)
*   **Web Browser**: Any modern web browser to view the user interface.
    *   *Download*: [Google Chrome](https://www.google.com/chrome/) | [Mozilla Firefox](https://www.mozilla.org/firefox/)

**Backend Tools (API):**
*   **SQLite**: The database engine. *(Like Vue, this does not require a separate installation as the driver is installed automatically via npm)*.
    *   *Documentation*: [https://www.sqlite.org/](https://www.sqlite.org/)

**General Development Tools:**
*   **Code Editor**: Visual Studio Code (VS Code) is highly recommended for viewing or modifying the codebase.
    *   *Download*: [https://code.visualstudio.com/](https://code.visualstudio.com/)
*   **Git** *(Optional)*: To clone the repository and manage version control.
    *   *Download*: [https://git-scm.com/downloads](https://git-scm.com/downloads)

---

## 2. Project Executables & Source Code
The complete source code for this project is hosted on GitHub. You can view, clone, or download the executables from the following repository:
*   **GitHub Repository**: [https://github.com/Jerees18/blood-bank-node-vue](https://github.com/Jerees18/blood-bank-node-vue)

The project is divided into two main parts: the Backend (API) and the Frontend (UI). Here are the key executable files and directories that drive the application:

### Backend (`/API` directory)
*   `package.json`: Contains the backend dependencies and startup scripts.
*   `index.js`: The main entry point for the Node.js Express server. Executing this file starts the backend API.
*   `database/blood_bank.db`: The SQLite database file where all user, blood bank, and inventory data is stored.
*   `database/init.js` & `database/seed.js`: Scripts used to initialize the database tables and populate them with initial mock data.
*   `.env`: The environment variable file (not tracked in Git) that must contain your secure credentials (like Gmail SMTP passwords).

### Frontend (`/UI/blood-donor-frontend` directory)
*   `package.json`: Contains the Vue.js frontend dependencies and Vite build scripts.
*   `index.html`: The main HTML file served to the browser.
*   `src/main.js`: The JavaScript entry point that mounts the Vue application to the DOM.
*   `vite.config.js`: The configuration file for the Vite development server.

---

## 3. Steps to Execute

Follow these steps to set up and run the application from scratch. You will need to run the backend and frontend simultaneously in two separate terminal windows.

### Step 1: Set up the Environment Variables
Before running the backend, ensure you have the `.env` file configured for the email notification system to work.
1. Navigate to the `API` folder.
2. Create a file named `.env` (if it doesn't already exist).
3. Add the following lines, replacing with your actual app password:
   ```env
   EMAIL_USER=blooddonation646@gmail.com
   EMAIL_PASS=iopc esks zwuq iveq
   ```

### Step 2: Start the Backend Server (API)
Open your first terminal (or command prompt) and follow these steps:
1. Navigate to the API directory:
   ```bash
   cd API
   ```
2. Install the necessary Node.js packages:
   ```bash
   npm install
   ```
3. *(Optional - only if setting up for the very first time)* Initialize and seed the database:
   ```bash
   node database/init.js
   node database/seed.js
   ```
4. Start the backend server:
   ```bash
   npm run run-my-app
   ```
   *You should see a message in the terminal indicating that the server is running (usually on `http://localhost:3000`). Leave this terminal open.*

### Step 3: Start the Frontend Development Server (UI)
Open a **second, new terminal window** and follow these steps:
1. Navigate to the frontend directory:
   ```bash
   cd UI/blood-donor-frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The terminal will display a local URL, typically `http://localhost:5173/`.*

### Step 4: Access the Application
1. Open your web browser.
2. Navigate to the URL provided by the frontend terminal (e.g., **`http://localhost:5173`**).
3. The BloodConnect platform should now be loaded and fully functional, successfully communicating with your local backend server!
