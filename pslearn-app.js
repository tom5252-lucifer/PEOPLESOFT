/* PSLearn — Application Logic */
/* pslearn.vercel.app | Built by Koushik Ram M */


/* ═══════════════════════════════════════════════
   LOCALSTORAGE PROGRESS PERSISTENCE
═══════════════════════════════════════════════ */
const STORAGE_KEY = 'pslearn_v1';

function saveProgress() {
  const data = {
    visited: Array.from(visited),
    lastTopic: currentTopicIndex,
    quizScores: quizScores,
    savedAt: Date.now()
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.visited) data.visited.forEach(i => visited.add(i));
    if (typeof data.lastTopic === 'number') lastSavedTopic = data.lastTopic;
    if (data.quizScores) quizScores = data.quizScores;
  } catch(e) {}
}

let quizScores = {};
let lastSavedTopic = -1;

// Auto-save every topic open
const _origOpenTopic = openTopic;


/* ═══════════════════════════════════════════════
   RESUME WHERE YOU LEFT OFF
═══════════════════════════════════════════════ */
function showResumeBanner() {
  if (lastSavedTopic < 0) return;
  const topic = TOPICS[lastSavedTopic];
  if (!topic) return;
  const banner = document.getElementById('resumeBanner');
  if (!banner) return;
  document.getElementById('resumeTopicName').textContent = topic.title;
  document.getElementById('resumeTopicNum').textContent = `Topic ${lastSavedTopic + 1} of ${TOPICS.length}`;
  banner.style.display = 'flex';
}

function dismissResume() {
  const banner = document.getElementById('resumeBanner');
  if (banner) banner.style.display = 'none';
  lastSavedTopic = -1;
}


/* ═══════════════════════════════════════════════
   FUZZY SEARCH — LEVENSHTEIN DISTANCE
═══════════════════════════════════════════════ */
function levenshtein(a, b) {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp = Array.from({length: a.length + 1}, (_, i) =>
    Array.from({length: b.length + 1}, (_, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[a.length][b.length];
}

function fuzzyMatch(text, query) {
  text = text.toLowerCase();
  query = query.toLowerCase();
  // Exact match — highest score
  if (text.includes(query)) return true;
  // Word-by-word fuzzy for queries 4+ chars
  if (query.length < 4) return false;
  const words = text.split(/\s+/);
  return words.some(word => {
    if (Math.abs(word.length - query.length) > 3) return false;
    return levenshtein(word.slice(0, query.length + 2), query) <= Math.floor(query.length / 4);
  });
}

// Aliases / synonyms map
const SYNONYMS = {
  'ae': 'application engine',
  'app engine': 'application engine',
  'ci': 'component interface',
  'ib': 'integration broker',
  'ps query': 'ps query fundamentals',
  'psquery': 'ps query fundamentals',
  'effdt': 'effective dating',
  'effective date': 'effective dating',
  'buf': 'component buffer',
  'buffer': 'component buffer',
  'xlat': 'translate values',
  'translate': 'translate values',
  'pia': 'architecture',
  'tuxedo': 'architecture',
  'weblogic': 'architecture',
  'jolt': 'architecture',
  'rowset': 'component buffer',
  'sqlexec': 'peoplecode',
  'fieldedit': 'peoplecode',
  'fielddefault': 'peoplecode',
  'fieldchange': 'peoplecode',
  'postbuild': 'peoplecode',
  'saveedit': 'peoplecode',
  'rowselect': 'peoplecode',
  'rowinit': 'peoplecode',
  'emplid': 'glossary',
  'empl_rcd': 'glossary',
  'setid': 'data model',
  'business unit': 'data model',
  'permission list': 'security',
  'roles': 'security',
  'row level security': 'security',
  'process scheduler': 'process monitor',
  'run control': 'process monitor',
  'report manager': 'process monitor',
  'deptid': 'records',
  'sql table': 'records',
  'derived work': 'records',
  'subrecord': 'records',
  'prompt table': 'translate values',
};

function expandQuery(q) {
  const lq = q.toLowerCase();
  return SYNONYMS[lq] || q;
}


/* ═══════════════════════════════════════════════
   INTERVIEW Q&A ENGINE
═══════════════════════════════════════════════ */
const INTERVIEW_QA = [
  // BEGINNER
  {cat:"Beginner",level:"beginner",q:"What is PeopleSoft?",a:"PeopleSoft is Oracle's enterprise application suite for HR, Finance, Supply Chain, and Education. It is metadata-driven — every page, field, and workflow is defined as metadata in Application Designer, not hardcoded. The runtime engine reads this metadata to generate HTML pages and execute business logic."},
  {cat:"Beginner",level:"beginner",q:"What is PIA (Pure Internet Architecture)?",a:"PIA is PeopleSoft's three-tier web architecture introduced in PeopleSoft 8 (2000). Browser communicates with WebLogic (web tier), which communicates with Tuxedo Application Server (app tier) via JOLT, which communicates with the database (data tier). All PeopleCode and business logic runs in the Tuxedo App Server — zero logic in the browser."},
  {cat:"Beginner",level:"beginner",q:"What is Application Designer?",a:"Application Designer is PeopleSoft's Windows-based IDE. Developers use it to create and modify Records, Fields, Pages, Components, Menus, and PeopleCode. All objects created are stored as metadata in the database — not as physical files. It connects to the database in 2-tier mode (direct) or 3-tier mode (via App Server)."},
  {cat:"Beginner",level:"beginner",q:"What is the difference between a Record and a Table in PeopleSoft?",a:"In PeopleSoft, a Record is the metadata definition of a table or view created in Application Designer. When you Build a SQL Table record, PeopleSoft creates the physical database table prefixed with PS_ (e.g., Record JOB → Table PS_JOB). The Record is the definition; the Table is the physical database object."},
  {cat:"Beginner",level:"beginner",q:"What are the 7 Record Types in PeopleSoft?",a:"SQL Table (creates PS_ table), SQL View (read-only DB view), Dynamic View (runtime SQL, no DB object), Derived/Work (memory only, no DB), SubRecord (reusable field group), Query View (created by PS Query), Temp Table (for AE parallel processing)."},
  {cat:"Beginner",level:"beginner",q:"What is Effective Dating in PeopleSoft?",a:"Instead of updating existing rows, PeopleSoft inserts new rows with a new EFFDT (Effective Date). The 'current' row is retrieved using MAX(EFFDT) ≤ today. EFFSEQ handles multiple changes on the same date. Historical rows are never deleted — enabling retroactive payroll and full audit history."},
  {cat:"Beginner",level:"beginner",q:"What is PeopleCode?",a:"PeopleCode is PeopleSoft's proprietary event-driven scripting language. It runs server-side in the Tuxedo App Server — never in the browser. PeopleCode is always attached to a specific event (PostBuild, SaveEdit, FieldChange) on a specific object (record field, component). It handles validation, defaulting, dynamic UI, and SQL operations."},
  {cat:"Beginner",level:"beginner",q:"What is the Component Buffer?",a:"The Component Buffer is an in-memory data structure in the Tuxedo App Server that holds all data for the current component transaction. When a user opens a page, data loads from DB into the buffer. PeopleCode reads/writes to the buffer. Only when the user saves does the Component Processor commit the buffer to the database."},
  {cat:"Beginner",level:"beginner",q:"What is PostBuild event used for?",a:"PostBuild fires once after the entire component is fully loaded — after all RowInit and FieldDefault events have run for all rows. It is the ideal location for show/hide logic, setting field defaults based on component-level conditions, and any initialization that needs the fully loaded state."},
  {cat:"Beginner",level:"beginner",q:"What is SaveEdit event used for?",a:"SaveEdit is the standard event for final business rule validation before the database commit. Using Error() in SaveEdit stops the save and highlights the field. Using Warning() allows the save but shows a caution. It fires during the save sequence after all field-level edits have passed."},

  // INTERMEDIATE
  {cat:"PeopleCode",level:"intermediate",q:"Explain the complete PeopleCode event flow from component open to save.",a:"Load sequence: SearchInit → SearchSave → RowSelect → RowInit (per row) → FieldDefault → FieldFormula → PostBuild. User interaction: Activate (per tab) → FieldEdit → FieldChange. Save sequence: SaveEdit → SavePreChange → WorkFlow → SavePostChange. Understanding this sequence is critical — code in the wrong event causes subtle bugs."},
  {cat:"PeopleCode",level:"intermediate",q:"What is the difference between SQLExec and CreateSQL?",a:"SQLExec retrieves a single row — if multiple rows match, only the first is returned. CreateSQL returns a SQL object used with While &sql.Fetch() to iterate multiple rows. Always call &sql.Close() after. SQLExec in RowInit is the most common performance anti-pattern — N rows × 1 SQL = N database calls."},
  {cat:"PeopleCode",level:"intermediate",q:"What are the three PeopleCode variable scopes?",a:"Local: exists only for the current program execution — safest, use by default. Component: persists for the entire component transaction (open to save/cancel) — accessible from any event in that component. Global: persists for the entire user session — use very sparingly, can cause cross-component bugs."},
  {cat:"PeopleCode",level:"intermediate",q:"How do you iterate through Level 1 rows in the Component Buffer?",a:"Use GetRowset(Scroll.RECORDNAME) to get the Level 1 rowset. Loop with For &i = 1 To &rs.ActiveRowCount. Use GetRow(&i) to get each Row, then GetRecord(Record.NAME) to get the Record, then access Field.Value. Always use ActiveRowCount — not RowCount — to exclude deleted rows."},
  {cat:"PeopleCode",level:"intermediate",q:"What is Meta-SQL and why is it used?",a:"Meta-SQL are PeopleSoft-specific SQL functions that make code database-independent. %CurrentDateIn resolves to the correct date syntax for Oracle/SQL Server/DB2. %Table(RECORDNAME) resolves to PS_RECORDNAME. %Bind(FIELD) inserts a bind variable. Using Meta-SQL ensures your PeopleCode runs correctly regardless of the underlying database platform."},
  {cat:"PeopleCode",level:"intermediate",q:"When would you use Component scope vs Local scope?",a:"Use Local for all variables unless you specifically need to share a value across events. Use Component scope when you need to set a value in one event (e.g., set &isNewHire = True in PostBuild) and read it in another event later (e.g., check &isNewHire in SaveEdit). Avoid Global scope unless the data is truly session-wide."},

  // RECORDS & DATA
  {cat:"Records & Data",level:"intermediate",q:"What is the difference between a SQL View and a Dynamic View?",a:"SQL View creates a permanent database view object — visible in the DB schema. Dynamic View stores SQL in PeopleTools metadata but creates no database object — the SQL resolves at runtime. Dynamic Views allow runtime-specific filtering (like current user's SetID) that cannot be in a static view. Both are read-only."},
  {cat:"Records & Data",level:"intermediate",q:"Why should you never add fields directly to a delivered PeopleSoft record?",a:"Oracle-delivered objects are overwritten during upgrades. If you add a field to PS_JOB, the next upgrade replaces PS_JOB and your field is gone. Best practice: create an extension record (e.g., ZZ_JOB_EXT) with the same key fields and add your custom fields there. For PT 8.55+, Event Mapping allows upgrade-safe customization entirely."},
  {cat:"Records & Data",level:"intermediate",q:"How do you implement row-level security in a custom component showing employee data?",a:"Replace the base SQL Table (PS_JOB) with a security view as the Search Record. The security view joins the base table with a department security table — filtering results based on the current user's security profile. Without this, any user with page access sees all data regardless of their row-level security settings."},
  {cat:"Records & Data",level:"intermediate",q:"What is SetID and how does it work with TableSet sharing?",a:"SetID is a code assigned to setup tables that controls which reference data applies to each Business Unit. Multiple Business Units can share the same SetID (e.g., SHARE for departments). TableSet Controls (PS_SET_CNTRL_TBL) link each Business Unit to SetIDs per record group. This allows sharing common data while maintaining separate configurations per region."},

  // ARCHITECTURE
  {cat:"Architecture",level:"intermediate",q:"What is the difference between PSAPPSRV and PSQRYSRV?",a:"PSAPPSRV is the core App Server process handling component buffer operations, PeopleCode execution, and SQL generation for page transactions. PSQRYSRV is a dedicated process for PS Query execution — separated to prevent heavy queries from blocking online component processing. Multiple instances of both run simultaneously for concurrent users."},
  {cat:"Architecture",level:"intermediate",q:"What does the Distribution Agent (PSDSTSRV) do?",a:"PSDSTSRV moves completed batch process output files from the batch server to the Report Repository web server. Once moved, users can access their report output through Report Manager in the browser. Without PSDSTSRV running, batch reports complete but users cannot see the output."},
  {cat:"Architecture",level:"intermediate",q:"What is a Run Control and why is it needed?",a:"A Run Control is a database record that stores parameters before a batch process runs. Batch processes cannot interactively prompt users, so they read parameters from the Run Control table (keyed by OPRID + RUN_CNTL_ID). Users enter parameters on the Run Control page, save them, then submit the process. The process reads the saved parameters at runtime."},

  // SECURITY
  {cat:"Security",level:"intermediate",q:"Explain PeopleSoft's security hierarchy.",a:"User Profiles are assigned Roles. Roles bundle Permission Lists. Permission Lists define actual access — which components (and in which modes: Add/Update/Display), which processes, which PS Query trees, which web services. Row-Level Security (Department Security Trees) controls which data rows a user can see within accessible components."},
  {cat:"Security",level:"intermediate",q:"What is the difference between page-level security and row-level security?",a:"Page-level security (Permission Lists) controls whether a user can access a component at all and in which mode (Add, Update, Display Only). Row-level security controls which data rows are visible within components they have page access to — e.g., an HR admin can access Job Data but only see employees in their authorized departments."},
  {cat:"Security",level:"intermediate",q:"What is a Permission List and what does it control?",a:"A Permission List is the core security object. It controls: component access (which pages, which modes), process group access (which batch processes can be submitted), PS Query access (which record groups can be queried), web service access (Integration Broker), sign-on times, and PeopleTools access (App Designer, Data Mover, etc.)."},

  // ADVANCED
  {cat:"Advanced",level:"advanced",q:"What is Application Engine and when would you use it?",a:"Application Engine (AE) is PeopleSoft's batch processing framework for large-scale data operations. Use it when processing needs to run outside the online component session — mass data updates, data migrations, interface file processing, payroll calculations. AE uses Steps, Sections, Actions (Do Select, Do When, SQL, PeopleCode). It has checkpoint/restart capability and supports parallel processing via Temp Tables."},
  {cat:"Advanced",level:"advanced",q:"What is a Component Interface and when is it used?",a:"A Component Interface (CI) provides programmatic access to a PeopleSoft component from external programs — Application Engine, web services, batch load programs. It fires the same PeopleCode events as the online component. CIs are used for data migration (loading data using delivered business rules), integration (receiving data from external systems), and testing automation."},
  {cat:"Advanced",level:"advanced",q:"What is Integration Broker?",a:"Integration Broker is PeopleSoft's enterprise messaging platform for real-time and asynchronous integrations. Key concepts: Service Operations (define what data is exchanged), Nodes (identify systems), Handlers (process incoming messages), Routing Rules (direct messages). Supports REST, SOAP, and internal PeopleSoft messaging. Used for HR-to-Finance integrations, third-party payroll, and cloud HR interfaces."},
  {cat:"Advanced",level:"advanced",q:"What is Event Mapping in PeopleTools 8.55+?",a:"Event Mapping is an upgrade-safe customization technique. Instead of modifying delivered component events directly, you create a custom Application Class PeopleCode and map it to a delivered component event (e.g., PostBuild of HR_PERSONAL_DTLS). During upgrades, delivered objects are replaced but your mapping remains — eliminating the traditional 'modify and compare' upgrade pain. This is the recommended approach for all customizations in modern PeopleSoft."},
  {cat:"Advanced",level:"advanced",q:"How does PeopleSoft's Fluid UI differ from Classic UI?",a:"Classic UI uses fixed-width HTML tables, desktop-only, grey interface — introduced with PIA in PeopleSoft 8. Fluid UI (PT 8.53+) uses responsive HTML5/CSS3 with Oracle JET — works on mobile, tablet, desktop. Fluid uses Homepages with Tiles, NavBar navigation, Activity Guides, and Related Actions. New Oracle functionality is built exclusively in Fluid. Classic pages cannot be automatically converted to Fluid — they require redevelopment."},
  {cat:"Advanced",level:"advanced",q:"What is PUM (PeopleSoft Update Manager) and how does it work?",a:"PUM replaced bundle patching (~2014). Oracle releases PeopleSoft Images (VirtualBox VMs) with all cumulative fixes. Organizations connect their environment to the Image via PUM, browse available updates in a web UI, select exactly what they want (individual fixes or features), and generate a Change Package to apply. This selective adoption means organizations can take critical security fixes without taking untested UI changes."},
  {cat:"Advanced",level:"advanced",q:"Explain the Temp Table pattern in Application Engine.",a:"Temp Tables allow parallel AE processing. You define a record as Temp Table type — PeopleSoft creates multiple instances in the DB (MYTEMP_AET, MYTEMP_AET1, MYTEMP_AET2...). Each parallel AE process instance uses its own temp table instance. This prevents data collision between parallel processes. The number of instances is configured on the AE Program properties. Without Temp Tables, parallel processing would cause data overwrites."},
  {cat:"Advanced",level:"advanced",q:"What is the difference between SavePreChange and SavePostChange?",a:"SavePreChange fires just before the Component Processor executes INSERT/UPDATE SQL — all buffer data is final, but the DB commit has not happened yet. Use it for last-moment buffer manipulation or creating related records. SavePostChange fires after the DB commit is complete — you cannot cancel the save here. Use it for downstream updates, triggering integrations, sending notifications, or any action that requires the data to already be in the database."},

  // REAL PROJECT
  {cat:"Real Project",level:"advanced",q:"An employee's data shows incorrectly in a report for last January. How do you debug this?",a:"First check if the report query includes effective dating criteria (WHERE EFFDT <= report_date AND EFFSEQ = MAX). Without this, the query returns today's current row, not January's. Second, check PS_JOB directly — look at the employee's rows for January and compare. Third, verify the report's business date parameter. Most PeopleSoft reporting errors involving wrong data are due to missing or incorrect effective dating criteria."},
  {cat:"Real Project",level:"advanced",q:"A custom batch process is failing with Error status in Process Monitor. How do you approach this?",a:"Step 1: Process Monitor → click the process → View Log/Trace. The log contains the actual error — the status just says 'failed'. Step 2: Check the Run Control — are the parameters valid (date ranges, EMPLID exists, Pay Group correct)? Step 3: Check the AE trace file for the last executed SQL. Step 4: Run that SQL manually in a query tool with the same parameters. Step 5: Check for data issues (null values, referential integrity, permissions)."},
  {cat:"Real Project",level:"advanced",q:"You need to load 50,000 employee records from an external system into PeopleSoft HCM. What approach do you recommend?",a:"Recommended: Component Interface (CI) via Application Engine. The CI fires all delivered PeopleCode events (FieldEdit, SaveEdit, business rules) ensuring data integrity. Build an AE that reads from a staging table (loaded from the file), calls the CI for each employee, and logs errors to an error table. Alternative for simple data: Data Mover (DMS) for direct table load, but this bypasses business rules — only use for non-critical reference data."},
  {cat:"Real Project",level:"advanced",q:"Performance issue: a page with a 500-row grid takes 45 seconds to load. How do you diagnose and fix?",a:"Enable App Server SQL trace. Look for repeated identical SQL statements — SQLExec in RowInit is the classic cause. Fix: move the lookup to PostBuild using CreateSQL once to build an array/object keyed by EMPLID or DEPTID, then in RowInit just read from the array. Second check: is the grid's record a SQL Table or SQL View? Adding JOIN to a view to bring department names eliminates all RowInit lookups. Third: check indexes on the main record's key fields."},
];

function showInterview() {
  ['homepageView','appView','glossaryView','quizView','simulationView'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('interviewView').style.display = 'block';
  renderInterviewQA('all');
  window.scrollTo(0, 0);
}

let activeInterviewFilter = 'all';

function setInterviewFilter(level, btn) {
  activeInterviewFilter = level;
  document.querySelectorAll('.iqa-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderInterviewQA(level);
}

function renderInterviewQA(level) {
  const container = document.getElementById('interviewContent');
  const questions = level === 'all' ? INTERVIEW_QA : INTERVIEW_QA.filter(q => q.level === level);
  
  // Group by category
  const grouped = {};
  questions.forEach(q => {
    if (!grouped[q.cat]) grouped[q.cat] = [];
    grouped[q.cat].push(q);
  });

  const levelColors = {beginner:'var(--green)',intermediate:'var(--amber)',advanced:'var(--red)'};
  const levelLabels = {beginner:'Beginner',intermediate:'Intermediate',advanced:'Advanced'};

  container.innerHTML = Object.entries(grouped).map(([cat, qs]) => `
    <div class="iqa-group" role="region" aria-label="${cat} questions">
      <div class="iqa-group__header">${cat}</div>
      ${qs.map((q, i) => `
        <div class="iqa-item" role="article">
          <button class="iqa-question" 
            aria-expanded="false"
            aria-controls="iqa-ans-${cat}-${i}"
            onclick="toggleIQA(this)">
            <span class="iqa-question__text">${q.q}</span>
            <span class="iqa-level-badge" style="background:${levelColors[q.level]}20;color:${levelColors[q.level]};border:1px solid ${levelColors[q.level]}40">
              ${levelLabels[q.level]}
            </span>
            <span class="iqa-chevron" aria-hidden="true">›</span>
          </button>
          <div class="iqa-answer" id="iqa-ans-${cat}-${i}" role="region" hidden>
            <p>${q.a}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

function toggleIQA(btn) {
  const answer = document.getElementById(btn.getAttribute('aria-controls'));
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', !isOpen);
  if (isOpen) { answer.hidden = true; }
  else { answer.hidden = false; }
  btn.querySelector('.iqa-chevron').style.transform = isOpen ? '' : 'rotate(90deg)';
}


/* ═══════════════════════════════════════════════
   SIMULATION VIEW (PLACEHOLDER)
═══════════════════════════════════════════════ */
function showSimulation() {
  ['homepageView','appView','glossaryView','quizView','interviewView'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('simulationView').style.display = 'block';
  window.scrollTo(0, 0);
}



/* PSLearn — Application Logic */


/* ═══════════════════════════════════════════════
   TOPIC DATA — 20 BEGINNER TOPICS
═══════════════════════════════════════════════ */
// ── All data loaded from pslearn-data.js ──



/* ═══════════════════════════════════════════════
   QUIZ ENGINE — 100 QUESTION BANK
═══════════════════════════════════════════════ */
// QUIZ_BANK — loaded from pslearn-data.js

/* ═══════════════════════════════════════════════
   QUIZ STATE & ENGINE
═══════════════════════════════════════════════ */
let quizState = {
  mode:null, selectedModule:-1, questions:[], current:0,
  answers:[], timerInterval:null, timeLeft:30, startTime:0, answered:false,
};

const QUIZ_MODULE_CATEGORIES = [
  {label:"🔰 History & Intro",   cat:"History & Introduction"},
  {label:"🏗️ Architecture",      cat:"Architecture & PIA"},
  {label:"💻 PeopleCode",        cat:"PeopleCode Basics"},
  {label:"🗂️ Records & Fields",  cat:"Records & Fields"},
  {label:"📅 Effective Dating",  cat:"Effective Dating"},
  {label:"🖥️ Pages & Components",cat:"Pages & Components"},
  {label:"📦 Buffer & Rowsets",  cat:"Component Buffer"},
  {label:"🔍 Query & Security",  cat:"PS Query & Security"},
  {label:"🏢 Real Scenarios",    cat:"Real Project Scenario"},
];

function showQuiz() {
  ['homepageView','appView','glossaryView'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });
  document.getElementById('quizView').style.display = 'block';
  document.getElementById('quizHome').style.display = 'block';
  document.getElementById('quizActive').style.display = 'none';
  document.getElementById('quizResults').style.display = 'none';
  quizState.mode = null; quizState.selectedModule = -1;
  document.querySelectorAll('.quiz-mode-card').forEach(c=>c.classList.remove('selected'));
  document.getElementById('quizModuleSection').classList.remove('visible');
  document.getElementById('quizStartBtn').disabled = true;
  document.getElementById('quizStartInfo').textContent = 'Select a quiz mode above to begin';
  buildQuizModuleGrid();
  window.scrollTo(0,0);
}

function selectQuizMode(mode) {
  quizState.mode = mode; quizState.selectedModule = -1;
  document.querySelectorAll('.quiz-mode-card').forEach(c=>c.classList.remove('selected'));
  document.getElementById(mode==='module'?'modeCardModule':'modeCardFull').classList.add('selected');
  document.querySelectorAll('.qmod-btn').forEach(b=>b.classList.remove('active'));
  if(mode==='module'){
    document.getElementById('quizModuleSection').classList.add('visible');
    document.getElementById('quizStartBtn').disabled = true;
    document.getElementById('quizStartInfo').textContent = 'Now select a module to focus on';
  } else {
    document.getElementById('quizModuleSection').classList.remove('visible');
    document.getElementById('quizStartBtn').disabled = false;
    document.getElementById('quizStartInfo').innerHTML = '<strong>40 questions</strong> · All topics · Randomly mixed · 30s per question';
  }
}

function buildQuizModuleGrid(){
  const grid = document.getElementById('quizModuleGrid');
  grid.innerHTML = '';
  QUIZ_MODULE_CATEGORIES.forEach((mod,i)=>{
    const count = QUIZ_BANK.filter(q=>q.cat===mod.cat).length;
    const btn = document.createElement('button');
    btn.className='qmod-btn';
    btn.textContent=`${mod.label} (${count}Q)`;
    btn.onclick=()=>selectQuizModule(i,btn);
    grid.appendChild(btn);
  });
}

function selectQuizModule(idx,btn){
  quizState.selectedModule=idx;
  document.querySelectorAll('.qmod-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const mod=QUIZ_MODULE_CATEGORIES[idx];
  document.getElementById('quizStartBtn').disabled=false;
  document.getElementById('quizStartInfo').innerHTML=`<strong>30 questions</strong> · Focused on ${mod.label} · 30s per question`;
}

function startQuiz(){
  let pool=[];
  if(quizState.mode==='full'){
    pool=shuffleArr([...QUIZ_BANK]).slice(0,40);
  } else {
    const mod=QUIZ_MODULE_CATEGORIES[quizState.selectedModule];
    const catQs=shuffleArr(QUIZ_BANK.filter(q=>q.cat===mod.cat));
    const otherQs=shuffleArr(QUIZ_BANK.filter(q=>q.cat!==mod.cat));
    pool=[...catQs,...otherQs].slice(0,30);
  }
  quizState.questions=pool;
  quizState.current=0;
  quizState.answers=new Array(pool.length).fill(null);
  quizState.startTime=Date.now();
  document.getElementById('quizHome').style.display='none';
  document.getElementById('quizActive').style.display='block';
  document.getElementById('quizResults').style.display='none';
  renderQuizQuestion();
}

function shuffleArr(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function renderQuizQuestion(){
  const q=quizState.questions[quizState.current];
  const total=quizState.questions.length;
  const idx=quizState.current;
  quizState.answered=false;
  document.getElementById('quizQCounter').textContent=`Question ${idx+1} of ${total}`;
  document.getElementById('quizCategoryChip').textContent=q.cat;
  document.getElementById('quizProgressFill').style.width=`${(idx/total)*100}%`;
  document.getElementById('quizQNum').textContent=`Q${idx+1}`;
  document.getElementById('quizQText').textContent=q.q;
  document.getElementById('quizScenarioBadge').style.display=q.isScenario?'inline-flex':'none';
  document.getElementById('quizOptions').innerHTML=q.opts.map((opt,oi)=>`
    <button class="quiz-opt" id="qopt-${oi}" onclick="answerQuiz(${oi})">
      <span class="quiz-opt__letter">${String.fromCharCode(65+oi)}</span>
      <span class="quiz-opt__text">${opt}</span>
    </button>`).join('');
  const exp=document.getElementById('quizExplanation');
  exp.classList.remove('show'); exp.innerHTML='';
  document.getElementById('quizSkipBtn').style.display='block';
  document.getElementById('quizNextBtn').classList.remove('show');
  document.getElementById('quizNextBtn').textContent=idx===total-1?'Finish Quiz →':'Next Question →';
  startTimer();
}

function startTimer(){
  clearInterval(quizState.timerInterval);
  quizState.timeLeft=30;
  updateTimerDisplay();
  quizState.timerInterval=setInterval(()=>{
    quizState.timeLeft--;
    updateTimerDisplay();
    if(quizState.timeLeft<=0){clearInterval(quizState.timerInterval);if(!quizState.answered)timeOut();}
  },1000);
}

function updateTimerDisplay(){
  const t=quizState.timeLeft;
  const d=document.getElementById('quizTimerDisplay');
  const f=document.getElementById('quizTimerFill');
  d.textContent=t;
  d.className='quiz-timer'+(t<=10?' danger':t<=20?' warning':'');
  f.style.width=(t/30*100)+'%';
  f.className='quiz-timer-fill '+(t<=10?'timer-red':t<=20?'timer-amber':'timer-green');
}

function timeOut(){
  quizState.answered=true;
  const q=quizState.questions[quizState.current];
  quizState.answers[quizState.current]={chosen:-1,correct:q.ans,skipped:true,timedOut:true};
  document.querySelectorAll('.quiz-opt').forEach((btn,i)=>{btn.disabled=true;if(i===q.ans)btn.classList.add('correct');});
  showQExplanation(q);
  document.getElementById('quizSkipBtn').style.display='none';
  document.getElementById('quizNextBtn').classList.add('show');
  document.getElementById('quizTimerDisplay').textContent='⏰';
}

function answerQuiz(chosen){
  if(quizState.answered)return;
  quizState.answered=true;
  clearInterval(quizState.timerInterval);
  const q=quizState.questions[quizState.current];
  quizState.answers[quizState.current]={chosen,correct:q.ans,skipped:false,timedOut:false};
  document.querySelectorAll('.quiz-opt').forEach((btn,i)=>{
    btn.disabled=true;
    if(i===q.ans)btn.classList.add('correct');
    else if(i===chosen)btn.classList.add('wrong');
    else btn.classList.add('reveal');
  });
  showQExplanation(q);
  document.getElementById('quizSkipBtn').style.display='none';
  document.getElementById('quizNextBtn').classList.add('show');
}

function skipQuestion(){
  if(quizState.answered)return;
  clearInterval(quizState.timerInterval);
  const q=quizState.questions[quizState.current];
  quizState.answers[quizState.current]={chosen:-1,correct:q.ans,skipped:true,timedOut:false};
  quizState.answered=true;
  document.querySelectorAll('.quiz-opt').forEach((btn,i)=>{btn.disabled=true;if(i===q.ans)btn.classList.add('correct');});
  showQExplanation(q);
  document.getElementById('quizSkipBtn').style.display='none';
  document.getElementById('quizNextBtn').classList.add('show');
}

function showQExplanation(q){
  const exp=document.getElementById('quizExplanation');
  exp.innerHTML=`<strong>💡 Explanation:</strong> ${q.exp}`;
  exp.classList.add('show');
}

function nextQuestion(){
  quizState.current++;
  if(quizState.current>=quizState.questions.length)showQuizResults();
  else renderQuizQuestion();
}

function showQuizResults(){
  clearInterval(quizState.timerInterval);
  const totalTime=Math.round((Date.now()-quizState.startTime)/1000);
  const total=quizState.questions.length;
  const correct=quizState.answers.filter(a=>a&&!a.skipped&&a.chosen===a.correct).length;
  const wrong=quizState.answers.filter(a=>a&&!a.skipped&&a.chosen!==a.correct).length;
  const skipped=quizState.answers.filter(a=>a&&a.skipped).length;
  const pct=Math.round((correct/total)*100);
  document.getElementById('quizActive').style.display='none';
  document.getElementById('quizResults').style.display='block';
  document.getElementById('resultPct').textContent=pct+'%';
  document.getElementById('resultCorrect').textContent=correct;
  document.getElementById('resultWrong').textContent=wrong;
  document.getElementById('resultSkipped').textContent=skipped;
  const mins=Math.floor(totalTime/60),secs=totalTime%60;
  document.getElementById('resultTime').textContent=mins>0?`${mins}m ${secs}s`:`${secs}s`;
  let grade,sub,cls;
  if(pct>=90){grade='🏆 Excellent!';sub='Outstanding — you really know your PeopleSoft!';cls='grade-excellent';}
  else if(pct>=75){grade='🥈 Good Work!';sub='Solid foundation — review the questions you missed.';cls='grade-good';}
  else if(pct>=55){grade='📚 Keep Going!';sub='On the right track — go back and review the topics.';cls='grade-ok';}
  else{grade='🔄 Keep Practising';sub='Review the beginner modules and retake — you will improve!';cls='grade-retry';}
  document.getElementById('resultGrade').textContent=grade;
  document.getElementById('resultGrade').className='quiz-grade '+cls;
  document.getElementById('resultGradeSub').textContent=sub;
  drawScoreCircle(pct);
  document.getElementById('quizReviewSection').classList.remove('open');
  window.scrollTo(0,0);
}

function drawScoreCircle(pct){
  const canvas=document.getElementById('scoreCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const cx=55,cy=55,r=46;
  ctx.clearRect(0,0,110,110);
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=8;ctx.stroke();
  const angle=(pct/100)*Math.PI*2-Math.PI/2;
  const color=pct>=90?'#22c55e':pct>=75?'#f0a500':pct>=55?'#f59e0b':'#ef4444';
  ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,angle);
  ctx.strokeStyle=color;ctx.lineWidth=8;ctx.lineCap='round';ctx.stroke();
}

function toggleReview(){
  const s=document.getElementById('quizReviewSection');
  const btn=document.getElementById('reviewToggleBtn');
  if(s.classList.contains('open')){s.classList.remove('open');btn.textContent='📋 Review Answers';}
  else{s.classList.add('open');btn.textContent='▲ Hide Review';buildReview();}
}

function buildReview(){
  const content=document.getElementById('quizReviewContent');
  content.innerHTML=quizState.questions.map((q,i)=>{
    const a=quizState.answers[i];
    if(!a)return'';
    const wasCorrect=!a.skipped&&a.chosen===a.correct;
    const icon=a.skipped?'⏭️':wasCorrect?'✅':'❌';
    let html='';
    if(a.skipped){html=`<div class="review-answer correct-ans">✓ Correct: ${q.opts[a.correct]}</div>`;}
    else if(!wasCorrect){
      html+=`<div class="review-answer your-wrong">✗ Your answer: ${q.opts[a.chosen]}</div>`;
      html+=`<div class="review-answer correct-ans">✓ Correct: ${q.opts[a.correct]}</div>`;
    } else {
      html=`<div class="review-answer your-correct">✓ ${q.opts[a.chosen]}</div>`;
    }
    return`<div class="review-item">
      <div class="review-item__q">${icon} Q${i+1}. ${q.q}</div>
      <div class="review-item__answers">${html}</div>
      <div class="review-item__exp">💡 ${q.exp}</div>
    </div>`;
  }).join('');
}

/* ═══════════════════════════════════════════════
   HOMEPAGE DATA
═══════════════════════════════════════════════ */
// CURRICULUM_LIST — loaded from pslearn-data.js

/* ═══════════════════════════════════════════════
   VISITED TOPICS TRACKER
═══════════════════════════════════════════════ */
const visited = new Set();
let currentTopicIndex = 0;

/* ═══════════════════════════════════════════════
   MOBILE DRAWER
═══════════════════════════════════════════════ */
function openDrawer() {
  const sb = document.getElementById('mobileSidebar');
  const ov = document.getElementById('drawerOverlay');
  if(sb) sb.classList.add('drawer-open');
  if(ov) ov.classList.add('visible');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  const sb = document.getElementById('mobileSidebar');
  const ov = document.getElementById('drawerOverlay');
  if(sb) sb.classList.remove('drawer-open');
  if(ov) ov.classList.remove('visible');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════
   HOMEPAGE SEARCH (Feature 2)
═══════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════
   HOMEPAGE SEARCH — FULL CONTENT
═══════════════════════════════════════════════ */
// Build a flat searchable index from ALL topic content once at load time
let SEARCH_INDEX = null;

function buildSearchIndex() {
  if (SEARCH_INDEX) return;
  SEARCH_INDEX = [];

  TOPICS.forEach((t, idx) => {
    // Collect ALL text from every part of the topic
    const chunks = [];

    // Title + summary
    chunks.push({text: t.title, label: 'Title'});
    chunks.push({text: t.summary, label: 'Summary'});

    // Key points
    (t.keyPoints || []).forEach(kp => chunks.push({text: kp, label: 'Key Takeaway'}));

    // Pre-checklist
    (t.preChecklist || []).forEach(c => chunks.push({text: c, label: 'Pre-Checklist'}));

    // Real world
    if (t.realWorld) chunks.push({text: t.realWorld.replace(/<[^>]+>/g,''), label: 'Real World'});

    // Mistakes
    (t.mistakes || []).forEach(m => {
      chunks.push({text: m.title, label: 'Common Mistake'});
      chunks.push({text: m.desc, label: 'Common Mistake'});
    });

    // Quiz questions
    (t.quiz || []).forEach(q => {
      chunks.push({text: q.q, label: 'Quiz Question'});
      chunks.push({text: q.explanation, label: 'Quiz Explanation'});
      q.options.forEach(o => chunks.push({text: o, label: 'Quiz Option'}));
    });

    // Section content
    (t.sections || []).forEach(sec => {
      chunks.push({text: sec.title, label: 'Section: ' + sec.title});
      // Strip markdown formatting from body
      const bodyText = sec.body
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^[-*]\s*/gm, '')
        .replace(/^\d+\.\s*/gm, '');
      chunks.push({text: bodyText, label: 'Section: ' + sec.title});
    });

    SEARCH_INDEX.push({topicIdx: idx, topic: t, chunks});
  });
}

function homepageSearch(val) {
  buildSearchIndex();
  const res = document.getElementById('homepageSearchResults');
  if (!res) return;
  const q = val.trim().toLowerCase();
  if (q.length < 2) { res.classList.remove('open'); res.innerHTML = ''; return; }

  // Score each topic — more matches = higher score, exact title match = top
  const results = [];

  SEARCH_INDEX.forEach(({topicIdx, topic, chunks}) => {
    let score = 0;
    let bestSnippet = null;
    let bestLabel = null;

    chunks.forEach(({text, label}) => {
      const lc = text.toLowerCase();
      const expandedQ = expandQuery(q);
      if (!lc.includes(q) && !lc.includes(expandedQ) && !fuzzyMatch(text, q)) return;

      // Score based on where match is found
      if (label === 'Title') score += 100;
      else if (label === 'Summary') score += 40;
      else if (label === 'Key Takeaway') score += 30;
      else if (label.startsWith('Section')) score += 20;
      else if (label === 'Common Mistake') score += 15;
      else if (label === 'Real World') score += 15;
      else if (label === 'Pre-Checklist') score += 10;
      else if (label === 'Quiz Question') score += 10;
      else score += 5;

      // Build snippet around the match
      if (!bestSnippet || score > 50) {
        const matchIdx = lc.indexOf(q);
        const start = Math.max(0, matchIdx - 40);
        const end = Math.min(text.length, matchIdx + q.length + 60);
        let snippet = text.slice(start, end).trim();
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';
        // Highlight the match
        const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
        snippet = snippet.replace(re, '<mark style="background:rgba(240,165,0,0.25);color:var(--gold);border-radius:3px;padding:0 2px">$1</mark>');
        bestSnippet = snippet;
        bestLabel = label;
      }
    });

    if (score > 0) {
      results.push({topicIdx, topic, score, snippet: bestSnippet, label: bestLabel});
    }
  });

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  if (!results.length) {
    res.innerHTML = `<div class="hp-no-result">No results for "<strong>${escapeHtml(val)}</strong>" — try a different keyword</div>`;
    res.classList.add('open');
    return;
  }

  const modColors = {0:'#818cf8',1:'#f0a500',2:'#22c55e',3:'#22d3ee',4:'#8b5cf6',5:'#f59e0b',6:'#ef4444'};

  res.innerHTML = results.slice(0, 10).map(({topicIdx, topic, snippet, label}) => {
    const mod = MODULES[topic.module];
    const color = modColors[topic.module] || '#818cf8';
    return `
    <div class="hp-result" onclick="openTopic(${topicIdx});document.getElementById('homepageSearchBar').value='';document.getElementById('homepageSearchResults').classList.remove('open')">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
        <span class="hp-result__num">${topic.num}</span>
        <span class="hp-result__dot" style="background:${color}"></span>
        <span class="hp-result__title" style="font-weight:600;color:var(--text)">${topic.title}</span>
        <span class="hp-result__module" style="margin-left:auto">${mod.icon} ${mod.name.replace('Module \\d+: ','')}</span>
      </div>
      ${snippet ? `<div style="font-size:12px;color:var(--faint);padding-left:30px;line-height:1.5">${snippet}</div>` : ''}
    </div>`;
  }).join('');
  res.classList.add('open');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function homepageSearchKey(e) {
  if (e.key === 'Escape') {
    document.getElementById('homepageSearchResults').classList.remove('open');
    e.target.blur();
  }
  if (e.key === 'Enter') {
    const first = document.querySelector('.hp-result');
    if (first) first.click();
  }
}

// Close search on outside click
document.addEventListener('click', e => {
  const bar = document.getElementById('homepageSearchBar');
  const results = document.getElementById('homepageSearchResults');
  if (bar && results && !bar.contains(e.target) && !results.contains(e.target)) {
    results.classList.remove('open');
  }
});

/* ═══════════════════════════════════════════════
   KEYBOARD NAVIGATION (Feature 4)
═══════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  // Only active when app view is visible and no input is focused
  const appView = document.getElementById('appView');
  if (!appView || appView.style.display === 'none') return;
  const focused = document.activeElement;
  if (focused && (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA')) return;

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    if (currentTopicIndex < TOPICS.length - 1) openTopic(currentTopicIndex + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (currentTopicIndex > 0) openTopic(currentTopicIndex - 1);
  }
});


/* ═══════════════════════════════════════════════
   VIEW MANAGEMENT
═══════════════════════════════════════════════ */
function showHome() {
  ['appView','glossaryView','quizView','interviewView','simulationView'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('homepageView').style.display = 'block';
  closeDrawer();
  showResumeBanner();
  window.scrollTo(0,0);
}

function showApp() {
  document.getElementById('homepageView').style.display = 'none';
  document.getElementById('appView').style.display = 'block';
  document.getElementById('glossaryView').style.display = 'none';
  document.getElementById('quizView').style.display = 'none';
}

function openTopic(index) {
  currentTopicIndex = index;
  visited.add(index);
  saveProgress(); // persist to localStorage
  showApp();
  buildSidebar();
  renderTopic(index);
  updateProgress();
  // Update mobile topbar
  const topic = TOPICS[index];
  const titleEl = document.getElementById('mobileTopicTitle');
  const countEl = document.getElementById('mobileTopicCount');
  if (titleEl) titleEl.textContent = topic.title;
  if (countEl) countEl.textContent = `${String(index+1).padStart(2,'0')}/${TOPICS.length}`;
  // Update desktop back bar breadcrumb
  const bc = document.getElementById('desktopTopicBreadcrumb');
  if (bc) bc.textContent = `Topic ${index+1} of ${TOPICS.length} — ${topic.title}`;
  // Close drawer after topic selection on mobile
  closeDrawer();
  // Auto-open first section
  setTimeout(() => {
    const firstHeader = document.querySelector('.section-block__header');
    if (firstHeader) firstHeader.click();
  }, 50);
}

/* ═══════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════ */
function buildSidebar(filter = '') {
  const body = document.getElementById('sidebarBody');
  body.innerHTML = '';

  let lastModule = -1;

  TOPICS.forEach((topic, idx) => {
    if (filter && !topic.title.toLowerCase().includes(filter.toLowerCase())) return;

    if (topic.module !== lastModule) {
      const mod = MODULES[topic.module];
      const header = document.createElement('div');
      header.className = 'sidebar__module-header';
      header.innerHTML = `<span>${mod.icon}</span><span style="color:${mod.color}">${mod.name}</span>`;
      body.appendChild(header);
      lastModule = topic.module;
    }

    const btn = document.createElement('button');
    btn.className = 'sidebar__topic' + (idx === currentTopicIndex ? ' active' : '');
    btn.innerHTML = `
      <span class="sidebar__topic-num">${topic.num}</span>
      <span style="flex:1;text-align:left">${topic.title}</span>
      ${visited.has(idx) && idx !== currentTopicIndex ? '<span style="color:var(--green);font-size:11px">✓</span>' : ''}
    `;
    btn.onclick = () => openTopic(idx);
    body.appendChild(btn);
  });
}

function filterTopics(val) {
  buildSidebar(val);
}

/* ═══════════════════════════════════════════════
   PROGRESS
═══════════════════════════════════════════════ */
function updateProgress() {
  const count = visited.size;
  const total = TOPICS.length;
  document.getElementById('progressText').textContent = `${count} / ${total}`;
  document.getElementById('progressFill').style.width = `${(count/total)*100}%`;
}

/* ═══════════════════════════════════════════════
   TOPIC RENDERER
═══════════════════════════════════════════════ */
function renderTopic(index) {
  const topic = TOPICS[index];
  const mod = MODULES[topic.module];
  const container = document.getElementById('topicContent');

  // ── PRE-CHECKLIST (Feature 7) ──
  const preChecklist = topic.preChecklist ? `
    <div class="prechecklist-box">
      <div class="prechecklist-box__label">📋 Before You Start — Know These First</div>
      <p class="prechecklist-box__sub">Tick off what you already know. If most are unfamiliar, start from Topic 01.</p>
      <div class="prechecklist-box__items">
        ${topic.preChecklist.map((item, ci) => `
          <label class="prechecklist-item" onclick="this.classList.toggle('checked')">
            <span class="prechecklist-item__box">✓</span>
            <span class="prechecklist-item__text">${item}</span>
          </label>
        `).join('')}
      </div>
    </div>` : '';

  let html = `
    <div class="topic-header">
      <div class="topic-module-badge">${mod.icon} ${mod.name}</div>
      <h1 class="topic-title">${topic.title}</h1>
      <p class="topic-summary">${topic.summary}</p>
    </div>

    ${preChecklist}

    <div class="key-points-box">
      <h3>⚡ Key Takeaways</h3>
      ${topic.keyPoints.map(pt => `
        <div class="key-point">
          <span class="key-point-arrow">→</span>
          <span class="key-point-text">${pt}</span>
        </div>
      `).join('')}
    </div>

    ${topic.sections.map((sec, si) => `
      <div class="section-block">
        <button class="section-block__header" onclick="toggleSection(this, ${si})">
          <span>${sec.title}</span>
          <span class="section-block__chevron">›</span>
        </button>
        <div class="section-block__body" id="sec-${index}-${si}" style="display:none">
          ${sec.diagram ? renderDiagram(sec.diagram) : ''}
          ${sec.uiIllustration ? renderUIIllustration(sec.uiIllustration) : ''}
          ${renderSectionBody(sec.body)}
          ${sec.pbLink ? `<a href="${sec.pbLink.url}" target="_blank" rel="noopener" class="pb-link">
            <span class="pb-link__icon">📖</span>
            <span class="pb-link__text">
              <span class="pb-link__title">${sec.pbLink.title}</span>
              <span class="pb-link__sub">Oracle PeopleBooks — docs.oracle.com ↗</span>
            </span>
          </a>` : ''}
        </div>
        <div class="section-block__preview" id="prev-${index}-${si}">
          ${sec.body.replace(/\*\*/g,'').replace(/`[^`]+`/g,'').substring(0,110).trim()}...
        </div>
      </div>
    `).join('')}
  `;

  // ── REAL-WORLD CALLOUT (Feature 12) ──
  if (topic.realWorld) {
    html += `
      <div class="realworld-box">
        <div class="realworld-box__label">🏢 Real-World Context</div>
        <div class="realworld-box__text">${topic.realWorld}</div>
      </div>`;
  }

  // ── COMMON MISTAKES (Feature 3) ──
  if (topic.mistakes && topic.mistakes.length) {
    html += `
      <div class="mistakes-box">
        <div class="mistakes-box__title">⚠️ Common Mistakes Beginners Make</div>
        ${topic.mistakes.map(m => `
          <div class="mistake-item">
            <div class="mistake-item__icon">❌</div>
            <div class="mistake-item__body">
              <div class="mistake-item__title">${m.title}</div>
              <div class="mistake-item__desc">${m.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  // ── MINI QUIZ (Feature 1) ──
  if (topic.quiz && topic.quiz.length) {
    html += `
      <div class="mini-quiz">
        <div class="mini-quiz__title">🧠 Quick Check — Test What You Learned</div>
        ${topic.quiz.map((q, qi) => `
          <div class="mini-quiz__q" id="mq-${index}-${qi}">
            <div class="mini-quiz__question">${qi + 1}. ${q.q}</div>
            <div class="mini-quiz__options">
              ${q.options.map((opt, oi) => `
                <button class="mini-quiz__opt" onclick="answerMiniQuiz(${index},${qi},${oi},${q.answer})" id="mqo-${index}-${qi}-${oi}">
                  <span class="mini-quiz__letter">${String.fromCharCode(65+oi)}</span>
                  ${opt}
                </button>
              `).join('')}
            </div>
            <div class="mini-quiz__explanation" id="mqe-${index}-${qi}">💡 ${q.explanation}</div>
          </div>
        `).join('')}
      </div>`;
  }

  // ── MODULE SUMMARY CARD (Feature 11) ──
  // Show when this is the last topic in its module
  const isLastInModule = index === TOPICS.length - 1 ||
    TOPICS[index + 1].module !== topic.module;
  if (isLastInModule) {
    const modTopics = TOPICS.filter(t => t.module === topic.module);
    html += `
      <div class="module-summary">
        <div class="module-summary__badge">✅ Module Complete</div>
        <div class="module-summary__title">${mod.icon} ${mod.name}</div>
        <div class="module-summary__sub">You've finished all ${modTopics.length} topics in this module. Here's what you covered:</div>
        <div class="module-summary__points">
          ${modTopics.map(t => `<span class="module-summary__point">📌 ${t.title}</span>`).join('')}
        </div>
        <div class="module-summary__actions">
          ${index < TOPICS.length - 1 ? `<button class="btn btn--gold btn--md" onclick="openTopic(${index+1})">Continue to ${MODULES[TOPICS[index+1].module].name} →</button>` : '<span style="color:var(--gold);font-weight:700;font-family:var(--fd)">🎉 You completed all Beginner topics!</span>'}
          <button class="btn btn--ghost btn--md" onclick="showHome()">Back to Home</button>
        </div>
      </div>`;
  }

  /* PREV / NEXT NAVIGATION */
  const prev = index > 0 ? TOPICS[index - 1] : null;
  const next = index < TOPICS.length - 1 ? TOPICS[index + 1] : null;

  html += `<div class="topic-nav">`;
  if (prev) {
    html += `
      <button class="topic-nav-btn" onclick="openTopic(${index-1})">
        <div>
          <span class="topic-nav-label">← Previous</span>
          <span class="topic-nav-title">${prev.title}</span>
        </div>
      </button>`;
  } else {
    html += `<div></div>`;
  }
  if (next) {
    html += `
      <button class="topic-nav-btn topic-nav-btn--next" onclick="openTopic(${index+1})">
        <div style="text-align:right">
          <span class="topic-nav-label">Next →</span>
          <span class="topic-nav-title">${next.title}</span>
        </div>
      </button>`;
  } else {
    html += `<div></div>`;
  }
  html += `</div>
  <div class="keyboard-hint">
    <span class="key-badge">←</span> Prev
    <span style="margin:0 6px;color:var(--border-hi)">·</span>
    <span class="key-badge">→</span> Next
    <span style="margin-left:8px;font-size:11px;color:var(--faint)">Use arrow keys to navigate topics</span>
  </div>`;

  container.innerHTML = html;
  container.scrollTop = 0;
}

function renderSectionBody(body) {
  const paragraphs = body.split('\n\n');
  return paragraphs.map(para => {
    para = para.trim();
    if (!para) return '';

    /* Code block — wrap with copy button */
    if (para.startsWith('```') || (para.startsWith('`') && para.includes('\n'))) {
      const code = para.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').replace(/^`\n?/, '').replace(/\n?`$/, '');
      const escaped = escHtml(code);
      return `<div class="code-wrap">
        <pre class="section-code">${escaped}</pre>
        <button class="copy-btn" onclick="copyCode(this,'${btoa(unescape(encodeURIComponent(code)))}')">
          <span>📋</span> Copy
        </button>
      </div>`;
    }

    /* Format inline */
    let formatted = para
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#a5b4fc">$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:#1e2340;color:#a5f3fc;padding:2px 6px;border-radius:4px;font-size:0.9em;font-family:var(--fm)">$1</code>');

    /* List detection */
    if (para.includes('\n- ') || para.startsWith('- ')) {
      const items = para.split('\n').filter(l => l.trim());
      return `<ul class="section-list">${items.map(item => {
        const text = item.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '')
          .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#a5b4fc">$1</strong>')
          .replace(/`([^`]+)`/g, '<code style="background:#1e2340;color:#a5f3fc;padding:2px 6px;border-radius:4px;font-size:0.9em;font-family:var(--fm)">$1</code>');
        return `<li>${text}</li>`;
      }).join('')}</ul>`;
    }

    return `<p class="section-para">${formatted}</p>`;
  }).join('');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ═══════════════════════════════════════════════
   DIAGRAM RENDERER
═══════════════════════════════════════════════ */
function renderDiagram(type) {
  if (type === 'eventflow') return renderEventFlowDiagram();
  if (type === 'pia') return renderPIADiagram();
  if (type === 'recordtypes') return renderRecordTypesDiagram();
  if (type === 'bufferlevels') return renderBufferLevelsDiagram();
  return '';
}

function renderEventFlowDiagram() {
  return `<div class="flow-diagram">
    <div class="diagram-card__title">🔄 Component Processor — Full Event Execution Flow</div>
    <svg viewBox="0 0 760 900" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:760px;font-family:'IBM Plex Sans',sans-serif">
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#6366f1"/>
        </marker>
        <marker id="arr-g" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#22c55e"/>
        </marker>
        <marker id="arr-a" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#f59e0b"/>
        </marker>
        <marker id="arr-r" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#ef4444"/>
        </marker>
      </defs>

      <!-- PHASE LABELS -->
      <rect x="10" y="10" width="120" height="22" rx="4" fill="rgba(34,197,94,0.15)" stroke="#22c55e" stroke-width="1"/>
      <text x="70" y="25" text-anchor="middle" font-size="10" fill="#22c55e" font-weight="600">COMPONENT LOAD</text>

      <rect x="10" y="370" width="120" height="22" rx="4" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="1"/>
      <text x="70" y="385" text-anchor="middle" font-size="10" fill="#f59e0b" font-weight="600">USER INTERACTION</text>

      <rect x="10" y="580" width="120" height="22" rx="4" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1"/>
      <text x="70" y="595" text-anchor="middle" font-size="10" fill="#ef4444" font-weight="600">SAVE SEQUENCE</text>

      <!-- ── LOAD PHASE NODES ── -->
      <!-- SearchInit -->
      <rect x="260" y="10" width="240" height="48" rx="10" fill="rgba(34,197,94,0.12)" stroke="#22c55e" stroke-width="1.5"/>
      <text x="380" y="30" text-anchor="middle" font-size="13" fill="#22c55e" font-weight="700">SearchInit</text>
      <text x="380" y="48" text-anchor="middle" font-size="10" fill="#9ba8c4">Fires before search dialog opens</text>

      <!-- SearchSave -->
      <rect x="260" y="90" width="240" height="48" rx="10" fill="rgba(34,197,94,0.12)" stroke="#22c55e" stroke-width="1.5"/>
      <text x="380" y="110" text-anchor="middle" font-size="13" fill="#22c55e" font-weight="700">SearchSave</text>
      <text x="380" y="128" text-anchor="middle" font-size="10" fill="#9ba8c4">User submits search criteria</text>

      <!-- RowSelect -->
      <rect x="260" y="170" width="240" height="48" rx="10" fill="rgba(34,197,94,0.12)" stroke="#22c55e" stroke-width="1.5"/>
      <text x="380" y="190" text-anchor="middle" font-size="13" fill="#22c55e" font-weight="700">RowSelect</text>
      <text x="380" y="208" text-anchor="middle" font-size="10" fill="#9ba8c4">SQL SELECT — filter rows with DiscardRow()</text>

      <!-- RowInit -->
      <rect x="260" y="250" width="240" height="48" rx="10" fill="rgba(34,197,94,0.12)" stroke="#22c55e" stroke-width="1.5"/>
      <text x="380" y="270" text-anchor="middle" font-size="13" fill="#22c55e" font-weight="700">RowInit</text>
      <text x="380" y="288" text-anchor="middle" font-size="10" fill="#ef4444">⚠ Fires for EVERY row — avoid SQL here</text>

      <!-- FieldDefault + FieldFormula -->
      <rect x="150" y="330" width="200" height="44" rx="10" fill="rgba(34,197,94,0.08)" stroke="#22c55e" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="250" y="348" text-anchor="middle" font-size="12" fill="#22c55e" font-weight="600">FieldDefault</text>
      <text x="250" y="365" text-anchor="middle" font-size="10" fill="#9ba8c4">Set default field values</text>

      <rect x="410" y="330" width="200" height="44" rx="10" fill="rgba(34,197,94,0.08)" stroke="#22c55e" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="510" y="348" text-anchor="middle" font-size="12" fill="#22c55e" font-weight="600">FieldFormula</text>
      <text x="510" y="365" text-anchor="middle" font-size="10" fill="#9ba8c4">Compute derived values</text>

      <!-- PostBuild -->
      <rect x="240" y="406" width="280" height="52" rx="10" fill="rgba(99,102,241,0.2)" stroke="#818cf8" stroke-width="2"/>
      <text x="380" y="428" text-anchor="middle" font-size="14" fill="#818cf8" font-weight="700">PostBuild ⭐</text>
      <text x="380" y="448" text-anchor="middle" font-size="10" fill="#9ba8c4">Component fully built — show/hide logic here</text>

      <!-- ── USER INTERACTION ── -->
      <line x1="380" y1="458" x2="380" y2="478" stroke="#6366f1" stroke-width="1.5" marker-end="url(#arr)"/>

      <!-- Activate -->
      <rect x="500" y="478" width="180" height="44" rx="10" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="590" y="497" text-anchor="middle" font-size="12" fill="#f59e0b" font-weight="600">Activate</text>
      <text x="590" y="513" text-anchor="middle" font-size="10" fill="#9ba8c4">Page tab activated</text>

      <!-- FieldEdit -->
      <rect x="150" y="478" width="180" height="44" rx="10" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="240" y="497" text-anchor="middle" font-size="12" fill="#f59e0b" font-weight="600">FieldEdit</text>
      <text x="240" y="513" text-anchor="middle" font-size="10" fill="#9ba8c4">Validate — return False to reject</text>

      <!-- FieldChange -->
      <rect x="260" y="548" width="240" height="44" rx="10" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="2"/>
      <text x="380" y="567" text-anchor="middle" font-size="13" fill="#f59e0b" font-weight="700">FieldChange</text>
      <text x="380" y="583" text-anchor="middle" font-size="10" fill="#9ba8c4">User changes a field value</text>

      <!-- ── SAVE SEQUENCE ── -->
      <line x1="380" y1="592" x2="380" y2="616" stroke="#ef4444" stroke-width="1.5" marker-end="url(#arr-r)"/>

      <!-- SaveEdit -->
      <rect x="230" y="616" width="300" height="52" rx="10" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="2"/>
      <text x="380" y="638" text-anchor="middle" font-size="14" fill="#ef4444" font-weight="700">SaveEdit ⭐</text>
      <text x="380" y="656" text-anchor="middle" font-size="10" fill="#9ba8c4">Business rule validation — Error stops save</text>

      <!-- SavePreChange -->
      <rect x="260" y="700" width="240" height="44" rx="10" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1.5"/>
      <text x="380" y="719" text-anchor="middle" font-size="12" fill="#ef4444" font-weight="600">SavePreChange</text>
      <text x="380" y="735" text-anchor="middle" font-size="10" fill="#9ba8c4">Last chance before DB write</text>

      <!-- DB Write -->
      <rect x="280" y="776" width="200" height="36" rx="8" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" stroke-width="1.5"/>
      <text x="380" y="799" text-anchor="middle" font-size="12" fill="#22d3ee" font-weight="600">🗃️ Database Commit</text>

      <!-- SavePostChange -->
      <rect x="260" y="844" width="240" height="44" rx="10" fill="rgba(239,68,68,0.12)" stroke="#ef4444" stroke-width="1.5"/>
      <text x="380" y="863" text-anchor="middle" font-size="12" fill="#ef4444" font-weight="600">SavePostChange</text>
      <text x="380" y="879" text-anchor="middle" font-size="10" fill="#9ba8c4">After DB commit — downstream updates</text>

      <!-- CONNECTOR LINES -->
      <line x1="380" y1="58" x2="380" y2="90" stroke="#22c55e" stroke-width="1.5" marker-end="url(#arr-g)"/>
      <line x1="380" y1="138" x2="380" y2="170" stroke="#22c55e" stroke-width="1.5" marker-end="url(#arr-g)"/>
      <line x1="380" y1="218" x2="380" y2="250" stroke="#22c55e" stroke-width="1.5" marker-end="url(#arr-g)"/>
      <line x1="380" y1="298" x2="250" y2="330" stroke="#22c55e" stroke-width="1" marker-end="url(#arr-g)"/>
      <line x1="380" y1="298" x2="510" y2="330" stroke="#22c55e" stroke-width="1" marker-end="url(#arr-g)"/>
      <line x1="250" y1="374" x2="340" y2="406" stroke="#22c55e" stroke-width="1" marker-end="url(#arr-g)"/>
      <line x1="510" y1="374" x2="420" y2="406" stroke="#22c55e" stroke-width="1" marker-end="url(#arr-g)"/>
      <line x1="280" y1="500" x2="310" y2="548" stroke="#f59e0b" stroke-width="1" marker-end="url(#arr-a)"/>
      <line x1="590" y1="522" x2="450" y2="548" stroke="#f59e0b" stroke-width="1" marker-end="url(#arr-a)"/>
      <line x1="380" y1="668" x2="380" y2="700" stroke="#ef4444" stroke-width="1.5" marker-end="url(#arr-r)"/>
      <line x1="380" y1="744" x2="380" y2="776" stroke="#ef4444" stroke-width="1.5" marker-end="url(#arr-r)"/>
      <line x1="380" y1="812" x2="380" y2="844" stroke="#ef4444" stroke-width="1.5" marker-end="url(#arr-r)"/>

      <!-- ⭐ LEGEND -->
      <rect x="590" y="840" width="160" height="50" rx="8" fill="var(--s2,#161b32)" stroke="var(--border,#232a48)" stroke-width="1"/>
      <text x="600" y="858" font-size="11" fill="#818cf8">⭐ = Most commonly used</text>
      <text x="600" y="874" font-size="11" fill="#ef4444">⚠ = Performance risk</text>
    </svg>
  </div>`;
}

function renderPIADiagram() {
  return `<div class="flow-diagram">
    <div class="diagram-card__title">🏗️ PeopleSoft Internet Architecture — Request Flow</div>
    <svg viewBox="0 0 700 140" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;font-family:'IBM Plex Sans',sans-serif">
      <defs>
        <marker id="a2" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#f0a500"/>
        </marker>
      </defs>
      <!-- Browser -->
      <rect x="10" y="40" width="130" height="60" rx="10" fill="rgba(34,197,94,0.1)" stroke="#22c55e" stroke-width="1.5"/>
      <text x="75" y="62" text-anchor="middle" font-size="18">🌐</text>
      <text x="75" y="82" text-anchor="middle" font-size="12" fill="#22c55e" font-weight="700">Browser</text>
      <text x="75" y="96" text-anchor="middle" font-size="9" fill="#9ba8c4">Chrome/Firefox/Edge</text>
      <!-- Arrow 1 -->
      <line x1="140" y1="70" x2="175" y2="70" stroke="#f0a500" stroke-width="2" marker-end="url(#a2)"/>
      <line x1="175" y1="70" x2="140" y2="70" stroke="#f0a500" stroke-width="1" stroke-dasharray="3,3"/>
      <text x="157" y="62" text-anchor="middle" font-size="8" fill="#f0a500">HTTP/S</text>
      <!-- WebLogic -->
      <rect x="175" y="40" width="130" height="60" rx="10" fill="rgba(99,102,241,0.1)" stroke="#818cf8" stroke-width="1.5"/>
      <text x="240" y="62" text-anchor="middle" font-size="18">⚙️</text>
      <text x="240" y="82" text-anchor="middle" font-size="12" fill="#818cf8" font-weight="700">WebLogic</text>
      <text x="240" y="96" text-anchor="middle" font-size="9" fill="#9ba8c4">Web Tier — Presentation</text>
      <!-- Arrow 2 -->
      <line x1="305" y1="70" x2="340" y2="70" stroke="#f0a500" stroke-width="2" marker-end="url(#a2)"/>
      <line x1="340" y1="70" x2="305" y2="70" stroke="#f0a500" stroke-width="1" stroke-dasharray="3,3"/>
      <text x="322" y="62" text-anchor="middle" font-size="8" fill="#f0a500">JOLT</text>
      <!-- Tuxedo -->
      <rect x="340" y="40" width="130" height="60" rx="10" fill="rgba(240,165,0,0.1)" stroke="#f0a500" stroke-width="2"/>
      <text x="405" y="62" text-anchor="middle" font-size="18">🧠</text>
      <text x="405" y="82" text-anchor="middle" font-size="12" fill="#f0a500" font-weight="700">Tuxedo App Server</text>
      <text x="405" y="96" text-anchor="middle" font-size="9" fill="#9ba8c4">PeopleCode · Business Logic</text>
      <!-- Arrow 3 -->
      <line x1="470" y1="70" x2="505" y2="70" stroke="#f0a500" stroke-width="2" marker-end="url(#a2)"/>
      <line x1="505" y1="70" x2="470" y2="70" stroke="#f0a500" stroke-width="1" stroke-dasharray="3,3"/>
      <text x="487" y="62" text-anchor="middle" font-size="8" fill="#f0a500">SQL</text>
      <!-- Database -->
      <rect x="505" y="40" width="130" height="60" rx="10" fill="rgba(239,68,68,0.1)" stroke="#ef4444" stroke-width="1.5"/>
      <text x="570" y="62" text-anchor="middle" font-size="18">🗃️</text>
      <text x="570" y="82" text-anchor="middle" font-size="12" fill="#ef4444" font-weight="700">Database</text>
      <text x="570" y="96" text-anchor="middle" font-size="9" fill="#9ba8c4">Oracle / SQL Server / DB2</text>
      <!-- Note -->
      <text x="350" y="125" text-anchor="middle" font-size="10" fill="#4e5a7a">All business logic executes in the App Server tier — never in the browser</text>
    </svg>
  </div>`;
}

function renderRecordTypesDiagram() {
  const types = [
    {name:'SQL Table',icon:'🗄️',color:'#22c55e',desc:'Creates PS_ table in DB'},
    {name:'SQL View',icon:'👁️',color:'#818cf8',desc:'Database view — read only'},
    {name:'Dynamic View',icon:'⚡',color:'#f59e0b',desc:'Runtime SQL — no DB object'},
    {name:'Derived/Work',icon:'💾',color:'#22d3ee',desc:'Memory only — no DB'},
    {name:'SubRecord',icon:'📎',color:'#f0a500',desc:'Reusable field groups'},
    {name:'Query View',icon:'🔍',color:'#9ba8c4',desc:'Created by PS Query'},
    {name:'Temp Table',icon:'⏱️',color:'#ef4444',desc:'AE parallel processing'},
  ];
  const cards = types.map((t,i) => {
    const x = (i % 4) * 170 + 10;
    const y = Math.floor(i/4) * 90 + 10;
    return `<g>
      <rect x="${x}" y="${y}" width="155" height="72" rx="10" fill="rgba(0,0,0,0.2)" stroke="${t.color}" stroke-width="1.5"/>
      <text x="${x+78}" y="${y+22}" text-anchor="middle" font-size="16">${t.icon}</text>
      <text x="${x+78}" y="${y+42}" text-anchor="middle" font-size="12" fill="${t.color}" font-weight="700">${t.name}</text>
      <text x="${x+78}" y="${y+60}" text-anchor="middle" font-size="10" fill="#9ba8c4">${t.desc}</text>
    </g>`;
  }).join('');
  return `<div class="flow-diagram">
    <div class="diagram-card__title">🗂️ The 7 PeopleSoft Record Types</div>
    <svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;font-family:'IBM Plex Sans',sans-serif">
      ${cards}
    </svg>
  </div>`;
}

function renderBufferLevelsDiagram() {
  return `<div class="flow-diagram">
    <div class="diagram-card__title">📦 Component Buffer Hierarchy — Scroll Levels</div>
    <svg viewBox="0 0 660 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:660px;font-family:'IBM Plex Sans',sans-serif">
      <!-- Level 0 -->
      <rect x="200" y="10" width="260" height="54" rx="10" fill="rgba(240,165,0,0.15)" stroke="#f0a500" stroke-width="2"/>
      <text x="330" y="33" text-anchor="middle" font-size="13" fill="#f0a500" font-weight="700">Level 0 — Primary Record</text>
      <text x="330" y="52" text-anchor="middle" font-size="10" fill="#9ba8c4">Always 1 row · e.g., EMPLOYMENT record</text>
      <text x="90" y="40" text-anchor="middle" font-size="11" fill="#f0a500" font-weight="600">GetRowset()</text>

      <!-- Arrow down -->
      <line x1="280" y1="64" x2="260" y2="90" stroke="#6366f1" stroke-width="1.5"/>
      <line x1="380" y1="64" x2="400" y2="90" stroke="#6366f1" stroke-width="1.5"/>

      <!-- Level 1 rows -->
      <rect x="60" y="90" width="250" height="52" rx="10" fill="rgba(99,102,241,0.15)" stroke="#818cf8" stroke-width="1.5"/>
      <text x="185" y="112" text-anchor="middle" font-size="12" fill="#818cf8" font-weight="700">Level 1 — Child Rows (Scroll/Grid)</text>
      <text x="185" y="130" text-anchor="middle" font-size="10" fill="#9ba8c4">Many rows · e.g., JOB rows (effective dated)</text>

      <rect x="350" y="90" width="250" height="52" rx="10" fill="rgba(99,102,241,0.15)" stroke="#818cf8" stroke-width="1.5"/>
      <text x="475" y="112" text-anchor="middle" font-size="12" fill="#818cf8" font-weight="700">Level 1 — Another Child Scroll</text>
      <text x="475" y="130" text-anchor="middle" font-size="10" fill="#9ba8c4">Multiple grids can exist at Level 1</text>

      <!-- Rowset label -->
      <text x="30" y="120" text-anchor="middle" font-size="11" fill="#818cf8" font-weight="600">GetRowset</text>
      <text x="30" y="134" text-anchor="middle" font-size="11" fill="#818cf8" font-weight="600">(Scroll.JOB)</text>

      <!-- Arrow down from level 1 left -->
      <line x1="185" y1="142" x2="185" y2="168" stroke="#22d3ee" stroke-width="1.5"/>

      <!-- Level 2 -->
      <rect x="60" y="168" width="250" height="52" rx="10" fill="rgba(34,211,238,0.12)" stroke="#22d3ee" stroke-width="1.5"/>
      <text x="185" y="190" text-anchor="middle" font-size="12" fill="#22d3ee" font-weight="700">Level 2 — Grandchild Rows</text>
      <text x="185" y="208" text-anchor="middle" font-size="10" fill="#9ba8c4">Scroll within a scroll — less common</text>

      <!-- Code snippet -->
      <rect x="60" y="240" width="540" height="32" rx="6" fill="rgba(7,9,17,0.8)" stroke="#232a48" stroke-width="1"/>
      <text x="330" y="260" text-anchor="middle" font-size="11" fill="#a5f3fc" font-family="IBM Plex Mono,monospace">GetRowset() → GetRow(n) → GetRecord(Record.JOB) → DEPTID.Value</text>
    </svg>
  </div>`;
}

/* ═══════════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════════ */
function toggleTheme() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const newTheme = isLight ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  const knob = document.getElementById('themeKnob');
  const label = document.getElementById('themeLabel');
  if (knob) knob.textContent = newTheme === 'light' ? '☀️' : '🌙';
  if (label) label.textContent = newTheme === 'light' ? 'Day' : 'Night';
  localStorage.setItem('pslearn-theme', newTheme);
}
// Restore saved theme on load
(function(){
  const saved = localStorage.getItem('pslearn-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  // Labels set after DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    const knob = document.getElementById('themeKnob');
    const label = document.getElementById('themeLabel');
    if (knob) knob.textContent = saved === 'light' ? '☀️' : '🌙';
    if (label) label.textContent = saved === 'light' ? 'Day' : 'Night';
  });
})();

function toggleSection(btn, si) {
  const chevron = btn.querySelector('.section-block__chevron');
  const bodyId = btn.closest('.section-block').querySelector('[id^="sec-"]').id;
  const prevId = btn.closest('.section-block').querySelector('[id^="prev-"]').id;
  const body = document.getElementById(bodyId);
  const prev = document.getElementById(prevId);
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  prev.style.display = isOpen ? 'block' : 'none';
  chevron.classList.toggle('open', !isOpen);
}

/* ═══════════════════════════════════════════════
   MINI QUIZ HANDLER
═══════════════════════════════════════════════ */
function answerMiniQuiz(topicIdx, qIdx, chosen, correct) {
  const opts = document.querySelectorAll(`[id^="mqo-${topicIdx}-${qIdx}-"]`);
  opts.forEach(btn => {
    btn.disabled = true;
    const oi = parseInt(btn.id.split('-').pop());
    if (oi === correct) btn.classList.add('correct');
    else if (oi === chosen && chosen !== correct) btn.classList.add('wrong');
    else if (oi !== chosen) btn.classList.add('reveal-correct');
  });
  // Show correct answer highlight
  if (chosen === correct) {
    opts[correct].innerHTML = opts[correct].innerHTML.replace('class="mini-quiz__letter"','class="mini-quiz__letter" style="background:var(--green);color:#fff"');
  }
  document.getElementById(`mqe-${topicIdx}-${qIdx}`).classList.add('show');
}

/* ═══════════════════════════════════════════════
   UI ILLUSTRATION RENDERER (Feature 9)
═══════════════════════════════════════════════ */
function renderUIIllustration(type) {
  if (type === 'appdesigner') return renderAppDesignerSVG();
  if (type === 'recorddef') return renderRecordDefSVG();
  if (type === 'pagedesign') return renderPageDesignSVG();
  return '';
}

function renderAppDesignerSVG() {
  return `<div class="ui-illustration">
    <svg viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg" style="font-family:'IBM Plex Sans',sans-serif">
      <!-- Window chrome -->
      <rect width="720" height="420" fill="#1a1a2e"/>
      <rect width="720" height="32" fill="#2d2d4e"/>
      <circle cx="14" cy="16" r="5" fill="#ff5f57"/><circle cx="30" cy="16" r="5" fill="#febc2e"/><circle cx="46" cy="16" r="5" fill="#28c840"/>
      <text x="340" y="21" text-anchor="middle" font-size="12" fill="#9ba8c4" font-weight="600">Application Designer — PeopleSoft</text>
      <!-- Menu bar -->
      <rect y="32" width="720" height="24" fill="#252545"/>
      <text x="12" y="49" font-size="11" fill="#c8d0e8">File</text>
      <text x="40" y="49" font-size="11" fill="#c8d0e8">Edit</text>
      <text x="68" y="49" font-size="11" fill="#c8d0e8">View</text>
      <text x="96" y="49" font-size="11" fill="#c8d0e8">Insert</text>
      <text x="132" y="49" font-size="11" fill="#c8d0e8">Build</text>
      <text x="162" y="49" font-size="11" fill="#c8d0e8">Debug</text>
      <text x="200" y="49" font-size="11" fill="#c8d0e8">Tools</text>
      <text x="232" y="49" font-size="11" fill="#c8d0e8">Help</text>
      <!-- LEFT PANEL — Project Workspace -->
      <rect x="0" y="56" width="185" height="280" fill="#141428"/>
      <rect x="0" y="56" width="185" height="22" fill="#1e1e3a"/>
      <text x="8" y="71" font-size="11" fill="#818cf8" font-weight="600">Project Workspace</text>
      <!-- Tree items -->
      <text x="12" y="95" font-size="11" fill="#f0a500">📁 MY_PROJECT</text>
      <text x="24" y="113" font-size="11" fill="#9ba8c4">📄 Records (3)</text>
      <rect x="24" y="117" width="158" height="18" rx="3" fill="rgba(99,102,241,0.2)"/>
      <text x="36" y="129" font-size="11" fill="#e8edf8">  🗄️ CUSTOM_EMP</text>
      <text x="36" y="147" font-size="11" fill="#9ba8c4">  🗄️ CUSTOM_DEPT</text>
      <text x="24" y="165" font-size="11" fill="#9ba8c4">📄 Pages (2)</text>
      <text x="36" y="183" font-size="11" fill="#9ba8c4">  🖥️ CUSTOM_PG</text>
      <text x="24" y="201" font-size="11" fill="#9ba8c4">📄 Components (1)</text>
      <text x="36" y="219" font-size="11" fill="#9ba8c4">  ⚙️ CUSTOM_COMP</text>
      <text x="24" y="237" font-size="11" fill="#9ba8c4">📄 PeopleCode (4)</text>
      <!-- Divider -->
      <line x1="185" y1="56" x2="185" y2="336" stroke="#2e3760" stroke-width="1"/>
      <!-- CENTER — Record Definition -->
      <rect x="186" y="56" width="390" height="280" fill="#0f1020"/>
      <rect x="186" y="56" width="390" height="22" fill="#1a1a35"/>
      <text x="194" y="71" font-size="11" fill="#22d3ee" font-weight="600">Record: CUSTOM_EMP_DATA (SQL Table)</text>
      <!-- Column headers -->
      <rect x="186" y="78" width="390" height="20" fill="#1d2340"/>
      <text x="194" y="92" font-size="10" fill="#9ba8c4" font-weight="600">FIELD NAME</text>
      <text x="320" y="92" font-size="10" fill="#9ba8c4" font-weight="600">TYPE</text>
      <text x="380" y="92" font-size="10" fill="#9ba8c4" font-weight="600">LEN</text>
      <text x="420" y="92" font-size="10" fill="#9ba8c4" font-weight="600">KEY</text>
      <text x="460" y="92" font-size="10" fill="#9ba8c4" font-weight="600">SRCH</text>
      <text x="510" y="92" font-size="10" fill="#9ba8c4" font-weight="600">LIST</text>
      <!-- Rows -->
      ${[
        {n:'EMPLID',t:'Char',l:'11',k:'K',s:'✓',li:'✓',bg:'rgba(240,165,0,0.08)'},
        {n:'EFFDT',t:'Date',l:'10',k:'K',s:'',li:'',bg:'rgba(240,165,0,0.08)'},
        {n:'EFFSEQ',t:'Nbr',l:'3',k:'K',s:'',li:'',bg:'rgba(240,165,0,0.08)'},
        {n:'DEPTID',t:'Char',l:'10',k:'',s:'A',li:'✓',bg:''},
        {n:'JOBCODE',t:'Char',l:'6',k:'',s:'',li:'',bg:''},
        {n:'COMPRATE',t:'Nbr',l:'18',k:'',s:'',li:'',bg:''},
        {n:'EMPL_STATUS',t:'Char',l:'1',k:'',s:'',li:'',bg:''},
      ].map((r,i) => `
        <rect x="186" y="${98+i*22}" width="390" height="22" fill="${r.bg || (i%2===0?'#0d0f1e':'#111228')}"/>
        <text x="194" y="${113+i*22}" font-size="11" fill="${r.k==='K'?'#f0a500':'#e8edf8'}">${r.n}</text>
        <text x="320" y="${113+i*22}" font-size="11" fill="#9ba8c4">${r.t}</text>
        <text x="380" y="${113+i*22}" font-size="11" fill="#9ba8c4">${r.l}</text>
        <text x="425" y="${113+i*22}" font-size="11" fill="#f0a500" font-weight="700">${r.k}</text>
        <text x="462" y="${113+i*22}" font-size="11" fill="#22c55e">${r.s}</text>
        <text x="512" y="${113+i*22}" font-size="11" fill="#818cf8">${r.li}</text>
      `).join('')}
      <!-- RIGHT PANEL — Properties -->
      <rect x="576" y="56" width="144" height="280" fill="#12121f"/>
      <rect x="576" y="56" width="144" height="22" fill="#1e1e38"/>
      <text x="582" y="71" font-size="11" fill="#f59e0b" font-weight="600">Field Properties</text>
      <line x1="576" y1="56" x2="576" y2="336" stroke="#2e3760" stroke-width="1"/>
      <text x="582" y="96" font-size="10" fill="#9ba8c4">Field Name</text>
      <text x="582" y="110" font-size="11" fill="#e8edf8" font-weight="600">EMPLID</text>
      <text x="582" y="130" font-size="10" fill="#9ba8c4">Type</text>
      <text x="582" y="144" font-size="11" fill="#22d3ee">Character</text>
      <text x="582" y="164" font-size="10" fill="#9ba8c4">Length</text>
      <text x="582" y="178" font-size="11" fill="#e8edf8">11</text>
      <text x="582" y="198" font-size="10" fill="#9ba8c4">Label</text>
      <text x="582" y="212" font-size="11" fill="#e8edf8">Employee ID</text>
      <text x="582" y="232" font-size="10" fill="#9ba8c4">Key Type</text>
      <rect x="582" y="238" width="60" height="16" rx="3" fill="rgba(240,165,0,0.15)" stroke="#f0a500" stroke-width="1"/>
      <text x="612" y="250" text-anchor="middle" font-size="10" fill="#f0a500" font-weight="700">Primary Key</text>
      <!-- OUTPUT WINDOW -->
      <rect x="0" y="336" width="720" height="84" fill="#0a0a18"/>
      <rect x="0" y="336" width="720" height="20" fill="#161628"/>
      <text x="8" y="350" font-size="11" fill="#9ba8c4" font-weight="600">Output Window</text>
      <text x="8" y="370" font-size="11" fill="#22c55e">Build process started for CUSTOM_EMP_DATA...</text>
      <text x="8" y="386" font-size="11" fill="#22c55e">CREATE TABLE PS_CUSTOM_EMP_DATA ... Done.</text>
      <text x="8" y="402" font-size="11" fill="#818cf8">Build Complete — 1 table created, 0 errors.</text>
      <!-- Label -->
      <rect x="560" y="394" width="155" height="20" rx="4" fill="rgba(240,165,0,0.1)" stroke="#f0a500" stroke-width="1"/>
      <text x="637" y="408" text-anchor="middle" font-size="10" fill="#f0a500">App Designer — Illustrated</text>
    </svg>
  </div>`;
}

function renderRecordDefSVG() {
  return `<div class="ui-illustration">
    <svg viewBox="0 0 660 200" xmlns="http://www.w3.org/2000/svg" style="font-family:'IBM Plex Sans',sans-serif">
      <rect width="660" height="200" rx="10" fill="#0f1020"/>
      <!-- Record type badges -->
      ${[
        {x:10,label:'SQL Table',sub:'Creates PS_ table in DB',color:'#22c55e',icon:'🗄️'},
        {x:115,label:'SQL View',sub:'Read-only DB view',color:'#818cf8',icon:'👁️'},
        {x:220,label:'Dynamic View',sub:'Runtime SQL — no DB obj',color:'#f59e0b',icon:'⚡'},
        {x:325,label:'Derived/Work',sub:'Memory only — no DB',color:'#22d3ee',icon:'💾'},
        {x:430,label:'SubRecord',sub:'Reusable field groups',color:'#f0a500',icon:'📎'},
        {x:535,label:'Temp Table',sub:'AE parallel jobs',color:'#ef4444',icon:'⏱️'},
      ].map(r=>`
        <rect x="${r.x}" y="20" width="98" height="78" rx="8" fill="rgba(0,0,0,0.3)" stroke="${r.color}" stroke-width="1.5"/>
        <text x="${r.x+49}" y="46" text-anchor="middle" font-size="18">${r.icon}</text>
        <text x="${r.x+49}" y="66" text-anchor="middle" font-size="10" fill="${r.color}" font-weight="700">${r.label}</text>
        <text x="${r.x+49}" y="82" text-anchor="middle" font-size="9" fill="#9ba8c4">${r.sub}</text>
      `).join('')}
      <!-- PS_ prefix explanation -->
      <rect x="10" y="115" width="300" height="70" rx="8" fill="rgba(240,165,0,0.06)" stroke="rgba(240,165,0,0.2)" stroke-width="1"/>
      <text x="20" y="135" font-size="11" fill="#f0a500" font-weight="700">🔑 Naming Convention</text>
      <text x="20" y="153" font-size="11" fill="#9ba8c4">Record name in App Designer: </text>
      <text x="220" y="153" font-size="11" fill="#22d3ee" font-weight="700">JOB</text>
      <text x="20" y="171" font-size="11" fill="#9ba8c4">Physical DB table name: </text>
      <text x="185" y="171" font-size="11" fill="#f0a500" font-weight="700">PS_JOB</text>
      <!-- Key types -->
      <rect x="325" y="115" width="325" height="70" rx="8" fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.2)" stroke-width="1"/>
      <text x="335" y="135" font-size="11" fill="#818cf8" font-weight="700">🗝️ Field Key Types</text>
      <text x="335" y="153" font-size="11" fill="#f0a500">K = Primary Key  </text>
      <text x="445" y="153" font-size="11" fill="#22c55e">A = Alt Search Key</text>
      <text x="335" y="171" font-size="11" fill="#818cf8">L = List Box Item  </text>
      <text x="445" y="171" font-size="11" fill="#9ba8c4">S = Search Key</text>
    </svg>
  </div>`;
}

function renderPageDesignSVG() {
  return `<div class="ui-illustration">
    <svg viewBox="0 0 660 280" xmlns="http://www.w3.org/2000/svg" style="font-family:'IBM Plex Sans',sans-serif">
      <rect width="660" height="280" rx="10" fill="#0f1020"/>
      <text x="20" y="28" font-size="12" fill="#f0a500" font-weight="700">Page Layout — Application Designer Canvas</text>
      <!-- Page canvas area -->
      <rect x="10" y="38" width="430" height="230" rx="6" fill="#0a0c18" stroke="#232a48" stroke-width="1"/>
      <!-- Group Box -->
      <rect x="20" y="48" width="410" height="100" rx="6" fill="none" stroke="#2e3760" stroke-width="1.5" stroke-dasharray="4,3"/>
      <text x="28" y="44" font-size="10" fill="#818cf8" font-weight="600">Group Box: Employee Information</text>
      <!-- Edit Boxes -->
      <text x="30" y="72" font-size="10" fill="#9ba8c4">Employee ID</text>
      <rect x="30" y="76" width="100" height="18" rx="3" fill="#161b32" stroke="#2e3760" stroke-width="1"/>
      <text x="36" y="89" font-size="10" fill="#f0a500">E12345</text>
      <text x="145" y="72" font-size="10" fill="#9ba8c4">Employee Name</text>
      <rect x="145" y="76" width="160" height="18" rx="3" fill="#161b32" stroke="#2e3760" stroke-width="1"/>
      <text x="151" y="89" font-size="10" fill="#e8edf8">John Smith</text>
      <!-- Drop Down -->
      <text x="30" y="112" font-size="10" fill="#9ba8c4">Status</text>
      <rect x="30" y="116" width="100" height="18" rx="3" fill="#161b32" stroke="#2e3760" stroke-width="1"/>
      <text x="36" y="129" font-size="10" fill="#22c55e">Active</text>
      <text x="118" y="129" font-size="10" fill="#9ba8c4">▼</text>
      <!-- Date field -->
      <text x="145" y="112" font-size="10" fill="#9ba8c4">Hire Date</text>
      <rect x="145" y="116" width="100" height="18" rx="3" fill="#161b32" stroke="#2e3760" stroke-width="1"/>
      <text x="151" y="129" font-size="10" fill="#e8edf8">01/01/2024</text>
      <!-- Grid -->
      <rect x="20" y="155" width="410" height="100" rx="6" fill="none" stroke="#2e3760" stroke-width="1.5" stroke-dasharray="4,3"/>
      <text x="28" y="151" font-size="10" fill="#818cf8" font-weight="600">Grid: Job History (PS_JOB)</text>
      <rect x="20" y="156" width="410" height="18" fill="#1d2340"/>
      <text x="28" y="169" font-size="10" fill="#9ba8c4" font-weight="600">EFFDT</text>
      <text x="120" y="169" font-size="10" fill="#9ba8c4" font-weight="600">ACTION</text>
      <text x="220" y="169" font-size="10" fill="#9ba8c4" font-weight="600">DEPTID</text>
      <text x="320" y="169" font-size="10" fill="#9ba8c4" font-weight="600">COMPRATE</text>
      ${[
        {d:'2024-01-01',a:'HIR',dep:'HR001',c:'75,000'},
        {d:'2024-07-01',a:'PRO',dep:'HR001',c:'85,000'},
        {d:'2025-01-01',a:'PAY',dep:'FIN002',c:'90,000'},
      ].map((r,i)=>`
        <rect x="20" y="${174+i*22}" width="410" height="22" fill="${i%2===0?'#0d0f1e':'#111228'}"/>
        <text x="28" y="${189+i*22}" font-size="10" fill="#e8edf8">${r.d}</text>
        <text x="120" y="${189+i*22}" font-size="10" fill="#f0a500">${r.a}</text>
        <text x="220" y="${189+i*22}" font-size="10" fill="#e8edf8">${r.dep}</text>
        <text x="320" y="${189+i*22}" font-size="10" fill="#22c55e">${r.c}</text>
      `).join('')}
      <!-- Right panel: controls palette -->
      <rect x="450" y="38" width="200" height="230" rx="6" fill="#141428" stroke="#232a48" stroke-width="1"/>
      <text x="460" y="56" font-size="11" fill="#f59e0b" font-weight="700">Controls Palette</text>
      ${[
        {icon:'⬜',name:'Edit Box','col':'#e8edf8'},
        {icon:'▼',name:'Drop Down','col':'#e8edf8'},
        {icon:'☑',name:'Check Box','col':'#e8edf8'},
        {icon:'◉',name:'Radio Button','col':'#e8edf8'},
        {icon:'🔲',name:'Push Button','col':'#e8edf8'},
        {icon:'📋',name:'Grid','col':'#818cf8'},
        {icon:'📄',name:'Sub Page','col':'#22c55e'},
        {icon:'📦',name:'Group Box','col':'#f0a500'},
        {icon:'🖼️',name:'Image','col':'#9ba8c4'},
      ].map((c,i)=>`
        <rect x="458" y="${62+i*22}" width="184" height="20" rx="4" fill="${i===5?'rgba(99,102,241,0.12)':i===6?'rgba(34,197,94,0.08)':'transparent'}"/>
        <text x="465" y="${77+i*22}" font-size="13">${c.icon}</text>
        <text x="485" y="${77+i*22}" font-size="11" fill="${c.col}">${c.name}</text>
      `).join('')}
      <!-- Label -->
      <rect x="450" y="254" width="200" height="14" rx="3" fill="rgba(240,165,0,0.08)"/>
      <text x="550" y="265" text-anchor="middle" font-size="9" fill="#f0a500">Page Designer — Illustrated</text>
    </svg>
  </div>`;
}

/* ═══════════════════════════════════════════════
   GLOSSARY DATA & FUNCTIONS (Feature 10)
═══════════════════════════════════════════════ */
// GLOSSARY — loaded from pslearn-data.js

let currentGlossaryFilter = 'all';

function showGlossary() {
  document.getElementById('homepageView').style.display = 'none';
  document.getElementById('appView').style.display = 'none';
  document.getElementById('glossaryView').style.display = 'block';
  renderGlossary('', 'all');
  window.scrollTo(0,0);
}

function filterGlossary(val) {
  renderGlossary(val, currentGlossaryFilter);
}

function setGlossaryFilter(cat, btn) {
  currentGlossaryFilter = cat;
  document.querySelectorAll('.glossary-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const searchVal = document.getElementById('glossarySearch').value;
  renderGlossary(searchVal, cat);
}

function renderGlossary(search, cat) {
  const container = document.getElementById('glossaryContent');
  let terms = GLOSSARY;
  if (cat !== 'all') terms = terms.filter(t => t.cat === cat);
  if (search) terms = terms.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.def.toLowerCase().includes(search.toLowerCase())
  );
  if (!terms.length) {
    container.innerHTML = `<div class="glossary-empty">No terms found for "<strong>${search}</strong>"</div>`;
    return;
  }
  // Group by first letter
  const grouped = {};
  terms.forEach(t => {
    const letter = t.term[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(t);
  });
  const catColors = {technical:'cat-technical',hcm:'cat-hcm',fscm:'cat-fscm',architecture:'cat-architecture',development:'cat-development'};
  const catLabels = {technical:'Technical',hcm:'HCM',fscm:'FSCM',architecture:'Architecture',development:'Development'};
  let html = '';
  Object.keys(grouped).sort().forEach(letter => {
    html += `<div class="glossary-letter-group">
      <div class="glossary-letter">${letter}</div>
      ${grouped[letter].map((t,i) => `
        <div class="glossary-term" onclick="toggleGlossaryTerm(this)">
          <div class="glossary-term__header">
            <span class="glossary-term__name">${t.term}</span>
            <span class="glossary-term__category ${catColors[t.cat]}">${catLabels[t.cat]}</span>
          </div>
          <div class="glossary-term__def">${t.def}</div>
        </div>
      `).join('')}
    </div>`;
  });
  container.innerHTML = html;
}

function toggleGlossaryTerm(el) {
  const def = el.querySelector('.glossary-term__def');
  def.classList.toggle('open');
}



/* ═══════════════════════════════════════════════
   COPY CODE (Feature 3)
═══════════════════════════════════════════════ */
function copyCode(btn, b64) {
  try {
    const text = decodeURIComponent(escape(atob(b64)));
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      btn.innerHTML = '<span>✅</span> Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<span>📋</span> Copy';
      }, 2000);
    });
  } catch(e) {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = decodeURIComponent(escape(atob(b64)));
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.classList.add('copied');
    btn.innerHTML = '<span>✅</span> Copied!';
    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = '<span>📋</span> Copy'; }, 2000);
  }
}


/* Build curriculum topic grids */
['b','i','a'].forEach(level => {
  const grid = document.getElementById(`topics-${level}`);
  if (!grid) return;
  CURRICULUM_LIST[level].forEach((topic, i) => {
    const div = document.createElement('div');
    div.className = 'topic-item';
    const isClickable = level === 'b';
    div.innerHTML = `
      <span class="topic-item__num">${String(i+1).padStart(2,'0')}</span>
      <span class="topic-item__dot dot--${level}"></span>
      <span>${topic}</span>
      <span class="topic-item__arrow">›</span>
    `;
    if (isClickable) div.onclick = () => openTopic(i);
    grid.appendChild(div);
  });
});

/* Curriculum tab switcher */
function switchTab(btn, level) {
  document.querySelectorAll('.curriculum-tab').forEach(t => t.classList.remove('ab','ai','aa'));
  document.querySelectorAll('.curriculum-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('a' + level);
  document.getElementById(`panel-${level}`).classList.add('active');
}

/* Marquee */
const allTopics = [...CURRICULUM_LIST.b, ...CURRICULUM_LIST.i, ...CURRICULUM_LIST.a];
const track = document.getElementById('marqueeTrack');
[...allTopics, ...allTopics].forEach(t => {
  const span = document.createElement('span');
  span.className = 'marquee-item';
  span.innerHTML = `<span>✦</span>${t}`;
  track.appendChild(span);
});

/* Scroll reveal */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* Nav scroll border */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  mainNav.style.borderBottomColor = window.scrollY > 60 ? 'rgba(45,55,96,.9)' : 'var(--border)';
}, { passive: true });

/* Counter animation */
function animateCounters() {
  document.querySelectorAll('.stat-item__number').forEach(el => {
    const target = parseInt(el.textContent);
    if (isNaN(target)) return;
    const suffix = el.textContent.replace(/[0-9]/g, '');
    let start = 0;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1600, 1);
      el.textContent = Math.floor((1 - Math.pow(1-p,3)) * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
const statsObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { animateCounters(); statsObs.disconnect(); }
}, { threshold: 0.5 });
const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObs.observe(statsBar);

// Load saved progress on startup
loadProgress();
updateProgress();
showResumeBanner();
