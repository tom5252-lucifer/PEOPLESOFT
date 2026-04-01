/* =====================================================
   PSLearn — Lab Engine v2
   4 upgraded modes:
   1. Debug Mode       → CodeMirror-style real editor
   2. Event Flow       → Layer B: Inject Mode
   3. Object Matcher   → Drag & drop whiteboard
   4. Scenario Solver  → Detective case file
   ===================================================== */

/* ─────────────────────────────────────────────────────
   SHARED UTILITIES
───────────────────────────────────────────────────── */
function labEsc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ─────────────────────────────────────────────────────
   MODE 1 — DEBUG (CodeMirror-style real editor)
───────────────────────────────────────────────────── */
const DEBUG_CHALLENGES = [
  {
    title:"N+1 Query in RowInit",
    symptom:"HR component takes 45 seconds to load for a manager with 200 direct reports.",
    bugLine: 7,
    hint:"How many times does SQLExec on line 7 execute when there are 200 rows?",
    explanation:"Line 7 — SQLExec inside a RowInit loop creates an N+1 query problem. With 200 rows, this fires 200 separate DB calls. Fix: pre-fetch all dept names once in PostBuild using CreateSQL into an object, then look up from memory inside RowInit.",
    fixedLine:"    SQLExec('SELECT DESCR FROM PS_DEPT_TBL WHERE DEPTID=:1', &deptMap.Get(&rec.DEPTID.Value), &dn);",
    fixHint:"Move the SQL OUT of the loop. Pre-fetch all dept names at PostBuild level.",
    code:[
      {n:1, t:"/* RowInit — Initialize department description */"},
      {n:2, t:"Function Init()"},
      {n:3, t:"  Local Rowset &rs;"},
      {n:4, t:"  &rs = GetRowset(Scroll.JOB);"},
      {n:5, t:"  For &i = 1 To &rs.ActiveRowCount"},
      {n:6, t:"    Local Record &rec = &rs.GetRow(&i).GetRecord(Record.JOB);"},
      {n:7, t:"    SQLExec('SELECT DESCR FROM PS_DEPT_TBL WHERE DEPTID=:1', &rec.DEPTID.Value, &dn);"},
      {n:8, t:"    &rec.DEPTID_DESCR.Value = &dn;"},
      {n:9, t:"  End-For;"},
      {n:10,t:"End-Function;"}
    ]
  },
  {
    title:"Variable Scope — Lost Between Events",
    symptom:"Flag set in PostBuild is always empty when checked in SaveEdit. Save never blocked.",
    bugLine: 2,
    hint:"Local variables only exist for ONE program execution. PostBuild and SaveEdit are completely separate executions.",
    explanation:"Line 2 — Local scope means &isNew is destroyed when PostBuild finishes. SaveEdit is a separate execution — &isNew is empty. Fix: declare as Component Boolean &isNew so it persists across the entire transaction.",
    fixedLine:"Component Boolean &isNew;",
    fixHint:"Change 'Local' to 'Component' so the flag survives between events.",
    code:[
      {n:1, t:"/* PostBuild */"},
      {n:2, t:"Local Boolean &isNew;"},
      {n:3, t:"If JOB.ACTION.Value = 'HIR' Then"},
      {n:4, t:"   &isNew = True;"},
      {n:5, t:"End-If;"},
      {n:6, t:""},
      {n:7, t:"/* SaveEdit — checks the flag */"},
      {n:8, t:"If &isNew Then"},
      {n:9, t:"   Error 'Dept required for new hire';"},
      {n:10,t:"End-If;"}
    ]
  },
  {
    title:"Missing Effective Dating",
    symptom:"Query returns 15 rows for one employee. DEPTID is from 8 years ago.",
    bugLine: 2,
    hint:"PS_JOB stores every job change ever made. How do you get ONLY the current row?",
    explanation:"Line 2 — No effective dating WHERE clause. PS_JOB has 20+ rows per employee across their career. Fix: add WHERE EFFDT = (SELECT MAX(EFFDT) FROM PS_JOB J2 WHERE J2.EMPLID = J1.EMPLID AND J2.EFFDT <= %CurrentDateIn) AND EFFSEQ = (SELECT MAX(...)).",
    fixedLine:"SQLExec('SELECT DEPTID FROM PS_JOB WHERE EMPLID=:1 AND EFFDT=(SELECT MAX(E) FROM PS_JOB WHERE EMPLID=:1 AND EFFDT<=%CurrentDateIn)', PERSONAL_DATA.EMPLID.Value, &dept);",
    fixHint:"Add MAX(EFFDT) <= today subquery to get only the current effective row.",
    code:[
      {n:1, t:"Local string &dept;"},
      {n:2, t:"SQLExec('SELECT DEPTID FROM PS_JOB WHERE EMPLID=:1',"},
      {n:3, t:"  PERSONAL_DATA.EMPLID.Value, &dept);"},
      {n:4, t:"JOB.DEPTID.Value = &dept;"}
    ]
  },
  {
    title:"Wrong Event for Defaulting",
    symptom:"DEPTID defaults correctly on new records but clears when user changes BUSINESS_UNIT.",
    bugLine: 1,
    hint:"FieldChange fires when the USER changes a field. When should a default be set on component load?",
    explanation:"Line 1 — Wrong event. FieldChange fires only when the user actively changes BUSINESS_UNIT. For component-load defaulting use FieldDefault (fires before user sees the field) or PostBuild. FieldChange is for reacting to user input — not initial defaults.",
    fixedLine:"/* FieldDefault on DEPTID */",
    fixHint:"Move this logic to FieldDefault event on DEPTID, not FieldChange on BUSINESS_UNIT.",
    code:[
      {n:1, t:"/* FieldChange on BUSINESS_UNIT */"},
      {n:2, t:"If JOB.DEPTID.Value = '' Then"},
      {n:3, t:"   JOB.DEPTID.Value = 'CORP';"},
      {n:4, t:"End-If;"}
    ]
  },
  {
    title:"Error() in SavePostChange",
    symptom:"Error message appears but data is already saved to the database. User is confused.",
    bugLine: 1,
    hint:"Can you cancel a save AFTER the database commit has already happened?",
    explanation:"Line 1 — Wrong event. SavePostChange fires AFTER the DB commit is complete. Error() here is silently ignored — data is already saved. Move the validation to SaveEdit which fires BEFORE the commit and where Error() actually stops the save.",
    fixedLine:"/* SaveEdit — fires BEFORE DB commit */",
    fixHint:"Move Error() validation to SaveEdit — it's the only event that can block a save.",
    code:[
      {n:1, t:"/* SavePostChange */"},
      {n:2, t:"If JOB.ANNUAL_RT.Value > 500000 Then"},
      {n:3, t:"   Error 'Salary exceeds maximum. Save cancelled.';"},
      {n:4, t:"End-If;"}
    ]
  },
  {
    title:"Hardcoded Effective Date",
    symptom:"Report always shows January 2020 data even though it's 2025. Historical rows returned.",
    bugLine: 3,
    hint:"What happens when you hardcode a date instead of using %CurrentDateIn?",
    explanation:"Line 3 — Hardcoded date '2020-01-01' means the query ALWAYS fetches data as of that date. Fix: replace with %CurrentDateIn which resolves to today's date in the correct format for your database (Oracle, SQL Server, or DB2).",
    fixedLine:"WHERE J.EMPLID = :1 AND J.EFFDT = (SELECT MAX(EFFDT) FROM PS_JOB WHERE EMPLID = J.EMPLID AND EFFDT <= %CurrentDateIn)",
    fixHint:"Replace the hardcoded date with %CurrentDateIn — the PS Meta-SQL for today's date.",
    code:[
      {n:1, t:"SQLExec('SELECT DEPTID, COMPRATE"},
      {n:2, t:"         FROM PS_JOB J"},
      {n:3, t:"         WHERE J.EMPLID = :1 AND J.EFFDT = ''2020-01-01''',"},
      {n:4, t:"  PERSONAL_DATA.EMPLID.Value, &dept, &comp);"}
    ]
  }
];

let debugState = { idx: 0, selected: null, score: 0, editMode: false, hints: 3 };

function initDebug() {
  debugState = { idx: 0, selected: null, score: 0, editMode: false, hints: 3 };
  renderDebugChallenge();
}

function renderDebugChallenge() {
  const ch = DEBUG_CHALLENGES[debugState.idx];
  debugState.selected = null;
  debugState.editMode = false;

  document.getElementById('debugCounter').textContent = `Challenge ${debugState.idx + 1} of ${DEBUG_CHALLENGES.length}`;
  document.getElementById('debugScore').textContent = `Score: ${debugState.score}`;

  // Symptom box
  document.getElementById('debugScenario').innerHTML = `
    <div class="matcher-scenario__label">🏥 Symptom</div>
    <div class="matcher-scenario__text">${labEsc(ch.symptom)}</div>`;

  // Render code editor
  document.getElementById('debugCode').innerHTML = ch.code.map(l => `
    <div class="lab-code-line" id="dline-${l.n}" onclick="selectDebugLine(${l.n})">
      <span class="lab-code-linenum">${l.n}</span>
      <span class="lab-code-text" id="dtext-${l.n}">${labEsc(l.t)}</span>
    </div>`).join('');

  document.getElementById('debugHint').textContent = '';

  // Actions bar — includes hint token counter
  document.getElementById('debugActions').innerHTML = `
    <button class="btn btn--gold btn--sm" id="debugCheckBtn" onclick="checkDebugAnswer()" disabled>✓ Check Answer</button>
    <button class="btn btn--ghost btn--sm" onclick="showDebugHint()">💡 Hint <span class="hint-token" id="hintCount">${debugState.hints}</span></button>
    <button class="btn btn--ghost btn--sm" id="debugFixBtn" style="display:none" onclick="showDebugFix()">🔧 Show Fix</button>
    <button class="btn btn--ghost btn--sm" id="debugNextBtn" style="display:none" onclick="nextDebugChallenge()">Next →</button>`;

  const res = document.getElementById('debugResult');
  res.classList.remove('show','correct','wrong');
  res.innerHTML = '';
}

function selectDebugLine(n) {
  document.querySelectorAll('.lab-code-line').forEach(l => l.classList.remove('selected'));
  document.getElementById(`dline-${n}`).classList.add('selected');
  debugState.selected = n;
  document.getElementById('debugCheckBtn').disabled = false;
}

function showDebugHint() {
  if (debugState.hints <= 0) return;
  debugState.hints--;
  const hc = document.getElementById('hintCount');
  if (hc) hc.textContent = debugState.hints;
  const ch = DEBUG_CHALLENGES[debugState.idx];
  document.getElementById('debugHint').textContent = `💡 Hint: ${ch.hint}`;
}

function checkDebugAnswer() {
  const ch = DEBUG_CHALLENGES[debugState.idx];
  const correct = debugState.selected === ch.bugLine;
  if (correct) debugState.score++;

  document.getElementById('debugScore').textContent = `Score: ${debugState.score}`;
  document.querySelectorAll('.lab-code-line').forEach(l => l.style.pointerEvents = 'none');
  document.getElementById(`dline-${ch.bugLine}`).classList.add('correct-line');
  if (!correct && debugState.selected) document.getElementById(`dline-${debugState.selected}`).classList.add('wrong-line');

  const res = document.getElementById('debugResult');
  res.className = `lab-result-box show ${correct ? 'correct' : 'wrong'}`;
  res.innerHTML = `
    <div class="lab-result-box__title">${correct ? '✅ Correct!' : '❌ Wrong line'}</div>
    <div class="lab-result-box__text"><strong>Bug on line ${ch.bugLine}:</strong> ${ch.explanation}</div>`;

  document.getElementById('debugCheckBtn').style.display = 'none';
  document.getElementById('debugFixBtn').style.display = 'inline-flex';
  if (debugState.idx < DEBUG_CHALLENGES.length - 1) {
    document.getElementById('debugNextBtn').style.display = 'inline-flex';
  } else {
    res.innerHTML += `<br><strong style="color:var(--gold)">🎉 All done! Score: ${debugState.score}/${DEBUG_CHALLENGES.length}</strong>`;
  }
}

function showDebugFix() {
  const ch = DEBUG_CHALLENGES[debugState.idx];
  const lineEl = document.getElementById(`dtext-${ch.bugLine}`);
  if (!lineEl) return;

  // Animate the fix in
  lineEl.style.transition = 'all 0.4s ease';
  lineEl.style.color = 'var(--green)';
  lineEl.innerHTML = `<del style="color:var(--red);opacity:0.6">${labEsc(ch.code.find(l=>l.n===ch.bugLine)?.t||'')}</del>  <span style="color:var(--green)">→ ${labEsc(ch.fixedLine)}</span>`;

  const hint = document.createElement('div');
  hint.style.cssText = 'margin-top:10px;padding:10px 14px;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.25);border-radius:8px;font-size:12px;color:var(--green);font-family:var(--fm)';
  hint.textContent = `🔧 ${ch.fixHint}`;
  document.getElementById('debugResult').appendChild(hint);
  document.getElementById('debugFixBtn').style.display = 'none';
}

function nextDebugChallenge() {
  debugState.idx++;
  renderDebugChallenge();
}


/* ─────────────────────────────────────────────────────
   MODE 2 — EVENT FLOW TRAINER (Layer B: Inject Mode)
───────────────────────────────────────────────────── */
const EF_INJECT_CHALLENGES = [
  {
    name: "PostBuild Is Missing",
    description: "A developer's component loads with all fields visible even though they should be hidden for read-only users. The show/hide logic exists but never runs. One critical event is missing from the pipeline.",
    scenario: "Show/hide logic in PostBuild never fires. Fields always visible.",
    correctFlow: ["SearchInit","RowSelect","RowInit","FieldDefault","FieldFormula","PostBuild","Activate"],
    brokenFlow:  ["SearchInit","RowSelect","RowInit","FieldDefault","FieldFormula","Activate"],
    missingEvent: "PostBuild",
    missingPosition: 5,
    phaseMap: {SearchInit:"load",RowSelect:"load",RowInit:"load",FieldDefault:"load",FieldFormula:"load",PostBuild:"load",Activate:"interact"},
    explanation: "PostBuild fires once after the entire component is fully loaded — it's the correct place for show/hide logic. Without it, page configuration code never runs."
  },
  {
    name: "SaveEdit Removed",
    description: "After a code cleanup, salaries over $500,000 are being saved without any error. The validation rule exists in PeopleCode but never fires. A critical save-sequence event was deleted.",
    scenario: "Salary validation exists in PeopleCode but save is never blocked.",
    correctFlow: ["SaveEdit","SavePreChange","WorkFlow","SavePostChange"],
    brokenFlow:  ["SavePreChange","WorkFlow","SavePostChange"],
    missingEvent: "SaveEdit",
    missingPosition: 0,
    phaseMap: {SaveEdit:"save",SavePreChange:"save",WorkFlow:"save",SavePostChange:"save"},
    explanation: "SaveEdit fires BEFORE the DB commit and is the ONLY place where Error() can block a save. Without it, validation rules can never stop bad data from being saved."
  },
  {
    name: "FieldDefault Skipped",
    description: "New employees are added but DEPTID always loads blank even though a default was configured. The default logic exists. One event in the load sequence was accidentally removed.",
    scenario: "New records always show blank DEPTID despite default PeopleCode existing.",
    correctFlow: ["SearchInit","RowSelect","RowInit","FieldDefault","FieldFormula","PostBuild","Activate"],
    brokenFlow:  ["SearchInit","RowSelect","RowInit","FieldFormula","PostBuild","Activate"],
    missingEvent: "FieldDefault",
    missingPosition: 3,
    phaseMap: {SearchInit:"load",RowSelect:"load",RowInit:"load",FieldDefault:"load",FieldFormula:"load",PostBuild:"load",Activate:"interact"},
    explanation: "FieldDefault fires for every field that has no value during the component load sequence. It's the canonical event for setting default values before the user sees the page."
  },
  {
    name: "RowInit Deleted",
    description: "A performance fix accidentally deleted an entire event from the load sequence. Now derived fields (department descriptions) never populate when rows load into the grid.",
    scenario: "Department description fields are blank in the grid after a recent 'fix'.",
    correctFlow: ["SearchInit","RowSelect","RowInit","FieldDefault","FieldFormula","PostBuild"],
    brokenFlow:  ["SearchInit","RowSelect","FieldDefault","FieldFormula","PostBuild"],
    missingEvent: "RowInit",
    missingPosition: 2,
    phaseMap: {SearchInit:"load",RowSelect:"load",RowInit:"load",FieldDefault:"load",FieldFormula:"load",PostBuild:"load"},
    explanation: "RowInit fires for every row loaded into the component buffer. Code to derive values, set display flags per row, or compute row-level fields belongs here."
  }
];

let efInjectState = { idx: 0, pipeline: [], dragging: null, dragTarget: null, submitted: false };

function initEventFlow() {
  efInjectState = { idx: 0, pipeline: [], dragging: null, dragTarget: null, submitted: false };
  loadEFInjectChallenge();
}

function loadEFInjectChallenge() {
  const ch = EF_INJECT_CHALLENGES[efInjectState.idx];
  efInjectState.pipeline = [...ch.brokenFlow];
  efInjectState.submitted = false;

  document.getElementById('efChallengeName').textContent = `Case ${efInjectState.idx + 1} of ${EF_INJECT_CHALLENGES.length}: ${ch.name}`;

  // Replace old sub/description paragraphs dynamically
  const header = document.querySelector('#labEventFlow .lab-debug__header');
  if (header) {
    header.querySelector('.lab-debug__sub').textContent = 'The pipeline below is broken — one event is missing. Drag the missing event from the bank into the correct slot.';
  }

  renderEFInjectUI();

  const res = document.getElementById('efResult');
  res.classList.remove('show','correct','wrong');
  res.innerHTML = '';
  const nextBtn = document.getElementById('efNextBtn');
  if (nextBtn) nextBtn.style.display = 'none';
}

function renderEFInjectUI() {
  const ch = EF_INJECT_CHALLENGES[efInjectState.idx];
  const phaseColors = { load:'#22c55e', interact:'#f59e0b', save:'#ef4444' };
  const phaseLabels = { load:'Load', interact:'User Action', save:'Save' };

  const container = document.getElementById('eventDragList');
  if (!container) return;

  container.innerHTML = `
    <div class="ef-inject-wrap">
      <!-- Scenario -->
      <div class="ef-scenario-box">
        <div class="ef-scenario-label">🏢 Incident Report</div>
        <div class="ef-scenario-text">${labEsc(ch.description)}</div>
        <div class="ef-scenario-symptom">⚠️ Symptom: ${labEsc(ch.scenario)}</div>
      </div>

      <!-- Event Bank (draggable source) -->
      <div class="ef-bank-label">🎒 Event Bank — drag the missing event into the pipeline</div>
      <div class="ef-event-bank" id="efEventBank">
        <div class="ef-bank-chip"
          draggable="true"
          ondragstart="efBankDragStart(event)"
          id="efBankChip">
          <span class="ef-chip-dot" style="background:${phaseColors[ch.phaseMap[ch.missingEvent]]}"></span>
          ${labEsc(ch.missingEvent)}
          <span class="ef-chip-phase">${phaseLabels[ch.phaseMap[ch.missingEvent]]}</span>
        </div>
        <div class="ef-bank-hint">← drag this into the pipeline below</div>
      </div>

      <!-- Pipeline -->
      <div class="ef-pipeline-label">📋 Current Pipeline (broken — drop missing event in correct position)</div>
      <div class="ef-pipeline" id="efPipeline">
        <!-- Drop zone at position 0 -->
        <div class="ef-drop-slot" ondragover="efSlotDragOver(event,0)" ondragleave="efSlotDragLeave(event)" ondrop="efSlotDrop(event,0)">
          <span class="ef-drop-hint">+ drop here</span>
        </div>
        ${efInjectState.pipeline.map((ev, i) => `
          <div class="ef-pipeline-node ${ch.phaseMap[ev] || 'load'}-node" id="efnode-${i}">
            <span class="ef-node-num">${i+1}</span>
            <span class="ef-node-name">${labEsc(ev)}</span>
            <span class="ef-node-phase" style="color:${phaseColors[ch.phaseMap[ev]] || '#22c55e'}">${phaseLabels[ch.phaseMap[ev]] || 'Load'}</span>
          </div>
          <div class="ef-drop-slot" ondragover="efSlotDragOver(event,${i+1})" ondragleave="efSlotDragLeave(event)" ondrop="efSlotDrop(event,${i+1})">
            <span class="ef-drop-hint">+ drop here</span>
          </div>
        `).join('')}
      </div>

      <!-- Actions -->
      <div class="lab-debug__actions" style="margin-top:20px">
        <button class="btn btn--gold btn--sm" id="efCheckBtn" onclick="checkEFInject()" ${efInjectState.submitted?'disabled':''}>
          ▶ Simulate Pipeline
        </button>
        <button class="btn btn--ghost btn--sm" onclick="resetEFInject()">↺ Reset</button>
        <button class="btn btn--ghost btn--sm" id="efNextBtn" style="display:none" onclick="nextEFInject()">Next Case →</button>
      </div>
    </div>`;
}

let efBankUsed = false;

function efBankDragStart(e) {
  e.dataTransfer.setData('text/plain', 'bank');
  efBankUsed = false;
  setTimeout(() => {
    const chip = document.getElementById('efBankChip');
    if (chip) chip.classList.add('dragging');
  }, 0);
}

function efSlotDragOver(e, pos) {
  e.preventDefault();
  const slots = document.querySelectorAll('.ef-drop-slot');
  slots.forEach(s => s.classList.remove('drag-over'));
  const target = slots[pos];
  if (target) target.classList.add('drag-over');
}

function efSlotDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function efSlotDrop(e, pos) {
  e.preventDefault();
  document.querySelectorAll('.ef-drop-slot').forEach(s => s.classList.remove('drag-over'));
  const ch = EF_INJECT_CHALLENGES[efInjectState.idx];

  // Remove chip from bank
  const chip = document.getElementById('efBankChip');
  if (chip) {
    chip.classList.remove('dragging');
    chip.style.opacity = '0.3';
    chip.style.pointerEvents = 'none';
    chip.draggable = false;
  }

  // Insert into pipeline at position
  efInjectState.pipeline.splice(pos, 0, ch.missingEvent);
  renderEFInjectUI();

  // Re-disable chip after re-render
  const newChip = document.getElementById('efBankChip');
  if (newChip && efInjectState.pipeline.includes(ch.missingEvent)) {
    newChip.style.opacity = '0.3';
    newChip.style.pointerEvents = 'none';
    newChip.draggable = false;
    newChip.title = 'Already placed in pipeline';
    const hint = document.querySelector('.ef-bank-hint');
    if (hint) hint.textContent = '✓ Event placed in pipeline — check your answer!';
  }
}

function checkEFInject() {
  const ch = EF_INJECT_CHALLENGES[efInjectState.idx];
  efInjectState.submitted = true;

  const correct = JSON.stringify(efInjectState.pipeline) === JSON.stringify(ch.correctFlow);

  // Animate each node
  const nodes = document.querySelectorAll('.ef-pipeline-node');
  nodes.forEach((node, i) => {
    const eventName = efInjectState.pipeline[i];
    const expectedName = ch.correctFlow[i];
    setTimeout(() => {
      node.classList.add('simulating');
      setTimeout(() => {
        node.classList.remove('simulating');
        if (eventName === expectedName) node.classList.add('node-correct');
        else node.classList.add('node-wrong');
        // Special glow for the injected event
        if (eventName === ch.missingEvent) node.classList.add('node-injected');
      }, 300 + i * 150);
    }, i * 150);
  });

  const totalDelay = efInjectState.pipeline.length * 150 + 600;
  setTimeout(() => {
    const res = document.getElementById('efResult');
    res.className = `lab-result-box show ${correct ? 'correct' : 'wrong'}`;

    if (correct) {
      res.innerHTML = `
        <div class="lab-result-box__title">✅ Pipeline Fixed!</div>
        <div class="lab-result-box__text">
          <strong>${ch.missingEvent}</strong> belongs at position ${ch.missingPosition + 1}.<br>
          ${ch.explanation}
        </div>
        <div class="ef-correct-flow">
          ${ch.correctFlow.map((ev, i) => `<span class="ef-flow-chip ${ev === ch.missingEvent ? 'ef-chip-injected' : ''}">${i+1}. ${ev}</span>`).join(' → ')}
        </div>`;
    } else {
      const actualPos = efInjectState.pipeline.indexOf(ch.missingEvent);
      res.innerHTML = `
        <div class="lab-result-box__title">❌ Wrong Position</div>
        <div class="lab-result-box__text">
          You placed <strong>${ch.missingEvent}</strong> at position ${actualPos + 1}, but it should be position ${ch.missingPosition + 1}.<br>
          ${ch.explanation}
        </div>`;
    }

    const checkBtn = document.getElementById('efCheckBtn');
    if (checkBtn) checkBtn.disabled = true;

    if (efInjectState.idx < EF_INJECT_CHALLENGES.length - 1) {
      const nextBtn = document.getElementById('efNextBtn');
      if (nextBtn) nextBtn.style.display = 'inline-flex';
    }
  }, totalDelay);
}

function resetEFInject() {
  efInjectState.submitted = false;
  loadEFInjectChallenge();
}

function nextEFInject() {
  efInjectState.idx++;
  loadEFInjectChallenge();
}

// Compat aliases expected by existing HTML onclick handlers
function checkEventOrder() { checkEFInject(); }
function resetEventOrder() { resetEFInject(); }
function nextEFChallenge() { nextEFInject(); }


/* ─────────────────────────────────────────────────────
   MODE 3 — OBJECT MATCHER (Drag & Drop Whiteboard)
───────────────────────────────────────────────────── */
const MATCHER_CHALLENGES_V2 = [
  {
    q:"Store a temporary flag during a component session — never saved to the DB",
    ans:"Derived/Work Record",
    opts:["SQL Table","SQL View","Derived/Work Record","Temp Table"],
    exp:"Derived/Work records exist only in the buffer. No DB object is created. Perfect for flags, push buttons, and computed display values.",
    followUp:{ q:"Why not use a SQL Table for this?", opts:["Too slow","Would save unwanted data to DB","Can't be used in PeopleCode","Requires a key field"], ans:1, exp:"SQL Tables persist to the database on Save. You'd store junk data. Derived/Work is exactly for things that should NEVER persist." }
  },
  {
    q:"Run overnight salary recalculation for 500,000 employees",
    ans:"Application Engine",
    opts:["Component Interface","Application Engine","SQR","PS Query"],
    exp:"Application Engine is the batch processing framework for large-scale operations outside the online session. Supports parallel processing with Temp Tables.",
    followUp:{ q:"Why not use Component Interface for bulk batch?", opts:["CI is read-only","CI fires all PeopleCode events — too slow for 500k rows","CI can't handle numbers that large","CI needs a browser"], ans:1, exp:"CI fires the full component event chain (FieldDefault, SaveEdit, etc.) for every row. For 500k rows this would be catastrophically slow. AE uses optimised SQL sets." }
  },
  {
    q:"Load new hire data from an external system while enforcing all business rules",
    ans:"Component Interface",
    opts:["Data Mover","SQL Insert","Component Interface","Application Engine"],
    exp:"CI fires all component PeopleCode events — FieldDefault, SaveEdit, all validations. This ensures data integrity exactly like a user entering data manually.",
    followUp:{ q:"What is the risk of using direct SQL Insert instead of CI?", opts:["Slower performance","Skips all PeopleCode validation — bad data enters DB","Requires DBA access","Only works on Oracle"], ans:1, exp:"Direct SQL bypasses FieldDefault, SaveEdit, and all custom validations. You'd end up with malformed, invalid employee records that cause downstream errors." }
  },
  {
    q:"Display employee department name without storing it",
    ans:"SQL View",
    opts:["SQL Table","SQL View","Derived/Work Record","Dynamic View"],
    exp:"SQL View creates a read-only DB view joining the base table with the department table. Data comes from the DB but is never written back.",
    followUp:{ q:"When would you choose Dynamic View over SQL View?", opts:["Dynamic View is faster","Dynamic View allows runtime-specific filtering with no DB object","Dynamic View supports writes","No difference — use either"], ans:1, exp:"Dynamic View stores SQL that resolves at runtime — no permanent DB view created. Use when the SQL needs to change based on runtime conditions." }
  },
  {
    q:"Short code list: A=Active, I=Inactive, T=Terminated (max 4 chars)",
    ans:"Translate Value (XLAT)",
    opts:["Prompt Table","Translate Value (XLAT)","Dynamic View","Record Field"],
    exp:"XLAT values in PSXLATITEM handle short stable code lists of max 4 characters. They display as Drop Down lists and are effective-dated.",
    followUp:{ q:"What is the maximum character length for an XLAT field code?", opts:["2","4","8","10"], ans:1, exp:"XLAT field values are limited to 4 characters. Anything longer needs a Prompt Table instead." }
  },
  {
    q:"Send real-time employee data to an external HR system via REST",
    ans:"Integration Broker",
    opts:["AE","Data Mover","Integration Broker","Component Interface"],
    exp:"Integration Broker handles real-time sync/async messaging via REST, SOAP, and internal PS messaging. It manages routing, transformation, and error handling.",
    followUp:{ q:"What is the difference between Synchronous and Async IB messaging?", opts:["Sync is faster","Sync waits for response; Async sends and continues","Async is more secure","Sync uses REST only"], ans:1, exp:"Sync IB blocks the PS transaction until a response is received — like a phone call. Async queues and continues — like email. Use Async for bulk/non-critical integrations." }
  },
  {
    q:"EFFDT and EFFSEQ fields reused across 200 different records",
    ans:"SubRecord",
    opts:["SQL Table","SubRecord","Dynamic View","Derived/Work"],
    exp:"SubRecords are reusable field groups embedded into other records. EFFDT_SBR containing EFFDT and EFFSEQ is the most important PS SubRecord, used in hundreds of effective-dated tables.",
    followUp:{ q:"What happens physically when a SubRecord is included in a SQL Table?", opts:["A separate join table is created","SubRecord fields are added directly to the parent table's DDL","A foreign key reference is added","Nothing — it's display-only"], ans:1, exp:"Including a SubRecord adds all its fields directly to the parent record's table. PS_JOB has EFFDT and EFFSEQ as columns because EFFDT_SBR was included — no separate table exists." }
  },
  {
    q:"Move setup data (department codes) from DEV to PROD",
    ans:"Data Mover (DMS)",
    opts:["AE","Data Mover (DMS)","Component Interface","SQL Script"],
    exp:"DMS EXPORT/IMPORT moves data between PS databases using .dat files. Ideal for reference/setup data migration without PeopleCode overhead.",
    followUp:{ q:"What is the key risk of using Data Mover vs Component Interface?", opts:["DMS is slower","DMS bypasses all PeopleCode — no validation fires","DMS only works on Oracle","DMS needs App Server"], ans:1, exp:"DMS writes directly to the database, skipping all PeopleCode. Fine for setup data (department codes) but dangerous for transactional data where validation matters." }
  },
  {
    q:"Allow parallel batch jobs to process without data collision",
    ans:"Temp Table",
    opts:["SQL Table","SQL View","Temp Table","Derived/Work"],
    exp:"Temp Tables create multiple instances (MYTEMP_AET, MYTEMP_AET1, MYTEMP_AET2). Each parallel AE process gets its own instance — no collision.",
    followUp:{ q:"What is the naming pattern for a Temp Table in PeopleSoft?", opts:["TEMP_MYRECORD","MY_RECORD_TMP","MYRECORD_AET","PS_TMP_MYRECORD"], ans:2, exp:"Temp Tables are always suffixed _AET (Application Engine Temp). First instance is MYRECORD_AET, subsequent parallel instances are MYRECORD_AET1, MYRECORD_AET2, etc." }
  },
  {
    q:"Attach custom validation to a delivered component without modifying it",
    ans:"Event Mapping",
    opts:["SubRecord","Event Mapping","Application Package","Component Interface"],
    exp:"Event Mapping (PT 8.55+) attaches App Class PeopleCode to delivered component events without touching the delivered object. Upgrade-safe customisation.",
    followUp:{ q:"Why is Event Mapping preferred over direct customisation of delivered objects?", opts:["It's faster","Upgrade-safe: delivered objects can be replaced without losing customisations","It uses less memory","Easier syntax"], ans:1, exp:"When Oracle delivers a PeopleTools upgrade, your direct modifications to delivered objects get overwritten. Event Mapping lives in your custom App Package — untouched by upgrades." }
  }
];

let matcherV2State = {
  idx: 0, score: 0, answered: false, showingFollowUp: false,
  dragSrc: null
};

function initMatcher() {
  matcherV2State = { idx: 0, score: 0, answered: false, showingFollowUp: false, dragSrc: null };
  renderMatcherV2();
}

function renderMatcherV2() {
  const ch = MATCHER_CHALLENGES_V2[matcherV2State.idx];
  matcherV2State.answered = false;
  matcherV2State.showingFollowUp = false;

  document.getElementById('matcherCounter').textContent = `Scenario ${matcherV2State.idx + 1} of ${MATCHER_CHALLENGES_V2.length}`;
  document.getElementById('matcherScore').textContent = `Score: ${matcherV2State.score}/${matcherV2State.idx}`;
  document.getElementById('matcherScenario').innerHTML = `<span class="matcher-scenario__num">Q${matcherV2State.idx+1}</span> ${labEsc(ch.q)}`;

  // Build the drag-and-drop whiteboard
  document.getElementById('matcherOptions').innerHTML = `
    <div class="matcher-dnd-board">
      <!-- Left: scenario card -->
      <div class="matcher-dnd-left">
        <div class="matcher-dnd-label">📋 Scenario</div>
        <div class="matcher-sticky"
          draggable="true"
          id="matcherSticky"
          ondragstart="matcherDragStart(event)">
          <div class="matcher-sticky__pin">📌</div>
          <div class="matcher-sticky__text">${labEsc(ch.q)}</div>
          <div class="matcher-sticky__sub">Drag me to the correct slot →</div>
        </div>
      </div>

      <!-- Right: drop slots -->
      <div class="matcher-dnd-right">
        <div class="matcher-dnd-label">🗂️ PeopleSoft Objects — Drop Here</div>
        <div class="matcher-slots" id="matcherSlots">
          ${ch.opts.map((opt, i) => `
            <div class="matcher-slot" id="mslot-${i}"
              ondragover="matcherDragOver(event)"
              ondragleave="matcherDragLeave(event)"
              ondrop="matcherDrop(event,'${labEsc(opt)}')">
              <span class="matcher-slot__icon">${getObjectIcon(opt)}</span>
              <span class="matcher-slot__label">${labEsc(opt)}</span>
              <span class="matcher-slot__hint">drop here</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;

  const res = document.getElementById('matcherResult');
  res.classList.remove('show','correct','wrong');
  res.innerHTML = '';
  const nextBtn = document.getElementById('matcherNextBtn');
  if (nextBtn) nextBtn.style.display = 'none';
}

function getObjectIcon(opt) {
  const icons = {
    'SQL Table':'🗄️','SQL View':'👁️','Derived/Work Record':'💾','Temp Table':'⏱️',
    'Application Engine':'⚙️','Component Interface':'🔗','SQR':'📄','PS Query':'🔍',
    'Data Mover (DMS)':'📦','Integration Broker':'🌐','SubRecord':'📎',
    'Event Mapping':'🎯','Translate Value (XLAT)':'🏷️','Dynamic View':'⚡',
    'Application Package':'📦','Prompt Table':'🔑','Record Field':'📝',
    'SQL Insert':'💉'
  };
  return icons[opt] || '📌';
}

function matcherDragStart(e) {
  e.dataTransfer.setData('text/plain', 'sticky');
  const sticky = document.getElementById('matcherSticky');
  if (sticky) { sticky.classList.add('dragging'); matcherV2State.dragSrc = sticky; }
}

function matcherDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('slot-hover');
}

function matcherDragLeave(e) {
  e.currentTarget.classList.remove('slot-hover');
}

function matcherDrop(e, droppedOn) {
  e.preventDefault();
  e.currentTarget.classList.remove('slot-hover');
  if (matcherV2State.answered) return;

  const sticky = document.getElementById('matcherSticky');
  if (sticky) sticky.classList.remove('dragging');

  checkMatcherV2Answer(droppedOn);
}

function checkMatcherV2Answer(chosen) {
  if (matcherV2State.answered) return;
  matcherV2State.answered = true;

  const ch = MATCHER_CHALLENGES_V2[matcherV2State.idx];
  const correct = chosen === ch.ans;
  if (correct) matcherV2State.score++;

  document.getElementById('matcherScore').textContent = `Score: ${matcherV2State.score}/${matcherV2State.idx + 1}`;

  // Visually mark slots
  const slots = document.querySelectorAll('.matcher-slot');
  slots.forEach(slot => {
    const slotLabel = slot.querySelector('.matcher-slot__label').textContent.trim();
    slot.style.pointerEvents = 'none';
    if (slotLabel === ch.ans) slot.classList.add('slot-correct');
    else if (slotLabel === chosen && chosen !== ch.ans) slot.classList.add('slot-wrong');
  });

  // Stick the scenario card onto the correct slot
  const sticky = document.getElementById('matcherSticky');
  if (sticky) {
    sticky.draggable = false;
    sticky.classList.remove('dragging');
    sticky.style.opacity = '0.6';
    sticky.querySelector('.matcher-sticky__sub').textContent = correct ? '✓ Correct slot!' : `✗ Should be: ${ch.ans}`;
  }

  const res = document.getElementById('matcherResult');
  res.className = `lab-result-box show ${correct ? 'correct' : 'wrong'}`;
  res.innerHTML = `
    <div class="lab-result-box__title">${correct ? '✅ Correct!' : '❌ Wrong slot'}</div>
    <div class="lab-result-box__text"><strong>${ch.ans}</strong> — ${ch.exp}</div>`;

  // Show follow-up bonus question
  setTimeout(() => showMatcherFollowUp(), 800);
}

function showMatcherFollowUp() {
  const ch = MATCHER_CHALLENGES_V2[matcherV2State.idx];
  const fq = ch.followUp;
  if (!fq) { showMatcherNextBtn(); return; }

  matcherV2State.showingFollowUp = true;

  const bonus = document.createElement('div');
  bonus.className = 'matcher-followup';
  bonus.id = 'matcherFollowUp';
  bonus.innerHTML = `
    <div class="matcher-followup__label">🎯 Bonus Question</div>
    <div class="matcher-followup__q">${labEsc(fq.q)}</div>
    <div class="matcher-followup__opts">
      ${fq.opts.map((opt, i) => `
        <button class="matcher-followup__btn" onclick="checkMatcherFollowUp(${i}, this)">
          <span class="matcher-followup__letter">${String.fromCharCode(65+i)}</span>${labEsc(opt)}
        </button>`).join('')}
    </div>`;

  document.getElementById('matcherResult').appendChild(bonus);
}

function checkMatcherFollowUp(chosen, btn) {
  const ch = MATCHER_CHALLENGES_V2[matcherV2State.idx];
  const fq = ch.followUp;
  const correct = chosen === fq.ans;

  document.querySelectorAll('.matcher-followup__btn').forEach((b, i) => {
    b.disabled = true;
    if (i === fq.ans) b.classList.add('fq-correct');
    else if (i === chosen && !correct) b.classList.add('fq-wrong');
  });

  const expEl = document.createElement('div');
  expEl.style.cssText = 'margin-top:10px;padding:10px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:8px;font-size:12px;color:var(--soft)';
  expEl.innerHTML = `💡 ${labEsc(fq.exp)}`;
  document.getElementById('matcherFollowUp').appendChild(expEl);

  showMatcherNextBtn();
}

function showMatcherNextBtn() {
  const nextBtn = document.getElementById('matcherNextBtn');
  if (nextBtn) nextBtn.style.display = 'inline-flex';
}

function nextMatcher() {
  matcherV2State.idx++;
  if (matcherV2State.idx >= MATCHER_CHALLENGES_V2.length) {
    document.getElementById('matcherResult').innerHTML = `
      <div class="lab-result-box show correct">
        <div class="lab-result-box__title">🏆 All Scenarios Complete!</div>
        <div class="lab-result-box__text">Final Score: <strong>${matcherV2State.score} / ${MATCHER_CHALLENGES_V2.length}</strong></div>
      </div>`;
    document.getElementById('matcherNextBtn').style.display = 'none';
    return;
  }
  renderMatcherV2();
}


/* ─────────────────────────────────────────────────────
   MODE 4 — SCENARIO SOLVER (Detective Case File)
───────────────────────────────────────────────────── */
const DETECTIVE_CASES = [
  {
    title:"Case #001 — The Invisible Save",
    brief:"A business user reports: 'I click Save and nothing happens. No error, no confirmation. The page just sits there.'",
    correctCause:"Permission List grants Display Only access",
    tools:[
      { id:"sql_trace",    label:"🔍 Check SQL Trace",         clue:"SQL Trace shows zero INSERT or UPDATE statements during the save attempt. The DB is never touched.", isRed:false },
      { id:"permission",   label:"🔒 Check Permission List",   clue:"Permission List for this role has the component set to 'Display Only'. Save button is disabled by the framework.", isRed:false },
      { id:"peoplecode",   label:"💻 Review PeopleCode",       clue:"No Error() or Warning() calls exist in SaveEdit. PeopleCode is not blocking the save.", isRed:true  },
      { id:"app_server",   label:"⚙️ Check App Server Load",   clue:"App Server load is 12%. CPU and memory are nominal. No server-side bottleneck.", isRed:true  },
      { id:"run_control",  label:"📋 Check Run Control",       clue:"This is an online component, not a batch process. Run Controls are not relevant here.", isRed:true  },
      { id:"db_locks",     label:"🔐 Check DB Locks",          clue:"No active DB locks on this table. Other users are saving successfully.", isRed:true  }
    ],
    rootCauses:[
      "PeopleCode Error() in SaveEdit is blocking the save",
      "Permission List grants Display Only access",
      "App Server is overloaded",
      "Database deadlock is occurring"
    ],
    correctIdx:1,
    explanation:"Display Only access mode prevents any saves — the Save button is disabled by the Component Processor before PeopleCode even runs. The SQL Trace clue (zero writes) and Permission List clue (Display Only) together confirm this.",
    requiredClues:["sql_trace","permission"]
  },
  {
    title:"Case #002 — The Phantom Rows",
    brief:"PS Query joining PS_PERSONAL_DATA and PS_JOB returns 14 rows for Employee E00001. The employee has only 1 active job.",
    correctCause:"Missing effective dating on PS_JOB in the query",
    tools:[
      { id:"query_sql",    label:"📊 View Generated SQL",      clue:"Generated SQL: SELECT PD.NAME, J.DEPTID FROM PS_PERSONAL_DATA PD, PS_JOB J WHERE PD.EMPLID = J.EMPLID. No EFFDT filter.", isRed:false },
      { id:"job_rows",     label:"🗄️ Count PS_JOB Rows",      clue:"SELECT COUNT(*) FROM PS_JOB WHERE EMPLID='E00001' returns 14. This employee has 14 historical job rows.", isRed:false },
      { id:"index_check",  label:"📈 Check DB Indexes",        clue:"All indexes on PS_JOB are present and in good shape. Index is not the issue.", isRed:true  },
      { id:"peoplecode",   label:"💻 Review PeopleCode",       clue:"This is a PS Query — no PeopleCode is involved. PeopleCode is not relevant here.", isRed:true  },
      { id:"security",     label:"🔒 Check Row Security",      clue:"Security is configured correctly. The user is authorised to see this employee.", isRed:true  },
      { id:"join_keys",    label:"🔗 Review Join Keys",        clue:"Join key is EMPLID only. PS_JOB also requires EFFDT and EFFSEQ to uniquely identify a row. The join produces a Cartesian product of job history.", isRed:false }
    ],
    rootCauses:[
      "PS_JOB has duplicate data from a failed import",
      "Missing effective dating on PS_JOB in the query",
      "Row-level security is returning too many rows",
      "Database index is corrupt"
    ],
    correctIdx:1,
    explanation:"PS_JOB stores every job change ever made — 14 rows means 14 career changes. Without MAX(EFFDT) ≤ today, the query does a Cartesian join: 1 personal data row × 14 job rows = 14 results. The SQL Trace, row count, and join key clues all confirm this.",
    requiredClues:["query_sql","job_rows","join_keys"]
  },
  {
    title:"Case #003 — The Upgrade Casualty",
    brief:"After a PeopleTools upgrade, a customised component no longer validates salary ranges. The fix worked perfectly in DEV for 2 years.",
    correctCause:"Oracle overwrote the customised delivered object",
    tools:[
      { id:"compare_tool", label:"🔄 Run Compare Report",      clue:"App Designer Compare: delivered SaveEdit PeopleCode is newer than the database version. Oracle's version has replaced yours.", isRed:false },
      { id:"peoplecode",   label:"💻 Check Current PeopleCode",clue:"Current SaveEdit code is Oracle's default with no custom logic. Your validation is completely gone.", isRed:false },
      { id:"permission",   label:"🔒 Check Permission Lists",  clue:"Permission Lists are correct. The user has update access to the component.", isRed:true  },
      { id:"app_server",   label:"⚙️ Check App Server Config", clue:"App Server is running on the new PeopleTools version correctly. Config is not the issue.", isRed:true  },
      { id:"project",      label:"📦 Check Migration Project", clue:"The upgrade migration project included the delivered component. Custom changes were overwritten during the apply.", isRed:false },
      { id:"event_map",    label:"🎯 Check Event Mapping",     clue:"No Event Mapping exists for this component. The customisation was made directly on the delivered object — not upgrade-safe.", isRed:false }
    ],
    rootCauses:[
      "PeopleCode syntax error introduced during upgrade",
      "Oracle overwrote the customised delivered object",
      "Permission List was reset during upgrade",
      "Database table structure changed"
    ],
    correctIdx:1,
    explanation:"Directly customising delivered objects is upgrade-unsafe. When Oracle applies a PeopleTools patch, it overwrites delivered components. The Compare Report and current PeopleCode clues confirm the custom logic is gone. Fix: use Event Mapping (PT 8.55+) which stores your code in a separate custom App Package — untouched by upgrades.",
    requiredClues:["compare_tool","peoplecode","event_map"]
  },
  {
    title:"Case #004 — The Batch Ghost",
    brief:"A nightly payroll AE batch runs, shows Success status in Process Monitor, but no employees are processed. Run time: 3 seconds (should be 8 minutes).",
    correctCause:"Run Control parameters are missing or incorrect",
    tools:[
      { id:"process_log",  label:"📄 Review Process Log",      clue:"AE log: 'No rows selected for processing. Exiting.' Total rows processed: 0. AE completed successfully but found nothing to do.", isRed:false },
      { id:"run_control",  label:"📋 Inspect Run Control",     clue:"Run Control for this process: Pay Period End Date = blank, Pay Group = blank. Empty criteria = no employees match.", isRed:false },
      { id:"app_server",   label:"⚙️ Check App Server",        clue:"App Server is healthy. 8 processes available. Not a capacity issue.", isRed:true  },
      { id:"db_tables",    label:"🗄️ Check PS_JOB Data",       clue:"PS_JOB has 12,450 active employees. Data exists. The batch just isn't querying it.", isRed:true  },
      { id:"ae_code",      label:"💻 Review AE PeopleCode",    clue:"AE SQL uses :Pay_Period and :Pay_Group bind variables from the Run Control. Logic is correct — parameters are just empty.", isRed:false },
      { id:"scheduler",    label:"⏰ Check Recurrence",        clue:"Process is scheduled correctly. It fired at the right time. The problem is what it was given to process, not when it ran.", isRed:true  }
    ],
    rootCauses:[
      "Application Engine has a SQL bug",
      "Run Control parameters are missing or incorrect",
      "Process Scheduler server is down",
      "PS_JOB data was deleted"
    ],
    correctIdx:1,
    explanation:"'No rows selected' is the classic Run Control symptom. The AE log, Run Control inspection, and AE code clues together confirm: the batch has correct logic but empty search criteria means zero rows match. The user submitted the job with blank Pay Period and Pay Group.",
    requiredClues:["process_log","run_control","ae_code"]
  },
  {
    title:"Case #005 — The Missing Component",
    brief:"A developer successfully migrates a custom component to QA. The component works when accessed via URL directly, but it doesn't appear in any menu or homepage tile.",
    correctCause:"Portal CREF was not included in the migration project",
    tools:[
      { id:"permission",   label:"🔒 Check Permission Lists",  clue:"The component's Permission List is correctly assigned to the test user's Role. Access is granted.", isRed:true  },
      { id:"direct_url",   label:"🌐 Test Direct URL Access",  clue:"Accessing via direct URL works perfectly. Component loads, saves, all PeopleCode fires correctly.", isRed:true  },
      { id:"portal",       label:"🗂️ Check Portal Registry",   clue:"Portal Registry in QA shows no CREF entry for this component. The navigation object was never migrated.", isRed:false },
      { id:"project",      label:"📦 Review Migration Project",clue:"App Designer project contains: Record, Page, Component, Menu. No Portal Objects (Content References) were added to the project.", isRed:false },
      { id:"app_server",   label:"⚙️ Check App Server",        clue:"App Server is healthy. Unrelated to navigation not appearing.", isRed:true  },
      { id:"tiles",        label:"🏠 Check Homepage Tiles",    clue:"Tile configuration in the Fluid Homepage references a CREF that doesn't exist in QA. Tile is present but broken — missing CREF target.", isRed:false }
    ],
    rootCauses:[
      "Component PeopleCode has a syntax error",
      "Portal CREF was not included in the migration project",
      "App Server cache needs to be cleared",
      "Permission List is missing the component"
    ],
    correctIdx:1,
    explanation:"In PeopleSoft, Application Designer objects (Records, Pages, Components) and Portal objects (CREFs, Homepage Tiles) are SEPARATE migration artifacts. The Portal Registry, Project, and Tiles clues all point to the same thing: the CREF was never added to the migration project.",
    requiredClues:["portal","project","tiles"]
  },
  {
    title:"Case #006 — The Security Leak",
    brief:"After go-live, HR managers report they can see ALL employees globally — including those in other countries and different pay grades. The component was built with row-level security configured.",
    correctCause:"Search Record is a base table (PS_JOB) instead of a security view",
    tools:[
      { id:"security_tree",label:"🌳 Check Security Tree",     clue:"Department Security Tree is correctly configured. All departments are properly assigned to managers.", isRed:true  },
      { id:"search_record",label:"🗄️ Check Search Record",    clue:"Component Search Record is PS_JOB. This base table does not join with PS_SCRTY_TBL_DEPT — it bypasses all row-level security.", isRed:false },
      { id:"permission",   label:"🔒 Check Permission Lists",  clue:"Permission Lists are correctly set. The issue is not with object-level access — it's data-level filtering.", isRed:true  },
      { id:"security_view",label:"👁️ Check Security Views",   clue:"PS_JOB_SRCH_VW exists and correctly joins PS_JOB with PS_SCRTY_TBL_DEPT filtered by %OperatorClass. This is the correct Search Record to use.", isRed:false },
      { id:"peoplecode",   label:"💻 Review PeopleCode",       clue:"No PeopleCode modifying the search exists. The issue is structural — the Search Record definition.", isRed:true  },
      { id:"db_audit",     label:"📊 Run Audit Report",        clue:"Audit confirms users are seeing rows outside their security tree. Root cause must be in search/filter configuration.", isRed:false }
    ],
    rootCauses:[
      "PeopleCode is removing the security filter",
      "Search Record is a base table (PS_JOB) instead of a security view",
      "Security Tree needs to be rebuilt",
      "Permission List has too many roles"
    ],
    correctIdx:1,
    explanation:"The most common PeopleSoft security vulnerability: using base tables (PS_JOB, PS_PERSONAL_DATA) as Search Records in custom components. Base tables have no security filter. PS_JOB_SRCH_VW joins with PS_SCRTY_TBL_DEPT to return only authorised rows. Always use security views as Search Records.",
    requiredClues:["search_record","security_view","db_audit"]
  }
];

let detectiveState = {
  idx: 0, score: 0,
  usedTools: new Set(),
  cluesFound: [],
  diagnosed: false
};

function initScenario() {
  detectiveState = { idx: 0, score: 0, usedTools: new Set(), cluesFound: [], diagnosed: false };
  renderDetectiveCase();
}

function renderDetectiveCase() {
  const cas = DETECTIVE_CASES[detectiveState.idx];
  detectiveState.usedTools = new Set();
  detectiveState.cluesFound = [];
  detectiveState.diagnosed = false;

  document.getElementById('scenarioCounter').textContent = `Case ${detectiveState.idx + 1} of ${DETECTIVE_CASES.length}`;
  document.getElementById('scenarioScore').textContent = `Score: ${detectiveState.score}/${detectiveState.idx}`;

  // Replace static DOM with detective UI
  const container = document.querySelector('#labScenario .lab-matcher');
  if (!container) return;

  container.innerHTML = `
    <button class="lab-debug__back" onclick="backToLab()">← Back to Lab</button>

    <div class="lab-debug__header">
      <div class="lab-debug__tag" style="color:var(--gold)">🔍 Scenario Solver — Detective Mode</div>
      <h2 class="lab-debug__title">${labEsc(cas.title)}</h2>
      <p class="lab-debug__sub">Investigate the incident. Use your toolbox to gather clues, then diagnose the root cause. Fewer tool checks = higher detective rating.</p>
    </div>

    <div class="lab-debug__meta">
      <span class="lab-debug__counter" id="scenarioCounter">Case ${detectiveState.idx + 1} of ${DETECTIVE_CASES.length}</span>
      <span id="scenarioScore" style="font-family:var(--fm);font-size:12px;color:var(--green)">Score: ${detectiveState.score}/${detectiveState.idx}</span>
    </div>

    <!-- Case File -->
    <div class="detective-casefile">
      <div class="detective-casefile__header">
        <span class="detective-badge">📁 CASE FILE</span>
        <span class="detective-case-id">${labEsc(cas.title)}</span>
      </div>
      <div class="detective-brief">${labEsc(cas.brief)}</div>
    </div>

    <!-- Clue Board -->
    <div class="detective-board">
      <div class="detective-board__title">📋 Investigation Board <span class="detective-clue-count" id="clueCount">0 clues found</span></div>
      <div class="detective-clues" id="detectiveClues">
        <div class="detective-clues__empty">Use the toolbox below to investigate. Each tool reveals a clue.</div>
      </div>
    </div>

    <!-- Toolbox -->
    <div class="detective-toolbox">
      <div class="detective-toolbox__title">🧰 Toolbox — Click to Investigate</div>
      <div class="detective-tools" id="detectiveTools">
        ${cas.tools.map(tool => `
          <button class="detective-tool-btn" id="dtool-${tool.id}" onclick="useDetectiveTool('${tool.id}')">
            ${labEsc(tool.label)}
          </button>`).join('')}
      </div>
    </div>

    <!-- Diagnosis -->
    <div class="detective-diagnosis" id="detectiveDiagnosis" style="display:none">
      <div class="detective-diagnosis__title">🎯 File Your Report — What is the root cause?</div>
      <div class="detective-diagnosis__opts">
        ${cas.rootCauses.map((cause, i) => `
          <button class="detective-cause-btn" onclick="fileDiagnosis(${i}, this)">
            <span class="detective-cause-num">${i+1}</span>
            ${labEsc(cause)}
          </button>`).join('')}
      </div>
    </div>

    <div class="lab-result-box" id="scenarioResult"></div>
    <div style="margin-top:14px;display:flex;gap:10px">
      <button class="btn btn--ghost btn--sm" id="scenarioNextBtn" style="display:none" onclick="nextDetectiveCase()">Next Case →</button>
    </div>`;
}

function useDetectiveTool(toolId) {
  if (detectiveState.usedTools.has(toolId)) return;
  detectiveState.usedTools.add(toolId);

  const cas = DETECTIVE_CASES[detectiveState.idx];
  const tool = cas.tools.find(t => t.id === toolId);
  if (!tool) return;

  // Disable the button
  const btn = document.getElementById(`dtool-${toolId}`);
  if (btn) {
    btn.disabled = true;
    btn.classList.add(tool.isRed ? 'tool-red-herring' : 'tool-used');
    btn.innerHTML = (tool.isRed ? '🚫 ' : '✓ ') + btn.innerHTML.replace(/^[✓🚫]\s*/, '');
  }

  // Track real clues
  if (!tool.isRed) detectiveState.cluesFound.push(toolId);

  // Add clue card to board
  const cluesEl = document.getElementById('detectiveClues');
  const empty = cluesEl.querySelector('.detective-clues__empty');
  if (empty) empty.remove();

  const card = document.createElement('div');
  card.className = `detective-clue-card ${tool.isRed ? 'clue-red-herring' : 'clue-evidence'}`;
  card.innerHTML = `
    <div class="clue-card__source">${labEsc(tool.label)}</div>
    <div class="clue-card__text">${labEsc(tool.clue)}</div>
    <div class="clue-card__tag">${tool.isRed ? '🚫 Red Herring' : '🔍 Evidence'}</div>`;
  cluesEl.appendChild(card);

  // Update clue count
  const countEl = document.getElementById('clueCount');
  if (countEl) countEl.textContent = `${detectiveState.cluesFound.length} evidence clue${detectiveState.cluesFound.length !== 1 ? 's' : ''} found`;

  // Show diagnosis panel once enough real clues found
  const required = cas.requiredClues;
  const foundRequired = required.every(r => detectiveState.usedTools.has(r));
  if (foundRequired) {
    const diag = document.getElementById('detectiveDiagnosis');
    if (diag) {
      diag.style.display = 'block';
      diag.scrollIntoView({ behavior:'smooth', block:'nearest' });
    }
  }
}

function fileDiagnosis(chosen, btn) {
  if (detectiveState.diagnosed) return;
  detectiveState.diagnosed = true;

  const cas = DETECTIVE_CASES[detectiveState.idx];
  const correct = chosen === cas.correctIdx;
  if (correct) detectiveState.score++;

  document.getElementById('scenarioScore').textContent = `Score: ${detectiveState.score}/${detectiveState.idx + 1}`;

  // Mark buttons
  document.querySelectorAll('.detective-cause-btn').forEach((b, i) => {
    b.disabled = true;
    if (i === cas.correctIdx) b.classList.add('cause-correct');
    else if (i === chosen && !correct) b.classList.add('cause-wrong');
  });

  // Detective rating
  const toolsUsed = detectiveState.usedTools.size;
  const totalTools = cas.tools.length;
  let rating, ratingColor;
  if (toolsUsed <= 3) { rating = '🏆 Master Detective — Solved with minimal investigation!'; ratingColor = 'var(--green)'; }
  else if (toolsUsed <= 4) { rating = '🥈 Good Detective — Efficient investigation.'; ratingColor = 'var(--gold)'; }
  else { rating = '📚 Trainee Detective — You\'ll get faster with practice.'; ratingColor = 'var(--amber)'; }

  const res = document.getElementById('scenarioResult');
  res.className = `lab-result-box show ${correct ? 'correct' : 'wrong'}`;
  res.innerHTML = `
    <div class="lab-result-box__title">${correct ? '✅ Case Solved!' : '❌ Wrong Diagnosis'}</div>
    <div class="lab-result-box__text">${cas.explanation}</div>
    <div class="detective-rating" style="color:${ratingColor};margin-top:12px;font-family:var(--fm);font-size:12px">
      ${rating} (${toolsUsed}/${totalTools} tools used)
    </div>`;

  const nextBtn = document.getElementById('scenarioNextBtn');
  if (nextBtn && detectiveState.idx < DETECTIVE_CASES.length - 1) {
    nextBtn.style.display = 'inline-flex';
  } else if (nextBtn) {
    res.innerHTML += `<br><strong style="color:var(--gold)">🎉 All cases closed! Score: ${detectiveState.score}/${DETECTIVE_CASES.length}</strong>`;
  }
}

function nextDetectiveCase() {
  detectiveState.idx++;
  renderDetectiveCase();
}

// Compat alias used by existing HTML onclick
function nextScenario() { nextDetectiveCase(); }


/* ─────────────────────────────────────────────────────
   LAB ROUTER — replaces the original openLabMode
───────────────────────────────────────────────────── */
function openLabMode(mode) {
  document.getElementById('labHome').style.display = 'none';
  const map = {
    debug:       'labDebug',
    eventflow:   'labEventFlow',
    matcher:     'labMatcher',
    scenario:    'labScenario',
    appdesigner: 'labAppDesigner',
    pssim:       'labPSSim'
  };
  Object.values(map).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById(map[mode]);
  if (target) { target.style.display = 'block'; window.scrollTo(0, 0); }

  if (mode === 'debug')       initDebug();
  if (mode === 'eventflow')   initEventFlow();
  if (mode === 'matcher')     initMatcher();
  if (mode === 'scenario')    initScenario();
  if (mode === 'appdesigner') { if(typeof initAppDesigner==='function') initAppDesigner(); }
  if (mode === 'pssim')       { if(typeof initPSSim==='function') initPSSim(); }
}
