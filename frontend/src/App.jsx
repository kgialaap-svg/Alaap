import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, ExternalLink, MessageCircle } from 'lucide-react';
// Components
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DynamicMusicBg from './components/DynamicMusicBg';
import CustomCursor from './components/CustomCursor';
import MusicPreloader from './components/MusicPreloader';
import ScrollProgressBar from './components/ScrollProgressBar';
import AdminLoginModal from './components/AdminLoginModal';

// Pages & Data
import HomeTab from './pages/HomeTab';
import EventsTab from './pages/EventsTab';
import MembersTab, { INITIAL_MEMBERS } from './pages/MembersTab';
import HistoryTab, { CLUB_MILESTONES } from './pages/HistoryTab';
import DatesTab from './pages/DatesTab';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');

  // Single Unified State Slot for all Registered Events
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [milestones, setMilestones] = useState([]);

  // Admin Auth State & Accounts Persistence
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeAdminUser, setActiveAdminUser] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const DEFAULT_ADMIN_ACCOUNTS = [
    { email: 'abhishekkunwer123123@gmail.com', password: 'Happiness@321', name: 'Super Admin', role: 'super_admin' },
    { email: 'ironayush01@gmail.com', password: 'sachive2233', name: 'Ayush (Club Admin)', role: 'admin' },
    { email: 'admin@alaap.com', password: 'admin123', name: 'Club Admin', role: 'admin' },
  ];

  const [adminAccounts, setAdminAccounts] = useState(DEFAULT_ADMIN_ACCOUNTS);

  // Load initial states from LocalStorage cache or fallback default data
  useEffect(() => {
    const savedMembers = localStorage.getItem('allap_members_v6');
    const savedMilestones = localStorage.getItem('allap_milestones_v2');
    const savedAdminSession = localStorage.getItem('allap_admin_session_v3') || sessionStorage.getItem('allap_admin_logged_in');
    const savedActiveUser = localStorage.getItem('allap_active_admin_user_v3') || sessionStorage.getItem('allap_active_admin_user');
    const savedAdminAccounts = localStorage.getItem('allap_admin_accounts_v2');

    // Clean up obsolete localStorage event cache
    localStorage.removeItem('allap_events_v8');

    // Fetch live hosted events directly from MongoDB API server
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          setEvents([]);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch live events from MongoDB API server:', err.message);
        setEvents([]);
      });

    if (savedMembers) {
      const parsedM = JSON.parse(savedMembers).map(m => {
        const found = INITIAL_MEMBERS.find(initM => initM.id === m.id || initM.name === m.name);
        if (found && found.avatar) return { ...m, avatar: found.avatar };
        return m;
      });
      setMembers(parsedM);
    } else {
      setMembers(INITIAL_MEMBERS);
    }

    if (savedMilestones) {
      try {
        const parsedMilestones = JSON.parse(savedMilestones);
        setMilestones(Array.isArray(parsedMilestones) ? parsedMilestones : []);
      } catch (e) {
        setMilestones([]);
      }
    } else {
      setMilestones([]);
    }
    localStorage.setItem('allap_milestones_v2', JSON.stringify([]));

    if (savedAdminAccounts) setAdminAccounts(JSON.parse(savedAdminAccounts));

    if (savedAdminSession === 'true') {
      setIsAdminLoggedIn(true);
      if (savedActiveUser) {
        setActiveAdminUser(JSON.parse(savedActiveUser));
      }
    }
  }, []);

  const saveEvents = (updated) => {
    setEvents(updated);
    localStorage.setItem('allap_events_v8', JSON.stringify(updated));
  };

  const saveMembers = (updated) => {
    setMembers(updated);
    localStorage.setItem('allap_members_v6', JSON.stringify(updated));
  };

  const saveMilestones = (updated) => {
    setMilestones(updated);
    localStorage.setItem('allap_milestones_v2', JSON.stringify(updated));
  };

  // Admin Auth Handlers - Persistent Login Session
  const handleAdminLoginSuccess = (adminUserObj, token = null) => {
    setIsAdminLoggedIn(true);
    setActiveAdminUser(adminUserObj);
    
    if (token) {
      localStorage.setItem('allap_jwt_token', token);
    }
    // Store in both localStorage and sessionStorage for reliable persistence
    localStorage.setItem('allap_admin_session_v3', 'true');
    localStorage.setItem('allap_active_admin_user_v3', JSON.stringify(adminUserObj));
    sessionStorage.setItem('allap_admin_logged_in', 'true');
    sessionStorage.setItem('allap_active_admin_user', JSON.stringify(adminUserObj));
  };

  // Explicit Admin Logout Handler
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setActiveAdminUser(null);
    
    // Clear all admin login session keys from storage
    localStorage.removeItem('allap_admin_session_v3');
    localStorage.removeItem('allap_active_admin_user_v3');
    sessionStorage.removeItem('allap_admin_logged_in');
    sessionStorage.removeItem('allap_active_admin_user');
  };

  // Handle registering a new admin account (Allowed for Super Admin hacker & Admin)
  const handleCreateAdminAccount = (newAccount) => {
    const updated = [...adminAccounts, newAccount];
    setAdminAccounts(updated);
    localStorage.setItem('allap_admin_accounts_v2', JSON.stringify(updated));
  };

  // Handle removing an admin account (ONLY Super Admin can execute)
  const handleRemoveAdminAccount = (emailToRemove) => {
    const activeEmail = (activeAdminUser?.email || activeAdminUser?.username || '').toLowerCase();
    if (activeEmail !== 'abhishekkunwer123123@gmail.com' && activeEmail !== 'hacker@alaap.com' && activeEmail !== 'hacker') {
      alert("Permission Denied: ONLY Super Admin (abhishekkunwer123123@gmail.com) can remove admin accounts.");
      return;
    }
    const target = (emailToRemove || '').toLowerCase();
    if (target === 'abhishekkunwer123123@gmail.com' || target === 'hacker@alaap.com' || target === 'hacker') {
      alert("⛔ Action Blocked: The Super Admin account is permanently IRREMOVEABLE and cannot be removed by anyone, including the Super Admin.");
      return;
    }
    const updated = adminAccounts.filter(a => (a.email || a.username || '').toLowerCase() !== target);
    setAdminAccounts(updated);
    localStorage.setItem('allap_admin_accounts_v2', JSON.stringify(updated));
  };

  // Handler to add a new photo to a specific milestone event
  const handleAddPhotoToMilestone = (milestoneId, newPhoto) => {
    const updated = milestones.map((m) => {
      if (m.id === milestoneId) {
        return {
          ...m,
          photos: [newPhoto, ...(m.photos || [])]
        };
      }
      return m;
    });
    saveMilestones(updated);
  };

  // Handler to add a new history event (Admin & Super Admin Only)
  const handleAddMilestoneEvent = (newEventData) => {
    const defaultCover = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800';
    const newMilestone = {
      id: `h_${Date.now()}`,
      year: newEventData.year || '2026',
      title: newEventData.title,
      subtitle: newEventData.subtitle || 'Alaap History Milestone Event',
      description: newEventData.description || 'Special performance and community gathering captured in the Alaap archives.',
      tag: (newEventData.tag || 'EVENT').toUpperCase(),
      image: newEventData.image || defaultCover,
      photos: newEventData.photos && newEventData.photos.length > 0
        ? newEventData.photos
        : [
            {
              id: `p_${Date.now()}`,
              url: newEventData.image || defaultCover,
              caption: newEventData.subtitle || newEventData.title
            }
          ]
    };
    saveMilestones([newMilestone, ...milestones]);
  };

  // Handler to delete a history event (Admin & Super Admin Only)
  const handleDeleteMilestoneEvent = (milestoneId) => {
    const updated = milestones.filter((m) => m.id !== milestoneId);
    saveMilestones(updated);
  };

  // Handler to clear all history events, photos, and timeline data (Admin & Super Admin Only)
  const handleClearAllHistory = () => {
    saveMilestones([]);
  };


  // 1. RSVP Interaction Handler
  const handleRSVP = (id) => {
    let targetUpdates = null;
    const updated = events.map((evt) => {
      if (evt.id === id) {
        const isRSVPed = !evt.isRSVPed;
        const attendeesCount = isRSVPed ? evt.attendeesCount + 1 : Math.max(0, evt.attendeesCount - 1);
        targetUpdates = { isRSVPed, attendeesCount };
        return {
          ...evt,
          ...targetUpdates
        };
      }
      return evt;
    });

    saveEvents(updated);
  };

  // 2. Connect / Like Member Handler
  const handleConnect = (id) => {
    const updated = members.map((mem) => {
      if (mem.id === id) {
        return {
          ...mem,
          isLiked: !mem.isLiked,
        };
      }
      return mem;
    });
    saveMembers(updated);
  };

  // 3. Add Custom Member Profile Handler
  const handleAddMember = (newMemberData) => {
    const newMember = {
      ...newMemberData,
      id: `m_${Date.now()}`,
      joinedDate: 'Jul 2026',
      isLiked: false,
      avatar: newMemberData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
    };
    saveMembers([newMember, ...members]);
  };

  // Helper to parse date strings to ISO format (YYYY-MM-DD) without timezone shift
  const parseDateToISO = (dateStr, fullDateStr) => {
    if (dateStr) {
      const parts = dateStr.trim().split(/\s+/);
      if (parts.length >= 2) {
        const monthMap = {
          jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
          jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
        };
        const m = monthMap[parts[0].toLowerCase().slice(0, 3)];
        const d = parts[1].padStart(2, '0');
        const year = 2026;
        if (m && !isNaN(parseInt(d, 10))) {
          return `${year}-${m}-${d}`;
        }
      }
    }

    if (fullDateStr) {
      const parsed = new Date(fullDateStr);
      if (!isNaN(parsed.getTime())) {
        const y = parsed.getFullYear();
        const m = String(parsed.getMonth() + 1).padStart(2, '0');
        const d = String(parsed.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    }

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 4. Create Campus Event Handler (Admin Only) - Connects to MongoDB Atlas API
  const handleAddEvent = async (newEventData) => {
    const timestamp = Date.now();
    const eventId = newEventData.id || `e_${timestamp}`;

    const formattedDate = newEventData.date || 'UPCOMING';
    const formattedFullDate = newEventData.fullDate || `${formattedDate}, 2026`;
    const isoDateStr = parseDateToISO(formattedDate, formattedFullDate);

    const newEvent = {
      ...newEventData,
      id: eventId,
      date: formattedDate,
      fullDate: formattedFullDate,
      isoDate: isoDateStr,
      time: newEventData.time || '7:00 PM - 9:00 PM',
      location: newEventData.location || 'Central Auditorium',
      category: newEventData.category || 'Concert',
      attendeesCount: newEventData.attendeesCount || 1,
      isRSVPed: true,
      accentColor: newEventData.accentColor || (newEventData.category === 'Concert' ? 'tertiary' : 'primary')
    };

    // Save directly to MongoDB Atlas API server
    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      const resData = await res.json();
      if (resData.success && resData.data) {
        setEvents((prev) => [resData.data, ...prev.filter(e => e.id !== resData.data.id && e._id !== resData.data._id)]);
      } else {
        setEvents((prev) => [newEvent, ...prev]);
      }
    } catch (err) {
      console.warn('MongoDB Atlas API server offline:', err.message);
      setEvents((prev) => [newEvent, ...prev]);
    }
  };

  // Delete Campus Event (Admin Only) - Connects to MongoDB Atlas API
  const handleDeleteEvent = async (eventId) => {
    try {
      await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Error deleting event from MongoDB:', err.message);
    }
    setEvents((prev) => prev.filter((e) => e.id !== eventId && e._id !== eventId));
  };

  // 5. Reserve Studio Calendar Booking Handler (Admin Only)
  const handleAddBooking = (newBookingData) => {
    const timestamp = Date.now();
    const eventId = `e_${timestamp}`;

    const formattedDisplayDate = newBookingData.displayDate || 'UPCOMING';
    const isoDate = newBookingData.date || new Date().toISOString().split('T')[0];
    const fullDateStr = newBookingData.fullDate || new Date(isoDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    const newEvent = {
      id: eventId,
      title: newBookingData.title,
      description: newBookingData.description || 'Scheduled studio session & musical event.',
      date: formattedDisplayDate,
      fullDate: fullDateStr,
      isoDate: isoDate,
      time: newBookingData.time || '4:00 PM - 6:00 PM',
      location: newBookingData.location || 'Alaap Studio Room 304B',
      category: newBookingData.type === 'performance' ? 'Concert' : 'Showcase',
      attendeesCount: 1,
      isRSVPed: true,
      accentColor: newBookingData.type === 'performance' ? 'tertiary' : 'primary'
    };

    saveEvents([newEvent, ...events]);
  };

  // Delete Studio Calendar Booking (Admin Only)
  const handleDeleteBooking = (bookingId) => {
    const updatedEvents = events.filter((e) => e.id !== bookingId && e.bookingId !== bookingId);
    saveEvents(updatedEvents);
  };

  // Update Campus Event (Admin Only)
  const handleUpdateEvent = (eventId, updatedFields) => {
    const updatedEvents = events.map((e) => {
      if (e.id === eventId || e.bookingId === eventId) {
        return { ...e, ...updatedFields };
      }
      return e;
    });
    saveEvents(updatedEvents);
  };

  // Delete Photo from Milestone (Admin Only)
  const handleDeletePhotoFromMilestone = (milestoneId, photoId) => {
    const updated = milestones.map((m) => {
      if (m.id === milestoneId) {
        return {
          ...m,
          photos: (m.photos || []).filter(p => p.id !== photoId)
        };
      }
      return m;
    });
    saveMilestones(updated);
  };

  // Member Admin Grant/Revoke Handler with Manual Credentials Support (Super Admin Only)
  const handleToggleMemberAdmin = (member, makeAdmin, customEmail, customPassword) => {
    const firstName = member.name.split(' ')[0].toLowerCase();
    const defaultEmail = `${firstName}@alaap.com`;
    const finalEmail = (customEmail || defaultEmail).trim().toLowerCase();
    const finalPassword = customPassword || 'admin123';

    if (makeAdmin) {
      const exists = adminAccounts.some(a => (a.email || a.username || '').toLowerCase() === finalEmail);
      if (!exists) {
        const newAdmin = {
          email: finalEmail,
          name: member.name,
          role: 'admin',
          password: finalPassword,
          createdAt: new Date().toLocaleDateString()
        };
        const updated = [...adminAccounts, newAdmin];
        setAdminAccounts(updated);
        localStorage.setItem('allap_admin_accounts_v2', JSON.stringify(updated));
      }
    } else {
      const updated = adminAccounts.filter(a => {
        const accE = (a.email || a.username || '').toLowerCase();
        const accName = (a.name || '').toLowerCase();
        return accE !== firstName && accE !== defaultEmail && accE !== finalEmail && !accName.includes(member.name.toLowerCase());
      });
      setAdminAccounts(updated);
      localStorage.setItem('allap_admin_accounts_v2', JSON.stringify(updated));
    }
  };

  // Handler to update a history milestone event (e.g. change cover photo)
  const handleUpdateMilestone = (milestoneId, updates) => {
    const updated = milestones.map((m) => {
      if (m.id === milestoneId) {
        let updatedPhotos = m.photos ? [...m.photos] : [];
        if (updates.image) {
          if (updatedPhotos.length > 0) {
            updatedPhotos[0] = { ...updatedPhotos[0], url: updates.image };
          } else {
            updatedPhotos = [{ id: `p_${Date.now()}`, url: updates.image, caption: m.subtitle || m.title }];
          }
        }
        return {
          ...m,
          ...updates,
          photos: updatedPhotos
        };
      }
      return m;
    });
    saveMilestones(updated);
  };

  // Member Roster Delete Handler (Admin & Super Admin Protected)
  const handleDeleteMember = (memberId) => {
    const updated = members.filter((m) => m.id !== memberId);
    saveMembers(updated);
  };

  // Restore/Recover All Removed Default Members
  const handleRestoreMembers = () => {
    const existingIds = new Set(members.map(m => m.id));
    const existingNames = new Set(members.map(m => m.name?.toLowerCase()));
    
    const missingDefaults = INITIAL_MEMBERS.filter(m => !existingIds.has(m.id) && !existingNames.has(m.name?.toLowerCase()));
    
    let restoredList = [...members, ...missingDefaults];
    if (missingDefaults.length === 0) {
      restoredList = INITIAL_MEMBERS;
    }

    saveMembers(restoredList);
  };

  // Dynamic tab routing
  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeTab
            events={events}
            onTabChange={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
      case 'events':
        return (
          <EventsTab
            events={events}
            onRSVP={handleRSVP}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
          />
        );
      case 'members':
        return (
          <MembersTab
            members={members}
            onConnect={handleConnect}
            isAdminLoggedIn={isAdminLoggedIn}
            activeAdminUser={activeAdminUser}
            adminAccounts={adminAccounts}
            onToggleMemberAdmin={handleToggleMemberAdmin}
            onDeleteMember={handleDeleteMember}
            onAddMember={handleAddMember}
            onRestoreMembers={handleRestoreMembers}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
          />
        );
      case 'history':
        return (
          <HistoryTab
            milestones={milestones}
            onAddEvent={handleAddMilestoneEvent}
            onUpdateMilestone={handleUpdateMilestone}
            onDeleteEvent={handleDeleteMilestoneEvent}
            onClearAllHistory={handleClearAllHistory}
            onRestoreMilestones={() => saveMilestones(CLUB_MILESTONES)}
            onAddPhoto={handleAddPhotoToMilestone}
            onDeletePhoto={handleDeletePhotoFromMilestone}
            isAdminLoggedIn={isAdminLoggedIn}
            activeAdminUser={activeAdminUser}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
          />
        );
      case 'dates':
        return (
          <DatesTab
            events={events}
            onAddBooking={handleAddBooking}
            onDeleteBooking={handleDeleteBooking}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
          />
        );
      case 'admin':
        return (
          <AdminPage
            activeAdminUser={activeAdminUser}
            isAdminLoggedIn={isAdminLoggedIn}
            adminAccounts={adminAccounts}
            onCreateAdminAccount={handleCreateAdminAccount}
            onRemoveAdminAccount={handleRemoveAdminAccount}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface select-none relative overflow-x-hidden">
      {/* 1. Website Opening Loading Animation */}
      <MusicPreloader />

      {/* 2. Interactive Custom Music Cursor */}
      <CustomCursor />

      {/* 3. Top Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* 4. Rhythmic 3D Background Layer */}
      <DynamicMusicBg />

      {/* Upper Navigation Bar */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        activeAdminUser={activeAdminUser}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Tab Screen Component with Animated Tab Transition */}
      <main className="flex-grow pt-20 pb-28 md:pb-16 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            {renderActiveScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern Dual Community QR Codes & Footer Section */}
      <footer className="w-full mt-auto bg-gradient-to-t from-surface-container-lowest via-background to-transparent flex flex-col items-center pt-12 pb-28 md:pb-16 px-6 border-t border-outline-variant/15 text-center relative z-10 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-emerald-500/10 via-tertiary/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Dual Community Cards: WhatsApp Group & Instagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">

          {/* 1. WhatsApp Official Group QR Card */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full glass-card rounded-3xl p-6 md:p-8 border border-emerald-500/25 shadow-2xl relative group overflow-hidden flex flex-col items-center justify-between"
          >
            {/* Subtle WhatsApp Green Gradient Glow on Hover */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500 via-teal-500 to-green-400 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none -z-10 blur-md" />

            <div className="flex flex-col items-center space-y-4 w-full">
              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Official WhatsApp Group</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-sans text-lg font-black text-on-surface tracking-tight group-hover:text-emerald-400 transition-all duration-300">
                  "Aalaap" The Music Club
                </h3>
                <p className="text-xs text-on-surface-variant font-body">
                  Kashi Group of Institution
                </p>
              </div>

              {/* QR Code Frame with Glass Container */}
              <a
                href="https://chat.whatsapp.com/L5pSM2KjhvlH3PKE24vstp?s=qt&p=a&ilr=4&amv=1"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block rounded-2xl p-3.5 bg-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group/qr"
                title="Scan or click to join 'Aalaap' WhatsApp Group"
              >
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fchat.whatsapp.com%2FL5pSM2KjhvlH3PKE24vstp%3Fs%3Dqt%26p%3Da%26ilr%3D4%26amv%3D1"
                  alt="WhatsApp Group QR Code - Alaap Music Club"
                  className="w-44 h-44 md:w-48 md:h-48 object-contain rounded-xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5 text-white backdrop-blur-[2px]">
                  <MessageCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
                  <span className="text-xs font-mono font-bold bg-emerald-500 text-slate-950 px-3 py-1 rounded-full">Join WhatsApp</span>
                </div>
              </a>

              <p className="text-xs font-body text-on-surface-variant max-w-xs">
                Scan this QR code using WhatsApp camera to join this group
              </p>

              {/* Join WhatsApp Group Button */}
              <a
                href="https://chat.whatsapp.com/L5pSM2KjhvlH3PKE24vstp?s=qt&p=a&ilr=4&amv=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-mono text-xs font-black tracking-wider uppercase transition-all shadow-md group/btn w-full justify-center"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Join WhatsApp Group</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* 2. Instagram QR Code Card */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full glass-card rounded-3xl p-6 md:p-8 border border-pink-500/20 shadow-2xl relative group overflow-hidden flex flex-col items-center justify-between"
          >
            {/* Subtle Instagram Gradient Glow on Hover */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none -z-10 blur-md" />

            <div className="flex flex-col items-center space-y-4 w-full">
              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-500/25 text-pink-400 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Connect On Instagram</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-sans text-lg font-black text-on-surface tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-amber-400 transition-all duration-300">
                  @kashimusic23
                </h3>
                <p className="text-xs text-on-surface-variant font-body">
                  Scan QR code to visit official Instagram page
                </p>
              </div>

              {/* QR Code Frame with Glass Container */}
              <a
                href="https://www.instagram.com/kashimusic23/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block rounded-2xl p-3.5 bg-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group/qr"
                title="Click to visit @kashimusic23 on Instagram"
              >
                <img
                  src="/instagram_qr.png"
                  alt="Instagram QR Code - @kashimusic23"
                  className="w-44 h-44 md:w-48 md:h-48 object-contain rounded-xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5 text-white backdrop-blur-[2px]">
                  <ExternalLink className="w-6 h-6 animate-bounce" />
                  <span className="text-xs font-mono font-bold bg-black/70 px-3 py-1 rounded-full border border-white/20">Open Instagram</span>
                </div>
              </a>

              <p className="text-xs font-body text-on-surface-variant max-w-xs">
                Scan QR code or click below to follow us on Instagram
              </p>

              {/* Follow Button */}
              <a
                href="https://www.instagram.com/kashimusic23/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface font-mono text-xs font-bold tracking-wider hover:border-pink-500/40 transition-all shadow-md group/btn w-full justify-center"
              >
                <span>Follow @kashimusic23</span>
                <ExternalLink className="w-3.5 h-3.5 text-tertiary group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>

        </div>

        {/* Footer Brand & Copyright */}
        <h2 className="font-sans text-2xl font-black text-primary tracking-widest neon-glow-primary">
          ALAAP
        </h2>
        <p className="font-sans text-xs text-secondary opacity-60 mt-2">
          © 2026 Alaap Music Club. Rhythmic Resonance.
        </p>
      </footer>

      {/* Floating Bottom Navigator for Mobile devices */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Admin Login & Registration Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        activeAdminUser={activeAdminUser}
        adminAccounts={adminAccounts}
        onCreateAdminAccount={handleCreateAdminAccount}
        onRemoveAdminAccount={handleRemoveAdminAccount}
      />
    </div>
  );
}
