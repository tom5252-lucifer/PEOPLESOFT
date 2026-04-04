/* PSLearn — Content Data */
/* Topics, Quiz Bank, Glossary, Curriculum */

const MODULES = [
  { name:"Module 1: Foundations", icon:"🔰", color:"#818cf8" },
  { name:"Module 2: Architecture & Environment", icon:"🏗️", color:"#f0a500" },
  { name:"Module 3: UI & Navigation", icon:"🖥️", color:"#22c55e" },
  { name:"Module 4: Application Designer & Data Model", icon:"🧱", color:"#22d3ee" },
  { name:"Module 5: Development Basics", icon:"💻", color:"#8b5cf6" },
  { name:"Module 6: Data & Query", icon:"📊", color:"#f59e0b" },
  { name:"Module 7: Process & Security", icon:"⚙️", color:"#ef4444" },
];

const TOPICS = [
  /* ── MODULE 1 ── */
  {
    id:"history", module:0, num:"01",
    title:"PeopleSoft History & Evolution",
    summary:"PeopleSoft started in 1987 as a simple HR payroll tool and grew into one of the world's largest enterprise software platforms. Understanding where it came from helps you understand why it's built the way it is.",
    preChecklist:[
      "Basic understanding of what ERP (Enterprise Resource Planning) software does",
      "Familiarity with the concept of HR software (payroll, employee records)",
      "No prior PeopleSoft knowledge needed — this is Topic 01",
    ],
    realWorld:"<strong>Scale context:</strong> PeopleSoft HCM runs payroll for organizations with 500,000+ employees in a single system. The US federal government, large public universities, and hospital networks all rely on PeopleSoft for their people operations. Understanding its history explains why it has so many layers and options — each feature was added to serve a specific enterprise need.",
    mistakes:[
      {title:"Confusing PeopleSoft with Oracle HCM Cloud (Fusion)", desc:"Many beginners think PeopleSoft and Oracle HCM Cloud are the same product. They are separate systems. PeopleSoft is on-premise or OCI hosted. Oracle HCM Cloud (Fusion) is SaaS-only. Different architecture, different codebase."},
      {title:"Thinking Oracle discontinued PeopleSoft after the acquisition", desc:"A common misconception. Oracle has actively continued PeopleSoft development since 2005, releasing Fluid UI, Elasticsearch, PUM, and AI features. PeopleSoft is not a legacy dead product."},
    ],
    quiz:[
      {q:"In what year did Oracle complete the acquisition of PeopleSoft?",options:["2003","2004","2005","2006"],answer:2,explanation:"Oracle completed the acquisition of PeopleSoft in January 2005 for $10.3 billion, after an 18-month hostile takeover battle that began in June 2003."},
      {q:"What major architectural change did PeopleSoft 8 (2000) introduce?",options:["Support for Oracle Database","Pure Internet Architecture — browser-based access","Application Packages for OOP","Fluid UI for mobile devices"],answer:1,explanation:"PeopleSoft 8 introduced Pure Internet Architecture (PIA) in 2000 — users could now access PeopleSoft from any browser without installing a desktop client. Only developers still needed the Application Designer client."},
      {q:"Who founded PeopleSoft in 1987?",options:["Larry Ellison","Dave Duffield and Ken Morris","Mark Hurd and Safra Catz","Craig Conway"],answer:1,explanation:"PeopleSoft was founded in 1987 by Dave Duffield and Ken Morris in Pleasanton, California. After the Oracle acquisition in 2005, Duffield went on to found Workday."},
    ],
    keyPoints:[
      "Founded 1987 by Dave Duffield — originally focused on HR payroll and benefits",
      "PeopleSoft 7 (1997) added Finance and Supply Chain modules",
      "PeopleSoft 8 (2000) introduced Pure Internet Architecture — no more desktop client for users",
      "Oracle acquired PeopleSoft in January 2005 after an 18-month hostile takeover battle",
      "Oracle continues active development — PeopleTools 8.60+ and regular PUM updates",
    ],
    sections:[
      {
        title:"The Early Years (1987–1999)",
        body:`PeopleSoft was founded in 1987 by Dave Duffield and Ken Morris in Pleasanton, California. Their first product was a client-server Human Resources application designed to replace green-screen mainframe HR systems that dominated corporate IT at the time.

The name "PeopleSoft" reflected its purpose — software built to manage people. The early versions ran as thick Windows desktop clients connecting directly to an Oracle or Sybase database. Every user needed the PeopleSoft client installed on their workstation.

**Key milestones in this era:**
- 1987: First product launched — HR and Payroll for mid-sized companies
- 1992: PeopleSoft went public (IPO), raising funds to expand product lines
- 1994: First Financial Management module released (Accounts Payable, General Ledger)
- 1997: PeopleSoft 7 released — added Supply Chain Management and expanded Finance. The company became a major ERP competitor to SAP and Oracle.`,
      },
      {
        title:"The Web Revolution — PeopleSoft 8 (2000)",
        body:`In 2000, PeopleSoft released version 8 with a completely redesigned architecture called Pure Internet Architecture (PIA). This was a landmark moment — users no longer needed to install anything on their computers. They could access PeopleSoft from any browser on any device.

The PIA architecture introduced the three-tier model that still powers PeopleSoft today: browser → web server → application server → database. Only developers still needed to install Application Designer on their workstations.

This shift was transformative for enterprise IT because it dramatically reduced the cost and complexity of deploying and maintaining PeopleSoft across thousands of users. Updates were applied on the server — not on thousands of desktops.`,
      },
      {
        title:"The Oracle Acquisition (2003–2005)",
        body:`In June 2003, Oracle Corporation launched a surprise hostile takeover bid for PeopleSoft at $5.1 billion. The PeopleSoft board and CEO Craig Conway rejected the offer repeatedly over 18 months. Oracle raised its offer multiple times, eventually reaching $10.3 billion.

The battle was fiercely public — PeopleSoft offered customers a guarantee program promising refunds if Oracle destroyed the product. The US Department of Justice investigated the acquisition for antitrust concerns but ultimately allowed it.

Oracle acquired PeopleSoft in January 2005 for $10.3 billion. Many in the industry feared Oracle would discontinue PeopleSoft in favor of Oracle E-Business Suite. Instead, Oracle committed to continuing PeopleSoft development — a commitment it has honored ever since.

Dave Duffield left Oracle after the acquisition and went on to found Workday, which today is one of PeopleSoft's primary competitors in the cloud HCM space.`,
      },
      {
        title:"PeopleSoft Under Oracle (2005–Present)",
        body:`Under Oracle, PeopleSoft continued to evolve with major improvements:

**2013 — Fluid UI introduced (PT 8.53):** The classic fixed-width desktop interface was replaced with a responsive HTML5 design that works on mobile and tablet.

**2014 — PeopleSoft Update Manager (PUM):** Oracle replaced the old bundle patching model with a continuous delivery approach. Organizations can now pick and choose specific fixes and features from a PeopleSoft Image without waiting for a full bundle.

**2015 — Elasticsearch integration (PT 8.55):** Full-text search replaced the older Verity search engine with modern Elasticsearch, giving users a Google-like search experience.

**2019 — Selective Adoption:** Organizations can now adopt specific new features without taking all updates, giving them greater control over their upgrade cadence.

**2023+ — AI Integration:** Oracle began integrating AI capabilities into PeopleSoft, including intelligent chatbots and AI-powered suggestions within HCM workflows.

PeopleTools today is at version 8.60+ and PeopleSoft applications continue to receive regular quarterly updates via PUM Images.`,
      },
    ],
  },
  {
    id:"intro", module:0, num:"02",
    title:"Introduction to PeopleSoft",
    summary:"PeopleSoft is Oracle's enterprise resource planning (ERP) platform that manages business operations across HR, Finance, Supply Chain, and Education. It is deployed by thousands of organizations worldwide across government, healthcare, universities, and large corporations.",
    preChecklist:[
      "You've read Topic 01 — PeopleSoft History & Evolution",
      "You understand what an ERP system does at a high level",
      "You know PeopleSoft is metadata-driven (objects defined in App Designer)",
    ],
    realWorld:"<strong>Why this matters for your career:</strong> When you join a PeopleSoft project, the first question a client asks is 'Which module are you experienced in?' Understanding all 8 product lines lets you speak confidently to HCM, FSCM, and Campus clients. Most consultants specialize in one — HCM is the most in-demand.",
    mistakes:[
      {title:"Treating PeopleSoft as a simple HR database", desc:"PeopleSoft is a full-stack enterprise platform with its own programming language, IDE, middleware, and integration framework. Beginners who treat it like a database miss the entire development and configuration model."},
      {title:"Assuming all modules are the same to configure", desc:"HCM, FSCM, and Campus Solutions have completely different data models, terminology, and configuration patterns. Knowledge from one module does NOT automatically transfer to another."},
    ],
    quiz:[
      {q:"How many major product lines does PeopleSoft have?",options:["4","6","8","12"],answer:2,explanation:"PeopleSoft has 8 major product lines: HCM, FSCM, Campus Solutions, ELM, CRM, EPM, SRM, and Supply Chain Management — with 201 modules total across all product lines."},
      {q:"What makes PeopleSoft's development approach fundamentally different from traditional software?",options:["It uses Java for all development","It is metadata-driven — developers define objects in App Designer, not hardcoded files","It requires no database","It only runs on Oracle databases"],answer:1,explanation:"PeopleSoft is metadata-driven. Developers define Records, Pages, and Components as metadata in Application Designer. The PeopleSoft runtime engine reads this metadata and generates HTML, SQL, and business logic at runtime — nothing is hardcoded."},
    ],
    keyPoints:[
      "PeopleSoft is a metadata-driven ERP — objects are defined in App Designer, not hardcoded",
      "8 major product lines covering HR, Finance, Supply Chain, Campus, CRM, and more",
      "Applications are built on top of PeopleTools — the development and runtime layer",
      "Deployed on-premise, hosted, or on Oracle Cloud Infrastructure (OCI)",
      "Runs on Oracle DB, Microsoft SQL Server, or IBM DB2",
    ],
    sections:[
      {
        title:"What is PeopleSoft?",
        body:`PeopleSoft is not a single application — it is a platform. At its core is a technology layer called PeopleTools, on top of which Oracle has built multiple enterprise application suites. When someone says they "use PeopleSoft," they typically mean their organization runs one or more of these application suites.

What makes PeopleSoft fundamentally different from traditional software is how it is built. In conventional software, developers write code that produces HTML pages, SQL statements, and business logic. In PeopleSoft, developers define metadata — objects like Records, Pages, and Components — using a tool called Application Designer. The PeopleSoft runtime engine reads this metadata and builds the actual pages, generates SQL, and enforces business rules at runtime.

This means that when you look at a PeopleSoft page in your browser, you are not looking at static HTML files. You are looking at dynamically generated output produced by the Component Processor interpreting metadata stored in the database.`,
      },
      {
        title:"The 8 PeopleSoft Product Lines",
        body:`PeopleSoft is organized into 8 major product lines, each covering a different business domain:

**1. Human Capital Management (HCM)**
The most widely deployed PeopleSoft product. Manages the complete employee lifecycle: recruiting and onboarding, job data and position management, compensation and benefits, payroll processing, time and labor, absence management, and talent management. The core record is the employee (identified by EMPLID).

**2. Financial Supply Chain Management (FSCM)**
Covers all financial operations: General Ledger, Accounts Payable, Accounts Receivable, Asset Management, Purchasing, Inventory, Project Costing, and Billing. Financial data is organized using ChartFields (Account, Department, Business Unit, etc.).

**3. Campus Solutions (CS)**
Built specifically for higher education institutions. Manages student admissions, enrollment, scheduling, financial aid, student accounts, and academic records. Used by universities worldwide.

**4. Enterprise Learning Management (ELM)**
Online learning delivery, instructor-led training, certification tracking, and learning content management.

**5. Customer Relationship Management (CRM)**
Customer data management, service requests, help desk, and field service operations.

**6. Enterprise Performance Management (EPM)**
Business intelligence, analytics, budgeting, and financial reporting.

**7. Supplier Relationship Management (SRM)**
Procurement, sourcing, supplier contracts, and vendor management.

**8. Supply Chain Management (SCM)**
Inventory, order management, logistics, manufacturing, and demand planning.`,
      },
      {
        title:"Why Organizations Choose PeopleSoft",
        body:`Organizations choose PeopleSoft for several key reasons:

**Deep configurability:** Unlike SaaS-only ERP systems, PeopleSoft allows organizations to build entirely custom objects, extend any delivered functionality, and configure the system to match their unique business processes.

**Robust security model:** The multi-level security framework (users, roles, permission lists, row-level security) is battle-tested across government agencies and large enterprises with complex organizational structures.

**On-premise or cloud flexibility:** Organizations that cannot or choose not to move to pure SaaS can still run PeopleSoft on their own infrastructure or on Oracle Cloud Infrastructure (OCI) while maintaining full control over their data and customizations.

**Proven at scale:** PeopleSoft handles payroll for hundreds of thousands of employees in single implementations. It processes billions of financial transactions annually across its installed base.

**However, PeopleSoft is complex.** The steep learning curve is real. Organizations need skilled technical consultants and developers to implement, maintain, and extend PeopleSoft. This complexity is precisely why PeopleSoft specialists command strong salaries and why there is consistent demand for those who truly understand the platform.`,
      },
    ],
  },
  {
    id:"peopletools", module:0, num:"03",
    title:"PeopleTools Overview",
    summary:"PeopleTools is the complete development, administration, and runtime platform that powers every PeopleSoft application. All PeopleSoft applications — HCM, FSCM, Campus Solutions — are built, deployed, and maintained using PeopleTools.",
    preChecklist:[
      "You know what PeopleSoft is and its main product lines (Topic 02)",
      "You understand that PeopleSoft is metadata-driven",
      "You have a general idea of what an IDE (development tool) is",
    ],
    realWorld:"<strong>Version mismatch is a real problem:</strong> In a typical consulting engagement, the first thing you check when joining a new client is their PeopleTools version. A feature that works in PT 8.57 may not exist in PT 8.53. Consultants who don't check this version first often waste days building something the client's environment can't support.",
    mistakes:[
      {title:"Confusing PeopleTools version with Application version", desc:"HCM 9.2 is the application. PeopleTools 8.59 is the platform. They version separately. A client can run HCM 9.2 on PT 8.55, 8.57, or 8.60 — very different capabilities each time."},
      {title:"Using Application Designer in 2-tier when 3-tier is required", desc:"Some features and PeopleCode functions only work in 3-tier mode. Beginners connecting in 2-tier (direct DB) sometimes can't understand why certain functionality isn't working."},
    ],
    quiz:[
      {q:"Which PeopleTools version introduced the Fluid UI?",options:["PT 8.49","PT 8.51","PT 8.53","PT 8.55"],answer:2,explanation:"Fluid UI was introduced in PeopleTools 8.53. It replaced the classic fixed-width HTML interface with a responsive HTML5/CSS3 design. Activity Guides and Event Mapping came later in PT 8.55."},
      {q:"What is Application Designer?",options:["A web-based reporting tool","A Windows desktop IDE where developers create PeopleSoft objects","A browser plugin for PeopleSoft","A database administration tool"],answer:1,explanation:"Application Designer is a Windows desktop IDE that connects to the PeopleSoft database. It is the primary tool for creating Records, Fields, Pages, Components, and writing PeopleCode. It stores all objects as metadata in the database."},
      {q:"What does Data Mover (.DMS scripts) do in PeopleTools?",options:["Runs payroll calculations","Migrates data and objects between PeopleSoft environments","Monitors server performance","Creates Fluid UI pages"],answer:1,explanation:"Data Mover is a PeopleTools utility for migrating data between PeopleSoft environments using .DMS script files. It can export and import database tables and is commonly used during implementations and upgrades."},
    ],
    keyPoints:[
      "PeopleTools is the foundation layer — HCM, FSCM, and all PS apps sit on top of it",
      "Application Designer is the primary development IDE — Windows client only",
      "Every PS object (records, pages, PeopleCode) is stored as metadata in the database",
      "PeopleTools has its own version number separate from the application version",
      "PT 8.53+ = Fluid UI · PT 8.55+ = Elasticsearch, Activity Guides, Event Mapping",
    ],
    sections:[
      {
        title:"What is PeopleTools?",
        body:`PeopleTools is Oracle's proprietary development platform that sits underneath every PeopleSoft application. When you develop in PeopleSoft, you are always working inside PeopleTools. It provides all the development tools, runtime services, security infrastructure, and integration capabilities that PeopleSoft applications rely on.

Think of PeopleTools as the operating system and PeopleSoft HCM or FSCM as the applications running on top of it. PeopleTools handles everything that is not specific to HR or Finance — the page rendering engine, the PeopleCode interpreter, the database communication layer, the security framework, and the integration platform.

This separation means that Oracle can improve PeopleTools independently of the application — which is why a company can run HCM 9.2 on PeopleTools 8.57 or 8.60. PeopleTools upgrades bring new technology capabilities (like Fluid UI or Elasticsearch) without requiring an application upgrade.`,
      },
      {
        title:"Core Tools Inside PeopleTools",
        body:`PeopleTools contains a comprehensive set of development and administration tools:

**Application Designer** — The primary IDE for all PeopleSoft development. A Windows desktop application that connects directly to the database. Used to create and modify Records, Fields, Pages, Components, Menus, PeopleCode, Application Packages, and many other object types. All objects created here are stored as metadata in the database.

**PeopleCode** — The proprietary event-driven scripting language used to write business logic. Resembles a combination of Java and BASIC. Runs server-side within the Tuxedo App Server.

**Application Engine (AE)** — Batch processing framework for large-scale data processing jobs. Runs outside the Component Processor and is managed by Process Scheduler.

**Integration Broker (IB)** — Enterprise messaging platform for real-time and asynchronous integrations. Supports REST, SOAP, and internal PeopleSoft messaging.

**PS Query / Query Manager** — Visual ad-hoc reporting tool that generates SQL. End users can build reports without writing code.

**BI Publisher** — Oracle's formatted reporting engine. Separates data (from PS Query) from layout (RTF/Excel template) to produce PDF, Excel, HTML, and CSV output.

**Data Mover** — Utility for migrating data between PeopleSoft environments using .DMS script files.

**Process Scheduler** — Manages all batch job execution — application engines, SQR reports, BI Publisher reports, and COBOL programs.

**Security Administrator** — Manages user profiles, roles, permission lists, and row-level security.

**Approval Workflow Engine (AWE)** — Configurable workflow routing framework for transaction approvals.`,
      },
      {
        title:"PeopleTools Versioning — Why It Matters",
        body:`PeopleTools has its own version numbering that is completely separate from the application version. Understanding this distinction is critical.

Example: A company might run **HCM 9.2** (the application) on **PeopleTools 8.59** (the development platform). The "9.2" refers to the PeopleSoft HCM feature set. The "8.59" determines which development and runtime capabilities are available.

**Key version milestones:**
- PT 8.52: Search Framework introduced (Verity engine)
- PT 8.53: Fluid UI introduced — responsive HTML5 pages
- PT 8.54: REST service support added to Integration Broker
- PT 8.55: Elasticsearch replaces Verity, Activity Guides, Event Mapping
- PT 8.56: Chatbot framework, Enhanced Fluid Navigation
- PT 8.57: Improved Fluid Homepages and Tiles
- PT 8.58: Drop Zone framework for customizations
- PT 8.59: WebLogic only for web server, Oracle JET updates
- PT 8.60+: Oracle Cloud Infrastructure enhancements, AI capabilities

Why this matters in practice: if a developer writes documentation saying "use Event Mapping for this customization," that feature only exists in PT 8.55+. A client running PT 8.53 cannot use it. Always check what PeopleTools version your environment runs before implementing any solution.`,
        pbLink:{title:"PeopleTools: Getting Started with PeopleTools", url:"https://docs.oracle.com/en/applications/peoplesoft/peopletools/index.html"},
      },
    ],
  },
  {
    id:"glossary", module:0, num:"04",
    title:"PeopleSoft Terminology Glossary",
    summary:"PeopleSoft has its own vocabulary. Before you can read documentation, ask questions, or understand any tutorial, you need to know what these terms actually mean. This glossary covers the most essential PeopleSoft-specific terms you will encounter immediately.",
    preChecklist:[
      "You've read Topics 01-03 (History, Introduction, PeopleTools)",
      "You understand PeopleSoft has multiple product lines",
      "No technical prerequisites — this is a vocabulary topic",
    ],
    realWorld:"<strong>First day on a project:</strong> In your first week on any PeopleSoft project, you will hear terms like EMPLID, Business Unit, SetID, ChartField, and Run Control in every meeting. Not knowing these creates a barrier to participation. Mastering this vocabulary is the single fastest way to start contributing.",
    mistakes:[
      {title:"Confusing 'Record' with a database row", desc:"In PeopleSoft, 'Record' means the metadata definition of a table or view — not a row of data. When someone says 'look at the JOB record,' they mean the Record object definition in App Designer, not a specific employee's job row."},
      {title:"Mixing up Business Unit and Department", desc:"These are completely different concepts. Business Unit is the top-level financial/organizational entity. Department is a lower-level organizational unit that belongs to a Business Unit. Many beginners use them interchangeably — they should not."},
    ],
    quiz:[
      {q:"What does EMPLID stand for and what is it used for?",options:["Employee Index — used for payroll only","Employee ID — the unique identifier for every employee across all HCM records","Employment ID — identifies a specific job, not a person","External ID — used for third-party integrations"],answer:1,explanation:"EMPLID is Employee ID — the unique identifier assigned to each employee in PeopleSoft HCM. Every HR table uses EMPLID as a primary key. One person always has one EMPLID, even if they hold multiple jobs (distinguished by EMPL_RCD)."},
      {q:"What is a Run Control in PeopleSoft?",options:["A security setting that controls who can run batch processes","A database record that stores parameters a user enters before submitting a batch process","A type of PeopleCode event","A server configuration setting"],answer:1,explanation:"A Run Control is a database record that stores the parameters a user enters before running a batch process. Batch processes cannot prompt the user interactively, so they read their parameters from the saved Run Control record."},
    ],
    keyPoints:[
      "EMPLID — the unique identifier for every employee across all PeopleSoft HCM records",
      "Business Unit — the primary organizational unit for Finance (FSCM) data segregation",
      "SetID — controls which setup/reference tables apply to each Business Unit",
      "Effective Date (EFFDT) — PeopleSoft's mechanism for storing historical changes over time",
      "Run Control — the record used to pass parameters to batch processes",
    ],
    sections:[
      {
        title:"People & HR Terminology",
        body:`**EMPLID (Employee ID)**
The unique identifier assigned to each employee in PeopleSoft HCM. Every HR table that holds employee data uses EMPLID as a primary key. It is typically a system-generated number but can be alphanumeric. One person always has one EMPLID, even if they hold multiple jobs.

**EMPL_RCD (Employee Record Number)**
Some employees have more than one concurrent employment (e.g., a professor who also works in administration). Each employment is tracked as a separate Employee Record, numbered 0, 1, 2, etc. EMPLID + EMPL_RCD together uniquely identify a single job.

**Action / Action Reason**
Every change to an employee's job record is recorded with an Action code (HIR = Hire, TER = Termination, PRO = Promotion, PAY = Pay Rate Change) and an Action Reason code (explains the why). This is how PeopleSoft tracks the complete story of every personnel change.

**Position**
A budgeted slot in the organization that can be filled by an employee. Positions belong to departments, have job codes, and carry salary grade information. Position Management links HR to Finance by connecting headcount to budget.

**ChartField**
The accounting code structure used in FSCM. Common ChartFields include Account, Department, Business Unit, Fund Code, Program Code, and Project. Every financial transaction is stamped with ChartField values that determine how it is recorded in the General Ledger.`,
      },
      {
        title:"Technical Terminology",
        body:`**Record**
In PeopleSoft, "record" does not mean a row of data — it means the metadata definition of a table or view. A Record definition in Application Designer becomes a physical database table (prefixed with PS_) when built. So the Record named JOB becomes the database table PS_JOB.

**Component Buffer**
The in-memory data structure that holds all data for the current transaction. When a user opens a page, the Component Processor loads data from the database into the Component Buffer. PeopleCode reads and writes to this buffer. Only when the user saves does the buffer write back to the database.

**Run Control**
A record used to store and pass parameters to batch processes. When a user submits a report or AE program, they first enter their parameters (date range, department, etc.) on a Run Control page, save them, and then submit the process. The process reads those saved parameters from the Run Control table.

**Meta-SQL**
PeopleSoft-specific SQL functions that are database-independent. Instead of writing Oracle-specific date functions, developers write %CurrentDateIn and PeopleSoft translates it to the correct syntax for Oracle, SQL Server, or DB2 at runtime. This is what makes PeopleSoft code portable across databases.

**Project (in App Designer)**
A container that groups related PeopleSoft objects for migration between environments. When a developer finishes work in DEV, they add all changed objects to a Project and migrate it to QA or PROD. Projects are the unit of change management.

**PUM Image**
PeopleSoft Update Manager Image — a virtual machine snapshot containing cumulative PeopleSoft code fixes and new features. Organizations use PUM to selectively apply updates to their system without a traditional upgrade. Released quarterly by Oracle.`,
      },
      {
        title:"Architecture Terminology",
        body:`**PIA (PeopleSoft Internet Architecture)**
The complete three-tier web architecture that powers PeopleSoft. Browser communicates with WebLogic web server, which communicates with Tuxedo App Server, which communicates with the database.

**Domain**
An instance of the Tuxedo Application Server or Process Scheduler. A single PeopleSoft environment typically has one App Server domain and one Process Scheduler domain, though high-availability setups can have multiple domains for load balancing.

**JOLT**
Java Object Linking and Transactions — the proprietary protocol used by WebLogic to communicate with the Tuxedo App Server. The JOLT port (typically 9000) is the connection point between the web tier and the application tier.

**PSAPPSRV**
The core Application Server process in Tuxedo. Handles component buffer operations, PeopleCode execution, and SQL generation. Multiple PSAPPSRV processes run simultaneously to handle concurrent user requests.

**DPK (Deployment Package)**
A PeopleSoft Deployment Package is a set of scripts and configuration files used to automate the installation and configuration of PeopleSoft environments. DPKs use Puppet for configuration management and are the standard way to set up both on-premise and cloud environments since PeopleTools 8.55.`,
      },
    ],
  },
  /* ── MODULE 2 ── */
  {
    id:"architecture", module:1, num:"05",
    title:"PeopleSoft Architecture (PIA)",
    summary:"PeopleSoft Pure Internet Architecture (PIA) is the three-tier web architecture that has powered PeopleSoft since version 8. Every user interaction flows through three tiers — browser, application server, and database — with each tier having a distinct role.",
    preChecklist:[
      "You know what a web server and database server are at a basic level",
      "You've read Topic 03 — PeopleTools Overview",
      "You understand PeopleSoft is accessed via a browser",
    ],
    realWorld:"<strong>Why this matters for debugging:</strong> When a page loads slowly, you need to know which tier is the bottleneck. Is it the network (browser to WebLogic)? Is it PeopleCode execution (App Server)? Is it SQL (Database)? Every PeopleSoft performance issue traces back to one of these three tiers. Knowing the architecture is the foundation of every diagnostic conversation.",
    mistakes:[
      {title:"Thinking business logic runs in the browser", desc:"Zero business logic runs in the browser. PeopleCode, field defaults, validations — all execute in the Tuxedo App Server. The browser is purely a display mechanism."},
      {title:"Forgetting that App Designer uses a separate 2-tier connection", desc:"When you open App Designer, it connects directly to the database (2-tier) — bypassing the Tuxedo App Server. This is different from how end users connect (3-tier through WebLogic). Some PeopleCode features only work in 3-tier mode."},
    ],
    quiz:[
      {q:"What protocol does WebLogic use to communicate with the Tuxedo App Server?",options:["HTTP","JDBC","JOLT","SOAP"],answer:2,explanation:"WebLogic communicates with the Tuxedo App Server using JOLT (Java Object Linking and Transactions) — Oracle's proprietary protocol. The JOLT port is typically 9000 and is the connection point between the web and application tiers."},
      {q:"Which App Server process handles PeopleCode execution and page rendering?",options:["PSQRYSRV","PSSAMSRV","PSAPPSRV","PSDSTSRV"],answer:2,explanation:"PSAPPSRV is the core Application Server process in Tuxedo. It handles component buffer operations, PeopleCode execution, and SQL generation. Multiple PSAPPSRV processes run simultaneously to serve concurrent users."},
      {q:"In PeopleSoft's 3-tier architecture, where does all business logic execute?",options:["In the browser (JavaScript)","In the WebLogic web server","In the Tuxedo Application Server","In the database (stored procedures)"],answer:2,explanation:"All PeopleSoft business logic — PeopleCode, field validation, Component Processor events — executes in the Tuxedo Application Server (Tier 2). The browser is purely a display layer and contains no business logic."},
    ],
    keyPoints:[
      "Browser ↔ WebLogic (HTTP/HTTPS) ↔ Tuxedo App Server (JOLT) ↔ Database (SQL)",
      "No business logic runs in the browser — all PeopleCode executes in the App Server",
      "Tuxedo manages multiple server processes: PSAPPSRV, PSQRYSRV, PSSAMSRV",
      "2-tier = App Designer connects directly to DB · 3-tier = via App Server",
      "Process Scheduler runs batch jobs asynchronously — decoupled from user sessions",
    ],
    sections:[
      {
        title:"The Three-Tier Architecture in Detail",
        diagram:"pia",
        body:`PeopleSoft's architecture is built on three clearly separated tiers, each with a specific responsibility:

**Tier 1 — Web Tier (Oracle WebLogic)**
The web tier is the entry point for all browser-based access. Oracle WebLogic Server hosts PeopleSoft's Java-based web application (PIA). When a user navigates to the PeopleSoft URL, their browser communicates with WebLogic over HTTP or HTTPS.

WebLogic's role is purely presentational — it receives requests, routes them to the App Server, receives responses, and sends HTML back to the browser. It contains no business logic of its own. As of PeopleTools 8.59, Oracle WebLogic is the only supported web server.

**Tier 2 — Application Tier (Oracle Tuxedo)**
This is the brain of PeopleSoft. The Application Server runs on Oracle Tuxedo, a powerful middleware platform originally developed by BEA Systems and acquired by Oracle. Tuxedo manages a pool of server processes that handle user requests.

Key App Server processes:
- PSAPPSRV — handles page builds, PeopleCode execution, Component Processor operations
- PSQRYSRV — dedicated to PS Query execution
- PSSAMSRV — handles security validation (sign-on, permission checks)
- PSQCKSRV — handles fast, read-only component operations
- PSRENSRV — handles report distribution

**Tier 3 — Database Tier**
All PeopleSoft data lives in the relational database. This includes both application data (actual business data like employee records, journal entries) and PeopleTools metadata (the definitions of records, pages, components, and PeopleCode programs stored as data in system tables).

PeopleSoft supports Oracle Database, Microsoft SQL Server, IBM DB2, and in recent versions, PostgreSQL.`,
        pbLink:{title:"PeopleTools: System and Server Administration — PIA Overview", url:"https://docs.oracle.com/en/applications/peoplesoft/peopletools/index.html"},
      },
      {
        title:"2-Tier vs 3-Tier Connection Mode",
        body:`PeopleSoft supports two connection modes for Application Designer — and understanding the difference matters for developers:

**2-Tier Mode (Direct DB Connection)**
Application Designer connects directly to the database without going through the App Server. This is the most common mode for developers because it is simpler to set up. Drawbacks: some features are only available in 3-tier mode, and direct DB connections carry higher risk.

In 2-tier, the connection uses standard database drivers (ODBC for SQL Server, native Oracle client for Oracle DB). The developer's workstation needs direct network access to the database server.

**3-Tier Mode (Via App Server)**
Application Designer connects to the App Server using the JOLT protocol, which then connects to the database. This adds a security layer and enables certain features (like the ability to test PeopleCode that calls PSAPPSRV-specific functions). 3-tier mode is required for environments where direct database access is restricted (common in tightly controlled production environments).

To configure 3-tier, developers use PeopleSoft Configuration Manager to specify the App Server hostname, JOLT port, and domain name.`,
      },
      {
        title:"Process Scheduler Architecture",
        body:`Batch processing in PeopleSoft runs through a separate component called Process Scheduler (also known as PSPRCSRV). Process Scheduler is decoupled from the web/app server infrastructure, which is essential for running long batch jobs without affecting online user performance.

**How it works:**
1. A user submits a process request from the browser (e.g., runs a payroll calculation)
2. A row is inserted into the PS_PRCSRQST (Process Request) table with status "Queued"
3. The Process Scheduler daemon monitors this table and picks up queued requests
4. The process executes on the batch server (could be the same machine or a dedicated server)
5. Upon completion, the Distribution Agent moves output files to Report Repository
6. The user views their report output in Report Manager

**Process Monitor** — The browser-based tool where users and admins monitor process status in real-time. Shows current status (Queued, Initiated, Processing, Success, No Success, Error) and provides links to logs and output files.

**Distribution Agent (PSDSTSRV)** — Transfers completed report files from the batch server to the Report Repository web server, making them accessible to users.`,
      },
    ],
  },
  {
    id:"oci", module:1, num:"06",
    title:"PeopleSoft Cloud & OCI Setup",
    summary:"PeopleSoft can run on Oracle Cloud Infrastructure (OCI) as well as traditional on-premise servers. Oracle provides automated deployment tools — DPK and PUM — that simplify both initial setup and ongoing maintenance.",
    preChecklist:["You understand PeopleSoft's three-tier architecture (Topic 05)","You know what a virtual machine (VM) is at a basic level","You understand the difference between on-premise and cloud hosting"],
    realWorld:"<strong>Real project scenario:</strong> Many organizations use PeopleSoft Images (VMs) as their DEV or SIT environments because they can be spun up in hours using DPK. Before DPKs, setting up a new PeopleSoft environment took 2-3 days of manual work. Now a senior admin can script it to run overnight.",
    mistakes:[
      {title:"Confusing PeopleSoft on OCI with Oracle HCM Cloud (Fusion)", desc:"PeopleSoft running on OCI is your own PeopleSoft instance hosted on Oracle's cloud hardware — all your customizations intact. Oracle HCM Cloud is a completely separate SaaS product. They share an owner but not code, architecture, or data."},
      {title:"Applying PUM updates without testing in a lower environment first", desc:"PUM allows selective patching — but even a small patch can affect customizations. Always apply to DEV/TEST first, run your test scripts, then promote to PROD."},
    ],
    quiz:[
      {q:"What tool does Oracle use to automate PeopleSoft environment setup from PT 8.55+?",options:["PSADMIN","PUM Images","DPK (Deployment Package)","Change Assistant"],answer:2,explanation:"DPK (Deployment Package) uses Puppet-based scripts to automate the complete installation and configuration of a PeopleSoft environment. It reduced a multi-day manual install to a few hours."},
      {q:"What is a PeopleSoft Image?",options:["A screenshot of the PeopleSoft UI","An Oracle VirtualBox VM pre-built with PeopleTools patches and application fixes","A backup of a PeopleSoft database","A Docker container for PeopleSoft"],answer:1,explanation:"A PeopleSoft Image is an Oracle VirtualBox VM pre-built with all PeopleTools patches and application fixes up to a specific point. Organizations connect their environment to the Image via PUM to selectively apply updates."},
    ],
    keyPoints:[
      "OCI = Oracle Cloud Infrastructure — Oracle's cloud platform for running PeopleSoft",
      "DPK (Deployment Package) = automated install scripts using Puppet — standard from PT 8.55+",
      "PUM (PeopleSoft Update Manager) = selective patching via PeopleSoft Image virtual machines",
      "PeopleSoft Image = an Oracle VirtualBox VM with pre-built, fully configured PS environment",
      "Cloud Manager = Oracle's PaaS tool for managing PS environments on OCI",
    ],
    sections:[
      {
        title:"Why Cloud for PeopleSoft?",
        body:`PeopleSoft has traditionally been an on-premise application — organizations install and maintain it on their own servers. Oracle Cloud Infrastructure now provides an alternative that reduces infrastructure management overhead while preserving the full PeopleSoft feature set.

Key benefits of running PeopleSoft on OCI:
- **No hardware management** — Oracle handles the physical infrastructure
- **Elastic scaling** — add capacity during peak periods (e.g., open enrollment, year-end payroll)
- **Oracle support integration** — direct connection to Oracle's support infrastructure
- **PeopleSoft Cloud Manager** — automated lifecycle management tool for OCI-hosted environments

Important distinction: PeopleSoft on OCI is NOT the same as Oracle HCM Cloud (Fusion). Organizations running PeopleSoft on OCI still run their own PeopleSoft instance with all their customizations intact. They simply run it on Oracle's cloud hardware instead of their own.`,
      },
      {
        title:"DPK — Deployment Package",
        body:`Starting with PeopleTools 8.55, Oracle standardized PeopleSoft installation using Deployment Packages (DPKs). A DPK is a collection of scripts and configuration files that automate the entire installation and configuration of a PeopleSoft environment.

DPKs use Puppet (an infrastructure automation tool) to define the desired state of the environment. Running the DPK setup script will install the web server, configure WebLogic, set up Tuxedo, apply PeopleTools, and configure the environment — all automatically.

**Types of DPKs:**
- **PeopleTools DPK** — installs and configures the PeopleTools technology stack (WebLogic, Tuxedo, App Server, Web Server)
- **Application DPK** — installs the PeopleSoft application layer (HCM, FSCM, CS, etc.)
- **Update DPK** — applies PUM patches and updates

Before DPKs, PeopleSoft installation was a multi-day manual process. DPKs have reduced initial setup to hours, making it practical for organizations to build and rebuild environments quickly.`,
      },
      {
        title:"PUM — PeopleSoft Update Manager",
        body:`PeopleSoft Update Manager (PUM) replaced the old bundle patching model starting around 2014. Instead of waiting for quarterly bundles and applying everything at once, PUM allows organizations to selectively adopt individual fixes and features from a PeopleSoft Image.

**PeopleSoft Image:**
A PeopleSoft Image is an Oracle VirtualBox virtual machine (VM) that comes pre-built with all PeopleTools patches, application fixes, and new features up to a certain point. Oracle releases new Images regularly (typically every 3-4 months for each product line).

Organizations use the Image as a "source" of updates. They connect their production system to the Image, browse available updates through the PUM interface, select exactly what they want, and generate a Change Package to apply to their environment.

**The PUM workflow:**
1. Download the latest PeopleSoft Image from Oracle's support site
2. Load the Image into Oracle VirtualBox or OCI
3. Connect your environment to the Image via PUM
4. Browse and select updates in the PUM browser interface
5. Generate and apply the Change Package to your environment
6. Test and deploy

This approach gives organizations much finer control over what changes they take. A team can apply only the critical security fixes without taking the new UI features they haven't tested yet.`,
        pbLink:{title:"PeopleSoft Update Manager — Oracle Documentation", url:"https://docs.oracle.com/cd/F28299_01/pt857pbr3/eng/pt/tpum/concept_PeopleSoftUpdateManagerOverview-0750d5.html"},
      },
    ],
  },
  /* ── MODULE 3 ── */
  {
    id:"nav-ui", module:2, num:"07",
    title:"PeopleSoft Navigation & User Interface",
    summary:"Before developing in PeopleSoft, you need to understand how to use it as a user. PeopleSoft has two distinct UI paradigms — Classic (the older fixed-width interface) and Fluid (the modern responsive interface introduced in PT 8.53).",
    preChecklist:["You've read Topic 05 — PeopleSoft Architecture","You understand PeopleSoft is browser-based (no desktop install for users)","You know PeopleTools 8.53+ introduced Fluid UI"],
    realWorld:"<strong>Developer tip:</strong> Before writing a single line of PeopleCode, spend time navigating PeopleSoft as a regular user. Open components, run searches, add new records, check all tabs. Understanding the user experience is critical for building things that actually make sense to use.",
    mistakes:[
      {title:"Assuming Classic and Fluid pages use the same controls", desc:"Fluid pages use completely different controls — Layout GroupBoxes, Banner controls, Related Actions. A Classic page developer cannot just 'convert' a page to Fluid by changing a setting."},
      {title:"Not registering a new component in the Portal after creating it", desc:"A component that exists in App Designer but is not registered as a Content Reference (CREF) in the Portal is invisible to users. This is one of the most common beginner mistakes after building their first component."},
    ],
    quiz:[
      {q:"What is a Tile in PeopleSoft Fluid UI?",options:["A database partition","A clickable icon on a Fluid Homepage that links to a component","A type of PeopleCode event","A security permission"],answer:1,explanation:"Tiles are large clickable buttons on Fluid Homepages that link to components or show dynamic data. Each Tile is a Content Reference (CREF) with an image and optional dynamic count badge (e.g., '3 pending approvals')."},
      {q:"What is the NavBar in PeopleSoft Fluid?",options:["The top navigation bar in Classic PeopleSoft","A slide-out panel with Recent Places, Favorites, and Navigator for browsing all components","The breadcrumb trail at the top of each page","The menu bar in Application Designer"],answer:1,explanation:"The NavBar is the slide-out navigation panel in Fluid PeopleSoft, opened by clicking the hamburger menu icon. It contains Recent Places (last 10 visited), Favorites (bookmarked pages), and Navigator (a full browsable tree of all accessible components)."},
    ],
    keyPoints:[
      "Classic UI = fixed-width, desktop-only, gray interface — still used in many organizations",
      "Fluid UI = responsive HTML5, works on mobile/tablet, modern design — standard from PT 8.53+",
      "NavBar = the slide-out navigation panel in Fluid with Recent Places, Favorites, Navigator",
      "Homepages = Fluid landing pages with tiles — each tile links to a component",
      "Breadcrumbs in Fluid show users where they are in the navigation hierarchy",
    ],
    sections:[
      {
        title:"Classic vs Fluid Interface",
        body:`PeopleSoft has two visual modes that users might encounter depending on their organization's PeopleTools version and configuration:

**Classic Interface**
The original PeopleSoft web interface introduced with PIA in PeopleSoft 8 (2000). It uses fixed-width HTML tables, produces a distinctive gray-and-blue look, and works best on desktop browsers. Classic pages cannot adapt to different screen sizes — they look the same on a 27-inch monitor and a 13-inch laptop.

Navigation in Classic uses a hierarchical menu bar at the top. Users click through menus and sub-menus to reach components. The "bread and butter" of PeopleSoft for over a decade.

**Fluid Interface**
Introduced in PeopleTools 8.53 (2013), Fluid completely redesigned how PeopleSoft looks and feels. Fluid pages use responsive HTML5 and CSS3 that adapts to any screen size — desktop, tablet, or smartphone. The visual design is modern and clean.

Fluid uses Homepages with Tiles, a slide-out NavBar for navigation, and a more intuitive user experience. Oracle has committed to building all new functionality in Fluid and is progressively migrating Classic components to Fluid.

Many organizations run both — some components have been migrated to Fluid while others remain Classic. Users may see both interfaces within the same PeopleSoft session.`,
      },
      {
        title:"Fluid Navigation — Homepages, Tiles & NavBar",
        body:`**Homepages**
The Fluid landing page after login. A Homepage displays a collection of Tiles — large clickable buttons that link to components or show dynamic data. Users can have multiple Homepages (like tabs) for different roles. Example: an HR manager might have a "Manager Self Service" homepage with tiles for team approvals, leave requests, and job changes.

Administrators configure which Tiles appear on each Homepage. Tiles can show dynamic counts (e.g., "3 pending approvals") using Tile Wizards that query live data.

**NavBar (Navigation Bar)**
The slide-out navigation panel opened by clicking the hamburger menu icon. Contains:
- **Recent Places** — last 10 pages visited
- **Favorites** — user-bookmarked pages
- **Navigator** — a browsable tree of all accessible components, organized by category
- **Classic Menu** — (when Classic navigation is enabled) the traditional menu hierarchy

**Breadcrumbs**
Fluid automatically generates breadcrumb navigation showing where the user is in the portal hierarchy. Clicking a breadcrumb navigates back up the tree.

**Search Bar**
If Elasticsearch is configured, a Global Search bar appears in the header. Users can type any name, ID, or description and get results across all PeopleSoft modules they have access to.`,
      },
      {
        title:"Working with Components — A User's View",
        body:`When a user navigates to a PeopleSoft component, they typically encounter a Search Page first:

**The Search Page**
Before seeing any data, the user must search for existing records or indicate they want to add a new one. The search page shows fields defined as Search Keys in the component's Search Record. For example, navigating to "Employee Job Data" shows a search page with fields for Employee ID, Name, or Department.

**Search Results**
After submitting search criteria, PeopleSoft displays a list of matching rows. Each row shows the List Box Item fields. The user clicks a row to open that record in the component.

**The Component**
Once a record is selected, the component opens showing one or more page tabs (folder tabs). The user can navigate between tabs — all tabs share the same data buffer and save together. Common examples: the Job Data component has tabs for Work Location, Job Information, Compensation, and Employment.

**Toolbar buttons** at the bottom: Save, Return to Search, Next in List, Previous in List, Notify (sends a workflow notification).

**Action Modes**
Components can be accessed in different modes: Add (create a new record), Update/Display (view and edit existing data), Update Display All (see all historical rows), Correction (fix historical data). The available modes depend on the user's permission list.`,
      },
    ],
  },
  {
    id:"menus", module:2, num:"08",
    title:"Menus & Navigation",
    summary:"Navigation in PeopleSoft defines how users find and access components. Understanding both Classic menu structure and Fluid Portal Registry is essential — both as a user and as a developer registering new components.",
    preChecklist:["You understand Classic vs Fluid UI (Topic 07)","You know what a Component is in PeopleSoft","You understand Permission Lists control what users can access"],
    realWorld:"<strong>Common support ticket:</strong> 'I created a new component but users can't find it.' Almost always the cause is a missing Content Reference (CREF) in the Portal Registry, or the CREF exists but wasn't granted to the correct permission list. Portal registration is non-optional.",
    mistakes:[
      {title:"Building a component and forgetting to register it in the Portal", desc:"Every custom component needs a CREF in the Portal Registry. Without it, users cannot navigate to it. There is no automatic registration."},
      {title:"Granting the CREF but not the Component in the Permission List", desc:"Two separate grants are needed: the CREF must be accessible (portal security) AND the component must be in the user's Permission List (page security). Missing either one blocks access."},
    ],
    quiz:[
      {q:"What is a Content Reference (CREF) in PeopleSoft Fluid?",options:["A database view for reporting","A pointer to a component in the Portal Registry that makes it navigable","A type of PeopleCode function","A security role"],answer:1,explanation:"A Content Reference (CREF) is a pointer in the Portal Registry that points to a component (or external URL) and defines its label, folder location, and security settings. Without a CREF, a component cannot appear in the NavBar Navigator or on a Homepage tile."},
      {q:"In Classic PeopleSoft, what is the navigation hierarchy?",options:["Homepage → Tile → Component","Root Menu → Menu → Bar Name → Component","NavBar → Navigator → Module → Component","Permission List → Role → Component"],answer:1,explanation:"Classic PeopleSoft navigation is a four-level hierarchy: Root Menu → Menu Bar → Menu Item/Bar Name → Component Link. Developers register components into this hierarchy in Application Designer by creating Menu objects."},
    ],
    keyPoints:[
      "Classic nav: Root Menu → Menu → Bar Name → Item → Component",
      "Fluid nav: Portal Registry of Content References (CREFs) organized in a hierarchy",
      "Every component must be registered (as a CREF) to appear in navigation",
      "Permission Lists control which CREFs (navigation items) a user can see and access",
      "Tiles on Fluid Homepages are CREFs with an image and optional dynamic count",
    ],
    sections:[
      {
        title:"Classic Menu Structure",
        body:`In Classic PeopleSoft, navigation is structured as a four-level hierarchy:

1. **Root Menu** — the top-level navigation (e.g., "Main Menu")
2. **Menu Bar** — second level (e.g., "Workforce Administration")
3. **Menu Item / Bar Name** — third level (e.g., "Job Information")
4. **Component Link** — the actual component (e.g., "Job Data")

Developers register components into this hierarchy in Application Designer by creating Menu objects and associating components with menu items. The menu definition also specifies which action modes are available (Add, Update, Display).

This classic menu system still works in PT 8.55+ when Classic navigation is enabled. Many organizations run in a mixed mode where the Fluid NavBar is the primary navigation but Classic menu paths still work via bookmarks and direct URLs.

**Classic Navigation URL format:**
PeopleSoft classic pages are accessed via URLs like:
\`/psp/ps/EMPLOYEE/HRMS/c/ROLE_EMPLOYEE.JOB_DATA.GBL\`
Where HRMS is the database name, c/ indicates a component, ROLE_EMPLOYEE is the menu, JOB_DATA is the component name, and GBL is the market.`,
      },
      {
        title:"Fluid Portal Registry & Content References",
        body:`Fluid navigation replaces the classic menu with a Portal Registry. Every navigable item in Fluid is a Content Reference (CREF) — a pointer to a component with its URL, label, and access properties.

**Content Reference (CREF)**
A CREF defines:
- The target component (or URL for external links)
- The display label shown in navigation
- The folder/category it lives in
- Security settings (which permission lists can see it)
- Tile configuration (if it appears as a tile on a Homepage)

**Portal Registry Structure**
CREFs are organized in a folder hierarchy in the Portal Registry. This hierarchy determines how items appear in the NavBar Navigator. For example:
- Portal Root → PeopleSoft Menu → Workforce Administration → Job Information → Job Data

**Registering a New Component**
When a developer creates a new component in Application Designer, they must:
1. Open Portal → Structure & Content in the browser
2. Create a new Content Reference pointing to the component
3. Place it in the appropriate folder in the Registry
4. Set security (which permission lists can access it)
5. Optionally create a Tile definition if it should appear on a Homepage

A component that is not registered in the Portal Registry cannot be navigated to by users — it simply won't appear anywhere. This is one of the most common mistakes new PeopleSoft developers make.`,
      },
    ],
  },
  {
    id:"pages-components", module:2, num:"09",
    title:"Pages & Components",
    summary:"Pages define the user interface layout. Components group one or more pages into a transaction. Together, they form the front-end layer of PeopleSoft — what users actually see and interact with.",
    preChecklist:["You know what Records and Fields are (Topic 12 or basic understanding)","You've navigated PeopleSoft as a user and seen pages with tabs","You understand that PeopleSoft is metadata-driven"],
    realWorld:"<strong>Transaction boundary is critical:</strong> On a real HCM implementation, the Job Data component has 8+ pages — Work Location, Job Information, Compensation, Employment, Earnings Distribution, etc. When a user saves, ALL of those pages commit together. This is why re-opening Job Data always shows consistent data across all tabs.",
    mistakes:[
      {title:"Trying to save data to a Derived/Work record field in a database", desc:"Fields on Derived/Work records exist only in memory. You cannot SELECT them from the database because there is no database table for them. They are used for temporary calculations and UI-only values."},
      {title:"Putting business logic on a page instead of the component", desc:"Business rules (validation, defaults) should be on records or at the component level. Page-level PeopleCode is only for UI behavior. Misplacing logic leads to it not firing in all contexts (e.g., Component Interfaces bypass page events)."},
    ],
    quiz:[
      {q:"What is the key difference between a Grid and a Scroll Area in PeopleSoft?",options:["Grids are for Finance, Scroll Areas are for HCM","Grid is the modern replacement for Scroll Area — both display child rows but Grid supports sorting/filtering","Scroll Areas can save data; Grids cannot","There is no difference — they are the same control"],answer:1,explanation:"Grid is the modern control that replaced Scroll Area for displaying child record rows. Grids support sorting, filtering, and pagination. Scroll Areas are older Classic controls still seen in legacy pages. New development should always use Grids."},
      {q:"If a component has 4 pages and a user edits fields on 3 of them, what happens when they click Save?",options:["Only the pages that were changed are saved","All 4 pages are validated and saved together as one atomic transaction","Each page saves independently","The last page edited is saved first"],answer:1,explanation:"A Component is the unit of a transaction. When a user saves, ALL pages in the component are validated and committed together as one atomic operation — either all succeed or none do. This is what makes the Component the logical unit of a business transaction."},
    ],
    keyPoints:[
      "Pages are metadata layouts — not HTML — rendered into HTML by the App Server at runtime",
      "Every field on a page must be bound to a Record.Field — no free-floating data",
      "A Component groups pages into a single transaction — all pages save together",
      "Grids display child rows (one-to-many data) — they replaced older Scroll Areas",
      "Sub Pages are reusable page fragments embedded across multiple pages",
    ],
    sections:[
      {
        title:"Pages — Layout & Controls",
        body:`A Page in PeopleSoft is the visual layout definition. You design pages in Application Designer by dragging and dropping controls onto a canvas. Pages are not HTML files — they are metadata stored in the database. The PeopleSoft App Server reads this metadata and generates the HTML that the browser displays.

**Page Controls — the building blocks of every page:**

- **Edit Box** — A text input field. Must be bound to a Record.Field (e.g., JOB.DEPTID). Validates against a prompt table or translate values if configured.
- **Drop Down List** — A select box populated from Translate Values or a prompt table.
- **Long Edit Box** — A textarea for long text entry (bound to a Long Character field).
- **Check Box** — A boolean toggle. Bound to a Character field that stores 'Y' or 'N'.
- **Radio Button** — For mutually exclusive options.
- **Push Button / Hyperlink** — Triggers a PeopleCode FieldChange event or navigates elsewhere.
- **Grid** — Displays multiple child rows of data (the modern replacement for Scroll Areas). Each row in the grid corresponds to a row in a child record. Grids support sorting, filtering, and pagination.
- **Scroll Area** — The older control for displaying child record rows. Still seen in legacy Classic pages.
- **Sub Page** — Embeds another page's controls inside this page. Used for common field groups shared across pages (e.g., address fields, effective date section).
- **Group Box** — A visual border that groups related fields. No data binding — purely cosmetic organization.
- **Static Text / Image** — Decorative text or images with no data binding.`,
      },
      {
        title:"Components — The Transaction Unit",
        body:`A Component is the unit of work in PeopleSoft. It groups one or more related pages into a single transaction. The defining characteristic of a component is that all pages share the same data buffer and save together as one atomic operation.

**Component structure defined in App Designer:**

1. **Component Properties**
   - Search Record — the record used to build the search dialog
   - Add Search Record — separate search record for Add mode
   - Action modes — which modes are allowed (Add, Update, Display, Update All, Correction)

2. **Component Pages**
   - The ordered list of pages in the component
   - Each page appears as a tab in the browser
   - Tab order can be configured
   - Pages can be hidden using PeopleCode based on business conditions

3. **Component PeopleCode**
   - PostBuild, PreBuild, SearchInit, SearchSave, SaveEdit, SavePreChange, SavePostChange
   - These events fire at the component level, not the field level

**Transaction Integrity**
When a user saves a component, ALL data across ALL pages is validated and committed together. There is no partial save — either the entire transaction succeeds or none of it does. This is what makes the Component the logical unit of a business transaction.

**Work Pages / Hidden Pages**
Components can contain hidden pages that users never see. These are work pages backed by Derived/Work records. They store temporary values and intermediate calculations needed by PeopleCode but not relevant to the user.`,
        pbLink:{title:"Application Designer Developer's Guide — Creating Pages and Components", url:"https://docs.oracle.com/cd/F70250_01/psft/pdf/pt860tapd-b092022.pdf"},
      },
    ],
  },
  {
    id:"search-records", module:2, num:"10",
    title:"Search Records & Add/Search Page",
    summary:"Every component uses a Search Record to build the search dialog that users see before opening a transaction. Understanding how search records work — both from a user perspective and a developer perspective — is fundamental to PeopleSoft development.",
    preChecklist:["You understand what Records are in PeopleSoft (Topic 12)","You know what a Component is and how it groups pages","You've seen the PeopleSoft search dialog as a user"],
    realWorld:"<strong>Security through Search Records:</strong> In a large university's Campus Solutions system, a financial aid advisor can search for and see only their own students — even though they access the same component as an advisor in another college. This is implemented entirely through a security view used as the Search Record. No PeopleCode needed.",
    mistakes:[
      {title:"Using the base SQL table as the Search Record for components showing employee data", desc:"If you use PS_JOB directly as your Search Record, any user with access to your component can see ALL employees regardless of their row-level security settings. Always use a security view."},
      {title:"Marking too many fields as Search Keys without supporting indexes", desc:"Every field marked as a Search Key causes PeopleSoft to include it in the SQL WHERE clause. Without a database index, this causes a full table scan. Only mark fields as Search Keys if you also have (or create) a database index for them."},
    ],
    quiz:[
      {q:"What does a 'List Box Item' field property do on a Search Record?",options:["Makes the field searchable by users","Makes the field appear as a column in the search results list","Creates a database index on the field","Hides the field from the search dialog"],answer:1,explanation:"Fields marked as List Box Items (L) appear as columns in the search results list after a user submits search criteria. They help users identify which row to select — e.g., showing Name, Job Title, and Department alongside the Employee ID."},
      {q:"Why should you use a SQL View as the Search Record instead of the base table when showing employee data?",options:["Views are faster than tables","Views allow you to join additional data","Security views filter data based on the user's row-level security profile","Views allow Add mode"],answer:2,explanation:"Using a security view as the Search Record automatically filters results to only the rows the user is authorized to see. The view joins the base table with a security join table that enforces row-level security — without any PeopleCode needed."},
    ],
    keyPoints:[
      "Search Record defines the fields in the component's search dialog (which keys users can search)",
      "Add Search Record can differ from Search Record — used when adding new entries",
      "Search Key fields become search inputs · List Box Items become result columns",
      "Alternate Search Keys create additional search paths without being in the primary key",
      "Row-level security is often implemented by using a security view as the Search Record",
    ],
    sections:[
      {
        title:"What is a Search Record?",
        body:`When a user navigates to any PeopleSoft component, they first see a Search Page — a form asking them to enter criteria to find the record they want. The fields on this Search Page are driven entirely by the component's Search Record definition.

The Search Record is a regular PeopleSoft record definition — typically the same record as the component's primary (Level 0) record, or a SQL View that joins and filters data for searching purposes.

**From the user's perspective:**
The Search Page has fields corresponding to the Search Keys defined on the Search Record. The user enters values (partial Employee ID, a name, a department) and clicks Search. PeopleSoft generates a SQL SELECT against the Search Record with the entered criteria.

**The Search Results list:**
After searching, a list of matching rows appears. The columns shown in this list are the fields marked as List Box Items in the Search Record. The user clicks a row to load that record into the component.

**Add Mode:**
If the user clicks the "Add" button on the Search Page, PeopleSoft uses the Add Search Record (which may differ from the main Search Record). In Add mode, the user typically enters the key values for the new record they want to create.`,
      },
      {
        title:"Search Key Types in App Designer",
        body:`When defining fields on a record in Application Designer, you assign each field a "Use" property that determines its role:

**Key (K)**
A field that is part of the database primary key. All Key fields appear in the search dialog and are required for retrieving a specific row. PeopleSoft generates a clustered primary key index on Key fields.

**Alternate Search Key (A)**
Creates an additional search path that is not part of the primary key. For example, on the JOB record, EMPLID is the Key but you might also want to search by Name (stored in a different record). An Alternate Search Key creates a database index on that field to support efficient searching. Users see it as an optional search field.

**List Box Item (L)**
A field that appears as a column in the search results list. These help users identify which row they want to select. For example, searching for employees by department might show EMPLID, Name, Job Title, and Hire Date as List Box Items so users can distinguish between employees with similar names.

**Search Key (S)**
Appears as a searchable field in the dialog but does NOT create a database index. Used for fields that are either already indexed through another mechanism or where the search is acceptable without an index.

**Performance implication:**
Every field you mark as an Alternate Search Key or Search Key causes PeopleSoft to include that field in the WHERE clause when users enter values. If there is no supporting index, this causes a full table scan. Proper key design directly impacts the performance of the search dialog.`,
      },
      {
        title:"Security Views as Search Records",
        body:`One of the most important uses of custom Search Records is row-level security implementation. PeopleSoft's security framework allows you to restrict which data rows a user can see — not just which pages they can access.

**How row-level security works through Search Records:**

Instead of using the base SQL table as the Search Record, developers create a SQL View that joins the base table with a security join table. The security join table filters rows based on the user's security profile.

Example: Instead of using PS_JOB as the search record for Job Data, use a view like PS_JOB_SRCH_VW that joins PS_JOB with PS_DEPT_SECURITY (a security view that only includes departments the current user is authorized to see).

When a user searches for employees, the view's WHERE clause automatically filters out departments they don't have access to — without any PeopleCode needed.

**This is a critical concept for developers** because forgetting to use a security view on a custom component that displays employee data means any user with access to that component can see all employee data regardless of their row-level security settings. This is a common security vulnerability in custom PeopleSoft development.`,
        pbLink:{title:"Application Designer Developer's Guide — Defining Search Records", url:"https://docs.oracle.com/cd/F70250_01/psft/pdf/pt860tapd-b092022.pdf"},
      },
    ],
  },
  /* ── MODULE 4 ── */
  {
    id:"app-designer", module:3, num:"11",
    title:"Application Designer Basics",
    summary:"Application Designer (App Designer) is the primary development IDE for PeopleSoft. It is a Windows desktop application where developers create and manage all PeopleSoft objects — records, fields, pages, components, menus, and PeopleCode.",
    preChecklist:["You understand what PeopleTools is (Topic 03)","You know PeopleSoft is metadata-driven — objects are stored in the database","You have basic familiarity with an IDE concept"],
    realWorld:"<strong>Custom prefix is law:</strong> In every real project, your organization assigns a custom prefix (e.g., 'ZZ_', 'ACME_', 'UNI_') for all custom objects. This is not optional. Delivered PeopleSoft upgrades can overwrite objects without a custom prefix. A consultant who modifies a delivered record directly causes upgrade nightmares for the client's team years later.",
    mistakes:[
      {title:"Modifying Oracle-delivered objects directly", desc:"Never change delivered records, pages, or PeopleCode directly. Clone them with your custom prefix and modify the clone. Direct modifications get overwritten during PeopleSoft upgrades and create painful merge conflicts."},
      {title:"Forgetting to Build (Create/Alter) the table after defining a record", desc:"Defining a SQL Table record in App Designer only creates the metadata definition. You must run Build → Current Object → Create Table to actually create the physical database table. Many beginners define the record but wonder why they can't insert data."},
      {title:"Not adding objects to a Project before migrating", desc:"If you forget to add a changed object to your migration Project, it won't move to QA or PROD. Always check your Project before migration."},
    ],
    quiz:[
      {q:"After defining a new SQL Table record in Application Designer, what must you do to create the actual database table?",options:["Save the record definition — the table is created automatically","Run Build → Current Object → Create Table","Submit a request to the DBA","Restart the App Server"],answer:1,explanation:"Saving a record definition only stores the metadata. To create the physical database table, you must run Build → Current Object → Create Table. This generates and executes the DDL (CREATE TABLE statement) against the database."},
      {q:"What is the purpose of a Project in Application Designer?",options:["To organize objects for display only","To group related objects for migration between environments (DEV → QA → PROD)","To create a new PeopleSoft database","To run batch processes"],answer:1,explanation:"A Project in Application Designer groups related PeopleSoft objects (records, pages, components, PeopleCode) for migration between environments. When development is complete in DEV, the Project is migrated to QA and eventually PROD."},
      {q:"Why must all custom PeopleSoft objects use a company-specific prefix?",options:["It makes the code run faster","It prevents naming conflicts with Oracle-delivered objects during upgrades","It is required by the database","It enables integration with external systems"],answer:1,explanation:"Oracle-delivered PeopleSoft objects don't use custom prefixes. If your custom object has the same name as a delivered object, a PeopleSoft upgrade can overwrite your customization. Custom prefixes (e.g., ZZ_JOB, ACME_PAGE) prevent this collision."},
    ],
    keyPoints:[
      "App Designer is a Windows-only client — must be installed on your development workstation",
      "Connects to the PeopleSoft database (2-tier) or App Server (3-tier)",
      "All PeopleSoft objects are metadata stored in DB — App Designer is just an editor for that metadata",
      "Projects group related objects for migration between environments (DEV → QA → PROD)",
      "Build → Current Object physically creates/alters the database table from record definition",
    ],
    sections:[
      {
        title:"The App Designer Interface",
        uiIllustration:"appdesigner",
        body:`Application Designer opens with a workspace divided into several panels:

**Project Workspace (left panel)**
Shows a tree of all objects included in the current Project. Organized by object type — Records, Fields, Pages, Components, PeopleCode, etc. Double-clicking any object opens it in the Object Workspace.

**Object Workspace (center panel)**
The main editing area. Opens record definitions (showing field columns), page layouts (showing the drag-and-drop canvas), component definitions, and PeopleCode editors. Multiple objects can be open simultaneously as tabs.

**Output Window (bottom panel)**
Shows messages, errors, and results from operations like:
- Compile errors when saving PeopleCode
- Results from Find In / Find Object
- SQL Build logs (when creating/altering tables)
- Upgrade comparison results

**Definition Properties panel**
Context-sensitive properties for the currently selected object or field. Accessible via right-click on any object.

**Sign-on**
To open App Designer: Start → PeopleTools → Application Designer. At the sign-on dialog, enter:
- Database Name (for 2-tier) or Application Server Name (for 3-tier)
- User ID and Password (must have App Designer access in permission list)
- Connection Type (Oracle, SQL Server, DB2, etc. for 2-tier)`,
      },
      {
        title:"Projects — Organizing Your Work",
        body:`A Project in Application Designer is a container that groups related objects for development and migration. Every developer should work within a named project from day one.

**Creating a project:**
File → New → Project. Give it a meaningful name following your organization's naming convention (e.g., "HCM_CUSTOM_HIRE_2025").

**Adding objects to a project:**
- Right-click on any object in the Object Workspace → Insert Into Project
- Or drag objects from search results into the project tree
- Or use Insert → Current Object to add the currently open object

**Why projects matter — migration:**
When you finish development in DEV, you migrate your changes to QA and eventually PROD. You do this by migrating the Project. The project contains all the objects you changed, ensuring nothing is missed or left behind.

**Migration methods:**
- **Copy To Database**: Directly copies objects from one DB to another (requires network connection to both)
- **Export to File / Import from File**: Creates an export file (.PTP) that can be transported and imported
- **Change Package**: The modern approach using PeopleSoft Update Manager to package and apply changes

**Project naming best practices:**
- Include a ticket or change request number
- Include the date or release identifier
- Use uppercase with underscores
- Example: "CRP_CUSTOM_OB_2025Q1" for a customization related to onboarding in Q1 2025`,
      },
      {
        title:"Creating Objects in App Designer — The Workflow",
        body:`The typical development workflow in Application Designer follows a structured sequence. This is the same sequence Oracle uses to build PeopleSoft itself:

**Step 1: Define Fields**
Fields are defined globally — independent of any record. File → New → Field. Set the name, type (Character, Date, Number, etc.), and size. Because fields are global, the same field can be reused across hundreds of records. If you update the field's label, it updates everywhere.

**Step 2: Define Records**
File → New → Record. Add fields to the record by typing their names or searching. Set key properties for each field (Key, Search Key, List Box Item, etc.). Set the Record Type (SQL Table, SQL View, Derived/Work, etc.).

For SQL Table records, you must physically build the table: Build → Current Object → Create Table. This runs the DDL against the database.

**Step 3: Design Pages**
File → New → Page. Drag controls from the control palette onto the canvas. Bind each control to a Record.Field by double-clicking and setting the record/field properties. Set tab order, group boxes, and page properties.

**Step 4: Create Components**
File → New → Component. Add pages to the component in order. Set the Search Record and Add Search Record. Configure action modes (Add, Update, Correction, etc.). Add component-level PeopleCode if needed.

**Step 5: Register in Portal**
Navigate in the browser to PeopleTools → Portal → Structure and Content. Create a Content Reference pointing to the new component. Assign to permission lists so authorized users can navigate to it.

**Step 6: Write PeopleCode**
Open the record or component in App Designer. Click the PeopleCode toolbar icon (or View → PeopleCode) to open the PeopleCode editor. Select the event and write code.`,
        pbLink:{title:"Application Designer Developer's Guide — Creating Definitions", url:"https://docs.oracle.com/cd/F70250_01/psft/pdf/pt860tapd-b092022.pdf"},
      },
    ],
  },
  {
    id:"records-fields", module:3, num:"12",
    title:"Records & Fields",
    summary:"Records and Fields are the foundation of PeopleSoft's data model. Every page, every component, and every line of PeopleCode ultimately reads from or writes to a Record. Understanding their types, properties, and relationships is the most critical foundation skill.",
    preChecklist:["You've opened Application Designer (Topic 11)","You understand what metadata-driven development means","You know the difference between a database table and a view"],
    realWorld:"<strong>Global fields save hours:</strong> In a real enterprise PeopleSoft system, the field EMPLID exists in 400+ records. When the business asked to change the Employee ID label from 'Empl ID' to 'Employee ID' for accessibility compliance, it took one developer 5 minutes — change the field definition once, PeopleSoft propagated it to every page, search dialog, and grid automatically. In a traditional system this would have been weeks of work.",
    mistakes:[
      {title:"Defining fields directly on records instead of globally", desc:"Fields must be defined globally first (File → New → Field) and then added to records. If you define the same concept twice as separate fields on different records, changing the label later means updating every occurrence individually."},
      {title:"Forgetting effective dating WHERE clauses when querying PS_JOB", desc:"PS_JOB has one row per job action per employee. A single employee might have 20 rows in PS_JOB across their career. If you SELECT without effective dating WHERE clauses, you get all 20 rows — causing duplicate data and wrong results."},
      {title:"Using a SQL Table record where a Derived/Work record is appropriate", desc:"If a field is only needed for temporary calculation during a component session and never needs to be stored, use a Derived/Work record. Creating unnecessary database tables wastes space and causes confusion."},
    ],
    quiz:[
      {q:"What database table does the PeopleSoft record named 'JOB' create?",options:["JOB","PSJOB","PS_JOB","PS.JOB"],answer:2,explanation:"PeopleSoft prefixes all SQL Table database tables with PS_. The record named JOB in Application Designer creates the physical database table PS_JOB. This naming convention distinguishes PeopleSoft application tables from PeopleTools metadata tables."},
      {q:"Which record type should you use for fields that only exist in memory during a transaction and are never saved to the database?",options:["SQL Table","SQL View","Derived/Work","SubRecord"],answer:2,explanation:"Derived/Work records exist only in the component buffer during a transaction and never create a database object. They are used for computed values, push buttons, and temporary variables that are needed during processing but don't need to be stored."},
      {q:"A field named DEPTID is defined once globally. It is used in 500 records. If you change its label, what happens?",options:["You must update all 500 records manually","Only the first record is updated","The label change applies everywhere DEPTID is used automatically","You need to rebuild all 500 tables"],answer:1,explanation:"Because fields are defined globally in PeopleSoft, a label change to the field definition automatically applies everywhere that field is used — all 500 records, all pages, all search dialogs, and all reports. This is one of the key advantages of the global field definition approach."},
    ],
    keyPoints:[
      "7 record types: SQL Table, SQL View, Dynamic View, Derived/Work, SubRecord, Query View, Temp Table",
      "SQL Table records create physical database tables prefixed with PS_ (e.g., JOB → PS_JOB)",
      "Derived/Work records exist only in memory — never create a DB object",
      "Fields are defined globally — change the field definition once, it applies everywhere it's used",
      "Key fields define the primary key; Alternate Search Keys create additional DB indexes",
    ],
    sections:[
      {
        title:"The 7 Record Types",
        diagram:"recordtypes",
        uiIllustration:"recorddef",
        body:`Every Record in PeopleSoft has a type that determines how it behaves and whether it creates a database object:

**1. SQL Table**
The most common record type. Creates a physical database table named PS_<RECORDNAME> in the database. All application data lives here — PS_JOB, PS_PERSONAL_DATA, PS_DEPT_TBL. When you define a SQL Table record and run Build → Current Object → Create Table, PeopleSoft generates and executes the DDL to create the table.

**2. SQL View**
Creates a database view that joins data from one or more SQL Tables. Used for reporting, joining related data, and implementing row-level security. SQL Views are read-only — you can display data from a View but you cannot save to it directly.

**3. Dynamic View**
Similar to SQL View but the SQL is defined and resolved at runtime rather than being stored as a permanent database view. Used when the SQL needs to incorporate run-time information (like the current user's settings). Dynamic Views do not create any database object.

**4. Derived/Work Record**
Does NOT create any database object. Exists only in the component buffer during a transaction. Used for: computed/derived values shown on a page, push buttons that trigger PeopleCode, temporary values needed during processing, and Function Library programs. Fields in Derived/Work records never get saved to a table.

**5. SubRecord**
A reusable set of fields that can be embedded into other records. When you include a SubRecord in a record definition, PeopleSoft includes all of its fields in the parent record's table. SubRecords are used for common field groups — the most important example is EFFDT_SBR (containing EFFDT and EFFSEQ) which is included in hundreds of effective-dated records.

**6. Query View**
A record that is created and managed by PS Query. Primarily used when a PS Query result needs to be used as the source for another query.

**7. Temporary Table**
Used specifically by Application Engine for parallel batch processing. Multiple instances of a Temp Table can exist simultaneously in the database (e.g., MYTEMP_AET, MYTEMP_AET1, MYTEMP_AET2), allowing parallel AE processes to work on different data sets without interfering with each other.`,
        pbLink:{title:"Application Designer Developer's Guide — Records & Fields", url:"https://docs.oracle.com/cd/F70250_01/psft/pdf/pt860tapd-b092022.pdf"},
      },
      {
        title:"Field Types & Properties",
        body:`Fields in PeopleSoft are defined at the global level before being added to records. This is fundamentally different from traditional database design where you define columns within a table. In PeopleSoft, a field like EMPLID exists as a standalone definition that is then referenced by every record that needs it.

**Core Field Types:**

- **Character** — Variable-length text. Most common. Can be up to 32,767 characters. Stored as VARCHAR or CHAR in the database depending on size settings.
- **Long Character** — For large text blocks. Stored as CLOB (Character Large Object) in Oracle. Used for descriptions, notes, and text areas.
- **Number** — Integer or decimal. Define the number of integer digits and decimal places.
- **Signed Number** — Same as Number but allows negative values.
- **Date** — Stores a date. Internally stored as CHAR(10) in YYYY-MM-DD format in PeopleSoft's system tables, but the database stores it natively as a DATE type.
- **Time** — Stores a time of day (hours, minutes, seconds).
- **DateTime** — Combined date and time value.
- **Image** — Stores binary image data directly in the database.
- **ImageReference** — Stores a reference (path/URL) to an image file rather than the image itself.

**Why global field definitions matter:**
If a field named DEPTID has a label "Department" and a maximum length of 10, that is true everywhere DEPTID appears across all 500 records that use it. If Oracle releases an update changing the DEPTID label to "Department ID," that change automatically flows to all pages, all search dialogs, and all reports that use DEPTID — without any developer work.`,
      },
    ],
  },
  {
    id:"data-model", module:3, num:"13",
    title:"PeopleSoft Data Model Basics",
    summary:"PeopleSoft organizes data through a set of key structural concepts — Business Units, SetIDs, and TableSets — that allow a single PeopleSoft system to serve multiple organizations while sharing common setup data.",
    preChecklist:["You understand Records & Fields (Topic 12)","You know the difference between HCM and FSCM modules","You have a basic understanding of database tables and keys"],
    realWorld:"<strong>Real multi-national scenario:</strong> A global company runs one PeopleSoft system for 40 countries. All countries share the same Department and Job Code tables (SetID = SHARE) but each country has its own Regulatory Region, Pay Groups, and Tax tables (country-specific SetIDs). Without SetID architecture, they would need 40 separate systems or 40 copies of every reference table.",
    mistakes:[
      {title:"Forgetting BUSINESS_UNIT in WHERE clauses for FSCM tables", desc:"Most FSCM tables have BUSINESS_UNIT as part of the primary key. A SQL query without a Business Unit filter returns data mixed from all Business Units — often causing incorrect financial reports."},
      {title:"Confusing PS_ tables with PSREC* tables", desc:"PS_JOB is application data. PSRECDEFN is PeopleTools metadata. Beginners sometimes accidentally query or modify PeopleTools system tables, which can corrupt the environment."},
    ],
    quiz:[
      {q:"What is the purpose of a SetID in PeopleSoft?",options:["It identifies a specific employee","It controls which setup/reference tables apply to each Business Unit","It is the primary key for financial transactions","It identifies a specific server instance"],answer:1,explanation:"SetIDs allow multiple Business Units to share common reference data (like Department codes) while maintaining separate data for region-specific configurations. Multiple Business Units can point to the same SetID, meaning they share that reference data."},
      {q:"What prefix do all PeopleSoft application data tables use in the database?",options:["PS.","PST_","PS_","PSAPP_"],answer:2,explanation:"Every PeopleSoft application data table is prefixed with PS_. The record JOB becomes PS_JOB, PERSONAL_DATA becomes PS_PERSONAL_DATA. This distinguishes application tables from PeopleTools metadata tables (PSRECDEFN, PSDBFIELD, etc.)."},
    ],
    keyPoints:[
      "Business Unit = the primary organizing unit for transactions (company, division, institution)",
      "SetID = controls which setup/reference tables apply to each Business Unit via TableSets",
      "TableSet sharing allows multiple Business Units to share the same department or job code tables",
      "Installation Table = the global configuration table for the entire PeopleSoft system",
      "PS_ prefix = every application table · PSREC* / PSDBFIELD = PeopleTools metadata tables",
    ],
    sections:[
      {
        title:"Business Units — The Core Organizing Concept",
        body:`A Business Unit is the fundamental organizational entity in PeopleSoft — particularly in FSCM (Finance). Every financial transaction is associated with a Business Unit. It represents a distinct part of an organization that maintains its own set of financial books.

Examples of Business Units:
- A holding company might have Business Units for each subsidiary
- A university might have Business Units for different campuses
- A government agency might have Business Units for different departments with separate budgets

Business Units in HCM and FSCM serve slightly different purposes:

**HCM Business Unit (HR Business Unit):**
Groups employees for HR processing purposes. Pay groups, benefit programs, and regulatory compliance are configured at the Business Unit level.

**FSCM Business Unit (GL Business Unit / AP Business Unit / etc.):**
Each FSCM module has its own set of Business Units. The GL Business Unit is the core financial entity. AP, AR, and other modules have Business Units that must be linked to a GL Business Unit.

**Why this matters for developers:**
Many PeopleSoft tables have BUSINESS_UNIT as part of their primary key. When writing SQL or PeopleCode that queries financial tables, you must always include the Business Unit in your WHERE clause — otherwise you'll get data from all Business Units mixed together.`,
      },
      {
        title:"SetIDs & TableSet Sharing",
        body:`SetIDs are one of the most misunderstood PeopleSoft concepts for beginners. They solve a very specific problem: how do you let multiple Business Units share common reference data while still allowing each to have its own unique reference data when needed?

**The problem SetIDs solve:**
Imagine a company with 10 Business Units spread across 3 countries. They share the same Department codes and Job Codes, but each country has different Regulatory Regions and Pay Groups. Without SetIDs, you would either:
- Duplicate all reference data for each Business Unit (wasteful, maintenance nightmare)
- Force all Business Units to share all reference data (inflexible, can't accommodate differences)

**How SetIDs work:**
SetIDs are codes assigned to setup tables. Instead of reading "Department 10000 for Business Unit USA001," PeopleSoft reads "Department 10000 for SetID SHARE." Multiple Business Units can point to the same SetID, meaning they share that reference data.

**TableSet Controls:**
The link between Business Units and SetIDs is defined in TableSet Controls (PS_SET_CNTRL_TBL). For each Business Unit, you define which SetID to use for each record group. This allows:
- Business Unit USA001 → Uses SetID SHARE for Department codes, SetID USA for Regulatory data
- Business Unit GBR001 → Uses SetID SHARE for Department codes, SetID GBR for Regulatory data

Both US and UK Business Units share the same Department structure but maintain separate regulatory configurations.`,
      },
      {
        title:"PeopleSoft Database Structure",
        body:`Understanding how PeopleSoft's database is organized helps you navigate it and write efficient queries.

**Application Tables (PS_ prefix)**
Every application data table in PeopleSoft starts with PS_. When you define a SQL Table record named JOB, the physical database table is PS_JOB. This prefix distinguishes PeopleSoft application tables from the database's own system tables.

**PeopleTools Metadata Tables (PSREC*, PSDBFIELD, PSPNLFIELD, etc.)**
PeopleTools stores its metadata — the definitions of all records, fields, pages, components, PeopleCode programs — in database tables that start with PS (no underscore) or PSTOOLS. Examples:
- PSRECDEFN — record definitions
- PSDBFIELD — field definitions
- PSPNLDEFN — page definitions
- PSPCMPROG — PeopleCode programs
- PSPRCSRQST — Process Request table (all batch job requests)

**System Tables (PSSTATUS, PSDBOWNER, etc.)**
Installation-level information and database ownership tables.

**The Installation Table:**
PSOPTIONS and PS_INSTALLATION contain system-wide configuration settings: the PeopleTools version, enabled modules, base currency, default language, and many global settings. Developers and administrators frequently reference these tables.

**A practical tip:**
When you see a table name in PeopleSoft that starts with PS_ and is in ALL CAPS with underscores, it's an application data table. When you see PSREC*, PSPNL*, or PSPC*, you're looking at PeopleTools metadata. Learning to distinguish these quickly helps you understand whether you're looking at business data or system configuration.`,
      },
    ],
  },
  {
    id:"effdt", module:3, num:"14",
    title:"Effective Dating (EFFDT & EFFSEQ)",
    summary:"Effective Dating is one of PeopleSoft's most distinctive and powerful concepts. Instead of overwriting data when something changes, PeopleSoft inserts a new row with a new Effective Date — preserving complete history.",
    preChecklist:["You understand Records & Fields (Topic 12)","You know what a primary key is in a database","You understand basic SQL SELECT statements"],
    realWorld:"<strong>Payroll depends on this:</strong> In a payroll system with 100,000 employees, retroactive pay corrections happen daily. An employee's salary was entered incorrectly in January — payroll needs to recalculate 3 months of paychecks. This is only possible because PS_JOB preserved the historical rows with EFFDT. Without effective dating, the old salary is gone and retroactive correction is impossible.",
    mistakes:[
      {title:"Querying PS_JOB without effective dating WHERE clause", desc:"PS_JOB has one row per job action per employee. An employee with 10 years of history might have 30+ rows. SELECT without EFFDT criteria returns all rows — causing duplicates in reports and wrong calculations."},
      {title:"Using today's date as EFFDT for corrections that should be backdated", desc:"If an employee's department change should be effective from last month, entering today's date as EFFDT is wrong. Future reports for last month will show the wrong department."},
      {title:"Forgetting EFFSEQ when two changes occur on the same date", desc:"If two job actions happen on the same date (e.g., promotion AND department transfer both on July 1st), EFFSEQ distinguishes them. Forgetting EFFSEQ in SQL gives you only the first change."},
    ],
    quiz:[
      {q:"An employee gets promoted on July 1st. What does PeopleSoft do to the PS_JOB record?",options:["Updates the existing row with the new job code","Deletes the old row and creates a new one","Inserts a new row with EFFDT = July 1st, keeping the old row","Archives the old row to a history table"],answer:2,explanation:"PeopleSoft never overwrites or deletes effective-dated rows. It inserts a new row with the new Effective Date. The old row remains permanently, preserving the complete history of every job change."},
      {q:"An employee has two job changes on the same date: a promotion (entered first) and a department transfer (entered second). What EFFSEQ values do they get?",options:["Both get EFFSEQ = 0","Promotion gets EFFSEQ = 0, Transfer gets EFFSEQ = 1","Transfer gets EFFSEQ = 0, Promotion gets EFFSEQ = 1","They cannot both have the same EFFDT"],answer:1,explanation:"EFFSEQ handles multiple changes on the same Effective Date. The first change gets EFFSEQ = 0, the second gets EFFSEQ = 1. The most current row for a given date is the one with the highest EFFSEQ."},
      {q:"What SQL pattern does PeopleSoft use to retrieve the 'current' effective-dated row?",options:["WHERE EFFDT = TODAY","WHERE EFFDT = MAX(EFFDT) AND EFFSEQ = MAX(EFFSEQ)","WHERE EFFDT = (SELECT MAX(EFFDT) FROM ... WHERE EFFDT <= CURRENT_DATE)","WHERE CURRENT_ROW = 'Y'"],answer:2,explanation:"PeopleSoft uses a subquery pattern: the max EFFDT on or before today, then the max EFFSEQ for that date. This guarantees the most recent row is returned without returning future-dated rows."},
    ],
    keyPoints:[
      "EFFDT (Effective Date) — the date from which a row is valid",
      "EFFSEQ (Effective Sequence) — handles multiple changes on the same date, sequenced 0,1,2...",
      "PeopleSoft always shows the 'current' row: max EFFDT where EFFDT <= today",
      "Future-dated rows can be entered today and activate automatically on the specified date",
      "Historical rows are never deleted — this enables retrospective reporting and retroactive payroll",
    ],
    sections:[
      {
        title:"The Problem Effective Dating Solves",
        body:`Consider a simple employee salary record. In a traditional database, when an employee gets a raise, you update their salary record. The old salary is gone. You now have no record of what they earned before the raise. If auditors ask what the employee earned in Q1, you cannot answer.

PeopleSoft solves this with Effective Dating. Instead of UPDATE, it does INSERT. Every change creates a new row with a new date. The old row remains permanently.

**A real example with PS_JOB:**
An employee is hired on January 1st as a Software Engineer with a salary of $80,000. On July 1st, they are promoted to Senior Software Engineer with a salary of $95,000.

In the PS_JOB table, you would see:

\`EMPLID   EFFDT       ACTION   JOBCODE   COMPRATE
E12345   2025-01-01  HIR      SWENG     80000.000
E12345   2025-07-01  PRO      SRSWENG   95000.000\`

Both rows exist. The January row is not overwritten. PeopleSoft shows the July row as "current" because it has the latest EFFDT that is on or before today's date.

If you run a headcount report for March 2025, PeopleSoft uses the January row — correctly reporting the employee as a Software Engineer at $80,000.`,
      },
      {
        title:"How PeopleSoft Selects the Current Row",
        body:`PeopleSoft uses a specific SQL pattern to retrieve the "current" effective-dated row. This pattern is fundamental and appears in hundreds of delivered queries and components.

**Standard effective dating WHERE clause:**
\`SELECT *
FROM PS_JOB A
WHERE A.EMPLID = :1
AND A.EMPL_RCD = :2
AND A.EFFDT = (
    SELECT MAX(B.EFFDT)
    FROM PS_JOB B
    WHERE B.EMPLID = A.EMPLID
    AND B.EMPL_RCD = A.EMPL_RCD
    AND B.EFFDT <= %CurrentDateIn
)
AND A.EFFSEQ = (
    SELECT MAX(C.EFFSEQ)
    FROM PS_JOB C
    WHERE C.EMPLID = A.EMPLID
    AND C.EMPL_RCD = A.EMPL_RCD
    AND C.EFFDT = A.EFFDT
)\`

This subquery pattern — "max EFFDT on or before today, then max EFFSEQ for that date" — is the universal PeopleSoft effective dating pattern.

**EFFSEQ (Effective Sequence):**
What happens if someone gets two changes on the same date? For example, a pay rate change AND a department transfer both effective July 1st? EFFSEQ handles this. The first change gets EFFSEQ=0, the second gets EFFSEQ=1. The most current row for a given date is the one with the highest EFFSEQ.`,
        pbLink:{title:"PeopleSoft HCM: Understanding Effective Dates — PeopleBooks", url:"https://docs.oracle.com/cd/E17566_01/epm91pbr0/eng/psbooks/hrms/chapter.htm?File=hrms/htm/a_bs24ef.htm"},
      },
      {
        title:"Future Dating & Historical Corrections",
        body:`**Future Dating**
PeopleSoft allows you to enter a row with a future effective date today. The row exists in the database right now but does not become "current" until its EFFDT is reached.

Example: An employee's pay raise is approved today but effective on the first of next month. Enter it today with next month's date. Payroll processing will automatically use the new rate starting next month.

This is extremely valuable for HR planning — you can enter an entire organizational restructuring in advance and it automatically activates on the planned date.

**Viewing Historical Data**
PeopleSoft components typically have an "Include History" toggle that shows all historical rows, not just the current one. In Job Data, enabling history shows every job action the employee ever had, in chronological order.

**Correction Mode**
PeopleSoft's Correction action mode allows authorized users to go back and change historical rows — for example, correcting a salary that was entered incorrectly for a past period. This is tightly controlled by security because retroactive changes can trigger payroll recalculations.

**Why this matters for developers:**
Any custom SQL or PeopleCode that queries effective-dated tables MUST include the effective dating WHERE clause. Forgetting it returns ALL rows for an employee — including historical ones — leading to duplicate data and incorrect results. This is one of the most common mistakes in custom PeopleSoft development.`,
      },
    ],
  },
  /* ── MODULE 5 ── */
  {
    id:"peoplecode", module:4, num:"15",
    title:"PeopleCode Basics",
    summary:"PeopleCode is PeopleSoft's proprietary event-driven programming language. It runs server-side within the Tuxedo App Server and is how all business logic, validations, defaults, and dynamic UI behavior is implemented.",
    preChecklist:["You understand the Component Processor and its event model (Topic 05)","You know what Records, Fields, and Components are (Topics 12, 09)","You have some programming experience in any language — PeopleCode is beginner-friendly"],
    realWorld:"<strong>The N+1 query problem in production:</strong> A client had a grid showing 500 employee records. A developer had written SQLExec in RowInit to look up the department name for each row. Result: 500 separate SQL calls every time the page loaded — 45 seconds load time. Moving the SQLExec to PostBuild with a single lookup reduced it to under 2 seconds. This is the most common performance fix on real PeopleSoft projects.",
    mistakes:[
      {title:"Putting SQLExec in RowInit", desc:"RowInit fires for every row in every grid. If a grid has 100 rows, SQLExec in RowInit executes 100 times. This is the #1 performance anti-pattern in PeopleSoft development. Pre-fetch in PostBuild or use a view join instead."},
      {title:"Using Global scope when Local is sufficient", desc:"Global variables persist for the entire session and can be accidentally read by other components. Always use Local scope unless you specifically need the value to persist across components."},
      {title:"Putting validation in FieldChange instead of SaveEdit", desc:"FieldChange fires when a user changes a field. If validation logic is in FieldChange, it fires repeatedly as the user types. Business rule validation belongs in SaveEdit, which fires once during the save process."},
      {title:"Not checking for None() before using a SQLExec result", desc:"If SQLExec finds no rows, output variables are set to empty string or zero. Using an empty string without checking None() first can cause incorrect defaults or silent failures."},
    ],
    quiz:[
      {q:"Which PeopleCode event fires ONCE after the entire component is fully loaded — ideal for show/hide logic?",options:["RowInit","FieldDefault","PostBuild","SearchInit"],answer:2,explanation:"PostBuild fires once after the entire component is fully built — after all RowInit and FieldDefault events have run for every row. It is the ideal location for show/hide logic and page configuration that depends on the fully loaded component state."},
      {q:"What is the correct PeopleCode scope to use for a variable that should persist across multiple events within the same component transaction?",options:["Local","Component","Global","Session"],answer:1,explanation:"Component scope variables persist for the entire component transaction — from when the user opens the component to when they save or cancel. Use Component scope when you need to share a value between multiple events (e.g., set a flag in PostBuild, check it in SaveEdit)."},
      {q:"Which function should you use when you need to iterate through multiple rows returned by a SQL query?",options:["SQLExec","FetchSQL","CreateSQL with a While loop","GetSQL"],answer:2,explanation:"CreateSQL returns a SQL object that you use in a While loop with the .Fetch() method to process each row. SQLExec is for single-row results only. CreateSQL is the correct approach for multi-row iteration."},
    ],
    keyPoints:[
      "PeopleCode is always attached to an event on a specific object — never standalone",
      "Three variable scopes: Local (current program only), Component (entire transaction), Global (full session)",
      "SQLExec = single-row SQL result · CreateSQL = multi-row loop iteration",
      "RowInit fires for EVERY row loaded — avoid heavy SQL here (N+1 problem)",
      "SaveEdit is the standard event for final business rule validation before save",
    ],
    sections:[
      {
        title:"PeopleCode Language Fundamentals",
        body:`PeopleCode is a strongly typed, case-insensitive scripting language that resembles a hybrid of Java and Basic. All PeopleCode runs server-side within the Tuxedo Application Server — never in the browser.

**Variable declaration and types:**
\`/* All variables must be declared */
Local String &emplId;
Local Number &salary;
Local Date &hireDate;
Local Boolean &isActive;
Local Record &recJob;
Local Rowset &rsJob;
Local Array of String &deptList;\`

**Assignment and basic operations:**
\`&emplId = "E12345";
&salary = 75000;
&hireDate = %Date;  /* %Date = today's date */
&isActive = True;\`

**Conditional logic:**
\`If &salary > 50000 Then
   &grade = "Senior";
Else
   &grade = "Junior";
End-If;\`

**Loops:**
\`For &i = 1 To &rsJob.ActiveRowCount
   &row = &rsJob.GetRow(&i);
   /* process each row */
End-For;

While &condition
   /* loop body */
End-While;\`

**Key language rules:**
- Variables are prefixed with & (ampersand)
- No semicolons required but best practice to include them
- Comments: /* comment */ for inline, /* on its own line for block comments
- NOT case-sensitive for keywords (IF = If = if)
- String concatenation uses the | operator: "Hello" | " " | "World"`,
        pbLink:{title:"PeopleCode Language Structure — PeopleCode Developer's Guide", url:"https://docs.oracle.com/cd/F28299_01/pt857pbr3/eng/pt/tpcd/concept_PeopleCodeOverview-074b56.html"},
      },
      {
        title:"Variable Scopes — Local, Component, Global",
        body:`The scope of a variable determines how long it lives and which PeopleCode programs can access it. Choosing the wrong scope is one of the most common beginner mistakes.

**Local Scope**
\`Local String &myVar;\`
Exists only for the duration of the current PeopleCode program execution. Once the event ends (e.g., FieldChange completes), the variable is destroyed. This is the safest scope and should be the default choice for most variables.

**Component Scope**
\`Component String &myCompVar;\`
Persists for the entire component transaction — from when the user opens the component to when they save or cancel. Any PeopleCode program within the same component can read and write Component variables.

Use Component scope when you need to pass values between different events in the same transaction. Example: Set a flag in PostBuild (Component &isNewHire = True) and check it later in SaveEdit to apply special validation rules.

**Global Scope**
\`Global String &myGlobalVar;\`
Persists for the entire PeopleSoft session until the user logs out. Any component in the entire session can access Global variables.

Use very sparingly. Global variables can cause subtle bugs when Component B unexpectedly reads a value set by Component A. Appropriate for truly session-wide data like user preferences loaded at sign-on.

**Scope comparison:**
\`/* In PostBuild */
Local String &localVar;      /* dies when PostBuild ends */
Component String &compVar;   /* lives until save/cancel */
Global String &globalVar;    /* lives until logout */\``,
      },
      {
        title:"PeopleCode Events — The Complete Event Flow",
        diagram:"eventflow",
        body:`PeopleCode is always attached to a specific event on a specific object. The event determines when the code runs. Understanding the full event lifecycle is THE most important concept in PeopleSoft development.

**Component Load Sequence (when user opens a page):**
1. SearchInit — fires before the search dialog opens (hide/show search fields)
2. SearchSave — fires when user submits search criteria
3. RowInit — fires for EVERY row loaded into the buffer (all scroll levels)
4. FieldDefault — sets default values for fields that have no value
5. FieldFormula — computes derived field values
6. PostBuild — fires ONCE after the entire component is fully loaded ← most common location for show/hide logic

**During user interaction:**
7. Activate — fires each time a specific page tab is activated
8. FieldEdit — fires when a field loses focus; return False to show error and prevent navigation
9. FieldChange — fires when a user changes a field value ← most common for dynamic field updates

**Component Save Sequence (when user clicks Save):**
10. SaveEdit — final validation before save; Error or Warning stops the save ← go-to for business rules
11. SavePreChange — fires just before SQL writes to DB; all buffer manipulation done here
12. Workflow — fires workflow triggers
13. SavePostChange — fires AFTER data is committed to DB; use for downstream updates, notifications

**Row operations:**
- RowInsert — when user adds a new row to a grid
- RowDelete — when user deletes a row from a grid
- RowSelect — during the SELECT that loads data; can filter rows using DiscardRow()`,
        pbLink:{title:"PeopleCode Events — PeopleCode Developer's Guide", url:"https://docs.oracle.com/cd/F28299_01/pt857pbr3/eng/pt/tpcd/task_PeopleCodeEvents-074aba.html"},
      },
      {
        title:"Working with Fields and Records",
        body:`The most fundamental PeopleCode operation is reading from and writing to fields in the Component Buffer.

**Direct dot notation — most common approach:**
\`/* Read a field value */
Local String &dept;
&dept = JOB.DEPTID.Value;

/* Write a field value */
JOB.DEPTID.Value = "HR001";

/* Check if field is empty */
If None(JOB.EMPLID.Value) Then
   Error "Employee ID is required.";
End-If;

/* Gray out a field (prevent editing) */
JOB.SALARY.Enabled = False;

/* Hide a field completely */
JOB.BONUS_AMT.Visible = False;

/* Set a field to read-only display */
JOB.HIRE_DT.DisplayOnly = True;\`

**Using GetRecord to work with records as objects:**
\`Local Record &recJob;
&recJob = GetRecord(Record.JOB);

/* Access fields on the record object */
&recJob.DEPTID.Value = "FIN001";
&recJob.JOBCODE.Value = "ANALYST";\`

**System variables you use constantly:**
\`%EmployeeId   /* current user's Employee ID */
%OperatorId    /* current user's Operator ID (User ID) */
%Date          /* today's date */
%DateTime      /* current date and time */
%Mode          /* component mode: A=Add, U=Update, etc. */
%Component     /* name of current component */
%Page          /* name of current page */\``,
      },
      {
        title:"SQL in PeopleCode — SQLExec and CreateSQL",
        body:`PeopleCode frequently needs to retrieve data from the database that is not already in the Component Buffer. Two built-in functions handle this: SQLExec (single row) and CreateSQL (multiple rows).

**SQLExec — for single-row results:**
\`/* Basic form: SQL, bind values, output variables */
Local String &deptName;
SQLExec("SELECT DESCR FROM PS_DEPT_TBL WHERE DEPTID = :1
         AND EFFDT = (SELECT MAX(EFFDT) FROM PS_DEPT_TBL
                      WHERE DEPTID = :1
                      AND EFFDT <= %CurrentDateIn)",
         JOB.DEPTID.Value,   /* bind :1 */
         &deptName);          /* receives first column */

/* If no row found, &deptName is empty string */
If None(&deptName) Then
   Warning "Department not found.";
End-If;\`

**CreateSQL — for multi-row results:**
\`Local SQL &sql;
Local String &empId, &name;

&sql = CreateSQL("SELECT EMPLID, NAME FROM PS_NAMES_VW
                  WHERE DEPTID = :1
                  ORDER BY NAME",
                  JOB.DEPTID.Value);

While &sql.Fetch(&empId, &name)
   /* process each row */
   WinMessage(&empId | ": " | &name);
End-While;
&sql.Close();\`

**Using %Table and %CurrentDateIn Meta-SQL:**
\`/* %Table() = resolves to PS_<recordname> */
SQLExec("SELECT DESCR FROM %Table(DEPT_TBL)
         WHERE DEPTID = :1
         AND EFFDT <= %CurrentDateIn",
         &deptId, &descr);\`

**Performance rule:** SQLExec in RowInit is dangerous. If your component loads 200 rows, RowInit fires 200 times — meaning 200 separate SQL calls. Pre-fetch data in PostBuild or use a View to join the data instead.`,
      },
      {
        title:"Real Scenarios & Sample Code",
        body:`Here are practical PeopleCode patterns you will use on real projects:

**Scenario 1: Validate that salary is within the pay grade range (SaveEdit)**
\`Local Number &minRate, &maxRate;

SQLExec("SELECT MIN_RT, MAX_RT FROM PS_SAL_GRADE_TBL
         WHERE SETID = :1 AND SAL_ADMIN_PLAN = :2
         AND GRADE = :3 AND CURRENCY_CD = :4
         AND EFFDT = (SELECT MAX(EFFDT) FROM PS_SAL_GRADE_TBL
                       WHERE SETID = :1 AND SAL_ADMIN_PLAN = :2
                       AND GRADE = :3 AND CURRENCY_CD = :4
                       AND EFFDT <= %CurrentDateIn)",
         JOB.SETID.Value, JOB.SAL_ADMIN_PLAN.Value,
         JOB.GRADE.Value, JOB.CURRENCY_CD.Value,
         &minRate, &maxRate);

If JOB.COMPRATE.Value < &minRate Or
   JOB.COMPRATE.Value > &maxRate Then
   Error "Salary " | JOB.COMPRATE.Value |
         " is outside the grade range (" |
         &minRate | " - " | &maxRate | ")";
End-If;\`

**Scenario 2: Default Department from Position (FieldChange on POSITION_NBR)**
\`/* When user enters a position number, auto-fill the department */
Local String &deptId;
SQLExec("SELECT DEPTID FROM PS_POSITION_DATA
         WHERE POSITION_NBR = :1
         AND EFFDT = (SELECT MAX(EFFDT) FROM PS_POSITION_DATA
                       WHERE POSITION_NBR = :1
                       AND EFFDT <= %CurrentDateIn)",
         JOB.POSITION_NBR.Value, &deptId);

If Not None(&deptId) Then
   JOB.DEPTID.Value = &deptId;
End-If;\`

**Scenario 3: Show/hide a field based on Mode (PostBuild)**
\`/* In Add mode — show the Hire Date field */
/* In Update mode — gray it out */
If %Mode = "A" Then
   JOB.HIRE_DT.Visible = True;
   JOB.HIRE_DT.Enabled = True;
Else
   JOB.HIRE_DT.DisplayOnly = True;
End-If;\``,
      },
    ],
  },
  {
    id:"buffer", module:4, num:"16",
    title:"Component Buffer Basics",
    summary:"The Component Buffer is the in-memory data structure that holds all data for the currently active component transaction. Understanding how the buffer is organized, how data flows in and out, and how Rowsets work is fundamental to PeopleCode development.",
    preChecklist:["You understand PeopleCode basics and events (Topic 15)","You know what Records, Fields, and Components are","You understand the Component Processor lifecycle"],
    realWorld:"<strong>Buffer vs Database — a critical distinction:</strong> A common support issue: 'I updated the field in PeopleCode but it shows the old value in the database.' The developer wrote to the buffer but the user navigated away without saving. PeopleCode writes to the buffer — only the Save action writes to the database. Understanding this distinction eliminates a whole class of debugging confusion.",
    mistakes:[
      {title:"Confusing buffer writes with database writes", desc:"Setting JOB.DEPTID.Value = 'HR001' in PeopleCode writes to the in-memory buffer, not the database. The database only updates when the Component Processor executes SavePreChange and commits the transaction."},
      {title:"Using GetRowset() at Level 0 when you need Level 1 data", desc:"GetRowset() with no arguments returns the Level 0 rowset (1 row). To access grid/scroll data, you need GetRowset(Scroll.RECORDNAME). Beginners often loop over Level 0 and wonder why they only get one row."},
      {title:"Not calling &sql.Close() after CreateSQL", desc:"Forgetting to close a SQL cursor created with CreateSQL leaves a database connection open. In components with repeated calls (like RowInit), this can exhaust the connection pool."},
    ],
    quiz:[
      {q:"When does PeopleCode write data from the Component Buffer to the actual database?",options:["When any field value is changed","Every 30 seconds automatically","When the Component Processor executes SavePreChange during the Save operation","When the user navigates between tabs"],answer:2,explanation:"PeopleCode writes to the in-memory Component Buffer, not the database directly. The database only gets updated when the Component Processor executes SavePreChange — during the Save sequence. Until then, all changes exist only in memory."},
      {q:"How do you get the Level 1 rowset (the first grid/scroll) in PeopleCode?",options:["GetRowset()","GetRowset(Scroll.RECORDNAME)","GetLevel1Rowset()","GetBuffer(1)"],answer:1,explanation:"GetRowset(Scroll.RECORDNAME) returns the Level 1 rowset for the named scroll/grid. GetRowset() with no arguments returns the Level 0 rowset (the primary record, always 1 row). You must specify the scroll name to get child rows."},
      {q:"What property of a Rowset tells you how many active (non-deleted) rows it contains?",options:["RowCount","TotalRows","ActiveRowCount","Length"],answer:2,explanation:"ActiveRowCount returns the number of active rows in a Rowset, excluding rows that have been marked for deletion. RowCount includes deleted rows. Always use ActiveRowCount when iterating to avoid processing rows that will be deleted on Save."},
    ],
    keyPoints:[
      "Component Buffer = memory area storing ALL data for the current open component",
      "Buffer is organized hierarchically: Level 0 (primary record) → Level 1 (child rows) → Level 2+",
      "Data loads into buffer when component opens · writes to DB only on Save",
      "Rowset class = a collection of Rows · Row class = one row containing Record objects",
      "GetRowset(), GetRow(), GetRecord(), ActiveRowCount are the core buffer navigation methods",
    ],
    sections:[
      {
        title:"What is the Component Buffer?",
        body:`The Component Buffer is a memory-based data structure managed by the Component Processor within the Tuxedo App Server. When a user opens a PeopleSoft component, the Component Processor executes SQL statements to fetch all related data from the database and loads it into the Component Buffer.

From that point on, everything the user sees and everything PeopleCode reads is coming from the buffer — not directly from the database. PeopleCode that sets JOB.DEPTID.Value is writing to the buffer, not the database. The buffer only writes to the database when the user clicks Save.

**Why this matters:**
This means that multiple field changes a user makes during a session are all temporary until Save. If a user changes 5 fields and then navigates away without saving, none of those changes persist. The Component Processor enforces atomicity — all changes succeed together or none of them do.

**Buffer vs. Database:**
When you write \`JOB.DEPTID.Value = "HR001"\` in a FieldChange event, you are modifying the in-memory buffer. The PS_JOB table in the database still has the old value. Only when SavePreChange fires does the Component Processor generate and execute the UPDATE (or INSERT for effective-dated records) SQL statement.`,
      },
      {
        title:"Buffer Hierarchy — Scroll Levels",
        diagram:"bufferlevels",
        body:`The Component Buffer is organized in a hierarchical structure that mirrors the scroll levels on the page:

**Level 0 — The Primary Record**
Every component has exactly one Level 0 record. This is the "parent" record — for example, PERSONAL_DATA for the Personal Information component or JOB for Job Data. Level 0 always has exactly one row.

**Level 1 — Child Rows (First Scroll)**
Child records attached to Level 0 through a common key. A Grid or Scroll Area on the page corresponds to Level 1. There can be many rows. For example, in the Job Data component, the JOB record is actually at Level 1 (multiple effective-dated job rows) while EMPLOYMENT is Level 0.

**Level 2+ — Grandchild Rows**
Scrolls within scrolls — grids within grids. These are less common but exist in complex components like payroll or benefit enrollment.

**PeopleCode to navigate the buffer:**
\`/* Get Level 0 rowset */
Local Rowset &rsLevel0;
&rsLevel0 = GetRowset();  /* returns Level 0 rowset */

/* Get Level 1 rowset (by scroll name) */
Local Rowset &rsJob;
&rsJob = GetRowset(Scroll.JOB);

/* Get a specific row */
Local Row &row;
&row = &rsJob.GetRow(1);  /* first row */

/* Get a record from the row */
Local Record &recJob;
&recJob = &row.GetRecord(Record.JOB);

/* Access a field on the record */
Local String &dept;
&dept = &recJob.DEPTID.Value;\``,
      },
      {
        title:"Rowset, Row, Record & Field — The Four Buffer Classes",
        body:`PeopleSoft's buffer has four interrelated object classes. Understanding all four is necessary to work with multi-row data.

**Rowset Class**
A collection of Row objects. Think of it as a table or grid with multiple rows.
Key properties and methods:
- ActiveRowCount — number of data rows (excludes deleted rows)
- RowCount — total rows including deleted
- GetRow(n) — returns the nth Row object
- InsertRow(n) — inserts a new row after position n
- DeleteRow(n) — marks a row for deletion
- Flush() — clears all rows from the rowset

**Row Class**
Represents one row within a Rowset. Contains one or more Record objects.
Key methods:
- GetRecord(Record.RECORDNAME) — returns the Record object
- IsDeleted — True if row is marked for deletion
- ChildCount — number of child rowsets
- GetRowset(Scroll.RECORDNAME) — gets child rowset

**Record Class**
Represents all fields of a single record definition within a row.
Key methods and properties:
- GetField(Field.FIELDNAME) — returns the Field object
- FIELDNAME.Value — direct field access (shortcut for GetField)
- CopyFieldsByName(targetRecord) — copies matching field values to another record
- ExecuteEdits() — runs field edits programmatically

**Field Class**
Represents an individual field within a record.
Key properties:
- Value — the actual data value (read/write)
- Enabled — controls whether the field is editable
- Visible — controls whether the field is displayed
- DisplayOnly — shows value but prevents editing
- Label — the text label shown next to the field
- Style — CSS class applied to the field

\`/* Complete example: iterate Level 1 rows */
Local Rowset &rsJob;
Local Row &row;
Local Record &recJob;
Local Integer &i;

&rsJob = GetRowset(Scroll.JOB);

For &i = 1 To &rsJob.ActiveRowCount
   &row = &rsJob.GetRow(&i);
   &recJob = &row.GetRecord(Record.JOB);

   /* Now work with the record */
   If &recJob.EMPL_STATUS.Value = "T" Then
      &recJob.DEPTID.Enabled = False;
   End-If;
End-For;\``,
        pbLink:{title:"PeopleCode API Reference — Rowset, Row, Record & Field Classes", url:"https://docs.oracle.com/cd/F28299_01/pt857pbr3/eng/pt/tpcr/concept_PeopleCodeBuiltInFunctionsAndLanguageConstructs-074b50.html"},
      },
    ],
  },
  /* ── MODULE 6 ── */
  {
    id:"ps-query", module:5, num:"17",
    title:"PS Query Fundamentals",
    summary:"PS Query is PeopleSoft's built-in ad-hoc reporting tool. It allows users to build SQL-based queries using a visual interface — no SQL knowledge required.",
    preChecklist:["You understand what Records and Fields are (Topic 12)","You know how PeopleSoft security works at a basic level (Topic 20)","You've navigated PeopleSoft and seen reports or data listings"],
    realWorld:"<strong>PS Query misuse is common:</strong> A poorly written PS Query joining PS_JOB to PS_PERSONAL_DATA without effective dating criteria ran for 45 minutes and brought the DEV database to a crawl. On a system with 200,000 employees and 15 years of history, PS_JOB alone can have 3 million rows. Every query against large tables must include key field criteria and effective date filters.",
    mistakes:[
      {title:"Joining tables in PS Query without effective dating criteria", desc:"PS_JOB, PS_DEPT_TBL, and most HCM tables have multiple rows per key due to effective dating. Without EFFDT criteria in your PS Query joins, you get a Cartesian explosion — one result row per historical row per join."},
      {title:"Using Public Query for sensitive data", desc:"Public Queries are accessible to all users with Query access. Never create a Public Query that returns salary, SSN, or other sensitive data unless row-level security on the underlying tables restricts the results appropriately."},
      {title:"Not checking the SQL tab before running a large query", desc:"Always click the SQL tab to review the generated SQL before running. A query that looks simple in the visual builder might generate an inefficient SQL statement with missing indexes."},
    ],
    quiz:[
      {q:"What type of PS Query is accessible to all users who have Query access in their Permission List?",options:["User Query","Role Query","Public Query","Admin Query"],answer:2,explanation:"Public Queries are accessible to all users with Query access granted in their Permission List. User Queries are private (creator only). Role Queries are shared with users who have a specific Role assigned."},
      {q:"What does a 'Prompt' do in a PS Query?",options:["Opens a new browser window","Makes the query run faster","Creates a parameter that users enter at runtime, making the query reusable","Sends an email when the query runs"],answer:2,explanation:"Prompts make PS Queries dynamic. Instead of hardcoding a value in a criterion, you define a Prompt — the user enters the value each time they run the query. This lets one query serve many use cases (e.g., run for any department, any date range)."},
    ],
    keyPoints:[
      "PS Query generates SQL — always check the SQL tab to understand what it produces",
      "Three query types: User (private), Role (shared with a role), Public (all users)",
      "Prompts make queries dynamic — users enter criteria values at run time",
      "PS Query respects row-level security automatically when run online",
      "Connected Queries link a parent and child query for master-detail reports",
    ],
    sections:[
      {
        title:"Building a PS Query — Step by Step",
        body:`PS Query is accessed via Reporting Tools → Query → Query Manager in the PeopleSoft menu.

**Step 1 — Select Records (the base tables)**
Click "Add Record" and search for the PeopleSoft records (tables) you need. PS Query shows a list of all accessible records. Add the primary record first (e.g., PS_JOB for employee job data).

**Step 2 — Join Related Records**
Add additional records that you need to join. PS Query automatically suggests joins based on common fields (matching field names and types). You can accept the suggested join or manually define the join condition. Join types: Standard (INNER JOIN), Left Outer, Right Outer, Full Outer.

**Step 3 — Select Output Fields**
In the "Fields" tab, check the boxes next to the fields you want in your query output. Each selected field becomes a column in the results. You can rename columns, apply aggregate functions (SUM, COUNT, MAX, AVG), and format numeric output.

**Step 4 — Add Criteria (WHERE clause)**
In the "Criteria" tab, add filters to limit the data. Each criterion becomes a condition in the SQL WHERE clause. You can use operators: =, !=, <, >, BETWEEN, IN, LIKE, IS NULL, etc. Multiple criteria are combined with AND/OR.

**Step 5 — Add Prompts (run-time parameters)**
Instead of hardcoding a value in a criterion, make it a Prompt — a field where the user enters the value each time they run the query. This makes the query reusable for different parameters (different departments, different date ranges).

**Step 6 — Set Output Order (ORDER BY)**
In the "Having" tab (or field properties), specify sort order for results.

**Step 7 — View SQL and Test**
ALWAYS click the "SQL" tab to review the generated SQL. This shows exactly what query PS Query will execute. Verify it looks correct — especially that effective dating criteria are included for date-effective records.

Run the query with sample data to validate results.`,
        pbLink:{title:"PeopleTools: PS/nVision and PeopleSoft Query — Query Manager", url:"https://docs.oracle.com/cd/F28299_01/pt857pbr3/eng/pt/tqry/concept_PeopleSoftQueryOverview-0750c0.html"},
      },
      {
        title:"Query Security & Access Control",
        body:`**Query Types and Sharing:**

- **User Queries** — Private. Only visible and accessible to the user who created them. Good for personal one-time queries or work-in-progress.

- **Role Queries** — Shared with all users who have a specific PeopleSoft Role. The creator assigns the query to a Role. Any user with that Role can run (but not necessarily edit) the query.

- **Public Queries** — Accessible to all users who have Query access in their Permission List. Typically used for organization-wide standard reports.

**Row-Level Security:**
When PS Query runs online (in the browser), it automatically respects PeopleSoft's row-level security. If a user only has access to departments 100 and 200, running a query on PS_JOB will only return employees in those departments.

Important: When PS Query is scheduled as a batch process through Process Scheduler, it runs in the context of the submitting user's security. This means the same query can return different data depending on who submits it.

**Query Access Trees:**
Query access is controlled in Permission Lists via Query Trees. A Query Tree is a hierarchical structure of record groups. Users can only build queries against records in the Query Trees assigned to their permission lists. This prevents users from querying sensitive tables they should not see.

**Query Viewer vs Query Manager:**
- Query Viewer — read-only access. Users can run existing queries but cannot create or modify them.
- Query Manager — full access. Users can create, edit, save, and run queries. Should be restricted to trained users.`,
      },
    ],
  },
  {
    id:"translate-prompt", module:5, num:"18",
    title:"Translate Values & Prompt Tables",
    summary:"Two mechanisms control what values are valid for a field: Translate Values (for short, fixed lists) and Prompt Tables (for longer, database-driven lists). Understanding both is essential for any PeopleSoft developer or configurator.",
    preChecklist:["You understand Records & Fields (Topic 12)","You've used drop-down fields in PeopleSoft as a user","You know what a lookup (prompt) icon looks like on a PeopleSoft page"],
    realWorld:"<strong>Inactivating vs deleting Translate Values:</strong> A client wanted to remove the 'Contract' employment type from a drop-down. Deleting the XLAT value would break every historical record that used it. The correct approach is to set the Effective Date to today with Status = Inactive — it disappears from the drop-down for new entries but remains valid for historical records.",
    mistakes:[
      {title:"Deleting a Translate Value that is already used in production data", desc:"Never delete an XLAT value that exists in live data. Set it to Inactive instead. Deleting breaks existing records that reference that value and can cause page errors."},
      {title:"Using a Translate Value for a list that has more than 4-character codes", desc:"Translate Values are limited to 4-character codes. If your valid values need longer codes (e.g., country codes, GL account types), use a Prompt Table backed by a database record instead."},
    ],
    quiz:[
      {q:"What is the maximum field value length for Translate Values (XLAT)?",options:["1 character","4 characters","10 characters","30 characters"],answer:1,explanation:"Translate Values are limited to a maximum of 4 characters for the code value. If your valid values need longer codes, use a Prompt Table (database-backed lookup) instead."},
      {q:"When should you use a Prompt Table instead of Translate Values for field validation?",options:["When the values change frequently or there are many values stored in a database table","When you want a Drop Down control","When the field is numeric","When the values are less than 4 characters"],answer:0,explanation:"Use a Prompt Table when valid values come from a database table (like departments, job codes, locations) — especially when there are many values or they change frequently. Use Translate Values for small, stable code lists (like status, gender, full/part time)."},
    ],
    keyPoints:[
      "Translate Values = a special PeopleTools table for short code lists (max 4 characters)",
      "Translate Values are effective-dated — you can add new values or inactivate old ones",
      "Prompt Table = a record or view used to validate field input from a database table",
      "A Drop Down field uses Translate Values · An Edit Box with prompt uses a Prompt Table",
      "Prompt Tables can be static (set in field definition) or dynamic (set via PeopleCode)",
    ],
    sections:[
      {
        title:"Translate Values — The XLAT Table",
        body:`Translate Values (often called XLAT values) are stored in the PSXLATITEM table — a universal lookup table built into PeopleTools. They are used for short, relatively stable code lists.

**Characteristics of Translate Values:**
- Field values must be 4 characters or less
- Each field can have its own set of translate values
- Values are effective-dated — you can mark an old value as Inactive rather than deleting it
- Values have both a short name (the code) and a long name (the display description)

**Examples of fields using Translate Values:**
- EMPL_STATUS: A=Active, I=Inactive, L=Leave, S=Suspended, T=Terminated
- ACTION: HIR=Hire, TER=Termination, PRO=Promotion, PAY=Pay Rate Change, XFR=Transfer
- FULL_PART_TIME: F=Full-Time, P=Part-Time
- GENDER: M=Male, F=Female, U=Unknown

**How to manage Translate Values:**
In Application Designer, open a Field definition. Go to the Translate Values tab. Add, modify, or inactivate values here. The Effective Date controls when a value becomes available or inactive.

**On pages:**
Fields bound to XLAT values display as Drop Down lists in the browser. The user sees the long description (e.g., "Full-Time") but the database stores the short code (e.g., "F").

**In PeopleCode:**
\`/* Read a translate value description */
Local String &statusDescr;
SQLExec("SELECT XLATLONGNAME FROM PSXLATITEM
         WHERE FIELDNAME = 'EMPL_STATUS'
         AND FIELDVALUE = :1
         AND EFFDT = (SELECT MAX(EFFDT) FROM PSXLATITEM
                       WHERE FIELDNAME = 'EMPL_STATUS'
                       AND FIELDVALUE = :1
                       AND EFFDT <= %CurrentDateIn)",
         JOB.EMPL_STATUS.Value, &statusDescr);\``,
        pbLink:{title:"Application Designer Developer's Guide — Translate Values", url:"https://docs.oracle.com/cd/F70250_01/psft/pdf/pt860tapd-b092022.pdf"},
      },
      {
        title:"Prompt Tables — Database-Driven Validation",
        body:`Prompt Tables (also called lookup tables or edit tables) are used when the valid values come from a database table rather than the Translate Values list. Prompt Tables handle fields with larger code sets that change frequently.

**Examples of Prompt Table fields:**
- DEPTID — validated against PS_DEPT_TBL (hundreds to thousands of departments)
- JOBCODE — validated against PS_JOBCODE_TBL
- LOCATION — validated against PS_LOCATION_TBL
- CURRENCY_CD — validated against CURRENCY_CD_TBL

**How a Prompt Table works:**
When a user tabs out of a field that has a Prompt Table defined, PeopleSoft checks whether the entered value exists in that table (as of the effective date). If not found, an error appears.

When the user clicks the lookup button (magnifying glass icon) next to the field, PeopleSoft opens a pop-up search dialog showing available values from the Prompt Table. The user can scroll through or search the list and click a value to populate the field.

**Defining a Prompt Table in App Designer:**
In the Record Field Properties for a field:
- Edit Type: Prompt Table Edit
- Prompt Table: the name of the record to validate against

The Prompt Table must have its Search Keys defined — these determine what columns appear in the lookup dialog.

**Dynamic Prompt Tables (set via PeopleCode):**
Sometimes the valid values depend on another field's value. For example, the valid Job Codes might depend on the selected Department. PeopleCode in FieldChange can dynamically change the Prompt Table:
\`/* In DEPTID FieldChange — change the JOBCODE prompt table */
JOB.JOBCODE.PromptTable = "DEPT_JOBCODE_VW";\`

This is a powerful technique for implementing cascading field validation.`,
      },
    ],
  },
  /* ── MODULE 7 ── */
  {
    id:"process-monitor", module:6, num:"19",
    title:"Process Monitor & Report Manager",
    summary:"Every batch job, report, and scheduled process in PeopleSoft runs through Process Scheduler. Process Monitor and Report Manager are the tools users and administrators use to submit, track, and view process output.",
    preChecklist:["You understand what batch processing means at a high level","You've read PeopleTools Overview (Topic 03)","No development experience needed — this is an operational topic"],
    realWorld:"<strong>Payroll runs on Process Scheduler:</strong> Processing payroll for 50,000 employees is not done by a user clicking through screens. It's a Process Scheduler job that runs overnight, processes millions of calculations, and deposits the output into Report Repository by morning. Understanding Process Monitor is how payroll admins verify the run succeeded — or diagnose why it failed at 2 AM.",
    mistakes:[
      {title:"Running batch processes manually from the command line in production", desc:"Never run SQR, AE, or COBOL processes manually from the server command line in production. Always use Process Scheduler. Manual runs bypass logging, output management, and Run Control parameter passing."},
      {title:"Not checking the process log when a process shows Error status", desc:"The Process Monitor status 'Error' tells you something went wrong but not what. Always click into the process details and view the log file. The actual error message is in the log, not the status."},
      {title:"Submitting the same process multiple times thinking it didn't run", desc:"Beginners often resubmit a process because it stayed in 'Queued' status. Check Process Monitor first — the original submission may be queued waiting for a server slot. Double submissions cause duplicate output and wasted processing."},
    ],
    quiz:[
      {q:"What does a 'No Success' status mean in Process Monitor?",options:["The process failed with an error","The process completed but encountered a data condition (e.g., no records to process)","The process is still running","The process was cancelled by a user"],answer:1,explanation:"'No Success' means the process completed its execution without a system error, but encountered a data condition that prevented normal processing — for example, a report found no data matching the criteria. It is distinct from 'Error' which means the process crashed."},
      {q:"What is the purpose of a Run Control?",options:["To control who can run a process","A database record that stores the parameters a user enters before submitting a batch process","To schedule a process to run at a specific time","To control the server a process runs on"],answer:1,explanation:"A Run Control is a database record that stores the parameters entered before running a batch process. Processes cannot prompt the user interactively while running, so they read their parameters (date ranges, departments, etc.) from the saved Run Control table."},
    ],
    keyPoints:[
      "Process Monitor: PeopleTools → Process Scheduler → Process Monitor — see all job statuses",
      "Status flow: Queued → Initiated → Processing → Success / Error / No Success",
      "Report Manager: PeopleTools → Process Scheduler → Report Manager — view output files",
      "Run Control: the page where users enter parameters before submitting a process",
      "Process Types: Application Engine, SQR Report, BI Publisher, COBOL, Crystal, nVision",
    ],
    sections:[
      {
        title:"Process Scheduler — How Batch Jobs Work",
        body:`Process Scheduler is the PeopleSoft engine that manages execution of all batch processes. It operates independently of the web/app server to ensure batch jobs don't interfere with online user performance.

**The full lifecycle of a process request:**

1. **User submits a process** — the user fills in a Run Control page with parameters (date range, report scope, etc.), clicks Save, then clicks Run. A dialog asks for server, output type (PDF, Excel, etc.), and format.

2. **Request recorded** — a row is inserted into PS_PSPRCSRQST (the Process Request table) with status "Queued."

3. **Process Scheduler picks it up** — the PSPRCSRV daemon monitors PS_PSPRCSRQST. When it finds a Queued request and an available server slot, it updates the status to "Initiated" and spawns the process.

4. **Process executes** — the Application Engine, SQR, or other process type runs on the batch server. The status updates to "Processing."

5. **Completion** — when finished, the status becomes "Success" (completed normally), "No Success" (completed but with no data/errors to report), or "Error" (failed with errors). The Distribution Agent moves output files to the Report Repository.

6. **User views output** — the user opens Report Manager to find and view their output files.`,
        pbLink:{title:"PeopleTools: Process Scheduler — Using Process Monitor", url:"https://docs.oracle.com/cd/F28299_01/pt857pbr3/eng/pt/tpsc/concept_UnderstandingPeopleSoftProcessScheduler-074aa0.html"},
      },
      {
        title:"Using Process Monitor",
        body:`Process Monitor (PeopleTools → Process Scheduler → Process Monitor) is where you track the status of submitted processes.

**What Process Monitor shows:**
- Process instance number (unique identifier for each submission)
- Process Name and Description
- Server name it's running on
- Run Date/Time — when it was submitted and when it ran
- Status — Queued, Initiated, Processing, Success, No Success, Error, Hold, Cancel, Delete
- Run Status — a more detailed status for in-progress jobs
- Distribution Status — whether output has been distributed to Report Repository

**Refreshing the view:**
Process Monitor shows a snapshot. Click "Refresh" to update. For active processes, set Auto-Refresh to update every 30 seconds.

**Viewing process details:**
Click on any process to see its detail page. From here you can:
- View the process log (messages, errors, execution steps)
- View trace files (if SQL trace was enabled)
- Cancel or hold a queued process
- Restart a failed Application Engine process from its last checkpoint

**Common statuses explained:**
- Queued: waiting for an available server slot
- Initiated: Process Scheduler has started it, waiting for OS to spawn the process
- Processing: actively executing
- Success: completed without errors
- No Success: completed but encountered a data condition (e.g., no records to process)
- Error: failed with an error — check the log file for details`,
      },
      {
        title:"Report Manager & Run Controls",
        body:`**Report Manager**
Report Manager (PeopleTools → Process Scheduler → Report Manager) is where users access output files from completed processes.

When a process completes, the Distribution Agent (PSDSTSRV) automatically copies output files from the batch server to the Report Repository. The output is stored and accessible through the Report Manager web interface.

Report Manager shows:
- Report name and description
- The process that generated it
- Run date/time
- Output format (PDF, XLS, CSV, HTML, TXT)
- A link to view or download the file

Output files are retained in Report Repository for a configurable number of days (typically 7-30 days) before being purged.

**Run Controls**
A Run Control is a database record that stores the parameters a user enters before running a process. Run Controls solve a key problem: batch processes cannot ask the user for input while running. So the user enters their parameters on a Run Control page in advance, saves them, and the process reads them from the database.

Run Controls are keyed by OPRID (user ID) and RUN_CNTL_ID (a user-defined name). A user can have multiple saved run controls for the same process with different parameters. For example, a payroll administrator might have run controls named "WEEKLY_USA", "BIWEEKLY_CAN", and "MONTHLY_GBR" for different pay group runs.

**Creating a Run Control:**
1. Navigate to the process's run control page (e.g., Payroll → Pay Period Processing → Run Control)
2. Click "Add" and give the run control an ID
3. Enter parameters (dates, departments, pay groups, etc.)
4. Click Save
5. Click Run → select server and output → click OK
6. Track in Process Monitor`,
      },
    ],
  },
  {
    id:"security-basics", module:6, num:"20",
    title:"PeopleSoft Security Basics",
    summary:"PeopleSoft security controls what users can access, what they can do, and which data they can see. The security model uses a four-level hierarchy — User Profiles, Roles, Permission Lists, and Row-Level Security — giving administrators fine-grained control over access.",
    preChecklist:["You understand what Components and Pages are (Topic 09)","You've navigated PeopleSoft and noticed some pages you could/couldn't access","You understand the concept of role-based access control"],
    realWorld:"<strong>Security misconfiguration is the most common production incident:</strong> A new HR coordinator was given the wrong Role during onboarding — one that included payroll viewing access. She could see all employee salaries for the entire company. This was caught in audit 3 months later. PeopleSoft's security is powerful but only as strong as the initial Role design. On real projects, security design takes weeks and involves HR, legal, and IT compliance teams.",
    mistakes:[
      {title:"Assigning the PeopleSoft Administrator permission list to business users", desc:"PTPT1000 (or ALLPAGES) grants access to everything including Application Designer and Data Mover. Only technical administrators should ever have this. Assigning it to a business user creates a serious security vulnerability."},
      {title:"Forgetting to include row-level security on custom components showing employee data", desc:"A custom component that uses PS_JOB directly as its Search Record (instead of a security view) bypasses row-level security. Any user with page access sees all employees — regardless of their department security settings."},
      {title:"Testing security only with a super-user account", desc:"Always test new components by logging in as a test user with the actual role the business users will have. Super-user accounts bypass many security checks. What works for admin may be completely blocked for the actual user."},
    ],
    quiz:[
      {q:"In PeopleSoft's security hierarchy, what object contains the actual page access definitions?",options:["User Profile","Role","Permission List","Department Security Tree"],answer:2,explanation:"Permission Lists contain the actual security definitions — which components are accessible, in which modes (Add, Update, Display), which processes can be run, and which PS Query trees are accessible. Roles are bundles of Permission Lists. User Profiles are assigned Roles."},
      {q:"What is row-level security in PeopleSoft?",options:["A security setting that controls which rows of SQL you can write","A mechanism that controls which DATA rows (records) a user can see, not just which pages they can access","A database table that stores security rules","A PeopleCode function that checks user permissions"],answer:1,explanation:"Row-level security controls which data rows a user can see within a component they have page access to. An HR admin might have access to the Job Data component but only see employees in their authorized departments — enforced through security views joined to the search record."},
      {q:"A user can see a PeopleSoft page but cannot save changes. What is the most likely cause?",options:["The user's password has expired","The component's Permission List access is set to 'Display Only' instead of 'Update/Display'","The database is read-only","The App Server is down"],answer:1,explanation:"When a user can see a page but not save, the most common cause is the component access mode in their Permission List is set to 'Display Only' rather than 'Update/Display'. Display Only grants read access only — no saves are possible regardless of what the user changes on screen."},
    ],
    keyPoints:[
      "User Profile → Roles → Permission Lists: the 3-level assignment chain",
      "Permission Lists define page access (Add/Update/Display modes), process access, and query access",
      "Row-level security controls which DATA rows a user can see — not just which pages",
      "Department Security Trees implement row-level security in HCM by org hierarchy",
      "Never assign the PeopleSoft Administrator permission list to regular business users",
    ],
    sections:[
      {
        title:"The Security Hierarchy",
        body:`PeopleSoft's security model has four distinct levels, each serving a different purpose:

**Level 1 — User Profile**
The individual user account in PeopleSoft. Defined in Security → User Profiles. Each User Profile has:
- User ID and password
- Email address
- Primary Permission List (for system-level access)
- Row Security Permission List (for data-level access)
- One or more Roles assigned

User Profiles in HCM are typically linked to an employee's EMPLID, though service accounts and integration users are not linked to employees.

**Level 2 — Roles**
Roles are bundles of Permission Lists. Instead of assigning Permission Lists directly to users (which would be unmanageable at scale), you assign Roles. A Role like "HR Manager" collects all the Permission Lists relevant to that function.

Roles make security administration practical: to change what all HR Managers can do, you update the Role once instead of updating thousands of user profiles.

A user can have multiple roles, and their effective access is the union of all Permission Lists across all their Roles.

**Level 3 — Permission Lists**
Permission Lists are the actual security definitions. They specify exactly what a user with that permission can do. A Permission List contains:
- **Page Permissions** — which Components are accessible and in which modes (Add, Update/Display, Display Only)
- **PeopleTools Permissions** — access to developer tools (Application Designer, Data Mover, Query Manager, etc.)
- **Process Groups** — which batch processes the user can submit
- **Query Access Trees** — which database tables the user can query in PS Query
- **Web Services** — which Integration Broker service operations the user can call
- **Sign-on Times** — optional time-of-day and day-of-week access restrictions

**Level 4 — Row-Level Security (Data Permissions)**
Controls which rows of data a user can see. Implemented separately from page-level security. A user might have permission to access the Job Data component but only see employees in their own department — even though the component shows the same page to everyone.`,
        pbLink:{title:"PeopleTools: Security Administration — Understanding PeopleSoft Security", url:"https://docs.oracle.com/cd/F28299_01/pt857pbr3/eng/pt/tsec/concept_UnderstandingPeopleSoftSecurity-074ac9.html"},
      },
      {
        title:"Row-Level Security in HCM",
        body:`Row-level security in PeopleSoft HCM is primarily implemented through Department Security Trees. This allows HR administrators to control which employees each HR user can see and update based on organizational hierarchy.

**How it works:**
PeopleSoft maintains a security table (typically named with a _SEC or _SRCH_VW suffix) for each application area. This table joins the data table with the user's security profile. When a query runs against Job Data, PeopleSoft automatically joins to the security view, filtering out any employees the user is not authorized to see.

**Department Security Tree:**
An organizational tree where each node is a department. Users are granted access to specific tree nodes (branches). If a user is granted access to "West Region" in the security tree, they automatically have access to all departments within West Region — including any new departments added to that branch in the future.

**Row Security Permission List:**
The Row Security Permission List on a user's profile defines their data permissions. Unlike regular permission lists (which control page access), this one controls data access.

**For developers:**
When building a custom component that displays employee data, you MUST use a security view as the Search Record (not the raw PS_JOB table). Forgetting to do this means any user with access to your component can see all employee data regardless of their row security permissions. This is a critical security requirement.

**Checking what a user can see:**
To test row-level security: log in as the test user and navigate to the component. The search results should only show records within that user's authorized scope. If you see all data, the security view is missing or incorrectly configured.`,
      },
      {
        title:"Common Security Tasks",
        body:`**Creating a New User:**
Security → User Profiles → Add a New Value
Enter User ID, set password, assign email, select primary Permission List, assign Roles. In HCM, link to an Employee ID if the user is an employee.

**Creating a Permission List:**
Security → Permission Lists → Add
Configure page permissions (add components with appropriate access modes), process groups, and query trees. Give it a descriptive name following your organization's naming convention.

**Creating a Role:**
Security → Roles → Add
Add Permission Lists to the Role. Name it descriptively (e.g., "HCM_HR_MANAGER" not just "ROLE1").

**Troubleshooting "you are not authorized" errors:**
1. Check the user's Roles — do they have the correct Role?
2. Check the Role's Permission Lists — is the component listed?
3. Check the component's access mode — is Update/Display granted (not just Display)?
4. Check if the component is registered in the Portal and accessible via a CREF
5. Check row-level security — the user might have page access but not data access

**The PeopleSoft Administrator Permission List:**
PTPT1000 (or similar names like ALLPAGES) is the super-user permission list that grants access to everything including developer tools. NEVER assign this to business users. It should only be assigned to technical administrators and developers in non-production environments.`,
      },
    ],
  },
];

/* ── INTERMEDIATE TOPICS (10) ── */
const INTERMEDIATE_TOPICS = [
  {
    id:"app-engine-basics", module:7, num:"21",
    title:"Application Engine Basics",
    level:"intermediate",
    summary:"Application Engine (AE) is PeopleSoft's batch processing framework for large-scale data operations. Instead of running logic online in a component, AE runs as a separate batch process — handling thousands or millions of rows without impacting online users.",
    preChecklist:[
      "You understand PeopleCode basics (SQLExec, variables, loops)",
      "You know what Process Monitor is and how to submit a batch job",
      "You understand what a Run Control record is",
    ],
    keyPoints:[
      "AE runs batch jobs outside the online component session — never impacts online users",
      "Structure: Program → Sections → Steps → Actions (SQL, PeopleCode, Do Select, Do When)",
      "Checkpoint/restart: AE saves progress per Section — restarts from last successful Section if it fails",
      "State Records persist values between Steps and Sections throughout the AE run",
      "CallAppEngine() in PeopleCode triggers AE synchronously from a component SavePostChange",
    ],
    sections:[
      {
        title:"What is Application Engine?",
        body:`Application Engine is PeopleSoft's batch processing framework. You use it when you need to process large volumes of data — payroll calculations, data migrations, mass updates, interface file processing — outside of the online component session.

**Why not just write a PeopleCode SavePostChange?**
Components are designed for real-time single-record transactions. If you need to update 500,000 employee records overnight, a component would time out and block other users. AE runs as a completely separate process via the Process Scheduler.

**The core structure:**
Every AE Program is organized into:
- **Sections** — logical groupings (like functions)
- **Steps** — units of work within a Section
- **Actions** — what each step actually does (SQL, PeopleCode, Do Select, Call Section, Do When)`
      },
      {
        title:"AE Action Types",
        body:`AE has 6 action types you'll use constantly:

**SQL** — executes a SQL statement directly. Most AE work is SQL:
\`\`\`
UPDATE PS_JOB SET DEPTID = 'HR001'
WHERE EMPLID = %Bind(EMPLID)
AND EFFDT = (SELECT MAX(EFFDT)...)
\`\`\`

**PeopleCode** — runs PeopleCode for complex logic that SQL can't handle. Calls functions, handles errors, calls Component Interfaces.

**Do Select** — loops through rows returned by a SQL SELECT. For each row, executes child Steps. The most common AE pattern:
\`\`\`
SELECT EMPLID, DEPTID FROM PS_STAGE_TABLE
WHERE PROCESSED = 'N'
\`\`\`

**Do When** — conditional: if this SQL returns a row, execute this Step. Acts as an IF statement in AE flow.

**Do While** — loop while condition is true.

**Call Section** — calls another Section (like a function call). Enables modular AE design.`
      },
      {
        title:"State Records and Run Controls",
        body:`**State Records** are how AE shares values between Steps. They persist for the entire AE run — unlike Local variables in PeopleCode which only last one program execution.

Example State Record fields:
- EMPLID — current employee being processed
- PROCESS_DATE — the date parameter from Run Control
- ERROR_COUNT — running error count
- PROCESSED_COUNT — running success count

**Run Control** is how users pass parameters to AE:
1. User opens Run Control page, enters parameters (Pay Period, Company, Date Range)
2. User clicks Run — submits to Process Scheduler
3. AE reads Run Control record at startup using OPRID + RUN_CNTL_ID keys
4. AE processes using those parameters

**CommitWork()** — called in PeopleCode action to commit the current transaction mid-run. Critical for large batch jobs — prevents one giant DB transaction. After CommitWork, AE saves a checkpoint so if it fails, restart resumes from that point.`
      },
      {
        title:"Checkpoint and Restart",
        body:`One of AE's most valuable features — if a batch job fails halfway through, you don't start over.

**How it works:**
- At the start of each Section, AE writes a checkpoint to PS_AERUNCONTROL
- If the job fails in Section 5 of 8, you can restart the same Process Instance
- AE resumes from Section 5 — Sections 1-4 are not re-executed

**What you need to ensure:**
- Each Section's work must be idempotent where possible (safe to re-run)
- Use a PROCESSED flag on your staging table:
\`\`\`
UPDATE PS_STAGE SET PROCESSED = 'Y' WHERE EMPLID = %Bind(EMPLID)
\`\`\`
- CommitWork() at the end of each logical unit

**Disabling restart:** Some programs should always run fresh — set "Disable Restart" on the AE Program properties.`
      },
      {
        title:"Running and Monitoring Application Engine",
        body:`**Submitting AE:**
1. User navigates to the Run Control page
2. Enters parameters, clicks Run
3. Process Scheduler receives the request
4. PSPRCSRV spawns the AE process
5. AE reads Run Control, executes Steps, logs output

**Monitoring in Process Monitor:**
- Status: Queued → Initiated → Processing → Success/Error
- Click the process → View Log/Trace for detailed execution info
- The message log shows each Section completed
- Error log shows the exact Step and SQL that failed

**Enabling AE Trace:**
Run Control → Process Monitor → Trace options:
- SQL Trace — logs every SQL executed with row counts and timing
- PeopleCode Trace — logs every PeopleCode statement
- Use trace only in DEV/QA — never in PROD (performance impact)

**Typical AE diagnostic steps:**
1. Process Monitor → Error → View Log/Trace
2. Read the error message (usually a SQL error or PeopleCode exception)
3. Identify the Section and Step
4. Check the SQL or PeopleCode for the issue
5. Fix data or code, then restart`
      },
    ],
    realWorld:`In an HCM implementation, a client needed to synchronize 80,000 employees from an HR legacy system into PeopleSoft every night. The AE program read from a staging table loaded by an SFTP file, called the Component Interface for each employee to ensure all hire/transfer business rules fired, committed every 500 records, and wrote errors to an error table. The whole job ran in 4 hours with full restart capability — if it failed at record 60,000, it resumed there, not from record 1.`,
    mistakes:[
      {title:"Not using CommitWork()", desc:"Processing 500,000 rows in one transaction creates a massive DB undo log. If it fails at row 499,999, the entire transaction rolls back. Always CommitWork() every few hundred rows."},
      {title:"SQLExec in Do Select PeopleCode", desc:"Putting SQLExec inside PeopleCode that runs for each row of a Do Select creates nested N×N DB calls. Pre-fetch reference data before the loop or use SQL JOINs in the Do Select query itself."},
      {title:"Not handling errors gracefully", desc:"An unhandled exception in AE PeopleCode causes the entire job to error. Always wrap PeopleCode in Try/Catch and log errors to a table rather than aborting the entire batch run."},
    ],
    quiz:[
      {q:"What AE action type loops through rows from a SQL query?",options:["Do When","Do Select","Call Section","SQL"],correct:1,explanation:"Do Select executes a SELECT, then for each returned row, executes child Steps. The most common AE looping pattern."},
      {q:"What does CommitWork() do in Application Engine?",options:["Ends the AE program","Commits the current DB transaction mid-run without ending AE","Saves the Run Control","Calls another AE program"],correct:1,explanation:"CommitWork() commits the current transaction to DB and saves a checkpoint — allowing restart from that point if the job fails later. Critical for large batch jobs."},
      {q:"Where does AE read its processing parameters from?",options:["System variables","Run Control record keyed by OPRID + RUN_CNTL_ID","State Record only","Component buffer"],correct:1,explanation:"At startup, AE reads the Run Control record using the Process Instance's OPRID and RUN_CNTL_ID to get the user-entered parameters."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/taae/",
  },
  {
    id:"app-engine-advanced", module:7, num:"22",
    title:"Application Engine Advanced",
    level:"intermediate",
    summary:"Parallel processing with Temp Tables, dynamic SQL, and performance optimization patterns that separate basic AE knowledge from expert-level batch development.",
    preChecklist:[
      "You completed Application Engine Basics (Topic 21)",
      "You understand what database indexes are",
      "You know PeopleCode variable scopes",
    ],
    keyPoints:[
      "Temp Tables enable parallel AE — each instance uses its own table instance, preventing data collision",
      "Dynamic SQL builds SQL at runtime using PeopleCode — the query can change based on parameters",
      "Parallel processing spawns multiple AE child processes, each processing a data subset simultaneously",
      "Meta-SQL functions (%Table, %Bind, %CurrentDateIn) make AE SQL database-independent",
      "The master-worker pattern: master AE spawns workers, each processes a partition, master waits for all",
    ],
    sections:[
      {
        title:"Temp Tables and Parallel Processing",
        body:`**What are Temp Tables in AE?**
When multiple AE instances run simultaneously, they can't share a staging table — they'd overwrite each other's data. Temp Tables solve this.

When you define a Record as Temp Table type in Application Designer, PeopleSoft creates multiple instances:
- PS_MYTEMP_AET (base definition)
- PS_MYTEMP_AET1 (instance 1)
- PS_MYTEMP_AET2 (instance 2)
- ... up to the number you configure

Each parallel AE instance is assigned its own instance number. When AE SQL references %Table(MYTEMP), it automatically resolves to PS_MYTEMP_AET1, PS_MYTEMP_AET2, etc. — no collision.

**Configuring Temp Tables:**
In App Designer → AE Program Properties → Temp Tables tab → Add your Temp Table record → set instance count (typically 5-10 for most programs).

**The parallel pattern:**
\`\`\`
Master AE:
  Section 1: Partition data into groups (by DEPTID ranges)
  Section 2: Spawn worker AE instances (one per partition)
  Section 3: Wait for all workers to complete
  Section 4: Consolidate results, clean up Temp Tables

Worker AE:
  Section 1: Process my assigned partition from Temp Table
  Section 2: Write results, update PROCESSED flag
\`\`\``
      },
      {
        title:"Dynamic SQL in Application Engine",
        body:`Sometimes your SQL query needs to change based on runtime conditions — a dynamic WHERE clause, or a table name determined at runtime.

**Method 1: %Bind() in SQL action**
Set a State Record field in a PeopleCode step, then reference it in the SQL action:
\`\`\`
/* PeopleCode step */
MY_STATE_REC.WHERE_CLAUSE.Value = "AND COMPANY = 'GBL'";

/* SQL step uses the value */
UPDATE PS_JOB
SET STATUS_FLAG = 'Y'
WHERE EFFDT <= %CurrentDateIn
%Bind(WHERE_CLAUSE, NOQUOTES, STATIC)
\`\`\`

**Method 2: Build SQL in PeopleCode**
\`\`\`
Local string &sql;
&sql = "UPDATE " | %Table(JOB) | " SET STATUS = 'P' ";
&sql = &sql | "WHERE EMPLID = '" | MY_STATE.EMPLID.Value | "'";
SQLExec(&sql);
\`\`\`

**When to use dynamic SQL:**
- Table name changes based on environment
- WHERE clause varies by Run Control parameters
- Column list changes based on configuration

**Warning:** Dynamic SQL is harder to optimize and debug. Use only when static SQL genuinely can't meet the requirement.`
      },
      {
        title:"AE Performance Optimization",
        body:`**1. Use SQL actions, not PeopleCode, for set-based operations**
Bad: PeopleCode loop calling SQLExec for each employee:
\`\`\`
For &i = 1 To &count
   SQLExec("UPDATE PS_JOB SET X = :1 WHERE EMPLID = :2", &val, &emplid[&i]);
End-For;
\`\`\`

Good: Single set-based SQL:
\`\`\`
UPDATE PS_JOB SET X = 'VALUE'
WHERE EMPLID IN (SELECT EMPLID FROM PS_STAGE_TBL WHERE FLAG = 'N')
\`\`\`

**2. Stage data in Temp Tables before processing**
- Load all needed data into Temp Tables in Section 1
- Process from Temp Tables in Section 2
- Temp Table queries are faster because they're smaller and indexed for your specific processing

**3. Create indexes on Temp Tables**
Temp Tables without proper indexes cause full table scans. Add indexes in App Designer on the Temp Table record for the fields used in WHERE clauses.

**4. CommitWork frequency**
Too few commits = huge rollback segments, failure = restart from beginning.
Too many commits = overhead per commit, slower total throughput.
Rule of thumb: commit every 500-1000 rows.

**5. Avoid re-select when Select Once is sufficient**
Do Select has two modes — Re-Select (re-executes the SELECT each iteration) and Select Once (fetches all, iterates). Use Select Once unless the data genuinely changes during processing.`
      },
    ],
    realWorld:`A client's monthly payroll calculation AE was taking 14 hours for 200,000 employees — too close to the cutoff window. Analysis showed: no indexes on the primary Temp Table, Do Select was set to Re-Select (requerying the DB each iteration), and CommitWork was called every row (massive overhead). Fixes: added correct Temp Table indexes, changed to Select Once, CommitWork every 1,000 rows, and converted two nested PeopleCode loops to single set-based SQL UPDATEs. Result: runtime dropped to 2.5 hours.`,
    mistakes:[
      {title:"No indexes on Temp Tables", desc:"Temp Tables without indexes cause full table scans for every Do Select loop iteration. Always create indexes on Temp Table fields used in WHERE clauses — even though Temp Tables are temporary, they need indexes for performance."},
      {title:"Using Re-Select when Select Once is enough", desc:"Re-Select re-executes the SELECT query on every loop iteration. If the source data doesn't change during processing, this is wasted DB calls. Use Select Once unless you genuinely need fresh data each iteration."},
      {title:"Forgetting to clean up Temp Tables", desc:"If the AE fails mid-run and doesn't clean up, Temp Table rows from the failed run remain. The next run may process stale data. Always have a cleanup Section at the start that deletes rows from the previous run."},
    ],
    quiz:[
      {q:"Why do Temp Tables have multiple instances (AET, AET1, AET2)?",options:["For backup purposes","To allow parallel AE processes to work simultaneously without data collision","To store different data types","For audit logging"],correct:1,explanation:"Each parallel AE instance gets its own Temp Table instance number. %Table(MYTEMP) resolves differently for each instance — preventing parallel processes from overwriting each other's data."},
      {q:"What is the correct Do Select mode if source data doesn't change during processing?",options:["Re-Select","Select Once","Do While","Do When"],correct:1,explanation:"Select Once fetches all rows into memory once, then iterates. Re-Select re-executes the SELECT each iteration — wasteful if data doesn't change. Select Once is more efficient for static data sets."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/taae/",
  },
  {
    id:"component-interface", module:7, num:"23",
    title:"Component Interface",
    level:"intermediate",
    summary:"Component Interface (CI) provides programmatic access to a PeopleSoft component — firing the same PeopleCode events as the online page. The correct way to load data into PeopleSoft when business rules must run.",
    preChecklist:[
      "You understand the Component Buffer and PeopleCode events",
      "You know the difference between Add and Update component modes",
      "You understand Application Engine basics",
    ],
    keyPoints:[
      "CI fires the same PeopleCode events as the online component — FieldDefault, SaveEdit, PostBuild all run",
      "Use CI when business rules must execute during data load — never bypass with direct SQL for transactions",
      "CI is created from an existing component in Application Designer — File → Create Component Interface",
      "Properties map to fields, Collections map to grids/scrolls",
      "Error handling: always wrap CI calls in Try/Catch and log errors to a staging table",
    ],
    sections:[
      {
        title:"What is a Component Interface?",
        body:`A Component Interface is a programmatic API wrapper around an existing PeopleSoft component. Instead of a human user interacting with the page, your code interacts with the CI — and PeopleSoft treats it exactly like a user opening the page.

**Why does this matter?**
When you call a CI to hire an employee:
- FieldDefault fires — defaults the department, location, job code
- PostBuild fires — initializes component-level logic
- SaveEdit fires — validates the hire data against business rules
- WorkFlow fires — routes hire approval if configured
- SavePostChange fires — triggers downstream integrations

**If you insert directly into PS_JOB via SQL:**
- None of these events fire
- Business rules are bypassed
- Downstream integrations may not trigger
- Data integrity is at risk

**The rule:** For any transactional data (hires, transfers, benefit enrollment, purchase orders) — use CI. For reference/setup data (department table, job code table) — direct SQL is acceptable.`
      },
      {
        title:"Creating a Component Interface",
        body:`**Step-by-step in Application Designer:**

1. Open the target component (e.g., JOB_DATA component for hires)
2. File → Create Component Interface
3. Application Designer prompts: "Create CI from this component?"
4. The CI is created with the same name as the component by default
5. Map the Keys (component search keys become CI keys)
6. Test in CI Tester: Tools → Test Component Interface

**CI Structure:**
\`\`\`
CI: JOB_DATA
  Keys:
    EMPLID (required to open existing)
    EMPL_RCD
    EFFDT
  Properties (Level 0):
    COMPANY.Value
    DEPTID.Value
    LOCATION.Value
  Collections (Level 1 — grids):
    JOB_EARNS_DIST (get/add earnings distribution rows)
\`\`\`

**Generated PeopleCode template:**
After creating the CI, use File → Generate PeopleCode Template. This creates a complete code skeleton showing exactly how to call the CI — extremely useful starting point for your AE or IB handler.`
      },
      {
        title:"Calling a Component Interface from Application Engine",
        body:`Standard CI call pattern in AE PeopleCode action:

\`\`\`
import PSXP_RPTDEFNMANAGER:*;

/* Get the CI object */
Local ApiObject &session;
Local ApiObject &ci;
Local ApiObject &keys;

&session = %Session;
&ci = &session.GetCompIntfc(CompIntfc.JOB_DATA);

If None(&ci) Then
   /* CI not found — log error */
   MY_STATE.ERROR_MSG.Value = "Could not get CI JOB_DATA";
   Return;
End-If;

/* Set mode */
&ci.InteractiveMode = False;  /* faster — batches validations */
&ci.GetHistoryItems = False;  /* don't load all history rows */
&ci.EditHistoryItems = False;

/* Set keys to find existing record */
&ci.EMPLID = MY_STATE.EMPLID.Value;
&ci.EMPL_RCD = 0;

/* Get existing component */
If &ci.Get() Then
   /* Add new effective-dated row */
   &ci.JOB.InsertItem(&ci.JOB.Count);
   Local ApiObject &newRow = &ci.JOB.Item(&ci.JOB.Count);
   &newRow.EFFDT = MY_STATE.PROCESS_DATE.Value;
   &newRow.EFFSEQ = 0;
   &newRow.ACTION = "XFR";
   &newRow.DEPTID = MY_STATE.NEW_DEPTID.Value;
   
   /* Save */
   If &ci.Save() Then
      MY_STATE.PROCESSED.Value = "Y";
   Else
      MY_STATE.ERROR_MSG.Value = &ci.GetError().ToString();
   End-If;
Else
   MY_STATE.ERROR_MSG.Value = "Employee not found: " | MY_STATE.EMPLID.Value;
End-If;
\`\`\``
      },
      {
        title:"CI Error Handling and Performance",
        body:`**Error Handling:**
Always wrap CI calls and check return values:
\`\`\`
If Not &ci.Save() Then
   Local ApiObject &errObj = &ci.GetError();
   MY_STATE.ERROR_MSG.Value = &errObj.ToString();
   /* Don't abort — log error and continue to next record */
End-If;
\`\`\`

Write errors to an error table with EMPLID, error message, and timestamp. Report on errors after the batch completes rather than stopping mid-run.

**Performance Considerations:**
CI is significantly slower than direct SQL because it:
- Opens a full component buffer per record
- Fires all PeopleCode events
- Performs all validations

Typical throughput: 500–2,000 records per hour depending on component complexity.

For 50,000 records: expect 25–100 hours with a single AE instance. Use parallel processing with Temp Tables to split the workload across multiple instances.

**InteractiveMode = False:**
Setting this to False batches validations instead of checking field-by-field — faster but still fires all events on Save. Always set this for batch CI calls.`
      },
    ],
    realWorld:`During an HCM implementation, the client needed to transfer 12,000 employees to new departments due to a reorganization. Direct SQL UPDATE to PS_JOB would have missed the workflow approval routing, salary grade validation, and position management updates. Using CI in an AE program took 6 hours but ensured every transfer went through the same business rules as online entries — including workflow routing to managers for approval and all downstream position budget updates.`,
    mistakes:[
      {title:"Using direct SQL for hire transactions", desc:"Inserting directly into PS_JOB bypasses all PeopleCode events, workflow, and validations. The data may look correct but downstream processes (payroll, benefits enrollment triggers) may not fire. Always use CI for transactional data."},
      {title:"Not setting InteractiveMode = False", desc:"InteractiveMode = True (default) validates each field as it's set — like a user tabbing through the page. For batch processing this is extremely slow. Always set InteractiveMode = False for AE CI calls."},
      {title:"Loading the entire history with GetHistoryItems = True", desc:"For effective-dated components, loading all history rows wastes memory and time. Set GetHistoryItems = False and EditHistoryItems = False unless you specifically need to read or modify historical rows."},
    ],
    quiz:[
      {q:"Why use Component Interface instead of direct SQL for employee hire?",options:["CI is faster than SQL","CI fires all PeopleCode events ensuring business rules and workflow run","CI is required by Oracle","SQL cannot insert into PS_JOB"],correct:1,explanation:"CI fires FieldDefault, PostBuild, SaveEdit, WorkFlow, SavePostChange — exactly like a user doing the hire online. Direct SQL bypasses all of these, risking data integrity and missing downstream processes."},
      {q:"What does setting InteractiveMode = False do?",options:["Disables all PeopleCode","Batches validations for faster batch processing — events still fire on Save","Prevents the CI from saving","Disables error handling"],correct:1,explanation:"InteractiveMode = False batches field-level validations instead of checking each field individually. All events still fire on Save. Significantly improves batch CI performance."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tcif/",
  },
  {
    id:"integration-broker-basics", module:8, num:"24",
    title:"Integration Broker Basics",
    level:"intermediate",
    summary:"Integration Broker is PeopleSoft's enterprise messaging platform for connecting PeopleSoft with external systems — via REST, SOAP, or internal PS messaging. Understanding the core architecture is essential for any integration project.",
    preChecklist:[
      "You understand PeopleCode Application Classes",
      "You know what a Service and API is conceptually",
      "You completed Component Interface (Topic 23)",
    ],
    keyPoints:[
      "Integration Broker handles real-time and async messaging between PeopleSoft and external systems",
      "Core objects: Service Operation, Node, Handler, Routing Rule, Integration Gateway",
      "Synchronous = sender waits for response. Asynchronous = fire and forget, message queued",
      "The Integration Gateway is the entry point — receives all inbound HTTP requests",
      "All IB activity is monitored and retried via Integration Broker Monitor",
    ],
    sections:[
      {
        title:"Integration Broker Architecture",
        body:`Integration Broker has three main layers:

**1. Integration Gateway (Web Server tier)**
The front door for all inbound messages. A Java application on the web server that:
- Receives HTTP/HTTPS requests from external systems
- Routes them to the correct Service Operation in the App Server
- Returns the response back to the caller
Configured in: PeopleTools → Integration Broker → Configuration → Gateways

**2. Service Operation (the what)**
Defines what data is being exchanged — the contract between systems:
- Operation name (e.g., EMPLOYEE_SYNC.v1)
- Message type: request message, response message
- Operation type: Synchronous, Asynchronous, One-way
- Version (allows multiple versions to coexist)

**3. Node (the who)**
Identifies systems in the integration:
- Local Node = your PeopleSoft instance
- Remote Node = external system or another PS instance
- Each node has an URL (for outbound) and authentication settings

**4. Handler (the how)**
PeopleCode (Application Class) that processes the message:
- OnMessage method: receives/sends the data
- OnError method: handles processing failures
- Transforms data between PS and external formats

**5. Routing Rule (the direction)**
Connects Service Operation to source and target Nodes:
- Inbound: external → local node
- Outbound: local → remote node
- Can include transformation PeopleCode`
      },
      {
        title:"Synchronous vs Asynchronous Messaging",
        body:`**Synchronous (Request/Reply)**
- Sender sends a request and WAITS for a response before continuing
- Like a phone call — you wait on the line
- Used when: real-time data lookup, validation against external system, immediate confirmation needed
- Example: employee change in PS triggers real-time update to payroll system, PS waits for "OK"
- Timeout risk: if external system is slow, PS transaction hangs

**Asynchronous (Publish/Subscribe)**
- Sender sends a message and CONTINUES without waiting
- Like sending an email — you continue your work
- Used when: bulk data transfer, notifications, event-driven updates
- Example: overnight employee data sync to 5 downstream systems
- Messages are queued in PS_MQUEUE and processed when the subscriber is ready
- Retry: if subscriber is down, messages queue and retry automatically

**Which to use?**
Choose Sync when: response is needed immediately, data must be validated before PS saves
Choose Async when: volume is high, timing is flexible, multiple subscribers, subscriber downtime shouldn't block PS`
      },
      {
        title:"Setting Up a Basic Integration",
        body:`**Outbound REST (PS sends data to external system):**

1. Define the message structure (XML/JSON schema)
2. Create Service Operation → type: Synchronous → REST
3. Configure target as a Node with the external system's URL
4. Create Routing Rule: Local Node → Remote Node, Outbound
5. Write Handler PeopleCode (OnMessage method):
\`\`\`
import PS_PT:Integration:*;

class EMPLOYEE_SYNC_HANDLER extends PS_PT:Integration:IRequestHandler
   method OnMessage(&MSG As Message) Returns Message;
end-class;

method OnMessage
   /+ &MSG as Message +/
   /+ Returns Message +/
   Local Message &responseMsg;
   Local XmlDoc &xmlDoc;
   
   /* Get the outbound message data */
   &xmlDoc = &MSG.GetXmlDoc();
   
   /* Transform and send */
   /* ... processing logic ... */
   
   &responseMsg = CreateMessage(Operation.EMPLOYEE_SYNC_RESP);
   Return &responseMsg;
end-method;
\`\`\`
6. Test via: PeopleTools → Integration Broker → Test → Service Operations

**Inbound (external system sends data to PS):**
Same setup but Routing is: Remote Node → Local Node, Inbound
Handler's OnMessage receives the incoming data and processes it (typically calls a CI)`
      },
      {
        title:"Integration Broker Monitor",
        body:`The IB Monitor is your operational command center for all integrations.

**Location:** PeopleTools → Integration Broker → Monitor → Integration Monitor

**What to monitor:**

*Asynchronous Services:*
- Publication Queue: messages PS has sent, waiting for delivery
- Subscription Queue: messages PS has received, waiting for processing
- Failed: messages that could not be delivered or processed

*Synchronous Services:*
- Error Log: failed synchronous calls with full error details

**Common failure scenarios:**
- Target system down → message shows "Failed" with connection error
- Authentication failure → 401/403 in the error detail
- Message format mismatch → XML parsing error
- Business rule violation → PeopleCode Error() in handler

**Retrying failed messages:**
Fix the root cause (system URL, authentication, data format) → go to Failed messages → select → Resubmit. Messages retry from that point — don't need to re-trigger from the source transaction.`
      },
    ],
    realWorld:`A large university used PeopleSoft HCM for employee data and had 12 downstream systems (payroll vendor, badge system, directory services, LMS, etc.) all needing employee updates. Integration Broker pub/sub pattern: every hire/transfer/termination in PS published an async EMPLOYEE_CHANGE message. All 12 systems subscribed — each with their own handler doing format transformation. When the badge system was down for maintenance, messages queued automatically and delivered when it came back online. PS was never blocked by any subscriber being unavailable.`,
    mistakes:[
      {title:"Not monitoring the IB Message Queue", desc:"Async messages can fail silently — they show Error status in the monitor but no one is alerted. Set up automated monitoring of the Failed queue. Many integrations silently accumulate thousands of failed messages that no one noticed."},
      {title:"Using Synchronous when Async is appropriate", desc:"Sync integrations block the PS transaction if the external system is slow or down. If a batch of 1,000 employees is being saved and the sync call to the payroll system times out, all 1,000 saves fail. Use async for bulk updates."},
      {title:"Hardcoding Node URLs in Handler PeopleCode", desc:"Handler code should use Node configuration for URLs — not hardcoded strings. When you move from DEV to QA to PROD, only the Node URL changes. Hardcoded URLs break every time you migrate to a new environment."},
    ],
    quiz:[
      {q:"What is the difference between Synchronous and Asynchronous IB messaging?",options:["Sync is faster","Sync waits for response; Async sends and continues without waiting","Async is more secure","Sync uses REST; Async uses SOAP"],correct:1,explanation:"Synchronous: sender waits for response before continuing — like a phone call. Asynchronous: sender continues immediately, message is queued for processing — like email. Choose based on whether an immediate response is required."},
      {q:"What is the Integration Gateway?",options:["The PeopleCode handler","The entry point for all inbound messages — routes them to Service Operations","The message queue database","The Node configuration screen"],correct:1,explanation:"The Integration Gateway is a Java application on the web server that receives all inbound HTTP requests from external systems and routes them to the correct Service Operation in the App Server."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tibr/",
  },
  {
    id:"integration-broker-rest", module:8, num:"25",
    title:"Integration Broker REST & SOAP",
    level:"intermediate",
    summary:"Building real REST and SOAP web services in PeopleSoft — exposing PS data to external systems and consuming external APIs from PeopleCode.",
    preChecklist:[
      "You completed Integration Broker Basics (Topic 24)",
      "You understand JSON and XML formats conceptually",
      "You know what HTTP verbs (GET, POST, PUT, DELETE) are",
    ],
    keyPoints:[
      "REST uses URI templates (e.g., /employees/{EMPLID}) and HTTP verbs to define operations",
      "SOAP uses WSDL to define the service contract — PeopleSoft auto-generates WSDL",
      "Outbound: PS calls an external API. Inbound: external system calls PS",
      "ConnectorProperties on Nodes define URL, authentication headers, SSL settings",
      "JSON is now preferred over XML for REST; SOAP always uses XML",
    ],
    sections:[
      {
        title:"REST Services in PeopleSoft",
        body:`**Exposing PeopleSoft data via REST (Inbound REST):**

PeopleSoft can expose its data as a REST API — allowing external apps, mobile clients, or other systems to GET/POST/PUT/DELETE PS data.

URI Template examples:
\`\`\`
GET  /PSIGW/RESTListeningConnector/PS/EMPLOYEE.v1/{EMPLID}
POST /PSIGW/RESTListeningConnector/PS/EMPLOYEE.v1/
PUT  /PSIGW/RESTListeningConnector/PS/EMPLOYEE.v1/{EMPLID}
\`\`\`

Setup:
1. Create Service → Add REST-based Service Operation
2. Set HTTP method (GET, POST, PUT, DELETE)
3. Define URI template with path parameters
4. Create request/response message with JSON/XML structure
5. Write Handler OnMessage PeopleCode to query PS data and return it
6. Create Inbound Routing Rule

**Calling an External REST API (Outbound REST):**
\`\`\`
/* In PeopleCode SavePostChange or AE */
Local Message &request = CreateMessage(Operation.PAYROLL_NOTIFY);
Local Rowset &rs = &request.GetRowset();
&rs.GetRow(1).GetRecord(Record.PAY_NOTIFY).EMPLID.Value = &emplid;

Local Message &response = %IntBroker.SyncRequest(&request);
Local string &jsonStr = &response.GetContentString();
\`\`\``
      },
      {
        title:"SOAP Web Services",
        body:`**Consuming an External SOAP Service:**
When an external system provides a WSDL (e.g., a vendor benefits enrollment system):

1. PeopleTools → Integration Broker → Web Services → Consume Web Service
2. Provide the WSDL URL → PeopleSoft auto-creates Node, Service Operation, Message
3. Write Handler PeopleCode to call the service:
\`\`\`
Local Message &request = CreateMessage(Operation.VENDOR_ENROLL);
/* Set message fields */
Local Message &response = %IntBroker.SyncRequest(&request);
\`\`\`

**Exposing PeopleSoft as a SOAP Service:**
1. Create Service Operation with SOAP type
2. PeopleSoft auto-generates the WSDL
3. External systems import the WSDL to consume your PS service
4. WSDL URL: http://yourserver/PSIGW/PeopleSoftServiceListeningConnector

**Key SOAP concepts:**
- WSDL defines the interface (operations, data types, endpoint)
- SOAP Envelope wraps the request/response XML
- WS-Security handles authentication (username/password token or certificate)
- PeopleSoft handles SOAP envelope wrapping/unwrapping automatically — your PeopleCode works with message Rowsets/XML, not raw SOAP`
      },
      {
        title:"Authentication and Security",
        body:`**Node Authentication Options:**

*Password Authentication (Basic Auth):*
- Configure username/password on the Node connector properties
- Sent as Base64-encoded HTTP Authorization header
- Simple but not highly secure — use HTTPS always

*SSL Certificate:*
- Mutual TLS — both systems present certificates
- Higher security for financial and healthcare integrations
- Certificate configured in PeopleSoft Keystore

*OAuth 2.0 (modern APIs):*
- PS must first call the OAuth token endpoint to get an access token
- Add token to subsequent API calls as Authorization: Bearer {token}
- Handle token refresh (tokens typically expire in 1 hour)
- Implement in PeopleCode — no native OAuth support, code it manually

*WS-Security (SOAP):*
- Username Token: username/password in SOAP header
- Signature: digital signature on message contents
- Encryption: encrypt sensitive parts of SOAP message`
      },
    ],
    realWorld:`A manufacturing company needed PeopleSoft to send real-time employee status changes to their access control system (badge reader) via REST. Every hire, termination, or leave of absence in PS triggered a SavePostChange PeopleCode that called the badge system's REST API — synchronously for terminations (immediate badge deactivation) and asynchronously for hires (badge activation within the hour). OAuth token management was built as a reusable Application Package refreshing the token automatically before expiry.`,
    mistakes:[
      {title:"Ignoring SSL certificate validation in DEV", desc:"Developers often disable SSL validation in DEV for convenience. This creates a security gap and a config difference between DEV and PROD. Use proper certificates or at minimum test with valid certs before moving to PROD."},
      {title:"Not handling REST API rate limits", desc:"External REST APIs often have rate limits (100 calls/minute). Batch AE processes calling an external API for each of 10,000 employees will hit rate limits. Build retry logic with exponential backoff in your AE PeopleCode."},
    ],
    quiz:[
      {q:"What does PeopleSoft auto-generate for a SOAP Service Operation?",options:["A REST endpoint","WSDL — the service contract that external systems use to consume the service","A JSON schema","An OpenAPI specification"],correct:1,explanation:"PeopleSoft automatically generates a WSDL (Web Service Description Language) document for SOAP Service Operations. External systems import this WSDL to understand the service interface and generate their client code."},
      {q:"What HTTP verb is used for retrieving data in a REST service?",options:["POST","PUT","GET","DELETE"],correct:2,explanation:"GET retrieves data without modifying it. POST creates new records. PUT updates existing records. DELETE removes records. REST APIs use HTTP verbs to indicate the type of operation being performed."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tibr/",
  },
  {
    id:"security-advanced", module:9, num:"26",
    title:"Advanced Security & Row-Level Security",
    level:"intermediate",
    summary:"Beyond Permission Lists and Roles — row-level security, department security trees, data permissions, and security troubleshooting techniques used daily on real PeopleSoft projects.",
    preChecklist:[
      "You completed Security Basics (Topic 19)",
      "You understand SQL Views and how they work",
      "You know what PS_JOB and PS_DEPT_TBL contain",
    ],
    keyPoints:[
      "Row-level security controls which DATA rows a user sees — not just which pages",
      "Security views join base tables with security tables filtered by OPRCLASS (operator class)",
      "Department Security Trees define which departments each security profile can access",
      "Every custom component showing employee data MUST use a security view as its Search Record",
      "Security troubleshooting: check User Profile → Roles → Permission Lists → component access mode",
    ],
    sections:[
      {
        title:"Row-Level Security Deep Dive",
        body:`**How it actually works technically:**

1. Each User Profile has a **Primary Permission List** (their OPRCLASS value)
2. PeopleSoft maintains PS_SCRTY_TBL_DEPT — a table linking OPRCLASS to authorized departments
3. Security views JOIN the base transaction table with PS_SCRTY_TBL_DEPT:

\`\`\`sql
/* Simplified PS security view pattern */
SELECT J.EMPLID, J.EFFDT, J.DEPTID, J.JOB_CODE
FROM PS_JOB J
WHERE J.EFFDT = (SELECT MAX(EFFDT) ...)
AND EXISTS (
   SELECT 'X' FROM PS_SCRTY_TBL_DEPT S
   WHERE S.OPRCLASS = %OperatorClass
   AND S.DEPTID = J.DEPTID
)
\`\`\`

4. This security view is used as the **Search Record** on the component
5. When a user searches for employees, PS_JOB_SRCH_VW (the security view) automatically filters results to only show employees in authorized departments

**Result:** The HR coordinator in the London office sees only London employees. The New York coordinator sees only New York employees. Same component, same Permission List — different data based on row-level security.

**Critical mistake:** Using PS_JOB directly as the Search Record removes this filter — all users see all employees.`
      },
      {
        title:"Department Security Trees",
        body:`**What is a Security Tree?**
A hierarchical structure defining which departments are accessible to each OPRCLASS. Built in PeopleTools → Security → Core Security → Department Security.

**Tree structure example:**
\`\`\`
GLOBAL_HR_ADMIN (OPRCLASS)
└── All Departments (access to everything)

LONDON_HR (OPRCLASS)
└── UK Region
    ├── LON-001 (London Finance)
    ├── LON-002 (London Engineering)
    └── LON-003 (London Sales)

NY_HR (OPRCLASS)
└── US Region
    ├── NY-001 (New York Finance)
    └── NY-002 (New York Engineering)
\`\`\`

**How it populates PS_SCRTY_TBL_DEPT:**
Running the security tree build process (HR Admin → Security → Refresh Security) reads the tree and populates PS_SCRTY_TBL_DEPT with one row per OPRCLASS + DEPTID combination.

**After tree changes:**
When departments are added or restructured, the security tables must be rebuilt. Many clients automate this via a scheduled AE program that refreshes security tables nightly.`
      },
      {
        title:"Data Permissions",
        body:`Beyond row-level security by department, PeopleSoft supports broader **Data Permissions** on Permission Lists.

**Business Unit Access:**
Configured on the Permission List — restricts which Business Units the user can access. A Finance user in Europe shouldn't see North American BU transactions. Set in Permission List → Data Permissions → Business Unit Access.

**SetID Access:**
Controls which SetID setup data the user can access. A user with access to SetID SHARE can see shared departments. A user restricted to SETUK can only see UK-specific setup.

**TableSet Permission List:**
Separate from the main Permission List, controls which SetIDs a user can reference when building transactions. Prevents cross-SetID data corruption.

**Process Profile Permission List:**
Controls what Process Scheduler options a user has — which output types, output destinations, and server names are available when they submit batch jobs.`
      },
      {
        title:"Security Troubleshooting",
        body:`**User reports they can't access a component:**

Step 1: Verify the component exists and is registered
- App Designer → find the component → check it's active
- Portal → CREFs → find the component → check active

Step 2: Check Permission List access
- PeopleTools → Security → User Profiles → find user → Roles tab
- For each Role, check Permission Lists
- Find the Permission List that should grant access
- Permission List → Pages → find the component → check access mode

Step 3: Check navigation
- The component must be in a Portal folder the user can access
- Check the CREF's folder path and the user's Navigation Collection access

Step 4: Row-level security issue
- User can access the component but sees no data?
- Check their Row Security Permission List (Primary Permission List)
- Run PS_SCRTY_TBL_DEPT query: SELECT * FROM PS_SCRTY_TBL_DEPT WHERE OPRCLASS = 'USERCLASS'
- If empty — security tables need to be rebuilt

**Test as another user:**
PeopleTools → Security → User Profiles → find user → Roles → use "Test" sign-on to sign in as that user (requires elevated security). See exactly what they see.`
      },
    ],
    realWorld:`During an HCM go-live, several managers reported they could see all employees globally — including employees in other countries with different compensation structures and sensitive salary data. Root cause: a custom component built during development used PS_JOB as the Search Record (fine for development when all testers had global access). In PROD, this bypassed row-level security for all users. Fix: replace the Search Record with the correct PS_JOB_SRCH_VW security view. Applied in 30 minutes but would have caused a major compliance issue if found in an audit.`,
    mistakes:[
      {title:"Using base tables as Search Records in custom components", desc:"The most common security hole in PeopleSoft customizations. Always use security views (not PS_JOB, PS_PERSONAL_DATA, etc.) as Search Records for any component displaying employee-sensitive data."},
      {title:"Not rebuilding security tables after tree changes", desc:"When departments are added or the security tree is modified, PS_SCRTY_TBL_DEPT must be rebuilt. Users will suddenly see too much or too little data if the table is stale. Schedule nightly security table rebuild as a standard operational process."},
      {title:"Assigning ALLPAGES or PTPT1000 to business users", desc:"These Permission Lists grant developer/admin access to all pages including sensitive HR and financial data. Should never be assigned to business users — only to technical admins in controlled environments."},
    ],
    quiz:[
      {q:"How does row-level security filter data for a specific user?",options:["Through PeopleCode checking the user ID","Through a security view that JOINs the base table with PS_SCRTY_TBL_DEPT filtered by the user's OPRCLASS","Through the Permission List access modes","Through the Department Security Tree directly at runtime"],correct:1,explanation:"Security views join the base table with PS_SCRTY_TBL_DEPT using %OperatorClass (the user's Primary Permission List). The view automatically returns only rows the user is authorized to see — no PeopleCode needed."},
      {q:"What must be done after modifying the Department Security Tree?",options:["Restart the App Server","Rebuild the security tables (refresh PS_SCRTY_TBL_DEPT)","Clear the browser cache","Run the nightly payroll process"],correct:1,explanation:"The Department Security Tree is a definition — PS_SCRTY_TBL_DEPT is the physical table that security views query. The tree must be 'built' (refreshed) to populate PS_SCRTY_TBL_DEPT with the new structure. Until rebuilt, security is based on the old structure."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tpcs/",
  },
  {
    id:"ps-query-advanced", module:9, num:"27",
    title:"PS Query & Reporting Advanced",
    level:"intermediate",
    summary:"Advanced PS Query techniques, BI Publisher for formatted reports, and how reporting tools fit together in a PeopleSoft environment.",
    preChecklist:[
      "You completed PS Query Fundamentals (Topic 17)",
      "You understand effective dating and SQL joins",
      "You know what Process Scheduler is",
    ],
    keyPoints:[
      "Connected Queries link parent-child queries for hierarchical data without complex SQL",
      "BI Publisher uses PS Query or AE Rowsets as data sources with template-based formatting",
      "Aggregate functions (COUNT, SUM, AVG) with GROUP BY and HAVING in PS Query",
      "Query security: Access Trees control which tables users can query — must be configured per Permission List",
      "Never expose raw PS_JOB in Query Access Tree — always expose security views instead",
    ],
    sections:[
      {
        title:"Advanced PS Query Techniques",
        body:`**Aggregate Functions:**
In PS Query, right-click a field → choose aggregate (COUNT, SUM, AVG, MIN, MAX).

Example: Headcount by Department:
\`\`\`
SELECT DEPTID, COUNT(EMPLID) AS HEADCOUNT
FROM PS_JOB_VW
WHERE EFFDT = (MAX effective date query)
GROUP BY DEPTID
HAVING COUNT(EMPLID) > 5
\`\`\`

In PS Query: Add DEPTID as non-aggregate, EMPLID as COUNT aggregate, add HAVING criteria: EMPLID count > 5.

**Expressions:**
Add calculated fields using the Expression feature. Example: Full Name concatenation:
\`\`\`
LAST_NAME | ', ' | FIRST_NAME
\`\`\`

Or date arithmetic:
\`\`\`
%DateDiff(HIRE_DT, %CurrentDateIn)  /* Years of service */
\`\`\`

**Multiple Joins:**
PS Query supports joining 5+ records. Each join requires specifying the join type (standard = inner join, left outer join) and the join fields. Build complex queries visually without writing SQL.

**Union Queries:**
Combine results from two different queries into one result set using UNION or UNION ALL. Both queries must have the same number of fields in the same order. Useful for combining similar data from different tables.`
      },
      {
        title:"BI Publisher for Formatted Reports",
        body:`**What is BI Publisher?**
BI Publisher (XMLP) creates professionally formatted output — PDF pay slips, Excel financial reports, HTML dashboards — using templates. Data comes from PS Query or AE, formatting comes from a Word/Excel template.

**The BI Publisher workflow:**
1. Create PS Query with the report data
2. Run the Query once, download as XML sample data
3. In Microsoft Word: install Oracle BI Publisher plugin
4. Open Word → load XML sample → design the template (tables, fields, formatting)
5. Upload template to PeopleSoft
6. Create Report Definition linking query + template
7. Run report via Process Scheduler → output is PDF/Excel/HTML

**Bursting (report distribution):**
Split one report run into individual sections and deliver to different people:
- One payroll run generates pay slips for all 10,000 employees
- Each employee gets only their own pay slip via email
- Configured in BIP delivery options with a burst key (EMPLID)

**Common output formats:**
PDF (most common — pay slips, forms), Excel (financial reports, data extracts), HTML (online dashboards), RTF (editable documents), CSV (data files for downstream systems)`
      },
      {
        title:"Connected Queries",
        body:`Connected Queries create parent-child query relationships — the parent query's output drives child query parameters. This produces hierarchical data that single-level queries can't easily generate.

**Example: Employee with all their job history**
- Parent query: get all active employees (EMPLID, Name, Department)
- Child query: get all PS_JOB rows for that EMPLID

The child query uses %BIND(EMPLID) to receive the parent's EMPLID for each row.

**How to set up:**
1. Create Parent Query (employees)
2. Create Child Query with a Prompt field for EMPLID
3. Connect: Query Manager → Connected Query → add Parent → add Child → map Parent.EMPLID → Child prompt

**Output:**
Connected Queries produce XML output ideal for BI Publisher templates showing master-detail hierarchical layouts — employee details at top, job history rows below each employee.`
      },
    ],
    realWorld:`An HR analytics team needed a monthly headcount report broken down by department, job family, and full-time/part-time status — with the ability to drill down to employee names. Built as a Connected Query (parent: departments with counts, child: individual employees per department) feeding a BI Publisher Excel template. The report generated automatically on the 1st of each month via Process Scheduler and emailed to all HR business partners via BIP bursting — each BP receiving only their authorized departments, enforced through the Query's row-level security view.`,
    mistakes:[
      {title:"Exposing PS_JOB directly in Query Access Tree", desc:"Giving users PS_JOB access in their Query Access Tree lets them query all employees without any row-level security filtering. Always expose security views (PS_JOB_SRCH_VW) in the tree — not base tables."},
      {title:"Forgetting effective dating in PS Query joins", desc:"When joining PS_JOB with PS_DEPT_TBL in PS Query, both need effective dating criteria. Forgetting DEPT_TBL's effective date criteria returns multiple department description rows per employee — multiplying the result count."},
    ],
    quiz:[
      {q:"What is a Connected Query used for?",options:["Running two queries at the same time","Linking parent-child queries where the parent's output drives child parameters — producing hierarchical data","Connecting to external databases","Running the same query for multiple users simultaneously"],correct:1,explanation:"Connected Queries create a parent-child relationship. The parent query runs first, then for each parent row, the child query runs using parent field values as parameters. Ideal for master-detail reports like employee with their job history."},
      {q:"What is bursting in BI Publisher?",options:["Running the same report multiple times","Splitting one report and distributing each section to different recipients automatically","Exporting a report in multiple formats","Breaking a large query into smaller queries"],correct:1,explanation:"Bursting splits a single report run into individual sections keyed by a burst field (e.g., EMPLID) and automatically delivers each section to the appropriate recipient (e.g., email each employee their own pay slip)."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tqry/",
  },
  {
    id:"data-mover", module:9, num:"28",
    title:"Data Mover & Migration",
    level:"intermediate",
    summary:"Data Mover (DMS) is PeopleSoft's utility for moving data between databases using simple scripts. Essential for migrations, environment refreshes, and setup data promotion across DEV → QA → PROD.",
    preChecklist:[
      "You understand PeopleSoft record and table structure",
      "You know the difference between setup/reference data and transactional data",
      "You understand what DEV, QA, and PROD environments are",
    ],
    keyPoints:[
      "Data Mover uses EXPORT/IMPORT scripts to move PS table data between databases",
      "Used for: setup data promotion (DEV→QA→PROD), environment refreshes, data migrations",
      "DMS bypasses all PeopleCode events — never use for transactional data (use CI instead)",
      "Scripts have .dms extension and use simple command syntax",
      "Always test IMPORT scripts in QA before running in PROD — DMS is irreversible without a backup",
    ],
    sections:[
      {
        title:"What is Data Mover?",
        body:`Data Mover is PeopleSoft's data transfer utility — a simple scripting language for exporting and importing PS table data between databases.

**Accessed via:**
Start → PeopleTools → Data Mover (opens a GUI application)

**Two modes:**
- *Bootstrap mode:* used during initial PS installation before security is set up. Bypasses PS security.
- *Normal mode:* logs in using PS User ID/Password. Subject to PS security.

**Core DMS commands:**
\`\`\`dms
/* EXPORT — reads from DB, writes to .dat file */
EXPORT PS_DEPT_TBL;
REM Exports all rows from PS_DEPT_TBL to the output file

/* IMPORT — reads from .dat file, writes to DB */
IMPORT PS_DEPT_TBL;
REM Imports all rows into PS_DEPT_TBL in target DB

/* With conditions */
EXPORT PS_DEPT_TBL WHERE SETID = 'SHARE';

/* DELETE before import to avoid duplicate key errors */
DELETE_ROWS PS_DEPT_TBL;
IMPORT PS_DEPT_TBL;
\`\`\`

**Output files:**
Export produces .dat files (binary PS format). These files are transferred to the target environment and imported there.`
      },
      {
        title:"Common DMS Use Cases",
        body:`**1. Promoting setup data from DEV to QA to PROD:**
\`\`\`dms
/* Export all custom configuration from DEV */
SET LOG C:\\temp\\export.log;
SET OUTPUT C:\\temp\\custom_config.dat;
EXPORT PS_MY_CONFIG_TBL;
EXPORT PS_MY_CODES_TBL;
\`\`\`
Then in QA/PROD:
\`\`\`dms
SET LOG C:\\temp\\import.log;
SET INPUT C:\\temp\\custom_config.dat;
DELETE_ROWS PS_MY_CONFIG_TBL;
IMPORT PS_MY_CONFIG_TBL;
DELETE_ROWS PS_MY_CODES_TBL;
IMPORT PS_MY_CODES_TBL;
\`\`\`

**2. Copying security setup between environments:**
\`\`\`dms
EXPORT PSROLEDEFN;
EXPORT PSROLECLASS;
EXPORT PSCLASSDEFN;
\`\`\`

**3. Exporting an App Designer project's data:**
Object definitions (Records, Pages, etc.) are in PeopleTools tables — migrate using App Designer Project migration, not DMS.

**4. Initial data load for reference tables:**
Loading chart of accounts, location codes, job families from a legacy system — clean data with no business rules → DMS is appropriate.`
      },
      {
        title:"DMS Limitations and Risks",
        body:`**DMS bypasses PeopleCode entirely:**
No FieldDefault, no SaveEdit, no workflow. Data lands directly in the database table. This is fine for reference data (department table, codes) but dangerous for transactional data (employee hires, financial transactions).

**Risks to manage:**
- *Referential integrity:* DMS doesn't enforce FK constraints. Importing with missing parent data causes runtime errors later.
- *Sequence numbering:* Some PS tables use auto-generated sequence numbers (DEMAND_ID, CASE_ID). DMS imports the old sequence values — can cause conflicts with existing data.
- *Effective date conflicts:* Importing older effective-dated rows into a DB that has newer rows can cause data inconsistencies.
- *No rollback:* DMS IMPORT commits as it goes. If it fails halfway, some data is imported. Always export the target table first as a backup before importing.

**Best practices:**
1. Always test import in QA first
2. Export target table as backup before importing
3. Use DELETE_ROWS before IMPORT to ensure clean load
4. Review the log file (SET LOG) after every DMS run
5. Never use DMS on transactional data in PROD without DBA involvement`
      },
    ],
    realWorld:`During a PeopleSoft HCM go-live, the project team needed to load 1,200 departments, 400 job codes, and 250 locations from the client's HR legacy system into PeopleSoft PROD. The data had been cleansed in DEV, validated in QA, and was now ready for PROD. Data Mover scripts exported the three setup tables from QA and imported them into PROD in 20 minutes. The same DMS approach was used to migrate Permission List configurations and Role definitions from DEV → QA → PROD, saving days of manual re-entry.`,
    mistakes:[
      {title:"Using DMS for transactional employee data", desc:"Some developers try to load PS_JOB rows directly via DMS to save time. This bypasses all business rules, creates no audit trail, and misses workflow triggers. Always use Component Interface for any transactional data load."},
      {title:"Not backing up before IMPORT", desc:"DMS IMPORT with DELETE_ROWS is destructive — no undo. Always export the target table first: EXPORT PS_MY_TABLE; (saves current state). If the import corrupts data, you can restore from the export file."},
    ],
    quiz:[
      {q:"What is the main limitation of Data Mover for data migration?",options:["It is very slow","It bypasses all PeopleCode — business rules, validation, and workflow do not fire","It cannot handle large datasets","It only works in bootstrap mode"],correct:1,explanation:"DMS inserts directly into DB tables without firing any PeopleCode events. For reference/setup data this is acceptable. For transactional data (hires, financial transactions), always use Component Interface to ensure business rules and audit trails are maintained."},
      {q:"What command clears existing rows before importing?",options:["TRUNCATE","CLEAR_TABLE","DELETE_ROWS","REMOVE"],correct:2,explanation:"DELETE_ROWS PS_TABLENAME removes all existing rows before the import. This prevents duplicate key errors when re-importing data that may already exist in the target environment."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tpds/",
  },
  {
    id:"process-scheduler-advanced", module:9, num:"29",
    title:"Process Scheduler & Performance Tuning",
    level:"intermediate",
    summary:"Process Scheduler architecture, batch job management, and practical performance tuning techniques for slow PeopleSoft components and queries.",
    preChecklist:[
      "You completed Process Monitor basics (Topic 19)",
      "You understand Application Engine (Topics 21-22)",
      "You know what SQL indexes are",
    ],
    keyPoints:[
      "Process Scheduler manages all batch job execution — AE, SQR, COBOL, BI Publisher, Crystal",
      "Process groups control which jobs run on which servers — security and load management",
      "SQL trace is the primary diagnostic tool for online performance issues",
      "SQLExec in RowInit and missing indexes are the two most common performance problems",
      "App Server caching and connection pooling are critical for online scalability",
    ],
    sections:[
      {
        title:"Process Scheduler Deep Dive",
        body:`**Process Scheduler architecture:**
PSPRCSRV (Process Scheduler Server) maintains a queue of process requests in PS_PRCSPARMS. It polls the table every few seconds for new requests, spawns child processes to execute them, and updates status.

**Process Types:**
- Application Engine (PSAE) — most common
- SQR Report (SQR) — legacy reporting
- COBOL SQL (COBOL) — legacy payroll calculations
- BI Publisher (PSXP) — formatted reports
- Crystal Reports — legacy formatted reports
- Application Package — PeopleCode via process

**Process Groups:**
Groups control which processes run on which servers. Example:
- PAYROLL_GRP: only runs on the high-memory payroll server
- REPORT_GRP: runs on the dedicated report server
- GENERAL_GRP: everything else

Users must have the Process Group in their Permission List to submit processes in that group.

**Recurrence:**
Schedule a process to run automatically:
PeopleTools → Process Scheduler → Recurrences → define frequency (daily, weekly, monthly, custom CRON).
Attach to a Run Control → the process submits itself automatically at the defined time.`
      },
      {
        title:"Performance Tuning — Online",
        body:`**Step 1: Enable SQL Trace**
PeopleTools → Utilities → Debug → PeopleCode/SQL Trace (or add trace to App Server domain config).
Generates a trace file showing every SQL executed with timing.

**Step 2: Identify the problem patterns**

*Pattern 1: Repeated identical SQL*
\`\`\`
SELECT DESCR FROM PS_DEPT_TBL WHERE DEPTID=:1 — executed 500 times
\`\`\`
Cause: SQLExec in RowInit. Fix: Pre-fetch in PostBuild.

*Pattern 2: Full table scan*
\`\`\`
/* Cost: 450,000 rows scanned for result of 1 row */
SELECT * FROM PS_JOB WHERE LAST_NAME = 'SMITH'
\`\`\`
Cause: No index on LAST_NAME. Fix: Add Alternate Search Key (A) to LAST_NAME field in App Designer → Build → Alter → Creates the index.

*Pattern 3: Missing effective dating*
\`\`\`
SELECT DEPTID FROM PS_JOB WHERE EMPLID = :1 — returns 30 rows
\`\`\`
Cause: No MAX(EFFDT) criteria. Fix: Add correct effective dating WHERE clause.

**Step 3: Fix in App Designer, test, migrate**`
      },
      {
        title:"Performance Tuning — Batch",
        body:`**AE batch performance checklist:**

1. **Check Do Select mode** — Re-Select vs Select Once. If source data doesn't change during the loop, use Select Once.

2. **Indexes on Temp Tables** — Add indexes to Temp Table records in App Designer for fields used in WHERE clauses of your AE SQL.

3. **Set-based SQL over row-by-row** — Replace PeopleCode loops with single UPDATE/INSERT SQL statements where possible:
\`\`\`sql
/* Bad: PeopleCode loop with SQLExec per row */
/* Good: Single set-based SQL */
UPDATE PS_JOB SET PROCESS_FLAG = 'Y'
WHERE EMPLID IN (SELECT EMPLID FROM PS_STAGE WHERE STATUS = 'READY')
\`\`\`

4. **CommitWork frequency** — too rarely = huge rollback, risk of restart from far back; too often = commit overhead. 500-1000 rows is typical.

5. **Parallel processing** — for truly large volumes, split workload across multiple AE instances using Temp Tables.

6. **DB statistics** — outdated DB statistics cause the optimizer to choose wrong execution plans. Work with your DBA to ensure statistics are updated after large data loads.`
      },
    ],
    realWorld:`A payroll AE that calculated vacation accruals for 150,000 employees was taking 18 hours — too close to the payroll run cutoff. Performance analysis: the main Do Select had no index on PS_JOB_ACCRUAL_TBL causing a full table scan on 2M rows each iteration, plus a PeopleCode loop inside doing individual SQLExec calls for each employee's leave balance. Fixes: created proper composite index on the Temp Table, converted the inner PeopleCode loop to a single set-based SQL UPDATE, increased CommitWork from every row to every 1,000. Final runtime: 2.5 hours.`,
    mistakes:[
      {title:"Not analyzing SQL trace before optimizing", desc:"Developers often guess at performance problems and optimize the wrong thing. Always run SQL trace first — it shows exactly which SQL is slow, how many times it runs, and how many rows it processes. Optimize with data, not guesses."},
      {title:"Missing indexes on key search fields", desc:"Adding an Alternate Search Key (A) designation to a record field in App Designer creates a DB index automatically when you run Build → Alter. Without this, searches on that field do full table scans even for basic lookups."},
    ],
    quiz:[
      {q:"What is the first step when diagnosing a slow PeopleSoft page?",options:["Restart the App Server","Enable SQL trace to identify which SQL statements are slow and how many times they execute","Add more memory to the server","Reduce the number of fields on the page"],correct:1,explanation:"SQL trace is the definitive diagnostic tool. It shows every SQL executed, with timing and row counts. This reveals patterns like N+1 queries (SQLExec in RowInit), missing indexes, and missing effective dating — the most common performance issues."},
      {q:"How do you create a database index for a PeopleSoft record field?",options:["Write a CREATE INDEX SQL statement manually","Mark the field as Alternate Search Key (A) in App Designer and run Build → Alter Table","Add the field to the primary key","Configure it in PSADMIN"],correct:1,explanation:"Marking a field as Alternate Search Key (A) in Application Designer causes PeopleSoft to create a non-unique database index on that field when you run Build → Alter Table. PeopleSoft manages all index creation through its metadata — no manual SQL needed."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tpscr/",
  },
  {
    id:"fluid-ui-basics", module:10, num:"30",
    title:"Fluid UI & Modern PeopleSoft",
    level:"intermediate",
    summary:"Fluid UI is PeopleSoft's modern responsive interface introduced in PT 8.53. Understanding Fluid — homepages, tiles, NavBar, and Activity Guides — is essential for working with current PeopleSoft environments.",
    preChecklist:[
      "You understand the Classic UI (pages, components, navigation)",
      "You know what a Content Reference (CREF) is",
      "You understand Permission Lists and Roles",
    ],
    keyPoints:[
      "Fluid uses HTML5/CSS3 — responsive on mobile, tablet, and desktop. Classic is desktop-only",
      "Fluid Homepages contain Tiles — each tile is a CREF linking to a component or WorkCenter",
      "NavBar provides the main navigation hierarchy — replaces classic menu navigation",
      "Activity Guides provide step-by-step guided workflows — like a wizard for complex processes",
      "All new Oracle PeopleSoft functionality is built in Fluid only — Classic pages are no longer enhanced",
    ],
    sections:[
      {
        title:"Fluid Architecture Overview",
        body:`**Classic vs Fluid:**

*Classic UI (pre-PT 8.53):*
- Fixed-width HTML tables
- Desktop-only — unusable on mobile
- Grey/white Oracle-style interface
- Navigation via horizontal/vertical menu bars
- All delivered PS8-PS9.2 pages built in Classic

*Fluid UI (PT 8.53+):*
- Responsive HTML5/CSS3 with Oracle JavaScript Extension Toolkit (JET)
- Works on mobile phones, tablets, and desktops
- Modern flat design with tiles and cards
- Navigation via Homepages + Tiles + NavBar
- All new Oracle functionality built in Fluid only

**Key Fluid components:**
- **Fluid Homepage** — the landing page after signon. Contains tiles, quicklinks, news.
- **Tile** — a clickable card on the homepage linking to a component or WorkCenter. Can show dynamic badge counts (e.g., "3 pending approvals").
- **NavBar** — the icon/sidebar navigation replacing classic menus. Opens folders of CREFs.
- **WorkCenter** — a multi-panel Fluid page combining a navigation list, a work area, and context tools. Used for complex roles (Benefits Administrator, Payroll Specialist).
- **Activity Guide** — a step-by-step wizard for multi-component processes (new hire onboarding, annual enrollment).`
      },
      {
        title:"Homepages and Tiles",
        body:`**Fluid Homepages:**
Users can have multiple homepages — each focused on a role (Manager Self Service, Employee Self Service, HR Administration). Homepages are configured in PeopleTools → Portal → Structure and Content → Homepages.

**Creating a Tile:**
1. A Tile is a CREF with special Fluid properties
2. Tile CREF has an image (PNG, SVG) and optional badge count configuration
3. Badge count: small red/gold number on the tile showing pending items (e.g., "5 pending approvals") — driven by a PS Query that counts pending rows
4. Tile CREFs assigned to a Homepage via Tile Collection

**Tile configuration in App Designer:**
- Object Type: Content Reference (CREF)
- Content Type: Target
- URL: links to Fluid component
- Tile Properties: image, badge query, tile size (small/medium/large/extra-large)

**Dynamic Badge Setup:**
1. Create a PS Query counting relevant rows for the current user
2. In Tile CREF → Tile Properties → Badge Query: select the query
3. The query runs automatically on homepage load — shows count in tile badge
4. Counts > 0 are highlighted (gold/red) to draw attention`
      },
      {
        title:"Activity Guides",
        body:`**What is an Activity Guide?**
A structured step-by-step workflow that guides a user through multiple components in a defined sequence. Think of it as a wizard for complex business processes.

**Examples:**
- New Hire Onboarding: Step 1 (Personal Data) → Step 2 (Job Data) → Step 3 (Benefits Enrollment) → Step 4 (Document Upload) → Step 5 (Confirmation)
- Annual Open Enrollment: benefits selection across 5 screens, each validated before proceeding
- Manager Self Service performance review workflow

**Activity Guide components:**
- **Activity Guide Composer** (PT 8.57+): low-code tool to create activity guides without programming
- **Steps**: each step maps to a specific Fluid component or page
- **Progress Tracker**: visual step indicator showing completed/current/remaining steps
- **Side Panel**: contextual information visible during all steps

**Activity Guide vs WorkCenter:**
WorkCenter: ongoing daily work for a role — navigate between tasks freely. 
Activity Guide: one-time process with a defined start/end — steps must be completed in sequence.`
      },
      {
        title:"Converting Classic Pages to Fluid",
        body:`**Classic pages do NOT automatically become Fluid.**
This is a common misconception. Classic pages continue to work in a Fluid environment but they display in a legacy "Classic" rendering mode — not responsive.

**Migration options:**

*Option 1: Run Classic page in Fluid wrapper*
Classic component wrapped in a Fluid header/footer. Works on desktop. Not truly responsive. Quickest approach for existing components.

*Option 2: Create Fluid version of the Classic component*
Rebuild the component using Fluid page controls (Group Boxes, Grids with Fluid styling, Responsive layouts). Significant development effort but produces a truly mobile-responsive result.

*Option 3: Event Mapping for Fluid behavior*
For PT 8.55+ — attach Fluid-specific behaviors to delivered Classic components via Event Mapping without modifying the delivered page.

**Oracle's direction:**
Oracle no longer delivers new functionality on Classic pages. All new features (Insights dashboards, Activity Guides, Fluid WorkCenters) require Fluid. Organizations still on Classic-only face growing gaps vs the delivered product.`
      },
    ],
    realWorld:`A university with PeopleSoft 9.2 PT 8.58 wanted to roll out Manager Self Service on mobile for their 500 managers. The existing Classic MSS pages were unusable on phones. The project created Fluid homepages with tiles for Leave Approval (badge showing pending count), Team Time Review, and Position Management. Activity Guides handled the annual merit review process — guiding managers through 4 steps with validation at each. Mobile adoption was 78% within the first month — managers approved leave from their phones during commutes instead of waiting to get to a desktop.`,
    mistakes:[
      {title:"Assuming Classic pages work on mobile", desc:"Classic pages use fixed-width HTML tables — they render as tiny unreadable content on mobile screens. If mobile access is needed, Fluid development is required. Don't promise mobile access without planning for Fluid development."},
      {title:"Not securing Fluid tiles with correct CREFs", desc:"Fluid tiles are CREFs — they must be secured in Permission Lists like any other navigation. A tile visible to everyone but pointing to a restricted component creates confusion (users see the tile but get 'Access Denied'). Align tile CREF security with the component's Permission List."},
      {title:"Rebuilding Fluid from scratch when Event Mapping is sufficient", desc:"For adding small Fluid behaviors to existing Classic components — like showing a toast notification after save — Event Mapping is often sufficient. Full Fluid rebuilds are expensive. Evaluate whether Event Mapping can meet the requirement first."},
    ],
    quiz:[
      {q:"What is the main difference between Fluid UI and Classic UI?",options:["Fluid is faster","Fluid uses responsive HTML5/CSS3 working on mobile/tablet/desktop; Classic uses fixed-width tables for desktop only","Fluid requires a different database","Classic has better security"],correct:1,explanation:"Fluid UI (PT 8.53+) uses responsive HTML5/CSS3 with Oracle JET — works on any device. Classic uses fixed-width HTML tables designed for desktop only. All new Oracle functionality is built exclusively in Fluid."},
      {q:"What is a Tile in PeopleSoft Fluid UI?",options:["A database partition","A clickable card on a Fluid Homepage linking to a component, optionally showing a dynamic badge count","A PeopleCode function","A security configuration object"],correct:1,explanation:"Tiles are the large clickable cards on Fluid Homepages. Each tile is a CREF with an image and optional badge count (showing pending items count from a PS Query). Users click tiles to navigate to components."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tflu/",
  },
];

const QUIZ_BANK = [
  /* ── HISTORY & INTRODUCTION (10) ── */
  {cat:"History & Introduction",q:"In what year was PeopleSoft founded?",opts:["1982","1987","1992","1995"],ans:1,exp:"PeopleSoft was founded in 1987 by Dave Duffield and Ken Morris in Pleasanton, California. Their first product was a client-server HR payroll application."},
  {cat:"History & Introduction",q:"Who founded PeopleSoft?",opts:["Larry Ellison","Dave Duffield and Ken Morris","Craig Conway and Mark Hurd","Safra Catz and Jeff Henley"],ans:1,exp:"Dave Duffield and Ken Morris co-founded PeopleSoft in 1987. Duffield later founded Workday after Oracle's acquisition."},
  {cat:"History & Introduction",q:"Oracle acquired PeopleSoft for approximately how much?",opts:["$2.1 billion","$5.8 billion","$10.3 billion","$15 billion"],ans:2,exp:"Oracle acquired PeopleSoft in January 2005 for $10.3 billion after an 18-month hostile takeover battle that started in June 2003."},
  {cat:"History & Introduction",q:"Which PeopleSoft version first introduced browser-based access (PIA)?",opts:["PeopleSoft 6","PeopleSoft 7","PeopleSoft 8","PeopleSoft 9"],ans:2,exp:"PeopleSoft 8 (2000) introduced Pure Internet Architecture (PIA). Users no longer needed to install the desktop client — any browser could access PeopleSoft."},
  {cat:"History & Introduction",q:"What does PeopleSoft metadata-driven architecture mean?",opts:["All code is stored in text files on the server","Every page, field and workflow is defined as metadata in database tables, not hardcoded files","PeopleSoft uses JSON files to drive the UI","Developers write SQL directly to create forms"],ans:1,exp:"PeopleSoft is metadata-driven — every Record, Page, Component, and PeopleCode program is stored as metadata in PeopleTools system tables. The runtime engine reads this metadata to generate pages and execute logic."},
  {cat:"History & Introduction",q:"What is PeopleSoft Update Manager (PUM)?",opts:["A tool to monitor server performance","Oracle's selective patching system allowing organizations to pick specific fixes from a PeopleSoft Image","A backup utility for PeopleSoft databases","A deployment tool for moving code to production"],ans:1,exp:"PUM (introduced ~2014) replaced old bundle patching. Organizations download a PeopleSoft Image VM, browse available updates, and selectively apply only the fixes and features they need."},
  {cat:"History & Introduction",q:"Which product did Dave Duffield found AFTER leaving Oracle?",opts:["SAP SuccessFactors","ServiceNow","Workday","Ceridian"],ans:2,exp:"After the Oracle acquisition of PeopleSoft, Dave Duffield founded Workday — now one of PeopleSoft HCM's primary cloud competitors."},
  {cat:"History & Introduction",q:"PeopleSoft HCM is primarily used for:",opts:["Financial reporting and budgeting","Managing the complete employee lifecycle — hire to retire","Supply chain and inventory management","Customer relationship management"],ans:1,exp:"PeopleSoft HCM (Human Capital Management) manages the complete employee lifecycle — recruiting, onboarding, job data, compensation, benefits, payroll, time & labor, absence, and talent management."},
  {cat:"History & Introduction",q:"Which PeopleTools version introduced Fluid UI?",opts:["PT 8.49","PT 8.51","PT 8.53","PT 8.57"],ans:2,exp:"Fluid UI was introduced in PeopleTools 8.53. It replaced the Classic fixed-width HTML interface with a responsive HTML5/CSS3 design that works on mobile, tablet, and desktop."},
  {cat:"History & Introduction",q:"PeopleSoft can be deployed on:",opts:["On-premise only","Oracle Cloud (OCI) only","Both on-premise and Oracle Cloud Infrastructure (OCI)","Only on Amazon AWS"],ans:2,exp:"PeopleSoft supports both on-premise deployment and Oracle Cloud Infrastructure (OCI). Organizations running on OCI still maintain full control of their customizations."},

  /* ── ARCHITECTURE & PIA (12) ── */
  {cat:"Architecture & PIA",q:"In PeopleSoft three-tier architecture, where does all PeopleCode execute?",opts:["In the browser","In the WebLogic web server","In the Tuxedo Application Server","In the Oracle database"],ans:2,exp:"All PeopleCode executes in the Tuxedo Application Server (Tier 2). The browser is a pure display layer with no business logic."},
  {cat:"Architecture & PIA",q:"What protocol does WebLogic use to communicate with the Tuxedo App Server?",opts:["HTTP","SOAP","JOLT","JDBC"],ans:2,exp:"WebLogic communicates with Tuxedo using JOLT (Java Object Linking and Transactions). The JOLT port is typically 9000."},
  {cat:"Architecture & PIA",q:"What is PSAPPSRV responsible for?",opts:["Handling file uploads","Executing PeopleCode, Component Processor operations, and SQL generation","Managing DB connections only","Serving static HTML files"],ans:1,exp:"PSAPPSRV is the core Application Server process in Tuxedo. It handles component buffer operations, PeopleCode execution, and SQL generation."},
  {cat:"Architecture & PIA",q:"What does PSQRYSRV handle?",opts:["Queue management for batch jobs","PS Query execution","Security validation","Report distribution"],ans:1,exp:"PSQRYSRV is dedicated to PS Query execution, separating query processing from component processing handled by PSAPPSRV."},
  {cat:"Architecture & PIA",q:"In 2-tier App Designer mode, the connection goes:",opts:["Through the App Server","Directly to the database","Through WebLogic","Through the Process Scheduler"],ans:1,exp:"In 2-tier mode, Application Designer connects directly to the database, bypassing the App Server. In 3-tier, it connects via the App Server using JOLT."},
  {cat:"Architecture & PIA",q:"Which web server is the ONLY supported option in PeopleTools 8.59+?",opts:["Apache Tomcat","IBM WebSphere","Oracle WebLogic","Microsoft IIS"],ans:2,exp:"As of PeopleTools 8.59, Oracle WebLogic is the only supported web server for PeopleSoft."},
  {cat:"Architecture & PIA",q:"What does Process Scheduler (PSPRCSRV) do?",opts:["Manages user sessions","Runs batch jobs like App Engine, SQR, BI Publisher outside the online session","Handles DB connection pooling","Manages file uploads"],ans:1,exp:"Process Scheduler manages all batch process execution independently from the online web/app server to prevent batch jobs from affecting online user performance."},
  {cat:"Architecture & PIA",q:"What is the Distribution Agent (PSDSTSRV)?",opts:["A tool for distributing updates","Moves completed batch output files to the Report Repository","A load balancer","A security component"],ans:1,exp:"PSDSTSRV transfers completed report output files from the batch server to the Report Repository, making them accessible in Report Manager."},
  {cat:"Architecture & PIA",q:"Where is PeopleSoft application metadata stored?",opts:["XML files on the web server","In the database in PeopleTools system tables","In App Server memory cache","In flat files on the batch server"],ans:1,exp:"All PeopleSoft metadata — Records, Fields, Pages, Components, PeopleCode — is stored in the database in PeopleTools system tables like PSRECDEFN, PSDBFIELD, PSPNLDEFN."},
  {cat:"Architecture & PIA",q:"What is a PeopleSoft DPK?",opts:["Dynamic Page Kit","Deployment Package — Puppet-based scripts automating environment installation","Database Patching Kit","Developer Process Kit"],ans:1,exp:"DPK (Deployment Package) uses Puppet scripts to automate PeopleSoft environment setup. Standard from PT 8.55+, reducing multi-day manual installs to hours."},
  {cat:"Architecture & PIA",q:"What is a PeopleSoft Domain?",opts:["A business unit grouping","An instance of the Tuxedo App Server or Process Scheduler","The database schema","A set of navigation menus"],ans:1,exp:"A Domain is an instance of either the Tuxedo Application Server or Process Scheduler. A standard environment has one App Server domain and one Process Scheduler domain."},
  {cat:"Architecture & PIA",q:"What happens atomically when a user saves in PeopleSoft?",opts:["Fields write one by one","All pages validate, SavePreChange fires, ALL data commits as one transaction, SavePostChange fires","Only the visible page saves","Browser writes data directly to DB"],ans:1,exp:"On Save: SaveEdit validates, SavePreChange fires before commit, ALL component data commits atomically to DB, then SavePostChange fires. Either all succeeds or none does."},

  /* ── PEOPLECODE BASICS & EVENTS (16) ── */
  {cat:"PeopleCode Basics",q:"Which PeopleCode event fires ONCE after the entire component is fully loaded?",opts:["RowInit","FieldDefault","PostBuild","SearchInit"],ans:2,exp:"PostBuild fires once after all RowInit and FieldDefault events have run. Best place for show/hide logic and component-level initialization."},
  {cat:"PeopleCode Basics",q:"Which event is correct for final business rule validation before saving?",opts:["FieldChange","RowInit","PostBuild","SaveEdit"],ans:3,exp:"SaveEdit fires during the save sequence. Error() in SaveEdit stops the save and highlights the problem. Standard location for cross-field business rules."},
  {cat:"PeopleCode Basics",q:"What is the main performance risk of SQLExec in RowInit?",opts:["SQLExec not supported in RowInit","RowInit fires for every row — SQLExec causes N+1 queries","SQLExec commits data early","It causes a deadlock"],ans:1,exp:"RowInit fires for EVERY row in EVERY grid. SQLExec in RowInit = one SQL per row. 200 rows = 200 SQLs. Most common performance anti-pattern in PeopleSoft."},
  {cat:"PeopleCode Basics",q:"Which function handles queries returning MULTIPLE rows?",opts:["SQLExec","FetchSQL","CreateSQL with .Fetch() in a While loop","MultiRowSQL"],ans:2,exp:"CreateSQL returns a SQL object. Use While &sql.Fetch() to iterate rows. Always call .Close() when done. SQLExec only returns the first matching row."},
  {cat:"PeopleCode Basics",q:"What does Component scope mean for a variable?",opts:["Exists only for one function call","Persists for the entire component transaction","Available across all components in the session","Stored in the database"],ans:1,exp:"Component scope variables persist from component open to save/cancel. Any event in that component can read and write them. Use when you need to pass values between different events."},
  {cat:"PeopleCode Basics",q:"What fires FieldChange?",opts:["A user pressing Save","A user navigating between page tabs","A user changing a field value and tabbing out","The component first loading"],ans:2,exp:"FieldChange fires when a user changes a field value. Used for dynamic field updates — auto-populating related fields, showing/hiding controls based on the new value."},
  {cat:"PeopleCode Basics",q:"What does %OperatorId return?",opts:["The current employee EMPLID","The current user login ID","The current component name","The current database name"],ans:1,exp:"%OperatorId returns the current user's login ID. %EmployeeId returns the linked EMPLID. %Date returns today's date."},
  {cat:"PeopleCode Basics",q:"If SQLExec finds no rows, what happens to output variables?",opts:["Runtime error is thrown","Set to empty string or zero — no error","Last query values remain","PeopleCode skips the statement"],ans:1,exp:"If SQLExec finds no rows, output variables are set to empty string or 0. No error. Always use None() to check before using the value."},
  {cat:"PeopleCode Basics",q:"Which event fires during the SQL SELECT that loads data into the buffer?",opts:["PostBuild","RowInit","RowSelect","SearchInit"],ans:2,exp:"RowSelect fires for each row being fetched. Use DiscardRow() to filter rows. Using SQL Views to filter is more efficient than RowSelect PeopleCode."},
  {cat:"PeopleCode Basics",q:"What does Error() in FieldEdit do?",opts:["Logs to server console","Prevents tabbing out and highlights the field in red","Cancels the component","Sends an email"],ans:1,exp:"Error() in FieldEdit prevents accepting the new value. The field is highlighted and the user must correct it or revert. Use Warning() to allow the value but show a caution."},
  {cat:"PeopleCode Basics",q:"Where does PeopleCode execute in PIA architecture?",opts:["In the browser","In Oracle PL/SQL","In the Tuxedo App Server","In WebLogic"],ans:2,exp:"All PeopleCode runs server-side in the Tuxedo Application Server. Zero business logic in the browser."},
  {cat:"PeopleCode Basics",q:"What is Meta-SQL?",opts:["Syntax for creating DB tables","PeopleSoft SQL functions like %CurrentDateIn and %Table() that resolve correctly for any supported database","Pre-built SQL reports","Encrypted SQL"],ans:1,exp:"Meta-SQL makes PeopleCode database-independent. %CurrentDateIn resolves to the correct date syntax for Oracle/SQL Server/DB2. %Table(NAME) resolves to PS_NAME."},
  {cat:"PeopleCode Basics",q:"What does SavePostChange fire after?",opts:["Before DB commit","After DB commit — for downstream updates","When user clicks Cancel","During search dialog"],ans:1,exp:"SavePostChange fires AFTER database commit. Cannot cancel the save. Use for downstream updates, notifications, integrations that depend on the committed data."},
  {cat:"PeopleCode Basics",q:"How do you make a field visible but not editable in PeopleCode?",opts:["JOB.DEPTID.Enabled = False","JOB.DEPTID.DisplayOnly = True","JOB.DEPTID.Visible = False","JOB.DEPTID.ReadOnly = True"],ans:1,exp:"DisplayOnly = True shows the value but prevents editing. Enabled = False grays the field out. Visible = False hides it completely."},
  {cat:"PeopleCode Basics",q:"When should you use Global scope?",opts:["For all variables","For values that persist across components for the entire user session","For loop counters","For DB query results"],ans:1,exp:"Global scope persists for the entire user session. Use very sparingly — only for truly session-wide data. Can cause subtle bugs between components."},
  {cat:"PeopleCode Basics",q:"What does RowInsert fire in response to?",opts:["A row being loaded from DB","A user adding a new row to a grid","The component opening","A row being deleted"],ans:1,exp:"RowInsert fires when a user adds a new row. Note: RowInit always fires after RowInsert — don't duplicate initialization code or it runs twice."},

  /* ── RECORDS, FIELDS & DATA MODEL (14) ── */
  {cat:"Records & Fields",q:"What database table does record 'JOB' create?",opts:["PSJOB","JOB_TABLE","PS_JOB","PS.JOB"],ans:2,exp:"PeopleSoft prefixes all SQL Table database tables with PS_. Record JOB becomes PS_JOB."},
  {cat:"Records & Fields",q:"Which record type should you use for values that should NEVER be stored in the database?",opts:["SQL Table","SQL View","Dynamic View","Derived/Work"],ans:3,exp:"Derived/Work records never create a database object. They exist only in the component buffer. Used for computed values, push buttons, and temporary variables."},
  {cat:"Records & Fields",q:"What is a SubRecord?",opts:["A record within a grid","A reusable set of fields embedded into other records","A view joining two records","A temp record for batch"],ans:1,exp:"A SubRecord is a reusable field group. Including it in a record adds all its fields to the parent table. EFFDT_SBR (EFFDT + EFFSEQ) is the most important example."},
  {cat:"Records & Fields",q:"PeopleSoft fields are defined:",opts:["Inside record definitions","Globally — one definition reused across hundreds of records","Per page","Inside PeopleCode"],ans:1,exp:"Fields are defined globally and independently. The same field EMPLID can be in 400+ records. Change the label once and it updates everywhere automatically."},
  {cat:"Records & Fields",q:"What does an Alternate Search Key (A) field property do?",opts:["Makes the field the primary key","Creates a database index enabling efficient searching without making it the primary key","Prevents field from appearing in search results","Makes the field required"],ans:1,exp:"Alternate Search Key creates a DB index for efficient searching. For example, LAST_NAME as A on PS_NAMES allows fast employee name searches."},
  {cat:"Records & Fields",q:"What does a SQL View record create?",opts:["A permanent read-write table","A database view — read-only","A temporary table","A stored procedure"],ans:1,exp:"SQL View records create a permanent read-only database view. Used for security views, reporting, and joining related tables."},
  {cat:"Records & Fields",q:"What is the Temp Table record type used for?",opts:["Storing user session data","Parallel batch processing by Application Engine — multiple instances prevent collision","Storing debug logs","Caching reference data"],ans:1,exp:"Temp Tables allow multiple parallel AE instances (MYTEMP_AET, MYTEMP_AET1, MYTEMP_AET2) to work simultaneously without data collision."},
  {cat:"Records & Fields",q:"What does a List Box Item (L) field property mean?",opts:["Field appears as search filter","Field appears as a column in the search results list","Field is required for Add mode","Field triggers a lookup"],ans:1,exp:"List Box Items appear as columns in the search results list — helping users identify which row to select."},
  {cat:"Records & Fields",q:"After defining a SQL Table record, what creates the physical database table?",opts:["Saving the record definition","Build → Current Object → Create Table","Restarting the App Server","Running a DMS script"],ans:1,exp:"Saving only stores the metadata. Build → Create Table generates and executes the CREATE TABLE DDL to physically create PS_RECORDNAME in the database."},
  {cat:"Records & Fields",q:"Why does the PS_ prefix exist on all PeopleSoft tables?",opts:["Performance improvement","Distinguishes application tables from PeopleTools metadata tables","Required by Oracle","Required for indexing"],ans:1,exp:"The PS_ prefix distinguishes PeopleSoft application data tables from PeopleTools system tables (PSRECDEFN, PSDBFIELD) and database system tables."},
  {cat:"Records & Fields",q:"How many record types does PeopleSoft support?",opts:["3","5","7","10"],ans:2,exp:"7 record types: SQL Table, SQL View, Dynamic View, Derived/Work, SubRecord, Query View, and Temp Table."},
  {cat:"Records & Fields",q:"How does a Dynamic View differ from a SQL View?",opts:["Dynamic Views are faster","Dynamic View resolves SQL at runtime with no DB object; SQL View creates a permanent DB view","Dynamic Views support inserts","No difference"],ans:1,exp:"SQL View creates a permanent database view object. Dynamic View stores SQL that resolves at runtime creating no database object — allowing runtime-specific filtering."},
  {cat:"Records & Fields",q:"What happens when you change a global field label?",opts:["Only the first record updates","Must update each record separately","Updates everywhere the field is used automatically","Only takes effect after upgrade"],ans:2,exp:"Global field label changes propagate automatically to every record, page, grid, and search dialog that uses the field — no additional developer work."},
  {cat:"Records & Fields",q:"What is a Query View record?",opts:["Created by App Designer for reporting","Created and managed by PS Query — used when a query result becomes source for another query","Displays query execution plans","Stores saved PS Query definitions"],ans:1,exp:"Query View records are created by PS Query. They allow one query's results to be the source for another — enabling complex nested query scenarios."},

  /* ── EFFECTIVE DATING (10) ── */
  {cat:"Effective Dating",q:"What happens to PS_JOB when an employee gets a promotion?",opts:["The row is updated","The old row deleted, new one created","A new row inserted with promotion's EFFDT — old row stays permanently","Row archived to PS_JOB_HIST"],ans:2,exp:"Effective dating = INSERT not UPDATE. A new row is added with the new EFFDT and ACTION=PRO. The original hire row remains permanently."},
  {cat:"Effective Dating",q:"What does EFFSEQ handle?",opts:["Display order on page","Multiple changes on the same Effective Date — sequenced 0, 1, 2","Version number of a record","Approval sequence"],ans:1,exp:"EFFSEQ distinguishes multiple changes on the same date. First change EFFSEQ=0, second EFFSEQ=1. The row with the highest EFFSEQ for a date is most current."},
  {cat:"Effective Dating",q:"To get the current row from PS_JOB, your WHERE clause needs:",opts:["WHERE EFFDT = TODAY","WHERE CURRENT = Y","WHERE EFFDT = (SELECT MAX(EFFDT)...WHERE EFFDT <= today) AND EFFSEQ = MAX(EFFSEQ)","WHERE ROW_STATUS = CURRENT"],ans:2,exp:"Standard pattern: correlated subquery for MAX(EFFDT) on or before today, then MAX(EFFSEQ) for that date. Fundamental PeopleSoft SQL knowledge."},
  {cat:"Effective Dating",q:"What is a future-dated row?",opts:["A deleted row kept for audit","A row with EFFDT > today — in DB now but not yet current","A row that failed validation","A row created overnight by batch"],ans:1,exp:"Future-dated rows have EFFDT > today. They exist in the DB now but won't become current until their date arrives."},
  {cat:"Effective Dating",q:"Why might PS_JOB have 20+ rows for one employee?",opts:["Data integrity error","Each row is a job change (hire, transfer, promotion, pay change) — effective dating preserves all history","Each row is a different EMPL_RCD","Audit logging copies rows"],ans:1,exp:"Every job change (ACTION) creates a new PS_JOB row. An employee with 10+ years and many changes could easily have 30+ rows. This is by design."},
  {cat:"Effective Dating",q:"What is Correction Mode?",opts:["Automatically fixes data errors","Allows authorized users to modify historical effective-dated rows","A read-only view of past data","A developer debug tool"],ans:1,exp:"Correction Mode lets authorized users modify historical rows directly. Tightly security-controlled because retroactive changes can trigger payroll recalculation."},
  {cat:"Effective Dating",q:"Most common mistake querying PS_JOB?",opts:["Wrong database","Not including BUSINESS_UNIT","Missing effective dating WHERE clause — returns ALL historical rows causing duplicates","Using LIKE instead of ="],ans:2,exp:"Missing EFFDT criteria returns all 30+ rows per employee — causing duplicates and wrong calculations in any report or integration."},
  {cat:"Effective Dating",q:"What does EFFDT_SBR typically contain?",opts:["EFFDT, EFFSEQ, STATUS","Only EFFDT","EFFDT and EFFSEQ","EFFDT and ACTION"],ans:2,exp:"EFFDT_SBR is a SubRecord containing EFFDT and EFFSEQ — included in hundreds of records to implement effective dating consistently."},
  {cat:"Effective Dating",q:"What does the ACTION field in PS_JOB store?",opts:["Approval status","Type of change (HIR=Hire, PRO=Promotion, TER=Termination, PAY=Pay Change)","Unique ID of the change","Name of person who made the change"],ans:1,exp:"ACTION stores the type of job change. Combined with ACTION_REASON, it tells the complete story of every change in an employee's career history."},
  {cat:"Effective Dating",q:"Why is effective dating critical for payroll?",opts:["It determines who processes payroll","It enables retroactive pay — backdated corrections allow recalculation of previous periods using historical rows","It prevents duplicate runs","It controls who gets paid"],ans:1,exp:"Effective dating enables retroactive payroll. Historical rows are never deleted, so payroll can recalculate any past period if a salary or job change is backdated."},

  /* ── PAGES, COMPONENTS & NAVIGATION (10) ── */
  {cat:"Pages & Components",q:"What is a Component in PeopleSoft?",opts:["A single page definition","Pages sharing the same buffer that save together as one transaction","A JavaScript widget","A reusable PeopleCode block"],ans:1,exp:"A Component groups related pages into one transaction. All pages share the Component Buffer and save atomically."},
  {cat:"Pages & Components",q:"What does the Search Record define?",opts:["Stores PeopleCode programs","Fields in the search dialog before opening the component","Which App Server handles the request","Default values for the component"],ans:1,exp:"The Search Record drives the search dialog — which fields appear as criteria and which appear as result columns."},
  {cat:"Pages & Components",q:"What is a Sub Page?",opts:["A secondary search dialog","A reusable page fragment embedded into other pages for common field groups","A hidden page","The second tab in a component"],ans:1,exp:"A Sub Page is a reusable page fragment embedded inside other pages. Used for common fields like address blocks that appear in multiple components."},
  {cat:"Pages & Components",q:"What is a Content Reference (CREF) in Fluid?",opts:["A database view","A Portal Registry entry pointing to a component — required for users to navigate to it","A PeopleCode function type","A security role"],ans:1,exp:"A CREF registers a component in the Portal Registry with its label, location, and security. Without it users cannot navigate to the component."},
  {cat:"Pages & Components",q:"Which control displays multiple child rows in a modern page?",opts:["Scroll Area","Group Box","Grid","Frame"],ans:2,exp:"Grid is the modern replacement for Scroll Area. Supports sorting, filtering, pagination. All new development uses Grids."},
  {cat:"Pages & Components",q:"A user sees a page but all fields are gray and uneditable. Most likely cause?",opts:["Database is read-only","Permission List grants Display Only instead of Update/Display","App Server overloaded","Browser doesn't support the component"],ans:1,exp:"Display Only access mode in the Permission List means read-only. The administrator must change the access mode to Update/Display."},
  {cat:"Pages & Components",q:"What does the Add Search Record define?",opts:["A secondary advanced filter search","The search record specifically for Add mode — can differ from main Search Record","For searching archived data","For admin access only"],ans:1,exp:"The Add Search Record is used when a user clicks Add. In Add mode, users enter key values for the new record being created."},
  {cat:"Pages & Components",q:"What is a Work Page?",opts:["Visible to developers only","Hidden page backed by Derived/Work records — holds temporary values not shown to users","The first page users see","Used only during batch processing"],ans:1,exp:"Work Pages are hidden pages backed by Derived/Work records. They store temporary values and calculations needed by PeopleCode but not shown to users."},
  {cat:"Pages & Components",q:"What are Folder Tabs in a Component?",opts:["File management tabs in App Designer","Tab labels at top of component for navigating between pages","User bookmarks","Navigation breadcrumbs"],ans:1,exp:"Folder Tabs appear when a component has multiple pages. Users click tabs to navigate between pages. All pages share the buffer and save together."},
  {cat:"Pages & Components",q:"What is a Tile in Fluid UI?",opts:["A database partition","A large clickable button on a Fluid Homepage linking to a component","A PeopleCode event type","A breadcrumb"],ans:1,exp:"Tiles are the large clickable buttons on Fluid Homepages. Each is a CREF with an image and optional dynamic badge count."},

  /* ── COMPONENT BUFFER & ROWSETS (8) ── */
  {cat:"Component Buffer",q:"What is the Component Buffer?",opts:["HTML cache on web server","In-memory data structure in App Server holding all current transaction data","A DB table for temp data","Browser local storage"],ans:1,exp:"The Component Buffer holds all component transaction data in App Server memory. PeopleCode reads/writes here. Only Save writes to the database."},
  {cat:"Component Buffer",q:"How do you get the Level 1 Rowset in PeopleCode?",opts:["GetRowset()","GetLevel1Rowset()","GetRowset(Scroll.RECORDNAME)","GetChildRowset(NAME)"],ans:2,exp:"GetRowset(Scroll.RECORDNAME) returns the Level 1 rowset. GetRowset() alone returns Level 0 (primary record, 1 row)."},
  {cat:"Component Buffer",q:"Difference between ActiveRowCount and RowCount?",opts:["Identical","ActiveRowCount excludes deleted rows; RowCount includes them","ActiveRowCount includes future rows","RowCount is faster"],ans:1,exp:"Always use ActiveRowCount in loops — it excludes rows marked for deletion. RowCount includes deleted rows."},
  {cat:"Component Buffer",q:"What does JOB.DEPTID.Value = 'HR001' in PeopleCode do?",opts:["Immediately updates PS_JOB in DB","Writes to Component Buffer only — DB updates only on Save","Creates a new PS_JOB row","Triggers a DB trigger"],ans:1,exp:"Field assignments write to the in-memory buffer. PS_JOB in DB still has the old value until SavePreChange executes the SQL."},
  {cat:"Component Buffer",q:"Which class do you use to iterate multiple buffer rows?",opts:["Array","Rowset","RecordSet","DataBuffer"],ans:1,exp:"The Rowset class represents a collection of rows. GetRowset(), then GetRow(n), then ActiveRowCount for iteration count."},
  {cat:"Component Buffer",q:"What is Level 0 in Component Buffer hierarchy?",opts:["The database tier","The primary record — always exactly one row","The first grid on the page","App Server memory layer"],ans:1,exp:"Level 0 is the primary record — always exactly one row. Child scrolls/grids are at Level 1."},
  {cat:"Component Buffer",q:"What does GetRecord(Record.RECORDNAME) return?",opts:["A database result set","The Record object from the current row for accessing Field objects","A copy of the database table","A new empty record definition"],ans:1,exp:"GetRecord returns a Record object from which you access Field objects: &rec.DEPTID.Value."},
  {cat:"Component Buffer",q:"What happens if you forget &sql.Close() after CreateSQL?",opts:["Nothing — auto-closes","A DB cursor remains open — can exhaust connection resources especially in RowInit","PeopleCode compile error","Next SQL fails"],ans:1,exp:"Forgetting .Close() leaves an open cursor. In RowInit with many rows this can exhaust database cursor limits. Always call &sql.Close()."},

  /* ── PS QUERY & SECURITY (8) ── */
  {cat:"PS Query & Security",q:"What are the three PS Query types based on sharing?",opts:["Public, Private, Admin","User (private), Role (shared), Public (all users with access)","Read-only, Read-write, Admin","Basic, Advanced, Expert"],ans:1,exp:"User Queries are private. Role Queries are shared with users having a specific Role. Public Queries are accessible to all users with Query access."},
  {cat:"PS Query & Security",q:"PeopleSoft security hierarchy top to bottom?",opts:["Permission List → Role → User","User → Role → Permission List","Role → User → Permission List","Permission List → User → Role"],ans:1,exp:"Users are assigned Roles. Roles bundle Permission Lists. Permission Lists define actual security (pages, processes, query trees)."},
  {cat:"PS Query & Security",q:"What does row-level security control?",opts:["Which DB rows the DBA sees","Which data rows a user can see within accessible components","How many rows a query returns","Sort order in grids"],ans:1,exp:"Row-level security controls which DATA rows a user accesses — not just pages. An HR admin with Job Data access may only see their authorized departments."},
  {cat:"PS Query & Security",q:"What is a PS Query Prompt?",opts:["A help tooltip","A runtime parameter — user enters a filter value each time they run the query","A mandatory WHERE field","A join condition"],ans:1,exp:"Prompts make queries dynamic. Instead of hardcoding criteria, users enter values at runtime — making one query reusable for many use cases."},
  {cat:"PS Query & Security",q:"Most dangerous mistake in a custom component showing employee data?",opts:["Too few grid columns","Using PS_JOB as Search Record instead of a security view — bypasses row-level security","Not registering in Portal","Too many tabs"],ans:1,exp:"Using PS_JOB directly as Search Record bypasses row-level security — all users see all employees. Always use a security view as the Search Record."},
  {cat:"PS Query & Security",q:"What is a Translate Value (XLAT)?",opts:["Language translation of labels","Short code list (max 4 chars) in PSXLATITEM — for stable values like EMPL_STATUS and ACTION","A DB view for FK lookups","A PeopleCode string function"],ans:1,exp:"Translate Values (XLAT) store short stable code lists. EMPL_STATUS (A=Active, T=Terminated), ACTION (HIR, PRO, TER). Max 4-character values."},
  {cat:"PS Query & Security",q:"Correct action when a Translate Value becomes obsolete but exists in live data?",opts:["Delete it","Mark Inactive with effective date — disappears from dropdowns but old data stays valid","Replace it everywhere","Leave it active"],ans:1,exp:"Never delete a live XLAT value — it breaks existing records. Mark it Inactive. New entries can't use it but historical records remain valid."},
  {cat:"PS Query & Security",q:"What is a Query Access Tree?",opts:["Visual hierarchy of query results","Security configuration in Permission Lists controlling which DB tables users can query","Organization of saved queries","Performance optimization tool"],ans:1,exp:"Query Access Trees in Permission Lists control which PeopleSoft records users can build queries against — preventing access to sensitive tables."},

  /* ── REAL PROJECT SCENARIOS (12) ── */
  {cat:"Real Project Scenario",isScenario:true,q:"A page loads very slowly. SQL trace shows 500 identical SELECTs against PS_DEPT_TBL. What is the likely cause?",opts:["PS_DEPT_TBL needs an index","Developer put SQLExec in RowInit — grid has 500 rows = 500 SQL calls","DB server is undersized","Too few PSAPPSRV processes"],ans:1,exp:"Classic N+1 problem: SQLExec in RowInit × 500 rows = 500 SQL calls. Fix: pre-fetch in PostBuild once, or use a SQL View joining department names directly."},
  {cat:"Real Project Scenario",isScenario:true,q:"User says: I can see the component but cannot save. No error appears. First check?",opts:["Restart App Server","Check Permission List access mode — likely Display Only instead of Update/Display","Check for DB locks","Clear browser cache"],ans:1,exp:"When a user can view but not save with no error, check the Permission List access mode first. Display Only = read only. Change to Update/Display for edit access."},
  {cat:"Real Project Scenario",isScenario:true,q:"Custom component uses PS_JOB as Search Record. HR coordinator sees all employees in UAT — even outside their department. What is wrong?",opts:["PeopleCode is wrong","Search Record should be a security view joining PS_JOB with row-level security tables","Permission List needs update","Component needs a new key field"],ans:1,exp:"PS_JOB as Search Record bypasses row-level security. Replace with a security view (PS_JOB_SRCH_VW) that joins with the department security table — filters automatically."},
  {cat:"Real Project Scenario",isScenario:true,q:"You define a new SQL Table record, save it, add it to a page. SQL error: 'PS_MYRECORD does not exist'. What did you forget?",opts:["Add fields","Run Build → Create Table to generate the physical database table","Register in Portal","Assign a search key"],ans:1,exp:"Defining the record only creates metadata. You must run Build → Current Object → Create Table to execute the CREATE TABLE DDL that creates the physical table."},
  {cat:"Real Project Scenario",isScenario:true,q:"After a PeopleSoft upgrade, your customization is overwritten. What should you have done?",opts:["Never customize","Used Event Mapping (PT 8.55+) or cloned delivered objects with a custom prefix","Submitted a bug to Oracle","Created a separate database"],ans:1,exp:"Oracle-delivered objects are overwritten in upgrades. Best practice: clone with your prefix (ZZ_JOB) and modify the clone. For PT 8.55+, Event Mapping avoids touching delivered objects entirely."},
  {cat:"Real Project Scenario",isScenario:true,q:"Payroll batch shows Error status in Process Monitor. First two steps to diagnose?",opts:["Restart DB server","Click into process → view log file, then check Run Control parameters","Call Oracle support","Resubmit unchanged"],ans:1,exp:"Step 1: Process Monitor → View Log Files → find the actual error message. Step 2: Check Run Control parameters — correct dates, valid data? 90% of batch failures are diagnosed from the log."},
  {cat:"Real Project Scenario",isScenario:true,q:"Employee report shows wrong department for last January even though today's record looks correct. Why?",opts:["Report has a calculation bug","Report is not using effective dating — showing today's row instead of January's row","Record is corrupted","DB backup is outdated"],ans:1,exp:"The report fetches current data (today's row) instead of point-in-time data. Effective-dated reports need WHERE EFFDT <= report_date. Without it you always see today's state."},
  {cat:"Real Project Scenario",isScenario:true,q:"Need to display department names in a custom grid with 200 employee rows. Most efficient approach?",opts:["SQLExec in RowInit per row","Create a SQL View joining PS_JOB with PS_DEPT_TBL — bind view to grid","Use PostBuild with 200 SQLExec calls","Hidden field in FieldChange"],ans:1,exp:"Create a SQL View joining PS_JOB and PS_DEPT_TBL with proper effective dating. The database JOIN runs once in one SQL statement instead of 200 individual lookups. Correct architectural approach."},
  {cat:"Real Project Scenario",isScenario:true,q:"Client asks to add a new field to delivered record PS_JOB. What should you do?",opts:["Add field directly to PS_JOB","Create extension record (ZZ_JOB_EXT) with same keys + your custom fields","Create a completely new component","Ask Oracle to add the field"],ans:1,exp:"Never add fields to delivered records — overwritten in upgrades. Create an extension record with your prefix and the same key fields. Link it to the component alongside the delivered record. Upgrade-safe."},
  {cat:"Real Project Scenario",isScenario:true,q:"PS Query joining PS_PERSONAL_DATA with PS_JOB returns 5x expected rows. Most likely cause?",opts:["Wrong join key","Missing effective dating on PS_JOB — all historical rows create a near-Cartesian product","Running against wrong DB","Syntax error in query"],ans:1,exp:"Missing EFFDT criteria on PS_JOB causes a cross-join: 1 PERSONAL_DATA row × 20+ JOB rows per employee. Always add MAX(EFFDT) <= today criteria on effective-dated tables in joins."},
  {cat:"Real Project Scenario",isScenario:true,q:"Built and tested a component in DEV. Migrated to QA. Users say page doesn't appear in menu. What did you miss?",opts:["PeopleCode bug","Migrated App Designer objects but not the Portal Registry CREF — they must be migrated separately","Permission List not updated","DB table not built in QA"],ans:1,exp:"App Designer objects and Portal CREFs migrate separately. The CREF that makes the component appear in the NavBar is a Portal object — not in a standard App Designer project unless explicitly added."},
  {cat:"Real Project Scenario",isScenario:true,q:"A PeopleCode variable is set in PostBuild but not used in the same program. In which scope was it declared?",opts:["Local — value is lost","Component — read by another event in the same transaction","Always useless","Global — set for another session"],ans:1,exp:"This is the correct use of Component scope: set a flag in PostBuild (&isNewHire = True) and read it later in SaveEdit. Component variables persist across all events in the transaction."},
];

const GLOSSARY = [
  // Architecture
  {term:"PIA (Pure Internet Architecture)",cat:"architecture",def:"The three-tier web architecture PeopleSoft has used since version 8. Browser communicates with WebLogic web server, which communicates with Tuxedo App Server via JOLT, which communicates with the database via SQL. No business logic runs in the browser."},
  {term:"Tuxedo",cat:"architecture",def:"Oracle Tuxedo is the middleware that powers PeopleSoft's Application Server tier. It manages server processes (PSAPPSRV, PSQRYSRV, PSSAMSRV) and handles all PeopleCode execution, Component Processor operations, and database communication."},
  {term:"WebLogic",cat:"architecture",def:"Oracle WebLogic Server is the web tier in PeopleSoft PIA. It hosts PeopleSoft's Java-based web application and handles HTTP/HTTPS from browsers, forwarding requests to Tuxedo via the JOLT port. Contains zero business logic."},
  {term:"JOLT",cat:"architecture",def:"Java Object Linking and Transactions — the proprietary protocol used by WebLogic to communicate with the Tuxedo Application Server. The JOLT port (typically 9000) is the connection point between the web tier and the application tier."},
  {term:"PSAPPSRV",cat:"architecture",def:"The core Application Server process in Tuxedo. Handles component buffer operations, PeopleCode execution, and SQL generation. Multiple PSAPPSRV processes run simultaneously to handle concurrent users."},
  {term:"Domain",cat:"architecture",def:"An instance of the Tuxedo Application Server or Process Scheduler. A single PeopleSoft environment typically has one App Server domain and one Process Scheduler domain. High-availability setups can have multiple domains for load balancing."},
  {term:"DPK (Deployment Package)",cat:"architecture",def:"A set of Puppet-based scripts and configuration files used to automate the installation and configuration of PeopleSoft environments. Standard from PeopleTools 8.55+. Reduces a multi-day manual install to hours."},
  {term:"PUM (PeopleSoft Update Manager)",cat:"architecture",def:"Oracle's selective patching tool introduced around 2014. Instead of applying full bundles, organizations browse a PeopleSoft Image VM and selectively apply individual fixes and features. Released quarterly per product line."},
  {term:"PeopleSoft Image",cat:"architecture",def:"An Oracle VirtualBox virtual machine pre-built with all PeopleTools patches and application fixes up to a certain point. Used as the source for PUM updates. Organizations connect their environment to the Image to browse and apply updates."},
  // Technical / Development
  {term:"Record",cat:"technical",def:"In PeopleSoft, a Record is the metadata definition of a table or view — NOT a row of data. A SQL Table record named JOB creates the physical database table PS_JOB when built. Records are created and managed in Application Designer."},
  {term:"PS_ Prefix",cat:"technical",def:"Every PeopleSoft application data table in the database is prefixed with PS_. The record named JOB becomes PS_JOB, the record PERSONAL_DATA becomes PS_PERSONAL_DATA. This distinguishes application tables from PeopleTools metadata tables."},
  {term:"Component Buffer",cat:"technical",def:"The in-memory data structure managed by the Component Processor that holds all data for the current transaction. When a user opens a page, data loads into the buffer. PeopleCode reads/writes to the buffer. Only on Save does the buffer write to the database."},
  {term:"Component Processor",cat:"technical",def:"The runtime engine within the Tuxedo App Server that manages the full lifecycle of a PeopleSoft transaction — loading data into the Component Buffer, firing PeopleCode events in the correct order, and writing changes back to the database on Save."},
  {term:"Derived/Work Record",cat:"technical",def:"A record type that creates no database object. Exists only in the component buffer during a transaction. Used for computed values shown on pages, push buttons that trigger PeopleCode, and temporary variables. Fields in Derived/Work records are never saved to a table."},
  {term:"SubRecord",cat:"technical",def:"A reusable set of fields that can be embedded into other records. When included, PeopleSoft adds all SubRecord fields to the parent record's table. The most important example is EFFDT_SBR (containing EFFDT and EFFSEQ) used in hundreds of effective-dated records."},
  {term:"Temp Table",cat:"technical",def:"A record type used by Application Engine for parallel batch processing. Multiple instances (MYTEMP_AET, MYTEMP_AET1, MYTEMP_AET2) can exist simultaneously, allowing parallel AE processes to work on separate data sets without collisions."},
  {term:"Meta-SQL",cat:"technical",def:"PeopleSoft-specific SQL functions that are database-independent. %CurrentDateIn resolves to the correct date format for Oracle, SQL Server, or DB2. %Table(RECORDNAME) resolves to PS_RECORDNAME. %Bind(FIELD) inserts a bind variable value."},
  {term:"Translate Values (XLAT)",cat:"technical",def:"Short code lists stored in the PSXLATITEM table. Used for fields with short (max 4-character) stable values like EMPL_STATUS (A=Active, T=Terminated) and ACTION (HIR=Hire, PRO=Promotion). Values are effective-dated and display as Drop Down lists on pages."},
  {term:"Prompt Table",cat:"technical",def:"A record or view used to validate field input against a database table. When a user enters a value, PeopleSoft checks it exists in the Prompt Table. A magnifying glass icon opens a lookup dialog showing available values."},
  {term:"Run Control",cat:"technical",def:"A database record that stores parameters a user enters before running a batch process. Keyed by user ID and a user-defined name. The batch process reads parameters from the Run Control table since it cannot prompt the user interactively."},
  {term:"Project",cat:"technical",def:"A container in Application Designer that groups related PeopleSoft objects for migration between environments. When development is complete in DEV, the Project is migrated to QA and then PROD. Projects are the unit of change management in PeopleSoft."},
  // PeopleCode / Development
  {term:"PeopleCode",cat:"development",def:"PeopleSoft's proprietary event-driven programming language. Runs server-side within the Tuxedo App Server. Always attached to a specific event on a specific object. Resembles a hybrid of Java and Basic. Case-insensitive for keywords."},
  {term:"RowInit",cat:"development",def:"A PeopleCode event that fires for every row loaded into the component buffer. If a grid has 100 rows, RowInit fires 100 times. Placing SQLExec in RowInit causes N+1 query problems — one of the most common performance anti-patterns."},
  {term:"PostBuild",cat:"development",def:"A component-level PeopleCode event that fires once after the entire component is fully built — after all RowInit and FieldDefault events have run. The ideal location for show/hide logic and page configuration that depends on the fully loaded component."},
  {term:"SaveEdit",cat:"development",def:"A component-level PeopleCode event that fires during the save process. Using Error() in SaveEdit prevents the save and displays an error. The standard location for cross-field business rule validation. Most commonly used save event."},
  {term:"FieldChange",cat:"development",def:"A field-level PeopleCode event that fires when a user changes a field value on the page. Used to dynamically update other fields, show/hide controls, or validate related fields based on the changed value."},
  {term:"SavePostChange",cat:"development",def:"A component-level PeopleCode event that fires after data has been committed to the database. Used for downstream updates, notifications, and integration triggers. Cannot cancel the save — the DB commit has already happened."},
  {term:"SQLExec",cat:"development",def:"A PeopleCode built-in function for single-row SQL queries. Takes a SQL string, bind values, and output variables. If no row is found, output variables are set to empty/zero. Avoid using SQLExec in RowInit — it creates N+1 query problems."},
  {term:"CreateSQL",cat:"development",def:"A PeopleCode built-in function for multi-row SQL queries. Returns a SQL object. Use .Fetch() in a While loop to iterate through rows. Always call .Close() when done. More efficient than multiple SQLExec calls for multi-row results."},
  {term:"Rowset",cat:"development",def:"A PeopleCode object representing a collection of rows — essentially a grid or scroll. Use GetRowset(Scroll.RECORDNAME) to get a Level 1 rowset. Navigate with GetRow(n), GetRecord(), and ActiveRowCount. The primary way to work with multi-row data in PeopleCode."},
  {term:"Local / Component / Global",cat:"development",def:"PeopleCode variable scopes. Local: exists only for the current program execution. Component: persists for the entire component transaction. Global: persists for the entire user session. Always use Local unless you have a specific reason to use a wider scope."},
  // HCM Terms
  {term:"EMPLID",cat:"hcm",def:"Employee ID — the unique identifier assigned to each employee in PeopleSoft HCM. Every HR table uses EMPLID as a primary key. One person always has one EMPLID even if they hold multiple jobs (distinguished by EMPL_RCD)."},
  {term:"EMPL_RCD (Employee Record Number)",cat:"hcm",def:"Some employees have more than one concurrent employment. Each employment is a separate Employee Record numbered 0, 1, 2, etc. EMPLID + EMPL_RCD together uniquely identify a single job in PS_JOB."},
  {term:"EFFDT (Effective Date)",cat:"hcm",def:"A date field used in hundreds of PeopleSoft tables to implement effective dating. Instead of overwriting data, PeopleSoft inserts a new row with a new EFFDT. The 'current' row is the one with the max EFFDT on or before today."},
  {term:"EFFSEQ (Effective Sequence)",cat:"hcm",def:"Handles multiple changes on the same effective date. First change = EFFSEQ 0, second = EFFSEQ 1. The most current row for a date is the one with the highest EFFSEQ. Works together with EFFDT to uniquely identify a point in time."},
  {term:"Action / Action Reason",cat:"hcm",def:"Every change to PS_JOB is recorded with an Action code (HIR=Hire, TER=Termination, PRO=Promotion, PAY=Pay Rate Change) and an Action Reason code explaining why the change was made. Together they tell the complete story of every personnel change."},
  {term:"Position",cat:"hcm",def:"A budgeted organizational slot that can be filled by an employee. Positions belong to departments, have job codes, and carry salary grade information. Position Management links HR headcount to Finance budget."},
  {term:"HCM (Human Capital Management)",cat:"hcm",def:"The most widely deployed PeopleSoft product. Manages the complete employee lifecycle: recruiting, onboarding, job data, compensation, benefits, payroll, time & labor, absence management, and talent management."},
  // FSCM Terms
  {term:"FSCM (Financial Supply Chain Management)",cat:"fscm",def:"PeopleSoft's Finance module covering General Ledger, Accounts Payable/Receivable, Asset Management, Purchasing, Inventory, Project Costing, and Billing. Financial data is organized using ChartFields."},
  {term:"ChartField",cat:"fscm",def:"The accounting code structure in FSCM. Common ChartFields include Account, Department, Business Unit, Fund Code, Program Code, and Project. Every financial transaction is stamped with ChartField values that determine how it posts to the General Ledger."},
  {term:"Business Unit",cat:"fscm",def:"The primary organizational entity in PeopleSoft — especially in FSCM. Every financial transaction is associated with a Business Unit. Represents a distinct part of an organization that maintains its own financial books."},
  {term:"SetID",cat:"fscm",def:"A code assigned to setup tables that controls which reference data applies to each Business Unit. Multiple Business Units can share the same SetID (and thus the same departments, job codes, etc.) while maintaining separate SetIDs for region-specific data."},
  {term:"TableSet",cat:"fscm",def:"The mechanism that links Business Units to SetIDs. TableSet Controls (PS_SET_CNTRL_TBL) define which SetID each Business Unit uses for each record group. Enables sharing of common reference data while allowing exceptions per Business Unit."},

  /* ── INTERMEDIATE TOPICS QUIZ (30Q) ── */
  /* Application Engine */
  {cat:"Application Engine",q:"What is the correct AE Action type to loop through rows from a SQL SELECT?",opts:["Do When","Do Select","Call Section","PeopleCode"],ans:1,exp:"Do Select executes a SELECT and for each returned row runs the child Steps. The most common AE looping pattern for batch processing."},
  {cat:"Application Engine",q:"What does CommitWork() do in Application Engine?",opts:["Ends the AE program","Commits current DB transaction mid-run without ending AE","Saves the Run Control record","Calls another AE program"],ans:1,exp:"CommitWork() commits current work and saves a checkpoint. Critical for large batch jobs — prevents massive rollback logs and allows restart from that point."},
  {cat:"Application Engine",q:"Why do Temp Tables have multiple instances (AET, AET1, AET2)?",opts:["For backup purposes","Each parallel AE process uses its own instance preventing data collision","To store different data types","For audit logging"],ans:1,exp:"Parallel AE instances each get their own Temp Table instance. %Table(MYTEMP) resolves differently per instance — preventing data overwrites between concurrent processes."},
  /* Component Interface */
  {cat:"Component Interface",q:"Why use Component Interface instead of direct SQL INSERT for employee hire?",opts:["CI is faster than SQL","CI fires all PeopleCode events ensuring business rules and workflow run","CI is required by Oracle license","SQL cannot insert into PS_JOB"],ans:1,exp:"CI fires FieldDefault, PostBuild, SaveEdit, WorkFlow — exactly like an online hire. Direct SQL bypasses all events, risking data integrity and missing downstream triggers."},
  {cat:"Component Interface",q:"What does setting InteractiveMode = False do on a CI?",opts:["Disables all PeopleCode","Batches validations for faster batch processing — events still fire on Save","Prevents the CI from saving","Disables error handling"],ans:1,exp:"InteractiveMode=False batches field-level validations instead of checking each field individually. All PeopleCode events still fire on Save. Significantly improves batch CI throughput."},
  /* Integration Broker */
  {cat:"Integration Broker",q:"What is the difference between Synchronous and Asynchronous IB messaging?",opts:["Sync is always faster","Sync waits for response before continuing — Async sends and continues immediately","Async is more secure","Sync uses REST, Async uses SOAP only"],ans:1,exp:"Synchronous: caller waits for response — like a phone call. Asynchronous: caller continues immediately, message queued — like email. Choose based on whether immediate response is required."},
  {cat:"Integration Broker",q:"What is the Integration Gateway in PeopleSoft?",opts:["The PeopleCode handler class","Entry point for all inbound messages — routes HTTP requests to Service Operations","The message queue database table","The Node configuration screen"],ans:1,exp:"Integration Gateway is a Java app on the web server receiving all inbound HTTP/HTTPS requests from external systems and routing them to the correct Service Operation in the App Server."},
  {cat:"Integration Broker",q:"What must you do after a failed async IB message to retry it?",opts:["Restart the App Server","Fix root cause then Resubmit from Integration Broker Monitor — Failed queue","Delete and resend from source system","Restart the Integration Gateway"],ans:1,exp:"IB Monitor → Asynchronous Services → Failed. Fix the root cause (URL, auth, data format), select the failed message, click Resubmit. Messages retry without needing to re-trigger the original transaction."},
  /* Security */
  {cat:"Security",q:"How does row-level security filter data for a specific user?",opts:["Through PeopleCode checking user ID on every page","Through a security view JOINing base table with PS_SCRTY_TBL_DEPT filtered by OPRCLASS","Through the Permission List access modes","Through Department Security Tree at runtime directly"],ans:1,exp:"Security views join the base table with PS_SCRTY_TBL_DEPT using %OperatorClass (user's Primary Permission List). The view auto-filters to only rows the user is authorized to see."},
  {cat:"Security",q:"What must be done after modifying the Department Security Tree?",opts:["Restart the App Server","Rebuild security tables to refresh PS_SCRTY_TBL_DEPT","Clear browser cache","Run the nightly payroll"],ans:1,exp:"The Security Tree is a definition — PS_SCRTY_TBL_DEPT is the physical table security views query. After tree changes, run the rebuild process to populate the table with the new structure."},
  /* Effective Dating Advanced */
  {cat:"Effective Dating",q:"A PS Query joining PS_PERSONAL_DATA and PS_JOB returns 15x expected rows. Root cause?",opts:["Wrong join field between records","Missing effective dating on PS_JOB creates near-Cartesian product","PS_PERSONAL_DATA has duplicate rows","Query is using wrong database"],ans:1,exp:"PS_PERSONAL_DATA: 1 row/employee. PS_JOB: 15+ rows/employee (one per job change). Without MAX(EFFDT) criteria: 1 × 15 = 15 rows per employee. Always add effective dating WHERE clause to PS_JOB joins."},
  {cat:"Effective Dating",q:"What is EFFSEQ and when is it needed?",opts:["Employee sequence number for concurrent jobs","Handles multiple changes on the same EFFDT — first change=0, second=1","A security sequence for audit","The order fields appear on a page"],ans:1,exp:"EFFSEQ handles same-date changes. If two promotions happen on the same date, first row=EFFSEQ 0, second=EFFSEQ 1. Current row = MAX(EFFDT) AND MAX(EFFSEQ) for that date. Both subqueries needed."},
  /* PS Query Advanced */
  {cat:"PS Query",q:"What is a Connected Query used for?",opts:["Running two queries simultaneously","Linking parent-child queries where parent output drives child parameters for hierarchical data","Connecting to external databases","Running same query for multiple users"],ans:1,exp:"Connected Queries create parent-child relationships. Parent runs first, then for each parent row the child runs using parent fields as parameters. Ideal for employee + job history master-detail reports."},
  {cat:"PS Query",q:"What is bursting in BI Publisher?",opts:["Running same report multiple times","Splitting one report and auto-distributing each section to different recipients","Exporting in multiple formats simultaneously","Breaking a large query into smaller chunks"],ans:1,exp:"Bursting splits a single report by a burst key (e.g. EMPLID) and delivers each section to the appropriate recipient automatically. Generate all pay slips in one run, email each employee their own."},
  /* Data Mover */
  {cat:"Data Mover",q:"What is the main limitation of Data Mover for data migration?",opts:["It is very slow for large datasets","It bypasses all PeopleCode — business rules, validation, and workflow do not fire","It only works in Bootstrap mode","It cannot handle effective-dated tables"],ans:1,exp:"DMS inserts directly into DB tables without firing PeopleCode events. For reference/setup data this is acceptable. For transactional data (hires, financial transactions) always use Component Interface."},
  {cat:"Data Mover",q:"What command clears existing rows before a DMS import?",opts:["TRUNCATE_TABLE","CLEAR_ROWS","DELETE_ROWS","REMOVE_DATA"],ans:2,exp:"DELETE_ROWS PS_TABLENAME removes all existing rows before import. This prevents duplicate key errors when re-importing data that already exists in the target environment."},
  /* Process Scheduler */
  {cat:"Process Scheduler",q:"What is the first step when diagnosing a slow PeopleSoft page?",opts:["Restart the App Server","Enable SQL trace to identify slow SQL and how many times it executes","Add more server memory","Reduce fields on the page"],ans:1,exp:"SQL trace is the definitive diagnostic tool. It shows every SQL executed with timing and row counts — revealing N+1 queries (SQLExec in RowInit), missing indexes, and missing effective dating."},
  {cat:"Process Scheduler",q:"How do you create a database index for a PeopleSoft record field?",opts:["Write CREATE INDEX SQL manually","Mark field as Alternate Search Key (A) in App Designer and run Build → Alter Table","Add to the primary key","Configure in PSADMIN"],ans:1,exp:"Marking a field as Alternate Search Key (A) causes PeopleSoft to create a non-unique DB index when you run Build → Alter Table. All index management is through App Designer metadata — no manual SQL."},
  /* Fluid UI */
  {cat:"Fluid UI",q:"What is the main difference between Fluid UI and Classic UI?",opts:["Fluid is always faster","Fluid uses responsive HTML5/CSS3 working on mobile/tablet/desktop — Classic uses fixed-width tables for desktop only","Fluid requires a different database","Classic UI has better security"],ans:1,exp:"Fluid UI (PT 8.53+) uses responsive HTML5/CSS3 with Oracle JET — works on any device. Classic uses fixed-width HTML tables designed for desktop only. All new Oracle functionality is Fluid-only."},
  {cat:"Fluid UI",q:"What is a Tile in PeopleSoft Fluid UI?",opts:["A database partition unit","A clickable card on a Fluid Homepage linking to a component — optionally showing a dynamic badge count","A PeopleCode function for grids","A security object controlling page access"],ans:1,exp:"Tiles are large clickable cards on Fluid Homepages. Each is a CREF with an image and optional badge count (from a PS Query counting pending items). Users click tiles to navigate to components."},
  /* Architecture Advanced */
  {cat:"Architecture",q:"What is connection pooling in PeopleSoft App Server?",opts:["Multiple App Server domains running simultaneously","App Server maintains persistent DB connections shared across PSAPPSRV processes","Each user gets a dedicated DB connection","Tuxedo bulletin board memory allocation"],ans:1,exp:"Connection pooling maintains a pool of persistent DB connections shared across PSAPPSRV processes. Individual user requests reuse connections from the pool rather than creating new ones — dramatically improves performance."},
  {cat:"Architecture",q:"What is PUM (PeopleSoft Update Manager)?",opts:["A performance monitoring utility","Selective patching system using PeopleSoft Image VMs — organizations choose exactly which fixes to apply","Annual bundle patching tool","Database migration utility"],ans:1,exp:"PUM replaced bundle patching (~2014). Oracle releases PS Image VMs with cumulative fixes. Organizations browse available updates, select exactly what to apply, generate a Change Package. Selective adoption without taking untested changes."},
  /* PeopleCode Advanced */
  {cat:"PeopleCode",q:"What variable scope persists for the entire component transaction (open to save)?",opts:["Local — current program only","Component — persists entire transaction across all events","Global — entire user session","Record — persists in the database"],ans:1,exp:"Component scope persists for the entire component transaction. Set a value in PostBuild, read it in SaveEdit. Local only lasts one program execution. Global lasts the whole user session — use sparingly."},
  {cat:"PeopleCode",q:"What is the risk of SQLExec inside a RowInit loop with 200 rows?",opts:["SQL syntax errors","200 separate database calls — classic N+1 performance problem","Buffer overflow","Effective dating issues"],ans:1,exp:"RowInit fires once per row. SQLExec inside RowInit = one DB call per row. 200 rows = 200 DB calls. Fix: pre-fetch all reference data in PostBuild using CreateSQL once, then read from memory in RowInit."},
  {cat:"PeopleCode",q:"What does SavePreChange fire relative to the database commit?",opts:["After the commit is complete","Just before the DB commit — buffer is final but data not yet written","Before SaveEdit runs","After SavePostChange"],ans:1,exp:"SavePreChange fires just BEFORE the DB commit. Buffer data is final. Last chance to manipulate buffer or create related records before the transaction commits. SavePostChange fires AFTER the commit."},
  /* Records & Fields Advanced */
  {cat:"Records & Fields",q:"Why should you never add fields directly to a delivered PeopleSoft record?",opts:["It causes performance issues","Delivered objects are overwritten during upgrades — your field disappears","It violates Oracle licensing","Fields must be added through Security"],ans:1,exp:"Oracle-delivered objects are replaced during upgrades. Fields added to PS_JOB directly = gone after next upgrade. Best practice: create extension record ZZ_JOB_EXT with same keys. Or use Event Mapping (PT 8.55+)."},
  {cat:"Records & Fields",q:"What is a SubRecord and what is EFFDT_SBR used for?",opts:["A child scroll in a component","Reusable field group embedded in records — EFFDT_SBR contains EFFDT+EFFSEQ used in hundreds of effective-dated records","A security view subtype","A temporary record for batch processing"],ans:1,exp:"SubRecords are reusable field groups. When included in a record, those fields become part of that table. EFFDT_SBR (EFFDT + EFFSEQ) is the standard SubRecord included in virtually every effective-dated record."},
  /* Real Project Scenarios */
  {cat:"Real Project Scenario",q:"After an upgrade your customization is gone. What was the root cause?",opts:["Database restore failed","You directly modified a delivered object — Oracle overwrote it during upgrade","Developer accidentally deleted it","Permission List was reset"],ans:1,exp:"Directly modified delivered objects are overwritten when Oracle delivers a new version. Always clone with custom prefix (ZZ_COMPNAME) before modifying, or use Event Mapping (PT 8.55+) for completely upgrade-safe customizations."},
  {cat:"Real Project Scenario",q:"You need to load 50,000 employee hires from a legacy system. Best approach?",opts:["Direct SQL INSERT into PS_JOB","Data Mover DMS script","Component Interface via Application Engine reading from a staging table","Manual entry by HR team"],ans:2,exp:"CI via AE ensures all business rules fire (FieldDefault, SaveEdit, workflow) for each hire. AE reads from staging table, calls CI per record, logs errors, supports restart. Direct SQL or DMS bypasses all business rules."},
  {cat:"Real Project Scenario",q:"A user can navigate to a component but Save does nothing — no error shown. Cause?",opts:["Component has no PeopleCode","Permission List grants Display Only access — Save is disabled","Database is in read-only mode","App Server is overloaded"],ans:1,exp:"Display Only access mode in Permission List = read-only. The Save button is hidden or disabled for the user. Fix: change component access mode to Update/Display in the user's Permission List for that component."},
];


/* ── ADVANCED TOPICS (10) ── */
const ADVANCED_TOPICS = [
  {
    id:"fluid-ui-advanced", module:12, num:"31",
    title:"Fluid UI Development",
    level:"advanced",
    summary:"Build modern responsive PeopleSoft interfaces using Fluid UI — homepages, tiles, Activity Guides, and Fluid components. Everything new Oracle delivers is Fluid-only.",
    preChecklist:["You completed Fluid UI Basics (Topic 30)","You understand Classic pages and components","You know what a CREF is"],
    keyPoints:[
      "Fluid pages use PeopleSoft Page Designer in Fluid mode — completely different controls from Classic",
      "Group Boxes replace Scroll Areas, Grids use Fluid styling, layout is CSS-based not table-based",
      "Fluid Homepages are configured via PeopleTools → Portal → Structure and Content",
      "Activity Guide Composer (PT 8.57+) creates step-by-step wizards without custom PeopleCode",
      "Related Actions provide right-click context menus on Fluid components linking to related transactions",
    ],
    sections:[
      {title:"Building a Fluid Page",body:`Fluid pages are created in Application Designer just like Classic pages but in Fluid mode.

**Key Fluid page controls:**
- **Group Box** — replaces Scroll Areas. Set Group Box type to Grid or Free Form
- **Grid** — the standard multi-row control in Fluid. Supports sorting, filtering, pagination, and responsive hiding of columns on small screens
- **Fluid Buttons** — styled differently from Classic. Use Push Button/Hyperlink with Fluid style
- **Responsive Tabs** — tab groups that collapse to a dropdown menu on mobile

**Page layout rules in Fluid:**
Fluid uses a 12-column fluid grid layout (like Bootstrap). Fields have column spans — EMPLID might take 4 columns, Name might take 8. On mobile, columns stack automatically.

**Setting page properties:**
In Application Designer → Page Properties → Fluid tab:
- Enable: Fluid Page checkbox
- Set fluid page type: Standard, Secondary, Popup
- Add page-level CSS class for custom styling

**Creating a simple Fluid component:**
1. Create records (same as Classic)
2. Create Fluid page — File → New → Page → check "Fluid Page" in properties
3. Add fields with Group Box containers
4. Create component, add Fluid page
5. Create CREF — mark as Fluid content
6. Add CREF to a Homepage as a Tile`},
      {title:"Activity Guides",body:`Activity Guides are structured step-by-step workflows guiding users through multi-component processes.

**Use cases:**
- New hire onboarding (Personal Data → Job Data → Benefits → Documents)
- Annual open enrollment (Medical → Dental → Vision → Beneficiaries → Confirm)
- Manager performance review workflow
- Student admission process

**Activity Guide Composer (PT 8.57+):**
PeopleTools → Activity Guides → AG Composer
Low-code tool — no PeopleCode needed for basic flows:
1. Create AG Template
2. Add Steps — each step maps to a Fluid component
3. Configure: required/optional, sequence, assignee
4. Deploy to users via CREF

**Progress Tracker:**
Visual step indicator showing: Completed ✓ → Current (highlighted) → Remaining steps
Renders automatically in the AG left panel — no coding needed.

**Conditional steps:**
Use AG Composer conditions to show/hide steps based on data. Example: show Benefits step only if employment type = Full Time.

**Performance tip:**
Each AG step loads a full component. Keep steps focused — don't put 10 fields on one step and 1 on another. Balance the steps for user experience.`},
      {title:"Related Actions",body:`Related Actions provide context-sensitive navigation — right-click or click a "…" menu on a Fluid component to access related transactions.

**What they replace:**
Classic UI had Related Content framework. Fluid's Related Actions are cleaner and mobile-friendly.

**Setting up Related Actions:**
PeopleTools → Portal → Related Actions → Define Related Action Services

1. Create a Related Action Service
2. Define the trigger (which component, which field/key)
3. Add target CREFs (components the user can navigate to)
4. Map key fields (e.g., EMPLID from Job Data maps to EMPLID parameter of Pay Rate Change)

**Example — from Job Data:**
User views Job Data for employee KR001 → clicks Related Actions icon → sees:
- View Pay History (opens with EMPLID=KR001)
- Transfer Employee (opens Transfer component pre-filled)
- View Benefits (opens with EMPLID=KR001)

**Security:** Related Actions respect component-level security — users only see actions for components they have access to.`},
      {title:"Fluid Homepages and Tile Configuration",body:`**Homepage configuration:**
PeopleTools → Portal → Structure and Content → Homepages

Each user can have multiple homepages (role-based):
- Manager Self Service Homepage
- Employee Self Service Homepage  
- HR Administrator Homepage

**Tile setup:**
1. Create CREF as usual
2. In CREF → Fluid Properties:
   - Tile Image: upload SVG/PNG (recommended: 200×200px SVG)
   - Tile Size: Small / Medium / Large / Extra-Large
   - Badge Query: PS Query ID for dynamic count badge
3. Add CREF to Homepage Tile Collection

**Dynamic badge configuration:**
Badge Query must return a number for the current user:
\`\`\`sql
SELECT COUNT(*) FROM PS_PENDING_APPROVALS
WHERE OPRID = %OperatorId
AND STATUS = 'P'
\`\`\`
Badge appears on the tile when count > 0. Updates on each homepage load.

**Tile Collections:**
Group related tiles into Collections. Drag to reorder. Users can personalize their homepage (add/remove/reorder tiles) if personalization is enabled.`},
    ],
    realWorld:`A manufacturing company with 8,000 employees needed to roll out Manager Self Service on mobile. Classic MSS pages were unusable on phones. Project: created 6 Fluid pages mirroring Classic MSS functionality, Activity Guide for the annual merit review process (4 steps: review salary ranges → enter merit increase → add comments → submit for approval), and Related Actions on the employee search component linking to all common HR transactions. Mobile adoption reached 74% within 3 months — managers approved compensation changes from phones during commutes.`,
    mistakes:[
      {title:"Building Fluid without a responsive design test",desc:"Fluid pages that look great on desktop often break on mobile. Test every Fluid page on a phone-sized viewport before deployment. Use Chrome DevTools device emulation. Pay special attention to Grids — they need explicit column hiding configuration for narrow screens."},
      {title:"Converting Classic pages instead of rebuilding",desc:"There is no automatic Classic-to-Fluid conversion. Attempts to 'wrap' Classic pages in Fluid containers produce ugly non-responsive results. Budget for a rebuild when Fluid is required — it's typically 2-3x the effort of the original Classic page."},
      {title:"Missing tile security alignment",desc:"Fluid tiles are CREFs — they must have matching Permission List security. A tile visible to a user that points to a component they don't have access to shows the tile but gives Access Denied on click. Always align tile CREF security with the underlying component's Permission List."},
    ],
    quiz:[
      {q:"What replaces Scroll Areas in Fluid page design?",options:["iScripts","Group Boxes set to Grid type","Derived Records","SubPages"],correct:1,explanation:"In Fluid, Group Boxes replace Scroll Areas. Set the Group Box type to Grid for multi-row display or Free Form for flexible layouts. Grids support responsive behavior — columns can hide on narrow screens."},
      {q:"What is Activity Guide Composer used for?",options:["Creating Fluid page layouts","Building step-by-step guided workflows without custom PeopleCode","Configuring Integration Broker","Managing PS Query access"],correct:1,explanation:"Activity Guide Composer (PT 8.57+) is a low-code tool for creating guided multi-step workflows. Add steps mapping to Fluid components, configure sequence and conditions — no PeopleCode needed for basic flows."},
      {q:"What does a dynamic badge count on a Fluid tile show?",options:["The tile ID number","A count from a PS Query — e.g. pending approvals for the current user","The component version number","Number of fields on the target page"],correct:1,explanation:"Badge counts come from a PS Query returning a number for the current user. The count appears on the tile — drawing attention when items need action. Common use: pending approvals, unread notifications, open tasks."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tflu/",
  },
  {
    id:"application-packages", module:13, num:"32",
    title:"Application Packages & OOP",
    level:"advanced",
    summary:"Application Packages bring object-oriented programming to PeopleCode — classes, inheritance, and encapsulation. Used for Event Mapping handlers, reusable business logic libraries, and clean code architecture.",
    preChecklist:["You understand PeopleCode fundamentals","You know what an Application Class is conceptually","You completed Component Interface (Topic 23)"],
    keyPoints:[
      "Application Packages contain Application Classes — define properties, methods, and constructors",
      "Supports inheritance (extends), interfaces, and method overriding",
      "Event Mapping handlers must be Application Classes — this is the primary real-world use case",
      "Encapsulate reusable logic (validation, integration calls, data lookups) in Application Classes",
      "Import statement: import PACKAGE_NAME:CLASS_NAME;",
    ],
    sections:[
      {title:"Application Package Basics",body:`**What is an Application Package?**
A container (namespace) for Application Classes — PeopleSoft's object-oriented programming framework. Created in Application Designer → File → New → Application Package.

**Structure:**
\`\`\`
MY_COMPANY:HR_UTILS          ← Package (namespace)
├── EmployeeValidator         ← Class
├── DeptLookup               ← Class
└── IntegrationHelper        ← Class
\`\`\`

**Creating an Application Class:**
In App Designer → expand the package → Insert → Application Class

\`\`\`
class EmployeeValidator
  method IsValidHire(&emplid As string) Returns boolean;
  method ValidateDept(&deptid As string, &effdt As date) Returns string;
end-class;

method IsValidHire
  /+ &emplid as String +/
  /+ Returns Boolean +/
  Local string &name;
  SQLExec("SELECT LAST_NAME FROM PS_PERSONAL_DATA WHERE EMPLID=:1", &emplid, &name);
  Return Not None(&name);
end-method;
\`\`\`

**Using the class:**
\`\`\`
import MY_COMPANY:HR_UTILS:EmployeeValidator;
Local MY_COMPANY:HR_UTILS:EmployeeValidator &validator;
&validator = create MY_COMPANY:HR_UTILS:EmployeeValidator();
If &validator.IsValidHire(&emplid) Then
  /* proceed */
End-If;
\`\`\`

**Why use Application Classes?**
- Reuse the same logic across 20 different components without copy-pasting code
- Single fix propagates everywhere instantly
- Upgrade-safe — your classes are never delivered by Oracle`},
      {title:"Inheritance and Interfaces",body:`**Inheritance:**
Application Classes support single inheritance using extends.

\`\`\`
class BaseValidator
  method Validate() Returns boolean;
  method GetError() Returns string;
end-class;

class HireValidator extends BaseValidator
  method Validate() Returns boolean;  /* overrides parent */
end-class;

method Validate
  /* HireValidator-specific logic */
  Return JOB.DEPTID.Value <> "";
end-method;
\`\`\`

**Interfaces:**
Define a contract — a class implementing an interface must provide all defined methods.

\`\`\`
interface IRequestHandler
  method OnMessage(&MSG As Message) Returns Message;
end-interface;
\`\`\`
Integration Broker handlers implement IRequestHandler — this is why all IB handlers have the same OnMessage method signature.

**Abstract classes:**
\`\`\`
class AbstractProcessor
  abstract method Process();  /* must be implemented by subclass */
end-class;
\`\`\`

**When to use inheritance:**
- Multiple validators that share common logic (base class handles error storage, subclasses handle specific validation)
- Integration handlers that share setup/teardown logic
- Report generators with common header/footer logic`},
      {title:"Event Mapping — Upgrade-Safe Customization",body:`**What is Event Mapping?**
PeopleTools 8.55+ feature that attaches your Application Class to a delivered component event without touching the delivered object.

**Why it matters:**
Before Event Mapping: modify JOB_DATA component's PostBuild directly → Oracle upgrade overwrites it → customization lost.
With Event Mapping: your App Class is mapped to PostBuild → upgrade replaces JOB_DATA → mapping remains → customization survives.

**Setting up Event Mapping:**
PeopleTools → Portal → Event Mapping → Add/Update Event Mapping

1. Select the delivered component/page/record/field
2. Select the event (PostBuild, SaveEdit, FieldChange, etc.)
3. Select your Application Class and method
4. Set: Pre/Post processing (before or after delivered code runs)
5. Set: Active checkbox

**Example — Add custom validation to delivered HR component:**
\`\`\`
/* MyCompany:HR:CustomValidation Application Class */
class CustomValidation
  method OnSaveEdit();
end-class;

method OnSaveEdit
  If JOB.ANNUAL_RT.Value > GetMaxSalary(JOB.GRADE.Value) Then
    Error "Salary exceeds grade maximum.";
  End-If;
end-method;
\`\`\`

Map this to: Component=JOB_DATA, Event=SaveEdit, Type=Pre-Processing.

**Result:** Your Error() fires BEFORE Oracle's delivered SaveEdit code. No delivered code was modified. Next upgrade: mapping survives untouched.`},
      {title:"Practical Application Class Patterns",body:`**Pattern 1 — Reusable Lookup Library:**
\`\`\`
class PSLookup
  method GetDeptName(&deptid As string, &effdt As date) Returns string;
  method GetJobCodeTitle(&jobcode As string) Returns string;
  method GetLocationDescr(&locid As string) Returns string;
end-class;
\`\`\`
Import once, call everywhere. Change the SQL in one place — updates all components.

**Pattern 2 — Integration Wrapper:**
\`\`\`
class PayrollIntegration
  property string EndpointURL;
  method SendHireNotification(&emplid As string) Returns boolean;
  method SendTerminationAlert(&emplid As string, &termDate As date) Returns boolean;
end-class;
\`\`\`
All payroll integration logic in one class. Swap the endpoint URL in one property change.

**Pattern 3 — Validation Chain:**
\`\`\`
class HireValidationChain
  method AddValidator(&v As BaseValidator);
  method RunAll() Returns boolean;
  method GetErrors() Returns array of string;
end-class;
\`\`\`
Add validators at runtime, run all, collect errors. Clean separation of validation rules.

**Real benefit:** When a business rule changes, you update one Application Class. All 15 components using it are automatically updated. No project, no migration, no regression testing of 15 separate components.`},
    ],
    realWorld:`A global HCM implementation had the same employee validation logic copy-pasted across 23 different PeopleCode programs. When a business rule changed (salary grade cap increased), the team had to find and update all 23 occurrences — missing 4 of them, causing inconsistent validation across components. The fix: refactor all validation into a MY_COMPANY:HR_VALIDATE Application Package. One change now propagates to all 23 programs instantly. Event Mapping was used to attach 8 of these validators to delivered Oracle components — all surviving the next PeopleTools upgrade without any rework.`,
    mistakes:[
      {title:"Using Global variables instead of Application Class properties",desc:"Storing shared state in Global PeopleCode variables is fragile and causes cross-component bugs. Use Application Class properties instead — they're scoped to the class instance and explicitly passed between methods."},
      {title:"Putting business logic in PeopleCode events instead of App Classes",desc:"Logic in FieldChange events can't be unit tested or reused. Extract business logic into Application Class methods, call those methods from events. The event becomes a thin wrapper — one line calling the App Class method."},
    ],
    quiz:[
      {q:"What keyword is used to implement inheritance in an Application Class?",options:["implements","inherits","extends","super"],correct:2,explanation:"Application Classes use 'extends' for inheritance: 'class HireValidator extends BaseValidator'. The child class inherits all parent methods and can override them."},
      {q:"What is Event Mapping used for?",options:["Mapping database fields to page controls","Attaching custom App Class code to delivered component events without modifying the delivered object","Creating event-driven Integration Broker flows","Mapping PS Query fields to BI Publisher templates"],correct:1,explanation:"Event Mapping (PT 8.55+) attaches your Application Class methods to delivered component events. The delivered object is never touched — your code runs before or after delivered code. Completely upgrade-safe."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tpcd/",
  },
  {
    id:"rest-soap-services", module:13, num:"33",
    title:"REST & SOAP Web Services",
    level:"advanced",
    summary:"Build and consume REST and SOAP web services in PeopleSoft — exposing PS data via API and integrating with external systems. The foundation of all modern PeopleSoft integrations.",
    preChecklist:["You completed Integration Broker Basics (Topic 24)","You completed Integration Broker REST & SOAP (Topic 25)","You understand Application Classes"],
    keyPoints:[
      "REST Service Operations use URI templates and HTTP verbs (GET/POST/PUT/DELETE)",
      "SOAP Service Operations auto-generate WSDL — external systems import this to integrate",
      "Handlers are Application Classes implementing PS_PT:Integration:IRequestHandler",
      "ConnectorProperties on Nodes control URL, authentication, SSL, and timeout",
      "Always handle OAuth token refresh — tokens expire, your code must detect and re-authenticate",
    ],
    sections:[
      {title:"Building a REST API in PeopleSoft",body:`**Exposing PeopleSoft data as a REST endpoint:**

**Step 1 — Create the Service:**
PeopleTools → Integration Broker → Integration Setup → Services → Add New
Service Name: EMPLOYEE_API

**Step 2 — Create Service Operation:**
Service → Service Operations → Add
- Operation name: GET_EMPLOYEE.v1
- Type: REST (change from default Sync)
- HTTP Method: GET
- URI Template: /employees/{EMPLID}

**Step 3 — Create Request/Response Messages:**
Define the JSON structure. Example response message:
\`\`\`json
{
  "EMPLID": "KR00123",
  "NAME": "Koushik Ram M",
  "DEPTID": "IT0001",
  "JOBCODE": "IT001",
  "EFFDT": "2026-04-01"
}
\`\`\`

**Step 4 — Write Handler PeopleCode:**
\`\`\`
import PS_PT:Integration:IRequestHandler;

class GetEmployeeHandler implements PS_PT:Integration:IRequestHandler
  method OnRequest(&MSG As Message) Returns Message;
end-class;

method OnRequest
  /+ &MSG as Message +/
  /+ Returns Message +/
  Local Message &response = CreateMessage(Operation.GET_EMPLOYEE_RESP);
  Local string &emplid = &MSG.URIResourceIndex.GetResourceByName("EMPLID");
  Local Rowset &rs = &response.GetRowset();
  SQLExec("SELECT LAST_NAME FROM PS_PERSONAL_DATA WHERE EMPLID=:1", &emplid, &lastName);
  &rs.GetRow(1).GetRecord(Record.EMPLOYEE_MSG).EMPLID.Value = &emplid;
  &rs.GetRow(1).GetRecord(Record.EMPLOYEE_MSG).LAST_NAME.Value = &lastName;
  Return &response;
end-method;
\`\`\`

**Step 5 — Create Routing:**
Routing: Local Node → Service Operation, Inbound
Active: Yes

**Testing:**
\`\`\`
GET https://yourserver/PSIGW/RESTListeningConnector/PS/GET_EMPLOYEE.v1/KR00123
\`\`\``},
      {title:"Consuming External REST APIs",body:`**PeopleSoft calling an external REST API:**

**Setup — Configure target Node:**
1. Create Node for external system
2. Node Properties → Connector ID: HTTPTARGET
3. Node Properties → Connector Properties:
   - PRIMARYURL: https://api.externalsystem.com
   - HEADER: Authorization = Bearer {token}

**PeopleCode to call external REST API:**
\`\`\`
Local Message &request = CreateMessage(Operation.EXTERNAL_PAYROLL_NOTIFY);
/* Set message content */
Local Rowset &rs = &request.GetRowset();
&rs.GetRow(1).GetRecord(Record.PAY_NOTIFY_MSG).EMPLID.Value = &emplid;

/* Synchronous call — waits for response */
Local Message &response = %IntBroker.SyncRequest(&request);

/* Parse JSON response */
Local string &jsonStr = &response.GetContentString();
Local JsonObject &json = CreateJsonObject();
&json.Parse(&jsonStr);
Local string &status = &json.GetProperty("status").GetString();
\`\`\`

**OAuth 2.0 token handling:**
\`\`\`
/* Get token first */
Local Message &tokenReq = CreateMessage(Operation.GET_OAUTH_TOKEN);
Local Message &tokenResp = %IntBroker.SyncRequest(&tokenReq);
Local string &token = /* parse from tokenResp */;

/* Store in App Server cache or State Record */
/* Check expiry before each call — tokens typically expire in 3600 seconds */
\`\`\``},
      {title:"SOAP Services Deep Dive",body:`**Consuming an external SOAP service:**

1. Get the external system's WSDL URL
2. PeopleTools → Integration Broker → Web Services → Consume Web Service
3. Enter WSDL URL → PeopleSoft auto-creates:
   - Remote Node with the target URL
   - Service and Service Operation matching the WSDL
   - Request/Response messages with correct structure

**Writing the SOAP Handler:**
\`\`\`
Local Message &request = CreateMessage(Operation.BENEFITS_ENROLL);
Local Rowset &rs = &request.GetRowset();
&rs.GetRow(1).GetRecord(Record.ENROLL_REQ).EMPLID.Value = &emplid;
&rs.GetRow(1).GetRecord(Record.ENROLL_REQ).PLAN_TYPE.Value = "1";

Local Message &response = %IntBroker.SyncRequest(&request);
/* Process response */
\`\`\`

**WS-Security (SOAP authentication):**
In Node properties → Connector Properties:
- USERNAME: service account
- PASSWORD: encrypted password
- WSSE_AUTH: UsernameToken

PeopleSoft handles SOAP envelope wrapping, WS-Security header injection, and XML parsing automatically. Your PeopleCode works with message Rowsets — not raw SOAP/XML.

**Exposing PeopleSoft as SOAP:**
WSDL auto-generated at: http://yourserver/PSIGW/PeopleSoftServiceListeningConnector
External systems import this WSDL to consume your PS services.`},
      {title:"Integration Monitoring and Troubleshooting",body:`**IB Monitor — daily operational tool:**
PeopleTools → Integration Broker → Monitor → Integration Monitor

**Sync errors:**
IB Monitor → Synchronous Services → Error Log
Each entry shows: timestamp, operation, error message, stack trace.
Most common: 404 (wrong URL), 401 (auth failure), 500 (external system error), XML parse error (message format mismatch).

**Async queue management:**
Publication Queue — messages PS sent, awaiting delivery
Subscription Queue — messages received, awaiting processing
Failed — messages that errored. Fix and Resubmit here.

**Diagnosing a failed integration:**
1. Check IB Monitor for the error message
2. Read the full stack trace — usually pinpoints the exact line
3. Common causes:
   - Node URL wrong or system is down (connection refused)
   - Auth failure (expired password, wrong token)
   - Message format mismatch (external changed their API)
   - PeopleCode exception in handler (business rule error)
4. Fix root cause
5. IB Monitor → select failed message → Actions → Resubmit

**Logging for debugging:**
In Handler PeopleCode: WriteToLog(2, "My debug: " | &variable);
Read in App Server log: domain/LOGS/APPSRV_*.LOG

**Performance tips:**
- Never use Sync for bulk operations — use Async
- Monitor queue depth daily — growing queue = performance issue
- Retry settings: configure max retries and backoff on Node`},
    ],
    realWorld:`A university used PeopleSoft HCM with 12 downstream systems (payroll vendor, badge access, LDAP, LMS, benefits vendor, etc.). Integration Broker pub/sub: every hire/transfer/termination published an async EMPLOYEE_CHANGE message. Each downstream system subscribed with their own handler. The badge system went down for 2 days of maintenance — messages queued automatically (2,400 messages) and delivered in sequence when it came back online. Zero data loss, zero manual intervention. The payroll integration used synchronous REST for real-time salary confirmation — if payroll rejects a rate, PS shows the error before saving.`,
    mistakes:[
      {title:"Hardcoding Node URLs in Handler PeopleCode",desc:"URLs should be in Node connector properties — not in PeopleCode strings. When moving DEV→QA→PROD, only the Node URL changes. Hardcoded URLs mean code changes at every migration."},
      {title:"Using Synchronous messaging for bulk operations",desc:"Sync integrations block the PS transaction. If payroll is down and you sync-call it on every hire, all hires fail. Use async for bulk — messages queue and retry automatically when the target recovers."},
    ],
    quiz:[
      {q:"In a REST Service Operation, what defines the URL structure for the endpoint?",options:["Node connector properties","URI Template — e.g. /employees/{EMPLID}","Service Operation name","Handler class name"],correct:1,explanation:"URI Templates define the REST URL pattern. Path parameters like {EMPLID} are accessible in Handler PeopleCode via MSG.URIResourceIndex.GetResourceByName('EMPLID')."},
      {q:"What happens to async IB messages when the target system is down?",options:["They are lost permanently","They are deleted after 1 hour","They queue in PS and retry automatically when the system recovers","They convert to synchronous messages"],correct:2,explanation:"Async messages queue in PeopleSoft's message tables. They retry based on the Node's retry configuration. When the target recovers, queued messages deliver in sequence — no data loss, no manual intervention needed."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tibr/",
  },
  {
    id:"performance-tuning-advanced", module:14, num:"34",
    title:"Performance Tuning & Debugging",
    level:"advanced",
    summary:"Diagnose and fix slow PeopleSoft pages and batch jobs using SQL trace, PeopleCode trace, App Server configuration, and database optimization. The skills that separate junior from senior consultants.",
    preChecklist:["You completed Process Scheduler & Performance (Topic 29)","You understand PeopleCode events deeply","You know basic SQL and database indexes"],
    keyPoints:[
      "SQL trace is the primary tool — shows every SQL with timing and row counts",
      "PeopleCode trace shows every statement executed — use with SQL trace for complete picture",
      "N+1 queries (SQLExec in RowInit) are the #1 online performance problem",
      "Set-based SQL in AE is always faster than row-by-row PeopleCode loops",
      "App Server PSAPPSRV count, DB connection pool size, and Tuxedo bulletin board are key tuning levers",
    ],
    sections:[
      {title:"SQL Trace Analysis",body:`**Enabling SQL trace:**
Two methods:
1. User-level: PeopleTools → Utilities → Debug → Trace SQL (checkbox on current session)
2. App Server: PSADMIN → Domain → Trace settings → TraceSql flag

**Reading the trace file:**
Located in: App Server domain/LOGS/ or PS_SERVDIR
Look for patterns:

**Pattern 1 — High execution count:**
\`\`\`
RC=0  Dur=0.001 SQL=SELECT DESCR FROM PS_DEPT_TBL WHERE DEPTID=:1
RC=0  Dur=0.001 SQL=SELECT DESCR FROM PS_DEPT_TBL WHERE DEPTID=:1
... (repeated 500 times)
\`\`\`
→ SQLExec in RowInit. Fix: pre-fetch in PostBuild.

**Pattern 2 — Long duration single SQL:**
\`\`\`
RC=0  Dur=14.832 SQL=SELECT * FROM PS_JOB J, PS_DEPT_TBL D WHERE...
\`\`\`
→ Missing index or bad join. Fix: add index, rewrite join.

**Pattern 3 — Full table scan:**
\`\`\`
RC=0  Dur=8.441 SQL=SELECT EMPLID FROM PS_JOB WHERE LAST_NAME=:1
\`\`\`
→ No index on LAST_NAME. Fix: add Alternate Search Key (A) in App Designer.

**Database-side analysis:**
Oracle AWR report, v$sql (top SQL by elapsed time), v$session (currently running SQL).
Ask DBA for execution plan (EXPLAIN PLAN) on slow queries — shows full table scan vs index scan.`},
      {title:"PeopleCode Performance Patterns",body:`**The N+1 Problem — Most Common Issue:**

Bad (500 DB calls for 500 rows):
\`\`\`
/* RowInit on JOB grid */
Local string &deptName;
SQLExec("SELECT DESCR FROM PS_DEPT_TBL WHERE DEPTID=:1", DEPTID.Value, &deptName);
DEPT_NAME_WORK.Value = &deptName;
\`\`\`

Good (1 DB call total):
\`\`\`
/* PostBuild — build lookup map once */
Component array of string &deptNames;
Component array of string &deptIds;
Local SQL &sql = CreateSQL("SELECT DEPTID, DESCR FROM PS_DEPT_TBL WHERE EFFDT=(SELECT MAX(EFFDT)...)");
While &sql.Fetch(&id, &name)
  &deptIds.Push(&id); &deptNames.Push(&name);
End-While; &sql.Close();

/* RowInit — look up from array (no DB call) */
Local integer &idx = &deptIds.Find(DEPTID.Value);
If &idx > 0 Then DEPT_NAME_WORK.Value = &deptNames[&idx]; End-If;
\`\`\`

**Other patterns to avoid:**
- CreateSQL without .Close() — exhausts DB cursors
- GetRowset() in a loop unnecessarily — expensive buffer navigation
- Error() in FieldChange instead of FieldEdit — fires too late, causes unnecessary processing
- DoSave() in SavePostChange — causes double save, nightmare to debug`},
      {title:"App Server Tuning",body:`**PSADMIN configuration levers:**

**PSAPPSRV instances:**
Too few → users get queued, pages feel slow
Too many → DB connection pool exhausted, server RAM exceeded
Rule of thumb: 3-5 PSAPPSRV per 50 concurrent users
Monitor: PSADMIN → Domain Status → shows active/idle PSAPPSRV

**Tuxedo bulletin board:**
In-memory work queue. If depth grows: more PSAPPSRV needed or transactions are too slow.
BB_MAXMESSAGES (in psappsrv.ubx) controls queue size.

**DB connection pool:**
ConnPool_MaxSize in psappsrv.cfg — how many DB connections the pool holds.
Set to ≥ (number of PSAPPSRV × 2). Too small → connections rejected under load.

**Server cache:**
App Server caches PeopleTools metadata (record defs, page defs, PeopleCode) in memory.
Cache invalidated when you: run Build, clear cache utilities, or restart domain.
Full cache refresh on restart causes initial slowness — warm up server before user load.

**Memory settings:**
MAXGEN (in Tuxedo config) — max server generations before restart. Prevents memory leaks from long-running processes.
Set MAXGEN=100 for PSAPPSRV — restarts the process after 100 transactions. Conservative but prevents memory growth.`},
      {title:"Batch Performance Optimization",body:`**AE batch optimization checklist:**

1. **Indexes on Temp Tables:**
Every Temp Table field used in WHERE clauses needs an index. Add Alternate Search Key (A) or custom index in App Designer. Without indexes: full scans on every Do Select iteration.

2. **Do Select mode:**
Re-Select: re-executes SELECT each iteration (use only if source data changes mid-run)
Select Once: fetches all rows once, iterates in memory. Use for static data. Much faster.

3. **Set-based SQL over loops:**
\`\`\`
/* Bad — PeopleCode loop with SQLExec per employee */
For &i = 1 To &count
  SQLExec("UPDATE PS_JOB SET FLAG='Y' WHERE EMPLID=:1", &empls[&i]);
End-For;

/* Good — single set-based UPDATE */
\`\`\`
\`\`\`sql
UPDATE PS_JOB SET PROCESS_FLAG = 'Y'
WHERE EMPLID IN (SELECT EMPLID FROM PS_MY_STAGE WHERE STATUS = 'READY')
AND EFFDT = (SELECT MAX(EFFDT) ...)
\`\`\`

4. **CommitWork frequency:**
Too rarely: huge rollback segment, catastrophic on failure
Too often: commit overhead per row
Sweet spot: every 500-1000 rows

5. **Parallel processing:**
Split large datasets by EMPLID range or DEPTID across multiple AE instances using Temp Tables.

6. **DB statistics:**
Outdated stats cause optimizer to choose wrong execution plans. Work with DBA to update stats after large data loads. Critical after data migrations.`},
    ],
    realWorld:`A client's month-end journal entry process was taking 11 hours — cutting into the close window. SQL trace analysis: one AE step had a correlated subquery running against a 50M-row table with no index on the correlation field. The query ran 200,000 times (once per journal line). Fix: added a composite index on the correlation fields, changed the AE SQL to use a staging table pre-populated in an earlier step, converted the correlated subquery to a JOIN. Runtime dropped from 11 hours to 38 minutes. Zero code change to business logic — pure SQL optimization.`,
    mistakes:[
      {title:"Running SQL trace in PROD continuously",desc:"SQL trace generates massive log files and adds overhead to every transaction. Enable only for specific sessions during diagnosis. In PROD, use targeted user-level trace for a specific problematic transaction — never leave domain-level trace on."},
      {title:"Optimizing without measuring first",desc:"The most common performance mistake: optimizing the wrong thing. Always run SQL trace first. The bottleneck is almost never where developers guess it is. Data shows SQLExec-in-RowInit is responsible for >60% of PeopleSoft online performance issues."},
    ],
    quiz:[
      {q:"What does a SQL trace showing the same SELECT statement 500 times indicate?",options:["A database bug","SQLExec inside RowInit — classic N+1 performance problem","A network issue","Too many App Server processes"],correct:1,explanation:"Identical SQL repeated N times = SQLExec in a loop. RowInit fires once per grid row — 500 rows = 500 DB calls. Fix: pre-fetch all data in PostBuild using CreateSQL once, then look up from memory in RowInit."},
      {q:"What is the recommended CommitWork frequency in a large AE batch job?",options:["Every row","Every 500-1000 rows","Only at the end of the entire job","Every 10,000 rows"],correct:1,explanation:"Every row = excessive commit overhead. End of job = massive rollback on failure. Every 500-1000 rows balances overhead vs recovery risk. Also saves a checkpoint enabling restart from that point."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tpcs/",
  },
  {
    id:"event-mapping-advanced", module:14, num:"35",
    title:"Event Mapping & Upgrade-Safe Dev",
    level:"advanced",
    summary:"Event Mapping is PeopleSoft's modern customization framework — attach your code to delivered components without touching them. The single most important technique for reducing upgrade cost.",
    preChecklist:["You completed Application Packages (Topic 32)","You understand PeopleCode events","You know what an upgrade/PUM is"],
    keyPoints:[
      "Event Mapping attaches App Class methods to delivered component events — zero modification to delivered objects",
      "Pre-processing: your code runs BEFORE delivered code. Post-processing: runs AFTER",
      "Related Content Framework stores the mappings — survives upgrades because it's configuration, not code",
      "Event Mapping replaces the old 'clone and modify' pattern for all customizations",
      "Compare and Fix is still needed for true object modifications — Event Mapping handles behavior additions",
    ],
    sections:[
      {title:"How Event Mapping Works",body:`**The old way (upgrade nightmare):**
1. Customer needs custom validation on JOB_DATA component
2. Developer opens JOB_DATA in App Designer, adds PeopleCode to SaveEdit
3. Oracle releases upgrade — JOB_DATA is a delivered object, gets overwritten
4. Customer's SaveEdit code is gone
5. Must re-apply customization, test, migrate — every single upgrade

**The Event Mapping way (upgrade-safe):**
1. Customer needs custom validation on JOB_DATA
2. Developer creates Application Class: MY_CO:HR:JobDataValidator
3. Adds method: OnSaveEdit()
4. Maps it to JOB_DATA component → SaveEdit event via PeopleTools UI
5. Oracle releases upgrade — JOB_DATA is overwritten
6. The Event Mapping entry in Related Content Framework is NOT overwritten
7. Customization survives untouched

**Why this works:**
Event Mapping entries are stored in PS_EOCF_MAPPING — a customer-owned configuration table. Oracle never delivers to this table. Your mappings are permanent.

**Configuration path:**
PeopleTools → Portal → Event Mapping → Manage Related Content Service → Add
Or: PeopleTools → Application Designer → right-click Component → Event Mapping`},
      {title:"Setting Up Event Mapping",body:`**Step-by-step setup:**

1. **Create Application Class first:**
\`\`\`
/* Package: MY_COMPANY:HR_CUSTOM */
class JobDataCustomizations
  method OnPostBuild();
  method OnSaveEdit();
  method OnFieldChange_Deptid();
end-class;

method OnPostBuild
  /* Hide fields not needed for this client */
  GetField(Field.BUSINESS_UNIT).Visible = False;
  GetField(Field.SETID).Visible = False;
end-method;

method OnSaveEdit
  If JOB.ANNUAL_RT.Value > 1000000 Then
    Error "Salary requires VP approval.";
  End-If;
end-method;
\`\`\`

2. **Create Event Mapping:**
PeopleTools → Portal → Event Mapping → Add/Update

| Field | Value |
|---|---|
| Service Name | MY_HR_CUSTOMIZATIONS |
| Package Name | MY_COMPANY:HR_CUSTOM |
| Class Name | JobDataCustomizations |
| Method Name | OnPostBuild |
| Processing Type | Post-Processing |

3. **Map to component:**
Event Mapping → Map to Component → 
Select: Component = JOB_DATA, Page = JOB_DATA1, Event = PostBuild

4. **Activate:**
Set Active = Yes, Save.

**Test immediately** in your environment. If PostBuild errors, check App Class syntax and method signature.`},
      {title:"Pre vs Post Processing",body:`**Pre-Processing:**
Your code runs BEFORE Oracle's delivered code for that event.

Use when:
- Setting up data or variables needed by delivered code
- Blocking a transaction before delivered code runs (Error() in pre-SaveEdit)
- Setting field defaults before delivered PostBuild logic reads them

**Post-Processing:**
Your code runs AFTER Oracle's delivered code.

Use when:
- Overriding something delivered code set (hide a field delivered code made visible)
- Triggering downstream actions after delivered logic completes
- Adding validation after delivered validation passes

**Example — PostBuild:**
Oracle delivered PostBuild: sets COMPANY default based on operator class.
Your Post-Processing PostBuild: overrides COMPANY default for specific business units.
Order: Oracle code runs first → sets COMPANY → your code runs → overrides for specific BUs.

**Stopping delivered code from running:**
Pre-Processing only. In your pre-processing method:
\`\`\`
/* Stop delivered PostBuild from running */
%This.CancelDeliveredCode = True;  /* valid in some PT versions */
\`\`\`
Use sparingly — blocking delivered code can break delivered functionality.`},
      {title:"Event Mapping Scope Options",body:`Event Mapping can be applied at multiple levels of granularity:

**Component-level mapping:**
All pages in the component fire your code. Use for:
- Component-wide validation (SaveEdit)
- Component-wide initialization (PostBuild)

**Page-level mapping:**
Only fires when a specific page is active (Activate event).
Use for: tab-specific initialization, showing/hiding controls on specific tabs.

**Record-field level mapping:**
Fires for a specific field's events across all components using that record.
Use for: field-level FieldEdit validation that applies everywhere the field appears.

**Component-field level mapping:**
Fires for a specific field ONLY in a specific component.
Use for: component-specific field behavior.

**Choosing the right scope:**
Start narrow (component-field) and widen only if needed. Wide scope = more places your code fires = higher risk of unintended side effects.

**Disabling a mapping:**
PeopleTools → Event Mapping → find the mapping → uncheck Active → Save.
Instantly disables without code change or migration. Useful for emergency rollback.`},
    ],
    realWorld:`A financial services firm was spending 3 months on every PeopleSoft upgrade cycle specifically for customization rework — find all modified delivered objects, compare with Oracle's new version, re-apply changes, test. After migrating all 47 customizations to Event Mapping + Application Classes over 6 months: the next upgrade customization rework took 4 days instead of 3 months. ROI was clear within the first upgrade cycle. The pattern also reduced regression testing scope dramatically — Event Mapped customizations are isolated and easier to test independently.`,
    mistakes:[
      {title:"Mapping to too many events on one component",desc:"If you map 8 different methods to 8 different events on one component, debugging becomes complex. When something breaks, which of the 8 fired? Document every mapping clearly and keep mappings focused — one mapping per distinct business requirement."},
      {title:"Using Event Mapping when object modification is actually needed",desc:"Event Mapping adds behavior — it can't add new fields to a page, change field labels, or restructure layout. For structural changes (adding a page, adding a record to a component), you still need to clone the delivered object with a custom prefix and modify the clone."},
    ],
    quiz:[
      {q:"What is the main advantage of Event Mapping over directly modifying delivered components?",options:["It runs faster","Customizations survive upgrades because delivered objects are never touched","It requires less PeopleCode knowledge","Oracle supports it better"],correct:1,explanation:"Event Mapping stores configuration in PS_EOCF_MAPPING — never overwritten by Oracle upgrades. Directly modified delivered objects are overwritten every upgrade. Event Mapping eliminates the upgrade customization rework cycle."},
      {q:"What does Pre-Processing mean in Event Mapping?",options:["Your code runs after Oracle's delivered code","Your code runs before Oracle's delivered code for that event","Your code replaces Oracle's code","Your code runs on a separate server"],correct:1,explanation:"Pre-Processing: your Event Mapped method runs BEFORE Oracle's delivered code for that event. Post-Processing runs AFTER. Choose based on whether you need to influence what delivered code sees or override what delivered code sets."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tpcs/",
  },
  {
    id:"elasticsearch-search-framework", module:15, num:"36",
    title:"Search Framework & Elasticsearch",
    level:"advanced",
    summary:"PeopleSoft Search Framework uses Elasticsearch to provide fast full-text search across all PeopleSoft data. Replace slow component search dialogs with modern keyword search.",
    preChecklist:["You understand PeopleSoft components and records","You know what a PS Query is","Basic understanding of what a search engine does"],
    keyPoints:[
      "Search Framework requires a separate Elasticsearch cluster — not built into PeopleSoft",
      "Search Definitions define what data gets indexed and how",
      "Search Categories group related Search Definitions for the search UI",
      "Global Search Bar (Fluid) uses Search Framework — without it users see no results",
      "Index must be built and scheduled to keep search results current",
    ],
    sections:[
      {title:"Search Framework Architecture",body:`**What is Search Framework?**
PeopleSoft's full-text search layer powered by Elasticsearch. Allows users to type "john smith manager IT department" and find relevant employees — vs the old approach of knowing exact EMPLID, DEPTID, etc.

**Architecture:**
\`\`\`
Fluid Global Search Bar
         ↓
PeopleSoft Search Framework (PeopleTools)
         ↓
Elasticsearch Cluster (separate server/OCI service)
         ↓
Indexed PS Data (employees, departments, jobs, etc.)
\`\`\`

**Required components:**
- Elasticsearch cluster (standalone or Oracle's Search Cloud Service)
- Integration Broker connection between PS and ES
- Search Definitions (what to index)
- Search Categories (how to present results)
- Scheduled index build/update jobs

**PeopleTools versions:**
PT 8.52: Search Framework introduced
PT 8.53+: Global Search Bar in Fluid uses it
PT 8.55+: Elasticsearch replaces legacy Verity search
PT 8.57+: Search Framework required for full Fluid functionality`},
      {title:"Creating Search Definitions",body:`**Search Definition = what gets indexed:**

PeopleTools → Search Framework → Administration → Search Definitions → Add New

**Setup steps:**
1. **Source Type:** PS Query (most common), Component, or External
2. **PS Query:** the query that returns records to index
   - Must return a unique key field (EMPLID, CASE_ID, etc.)
   - All fields to be searchable must be in the query
3. **Mapped Fields:**
   - Title: what appears as the result heading (e.g., "SMITH, JOHN")
   - Summary: description shown in results
   - Search attributes: fields users can search/filter on
4. **Security:** PS Query must use security views so search results respect row-level security
5. **Action URL:** the component that opens when user clicks a result

**Example — Employee Search Definition:**
\`\`\`
Source Query: EMPLOYEE_SEARCH_Q
Fields:
  - EMPLID (key, not displayed)
  - LAST_NAME + FIRST_NAME → Title
  - DEPTID, JOBCODE, LOCATION → Search attributes
  - HIRE_DT, EMPL_STATUS → Filters
Action: Component JOB_DATA with key EMPLID
\`\`\`

**Building the index:**
PeopleTools → Search Framework → Administration → Deploy/Delete Search Definitions
Then: Administration → Schedule Search Index Build`},
      {title:"Search Categories and Global Search",body:`**Search Category = how results are presented:**

PeopleTools → Search Framework → Administration → Search Categories → Add New

Groups multiple Search Definitions:
- HR Category: Employee Search + Position Search + Department Search
- Finance Category: Invoice Search + Vendor Search

**Global Search Bar setup:**
The Fluid NavBar search icon uses Search Categories.
PeopleTools → Portal → Global Search Configuration → select Categories to include.

**Configuring search display:**
In Search Category → Display Settings:
- Number of results per page
- Facets (filter sidebar) — e.g., filter by Department, Status, Location
- Highlighted fields — bold matching keywords in results
- Sort options — relevance, date, alphabetical

**Faceted search example:**
User searches "engineer"
Results panel shows:
- Left sidebar: filter by Department (IT: 45, Finance: 12), Status (Active: 55, Leave: 2)
- User clicks IT → results narrow to IT engineers only

This replaces the old "Search by Department" dropdown approach with a modern faceted search experience.`},
      {title:"Index Management and Maintenance",body:`**Index build types:**
Full Build: re-indexes everything from scratch. Run: initial setup, after major data migrations.
Incremental Build: indexes only new/changed rows since last run. Run: daily or hourly.

**Scheduling:**
PeopleTools → Search Framework → Administration → Schedule Index Build
Set recurrence: Incremental daily at 2 AM, Full monthly on Sunday 11 PM.

**Monitoring index health:**
PeopleTools → Search Framework → Administration → Search Designer → Index Status
Shows: number of indexed documents, last build time, index size, errors.

**Common issues:**

*Search returns no results:*
1. Index not built — run full index build
2. Elasticsearch cluster down — check connectivity
3. IB connection to ES broken — check Integration Gateway

*Results missing recent records:*
Incremental index hasn't run. Run manual incremental build.
Or: record not in Search Definition's PS Query — add to query.

*Search results ignore row-level security:*
Search Definition's PS Query is using base tables instead of security views.
Fix: update query to use security views — identical to component security approach.

**Elasticsearch cluster management:**
Monitor via Kibana (ES monitoring UI) or Oracle's Cloud Console.
Key metrics: heap usage (<80%), index size, query response time (<200ms).
If heap >80%: add ES nodes or increase heap allocation.`},
    ],
    realWorld:`A university with 15,000 employees had users complaining the student/employee search was too slow and required knowing exact IDs. Implementation of Search Framework: indexed employees, students, courses, and departments. Global Search Bar deployed in Fluid. HR coordinators now type partial names or departments and get instant results with faceted filtering. The old search dialog averaged 8 seconds per search. Search Framework: under 300ms. Adoption of Fluid Homepages jumped 40% within a month — the fast search was the feature that convinced users to switch from Classic.`,
    mistakes:[
      {title:"Not using security views in Search Definition queries",desc:"If the PS Query in your Search Definition uses PS_JOB instead of PS_JOB_SRCH_VW, search results bypass row-level security — users see employees they shouldn't. Always use the same security views in search queries as you use in component Search Records."},
      {title:"Only scheduling full index builds",desc:"Full builds on large environments take hours. Daily full build = hours of degraded search during the build window. Use incremental builds daily (run in minutes) with full builds weekly. Incremental keeps results current without the overhead."},
    ],
    quiz:[
      {q:"What technology does PeopleSoft Search Framework use as its search engine?",options:["Oracle Text","Apache Solr","Elasticsearch","PS Query"],correct:2,explanation:"PeopleSoft Search Framework uses Elasticsearch as its underlying search engine from PT 8.55+. Elasticsearch is a separate cluster (server or cloud service) that PeopleSoft connects to via Integration Broker."},
      {q:"What happens if the Search Definition's PS Query uses base tables instead of security views?",options:["Search is slower","Search results bypass row-level security — users see data they should not","Search returns no results","The index build fails"],correct:1,explanation:"Security views filter results based on the user's row-level security profile. Using base tables (PS_JOB vs PS_JOB_SRCH_VW) in the search query means everyone sees all results regardless of their department security. Always use security views."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tpscf/",
  },
  {
    id:"peopletools-upgrades", module:15, num:"37",
    title:"PeopleTools Upgrades & PUM",
    level:"advanced",
    summary:"Managing PeopleSoft upgrades using PUM (PeopleSoft Update Manager) and Change Assistant. How to apply patches selectively, manage customizations, and keep your environment current.",
    preChecklist:["You understand PeopleSoft architecture","You know what Application Designer projects are","You completed Event Mapping (Topic 35)"],
    keyPoints:[
      "PUM replaced bundle patching in 2014 — selective fix adoption via PeopleSoft Images",
      "Change Assistant automates the apply process — reads Change Package, executes steps",
      "Compare and Fix is the core upgrade workflow for customized delivered objects",
      "Always apply to DEV first → test → apply to QA → UAT → PROD",
      "Critical security fixes can be applied in hours with PUM — no waiting for quarterly bundles",
    ],
    sections:[
      {title:"PUM Architecture",body:`**How PUM works:**

Oracle releases PeopleSoft Images — VirtualBox VMs with all cumulative fixes up to that image date. Images are numbered (Image 47, Image 48, etc.).

**The workflow:**
1. Download latest PS Image from Oracle Support
2. Run PS Image locally (or on a server)
3. Connect your environment to the Image via PUM Home Page (web UI)
4. Browse available updates: security fixes, functional enhancements, new features
5. Select what you want to apply
6. PUM generates a Change Package (zip file with all selected fixes)
7. Change Assistant applies the Change Package to your environment

**Key advantage over old bundle patching:**
- Old bundles: take everything in the bundle (200+ fixes) or nothing
- PUM: cherry-pick exactly what you need (take security fix only, skip UI changes)
- Critical security fix? Apply in 2 hours. Don't need to test 200 other changes.

**PeopleSoft Image cadence:**
Oracle releases 3-4 Images per year per product line (HCM, FSCM, etc.).
Each Image is cumulative — Image 48 includes everything in Image 47 plus new fixes.
You don't need to apply every Image — apply when you need specific fixes or features.`},
      {title:"Change Assistant",body:`**Change Assistant is the automation tool that applies Change Packages:**
Installed on the developer's workstation. Connects to all environments.

**Change Package application steps:**
Change Assistant reads the package and breaks it into automated steps:
1. DB Updates — SQL scripts modifying PeopleTools and Application tables
2. Data Conversion — AE programs transforming existing data to new structures
3. Application Designer Updates — importing new/updated objects
4. Manual Steps — steps that require human decision or can't be automated
5. Build Steps — running App Designer Build on modified records

**Applying a Change Package:**
1. Change Assistant → File → Open Change Package
2. Set environment credentials (DEV URL, admin user)
3. Change Assistant shows all steps with status
4. Click Run — Change Assistant executes steps automatically
5. Monitor progress — most steps are automated
6. Manual steps: Change Assistant stops, shows instructions, waits for you to confirm
7. After completion: run Application Designer Build on affected records

**Estimated time:**
Small patch (1-2 fixes): 30-60 minutes
Medium package (10-20 fixes): 2-4 hours
Major feature drop: 1-2 days including testing

**Always apply DEV first** — Change Assistant will encounter errors on any environment. Better to discover them in DEV.`},
      {title:"Compare and Fix",body:`**What is Compare and Fix?**
The process of reconciling your customizations with Oracle's updated delivered objects after an upgrade.

**The problem:**
You modified PS_JOBCODE_TBL record in DEV. Oracle's upgrade delivers a new version of PS_JOBCODE_TBL. Your version and Oracle's version now differ — which one goes to PROD?

**The Compare and Fix workflow:**
1. Apply Change Package to DEV
2. Application Designer → Tools → Compare and Report
3. Select your project containing customized objects
4. Select the target database (where Oracle's new version landed)
5. Compare runs — shows differences side by side:
   - Your version vs Oracle's new version
   - Fields added/removed by Oracle
   - PeopleCode changes Oracle made
6. For each difference: choose Take Source, Take Target, or merge manually
7. Re-test customizations against Oracle's new code

**Types of differences:**
- Oracle added new fields to a record you customized — merge both
- Oracle changed PeopleCode you also changed — manually merge logic
- Oracle added a new page tab — take Oracle's version, re-add your customization
- Difference is only metadata (descriptions) — usually take Oracle's version

**Using Event Mapping to minimize Compare and Fix:**
If your customizations are in Application Classes + Event Mapping:
- Oracle upgrades the delivered component → your mappings survive
- Zero Compare and Fix needed for that component
- Only objects you structurally modified need Compare and Fix`},
      {title:"Upgrade Best Practices",body:`**Golden rules for upgrades:**

**1. Never modify delivered objects directly:**
Clone first: copy JOB_DATA_COMPONENT → ZZ_JOB_DATA_COMPONENT
Modify the clone. Delivered object stays clean for upgrades.
Even better: Event Mapping (no object modification at all).

**2. Document every customization:**
Maintain a customization register:
- Object name
- What was changed
- Why it was changed
- Ticket/requirement reference
This register is essential during Compare and Fix.

**3. Apply patch cycle:**
DEV → QA → UAT (regression test) → PROD
Never apply directly to PROD.
Minimum 2 weeks of UAT for medium patches.

**4. Test critical paths after every patch:**
Hire → Transfer → Termination
Pay Rate Change → Payroll Calculation
Integration Broker flows
Security — verify users can still access what they should

**5. Use a patch log:**
Record: Image number applied, date, what was included, who applied, any issues found.
When something breaks in PROD 3 months later, the patch log tells you exactly what changed.

**6. Security patches = highest priority:**
Apply critical security fixes within 2 weeks of Oracle's advisory.
Use PUM to take just the security fix without other changes.
Test only the security fix in DEV — much faster than full regression.`},
    ],
    realWorld:`A hospital PeopleSoft HCM environment hadn't applied patches in 3 years (11 Images behind). When a critical security vulnerability was disclosed, they had to emergency-apply 3 years of patches. The Compare and Fix exercise took 6 weeks because hundreds of delivered objects had been directly modified over the years with no documentation. The lesson: establish a quarterly patching cadence, document all customizations, and use Event Mapping going forward. Their next upgrade (6 months later) took 4 days — they had adopted Event Mapping for new customizations and had a proper patch log.`,
    mistakes:[
      {title:"Applying patches directly to PROD without DEV testing",desc:"Change Packages sometimes have unexpected interactions with customizations. Always apply to DEV first — even for 'small' patches. The 1 hour saved by skipping DEV testing is not worth a PROD outage that takes 8 hours to fix."},
      {title:"Ignoring the customization register",desc:"Without documentation of what was customized and why, Compare and Fix becomes archaeology — examining each difference and trying to remember if it was intentional. A simple spreadsheet tracking every customized object, the reason, and the ticket reference saves enormous time during upgrades."},
    ],
    quiz:[
      {q:"What replaced bundle patching in PeopleSoft (~2014)?",options:["Change Assistant","PeopleSoft Update Manager (PUM) with selective fix adoption","Annual upgrade cycles","Application Designer sync"],correct:1,explanation:"PUM replaced quarterly bundle patching. Instead of taking all fixes in a bundle, organizations download a PS Image, browse available fixes, select exactly what to apply, and generate a targeted Change Package. Critical security fixes can be applied in hours."},
      {q:"What is Compare and Fix used for in a PeopleSoft upgrade?",options:["Comparing two databases for performance","Reconciling customized delivered objects with Oracle's updated versions","Fixing Elasticsearch index errors","Comparing PS Query results"],correct:1,explanation:"Compare and Fix reconciles your modifications to delivered objects against Oracle's new version from the upgrade. You see both versions side by side and decide: take Oracle's version, keep yours, or manually merge both sets of changes."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tpum/",
  },
  {
    id:"advanced-security", module:16, num:"38",
    title:"Advanced Security & Compliance",
    level:"advanced",
    summary:"Enterprise-grade PeopleSoft security — SSO, encryption, audit frameworks, and compliance configurations used in regulated industries (healthcare, finance, government).",
    preChecklist:["You completed Advanced Security (Topic 26)","You understand Permission Lists and Roles","You know what SSO is conceptually"],
    keyPoints:[
      "SSO in PeopleSoft uses PS_TOKEN (PeopleSoft's proprietary token) or SAML for federated identity",
      "Sensitive data encryption uses PeopleSoft's built-in encryption framework (RC2/3DES/AES)",
      "Audit framework logs: who changed what, when, old value, new value — stored in PS_AUDIT_* tables",
      "Data Masking hides sensitive fields (SSN, bank account) based on user role",
      "SLA and SOX compliance requirements drive most enterprise PeopleSoft security configurations",
    ],
    sections:[
      {title:"Single Sign-On (SSO)",body:`**PeopleSoft SSO options:**

**1. PS_TOKEN (PeopleSoft proprietary SSO):**
Used when two PeopleSoft systems need seamless navigation.
User logs into PS System A → navigates to a link that opens PS System B → already authenticated, no second login.

How it works:
1. PS System A generates a PS_TOKEN (encrypted user identity + timestamp)
2. Token passed in URL or HTTP header
3. PS System B validates token against shared secret key
4. If valid and within time window (default 1 hour): auto-signon

Setup: PeopleTools → Security → SSO → Single Sign-On Configuration
Both systems must share: Same Node password, Same timestamp tolerance setting

**2. SAML 2.0 / Oracle Access Manager:**
Modern SSO standard. Corporate Identity Provider (IdP: Okta, Azure AD, Oracle IAM) authenticates user once.
PS acts as Service Provider (SP) — trusts the IdP assertion.

SAML flow:
User accesses PS URL → PS redirects to IdP → User authenticates at IdP → IdP sends SAML assertion → PS validates assertion → User logged into PS

Setup requires: SSL certificates, SAML metadata exchange between PS and IdP.
PeopleTools 8.55+: full SAML 2.0 support built-in.

**3. Lightweight SSO (simpler):**
HTTP header-based: IdP sets a custom header (e.g., X-PS-USER: JSMITH) after authentication.
PS reads the header and auto-logs in the user.
Less secure than SAML but simpler to implement.`},
      {title:"Encryption and Data Masking",body:`**PeopleSoft Encryption Framework:**
Built-in encryption for sensitive fields — national IDs, bank accounts, credit cards.

**Setup:**
PeopleTools → Security → Encryption → Encryption Profiles
Choose algorithm: RC2, 3DES, or AES (AES-256 recommended for new implementations)
Assign Encryption Profile to specific record fields in App Designer.

**How it works in practice:**
- User types SSN: 123-45-6789 on page
- On save: PeopleSoft encrypts it before storing in DB: A3F9B2C7...
- DB shows encrypted value — even DBA can't read it
- On display: PeopleSoft decrypts for authorized users
- Unauthorized users (no decryption permission): see masked value: ***-**-6789

**Data Masking (PT 8.55+):**
PeopleTools → Security → Data Masking
Define masking rules per field per Role/Permission List:
- Full mask: ****-****
- Partial mask: ***-**-6789 (show last 4 only)
- Tokenization: replace with a non-sensitive token

Users with "View Full SSN" Permission List: see full number.
Users without: see masked version.
No code change needed — configured in PeopleTools.

**Encryption in Integration Broker:**
Message content can be encrypted end-to-end.
WS-Security with XML Encryption: specific SOAP message elements encrypted.
Prevents sensitive data exposure if messages are intercepted in transit.`},
      {title:"Audit Framework",body:`**PeopleSoft Audit — what gets logged:**
Changes to critical tables (PS_JOB, PS_PERSONAL_DATA, salary tables) are logged to PS_AUDIT_* tables.

**Setting up record-level auditing:**
App Designer → Open Record → Record Properties → Use tab → Audit Enabled
Choose: Add, Change, Delete, or all three.

PeopleSoft creates: PS_AUDIT_RECORDNAME with columns:
- AUDIT_OPRID: who made the change
- AUDIT_STAMP: timestamp of change
- AUDIT_ACTION: A (Add) / C (Change) / D (Delete)
- All record fields: showing the OLD value (before change)

**Auditing a specific field change:**
App Designer → Record → Record Field Properties → Audit field option
Only logs when this specific field changes — reduces audit table bloat.

**Querying audit tables:**
\`\`\`sql
SELECT AUDIT_OPRID, AUDIT_STAMP, AUDIT_ACTION, 
       ANNUAL_RT AS OLD_SALARY
FROM PS_AUDIT_JOB
WHERE EMPLID = 'KR00123'
AND AUDIT_STAMP >= SYSDATE - 90
ORDER BY AUDIT_STAMP DESC;
\`\`\`
Find: who changed salary, when, and what it was before.

**Component-level audit:**
PeopleTools → Utilities → Auditing → Component Record Audit
Audits all save operations on a component — captures complete transaction.

**SOX / Regulatory requirement:**
Most regulated industries require: who changed what compensation data, when, with what justification.
PS Audit + comments field + required reason codes on Pay Rate Change = complete compliance trail.`},
      {title:"Security Compliance Configurations",body:`**Common enterprise security requirements:**

**1. Password policies:**
PeopleTools → Security → User Profiles → Password Controls
- Minimum length: 12 characters
- Complexity: must include uppercase, number, special character
- Expiry: every 90 days
- History: cannot reuse last 12 passwords
- Lockout: lock after 5 failed attempts, unlock after 30 minutes

**2. Inactive user management:**
Users who haven't logged in for 90 days should be disabled.
PS doesn't do this automatically — build an AE that queries PS_LASTSIGNON and disables users:
\`\`\`sql
UPDATE PSOPRDEFN SET ACCTLOCK = 1
WHERE LASTSIGNONDTTM < SYSDATE - 90
AND ACCTLOCK = 0
AND OPRTYPE <> 'S'  /* don't lock service accounts */
\`\`\`

**3. Privileged access review:**
Quarterly review of who has sensitive Permission Lists (ALLPAGES, PTPT1000, HR_ADMIN_SUPER).
PS Query to extract: all users with Permission List containing keyword 'ADMIN'.
Export to Excel → HR/Security team reviews → remove excess access.

**4. Service account management:**
Batch jobs, IB integrations, and external systems use service accounts.
Requirements:
- Named accounts: BATCH_PAYROLL, IB_BENEFITS (not generic 'SYSADMIN')
- No interactive login allowed (set can't login interactively flag)
- Password in vault (CyberArk, HashiCorp) not in config files
- Minimum permissions: only what the batch job or integration needs

**5. HIPAA (Healthcare) specifics:**
Minimum necessary access — users should have access to only the employee data they need for their job function. Implemented via: narrow department security trees + specific record-level Permission Lists.`},
    ],
    realWorld:`A healthcare organization was failing their HIPAA security audit. Issues found: 23 users had ALLPAGES permission, SSNs were stored unencrypted in PS_PERSONAL_DATA, no audit trail on benefit enrollment changes, and 47 terminated employees still had active PS accounts. 90-day remediation: enabled AES-256 encryption on SSN and bank account fields, configured data masking for non-HR roles, set up record auditing on PS_HEALTH_BENEFIT and PS_PERSONAL_DATA, built an AE to auto-disable terminated user accounts, removed ALLPAGES from 21 of 23 users. Passed the follow-up audit with zero findings.`,
    mistakes:[
      {title:"Giving ALLPAGES permission to business users",desc:"ALLPAGES grants access to all components including developer tools, sensitive HR data, and system administration. This is for system administrators only. Assign only the Permission Lists users actually need. Quarterly access reviews catch ALLPAGES creep."},
      {title:"Not testing encryption impact on existing reports",desc:"Enabling encryption on an existing field breaks PS Queries and AE programs that compare or filter on that field — encrypted values don't match plaintext search criteria. Plan encryption rollout carefully: update all queries and AE SQL to use decryption functions, test all reports before enabling encryption in PROD."},
    ],
    quiz:[
      {q:"What PeopleSoft mechanism allows seamless navigation between two PS systems without re-login?",options:["SAML assertion","PS_TOKEN (PeopleSoft proprietary SSO token)","Shared Permission List","Common database connection"],correct:1,explanation:"PS_TOKEN is PeopleSoft's proprietary SSO mechanism. System A generates an encrypted token with user identity, passes it to System B which validates it against a shared secret. Modern deployments use SAML 2.0 for SSO with corporate identity providers."},
      {q:"What does enabling record-level auditing in App Designer create?",options:["A new database trigger","PS_AUDIT_RECORDNAME table logging who changed what, when, and old values","An alert email to administrators","A checkpoint in Application Engine"],correct:1,explanation:"Record-level auditing creates PS_AUDIT_RECORDNAME with AUDIT_OPRID (who), AUDIT_STAMP (when), AUDIT_ACTION (add/change/delete), and the old field values before the change. Essential for SOX, HIPAA, and regulatory compliance."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tpcs/",
  },
  {
    id:"advanced-reporting", module:15, num:"39",
    title:"Advanced Reporting & Analytics",
    level:"advanced",
    summary:"Enterprise reporting in PeopleSoft — BI Publisher advanced features, Pivot Grids, PS/nVision, and PeopleSoft Insights (Kibana-based analytics dashboards).",
    preChecklist:["You completed PS Query Advanced (Topic 27)","You understand BI Publisher basics","You know what a Pivot Table is"],
    keyPoints:[
      "Pivot Grids provide interactive drag-and-drop analytics directly in Fluid components",
      "PS/nVision is Excel-based financial reporting — primary tool for FSCM GL analysis",
      "PeopleSoft Insights uses Kibana dashboards powered by Elasticsearch data",
      "BI Publisher bursting can distribute thousands of personalized reports automatically",
      "Reporting security must mirror component security — use same security views in report queries",
    ],
    sections:[
      {title:"Pivot Grids",body:`**What are Pivot Grids?**
Interactive analytics components built directly in PeopleSoft Fluid. Users drag and drop dimensions and measures to create their own analysis — like Excel PivotTables but in the browser.

**When to use:**
- Headcount analysis by department/location/job family
- Budget vs actual comparisons
- Leave balance summaries by team
- Performance rating distributions

**Creating a Pivot Grid:**
PeopleTools → Pivot Grid → Pivot Grid Wizard

Step 1 — Data Source: select PS Query providing the data
Step 2 — Pivot Grid Options:
  - Grid Columns: dimensions (DEPTID, JOBCODE, LOCATION)
  - Data fields: measures (headcount, avg salary, sum of hours)
  - Default layout: which field goes to rows, columns, filters
Step 3 — Display options: chart type (bar, line, pie), colors
Step 4 — Security: which users can see this grid

**Publishing to a Fluid Homepage:**
Create a Tile pointing to the Pivot Grid component.
Add to Homepage Tile Collection.
Users click the tile to get an interactive analytics dashboard — no IT involvement needed for analysis.

**User interaction:**
- Drag department to rows, location to columns → see headcount matrix
- Click a cell → drill down to employee list
- Apply filter → narrow to specific status or job family
- Export to Excel with current layout`},
      {title:"PeopleSoft Insights",body:`**PeopleSoft Insights — Kibana-based dashboards:**
Introduced in PT 8.57. Pre-built analytics dashboards powered by Elasticsearch.

**What it provides:**
- HCM Insights: headcount trends, turnover analysis, time-to-fill, diversity metrics
- FSCM Insights: procurement spend analysis, invoice aging, budget utilization
- All data comes from Elasticsearch indices built by Search Framework

**Accessing:**
Fluid Homepage → Insights tile
Or: PeopleTools → Search Framework → Insights Dashboard

**Pre-built dashboards include:**
HCM:
- Workforce Composition (headcount by demographics)
- Attrition Analysis (terminations over time, reasons)
- Time & Labor (overtime, absence trends)
- Compensation Analysis (salary distribution by grade)

FSCM:
- Payables Aging (invoices by age bucket)
- Procurement Spend (by supplier, category, BU)

**Customizing Insights:**
Kibana-based — IT team can create custom visualizations using Kibana tools.
Add new panels to existing dashboards.
Create new dashboards for client-specific KPIs.

**Security:**
Insights dashboards respect PS row-level security via the underlying Elasticsearch indices.`},
      {title:"PS/nVision for Financial Reporting",body:`**What is PS/nVision?**
Excel-based reporting tool primarily used in FSCM for General Ledger analysis. Creates Excel spreadsheets with live PeopleSoft data using named ranges and nVision formulas.

**Core concept — Report Layouts:**
PeopleTools → nVision → Report Layout (Excel file)
Excel cells contain PS/nVision formulas:
\`\`\`
=NVSSCOPE("BUSINESS_UNIT=GBL01") 
\`\`\`
These formulas fetch data from PS GL tables when the report is run.

**DrillDown capability:**
User sees GL summary → double-clicks a cell → PS/nVision drills to journal line detail.
Drill path: Budget → Department → Account → Journal Entries → Source Documents.

**Report Books:**
Group multiple nVision layouts into one Report Book.
Run once — generates 50 Excel tabs (one per department) automatically.
Used for: monthly management pack, budget vs actual for each cost center.

**Matrix reports:**
Rows = GL Accounts (4000 - Revenue, 5000 - Expenses, etc.)
Columns = Periods (Jan, Feb, Mar... Dec, YTD)
PeopleSoft fills the matrix by fetching PS_LEDGER data for each intersection.

**Scheduling:**
Process Scheduler → nVision Report Request → run monthly after GL close.
Output delivered to Report Manager or email.

**Who uses it:**
Finance controllers, FP&A teams, budget managers. Less common in HCM — that's more PS Query + BI Publisher territory.`},
      {title:"BI Publisher Advanced Features",body:`**Advanced BIP patterns:**

**1. Sub-templates:**
Reusable template sections (header/footer/logo) shared across multiple report templates.
Change the logo once in the sub-template → updates all reports automatically.

**2. Conditional formatting:**
In Word template using BIP tags:
\`\`\`
<?if:SALARY > 100000?>
  <fo:block color="red"><?SALARY?></fo:block>
<?else?>
  <fo:block><?SALARY?></fo:block>
<?end if?>
\`\`\`
Salary over 100K shows in red. Under 100K shows normally.

**3. Repeating groups:**
\`\`\`
<?for-each:EMPLOYEE?>
  <?NAME?> | <?DEPTID?> | <?SALARY?>
<?end for-each?>
\`\`\`
Generates one row per employee from the data source.

**4. Multi-language reports:**
BIP Translation feature — same template, text translated based on user's language setting.
Report auto-generates in French for French users, English for English users.

**5. Charts in BIP:**
Insert chart in Word/Excel template → map data fields to chart axes.
BIP generates the chart from live data on each run.
Common: bar chart of headcount by department embedded in HR monthly report.

**6. Performance for large reports:**
For 100,000+ row reports: use AE data source (Rowset-based) instead of PS Query.
AE can pre-aggregate and structure data more efficiently than PS Query for complex reports.
BIP just handles the formatting — keep data preparation in AE.`},
    ],
    realWorld:`A retail company's Finance team was spending 3 days every month manually compiling the management pack in Excel from PS/nVision exports. Implementation: PS/nVision Report Book with 24 layouts (one per region × 2 periods), scheduled to run automatically after month-end close, output emailed directly to each regional director via BIP bursting. Month-end reporting time dropped from 3 days to 4 hours (mostly review time). The CFO received the consolidated 50-page PDF automatically — generated and emailed by PeopleSoft with zero human intervention.`,
    mistakes:[
      {title:"Not securing Pivot Grid queries",desc:"Pivot Grid data queries must use security views just like component Search Records. A Pivot Grid showing headcount by department without row-level security exposes all employee data to all users. Apply the same PS_JOB_SRCH_VW approach to the Pivot Grid's PS Query."},
      {title:"Using PS Query as BIP data source for 100K+ row reports",desc:"PS Query has memory limitations and timeouts for very large datasets. For reports processing 100,000+ rows, use an AE program as the BIP data source. AE can handle millions of rows, commit in batches, and structure complex nested data that PS Query can't produce."},
    ],
    quiz:[
      {q:"What is a Pivot Grid in PeopleSoft?",options:["A type of database table","An interactive drag-and-drop analytics component built directly in Fluid PeopleSoft","A PS Query output format","A BI Publisher chart type"],correct:1,explanation:"Pivot Grids are interactive analytics components in Fluid. Users drag dimensions (DEPTID, JOBCODE) and measures (headcount, salary) to create real-time analysis. Like Excel PivotTables but built into PeopleSoft, with drill-down and chart capabilities."},
      {q:"What is PS/nVision primarily used for?",options:["HCM headcount reporting","General Ledger financial analysis in FSCM — Excel-based with DrillDown","Integration monitoring","Security audit reports"],correct:1,explanation:"PS/nVision is Excel-based financial reporting for FSCM General Ledger analysis. Excel templates contain nVision formulas that fetch GL data. DrillDown allows navigation from summary to journal line detail. Used by Finance/FP&A teams for budget vs actual, month-end close reports."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tqry/",
  },
  {
    id:"cloud-and-architecture-advanced", module:16, num:"40",
    title:"Cloud Architecture & Modern PS",
    level:"advanced",
    summary:"PeopleSoft on Oracle Cloud Infrastructure (OCI), DPK deployment automation, Oracle Cloud HCM comparison, and the future direction of the PeopleSoft platform.",
    preChecklist:["You completed Architecture (Topics in Beginner)","You understand PUM and upgrades","You know what cloud computing is"],
    keyPoints:[
      "PeopleSoft runs natively on OCI — same application, cloud infrastructure",
      "DPK (Deployment Package) automates environment provisioning using Puppet",
      "Continuous Delivery Update (CDU) model — quarterly feature drops, no big-bang upgrades",
      "Oracle Cloud HCM (Fusion) is PeopleSoft's SaaS cousin — different product, same company",
      "Selective Adoption means choosing which new features to activate — Oracle never forces you to take UI changes",
    ],
    sections:[
      {title:"PeopleSoft on OCI",body:`**Oracle Cloud Infrastructure for PeopleSoft:**
OCI is Oracle's public cloud (like AWS/Azure but Oracle's). PeopleSoft can run entirely on OCI.

**OCI PeopleSoft deployment:**
\`\`\`
OCI Infrastructure:
├── Web Tier: OCI Compute (WebLogic on Linux VMs)
├── App Tier: OCI Compute (Tuxedo on Linux VMs)  
├── DB Tier: Oracle Autonomous DB or DB System
├── Elasticsearch: OCI Elasticsearch Service
└── Storage: OCI Object Storage (for attachments, reports)
\`\`\`

**PeopleSoft Cloud Manager:**
Oracle-provided tool that automates PeopleSoft deployment on OCI.
- Provisions entire environments (Web, App, DB tiers) with one click
- Manages lifecycle: start/stop/scale environments on schedule
- Clone environments for testing in minutes vs days for on-premise
- Patch management: applies PUM images directly

**Cost advantages on OCI:**
- Dev/Test environments: run only during business hours, auto-shutdown nights/weekends
- Scale up before month-end processing, scale down after
- No hardware purchase, no data center costs
- Pay-as-you-go for non-production environments

**PeopleSoft on OCI is NOT Fusion/SaaS:**
Still the same PeopleSoft application you know — PeopleCode, App Designer, Application Engine all work identically. OCI is just where the servers run.`},
      {title:"DPK Deployment Automation",body:`**What is DPK?**
Deployment Packages — Puppet-based automation scripts for provisioning PeopleSoft environments.
Available since PT 8.55. Replaced manual multi-day server setups.

**DPK automates:**
- OS configuration (Linux user setup, directory structure)
- WebLogic installation and domain creation
- Tuxedo installation and App Server domain creation
- Database client installation
- PeopleTools installation
- PeopleSoft application installation

**Typical DPK deployment:**
\`\`\`bash
# 1. Download DPK zip files from Oracle Support
# 2. Extract setup scripts
./psft-dpk-setup.sh

# 3. Answer prompts for:
#    - DB hostname, SID, credentials
#    - Web tier hostname, port
#    - App tier settings

# 4. Puppet applies all configuration
# Takes 2-3 hours (vs 2-3 days manual)
\`\`\`

**DPK customization:**
Edit Puppet hiera YAML files to adjust:
- Number of PSAPPSRV processes
- WebLogic heap settings
- Custom certificates
- Environment-specific ports

**DPK for PUM:**
When applying a PUM patch, use DPK to provision the PS Image environment locally.
DPK sets up the Image in 2 hours — ready for Change Package generation.

**Who needs DPK knowledge:**
PeopleSoft administrators and infrastructure teams. Developers less so — but understanding DPK helps when setting up local dev environments.`},
      {title:"Continuous Delivery and Selective Adoption",body:`**PeopleSoft Continuous Delivery model:**
Oracle adopted continuous delivery (~2018) alongside PUM.
Regular drops of new features and functional enhancements — not just fixes.

**How it differs from traditional upgrades:**
Traditional: PS 8.9 → PS 9.0 → PS 9.1 → PS 9.2 — massive upgrades every few years.
Continuous Delivery: stay on PS 9.2, receive new features quarterly via PUM Images.
No more big-bang upgrades. Just ongoing PUM patches.

**Selective Adoption:**
When Oracle delivers a new feature (e.g., new Fluid timesheet), you CHOOSE when to activate it.
Features come "off" by default — you activate via feature flag or configuration.
This means: take the code now (in your PUM patch), activate when your users are ready.

**Example adoption timeline:**
- Image 45: Oracle delivers new Fluid Absence Request (off by default)
- Your organization: applies Image 45 in March (code is there, feature is off)
- HR team: trains on new UI in April
- May: activate Fluid Absence for pilot group
- June: activate for all employees

**What this means practically:**
- Never forced to use a new UI until you're ready
- Code is always current (patched) even if features are deactivated
- Upgrade project risk is massively reduced
- "Oracle forcing ugly UI on our employees" is no longer a thing`},
      {title:"PeopleSoft vs Oracle Cloud HCM",body:`**Common question: should we move to Oracle Cloud HCM (Fusion)?**

This is a business decision, not a technical one. As a consultant, you need to understand both.

**Oracle Cloud HCM (Fusion):**
- True SaaS: Oracle hosts, manages, patches everything
- Automatic quarterly updates — no choice on timing
- Modern UI from day one (Redwood design system)
- Limited customization — configuration only, no custom PeopleCode
- Lower IT overhead (no servers to manage)
- Higher per-user licensing cost
- Migration from PeopleSoft: significant effort (data conversion, process retraining)

**PeopleSoft HCM:**
- On-premise or OCI-hosted: customer controls infrastructure
- PUM selective adoption — you control timing
- Deep customization via PeopleCode, App Engine, Event Mapping
- Lower ongoing licensing (perpetual license model)
- Higher IT overhead (servers, DBA, patching team)
- Existing investment: 10-20 years of configuration and customizations

**When clients stay on PeopleSoft:**
- Heavy customizations that would be impossible to replicate in Fusion
- Complex regulatory requirements (government, healthcare) needing custom logic
- Budget constraints — migration costs $5-50M for large organizations
- Existing team with deep PS expertise

**When clients move to Cloud HCM:**
- Starting fresh (new company, no legacy)
- Wanting to reduce IT infrastructure overhead
- Oracle's standard processes match their business needs
- Long-term cost vs customization tradeoff favors SaaS

**Your role as PS consultant:**
Understand both. Many clients ask this question. The honest answer is: it depends on their customization depth, budget, risk tolerance, and long-term IT strategy.`},
    ],
    realWorld:`A state government agency with 45,000 employees running PeopleSoft HCM was evaluating Oracle Cloud HCM. Analysis: they had 340 customizations across 89 modified delivered objects, a payroll interface with the state treasurer's office built entirely in custom Application Engine, and compliance requirements unique to state employment law (not covered by standard Cloud HCM). Decision: stay on PeopleSoft, move to OCI, adopt PeopleSoft Cloud Manager for environment management. Result: 40% reduction in infrastructure costs, environment provisioning from 2 weeks to 4 hours, quarterly PUM cadence established. Cloud HCM re-evaluation deferred to when Cloud HCM adds state/local government compliance features.`,
    mistakes:[
      {title:"Recommending Cloud HCM migration without a customization audit",desc:"The #1 mistake in PeopleSoft modernization consulting. Always start with a customization audit: how many modified delivered objects, how many custom AE programs, what integrations exist, how complex is the data model. A client with 300 customizations and 20 integrations faces a $15M+ migration. That changes the recommendation entirely."},
      {title:"Ignoring Selective Adoption in upgrade planning",desc:"Clients often apply a PUM Image and immediately activate all new features — then get complaints about unexpected UI changes. Establish a Selective Adoption policy: document each new feature in the Image, plan activation dates, train users before activation. The code update and the feature activation are separate events."},
    ],
    quiz:[
      {q:"What is Selective Adoption in PeopleSoft Continuous Delivery?",options:["Choosing which employees use PeopleSoft","New features deliver off by default — organizations choose when to activate them","Selecting which PUM fixes to apply","Choosing which modules to license"],correct:1,explanation:"Selective Adoption means Oracle delivers new features in PUM Images but leaves them deactivated by default. Organizations take the code update (in their regular PUM patch) but activate each feature on their own timeline — training users first, activating for pilots, then rolling out broadly."},
      {q:"What does PeopleSoft Cloud Manager provide?",options:["SaaS migration tooling","Automated PS environment provisioning and lifecycle management on OCI","Oracle Cloud HCM configuration","PeopleSoft licensing management"],correct:1,explanation:"PeopleSoft Cloud Manager is an Oracle tool automating PeopleSoft deployment on OCI. It provisions entire Web/App/DB environments, manages start/stop schedules, enables environment cloning in minutes, and handles PUM patch application — all from a web-based management console."},
    ],
    peopleBooksUrl:"https://docs.oracle.com/cd/F44947_01/pt858pbr3/eng/pt/tpum/",
  },
];


const CURRICULUM_LIST = {
  b: TOPICS.map(t => t.title),
  i: INTERMEDIATE_TOPICS.map(t => t.title),
  a: ADVANCED_TOPICS.map(t => t.title),
};
