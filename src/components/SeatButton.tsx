import type { Seat } from '../types';

export type SeatStatus = 'available' | 'occupied' | 'selected' | 'taken-by-other';

interface SeatButtonProps {
  seat: Seat;
  status: SeatStatus;
  occupantLabel?: string;
  onSelect: (seatId: string) => void;
}

const STATUS_LABEL: Record<SeatStatus, string> = {
  available: 'available',
  occupied: 'occupied',
  selected: 'assigned to current passenger',
  'taken-by-other': 'assigned to another passenger',
};

export function SeatButton({ seat, status, occupantLabel, onSelect }: SeatButtonProps) {
  const disabled = status === 'occupied' || status === 'taken-by-other';

  return (
    <button
      type="button"
      className={`seat seat--${status} seat--${seat.category}`}
      disabled={disabled}
      onClick={() => onSelect(seat.id)}
      title={`Seat ${seat.id} · ${seat.price === 0 ? 'Free' : `₹${seat.price}`} · ${STATUS_LABEL[status]}`}
      aria-label={`Seat ${seat.id}, ${STATUS_LABEL[status]}, ${seat.price === 0 ? 'free' : `₹${seat.price}`}`}
    >
      <span className="seat-id">{seat.id}</span>
      {occupantLabel && <span className="seat-occupant">{occupantLabel}</span>}
    </button>
  );
}
