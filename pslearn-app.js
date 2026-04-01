/* PSLearn — Application Logic */
/* pslearn.vercel.app | Built by Koushik Ram M */

/* Core state variables */
const visited = new Set();
let currentTopicIndex = 0;



/* ═══════════════════════════════════════════════
   VIEW MANAGER — prevents scroll bleed
═══════════════════════════════════════════════ */
const ALL_VIEWS = ['homepageView','appView','glossaryView','quizView','interviewView','labView'];
function switchView(showId) {
  ALL_VIEWS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = id === showId ? 'block' : 'none';
  });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/* ═══════════════════════════════════════════════
   LOCALSTORAGE PROGRESS
═══════════════════════════════════════════════ */
const STORAGE_KEY = 'pslearn_v2';
let lastSavedTopic = -1, lastSavedIsIntermediate = false, currentIsIntermediate = false;

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      visited: Array.from(visited), lastTopic: currentTopicIndex,
      lastIsIntermediate: currentIsIntermediate, savedAt: Date.now()
    }));
  } catch(e) {}
}
function loadProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    if (data.visited) data.visited.forEach(i => visited.add(i));
    if (typeof data.lastTopic === 'number') lastSavedTopic = data.lastTopic;
    if (data.lastIsIntermediate) lastSavedIsIntermediate = !!data.lastIsIntermediate;
  } catch(e) {}
}
function showResumeBanner() {
  if (lastSavedTopic < 0) return;
  const topicList = lastSavedIsIntermediate ? (typeof INTERMEDIATE_TOPICS!=='undefined'?INTERMEDIATE_TOPICS:[]) : TOPICS;
  if (!topicList[lastSavedTopic]) return;
  const banner = document.getElementById('resumeBanner'); if(!banner) return;
  const t = topicList[lastSavedTopic];
  const nameEl = document.getElementById('resumeTopicName');
  const numEl = document.getElementById('resumeTopicNum');
  if(nameEl) nameEl.textContent = t.title;
  if(numEl) numEl.textContent = `Topic ${lastSavedTopic+1} of ${topicList.length}`;
  banner.style.display = 'flex';
}
function dismissResume() {
  const b = document.getElementById('resumeBanner'); if(b) b.style.display='none';
  lastSavedTopic = -1;
}

/* ═══════════════════════════════════════════════
   FUZZY SEARCH + SYNONYMS
═══════════════════════════════════════════════ */
const SYNONYMS = {
  'ae':'application engine','app engine':'application engine','ci':'component interface',
  'ib':'integration broker','effdt':'effective dating','xlat':'translate values',
  'pia':'architecture','tuxedo':'architecture','rowset':'component buffer',
  'sqlexec':'peoplecode','postbuild':'peoplecode','saveedit':'peoplecode',
  'rowselect':'peoplecode','rowinit':'peoplecode','fielddefault':'peoplecode',
  'fieldchange':'peoplecode','roles':'security','run control':'process monitor',
  'deptid':'records','sql table':'records','subrecord':'records',
  'fluid':'fluid ui','activity guide':'fluid ui',
};
function expandQuery(q){return SYNONYMS[q.toLowerCase()]||q;}
function fuzzyMatch(text, query) {
  text=text.toLowerCase(); query=query.toLowerCase();
  if(text.includes(query)) return true;
  if(query.length<4) return false;
  const words = text.split(/\s+/);
  return words.some(w => {
    if(Math.abs(w.length-query.length)>3) return false;
    let a=w.slice(0,query.length+2), b=query;
    if(!a||!b) return false;
    const dp=Array.from({length:a.length+1},(_,i)=>Array.from({length:b.length+1},(_,j)=>i===0?j:j===0?i:0));
    for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++)
      dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
    return dp[a.length][b.length]<=Math.floor(query.length/4);
  });
}

/* ═══════════════════════════════════════════════
   VIEW FUNCTIONS
═══════════════════════════════════════════════ */
function setNavActive(label) {
  document.querySelectorAll('.nav__link').forEach(btn => {
    btn.classList.toggle('nav__link--active', btn.textContent.trim().startsWith(label));
  });
}
function showHome() { switchView('homepageView'); closeDrawer(); loadProgress(); showResumeBanner(); setNavActive('Home'); }
function showApp()  { switchView('appView'); setNavActive('Learn'); }
function showGlossary() { switchView('glossaryView'); renderGlossary('','all'); setNavActive('Glossary'); }
function showLab() { switchView('labView'); document.getElementById('labView').style.display='block'; backToLab(); setNavActive('Lab'); }
function showInterview() { switchView('interviewView'); document.getElementById('interviewView').style.display='block'; buildIQACatSidebar(); renderIQA(); window.scrollTo(0,0); setNavActive('Interview'); }

/* ═══════════════════════════════════════════════
   TOPIC NAVIGATION
═══════════════════════════════════════════════ */
function openTopic(index, isIntermediate) {
  currentTopicIndex = index;
  currentIsIntermediate = !!isIntermediate;
  const topicList = isIntermediate ? INTERMEDIATE_TOPICS : TOPICS;
  visited.add((isIntermediate?'i_':'b_')+index);
  lastSavedTopic = index; lastSavedIsIntermediate = !!isIntermediate;
  saveProgress(); showApp(); setNavActive('Learn'); buildSidebar(isIntermediate); renderTopic(index, isIntermediate); updateProgress();
  const t = topicList[index];
  const te=document.getElementById('mobileTopicTitle'), ce=document.getElementById('mobileTopicCount');
  if(te) te.textContent=t.title;
  if(ce) ce.textContent=`${String(index+1).padStart(2,'0')}/${topicList.length}`;
  const bc=document.getElementById('desktopTopicBreadcrumb');
  if(bc) bc.textContent=`${isIntermediate?'Intermediate':'Beginner'} Topic ${index+1}/${topicList.length} — ${t.title}`;
  closeDrawer();
  setTimeout(()=>{ const h=document.querySelector('.section-block__header'); if(h) h.click(); },50);
}

function buildSidebar(isIntermediate=false, filter='') {
  const body=document.getElementById('sidebarBody'); body.innerHTML='';
  const topicList = isIntermediate ? INTERMEDIATE_TOPICS : TOPICS;
  const pl=document.createElement('div');
  pl.style.cssText='font-family:var(--fm);font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--faint);padding:8px 16px 4px;border-bottom:1px solid var(--border);margin-bottom:4px';
  pl.textContent = isIntermediate?'⚡ Intermediate Path':'🌱 Beginner Path';
  body.appendChild(pl);
  const sb=document.createElement('button');
  sb.style.cssText='width:100%;padding:8px 16px;background:none;border:none;border-bottom:1px solid var(--border);font-family:var(--fm);font-size:11px;color:var(--indigo-hi);cursor:pointer;text-align:left;margin-bottom:8px';
  sb.textContent=isIntermediate?'← Switch to Beginner':'→ Switch to Intermediate';
  sb.onclick=()=>openTopic(0,!isIntermediate); body.appendChild(sb);
  const IC=['#8b5cf6','#8b5cf6','#8b5cf6','#22d3ee','#22d3ee','#ef4444','#f59e0b','#ef4444','#ef4444','#f0a500'];
  const II=['⚙️','⚙️','⚙️','🔗','🔗','🔒','📊','🔒','⚙️','📱'];
  const IN=['Module 8: Batch Dev','Module 8: Batch Dev','Module 8: Batch Dev','Module 9: Integration','Module 9: Integration','Module 10: Security','Module 10: Reporting','Module 10: Security','Module 10: Performance','Module 11: Modern PS'];
  let lastG='';
  topicList.forEach((topic,idx)=>{
    if(filter&&!topic.title.toLowerCase().includes(filter.toLowerCase())) return;
    const gLabel=isIntermediate?(IN[idx]||'Intermediate'):(MODULES[topic.module]?.name||'');
    const icon=isIntermediate?(II[idx]||'📚'):(MODULES[topic.module]?.icon||'📚');
    const color=isIntermediate?(IC[idx]||'var(--soft)'):(MODULES[topic.module]?.color||'var(--soft)');
    if(gLabel!==lastG){
      const h=document.createElement('div'); h.className='sidebar__module-header';
      h.innerHTML=`<span>${icon}</span><span style="color:${color}">${gLabel}</span>`;
      body.appendChild(h); lastG=gLabel;
    }
    const isA=idx===currentTopicIndex&&isIntermediate===currentIsIntermediate;
    const vk=(isIntermediate?'i_':'b_')+idx;
    const btn=document.createElement('button');
    btn.className='sidebar__topic'+(isA?' active':'');
    btn.innerHTML=`<span class="sidebar__topic-num">${topic.num}</span><span style="flex:1;text-align:left">${topic.title}</span>${visited.has(vk)&&!isA?'<span style="color:var(--green);font-size:11px">✓</span>':''}`;
    btn.onclick=()=>openTopic(idx,isIntermediate); body.appendChild(btn);
  });
}
function filterTopics(val){ buildSidebar(currentIsIntermediate, val); }


const INTERVIEW_QA_ALL = [
  // ── BEGINNER (30) ──
  {cat:"Beginner",level:"beginner",q:"What is PeopleSoft?",a:"PeopleSoft is Oracle's enterprise application suite for HR, Finance, Supply Chain, and Education. It is metadata-driven — every page, field, and workflow is defined as metadata in Application Designer, not hardcoded. The runtime engine reads this metadata to generate HTML pages and execute business logic."},
  {cat:"Beginner",level:"beginner",q:"What is PIA (Pure Internet Architecture)?",a:"PIA is PeopleSoft's three-tier web architecture introduced in PS8 (2000). Browser → WebLogic (web tier) → Tuxedo App Server (app tier) via JOLT → Database. All PeopleCode and business logic runs in Tuxedo — zero logic in the browser."},
  {cat:"Beginner",level:"beginner",q:"What is Application Designer?",a:"PeopleSoft's Windows-based IDE for creating Records, Fields, Pages, Components, Menus, and PeopleCode. All objects stored as metadata in the database — not files. Connects 2-tier (direct DB) or 3-tier (via App Server)."},
  {cat:"Beginner",level:"beginner",q:"What is the difference between a Record and a Table?",a:"A Record is the metadata definition in Application Designer. When you Build a SQL Table record, PeopleSoft creates the physical DB table prefixed PS_ (Record JOB → Table PS_JOB). Record = definition, Table = physical DB object."},
  {cat:"Beginner",level:"beginner",q:"What are the 7 Record Types in PeopleSoft?",a:"SQL Table (creates PS_ table), SQL View (read-only DB view), Dynamic View (runtime SQL, no DB object), Derived/Work (memory only), SubRecord (reusable field group), Query View (created by PS Query), Temp Table (AE parallel processing)."},
  {cat:"Beginner",level:"beginner",q:"What is Effective Dating?",a:"Instead of updating rows, PeopleSoft inserts new rows with EFFDT. Current row = MAX(EFFDT) ≤ today. EFFSEQ handles same-date changes. Historical rows never deleted — enables retroactive payroll and full audit history."},
  {cat:"Beginner",level:"beginner",q:"What is PeopleCode?",a:"PeopleSoft's proprietary event-driven scripting language. Runs server-side in Tuxedo — never in the browser. Attached to a specific event (PostBuild, SaveEdit, FieldChange) on a specific object. Handles validation, defaulting, dynamic UI, SQL."},
  {cat:"Beginner",level:"beginner",q:"What is the Component Buffer?",a:"In-memory data structure in the Tuxedo App Server holding all data for the current transaction. Data loads from DB into buffer on open. PeopleCode reads/writes to buffer. DB update happens only on Save."},
  {cat:"Beginner",level:"beginner",q:"What is PostBuild used for?",a:"Fires once after the component fully loads — after all RowInit and FieldDefault events run. Best place for show/hide logic, component-level defaulting, and initialization needing the fully loaded state."},
  {cat:"Beginner",level:"beginner",q:"What is SaveEdit used for?",a:"Final business rule validation before DB commit. Error() stops the save, Warning() allows but shows caution. Fires after all field-level edits pass in the save sequence."},
  {cat:"Beginner",level:"beginner",q:"What is FieldChange event?",a:"Fires when a user changes a field value and tabs out. Used for dynamic updates — auto-populating related fields, showing/hiding controls based on the new value. Runs server-side in Tuxedo."},
  {cat:"Beginner",level:"beginner",q:"What does %OperatorId return?",a:"The current user's login ID (Operator ID). %EmployeeId returns the linked EMPLID. %Date returns today's date. %CurrentDateIn returns today in the correct SQL format for the database platform."},
  {cat:"Beginner",level:"beginner",q:"What is a Prompt Table?",a:"A record used to validate a field's value via a lookup. When a user types a value, PeopleSoft checks it exists in the Prompt Table. Example: DEPTID validated against PS_DEPT_TBL. Prompts show a search dialog to the user."},
  {cat:"Beginner",level:"beginner",q:"What is RowInit used for?",a:"Fires for every row loaded into the component buffer. Used to set default display properties per row — show/hide fields, set DisplayOnly. Avoid SQLExec in RowInit — it fires N times for N rows causing N database calls."},
  {cat:"Beginner",level:"beginner",q:"What is the difference between FieldEdit and FieldChange?",a:"FieldEdit fires first — before the new value is accepted. Use Error() here to reject the value. FieldChange fires after — value is already accepted. Use it for cascading updates based on the new value."},
  {cat:"Beginner",level:"beginner",q:"What is a Component in PeopleSoft?",a:"A group of pages sharing the same buffer that save together as one atomic transaction. The fundamental unit of a PeopleSoft transaction — Records, Pages, PeopleCode all work together inside a Component."},
  {cat:"Beginner",level:"beginner",q:"What is the Search Record in a Component?",a:"Drives the search dialog before a component opens — defines which fields appear as search criteria and which appear as result columns. Typically the primary record or a security view of it."},
  {cat:"Beginner",level:"beginner",q:"What is a Content Reference (CREF)?",a:"A Portal Registry entry pointing to a Component — defines its label, folder location, and security. Without a CREF, users cannot navigate to the component through the NavBar or tiles."},
  {cat:"Beginner",level:"beginner",q:"What does Build → Create Table do in Application Designer?",a:"Generates and executes CREATE TABLE DDL SQL to create the physical PS_RECORDNAME table in the database. Saving the record in App Designer only creates the metadata — Build creates the actual DB object."},
  {cat:"Beginner",level:"beginner",q:"What is PS_JOB?",a:"PeopleSoft HCM's central job history table. Contains one row per job change per employee (hire, transfer, promotion, pay change). Each row has EMPLID, EMPL_RCD, EFFDT, EFFSEQ, ACTION. Current row = MAX(EFFDT) ≤ today."},
  {cat:"Beginner",level:"beginner",q:"What is a SubRecord?",a:"A reusable field group embedded into other records — included fields become part of the parent table. EFFDT_SBR (EFFDT + EFFSEQ) is the most common example, included in hundreds of effective-dated records."},
  {cat:"Beginner",level:"beginner",q:"What are PeopleTools?",a:"PeopleSoft's complete development and administration toolset — Application Designer, PeopleCode, Application Engine, Integration Broker, PS Query, BI Publisher, Data Mover, Security, Process Scheduler. The platform on top of which PeopleSoft applications are built."},
  {cat:"Beginner",level:"beginner",q:"What is the difference between 2-tier and 3-tier App Designer?",a:"2-tier: App Designer connects directly to DB — bypasses App Server. Faster for simple tasks. 3-tier: connects via App Server — required for some advanced features. Most production environments use 3-tier."},
  {cat:"Beginner",level:"beginner",q:"What is the PS_ prefix on database tables?",a:"All PeopleSoft application tables are prefixed PS_ to distinguish them from PeopleTools metadata tables (PSRECDEFN, PSDBFIELD) and from database system tables. Record JOB → table PS_JOB."},
  {cat:"Beginner",level:"beginner",q:"What is EMPL_RCD in PS_JOB?",a:"Employee Record Number — allows one employee to hold multiple simultaneous jobs (concurrent employment). Primary job = EMPL_RCD 0. A part-time second job = EMPL_RCD 1. Keys: EMPLID + EMPL_RCD + EFFDT + EFFSEQ."},
  {cat:"Beginner",level:"beginner",q:"What is a Derived/Work record?",a:"A record type that exists only in the component buffer — no database table created. Used for temporary values, calculated fields, push button PeopleCode, and work variables during a component session."},
  {cat:"Beginner",level:"beginner",q:"What does None() do in PeopleCode?",a:"Returns True if a field value is empty/null. Always use None() after SQLExec to check if a row was found before using the output variable. If SQLExec finds no row, output variables are set to empty — None() detects this."},
  {cat:"Beginner",level:"beginner",q:"What is a Grid in PeopleSoft pages?",a:"The modern control for displaying multiple child record rows on a page. Replaced Scroll Areas. Supports sorting, filtering, pagination. All new PeopleSoft development uses Grids for multi-row data display."},
  {cat:"Beginner",level:"beginner",q:"What is the difference between Add and Update/Display access in security?",a:"Add mode: user can create new records. Update/Display: user can view and edit existing records. Display Only: read-only, cannot save. These access modes are configured in Permission Lists per component."},
  {cat:"Beginner",level:"beginner",q:"What is Process Monitor?",a:"PeopleSoft's batch job tracking page. Shows status (Queued, Initiated, Processing, Success, Error) of all submitted processes. Provides access to log files, trace files, and report output for diagnosis."},
  {cat:"Beginner",level:"beginner",q:"What is a Run Control?",a:"A record that stores batch process parameters before submission. Keyed by OPRID + RUN_CNTL_ID. User enters parameters (date range, pay group, etc.) on the Run Control page, saves, then submits the process which reads parameters at runtime."},

  // ── PEOPLECODE (30) ──
  {cat:"PeopleCode",level:"intermediate",q:"Explain the complete PeopleCode event flow from open to save.",a:"Load: SearchInit → SearchSave → RowSelect → RowInit (per row) → FieldDefault → FieldFormula → PostBuild → Activate. User actions: FieldEdit → FieldChange. Save: SaveEdit → SavePreChange → WorkFlow → SavePostChange. Getting the right event is critical — code in the wrong event causes subtle bugs."},
  {cat:"PeopleCode",level:"intermediate",q:"What is the difference between SQLExec and CreateSQL?",a:"SQLExec retrieves one row — first match only. CreateSQL returns a SQL object, iterate with While &sql.Fetch(). Always call &sql.Close() after. SQLExec in RowInit = classic N+1 performance problem. Use CreateSQL for multiple rows."},
  {cat:"PeopleCode",level:"intermediate",q:"What are the three variable scopes?",a:"Local: current program only — use by default. Component: persists entire component session (open to save) — accessible from any event in that component. Global: entire user session — use sparingly, causes cross-component bugs."},
  {cat:"PeopleCode",level:"intermediate",q:"How do you iterate Level 1 buffer rows?",a:"GetRowset(Scroll.RECORDNAME) returns Level 1 rowset. Loop: For &i = 1 To &rs.ActiveRowCount. GetRow(&i).GetRecord(Record.NAME).FIELDNAME.Value. Always ActiveRowCount — not RowCount — to skip deleted rows."},
  {cat:"PeopleCode",level:"intermediate",q:"What is Meta-SQL?",a:"Database-independent SQL functions: %CurrentDateIn (today's date in correct format), %Table(RECORD) resolves to PS_RECORD, %Bind(FIELD) inserts bind variable. Makes PeopleCode portable across Oracle, SQL Server, DB2."},
  {cat:"PeopleCode",level:"intermediate",q:"When should you use Component scope?",a:"When a value set in one event needs to be read in another event later in the same transaction. Example: set &isNewHire = True in PostBuild, check it in SaveEdit. Never use Local for cross-event sharing — it won't survive to the next event."},
  {cat:"PeopleCode",level:"intermediate",q:"What does SavePreChange fire after?",a:"Fires just BEFORE the DB commit — buffer is final but nothing written to DB yet. Last chance to manipulate buffer or create related records before commit. After this fires, SavePostChange fires after the actual DB commit."},
  {cat:"PeopleCode",level:"intermediate",q:"What does SavePostChange fire after?",a:"Fires AFTER DB commit is complete. Cannot cancel the save. Use for downstream updates, sending notifications, triggering integrations that require the data to already exist in the database."},
  {cat:"PeopleCode",level:"intermediate",q:"How do you make a field read-only in PeopleCode?",a:"RECORD.FIELD.DisplayOnly = True — shows the value but prevents editing. Enabled = False — grays out the field. Visible = False — hides completely. Use DisplayOnly when you want visible but not editable."},
  {cat:"PeopleCode",level:"intermediate",q:"What is RowSelect used for?",a:"Fires for each row as it is fetched from DB into the buffer. Use DiscardRow() to filter rows or StopFetching() to stop. Rarely needed — filtering in SQL Views is always more efficient than RowSelect PeopleCode."},
  {cat:"PeopleCode",level:"intermediate",q:"What does GetRecord() return?",a:"Returns the Record object from the current Row in the buffer. From Record, access Field objects: &rec = &row.GetRecord(Record.JOB); &rec.DEPTID.Value. This is the standard pattern for working with buffer data in loops."},
  {cat:"PeopleCode",level:"intermediate",q:"What is the risk of forgetting &sql.Close()?",a:"Leaves an open DB cursor. In RowInit across many rows, this exhausts database cursor limits and causes DB connection errors. Always: &sql = CreateSQL(...); While &sql.Fetch(); ... End-While; &sql.Close();"},
  {cat:"PeopleCode",level:"intermediate",q:"What is Error() vs Warning() in PeopleCode?",a:"Error() stops processing, highlights the field in red, user must correct before continuing. Warning() shows a message but allows the user to continue. Use Error() for mandatory business rules, Warning() for advisory checks."},
  {cat:"PeopleCode",level:"intermediate",q:"What is RowInsert event?",a:"Fires when a user adds a new row to a grid. Note: RowInit always fires after RowInsert — don't duplicate initialization code in both or it runs twice for new rows."},
  {cat:"PeopleCode",level:"intermediate",q:"How do you call an Application Engine from PeopleCode?",a:"CallAppEngine(AE_PROGRAM_NAME, &runcntlrec) — synchronous call, waits for completion. For asynchronous, schedule via Process Request. CallAppEngine is typically used in SavePostChange to trigger downstream processing."},
  {cat:"PeopleCode",level:"intermediate",q:"What is an Application Package?",a:"PeopleSoft's object-oriented framework for PeopleCode. Packages contain Application Classes with properties and methods. Enables code reuse, encapsulation, and polymorphism. Used for Event Mapping handlers and reusable business logic libraries."},
  {cat:"PeopleCode",level:"intermediate",q:"What is the Component Processor?",a:"The PeopleSoft runtime engine in Tuxedo that manages the complete component lifecycle — loading data into buffer, firing PeopleCode events in sequence, generating SQL, executing DB operations. All page interaction goes through it."},
  {cat:"PeopleCode",level:"intermediate",q:"What is the difference between GetRowset() and GetRowset(Scroll.NAME)?",a:"GetRowset() with no args returns Level 0 — the primary record (always 1 row). GetRowset(Scroll.RECORDNAME) returns Level 1 rowset for that scroll. Must specify scroll name to navigate to child data grids."},
  {cat:"PeopleCode",level:"intermediate",q:"What does ActiveRowCount vs RowCount mean?",a:"RowCount includes rows marked for deletion. ActiveRowCount excludes them. Always use ActiveRowCount in loops to avoid processing rows about to be deleted on save."},
  {cat:"PeopleCode",level:"intermediate",q:"What is FieldDefault event?",a:"Fires before a field is displayed to the user for the first time. Use it to set field defaults based on other data. Fires before PostBuild, so defaults set here are available when PostBuild runs."},
  {cat:"PeopleCode",level:"intermediate",q:"What is SearchInit used for?",a:"Fires before the search dialog is displayed. Used to restrict or pre-populate search criteria — for example, defaulting the Business Unit so users only see their own BU's data in search results."},
  {cat:"PeopleCode",level:"intermediate",q:"What is WorkFlow event?",a:"Fires during the save sequence between SavePreChange and SavePostChange. Used to trigger workflow routing — sending approvals, notifications, or escalations based on data changes during a save."},
  {cat:"PeopleCode",level:"intermediate",q:"What is GetLevel0() in PeopleCode?",a:"Returns the Level 0 Rowset — the top-level component buffer (always 1 row). Equivalent to GetRowset(). From Level 0 you can navigate down to Level 1 child scrolls using GetRow(1).GetRowset(Scroll.CHILDRECORD)."},
  {cat:"PeopleCode",level:"intermediate",q:"How do you hide a page tab in PeopleCode?",a:"Use SetPageTabOrder to hide tabs, or reference the page directly: GetPage(Page.PAGENAME).Visible = False. Page visibility is typically controlled in PostBuild based on user role or component mode (Add vs Update)."},
  {cat:"PeopleCode",level:"intermediate",q:"What is %Mode system variable?",a:"%Mode returns the component mode: A (Add), U (Update/Display), L (Update/Display All), E (Correction), D (Data Entry). Useful for conditionally enabling fields or defaulting values differently in Add vs Update mode."},
  {cat:"PeopleCode",level:"intermediate",q:"What is the difference between %Date and %DateIn?",a:"%Date returns today's date as a PeopleCode Date value. %CurrentDateIn returns today's date formatted correctly for SQL WHERE clauses for the current database platform (Oracle TO_DATE vs SQL Server GETDATE format)."},
  {cat:"PeopleCode",level:"intermediate",q:"What does Rededit vs SaveEdit control?",a:"FieldEdit controls individual field value acceptance — rejects a value before it enters the buffer. SaveEdit validates the complete component state before committing — checks cross-field rules and business logic across all pages."},
  {cat:"PeopleCode",level:"intermediate",q:"What is DoModal() in PeopleCode?",a:"Opens a secondary component as a modal popup dialog — user must complete or cancel it before returning to the parent component. Used for confirmations, entry dialogs, and sub-transactions within a main transaction."},
  {cat:"PeopleCode",level:"intermediate",q:"What is TransferPage() used for?",a:"Transfers the user to a different page within the same component. Used for wizard-style navigation or conditional page flow. Different from navigating between tabs — this programmatically controls page flow."},
  {cat:"PeopleCode",level:"intermediate",q:"What is the Activate event?",a:"Fires each time a page tab becomes visible — when user clicks a tab or when the page first displays. Used for tab-specific initialization, refreshing data on the tab, or hiding/showing fields specific to that tab."},

  // ── RECORDS & FIELDS (25) ──
  {cat:"Records & Fields",level:"intermediate",q:"What is the difference between SQL View and Dynamic View?",a:"SQL View creates a permanent DB view object. Dynamic View stores SQL in metadata — no DB object created, SQL resolves at runtime. Dynamic Views allow runtime-specific filtering (current user's SetID) impossible in static views. Both read-only."},
  {cat:"Records & Fields",level:"intermediate",q:"Why not add fields directly to delivered records?",a:"Oracle overwrites delivered objects during upgrades. Add a field to PS_JOB → next upgrade removes it. Best practice: create extension record ZZ_JOB_EXT with same keys. For PT 8.55+, Event Mapping is upgrade-safe entirely."},
  {cat:"Records & Fields",level:"intermediate",q:"What is row-level security implementation?",a:"Replace PS_JOB (base table) with a security view as the Search Record. The view joins PS_JOB with department security tables — auto-filters based on user's security profile. Without this, all users see all data."},
  {cat:"Records & Fields",level:"intermediate",q:"What is SetID and TableSet sharing?",a:"SetID is a code assigned to setup tables controlling which reference data applies to each Business Unit. Multiple BUs can share SetID SHARE. PS_SET_CNTRL_TBL links each BU to SetIDs per record group — enabling shared setup with separate configurations."},
  {cat:"Records & Fields",level:"intermediate",q:"What is an Alternate Search Key (A)?",a:"Creates a DB index on that field enabling efficient searching without making it a primary key. Example: LAST_NAME as A on PS_NAMES enables fast employee name searches. Without it, full table scans occur."},
  {cat:"Records & Fields",level:"intermediate",q:"What is a List Box Item (L)?",a:"Field appears as a column in the search results list — helps users identify which row to select. Example: showing Employee Name, Job Title alongside Employee ID in search results."},
  {cat:"Records & Fields",level:"intermediate",q:"What is a Temp Table record type?",a:"Creates multiple DB instances (MYTEMP_AET, MYTEMP_AET1...) allowing parallel AE processes to work simultaneously without data collision. Number of instances configured on the AE Program properties."},
  {cat:"Records & Fields",level:"intermediate",q:"Why are PeopleSoft fields defined globally?",a:"One global field definition (e.g., EMPLID) used across hundreds of records. Change the label once — updates everywhere automatically. Ensures consistency of field properties, validation, and display across the entire application."},
  {cat:"Records & Fields",level:"intermediate",q:"What is a Query View?",a:"Created and managed by PS Query. Allows query results to become the source for another query — enabling complex nested query scenarios. Not manually created in Application Designer."},
  {cat:"Records & Fields",level:"intermediate",q:"What does Alternate Search Key (A) create in the database?",a:"A non-unique database index on that field. This index is what makes searching by that field fast. Without the A designation, PeopleSoft won't create an index and searches will perform full table scans."},
  {cat:"Records & Fields",level:"intermediate",q:"What is EFFDT_SBR?",a:"A SubRecord containing EFFDT (Effective Date) and EFFSEQ (Effective Sequence). Included in hundreds of PeopleSoft records to implement the standard effective dating pattern consistently without redefining the same two fields everywhere."},
  {cat:"Records & Fields",level:"intermediate",q:"What is the difference between Key (K) and Search Key (S)?",a:"K (Key) makes the field part of the record's primary key — used to uniquely identify rows. S (Search Key) displays the field in the search dialog as an input field. A field can be both K and S — like EMPLID."},
  {cat:"Records & Fields",level:"intermediate",q:"What is a record's Use tab in Application Designer?",a:"Defines which Set Control field, Effective Date field, and Language field the record uses. Also specifies audit options (when to log changes), record audit options, and query security group for PS Query access."},
  {cat:"Records & Fields",level:"intermediate",q:"What is Meta-SQL %Table()?",a:"%Table(RECORDNAME) resolves to PS_RECORDNAME at runtime, correctly for the target database. Prevents hardcoding PS_ prefix in SQL — ensures portability. Example: %Table(JOB) → PS_JOB."},
  {cat:"Records & Fields",level:"intermediate",q:"How do you add a field to all records using it after a global field change?",a:"If you change a field's length or type, you must run Alter Table (Build → Alter) on all records using that field to update the physical DB columns. Changing the field definition alone does not alter the DB schema."},
  {cat:"Records & Fields",level:"intermediate",q:"What is a Translate Value (XLAT)?",a:"Short code list (max 4 chars) stored in PSXLATITEM — PeopleSoft's universal lookup for stable values. Examples: EMPL_STATUS (A=Active, T=Terminated), ACTION (HIR, PRO, TER). Managed in App Designer, not in custom tables."},
  {cat:"Records & Fields",level:"intermediate",q:"What happens when you mark a Translate Value as Inactive?",a:"It disappears from dropdown lists for new entries but historical records referencing it remain valid. Never delete a XLAT value used in live data — it would break existing records. Mark Inactive with an effective date instead."},
  {cat:"Records & Fields",level:"intermediate",q:"What is a Long Character field type?",a:"Stores text up to 32,760 characters (vs CHAR max of 32,767 but practically 254 in some contexts). Used for notes, descriptions, comments, and free-text fields. Stored as CLOB/LONG in the database."},
  {cat:"Records & Fields",level:"intermediate",q:"What does the Record Type tab show in Application Designer?",a:"Displays the record type (SQL Table, SQL View, etc.), the SQL view text (for views), and edit/audit options. For SQL Views, this is where you write the actual SELECT statement that defines the view."},
  {cat:"Records & Fields",level:"intermediate",q:"What is an Image field type?",a:"Stores binary image data in the database. Used for employee photos, document attachments. PeopleSoft provides built-in image handling pages for upload/display. Stored as BLOB in the underlying database."},
  {cat:"Records & Fields",level:"intermediate",q:"What is the significance of BUSINESS_UNIT in PeopleSoft?",a:"A fundamental organizational key used across all PeopleSoft modules. Separates data by business entity. Used with SetID to control which setup tables apply to each BU. Almost every transactional record includes BUSINESS_UNIT as a key."},
  {cat:"Records & Fields",level:"intermediate",q:"What is record field PeopleCode?",a:"PeopleCode attached directly to a record field — not to a page or component. Fires regardless of which component displays the field. Examples: FieldDefault, FieldFormula, FieldEdit, FieldChange, SearchInit, SearchSave attached to record.field."},
  {cat:"Records & Fields",level:"intermediate",q:"What is a required field in PeopleSoft?",a:"A field marked as Required in the record definition or page definition. PeopleSoft enforces that the field has a value before save. Required at record level applies everywhere the field appears. Required at page level applies only on that page."},
  {cat:"Records & Fields",level:"intermediate",q:"What is the difference between character and number field types?",a:"CHAR stores text with fixed or variable length. NUMBER stores numeric values with defined precision and scale. PeopleSoft uses CHAR for codes (EMPLID, DEPTID) even when values look numeric — ensures leading zeros are preserved."},
  {cat:"Records & Fields",level:"intermediate",q:"What does Audit Record do in Application Designer?",a:"Configures the record to automatically log changes to an audit table. PeopleSoft creates PS_AUDIT_RECORDNAME entries with old/new values, timestamp, and user ID for every change. Essential for regulated industries and SOX compliance."},

  // ── EFFECTIVE DATING (20) ──
  {cat:"Effective Dating",level:"beginner",q:"What happens to PS_JOB when an employee is promoted?",a:"A new row is inserted with the promotion date as EFFDT and ACTION=PRO. The old hire row remains permanently. No UPDATE — always INSERT. PS_JOB is append-only for job changes."},
  {cat:"Effective Dating",level:"beginner",q:"What does EFFSEQ handle?",a:"Multiple changes on the same Effective Date. First change EFFSEQ=0, second EFFSEQ=1. The row with MAX(EFFSEQ) for a given EFFDT is the most current for that date."},
  {cat:"Effective Dating",level:"beginner",q:"SQL to get current row from an effective-dated table?",a:"WHERE EFFDT = (SELECT MAX(EFFDT) FROM PS_JOB B WHERE B.EMPLID=A.EMPLID AND B.EFFDT <= %CurrentDateIn) AND EFFSEQ = (SELECT MAX(EFFSEQ) FROM PS_JOB C WHERE C.EMPLID=A.EMPLID AND C.EFFDT=A.EFFDT) — both subqueries needed."},
  {cat:"Effective Dating",level:"beginner",q:"What is a future-dated row?",a:"A row with EFFDT > today. It exists in the DB now but won't be 'current' until its date arrives. Example: entering next month's salary increase today — payroll automatically uses the new rate when the date arrives."},
  {cat:"Effective Dating",level:"beginner",q:"Why might PS_JOB have 30 rows for one employee?",a:"Each job change (ACTION) creates one new row: hire, transfers, promotions, pay changes, leaves, returns. An employee with 10+ years of changes easily has 30+ rows. All history preserved — nothing deleted."},
  {cat:"Effective Dating",level:"beginner",q:"What is Correction Mode?",a:"Allows authorized users to directly modify historical effective-dated rows. Tightly security-controlled — retroactive corrections can trigger payroll recalculation. Regular users typically have Update/Display only, not Correction."},
  {cat:"Effective Dating",level:"beginner",q:"Most common mistake querying PS_JOB?",a:"Missing effective dating WHERE clause — returns ALL rows (30+ per employee) causing duplicate results. Every query against effective-dated tables needs the MAX(EFFDT) ≤ today and MAX(EFFSEQ) subqueries."},
  {cat:"Effective Dating",level:"intermediate",q:"What is retroactive payroll and why does effective dating enable it?",a:"When salary is backdated, payroll recalculates prior periods using historical PS_JOB rows. Because rows are never deleted, payroll can access the exact salary that was active during any past period — enabling accurate retroactive calculation."},
  {cat:"Effective Dating",level:"intermediate",q:"What does ACTION_REASON store in PS_JOB?",a:"A sub-code providing more detail about the ACTION. For ACTION=TER (Termination), ACTION_REASON might be RES (Resignation), LAY (Layoff), or RET (Retirement). Together they tell the complete story of every job change."},
  {cat:"Effective Dating",level:"intermediate",q:"What is the difference between effective dating and history rows?",a:"All rows are history — PeopleSoft doesn't distinguish current from history in storage. The 'current' row is determined by query criteria (MAX EFFDT ≤ today). Future rows also exist — they just haven't become current yet."},
  {cat:"Effective Dating",level:"intermediate",q:"Why does PS_JOB use EMPL_RCD as a key field?",a:"Allows one employee (EMPLID) to hold multiple simultaneous job records — concurrent employment. Primary job = EMPL_RCD 0. A part-time second position = EMPL_RCD 1. Full key: EMPLID + EMPL_RCD + EFFDT + EFFSEQ."},
  {cat:"Effective Dating",level:"intermediate",q:"What is the impact of not including EMPL_RCD in PS_JOB queries?",a:"If an employee has two concurrent jobs (EMPL_RCD 0 and 1), omitting EMPL_RCD from the WHERE clause returns double the rows — one set per EMPL_RCD. Always include EMPL_RCD = 0 unless specifically reporting concurrent jobs."},
  {cat:"Effective Dating",level:"intermediate",q:"How do you query data at a specific point in time in the past?",a:"Replace %CurrentDateIn with the target date: WHERE EFFDT = (SELECT MAX(EFFDT) ... WHERE EFFDT <= TO_DATE('2023-01-01','YYYY-MM-DD')). This returns the row that was active on January 1, 2023 — even if a newer row exists today."},
  {cat:"Effective Dating",level:"intermediate",q:"What setup tables use effective dating?",a:"Almost all — PS_DEPT_TBL (departments), PS_JOBCODE_TBL (job codes), PS_LOCATION_TBL (locations), PS_COMPANY_TBL (companies), PS_PAY_GRADE_TBL (salary grades). Effective dating in setup tables preserves configuration history alongside transaction history."},
  {cat:"Effective Dating",level:"intermediate",q:"What is EFFDT in PeopleSoft date format vs database format?",a:"PeopleSoft stores dates in the database in the standard DB format (DATE type). When coding SQL in PeopleCode, always use %CurrentDateIn for today — never hardcode date literals. This ensures correct format across Oracle, SQL Server, and DB2."},
  {cat:"Effective Dating",level:"advanced",q:"How do you handle effective dating in a PS Query joining two effective-dated tables?",a:"Both tables need their own effective dating criteria. Example joining PS_JOB and PS_DEPT_TBL: PS_JOB needs MAX(EFFDT) ≤ today, AND PS_DEPT_TBL needs its own MAX(EFFDT) ≤ today. Missing either one causes row multiplication."},
  {cat:"Effective Dating",level:"advanced",q:"What is future-row conflict in PeopleSoft?",a:"When a correction to a past row conflicts with a future row that was entered based on the old data. Example: change July salary — August future row may have been entered assuming July's salary. PeopleSoft shows warnings but allows the correction."},
  {cat:"Effective Dating",level:"advanced",q:"How does effective dating affect Application Engine SQL performance?",a:"AE batch SQL against large effective-dated tables (PS_JOB with millions of rows) must use proper MAX(EFFDT) subqueries AND ensure correct indexes exist on EMPLID, EFFDT. Without indexes, correlated subqueries cause full table scans across millions of rows."},
  {cat:"Effective Dating",level:"advanced",q:"What is the difference between effective dating and row-level audit?",a:"Effective dating preserves intended historical state — 'this was the salary on this date'. Audit tables (PS_AUDIT_*) record who changed what and when — the change event. Both serve different purposes: effective dating for business history, audit for compliance logging."},
  {cat:"Effective Dating",level:"advanced",q:"What is EFFDT on PS_DEPT_TBL and why does it matter in joins?",a:"PS_DEPT_TBL has its own EFFDT — a department can change its name, manager, or location over time. When joining PS_JOB to PS_DEPT_TBL for a historical report, you must match each job row's DEPTID to the department description active on the same date — not today's description."},

  // ── ARCHITECTURE (20) ──
  {cat:"Architecture",level:"beginner",q:"What are the three tiers of PIA?",a:"Tier 1 (Web): Oracle WebLogic — handles HTTP/HTTPS, pure presentation. Tier 2 (App): Oracle Tuxedo — all PeopleCode, Component Processor, business logic. Tier 3 (DB): Oracle/SQL Server/DB2 — data and metadata storage. All logic runs in Tier 2."},
  {cat:"Architecture",level:"beginner",q:"What protocol does WebLogic use to talk to Tuxedo?",a:"JOLT (Java Object Linking and Transactions) — Oracle's proprietary protocol between WebLogic and Tuxedo. JOLT port is typically 9000. WebLogic forwards requests to Tuxedo via JOLT; Tuxedo sends back processed HTML."},
  {cat:"Architecture",level:"beginner",q:"What is PSAPPSRV?",a:"The core Tuxedo process handling component buffer operations, PeopleCode execution, and SQL generation for online component transactions. Multiple PSAPPSRV instances run simultaneously for concurrent users."},
  {cat:"Architecture",level:"intermediate",q:"What is PSQRYSRV?",a:"Dedicated Tuxedo process for PS Query execution — separated from PSAPPSRV to prevent heavy queries from blocking online component transactions. Users running large queries don't impact other users' page performance."},
  {cat:"Architecture",level:"intermediate",q:"What is PSSAMSRV?",a:"Security/Authentication Manager Server — handles user authentication during PeopleSoft signon. Validates credentials against the PeopleSoft user profile database. Part of the Tuxedo App Server domain."},
  {cat:"Architecture",level:"intermediate",q:"What is PSDSTSRV (Distribution Agent)?",a:"Moves completed batch process output files from the batch server to the Report Repository web server. Without PSDSTSRV running, batch processes complete but users cannot see output in Report Manager."},
  {cat:"Architecture",level:"intermediate",q:"What is a PeopleSoft Domain?",a:"An instance of either the Tuxedo Application Server or Process Scheduler. Standard setup: one App Server domain, one Process Scheduler domain. High-availability: multiple domains per tier. Configured via PSADMIN."},
  {cat:"Architecture",level:"intermediate",q:"What is the Report Repository?",a:"A web server directory where completed batch output (reports, log files) is stored and served to users through Report Manager. PSDSTSRV transfers files here. Users click 'View Log' in Process Monitor to access output."},
  {cat:"Architecture",level:"intermediate",q:"What is PSADMIN?",a:"PeopleSoft's command-line administration utility for managing App Server and Process Scheduler domains — start/stop/configure/monitor. Run on the server hosting Tuxedo. Provides menus for domain configuration."},
  {cat:"Architecture",level:"intermediate",q:"What is a DPK (Deployment Package)?",a:"Puppet-based automation scripts that install and configure a complete PeopleSoft environment. Standard from PT 8.55+. Replaced manual multi-day installs with automated setup in hours. VirtualBox-based for development environments."},
  {cat:"Architecture",level:"intermediate",q:"What is PUM (PeopleSoft Update Manager)?",a:"Oracle's selective patching system. Organizations download a PeopleSoft Image VM, browse available fixes/features in a web UI, select exactly what to apply, generate a Change Package. Replaced annual bundle patching from ~2014."},
  {cat:"Architecture",level:"intermediate",q:"What is the difference between online and batch processing in PeopleSoft?",a:"Online: user-driven, runs in the App Server (Tuxedo), real-time response required, limited to component transactions. Batch: scheduled/submitted, runs in Process Scheduler, handles large datasets, no user interaction during execution."},
  {cat:"Architecture",level:"advanced",q:"What is the Tuxedo bulletin board?",a:"Tuxedo's shared memory segment where service requests are queued and dispatched to available server processes. Manages load balancing across multiple PSAPPSRV instances. If the bulletin board fills up, users get 'server busy' errors."},
  {cat:"Architecture",level:"advanced",q:"What is connection pooling in PeopleSoft?",a:"The App Server maintains a pool of persistent database connections shared across PSAPPSRV processes. Individual user requests use a connection from the pool rather than creating new DB connections — dramatically improves performance and reduces DB load."},
  {cat:"Architecture",level:"advanced",q:"What is the Process Scheduler architecture?",a:"Process Scheduler (PSPRCSRV) maintains a queue of submitted process requests in PS_PRCSPARMS. It spawns child processes (AE, SQR, etc.) to execute jobs. PSDSTSRV moves output to Report Repository. All tracked in PS_PRCSPARMS / PS_PMN_PRCSLIST."},
  {cat:"Architecture",level:"advanced",q:"What is the difference between App Server cache and DB metadata?",a:"App Server caches PeopleTools metadata (record definitions, page definitions, PeopleCode) in server memory to avoid repeated DB metadata reads. Cache is populated on first access and refreshed when you run Build or cache clearing utilities."},
  {cat:"Architecture",level:"advanced",q:"What is the significance of the JOLT port?",a:"The JOLT port (typically 9000) is the network port on the App Server that WebLogic connects to. Firewall rules must allow WebLogic to reach this port. Multiple App Server domains use different JOLT ports. PSADMIN shows current port configuration."},
  {cat:"Architecture",level:"advanced",q:"What is a PeopleSoft Search Framework?",a:"Elasticsearch-based full-text search introduced in PT 8.52. Enables powerful keyword search across PeopleSoft components. Requires a separate Elasticsearch cluster. Fluid components use Search Framework for the main search bar. Classic components use PS Query-based search."},
  {cat:"Architecture",level:"advanced",q:"What is Change Assistant?",a:"PeopleSoft's upgrade automation tool. Reads a Change Package (generated by PUM) and applies it step-by-step to the target environment. Automates compare, copy, build, and data conversion steps. Provides detailed progress tracking and error reporting."},
  {cat:"Architecture",level:"advanced",q:"What are Tuxedo server processes and how many should you have?",a:"PSAPPSRV, PSQRYSRV, PSSAMSRV, PSDSTSRV, PSANALYTICSRV, PSSUBSRV, etc. Number of PSAPPSRV instances depends on concurrent user count and transaction volume. Standard sizing: 3-5 PSAPPSRV per 100 concurrent users. Configured in PSADMIN per domain."},

  // ── SECURITY (20) ──
  {cat:"Security",level:"beginner",q:"What is PeopleSoft's security hierarchy?",a:"User Profile → Roles → Permission Lists. User Profiles are assigned Roles. Roles bundle Permission Lists. Permission Lists define actual access. Change a Role once — affects all users with that Role."},
  {cat:"Security",level:"beginner",q:"What does a Permission List control?",a:"Component access (which pages, which modes), process groups (which batch jobs), PS Query access (which record groups), Integration Broker access, sign-on times, PeopleTools access (App Designer, Data Mover, etc.)."},
  {cat:"Security",level:"beginner",q:"What is row-level security?",a:"Controls which DATA rows a user can see within components they have page access to. An HR admin with Job Data access might only see employees in authorized departments — enforced via security views on the Search Record."},
  {cat:"Security",level:"intermediate",q:"What is the difference between page-level and row-level security?",a:"Page-level (Permission Lists): can the user access this component, and in which mode? Row-level: which data rows are visible within accessible components? Both are needed — page security controls access, row security controls scope."},
  {cat:"Security",level:"intermediate",q:"How is row-level security implemented technically?",a:"Security views join the base table with PS_DEPT_SECURITY (or similar) filtered by OPRCLASS. The user's operator class determines which departments they can see. Security view used as Search Record — automatically restricts results."},
  {cat:"Security",level:"intermediate",q:"What is a Primary Permission List?",a:"Every User Profile has one Primary Permission List that controls their process profile (which processes they can submit), navigation homepage default, and serves as the row-level security operator class. Most critical Permission List on a user."},
  {cat:"Security",level:"intermediate",q:"What is a Row Security Permission List?",a:"The Permission List that determines which data rows the user can see through row-level security views. Stored in PSOPRCLS on the User Profile. Security views query PS_SCRTY_TBL_DEPT (or similar) using this value to filter results."},
  {cat:"Security",level:"intermediate",q:"What is a Query Access Tree?",a:"Configured in Permission Lists — defines which PeopleSoft records a user can build PS Queries against. Without tree access to a record, users can't see it in Query Manager interface — preventing queries against sensitive tables."},
  {cat:"Security",level:"intermediate",q:"What is Data Permission in PeopleSoft Security?",a:"Controls which SetIDs and Business Units a user can access. Configured in Permission Lists under Data Permissions. Restricts access to specific business entities — preventing users from one division seeing another division's data."},
  {cat:"Security",level:"intermediate",q:"What are Sign-on Times in Permission Lists?",a:"Controls when users can sign into PeopleSoft — days of week and time windows. Used for maintenance windows or restricting off-hours access. Part of Permission List configuration."},
  {cat:"Security",level:"intermediate",q:"What is the ALLPAGES Permission List?",a:"A special delivered Permission List granting access to all pages. Should NEVER be assigned to regular business users — grants unrestricted access to all components in all modules. Use only for system administrators and emergency access."},
  {cat:"Security",level:"intermediate",q:"What is a Role in PeopleSoft security?",a:"A bundle of Permission Lists assigned to users sharing the same access needs. Example: HR Coordinator Role bundles Permission Lists for Job Data, Personal Data, Benefits, Absence. Assign the Role to all HR Coordinators — one change applies everywhere."},
  {cat:"Security",level:"intermediate",q:"What is Fluid security vs Classic security?",a:"Both use the same Permission List/Role model. Fluid tiles use CREF security — users must have access to the CREF to see the tile. NavBar items are also CREF-controlled. The underlying component security (page access modes) remains the same."},
  {cat:"Security",level:"intermediate",q:"What is definition security in Application Designer?",a:"Controls which PeopleSoft object definitions (Records, Pages, Components, PeopleCode) a developer can view/modify in Application Designer. Separate from runtime page security. Controlled in PeopleTools → Security → Definition Security."},
  {cat:"Security",level:"advanced",q:"What is a Department Security Tree?",a:"A tree structure in PeopleSoft defining which departments each security group can access. Users with a given Row Security Permission List can see employees in all departments under their authorized tree nodes. Changes to tree propagate automatically."},
  {cat:"Security",level:"advanced",q:"How do you troubleshoot a user who can't see a component in the menu?",a:"Check: 1) User's Roles include a Role that has the correct Permission List. 2) Permission List has the component in the correct navigation folder with appropriate access mode. 3) CREF exists and is active in Portal Registry. 4) User's browser cache is cleared."},
  {cat:"Security",level:"advanced",q:"What is Single Sign-On (SSO) in PeopleSoft?",a:"Allows users authenticated in one system (like Oracle Identity Manager) to access PeopleSoft without re-entering credentials. Implemented via trusted tokens, SAML, or PeopleSoft's PS_TOKEN mechanism. Requires Integration Broker node configuration."},
  {cat:"Security",level:"advanced",q:"What is PeopleSoft's encryption for sensitive data?",a:"Credit card numbers, national IDs, bank accounts can be encrypted using PeopleSoft's built-in encryption framework (RC2/3DES/AES). Encrypted fields display masked values on pages. Application Engine jobs can process encrypted values without exposing them."},
  {cat:"Security",level:"advanced",q:"What is a portal node in PeopleSoft security?",a:"Defines a PeopleSoft system instance in the Portal (default node = local system). Content References (CREFs) can point to remote nodes for cross-system navigation. Single Sign-On between nodes uses the PS_TOKEN mechanism with trusted nodes."},
  {cat:"Security",level:"advanced",q:"What is auditing in PeopleSoft and how is it configured?",a:"Record-level auditing (record field changes) configured in App Designer on the record — logs to PS_AUDIT_RECORDNAME. Component-level auditing logs all component saves. Audit tables record: operator, timestamp, old value, new value, action (Add/Update/Delete)."},

  // ── APPLICATION ENGINE (15) ──
  {cat:"Application Engine",level:"intermediate",q:"What is Application Engine?",a:"PeopleSoft's batch processing framework for large-scale data operations. Runs outside online session. Uses Sections, Steps, and Actions (Do Select, Do When, SQL, PeopleCode, Call Section). Has checkpoint/restart capability."},
  {cat:"Application Engine",level:"intermediate",q:"What are the AE Action types?",a:"SQL (execute SQL statement), PeopleCode (run PeopleCode), Do Select (loop through rows), Do When (conditional — if this is true, execute this step), Do While (loop while condition), Do Until (loop until condition), Call Section (invoke another section)."},
  {cat:"Application Engine",level:"intermediate",q:"What is checkpoint/restart in Application Engine?",a:"AE saves its progress at each Section. If it fails mid-way, restarting resumes from the last successful Section — not from the beginning. Prevents reprocessing of already-completed work. Configured per AE program."},
  {cat:"Application Engine",level:"intermediate",q:"What is the Temp Table pattern in AE?",a:"Record type Temp Table creates multiple DB instances (MYTEMP_AET, MYTEMP_AET1...). Each parallel AE instance uses its own instance — preventing data collision. Instance count configured on AE Program properties page."},
  {cat:"Application Engine",level:"intermediate",q:"What is Do Select in Application Engine?",a:"Loops through rows returned by a SQL SELECT. For each row, executes the child Steps. The 'Select/Fetch' action type. Two modes: Re-Select (re-executes SELECT each iteration) and Select Once (fetches all rows then iterates). Select Once is more efficient."},
  {cat:"Application Engine",level:"intermediate",q:"What is %AE_APPLID and %AE_SECTION?",a:"System variables: %AE_APPLID returns the current AE Program ID, %AE_SECTION returns the current Section name. Used in error logging and diagnostics within AE PeopleCode to identify which program/section is currently executing."},
  {cat:"Application Engine",level:"intermediate",q:"What is the difference between State Records and Work Records in AE?",a:"State Records persist values between Steps and Sections throughout the AE run. Work Records are temporary. State Records are typically defined in the AE Program properties. Work Records are used for intermediate calculations cleared between iterations."},
  {cat:"Application Engine",level:"intermediate",q:"How do you pass parameters to an Application Engine?",a:"Via Run Control record (user-submitted) or State Record (programmatic call via CallAppEngine). CallAppEngine: &stateRec.EMPLID.Value = 'KR001'; CallAppEngine('MY_AE', &stateRec); AE reads values from State Record during execution."},
  {cat:"Application Engine",level:"advanced",q:"What is parallel processing in Application Engine?",a:"Using Temp Tables, multiple instances of the same AE program process different data subsets simultaneously. Master AE spawns child processes via PeopleSoft Process Scheduler. Each child uses a different Temp Table instance. Master waits for all children to complete."},
  {cat:"Application Engine",level:"advanced",q:"What is CommitWork in Application Engine?",a:"CommitWork() in AE PeopleCode commits the current transaction to DB without ending the AE run. Critical for batch processes handling millions of rows — commits prevent enormous DB transaction logs. After CommitWork, checkpoint saves the restart position."},
  {cat:"Application Engine",level:"advanced",q:"What is the AE trace file?",a:"Detailed execution log showing every Step executed, SQL statements run, row counts, and timings. Activated by setting trace options on Process Monitor submission or Run Control. Invaluable for diagnosing where an AE fails or performs slowly."},
  {cat:"Application Engine",level:"advanced",q:"What is a Dynamic SQL action in Application Engine?",a:"SQL text built at runtime using PeopleCode — the SQL statement can change based on conditions. Set %BIND(FIELD) in the SQL action, then set the field value in preceding PeopleCode step. More flexible but harder to optimize than static SQL."},
  {cat:"Application Engine",level:"advanced",q:"How do you call one AE program from another?",a:"Call Section action with the external program's Section. Or CallAppEngine() in PeopleCode step — synchronous call, waits for completion. Useful for modular AE design — common sections reused across multiple programs."},
  {cat:"Application Engine",level:"advanced",q:"What is the difference between PSAESRV and running AE directly?",a:"PSAESRV runs AE programs within the App Server domain — used for real-time AE calls from components (CallAppEngine). Running AE directly via Process Scheduler spawns a standalone process. Both use the same AE engine but different execution contexts."},
  {cat:"Application Engine",level:"advanced",q:"What happens if an AE fails mid-run?",a:"Status shows Error in Process Monitor. Log file shows the last Step executed and the error message. Fix the root cause (data issue, SQL error, business rule violation). Restart with the same Process Instance — AE resumes from the last checkpoint Section."},

  // ── INTEGRATION BROKER (15) ──
  {cat:"Integration Broker",level:"intermediate",q:"What is Integration Broker?",a:"PeopleSoft's enterprise messaging platform for real-time and asynchronous integrations. Core concepts: Service Operations (what is exchanged), Nodes (identify systems), Handlers (PeopleCode processing), Routing Rules (direction of messages). Supports REST, SOAP, and async messaging."},
  {cat:"Integration Broker",level:"intermediate",q:"What is a Service Operation?",a:"Defines what data is exchanged — the name, message structure (request/response), and type (Synchronous, Asynchronous, One-way). Every integration uses a Service Operation. Example: EMPLOYEE_SYNC.v1 for sending employee data to a payroll system."},
  {cat:"Integration Broker",level:"intermediate",q:"What is the difference between Synchronous and Asynchronous messaging?",a:"Synchronous: sender waits for response before continuing — used for real-time lookups, validations. Asynchronous: sender sends and continues without waiting — used for bulk data transfer, notifications. Async is more resilient but harder to debug."},
  {cat:"Integration Broker",level:"intermediate",q:"What is a Node in Integration Broker?",a:"Identifies a system in the integration network — could be the local PeopleSoft system, a remote PeopleSoft system, or an external third-party system. Default Local Node = current PeopleSoft instance. Remote Nodes need URL configuration."},
  {cat:"Integration Broker",level:"intermediate",q:"What is an IB Handler?",a:"PeopleCode program (Application Class) that processes an incoming message — reads the message, transforms data, saves to PS tables. OnMessage method handles the main processing. Error handling via OnError method."},
  {cat:"Integration Broker",level:"intermediate",q:"What is a Routing Rule in Integration Broker?",a:"Connects a Service Operation to sender/receiver Nodes. Defines direction (inbound or outbound), active status, and transformation (if message format needs converting between systems). Each Service Operation needs at least one Routing Rule."},
  {cat:"Integration Broker",level:"intermediate",q:"What is the Integration Gateway?",a:"The entry point for all incoming messages — a Java web application on the web server tier. Receives HTTP/HTTPS requests from external systems, routes them to the correct Service Operation in the App Server. Configured in Integration Gateway.properties."},
  {cat:"Integration Broker",level:"advanced",q:"What is a REST Service Operation?",a:"Exposes PeopleSoft data via REST API. GET (retrieve), POST (create), PUT (update), DELETE operations. URI template defines the URL pattern. Response format can be JSON or XML. Requires correct routing and handler PeopleCode. Widely used for cloud integrations."},
  {cat:"Integration Broker",level:"advanced",q:"What is publish/subscribe in Integration Broker?",a:"Publisher Service Operations send messages to a queue. Subscriber Service Operations read and process queued messages. Allows decoupling — publisher doesn't know who receives. Used for event-driven integrations where multiple systems need the same data."},
  {cat:"Integration Broker",level:"advanced",q:"What is a Message Channel?",a:"Groups related async Service Operations — controls processing order and throughput. Messages in a channel are processed sequentially by default. Multiple channels can process in parallel. Channel retry settings control what happens on processing failure."},
  {cat:"Integration Broker",level:"advanced",q:"How do you monitor failed Integration Broker messages?",a:"PeopleTools → Integration Broker → Monitor → Asynchronous Services → Failed. Shows failed messages with error details. Can retry manually after fixing the issue. Also check Integration Broker log files in App Server for connection/gateway errors."},
  {cat:"Integration Broker",level:"advanced",q:"What is a WSDL in PeopleSoft IB?",a:"Web Service Description Language — auto-generated by PeopleSoft for SOAP Service Operations. Describes the service interface — message structure, operations, endpoint URL. External systems consume the WSDL to integrate with PeopleSoft via SOAP."},
  {cat:"Integration Broker",level:"advanced",q:"What is transform PeopleCode in Integration Broker?",a:"PeopleCode that transforms message structure between PeopleSoft and external format. Runs during message routing. Converts PS XML structure to third-party format (or vice versa). Example: mapping EMPLID to ExternalEmployeeID, converting date formats."},
  {cat:"Integration Broker",level:"advanced",q:"What is a Component Interface used for in integrations?",a:"CI provides programmatic component access from IB handlers. Instead of writing direct SQL, the handler calls the CI — which fires all PeopleCode events ensuring business rules run. Standard pattern: IB handler → CI call → data saved with full validation."},
  {cat:"Integration Broker",level:"advanced",q:"What are the steps to set up a new outbound REST integration in PeopleSoft?",a:"1) Create REST-based Service Operation. 2) Define request/response message structure. 3) Configure target system as a Node with REST URL. 4) Create Routing Rule (outbound, local node → target node). 5) Write Handler PeopleCode to call the service. 6) Test via IB Monitor."},

  // ── PS QUERY & REPORTING (15) ──
  {cat:"PS Query",level:"beginner",q:"What are the three PS Query types?",a:"User Query (private — creator only), Role Query (shared with users having a specific Role), Public Query (all users with query access). Controlled in Query Manager."},
  {cat:"PS Query",level:"beginner",q:"What is a Prompt in PS Query?",a:"Runtime parameter — user enters a filter value when running the query. Makes queries reusable for different values. Example: prompt for Department ID so the same query can report on any department without modification."},
  {cat:"PS Query",level:"intermediate",q:"What is a Query Access Tree?",a:"Security configuration in Permission Lists defining which PeopleSoft records users can query. Without tree access to a record, users can't see it in Query Manager — prevents access to sensitive data through ad-hoc queries."},
  {cat:"PS Query",level:"intermediate",q:"What is a Connected Query?",a:"Links multiple PS Queries in a parent-child relationship — child query uses a field from the parent as a parameter. Useful for producing hierarchical data (e.g., parent: employees, child: each employee's job history) in one query run."},
  {cat:"PS Query",level:"intermediate",q:"What is the difference between an Inner Join and Left Outer Join in PS Query?",a:"Inner Join: returns only rows matching in both records — employee must have matching job data. Left Outer Join: returns all rows from the primary record even if no match in the joined record — shows employees even without job data."},
  {cat:"PS Query",level:"intermediate",q:"What is a HAVING clause in PS Query?",a:"Filters aggregate results (after GROUP BY). Example: show only departments with more than 10 employees. WHERE filters individual rows; HAVING filters grouped results. Configured in PS Query's Criteria section with aggregate functions."},
  {cat:"PS Query",level:"intermediate",q:"What is BI Publisher?",a:"PeopleSoft's formatted reporting tool. Creates PDF, Excel, RTF, HTML output from templates. Uses PS Query or Application Engine as data source. Bursting feature distributes report sections to individual recipients. Used for pay slips, tax forms, audit reports."},
  {cat:"PS Query",level:"intermediate",q:"What is SQR?",a:"Structured Query Report — PeopleSoft's legacy batch reporting language. SQR programs are text files combining SQL, procedural logic, and output formatting. Still widely used for complex payroll reports, tax filings, and data migration. Runs via Process Scheduler."},
  {cat:"PS Query",level:"intermediate",q:"How do you schedule a PS Query to run automatically?",a:"Create a BI Publisher report using the PS Query as data source. Schedule the BIP report via Process Scheduler Run Control. Alternatively, use an Application Engine to call the query via SQLExec and output results. Pure PS Query cannot be scheduled directly."},
  {cat:"PS Query",level:"advanced",q:"What are Aggregate functions in PS Query?",a:"COUNT, SUM, AVG, MIN, MAX — applied to fields in PS Query. Use with GROUP BY to summarize data. Example: COUNT(EMPLID) per DEPTID to get headcount by department. Results filtered with HAVING clause, not WHERE."},
  {cat:"PS Query",level:"advanced",q:"What is PS/nVision?",a:"PeopleSoft's Excel-based reporting tool for financial analysis — primarily used in FSCM. Creates Excel spreadsheets with live PeopleSoft data. Uses DrillDown for navigating from summary to detail. Common for GL balance sheets, budget vs actual reporting."},
  {cat:"PS Query",level:"advanced",q:"What is Query Viewer vs Query Manager?",a:"Query Manager: full access — create, edit, run, delete queries. Query Viewer: run-only access — cannot create or modify. Access controlled via Permission Lists. Most business users get Query Viewer; analysts get Query Manager."},
  {cat:"PS Query",level:"advanced",q:"What is XMLP/BI Publisher data source?",a:"BIP supports three data source types: PS Query (most common), Rowset-based (from Application Engine), and XML file. PS Query data source is simplest — define the query, map fields to BIP template layout. AE data sources handle complex multi-level data."},
  {cat:"PS Query",level:"advanced",q:"What is bursting in BI Publisher?",a:"Automatically splits a single report and distributes each section to a different recipient. Example: generate all employee pay slips in one run, burst to each employee's email. Configured in BIP delivery options. Eliminates manual report distribution."},
  {cat:"PS Query",level:"advanced",q:"What is the Reporting Tools security consideration?",a:"PS Query can bypass row-level security if the query directly accesses base tables instead of security views. Query Access Trees control which tables users can query, but the tree doesn't enforce row-level filtering. Custom security views must be used as query records."},

  // ── COMPONENT INTERFACE (10) ──
  {cat:"Component Interface",level:"intermediate",q:"What is a Component Interface?",a:"Provides programmatic access to a PeopleSoft component — fires the same PeopleCode events as the online component. Used for data migration (via AE), external integrations (via IB), and automated testing. Business rules always run through CI."},
  {cat:"Component Interface",level:"intermediate",q:"When should you use CI instead of direct SQL?",a:"Whenever business rules must run — hire, transfer, benefit enrollment. Direct SQL inserts bypass FieldEdit, SaveEdit, PostBuild, workflow. CI fires all events ensuring data integrity. Use direct SQL only for reference/setup data without business logic."},
  {cat:"Component Interface",level:"intermediate",q:"What is the CI development process?",a:"1) Open the target component in App Designer. 2) File → Create Component Interface. 3) Map Keys (component search keys → CI keys). 4) Test in CI Tester (App Designer). 5) Generate PeopleCode template. 6) Use template in AE or IB handler."},
  {cat:"Component Interface",level:"intermediate",q:"What are CI Properties and Collections?",a:"Properties map to record fields — get/set individual field values. Collections represent grid/scroll data — use GetItem(), InsertItem(). The CI structure mirrors the component structure. Parent CI has child Collections for each Level 1 scroll."},
  {cat:"Component Interface",level:"intermediate",q:"What is CI error handling?",a:"Wrap CI calls in Try/Catch. Check &ci.Error after each operation. Error messages from PeopleCode Error() statements in component events are trapped by the CI caller. Log errors to a staging/error table for reporting."},
  {cat:"Component Interface",level:"advanced",q:"What is the performance impact of CI-based data loading?",a:"Each CI call opens component, fires all events, saves, closes. For 50,000 records: 50,000 component opens + all PeopleCode events each time. Significantly slower than direct SQL but ensures business rules. Benchmark: typically 500-2000 records/hour depending on component complexity."},
  {cat:"Component Interface",level:"advanced",q:"What is a CI Find method?",a:"Searches for existing component data — equivalent to the component search dialog. FindKeyProperty specifies search criteria. Returns a collection of matching keys. Use before Get to verify a record exists before trying to open it."},
  {cat:"Component Interface",level:"advanced",q:"What is CI versioning?",a:"CIs have a version number. When the underlying component changes (fields added/removed), the CI must be regenerated. Calling code referencing old properties that no longer exist fails at runtime. Version management is critical during upgrades."},
  {cat:"Component Interface",level:"advanced",q:"What is the difference between CI Get and CI Create?",a:"Get: opens existing component data (like Update mode). Must find existing keys. Create: opens component in Add mode to create new records. Both fire the appropriate component events. GetEffDt handles effective-dated creates."},
  {cat:"Component Interface",level:"advanced",q:"What is CI Cancel?",a:"Discards all changes made through the CI without saving. Equivalent to clicking Cancel on the page. Important for error scenarios — if processing fails partway, Cancel prevents partial data from being saved to DB."},

  // ── REAL PROJECT (20) ──
  {cat:"Real Project",level:"advanced",q:"Page loads in 45 seconds. SQL trace shows 500 identical SELECTs. Cause?",a:"SQLExec in RowInit. Fires for every grid row — 500 rows = 500 DB calls. Fix: pre-fetch all data in PostBuild using CreateSQL into an object, then read from the object in RowInit. One DB call instead of 500."},
  {cat:"Real Project",level:"advanced",q:"User can see page but cannot save. No error appears.",a:"Permission List access mode is Display Only. Change to Update/Display. The Save button is hidden or disabled in Display Only mode. Check user's Roles → Permission Lists → component access mode."},
  {cat:"Real Project",level:"advanced",q:"Custom component shows all employees to all users.",a:"PS_JOB used as Search Record bypasses row-level security. Replace with a security view joining PS_JOB with department security tables. View auto-filters based on user's Row Security Permission List."},
  {cat:"Real Project",level:"advanced",q:"Component migrated to QA but not showing in menu.",a:"App Designer objects migrated but Portal CREF not migrated. CREFs are Portal objects — must be explicitly included in project and migrated. Run project migration including Portal objects."},
  {cat:"Real Project",level:"advanced",q:"Batch process Error status in Process Monitor. How to diagnose?",a:"Process Monitor → click process → View Log/Trace. Read actual error message. Check Run Control parameters (valid dates, company, pay group). Run failing SQL manually with same parameters. Check for null values and referential integrity issues."},
  {cat:"Real Project",level:"advanced",q:"Employee report shows wrong department for last January.",a:"Report fetches today's current row instead of historical. Add effective dating WHERE clause referencing the report period date: WHERE EFFDT <= TO_DATE('2023-01-31','YYYY-MM-DD'). Without this, always shows today's department."},
  {cat:"Real Project",level:"advanced",q:"How to load 50,000 employees from an external file?",a:"Stage data in a PS table. Build AE reading from staging table. Call Component Interface for each employee — fires all business rules. Log errors to error table. Retry failed records after data correction. Never use direct SQL for hire transactions."},
  {cat:"Real Project",level:"advanced",q:"After upgrade, customization is gone.",a:"Directly modified a delivered object — upgrade overwrote it. Future fix: clone with custom prefix (ZZ_COMPNAME) before modifying. For PT 8.55+, use Event Mapping — completely upgrade-safe. Always use your own prefix, never modify delivered objects directly."},
  {cat:"Real Project",level:"advanced",q:"PS Query returning 15x expected rows when joining PS_PERSONAL_DATA and PS_JOB.",a:"Missing effective dating on PS_JOB. Each employee has 15+ rows in PS_JOB. Without MAX(EFFDT) criteria, 1 PERSONAL_DATA row × 15 JOB rows = 15 result rows per employee. Add effective dating WHERE clause to PS_JOB criteria."},
  {cat:"Real Project",level:"advanced",q:"Integration Broker message failing. How to diagnose?",a:"IB Monitor → Asynchronous Services → Failed. Read error message and stack trace. Common causes: target system down, incorrect URL in Node configuration, message format mismatch, authentication failure. Fix root cause, then retry from Monitor."},
  {cat:"Real Project",level:"advanced",q:"User reports data they entered yesterday is gone.",a:"Check audit tables if auditing enabled. Check Component Interface error log if data was loaded by batch. Check if another batch process overwrote the data. Verify user saved — did they click Save or just navigate away? Check if scheduled job ran that resets data."},
  {cat:"Real Project",level:"advanced",q:"How do you move configuration data from DEV to PROD?",a:"Data Mover (DMS) for setup/reference tables. App Designer project for object definitions. Change Assistant for PUM patches. For transaction data migrations — Component Interface via AE. Never use direct SQL in PROD for business data."},
  {cat:"Real Project",level:"advanced",q:"Payroll batch runs but produces zero results.",a:"'No rows selected' = Run Control parameters are wrong. Check: Pay Period End Date is valid, Pay Group exists, Company is correct, Calendar ID matches, employees exist with that Pay Group. Verify Run Control values against the actual pay calendar."},
  {cat:"Real Project",level:"advanced",q:"How do you find which PeopleCode fires on a specific page?",a:"App Designer → open the component → right-click any field → View PeopleCode. Also use PeopleCode cross-reference: Find In → PeopleCode (Ctrl+F in App Designer). App Server SQL trace with PeopleCode trace shows every program that fires during a component session."},
  {cat:"Real Project",level:"advanced",q:"User says their PS Query returns different results than a developer's identical query.",a:"Row-level security difference. The user's Query Access Tree or Row Security Permission List restricts which departments/BUs they can see. Developer with ALLPAGES or broader access sees everything. Check user's Permission Lists and Query Access Tree configuration."},
  {cat:"Real Project",level:"advanced",q:"How do you determine which database table a PeopleSoft page stores data in?",a:"Open component in App Designer → right-click page → click the record name → it shows the record definition. The physical table = PS_RECORDNAME. Also: navigate to the page, press F1 for field help which shows record.field. Or use SQL trace to see which tables are accessed."},
  {cat:"Real Project",level:"advanced",q:"System is slow for all users during month-end. How to diagnose?",a:"Check App Server domain status in PSADMIN — number of active PSAPPSRV processes, queue depth. Check DB for long-running SQL (v$session on Oracle). Check if month-end batch jobs are running simultaneously with online users. Consider running batch in off-hours or adding App Server capacity."},
  {cat:"Real Project",level:"advanced",q:"How do you test a PeopleCode change without impacting other developers?",a:"Use a separate sandbox database. Or if sharing, create a copy of the component with a custom prefix (ZZ_) and test there. Never modify shared development objects without checking the impact on other developers' work. Use App Designer's Compare feature before migrating."},
  {cat:"Real Project",level:"advanced",q:"A delivered component needs a new field that persists to DB. What is the correct approach?",a:"Create extension record ZZ_COMPNAME_EXT with same primary keys as delivered record + your custom fields. Add the extension record to the component alongside the delivered record. Add page fields bound to the extension record. Custom PeopleCode writes to extension record on save."},
  {cat:"Real Project",level:"advanced",q:"How do you handle an emergency data fix in production?",a:"Last resort only: Data Mover script for simple updates, reviewed by at least two people, run during maintenance window, with DB backup first. For transactional data (PS_JOB, benefits) — always use Component Interface to ensure business rules and audit trail. Document all changes in a change ticket."},
];

// Add 200Q shuffle support: show 50 random at a time
let INTERVIEW_QA = shuffleAndSliceIQA(50);

function shuffleAndSliceIQA(count) {
  const arr = [...INTERVIEW_QA_ALL];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

function refreshIQA() {
  INTERVIEW_QA = shuffleAndSliceIQA(50);
  iqaState.reviewed = new Set();
  iqaState.bookmarked = new Set();
  iqaState.level = 'all';
  iqaState.cat = 'all';
  iqaState.search = '';
  buildIQACatSidebar();
  renderIQA();
  document.getElementById('iqaSearchBar').value = '';
  document.querySelectorAll('.iqa-pro-filter').forEach(b => b.classList.remove('active'));
  document.querySelector('.iqa-pro-filter').classList.add('active');
}

/* ═══════════════════════════════════════════════
   PRO INTERVIEW ENGINE
═══════════════════════════════════════════════ */
let iqaState = { level:'all', cat:'all', search:'', reviewed:new Set(), bookmarked:new Set() };

function buildIQACatSidebar() {
  const cats = ['all',...new Set(INTERVIEW_QA.map(q=>q.cat))];
  const sidebar = document.getElementById('iqaCatSidebar'); if(!sidebar) return;
  sidebar.innerHTML = cats.map(cat => {
    const count = cat==='all' ? INTERVIEW_QA.length : INTERVIEW_QA.filter(q=>q.cat===cat).length;
    return `<button class="iqa-cat-btn ${cat===iqaState.cat?'active':''}" onclick="setIQACat('${cat.replace(/'/g,"\\'")}',this)"><span>${cat==='all'?'All Categories':cat}</span><span class="iqa-cat-count">${count}</span></button>`;
  }).join('');
}
function setIQACat(cat,btn){ iqaState.cat=cat; document.querySelectorAll('.iqa-cat-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderIQA(); }
function setIQALevel(level,btn){ iqaState.level=level; document.querySelectorAll('.iqa-pro-filter').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderIQA(); }
function filterIQA(){ iqaState.search=document.getElementById('iqaSearchBar').value.toLowerCase(); renderIQA(); }

function renderIQA() {
  let qs=INTERVIEW_QA;
  if(iqaState.level!=='all') qs=qs.filter(q=>q.level===iqaState.level);
  if(iqaState.cat!=='all') qs=qs.filter(q=>q.cat===iqaState.cat);
  if(iqaState.search) qs=qs.filter(q=>q.q.toLowerCase().includes(iqaState.search)||q.a.toLowerCase().includes(iqaState.search)||q.cat.toLowerCase().includes(iqaState.search));
  const lTag={beginner:'🌱 Beginner',intermediate:'⚡ Intermediate',advanced:'🔥 Advanced',scenario:'🏢 Real Project'};
  const lCls={beginner:'tag-level-b',intermediate:'tag-level-i',advanced:'tag-level-a',scenario:'tag-level-s'};
  const nCls={beginner:'num-beginner',intermediate:'num-intermediate',advanced:'num-advanced',scenario:'num-scenario'};
  const pt=document.getElementById('iqaPanelTitle'); if(pt) pt.textContent=iqaState.cat==='all'?'All Questions':iqaState.cat;
  const pc=document.getElementById('iqaPanelCount'); if(pc) pc.textContent=`${qs.length} question${qs.length!==1?'s':''}`;
  const content=document.getElementById('iqaContent'); if(!content) return;
  if(!qs.length){content.innerHTML='<div style="padding:40px;text-align:center;color:var(--faint)">No questions match your filters.</div>';return;}
  content.innerHTML=qs.map(q=>{
    const gi=INTERVIEW_QA.indexOf(q);
    const rev=iqaState.reviewed.has(gi), bkm=iqaState.bookmarked.has(gi);
    const hl=iqaState.search?q.q.replace(new RegExp(`(${iqaState.search})`,'gi'),'<mark style="background:rgba(240,165,0,.25);color:var(--gold)">$1</mark>'):q.q;
    return `<div class="iqa-card" id="iqa-card-${gi}"><button class="iqa-card-header" onclick="toggleIQACard(${gi})" aria-expanded="false"><div class="iqa-card-num ${nCls[q.level]||'num-beginner'}">${gi+1}</div><div class="iqa-card-meta"><div class="iqa-card-q">${hl}</div><div class="iqa-card-tags"><span class="iqa-tag ${lCls[q.level]||'tag-level-b'}">${lTag[q.level]||q.level}</span><span class="iqa-tag tag-cat">${q.cat}</span>${bkm?'<span class="iqa-tag" style="background:rgba(240,165,0,.1);color:var(--gold)">🔖 Saved</span>':''}${rev?'<span class="iqa-tag" style="background:rgba(34,197,94,.08);color:var(--green)">✓ Reviewed</span>':''}</div></div><span class="iqa-card-chevron">›</span></button><div class="iqa-card-body" id="iqa-body-${gi}"><div class="iqa-answer-label">✅ Expert Answer</div><div class="iqa-answer-text">${q.a.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code style="background:var(--s3);color:var(--cyan);padding:1px 6px;border-radius:4px;font-size:.9em;font-family:var(--fm)">$1</code>')}</div><div class="iqa-answer-actions"><button class="iqa-copy-btn" onclick="copyIQAAnswer(${gi},this)">📋 Copy Answer</button><button class="iqa-bookmark-btn ${bkm?'bookmarked':''}" onclick="toggleIQABookmark(${gi},this)">${bkm?'🔖 Saved':'🔖 Save'}</button><span class="iqa-progress-note">${rev?'✓ Reviewed':''}</span></div></div></div>`;
  }).join('');
  updateIQAProgress();
}
function toggleIQACard(idx){ const c=document.getElementById(`iqa-card-${idx}`); if(!c) return; const o=c.classList.contains('open'); c.classList.toggle('open',!o); c.querySelector('.iqa-card-header').setAttribute('aria-expanded',!o); if(!o){iqaState.reviewed.add(idx);updateIQAProgress();} }
function copyIQAAnswer(idx,btn){ navigator.clipboard.writeText(INTERVIEW_QA[idx].a).then(()=>{btn.classList.add('copied');btn.textContent='✅ Copied!';setTimeout(()=>{btn.classList.remove('copied');btn.textContent='📋 Copy Answer';},2000);}); }
function toggleIQABookmark(idx,btn){ if(iqaState.bookmarked.has(idx)){iqaState.bookmarked.delete(idx);btn.classList.remove('bookmarked');btn.textContent='🔖 Save';}else{iqaState.bookmarked.add(idx);btn.classList.add('bookmarked');btn.textContent='🔖 Saved';} }
function updateIQAProgress(){ const t=INTERVIEW_QA.length,r=iqaState.reviewed.size; const f=document.getElementById('iqaProgressFill'),l=document.getElementById('iqaProgressLabel'),c=document.getElementById('iqaReviewedCount'); if(f)f.style.width=(r/t*100)+'%'; if(l)l.textContent=`${r} / ${t} reviewed`; if(c)c.textContent=r; }

/* ── LAB ENGINE ── */
function backToLab(){ document.getElementById('labHome').style.display='block'; ['labDebug','labEventFlow','labMatcher','labScenario','labAppDesigner','labPSSim'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';}); window.scrollTo(0,0); }
function openLabMode(mode){ document.getElementById('labHome').style.display='none'; const map={debug:'labDebug',eventflow:'labEventFlow',matcher:'labMatcher',scenario:'labScenario',appdesigner:'labAppDesigner',pssim:'labPSSim'}; const el=document.getElementById(map[mode]); if(el){el.style.display='block';window.scrollTo(0,0);} if(mode==='debug')initDebug(); if(mode==='eventflow')initEventFlow(); if(mode==='matcher')initMatcher(); if(mode==='scenario')initScenario(); if(mode==='appdesigner')initAppDesigner(); if(mode==='pssim')initPSSim(); }

const DEBUG_CHALLENGES=[
  {title:"Performance — Page loads in 30 seconds",
   desc:"HR component takes 30+ seconds to load. Identify the problematic line.",
   code:[{n:1,t:"/* PostBuild — Initialize */"},{n:2,t:"Function Init()"},{n:3,t:"  Local Rowset &rs;"},{n:4,t:"  &rs = GetRowset(Scroll.JOB);"},{n:5,t:"  For &i = 1 To &rs.ActiveRowCount"},{n:6,t:"    Local Record &rec = &rs.GetRow(&i).GetRecord(Record.JOB);"},{n:7,t:"    SQLExec('SELECT DESCR FROM PS_DEPT_TBL WHERE DEPTID=:1', &rec.DEPTID.Value, &dn);"},{n:8,t:"    &rec.DEPTID_DESCR.Value = &dn;"},{n:9,t:"  End-For;"},{n:10,t:"End-Function;"}],
   bugLine:7,hint:"How many times does this SQL run for 200 rows?",
   explanation:"Line 7 — SQLExec in a loop = N+1 queries. 200 rows = 200 DB calls. Fix: pre-fetch all department names in PostBuild using CreateSQL once into an object, then look up from memory in the loop. One DB call instead of 200."},
  {title:"Scope Bug — Variable Lost Between Events",
   desc:"Flag set in PostBuild not accessible in SaveEdit. Find the scope error.",
   code:[{n:1,t:"/* PostBuild */"},{n:2,t:"Local Boolean &isNew;"},{n:3,t:"If JOB.ACTION.Value = 'HIR' Then"},{n:4,t:"   &isNew = True;"},{n:5,t:"End-If;"},{n:6,t:""},{n:7,t:"/* SaveEdit — checks the flag */"},{n:8,t:"If &isNew Then"},{n:9,t:"   Error 'Dept required for new hire';"},{n:10,t:"End-If;"}],
   bugLine:2,hint:"Local variables only exist for ONE program execution. PostBuild and SaveEdit are separate...",
   explanation:"Line 2 — Local scope means &isNew only exists during PostBuild execution. SaveEdit is a completely separate execution — the variable is gone and empty. Fix: declare as Component Boolean &isNew so it persists across all events in the same transaction."},
  {title:"Missing Effective Dating in SQL",
   desc:"Query returns wrong/multiple rows for one employee. Find the SQL bug.",
   code:[{n:1,t:"Local string &dept;"},{n:2,t:"SQLExec('SELECT DEPTID FROM PS_JOB WHERE EMPLID=:1',"},{n:3,t:"  PERSONAL_DATA.EMPLID.Value, &dept);"},{n:4,t:"JOB.DEPTID.Value = &dept;"}],
   bugLine:2,hint:"How many rows does PS_JOB have per employee? Which one is current?",
   explanation:"Line 2 — no effective dating WHERE clause. PS_JOB has 20+ rows per employee across their career. Without MAX(EFFDT) <= today and MAX(EFFSEQ), SQLExec returns the first row found — possibly from years ago. Add the full effective dating subquery."},
  {title:"Wrong Event for Field Default",
   desc:"Developer wants to default DEPTID when component opens. Field keeps clearing. Wrong event.",
   code:[{n:1,t:"/* FieldChange on BUSINESS_UNIT */"},{n:2,t:"If JOB.DEPTID.Value = '' Then"},{n:3,t:"   JOB.DEPTID.Value = 'CORP';"},{n:4,t:"End-If;"}],
   bugLine:1,hint:"FieldChange fires when a USER changes the field. When should a default be set on load?",
   explanation:"Line 1 — wrong event. FieldChange fires only when the user actively changes BUSINESS_UNIT. For component-load defaulting use FieldDefault (fires before user sees the field) or PostBuild (fires once after all rows load). FieldDefault is the canonical event for defaults."},
  {title:"SavePostChange Misuse",
   desc:"Error() in SavePostChange does nothing. Data already saved. Identify the wrong event.",
   code:[{n:1,t:"/* SavePostChange */"},{n:2,t:"If JOB.ANNUAL_RT.Value > 500000 Then"},{n:3,t:"   Error 'Salary exceeds maximum. Save cancelled.';"},{n:4,t:"End-If;"}],
   bugLine:1,hint:"Can you cancel a save AFTER the database commit has already happened?",
   explanation:"Line 1 — wrong event. SavePostChange fires AFTER the DB commit is complete. Error() here is silently ignored — data is already saved. Move the validation to SaveEdit which fires BEFORE the commit and where Error() actually stops the save."},
];

let debugState={idx:0,selected:null,score:0};
function initDebug(){debugState={idx:0,selected:null,score:0};renderDebugChallenge();}
function renderDebugChallenge(){
  const ch=DEBUG_CHALLENGES[debugState.idx]; debugState.selected=null;
  document.getElementById('debugCounter').textContent=`Challenge ${debugState.idx+1} of ${DEBUG_CHALLENGES.length}`;
  document.getElementById('debugScore').textContent=`Score: ${debugState.score}`;
  document.getElementById('debugScenario').innerHTML=`<div class="matcher-scenario__label">🏢 Scenario</div><div class="matcher-scenario__text">${ch.desc}</div>`;
  document.getElementById('debugCode').innerHTML=ch.code.map(l=>`<div class="lab-code-line" id="dline-${l.n}" onclick="selectDebugLine(${l.n})"><span class="lab-code-linenum">${l.n}</span><span class="lab-code-text">${l.t.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span></div>`).join('');
  document.getElementById('debugHint').textContent=ch.hint;
  document.getElementById('debugCheckBtn').disabled=true;
  document.getElementById('debugCheckBtn').style.display='block';
  document.getElementById('debugNextBtn').style.display='none';
  const res=document.getElementById('debugResult');
  res.classList.remove('show','correct','wrong'); res.innerHTML='';
}
function selectDebugLine(n){document.querySelectorAll('.lab-code-line').forEach(l=>l.classList.remove('selected'));document.getElementById(`dline-${n}`).classList.add('selected');debugState.selected=n;document.getElementById('debugCheckBtn').disabled=false;}
function checkDebugAnswer(){
  const ch=DEBUG_CHALLENGES[debugState.idx];
  const correct=debugState.selected===ch.bugLine; if(correct)debugState.score++;
  document.getElementById('debugScore').textContent=`Score: ${debugState.score}`;
  document.querySelectorAll('.lab-code-line').forEach(l=>l.style.pointerEvents='none');
  document.getElementById(`dline-${ch.bugLine}`).classList.add('correct-line');
  if(!correct&&debugState.selected) document.getElementById(`dline-${debugState.selected}`).classList.add('selected');
  const res=document.getElementById('debugResult');
  res.className=`lab-result-box show ${correct?'correct':'wrong'}`;
  res.innerHTML=`<div class="lab-result-box__title">${correct?'✅ Correct!':'❌ Not quite'}</div><div class="lab-result-box__text"><strong>Bug on line ${ch.bugLine}:</strong> ${ch.explanation}</div>`;
  document.getElementById('debugCheckBtn').style.display='none';
  if(debugState.idx<DEBUG_CHALLENGES.length-1)document.getElementById('debugNextBtn').style.display='block';
  else res.innerHTML+=`<br><strong style="color:var(--gold)">Complete! Score: ${debugState.score}/${DEBUG_CHALLENGES.length}</strong>`;
}
function nextDebugChallenge(){debugState.idx++;renderDebugChallenge();}

const EF_CHALLENGES=[{name:"Component Load Sequence",events:[{name:"SearchInit",phase:"load",correct:0},{name:"RowSelect",phase:"load",correct:1},{name:"RowInit",phase:"load",correct:2},{name:"FieldDefault",phase:"load",correct:3},{name:"FieldFormula",phase:"load",correct:4},{name:"PostBuild",phase:"load",correct:5},{name:"Activate",phase:"load",correct:6}]},{name:"Save Sequence",events:[{name:"SaveEdit",phase:"save",correct:0},{name:"SavePreChange",phase:"save",correct:1},{name:"WorkFlow",phase:"save",correct:2},{name:"SavePostChange",phase:"save",correct:3}]},{name:"Field Interaction",events:[{name:"FieldEdit",phase:"interact",correct:0},{name:"FieldChange",phase:"interact",correct:1}]},];
let efState={idx:0,items:[]};
function initEventFlow(){efState.idx=0;loadEFChallenge();}
function loadEFChallenge(){const ch=EF_CHALLENGES[efState.idx];document.getElementById('efChallengeName').textContent=ch.name;efState.items=[...ch.events].sort(()=>Math.random()-.5);renderEFList();const res=document.getElementById('efResult');res.classList.remove('show','correct','wrong');res.innerHTML='';document.getElementById('efNextBtn').style.display='none';}
function renderEFList(){const pC={load:'phase-load',interact:'phase-interact',save:'phase-save'},pL={load:'Load',interact:'User Action',save:'Save'};document.getElementById('eventDragList').innerHTML=efState.items.map((ev,i)=>`<div class="event-drag-item" draggable="true" ondragstart="efDragStart(event,${i})" ondragover="efDragOver(event)" ondrop="efDrop(event,${i})"><span class="event-drag-handle">⠿</span><span class="event-drag-num">${i+1}</span><span style="flex:1;font-family:var(--fm);font-weight:600">${ev.name}</span><span class="event-phase-badge ${pC[ev.phase]}">${pL[ev.phase]}</span></div>`).join('');}
let efDragging=null;
function efDragStart(e,i){efDragging=i;}
function efDragOver(e){e.preventDefault();}
function efDrop(e,i){e.preventDefault();if(efDragging===null||efDragging===i)return;const items=[...efState.items];const[m]=items.splice(efDragging,1);items.splice(i,0,m);efState.items=items;efDragging=null;renderEFList();}
function checkEventOrder(){const ch=EF_CHALLENGES[efState.idx];const ok=efState.items.every((ev,i)=>ev.correct===i);document.querySelectorAll('.event-drag-item').forEach((el,i)=>{el.classList.add(efState.items[i].correct===i?'correct-pos':'wrong-pos');el.setAttribute('draggable','false');el.style.cursor='default';});const co=[...ch.events].sort((a,b)=>a.correct-b.correct).map(e=>e.name).join(' → ');const res=document.getElementById('efResult');res.className=`lab-result-box show ${ok?'correct':'wrong'}`;res.innerHTML=`<div class="lab-result-box__title">${ok?'✅ Perfect!':'❌ Not quite'}</div><div class="lab-result-box__text">Correct order: <strong>${co}</strong></div>`;if(efState.idx<EF_CHALLENGES.length-1)document.getElementById('efNextBtn').style.display='block';}
function resetEventOrder(){loadEFChallenge();}
function nextEFChallenge(){efState.idx++;loadEFChallenge();}

const MATCHER_CHALLENGES=[{q:"Store temporary flag during component session — never saved to DB",ans:"Derived/Work Record",opts:["SQL Table","SQL View","Derived/Work Record","Temp Table"],exp:"Derived/Work records exist only in buffer. No DB object. Perfect for temporary flags."},{q:"Run overnight salary recalculation for 500,000 employees",ans:"Application Engine",opts:["Component Interface","Application Engine","SQR","PS Query"],exp:"AE is the batch framework for large-scale operations outside the online session."},{q:"Load employee hire data using PeopleSoft business rules",ans:"Component Interface",opts:["Data Mover","SQL Insert","Component Interface","Application Engine"],exp:"CI fires all component PeopleCode events ensuring full data integrity."},{q:"Display department name without saving it",ans:"SQL View",opts:["SQL Table","SQL View","Derived/Work Record","Dynamic View"],exp:"SQL View creates read-only DB view joining records. Use for display without DB write."},{q:"Short code list: A=Active, T=Terminated (max 4 chars)",ans:"Translate Value (XLAT)",opts:["Prompt Table","Translate Value (XLAT)","Dynamic View","Record Field"],exp:"XLAT values in PSXLATITEM handle short stable codes of max 4 characters."},{q:"Send real-time employee data to external system via REST",ans:"Integration Broker",opts:["AE","Data Mover","Integration Broker","Component Interface"],exp:"Integration Broker handles real-time sync/async messaging via REST, SOAP, internal PS."},{q:"EFFDT and EFFSEQ fields reused in 200 records",ans:"SubRecord",opts:["SQL Table","SubRecord","Dynamic View","Derived/Work"],exp:"SubRecords are reusable field groups. EFFDT_SBR included in hundreds of records."},{q:"Move setup data from DEV to PROD",ans:"Data Mover (DMS)",opts:["AE","Data Mover (DMS)","Component Interface","SQL Script"],exp:"DMS EXPORT/IMPORT moves PS table data between databases. Ideal for reference data."},{q:"Allow parallel batch without data collision",ans:"Temp Table",opts:["SQL Table","SQL View","Temp Table","Derived/Work"],exp:"Temp Tables create multiple instances (AET, AET1...) — each parallel AE gets its own."},{q:"Attach custom code to delivered component without modifying it",ans:"Event Mapping",opts:["SubRecord","Event Mapping","Application Package","Component Interface"],exp:"Event Mapping (PT 8.55+) attaches App Class PeopleCode to delivered events — upgrade-safe."},];
let matcherState={idx:0,score:0,answered:false};
function initMatcher(){matcherState={idx:0,score:0,answered:false};renderMatcher();}
function renderMatcher(){const ch=MATCHER_CHALLENGES[matcherState.idx];matcherState.answered=false;document.getElementById('matcherCounter').textContent=`Scenario ${matcherState.idx+1} of ${MATCHER_CHALLENGES.length}`;document.getElementById('matcherScore').textContent=`Score: ${matcherState.score}/${matcherState.idx}`;document.getElementById('matcherScenario').textContent=ch.q;document.getElementById('matcherOptions').innerHTML=ch.opts.map(o=>`<button class="matcher-opt" onclick="checkMatcher(this)">${o}</button>`).join('');const res=document.getElementById('matcherResult');res.classList.remove('show','correct','wrong');res.innerHTML='';document.getElementById('matcherNextBtn').style.display='none';}
function checkMatcher(btn){if(matcherState.answered)return;matcherState.answered=true;const ch=MATCHER_CHALLENGES[matcherState.idx];const ok=btn.textContent===ch.ans;if(ok)matcherState.score++;document.querySelectorAll('.matcher-opt').forEach(b=>{b.disabled=true;if(b.textContent===ch.ans)b.classList.add('correct');else if(b===btn)b.classList.add('wrong');else b.classList.add('reveal');});const res=document.getElementById('matcherResult');res.className=`lab-result-box show ${ok?'correct':'wrong'}`;res.innerHTML=`<div class="lab-result-box__title">${ok?'✅ Correct!':'❌ Wrong'}</div><div class="lab-result-box__text"><strong>${ch.ans}</strong> — ${ch.exp}</div>`;document.getElementById('matcherScore').textContent=`Score: ${matcherState.score}/${matcherState.idx+1}`;if(matcherState.idx<MATCHER_CHALLENGES.length-1)document.getElementById('matcherNextBtn').style.display='block';else res.innerHTML+=`<br><strong style="color:var(--gold)">Complete! ${matcherState.score}/${MATCHER_CHALLENGES.length}</strong>`;}
function nextMatcher(){matcherState.idx++;renderMatcher();}

const SCENARIO_CHALLENGES=[{q:"Page loads in 45 seconds. SQL trace: 500 identical SELECTs against PS_DEPT_TBL.",ans:"SQLExec in RowInit fires once per row",opts:["DB index missing","SQLExec in RowInit fires once per row","Too few App Server processes","WebLogic timeout"],exp:"Classic N+1. RowInit × 500 rows = 500 DB calls. Fix: pre-fetch in PostBuild with CreateSQL."},{q:"User can see component, but Save does nothing. No error message.",ans:"Permission List grants Display Only",opts:["No PeopleCode","Permission List grants Display Only","DB is read-only","App Server overloaded"],exp:"Display Only = read-only. Save button hidden/disabled. Change access mode to Update/Display."},{q:"Custom component shows all employees — even outside authorized departments.",ans:"PS_JOB as Search Record bypasses row-level security",opts:["Permission List too broad","PS_JOB as Search Record bypasses row-level security","Row security not configured","Too many pages"],exp:"PS_JOB bypasses security views. Replace with PS_JOB_SRCH_VW that joins with security tables."},{q:"Migrated component to QA. Doesn't appear in any menu.",ans:"Portal CREF not migrated",opts:["PeopleCode bug","Portal CREF not migrated","DB tables not built","Permission List missing"],exp:"App Designer objects and Portal CREFs migrate separately. CREF must be explicitly included."},{q:"Payroll batch: Error status. Log says 'No rows selected for processing'.",ans:"Run Control parameters incorrect",opts:["App Server down","Run Control parameters incorrect","PS_JOB corrupted","Wrong user"],exp:"'No rows' = criteria found nothing. Check Pay Period, Pay Group, Company, Calendar ID."},{q:"After upgrade, customization is gone.",ans:"Oracle overwrote the delivered object",opts:["DB restore failed","Oracle overwrote the delivered object","Developer deleted it","Permission List reset"],exp:"Delivered objects overwritten during upgrades. Use Event Mapping (PT 8.55+) or clone with custom prefix."},{q:"PS Query joining PS_PERSONAL_DATA + PS_JOB returns 15x expected rows.",ans:"Missing effective dating on PS_JOB",opts:["Wrong join key","Missing effective dating on PS_JOB","PERSONAL_DATA has duplicates","Wrong database"],exp:"PS_JOB has 15+ rows per employee. Without MAX(EFFDT): 1 × 15 = 15 per employee. Add effective dating."},{q:"Employee report shows wrong department for last January.",ans:"Report missing effective dating — shows today not January",opts:["Data deleted","Report missing effective dating — shows today not January","Batch not run","Security issue"],exp:"Report fetches current row. For historical: WHERE EFFDT <= report_date in the query."},];
let scenState={idx:0,score:0,answered:false};
function initScenario(){scenState={idx:0,score:0,answered:false};renderScenario();}
function renderScenario(){const ch=SCENARIO_CHALLENGES[scenState.idx];scenState.answered=false;document.getElementById('scenarioCounter').textContent=`Scenario ${scenState.idx+1} of ${SCENARIO_CHALLENGES.length}`;document.getElementById('scenarioScore').textContent=`Score: ${scenState.score}/${scenState.idx}`;document.getElementById('scenarioText').textContent=ch.q;document.getElementById('scenarioOptions').innerHTML=ch.opts.map(o=>`<button class="matcher-opt" onclick="checkScenario(this)">${o}</button>`).join('');const res=document.getElementById('scenarioResult');res.classList.remove('show','correct','wrong');res.innerHTML='';document.getElementById('scenarioNextBtn').style.display='none';}
function checkScenario(btn){if(scenState.answered)return;scenState.answered=true;const ch=SCENARIO_CHALLENGES[scenState.idx];const ok=btn.textContent===ch.ans;if(ok)scenState.score++;document.querySelectorAll('#scenarioOptions .matcher-opt').forEach(b=>{b.disabled=true;if(b.textContent===ch.ans)b.classList.add('correct');else if(b===btn)b.classList.add('wrong');else b.classList.add('reveal');});const res=document.getElementById('scenarioResult');res.className=`lab-result-box show ${ok?'correct':'wrong'}`;res.innerHTML=`<div class="lab-result-box__title">${ok?'✅ Correct!':'❌ Not quite'}</div><div class="lab-result-box__text"><strong>${ch.ans}</strong><br>${ch.exp}</div>`;document.getElementById('scenarioScore').textContent=`Score: ${scenState.score}/${scenState.idx+1}`;if(scenState.idx<SCENARIO_CHALLENGES.length-1)document.getElementById('scenarioNextBtn').style.display='block';else res.innerHTML+=`<br><strong style="color:var(--gold)">Complete! ${scenState.score}/${SCENARIO_CHALLENGES.length}</strong>`;}
function nextScenario(){scenState.idx++;renderScenario();}

const ADS_TASKS=[{id:'add_emplid',label:'Add EMPLID (CHAR 11, Key)'},{id:'add_effdt',label:'Add EFFDT (DATE, Key)'},{id:'add_deptid',label:'Add DEPTID (CHAR 10)'},{id:'add_setid',label:'Add SETID (CHAR 5)'},{id:'build',label:'Click Build → Create Table'},];
let adsState={fields:[],tasksCompleted:new Set()};
function initAppDesigner(){adsState={fields:[],tasksCompleted:new Set()};document.getElementById('adsOutput').textContent='Ready.';renderADSFields();renderADSTasks();const r=document.getElementById('adsResult');r.classList.remove('show','correct','wrong');r.innerHTML='';}
function renderADSTasks(){document.getElementById('adsTaskList').innerHTML=ADS_TASKS.map(t=>`<div class="ads-task ${adsState.tasksCompleted.has(t.id)?'done':''}" id="ads-task-${t.id}"><div class="ads-task-check">${adsState.tasksCompleted.has(t.id)?'✓':''}</div>${t.label}</div>`).join('');}
function renderADSFields(){document.getElementById('adsFieldBody').innerHTML=adsState.fields.length===0?`<tr><td colspan="6" style="text-align:center;color:#888;padding:16px">No fields. Add from properties panel →</td></tr>`:adsState.fields.map((f,i)=>`<tr ${i===adsState.fields.length-1?'class="selected"':''}><td>${i+1}</td><td><strong>${f.name}</strong></td><td>${f.type}</td><td>${f.len||''}</td><td>${f.key?'<span style="color:#1f5a9a;font-size:16px">☑</span>':''}</td><td></td></tr>`).join('');}
function adsAddField(){const sel=document.getElementById('adsAddFieldSelect');const val=sel.value;if(!val)return;const[name,type,len]=val.split('|');if(adsState.fields.find(f=>f.name===name)){document.getElementById('adsOutput').textContent=`${name} already exists.`;return;}adsState.fields.push({name,type,len,key:name==='EMPLID'||name==='EFFDT'});renderADSFields();document.getElementById('adsOutput').textContent=`${name} added.`;const m={EMPLID:'add_emplid',EFFDT:'add_effdt',DEPTID:'add_deptid',SETID:'add_setid'};if(m[name]){adsState.tasksCompleted.add(m[name]);renderADSTasks();}sel.value='';}
function adsBuild(){
  const req=['EMPLID','EFFDT','DEPTID','SETID'];
  const present=adsState.fields.map(f=>f.name);
  const missing=req.filter(f=>!present.includes(f));
  const o=document.getElementById('adsOutput');
  if(missing.length>0){o.textContent='Build failed. Missing fields: '+missing.join(', ');return;}
  const ddl=[
    'Starting Build...',
    'Generating CREATE TABLE DDL...',
    '',
    'CREATE TABLE PS_EMP_DEPT_DATA (',
    '  EMPLID  CHAR(11) NOT NULL,',
    '  EFFDT   DATE     NOT NULL,',
    '  DEPTID  CHAR(10) NOT NULL,',
    '  SETID   CHAR(5)  NOT NULL',
    ')',
    '',
    'CREATE UNIQUE INDEX PS_EMP_DEPT_DATA',
    '  ON PS_EMP_DEPT_DATA (EMPLID, EFFDT)',
    '',
    'SQL build succeeded.',
    '1 record processed: 0 errors, 0 warnings',
    'SQL written to C:\\TEMP\\PPSBUILD.SQL',
  ];
  o.textContent=ddl.join('\n');
  adsState.tasksCompleted.add('build');
  renderADSTasks();
  if(adsState.tasksCompleted.size===ADS_TASKS.length){
    const r=document.getElementById('adsResult');
    r.className='lab-result-box show correct';
    r.innerHTML='<div class="lab-result-box__title">✅ Record Built Successfully!</div><div class="lab-result-box__text">You created <strong>PS_EMP_DEPT_DATA</strong> with all required fields and built the physical database table — just like real Application Designer development.</div>';
  }
}

function psSignIn(){const u=document.getElementById('psUserId').value.trim(),p=document.getElementById('psPassword').value;document.getElementById('psLoginError').classList.remove('show');if(!u||!p){document.getElementById('psLoginError').textContent='Enter both User ID and Password.';document.getElementById('psLoginError').classList.add('show');return;}document.getElementById('psLoggedUser').textContent=`Logged in as: ${u.toUpperCase()}`;buildPSHome();showPSScreen('psHomeScreen');}
function psSignOut(){showPSScreen('psLoginScreen');}
function showPSScreen(id){
  document.querySelectorAll('.ps-sim-screen').forEach(s=>s.classList.remove('active'));
  const t=document.getElementById(id);if(t)t.classList.add('active');
}
function psGoHome(){showPSScreen('psHomeScreen');buildPSHome();}
function buildPSHome(){document.getElementById('psTilesGrid').innerHTML=PS_TILES.map(t=>t.type==='chart'?`<div class="ps-tile chart-tile" onclick="psOpenComponent('${t.title}')"><div class="ps-tile__chart-title">${t.title}</div><div style="display:flex;align-items:flex-end;gap:4px;height:60px;margin-bottom:6px">${[40,65,50,80,55,90,75].map(h=>`<div style="width:12px;background:#1e4d8c;height:${h}%;border-radius:2px 2px 0 0;opacity:.7"></div>`).join('')}</div><div style="font-size:10px;color:#888">${t.subtitle}</div></div>`:`<div class="ps-tile" onclick="psOpenComponent('${t.title}')"><div class="ps-tile__icon">${t.icon}</div><div class="ps-tile__title">${t.title}</div><div class="ps-tile__subtitle">${t.subtitle}</div></div>`).join('');document.getElementById('psQuickLinks').innerHTML=[{i:'📋',l:'View PeopleSoft'},{i:'✅',l:'Asset Allowances'},{i:'🔍',l:'Run a Query'},{i:'📄',l:'Your Docs'}].map(q=>`<div class="ps-quicklink" onclick="alert('${q.l}')"><span>${q.i}</span>${q.l}</div>`).join('');buildPSNav('');document.getElementById('psNavBar').style.display='flex';}
function psToggleNav(){const n=document.getElementById('psNavBar');n.style.display=n.style.display==='none'?'flex':'none';}
function buildPSNav(f){document.getElementById('psNavItems').innerHTML=PS_NAV.filter(item=>!f||item.label.toLowerCase().includes(f)||item.subs.some(s=>s.toLowerCase().includes(f))).map((item,i)=>`<div class="ps-navbar-section"><div class="ps-navbar-item" onclick="psToggleNavItem(${i})"><span class="ps-navbar-item-icon">${item.icon}</span>${item.label}${item.subs.length?'<span style="margin-left:auto;color:#aaa;font-size:12px">›</span>':''}</div>${item.subs.length?`<div class="ps-navbar-sub" id="psnav-sub-${i}">${item.subs.map(s=>`<div class="ps-navbar-sub-item" onclick="psOpenComponent('${s}')"><span class="ps-sub-icon">📄</span>${s}</div>`).join('')}</div>`:''}</div>`).join('');}
function psNavSearch(v){buildPSNav(v.toLowerCase());}
function psToggleNavItem(i){const s=document.getElementById(`psnav-sub-${i}`);if(s)s.classList.toggle('open');}
function psOpenComponent(name){const c=PS_COMPS[name];showPSScreen('psComponentScreen');const el=document.getElementById('psComponentContent');if(!c){el.innerHTML=`<p style="font-family:'Segoe UI';font-size:13px;color:#888"><button onclick="psGoHome()" style="background:none;border:none;color:#1e4d8c;cursor:pointer;font-family:'Segoe UI'">🏠 Home</button></p><div style="background:#fff;border:1px solid #ddd;border-radius:6px;padding:24px;text-align:center;color:#888;font-family:'Segoe UI'">🚧 Not in simulator yet.<br><br><button onclick="psGoHome()" style="background:#1e4d8c;color:#fff;border:none;padding:8px 20px;border-radius:4px;cursor:pointer">← Home</button></div>`;return;}el.innerHTML=`<p style="font-family:'Segoe UI';font-size:12px;color:#888;margin-bottom:4px"><button onclick="psGoHome()" style="background:none;border:none;color:#1e4d8c;cursor:pointer;font-size:12px;font-family:'Segoe UI'">🏠</button> › ${c.sub}</p><div style="background:#fff;border:1px solid #ddd;border-radius:6px;overflow:hidden"><div style="background:linear-gradient(180deg,#1e4d8c,#163f75);padding:12px 16px;display:flex;align-items:center;justify-content:space-between"><div style="color:#fff;font-family:'Segoe UI';font-size:14px;font-weight:600">${c.title}</div><div style="display:flex;gap:8px"><button style="background:rgba(255,255,255,.2);color:#fff;border:none;padding:5px 14px;font-size:12px;cursor:pointer;border-radius:3px;font-family:'Segoe UI'">💾 Save</button><button onclick="psGoHome()" style="background:rgba(255,255,255,.1);color:#fff;border:none;padding:5px 14px;font-size:12px;cursor:pointer;border-radius:3px;font-family:'Segoe UI'">✕</button></div></div><div style="padding:20px"><table style="width:100%;border-collapse:collapse;font-family:'Segoe UI';font-size:13px">${c.fields.map(f=>`<tr><td style="padding:8px 16px 8px 0;color:#555;font-weight:600;width:160px">${f.l}</td><td><input type="text" value="${f.v}" style="border:1px solid #ccc;padding:6px 10px;border-radius:3px;font-size:13px;font-family:'Segoe UI';color:#222;min-width:200px"/></td></tr>`).join('')}</table></div></div>`;}


/* ═══════════════════════════════════════════════
   TOPIC DATA — 20 BEGINNER TOPICS
═══════════════════════════════════════════════ */
// ── All data loaded from pslearn-data.js ──



/* ═══════════════════════════════════════════════
   QUIZ ENGINE — 100 QUESTION BANK
═══════════════════════════════════════════════ */
// QUIZ_BANK in pslearn-data.js

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
  switchView('quizView');
  setNavActive('Quiz');
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
// CURRICULUM_LIST in pslearn-data.js

/* visited + currentTopicIndex moved to top */

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
      if (!lc.includes(q)) return;

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
    if (currentTopicIndex < (currentIsIntermediate ? INTERMEDIATE_TOPICS : TOPICS).length - 1) openTopic(currentTopicIndex + 1, currentIsIntermediate);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (currentTopicIndex > 0) openTopic(currentTopicIndex - 1, currentIsIntermediate);
  }
});


/* ═══════════════════════════════════════════════
   VIEW MANAGEMENT
═══════════════════════════════════════════════ */


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
function renderTopic(index, isIntermediate=false) {
  const topicList = isIntermediate ? INTERMEDIATE_TOPICS : TOPICS;
  const topic = topicList[index];
  const mod = isIntermediate ? {name:"Intermediate",icon:"⚡",color:"#8b5cf6"} : MODULES[topic.module];
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
              ${q.options.map((opt, oi) => {
                const correctIdx = q.answer !== undefined ? q.answer : q.ans;
                return `
                <button class="mini-quiz__opt" onclick="answerMiniQuiz(${index},${qi},${oi},${correctIdx})" id="mqo-${index}-${qi}-${oi}">
                  <span class="mini-quiz__letter">${String.fromCharCode(65+oi)}</span>
                  ${opt}
                </button>`;
              }).join('')}
            </div>
            <div class="mini-quiz__explanation" id="mqe-${index}-${qi}">💡 ${q.explanation}</div>
          </div>
        `).join('')}
      </div>`;
  }

  // ── MODULE SUMMARY CARD (Feature 11) ──
  // Show when this is the last topic in its module (beginner only)
  const isLastInModule = !isIntermediate && (
    index === TOPICS.length - 1 ||
    TOPICS[index + 1].module !== topic.module
  );
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
  const prev = index > 0 ? topicList[index - 1] : null;
  const next = index < topicList.length - 1 ? topicList[index + 1] : null;
  const isIntFlag = isIntermediate ? ', true' : '';

  html += `<div class="topic-nav">`;
  if (prev) {
    html += `
      <button class="topic-nav-btn" onclick="openTopic(${index-1}${isIntFlag})">
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
      <button class="topic-nav-btn topic-nav-btn--next" onclick="openTopic(${index+1}${isIntFlag})">
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
// GLOSSARY in pslearn-data.js

let currentGlossaryFilter = 'all';


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


/* ═══════════════════════════════════════════════
   INIT — runs after DOM is ready
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {

/* Build curriculum topic grids */
['b','i','a'].forEach(level => {
  const grid = document.getElementById('topics-'+level);
  if (!grid) return;
  CURRICULUM_LIST[level].forEach((topic, i) => {
    const div = document.createElement('div');
    div.className = 'topic-item';
    const isBeg = level === 'b';
    const isInt = level === 'i';
    div.innerHTML =
      '<span class="topic-item__num">'+String(i+1).padStart(2,'0')+'</span>'+
      '<span class="topic-item__dot dot--'+level+'"></span>'+
      '<span>'+topic+'</span>'+
      (isBeg||isInt ? '<span class="topic-item__arrow">›</span>' : '<span style="font-family:var(--fm);font-size:10px;color:var(--faint);margin-left:auto">Planned</span>');
    if (isBeg) div.onclick = () => openTopic(i, false);
    if (isInt) div.onclick = () => openTopic(i, true);
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
window.switchTab = switchTab; // expose globally

/* Marquee */
const allTopics = [...CURRICULUM_LIST.b, ...CURRICULUM_LIST.i, ...CURRICULUM_LIST.a];
const track = document.getElementById('marqueeTrack');
if (track) {
  [...allTopics, ...allTopics].forEach(t => {
    const span = document.createElement('span');
    span.className = 'marquee-item';
    span.innerHTML = `<span>✦</span>${t}`;
    track.appendChild(span);
  });
}

/* Scroll reveal */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* Nav scroll border */
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.style.borderBottomColor = window.scrollY > 60 ? 'rgba(45,55,96,.9)' : 'var(--border)';
  }, { passive: true });
}

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

/* Load saved progress on first visit */
loadProgress();
showResumeBanner();

}); // end DOMContentLoaded
