import type { Passenger } from '../types';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid ambiguity

/**
 * Deterministic 6-character pass number derived from the passenger and their
 * seat, so reprinting the same assignment always yields the same code
 * instead of a fresh random one on every render.
 */
export function boardingPassNumber(passenger: Passenger): string {
  const seed = `${passenger.id}:${passenger.seatId ?? 'NOSEAT'}`;
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  hash >>>= 0;

  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += CODE_CHARS[hash % CODE_CHARS.length];
    hash = (hash * 48271) % 2147483647;
  }
  return code;
}

export function boardingPassQrPayload(passenger: Passenger, flightNumber: string): string {
  return [
    `BPN:${boardingPassNumber(passenger)}`,
    `FLT:${flightNumber}`,
    `SEAT:${passenger.seatId ?? '-'}`,
    `PAX:${passenger.name.toUpperCase()}`,
  ].join(' ');
}
