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

/* ═══════════════════════════════════════════════
   PRO INTERVIEW ENGINE
═══════════════════════════════════════════════ */
let iqaState = {
  level: 'all',
  cat: 'all',
  search: '',
  reviewed: new Set(),
  bookmarked: new Set(),
};

function showInterview() {
  ['homepageView','appView','glossaryView','quizView','labView'].forEach(id => {
    const el = document.getElementById(id); if(el) el.style.display='none';
  });
  document.getElementById('interviewView').style.display = 'block';
  buildIQACatSidebar();
  renderIQA();
  window.scrollTo(0,0);
}

function buildIQACatSidebar() {
  const cats = ['all', ...new Set(INTERVIEW_QA.map(q => q.cat))];
  const sidebar = document.getElementById('iqaCatSidebar');
  sidebar.innerHTML = cats.map(cat => {
    const count = cat === 'all' ? INTERVIEW_QA.length : INTERVIEW_QA.filter(q => q.cat === cat).length;
    return `<button class="iqa-cat-btn ${cat === iqaState.cat ? 'active' : ''}"
      onclick="setIQACat('${cat}',this)">
      <span>${cat === 'all' ? 'All Categories' : cat}</span>
      <span class="iqa-cat-count">${count}</span>
    </button>`;
  }).join('');
}

function setIQACat(cat, btn) {
  iqaState.cat = cat;
  document.querySelectorAll('.iqa-cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderIQA();
}

function setIQALevel(level, btn) {
  iqaState.level = level;
  document.querySelectorAll('.iqa-pro-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderIQA();
}

function filterIQA() {
  iqaState.search = document.getElementById('iqaSearchBar').value.toLowerCase();
  renderIQA();
}

function renderIQA() {
  let qs = INTERVIEW_QA;
  if (iqaState.level !== 'all') qs = qs.filter(q => q.level === iqaState.level);
  if (iqaState.cat !== 'all') qs = qs.filter(q => q.cat === iqaState.cat);
  if (iqaState.search) qs = qs.filter(q =>
    q.q.toLowerCase().includes(iqaState.search) ||
    q.a.toLowerCase().includes(iqaState.search) ||
    q.cat.toLowerCase().includes(iqaState.search)
  );

  const levelTag = {beginner:'🌱 Beginner',intermediate:'⚡ Intermediate',advanced:'🔥 Advanced',scenario:'🏢 Real Project'};
  const levelClass = {beginner:'tag-level-b',intermediate:'tag-level-i',advanced:'tag-level-a',scenario:'tag-level-s'};
  const numClass = {beginner:'num-beginner',intermediate:'num-intermediate',advanced:'num-advanced',scenario:'num-scenario'};

  document.getElementById('iqaPanelTitle').textContent =
    iqaState.cat === 'all' ? 'All Questions' : iqaState.cat;
  document.getElementById('iqaPanelCount').textContent = `${qs.length} question${qs.length !== 1 ? 's' : ''}`;

  document.getElementById('iqaContent').innerHTML = qs.length === 0
    ? `<div style="padding:40px;text-align:center;color:var(--faint);font-size:14px">No questions match your filters.</div>`
    : qs.map((q, i) => {
      const globalIdx = INTERVIEW_QA.indexOf(q);
      const isReviewed = iqaState.reviewed.has(globalIdx);
      const isBookmarked = iqaState.bookmarked.has(globalIdx);
      const highlightedQ = iqaState.search
        ? q.q.replace(new RegExp(`(${iqaState.search})`, 'gi'), '<mark style="background:rgba(240,165,0,0.25);color:var(--gold)">$1</mark>')
        : q.q;
      return `
      <div class="iqa-card ${isReviewed ? 'reviewed' : ''}" id="iqa-card-${globalIdx}">
        <button class="iqa-card-header" onclick="toggleIQACard(${globalIdx})" aria-expanded="false" aria-controls="iqa-body-${globalIdx}">
          <div class="iqa-card-num ${numClass[q.level]}">${globalIdx + 1}</div>
          <div class="iqa-card-meta">
            <div class="iqa-card-q">${highlightedQ}</div>
            <div class="iqa-card-tags">
              <span class="iqa-tag ${levelClass[q.level]}">${levelTag[q.level]}</span>
              <span class="iqa-tag tag-cat">${q.cat}</span>
              ${isBookmarked ? '<span class="iqa-tag" style="background:rgba(240,165,0,0.1);color:var(--gold)">🔖 Saved</span>' : ''}
              ${isReviewed ? '<span class="iqa-tag" style="background:rgba(34,197,94,0.08);color:var(--green)">✓ Reviewed</span>' : ''}
            </div>
          </div>
          <span class="iqa-card-chevron">›</span>
        </button>
        <div class="iqa-card-body" id="iqa-body-${globalIdx}">
          <div class="iqa-answer-label">✅ Expert Answer</div>
          <div class="iqa-answer-text">${formatIQAAnswer(q.a)}</div>
          <div class="iqa-answer-actions">
            <button class="iqa-copy-btn" onclick="copyIQAAnswer(${globalIdx},this)">📋 Copy Answer</button>
            <button class="iqa-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleIQABookmark(${globalIdx},this)">
              ${isBookmarked ? '🔖 Saved' : '🔖 Save'}
            </button>
            <span class="iqa-progress-note">${isReviewed ? '✓ Reviewed' : ''}</span>
          </div>
        </div>
      </div>`;
    }).join('');

  updateIQAProgress();
}

function formatIQAAnswer(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="background:var(--s3);color:var(--cyan);padding:1px 6px;border-radius:4px;font-size:0.9em;font-family:var(--fm)">$1</code>');
}

function toggleIQACard(idx) {
  const card = document.getElementById(`iqa-card-${idx}`);
  const body = document.getElementById(`iqa-body-${idx}`);
  const btn = card.querySelector('.iqa-card-header');
  const isOpen = card.classList.contains('open');
  card.classList.toggle('open', !isOpen);
  btn.setAttribute('aria-expanded', !isOpen);
  if (!isOpen) {
    // Mark as reviewed
    iqaState.reviewed.add(idx);
    updateIQAProgress();
  }
}

function copyIQAAnswer(idx, btn) {
  const q = INTERVIEW_QA[idx];
  navigator.clipboard.writeText(q.a).then(() => {
    btn.classList.add('copied');
    btn.textContent = '✅ Copied!';
    setTimeout(() => { btn.classList.remove('copied'); btn.textContent = '📋 Copy Answer'; }, 2000);
  });
}

function toggleIQABookmark(idx, btn) {
  if (iqaState.bookmarked.has(idx)) {
    iqaState.bookmarked.delete(idx);
    btn.classList.remove('bookmarked');
    btn.textContent = '🔖 Save';
  } else {
    iqaState.bookmarked.add(idx);
    btn.classList.add('bookmarked');
    btn.textContent = '🔖 Saved';
  }
}

function updateIQAProgress() {
  const total = INTERVIEW_QA.length;
  const reviewed = iqaState.reviewed.size;
  const pct = Math.round((reviewed / total) * 100);
  const fill = document.getElementById('iqaProgressFill');
  const label = document.getElementById('iqaProgressLabel');
  const count = document.getElementById('iqaReviewedCount');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = `${reviewed} / ${total} reviewed`;
  if (count) count.textContent = reviewed;
}

/* ═══════════════════════════════════════════════
   LAB SIMULATOR ENGINE
═══════════════════════════════════════════════ */
function showLab() {
  ['homepageView','appView','glossaryView','quizView','interviewView'].forEach(id => {
    const el = document.getElementById(id); if(el) el.style.display='none';
  });
  document.getElementById('labView').style.display = 'block';
  backToLab();
  window.scrollTo(0,0);
}

function backToLab() {
  document.getElementById('labHome').style.display = 'block';
  ['labDebug','labEventFlow','labMatcher','labScenario','labAppDesigner','labPSSim'].forEach(id => {
    const el = document.getElementById(id); if(el) el.style.display='none';
  });
}

function openLabMode(mode) {
  document.getElementById('labHome').style.display = 'none';
  const modeMap = {debug:'labDebug',eventflow:'labEventFlow',matcher:'labMatcher',
    scenario:'labScenario',appdesigner:'labAppDesigner',pssim:'labPSSim'};
  const el = document.getElementById(modeMap[mode]);
  if(el) { el.style.display='block'; window.scrollTo(0,0); }
  if(mode==='debug') initDebug();
  if(mode==='eventflow') initEventFlow();
  if(mode==='matcher') initMatcher();
  if(mode==='scenario') initScenario();
  if(mode==='appdesigner') initAppDesigner();
  if(mode==='pssim') initPSSim();
}

/* ── MODE 1: DEBUG ── */
const DEBUG_CHALLENGES = [
  {
    title:"Performance Issue in Job Data Component",
    desc:"An HR coordinator reports the Job Data component takes 30+ seconds to load when an employee has many job rows. Identify the problematic line.",
    code:[
      {n:1,t:"/* PostBuild — Initialize component */"},
      {n:2,t:"Function InitComponent()"},
      {n:3,t:"   Local Rowset &rs;"},
      {n:4,t:"   Local Record &rec;"},
      {n:5,t:"   &rs = GetRowset(Scroll.JOB);"},
      {n:6,t:"   For &i = 1 To &rs.ActiveRowCount"},
      {n:7,t:"      &rec = &rs.GetRow(&i).GetRecord(Record.JOB);"},
      {n:8,t:"      SQLExec(\"SELECT DESCR FROM PS_DEPT_TBL WHERE DEPTID=:1\", &rec.DEPTID.Value, &deptName);"},
      {n:9,t:"      &rec.DEPTID_DESCR.Value = &deptName;"},
      {n:10,t:"   End-For;"},
      {n:11,t:"End-Function;"},
    ],
    bugLine:8,
    hint:"Think about how many times this SQL runs...",
    explanation:"Line 8 is the bug — SQLExec inside a For loop causes N+1 queries. If there are 50 job rows, this executes 50 separate SQL calls to PS_DEPT_TBL. Fix: use a single CreateSQL to pre-fetch all department names into an object before the loop, then look up from the object in RowInit."
  },
  {
    title:"Scope Bug — Variable Not Available",
    desc:"A developer set a flag in PostBuild but it's not accessible in SaveEdit. Find the scope error.",
    code:[
      {n:1,t:"/* PostBuild */"},
      {n:2,t:"Local Boolean &isNewHire;"},
      {n:3,t:"If JOB.ACTION.Value = \"HIR\" Then"},
      {n:4,t:"   &isNewHire = True;"},
      {n:5,t:"End-If;"},
      {n:6,t:""},
      {n:7,t:"/* SaveEdit — checks flag set in PostBuild */"},
      {n:8,t:"If &isNewHire Then"},
      {n:9,t:"   If JOB.DEPTID.Value = \"\" Then"},
      {n:10,t:"      Error \"New hires must have a Department.\";"},
      {n:11,t:"   End-If;"},
      {n:12,t:"End-If;"},
    ],
    bugLine:2,
    hint:"Local variables only exist within a single PeopleCode execution...",
    explanation:"Line 2 is the bug — declaring &isNewHire as Local means it only exists during the PostBuild execution. By the time SaveEdit runs, it's a completely new execution — the Local variable is gone and &isNewHire is empty. Fix: declare it as Component Boolean &isNewHire so it persists across all events in the component transaction."
  },
  {
    title:"Missing None() Check",
    desc:"This code crashes when no department is found. Find the missing validation.",
    code:[
      {n:1,t:"/* FieldChange on DEPTID */"},
      {n:2,t:"Local string &deptDescr;"},
      {n:3,t:"SQLExec(\"SELECT DESCR FROM PS_DEPT_TBL WHERE DEPTID=:1 AND EFFDT=(SELECT MAX(EFFDT) FROM PS_DEPT_TBL WHERE DEPTID=:1 AND EFFDT<=%CurrentDateIn)\","},
      {n:4,t:"   JOB.DEPTID.Value, JOB.DEPTID.Value, &deptDescr);"},
      {n:5,t:"JOB.DEPTID_DESCR.Value = &deptDescr;"},
      {n:6,t:"MessageBox(0, \"\", 0, 0, \"Department: \" | &deptDescr);"},
    ],
    bugLine:5,
    hint:"What if the DEPTID doesn't exist in PS_DEPT_TBL?",
    explanation:"Line 5 is the bug — if SQLExec finds no matching row, &deptDescr is empty string. The code assigns an empty value without checking. While this won't crash in all cases, the real issue is Line 6 which will show 'Department: ' with nothing. Best practice: after SQLExec, always check the result before using it. If the field is critical, use an Error or Warning when the lookup fails."
  },
  {
    title:"Wrong Event for Field Default",
    desc:"A developer wants to default DEPTID to 'CORP' when a component first opens. The code runs but the field keeps clearing. Find the wrong event choice.",
    code:[
      {n:1,t:"/* FieldChange on BUSINESS_UNIT */"},
      {n:2,t:"/* Developer tries to default DEPTID when component loads */"},
      {n:3,t:"If JOB.DEPTID.Value = \"\" Then"},
      {n:4,t:"   JOB.DEPTID.Value = \"CORP\";"},
      {n:5,t:"End-If;"},
    ],
    bugLine:1,
    hint:"FieldChange fires when a user CHANGES a field. When does a default need to be set?",
    explanation:"Line 1 is the bug — using FieldChange on BUSINESS_UNIT is wrong. FieldChange only fires when the user actively changes BUSINESS_UNIT. For setting a default when the component first loads, the correct event is FieldDefault (fires before the user sees the field) or PostBuild (fires once after all rows load). FieldDefault is the canonical place for defaulting field values."
  },
  {
    title:"Effective Dating Query Bug",
    desc:"This query returns multiple rows for the same employee causing duplicate results in a report. Find the SQL error.",
    code:[
      {n:1,t:"/* SQLExec to get employee department */"},
      {n:2,t:"Local string &deptId;"},
      {n:3,t:"SQLExec(\"SELECT DEPTID FROM PS_JOB WHERE EMPLID=:1\","},
      {n:4,t:"   PERSONAL_DATA.EMPLID.Value, &deptId);"},
      {n:5,t:"JOB.DEPTID.Value = &deptId;"},
    ],
    bugLine:3,
    hint:"PS_JOB can have 20+ rows per employee. Which one is current?",
    explanation:"Line 3 is the bug — the SQL has no effective dating WHERE clause. PS_JOB has one row per job change over an employee's entire career. Without MAX(EFFDT) <= today and MAX(EFFSEQ), SQLExec returns the first row found (could be the hire row from 10 years ago). Correct SQL: SELECT DEPTID FROM PS_JOB WHERE EMPLID=:1 AND EFFDT=(SELECT MAX(EFFDT) FROM PS_JOB WHERE EMPLID=:1 AND EFFDT<=%CurrentDateIn) AND EFFSEQ=(SELECT MAX(EFFSEQ) FROM PS_JOB WHERE EMPLID=:1 AND EFFDT=...)"
  },
  {
    title:"SavePostChange Misuse",
    desc:"A developer wants to cancel the save if a condition is not met, but Error() in SavePostChange does nothing. Find the wrong event.",
    code:[
      {n:1,t:"/* SavePostChange */"},
      {n:2,t:"/* Developer tries to cancel save if salary too high */"},
      {n:3,t:"If JOB.ANNUAL_RT.Value > 500000 Then"},
      {n:4,t:"   Error \"Salary exceeds maximum grade. Save cancelled.\";"},
      {n:5,t:"End-If;"},
      {n:6,t:"/* Downstream integration call */"},
      {n:7,t:"CallAppEngine(\"HR_NOTIF_AE\");"},
    ],
    bugLine:1,
    hint:"Once data is committed to DB, can you still cancel?",
    explanation:"Line 1 is the bug — the wrong event. SavePostChange fires AFTER the database commit is complete. At this point you cannot cancel the save — the data is already in the database. Error() in SavePostChange is silently ignored. Move the salary validation to SaveEdit, which fires BEFORE the DB commit and where Error() stops the save and highlights the issue. SavePostChange is only for downstream actions that need the data already saved."
  },
];

let debugState = { idx:0, selected:null, score:0 };

function initDebug() {
  debugState = { idx:0, selected:null, score:0 };
  renderDebugChallenge();
}

function renderDebugChallenge() {
  const ch = DEBUG_CHALLENGES[debugState.idx];
  debugState.selected = null;
  document.getElementById('debugCounter').textContent = `Challenge ${debugState.idx+1} of ${DEBUG_CHALLENGES.length}`;
  document.getElementById('debugScore').textContent = `Score: ${debugState.score}`;
  document.getElementById('debugScenario').innerHTML = `<div class="matcher-scenario__label">Scenario</div><div class="matcher-scenario__text">${ch.desc}</div>`;
  document.getElementById('debugCode').innerHTML = ch.code.map(line =>
    `<div class="lab-code-line" id="dline-${line.n}" onclick="selectDebugLine(${line.n})">
      <span class="lab-code-linenum">${line.n}</span>
      <span class="lab-code-text">${escapeCodeHtml(line.t)}</span>
    </div>`
  ).join('');
  document.getElementById('debugHint').textContent = '💡 ' + ch.hint;
  document.getElementById('debugCheckBtn').disabled = true;
  document.getElementById('debugNextBtn').style.display = 'none';
  const res = document.getElementById('debugResult');
  res.classList.remove('show','correct','wrong');
  res.innerHTML = '';
}

function escapeCodeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function selectDebugLine(n) {
  document.querySelectorAll('.lab-code-line').forEach(l => l.classList.remove('selected'));
  document.getElementById(`dline-${n}`).classList.add('selected');
  debugState.selected = n;
  document.getElementById('debugCheckBtn').disabled = false;
}

function checkDebugAnswer() {
  const ch = DEBUG_CHALLENGES[debugState.idx];
  const correct = debugState.selected === ch.bugLine;
  if(correct) debugState.score++;
  document.getElementById('debugScore').textContent = `Score: ${debugState.score}`;
  // Highlight
  document.querySelectorAll('.lab-code-line').forEach(l => l.style.pointerEvents='none');
  document.getElementById(`dline-${ch.bugLine}`).classList.add('correct-line');
  if(!correct && debugState.selected) document.getElementById(`dline-${debugState.selected}`).classList.add('selected');
  const res = document.getElementById('debugResult');
  res.className = `lab-result-box show ${correct?'correct':'wrong'}`;
  res.innerHTML = `<div class="lab-result-box__title">${correct?'✅ Correct!':'❌ Not quite'}</div>
    <div class="lab-result-box__text"><strong>Bug on line ${ch.bugLine}:</strong> ${ch.explanation}</div>`;
  document.getElementById('debugCheckBtn').style.display = 'none';
  document.getElementById('debugNextBtn').style.display = debugState.idx < DEBUG_CHALLENGES.length-1 ? 'block' : 'none';
  if(debugState.idx === DEBUG_CHALLENGES.length-1) {
    document.getElementById('debugNextBtn').style.display = 'none';
    res.innerHTML += `<br><strong style="color:var(--gold)">Lab Complete! Score: ${debugState.score}/${DEBUG_CHALLENGES.length}</strong>`;
  }
}

function nextDebugChallenge() {
  debugState.idx++;
  renderDebugChallenge();
}

/* ── MODE 2: EVENT FLOW ── */
const EF_CHALLENGES = [
  {
    name:"Component Load Sequence — What fires when a user opens a page?",
    events:[
      {name:"SearchInit",phase:"load",correct:0},
      {name:"RowSelect",phase:"load",correct:1},
      {name:"RowInit",phase:"load",correct:2},
      {name:"FieldDefault",phase:"load",correct:3},
      {name:"FieldFormula",phase:"load",correct:4},
      {name:"PostBuild",phase:"load",correct:5},
      {name:"Activate",phase:"load",correct:6},
    ]
  },
  {
    name:"Save Sequence — What fires when a user clicks Save?",
    events:[
      {name:"SaveEdit",phase:"save",correct:0},
      {name:"SavePreChange",phase:"save",correct:1},
      {name:"WorkFlow",phase:"save",correct:2},
      {name:"SavePostChange",phase:"save",correct:3},
    ]
  },
  {
    name:"Field Interaction — What fires when a user changes a field value?",
    events:[
      {name:"FieldEdit",phase:"interact",correct:0},
      {name:"FieldChange",phase:"interact",correct:1},
    ]
  },
];
let efState = { idx:0, items:[] };

function initEventFlow() { efState.idx=0; loadEFChallenge(); }

function loadEFChallenge() {
  const ch = EF_CHALLENGES[efState.idx];
  document.getElementById('efChallengeName').textContent = ch.name;
  efState.items = [...ch.events].sort(() => Math.random()-0.5);
  renderEFList();
  const res = document.getElementById('efResult');
  res.classList.remove('show','correct','wrong');
  res.innerHTML = '';
  document.getElementById('efNextBtn').style.display = 'none';
}

function renderEFList() {
  const phaseColors = {load:'phase-load',interact:'phase-interact',save:'phase-save'};
  const phaseLabels = {load:'Load',interact:'User Action',save:'Save'};
  document.getElementById('eventDragList').innerHTML = efState.items.map((ev,i) =>
    `<div class="event-drag-item" draggable="true" data-idx="${i}"
      ondragstart="efDragStart(event,${i})"
      ondragover="efDragOver(event,${i})"
      ondrop="efDrop(event,${i})">
      <span class="event-drag-handle">⠿</span>
      <span class="event-drag-num">${i+1}</span>
      <span style="flex:1;font-family:var(--fm);font-weight:600">${ev.name}</span>
      <span class="event-phase-badge ${phaseColors[ev.phase]}">${phaseLabels[ev.phase]}</span>
    </div>`
  ).join('');
}

let efDragging = null;
function efDragStart(e,i){ efDragging=i; e.currentTarget.classList.add('dragging'); }
function efDragOver(e,i){ e.preventDefault(); }
function efDrop(e,i){
  e.preventDefault();
  if(efDragging===null||efDragging===i) return;
  const items=[...efState.items];
  const [moved]=items.splice(efDragging,1);
  items.splice(i,0,moved);
  efState.items=items;
  efDragging=null;
  renderEFList();
}

function checkEventOrder() {
  const ch = EF_CHALLENGES[efState.idx];
  const correct = efState.items.every((ev,i) => ev.correct === i);
  const items = document.querySelectorAll('.event-drag-item');
  efState.items.forEach((ev,i) => {
    items[i].classList.add(ev.correct === i ? 'correct-pos' : 'wrong-pos');
    items[i].setAttribute('draggable','false');
    items[i].style.cursor='default';
  });
  const res = document.getElementById('efResult');
  res.className = `lab-result-box show ${correct?'correct':'wrong'}`;
  const correctOrder = [...ch.events].sort((a,b)=>a.correct-b.correct).map(e=>e.name).join(' → ');
  res.innerHTML = `<div class="lab-result-box__title">${correct?'✅ Perfect Order!':'❌ Not quite right'}</div>
    <div class="lab-result-box__text">Correct sequence: <strong>${correctOrder}</strong></div>`;
  if(efState.idx < EF_CHALLENGES.length-1) document.getElementById('efNextBtn').style.display='block';
}

function resetEventOrder() { loadEFChallenge(); }
function nextEFChallenge() { efState.idx++; loadEFChallenge(); }

/* ── MODE 3: OBJECT MATCHER ── */
const MATCHER_CHALLENGES = [
  {q:"Store temporary flag values during a component session — never saved to DB",ans:"Derived/Work Record",opts:["SQL Table","SQL View","Derived/Work Record","Temp Table"],exp:"Derived/Work records exist only in memory during the component transaction. They create no database object and are perfect for temporary flags, calculations, and work fields."},
  {q:"Run a salary recalculation for 500,000 employees overnight",ans:"Application Engine",opts:["Component Interface","Application Engine","SQR","PS Query"],exp:"Application Engine is PeopleSoft's batch framework for large-scale data processing. It runs outside the online session, has checkpoint/restart capability, and supports parallel processing via Temp Tables."},
  {q:"Load employee hire data from an external system using PeopleSoft business rules",ans:"Component Interface",opts:["Data Mover","SQL Insert","Component Interface","Application Engine"],exp:"Component Interface fires the same PeopleCode events as the online component — ensuring all business rules, defaults, and validations run during the data load. Perfect for inbound integrations."},
  {q:"Display department name next to EMPLID without a DB insert",ans:"SQL View",opts:["SQL Table","SQL View","Derived/Work Record","Dynamic View"],exp:"SQL View creates a read-only database view that joins records. Use it to display related data (like DESCR from PS_DEPT_TBL) alongside key fields without any DB write."},
  {q:"Short code list for EMPL_STATUS: A=Active, T=Terminated, L=Leave",ans:"Translate Value (XLAT)",opts:["Prompt Table","Translate Value (XLAT)","Dynamic View","Record Field"],exp:"Translate Values (XLAT) are stored in PSXLATITEM — PeopleSoft's universal lookup table for short stable codes of max 4 characters. Perfect for EMPL_STATUS, ACTION, FULL_PART_TIME."},
  {q:"Send real-time employee data to an external payroll system via REST",ans:"Integration Broker",opts:["Application Engine","Data Mover","Integration Broker","Component Interface"],exp:"Integration Broker handles real-time synchronous and asynchronous messaging. Use Service Operations with REST routing to send/receive data from external systems."},
  {q:"Reusable EFFDT + EFFSEQ fields used across 200 records",ans:"SubRecord",opts:["SQL Table","SubRecord","Dynamic View","Derived/Work Record"],exp:"SubRecords are reusable field groups. EFFDT_SBR contains EFFDT and EFFSEQ and is included in hundreds of effective-dated records — defining the fields once and reusing everywhere."},
  {q:"Migrate reference data between environments with a simple script",ans:"Data Mover (DMS)",opts:["Application Engine","Data Mover (DMS)","Component Interface","SQL Script"],exp:"Data Mover (DMS) uses simple EXPORT/IMPORT scripts to move data between PeopleSoft databases. Ideal for migrating setup/reference data during implementations and upgrades."},
  {q:"Allow parallel batch processing without data collision between instances",ans:"Temp Table",opts:["SQL Table","SQL View","Temp Table","Derived/Work Record"],exp:"Temp Tables are created multiple times in the DB (MYTEMP_AET, MYTEMP_AET1...). Each parallel AE instance uses its own copy — preventing data collision between concurrent batch processes."},
  {q:"Upgrade-safe customization — attach custom PeopleCode to a delivered component without modifying it",ans:"Event Mapping",opts:["SubRecord","Event Mapping","Application Package","Component Interface"],exp:"Event Mapping (PT 8.55+) lets you attach custom App Class PeopleCode to delivered component events without touching the delivered object. During upgrades, Oracle replaces the delivered component but your mapping remains intact."},
];
let matcherState = { idx:0, score:0, answered:false };
function initMatcher() { matcherState={idx:0,score:0,answered:false}; renderMatcher(); }
function renderMatcher() {
  const ch = MATCHER_CHALLENGES[matcherState.idx];
  matcherState.answered = false;
  document.getElementById('matcherCounter').textContent = `Scenario ${matcherState.idx+1} of ${MATCHER_CHALLENGES.length}`;
  document.getElementById('matcherScore').textContent = `Score: ${matcherState.score}/${matcherState.idx}`;
  document.getElementById('matcherScenario').textContent = ch.q;
  document.getElementById('matcherOptions').innerHTML = ch.opts.map(opt =>
    `<button class="matcher-opt" onclick="checkMatcher('${opt.replace(/'/g,"\\'")}',this)">${opt}</button>`
  ).join('');
  const res = document.getElementById('matcherResult');
  res.classList.remove('show','correct','wrong'); res.innerHTML='';
  document.getElementById('matcherNextBtn').style.display='none';
}
function checkMatcher(chosen, btn) {
  if(matcherState.answered) return;
  matcherState.answered = true;
  const ch = MATCHER_CHALLENGES[matcherState.idx];
  const correct = chosen === ch.ans;
  if(correct) matcherState.score++;
  document.querySelectorAll('.matcher-opt').forEach(b => {
    b.disabled=true;
    if(b.textContent===ch.ans) b.classList.add('correct');
    else if(b===btn) b.classList.add('wrong');
    else b.classList.add('reveal');
  });
  const res = document.getElementById('matcherResult');
  res.className=`lab-result-box show ${correct?'correct':'wrong'}`;
  res.innerHTML=`<div class="lab-result-box__title">${correct?'✅ Correct!':'❌ Wrong'}</div>
    <div class="lab-result-box__text"><strong>Answer: ${ch.ans}</strong><br>${ch.exp}</div>`;
  document.getElementById('matcherScore').textContent=`Score: ${matcherState.score}/${matcherState.idx+1}`;
  if(matcherState.idx < MATCHER_CHALLENGES.length-1) document.getElementById('matcherNextBtn').style.display='block';
  else res.innerHTML+=`<br><strong style="color:var(--gold)">Complete! Final Score: ${matcherState.score}/${MATCHER_CHALLENGES.length}</strong>`;
}
function nextMatcher() { matcherState.idx++; renderMatcher(); }

/* ── MODE 4: SCENARIO SOLVER ── */
const SCENARIO_CHALLENGES = [
  {q:"An HR coordinator reports the Job Data page loads in 45 seconds. SQL trace shows 300 identical SELECT statements against PS_DEPT_TBL. Root cause?",ans:"SQLExec inside RowInit fires once per row",opts:["Database index is missing on PS_DEPT_TBL","SQLExec inside RowInit fires once per row","App Server has too few PSAPPSRV processes","WebLogic timeout is too short"],exp:"Classic N+1 problem. RowInit fires for every row in the grid. SQLExec inside RowInit = one DB call per row. 300 rows = 300 calls. Fix: pre-fetch all department names in PostBuild once using CreateSQL, then read from the result in RowInit."},
  {q:"A user can navigate to a custom component and see all fields, but clicking Save does nothing. No error message appears.",ans:"Permission List grants Display Only instead of Update/Display",opts:["The component has no PeopleCode","Permission List grants Display Only instead of Update/Display","The database is in read-only mode","The App Server is overloaded"],exp:"Display Only access mode in the Permission List means the user can view but not edit or save. The Save button is either hidden or disabled. Fix: change the component access mode to Update/Display in the user's Permission List."},
  {q:"A custom component using PS_JOB as the Search Record shows all employees to all HR users — even those outside their authorized departments.",ans:"PS_JOB bypasses row-level security — need a security view",opts:["The Permission List is too broad","PS_JOB bypasses row-level security — need a security view","Row-level security is not configured in the system","The component has too many pages"],exp:"Using PS_JOB directly as the Search Record bypasses row-level security entirely. Replace it with a security view (e.g., PS_JOB_SRCH_VW) that joins PS_JOB with the department security tables. The view automatically filters results based on the user's security profile."},
  {q:"A developer migrated a new component from DEV to QA successfully. QA users say the component doesn't appear in any menu.",ans:"Portal CREF was not migrated — only App Designer objects were",opts:["The component PeopleCode has a bug","Portal CREF was not migrated — only App Designer objects were","The database tables were not built in QA","The Permission List was not updated"],exp:"App Designer objects (records, pages, components) and Portal Registry entries (CREFs) are separate objects. The CREF is what makes the component appear in navigation. It must be explicitly included in the project and migrated separately from the App Designer objects."},
  {q:"A payroll batch process shows Error status in Process Monitor. The log shows: 'No rows selected for processing'. The manager says it worked fine last month.",ans:"Run Control parameters are incorrect — likely wrong pay period dates",opts:["The App Server is down","Run Control parameters are incorrect — likely wrong pay period dates","PS_JOB has a data corruption issue","The process was submitted with wrong user ID"],exp:"'No rows selected' almost always means the selection criteria found nothing. The most common cause is incorrect Run Control parameters — especially date ranges. Check that the Pay Period End Date, Company, and Pay Group on the Run Control match the period being processed."},
  {q:"An employee's promotion from last month is not showing in a departmental headcount report. The data looks correct in Job Data.",ans:"Report query is missing effective dating — showing current row not historical",opts:["The employee's data was accidentally deleted","Report query is missing effective dating — showing current row not historical","The batch process hasn't run yet","The report has a security issue"],exp:"The report is likely selecting only the current row (today's EFFDT). If the promotion was entered as future-dated but the report should show last month's state, the effective dating WHERE clause must reference the report period date, not just today."},
  {q:"After a PeopleSoft upgrade, a customized delivered component no longer works. The customization code is gone.",ans:"Oracle overwrote the delivered component during the upgrade — customization was not upgrade-safe",opts:["The database restore failed","Oracle overwrote the delivered component during the upgrade — customization was not upgrade-safe","The developer deleted it by mistake","The Permission List was reset"],exp:"This is the classic upgrade risk. Customizations made directly to Oracle-delivered objects are overwritten when Oracle delivers a new version of that object. The fix going forward: use Event Mapping (PT 8.55+) or clone delivered objects with a custom prefix before modifying."},
  {q:"A PS Query joining PS_PERSONAL_DATA and PS_JOB returns 15x the expected number of rows.",ans:"Missing effective dating criteria on PS_JOB creates a cross join",opts:["Wrong join key between the two records","Missing effective dating criteria on PS_JOB creates a cross join","PS_PERSONAL_DATA has duplicate rows","The query is running against the wrong database"],exp:"PS_PERSONAL_DATA has 1 row per employee. PS_JOB has 10-30+ rows per employee (one per job change). Joining without effective dating criteria creates a near-Cartesian product: 1 row × 20 rows = 20 result rows per employee. Always add MAX(EFFDT) <= today criteria when joining with any effective-dated table."},
];
let scenState = { idx:0, score:0, answered:false };
function initScenario() { scenState={idx:0,score:0,answered:false}; renderScenario(); }
function renderScenario() {
  const ch = SCENARIO_CHALLENGES[scenState.idx];
  scenState.answered=false;
  document.getElementById('scenarioCounter').textContent=`Scenario ${scenState.idx+1} of ${SCENARIO_CHALLENGES.length}`;
  document.getElementById('scenarioScore').textContent=`Score: ${scenState.score}/${scenState.idx}`;
  document.getElementById('scenarioText').textContent=ch.q;
  document.getElementById('scenarioOptions').innerHTML=ch.opts.map(opt=>
    `<button class="matcher-opt" onclick="checkScenario('${opt.replace(/'/g,"\\'")}',this)">${opt}</button>`
  ).join('');
  const res=document.getElementById('scenarioResult');
  res.classList.remove('show','correct','wrong'); res.innerHTML='';
  document.getElementById('scenarioNextBtn').style.display='none';
}
function checkScenario(chosen,btn) {
  if(scenState.answered) return;
  scenState.answered=true;
  const ch=SCENARIO_CHALLENGES[scenState.idx];
  const correct=chosen===ch.ans;
  if(correct) scenState.score++;
  document.querySelectorAll('#scenarioOptions .matcher-opt').forEach(b=>{
    b.disabled=true;
    if(b.textContent===ch.ans) b.classList.add('correct');
    else if(b===btn) b.classList.add('wrong');
    else b.classList.add('reveal');
  });
  const res=document.getElementById('scenarioResult');
  res.className=`lab-result-box show ${correct?'correct':'wrong'}`;
  res.innerHTML=`<div class="lab-result-box__title">${correct?'✅ Correct Diagnosis!':'❌ Not quite'}</div>
    <div class="lab-result-box__text"><strong>${ch.ans}</strong><br>${ch.exp}</div>`;
  document.getElementById('scenarioScore').textContent=`Score: ${scenState.score}/${scenState.idx+1}`;
  if(scenState.idx<SCENARIO_CHALLENGES.length-1) document.getElementById('scenarioNextBtn').style.display='block';
  else res.innerHTML+=`<br><strong style="color:var(--gold)">Complete! Final Score: ${scenState.score}/${SCENARIO_CHALLENGES.length}</strong>`;
}
function nextScenario() { scenState.idx++; renderScenario(); }

/* ── MODE 5: APP DESIGNER SIMULATOR ── */
const ADS_TASKS = [
  {id:'add_emplid',label:'Add EMPLID field (CHAR, 11, Key)'},
  {id:'add_effdt', label:'Add EFFDT field (DATE, Key)'},
  {id:'add_deptid',label:'Add DEPTID field (CHAR, 10)'},
  {id:'add_setid', label:'Add SETID field (CHAR, 5)'},
  {id:'build',     label:'Click Build to create the table'},
];
let adsState = { fields:[], tasksCompleted:new Set() };

function initAppDesigner() {
  adsState = { fields:[], tasksCompleted:new Set() };
  document.getElementById('adsOutput').textContent = 'Ready.';
  renderADSFields();
  renderADSTasks();
  const res = document.getElementById('adsResult');
  res.classList.remove('show','correct','wrong'); res.innerHTML='';
}

function renderADSTasks() {
  document.getElementById('adsTaskList').innerHTML = ADS_TASKS.map(t=>
    `<div class="ads-task ${adsState.tasksCompleted.has(t.id)?'done':''}" id="ads-task-${t.id}">
      <div class="ads-task-check">${adsState.tasksCompleted.has(t.id)?'✓':''}</div>
      ${t.label}
    </div>`
  ).join('');
}

function renderADSFields() {
  document.getElementById('adsFieldBody').innerHTML = adsState.fields.length === 0
    ? `<tr><td colspan="6" style="text-align:center;color:#888;padding:16px">No fields defined. Add fields from the properties panel →</td></tr>`
    : adsState.fields.map((f,i)=>
        `<tr ${i===adsState.fields.length-1?'class="selected"':''}>
          <td>${i+1}</td><td><strong>${f.name}</strong></td><td>${f.type}</td>
          <td>${f.len||''}</td>
          <td>${f.key?'<span style="color:#1f5a9a;font-size:16px">☑</span>':''}</td>
          <td></td>
        </tr>`
      ).join('');
}

function adsAddField() {
  const sel = document.getElementById('adsAddFieldSelect');
  const val = sel.value;
  if(!val) return;
  const [name,type,len] = val.split('|');
  const isKey = (name==='EMPLID'||name==='EFFDT');
  // Check duplicate
  if(adsState.fields.find(f=>f.name===name)) {
    document.getElementById('adsOutput').textContent = `Field ${name} already exists.`; return;
  }
  adsState.fields.push({name,type,len,key:isKey});
  renderADSFields();
  document.getElementById('adsOutput').textContent = `Field ${name} added successfully.`;
  // Mark task
  const taskMap = {EMPLID:'add_emplid',EFFDT:'add_effdt',DEPTID:'add_deptid',SETID:'add_setid'};
  if(taskMap[name]) { adsState.tasksCompleted.add(taskMap[name]); renderADSTasks(); }
  sel.value='';
}

function adsBuild() {
  const requiredFields = ['EMPLID','EFFDT','DEPTID','SETID'];
  const presentFields = adsState.fields.map(f=>f.name);
  const missing = requiredFields.filter(f=>!presentFields.includes(f));
  const out = document.getElementById('adsOutput');
  if(missing.length > 0) {
    out.textContent = `Build failed: Missing required fields: ${missing.join(', ')}. Add all fields before building.`; return;
  }
  const lines = [
    'Starting Build...',
    'Generating CREATE TABLE DDL...',
    '',
    'CREATE TABLE PS_EMP_DEPT_DATA (',
    '   EMPLID      CHAR(11)  NOT NULL,',
    '   EFFDT       DATE      NOT NULL,',
    '   DEPTID      CHAR(10)  NOT NULL,',
    '   SETID       CHAR(5)   NOT NULL',
    ')',
    '',
    'Building Indexes...',
    'CREATE UNIQUE INDEX PS_EMP_DEPT_DATA ON PS_EMP_DEPT_DATA (EMPLID, EFFDT)',
    '',
    'SQL build succeeded.',
    '1 record processed: 0 errors, 0 warnings',
    'SQL written to C:\\TEMP\\PPSBUILD.SQL',
  ];
  out.textContent = lines.join('\n');
  adsState.tasksCompleted.add('build');
  renderADSTasks();
  // Check if all tasks done
  if(adsState.tasksCompleted.size === ADS_TASKS.length) {
    const res = document.getElementById('adsResult');
    res.className = 'lab-result-box show correct';
    res.innerHTML = `<div class="lab-result-box__title">✅ Record Built Successfully!</div>
      <div class="lab-result-box__text">You created the <strong>EMP_DEPT_DATA</strong> SQL Table record with all required fields and built the physical database table <strong>PS_EMP_DEPT_DATA</strong>. This is exactly how developers create new records in PeopleSoft Application Designer.</div>`;
  }
}

/* ── MODE 6: PS SIMULATOR ── */
const PS_TILES = [
  {icon:'📊',title:'Timesheet Compliance',subtitle:'Updated every Monday',type:'chart'},
  {icon:'⏰',title:'Timesheet',subtitle:'Enter & approve time',type:'tile'},
  {icon:'📁',title:'Quick Projects',subtitle:'Contract & billing',type:'tile'},
  {icon:'👤',title:'My Profile',subtitle:'Personal information',type:'tile'},
  {icon:'✅',title:'Approvals',subtitle:'Pending items',type:'tile'},
  {icon:'📈',title:'Reporting Tasks',subtitle:'Run & schedule reports',type:'tile'},
];
const PS_NAV_ITEMS = [
  {label:'Recently Visited', icon:'🕒', subs:['Job Data','Personal Details','Benefits']},
  {label:'Favorites', icon:'⭐', subs:['Employee Search','Pay Rate Change']},
  {label:'Navigator', icon:'🧭', subs:[]},
  {label:'Employee Self Service', icon:'👤', subs:['Personal Details','Pay','Benefits Summary']},
  {label:'HR Administrator', icon:'🏢', subs:['Job Data','Position Management','Department Table']},
  {label:'Benefits Administration', icon:'🛡️', subs:['Enrollment','Benefit Summary','Dependents']},
  {label:'Payroll', icon:'💰', subs:['Run Payroll','Pay Calendar','Earnings Codes']},
  {label:'Workforce Administration', icon:'📋', subs:['Personal Info','Job Information','Employment Data']},
  {label:'Classic Home', icon:'🏠', subs:[]},
];
const PS_COMPONENTS = {
  'Job Data': {title:'Job Data',subtitle:'Workforce Administration > Job Information > Job Data',fields:[{label:'Employee ID',val:'KR00123'},{label:'Name',val:'Koushik Ram M'},{label:'Effective Date',val:'03/30/2026'},{label:'Action',val:'HIR — Hire'},{label:'Department',val:'IT0001 — Information Technology'},{label:'Job Code',val:'IT001 — Software Developer'},{label:'Location',val:'HYD — Hyderabad'}]},
  'Personal Details': {title:'Personal Details',subtitle:'Employee Self Service > Personal Information > Personal Details',fields:[{label:'Employee ID',val:'KR00123'},{label:'Name',val:'Koushik Ram M'},{label:'Date of Birth',val:'01/01/1999'},{label:'National ID',val:'XXXXX1234'},{label:'Email',val:'koushik@company.com'},{label:'Phone',val:'+91 9876543210'}]},
  'Pay Rate Change': {title:'Pay Rate Change',subtitle:'HR Administrator > Compensation > Pay Rate Change',fields:[{label:'Employee ID',val:'KR00123'},{label:'Effective Date',val:'04/01/2026'},{label:'Action',val:'PAY — Pay Rate Change'},{label:'Current Salary',val:'₹ 8,00,000'},{label:'New Salary',val:'₹ 9,50,000'},{label:'Pay Group',val:'IND — India Monthly'}]},
  'Department Table': {title:'Department Table',subtitle:'Set Up HCM > Foundation Tables > Organization > Departments',fields:[{label:'SetID',val:'SHARE'},{label:'Department ID',val:'IT0001'},{label:'Effective Date',val:'01/01/2020'},{label:'Description',val:'Information Technology'},{label:'Manager',val:'TechLead001'},{label:'Location',val:'HYD'}]},
};

let psSimUser = '';
function initPSSim() {
  showPSScreen('psLoginScreen');
  document.getElementById('psUserId').value='';
  document.getElementById('psPassword').value='';
  document.getElementById('psLoginError').classList.remove('show');
}
function showPSScreen(id) {
  ['psLoginScreen','psHomeScreen','psComponentScreen'].forEach(s=>{
    const el=document.getElementById(s); if(el) el.classList.remove('active');
  });
  const el=document.getElementById(id); if(el) el.classList.add('active');
}
function psSignIn() {
  const uid=document.getElementById('psUserId').value.trim();
  const pwd=document.getElementById('psPassword').value;
  document.getElementById('psLoginError').classList.remove('show');
  if(!uid||!pwd) { document.getElementById('psLoginError').textContent='Please enter both User ID and Password.'; document.getElementById('psLoginError').classList.add('show'); return; }
  psSimUser = uid;
  document.getElementById('psLoggedUser').textContent = `Logged in as: ${uid.toUpperCase()}`;
  buildPSHome();
  showPSScreen('psHomeScreen');
}
function psSignOut() { showPSScreen('psLoginScreen'); }
function psGoHome() { showPSScreen('psHomeScreen'); buildPSHome(); }

function buildPSHome() {
  // Tiles
  document.getElementById('psTilesGrid').innerHTML = PS_TILES.map((t,i)=>
    t.type==='chart'
    ? `<div class="ps-tile chart-tile" onclick="psOpenComponent('${t.title}')">
        <div class="ps-tile__chart-title">${t.title}</div>
        <div style="display:flex;align-items:flex-end;gap:4px;height:60px;margin-bottom:6px">
          ${[40,65,50,80,55,90,75].map(h=>`<div style="width:12px;background:#1e4d8c;height:${h}%;border-radius:2px 2px 0 0;opacity:0.7"></div>`).join('')}
        </div>
        <div style="font-size:10px;color:#888">${t.subtitle}</div>
      </div>`
    : `<div class="ps-tile" onclick="psOpenComponent('${t.title}')">
        <div class="ps-tile__icon">${t.icon}</div>
        <div class="ps-tile__title">${t.title}</div>
        <div class="ps-tile__subtitle">${t.subtitle}</div>
      </div>`
  ).join('');
  // Quick links
  const qlinks = [
    {icon:'📋',label:'View PeopleSoft'},
    {icon:'✅',label:'Asset Allowances'},
    {icon:'🔍',label:'Run a Query'},
    {icon:'📄',label:'Your Docs'},
  ];
  document.getElementById('psQuickLinks').innerHTML = qlinks.map(q=>
    `<div class="ps-quicklink" onclick="alert('${q.label} — Component would open here')"><span>${q.icon}</span>${q.label}</div>`
  ).join('');
  // NavBar
  buildPSNav('');
  document.getElementById('psNavBar').style.display='flex';
}

function psToggleNav() {
  const nav=document.getElementById('psNavBar');
  nav.style.display=nav.style.display==='none'?'flex':'none';
}

function buildPSNav(filter) {
  document.getElementById('psNavItems').innerHTML = PS_NAV_ITEMS
    .filter(item=>!filter||item.label.toLowerCase().includes(filter)||item.subs.some(s=>s.toLowerCase().includes(filter)))
    .map((item,i)=>`
      <div class="ps-navbar-section">
        <div class="ps-navbar-item" onclick="psToggleNavItem(${i})">
          <span class="ps-navbar-item-icon">${item.icon}</span>
          ${item.label}
          ${item.subs.length?'<span style="margin-left:auto;color:#aaa;font-size:12px">›</span>':''}
        </div>
        ${item.subs.length?`<div class="ps-navbar-sub" id="psnav-sub-${i}">
          ${item.subs.map(s=>`<div class="ps-navbar-sub-item" onclick="psOpenComponent('${s}')"><span class="ps-sub-icon">📄</span>${s}</div>`).join('')}
        </div>`:''}
      </div>`
    ).join('');
}

function psNavSearch(val) { buildPSNav(val.toLowerCase()); }

function psToggleNavItem(i) {
  const sub=document.getElementById(`psnav-sub-${i}`);
  if(sub) sub.classList.toggle('open');
}

function psOpenComponent(name) {
  const comp = PS_COMPONENTS[name];
  const content = document.getElementById('psComponentContent');
  showPSScreen('psComponentScreen');
  if(!comp) {
    content.innerHTML=`<div style="padding:20px"><p style="font-family:'Segoe UI';color:#888;font-size:14px">← <button onclick="psGoHome()" style="background:none;border:none;color:#1e4d8c;cursor:pointer;font-size:13px;font-family:'Segoe UI'">Back to Home</button></p><div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:24px;text-align:center;color:#888;font-family:'Segoe UI'">🚧 This component is not available in the simulator yet.<br><br><button onclick="psGoHome()" style="background:#1e4d8c;color:#fff;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-family:'Segoe UI'">← Back to Homepage</button></div></div>`;
    return;
  }
  content.innerHTML=`
    <p style="font-family:'Segoe UI';font-size:12px;color:#888;margin-bottom:4px">
      <button onclick="psGoHome()" style="background:none;border:none;color:#1e4d8c;cursor:pointer;font-size:12px;font-family:'Segoe UI'">🏠 Home</button>
      › ${comp.subtitle}
    </p>
    <div style="background:#fff;border:1px solid #ddd;border-radius:6px;overflow:hidden">
      <div style="background:linear-gradient(180deg,#1e4d8c,#163f75);padding:12px 16px;display:flex;align-items:center;justify-content:space-between">
        <div style="color:#fff;font-family:'Segoe UI';font-size:14px;font-weight:600">${comp.title}</div>
        <div style="display:flex;gap:8px">
          <button style="background:rgba(255,255,255,0.2);color:#fff;border:none;padding:5px 14px;font-size:12px;cursor:pointer;border-radius:3px;font-family:'Segoe UI'">💾 Save</button>
          <button onclick="psGoHome()" style="background:rgba(255,255,255,0.1);color:#fff;border:none;padding:5px 14px;font-size:12px;cursor:pointer;border-radius:3px;font-family:'Segoe UI'">✕ Cancel</button>
        </div>
      </div>
      <div style="padding:20px">
        <table style="width:100%;border-collapse:collapse;font-family:'Segoe UI';font-size:13px">
          ${comp.fields.map(f=>`
            <tr>
              <td style="padding:8px 16px 8px 0;color:#555;font-weight:600;width:180px;vertical-align:top">${f.label}</td>
              <td style="padding:8px 0"><input type="text" value="${f.val}" style="border:1px solid #ccc;padding:6px 10px;border-radius:3px;font-size:13px;font-family:'Segoe UI';color:#222;min-width:200px"/></td>
            </tr>`).join('')}
        </table>
      </div>
    </div>`;
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
  ['appView','glossaryView','quizView','interviewView','labView'].forEach(id => {
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
  ['glossaryView','quizView','interviewView','labView'].forEach(id => {
    const el = document.getElementById(id); if(el) el.style.display='none';
  });
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
