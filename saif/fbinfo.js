// ============================================================
// SAIF PLUGIN: fbinfo.js
// Feature: Website FB User Info Section (UID / Profile URL)
// Author: Saif
// ============================================================

(function () {

  function injectUI() {
    if (document.getElementById("saif-fbinfo-box")) return;

    const box = document.createElement("div");
    box.id = "saif-fbinfo-box";

    box.innerHTML = `
      <div style="
        padding:22px;
        background:var(--dl-bg);
        border-radius:22px;
        border:1.5px solid rgba(255,215,0,0.15);
        backdrop-filter:blur(10px);
        margin-top:0;
      ">
        <h3 style="
          font-size:1rem;
          color:var(--gold);
          margin-bottom:6px;
          font-weight:900;
        ">
          <i class="fab fa-facebook" style="color:#1877f2;"></i> FB USER INFO
        </h3>

        <p style="
          font-size:0.72rem;
          opacity:0.6;
          color:var(--text);
          margin-bottom:15px;
        ">
          UID or Facebook profile URL diye search koro
        </p>

        <input
          type="text"
          id="fbInfoInput"
          placeholder="UID or Facebook profile URL..."
          style="margin:0 0 12px 0;"
        >

        <button class="dl-btn" onclick="handleFbInfo()">
          <i class="fab fa-facebook"></i> GET FB INFO
        </button>

        <div id="fbInfoResult" style="margin-top:15px;"></div>
      </div>
    `;

    const toolsZone = document.getElementById("toolsPluginZone");
    if (toolsZone) {
      toolsZone.appendChild(box);
    } else {
      document.body.appendChild(box);
    }

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Enter" &&
        document.activeElement.id === "fbInfoInput"
      ) {
        handleFbInfo();
      }
    });

    console.log("[Saif Plugin] FB INFO UI Injected ✅");
  }

  function extractUID(input) {
    input = input.trim();

    if (/^\d+$/.test(input)) return input;

    const profileMatch = input.match(/profile\.php\?id=(\d+)/);
    if (profileMatch) return profileMatch[1];

    const usernameMatch = input.match(/facebook\.com\/([^/?]+)/);
    if (usernameMatch) return usernameMatch[1];

    return input;
  }

  window.handleFbInfo = async function () {
    const input = document.getElementById("fbInfoInput").value.trim();
    const resultDiv = document.getElementById("fbInfoResult");

    if (!input) {
      resultDiv.innerHTML = `
        <div style="
          padding:14px;
          border-radius:14px;
          background:rgba(255,0,0,0.08);
          color:#ff4d4d;
          text-align:center;
          font-weight:700;
        ">
          UID ba Facebook profile URL dao!
        </div>
      `;
      return;
    }

    const uid = extractUID(input);

    resultDiv.innerHTML = `
      <div style="text-align:center;padding:18px;">
        <div style="
          width:42px;
          height:42px;
          border:3px solid var(--gold);
          border-top-color:transparent;
          border-radius:50%;
          animation:spin 1s linear infinite;
          margin:0 auto 12px;
        "></div>
        <p style="color:var(--gold);font-weight:800;">
          Fetching FB info...
        </p>
      </div>
    `;

    try {
      const accessToken =
        "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";

      const avatarApi = `https://graph.facebook.com/${encodeURIComponent(
        uid
      )}/picture?height=500&width=500&redirect=false&access_token=${accessToken}`;

      const profileUrl = /^\d+$/.test(uid)
        ? `https://facebook.com/profile.php?id=${uid}`
        : `https://facebook.com/${uid}`;

      const avatarRes = await fetch(avatarApi);
      const avatarData = await avatarRes.json();

      const avatar =
        avatarData?.data?.url ||
        `https://graph.facebook.com/${encodeURIComponent(
          uid
        )}/picture?height=500&width=500`;

      const isUID = /^\d+$/.test(uid);

      resultDiv.innerHTML = `
        <div style="
          background:linear-gradient(135deg,rgba(24,119,242,0.12),rgba(13,95,204,0.05));
          padding:20px;
          border-radius:20px;
          border:1.5px solid rgba(24,119,242,0.25);
        ">

          <p style="
            color:#1877f2;
            font-weight:900;
            font-size:0.95rem;
            margin-bottom:15px;
          ">
            <i class="fas fa-check-circle"></i> USER INFO FOUND
          </p>

          <div style="
            display:flex;
            gap:16px;
            align-items:center;
            margin-bottom:18px;
          ">
            <img
              src="${avatar}"
              alt="avatar"
              style="
                width:85px;
                height:85px;
                border-radius:50%;
                object-fit:cover;
                border:3px solid #1877f2;
                box-shadow:0 0 18px rgba(24,119,242,0.35);
              "
            >

            <div>
              <p style="
                margin:0;
                font-size:1rem;
                font-weight:900;
                color:var(--text);
                word-break:break-all;
              ">
                ${isUID ? uid : "@" + uid}
              </p>

              <p style="
                margin:4px 0 0 0;
                font-size:0.72rem;
                opacity:0.65;
                color:var(--text);
              ">
                Facebook Public Profile
              </p>
            </div>
          </div>

          <div style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
            margin-bottom:16px;
          ">
            <div style="
              background:rgba(0,0,0,0.22);
              padding:12px;
              border-radius:12px;
            ">
              <p style="
                margin:0 0 4px 0;
                font-size:0.62rem;
                opacity:0.6;
                font-weight:900;
                letter-spacing:1px;
              ">
                UID / USERNAME
              </p>

              <p style="
                margin:0;
                font-size:0.8rem;
                font-weight:700;
                word-break:break-all;
              ">
                ${uid}
              </p>
            </div>

            <div style="
              background:rgba(0,0,0,0.22);
              padding:12px;
              border-radius:12px;
            ">
              <p style="
                margin:0 0 4px 0;
                font-size:0.62rem;
                opacity:0.6;
                font-weight:900;
                letter-spacing:1px;
              ">
                AVATAR STATUS
              </p>

              <p style="
                margin:0;
                font-size:0.8rem;
                font-weight:700;
                color:#25D366;
              ">
                ✓ AVAILABLE
              </p>
            </div>
          </div>

          <div style="
            display:flex;
            flex-direction:column;
            gap:8px;
          ">
            <a
              href="${profileUrl}"
              target="_blank"
              style="
                display:block;
                text-align:center;
                padding:12px;
                border-radius:12px;
                text-decoration:none;
                background:linear-gradient(135deg,#1877f2,#0d5fcc);
                color:#fff;
                font-weight:900;
                font-size:0.85rem;
              "
            >
              <i class="fab fa-facebook"></i> OPEN PROFILE
            </a>

            <button
              onclick="navigator.clipboard.writeText('${uid}')"
              style="
                background:rgba(255,215,0,0.1);
                border:1px solid rgba(255,215,0,0.3);
                color:var(--gold);
                padding:11px;
                border-radius:12px;
                cursor:pointer;
                font-weight:900;
                font-family:inherit;
              "
            >
              <i class="fas fa-copy"></i> COPY UID
            </button>
          </div>

          <p style="
            margin-top:12px;
            font-size:0.62rem;
            opacity:0.4;
            text-align:center;
          ">
            Public info only • Full private data unavailable
          </p>
        </div>
      `;
    } catch (err) {
      resultDiv.innerHTML = `
        <div style="
          padding:18px;
          border-radius:18px;
          background:rgba(255,0,0,0.08);
          border:1px solid rgba(255,0,0,0.2);
          text-align:center;
        ">
          <p style="
            color:#ff4d4d;
            font-weight:800;
            margin:0;
          ">
            ❌ Info fetch hoyni!
          </p>
        </div>
      `;
      console.error(err);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectUI);
  } else {
    injectUI();
  }

})();
