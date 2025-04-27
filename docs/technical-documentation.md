# Technical Documentation

## Introduction

### 1.1 Purpose

### 1.2 Scope

### 1.3 Audience

## System Overview

### 2.1 Architecture

### 2.2 Technologies Used

### 2.3 Dependencies

## Installation Guide

### 3.1 Prerequisites

### 3.2 System Requirements

### 3.3 Installation Steps

## Configuration Guide

### 4.1 Configuration Parameters

### 4.2 Environment Setup

### 4.3 External Services Integration

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
