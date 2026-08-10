import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X,
  ExternalLink,
  Sparkles,
  Music,
  Radio,
  Calendar as CalendarIcon
} from 'lucide-react';

const MONTH_FULL_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_ABBR = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function DatesTab({ events = [], onDeleteBooking, isAdminLoggedIn }) {
  // Calendar Month & Year State (Defaults to August 2026 for Alaap events context)
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(7); // 0-indexed (7 = August)
  const [selectedDateCell, setSelectedDateCell] = useState(null);

  // Today Date Variables
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  // Single unified events list for calendar display
  const combinedItems = events.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    displayDate: e.date || 'UPCOMING',
    date: e.isoDate || (e.date && e.date.includes('-') ? e.date : ''),
    fullDate: e.fullDate,
    time: e.time || '7:00 PM - 9:00 PM',
    location: e.location || 'Campus Stage',
    type: 'live_event',
    category: e.category || 'Concert',
    isEvent: true,
    formUrl: e.formUrl,
    attendeesCount: e.attendeesCount
  }));

  // Helper to parse/match items to calendar day cells
  const getEventsForDay = (year, monthIndex, dayNumber) => {
    return combinedItems.filter(item => {
      // 1. Match ISO date string (YYYY-MM-DD)
      if (item.date && item.date.includes('-')) {
        const parts = item.date.split('-');
        if (parts.length === 3) {
          const bYear = parseInt(parts[0], 10);
          const bMonth = parseInt(parts[1], 10) - 1;
          const bDay = parseInt(parts[2], 10);
          return bYear === year && bMonth === monthIndex && bDay === dayNumber;
        }
      }

      // 2. Match displayDate (e.g. "AUG 15", "SEP 10", "AUG 14")
      const dateString = item.displayDate || item.date;
      if (dateString) {
        const currentAbbr = MONTH_ABBR[monthIndex];
        const parts = dateString.toUpperCase().trim().split(' ');
        if (parts.length === 2 && parts[0] === currentAbbr && parseInt(parts[1], 10) === dayNumber) {
          return true;
        }
      }

      // 3. Fallback Date object parsing from fullDate or date
      const dObj = new Date(item.date || item.fullDate);
      if (!isNaN(dObj.getTime())) {
        return dObj.getFullYear() === year && dObj.getMonth() === monthIndex && dObj.getDate() === dayNumber;
      }

      return false;
    });
  };

  // Calendar Grid Generation
  const generateCalendarDays = (year, monthIndex) => {
    const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

    const cells = [];

    // Previous month padding
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        month: monthIndex - 1,
        year
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        isCurrentMonth: true,
        month: monthIndex,
        year
      });
    }

    // Next month padding
    const totalSoFar = cells.length;
    const targetLength = totalSoFar > 35 ? 42 : 35;
    for (let n = 1; n <= targetLength - totalSoFar; n++) {
      cells.push({
        day: n,
        isCurrentMonth: false,
        month: monthIndex + 1,
        year
      });
    }

    return cells;
  };

  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  // Change Month Navigation
  const changeMonth = (delta) => {
    let newM = currentMonth + delta;
    let newY = currentYear;
    if (newM > 11) {
      newM = 0;
      newY += 1;
    } else if (newM < 0) {
      newM = 11;
      newY -= 1;
    }
    setCurrentMonth(newM);
    setCurrentYear(newY);
    setSelectedDateCell(null);
  };

  const goToToday = () => {
    setCurrentYear(todayYear);
    setCurrentMonth(todayMonth);
    setSelectedDateCell(null);
  };

  // Click on Calendar Day Square to filter date
  const handleCellClick = (cell) => {
    if (!cell.isCurrentMonth) return;
    setSelectedDateCell(cell);
  };

  // Filter Bookings & Events List by Selected Day or Show All Upcoming
  const filteredItems = selectedDateCell
    ? getEventsForDay(currentYear, currentMonth, selectedDateCell.day)
    : combinedItems.filter((b) => {
        if (!b.date) return true;
        const bDate = new Date(b.date);
        if (isNaN(bDate.getTime())) return true;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return bDate >= now;
      });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 select-none">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span className="text-xs font-mono text-tertiary uppercase tracking-widest font-black">
              Interactive Events & Studio Calendar
            </span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-black text-on-surface tracking-tight">
            Upcoming Events & Schedules
          </h2>
          <p className="text-on-surface-variant font-body text-sm mt-1 max-w-xl">
            Live campus concerts and studio rehearsals synchronized inside an interactive monthly calendar.
          </p>
        </div>

        {/* Legend Badges */}
        <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono font-bold">
          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3" /> Live Concert
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30 flex items-center gap-1.5 shadow-sm">
            <Music className="w-3 h-3" /> Showcase
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
            <Radio className="w-3 h-3" /> Rehearsal
          </span>
        </div>
      </div>

      {/* ULTRA-AESTHETIC CALENDAR GLASS CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-5 sm:p-7 border border-outline-variant/20 shadow-2xl relative mb-10 overflow-hidden"
      >
        {/* Top Vibrant Glowing Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 via-tertiary to-emerald-400 shadow-[0_0_15px_rgba(236,72,153,0.6)]" />

        {/* Calendar Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-outline-variant/15">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-tertiary/20 via-purple-500/15 to-emerald-500/20 border border-tertiary/40 flex items-center justify-center text-tertiary shadow-lg shadow-tertiary/10">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-sans font-black text-2xl sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-emerald-300 tracking-tight">
                {MONTH_FULL_NAMES[currentMonth]} <span className="text-on-surface/90 font-light">{currentYear}</span>
              </h3>
              <p className="text-xs font-mono text-on-surface-variant/80 mt-0.5">
                Click any day cell to filter events for that date
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-2.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-all duration-200 cursor-pointer border border-outline-variant/30 hover:scale-105 active:scale-95 shadow-md"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={goToToday}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-tertiary/20 to-primary/20 hover:from-tertiary/30 hover:to-primary/30 text-on-surface font-mono text-xs font-black border border-tertiary/30 transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-2.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-all duration-200 cursor-pointer border border-outline-variant/30 hover:scale-105 active:scale-95 shadow-md"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating Days of Week Pill Headers */}
        <div className="grid grid-cols-7 gap-2 text-center mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div 
              key={day} 
              className="py-2 bg-surface-container-high/40 border border-outline-variant/15 rounded-xl font-mono text-[10px] font-black text-tertiary uppercase tracking-widest shadow-inner"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Day Cells Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${currentYear}-${currentMonth}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-7 gap-2 sm:gap-2.5"
          >
            {calendarDays.map((cell, idx) => {
              const isToday = cell.isCurrentMonth && cell.day === todayDate && currentMonth === todayMonth && currentYear === todayYear;
              const isSelected = selectedDateCell && selectedDateCell.year === currentYear && selectedDateCell.month === currentMonth && selectedDateCell.day === cell.day;
              const dayEvents = cell.isCurrentMonth ? getEventsForDay(currentYear, currentMonth, cell.day) : [];
              const hasEvents = dayEvents.length > 0;

              return (
                <div
                  key={idx}
                  onClick={() => handleCellClick(cell)}
                  className={`min-h-[95px] sm:min-h-[115px] p-2 sm:p-2.5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative group ${
                    !cell.isCurrentMonth
                      ? 'opacity-20 bg-surface-container-lowest/20 border-transparent cursor-default'
                      : isSelected
                      ? 'bg-gradient-to-br from-pink-500/25 via-tertiary/20 to-surface-container border-pink-500 ring-2 ring-pink-500/50 shadow-[0_0_25px_rgba(236,72,153,0.35)] scale-[1.02] z-10'
                      : isToday
                      ? 'bg-gradient-to-br from-primary/25 via-surface-container-high/80 to-surface-container border-primary ring-2 ring-primary/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10'
                      : hasEvents
                      ? 'bg-gradient-to-br from-tertiary/10 via-purple-500/10 to-surface-container-high/90 border-tertiary/40 hover:border-tertiary hover:scale-[1.03] hover:z-20 shadow-md hover:shadow-tertiary/20'
                      : 'bg-surface-container/60 border-outline-variant/15 hover:border-outline-variant/40 hover:bg-surface-container-high hover:scale-[1.02]'
                  }`}
                >
                  {/* Day Header Badge */}
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-mono font-black rounded-xl px-2 py-0.5 transition-all ${
                      isToday
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-black'
                        : isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-tertiary text-slate-950 shadow-md font-black'
                        : hasEvents
                        ? 'bg-tertiary/20 text-pink-300 font-extrabold border border-tertiary/30'
                        : 'text-on-surface-variant'
                    }`}>
                      {cell.day}
                    </span>

                    {hasEvents && (
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-mono font-extrabold text-tertiary">
                          {dayEvents.length}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                      </div>
                    )}
                  </div>

                  {/* EVENTS & SCHEDULES RENDERED INSIDE DAY CELL SQUARE */}
                  <div className="space-y-1.5 overflow-y-auto max-h-[65px] scrollbar-none pt-0.5">
                    {dayEvents.map(evt => (
                      <div
                        key={evt.id}
                        className={`px-2 py-0.5 rounded-xl text-[9px] font-mono font-bold line-clamp-1 border transition-all duration-200 flex items-center gap-1 shadow-sm ${
                          evt.isEvent
                            ? 'bg-gradient-to-r from-emerald-500/25 to-teal-500/20 text-emerald-300 border-emerald-500/40 hover:border-emerald-400'
                            : evt.type === 'performance'
                            ? 'bg-gradient-to-r from-pink-500/25 to-purple-500/20 text-pink-300 border-pink-500/40 hover:border-pink-400'
                            : 'bg-gradient-to-r from-blue-500/25 to-indigo-500/20 text-cyan-300 border-cyan-500/40 hover:border-cyan-400'
                        }`}
                        title={`${evt.title} (${evt.time || 'Scheduled'}) — ${evt.isEvent ? 'Live Concert' : 'Studio Schedule'}`}
                      >
                        {evt.isEvent ? (
                          <Sparkles className="w-2.5 h-2.5 shrink-0 text-emerald-400" />
                        ) : evt.type === 'performance' ? (
                          <Music className="w-2.5 h-2.5 shrink-0 text-pink-400" />
                        ) : (
                          <Radio className="w-2.5 h-2.5 shrink-0 text-cyan-400" />
                        )}
                        <span className="truncate">{evt.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
