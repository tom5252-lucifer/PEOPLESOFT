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
