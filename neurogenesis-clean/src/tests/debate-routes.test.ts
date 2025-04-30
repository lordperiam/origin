import fs from 'fs';
import path from 'path';

describe('Debate Routes Structure', () => {
  const debatesPath = path.join(process.cwd(), 'src/app/debates');
  
  test('should have [debateId] directory', () => {
    expect(fs.existsSync(path.join(debatesPath, '[debateId]'))).toBe(true);
  });
  
  test('should have required debate subpages', () => {
    expect(fs.existsSync(path.join(debatesPath, '[debateId]/page.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(debatesPath, '[debateId]/analysis/page.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(debatesPath, '[debateId]/transcript/page.tsx'))).toBe(true);
  });
  
  // Add more structural tests
});