import React, { useState } from 'react';
import { ArrowLeft, Building2, Users, Search, CheckCircle2, CircleDashed, Wrench, Filter } from 'lucide-react';
import { CandidateRecord, MasterITI } from '../types';
import { getDistrictItiStats } from '../utils/aggregations';

interface DistrictViewProps {
  districtName: string;
  candidates: CandidateRecord[];
  masterItis: MasterITI[];
  onBackToHome: () => void;
  onSelectSkill?: (skillName: string) => void;
}

export const DistrictView: React.FC<DistrictViewProps> = ({
  districtName,
  candidates,
  masterItis,
  onBackToHome,
  onSelectSkill
}) => {
  const [itiSearch, setItiSearch] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedItiFilter, setSelectedItiFilter] = useState<string | null>(null);
  const [candidateSearch, setCandidateSearch] = useState('');

  const districtCandidates = candidates.filter(
    (c) => c.district.toLowerCase() === districtName.toLowerCase()
  );

  const itiStats = getDistrictItiStats(districtName, candidates, masterItis);

  // ITI types available in this district
  const availableTypes = Array.from(new Set(itiStats.map((i) => i.itiType)));

  // Filtered ITIs
  const filteredItis = itiStats.filter((iti) => {
    const matchesSearch = iti.name.toLowerCase().includes(itiSearch.toLowerCase());
    const matchesType = selectedTypeFilter === 'all' || iti.itiType === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filtered Candidates
  const filteredCandidates = districtCandidates.filter((c) => {
    const matchesIti = !selectedItiFilter || c.officeOrIti.toLowerCase() === selectedItiFilter.toLowerCase();
    const query = candidateSearch.toLowerCase();
    const matchesSearch =
      !query ||
      c.fullName.toLowerCase().includes(query) ||
      c.phoneNumber.includes(query) ||
      c.submissionId.toLowerCase().includes(query) ||
      c.skillCategory.toLowerCase().includes(query) ||
      c.officeOrIti.toLowerCase().includes(query);
    return matchesIti && matchesSearch;
  });

  const activeItisCount = itiStats.filter((i) => i.candidateCount > 0).length;
  const uniqueSkillsInDistrict = Array.from(
    new Set(districtCandidates.map((c) => c.skillCategory).filter(Boolean))
  );

  return (
    <div className="space-y-8">
      
      {/* Top Banner with Back Button */}
      <div className="bg-white border border-[#0e5774]/20 p-6 sm:p-8 shadow-xs rounded-md flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#0e5774] hover:underline transition-colors cursor-pointer mb-3"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Dashboard</span>
          </button>
          
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-editorial-serif font-black text-[#0e5774] tracking-tight leading-none">
              {districtName} District
            </h1>
            <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 border border-[#0e5774]/20 bg-[#0e5774]/10 text-[#0e5774] rounded-full">
              {districtCandidates.length} Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 italic font-editorial-serif text-[14px]">
            Directory of all vocational institutions in {districtName}, candidate volumes, and active trade records
          </p>
        </div>

        <button
          onClick={onBackToHome}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0e5774] hover:bg-[#093e54] text-white text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* District Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#0e5774]/20 p-6 rounded-md shadow-xs">
          <span className="text-[10px] font-bold text-[#0e5774] uppercase tracking-wider block mb-2">
            Candidates Logged
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial-serif text-4xl sm:text-5xl font-black text-[#0e5774] leading-none">
              {districtCandidates.length}
            </span>
            <span className="text-xs text-slate-500 font-semibold">in {districtName}</span>
          </div>
        </div>

        <div className="bg-white border border-[#0e5774]/20 p-6 rounded-md shadow-xs">
          <span className="text-[10px] font-bold text-[#0e5774] uppercase tracking-wider block mb-2">
            ITIs in Territory
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial-serif text-4xl sm:text-5xl font-black text-[#0e5774] leading-none">
              {itiStats.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">({activeItisCount} active)</span>
          </div>
        </div>

        <div className="bg-white border border-[#0e5774]/20 p-6 rounded-md shadow-xs">
          <span className="text-[10px] font-bold text-[#0e5774] uppercase tracking-wider block mb-2">
            Trade Breadth
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial-serif text-4xl sm:text-5xl font-black text-[#0e5774] leading-none">
              {uniqueSkillsInDistrict.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">Skills active</span>
          </div>
        </div>
      </div>

      {/* ITI List & Status Table */}
      <div className="bg-white border border-[#0e5774]/20 rounded-md shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#0e5774]/15 flex flex-col md:flex-row md:items-end md:justify-between gap-4 bg-[#0e5774]/5">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#0e5774] block mb-1">
              Institutional Register
            </span>
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl sm:text-2xl font-editorial-serif font-bold text-[#0e5774] tracking-tight">
                All ITIs in {districtName}
              </h2>
              <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 border border-[#0e5774]/20 bg-white text-[#0e5774] rounded-full">
                {itiStats.length} Institutions
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 italic font-editorial-serif text-[13px]">
              Filter candidate logs below by selecting specific institution records
            </p>
          </div>

          {/* Search & Type filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#0e5774]/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ITI name..."
                value={itiSearch}
                onChange={(e) => setItiSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#0e5774]/20 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0e5774] focus:ring-1 focus:ring-[#0e5774]"
              />
            </div>

            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="text-xs bg-white border border-[#0e5774]/20 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0e5774] focus:ring-1 focus:ring-[#0e5774]"
            >
              <option value="all">All ITI Types ({itiStats.length})</option>
              {availableTypes.map((t) => (
                <option key={t} value={t}>
                  {t} ({itiStats.filter((i) => i.itiType === t).length})
                </option>
              ))}
            </select>

            {selectedItiFilter && (
              <button
                onClick={() => setSelectedItiFilter(null)}
                className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 bg-[#0e5774]/10 text-[#0e5774] border border-[#0e5774]/20 hover:bg-[#0e5774] hover:text-white transition-colors rounded-full cursor-pointer"
              >
                Clear ITI Filter
              </button>
            )}
          </div>
        </div>

        {/* Table of ITIs in this district */}
        <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#0e5774]/5 sticky top-0 z-10 text-[#0e5774] font-bold border-b border-[#0e5774]/15 uppercase tracking-wider text-[10px]">
              <tr>
                <th scope="col" className="py-3.5 px-4 w-12 text-center text-[#0e5774]/70">No.</th>
                <th scope="col" className="py-3.5 px-4">ITI Name</th>
                <th scope="col" className="py-3.5 px-4">Type</th>
                <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                <th scope="col" className="py-3.5 px-4 text-right">Candidates</th>
                <th scope="col" className="py-3.5 px-4 hidden md:table-cell">Registered Skill Trades</th>
                <th scope="col" className="py-3.5 px-4 text-right">Filter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0e5774]/10">
              {filteredItis.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-xs text-slate-500 italic font-editorial-serif">
                    No ITIs found matching the query
                  </td>
                </tr>
              ) : (
                filteredItis.map((iti, idx) => {
                  const hasCandidates = iti.candidateCount > 0;
                  const isFiltered = selectedItiFilter?.toLowerCase() === iti.name.toLowerCase();

                  return (
                    <tr
                      key={iti.name + idx}
                      className={`transition-colors ${
                        isFiltered
                          ? 'bg-[#0e5774]/10 font-semibold'
                          : hasCandidates
                          ? 'hover:bg-[#0e5774]/5'
                          : 'hover:bg-[#0e5774]/5 opacity-75'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-[#0e5774]/70">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-editorial-serif font-bold text-base text-slate-900">
                          {iti.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-white text-[#0e5774] border border-[#0e5774]/20 rounded-full">
                          {iti.itiType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {hasCandidates ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-widest font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-widest font-medium bg-slate-100 text-slate-500 border border-slate-200 rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-editorial-serif font-bold text-base ${hasCandidates ? 'text-[#0e5774]' : 'text-slate-400'}`}>
                          {iti.candidateCount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        {iti.skillsOffered.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-md">
                            {iti.skillsOffered.map((skill) => (
                              <span
                                key={skill}
                                onClick={() => onSelectSkill && onSelectSkill(skill)}
                                className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-[#0e5774]/10 text-[#0e5774] border border-[#0e5774]/20 cursor-pointer hover:bg-[#0e5774] hover:text-white transition-colors rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic font-editorial-serif">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {hasCandidates ? (
                          <button
                            onClick={() => {
                              setSelectedItiFilter(isFiltered ? null : iti.name);
                            }}
                            className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold transition-colors cursor-pointer rounded-full border ${
                              isFiltered
                                ? 'bg-[#0e5774] text-white border-[#0e5774]'
                                : 'bg-white hover:bg-[#0e5774] hover:text-white text-[#0e5774] border-[#0e5774]/30'
                            }`}
                          >
                            {isFiltered ? 'Filtering' : 'Filter'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate List for this District */}
      <div className="bg-white border border-[#0e5774]/20 rounded-md shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#0e5774]/15 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 bg-[#0e5774]/5">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#0e5774] block mb-1">
              Candidate Register
            </span>
            <div className="flex items-baseline gap-3">
              <h3 className="text-xl sm:text-2xl font-editorial-serif font-bold text-[#0e5774] tracking-tight">
                Registered Candidates in {districtName}
              </h3>
              <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 border border-[#0e5774]/20 bg-white text-[#0e5774] rounded-full">
                {filteredCandidates.length} {selectedItiFilter ? `at ${selectedItiFilter}` : 'Total'}
              </span>
            </div>
            {selectedItiFilter && (
              <p className="text-xs text-slate-600 mt-1 font-editorial-serif italic flex items-center gap-2">
                Filtered by ITI: <strong className="text-[#0e5774] font-sans not-italic font-bold">{selectedItiFilter}</strong>
                <button
                  onClick={() => setSelectedItiFilter(null)}
                  className="text-[#0e5774] uppercase tracking-wider text-[10px] font-sans font-bold underline cursor-pointer"
                >
                  (Reset Filter)
                </button>
              </p>
            )}
          </div>

          {/* Search inside candidate list */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#0e5774]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name, trade..."
              value={candidateSearch}
              onChange={(e) => setCandidateSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#0e5774]/20 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0e5774] focus:ring-1 focus:ring-[#0e5774]"
            />
          </div>
        </div>

        {/* Candidate Table */}
        <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#0e5774]/5 sticky top-0 z-10 text-[#0e5774] font-bold border-b border-[#0e5774]/15 uppercase tracking-wider text-[10px]">
              <tr>
                <th scope="col" className="py-3.5 px-4 w-12 text-center text-[#0e5774]/70">No.</th>
                <th scope="col" className="py-3.5 px-4">Submission ID</th>
                <th scope="col" className="py-3.5 px-4">Candidate ID</th>
                <th scope="col" className="py-3.5 px-4">Candidate Name</th>
                <th scope="col" className="py-3.5 px-4">Telephone</th>
                <th scope="col" className="py-3.5 px-4">Office / ITI</th>
                <th scope="col" className="py-3.5 px-4">Skill Category / Trade</th>
                <th scope="col" className="py-3.5 px-4">Timestamp</th>
                <th scope="col" className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0e5774]/10">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-xs text-slate-500 italic font-editorial-serif">
                    No candidate registrations found in this view
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c, idx) => (
                  <tr key={c.submissionId + idx} className="hover:bg-[#0e5774]/5 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-[#0e5774]/70">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0e5774] text-xs">
                      {c.submissionId}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                      {c.candidateId}
                    </td>
                    <td className="py-3.5 px-4 font-editorial-serif font-bold text-sm text-slate-900">
                      {c.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                      {c.phoneNumber}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700">
                      {c.officeOrIti}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-[#0e5774]/10 text-[#0e5774] border border-[#0e5774]/20 rounded-full">
                        {c.skillCategory}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[10px]">
                      {c.timestamp}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-widest font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full">
                        {c.status || 'Confirmed'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

