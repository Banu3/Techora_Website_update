import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'techora_enterprise_super_secret_jwt_key_2026_x99a';

export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Missing or malformed authentication bearer token.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminUser = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired administrator token. Please login again.'
    });
  }
};
