# NutriCartAI

A smart nutrition and grocery management platform that helps users make healthy eating choices, reduce food waste, and maintain a sustainable kitchen. Features a responsive design that works seamlessly across all devices.

## Features

- 🍳 **Smart Recipe Management**
  - Create and share personalized recipes
  - Track nutrition information
  - Fork and customize existing recipes
  - Like and interact with community recipes
  - Sustainability scoring for recipes
  - AI-powered recipe recommendations

- 🛒 **Intelligent Grocery Lists**
  - Create and manage shopping lists
  - Smart substitutions suggestions
  - Track item expiry dates
  - Mark items as completed
  - Mobile-friendly shopping experience

- 🏠 **Smart Pantry**
  - Track ingredients and their expiry dates
  - Categorize items
  - Monitor nutrition information
  - Get alerts for items expiring soon
  - Sustainability tracking
  - Easy inventory management
  - Pantry Analysis

- 👥 **Community Features**
  - Share recipes and cooking experiences
  - Post food rescue tips
  - Share cooking tips
  - Location-based community interaction
  - Interactive community posts

- 📊 **Mood Tracking**
  - Track how cooking experiences affect your mood
  - Personal cooking journal
  - Recipe-specific mood entries
  - Mood analytics and insights

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Shadcn/ui components (based on Radix UI)
  - TailwindCSS for styling
  - React Query for state management
  - React Hook Form for form handling
  - Zod for schema validation
  - Responsive design with mobile-first approach
  - Wouter for lightweight routing

- **Backend**:
  - Node.js with Express
  - PostgreSQL with Drizzle ORM
  - Passport.js for authentication
  - Session-based auth with express-session
  - AI services integration

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```
SESSION_SECRET=your_secret_key
BACKEND_PORT=8000
DATABASE_URL=your_database_url
```

4. Initialize the database:
```bash
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

## Development Scripts

- `npm run dev` - Start development server (client + server)
- `npm run dev:client` - Start client development server
- `npm run dev:server` - Start server development server
- `npm run build` - Build for production
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run lint` - Run linting
- `npm run check` - Type check TypeScript

## Features by Device

### Desktop
- Full-featured experience
- Side-by-side recipe viewing and editing
- Advanced data visualization
- Comprehensive pantry management

### Tablet
- Optimized touch interface
- Collapsible navigation
- Adaptive layouts for forms and lists
- Touch-friendly recipe interactions

### Mobile
- Hamburger menu navigation
- Simplified recipe views
- Quick access to essential features
- Touch-optimized controls
- Compact lists and forms

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License