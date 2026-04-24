require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('./models/User');
const Job = require('./models/Job');

const app = express();
app.use(cors(
  {
    origin: "https://job-tracker-delta-one.vercel.app",
    credentials:true
  }
));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const userRoutes = require('./routes/userRoutes');
const atsRoutes = require('./routes/atsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ats', atsRoutes);

const PORT = process.env.PORT || 5000;

const seedDatabase = async () => {
  const usersCount = await User.countDocuments();
  if (usersCount === 0) {
    console.log('Seeding initial data...');
    await User.create({
      name: 'Admin Recruiter',
      email: 'admin@hiremate.com',
      password: 'password123',
      role: 'hiring_official'
    });
    console.log('Seed complete! Recruiter admin@hiremate.com / password123');
  }

  const jobsCount = await Job.countDocuments();
  if (jobsCount < 5) {
    await Job.deleteMany({});
    const recruiter = await User.findOne({ email: 'admin@hiremate.com' }) || await User.findOne({ role: 'hiring_official' });
    
    if (recruiter) {
      await Job.insertMany([
        { title: 'Senior Frontend React Engineer', department: 'Engineering', location: 'San Francisco, CA (Hybrid)', type: 'Full-Time', description: 'Architect Next.js applications and lead our core web team. Deep expertise in React, framer-motion, and Tailwind required.', recruiterId: recruiter._id },
        { title: 'Product Designer (UX/UI)', department: 'Design', location: 'Remote', type: 'Full-Time', description: 'Craft world-class digital experiences across web and mobile. Figma expertise is mandatory.', recruiterId: recruiter._id },
        { title: 'Machine Learning Scientist', department: 'Data / AI', location: 'New York, NY', type: 'Full-Time', description: 'Train foundational models for our internal NLP services. Requires Python, PyTorch, and CUDA experience.', recruiterId: recruiter._id },
        { title: 'Backend Node.js Developer', department: 'Engineering', location: 'Remote', type: 'Contract', description: 'Build scalable REST APIs and microservices. Must know Express, MongoDB, and AWS.', recruiterId: recruiter._id },
        { title: 'VP of Product Management', department: 'Product', location: 'London, UK', type: 'Full-Time', description: 'Define the roadmap for our flagship SaaS platform. Prior B2B SaaS experience required.', recruiterId: recruiter._id },
        { title: 'DevOps & Infrastructure Lead', department: 'Engineering', location: 'Austin, TX', type: 'Full-Time', description: 'Manage Kubernetes clusters and automate deployment pipelines using Terraform and GitHub Actions.', recruiterId: recruiter._id },
        { title: 'Senior Technical Recruiter', department: 'HR', location: 'Remote', type: 'Full-Time', description: 'Source elite technical talent globally. Must be familiar with modern Applicant Tracking Systems.', recruiterId: recruiter._id },
        { title: 'Staff Data Analyst', department: 'Data / AI', location: 'Toronto, Canada', type: 'Full-Time', description: 'Transform raw data into strategic insights using SQL, Looker, and Tableau.', recruiterId: recruiter._id }
      ]);
      console.log('Seeded high-quality reference jobs!');
    }
  }
};

const startServer = async () => {
  let mongoUri = process.env.MONGO_URI;
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.log('Local MongoDB not found. Starting In-Memory MongoDB...');
    const mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('In-Memory MongoDB connected successfully at', mongoUri);
  }

  await seedDatabase();

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
