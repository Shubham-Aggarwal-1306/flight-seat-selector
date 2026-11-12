import { useEffect } from 'react';
import { useFlight } from '../state/FlightContext';

export function NoticeBanner() {
  const { state, dispatch } = useFlight();

  useEffect(() => {
    if (!state.notice) return;
    const timer = setTimeout(() => dispatch({ type: 'DISMISS_NOTICE' }), 3500);
    return () => clearTimeout(timer);
  }, [state.notice, dispatch]);

  if (!state.notice) return null;

  return (
    <div className={`notice-banner notice-banner--${state.notice.tone}`} role="status">
      {state.notice.message}
      <button type="button" className="notice-dismiss" onClick={() => dispatch({ type: 'DISMISS_NOTICE' })} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
