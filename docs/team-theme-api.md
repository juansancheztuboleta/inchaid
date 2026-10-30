# API de equipos y tema

Cada equipo trae sus datos, sus colores y, opcionalmente, tokens y textos para personalizar toda la
interfaz. La app deriva lo que la API no envíe.

Ejemplo completo con 7 equipos: [`src/data/teams.json`](../src/data/teams.json).

## Endpoints

Define `EXPO_PUBLIC_TEAMS_API_URL` (por ejemplo en `.env`). Sin ella la app usa `teams.json`.

| Método | Ruta         | Respuesta                         |
| ------ | ------------ | --------------------------------- |
| GET    | `/teams`     | `{ "teams": [Team] }` o `[Team]`  |
| GET    | `/teams/:id` | `Team`                            |

## Campos mínimos

`name` y `colors.primary.hex`. Todo lo demás es opcional: `id` (si falta se genera del nombre),
`short_name`, `full_name`, `city`, `department`, `founded` (fecha ISO o año), `stadium`
(`name`, `capacity`, `location`), `nicknames`, `colors.secondary`, `colors.accent`, `crest_url`,
`website`, `main_rivals`, `league`.

El escudo se pinta desde `crest_url`; si falta o falla, se dibuja un disco con los colores y las
iniciales del club.

## `theme`

```jsonc
"theme": {
  "light": { /* tokens, ver abajo; cualquier subconjunto */ },
  "dark":  { /* igual */ },
  "copy":  { "tabs": { "feed": "Verdolaga" }, "feed": { "sectionTitle": "Lo último del Verde" } }
}
```

### Resolución

1. Se derivan todos los tokens de `colors.primary / secondary / accent` y del modo (claro u
   oscuro), cuidando contraste (`src/theme/derive.ts`): texto de acento ≥ 4.5:1, botón de acción
   ≥ 3:1 contra el fondo, texto sobre botones y paneles ≥ 4.5:1.
2. Lo que llegue en `theme.light` / `theme.dark` se mezcla encima, token por token.

Así, un club puede enviar solo `colors` (tema automático), o corregir un único token
(`{ "tabBar": { "activeBackground": "#000000" } }`), o enviar todo. Valores que no sean texto se
ignoran. `teams.json` lleva los tokens completos, generados con la misma derivación.

### Tokens

| Grupo        | Token                                                                                     | Qué pinta                                           |
| ------------ | ----------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `background` | `base`, `top`, `bottom`, `blobA`, `blobB`, `blobC`                                        | El campo de color detrás de toda la app             |
| `text`       | `primary`, `secondary`, `tertiary`, `accent`                                              | Texto de lectura e iconos de acento                 |
|              | `onBrand`, `onAction`, `onPanel`, `onPanelSoft`                                           | Texto sobre botón azul/principal, de acción y paneles |
| `surface`    | `glass`, `glassStrong`, `glassBorder`, `glassShadow`, `glassOpaque`, `line`, `accentSoft`, `switchOff` | Cajas de vidrio, filetes, medallones, interruptores |
| `brand`      | `primary`, `primaryPressed`, `action`, `actionPressed`                                    | Botones y selección                                 |
| `tabBar`     | `activeBackground`, `activeContent`, `inactiveContent`                                    | Barra de navegación                                 |
| `panel`      | `tint`                                                                                    | Paneles grandes teñidos con el color del club       |
| `feedback`   | `danger`, `success`                                                                       | Errores, confirmaciones, “me gusta”                 |

Colores en `#rrggbb` o `rgba(...)`.

### Textos (`theme.copy`)

| Clave                                       | Predeterminado                        |
| ------------------------------------------- | ------------------------------------- |
| `tabs.feed` / `tabs.wallet` / `tabs.settings` | Feed / Billetera / Ajustes          |
| `feed.title`                                | `{short}`                             |
| `feed.sectionTitle`                         | Del club                              |
| `feed.buyTickets`                           | Comprar boletas                       |
| `wallet.title`                              | Billetera                             |
| `settings.title` / `myTeam` / `changeTeam`  | Configuración / Mi equipo / Cambiar de equipo |
| `teams.title` / `intro` / `choose`          | ver `src/theme/copy.ts`               |

Marcadores: `{short}` (nombre corto) y `{team}` (nombre completo).

## Cómo lo usan los componentes

Ningún componente tiene colores fijos: todos leen `useTheme().colors` y `useCopy()`. Para añadir un
token nuevo: agrégalo a `ThemeTokens` y a `flattenTokens` (`src/theme/tokens.ts`), derívalo en
`derive.ts` y úsalo con `color="..."` en `AppText`/`Icon` o desde `useTheme()`.

Al abrir la ficha de un club (`/teams/[id]`) toda la app adopta su tema como vista previa; al salir
vuelve al del equipo elegido.
