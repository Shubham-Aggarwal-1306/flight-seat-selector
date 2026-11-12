import { useFlight } from '../state/FlightContext';
import { MEALS } from '../data/mealData';

export function MealSelector() {
  const { state, dispatch, selectedPassenger } = useFlight();

  if (!selectedPassenger) {
    return (
      <div className="panel meal-selector">
        <h2>Meal selection</h2>
        <p className="empty-state">Select a passenger to choose a meal.</p>
      </div>
    );
  }

  return (
    <div className="panel meal-selector">
      <h2>Meal for {selectedPassenger.name}</h2>
      <div className="meal-options">
        {MEALS.map((meal) => {
          const isSelected = selectedPassenger.mealId === meal.id;
          return (
            <button
              key={meal.id}
              type="button"
              className={`meal-option${isSelected ? ' meal-option--active' : ''}`}
              aria-pressed={isSelected}
              onClick={() => dispatch({ type: 'SELECT_MEAL', mealId: meal.id })}
            >
              <span className="meal-name">{meal.name}</span>
              <span className="meal-description">{meal.description}</span>
              <span className="meal-price">{meal.price === 0 ? 'Free' : `₹${meal.price}`}</span>
            </button>
          );
        })}
      </div>
      {state.notice?.message.includes('meal') && <p className="error-text">{state.notice.message}</p>}
    </div>
  );
}
