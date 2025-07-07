# Frontend - LAP Verschenke-Plattform

Eine moderne React-Anwendung mit TypeScript, TailwindCSS und DaisyUI.

## 🚀 Schnellstart

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Build für Production
npm run build
```

## 🛠️ Tech Stack

- **React 19** - UI-Framework
- **TypeScript** - Typsicherheit
- **Vite** - Build-Tool & Dev Server
- **TailwindCSS** - Styling
- **DaisyUI** - UI-Komponenten
- **React Hook Form** - Formularhandling
- **Zod** - Schema-Validierung
- **React Query** - Server-State-Management
- **React Router v7** - Navigation

## 📁 Projektstruktur

```
src/
├── lib/
│   └── auth.ts              # 🔥 Zentrale Auth-Logik
├── hooks/
│   └── useAuth.tsx          # Auth Hook + Context
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx    # Anmeldeformular
│   │   ├── RegisterForm.tsx # Registrierungsformular
│   │   └── ProtectedRoute.tsx # Routenschutz
│   ├── Navbar.tsx           # Navigation
│   └── Footer.tsx           # Footer
├── pages/
│   ├── HomePage.tsx         # Startseite
│   ├── LandingPage.tsx      # Landing Page
│   ├── ProfilePage.tsx      # Benutzerprofil
│   └── MyItemsPage.tsx      # Artikel-Verwaltung
├── schemas/
│   └── AuthSchemas.ts       # Zod-Validierungsschemas
└── App.tsx                  # Haupt-App-Komponente
```

## 🔐 Authentifizierung (vereinfacht!)

### Einfache Verwendung:

```typescript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <div>Willkommen, {user.username}!</div>;
}
```

### Direkte API-Calls:

```typescript
import { auth } from './lib/auth';

// Login
const user = await auth.login({ username, password });

// Authentifizierte API-Calls
const response = await auth.apiCall('/api/items');
```

## 🎨 Styling mit DaisyUI

### Komponenten verwenden:

```jsx
// Button
<button className="btn btn-primary">Klick mich</button>

// Card
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Titel</h2>
    <p>Inhalt</p>
  </div>
</div>

// Form
<div className="form-control">
  <label className="label">
    <span className="label-text">Name</span>
  </label>
  <input type="text" className="input input-bordered" />
</div>
```

### Verfügbare Themes:
- `light` (Standard)
- `dark`
- `cupcake`
- `corporate`
- Mehr in `tailwind.config.js`

## 📝 Formulare mit React Hook Form + Zod

```typescript
// Schema definieren
const schema = z.object({
  username: z.string().min(3, "Mindestens 3 Zeichen"),
  email: z.string().email("Ungültige E-Mail"),
});

// In Komponente verwenden
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});

const onSubmit = (data) => {
  console.log(data); // Validierte Daten
};
```

## 🌐 API-Integration

### Mit React Query:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { auth } from '../lib/auth';

// Daten abrufen
const { data, isLoading, error } = useQuery({
  queryKey: ['items'],
  queryFn: () => auth.apiCall('/api/items').then(res => res.json())
});

// Daten ändern
const mutation = useMutation({
  mutationFn: (newItem) => auth.apiCall('/api/items', {
    method: 'POST',
    body: JSON.stringify(newItem)
  }),
  onSuccess: () => {
    // Refetch items
    queryClient.invalidateQueries(['items']);
  }
});
```

## 🛡️ Geschützte Routen

```jsx
import ProtectedRoute from './components/auth/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 📱 Responsive Design

```jsx
// TailwindCSS Breakpoints
<div className="
  grid 
  grid-cols-1          // Mobile: 1 Spalte
  md:grid-cols-2       // Tablet: 2 Spalten
  lg:grid-cols-3       // Desktop: 3 Spalten
  xl:grid-cols-4       // Large: 4 Spalten
">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>
```

## 🔧 Development

### Hot Reload
- Änderungen werden sofort übernommen
- TypeScript-Fehler werden im Browser angezeigt
- CSS-Änderungen ohne Reload

### Linting & Formatting
```bash
# ESLint
npm run lint

# Prettier (automatisch bei Save)
```

### Build-Optimierung
```bash
# Bundle analysieren
npm run build
npx vite-bundle-analyzer dist
```

## 📊 State Management

### Server State (React Query)
```typescript
// Daten aus API
const { data: items } = useQuery(['items'], fetchItems);
```

### Client State (React State)
```typescript
// Lokaler Component State
const [isModalOpen, setIsModalOpen] = useState(false);
```

### Auth State (Context)
```typescript
// Global über useAuth Hook
const { user, isAuthenticated } = useAuth();
```

## 🚨 Error Handling

```typescript
// Try-Catch für API-Calls
try {
  const user = await auth.login(credentials);
} catch (error) {
  setError(error.message);
}

// React Query Error Handling
const { data, error } = useQuery({
  queryKey: ['items'],
  queryFn: fetchItems,
  onError: (error) => {
    toast.error(error.message);
  }
});
```

## 🧪 Testing

```bash
# Unit Tests (geplant)
npm run test

# E2E Tests (geplant)
npm run test:e2e
```

## 📚 Best Practices

### Komponenten
- Kleine, fokussierte Komponenten
- Props mit TypeScript typisieren
- Default exports für Pages, Named exports für Utils

### Styling
- TailwindCSS für Styling
- DaisyUI für Komponenten
- Responsive Design von Anfang an

### Performance
- React.memo für aufwändige Komponenten
- useCallback für Event Handler
- Lazy Loading für große Komponenten

## 🔗 Nützliche Links

- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [React Query Docs](https://tanstack.com/query/latest)

## 🐛 Troubleshooting

### Häufige Probleme:

**TypeScript-Fehler:**
```bash
# TypeScript-Cache löschen
rm -rf node_modules/.cache
npm install
```

**Styling funktioniert nicht:**
```bash
# Tailwind-Cache löschen
rm -rf node_modules/.cache
npm run dev
```

**Hot Reload funktioniert nicht:**
```bash
# Vite-Cache löschen
rm -rf node_modules/.vite
npm run dev
```

---

**Happy Coding!** 🚀