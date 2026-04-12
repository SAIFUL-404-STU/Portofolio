// ============================================================
// SAIF PLUGIN: downloader.js
// Feature: Video Downloader (YouTube / FB / Instagram / TikTok)
// Author: Saif Elite
// ============================================================
// This plugin injects the Video Downloader section into the
// main card, right before the "Connect With Me" section.
// It also registers the handleDownload() and related functions.
// ============================================================

(function () {

  // ===== INJECT DOWNLOADER UI =====
  function injectDownloaderUI() {
    // Find the "Connect With Me" section title as anchor
    const sectionTitles = document.querySelectorAll('.section-title');
    let connectSection = null;

    sectionTitles.forEach(el => {
      if (el.textContent.includes('Connect With Me')) {
        connectSection = el;
      }
    });

    if (!connectSection) {
      console.warn('[Saif Plugin: downloader] Could not find "Connect With Me" section to inject before.');
      return;
    }

    // Check if downloader already exists (injected by index.html)
    if (document.getElementById('saif-dl-box')) {
      console.log('[Saif Plugin: downloader] Downloader UI already present, skipping inject.');
      return;
    }

    const dlBox = document.createElement('div');
    dlBox.id = 'saif-dl-box';
    dlBox.className = 'dl-box';
    dlBox.innerHTML = `
      <h3 style="font-size:1rem;color:var(--primary);margin-bottom:15px;font-weight:900">
        <i class="fas fa-download"></i> Video Downloader
      </h3>
      <input type="text" id="urlInput" placeholder="Paste YouTube/FB/Insta/TikTok link baby..." style="margin:0 0 15px 0;">
      <button class="dl-btn" onclick="handleDownload()">
        <i class="fas fa-download"></i> GET VIDEO LINK
      </button>
      <div id="dlResult" style="margin-top:15px;"></div>
    `;

    connectSection.parentNode.insertBefore(dlBox, connectSection);
    console.log('[Saif Plugin: downloader] UI injected successfully.');
  }

  // ===== DOWNLOADER LOGIC =====
  window.handleDownload = async function () {
    const urlInput = document.getElementById('urlInput');
    const resultDiv = document.getElementById('dlResult');

    if (!urlInput || !resultDiv) return;

    const url = urlInput.value.trim();

    if (!url) {
      if (typeof showNotification === 'function') showNotification("Please enter a URL!", "error");
      return;
    }

    resultDiv.innerHTML = `
      <div style="text-align:center; padding:20px;">
        <div style="width:40px;height:40px;border:3px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 15px;"></div>
        <p style="color:var(--primary); font-weight:700;">Processing video baby...</p>
        <p style="font-size:0.8rem; opacity:0.7; color:var(--text);">Checking multiple sources</p>
      </div>
      <style>@keyframes spin{to{transform:rotate(360deg);}}</style>
    `;

    try {
      const baseResponse = await fetch("https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json");
      const baseData = await baseResponse.json();
      const apiUrl = baseData.api;

      const downloadResponse = await fetch(`${apiUrl}/alldl?url=${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      });

      if (!downloadResponse.ok) throw new Error('API response not OK');

      const data = await downloadResponse.json();

      if (data.result && data.result.includes('http')) {
        resultDiv.innerHTML = `
          <div style="background:linear-gradient(135deg,rgba(0,210,255,0.1),rgba(0,140,255,0.1));
                      padding:20px;border-radius:20px;border:2px solid var(--primary);
                      margin-top:15px;backdrop-filter:blur(10px);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;">
              <div>
                <p style="color:var(--primary);font-weight:900;font-size:1rem;margin:0;">
                  <i class="fas fa-check-circle"></i> DOWNLOAD READY BABY!
                </p>
                <p style="font-size:0.7rem;opacity:0.7;margin:5px 0 0 0;color:var(--text);">
                  ${new Date().toLocaleTimeString()}
                </p>
              </div>
              <span class="badge badge-success" style="font-size:0.6rem;padding:5px 10px;">HD Quality</span>
            </div>

            ${data.thumbnail ? `
            <div style="margin:15px 0;border-radius:15px;overflow:hidden;border:2px solid rgba(0,210,255,0.3);">
              <img src="${data.thumbnail}" alt="Thumbnail"
                   style="width:100%;height:180px;object-fit:cover;display:block;">
            </div>` : ''}

            ${data.title ? `
            <p style="font-weight:700;margin:15px 0;font-size:0.9rem;color:var(--value-color);
                      background:rgba(0,0,0,0.15);padding:10px;border-radius:10px;">
              🎬 ${data.title.substring(0, 80)}${data.title.length > 80 ? '...' : ''}
            </p>` : ''}

            <div style="background:rgba(0,0,0,0.2);padding:15px;border-radius:15px;margin:15px 0;">
              <p style="font-size:0.7rem;opacity:0.8;margin:0 0 10px 0;color:var(--text);">
                <i class="fas fa-link"></i> Download Link:
              </p>
              <input type="text" value="${data.result}"
                     style="width:100%;padding:10px;border-radius:10px;margin:0;
                            border:1px solid var(--primary);background:var(--input-bg);
                            color:var(--input-color);font-size:0.7rem;text-align:left;" readonly>
              <button onclick="saifCopyLink('${data.result}')"
                      style="margin-top:10px;background:rgba(0,210,255,0.2);
                             border:1px solid var(--primary);color:var(--primary);
                             padding:8px 15px;border-radius:10px;cursor:pointer;
                             font-size:0.7rem;font-weight:700;width:100%;">
                <i class="fas fa-copy"></i> COPY LINK
              </button>
            </div>

            <div style="display:flex;gap:10px;margin-top:20px;">
              <a href="${data.result}" target="_blank" download
                 style="flex:1;background:linear-gradient(135deg,var(--primary),#008cff);
                        color:#000;padding:12px;border-radius:12px;text-decoration:none;
                        font-weight:900;text-align:center;font-size:0.8rem;">
                <i class="fas fa-download"></i> DOWNLOAD NOW
              </a>
            </div>

            ${data.cp ? `
            <div style="margin-top:15px;padding:10px;background:rgba(0,0,0,0.2);border-radius:10px;">
              <p style="font-size:0.7rem;opacity:0.8;margin:0;color:var(--text);">${data.cp}</p>
            </div>` : ''}
          </div>
        `;

        // Firebase stats + activity log (uses globals from index.html)
        if (typeof db !== 'undefined') {
          db.ref('stats/downloads').transaction(count => (count || 0) + 1);
        }
        if (typeof currentUser !== 'undefined' && currentUser && typeof logUserActivity === 'function') {
          logUserActivity(currentUser, 'download_video', {
            url: url,
            title: data.title || 'Video',
            downloadUrl: data.result
          });
        }

        if (typeof showNotification === 'function') showNotification("✅ Video download link generated!", "success");

      } else {
        throw new Error('No download link found');
      }

    } catch (error) {
      console.error("[Saif Plugin: downloader] Error:", error);

      resultDiv.innerHTML = `
        <div style="background:linear-gradient(135deg,rgba(255,65,108,0.1),rgba(255,75,43,0.1));
                    padding:25px;border-radius:20px;border:2px solid var(--danger);
                    text-align:center;margin-top:15px;">
          <i class="fas fa-exclamation-triangle"
             style="font-size:3rem;color:var(--danger);margin-bottom:15px;"></i>
          <p style="color:var(--danger);font-weight:700;font-size:1rem;">Download Failed Baby!</p>
          <p style="font-size:0.8rem;opacity:0.8;margin:10px 0;color:var(--text);">
            ${error.message || "Unable to process this link"}
          </p>
          <div style="margin-top:20px;display:flex;gap:10px;">
            <button onclick="handleDownload()"
                    style="flex:1;background:var(--primary);color:#000;
                           border:none;padding:10px;border-radius:10px;
                           font-weight:900;cursor:pointer;font-size:0.8rem;">
              <i class="fas fa-redo"></i> Try Again
            </button>
            <button onclick="saifOpenManualDownload('${url}')"
                    style="flex:1;background:rgba(255,167,38,0.2);
                           border:1px solid #ffa726;color:#ffa726;
                           padding:10px;border-radius:10px;cursor:pointer;
                           font-weight:700;font-size:0.8rem;">
              <i class="fas fa-external-link-alt"></i> Alternative
            </button>
          </div>
          <p style="font-size:0.7rem;opacity:0.6;margin-top:15px;color:var(--text);">
            Try: YouTube, Facebook, Instagram, TikTok links
          </p>
        </div>
      `;

      if (typeof showNotification === 'function') showNotification("❌ Download failed. Try another link.", "error");
    }
  };

  window.saifCopyLink = function (text) {
    navigator.clipboard.writeText(text).then(() => {
      if (typeof showNotification === 'function') showNotification("✅ Link copied to clipboard!", "success");
    }).catch(() => {
      if (typeof showNotification === 'function') showNotification("❌ Copy failed", "error");
    });
  };

  window.saifOpenManualDownload = function (url) {
    const manualApis = [
      `https://yt5s.com/en32?q=${encodeURIComponent(url)}`,
      `https://en.y2mate.is/?url=${encodeURIComponent(url)}`,
      `https://snapinsta.app/${encodeURIComponent(url)}`
    ];
    const w = window.open('', '_blank');
    w.document.write(`
      <!DOCTYPE html><html>
      <head><title>Alternative Download Options</title>
      <style>
        body{margin:20px;padding:20px;background:#020b1a;color:white;font-family:Arial;}
        h2{color:#00d2ff;}
        .option{background:rgba(0,210,255,0.1);padding:15px;margin:10px 0;border-radius:10px;border:1px solid #00d2ff;}
        a{color:#00d2ff;text-decoration:none;font-weight:bold;}
        a:hover{text-decoration:underline;}
      </style></head>
      <body>
        <h2>🔧 Alternative Download Services</h2>
        <p>Try these if the main downloader fails:</p>
        <div class="option"><a href="${manualApis[0]}" target="_blank">✅ Option 1: yt5s.com</a></div>
        <div class="option"><a href="${manualApis[1]}" target="_blank">✅ Option 2: y2mate.is</a></div>
        <div class="option"><a href="${manualApis[2]}" target="_blank">✅ Option 3: snapinsta.app</a></div>
      </body></html>
    `);
  };

  // ===== RUN =====
  // Wait for DOM to be ready, then inject UI
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectDownloaderUI);
  } else {
    injectDownloaderUI();
  }

  console.log('[Saif Plugin: downloader] Loaded ✅');

})();
