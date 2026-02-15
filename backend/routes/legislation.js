const express = require('express');
const router = express.Router();
const {
  createLegislation,
  getAllLegislations,
  getLegislationById,
  updateLegislation,
  deleteLegislation,
  getOpenLegislations
} = require('../controllers/legislationController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllLegislations);
router.get('/status/open', getOpenLegislations);
router.get('/:id', getLegislationById);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createLegislation);
router.put('/:id', protect, authorize('admin'), updateLegislation);
router.delete('/:id', protect, authorize('admin'), deleteLegislation);

module.exports = router;