const express = require('express');
const router = express.Router();
const { getJobs, getMyJobs, createJob, getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.route('/').get(getJobs).post(protect, createJob);
router.get('/me', protect, getMyJobs);
router.route('/:id').get(getJobById).put(protect, updateJob).delete(protect, deleteJob);

module.exports = router;
