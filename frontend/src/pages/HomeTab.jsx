import Hero from '../components/Hero';
import BentoGrid from '../components/BentoGrid';

export default function HomeTab({ onTabChange, events = [] }) {
  return (
    <div className="animate-fade-in">
      <Hero 
        onExploreClick={() => onTabChange('events')} 
      />
      
      <BentoGrid 
        events={events}
        onTabChange={onTabChange} 
      />
    </div>
  );
}
