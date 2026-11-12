import { FlightProvider, useFlight } from './state/FlightContext';
import { PassengerSetup } from './components/PassengerSetup';
import { PassengerTabs } from './components/PassengerTabs';
import { LayoutToggle } from './components/LayoutToggle';
import { SeatLegend } from './components/SeatLegend';
import { SeatMap } from './components/SeatMap';
import { MealSelector } from './components/MealSelector';
import { SummaryPanel } from './components/SummaryPanel';
import { NoticeBanner } from './components/NoticeBanner';
import { LoadingScreen } from './components/LoadingScreen';
import './App.css';

function FlightApp() {
  const { state } = useFlight();

  if (state.status === 'loading') return <LoadingScreen />;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Flight Seat Selection</h1>
        <p>Pick your passengers, choose seats, and see the total cost update instantly.</p>
      </header>

      <NoticeBanner />

      <div className="app-layout">
        <main className="app-main">
          <div className="toolbar">
            <PassengerSetup />
            <LayoutToggle />
          </div>
          <PassengerTabs />
          <SeatLegend />
          <SeatMap />
          <MealSelector />
        </main>

        <aside className="app-sidebar">
          <SummaryPanel />
        </aside>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FlightProvider>
      <FlightApp />
    </FlightProvider>
  );
}
