import { useState } from 'react';
import { AudioLines, Menu, X, Music, ShieldCheck, LogOut, Lock, Crown, MessageCircle } from 'lucide-react';

export default function Header({ 
  currentTab, 
  onTabChange, 
  isAdminLoggedIn, 
  activeAdminUser,
  onOpenAdminModal, 
  onAdminLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSuperAdmin = activeAdminUser?.role === 'super_admin' || activeAdminUser?.email?.toLowerCase() === 'abhishekkunwer123123@gmail.com' || activeAdminUser?.email?.toLowerCase() === 'hacker@alaap.com' || activeAdminUser?.username?.toLowerCase() === 'hacker';

  const navItems = [
    { label: 'Home', tab: 'home' },
    { label: 'Events', tab: 'events' },
    { label: 'Members', tab: 'members' },
    { label: 'History', tab: 'history' },
    { label: 'Dates', tab: 'dates' },
    ...(isSuperAdmin ? [{ label: 'Admin', tab: 'admin' }] : []),
  ];

  const handleNavClick = (tab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 flex justify-between items-center px-6 md:px-16 h-16 shadow-sm select-none">
        {/* Brand Logo */}
        <div 
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2 active:scale-95 transition-transform cursor-pointer group"
        >
          <div className="relative flex items-center justify-center">
            <Music className="w-6 h-6 text-primary neon-glow-primary group-hover:scale-110 transition-all duration-300" />
            <AudioLines className="w-4 h-4 text-tertiary absolute -right-2 -bottom-1 opacity-70 group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="font-sans text-xl font-extrabold tracking-tighter text-primary neon-glow-primary">
            ALAAP
          </h1>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleNavClick(item.tab)}
              className={`font-mono text-sm tracking-wide transition-all duration-300 relative py-1.5 cursor-pointer ${currentTab === item.tab
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
                }`}
            >
              {item.label}
              {currentTab === item.tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right side Admin Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-sm ${
                isSuperAdmin 
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' 
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              }`}>
                {isSuperAdmin ? (
                  <>
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>SUPER ADMIN</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ADMIN ACTIVE</span>
                  </>
                )}
              </span>

              <button
                onClick={onAdminLogout}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-error/10 hover:bg-error/20 text-error border border-error/25 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                title="Logout from Admin Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Trigger & Status Indicator */}
        <div className="flex items-center gap-3 md:hidden">
          {isAdminLoggedIn && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
              {isSuperAdmin ? "SUPER ADMIN" : "ADMIN"}
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface active:scale-90"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] z-30 bg-surface-container/95 border-l border-outline-variant/10 shadow-2xl md:hidden transition-transform duration-300 ease-out transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col p-6 space-y-4">
          <span className="text-xs font-mono text-outline tracking-widest uppercase">Navigation</span>
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleNavClick(item.tab)}
              className={`flex items-center justify-between p-3 rounded-xl transition-all ${currentTab === item.tab
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
            >
              <span className="font-sans text-base">{item.label}</span>
              {currentTab === item.tab && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          ))}

          {/* Admin Button in Mobile Drawer */}
          <div className="pt-4 border-t border-outline-variant/15">
            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  onAdminLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-error/10 text-error font-mono text-xs font-bold border border-error/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Admin ({activeAdminUser?.email || activeAdminUser?.username || 'Admin'})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAdminModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
