const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'pmajay_sih2024_secret_key';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const db = new sqlite3.Database('./pm_ajay.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

function initializeTables() {
  db.run(`CREATE TABLE IF NOT EXISTS states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS agencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('implementing', 'executing')),
    contact TEXT,
    state_id INTEGER,
    roles TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    component TEXT NOT NULL CHECK (component IN ('AdarshGram', 'GIA', 'Hostel')),
    state_id INTEGER NOT NULL,
    agency_ids TEXT,
    budget_total REAL DEFAULT 0,
    budget_released REAL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'stalled')),
    latitude REAL,
    longitude REAL,
    progress_percent INTEGER DEFAULT 0,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS fund_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    transaction_date DATE DEFAULT (date('now')),
    type TEXT NOT NULL CHECK (type IN ('allocated', 'released', 'utilized')),
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    uploaded_by INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('central', 'state_user', 'agency', 'public')),
    state_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id)
  )`, () => {
    setTimeout(insertSampleData, 1000);
  });

  db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id INTEGER,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
}

function insertSampleData() {
  db.get('SELECT COUNT(*) as count FROM states', (err, row) => {
    if (row.count > 0) return;

    const states = [
      ['Maharashtra', 'MH'],
      ['Gujarat', 'GJ'],
      ['Karnataka', 'KA'],
      ['Tamil Nadu', 'TN'],
      ['Uttar Pradesh', 'UP'],
      ['Delhi', 'DL']
    ];
    states.forEach(state => {
      db.run('INSERT INTO states (name, code) VALUES (?, ?)', state);
    });

    const agencies = [
      ['Ministry of Rural Development', 'implementing', 'contact@rural.nic.in', 1, 'Central Government', 'active'],
      ['Maharashtra Rural Development', 'executing', 'rd@mh.gov.in', 1, 'State Government', 'active'],
      ['Gujarat Rural Development', 'executing', 'rd@gj.gov.in', 2, 'State Government', 'active'],
      ['Karnataka Rural Development', 'executing', 'rd@ka.gov.in', 3, 'State Government', 'active']
    ];
    agencies.forEach(agency => {
      db.run('INSERT INTO agencies (name, type, contact, state_id, roles, status) VALUES (?, ?, ?, ?, ?, ?)', agency);
    });

    const projects = [
      ['Adarsh Gram Scheme - Pune District', 'AdarshGram', 1, '[1,2]', 5000000, 2500000, '2024-01-01', '2024-12-31', 'ongoing', 18.5204, 73.8567, 45, 'Development of model villages in Pune district'],
      ['Girls and Boys Hostel - Ahmedabad', 'Hostel', 2, '[1,3]', 8000000, 5000000, '2024-02-01', '2024-11-30', 'ongoing', 23.0225, 72.5714, 60, 'Construction of hostels for SC/ST students'],
      ['Grant-in-Aid to NGOs - Bangalore', 'GIA', 3, '[1,4]', 3000000, 1500000, '2024-03-01', '2024-10-31', 'ongoing', 12.9716, 77.5946, 30, 'Financial assistance to NGOs for welfare activities'],
      ['Adarsh Gram Scheme - Chennai', 'AdarshGram', 4, '[1]', 4500000, 2000000, '2024-01-15', '2024-12-15', 'ongoing', 13.0827, 80.2707, 35, 'Development of model villages in Chennai region']
    ];
    projects.forEach(project => {
      db.run('INSERT INTO projects (title, component, state_id, agency_ids, budget_total, budget_released, start_date, end_date, status, latitude, longitude, progress_percent, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', project);
    });

    bcrypt.hash('admin123', 10, (err, hash) => {
      db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@pmajay.gov.in', hash, 'central']);
    });
    bcrypt.hash('state123', 10, (err, hash) => {
      db.run('INSERT INTO users (name, email, password, role, state_id) VALUES (?, ?, ?, ?, ?)',
        ['Maharashtra Officer', 'officer@mh.gov.in', hash, 'state_user', 1]);
    });
    bcrypt.hash('public123', 10, (err, hash) => {
      db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Public User', 'citizen@example.com', hash, 'public']);
    });
  });
}

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

app.post('/api/v1/auth/register', async (req, res) => {
  const { name, email, password, role, state_id } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (name, email, password, role, state_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, role || 'public', state_id || null],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'User already exists or invalid data' });
        }
        res.json({ id: this.lastID, message: 'User registered successfully' });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, state_id: user.state_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

app.get('/api/v1/states', (req, res) => {
  db.all('SELECT * FROM states ORDER BY name', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/v1/agencies', (req, res) => {
  const { state_id, type, status } = req.query;
  let query = 'SELECT * FROM agencies WHERE 1=1';
  const params = [];

  if (state_id) {
    query += ' AND state_id = ?';
    params.push(state_id);
  }
  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/v1/projects', (req, res) => {
  const { state_id, component, status } = req.query;
  let query = `
    SELECT p.*, s.name as state_name, s.code as state_code
    FROM projects p
    JOIN states s ON p.state_id = s.id
    WHERE 1=1
  `;
  const params = [];

  if (state_id) {
    query += ' AND p.state_id = ?';
    params.push(state_id);
  }
  if (component) {
    query += ' AND p.component = ?';
    params.push(component);
  }
  if (status) {
    query += ' AND p.status = ?';
    params.push(status);
  }

  query += ' ORDER BY p.created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/v1/projects/:id', (req, res) => {
  const { id } = req.params;
  db.get(`
    SELECT p.*, s.name as state_name, s.code as state_code
    FROM projects p
    JOIN states s ON p.state_id = s.id
    WHERE p.id = ?
  `, [id], (err, project) => {
    if (err || !project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    db.all('SELECT * FROM fund_transactions WHERE project_id = ? ORDER BY transaction_date DESC', [id], (err, transactions) => {
      project.transactions = transactions || [];

      db.all('SELECT * FROM reports WHERE project_id = ? ORDER BY created_at DESC', [id], (err, reports) => {
        project.reports = reports || [];
        res.json(project);
      });
    });
  });
});

app.post('/api/v1/projects/:id/progress', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { progress_percent, note } = req.body;

  db.run(
    'UPDATE projects SET progress_percent = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [progress_percent, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.run(
        'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'UPDATE_PROGRESS', 'project', id, JSON.stringify({ progress_percent, note })],
        () => {
          res.json({ message: 'Progress updated successfully' });
        }
      );
    }
  );
});

app.post('/api/v1/projects/:id/funds', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { amount, type, note } = req.body;

  db.run(
    'INSERT INTO fund_transactions (project_id, amount, type, note) VALUES (?, ?, ?, ?)',
    [id, amount, type, note],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (type === 'released') {
        db.run('UPDATE projects SET budget_released = budget_released + ? WHERE id = ?', [amount, id]);
      }

      db.run(
        'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, 'FUND_TRANSACTION', 'project', id, JSON.stringify({ amount, type, note })],
        () => {
          res.json({ id: this.lastID, message: 'Fund transaction created successfully' });
        }
      );
    }
  );
});

app.post('/api/v1/reports', authMiddleware, upload.single('file'), (req, res) => {
  const { project_id, notes } = req.body;
  const file_path = req.file ? `/uploads/${req.file.filename}` : null;

  if (!file_path) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  db.run(
    'INSERT INTO reports (project_id, uploaded_by, file_path, notes) VALUES (?, ?, ?, ?)',
    [project_id, req.user.id, file_path, notes],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Report uploaded successfully', file_path });
    }
  );
});

app.get('/api/v1/dashboard/central', authMiddleware, (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as count FROM projects', (err, row) => {
    stats.totalProjects = row.count;

    db.get('SELECT SUM(budget_total) as total, SUM(budget_released) as released FROM projects', (err, fundRow) => {
      stats.totalBudget = fundRow.total || 0;
      stats.budgetReleased = fundRow.released || 0;
      stats.budgetUtilized = fundRow.released || 0;
      stats.utilizationRate = fundRow.total > 0 ? ((fundRow.released / fundRow.total) * 100).toFixed(2) : 0;

      db.get('SELECT AVG(progress_percent) as avg FROM projects WHERE status = "ongoing"', (err, progressRow) => {
        stats.avgProgress = progressRow.avg ? progressRow.avg.toFixed(2) : 0;

        db.all(`
          SELECT
            (julianday('now') - julianday(start_date)) * 100.0 / (julianday(end_date) - julianday(start_date)) as expected_progress,
            progress_percent,
            id, title
          FROM projects
          WHERE status = 'ongoing'
        `, (err, projects) => {
          stats.slabr = projects ? projects.filter(p => p.progress_percent < (p.expected_progress - 10)).length : 0;

          db.all(`
            SELECT s.name, s.code, COUNT(p.id) as project_count,
                   SUM(p.budget_total) as total_budget,
                   AVG(p.progress_percent) as avg_progress
            FROM states s
            LEFT JOIN projects p ON s.id = p.state_id
            GROUP BY s.id
            ORDER BY project_count DESC
          `, (err, stateStats) => {
            stats.stateWiseData = stateStats || [];

            db.all(`
              SELECT component, COUNT(*) as count,
                     SUM(budget_total) as budget,
                     AVG(progress_percent) as progress
              FROM projects
              GROUP BY component
            `, (err, componentStats) => {
              stats.componentWiseData = componentStats || [];
              res.json(stats);
            });
          });
        });
      });
    });
  });
});

app.get('/api/v1/dashboard/state/:stateId', authMiddleware, (req, res) => {
  const { stateId } = req.params;
  const stats = {};

  db.get('SELECT * FROM states WHERE id = ?', [stateId], (err, state) => {
    if (!state) {
      return res.status(404).json({ error: 'State not found' });
    }
    stats.state = state;

    db.get('SELECT COUNT(*) as count FROM projects WHERE state_id = ?', [stateId], (err, row) => {
      stats.totalProjects = row.count;

      db.get('SELECT SUM(budget_total) as total, SUM(budget_released) as released FROM projects WHERE state_id = ?', [stateId], (err, fundRow) => {
        stats.totalBudget = fundRow.total || 0;
        stats.budgetReleased = fundRow.released || 0;
        stats.utilizationRate = fundRow.total > 0 ? ((fundRow.released / fundRow.total) * 100).toFixed(2) : 0;

        db.all('SELECT * FROM projects WHERE state_id = ? ORDER BY updated_at DESC', [stateId], (err, projects) => {
          stats.projects = projects || [];

          db.all('SELECT * FROM agencies WHERE state_id = ?', [stateId], (err, agencies) => {
            stats.agencies = agencies || [];
            res.json(stats);
          });
        });
      });
    });
  });
});

app.get('/api/v1/dashboard/public', (req, res) => {
  db.all(`
    SELECT p.*, s.name as state_name, s.code as state_code
    FROM projects p
    JOIN states s ON p.state_id = s.id
    WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL
    ORDER BY p.created_at DESC
  `, (err, projects) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    db.get('SELECT SUM(budget_total) as total FROM projects', (err, budgetRow) => {
      res.json({
        projects: projects || [],
        totalBudget: budgetRow.total || 0,
        totalProjects: projects.length
      });
    });
  });
});

app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as count FROM agencies', (err, row) => {
    stats.totalAgencies = row.count;

    db.get('SELECT SUM(budget_total) as totalAllocated, SUM(budget_released) as totalUsed FROM projects', (err, fundRow) => {
      stats.totalAllocated = fundRow.totalAllocated || 0;
      stats.totalUsed = fundRow.totalUsed || 0;
      stats.utilizationRate = fundRow.totalAllocated > 0 ? (fundRow.totalUsed / fundRow.totalAllocated) * 100 : 0;

      db.get('SELECT COUNT(*) as count FROM projects', (err, projRow) => {
        stats.totalTasks = projRow.count;
        stats.completedTasks = 0;
        stats.completionRate = 0;
        res.json(stats);
      });
    });
  });
});

app.post('/api/agencies', (req, res) => {
  const { name, type, location, role, contact } = req.body;
  db.run(
    'INSERT INTO agencies (name, type, contact, roles, status) VALUES (?, ?, ?, ?, ?)',
    [name, type, contact, role, 'active'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Agency created successfully' });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
