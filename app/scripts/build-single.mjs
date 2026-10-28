// Builds the demo app into one self-contained HTML file. Usage: npm run build:single  →  ../preview/대출신청 상세정보 v3.html
import { buildSingleFile } from './single-file.mjs';

await buildSingleFile({ input: 'index.html', target: process.argv[2] ?? '../preview/대출신청 상세정보 v3.html' });
