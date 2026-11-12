import type { LayoutId, Seat, SeatCategory } from '../types';

const PRICE_BY_CATEGORY: Record<SeatCategory, number> = {
  'extra-legroom': 350,
  premium: 250,
  standard: 0,
};

interface LayoutConfig {
  id: LayoutId;
  label: string;
  rows: number;
  /** Column groups, in left-to-right order; each inner array is one side of an aisle. */
  columnGroups: string[][];
}

export const LAYOUTS: Record<LayoutId, LayoutConfig> = {
  '3-2': {
    id: '3-2',
    label: '3–2 Configuration',
    rows: 8,
    columnGroups: [
      ['A', 'B', 'C'],
      ['D', 'E'],
    ],
  },
  '2-3-2': {
    id: '2-3-2',
    label: '2–3–2 Configuration',
    rows: 8,
    columnGroups: [
      ['A', 'B'],
      ['D', 'E', 'F'],
      ['G', 'H'],
    ],
  },
};

function categoryFor(row: number, col: string, columnGroups: string[][]): SeatCategory {
  if (row <= 2) return 'extra-legroom';
  if (row <= 4) return 'premium';
  const isAisleAdjacent = columnGroups.some((group) => group[0] === col || group[group.length - 1] === col);
  if (row >= 7 && isAisleAdjacent) return 'standard';
  return 'standard';
}

// Deterministic set of seats pre-booked by travelers outside this session,
// so the "occupied" state has something to show without a backend.
const PRE_OCCUPIED: Record<LayoutId, string[]> = {
  '3-2': ['1A', '1B', '3C', '4D', '5A', '6E', '7B'],
  '2-3-2': ['1A', '1B', '2G', '3E', '4D', '5H', '6F'],
};

export function buildSeatMap(layoutId: LayoutId): Seat[] {
  const config = LAYOUTS[layoutId];
  const occupied = new Set(PRE_OCCUPIED[layoutId]);
  const seats: Seat[] = [];

  for (let row = 1; row <= config.rows; row += 1) {
    for (const group of config.columnGroups) {
      for (const col of group) {
        const category = categoryFor(row, col, config.columnGroups);
        const id = `${row}${col}`;
        seats.push({
          id,
          row,
          col,
          category,
          price: PRICE_BY_CATEGORY[category],
          occupied: occupied.has(id),
        });
      }
    }
  }

  return seats;
}

export const CATEGORY_LABEL: Record<SeatCategory, string> = {
  standard: 'Standard',
  'extra-legroom': 'Extra Legroom',
  premium: 'Premium',
};
