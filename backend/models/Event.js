import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => `evt_${Date.now()}`
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Concert', 'Showcase', 'Social', 'Workshop', 'Jam Session'],
      default: 'Concert'
    },
    description: {
      type: String,
      default: 'A creative concert organized by the Alaap music community.'
    },
    date: {
      type: String,
      required: [true, 'Card date string is required (e.g. OCT 15)'],
      trim: true
    },
    fullDate: {
      type: String,
      default: ''
    },
    isoDate: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: '7:00 PM - 9:00 PM'
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
    },
    formUrl: {
      type: String,
      default: 'https://forms.google.com'
    },
    attendeesCount: {
      type: Number,
      default: 1,
      min: 0
    },
    isProgrammerEvent: {
      type: Boolean,
      default: false
    },
    accentColor: {
      type: String,
      default: 'primary'
    },
    createdBy: {
      type: String,
      default: 'Club Admin'
    }
  },
  {
    timestamps: true
  }
);

// Format output to convert _id to id cleanly
EventSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

export default Event;
