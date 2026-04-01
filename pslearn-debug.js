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
