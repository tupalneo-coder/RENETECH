import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { COSMETIC_RULES, getUnlockedCosmetics, type CosmeticField } from '../_shared/cosmetics.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

type MatchingAnswer = [string, string][];

const answerKey: Record<string, string | MatchingAnswer> = {
  l0q0: 'Occupational Health and Safety',
  l0q1: 'RA 11058',
  l0q2: 'False',
  l0q3: 'Power off and unplug the computer',
  l0q4: 'ground',
  l0q5: [['Handle a circuit board', 'Hold it by the edges'], ['Prepare to work inside a computer', 'Power off and unplug it'], ['Reduce static electricity', 'Ground yourself'], ['Remove dust', 'Use a brush or compressed air']],
  l0q6: 'False',
  l0q7: [['Liquid near components', 'Keep it away from the work area'], ['A component will not fit', 'Check alignment; never force it'], ['Dust on a computer', 'Clean with a brush or air'], ['Sensitive circuitry', 'Avoid touching it directly']],
  l0q8: 'never force',
  l0q9: 'Safety 1st',
  l1q0: 'Computer Assembler',
  l1q1: 'Network Technician',
  l1q2: 'Computer Service',
  l1q3: 'True',
  l1q4: 'Computer Maintenance Technician',
  l1q5: [['Computer Assembler', 'Produces components and assembles computer parts'], ['Network Technician', 'Builds and troubleshoots computer networks'], ['Computer Repairman', 'Diagnoses and repairs customer devices'], ['Computer Maintenance Technician', 'Supports day-to-day computer performance']],
  l1q6: 'True',
  l1q7: 'Computer Repairman',
  l1q8: 'diverse',
  l1q9: 'maintenance',
  l2q0: 'AVR',
  l2q1: 'CPU',
  l2q2: 'temporary',
  l2q3: 'Hard Disk Drive (HDD)',
  l2q4: 'Motherboard',
  l2q5: 'BIOS',
  l2q6: [['CPU', 'Processes instructions'], ['RAM', 'Holds temporary working data'], ['HDD', 'Stores files and programs'], ['Motherboard', 'Connects the computer components']],
  l2q7: 'Power Supply Unit (PSU)',
  l2q8: [['PS2 port', 'Connects a mouse or keyboard with a round plug'], ['HDMI', 'Carries digital video and audio'], ['SATA', 'Connects storage devices to the motherboard'], ['PSU', 'Converts AC into low-voltage DC']],
  l2q9: 'True',
  l3q0: 'Flowchart',
  l3q1: [['Terminator (oval)', 'Marks the start or end'], ['Diamond', 'Shows a decision branch'], ['Rectangle', 'Shows a process or action'], ['Parallelogram', 'Shows input or output']],
  l3q2: 'Diamond',
  l3q3: 'Rectangle (Process)',
  l3q4: 'parallelogram',
  l3q5: 'connector',
  l3q6: [['Flowchart', 'Steps in a process using symbols and arrows'], ['Schematic diagram', 'Abstract, symbolic system elements'], ['Layout plan', 'Equipment placement in a workplace'], ['Block diagram', 'High-level functional parts of a system']],
  l3q7: 'Layout Plan',
  l3q8: '8',
  l3q9: '0101',
  l4q0: 'Multiple computers connected to share resources and communicate with one another',
  l4q1: 'wireless',
  l4q2: [['Peer-to-Peer (P2P)', 'Each device can act as client and server'], ['Client/Server', 'A central server manages network services'], ['LAN', 'Covers a building or campus'], ['WAN', 'Connects networks across large geographic areas']],
  l4q3: 'An organized network with a central server managing everything',
  l4q4: 'Compresses/decompresses video or audio, such as for Zoom calls',
  l4q5: 'twisted',
  l4q6: 'A single building or campus',
  l4q7: 'The Internet',
  l4q8: [['Star topology', 'A central hub failure disrupts connected devices'], ['Bus topology', 'A break in the main cable can disrupt the network'], ['Ring topology', 'A break can interrupt the circular path'], ['Mesh topology', 'Multiple paths can provide alternate routes']],
  l4q9: 'A cable break disrupts the entire network'
};

const explanations: Record<string, string> = {
  l0q0: 'OHS means Occupational Health and Safety.',
  l0q1: 'Republic Act 11058 covers Occupational Safety and Health Standards.',
  l0q2: 'Safe work practices include having appropriate assistance.',
  l0q3: 'Disconnecting power reduces electrical and equipment risks.',
  l0q4: 'Grounding discharges static electricity that could damage components.',
  l0q5: 'Handle parts by their edges, disconnect power, ground yourself, and clean with a brush or air.',
  l0q6: 'Keep liquids away from the work area to prevent spills and damage.',
  l0q7: 'Keep liquids away, check component alignment, clean dust safely, and avoid touching sensitive circuitry.',
  l0q8: 'Check alignment and connections rather than forcing a component.',
  l0q9: 'Safety comes before speed, cost, or convenience.',
  l1q0: 'Computer assemblers produce components and assemble computer parts.',
  l1q1: 'Network technicians build and troubleshoot computer networks.',
  l1q2: 'Computer service technicians set up hardware and configure software and drivers.',
  l1q3: 'Technical support staff may install devices and software.',
  l1q4: 'Computer maintenance technicians support overall daily computer performance.',
  l1q5: 'CSS roles cover assembly, networking, repair, and computer maintenance.',
  l1q6: 'Network technicians are information technology professionals.',
  l1q7: 'Computer repairmen diagnose and repair customer devices.',
  l1q8: 'Computer maintenance work uses a diverse set of skills.',
  l1q9: 'Technical support staff handle maintenance, installation, and configuration.',
  l2q0: 'An AVR regulates voltage to help protect a computer from electrical changes.',
  l2q1: 'The CPU processes instructions and is commonly called the computer brain.',
  l2q2: 'RAM is temporary memory; its contents do not persist after power is off.',
  l2q3: 'An HDD is a main storage device for files.',
  l2q4: 'The motherboard is the main circuit board connecting computer parts.',
  l2q5: 'The BIOS ROM chip allows access to basic computer setup.',
  l2q6: 'The CPU processes, RAM holds working data, HDD stores files, and the motherboard connects components.',
  l2q7: 'The PSU converts alternating current to low-voltage direct current.',
  l2q8: 'PS2, HDMI, SATA, and PSU components each serve distinct connection or power roles.',
  l2q9: 'SATA connects storage devices such as hard drives and optical drives to the motherboard.',
  l3q0: 'A flowchart shows process steps using symbols and arrows.',
  l3q1: 'Flowchart symbols represent start/end, decisions, processes, and input/output.',
  l3q2: 'A diamond represents a decision, often with Yes/No branches.',
  l3q3: 'A rectangle represents a process or action.',
  l3q4: 'A parallelogram represents input and output in a flowchart.',
  l3q5: 'A small circle connects separated parts of a flowchart.',
  l3q6: 'Flowcharts show steps, schematics show symbolic elements, layout plans arrange equipment, and block diagrams show functional parts.',
  l3q7: 'A layout plan shows how equipment is arranged in a workplace.',
  l3q8: 'One byte is made up of 8 bits.',
  l3q9: 'Decimal 5 is 0101 in four-bit binary representation.',
  l4q0: 'A computer network connects devices so they can share resources and communicate.',
  l4q1: 'Wireless links do not use a physical network cable.',
  l4q2: 'Peer-to-peer devices share roles, client/server networks use a central server, LANs cover local areas, and WANs span large areas.',
  l4q3: 'A client/server network uses a central server to manage network services.',
  l4q4: 'A codec compresses and decompresses digital audio or video.',
  l4q5: 'Cat5e and Cat6 are twisted-pair cables.',
  l4q6: 'A LAN typically covers a limited local area such as a building or campus.',
  l4q7: 'The Internet is the largest WAN and relies on telecommunications infrastructure.',
  l4q8: 'Star, bus, ring, and mesh topologies have different failure risks and alternate paths.',
  l4q9: 'A break in the main bus cable can disrupt the entire network.'
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

function isCorrectAnswer(questionId: string, value: unknown) {
  const expected = answerKey[questionId];
  if (typeof expected === 'string') return normalizeAnswer(value) === normalizeAnswer(expected);
  if (!Array.isArray(expected)) return false;
  const matches = (value as { matches?: unknown } | null)?.matches;
  if (!Array.isArray(matches) || matches.length !== expected.length) return false;
  const expectedPairs = new Map<string, string>(expected);
  const matchedLeft = new Set<string>();
  const matchedRight = new Set<string>();
  let mistakes = 0;
  for (const match of matches) {
    if (!Array.isArray(match) || match.length !== 2
      || typeof match[0] !== 'string' || typeof match[1] !== 'string'
      || !expectedPairs.has(match[0]) || !expected.some(([, right]) => right === match[1])
      || matchedLeft.has(match[0]) || matchedRight.has(match[1])) return false;
    matchedLeft.add(match[0]);
    matchedRight.add(match[1]);
    if (expectedPairs.get(match[0]) !== match[1]) mistakes += 1;
  }
  return matchedLeft.size === expected.length && mistakes <= 1;
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

async function optionalUserId(request: Request, supabaseUrl: string, anonKey: string) {
  const authorization = request.headers.get('Authorization');
  if (!authorization) return null;
  const caller = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const { data, error } = await caller.auth.getUser();
  return error ? null : data.user?.id || null;
}

function shuffle<T>(values: T[]) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
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
    const userId = body.action === 'check_answer'
      ? null
      : await optionalUserId(request, supabaseUrl, anonKey);

    if (body.action === 'start_training') {
      const lessonNumber = Number(body.lesson_index);
      if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > 5) {
        throw new Error('The level number is invalid.');
      }
      const questionOrder = shuffle(Object.keys(answerKey).filter(id => id.startsWith(`l${lessonNumber - 1}q`)));
      if (questionOrder.length !== 10) throw new Error('The level question set is not configured.');
      const { data, error } = await admin.from('training_sessions')
        .insert({
          user_id: userId,
          lesson_index: lessonNumber,
          question_id: questionOrder[0],
          question_order: questionOrder
        })
        .select('id')
        .single();
      if (error) throw error;
      return respond({ session_id: data.id, question_order: questionOrder });
    }

    if (body.action === 'answer_training') {
      if (typeof body.session_id !== 'string' || typeof body.question_id !== 'string') {
        throw new Error('The training session or question is invalid.');
      }
      const { data: session, error } = await admin.from('training_sessions')
        .select('user_id, question_order, current_question, wrong_attempts, expires_at, completed_at')
        .eq('id', body.session_id)
        .maybeSingle();
      if (error) throw error;
      if (!session) throw new Error('The training session was not found. Start Train mode again.');
      if (session.user_id !== userId) throw new Error('This training session belongs to a different player.');
      if (session.completed_at) throw new Error('This training session is already complete.');
      if (new Date(session.expires_at).getTime() <= Date.now()) {
        throw new Error('This training session expired. Start Train mode again.');
      }
      if (!Array.isArray(session.question_order) || session.question_order.length !== 10) {
        throw new Error('The training session is invalid. Start Train mode again.');
      }
      const questionIndex = Number(session.current_question);
      const expectedQuestionId = session.question_order[questionIndex];
      if (body.question_id !== expectedQuestionId) throw new Error('Answer the current training question first.');
      const correct = isCorrectAnswer(expectedQuestionId, body.answer);
      const attempts = Number(session.wrong_attempts) + (correct ? 0 : 1);
      const advances = correct || attempts >= 2;
      const nextQuestion = questionIndex + (advances ? 1 : 0);
      const completed = advances && nextQuestion >= session.question_order.length;
      const update = await admin.from('training_sessions')
        .update({
          question_id: nextQuestion < session.question_order.length
            ? session.question_order[nextQuestion]
            : expectedQuestionId,
          current_question: nextQuestion,
          wrong_attempts: advances ? 0 : attempts,
          ...(completed ? { completed_at: new Date().toISOString() } : {})
        })
        .eq('id', body.session_id)
        .eq('current_question', questionIndex)
        .eq('wrong_attempts', Number(session.wrong_attempts))
        .is('completed_at', null)
        .select('id')
        .maybeSingle();
      if (update.error) throw update.error;
      if (!update.data) throw new Error('This answer was already submitted. Continue with the current question.');
      if (correct) {
        return respond({
          correct: true,
          explanation: explanations[expectedQuestionId],
          training_complete: completed
        });
      }
      if (!advances) {
        return respond({
          correct: false,
          attempts,
          hint: 'Compare the question with the key idea in the lesson, then reconsider the choices.'
        });
      }
      return respond({
        correct: false,
        revealed: true,
        answer: answerKey[expectedQuestionId],
        explanation: explanations[expectedQuestionId],
        training_complete: completed
      });
    }

    if (body.action === 'check_answer') {
      if (typeof body.question_id !== 'string' || !(body.question_id in answerKey)) {
        throw new Error('The question is invalid.');
      }
      const correct = isCorrectAnswer(body.question_id, body.answer);
      return respond({
        correct,
        answer: correct ? undefined : answerKey[body.question_id],
        explanation: explanations[body.question_id]
      });
    }

    if (!userId) throw new Error('Sign in to continue.');

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
      const { answered, correct } = validateAnswers(body.answers, Object.keys(answerKey));
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
      const allowedQuestionIds = Object.keys(answerKey).filter(id => id.startsWith(`l${lessonNumber - 1}q`));
      if (allowedQuestionIds.length !== 10) throw new Error('The level question set is not configured.');
      const answers = validateAnswers(body.answers, allowedQuestionIds);
      if (answers.answered !== allowedQuestionIds.length) throw new Error('Answer all ten level questions before submitting.');
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
