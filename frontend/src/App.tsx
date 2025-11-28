import { PlannerProvider } from './context/PlannerContext';
import { Header } from './components/Header';
import { WeekView } from './components/WeekView';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <PlannerProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <Header />
        <div className="w-full py-6">
          <WeekView />
        </div>
        </div>
      </PlannerProvider>
    </ErrorBoundary>
  );
}

export default App;

