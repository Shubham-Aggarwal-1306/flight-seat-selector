const ITEMS: { status: string; label: string }[] = [
  { status: 'available', label: 'Available' },
  { status: 'selected', label: 'Your selection' },
  { status: 'taken-by-other', label: 'Assigned (other passenger)' },
  { status: 'occupied', label: 'Occupied' },
];

const CATEGORIES: { category: string; label: string }[] = [
  { category: 'standard', label: 'Standard · Free' },
  { category: 'premium', label: 'Premium · ₹250' },
  { category: 'extra-legroom', label: 'Extra Legroom · ₹350' },
];

export function SeatLegend() {
  return (
    <div className="legend">
      <div className="legend-group">
        {ITEMS.map((item) => (
          <span key={item.status} className="legend-item">
            <span className={`legend-swatch seat--${item.status}`} />
            {item.label}
          </span>
        ))}
      </div>
      <div className="legend-group">
        {CATEGORIES.map((item) => (
          <span key={item.category} className="legend-item">
            <span className={`legend-swatch seat--available seat--${item.category}`} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
