const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const STORAGE_KEY = 'renetech-learning-v1';
const supabaseConfig = window.RENETECH_SUPABASE_CONFIG || {};
const supabaseClient = supabaseConfig.url && supabaseConfig.publishableKey && window.supabase?.createClient
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey)
  : null;
const mc = (prompt, options, answer, explanation) => ({ prompt, options, answer, explanation });
const tf = (prompt, answer, explanation) => mc(prompt, ['True', 'False'], answer, explanation);
const fill = (prompt, options, answer, explanation) => mc(prompt, options, answer, explanation);

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
      fill('Fill in the blank: You should always ______ or discharge yourself before touching any part of the computer.', ['ground', 'insulate', 'charge', 'disconnect'], 'ground', 'Grounding discharges static electricity that could damage components.'),
      mc('How should you hold computer components to avoid damage?', ['By the Integrated Circuit (IC) parts', 'By the edges', 'By squeezing firmly', "It doesn't matter"], 'By the edges', 'Hold components by their edges to avoid touching sensitive circuitry.'),
      tf('True or False: Liquids should be kept near your working area for convenience.', 'False', 'Keep liquids away from the work area to prevent spills and damage.'),
      mc('What tool(s) can be used for cleaning a computer system?', ['Wet cloth and water', 'Brush, compressed air, or blower', 'Sandpaper', 'Bare hands only'], 'Brush, compressed air, or blower', 'Use a brush, compressed air, or a blower to remove dust safely.'),
      mc("What should you do if a component doesn't slip into place easily?", ['Use excessive force', 'Do not use excessive force', 'Hammer it in', 'Ignore it'], 'Do not use excessive force', 'Check alignment and connections rather than forcing a component.'),
      mc('According to the lesson, what is the most important rule?', ['Speed 1st', 'Safety 1st', 'Cost 1st', 'Convenience 1st'], 'Safety 1st', 'Safety comes before speed, cost, or convenience.')
    ]
  },
  {
    title: 'CSS-Related Jobs', category: 'CAREER PATHS', icon: '⚙',
    description: 'Explore common roles in Computer System Servicing.',
    summary: ['Computer assemblers produce and assemble computer parts.', 'Network technicians build and troubleshoot networks; service technicians set up hardware and software.', 'Maintenance technicians support daily computer performance, while repairmen diagnose and repair customer devices.'],
    questions: [
      mc('Who is responsible for producing components and assembling computer parts?', ['Computer Assembler', 'Network Technician', 'Technical Support Staff', 'Computer Repairman'], 'Computer Assembler', 'Computer assemblers produce components and assemble computer parts.'),
      mc('Which job involves building and troubleshooting computer networks?', ['Computer Service Technician', 'Network Technician', 'Computer Assembler', 'Computer Maintenance Technician'], 'Network Technician', 'Network technicians build and troubleshoot computer networks.'),
      mc('Which job focuses on setting up hardware and configuring software and drivers?', ['Computer Service Technician', 'Network Technician', 'Computer Repairman', 'Technical Support Staff'], 'Computer Service Technician', 'Computer service technicians set up hardware and configure software and drivers.'),
      tf('True or False: A Technical Support Staff may handle installation of devices and software.', 'True', 'Technical support staff may install devices and software.'),
      mc('Which job is responsible for maintaining and providing technical support to overall daily computer performance?', ['Computer Maintenance Technician', 'Network Technician', 'Computer Assembler', 'Technical Support Staff'], 'Computer Maintenance Technician', 'Computer maintenance technicians support overall daily computer performance.'),
      mc('Which job requires extensive knowledge on diagnosing and repairing different devices brought in by customers?', ['Computer Repairman', 'Network Technician', 'Computer Assembler', 'Computer Service Technician'], 'Computer Repairman', 'Computer repairmen diagnose and repair different devices brought in by customers.'),
      tf('True or False: A Network Technician is considered an information technology professional.', 'True', 'A Network Technician is an information technology professional.'),
      mc('Which job title is often common in businesses that provide repair and maintenance services?', ['Computer Repairman', 'Network Technician', 'Computer Assembler', 'Technical Support Staff'], 'Computer Repairman', 'Computer Repairman is a common title in repair and maintenance businesses.'),
      fill('Fill in the blank: A Computer Maintenance Technician has a more ______ set of skills compared to other CSS jobs.', ['diverse', 'limited', 'specialized', 'narrow'], 'diverse', 'The role uses a diverse set of skills across computer maintenance.'),
      mc('Which job can be in high demand across various organizations and business establishments, handling maintenance, installation, and configuration?', ['Technical Support Staff', 'Computer Assembler', 'Network Technician', 'Computer Repairman'], 'Technical Support Staff', 'Technical support staff handle maintenance, installation, and configuration across organizations.')
    ]
  },
  {
    title: 'Computer Parts & Functions', category: 'HARDWARE FUNDAMENTALS', icon: '▣',
    description: 'Identify core computer components, ports, and what they do.',
    summary: ['The AVR regulates voltage; the CPU processes instructions, and RAM is temporary memory.', 'The HDD stores files, the motherboard connects components, and the BIOS provides basic setup access.', 'The PSU converts AC to low-voltage DC; PS2, HDMI, and SATA connect peripherals and devices.'],
    questions: [
      mc('Which device regulates voltage to protect the computer from electrical changes?', ['AVR', 'PSU', 'CPU', 'RAM'], 'AVR', 'An AVR regulates voltage to help protect the computer from electrical changes.'),
      mc('What is considered the "brain" of the computer?', ['Motherboard', 'CPU', 'RAM', 'HDD'], 'CPU', 'The CPU processes instructions and is commonly called the computer brain.'),
      tf('True or False: RAM is a permanent storage device that keeps data even after shutdown.', 'False', 'RAM is temporary memory; its contents do not persist after power is off.'),
      mc('Which component is the main storage device where files like those on the Desktop are stored?', ['Hard Disk Drive (HDD)', 'RAM', 'ROM', 'CMOS'], 'Hard Disk Drive (HDD)', 'The HDD is a main storage device for files.'),
      mc('What is the main circuit board that connects all other computer parts called?', ['Motherboard', 'System Chassis', 'Expansion Bus', 'CPU Socket'], 'Motherboard', 'The motherboard is the main circuit board connecting computer parts.'),
      fill('Fill in the blank: The ______ chip is a ROM chip on the motherboard that allows access to basic computer setup.', ['BIOS', 'CMOS', 'RAM', 'SATA'], 'BIOS', 'The BIOS ROM chip allows access to basic computer setup.'),
      mc('Which port is used to connect a mouse and keyboard using round connectors?', ['PS2 Port', 'HDMI', 'SATA', 'LAN Port'], 'PS2 Port', 'PS2 ports use round connectors for a mouse and keyboard.'),
      mc('Which component converts alternating current into low-voltage direct current?', ['Power Supply Unit (PSU)', 'CPU', 'RAM', 'Sound Card'], 'Power Supply Unit (PSU)', 'The PSU converts alternating current to low-voltage direct current.'),
      mc('Which port can carry uncompressed video and compressed or uncompressed audio signals?', ['HDMI', 'Serial Port', 'PS2 Port', 'IDE'], 'HDMI', 'HDMI can carry video and audio signals.'),
      tf('True or False: SATA is a standard used for connecting devices like optical drives and hard drives to the motherboard.', 'True', 'SATA connects storage devices such as hard drives and optical drives to the motherboard.')
    ]
  },
  {
    title: 'Prepare and Interpret Technical Drawings', category: 'TECHNICAL DRAWINGS', icon: '⌘',
    description: 'Read common diagram symbols and basic binary values.',
    summary: ['Flowcharts show process steps: terminators mark start/end, diamonds decisions, rectangles actions, and parallelograms input/output.', 'Schematic diagrams show abstract system elements; layout plans arrange equipment in a workspace.', 'One byte contains 8 bits. Decimal 5 is written as 0101 in binary.'],
    questions: [
      mc('What is a diagram called that shows the steps of a process using shapes and arrows?', ['Flowchart', 'Block Diagram', 'Layout Plan', 'Loop Diagram'], 'Flowchart', 'A flowchart shows process steps using symbols and arrows.'),
      mc('Which flowchart symbol signifies the start or end of a process?', ['Elongated Circle (Terminator)', 'Rectangle', 'Diamond', 'Parallelogram'], 'Elongated Circle (Terminator)', 'The elongated circle, or terminator, marks a start or end.'),
      mc('Which flowchart symbol represents a decision with a Yes/No answer?', ['Diamond', 'Rectangle', 'Small Circle', 'Arrow Line'], 'Diamond', 'A diamond represents a decision, often with Yes/No branches.'),
      mc('Which flowchart symbol shows instructions or actions?', ['Rectangle (Process)', 'Diamond', 'Parallelogram', 'Small Circle'], 'Rectangle (Process)', 'A rectangle represents a process or action.'),
      tf('True or False: The Parallelogram symbol is used to represent Input and Output.', 'True', 'A parallelogram represents input and output in a flowchart.'),
      fill('Fill in the blank: The small circle symbol in a flowchart is also called a ______.', ['connector', 'terminator', 'process', 'decision'], 'connector', 'A small circle connects separated parts of a flowchart.'),
      mc('Which type of diagram removes irrelevant information and shows abstract, symbolic system elements?', ['Schematic Diagram', 'Chart', 'Block Diagram', 'Layout Plan'], 'Schematic Diagram', 'A schematic diagram uses abstract, symbolic system elements.'),
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
      mc('Which of these is a wireless method of connection?', ['Cables', 'Fiber optics', 'Twisted pair', 'Satellites'], 'Satellites', 'Satellites provide wireless communication links.'),
      mc('In a Peer-to-Peer (P2P) network, each device acts as:', ['Only a client', 'Only a server', 'Both a client and a server', 'Neither a client nor a server'], 'Both a client and a server', 'In a P2P network, each device can act as both client and server.'),
      mc('A Client/Server network is best described as:', ['An equal network with no central authority', 'An organized network with a central server managing everything', 'A network limited to under 10 devices', 'A network with no scalability'], 'An organized network with a central server managing everything', 'A client/server network uses a central server to manage network services.'),
      mc('What does a Codec do?', ['Extends signal distance for campus networks', 'Converts digital to analog signals', 'Compresses/decompresses video or audio, such as for Zoom calls', 'Manages a central server'], 'Compresses/decompresses video or audio, such as for Zoom calls', 'A codec compresses and decompresses digital audio or video.'),
      mc('Which cable type is the most common average network cable (e.g., Cat5e/Cat6)?', ['Coaxial', 'Fiber Optic', 'Wireless', 'Twisted Pair'], 'Twisted Pair', 'Cat5e and Cat6 are twisted-pair cables.'),
      mc('A LAN (Local Area Network) typically covers:', ['An entire country', 'A single building or campus', 'An entire city', 'The whole world'], 'A single building or campus', 'A LAN typically covers a limited local area such as a building or campus.'),
      mc('Which network type is described as the largest WAN and uses telecom infrastructure?', ['LAN', 'MAN', 'The Internet', 'P2P'], 'The Internet', 'The Internet is the largest WAN and relies on telecommunications infrastructure.'),
      mc('In a Star topology, what happens if the central hub fails?', ['Nothing, the network keeps working normally', 'Only one device loses connection', 'All devices are disrupted', 'The network automatically switches to Bus topology'], 'All devices are disrupted', 'In a star topology, devices depend on the central hub.'),
      mc('What is a key disadvantage of Bus topology?', ['It requires a central hub', 'A cable break disrupts the entire network', 'It cannot connect more than 2 devices', 'It always uses fiber optic cable'], 'A cable break disrupts the entire network', 'A break in the main bus cable can disrupt the entire network.')
    ]
  }
];

function loadSavedState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function shuffleQuestionOptions(questions) {
  return questions.map(question => {
    const options = [...question.options];
    for (let index = options.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [options[index], options[swapIndex]] = [options[swapIndex], options[index]];
    }
    return { ...question, options };
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
let proofCode = '';
let audioContext = null;
let activeAttemptWasReplay = false;
let closeLessonTimer = null;

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
  $('#lesson-list').innerHTML = visible.map(({ lesson, index, passed, unlocked: isUnlocked }) => {
    const status = passed ? 'Passed' : isUnlocked ? 'Ready to start' : 'Locked';
    const action = isUnlocked ? `<button class="row-button" type="button" data-lesson-index="${index}">${passed ? 'Replay' : 'Start'} <span>→</span></button>` : '<span class="lock-mark" aria-label="Locked">&#128274;</span>';
    return `<article class="lesson-row${isUnlocked ? '' : ' locked'}${state.newUnlock === index ? ' just-unlocked' : ''}"><div class="lesson-thumb lesson-symbol lesson-symbol-${index}">${lesson.icon}</div><div><span class="eyebrow">LESSON ${index + 1} · ${lesson.category}</span><h3>${lesson.title}</h3><p>${lesson.description} &nbsp; 10 questions</p></div><div class="row-action"><div class="row-status ${passed ? 'completed' : ''}">${status}</div>${action}</div></article>`;
  }).join('');
  $$('.row-button', $('#lesson-list')).forEach(button => button.addEventListener('click', () => openLesson(Number(button.dataset.lessonIndex))));
  $('#lesson-count').textContent = lessons.length;
}

function updateStats() {
  const weeklyPoints = state.attempts.filter(attempt => Number(attempt.at) >= Date.now() - 7 * 24 * 60 * 60 * 1000).reduce((sum, attempt) => sum + (Number(attempt.points) || 0), 0);
  $('#xp-total').textContent = state.xp.toLocaleString();
  $('#xp-week').textContent = weeklyPoints.toLocaleString();
  $('#streak-total').textContent = state.passed.length;
  $('#passed-total').textContent = ` / ${lessons.length}`;
  $('#sidebar-streak').textContent = `${state.passed.length} lessons passed`;
  $('#passed-message').textContent = state.passed.length === lessons.length ? 'Replay lessons for more points.' : 'Pass with 7 out of 10 to unlock the next lesson.';
  $('#goal-complete').textContent = `${state.passed.length} of ${lessons.length}`;
  $('#goal-percent').textContent = Math.round((state.passed.length / lessons.length) * 100);
  renderProgress();
  updateNextLesson();
}

function updateNextLesson() {
  const nextIndex = lessons.findIndex((_, index) => unlocked(index) && !state.passed.includes(index));
  const index = nextIndex < 0 ? 0 : nextIndex;
  const lesson = lessons[index];
  $('#next-lesson-title').textContent = lesson.title;
  $('#next-lesson-description').textContent = lesson.description;
  $('#next-lesson-number').textContent = `Lesson ${index + 1} of ${lessons.length}`;
  $('[data-start-lesson]').dataset.startLesson = index;
}

function renderProgress() {
  const level = Math.floor(state.xp / 200) + 1;
  const levelStart = (level - 1) * 200;
  const levelEnd = level * 200;
  const progress = Math.round(((state.xp - levelStart) / 200) * 100);
  const remaining = levelEnd - state.xp;
  const habitScore = Math.min(100, 70 + state.passed.length * 3);
  $('#progress-level-badge').textContent = `LEVEL ${level}`;
  $('#level-xp').textContent = `${state.xp.toLocaleString()} / ${levelEnd.toLocaleString()} points`;
  $('#level-progress-bar').style.width = `${progress}%`;
  $('#progress-level-label').textContent = `Level ${level}`;
  $('#xp-to-next').textContent = `${remaining.toLocaleString()} points to level ${level + 1}`;
  $('#habit-score').textContent = habitScore;
  $('#habit-summary').textContent = `You have passed ${state.passed.length} of ${lessons.length} lessons. Keep building your skills.`;
  const milestones = $$('.milestone');
  const nextMilestone = milestones.find(milestone => state.xp < Number(milestone.dataset.milestoneXp));
  milestones.forEach(milestone => {
    const earned = state.xp >= Number(milestone.dataset.milestoneXp);
    milestone.classList.toggle('done', earned);
    milestone.classList.toggle('current', milestone === nextMilestone);
  });
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
    const patterns = { correct: [660, 880], wrong: [260, 190], pass: [523, 659, 784], points: [740, 988] };
    (patterns[kind] || [440]).forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime + index * 0.11;
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.09, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.17);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.18);
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
  clearTimeout(closeLessonTimer);
  $('#lesson-flow').classList.remove('is-closing');
  activeLessonIndex = index;
  activeAttemptWasReplay = state.passed.includes(index);
  activeQuestionIndex = 0;
  selectedAnswer = null;
  answerScore = 0;
  $('#lesson-flow').hidden = false;
  renderSummary();
  $('#flow-close').focus();
}

function closeLesson() {
  const dialog = $('#lesson-flow');
  if (dialog.hidden || dialog.classList.contains('is-closing')) return;
  dialog.classList.add('is-closing');
  closeLessonTimer = setTimeout(() => {
    dialog.hidden = true;
    dialog.classList.remove('is-closing');
    activeLessonIndex = null;
  }, 190);
}

function renderSummary() {
  const lesson = lessons[activeLessonIndex];
  $('#lesson-flow-content').innerHTML = `<p class="eyebrow">LESSON ${activeLessonIndex + 1} · ${lesson.category}</p><div class="flow-lesson-icon">${lesson.icon}</div><h1 id="flow-title">${lesson.title}</h1><p class="flow-lead">${lesson.description}</p><ul class="summary-points">${lesson.summary.map(point => `<li>${point}</li>`).join('')}</ul><div class="flow-footer"><span>10 questions · Pass with 7 correct</span><button class="primary-button" type="button" data-begin-quiz>Begin Quiz <span>→</span></button></div>`;
  $('[data-begin-quiz]').addEventListener('click', () => {
    activeQuestions = lesson.preserveOptionOrder
      ? lesson.questions.map(question => ({ ...question, options: [...question.options] }))
      : shuffleQuestionOptions(lesson.questions);
    activeQuestionIndex = 0;
    renderQuestion();
  });
}

function renderQuestion() {
  selectedAnswer = null;
  const lesson = lessons[activeLessonIndex];
  const question = activeQuestions[activeQuestionIndex];
  const progress = (activeQuestionIndex / activeQuestions.length) * 100;
  $('#lesson-flow-content').innerHTML = `<p class="eyebrow">LESSON ${activeLessonIndex + 1} · ${lesson.category}</p><div class="quiz-heading"><h1 id="flow-title">${lesson.title}</h1><span>Question ${activeQuestionIndex + 1} / ${activeQuestions.length}</span></div><div class="quiz-progress"><span style="width:${progress}%"></span></div><h2 class="question-prompt">${question.prompt}</h2><div class="answer-list" role="group" aria-label="Answer choices">${question.options.map((option, index) => `<button class="answer-choice" type="button" data-answer-index="${index}"><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join('')}</div><div class="answer-feedback" id="answer-feedback" aria-live="polite"></div><div class="flow-footer quiz-footer"><span>${answerScore} correct so far</span><button class="primary-button" type="button" data-next-question disabled>${activeQuestionIndex === activeQuestions.length - 1 ? 'See results' : 'Next question'} <span>→</span></button></div>`;
  $$('.answer-choice').forEach((button, index) => {
    button.style.setProperty('--choice-index', index);
    button.addEventListener('click', () => chooseAnswer(Number(button.dataset.answerIndex)));
  });
  $('[data-next-question]').addEventListener('click', () => {
    if (activeQuestionIndex === activeQuestions.length - 1) finishAttempt();
    else { activeQuestionIndex += 1; renderQuestion(); }
  });
}

function chooseAnswer(optionIndex) {
  if (selectedAnswer !== null) return;
  const question = activeQuestions[activeQuestionIndex];
  selectedAnswer = question.options[optionIndex];
  const isCorrect = selectedAnswer.toLocaleLowerCase() === question.answer.toLocaleLowerCase();
  if (isCorrect) answerScore += 1;
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
  if (unlockedIndex >= 0) toast(`Lesson ${activeLessonIndex + 1} passed! Lesson ${unlockedIndex + 1} unlocked.`);
  else if (didPass && !passedBefore) toast(`Lesson ${activeLessonIndex + 1} passed! +${answerScore} points earned.`);
  else toast(`+${answerScore} point${answerScore === 1 ? '' : 's'} added to your total.`);
  renderResult(didPass, passedBefore);
}

function renderResult(didPass, passedBefore) {
  const lesson = lessons[activeLessonIndex];
  const title = didPass ? 'Congratulations, you passed!' : 'Good try!';
  const message = didPass ? `You passed ${lesson.title} with ${answerScore} out of 10.` : `You earned ${answerScore} out of 10. You need 7 to pass. Your next try can be stronger.`;
  const action = didPass ? '<button class="primary-button" type="button" data-show-proof>View completion proof <span>→</span></button>' : '<button class="primary-button" type="button" data-retry-lesson>Retry lesson <span>↻</span></button>';
  $('#lesson-flow-content').innerHTML = `<div class="result-burst ${didPass ? 'pass-burst' : 'retry-burst'}">${didPass ? '✦' : '↻'}</div><p class="eyebrow">LESSON ${activeLessonIndex + 1} ${passedBefore ? 'REPLAY' : 'RESULT'}</p><h1 id="flow-title">${title}</h1><p class="flow-lead">${message}</p><div class="score-summary"><div><strong>${answerScore}<span>/10</span></strong><small>points this attempt</small></div><div><strong>${state.xp.toLocaleString()}</strong><small>total points</small></div></div><div class="flow-footer">${didPass ? '<button class="text-button" type="button" data-back-lessons>Back to lessons</button>' : '<button class="text-button" type="button" data-back-lessons>Back to lessons</button>'}${action}</div>`;
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
  canvas.setAttribute('aria-label', `You've completed Lesson ${activeLessonIndex + 1}! ${lesson.title}. Score ${answerScore} out of 10. Total points ${state.xp}. Verification ${proofCode}.`);
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
  context.fillText(`LESSON ${activeLessonIndex + 1} · ${lesson.title.toLocaleUpperCase()}`, 84, 275);
  context.fillStyle = '#202b3a';
  context.font = '700 46px Arial';
  context.fillText(`You've completed Lesson ${activeLessonIndex + 1}!`, 84, 365);
  context.font = '32px Arial';
  context.fillText(`Score: ${answerScore} / 10     Total points: ${state.xp.toLocaleString()}`, 84, 445);
  context.font = '24px Arial';
  context.fillText(`Completed: ${stamp.toLocaleString()}`, 84, 515);
  context.fillStyle = '#173b75';
  context.font = '700 25px monospace';
  context.fillText(`Verification ID: ${proofCode}`, 84, 610);
  context.fillStyle = '#657286';
  context.font = '20px Arial';
  context.fillText('This image records a completed lesson attempt.', 84, 670);
  $('#lesson-flow-content').innerHTML = `<p class="eyebrow">PROOF OF COMPLETION</p><h1 id="flow-title">Your lesson proof</h1><p class="flow-lead">Save this image to share your completed lesson.</p><div class="proof-image-wrap"></div><div class="flow-footer"><button class="text-button" type="button" data-back-result>Back</button><div class="proof-actions"><button class="secondary-button" type="button" data-download-proof aria-label="Download proof image">↓ Download PNG</button><button class="primary-button" type="button" data-back-lessons>Done <span>→</span></button></div></div>`;
  $('.proof-image-wrap').append(canvas);
  $('[data-download-proof]').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `renetech-lesson-${activeLessonIndex + 1}-${proofCode}.png`;
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
  heading.innerHTML = '<span>RANK</span><span>STUDENT</span><span>TOTAL POINTS</span>';
  container.append(heading);
  const entries = (state.sharedEntries || Object.values(state.players))
    .sort((first, second) => second.points - first.points || first.name.localeCompare(second.name));
  entries.forEach((entry, index) => {
    const row = document.createElement('div');
    row.className = `leaderboard-row${entry.player_id === state.playerId ? ' current-player' : ''}`;
    row.style.setProperty('--row-index', Math.min(index, 8));
    const rank = document.createElement('strong'); rank.textContent = String(index + 1).padStart(2, '0');
    const name = document.createElement('span'); name.textContent = entry.name;
    const points = document.createElement('strong'); points.textContent = `${Number(entry.points).toLocaleString()} pts`;
    row.append(rank, name, points);
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
  document.body.classList.add('app-entered');
  $('.sidebar').classList.remove('open');
  $$('.view').forEach(section => section.classList.toggle('active', section.dataset.page === view));
  $$('.nav-item').forEach(link => link.classList.toggle('active', link.dataset.view === view));
  $('#page-title').textContent = ({ home: 'Your learning garden', lessons: 'My lessons', progress: 'Your progress', leaderboard: 'Leaderboard' })[view] || 'Your learning garden';
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
$$('[data-start-lesson]').forEach(button => button.addEventListener('click', () => openLesson(Number(button.dataset.startLesson))));
$$('[data-enter-app]').forEach(button => button.addEventListener('click', () => setView('home')));
$('.mobile-menu').addEventListener('click', () => $('.sidebar').classList.toggle('open'));
$('#flow-close').addEventListener('click', closeLesson);
$('#lesson-flow').addEventListener('click', event => { if (event.target === $('#lesson-flow')) closeLesson(); });
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