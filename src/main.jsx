import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowLeft, ArrowRight, BarChart3, CalendarDays, Check, ChevronRight,
  CircleUserRound, Dumbbell, Flame, Footprints, HeartPulse, LockKeyhole, Minus,
  Plus, RotateCcw, Ruler, Scale, Settings, ShieldCheck, Sparkles, Target, Timer,
  Trophy, Watch, X
} from 'lucide-react';
import './styles.css';

const iso = (d = new Date()) => d.toISOString().slice(0, 10);
const seedMeasurements = [
  { date: '2026-07-24', weight: 149.8, waist: 88 },
  { date: '2026-07-28', weight: 151.3, waist: 87 },
  { date: '2026-08-11', weight: 151.4, waist: 85.3 },
  { date: '2026-08-18', weight: 150.9, waist: 85.8 },
  { date: '2026-08-25', weight: 151.8, waist: 85.1 },
  { date: '2026-09-01', weight: 151.2, waist: 84.8 }
];
const baseWorkout = [
  { id: 1, name: '90–90 Breathing', prescription: '2 × 5 breaths', category: 'PREP', sets: [false, false], reps: [5, 5] },
  { id: 2, name: 'Glute Bridge', prescription: '2 × 10 · 3s hold', category: 'PREP', sets: [false, false], reps: [10, 10] },
  { id: 3, name: 'Dead Bug', prescription: '2 × 6 / side', category: 'PREP', sets: [false, false], reps: [6, 6] },
  { id: 4, name: 'Tempo Push-up', prescription: '3 × 8–12', category: 'PUSH', sets: [false, false, false], reps: [10, 10, 10] },
  { id: 5, name: 'Reverse Snow Angel', prescription: '3 × 10–15', category: 'PULL', sets: [false, false, false], reps: [12, 12, 12] },
  { id: 6, name: 'Bulgarian Split Squat', prescription: '3 × 8 / side', category: 'LEGS', sets: [false, false, false], reps: [8, 8, 8] },
  { id: 7, name: 'Hollow Body Hold', prescription: '3 × 20 sec', category: 'CORE', sets: [false, false, false], reps: [20, 20, 20] }
];
const skillData = [
  { name: 'Handstand', icon: 'HS', level: 2, accent: '#f4ff5b', progress: 46, next: 'Wall shoulder taps', stages: ['Pike hold', 'Wall handstand', 'Wall shoulder taps', 'Freestanding'] },
  { name: 'L-sit', icon: 'LS', level: 2, accent: '#7c6cff', progress: 58, next: 'One-leg L-sit', stages: ['Support hold', 'Tuck L-sit', 'One-leg L-sit', 'Full L-sit'] },
  { name: 'Planche', icon: 'PL', level: 1, accent: '#ff7a45', progress: 24, next: 'Tuck planche', stages: ['Planche lean', 'Tuck planche', 'Advanced tuck', 'Straddle'] },
  { name: 'Pistol squat', icon: 'PS', level: 2, accent: '#33d49d', progress: 67, next: 'Counterweight pistol', stages: ['Box pistol', 'Assisted pistol', 'Counterweight', 'Full pistol'] }
];
const initialHistory = [
  { date: '2026-08-25', type: 'Strength', duration: 48, complete: 1 },
  { date: '2026-08-27', type: 'Skills', duration: 24, complete: .8 },
  { date: '2026-08-29', type: 'Mobility', duration: 18, complete: 1 },
  { date: '2026-08-31', type: 'Strength', duration: 51, complete: 1 }
];
const health = { steps: 7248, exercise: 38, energy: 486, heartRate: 72, distance: 5.4, bodyMass: 151.2, workouts: 4 };

function useStored(key, fallback) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  });
  const save = (next) => { const v = typeof next === 'function' ? next(value) : next; setValue(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [value, save];
}

const MiniLine = ({ data, field, color }) => {
  const values = data.map(d => d[field]);
  const min = Math.min(...values), max = Math.max(...values);
  const pts = values.map((v, i) => `${8 + i * (284 / Math.max(values.length - 1, 1))},${78 - ((v - min) / (max - min || 1)) * 58}`).join(' ');
  return <svg viewBox="0 0 300 90" className="chart" role="img" aria-label={`${field} trend`}>
    <defs><linearGradient id={`g-${field}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".25"/><stop offset="1" stopColor={color} stopOpacity="0"/></linearGradient></defs>
    {[20,49,78].map(y => <line key={y} x1="8" x2="292" y1={y} y2={y} stroke="#252a2d" strokeWidth="1" />)}
    <polygon points={`8,86 ${pts} 292,86`} fill={`url(#g-${field})`} />
    <polyline points={pts} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {values.map((v, i) => <circle key={i} cx={8 + i * (284 / Math.max(values.length - 1, 1))} cy={78 - ((v-min)/(max-min||1))*58} r="3.5" fill="#0b0e10" stroke={color} strokeWidth="2" />)}
  </svg>;
};

function Topbar({ title, subtitle }) {
  return <header className="topbar"><div><div className="eyebrow">{subtitle}</div><h1>{title}</h1></div><button className="avatar" aria-label="Profile"><CircleUserRound size={22}/></button></header>;
}

function Dashboard({ setTab, workout, measurements, history }) {
  const done = workout.reduce((a,x)=>a+x.sets.filter(Boolean).length,0), total = workout.reduce((a,x)=>a+x.sets.length,0);
  const latest = measurements.at(-1);
  return <main><Topbar title="Ready, Josh?" subtitle="TUESDAY · SEPTEMBER 1" />
    <section className="hero card">
      <div className="hero-copy"><span className="pill lime">FULL BODY A</span><h2>Build strength.<br/>Own the movement.</h2><p>Posture-first strength · 42 min</p><button className="primary" onClick={()=>setTab('workout')}><Dumbbell size={18}/> Start workout</button></div>
      <div className="hero-ring"><div><b>{Math.round(done/total*100)||0}%</b><span>today</span></div></div>
    </section>
    <div className="section-head"><div><span className="eyebrow">TODAY</span><h2>Daily pulse</h2></div><button className="link" onClick={()=>setTab('health')}>Health details <ChevronRight size={16}/></button></div>
    <section className="metric-grid">
      <article className="metric card"><Footprints/><span>STEPS</span><b>{health.steps.toLocaleString()}</b><small>of 10,000</small><div className="bar"><i style={{width:'72%'}}/></div></article>
      <article className="metric card"><Flame/><span>ACTIVE ENERGY</span><b>{health.energy}</b><small>kcal</small><div className="bar orange"><i style={{width:'61%'}}/></div></article>
      <article className="metric card"><Timer/><span>EXERCISE</span><b>{health.exercise}</b><small>minutes</small><div className="bar purple"><i style={{width:'76%'}}/></div></article>
      <article className="metric card"><HeartPulse/><span>HEART RATE</span><b>{health.heartRate}</b><small>bpm resting</small><div className="spark">⌁⌁</div></article>
    </section>
    <section className="two-col">
      <article className="card compact"><div className="card-title"><div><span className="eyebrow">BODY TREND</span><h3>Moving well</h3></div><Scale className="muted"/></div><MiniLine data={measurements} field="weight" color="#f4ff5b"/><div className="split"><span><b>{latest.weight}</b> lb</span><span><b>{latest.waist}</b> cm waist</span></div></article>
      <article className="card compact streak"><div className="card-title"><div><span className="eyebrow">CONSISTENCY</span><h3>4-day streak</h3></div><Trophy color="#f4ff5b"/></div><div className="week-dots">{['M','T','W','T','F','S','S'].map((d,i)=><div key={i}><i className={i<4?'on':''}>{i<4?<Check size={14}/>:''}</i><span>{d}</span></div>)}</div><p>{history.length} sessions logged this month. Keep the chain alive.</p></article>
    </section>
  </main>;
}

function Workout({ workout, setWorkout, history, setHistory }) {
  const [seconds, setSeconds] = useState(0); const [running, setRunning] = useState(false);
  React.useEffect(()=>{ if(!running) return; const id=setInterval(()=>setSeconds(s=>s+1),1000); return()=>clearInterval(id); },[running]);
  const done=workout.reduce((a,x)=>a+x.sets.filter(Boolean).length,0), total=workout.reduce((a,x)=>a+x.sets.length,0);
  const toggle=(id,idx)=>setWorkout(workout.map(x=>x.id===id?{...x,sets:x.sets.map((s,i)=>i===idx?!s:s)}:x));
  const complete=()=>{ setHistory([...history,{date:iso(),type:'Strength',duration:Math.max(1,Math.round(seconds/60)),complete:done/total}]); setRunning(false); };
  return <main><Topbar title="Full Body A" subtitle="TODAY'S SESSION"/><section className="workout-summary card"><div><span className="eyebrow">PROGRESS</span><b>{done}<small> / {total} sets</small></b></div><div className="timer"><Timer size={18}/>{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</div><button className="ghost" onClick={()=>setRunning(!running)}>{running?'Pause':'Start timer'}</button></section>
    <div className="progress"><i style={{width:`${done/total*100}%`}}/></div>
    <div className="exercise-list">{workout.map((ex,n)=><article className="exercise card" key={ex.id}><div className="exercise-num">{String(n+1).padStart(2,'0')}</div><div className="exercise-main"><span className="eyebrow">{ex.category}</span><h3>{ex.name}</h3><p>{ex.prescription}</p><div className="sets">{ex.sets.map((checked,i)=><button key={i} onClick={()=>toggle(ex.id,i)} className={checked?'checked':''} aria-label={`Set ${i+1} ${checked?'complete':'incomplete'}`}><span>{checked?<Check size={16}/>:i+1}</span><b>{ex.reps[i]}</b><small>{ex.name.includes('Hold')?'SEC':'REPS'}</small></button>)}</div></div><ChevronRight className="muted" size={20}/></article>)}</div>
    <button className="primary sticky-action" disabled={!done} onClick={complete}><Check size={18}/> Finish session</button>
  </main>;
}

function Skills() {
  const [active,setActive]=useState(null);
  return <main><Topbar title="Skill lab" subtitle="CONTROL · BALANCE · POWER"/><p className="intro">Small, clean reps build extraordinary movement. Train skills fresh—before strength work.</p><section className="skill-grid">{skillData.map(s=><article className="skill-card card" key={s.name} onClick={()=>setActive(s)}><div className="skill-top"><div className="skill-glyph" style={{color:s.accent,borderColor:s.accent}}>{s.icon}</div><span>LEVEL {s.level}</span></div><h2>{s.name}</h2><p>Next: {s.next}</p><div className="bar" style={{'--accent':s.accent}}><i style={{width:`${s.progress}%`,background:s.accent}}/></div><footer><b>{s.progress}%</b><span>View progression <ChevronRight size={15}/></span></footer></article>)}</section>
    {active&&<div className="modal-wrap" onClick={()=>setActive(null)}><section className="modal card" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setActive(null)}><X/></button><span className="eyebrow">{active.name.toUpperCase()} PATH</span><h2>Master the foundations</h2><div className="stage-list">{active.stages.map((x,i)=><div className={i<active.level?'stage done':i===active.level?'stage current':'stage'} key={x}><i>{i<active.level?<Check size={16}/>:i+1}</i><div><b>{x}</b><span>{i<active.level?'Mastered':i===active.level?'Current focus':'Locked'}</span></div></div>)}</div><button className="primary full"><Target size={18}/> Log skill practice</button></section></div>}
  </main>;
}

function Calendar({ history }) {
  const days=Array.from({length:30},(_,i)=>i+1); const activeDays=new Map(history.map(x=>[Number(x.date.slice(-2)),x]));
  return <main><Topbar title="Training history" subtitle="SEPTEMBER 2026"/><section className="calendar card"><div className="month-nav"><button><ArrowLeft/></button><h2>September</h2><button><ArrowRight/></button></div><div className="dow">{['S','M','T','W','T','F','S'].map((x,i)=><span key={i}>{x}</span>)}</div><div className="month-grid"><i/><i/>{days.map(d=><button key={d} className={activeDays.has(d)?'trained':''}><span>{d}</span>{activeDays.has(d)&&<b/>}</button>)}</div></section><div className="section-head"><div><span className="eyebrow">LOG</span><h2>Recent sessions</h2></div></div><section className="history-list">{[...history].reverse().map((h,i)=><article className="card history" key={i}><div className="date-block"><b>{h.date.slice(-2)}</b><span>{new Date(h.date+'T12:00').toLocaleDateString('en',{month:'short'}).toUpperCase()}</span></div><div><h3>{h.type}</h3><p>{h.duration} min · {Math.round(h.complete*100)}% complete</p></div><div className="status"><Check size={15}/></div></article>)}</section></main>;
}

function ProgressPage({ measurements, setMeasurements }) {
  const [form,setForm]=useState({weight:'',waist:''}); const latest=measurements.at(-1);
  const add=()=>{if(!form.weight&&!form.waist)return;setMeasurements([...measurements,{date:iso(),weight:Number(form.weight)||latest.weight,waist:Number(form.waist)||latest.waist}]);setForm({weight:'',waist:''})};
  return <main><Topbar title="Body progress" subtitle="MEASURE THE TREND"/><section className="two-col progress-charts"><article className="card compact"><div className="card-title"><div><span className="eyebrow">WEIGHT</span><h2>{latest.weight} <small>lb</small></h2></div><Scale/></div><MiniLine data={measurements} field="weight" color="#f4ff5b"/><p className="trend-note"><Minus size={15}/> Stable across 6 weeks</p></article><article className="card compact"><div className="card-title"><div><span className="eyebrow">WAIST</span><h2>{latest.waist} <small>cm</small></h2></div><Ruler/></div><MiniLine data={measurements} field="waist" color="#7c6cff"/><p className="trend-note good">↓ 3.2 cm since July 24</p></article></section>
    <section className="card measurement-form"><span className="eyebrow">QUICK LOG</span><h2>Add today’s measurements</h2><div className="inputs"><label>Weight <div><input inputMode="decimal" placeholder={String(latest.weight)} value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})}/><span>lb</span></div></label><label>Waist <div><input inputMode="decimal" placeholder={String(latest.waist)} value={form.waist} onChange={e=>setForm({...form,waist:e.target.value})}/><span>cm</span></div></label></div><button className="primary" onClick={add}><Plus size={18}/> Save measurement</button><p><ShieldCheck size={15}/> Stored privately on this device.</p></section>
    <section className="entries"><div className="section-head"><h2>Entries</h2></div>{[...measurements].reverse().map((m,i)=><div className="entry" key={i}><span>{new Date(m.date+'T12:00').toLocaleDateString('en-CA',{month:'short',day:'numeric',year:'numeric'})}</span><b>{m.weight} lb</b><b>{m.waist} cm</b></div>)}</section>
  </main>;
}

function Health() {
  const [connected,setConnected]=useStored('form-health-connected',false); const metrics=[['Steps',health.steps.toLocaleString(),Footprints],['Exercise time',health.exercise+' min',Timer],['Active energy',health.energy+' kcal',Flame],['Heart rate',health.heartRate+' bpm',HeartPulse],['Distance',health.distance+' km',Activity],['Body mass',health.bodyMass+' lb',Scale],['Workouts',health.workouts,Watch]];
  return <main><Topbar title="Apple Health" subtitle="PRIVATE HEALTH SYNC"/><section className="health-hero card"><div className="apple-mark">♥</div><div><span className="eyebrow">HEALTHKIT COMPANION</span><h2>{connected?'Connected to iPhone':'Bring your activity together'}</h2><p>{connected?'Last synced today at 2:41 AM':'Install the included iOS companion, approve only the categories you want, and send encrypted summaries to this dashboard.'}</p></div><button className={connected?'ghost connected':'primary'} onClick={()=>setConnected(!connected)}>{connected?<><Check/> Connected</>:<><Watch/> Preview connection</>}</button></section>
    <section className="health-grid">{metrics.map(([name,value,Icon])=><article className="card health-metric" key={name}><Icon/><span>{name}</span><b>{value}</b></article>)}</section>
    <section className="card privacy"><LockKeyhole/><div><span className="eyebrow">PRIVACY BY DESIGN</span><h3>Your body, your data.</h3><p>The web app stores entries locally. The companion reads only approved HealthKit categories, creates daily summaries, and never writes back to Apple Health.</p></div></section>
    <section className="sync-steps"><h2>How sync works</h2>{[['1','Install companion','Open the included Xcode project on your iPhone.'],['2','Choose permissions','Apple displays each HealthKit category before access.'],['3','Sync summaries','The app prepares workout, activity, heart and body summaries for your private endpoint.']].map(x=><div key={x[0]}><i>{x[0]}</i><span><b>{x[1]}</b><small>{x[2]}</small></span></div>)}</section>
  </main>;
}

function App(){
  const [tab,setTab]=useState('home'); const [workout,setWorkout]=useStored('form-workout',baseWorkout); const [measurements,setMeasurements]=useStored('form-measurements',seedMeasurements); const [history,setHistory]=useStored('form-history',initialHistory);
  const pages={home:<Dashboard {...{setTab,workout,measurements,history}}/>,workout:<Workout {...{workout,setWorkout,history,setHistory}}/>,skills:<Skills/>,calendar:<Calendar history={history}/>,progress:<ProgressPage {...{measurements,setMeasurements}}/>,health:<Health/>};
  const nav=[['home','Today',Activity],['workout','Train',Dumbbell],['skills','Skills',Sparkles],['calendar','History',CalendarDays],['progress','Progress',BarChart3]];
  return <div className="app"><aside className="sidebar"><div className="brand"><i>F</i><span>FORM<small>MOVE WITH INTENT</small></span></div><nav>{nav.map(([id,label,Icon])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><Icon/><span>{label}</span></button>)}</nav><button className="health-link" onClick={()=>setTab('health')}><Watch/><span>Apple Health<small>Companion sync</small></span></button><div className="privacy-badge"><ShieldCheck/><span>Local-first<small>Private by default</small></span></div></aside><div className="content">{pages[tab]}</div><nav className="bottom-nav">{nav.map(([id,label,Icon])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><Icon/><span>{label}</span></button>)}</nav></div>;
}

createRoot(document.getElementById('root')).render(<App/>);
