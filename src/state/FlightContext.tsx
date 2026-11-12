import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import { buildSeatMap } from '../data/seatData';
import { MEALS } from '../data/mealData';
import { flightReducer, initialFlightState, type FlightAction } from './flightReducer';
import type { FlightState, Passenger, Seat } from '../types';

interface FlightContextValue {
  state: FlightState;
  dispatch: Dispatch<FlightAction>;
  seats: Seat[];
  selectedPassenger: Passenger | null;
  passengerCost: (passenger: Passenger) => number;
  totalCost: number;
}

const FlightContext = createContext<FlightContextValue | null>(null);

export function FlightProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(flightReducer, initialFlightState);

  // Mock an initial data fetch so the app has something to show in a loading state.
  useEffect(() => {
    const timer = setTimeout(() => dispatch({ type: 'READY' }), 500);
    return () => clearTimeout(timer);
  }, []);

  const seats = useMemo(() => buildSeatMap(state.layout), [state.layout]);

  const seatPriceById = useMemo(() => {
    const map = new Map<string, number>();
    for (const seat of seats) map.set(seat.id, seat.price);
    return map;
  }, [seats]);

  const mealPriceById = useMemo(() => new Map(MEALS.map((m) => [m.id, m.price])), []);

  const passengerCost = useMemo(
    () => (passenger: Passenger) => {
      const seatPrice = passenger.seatId ? (seatPriceById.get(passenger.seatId) ?? 0) : 0;
      const mealPrice = passenger.mealId ? (mealPriceById.get(passenger.mealId) ?? 0) : 0;
      return seatPrice + mealPrice;
    },
    [seatPriceById, mealPriceById],
  );

  const totalCost = useMemo(
    () => state.passengers.reduce((sum, p) => sum + passengerCost(p), 0),
    [state.passengers, passengerCost],
  );

  const selectedPassenger = state.passengers.find((p) => p.id === state.selectedPassengerId) ?? null;

  const value: FlightContextValue = {
    state,
    dispatch,
    seats,
    selectedPassenger,
    passengerCost,
    totalCost,
  };

  return <FlightContext.Provider value={value}>{children}</FlightContext.Provider>;
}

export function useFlight(): FlightContextValue {
  const ctx = useContext(FlightContext);
  if (!ctx) throw new Error('useFlight must be used within a FlightProvider');
  return ctx;
}
