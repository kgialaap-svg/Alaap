import { useState, useRef } from 'react';
import { Search, Sparkles, Volume2, VolumeX, Crown, Shield, UserPlus, UserMinus, CheckCircle2, X, Lock, Mail, Key, AlertCircle, Trash2, Plus, Music, School, FileText, Image, Upload, RotateCcw, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import pragatiImg from '../assets/pragatri_bhattacharya.jpg';
import ayushImg from '../assets/ayush.jpg';
import abhishekImg from '../assets/abhishek_kunwar.jpg';
import shrishtiImg from '../assets/shrishti_singh.jpg';
import chitranshImg from '../assets/chitransh_shukla.jpg';

export const INITIAL_MEMBERS = [
  {
    id: 'm1',
    name: 'Pragati Bhattacharya',
    role: 'Club In Charge',
    instrument: 'Vocalist & Director',
    avatar: pragatiImg,
    joinedDate: 'Feb 2024',
    department: 'Music & Management',
  },
  {
    id: 'm2',
    name: 'Ayush Kumar Vishwakarma',
    role: 'Secretory',
    instrument: 'Singer & Guitarist',
    avatar: ayushImg,
    joinedDate: 'Oct 2024',
    department: 'B-tech',
    branch: 'CSE',
    year: '2nd Year'
  },
  {
    id: 'm3',
    name: 'Abhishek Kunwar',
    role: 'Coordinator',
    instrument: 'Flutist & Singer',
    bio: 'Passionate music coordinator bridging electronic and acoustic worlds. Crafting seamless collaborative sessions across campus.',
    avatar: abhishekImg,
    joinedDate: 'september-2025',
    department: 'BCA',
    branch: '',
    year: '2nd Year'
  },
  {
    id: 'm4',
    name: 'Shrishti Singh',
    role: 'Coordinator',
    instrument: 'Vocalist & Event Manager',
    bio: 'Passionate vocalist,Event Manager & Coordinator',
    avatar: shrishtiImg,
    joinedDate: 'Oct 2024',
    department: 'Btech',
    branch: 'Biotecnology',
    year: '2nd Year'
  },
  {
    id: 'm5',
    name: 'Chitransh Shukla',
    role: 'Coordinator',
    instrument: 'Vocalist and Guitarist',
    bio: 'Keeping the club in perfect sync. Coordinating logistics, sound engineering setups, and live percussion jams.',
    avatar: chitranshImg,
    joinedDate: 'Jan 2025',
    department: 'Polytechnic',
    branch: 'CSE',
    year: '2nd Year'
  },
  {
    id: 'm6',
    name: 'Comming soon',
    role: 'Vice President',
    instrument: 'Vocalist and Guitarist',
    bio: 'Keeping the club in perfect sync. Coordinating logistics, sound engineering setups, and live percussion jams.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    joinedDate: 'Jan 2025',
    department: 'Still unknown',
    branch: 'unknown',
    year: 'unknown'
  },
  {
    id: 'm7',
    name: 'Comming soon',
    role: 'President',
    instrument: 'Vocalist and Guitarist',
    bio: 'Keeping the club in perfect sync. Coordinating logistics, sound engineering setups, and live percussion jams.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    joinedDate: 'Jan 2025',
    department: 'unknown',
    branch: 'unknown',
    year: 'unknown'
  },
];

export default function MembersTab({ 
  members, 
  onConnect, 
  isAdminLoggedIn,
  activeAdminUser, 
  adminAccounts = [],
  onToggleMemberAdmin,
  onDeleteMember,
  onUpdateMember,
  onAddMember,
  onRestoreMembers,
  onOpenAdminModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRole, setActiveRole] = useState('All');
  const [playingMemberId, setPlayingMemberId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Manual Credentials Modal State (Super Admin Feature)
  const [modalMember, setModalMember] = useState(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customConfirmPassword, setCustomConfirmPassword] = useState('');
  const [modalError, setModalError] = useState('');

  // Add New Member Modal State (Admin & Super Admin Feature)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newInstrument, setNewInstrument] = useState('');
  const [newRole, setNewRole] = useState('Coordinator');
  const [customRole, setCustomRole] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newBranch, setNewBranch] = useState('');
  const [newYear, setNewYear] = useState('2nd Year');
  const [newAvatar, setNewAvatar] = useState('');
  const [addMemberError, setAddMemberError] = useState('');

  // Edit Member Modal State (Super Admin Feature)
  const [editingMember, setEditingMember] = useState(null);
  const [editName, setEditName] = useState('');
  const [editInstrument, setEditInstrument] = useState('');
  const [editRole, setEditRole] = useState('Coordinator');
  const [customEditRole, setCustomEditRole] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editBranch, setEditBranch] = useState('');
  const [editYear, setEditYear] = useState('2nd Year');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editMemberError, setEditMemberError] = useState('');

  // Web Audio refs
  const audioCtxRef = useRef(null);
  const sequenceRef = useRef(null);
  const synthNodesRef = useRef([]);

  const isSuperAdmin = activeAdminUser?.role === 'super_admin' || activeAdminUser?.email?.toLowerCase() === 'abhishekkunwer123123@gmail.com' || activeAdminUser?.email?.toLowerCase() === 'hacker@alaap.com' || activeAdminUser?.username?.toLowerCase() === 'hacker';

  const roles = ['All', ...Array.from(new Set(members.map(m => m.role)))];

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.instrument.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = activeRole === 'All' || member.role === activeRole;
    return matchesSearch && matchesRole;
  });

  const stopSynthesizer = () => {
    if (sequenceRef.current) {
      clearInterval(sequenceRef.current);
      sequenceRef.current = null;
    }
    synthNodesRef.current.forEach(node => {
      try { node.stop(); } catch(e){}
    });
    synthNodesRef.current = [];
    setPlayingMemberId(null);
  };

  const playSynthesizer = (member) => {
    stopSynthesizer();

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setPlayingMemberId(member.id);

      const bpm = member.featuredTrack?.bpm || 120;
      const stepDuration = 60 / bpm / 2;
      let step = 0;

      const intervalId = setInterval(() => {
        if (!ctx || ctx.state === 'suspended') return;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        let noteFreq = notes[step % notes.length];

        if (member.role === 'Resident DJ') {
          noteFreq = step % 4 === 0 ? 82.41 : notes[step % 3] * 0.5;
          osc.type = 'sawtooth';
        } else if (member.role === 'Producer') {
          osc.type = 'triangle';
        } else {
          osc.type = 'sine';
        }

        osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + stepDuration * 0.95);

        osc.start();
        osc.stop(ctx.currentTime + stepDuration);

        synthNodesRef.current.push(osc);
        step++;
      }, stepDuration * 1000);

      sequenceRef.current = intervalId;

    } catch (error) {
      console.warn('Web Audio was blocked or is not supported in this frame environment:', error);
    }
  };

  const handlePlayToggle = (member) => {
    if (playingMemberId === member.id) {
      stopSynthesizer();
    } else {
      playSynthesizer(member);
    }
  };

  // Handle Image File Upload directly from local device
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Edit Member Modal (Super Admin Only)
  const handleEditMemberClick = (member) => {
    if (!isSuperAdmin) {
      if (!isAdminLoggedIn) onOpenAdminModal();
      return;
    }
    const standardRoles = ['President', 'Vice President', 'Secretory', 'Coordinator', 'Club In Charge'];
    const isStandard = standardRoles.includes(member.role);
    setEditingMember(member);
    setEditName(member.name || '');
    setEditInstrument(member.instrument || '');
    setEditRole(isStandard ? member.role : 'Custom');
    setCustomEditRole(isStandard ? '' : (member.role || ''));
    setEditDept(member.department || '');
    setEditBranch(member.branch || '');
    setEditYear(member.year || '2nd Year');
    setEditBio(member.bio || '');
    setEditAvatar(member.avatar || '');
    setEditMemberError('');
  };

  // Handle Image File Upload for Edit Member Modal
  const handleEditImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Edit Member Modal
  const handleEditMemberSubmit = (e) => {
    e.preventDefault();
    setEditMemberError('');

    if (!editName.trim() || !editInstrument.trim()) {
      setEditMemberError('Member Name and Primary Instrument are required.');
      return;
    }

    const finalRole = editRole === 'Custom' ? (customEditRole.trim() || 'Coordinator') : editRole;

    const updatedFields = {
      name: editName.trim(),
      instrument: editInstrument.trim(),
      role: finalRole,
      department: editDept.trim(),
      branch: editBranch.trim(),
      year: editYear,
      bio: editBio.trim(),
      avatar: editAvatar.trim() || editingMember.avatar
    };

    if (onUpdateMember) {
      onUpdateMember(editingMember.id, updatedFields);
    }

    setToastMsg(`✏️ Member "${editName.trim()}" card updated successfully!`);
    setEditingMember(null);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Helper to check if a member is currently an Admin
  const isMemberAdmin = (member) => {
    const firstName = member.name.split(' ')[0].toLowerCase();
    const fullName = member.name.toLowerCase();

    return adminAccounts.some(acc => {
      const accUser = (acc.email || acc.username || '').toLowerCase();
      const accName = (acc.name || '').toLowerCase();
      return accUser.includes(firstName) || accUser === fullName || accName.includes(firstName) || accName.includes(fullName);
    });
  };

  // Handle Removing Member from Roster (Admin & Super Admin Feature)
  const handleRemoveMemberClick = (member) => {
    if (!isAdminLoggedIn) {
      onOpenAdminModal();
      return;
    }

    const actionTitle = isSuperAdmin ? "👑 Super Admin Action" : "🛡️ Admin Action";
    if (window.confirm(`${actionTitle}: Delete member "${member.name}" (${member.role}) from the club roster?`)) {
      if (onDeleteMember) {
        onDeleteMember(member.id);
      }
      setToastMsg(`🗑️ Member "${member.name}" removed from club roster.`);
      setTimeout(() => setToastMsg(''), 3500);
    }
  };

  // Open modal or remove admin for member (Super Admin Only)
  const handleAdminToggleClick = (member) => {
    if (!isSuperAdmin) return;

    const isAdminCurrently = isMemberAdmin(member);

    if (isAdminCurrently) {
      if (window.confirm(`Revoke Admin privileges for ${member.name}?`)) {
        if (onToggleMemberAdmin) {
          onToggleMemberAdmin(member, false);
        }
        setToastMsg(`Revoked Admin privileges from ${member.name}.`);
        setTimeout(() => setToastMsg(''), 3000);
      }
    } else {
      const defaultEmail = member.name.split(' ')[0].toLowerCase() + '@alaap.com';
      setModalMember(member);
      setCustomEmail(defaultEmail);
      setCustomPassword('');
      setCustomConfirmPassword('');
      setModalError('');
    }
  };

  // Submit manual credentials modal
  const handleSaveManualAdmin = (e) => {
    e.preventDefault();
    setModalError('');

    const u = customEmail.trim().toLowerCase();
    const p = customPassword;
    const cp = customConfirmPassword;

    if (!u || !p) {
      setModalError('Admin Email and Password are required.');
      return;
    }

    if (p !== cp) {
      setModalError('Passwords do not match. Please re-enter.');
      return;
    }

    if (u === 'abhishekkunwer123123@gmail.com' || u === 'hacker@alaap.com' || u === 'hacker') {
      setModalError('Email "abhishekkunwer123123@gmail.com" is reserved for Super Admin.');
      return;
    }

    const exists = adminAccounts.some(a => (a.email || a.username || '').toLowerCase() === u);
    if (exists) {
      setModalError(`Admin Email "${u}" already exists. Please enter a different Email.`);
      return;
    }

    if (onToggleMemberAdmin) {
      onToggleMemberAdmin(modalMember, true, u, p);
    }

    setToastMsg(`🎉 Granted Admin to ${modalMember.name}! Email: "${u}" | Password set successfully.`);
    setModalMember(null);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Submit Add New Member Modal
  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    setAddMemberError('');

    if (!newName.trim() || !newInstrument.trim()) {
      setAddMemberError('Member Name and Primary Instrument are required.');
      return;
    }

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
    ];

    const finalAvatar = newAvatar.trim() || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
    const finalRole = newRole === 'Custom' ? (customRole.trim() || 'Coordinator') : newRole;

    const createdMember = {
      id: `m_${Date.now()}`,
      name: newName.trim(),
      instrument: newInstrument.trim(),
      role: finalRole,
      department: newDept.trim() || 'Engineering',
      branch: newBranch.trim() || 'Music Society',
      year: newYear,
      bio: `Official ${finalRole} of Alaap Music Club.`,
      avatar: finalAvatar,
      joinedDate: '2026'
    };

    if (onAddMember) {
      onAddMember(createdMember);
    }

    setToastMsg(`🎉 Member "${createdMember.name}" (${finalRole}) successfully added to roster!`);
    setShowAddMemberModal(false);
    setNewName('');
    setNewInstrument('');
    setCustomRole('');
    setNewAvatar('');
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 select-none">
      
      {/* Header section with Add Member action button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <span className="text-xs font-mono text-tertiary uppercase tracking-widest font-semibold">Alaap Ecosystem</span>
          <h2 className="font-sans text-3xl font-extrabold text-on-surface mt-1">
            Alaap Members
          </h2>
          <p className="text-on-surface-variant font-body text-sm mt-1">
            Browse active students, instrumentalists, and electronic beat designers. Connect to collaborate.
          </p>
        </div>
        {/* Action Buttons Cluster (Admin / Super Admin) */}
        {isAdminLoggedIn && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-mono text-xs font-extrabold transition-all duration-300 shadow-xl cursor-pointer overflow-hidden border active:scale-95 bg-gradient-to-r from-tertiary via-amber-400 to-emerald-400 text-black border-amber-300/40 shadow-tertiary/25 hover:shadow-tertiary/40 hover:scale-[1.02]"
            >
              {/* Subtle Shimmer Overlay */}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 translate-x-full group-hover:-translate-x-full" />

              <div className="w-5 h-5 rounded-lg bg-black/15 flex items-center justify-center shrink-0 group-hover:rotate-90 transition-transform duration-300">
                <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
              </div>
              <span className="tracking-wide font-sans text-xs uppercase font-black">
                + Add Member
              </span>
              <Sparkles className="w-3.5 h-3.5 text-black/70 animate-pulse" />
            </button>

            {onRestoreMembers && (
              <button
                onClick={() => {
                  if (window.confirm("Restore missing default members to the roster?")) {
                    onRestoreMembers();
                    setToastMsg("🔄 Restored missing default members to roster.");
                    setTimeout(() => setToastMsg(''), 3500);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all duration-200 bg-surface-container-high/80 text-on-surface-variant hover:text-on-surface border border-outline-variant/20 hover:border-outline-variant/40 shadow-md cursor-pointer active:scale-95"
                title="Restore missing default club members"
              >
                <RotateCcw className="w-3.5 h-3.5 text-tertiary" />
                <span>Restore Roster</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Admin Status Control Banner */}
      {isAdminLoggedIn && (
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-mono text-emerald-400 shadow-lg">
          <div className="flex items-center gap-2">
            {isSuperAdmin ? (
              <Crown className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {isSuperAdmin ? "👑 Super Admin Mode Active" : "🛡️ Admin Access Active"}
              </span>
              <span className="text-[11px] text-emerald-300/80 font-body">
                Full Controls: You can Add new members, Edit member cards (Super Admin), and manage Admin credentials.
              </span>
            </div>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
            {isSuperAdmin ? "Super Admin" : "Admin Authorized"}
          </span>
        </div>
      )}

      {/* Instant Feedback Toast */}
      {toastMsg && (
        <div className="mb-6 p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-xs font-mono text-emerald-400 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10 mb-8">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search by name, instrument, gear..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface focus:outline-none focus:border-tertiary text-sm"
          />
        </div>

        {/* Roles tab */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeRole === role
                  ? 'bg-tertiary/20 text-tertiary border border-tertiary/30 font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface border border-transparent'
              }`}
            >
              {role === 'All' ? 'ALL' : role.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => {
            const hasAdmin = isMemberAdmin(member);

            return (
              <div
                key={member.id}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-outline-variant/15 hover:border-outline-variant/30 transition-all duration-300 relative group shadow-lg"
              >
                <div>
                  {/* Top-Right Floating Action Bar for Admins */}
                  {isAdminLoggedIn && (
                    <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1 p-1 rounded-2xl bg-slate-950/90 border border-outline-variant/30 backdrop-blur-md shadow-xl">
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdminToggleClick(member);
                          }}
                          className={`px-2.5 py-1 rounded-xl border text-[10px] font-mono font-extrabold transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                            hasAdmin 
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30' 
                              : 'bg-slate-900/80 text-on-surface-variant border-outline-variant/30 hover:text-amber-400 hover:border-amber-500/40'
                          }`}
                          title={hasAdmin ? "Manage / Revoke Admin Credentials" : "Grant Admin Privileges to Member"}
                        >
                          <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="uppercase tracking-wider font-extrabold">Admin</span>
                        </button>
                      )}

                      {/* Edit Member Button for Super Admin */}
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditMemberClick(member);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-tertiary/15 hover:bg-tertiary/25 text-tertiary border border-tertiary/40 hover:border-tertiary/60 transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1 text-[10px] font-mono font-black"
                          title="Edit Member Card Details (Super Admin Only)"
                        >
                          <Edit3 className="w-3 h-3 text-tertiary stroke-[2.5] shrink-0" />
                          <span className="uppercase tracking-wider font-extrabold">Edit</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveMemberClick(member);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/40 hover:border-red-500/60 transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1 text-[10px] font-mono font-black"
                        title="Delete Member from Roster (Admin / Super Admin)"
                      >
                        <Trash2 className="w-3 h-3 text-red-400 stroke-[2.5] shrink-0" />
                        <span className="uppercase tracking-wider font-extrabold">Delete</span>
                      </button>
                    </div>
                  )}

                  {/* Header info with clean avatar image and position tag */}
                  <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4 ${isAdminLoggedIn ? 'pt-8 sm:pt-6' : ''}`}>
                    <div className="shrink-0">
                      <img 
                        src={member.avatar || '/ayush.jpg'} 
                        alt={member.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
                        }}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-outline-variant/20 group-hover:border-tertiary/50 transition-all duration-300 shadow-md group-hover:shadow-tertiary/20 group-hover:scale-[1.02]"
                      />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Aesthetic Position / Role Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-tertiary/15 via-amber-500/10 to-emerald-500/10 border border-tertiary/30 text-tertiary text-xs font-mono font-extrabold tracking-wide shadow-sm">
                        <Sparkles className="w-3 h-3 text-tertiary animate-pulse" />
                        <span>{member.role.replace('Instrumentalist', 'Artist').toUpperCase()}</span>
                      </div>

                      <h3 className="font-sans font-extrabold text-lg sm:text-xl text-on-surface group-hover:text-tertiary transition-colors leading-tight truncate">
                        {member.name}
                      </h3>

                      <p className="text-sm font-mono text-tertiary font-extrabold flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-tertiary shrink-0" />
                        <span>{member.instrument}</span>
                      </p>
                    </div>
                  </div>

                  {/* Academic & Branch Tag */}
                  {(member.department || member.branch || member.year) && (
                    <div className="mt-3.5 pt-3 border-t border-outline-variant/15 flex flex-wrap gap-2 items-center">
                      {member.year && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 bg-primary/15 text-primary border border-primary/30 rounded-lg shadow-sm">
                          <School className="w-3.5 h-3.5 shrink-0" />
                          <span>{member.year}</span>
                        </span>
                      )}
                      {(member.department || member.branch) && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-on-surface-variant/90 px-2.5 py-1 bg-surface-container-high/60 border border-outline-variant/20 rounded-lg truncate max-w-full">
                          <span>{member.department || ''}{member.branch ? ` (${member.branch})` : ''}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Track Feature Section */}
                  {member.featuredTrack && (
                    <div className="mt-4 p-3 bg-surface-container-high/40 rounded-xl border border-outline-variant/10 flex items-center justify-between">
                      <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <span className="text-[9px] font-mono text-outline uppercase tracking-wider font-semibold">Featured Jam</span>
                        </div>
                        <p className="text-xs font-sans font-bold text-on-surface truncate">
                          {member.featuredTrack.title}
                        </p>
                        <span className="text-[10px] font-mono text-primary">{member.featuredTrack.bpm} BPM</span>
                      </div>

                      <button
                        onClick={() => handlePlayToggle(member)}
                        className={`p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          playingMemberId === member.id
                            ? 'bg-primary/20 text-primary border-primary/30'
                            : 'bg-surface-container-high border-outline-variant/10 text-on-surface-variant hover:text-on-surface'
                        }`}
                        title={playingMemberId === member.id ? "Stop Vibe Check" : "Alaap Vibe Check"}
                      >
                        {playingMemberId === member.id ? (
                          <div className="flex items-center gap-1">
                            <VolumeX className="w-4 h-4 animate-pulse" />
                            <div className="flex gap-0.5 h-3 items-end">
                              <span className="w-0.5 bg-primary animate-[bounce_0.8s_infinite]" />
                              <span className="w-0.5 bg-primary animate-[bounce_0.5s_infinite_0.2s]" />
                              <span className="w-0.5 bg-primary animate-[bounce_0.6s_infinite_0.4s]" />
                            </div>
                          </div>
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center bg-surface-container/20 rounded-2xl border border-outline-variant/10">
            <Search className="w-12 h-12 text-outline mx-auto mb-4 opacity-55" />
            <h4 className="font-sans font-bold text-lg text-on-surface">No members found</h4>
            <p className="text-on-surface-variant text-sm mt-1">Try searching another instrument, gear, or musical taste.</p>
          </div>
        )}
      </div>

      {/* MODAL 1: Manual Admin Credentials Modal (Super Admin Feature) */}
      <AnimatePresence>
        {modalMember && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-2xl relative"
            >
              <button
                onClick={() => setModalMember(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-xl text-on-surface">
                    Make {modalMember.name} an Admin
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant mt-0.5">
                    Set custom Admin Email & Password manually for this member.
                  </p>
                </div>
              </div>

              {modalError && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2 text-xs font-mono text-error">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleSaveManualAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase tracking-wider">
                    Admin Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ayush@alaap.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase tracking-wider">
                    Set Password *
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-sm font-mono"
                    />
                  </div>
                </div>

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
                      value={customConfirmPassword}
                      onChange={(e) => setCustomConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalMember(null)}
                    className="px-4 py-2.5 rounded-xl border border-outline-variant/20 text-on-surface-variant font-mono text-xs font-bold hover:bg-surface-container-high"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-500 text-black font-sans font-extrabold text-xs rounded-xl hover:opacity-95 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Confirm & Grant Admin</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Add New Member Modal (with Image File Upload Feature) */}
      <AnimatePresence>
        {showAddMemberModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-tertiary shadow-inner">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-2xl text-on-surface">
                    Add New Campus Member
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant mt-0.5">
                    Register a new student musician, vocalist, or beatboxer with custom photo upload.
                  </p>
                </div>
              </div>

              {addMemberError && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2 text-xs font-mono text-error">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addMemberError}</span>
                </div>
              )}

              <form onSubmit={handleAddMemberSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                      Member Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-tertiary text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                      Primary Instrument *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bass Guitar / Beatbox"
                      value={newInstrument}
                      onChange={(e) => setNewInstrument(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-tertiary text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                      Club Position *
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-2 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-tertiary text-xs font-bold cursor-pointer"
                    >
                      <option value="President">👑 President</option>
                      <option value="Vice President">⭐ Vice President</option>
                      <option value="Secretory">📝 Secretory</option>
                      <option value="Coordinator">🎯 Coordinator</option>
                      <option value="Club In Charge">🛡️ Club In Charge</option>
                      <option value="Custom">✏️ Custom Position...</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CSE / B-Tech"
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-tertiary text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                      Academic Year
                    </label>
                    <select
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full px-2.5 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-tertiary text-xs appearance-none"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>
                </div>

                {newRole === 'Custom' && (
                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                      Specify Custom Position Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead Vocalist / Sound Manager"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-tertiary text-xs"
                    />
                  </div>
                )}

                {/* Upload Image File Feature */}
                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase tracking-wider">
                    Upload Member Photo / Avatar
                  </label>
                  
                  <div className="flex items-center gap-3">
                    {newAvatar ? (
                      <img
                        src={newAvatar}
                        alt="Preview"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-tertiary shadow-md shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-center text-outline shrink-0">
                        <Upload className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1 space-y-1">
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-tertiary/15 text-tertiary border border-tertiary/30 hover:bg-tertiary/25 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95">
                        <Upload className="w-4 h-4" />
                        <span>Choose Image File...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] font-mono text-outline">
                        Select a JPG, PNG, or WEBP photo directly from your device.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMemberModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-outline-variant/20 text-on-surface-variant font-mono text-xs font-bold hover:bg-surface-container-high"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-tertiary text-on-tertiary font-sans font-extrabold text-xs rounded-xl hover:opacity-95 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Save New Member to Roster</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Edit Member Details Modal (Super Admin Feature) */}
      <AnimatePresence>
        {editingMember && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setEditingMember(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                  <Edit3 className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-2xl text-on-surface">
                    Edit Member Card Details
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant mt-0.5">
                    👑 Super Admin Access: Update member profile, position, instrument, academic info & photo.
                  </p>
                </div>
              </div>

              {editMemberError && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2 text-xs font-mono text-error">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editMemberError}</span>
                </div>
              )}

              <form onSubmit={handleEditMemberSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                      Member Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-xs font-sans font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                      Primary Instrument *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bass Guitar / Singer"
                      value={editInstrument}
                      onChange={(e) => setEditInstrument(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                      Club Position *
                    </label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full px-2 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-xs font-bold cursor-pointer"
                    >
                      <option value="President">👑 President</option>
                      <option value="Vice President">⭐ Vice President</option>
                      <option value="Secretory">📝 Secretory</option>
                      <option value="Coordinator">🎯 Coordinator</option>
                      <option value="Club In Charge">🛡️ Club In Charge</option>
                      <option value="Custom">✏️ Custom Position...</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CSE / B-Tech"
                      value={editDept}
                      onChange={(e) => setEditDept(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                      Academic Year
                    </label>
                    <select
                      value={editYear}
                      onChange={(e) => setEditYear(e.target.value)}
                      className="w-full px-2.5 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-xs appearance-none"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>
                </div>

                {editRole === 'Custom' && (
                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                      Specify Custom Position Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead Vocalist / Sound Manager"
                      value={customEditRole}
                      onChange={(e) => setCustomEditRole(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-xs font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                    Branch / Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Biotechnology / CSE"
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1 uppercase tracking-wider">
                    Bio / Short Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description or role in Alaap..."
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-xs font-body"
                  />
                </div>

                {/* Member Photo Upload & URL Edit */}
                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase tracking-wider">
                    Member Photo / Avatar Image
                  </label>
                  
                  <div className="flex items-center gap-3">
                    {editAvatar ? (
                      <img
                        src={editAvatar}
                        alt="Preview"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
                        }}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-center text-outline shrink-0">
                        <Upload className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95">
                        <Upload className="w-4 h-4" />
                        <span>Upload New Photo...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageFileUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Or paste Image URL..."
                        value={editAvatar}
                        onChange={(e) => setEditAvatar(e.target.value)}
                        className="w-full px-3 py-1.5 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface focus:outline-none focus:border-amber-400 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2.5 rounded-xl border border-outline-variant/20 text-on-surface-variant font-mono text-xs font-bold hover:bg-surface-container-high"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-tertiary text-black font-sans font-extrabold text-xs rounded-xl hover:opacity-95 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Member Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
