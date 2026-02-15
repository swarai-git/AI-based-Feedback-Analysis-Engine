const mongoose = require('mongoose');

const initializeDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully');
    
    // Create indexes for performance
    const db = mongoose.connection.db;
    
    await db.collection('feedbacks').createIndex({ legislationId: 1, submittedAt: -1 });
    await db.collection('analysisResults').createIndex({ feedbackId: 1 });
    await db.collection('analysisResults').createIndex({ sentiment: 1 });
    
    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = initializeDatabase;