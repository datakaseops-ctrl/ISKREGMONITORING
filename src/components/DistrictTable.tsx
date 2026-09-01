import React, { useState } from 'react';
import { Search, MapPin, Building2, ChevronRight, ArrowUpDown } from 'lucide-react';
import { CandidateRecord, MasterITI } from '../types';
import { calculateDistrictStats } from '../utils/aggregations';

interface DistrictTableProps {
  candidates: CandidateRecord[];
  masterItis: MasterITI[];
  onSelectDistrict: (districtName: string) => void;
}

export const DistrictTable: React.FC<DistrictTableProps> = ({
  candidates,
  masterItis,
  onSelectDistrict
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'candidates' | 'itis'>('candidates');
  const [sortAsc, setSortAsc] = useState(false);

  const districtStats = calculateDistrictStats(candidates, masterItis);
  const totalCandidates = candidates.length || 1;

  const filteredStats = districtStats
    .filter((d) =>
      d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.topSkill.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let diff = 0;
      if (sortBy === 'name') {
        diff = a.district.localeCompare(b.district);
      } else if (sortBy === 'candidates') {
        diff = b.totalCandidates - a.totalCandidates;
      } else if (sortBy === 'itis') {
        diff = b.activeITIs - a.activeITIs;
      }
      return sortAsc ? -diff : diff;
    });

  const toggleSort = (field: 'name' | 'candidates' | 'itis') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-white border border-[#0e5774]/20 rounded-md shadow-xs overflow-hidden">
      {/* Header & Search Bar */}
      <div className="p-5 sm:p-6 border-b border-[#0e5774]/15 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 bg-[#0e5774]/5">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#0e5774] block mb-1">
            District Overview
          </span>
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl sm:text-2xl font-editorial-serif font-bold text-[#0e5774] tracking-tight">
              Districtwise Registration Breakdown
            </h2>
            <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 border border-[#0e5774]/20 bg-white text-[#0e5774] rounded-full">
              14 Districts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 italic font-editorial-serif text-[13px]">
            Select any district to inspect its institutional directory, trade status, and registered candidates
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#0e5774]/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search district or top skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#0e5774]/20 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0e5774] focus:ring-1 focus:ring-[#0e5774]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-[#0e5774]/5 text-[#0e5774] font-bold border-b border-[#0e5774]/15 uppercase tracking-wider text-[10px]">
            <tr>
              <th scope="col" className="py-3.5 px-4 w-12 text-center text-[#0e5774]/70">No.</th>
              <th 
                scope="col" 
                className="py-3.5 px-4 cursor-pointer hover:bg-[#0e5774]/10 transition-colors"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>District Name</span>
                  <ArrowUpDown className="w-3 h-3 text-[#0e5774]/50" />
                </div>
              </th>
              <th 
                scope="col" 
                className="py-3.5 px-4 cursor-pointer hover:bg-[#0e5774]/10 transition-colors text-right"
                onClick={() => toggleSort('candidates')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Registered</span>
                  <ArrowUpDown className="w-3 h-3 text-[#0e5774]/50" />
                </div>
              </th>
              <th scope="col" className="py-3.5 px-4">Distribution Share</th>
              <th 
                scope="col" 
                className="py-3.5 px-4 cursor-pointer hover:bg-[#0e5774]/10 transition-colors"
                onClick={() => toggleSort('itis')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Institutions (Active / Total)</span>
                  <ArrowUpDown className="w-3 h-3 text-[#0e5774]/50" />
                </div>
              </th>
              <th scope="col" className="py-3.5 px-4 hidden md:table-cell">Leading Trade</th>
              <th scope="col" className="py-3.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0e5774]/10">
            {filteredStats.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-xs text-slate-500 italic font-editorial-serif">
                  No districts match the query "{searchQuery}"
                </td>
              </tr>
            ) : (
              filteredStats.map((stat, idx) => {
                const percentage = ((stat.totalCandidates / totalCandidates) * 100).toFixed(1);
                const hasCandidates = stat.totalCandidates > 0;

                return (
                  <tr
                    key={stat.district}
                    onClick={() => onSelectDistrict(stat.district)}
                    className="hover:bg-[#0e5774]/5 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-[#0e5774]/70">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${hasCandidates ? 'bg-[#0e5774]' : 'bg-slate-300'}`} />
                        <span className="font-editorial-serif font-bold text-base text-slate-900 group-hover:text-[#0e5774] transition-all">
                          {stat.district}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`font-editorial-serif font-bold text-base ${hasCandidates ? 'text-[#0e5774]' : 'text-slate-400'}`}>
                        {stat.totalCandidates}
                      </span>
                      {hasCandidates && (
                        <span className="text-[10px] text-[#0e5774] uppercase tracking-wider ml-1.5 font-bold">reg.</span>
                      )}
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
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-[#0e5774]" />
                        <span className="font-bold text-[#0e5774]">{stat.activeITIs}</span>
                        <span className="text-slate-400">/</span>
                        <span>{stat.totalITIs} ITIs</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-600 font-editorial-serif italic">
                      {stat.topSkill}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDistrict(stat.district);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white border border-[#0e5774]/30 group-hover:bg-[#0e5774] group-hover:text-white text-[#0e5774] transition-colors rounded-full"
                      >
                        <span>View</span>
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

