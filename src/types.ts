export type LayoutId = '3-2' | '2-3-2';

export type SeatCategory = 'standard' | 'extra-legroom' | 'premium';

export interface Seat {
  id: string; // e.g. "3C"
  row: number;
  col: string; // e.g. "C"
  category: SeatCategory;
  price: number;
  /** Pre-booked by someone outside this session; never selectable. */
  occupied: boolean;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Passenger {
  id: string;
  name: string;
  seatId: string | null;
  mealId: string | null;
}

export interface FlightState {
  status: 'loading' | 'ready';
  layout: LayoutId;
  passengerCount: number;
  passengers: Passenger[];
  selectedPassengerId: string | null;
  /** Transient feedback shown for invalid actions, cleared after a few seconds. */
  notice: { tone: 'error' | 'info'; message: string } | null;
}
