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
