import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Lock,
  Mail,
  Key,
  X,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Trash2,
  Crown,
  Shield,
  Users,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function AdminLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onAdminLogout,
  activeAdminUser,
  adminAccounts = [],
  onCreateAdminAccount,
  onRemoveAdminAccount,
}) {
  // If logged in, default view is manage/dashboard, else login
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'manage' | 'create'

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Create/Make Admin Form State
  const [regEmail, setRegEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Alerts
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const isLoggedIn = !!activeAdminUser;
  const activeUserIdentifier = (activeAdminUser?.email || activeAdminUser?.username || "").toLowerCase();
  const isSuperAdmin = activeAdminUser?.role === "super_admin" || activeUserIdentifier === "abhishekkunwer123123@gmail.com" || activeUserIdentifier === "hacker@alaap.com" || activeUserIdentifier === "hacker";

  // Handle Admin Login
  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const u = loginEmail.trim().toLowerCase();
    const p = loginPassword.trim();

    if (!u || !p) {
      setErrorMsg("Please enter both admin email and password.");
      return;
    }

    // Client-side Admin Accounts Verification
    const defaultAccounts = [
      { email: 'abhishekkunwer123123@gmail.com', password: 'Happiness@321', name: 'Super Admin', role: 'super_admin' },
      { email: 'ironayush01@gmail.com', password: 'sachive2233', name: 'Ayush (Club Admin)', role: 'admin' },
      { email: 'hacker@alaap.com', password: 'hacker2626', name: 'Super Admin', role: 'super_admin' },
      { email: 'admin@alaap.com', password: 'admin123', name: 'Club Admin', role: 'admin' },
      { email: 'ayush@alaap.com', password: 'sachive2233', name: 'Ayush (Club Admin)', role: 'admin' },
    ];

    const combinedAccounts = [...defaultAccounts, ...(adminAccounts || [])];

    const matchedAccount = combinedAccounts.find(a => {
      const accEmail = (a.email || a.username || '').toLowerCase().trim();
      const accName = (a.name || '').toLowerCase().trim();
      const isIdentifierMatch = accEmail === u || accEmail.split('@')[0] === u || (accName && accName.includes(u));
      return isIdentifierMatch && a.password === p;
    });

    if (matchedAccount) {
      const isSuper = matchedAccount.role === 'super_admin' || 
                      matchedAccount.email === 'abhishekkunwer123123@gmail.com' || 
                      u === 'abhishekkunwer123123@gmail.com' || 
                      u === 'hacker';

      const userObj = {
        email: matchedAccount.email || u,
        name: matchedAccount.name || (isSuper ? 'Super Admin' : 'Club Admin'),
        role: isSuper ? 'super_admin' : 'admin',
      };

      setSuccessMsg(
        isSuper
          ? "👑 Welcome Super Admin! Full Master privileges granted."
          : `Welcome back, ${userObj.name}! Access granted to Admin Portal.`
      );

      setTimeout(() => {
        onLoginSuccess(userObj, `jwt_session_${Date.now()}`);
        setLoginEmail("");
        setLoginPassword("");
        setSuccessMsg("");
        onClose();
      }, 700);
      return;
    }

    setErrorMsg("Invalid Admin Email or Password. Please check your credentials.");
  };

  // Handle Creating New Admin Email & Password (Super Admin & Admin feature)
  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const newEmail = regEmail.trim().toLowerCase();
    const name = regName.trim() || newEmail;
    const p = regPassword;
    const cp = regConfirmPassword;

    if (!newEmail || !p) {
      setErrorMsg("Admin Email and Password are required.");
      return;
    }

    if (p !== cp) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    if (newEmail === "abhishekkunwer123123@gmail.com" || newEmail === "hacker@alaap.com" || newEmail === "hacker") {
      setErrorMsg(
        'Email "abhishekkunwer123123@gmail.com" is reserved exclusively for the Super Admin.',
      );
      return;
    }

    // Check duplicate email
    const exists = adminAccounts.some(
      (acc) => (acc.email || acc.username || "").toLowerCase() === newEmail,
    );
    if (exists) {
      setErrorMsg(
        `Admin Email "${newEmail}" already exists. Please enter a different Email.`,
      );
      return;
    }

    const newAdminAcc = {
      email: newEmail,
      name,
      role: "admin",
      password: p,
      createdAt: new Date().toLocaleDateString(),
    };

    if (onCreateAdminAccount) {
      onCreateAdminAccount(newAdminAcc);
    }

    setSuccessMsg(
      `🎉 Admin account created! Email: "${newEmail}" | Password set successfully.`,
    );

    setTimeout(() => {
      setRegEmail("");
      setRegName("");
      setRegPassword("");
      setRegConfirmPassword("");
      setSuccessMsg("");
      setActiveTab("manage");
    }, 1200);
  };

  // Handle Removal of Admin Account (ONLY Super Admin can remove)
  const handleRemove = (emailToRemove) => {
    if (!isSuperAdmin) {
      alert(
        "Permission Denied: ONLY Super Admin (abhishekkunwer123123@gmail.com) can remove admin accounts.",
      );
      return;
    }
    const target = emailToRemove.toLowerCase();
    if (target === "abhishekkunwer123123@gmail.com" || target === "hacker@alaap.com" || target === "hacker") {
      alert("⛔ Action Blocked: The Super Admin account is permanently IRREMOVEABLE and cannot be deleted by anyone, including the Super Admin.");
      return;
    }

    if (
      window.confirm(
        `Super Admin confirmation: Revoke and remove admin account "${emailToRemove}"?`,
      )
    ) {
      if (onRemoveAdminAccount) {
        onRemoveAdminAccount(emailToRemove);
      }
      setSuccessMsg(
        `Admin account "${emailToRemove}" successfully removed.`,
      );
      setTimeout(() => setSuccessMsg(""), 1500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-2xl relative overflow-hidden"
        >
          {/* Top Ambient Glow Bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-amber-500 via-primary to-tertiary rounded-b-full blur-xs" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col items-center text-center space-y-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              {isSuperAdmin ? (
                <Crown className="w-6 h-6 neon-glow-tertiary text-amber-400" />
              ) : (
                <ShieldCheck className="w-6 h-6 neon-glow-primary text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-sans font-black text-2xl text-on-surface tracking-tight">
                {isLoggedIn ? "Admin Management Portal" : "Alaap Admin Portal"}
              </h3>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">
                {isLoggedIn
                  ? `Logged in as ${activeAdminUser.name || activeAdminUser.email || activeAdminUser.username} (${isSuperAdmin ? "Super Admin" : "Admin"})`
                  : "Enter administrator credentials to log in"}
              </p>
            </div>

            {/* If Logged in, display Admin Management Controls Tabs */}
            {isLoggedIn && (
              <div className="flex w-full bg-surface-container-low p-1 rounded-2xl border border-outline-variant/20 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("manage");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === "manage" || activeTab === "login"
                      ? "bg-primary text-on-primary shadow-md"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Admin Accounts ({adminAccounts.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("create");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === "create"
                      ? "bg-tertiary text-on-tertiary shadow-md"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Create New Admin</span>
                </button>
              </div>
            )}
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2 text-xs font-mono text-error">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SECTION 1: UNAUTHENTICATED ADMIN LOGIN FORM */}
          {!isLoggedIn && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase tracking-wider">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. hacker@alaap.com or admin@alaap.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase tracking-wider">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary text-sm font-mono"
                  />
                </div>
              </div>

              {/* Submit Login Button */}
              <button
                type="submit"
                className="w-full py-3 bg-primary text-on-primary font-sans font-extrabold text-sm rounded-xl hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Login to Admin Portal</span>
              </button>
            </form>
          )}

          {/* SECTION 2: LOGGED IN ADMIN DASHBOARD - ACCOUNTS LIST */}
          {isLoggedIn && (activeTab === "manage" || activeTab === "login") && (
            <div className="space-y-4">
              <div className="p-3 bg-surface-container-high/40 rounded-xl border border-outline-variant/15 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono text-on-surface">
                  <span className="font-bold flex items-center gap-1 text-amber-400">
                    <Shield className="w-3.5 h-3.5" /> Active Admin Accounts (
                    {adminAccounts.length})
                  </span>
                  <span className="text-[10px] text-outline font-bold">
                    {isSuperAdmin
                      ? "👑 Super Admin Permissions"
                      : "🛡️ Admin Permissions"}
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant font-body">
                  {isSuperAdmin
                    ? "As Super Admin (abhishekkunwer123123@gmail.com), you can create custom Admin Email & Passwords and remove admin accounts."
                    : "As Admin, you can create new Admin Email & Passwords for other members."}
                </p>
              </div>

              {/* Registered Admin Accounts List */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {adminAccounts.map((acc) => {
                  const accEmail = acc.email || acc.username;
                  const accIsSuper = accEmail.toLowerCase() === "abhishekkunwer123123@gmail.com" || accEmail.toLowerCase() === "hacker@alaap.com" || accEmail.toLowerCase() === "hacker";

                  return (
                    <div
                      key={accEmail}
                      className="p-3 bg-surface-container rounded-xl border border-outline-variant/20 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {accIsSuper ? (
                          <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <Shield className="w-4 h-4 text-primary shrink-0" />
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-on-surface">
                              {accEmail}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                accIsSuper
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : "bg-primary/20 text-primary border border-primary/30"
                              }`}
                            >
                              {accIsSuper ? "SUPER ADMIN" : "ADMIN"}
                            </span>
                          </div>
                          <p className="text-[10px] text-on-surface-variant">
                            {acc.name || accEmail}
                          </p>
                        </div>
                      </div>

                      {/* Remove Admin Action (ONLY EXECUTABLE BY Super Admin) */}
                      {!accIsSuper && (
                        <div>
                          {isSuperAdmin ? (
                            <button
                              onClick={() => handleRemove(accEmail)}
                              className="p-1.5 rounded-lg bg-error/10 hover:bg-error text-error hover:text-white transition-colors text-xs font-mono flex items-center gap-1 cursor-pointer"
                              title="Remove Admin Account (Super Admin feature)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-[10px]">Remove</span>
                            </button>
                          ) : (
                            <span className="text-[9px] font-mono text-outline italic">
                              Protected
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Action Button: Create New Admin Email & Password */}
              <button
                type="button"
                onClick={() => setActiveTab("create")}
                className="w-full py-2.5 rounded-xl bg-tertiary/20 text-tertiary border border-tertiary/30 font-mono text-xs font-bold hover:bg-tertiary/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Create New Admin Email & Password</span>
              </button>

              {/* Logout Button */}
              {onAdminLogout && (
                <button
                  type="button"
                  onClick={() => {
                    onAdminLogout();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-error/15 text-error border border-error/30 font-mono text-xs font-bold hover:bg-error hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Admin Session</span>
                </button>
              )}
            </div>
          )}

          {/* SECTION 3: CREATE NEW ADMIN EMAIL & PASSWORD FORM */}
          {isLoggedIn && activeTab === "create" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-[11px] font-mono text-amber-400 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Create Admin Email & Password:</span>
                </div>
                <p className="text-[10px] text-amber-300/80 font-body">
                  Set a custom Admin Email and Password. The new admin can
                  immediately log in using these credentials.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                  New Admin Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. ayush@alaap.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                     className="w-full pl-9 pr-3.5 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                  Member / Admin Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ayush (Club Admin)"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                    New Password *
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("manage")}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant/20 text-on-surface-variant font-mono text-xs font-bold hover:bg-surface-container-high"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 text-black font-sans font-extrabold text-xs rounded-xl hover:opacity-95 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Admin User & Save</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
