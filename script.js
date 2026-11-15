const $ = (id) => document.getElementById(id);
const main = $('sections'), lb = $('lb'), lbScroll = $('lb-scroll');
let cur = { s: 0, w: 0 }, opener = null;

SECTIONS.forEach((sec, si) => {
  const row = document.createElement('section');
  row.className = 'row';
  row.innerHTML = '<h2></h2><div class="rail"><button class="nav prev" aria-label="Scroll left">&#8249;</button><div class="track"></div><button class="nav next" aria-label="Scroll right">&#8250;</button></div>';
  row.querySelector('h2').textContent = sec.title;
  const track = row.querySelector('.track');

  sec.works.forEach((w, wi) => {
    const tile = document.createElement('button');
    tile.className = 'tile';
    const c = Object.assign({ x: 50, y: 50, zoom: 1 }, w.crop);
    const img = document.createElement('img');
    img.src = w.thumb || w.images[0];
    img.alt = w.title;
    img.loading = 'lazy';
    img.style.objectPosition = c.x + '% ' + c.y + '%';
    img.style.transformOrigin = c.x + '% ' + c.y + '%';
    img.style.transform = 'scale(' + c.zoom + ')';
    img.onerror = () => { img.remove(); tile.classList.add('empty'); };
    const label = document.createElement('span');
    label.textContent = w.title;
    tile.append(img, label);
    tile.onclick = () => open(si, wi, tile);
    track.appendChild(tile);
  });

  const prev = row.querySelector('.prev'), next = row.querySelector('.next');
  const step = () => track.clientWidth * 0.8;
  const sync = () => {
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  prev.onclick = () => track.scrollBy({ left: -step(), behavior: 'smooth' });
  next.onclick = () => track.scrollBy({ left: step(), behavior: 'smooth' });
  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  main.appendChild(row);
  sync();
});

function render() {
  const w = SECTIONS[cur.s].works[cur.w];
  $('lb-title').textContent = w.title;
  $('lb-desc').textContent = w.desc || '';
  lbScroll.innerHTML = '';
  (w.images && w.images.length ? w.images : [w.thumb]).forEach((src) => {
    const im = document.createElement('img');
    im.src = src;
    im.alt = w.title;
    im.onerror = () => im.remove();
    lbScroll.appendChild(im);
  });
  lbScroll.scrollTop = 0;
}
function open(s, w, tile) {
  cur = { s, w }; opener = tile;
  render();
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  $('lb-close').focus();
}
function close() {
  lb.hidden = true;
  document.body.style.overflow = '';
  if (opener) opener.focus();
}
function go(d) {
  const n = SECTIONS[cur.s].works.length;
  cur.w = (cur.w + d + n) % n;
  render();
}
$('lb-close').onclick = close;
$('lb-prev').onclick = () => go(-1);
$('lb-next').onclick = () => go(1);
document.addEventListener('keydown', (e) => {
  if (lb.hidden) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') go(-1);
  if (e.key === 'ArrowRight') go(1);
});
