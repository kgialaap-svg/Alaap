import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

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
      id: `evt_${Date.now()}`,
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

export default router;

