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
