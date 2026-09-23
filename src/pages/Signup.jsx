import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    // Password check
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {

      const response = await api.post(
        "/auth/signup",
        {
          name: form.name,
          email: form.email,
          password: form.password
        }
      );

      login(response.data);

      toast.success(
        "Account created successfully!"
      );

      navigate("/dashboard");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Signup failed"
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

        <h2>Create Account</h2>

        <p className="text-muted">
          Start tracking your finances
        </p>

        <form onSubmit={submit}>

          {/* Name */}
          <label>Name</label>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
            required
          />

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
            className="form-control mb-3"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
            minLength="6"
            required
          />

          {/* Confirm Password */}
          <label>Confirm Password</label>

          <input
            type="password"
            className="form-control mb-4"
            placeholder="Repeat password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value
              })
            }
            required
          />

          {/* Signup Button */}
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

                Creating Account...
              </>
            ) : (
              <>
                <i className="bi bi-person-plus me-2"></i>
                Create Account
              </>
            )}

          </button>

        </form>

        <p className="text-center mt-4 mb-0">

          Already have an account?

          {" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Signup;