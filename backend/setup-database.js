const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Legislation = require('./models/Legislation');
const Feedback = require('./models/Feedback');
const User = require('./models/User');

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');

    // Create indexes
    console.log('\n📊 Creating database indexes...');
    const db = mongoose.connection.db;

    await db.collection('feedbacks').createIndex({ legislationId: 1, submittedAt: -1 });
    await db.collection('feedbacks').createIndex({ submitterEmail: 1 });
    await db.collection('analysisresults').createIndex({ feedbackId: 1 });
    await db.collection('analysisresults').createIndex({ sentiment: 1 });
    await db.collection('analysisresults').createIndex({ priority: 1 });
    await db.collection('legislations').createIndex({ status: 1 });
    await db.collection('legislations').createIndex({ deadline: 1 });

    console.log('✅ Database indexes created successfully');

    // Clear existing data (for fresh setup)
    console.log('\n🗑️  Clearing existing data...');
    await Legislation.deleteMany({});
    await Feedback.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Data cleared');

    // Create sample legislation
    console.log('\n📝 Creating sample legislations...');
    const legislation1 = await Legislation.create({
      title: 'Environmental Protection Amendment Act 2026',
      description: 'This act aims to strengthen environmental protection measures and reduce carbon emissions by setting ambitious targets for renewable energy adoption and implementing stricter penalties for environmental violations.',
      department: 'Ministry of Environment, Forest and Climate Change',
      status: 'open',
      deadline: new Date('2026-03-31'),
      draftUrl: 'https://example.gov.in/draft-environment-act-2026.pdf'
    });

    const legislation2 = await Legislation.create({
      title: 'Digital Privacy and Data Protection Bill 2026',
      description: 'A comprehensive framework for digital privacy and protection of personal data of Indian citizens, including provisions for data localization, consent mechanisms, and penalties for data breaches.',
      department: 'Ministry of Electronics and Information Technology',
      status: 'open',
      deadline: new Date('2026-04-15'),
      draftUrl: 'https://example.gov.in/digital-privacy-bill-2026.pdf'
    });

    const legislation3 = await Legislation.create({
      title: 'National Education Policy Amendment 2026',
      description: 'Proposed amendments to the National Education Policy focusing on digital literacy, vocational training, and making education more inclusive and accessible.',
      department: 'Ministry of Education',
      status: 'open',
      deadline: new Date('2026-05-01'),
      draftUrl: 'https://example.gov.in/nep-amendment-2026.pdf'
    });

    console.log('✅ Sample legislations created:', legislation1.title);
    console.log('✅ Sample legislations created:', legislation2.title);
    console.log('✅ Sample legislations created:', legislation3.title);

    // Create sample feedbacks for Environmental Act
    console.log('\n💬 Creating sample feedbacks...');
    const feedbacks = [
      {
        legislationId: legislation1._id,
        submitterName: 'Dr. Rajesh Kumar',
        submitterEmail: 'rajesh.kumar@example.com',
        commentText: 'This is an excellent initiative for environmental protection. However, I suggest adding more specific targets for renewable energy adoption in the industrial sector. The current targets seem ambitious but lack sector-specific implementation guidelines.',
        provision: 'Section 4 - Renewable Energy Targets',
        source: 'portal'
      },
      {
        legislationId: legislation1._id,
        submitterName: 'Priya Sharma',
        submitterEmail: 'priya.sharma@ngo.org',
        commentText: 'I strongly support this amendment. The penalties for environmental violations should be increased significantly to ensure compliance. We also need stronger monitoring mechanisms and regular audits of industrial units.',
        provision: 'Section 7 - Penalties and Enforcement',
        source: 'portal'
      },
      {
        legislationId: legislation1._id,
        submitterName: 'Amit Patel',
        submitterEmail: 'amit.patel@msme.in',
        commentText: 'The implementation timeline is too aggressive for small and medium enterprises. Small businesses need at least 24 months instead of 12 months to adapt to these new environmental standards. We need financial support and technical guidance.',
        provision: 'Section 3 - Implementation Timeline',
        source: 'portal'
      },
      {
        legislationId: legislation1._id,
        submitterName: 'Prof. Meera Nair',
        submitterEmail: 'meera.nair@university.edu',
        commentText: 'The act should include provisions for protecting biodiversity hotspots and endangered species. Climate change mitigation alone is not sufficient; we need concrete measures for ecosystem conservation.',
        provision: 'Section 5 - Biodiversity Protection',
        source: 'portal'
      },
      {
        legislationId: legislation1._id,
        submitterName: 'Karan Singh',
        submitterEmail: 'karan.singh@industry.com',
        commentText: 'While I appreciate the intent, the carbon emission targets are unrealistic for heavy industries. We need a phased approach with clear milestones and government support for technology upgrades.',
        provision: 'Section 6 - Carbon Emission Norms',
        source: 'portal'
      },
      
      // Feedbacks for Digital Privacy Bill
      {
        legislationId: legislation2._id,
        submitterName: 'Sneha Reddy',
        submitterEmail: 'sneha.reddy@techcorp.com',
        commentText: 'The data localization requirements are overly restrictive and problematic for multinational companies operating in India. This could hinder foreign investment and technological innovation. We need a more balanced approach.',
        provision: 'Section 12 - Data Localization',
        source: 'portal'
      },
      {
        legislationId: legislation2._id,
        submitterName: 'Vikram Singh',
        submitterEmail: 'vikram.singh@privacy.org',
        commentText: 'Excellent bill! However, please include specific provisions for protecting children\'s online privacy and preventing cyberbullying. The current draft lacks age-appropriate safeguards.',
        provision: 'Section 8 - Children\'s Privacy',
        source: 'portal'
      },
      {
        legislationId: legislation2._id,
        submitterName: 'Anjali Verma',
        submitterEmail: 'anjali.verma@startup.io',
        commentText: 'The compliance requirements are too burdensome for startups and small tech companies. We need simplified compliance procedures and exemptions for companies below certain revenue thresholds.',
        provision: 'Section 15 - Compliance Requirements',
        source: 'portal'
      },
      {
        legislationId: legislation2._id,
        submitterName: 'Rahul Mishra',
        submitterEmail: 'rahul.mishra@legal.com',
        commentText: 'The definition of "sensitive personal data" is too broad and ambiguous. This needs to be more precisely defined to avoid confusion and ensure proper implementation.',
        provision: 'Section 2 - Definitions',
        source: 'portal'
      },
      {
        legislationId: legislation2._id,
        submitterName: 'Dr. Kavita Joshi',
        submitterEmail: 'kavita.joshi@research.in',
        commentText: 'The bill should include provisions for data portability and the right to be forgotten. Citizens should have complete control over their personal data.',
        provision: 'Section 10 - User Rights',
        source: 'portal'
      },
      
      // Feedbacks for Education Policy
      {
        legislationId: legislation3._id,
        submitterName: 'Suresh Iyer',
        submitterEmail: 'suresh.iyer@school.edu',
        commentText: 'The focus on digital literacy is commendable, but we need adequate infrastructure in rural schools first. Without proper internet connectivity and devices, this policy cannot be implemented effectively.',
        provision: 'Section 4 - Digital Literacy',
        source: 'portal'
      },
      {
        legislationId: legislation3._id,
        submitterName: 'Deepa Menon',
        submitterEmail: 'deepa.menon@parents.org',
        commentText: 'Vocational training should be integrated from middle school level, not just in higher secondary. Early exposure will help students make better career choices.',
        provision: 'Section 6 - Vocational Training',
        source: 'portal'
      },
      {
        legislationId: legislation3._id,
        submitterName: 'Arun Kumar',
        submitterEmail: 'arun.kumar@teachers.in',
        commentText: 'Teachers need comprehensive training before implementing these changes. The policy should include mandatory professional development programs with adequate funding.',
        provision: 'Section 9 - Teacher Training',
        source: 'portal'
      },
      {
        legislationId: legislation3._id,
        submitterName: 'Neha Gupta',
        submitterEmail: 'neha.gupta@disability.org',
        commentText: 'The inclusivity provisions are good but lack specific implementation mechanisms for students with disabilities. We need concrete guidelines and mandatory accessibility standards.',
        provision: 'Section 11 - Inclusive Education',
        source: 'portal'
      },
      {
        legislationId: legislation3._id,
        submitterName: 'Manoj Pandey',
        submitterEmail: 'manoj.pandey@college.edu',
        commentText: 'The policy should address the issue of education loan burden on students. We need provisions for scholarships and interest-free loans for economically weaker sections.',
        provision: 'General Comments',
        source: 'portal'
      }
    ];

    await Feedback.insertMany(feedbacks);
    console.log(`✅ ${feedbacks.length} sample feedbacks created`);

    // Create users
    console.log('\n👤 Creating users...');
    
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@gov.in',
      password: 'admin123',
      role: 'admin'
    });
    
    const analystUser = await User.create({
      username: 'analyst',
      email: 'analyst@gov.in',
      password: 'analyst123',
      role: 'analyst'
    });
    
    const viewerUser = await User.create({
      username: 'viewer',
      email: 'viewer@gov.in',
      password: 'viewer123',
      role: 'viewer'
    });

    console.log('✅ Admin user created');
    console.log('✅ Analyst user created');
    console.log('✅ Viewer user created');

    console.log('\n' + '='.repeat(60));
    console.log('✨ DATABASE SETUP COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   • ${await Legislation.countDocuments()} Legislations created`);
    console.log(`   • ${await Feedback.countDocuments()} Feedbacks created`);
    console.log(`   • ${await User.countDocuments()} Users created`);
    
    console.log('\n👥 User Credentials:');
    console.log('   Admin:');
    console.log('   📧 Email: admin@gov.in');
    console.log('   🔑 Password: admin123');
    console.log('   \n   Analyst:');
    console.log('   📧 Email: analyst@gov.in');
    console.log('   🔑 Password: analyst123');
    console.log('   \n   Viewer:');
    console.log('   📧 Email: viewer@gov.in');
    console.log('   🔑 Password: viewer123');
    console.log('\n' + '='.repeat(60) + '\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database setup error:', error);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
};

setupDatabase();