import React, { useState } from 'react';
import { Search, Download, Filter, MapPin, Building2, Wrench } from 'lucide-react';
import { CandidateRecord } from '../types';
import { KERALA_DISTRICTS } from '../data/masterData';

interface AllCandidatesTableProps {
  candidates: CandidateRecord[];
  onSelectDistrict: (district: string) => void;
  onSelectSkill: (skill: string) => void;
}

export const AllCandidatesTable: React.FC<AllCandidatesTableProps> = ({
  candidates,
  onSelectDistrict,
  onSelectSkill
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');

  // Extract distinct skills from registered candidates
  const registeredSkills = Array.from(
    new Set(candidates.map((c) => c.skillCategory).filter(Boolean))
  ).sort();

  const filteredCandidates = candidates.filter((c) => {
    const matchesDistrict = selectedDistrict === 'all' || c.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesSkill = selectedSkill === 'all' || c.skillCategory.toLowerCase() === selectedSkill.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      c.fullName.toLowerCase().includes(query) ||
      c.submissionId.toLowerCase().includes(query) ||
      c.candidateId.toLowerCase().includes(query) ||
      c.phoneNumber.includes(query) ||
      c.district.toLowerCase().includes(query) ||
      c.officeOrIti.toLowerCase().includes(query) ||
      c.skillCategory.toLowerCase().includes(query);

    return matchesDistrict && matchesSkill && matchesSearch;
  });

  const exportCSV = () => {
    const headers = [
      'Submission ID',
      'Candidate ID',
      'Timestamp',
      'Full Name',
      'Phone Number',
      'District',
      'Office / ITI',
      'Skill Category / Trade',
      'Status'
    ];

    const rows = filteredCandidates.map((c) => [
      `"${c.submissionId.replace(/"/g, '""')}"`,
      `"${c.candidateId.replace(/"/g, '""')}"`,
      `"${c.timestamp.replace(/"/g, '""')}"`,
      `"${c.fullName.replace(/"/g, '""')}"`,
      `"${c.phoneNumber.replace(/"/g, '""')}"`,
      `"${c.district.replace(/"/g, '""')}"`,
      `"${c.officeOrIti.replace(/"/g, '""')}"`,
      `"${c.skillCategory.replace(/"/g, '""')}"`,
      `"${c.status.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kerala_iti_candidates_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-[#0e5774]/20 rounded-md shadow-xs overflow-hidden">
      
      {/* Header Controls */}
      <div className="p-5 sm:p-6 border-b border-[#0e5774]/15 bg-[#0e5774]/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-[#0e5774] block mb-1">
              Candidate Registry
            </span>
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl sm:text-2xl font-editorial-serif font-bold text-[#0e5774] tracking-tight">
                Complete Candidate Archive
              </h2>
              <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 border border-[#0e5774]/20 bg-white text-[#0e5774] rounded-full">
                {filteredCandidates.length} of {candidates.length} Record{candidates.length === 1 ? '' : 's'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 italic font-editorial-serif text-[13px]">
              Full verified participant registrations logged across the state of Kerala
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0e5774] hover:bg-[#093e54] text-white text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Archive (CSV)</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#0e5774]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name, ID, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#0e5774]/20 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0e5774] focus:ring-1 focus:ring-[#0e5774]"
            />
          </div>

          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full text-xs bg-white border border-[#0e5774]/20 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0e5774] focus:ring-1 focus:ring-[#0e5774]"
            >
              <option value="all">All Districts (14)</option>
              {KERALA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full text-xs bg-white border border-[#0e5774]/20 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0e5774] focus:ring-1 focus:ring-[#0e5774]"
            >
              <option value="all">All Registered Trades ({registeredSkills.length})</option>
              {registeredSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
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
              <th scope="col" className="py-3.5 px-4">Skill Category / Trade</th>
              <th scope="col" className="py-3.5 px-4">Timestamp</th>
              <th scope="col" className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0e5774]/10">
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-xs text-slate-500 italic font-editorial-serif">
                  No candidate records match your search criteria
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
                    <button
                      onClick={() => onSelectDistrict(c.district)}
                      className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-white text-[#0e5774] border border-[#0e5774]/30 hover:bg-[#0e5774] hover:text-white transition-colors cursor-pointer rounded-full"
                    >
                      {c.district}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-700">
                    {c.officeOrIti}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onSelectSkill(c.skillCategory)}
                      className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-[#0e5774]/10 text-[#0e5774] border border-[#0e5774]/20 hover:bg-[#0e5774] hover:text-white transition-colors cursor-pointer rounded-full"
                    >
                      {c.skillCategory}
                    </button>
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
  );
};

