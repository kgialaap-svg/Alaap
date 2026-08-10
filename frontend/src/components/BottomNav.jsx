import { Home, Calendar, Users, History, Clock } from 'lucide-react';

export default function BottomNav({ currentTab, onTabChange }) {
  const navItems = [
    { label: 'Home', tab: 'home', icon: Home },
    { label: 'Events', tab: 'events', icon: Calendar },
    { label: 'Members', tab: 'members', icon: Users },
    { label: 'History', tab: 'history', icon: History },
    { label: 'Dates', tab: 'dates', icon: Clock },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 md:hidden w-[90%] max-w-md">
      <nav className="glass-card rounded-2xl p-2 flex items-center justify-around shadow-2xl border border-outline-variant/20 bg-surface-container-low/90 backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-primary font-bold scale-105'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'neon-glow-primary' : ''}`} />
              <span className="font-sans text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
