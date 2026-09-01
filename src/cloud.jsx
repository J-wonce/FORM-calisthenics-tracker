import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, BarChart3, CalendarDays, Check, ChevronLeft, ChevronRight, Dumbbell, Flame, History, LockKeyhole, LogOut, Pencil, Plus, Ruler, Save, Scale, ShieldCheck, Sparkles, Target, Trash2, Trophy, Upload, X } from 'lucide-react';
import { supabase } from './supabase';
import './styles.css';

const iso = (date = new Date()) => { const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); };
const blankSets = exercises => exercises.map(ex => ({ ...ex, sets: ex.sets.map(() => false) }));
const starterWorkout = [
  { id: 1, name: '90–90 Breathing', prescription: '2 × 5 breaths', category: 'PREP', sets: [false, false], reps: [5, 5] },
  { id: 2, name: 'Glute Bridge', prescription: '2 × 10 · 3s hold', category: 'PREP', sets: [false, false], reps: [10, 10] },
  { id: 3, name: 'Dead Bug', prescription: '2 × 6 / side', category: 'PREP', sets: [false, false], reps: [6, 6] },
  { id: 4, name: 'Tempo Push-up', prescription: '3 × 8–12', category: 'PUSH', sets: [false, false, false], reps: [10, 10, 10] },
  { id: 5, name: 'Reverse Snow Angel', prescription: '3 × 10–15', category: 'PULL', sets: [false, false, false], reps: [12, 12, 12] },
  { id: 6, name: 'Bulgarian Split Squat', prescription: '3 × 8 / side', category: 'LEGS', sets: [false, false, false], reps: [8, 8, 8] },
  { id: 7, name: 'Hollow Body Hold', prescription: '3 × 20 sec', category: 'CORE', sets: [false, false, false], reps: [20, 20, 20] }
];
const starterSkills = [
  { name: 'Handstand', icon: 'HS', level: 2, progress: 46, next: 'Wall shoulder taps', stages: ['Pike hold', 'Wall handstand', 'Wall shoulder taps', 'Freestanding'], accent: '#f4ff5b' },
  { name: 'L-sit', icon: 'LS', level: 2, progress: 58, next: 'One-leg L-sit', stages: ['Support hold', 'Tuck L-sit', 'One-leg L-sit', 'Full L-sit'], accent: '#7c6cff' },
  { name: 'Planche', icon: 'PL', level: 1, progress: 24, next: 'Tuck planche', stages: ['Planche lean', 'Tuck planche', 'Advanced tuck', 'Straddle'], accent: '#ff7a45' },
  { name: 'Pistol squat', icon: 'PS', level: 2, progress: 67, next: 'Counterweight pistol', stages: ['Box pistol', 'Assisted pistol', 'Counterweight', 'Full pistol'], accent: '#33d49d' }
];
const defaultRoutines = [
  { id: 'day-1', name: 'Day 1 — Handstand + Push', shortName: 'Handstand + Push', weekdays: [1], exercises: [
    { id: 101, name: 'Wall handstand', prescription: '3 × 20–40 sec', category: 'SKILL', sets: [false, false, false], reps: [30, 30, 30] },
    { id: 102, name: 'Wall handstand weight shifts', prescription: '3 × 5 / side', category: 'SKILL', sets: [false, false, false], reps: [5, 5, 5] },
    { id: 103, name: 'Freestanding handstand attempts', prescription: '5–10 min', category: 'SKILL', sets: [false], reps: [10] },
    { id: 104, name: 'Push-ups', prescription: '3 × 10–15', category: 'STRENGTH', sets: [false, false, false], reps: [12, 12, 12] },
    { id: 105, name: 'Pike push-ups', prescription: '3 × 6–10', category: 'STRENGTH', sets: [false, false, false], reps: [8, 8, 8] },
    { id: 106, name: 'Diamond push-ups', prescription: '2 × 8–12', category: 'STRENGTH', sets: [false, false], reps: [10, 10] },
    { id: 107, name: 'Planche leans', prescription: '3 × 10–20 sec', category: 'STRENGTH', sets: [false, false, false], reps: [15, 15, 15] },
    { id: 108, name: 'Hollow-body hold', prescription: '3 × 20–30 sec', category: 'CORE', sets: [false, false, false], reps: [25, 25, 25] },
    { id: 109, name: 'Reverse plank', prescription: '2 × 30 sec', category: 'CORE', sets: [false, false], reps: [30, 30] }
  ]},
  { id: 'day-2', name: 'Day 2 — Legs + L-Sit', shortName: 'Legs + L-Sit', weekdays: [3], exercises: [
    { id: 201, name: 'Floor L-sit / tuck support', prescription: '4 × 10–20 sec', category: 'SKILL', sets: [false, false, false, false], reps: [15, 15, 15, 15] },
    { id: 202, name: 'Pistol-squat progression', prescription: '3 × 5 / leg', category: 'SKILL', sets: [false, false, false], reps: [5, 5, 5] },
    { id: 203, name: 'Split squat', prescription: '3 × 8–12 / leg', category: 'STRENGTH', sets: [false, false, false], reps: [10, 10, 10] },
    { id: 204, name: 'Single-leg RDL', prescription: '3 × 10 / leg', category: 'STRENGTH', sets: [false, false, false], reps: [10, 10, 10] },
    { id: 205, name: 'Reverse lunges', prescription: '3 × 10 / leg', category: 'STRENGTH', sets: [false, false, false], reps: [10, 10, 10] },
    { id: 206, name: 'Single-leg glute bridge', prescription: '3 × 12 / leg', category: 'STRENGTH', sets: [false, false, false], reps: [12, 12, 12] },
    { id: 207, name: 'Calf raises', prescription: '3 × 20', category: 'STRENGTH', sets: [false, false, false], reps: [20, 20, 20] },
    { id: 208, name: 'Leg raises', prescription: '3 × 10–15', category: 'CORE', sets: [false, false, false], reps: [12, 12, 12] },
    { id: 209, name: 'Side plank', prescription: '2 × 30 sec / side', category: 'CORE', sets: [false, false], reps: [30, 30] }
  ]},
  { id: 'day-3', name: 'Day 3 — Full-Body Skill + Athletic', shortName: 'Full-Body Athletic', weekdays: [5], exercises: [
    { id: 301, name: 'Handstand practice', prescription: '5–10 min', category: 'SKILL', sets: [false], reps: [10] },
    { id: 302, name: 'Frog stand', prescription: '3 × 15–30 sec', category: 'SKILL', sets: [false, false, false], reps: [20, 20, 20] },
    { id: 303, name: 'Planche lean', prescription: '3 × 10–20 sec', category: 'SKILL', sets: [false, false, false], reps: [15, 15, 15] },
    { id: 304, name: 'Archer push-up progression', prescription: '3 × 5–8 / side', category: 'STRENGTH', sets: [false, false, false], reps: [6, 6, 6] },
    { id: 305, name: 'Pike push-ups', prescription: '3 × 8–12', category: 'STRENGTH', sets: [false, false, false], reps: [10, 10, 10] },
    { id: 306, name: 'Pistol-squat progression', prescription: '3 × 5–8 / leg', category: 'STRENGTH', sets: [false, false, false], reps: [6, 6, 6] },
    { id: 307, name: 'Hamstring walkouts', prescription: '3 × 8–12', category: 'STRENGTH', sets: [false, false, false], reps: [10, 10, 10] },
    { id: 308, name: 'Superman lat pulls', prescription: '3 × 12–15', category: 'STRENGTH', sets: [false, false, false], reps: [12, 12, 12] },
    { id: 309, name: 'Athletic conditioning circuit', prescription: '3 rounds', category: 'CONDITIONING', sets: [false, false, false], reps: [1, 1, 1] }
  ]}
];
const routineForDate = (routines, date) => routines.find(r => r.weekdays.includes(new Date(date + 'T12:00').getDay())) || routines[0];
const nextScheduledRoutine = routines => { for (let i = 0; i < 15; i++) { const date = new Date(); date.setDate(date.getDate() + i); const routine = routines.find(r => r.weekdays.includes(date.getDay())); if (routine) return { routine, date: iso(date) }; } return null; };

function Auth() {
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [message, setMessage] = useState('');
  const signIn = async event => { event.preventDefault(); setMessage('Signing in…'); const { error } = await supabase.auth.signInWithPassword({ email, password }); setMessage(error ? error.message : ''); };
  return <div className="auth-shell"><section className="auth-card card"><div className="brand auth-brand"><i>B</i><span>Big D Energy<small>PERSONAL TRAINING LOG</small></span></div><LockKeyhole className="auth-lock" /><span className="eyebrow">PRIVATE ACCESS</span><h1>Your training log</h1><p>Sign in to continue. This lock keeps your workout history private and synchronized across your devices.</p><form onSubmit={signIn} className="auth-form"><label>Email<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label><button className="primary" type="submit"><ShieldCheck size={18} /> Sign in</button></form>{message && <p className="form-message">{message}</p>}</section></div>;
}

function Dashboard({ history, measurements, plan, routines, onNavigate }) {
  const todayRow = history.find(x => x.session_date === iso() && !x.details?.apple_health);
  const todayDone = todayRow?.details?.workout?.reduce((sum, ex) => sum + ex.sets.filter(Boolean).length, 0) || 0;
  const todayTotal = todayRow?.details?.workout?.reduce((sum, ex) => sum + ex.sets.length, 0) || plan.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completed = history.filter(x => x.details?.completed);
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 29);
  const last30 = completed.filter(x => x.session_date >= iso(cutoff));
  const setCount = last30.reduce((sum, row) => sum + (row.details?.workout?.reduce((n, ex) => n + ex.sets.filter(Boolean).length, 0) || 0), 0);
  const latest = measurements.at(-1);
  const previous = measurements.at(-2);
  const week = Array.from({ length: 7 }, (_, index) => { const d = new Date(); d.setDate(d.getDate() - (6 - index)); return iso(d); });
  const trained = new Set(completed.map(x => x.session_date));
  const recent = completed.slice(0, 3);
  const upcoming = nextScheduledRoutine(routines);
  return <>
    <section className="dashboard-hero card"><div><span className="pill lime">TODAY'S TRAINING</span><h2>{todayRow?.details?.completed ? 'Workout logged.' : todayDone ? 'Keep the momentum.' : 'Ready when you are.'}</h2><p>{todayDone} of {todayTotal} sets completed today</p><button className="primary" onClick={() => onNavigate('train')}><Dumbbell size={18} /> {todayDone ? 'Continue workout' : 'Start workout'}</button></div><div className="dashboard-ring" style={{ '--value': `${Math.round((todayDone / todayTotal || 0) * 360)}deg` }}><span><b>{Math.round((todayDone / todayTotal || 0) * 100)}%</b><small>TODAY</small></span></div></section>
    {upcoming && <button className="next-routine card" onClick={() => onNavigate('train')}><div><span className="eyebrow">UP NEXT · {new Date(upcoming.date + 'T12:00').toLocaleDateString('en-CA', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}</span><h3>{upcoming.routine.name}</h3><p>{upcoming.routine.exercises.length} exercises · repeats weekly</p></div><ChevronRight /></button>}
    <section className="dashboard-metrics">
      <article className="card"><History /><span>LAST 30 DAYS</span><b>{last30.length}</b><small>workouts completed</small></article>
      <article className="card"><Target /><span>TRAINING VOLUME</span><b>{setCount}</b><small>sets completed</small></article>
      <article className="card"><Scale /><span>LATEST WEIGHT</span><b>{latest?.weight || '—'}</b><small>{latest?.weight ? 'lb' : 'no entry yet'}</small></article>
      <article className="card"><Ruler /><span>LATEST WAIST</span><b>{latest?.waist || '—'}</b><small>{latest?.waist ? 'cm' : 'no entry yet'}</small></article>
    </section>
    <section className="dashboard-grid">
      <article className="card dashboard-panel"><div className="card-title"><div><span className="eyebrow">CONSISTENCY</span><h2>This week</h2></div><Trophy /></div><div className="week-dots">{week.map(date => <div key={date}><i className={trained.has(date) ? 'on' : ''}>{trained.has(date) && <Check size={14} />}</i><span>{new Date(date + 'T12:00').toLocaleDateString('en', { weekday: 'narrow' })}</span></div>)}</div><p>{week.filter(date => trained.has(date)).length} training days in the last seven days.</p></article>
      <article className="card dashboard-panel"><div className="card-title"><div><span className="eyebrow">BODY TREND</span><h2>Latest measurements</h2></div><BarChart3 /></div>{latest ? <div className="body-summary"><div><span>WEIGHT</span><b>{latest.weight || '—'} <small>lb</small></b>{previous?.weight && latest.weight ? <em className={latest.weight <= previous.weight ? 'good' : ''}>{(latest.weight - previous.weight).toFixed(1)} since last</em> : null}</div><div><span>WAIST</span><b>{latest.waist || '—'} <small>cm</small></b>{previous?.waist && latest.waist ? <em className={latest.waist <= previous.waist ? 'good' : ''}>{(latest.waist - previous.waist).toFixed(1)} since last</em> : null}</div></div> : <div className="empty-inline">Add your first weight or waist entry.</div>}<button className="link" onClick={() => onNavigate('progress')}>View body progress <ChevronRight /></button></article>
    </section>
    <div className="section-head"><div><span className="eyebrow">HISTORY</span><h2>Recent workouts</h2></div><button className="link" onClick={() => onNavigate('history')}>View all <ChevronRight /></button></div>
    <section className="history-list">{recent.length ? recent.map(row => <article className="card history" key={row.id}><div className="date-block"><b>{row.session_date.slice(-2)}</b><span>{new Date(row.session_date + 'T12:00').toLocaleDateString('en', { month: 'short' }).toUpperCase()}</span></div><div><h3>{row.session_type || 'Workout'}</h3><p>{Math.round((row.completion || 0) * 100)}% complete · {row.details?.workout?.reduce((sum, ex) => sum + ex.sets.filter(Boolean).length, 0) || 0} sets</p></div><div className="status"><Check size={15} /></div></article>) : <div className="empty-state card"><Flame /><h3>Your progress starts here</h3><p>Complete a workout and it will appear on your dashboard.</p></div>}</section>
  </>;
}

function App() {
  const [session, setSession] = useState(null), [loading, setLoading] = useState(true), [tab, setTab] = useState('home');
  const [selectedDate, setSelectedDate] = useState(iso()), [routines, setRoutines] = useState(defaultRoutines), [activeRoutineId, setActiveRoutineId] = useState(defaultRoutines[0].id), [plan, setPlan] = useState(defaultRoutines[0].exercises), [dailyWorkout, setDailyWorkout] = useState(blankSets(defaultRoutines[0].exercises));
  const [dailyRowId, setDailyRowId] = useState(null), [dailyComplete, setDailyComplete] = useState(false), [skills, setSkills] = useState(starterSkills);
  const [measurements, setMeasurements] = useState([]), [history, setHistory] = useState([]), [status, setStatus] = useState('');

  useEffect(() => { supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); }); const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => setSession(next)); return () => subscription.unsubscribe(); }, []);
  useEffect(() => { if (session) loadAll(); }, [session?.user?.id]);
  useEffect(() => { if (session && !loading) { const scheduled = routineForDate(routines, selectedDate); setActiveRoutineId(scheduled.id); setPlan(scheduled.exercises); loadDay(selectedDate, scheduled.exercises, history); } }, [selectedDate, routines]);

  const loadAll = async () => {
    setStatus('Syncing…'); const uid = session.user.id;
    const [wp, sp, ms, hs] = await Promise.all([
      supabase.from('workout_plans').select('*').in('name', ['FORM Routine Schedule', 'Full Body A']),
      supabase.from('skill_progress').select('*').order('name'), supabase.from('measurements').select('*').order('measured_on'),
      supabase.from('workout_sessions').select('*').order('session_date', { ascending: false })
    ]);
    if (wp.error || sp.error || ms.error || hs.error) { setStatus('Sync error'); return; }
    const scheduleRow = wp.data?.find(x => x.name === 'FORM Routine Schedule');
    let loadedRoutines = scheduleRow?.exercises?.routines;
    if (!Array.isArray(loadedRoutines)) { loadedRoutines = defaultRoutines; await supabase.from('workout_plans').insert({ user_id: uid, name: 'FORM Routine Schedule', exercises: { routines: loadedRoutines } }); }
    loadedRoutines = loadedRoutines.map(r => ({ ...r, exercises: blankSets(r.exercises) }));
    const scheduled = routineForDate(loadedRoutines, selectedDate);
    setRoutines(loadedRoutines); setActiveRoutineId(scheduled.id); setPlan(scheduled.exercises);
    if (sp.data.length) setSkills(sp.data.map(x => ({ name: x.name, icon: x.icon, level: x.level, progress: x.progress, next: x.next_step, stages: x.stages, accent: x.accent })));
    else await supabase.from('skill_progress').insert(starterSkills.map(x => ({ user_id: uid, name: x.name, icon: x.icon, level: x.level, progress: x.progress, next_step: x.next, stages: x.stages, accent: x.accent })));
    setMeasurements(ms.data.map(x => ({ id: x.id, date: x.measured_on, weight: x.weight_lb == null ? '' : Number(x.weight_lb), waist: x.waist_cm == null ? '' : Number(x.waist_cm) })));
    setHistory(hs.data); loadDay(selectedDate, scheduled.exercises, hs.data); setStatus('Synced');
  };
  const loadDay = (date, currentPlan = plan, rows = history) => { const row = rows.find(item => item.session_date === date && !item.details?.apple_health); setDailyRowId(row?.id || null); setDailyComplete(Boolean(row?.details?.completed)); setDailyWorkout(row?.details?.workout || blankSets(currentPlan)); };
  const saveDay = async (nextWorkout, completed = dailyComplete) => {
    setDailyWorkout(nextWorkout); setStatus('Saving…'); const done = nextWorkout.reduce((sum, ex) => sum + ex.sets.filter(Boolean).length, 0); const total = nextWorkout.reduce((sum, ex) => sum + ex.sets.length, 0);
    const activeRoutine = routines.find(r => r.id === activeRoutineId);
    const payload = { user_id: session.user.id, session_date: selectedDate, session_type: activeRoutine?.shortName || 'Strength', completion: total ? done / total : 0, details: { workout: nextWorkout, routine_id: activeRoutineId, routine_name: activeRoutine?.name, completed, completed_at: completed ? new Date().toISOString() : null } };
    const result = dailyRowId ? await supabase.from('workout_sessions').update(payload).eq('id', dailyRowId).select().single() : await supabase.from('workout_sessions').insert(payload).select().single();
    if (result.error) { setStatus('Save failed'); return; }
    setDailyRowId(result.data.id); setDailyComplete(completed); setHistory(current => [result.data, ...current.filter(x => x.id !== result.data.id)].sort((a, b) => b.session_date.localeCompare(a.session_date))); setStatus('Synced');
  };
  const toggleSet = (exerciseIndex, setIndex) => saveDay(dailyWorkout.map((ex, i) => i === exerciseIndex ? { ...ex, sets: ex.sets.map((checked, j) => j === setIndex ? !checked : checked) } : ex), false);
  const chooseRoutine = id => { const routine = routines.find(r => r.id === id); if (!routine || dailyRowId) return; setActiveRoutineId(id); setPlan(routine.exercises); setDailyWorkout(blankSets(routine.exercises)); };
  const clearDay = async () => { if (dailyRowId) await supabase.from('workout_sessions').delete().eq('id', dailyRowId); setHistory(current => current.filter(x => x.id !== dailyRowId)); setDailyRowId(null); setDailyComplete(false); setDailyWorkout(blankSets(plan)); setStatus('Synced'); };
  const saveRoutines = async next => { const clean = next.map(r => ({ ...r, exercises: blankSets(r.exercises) })); setRoutines(clean); const active = clean.find(r => r.id === activeRoutineId) || clean[0]; if (active) setPlan(active.exercises); setStatus('Saving…'); const { error } = await supabase.from('workout_plans').upsert({ user_id: session.user.id, name: 'FORM Routine Schedule', exercises: { routines: clean } }, { onConflict: 'user_id,name' }); setStatus(error ? 'Save failed' : 'Synced'); };
  const saveSkill = async (index, next) => { setSkills(current => current.map((x, i) => i === index ? next : x)); setStatus('Saving…'); const { error } = await supabase.from('skill_progress').upsert({ user_id: session.user.id, name: next.name, icon: next.icon, level: Number(next.level), progress: Number(next.progress), next_step: next.next, stages: next.stages, accent: next.accent }, { onConflict: 'user_id,name' }); setStatus(error ? 'Save failed' : 'Synced'); };
  const addSkill = async () => {
    const name = window.prompt('What skill do you want to track?')?.trim();
    if (!name || skills.some(x => x.name.toLowerCase() === name.toLowerCase())) return;
    const next = { name, icon: name.split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase(), level: 0, progress: 0, next: 'Choose your first progression', stages: ['Foundation', 'Developing', 'Strong', 'Mastered'], accent: '#f4ff5b' };
    setStatus('Saving…');
    const { error } = await supabase.from('skill_progress').insert({ user_id: session.user.id, name: next.name, icon: next.icon, level: next.level, progress: next.progress, next_step: next.next, stages: next.stages, accent: next.accent });
    if (!error) setSkills(current => [...current, next]);
    setStatus(error ? 'Save failed' : 'Synced');
  };
  const addMeasurement = async () => { const previous = measurements.at(-1) || {}; const { data, error } = await supabase.from('measurements').upsert({ user_id: session.user.id, measured_on: iso(), weight_lb: previous.weight || null, waist_cm: previous.waist || null }, { onConflict: 'user_id,measured_on' }).select().single(); if (!error) setMeasurements(current => [...current.filter(x => x.date !== iso()), { id: data.id, date: data.measured_on, weight: data.weight_lb == null ? '' : Number(data.weight_lb), waist: data.waist_cm == null ? '' : Number(data.waist_cm) }].sort((a, b) => a.date.localeCompare(b.date))); };
  const saveMeasurement = async item => { setMeasurements(current => current.map(x => x.id === item.id ? item : x)); const { error } = await supabase.from('measurements').update({ weight_lb: item.weight === '' ? null : Number(item.weight), waist_cm: item.waist === '' ? null : Number(item.waist) }).eq('id', item.id); setStatus(error ? 'Save failed' : 'Synced'); };
  const deleteMeasurement = async id => { setStatus('Deleting…'); const { error } = await supabase.from('measurements').delete().eq('id', id); if (!error) setMeasurements(current => current.filter(x => x.id !== id)); setStatus(error ? 'Delete failed' : 'Synced'); };
  const importHealthData = async file => {
    setStatus('Importing…');
    try {
      const payload = JSON.parse(await file.text());
      if (!Array.isArray(payload.measurements) || !Array.isArray(payload.workouts)) throw new Error('This is not a FORM health import file.');
      const existingByDate = new Map(measurements.map(x => [x.date, x]));
      const grouped = new Map();
      for (const record of payload.measurements) {
        const date = record.start.slice(0, 10), current = grouped.get(date) || existingByDate.get(date) || { weight: '', waist: '' };
        if (record.kind === 'body_mass') current.weight = record.unit === 'kg' ? record.value * 2.2046226218 : record.value;
        if (record.kind === 'waist') current.waist = record.unit === 'm' ? record.value * 100 : record.value;
        grouped.set(date, current);
      }
      for (const [date, item] of grouped) await supabase.from('measurements').upsert({ user_id: session.user.id, measured_on: date, weight_lb: item.weight === '' ? null : Number(item.weight.toFixed(2)), waist_cm: item.waist === '' ? null : Number(item.waist.toFixed(2)) }, { onConflict: 'user_id,measured_on' });
      const imported = new Set(history.map(x => x.details?.health_import_id).filter(Boolean));
      const workoutRows = payload.workouts.filter(x => !imported.has(`${x.activity}:${x.start}`)).map(x => ({
        user_id: session.user.id, session_date: x.start.slice(0, 10), session_type: x.activity.replace(/([a-z])([A-Z])/g, '$1 $2'), completion: 1,
        details: { completed: true, apple_health: true, health_import_id: `${x.activity}:${x.start}`, start: x.start, end: x.end, duration: x.duration, duration_unit: x.duration_unit, distance: x.distance, distance_unit: x.distance_unit, energy: x.energy, energy_unit: x.energy_unit, source: x.source }
      }));
      if (workoutRows.length) { const { error } = await supabase.from('workout_sessions').insert(workoutRows); if (error) throw error; }
      await loadAll();
      return `Imported ${grouped.size} measurement dates and ${workoutRows.length} workouts.`;
    } catch (error) { setStatus('Import failed'); throw error; }
  };
  const completedSessions = useMemo(() => history.filter(x => x.details?.completed), [history]);
  const done = dailyWorkout.reduce((sum, ex) => sum + ex.sets.filter(Boolean).length, 0), total = dailyWorkout.reduce((sum, ex) => sum + ex.sets.length, 0);

  if (loading) return <div className="loading">Loading FORM…</div>; if (!session) return <Auth />;
  const nav = [['home', 'Today', Activity], ['train', 'Train', Dumbbell], ['history', 'History', CalendarDays], ['skills', 'Skills', Sparkles], ['progress', 'Progress', BarChart3], ['routine', 'Routine', Save]];
  return <div className="app"><aside className="sidebar"><div className="brand"><i>F</i><span>FORM<small>PERSONAL TRAINING LOG</small></span></div><nav>{nav.map(([id, label, Icon]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon /><span>{label}</span></button>)}</nav><div className="privacy-badge"><ShieldCheck /><span>{status || 'Private'}<small>Cloud synchronized</small></span></div><button className="health-link" onClick={() => supabase.auth.signOut()}><LogOut /><span>Lock FORM</span></button></aside><div className="content"><main>
    <header className="topbar"><div><div className="eyebrow">PRIVATE · SINGLE USER · {status || 'READY'}</div><h1>{tab === 'home' ? 'Your progress' : tab === 'train' ? 'Daily workout' : tab === 'history' ? 'Training history' : tab === 'skills' ? 'Skill progress' : tab === 'progress' ? 'Body progress' : 'Edit routine'}</h1></div><ShieldCheck className="top-lock" /></header>
    {tab === 'home' && <Dashboard history={history} measurements={measurements} plan={plan} routines={routines} onNavigate={setTab} />}
    {tab === 'train' && <><section className="date-toolbar card"><button onClick={() => { const d = new Date(selectedDate + 'T12:00'); d.setDate(d.getDate() - 1); setSelectedDate(iso(d)); }}><ChevronLeft /></button><label><span>WORKOUT DATE</span><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} /></label><button disabled={selectedDate >= iso()} onClick={() => { const d = new Date(selectedDate + 'T12:00'); d.setDate(d.getDate() + 1); setSelectedDate(iso(d)); }}><ChevronRight /></button></section><label className="routine-select card"><span className="eyebrow">ROUTINE FOR THIS DAY</span><select value={activeRoutineId} disabled={Boolean(dailyRowId)} onChange={e => chooseRoutine(e.target.value)}>{routines.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>{dailyRowId && <small>Clear this day before switching its routine.</small>}</label><section className="workout-summary card"><div><span className="eyebrow">SETS COMPLETED</span><b>{done}<small> / {total}</small></b></div><div className={`session-state ${dailyComplete ? 'complete' : ''}`}>{dailyComplete ? <><Check /> Logged</> : `${Math.round((done / total || 0) * 100)}%`}</div></section><div className="progress"><i style={{ width: `${(done / total || 0) * 100}%` }} /></div><div className="exercise-list">{dailyWorkout.map((ex, i) => <article className="exercise card" key={ex.id}><div className="exercise-num">{String(i + 1).padStart(2, '0')}</div><div className="exercise-main"><span className="eyebrow">{ex.category}</span><h3>{ex.name}</h3><p>{ex.prescription}</p><div className="sets">{ex.sets.map((checked, j) => <button className={checked ? 'checked' : ''} key={j} onClick={() => toggleSet(i, j)}><span>{checked ? <Check size={16} /> : j + 1}</span><b>{ex.reps[j]}</b><small>REPS</small></button>)}</div></div></article>)}</div><div className="workout-actions"><button className="ghost danger" disabled={!dailyRowId} onClick={clearDay}><Trash2 size={17} /> Clear day</button><button className="primary" disabled={!done} onClick={() => saveDay(dailyWorkout, true)}><Check size={18} /> {dailyComplete ? 'Update session' : 'Finish & log session'}</button></div></>}
    {tab === 'history' && <HistoryPage history={history} completed={completedSessions} routines={routines} onOpen={date => { setSelectedDate(date); setTab('train'); }} />}
    {tab === 'skills' && <><div className="skill-actions"><button className="primary" onClick={addSkill}><Plus /> Add skill</button></div><section className="skill-grid">{skills.map((skill, i) => <article className="skill-card card" key={skill.name}><div className="skill-top"><div className="skill-glyph" style={{ color: skill.accent, borderColor: skill.accent }}>{skill.icon}</div><span>LEVEL <input type="number" min="0" max={skill.stages.length} value={skill.level} onChange={e => saveSkill(i, { ...skill, level: e.target.value })} /></span></div><h2>{skill.name}</h2><label>Progress %<input type="number" min="0" max="100" value={skill.progress} onChange={e => saveSkill(i, { ...skill, progress: e.target.value })} /></label><label>Current focus<input value={skill.next} onChange={e => saveSkill(i, { ...skill, next: e.target.value })} /></label><div className="bar"><i style={{ width: `${skill.progress}%`, background: skill.accent }} /></div></article>)}</section></>}
    {tab === 'progress' && <ProgressPage measurements={measurements} addMeasurement={addMeasurement} saveMeasurement={saveMeasurement} deleteMeasurement={deleteMeasurement} importHealthData={importHealthData} />}
    {tab === 'routine' && <RoutineEditor routines={routines} saveRoutines={saveRoutines} />}
  </main></div><nav className="bottom-nav">{nav.map(([id, label, Icon]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon /><span>{label}</span></button>)}</nav></div>;
}

function HistoryPage({ history, completed, routines, onOpen }) {
  const [month, setMonth] = useState(() => iso().slice(0, 7)); const first = new Date(month + '-01T12:00'); const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate(), offset = first.getDay();
  const rows = history.filter(x => x.session_date.startsWith(month)), byDate = new Map(rows.map(x => [x.session_date, x]));
  const move = amount => { const d = new Date(first); d.setMonth(d.getMonth() + amount); setMonth(iso(d).slice(0, 7)); };
  return <><section className="history-stats"><article className="card"><History /><b>{completed.length}</b><span>Total sessions</span></article><article className="card"><Dumbbell /><b>{completed.reduce((sum, x) => sum + (x.details?.workout?.reduce((n, ex) => n + ex.sets.filter(Boolean).length, 0) || 0), 0)}</b><span>Completed sets</span></article></section><section className="calendar card"><div className="month-nav"><button onClick={() => move(-1)}><ChevronLeft /></button><h2>{first.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}</h2><button onClick={() => move(1)}><ChevronRight /></button></div><div className="calendar-legend"><span><i className="scheduled-dot" />Scheduled</span><span><i className="complete-dot" />Completed</span></div><div className="dow">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x, i) => <span key={i}>{x}</span>)}</div><div className="month-grid">{Array.from({ length: offset }, (_, i) => <i key={`blank-${i}`} />)}{Array.from({ length: days }, (_, i) => { const date = `${month}-${String(i + 1).padStart(2, '0')}`, row = byDate.get(date), scheduled = routines.find(r => r.weekdays.includes(new Date(date + 'T12:00').getDay())); return <button key={date} title={scheduled?.name} className={row ? row.details?.completed ? 'trained' : 'draft-day' : scheduled ? 'scheduled-day' : ''} onClick={() => onOpen(date)}><span>{i + 1}</span>{(row || scheduled) && <b />}</button>; })}</div></section><div className="section-head"><div><span className="eyebrow">DAILY RECORDS</span><h2>Sessions and drafts</h2></div></div><section className="history-list">{rows.length ? rows.map(row => <button className="card history history-button" key={row.id} onClick={() => onOpen(row.session_date)}><div className="date-block"><b>{row.session_date.slice(-2)}</b><span>{new Date(row.session_date + 'T12:00').toLocaleDateString('en', { month: 'short' }).toUpperCase()}</span></div><div><h3>{row.details?.apple_health ? row.session_type : row.details?.completed ? row.details?.routine_name || 'Completed workout' : 'Workout in progress'}</h3><p>{row.details?.apple_health ? `${Math.round(row.details.duration || 0)} min · Apple Health` : `${Math.round((row.completion || 0) * 100)}% · ${row.details?.workout?.reduce((sum, ex) => sum + ex.sets.filter(Boolean).length, 0) || 0} sets`}</p></div><div className={`status ${row.details?.completed ? '' : 'draft-status'}`}>{row.details?.completed ? <Check size={15} /> : <Save size={15} />}</div></button>) : <div className="empty-state card"><CalendarDays /><h3>No workouts this month</h3><p>Scheduled routine days still appear on the calendar above.</p></div>}</section></>;
}

function ProgressPage({ measurements, addMeasurement, saveMeasurement, deleteMeasurement, importHealthData }) {
  const [editing, setEditing] = useState(null), [draft, setDraft] = useState(null), [message, setMessage] = useState('');
  const beginEdit = item => { setEditing(item.id); setDraft({ ...item }); };
  const save = async () => { await saveMeasurement(draft); setEditing(null); setDraft(null); };
  const remove = async item => { if (!window.confirm(`Remove the measurement from ${item.date}?`)) return; await deleteMeasurement(item.id); };
  const importFile = async event => { const file = event.target.files?.[0]; if (!file) return; setMessage('Importing Apple Health records…'); try { setMessage(await importHealthData(file)); } catch (error) { setMessage(error.message || 'Import failed.'); } event.target.value = ''; };
  return <>
    <section className="progress-actions"><button className="primary" onClick={addMeasurement}><Plus /> Add today</button><label className="ghost import-button"><Upload size={17} /> Import Apple Health<input type="file" accept="application/json,.json" onChange={importFile} /></label></section>
    {message && <div className="import-message card"><ShieldCheck />{message}</div>}
    <section className="entries measurement-list">{[...measurements].reverse().map(item => {
      const isEditing = editing === item.id, shown = isEditing ? draft : item;
      return <article className="entry measurement-entry card" key={item.id}><span className="measurement-date">{item.date}</span><label><Scale size={14} /><input disabled={!isEditing} inputMode="decimal" value={shown.weight} onChange={e => setDraft({ ...draft, weight: e.target.value })} /> lb</label><label><Ruler size={14} /><input disabled={!isEditing} inputMode="decimal" value={shown.waist} onChange={e => setDraft({ ...draft, waist: e.target.value })} /> cm</label><div className="entry-actions">{isEditing ? <><button className="icon-button save-entry" onClick={save} aria-label="Save measurement"><Check /></button><button className="icon-button" onClick={() => { setEditing(null); setDraft(null); }} aria-label="Cancel editing"><X /></button></> : <><button className="icon-button" onClick={() => beginEdit(item)} aria-label="Edit measurement"><Pencil /></button><button className="icon-button delete-entry" onClick={() => remove(item)} aria-label="Delete measurement"><Trash2 /></button></>}</div></article>;
    })}</section>
  </>;
}

function RoutineEditor({ routines, saveRoutines }) {
  const [activeId, setActiveId] = useState(routines[0]?.id);
  const active = routines.find(r => r.id === activeId) || routines[0];
  useEffect(() => { if (!routines.some(r => r.id === activeId)) setActiveId(routines[0]?.id); }, [routines, activeId]);
  if (!active) return <div className="empty-state card"><Dumbbell /><h3>No routines yet</h3></div>;
  const update = changes => saveRoutines(routines.map(r => r.id === active.id ? { ...r, ...changes } : r));
  const editExercise = (index, key, value) => update({ exercises: active.exercises.map((ex, i) => i === index ? { ...ex, [key]: value } : ex) });
  const changeSets = (index, count) => { const size = Math.max(1, Math.min(10, Number(count) || 1)); update({ exercises: active.exercises.map((ex, i) => i === index ? { ...ex, sets: Array.from({ length: size }, (_, n) => ex.sets[n] || false), reps: Array.from({ length: size }, (_, n) => ex.reps[n] || ex.reps.at(-1) || 10) } : ex) }); };
  const addRoutine = () => { const name = window.prompt('Name this routine day:')?.trim(); if (!name) return; const next = { id: `routine-${Date.now()}`, name, shortName: name, weekdays: [], exercises: [] }; saveRoutines([...routines, next]); setActiveId(next.id); };
  const removeRoutine = () => { if (routines.length === 1 || !window.confirm(`Delete “${active.name}”?`)) return; saveRoutines(routines.filter(r => r.id !== active.id)); };
  return <><p className="intro">Group exercises into routine days, then choose which weekdays each routine repeats. Scheduled days appear in History and the next workout appears on your dashboard.</p>
    <div className="routine-tabs">{routines.map(r => <button key={r.id} className={r.id === active.id ? 'active' : ''} onClick={() => setActiveId(r.id)}><span>{r.name}</span><small>{r.weekdays.length ? r.weekdays.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(' · ') : 'Not scheduled'}</small></button>)}<button className="add-routine-tab" onClick={addRoutine}><Plus /> New day</button></div>
    <section className="routine-settings card"><div><span className="eyebrow">ROUTINE NAME</span><input className="routine-name" value={active.name} onChange={e => update({ name: e.target.value, shortName: e.target.value.replace(/^Day \d+\s*[—-]\s*/, '') })} /></div><button className="icon-button delete-entry" disabled={routines.length === 1} onClick={removeRoutine}><Trash2 /></button><div className="weekday-picker"><span className="eyebrow">REPEAT WEEKLY</span><div>{['S','M','T','W','T','F','S'].map((label, day) => <button key={day} className={active.weekdays.includes(day) ? 'active' : ''} onClick={() => update({ weekdays: active.weekdays.includes(day) ? active.weekdays.filter(x => x !== day) : [...active.weekdays, day].sort() })}>{label}</button>)}</div></div></section>
    <div className="section-head"><div><span className="eyebrow">{active.exercises.length} EXERCISES</span><h2>{active.shortName}</h2></div></div><div className="exercise-list">{active.exercises.map((ex, i) => <article className="exercise card routine-row" key={ex.id}><div className="exercise-num">{String(i + 1).padStart(2, '0')}</div><div className="exercise-main"><input value={ex.category} onChange={e => editExercise(i, 'category', e.target.value)} /><h3><input value={ex.name} onChange={e => editExercise(i, 'name', e.target.value)} /></h3><input value={ex.prescription} onChange={e => editExercise(i, 'prescription', e.target.value)} /><label className="set-count">Sets <input type="number" min="1" max="10" value={ex.sets.length} onChange={e => changeSets(i, e.target.value)} /></label></div><button className="close" onClick={() => update({ exercises: active.exercises.filter((_, index) => index !== i) })}><Trash2 size={18} /></button></article>)}</div><button className="primary add-routine" onClick={() => update({ exercises: [...active.exercises, { id: Date.now(), name: 'New exercise', prescription: '3 × 10', category: 'CUSTOM', sets: [false, false, false], reps: [10, 10, 10] }] })}><Plus /> Add exercise</button></>;
}

createRoot(document.getElementById('root')).render(<App />);
