import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Github, Globe, Linkedin, Twitter } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export function Footer({ navigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-zinc-300 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white focus:outline-none text-left cursor-pointer"
            >
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-2 rounded-xl flex items-center justify-center">
                <Briefcase className="h-4.5 w-4.5" strokeWidth={1.75} />
              </div>
              <span className="tracking-tight">Desk<span className="text-amber-500">Space</span></span>
            </button>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Premium, hourly co-working desks, private executive offices, and state-of-the-art creative audio/visual studios. Re-imagine your workday.
            </p>
            <div className="flex items-center space-x-2 pt-3">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 bg-zinc-800/60 hover:bg-amber-600 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all duration-200">
                <Twitter className="h-4 w-4" strokeWidth={1.75} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 bg-zinc-800/60 hover:bg-amber-600 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all duration-200">
                <Linkedin className="h-4 w-4" strokeWidth={1.75} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 bg-zinc-800/60 hover:bg-amber-600 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all duration-200">
                <Github className="h-4 w-4" strokeWidth={1.75} />
              </a>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">Explore Directory</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('/explore')} className="hover:text-amber-500 transition-colors text-left">
                  Browse All Workspaces
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/explore?category=coworking')} className="hover:text-amber-500 transition-colors text-left text-zinc-400">
                  Shared Hot Desks
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/explore?category=private_office')} className="hover:text-amber-500 transition-colors text-left text-zinc-400">
                  Private Office Suites
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/explore?category=creative_studio')} className="hover:text-amber-500 transition-colors text-left text-zinc-400">
                  Music & Art Studios
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">DeskSpace Life</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-amber-500 transition-colors text-left">
                  Our Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-amber-500 transition-colors text-left text-zinc-400">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-amber-500 transition-colors text-left text-zinc-400">
                  Locations & Cities
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-amber-500 transition-colors text-left text-zinc-400">
                  Host Benefits
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">Contact Info</h3>
            <ul className="space-y-3.5 text-sm text-zinc-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <span>1200 Pine Street, Pike Place Market,<br />Seattle, WA 98101</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                <a href="mailto:contact@deskspace.com" className="hover:text-amber-500 transition-colors">contact@deskspace.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                <a href="tel:+12065550189" className="hover:text-amber-500 transition-colors">+1 (206) 555-0189</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-850 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© {currentYear} DeskSpace Inc. Crafted as a high-fidelity co-working directory.</p>
          <div className="flex space-x-6">
            <button onClick={() => navigate('/about')} className="hover:text-zinc-300 transition-colors">Privacy Policy</button>
            <button onClick={() => navigate('/about')} className="hover:text-zinc-300 transition-colors">Terms of Service</button>
            <button onClick={() => navigate('/about')} className="hover:text-zinc-300 transition-colors">Site Map</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
