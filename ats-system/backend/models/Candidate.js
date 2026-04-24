const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  portfolioUrl: { type: String },
  coverLetter: { type: String },
  yearsExperience: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['New', 'Under Review', 'Shortlisted', 'Rejected'], 
    default: 'New' 
  },
  atsScore: { type: Number, default: 0 },
  notes: [{ text: String, date: { type: Date, default: Date.now } }]
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);
