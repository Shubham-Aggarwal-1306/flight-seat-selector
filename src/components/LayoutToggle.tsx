import { useFlight } from '../state/FlightContext';
import { LAYOUTS } from '../data/seatData';
import type { LayoutId } from '../types';

export function LayoutToggle() {
  const { state, dispatch } = useFlight();

  return (
    <div className="layout-toggle" role="radiogroup" aria-label="Aircraft seating configuration">
      {(Object.keys(LAYOUTS) as LayoutId[]).map((id) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={state.layout === id}
          className={`layout-toggle-btn${state.layout === id ? ' layout-toggle-btn--active' : ''}`}
          onClick={() => dispatch({ type: 'SET_LAYOUT', layout: id })}
        >
          {LAYOUTS[id].label}
        </button>
      ))}
    </div>
  );
}
