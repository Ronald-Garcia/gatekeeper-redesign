# Problem Statement

The WSE student shop provided by the mechanical engineering department had a safety concern with their machines. Without proper training, these machines are dangerous and accident-prone. To prevent possible accidents, the shop wanted an identification system where students would only be allowed to use the machines if they have received proper training. 

The initial solution was to use a fingerprint system that would save fingerprints of those who have been trained. However, over time, this solution's technology became too difficult to maintain, necessitating another solution. Additionally, keeping track of budgeting was tedious and difficult to verify, as students during the final project season might forget to write down their budget codes.

# Proposed Solution

To overcome the maintenance issues of fingerprint sensors, we are leveraging the fact that all students and staff of The Johns Hopkins University have a JCard, which has a unique JCard ID (JID). With this number, each account can be uniquely associated with this JID. The account can also be linked with a student's JHU authentication.

Each user account will have a list of budget codes that are automatically charged and tracked as machines are used. The machines, locked behind Gatekeepers, will ensure that only users with appropriate training can activate the machines.

# Potential Clients

This system can be used as a security measure for not just machining but for any location with dangerous machinery, including:
- Machinists
- Lab managers
- Users of machine shops

# Functional Requirements

## Must-Have
- As an administrator, I would like there to be a central dashboard that serves as a center of operations on students, machines, budget codes, and transaction reports so that I can take administrator actions all one place.
- As an administrator, I want user's time to be tracked, so that I know how much to bill them.
- As an administrator, I would like financial statements to be sent on a day of my choosing every month that summarizes the details of transactions that occur every month. A transaction includes the student/staff that used the machine, the budget code associated with the machining operation, the machine used, and the time spent.
- As an administrator, I would like to be able to ban / remove users from using machines if they are not using the machines correctly.
- As an administrator, I want the ability to ban / remove specific clubs so that clubs that do not pay cannot use the machines.
- As a user, I want to scan my card to turn on the machine, so that I can use the machine for my projects.
- As an administrator, I would like the card scanners to restrict access based on a student's current trainings to ensure that the machines would only activate for students that are trained on the machine.
- As a student, I would like to be able to select my budget code for the club/class I am doing work for.
- As an administrator, I would like to add budget codes to student accounts, so that they can be associated with an account that can be billed.

## Nice-to-Have
- As an administrator, I want student accounts to be automatically flagged when their expected graduation year passes so I know to remove them.
- As a student, I would like to see how busy the machine shop is online, so that I can see if the machines I want are available.
- As a student, I would like to optionally sign in with my JHU credentials so that I can sign in without my physical card.
- As an administrator, I would like to be able to sign people up with only their JHU credentials.
- As an administrator, I want the ability to time out specific users for a specified amount of time so that it can be used for rule enforcement.
- As an administrator, I want the ability to time out specific clubs for a specified amount of time so that it can be used for rule enforcement.
- As an administrator, I would like to be able to activate/deactivate certain machines (the Gatekeepers would not allow anyone to activate these machines) in case the machines are out of order.
- As an administrator, I want certain budget codes to automatically expire so people do not have access beyond the time allotted.
- As a student, I would like to report any maintenance issues in the shop or of the machines so that administrators are aware of issues happening in the shop.
- As an administrator, I would like for the financial statement to be automated for ease of use.
- As an administrator, I would like to have a password and the ability to reset my password to prevent non-admins from using the administrator dashboard.
- As a machine owner, I want the software to have safeguards against turning off the machine mid-use, as otherwise sudden shut offs will damage the machine.

# Similar Existing Apps

Several industry and university applications provide similar functionalities, such as:
- **Agilent’s iLab** – Allows specification of authorized users for machinery use, enhancing safety and accountability.
- **BookitLab** – Provides authentication measures, equipment scheduling, and inventory management.
- **Labguru** – Primarily focused on laboratory environments but applicable to machine shops.
- **Raritan** – Implements IP-based access control for device authentication.

JHU previously attempted to use Agilent’s iLab but found it too difficult to set up.

# Software Architecture & Technology Stack

This project consists of three main components:
1. **Administrator Dashboard App**
   - Allows admins to:
     - View and set the status of machines, users, and clubs.
     - Monitor time usage and billing details.
     - View machine runtime.
2. **Machine Interface App**
   - Runs on a Raspberry Pi at each machine.
      - Uses the GPIO library in Python to send and read voltages from the Raspberry PI
   - Enables users to scan their JCard to activate a machine after verifying:
     - Budget code
     - JCard ID
     - User training status
   - Tracks and saves usage time.
3. **API & Database**
   - Handles:
     - User and club management
     - Training records
     - Machine status modifications
     - Financial report generation
   - Ensures persistent storage of user information, privileges, and time spent.
   - Either the admin dashboard or the server will send financial statement emails monthly.

### Technology Stack
- **Frontend:** React + TypeScript with Vite, Tailwind CSS for styling. Vercel for online hosting, or possibly JHU server.
- **Backend:** Hono web framework, TypeScript, Drizzle ORM, PostgreSQL database. Subabase for online hosting backend (works with hono), or possibly JHU server.
- **Machine Interface:** Python to run the server on Raspberry Pis.
