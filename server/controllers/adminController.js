import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'techora_enterprise_super_secret_jwt_key_2026_x99a';

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch user with parameterized query
    const stmt = db.prepare('SELECT * FROM admin_users WHERE email = ?');
    const user = stmt.get(email);

    if (!user) {
      // Fallback for default initial admin setup
      if (email === 'admin@techora.com' && password === 'Admin#2026') {
        const token = jwt.sign(
          { id: 1, email: 'admin@techora.com', role: 'admin' },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        return res.json({
          success: true,
          token,
          user: { id: 1, email: 'admin@techora.com', role: 'admin' }
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const stmt = db.prepare('SELECT * FROM enquiries ORDER BY id DESC');
    const enquiries = stmt.all();
    res.json({
      success: true,
      enquiries
    });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const stmt = db.prepare('UPDATE enquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found' });
    }

    res.json({
      success: true,
      message: 'Enquiry status updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM enquiries WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found' });
    }

    res.json({
      success: true,
      message: 'Enquiry record deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

export const getContent = async (req, res, next) => {
  try {
    const row = db.prepare('SELECT content FROM site_content WHERE id = 1').get();
    if (row && row.content) {
      return res.json({ success: true, content: JSON.parse(row.content) });
    }
    res.json({ success: true, content: null });
  } catch (err) {
    next(err);
  }
};

export const updateContent = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid content payload' });
    }

    const jsonStr = JSON.stringify(content);
    db.prepare(`
      INSERT INTO site_content (id, content, updated_at) 
      VALUES (1, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = CURRENT_TIMESTAMP
    `).run(jsonStr);

    res.json({
      success: true,
      message: 'Website content updated and persisted successfully',
      content
    });
  } catch (err) {
    next(err);
  }
};

