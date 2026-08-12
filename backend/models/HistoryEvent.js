import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  },
  url: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const HistoryEventSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => `h_${Date.now()}`
    },
    year: {
      type: String,
      required: [true, 'History event year is required'],
      trim: true,
      default: () => new Date().getFullYear().toString()
    },
    title: {
      type: String,
      required: [true, 'History event title is required'],
      trim: true
    },
    subtitle: {
      type: String,
      default: 'Alaap History Milestone Event',
      trim: true
    },
    description: {
      type: String,
      default: 'Special performance and community gathering captured in the Alaap archives.',
      trim: true
    },
    tag: {
      type: String,
      default: 'CONCERT',
      uppercase: true,
      trim: true
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
    },
    photos: [PhotoSchema],
    createdBy: {
      type: String,
      default: 'Club Admin'
    }
  },
  {
    timestamps: true
  }
);

// Format JSON response converting _id cleanly
HistoryEventSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const HistoryEvent = mongoose.models.HistoryEvent || mongoose.model('HistoryEvent', HistoryEventSchema);

export default HistoryEvent;
