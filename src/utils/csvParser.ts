import { CandidateRecord } from '../types';
import { INITIAL_CANDIDATE_DATA, KERALA_DISTRICTS, PUBLISHED_SHEET_CSV_URL } from '../data/masterData';

/**
 * Standard RFC 4180 CSV / TSV parser that correctly handles quoted values containing commas, newlines, and quotes.
 */
export function parseCSVToRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i++; // skip escaped quote
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',' || c === '\t') {
        row.push(field.trim());
        field = '';
      } else if (c === '\r' || c === '\n') {
        if (c === '\r' && next === '\n') {
          i++; // skip LF after CR
        }
        row.push(field.trim());
        field = '';
        if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
          rows.push(row);
        }
        row = [];
      } else {
        field += c;
      }
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field.trim());
    if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
      rows.push(row);
    }
  }

  return rows;
}

export function parseCSV(csvText: string): CandidateRecord[] {
  const rows = parseCSVToRows(csvText);
  if (rows.length < 2) {
    return [];
  }

  const headerRow = rows[0];
  const headerMap: Record<string, number> = {};

  headerRow.forEach((h, index) => {
    const cleanHeader = h.toLowerCase().replace(/[^a-z0-9]/g, '');
    headerMap[cleanHeader] = index;
  });

  const getColIndex = (primaryExact: string, aliases: string[], defaultFallbackIndex: number): number => {
    const cleanPrimary = primaryExact.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (headerMap[cleanPrimary] !== undefined) {
      return headerMap[cleanPrimary];
    }
    for (const alias of aliases) {
      const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (headerMap[cleanAlias] !== undefined) {
        return headerMap[cleanAlias];
      }
    }
    // Substring match check
    for (const [key, idx] of Object.entries(headerMap)) {
      if (key.includes(cleanPrimary) || cleanPrimary.includes(key)) {
        return idx;
      }
    }
    return defaultFallbackIndex;
  };

  // 9 Columns in reference sheet:
  // 0: Submission ID
  // 1: Candidate ID
  // 2: Timestamp
  // 3: Full Name
  // 4: Phone Number
  // 5: District
  // 6: Name of Office / ITI
  // 7: Skill Category / Trade
  // 8: Status
  const subIdIdx = getColIndex('Submission ID', ['submissionid', 'submission', 'subid'], 0);
  const candIdIdx = getColIndex('Candidate ID', ['candidateid', 'candidateno', 'aadhaar'], 1);
  const timeIdx = getColIndex('Timestamp', ['timestamp', 'time', 'date', 'createdat'], 2);
  const nameIdx = getColIndex('Full Name', ['fullname', 'name', 'studentname', 'candidatefullname'], 3);
  const phoneIdx = getColIndex('Phone Number', ['phonenumber', 'phone', 'mobile', 'contact'], 4);
  const districtIdx = getColIndex('District', ['district', 'dist', 'location'], 5);
  const itiIdx = getColIndex('Name of Office / ITI', ['nameofofficeiti', 'officeiti', 'iti', 'nameofoffice', 'institution'], 6);
  const skillIdx = getColIndex('Skill Category / Trade', ['skillcategorytrade', 'skillcategory', 'trade', 'skill', 'course'], 7);
  const statusIdx = getColIndex('Status', ['status', 'submissionstatus', 'state'], 8);

  const records: CandidateRecord[] = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i];
    if (!cols || cols.length < 3) continue;

    const submissionId = (cols[subIdIdx] !== undefined ? cols[subIdIdx] : cols[0]) || `INDSK-2026-${i}`;
    const candidateId = (cols[candIdIdx] !== undefined ? cols[candIdIdx] : cols[1]) || '';
    const timestamp = (cols[timeIdx] !== undefined ? cols[timeIdx] : cols[2]) || '';
    const fullName = (cols[nameIdx] !== undefined ? cols[nameIdx] : cols[3]) || '';
    const phoneNumber = (cols[phoneIdx] !== undefined ? cols[phoneIdx] : cols[4]) || '';
    const rawDistrict = (cols[districtIdx] !== undefined ? cols[districtIdx] : cols[5]) || '';
    const officeOrIti = (cols[itiIdx] !== undefined ? cols[itiIdx] : cols[6]) || '';
    const skillCategory = (cols[skillIdx] !== undefined ? cols[skillIdx] : cols[7]) || '';
    const status = (cols[statusIdx] !== undefined ? cols[statusIdx] : cols[8]) || 'Confirmed';

    // Skip empty dummy rows
    if (!fullName && !phoneNumber && !submissionId) continue;

    // Normalize district against official Kerala 14 districts
    const cleanRawDistrict = rawDistrict.trim();
    const matchedDistrict = KERALA_DISTRICTS.find(
      (d) => d.toLowerCase() === cleanRawDistrict.toLowerCase()
    );
    const district = matchedDistrict || cleanRawDistrict || 'Unknown';

    records.push({
      submissionId: submissionId.trim(),
      candidateId: candidateId.trim(),
      timestamp: timestamp.trim(),
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      district,
      officeOrIti: officeOrIti.trim(),
      skillCategory: skillCategory.trim(),
      status: status.trim() || 'Confirmed'
    });
  }

  return records;
}

export async function fetchLiveSheetData(): Promise<{ records: CandidateRecord[]; isLive: boolean; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(PUBLISHED_SHEET_CSV_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/csv, text/plain, */*'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const text = await response.text();
    const parsed = parseCSV(text);

    if (parsed.length > 0) {
      return { records: parsed, isLive: true };
    } else {
      return { records: INITIAL_CANDIDATE_DATA, isLive: false, error: 'Empty sheet data returned' };
    }
  } catch (err: any) {
    console.warn('Could not fetch live sheet CSV, falling back to embedded dataset:', err.message);
    return {
      records: INITIAL_CANDIDATE_DATA,
      isLive: false,
      error: err.name === 'AbortError' ? 'Connection timed out' : err.message
    };
  }
}
