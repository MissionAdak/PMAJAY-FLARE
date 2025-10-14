# PM-AJAY Frontend

React frontend application for the PM-AJAY Agency Mapping System.

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:3000`

## 🎨 Features

### Pages
- **Home**: Hero section with feature overview and statistics
- **Agencies**: Agency management with search, filter, and CRUD operations
- **Funds**: Fund tracking with progress visualization and utilization charts
- **Communication**: Task-based messaging system for inter-agency coordination
- **Reports**: Analytics dashboard with interactive charts and metrics

### Components
- **Navbar**: Responsive navigation with mobile menu
- **Footer**: Contact information and quick links
- **Modals**: Form dialogs for creating/editing records
- **Charts**: Data visualization using Recharts
- **Cards**: Animated cards for displaying information

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Router DOM**: Client-side routing
- **Recharts**: Chart library for data visualization
- **Axios**: HTTP client for API calls
- **Lucide React**: Icon library

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## 🎨 Design System

### Colors
- Primary Blue: #0057A3
- Light Blue: #E6F3FF
- Success Green: #10B981
- Warning Yellow: #F59E0B
- Error Red: #EF4444

### Typography
- Font Family: Inter, system-ui, sans-serif
- Headings: Bold weights (600-700)
- Body: Regular weight (400)

### Animations
- Fade in/out transitions
- Hover effects with scale transforms
- Staggered animations for lists
- Smooth page transitions

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── Navbar.jsx
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   ├── Agencies.jsx
│   ├── Funds.jsx
│   ├── Communication.jsx
│   └── Reports.jsx
├── App.jsx
├── main.jsx
└── index.css
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Configuration
- **Vite Config**: Proxy setup for API calls
- **Tailwind Config**: Custom colors and animations
- **PostCSS Config**: Autoprefixer setup

## 📊 Data Visualization

### Charts Used
- Bar Charts: Fund allocation and utilization
- Pie Charts: Task status distribution
- Area Charts: State-wise fund trends
- Progress Bars: Individual fund utilization

### Chart Libraries
- Recharts: Primary charting library
- Responsive containers for all charts
- Custom tooltips and legends
- Color-coded data series

## 🎯 Key Features

### Agency Management
- Search and filter functionality
- CRUD operations with modals
- Type-based color coding
- Responsive card layout

### Fund Tracking
- Real-time utilization calculation
- Progress bars with color coding
- Currency formatting (INR)
- Status-based filtering

### Communication Hub
- Task assignment between agencies
- Priority and deadline management
- Status tracking (Pending, In Progress, Completed)
- Overdue task detection

### Reports Dashboard
- Key metrics cards
- Interactive charts
- Performance summaries
- Real-time data updates

## 🔌 API Integration

The frontend communicates with the backend through:
- Axios for HTTP requests
- Proxy configuration in Vite
- Error handling for failed requests
- Loading states for better UX

## 📱 Mobile Optimization

- Touch-friendly interface
- Collapsible navigation
- Responsive tables and charts
- Optimized form layouts
- Swipe gestures support

## 🚀 Performance

- Code splitting with React.lazy
- Optimized bundle size
- Lazy loading for images
- Efficient re-renders with React.memo
- Debounced search inputs

## 🎨 Accessibility

- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast color schemes
- Focus indicators

## 🔧 Customization

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Update navigation in `Navbar.jsx`

### Styling
- Use Tailwind utility classes
- Custom components in `index.css`
- Framer Motion for animations
- Responsive design patterns

### API Integration
- Add new endpoints in respective pages
- Use Axios for HTTP requests
- Handle loading and error states
- Update data after mutations
