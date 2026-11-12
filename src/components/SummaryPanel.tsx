import { useFlight } from '../state/FlightContext';
import { MEALS } from '../data/mealData';

export function SummaryPanel() {
  const { state, dispatch, passengerCost, totalCost } = useFlight();

  return (
    <div className="panel summary-panel">
      <h2>Booking summary</h2>
      <ul className="summary-list">
        {state.passengers.map((passenger) => {
          const meal = MEALS.find((m) => m.id === passenger.mealId);
          return (
            <li key={passenger.id} className="summary-row">
              <div className="summary-row-main">
                <span className="summary-passenger-name">{passenger.name}</span>
                <span className="summary-passenger-detail">
                  {passenger.seatId ? `Seat ${passenger.seatId}` : 'No seat selected'}
                  {meal && meal.id !== 'none' ? ` · ${meal.name}` : ''}
                </span>
              </div>
              <div className="summary-row-end">
                <span className="summary-row-cost">₹{passengerCost(passenger)}</span>
                {passenger.seatId && (
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => dispatch({ type: 'REMOVE_SEAT', passengerId: passenger.id })}
                  >
                    Remove seat
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="summary-total">
        <span>Total</span>
        <span>₹{totalCost}</span>
      </div>
    </div>
  );
}
