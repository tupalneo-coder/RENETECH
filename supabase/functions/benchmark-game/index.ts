import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { COSMETIC_RULES, getUnlockedCosmetics, type CosmeticField } from '../_shared/cosmetics.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const answerKey: Record<string, { answer: string | Record<string, string>; explanation: string }> = {
  "l0q0": {
    "answer": "Occupational Health and Safety",
    "explanation": "OHS is short for Occupational Health and Safety."
  },
  "l0q1": {
    "answer": "RA 11058",
    "explanation": "Republic Act 11058 covers Occupational Safety and Health Standards."
  },
  "l0q2": {
    "answer": "False",
    "explanation": "Do not work alone; safe work practices include having appropriate assistance."
  },
  "l0q3": {
    "answer": "Power off and unplug the computer",
    "explanation": "Disconnecting power reduces electrical and equipment risks."
  },
  "l0q4": {
    "answer": "ground",
    "explanation": "Grounding discharges static electricity that could damage components."
  },
  "l0q5": {
    "answer": {
      "Handle a circuit board": "Hold it by the edges",
      "Prepare to work inside a computer": "Power off and unplug it",
      "Reduce static electricity": "Ground yourself",
      "Remove dust": "Use a brush or compressed air"
    },
    "explanation": "Each item is paired with its corresponding role, function, or description."
  },
  "l0q6": {
    "answer": "False",
    "explanation": "Keep liquids away from the work area to prevent spills and damage."
  },
  "l0q7": {
    "answer": {
      "Liquid near components": "Keep it away from the work area",
      "A component will not fit": "Check alignment; never force it",
      "Dust on a computer": "Clean with a brush or air",
      "Sensitive circuitry": "Avoid touching it directly"
    },
    "explanation": "Each item is paired with its corresponding role, function, or description."
  },
  "l0q8": {
    "answer": "never force",
    "explanation": "Check alignment and connections rather than forcing a component."
  },
  "l0q9": {
    "answer": "Safety 1st",
    "explanation": "Safety comes before speed, cost, or convenience."
  },
  "l1q0": {
    "answer": "Computer Assembler",
    "explanation": "Computer assemblers produce components and assemble computer parts."
  },
  "l1q1": {
    "answer": "Network Technician",
    "explanation": "Network technicians build and troubleshoot computer networks."
  },
  "l1q2": {
    "answer": "Computer Service",
    "explanation": "Computer service technicians set up hardware and configure software and drivers."
  },
  "l1q3": {
    "answer": "True",
    "explanation": "Technical support staff may install devices and software."
  },
  "l1q4": {
    "answer": "Computer Maintenance Technician",
    "explanation": "Computer maintenance technicians support overall daily computer performance."
  },
  "l1q5": {
    "answer": {
      "Computer Assembler": "Produces components and assembles computer parts",
      "Network Technician": "Builds and troubleshoots computer networks",
      "Computer Repairman": "Diagnoses and repairs customer devices",
      "Computer Maintenance Technician": "Supports day-to-day computer performance"
    },
    "explanation": "Each item is paired with its corresponding role, function, or description."
  },
  "l1q6": {
    "answer": "True",
    "explanation": "A Network Technician is an information technology professional."
  },
  "l1q7": {
    "answer": "Computer Repairman",
    "explanation": "Computer Repairman is a common title in repair and maintenance businesses."
  },
  "l1q8": {
    "answer": "diverse",
    "explanation": "The role uses a diverse set of skills across computer maintenance."
  },
  "l1q9": {
    "answer": "maintenance",
    "explanation": "Technical support staff handle maintenance, installation, and configuration across organizations."
  },
  "l2q0": {
    "answer": "AVR",
    "explanation": "An AVR regulates voltage to help protect the computer from electrical changes."
  },
  "l2q1": {
    "answer": "CPU",
    "explanation": "The CPU processes instructions and is commonly called the computer brain."
  },
  "l2q2": {
    "answer": "temporary",
    "explanation": "RAM is temporary memory; its contents do not persist after power is off."
  },
  "l2q3": {
    "answer": "Hard Disk Drive (HDD)",
    "explanation": "The HDD is a main storage device for files."
  },
  "l2q4": {
    "answer": "Motherboard",
    "explanation": "The motherboard is the main circuit board connecting computer parts."
  },
  "l2q5": {
    "answer": "BIOS",
    "explanation": "The BIOS ROM chip allows access to basic computer setup."
  },
  "l2q6": {
    "answer": {
      "CPU": "Processes instructions",
      "RAM": "Holds temporary working data",
      "HDD": "Stores files and programs",
      "Motherboard": "Connects the computer components"
    },
    "explanation": "Each item is paired with its corresponding role, function, or description."
  },
  "l2q7": {
    "answer": "Power Supply Unit (PSU)",
    "explanation": "The PSU converts alternating current to low-voltage direct current."
  },
  "l2q8": {
    "answer": {
      "PS2 port": "Connects a mouse or keyboard with a round plug",
      "HDMI": "Carries digital video and audio",
      "SATA": "Connects storage devices to the motherboard",
      "PSU": "Converts AC into low-voltage DC"
    },
    "explanation": "Each item is paired with its corresponding role, function, or description."
  },
  "l2q9": {
    "answer": "True",
    "explanation": "SATA connects storage devices such as hard drives and optical drives to the motherboard."
  },
  "l3q0": {
    "answer": "Flowchart",
    "explanation": "A flowchart shows process steps using symbols and arrows."
  },
  "l3q1": {
    "answer": {
      "Terminator (oval)": "Marks the start or end",
      "Diamond": "Shows a decision branch",
      "Rectangle": "Shows a process or action",
      "Parallelogram": "Shows input or output"
    },
    "explanation": "Each item is paired with its corresponding role, function, or description."
  },
  "l3q2": {
    "answer": "Diamond",
    "explanation": "A diamond represents a decision, often with Yes/No branches."
  },
  "l3q3": {
    "answer": "Rectangle (Process)",
    "explanation": "A rectangle represents a process or action."
  },
  "l3q4": {
    "answer": "parallelogram",
    "explanation": "A parallelogram represents input and output in a flowchart."
  },
  "l3q5": {
    "answer": "connector",
    "explanation": "A small circle connects separated parts of a flowchart."
  },
  "l3q6": {
    "answer": {
      "Flowchart": "Steps in a process using symbols and arrows",
      "Schematic diagram": "Abstract, symbolic system elements",
      "Layout plan": "Equipment placement in a workplace",
      "Block diagram": "High-level functional parts of a system"
    },
    "explanation": "Each item is paired with its corresponding role, function, or description."
  },
  "l3q7": {
    "answer": "Layout Plan",
    "explanation": "A layout plan shows how equipment is arranged in a workplace."
  },
  "l3q8": {
    "answer": "8",
    "explanation": "One byte is made up of 8 bits."
  },
  "l3q9": {
    "answer": "0101",
    "explanation": "Decimal 5 is 0101 in four-bit binary representation."
  },
  "l4q0": {
    "answer": "Multiple computers connected to share resources and communicate with one another",
    "explanation": "A computer network connects devices so they can share resources and communicate."
  },
  "l4q1": {
    "answer": "wireless",
    "explanation": "Wireless links, such as satellite connections, do not use a physical network cable."
  },
  "l4q2": {
    "answer": {
      "Peer-to-Peer (P2P)": "Each device can act as client and server",
      "Client/Server": "A central server manages network services",
      "LAN": "Covers a building or campus",
      "WAN": "Connects networks across large geographic areas"
    },
    "explanation": "Each item is paired with its corresponding role, function, or description."
  },
  "l4q3": {
    "answer": "An organized network with a central server managing everything",
    "explanation": "A client/server network uses a central server to manage network services."
  },
  "l4q4": {
    "answer": "Compresses/decompresses video or audio, such as for Zoom calls",
    "explanation": "A codec compresses and decompresses digital audio or video."
  },
  "l4q5": {
    "answer": "twisted",
    "explanation": "Cat5e and Cat6 are twisted-pair cables."
  },
  "l4q6": {
    "answer": "A single building or campus",
    "explanation": "A LAN typically covers a limited local area such as a building or campus."
  },
  "l4q7": {
    "answer": "The Internet",
    "explanation": "The Internet is the largest WAN and relies on telecommunications infrastructure."
  },
  "l4q8": {
    "answer": {
      "Star topology": "A central hub failure disrupts connected devices",
      "Bus topology": "A break in the main cable can disrupt the network",
      "Ring topology": "A break can interrupt the circular path",
      "Mesh topology": "Multiple paths can provide alternate routes"
    },
    "explanation": "Each item is paired with its corresponding role, function, or description."
  },
  "l4q9": {
    "answer": "A cable break disrupts the entire network",
    "explanation": "A break in the main bus cable can disrupt the entire network."
  }
};

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function normalizeAnswer(value: unknown) {
  return typeof value === 'string' ? value.trim().toLocaleLowerCase() : '';
}

function validateSingleResponse(questionId: string, value: unknown) {
  const expected = answerKey[questionId]?.answer;
  const pair = (value as { pair?: { left?: unknown; right?: unknown } } | null)?.pair;
  if (typeof expected === 'string') {
    if (typeof value !== 'string' || value.length > 1000) throw new Error('The answer is invalid.');
    return false;
  }
  if (!expected || typeof pair?.left !== 'string' || pair.left.length > 1000
    || typeof pair.right !== 'string' || pair.right.length > 1000) {
    throw new Error('The matching answer is invalid.');
  }
  return true;
}

function isCorrectPair(questionId: string, value: unknown) {
  const expected = answerKey[questionId]?.answer;
  if (!expected || typeof expected === 'string') return false;
  const pair = (value as { pair?: { left?: unknown; right?: unknown } } | null)?.pair;
  return typeof pair?.left === 'string'
    && Object.hasOwn(expected, pair.left)
    && typeof pair.right === 'string'
    && normalizeAnswer(expected[pair.left]) === normalizeAnswer(pair.right);
}

function isCorrectAnswer(questionId: string, value: unknown) {
  const expected = answerKey[questionId]?.answer;
  if (typeof expected === 'string') return normalizeAnswer(value) === normalizeAnswer(expected);
  if (!expected) return false;
  const matches = (value as { matches?: unknown } | null)?.matches;
  if (!Array.isArray(matches) || matches.length < Object.keys(expected).length
    || matches.length > Object.keys(expected).length + 20) return false;
  const matchedLeft = new Set<string>();
  let mistakes = 0;
  for (const match of matches) {
    if (!match || typeof match.left !== 'string' || typeof match.right !== 'string') return false;
    if (Object.hasOwn(expected, match.left)
      && normalizeAnswer(expected[match.left]) === normalizeAnswer(match.right)) {
      if (matchedLeft.has(match.left)) return false;
      matchedLeft.add(match.left);
    } else mistakes += 1;
  }
  return matchedLeft.size === Object.keys(expected).length && mistakes <= 1;
}

function validateAnswers(value: unknown, allowedQuestionIds: string[]) {
  if (!Array.isArray(value) || value.length > allowedQuestionIds.length) {
    throw new Error('The answer list is invalid.');
  }
  const ids = new Set<string>();
  let correct = 0;
  for (const item of value) {
    const response = item as { question_id?: unknown; answer?: unknown } | null;
    const questionId = response?.question_id;
    if (typeof questionId !== 'string' || !allowedQuestionIds.includes(questionId) || ids.has(questionId)) {
      throw new Error('The answer list contains an invalid or repeated question.');
    }
    ids.add(questionId);
    if (isCorrectAnswer(questionId, response?.answer)) correct += 1;
  }
  return { answered: value.length, correct };
}

async function syncProfile(admin: ReturnType<typeof createClient>, userId: string) {
  const [profileResult, scoreResult, progressResult] = await Promise.all([
    admin.from('profiles').select('*').eq('id', userId).single(),
    admin.from('leaderboard_scores').select('points').eq('user_id', userId).single(),
    admin.from('user_progress').select('completed_levels').eq('user_id', userId).single()
  ]);
  if (profileResult.error) throw profileResult.error;
  if (scoreResult.error) throw scoreResult.error;
  if (progressResult.error) throw progressResult.error;
  const points = Number(scoreResult.data.points);
  const completedLevels = progressResult.data.completed_levels.map(Number);
  const unlocked = getUnlockedCosmetics(points, completedLevels);
  const update = await admin.from('profiles')
    .update({ unlocked_cosmetics: unlocked })
    .eq('id', userId);
  if (update.error) throw update.error;
  return {
    profile: { ...profileResult.data, unlocked_cosmetics: unlocked },
    points,
    completed_levels: completedLevels,
    cosmetic_options: COSMETIC_RULES
  };
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return respond({ error: 'Method not allowed.' }, 405);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error('The Supabase function environment is not configured.');
    }
    const body = await request.json();
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    const publicActions = ['check_answer', 'start_lesson', 'start_training', 'check_training'];
    let userId = '';
    if (!publicActions.includes(body.action)) {
      const authorization = request.headers.get('Authorization');
      if (!authorization) throw new Error('Sign in to continue.');
      const caller = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authorization } },
        auth: { autoRefreshToken: false, persistSession: false }
      });
      const { data: userResult, error: authError } = await caller.auth.getUser();
      if (authError || !userResult.user) throw new Error('Your sign-in session is invalid. Sign in again.');
      userId = userResult.user.id;
    }

    if (body.action === 'check_answer') {
      const questionId = body.question_id;
      const sessionId = body.session_id;
      if (typeof questionId !== 'string' || !answerKey[questionId] || typeof sessionId !== 'string') {
        throw new Error('The question is invalid.');
      }
      const timed = body.mode === 'timed';
      let answers: Record<string, unknown>;
      if (timed) {
        const { data: session, error } = await admin.from('timed_challenge_sessions')
          .select('started_at, completed_at, submitted_answers')
          .eq('id', sessionId)
          .maybeSingle();
        if (error) throw error;
        if (!session || session.completed_at || Date.parse(session.started_at) <= Date.now() - 60_000) {
          throw new Error('The Timed Challenge session has expired.');
        }
        answers = session.submitted_answers || {};
      } else {
        const { data: session, error } = await admin.from('lesson_attempt_sessions')
          .select('lesson_number, answers, completed_at, expires_at')
          .eq('id', sessionId)
          .maybeSingle();
        if (error) throw error;
        if (!session || session.completed_at || Date.parse(session.expires_at) <= Date.now()
          || !questionId.startsWith(`l${session.lesson_number - 1}q`)) {
          throw new Error('The level attempt session has expired.');
        }
        answers = session.answers || {};
      }
      const pairAnswer = validateSingleResponse(questionId, body.answer);
      if (pairAnswer) {
        const previous = answers[questionId] as { matches?: unknown[] } | undefined;
        const matches = Array.isArray(previous?.matches) ? previous.matches : [];
        const expected = answerKey[questionId].answer;
        if (typeof expected === 'string') throw new Error('The matching answer is invalid.');
        if (matches.length >= Object.keys(expected).length + 20) {
          throw new Error('Too many matching attempts were submitted.');
        }
        answers[questionId] = { matches: [...matches, body.answer.pair] };
      } else {
        if (Object.hasOwn(answers, questionId)) throw new Error('This question has already been answered.');
        answers[questionId] = body.answer;
      }
      const { error: saveError } = timed
        ? await admin.from('timed_challenge_sessions').update({ submitted_answers: answers }).eq('id', sessionId)
        : await admin.from('lesson_attempt_sessions').update({ answers }).eq('id', sessionId);
      if (saveError) throw saveError;
      const detail = answerKey[questionId];
      const correct = pairAnswer
        ? isCorrectPair(questionId, body.answer)
        : isCorrectAnswer(questionId, body.answer);
      return respond({ correct, explanation: correct ? detail.explanation : undefined });
    }

    if (body.action === 'start_lesson') {
      const lessonNumber = Number(body.lesson_number);
      if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > 5) {
        throw new Error('The level number is invalid.');
      }
      const { error: cleanupError } = await admin.from('lesson_attempt_sessions')
        .delete()
        .lt('expires_at', new Date().toISOString());
      if (cleanupError) throw cleanupError;
      const { data, error } = await admin.from('lesson_attempt_sessions')
        .insert({ lesson_number: lessonNumber })
        .select('id')
        .single();
      if (error) throw error;
      return respond({ session_id: data.id });
    }

    if (body.action === 'start_training') {
      const questionId = body.question_id;
      if (typeof questionId !== 'string' || !answerKey[questionId]) throw new Error('The question is invalid.');
      const { error: cleanupError } = await admin.from('training_sessions')
        .delete()
        .lt('expires_at', new Date().toISOString());
      if (cleanupError) throw cleanupError;
      const { data, error } = await admin.from('training_sessions')
        .insert({ question_id: questionId })
        .select('id')
        .single();
      if (error) throw error;
      return respond({ session_id: data.id });
    }

    if (body.action === 'check_training') {
      const questionId = body.question_id;
      const sessionId = body.session_id;
      if (typeof questionId !== 'string' || !answerKey[questionId] || typeof sessionId !== 'string') {
        throw new Error('The training question is invalid.');
      }
      const { data: session, error: sessionError } = await admin.from('training_sessions')
        .select('question_id, wrong_attempts, correct_matches, completed_at, expires_at')
        .eq('id', sessionId)
        .maybeSingle();
      if (sessionError) throw sessionError;
      if (!session || session.question_id !== questionId
        || session.completed_at || Date.parse(session.expires_at) <= Date.now()) {
        throw new Error('This training question has expired. Start it again.');
      }
      const detail = answerKey[questionId];
      const pairAnswer = validateSingleResponse(questionId, body.answer);
      const correct = pairAnswer
        ? isCorrectPair(questionId, body.answer)
        : isCorrectAnswer(questionId, body.answer);
      if (correct) {
        const matchingAnswer = answerKey[questionId].answer;
        const correctMatches = Array.isArray(session.correct_matches) ? session.correct_matches : [];
        const isComplete = typeof matchingAnswer === 'string'
          || new Set([...correctMatches, body.answer.pair.left]).size === Object.keys(matchingAnswer).length;
        const update: { correct_matches?: string[]; completed_at?: string } = {};
        if (typeof matchingAnswer !== 'string') {
          update.correct_matches = [...new Set([...correctMatches, body.answer.pair.left])];
        }
        if (isComplete) update.completed_at = new Date().toISOString();
        const { error } = await admin.from('training_sessions').update(update).eq('id', sessionId);
        if (error) throw error;
        return respond({ correct: true, complete: isComplete, explanation: detail.explanation });
      }
      const { data: wrongAttempts, error } = await admin.rpc('record_training_mistake', {
        p_session_id: sessionId,
        p_question_id: questionId
      });
      if (error) throw error;
      const revealed = Number(wrongAttempts) >= 2;
      if (revealed) {
        const { error: completeError } = await admin.from('training_sessions')
          .update({ completed_at: new Date().toISOString() })
          .eq('id', sessionId);
        if (completeError) throw completeError;
      }
      return respond({
        correct: false,
        hint: 'Think about the key idea in the lesson summary, then try again.',
        revealed,
        answer: revealed ? detail.answer : undefined,
        explanation: revealed ? detail.explanation : undefined
      });
    }

    if (body.action === 'start_timed') {
      const { data, error } = await admin.from('timed_challenge_sessions')
        .insert({ user_id: userId })
        .select('id, started_at')
        .single();
      if (error) throw error;
      return respond({ session_id: data.id, started_at: data.started_at });
    }

    if (body.action === 'submit_timed') {
      if (typeof body.session_id !== 'string') throw new Error('The Timed Challenge session is invalid.');
      const { data: session, error: sessionError } = await admin.from('timed_challenge_sessions')
        .select('submitted_answers')
        .eq('id', body.session_id)
        .eq('user_id', userId)
        .maybeSingle();
      if (sessionError) throw sessionError;
      if (!session) throw new Error('Timed Challenge session was not found.');
      const answers = Object.entries(session.submitted_answers || {})
        .map(([question_id, answer]) => ({ question_id, answer }));
      const { answered, correct } = validateAnswers(answers, Object.keys(answerKey));
      const { data, error } = await admin.rpc('finish_timed_challenge', {
        p_user_id: userId,
        p_session_id: body.session_id,
        p_answered_questions: answered,
        p_correct_answers: correct
      });
      if (error) throw error;
      const profile = await syncProfile(admin, userId);
      return respond({ ...data, unlocked_cosmetics: profile.profile.unlocked_cosmetics });
    }

    if (body.action === 'submit_lesson') {
      const lessonNumber = Number(body.lesson_index);
      if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > 5) {
        throw new Error('The level number is invalid.');
      }
      if (typeof body.session_id !== 'string') throw new Error('The level attempt session is invalid.');
      const allowedQuestionIds = Object.keys(answerKey).filter(id => id.startsWith(`l${lessonNumber - 1}q`));
      if (allowedQuestionIds.length !== 10) throw new Error('The level question set is not configured.');
      const { data: session, error: sessionError } = await admin.from('lesson_attempt_sessions')
        .select('lesson_number, answers, completed_at, expires_at')
        .eq('id', body.session_id)
        .maybeSingle();
      if (sessionError) throw sessionError;
      if (!session || session.lesson_number !== lessonNumber || session.completed_at
        || Date.parse(session.expires_at) <= Date.now()) {
        throw new Error('The level attempt session has expired.');
      }
      const submitted = Object.entries(session.answers || {})
        .map(([question_id, answer]) => ({ question_id, answer }));
      const answers = validateAnswers(submitted, allowedQuestionIds);
      if (answers.answered !== allowedQuestionIds.length) throw new Error('Answer all ten level questions before submitting.');
      const { data: completedSession, error: completeError } = await admin.from('lesson_attempt_sessions')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', body.session_id)
        .is('completed_at', null)
        .select('id')
        .maybeSingle();
      if (completeError) throw completeError;
      if (!completedSession) throw new Error('This level attempt has already been submitted.');
      const { data, error } = await admin.rpc('record_lesson_attempt', {
        p_user_id: userId,
        p_lesson_number: lessonNumber,
        p_correct_answers: answers.correct
      });
      if (error) throw error;
      const profile = await syncProfile(admin, userId);
      return respond({ ...data, unlocked_cosmetics: profile.profile.unlocked_cosmetics });
    }

    if (body.action === 'sync_profile') return respond(await syncProfile(admin, userId));

    if (body.action === 'update_profile') {
      const displayName = typeof body.display_name === 'string' ? body.display_name.trim().replace(/\s+/g, ' ') : '';
      if (!displayName || displayName.length > 24) throw new Error('Display name must be 1 to 24 characters.');
      if (!/^((badge|flat)-[1-6])$/.test(body.avatar_id || '')) throw new Error('Choose one of the available avatars.');
      const current = await syncProfile(admin, userId);
      const equipped = { ...current.profile.equipped_cosmetics };
      const updates = body.cosmetics;
      if (updates && typeof updates === 'object') {
        const fields: Record<string, CosmeticField> = {
          nameColorId: 'nameColors',
          fontId: 'fonts',
          backgroundId: 'backgrounds',
          glowId: 'glows'
        };
        for (const [field, group] of Object.entries(fields)) {
          const optionId = updates[field];
          if (optionId === undefined) continue;
          if (!current.profile.unlocked_cosmetics[group].includes(optionId)) {
            throw new Error(`That ${group} style has not been unlocked yet.`);
          }
          const option = COSMETIC_RULES[group].find(item => item.id === optionId);
          if (!option) throw new Error('That leaderboard style is unavailable.');
          equipped[field] = optionId;
          equipped[group === 'nameColors' ? 'nameColor' : group === 'fonts' ? 'font' : group === 'backgrounds' ? 'background' : 'glow'] = option.value;
        }
      }
      const { error } = await admin.from('profiles')
        .update({ display_name: displayName, avatar_id: body.avatar_id, equipped_cosmetics: equipped })
        .eq('id', userId);
      if (error) throw error;
      const profile = await syncProfile(admin, userId);
      return respond(profile);
    }

    throw new Error('Unknown game action.');
  } catch (error) {
    console.error('Benchmark game function error:', error);
    return respond({ error: error instanceof Error ? error.message : 'The request could not be completed.' }, 400);
  }
});
