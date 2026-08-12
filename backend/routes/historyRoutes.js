import express from 'express';
import HistoryEvent from '../models/HistoryEvent.js';

const router = express.Router();

// @route   GET /api/history
// @desc    Get all history events directly from MongoDB Atlas database
// @access  Public
router.get('/', async (req, res) => {
  try {
    const historyEvents = await HistoryEvent.find().sort({ year: -1, createdAt: -1 });
    return res.status(200).json({ success: true, count: historyEvents.length, data: historyEvents });
  } catch (error) {
    console.error('Error fetching history events from MongoDB:', error.message);
    return res.status(500).json({ success: false, data: [], error: error.message });
  }
});

// @route   POST /api/history
// @desc    Admin & Super Admin Endpoint: Create & host a new history event in MongoDB
// @access  Admin / Super Admin
router.post('/', async (req, res) => {
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

// @route   PUT /api/history/:id
// @desc    Update a history milestone in MongoDB
// @access  Admin / Super Admin
router.put('/:id', async (req, res) => {
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

// @route   DELETE /api/history/:id
// @desc    Delete a history milestone event from MongoDB
// @access  Admin / Super Admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await HistoryEvent.findOneAndDelete({ id });
    return res.status(200).json({ success: true, message: `History event ${id} deleted successfully from MongoDB.` });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/history
// @desc    Clear all history events from MongoDB
// @access  Admin / Super Admin
router.delete('/', async (req, res) => {
  try {
    await HistoryEvent.deleteMany({});
    return res.status(200).json({ success: true, message: 'All history events cleared from MongoDB.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/history/:id/photos
// @desc    Add a photo to a specific history event milestone in MongoDB
// @access  Admin / Super Admin
router.post('/:id/photos', async (req, res) => {
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

// @route   DELETE /api/history/:id/photos/:photoId
// @desc    Delete a photo from a specific history event milestone in MongoDB
// @access  Admin / Super Admin
router.delete('/:id/photos/:photoId', async (req, res) => {
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
