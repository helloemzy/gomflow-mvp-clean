# GOMFLOW MVP - K-pop Group Order Management Platform

A clean, minimal viable product for managing K-pop group orders in Southeast Asia.

## Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

### Local Development Setup

1. **Clone and Install**
   ```bash
   git clone [repository-url]
   cd gomflow-mvp
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Database Setup**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key to `.env.local`
   - Run the database schema from `docs/database-schema.sql`

4. **Start Development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Core Features

- **Order Creation**: 3-step wizard for GOMs to create group orders
- **Order Discovery**: Browse and search available orders
- **Payment Verification**: GOM dashboard for approving payments
- **User Authentication**: Email/password registration and login
- **Mobile Responsive**: Optimized for mobile users in SEA

## Architecture

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `JWT_SECRET` | Secret for JWT token signing | Yes |

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import project in Vercel dashboard
   - Connect to your GitHub repository

2. **Environment Variables**
   - Add all variables from `.env.example`
   - Use your production Supabase credentials

3. **Deploy**
   - Push to main branch for automatic deployment
   - Or use `vercel deploy` CLI command

## API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/orders` - List orders with filtering
- `POST /api/orders` - Create new order
- `POST /api/orders/[id]/join` - Join an order
- `POST /api/payments/submit` - Submit payment proof
- `GET /api/payments/pending` - GOM payment queue

## Database Schema

See `docs/database-schema.sql` for the complete schema. Core tables:
- `users` - User accounts and profiles
- `orders` - Group orders created by GOMs
- `submissions` - User participation in orders
- `payments` - Payment verification tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For setup issues or questions, please check:
1. This README
2. Environment variable configuration
3. Database connection settings
4. Supabase project permissions

---

Built for the passionate K-pop community in Southeast Asia 🎵