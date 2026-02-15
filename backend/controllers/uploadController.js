const fs = require('fs');
const csv = require('csv-parser');
const Feedback = require('../models/Feedback');
const Legislation = require('../models/Legislation');

// Upload CSV file with feedbacks
exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { legislationId } = req.body;

    if (!legislationId) {
      return res.status(400).json({ message: 'Legislation ID is required' });
    }

    // Verify legislation exists
    const legislation = await Legislation.findById(legislationId);
    if (!legislation) {
      return res.status(404).json({ message: 'Legislation not found' });
    }

    const feedbacks = [];
    const errors = [];

    // Read and parse CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Validate required fields
          if (!row.submitterName || !row.submitterEmail || !row.commentText) {
            errors.push({
              row: row,
              error: 'Missing required fields (submitterName, submitterEmail, commentText)'
            });
            return;
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(row.submitterEmail)) {
            errors.push({
              row: row,
              error: 'Invalid email format'
            });
            return;
          }

          feedbacks.push({
            legislationId,
            submitterName: row.submitterName.trim(),
            submitterEmail: row.submitterEmail.trim().toLowerCase(),
            commentText: row.commentText.trim(),
            provision: row.provision ? row.provision.trim() : '',
            source: 'csv'
          });
        } catch (error) {
          errors.push({
            row: row,
            error: error.message
          });
        }
      })
      .on('end', async () => {
        try {
          // Insert valid feedbacks
          if (feedbacks.length > 0) {
            await Feedback.insertMany(feedbacks);
          }

          // Delete uploaded file
          fs.unlinkSync(req.file.path);

          res.status(201).json({
            message: 'CSV file processed successfully',
            totalRows: feedbacks.length + errors.length,
            successfulImports: feedbacks.length,
            failedImports: errors.length,
            errors: errors.length > 0 ? errors : undefined
          });
        } catch (error) {
          console.error('CSV insert error:', error);
          res.status(500).json({ 
            message: 'Error saving feedbacks to database',
            error: error.message 
          });
        }
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        res.status(500).json({ 
          message: 'Error parsing CSV file',
          error: error.message 
        });
      });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading file',
      error: error.message 
    });
  }
};

// Upload single feedback manually
exports.uploadSingleFeedback = async (req, res) => {
  try {
    const { legislationId, submitterName, submitterEmail, commentText, provision } = req.body;

    // Validate required fields
    if (!legislationId || !submitterName || !submitterEmail || !commentText) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['legislationId', 'submitterName', 'submitterEmail', 'commentText']
      });
    }

    // Verify legislation exists
    const legislation = await Legislation.findById(legislationId);
    if (!legislation) {
      return res.status(404).json({ message: 'Legislation not found' });
    }

    // Create feedback
    const feedback = await Feedback.create({
      legislationId,
      submitterName: submitterName.trim(),
      submitterEmail: submitterEmail.trim().toLowerCase(),
      commentText: commentText.trim(),
      provision: provision ? provision.trim() : '',
      source: 'portal'
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Single feedback upload error:', error);
    res.status(500).json({ 
      message: 'Error submitting feedback',
      error: error.message 
    });
  }
};

// Get upload history/statistics
exports.getUploadStats = async (req, res) => {
  try {
    const { legislationId } = req.params;

    const stats = await Feedback.aggregate([
      { $match: { legislationId: legislationId } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalFeedbacks = await Feedback.countDocuments({ legislationId });

    const sourceDistribution = {
      portal: 0,
      csv: 0,
      api: 0
    };

    stats.forEach(item => {
      sourceDistribution[item._id] = item.count;
    });

    res.status(200).json({
      totalFeedbacks,
      sourceDistribution
    });
  } catch (error) {
    console.error('Upload stats error:', error);
    res.status(500).json({ 
      message: 'Error retrieving upload statistics',
      error: error.message 
    });
  }
};

// Validate CSV format before upload
exports.validateCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const validationResults = {
      valid: true,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      errors: []
    };

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        validationResults.totalRows++;

        const rowErrors = [];

        // Check required fields
        if (!row.submitterName) {
          rowErrors.push('Missing submitterName');
        }
        if (!row.submitterEmail) {
          rowErrors.push('Missing submitterEmail');
        }
        if (!row.commentText) {
          rowErrors.push('Missing commentText');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (row.submitterEmail && !emailRegex.test(row.submitterEmail)) {
          rowErrors.push('Invalid email format');
        }

        if (rowErrors.length > 0) {
          validationResults.invalidRows++;
          validationResults.errors.push({
            row: validationResults.totalRows,
            errors: rowErrors
          });
        } else {
          validationResults.validRows++;
        }
      })
      .on('end', () => {
        // Delete uploaded file
        fs.unlinkSync(req.file.path);

        if (validationResults.invalidRows > 0) {
          validationResults.valid = false;
        }

        res.status(200).json(validationResults);
      })
      .on('error', (error) => {
        console.error('CSV validation error:', error);
        res.status(500).json({ 
          message: 'Error validating CSV file',
          error: error.message 
        });
      });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ 
      message: 'Error validating file',
      error: error.message 
    });
  }
};

// Download sample CSV template
exports.downloadTemplate = (req, res) => {
  try {
    const csvContent = 'submitterName,submitterEmail,commentText,provision\n' +
                       'John Doe,john.doe@example.com,This is a sample comment,Section 1\n' +
                       'Jane Smith,jane.smith@example.com,Another sample feedback,Section 2\n';

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=feedback_template.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Template download error:', error);
    res.status(500).json({ 
      message: 'Error generating template',
      error: error.message 
    });
  }
};