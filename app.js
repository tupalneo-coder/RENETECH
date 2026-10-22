const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const STORAGE_KEY = 'renetech-learning-v1';
const CELEBRATION_CONFIG = {
  durationMs: 1500,
  matchingMistakeLimit: 1,
  streakLength: 4,
  streakMessage: 'Streak x{count}!',
  perfect: {
    messages: ['Good job!', 'Awesome!', 'Perfect!', "You're on fire!"],
    icon: '🎉',
    tier: 'perfect'
  },
  oneCorrect: {
    messages: ['Nice!', 'Keep going!', 'Not bad!', 'Almost there!'],
    icon: '✦',
    tier: 'steady'
  },
  noneCorrect: {
    messages: ["Don't give up!", "You've got this!", 'Keep trying!', 'Learn and move on!'],
    icon: '🌱',
    tier: 'encouraging'
  }
};
const FINAL_BOSS_CONFIG = {
  maxHealth: 1000,
  damagePerCorrect: 50,
  difficulties: {
    easy: { label: 'Easy', durationSeconds: 180, bonusPoints: 20 },
    medium: { label: 'Medium', durationSeconds: 120, bonusPoints: 25 },
    hard: { label: 'Hard', durationSeconds: 60, bonusPoints: 30 }
  }
};
const RANK_THRESHOLDS = [
  { name: 'New', points: 10 },
  { name: 'Intermediate', points: 50 },
  { name: 'Dedicated', points: 100 },
  { name: 'Addicted', points: 500 },
  { name: 'Goat', points: 1000 }
];
const randomChoice = values => values[Math.floor(Math.random() * values.length)];
const supabaseConfig = window.RENETECH_SUPABASE_CONFIG || {};
const supabaseClient = supabaseConfig.url && supabaseConfig.publishableKey && window.supabase?.createClient
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey)
  : null;
const mc = (prompt, options, answer, explanation) => ({ type: 'multiple-choice', prompt, options, answer, explanation });
const tf = (prompt, answer, explanation) => mc(prompt, ['True', 'False'], answer, explanation);
const fill = (prompt, choices, answer, explanation) => ({ type: 'fill-blank', prompt, choices, answer, explanation });
const matching = (prompt, pairs) => ({ type: 'matching', prompt, pairs });

const lessons = [
  {
    title: 'Occupational Health and Safety', category: 'SAFETY FIRST', icon: '✚',
    description: 'Learn safe work habits that protect you and computer components.',
    summary: ['Follow Occupational Health and Safety standards.', 'Power off and unplug before working; ground yourself before touching components.', 'Handle parts by their edges, keep liquids away, clean with a brush or air, and never force a component.'],
    questions: [
      mc('What does OHS stand for?', ['Office Health System', 'Occupational Health and Safety', 'Operational Hardware Standards', 'Organizational Health Service'], 'Occupational Health and Safety', 'OHS is short for Occupational Health and Safety.'),
      mc('Which Republic Act covers Occupational Safety and Health Standards?', ['RA 10173', 'RA 11058', 'RA 9155', 'RA 7877'], 'RA 11058', 'Republic Act 11058 covers Occupational Safety and Health Standards.'),
      tf('True or False: It is okay to work alone on a computer as long as you are careful.', 'False', 'Do not work alone; safe work practices include having appropriate assistance.'),
      mc('Before working on a computer, what should you always do first?', ['Turn up the brightness', 'Power off and unplug the computer', 'Open all programs', 'Connect to Wi-Fi'], 'Power off and unplug the computer', 'Disconnecting power reduces electrical and equipment risks.'),
      fill('Before touching a computer component, *__* yourself to discharge static electricity.', ['ground', 'insulate', 'charge', 'disconnect'], 'ground', 'Grounding discharges static electricity that could damage components.'),
      matching('Match each safe work habit with the right action.', [
        { left: 'Handle a circuit board', right: 'Hold it by the edges' },
        { left: 'Prepare to work inside a computer', right: 'Power off and unplug it' },
        { left: 'Reduce static electricity', right: 'Ground yourself' },
        { left: 'Remove dust', right: 'Use a brush or compressed air' }
      ]),
      tf('True or False: Liquids should be kept near your working area for convenience.', 'False', 'Keep liquids away from the work area to prevent spills and damage.'),
      matching('Match each safety concern with the best response.', [
        { left: 'Liquid near components', right: 'Keep it away from the work area' },
        { left: 'A component will not fit', right: 'Check alignment; never force it' },
        { left: 'Dust on a computer', right: 'Clean with a brush or air' },
        { left: 'Sensitive circuitry', right: 'Avoid touching it directly' }
      ]),
      fill('If a component does not fit easily, *__* it into place.', ['never force', 'gently hammer', 'bend', 'push hard'], 'never force', 'Check alignment and connections rather than forcing a component.'),
      mc('According to this level, what is the most important rule?', ['Speed 1st', 'Safety 1st', 'Cost 1st', 'Convenience 1st'], 'Safety 1st', 'Safety comes before speed, cost, or convenience.')
    ]
  },
  {
    title: 'CSS-Related Jobs', category: 'CAREER PATHS', icon: '⚙',
    description: 'Explore common roles in Computer System Servicing.',
    summary: ['Computer assemblers produce and assemble computer parts.', 'Network technicians build and troubleshoot networks; service technicians set up hardware and software.', 'Maintenance technicians support daily computer performance, while repairmen diagnose and repair customer devices.'],
    questions: [
      mc('Who is responsible for producing components and assembling computer parts?', ['Computer Assembler', 'Network Technician', 'Technical Support Staff', 'Computer Repairman'], 'Computer Assembler', 'Computer assemblers produce components and assemble computer parts.'),
      mc('Which job involves building and troubleshooting computer networks?', ['Computer Service Technician', 'Network Technician', 'Computer Assembler', 'Computer Maintenance Technician'], 'Network Technician', 'Network technicians build and troubleshoot computer networks.'),
      fill('A *__* Technician sets up hardware and configures software and drivers.', ['Computer Service', 'Network', 'Computer Repair', 'Maintenance'], 'Computer Service', 'Computer service technicians set up hardware and configure software and drivers.'),
      tf('True or False: A Technical Support Staff may handle installation of devices and software.', 'True', 'Technical support staff may install devices and software.'),
      mc('Which job is responsible for maintaining and providing technical support to overall daily computer performance?', ['Computer Maintenance Technician', 'Network Technician', 'Computer Assembler', 'Technical Support Staff'], 'Computer Maintenance Technician', 'Computer maintenance technicians support overall daily computer performance.'),
      matching('Match each CSS role with its main responsibility.', [
        { left: 'Computer Assembler', right: 'Produces components and assembles computer parts' },
        { left: 'Network Technician', right: 'Builds and troubleshoots computer networks' },
        { left: 'Computer Repairman', right: 'Diagnoses and repairs customer devices' },
        { left: 'Computer Maintenance Technician', right: 'Supports day-to-day computer performance' }
      ]),
      tf('True or False: A Network Technician is considered an information technology professional.', 'True', 'A Network Technician is an information technology professional.'),
      mc('Which job title is often common in businesses that provide repair and maintenance services?', ['Computer Repairman', 'Network Technician', 'Computer Assembler', 'Technical Support Staff'], 'Computer Repairman', 'Computer Repairman is a common title in repair and maintenance businesses.'),
      fill('A Computer Maintenance Technician has a more *__* set of skills compared to other CSS jobs.', ['diverse', 'limited', 'specialized', 'narrow'], 'diverse', 'The role uses a diverse set of skills across computer maintenance.'),
      fill('Technical Support Staff often handle *__*, installation, and configuration across organizations.', ['maintenance', 'network cabling', 'component manufacturing', 'circuit design'], 'maintenance', 'Technical support staff handle maintenance, installation, and configuration across organizations.')
    ]
  },
  {
    title: 'Computer Parts & Functions', category: 'HARDWARE FUNDAMENTALS', icon: '▣',
    description: 'Identify core computer components, ports, and what they do.',
    summary: ['The AVR regulates voltage; the CPU processes instructions, and RAM is temporary memory.', 'The HDD stores files, the motherboard connects components, and the BIOS provides basic setup access.', 'The PSU converts AC to low-voltage DC; PS2, HDMI, and SATA connect peripherals and devices.'],
    questions: [
      mc('Which device regulates voltage to protect the computer from electrical changes?', ['AVR', 'PSU', 'CPU', 'RAM'], 'AVR', 'An AVR regulates voltage to help protect the computer from electrical changes.'),
      mc('What is considered the "brain" of the computer?', ['Motherboard', 'CPU', 'RAM', 'HDD'], 'CPU', 'The CPU processes instructions and is commonly called the computer brain.'),
      fill('RAM is *__* memory, so its contents do not persist after power is off.', ['temporary', 'permanent', 'optical', 'external'], 'temporary', 'RAM is temporary memory; its contents do not persist after power is off.'),
      mc('Which component is the main storage device where files like those on the Desktop are stored?', ['Hard Disk Drive (HDD)', 'RAM', 'ROM', 'CMOS'], 'Hard Disk Drive (HDD)', 'The HDD is a main storage device for files.'),
      mc('What is the main circuit board that connects all other computer parts called?', ['Motherboard', 'System Chassis', 'Expansion Bus', 'CPU Socket'], 'Motherboard', 'The motherboard is the main circuit board connecting computer parts.'),
      fill('The *__* chip is a ROM chip on the motherboard that allows access to basic computer setup.', ['BIOS', 'CMOS', 'RAM', 'SATA'], 'BIOS', 'The BIOS ROM chip allows access to basic computer setup.'),
      matching('Match each core component with its main function.', [
        { left: 'CPU', right: 'Processes instructions' },
        { left: 'RAM', right: 'Holds temporary working data' },
        { left: 'HDD', right: 'Stores files and programs' },
        { left: 'Motherboard', right: 'Connects the computer components' }
      ]),
      mc('Which component converts alternating current into low-voltage direct current?', ['Power Supply Unit (PSU)', 'CPU', 'RAM', 'Sound Card'], 'Power Supply Unit (PSU)', 'The PSU converts alternating current to low-voltage direct current.'),
      matching('Match each connection or component with its purpose.', [
        { left: 'PS2 port', right: 'Connects a mouse or keyboard with a round plug' },
        { left: 'HDMI', right: 'Carries digital video and audio' },
        { left: 'SATA', right: 'Connects storage devices to the motherboard' },
        { left: 'PSU', right: 'Converts AC into low-voltage DC' }
      ]),
      tf('True or False: SATA is a standard used for connecting devices like optical drives and hard drives to the motherboard.', 'True', 'SATA connects storage devices such as hard drives and optical drives to the motherboard.')
    ]
  },
  {
    title: 'Prepare and Interpret Technical Drawings', category: 'TECHNICAL DRAWINGS', icon: '⌘',
    description: 'Read common diagram symbols and basic binary values.',
    summary: ['Flowcharts show process steps: terminators mark start/end, diamonds decisions, rectangles actions, and parallelograms input/output.', 'Schematic diagrams show abstract system elements; layout plans arrange equipment in a workspace.', 'One byte contains 8 bits. Decimal 5 is written as 0101 in binary.'],
    questions: [
      mc('What is a diagram called that shows the steps of a process using shapes and arrows?', ['Flowchart', 'Block Diagram', 'Layout Plan', 'Loop Diagram'], 'Flowchart', 'A flowchart shows process steps using symbols and arrows.'),
      matching('Match each flowchart symbol with its purpose.', [
        { left: 'Terminator (oval)', right: 'Marks the start or end' },
        { left: 'Diamond', right: 'Shows a decision branch' },
        { left: 'Rectangle', right: 'Shows a process or action' },
        { left: 'Parallelogram', right: 'Shows input or output' }
      ]),
      mc('Which flowchart symbol represents a decision with a Yes/No answer?', ['Diamond', 'Rectangle', 'Small Circle', 'Arrow Line'], 'Diamond', 'A diamond represents a decision, often with Yes/No branches.'),
      mc('Which flowchart symbol shows instructions or actions?', ['Rectangle (Process)', 'Diamond', 'Parallelogram', 'Small Circle'], 'Rectangle (Process)', 'A rectangle represents a process or action.'),
      fill('A flowchart *__* represents input and output.', ['parallelogram', 'diamond', 'rectangle', 'small circle'], 'parallelogram', 'A parallelogram represents input and output in a flowchart.'),
      fill('The small circle symbol in a flowchart is also called a *__*.', ['connector', 'terminator', 'process', 'decision'], 'connector', 'A small circle connects separated parts of a flowchart.'),
      matching('Match each diagram type with what it communicates.', [
        { left: 'Flowchart', right: 'Steps in a process using symbols and arrows' },
        { left: 'Schematic diagram', right: 'Abstract, symbolic system elements' },
        { left: 'Layout plan', right: 'Equipment placement in a workplace' },
        { left: 'Block diagram', right: 'High-level functional parts of a system' }
      ]),
      mc('Which tool is used to arrange a workplace and show how computers should be located?', ['Layout Plan', 'Loop Diagram', 'Chart', 'Flowchart'], 'Layout Plan', 'A layout plan shows how equipment is arranged in a workplace.'),
      mc('How many bits make up one byte?', ['4', '8', '16', '2'], '8', 'One byte is made up of 8 bits.'),
      mc('What is the binary representation of the decimal number 5?', ['0011', '0100', '0101', '0010'], '0101', 'Decimal 5 is 0101 in four-bit binary representation.')
    ]
  },
  {
    title: 'Computer Networks', category: 'NETWORKING', icon: '⌁',
    preserveOptionOrder: true,
    description: 'Learn network connections, network types, and common topologies.',
    summary: ['Computer networks connect devices so they can communicate and share resources.', 'Networks can be peer-to-peer or client/server; connections include wireless and wired media such as twisted pair.', 'LANs cover a building or campus; star and bus topologies each have distinct failure risks.'],
    questions: [
      mc('What is a computer network?', ['A single computer running multiple programs', 'Multiple computers connected to share resources and communicate with one another', 'A type of software for editing documents', 'A device that only connects to the internet'], 'Multiple computers connected to share resources and communicate with one another', 'A computer network connects devices so they can share resources and communicate.'),
      fill('A *__* connection uses communication links without a physical network cable.', ['wireless', 'twisted-pair', 'coaxial', 'fiber-optic'], 'wireless', 'Wireless links, such as satellite connections, do not use a physical network cable.'),
      matching('Match each network type with its defining feature.', [
        { left: 'Peer-to-Peer (P2P)', right: 'Each device can act as client and server' },
        { left: 'Client/Server', right: 'A central server manages network services' },
        { left: 'LAN', right: 'Covers a building or campus' },
        { left: 'WAN', right: 'Connects networks across large geographic areas' }
      ]),
      mc('A Client/Server network is best described as:', ['An equal network with no central authority', 'An organized network with a central server managing everything', 'A network limited to under 10 devices', 'A network with no scalability'], 'An organized network with a central server managing everything', 'A client/server network uses a central server to manage network services.'),
      mc('What does a Codec do?', ['Extends signal distance for campus networks', 'Converts digital to analog signals', 'Compresses/decompresses video or audio, such as for Zoom calls', 'Manages a central server'], 'Compresses/decompresses video or audio, such as for Zoom calls', 'A codec compresses and decompresses digital audio or video.'),
      fill('Cat5e and Cat6 network cables use *__* pairs of wires.', ['twisted', 'coaxial', 'fiber', 'parallel'], 'twisted', 'Cat5e and Cat6 are twisted-pair cables.'),
      mc('A LAN (Local Area Network) typically covers:', ['An entire country', 'A single building or campus', 'An entire city', 'The whole world'], 'A single building or campus', 'A LAN typically covers a limited local area such as a building or campus.'),
      mc('Which network type is described as the largest WAN and uses telecom infrastructure?', ['LAN', 'MAN', 'The Internet', 'P2P'], 'The Internet', 'The Internet is the largest WAN and relies on telecommunications infrastructure.'),
      matching('Match each topology with its failure risk.', [
        { left: 'Star topology', right: 'A central hub failure disrupts connected devices' },
        { left: 'Bus topology', right: 'A break in the main cable can disrupt the network' },
        { left: 'Ring topology', right: 'A break can interrupt the circular path' },
        { left: 'Mesh topology', right: 'Multiple paths can provide alternate routes' }
      ]),
      mc('What is a key disadvantage of Bus topology?', ['It requires a central hub', 'A cable break disrupts the entire network', 'It cannot connect more than 2 devices', 'It always uses fiber optic cable'], 'A cable break disrupts the entire network', 'A break in the main bus cable can disrupt the entire network.')
    ]
  }
];
const FINAL_BOSS_QUESTION_POOL = lessons.flatMap(lesson => lesson.questions);

function levelForPoints(points) {
  return Math.floor(Math.max(0, points) / 10) + 1;
}

function rankForPoints(points) {
  return [...RANK_THRESHOLDS].reverse().find(rank => points >= rank.points) || { name: 'Unranked', points: 0 };
}

function loadSavedState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function shuffleItems(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function prepareQuestions(lesson) {
  return lesson.questions.map(question => {
    const type = question.type || 'multiple-choice';
    if (type === 'multiple-choice') {
      return { ...question, type, options: lesson.preserveOptionOrder ? [...question.options] : shuffleItems(question.options) };
    }
    if (type === 'fill-blank') {
      return { ...question, type, choices: shuffleItems(question.choices || question.options || []) };
    }
    if (type === 'matching') return { ...question, type, pairs: question.pairs.map(pair => ({ ...pair })) };
    return { ...question, type: 'multiple-choice', options: [...(question.options || [])] };
  });
}

function createPlayerId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
    const random = Math.random() * 16 | 0;
    return (character === 'x' ? random : (random & 0x3 | 0x8)).toString(16);
  });
}

const saved = loadSavedState();
const state = {
  xp: Number.isFinite(saved.xp) ? Math.max(0, saved.xp) : 0,
  passed: Array.isArray(saved.passed) ? saved.passed.filter(index => Number.isInteger(index) && index >= 0 && index < lessons.length) : [],
  identity: typeof saved.identity === 'string' ? saved.identity : '',
  playerId: typeof saved.playerId === 'string' ? saved.playerId : createPlayerId(),
  players: saved.players && typeof saved.players === 'object' ? saved.players : {},
  attempts: Array.isArray(saved.attempts) ? saved.attempts : [],
  sharedEntries: null,
  sharedLoading: false,
  sharedError: '',
  filter: 'all',
  muted: saved.muted === true
};
let activeLessonIndex = null;
let activeQuestionIndex = 0;
let activeQuestions = [];
let selectedAnswer = null;
let answerScore = 0;
let selectedFillWord = null;
let matchingState = null;
let answerLocked = false;
let questionResults = [];
let correctStreak = 0;
let celebrationTimer = null;
let celebrationActive = false;
let matchingResetTimer = null;
let proofCode = '';
let audioContext = null;
let activeToneNodes = [];
let activeAttemptWasReplay = false;
let closeLessonTimer = null;
let activeBoss = false;
let bossState = null;
let bossTimer = null;

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ xp: state.xp, passed: state.passed, identity: state.identity, playerId: state.playerId, players: state.players, attempts: state.attempts, muted: state.muted })); }
  catch { toast('Progress could not be saved in this browser.'); }
}

function toast(message) {
  $('#toast-message').textContent = message;
  $('.toast').classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => $('.toast').classList.remove('show'), 2800);
}

function updateDate() {
  $('#page-kicker').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());
}

function unlocked(index) { return index === 0 || state.passed.includes(index - 1); }

function renderLessons() {
  const visible = lessons.map((lesson, index) => ({ lesson, index, passed: state.passed.includes(index), unlocked: unlocked(index) }))
    .filter(item => state.filter === 'all' || (state.filter === 'completed' ? item.passed : item.unlocked && !item.passed));
  const levelRows = visible.map(({ lesson, index, passed, unlocked: isUnlocked }) => {
    const status = passed ? 'Passed' : isUnlocked ? 'Ready to start' : 'Locked';
    const action = isUnlocked ? `<button class="row-button" type="button" data-lesson-index="${index}">${passed ? 'Replay' : 'Start'} <span>→</span></button>` : '<span class="lock-mark" aria-label="Locked">&#128274;</span>';
    return `<article class="lesson-row${isUnlocked ? '' : ' locked'}${state.newUnlock === index ? ' just-unlocked' : ''}"><div class="lesson-thumb lesson-symbol lesson-symbol-${index}">${lesson.icon}</div><div><span class="eyebrow">LEVEL ${index + 1} · ${lesson.category}</span><h3>${lesson.title}</h3><p>${lesson.description} &nbsp; 10 questions</p></div><div class="row-action"><div class="row-status ${passed ? 'completed' : ''}">${status}</div>${action}</div></article>`;
  }).join('');
  const bossUnlocked = state.passed.includes(lessons.length - 1);
  const showBoss = state.filter === 'all' || (state.filter === 'in-progress' && bossUnlocked);
  const bossRow = showBoss
    ? `<article class="lesson-row final-boss-row${bossUnlocked ? '' : ' locked'}"><div class="lesson-thumb final-boss-icon">♛</div><div><span class="eyebrow">FINAL CHALLENGE</span><h3>Final Boss</h3><p>Defeat the boss after completing Level 5. 50 shuffled questions.</p></div><div class="row-action"><div class="row-status">${bossUnlocked ? 'Ready to fight' : 'Locked until Level 5 is passed'}</div>${bossUnlocked ? '<button class="row-button" type="button" data-boss-launch>Choose difficulty <span>→</span></button>' : '<span class="lock-mark" aria-label="Locked">&#128274;</span>'}</div></article>`
    : '';
  $('#lesson-list').innerHTML = levelRows + bossRow;
  $$('.row-button', $('#lesson-list')).forEach(button => button.addEventListener('click', () => openLesson(Number(button.dataset.lessonIndex))));
  $('#lesson-list [data-boss-launch]')?.addEventListener('click', openBossDifficulty);
  $('#lesson-count').textContent = lessons.length;
}

function updateStats() {
  const weeklyPoints = state.attempts.filter(attempt => Number(attempt.at) >= Date.now() - 7 * 24 * 60 * 60 * 1000).reduce((sum, attempt) => sum + (Number(attempt.points) || 0), 0);
  $('#xp-total').textContent = state.xp.toLocaleString();
  $('#xp-week').textContent = weeklyPoints.toLocaleString();
  $('#streak-total').textContent = state.passed.length;
  $('#passed-total').textContent = ` / ${lessons.length}`;
  $('#sidebar-streak').textContent = `${state.passed.length} levels passed`;
  $('#passed-message').textContent = state.passed.length === lessons.length ? 'Replay levels for more points.' : 'Pass with 7 out of 10 to unlock the next level.';
  $('#goal-complete').textContent = `${state.passed.length} of ${lessons.length}`;
  $('#goal-percent').textContent = Math.round((state.passed.length / lessons.length) * 100);
  renderProgress();
  updateNextLesson();
}

function updateNextLesson() {
  const nextIndex = lessons.findIndex((_, index) => unlocked(index) && !state.passed.includes(index));
  const button = $('#next-level-start');
  if (nextIndex < 0 && state.passed.includes(lessons.length - 1)) {
    $('#next-lesson-title').textContent = 'Final Boss';
    $('#next-lesson-description').textContent = 'All five levels are complete. Choose a difficulty and take on the final challenge.';
    $('#next-lesson-number').textContent = 'Final challenge · 50 questions';
    $('#next-level-question-count').textContent = '1,000 HP';
    button.removeAttribute('data-start-lesson');
    button.dataset.bossLaunch = '';
    button.innerHTML = 'Challenge the Final Boss <span>→</span>';
    return;
  }
  const index = nextIndex < 0 ? 0 : nextIndex;
  const lesson = lessons[index];
  $('#next-lesson-title').textContent = lesson.title;
  $('#next-lesson-description').textContent = lesson.description;
  $('#next-lesson-number').textContent = `Level ${index + 1} of ${lessons.length}`;
  $('#next-level-question-count').textContent = '10 questions';
  button.dataset.startLesson = index;
  delete button.dataset.bossLaunch;
  button.innerHTML = 'Start level <span>→</span>';
}

function renderProgress() {
  const level = levelForPoints(state.xp);
  const levelEnd = level * 10;
  const levelStart = levelEnd - 10;
  const progress = Math.round(((state.xp - levelStart) / 10) * 100);
  const remaining = levelEnd - state.xp;
  const rank = rankForPoints(state.xp);
  const nextRank = RANK_THRESHOLDS.find(item => state.xp < item.points);
  const habitScore = Math.min(100, 70 + state.passed.length * 3);
  $('#progress-level-badge').textContent = `LEVEL ${level}`;
  $('#level-xp').textContent = `${state.xp.toLocaleString()} / ${levelEnd.toLocaleString()} points`;
  $('#level-progress-bar').style.width = `${progress}%`;
  $('#progress-level-label').textContent = `Level ${level}`;
  $('#xp-to-next').textContent = `${remaining.toLocaleString()} points to level ${level + 1}`;
  $('#current-rank').textContent = rank.name;
  $('#points-to-next-rank').textContent = nextRank
    ? `${(nextRank.points - state.xp).toLocaleString()} points to ${nextRank.name} rank`
    : 'Highest rank reached';
  $('#habit-score').textContent = habitScore;
  $('#habit-summary').textContent = `You have passed ${state.passed.length} of ${lessons.length} levels. Keep building your skills.`;
  const nextRankIndex = nextRank ? RANK_THRESHOLDS.indexOf(nextRank) : -1;
  $('#rank-milestones').innerHTML = RANK_THRESHOLDS.map((item, index) =>
    `<div class="milestone${state.xp >= item.points ? ' done' : ''}${index === nextRankIndex ? ' current' : ''}"><span>✦</span><strong>${item.name}</strong><small>${item.points.toLocaleString()} points</small></div>`
  ).join('');
}

function syncPlayerScore() {
  if (!state.identity) return;
  state.players[state.playerId] = { player_id: state.playerId, name: state.identity, points: state.xp };
}

async function publishPlayerScore() {
  if (!supabaseClient || !state.identity) return false;
  const { error } = await supabaseClient.from('leaderboard_entries').upsert({
    player_id: state.playerId,
    last_name: state.identity,
    points: state.xp,
    updated_at: new Date().toISOString()
  }, { onConflict: 'player_id' });
  if (error) throw error;
  return true;
}

async function loadSharedLeaderboard() {
  state.sharedLoading = true;
  state.sharedError = '';
  renderLeaderboard();
  if (!supabaseClient) {
    state.sharedError = 'The shared leaderboard client could not load.';
    state.sharedLoading = false;
    renderLeaderboard();
    return;
  }
  let scoreSyncFailed = false;
  if (state.identity) {
    try { await publishPlayerScore(); }
    catch { scoreSyncFailed = true; }
  }
  try {
    const { data, error } = await supabaseClient
      .from('leaderboard_entries')
      .select('player_id, last_name, points, updated_at')
      .order('points', { ascending: false })
      .order('updated_at', { ascending: true })
      .limit(100);
    if (error) throw error;
    state.sharedEntries = data.map(entry => ({ player_id: entry.player_id, name: entry.last_name, points: Number(entry.points) }));
    if (scoreSyncFailed) state.sharedError = 'Your score could not be updated.';
  } catch {
    state.sharedEntries = null;
    state.sharedError = 'Could not sync the shared leaderboard. Check the Supabase SQL setup and connection.';
  }
  state.sharedLoading = false;
  renderLeaderboard();
}

function playSound(kind) {
  if (state.muted) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    activeToneNodes.forEach(oscillator => {
      try { oscillator.stop(now); } catch { /* The tone may have ended already. */ }
      oscillator.disconnect();
    });
    activeToneNodes = [];
    const patterns = { correct: [660, 880], wrong: [260, 190], pass: [523, 659, 784], points: [740, 988], neutral: [440], tick: [880] };
    (patterns[kind] || [440]).forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = now + index * 0.11;
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.09, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.17);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.18);
      activeToneNodes.push(oscillator);
    });
  } catch { /* Audio is optional when browser playback is unavailable. */ }
}

function playResultSound(didPass) {
  if (state.muted) return;
  const audio = $(didPass ? '#lesson-pass-sound' : '#lesson-fail-sound');
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  audio.loop = false;
  audio.volume = didPass ? 0.72 : 0.48;
  audio.play().catch(() => {});
}

function openLesson(index) {
  if (!unlocked(index)) return;
  stopBossTimer();
  activeBoss = false;
  bossState = null;
  clearTimeout(closeLessonTimer);
  clearTimeout(celebrationTimer);
  clearTimeout(matchingResetTimer);
  celebrationActive = false;
  $('#celebration-overlay').hidden = true;
  $('#lesson-flow').classList.remove('is-closing');
  activeLessonIndex = index;
  activeAttemptWasReplay = state.passed.includes(index);
  activeQuestionIndex = 0;
  activeQuestions = [];
  selectedAnswer = null;
  selectedFillWord = null;
  matchingState = null;
  answerLocked = false;
  questionResults = [];
  correctStreak = 0;
  answerScore = 0;
  $('#lesson-flow').hidden = false;
  renderSummary();
  $('#flow-close').focus();
}

function closeLesson() {
  const dialog = $('#lesson-flow');
  if ((celebrationActive && !activeBoss) || dialog.hidden || dialog.classList.contains('is-closing')) return;
  stopBossTimer();
  clearTimeout(celebrationTimer);
  celebrationActive = false;
  $('#celebration-overlay').hidden = true;
  activeBoss = false;
  bossState = null;
  clearTimeout(matchingResetTimer);
  dialog.classList.add('is-closing');
  closeLessonTimer = setTimeout(() => {
    dialog.hidden = true;
    dialog.classList.remove('is-closing');
    activeLessonIndex = null;
  }, 190);
}

function openBossDifficulty() {
  if (!state.passed.includes(lessons.length - 1)) return;
  stopBossTimer();
  clearTimeout(closeLessonTimer);
  clearTimeout(celebrationTimer);
  clearTimeout(matchingResetTimer);
  celebrationActive = false;
  $('#celebration-overlay').hidden = true;
  $('#lesson-flow').classList.remove('is-closing');
  $('#lesson-flow').hidden = false;
  activeBoss = true;
  activeLessonIndex = null;
  activeQuestions = [];
  activeQuestionIndex = 0;
  selectedAnswer = null;
  selectedFillWord = null;
  matchingState = null;
  answerLocked = false;
  questionResults = [];
  correctStreak = 0;
  answerScore = 0;
  bossState = null;
  const options = Object.entries(FINAL_BOSS_CONFIG.difficulties).map(([key, difficulty]) =>
    `<button class="boss-difficulty-card" type="button" data-boss-difficulty="${key}"><strong>${difficulty.label}</strong><span>${Math.floor(difficulty.durationSeconds / 60)}:${String(difficulty.durationSeconds % 60).padStart(2, '0')} timer</span><small>+${difficulty.bonusPoints} bonus points on victory</small></button>`
  ).join('');
  $('#lesson-flow-content').innerHTML = `<p class="eyebrow">FINAL CHALLENGE</p><div class="flow-lesson-icon final-boss-icon">♛</div><h1 id="flow-title">Final Boss</h1><p class="flow-lead">Choose your difficulty. Each correct answer deals ${FINAL_BOSS_CONFIG.damagePerCorrect} damage; defeat the boss before time runs out.</p><div class="boss-difficulty-grid">${options}</div><div class="flow-footer"><span>Boss health: ${FINAL_BOSS_CONFIG.maxHealth} HP</span><button class="text-button" type="button" data-back-lessons>Back to levels</button></div>`;
  $$('[data-boss-difficulty]').forEach(button => button.addEventListener('click', () => startBossFight(button.dataset.bossDifficulty)));
  $('[data-back-lessons]').addEventListener('click', () => { closeLesson(); setView('lessons'); });
  $('#flow-close').focus();
}

function startBossFight(difficultyKey) {
  const difficulty = FINAL_BOSS_CONFIG.difficulties[difficultyKey];
  if (!difficulty) return;
  stopBossTimer();
  answerScore = 0;
  questionResults = [];
  correctStreak = 0;
  activeQuestionIndex = 0;
  selectedAnswer = null;
  selectedFillWord = null;
  matchingState = null;
  answerLocked = false;
  activeBoss = true;
  bossState = {
    difficultyKey,
    health: FINAL_BOSS_CONFIG.maxHealth,
    deadline: Date.now() + difficulty.durationSeconds * 1000,
    remainingWhenPaused: null,
    answered: 0,
    finished: false
  };
  activeQuestions = shuffleItems(prepareQuestions({ questions: FINAL_BOSS_QUESTION_POOL }));
  renderQuestion();
  startBossTimer();
}

function startBossTimer() {
  stopBossTimer();
  let previousSeconds = null;
  const updateTimer = () => {
    if (!bossState || bossState.finished || bossState.health === 0) return;
    const remaining = Math.max(0, Math.ceil((bossState.deadline - Date.now()) / 1000));
    const timer = $('.boss-timer');
    if (timer) {
      timer.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
      timer.classList.toggle('is-urgent', remaining <= 10);
    }
    if (remaining > 0 && remaining <= 10 && remaining !== previousSeconds) playSound('tick');
    previousSeconds = remaining;
    if (remaining === 0) finishBossAttempt(false);
  };
  updateTimer();
  bossTimer = setInterval(updateTimer, 200);
}

function stopBossTimer() {
  if (bossTimer !== null) clearInterval(bossTimer);
  bossTimer = null;
}

function bossTimeExpired() {
  if (!activeBoss || !bossState || bossState.health === 0 || Date.now() < bossState.deadline) return false;
  finishBossAttempt(false);
  return true;
}

document.addEventListener('visibilitychange', () => {
  if (!activeBoss || !bossState || bossState.finished) return;
  if (document.hidden) {
    bossState.remainingWhenPaused = Math.max(0, bossState.deadline - Date.now());
    stopBossTimer();
  } else if (bossState.remainingWhenPaused !== null) {
    bossState.deadline = Date.now() + bossState.remainingWhenPaused;
    bossState.remainingWhenPaused = null;
    startBossTimer();
  }
});

function updateBossHealth() {
  const bar = $('.boss-health-fill');
  const label = $('.boss-health-value');
  if (!bossState || !bar || !label) return;
  $('.boss-health-track').setAttribute('aria-valuenow', String(bossState.health));
  bar.style.width = `${(bossState.health / FINAL_BOSS_CONFIG.maxHealth) * 100}%`;
  label.textContent = `${bossState.health.toLocaleString()} HP`;
  if (bossState.health < FINAL_BOSS_CONFIG.maxHealth) {
    bar.classList.remove('boss-hit');
    void bar.offsetWidth;
    bar.classList.add('boss-hit');
    $('.boss-health')?.classList.add('boss-shake');
    setTimeout(() => $('.boss-health')?.classList.remove('boss-shake'), 420);
  }
}

function finishBossAttempt(won) {
  if (!bossState || bossState.finished) return;
  bossState.finished = true;
  stopBossTimer();
  clearTimeout(matchingResetTimer);
  clearTimeout(celebrationTimer);
  celebrationActive = false;
  $('#celebration-overlay').hidden = true;
  answerLocked = true;
  const difficulty = FINAL_BOSS_CONFIG.difficulties[bossState.difficultyKey];
  const bonus = won ? difficulty.bonusPoints : 0;
  state.xp += answerScore + bonus;
  state.attempts.push({ at: Date.now(), points: answerScore + bonus, boss: true });
  syncPlayerScore();
  persist();
  if (state.identity) publishPlayerScore().catch(() => { state.sharedError = 'Your latest score could not be synced.'; });
  updateStats();
  if (answerScore > 0) playSound('points');
  renderBossResult(won, bonus);
  playResultSound(won);
}

function renderBossResult(won, bonus) {
  const title = won ? 'Boss Defeated!' : "Time's up!";
  const message = won
    ? `You defeated the Final Boss on ${FINAL_BOSS_CONFIG.difficulties[bossState.difficultyKey].label} difficulty!`
    : 'The boss is still standing. Try again with a new attempt and a fresh timer.';
  const confetti = won
    ? `<div class="boss-confetti" aria-hidden="true">${Array.from({ length: 36 }, (_, index) => `<i style="--confetti-index:${index};--confetti-left:${(index * 37 + 9) % 100}%;--confetti-color:${['#f2b632', '#2459a6', '#23834b', '#c94343'][index % 4]}"></i>`).join('')}</div>`
    : '';
  $('#lesson-flow-content').innerHTML = `${confetti}<div class="result-burst ${won ? 'pass-burst' : 'retry-burst'}">${won ? '✦' : '↻'}</div><p class="eyebrow">FINAL BOSS RESULT</p><h1 id="flow-title">${title}</h1><p class="flow-lead">${message}</p><div class="score-summary"><div><strong>${answerScore}</strong><small>question points earned</small></div><div><strong>${bonus ? `+${bonus}` : '0'}</strong><small>victory bonus</small></div><div><strong>${state.xp.toLocaleString()}</strong><small>total points</small></div></div><div class="flow-footer"><button class="text-button" type="button" data-back-lessons>Back to levels</button><button class="primary-button" type="button" data-retry-boss>Retry Final Boss <span>↻</span></button></div>`;
  $('[data-retry-boss]').addEventListener('click', openBossDifficulty);
  $('[data-back-lessons]').addEventListener('click', () => { closeLesson(); setView('lessons'); });
}

function renderSummary() {
  const lesson = lessons[activeLessonIndex];
  $('#lesson-flow-content').innerHTML = `<p class="eyebrow">LEVEL ${activeLessonIndex + 1} · ${lesson.category}</p><div class="flow-lesson-icon">${lesson.icon}</div><h1 id="flow-title">${lesson.title}</h1><p class="flow-lead">${lesson.description}</p><ul class="summary-points">${lesson.summary.map(point => `<li>${point}</li>`).join('')}</ul><div class="flow-footer"><span>10 questions · Pass with 7 correct</span><button class="primary-button" type="button" data-begin-quiz>Begin Level <span>→</span></button></div>`;
  $('[data-begin-quiz]').addEventListener('click', () => {
    activeQuestions = prepareQuestions(lesson);
    questionResults = [];
    correctStreak = 0;
    answerScore = 0;
    activeQuestionIndex = 0;
    renderQuestion();
  });
}

function renderQuestion() {
  selectedAnswer = null;
  selectedFillWord = null;
  matchingState = null;
  answerLocked = false;
  const question = activeQuestions[activeQuestionIndex];
  const progress = ((activeQuestionIndex + 1) / activeQuestions.length) * 100;
  const lesson = activeBoss ? null : lessons[activeLessonIndex];
  const header = activeBoss
    ? `<div class="boss-status"><div class="boss-health"><div class="boss-health-label"><span>FINAL BOSS HEALTH</span><strong class="boss-health-value">${bossState.health.toLocaleString()} HP</strong></div><div class="boss-health-track" role="progressbar" aria-label="Boss health" aria-valuemin="0" aria-valuemax="${FINAL_BOSS_CONFIG.maxHealth}" aria-valuenow="${bossState.health}"><span class="boss-health-fill" style="width:100%"></span></div></div><div class="boss-timer-wrap"><span>TIME</span><strong class="boss-timer" role="timer" aria-label="Time remaining">--:--</strong></div></div><p class="eyebrow">FINAL BOSS · ${FINAL_BOSS_CONFIG.difficulties[bossState.difficultyKey].label.toUpperCase()} MODE</p><div class="quiz-heading"><h1 id="flow-title">Final Boss</h1><span>Question ${bossState.answered + 1}</span></div>`
    : `<p class="eyebrow">LEVEL ${activeLessonIndex + 1} · ${lesson.category}</p><div class="quiz-heading"><h1 id="flow-title">${lesson.title}</h1><span>Question ${activeQuestionIndex + 1} / ${activeQuestions.length}</span></div><div class="quiz-progress" role="progressbar" aria-label="Level progress" aria-valuemin="0" aria-valuemax="${activeQuestions.length}" aria-valuenow="${activeQuestionIndex + 1}"><span style="width:${progress}%"></span></div>`;
  const questionType = question.type || 'multiple-choice';
  const renderers = {
    'multiple-choice': renderMultipleChoiceQuestion,
    'fill-blank': renderFillBlankQuestion,
    matching: renderMatchingQuestion
  };
  $('#lesson-flow-content').innerHTML = `${header}${(renderers[questionType] || renderMultipleChoiceQuestion)(question)}`;

  if (questionType === 'multiple-choice') bindMultipleChoiceQuestion(question);
  else if (questionType === 'fill-blank') bindFillBlankQuestion(question);
  else if (questionType === 'matching') bindMatchingQuestion(question);
}

function renderMultipleChoiceQuestion(question) {
  const nextLabel = activeBoss ? 'Continue' : activeQuestionIndex === activeQuestions.length - 1 ? 'See results' : 'Next question';
  return `<h2 class="question-prompt">${question.prompt}</h2><div class="answer-list" role="group" aria-label="Answer choices">${question.options.map((option, index) => `<button class="answer-choice" type="button" data-answer-index="${index}"><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join('')}</div><div class="answer-feedback" id="answer-feedback" aria-live="polite"></div><div class="flow-footer quiz-footer"><span>${answerScore} correct so far</span><button class="primary-button" type="button" data-next-question disabled>${nextLabel} <span>→</span></button></div>`;
}

function renderFillBlankQuestion(question) {
  const prompt = question.prompt.replace('*__*', '<button class="blank-slot" type="button" data-blank-slot aria-label="Remove selected word">Choose a word</button>');
  return `<h2 class="question-prompt fill-prompt">${prompt}</h2><div class="fill-choices" role="group" aria-label="Word choices">${question.choices.map((word, index) => `<button class="fill-word-choice" type="button" data-fill-choice="${index}">${word}</button>`).join('')}</div><div class="answer-feedback" id="answer-feedback" aria-live="polite"></div><div class="flow-footer quiz-footer"><span>${answerScore} correct so far</span><button class="primary-button" type="button" data-check-fill disabled>Check</button></div>`;
}

function renderMatchingQuestion(question) {
  const leftItems = shuffleItems(question.pairs.map((pair, index) => ({ value: pair.left, index })));
  const rightItems = shuffleItems(question.pairs.map((pair, index) => ({ value: pair.right, index })));
  matchingState = { selectedLeft: null, matched: new Set(), mistakes: 0, resolving: false, completed: false };
  return `<h2 class="question-prompt">${question.prompt}</h2><div class="matching-columns"><div class="matching-column" role="group" aria-label="Terms">${leftItems.map(item => `<button class="matching-choice" type="button" data-match-side="left" data-pair-index="${item.index}">${item.value}</button>`).join('')}</div><div class="matching-column" role="group" aria-label="Definitions">${rightItems.map(item => `<button class="matching-choice" type="button" data-match-side="right" data-pair-index="${item.index}">${item.value}</button>`).join('')}</div></div><div class="answer-feedback" id="answer-feedback" aria-live="polite"></div><div class="flow-footer quiz-footer"><span data-match-status>0 of ${question.pairs.length} matched · 0 mistakes</span><button class="primary-button" type="button" data-match-continue disabled>Match all pairs</button></div>`;
}

function bindMultipleChoiceQuestion(question) {
  $$('.answer-choice').forEach((button, index) => {
    button.style.setProperty('--choice-index', index);
    button.addEventListener('click', () => chooseAnswer(Number(button.dataset.answerIndex)));
  });
  $('[data-next-question]').addEventListener('click', advanceAfterAnswer);
}

function bindFillBlankQuestion(question) {
  $$('.fill-word-choice').forEach(button => button.addEventListener('click', () => {
    if (answerLocked) return;
    selectedFillWord = Number(button.dataset.fillChoice);
    $$('.fill-word-choice').forEach(choice => choice.classList.toggle('is-selected', choice === button));
    const blank = $('[data-blank-slot]');
    blank.textContent = question.choices[selectedFillWord];
    blank.classList.add('has-word');
    $('[data-check-fill]').disabled = false;
  }));
  $('[data-blank-slot]').addEventListener('click', () => {
    if (answerLocked || selectedFillWord === null) return;
    selectedFillWord = null;
    $('[data-blank-slot]').textContent = 'Choose a word';
    $('[data-blank-slot]').classList.remove('has-word');
    $$('.fill-word-choice').forEach(choice => choice.classList.remove('is-selected'));
    $('[data-check-fill]').disabled = true;
  });
  $('[data-check-fill]').addEventListener('click', () => submitFillAnswer(question));
}

function bindMatchingQuestion(question) {
  $$('.matching-choice').forEach(button => button.addEventListener('click', () => chooseMatch(button, question)));
  $('[data-match-continue]').addEventListener('click', advanceAfterAnswer);
}

function recordQuestionResult(isCorrect) {
  questionResults.push(isCorrect);
  if (isCorrect) {
    answerScore += 1;
    correctStreak += 1;
  } else correctStreak = 0;
  if (activeBoss) {
    bossState.answered += 1;
    if (isCorrect) bossState.health = Math.max(0, bossState.health - FINAL_BOSS_CONFIG.damagePerCorrect);
    updateBossHealth();
    if (bossState.health === 0) stopBossTimer();
  }
}

function chooseAnswer(optionIndex) {
  if (selectedAnswer !== null || answerLocked) return;
  if (bossTimeExpired()) return;
  const question = activeQuestions[activeQuestionIndex];
  selectedAnswer = question.options[optionIndex];
  const isCorrect = selectedAnswer.toLocaleLowerCase() === question.answer.toLocaleLowerCase();
  answerLocked = true;
  recordQuestionResult(isCorrect);
  $$('.answer-choice').forEach((button, index) => {
    const option = question.options[index];
    button.disabled = true;
    if (option.toLocaleLowerCase() === question.answer.toLocaleLowerCase()) button.classList.add('is-correct');
    if (index === optionIndex && !isCorrect) button.classList.add('is-wrong');
  });
  const feedback = $('#answer-feedback');
  feedback.className = `answer-feedback show ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
  feedback.textContent = isCorrect ? `Correct! ${question.explanation}` : `Not quite. Correct answer: ${question.answer}. ${question.explanation}`;
  playSound(isCorrect ? 'correct' : 'wrong');
  $('[data-next-question]').disabled = false;
}

function submitFillAnswer(question) {
  if (selectedFillWord === null || answerLocked) return;
  if (bossTimeExpired()) return;
  answerLocked = true;
  const selectedWord = question.choices[selectedFillWord];
  const isCorrect = selectedWord.toLocaleLowerCase() === question.answer.toLocaleLowerCase();
  recordQuestionResult(isCorrect);
  const blank = $('[data-blank-slot]');
  blank.disabled = true;
  blank.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
  $$('.fill-word-choice').forEach((button, index) => {
    button.disabled = true;
    if (question.choices[index].toLocaleLowerCase() === question.answer.toLocaleLowerCase()) button.classList.add('is-correct');
    if (index === selectedFillWord && !isCorrect) button.classList.add('is-wrong');
  });
  showAnswerFeedback(isCorrect, isCorrect ? `Correct! ${question.explanation}` : `Correct answer: ${question.answer}. ${question.explanation}`);
  playSound(isCorrect ? 'correct' : 'wrong');
}

function chooseMatch(button, question) {
  if (bossTimeExpired()) return;
  const side = button.dataset.matchSide;
  const pairIndex = Number(button.dataset.pairIndex);
  if (answerLocked || matchingState.resolving || matchingState.completed || matchingState.matched.has(pairIndex)) return;
  if (side === 'left') {
    matchingState.selectedLeft = pairIndex;
    $$('[data-match-side="left"]').forEach(item => item.classList.toggle('is-selected', item === button));
    return;
  }
  if (matchingState.selectedLeft === null) return;
  const leftIndex = matchingState.selectedLeft;
  const leftButton = $(`[data-match-side="left"][data-pair-index="${leftIndex}"]`);
  if (leftIndex === pairIndex) {
    matchingState.matched.add(pairIndex);
    leftButton.classList.remove('is-selected');
    leftButton.classList.add('is-correct');
    button.classList.add('is-correct');
    matchingState.selectedLeft = null;
    playSound('correct');
    updateMatchingProgress(question);
    return;
  }
  matchingState.mistakes += 1;
  matchingState.resolving = true;
  leftButton.classList.add('is-wrong');
  button.classList.add('is-wrong');
  playSound('wrong');
  updateMatchingProgress(question);
  matchingResetTimer = setTimeout(() => {
    if (!matchingState || matchingState.completed) return;
    leftButton.classList.remove('is-selected', 'is-wrong');
    button.classList.remove('is-wrong');
    matchingState.selectedLeft = null;
    matchingState.resolving = false;
  }, 520);
}

function updateMatchingProgress(question) {
  const count = matchingState.matched.size;
  $('[data-match-status]').textContent = `${count} of ${question.pairs.length} matched · ${matchingState.mistakes} mistake${matchingState.mistakes === 1 ? '' : 's'}`;
  if (count !== question.pairs.length) return;
  matchingState.completed = true;
  answerLocked = true;
  const isCorrect = matchingState.mistakes <= CELEBRATION_CONFIG.matchingMistakeLimit;
  recordQuestionResult(isCorrect);
  $$('.matching-choice').forEach(item => { item.disabled = true; });
  showAnswerFeedback(isCorrect,
    isCorrect
      ? 'All pairs matched! Correct!'
      : `All pairs matched, but there were ${matchingState.mistakes} mistakes. You can miss ${CELEBRATION_CONFIG.matchingMistakeLimit} or fewer.`);
}

function showAnswerFeedback(isCorrect, message) {
  const feedback = $('#answer-feedback');
  feedback.className = `answer-feedback show ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
  feedback.textContent = message;
  const footer = $('.quiz-footer');
  footer.innerHTML = `<span>${answerScore} correct so far</span><button class="primary-button" type="button" data-new-continue>Continue <span>→</span></button>`;
  $('[data-new-continue]').addEventListener('click', advanceAfterAnswer);
}

function advanceAfterAnswer() {
  if (bossTimeExpired()) return;
  if (!answerLocked || celebrationActive) return;
  if (activeBoss) {
    if (bossState.answered % 2 === 0) {
      showCelebration();
      return;
    }
    continueBossFight();
    return;
  }
  if (activeQuestionIndex === activeQuestions.length - 1) {
    finishAttempt();
    return;
  }
  if ((activeQuestionIndex + 1) % 2 === 0) {
    showCelebration();
    return;
  }
  activeQuestionIndex += 1;
  renderQuestion();
}

function continueBossFight() {
  if (bossState.health === 0) {
    finishBossAttempt(true);
    return;
  }
  activeQuestionIndex += 1;
  if (activeQuestionIndex >= activeQuestions.length) {
    activeQuestions = shuffleItems(prepareQuestions({ questions: FINAL_BOSS_QUESTION_POOL }));
    activeQuestionIndex = 0;
  }
  renderQuestion();
}

function showCelebration() {
  celebrationActive = true;
  const pairResults = questionResults.slice(-2);
  const correctCount = pairResults.filter(Boolean).length;
  const tier = correctStreak >= CELEBRATION_CONFIG.streakLength
    ? CELEBRATION_CONFIG.perfect
    : correctCount === 2
      ? CELEBRATION_CONFIG.perfect
      : correctCount === 1
        ? CELEBRATION_CONFIG.oneCorrect
        : CELEBRATION_CONFIG.noneCorrect;
  const message = correctStreak >= CELEBRATION_CONFIG.streakLength
    ? CELEBRATION_CONFIG.streakMessage.replace('{count}', correctStreak)
    : randomChoice(tier.messages);
  const overlay = $('#celebration-overlay');
  overlay.className = `celebration-overlay celebration-${tier.tier}`;
  overlay.innerHTML = `<span class="celebration-sparkles" aria-hidden="true">✦　✧　✦</span><span class="celebration-icon" aria-hidden="true">${tier.icon}</span><strong>${message}</strong><span class="celebration-subtitle">${activeBoss ? bossState.answered : activeQuestionIndex + 1} questions complete</span>`;
  overlay.hidden = false;
  playSound(tier.tier === 'perfect' ? 'pass' : 'neutral');
  celebrationTimer = setTimeout(continueAfterCelebration, CELEBRATION_CONFIG.durationMs);
}

function continueAfterCelebration() {
  if (!celebrationActive) return;
  if (bossTimeExpired()) return;
  clearTimeout(celebrationTimer);
  celebrationActive = false;
  $('#celebration-overlay').hidden = true;
  if (activeBoss) {
    continueBossFight();
    return;
  }
  activeQuestionIndex += 1;
  renderQuestion();
}

function finishAttempt() {
  const lesson = lessons[activeLessonIndex];
  const passedBefore = state.passed.includes(activeLessonIndex);
  const didPass = answerScore >= 7;
  const previousUnlocked = lessons.map((_, index) => unlocked(index));
  state.xp += answerScore;
  state.attempts.push({ at: Date.now(), points: answerScore, lesson: activeLessonIndex + 1 });
  if (didPass && !passedBefore) state.passed.push(activeLessonIndex);
  syncPlayerScore();
  persist();
  if (state.identity) publishPlayerScore().catch(() => { state.sharedError = 'Your latest score could not be synced.'; });
  updateStats();
  renderLessons();
  const unlockedIndex = lessons.findIndex((_, index) => !previousUnlocked[index] && unlocked(index));
  if (unlockedIndex >= 0) {
    state.newUnlock = unlockedIndex;
    renderLessons();
    setTimeout(() => { state.newUnlock = null; }, 1200);
  }
  if (answerScore > 0) playSound('points');
  if (unlockedIndex >= 0) toast(`Level ${activeLessonIndex + 1} passed! Level ${unlockedIndex + 1} unlocked.`);
  else if (didPass && !passedBefore) toast(`Level ${activeLessonIndex + 1} passed! +${answerScore} points earned.`);
  else toast(`+${answerScore} point${answerScore === 1 ? '' : 's'} added to your total.`);
  renderResult(didPass, passedBefore);
}

function renderResult(didPass, passedBefore) {
  const lesson = lessons[activeLessonIndex];
  const title = didPass ? 'Congratulations, you passed!' : 'Good try!';
  const message = didPass ? `You passed ${lesson.title} with ${answerScore} out of 10.` : `You earned ${answerScore} out of 10. You need 7 to pass. Your next try can be stronger.`;
  const action = didPass ? '<button class="primary-button" type="button" data-show-proof>View completion proof <span>→</span></button>' : '<button class="primary-button" type="button" data-retry-lesson>Retry level <span>↻</span></button>';
  $('#lesson-flow-content').innerHTML = `<div class="result-burst ${didPass ? 'pass-burst' : 'retry-burst'}">${didPass ? '✦' : '↻'}</div><p class="eyebrow">LEVEL ${activeLessonIndex + 1} ${passedBefore ? 'REPLAY' : 'RESULT'}</p><h1 id="flow-title">${title}</h1><p class="flow-lead">${message}</p><div class="score-summary"><div><strong>${answerScore}<span>/10</span></strong><small>points this attempt</small></div><div><strong>${state.xp.toLocaleString()}</strong><small>total points</small></div></div><div class="flow-footer"><button class="text-button" type="button" data-back-lessons>Back to levels</button>${action}</div>`;
  $('[data-show-proof]')?.addEventListener('click', renderProof);
  $('[data-retry-lesson]')?.addEventListener('click', () => openLesson(activeLessonIndex));
  $('[data-back-lessons]').addEventListener('click', () => { closeLesson(); setView('lessons'); });
  playResultSound(didPass);
}

function renderProof() {
  const lesson = lessons[activeLessonIndex];
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 760;
  canvas.className = 'proof-canvas';
  canvas.setAttribute('role', 'img');
  const stamp = new Date();
  proofCode = `RT-${stamp.getTime().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  canvas.setAttribute('aria-label', `You've completed Level ${activeLessonIndex + 1}! ${lesson.title}. Score ${answerScore} out of 10. Total points ${state.xp}. Verification ${proofCode}.`);
  const context = canvas.getContext('2d');
  context.fillStyle = '#f7f9fc';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#173b75';
  context.lineWidth = 16;
  context.strokeRect(26, 26, 1148, 708);
  context.fillStyle = '#173b75';
  context.fillRect(42, 42, 1116, 150);
  context.fillStyle = '#f2b632';
  context.font = '700 28px Arial';
  context.fillText('RENE-TECH  /  COMPUTER SYSTEM SERVICING', 84, 105);
  context.fillStyle = '#ffffff';
  context.font = '700 48px Arial';
  context.fillText('CERTIFICATE OF COMPLETION', 84, 162);
  context.fillStyle = '#2459a6';
  context.font = '700 27px Arial';
  context.fillText(`LEVEL ${activeLessonIndex + 1} · ${lesson.title.toLocaleUpperCase()}`, 84, 275);
  context.fillStyle = '#202b3a';
  context.font = '700 46px Arial';
  context.fillText(`You've completed Level ${activeLessonIndex + 1}!`, 84, 365);
  context.font = '32px Arial';
  context.fillText(`Score: ${answerScore} / 10     Total points: ${state.xp.toLocaleString()}`, 84, 445);
  context.font = '24px Arial';
  context.fillText(`Completed: ${stamp.toLocaleString()}`, 84, 515);
  context.fillStyle = '#173b75';
  context.font = '700 25px monospace';
  context.fillText(`Verification ID: ${proofCode}`, 84, 610);
  context.fillStyle = '#657286';
  context.font = '20px Arial';
  context.fillText('This image records a completed level attempt.', 84, 670);
  $('#lesson-flow-content').innerHTML = `<p class="eyebrow">PROOF OF COMPLETION</p><h1 id="flow-title">Your level proof</h1><p class="flow-lead">Save this image to share your completed level.</p><div class="proof-image-wrap"></div><div class="flow-footer"><button class="text-button" type="button" data-back-result>Back</button><div class="proof-actions"><button class="secondary-button" type="button" data-download-proof aria-label="Download proof image">↓ Download PNG</button><button class="primary-button" type="button" data-back-lessons>Done <span>→</span></button></div></div>`;
  $('.proof-image-wrap').append(canvas);
  $('[data-download-proof]').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `renetech-level-${activeLessonIndex + 1}-${proofCode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
  $('[data-back-result]').addEventListener('click', () => renderResult(true, activeAttemptWasReplay));
  $('[data-back-lessons]').addEventListener('click', () => { closeLesson(); setView('lessons'); });
}

function renderLeaderboard() {
  const container = $('#leaderboard-content');
  container.replaceChildren();
  if (!state.identity) {
    container.innerHTML = '<form class="identity-form" id="identity-form"><span class="leaderboard-icon">✦</span><h2>Choose your leaderboard name</h2><p>Enter your last name to appear in the rankings.</p><label for="leaderboard-name">Last name</label><div class="identity-controls"><input id="leaderboard-name" name="lastName" maxlength="24" autocomplete="family-name" required><button class="primary-button" type="submit">Join leaderboard <span>→</span></button></div></form><p class="local-note">Your points sync to the shared leaderboard when you join.</p>';
    $('#identity-form').addEventListener('submit', event => {
      event.preventDefault();
      const name = $('#leaderboard-name').value.trim().replace(/\s+/g, ' ');
      if (!name) return;
      state.identity = name.slice(0, 24);
      syncPlayerScore();
      persist();
      loadSharedLeaderboard();
    });
    return;
  }
  const heading = document.createElement('div');
  heading.className = 'leaderboard-heading';
  heading.innerHTML = '<span>POS.</span><span>PLAYER · LEVEL · RANK</span><span>TOTAL POINTS</span>';
  container.append(heading);
  const entries = (state.sharedEntries || Object.values(state.players))
    .sort((first, second) => second.points - first.points || first.name.localeCompare(second.name));
  entries.forEach((entry, index) => {
    const row = document.createElement('div');
    row.className = `leaderboard-row${entry.player_id === state.playerId ? ' current-player' : ''}`;
    row.style.setProperty('--row-index', Math.min(index, 8));
    const rank = document.createElement('strong'); rank.textContent = String(index + 1).padStart(2, '0');
    const player = document.createElement('span');
    player.className = 'leaderboard-player';
    const name = document.createElement('strong');
    name.className = 'leaderboard-name';
    name.textContent = entry.name;
    const badges = document.createElement('span');
    badges.className = 'leaderboard-badges';
    badges.innerHTML = `<span class="leaderboard-badge level-badge-small">Level ${levelForPoints(Number(entry.points))}</span><span class="leaderboard-badge rank-badge-small">${rankForPoints(Number(entry.points)).name}</span>`;
    player.append(name, badges);
    const points = document.createElement('strong'); points.textContent = `${Number(entry.points).toLocaleString()} pts`;
    row.append(rank, player, points);
    container.append(row);
  });
  const note = document.createElement('p');
  note.className = 'local-note';
  note.textContent = state.sharedLoading
    ? 'Loading the shared leaderboard…'
    : state.sharedEntries && state.sharedError
      ? `${state.sharedError} Showing current shared scores.`
    : state.sharedEntries
      ? `Signed in as ${state.identity}. Showing shared scores.`
      : state.sharedError
        ? `${state.sharedError} Showing scores saved on this device.`
        : `Signed in as ${state.identity}. Shared scores will load when refreshed.`;
  container.append(note);
}

function setView(view) {
  if (activeBoss && !$('#lesson-flow').hidden) closeLesson();
  document.body.classList.add('app-entered');
  $('.sidebar').classList.remove('open');
  $$('.view').forEach(section => section.classList.toggle('active', section.dataset.page === view));
  $$('.nav-item').forEach(link => link.classList.toggle('active', link.dataset.view === view));
  $('#page-title').textContent = ({ home: 'Your learning garden', lessons: 'Play', progress: 'Your progress', leaderboard: 'Leaderboard' })[view] || 'Your learning garden';
  if (view === 'leaderboard') {
    renderLeaderboard();
    if (state.identity && !state.sharedLoading) loadSharedLeaderboard();
  }
  if (window.location.hash !== `#${view}`) window.location.hash = view;
}

function updateSoundButton() {
  const button = $('#sound-toggle');
  button.textContent = state.muted ? 'Sound off' : 'Sound on';
  button.setAttribute('aria-pressed', String(state.muted));
  button.setAttribute('aria-label', state.muted ? 'Turn sound on' : 'Mute sound');
}

$$('[data-view]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); setView(link.dataset.view); }));
$$('[data-filter]').forEach(tab => tab.addEventListener('click', () => {
  state.filter = tab.dataset.filter;
  $$('.lesson-tab').forEach(item => item.classList.toggle('active', item === tab));
  renderLessons();
}));
$$('[data-start-lesson], #next-level-start').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.bossLaunch !== undefined) openBossDifficulty();
  else if (button.dataset.startLesson !== undefined && button.dataset.startLesson !== '') openLesson(Number(button.dataset.startLesson));
  else setView('lessons');
}));
$$('[data-enter-app]').forEach(button => button.addEventListener('click', () => setView('home')));
$('.mobile-menu').addEventListener('click', () => $('.sidebar').classList.toggle('open'));
$('#flow-close').addEventListener('click', closeLesson);
$('#lesson-flow').addEventListener('click', event => { if (event.target === $('#lesson-flow')) closeLesson(); });
$('#celebration-overlay').addEventListener('click', continueAfterCelebration);
$('#leaderboard-refresh').addEventListener('click', async () => {
  const button = $('#leaderboard-refresh');
  button.disabled = true;
  await loadSharedLeaderboard();
  button.disabled = false;
  toast(state.sharedEntries ? 'Shared leaderboard refreshed.' : 'Showing scores saved on this device.');
});
$('#sound-toggle').addEventListener('click', () => { state.muted = !state.muted; persist(); updateSoundButton(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('#lesson-flow').hidden) closeLesson(); });
window.addEventListener('hashchange', () => {
  const view = window.location.hash.slice(1);
  if (['home', 'lessons', 'progress', 'leaderboard'].includes(view)) setView(view);
});

function setLayout(layout, persistLayout = true) {
  document.body.classList.toggle('desktop-view', layout === 'desktop');
  document.body.classList.toggle('mobile-view', layout === 'mobile');
  $$('[data-layout]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.layout === layout)));
  if (persistLayout) localStorage.setItem('renetech-layout', layout);
}

$$('[data-layout]').forEach(button => button.addEventListener('click', () => setLayout(button.dataset.layout)));
setLayout(localStorage.getItem('renetech-layout') || 'automatic', false);
updateSoundButton();
updateStats();
renderLessons();
updateDate();
setInterval(updateDate, 60_000);
const initialView = window.location.hash.slice(1);
if (['home', 'lessons', 'progress', 'leaderboard'].includes(initialView)) setView(initialView);