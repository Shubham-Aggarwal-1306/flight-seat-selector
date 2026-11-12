import { useFlight } from '../state/FlightContext';
import { LAYOUTS } from '../data/seatData';
import { SeatButton, type SeatStatus } from './SeatButton';
import { DESTINATION, DURATION, FLIGHT_NUMBER, ORIGIN } from '../data/flightInfo';
import type { Seat } from '../types';

export function SeatMap() {
  const { state, seats, dispatch } = useFlight();
  const config = LAYOUTS[state.layout];

  const seatsByRowAndCol = new Map<string, Seat>();
  for (const seat of seats) seatsByRowAndCol.set(`${seat.row}${seat.col}`, seat);

  const takenSeatIds = new Set(
    state.passengers.map((p) => p.seatId).filter((id): id is string => id !== null),
  );
  const availableCount = seats.filter((s) => !s.occupied && !takenSeatIds.has(s.id)).length;

  function statusFor(seat: Seat): { status: SeatStatus; occupantLabel?: string } {
    if (seat.occupied) return { status: 'occupied' };
    const owner = state.passengers.find((p) => p.seatId === seat.id);
    if (owner && owner.id === state.selectedPassengerId) return { status: 'selected' };
    if (owner) return { status: 'taken-by-other', occupantLabel: owner.name.split(' ')[1] ?? owner.name };
    return { status: 'available' };
  }

  function handleSelect(seatId: string) {
    const seat = seatsByRowAndCol.get(seatId);
    dispatch({ type: 'ASSIGN_SEAT', seatId, occupied: seat?.occupied ?? true });
  }

  return (
    <div className="seat-map-section">
      <div className="seat-map" role="grid" aria-label={`Seat map, ${config.label}`}>
        <div className="seat-map-header">
          <span className="row-number-spacer" />
          {config.columnGroups.map((group, gi) => (
            <span key={gi} className="seat-column-group-header">
              {group.map((col) => (
                <span key={col} className="seat-col-label">
                  {col}
                </span>
              ))}
            </span>
          ))}
        </div>

        {Array.from({ length: config.rows }, (_, i) => i + 1).map((row) => (
          <div key={row} className="seat-row">
            <span className="row-number">{row}</span>
            {config.columnGroups.map((group, gi) => (
              <span key={gi} className="seat-group">
                {group.map((col) => {
                  const seat = seatsByRowAndCol.get(`${row}${col}`);
                  if (!seat) return null;
                  const { status, occupantLabel } = statusFor(seat);
                  return (
                    <SeatButton key={seat.id} seat={seat} status={status} occupantLabel={occupantLabel} onSelect={handleSelect} />
                  );
                })}
              </span>
            ))}
          </div>
        ))}
      </div>

      <aside className="seat-info-panel" aria-label="Flight details">
        <dl>
          <div>
            <dt>Configuration</dt>
            <dd>{config.label}</dd>
          </div>
          <div>
            <dt>Flight</dt>
            <dd>{FLIGHT_NUMBER}</dd>
          </div>
          <div>
            <dt>Route</dt>
            <dd>
              {ORIGIN} → {DESTINATION}
            </dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{DURATION}</dd>
          </div>
          <div>
            <dt>Seats</dt>
            <dd>{seats.length}</dd>
          </div>
          <div>
            <dt>Available</dt>
            <dd>{availableCount}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
