/** Utilidades de color sin dependencias de la app (también las usa el script que genera el JSON de ejemplo). */

const HEX = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i;

export const INK = '#1a171b';
export const PAPER = '#f1f4f7';

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX.test(value.trim());
}

export function parseHex(hex: string): [number, number, number] {
  let h = hex.trim().slice(1);
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

export function toHex([r, g, b]: [number, number, number]) {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

/** Mezcla `a` hacia `b`: t=0 es `a`, t=1 es `b`. */
export function mix(a: string, b: string, t: number) {
  const ca = parseHex(a);
  const cb = parseHex(b);
  return toHex(ca.map((v, i) => v + (cb[i] - v) * t) as [number, number, number]);
}

/** Luminancia relativa WCAG, 0 (negro) a 1 (blanco). */
export function luminance(hex: string) {
  const [r, g, b] = parseHex(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Tinta o blanco, lo que mejor contraste dé sobre `hex`. */
export function readableOn(hex: string) {
  return contrast(hex, INK) >= contrast(hex, '#ffffff') ? INK : '#ffffff';
}

/** Oscurece o aclara `hex` hasta alcanzar `min` de contraste contra `bg`. */
export function ensureContrast(hex: string, bg: string, min: number, toward: 'darker' | 'lighter') {
  const target = toward === 'darker' ? '#000000' : '#ffffff';
  for (let t = 0; t <= 1.0001; t += 0.05) {
    const candidate = mix(hex, target, t);
    if (contrast(candidate, bg) >= min) return candidate;
  }
  return target;
}

/** `#rrggbb` + opacidad → `rgba(...)`. */
export function withAlpha(hex: string, alpha: number) {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
