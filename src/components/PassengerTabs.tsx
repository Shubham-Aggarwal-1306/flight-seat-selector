import { useFlight } from '../state/FlightContext';

export function PassengerTabs() {
  const { state, dispatch, passengerCost } = useFlight();

  return (
    <div className="panel passenger-tabs" role="tablist" aria-label="Passengers">
      {state.passengers.map((passenger) => {
        const isSelected = passenger.id === state.selectedPassengerId;
        return (
          <button
            key={passenger.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            className={`passenger-tab${isSelected ? ' passenger-tab--active' : ''}`}
            onClick={() => dispatch({ type: 'SELECT_PASSENGER', passengerId: passenger.id })}
          >
            <span className="passenger-tab-name">{passenger.name}</span>
            <span className="passenger-tab-seat">{passenger.seatId ?? 'No seat'}</span>
            {passengerCost(passenger) > 0 && (
              <span className="passenger-tab-cost">₹{passengerCost(passenger)}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
