// ── DATA ─────────────────────────────────────────────────────────────
// Each week can store: { imageDataUrl, imageName, pdfUrl, pdfName, pdfSize }
const WEEKS = [
  { id:1,  title:'Semana 1',  sub:'Introducción al diseño',      desc:'Ejercicios introductorios: teoría del color, composición básica y bocetos a mano alzada.',                        image:null, pdf:null },
  { id:2,  title:'Semana 2',  sub:'Tipografía',                  desc:'Exploración tipográfica: familias, jerarquía visual y diseño editorial con texto como protagonista.',              image:null, pdf:null },
  { id:3,  title:'Semana 3',  sub:'Color y paletas',             desc:'Teoría del color aplicada: paletas armónicas, contraste cromático y psicología del color.',                        image:null, pdf:null },
  { id:4,  title:'Semana 4',  sub:'Ilustración digital',         desc:'Introducción a herramientas digitales: vectores, capas, formas y composición en pantalla.',                        image:null, pdf:null },
  { id:5,  title:'Semana 5',  sub:'Fotografía creativa',         desc:'Composición fotográfica: regla de tercios, uso de la luz natural y edición básica de imágenes.',                   image:null, pdf:null },
  { id:6,  title:'Semana 6',  sub:'Diseño editorial',            desc:'Maquetación, retículas y diseño de publicaciones: revistas, folletos y material impreso.',                         image:null, pdf:null },
  { id:7,  title:'Semana 7',  sub:'Branding',                    desc:'Identidad visual: construcción de logotipos, sistemas de marca y aplicaciones sobre soporte.',                     image:null, pdf:null },
  { id:8,  title:'Semana 8',  sub:'Diseño de interfaces',        desc:'Principios de UI/UX: wireframes, prototipado básico y usabilidad en interfaces digitales.',                        image:null, pdf:null },
  { id:9,  title:'Semana 9',  sub:'Motion & animación',          desc:'Introducción al movimiento gráfico: principios de animación, transiciones y narrativa visual en movimiento.',      image:null, pdf:null },
  { id:10, title:'Semana 10', sub:'Packaging',                   desc:'Diseño de envases y empaques: estructura, material, impresión y presentación de producto.',                        image:null, pdf:null },
  { id:11, title:'Semana 11', sub:'Ilustración vectorial',       desc:'Técnicas avanzadas de ilustración con vectores: trazados, degradados, texturas y composición.',                   image:null, pdf:null },
  { id:12, title:'Semana 12', sub:'Diseño de carteles',          desc:'Affiche y poster design: jerarquía tipográfica, impacto visual y comunicación directa.',                           image:null, pdf:null },
  { id:13, title:'Semana 13', sub:'Fotografía de producto',      desc:'Técnicas de fotografía aplicada a producto: iluminación de estudio, fondos y retoque fotográfico.',                image:null, pdf:null },
  { id:14, title:'Semana 14', sub:'Identidad corporativa',       desc:'Desarrollo de sistemas de identidad completos: manual de marca, papelería y aplicaciones digitales.',              image:null, pdf:null },
  { id:15, title:'Semana 15', sub:'Portafolio profesional',      desc:'Curaduría y presentación del portafolio: selección de piezas, narrativa visual y presentación al cliente.',       image:null, pdf:null },
  { id:16, title:'Semana 16', sub:'Proyecto final integrador',   desc:'Presentación e integración de todos los conceptos del curso en un proyecto personal completo y autoral.',         image:null, pdf:null },
];

// ── TEMP UPLOAD STATE ─────────────────────────────────────────────────
let pendingImage = null; // { dataUrl, name }
let pendingPdf   = null; // { objectUrl, name, size }

// ── INIT ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderWeeks();
  populateWeekSelect();

  document.getElementById('view-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeViewModal();
  });
  document.getElementById('admin-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAdminPanel();
  });
  document.getElementById('login-pass').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
});

// ── STATS ─────────────────────────────────────────────────────────────
function updateStats() {
  const total = WEEKS.filter(w => w.image || w.pdf).length;
  document.getElementById('stat-files').textContent = total;
}

// ── RENDER WEEKS ──────────────────────────────────────────────────────
function renderWeeks() {
  const grid = document.getElementById('weeks-grid');
  grid.innerHTML = '';

  WEEKS.forEach(w => {
    const hasImage = !!w.image;
    const hasPdf   = !!w.pdf;
    const hasAny   = hasImage || hasPdf;

    const card = document.createElement('div');
    card.className = 'week-card';
    card.onclick = () => openWeek(w.id);

    card.innerHTML = `
      <div class="week-thumb ${hasImage ? 'has-image' : ''}">
        <div class="week-badge">${w.title}</div>
        <div class="type-badges">
          ${hasImage ? '<span class="type-badge">IMG</span>' : ''}
          ${hasPdf   ? '<span class="type-badge">PDF</span>' : ''}
        </div>
        ${hasImage
          ? `<img src="${w.image.dataUrl}" alt="${w.sub}" />`
          : `<span class="thumb-placeholder ${hasAny ? 'light' : ''}">${w.id}</span>`
        }
      </div>
      <div class="week-info">
        <h3>${w.sub}</h3>
        <p>${w.desc.slice(0, 78)}…</p>
        <div class="week-meta">
          <span class="week-date">${hasAny ? 'Con archivos publicados' : 'Sin archivos aún'}</span>
          <span class="file-count">${(hasImage?1:0)+(hasPdf?1:0)} ${((hasImage?1:0)+(hasPdf?1:0))===1?'archivo':'archivos'}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  updateStats();
}

// ── VIEW MODAL ────────────────────────────────────────────────────────
function openWeek(id) {
  const w = WEEKS.find(x => x.id === id);

  document.getElementById('modal-title').textContent = w.sub;
  document.getElementById('modal-tag').textContent   = w.title;
  document.getElementById('modal-desc').textContent  = w.desc;

  const imgWrap  = document.getElementById('modal-image-wrap');
  const pdfWrap  = document.getElementById('modal-pdf-wrap');
  const emptyMsg = document.getElementById('file-empty');

  // Image
  if (w.image) {
    document.getElementById('modal-cover-img').src = w.image.dataUrl;
    imgWrap.style.display = 'block';
  } else {
    imgWrap.style.display = 'none';
  }

  // PDF
  if (w.pdf) {
    document.getElementById('modal-pdf-name').textContent = w.pdf.name;
    document.getElementById('modal-pdf-size').textContent = w.pdf.size;
    const link = document.getElementById('modal-pdf-link');
    link.href     = w.pdf.objectUrl;
    link.download = w.pdf.name;
    pdfWrap.style.display = 'block';
  } else {
    pdfWrap.style.display = 'none';
  }

  emptyMsg.style.display = (!w.image && !w.pdf) ? 'block' : 'none';

  document.getElementById('view-overlay').classList.add('active');
}

function closeViewModal() {
  document.getElementById('view-overlay').classList.remove('active');
}

// ── ADMIN PANEL ───────────────────────────────────────────────────────
function openAdminPanel()  { document.getElementById('admin-overlay').classList.add('active'); }
function closeAdminPanel() { document.getElementById('admin-overlay').classList.remove('active'); }

// ── LOGIN ─────────────────────────────────────────────────────────────
function doLogin() {
  const user  = document.getElementById('login-user').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const errEl = document.getElementById('login-error');

  // ← Change credentials here for production
  if (user === 'admin' && pass === '1234') {
    document.getElementById('login-section').style.display  = 'none';
    document.getElementById('admin-content').style.display  = 'block';
    renderManageList();
  } else {
    errEl.textContent   = 'Usuario o contraseña incorrectos.';
    errEl.style.display = 'block';
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    setTimeout(() => { errEl.style.display = 'none'; }, 3000);
  }
}

function doLogout() {
  document.getElementById('login-section').style.display  = 'block';
  document.getElementById('admin-content').style.display  = 'none';
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  resetUploadUI();
  switchTab('upload');
}

// ── TABS ──────────────────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === name)
  );
  document.querySelectorAll('.tab-pane').forEach(p =>
    p.classList.toggle('active', p.id === 'tab-' + name)
  );
  if (name === 'manage') renderManageList();
}

// ── WEEK SELECT ───────────────────────────────────────────────────────
function populateWeekSelect() {
  const sel = document.getElementById('upload-week');
  sel.innerHTML = WEEKS.map(w =>
    `<option value="${w.id}">${w.title} — ${w.sub}</option>`
  ).join('');
}

// ── IMAGE HANDLING ────────────────────────────────────────────────────
function handleImageSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    pendingImage = { dataUrl: e.target.result, name: file.name };

    // Show preview, hide zone
    document.getElementById('img-zone').style.display    = 'none';
    const prev = document.getElementById('img-preview');
    prev.style.display = 'block';
    document.getElementById('img-preview-img').src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function removeImage(e) {
  if (e) e.preventDefault();
  pendingImage = null;
  document.getElementById('img-input').value          = '';
  document.getElementById('img-preview').style.display = 'none';
  document.getElementById('img-zone').style.display    = 'block';
}

// ── PDF HANDLING ──────────────────────────────────────────────────────
function handlePdfSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Revoke previous object URL if any
  if (pendingPdf) URL.revokeObjectURL(pendingPdf.objectUrl);

  const objectUrl = URL.createObjectURL(file);
  const sizeKB    = file.size / 1024;
  const sizeLabel = sizeKB >= 1024
    ? (sizeKB / 1024).toFixed(1) + ' MB'
    : Math.round(sizeKB) + ' KB';

  pendingPdf = { objectUrl, name: file.name, size: sizeLabel };

  // Show selected row, hide zone
  document.getElementById('pdf-zone').style.display      = 'none';
  document.getElementById('pdf-selected').style.display  = 'flex';
  document.getElementById('pdf-selected-name').textContent = file.name;
}

function removePdf(e) {
  if (e) e.preventDefault();
  if (pendingPdf) URL.revokeObjectURL(pendingPdf.objectUrl);
  pendingPdf = null;
  document.getElementById('pdf-input').value             = '';
  document.getElementById('pdf-selected').style.display  = 'none';
  document.getElementById('pdf-zone').style.display      = 'block';
}

// ── PUBLISH ───────────────────────────────────────────────────────────
function doUpload() {
  const wid = parseInt(document.getElementById('upload-week').value);
  const w   = WEEKS.find(x => x.id === wid);

  if (!pendingImage && !pendingPdf) {
    showStatus('upload-status', 'error', '⚠ Selecciona al menos una imagen o un PDF.');
    return;
  }

  // Revoke old object URLs before replacing
  if (pendingImage) {
    w.image = { dataUrl: pendingImage.dataUrl, name: pendingImage.name };
  }
  if (pendingPdf) {
    if (w.pdf) URL.revokeObjectURL(w.pdf.objectUrl);
    w.pdf = { objectUrl: pendingPdf.objectUrl, name: pendingPdf.name, size: pendingPdf.size };
  }

  const parts = [];
  if (pendingImage) parts.push('imagen');
  if (pendingPdf)   parts.push('PDF');
  showStatus('upload-status', 'ok', `✓ ${parts.join(' y ')} publicado${parts.length > 1 ? 's' : ''} en ${w.title}.`);

  pendingImage = null;
  pendingPdf   = null;

  renderWeeks();
  renderManageList();
  resetUploadUI();
}

function resetUploadUI() {
  document.getElementById('img-input').value             = '';
  document.getElementById('pdf-input').value             = '';
  document.getElementById('img-preview').style.display   = 'none';
  document.getElementById('img-zone').style.display      = 'block';
  document.getElementById('pdf-selected').style.display  = 'none';
  document.getElementById('pdf-zone').style.display      = 'block';
}

// ── DELETE ────────────────────────────────────────────────────────────
function deleteImage(wid) {
  const w = WEEKS.find(x => x.id === wid);
  w.image = null;
  renderWeeks();
  renderManageList();
}

function deletePdf(wid) {
  const w = WEEKS.find(x => x.id === wid);
  if (w.pdf) URL.revokeObjectURL(w.pdf.objectUrl);
  w.pdf = null;
  renderWeeks();
  renderManageList();
}

// ── MANAGE LIST ───────────────────────────────────────────────────────
function renderManageList() {
  const container = document.getElementById('manage-list');
  let html = '';

  WEEKS.forEach(w => {
    if (!w.image && !w.pdf) return;
    html += `<p class="manage-week-label">${w.title} — ${w.sub}</p>`;

    if (w.image) {
      html += `
        <div class="manage-row">
          <div class="pdf-icon-sm" style="background:#d9e8ff;color:#1a5fb4">IMG</div>
          <span class="mname">${w.image.name}</span>
          <button class="del-btn" onclick="deleteImage(${w.id})">Eliminar</button>
        </div>`;
    }
    if (w.pdf) {
      html += `
        <div class="manage-row">
          <div class="pdf-icon-sm">PDF</div>
          <span class="mname">${w.pdf.name}</span>
          <span style="font-size:0.7rem;color:var(--text2);flex-shrink:0">${w.pdf.size}</span>
          <button class="del-btn" onclick="deletePdf(${w.id})">Eliminar</button>
        </div>`;
    }
  });

  if (!html) html = '<p style="font-size:0.8rem;color:var(--text2);padding:0.5rem 0">No hay archivos publicados aún.</p>';
  container.innerHTML = html;
}

// ── HELPERS ───────────────────────────────────────────────────────────
function showStatus(elId, type, msg) {
  const el = document.getElementById(elId);
  el.textContent  = msg;
  el.className    = type === 'ok' ? 'msg-ok' : 'msg-error';
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function scrollToWeeks() {
  document.getElementById('weeks-section').scrollIntoView({ behavior: 'smooth' });
}
