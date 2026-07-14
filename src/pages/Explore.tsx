import React, { useState, useEffect } from 'react';
import { Search, Compass, MapPin, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RotateCcw, AlertTriangle, Users, DollarSign } from 'lucide-react';
import { Workspace } from '../types.js';
import { api } from '../lib/api.js';
import { Button } from '../components/ui/Button.js';
import { Card, CardSkeleton } from '../components/ui/Card.js';
import { motion } from 'motion/react';

interface ExploreProps {
  navigate: (path: string) => void;
  initialCategory?: string;
  initialSearch?: string;
}

export function Explore({ navigate, initialCategory = 'all', initialSearch = '' }: ExploreProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Parse location list based on seeded items
  const locations = [
    { value: 'all', label: 'All Neighborhoods' },
    { value: 'Downtown', label: 'Downtown' },
    { value: 'Bellevue', label: 'Bellevue Plaza' },
    { value: 'Capitol Hill', label: 'Capitol Hill' },
    { value: 'Pioneer Square', label: 'Pioneer Square' },
    { value: 'Ballard', label: 'Ballard' },
    { value: 'Fremont', label: 'Fremont' },
    { value: 'Queen Anne', label: 'Queen Anne' },
  ];

  const categories = [
    { value: 'all', label: 'All Space Categories' },
    { value: 'coworking', label: 'Co-working Desks' },
    { value: 'private_office', label: 'Private Offices' },
    { value: 'meeting_room', label: 'Meeting Rooms' },
    { value: 'creative_studio', label: 'A/V & Photo Studios' },
  ];

  // Sync category or search props from URL / Home navigation parameters
  useEffect(() => {
    setCategory(initialCategory);
    setSearch(initialSearch);
    setPage(1);
  }, [initialCategory, initialSearch]);

  const fetchWorkspaces = () => {
    setIsLoading(true);
    api.getWorkspaces({
      search,
      category,
      location: location === 'all' ? undefined : location,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy,
      page,
      limit: 6
    })
    .then((res) => {
      if (res.success && res.data) {
        setWorkspaces(res.data);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
          setTotalCount(res.pagination.totalCount);
        }
      }
      setIsLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [category, location, sortBy, page]);

  // Debounced search trigger via manual search button click or form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchWorkspaces();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('all');
    setLocation('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setPage(1);
    // Directly re-fetch after clear state
    api.getWorkspaces({ page: 1, limit: 6 }).then((res) => {
      if (res.success && res.data) {
        setWorkspaces(res.data);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
          setTotalCount(res.pagination.totalCount);
        }
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Browse Workspace Directory</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Explore and secure hourly co-working desks, custom meeting boardrooms, and highly tuned production studios.
        </p>
      </div>

      {/* Grid: Filters Panel Left (Desktop) + Spaces Grid Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* FILTERS PANEL */}
        <div className="lg:col-span-1 space-y-6 bg-white border border-zinc-100/80 p-6 rounded-2xl h-fit shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <span className="flex items-center gap-2 font-bold text-sm text-zinc-950">
              <SlidersHorizontal className="h-4 w-4 text-amber-600" strokeWidth={1.75} /> Filters & Options
            </span>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-amber-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} /> Reset
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Keyword Search</label>
            <div className="flex items-center gap-2 border border-zinc-200 rounded-xl px-3 py-2 text-sm bg-zinc-50/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-amber-500/5 focus-within:border-amber-500 transition-all duration-200">
              <Search className="h-4 w-4 text-zinc-400 shrink-0" strokeWidth={1.75} />
              <input
                type="text"
                placeholder="Desk, studio, monitor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-zinc-800 text-xs font-semibold placeholder:text-zinc-400 placeholder:font-normal"
              />
            </div>
            <Button type="submit" variant="outline" size="sm" className="w-full text-xs font-bold py-2">
              Apply Keyword
            </Button>
          </form>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Workspace Category</label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setCategory(cat.value);
                    setPage(1);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${
                    category === cat.value
                      ? 'bg-amber-500/5 text-amber-700 border-amber-500/10 font-bold'
                      : 'text-zinc-500 hover:bg-zinc-50/50 hover:text-zinc-900 border-transparent'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Neighborhood Location</label>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-xs font-bold bg-white text-zinc-700 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Hourly Rate ($)</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1 border border-zinc-200 rounded-xl px-2.5 py-2 text-xs font-semibold bg-zinc-50/50">
                <span className="text-zinc-400 font-bold">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-transparent outline-none border-none text-zinc-800 text-xs font-bold"
                />
              </div>
              <div className="flex items-center gap-1 border border-zinc-200 rounded-xl px-2.5 py-2 text-xs font-semibold bg-zinc-50/50">
                <span className="text-zinc-400 font-bold">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-transparent outline-none border-none text-zinc-800 text-xs font-bold"
                />
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setPage(1); fetchWorkspaces(); }} className="w-full text-xs font-bold py-2 mt-1">
              Apply Price limits
            </Button>
          </div>

        </div>

        {/* DIRECTORY LISTINGS */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort/Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-zinc-100/80 px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Showing <span className="text-zinc-950 font-extrabold">{totalCount}</span> workspace listings
            </p>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
                <ArrowUpDown className="h-3.5 w-3.5" strokeWidth={1.75} /> Sort By
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 border border-zinc-200 rounded-xl text-xs bg-white text-zinc-700 font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all cursor-pointer"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="capacity">Largest Capacity</option>
              </select>
            </div>
          </div>

          {/* Results Grid / Loading State / Empty State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <CardSkeleton key={k} />
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <div className="bg-white border border-zinc-100/80 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm mt-8">
              <div className="h-14 w-14 bg-amber-500/5 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-500/10">
                <AlertTriangle className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">No workspaces match your query</h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                Try widening your search, loosening the hourly rate limits, or selecting a different workspace category.
              </p>
              <Button variant="secondary" size="sm" onClick={handleClearFilters} className="mt-2">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {workspaces.map((space) => (
                  <Card key={space.id} className="flex flex-col h-[410px] border border-zinc-100/65 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.04)] transition-all duration-300">
                    {/* Workspace Thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden shrink-0">
                      <img
                        src={space.image}
                        alt={space.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-103"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-zinc-950/80 backdrop-blur-md rounded-lg text-[9px] font-bold text-amber-400 uppercase tracking-wider border border-white/5">
                        {space.category.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="flex items-center gap-1 text-amber-600">
                            ★ <span className="text-zinc-700">{space.rating} <span className="text-zinc-400 font-medium">({space.reviewsCount})</span></span>
                          </span>
                          <span className="flex items-center gap-1 text-zinc-400">
                            <Users className="h-3.5 w-3.5" strokeWidth={1.75} /> Max {space.capacity}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-zinc-900 line-clamp-1">{space.name}</h3>
                        <p className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" strokeWidth={1.75} /> {space.location}
                        </p>
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{space.shortDescription}</p>
                      </div>

                      {/* Pricing and Action footer */}
                      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between mt-4">
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Hourly Rate</p>
                          <p className="text-base font-extrabold text-zinc-900 flex items-baseline mt-0.5">
                            ${space.pricePerHour}
                            <span className="text-xs font-medium text-zinc-400 ml-0.5">/hr</span>
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/workspace/${space.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-8 border-t border-zinc-100">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="p-2 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="text-sm font-semibold text-zinc-600 px-3">
                    Page <span className="text-zinc-900">{page}</span> of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="p-2 cursor-pointer"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </motion.div>
  );
}
