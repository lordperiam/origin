import fs from 'fs';
import path from 'path';

describe('Code Structure Integrity', () => {
  // Core directories that must exist
  test('core directory structure exists', () => {
    const requiredDirs = [
      'src/app',
      'src/components',
      'src/actions',
      'src/lib',
      'src/types'
    ];
    
    requiredDirs.forEach(dir => {
      expect(fs.existsSync(path.join(process.cwd(), dir))).toBe(true);
    });
  });
  
  // Critical files that must not be deleted
  test('critical files exist', () => {
    const criticalFiles = [
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/types/index.ts',
      'next.config.js',
      'tsconfig.json'
    ];
    
    criticalFiles.forEach(file => {
      expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
    });
  });
  
  // Server action integrity
  test('server actions are properly annotated', () => {
    const serverActionDirs = ['src/actions'];
    
    const checkServerActionFiles = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          checkServerActionFiles(fullPath);
        } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (fullPath.includes('/actions/') && 
              content.includes('export async function') && 
              !content.includes('"use server"')) {
            throw new Error(`Server action file missing "use server" directive: ${fullPath}`);
          }
        }
      }
    };
    
    serverActionDirs.forEach(checkServerActionFiles);
  });
});