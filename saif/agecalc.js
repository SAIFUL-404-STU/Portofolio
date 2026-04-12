// ============================================================
// SAIF PLUGIN: agecalc.js
// Feature: Age Calculator + Birthday Countdown
// Author: Saif Elite
// ============================================================

(function () {

  function injectUI() {
    const sectionTitles = document.querySelectorAll('.section-title');
    let connectSection = null;
    sectionTitles.forEach(el => {
      if (el.textContent.includes('Connect With Me')) connectSection = el;
    });
    if (!connectSection || document.getElementById('saif-age-box')) return;

    const box = document.createElement('div');
    box.id = 'saif-age-box';
    box.style.cssText = `margin-top:30px;padding:25px;background:var(--dl-bg);border-radius:25px;border:2px solid var(--primary);backdrop-filter:blur(10px);`;
    box.innerHTML = `
      <h3 style="font-size:1rem;color:var(--primary);margin-bottom:15px;font-weight:900;">
        <i class="fas fa-cake-candles"></i> Age Calculator
      </h3>
      <label style="font-size:0.75rem;color:var(--primary);font-weight:900;letter-spacing:1px;display:block;margin-bottom:8px;">YOUR BIRTHDAY</label>
      <input type="date" id="ageInput" style="margin:0 0 15px 0;">
      <button class="dl-btn" onclick="handleAge()">
        <i class="fas fa-calculator"></i> CALCULATE AGE
      </button>
      <div id="ageResult" style="margin-top:15px;"></div>
    `;
    connectSection.parentNode.insertBefore(box, connectSection);
    console.log('[Saif Plugin: agecalc] UI injected ✅');
  }

  window.handleAge = function () {
    const input = document.getElementById('ageInput').value;
    const resultDiv = document.getElementById('ageResult');

    if (!input) {
      if (typeof showNotification === 'function') showNotification("Date select koroo!", "error");
      return;
    }

    const birth = new Date(input);
    const now = new Date();

    if (birth > now) {
      if (typeof showNotification === 'function') showNotification("Future date diso keno 😂", "error");
      return;
    }

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor((now - birth) / (1000 * 60 * 60));

    // Next birthday
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1);
    const daysUntilBirthday = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24));

    const isToday = birth.getMonth() === now.getMonth() && birth.getDate() === now.getDate();

    resultDiv.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(0,210,255,0.1),rgba(0,140,255,0.1));padding:20px;border-radius:20px;border:2px solid var(--primary);margin-top:15px;">
        ${isToday ? `<div style="text-align:center;margin-bottom:15px;font-size:1.5rem;">🎂 Happy Birthday Baby! 🎉</div>` : ''}
        <p style="color:var(--primary);font-weight:900;margin-bottom:15px;text-align:center;">
          <i class="fas fa-birthday-cake"></i> Your Age
        </p>
        <div style="text-align:center;margin-bottom:20px;">
          <span style="font-size:3.5rem;font-weight:900;color:var(--primary);">${years}</span>
          <span style="font-size:1rem;color:var(--text);opacity:0.7;"> years</span>
          <span style="font-size:2rem;font-weight:900;color:var(--primary);"> ${months}</span>
          <span style="font-size:1rem;color:var(--text);opacity:0.7;"> months</span>
          <span style="font-size:2rem;font-weight:900;color:var(--primary);"> ${days}</span>
          <span style="font-size:1rem;color:var(--text);opacity:0.7;"> days</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;">
          <div style="background:rgba(0,0,0,0.2);padding:12px;border-radius:12px;text-align:center;">
            <p style="font-size:0.6rem;opacity:0.7;color:var(--text);margin:0 0 5px 0;font-weight:900;">TOTAL DAYS</p>
            <p style="font-size:1.3rem;font-weight:900;color:var(--primary);margin:0;">${totalDays.toLocaleString()}</p>
          </div>
          <div style="background:rgba(0,0,0,0.2);padding:12px;border-radius:12px;text-align:center;">
            <p style="font-size:0.6rem;opacity:0.7;color:var(--text);margin:0 0 5px 0;font-weight:900;">TOTAL HOURS</p>
            <p style="font-size:1.3rem;font-weight:900;color:var(--primary);margin:0;">${totalHours.toLocaleString()}</p>
          </div>
        </div>
        <div style="background:rgba(0,210,255,0.1);padding:15px;border-radius:15px;border:1px solid rgba(0,210,255,0.3);text-align:center;">
          <p style="font-size:0.7rem;opacity:0.8;color:var(--text);margin:0 0 5px 0;">🎂 Next Birthday</p>
          <p style="font-size:1rem;font-weight:900;color:var(--primary);margin:0;">
            ${isToday ? "TODAY! 🎉" : `${daysUntilBirthday} days baki!`}
          </p>
        </div>
      </div>
    `;
    if (typeof showNotification === 'function') showNotification(`✅ Tomar boyos ${years} years ${months} months!`, "success");
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectUI);
  else injectUI();

  console.log('[Saif Plugin: agecalc] Loaded ✅');
})();
