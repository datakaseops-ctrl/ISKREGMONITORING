import React from 'react';
import { Users, MapPin, Wrench, Building2, ArrowUpRight } from 'lucide-react';
import { CandidateRecord, MasterITI, MasterSkill } from '../types';
import { KERALA_DISTRICTS, MASTER_ITIS, MASTER_SKILLS } from '../data/masterData';

interface SummaryCardsProps {
  candidates: CandidateRecord[];
  masterSkills?: MasterSkill[];
  masterItis?: MasterITI[];
  onSelectTab?: (tab: 'districts' | 'skills' | 'all-candidates') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  candidates,
  masterSkills = MASTER_SKILLS,
  masterItis = MASTER_ITIS,
  onSelectTab
}) => {
  const totalCandidates = candidates.length;

  // Normalized Kerala Districts represented
  const activeDistricts = new Set(
    candidates
      .map((c) => c.district.trim())
      .filter((d) => KERALA_DISTRICTS.some((kd) => kd.toLowerCase() === d.toLowerCase()))
  );

  // Unique active skills
  const activeSkills = new Set(
    candidates.map((c) => c.skillCategory.trim()).filter(Boolean)
  );

  // Unique active ITIs
  const activeItis = new Set(
    candidates.map((c) => c.officeOrIti.trim()).filter(Boolean)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Total Candidates Registered */}
      <div 
        onClick={() => onSelectTab && onSelectTab('all-candidates')}
        className="bg-white border border-[#0e5774]/20 p-6 rounded-md shadow-xs transition hover:border-[#0e5774] hover:shadow-md cursor-pointer relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#0e5774]/15 pb-2 mb-3">
            <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#0e5774]">
              Total Registrations
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#0e5774]/40 group-hover:text-[#0e5774] transition-colors" />
          </div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            Registered Candidates
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-editorial-serif text-4xl sm:text-5xl font-black text-[#0e5774] tracking-tight leading-none">
              {totalCandidates}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#0e5774] bg-[#0e5774]/10 px-2 py-0.5 border border-[#0e5774]/20 rounded-full">
              Confirmed
            </span>
          </div>
        </div>
        <p className="mt-4 pt-3 border-t border-[#0e5774]/10 text-xs text-slate-500">
          Live submissions synchronized from Google Sheets
        </p>
      </div>

      {/* District Coverage */}
      <div 
        onClick={() => onSelectTab && onSelectTab('districts')}
        className="bg-white border border-[#0e5774]/20 p-6 rounded-md shadow-xs transition hover:border-[#0e5774] hover:shadow-md cursor-pointer relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#0e5774]/15 pb-2 mb-3">
            <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#0e5774]">
              District Coverage
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#0e5774]/40 group-hover:text-[#0e5774] transition-colors" />
          </div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            Active Kerala Districts
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-editorial-serif text-4xl sm:text-5xl font-black text-[#0e5774] tracking-tight leading-none">
              {activeDistricts.size}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              of {KERALA_DISTRICTS.length} Total
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#0e5774]/10">
          <div className="w-full bg-[#0e5774]/10 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#0e5774] h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (activeDistricts.size / KERALA_DISTRICTS.length) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-500 mt-1.5 font-semibold">
            <span>Coverage</span>
            <span className="text-[#0e5774] font-bold">{((activeDistricts.size / KERALA_DISTRICTS.length) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Skills / Trades Count */}
      <div 
        onClick={() => onSelectTab && onSelectTab('skills')}
        className="bg-white border border-[#0e5774]/20 p-6 rounded-md shadow-xs transition hover:border-[#0e5774] hover:shadow-md cursor-pointer relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#0e5774]/15 pb-2 mb-3">
            <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#0e5774]">
              Skills &amp; Trades
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#0e5774]/40 group-hover:text-[#0e5774] transition-colors" />
          </div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            Active Trades
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-editorial-serif text-4xl sm:text-5xl font-black text-[#0e5774] tracking-tight leading-none">
              {activeSkills.size}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              of {masterSkills.length} Trades
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#0e5774]/10">
          <div className="w-full bg-[#0e5774]/10 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#0e5774] h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (activeSkills.size / masterSkills.length) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-500 mt-1.5 font-semibold">
            <span>Trade Reach</span>
            <span className="text-[#0e5774] font-bold">{((activeSkills.size / masterSkills.length) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* ITI Coverage */}
      <div 
        className="bg-white border border-[#0e5774]/20 p-6 rounded-md shadow-xs relative overflow-hidden flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#0e5774]/15 pb-2 mb-3">
            <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#0e5774]">
              Institutions
            </span>
            <Building2 className="w-3.5 h-3.5 text-[#0e5774]/60" />
          </div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            Active ITIs
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-editorial-serif text-4xl sm:text-5xl font-black text-[#0e5774] tracking-tight leading-none">
              {activeItis.size}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              of {masterItis.length} in Directory
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#0e5774]/10">
          <div className="w-full bg-[#0e5774]/10 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#0e5774] h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (activeItis.size / (masterItis.length || 1)) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-500 mt-1.5 font-semibold">
            <span>Participation</span>
            <span className="text-[#0e5774] font-bold">{((activeItis.size / (masterItis.length || 1)) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

    </div>
  );
};


