// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("profile/")
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            border: "3px solid #e5e7eb", borderTopColor: "#111827",
            animation: "spin 0.8s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>

      {/* ── Top Nav Bar ── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: 0 }}>
            Welcome, {user.username}
          </p>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: "2px 0 0" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user.profile_photo ? (
            <img
              src={`http://127.0.0.1:8000${user.profile_photo}`}
              alt="profile"
              style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }}
            />
          ) : (
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "#111827", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", fontWeight: "700",
            }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
          )}
          <button
            onClick={logout}
            style={{
              padding: "7px 16px", background: "#111827", color: "#fff",
              border: "none", borderRadius: "8px", fontSize: "13px",
              fontWeight: "600", cursor: "pointer",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#000"}
            onMouseLeave={e => e.currentTarget.style.background = "#111827"}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Banner ── */}
      <div style={{
        margin: "20px 32px 0",
        borderRadius: "14px",
        height: "80px",
        background: "linear-gradient(135deg, #bfdbfe 0%, #e0f2fe 40%, #fef9c3 100%)",
      }} />

      {/* ── Profile Card ── */}
      <div style={{
        margin: "0 32px",
        background: "#fff",
        borderRadius: "14px",
        border: "1px solid #e5e7eb",
        padding: "0 28px 20px",
        marginTop: "-1px",
      }}>

        {/* Avatar row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingTop: "16px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {user.profile_photo ? (
              <img
                src={`http://127.0.0.1:8000${user.profile_photo}`}
                alt="profile"
                style={{
                  width: "80px", height: "80px", borderRadius: "50%",
                  objectFit: "cover", border: "3px solid #fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                  marginTop: "-40px",
                }}
              />
            ) : (
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: "#111827", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "28px", fontWeight: "700",
                border: "3px solid #fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                marginTop: "-40px",
                flexShrink: 0,
              }}>
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 2px" }}>
                {user.username}
              </p>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                {user.email}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* <span style={{
              padding: "4px 14px", borderRadius: "999px",
              fontSize: "11px", fontWeight: "700",
              background: "#111827", color: "#fff",
              textTransform: "capitalize",
            }}>
              {user.role}
            </span> */}
            <span style={{
              padding: "4px 14px", borderRadius: "999px",
              fontSize: "11px", fontWeight: "700",
              ...(user.status
                ? { background: "#dcfce7", color: "#15803d" }
                : { background: "#fee2e2", color: "#dc2626" }
              ),
            }}>
              {user.status ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #f3f4f6", marginBottom: "16px" }} />

        {/* Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 32px" }}>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
              Username
            </label>
            <div style={{
              padding: "10px 14px", background: "#f9fafb",
              border: "1px solid #e5e7eb", borderRadius: "8px",
              fontSize: "13px", color: "#111827", fontWeight: "500",
            }}>
              {user.username}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
              Email Address
            </label>
            <div style={{
              padding: "10px 14px", background: "#f9fafb",
              border: "1px solid #e5e7eb", borderRadius: "8px",
              fontSize: "13px", color: "#111827", fontWeight: "500",
            }}>
              {user.email}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
              Contact Number
            </label>
            <div style={{
              padding: "10px 14px", background: "#f9fafb",
              border: "1px solid #e5e7eb", borderRadius: "8px",
              fontSize: "13px", color: user.contact_number ? "#111827" : "#9ca3af", fontWeight: "500",
            }}>
              {user.contact_number || "N/A"}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
              Date of Birth
            </label>
            <div style={{
              padding: "10px 14px", background: "#f9fafb",
              border: "1px solid #e5e7eb", borderRadius: "8px",
              fontSize: "13px", color: user.dob ? "#111827" : "#9ca3af", fontWeight: "500",
            }}>
              {user.dob || "N/A"}
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
              Address
            </label>
            <div style={{
              padding: "10px 14px", background: "#f9fafb",
              border: "1px solid #e5e7eb", borderRadius: "8px",
              fontSize: "13px", color: user.address ? "#111827" : "#9ca3af", fontWeight: "500",
            }}>
              {user.address || "N/A"}
            </div>
          </div>

        </div>

        {/* ✅ Divider — reduced margin from 28px to 12px top & bottom */}
        <div style={{ borderTop: "1px solid #f3f4f6", margin: "12px 0 12px" }} />

        {/* ✅ Email section — pulled up */}
        <div>
          <p style={{ fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "10px" }}>
            My Email Address
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "8px",
              background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={2} style={{ width: "16px", height: "16px" }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#111827", margin: "0 0 1px" }}>
                {user.email}
              </p>
              <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>
                Primary email address
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}