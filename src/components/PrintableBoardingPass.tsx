import { useEffect, useRef, useState } from 'react';
import * as QRCode from 'qrcode';
import { useFlight } from '../state/FlightContext';
import { boardingPassNumber, boardingPassQrPayload } from '../lib/boardingPass';
import { CARRIER, DESTINATION, FLIGHT_NUMBER, ORIGIN } from '../data/flightInfo';

export function PrintableBoardingPass() {
  const { state, printingPassengerId, endPrint } = useFlight();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const hasPrintedRef = useRef(false);

  const passenger = state.passengers.find((p) => p.id === printingPassengerId) ?? null;

  useEffect(() => {
    if (!passenger) {
      setQrDataUrl(null);
      return;
    }
    hasPrintedRef.current = false;
    let cancelled = false;
    QRCode.toDataURL(boardingPassQrPayload(passenger, FLIGHT_NUMBER), {
      width: 132,
      margin: 1,
      color: { dark: '#0e1a2b', light: '#f7f3e8' },
    }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passenger?.id, passenger?.seatId]);

  useEffect(() => {
    if (!passenger || !qrDataUrl || hasPrintedRef.current) return;
    hasPrintedRef.current = true;
    const id = requestAnimationFrame(() => window.print());
    return () => cancelAnimationFrame(id);
  }, [passenger, qrDataUrl]);

  useEffect(() => {
    const handleAfterPrint = () => endPrint();
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, [endPrint]);

  if (!passenger) return null;

  return (
    <div className="print-pass-sheet">
      <div className="print-pass">
        <div className="print-pass-header">
          <span className="print-pass-carrier">{CARRIER}</span>
          <span className="print-pass-flight">{FLIGHT_NUMBER}</span>
        </div>
        <div className="print-pass-route">
          <span>{ORIGIN}</span>
          <span className="print-pass-route-line" />
          <span>{DESTINATION}</span>
        </div>
        <dl className="print-pass-grid">
          <div>
            <dt>Passenger</dt>
            <dd>{passenger.name.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Seat</dt>
            <dd>{passenger.seatId ?? '—'}</dd>
          </div>
          <div>
            <dt>Boarding pass no.</dt>
            <dd>{boardingPassNumber(passenger)}</dd>
          </div>
        </dl>
        <div className="print-pass-foot">
          {qrDataUrl && <img src={qrDataUrl} alt="" width={110} height={110} />}
          <div className="print-pass-barcode" />
        </div>
      </div>
    </div>
  );
}
