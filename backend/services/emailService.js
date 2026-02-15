const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send email alert for duplicate submission
 */
const sendDuplicateAlert = async (originalFeedback, duplicateFeedback, legislationTitle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@aifeedback.gov',
      to: process.env.ADMIN_EMAIL,
      subject: `⚠️ Duplicate Feedback Detected - ${legislationTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">🔄 Duplicate Feedback Alert</h2>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Legislation:</strong> ${legislationTitle}</p>
            <p><strong>Detection Time:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937;">Original Feedback</h3>
            <p><strong>Submitter:</strong> ${originalFeedback.submitterName}</p>
            <p><strong>Email:</strong> ${originalFeedback.submitterEmail}</p>
            <p><strong>Date:</strong> ${new Date(originalFeedback.submittedAt).toLocaleString()}</p>
            <p><strong>Comment:</strong> ${originalFeedback.commentText}</p>
          </div>

          <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #991b1b;">Potential Duplicate</h3>
            <p><strong>Submitter:</strong> ${duplicateFeedback.submitterName}</p>
            <p><strong>Email:</strong> ${duplicateFeedback.submitterEmail}</p>
            <p><strong>Date:</strong> ${new Date(duplicateFeedback.submittedAt).toLocaleString()}</p>
            <p><strong>Comment:</strong> ${duplicateFeedback.commentText}</p>
          </div>

          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This is an automated alert from the AI Feedback Analysis System.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Duplicate alert email sent successfully');
    return true;

  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

/**
 * Send daily digest of duplicate feedbacks
 */
const sendDailyDigest = async (duplicateGroups, legislationTitle) => {
  try {
    const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.count - 1, 0);

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@aifeedback.gov',
      to: process.env.ADMIN_EMAIL,
      subject: `📊 Daily Duplicate Feedback Report - ${legislationTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">📊 Daily Duplicate Report</h2>
          
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Legislation:</strong> ${legislationTitle}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Duplicate Groups:</strong> ${duplicateGroups.length}</p>
            <p><strong>Total Duplicates Detected:</strong> ${totalDuplicates}</p>
          </div>

          <h3 style="color: #1f2937;">Top Duplicate Groups</h3>
          ${duplicateGroups.slice(0, 5).map((group, idx) => `
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h4 style="color: #374151;">Group ${idx + 1} (${group.count} similar feedbacks)</h4>
              <p><strong>Representative Comment:</strong></p>
              <p style="font-style: italic; color: #6b7280;">"${group.representative.commentText.substring(0, 200)}..."</p>
            </div>
          `).join('')}

          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            View full report in the AI Feedback Analysis System dashboard.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Daily digest email sent successfully');
    return true;

  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

module.exports = {
  sendDuplicateAlert,
  sendDailyDigest
};