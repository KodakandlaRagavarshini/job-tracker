require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Job = require('./models/Job');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding');

    await User.deleteMany();
    await Job.deleteMany();

    // Create recruiter/admin user first
    const admin = await User.create({
      name: 'Admin Recruiter',
      email: 'admin@hiremate.com',
      password: 'password123',
      role: 'admin'
    });

    console.log('Recruiter admin@hiremate.com / password123 created');

    // Create jobs with recruiterId
    await Job.insertMany([
      {
        title: 'Senior Full Stack Engineer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-Time',
        description: 'Build scalable web applications.',
        recruiterId: admin._id
      },
      {
        title: 'Product Designer',
        department: 'Design',
        location: 'Remote',
        type: 'Full-Time',
        description: 'Design beautiful, intuitive interfaces.',
        recruiterId: admin._id
      }
    ]);

    console.log('Dummy jobs created successfully');

    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });