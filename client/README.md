# Customer Management React App

A simple React application to manage customers with CRUD operations, built using React components and a Node.js backend API.

## Features
- List customers with pagination and name-filtering.
- Add new customers via a form by Clicking new Customer.
- View detailed customer information including addresses.
- Edit and delete customers.
- Edit and delete Addresses of particular Customer
- State management with class components following camelCase naming.
- Backend API integration on port 5000 using snake_case fields.
- Simple loading indicators and user-friendly navigation.

## Folder Structure
src/
 ├── components/        # Reusable UI components (CustomerList, CustomerForm, AddressList, AddressForm)
 ├── pages/             # Page components (CustomerListPage, CustomerFormPage, CustomerDetailPage)
 ├── App.js             # React Router and main app routes
 └── index.js           # App entry point

## Installation
1. Clone the repository:

   git clone <your-repo-url>
   cd your-project-folder

2. Install dependencies:

   npm install      # Installs all frontend and backend dependencies listed in  package.json.

3. Make sure your backend server is running on `http://localhost:5000`.

4. Start the React development server:

   npm start

5. Open your browser and go to `http://localhost:3000`.


## Usage

- Use the app to create, edit, view, and delete customers.
- Navigate using the links and buttons.
- Name filter input filters customers by name.
- Forms validate required fields before submission.

## Technologies Used

- React (Class Components)
- React Router
- Axios for API communication
- Node.js / Express (Backend API)
- CSS for styling

## Notes

- Backend uses `snake_case` for JSON fields; frontend converts to `camelCase`.
- Validation is basic and checks that required fields are not empty.
- URL syncing for filters is omitted to keep the code simple.
- Confirmation dialogs use simple `window.confirm`, which can be replaced if needed.

---

## Author

 Name - Lakshmi Prasannakumar Reddy
 Email - bogachandrapu@example.com