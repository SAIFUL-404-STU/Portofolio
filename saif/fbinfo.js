// ============================================================
// SAIF PLUGIN: fbinfo.js v3.0
// Now fetches full user info from bot backend (like spy command)
// Author: Saif Elite
// ============================================================

(function () {

  const API_BASE = window.location.origin + '/api/fbinfo';  // ← Change if your bot API is elsewhere

  // ── INJECT UI ──────────────────────────────────────────────
  function injectUI() {
    if (document.getElementById('saif-fbinfo-box')) return;

    const box = document.createElement('div');
    box.id = 'saif-fbinfo-box';
    box.innerHTML = `
      <div style="
        padding:22px;
        background:rgba(10,10,10,0.95);
        border-radius:22px;
        border:1.5px solid rgba(24,119,242,0.25);
        backdrop-filter:blur(12px);
      ">
        <!-- Header -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:5px;">
          <div style="
            width:38px;height:38px;border-radius:11px;
            background:linear-gradient(135deg,#1877f2,#0d5fcc);
            display:flex;align-items:center;justify-content:center;
            font-size:1.1rem;flex-shrink:0;
          "><i class="fab fa-facebook-f" style="color:#fff;"></i></div>
          <div>
            <h3 style="font-size:.95rem;color:var(--gold,#ffd700);margin:0;font-weight:900;">FB User Info</h3>
            <p style="font-size:.65rem;opacity:.45;color:var(--text,#fff);margin:0;">UID or Facebook profile URL</p>
          </div>
        </div>

        <!-- Tabs -->
        <div style="display:flex;gap:6px;margin:14px 0 12px;">
          <button id="fbTab1" onclick="fbSwitchTab(1)"
            style="flex:1;padding:8px;border-radius:10px;border:1px solid rgba(24,119,242,0.45);
                   background:rgba(24,119,242,0.15);color:#4f9dff;font-weight:700;
                   font-size:.75rem;cursor:pointer;font-family:'Outfit',sans-serif;">
            👤 User Info
          </button>
          <button id="fbTab2" onclick="fbSwitchTab(2)"
            style="flex:1;padding:8px;border-radius:10px;border:1px solid rgba(255,215,0,0.12);
                   background:transparent;color:rgba(255,255,255,0.45);font-weight:700;
                   font-size:.75rem;cursor:pointer;font-family:'Outfit',sans-serif;">
            🖼️ DP Download
          </button>
        </div>

        <!-- Tab 1: User Info -->
        <div id="fbPanel1">
          <input type="text" id="fbUIDInput"
            placeholder="UID (e.g. 100090123456789) or profile URL..."
            style="margin:0 0 10px 0;">
          <button onclick="handleFbInfoV3()"
            style="width:100%;padding:13px;border-radius:13px;border:none;
                   background:linear-gradient(135deg,#1877f2,#0d5fcc);
                   color:#fff;font-weight:900;font-size:.88rem;cursor:pointer;
                   font-family:'Outfit',sans-serif;transition:all .25s;"
            onmouseover="this.style.opacity='.85'"
            onmouseout="this.style.opacity='1'">
            <i class="fas fa-search"></i> SEARCH
          </button>
          <div id="fbInfoResult"></div>
        </div>

        <!-- Tab 2: DP Download (unchanged) -->
        <div id="fbPanel2" style="display:none;">
          <input type="text" id="fbDPInput"
            placeholder="Facebook UID or profile URL..."
            style="margin:0 0 10px 0;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
            <button onclick="fbDownloadDP('small')"
              style="padding:10px;border-radius:11px;border:1px solid rgba(255,215,0,0.2);
                     background:rgba(255,215,0,0.07);color:var(--gold,#ffd700);font-weight:700;
                     font-size:.78rem;cursor:pointer;font-family:'Outfit',sans-serif;">
              📱 Small
            </button>
            <button onclick="fbDownloadDP('normal')"
              style="padding:10px;border-radius:11px;border:1px solid rgba(255,215,0,0.2);
                     background:rgba(255,215,0,0.07);color:var(--gold,#ffd700);font-weight:700;
                     font-size:.78rem;cursor:pointer;font-family:'Outfit',sans-serif;">
              🖼️ Normal
            </button>
            <button onclick="fbDownloadDP('large')"
              style="padding:10px;border-radius:11px;border:1px solid rgba(255,215,0,0.2);
                     background:rgba(255,215,0,0.07);color:var(--gold,#ffd700);font-weight:700;
                     font-size:.78rem;cursor:pointer;font-family:'Outfit',sans-serif;">
              🔳 Large
            </button>
            <button onclick="fbDownloadDP('square')"
              style="padding:10px;border-radius:11px;border:none;
                     background:linear-gradient(135deg,#1877f2,#0d5fcc);
                     color:#fff;font-weight:700;font-size:.78rem;cursor:pointer;
                     font-family:'Outfit',sans-serif;">
              ⬛ Square
            </button>
          </div>
          <div id="fbDPResult"></div>
        </div>
      </div>
    `;

    const zone = document.getElementById('toolsPluginZone');
    if (zone) zone.appendChild(box);
    else {
      const anchor = document.querySelector('.section-title');
      if (anchor) anchor.parentNode.insertBefore(box, anchor);
      else document.body.appendChild(box);
    }

    // Enter key triggers search
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' && document.activeElement.id === 'fbUIDInput') handleFbInfoV3();
    });

    console.log('[Saif Plugin: fbinfo v3] UI injected ✅');
  }

  // ── TAB SWITCH (unchanged) ─────────────────────────────────
  window.fbSwitchTab = function(n) {
    document.getElementById('fbPanel1').style.display = n===1?'block':'none';
    document.getElementById('fbPanel2').style.display = n===2?'block':'none';
    document.getElementById('fbTab1').style.background = n===1?'rgba(24,119,242,0.15)':'transparent';
    document.getElementById('fbTab1').style.color      = n===1?'#4f9dff':'rgba(255,255,255,0.45)';
    document.getElementById('fbTab1').style.borderColor= n===1?'rgba(24,119,242,0.45)':'rgba(255,215,0,0.12)';
    document.getElementById('fbTab2').style.background = n===2?'rgba(24,119,242,0.15)':'transparent';
    document.getElementById('fbTab2').style.color      = n===2?'#4f9dff':'rgba(255,255,255,0.45)';
    document.getElementById('fbTab2').style.borderColor= n===2?'rgba(24,119,242,0.45)':'rgba(255,215,0,0.12)';
  };

  // ── EXTRACT UID / USERNAME ─────────────────────────────────
  function extractUID(raw) {
    raw = raw.trim();
    if (/^\d+$/.test(raw)) return { uid: raw, type: 'uid' };
    const php = raw.match(/profile\.php\?id=(\d+)/);
    if (php) return { uid: php[1], type: 'uid' };
    const url = raw.match(/facebook\.com\/([^/?&#]+)/);
    if (url && url[1] !== 'profile.php') return { uid: url[1], type: 'username' };
    return { uid: raw, type: /^\d+$/.test(raw) ? 'uid' : 'username' };
  }

  // ── FETCH FULL INFO FROM BOT BACKEND ───────────────────────
  async function fetchUserInfoFromBot(uid) {
    const res = await fetch(`${API_BASE}?uid=${encodeURIComponent(uid)}`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  }

  // ── MAIN: HANDLE FB INFO (V3) ─────────────────────────────
  window.handleFbInfoV3 = async function () {
    const raw   = (document.getElementById('fbUIDInput') || {}).value || '';
    const result = document.getElementById('fbInfoResult');
    if (!raw.trim()) {
      fbNotify('UID or profile URL required!', 'error');
      return;
    }

    const { uid, type } = extractUID(raw);
    const isUID = type === 'uid';

    result.innerHTML = `
      <div style="text-align:center;padding:22px;">
        <div style="width:36px;height:36px;border:3px solid #1877f2;border-top-color:transparent;
                    border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 12px;"></div>
        <p style="color:#4f9dff;font-weight:700;font-size:.85rem;">Fetching full info...</p>
      </div>
    `;

    try {
      const data = await fetchUserInfoFromBot(uid);
      // data contains: name, uid, gender, vanity, profileUrl, birthday, alternateName,
      // isFriend, money, rank, moneyRank, babyTeach, avatarUrl (already generated)
      const avatarUrl = data.avatarUrl || `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const genderMap = { 1: 'Girl 🙋‍♀️', 2: 'Boy 🙋', default: 'Gay 🤷' };
      const gender = genderMap[data.gender] || genderMap.default;

      const infoHTML = `
        <div style="
          background:linear-gradient(135deg,rgba(24,119,242,.1),rgba(13,95,204,.05));
          padding:18px;border-radius:18px;border:1.5px solid rgba(24,119,242,.28);
          margin-top:12px;
        ">
          <!-- Avatar + name -->
          <div style="display:flex;gap:14px;align-items:center;margin-bottom:16px;">
            <div style="position:relative;flex-shrink:0;">
              <img id="fbAvatar"
                src="${avatarUrl}"
                onerror="this.src='https://graph.facebook.com/${uid}/picture?type=large'"
                style="width:80px;height:80px;border-radius:50%;object-fit:cover;
                       border:3px solid #1877f2;box-shadow:0 0 20px rgba(24,119,242,.4);
                       background:#111;">
              <div style="
                position:absolute;bottom:2px;right:2px;
                width:18px;height:18px;border-radius:50%;
                background:#25D366;border:2px solid #0a0a0a;
              "></div>
            </div>
            <div style="text-align:left;">
              <p style="font-weight:900;font-size:1rem;color:#fff;margin:0 0 4px 0;">${data.name}</p>
              <span style="
                background:rgba(24,119,242,.2);color:#4f9dff;
                padding:3px 10px;border-radius:8px;font-size:.65rem;font-weight:700;
              "><i class="fab fa-facebook-f"></i> Facebook</span>
            </div>
          </div>

          <!-- Info grid -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
            <div style="background:rgba(0,0,0,.3);padding:11px;border-radius:11px;grid-column:1/-1;">
              <p style="font-size:.58rem;opacity:.5;color:#fff;margin:0 0 3px 0;font-weight:900;letter-spacing:1px;">FACEBOOK UID</p>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                <p style="font-size:.82rem;font-weight:700;color:#fff;margin:0;font-family:'JetBrains Mono',monospace;">${data.uid}</p>
                <button onclick="navigator.clipboard.writeText('${data.uid}').then(()=>fbNotify('✅ UID copied!'))"
                  style="background:rgba(255,215,0,.1);border:1px solid rgba(255,215,0,.25);
                         color:var(--gold,#ffd700);padding:5px 10px;border-radius:7px;cursor:pointer;
                         font-size:.65rem;font-weight:700;font-family:'Outfit',sans-serif;white-space:nowrap;">
                  <i class="fas fa-copy"></i> Copy
                </button>
              </div>
            </div>
            <div style="background:rgba(0,0,0,.3);padding:11px;border-radius:11px;">
              <p style="font-size:.58rem;opacity:.5;color:#fff;margin:0 0 3px 0;font-weight:900;letter-spacing:1px;">GENDER</p>
              <p style="font-size:.82rem;font-weight:700;color:#fff;margin:0;">${gender}</p>
            </div>
            <div style="background:rgba(0,0,0,.3);padding:11px;border-radius:11px;">
              <p style="font-size:.58rem;opacity:.5;color:#fff;margin:0 0 3px 0;font-weight:900;letter-spacing:1px;">USERNAME</p>
              <p style="font-size:.82rem;font-weight:700;color:#fff;margin:0;">${data.vanity || 'None'}</p>
            </div>
            <div style="background:rgba(0,0,0,.3);padding:11px;border-radius:11px;">
              <p style="font-size:.58rem;opacity:.5;color:#fff;margin:0 0 3px 0;font-weight:900;letter-spacing:1px;">BIRTHDAY</p>
              <p style="font-size:.82rem;font-weight:700;color:#fff;margin:0;">${data.birthday || 'Private'}</p>
            </div>
            <div style="background:rgba(0,0,0,.3);padding:11px;border-radius:11px;">
              <p style="font-size:.58rem;opacity:.5;color:#fff;margin:0 0 3px 0;font-weight:900;letter-spacing:1px;">NICKNAME</p>
              <p style="font-size:.82rem;font-weight:700;color:#fff;margin:0;">${data.alternateName || 'None'}</p>
            </div>
            <div style="background:rgba(0,0,0,.3);padding:11px;border-radius:11px;">
              <p style="font-size:.58rem;opacity:.5;color:#fff;margin:0 0 3px 0;font-weight:900;letter-spacing:1px;">FRIEND WITH BOT</p>
              <p style="font-size:.82rem;font-weight:700;color:${data.isFriend ? '#25D366' : '#ff416c'};margin:0;">${data.isFriend ? 'Yes ✅' : 'No ❎'}</p>
            </div>
            <div style="background:rgba(0,0,0,.3);padding:11px;border-radius:11px;">
              <p style="font-size:.58rem;opacity:.5;color:#fff;margin:0 0 3px 0;font-weight:900;letter-spacing:1px;">MONEY</p>
              <p style="font-size:.82rem;font-weight:700;color:#ffd700;margin:0;">$${data.moneyFormatted || data.money}</p>
            </div>
            <div style="background:rgba(0,0,0,.3);padding:11px;border-radius:11px;">
              <p style="font-size:.58rem;opacity:.5;color:#fff;margin:0 0 3px 0;font-weight:900;letter-spacing:1px;">RANK</p>
              <p style="font-size:.82rem;font-weight:700;color:#fff;margin:0;">#${data.rank}/${data.totalUsers}</p>
            </div>
          </div>

          <!-- Action buttons -->
          <div style="display:flex;flex-direction:column;gap:8px;">
            <a href="${data.profileUrl}" target="_blank"
              style="display:flex;align-items:center;justify-content:center;gap:8px;
                     background:linear-gradient(135deg,#1877f2,#0d5fcc);color:#fff;
                     padding:12px;border-radius:12px;text-decoration:none;
                     font-weight:900;font-size:.85rem;">
              <i class="fab fa-facebook-f"></i> OPEN PROFILE
            </a>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <a href="${avatarUrl}" target="_blank"
                style="display:flex;align-items:center;justify-content:center;gap:6px;
                       background:rgba(24,119,242,.12);border:1px solid rgba(24,119,242,.35);
                       color:#4f9dff;padding:10px;border-radius:11px;text-decoration:none;
                       font-weight:700;font-size:.75rem;">
                <i class="fas fa-download"></i> Save DP
              </a>
              <a href="https://m.me/${data.uid}" target="_blank"
                style="display:flex;align-items:center;justify-content:center;gap:6px;
                       background:rgba(0,132,255,.12);border:1px solid rgba(0,132,255,.35);
                       color:#0084ff;padding:10px;border-radius:11px;text-decoration:none;
                       font-weight:700;font-size:.75rem;">
                <i class="fab fa-facebook-messenger"></i> Message
              </a>
            </div>
          </div>
        </div>
      `;

      result.innerHTML = infoHTML;
      fbNotify('✅ Full info loaded!', 'success');

    } catch (err) {
      result.innerHTML = `
        <div style="padding:20px;border-radius:16px;border:1.5px solid rgba(255,65,108,.4);
                    background:rgba(255,65,108,.07);text-align:center;margin-top:12px;">
          <i class="fas fa-exclamation-circle" style="color:#ff416c;font-size:2rem;margin-bottom:10px;display:block;"></i>
          <p style="color:#ff416c;font-weight:700;margin:0 0 12px 0;font-size:.88rem;">
            ${err.message || 'Fetch failed!'}
          </p>
          <button onclick="handleFbInfoV3()"
            style="background:linear-gradient(135deg,#ff416c,#ff4b2b);border:none;
                   color:#fff;padding:10px 20px;border-radius:10px;font-weight:700;
                   cursor:pointer;font-family:'Outfit',sans-serif;font-size:.82rem;">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>
      `;
      fbNotify('❌ Fetch failed!', 'error');
    }
  };

  // ── DP DOWNLOAD TAB (unchanged) ────────────────────────────
  window.fbDownloadDP = function(size) {
    const raw = (document.getElementById('fbDPInput') || {}).value || '';
    if (!raw.trim()) { fbNotify('UID or URL required!', 'error'); return; }
    const { uid } = extractUID(raw);
    const dpResult = document.getElementById('fbDPResult');

    const sizeMap = {
      small:  { type:'small',  label:'Small (50×50)' },
      normal: { type:'normal', label:'Normal (100×100)' },
      large:  { type:'large',  label:'Large (200×200)' },
      square: { type:'square', label:'Square (max)' },
    };
    const { type, label } = sizeMap[size] || sizeMap.large;
    const url = `https://graph.facebook.com/${uid}/picture?type=${type}`;

    dpResult.innerHTML = `
      <div style="background:rgba(0,0,0,.3);border:1px solid rgba(24,119,242,.2);
                  border-radius:16px;padding:16px;margin-top:12px;text-align:center;">
        <img src="${url}" alt="DP"
          onerror="this.parentElement.innerHTML='<p style=color:#ff416c;font-weight:700;>Could not load DP</p>'"
          style="width:100px;height:100px;border-radius:50%;object-fit:cover;
                 border:3px solid #1877f2;box-shadow:0 0 20px rgba(24,119,242,.4);
                 margin-bottom:12px;">
        <p style="font-size:.75rem;opacity:.5;margin-bottom:12px;color:#fff;">${label}</p>
        <div style="display:flex;gap:8px;justify-content:center;">
          <a href="${url}" target="_blank"
            style="background:linear-gradient(135deg,#1877f2,#0d5fcc);color:#fff;
                   padding:10px 18px;border-radius:11px;text-decoration:none;
                   font-weight:700;font-size:.8rem;">
            <i class="fas fa-external-link-alt"></i> Open
          </a>
          <a href="${url}" download="fb_dp_${uid}.jpg" target="_blank"
            style="background:rgba(255,215,0,.1);border:1px solid rgba(255,215,0,.3);
                   color:var(--gold,#ffd700);padding:10px 18px;border-radius:11px;
                   text-decoration:none;font-weight:700;font-size:.8rem;">
            <i class="fas fa-download"></i> Save
          </a>
        </div>
      </div>
    `;
    fbNotify(`📸 DP loaded (${label})`, 'success');
  };

  // ── NOTIFY HELPER ──────────────────────────────────────────
  function fbNotify(msg, type) {
    if (typeof showNotification === 'function') showNotification(msg, type);
    else console.log(`[fbinfo] ${msg}`);
  }
  window.fbNotify = fbNotify;

  // ── INIT ───────────────────────────────────────────────────
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectUI);
  else injectUI();

  console.log('[Saif Plugin: fbinfo v3] Loaded ✅');
})();
