/**
 * Tokens de tema. Se agrupan por parte de la interfaz para que la API pueda personalizar
 * un grupo (p. ej. solo `tabBar`) sin enviar todo. Cualquier token ausente se deriva de los
 * colores del equipo (`derive.ts`).
 */
export type ThemeTokens = {
  /** Campo de color que hay detrás de toda la app. */
  background: { base: string; top: string; bottom: string; blobA: string; blobB: string; blobC: string };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    /** Texto e iconos de acento sobre superficies claras u oscuras de lectura. */
    accent: string;
    /** Texto sobre `brand.primary`. */
    onBrand: string;
    /** Texto sobre `brand.action`. */
    onAction: string;
    /** Texto sobre los paneles teñidos con `panel.tint`. */
    onPanel: string;
    onPanelSoft: string;
  };
  /** Cajas: vidrio, filetes y fondos suaves. */
  surface: {
    glass: string;
    glassStrong: string;
    glassBorder: string;
    glassShadow: string;
    /** Respaldo casi opaco cuando el usuario reduce la transparencia. */
    glassOpaque: string;
    line: string;
    accentSoft: string;
    switchOff: string;
  };
  brand: { primary: string; primaryPressed: string; action: string; actionPressed: string };
  tabBar: { activeBackground: string; activeContent: string; inactiveContent: string };
  /** Paneles grandes teñidos con el color del club. */
  panel: { tint: string };
  feedback: { danger: string; success: string };
};

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

/** Tokens ya resueltos y aplanados: lo que consumen los componentes vía `useTheme()`. */
export type ThemeColors = {
  text: string;
  textSecondary: string;
  textTertiary: string;
  accentText: string;
  onPrimary: string;
  onAction: string;
  onPanel: string;
  onPanelSoft: string;
  background: string;
  backdropTop: string;
  backdropBottom: string;
  blobA: string;
  blobB: string;
  blobC: string;
  primary: string;
  primaryPressed: string;
  action: string;
  actionPressed: string;
  glassFill: string;
  glassStrongFill: string;
  glassBorder: string;
  glassShadow: string;
  glassOpaque: string;
  line: string;
  accentSoft: string;
  switchOff: string;
  tabActive: string;
  onTabActive: string;
  tabInactive: string;
  panelTint: string;
  danger: string;
  success: string;
};

export type ThemeColor = keyof ThemeColors;

export type ColorScheme = 'light' | 'dark';

export function flattenTokens(t: ThemeTokens): ThemeColors {
  return {
    text: t.text.primary,
    textSecondary: t.text.secondary,
    textTertiary: t.text.tertiary,
    accentText: t.text.accent,
    onPrimary: t.text.onBrand,
    onAction: t.text.onAction,
    onPanel: t.text.onPanel,
    onPanelSoft: t.text.onPanelSoft,
    background: t.background.base,
    backdropTop: t.background.top,
    backdropBottom: t.background.bottom,
    blobA: t.background.blobA,
    blobB: t.background.blobB,
    blobC: t.background.blobC,
    primary: t.brand.primary,
    primaryPressed: t.brand.primaryPressed,
    action: t.brand.action,
    actionPressed: t.brand.actionPressed,
    glassFill: t.surface.glass,
    glassStrongFill: t.surface.glassStrong,
    glassBorder: t.surface.glassBorder,
    glassShadow: t.surface.glassShadow,
    glassOpaque: t.surface.glassOpaque,
    line: t.surface.line,
    accentSoft: t.surface.accentSoft,
    switchOff: t.surface.switchOff,
    tabActive: t.tabBar.activeBackground,
    onTabActive: t.tabBar.activeContent,
    tabInactive: t.tabBar.inactiveContent,
    panelTint: t.panel.tint,
    danger: t.feedback.danger,
    success: t.feedback.success,
  };
}

/** Mezcla recursiva; de `over` solo se aceptan hojas de tipo string (lo que mande la API no rompe el tema). */
export function mergeTokens<T extends object>(base: T, over: unknown): T {
  if (!over || typeof over !== 'object') return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(over as Record<string, unknown>)) {
    const current = out[key];
    if (current && typeof current === 'object') {
      out[key] = mergeTokens(current as object, value);
    } else if (typeof current === 'string' && typeof value === 'string' && value.trim()) {
      out[key] = value;
    }
  }
  return out as T;
}
