import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Image as ImageIcon, 
  LayoutGrid, 
  List, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Camera,
  ShieldCheck,
  Lock,
  Trash2,
  Calendar,
  Tag,
  FileText,
  Upload,
  AlertTriangle,
  Check
} from 'lucide-react';

import independenceDayImg1 from '../assets/independence_day_1.jpg';
import independenceDayImg2 from '../assets/independence_day_2.jpg';
import clubActivityImg1 from '../assets/club_activity_1.jpg';
import clubActivityImg2 from '../assets/club_activity_2.jpg';
import clubActivityImg3 from '../assets/club_activity_3.jpg';
import clubActivityImg4 from '../assets/club_activity_4.jpg';

export const CLUB_MILESTONES = [
  {
    id: 'h_club_activity_2025',
    year: '2025',
    title: 'Club Activity',
    subtitle: 'Acoustic Jamming & Vocal Rehearsal Session',
    description: 'An interactive indoor acoustic jamming session and practice workshop by Alaap Music Club, featuring vocalists and acoustic guitarists coming together to rehearse and collaborate.',
    tag: 'JAMMING',
    image: clubActivityImg2,
    photos: [
      {
        id: 'p_club_act_2',
        url: clubActivityImg2,
        caption: 'Circle Acoustic Jam Practice with Alaap Team Members'
      },
      {
        id: 'p_club_act_1',
        url: clubActivityImg1,
        caption: 'Acoustic Jamming & Vocal Rehearsal Session in Classroom'
      },
      {
        id: 'p_club_act_3',
        url: clubActivityImg3,
        caption: 'Full Team Musical Ensemble & Practice Gathering'
      },
      {
        id: 'p_club_act_4',
        url: clubActivityImg4,
        caption: 'Acoustic Guitar Performance & Vocal Studio Session'
      }
    ],
    createdBy: 'Club Admin'
  },
  {
    id: 'h_independence_day_2026',
    year: '2026',
    title: 'Independence Day',
    subtitle: 'Patriotic Musical Performance & Flag Hoisting Celebration',
    description: 'A soulful and vibrant live musical performance by Alaap Music Club on Independence Day, featuring patriotic acoustics, flute melodies, and ensemble vocal performances.',
    tag: 'PATRIOTIC',
    image: independenceDayImg1,
    photos: [
      {
        id: 'p_ind_day_1',
        url: independenceDayImg1,
        caption: 'Alaap Vocalists & Instrumentalists Performing Live on Independence Day'
      },
      {
        id: 'p_ind_day_2',
        url: independenceDayImg2,
        caption: 'Alaap Core Team & Members Celebrating Independence Day Together'
      }
    ],
    createdBy: 'Club Admin'
  },
  {
    id: 'h_flashmob_2026',
    year: '2026',
    title: 'Flashmob',
    subtitle: 'Musical Flashmob Performance',
    description: 'Interactive outdoor musical flashmob performance on campus bringing live acoustic music, singing, and energetic community vibes to the campus lawn.',
    tag: 'FLASHMOB',
    image: '/flashmob.jpg',
    photos: [
      {
        id: 'p_flashmob_1',
        url: '/flashmob.jpg',
        caption: 'Alaap Musical Flashmob Team Jamming Live on Campus'
      }
    ],
    createdBy: 'Club Admin'
  }
];

export default function HistoryTab({ 
  milestones = CLUB_MILESTONES, 
  onAddEvent,
  onUpdateMilestone,
  onDeleteEvent,
  onClearAllHistory,
  onRestoreMilestones,
  onAddPhoto, 
  onDeletePhoto,
  isAdminLoggedIn, 
  activeAdminUser,
  onOpenAdminModal 
}) {
  const [activeView, setActiveView] = useState('timeline'); // 'timeline' | 'gallery'
  const [expandedId, setExpandedId] = useState(milestones[0]?.id || null);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Lightbox Modal State
  const [lightboxData, setLightboxData] = useState(null); 

  // Add History Event Modal State
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventSubtitle, setEventSubtitle] = useState('');
  const [eventYear, setEventYear] = useState(new Date().getFullYear().toString());
  const [eventTag, setEventTag] = useState('CONCERT');
  const [eventCustomTag, setEventCustomTag] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCoverType, setEventCoverType] = useState('url'); // 'url' | 'file'
  const [eventCoverUrl, setEventCoverUrl] = useState('');
  const [eventCoverFilePreview, setEventCoverFilePreview] = useState('');

  // Add Photo Modal State
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [targetMilestoneId, setTargetMilestoneId] = useState(milestones[0]?.id || '');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoCaptionInput, setPhotoCaptionInput] = useState('');
  const [photoUploadType, setPhotoUploadType] = useState('url'); // 'url' | 'file'
  const [photoPreviewFileUrl, setPhotoPreviewFileUrl] = useState('');

  // Change History Cover Modal State
  const [editingMilestoneCover, setEditingMilestoneCover] = useState(null);
  const [coverOptionType, setCoverOptionType] = useState('preset'); // 'preset' | 'url' | 'file'
  const [selectedCoverPreset, setSelectedCoverPreset] = useState('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800');
  const [coverUrlInput, setCoverUrlInput] = useState('');
  const [coverFilePreview, setCoverFilePreview] = useState('');

  // Sync target milestone when milestones prop changes
  useEffect(() => {
    if (milestones.length > 0) {
      if (!targetMilestoneId || !milestones.some(m => m.id === targetMilestoneId)) {
        setTargetMilestoneId(milestones[0].id);
      }
      if (!expandedId) {
        setExpandedId(milestones[0].id);
      }
    }
  }, [milestones]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Determine user role badge
  const isSuperAdmin = activeAdminUser?.role === 'super_admin' || 
    (activeAdminUser?.email || '').toLowerCase() === 'abhishekkunwer123123@gmail.com' ||
    (activeAdminUser?.username || '').toLowerCase() === 'hacker';

  const userRoleLabel = isSuperAdmin ? 'Super Admin' : 'Admin';

  // Lightbox Handlers
  const openLightbox = (milestone, index) => {
    const photosList = milestone.photos && milestone.photos.length > 0
      ? milestone.photos
      : [{ id: milestone.id, url: milestone.image, caption: milestone.subtitle }];

    setLightboxData({
      milestoneId: milestone.id,
      milestoneTitle: milestone.title,
      year: milestone.year,
      tag: milestone.tag,
      photos: photosList,
      currentIndex: index
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxData) return;
      if (e.key === 'Escape') setLightboxData(null);
      if (e.key === 'ArrowRight') nextLightboxPhoto();
      if (e.key === 'ArrowLeft') prevLightboxPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxData]);

  const nextLightboxPhoto = () => {
    if (!lightboxData) return;
    setLightboxData(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.photos.length
    }));
  };

  const prevLightboxPhoto = () => {
    if (!lightboxData) return;
    setLightboxData(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.photos.length) % prev.photos.length
    }));
  };

  // Handle Event Cover File Upload
  const handleCoverFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventCoverFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Photo File Upload
  const handlePhotoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviewFileUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Add Event Trigger (Admin & Super Admin Protected)
  const handleAddEventClick = () => {
    if (!isAdminLoggedIn) {
      onOpenAdminModal();
    } else {
      setIsAddEventModalOpen(true);
    }
  };

  // Handle Add Photo Trigger (Admin & Super Admin Protected)
  const handleAddPhotoClick = (mId) => {
    if (!isAdminLoggedIn) {
      onOpenAdminModal();
    } else {
      if (mId) setTargetMilestoneId(mId);
      else if (milestones.length > 0) setTargetMilestoneId(milestones[0].id);
      setIsAddPhotoModalOpen(true);
    }
  };

  // Handle Delete Event Trigger (Admin & Super Admin Protected)
  const handleDeleteEventClick = (milestone) => {
    if (!isAdminLoggedIn) {
      onOpenAdminModal();
      return;
    }

    const confirmed = window.confirm(
      `⚠️ ADMIN CONFIRMATION:\nAre you sure you want to permanently delete the history event "${milestone.title}" (${milestone.year}) and all associated photos from history archives?`
    );

    if (confirmed && onDeleteEvent) {
      onDeleteEvent(milestone.id);
    }
  };

  // Handle Clear All History Trigger (Admin & Super Admin Protected)
  const handleClearAllClick = () => {
    if (!isAdminLoggedIn) {
      onOpenAdminModal();
      return;
    }

    const confirmed = window.confirm(
      "⚠️ ADMIN CONFIRMATION:\nAre you sure you want to permanently clear ALL history timeline events and photos from the archive?"
    );

    if (confirmed && onClearAllHistory) {
      onClearAllHistory();
    }
  };

  // Submit New History Event (Admin & Super Admin Only)
  const handleEventSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isAdminLoggedIn) {
      onOpenAdminModal();
      return;
    }

    const finalTitle = eventTitle.trim();
    if (!finalTitle) {
      alert('⚠️ Event Title is required. Please enter a title for the history event.');
      return;
    }

    const defaultFallback = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800';
    const finalCover = eventCoverType === 'file' 
      ? (eventCoverFilePreview || defaultFallback)
      : (eventCoverUrl.trim() || defaultFallback);

    const finalTag = (eventTag === 'OTHER' ? eventCustomTag.trim() : eventTag) || 'EVENT';

    const newEventObj = {
      title: finalTitle,
      subtitle: eventSubtitle.trim() || 'Alaap History Milestone Event',
      year: eventYear.trim() || new Date().getFullYear().toString(),
      tag: finalTag.toUpperCase(),
      description: eventDescription.trim() || 'Special event and live music performance captured in the Alaap archives.',
      image: finalCover,
      photos: [
        {
          id: `p_${Date.now()}`,
          url: finalCover,
          caption: eventSubtitle.trim() || finalTitle
        }
      ]
    };

    if (onAddEvent) {
      onAddEvent(newEventObj);
    }

    // Reset Form & Close Modal
    setEventTitle('');
    setEventSubtitle('');
    setEventYear(new Date().getFullYear().toString());
    setEventTag('CONCERT');
    setEventCustomTag('');
    setEventDescription('');
    setEventCoverUrl('');
    setEventCoverFilePreview('');
    setIsAddEventModalOpen(false);
  };

  // Submit New Photo (Admin & Super Admin Only)
  const handlePhotoSubmit = (e) => {
    e.preventDefault();
    if (!isAdminLoggedIn) {
      onOpenAdminModal();
      return;
    }

    const finalUrl = photoUploadType === 'file' ? photoPreviewFileUrl : photoUrlInput.trim();
    if (!finalUrl) return;

    const newPhotoObj = {
      id: `p_${Date.now()}`,
      url: finalUrl,
      caption: photoCaptionInput.trim() || 'Event memory photo'
    };

    if (onAddPhoto) {
      onAddPhoto(targetMilestoneId, newPhotoObj);
    }

    // Reset Form & Close Modal
    setPhotoUrlInput('');
    setPhotoCaptionInput('');
    setPhotoPreviewFileUrl('');
    setIsAddPhotoModalOpen(false);
  };

  // Open Change Milestone Cover Modal with auto-detection
  const openChangeCoverModal = (milestone, e) => {
    if (e) e.stopPropagation();
    if (!isAdminLoggedIn) {
      onOpenAdminModal();
      return;
    }

    const HISTORY_PRESETS = [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800'
    ];

    const currentImg = milestone.image || HISTORY_PRESETS[0];
    setEditingMilestoneCover(milestone);

    const isPreset = HISTORY_PRESETS.some(p => p === currentImg);
    if (isPreset) {
      setCoverOptionType('preset');
      setSelectedCoverPreset(currentImg);
      setCoverUrlInput('');
      setCoverFilePreview('');
    } else if (currentImg.startsWith('data:') || currentImg.startsWith('blob:')) {
      setCoverOptionType('file');
      setCoverFilePreview(currentImg);
      setCoverUrlInput('');
      setSelectedCoverPreset(HISTORY_PRESETS[0]);
    } else {
      setCoverOptionType('url');
      setCoverUrlInput(currentImg);
      setCoverFilePreview('');
      setSelectedCoverPreset(HISTORY_PRESETS[0]);
    }
  };

  // Handle Cover File Upload Preview
  const handleCoverFileUploadPreview = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Milestone Cover Photo Update
  const handleSaveMilestoneCover = (e) => {
    e.preventDefault();
    if (!editingMilestoneCover) return;

    let finalCover = selectedCoverPreset;
    if (coverOptionType === 'url') {
      finalCover = coverUrlInput.trim() || selectedCoverPreset;
    } else if (coverOptionType === 'file') {
      finalCover = coverFilePreview || selectedCoverPreset;
    }

    if (onUpdateMilestone) {
      onUpdateMilestone(editingMilestoneCover.id, { image: finalCover });
    }

    setEditingMilestoneCover(null);
  };

  // Collect all photos across all milestones for gallery view
  const allGalleryPhotos = milestones.flatMap(m => 
    (m.photos && m.photos.length > 0 ? m.photos : [{ id: m.id, url: m.image, caption: m.subtitle }]).map(p => ({
      ...p,
      milestoneId: m.id,
      milestoneTitle: m.title,
      year: m.year,
      tag: m.tag
    }))
  );

  const eventTags = ['All', ...Array.from(new Set(milestones.map(m => m.tag)))];

  const filteredGalleryPhotos = allGalleryPhotos.filter(p => 
    selectedFilter === 'All' || p.tag === selectedFilter
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 select-none">
      
      {/* Intro Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-outline-variant/15 pb-8">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary font-mono text-xs tracking-wider font-bold">
            <BookOpen className="w-3.5 h-3.5 animate-pulse text-tertiary" />
            <span>ALAAP ARCHIVES & PHOTO VAULT</span>
          </div>
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
            Event History & Photo Gallery
          </h2>
          <p className="font-body text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Explore stage highlights, crowds, and musical milestones. Only authorized Admin and Super Admin can manage events and photos.
          </p>
        </div>

        {/* Action Controls: View Switcher, Add History Event & Add Photo Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/20 shadow-inner">
            <button
              onClick={() => setActiveView('timeline')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === 'timeline'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Timeline ({milestones.length})</span>
            </button>
            <button
              onClick={() => setActiveView('gallery')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === 'gallery'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Photos ({allGalleryPhotos.length})</span>
            </button>
          </div>

          {/* Add History Event Button (Admin Only) */}
          {isAdminLoggedIn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group shrink-0"
            >
              {/* Ambient Glowing Aura */}
              <div className="absolute -inset-1 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 pointer-events-none bg-gradient-to-r from-emerald-500 via-primary to-teal-400 animate-pulse" />

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAddEventClick}
                className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-mono text-xs font-black tracking-wider uppercase transition-all duration-300 shadow-2xl cursor-pointer overflow-hidden backdrop-blur-xl border bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 border-emerald-300/40 hover:shadow-emerald-500/25"
              >
                {/* Light Sheen Effect on Hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                <div className="w-5 h-5 rounded-lg bg-slate-950/15 flex items-center justify-center text-slate-950 group-hover:rotate-90 transition-transform duration-300">
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="font-extrabold tracking-wide">Add History Event</span>
                <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse ml-0.5" />
              </motion.button>
            </motion.div>
          )}

          {/* Add Event Photo Button (Admin Only) */}
          {isAdminLoggedIn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group shrink-0"
            >
              {/* Ambient Glowing Aura */}
              <div className="absolute -inset-1 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 pointer-events-none bg-gradient-to-r from-pink-500 via-tertiary to-purple-500 animate-pulse" />

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleAddPhotoClick()}
                className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-mono text-xs font-black tracking-wider uppercase transition-all duration-300 shadow-2xl cursor-pointer overflow-hidden backdrop-blur-xl border bg-gradient-to-r from-pink-500 via-tertiary to-pink-400 text-slate-950 border-pink-300/40 hover:shadow-pink-500/25"
              >
                {/* Light Sheen Effect on Hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                <div className="w-5 h-5 rounded-lg bg-slate-950/15 flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="font-extrabold tracking-wide">Add Photo</span>
                <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse ml-0.5" />
              </motion.button>
            </motion.div>
          )}

          {/* Clear All History Button (Admin Only) */}
          {isAdminLoggedIn && milestones.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleClearAllClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-lg cursor-pointer bg-error/15 hover:bg-error/30 text-error border border-error/30 shrink-0 active:scale-95"
              title="Clear All History Data, Photos & Timeline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Admin Privilege Status Banner */}
      {isAdminLoggedIn && (
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-emerald-400 shadow-md">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block text-sm">
                👑 Authorized {userRoleLabel} Mode Active
              </span>
              <span className="text-[11px] text-emerald-300/80">
                You have full permissions to Add & Delete History Events and Event Photos.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
            {userRoleLabel} Access
          </span>
        </div>
      )}

      {/* VIEW 1: TIMELINE VIEW */}
      {activeView === 'timeline' && (
        <>
          {milestones.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl border border-outline-variant/20 p-8 space-y-4">
              <BookOpen className="w-12 h-12 text-tertiary mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-on-surface">No History Events Archived</h3>
              <p className="text-sm font-body text-on-surface-variant max-w-md mx-auto">
                {isAdminLoggedIn
                  ? 'No event milestones found in the history section. Admins can add the first event using the button below.'
                  : 'No event milestones found in the history section.'}
              </p>
              {isAdminLoggedIn && (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleAddEventClick}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-mono text-xs font-bold shadow-lg hover:opacity-90 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First History Event</span>
                  </button>

                  {onRestoreMilestones && (
                    <button
                      onClick={onRestoreMilestones}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-mono text-xs font-bold shadow-md hover:bg-surface-container-highest transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Restore Default Milestones</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="relative border-l-2 border-outline-variant/20 ml-4 md:ml-32 space-y-10 pb-12">
              {milestones.map((milestone) => {
                const isExpanded = expandedId === milestone.id;
                const photoCount = milestone.photos ? milestone.photos.length : 1;

                return (
                  <div key={milestone.id} className="relative pl-6 md:pl-10">
                    {/* Timeline node dot */}
                    <div 
                      onClick={() => toggleExpand(milestone.id)}
                      className={`absolute -left-[11px] top-2 w-5 h-5 rounded-full border-2 transition-all cursor-pointer z-10 flex items-center justify-center ${
                        isExpanded 
                          ? 'bg-primary border-primary scale-125 ring-4 ring-primary/20 shadow-lg' 
                          : 'bg-background border-outline-variant hover:border-primary'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${isExpanded ? 'bg-on-primary' : 'bg-transparent'}`} />
                    </div>

                    {/* Left Year & Tag Badge (Wide Screens) */}
                    <div className="hidden md:block absolute right-[100%] mr-10 top-1 text-right w-24">
                      <span className="font-sans font-black text-2xl text-primary block tracking-tighter neon-glow-primary">
                        {milestone.year}
                      </span>
                      <span className="text-[10px] font-mono text-tertiary block font-bold tracking-widest mt-0.5 uppercase">
                        {milestone.tag}
                      </span>
                    </div>

                    {/* Milestone History Card */}
                    <div className="glass-card rounded-3xl border border-outline-variant/20 overflow-hidden hover:border-outline-variant/40 transition-all duration-300 shadow-xl">
                      
                      {/* Banner Image Preview */}
                      <div 
                        onClick={() => openLightbox(milestone, 0)}
                        className="w-full h-48 md:h-60 relative cursor-pointer group overflow-hidden"
                      >
                        <img 
                          src={milestone.image} 
                          alt={milestone.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            const fallback = milestone.photos?.[0]?.url || clubActivityImg2;
                            if (e.target.src !== fallback) e.target.src = fallback;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
                        
                        {/* Admin Change/Edit Cover Button */}
                        {isAdminLoggedIn && (
                          <button
                            type="button"
                            onClick={(e) => openChangeCoverModal(milestone, e)}
                            className="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-emerald-400 text-white hover:text-slate-950 text-[11px] font-mono font-extrabold backdrop-blur-md shadow-2xl border border-white/20 transition-all duration-200 cursor-pointer active:scale-95 group/editbtn"
                            title="Change / Edit Milestone Cover Photo"
                          >
                            <Camera className="w-3.5 h-3.5 text-emerald-400 group-hover/editbtn:text-slate-950 transition-colors stroke-[2.5]" />
                            <span>Edit Cover</span>
                          </button>
                        )}

                        {/* Floating Photo Count Badge */}
                        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md border border-outline-variant/30 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-mono text-on-surface shadow-lg group-hover:border-primary/50 transition-colors">
                          <ImageIcon className="w-3.5 h-3.5 text-tertiary" />
                          <span className="font-bold">{photoCount} Photo{photoCount > 1 ? 's' : ''}</span>
                        </div>

                        {/* Hover Zoom Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-mono text-xs font-bold backdrop-blur-[2px]">
                          <Maximize2 className="w-5 h-5 animate-pulse text-tertiary" />
                          <span>Click to view photos</span>
                        </div>
                      </div>

                      {/* Card Content & Action Header */}
                      <div className="p-6 md:p-8 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="space-y-1">
                            {/* Mobile Year Badge */}
                            <div className="md:hidden flex items-center gap-2 mb-2">
                              <span className="text-sm font-sans font-black text-primary neon-glow-primary">
                                {milestone.year}
                              </span>
                              <span className="text-[9px] font-mono text-tertiary border border-tertiary/30 px-2 py-0.5 rounded-full font-bold">
                                {milestone.tag}
                              </span>
                            </div>

                            <h3 className="font-sans font-black text-xl md:text-2xl text-on-surface tracking-tight">
                              {milestone.title}
                            </h3>
                            <p className="text-xs font-mono text-tertiary font-bold tracking-wide">
                              {milestone.subtitle}
                            </p>
                          </div>

                          {/* Action Buttons: Expand Toggle & Delete Event (Admin Protected) */}
                          <div className="flex items-center gap-2 self-end sm:self-start">
                            {isAdminLoggedIn && (
                              <button
                                onClick={() => handleDeleteEventClick(milestone)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-error/15 hover:bg-error/30 text-error border border-error/30 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Delete Entire Event (Admin Only)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Delete Event</span>
                              </button>
                            )}

                            <button 
                              onClick={() => toggleExpand(milestone.id)}
                              className="p-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                              title={isExpanded ? "Collapse Details" : "Expand Event Photos"}
                            >
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                          {milestone.description}
                        </p>

                        {/* Expandable Photo Album Gallery Strip */}
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.4 }}
                            className="pt-4 border-t border-outline-variant/15 space-y-3"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-mono text-on-surface font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Camera className="w-3.5 h-3.5 text-primary" />
                                Event Photo Album ({milestone.photos ? milestone.photos.length : 1})
                              </span>

                              {isAdminLoggedIn && (
                                <button
                                  onClick={() => handleAddPhotoClick(milestone.id)}
                                  className="text-xs font-mono text-tertiary hover:underline flex items-center gap-1 cursor-pointer font-bold"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add Photo</span>
                                </button>
                              )}
                            </div>

                            {/* Thumbnail Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {(milestone.photos && milestone.photos.length > 0 ? milestone.photos : [{ id: milestone.id, url: milestone.image, caption: milestone.subtitle }]).map((photo, idx) => (
                                <div
                                  key={photo.id || idx}
                                  onClick={() => openLightbox(milestone, idx)}
                                  className="relative h-28 rounded-2xl overflow-hidden cursor-pointer border border-outline-variant/20 hover:border-tertiary/60 transition-all group/thumb shadow-md"
                                >
                                  <img
                                    src={photo.url}
                                    alt={photo.caption || milestone.title}
                                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover/thumb:opacity-90 transition-opacity" />
                                  
                                  <p className="absolute bottom-2 left-2 right-2 text-[10px] font-body text-white line-clamp-1 leading-tight font-medium">
                                    {photo.caption}
                                  </p>

                                  {/* Admin Delete Action on Thumbnail */}
                                  {isAdminLoggedIn && onDeletePhoto && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm("⚠️ Admin Confirmation: Delete this photo from event history?")) {
                                          onDeletePhoto(milestone.id, photo.id);
                                        }
                                      }}
                                      className="absolute top-1.5 left-1.5 bg-black/80 hover:bg-error text-white p-1.5 rounded-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-md"
                                      title="Delete Photo (Admin Only)"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}

                                  <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-sm p-1 rounded-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                    <Maximize2 className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: ALL PHOTOS GALLERY GRID VIEW */}
      {activeView === 'gallery' && (
        <div className="space-y-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 items-center bg-surface-container-low p-3 rounded-2xl border border-outline-variant/15">
            <span className="text-xs font-mono text-outline uppercase font-bold mr-2">Filter Event:</span>
            {eventTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedFilter(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                  selectedFilter === tag
                    ? 'bg-tertiary/20 text-tertiary border border-tertiary/30'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tag.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Photos Grid */}
          {filteredGalleryPhotos.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl border border-outline-variant/20 p-8 space-y-4">
              <ImageIcon className="w-12 h-12 text-tertiary mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-on-surface">No Photos Archived</h3>
              <p className="text-sm font-body text-on-surface-variant max-w-md mx-auto">
                No event photos found in the history photo gallery. Admins can upload photos using the button above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGalleryPhotos.map((photo, index) => {
                const milestone = milestones.find(m => m.id === photo.milestoneId) || {};
                const pIndex = milestone?.photos ? milestone.photos.findIndex(p => p.id === photo.id) : 0;

              return (
                <motion.div
                  key={photo.id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => openLightbox(milestone, pIndex >= 0 ? pIndex : 0)}
                  className="glass-card rounded-2xl overflow-hidden border border-outline-variant/20 hover:border-tertiary/50 transition-all duration-300 group cursor-pointer shadow-lg flex flex-col justify-between"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80" />
                    
                    <span className="absolute top-3 left-3 bg-background/80 backdrop-blur-md border border-outline-variant/20 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg text-primary shadow-sm">
                      {photo.year} • {photo.tag}
                    </span>

                    {/* Admin Delete Action */}
                    {isAdminLoggedIn && onDeletePhoto && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("⚠️ Admin Confirmation: Delete photo from history archives?")) {
                            onDeletePhoto(photo.milestoneId, photo.id);
                          }
                        }}
                        className="absolute top-3 right-10 bg-black/80 hover:bg-error text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        title="Delete Photo (Admin Only)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-4 h-4 text-tertiary" />
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <h4 className="font-sans font-bold text-sm text-on-surface group-hover:text-tertiary transition-colors">
                      {photo.milestoneTitle}
                    </h4>
                    <p className="font-body text-xs text-on-surface-variant line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* LIGHTBOX FULLSCREEN MODAL */}
      <AnimatePresence>
        {lightboxData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxData(null)}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex flex-col items-center justify-between p-4 md:p-8 select-none"
          >
            {/* Pinned Floating Close / Cut Button (Top-Right) - Never Cut Off */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxData(null);
              }}
              className="fixed top-4 right-4 md:top-6 md:right-6 z-[100] p-3 rounded-full bg-slate-900/90 hover:bg-red-500 text-white border border-white/30 hover:border-red-400 shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-center min-w-[48px] min-h-[48px] backdrop-blur-md active:scale-95"
              title="Close Fullscreen View (Esc)"
              aria-label="Close"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </motion.button>

            {/* Top Bar */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl flex justify-between items-center text-white z-10 pr-14 md:pr-16"
            >
              <div className="space-y-0.5 max-w-[65%] sm:max-w-md">
                <span className="text-[10px] font-mono text-tertiary uppercase font-bold tracking-widest block truncate">
                  {lightboxData.year} • {lightboxData.tag}
                </span>
                <h3 className="font-sans font-bold text-sm sm:text-base md:text-lg text-white truncate">
                  {lightboxData.milestoneTitle}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-outline font-bold bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  {lightboxData.currentIndex + 1} / {lightboxData.photos.length}
                </span>

                {/* Admin Delete Action inside Lightbox */}
                {isAdminLoggedIn && onDeletePhoto && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentP = lightboxData.photos[lightboxData.currentIndex];
                      if (currentP && window.confirm("⚠️ Admin Confirmation: Delete this photo from event history?")) {
                        onDeletePhoto(lightboxData.milestoneId, currentP.id);
                        setLightboxData(null);
                      }
                    }}
                    className="p-2 rounded-full bg-error/20 hover:bg-error text-white transition-colors cursor-pointer"
                    title="Delete Photo (Admin Only)"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Main Image Stage */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl flex-1 flex items-center justify-center my-4 overflow-hidden"
            >
              {lightboxData.photos.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevLightboxPhoto();
                  }}
                  className="absolute left-2 md:left-4 z-20 p-3 rounded-full bg-black/70 hover:bg-tertiary/50 border border-white/20 text-white transition-all cursor-pointer active:scale-90 shadow-xl"
                  title="Previous Photo (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <motion.img
                key={lightboxData.currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={lightboxData.photos[lightboxData.currentIndex]?.url}
                alt={lightboxData.photos[lightboxData.currentIndex]?.caption}
                className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />

              {lightboxData.photos.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextLightboxPhoto();
                  }}
                  className="absolute right-2 md:right-4 z-20 p-3 rounded-full bg-black/70 hover:bg-tertiary/50 border border-white/20 text-white transition-all cursor-pointer active:scale-90 shadow-xl"
                  title="Next Photo (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Caption & Controls */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-surface-container-high/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10 text-center space-y-1.5 shadow-2xl"
            >
              <p className="font-body text-xs sm:text-sm text-on-surface font-medium">
                {lightboxData.photos[lightboxData.currentIndex]?.caption}
              </p>
              <div className="flex justify-center gap-4 text-[11px] font-mono text-tertiary font-bold">
                <span>Alaap Event Archives</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD HISTORY EVENT MODAL (ADMIN & SUPER ADMIN ONLY) */}
      <AnimatePresence>
        {isAddEventModalOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-xl glass-card rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-tertiary rounded-t-3xl" />

              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/15 mb-6">
                <div className="flex items-center gap-3 text-primary">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-lg text-on-surface flex items-center gap-2">
                      <span>Add History Event</span>
                      <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary uppercase">
                        {userRoleLabel}
                      </span>
                    </h3>
                    <p className="text-xs font-mono text-on-surface-variant">Create a new milestone in Alaap event history archives</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEventSubmit} className="space-y-4">
                {/* Title & Year Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Winter Symphony Festival"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase">
                      Year *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2026"
                      value={eventYear}
                      onChange={(e) => setEventYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 font-mono"
                    />
                  </div>
                </div>

                {/* Subtitle / Tagline */}
                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase">
                    Subtitle / Theme Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Live Student Orchestra & Unplugged Jams"
                    value={eventSubtitle}
                    onChange={(e) => setEventSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40"
                  />
                </div>

                {/* Tag Selector */}
                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase">
                    Event Tag / Category
                  </label>
                  <select
                    value={eventTag}
                    onChange={(e) => setEventTag(e.target.value)}
                    className="w-full px-3 py-2.5 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-emerald-400"
                  >
                    <option value="CONCERT">CONCERT</option>
                    <option value="FLASH MOB">FLASH MOB</option>
                    <option value="FRESHERS">FRESHERS</option>
                    <option value="FAREWELL">FAREWELL</option>
                    <option value="CHALLENGE">CHALLENGE</option>
                    <option value="SHOWCASE">SHOWCASE</option>
                    <option value="FESTIVAL">FESTIVAL</option>
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="OTHER">OTHER (Custom Tag)</option>
                  </select>
                  {eventTag === 'OTHER' && (
                    <input
                      type="text"
                      required
                      placeholder="Enter custom category tag..."
                      value={eventCustomTag}
                      onChange={(e) => setEventCustomTag(e.target.value)}
                      className="w-full mt-2 px-3.5 py-2 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface text-xs focus:outline-none focus:border-emerald-400"
                    />
                  )}
                </div>

                {/* Event Description */}
                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase">
                    Event History Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the highlight memories, stage performances, and audience atmosphere..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40"
                  />
                </div>

                {/* Cover Image Upload Mode */}
                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase">
                    Main Banner Cover Image
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setEventCoverType('url')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        eventCoverType === 'url' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setEventCoverType('file')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        eventCoverType === 'file' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>

                  {eventCoverType === 'url' ? (
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={eventCoverUrl}
                      onChange={(e) => setEventCoverUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-emerald-400"
                    />
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileUpload}
                        className="w-full px-3.5 py-2 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface text-xs focus:outline-none focus:border-emerald-400"
                      />
                      {eventCoverFilePreview && (
                        <div className="mt-2 h-28 rounded-xl overflow-hidden border border-emerald-500/30">
                          <img src={eventCoverFilePreview} alt="Banner Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Actions (Sticky bottom bar on mobile) */}
                <div className="pt-4 flex justify-end items-center gap-3 border-t border-outline-variant/15 sticky bottom-0 bg-surface-container-lowest/95 backdrop-blur-md z-20 pb-1">
                  <button
                    type="button"
                    onClick={() => setIsAddEventModalOpen(false)}
                    className="px-4 py-2 text-xs font-mono font-bold text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => handleEventSubmit(e)}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-mono text-xs font-black tracking-wider uppercase shadow-xl hover:shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer touch-manipulation min-h-[44px]"
                  >
                    <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    <span>Save History Event</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD PHOTO MODAL (ADMIN & SUPER ADMIN ONLY) */}
      <AnimatePresence>
        {isAddPhotoModalOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg glass-card rounded-3xl p-6 border border-outline-variant/30 shadow-2xl relative"
            >
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/15 mb-4">
                <div className="flex items-center gap-2 text-tertiary">
                  <Camera className="w-5 h-5" />
                  <h3 className="font-sans font-bold text-lg text-on-surface">Add Event Photo ({userRoleLabel})</h3>
                </div>
                <button
                  onClick={() => setIsAddPhotoModalOpen(false)}
                  className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePhotoSubmit} className="space-y-4">
                {/* Select Target Event */}
                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase">
                    Select History Event Milestone
                  </label>
                  <select
                    value={targetMilestoneId}
                    onChange={(e) => setTargetMilestoneId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-tertiary"
                  >
                    {milestones.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.year} - {m.title} ({m.tag})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upload Mode Selector */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPhotoUploadType('url')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      photoUploadType === 'url' ? 'bg-tertiary/20 text-tertiary border border-tertiary/30' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoUploadType('file')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      photoUploadType === 'file' ? 'bg-tertiary/20 text-tertiary border border-tertiary/30' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    Upload File
                  </button>
                </div>

                {/* URL input vs File input */}
                {photoUploadType === 'url' ? (
                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase">
                      Photo Image URL
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-tertiary"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase">
                      Select Photo from Device
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      required={!photoPreviewFileUrl}
                      onChange={handlePhotoFileUpload}
                      className="w-full px-3.5 py-2 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface text-xs focus:outline-none focus:border-tertiary"
                    />
                    {photoPreviewFileUrl && (
                      <div className="mt-2 h-24 rounded-xl overflow-hidden border border-tertiary/30">
                        <img src={photoPreviewFileUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                {/* Caption input */}
                <div>
                  <label className="block text-xs font-mono text-outline font-bold mb-1.5 uppercase">
                    Photo Caption / Memory Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Live acoustic jam during sunset..."
                    value={photoCaptionInput}
                    onChange={(e) => setPhotoCaptionInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-tertiary"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex justify-end items-center gap-3 sticky bottom-0 bg-surface-container-lowest/95 backdrop-blur-md z-20 pb-1">
                  <button
                    type="button"
                    onClick={() => setIsAddPhotoModalOpen(false)}
                    className="px-4 py-2 text-xs font-mono font-bold text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => handlePhotoSubmit(e)}
                    className="px-5 py-3 rounded-xl bg-tertiary text-on-tertiary font-mono text-xs font-bold shadow-lg hover:bg-tertiary/90 active:scale-95 transition-all cursor-pointer touch-manipulation min-h-[44px]"
                  >
                    Save Photo to Archives
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHANGE HISTORY MILESTONE COVER MODAL (ADMIN ONLY) */}
      <AnimatePresence>
        {editingMilestoneCover && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-lg glass-card rounded-3xl p-6 border border-outline-variant/30 shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-tertiary rounded-t-3xl" />

              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/15 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-base text-on-surface">Change Milestone Cover Photo</h3>
                    <p className="text-xs font-mono text-on-surface-variant line-clamp-1">{editingMilestoneCover.title} ({editingMilestoneCover.year})</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingMilestoneCover(null)}
                  className="p-1.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMilestoneCover} className="space-y-4">
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setCoverOptionType('preset')}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      coverOptionType === 'preset' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    Preset Covers
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverOptionType('url')}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      coverOptionType === 'url' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverOptionType('file')}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      coverOptionType === 'file' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    Upload File
                  </button>
                </div>

                {coverOptionType === 'preset' && (
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: 'h1', title: 'Live Symphony', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800' },
                      { id: 'h2', title: 'Acoustic Jam', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800' },
                      { id: 'h3', title: 'Stage Lights', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800' },
                      { id: 'h4', title: 'Crowd Cheers', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800' },
                      { id: 'h5', title: 'Classical Setup', url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800' }
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedCoverPreset(preset.url)}
                        className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                          selectedCoverPreset === preset.url ? 'border-emerald-400 ring-2 ring-emerald-400/40 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        title={preset.title}
                      >
                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          {selectedCoverPreset === preset.url && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {coverOptionType === 'url' && (
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={coverUrlInput}
                    onChange={(e) => setCoverUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:border-emerald-400"
                  />
                )}

                {coverOptionType === 'file' && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileUploadPreview}
                      className="w-full px-3.5 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:border-emerald-400"
                    />
                    {coverFilePreview && (
                      <div className="mt-2 h-28 rounded-xl overflow-hidden border border-emerald-500/30 relative">
                        <img src={coverFilePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 flex justify-end items-center gap-3 border-t border-outline-variant/15 sticky bottom-0 bg-surface-container-lowest/95 backdrop-blur-md z-20 pb-1">
                  <button
                    type="button"
                    onClick={() => setEditingMilestoneCover(null)}
                    className="px-4 py-2 text-xs font-mono font-bold text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => handleSaveMilestoneCover(e)}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-mono text-xs font-black tracking-wider uppercase shadow-xl hover:shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer touch-manipulation min-h-[44px]"
                  >
                    <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    <span>Update Cover Photo</span>
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
