import type { FlightState, LayoutId, Passenger } from '../types';

export type FlightAction =
  | { type: 'READY' }
  | { type: 'SET_PASSENGER_COUNT'; count: number }
  | { type: 'SELECT_PASSENGER'; passengerId: string }
  | { type: 'SET_LAYOUT'; layout: LayoutId }
  | { type: 'ASSIGN_SEAT'; seatId: string; occupied: boolean }
  | { type: 'REMOVE_SEAT'; passengerId: string }
  | { type: 'SELECT_MEAL'; mealId: string }
  | { type: 'DISMISS_NOTICE' };

export const MAX_PASSENGERS = 6;

function makePassenger(index: number): Passenger {
  return {
    id: `p${index + 1}`,
    name: `Passenger ${index + 1}`,
    seatId: null,
    mealId: null,
  };
}

export const initialFlightState: FlightState = {
  status: 'loading',
  layout: '3-2',
  passengerCount: 1,
  passengers: [makePassenger(0)],
  selectedPassengerId: 'p1',
  notice: null,
};

function withNotice(state: FlightState, message: string, tone: 'error' | 'info' = 'error'): FlightState {
  return { ...state, notice: { tone, message } };
}

export function flightReducer(state: FlightState, action: FlightAction): FlightState {
  switch (action.type) {
    case 'READY':
      return { ...state, status: 'ready' };

    case 'SET_PASSENGER_COUNT': {
      const count = Math.max(1, Math.min(MAX_PASSENGERS, action.count));
      let passengers = state.passengers;

      if (count > passengers.length) {
        const added = Array.from({ length: count - passengers.length }, (_, i) => makePassenger(passengers.length + i));
        passengers = [...passengers, ...added];
      } else if (count < passengers.length) {
        passengers = passengers.slice(0, count);
      }

      const selectedStillExists = passengers.some((p) => p.id === state.selectedPassengerId);
      const selectedPassengerId = selectedStillExists ? state.selectedPassengerId : (passengers[0]?.id ?? null);

      return { ...state, passengerCount: count, passengers, selectedPassengerId, notice: null };
    }

    case 'SELECT_PASSENGER': {
      if (!state.passengers.some((p) => p.id === action.passengerId)) return state;
      return { ...state, selectedPassengerId: action.passengerId, notice: null };
    }

    case 'SET_LAYOUT': {
      if (action.layout === state.layout) return state;
      // Seat maps differ between layouts, so previously assigned seat ids
      // (e.g. "3C") would silently point at a different physical seat.
      // Clear assignments and tell the passenger why.
      const passengers = state.passengers.map((p) => ({ ...p, seatId: null }));
      return withNotice(
        { ...state, layout: action.layout, passengers },
        'Seat layout changed — please reselect seats for each passenger.',
        'info',
      );
    }

    case 'ASSIGN_SEAT': {
      const { seatId, occupied } = action;
      if (!state.selectedPassengerId) {
        return withNotice(state, 'Select a passenger before assigning a seat.');
      }
      if (occupied) {
        return withNotice(state, 'That seat is already occupied.');
      }
      const takenBy = state.passengers.find((p) => p.seatId === seatId);
      if (takenBy && takenBy.id !== state.selectedPassengerId) {
        return withNotice(state, `Seat ${seatId} is already assigned to ${takenBy.name}.`);
      }

      const passengers = state.passengers.map((p) =>
        p.id === state.selectedPassengerId ? { ...p, seatId } : p,
      );
      return { ...state, passengers, notice: null };
    }

    case 'REMOVE_SEAT': {
      const passengers = state.passengers.map((p) =>
        p.id === action.passengerId ? { ...p, seatId: null } : p,
      );
      return { ...state, passengers, notice: null };
    }

    case 'SELECT_MEAL': {
      if (!state.selectedPassengerId) {
        return withNotice(state, 'Select a passenger before choosing a meal.');
      }
      const passengers = state.passengers.map((p) =>
        p.id === state.selectedPassengerId ? { ...p, mealId: action.mealId } : p,
      );
      return { ...state, passengers, notice: null };
    }

    case 'DISMISS_NOTICE':
      return { ...state, notice: null };

    default:
      return state;
  }
}
