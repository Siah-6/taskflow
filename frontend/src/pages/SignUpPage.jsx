import { useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post(
        "/auth/register",
        formData,
      );
      console.log(res.data);
      setMessage("Signup successful!");

      // Auto-redirect to login after 1.5 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 10% 90%, rgba(99,102,241,0.03), transparent 25%),
          radial-gradient(circle at 90% 10%, rgba(168,85,247,0.03), transparent 25%),
          linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f5f3ff 100%)
        `,
      }}
    >
      {/* Background decoration - subtle blurred gradient shapes */}
      {/* Removed for cleaner, more minimal background */}

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/taskflow.png"
            alt="TaskFlow"
            className="w-20 h-20 object-contain mb-0.5"
          />
          <h1 className="text-4xl font-bold text-slate-900 mb-3">TaskFlow</h1>
          <p className="text-slate-700 text-base font-medium">
            Manage your tasks efficiently
          </p>
        </div>

        {/* Authentication Card */}
        <div className="auth-card mb-8">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              Create Account
            </h2>
            <p className="text-slate-600 text-sm">
              Start organizing your work with TaskFlow
            </p>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                message.includes("successful") ? "badge-success" : "badge-error"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full mt-5">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-taskflow-600 hover:text-taskflow-700 font-medium hover:underline transition-colors"
            >
              Sign in instead
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2026 TaskFlow — Organize. Prioritize. Deliver.</p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
