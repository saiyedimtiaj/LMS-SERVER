# Expo LMS Platform - Backend

This is the backend for the Expo LMS Platform, a Learning Management System (LMS) that supports user authentication, course management, payments, and more.

## Technologies Used

- **Node.js**: Backend runtime
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database using Mongoose as an ODM
- **JWT (JSON Web Tokens)**: For authentication and authorization
- **Cloudinary**: For image and video uploads
- **Stripe**: For handling payments
- **SMTP**: For sending emails (used for user account activation and other notifications)

## Features

- **User Authentication**: Users can register, log in, and receive a verification email.
- **Course Management**: Supports course creation, editing, and viewing for both users and admins.
- **Payments**: Integrated with Stripe for secure course purchases.
- **Admin Panel**: Admins can view statistics, manage users, courses, and transactions.
- **Order Analytics**: Admins can view detailed order analytics in charts.

## Installation

To set up and run the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/saiyedimtiaj/LMS-SERVER.git
   cd LMS-SERVER
   ```

2. **Install the dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:

   ```bash
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLIC_KEY=your_stripe_public_key
   GOOGLE_SECRET_ID=your google secret id
   ```

4. **Run the application**:

   - For development:

     ```bash
     npm run start:dev
     ```
