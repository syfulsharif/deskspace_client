import React, { useState, useEffect } from 'react';
import { User, Workspace } from './types.js';
import { api } from './lib/api.js';

// Navbar & Footer Layouts
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';

// Page Components
import { Home } from './pages/Home.js';
import { Explore } from './pages/Explore.js';
import { Details } from './pages/Details.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { AddWorkspace } from './pages/AddWorkspace.js';
import { ManageWorkspaces } from './pages/ManageWorkspaces.js';
import { About } from './pages/About.js';
import { Contact } from './pages/Contact.js';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [user, setUser] = useState<User | null>(null);
  const [featuredSpaces, setFeaturedSpaces] = useState<Workspace[]>([]);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Sync browser back/forward buttons with custom path routing
  useEffect(() => {
    // Determine path on initial load
    setCurrentPath(window.location.pathname);

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch Session + Seeded Workspaces on startup
  useEffect(() => {
    // 1. Session check
    api.getMe()
      .then((res) => {
        if (res.success && res.data) {
          setUser(res.data);
        }
        setIsAuthChecking(false);
      })
      .catch(() => {
        setIsAuthChecking(false);
      });

    // 2. Fetch first 3 highly-rated workspaces for Home featured section
    fetchFeaturedSpaces();
  }, []);

  const fetchFeaturedSpaces = () => {
    api.getWorkspaces({ sortBy: 'rating', limit: 3 })
      .then((res) => {
        if (res.success && res.data) {
          setFeaturedSpaces(res.data);
        }
      });
  };

  // Safe navigation function
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Logout Handler
  const handleLogout = () => {
    api.logout().then((res) => {
      if (res.success) {
        setUser(null);
        navigate('/');
      }
    });
  };

  // Dynamic Routing Logic
  const renderPage = () => {
    if (isAuthChecking) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-zinc-500 font-medium text-sm">Synchronizing Secure Session...</span>
        </div>
      );
    }

    const path = currentPath;

    // 1. HOME PAGE
    if (path === '/') {
      return <Home navigate={navigate} featuredSpaces={featuredSpaces} />;
    }

    // 2. EXPLORE DIRECTORY
    if (path.startsWith('/explore')) {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category') || 'all';
      const searchParam = urlParams.get('search') || '';
      return <Explore navigate={navigate} initialCategory={catParam} initialSearch={searchParam} />;
    }

    // 3. WORKSPACE DETAILS
    if (path.startsWith('/workspace/')) {
      const spaceId = path.substring('/workspace/'.length);
      return <Details workspaceId={spaceId} user={user} navigate={navigate} />;
    }

    // 4. SIGN IN
    if (path === '/login') {
      return <Login navigate={navigate} setUser={setUser} />;
    }

    // 5. SIGN UP
    if (path === '/register') {
      return <Register navigate={navigate} setUser={setUser} />;
    }

    // 6. PROTECTED: ADD WORKSPACE
    if (path === '/items/add') {
      return <AddWorkspace user={user} navigate={navigate} />;
    }

    // 7. PROTECTED: MANAGE LISTINGS & BOOKINGS
    if (path.startsWith('/items/manage')) {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab') || 'bookings';
      return <ManageWorkspaces user={user} navigate={navigate} initialTab={tabParam} refreshWorkspacesGlobal={fetchFeaturedSpaces} />;
    }

    // 8. ABOUT
    if (path === '/about') {
      return <About navigate={navigate} />;
    }

    // 9. CONTACT
    if (path === '/contact') {
      return <Contact />;
    }

    // 10. 404 FALLBACK
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-zinc-900">404 - Page Not Found</h2>
        <p className="text-sm text-zinc-500">The page you requested does not exist or has been moved.</p>
        <button onClick={() => navigate('/')} className="text-amber-600 hover:text-amber-700 font-semibold hover:underline">
          Return to Home
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Dynamic Navigation Header */}
      <Navbar currentPath={currentPath} navigate={navigate} user={user} onLogout={handleLogout} />

      {/* Main Container */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Corporate Footers */}
      <Footer navigate={navigate} />
    </div>
  );
}
