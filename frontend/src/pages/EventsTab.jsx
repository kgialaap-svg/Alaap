import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Users, Calendar, Plus, Sparkles, ShieldCheck, Crown, ExternalLink, Link, Camera, Check, X, Trash2 } from 'lucide-react';
import { message, Tag } from 'antd';

export const PROGRAMMER_EVENTS = [];
export const INITIAL_EVENTS = PROGRAMMER_EVENTS;

const PRESET_COVERS = [
  { id: 'p1', title: 'Stage Concert', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800' },
  { id: 'p2', title: 'Acoustic Jam', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800' },
  { id: 'p3', title: 'Live Orchestra', url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800' },
  { id: 'p4', title: 'Rock Night', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800' },
  { id: 'p5', title: 'Festival Crowd', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800' }
];

export default function EventsTab({ events = [], onAddEvent, onDeleteEvent, isAdminLoggedIn, isSuperAdmin, onOpenAdminModal }) {
  const [showAddForm, setShowAddForm] = useState(false);

  // New Event Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Concert');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [fullDate, setFullDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [initialAttendees, setInitialAttendees] = useState('1');

  // Image Selector States
  const [imageType, setImageType] = useState('preset'); // 'preset' | 'url' | 'file'
  const [selectedPreset, setSelectedPreset] = useState(PRESET_COVERS[0].url);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFilePreview, setImageFilePreview] = useState('');

  const handleAddClick = () => {
    if (!isAdminLoggedIn) {
      if (onOpenAdminModal) onOpenAdminModal();
    } else {
      setShowAddForm(true);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFormImage = () => {
    if (imageType === 'url') return imageUrl.trim() || PRESET_COVERS[0].url;
    if (imageType === 'file') return imageFilePreview || PRESET_COVERS[0].url;
    return selectedPreset || PRESET_COVERS[0].url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdminLoggedIn) {
      if (onOpenAdminModal) onOpenAdminModal();
      return;
    }
    if (!title.trim() || !date.trim() || !location.trim()) return;

    const newEventPayload = {
      id: `evt_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'A creative concert organized by the Alaap music community.',
      date: date.toUpperCase().trim(),
      fullDate: fullDate.trim() || `${date.toUpperCase().trim()}, 2026`,
      time: time.trim() || '7:00 PM - 9:00 PM',
      location: location.trim(),
      category,
      image: getFormImage(),
      formUrl: formUrl.trim() || 'https://forms.google.com',
      attendeesCount: Math.max(0, parseInt(initialAttendees) || 1),
      accentColor: category === 'Concert' || category === 'Social' ? 'primary' : 'tertiary',
      createdBy: isSuperAdmin ? 'Super Admin' : 'Club Admin'
    };

    if (onAddEvent) {
      onAddEvent(newEventPayload);
    }

    message.success(`🚀 Event "${title}" published directly to MongoDB Atlas!`);

    // Reset Form State
    setTitle('');
    setDescription('');
    setDate('');
    setFullDate('');
    setTime('');
    setLocation('');
    setFormUrl('');
    setInitialAttendees('1');
    setImageType('preset');
    setImageUrl('');
    setImageFilePreview('');
    setShowAddForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 select-none">
      {/* Header section with Admin Action Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              Alaap Schedule (MongoDB Atlas Sync)
            </span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-on-surface mt-1">
            Upcoming Concerts & Showcases
          </h2>
          <p className="text-on-surface-variant font-body text-sm mt-1 max-w-xl">
            Connect with college artists, experience live stage takeovers, and register directly for upcoming music performances.
          </p>
        </div>

        {isAdminLoggedIn && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleAddClick}
              className="relative flex items-center gap-2.5 px-6 py-3 rounded-2xl font-mono text-xs font-black tracking-wider uppercase transition-all duration-300 shadow-2xl cursor-pointer overflow-hidden backdrop-blur-xl border bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 border-emerald-300/40 hover:shadow-emerald-500/25"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-950/15 flex items-center justify-center text-slate-950 group-hover:rotate-90 transition-transform duration-300">
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="font-extrabold tracking-wide">Create Campus Event</span>
              <Sparkles className="w-4 h-4 text-slate-950 animate-pulse ml-0.5" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Admin Status Banner */}
      {isAdminLoggedIn && (
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-emerald-400">
          <div className="flex items-center gap-2">
            {isSuperAdmin ? <Crown className="w-4 h-4 text-amber-400 shrink-0" /> : <ShieldCheck className="w-4 h-4 shrink-0" />}
            <span className="font-bold">
              {isSuperAdmin
                ? "👑 Super Admin Mode Active: Events created are saved to MongoDB Atlas & hosted directly to visitors."
                : "🛡️ Admin Mode Active: Create & publish events directly to MongoDB Atlas."
              }
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Tag color="cyan">⚡ MongoDB Atlas Live Sync</Tag>
          </div>
        </div>
      )}

      {/* CREATE EVENT FORM MODAL FOR ADMINS & SUPER ADMINS */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-10 max-w-xl mx-auto glass-card p-6 md:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/15">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-sans font-extrabold text-xl text-on-surface">Publish Event to MongoDB Atlas</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-outline uppercase tracking-wider mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rock & Fusion Takeover"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-outline uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Concert">Concert</option>
                    <option value="Showcase">Showcase</option>
                    <option value="Jam Session">Jam Session</option>
                    <option value="Masterclass">Masterclass</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-outline uppercase tracking-wider mb-1">
                  Event Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe performance details, artists involved, or RSVP guidelines..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-outline uppercase tracking-wider mb-1">
                    Card Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OCT 15"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-outline uppercase tracking-wider mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7:00 PM - 9:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-outline uppercase tracking-wider mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Auditorium"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-outline uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Google Form Link</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://forms.google.com/..."
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-outline uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Initial Attendees Count</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1"
                    value={initialAttendees}
                    onChange={(e) => setInitialAttendees(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div>
                <label className="block text-xs font-mono text-outline uppercase tracking-wider mb-2">
                  Event Cover Image
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageType('preset')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${imageType === 'preset' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-surface-container text-on-surface-variant'}`}
                  >
                    Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageType('url')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${imageType === 'url' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-surface-container text-on-surface-variant'}`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageType('file')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${imageType === 'file' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-surface-container text-on-surface-variant'}`}
                  >
                    Upload File
                  </button>
                </div>

                {imageType === 'preset' && (
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_COVERS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPreset(preset.url)}
                        className={`relative h-14 rounded-xl overflow-hidden border-2 transition-all ${selectedPreset === preset.url ? 'border-emerald-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                        {selectedPreset === preset.url && (
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {imageType === 'url' && (
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-surface-container rounded-xl border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:border-emerald-400"
                  />
                )}

                {imageType === 'file' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="text-xs text-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30"
                    />
                    {imageFilePreview && (
                      <img src={imageFilePreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-emerald-400" />
                    )}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/15">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-mono text-xs font-black tracking-wider uppercase shadow-lg hover:shadow-emerald-500/25 cursor-pointer"
                >
                  Save & Publish to MongoDB
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* EVENTS DYNAMIC LIST: RENDER ONLY LIVE EVENTS FROM MONGODB DATABASE       */}
      {/* ========================================================================= */}
      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id || evt._id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-outline-variant/15 hover:border-emerald-500/40 transition-all duration-300 relative group shadow-lg overflow-hidden"
            >
              {/* Banner Thumbnail Image */}
              <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl border-b border-outline-variant/15 group/banner">
                <img
                  src={evt.image || PRESET_COVERS[0].url}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-black/20 to-black/50" />

                {/* Category & Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-extrabold px-3 py-1 rounded-lg backdrop-blur-md bg-black/60 text-white border border-white/20">
                    {(evt.category || 'Concert').toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md bg-gradient-to-r from-emerald-500/80 via-teal-500/80 to-tertiary/80 text-white border border-emerald-300/40 flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                    <span>MongoDB Live Event</span>
                  </span>
                </div>

                {/* Admin Delete Action */}
                {isAdminLoggedIn && onDeleteEvent && (
                  <button
                    onClick={() => onDeleteEvent(evt.id || evt._id)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/80 text-white hover:bg-red-600 backdrop-blur-md transition-all shadow-lg opacity-0 group-hover:opacity-100"
                    title="Delete Event from MongoDB"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Header: Date + Title */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl text-center border font-sans font-extrabold text-sm bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                      {evt.date || 'UPCOMING'}
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-lg text-on-surface mt-0.5 leading-tight group-hover:text-emerald-400 transition-colors">
                        {evt.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="font-body text-sm text-on-surface-variant leading-relaxed min-h-[48px]">
                  {evt.description || 'A creative concert organized by the Alaap music community.'}
                </p>

                {/* Metadata: Time & Location */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/10">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="font-mono">{evt.time || '7:00 PM - 9:00 PM'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <MapPin className="w-3.5 h-3.5 text-tertiary" />
                    <span className="font-sans">{evt.location || 'Central Auditorium'}</span>
                  </div>
                </div>
              </div>

              {/* Footer Info & Register Button */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-outline-variant/10 gap-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-outline">
                  <Users className="w-3.5 h-3.5" />
                  <span>{evt.attendeesCount || 1} Attending</span>
                </div>

                <a
                  href={evt.formUrl || 'https://forms.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-tertiary text-slate-950 font-mono text-xs font-black tracking-wider uppercase shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer border-none"
                >
                  <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Register</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* EMPTY STATE WHEN NO MONGODB EVENTS EXIST */
        <div className="glass-card rounded-3xl p-12 text-center border border-outline-variant/15 max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-sans font-bold text-xl text-on-surface mb-2">No MongoDB Events Found</h3>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6">
            There are currently no events saved in your MongoDB database. All hardcoded/cached fallback events have been cleared.
          </p>
          {isAdminLoggedIn ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-mono text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 hover:bg-emerald-400 transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create First MongoDB Event</span>
            </button>
          ) : (
            <p className="font-mono text-xs text-outline">
              Log in as an Admin to publish live events.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
