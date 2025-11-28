# Weekly Planner Application

A modern, beautiful weekly planner application inspired by tweek.com but with enhanced UX. Features a 7-day grid view (Saturday to Friday) with hourly time slots from 6am to 11pm, allowing users to add tasks, mark them complete, and organize with colors and categories.

## Features

- **7-Day Week View**: Saturday to Friday layout with current week highlighted
- **Hourly Time Slots**: 6:00 AM to 11:00 PM (18 hours per day)
- **Task Management**: 
  - Add tasks to specific time slots
  - Edit task details (title, description, color, category)
  - Mark tasks as complete (strike-through effect)
  - Delete tasks
- **Drag & Drop**: Move tasks between time slots and days
- **Color Categories**: Assign colors to tasks for visual organization
- **LocalStorage Persistence**: All data saved in browser storage
- **Week Navigation**: Navigate between weeks, jump to today
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic dark mode based on system preference

## Technology Stack

- **Frontend**: React 18+ with Vite, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API + localStorage
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Backend**: Express.js API (future expansion)

## Getting Started

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Backend (Optional - for future API integration)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Project Structure

```
TODO/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── backend/                 # Future API structure
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── models/          # Data models
│   │   └── server.ts
│   └── package.json
└── README.md
```

## Usage

1. **Add a Task**: Click on any empty time slot to add a new task
2. **Edit a Task**: Click on an existing task to edit it
3. **Complete a Task**: Click the checkbox on a task to mark it complete
4. **Delete a Task**: Hover over a task and click the X button
5. **Move a Task**: Drag a task by its grip handle to move it to a different time slot or day
6. **Navigate Weeks**: Use the Previous/Next buttons or "Today" button in the header

## Future Enhancements

- Backend API integration for multi-device sync
- User authentication
- Task search and filtering
- Recurring tasks
- Data export/import
- Sharing capabilities
- Task reminders and notifications

## License

MIT

