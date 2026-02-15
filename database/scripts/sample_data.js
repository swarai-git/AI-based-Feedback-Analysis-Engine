const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

// Import models
const Legislation = require('../backend/models/Legislation');
const Feedback = require('../backend/models/Feedback');
const User = require('../backend/models/User');

const sampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - for testing only)
    await Legislation.deleteMany({});
    await Feedback.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample legislation
    const legislation1 = await Legislation.create({
      title: 'Environmental Protection Amendment Act 2026',
      description: 'This act aims to strengthen environmental protection measures and reduce carbon emissions.',
      department: 'Ministry of Environment',
      status: 'open',
      deadline: new Date('2026-03-31'),
      draftUrl: 'https://example.gov.in/draft-act-2026.pdf'
    });

    const legislation2 = await Legislation.create({
      title: 'Digital Privacy and Data Protection Bill',
      description: 'A comprehensive framework for digital privacy and protection of personal data.',
      department: 'Ministry of Electronics and IT',
      status: 'open',
      deadline: new Date('2026-04-15'),
      draftUrl: 'https://example.gov.in/privacy-bill.pdf'
    });

    console.log('✅ Sample legislations created');

    // Create sample feedbacks
    const feedbacks = [
      {
        legislationId: legislation1._id,
        submitterName: 'Rajesh Kumar',
        submitterEmail: 'rajesh.kumar@example.com',
        commentText: 'This is an excellent initiative. However, I suggest adding more specific targets for renewable energy adoption.',
        provision: 'Section 4 - Renewable Energy Targets',
        source: 'portal'
      },
      {
        legislationId: legislation1._id,
        submitterName: 'Priya Sharma',
        submitterEmail: 'priya.sharma@example.com',
        commentText: 'I strongly support this amendment. The penalties for violations should be increased to ensure compliance.',
        provision: 'Section 7 - Penalties and Enforcement',
        source: 'portal'
      },
      {
        legislationId: legislation1._id,
        submitterName: 'Amit Patel',
        submitterEmail: 'amit.patel@example.com',
        commentText: 'The implementation timeline is too aggressive. Small businesses need more time to adapt to these changes.',
        provision: 'Section 3 - Implementation Timeline',
        source: 'portal'
      },
      {
        legislationId: legislation2._id,
        submitterName: 'Sneha Reddy',
        submitterEmail: 'sneha.reddy@example.com',
        commentText: 'The data localization requirements are problematic for multinational companies. This needs reconsideration.',
        provision: 'Section 12 - Data Localization',
        source: 'portal'
      },
      {
        legislationId: legislation2._id,
        submitterName: 'Vikram Singh',
        submitterEmail: 'vikram.singh@example.com',
        commentText: 'Excellent bill! Please also include provisions for protecting children online.',
        provision: 'General Comments',
        source: 'portal'
      }
    ];

    await Feedback.insertMany(feedbacks);
    console.log('✅ Sample feedbacks created');

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@gov.in',
      password: 'admin123', // Will be hashed by the pre-save hook
      role: 'admin'
    });

    console.log('✅ Admin user created');
    console.log('📧 Admin email: admin@gov.in');
    console.log('🔑 Admin password: admin123');

    console.log('\n✨ Sample data created successfully!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    process.exit(1);
  }
};

sampleData();