# MMES-MCTI Admin UI Design Specification

## 1. Design System Overview

### 1.1 Design Direction
- **Style**: Tech-focused, clean, modern with subtle futuristic elements
- **Mood**: Professional, trustworthy, innovative
- **Reference**: Industrial IoT/Sensor company aesthetic - precision engineering meets digital interface

### 1.2 Color Palette

#### Light Mode
| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#ffffff` | Page background |
| `surface` | `#f8fafc` (slate-50) | Cards, panels |
| `surface-elevated` | `#ffffff` | Elevated cards |
| `border` | `#e2e8f0` (slate-200) | Borders, dividers |
| `text-primary` | `#0f172a` (slate-900) | Headings |
| `text-secondary` | `#64748b` (slate-500) | Body text |
| `text-muted` | `#94a3b8` (slate-400) | Placeholders |

#### Dark Mode
| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#0a0a0a` | Page background |
| `surface` | `#1e293b` (slate-800) | Cards, panels |
| `surface-elevated` | `#334155` (slate-700) | Elevated surfaces |
| `border` | `#334155` (slate-700) | Borders, dividers |
| `text-primary` | `#f8fafc` (slate-50) | Headings |
| `text-secondary` | `#cbd5e1` (slate-300) | Body text |
| `text-muted` | `#64748b` (slate-500) | Placeholders |

#### Accent Colors (Both Modes)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#0066ff` | Primary actions, links |
| `primary-hover` | `#0052cc` | Primary hover state |
| `secondary` | `#00d4ff` | Secondary accents, highlights |
| `success` | `#10b981` (emerald-500) | Published, success states |
| `warning` | `#f59e0b` (amber-500) | Draft, pending states |
| `danger` | `#ef4444` (red-500) | Delete, error states |

### 1.3 Typography

```css
/* Font Stack */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Scale */
--text-xs: 0.75rem;    /* 12px - Badges, captions */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Subheadings */
--text-xl: 1.25rem;    /* 20px - Section titles */
--text-2xl: 1.5rem;    /* 24px - Page titles */
--text-3xl: 1.875rem;  /* 30px - Dashboard headers */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 1.4 Spacing System

```css
/* Base unit: 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### 1.5 Border Radius

```css
--radius-sm: 0.375rem;  /* 6px - Badges, small buttons */
--radius-md: 0.5rem;    /* 8px - Inputs, small cards */
--radius-lg: 0.75rem;   /* 12px - Cards, modals */
--radius-xl: 1rem;       /* 16px - Large panels */
--radius-full: 9999px;  /* Pills, avatars */
```

### 1.6 Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-glow: 0 0 20px rgba(0, 102, 255, 0.3);  /* Primary glow effect */
```

### 1.7 Motion & Animation

```css
/* Durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

/* Easings */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Animation principles */
- Use framer-motion for component animations
- Prefer opacity + transform for performance
- Stagger children animations (50ms delay per item)
- Modal: scale 0.95->1 + opacity 0->1
- Slide-in panels: translateX(100%) -> translateX(0)
- List items: opacity 0->1 + translateY(10px) -> translateY(0)
```

---

## 2. Layout Structure

### 2.1 Admin Layout Shell

```
+----------------------------------------------------------+
|  SIDEBAR (240px fixed)    |  MAIN CONTENT AREA            |
|  +--------------------+    |  +------------------------+  |
|  | Logo / Brand       |    |  | Header Bar (64px)       |  |
|  +--------------------+    |  +------------------------+  |
|  | Navigation         |    |  |                         |  |
|  | - Dashboard        |    |  | Page Content            |  |
|  | - Products         |    |  | (scrollable)            |  |
|  | - Blog             |    |  |                         |  |
|  | - Settings         |    |  |                         |  |
|  +--------------------+    |  |                         |  |
|  | User Info          |    |  |                         |  |
|  | Logout             |    |  |                         |  |
|  +--------------------+    |  +------------------------+  |
+----------------------------------------------------------+
```

### 2.2 Sidebar Design

```ascii
+------------------------+
| [Logo] MMES-MCTI       |  <- Brand with gradient text
+------------------------+
|                        |
| NAVIGATION             |  <- Section label, uppercase, tracking-wide
|                        |
| [Dashboard Icon]        |
| Dashboard              |  <- Active: bg-primary/10, text-primary, left border
|                        |
| [Products Icon]         |
| Products              |  <- Hover: bg-slate-100 dark:bg-slate-700
|                        |
| [Blog Icon]             |
| Blog                   |
|                        |
| [Settings Icon]         |
| Settings               |
|                        |
+------------------------+
| USER SECTION           |
| [Avatar] Admin         |
| admin@mmes-mcti.com    |
| [Logout Button]        |
+------------------------+
```

### 2.3 Header Bar

```ascii
+----------------------------------------------------------+
| Page Title                    | Search | Notifications | User |
+----------------------------------------------------------+
```

- Height: 64px
- Background: surface color with bottom border
- Left: Page title (text-2xl, font-bold)
- Right: User dropdown, notification bell (optional)

---

## 3. Component Specifications

### 3.1 Buttons

#### Primary Button
```css
/* Default */
background: linear-gradient(135deg, #0066ff, #00d4ff);
color: white;
padding: 0.625rem 1.25rem;  /* 10px 20px */
border-radius: 0.5rem;
font-weight: 500;
transition: all 150ms ease-out;

/* Hover */
box-shadow: 0 0 20px rgba(0, 102, 255, 0.4);
transform: translateY(-1px);

/* Active */
transform: translateY(0);
box-shadow: none;

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
```

#### Secondary Button
```css
/* Default */
background: transparent;
border: 1px solid slate-300 dark:slate-600;
color: slate-700 dark:slate-300;
padding: 0.625rem 1.25rem;
border-radius: 0.5rem;

/* Hover */
background: slate-100 dark:bg-slate-700;
border-color: slate-400 dark:slate-500;
```

#### Danger Button
```css
/* Default */
background: #ef4444;
color: white;

/* Hover */
background: #dc2626;
box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
```

#### Icon Button
```css
/* Default */
padding: 0.5rem;
border-radius: 0.5rem;
color: slate-500;

/* Hover */
background: slate-100 dark:bg-slate-700;
color: slate-700 dark:slate-300;
```

### 3.2 Form Inputs

#### Text Input
```css
/* Default */
width: 100%;
padding: 0.75rem 1rem;
background: white dark:bg-slate-900;
border: 1px solid slate-200 dark:border-slate-700;
border-radius: 0.5rem;
font-size: 0.875rem;
transition: all 150ms ease-out;

/* Focus */
outline: none;
border-color: primary;
box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);

/* Error */
border-color: danger;
box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
```

#### Select Dropdown
```css
/* Same as text input + chevron icon */
background-image: url("data:image/svg+xml,...chevron-down");
background-repeat: no-repeat;
background-position: right 0.75rem center;
padding-right: 2.5rem;
```

#### Checkbox
```css
width: 1.125rem;  /* 18px */
height: 1.125rem;
border-radius: 0.25rem;
border: 1px solid slate-300 dark:slate-600;
background: white dark:bg-slate-900;

/* Checked */
background: primary;
border-color: primary;
```

#### Toggle Switch
```css
/* Track */
width: 2.75rem;
height: 1.5rem;
border-radius: 9999px;
background: slate-200 dark:bg-slate-700;

/* Thumb */
width: 1.25rem;
height: 1.25rem;
border-radius: 9999px;
background: white;

/* Active (checked) */
background: primary;
transform: translateX(1.25rem);
```

### 3.3 Cards

#### Data Card (List Item)
```css
background: white dark:bg-slate-800;
border-radius: 0.75rem;
padding: 1rem 1.25rem;
border: 1px solid slate-200 dark:border-slate-700;
transition: all 150ms ease-out;

/* Hover */
border-color: slate-300 dark:slate-600;
box-shadow: shadow-md;

/* Selected/Active */
border-color: primary;
background: primary/5;
```

#### Stat Card
```css
background: white dark:bg-slate-800;
border-radius: 1rem;
padding: 1.5rem;
box-shadow: shadow-lg;

/* Icon area */
width: 3rem;
height: 3rem;
border-radius: 0.75rem;
background: primary/10;
color: primary;
```

### 3.4 Tables

```css
/* Container */
background: white dark:bg-slate-800;
border-radius: 0.75rem;
overflow: hidden;
box-shadow: shadow-lg;

/* Header */
background: slate-50 dark:bg-slate-700/50;
font-weight: 600;
font-size: 0.75rem;
text-transform: uppercase;
letter-spacing: 0.05em;
color: slate-500;

/* Row */
border-bottom: 1px solid slate-200 dark:border-slate-700;
transition: background 150ms ease-out;

/* Row Hover */
background: slate-50 dark:bg-slate-700/30;

/* Cell */
padding: 1rem 1.5rem;
font-size: 0.875rem;
```

### 3.5 Modal / Dialog

```css
/* Backdrop */
background: rgba(0, 0, 0, 0.5);
backdrop-filter: blur(4px);

/* Container */
background: white dark:bg-slate-800;
border-radius: 1rem;
box-shadow: shadow-xl;
max-width: 90vw;
max-height: 90vh;
overflow: hidden;

/* Animation */
initial: { opacity: 0, scale: 0.95 }
animate: { opacity: 1, scale: 1 }
exit: { opacity: 0, scale: 0.95 }
transition: { duration: 0.2, ease: ease-out }

/* Header */
padding: 1.5rem;
border-bottom: 1px solid slate-200 dark:border-slate-700;

/* Body */
padding: 1.5rem;
overflow-y: auto;
max-height: calc(90vh - 140px);

/* Footer */
padding: 1rem 1.5rem;
border-top: 1px solid slate-200 dark:border-slate-700;
display: flex;
justify-content: flex-end;
gap: 0.75rem;
```

### 3.6 Status Badges

```css
/* Published / Success */
background: emerald-100 dark:bg-emerald-900/30;
color: emerald-700 dark:text-emerald-400;
padding: 0.25rem 0.75rem;
border-radius: 9999px;
font-size: 0.75rem;
font-weight: 500;

/* Draft / Warning */
background: amber-100 dark:bg-amber-900/30;
color: amber-700 dark:text-amber-400;

/* Danger */
background: red-100 dark:bg-red-900/30;
color: red-700 dark:text-red-400;
```

### 3.7 Sidebar Navigation

```css
/* Nav Item */
display: flex;
align-items: center;
gap: 0.75rem;
padding: 0.75rem 1rem;
border-radius: 0.5rem;
color: slate-600 dark:slate-400;
font-weight: 500;
transition: all 150ms ease-out;
margin-bottom: 0.25rem;

/* Hover */
background: slate-100 dark:bg-slate-700;
color: slate-900 dark:slate-100;

/* Active */
background: primary/10;
color: primary;
border-left: 3px solid primary;
```

---

## 4. Page-Specific Designs

### 4.1 Dashboard Page

```ascii
+------------------------------------------------------------------+
|  Dashboard                                          [Profile]     |
+------------------------------------------------------------------+
|                                                                  |
|  +------------------+  +------------------+  +------------------+ |
|  | Total Products   |  | Published        |  | Drafts           | |
|  | 24               |  | 18               |  | 6                | |
|  | [icon]           |  | [icon]           |  | [icon]           | |
|  +------------------+  +------------------+  +------------------+ |
|                                                                  |
|  +-------------------------------+  +------------------------+ |
|  | Recent Products               |  | Quick Actions           | |
|  | +-------------------------+   |  | [ + New Product       ] | |
|  | | PA-GS | AHRS | Published |   |  | [ + New Blog Post    ] | |
|  | | PA-IMU | IMU | Draft     |   |  |                        | |
|  | | PA-3D | GNSS | Published |   |  |                        | |
|  | +-------------------------+   |  +------------------------+ |
|  +-------------------------------+                                |
|                                                                  |
+------------------------------------------------------------------+
```

### 4.2 Products Management Page

```ascii
+------------------------------------------------------------------+
|  Products                              [+ New Product]          |
+------------------------------------------------------------------+
|                                                                  |
|  [Search...                    ] [All v] [Published] [Drafts]   |
|                                                                  |
|  +-----------------------------------+  +---------------------+ |
|  | Product List                      |  | Preview              | |
|  | +-------------------------------+ |  |                      | |
|  | | [img] PA-GS        [Edit][Del]| |  | [Large Image]        | |
|  | |       High Precision AHRS     | |  |                      | |
|  | |       Status: Published       | |  | Name: PA-GS          | |
|  | +-------------------------------+ |  | Slug: pa-gs          | |
|  | | [img] PA-AHRS01   [Edit][Del]| |  | Status: Published     | |
|  | |       Attitude Heading...    | |  |                      | |
|  | |       Status: Draft         | |  | Parameters:           | |
|  | +-------------------------------+ |  | - Accuracy: 0.01     | |
|  | | [img] PA-IMU-01G [Edit][Del]| |  | - Range: ±400°/s     | |
|  | +-------------------------------+ |  |                      | |
|  |                                   |  +---------------------+ |
|  +-----------------------------------+                                |
|                                                                  |
|  Showing 1-10 of 24                        [<] [1] [2] [3] [>]      |
+------------------------------------------------------------------+
```

### 4.3 Product Form Modal

```ascii
+------------------------------------------------------------------+
|                                                                   |
|  +---------------------------------------------------------------+|
|  |  [Tab: EN] [Tab: ZH] [Tab: RU] [Tab: AR] [Tab: FA] [Tab: LA] ||
|  +---------------------------------------------------------------+|
|  |                                                               ||
|  |  IMAGE UPLOAD                                                 |
|  |  +----------------------------------+                        |
|  |  |     [Drag & Drop Zone]           |                        |
|  |  |     or click to upload           |                        |
|  |  |     [img] [img] [img] +          |                        |
|  |  +----------------------------------+                        |
|  |                                                               ||
|  |  BASIC INFORMATION                                            |
|  |  Name: [____________________________]                        |
|  |  Slug: [____________________________] [Auto]               |
|  |  Status: [Draft v]                                            |
|  |                                                               ||
|  |  PARAMETERS                           [+ Add Parameter]        |
|  |  +----------------------------------+                        |
|  |  | Name      | Value    | Unit      |                        |
|  |  | Accuracy  | 0.01     | deg       | [x]                   |
|  |  | Range     | ±400     | deg/s     | [x]                   |
|  |  +----------------------------------+                        |
|  |                                                               ||
|  |  DESCRIPTION                                                 |
|  |  [____________________________]                              |
|  |  [____________________________]                              |
|  |                                                               |
|  +---------------------------------------------------------------+|
|                                                                   |
|                            [Cancel]  [Save Product]               |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.4 Blog Management Page

```ascii
+------------------------------------------------------------------+
|  Blog                                  [+ New Post]               |
+------------------------------------------------------------------+
|                                                                  |
|  [Search...                    ] [All v] [Published] [Drafts]   |
|                                                                  |
|  +--------------------------------------------------------------+|
|  | Title          | Slug        | Tags      | Date   | Actions  ||
|  +--------------------------------------------------------------+|
|  | Getting Start  | getting...  | [UAV]     | 2024.. | Edit     ||
|  | with PA-GS     |             | [Tech]   |        | Delete   ||
|  +--------------------------------------------------------------+|
|  | Advanced AHRS  | advanced... | [AHRS]    | 2024.. | Edit     ||
|  | Techniques     |             | [Sensor]  |        | Delete   ||
|  +--------------------------------------------------------------+|
|                                                                  |
+------------------------------------------------------------------+
```

### 4.5 Login Page

```ascii
+------------------------------------------------------------------+
|                                                                  |
|                    +------------------------+                    |
|                    |                        |                    |
|                    |   [Logo]               |                    |
|                    |   MMES-MCTI            |                    |
|                    |                        |                    |
|                    |   Admin Login          |                    |
|                    |                        |                    |
|                    |   Email                |                    |
|                    |   [________________]  |                    |
|                    |                        |                    |
|                    |   Password             |                    |
|                    |   [________________]  |                    |
|                    |                        |                    |
|                    |   [    Login    ]      |                    |
|                    |                        |                    |
|                    +------------------------+                    |
|                                                                  |
+------------------------------------------------------------------+
```

---

## 5. Responsive Breakpoints

```css
/* Mobile: < 640px */
- Sidebar collapses to hamburger menu
- Product preview moves below list
- Table becomes card-based layout

/* Tablet: 640px - 1024px */
- Sidebar 240px fixed
- Content area fluid

/* Desktop: > 1024px */
- Full sidebar visible
- Product list + preview side-by-side
```

---

## 6. Multi-Language & RTL Support

### 6.1 Supported Languages
| Code | Language | Direction |
|------|----------|-----------|
| en | English | LTR |
| zh | Chinese | LTR |
| ru | Russian | LTR |
| ar | Arabic | RTL |
| fa | Persian | RTL |
| la | Latin | LTR |

### 6.2 RTL Adjustments

```css
[dir="rtl"] {
  /* Flip horizontal layouts */
  direction: rtl;
  text-align: right;

  /* Sidebar */
  .sidebar {
    left: auto;
    right: 0;
    border-left: 1px solid;
    border-right: none;
  }

  /* Navigation active indicator */
  .nav-item {
    border-left: none;
    border-right: 3px solid transparent;
  }

  .nav-item.active {
    border-right-color: primary;
  }

  /* Modal close button */
  .modal-close {
    left: 1rem;
    right: auto;
  }

  /* Table alignment */
  th { text-align: right; }
}
```

### 6.3 Language-Specific Considerations
- **Arabic/Persian**: Use `IBM Plex Sans Arabic` or `Vazirmatn` for body text
- **Chinese**: Use `Noto Sans SC` - no full-width punctuation conflicts
- **Russian**: Standard Latin fonts work well with Cyrillic

---

## 7. Component Props Interface

### 7.1 Button Component

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
```

### 7.2 Input Component

```typescript
interface InputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}
```

### 7.3 Select Component

```typescript
interface SelectProps {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}
```

### 7.4 DataTable Component

```typescript
interface DataTableProps<T> {
  columns: {
    key: string;
    header: string;
    render?: (row: T) => React.ReactNode;
    width?: string;
  }[];
  data: T[];
  onRowClick?: (row: T) => void;
  selectedId?: string;
  emptyMessage?: string;
}
```

### 7.5 Modal Component

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}
```

### 7.6 Sidebar Navigation

```typescript
interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface AdminSidebarProps {
  items: NavItem[];
  activeHref: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
}
```

---

## 8. Animation Specifications

### 8.1 Page Transitions
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

// Duration: 300ms
// Easing: easeOut
```

### 8.2 Modal Animations
```typescript
const modalVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

// Backdrop: opacity 0 -> 0.5
// Duration: 200ms
```

### 8.3 Sidebar Slide
```typescript
const sidebarVariants = {
  initial: { x: -240 },
  animate: { x: 0 },
  exit: { x: -240 }
};

// Duration: 300ms
// Easing: easeOut
```

### 8.4 List Item Stagger
```typescript
const listItemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
};

// Stagger delay: 50ms per item
// Max stagger: 10 items
```

### 8.5 Button Hover
```typescript
const buttonHover = {
  hover: { scale: 1.02, y: -1 },
  tap: { scale: 0.98 }
};
```

### 8.6 Notification Toast
```typescript
const toastVariants = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 }
};

// Position: top-right
// Duration: 3000ms auto-dismiss
```

---

## 9. Accessibility Requirements

- All interactive elements must have focus states
- Use semantic HTML (button for actions, a for links)
- Include aria-labels for icon-only buttons
- Color contrast ratio minimum 4.5:1 for text
- Support keyboard navigation (Tab, Enter, Escape)
- Reduce motion for prefers-reduced-motion
- Form error messages announced to screen readers

---

## 10. File Structure

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx          # Admin layout with sidebar
│       ├── page.tsx             # Dashboard
│       ├── login/
│       │   └── page.tsx         # Login page
│       ├── products/
│       │   ├── page.tsx         # Products list
│       │   └── [id]/
│       │       └── page.tsx     # Product detail/edit
│       └── blog/
│           ├── page.tsx         # Blog list
│           └── [id]/
│               └── page.tsx     # Blog post edit
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── AdminHeader.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── DataTable.tsx
│       ├── Modal.tsx
│       ├── StatusBadge.tsx
│       ├── ImageUpload.tsx
│       ├── ParameterTable.tsx
│       └── LanguageTabs.tsx
└── styles/
    └── admin.css                # Admin-specific styles
```
