module.exports = {
  SENTIMENT_TYPES: {
    POSITIVE: 'positive',
    NEGATIVE: 'negative',
    NEUTRAL: 'neutral'
  },
  
  PRIORITY_LEVELS: {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  },
  
  USER_ROLES: {
    ADMIN: 'admin',
    ANALYST: 'analyst',
    VIEWER: 'viewer'
  },
  
  LEGISLATION_STATUS: {
    OPEN: 'open',
    CLOSED: 'closed',
    UNDER_REVIEW: 'under_review'
  },
  
  FILE_TYPES: {
    CSV: 'text/csv',
    TXT: 'text/plain',
    PDF: 'application/pdf'
  },
  
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};