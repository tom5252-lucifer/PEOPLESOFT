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
  if(numEl) numEl.textContent = Topic ${lastSavedTopic+1} of ${topicList.length};
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
    const dp=Array.from({length:a.length+1},(,i)=>Array.from({length:b.length+1},(,j)=>i===0?j:j===0?i:0));
    for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++)
      dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
    return dp[a.length][b.length]<=Math.floor(query.length/4);
  });
}

/* ═══════════════════════════════════════════════
   VIEW FUNCTIONS
═══════════════════════════════════════════════ */
function showHome() { switchView('homepageView'); closeDrawer(); showResumeBanner(); }
function showApp()  { switchView('appView'); }
function showGlossary() { switchView('glossaryView'); renderGlossary('','all'); }
function showLab() { switchView('labView'); document.getElementById('labView').style.display='block'; backToLab(); }
function showInterview() { switchView('interviewView'); document.getElementById('interviewView').style.display='block'; buildIQACatSidebar(); renderIQA(); window.scrollTo(0,0); }

/* ═══════════════════════════════════════════════
   TOPIC NAVIGATION
═══════════════════════════════════════════════ */
function openTopic(index, isIntermediate) {
  currentTopicIndex = index;
  currentIsIntermediate = !!isIntermediate;
  const topicList = isIntermediate ? INTERMEDIATE_TOPICS : TOPICS;
  visited.add((isIntermediate?'i_':'b_')+index);
  lastSavedTopic = index; lastSavedIsIntermediate = !!isIntermediate;
  saveProgress(); showApp(); buildSidebar(isIntermediate); renderTopic(index, isIntermediate); updateProgress();
  const t = topicList[index];
  const te=document.getElementById('mobileTopicTitle'), ce=document.getElementById('mobileTopicCount');
  if(te) te.textContent=t.title;
  if(ce) ce.textContent=${String(index+1).padStart(2,'0')}/${topicList.length};
  const bc=document.getElementById('desktopTopicBreadcrumb');
  if(bc) bc.textContent=${isIntermediate?'Intermediate':'Beginner'} Topic ${index+1}/${topicList.length} — ${t.title};
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
      h.innerHTML=<span>${icon}</span><span style="color:${color}">${gLabel}</span>;
      body.appendChild(h); lastG=gLabel;
    }
    const isA=idx===currentTopicIndex&&isIntermediate===currentIsIntermediate;
    const vk=(isIntermediate?'i_':'b_')+idx;
    const btn=document.createElement('button');
    btn.className='sidebar__topic'+(isA?' active':'');
    btn.innerHTML=<span class="sidebar__topic-num">${topic.num}</span><span style="flex:1;text-align:left">${topic.title}</span>${visited.has(vk)&&!isA?'<span style="color:var(--green);font-size:11px">✓</span>':''};
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
  {cat:"PeopleCode",level:"intermediate",q:"How do you make a field read-only in PeopleCode?",a:"RECORD.FIELD.DisplayO
