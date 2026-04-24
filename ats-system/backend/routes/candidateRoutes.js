const express = require('express');
const router = express.Router();
const { 
  applyJob, getCandidates, getMyApplications, 
  updateCandidateStatus, getCandidateById, deleteCandidate, getPipelineStats 
} = require('../controllers/candidateController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/apply', protect, upload.single('resume'), applyJob);
router.get('/my-applications', protect, getMyApplications);
router.get('/stats/pipeline', protect, getPipelineStats);
router.get('/', protect, getCandidates);
router.route('/:id')
  .get(protect, getCandidateById)
  .delete(protect, deleteCandidate);
router.put('/:id/status', protect, updateCandidateStatus);

module.exports = router;
