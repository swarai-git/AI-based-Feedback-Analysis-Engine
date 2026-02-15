/*const User = require('../models/User');
const PendingVerification = require('../models/PendingVerification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/verifications/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, JPG, and PNG files are allowed'));
  }
});

exports.uploadVerification = upload.single('verificationDocument');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, organizationName, employeeId, officialEmail } = req.body;

    console.log('REGISTER REQUEST:', { username, email, role });

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }

    // VIEWER REGISTRATION - Immediate approval
    if (role === 'viewer' || !role) {
      const user = await User.create({
        username,
        email,
        password,
        role: 'viewer',
      });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log(`✅ Viewer registered: ${user.email}`);

      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    }

    // ANALYST/ADMIN REGISTRATION - Requires verification
    if (role === 'analyst' || role === 'admin') {
      // Validate verification fields
      if (!organizationName || !employeeId || !officialEmail) {
        return res.status(400).json({ 
          message: 'Organization name, employee ID, and official email are required for analyst/admin registration' 
        });
      }

      // Validate official email domain
      const emailDomain = officialEmail.split('@')[1];
      const allowedDomains = ['gov.in', 'nic.in', 'ministry.gov.in'];
      if (!allowedDomains.some(domain => emailDomain?.endsWith(domain))) {
        return res.status(400).json({ 
          message: 'Official email must be from a government domain (@gov.in, @nic.in, etc.)' 
        });
      }

      // Check if verification document uploaded
      if (!req.file) {
        return res.status(400).json({ 
          message: 'Verification document (ID card or employment letter) is required' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create pending verification record
      const pendingVerification = await PendingVerification.create({
        username,
        email,
        password: hashedPassword,
        requestedRole: role,
        organizationName,
        employeeId,
        officialEmail,
        verificationDocumentPath: req.file.path,
        status: 'pending'
      });

      console.log(`📋 Pending verification created for: ${email} (requested role: ${role})`);

      return res.status(201).json({
        message: 'Registration submitted for verification. You will receive an email once your account is approved.',
        pendingVerificationId: pendingVerification._id,
        status: 'pending_verification'
      });
    }

    return res.status(400).json({ message: 'Invalid role specified' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error creating user',
      error: error.message 
    });
  }
};*/
const User = require('../models/User');
const PendingVerification = require('../models/PendingVerification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/verifications');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/verifications/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, JPG, and PNG files are allowed'));
  }
});

exports.uploadVerification = upload.single('verificationDocument');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, organizationName, employeeId, officialEmail } = req.body;

    console.log('REGISTER REQUEST:', { username, email, role });

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }

    // VIEWER REGISTRATION - Immediate approval
    if (role === 'viewer' || !role) {
      const user = await User.create({
        username,
        email,
        password,
        role: 'viewer',
      });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log(`✅ Viewer registered: ${user.email}`);

      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    }

    // ANALYST/ADMIN REGISTRATION - Requires verification
    if (role === 'analyst' || role === 'admin') {
      // Validate verification fields
      if (!organizationName || !employeeId || !officialEmail) {
        return res.status(400).json({ 
          message: 'Organization name, employee ID, and official email are required for analyst/admin registration' 
        });
      }

      // Validate official email domain
      const emailDomain = officialEmail.split('@')[1];
      const allowedDomains = ['gov.in', 'nic.in', 'ministry.gov.in'];
      if (!allowedDomains.some(domain => emailDomain?.endsWith(domain))) {
        return res.status(400).json({ 
          message: 'Official email must be from a government domain (@gov.in, @nic.in, etc.)' 
        });
      }

      // Check if verification document uploaded
      if (!req.file) {
        return res.status(400).json({ 
          message: 'Verification document (ID card or employment letter) is required' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create pending verification record
      const pendingVerification = await PendingVerification.create({
        username,
        email,
        password: hashedPassword,
        requestedRole: role,
        organizationName,
        employeeId,
        officialEmail,
        verificationDocumentPath: req.file.path,
        status: 'pending'
      });

      console.log(`📋 Pending verification created for: ${email} (requested role: ${role})`);

      return res.status(201).json({
        message: 'Registration submitted for verification. You will receive an email once your account is approved.',
        pendingVerificationId: pendingVerification._id,
        status: 'pending_verification'
      });
    }

    return res.status(400).json({ message: 'Invalid role specified' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error creating user',
      error: error.message 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('LOGIN REQUEST:', { email });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({ 
        message: 'Your account is not active. Please contact administrator.' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ User logged in: ${user.email}`);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error during login',
      error: error.message 
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Error fetching profile',
      error: error.message 
    });
  }
};
 