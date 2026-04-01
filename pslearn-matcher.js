/* =====================================================
   PSLearn — Object Matcher
   Drag sticky note → correct PS object slot
   Bonus follow-up MCQ after each match
   ===================================================== */

const MATCHER_CHALLENGES = [
  { q:"Store a temporary flag during a component session — never saved to the DB", ans:"Derived/Work Record", opts:["SQL Table","SQL View","Derived/Work Record","Temp Table"], exp:"Derived/Work records exist only in the buffer. No DB object is created. Perfect for flags, push buttons, and computed display values.", followUp:{q:"Why not use a SQL Table for this?",opts:["Too slow","Would save unwanted data to DB","Can't be used in PeopleCode","Requires a key field"],ans:1,exp:"SQL Tables persist to the database on Save. You'd store junk data. Derived/Work is exactly for things that should NEVER persist."} },
  { q:"Run overnight salary recalculation for 500,000 employees", ans:"Application Engine", opts:["Component Interface","Application Engine","SQR","PS Query"], exp:"Application Engine is the batch processing framework for large-scale operations outside the online session. Supports parallel processing with Temp Tables.", followUp:{q:"Why not use Component Interface for bulk batch?",opts:["CI is read-only","CI fires all PeopleCode events — too slow for 500k rows","CI can't handle large numbers","CI needs a browser"],ans:1,exp:"CI fires the full component event chain for every row. For 500k rows this would be catastrophically slow. AE uses optimised SQL sets."} },
  { q:"Load new hire data from an external system while enforcing all business rules", ans:"Component Interface", opts:["Data Mover","SQL Insert","Component Interface","Application Engine"], exp:"CI fires all component PeopleCode events — FieldDefault, SaveEdit, all validations. This ensures data integrity exactly like a user entering data manually.", followUp:{q:"What is the risk of using direct SQL Insert instead of CI?",opts:["Slower performance","Skips all PeopleCode validation — bad data enters DB","Requires DBA access","Only works on Oracle"],ans:1,exp:"Direct SQL bypasses FieldDefault, SaveEdit, and all custom validations. You'd end up with malformed, invalid employee records."} },
  { q:"Display employee department name without storing it", ans:"SQL View", opts:["SQL Table","SQL View","Derived/Work Record","Dynamic View"], exp:"SQL View creates a read-only DB view joining the base table with the department table. Data comes from the DB but is never written back.", followUp:{q:"When would you choose Dynamic View over SQL View?",opts:["Dynamic View is faster","Dynamic View allows runtime-specific filtering with no DB object","Dynamic View supports writes","No difference"],ans:1,exp:"Dynamic View stores SQL that resolves at runtime — no permanent DB view created. Use when the SQL needs to change based on runtime conditions."} },
  { q:"Short code list: A=Active, I=Inactive, T=Terminated (max 4 chars)", ans:"Translate Value (XLAT)", opts:["Prompt Table","Translate Value (XLAT)","Dynamic View","Record Field"], exp:"XLAT values in PSXLATITEM handle short stable code lists of max 4 characters. They display as Drop Down lists and are effective-dated.", followUp:{q:"What is the maximum character length for an XLAT field code?",opts:["2","4","8","10"],ans:1,exp:"XLAT field values are limited to 4 characters. Anything longer needs a Prompt Table instead."} },
  { q:"Send real-time employee data to an external HR system via REST", ans:"Integration Broker", opts:["AE","Data Mover","Integration Broker","Component Interface"], exp:"Integration Broker handles real-time sync/async messaging via REST, SOAP, and internal PS messaging. It manages routing, transformation, and error handling.", followUp:{q:"What is the difference between Synchronous and Async IB messaging?",opts:["Sync is faster","Sync waits for response; Async sends and continues","Async is more secure","Sync uses REST only"],ans:1,exp:"Sync IB blocks the PS transaction until a response is received. Async queues and continues. Use Async for bulk/non-critical integrations."} },
  { q:"EFFDT and EFFSEQ fields reused across 200 different records", ans:"SubRecord", opts:["SQL Table","SubRecord","Dynamic View","Derived/Work"], exp:"SubRecords are reusable field groups embedded into other records. EFFDT_SBR containing EFFDT and EFFSEQ is the most important PS SubRecord, used in hundreds of effective-dated tables.", followUp:{q:"What happens physically when a SubRecord is included in a SQL Table?",opts:["A separate join table is created","SubRecord fields are added directly to the parent table's DDL","A foreign key reference is added","Nothing — it's display-only"],ans:1,exp:"Including a SubRecord adds all its fields directly to the parent record's table. No separate table exists."} },
  { q:"Move setup data (department codes) from DEV to PROD", ans:"Data Mover (DMS)", opts:["AE","Data Mover (DMS)","Component Interface","SQL Script"], exp:"DMS EXPORT/IMPORT moves data between PS databases using .dat files. Ideal for reference/setup data migration without PeopleCode overhead.", followUp:{q:"What is the key risk of using Data Mover vs Component Interface?",opts:["DMS is slower","DMS bypasses all PeopleCode — no validation fires","DMS only works on Oracle","DMS needs App Server"],ans:1,exp:"DMS writes directly to the database, skipping all PeopleCode. Fine for setup data but dangerous for transactional data where validation matters."} },
  { q:"Allow parallel batch jobs to process without data collision", ans:"Temp Table", opts:["SQL Table","SQL View","Temp Table","Derived/Work"], exp:"Temp Tables create multiple instances (MYTEMP_AET, MYTEMP_AET1, MYTEMP_AET2). Each parallel AE process gets its own instance — no collision.", followUp:{q:"What is the naming pattern for a Temp Table in PeopleSoft?",opts:["TEMP_MYRECORD","MY_RECORD_TMP","MYRECORD_AET","PS_TMP_MYRECORD"],ans:2,exp:"Temp Tables are always suffixed _AET. First instance is MYRECORD_AET, subsequent parallel instances are MYRECORD_AET1, MYRECORD_AET2, etc."} },
  { q:"Attach custom validation to a delivered component without modifying it", ans:"Event Mapping", opts:["SubRecord","Event Mapping","Application Package","Component Interface"], exp:"Event Mapping (PT 8.55+) attaches App Class PeopleCode to delivered component events without touching the delivered object. Upgrade-safe customisation.", followUp:{q:"Why is Event Mapping preferred over direct customisation of delivered objects?",opts:["It's faster","Upgrade-safe: delivered objects can be replaced without losing customisations","It uses less memory","Easier syntax"],ans:1,exp:"When Oracle delivers a PeopleTools upgrade, your direct modifications to delivered objects get overwritten. Event Mapping lives in your custom App Package — untouched by upgrades."} }
];

const MATCHER_ICONS = {
  'SQL Table':'🗄️','SQL View':'👁️','Derived/Work Record':'💾','Temp Table':'⏱️',
  'Application Engine':'⚙️','Component Interface':'🔗','SQR':'📄','PS Query':'🔍',
  'Data Mover (DMS)':'📦','Integration Broker':'🌐','SubRecord':'📎',
  'Event Mapping':'🎯','Translate Value (XLAT)':'🏷️','Dynamic View':'⚡','AE':'⚙️'
};

function mEsc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

let matcherState = { idx:0, score:0, answered:false };

function initMatcher() {
  matcherState = { idx:0, score:0, answered:false };
  renderMatcher();
}

function renderMatcher() {
  const ch = MATCHER_CHALLENGES[matcherState.idx];
  matcherState.answered = false;

  document.getElementById('matcherCounter').textContent = `Scenario ${matcherState.idx + 1} of ${MATCHER_CHALLENGES.length}`;
  document.getElementById('matcherScore').textContent   = `Score: ${matcherState.score}/${matcherState.idx}`;
  document.getElementById('matcherScenario').innerHTML  = `<span class="matcher-scenario__num">Q${matcherState.idx+1}</span> ${mEsc(ch.q)}`;

  document.getElementById('matcherOptions').innerHTML = `
    <div class="matcher-dnd-board">
      <div class="matcher-dnd-left">
        <div class="matcher-dnd-label">📋 Scenario Card</div>
        <div class="matcher-sticky" draggable="true" id="matcherSticky" ondragstart="matcherDragStart(event)">
          <div class="matcher-sticky__pin">📌</div>
          <div class="matcher-sticky__text">${mEsc(ch.q)}</div>
          <div class="matcher-sticky__sub">Drag me to the correct object →</div>
        </div>
      </div>
      <div class="matcher-dnd-right">
        <div class="matcher-dnd-label">🗂️ PeopleSoft Objects — Drop Here</div>
        <div class="matcher-slots" id="matcherSlots">
          ${ch.opts.map((opt,i) => `
            <div class="matcher-slot" id="mslot-${i}"
              ondragover="matcherDragOver(event)" ondragleave="matcherDragLeave(event)"
              ondrop="matcherDrop(event,${i})">
              <span class="matcher-slot__icon">${MATCHER_ICONS[opt]||'📌'}</span>
              <span class="matcher-slot__label">${mEsc(opt)}</span>
              <span class="matcher-slot__hint">drop here</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;

  const res = document.getElementById('matcherResult');
  res.classList.remove('show','correct','wrong');
  res.innerHTML = '';
  const nb = document.getElementById('matcherNextBtn');
  if (nb) nb.style.display = 'none';
}

function matcherDragStart(e) {
  e.dataTransfer.setData('text/plain','sticky');
  const s = document.getElementById('matcherSticky');
  if (s) s.classList.add('dragging');
}

function matcherDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('slot-hover');
}

function matcherDragLeave(e) {
  e.currentTarget.classList.remove('slot-hover');
}

function matcherDrop(e, slotIdx) {
  e.preventDefault();
  e.currentTarget.classList.remove('slot-hover');
  if (matcherState.answered) return;
  const s = document.getElementById('matcherSticky');
  if (s) s.classList.remove('dragging');
  const ch = MATCHER_CHALLENGES[matcherState.idx];
  const chosen = ch.opts[slotIdx];
  checkMatcherAnswer(chosen);
}

function checkMatcherAnswer(chosen) {
  if (matcherState.answered) return;
  matcherState.answered = true;

  const ch = MATCHER_CHALLENGES[matcherState.idx];
  const correct = chosen === ch.ans;
  if (correct) matcherState.score++;

  document.getElementById('matcherScore').textContent = `Score: ${matcherState.score}/${matcherState.idx + 1}`;

  document.querySelectorAll('.matcher-slot').forEach(slot => {
    const lbl = slot.querySelector('.matcher-slot__label').textContent.trim();
    slot.style.pointerEvents = 'none';
    if (lbl === ch.ans)                   slot.classList.add('slot-correct');
    else if (lbl === chosen && !correct)  slot.classList.add('slot-wrong');
  });

  const sticky = document.getElementById('matcherSticky');
  if (sticky) {
    sticky.draggable = false;
    sticky.style.opacity = '0.6';
    sticky.querySelector('.matcher-sticky__sub').textContent = correct ? '✓ Correct!' : `✗ Should be: ${ch.ans}`;
  }

  const res = document.getElementById('matcherResult');
  res.className = `lab-result-box show ${correct ? 'correct' : 'wrong'}`;
  res.innerHTML = `
    <div class="lab-result-box__title">${correct ? '✅ Correct!' : '❌ Wrong slot'}</div>
    <div class="lab-result-box__text"><strong>${mEsc(ch.ans)}</strong> — ${mEsc(ch.exp)}</div>`;

  setTimeout(() => showMatcherFollowUp(), 700);
}

function showMatcherFollowUp() {
  const ch = MATCHER_CHALLENGES[matcherState.idx];
  const fq = ch.followUp;
  if (!fq) { const nb=document.getElementById('matcherNextBtn'); if(nb)nb.style.display='inline-flex'; return; }

  const bonus = document.createElement('div');
  bonus.className = 'matcher-followup';
  bonus.id = 'matcherFollowUp';
  bonus.innerHTML = `
    <div class="matcher-followup__label">🎯 Bonus Question</div>
    <div class="matcher-followup__q">${mEsc(fq.q)}</div>
    <div class="matcher-followup__opts">
      ${fq.opts.map((opt,i) => `
        <button class="matcher-followup__btn" onclick="checkMatcherFQ(${i},this)">
          <span class="matcher-followup__letter">${String.fromCharCode(65+i)}</span>${mEsc(opt)}
        </button>`).join('')}
    </div>`;
  document.getElementById('matcherResult').appendChild(bonus);
}

function checkMatcherFQ(chosen, btn) {
  const fq = MATCHER_CHALLENGES[matcherState.idx].followUp;
  const correct = chosen === fq.ans;
  document.querySelectorAll('.matcher-followup__btn').forEach((b,i) => {
    b.disabled = true;
    if (i === fq.ans)            b.classList.add('fq-correct');
    else if (i===chosen&&!correct) b.classList.add('fq-wrong');
  });
  const exp = document.createElement('div');
  exp.style.cssText = 'margin-top:10px;padding:10px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:8px;font-size:12px;color:var(--soft)';
  exp.textContent = `💡 ${fq.exp}`;
  document.getElementById('matcherFollowUp').appendChild(exp);
  const nb = document.getElementById('matcherNextBtn');
  if (nb) nb.style.display = 'inline-flex';
}

function nextMatcher() {
  matcherState.idx++;
  if (matcherState.idx >= MATCHER_CHALLENGES.length) {
    document.getElementById('matcherResult').innerHTML = `
      <div class="lab-result-box show correct">
        <div class="lab-result-box__title">🏆 All Scenarios Complete!</div>
        <div class="lab-result-box__text">Final Score: <strong>${matcherState.score} / ${MATCHER_CHALLENGES.length}</strong></div>
      </div>`;
    const nb = document.getElementById('matcherNextBtn');
    if (nb) nb.style.display = 'none';
    return;
  }
  renderMatcher();
}
