# Flight Seat Selection & Passenger Management

A flight seat selection interface built with **React + TypeScript + Vite**. Users pick a
passenger count, assign each passenger a seat on one of two aircraft layouts, pick an
optional meal per passenger, and see the total cost update live. All data is mocked —
there is no backend.

The UI is styled as a two-part boarding pass — a dark flight-header strip, a ticket-paper
"coupon" holding the booking flow, a perforated tear-line, and a narrow "stub" holding the
running total — rather than a generic dashboard, since that's the real object this task is
modeling.

## Running it

```bash
npm install
npm run dev       # start the dev server
npm run build      # type-check + production build
npm run preview    # serve the production build locally
```

## Project structure

```
src/
  types.ts                 Shared domain types (Seat, Passenger, Meal, FlightState)
  data/
    seatData.ts             Generates the seat map for each layout (id, category, price, pre-occupied)
    mealData.ts              Mock meal catalog
  state/
    flightReducer.ts         Pure reducer: all booking logic lives here
    FlightContext.tsx        React Context + useReducer provider, derived values (totals, selected passenger)
  components/                Presentational components (props/context in, dispatch out)
  App.tsx                    Composes the screen
```

## State management

State is a single `FlightState` object held in a `useReducer` at the root of the app and
shared via React Context (`FlightProvider` / `useFlight()`). There's no external state
library — the booking fits comfortably in one reducer, and `useReducer` makes every
transition an explicit, testable, pure function instead of a scatter of `useState` calls
and effects.

```ts
interface FlightState {
  status: 'loading' | 'ready';
  layout: '3-2' | '2-3-2';
  passengerCount: number;
  passengers: Passenger[];       // { id, name, seatId, mealId }
  selectedPassengerId: string | null;
  notice: { tone: 'error' | 'info'; message: string } | null;
}
```

- **Seat data is not duplicated into state.** `buildSeatMap(layout)` is a pure function of
  the layout id, so the seat map (ids, categories, prices, which seats are pre-occupied) is
  derived with `useMemo` in `FlightContext` rather than stored and kept in sync.
- **Passengers are the single source of truth for assignments.** A seat isn't "state" on
  its own — a passenger simply has a `seatId`. Whether a given seat button renders as
  available / selected / taken-by-another-passenger / occupied is computed on render by
  cross-referencing the seat map against `passengers`, so there's no way for a seat and a
  passenger to disagree about who holds it.
- **Derived values (`seats`, `totalCost`, `passengerCost`, `selectedPassenger`) are computed
  in the context**, not stored, so they can never go stale relative to `passengers`/`layout`.
- **`notice`** is a one-slot transient message used for both error feedback (e.g. "select a
  passenger first") and info feedback (e.g. layout changed), auto-dismissed after a few
  seconds by `NoticeBanner`.

## Seat assignment logic

All of this lives in `flightReducer.ts` as pure, unit-testable transitions:

- **`SELECT_PASSENGER`** sets `selectedPassengerId`. Seat clicks always act on the
  *currently selected* passenger, enforcing "select a passenger before assigning a seat" —
  if none is selected, `ASSIGN_SEAT` rejects with a notice instead of silently no-oping.
- **`ASSIGN_SEAT`** validates, in order: a passenger is selected → the seat isn't `occupied`
  (pre-booked, never selectable) → the seat isn't already held by a *different* passenger in
  this booking. Only then does it set `seatId` on the selected passenger. Re-clicking a seat
  that is already the selected passenger's own seat is a no-op assignment (idempotent).
- **`REMOVE_SEAT`** clears a specific passenger's `seatId`, used by both the "Remove seat"
  action in the summary and (implicitly) by changing a passenger's seat, since assigning a
  new seat simply overwrites the old `seatId` — a passenger can never hold two seats because
  the field is scalar, not a set.
- **Switching passengers retains assignments** for free: assignments live on the `Passenger`
  objects, not on a "currently active" scratch space, so tabbing between passengers never
  loses anything.
- **Switching aircraft layout (`SET_LAYOUT`) clears every passenger's `seatId`.** Seat ids are
  reused across layouts (e.g. `"3C"` exists in both the 3–2 and 2–3–2 maps) but refer to a
  physically different seat with a different price, so silently carrying an assignment across
  layouts would be wrong. The reducer clears assignments and surfaces an info notice
  explaining why, rather than guessing a mapping.
- **`SET_PASSENGER_COUNT`** grows/shrinks the passenger list from the end. Shrinking drops
  the removed passengers' seat assignments with them (their seats become available again,
  since the seat map derives "taken" status from the live `passengers` array); if the
  currently selected passenger was removed, selection falls back to the first remaining one.
- **Pricing** (`passengerCost`) is `seat price + meal price`, looked up from the seat map and
  meal catalog by id — never duplicated onto the passenger. `totalCost` sums that across all
  passengers. Both are `useMemo`-derived in `FlightContext`, so the total recalculates
  immediately on any assignment, change, removal, or meal pick with no extra plumbing.

## Features implemented

- Passenger count selector (1–6) with a tabbed passenger switcher that retains each
  passenger's seat/meal when switching.
- Two seat layouts (3–2 and 2–3–2) with row numbers, column labels, and a layout switch.
- Seat states: available, selected (current passenger), assigned-to-another-passenger,
  occupied (pre-booked, not selectable) — plus a category indicator (Standard / Premium /
  Extra Legroom) with per-category pricing, including free seats.
- Seat price shown on hover/selection and in the booking summary.
- Per-passenger and overall total, updated immediately on any change.
- Inline feedback for invalid actions (no passenger selected, seat already taken, occupied
  seat) via a dismissible notice banner.
- Simulated loading state on first load; responsive layout down to phone width.
- **Bonus:** per-passenger meal selection (free and paid options), included in totals.
- **Bonus:** "Print pass" per passenger (once a seat is assigned) opens the browser print
  dialog with a dedicated boarding-pass layout — flight, passenger, seat, a deterministic
  boarding pass number, and a scannable QR code encoding it. The QR is generated client-side
  (`qrcode` package) from a payload built in `src/lib/boardingPass.ts`; nothing is sent over
  the network. Printing is page-local UI state in `FlightContext` (not part of the booking
  reducer), driven by the browser's `afterprint` event so the state resets whether the user
  prints or cancels.

## Notes

- All data (`seatData.ts`, `mealData.ts`) is mocked locally — no backend/API calls.
- No seat/meal data is persisted between reloads; this matches the assessment's "local state
  management" scope.
