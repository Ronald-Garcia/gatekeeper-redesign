# Technical Documentation

## Introduction

### 1.1 Purpose

The purpose of the **WSE Interlock** system is to provide a **secure, automated access control and billing solution** for machine shops, specifically designed to meet the needs of **The Johns Hopkins University** student shop within the Mechanical Engineering department.

The system ensures that only **authorized and properly trained users** can access specific machines, while also providing administrative staff with tools for:
- **User and machine management**,
- **Financial tracking and automated reporting**, and
- **Maintenance issue reporting and resolution**.

It aims to **replace outdated fingerprint-based systems** with a more reliable solution using **JCard identification** and a **centralized kiosk interface**, integrating both hardware-level machine control (via Raspberry Pi) and cloud-based data management.

---

### 1.2 Scope

The **WSE Interlock** project covers the **full lifecycle of machine usage**, from user authentication to machine activation, usage tracking, and financial processing. The scope includes:

- **Frontend Web Application**:
  - Admin Dashboard for user, machine, and budget code management.
  - Interlock UI for machine usage and issue reporting.

- **Backend API**:
  - RESTful API to manage users, machines, budget codes, and financial records.
  - User authentication with session management and role-based access control.
  - Real-time machine status tracking and data persistence with PostgreSQL.

- **Machine API**:
  - A lightweight Python server running on **Raspberry Pi** devices.
  - Controls GPIO pins to enable/disable machines based on API responses.
  - Communicates with the central system for authorization and usage updates.

- **Testing**:
  - Automated **frontend testing** using **Cypress** for E2E and component coverage.
  - Automated **backend testing** using **Jest** for route and database integrity validation.

- **Deployment**:
  - Hosted web and backend apps on **Vercel** and **Supabase** (PostgreSQL).
  - Dockerized **Machine API** for simulation or production use.

Excluded from the current scope (but possible for future expansion):
- Multi-shop or multi-site support beyond JHU.
- Integration with external JHU systems (beyond JCard ID recognition).
- Real-time shop floor monitoring beyond machine status.

---

### 1.3 Audience

This technical documentation is intended for the following stakeholders:

- **Developers**:
  - To understand the system architecture, technology stack, and how to contribute or maintain code.
  - To set up the project locally for development or testing purposes.

- **System Administrators**:
  - To deploy, configure, and manage the application across environments (local, staging, production).
  - To maintain database integrity and perform manual overrides when necessary.

- **Project Stakeholders (Professors, Advisors, Shop Managers)**:
  - To understand the system’s capabilities and how it aligns with user and administrative needs.
  - To provide feedback for future iterations based on functional and non-functional requirements.

- **Quality Assurance/Testers**:
  - To use the documented processes for running and evaluating automated tests.
  - To verify system behavior under various scenarios, ensuring reliability and correctness.

- **Future Teams/Contributors**:
  - To understand the context, setup, and modular structure of the project for ongoing improvements.


## System Overview

### 2.1 Architecture

The **WSE Interlock** system follows a **modular three-tier architecture**, designed for **scalability**, **security**, and **real-time machine control**. The architecture consists of:

1. **Frontend Web Application** (React + TypeScript):
   - **Admin Dashboard**:
     - User, machine, and budget code management.
     - Financial reports and automated email scheduling.
     - Issue reporting and resolution interface.
   - **Interlock UI**:
     - User login via card number (JCard).
     - Machine selection and budget code assignment.
     - Real-time machine usage tracking and issue reporting.

2. **Backend API** (Hono + TypeScript):
   - RESTful endpoints for:
     - User authentication and session handling.
     - Machine, budget code, and issue CRUD operations.
     - Financial transactions and reporting.
   - Uses **PostgreSQL** with **Drizzle ORM** for database management.
   - Middleware for authentication (`auth`) and admin authorization (`adminGuard`).

3. **Machine API** (Python on Raspberry Pi):
   - Lightweight Python server using **Flask** or simple socket interface.
   - Controls GPIO pins to turn machines **on/off**.
   - Communicates with backend API to:
     - Verify user authorization.
     - Track machine usage in real-time.
     - Report machine statuses.

---

### 2.2 Technologies Used

| Layer            | Technology                   | Purpose                                                   |
|------------------|------------------------------|-----------------------------------------------------------|
| Frontend         | **React + TypeScript**       | Web application interface for both Admin and Interlock    |
|                  | **Vite**                     | Fast development server and build tool                    |
|                  | **Tailwind CSS**             | Utility-first CSS for responsive design                   |
|                  | **Cypress**                  | End-to-End and component testing                          |
| Backend API      | **Hono**                     | Minimalist web framework for high-performance APIs        |
|                  | **TypeScript**               | Type-safe backend logic and route handling                |
|                  | **Drizzle ORM**              | Database ORM for PostgreSQL                               |
|                  | **PostgreSQL**               | Relational database for persistent data storage           |
|                  | **Arctic (Lucia Auth)**      | Authentication and session management                     |
| Machine API      | **Python**                   | Machine control script on Raspberry Pi                    |
|                  | **GPIO library**             | Hardware interface for controlling machine power states   |
|                  | **Docker**                   | Containerization for Machine API simulation/deployment    |
| DevOps/Hosting   | **Vercel**                   | Hosting for frontend and backend APIs                     |
|                  | **Supabase**                 | PostgreSQL hosting and API integration                    |
|                  | **Docker**                   | Local/Production deployment of Machine API                |

---

### 2.3 Dependencies

#### Frontend Dependencies:
- `react`: UI library for building the dashboard and interlock components.
- `vite`: Fast dev environment and optimized builds.
- `tailwindcss`: For styling components.
- `eslint` / `prettier`: Linting and code formatting.
- `typescript`: Type-safe development.
- `@react-oauth/google`: Google OAuth integration (optional).

#### Backend Dependencies:
- `hono`: Web framework for defining API routes.
- `drizzle-orm`: ORM for structured database access and migrations.
- `lucia` + `arctic`: User authentication and session handling.
- `pg`: PostgreSQL client for Node.js.
- `zod`: Schema validation for request/response objects.
- `dotenv`: Environment variable management.

#### Machine API Dependencies:
- `python`: Core scripting language.
- `flask` or `socketserver`: Lightweight HTTP/socket server for Raspberry Pi.
- `RPi.GPIO`: Library for GPIO control (on Pi hardware).
- `dotenv`: For managing machine identity/environment data.

#### Testing Dependencies:
- **Frontend**:
  - `cypress`: For E2E and component testing.
- **Backend**:
  - `jest`: Unit and integration testing for backend routes.
  - `ts-jest`: TypeScript support for Jest.
  - `supertest` or Hono's built-in request simulation for route testing.
  

## Installation Guide

### 3.1 Prerequisites

Before running the WSE Interlock system locally or interacting with the deployed version, ensure you have the following installed:

- **Node.js** (v18+ recommended)
- **pnpm** (v8+)
- **Python** (v3.10+) with **Anaconda/Miniconda**
- **PostgreSQL** database access (cloud-hosted or local)
- **Git** for cloning the repository
- **Docker** (optional for running the Machine API via Docker)
- **Conda** (for managing the Python environment of the Machine API)

---

### 3.2 System Requirements

- **Operating System:** Windows 10/11, macOS, or Linux
- **RAM:** 8GB minimum (16GB recommended for concurrent services)
- **Disk Space:** 2GB+ free space for node_modules, databases, and logs
- **Network:** Internet access for package installation, API connections, and optional Docker image pulls

---

### 3.3 Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/cs421sp25-homework/team-10.git
cd team-10
```


### 2. Install Frontend (web)

```bash
cd web
pnpm install
```

### 3. Install Backend API (api-database)

```bash
cd ../api-database
pnpm install
```

### 4. Set Up Machine API (api-machine)

```bash
cd ../api-machine
conda env create -f machine-api.yml
conda activate machine_api
```

## Running the Application Locally

### 1. Start Frontend:

```bash
cd web
pnpm dev
```

### 2. Start Backend API:

```bash
cd ../api-database
pnpm dev
```

### 3. Start Machine API:

```bash
cd ../api-machine
conda activate machine_api
python server.py
```

Then, visit http://localhost:5173 to access the web app locally.

## Configuration Guide

### 4.1 Configuration Parameters

The application relies on several environment variables for its backend (api-database), frontend (web), and machine API. These parameters control database connections, server ports, email credentials, and integration URLs.

#### Backend API (api-database) Environment Variables:

- `PROD_DB_URL` – PostgreSQL connection string for production.
  - Example: `postgresql://<db-username>:<password>@<host>:<port>/<database>`
- `DATABASE_URL` – Active PostgreSQL database URL. This must match `PROD_DB_URL` or point to a local database.
- `PORT` – Port on which the backend API will run locally (default is `3000`).
- `EMAIL_USER` – Email address used for sending financial statements (e.g., `"wseinterlocks@gmail.com"`).
- `EMAIL_PASS` – App password for the above email (Google App Passwords if using Gmail).

#### Frontend (web) Environment Variables:

- `VITE_API_DB_URL` – URL pointing to the backend API.
  - Example (local): `"http://localhost:3000"`
  - Example (deployed): `"https://interlock-api-database-v1.vercel.app/"`
- `VITE_API_MACHINE_URL` – URL pointing to the local Machine API.
  - Example: `"http://127.0.0.1:5000"`
- `VITE_BASE_URL` – URL for the frontend app itself.
  - Example (local): `"http://localhost:5173"`

---

### 4.2 Environment Setup

#### Backend API (`api-database/.env` Example):

```env
PROD_DB_URL="postgresql://<db-username>:<password>@<host>:<port>/<database>"
DATABASE_URL="postgresql://<db-username>:<password>@<host>:<port>/<database>"
PORT=3000
EMAIL_USER="<your-email@example.com>"
EMAIL_PASS="<your-email-app-password>"
```

### Frontend (web/.env Example):

```env
VITE_API_DB_URL="http://localhost:3000"
VITE_API_MACHINE_URL="http://127.0.0.1:5000"
VITE_BASE_URL="http://localhost:5173"
```

- Ensure no spaces around `=` signs in `.env` files.
- Customize `EMAIL_USER` and `EMAIL_PASS` based on your SMTP settings.

---

### 4.3 External Services Integration

The application integrates with several external services:

- **PostgreSQL Database:**
  - Hosted on Supabase or any PostgreSQL-compatible service.
  - Ensure correct credentials are set in `PROD_DB_URL` and `DATABASE_URL`.

- **Email Service:**
  - Utilizes SMTP credentials to send automated financial statements.
  - If using Gmail:
    - Enable 2-Factor Authentication.
    - Generate an App Password and use it for `EMAIL_PASS`.

- **Deployment Platforms:**
  - **Vercel**:
    - Used for deploying the frontend (`web`) and backend API (`api-database`) for production access.
    - Environment variables should be configured in the Vercel project settings.
  - **Docker**:
    - A Dockerized version of the Machine API is available.
    - Pull the Docker image and run it locally or on a cloud VM.
    - Useful for environments without direct access to Conda/Python.

- **Anaconda (for Machine API)**:
  - Required for running the Python-based Machine API.
  - Use the provided `machine-api.yml` file to create the Conda environment.
  - Example commands:
    ```bash
    conda env create -f machine-api.yml
    conda activate machine-api
    python server.py
    ```

---

## Usage Guide

## 5.1 User Interface Overview

The WSE Interlock system features a multi-faceted user interface, designed for three primary user groups:
1. **Users (Students/Staff)**
2. **Administrators**
3. **Machine Interlock Users (Machine Operators)**

Each interface is tailored for its specific role, ensuring an intuitive and efficient experience.

---

### **Home Page**
- Serves as the central landing point.
- Allows navigation to:
  - **Interlock Interface**
  - **Kiosk Admin Dashboard**
  - **User Dashboard**

#### **Buttons:**
- **Interlock** – For machine operators to log in and use machines.
- **Kiosk** – For administrators to manage users, machines, budget codes, and financial data.
- **User Dashboard** – For users to view their machine usage statistics.

---

### **User Dashboard**
- **Purpose:** Allows users to view their past machine usage and budget tracking.
- **Main Pages:**
  - **Machines Status Page:** 
    - Displays list of machines used.
    - Search and pagination for navigating machine usage.
  - **User Stats Page:**
    - Displays charts and statistics of personal machine usage.

---

### **Kiosk Admin Dashboard**
- **Purpose:** Provides full administrative control over users, machines, budget codes, financials, and machine issues.
- **Sections:**
  - **Users Management:**
    - Add, search, filter, activate/deactivate users.
    - Assign budget codes and training.
  - **Budget Codes Management:**
    - Add budget codes and types.
    - Filter, activate/deactivate codes.
  - **Machines Management:**
    - Add machines and machine types.
    - Filter by type, activate/deactivate machines.
  - **Machine Issues:**
    - View unresolved/resolved issues.
    - Resolve issues with a single click.
  - **Financial Statements:**
    - View and export billing statements based on machine usage.
    - Automated email scheduling for monthly summaries.

- **Features:**
  - Sidebar for easy navigation.
  - Pagination and filtering for large datasets.
  - Real-time updates for machine status and issues.

---

### **Machine Interlock Interface**
- **Purpose:** Mounted on each machine, allowing users to log in and use the machine.
- **Workflow:**
  1. **Swipe Card / Enter JHU Credentials** to authenticate.
  2. **Select Budget Code** from available options.
  3. **Start Machine**:
     - Sends a power-on signal to the Raspberry Pi GPIO.
     - Timer starts and tracks usage.
  4. **In Progress Page**:
     - Displays live timer.
     - Allows users to:
       - **Report Issues**.
       - **End Session** by pressing "Tap when finished" to log the session and billing.
- **Lost Connection Page:**
  - Shown if the interface loses contact with the server.
  - Allows offline interaction or retry connection.

---

### **Maintenance Issue Reporting Page**
- **Purpose:** Allows users to report issues directly from the machine interface.
- **Features:**
  - Select machine automatically.
  - Text area to describe issue.
  - Validates input before submission.
  - Displays confirmation after successful report.

---

### **UI Libraries & Styling**
- **React** and **TypeScript** for component structure.
- **Tailwind CSS** for styling and layout.
- **@nanostores** for state management and routing.

---

### **Key Components Overview**
- **Buttons, Inputs, Dialogs, Scroll Areas** – Standardized via Tailwind + custom components.
- **Pagination** – Efficiently loads data per page in admin views.
- **Sidebar Navigation** – Present in admin views for intuitive section switching.
- **Toggle Groups** – For selecting budget codes in Interlock UI.

---

### 5.2 User Authentication

The WSE Interlock system uses a robust, session-based authentication mechanism powered by **Lucia Auth** in conjunction with **Drizzle ORM** for database interactions. Authentication supports both **JCard-based login** and **JHU SAML Single Sign-On (SSO)**, providing flexibility for students and staff.

---

#### **1. Authentication Mechanisms**

- **Card-Based Authentication (JCard):**
  - Users swipe or input their card number.
  - Card number is parsed to extract the unique identifier and verified against the database.
  - Upon successful validation, a session is created and stored using **Lucia**.

- **JHU SAML SSO Authentication:**
  - Users can optionally log in using JHU Single Sign-On via SAML.
  - Service Provider (SP) and Identity Provider (IdP) are configured using **samlify**.
  - Upon successful SSO login, users are validated against the internal database via their JHED ID.

---

#### **2. Session Management (Lucia)**

- **Lucia** is configured with:
  - **DrizzlePostgreSQLAdapter** for PostgreSQL-based session storage.
  - **Secure Cookies** (`secure: true`, `sameSite: "none"`).
  - Session expiration set to **60 minutes** (`sessionExpiresIn: new TimeSpan(60, "m")`).
- Session cookies are automatically refreshed if marked as fresh.

---

#### **3. API Authentication Flow**

1. **Login via Card:**
   - `POST /users/:cardNum`
     - Validates the card number (truncated and last digit check).
     - If valid, creates a Lucia session.
     - Sets session cookie in the response.

2. **Logout:**
   - `POST /logout`
     - Invalidates the session.
     - Clears the session cookie.

3. **JHU SSO Login:**
   - `GET /jhu/login` – Redirects user to the JHU SSO page.
   - `POST /jhu/login/callback` – Processes the SAML response and creates a session.
   - `GET /jhu/metadata` – Serves SP metadata for JHU IdP configuration.

---

#### **4. Middleware Guards**

- **auth:**
  - Reads and validates session from the request cookie.
  - Sets `user` and `session` in the request context.
  - Refreshes session cookies as needed.

- **authGuard:**
  - Ensures that a valid user session exists.
  - Returns 401 Unauthorized if missing.

- **adminGuard:**
  - Ensures that the authenticated user has `isAdmin` privileges.
  - Returns 403 Forbidden for non-admins.

---

#### **5. Security Considerations**
- All session cookies are:
  - **Secure** – Ensures transmission over HTTPS only.
  - **SameSite=none** – Required for cross-site cookie transmission (e.g., different frontend/backend domains).
- Authentication routes throw appropriate HTTP errors (`401`, `403`, `404`) for unauthorized or invalid requests.

---

#### **6. Future Enhancements**
- Integration of **password-based admin logins** with reset capabilities.
- Extended session time configuration for specific user roles (e.g., admin vs. standard user).
- Enhanced SAML logout support (`singleLogoutService`) for better SSO compliance.

### 5.3 Core Functionality

The WSE Interlock system is designed to manage user access, machine control, and financial tracking in a university machine shop environment. The core functionalities are divided into three key user roles: **Users**, **Administrators**, and **Machine Interfaces**.

---

#### **1. User Role**

- **Card-Based Access:**
  - Users swipe or enter their JCard number to authenticate.
  - Authorized users proceed to the **Interlock Page**.

- **Budget Code Selection:**
  - Users select an assigned **Budget Code** before starting the machine.
  - The system ensures that only users with valid budget codes can proceed.

- **Machine Operation:**
  - After budget selection, the **Turn-On** signal is sent to the Machine API.
  - A **Timer** tracks the usage for billing.

- **Maintenance Issue Reporting:**
  - Users can report issues at any point (before, during, or after machine use).
  - Reports are logged and marked for admin resolution.

---

#### **2. Administrator Role**

- **Admin Dashboard Access:**
  - Admins log in through the kiosk or web app.
  - Access to **Users**, **Budget Codes**, **Machines**, **Machine Issues**, and **Financial Statements**.

- **User Management:**
  - Add, edit, delete, and deactivate users.
  - Assign budget codes and machine access permissions.

- **Machine Management:**
  - Add or deactivate machines.
  - Assign machine types and hourly rates.

- **Financial Statements:**
  - Generate and view detailed statements.
  - Automate monthly email reporting.

- **Machine Issues:**
  - View reported issues.
  - Resolve issues and track their status.

---

#### **3. Machine Interface (Raspberry Pi)**

- **Machine Identification:**
  - Machines are associated during first-time setup via the **MachineLogin** page.
  - Each machine stores its ID locally in a `.env` file, which is written via the Machine API.

- **Start/Stop Control:**
  - Receives **Turn-On/Turn-Off** signals based on user authentication.
  - Executes GPIO signals to physically control power (or simulates during development).
  - Tracks usage time for billing, based on session duration.

- **Local Persistence:**
  - Machine identity is retained across restarts using local `.env` storage.
  - Machine ID can be reset via the **DELETE /clear** API endpoint.

---

### 5.4 Advanced Features

In addition to the core functionality, the system provides several advanced features for enhanced usability and administration.

---

#### **1. JHU SAML Single Sign-On (SSO):**
- Users and admins can authenticate using JHU credentials.
- Provides a passwordless login option linked to university identity.

---

#### **2. Automated Financial Reporting:**
- Admins can schedule monthly reports to be emailed automatically.
- Reports include detailed machine usage and billing breakdowns.

---

#### **3. Offline Mode:**
- When the system detects a lost server connection, it prompts users to switch to **Offline Mode**.
- Basic functionalities are preserved, and data syncs when connection is restored.

---

#### **4. Dynamic Machine Assignment:**
- Machines without prior assignment can dynamically select their identity from available machines in the system.
- Machine identity is stored locally in `.env` and retrieved via **GET /whoami**.
- Simplifies setup for Raspberry Pi machine interfaces.

---

#### **5. Fine-Grained Authorization:**
- Admins can:
  - Temporarily ban users or clubs.
  - Set expiration for budget codes.
  - Deactivate machines as needed.

### 5.5 Troubleshooting

Below are possible issues and suggested resolutions when using the WSE Interlock system.

---

#### **1. User Login Issues:**
- **Problem:** Card swipe not recognized.
  - **Solution:** Ensure the card number is entered correctly, including any prefix/suffix characters.

- **Problem:** Invalid User error.
  - **Solution:** User might not be registered. Admins can check the user table via the dashboard.

---

#### **2. Machine Not Turning On:**
- **Problem:** Turn-On signal not received.
  - **Solution:** Check the Machine API server (ensure `python server.py` is running in the correct Conda environment).

- **Problem:** Machine not associated.
  - **Solution:** Login via the web app and assign the machine using the **MachineLogin** interface.

---

#### **3. Financial Statement Errors:**
- **Problem:** Incorrect billing time.
  - **Solution:** Timer might not have synced correctly. Admins can manually adjust entries in the financial statements.

---

#### **4. Environment Configuration Errors:**
- **Problem:** "null connection string" or database errors.
  - **Solution:** Ensure `.env` files are correctly configured with no spaces around `=` signs and all required keys are present.

---

#### **5. Deployment Troubleshooting:**
- **Problem:** Web app not loading.
  - **Solution:** Ensure both the web frontend (`pnpm dev`) and backend API (`pnpm dev`) are running locally. Check Vercel deployments for production.

---

For additional help, refer to the logs in the terminal or consult your system administrator.


## API Documentation

For this application, we are using two APIs: the Machine API and the Deployed API. 

### 6.1 Endpoints

The system is built on two main APIs: the **Deployed API** for core data operations, and the **Machine API** for machine-level hardware control.

---

#### **Deployed API (Core Backend)**

| **Endpoint**                      | **Method** | **Description**                                              |
|-----------------------------------|------------|--------------------------------------------------------------|
| `/users`                          | GET        | Retrieve all users with optional filters and pagination.     |
| `/users`                          | POST       | Create a new user.                                           |
| `/users/:id`                      | PATCH      | Update a user’s status, graduation year, or timeout date.    |
| `/users/:id`                      | DELETE     | Delete a user.                                               |
| `/users/:cardNum`                 | GET        | Authenticate a user by JCard number.                         |
| `/logout`                         | POST       | Logout the current user.                                     |

| `/budget-codes`                   | GET        | Retrieve all budget codes.                                   |
| `/budget-codes`                   | POST       | Create a new budget code.                                    |
| `/budget-codes/:id`               | PATCH      | Update budget code status (e.g., activate/deactivate).       |
| `/budget-codes/:id`               | DELETE     | Delete a budget code.                                        |

| `/user-budgets/:id`               | GET        | Get budget codes assigned to a user.                         |
| `/user-budgets`                   | POST       | Assign a budget code to a user.                              |
| `/user-budgets/:userId/:budgetCodeId` | DELETE | Remove a budget code from a user.                            |
| `/user-budgets/:id`               | PATCH      | Replace all budget codes for a user.                         |

| `/trainings/:userId/:machineId`   | GET        | Validate if a user is trained on a specific machine.         |
| `/trainings/:id`                  | GET        | Retrieve all trainings for a user.                           |
| `/trainings`                      | POST       | Assign machine training to a user.                           |
| `/trainings`                      | DELETE     | Remove a machine training from a user.                       |
| `/trainings/:id`                  | PATCH      | Replace all trainings for a user.                            |

| `/machines`                       | GET        | Retrieve all machines with filters.                          |
| `/machines`                       | POST       | Create a new machine.                                        |
| `/machines/:id`                   | PATCH      | Update machine status or last usage time.                    |
| `/machines/:id`                   | DELETE     | Delete a machine.                                            |
| `/machines/:id`                   | GET        | Retrieve a specific machine.                                 |

| `/machine-types`                  | GET        | Retrieve all machine types.                                  |
| `/machine-types`                  | POST       | Create a new machine type.                                   |
| `/machine-types`                  | PATCH      | Update a machine type.                                       |
| `/machine-types/:id`              | DELETE     | Delete a machine type.                                       |

| `/machine-issues`                 | GET        | Retrieve all machine issues with optional filters.           |
| `/machine-issues`                 | POST       | Report a new machine issue.                                  |
| `/machine-issues/:id`             | PATCH      | Update machine issue status (resolved/unresolved).           |

| `/fin-statements`                 | GET        | Retrieve financial statements based on date range.           |
| `/fin-statements`                 | POST       | Create a new financial statement entry.                      |
| `/fin-statements/:id`             | PATCH      | Update time spent in a financial statement.                  |
| `/statement-email/:email`         | POST       | Send financial statements via email.                         |
| `/statement-email/schedule/:email`| POST       | Schedule automated monthly email statements.                 |

| `/budget-code-types`              | GET        | Retrieve all budget code types.                              |
| `/budget-code-types`              | POST       | Create a new budget code type.                               |

| `/stats`                          | GET        | Retrieve statistical usage data (user, machine, budget).     |

---

#### **Machine API (Hardware Control)**

| **Endpoint**                      | **Method** | **Description**                                              |
|-----------------------------------|------------|--------------------------------------------------------------|
| `/turn-on`                        | POST       | Send a signal to turn on the machine (GPIO20 pulse).         |
| `/turn-off`                       | POST       | Send a signal to turn off the machine.                       |
| `/whoami`                         | GET        | Retrieve the stored machine ID from local `.env` file.       |
| `/whoami`                         | POST       | Save machine ID to `.env` file during setup.                 |
| `/clear`                          | DELETE     | Clear the stored machine ID from the local `.env` file.      |


### 6.2 Request and Response Formats

The APIs follow **RESTful** conventions and primarily use **JSON** for request bodies and responses. Below are common patterns for interacting with both the **Deployed API** and **Machine API**.

---

#### **1. Standard Request Format**

- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` *(if applicable)*
  - `Cookie: session=<session_id>` *(used for session-based auth via Lucia)*

- **Example POST Request Body:**
```json
{
  "name": "John Doe",
  "cardNum": "1234567890123456",
  "JHED": "jdoe1",
  "graduationYear": 2025,
  "isAdmin": 0
}
```

### **2. Standard Response Format**

- **Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* Resource-specific data */ }
}
```

- **Error Response**
```json
{
  "success": false,
  "message": "Error message explaining what went wrong",
  "meta": {
    "issues": [
      {
        "code": "invalid_type",
        "path": ["graduationYear"],
        "message": "Expected number, received string"
      }
    ],
    "name": "ZodError"
  }
}
```

- **Paginated Responses**

For endpoints that support pagination (e.g., /users, /machines), the response includes a meta object:

```json
{
  "success": true,
  "message": "Fetched user list",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "JHED": "jdoe1",
      "graduationYear": 2025
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

#### **4. Machine API Specific Formats**

- **Turn On Machine Request:**
  - **Endpoint:** `/turn-on`
  - **Method:** POST
  - **Request Body:** None required
  - **Response:**

    {
      "success": true,
      "message": "s: Success!"
    }

---

- **Turn Off Machine Request:**
  - **Endpoint:** `/turn-off`
  - **Method:** POST
  - **Request Body:** None required
  - **Response:**

    {
      "success": true,
      "message": "Machine turned off successfully"
    }

---

- **WhoAmI GET Response:**
  - **Endpoint:** `/whoami`
  - **Method:** GET
  - **Response:**

    {
      "success": true,
      "message": "Successfully read machine_id from file.",
      "data": 101
    }

---

- **WhoAmI POST Request:**
  - **Endpoint:** `/whoami`
  - **Method:** POST
  - **Request Body:**

    {
      "id": 101
    }

  - **Response:**

    {
      "success": true,
      "message": "Successfully saved machine information"
    }

---

#### **5. Validation Errors (from Zod)**

Validation errors use **Zod** structured responses:

- **Response Example:**

    {
      "success": false,
      "message": "name : Required, graduationYear : Expected number, received string",
      "meta": {
        "issues": [
          {
            "code": "invalid_type",
            "path": ["graduationYear"],
            "message": "Expected number, received string",
            "expected": "number",
            "received": "string"
          }
        ],
        "name": "ZodError"
      }
    }

---

#### **6. Authentication Cookies**

- **Session Cookies (Lucia):**
  - Upon login, a `Set-Cookie` header is returned.
  - Example:

    Set-Cookie: session=abc123xyz; Path=/; HttpOnly; Secure; SameSite=Strict

  - These cookies are automatically sent with:
    `credentials: "include"` in fetch requests.

---

### **Summary**:

- **All requests** use JSON.
- **Errors** follow a structured `success: false` response.
- **Pagination** includes `meta` with `page`, `limit`, and `total`.
- **Machine API** uses simplified JSON for GPIO-based control.


### 6.3 Authentication and Authorization

Authentication and authorization in the WSE Interlock System are handled through a combination of **JCard-based login** and **Lucia session management**.

---

#### **User Authentication Flow:**

1. **JCard Swipe:**
   - Users swipe or enter their **JCard number** at a kiosk or machine terminal.
   - The **JCard number** is automatically sent to the backend.

2. **Backend Validation:**
   - The system truncates the last digit of the JCard number for validation.
   - It checks the **users table** in the database for a matching card number and last digit.

3. **Session Creation:**
   - If a valid user is found and **active**, a session is created using **Lucia**.
   - A secure **session cookie** is issued to the client.
   - Sessions are required for all further authenticated routes (`credentials: "include"`).

---

#### **Authorization Logic:**

- **Standard Users:**
  - Can access the **Interlock** system and start machines.
  - Can select budget codes and track usage time.
  - Cannot access administrative dashboards or settings.

- **Admin Users:**
  - Must swipe JCard at an **admin kiosk**.
  - The backend checks if `isAdmin = 1` for the user.
  - If true, access is granted to the **Admin Dashboard**.
  - If false, login is denied and access is restricted.

---

#### **Session Management:**

- **Lucia** is used for:
  - **Session creation and validation**.
  - **Cookie management** (`Set-Cookie` headers).
  - Sessions are automatically validated on every API call.

- Example **Set-Cookie** Header:

Set-Cookie: session=abc123xyz; Path=/; HttpOnly; Secure; SameSite=Strict

```yaml


---

#### **Failed Authentication:**

- If a JCard number does not match a user:
- The backend returns a **404 User Not Found** error.

- If an inactive user attempts login:
- The backend denies access.

- If a non-admin user attempts admin login:
- The backend denies access due to **isAdmin = 0**.

---

#### **Temporary Bans and Timeout Handling:**

- Admins can **temporarily ban users** via the admin interface.
- Users with a **timeoutDate** in the past are automatically deactivated.
- Reactivation requires admin intervention.

---
```

## Database Schema 

### 7.1 UML Diagram
![image](https://github.com/user-attachments/assets/c24451da-b23d-4d57-adf5-45679a2f3a2a)

### 7.2 Table Definitions
**Table: users_table**

Column | Type | Constraints | Description  
--- | --- | --- | ---  
id | serial() | PRIMARY KEY | the database ID of the user  
name | text() | NOT NULL | the name of the user  
cardNum | text() | NOT NULL, UNIQUE | the first 15 digits of card number of the user  
lastDigitOfCardNum | integer() | NOT NULL | the last digit of the card number  
JHED | text() | NOT NULL | the JHED identifier of the user  
isAdmin | integer() | NOT NULL | flag determining whether the user is an admin  
graduationYear | integer() |  | the graduation year of the user (optional for admins)  
active | integer() | NOT NULL, DEFAULT 1 | flag determining whether the user account is active  
timeoutDate | timestamp(3) with time zone | DEFAULT now() | timestamp when the account times out  

---

**Table: machines_table**

Column | Type | Constraints | Description  
--- | --- | --- | ---  
id | serial() | PRIMARY KEY | the database ID of the machine  
hourlyRate | integer() | NOT NULL | the hourly rate of the machine  
name | text() | NOT NULL | the name of the machine  
machineTypeId | serial() | NOT NULL, REFERENCES machine_type(id) ON DELETE CASCADE | the machineType associated with this machine  
active | integer() | NOT NULL | flag determining whether the machine is active  
lastTimeUsed | timestamp(3) with time zone | NOT NULL, DEFAULT now() | timestamp when the machine was last used  

---

**Table: budgetCodeType**

Column | Type | Constraints | Description  
--- | --- | --- | ---  
id | serial() | PRIMARY KEY | the database ID of the budget code type  
name | text() | NOT NULL, UNIQUE | the name of the budget code type  

---

**Table: budgetCodes**

Column | Type | Constraints | Description  
--- | --- | --- | ---  
id | serial() | PRIMARY KEY | the database ID of the budget code  
code | text() | NOT NULL, UNIQUE | the budget code (alphanumeric)  
name | text() | NOT NULL | the name of the budget code  
budgetCodeTypeId | serial() | NOT NULL, REFERENCES budgetCodeType(id) ON DELETE CASCADE | the associated budgetCodeType  
active | integer() | NOT NULL, DEFAULT 1 | flag determining whether the budget code is active  

---

**Table: machine_type**

Column | Type | Constraints | Description  
--- | --- | --- | ---  
id | serial() | PRIMARY KEY | the database ID of the machine type  
name | text() | NOT NULL, UNIQUE | the name of the machine type  

---

**Table: user_machine_type**

Column | Type | Constraints | Description  
--- | --- | --- | ---  
id | serial() | PRIMARY KEY | the database ID of the association  
userId | serial() | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | the user in the association  
machineTypeId | serial() | NOT NULL, REFERENCES machine_type(id) ON DELETE CASCADE | the machine type in the association  

---

**Table: user_budget_code_table**

Column | Type | Constraints | Description  
--- | --- | --- | ---  
id | serial() | PRIMARY KEY | the database ID of the association  
userId | serial() | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | the user in the association  
budgetCodeId | serial() | NOT NULL, REFERENCES budgetCodes(id) ON DELETE CASCADE | the budget code in the association  

---

**Table: sessions**

Column | Type | Constraints | Description  
--- | --- | --- | ---  
id | text | PRIMARY KEY | session ID (string)  
userId | integer | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | the user associated with this session  
expiresAt | timestamp(3) with time zone |  | when the session expires  

---

**Table: financial_statements_table**

Column | Type | Constraints | Description  
--- | --- | --- | ---  
id | serial() | PRIMARY KEY | the database ID of the financial statement  
userId | serial() | NOT NULL, REFERENCES users(id) ON DELETE NO ACTION | the user who logged time  
budgetCode | serial() | NOT NULL, REFERENCES budgetCodes(id) ON DELETE NO ACTION | the budget code charged  
machineId | serial() | NOT NULL, REFERENCES machines(id) ON DELETE NO ACTION | the machine used  
dateAdded | timestamp(3) with time zone | NOT NULL | when the entry was added  
timeSpent | integer() | NOT NULL | time spent (in minutes or as defined)  

---

**Table: archived_financial_statements**

Column | Type | Constraints | Description  
--- | --- | --- | ---  
id | serial() | PRIMARY KEY | the database ID of the archived statement  
userId | serial() | NOT NULL | the user who logged time (archived)  
budgetCode | serial() | NOT NULL | the budget code charged (archived)  
machineId | serial() | NOT NULL | the machine used (archived)  
dateAdded | timestamp(3) with time zone | NOT NULL | when the entry was added (archived)  
timeSpent | integer() | NOT NULL | time spent (archived)  

---

**Table: machine_issues**

Column | Type | Constraints | Description  
--- | --- | --- | ---  
id | serial() | PRIMARY KEY | the database ID of the issue report  
userId | integer() | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | the user reporting the issue  
machineId | integer() | NOT NULL, REFERENCES machines(id) ON DELETE CASCADE | the affected machine  
reportedAt | timestamp(3) with time zone | NOT NULL, DEFAULT now() | when the issue was reported  
resolved | integer() | NOT NULL, DEFAULT 0 | 0 = Not Resolved, 1 = Resolved  
description | text |  | details of the issue  

### 7.3 Relationships and Constraints

The constrainst for the columns are displayed on the table definitions above. 
As for the relationships, the following tables are related as follows :


- **users ↔ sessions**  
  - One **users** → Many **sessions**  
    - `sessions.userId` REFERENCES `users.id` (ON DELETE CASCADE)  

- **users ↔ financial_statements_table**  
  - One **users** → Many **financial_statements_table**  
    - `financial_statements_table.userId` REFERENCES `users.id` (ON DELETE NO ACTION)  

- **users ↔ machine_issues**  
  - One **users** → Many **machine_issues**  
    - `machine_issues.userId` REFERENCES `users.id` (ON DELETE CASCADE)  

- **users ↔ budgetCodes** (many-to-many)  
  - Junction table **user_budget_code_table**  
    - `user_budget_code_table.userId` REFERENCES `users.id` (ON DELETE CASCADE)  
    - `user_budget_code_table.budgetCodeId` REFERENCES `budgetCodes.id` (ON DELETE CASCADE)  

- **users ↔ machine_type** (many-to-many)  
  - Junction table **user_machine_type**  
    - `user_machine_type.userId` REFERENCES `users.id` (ON DELETE CASCADE)  
    - `user_machine_type.machineTypeId` REFERENCES `machine_type.id` (ON DELETE CASCADE)  

- **machine_type ↔ machines**  
  - One **machine_type** → Many **machines**  
    - `machines.machineTypeId` REFERENCES `machine_type.id` (ON DELETE CASCADE)  

- **machines ↔ financial_statements_table**  
  - One **machines** → Many **financial_statements_table**  
    - `financial_statements_table.machineId` REFERENCES `machines.id` (ON DELETE NO ACTION)  

- **machines ↔ machine_issues**  
  - One **machines** → Many **machine_issues**  
    - `machine_issues.machineId` REFERENCES `machines.id` (ON DELETE CASCADE)  

- **budgetCodeType ↔ budgetCodes**  
  - One **budgetCodeType** → Many **budgetCodes**  
    - `budgetCodes.budgetCodeTypeId` REFERENCES `budgetCodeType.id` (ON DELETE CASCADE)  

- **budgetCodes ↔ financial_statements_table**  
  - One **budgetCodes** → Many **financial_statements_table**  
    - `financial_statements_table.budgetCode` REFERENCES `budgetCodes.id` (ON DELETE NO ACTION)  

- **archived_financial_statements_table**  
  - Same columns as **financial_statements_table**, but no foreign-key enforcement (used for archival only).  


## Testing

### 8.1 Test Plan
For backend testing, we aimed to test every route the api had available. For the end to end testing, we created tests to cover the main user stories. The test cases created are listed in the following section.

### 8.2 Test Cases
Backend tests were as follows
Budget Codes:

- Testing GET route returns list of budget codes
- GET returns 401 when not logged in
- POST route creates a new budget code
- POST route returns 401 when not logged in
- POST route returns 403 when not logged in as admin
- POST returns 403 when given invalid budget code type id
- POST returns 409 if a budget code already exsists
- PATCH is able to update an existing budget code
- PATCH gives 404 if given invalid budget code id
- DELETE deletes a given budget code by id
- DELETE returns 404 when trying to delete a non-existent budget code
- DELETE returns 401 if not logged in
- DELETE returns 403 if user is not an admin
- GET route filters by search, active flag, and budgetTypeId when provided 

Budget Code Types:

- GET returns list of budget code types
- POST route creates a new budget code type and returns it
- POST returns 409 if one with the same name already exists
- DELETE deletes a budget code type and returns it
- DELETE returns 404 if the id provided does not exist in the database
- PATCH is able to update an existing budget code type's name and return it
- PATCH returns a 404 if the budget code type's id does not exist in the database

Financial Statements:

- GET retuns list of financial statements
- GET returns 401 if user is not logged in
- GET returns 403 if the user is not an administrator
- POST is able to create a new financial statement
- POST returns 401 if the user is not logged in
- POST statement for emails sends an email and returns 200
- POST scheduleing email route returns a 200
- DELETE route for the email scheduling returns a 200

Machine Issues:

- POST route for machine issues creates a new machine issue
- PATCH route is able to update the resolution status of a machine issue
- GET route returns the list of current machine issues

Machines:

- GET route returns a list of machines
- GET returns 401 when no session is provided
- GET machines/:machineid returns wheather or not a machine was found with that id in the database
- GET machines/:machineid returns 401 when not using a session
- POST creates a new machine when the user is logged in
- POST returns 404 if the given machine type is not valid
- PATCH is able to edit an existing machine by id to change its name, hourly rate, and active status
- PATCH returns 404 on non existent machine
- DELETE deletes a created machine
- 404 on invalid machine
- GET can be filtered by machine type, active flag, and name

Machine Types:

- GET returns a list of machine types
- POST creates new machine type
- POST returns 409 if the machine type already exists (name should be unique)
- DELETE deletes a machine type
- DELETE returns 404 on non existent machine type
- PATCH can update a machine type name
- PATCH returns 404 on non-existent machine type

User Stats:

- GET returns a correct aggregation of stats
- GET can be filtered by budget code
- GET can be filtered by machine type
- GET can be changed to a monthy precision
- GET can be changed to a weekly precision
- GET can be changed to a hourly precision
- GET can be changed to a minute precision
- GET can be filtered with custom date ranges
- GET returns empty array when no data is in range 

Training Validation:

- GET with user id and machine id as params returns 200 when the training exists
- GET returns 404 when user does not exist
- GET returns 404 when machine does not exist
- GET returns 401 when user does not exist
- GET returns 401 when user does not exist
- GET with user id as param returns list of trainings the user has
- POST trainings creates a training record
- DELETE deletes a training record
- PATCH updates a training record (either the user or the machine)

Users:

- GET returns list of users
- POST creates a user
- POST returns 409 if user you attempt to create has the same card number
- GET with cardnum param returns if the user exists or not, and their information
- DELETE with userid param deletes a user by id
- DELETE returns 404 if the user does not exist
- GET functions with searching

  User Budget Code Relations:
  
- GET with user id as param returns the user's list of budget codes
- GET returns 404 if the user is not found
- GET returns 401 if session is not found
- POST creates a new user budget code relation, given you are signed in as an admin
- POST returns 403 if not admin
- POST returns 401 if no session
- DELETE with param of user id and budget code id, deletes a user's budget code relation
- DELETE returns 403 if not admin
- DELETE returns 401 if no session
- DELETE returns 404 if either user or machine does not exist
- PATCH with param of user id updates a users budget code
- PATCH returns 404 if the user is not found
- PATCH returns 403 if not admin
- PATCH returns 401 if no session

End-to-end:
### 8.3 Test Results

## Deployment

### 9.1 Deployment Process

To deploy this application, both the database api and the web app are deployed automatically using github actions. 

Before attempting to deploy to production, the actions will attempt to deploy a preview of both the web and the database api. If these previews fail, then the app will not be deployed to production. This is done to avoid destroying the live website and database api with a failed deployment. Additionally, for the database api to deploy, all of the jest tests for the application need to pass, as these test the api's expected functionality. 

The web deployment action, while it does run the cypress tests, is not dependent on the cypress tests passing in order to deploy. This is because some of the cypress tests are guranteed not to work due to not having a local instance of a machine api server running. This is further discussed in section 9.3, Known Issues and Limitations.

The lack of deployment for the machine api is intentional, as this api relies on interaction with the hardware on a machine to have any functionality. Because of this, it does not make sense for there to be a deployed version of this, since it would not serve any function.

### 9.2 Release Notes
N/A, this is the first release of this application.

### 9.3 Known Issues and Limitations
It is known that not all of the cypress tests pass on github actions because the current workflow does not create a new conda environment and then run the python server in the conda environment. This affects any of the end to end testing involving the interlock.

## Glossary

### 10.1 Terms and Definitions

| **Term**                   | **Definition**                                                                                      |
|----------------------------|-----------------------------------------------------------------------------------------------------|
| **Admin Dashboard**        | The interface used by administrators to manage users, machines, budget codes, and financial data.   |
| **API (Application Programming Interface)** | A set of routes and protocols enabling communication between the frontend, backend, and machine interface. |
| **Budget Code**            | A unique identifier assigned to students/clubs for billing machine usage.                          |
| **Conda**                  | An open-source package and environment management system for Python, used for Machine API setup.   |
| **Docker**                 | A platform used for developing, shipping, and running applications inside containers.               |
| **Drizzle ORM**            | An Object-Relational Mapping tool used for interacting with PostgreSQL in a type-safe manner.       |
| **End-to-End (E2E) Testing** | A testing method that verifies the complete flow of an application from start to finish.            |
| **Financial Statement**    | A report summarizing the machine usage time and associated billing for a specific user or group.    |
| **GPIO (General Purpose Input/Output)** | Pins on the Raspberry Pi used to control power to machines.                                |
| **Interlock Interface**    | The user-facing system on each machine allowing login, budget code selection, and usage tracking.   |
| **JCard**                  | The official identification card issued to Johns Hopkins University students and staff.             |
| **JHED**                   | Johns Hopkins Enterprise Directory identifier used in SAML-based SSO authentication.               |
| **Lucia Auth**             | Authentication and session management library used in the backend API.                             |
| **Machine API**            | Python-based service running on Raspberry Pi devices to control and monitor machine usage.          |
| **Machine Issue**          | A reported problem related to a machine's functionality, logged by users and resolved by admins.    |
| **Middleware**             | Software functions that run before or after API route handlers to manage sessions, authentication, etc. |
| **PostgreSQL**             | An open-source relational database used for storing users, machines, budgets, and financial data.   |
| **Raspberry Pi**           | A small, affordable computer used to host the Machine API and control physical machines.            |
| **SAML (Security Assertion Markup Language)** | A standard for exchanging authentication and authorization data between identity providers and service providers. |
| **Session**                | A temporary state storing user login information during interaction with the system.                |
| **Supabase**               | A backend-as-a-service providing managed PostgreSQL databases and API hosting.                      |
| **Tailwind CSS**           | A utility-first CSS framework for quickly building custom user interfaces.                         |
| **Vercel**                 | A platform for frontend and backend deployment, used to host the web and API components.            |
| **Vite**                   | A fast development server and build tool for modern web projects.                                  |
| **Zod**                    | A TypeScript-first schema validation library used for validating API inputs.                       |
