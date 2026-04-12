// ============================================================
// SAIF PLUGIN: lyrics.js
// Feature: Song Lyrics Finder
// Author: Saif Elite
// ============================================================

(function () {

  function injectUI() {
    const sectionTitles = document.querySelectorAll('.section-title');
    let connectSection = null;
    sectionTitles.forEach(el => {
      if (el.textContent.includes('Connect With Me')) connectSection = el;
    });
    if (!connectSection || document.getElementById('saif-lyrics-box')) return;

    const box = document.createElement('div');
    box.id = 'saif-lyrics-box';
    box.style.cssText = `margin-top:30px;padding:25px;background:var(--dl-bg);border-radius:25px;border:2px solid var(--primary);backdrop-filter:blur(10px);`;
    box.innerHTML = `
      <h3 style="font-size:1rem;color:var(--primary);margin-bottom:15px;font-weight:900;">
        <i class="fas fa-music"></i> Lyrics Finder
      </h3>
      <input type="text" id="lyricsArtist" placeholder="Artist name... (e.g. Eminem)" style="margin:0 0 10px 0;">
      <input type="text" id="lyricsTitle" placeholder="Song title... (e.g. Lose Yourself)" style="margin:0 0 15px 0;">
      <button class="dl-btn" onclick="handleLyrics()">
        <i class="fas fa-search"></i> FIND LYRICS
      </button>
      <div id="lyricsResult" style="margin-top:15px;"></div>
    `;
    connectSection.parentNode.insertBefore(box, connectSection);
    console.log('[Saif Plugin: lyrics] UI injected ✅');
  }

  window.handleLyrics = async function () {
    const artist = document.getElementById('lyricsArtist').value.trim();
    const title = document.getElementById('lyricsTitle').value.trim();
    const resultDiv = document.getElementById('lyricsResult');

    if (!artist || !title) {
      if (typeof showNotification === 'function') showNotification("Artist ar song naam duita likhoo!", "error");
      return;
    }

    resultDiv.innerHTML = `<div style="text-align:center;padding:20px;"><div style="width:40px;height:40px;border:3px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 15px;"></div><p style="color:var(--primary);font-weight:700;">Lyrics khujchi baby...</p></div>`;

    try {
      const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
      const data = await res.json();
      if (!data.lyrics) throw new Error('Lyrics pawa jai ni!');

      const lines = data.lyrics.trim();
      resultDiv.innerHTML = `
        <div style="background:linear-gradient(135deg,rgba(0,210,255,0.1),rgba(0,140,255,0.1));padding:20px;border-radius:20px;border:2px solid var(--primary);margin-top:15px;">
          <p style="color:var(--primary);font-weight:900;font-size:1rem;margin-bottom:15px;">
            <i class="fas fa-music"></i> ${title} — ${artist}
          </p>
          <div style="background:rgba(0,0,0,0.2);padding:15px;border-radius:15px;max-height:300px;overflow-y:auto;">
            <pre style="font-family:'Outfit',sans-serif;font-size:0.8rem;line-height:1.8;white-space:pre-wrap;color:var(--text);margin:0;">${lines}</pre>
          </div>
          <button onclick="saifCopyLyrics(\`${lines.replace(/`/g,"'")}\`)" style="margin-top:15px;background:rgba(0,210,255,0.2);border:1px solid var(--primary);color:var(--primary);padding:10px;border-radius:10px;cursor:pointer;font-weight:700;font-size:0.8rem;width:100%;">
            <i class="fas fa-copy"></i> COPY LYRICS
          </button>
        </div>
      `;
      if (typeof showNotification === 'function') showNotification("✅ Lyrics found baby!", "success");
    } catch (e) {
      resultDiv.innerHTML = `<div style="background:linear-gradient(135deg,rgba(255,65,108,0.1),rgba(255,75,43,0.1));padding:25px;border-radius:20px;border:2px solid var(--danger);text-align:center;margin-top:15px;"><i class="fas fa-exclamation-triangle" style="font-size:3rem;color:var(--danger);margin-bottom:15px;"></i><p style="color:var(--danger);font-weight:700;">${e.message}</p></div>`;
      if (typeof showNotification === 'function') showNotification("❌ Lyrics pawa jai ni.", "error");
    }
  };

  window.saifCopyLyrics = function (text) {
    navigator.clipboard.writeText(text).then(() => {
      if (typeof showNotification === 'function') showNotification("✅ Lyrics copied!", "success");
    });
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.activeElement.id === 'lyricsTitle') handleLyrics();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectUI);
  else injectUI();

  console.log('[Saif Plugin: lyrics] Loaded ✅');
})();
