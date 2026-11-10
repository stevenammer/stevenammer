import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_DIR
  ? pathToFileURL(join(process.env.PLAYWRIGHT_DIR, 'index.mjs')).href
  : 'playwright');

const dir = dirname(fileURLToPath(import.meta.url));
const cards = [
  ['effort', 'E.F.F.O.R.T.', 'Keep the original. Choose the next step.', 'PUBLIC DEMO + OPEN CORE', 'layers'],
  ['interview-coach', 'Interview Coach', 'Practice the conversation.', 'OPEN-SOURCE PRACTICE', 'speech'],
  ['see-spec-send', 'See / Spec / Send', 'Fix the work. Show what helps.', 'BUILDING IN PUBLIC', 'nodes'],
  ['before-the-vibes', 'Before the Vibes', 'My code. Before the AI.', 'INDIVIDUAL + SHARED C PROJECTS, 2013-2014', 'terminal'],
  ['newsletter', 'If I Could, Would You?', 'Try it. Learn it. Teach it.', 'NEWSLETTER + WORKSHOP', 'pages'],
  ['github', 'The work, in one place.', 'Repos. Demos. What I learned.', 'GITHUB PORTFOLIO', 'tiles'],
  ['feeling-good', 'Feeling Good', 'The person behind the headset.', 'ORIGINAL SALES TRAINING', 'headset'],
  ['tonality', 'Tonality', 'Pitch. Pace. Power. Pause.', 'ORIGINAL SALES TRAINING', 'wave'],
  ['early-interruptions', 'Early Interruptions', 'Know what interrupted the call.', 'ORIGINAL SALES TRAINING', 'break'],
  ['quick-deflections', 'Quick Deflections', 'Words to keep the call moving.', 'ORIGINAL SALES TRAINING', 'turn'],
  ['discovery', 'Discovery', 'A conversation with a purpose.', 'ORIGINAL SALES TRAINING', 'search'],
  ['listening', 'Listening to Your Guest', 'Leave room to hear the answer.', 'ORIGINAL SALES TRAINING', 'listen'],
];
const shapes = {
  layers: '<rect x="4" y="4" width="170" height="110" rx="8"/><rect x="22" y="28" width="170" height="110" rx="8" fill="#161614"/><rect x="40" y="52" width="170" height="110" rx="8" fill="#0c0c0b"/><path d="M65 85h90M65 105h115M65 125h67"/>',
  speech: '<rect x="10" y="10" width="195" height="130" rx="18"/><path d="M52 140v28l40-28M38 79h14l9-25 13 51 15-60 14 54 12-37 8 17h47"/>',
  nodes: '<path d="M45 49l62 62 64-62"/><circle cx="45" cy="49" r="28" fill="#0c0c0b"/><circle cx="107" cy="111" r="28" fill="#0c0c0b"/><circle cx="171" cy="49" r="28" fill="#0c0c0b"/><circle cx="45" cy="49" r="5" fill="#a99ae8" stroke="none"/><circle cx="107" cy="111" r="5" fill="#9acb91" stroke="none"/><circle cx="171" cy="49" r="5" fill="#a99ae8" stroke="none"/>',
  terminal: '<rect x="6" y="12" width="205" height="146" rx="8"/><path d="M6 45h205M33 82l24 19-24 19M72 120h36M147 72c-16 0-15 11-15 19s-5 10-11 10c6 0 11 2 11 10s-1 19 15 19M166 72c16 0 15 11 15 19s5 10 11 10c-6 0-11 2-11 10s1 19-15 19"/>',
  pages: '<rect x="4" y="4" width="150" height="150" rx="5"/><rect x="33" y="23" width="150" height="150" rx="5" fill="#0c0c0b"/><path d="M61 58h92M61 78h92M61 98h68M61 128h44"/><circle cx="175" cy="133" r="27" fill="#0c0c0b"/><path d="M164 133h22M175 122v22"/>',
  tiles: '<rect x="6" y="5" width="58" height="58" rx="5"/><rect x="80" y="5" width="58" height="58" rx="5"/><rect x="154" y="5" width="58" height="58" rx="5"/><rect x="6" y="79" width="58" height="58" rx="5"/><rect x="80" y="79" width="58" height="58" rx="5"/><rect x="154" y="79" width="58" height="58" rx="5"/><path d="M25 34h20M109 24v20M173 34h20M25 108h20M109 98v20M173 108h20"/>',
  headset: '<path d="M28 100V80a80 80 0 0 1 160 0v20M28 90H15v46h28V90H28M188 90h13v46h-28V90h15M188 136c0 22-18 31-46 31"/><circle cx="127" cy="167" r="5" fill="#9acb91" stroke="none"/><circle cx="108" cy="82" r="25"/><path d="M65 150c3-27 20-41 43-41s40 14 43 41"/>',
  wave: '<path d="M5 85h24l10-23 13 47 16-72 16 98 17-120 16 120 16-98 16 72 13-47 10 23h32"/><path d="M5 160h195"/>',
  break: '<path d="M7 83h69M139 83h69M88 49l-14 29 21 9-14 29M126 49l-14 29 21 9-14 29"/><circle cx="107" cy="82" r="72" stroke-dasharray="6 9"/>',
  turn: '<path d="M15 45h75c29 0 48 17 48 43v29M118 98l20 20 20-20M26 150h164"/><circle cx="15" cy="45" r="6" fill="#a99ae8" stroke="none"/><circle cx="190" cy="150" r="6" fill="#9acb91" stroke="none"/>',
  search: '<circle cx="88" cy="73" r="53"/><path d="M126 112l58 58M60 61h56M60 80h43M60 99h26"/><circle cx="88" cy="73" r="65" stroke-dasharray="4 10"/>',
  listen: '<path d="M24 27h155v92H96l-31 29v-29H24zM49 59h104M49 80h70"/><path d="M190 43c15 20 15 43 0 63M205 29c23 28 23 63 0 91"/>',
};
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function svg([slug, title, subtitle, category, motif]) {
  // Long titles get a little more room while remaining dominant at thumbnail size.
  const font = title.length > 20 ? 66 : title.length > 16 ? 72 : 82;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title><desc id="desc">${esc(subtitle)} ${esc(category)}. Cover for Steven Ammer.</desc>
<rect width="1200" height="630" fill="#0c0c0b"/><rect x="28.5" y="28.5" width="1143" height="573" fill="none" stroke="#494740"/>
<path d="M76 91h41" stroke="#a99ae8" stroke-width="4"/><text x="76" y="249" fill="#efece4" font-family="Arial, sans-serif" font-weight="700" font-size="${font}" letter-spacing="-2">${esc(title)}</text>
<text x="79" y="309" fill="#a8a49a" font-family="Arial, sans-serif" font-size="29">${esc(subtitle)}</text>
<g transform="translate(914 205)" fill="none" stroke="#a99ae8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${shapes[motif]}</g>
<path d="M76 513h1048" stroke="#494740"/><text x="78" y="554" fill="#efece4" font-family="Arial, sans-serif" font-size="20" font-weight="700">Steven Ammer</text><text x="1123" y="554" text-anchor="end" fill="#a8a49a" font-family="Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="1">${esc(category)}</text>
</svg>\n`;
}
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const images = [];
  for (const card of cards) {
    const markup = svg(card);
    await writeFile(join(dir, `${card[0]}.svg`), markup);
    await page.setContent(`<html><body style="margin:0">${markup}</body></html>`);
    const bounds = await page.locator('svg > text').evaluateAll((els) => els.map((el) => ({ text: el.textContent, x: el.getBBox().x, right: el.getBBox().x + el.getBBox().width })));
    if (bounds[0].right > 880 || bounds[1].right > 880 || bounds.some((b) => b.x < 40 || b.right > 1160)) throw Error(`Text overflow: ${card[0]} ${JSON.stringify(bounds)}`);
    await page.screenshot({ path: join(dir, `${card[0]}.png`) });
    images.push({ slug: card[0], src: `data:image/svg+xml;base64,${Buffer.from(markup).toString('base64')}` });
  }
  await page.setViewportSize({ width: 1140, height: 920 });
  await page.setContent(`<html><body style="margin:0;background:#262622;color:#efece4;font:14px Arial"><div style="display:grid;grid-template-columns:repeat(3,360px);gap:20px;padding:20px">${images.map(({slug,src}) => `<div><img alt="" width="360" height="189" src="${src}"><div style="padding:5px 0">${slug}</div></div>`).join('')}</div></body></html>`);
  await page.screenshot({ path: join(dir, 'contact-sheet.png'), fullPage: true });
} finally { await browser.close(); }
