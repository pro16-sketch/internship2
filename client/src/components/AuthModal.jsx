
import React, { useState } from "react";

const API_URL = "http://localhost:5000/api/auth";

function AuthModal({ onClose, onLogin, required = false }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (isRegister && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister ? "/register" : "/login";

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(isRegister && { name: name.trim() }),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (isRegister) {
        setIsRegister(false);
        setName("");
        setPassword("");
        setError("Registration successful! Please login.");
        return;
      }

      onLogin({
        user: data.user,
        token: data.token,
      });

    } catch (err) {
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overlay">
      <div className="auth-modal">

        {!required && (
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        )}

        <h2>
          {isRegister ? "Create Account" : "Welcome to ShopSphere"}
        </h2>

        <p>
          {isRegister
            ? "Register to access our store."
            : "Login to continue shopping."}
        </p>

        <form onSubmit={handleSubmit}>

          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="User ID / Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
          />

          {error && (
            <p style={{
              color: error.includes("successful") ? "#16a34a" : "#dc2626",
              fontSize: "14px",
              margin: "10px 0"
            }}>
              {error}
            </p>
          )}

          <button
            className="primary-btn full-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Register"
                : "Login"}
          </button>

        </form>

        <p className="switch-auth">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? " Login" : " Register"}
          </button>
        </p>

      </div>
    </div>
  );
}

export default AuthModal;
