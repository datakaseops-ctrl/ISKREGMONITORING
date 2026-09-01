import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Home, ChevronRight } from 'lucide-react';
import { NavigationState } from '../types';

interface HeaderProps {
  navState: NavigationState;
  onNavigate: (state: NavigationState) => void;
  isLive: boolean;
  isLoading: boolean;
  lastSynced: Date | null;
  errorMessage?: string;
  onRefresh: () => void;
  totalRecords: number;
}

export const Header: React.FC<HeaderProps> = ({
  navState,
  onNavigate,
  isLive,
  isLoading,
  lastSynced,
  errorMessage,
  onRefresh,
  totalRecords
}) => {
  return (
    <header className="bg-white border-b border-[#0e5774]/20 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Centered Main Title and Synchronize Controls */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-editorial-serif font-black tracking-tight text-[#0e5774]">
            IndiaSkills Registration Summary
          </h1>

          {/* Sync Status & Action */}
          <div className="mt-3 flex items-center justify-center flex-wrap gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-[#0e5774]/5 border border-[#0e5774]/20 text-[#0e5774]">
              {isLive ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-xs tracking-tight text-emerald-700">Sheet Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold text-xs text-amber-700" title={errorMessage}>
                    Embedded Data ({totalRecords} records)
                  </span>
                </>
              )}
              {lastSynced && (
                <span className="text-[#0e5774]/60 border-l border-[#0e5774]/20 pl-2 text-[11px] font-mono">
                  {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#0e5774] hover:bg-[#093e54] active:bg-[#062c3b] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              title="Fetch latest updates from published Google Sheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync Sheet'}</span>
            </button>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="mt-2.5 flex items-center gap-2 text-xs text-[#0e5774]">
          <button
            onClick={() => onNavigate({ view: 'home' })}
            className={`inline-flex items-center gap-1 uppercase tracking-wider text-[11px] font-bold transition-colors cursor-pointer ${
              navState.view === 'home' ? 'text-[#0e5774] border-b-2 border-[#0e5774] pb-0.5' : 'text-[#0e5774]/60 hover:text-[#0e5774]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          {navState.view === 'district' && (
            <>
              <ChevronRight className="w-3 h-3 text-[#0e5774]/40" />
              <span className="text-[#0e5774]/70 uppercase tracking-wider text-[11px]">District View</span>
              <ChevronRight className="w-3 h-3 text-[#0e5774]/40" />
              <span className="font-editorial-serif font-bold text-[#0e5774] italic text-sm bg-[#0e5774]/5 px-2 py-0.5 border border-[#0e5774]/20 rounded-xs">
                {navState.districtName} District
              </span>
            </>
          )}

          {navState.view === 'skill' && (
            <>
              <ChevronRight className="w-3 h-3 text-[#0e5774]/40" />
              <span className="text-[#0e5774]/70 uppercase tracking-wider text-[11px]">Skill View</span>
              <ChevronRight className="w-3 h-3 text-[#0e5774]/40" />
              <span className="font-editorial-serif font-bold text-[#0e5774] italic text-sm bg-[#0e5774]/5 px-2 py-0.5 border border-[#0e5774]/20 rounded-xs">
                {navState.skillName}
              </span>
            </>
          )}

          <div className="ml-auto text-[11px] uppercase tracking-widest text-[#0e5774]/80 font-bold">
            <span className="font-editorial-serif text-sm font-black text-[#0e5774] italic mr-1">{totalRecords}</span> candidates registered
          </div>
        </nav>
      </div>
    </header>
  );
};

