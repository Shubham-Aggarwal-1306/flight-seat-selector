import { useFlight } from '../state/FlightContext';
import { MEALS } from '../data/mealData';

export function SummaryPanel() {
  const { state, dispatch, passengerCost, totalCost, requestPrint } = useFlight();

  return (
    <div className="panel summary-panel">
      <h2>Boarding stub</h2>
      <ul className="summary-list">
        {state.passengers.map((passenger) => {
          const meal = MEALS.find((m) => m.id === passenger.mealId);
          return (
            <li key={passenger.id} className="summary-row">
              <div className="summary-row-main">
                <span className="summary-passenger-name">{passenger.name}</span>
                <span className="summary-passenger-detail">
                  {passenger.seatId ? `Seat ${passenger.seatId}` : 'No seat selected'}
                </span>
                {meal && meal.id !== 'none' && <span className="summary-passenger-detail">{meal.name}</span>}
              </div>
              <div className="summary-row-end">
                <span className="summary-row-cost">₹{passengerCost(passenger)}</span>
                {passenger.seatId && (
                  <div className="summary-row-actions">
                    <button type="button" className="link-button" onClick={() => requestPrint(passenger.id)}>
                      Print pass
                    </button>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => dispatch({ type: 'REMOVE_SEAT', passengerId: passenger.id })}
                    >
                      Remove seat
                    </button>
                  </div>
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
      <div className="stub-barcode" aria-hidden="true" />
    </div>
  );
}
