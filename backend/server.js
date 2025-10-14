const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize SQLite database
const db = new sqlite3.Database('./pm_ajay.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

// Initialize database tables
function initializeTables() {
  // Agencies table
  db.run(`CREATE TABLE IF NOT EXISTS agencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    role TEXT NOT NULL,
    contact TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating agencies table:', err);
    } else {
      console.log('Agencies table created/verified');
    }
  });

  // Funds table
  db.run(`CREATE TABLE IF NOT EXISTS funds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    component TEXT NOT NULL,
    state TEXT NOT NULL,
    amount_allocated REAL NOT NULL,
    amount_used REAL DEFAULT 0,
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating funds table:', err);
    } else {
      console.log('Funds table created/verified');
      // Insert sample data after tables are created
      setTimeout(insertSampleData, 1000);
    }
  });

  // Tasks table
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    deadline DATE,
    status TEXT DEFAULT 'Pending',
    priority TEXT DEFAULT 'Medium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating tasks table:', err);
    } else {
      console.log('Tasks table created/verified');
    }
  });
}

function insertSampleData() {
  // Sample agencies
  const agencies = [
    ['Ministry of Rural Development', 'Implementing', 'New Delhi', 'Central Government', 'contact@rural.nic.in'],
    ['State Rural Development Department - Maharashtra', 'Executing', 'Mumbai', 'State Government', 'rd@maharashtra.gov.in'],
    ['District Collector - Pune', 'Executing', 'Pune', 'District Administration', 'collector@pune.gov.in'],
    ['NGO - Rural Development Society', 'Implementing', 'Pune', 'Non-Governmental', 'info@rds.org.in']
  ];

  agencies.forEach(agency => {
    db.run(`INSERT OR IGNORE INTO agencies (name, type, location, role, contact) VALUES (?, ?, ?, ?, ?)`, agency);
  });

  // Sample funds
  const funds = [
    ['Rural Housing', 'Maharashtra', 50000000, 25000000, 'Active'],
    ['Rural Infrastructure', 'Gujarat', 75000000, 45000000, 'Active'],
    ['Skill Development', 'Karnataka', 30000000, 15000000, 'Active']
  ];

  funds.forEach(fund => {
    db.run(`INSERT OR IGNORE INTO funds (component, state, amount_allocated, amount_used, status) VALUES (?, ?, ?, ?, ?)`, fund);
  });

  // Sample tasks
  const tasks = [
    ['Ministry of Rural Development', 'State Rural Development Department - Maharashtra', 'Complete Phase 1 Infrastructure', 'Complete construction of 100 rural houses in Pune district', '2024-03-15', 'Pending', 'High'],
    ['State Rural Development Department - Maharashtra', 'District Collector - Pune', 'Submit Progress Report', 'Submit monthly progress report for rural development projects', '2024-02-28', 'Completed', 'Medium']
  ];

  tasks.forEach(task => {
    db.run(`INSERT OR IGNORE INTO tasks (sender, receiver, title, description, deadline, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?)`, task);
  });
}

// API Routes

// Agencies endpoints
app.get('/api/agencies', (req, res) => {
  db.all('SELECT * FROM agencies ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/agencies', (req, res) => {
  const { name, type, location, role, contact } = req.body;
  db.run(
    'INSERT INTO agencies (name, type, location, role, contact) VALUES (?, ?, ?, ?, ?)',
    [name, type, location, role, contact],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Agency created successfully' });
    }
  );
});

app.put('/api/agencies/:id', (req, res) => {
  const { name, type, location, role, contact } = req.body;
  const { id } = req.params;
  db.run(
    'UPDATE agencies SET name = ?, type = ?, location = ?, role = ?, contact = ? WHERE id = ?',
    [name, type, location, role, contact, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Agency updated successfully' });
    }
  );
});

app.delete('/api/agencies/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM agencies WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Agency deleted successfully' });
  });
});

// Funds endpoints
app.get('/api/funds', (req, res) => {
  db.all('SELECT * FROM funds ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/funds', (req, res) => {
  const { component, state, amount_allocated, amount_used, status } = req.body;
  db.run(
    'INSERT INTO funds (component, state, amount_allocated, amount_used, status) VALUES (?, ?, ?, ?, ?)',
    [component, state, amount_allocated, amount_used || 0, status || 'Active'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Fund record created successfully' });
    }
  );
});

app.put('/api/funds/:id', (req, res) => {
  const { component, state, amount_allocated, amount_used, status } = req.body;
  const { id } = req.params;
  db.run(
    'UPDATE funds SET component = ?, state = ?, amount_allocated = ?, amount_used = ?, status = ? WHERE id = ?',
    [component, state, amount_allocated, amount_used, status, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Fund record updated successfully' });
    }
  );
});

app.delete('/api/funds/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM funds WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Fund record deleted successfully' });
  });
});

// Tasks endpoints
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/tasks', (req, res) => {
  const { sender, receiver, title, description, deadline, priority } = req.body;
  db.run(
    'INSERT INTO tasks (sender, receiver, title, description, deadline, priority) VALUES (?, ?, ?, ?, ?, ?)',
    [sender, receiver, title, description, deadline, priority || 'Medium'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Task created successfully' });
    }
  );
});

app.put('/api/tasks/:id', (req, res) => {
  const { sender, receiver, title, description, deadline, status, priority } = req.body;
  const { id } = req.params;
  db.run(
    'UPDATE tasks SET sender = ?, receiver = ?, title = ?, description = ?, deadline = ?, status = ?, priority = ? WHERE id = ?',
    [sender, receiver, title, description, deadline, status, priority, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Task updated successfully' });
    }
  );
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};
  
  // Get agency count
  db.get('SELECT COUNT(*) as count FROM agencies', (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    stats.totalAgencies = row.count;
    
    // Get fund stats
    db.get('SELECT SUM(amount_allocated) as totalAllocated, SUM(amount_used) as totalUsed FROM funds', (err, fundRow) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      stats.totalAllocated = fundRow.totalAllocated || 0;
      stats.totalUsed = fundRow.totalUsed || 0;
      stats.utilizationRate = fundRow.totalAllocated > 0 ? (fundRow.totalUsed / fundRow.totalAllocated) * 100 : 0;
      
      // Get task stats
      db.get('SELECT COUNT(*) as totalTasks FROM tasks', (err, taskRow) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        stats.totalTasks = taskRow.totalTasks;
        
        // Get completed tasks
        db.get('SELECT COUNT(*) as completedTasks FROM tasks WHERE status = "Completed"', (err, completedRow) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          stats.completedTasks = completedRow.completedTasks;
          stats.completionRate = taskRow.totalTasks > 0 ? (completedRow.completedTasks / taskRow.totalTasks) * 100 : 0;
          
          res.json(stats);
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
