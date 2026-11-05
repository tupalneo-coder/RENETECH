const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const STORAGE_KEY = 'benchmark-learning-v1';
const LEGACY_STORAGE_KEY = 'renetech-learning-v1';
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
const TIMED_CHALLENGE_SECONDS = 60;
const RANK_THRESHOLDS = [
  { name: 'New', points: 10 },
  { name: 'Intermediate', points: 50 },
  { name: 'Dedicated', points: 100 },
  { name: 'Addicted', points: 500 },
  { name: 'Goat', points: 1000 }
];
const randomChoice = values => values[Math.floor(Math.random() * values.length)];
const supabaseConfig = window.BENCHMARK_SUPABASE_CONFIG || {};
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
lessons.forEach((lesson, lessonIndex) => {
  lesson.questions.forEach((question, questionIndex) => {
    question.id = `l${lessonIndex}q${questionIndex}`;
  });
});
const QUESTION_POOL = lessons.flatMap(lesson => lesson.questions);

function levelForPoints(points) {
  return Math.floor(Math.max(0, points) / 10) + 1;
}

function rankForPoints(points) {
  return [...RANK_THRESHOLDS].reverse().find(rank => points >= rank.points) || { name: 'Unranked', points: 0 };
}

function loadSavedState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || '{}'); }
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

const saved = loadSavedState();
const legacyBossPoints = Array.isArray(saved.attempts)
  ? saved.attempts.filter(attempt => attempt.boss).reduce((sum, attempt) => sum + (Number(attempt.points) || 0), 0)
  : 0;
const state = {
  xp: Number.isFinite(saved.xp) ? Math.max(0, saved.xp - legacyBossPoints) : 0,
  passed: Array.isArray(saved.passed) ? saved.passed.filter(index => Number.isInteger(index) && index >= 0 && index < lessons.length) : [],
  identity: '',
  displayName: typeof saved.displayName === 'string' ? saved.displayName : '',
  playerId: '',
  userId: '',
  profile: null,
  leaderboardPlacement: null,
  cosmeticOptions: null,
  equippedCosmetics: { nameColor: '#202b3a', font: 'Arial, Helvetica, sans-serif', background: '#ffffff', glow: false },
  attempts: Array.isArray(saved.attempts) ? saved.attempts.filter(attempt => !attempt.boss) : [],
  sharedEntries: null,
  sharedLoading: false,
  sharedError: '',
  filter: 'all',
  settings: {
    masterVolume: 70,
    effectsEnabled: saved.muted !== true,
    musicEnabled: false,
    darkMode: false
  }
};
const backgroundMusic = $('#background-music');
let musicUnlocked = false;
let musicPlaybackErrorShown = false;
let resultEffectActive = false;
let resultEffectCleanup = null;
let savedSettings = null;
try {
  savedSettings = JSON.parse(localStorage.getItem('benchmark-settings-guest') || '{}');
} catch {
  toast('Saved settings could not be read. Default settings are active.');
}
if (savedSettings && typeof savedSettings === 'object') {
  state.settings = { ...state.settings, ...savedSettings };
}
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
let activeAttemptWasReplay = false;
let closeLessonTimer = null;
let activeGameMode = 'lesson';
let trainingMode = false;
let timedSessionId = null;
let timedDeadline = null;
let timedTimer = null;
let submittedAnswers = [];
let currentEffect = null;
let settingsSyncTimer = null;
let timedAdvanceTimer = null;

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      xp: state.xp,
      passed: state.passed,
      identity: state.identity,
      displayName: state.displayName,
      playerId: state.playerId,
      attempts: state.attempts,
      settings: state.settings,
      avatarId: state.profile?.avatar_id || saved.avatarId || 'badge-1'
    }));
  }
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
    const action = isUnlocked ? `<button class="row-button" type="button" data-lesson-index="${index}">${passed ? 'Open' : 'Start'} <span>→</span></button>` : '<span class="lock-mark" aria-label="Locked">&#128274;</span>';
    return `<article class="lesson-row${isUnlocked ? '' : ' locked'}${state.newUnlock === index ? ' just-unlocked' : ''}"><div class="lesson-thumb lesson-symbol lesson-symbol-${index}">${lesson.icon}</div><div><span class="eyebrow">LEVEL ${index + 1} · ${lesson.category}</span><h3>${lesson.title}</h3><p>${lesson.description} &nbsp; 10 questions</p></div><div class="row-action"><div class="row-status ${passed ? 'completed' : ''}">${status}</div>${action}</div></article>`;
  }).join('');
  $('#lesson-list').innerHTML = levelRows;
  $$('.row-button', $('#lesson-list')).forEach(button => button.addEventListener('click', () => openLesson(Number(button.dataset.lessonIndex))));
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
  if (nextIndex < 0) {
    $('#next-lesson-title').textContent = 'All levels complete';
    $('#next-lesson-description').textContent = 'You have passed every level. Replay any level or try a timed challenge.';
    $('#next-lesson-number').textContent = `${lessons.length} of ${lessons.length} levels passed`;
    $('#next-level-question-count').textContent = 'Timed challenge available';
    button.removeAttribute('data-start-lesson');
    button.innerHTML = 'Replay a level <span>→</span>';
    return;
  }
  const index = nextIndex;
  const lesson = lessons[index];
  $('#next-lesson-title').textContent = lesson.title;
  $('#next-lesson-description').textContent = lesson.description;
  $('#next-lesson-number').textContent = `Level ${index + 1} of ${lessons.length}`;
  $('#next-level-question-count').textContent = '10 questions';
  button.dataset.startLesson = index;
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
  renderPlayerProfile();
}

function renderAvatar(element, avatarId) {
  if (!element) return;
  const validAvatar = /^badge-[1-6]$|^flat-[1-6]$/.test(avatarId || '') ? avatarId : 'badge-1';
  element.dataset.avatar = validAvatar;
  element.setAttribute('aria-label', `${validAvatar.replace('-', ' ')} avatar`);
}

function renderPlayerProfile() {
  const profile = state.profile;
  const rank = rankForPoints(state.xp);
  const displayName = profile?.display_name || state.identity || state.displayName || 'Guest';
  const equipped = profile?.equipped_cosmetics || state.equippedCosmetics;
  renderAvatar($('#header-avatar'), profile?.avatar_id || saved.avatarId || 'badge-1');
  renderAvatar($('#progress-avatar'), profile?.avatar_id || saved.avatarId || 'badge-1');
  $('#profile-heading').textContent = displayName;
  $('#profile-rank').textContent = `${rank.name} · ${state.xp.toLocaleString()} points`;
  $('#profile-placement').textContent = state.leaderboardPlacement
    ? `Leaderboard placement: #${state.leaderboardPlacement}`
    : 'Leaderboard placement: not ranked';
  $('#profile-cosmetic-summary').textContent = `Leaderboard color: ${equipped.nameColor || '#202b3a'}`;
  state.equippedCosmetics = equipped;
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
  try {
    const { data, error } = await supabaseClient
      .from('benchmark_leaderboard')
      .select('user_id, display_name, username, avatar_id, equipped_cosmetics, points, placement')
      .order('placement', { ascending: true })
      .limit(100);
    if (error) throw error;
    state.sharedEntries = data.map(entry => ({
      player_id: entry.user_id,
      name: entry.display_name || entry.username,
      points: Number(entry.points),
      avatar_id: entry.avatar_id,
      equipped_cosmetics: entry.equipped_cosmetics || {}
    }));
    const ownEntry = data.find(entry => entry.user_id === state.userId);
    if (ownEntry) state.leaderboardPlacement = Number(ownEntry.placement);
    else if (state.userId) {
      const { data: ownPlacement, error: placementError } = await supabaseClient
        .from('benchmark_leaderboard')
        .select('placement')
        .eq('user_id', state.userId)
        .maybeSingle();
      if (placementError) throw placementError;
      state.leaderboardPlacement = ownPlacement ? Number(ownPlacement.placement) : null;
    } else state.leaderboardPlacement = null;
  } catch (error) {
    state.sharedEntries = null;
    state.leaderboardPlacement = null;
    state.sharedError = `Could not load the shared leaderboard: ${error.message}`;
  }
  state.sharedLoading = false;
  renderLeaderboard();
  renderPlayerProfile();
}

function playSound(kind) {
  if (!state.settings.effectsEnabled || state.settings.masterVolume <= 0) return;
  const soundIds = { correct: 'sound-correct', wrong: 'sound-incorrect', applaud: 'sound-applaud', aww: 'sound-aww' };
  const audio = document.getElementById(soundIds[kind]);
  if (!audio) return;
  if (currentEffect && currentEffect !== audio) currentEffect.pause();
  resultEffectCleanup?.();
  audio.pause();
  audio.currentTime = 0;
  audio.volume = state.settings.masterVolume / 100;
  currentEffect = audio;
  let cleanupResultEffect = null;
  if (kind === 'applaud' || kind === 'aww') {
    resultEffectActive = true;
    backgroundMusic.pause();
    const resumeMusic = () => {
      audio.removeEventListener('ended', resumeMusic);
      audio.removeEventListener('error', resumeMusic);
      if (currentEffect === audio) currentEffect = null;
      if (resultEffectCleanup === resumeMusic) resultEffectCleanup = null;
      resultEffectActive = false;
      syncBackgroundMusic();
    };
    cleanupResultEffect = resumeMusic;
    resultEffectCleanup = resumeMusic;
    audio.addEventListener('ended', resumeMusic, { once: true });
    audio.addEventListener('error', resumeMusic, { once: true });
  }
  audio.play().catch(() => {
    cleanupResultEffect?.();
    toast('This browser blocked audio playback. Check the browser sound settings.');
  });
}

function playResultSound(didWin) {
  playSound(didWin ? 'applaud' : 'aww');
}

function syncBackgroundMusic() {
  backgroundMusic.volume = Math.min(1, Math.max(0, state.settings.masterVolume / 100 * 0.4));
  if (!state.settings.musicEnabled || !musicUnlocked || document.hidden || resultEffectActive || backgroundMusic.volume === 0) {
    backgroundMusic.pause();
    return;
  }
  if (backgroundMusic.paused) {
    backgroundMusic.play().then(() => {
      musicPlaybackErrorShown = false;
    }).catch(() => {
      if (!musicPlaybackErrorShown) {
        musicPlaybackErrorShown = true;
        toast('Background music could not be played. Check the browser sound settings.');
      }
    });
  }
}

function unlockBackgroundMusic() {
  musicUnlocked = true;
  syncBackgroundMusic();
}

function openLesson(index) {
  if (!unlocked(index)) return;
  stopTimedTimer();
  clearTimeout(closeLessonTimer);
  clearTimeout(celebrationTimer);
  clearTimeout(matchingResetTimer);
  celebrationActive = false;
  $('#celebration-overlay').hidden = true;
  $('#lesson-flow').classList.remove('is-closing');
  activeLessonIndex = index;
  activeAttemptWasReplay = state.passed.includes(index);
  activeGameMode = 'lesson';
  trainingMode = false;
  activeQuestionIndex = 0;
  activeQuestions = [];
  selectedAnswer = null;
  selectedFillWord = null;
  matchingState = null;
  answerLocked = false;
  questionResults = [];
  correctStreak = 0;
  answerScore = 0;
  submittedAnswers = [];
  $('#lesson-flow').hidden = false;
  renderModePicker();
  $('#flow-close').focus();
}

function closeLesson() {
  const dialog = $('#lesson-flow');
  if ((celebrationActive && activeGameMode === 'lesson') || dialog.hidden || dialog.classList.contains('is-closing')) return;
  stopTimedTimer();
  clearTimeout(celebrationTimer);
  celebrationActive = false;
  $('#celebration-overlay').hidden = true;
  clearTimeout(matchingResetTimer);
  dialog.classList.add('is-closing');
  closeLessonTimer = setTimeout(() => {
    dialog.hidden = true;
    dialog.classList.remove('is-closing');
    activeLessonIndex = null;
  }, 190);
}

function renderModePicker() {
  const lesson = lessons[activeLessonIndex];
  $('#lesson-flow-content').innerHTML = `<p class="eyebrow">LEVEL ${activeLessonIndex + 1} · ${lesson.category}</p><div class="flow-lesson-icon">${lesson.icon}</div><h1 id="flow-title">${lesson.title}</h1><p class="flow-lead">${lesson.description}</p><div class="mode-picker"><button class="mode-card" type="button" data-training-mode><strong>Train</strong><span>Review every question with the answers and explanations from this lesson.</span><small>No points are awarded.</small></button><button class="mode-card" type="button" data-play-mode><strong>Play</strong><span>Take the level quiz and earn points for correct answers.</span><small>Pass with 7 out of 10 correct.</small></button></div><div class="flow-footer"><span>Choose how you want to learn.</span><button class="text-button" type="button" data-back-lessons>Back to levels</button></div>`;
  $('[data-training-mode]').addEventListener('click', () => {
    trainingMode = true;
    renderTraining();
  });
  $('[data-play-mode]').addEventListener('click', () => {
    trainingMode = false;
    renderSummary();
  });
  $('[data-back-lessons]').addEventListener('click', () => { closeLesson(); setView('lessons'); });
}

function renderTraining() {
  const lesson = lessons[activeLessonIndex];
  const cards = lesson.questions.map((question, index) => {
    const answer = question.type === 'matching'
      ? `<ul class="training-matches">${question.pairs.map(pair => `<li><strong>${pair.left}</strong><span>${pair.right}</span></li>`).join('')}</ul>`
      : `<p class="training-answer"><strong>Answer:</strong> ${question.answer}</p>`;
    const explanation = question.explanation || (question.type === 'matching'
      ? 'The matching pairs above are the lesson information provided for this question.'
      : '');
    return `<article class="training-question"><p class="eyebrow">QUESTION ${index + 1}</p><h2>${question.prompt.replace(/\*__\*/g, '_____')}</h2>${answer}${explanation ? `<p class="training-explanation"><strong>Explanation:</strong> ${explanation}</p>` : '<p class="training-missing">No explanation is provided for this question yet.</p>'}</article>`;
  }).join('');
  $('#lesson-flow-content').innerHTML = `<p class="eyebrow">TRAINING · LEVEL ${activeLessonIndex + 1}</p><h1 id="flow-title">${lesson.title}</h1><p class="flow-lead">${lesson.description} Review the existing question answers and lesson information below. Training does not award points.</p><div class="training-list">${cards}</div><div class="flow-footer"><button class="text-button" type="button" data-back-mode>Back</button><button class="primary-button" type="button" data-start-play>Start Play <span>→</span></button></div>`;
  $('[data-back-mode]').addEventListener('click', renderModePicker);
  $('[data-start-play]').addEventListener('click', () => {
    trainingMode = false;
    renderSummary();
  });
}

async function startTimedChallenge() {
  if (!state.userId || !supabaseClient) {
    toast('Sign in before starting a timed challenge so verified points can be saved.');
    setView('settings');
    return;
  }
  try {
    const { data, error } = await supabaseClient.functions.invoke('benchmark-game', {
      body: { action: 'start_timed' }
    });
    if (error) throw error;
    timedSessionId = data.session_id;
    timedDeadline = new Date(data.started_at).getTime() + TIMED_CHALLENGE_SECONDS * 1000;
    activeGameMode = 'timed';
    activeLessonIndex = null;
    activeQuestions = shuffleItems(prepareQuestions({ questions: QUESTION_POOL }));
    activeQuestionIndex = 0;
    selectedAnswer = null;
    selectedFillWord = null;
    matchingState = null;
    answerLocked = false;
    answerScore = 0;
    submittedAnswers = [];
    questionResults = [];
    correctStreak = 0;
    $('#lesson-flow').classList.remove('is-closing');
    $('#lesson-flow').hidden = false;
    renderQuestion();
    startTimedTimer();
  } catch (error) {
    toast(`Timed Challenge could not start: ${error.message}`);
  }
}

function startTimedTimer() {
  stopTimedTimer();
  const update = () => {
    if (timedDeadline === null) return;
    const remaining = Math.max(0, Math.ceil((timedDeadline - Date.now()) / 1000));
    const timer = $('#timed-countdown');
    if (timer) {
      timer.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
      timer.classList.toggle('is-urgent', remaining <= 10);
    }
    if (remaining === 0) void finishTimedChallenge();
  };
  update();
  timedTimer = setInterval(update, 100);
}

function stopTimedTimer() {
  if (timedTimer !== null) clearInterval(timedTimer);
  timedTimer = null;
}

async function finishTimedChallenge() {
  if (activeGameMode !== 'timed' || !timedSessionId || answerLocked) return;
  answerLocked = true;
  stopTimedTimer();
  let result = null;
  let submissionError = '';
  try {
    const { data, error } = await supabaseClient.functions.invoke('benchmark-game', {
      body: { action: 'submit_timed', session_id: timedSessionId, answers: submittedAnswers }
    });
    if (error) throw error;
    result = data;
    state.xp = Number(data.total_points);
    state.attempts.push({ at: Date.now(), points: Number(data.points_awarded), timed: true });
    state.leaderboardPlacement = null;
    persist();
    updateStats();
    await loadSharedLeaderboard();
  } catch (error) {
    submissionError = error.message;
  }
  const answered = Number(result?.answered_questions ?? submittedAnswers.length);
  const correct = Number(result?.correct_answers ?? 0);
  const bonus = Number(result?.bonus_points ?? 0);
  const pointsEarned = Number(result?.points_awarded ?? 0);
  $('#lesson-flow-content').innerHTML = `<div class="result-burst ${result ? 'pass-burst' : 'retry-burst'}">${result ? '✦' : '!'}</div><p class="eyebrow">TIMED CHALLENGE RESULTS</p><h1 id="flow-title">${result ? 'Time’s up!' : 'Score not verified'}</h1><p class="flow-lead">${result ? 'Your answer list was checked on the server.' : `Your score was not saved: ${submissionError}`}</p><div class="score-summary"><div><strong>${answered}</strong><small>questions answered</small></div><div><strong>${correct}</strong><small>correct answers</small></div><div><strong>+${bonus}</strong><small>bonus points earned</small></div><div><strong>${pointsEarned}</strong><small>points awarded</small></div></div><div class="flow-footer"><button class="text-button" type="button" data-back-lessons>Back to Play</button><button class="primary-button" type="button" data-close-results>Done <span>→</span></button></div>`;
  $('[data-back-lessons]').addEventListener('click', () => { closeLesson(); setView('lessons'); });
  $('[data-close-results]').addEventListener('click', closeLesson);
  if (result) playResultSound(correct > 0);
}

function renderSummary() {
  const lesson = lessons[activeLessonIndex];
  $('#lesson-flow-content').innerHTML = `<p class="eyebrow">PLAY · LEVEL ${activeLessonIndex + 1} · ${lesson.category}</p><div class="flow-lesson-icon">${lesson.icon}</div><h1 id="flow-title">${lesson.title}</h1><p class="flow-lead">${lesson.description}</p><ul class="summary-points">${lesson.summary.map(point => `<li>${point}</li>`).join('')}</ul><div class="flow-footer"><span>10 questions · Pass with 7 correct</span><button class="primary-button" type="button" data-begin-quiz>Begin Level <span>→</span></button></div>`;
  $('[data-begin-quiz]').addEventListener('click', () => {
    activeQuestions = prepareQuestions(lesson);
    activeGameMode = 'lesson';
    questionResults = [];
    correctStreak = 0;
    answerScore = 0;
    activeQuestionIndex = 0;
    submittedAnswers = [];
    renderQuestion();
  });
}

function renderQuestion() {
  clearTimeout(timedAdvanceTimer);
  selectedAnswer = null;
  selectedFillWord = null;
  matchingState = null;
  answerLocked = false;
  const question = activeQuestions[activeQuestionIndex];
  const progress = ((activeQuestionIndex + 1) / activeQuestions.length) * 100;
  const timed = activeGameMode === 'timed';
  const lesson = timed ? null : lessons[activeLessonIndex];
  const header = timed
    ? `<p class="eyebrow">TIMED CHALLENGE</p><div class="quiz-heading"><h1 id="flow-title">Answer as many as you can</h1><strong class="timed-countdown" id="timed-countdown" role="timer" aria-label="Time remaining">1:00</strong></div><p class="timed-progress">${submittedAnswers.length} answered · ${answerScore} correct</p>`
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
  const nextLabel = activeQuestionIndex === activeQuestions.length - 1 && activeGameMode === 'lesson' ? 'See results' : 'Next question';
  return `<h2 class="question-prompt">${question.prompt}</h2><div class="answer-list" role="group" aria-label="Answer choices">${question.options.map((option, index) => `<button class="answer-choice" type="button" data-answer-index="${index}"><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join('')}</div><div class="answer-feedback" id="answer-feedback" aria-live="polite"></div><div class="flow-footer quiz-footer"><span>${answerScore} correct so far</span><button class="primary-button" type="button" data-next-question disabled>${nextLabel} <span>→</span></button></div>`;
}

function renderFillBlankQuestion(question) {
  const prompt = question.prompt.replace('*__*', '<button class="blank-slot" type="button" data-blank-slot aria-label="Remove selected word">Choose a word</button>');
  return `<h2 class="question-prompt fill-prompt">${prompt}</h2><div class="fill-choices" role="group" aria-label="Word choices">${question.choices.map((word, index) => `<button class="fill-word-choice" type="button" data-fill-choice="${index}">${word}</button>`).join('')}</div><div class="answer-feedback" id="answer-feedback" aria-live="polite"></div><div class="flow-footer quiz-footer"><span>${answerScore} correct so far</span><button class="primary-button" type="button" data-check-fill disabled>Check</button></div>`;
}

function renderMatchingQuestion(question) {
  const leftItems = shuffleItems(question.pairs.map((pair, index) => ({ value: pair.left, index })));
  const rightItems = shuffleItems(question.pairs.map((pair, index) => ({ value: pair.right, index })));
  matchingState = { selectedLeft: null, matched: new Set(), mistakes: 0, resolving: false, completed: false, history: [] };
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

function recordQuestionResult(isCorrect, answer) {
  questionResults.push(isCorrect);
  if (!trainingMode) {
    submittedAnswers.push({ question_id: activeQuestions[activeQuestionIndex].id, answer });
  }
  if (isCorrect) {
    answerScore += 1;
    correctStreak += 1;
  } else correctStreak = 0;
}

function chooseAnswer(optionIndex) {
  if (selectedAnswer !== null || answerLocked) return;
  if (activeGameMode === 'timed' && Date.now() >= timedDeadline) {
    void finishTimedChallenge();
    return;
  }
  const question = activeQuestions[activeQuestionIndex];
  selectedAnswer = question.options[optionIndex];
  const isCorrect = selectedAnswer.toLocaleLowerCase() === question.answer.toLocaleLowerCase();
  answerLocked = true;
  recordQuestionResult(isCorrect, selectedAnswer);
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
  if (activeGameMode === 'timed' && Date.now() >= timedDeadline) {
    void finishTimedChallenge();
    return;
  }
  answerLocked = true;
  const selectedWord = question.choices[selectedFillWord];
  const isCorrect = selectedWord.toLocaleLowerCase() === question.answer.toLocaleLowerCase();
  recordQuestionResult(isCorrect, selectedWord);
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
  if (activeGameMode === 'timed' && Date.now() >= timedDeadline) {
    void finishTimedChallenge();
    return;
  }
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
  matchingState.history.push([leftIndex, pairIndex]);
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
  recordQuestionResult(isCorrect, { matches: matchingState.history });
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
  $('[data-new-continue]').addEventListener('click', () => {
    clearTimeout(timedAdvanceTimer);
    advanceAfterAnswer();
  });
  if (activeGameMode === 'timed') {
    $('[data-new-continue]').textContent = 'Next question →';
    timedAdvanceTimer = setTimeout(advanceAfterAnswer, 180);
  }
}

function advanceAfterAnswer() {
  if (!answerLocked || celebrationActive) return;
  if (activeGameMode === 'timed') {
    if (Date.now() >= timedDeadline || activeQuestionIndex >= activeQuestions.length - 1) {
      void finishTimedChallenge();
      return;
    }
    activeQuestionIndex += 1;
    renderQuestion();
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
  overlay.innerHTML = `<span class="celebration-sparkles" aria-hidden="true">✦　✧　✦</span><span class="celebration-icon" aria-hidden="true">${tier.icon}</span><strong>${message}</strong><span class="celebration-subtitle">${activeQuestionIndex + 1} questions complete</span>`;
  overlay.hidden = false;
  celebrationTimer = setTimeout(continueAfterCelebration, CELEBRATION_CONFIG.durationMs);
}

function continueAfterCelebration() {
  if (!celebrationActive) return;
  clearTimeout(celebrationTimer);
  celebrationActive = false;
  $('#celebration-overlay').hidden = true;
  activeQuestionIndex += 1;
  renderQuestion();
}

async function finishAttempt() {
  const lesson = lessons[activeLessonIndex];
  const passedBefore = state.passed.includes(activeLessonIndex);
  const previousUnlocked = lessons.map((_, index) => unlocked(index));
  let submissionError = '';
  if (state.userId) {
    try {
      const { data, error } = await supabaseClient.functions.invoke('benchmark-game', {
        body: { action: 'submit_lesson', lesson_index: activeLessonIndex + 1, answers: submittedAnswers }
      });
      if (error) throw error;
      answerScore = Number(data.correct_answers);
      state.xp = Number(data.total_points);
      state.passed = (data.completed_levels || []).map(level => Number(level) - 1);
      state.attempts.push({ at: Date.now(), points: Number(data.points_awarded), lesson: activeLessonIndex + 1 });
      if (state.profile && data.unlocked_cosmetics) state.profile.unlocked_cosmetics = data.unlocked_cosmetics;
    } catch (error) {
      submissionError = error.message;
    }
  } else {
    state.xp += answerScore;
    if (answerScore >= 7 && !passedBefore) state.passed.push(activeLessonIndex);
    state.attempts.push({ at: Date.now(), points: answerScore, lesson: activeLessonIndex + 1 });
  }
  const didPass = !submissionError && answerScore >= 7;
  if (!submissionError) persist();
  updateStats();
  renderLessons();
  if (!submissionError && state.userId) await loadSharedLeaderboard();
  const unlockedIndex = didPass ? lessons.findIndex((_, index) => !previousUnlocked[index] && unlocked(index)) : -1;
  if (unlockedIndex >= 0) {
    state.newUnlock = unlockedIndex;
    renderLessons();
    setTimeout(() => { state.newUnlock = null; }, 1200);
  }
  if (submissionError) toast(`Your score could not be verified: ${submissionError}`);
  else if (unlockedIndex >= 0) toast(`Level ${activeLessonIndex + 1} passed! Level ${unlockedIndex + 1} unlocked.`);
  else if (didPass && !passedBefore) toast(`Level ${activeLessonIndex + 1} passed! +${answerScore} points earned.`);
  else toast(`+${answerScore} point${answerScore === 1 ? '' : 's'} added to your total.`);
  renderResult(didPass, passedBefore, submissionError);
}

function renderResult(didPass, passedBefore, submissionError = '') {
  const lesson = lessons[activeLessonIndex];
  const title = submissionError ? 'Attempt not saved' : didPass ? 'Congratulations, you passed!' : 'Good try!';
  const message = submissionError
    ? `Your answers were not verified or added to your points. ${submissionError}`
    : didPass
      ? `You passed ${lesson.title} with ${answerScore} out of 10.`
      : `You earned ${answerScore} out of 10. You need 7 to pass. Your next try can be stronger.`;
  const action = submissionError
    ? '<button class="primary-button" type="button" data-retry-lesson>Retry level <span>↻</span></button>'
    : didPass
      ? '<button class="primary-button" type="button" data-show-proof>View completion proof <span>→</span></button>'
      : '<button class="primary-button" type="button" data-retry-lesson>Retry level <span>↻</span></button>';
  $('#lesson-flow-content').innerHTML = `<div class="result-burst ${didPass ? 'pass-burst' : 'retry-burst'}">${didPass ? '✦' : '↻'}</div><p class="eyebrow">LEVEL ${activeLessonIndex + 1} ${passedBefore ? 'REPLAY' : 'RESULT'}</p><h1 id="flow-title">${title}</h1><p class="flow-lead">${message}</p><div class="score-summary"><div><strong>${answerScore}<span>/10</span></strong><small>${submissionError ? 'correct before verification failed' : 'points this attempt'}</small></div><div><strong>${state.xp.toLocaleString()}</strong><small>total points</small></div></div><div class="flow-footer"><button class="text-button" type="button" data-back-lessons>Back to levels</button>${action}</div>`;
  $('[data-show-proof]')?.addEventListener('click', renderProof);
  $('[data-retry-lesson]')?.addEventListener('click', () => openLesson(activeLessonIndex));
  $('[data-back-lessons]').addEventListener('click', () => { closeLesson(); setView('lessons'); });
  if (!submissionError) playResultSound(didPass);
}

function renderProof() {
  const lesson = lessons[activeLessonIndex];
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 760;
  canvas.className = 'proof-canvas';
  canvas.setAttribute('role', 'img');
  const stamp = new Date();
  proofCode = `BM-${stamp.getTime().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
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
  context.fillText('BENCHMARK  /  COMPUTER SYSTEM SERVICING', 84, 105);
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
    link.download = `benchmark-level-${activeLessonIndex + 1}-${proofCode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
  $('[data-back-result]').addEventListener('click', () => renderResult(true, activeAttemptWasReplay));
  $('[data-back-lessons]').addEventListener('click', () => { closeLesson(); setView('lessons'); });
}

function renderLeaderboard() {
  const container = $('#leaderboard-content');
  container.replaceChildren();
  const heading = document.createElement('div');
  heading.className = 'leaderboard-heading';
  heading.innerHTML = '<span>POS.</span><span>PLAYER · LEVEL · RANK</span><span>TOTAL POINTS</span>';
  container.append(heading);
  const entries = state.sharedEntries || [];
  entries.forEach((entry, index) => {
    const row = document.createElement('div');
    row.className = `leaderboard-row${entry.player_id === state.playerId ? ' current-player' : ''}`;
    row.style.setProperty('--row-index', Math.min(index, 8));
    const rank = document.createElement('strong'); rank.textContent = String(index + 1).padStart(2, '0');
    const player = document.createElement('span');
    player.className = 'leaderboard-player';
    const avatar = document.createElement('span');
    avatar.className = 'avatar avatar-sprite leaderboard-avatar';
    renderAvatar(avatar, entry.avatar_id);
    const name = document.createElement('strong');
    name.className = 'leaderboard-name';
    name.textContent = entry.name;
    const cosmetic = entry.equipped_cosmetics || {};
    name.style.color = cosmetic.nameColor || '#202b3a';
    name.style.fontFamily = cosmetic.font || 'Arial, Helvetica, sans-serif';
    if (cosmetic.glow) name.classList.add('leaderboard-glow');
    const badges = document.createElement('span');
    badges.className = 'leaderboard-badges';
    badges.innerHTML = `<span class="leaderboard-badge level-badge-small">Level ${levelForPoints(Number(entry.points))}</span><span class="leaderboard-badge rank-badge-small">${rankForPoints(Number(entry.points)).name}</span>`;
    player.style.backgroundColor = cosmetic.background || 'transparent';
    player.append(avatar, name, badges);
    const points = document.createElement('strong'); points.textContent = `${Number(entry.points).toLocaleString()} pts`;
    row.append(rank, player, points);
    container.append(row);
  });
  const note = document.createElement('p');
  note.className = 'local-note';
  note.textContent = state.sharedLoading
    ? 'Loading the shared leaderboard…'
    : state.sharedError
      ? state.sharedError
      : state.userId
        ? `Signed in as ${state.identity}. ${entries.length ? 'Showing shared scores.' : 'Complete a level or Timed Challenge to appear here.'}`
        : 'Leaderboard scores are public. Sign in to earn and save points.';
  container.append(note);
}

function setView(view) {
  if (activeGameMode === 'timed' && !$('#lesson-flow').hidden) closeLesson();
  document.body.classList.add('app-entered');
  $('.sidebar').classList.remove('open');
  $$('.view').forEach(section => section.classList.toggle('active', section.dataset.page === view));
  $$('.nav-item').forEach(link => link.classList.toggle('active', link.dataset.view === view));
  $('#page-title').textContent = ({ home: 'Your learning garden', lessons: 'Play', progress: 'Your progress', leaderboard: 'Leaderboard', settings: 'Settings' })[view] || 'Your learning garden';
  if (view === 'leaderboard') {
    renderLeaderboard();
    if (!state.sharedLoading) loadSharedLeaderboard();
  }
  if (window.location.hash !== `#${view}`) window.location.hash = view;
}

function storedSettingsKey(userId = state.userId) {
  return `benchmark-settings-${userId || 'guest'}`;
}

function applySettings() {
  document.body.classList.toggle('dark-mode', state.settings.darkMode);
  $('#master-volume').value = String(state.settings.masterVolume);
  $('#volume-value').textContent = `${state.settings.masterVolume}%`;
  $('#effects-enabled').checked = state.settings.effectsEnabled;
  $('#music-enabled').checked = state.settings.musicEnabled;
  $('#dark-mode').checked = state.settings.darkMode;
  syncBackgroundMusic();
}

function saveSettings() {
  try {
    localStorage.setItem(storedSettingsKey(), JSON.stringify(state.settings));
  } catch {
    toast('Settings could not be saved in this browser.');
  }
  if (!state.userId || !supabaseClient) return;
  const userId = state.userId;
  const settings = { ...state.settings };
  clearTimeout(settingsSyncTimer);
  settingsSyncTimer = setTimeout(async () => {
    const { error } = await supabaseClient.from('user_settings').upsert({
      user_id: userId,
      master_volume: settings.masterVolume,
      effects_enabled: settings.effectsEnabled,
      music_enabled: settings.musicEnabled,
      dark_mode: settings.darkMode,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) toast(`Settings were saved on this device but not in Supabase: ${error.message}`);
  }, 250);
}

async function loadUserSettings(userId) {
  let localSettings = {};
  try {
    localSettings = JSON.parse(localStorage.getItem(storedSettingsKey(userId)) || '{}');
  } catch {
    toast('Your saved settings could not be read from this browser.');
  }
  const { data, error } = await supabaseClient.from('user_settings')
    .select('master_volume, effects_enabled, music_enabled, dark_mode')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  state.settings = data
    ? {
      masterVolume: Number(data.master_volume),
      effectsEnabled: data.effects_enabled,
      musicEnabled: data.music_enabled,
      darkMode: data.dark_mode
    }
    : { ...state.settings, ...localSettings };
  applySettings();
  if (!data) saveSettings();
}

async function invokeGameAction(body) {
  if (!supabaseClient) throw new Error('Supabase is not configured for this site.');
  const { data, error } = await supabaseClient.functions.invoke('benchmark-game', { body });
  if (error) throw error;
  return data;
}

function renderAuthState() {
  const signedIn = Boolean(state.userId);
  $('#auth-status').textContent = signedIn
    ? `Signed in as ${state.identity}. Your profile and verified scores are saved to Supabase.`
    : 'Use a username and password to save your profile and verified scores.';
  $('#auth-form').hidden = signedIn;
  $('#sign-out').hidden = !signedIn;
  $('#cosmetics-status').textContent = signedIn
    ? 'Unlocked styles can be equipped and changed at any time.'
    : 'Sign in to unlock and save leaderboard styles.';
  renderCosmeticControls();
  renderPlayerProfile();
}

async function activateSession(user) {
  const profileData = await invokeGameAction({ action: 'sync_profile' });
  state.userId = user.id;
  state.playerId = user.id;
  state.identity = user.user_metadata?.username || profileData.profile.username;
  state.profile = profileData.profile;
  state.displayName = profileData.profile.display_name;
  state.xp = Number(profileData.points);
  state.passed = (profileData.completed_levels || []).map(level => Number(level) - 1);
  state.cosmeticOptions = profileData.cosmetic_options;
  state.equippedCosmetics = profileData.profile.equipped_cosmetics;
  await loadUserSettings(user.id);
  renderAuthState();
  updateStats();
  renderLessons();
  await loadSharedLeaderboard();
  persist();
}

function usernameToAuthIdentity(value) {
  const username = value.trim().toLowerCase();
  return { username, email: `${username}@benchmark.app` };
}

async function createAccount() {
  if (!supabaseClient) throw new Error('Supabase is not configured for this site.');
  const { username, email } = usernameToAuthIdentity($('#auth-username').value);
  const password = $('#auth-password').value;
  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    throw new Error('Username must be 3 to 24 letters, numbers, or underscores.');
  }
  if (password.length < 8) throw new Error('Password must be at least 8 characters.');
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { username } }
  });
  if (error) throw error;
  if (!data.session) {
    throw new Error('No sign-in session was created. Confirm that email confirmation is disabled in Supabase Auth settings.');
  }
  await activateSession(data.user);
  toast('Account created. Your settings and progress will now sync.');
}

async function signIn() {
  if (!supabaseClient) throw new Error('Supabase is not configured for this site.');
  const { username, email } = usernameToAuthIdentity($('#auth-username').value);
  const password = $('#auth-password').value;
  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    throw new Error('Enter a username containing 3 to 24 letters, numbers, or underscores.');
  }
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  await activateSession(data.user);
  toast(`Welcome back, ${state.identity}.`);
}

async function signOut() {
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
  state.userId = '';
  state.playerId = '';
  state.identity = '';
  state.displayName = '';
  state.profile = null;
  state.cosmeticOptions = null;
  state.sharedEntries = null;
  state.leaderboardPlacement = null;
  state.xp = 0;
  state.passed = [];
  state.attempts = [];
  let guestSettings = {};
  try {
    guestSettings = JSON.parse(localStorage.getItem('benchmark-settings-guest') || '{}');
  } catch {
    toast('Guest settings could not be restored. Default settings are active.');
  }
  state.settings = {
    masterVolume: 70,
    effectsEnabled: true,
    musicEnabled: false,
    darkMode: false,
    ...guestSettings
  };
  applySettings();
  renderAuthState();
  updateStats();
  renderLessons();
  renderLeaderboard();
  toast('You have signed out.');
}

function renderAvatarPicker() {
  const picker = $('#avatar-picker');
  const avatars = [...Array.from({ length: 6 }, (_, index) => `badge-${index + 1}`), ...Array.from({ length: 6 }, (_, index) => `flat-${index + 1}`)];
  picker.innerHTML = avatars.map(avatar => `<button class="avatar-choice" type="button" data-avatar-id="${avatar}"><span class="avatar avatar-sprite" data-avatar="${avatar}" role="img" aria-label="${avatar.replace('-', ' ')}"></span><span>${avatar.startsWith('badge') ? 'Badge' : 'Flat'} ${avatar.split('-')[1]}</span></button>`).join('');
  picker.hidden = !picker.hidden;
  $$('[data-avatar-id]', picker).forEach(button => button.addEventListener('click', () => {
    void updatePlayerProfile({ avatar_id: button.dataset.avatarId });
  }));
}

async function updatePlayerProfile(changes = {}) {
  const displayName = changes.display_name ?? state.profile?.display_name ?? state.displayName ?? state.identity ?? 'Guest';
  const avatarId = changes.avatar_id ?? state.profile?.avatar_id ?? saved.avatarId ?? 'badge-1';
  if (state.userId) {
    try {
      const data = await invokeGameAction({
        action: 'update_profile',
        display_name: displayName,
        avatar_id: avatarId,
        cosmetics: changes.cosmetics
      });
      state.profile = data.profile;
      state.displayName = data.profile.display_name;
      state.cosmeticOptions = data.cosmetic_options || state.cosmeticOptions;
      state.equippedCosmetics = data.profile.equipped_cosmetics;
      state.xp = Number(data.points);
      state.passed = (data.completed_levels || []).map(level => Number(level) - 1);
      toast('Profile updated.');
    } catch (error) {
      toast(`Profile could not be updated: ${error.message}`);
      return;
    }
  } else {
    state.displayName = displayName;
    saved.avatarId = avatarId;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...saved,
        displayName: state.displayName,
        avatarId,
        xp: state.xp,
        passed: state.passed,
        attempts: state.attempts,
        settings: state.settings
      }));
    } catch {
      toast('Profile could not be saved in this browser.');
      return;
    }
    toast('Profile saved on this device. Sign in to sync it to Supabase.');
  }
  $('#avatar-picker').hidden = true;
  $('#profile-editor').hidden = true;
  renderAuthState();
  updateStats();
  await loadSharedLeaderboard();
}

function renderCosmeticControls() {
  const container = $('#cosmetics-controls');
  if (!state.userId || !state.cosmeticOptions || !state.profile) {
    container.innerHTML = '';
    return;
  }
  const fields = [
    { key: 'nameColors', id: 'nameColorId', label: 'Name color' },
    { key: 'fonts', id: 'fontId', label: 'Font' },
    { key: 'backgrounds', id: 'backgroundId', label: 'Background' },
    { key: 'glows', id: 'glowId', label: 'Name glow' }
  ];
  container.innerHTML = fields.map(field => {
    const options = state.cosmeticOptions[field.key];
    const unlocked = state.profile.unlocked_cosmetics?.[field.key] || [];
    const selected = state.profile.equipped_cosmetics?.[field.id];
    return `<label class="cosmetic-control">${field.label}<select data-cosmetic-field="${field.id}">${options.map(option => {
      const available = unlocked.includes(option.id);
      const requirement = option.points ? ` · ${option.points} points` : option.levels ? ` · ${option.levels} levels` : '';
      return `<option value="${option.id}"${selected === option.id ? ' selected' : ''}${available ? '' : ' disabled'}>${option.label}${available ? '' : ` (unlock${requirement})`}</option>`;
    }).join('')}</select></label>`;
  }).join('');
  $$('[data-cosmetic-field]', container).forEach(select => select.addEventListener('change', () => {
    const cosmetics = Object.fromEntries($$('[data-cosmetic-field]', container).map(field => [field.dataset.cosmeticField, field.value]));
    void updatePlayerProfile({ cosmetics });
  }));
}

$('#auth-form').addEventListener('submit', event => {
  event.preventDefault();
  void signIn().catch(error => toast(`Could not sign in: ${error.message}`));
});
$('#sign-up').addEventListener('click', () => {
  void createAccount().catch(error => toast(`Could not create account: ${error.message}`));
});
$('#sign-out').addEventListener('click', () => {
  void signOut().catch(error => toast(`Could not sign out: ${error.message}`));
});
$('#timed-challenge-start').addEventListener('click', () => void startTimedChallenge());
$('#master-volume').addEventListener('input', event => {
  state.settings.masterVolume = Number(event.currentTarget.value);
  $('#volume-value').textContent = `${state.settings.masterVolume}%`;
  syncBackgroundMusic();
  saveSettings();
});
$('#effects-enabled').addEventListener('change', event => {
  state.settings.effectsEnabled = event.currentTarget.checked;
  saveSettings();
});
$('#music-enabled').addEventListener('change', event => {
  state.settings.musicEnabled = event.currentTarget.checked;
  syncBackgroundMusic();
  saveSettings();
});
$('#dark-mode').addEventListener('change', event => {
  state.settings.darkMode = event.currentTarget.checked;
  applySettings();
  saveSettings();
});
$('#edit-profile').addEventListener('click', () => {
  const editor = $('#profile-editor');
  editor.hidden = !editor.hidden;
  $('#profile-display-name').value = state.profile?.display_name || state.displayName || state.identity || '';
});
$('#save-profile').addEventListener('click', () => {
  void updatePlayerProfile({ display_name: $('#profile-display-name').value.trim() });
});
$('#change-avatar').addEventListener('click', renderAvatarPicker);

$$('[data-view]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); setView(link.dataset.view); }));
$$('[data-filter]').forEach(tab => tab.addEventListener('click', () => {
  state.filter = tab.dataset.filter;
  $$('.lesson-tab').forEach(item => item.classList.toggle('active', item === tab));
  renderLessons();
}));
$$('[data-start-lesson], #next-level-start').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.startLesson !== undefined && button.dataset.startLesson !== '') openLesson(Number(button.dataset.startLesson));
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
  if (state.sharedEntries) toast('Shared leaderboard refreshed.');
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('#lesson-flow').hidden) closeLesson(); });
document.addEventListener('pointerdown', unlockBackgroundMusic, { capture: true });
document.addEventListener('keydown', unlockBackgroundMusic, { capture: true });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) backgroundMusic.pause();
  else syncBackgroundMusic();
});
window.addEventListener('hashchange', () => {
  const view = window.location.hash.slice(1);
  if (['home', 'lessons', 'progress', 'leaderboard', 'settings'].includes(view)) setView(view);
});

function setLayout(layout, persistLayout = true) {
  document.body.classList.toggle('desktop-view', layout === 'desktop');
  document.body.classList.toggle('mobile-view', layout === 'mobile');
  $$('[data-layout]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.layout === layout)));
  if (persistLayout) localStorage.setItem('benchmark-layout', layout);
}

$$('[data-layout]').forEach(button => button.addEventListener('click', () => setLayout(button.dataset.layout)));
setLayout(localStorage.getItem('benchmark-layout') || 'automatic', false);
applySettings();
renderAuthState();
updateStats();
renderLessons();
updateDate();
setInterval(updateDate, 60_000);
const initialView = window.location.hash.slice(1);
if (['home', 'lessons', 'progress', 'leaderboard', 'settings'].includes(initialView)) setView(initialView);

async function initializeAuth() {
  if (!supabaseClient) {
    $('#auth-status').textContent = 'Supabase is not configured. Local progress and settings remain available in this browser.';
    return;
  }
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    toast(`Could not restore your sign-in: ${error.message}`);
    return;
  }
  if (data.session?.user) {
    try {
      await activateSession(data.session.user);
    } catch (sessionError) {
      toast(`Could not load your Benchmark profile: ${sessionError.message}`);
    }
  }
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session?.user && session.user.id !== state.userId) {
      setTimeout(() => {
        void activateSession(session.user).catch(sessionError => toast(`Could not load your Benchmark profile: ${sessionError.message}`));
      }, 0);
    }
  });
}

void initializeAuth();