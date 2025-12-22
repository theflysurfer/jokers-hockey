# Design Tokens - Les Jokers d'Aubagne

Charte graphique extraite du logo officiel du club.

---

## Couleurs

### Palette Principale

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-primary` | `#6B5B7A` | rgb(107, 91, 122) | Violet principal (bandeau logo) |
| `--color-primary-dark` | `#4A3D5C` | rgb(74, 61, 92) | Violet foncé (ombres, hover) |
| `--color-primary-light` | `#8B7A9A` | rgb(139, 122, 154) | Violet clair (backgrounds) |
| `--color-accent` | `#FFD700` | rgb(255, 215, 0) | Jaune or (accents, highlights) |
| `--color-accent-dark` | `#E6C200` | rgb(230, 194, 0) | Or foncé (hover) |

### Palette Secondaire

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-black` | `#1A1A1A` | rgb(26, 26, 26) | Noir (bordures, texte) |
| `--color-gray-dark` | `#4A4A4A` | rgb(74, 74, 74) | Gris foncé (visage joker) |
| `--color-gray` | `#A0A0A0` | rgb(160, 160, 160) | Gris (fond intérieur logo) |
| `--color-gray-light` | `#D0D0D0` | rgb(208, 208, 208) | Gris clair (backgrounds) |
| `--color-white` | `#FFFFFF` | rgb(255, 255, 255) | Blanc (texte, highlights) |
| `--color-danger` | `#CC2936` | rgb(204, 41, 54) | Rouge (lèvres joker, alertes) |

### Couleurs Sémantiques

```css
:root {
  /* Primary - Violet Jokers */
  --color-primary: #6B5B7A;
  --color-primary-dark: #4A3D5C;
  --color-primary-light: #8B7A9A;
  --color-primary-50: #F5F3F7;
  --color-primary-100: #E8E4EC;
  --color-primary-200: #D1C9D9;
  --color-primary-300: #B0A3BC;
  --color-primary-400: #8B7A9A;
  --color-primary-500: #6B5B7A;
  --color-primary-600: #4A3D5C;
  --color-primary-700: #3A2F4A;
  --color-primary-800: #2A2238;
  --color-primary-900: #1A1526;

  /* Accent - Jaune Or */
  --color-accent: #FFD700;
  --color-accent-dark: #E6C200;
  --color-accent-light: #FFDF33;
  --color-accent-50: #FFFBEB;
  --color-accent-100: #FFF3C4;
  --color-accent-200: #FFE88A;
  --color-accent-300: #FFD700;
  --color-accent-400: #E6C200;
  --color-accent-500: #CCA800;
  --color-accent-600: #997D00;
  --color-accent-700: #665300;

  /* Neutrals */
  --color-black: #1A1A1A;
  --color-gray-900: #2D2D2D;
  --color-gray-800: #4A4A4A;
  --color-gray-700: #666666;
  --color-gray-600: #808080;
  --color-gray-500: #A0A0A0;
  --color-gray-400: #B8B8B8;
  --color-gray-300: #D0D0D0;
  --color-gray-200: #E8E8E8;
  --color-gray-100: #F5F5F5;
  --color-white: #FFFFFF;

  /* Semantic */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #CC2936;
  --color-info: #3B82F6;
}
```

---

## Typographie

### Police Recommandée

| Usage | Police | Fallback |
|-------|--------|----------|
| Titres | **Oswald** | Impact, sans-serif |
| Corps | **Open Sans** | Arial, sans-serif |
| Accent | **Bebas Neue** | Impact, sans-serif |

### Échelle Typographique

```css
:root {
  /* Font Families */
  --font-heading: 'Oswald', Impact, sans-serif;
  --font-body: 'Open Sans', Arial, sans-serif;
  --font-accent: 'Bebas Neue', Impact, sans-serif;

  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */

  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

---

## Espacement

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

---

## Bordures & Rayons

```css
:root {
  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-3xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;   /* Cercle */

  /* Border Widths */
  --border-0: 0;
  --border-1: 1px;
  --border-2: 2px;
  --border-4: 4px;
  --border-8: 8px;
}
```

---

## Ombres

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(107, 91, 122, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(107, 91, 122, 0.1),
               0 2px 4px -1px rgba(107, 91, 122, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(107, 91, 122, 0.1),
               0 4px 6px -2px rgba(107, 91, 122, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(107, 91, 122, 0.1),
               0 10px 10px -5px rgba(107, 91, 122, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(107, 91, 122, 0.25);

  /* Ombre dorée pour accents */
  --shadow-gold: 0 4px 14px 0 rgba(255, 215, 0, 0.3);
}
```

---

## Composants UI

### Boutons

```css
/* Bouton Primary */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
  border: 2px solid var(--color-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-family: var(--font-heading);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  box-shadow: var(--shadow-lg);
}

/* Bouton Accent (Or) */
.btn-accent {
  background: var(--color-accent);
  color: var(--color-black);
  border: 2px solid var(--color-accent);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-family: var(--font-heading);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
}

.btn-accent:hover {
  background: var(--color-accent-dark);
  border-color: var(--color-accent-dark);
  box-shadow: var(--shadow-gold);
}

/* Bouton Outline */
.btn-outline {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-family: var(--font-heading);
  font-weight: var(--font-bold);
  text-transform: uppercase;
}

.btn-outline:hover {
  background: var(--color-primary);
  color: var(--color-white);
}
```

### Cards

```css
.card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.card-header {
  background: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-4) var(--space-6);
}

.card-body {
  padding: var(--space-6);
}

.card-accent {
  border-left: 4px solid var(--color-accent);
}
```

---

## Catégories d'Âge - Couleurs (Suggestion)

Pour différencier visuellement les catégories du club :

| Catégorie | Couleur | Hex | Usage |
|-----------|---------|-----|-------|
| U6-U10 | Vert | `#10B981` | Jeunes débutants |
| U11-U14 | Bleu | `#3B82F6` | Minimes |
| U15-U18 | Orange | `#F59E0B` | Cadets/Juniors |
| Seniors | Violet | `#6B5B7A` | Équipe principale |
| N1/Elite | Or | `#FFD700` | Top niveau |

```css
:root {
  --color-u6-u10: #10B981;
  --color-u11-u14: #3B82F6;
  --color-u15-u18: #F59E0B;
  --color-seniors: #6B5B7A;
  --color-elite: #FFD700;
}
```

---

## Tailwind CSS Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'jokers': {
          50: '#F5F3F7',
          100: '#E8E4EC',
          200: '#D1C9D9',
          300: '#B0A3BC',
          400: '#8B7A9A',
          500: '#6B5B7A',
          600: '#4A3D5C',
          700: '#3A2F4A',
          800: '#2A2238',
          900: '#1A1526',
        },
        'gold': {
          50: '#FFFBEB',
          100: '#FFF3C4',
          200: '#FFE88A',
          300: '#FFD700',
          400: '#E6C200',
          500: '#CCA800',
          600: '#997D00',
          700: '#665300',
        },
      },
      fontFamily: {
        'heading': ['Oswald', 'Impact', 'sans-serif'],
        'body': ['Open Sans', 'Arial', 'sans-serif'],
        'accent': ['Bebas Neue', 'Impact', 'sans-serif'],
      },
    },
  },
}
```

---

## Assets du Logo

| Fichier | Usage |
|---------|-------|
| `logo-full.png` | Logo complet avec texte |
| `logo-icon.png` | Visage du Joker seul |
| `logo-white.png` | Version blanche (fonds sombres) |
| `favicon.ico` | Favicon navigateur |

---

## Prompts AI pour Pictogrammes

Pour générer des icônes cohérentes avec la charte :

```
Flat minimalist icon of [SUJET],
purple #6B5B7A and yellow gold #FFD700 colors,
transparent background,
simple pictogram style,
clean vector design,
centered,
web icon 512x512
```

---

**Version**: 1.0.0
**Dernière mise à jour**: 2025-12-10
**Club**: Les Jokers d'Aubagne - Roller Hockey
