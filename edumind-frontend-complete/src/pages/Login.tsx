import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";

import { api } from "../api/axios";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data.data);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Left Side */}
      <div className="auth-art">
        <div className="auth-brand">
          <div className="brand-mark">
            <Sparkles size={19} />
          </div>

          <b>EduMind AI</b>
        </div>

        <div className="auth-copy">
          <span className="eyebrow">PERSONALIZED LEARNING</span>

          <h1>
            Learn smarter.
            <br />
            <em>Grow faster.</em>
          </h1>

          <p>
            Your AI-powered learning companion for tutoring, quizzes, planning
            and progress.
          </p>

          <div className="art-pills">
            <span>AI Tutor</span>
            <span>Smart Quizzes</span>
            <span>Study Plans</span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="auth-panel">
        <form className="auth-form" onSubmit={submit}>
          <div className="mobile-brand">
            <Sparkles size={20} />
            <span>EduMind AI</span>
          </div>

          <span className="eyebrow">WELCOME BACK</span>

          <h2>Sign in to your account</h2>

          <p className="muted">Continue your learning journey.</p>

          {error && <div className="alert error">{error}</div>}

          {/* Email */}
          <label>
            Email
            <div className="input-wrap">
              <Mail size={18} />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          {/* Password */}
          <label>
            Password
            <div className="password-wrap">
              <LockKeyhole size={18} />

              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {/* Login Button */}
          <button className="primary-btn full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Register */}
          <p className="auth-foot">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
