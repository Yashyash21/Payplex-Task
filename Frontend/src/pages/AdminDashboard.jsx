// src/pages/AdminDashboard.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ── Sidebar Nav Item ──────────────────────────────────────────────────────────
function NavItem({ icon, label, active = false }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 ${
        active
          ? "bg-white text-gray-900 font-semibold"
          : "text-gray-400 hover:text-white hover:bg-white/10"
      }`}
    >
      <span>{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-black font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white">
        {icon}
      </div>
    </div>
  );
}

// ── Action Dropdown ───────────────────────────────────────────────────────────
function ActionDropdown({ user, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-gray-500"
        >
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-30 overflow-hidden">
          <button
            onClick={() => {
              onToggle(user.id);
              setOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2 transition-colors ${
              user.is_active
                ? "text-red-600 hover:bg-red-50"
                : "text-green-700 hover:bg-green-50"
            }`}
          >
            {user.is_active ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3.5 h-3.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Deactivate
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3.5 h-3.5"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Activate
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await API.get("users/");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      navigate("/");
      return;
    }
    if (role !== "admin") {
      navigate("/profile");
      return;
    }
    fetchUsers();
  }, []);

  const toggle = async (id) => {
    try {
      await API.patch(`toggle/${id}/`);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const activeCount = users.filter((u) => u.is_active).length;
  const inactiveCount = users.length - activeCount;

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.is_active) ||
      (statusFilter === "inactive" && !u.is_active);
    return matchSearch && matchStatus;
  });

  const statusLabel =
    statusFilter === "all"
      ? "All Status"
      : statusFilter === "active"
        ? "Active"
        : "Inactive";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="w-56 bg-gray-900 flex flex-col shrink-0 fixed top-0 left-0 h-full z-20">
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-900">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C17.5 22.15 21 17.25 21 12V6l-8-4z" />
            </svg>
          </div>
          <span className="text-white font-bold text-base tracking-tight">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <NavItem
            label="Users"
            active
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-[18px] h-[18px]"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            }
          />
        </nav>

        <div className="mx-3 mb-3 bg-white rounded-lg px-3 py-2 inline-block">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-4 h-4"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className="flex-1 ml-56 flex flex-col">
        <div className="px-8 pt-7 pb-0">
          <h1 className="text-3xl font-bold text-black">Users</h1>
        </div>

        <main className="px-8 py-5 flex flex-col gap-5">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value={users.length}
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-5 h-5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="1" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              }
            />
            <StatCard
              label="Active"
              value={activeCount}
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-5 h-5"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
            />
            <StatCard
              label="Inactive"
              value={inactiveCount}
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-5 h-5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              }
            />
            <StatCard
              label="Admins"
              value={users.filter((u) => u.role === "admin").length}
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-5 h-5"
                >
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              }
            />
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 text-sm px-3 py-2 rounded-lg hover:border-gray-400 transition-colors min-w-[130px] justify-between"
              >
                {statusLabel}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4 text-gray-400"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  {[
                    ["all", "All Status"],
                    ["active", "Active"],
                    ["inactive", "Inactive"],
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      onClick={() => {
                        setStatusFilter(val);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        statusFilter === val
                          ? "bg-gray-50 font-semibold text-gray-900"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 flex-1 max-w-xs transition-all duration-150"
              style={{
                border: searchFocused
                  ? "1.5px solid #000"
                  : "1px solid #d1d5db",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-4 h-4 text-gray-400 shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search users..."
                className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent w-full"
              />
            </div>

            {(search || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="text-sm text-gray-500 hover:text-gray-800 bg-white border border-gray-300 px-3 py-2 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* ── Table ── */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                {/* Header — light gray bg, uppercase, spaced */}
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderBottom: "2px solid #e5e7eb",
                    }}
                  >
                    {[
                      "User",
                      "Email",
                      "Contact",
                      "Address",
                      "DOB",
                      "Role",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3"
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#111",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-14 text-center text-gray-400 text-sm"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}

                  {filteredUsers.map((u, idx) => (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa",
                      }}
                      className="hover:bg-blue-50 transition-colors duration-100"
                    >
                      {/* User — avatar + bold name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {u.profile_photo ? (
                            <img
                              src={`http://127.0.0.1:8000${u.profile_photo}`}
                              alt="profile"
                              className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: "#111827" }}
                            >
                              {u.username?.[0]?.toUpperCase() ?? "?"}
                            </div>
                          )}
                          <span
                            style={{
                              fontWeight: "700",
                              color: "#111",
                              fontSize: "13px",
                            }}
                          >
                            {u.username}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td
                        className="px-5 py-3.5"
                        style={{ fontSize: "13px", color: "#374151" }}
                      >
                        {u.email}
                      </td>

                      {/* Contact */}
                      <td
                        className="px-5 py-3.5"
                        style={{ fontSize: "13px", color: "#6b7280" }}
                      >
                        {u.contact_number || (
                          <span style={{ color: "#d1d5db" }}>—</span>
                        )}
                      </td>

                      {/* Address */}
                      <td
                        className="px-5 py-3.5 max-w-[140px] truncate"
                        style={{ fontSize: "13px", color: "#6b7280" }}
                      >
                        {u.address || (
                          <span style={{ color: "#d1d5db" }}>—</span>
                        )}
                      </td>

                      {/* DOB */}
                      <td
                        className="px-5 py-3.5"
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {u.dob || <span style={{ color: "#d1d5db" }}>—</span>}
                      </td>

                      {/* Role — pill badge */}
                      <td className="px-5 py-3.5">
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: "700",
                            textTransform: "capitalize",
                            letterSpacing: "0.03em",
                            ...(u.role === "admin"
                              ? { backgroundColor: "#111827", color: "#fff" }
                              : {
                                  backgroundColor: "#e5e7eb",
                                  color: "#374151",
                                }),
                          }}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        {u.is_active ? (
                          <span
                            className="inline-flex items-center gap-1.5"
                            style={{
                              color: "#16a34a",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              className="w-3.5 h-3.5"
                            >
                              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Active
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5"
                            style={{
                              color: "#dc2626",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              className="w-3.5 h-3.5"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="15" y1="9" x2="9" y2="15" />
                              <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <ActionDropdown user={u} onToggle={toggle} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {filteredUsers.length > 0 && (
              <div
                className="px-5 py-3 text-xs"
                style={{
                  borderTop: "1px solid #e5e7eb",
                  backgroundColor: "#f8f9fa",
                  color: "#6b7280",
                }}
              >
                Showing{" "}
                <span style={{ fontWeight: "600", color: "#111" }}>
                  {filteredUsers.length}
                </span>{" "}
                of{" "}
                <span style={{ fontWeight: "600", color: "#111" }}>
                  {users.length}
                </span>{" "}
                user{users.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
