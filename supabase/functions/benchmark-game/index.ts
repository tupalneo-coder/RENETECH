import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { COSMETIC_RULES, getUnlockedCosmetics, type CosmeticField } from '../_shared/cosmetics.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const answerKey: Record<string, string | number[][]> = {
  l0q0: 'Occupational Health and Safety',
  l0q1: 'RA 11058',
  l0q2: 'False',
  l0q3: 'Power off and unplug the computer',
  l0q4: 'ground',
  l0q5: [[0, 0], [1, 1], [2, 2], [3, 3]],
  l0q6: 'False',
  l0q7: [[0, 0], [1, 1], [2, 2], [3, 3]],
  l0q8: 'never force',
  l0q9: 'Safety 1st',
  l1q0: 'Computer Assembler',
  l1q1: 'Network Technician',
  l1q2: 'Computer Service',
  l1q3: 'True',
  l1q4: 'Computer Maintenance Technician',
  l1q5: [[0, 0], [1, 1], [2, 2], [3, 3]],
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
  l2q6: [[0, 0], [1, 1], [2, 2], [3, 3]],
  l2q7: 'Power Supply Unit (PSU)',
  l2q8: [[0, 0], [1, 1], [2, 2], [3, 3]],
  l2q9: 'True',
  l3q0: 'Flowchart',
  l3q1: [[0, 0], [1, 1], [2, 2], [3, 3]],
  l3q2: 'Diamond',
  l3q3: 'Rectangle (Process)',
  l3q4: 'parallelogram',
  l3q5: 'connector',
  l3q6: [[0, 0], [1, 1], [2, 2], [3, 3]],
  l3q7: 'Layout Plan',
  l3q8: '8',
  l3q9: '0101',
  l4q0: 'Multiple computers connected to share resources and communicate with one another',
  l4q1: 'wireless',
  l4q2: [[0, 0], [1, 1], [2, 2], [3, 3]],
  l4q3: 'An organized network with a central server managing everything',
  l4q4: 'Compresses/decompresses video or audio, such as for Zoom calls',
  l4q5: 'twisted',
  l4q6: 'A single building or campus',
  l4q7: 'The Internet',
  l4q8: [[0, 0], [1, 1], [2, 2], [3, 3]],
  l4q9: 'A cable break disrupts the entire network'
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
  if (!Array.isArray(matches) || matches.length > expected.length + 20) return false;
  const rightPairs = new Set<number>();
  let mistakes = 0;
  for (const match of matches) {
    if (!Array.isArray(match) || match.length !== 2
      || !Number.isInteger(match[0]) || !Number.isInteger(match[1])
      || match[0] < 0 || match[0] >= expected.length
      || match[1] < 0 || match[1] >= expected.length) return false;
    if (match[0] !== match[1]) mistakes += 1;
    else {
      if (rightPairs.has(match[0])) return false;
      rightPairs.add(match[0]);
    }
  }
  return rightPairs.size === expected.length && mistakes <= 1;
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
    const authorization = request.headers.get('Authorization');
    if (!authorization) throw new Error('Sign in to continue.');
    const caller = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { autoRefreshToken: false, persistSession: false }
    });
    const { data: userResult, error: authError } = await caller.auth.getUser();
    if (authError || !userResult.user) throw new Error('Your sign-in session is invalid. Sign in again.');

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    const body = await request.json();
    const userId = userResult.user.id;

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
