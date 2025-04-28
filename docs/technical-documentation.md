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

### 5.1 User Interface Overview

### 5.2 User Authentication

### 5.3 Core Functionality

### 5.4 Advanced Features

### 5.5 Troubleshooting

## API Documentation

For this application, we are using two APIs: the Machine API and the Deployed API. 

### 6.1 Endpoints

### 6.2 Request and Response Formats

The format for the request is as follows: 



### 6.3 Authentication and Authorization

For authentication and Authorization, we have a users table, which serves not only as a data type displayed and managed on the kiosk, but as the users for the application itself. Users will swipe their Jcard on a scanner, which will automatically send their Jcard number to the backend route. If the Jcard number matches a user in the database, then the user will be authenticated into the Interlock/Machine Gate. However, if a non-admin user swipes their Jcard on the scanner to login into the admin kiosk, the backend will see that their isAdmin flag is 0, which will result in a failure to login. The authentication was implemented using Lucia for general authentication logic and cookie/session management.

## Database Schema 

### 7.1 Entity-Relationship Diagram

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
Our testing in general was split into two large portions: End-to-End and Unit testing. In End-to-End testing we focused on testing general workflow of the application and data flow from the frontend to the backend and assert the front end responded approapiately. For unit testing, we focused on testing the functions and endponts on each route, ensuring proper responses were returned given various scenarios/inputs to assert proper functionality of the backend routes. 

### 8.2 Test Cases

In general, the backend routes had the following test cases: 
404 Not found errors, 
401 Unauthorized Errors, 
403 Not Admin Error, 
POST 201
GET 200
DELETE 200
PATCH 200.

As for the Front End, cases were varied depending on the component the End-to-End testing was setup for, however, in general the flow was 

### 8.3 Test Results

## Deployment

### 9.1 Deployment Process

### 9.2 Release Notes

### 9.3 Known Issues and Limitations

## Glossary

### 10.1 Terms and Definitions****
