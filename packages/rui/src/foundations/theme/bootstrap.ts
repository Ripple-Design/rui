import type { RTheme, RThemeModePreference, RThemePatch } from "./types"

import { themeToCSSVars } from "./core"
import { defaultDayNightTheme } from "./defaults"
import { resolveActiveTheme, resolveDayNightTheme, resolveThemeMode } from "./resolve"

export type ThemeBootstrapStorage = {
    get: (key: string) => string | null
}

export type ThemeBootstrapResult = {
    attrs: {
        dir?: string
        theme?: string
    }
    colorScheme: "light" | "dark"
    mode: ReturnType<typeof resolveThemeMode>
    theme: RTheme
    vars: Record<string, string>
}

export function resolveThemeBootstrapState(options: {
    defaults?: typeof defaultDayNightTheme
    dir?: string
    mode?: RThemeModePreference
    patch?: RThemePatch
}) {
    const defaults = options.defaults ?? defaultDayNightTheme
    const mode = options.mode ?? "system"
    const resolvedMode = resolveThemeMode(mode)
    const themes = resolveDayNightTheme(defaults, options.patch ?? {})
    const activeTheme = resolveActiveTheme(themes, mode)

    return {
        attrs: {
            dir: options.dir,
            theme: resolvedMode,
        },
        colorScheme: resolvedMode === "night" ? "dark" : "light",
        mode: resolvedMode,
        theme: activeTheme,
        vars: themeToCSSVars(activeTheme),
    } satisfies ThemeBootstrapResult
}

export function createThemeBootstrapScript(options: {
    defaults: typeof defaultDayNightTheme
    dirStorageKey?: string
    modeKey: string
    patchKey: string
    normalizePatchScript: string
    normalizeModeScript?: string
}) {
    const dirStorageKey = options.dirStorageKey ?? "rui-docs-dir"
    const defaults = JSON.stringify(options.defaults)
    const normalizeModeScript = options.normalizeModeScript ?? "(mode) => mode === 'day' || mode === 'night' || mode === 'system' ? mode : 'system'"

    return `(() => {
  const defaults = ${defaults};
  const readStorage = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const mergeTheme = (base, next) => ({
    color: { ...base.color, ...next.color },
    density: next.density ?? base.density,
    iconStyle: next.iconStyle ?? base.iconStyle,
    shape: {
      small: { ...base.shape?.small, ...next.shape?.small },
      medium: { ...base.shape?.medium, ...next.shape?.medium },
      large: { ...base.shape?.large, ...next.shape?.large },
      full: { ...base.shape?.full, ...next.shape?.full },
      icon: { ...base.shape?.icon, ...next.shape?.icon },
    },
  });
  const resolveMode = (mode) => {
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
    }
    return mode;
  };
  const resolveDayNightTheme = (base, patch) => {
    const { day, night, ...shared } = patch;
    return {
      day: mergeTheme(mergeTheme(base.day, shared), day ?? {}),
      night: mergeTheme(mergeTheme(base.night, shared), night ?? {}),
    };
  };
  const deriveContrastColors = (colors) => {
    if (!colors) return colors;
    const nextColors = { ...colors };
    if (colors.primary) {
      nextColors.primaryLow = colors.primaryLow ?? ('rgb(from ' + colors.primary + ' r g b / 0.38)');
    }
    if (colors.onSurface) {
      nextColors.onSurfaceHigh = colors.onSurfaceHigh ?? ('rgb(from ' + colors.onSurface + ' r g b / 0.87)');
      nextColors.onSurfaceMedium = colors.onSurfaceMedium ?? ('rgb(from ' + colors.onSurface + ' r g b / 0.54)');
      nextColors.onSurfaceLow = colors.onSurfaceLow ?? ('rgb(from ' + colors.onSurface + ' r g b / 0.38)');
      nextColors.onSurfaceOutline = colors.onSurfaceOutline ?? ('rgb(from ' + colors.onSurface + ' r g b / 0.12)');
    }
    if (colors.onPrimary) {
      nextColors.onPrimaryMedium = colors.onPrimaryMedium ?? ('rgb(from ' + colors.onPrimary + ' r g b / 0.7)');
      nextColors.onPrimaryOutline = colors.onPrimaryOutline ?? ('rgb(from ' + colors.onPrimary + ' r g b / 0.24)');
    }
    if (colors.onSecondary) {
      nextColors.onSecondaryMedium = colors.onSecondaryMedium ?? ('rgb(from ' + colors.onSecondary + ' r g b / 0.7)');
      nextColors.onSecondaryOutline = colors.onSecondaryOutline ?? ('rgb(from ' + colors.onSecondary + ' r g b / 0.24)');
    }
    return nextColors;
  };
  const normalizePatch = ${options.normalizePatchScript};
  const normalizeMode = ${normalizeModeScript};
  const rawPatch = readStorage(${JSON.stringify(options.patchKey)});
  const rawMode = readStorage(${JSON.stringify(options.modeKey)});
  const patch = rawPatch ? (() => {
    try {
      return normalizePatch(JSON.parse(rawPatch));
    } catch {
      return {};
    }
  })() : {};
  const mode = normalizeMode(rawMode);
  const resolvedMode = resolveMode(mode);
  const themes = resolveDayNightTheme(defaults, patch);
  const theme = themes[resolvedMode];
  const colors = deriveContrastColors(theme.color);
  const root = document.documentElement;
  const dir = new URL(window.location.href).searchParams.get('dir') === 'rtl'
    ? 'rtl'
    : readStorage(${JSON.stringify(dirStorageKey)}) === 'rtl'
      ? 'rtl'
      : 'ltr';
  root.setAttribute('dir', dir);
  root.dataset.ruiTheme = resolvedMode;
  root.style.colorScheme = resolvedMode === 'night' ? 'dark' : 'light';
  if (colors) {
    const colorMap = {
      primary: '--rui-sys-color-primary',
      primaryLow: '--rui-sys-color-primary-low',
      primaryLight: '--rui-sys-color-primary-light',
      primaryDark: '--rui-sys-color-primary-dark',
      onPrimary: '--rui-sys-color-on-primary',
      onPrimaryMedium: '--rui-sys-color-on-primary-medium',
      onPrimaryOutline: '--rui-sys-color-on-primary-outline',
      secondary: '--rui-sys-color-secondary',
      secondaryLight: '--rui-sys-color-secondary-light',
      secondaryDark: '--rui-sys-color-secondary-dark',
      onSecondary: '--rui-sys-color-on-secondary',
      onSecondaryMedium: '--rui-sys-color-on-secondary-medium',
      onSecondaryOutline: '--rui-sys-color-on-secondary-outline',
      background: '--rui-sys-color-background',
      onBackground: '--rui-sys-color-on-background',
      surface: '--rui-sys-color-surface',
      surfaceDark: '--rui-sys-color-surface-dark',
      surfaceInverse: '--rui-sys-color-surface-inverse',
      primaryInverse: '--rui-sys-color-primary-inverse',
      onSurface: '--rui-sys-color-on-surface',
      onSurfaceInverse: '--rui-sys-color-on-surface-inverse',
      onSurfaceHigh: '--rui-sys-color-on-surface-high',
      onSurfaceMedium: '--rui-sys-color-on-surface-medium',
      onSurfaceLow: '--rui-sys-color-on-surface-low',
      onSurfaceOutline: '--rui-sys-color-on-surface-outline',
      error: '--rui-sys-color-error',
      onError: '--rui-sys-color-on-error',
    };
    for (const key in colorMap) {
      const value = colors[key];
      if (value) {
        root.style.setProperty(colorMap[key], value);
      }
    }
  }
  if (theme.density != null) {
    root.style.setProperty('--rui-sys-density-scale', String(theme.density));
  }
  if (theme.iconStyle) {
    root.style.setProperty('--rui-sys-icon-style', theme.iconStyle);
  }
  for (const category of ['small', 'medium', 'large', 'full', 'icon']) {
    const family = theme.shape?.[category]?.family;
    if (family) {
      const cssFamily = family === 'cut' ? 'bevel' : 'round';
      root.style.setProperty('--rui-sys-shape-' + category + '-family', cssFamily);
    }
  }
})();`
}
