/* ================= API CLIENT ================= */
const API_BASE = (window.SHOPVERSE_CONFIG && window.SHOPVERSE_CONFIG.API_BASE_URL) || 'http://localhost:3000/api/v1';
const TOKEN_KEY = 'shopverse_token';

function getToken() { return localStorage.getItem(TOKEN_KEY); }
function setToken(t) { localStorage.setItem(TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  let res;
  try {
    res = await fetch(API_BASE + path, { ...opts, headers });
  } catch (err) {
    throw new Error('Cannot reach the backend at ' + API_BASE + '. Is it running and is config.js pointed at the right URL?');
  }
  let body = null;
  try { body = await res.json(); } catch (e) { /* no body */ }
  if (!res.ok) {
    const raw = body && body.error ? body.error.message : (body && body.message);
    const msg = Array.isArray(raw) ? raw.join(', ') : (raw || ('Request failed (' + res.status + ')'));
    throw new Error(msg);
  }
  return body ? body.data : null;
}
const get = (path) => api(path);
const post = (path, data) => api(path, { method: 'POST', body: data !== undefined ? JSON.stringify(data) : undefined });
const patchReq = (path, data) => api(path, { method: 'PATCH', body: data !== undefined ? JSON.stringify(data) : undefined });
const del = (path) => api(path, { method: 'DELETE' });

function fmt(n) { return n == null ? '—' : '₹' + Math.round(n).toLocaleString('en-IN'); }
function starRow(rating) { const full = Math.round(rating || 0); return '★'.repeat(full) + '☆'.repeat(5 - full); }

/* ================= ICONS ================= */
const ICONS = {
  phone:`<path d="M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2z"/><path d="M11 18h2"/>`,
  laptop:`<path d="M4 5h16v10H4z"/><path d="M2 19h20l-2-4H4l-2 4z"/>`,
  audio:`<path d="M3 14a9 9 0 0118 0"/><path d="M21 14v4a2 2 0 01-2 2h-1v-6h3z"/><path d="M3 14v4a2 2 0 002 2h1v-6H3z"/>`,
  shoe:`<path d="M3 18h18v-2c-2 0-3-1-5-3-1-1-2-2-4-2-3 0-4 3-6 3-2 0-3-1-3-1v3a2 2 0 002 2z"/>`,
  fashion:`<path d="M8 3l4 3 4-3 3 4-3 2v11H5V9L2 7l3-4z"/>`,
  beauty:`<path d="M9 2h6v5H9z"/><path d="M8 7h8l1 15H7z"/>`,
  home:`<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>`,
  grocery:`<path d="M6 8h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M6 8L4 3H2"/>`,
  tv:`<path d="M3 4h18v13H3z"/><path d="M8 21h8M12 17v4"/>`,
  camera:`<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>`,
  tablet:`<path d="M5 3h14v18H5z"/><circle cx="12" cy="18" r="0.6"/>`,
  tag:`<path d="M20.6 12.6L12 4H4v8l8.6 8.6a2 2 0 002.8 0l5.2-5.2a2 2 0 000-2.8z"/><circle cx="8.5" cy="8.5" r="1.2"/>`,
  search:`<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>`,
  mic:`<path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10v1a7 7 0 01-14 0v-1"/><path d="M12 18v4M9 22h6"/>`,
  cam2:`<path d="M4 7h3l1.5-2h7L17 7h3v12H4z"/><circle cx="12" cy="13" r="3.2"/>`,
  qr:`<path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3z"/><path d="M15 15h2v2h-2zM19 15h2v6h-6v-2"/>`,
  trend:`<path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/>`,
  heart:`<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/>`,
  check:`<path d="M20 6L9 17l-5-5"/>`,
  x:`<path d="M18 6L6 18M6 6l12 12"/>`,
  bolt:`<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>`,
  shield:`<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/>`,
  truck:`<path d="M1 8h13v9H1z"/><path d="M14 11h4l4 3v3h-8z"/><circle cx="6" cy="19" r="1.6"/><circle cx="17.5" cy="19" r="1.6"/>`,
  plus:`<path d="M12 5v14M5 12h14"/>`,
  send:`<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>`,
  bell:`<path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>`,
  bot:`<path d="M12 2a5 5 0 00-5 5v2a5 5 0 0010 0V7a5 5 0 00-5-5z"/><path d="M8 21h8M12 17v4"/><circle cx="9" cy="8" r="1"/><circle cx="15" cy="8" r="1"/>`,
  user:`<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0116 0v1"/>`,
  spinner:`<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>`,
};
function ic(name, cls) { return `<svg class="${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||ICONS.tag}</svg>`; }

const CATEGORY_ICON_FALLBACK = { 'Smartphones':'phone','Laptops':'laptop','Audio':'audio','Footwear':'shoe','Beauty':'beauty','Home & Kitchen':'home','Electronics':'tv','Cameras':'camera','Grocery':'grocery','Fashion':'fashion' };
function iconForProduct(p) {
  if (state.data.categories) {
    const cat = state.data.categories.find(c => c.id === p.categoryId);
    if (cat && cat.icon) return cat.icon;
    if (cat) return CATEGORY_ICON_FALLBACK[cat.name] || 'tag';
  }
  return 'tag';
}

/* ================= STATE ================= */
const state = {
  view: 'home',
  query: '',
  activeProductId: null,
  compareList: new Set(),
  wishlistIds: new Set(),
  user: null,
  authModalOpen: false,
  authMode: 'login',
  authError: null,
  chat: [{ role: 'bot', text: "Hi! I'm your ShopVerse AI assistant. Ask me things like \"best phone under 30000\" or paste a product you're deciding on." }],
  priceRangeDays: '90',
  activeTab: 'specs',
  searchFocused: false,
  faqOpen: {},
  loading: {},
  data: {},
  error: null,
};

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'results', label: 'Search' },
  { id: 'compare', label: 'Compare' },
  { id: 'assistant', label: 'AI Assistant' },
  { id: 'dashboard', label: 'Dashboard' },
];

/* ================= BOOT ================= */
async function boot() {
  render();
  try {
    state.data.categories = await get('/categories');
  } catch (e) { /* backend may be offline — surfaced elsewhere */ }
  const token = getToken();
  if (token) {
    try {
      state.user = await get('/users/me');
      await refreshWishlist();
    } catch (e) { clearToken(); state.user = null; }
  }
  await loadHome();
}

async function loadHome() {
  state.loading.home = true; render();
  try {
    const [productsRes, trendingRes, couponsRes] = await Promise.allSettled([
      get('/products?pageSize=8'),
      get('/search/trending'),
      get('/coupons'),
    ]);
    if (productsRes.status === 'fulfilled') state.data.homeProducts = productsRes.value.items;
    if (trendingRes.status === 'fulfilled') state.data.trending = trendingRes.value.trending;
    if (couponsRes.status === 'fulfilled') state.data.coupons = couponsRes.value;
  } catch (e) { state.error = e.message; }
  state.loading.home = false; render();
}

async function refreshWishlist() {
  try {
    const rows = await get('/wishlist');
    state.data.wishlist = rows;
    state.wishlistIds = new Set(rows.map(r => r.productId));
  } catch (e) { /* not logged in or backend offline */ }
}

/* ================= RENDER HELPERS ================= */
function productCard(p) {
  const wished = state.wishlistIds.has(p.id);
  const hasPrice = p.minPrice != null;
  const discount = hasPrice && p.maxOriginalPrice ? Math.round((1 - p.minPrice / p.maxOriginalPrice) * 100) : 0;
  return `
  <div class="pcard fade-in" data-action="view-product" data-id="${p.id}">
    <div class="imgwrap">
      ${ic(iconForProduct(p))}
      <div class="wish ${wished?'active':''}" data-action="toggle-wish" data-id="${p.id}" onclick="event.stopPropagation()">${ic('heart')}</div>
    </div>
    <div class="badges">${p.storeCount ? `<span class="badge lowest">${p.storeCount} stores</span>` : ''}</div>
    <div class="brand">${p.sourceQuery ? 'Live search result' : 'Catalog'}</div>
    <div class="name">${p.title}</div>
    <div class="rate-row"><span class="stars">${starRow(p.ratingAvg)}</span> ${(p.ratingAvg||0).toFixed(1)} <span class="mono" style="color:var(--text-faint)">(${(p.reviewCount||0).toLocaleString('en-IN')})</span></div>
    ${hasPrice ? `<div class="price-row"><span class="price">${fmt(p.minPrice)}</span>${discount>0?`<span class="off">${discount}% off</span>`:''}</div>` : `<div class="price-row muted" style="font-size:13px">No listings yet</div>`}
    <div class="cardfoot">
      <button class="pill-btn ghost sm" data-action="add-compare" data-id="${p.id}" onclick="event.stopPropagation()">${ic('plus')} Compare</button>
      <button class="pill-btn primary sm" data-action="view-product" data-id="${p.id}" onclick="event.stopPropagation()">View</button>
    </div>
  </div>`;
}

function spinnerBlock(label) {
  return `<div class="empty-state"><div style="animation:spin 1s linear infinite;display:inline-block">${ic('spinner')}</div><p class="muted" style="margin-top:12px">${label||'Loading...'}</p></div>
  <style>@keyframes spin{to{transform:rotate(360deg)}}</style>`;
}
function errorBlock(msg) {
  return `<div class="empty-state">${ic('x')}<h3>Something went wrong</h3><p class="muted">${msg}</p></div>`;
}

/* ================= VIEWS ================= */
function renderNav() {
  document.getElementById('mainNav').innerHTML = NAV_ITEMS.map(n =>
    `<button class="${state.view===n.id?'active':''}" data-action="goto" data-view="${n.id}">${n.label}</button>`
  ).join('');
  const avatarEl = document.getElementById('navAvatar');
  if (avatarEl) avatarEl.textContent = state.user ? state.user.name.slice(0,1).toUpperCase() : '?';
}

function viewHome() {
  if (state.loading.home && !state.data.homeProducts) return heroShell() + spinnerBlock('Loading catalog from the backend...');
  const cats = state.data.categories || [];
  const trending = state.data.trending || [];
  const products = state.data.homeProducts || [];
  const coupons = state.data.coupons || [];

  return heroShell(trending) + `
  <section>
    <div class="section-head"><h2>Shop by category</h2></div>
    <div class="cat-grid">
      ${cats.length ? cats.map(c=>`<div class="cat-card glass" data-action="quick-search" data-q="${c.name}"><div class="ic">${ic(c.icon||'tag')}</div><p>${c.name}</p></div>`).join('') : '<p class="muted">No categories yet — seed the backend database.</p>'}
    </div>
  </section>

  <section>
    <div class="section-head"><h2>From the catalog</h2></div>
    ${products.length ? `<div class="scroll-row">${products.map(productCard).join('')}</div>` : '<p class="muted">No products yet — run the backend seed script.</p>'}
  </section>

  ${coupons.length ? `<section>
    <div class="section-head"><h2>Active coupons</h2></div>
    <div class="pgrid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">
      ${coupons.map(c=>`<div class="coupon"><span>${c.description}</span><span class="code">${c.code}</span></div>`).join('')}
    </div>
  </section>` : ''}

  <footer>ShopVerse AI — connected to a live backend at <span class="mono">${API_BASE}</span></footer>
  `;
}

function heroShell(trending) {
  trending = trending || [];
  return `
  <section class="hero">
    <div class="section-label" style="justify-content:center;display:flex">AI-powered · live multi-store search</div>
    <h1>Every store. One search.<br><span class="grad">Zero regret.</span></h1>
    <p>Search any product — ShopVerse AI fetches real listings from every connected store, live, and shows you the comparison.</p>
    <div class="search-wrap">
      <div class="orb"><span class="o1"></span><span class="o2"></span><span class="o3"></span></div>
      <div class="search-box ${state.searchFocused?'focused':''}">
        ${ic('search')}
        <input id="searchInput" placeholder="Search any product..." value="${state.query}"
          oninput="onSearchInput(this.value)" onfocus="setSearchFocus(true)" onblur="setTimeout(()=>setSearchFocus(false),150)"
          onkeydown="if(event.key==='Enter')doSearch(this.value)">
        <div class="search-actions">
          <button title="Voice search (not wired in this demo)">${ic('mic')}</button>
          <button title="Image search (not wired in this demo)">${ic('cam2')}</button>
          <button title="Scan barcode (not wired in this demo)">${ic('qr')}</button>
          <button class="go" data-action="submit-search" title="Search">${ic('search')}</button>
        </div>
      </div>
    </div>
    <div class="chips-row">
      ${trending.length ? trending.map(t=>`<button class="chip" data-action="quick-search" data-q="${t.query}">${t.query}</button>`).join('')
        : ['iPhone 15','wireless earbuds','running shoes','4K TV'].map(s=>`<button class="chip" data-action="quick-search" data-q="${s}">${s}</button>`).join('')}
    </div>
  </section>`;
}

async function loadLiveSearch(q) {
  state.loading.results = true; state.error = null; render();
  try {
    const [liveRes, catalogRes] = await Promise.allSettled([
      get('/search/live?q=' + encodeURIComponent(q)),
      get('/search?q=' + encodeURIComponent(q)),
    ]);
    state.data.liveSearch = liveRes.status === 'fulfilled' ? liveRes.value : { error: liveRes.reason.message };
    state.data.catalogSearch = catalogRes.status === 'fulfilled' ? catalogRes.value : { error: catalogRes.reason.message };
  } catch (e) {
    state.error = e.message;
  }
  state.loading.results = false; render();
}

function viewResults() {
  if (state.loading.results) return spinnerBlock('Searching every connected store for "' + state.query + '"...');
  const live = state.data.liveSearch;
  const catalog = state.data.catalogSearch;

  let html = `<div style="padding-top:26px">
    <div class="section-label">Live search</div>
    <h2 style="font-size:26px">"${state.query}"</h2>
  </div>`;

  if (live && !live.error) {
    html += `<div class="section-head"><h2>Live comparison across stores</h2></div>`;
    if (live.listings && live.listings.length) {
      html += `<div class="glass" style="padding:20px;border-radius:18px;margin-bottom:24px">
        <div class="brand">${live.product.title}</div>
        <div class="store-list" style="margin-top:12px">
          ${live.listings.map((l,i)=>`
          <div class="store-row ${i===0?'best':''}">
            <div class="store-logo">${l.sellerName.slice(0,2).toUpperCase()}</div>
            <div class="store-info">
              <div class="nm">${l.sellerName} ${i===0?'<span class="badge lowest">Lowest</span>':''} <span class="badge trending" style="margin-left:4px">${l.fetchMode}</span></div>
              <div class="meta">${ic('truck')} ${l.deliveryEta}${l.url?` · <a href="${l.url}" target="_blank" style="color:var(--cyan)">visit store</a>`:''}</div>
            </div>
            <div class="store-price"><div class="p">${fmt(l.price)}</div></div>
          </div>`).join('')}
        </div>
        <button class="pill-btn primary sm" style="margin-top:14px" data-action="view-product" data-id="${live.product.id}">View full details</button>
      </div>`;
    } else {
      html += `<div class="empty-state" style="padding:40px 20px">${ic('search')}<h3>No live listings found</h3><p class="muted">Every connected store returned nothing for this exact query.</p></div>`;
    }
    if (live.sources && live.sources.length) {
      html += `<div class="glass" style="padding:16px;border-radius:14px;margin-bottom:36px">
        <h5 style="font-size:11.5px;text-transform:uppercase;color:var(--text-faint);margin-bottom:10px">Source status for this search</h5>
        ${live.sources.map(s=>`<div class="alert-row"><div class="ic">${ic(s.status==='ok'?'check':s.status==='error'?'x':'bolt')}</div><div><b>${s.name}</b> — ${s.status}${s.reason?` (${s.reason})`:''}</div></div>`).join('')}
      </div>`;
    }
  } else if (live && live.error) {
    html += errorBlock(live.error);
  }

  html += `<div class="section-head"><h2>From the catalog</h2></div>`;
  if (catalog && !catalog.error && catalog.results && catalog.results.length) {
    html += `<div class="pgrid grid-view">${catalog.results.map(r => productCard({ id: r.id, title: r.title, ratingAvg: 0, reviewCount: 0, minPrice: null })).join('')}</div>`;
  } else {
    html += `<p class="muted">No catalog matches for this query.</p>`;
  }

  return html;
}

async function loadProduct(id) {
  state.loading.product = true; render();
  const results = await Promise.allSettled([
    get('/products/' + id),
    get('/products/' + id + '/price-history?days=' + state.priceRangeDays),
    get('/reviews/product/' + id),
    get('/reviews/product/' + id + '/summary'),
    get('/recommendations/similar/' + id),
  ]);
  state.data['product:' + id] = results[0].status === 'fulfilled' ? results[0].value : null;
  state.data['priceHistory:' + id] = results[1].status === 'fulfilled' ? results[1].value : null;
  state.data['reviews:' + id] = results[2].status === 'fulfilled' ? results[2].value : [];
  state.data['reviewSummary:' + id] = results[3].status === 'fulfilled' ? results[3].value : null;
  state.data['similar:' + id] = results[4].status === 'fulfilled' ? results[4].value : null;
  state.loading.product = false; render();
}

function buildLineChart(points) {
  if (!points || points.length < 2) return null;
  const data = points.map(p => p.price);
  const w = 640, h = 180, pad = 10;
  const min = Math.min(...data), max = Math.max(...data);
  const range = (max - min) || 1;
  const stepX = (w - pad*2) / (data.length - 1);
  const pts = data.map((v,i) => [pad + i*stepX, pad + (1 - (v-min)/range)*(h-pad*2)]);
  const linePath = pts.map((pt,i) => (i===0?'M':'L') + pt[0].toFixed(1) + ',' + pt[1].toFixed(1)).join(' ');
  const areaPath = linePath + ` L${pts[pts.length-1][0].toFixed(1)},${h-pad} L${pts[0][0].toFixed(1)},${h-pad} Z`;
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:180px;overflow:visible">
    <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#42e8d4" stop-opacity="0.35"/><stop offset="100%" stop-color="#42e8d4" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="${areaPath}" fill="url(#chartGrad)"/>
    <path d="${linePath}" fill="none" stroke="#42e8d4" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${pts[pts.length-1][0]}" cy="${pts[pts.length-1][1]}" r="4.5" fill="#42e8d4"/>
  </svg>`;
}

function viewProduct() {
  const id = state.activeProductId;
  if (state.loading.product) return spinnerBlock('Loading product...');
  const p = state.data['product:' + id];
  if (!p) return errorBlock('Could not load this product from the backend.');
  const listings = p.listings || [];
  const low = listings[0];
  const discount = low && low.originalPrice ? Math.round((1 - low.price/low.originalPrice)*100) : 0;
  const wished = state.wishlistIds.has(p.id);
  const history = state.data['priceHistory:' + id];
  const chart = history ? buildLineChart(history.points) : null;
  const reviews = state.data['reviews:' + id] || [];
  const reviewSummary = state.data['reviewSummary:' + id];
  const similar = state.data['similar:' + id];

  return `
  <div style="padding-top:22px">
    <div class="crumb"><button data-action="goto" data-view="home">Home</button> / <span>${p.title}</span></div>
    <div class="detail-top">
      <div><div class="gallery-main">${ic(iconForProduct(p))}</div></div>
      <div>
        <h1 class="d-title">${p.title}</h1>
        <div class="d-rate"><span class="stars">${starRow(p.ratingAvg)}</span> ${(p.ratingAvg||0).toFixed(1)} · ${(p.reviewCount||0).toLocaleString('en-IN')} reviews <span class="trust-badge">${ic('shield')} AI Trust ${Math.round(p.aiTrustScore||0)}</span></div>
        ${low ? `<div class="price-hero"><span class="now">${fmt(low.price)}</span>${low.originalPrice?`<span class="was">${fmt(low.originalPrice)}</span><span class="off">${discount}% off</span>`:''}</div>
        <div class="emi-line">lowest at <b>${low.sellerName}</b>, delivery ${low.deliveryEta}</div>` : `<p class="muted">No store listings for this product yet.</p>`}

        ${listings.length ? `<div class="store-list">
          ${listings.map((l,i)=>`
          <div class="store-row ${i===0?'best':''}">
            <div class="store-logo">${l.sellerName.slice(0,2).toUpperCase()}</div>
            <div class="store-info">
              <div class="nm">${l.sellerName} ${i===0?'<span class="badge lowest">Lowest</span>':''}</div>
              <div class="meta">${ic('truck')} ${l.deliveryEta} delivery · ★ ${l.sellerRating||'—'} seller rating</div>
            </div>
            <div class="store-price"><div class="p">${fmt(l.price)}</div>${l.url?`<a href="${l.url}" target="_blank" class="pill-btn ghost sm" style="margin-top:6px;display:inline-block">Visit store</a>`:''}</div>
          </div>`).join('')}
        </div>` : ''}

        <div class="action-row">
          <button class="pill-btn ghost" data-action="toggle-wish" data-id="${p.id}">${ic('heart')} ${wished?'Wishlisted':'Wishlist'}</button>
          <button class="pill-btn ghost" data-action="add-compare" data-id="${p.id}">${ic('plus')} Compare</button>
          ${low ? `<button class="pill-btn ghost" data-action="create-alert" data-id="${p.id}" data-price="${Math.round(low.price*0.9)}">${ic('bell')} Alert me below ${fmt(Math.round(low.price*0.9))}</button>` : ''}
        </div>
      </div>
    </div>

    <div class="chart-wrap" style="margin-top:44px">
      <h3 style="font-size:16px;margin-bottom:14px">Price history</h3>
      ${chart ? chart : '<p class="muted">No price history recorded yet for this product.</p>'}
      ${history && history.points && history.points.length ? `<div class="chart-stats">
        <div><span>Lowest ever</span><b style="color:var(--green)">${fmt(history.lowestEver)}</b></div>
        <div><span>Highest ever</span><b style="color:var(--red)">${fmt(history.highestEver)}</b></div>
        <div><span>Average price</span><b>${fmt(history.average)}</b></div>
      </div>` : ''}
    </div>

    <div class="tabbar">
      ${['specs','reviews'].map(t=>`<button class="${state.activeTab===t?'active':''}" data-action="set-tab" data-tab="${t}">${t==='specs'?'Specifications':'Reviews'}</button>`).join('')}
    </div>
    ${state.activeTab==='specs' ? renderSpecs(p) : renderReviews(reviews, reviewSummary, p.id)}

    ${similar && similar.results && similar.results.length ? `<section style="margin-top:60px">
      <div class="section-head"><h2>Similar products</h2></div>
      <div class="scroll-row">${similar.results.map(r=>productCard({id:r.id,title:r.title,ratingAvg:r.ratingAvg,reviewCount:r.reviewCount,minPrice:null})).join('')}</div>
    </section>` : ''}
  </div>`;
}

function renderSpecs(p) {
  const specs = p.specs && typeof p.specs === 'object' ? p.specs : null;
  if (!specs || Object.keys(specs).length === 0) return `<p class="muted">No structured specifications recorded for this product.</p>`;
  return `<table class="spec-table">${Object.entries(specs).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>`;
}

function renderReviews(reviews, summary, productId) {
  let html = '';
  if (summary && summary.count) {
    html += `<div class="glass" style="padding:16px;border-radius:14px;margin-bottom:20px">
      <b>${summary.avgRating}★</b> average across ${summary.count} reviews —
      ${summary.bySentiment.positive} positive · ${summary.bySentiment.neutral} neutral · ${summary.bySentiment.negative} negative
      ${summary.flaggedCount ? ` · ${summary.flaggedCount} flagged as likely fake` : ''}
    </div>`;
  }
  html += reviews.length ? reviews.map(r => `
    <div style="border-bottom:1px solid var(--border-soft);padding:14px 0">
      <div class="stars">${starRow(r.rating)}</div>
      ${r.title ? `<b style="font-size:13.5px">${r.title}</b>` : ''}
      <p style="font-size:13.5px;color:var(--text-dim);margin-top:4px">${r.body}${r.isFlagged?' <span class="badge editor">possibly fake</span>':''}</p>
    </div>`).join('') : '<p class="muted">No reviews yet.</p>';

  html += `<div class="glass" style="padding:16px;border-radius:14px;margin-top:16px">
    <h5 style="font-size:13px;margin-bottom:10px">Write a review</h5>
    <textarea id="reviewBody" placeholder="Share your experience..." style="width:100%;background:var(--bg-elev);border:1px solid var(--border-soft);border-radius:10px;padding:10px;color:var(--text);font-family:inherit;min-height:70px"></textarea>
    <div style="display:flex;gap:10px;margin-top:10px;align-items:center">
      <select id="reviewRating" style="background:var(--glass);border:1px solid var(--border-soft);padding:8px;border-radius:8px">
        ${[5,4,3,2,1].map(n=>`<option value="${n}">${n} star</option>`).join('')}
      </select>
      <button class="pill-btn primary sm" data-action="submit-review" data-id="${productId}">Submit</button>
    </div>
  </div>`;
  return html;
}

function viewCompare() {
  const ids = Array.from(state.compareList);
  if (ids.length < 2) {
    return `<div class="empty-state">${ic('search')}<h3>Add at least 2 products to compare</h3><p class="muted">Tap "Compare" on any product to add it here.</p><button class="pill-btn primary" style="margin-top:18px" data-action="goto" data-view="home">Browse products</button></div>`;
  }
  const products = ids.map(id => state.data['product:' + id]).filter(Boolean);
  if (products.length < ids.length) return spinnerBlock('Loading products to compare...');

  const rows = [
    { label: 'Price', get: p => (p.listings[0] ? p.listings[0].price : null), fmt: v => fmt(v), best: 'min' },
    { label: 'Rating', get: p => p.ratingAvg, fmt: v => (v||0).toFixed(1) + ' ★', best: 'max' },
    { label: 'Reviews', get: p => p.reviewCount, fmt: v => (v||0).toLocaleString('en-IN'), best: 'max' },
    { label: 'Lowest at store', get: () => null, fmt: () => '', display: p => p.listings[0] ? p.listings[0].sellerName : '—' },
    { label: 'Delivery', get: () => null, fmt: () => '', display: p => p.listings[0] ? p.listings[0].deliveryEta : '—' },
  ];

  return `
  <div style="padding-top:26px">
    <div class="section-label">Comparison</div>
    <h2 style="font-size:26px">Comparing ${products.length} products</h2>
  </div>
  <div class="compare-table-wrap">
    <table class="compare">
      <thead><tr><th></th>${products.map(p=>`<th style="min-width:180px">${p.title}<br><button class="pill-btn ghost sm" style="margin-top:8px" data-action="remove-compare" data-id="${p.id}">Remove</button></th>`).join('')}</tr></thead>
      <tbody>
        ${rows.map(r => {
          const vals = products.map(r.get);
          let bestVal = null;
          if (r.best === 'min') bestVal = Math.min(...vals.filter(v=>v!=null));
          if (r.best === 'max') bestVal = Math.max(...vals.filter(v=>v!=null));
          return `<tr><td class="rowlabel">${r.label}</td>${products.map((p,i)=>{
            const v = vals[i];
            const isBest = r.best && v != null && v === bestVal;
            const disp = r.display ? r.display(p) : r.fmt(v);
            return `<td class="${isBest?'best':''}">${disp}</td>`;
          }).join('')}</tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

function viewAssistant() {
  return `
  <div style="padding-top:26px">
    <div class="section-label">AI Shopping Assistant</div>
    <h2 style="font-size:26px">Ask me anything about your purchase</h2>
  </div>
  <div class="assist-wrap">
    <div class="chat-panel">
      <div class="chat-scroll" id="chatScroll">
        ${state.chat.map(m => `<div class="msg ${m.role}">${m.text}${m.candidates ? m.candidates.map(c=>`<div class="rec-card" data-action="view-product" data-id="${c.id}" style="cursor:pointer"><div class="ic">${ic('tag')}</div><div><b>${c.title}</b><span>${c.price?fmt(c.price):''} ${c.ratingAvg?'· ★ '+c.ratingAvg.toFixed(1):''}</span></div></div>`).join('') : ''}</div>`).join('')}
        ${state.loading.chat ? `<div class="msg bot"><span class="typing"><span></span><span></span><span></span></span></div>` : ''}
      </div>
      <div class="chat-input-row">
        <input id="chatInput" placeholder="e.g. best camera phone under 25000" onkeydown="if(event.key==='Enter')sendChat(this.value)">
        <button data-action="send-chat">${ic('send')}</button>
      </div>
    </div>
    <div class="prompt-side">
      <h5>Try asking</h5>
      ${['Best phone under 30000','Best value laptop','Should I wait for a sale?'].map(p=>`<button class="prompt-chip" data-action="quick-chat" data-q="${p}">${p}</button>`).join('')}
    </div>
  </div>`;
}

function viewDashboard() {
  if (!state.user) {
    return `<div class="empty-state">${ic('user')}<h3>Log in to see your dashboard</h3><p class="muted">Wishlist, price alerts, and notifications are tied to your account.</p>
      <button class="pill-btn primary" style="margin-top:18px" data-action="open-auth" data-mode="login">Log in / Register</button></div>`;
  }
  if (state.loading.dashboard) return spinnerBlock('Loading your dashboard...');
  const wishlist = state.data.wishlist || [];
  const alerts = state.data.priceAlerts || [];
  const notifications = state.data.notifications || [];

  return `
  <div style="padding-top:26px">
    <div class="section-label">Your dashboard</div>
    <h2 style="font-size:26px">Welcome back, ${state.user.name}</h2>
  </div>
  <div class="dash-grid">
    <div>
      <div class="dash-card">
        <h3>Wishlist (${wishlist.length})</h3>
        ${wishlist.length ? wishlist.map(w=>`<div class="alert-row" style="cursor:pointer" data-action="view-product" data-id="${w.productId}"><div class="ic">${ic('heart')}</div>${w.title}</div>`).join('') : '<p class="muted" style="font-size:13.5px">Nothing saved yet.</p>'}
      </div>
    </div>
    <div>
      <div class="dash-card">
        <h3>Price alerts</h3>
        ${alerts.length ? alerts.map(a=>`<div class="alert-row"><div class="ic">${ic('bolt')}</div>Alert set below ${fmt(a.targetPrice)}${a.isActive?'':' (triggered)'}</div>`).join('') : '<p class="muted" style="font-size:13.5px">No active alerts.</p>'}
      </div>
      <div class="dash-card">
        <h3>Notifications</h3>
        ${notifications.length ? notifications.map(n=>`<div class="alert-row" style="cursor:pointer" data-action="mark-read" data-id="${n.id}"><div class="ic">${ic('bell')}</div>${n.message}${n.isRead?'':' <b style="color:var(--cyan)">·</b>'}</div>`).join('') : '<p class="muted" style="font-size:13.5px">No notifications yet.</p>'}
      </div>
      <div class="dash-card">
        <h3>Account</h3>
        <p class="muted" style="font-size:13.5px">${state.user.email}</p>
        <button class="pill-btn ghost sm" style="margin-top:10px" data-action="logout">Log out</button>
      </div>
    </div>
  </div>`;
}

async function loadDashboard() {
  state.loading.dashboard = true; render();
  const results = await Promise.allSettled([get('/wishlist'), get('/price-alerts'), get('/notifications')]);
  if (results[0].status === 'fulfilled') { state.data.wishlist = results[0].value; state.wishlistIds = new Set(results[0].value.map(w=>w.productId)); }
  if (results[1].status === 'fulfilled') state.data.priceAlerts = results[1].value;
  if (results[2].status === 'fulfilled') state.data.notifications = results[2].value;
  state.loading.dashboard = false; render();
}

/* ================= AUTH MODAL ================= */
function authModal() {
  if (!state.authModalOpen) return '';
  const isLogin = state.authMode === 'login';
  return `
  <div id="authOverlay" style="position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center" data-action="close-auth">
    <div class="glass" style="width:340px;padding:28px;border-radius:20px" onclick="event.stopPropagation()">
      <h3 style="margin-bottom:16px">${isLogin ? 'Log in' : 'Create account'}</h3>
      ${state.authError ? `<p style="color:var(--red);font-size:13px;margin-bottom:12px">${state.authError}</p>` : ''}
      <form id="authForm" data-action="submit-auth">
        ${!isLogin ? `<input name="name" placeholder="Full name" required style="width:100%;margin-bottom:10px;padding:10px;border-radius:10px;background:var(--bg-elev);border:1px solid var(--border-soft);color:var(--text)">` : ''}
        <input name="email" type="email" placeholder="Email" required style="width:100%;margin-bottom:10px;padding:10px;border-radius:10px;background:var(--bg-elev);border:1px solid var(--border-soft);color:var(--text)">
        <input name="password" type="password" placeholder="Password" required minlength="8" style="width:100%;margin-bottom:14px;padding:10px;border-radius:10px;background:var(--bg-elev);border:1px solid var(--border-soft);color:var(--text)">
        <button class="pill-btn primary" type="submit" style="width:100%;justify-content:center">${isLogin ? 'Log in' : 'Register'}</button>
      </form>
      <p class="muted" style="font-size:12.5px;margin-top:14px;text-align:center">
        ${isLogin ? "No account?" : "Already have one?"}
        <a href="#" data-action="switch-auth" style="color:var(--cyan)">${isLogin ? 'Register' : 'Log in'}</a>
      </p>
    </div>
  </div>`;
}

/* ================= RENDER ROOT ================= */
function render() {
  renderNav();
  const app = document.getElementById('app');
  let html = '';
  if (state.view === 'home') html = viewHome();
  else if (state.view === 'results') html = viewResults();
  else if (state.view === 'product') html = viewProduct();
  else if (state.view === 'compare') html = viewCompare();
  else if (state.view === 'assistant') html = viewAssistant();
  else if (state.view === 'dashboard') html = viewDashboard();
  app.innerHTML = html + authModal();
  const cs = document.getElementById('chatScroll'); if (cs) cs.scrollTop = cs.scrollHeight;
  const si = document.getElementById('searchInput'); if (si && document.activeElement !== si && state.searchFocused) si.focus();
}

/* ================= ACTIONS ================= */
function goto(view) {
  state.view = view; state.searchFocused = false;
  if (view === 'dashboard' && state.user) loadDashboard(); else render();
}
function onSearchInput(v) { state.query = v; render(); const si=document.getElementById('searchInput'); if(si){si.focus();si.setSelectionRange(v.length,v.length);} }
function setSearchFocus(v) { state.searchFocused = v; render(); }
function doSearch(v) { state.query = v; state.view = 'results'; state.searchFocused = false; loadLiveSearch(v); }
function quickSearch(q) { doSearch(q); }

async function toggleWish(id) {
  if (!state.user) { openAuth('login'); return; }
  try {
    if (state.wishlistIds.has(id)) { await del('/wishlist/' + id); state.wishlistIds.delete(id); }
    else { await post('/wishlist', { productId: id }); state.wishlistIds.add(id); }
    await refreshWishlist();
  } catch (e) { state.error = e.message; }
  render();
}

async function addCompare(id) {
  state.compareList.add(id);
  if (!state.data['product:' + id]) {
    try { state.data['product:' + id] = await get('/products/' + id); } catch (e) {}
  }
  render();
}
function removeCompare(id) { state.compareList.delete(id); render(); }

async function viewProductAction(id) {
  state.activeProductId = id; state.view = 'product'; state.activeTab = 'specs'; state.priceRangeDays = '90';
  await loadProduct(id);
}

async function createAlert(id, targetPrice) {
  if (!state.user) { openAuth('login'); return; }
  try { await post('/price-alerts', { productId: id, targetPrice: parseInt(targetPrice,10) }); alert('Alert set — you will be notified if the price drops below ' + fmt(targetPrice)); }
  catch (e) { alert('Could not set alert: ' + e.message); }
}

async function submitReview(productId) {
  if (!state.user) { openAuth('login'); return; }
  const body = document.getElementById('reviewBody').value.trim();
  const rating = parseInt(document.getElementById('reviewRating').value, 10);
  if (!body) return;
  try {
    await post('/reviews', { productId, rating, body });
    await loadProduct(productId);
  } catch (e) { state.error = e.message; render(); }
}

function setTab(t) { state.activeTab = t; render(); }

async function sendChat(text) {
  text = (text || '').trim(); if (!text) return;
  state.chat.push({ role: 'user', text });
  state.loading.chat = true; render();
  try {
    const res = await post('/ai/chat', { message: text });
    state.chat.push({ role: 'bot', text: res.reply, candidates: (res.candidates||[]).slice(0,3) });
  } catch (e) {
    state.chat.push({ role: 'bot', text: 'Sorry, I could not reach the AI assistant service: ' + e.message });
  }
  state.loading.chat = false;
  const ci = document.getElementById('chatInput'); if (ci) ci.value = '';
  render();
}
function quickChat(q) { sendChat(q); }

function openAuth(mode) { state.authModalOpen = true; state.authMode = mode; state.authError = null; render(); }
function closeAuth() { state.authModalOpen = false; render(); }
function switchAuth() { state.authMode = state.authMode === 'login' ? 'register' : 'login'; state.authError = null; render(); }

async function submitAuth(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  state.authError = null;
  try {
    const res = state.authMode === 'login' ? await post('/auth/login', data) : await post('/auth/register', data);
    setToken(res.accessToken);
    state.user = res.user;
    state.authModalOpen = false;
    await refreshWishlist();
    render();
  } catch (e) { state.authError = e.message; render(); }
}

function logout() { clearToken(); state.user = null; state.wishlistIds = new Set(); state.data.wishlist = null; goto('home'); }

async function markRead(id) {
  try { await patchReq('/notifications/' + id + '/read'); await loadDashboard(); } catch (e) {}
}

/* ================= EVENT DELEGATION ================= */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;
  if (a === 'goto') goto(el.dataset.view);
  else if (a === 'view-product') viewProductAction(el.dataset.id);
  else if (a === 'toggle-wish') toggleWish(el.dataset.id);
  else if (a === 'add-compare') addCompare(el.dataset.id);
  else if (a === 'remove-compare') removeCompare(el.dataset.id);
  else if (a === 'quick-search') quickSearch(el.dataset.q);
  else if (a === 'submit-search') doSearch(state.query);
  else if (a === 'set-tab') setTab(el.dataset.tab);
  else if (a === 'send-chat') { const ci = document.getElementById('chatInput'); sendChat(ci?ci.value:''); }
  else if (a === 'quick-chat') quickChat(el.dataset.q);
  else if (a === 'create-alert') createAlert(el.dataset.id, el.dataset.price);
  else if (a === 'submit-review') submitReview(el.dataset.id);
  else if (a === 'open-auth') openAuth(el.dataset.mode || 'login');
  else if (a === 'close-auth') closeAuth();
  else if (a === 'switch-auth') { e.preventDefault(); switchAuth(); }
  else if (a === 'logout') logout();
  else if (a === 'mark-read') markRead(el.dataset.id);
});
document.addEventListener('submit', (e) => {
  const el = e.target.closest('[data-action="submit-auth"]');
  if (!el) return;
  e.preventDefault();
  submitAuth(el);
});

boot();
