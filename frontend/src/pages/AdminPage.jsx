import { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Shield, UserPlus, Trash2, Mail, Key, User, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, Lock } from 'lucide-react';

export default function AdminPage({
  activeAdminUser,
  isAdminLoggedIn,
  adminAccounts = [],
  onCreateAdminAccount,
  onRemoveAdminAccount,
  onOpenAdminModal
}) {
  // Check Super Admin privilege
  const activeEmail = (activeAdminUser?.email || activeAdminUser?.username || '').toLowerCase();
  const isSuperAdmin = isAdminLoggedIn && (
    activeAdminUser?.role === 'super_admin' || 
    activeEmail === 'abhishekkunwer123123@gmail.com' || 
    activeEmail === 'hacker@alaap.com' || 
    activeEmail === 'hacker'
  );

  // Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toast / Error Notifications
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Form Submit
  const handleAddAdmin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const emailClean = newEmail.trim().toLowerCase();
    const nameClean = newName.trim() || emailClean.split('@')[0];
    const pass = newPassword;
    const confirmPass = confirmPassword;

    if (!emailClean || !pass) {
      setErrorMsg('Admin Email and Password are required.');
      return;
    }

    if (pass !== confirmPass) {
      setErrorMsg('Passwords do not match. Please check and try again.');
      return;
    }

    if (emailClean === 'abhishekkunwer123123@gmail.com' || emailClean === 'hacker@alaap.com' || emailClean === 'hacker') {
      setErrorMsg('Email "abhishekkunwer123123@gmail.com" is reserved for the primary Super Admin.');
      return;
    }

    // Check duplicate
    const exists = adminAccounts.some(acc => (acc.email || acc.username || '').toLowerCase() === emailClean);
    if (exists) {
      setErrorMsg(`Admin email "${emailClean}" already exists in the system roster.`);
      return;
    }

    const newAdminObj = {
      email: emailClean,
      name: nameClean,
      role: 'admin',
      password: pass,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    if (onCreateAdminAccount) {
      onCreateAdminAccount(newAdminObj);
    }

    setSuccessMsg(`🎉 Regular Admin "${emailClean}" successfully registered! Password set.`);
    setNewEmail('');
    setNewName('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Handle Account Removal
  const handleRemoveAccount = (email) => {
    const target = (email || '').toLowerCase();
    if (target === 'abhishekkunwer123123@gmail.com' || target === 'hacker@alaap.com' || target === 'hacker') {
      setErrorMsg("⛔ Action Blocked: The Super Admin account is permanently IRREMOVEABLE and cannot be removed.");
      return;
    }
    if (onRemoveAdminAccount) {
      onRemoveAdminAccount(email);
      setSuccessMsg(`Admin account "${email}" has been removed.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Render Access Denied state if non-super-admin tries to view
  if (!isSuperAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card rounded-3xl p-10 border border-outline-variant/20 shadow-2xl space-y-6 max-w-lg mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-2">
            <h2 className="font-sans font-black text-2xl text-on-surface">
              Super Admin Access Only
            </h2>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              This page is strictly reserved for the Super Admin (<span className="font-mono text-amber-400 font-bold">abhishekkunwer123123@gmail.com</span>). Please log in with Super Admin credentials to manage regular administrators.
            </p>
          </div>

          <button
            onClick={onOpenAdminModal}
            className="px-6 py-3 bg-amber-500 text-black font-sans font-extrabold text-xs rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            <span>Login as Super Admin</span>
          </button>
        </motion.div>
      </div>
    );
  }

  const regularAdmins = adminAccounts.filter(acc => {
    const e = (acc.email || acc.username || '').toLowerCase();
    return acc.role !== 'super_admin' && e !== 'abhishekkunwer123123@gmail.com' && e !== 'hacker@alaap.com' && e !== 'hacker';
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-10 select-none">
      {/* 1. Page Header & Status Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-outline-variant/15">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Super Admin Control Center</span>
          </div>
          <h2 className="font-sans font-black text-3xl md:text-4xl text-on-surface tracking-tight">
            Admin Management
          </h2>
          <p className="font-body text-xs text-on-surface-variant">
            Create, assign, and manage regular administrator credentials for Alaap.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-surface-container-high border border-outline-variant/20 flex items-center gap-3 text-xs font-mono">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-on-surface font-bold">
            Logged in as: <span className="text-amber-400">{activeAdminUser?.email || activeAdminUser?.username}</span>
          </span>
        </div>
      </div>

      {/* Instant Notification Banners */}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="p-4 bg-error/10 border border-error/25 rounded-2xl flex items-center gap-3 text-xs font-mono text-error shadow-lg"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center gap-3 text-xs font-mono text-emerald-400 shadow-lg"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {/* Main Content Grid: Add Admin Form + Current Admins List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Add New Regular Admin Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/20 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-amber-500 to-tertiary rounded-b-full blur-xs" />
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-tertiary">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-on-surface">
                  Add Regular Admin
                </h3>
                <p className="font-body text-xs text-on-surface-variant">
                  Set email & password for new admin
                </p>
              </div>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              {/* Admin Email */}
              <div>
                <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase tracking-wider">
                  Admin Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@alaap.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-tertiary text-sm font-mono"
                  />
                </div>
              </div>

              {/* Admin Full Name */}
              <div>
                <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase tracking-wider">
                  Admin Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="text"
                    placeholder="e.g. Rohit Kumar (Club Admin)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-tertiary text-xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase tracking-wider">
                  Create Password *
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-tertiary text-sm font-mono"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase tracking-wider">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-tertiary text-sm font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-tertiary text-on-tertiary font-sans font-extrabold text-xs tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-tertiary/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save Regular Admin</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Existing Registered Admins List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/20 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-lg text-on-surface flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>Active Administrators Roster</span>
                </h3>
                <p className="font-body text-xs text-on-surface-variant">
                  Total Accounts: <span className="font-mono text-primary font-bold">{adminAccounts.length}</span>
                </p>
              </div>
            </div>

            {/* List of Admin Accounts */}
            <div className="space-y-3">
              {/* Primary Super Admin Card */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-on-surface">
                        abhishekkunwer123123@gmail.com
                      </span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        SUPER ADMIN
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      Super Admin (Primary Master Account)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg shadow-xs">🔒 Permanently Irremoveable</span>
              </div>

              {/* Regular Admins List */}
              {regularAdmins.length > 0 ? (
                regularAdmins.map((acc) => {
                  const accEmail = acc.email || acc.username;

                  return (
                    <div
                      key={accEmail}
                      className="p-4 bg-surface-container rounded-2xl border border-outline-variant/20 flex items-center justify-between gap-3 hover:border-outline-variant/40 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-sm text-on-surface">
                              {accEmail}
                            </span>
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                              REGULAR ADMIN
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant">
                            {acc.name || accEmail} {acc.createdAt ? `• Added ${acc.createdAt}` : ''}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveAccount(accEmail)}
                        className="px-3 py-1.5 rounded-xl bg-error/10 hover:bg-error text-error hover:text-white border border-error/25 transition-all text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        title="Remove Regular Admin Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center border border-dashed border-outline-variant/30 rounded-2xl text-xs font-mono text-outline">
                  No custom regular admin accounts registered yet. Use the form on the left to add one!
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
