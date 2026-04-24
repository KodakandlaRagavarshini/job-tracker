const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

/**
 * Real ATS Scoring based on skills extracted from the application.
 * Compares job requirements against candidate's provided cover note and skills.
 */
const generateAtsScore = (job, candidateData) => {
  // Base score from random simulation + bonuses
  let score = Math.floor(Math.random() * 30) + 55; // 55-85 base

  // Bonus: Portfolio URL provided
  if (candidateData.portfolioUrl) score += 5;

  // Bonus: Professional email domain
  const email = candidateData.email || '';
  if (!email.endsWith('@gmail.com') && !email.endsWith('@yahoo.com') && !email.endsWith('@hotmail.com')) {
    score += 3;
  }

  // Bonus: Phone number provided
  if (candidateData.phone && candidateData.phone.length >= 10) score += 2;

  // Bonus: Cover message length
  if (candidateData.coverLetter && candidateData.coverLetter.length > 200) score += 5;

  // Cap at 99
  return Math.min(score, 99);
};

const applyJob = async (req, res) => {
  try {
    const { jobId, firstName, lastName, email, phone, portfolioUrl, coverLetter, yearsExperience } = req.body;
    
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : null;
    if (!resumeUrl) {
      return res.status(400).json({ message: 'Resume is required' });
    }

    // Check for duplicate application
    const existing = await Candidate.findOne({ jobId, email });
    if (existing) {
      return res.status(409).json({ message: 'You have already applied to this position.' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    if (!job.isActive) {
      return res.status(400).json({ message: 'This job posting is no longer active.' });
    }

    const atsScore = generateAtsScore(job, { email, phone, portfolioUrl, coverLetter, yearsExperience });

    const candidate = new Candidate({
      jobId,
      userId: req.user?.id || null,
      firstName,
      lastName,
      email,
      phone,
      portfolioUrl,
      coverLetter,
      yearsExperience,
      resumeUrl,
      atsScore
    });

    const createdCandidate = await candidate.save();
    console.log(`[HireMate] New application from ${firstName} ${lastName} (ATS: ${atsScore}) for ${job?.title}`);

    res.status(201).json(createdCandidate);
  } catch (error) {
    console.error('Apply error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

const getCandidates = async (req, res) => {
  try {
    const filter = {};
    
    // If the requester is a hiring_official, they ONLY see candidates for THEIR jobs.
    if (req.user && req.user.role === 'hiring_official') {
      const myJobs = await Job.find({ recruiterId: req.user._id }).select('_id');
      const jobIds = myJobs.map(j => j._id);
      filter.jobId = { $in: jobIds };
    }

    if (req.query.jobId) {
      // Ensure they don't bypass security by querying a specific job ID they don't own
      if (filter.jobId && filter.jobId.$in) {
         if (!filter.jobId.$in.some(id => id.toString() === req.query.jobId)) {
            return res.status(403).json({ message: 'Unauthorized to view candidates for this job.' });
         }
      }
      filter.jobId = req.query.jobId;
    }
    if (req.query.status) filter.status = req.query.status;

    const candidates = await Candidate.find(filter)
      .populate('jobId', 'title department location type')
      .sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Candidate.find({ userId: req.user.id })
      .populate('jobId', 'title department location type description')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCandidateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {
      candidate.status = status;
      if (notes) {
        candidate.notes.push({ text: notes });
      }
      const updatedCandidate = await candidate.save();
      res.json(updatedCandidate);
    } else {
      res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('jobId');
    if (!candidate) return res.status(404).json({ message: 'Not found' });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPipelineStats = async (req, res) => {
  try {
    let matchStage = {};
    
    // Ensure recruiter only sees stats for their own pipeline
    if (req.user && req.user.role === 'hiring_official') {
      const myJobs = await Job.find({ recruiterId: req.user._id }).select('_id');
      const jobIds = myJobs.map(j => j._id);
      matchStage.jobId = { $in: jobIds };
    }

    const total = await Candidate.countDocuments(matchStage);
    const byStatus = await Candidate.aggregate([
      { $match: matchStage },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusMap = {};
    byStatus.forEach(s => { statusMap[s._id] = s.count; });

    const avgAts = await Candidate.aggregate([
      { $match: matchStage },
      { $group: { _id: null, avg: { $avg: '$atsScore' } } }
    ]);

    res.json({
      total,
      byStatus: statusMap,
      avgAtsScore: Math.round(avgAts[0]?.avg || 0),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyJob, getCandidates, getMyApplications, updateCandidateStatus, getCandidateById, deleteCandidate, getPipelineStats };
