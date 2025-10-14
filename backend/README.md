# PM-AJAY Backend API

Express.js backend server for the PM-AJAY Agency Mapping System.

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

## 📡 API Endpoints

### Agencies
- `GET /api/agencies` - Retrieve all agencies
- `POST /api/agencies` - Create a new agency
- `PUT /api/agencies/:id` - Update an existing agency
- `DELETE /api/agencies/:id` - Delete an agency

### Funds
- `GET /api/funds` - Retrieve all fund records
- `POST /api/funds` - Create a new fund record
- `PUT /api/funds/:id` - Update an existing fund record
- `DELETE /api/funds/:id` - Delete a fund record

### Tasks
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task

### Dashboard
- `GET /api/dashboard/stats` - Get aggregated statistics

## 🗄️ Database Schema

### Agencies Table
```sql
CREATE TABLE agencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  role TEXT NOT NULL,
  contact TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Funds Table
```sql
CREATE TABLE funds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component TEXT NOT NULL,
  state TEXT NOT NULL,
  amount_allocated REAL NOT NULL,
  amount_used REAL DEFAULT 0,
  status TEXT DEFAULT 'Active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender TEXT NOT NULL,
  receiver TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  deadline DATE,
  status TEXT DEFAULT 'Pending',
  priority TEXT DEFAULT 'Medium',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Configuration

- **Port**: 5000
- **Database**: SQLite (pm_ajay.db)
- **CORS**: Enabled for frontend communication
- **Body Parser**: JSON and URL-encoded support

## 📊 Sample Data

The server automatically inserts sample data on startup:
- 4 sample agencies
- 3 sample fund records
- 2 sample tasks

## 🛠️ Development

### Dependencies
- express: Web framework
- sqlite3: Database driver
- cors: Cross-origin resource sharing
- body-parser: Request body parsing

### Scripts
- `npm start`: Start the server
- `npm run dev`: Start with nodemon (if installed)

## 🔒 Security Notes

- CORS is enabled for development
- No authentication implemented (for demo purposes)
- Input validation is basic (should be enhanced for production)

## 📝 API Response Format

### Success Response
```json
{
  "id": 1,
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## 🚀 Production Considerations

For production deployment:
1. Add input validation and sanitization
2. Implement authentication and authorization
3. Add rate limiting
4. Use environment variables for configuration
5. Add logging and monitoring
6. Consider using PostgreSQL or MySQL for better performance
