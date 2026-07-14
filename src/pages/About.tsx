import React from 'react';
import { Compass, Shield, Users, Mail, Phone, MapPin, Briefcase, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button.js';

interface AboutProps {
  navigate: (path: string) => void;
}

export function About({ navigate }: AboutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. HERO HEADER */}
      <section className="text-center max-w-3xl mx-auto space-y-4 py-8">
        <span className="text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-widest">
          Who We Are
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-none">
          Redefining Your Remote Work Day
        </h1>
        <p className="text-base md:text-lg text-zinc-500 leading-relaxed">
          DeskSpace is the Pacific Northwest's premium directory for on-demand hourly co-working desks, private office suites, and state-of-the-art creative audio/visual production studios.
        </p>
      </section>

      {/* 2. CORPORATE CORE VALUES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-zinc-200 p-6 rounded-xl space-y-3.5 shadow-xs">
          <div className="h-10 w-10 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-zinc-900 text-lg">Absolute Infrastructure Uptime</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Our listed co-working hubs utilize business-grade redundant fiber internet, fully static-grounded soldering benches, and color-calibrated monitors to guarantee seamless delivery.
          </p>
        </div>

        <div className="bg-white border border-zinc-200 p-6 rounded-xl space-y-3.5 shadow-xs">
          <div className="h-10 w-10 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-zinc-900 text-lg">Community and Collaboration</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            More than just concrete and desks. DeskSpace hosts weekly creative networking panels, hardware maker sessions, and tech startup pitches to keep our directory members inspired.
          </p>
        </div>

        <div className="bg-white border border-zinc-200 p-6 rounded-xl space-y-3.5 shadow-xs">
          <div className="h-10 w-10 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <Compass className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-zinc-900 text-lg">Acoustically Calibrated Rooms</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Every studio listed on DeskSpace is acoustically insulated with double soundproof glass layers and acoustic foam to capture crisp, recording-ready audio profiles instantly.
          </p>
        </div>
      </section>

      {/* 3. IMAGES & DESCRIPTION BLOCK */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-zinc-900 text-white p-8 md:p-12 rounded-2xl overflow-hidden">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Our Story & Vision</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Founded in Seattle, WA in 2026, DeskSpace was created by a small team of software engineers, sound designers, and architects who grew tired of noisy coffee shop working and rigid monthly workspace leases.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We built a high-fidelity directory that lets builders unlock spaces on-demand, paying only for the exact hours they use. Today, we support hundreds of active desks and studios across Downtown, Bellevue, Ballard, and Capitol Hill.
          </p>
          <Button variant="secondary" size="md" onClick={() => navigate('/explore')} className="flex items-center gap-1">
            Browse Directory <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="lg:col-span-6 rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800"
            alt="Colaborative team working"
            className="w-full h-72 object-cover"
          />
        </div>
      </section>

      {/* 4. SEATTLE NEIGHBORHOOD MAP LOCATIONS */}
      <section className="space-y-6 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight">Neighborhood Directory Coverage</h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Currently operating premium directory listings in 7 key Seattle neighborhood sectors:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          {['Downtown Core', 'Bellevue Plaza', 'Capitol Hill Arts', 'Pioneer Square', 'Ballard District', 'Fremont Neighborhood', 'Queen Anne Hill'].map((item, idx) => (
            <span
              key={idx}
              className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg shadow-2xs hover:border-amber-300 transition-colors"
            >
              📍 {item}
            </span>
          ))}
        </div>
      </section>

    </div>
  );
}
