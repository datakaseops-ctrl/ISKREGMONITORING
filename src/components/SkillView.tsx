import React, { useState } from 'react';
import { ArrowLeft, Wrench, MapPin, Building2, Users, Search } from 'lucide-react';
import { CandidateRecord } from '../types';
import { getSkillBreakdown } from '../utils/aggregations';

interface SkillViewProps {
  skillName: string;
  candidates: CandidateRecord[];
  onBackToHome: () => void;
  onSelectDistrict?: (districtName: string) => void;
}

export const SkillView: React.FC<SkillViewProps> = ({
  skillName,
  candidates,
  onBackToHome,
  onSelectDistrict
}) => {
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string | null>(null);
  const [selectedItiFilter, setSelectedItiFilter] = useState<string | null>(null);

  const breakdown = getSkillBreakdown(skillName, candidates);

  // Filtered candidate list
  const filteredCandidates = breakdown.candidates.filter((c) => {
    const matchesDistrict =
      !selectedDistrictFilter || c.district.toLowerCase() === selectedDistrictFilter.toLowerCase();
    const matchesIti =
      !selectedItiFilter || c.officeOrIti.toLowerCase() === selectedItiFilter.toLowerCase();

    const query = candidateSearch.toLowerCase();
    const matchesSearch =
      !query ||
      c.fullName.toLowerCase().includes(query) ||
      c.phoneNumber.includes(query) ||
      c.submissionId.toLowerCase().includes(query) ||
      c.district.toLowerCase().includes(query) ||
      c.officeOrIti.toLowerCase().includes(query);

    return matchesDistrict && matchesIti && matchesSearch;
  });

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
              {skillName} Skill Details
            </h1>
            <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 border border-[#0e5774]/20 bg-[#0e5774]/10 text-[#0e5774] rounded-full">
              {breakdown.totalCandidates} Candidates Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 italic font-editorial-serif text-[14px]">
            Territorial and institutional distribution of candidate registrations across Kerala for {skillName}
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

      {/* Skill Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#0e5774]/20 p-6 rounded-md shadow-xs">
          <span className="text-[10px] font-bold text-[#0e5774] uppercase tracking-wider block mb-2">
            Total Registrations
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial-serif text-4xl sm:text-5xl font-black text-[#0e5774] leading-none">
              {breakdown.totalCandidates}
            </span>
            <span className="text-xs text-slate-500 font-semibold">candidates enrolled</span>
          </div>
        </div>

        <div className="bg-white border border-[#0e5774]/20 p-6 rounded-md shadow-xs">
          <span className="text-[10px] font-bold text-[#0e5774] uppercase tracking-wider block mb-2">
            Territorial Spread
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial-serif text-4xl sm:text-5xl font-black text-[#0e5774] leading-none">
              {breakdown.districts.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">districts active</span>
          </div>
        </div>

        <div className="bg-white border border-[#0e5774]/20 p-6 rounded-md shadow-xs">
          <span className="text-[10px] font-bold text-[#0e5774] uppercase tracking-wider block mb-2">
            Institution Hubs
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial-serif text-4xl sm:text-5xl font-black text-[#0e5774] leading-none">
              {breakdown.itis.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">ITIs contributing</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: District Breakdown & ITI Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* District Breakdown */}
        <div className="bg-white border border-[#0e5774]/20 rounded-md shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#0e5774]/15 bg-[#0e5774]/5 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#0e5774] block mb-1">
                District Distribution
              </span>
              <h2 className="text-lg font-editorial-serif font-bold text-[#0e5774]">
                District Split for {skillName}
              </h2>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 border border-[#0e5774]/20 bg-white text-[#0e5774] rounded-full">
              {breakdown.districts.length} Districts
            </span>
          </div>

          <div className="p-0">
            {breakdown.districts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 italic font-editorial-serif">
                No district registrations recorded for this trade.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#0e5774]/5 text-[#0e5774] uppercase tracking-wider text-[10px] font-bold border-b border-[#0e5774]/15">
                  <tr>
                    <th scope="col" className="py-3 px-4">District</th>
                    <th scope="col" className="py-3 px-4 text-right">Count</th>
                    <th scope="col" className="py-3 px-4">Share</th>
                    <th scope="col" className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0e5774]/10">
                  {breakdown.districts.map((d) => {
                    const isSelected = selectedDistrictFilter === d.district;
                    return (
                      <tr
                        key={d.district}
                        className={`transition-colors ${
                          isSelected ? 'bg-[#0e5774]/10 font-bold' : 'hover:bg-[#0e5774]/5'
                        }`}
                      >
                        <td className="py-3 px-4 font-editorial-serif font-bold text-sm text-slate-900">
                          {d.district}
                        </td>
                        <td className="py-3 px-4 text-right font-editorial-serif font-bold text-sm text-[#0e5774]">
                          {d.candidateCount}
                        </td>
                        <td className="py-3 px-4 w-36">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-[#0e5774]/10 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#0e5774] h-full rounded-full"
                                style={{ width: `${d.percentage}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-[#0e5774] font-semibold w-8 text-right">
                              {d.percentage}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() =>
                              setSelectedDistrictFilter(isSelected ? null : d.district)
                            }
                            className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold cursor-pointer rounded-full border ${
                              isSelected
                                ? 'bg-[#0e5774] text-white border-[#0e5774]'
                                : 'bg-white hover:bg-[#0e5774] hover:text-white text-[#0e5774] border-[#0e5774]/30'
                            }`}
                          >
                            {isSelected ? 'Filtered' : 'Filter'}
                          </button>
                          {onSelectDistrict && (
                            <button
                              onClick={() => onSelectDistrict(d.district)}
                              className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-[#0e5774]/10 hover:bg-[#0e5774] hover:text-white text-[#0e5774] border border-[#0e5774]/20 cursor-pointer rounded-full"
                            >
                              Details
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ITI Breakdown */}
        <div className="bg-white border border-[#0e5774]/20 rounded-md shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#0e5774]/15 bg-[#0e5774]/5 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#0e5774] block mb-1">
                Institution Distribution
              </span>
              <h2 className="text-lg font-editorial-serif font-bold text-[#0e5774]">
                ITI Split for {skillName}
              </h2>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 border border-[#0e5774]/20 bg-white text-[#0e5774] rounded-full">
              {breakdown.itis.length} ITIs
            </span>
          </div>

          <div className="p-0">
            {breakdown.itis.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 italic font-editorial-serif">
                No ITI registrations recorded for this trade.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#0e5774]/5 text-[#0e5774] uppercase tracking-wider text-[10px] font-bold border-b border-[#0e5774]/15">
                  <tr>
                    <th scope="col" className="py-3 px-4">ITI Name</th>
                    <th scope="col" className="py-3 px-4">District</th>
                    <th scope="col" className="py-3 px-4 text-right">Count</th>
                    <th scope="col" className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0e5774]/10">
                  {breakdown.itis.map((iti) => {
                    const isSelected = selectedItiFilter === iti.itiName;
                    return (
                      <tr
                        key={iti.itiName}
                        className={`transition-colors ${
                          isSelected ? 'bg-[#0e5774]/10 font-bold' : 'hover:bg-[#0e5774]/5'
                        }`}
                      >
                        <td className="py-3 px-4 font-editorial-serif font-bold text-sm text-slate-900">
                          {iti.itiName}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-[#0e5774]/10 text-[#0e5774] border border-[#0e5774]/20 rounded-full">
                            {iti.district}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-editorial-serif font-bold text-sm text-[#0e5774]">
                          {iti.candidateCount}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() =>
                              setSelectedItiFilter(isSelected ? null : iti.itiName)
                            }
                            className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold cursor-pointer rounded-full border ${
                              isSelected
                                ? 'bg-[#0e5774] text-white border-[#0e5774]'
                                : 'bg-white hover:bg-[#0e5774] hover:text-white text-[#0e5774] border-[#0e5774]/30'
                            }`}
                          >
                            {isSelected ? 'Filtered' : 'Filter'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Candidate List Registered for this Skill */}
      <div className="bg-white border border-[#0e5774]/20 rounded-md shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#0e5774]/15 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 bg-[#0e5774]/5">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#0e5774] block mb-1">
              Registered Candidates
            </span>
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl sm:text-2xl font-editorial-serif font-bold text-[#0e5774] tracking-tight">
                Registered Candidates for {skillName}
              </h2>
              <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 border border-[#0e5774]/20 bg-white text-[#0e5774] rounded-full">
                {filteredCandidates.length} Listed
              </span>
            </div>
            {(selectedDistrictFilter || selectedItiFilter) && (
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                <span>Active Filters:</span>
                {selectedDistrictFilter && (
                  <span className="px-2 py-0.5 bg-white text-[#0e5774] border border-[#0e5774]/30 rounded-full text-[10px] uppercase tracking-wider font-bold">
                    District: {selectedDistrictFilter}
                  </span>
                )}
                {selectedItiFilter && (
                  <span className="px-2 py-0.5 bg-white text-[#0e5774] border border-[#0e5774]/30 rounded-full text-[10px] uppercase tracking-wider font-bold">
                    ITI: {selectedItiFilter}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedDistrictFilter(null);
                    setSelectedItiFilter(null);
                  }}
                  className="text-[10px] text-[#0e5774] underline font-bold uppercase tracking-wider cursor-pointer ml-2"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Search inside candidate list */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#0e5774]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name, ID..."
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
                <th scope="col" className="py-3.5 px-4">District</th>
                <th scope="col" className="py-3.5 px-4">Office / ITI</th>
                <th scope="col" className="py-3.5 px-4">Timestamp</th>
                <th scope="col" className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0e5774]/10">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-xs text-slate-500 italic font-editorial-serif">
                    No candidates found for the selected filters
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
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-[#0e5774]/10 text-[#0e5774] border border-[#0e5774]/20 rounded-full">
                        {c.district}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700">
                      {c.officeOrIti}
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

