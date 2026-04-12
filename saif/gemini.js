// ============================================================
// SAIF GEMINI WEB PLUGIN
// Converted from GoatBot Command
// Author: Saif
// ============================================================

(function () {

  let API_BASE = "";

  // ===== GET BASE API =====
  async function getBaseApi() {
    try {
      const res = await fetch("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
      const data = await res.json();
      API_BASE = data.mahmud;
    } catch (e) {
      console.error("Base API load failed", e);
    }
  }

  // ===== INJECT UI =====
  function injectUI() {
    const section = document.querySelector('.section-title');
    if (!section) return;

    if (document.getElementById('saif-gemini-box')) return;

    const box = document.createElement('div');
    box.id = 'saif-gemini-box';
    box.className = 'dl-box';

    box.innerHTML = `
      <h3 style="color:var(--primary);font-weight:900;">🤖 GEMINI AI (PREMIUM)</h3>

      <textarea id="geminiInput" placeholder="Ask anything..." 
        style="width:100%;padding:10px;border-radius:10px;"></textarea>

      <input type="file" id="geminiImage" accept="image/*" style="margin-top:10px;" />

      <button onclick="saifGemini()" class="dl-btn" style="margin-top:10px;">
        ⚡ ASK AI
      </button>

      <div id="geminiResult" style="margin-top:15px;"></div>
    `;

    section.parentNode.insertBefore(box, section);
  }

  // ===== MAIN AI FUNCTION =====
  window.saifGemini = async function () {
    const input = document.getElementById('geminiInput');
    const fileInput = document.getElementById('geminiImage');
    const result = document.getElementById('geminiResult');

    const prompt = input.value.trim();
    if (!prompt) {
      result.innerHTML = "❌ Enter something...";
      return;
    }

    result.innerHTML = "⏳ Thinking like Gemini...";

    try {
      let body = { prompt };

      // 👉 Image support (convert to URL temporary using object URL)
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        body.imageUrl = URL.createObjectURL(file);
      }

      const res = await fetch(`${API_BASE}/api/gemini`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "author": "Saif"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (data.error) {
        result.innerHTML = `❌ ${data.error}`;
        return;
      }

      showResponse(data.response);

    } catch (err) {
      console.error(err);
      result.innerHTML = "❌ Error occurred...";
    }
  };

  // ===== RESPONSE UI =====
  function showResponse(text) {
    const result = document.getElementById('geminiResult');

    result.innerHTML = `
      <div style="background:rgba(0,210,255,0.1);padding:15px;border-radius:15px;">
        🤖 <b>Gemini:</b><br>
        ${text}
        <br><br>
        <button onclick="copyGemini(\`${text}\`)">📋 Copy</button>
      </div>
    `;
  }

  // ===== COPY =====
  window.copyGemini = function (text) {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  // ===== INIT =====
  async function init() {
    await getBaseApi();
    injectUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
