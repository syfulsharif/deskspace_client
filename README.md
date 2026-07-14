# DeskSpace 🚀

DeskSpace is a modern, premium full-stack web application designed for booking flexible co-working spaces, private offices, meeting rooms, and creative studios. Built with the latest technologies, DeskSpace offers an elegant, fully responsive, and highly dynamic user interface for finding, filtering, and managing on-demand workspaces in Seattle.

## 🌟 Key Features

### For Users
- **Dynamic Exploration:** Browse through hundreds of premium workspaces with advanced filtering by category, location, and price. 
- **Real-Time Booking:** Instantly book hour-based reservations with clear total cost estimations.
- **Detailed Listings:** View comprehensive space specifications, client reviews, large image showcases, and a checklist of included premium amenities.
- **Secure Authentication:** JWT-based user authentication ensuring that only registered users can book spaces and access private features.
- **Dashboard Management:** A dedicated user dashboard to manage, view, or cancel active reservations.

### For Hosts / Admins
- **Space Hosting:** An intuitive "List Your Workspace" portal that allows administrators and hosts to publish new offices or studios.
- **Listing Management:** Delete and manage active listings straight from a dedicated, interactive dashboard.

## 🛠️ Technology Stack

**Frontend Architecture (Decoupled)**
- **Framework:** React 19 + Vite for lightning-fast HMR and optimized production builds.
- **Styling:** Tailwind CSS V4 for a utility-first, fully responsive design system focusing on "Amber" and "Zinc" color palettes.
- **Animations:** Motion (Framer Motion) for smooth page transitions and micro-interactions.
- **Icons:** Lucide React for consistent and crisp vector iconography.
- **Routing:** React Router (Client-side routing)

**Backend Architecture**
- **Server:** Node.js with Express.js for scalable REST API routing.
- **Database:** MongoDB via Mongoose for structured, NoSQL document storage.
- **Authentication:** JWT (JSON Web Tokens) with HttpOnly secure cookies.
- **Security:** bcryptjs for secure password hashing.

## 🚀 Live Demo & Deployment

- **Frontend Deployment:** Hosted on Vercel as a scalable Single Page Application.
- **Backend API:** Hosted on Vercel as Serverless Functions (`@vercel/node`), ensuring high availability and zero-maintenance scaling.
- **Database Storage:** MongoDB Atlas Cluster.

*(Note: To log in quickly during testing, click the "Fast Demo Access" buttons on the `/login` page to auto-fill credentials for both User and Admin accounts).*

## 💻 Local Development Setup

### 1. Clone the repository
Ensure you have cloned both the `deskspace_frontend` and `deskspace_backend` repositories.

### 2. Backend Setup
Navigate to the `deskspace_backend` directory:
```bash
cd deskspace_backend
npm install
```
Create a `.env` file in the backend root and configure the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend development server:
```bash
npm run dev
```
*(The backend will start on http://0.0.0.0:3000)*

### 3. Frontend Setup
Navigate to the `deskspace_frontend` directory:
```bash
cd deskspace_frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```
*(The frontend will start on http://localhost:5173. Note that local API requests will be proxied automatically via Vite's proxy configurations).*

## 📖 Pages & Routing

| Public Routes | Description |
| :--- | :--- |
| `/` | The dynamic Home page with hero sliders, feature highlights, and interactive charts. |
| `/explore` | Directory view with search, filtering, sorting, and pagination. |
| `/workspace/:id` | Specific workspace details including pricing and booking forms. |
| `/about` | Our Story & Vision, Neighborhood coverage maps. |
| `/contact` | Get in touch via a sleek contact form. |
| `/login` & `/register` | JWT-powered authentication pages. |

| Protected Routes | Description |
| :--- | :--- |
| `/add-workspace` | Form for hosts/admins to list a new physical workspace. |
| `/manage` | User dashboard divided into "My Bookings" and "My Hosted Listings". |

## 🎨 Design Philosophy
DeskSpace was designed to feel premium. Rather than relying on generic UI kits, all components (Cards, Modals, Buttons, Inputs) are hand-crafted to provide a highly cohesive experience. It utilizes glassmorphism effects, subtle hover states, sharp typography, and deliberate whitespace to inspire trust and confidence for remote workers.

---
*Built with passion for the ultimate co-working experience.*
