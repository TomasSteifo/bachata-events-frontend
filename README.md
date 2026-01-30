# Bachata Events

A global Bachata Festival platform built with React, TypeScript, and Vite.

## Features

- **Public Users**: Browse and filter published bachata festivals
- **Organizers**: Create, edit, delete, and publish festivals via dashboard
- **Authentication**: Login/register with role-based access control

## Environment Variables

Create a `.env` file in the project root with:

```env
VITE_API_URL=http://localhost:5000
```

Replace with your actual .NET 8 Web API backend URL.

## Running Locally

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Building for Production

```sh
# Build the app
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── layout/        # Navbar, Footer, Layout
│   └── ui/            # shadcn/ui components
├── contexts/          # React contexts (AuthContext)
├── hooks/             # Custom hooks
├── lib/               # API client, utilities
├── pages/             # Page components
│   ├── auth/          # Login, Register
│   └── organizer/     # Dashboard, Create/Edit Festival
└── types/             # TypeScript type definitions
```

## API Endpoints Used

### Public
- `GET /api/festivals` - List festivals with filters
- `GET /api/festivals/{id}` - Festival details

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Organizer (requires JWT)
- `GET /api/organizers/me/festivals` - My festivals
- `POST /api/festivals` - Create festival
- `PUT /api/festivals/{id}` - Update festival
- `DELETE /api/festivals/{id}` - Delete festival
- `PATCH /api/festivals/{id}/publish` - Publish/unpublish

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router v6
- TanStack Query
