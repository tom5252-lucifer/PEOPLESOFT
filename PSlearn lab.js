/* PSLearn Lab Simulator */

/* ── pslearn-debug.js ── */
/* =====================================================
   PSLearn — Debug Mode
   6 PeopleCode bug challenges
   Click buggy line · Hint tokens · Show fix diff
   ===================================================== */

const DEBUG_CHALLENGES = [
  {
    title:"N+1 Query in RowInit",
    symptom:"HR component takes 45 seconds to load for a manager with 200 direct reports.",
    bugLine:7,
    hint:"How many times does SQLExec on line 7 execute when there are 200 rows?",
    explanation:"Line 7 — SQLExec inside a RowInit loop creates an N+1 query problem. With 200 rows, this fires 200 separate DB calls. Fix: pre-fetch all dept names once in PostBuild using CreateSQL into an object, then look up from memory inside RowInit.",
    fixedLine:"    SQLExec('SELECT DESCR FROM PS_DEPT_TBL WHERE DEPTID=:1', &deptMap.Get(&rec.DEPTID.Value), &dn);",
    fixHint:"Move the SQL OUT of the loop. Pre-fetch all dept names at PostBuild level.",
    code:[
      {n:1,t:"/* RowInit — Initialize department description */"},
      {n:2,t:"Function Init()"},
      {n:3,t:"  Local Rowset &rs;"},
      {n:4,t:"  &rs = GetRowset(Scroll.JOB);"},
      {n:5,t:"  For &i = 1 To &rs.ActiveRowCount"},
      {n:6,t:"    Local Record &rec = &rs.GetRow(&i).GetRecord(Record.JOB);"},
      {n:7,t:"    SQLExec('SELECT DESCR FROM PS_DEPT_TBL WHERE DEPTID=:1', &rec.DEPTID.Value, &dn);"},
      {n:8,t:"    &rec.DEPTID_DESCR.Value = &dn;"},
      {n:9,t:"  End-For;"},
      {n:10,t:"End-Function;"}
    ]
  },
  {
    title:"Variable Scope — Lost Between Events",
    symptom:"Flag set in PostBuild is always empty when checked in SaveEdit. Save never blocked.",
    bugLine:2,
    hint:"Local variables only exist for ONE program execution. PostBuild and SaveEdit are completely separate executions.",
    explanation:"Line 2 — Local scope means &isNew is destroyed when PostBuild finishes. SaveEdit is a separate execution — &isNew is empty. Fix: declare as Component Boolean &isNew so it persists across the entire transaction.",
    fixedLine:"Component Boolean &isNew;",
    fixHint:"Change 'Local' to 'Component' so the flag survives between events.",
    code:[
      {n:1,t:"/* PostBuild */"},
      {n:2,t:"Local Boolean &isNew;"},
      {n:3,t:"If JOB.ACTION.Value = 'HIR' Then"},
      {n:4,t:"   &isNew = True;"},
      {n:5,t:"End-If;"},
      {n:6,t:""},
      {n:7,t:"/* SaveEdit — checks the flag */"},
      {n:8,t:"If &isNew Then"},
      {n:9,t:"   Error 'Dept required for new hire';"},
      {n:10,t:"End-If;"}
    ]
  },
  {
    title:"Missing Effective Dating",
    symptom:"Query returns 15 rows for one employee. DEPTID is from 8 years ago.",
    bugLine:2,
    hint:"PS_JOB stores every job change ever made. How do you get ONLY the current row?",
    explanation:"Line 2 — No effective dating WHERE clause. PS_JOB has 20+ rows per employee across their career. Fix: add WHERE EFFDT = (SELECT MAX(EFFDT) FROM PS_JOB J2 WHERE J2.EMPLID = J1.EMPLID AND J2.EFFDT <= %CurrentDateIn).",
    fixedLine:"SQLExec('SELECT DEPTID FROM PS_JOB WHERE EMPLID=:1 AND EFFDT=(SELECT MAX(E) FROM PS_JOB WHERE EMPLID=:1 AND EFFDT<=%CurrentDateIn)', PERSONAL_DATA.EMPLID.Value, &dept);",
    fixHint:"Add MAX(EFFDT) <= today subquery to get only the current effective row.",
    code:[
      {n:1,t:"Local string &dept;"},
      {n:2,t:"SQLExec('SELECT DEPTID FROM PS_JOB WHERE EMPLID=:1',"},
      {n:3,t:"  PERSONAL_DATA.EMPLID.Value, &dept);"},
      {n:4,t:"JOB.DEPTID.Value = &dept;"}
    ]
  },
  {
    title:"Wrong Event for Defaulting",
    symptom:"DEPTID defaults correctly on new records but clears when user changes BUSINESS_UNIT.",
    bugLine:1,
    hint:"FieldChange fires when the USER changes a field. When should a default be set on component load?",
    explanation:"Line 1 — Wrong event. FieldChange fires only when the user actively changes BUSINESS_UNIT. For component-load defaulting use FieldDefault (fires before user sees the field) or PostBuild.",
    fixedLine:"/* FieldDefault on DEPTID */",
    fixHint:"Move this logic to FieldDefault event on DEPTID, not FieldChange on BUSINESS_UNIT.",
    code:[
      {n:1,t:"/* FieldChange on BUSINESS_UNIT */"},
      {n:2,t:"If JOB.DEPTID.Value = '' Then"},
      {n:3,t:"   JOB.DEPTID.Value = 'CORP';"},
      {n:4,t:"End-If;"}
    ]
  },
  {
    title:"Error() in SavePostChange",
    symptom:"Error message appears but data is already saved to the database. User is confused.",
    bugLine:1,
    hint:"Can you cancel a save AFTER the database commit has already happened?",
    explanation:"Line 1 — Wrong event. SavePostChange fires AFTER the DB commit is complete. Error() here is silently ignored — data is already saved. Move the validation to SaveEdit which fires BEFORE the commit.",
    fixedLine:"/* SaveEdit — fires BEFORE DB commit */",
    fixHint:"Move Error() validation to SaveEdit — it's the only event that can block a save.",
    code:[
      {n:1,t:"/* SavePostChange */"},
      {n:2,t:"If JOB.ANNUAL_RT.Value > 500000 Then"},
      {n:3,t:"   Error 'Salary exceeds maximum. Save cancelled.';"},
      {n:4,t:"End-If;"}
    ]
  },
  {
    title:"Hardcoded Effective Date",
    symptom:"Report always shows January 2020 data even though it's 2025. Historical rows returned.",
    bugLine:3,
    hint:"What happens when you hardcode a date instead of using %CurrentDateIn?",
    explanation:"Line 3 — Hardcoded date '2020-01-01' means the query ALWAYS fetches data as of that date. Fix: replace with %CurrentDateIn which resolves to today's date in the correct format for your database.",
    fixedLine:"WHERE J.EMPLID = :1 AND J.EFFDT = (SELECT MAX(EFFDT) FROM PS_JOB WHERE EMPLID = J.EMPLID AND EFFDT <= %CurrentDateIn)",
    fixHint:"Replace the hardcoded date with %CurrentDateIn — the PS Meta-SQL for today's date.",
    code:[
      {n:1,t:"SQLExec('SELECT DEPTID, COMPRATE"},
      {n:2,t:"         FROM PS_JOB J"},
      {n:3,t:"         WHERE J.EMPLID = :1 AND J.EFFDT = ''2020-01-01''',"},
      {n:4,t:"  PERSONAL_DATA.EMPLID.Value, &dept, &comp);"}
    ]
  }
];

let debugState = { idx:0, selected:null, score:0, hints:3 };

function initDebug() {
  debugState = { idx:0, selected:null, score:0, hints:3 };
  renderDebugChallenge();
}

function renderDebugChallenge() {
  const ch = DEBUG_CHALLENGES[debugState.idx];
  debugState.selected = null;

  document.getElementById('debugCounter').textContent = `Challenge ${debugState.idx+1} of ${DEBUG_CHALLENGES.length}`;
  document.getElementById('debugScore').textContent   = `Score: ${debugState.score}`;

  document.getElementById('debugScenario').innerHTML = `
    <div class="dbg-symptom-label">🏥 SYMPTOM</div>
    <div class="dbg-symptom-text">${dEsc(ch.symptom)}</div>
    <div class="dbg-challenge-title">${dEsc(ch.title)}</div>`;

  document.getElementById('debugCode').innerHTML = ch.code.map(l => `
    <div class="lab-code-line" id="dline-${l.n}" onclick="selectDebugLine(${l.n})">
      <span class="lab-code-linenum">${l.n}</span>
      <span class="lab-code-text" id="dtext-${l.n}">${dEsc(l.t)}</span>
    </div>`).join('');

  const hint = document.getElementById('debugHint');
  hint.textContent = '';
  hint.className = 'dbg-hint-bar';

  document.getElementById('debugActions').innerHTML = `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:16px 0">
      <button class="btn btn--gold btn--sm" id="debugCheckBtn" onclick="checkDebugAnswer()" disabled>✓ Check Answer</button>
      <button class="btn btn--ghost btn--sm" onclick="showDebugHint()">💡 Hint <span class="hint-token" id="hintCount">${debugState.hints}</span></button>
      <button class="btn btn--ghost btn--sm" id="debugFixBtn" style="display:none" onclick="showDebugFix()">🔧 Show Fix</button>
      <button class="btn btn--ghost btn--sm" id="debugNextBtn" style="display:none" onclick="nextDebugChallenge()">Next →</button>
    </div>`;

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
  const hint = document.getElementById('debugHint');
  hint.innerHTML = `<span style="color:var(--gold)">💡</span> ${dEsc(ch.hint)}`;
}

function checkDebugAnswer() {
  const ch = DEBUG_CHALLENGES[debugState.idx];
  const correct = debugState.selected === ch.bugLine;
  if (correct) debugState.score++;

  document.getElementById('debugScore').textContent = `Score: ${debugState.score}`;
  document.querySelectorAll('.lab-code-line').forEach(l => l.style.pointerEvents = 'none');
  document.getElementById(`dline-${ch.bugLine}`).classList.add('correct-line');
  if (!correct && debugState.selected)
    document.getElementById(`dline-${debugState.selected}`).classList.add('wrong-line');

  const res = document.getElementById('debugResult');
  res.className = `lab-result-box show ${correct ? 'correct' : 'wrong'}`;
  res.innerHTML = `
    <div class="lab-result-box__title">${correct ? '✅ Correct — Bug Found!' : '❌ Wrong Line'}</div>
    <div class="lab-result-box__text"><strong>Bug on line ${ch.bugLine}:</strong> ${dEsc(ch.explanation)}</div>`;

  document.getElementById('debugCheckBtn').style.display = 'none';
  document.getElementById('debugFixBtn').style.display = 'inline-flex';
  if (debugState.idx < DEBUG_CHALLENGES.length - 1)
    document.getElementById('debugNextBtn').style.display = 'inline-flex';
  else
    res.innerHTML += `<br><strong style="color:var(--gold)">🎉 All done! Score: ${debugState.score}/${DEBUG_CHALLENGES.length}</strong>`;
}

function showDebugFix() {
  const ch = DEBUG_CHALLENGES[debugState.idx];
  const lineEl = document.getElementById(`dtext-${ch.bugLine}`);
  if (!lineEl) return;
  const orig = ch.code.find(l => l.n === ch.bugLine)?.t || '';
  lineEl.innerHTML = `<del style="color:var(--red);opacity:.6">${dEsc(orig)}</del><span style="color:var(--green)"> → ${dEsc(ch.fixedLine)}</span>`;
  lineEl.parentElement.classList.add('correct-line');

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

function dEsc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }


/* ── pslearn-eventflow.js ── */
/* =====================================================
   PSLearn — Event Flow Trainer
   4 inject-mode cases
   Drag missing event into broken pipeline · Simulate animation
   ===================================================== */

const EF_INJECT_CHALLENGES = [
  {
    name:"PostBuild Is Missing",
    description:"A developer's component loads with all fields visible even though they should be hidden for read-only users. The show/hide logic exists but never runs. One critical event is missing from the pipeline.",
    scenario:"Show/hide logic in PostBuild never fires. Fields always visible.",
    correctFlow:["SearchInit","RowSelect","RowInit","FieldDefault","FieldFormula","PostBuild","Activate"],
    brokenFlow: ["SearchInit","RowSelect","RowInit","FieldDefault","FieldFormula","Activate"],
    missingEvent:"PostBuild",
    missingPosition:5,
    phaseMap:{SearchInit:"load",RowSelect:"load",RowInit:"load",FieldDefault:"load",FieldFormula:"load",PostBuild:"load",Activate:"interact"},
    explanation:"PostBuild fires once after the entire component is fully loaded — it's the correct place for show/hide logic. Without it, page configuration code never runs."
  },
  {
    name:"SaveEdit Removed",
    description:"After a code cleanup, salaries over $500,000 are being saved without any error. The validation rule exists in PeopleCode but never fires. A critical save-sequence event was deleted.",
    scenario:"Salary validation exists in PeopleCode but save is never blocked.",
    correctFlow:["SaveEdit","SavePreChange","WorkFlow","SavePostChange"],
    brokenFlow: ["SavePreChange","WorkFlow","SavePostChange"],
    missingEvent:"SaveEdit",
    missingPosition:0,
    phaseMap:{SaveEdit:"save",SavePreChange:"save",WorkFlow:"save",SavePostChange:"save"},
    explanation:"SaveEdit fires BEFORE the DB commit and is the ONLY place where Error() can block a save. Without it, validation rules can never stop bad data from being saved."
  },
  {
    name:"FieldDefault Skipped",
    description:"New employees are added but DEPTID always loads blank even though a default was configured. The default logic exists. One event in the load sequence was accidentally removed.",
    scenario:"New records always show blank DEPTID despite default PeopleCode existing.",
    correctFlow:["SearchInit","RowSelect","RowInit","FieldDefault","FieldFormula","PostBuild","Activate"],
    brokenFlow: ["SearchInit","RowSelect","RowInit","FieldFormula","PostBuild","Activate"],
    missingEvent:"FieldDefault",
    missingPosition:3,
    phaseMap:{SearchInit:"load",RowSelect:"load",RowInit:"load",FieldDefault:"load",FieldFormula:"load",PostBuild:"load",Activate:"interact"},
    explanation:"FieldDefault fires for every field that has no value during the component load sequence. It's the canonical event for setting default values before the user sees the page."
  },
  {
    name:"RowInit Deleted",
    description:"A performance fix accidentally deleted an entire event from the load sequence. Now derived fields (department descriptions) never populate when rows load into the grid.",
    scenario:"Department description fields are blank in the grid after a recent 'fix'.",
    correctFlow:["SearchInit","RowSelect","RowInit","FieldDefault","FieldFormula","PostBuild"],
    brokenFlow: ["SearchInit","RowSelect","FieldDefault","FieldFormula","PostBuild"],
    missingEvent:"RowInit",
    missingPosition:2,
    phaseMap:{SearchInit:"load",RowSelect:"load",RowInit:"load",FieldDefault:"load",FieldFormula:"load",PostBuild:"load"},
    explanation:"RowInit fires for every row loaded into the component buffer. Code to derive values, set display flags per row, or compute row-level fields belongs here."
  }
];

const EF_PHASE_COLORS = { load:'#22c55e', interact:'#f59e0b', save:'#ef4444' };
const EF_PHASE_LABELS = { load:'Load', interact:'User Action', save:'Save' };

let efState = { idx:0, pipeline:[], submitted:false };

/* ── INIT ──────────────────────────────────────────── */
function initEventFlow() {
  efState = { idx:0, pipeline:[], submitted:false };
  loadEFChallenge();
}

function loadEFChallenge() {
  const ch = EF_INJECT_CHALLENGES[efState.idx];
  efState.pipeline  = [...ch.brokenFlow];
  efState.submitted = false;

  document.getElementById('efChallengeName').textContent =
    `Case ${efState.idx+1} of ${EF_INJECT_CHALLENGES.length}: ${ch.name}`;

  const res = document.getElementById('efResult');
  res.classList.remove('show','correct','wrong');
  res.innerHTML = '';

  renderEFUI();
}

/* ── RENDER ────────────────────────────────────────── */
function renderEFUI() {
  const ch  = EF_INJECT_CHALLENGES[efState.idx];
  const con = document.getElementById('eventDragList');
  if (!con) return;

  con.innerHTML = `
    <div class="ef-inject-wrap">

      <!-- Scenario -->
      <div class="ef-scenario-box">
        <div class="ef-scenario-label">🏢 Incident Report</div>
        <div class="ef-scenario-text">${efEsc(ch.description)}</div>
        <div class="ef-scenario-symptom">⚠️ Symptom: ${efEsc(ch.scenario)}</div>
      </div>

      <!-- Event Bank -->
      <div class="ef-bank-label">🎒 Event Bank — drag the missing event into the pipeline below</div>
      <div class="ef-event-bank" id="efEventBank">
        <div class="ef-bank-chip"
          draggable="true"
          id="efBankChip"
          ondragstart="efBankDragStart(event)">
          <span class="ef-chip-dot" style="background:${EF_PHASE_COLORS[ch.phaseMap[ch.missingEvent]]}"></span>
          ${efEsc(ch.missingEvent)}
          <span class="ef-chip-phase">${EF_PHASE_LABELS[ch.phaseMap[ch.missingEvent]]}</span>
        </div>
        <div class="ef-bank-hint" id="efBankHint">← drag this into the pipeline below</div>
      </div>

      <!-- Pipeline -->
      <div class="ef-pipeline-label">📋 Current Pipeline (broken) — drop the missing event into the correct position</div>
      <div class="ef-pipeline" id="efPipeline">
        <div class="ef-drop-slot"
          ondragover="efSlotDragOver(event,0)"
          ondragleave="efSlotDragLeave(event)"
          ondrop="efSlotDrop(event,0)">
          <span class="ef-drop-hint">+ drop here</span>
        </div>
        ${efState.pipeline.map((ev, i) => `
          <div class="ef-pipeline-node ${ch.phaseMap[ev]||'load'}-node" id="efnode-${i}">
            <span class="ef-node-num">${i+1}</span>
            <span class="ef-node-name">${efEsc(ev)}</span>
            <span class="ef-node-phase" style="color:${EF_PHASE_COLORS[ch.phaseMap[ev]]||'#22c55e'}">${EF_PHASE_LABELS[ch.phaseMap[ev]]||'Load'}</span>
          </div>
          <div class="ef-drop-slot"
            ondragover="efSlotDragOver(event,${i+1})"
            ondragleave="efSlotDragLeave(event)"
            ondrop="efSlotDrop(event,${i+1})">
            <span class="ef-drop-hint">+ drop here</span>
          </div>`).join('')}
      </div>

      <!-- Actions -->
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px">
        <button class="btn btn--gold btn--sm" id="efCheckBtn" onclick="checkEFInject()">▶ Simulate Pipeline</button>
        <button class="btn btn--ghost btn--sm" onclick="resetEFInject()">↺ Reset</button>
        <button class="btn btn--ghost btn--sm" id="efNextBtn" style="display:none" onclick="nextEFInject()">Next Case →</button>
      </div>
    </div>`;
}

/* ── DRAG HANDLERS ─────────────────────────────────── */
function efBankDragStart(e) {
  e.dataTransfer.setData('text/plain','bank');
  setTimeout(() => {
    const chip = document.getElementById('efBankChip');
    if (chip) chip.classList.add('dragging');
  }, 0);
}

function efSlotDragOver(e, pos) {
  e.preventDefault();
  document.querySelectorAll('.ef-drop-slot').forEach(s => s.classList.remove('drag-over'));
  const slots = document.querySelectorAll('.ef-drop-slot');
  if (slots[pos]) slots[pos].classList.add('drag-over');
}

function efSlotDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function efSlotDrop(e, pos) {
  e.preventDefault();
  document.querySelectorAll('.ef-drop-slot').forEach(s => s.classList.remove('drag-over'));
  if (efState.submitted) return;

  const ch = EF_INJECT_CHALLENGES[efState.idx];
  if (efState.pipeline.includes(ch.missingEvent)) return; // already placed

  efState.pipeline.splice(pos, 0, ch.missingEvent);
  renderEFUI();

  // Disable chip after re-render
  const chip = document.getElementById('efBankChip');
  if (chip) {
    chip.style.opacity = '0.35';
    chip.style.pointerEvents = 'none';
    chip.draggable = false;
  }
  const hint = document.getElementById('efBankHint');
  if (hint) hint.textContent = '✓ Event placed — click Simulate Pipeline to check!';
}

/* ── CHECK ─────────────────────────────────────────── */
function checkEFInject() {
  const ch = EF_INJECT_CHALLENGES[efState.idx];
  if (!efState.pipeline.includes(ch.missingEvent)) {
    const res = document.getElementById('efResult');
    res.className = 'lab-result-box show wrong';
    res.innerHTML = '<div class="lab-result-box__title">⚠️ Place the event first!</div><div class="lab-result-box__text">Drag the missing event from the bank into the pipeline before simulating.</div>';
    return;
  }

  efState.submitted = true;
  const correct = JSON.stringify(efState.pipeline) === JSON.stringify(ch.correctFlow);

  // Animate nodes
  const nodes = document.querySelectorAll('.ef-pipeline-node');
  nodes.forEach((node, i) => {
    const ev  = efState.pipeline[i];
    const exp = ch.correctFlow[i];
    setTimeout(() => {
      node.classList.add('simulating');
      setTimeout(() => {
        node.classList.remove('simulating');
        if (ev === exp) node.classList.add('node-correct');
        else node.classList.add('node-wrong');
        if (ev === ch.missingEvent) node.classList.add('node-injected');
      }, 300 + i * 100);
    }, i * 120);
  });

  const delay = efState.pipeline.length * 120 + 500;
  setTimeout(() => {
    const res = document.getElementById('efResult');
    res.className = `lab-result-box show ${correct ? 'correct' : 'wrong'}`;

    if (correct) {
      res.innerHTML = `
        <div class="lab-result-box__title">✅ Pipeline Fixed!</div>
        <div class="lab-result-box__text">
          <strong>${efEsc(ch.missingEvent)}</strong> belongs at position ${ch.missingPosition+1}.<br>${efEsc(ch.explanation)}
        </div>
        <div class="ef-correct-flow" style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;align-items:center">
          ${ch.correctFlow.map((ev,i) => `<span class="ef-flow-chip ${ev===ch.missingEvent?'ef-chip-injected':''}">${i+1}. ${efEsc(ev)}</span>`).join(' → ')}
        </div>`;
    } else {
      const actual = efState.pipeline.indexOf(ch.missingEvent);
      res.innerHTML = `
        <div class="lab-result-box__title">❌ Wrong Position</div>
        <div class="lab-result-box__text">
          You placed <strong>${efEsc(ch.missingEvent)}</strong> at position ${actual+1}, but it should be position ${ch.missingPosition+1}.<br>${efEsc(ch.explanation)}
        </div>`;
    }

    document.getElementById('efCheckBtn').disabled = true;
    if (efState.idx < EF_INJECT_CHALLENGES.length - 1)
      document.getElementById('efNextBtn').style.display = 'inline-flex';
    else if (!correct)
      res.innerHTML += `<div style="margin-top:8px;color:var(--gold);font-family:var(--fm);font-size:12px">🎉 All cases complete!</div>`;
  }, delay);
}

function resetEFInject() {
  efState.submitted = false;
  loadEFChallenge();
}

function nextEFInject() {
  efState.idx++;
  loadEFChallenge();
}

/* ── COMPAT ALIASES ────────────────────────────────── */
function checkEventOrder() { checkEFInject(); }
function resetEventOrder()  { resetEFInject(); }
function nextEFChallenge()  { nextEFInject(); }

function efEsc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }


/* ── pslearn-matcher.js ── */
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


/* ── pslearn-scenario.js ── */
/* =====================================================
   PSLearn — Scenario Solver (Detective Mode)
   6 cases, toolbox, clues, red herrings,
   diagnosis panel, detective rating
   ===================================================== */

function dEsc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

const DETECTIVE_CASES = [
  {
    title:"Case #001 — The Invisible Save",
    brief:"A business user reports: 'I click Save and nothing happens. No error, no confirmation. The page just sits there.'",
    correctCause:"Permission List grants Display Only access",
    tools:[
      {id:"sql_trace",   label:"🔍 Check SQL Trace",        clue:"SQL Trace shows zero INSERT or UPDATE statements during the save attempt. The DB is never touched.",                          isRed:false},
      {id:"permission",  label:"🔒 Check Permission List",  clue:"Permission List for this role has the component set to 'Display Only'. Save button is disabled by the framework.",              isRed:false},
      {id:"peoplecode",  label:"💻 Review PeopleCode",      clue:"No Error() or Warning() calls exist in SaveEdit. PeopleCode is not blocking the save.",                                         isRed:true},
      {id:"app_server",  label:"⚙️ Check App Server Load",  clue:"App Server load is 12%. CPU and memory are nominal. No server-side bottleneck.",                                                 isRed:true},
      {id:"run_control", label:"📋 Check Run Control",      clue:"This is an online component, not a batch process. Run Controls are not relevant here.",                                          isRed:true},
      {id:"db_locks",    label:"🔐 Check DB Locks",         clue:"No active DB locks on this table. Other users are saving successfully.",                                                         isRed:true}
    ],
    rootCauses:["PeopleCode Error() in SaveEdit is blocking the save","Permission List grants Display Only access","App Server is overloaded","Database deadlock is occurring"],
    correctIdx:1,
    explanation:"Display Only access mode prevents any saves — the Save button is disabled by the Component Processor before PeopleCode even runs. The SQL Trace (zero writes) and Permission List (Display Only) clues together confirm this.",
    requiredClues:["sql_trace","permission"]
  },
  {
    title:"Case #002 — The Phantom Rows",
    brief:"PS Query joining PS_PERSONAL_DATA and PS_JOB returns 14 rows for Employee E00001. The employee has only 1 active job.",
    correctCause:"Missing effective dating on PS_JOB in the query",
    tools:[
      {id:"query_sql",   label:"📊 View Generated SQL",    clue:"Generated SQL: SELECT PD.NAME, J.DEPTID FROM PS_PERSONAL_DATA PD, PS_JOB J WHERE PD.EMPLID = J.EMPLID. No EFFDT filter.",      isRed:false},
      {id:"job_rows",    label:"🗄️ Count PS_JOB Rows",    clue:"SELECT COUNT(*) FROM PS_JOB WHERE EMPLID='E00001' returns 14. This employee has 14 historical job rows.",                          isRed:false},
      {id:"index_check", label:"📈 Check DB Indexes",      clue:"All indexes on PS_JOB are present and in good shape. Index is not the issue.",                                                    isRed:true},
      {id:"peoplecode",  label:"💻 Review PeopleCode",     clue:"This is a PS Query — no PeopleCode is involved. PeopleCode is not relevant here.",                                                isRed:true},
      {id:"security",    label:"🔒 Check Row Security",    clue:"Security is configured correctly. The user is authorised to see this employee.",                                                   isRed:true},
      {id:"join_keys",   label:"🔗 Review Join Keys",      clue:"Join key is EMPLID only. PS_JOB also requires EFFDT and EFFSEQ to uniquely identify a row. The join produces a Cartesian product.", isRed:false}
    ],
    rootCauses:["PS_JOB has duplicate data from a failed import","Missing effective dating on PS_JOB in the query","Row-level security is returning too many rows","Database index is corrupt"],
    correctIdx:1,
    explanation:"PS_JOB stores every job change ever made — 14 rows means 14 career changes. Without MAX(EFFDT) <= today, the query does a Cartesian join: 1 personal data row x 14 job rows = 14 results. The SQL Trace, row count, and join key clues all confirm this.",
    requiredClues:["query_sql","job_rows","join_keys"]
  },
  {
    title:"Case #003 — The Upgrade Casualty",
    brief:"After a PeopleTools upgrade, a customised component no longer validates salary ranges. The fix worked perfectly in DEV for 2 years.",
    correctCause:"Oracle overwrote the customised delivered object",
    tools:[
      {id:"compare_tool",label:"🔄 Run Compare Report",     clue:"App Designer Compare: delivered SaveEdit PeopleCode is newer than the database version. Oracle's version has replaced yours.",    isRed:false},
      {id:"peoplecode",  label:"💻 Review Current Code",    clue:"SaveEdit PeopleCode on the component has no salary validation. It matches the default delivered code exactly.",                   isRed:false},
      {id:"db_backup",   label:"💾 Check DB Backup",        clue:"Backup from pre-upgrade shows the custom validation existed. Post-upgrade it's gone.",                                           isRed:true},
      {id:"project",     label:"📦 Check Migration Project",clue:"The upgrade migration project included the delivered component. Custom changes were overwritten during the apply.",               isRed:false},
      {id:"event_map",   label:"🎯 Check Event Mapping",    clue:"No Event Mapping exists for this component. The customisation was made directly on the delivered object — not upgrade-safe.",    isRed:false}
    ],
    rootCauses:["PeopleCode syntax error introduced during upgrade","Oracle overwrote the customised delivered object","Permission List was reset during upgrade","Database table structure changed"],
    correctIdx:1,
    explanation:"Directly customising delivered objects is upgrade-unsafe. When Oracle applies a PeopleTools patch, it overwrites delivered components. The Compare Report and current PeopleCode clues confirm the custom logic is gone. Fix: use Event Mapping (PT 8.55+).",
    requiredClues:["compare_tool","peoplecode","event_map"]
  },
  {
    title:"Case #004 — The Batch Ghost",
    brief:"A nightly payroll AE batch runs, shows Success status in Process Monitor, but no employees are processed. Run time: 3 seconds (should be 8 minutes).",
    correctCause:"Run Control parameters are missing or incorrect",
    tools:[
      {id:"process_log", label:"📄 Review Process Log",    clue:"AE log: 'No rows selected for processing. Exiting.' Total rows processed: 0. AE completed successfully but found nothing to do.",  isRed:false},
      {id:"run_control", label:"📋 Inspect Run Control",   clue:"Run Control for this process: Pay Period End Date = blank, Pay Group = blank. Empty criteria = no employees match.",                 isRed:false},
      {id:"app_server",  label:"⚙️ Check App Server",     clue:"App Server is healthy. 8 processes available. Not a capacity issue.",                                                               isRed:true},
      {id:"db_tables",   label:"🗄️ Check PS_JOB Data",   clue:"PS_JOB has 12,450 active employees. Data exists. The batch just isn't querying it.",                                                 isRed:true},
      {id:"ae_code",     label:"💻 Review AE PeopleCode", clue:"AE SQL uses :Pay_Period and :Pay_Group bind variables from the Run Control. Logic is correct — parameters are just empty.",          isRed:false},
      {id:"scheduler",   label:"⏰ Check Recurrence",     clue:"Process is scheduled correctly. It fired at the right time. The problem is what it was given to process, not when it ran.",          isRed:true}
    ],
    rootCauses:["Application Engine has a SQL bug","Run Control parameters are missing or incorrect","Process Scheduler server is down","PS_JOB data was deleted"],
    correctIdx:1,
    explanation:"'No rows selected' is the classic Run Control symptom. The AE log, Run Control inspection, and AE code clues together confirm: the batch has correct logic but empty search criteria means zero rows match. The user submitted the job with blank Pay Period and Pay Group.",
    requiredClues:["process_log","run_control","ae_code"]
  },
  {
    title:"Case #005 — The Missing Component",
    brief:"A developer successfully migrates a custom component to QA. The component works when accessed via URL directly, but it doesn't appear in any menu or homepage tile.",
    correctCause:"Portal CREF was not included in the migration project",
    tools:[
      {id:"permission",  label:"🔒 Check Permission Lists", clue:"The component's Permission List is correctly assigned to the test user's Role. Access is granted.",                              isRed:true},
      {id:"direct_url",  label:"🌐 Test Direct URL Access", clue:"Accessing via direct URL works perfectly. Component loads, saves, all PeopleCode fires correctly.",                               isRed:true},
      {id:"portal",      label:"🗂️ Check Portal Registry", clue:"Portal Registry in QA shows no CREF entry for this component. The navigation object was never migrated.",                        isRed:false},
      {id:"project",     label:"📦 Review Migration Project",clue:"App Designer project contains: Record, Page, Component, Menu. No Portal Objects (Content References) were added.",               isRed:false},
      {id:"app_server",  label:"⚙️ Check App Server",      clue:"App Server is healthy. Unrelated to navigation not appearing.",                                                                    isRed:true},
      {id:"tiles",       label:"🏠 Check Homepage Tiles",   clue:"Tile configuration in the Fluid Homepage references a CREF that doesn't exist in QA. Tile is present but broken.",               isRed:false}
    ],
    rootCauses:["Component PeopleCode has a syntax error","Portal CREF was not included in the migration project","App Server cache needs to be cleared","Permission List is missing the component"],
    correctIdx:1,
    explanation:"In PeopleSoft, Application Designer objects (Records, Pages, Components) and Portal objects (CREFs, Homepage Tiles) are SEPARATE migration artifacts. The Portal Registry, Project, and Tiles clues all point to the same thing: the CREF was never added to the migration project.",
    requiredClues:["portal","project","tiles"]
  },
  {
    title:"Case #006 — The Security Leak",
    brief:"After go-live, HR managers report they can see ALL employees globally — including those in other countries and different pay grades.",
    correctCause:"Search Record is a base table (PS_JOB) instead of a security view",
    tools:[
      {id:"security_tree", label:"🌳 Check Security Tree",  clue:"Department Security Tree is correctly configured. All departments are properly assigned to managers.",                              isRed:true},
      {id:"search_record", label:"🗄️ Check Search Record", clue:"Component Search Record is PS_JOB. This base table does not join with PS_SCRTY_TBL_DEPT — it bypasses all row-level security.",    isRed:false},
      {id:"permission",    label:"🔒 Check Permission Lists",clue:"Permission Lists are correctly set. The issue is not with object-level access — it's data-level filtering.",                       isRed:true},
      {id:"security_view", label:"👁️ Check Security Views", clue:"PS_JOB_SRCH_VW exists and correctly joins PS_JOB with PS_SCRTY_TBL_DEPT filtered by %OperatorClass. This is the correct Search Record.", isRed:false},
      {id:"peoplecode",    label:"💻 Review PeopleCode",    clue:"No PeopleCode modifying the search exists. The issue is structural — the Search Record definition.",                                 isRed:true},
      {id:"db_audit",      label:"📊 Run Audit Report",     clue:"Audit confirms users are seeing rows outside their security tree. Root cause must be in search/filter configuration.",              isRed:false}
    ],
    rootCauses:["PeopleCode is removing the security filter","Search Record is a base table (PS_JOB) instead of a security view","Security Tree needs to be rebuilt","Permission List has too many roles"],
    correctIdx:1,
    explanation:"The most common PeopleSoft security vulnerability: using base tables (PS_JOB, PS_PERSONAL_DATA) as Search Records. Base tables have no security filter. PS_JOB_SRCH_VW joins with PS_SCRTY_TBL_DEPT to return only authorised rows. Always use security views as Search Records.",
    requiredClues:["search_record","security_view","db_audit"]
  }
];

let detectiveState = { idx:0, score:0, usedTools:new Set(), cluesFound:[], diagnosed:false };

function initScenario() {
  detectiveState = { idx:0, score:0, usedTools:new Set(), cluesFound:[], diagnosed:false };
  renderDetectiveCase();
}

function renderDetectiveCase() {
  const cas = DETECTIVE_CASES[detectiveState.idx];
  detectiveState.usedTools  = new Set();
  detectiveState.cluesFound = [];
  detectiveState.diagnosed  = false;

  const container = document.querySelector('#labScenario .lab-matcher');
  if (!container) return;

  container.innerHTML = `
    <button class="lab-debug__back" onclick="backToLab()">← Back to Lab</button>
    <div class="lab-debug__header">
      <div class="lab-debug__tag" style="color:var(--gold)">🔍 Scenario Solver — Detective Mode</div>
      <h2 class="lab-debug__title">${dEsc(cas.title)}</h2>
      <p class="lab-debug__sub">Investigate the incident using the toolbox. Gather clues, spot red herrings, then diagnose the root cause. Fewer tools = higher rating.</p>
    </div>
    <div class="lab-debug__meta">
      <span class="lab-debug__counter" id="scenarioCounter">Case ${detectiveState.idx + 1} of ${DETECTIVE_CASES.length}</span>
      <span id="scenarioScore" style="font-family:var(--fm);font-size:12px;color:var(--green)">Score: ${detectiveState.score}/${detectiveState.idx}</span>
    </div>
    <div class="detective-casefile">
      <div class="detective-casefile__header">
        <span class="detective-badge">📁 CASE FILE</span>
        <span class="detective-case-id">${dEsc(cas.title)}</span>
      </div>
      <div class="detective-brief">${dEsc(cas.brief)}</div>
    </div>
    <div class="detective-board">
      <div class="detective-board__title">📋 Investigation Board <span class="detective-clue-count" id="clueCount">0 clues found</span></div>
      <div class="detective-clues" id="detectiveClues">
        <div class="detective-clues__empty">Use the toolbox below to investigate. Each tool reveals a clue.</div>
      </div>
    </div>
    <div class="detective-toolbox">
      <div class="detective-toolbox__title">🧰 Toolbox — Click to Investigate</div>
      <div class="detective-tools" id="detectiveTools">
        ${cas.tools.map(t => `<button class="detective-tool-btn" id="dtool-${t.id}" onclick="useTool('${t.id}')">${dEsc(t.label)}</button>`).join('')}
      </div>
    </div>
    <div class="detective-diagnosis" id="detectiveDiagnosis" style="display:none">
      <div class="detective-diagnosis__title">🎯 File Your Report — What is the root cause?</div>
      <div class="detective-diagnosis__opts">
        ${cas.rootCauses.map((c,i) => `
          <button class="detective-cause-btn" onclick="fileDiagnosis(${i},this)">
            <span class="detective-cause-num">${i+1}</span>${dEsc(c)}
          </button>`).join('')}
      </div>
    </div>
    <div class="lab-result-box" id="scenarioResult"></div>
    <div style="margin-top:14px">
      <button class="btn btn--ghost btn--sm" id="scenarioNextBtn" style="display:none" onclick="nextDetectiveCase()">Next Case →</button>
    </div>`;
}

function useTool(toolId) {
  if (detectiveState.usedTools.has(toolId)) return;
  detectiveState.usedTools.add(toolId);

  const cas  = DETECTIVE_CASES[detectiveState.idx];
  const tool = cas.tools.find(t => t.id === toolId);
  if (!tool) return;

  const btn = document.getElementById(`dtool-${toolId}`);
  if (btn) {
    btn.disabled = true;
    btn.classList.add(tool.isRed ? 'tool-red-herring' : 'tool-used');
    btn.textContent = (tool.isRed ? '🚫 ' : '✓ ') + tool.label;
  }

  if (!tool.isRed) detectiveState.cluesFound.push(toolId);

  const cluesEl = document.getElementById('detectiveClues');
  const empty   = cluesEl.querySelector('.detective-clues__empty');
  if (empty) empty.remove();

  const card = document.createElement('div');
  card.className = `detective-clue-card ${tool.isRed ? 'clue-red-herring' : 'clue-evidence'}`;
  card.innerHTML = `
    <div class="clue-card__source">${dEsc(tool.label)}</div>
    <div class="clue-card__text">${dEsc(tool.clue)}</div>
    <div class="clue-card__tag">${tool.isRed ? '🚫 Red Herring' : '🔍 Evidence'}</div>`;
  cluesEl.appendChild(card);

  const countEl = document.getElementById('clueCount');
  if (countEl) countEl.textContent = `${detectiveState.cluesFound.length} evidence clue${detectiveState.cluesFound.length!==1?'s':''} found`;

  if (cas.requiredClues.every(r => detectiveState.usedTools.has(r))) {
    const diag = document.getElementById('detectiveDiagnosis');
    if (diag) { diag.style.display = 'block'; diag.scrollIntoView({behavior:'smooth',block:'nearest'}); }
  }
}

function fileDiagnosis(chosen, btn) {
  if (detectiveState.diagnosed) return;
  detectiveState.diagnosed = true;

  const cas     = DETECTIVE_CASES[detectiveState.idx];
  const correct = chosen === cas.correctIdx;
  if (correct) detectiveState.score++;

  document.getElementById('scenarioScore').textContent = `Score: ${detectiveState.score}/${detectiveState.idx + 1}`;

  document.querySelectorAll('.detective-cause-btn').forEach((b,i) => {
    b.disabled = true;
    if (i === cas.correctIdx)        b.classList.add('cause-correct');
    else if (i===chosen && !correct) b.classList.add('cause-wrong');
  });

  const used = detectiveState.usedTools.size;
  const total = cas.tools.length;
  let rating, color;
  if (used <= 3)      { rating='🏆 Master Detective — Minimal investigation needed!'; color='var(--green)'; }
  else if (used <= 4) { rating='🥈 Good Detective — Efficient investigation.';        color='var(--gold)';  }
  else                { rating='📚 Trainee Detective — You\'ll get faster with practice.'; color='var(--amber)'; }

  const res = document.getElementById('scenarioResult');
  res.className = `lab-result-box show ${correct ? 'correct' : 'wrong'}`;
  res.innerHTML = `
    <div class="lab-result-box__title">${correct ? '✅ Case Solved!' : '❌ Wrong Diagnosis'}</div>
    <div class="lab-result-box__text">${cas.explanation}</div>
    <div class="detective-rating" style="color:${color};margin-top:12px;font-family:var(--fm);font-size:12px">${rating} (${used}/${total} tools used)</div>`;

  const nb = document.getElementById('scenarioNextBtn');
  if (!nb) return;
  if (detectiveState.idx < DETECTIVE_CASES.length - 1) {
    nb.style.display = 'inline-flex';
  } else {
    res.innerHTML += `<br><strong style="color:var(--gold)">🎉 All cases closed! Final Score: ${detectiveState.score}/${DETECTIVE_CASES.length}</strong>`;
  }
}

function nextDetectiveCase() {
  detectiveState.idx++;
  renderDetectiveCase();
}

// Compat aliases
function nextScenario() { nextDetectiveCase(); }

/* ── LAB ROUTER — overrides pslearn-app.js ── */
function openLabMode(mode) {
  const lh = document.getElementById('labHome');
  if (lh) lh.style.display = 'none';
  const map = { debug:'labDebug', eventflow:'labEventFlow', matcher:'labMatcher', scenario:'labScenario', appdesigner:'labAppDesigner', pssim:'labPSSim' };
  Object.values(map).forEach(id => { const el=document.getElementById(id); if(el) el.style.display='none'; });
  const target = document.getElementById(map[mode]);
  if (target) { target.style.display='block'; window.scrollTo(0,0); }
  if (mode==='debug')       initDebug();
  if (mode==='eventflow')   initEventFlow();
  if (mode==='matcher')     initMatcher();
  if (mode==='scenario')    initScenario();
  if (mode==='appdesigner' && typeof initAppDesigner==='function') initAppDesigner();
  if (mode==='pssim'       && typeof initPSSim==='function')       initPSSim();
}


/* ── pslearn-pssim.js ── */
/* =====================================================
   PSLearn — PeopleSoft Navigator Simulator v2
   Task-driven: user given a mission, must navigate
   correctly and interact with the right component.
   ===================================================== */

/* ── NAVIGATION DATA ─────────────────────────────── */
const PS_NAV = [
  {
    icon:'👥', label:'Workforce Administration',
    subs:['Job Information','Personal Data','Org Data','Job Data Summary','Contract Administration']
  },
  {
    icon:'💰', label:'Compensation',
    subs:['Salary Plan','Pay Group Table','Compensation Rate Codes','Pay Rate Change']
  },
  {
    icon:'🏥', label:'Benefits',
    subs:['Enroll in Benefits','Benefits Summary','Dependent/Beneficiary Info','COBRA Processing']
  },
  {
    icon:'⏱️', label:'Time & Labor',
    subs:['Timesheet','Approve Time','Weekly Schedule','Reported Time Summary']
  },
  {
    icon:'📊', label:'Payroll',
    subs:['Create Paysheet','Calculate Pay','Confirm Pay','Review Pay Check']
  },
  {
    icon:'📈', label:'Talent Management',
    subs:['Employee Review','Development Plan','Career Plan','Succession Plan']
  },
  {
    icon:'🎓', label:'Learning & Development',
    subs:['Course Catalog','Learning History','Training Requests','Certification Tracking']
  },
  {
    icon:'🔧', label:'Set Up HCM',
    subs:['Business Units','Departments','Job Codes','Locations','Establishment Table']
  },
  {
    icon:'🔍', label:'Query',
    subs:['Query Manager','Schedule Query','Query Viewer','Connected Query Manager']
  },
  {
    icon:'📋', label:'Reporting Tools',
    subs:['PS Query','SQR Reports','Crystal Reports','Report Manager']
  }
];

const PS_TILES = [
  { icon:'👥', title:'Workforce Administration', subtitle:'Manage employee records', type:'tile' },
  { icon:'💰', title:'Compensation',             subtitle:'Salary & pay management', type:'tile' },
  { icon:'🏥', title:'Benefits',                 subtitle:'Benefits enrollment',     type:'tile' },
  { icon:'⏱️', title:'Time & Labor',             subtitle:'Timesheet management',    type:'tile' },
  { icon:'📊', title:'My Team',                  subtitle:'Headcount & turnover',    type:'chart' },
  { icon:'📈', title:'Talent Management',        subtitle:'Reviews & development',   type:'tile' },
];

const PS_COMPS = {
  'Job Information': {
    title:'Job Information',
    sub:'Workforce Administration › Job Information',
    compName:'JOB_DATA',
    fields:[
      {id:'emplid', l:'Employee ID',    v:'E00001',     editable:false},
      {id:'name',   l:'Name',           v:'John Smith', editable:false},
      {id:'deptid', l:'Department',     v:'HR001',      editable:true},
      {id:'jobcode',l:'Job Code',       v:'HR003',      editable:true},
      {id:'salary', l:'Annual Salary',  v:'75000',      editable:true},
      {id:'location',l:'Location',      v:'HQ-001',     editable:true},
    ]
  },
  'Personal Data': {
    title:'Personal Data',
    sub:'Workforce Administration › Personal Data',
    compName:'PERSONAL_DATA',
    fields:[
      {id:'emplid', l:'Employee ID',    v:'E00001',     editable:false},
      {id:'fname',  l:'First Name',     v:'John',       editable:true},
      {id:'lname',  l:'Last Name',      v:'Smith',      editable:true},
      {id:'email',  l:'Email',          v:'j.smith@corp.com', editable:true},
      {id:'phone',  l:'Phone',          v:'555-0100',   editable:true},
      {id:'dob',    l:'Date of Birth',  v:'1985-04-12', editable:false},
    ]
  },
  'Salary Plan': {
    title:'Salary Plan Table',
    sub:'Compensation › Salary Plan',
    compName:'SAL_PLAN_TBL',
    fields:[
      {id:'setid',     l:'SetID',        v:'SHARE',      editable:false},
      {id:'sal_admin', l:'Sal Admin Plan',v:'SAL001',    editable:false},
      {id:'effdt',     l:'Effective Date',v:'2024-01-01',editable:true},
      {id:'descr',     l:'Description',  v:'Standard Pay Plan', editable:true},
      {id:'currency',  l:'Currency',     v:'USD',        editable:true},
    ]
  },
  'Pay Rate Change': {
    title:'Pay Rate Change',
    sub:'Compensation › Pay Rate Change',
    compName:'JOB_DATA',
    fields:[
      {id:'emplid',  l:'Employee ID',   v:'E00001',    editable:false},
      {id:'effdt',   l:'Effective Date',v:'2025-04-01',editable:true},
      {id:'action',  l:'Action',        v:'PAY',       editable:true},
      {id:'comprate',l:'Compensation Rate',v:'85000',  editable:true},
      {id:'currency',l:'Currency',      v:'USD',       editable:false},
    ]
  },
  'Enroll in Benefits': {
    title:'Benefits Enrollment',
    sub:'Benefits › Enroll in Benefits',
    compName:'BAS_PARTIC',
    fields:[
      {id:'emplid',  l:'Employee ID',   v:'E00001',    editable:false},
      {id:'benprg',  l:'Benefits Program',v:'BENPGM1', editable:true},
      {id:'plan',    l:'Health Plan',   v:'MDHMO01',   editable:true},
      {id:'coverage',l:'Coverage',      v:'Employee Only', editable:true},
      {id:'effdt',   l:'Effective Date',v:'2025-01-01',editable:true},
    ]
  },
  'Departments': {
    title:'Department Table',
    sub:'Set Up HCM › Departments',
    compName:'DEPT_TBL',
    fields:[
      {id:'setid',   l:'SetID',         v:'SHARE',     editable:false},
      {id:'deptid',  l:'Department ID', v:'HR001',     editable:false},
      {id:'effdt',   l:'Effective Date',v:'2020-01-01',editable:true},
      {id:'descr',   l:'Description',   v:'Human Resources', editable:true},
      {id:'manager', l:'Manager ID',    v:'E00099',    editable:true},
      {id:'location',l:'Location',      v:'HQ-001',    editable:true},
    ]
  },
  'Job Codes': {
    title:'Job Code Table',
    sub:'Set Up HCM › Job Codes',
    compName:'JOBCODE_TBL',
    fields:[
      {id:'setid',    l:'SetID',        v:'SHARE',     editable:false},
      {id:'jobcode',  l:'Job Code',     v:'HR003',     editable:false},
      {id:'effdt',    l:'Effective Date',v:'2022-01-01',editable:true},
      {id:'descr',    l:'Description',  v:'HR Analyst',editable:true},
      {id:'flsa',     l:'FLSA Status',  v:'E',         editable:true},
      {id:'sal_admin',l:'Sal Admin Plan',v:'SAL001',   editable:true},
    ]
  },
  'Review Pay Check': {
    title:'Review Pay Check',
    sub:'Payroll › Review Pay Check',
    compName:'PAY_CHECK',
    fields:[
      {id:'emplid',    l:'Employee ID',   v:'E00001',    editable:false},
      {id:'payperiod', l:'Pay Period End',v:'2025-03-31',editable:false},
      {id:'grosspay',  l:'Gross Pay',     v:'7083.33',   editable:false},
      {id:'fedtax',    l:'Federal Tax',   v:'1062.50',   editable:false},
      {id:'netpay',    l:'Net Pay',       v:'5647.29',   editable:false},
    ]
  },
  'Org Data': {
    title:'Org Data',
    sub:'Workforce Administration › Org Data',
    compName:'PER_ORG_INST',
    fields:[
      {id:'emplid', l:'Employee ID',  v:'E00001',    editable:false},
      {id:'per_org',l:'Per/Org',      v:'EMP',       editable:false},
      {id:'ptype',  l:'Payroll Type', v:'NA',        editable:true},
      {id:'fte',    l:'FTE',          v:'1.00',      editable:true},
      {id:'full_pt',l:'Full/Part',    v:'F',         editable:true},
    ]
  },
  'Query Manager': {
    title:'Query Manager',
    sub:'Query › Query Manager',
    compName:'QUERY_MANAGER',
    fields:[
      {id:'qname', l:'Query Name',   v:'PS_ACTIVE_EMP',      editable:true},
      {id:'owner', l:'Owner',        v:'Public',              editable:true},
      {id:'descr', l:'Description',  v:'Active Employees HCM',editable:true},
      {id:'recname',l:'Primary Record',v:'PS_JOB',           editable:true},
    ]
  }
};

/* ── TASK DEFINITIONS ────────────────────────────── */
/*
  Each task has:
  - title, desc: shown to user
  - steps[]: ordered actions to validate
    - type: 'navigate' | 'field' | 'save' | 'tile'
    - target: the component name or field id
    - value: expected input value (for 'field' type)
    - label: step description shown in panel
    - hint: optional hint text
  - successMsg: shown on task complete
  - concept: learning callout shown after completion
*/
const PS_TASKS = [
  {
    id:'t1',
    title:'Task 1 — Navigate to Job Information',
    difficulty:'🟢 Beginner',
    desc:'An HR manager needs to view the Job Information page for Employee E00001. Navigate to Workforce Administration → Job Information using the NavBar.',
    steps:[
      { type:'navigate', target:'Job Information', label:'Open the NavBar (⚙️) and navigate to Workforce Administration → Job Information', hint:'Click the ⚙️ NavBar icon, expand Workforce Administration, then click Job Information.' }
    ],
    successMsg:'✅ You successfully navigated to Job Information — the primary component for employee job records in PeopleSoft HCM.',
    concept:'💡 In PeopleSoft, Job Information (component JOB_DATA) is effective-dated. Every change creates a new row rather than overwriting history — this is core to PS data architecture.'
  },
  {
    id:'t2',
    title:'Task 2 — Update Annual Salary',
    difficulty:'🟡 Intermediate',
    desc:'Employee E00001 received a pay raise. Navigate to Job Information and update the Annual Salary field to 85000, then save.',
    steps:[
      { type:'navigate', target:'Job Information', label:'Navigate to Workforce Administration → Job Information', hint:'Open NavBar → Workforce Administration → Job Information' },
      { type:'field', target:'salary', value:'85000', label:'Update Annual Salary to 85000', hint:'Find the Annual Salary field and type 85000' },
      { type:'save', target:'save', label:'Click the Save button', hint:'Click the 💾 Save button in the component toolbar' }
    ],
    successMsg:'✅ Salary updated and saved. In a real PS environment this would create a new effective-dated JOB row with the new salary.',
    concept:'💡 PeopleSoft never overwrites salary history. SaveEdit fires before commit — validating rules like salary cap, grade step compliance, and approval requirements.'
  },
  {
    id:'t3',
    title:'Task 3 — Find Pay Rate Change',
    difficulty:'🟡 Intermediate',
    desc:'You need to process a compensation change for an employee. Navigate to the correct component under the Compensation menu.',
    steps:[
      { type:'navigate', target:'Pay Rate Change', label:'Navigate to Compensation → Pay Rate Change', hint:'Open NavBar → Compensation → Pay Rate Change' }
    ],
    successMsg:'✅ Correct. Pay Rate Change (still uses JOB_DATA component) is the recommended path for salary changes in HCM vs editing Job Information directly.',
    concept:'💡 Pay Rate Change routes through the same JOB_DATA component but uses Action=PAY reason code. This distinction matters for audit trails, approval workflows, and reporting.'
  },
  {
    id:'t4',
    title:'Task 4 — Update Department Description',
    difficulty:'🟡 Intermediate',
    desc:'The HR001 department has been renamed to "Human Resources Operations". Navigate to Set Up HCM → Departments and update the Description field, then save.',
    steps:[
      { type:'navigate', target:'Departments', label:'Navigate to Set Up HCM → Departments', hint:'Open NavBar → Set Up HCM → Departments' },
      { type:'field', target:'descr', value:'Human Resources Operations', label:'Update Description to "Human Resources Operations"', hint:'Clear the Description field and type the new name' },
      { type:'save', target:'save', label:'Click Save', hint:'Click the 💾 Save button' }
    ],
    successMsg:'✅ Department updated. Setup data like Department Table is typically managed by system administrators and migrated across environments via Data Mover.',
    concept:'💡 DEPT_TBL is effective-dated. Changing the description with a future EFFDT preserves history — current reports still see the old name until that date.'
  },
  {
    id:'t5',
    title:'Task 5 — Review an Employee\'s Pay Check',
    difficulty:'🟢 Beginner',
    desc:'An employee is questioning their last paycheck. Navigate to Payroll → Review Pay Check to view the paycheck details.',
    steps:[
      { type:'navigate', target:'Review Pay Check', label:'Navigate to Payroll → Review Pay Check', hint:'Open NavBar → Payroll → Review Pay Check' }
    ],
    successMsg:'✅ Review Pay Check is a read-only component — you can view gross pay, deductions, and net pay. Payroll data in PS is generated by the Calculate Pay AE process.',
    concept:'💡 The Payroll process chain is: Create Paysheets → Calculate Pay → Confirm Pay. Only after Confirm Pay are records locked and pay checks generated.'
  },
  {
    id:'t6',
    title:'Task 6 — Access via Homepage Tile',
    difficulty:'🟢 Beginner',
    desc:'Navigate to Workforce Administration using the homepage tile (not the NavBar). Then open Job Information from there.',
    steps:[
      { type:'tile', target:'Workforce Administration', label:'Click the Workforce Administration tile on the homepage', hint:'Click the 👥 Workforce Administration tile directly on the homepage' },
      { type:'navigate', target:'Job Information', label:'Now navigate to Job Information via the NavBar', hint:'Open NavBar → Workforce Administration → Job Information' }
    ],
    successMsg:'✅ Fluid homepages use tiles as quick access points. Tiles are Content References (CREFs) configured in the Portal Registry — a common migration gap when promoting components.',
    concept:'💡 Homepage tiles are Portal objects, NOT App Designer objects. Forgetting to migrate CREFs is the #1 reason a component "works via URL but doesn\'t appear in menus".'
  },
  {
    id:'t7',
    title:'Task 7 — Update Job Code Description',
    difficulty:'🟠 Advanced',
    desc:'Job Code HR003 needs its description updated to "Senior HR Analyst". Navigate to Set Up HCM → Job Codes, update the Description, and save.',
    steps:[
      { type:'navigate', target:'Job Codes', label:'Navigate to Set Up HCM → Job Codes', hint:'Open NavBar → Set Up HCM → Job Codes' },
      { type:'field', target:'descr', value:'Senior HR Analyst', label:'Update Description to "Senior HR Analyst"', hint:'Clear the Description field and type the new title' },
      { type:'save', target:'save', label:'Click Save', hint:'Click the 💾 Save button' }
    ],
    successMsg:'✅ Job Code updated. Job codes are SetID-driven setup data — the same SHARE SetID job codes apply across multiple Business Units.',
    concept:'💡 SetID architecture lets PS share setup data across business units. DEPT_TBL, JOBCODE_TBL, and SAL_PLAN_TBL all use SetIDs. This is foundational to multi-entity PS implementations.'
  },
  {
    id:'t8',
    title:'Task 8 — Benefits Enrollment',
    difficulty:'🟠 Advanced',
    desc:'Employee E00001 needs to enroll in the health plan MDHMO01. Navigate to Benefits → Enroll in Benefits and update the Health Plan, then save.',
    steps:[
      { type:'navigate', target:'Enroll in Benefits', label:'Navigate to Benefits → Enroll in Benefits', hint:'Open NavBar → Benefits → Enroll in Benefits' },
      { type:'field', target:'plan', value:'MDHMO01', label:'Confirm Health Plan is set to MDHMO01', hint:'Verify or update the Health Plan field' },
      { type:'save', target:'save', label:'Click Save', hint:'Click the 💾 Save button' }
    ],
    successMsg:'✅ Benefits enrollment saved. In production, this triggers the Benefits Administration (BAS) process to evaluate eligibility and generate benefit events.',
    concept:'💡 Benefits changes go through the BAS (Benefits Administration) engine — not a direct save. The BAS_PARTIC table tracks participation. Always validate with \'Event Rules\' before go-live.'
  }
];

/* ── SIMULATOR STATE ─────────────────────────────── */
let psSimState = {
  taskIdx: 0,
  stepIdx: 0,
  taskStarted: false,
  currentScreen: 'login',   // login | home | component
  currentComponent: null,
  navOpen: false,
  score: 0,
  fieldChanges: {},          // tracks field edits
  taskComplete: false
};

/* ── INIT ────────────────────────────────────────── */
function initPSSim() {
  psSimState = {
    taskIdx:0, stepIdx:0, taskStarted:false,
    currentScreen:'login', currentComponent:null,
    navOpen:false, score:0, fieldChanges:{}, taskComplete:false
  };
  showPSScreen('psLoginScreen');
  const err = document.getElementById('psLoginError');
  if (err) { err.classList.remove('show'); err.textContent='Invalid User ID or Password. Please try again.'; }
  const uid = document.getElementById('psUserId');
  const pwd = document.getElementById('psPassword');
  if (uid) uid.value = '';
  if (pwd) pwd.value = '';
}

/* ── SIGN IN / OUT ───────────────────────────────── */
function psSignIn() {
  const u = (document.getElementById('psUserId')||{}).value?.trim();
  const p = (document.getElementById('psPassword')||{}).value;
  const errEl = document.getElementById('psLoginError');
  errEl.classList.remove('show');

  if (!u || !p) {
    errEl.textContent = 'Enter both User ID and Password.';
    errEl.classList.add('show');
    return;
  }

  const logEl = document.getElementById('psLoggedUser');
  if (logEl) logEl.textContent = `Logged in as: ${u.toUpperCase()}`;

  psSimState.currentScreen = 'home';
  psSimState.taskStarted = false;
  buildPSHome();
  showPSScreen('psHomeScreen');
  renderTaskPanel();
}

function psSignOut() {
  initPSSim();
}

function showPSScreen(id) {
  document.querySelectorAll('.ps-sim-screen').forEach(s => s.classList.remove('active'));
  const t = document.getElementById(id);
  if (t) t.classList.add('active');
  psSimState.currentScreen = id === 'psLoginScreen' ? 'login'
                           : id === 'psHomeScreen'   ? 'home'
                           : 'component';
}

/* ── HOME / NAV BUILD ────────────────────────────── */
function buildPSHome() {
  psSimState.navOpen = true;

  // Tiles
  const tilesEl = document.getElementById('psTilesGrid');
  if (tilesEl) {
    tilesEl.innerHTML = PS_TILES.map(t => {
      if (t.type === 'chart') {
        return `<div class="ps-tile chart-tile" onclick="psTileClick('${t.title}')">
          <div class="ps-tile__chart-title">${t.title}</div>
          <div style="display:flex;align-items:flex-end;gap:4px;height:60px;margin-bottom:6px">
            ${[40,65,50,80,55,90,75].map(h => `<div style="width:12px;background:#1e4d8c;height:${h}%;border-radius:2px 2px 0 0;opacity:.7"></div>`).join('')}
          </div>
          <div style="font-size:10px;color:#888">${t.subtitle}</div>
        </div>`;
      }
      return `<div class="ps-tile" onclick="psTileClick('${t.title}')">
        <div class="ps-tile__icon">${t.icon}</div>
        <div class="ps-tile__title">${t.title}</div>
        <div class="ps-tile__subtitle">${t.subtitle}</div>
      </div>`;
    }).join('');
  }

  // Quick Links
  const qlEl = document.getElementById('psQuickLinks');
  if (qlEl) {
    qlEl.innerHTML = [
      {i:'📋',l:'My Worklist'},{i:'✅',l:'Pending Approvals'},{i:'🔍',l:'Run a Query'},{i:'📄',l:'My Reports'}
    ].map(q => `<div class="ps-quicklink" onclick="psQuickLinkClick('${q.l}')"><span>${q.i}</span>${q.l}</div>`).join('');
  }

  buildPSNav('');
  const nav = document.getElementById('psNavBar');
  if (nav) nav.style.display = 'flex';
}

function buildPSNav_REPLACED(filter) {
  const el = document.getElementById('psNavItems');
  if (!el) return;
  el.innerHTML = PS_NAV
    .filter(item => !filter || item.label.toLowerCase().includes(filter) || item.subs.some(s => s.toLowerCase().includes(filter)))
    .map((item, i) => {
      const subsHtml = item.subs.length
        ? `<div class="ps-navbar-sub" id="psnav-sub-${i}">
            ${item.subs.map(s => `<div class="ps-navbar-sub-item" onclick="psOpenComponent('${s}')"><span class="ps-sub-icon">📄</span>${s}</div>`).join('')}
           </div>` : '';
      return `<div class="ps-navbar-section">
        <div class="ps-navbar-item" onclick="psToggleNavItem(${i})">
          <span class="ps-navbar-item-icon">${item.icon}</span>${item.label}
          ${item.subs.length ? '<span style="margin-left:auto;color:#aaa;font-size:12px">›</span>' : ''}
        </div>
        ${subsHtml}
      </div>`;
    }).join('');
}

function psNavSearch(v) { buildPSNav(v.toLowerCase()); }

function psToggleNavItem(i) {
  const s = document.getElementById(`psnav-sub-${i}`);
  if (s) s.classList.toggle('open');
}

function psToggleNav() {
  const n = document.getElementById('psNavBar');
  if (!n) return;
  psSimState.navOpen = n.style.display !== 'flex';
  n.style.display = psSimState.navOpen ? 'flex' : 'none';
}

function psGoHome() {
  psSimState.currentComponent = null;
  psSimState.fieldChanges = {};
  buildPSHome();
  showPSScreen('psHomeScreen');
}

/* ── TILE CLICK ──────────────────────────────────── */
function psTileClick(title) {
  const task = PS_TASKS[psSimState.taskIdx];
  const step = task.steps[psSimState.stepIdx];

  if (!psSimState.taskStarted) { psSimState.taskStarted = true; }

  if (step && step.type === 'tile' && step.target === title) {
    psSimFeedback(`✅ Good — clicked the ${title} tile!`, 'success');
    psSimAdvanceStep();
    return;
  }

  // Wrong tile but not an active tile step
  if (step && step.type === 'tile') {
    psSimFeedback(`❌ That's the ${title} tile. You need the "${step.target}" tile.`, 'error');
    return;
  }

  // Non-task tile click — just open the component (free nav)
  if (PS_COMPS[title]) psOpenComponent(title);
  else psSimFeedback(`ℹ️ ${title} tile clicked.`, 'info');
}

function psQuickLinkClick(label) {
  psSimFeedback(`ℹ️ ${label} — not yet active in this simulation.`, 'info');
}

/* ── COMPONENT OPEN ──────────────────────────────── */
function psOpenComponent(name) {
  const c = PS_COMPS[name];
  psSimState.currentComponent = name;
  psSimState.fieldChanges = {};
  showPSScreen('psComponentScreen');

  const el = document.getElementById('psComponentContent');
  if (!el) return;

  if (!c) {
    el.innerHTML = `
      <p style="font-family:'Segoe UI';font-size:12px;color:#888;margin-bottom:4px">
        <button onclick="psGoHome()" style="background:none;border:none;color:#1e4d8c;cursor:pointer;font-size:12px;font-family:'Segoe UI'">🏠 Home</button>
      </p>
      <div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:24px;text-align:center;color:#888;font-family:'Segoe UI'">
        🚧 Component not in simulator yet.<br><br>
        <button onclick="psGoHome()" style="background:#1e4d8c;color:#fff;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-family:'Segoe UI'">← Home</button>
      </div>`;
    return;
  }

  el.innerHTML = `
    <p style="font-family:'Segoe UI';font-size:12px;color:#888;margin-bottom:6px">
      <button onclick="psGoHome()" style="background:none;border:none;color:#1e4d8c;cursor:pointer;font-size:12px;font-family:'Segoe UI'">🏠</button> › ${c.sub}
    </p>
    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;overflow:hidden">
      <div style="background:linear-gradient(180deg,#1e4d8c,#163f75);padding:12px 16px;display:flex;align-items:center;justify-content:space-between">
        <div style="color:#fff;font-family:'Segoe UI';font-size:14px;font-weight:600">${c.title}</div>
        <div style="display:flex;gap:8px">
          <button id="psCompSaveBtn" onclick="psCompSave()" style="background:rgba(255,255,255,.2);color:#fff;border:none;padding:5px 14px;font-size:12px;cursor:pointer;border-radius:3px;font-family:'Segoe UI'">💾 Save</button>
          <button onclick="psGoHome()" style="background:rgba(255,255,255,.1);color:#fff;border:none;padding:5px 14px;font-size:12px;cursor:pointer;border-radius:3px;font-family:'Segoe UI'">✕</button>
        </div>
      </div>
      <div style="padding:20px">
        <table style="width:100%;border-collapse:collapse;font-family:'Segoe UI';font-size:13px">
          ${c.fields.map(f => `
            <tr>
              <td style="padding:8px 16px 8px 0;color:#555;font-weight:600;width:180px;vertical-align:middle">${f.l}</td>
              <td style="vertical-align:middle">
                ${f.editable
                  ? `<input id="psfield-${f.id}" type="text" value="${f.v}" onchange="psFieldChange('${f.id}',this.value)"
                       style="border:1px solid #ccc;padding:6px 10px;border-radius:3px;font-size:13px;font-family:'Segoe UI';color:#222;min-width:220px"/>`
                  : `<span style="font-size:13px;color:#444;font-family:'Segoe UI'">${f.v}</span>`
                }
              </td>
            </tr>`).join('')}
        </table>
      </div>
    </div>`;

  // Validate navigate step
  psSimCheckNavigate(name);
}

/* ── FIELD CHANGE HANDLER ────────────────────────── */
function psFieldChange(fieldId, value) {
  psSimState.fieldChanges[fieldId] = value;
  psSimCheckField(fieldId, value);
}

/* ── SAVE HANDLER ────────────────────────────────── */
function psCompSave() {
  const task = PS_TASKS[psSimState.taskIdx];
  const step = task?.steps[psSimState.stepIdx];

  if (step && step.type === 'save') {
    psSimFeedback('✅ Saved! Data committed to the component buffer.', 'success');
    psSimAdvanceStep();
    return;
  }

  // Premature save — still need to do a field step
  if (step && step.type === 'field') {
    psSimFeedback(`⚠️ Save clicked, but you haven't updated the ${step.target} field yet. Complete the field task first.`, 'warning');
    return;
  }

  psSimFeedback('💾 Saved.', 'info');
}

/* ── TASK VALIDATION ─────────────────────────────── */
function psSimCheckNavigate(componentName) {
  const task = PS_TASKS[psSimState.taskIdx];
  if (!task) return;
  const step = task.steps[psSimState.stepIdx];
  if (!step || step.type !== 'navigate') return;

  if (step.target === componentName) {
    psSimFeedback(`✅ Navigated to ${componentName} — correct!`, 'success');
    psSimAdvanceStep();
  } else if (psSimState.taskStarted) {
    psSimFeedback(`⚠️ You opened "${componentName}" but this task needs "${step.target}". Keep navigating.`, 'warning');
  }
}

function psSimCheckField(fieldId, value) {
  const task = PS_TASKS[psSimState.taskIdx];
  if (!task) return;
  const step = task.steps[psSimState.stepIdx];
  if (!step || step.type !== 'field') return;

  if (step.target !== fieldId) return; // not the watched field yet

  if (value.trim() === step.value) {
    psSimFeedback(`✅ Field updated correctly — ${value}`, 'success');
    psSimAdvanceStep();
  }
}

function psSimAdvanceStep() {
  const task = PS_TASKS[psSimState.taskIdx];
  psSimState.stepIdx++;

  if (psSimState.stepIdx >= task.steps.length) {
    // Task complete
    psSimState.score++;
    psSimState.taskComplete = true;
    renderTaskPanel();
    showTaskSuccess(task);
  } else {
    renderTaskPanel();
  }
}

/* ── FEEDBACK TOAST ──────────────────────────────── */
function psSimFeedback(msg, type) {
  let toast = document.getElementById('psSimToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'psSimToast';
    toast.style.cssText = `
      position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
      padding:10px 20px;border-radius:8px;font-size:13px;font-family:'Segoe UI';
      z-index:9999;max-width:440px;text-align:center;
      box-shadow:0 4px 20px rgba(0,0,0,0.3);pointer-events:none;
      transition:opacity 0.3s;`;
    document.body.appendChild(toast);
  }

  const colors = {
    success:'background:#166534;color:#dcfce7;border:1px solid #22c55e',
    error:  'background:#7f1d1d;color:#fee2e2;border:1px solid #ef4444',
    warning:'background:#7c2d12;color:#fed7aa;border:1px solid #f59e0b',
    info:   'background:#1e3a5f;color:#dbeafe;border:1px solid #3b82f6'
  };
  toast.style.cssText += colors[type] || colors.info;
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3200);
}

/* ── TASK PANEL ──────────────────────────────────── */
function renderTaskPanel() {
  const panel = document.getElementById('psTaskPanel');
  if (!panel) return;

  const task = PS_TASKS[psSimState.taskIdx];
  if (!task) {
    panel.innerHTML = renderAllTasksDone();
    return;
  }

  const stepItems = task.steps.map((s, i) => {
    const done    = i < psSimState.stepIdx;
    const active  = i === psSimState.stepIdx && !psSimState.taskComplete;
    const icon    = done ? '✅' : active ? '👉' : '⬜';
    const opacity = (!done && !active) ? 'opacity:0.45' : '';
    return `<div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);${opacity}">
      <span style="font-size:14px;flex-shrink:0;margin-top:1px">${icon}</span>
      <div>
        <div style="font-size:12px;color:${done?'#4ade80':active?'#fbbf24':'#9ca3af'};font-family:'Segoe UI';line-height:1.4">${s.label}</div>
        ${active && s.hint ? `<div style="font-size:11px;color:#6b7280;margin-top:3px;font-style:italic">💡 ${s.hint}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  const progressPct = Math.round((psSimState.taskIdx / PS_TASKS.length) * 100);

  panel.innerHTML = `
    <div style="font-family:'Segoe UI';color:#e5e7eb;padding:0 4px">
      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:11px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:.08em">Mission Control</div>
        <div style="font-size:11px;color:#4ade80;font-family:monospace">${psSimState.score}/${PS_TASKS.length} done</div>
      </div>

      <!-- Progress bar -->
      <div style="background:rgba(255,255,255,0.1);border-radius:4px;height:4px;margin-bottom:16px">
        <div style="background:#1e4d8c;height:4px;border-radius:4px;width:${progressPct}%;transition:width 0.4s"></div>
      </div>

      <!-- Task header -->
      <div style="font-size:11px;color:#6b7280;margin-bottom:4px">${task.difficulty}</div>
      <div style="font-size:13px;font-weight:700;color:#f9fafb;margin-bottom:8px;line-height:1.4">${task.title}</div>
      <div style="font-size:12px;color:#9ca3af;line-height:1.5;margin-bottom:14px;padding:10px;background:rgba(255,255,255,0.04);border-radius:6px;border-left:2px solid #1e4d8c">${task.desc}</div>

      <!-- Steps -->
      <div style="font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Steps</div>
      ${stepItems}

      <!-- Task complete callout -->
      ${psSimState.taskComplete ? `
        <div style="margin-top:14px;padding:12px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:8px">
          <div style="font-size:12px;color:#4ade80;font-weight:600;margin-bottom:4px">${task.successMsg}</div>
          <div style="font-size:11px;color:#6b7280;line-height:1.5;margin-top:6px">${task.concept}</div>
        </div>
        <button onclick="psNextTask()" style="
          margin-top:12px;width:100%;padding:10px;
          background:#1e4d8c;color:#fff;border:none;border-radius:6px;
          font-size:13px;font-family:'Segoe UI';font-weight:600;cursor:pointer;">
          ${psSimState.taskIdx < PS_TASKS.length - 1 ? 'Next Task →' : '🏆 All Tasks Done!'}
        </button>` : ''}

      <!-- Skip / Back buttons -->
      <div style="display:flex;gap:8px;margin-top:12px">
        <button onclick="backToLab()" style="flex:1;padding:7px;background:rgba(255,255,255,0.06);color:#9ca3af;border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:11px;cursor:pointer;font-family:'Segoe UI'">← Lab Home</button>
        ${!psSimState.taskComplete ? `<button onclick="psSkipTask()" style="flex:1;padding:7px;background:rgba(255,255,255,0.04);color:#6b7280;border:1px solid rgba(255,255,255,0.08);border-radius:6px;font-size:11px;cursor:pointer;font-family:'Segoe UI'">Skip Task</button>` : ''}
      </div>
    </div>`;
}

function renderAllTasksDone() {
  return `
    <div style="font-family:'Segoe UI';color:#e5e7eb;padding:0 4px;text-align:center">
      <div style="font-size:32px;margin-bottom:12px">🏆</div>
      <div style="font-size:15px;font-weight:700;color:#f9fafb;margin-bottom:8px">All Tasks Complete!</div>
      <div style="font-size:13px;color:#4ade80;margin-bottom:16px">Score: ${psSimState.score} / ${PS_TASKS.length}</div>
      <div style="font-size:12px;color:#6b7280;line-height:1.6;margin-bottom:20px">
        You've navigated PeopleSoft HCM, updated records, and learned core PS architecture concepts. These navigation patterns are identical to real PeopleSoft 9.2 environments.
      </div>
      <button onclick="psRestartTasks()" style="width:100%;padding:10px;background:#1e4d8c;color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;font-family:'Segoe UI'">Restart Simulator</button>
      <button onclick="backToLab()" style="width:100%;margin-top:8px;padding:10px;background:rgba(255,255,255,0.06);color:#9ca3af;border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:13px;cursor:pointer;font-family:'Segoe UI'">← Back to Lab</button>
    </div>`;
}

function showTaskSuccess(task) {
  psSimFeedback(`🎉 Task complete! ${task.successMsg.slice(0, 60)}…`, 'success');
}

/* ── TASK NAVIGATION ─────────────────────────────── */
function psNextTask() {
  psSimState.taskIdx++;
  psSimState.stepIdx = 0;
  psSimState.taskStarted = false;
  psSimState.taskComplete = false;
  psSimState.fieldChanges = {};
  psGoHome();
  renderTaskPanel();
}

function psSkipTask() {
  if (confirm('Skip this task? Your score won\'t increase for it.')) {
    psSimState.taskIdx++;
    psSimState.stepIdx = 0;
    psSimState.taskStarted = false;
    psSimState.taskComplete = false;
    psSimState.fieldChanges = {};
    psGoHome();
    renderTaskPanel();
  }
}

function psRestartTasks() {
  psSimState.taskIdx = 0;
  psSimState.stepIdx = 0;
  psSimState.score = 0;
  psSimState.taskStarted = false;
  psSimState.taskComplete = false;
  psSimState.fieldChanges = {};
  renderTaskPanel();
}

/* ── BACK TO LAB ─────────────────────────────────── */
function backToLab() {
  const labEl = document.getElementById('labView');
  if (labEl) labEl.style.display = 'block';

  // Hide all lab sub-panels
  ['labHome','labDebug','labEventFlow','labMatcher','labScenario','labAppDesigner','labPSSim'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const lh = document.getElementById('labHome');
  if (lh) lh.style.display = 'block';

  // Also manage switchView
  if (typeof switchView === 'function') switchView('labView');
}

/* ── DUAL NAV + DUAL PANEL SYNC ─────────────────── */
function buildPSNav(filter) {
  const html = PS_NAV
    .filter(item => !filter || item.label.toLowerCase().includes(filter) || item.subs.some(s => s.toLowerCase().includes(filter)))
    .map((item, i) => {
      const subsHtml = item.subs.length
        ? `<div class="ps-navbar-sub" id="psnav-sub-${i}">
            ${item.subs.map(s => `<div class="ps-navbar-sub-item" onclick="psOpenComponent('${s}')"><span class="ps-sub-icon">📄</span>${s}</div>`).join('')}
           </div>` : '';
      return `<div class="ps-navbar-section">
        <div class="ps-navbar-item" onclick="psToggleNavItem(${i})">
          <span class="ps-navbar-item-icon">${item.icon}</span>${item.label}
          ${item.subs.length ? '<span style="margin-left:auto;color:#aaa;font-size:12px">›</span>' : ''}
        </div>
        ${subsHtml}
      </div>`;
    }).join('');
  ['psNavItems','psNavItemsComp'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  });
}

// Sync task panel to both screens
const _origRenderTaskPanel = renderTaskPanel;
function renderTaskPanel() {
  _origRenderTaskPanel();
  // Mirror to component screen panel
  const src = document.getElementById('psTaskPanel');
  const dst = document.getElementById('psTaskPanelComp');
  if (src && dst) dst.innerHTML = src.innerHTML;
}

// psToggleNav works for both screens
const _origPsToggleNav = psToggleNav;
function psToggleNav() {
  const onHome = document.getElementById('psHomeScreen')?.classList.contains('active');
  const navId  = onHome ? 'psNavBar' : 'psNavBarComp';
  const n = document.getElementById(navId);
  if (!n) return;
  n.style.display = n.style.display === 'flex' ? 'none' : 'flex';
}

/* ── PSLEARN-APP.JS CONFLICT GUARD ───────────────── */
// pslearn-app.js defines older versions of these functions.
// This file loads AFTER it, so these definitions win.
// All old functions are shadowed by the ones defined above.
// No action needed — JS last-definition wins at runtime.

/* ── psNavSearch override (uses unified buildPSNav) ── */
function psNavSearch(v) { buildPSNav(v.toLowerCase()); }

/* ── psToggleNavItem: open sub on either nav instance ── */
function psToggleNavItem(i) {
  // Toggle in whichever nav instance is active
  [`psnav-sub-${i}`].forEach(id => {
    const s = document.getElementById(id);
    if (s) s.classList.toggle('open');
  });
}
