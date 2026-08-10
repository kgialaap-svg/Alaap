import { motion } from 'motion/react';
import { ArrowRight, Music, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';

export default function BentoGrid({ onTabChange, events = [] }) {
  // Prioritize active events from the Events section
  const activeEvents = events.filter((e) => {
    if (!e.fullDate && !e.isoDate) return true;
    const targetDate = e.isoDate ? new Date(e.isoDate) : new Date(e.fullDate);
    if (isNaN(targetDate.getTime())) return true;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return targetDate >= now;
  });

  const displayList = activeEvents.length > 0
    ? activeEvents.slice(0, 3)
    : (events.length > 0 ? events.slice(0, 3) : []);

  return (
    <section className="px-6 md:px-16 py-12 md:py-20 select-none">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* About Alaap Club Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-12 glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden group border border-outline-variant/20 shadow-2xl"
          >
            {/* Background Image with Dark Glass Overlay */}
            <div
              className="absolute inset-0 z-0 opacity-30 group-hover:scale-105 transition-transform duration-700 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60 z-10" />

            {/* Content */}
            <div className="relative z-20 space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs tracking-widest uppercase font-semibold">
                <Sparkles className="w-4 h-4" /> About Alaap Club
              </div>

              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-on-surface leading-tight">
                The Heartbeat of <span className="text-primary neon-glow-primary">Kashi Institute of Technology</span>
              </h2>

              <p className="font-body text-base text-on-surface-variant leading-relaxed">
                Alaap is a vibrant, student-led music community dedicated to empowering vocalists, instrumentalists. We provide the platform and collaborative ecosystem to bring your musical ideas to life.
                Our core mission is to nurture performance excellence, encourage collaborative artistry, and develop crucial stage management skills among our members. We believe in creating a holistic experience that transcends mere performance, focusing on the growth of each individual within our collective harmony.
              </p>
            </div>
          </motion.div>

          {/* Artist History Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => onTabChange('history')}
            className="md:col-span-4 glass-card p-6 rounded-2xl space-y-4 group cursor-pointer hover:bg-surface-container-high/60 hover:border-primary/20 transition-all duration-300 active:scale-98 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-full h-44 rounded-xl overflow-hidden relative border border-outline-variant/10">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ34DC0H3UZ4juzTwXK6uvsJxyzlkpednSWxXKooPXbFxmSsDxfgQlppwz1ioLtbdEsBIBHzs5w7NWHycDjHtIG80K9ZxEAs84cj6JG3FbwNTLkh0Cg3r2cNonxImOdiY-Luaz9D_2xeUjQVJrS1a0Jy-geLBdJDqqKlGj0hVW4arnkNMxrv3bXLEBvskgaRVY_W_dj2RD9Z-fGfxfOVazShqLhsFLbIbYDq0Emr55vT1wSPv6hxPeyh2erbEJD9nP-t4wjdMxGp5w"
                  alt="Vintage vinyl record spinning"
                />
                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md p-1.5 rounded-lg border border-outline-variant/10 text-primary">
                  <Music className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                  The History
                </h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  Tracing the echoes of our past performances and the evolution of the Alaap sound.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <span className="p-2 bg-primary/10 rounded-full text-primary group-hover:translate-x-1.5 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </motion.div>

          {/* Events Section Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-8 bg-tertiary-container/5 border border-tertiary/15 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center justify-between"
          >
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-mono text-tertiary tracking-widest uppercase font-semibold">Join the crowd</span>
                <h3 className="font-sans text-2xl font-extrabold text-tertiary neon-glow-tertiary">
                  Upcoming Events
                </h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed max-w-sm">
                  Don't miss the beat. From live concerts to stage takeovers and college showcases.
                </p>
              </div>
              <button
                onClick={() => onTabChange('events')}
                className="font-mono text-xs text-tertiary font-bold underline underline-offset-4 uppercase tracking-widest hover:text-tertiary-container transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>View All Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
              {displayList.length > 0 ? (
                displayList.map((item, index) => (
                  <div
                    key={item.id || index}
                    onClick={() => onTabChange('events')}
                    className="bg-surface-container-high/60 p-3.5 rounded-xl border border-outline-variant/15 text-center cursor-pointer hover:border-tertiary/30 hover:bg-surface-container-highest transition-all duration-300 group/date shadow-sm"
                    title={`View event: ${item.title}`}
                  >
                    <span className={`block font-sans font-extrabold text-base md:text-lg ${index % 2 === 0 ? 'text-tertiary' : 'text-primary'}`}>
                      {item.date || item.displayDate || 'UPCOMING'}
                    </span>
                    <span className="font-body text-xs text-on-surface-variant line-clamp-1 group-hover/date:text-on-surface transition-colors font-medium">
                      {item.title}
                    </span>
                    {item.category && (
                      <span className="text-[9px] font-mono text-outline uppercase block mt-1">
                        {item.category}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div
                  onClick={() => onTabChange('events')}
                  className="col-span-full bg-surface-container-high/40 p-4 rounded-xl border border-dashed border-outline-variant/30 text-center cursor-pointer hover:bg-surface-container-high transition-all"
                >
                  <p className="text-xs font-mono text-on-surface-variant font-semibold">No active events listed</p>
                  <span className="text-[10px] font-mono text-tertiary hover:underline mt-1 inline-block">
                    Explore Events Tab →
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
