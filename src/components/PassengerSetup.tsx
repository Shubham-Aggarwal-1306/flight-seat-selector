import { useFlight } from '../state/FlightContext';
import { MAX_PASSENGERS } from '../state/flightReducer';

export function PassengerSetup() {
  const { state, dispatch } = useFlight();

  return (
    <div className="panel passenger-setup">
      <label htmlFor="passenger-count">Number of passengers</label>
      <div className="stepper">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_PASSENGER_COUNT', count: state.passengerCount - 1 })}
          disabled={state.passengerCount <= 1}
          aria-label="Decrease passenger count"
        >
          −
        </button>
        <span id="passenger-count" className="stepper-value">
          {state.passengerCount}
        </span>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_PASSENGER_COUNT', count: state.passengerCount + 1 })}
          disabled={state.passengerCount >= MAX_PASSENGERS}
          aria-label="Increase passenger count"
        >
          +
        </button>
      </div>
      <span className="hint">Up to {MAX_PASSENGERS} passengers per booking</span>
    </div>
  );
}
