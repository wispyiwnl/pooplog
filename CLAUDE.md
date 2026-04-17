# PoopLog — CLAUDE.md

Rastreador personal de deposiciones basado en la escala de Bristol. App web estática (HTML + CSS + JS separados) con auth y base de datos en Supabase, desplegada en Netlify.

---

## Arquitectura

```
pooplog/
├── public/                # Lo que Netlify publica
│   ├── index.html         # Estructura HTML
│   ├── favicon.png
│   ├── config.js          # Keys de Supabase — generado en build, NO se sube a GitHub
│   ├── css/
│   │   └── styles.css     # Estilos (CSS variables, componentes, dark mode)
│   └── js/
│       └── app.js         # Lógica JS (auth, registro, stats, calendario, etc.)
├── .gitignore
├── netlify.toml           # publish="public" y build command que genera public/config.js
├── README.md
└── CLAUDE.md
```

**Stack:** HTML · CSS · Vanilla JS · Supabase (auth + PostgreSQL) · Netlify (hosting + build)

---

## Configuración

### Variables de entorno (Netlify)
```
SUPABASE_URL=https://jhedbrqslvmxydskycys.supabase.co
SUPABASE_KEY=sb_publishable_...
```

El `netlify.toml` genera `public/config.js` en build time y publica desde `public/`:
```toml
[build]
  command = "printf 'window.POOPLOG_CONFIG={SUPABASE_URL:\"%s\",SUPABASE_KEY:\"%s\"};' \"$SUPABASE_URL\" \"$SUPABASE_KEY\" > public/config.js"
  publish = "public"
```

### Desarrollo local
Crear `public/config.js` manualmente con las keys reales (mismo formato que genera el build). Abrir `public/index.html` directamente en el navegador o servir la carpeta `public/` con un servidor local.

---

## Base de datos (Supabase)

### Tabla `poops`
```sql
create table poops (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade,
  type       text not null,        -- '1' al '7' (escala de Bristol)
  effort     text not null,        -- 'smooth' | 'bit' | 'hard' | 'brutal'
  notes      text,
  created_at timestamptz default now()
);

alter table poops enable row level security;
create policy "Users see own poops" on poops
  for all using (auth.uid() = user_id);
```

### Auth
- Email + contraseña
- Google OAuth
- Modo invitado (localStorage, clave `pooplog_guest`)

---

## Estructura del código

El código está separado en 3 archivos dentro de `public/`:

```
public/index.html      → solo estructura (cuerpo de la app)
  #page-loading          → spinner inicial mientras Supabase verifica sesión
  #page-onboarding       → guía de 6 pasos (primera vez o desde perfil)
  #page-auth             → login, registro, verificación, recuperar contraseña
  #page-app              → app principal
public/css/styles.css  → variables CSS, estilos de todos los componentes, dark mode
public/js/app.js       → toda la lógica JS (consume window.POOPLOG_CONFIG de config.js)
```

Orden de carga en `public/index.html`:
1. `<link rel="stylesheet" href="css/styles.css">` en `<head>`
2. CDN de Supabase (global `supabase`)
3. `config.js` (define `window.POOPLOG_CONFIG`)
4. `<script src="js/app.js">` al final del `<body>` — así el DOM ya existe y los globals anteriores están listos

### Páginas de la app (`#page-app`)
- Score de salud digestiva (expandible con insights)
- Stats: total, esta semana, racha de días consecutivos
- Gráfica semanal (clickeable → calendario mensual)
- Formulario de registro (tipo + esfuerzo + fecha/hora + notas)
- Historial con editar/eliminar (menú ⋯)
- Banners: invitado, inactividad (+2 días sin registrar)
- Perfil: stats, cómo funciona, cerrar sesión

---

## Funciones JS principales

| Función | Descripción |
|---|---|
| `showPage(id)` | Cambia entre páginas (loading, onboarding, auth, app) |
| `logPoop()` | Registra un popo — guarda en Supabase o localStorage |
| `loadLogs()` | Carga registros del usuario desde Supabase |
| `updateUI()` | Actualiza stats, score, barra semanal e historial |
| `updateScore()` | Calcula score digestivo e insights de la semana |
| `calcStreak()` | Calcula días consecutivos con registro |
| `renderList()` | Renderiza el historial con menú ⋯ por item |
| `renderCal()` | Renderiza el calendario mensual con SVGs por día |
| `openEdit(id)` | Abre modal de edición pre-llenado con datos del registro |
| `saveEdit()` | Guarda cambios del registro editado |
| `deleteLog(id)` | Elimina registro con confirmación |
| `checkInactivity()` | Muestra banner si +2 días sin registrar |
| `calcStreak()` | Racha de días consecutivos (se rompe si hay un hueco) |
| `obGoTo(step, dir)` | Navega entre slides del onboarding con animación |
| `openHowItWorks()` | Abre onboarding desde el perfil |
| `enterAsGuest()` | Modo invitado — usa localStorage en vez de Supabase |
| `toggleTime()` | Activa/desactiva registro tardío en el formulario |

---

## Datos y lógica de negocio

### Escala de Bristol
| Tipo | Descripción | Diagnóstico |
|---|---|---|
| 1-2 | Duro, bolitas o grumoso | Estreñimiento |
| 3-4 | Salchicha con grietas o lisa | Normal / Ideal |
| 5-6 | Trozos blandos o esponjoso | Tendencia a diarrea |
| 7 | Líquido | Diarrea |

### Esfuerzo
`smooth` → `bit` → `hard` → `brutal`

### Lógica de insights (sin IA)
Basada en proporciones de la semana actual vs anterior:
- `constipatedRatio >= 0.5` → alerta de estreñimiento
- `looseRatio >= 0.5` → alerta de digestión acelerada
- `hardEffort >= 3` → alerta de esfuerzo excesivo
- `healthyRatio >= 0.7 && effortRatio >= 0.7` → semana excelente
- Comparación con semana anterior en % de popos saludables

### Racha
Días consecutivos contados hacia atrás. Se rompe si hay un gap de 2+ días. Celebraciones en hitos: 3, 7, 14, 30 días.

---

## Convenciones

- **Sin frameworks** — vanilla JS puro, sin npm, sin bundler
- **3 archivos separados** — `index.html` (estructura), `styles.css` (estilos), `app.js` (lógica). Nada de `type="module"` para que también funcione abriendo `index.html` directo con `file://`
- **CSS variables** — `--bg-primary`, `--green`, `--border`, etc. para dark mode automático
- **Ilustraciones SVG** — los 7 tipos de Bristol dibujados en SVG inline, sin imágenes externas
- **Guest mode** — clave `pooplog_guest` en localStorage, `ob_done` para onboarding, `inactivity_dismissed` para el banner

---

## Consideraciones de seguridad

- `config.js` está en `.gitignore` — nunca se sube a GitHub
- Las keys se generan en build time via Netlify environment variables
- Row Level Security en Supabase — cada usuario solo ve sus propios datos
- La publishable key de Supabase es segura para el frontend (diseñada para eso)
- `SECRETS_SCAN_OMIT_KEYS = "SUPABASE_KEY,SUPABASE_URL"` en `netlify.toml` para evitar falsos positivos del scanner

---

## Disclaimer

App de uso personal y aprendizaje. No es un dispositivo médico. No usar para tomar decisiones de salud.