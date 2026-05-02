// src/pages/Login.jsx
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [keepSigned, setKeepSigned] = useState(false);

  const login = async () => {
    try {
      setError("");

      const res = await API.post("login/", data);

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div
      style={{  minHeight: "100vh" }}
      className="flex justify-center items-center px-4 "
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          padding: "48px 40px 40px",
          width: "100%",
          maxWidth: "460px",
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#0d1b2a",
            textAlign: "center",
            marginBottom: "32px",
            letterSpacing: "-0.5px",
          }}
        >
          Sign In
        </h2>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "16px",
              color: "#dc2626",
              fontSize: "13px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#1a1a2e",
              marginBottom: "6px",
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Email Address"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            style={{
              width: "100%",
              padding: "13px 16px",
              border: "1.5px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#111",
              outline: "none",
              boxSizing: "border-box",
              background: "#fafafa",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#9ca3af")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#1a1a2e",
              marginBottom: "6px",
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
            style={{
              width: "100%",
              padding: "13px 16px",
              border: "1.5px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#111",
              outline: "none",
              boxSizing: "border-box",
              background: "#fafafa",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#9ca3af")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>

        {/* Keep me signed in */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <input
            type="checkbox"
            id="keepSigned"
            checked={keepSigned}
            onChange={(e) => setKeepSigned(e.target.checked)}
            style={{ width: "15px", height: "15px", cursor: "pointer" }}
          />
          <label
            htmlFor="keepSigned"
            style={{ fontSize: "13px", color: "#374151", cursor: "pointer" }}
          >
            Keep me signed in
          </label>
        </div>

        {/* Sign In Button */}
        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "14px",
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            letterSpacing: "0.3px",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#000")}
          onMouseLeave={(e) => (e.target.style.background = "#111827")}
        >
          Sign In
        </button>

        {/* Register link */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", marginTop: "20px" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#111827", fontWeight: "600", cursor: "pointer" }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}