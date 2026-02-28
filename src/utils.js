export const determineType = (scores) => {
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const first = entries[0];
  const isMid = (val) => val >= 2.7 && val <= 3.69;
  if (entries.every(([_, val]) => isMid(val))) return 'soutyou';
  if (scores['O'] >= 3.7 && scores['E'] <= 2.69) return 'akegata';
  if (scores['O'] >= 3.7 && scores['C'] <= 2.69) return 'mahiru';
  if (scores['E'] >= 3.7 && scores['C'] <= 2.69) return 'hirusagari';
  if (scores['A'] >= 3.7 && scores['E'] <= 2.69) return 'higure';
  const top2 = [entries[0][0], entries[1][0]];
  const has = (f1, f2) => top2.includes(f1) && top2.includes(f2);
  if (has('O', 'E')) return 'yoakemae';
  if (has('O', 'C')) return 'gozentyuu';
  if (has('E', 'C')) return 'hakutyuu';
  if (has('A', 'E')) return 'yugata';
  if (has('C', 'A')) return 'yohuke';
  if (has('N', 'O')) return 'mayonaka';
  if (has('N', 'C')) return 'sinya';
  switch (first[0]) {
    case 'O': return 'yoakemae'; case 'C': return 'gozentyuu'; case 'E': return 'hakutyuu'; case 'A': return 'yugata'; case 'N': return 'mayonaka'; default: return 'soutyou';
  }
};