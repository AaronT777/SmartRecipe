# SmartRecipe (Iteration 3)

Iteration 3 represents the final evolution of SmartRecipe, introducing AI-powered features, enhanced authentication, and improved accessibility. This update transforms the application into a modern, AI-driven recipe platform with cloud storage capabilities and universal design principles.

![image](https://github.com/user-attachments/assets/e4080000-34a5-491e-81b4-2c98f28dbcff)
![image](https://github.com/user-attachments/assets/b134e1a7-f651-4cdd-9184-310e244b3791)
![image](https://github.com/user-attachments/assets/74a11dd2-6477-4b38-be35-5f8c4f3838b1)
![image](https://github.com/user-attachments/assets/da974f8a-0ceb-4168-a20a-11e19d3b3fd1)
![image](https://github.com/user-attachments/assets/cdd7dff1-4421-4585-bed6-e33066182891)
![image](https://github.com/user-attachments/assets/078ba082-c343-4011-92c1-8bce807034f5)
![image](https://github.com/user-attachments/assets/023870cd-8c72-4e05-952e-1b42fac98ead)
![image](https://github.com/user-attachments/assets/adb20c4c-e078-45b8-9678-e493e162b649)
![image](https://github.com/user-attachments/assets/a06e2b68-9827-40c3-923b-bb81c307bced)
![image](https://github.com/user-attachments/assets/19bc99b5-c432-451e-aa7b-fd78c33d72b3)
![image](https://github.com/user-attachments/assets/1ab5c8ba-4c5a-46b9-a5f7-32da5d846ea4)
![image](https://github.com/user-attachments/assets/a5763314-f49f-4727-94bc-025438cd661a)
![image](https://github.com/user-attachments/assets/48607fa3-3224-4267-aa2d-0b58fbd10917)
![image](https://github.com/user-attachments/assets/a679e434-1f4c-4638-9902-a4dd1ead2e0d)
![image](https://github.com/user-attachments/assets/5821adb0-da2c-4461-b010-efb866e1ea10)

## New Implementations in Iteration 3

### AI-Powered Features
- 🤖 **OpenAI Integration**: Recipe generation based on ingredients users already have
- 🧠 **Intelligent Suggestions**: AI-driven recipe recommendations tailored to user preferences
- 🖼️ **AI Image Generation**: Automatic creation of visually appealing recipe images

### Enhanced Authentication and Storage
- 🔐 **Auth0 Authentication**: Secure, scalable authentication replacing custom JWT implementation
- ☁️ **Cloudinary Integration**: Cloud-based image storage for consistent recipe images across environments
- 🌐 **Cross-Platform Consistency**: Unified image experience whether running locally or on render.com

### User Experience Improvements
- 👤 **Public User Profiles**: Ability to view other users' profiles and recipe collections
- ♿ **Accessibility Excellence**: Achieved perfect Lighthouse accessibility score
- 🎨 **Refined Styling**: Elegant, clean interface with enhanced visual aesthetics

## Team Contributions for Iteration 3

### Xinghang Tong
- **AI and Cloud Integration:**
  - Implemented OpenAI API for AI-generated recipe suggestions
  - Set up Cloudinary integration for cloud-based image storage
  - Created public user profile pages viewable by all users including anonymous visitors
  - Refined styling across the application for a more elegant and user-friendly interface

### Tianze Yin
- **Authentication and Accessibility:**
  - Migrated from custom JWT authentication to Auth0 platform
  - Enhanced application accessibility to achieve perfect Lighthouse score

## Coming Next

With the completion of SmartRecipe, we've established a solid foundation for future enhancements that could include:

- 📱 **Mobile Application**: Native mobile versions for iOS and Android
- 🌐 **Social Features**: Enhanced sharing and collaborative cooking experiences
- 🛒 **Grocery Integration**: Direct connections to online grocery delivery services
- 📈 **Advanced Analytics**: Personal nutrition tracking and meal planning

---

# SmartRecipe (Iteration 2)

Iteration 2 focuses on implementing backend functionality and connecting the frontend to the API. This update brings the application from a UI prototype to a fully functional web application with real data persistence.

![image](https://github.com/user-attachments/assets/0cd1359b-5124-4e34-85d9-ac639649a6e4)
![image](https://github.com/user-attachments/assets/dce995b3-fe97-48d4-9208-dffeac46a65d)
![image](https://github.com/user-attachments/assets/2a091977-5085-456e-aec9-ff8671a20da2)
![image](https://github.com/user-attachments/assets/98c8883a-567c-4ece-86e2-4ca08d4ae554)
![image](https://github.com/user-attachments/assets/62014d99-44d0-4c85-a1ad-a58b1423ab85)
![image](https://github.com/user-attachments/assets/77495969-e8b1-4796-8881-e0a2ec77a41e)

## New Implementations in Iteration 2

### Backend API Implementation
- ✅ **Complete CRUD Operations**: Fully implemented controllers for all API routes
- 🔐 **Authentication System**: JWT-based authentication with secure password hashing
- 📂 **File Storage**: Image upload functionality for recipe photos
- 🍽️ **Yelp Integration**: External API integration for restaurant recommendations

### Frontend-Backend Integration
- 🔄 **API Service Layer**: Created unified API service for consistent data fetching
- 🔐 **Live Authentication**: Connected login/register flows to backend
- 📝 **Recipe Management**: Integrated create, update, delete operations with backend
- 🔍 **Search Functionality**: Connected search interface to real data
- 👤 **User Profile**: Implemented saved recipes and profile editing capabilities

## Project Enhancements
- 📱 **Responsive Improvements**: Enhanced mobile experience
- 🎨 **UI Polishing**: Refined styling and user interaction
- 🧪 **Data Validation**: Added input validation on forms
- 🚀 **Performance Optimizations**: Improved data loading and state management

## Team Contributions for Iteration 2

### Xinghang Tong
- **Backend Implementation:**
  - Completed recipe and review controllers with full CRUD functionality
  - Implemented route handlers for recipe and review operations
  - Created Yelp API service integration
  - Fixed server configuration and database connection issues
- **Frontend Integration:**
  - Created unified API service layer (`/client/src/services/api.js`)
  - Connected recipe detail page to backend API
  - Connected recipe creation/editing to backend
  - Updated RecipeCard component to use real data
  - Enhanced Home page with Yelp API integration for restaurant recommendations
  
### Tianze Yin
- **Backend Implementation:**
  - Completed user controller with authentication and profile management
  - Implemented route handlers for user operations
  - Contributed to recipe controller implementation
- **Frontend Integration:**
  - Connected login and registration pages to authentication API
  - Connected search page to backend API
  - Enhanced profile page with edit functionality and API integration
  - Updated global authentication state in main App component

## Getting Started

The installation and running instructions remain the same as in Iteration 1. Please refer to the Iteration 1 documentation below for setup details.

## Coming in Iteration 3

For the next iteration of SmartRecipe, we plan to implement the following features:

- 🤖 **OpenAI API Integration**: Connect to OpenAI API to generate recipes based on user-provided ingredients
- 🔑 **Auth0 Authentication**: Migrate from custom JWT authentication to Auth0 platform
- 🎨 **Enhanced UI/UX**: Further refinement of UI design and CSS styling
- 📱 **Responsive Polishing**: Final adjustments to ensure optimal experience across all devices

---

# SmartRecipe (Iteration 1)

SmartRecipe is a responsive web application for recipe management built with the MERN stack (MongoDB, Express, React, Node.js). This repository contains the initial implementation (Iteration 1) of the application.
![image](https://github.com/user-attachments/assets/ba384424-178f-4303-8942-edb421f0c92f)
![image](https://github.com/user-attachments/assets/bdda1c45-9a12-4216-bb02-37ad26538f30)
![image](https://github.com/user-attachments/assets/30008afa-11f9-44eb-b89e-4a277c6fd509)
![image](https://github.com/user-attachments/assets/73c32506-2144-4e44-92e8-9339be71b794)
![image](https://github.com/user-attachments/assets/3282f683-caea-47a0-9e4e-7f3f22583629)
![image](https://github.com/user-attachments/assets/0c6f4704-9b3a-4d77-bf0f-2bbef3b8d470)
![image](https://github.com/user-attachments/assets/d8fc88f2-7903-4132-8814-2ad64f3c8edd)


## Implemented Features

### Frontend
- 📱 **Responsive UI:** Adapts to desktop, tablet, and mobile screens
- 🏠 **Homepage:** Features a "What's in your kitchen?" component for ingredient input
- 🔍 **Search Interface:** Search page with sorting options (using mock data)
- 📝 **Recipe Creation Form:** Form for adding new recipes with validation
- 👤 **User Profiles:** Display of created and saved recipes with tabs
- 🍽️ **Recipe Detail View:** Detailed recipe view with ingredients, instructions, and reviews
- 🔐 **Authentication UI:** Login and registration pages

### Project Structure
- 📂 **Client-Server Architecture:** Separated frontend (React) and backend (Express) codebases
- 🛣️ **Routing:** Client-side routing with React Router
- 🧩 **Component Structure:** Reusable components like RecipeCard
- 🎨 **Styling:** CSS organization by component, responsive design with Bootstrap

### Development Setup
- ⚙️ **Build Configuration:** Vite for frontend, Node.js for backend
- 🔄 **Development Scripts:** Concurrent running of client and server
- 📊 **Project Configuration:** Package management, gitignore setup

## Tech Stack

### Frontend
- React 19.0.0
- React Router DOM 7.3.0
- Bootstrap 5.3.3
- Axios for API calls
- Vite as build tool

### Backend
- Node.js with Express
- MongoDB with Mongoose (models defined)
- JWT structure for authentication
- Multer for file upload (structure only)

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/SmartRecipe.git
cd SmartRecipe
```

2. Install dependencies for both server and client
```
npm run install-all
```

3. Create a `.env` file in the server directory with:
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the Application

To run both the server and client concurrently in development mode:
```
npm run dev
```

To run only the server:
```
npm run server
```

To run only the client:
```
npm run client
```

## Notes for Iteration 1

This is the first iteration of the SmartRecipe application focusing on UI implementation and project structure. Key points about the current state:

- UI components and pages are implemented with mock data
- Database models are defined but not fully connected
- Authentication is simulated with localStorage (not fully implemented)
- API routes are structured but minimally implemented

## Project Structure

```
SmartRecipe/
├── client/                 # React frontend
│   ├── src/                
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
├── server/                 # Node.js backend
│   ├── models/             # MongoDB data models
│   ├── routes/             # API route definitions
│   ├── middleware/         # Custom middleware
│   ├── index.js            # Server entry point
└── package.json            # Root dependencies and scripts
```

## Team Contributions

### Xinghang Tong
- **Project Setup:**
  - Initialize project structure (including App.jsx, App.css, main.jsx, index.css)
  - Deploy the application on render.com
  - Server setup (server/index.js, server/db.js)
- **Recipe Management:**
  - Recipe Card component (RecipeCard.jsx, RecipeCard.css)
  - Comprehensive Recipe Detail page (RecipeDetail.jsx, RecipeDetail.css)
  - Complex Recipe Creation interface with validation (AddRecipe.jsx, AddRecipe.css)
- **UI Components:**
  - Main Navigation Bar (NavBar.jsx, NavBar.css)
  - Homepage (Home.jsx, Home.css)
- **Backend Structure:**
  - Recipe model (server/models/Recipe.js)
  - Recipe routes setup (server/routes/recipeRoutes.js)
  - Review model (server/models/Review.js)
  - Review routes setup (server/routes/reviewRoutes.js)
  
### Tianze Yin
- **Authentication System:**
  - Login page (Login.jsx)
  - Registration page (Register.jsx)
  - Authentication styling (Auth.css)
  - Authentication middleware (server/middleware/auth.js)
- **User Features:**
  - Profile page (Profile.jsx, Profile.css)
  - Search page (Search.jsx, Search.css)
  - Not Found page (NotFound.jsx, NotFound.css)
- **Backend Structure:**
  - User model (server/models/User.js)
  - User routes setup (server/routes/userRoutes.js)
  
*Note: All API routes are currently set up as empty route handlers, with the structure in place but no implementation details. These will be filled out in the next iteration to handle actual database operations.*

All features were developed in separate feature branches and merged to main after code review.

## Authors

- Xinghang Tong
- Tianze Yin
