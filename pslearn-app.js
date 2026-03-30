/* PSLearn PASS 1 App Logic */

let currentView = 'homepageView';
let currentTheme = localStorage.getItem('pslearn_theme') || 'dark';

const INTERMEDIATE_TOPICS = [
  {
    title:"Application Designer Deep Dive",
    desc:"Projects, build options, definitions, compare/copy, and object relationships."
  },
  {
    title:"Application Engine",
    desc:"Batch processing, sections, steps, actions, state records, and restartability."
  },
  {
    title:"Component Interface",
    desc:"Programmatic access to components for integrations and data loading."
  },
  {
    title:"SQR Programming",
    desc:"Legacy PeopleSoft reporting and batch logic with structured report output."
  },
  {
    title:"BI Publisher Reports",
    desc:"XMLP reports, templates, bursting, and formatted enterprise outputs."
  },
  {
    title:"Integration Broker",
    desc:"Nodes, messages, service operations, routings, handlers, and REST/SOAP."
  },
  {
    title:"Security & Roles",
    desc:"Permission lists, roles, user profiles, and row-level security basics."
  },
  {
    title:"Process Scheduler",
    desc:"Run controls, Process Monitor, statuses, distribution, and scheduler flow."
  },
  {
    title:"Data Mover & Migration",
    desc:"DMS scripts, environment moves, compare reports, and migration hygiene."
  },
  {
    title:"PeopleSoft Update Manager (PUM)",
    desc:"Selective adoption, images, change packages, and patch lifecycle."
  }
];

const LABS = [
  {
    name:"PeopleCode Debug Lab",
    difficulty:"Beginner",
    time:"10 min",
    skill:"Debugging",
    desc:"Find and understand common PeopleCode mistakes."
  },
  {
    name:"Event Flow Trainer",
    difficulty:"Beginner",
    time:"8 min",
    skill:"Event Flow",
    desc:"Understand the PeopleCode event lifecycle."
  },
  {
    name:"Object Matcher",
    difficulty:"Beginner",
    time:"6 min",
    skill:"PeopleTools Objects",
    desc:"Match the right object to the right scenario."
  },
  {
    name:"Scenario Diagnosis",
    difficulty:"Intermediate",
    time:"10 min",
    skill:"Production Thinking",
    desc:"Solve realistic PeopleSoft issue scenarios."
  },
  {
    name:"App Designer Sandbox",
    difficulty:"Intermediate",
    time:"15 min",
    skill:"Application Designer",
    desc:"Explore a simplified mock of PeopleSoft Application Designer."
  },
  {
    name:"PIA Playground",
    difficulty:"Beginner",
    time:"12 min",
    skill:"Navigation / PIA",
    desc:"Practice login, homepage tiles, and navigation flow."
  }
];

function $(id){ return document.getElementById(id); }

function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme === 'light' ? 'light' : 'dark');
  const knob = $('themeKnob');
  const label = $('themeLabel');
  if (knob) knob.textContent = currentTheme === 'light' ? '☀️' : '🌙';
  if (label) label.textContent = currentTheme === 'light' ? 'Light' : 'Night';
}
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('pslearn_theme', currentTheme);
  initTheme();
}

function setActiveNav(label) {
  document.querySelectorAll('.nav__link').forEach(btn => btn.classList.remove('nav__link--active'));
  document.querySelectorAll('.nav__link').forEach(btn => {
    if (btn.textContent.trim().toLowerCase().includes(label.toLowerCase())) {
      btn.classList.add('nav__link--active');
    }
  });
}

function hideAllAppPanels() {
  document.querySelectorAll('.app-panel').forEach(p => p.classList.remove('app-panel--active'));
  document.querySelectorAll('.app-panel').forEach(p => p.classList.add('hidden'));
}

function showHome() {
  $('homepageView').style.display = 'block';
  $('appView').classList.remove('app-shell--active');
  $('appView').style.display = 'none';
  setActiveNav('home');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showApp(viewId, title, subtitle) {
  $('homepageView').style.display = 'none';
  $('appView').style.display = 'block';
  $('appView').classList.add('app-shell--active');
  hideAllAppPanels();
  $(viewId).classList.remove('hidden');
  $(viewId).classList.add('app-panel--active');
  $('appTitle').textContent = title;
  $('appSubtitle').textContent = subtitle;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function showLearn() {
  showApp('learnView', 'Learn', 'Beginner + Intermediate');
  setActiveNav('learn');
  renderLearn();
}
function showGlossary() {
  showApp('glossaryView', 'Glossary', 'Key PeopleSoft Terms');
  setActiveNav('glossary');
  renderGlossary();
}
function showQuiz() {
  showApp('quizView', 'Quiz Engine', 'Topic Practice');
  setActiveNav('quiz');
  renderQuiz();
}
function showInterview() {
  showApp('interviewView', 'Interview Prep', '50 shuffled questions');
  setActiveNav('interview');
  renderInterview();
}
function showLab() {
  showApp('labsView', 'Practice Arena', 'Hands-on Labs');
  setActiveNav('practice');
  renderLabs();
}
function showAbout() {
  showApp('aboutView', 'About PSLearn', 'Platform Overview');
  setActiveNav('about');
}

function renderLearn() {
  const beginnerEl = $('beginnerTopicList');
  const intermediateEl = $('intermediateTopicList');
  if (!beginnerEl || !intermediateEl) return;

  beginnerEl.innerHTML = '';
  intermediateEl.innerHTML = '';

  if (typeof TOPICS !== 'undefined' && Array.isArray(TOPICS)) {
    beginnerEl.innerHTML = TOPICS.map((topic, idx) => `
      <div class="topic-item">
        <h4>${topic.num || String(idx + 1).padStart(2, '0')}. ${topic.title}</h4>
        <p>${topic.summary || 'PeopleSoft learning topic.'}</p>
      </div>
    `).join('');
  }

  intermediateEl.innerHTML = INTERMEDIATE_TOPICS.map((topic, idx) => `
    <div class="topic-item">
      <h4>${String(idx + 1).padStart(2, '0')}. ${topic.title}</h4>
      <p>${topic.desc}</p>
    </div>
  `).join('');
}

function renderGlossary() {
  const wrap = $('glossaryList');
  if (!wrap) return;

  if (typeof GLOSSARY !== 'undefined' && Array.isArray(GLOSSARY) && GLOSSARY.length) {
    wrap.innerHTML = GLOSSARY.map(item => `
      <div class="glossary-card">
        <h4>${item.term || 'Term'}</h4>
        <p>${item.definition || item.desc || ''}</p>
      </div>
    `).join('');
    return;
  }

  wrap.innerHTML = `
    <div class="glossary-card"><h4>EMPLID</h4><p>Unique employee ID in PeopleSoft HCM.</p></div>
    <div class="glossary-card"><h4>SetID</h4><p>Controls shared setup data across business units.</p></div>
    <div class="glossary-card"><h4>Business Unit</h4><p>Top-level operational entity in many PeopleSoft modules.</p></div>
  `;
}

function collectQuizItems() {
  const quizItems = [];
  if (typeof TOPICS !== 'undefined' && Array.isArray(TOPICS)) {
    TOPICS.forEach(topic => {
      if (Array.isArray(topic.quiz)) {
        topic.quiz.forEach(q => {
          quizItems.push({
            topic: topic.title,
            q: q.q,
            options: q.options || [],
            answer: typeof q.answer === 'number' ? q.answer : 0,
            explanation: q.explanation || ''
          });
        });
      }
    });
  }
  return quizItems.slice(0, 12);
}

function renderQuiz() {
  const wrap = $('quizList');
  if (!wrap) return;
  const items = collectQuizItems();

  if (!items.length) {
    wrap.innerHTML = `<div class="quiz-card"><h4>Quiz content loading soon</h4><p>Your quiz engine is ready for topic-based practice.</p></div>`;
    return;
  }

  wrap.innerHTML = items.map((item, idx) => `
    <div class="quiz-card">
      <span class="pill pill--green">${item.topic}</span>
      <h4>${idx + 1}. ${item.q}</h4>
      <div class="stack-grid">
        ${item.options.map((opt, i) => `
          <button class="btn btn--ghost btn--sm" onclick="alert('${i === item.answer ? 'Correct' : 'Not quite'}${item.explanation ? ' — ' + item.explanation.replace(/'/g, "\\'") : ''}')">${opt}</button>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function getShuffledInterviewSet(count = 50) {
  if (typeof INTERVIEW_QA === 'undefined' || !Array.isArray(INTERVIEW_QA)) return [];
  return [...INTERVIEW_QA]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

function renderInterview() {
  const wrap = $('interviewList');
  if (!wrap) return;
  const items = getShuffledInterviewSet(50);

  wrap.innerHTML = items.map((item, idx) => `
    <div class="question-card">
      <span class="pill pill--amber">${item.cat || 'Interview'}</span>
      <h4>${idx + 1}. ${item.q}</h4>
      <button class="btn btn--gold btn--sm" onclick="toggleAnswer(this)">Show Answer</button>
      <p class="answer hidden">${item.a}</p>
    </div>
  `).join('');
}

function toggleAnswer(btn) {
  const ans = btn.nextElementSibling;
  if (!ans) return;
  ans.classList.toggle('hidden');
  btn.textContent = ans.classList.contains('hidden') ? 'Show Answer' : 'Hide Answer';
}

function renderLabs() {
  const wrap = $('labGrid');
  if (!wrap) return;

  wrap.innerHTML = LABS.map(lab => `
    <div class="lab-card">
      <span class="pill pill--green">${lab.difficulty}</span>
      <h3>${lab.name}</h3>
      <p>${lab.desc}</p>
      <div class="meta-row">
        <span class="code-chip">${lab.time}</span>
        <span class="code-chip">${lab.skill}</span>
      </div>
      <button class="btn btn--gold btn--sm" onclick="launchPlaceholderLab('${lab.name.replace(/'/g, "\\'")}')">Open Lab →</button>
    </div>
  `).join('');
}

function launchPlaceholderLab(name) {
  alert(`${name} is ready for PASS 2 simulator upgrade.`);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  showHome();
});