import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      login(response.data);

      // Success Toast
      toast.success("Login successful!");

      navigate("/dashboard");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <i className="bi bi-wallet2"></i>
        </div>

        <h2>Welcome Back</h2>

        <p className="text-muted">
          Login to manage your finances
        </p>

        <form onSubmit={submit}>

          {/* Email */}
          <label>Email</label>

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
            required
          />

          {/* Password */}
          <label>Password</label>

          <input
            type="password"
            className="form-control mb-4"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
            required
          />

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >

            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                ></span>

                Logging in...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </>
            )}

          </button>

        </form>

        <p className="text-center mt-4 mb-0">

          Don't have an account?

          {" "}

          <Link to="/signup">
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Login;