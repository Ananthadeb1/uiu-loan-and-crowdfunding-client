# 🎓 UIU PeerFund — Peer-to-Peer Loan & Crowdfunding Platform

UIU PeerFund is a full-stack, secure, student-centric financial platform designed for United International University (UIU). It connects students seeking zero-hassle micro-loans or crowdfunding with peer lenders and alumni donors.

---

## 🏗️ Architecture & Technology Stack

### 💻 Frontend (`uiu-loan-and-crowdfunding-client`)
* **Framework**: React 19 (Vite 7)
* **Styling**: TailwindCSS 3, DaisyUI 5, HSL-tailored custom UI Design System
* **Routing**: React Router 7 (`createBrowserRouter`, `PrivateRoute`, `AdminRoute`)
* **State & Data Fetching**: TanStack React Query v5, Axios (with secure JWT interceptors)
* **Authentication**: Firebase Auth Client SDK (Email/Password & Google Sign-In)
* **Icons**: React Icons & FontAwesome

### ⚙️ Backend (`uiu-loan-and-crowdfunding-server`)
* **Runtime**: Node.js & Express v5
* **Database**: MongoDB Native Client (`peerFund` database)
* **Admin Authentication**: Firebase Admin SDK (`firebase-admin`)
* **Token Authentication**: JSON Web Tokens (JWT)
* **File Processing**: Multer (profile picture storage and validation)

---

## 🌟 Core Features

1. **User Authentication & Profile Sync**:
   * Multi-method signup/login (Email & Google Sign-In).
   * Automatic synchronization between Firebase Auth and MongoDB `users` collection.
   * Profile image upload with file type & 5MB size validation.
   * Additional profile metadata management (birthdate, address, gender).

2. **Role-Based Access Control (RBAC)**:
   * **Dynamic Navigation Bar**: Navbar dynamically filters and renders links based strictly on user authentication and role privileges.
   * Restricted pages are guarded by `PrivateRoute` and `AdminRoute`.

3. **Peer-to-Peer Loan Request & Bidding Marketplace**:
   * Students can submit loan applications with customized loan amounts, repayment terms, and purposes.
   * Peer lenders and donors can browse pending loans and submit interest-rate offers and custom messages.

4. **Campus Crowdfunding Platform**:
   * Fundraise for academic ventures, tech projects, and student relief.
   * Real-time campaign tracking with interactive funding progress bars and direct donation capabilities.

5. **Loan Rate Comparison**:
   * Interactive interest rate comparator helping students select optimal borrowing terms.

6. **Admin Control Center & Management Dashboard**:
   * System-wide statistics: total users, donors, crowdfund campaigns, and loan applications.
   * **Dual Database & Firebase User Deletion**: Deleting a user from the Admin Dashboard permanently purges the record from both **MongoDB** and **Firebase Authentication**.
   * User role promotion (`User/Donor` $\rightarrow$ `Admin`).
   * Application review and status approval/rejection for loans and crowdfunding campaigns.

---

## 🛡️ Role Management Matrix

| Feature / Route | Unauthenticated | Regular User (`user`) | Donor (`donor`) | Administrator (`admin`) |
| :--- | :---: | :---: | :---: | :---: |
| **Home (`/`)** | ✅ | ✅ | ✅ | ✅ |
| **Login / Signup (`/login`, `/signup`)** | ✅ | ❌ | ❌ | ❌ |
| **Crowdfunding (`/crowdfunding`)** | ❌ | ✅ | ✅ | ✅ |
| **Loan Request (`/loan-request`)** | ❌ | ✅ | ❌ | ✅ |
| **Loan Bidding (`/loan-bidding`)** | ❌ | ✅ | ✅ | ✅ |
| **Loan Comparison (`/loan-comparison`)** | ❌ | ✅ | ✅ | ✅ |
| **Profile (`/profile`)** | ❌ | ✅ | ✅ | ✅ |
| **Admin Dashboard (`/dashboard`)** | ❌ | ❌ | ❌ | ✅ |

---

## 🔐 Security Considerations

1. **JWT Bearer Token Interception**:
   * Upon successful authentication, a JWT is issued by the server and stored securely.
   * `useAxiosSecure` automatically attaches the token (`Authorization: Bearer <token>`) to outgoing requests.
   * Automatic 401/403 interceptors revoke invalid tokens and redirect unauthenticated users to `/login`.

2. **Server-Side Route Protection**:
   * `verifyToken` middleware enforces valid JWT signatures on sensitive APIs.
   * `verifyAdmin` middleware verifies that the decoded email belongs to a user with `role: "admin"` in MongoDB before executing admin operations.

3. **Synchronous Firebase & MongoDB User Purge**:
   * When an administrator deletes a user, the backend leverages `firebase-admin` to delete the Firebase Auth user by `uid` or `email` before purging the MongoDB user document, preventing orphaned authentication records.

4. **Input & Upload Sanitization**:
   * Passwords must meet complexity requirements (6+ chars, 1 letter, 1 number, 1 special char).
   * Profile picture uploads are restricted to image MIME types and capped at 5MB limit.

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js (v18+)
* MongoDB Atlas Cluster or local MongoDB instance
* Firebase Web App & Service Account credentials

### 2. Backend Setup (`uiu-loan-and-crowdfunding-server`)
```bash
cd uiu-loan-and-crowdfunding-server
npm install
```

```
Start the development server:
```bash
npm run dev
```

### 3. Frontend Setup (`uiu-loan-and-crowdfunding-client`)
```bash
cd uiu-loan-and-crowdfunding-client
npm install
```
Start the frontend development server:
```bash
npm run dev
```

---

## 📜 License
This project is open-source under the [ISC License](LICENSE).
