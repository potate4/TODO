import { PlannerProvider } from './context/PlannerContext';
import { Header } from './components/Header';
import { WeekView } from './components/WeekView';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <PlannerProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
        <div className="w-full">
          <WeekView />
        </div>
        </div>
      </PlannerProvider>
    </ErrorBoundary>
  );
}

export default App;

