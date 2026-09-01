import React, { useState } from 'react';
import { Search, Wrench, ChevronRight, ArrowUpDown, Filter } from 'lucide-react';
import { CandidateRecord, MasterSkill } from '../types';
import { MASTER_SKILLS } from '../data/masterData';
import { calculateSkillStats } from '../utils/aggregations';

interface SkillTableProps {
  candidates: CandidateRecord[];
  masterSkills?: MasterSkill[];
  onSelectSkill: (skillName: string) => void;
}

export const SkillTable: React.FC<SkillTableProps> = ({
  candidates,
  masterSkills = MASTER_SKILLS,
  onSelectSkill
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'active-only'>('all');
  const [sortBy, setSortBy] = useState<'slNo' | 'name' | 'candidates'>('candidates');
  const [sortAsc, setSortAsc] = useState(false);

  const skillStats = calculateSkillStats(candidates, masterSkills);
  const totalCandidates = candidates.length || 1;

  const filteredStats = skillStats
    .filter((s) => {
      const matchesSearch =
        s.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.slNo.toString().includes(searchQuery);
      if (!matchesSearch) return false;

      if (filterMode === 'active-only') {
        return s.candidateCount > 0;
      }
      return true;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortBy === 'slNo') {
        diff = a.slNo - b.slNo;
      } else if (sortBy === 'name') {
        diff = a.skillName.localeCompare(b.skillName);
      } else if (sortBy === 'candidates') {
        diff = b.candidateCount - a.candidateCount;
      }
      return sortAsc ? -diff : diff;
    });

  const activeCount = skillStats.filter((s) => s.candidateCount > 0).length;

  const toggleSort = (field: 'slNo' | 'name' | 'candidates') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-white border border-[#0e5774]/20 rounded-md shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 sm:p-6 border-b border-[#0e5774]/15 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 bg-[#0e5774]/5">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#0e5774] block mb-1">
            Skill &amp; Trade Directory
          </span>
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl sm:text-2xl font-editorial-serif font-bold text-[#0e5774] tracking-tight">
              Skillwise Registration Splitup
            </h2>
            <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 border border-[#0e5774]/20 bg-white text-[#0e5774] rounded-full">
              63 Skills Listed
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 bg-[#0e5774]/10 text-[#0e5774] border border-[#0e5774]/20 rounded-full">
              {activeCount} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 italic font-editorial-serif text-[13px]">
            Inspect any specific vocational trade to see district distributions, originating ITIs, and registered candidates
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex border border-[#0e5774]/20 bg-white rounded-md overflow-hidden text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] cursor-pointer transition-colors ${
                filterMode === 'all'
                  ? 'bg-[#0e5774] text-white'
                  : 'text-[#0e5774] hover:bg-[#0e5774]/10'
              }`}
            >
              All (63)
            </button>
            <button
              onClick={() => setFilterMode('active-only')}
              className={`px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] cursor-pointer transition-colors ${
                filterMode === 'active-only'
                  ? 'bg-[#0e5774] text-white'
                  : 'text-[#0e5774] hover:bg-[#0e5774]/10'
              }`}
            >
              Active ({activeCount})
            </button>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-[#0e5774]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 63 skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#0e5774]/20 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0e5774] focus:ring-1 focus:ring-[#0e5774]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-[#0e5774]/5 sticky top-0 z-10 text-[#0e5774] font-bold border-b border-[#0e5774]/15 uppercase tracking-wider text-[10px]">
            <tr>
              <th 
                scope="col" 
                className="py-3.5 px-4 w-16 text-center cursor-pointer hover:bg-[#0e5774]/10 text-[#0e5774]"
                onClick={() => toggleSort('slNo')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>No.</span>
                  <ArrowUpDown className="w-3 h-3 text-[#0e5774]/50" />
                </div>
              </th>
              <th 
                scope="col" 
                className="py-3.5 px-4 cursor-pointer hover:bg-[#0e5774]/10"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Skill Category / Trade</span>
                  <ArrowUpDown className="w-3 h-3 text-[#0e5774]/50" />
                </div>
              </th>
              <th 
                scope="col" 
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-[#0e5774]/10"
                onClick={() => toggleSort('candidates')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Candidates</span>
                  <ArrowUpDown className="w-3 h-3 text-[#0e5774]/50" />
                </div>
              </th>
              <th scope="col" className="py-3.5 px-4">Share of Registrations</th>
              <th scope="col" className="py-3.5 px-4">Districts</th>
              <th scope="col" className="py-3.5 px-4">ITIs</th>
              <th scope="col" className="py-3.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0e5774]/10">
            {filteredStats.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-xs text-slate-500 italic font-editorial-serif">
                  No skills matching "{searchQuery}"
                </td>
              </tr>
            ) : (
              filteredStats.map((stat) => {
                const percentage = ((stat.candidateCount / totalCandidates) * 100).toFixed(1);
                const hasCandidates = stat.candidateCount > 0;

                return (
                  <tr
                    key={stat.slNo}
                    onClick={() => onSelectSkill(stat.skillName)}
                    className="hover:bg-[#0e5774]/5 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-[#0e5774]/70">
                      {String(stat.slNo).padStart(2, '0')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${hasCandidates ? 'bg-[#0e5774]' : 'bg-slate-300'}`} />
                        <span className="font-editorial-serif font-bold text-base text-slate-900 group-hover:text-[#0e5774] transition-all">
                          {stat.skillName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`font-editorial-serif font-bold text-base ${hasCandidates ? 'text-[#0e5774]' : 'text-slate-400'}`}>
                        {stat.candidateCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 w-44">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 bg-[#0e5774]/10 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              hasCandidates ? 'bg-[#0e5774]' : 'bg-slate-300'
                            }`}
                            style={{ width: `${Math.max(Number(percentage), hasCandidates ? 6 : 0)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-[#0e5774] font-semibold w-10 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {stat.districtsCount > 0 ? (
                        <span className="font-semibold text-[#0e5774] bg-[#0e5774]/10 px-2 py-0.5 border border-[#0e5774]/20 rounded-xs text-[11px]">
                          {stat.districtsCount} District{stat.districtsCount > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {stat.itisCount > 0 ? (
                        <span className="font-semibold text-[#0e5774] bg-[#0e5774]/10 px-2 py-0.5 border border-[#0e5774]/20 rounded-xs text-[11px]">
                          {stat.itisCount} ITI{stat.itisCount > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSkill(stat.skillName);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white border border-[#0e5774]/30 group-hover:bg-[#0e5774] group-hover:text-white text-[#0e5774] transition-colors rounded-full"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

