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
import { PrintableBoardingPass } from './components/PrintableBoardingPass';
import { CARRIER, DESTINATION, FLIGHT_NUMBER, ORIGIN } from './data/flightInfo';
import './App.css';

function FlightApp() {
  const { state } = useFlight();

  if (state.status === 'loading') return <LoadingScreen />;

  return (
    <div className="app">
      <h1 className="sr-only">Purr Air — flight seat selection</h1>
      <div className="flight-strip">
        <span className="flight-strip-carrier">{CARRIER}</span>
        <span className="flight-strip-route">
          <span>{ORIGIN}</span>
          <span className="flight-strip-route-line" aria-hidden="true" />
          <span>{DESTINATION}</span>
        </span>
        <span className="flight-strip-number">{FLIGHT_NUMBER}</span>
      </div>

      <p className="app-subhead">Pick your passengers, choose seats, and see the total cost update instantly.</p>

      <NoticeBanner />

      <div className="boarding-pass">
        <main className="coupon">
          <div className="toolbar">
            <PassengerSetup />
            <LayoutToggle />
          </div>
          <PassengerTabs />
          <SeatLegend />
          <SeatMap />
          <MealSelector />
        </main>

        <div className="perforation" aria-hidden="true">
          <span className="perforation-hole" />
          <span className="perforation-line" />
          <span className="perforation-hole" />
        </div>

        <aside className="stub">
          <SummaryPanel />
        </aside>
      </div>

      <PrintableBoardingPass />
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
