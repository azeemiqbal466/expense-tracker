import { Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Income from "./pages/Income.jsx";
import Expenses from "./pages/Expenses.jsx";
import Reports from "./pages/Reports.jsx";
import Profile from "./pages/Profile.jsx";
import Search from "./pages/Search.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (

    <ThemeProvider>

      <AuthProvider>

        <Routes>

          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* SIGNUP */}
          <Route
            path="/signup"
            element={<Signup />}
          />


          {/* PROTECTED ROUTES */}

          <Route element={<ProtectedRoute />}>

            <Route element={<Layout />}>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/income"
                element={<Income />}
              />

              <Route
                path="/expenses"
                element={<Expenses />}
              />

              <Route
                path="/reports"
                element={<Reports />}
              />

              <Route
                path="/profile"
                element={<Profile />}
              />
              <Route
  path="/search"
  element={<Search />}
/>

            </Route>

          </Route>


          {/* DEFAULT */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />


          {/* INVALID URL */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>


        {/* TOAST */}

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

      </AuthProvider>

    </ThemeProvider>
  );
}

export default App;