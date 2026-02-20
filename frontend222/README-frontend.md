Frontend folder structure and quick start

Structure created under `frontend/src`:

- pages/ (Home, Login, Dashboard, AdminPanel, DoctorPanel, PatientPanel, Unauthorized)
- components/ (ProtectedRoute.jsx)
- services/ (api.js, authService.js)
- context/ (AuthContext.jsx)
- hooks/ (useAuth.js)
- routes/ (AppRoutes.jsx)

Quick start (frontend folder):

1. Install deps

```bash
npm install
```

2. Start dev server (Vite/CRA based on project)

```bash
npm run dev
# or
npm start
```

Notes:
- `AuthContext` expects `authService.getMe()` to return the current user object.
- `ProtectedRoute` accepts `roles` prop: array of allowed roles.
- API base URL is read from `VITE_API_URL` env var or defaults to http://localhost:8000
