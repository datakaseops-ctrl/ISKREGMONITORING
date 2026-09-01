import {
  CandidateRecord,
  DistrictStat,
  ITIStat,
  MasterITI,
  MasterSkill,
  SkillStat
} from '../types';
import { KERALA_DISTRICTS, MASTER_ITIS, MASTER_SKILLS } from '../data/masterData';

export function calculateDistrictStats(
  candidates: CandidateRecord[],
  masterItis: MasterITI[] = MASTER_ITIS
): DistrictStat[] {
  return KERALA_DISTRICTS.map((district) => {
    const districtCandidates = candidates.filter(
      (c) => c.district.toLowerCase() === district.toLowerCase()
    );

    const itisInDistrict = masterItis.filter(
      (iti) => iti.district.toLowerCase() === district.toLowerCase()
    );

    const registeredItiNames = new Set(
      districtCandidates.map((c) => c.officeOrIti.toLowerCase().trim())
    );

    // Compute top skill in this district
    const skillCounts: Record<string, number> = {};
    districtCandidates.forEach((c) => {
      if (c.skillCategory) {
        skillCounts[c.skillCategory] = (skillCounts[c.skillCategory] || 0) + 1;
      }
    });

    let topSkill = '-';
    let maxCount = 0;
    for (const [skill, count] of Object.entries(skillCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topSkill = skill;
      }
    }

    return {
      district,
      totalCandidates: districtCandidates.length,
      totalITIs: itisInDistrict.length,
      activeITIs: registeredItiNames.size,
      topSkill: maxCount > 0 ? `${topSkill} (${maxCount})` : 'None yet'
    };
  });
}

export function calculateSkillStats(
  candidates: CandidateRecord[],
  masterSkills: MasterSkill[] = MASTER_SKILLS
): SkillStat[] {
  return masterSkills.map((skill) => {
    const matchingCandidates = candidates.filter(
      (c) =>
        c.skillCategory.toLowerCase().trim() === skill.name.toLowerCase().trim() ||
        c.skillCategory.toLowerCase().includes(skill.name.toLowerCase()) ||
        skill.name.toLowerCase().includes(c.skillCategory.toLowerCase())
    );

    const uniqueDistricts = new Set(
      matchingCandidates.map((c) => c.district.trim())
    );
    const uniqueItis = new Set(
      matchingCandidates.map((c) => c.officeOrIti.trim())
    );

    return {
      slNo: skill.slNo,
      skillName: skill.name,
      candidateCount: matchingCandidates.length,
      districtsCount: uniqueDistricts.size,
      itisCount: uniqueItis.size
    };
  });
}

export function getDistrictItiStats(
  districtName: string,
  candidates: CandidateRecord[],
  masterItis: MasterITI[] = MASTER_ITIS
): ITIStat[] {
  const districtItis = masterItis.filter(
    (iti) => iti.district.toLowerCase() === districtName.toLowerCase()
  );

  const districtCandidates = candidates.filter(
    (c) => c.district.toLowerCase() === districtName.toLowerCase()
  );

  // Group candidates by ITI name
  const itiMap = new Map<string, { count: number; skills: Set<string> }>();

  districtCandidates.forEach((c) => {
    const normalizedOffice = c.officeOrIti.trim();
    if (!itiMap.has(normalizedOffice)) {
      itiMap.set(normalizedOffice, { count: 0, skills: new Set() });
    }
    const cur = itiMap.get(normalizedOffice)!;
    cur.count += 1;
    if (c.skillCategory) {
      cur.skills.add(c.skillCategory);
    }
  });

  // Track matched directory ITIs
  const result: ITIStat[] = [];
  const processedNames = new Set<string>();

  districtItis.forEach((iti) => {
    // Check direct or case-insensitive match
    let candidateCount = 0;
    let skills: string[] = [];

    for (const [officeName, data] of itiMap.entries()) {
      if (
        officeName.toLowerCase() === iti.name.toLowerCase() ||
        officeName.toLowerCase().includes(iti.name.toLowerCase()) ||
        iti.name.toLowerCase().includes(officeName.toLowerCase())
      ) {
        candidateCount += data.count;
        skills = Array.from(data.skills);
        processedNames.add(officeName);
        break;
      }
    }

    result.push({
      name: iti.name,
      district: iti.district,
      itiType: iti.itiType || 'Govt ITI',
      candidateCount,
      skillsOffered: skills,
      status: candidateCount > 0 ? 'Active Registrations' : 'No Registrations Yet'
    });
  });

  // Also include any ITI in candidates not in official directory
  for (const [officeName, data] of itiMap.entries()) {
    if (!processedNames.has(officeName) && officeName.trim().length > 0) {
      result.push({
        name: officeName,
        district: districtName,
        itiType: 'Registered Institution',
        candidateCount: data.count,
        skillsOffered: Array.from(data.skills),
        status: 'Active Registrations'
      });
    }
  }

  // Sort: Active ones first, then alphabetical
  return result.sort((a, b) => {
    if (b.candidateCount !== a.candidateCount) {
      return b.candidateCount - a.candidateCount;
    }
    return a.name.localeCompare(b.name);
  });
}

export function getSkillBreakdown(
  skillName: string,
  candidates: CandidateRecord[]
) {
  const matchingCandidates = candidates.filter((c) => {
    const sName = skillName.toLowerCase().trim();
    const cName = c.skillCategory.toLowerCase().trim();
    return sName === cName || sName.includes(cName) || cName.includes(sName);
  });

  // District breakdown
  const districtMap: Record<string, { count: number; itis: Set<string> }> = {};
  // ITI breakdown
  const itiMap: Record<string, { count: number; district: string }> = {};

  matchingCandidates.forEach((c) => {
    const dist = c.district || 'Unassigned';
    if (!districtMap[dist]) {
      districtMap[dist] = { count: 0, itis: new Set() };
    }
    districtMap[dist].count += 1;
    districtMap[dist].itis.add(c.officeOrIti);

    const iti = c.officeOrIti || 'Unknown ITI';
    if (!itiMap[iti]) {
      itiMap[iti] = { count: 0, district: dist };
    }
    itiMap[iti].count += 1;
  });

  const districtList = Object.entries(districtMap)
    .map(([district, data]) => ({
      district,
      candidateCount: data.count,
      itiCount: data.itis.size,
      percentage: ((data.count / (matchingCandidates.length || 1)) * 100).toFixed(1)
    }))
    .sort((a, b) => b.candidateCount - a.candidateCount);

  const itiList = Object.entries(itiMap)
    .map(([itiName, data]) => ({
      itiName,
      district: data.district,
      candidateCount: data.count,
      percentage: ((data.count / (matchingCandidates.length || 1)) * 100).toFixed(1)
    }))
    .sort((a, b) => b.candidateCount - a.candidateCount);

  return {
    skillName,
    totalCandidates: matchingCandidates.length,
    districts: districtList,
    itis: itiList,
    candidates: matchingCandidates
  };
}
