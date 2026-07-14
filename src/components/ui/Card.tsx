import React, { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverEffect?: boolean;
  key?: any;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

export function Card({ children, className = '', hoverEffect = true, ...props }: CardProps) {
  return (
    <div
      className={`bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-350 ease-out ${
        hoverEffect ? 'hover:shadow-[0_20px_45px_rgb(0,0,0,0.05)] hover:-translate-y-1.5 will-change-transform' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-pulse flex flex-col h-[380px]">
      {/* Image box placeholder */}
      <div className="w-full h-48 bg-zinc-200" />
      
      {/* Content box placeholder */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-4 bg-zinc-200 rounded w-1/4" />
          <div className="h-6 bg-zinc-200 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-3.5 bg-zinc-200 rounded w-full" />
            <div className="h-3.5 bg-zinc-200 rounded w-5/6" />
          </div>
        </div>
        
        {/* Footer placeholder */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          <div className="h-5 bg-zinc-200 rounded w-1/3" />
          <div className="h-8 bg-zinc-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
