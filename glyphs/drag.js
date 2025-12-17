// ---------------------
// تبدیل SVG خارجی به Inline قبل از اضافه شدن به صفحه
// ---------------------
async function replaceImgWithInlineSVG(img) {
  const url = img.src;
  const res = await fetch(url);
  const text = await res.text();

  const temp = document.createElement('div');
  temp.innerHTML = text;
  const svg = temp.querySelector('svg');

  if (!svg) return null;

  svg.classList.add('glyph');
  svg.style.position = 'absolute';
  svg.style.cursor = 'grab';

  // pointer-events فقط روی بخش واقعی SVG
  svg.querySelectorAll('*').forEach(el => el.style.pointerEvents = 'visiblePainted');

  img.replaceWith(svg);
  return svg;
}

// ---------------------
// بقیه کد اصلی تو
// ---------------------
let activeGlyph = null;
let offsetX = 0;
let offsetY = 0;

function makeDraggable(el) {
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();

    // فقط وقتی روی بخش واقعی SVG کلیک شد فعال شود
    if (
      e.target === el ||
      ['path','circle','rect','polygon','ellipse','line'].includes(e.target.tagName.toLowerCase())
    ) {
      activeGlyph = el;
      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      el.setPointerCapture(e.pointerId);
      el.style.zIndex = Date.now();
      el.style.cursor = 'grabbing';
    }
  });
}

const glyphs = document.querySelectorAll('.glyph');
const positions = new Map();

/* چیدمان */
const COLS = 15 ;
const GAP = 24;
const START_X = 10;
const START_Y = 10;

/* layout اولیه */
glyphs.forEach((glyph, i) => {
  const x = START_X + (i % COLS) * GAP;
  const y = START_Y + Math.floor(i / COLS) * GAP;

  glyph.style.left = x + 'px';
  glyph.style.top = y + 'px';

  positions.set(glyph, { x, y });

  glyph.addEventListener('pointerdown', (e) => {
    e.preventDefault();

    const rect = glyph.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const clone = glyph.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.left = (rect.left) + 'px';
    clone.style.top  = (rect.top)  + 'px';
    clone.style.transform = 'scale(5)';
    clone.style.zIndex = Date.now();

    board.appendChild(clone);

    makeDraggable(clone);

    activeGlyph = clone;
    offsetX = rect.left;
    offsetY = rect.top;

    clone.setPointerCapture(e.pointerId);
  });
});

/* درگ */
document.addEventListener('pointermove', (e) => {
  if (!activeGlyph) return;

  e.preventDefault();
  activeGlyph.style.left = (e.clientX) + 'px';
  activeGlyph.style.top  = (e.clientY) + 'px';
});

/* رها کردن */
document.addEventListener('pointerup', (e) => {
  if (!activeGlyph) return;

  activeGlyph = null;

  try { e.target.releasePointerCapture(e.pointerId); } catch {}
});

/* reset */
document.getElementById('reset').addEventListener('click', () => location.reload());

// ---------------------
// لود و تبدیل تمام imgهای glyph خارجی
// ---------------------
document.querySelectorAll('img.glyph').forEach(img => replaceImgWithInlineSVG(img));
