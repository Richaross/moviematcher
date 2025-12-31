# Movie Matchmaker

A Tinder-style movie discovery application built with Next.js, Framer Motion, and Tailwind CSS. Users can swipe right to "like" movies (add to watchlist) and swipe left to dismiss them.


## Features

*   **Tinder-Style Swiping**: Intuitive gesture-based interface for browsing movies.
*   **User Authentication**: Secure login and signup powered by Supabase.
*   **Movie Trailers**: Watch trailers directly within the movie card.
*   **Discovery Filters**: Filter movies by Genre, Year, Rating, Runtime, and Sort Order (Popularity, Release Date, etc.) to refine your recommendations.
*   **Infinite Scrolling**: "Load More" functionality keeps the movie suggestions coming.
*   **Watchlist Management**: View, manage, and remove movies from your saved list.
*   **Responsive Design**: Fully optimized for mobile and desktop experiences.
*   **Glassmorphism UI**: Modern, sleek interface with blur effects and smooth animations.

## Code Architecture & Quality

The codebase has been strictly refactored for clarity, scalability, and maintainability (Dec 2025):

*   **Single Responsibility Principle (SRP)**: Components like `MovieCard` have been decomposed into focused sub-components (`MovieCardContent`, `MovieCardOverlay`) to separate logic from presentation.
*   **Custom Hooks**: Complex logic is extracted into reusable hooks (`useAuthSync`, `useMovieDeck`, `useTrailer`), keeping UI components clean and declarative.
*   **Type Safety**: Enhanced TypeScript interfaces for API responses and component props to minimize runtime errors.
*   **Optimized Performance**: Minimized re-renders through memoization and careful dependency management in `useEffect` hooks.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Data Source**: [TMDB API](https://www.themoviedb.org/documentation/api)

## Setup Instructions

### Prerequisites
1.  **Node.js**: Ensure you have Node.js installed (v18+ recommended).
2.  **TMDB Account**: You need an account to generate an API key.
3.  **Supabase Account**: You need an account to create a database project.

### Step 1: Clone and Install
```bash
git clone https://github.com/richaross/moviematcher.git
cd moviematcher
npm install
```

### Step 2: Configure API Keys

1.  **Get TMDB API Key**:
    *   Log in to [The Movie DB](https://www.themoviedb.org/).
    *   Go to **Settings** > **API**.
    *   Create an API Key and copy it.

2.  **Get Supabase Keys**:
    *   Create a new project on [Supabase](https://supabase.com/dashboard).
    *   Go to **Project Settings** > **API**.
    *   Copy the **Project URL** and the **anon public** key.

3.  **Create Environment File**:
    Create a `.env.local` file in the root directory and add your keys:
    ```env
    NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ```

### Step 3: Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Future Updates

This project is actively evolving. Here are the planned features for the next release:

1.  **Review System**: Implementation of a personal review and rating system for movies in the watchlist.
2.  **Watchlist Filtering**: Advanced filtering and sorting options directly within the `/watchlist` page (e.g., sort by rating, filter by watched status).
3.  **Watched Status**: A toggle function to mark movies in the watchlist as "Watched" or "Not Yet Watched" to better organize your viewing history.
