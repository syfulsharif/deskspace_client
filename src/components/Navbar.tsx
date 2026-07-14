import React, { useState } from 'react';
import { Menu, X, User as UserIcon, LogOut, Briefcase, Calendar, PlusSquare, Settings, Compass, Info, Home } from 'lucide-react';
import { User } from '../types.js';
import { Button } from './ui/Button.js';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  user: User | null;
  onLogout: () => void;
}

export function Navbar({ currentPath, navigate, user, onLogout }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isActive = (path: string) => currentPath === path;

  const handleNav = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const menuItems = user
    ? [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Explore', path: '/explore', icon: Compass },
        { label: 'My Bookings', path: '/items/manage?tab=bookings', icon: Calendar },
        { label: 'List a Space', path: '/items/add', icon: PlusSquare },
        { label: 'My Spaces', path: '/items/manage?tab=spaces', icon: Briefcase },
        { label: 'About', path: '/about', icon: Info },
      ]
    : [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Explore', path: '/explore', icon: Compass },
        { label: 'About', path: '/about', icon: Info },
        { label: 'Contact', path: '/contact', icon: Settings },
      ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-lg border-b border-zinc-100/60 shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight text-zinc-950 focus:outline-none cursor-pointer"
            >
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-2 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/10">
                <Briefcase className="h-4.5 w-4.5" strokeWidth={1.75} />
              </div>
              <span className="tracking-tight">Desk<span className="text-amber-600">Space</span></span>
            </button>
          </div>
 
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive(item.path)
                      ? 'bg-amber-500/5 text-amber-700 font-bold border border-amber-500/10'
                      : 'text-zinc-500 border border-transparent hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                  {item.label}
                </button>
              );
            })}
          </div>
 
          {/* User Section & Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-50 transition-colors focus:outline-none cursor-pointer border border-transparent hover:border-zinc-100"
                >
                  <div className="h-8 w-8 rounded-full bg-amber-500/15 text-amber-800 flex items-center justify-center font-bold text-xs border border-amber-500/10">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-zinc-700 max-w-[120px] truncate pr-1">{user.name}</span>
                </button>
 
                {isProfileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-zinc-100 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] py-2 z-20 overflow-hidden">
                      <div className="px-4 py-3 border-b border-zinc-50">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Signed in as</p>
                        <p className="text-xs font-bold text-zinc-900 truncate mt-0.5">{user.email}</p>
                      </div>
                      <button
                        onClick={() => handleNav('/items/manage?tab=bookings')}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left"
                      >
                        <Calendar className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                        My Bookings
                      </button>
                      <button
                        onClick={() => handleNav('/items/manage?tab=spaces')}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left"
                      >
                        <Briefcase className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                        My Listings
                      </button>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50/50 transition-colors border-t border-zinc-50 text-left"
                      >
                        <LogOut className="h-4 w-4 text-red-500" strokeWidth={1.75} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleNav('/login')}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleNav('/register')}>
                  Join Now
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-base font-medium text-left transition-colors ${
                    isActive(item.path)
                      ? 'bg-amber-50 text-amber-700 font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}

            {user ? (
              <div className="pt-4 border-t border-zinc-200 mt-4 px-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{user.name}</p>
                    <p className="text-xs text-zinc-500 truncate max-w-[200px]">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  size="sm"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-zinc-200 mt-4 flex flex-col gap-2 px-2">
                <Button variant="outline" className="w-full justify-center" onClick={() => handleNav('/login')}>
                  Sign In
                </Button>
                <Button variant="primary" className="w-full justify-center" onClick={() => handleNav('/register')}>
                  Join Now
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
