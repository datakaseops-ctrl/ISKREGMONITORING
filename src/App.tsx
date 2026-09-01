import React, { useState, useEffect, useCallback } from 'react';
import {
  CandidateRecord,
  MasterITI,
  MasterSkill,
  NavigationState,
  ActiveTab
} from './types';
import {
  INITIAL_CANDIDATE_DATA,
  KERALA_DISTRICTS,
  MASTER_ITIS,
  MASTER_SKILLS
} from './data/masterData';
import { fetchLiveSheetData } from './utils/csvParser';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { DistrictTable } from './components/DistrictTable';
import { SkillTable } from './components/SkillTable';
import { DistrictView } from './components/DistrictView';
import { SkillView } from './components/SkillView';
import { AllCandidatesTable } from './components/AllCandidatesTable';
import { MapPin, Wrench, Users } from 'lucide-react';

export default function App() {
  const [candidates, setCandidates] = useState<CandidateRecord[]>(INITIAL_CANDIDATE_DATA);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(new Date());
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  
  const [navState, setNavState] = useState<NavigationState>({
    view: 'home',
    tab: 'districts'
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('districts');

  const syncData = useCallback(async (isManual = true) => {
    if (isManual) setIsLoading(true);
    setErrorMessage(undefined);
    try {
      const result = await fetchLiveSheetData();
      if (result.records && result.records.length > 0) {
        setCandidates(result.records);
      }
      setIsLive(result.isLive);
      setLastSynced(new Date());
      if (result.error) {
        setErrorMessage(result.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sync with Google Sheet');
    } finally {
      if (isManual) setIsLoading(false);
    }
  }, []);

  // Fetch immediately on mount and poll every 25 seconds
  useEffect(() => {
    syncData(true);
    const interval = setInterval(() => {
      syncData(false);
    }, 25000);
    return () => clearInterval(interval);
  }, [syncData]);

  const handleNavigateToDistrict = (districtName: string) => {
    setNavState({ view: 'district', districtName });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToSkill = (skillName: string) => {
    setNavState({ view: 'skill', skillName });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setNavState({ view: 'home', tab: activeTab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setNavState({ view: 'home', tab });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-[#0e5774]/20 selection:text-[#0e5774]">
      {/* Global Header */}
      <Header
        navState={navState}
        onNavigate={setNavState}
        isLive={isLive}
        isLoading={isLoading}
        lastSynced={lastSynced}
        errorMessage={errorMessage}
        onRefresh={() => syncData(true)}
        totalRecords={candidates.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* District Detail Page */}
        {navState.view === 'district' && (
          <DistrictView
            districtName={navState.districtName}
            candidates={candidates}
            masterItis={MASTER_ITIS}
            onBackToHome={handleBackToHome}
            onSelectSkill={handleNavigateToSkill}
          />
        )}

        {/* Skill Detail Page */}
        {navState.view === 'skill' && (
          <SkillView
            skillName={navState.skillName}
            candidates={candidates}
            onBackToHome={handleBackToHome}
            onSelectDistrict={handleNavigateToDistrict}
          />
        )}

        {/* Home View */}
        {navState.view === 'home' && (
          <div className="space-y-6">
            
            {/* Summary Statistics */}
            <SummaryCards
              candidates={candidates}
              masterSkills={MASTER_SKILLS}
              masterItis={MASTER_ITIS}
              onSelectTab={handleTabChange}
            />

            {/* Navigation Tabs Bar */}
            <div className="flex border-b border-[#0e5774]/20 bg-white rounded-t-md px-6 pt-4 gap-4 sm:gap-8 overflow-x-auto shadow-xs">
              <button
                onClick={() => handleTabChange('districts')}
                className={`inline-flex items-center gap-2 pb-3.5 text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'districts'
                    ? 'border-[#0e5774] text-[#0e5774]'
                    : 'border-transparent text-slate-500 hover:text-[#0e5774]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Districts (14)</span>
              </button>

              <button
                onClick={() => handleTabChange('skills')}
                className={`inline-flex items-center gap-2 pb-3.5 text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'skills'
                    ? 'border-[#0e5774] text-[#0e5774]'
                    : 'border-transparent text-slate-500 hover:text-[#0e5774]'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Skills &amp; Trades (63)</span>
              </button>

              <button
                onClick={() => handleTabChange('all-candidates')}
                className={`inline-flex items-center gap-2 pb-3.5 text-xs uppercase tracking-wider font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'all-candidates'
                    ? 'border-[#0e5774] text-[#0e5774]'
                    : 'border-transparent text-slate-500 hover:text-[#0e5774]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>All Candidates ({candidates.length})</span>
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === 'districts' && (
              <DistrictTable
                candidates={candidates}
                masterItis={MASTER_ITIS}
                onSelectDistrict={handleNavigateToDistrict}
              />
            )}

            {activeTab === 'skills' && (
              <SkillTable
                candidates={candidates}
                masterSkills={MASTER_SKILLS}
                onSelectSkill={handleNavigateToSkill}
              />
            )}

            {activeTab === 'all-candidates' && (
              <AllCandidatesTable
                candidates={candidates}
                onSelectDistrict={handleNavigateToDistrict}
                onSelectSkill={handleNavigateToSkill}
              />
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#0e5774]/15 bg-white py-6 text-center text-xs text-slate-500 font-editorial-serif">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-sans uppercase tracking-wider font-semibold text-slate-500">
          <span>Industrial Training Department &bull; Govt. of Kerala</span>
          <span className="italic font-editorial-serif text-[#0e5774] font-normal lowercase tracking-normal text-sm">
            IndiaSkills Registration Summary &bull; Real-time Analytics
          </span>
          <span>&copy; {new Date().getFullYear()} All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}
