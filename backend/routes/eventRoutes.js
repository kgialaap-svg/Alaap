import express from 'express';
import Event from '../models/Event.js';
import HistoryEvent from '../models/HistoryEvent.js';

const router = express.Router();

// ============================================================================
// 1. STANDARD CAMPUS EVENTS ENDPOINTS (/api/events)
// ============================================================================

// @route   GET /api/events
// @desc    Get all hosted events directly from MongoDB database
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    console.error('Error fetching events from MongoDB:', error.message);
    res.status(500).json({ success: false, data: [], error: error.message });
  }
});

// @route   POST /api/events
// @desc    Admin & Super Admin Endpoint: Create & directly host a new event to MongoDB
// @access  Admin / Super Admin
router.post('/', async (req, res) => {
  try {
    const { title, category, description, date, fullDate, time, location, image, formUrl, attendeesCount, createdBy } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({
        success: false,
        error: 'Please provide event title, date, and location'
      });
    }

    const newEventData = {
      id: req.body.id || `evt_${Date.now()}`,
      title: title.trim(),
      category: category || 'Concert',
      description: description ? description.trim() : 'A creative concert organized by the Alaap music community.',
      date: date.toUpperCase().trim(),
      fullDate: fullDate || '',
      time: time || '7:00 PM - 9:00 PM',
      location: location.trim(),
      image: image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
      formUrl: formUrl ? formUrl.trim() : 'https://forms.google.com',
      attendeesCount: Math.max(0, parseInt(attendeesCount) || 1),
      isProgrammerEvent: false,
      accentColor: category === 'Concert' || category === 'Social' ? 'primary' : 'tertiary',
      createdBy: createdBy || 'Club Admin'
    };

    const created = await Event.create(newEventData);
    return res.status(201).json({
      success: true,
      message: '🚀 New event created & hosted live to website visitors!',
      data: created
    });
  } catch (error) {
    console.error('Error saving event to MongoDB:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event in MongoDB (Admin & Super Admin)
// @access  Admin / Super Admin
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Event.findOneAndUpdate({ id }, updates, { new: true, runValidators: true });
    if (updated) {
      return res.status(200).json({ success: true, data: updated });
    }
    return res.status(404).json({ success: false, error: 'Event not found in MongoDB database.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event from MongoDB (Super Admin / Admin)
// @access  Admin / Super Admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findOneAndDelete({ id });
    res.status(200).json({ success: true, message: `Event ${id} deleted successfully from MongoDB.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// 2. HISTORY MILESTONE EVENTS SUB-ROUTES (/api/events/history)
// ============================================================================

// @route   GET /api/events/history
// @desc    Get all history events directly from MongoDB Atlas database
router.get('/history', async (req, res) => {
  try {
    const historyEvents = await HistoryEvent.find().sort({ year: -1, createdAt: -1 });
    return res.status(200).json({ success: true, count: historyEvents.length, data: historyEvents });
  } catch (error) {
    console.error('Error fetching history events from MongoDB:', error.message);
    return res.status(500).json({ success: false, data: [], error: error.message });
  }
});

// @route   POST /api/events/history
// @desc    Admin & Super Admin Endpoint: Create & host a new history event in MongoDB
router.post('/history', async (req, res) => {
  try {
    const { title, subtitle, year, tag, description, image, photos, createdBy } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Please provide history event title'
      });
    }

    const defaultCover = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800';
    const finalCover = image || defaultCover;

    const initialPhotos = photos && Array.isArray(photos) && photos.length > 0
      ? photos
      : [
          {
            id: `p_${Date.now()}`,
            url: finalCover,
            caption: subtitle || title
          }
        ];

    const newHistoryData = {
      id: req.body.id || `h_${Date.now()}`,
      year: year ? String(year).trim() : new Date().getFullYear().toString(),
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : 'Alaap History Milestone Event',
      description: description ? description.trim() : 'Special performance and community gathering captured in the Alaap archives.',
      tag: tag ? String(tag).toUpperCase().trim() : 'CONCERT',
      image: finalCover,
      photos: initialPhotos,
      createdBy: createdBy || 'Club Admin'
    };

    const created = await HistoryEvent.create(newHistoryData);
    return res.status(201).json({
      success: true,
      message: '🚀 New history milestone event registered to MongoDB Atlas!',
      data: created
    });
  } catch (error) {
    console.error('Error saving history event to MongoDB:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/events/history/:id
// @desc    Update a history milestone in MongoDB
router.put('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await HistoryEvent.findOneAndUpdate({ id }, updates, { new: true, runValidators: true });
    if (updated) {
      return res.status(200).json({ success: true, data: updated });
    }
    return res.status(404).json({ success: false, error: 'History event not found in MongoDB database.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/events/history/:id
// @desc    Delete a history milestone event from MongoDB
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await HistoryEvent.findOneAndDelete({ id });
    return res.status(200).json({ success: true, message: `History event ${id} deleted successfully from MongoDB.` });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/events/history
// @desc    Clear all history events from MongoDB
router.delete('/history', async (req, res) => {
  try {
    await HistoryEvent.deleteMany({});
    return res.status(200).json({ success: true, message: 'All history events cleared from MongoDB.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/events/history/:id/photos
// @desc    Add a photo to a specific history event milestone in MongoDB
router.post('/history/:id/photos', async (req, res) => {
  try {
    const { id } = req.params;
    const { url, caption } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'Photo URL is required' });
    }

    const newPhoto = {
      id: req.body.id || `p_${Date.now()}`,
      url: url.trim(),
      caption: caption ? caption.trim() : 'Event photo memory',
      uploadedAt: new Date()
    };

    const updated = await HistoryEvent.findOneAndUpdate(
      { id },
      { $push: { photos: { $each: [newPhoto], $position: 0 } } },
      { new: true }
    );

    if (updated) {
      return res.status(200).json({ success: true, data: updated });
    }
    return res.status(404).json({ success: false, error: 'History event milestone not found.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/events/history/:id/photos/:photoId
// @desc    Delete a photo from a specific history event milestone in MongoDB
router.delete('/history/:id/photos/:photoId', async (req, res) => {
  try {
    const { id, photoId } = req.params;

    const updated = await HistoryEvent.findOneAndUpdate(
      { id },
      { $pull: { photos: { id: photoId } } },
      { new: true }
    );

    if (updated) {
      return res.status(200).json({ success: true, data: updated });
    }
    return res.status(404).json({ success: false, error: 'History event milestone not found.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
