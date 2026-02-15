const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create backup directory if it doesn't exist
const backupDir = path.join(__dirname, '../backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const backupPath = path.join(backupDir, `backup-${timestamp}`);

// MongoDB connection string (update as needed)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback-analysis';

console.log('🔄 Starting database backup...');

exec(`mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Backup failed:', error);
    return;
  }
  console.log('✅ Backup completed successfully!');
  console.log('📁 Backup location:', backupPath);
});