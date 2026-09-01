import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, BarChart3, CalendarDays, Check, CircleUserRound, Dumbbell, Flame, Footprints, HeartPulse, Plus, Ruler, Scale, ShieldCheck, Sparkles, Timer, Trophy, Watch } from 'lucide-react';
import './styles.css';

const iso = (d = new Date()) => d.toISOString().slice(0, 10);
const seedMeasurements = [
  { date: '2026-07-24', weight: 149.8, waist: 88 },
  { date: '2026-08-11', weight: 151.4, waist: 85.3 },
  { date: '2026-09-01', weight: 151.2, waist: 84.8 }
];
const baseWorkout = [
  { id: 1, name: '90–90 Breathing', prescription: '2 × 5 breaths', sets: [false, false] },
  { id: 2, name: 'Glute Bridge', prescription: '2 × 10 · 3s hold', sets: [false, false] },
  { id: 3, name: 'Dead Bug', prescription: '2 × 6 / side', sets: [false, false] },
  { id: 4, name: 'Tempo Push-up', prescription: '3 × 8–12', sets: [false, false, false] },
  { id: 5, name: 'Reverse Snow Angel', prescription: '3 × 10–15', sets: [false, false, false] },
  { id: 6, name: 'Bulgarian Split Squat', prescription: '3 × 8 / side', sets: [false, false, false] },
  { id: 7, name: 'Hollow Body Hold', prescription: '3 × 20 sec', sets: [false, false, false] }
];
const initialHistory = [
  { date: '2026-08-25', type: 'Strength', duration: 48 },
  { date: '2026-08-27', type: 'Skills', duration: 24 },
  { date: '2026-08-31', type: 'Strength', duration: 51 }
];
function useStored(key, fallback) {
  const [value, setValue] = useState(() => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } });
  const save = next => { const v = typeof next === 'function' ? next(value) : next; setValue(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [value, save];
}
const Topbar=({title,subtitle})=><header className="topbar"><div><span>{subtitle}</span><h1>{title}</h1></div><CircleUserRound/></header>;
function App(){
  const [tab,setTab]=useState('home');
  const [workout,setWorkout]=useStored('form-workout',baseWorkout);
  const [measurements,setMeasurements]=useStored('form-measurements',seedMeasurements);
  const [history,setHistory]=useStored('form-history',initialHistory);
  const done=workout.reduce((a,x)=>a+x.sets.filter(Boolean).length,0), total=workout.reduce((a,x)=>a+x.sets.length,0), latest=measurements.at(-1);
  const toggle=(id,i)=>setWorkout(workout.map(x=>x.id===id?{...x,sets:x.sets.map((s,n)=>n===i?!s:s)}:x));
  const finish=()=>setHistory([...history,{date:iso(),type:'Strength',duration:45}]);
  const addMeasurement=()=>setMeasurements([...measurements,{date:iso(),weight:latest.weight,waist:latest.waist}]);
  const Home=()=> <main><Topbar title="Ready, Josh?" subtitle="FORM · CALISTHENICS"/><section className="hero card"><span>FULL BODY A</span><h2>Build strength.<br/>Own the movement.</h2><p>Posture-first strength · bodyweight training</p><button onClick={()=>setTab('workout')}><Dumbbell/> Start workout</button></section><section className="grid"><article className="card"><Footprints/><small>STEPS</small><b>7,248</b></article><article className="card"><Flame/><small>ACTIVE ENERGY</small><b>486 kcal</b></article><article className="card"><Timer/><small>EXERCISE</small><b>38 min</b></article><article className="card"><HeartPulse/><small>RESTING HR</small><b>72 bpm</b></article></section><section className="card"><Trophy/><h2>{history.length} sessions logged</h2><p>Your progress is saved locally on this device.</p></section></main>;
  const Workout=()=> <main><Topbar title="Full Body A" subtitle={`${done} / ${total} SETS`}/><div className="list">{workout.map(ex=><article className="card exercise" key={ex.id}><div><h3>{ex.name}</h3><p>{ex.prescription}</p></div><div className="sets">{ex.sets.map((s,i)=><button className={s?'checked':''} onClick={()=>toggle(ex.id,i)} key={i}>{s?<Check/>:i+1}</button>)}</div></article>)}</div><button className="finish" onClick={finish}><Check/> Finish session</button></main>;
  const Skills=()=> <main><Topbar title="Skill lab" subtitle="CONTROL · BALANCE · POWER"/><section className="grid skills">{['Handstand','L-sit','Planche','Pistol squat'].map((x,i)=><article className="card" key={x}><Sparkles/><small>LEVEL {i<2?2:1}</small><h2>{x}</h2><p>Practice clean progressions before strength work.</p></article>)}</section></main>;
  const History=()=> <main><Topbar title="Training history" subtitle="SEPTEMBER 2026"/>{[...history].reverse().map((h,i)=><article className="card row" key={i}><CalendarDays/><div><h3>{h.type}</h3><p>{h.date} · {h.duration} min</p></div><Check/></article>)}</main>;
  const Progress=()=> <main><Topbar title="Body progress" subtitle="MEASURE THE TREND"/><section className="grid"><article className="card"><Scale/><small>WEIGHT</small><b>{latest.weight} lb</b></article><article className="card"><Ruler/><small>WAIST</small><b>{latest.waist} cm</b></article></section><button onClick={addMeasurement}><Plus/> Log today's measurement</button><section className="card"><ShieldCheck/><p>Measurements are stored privately in your browser.</p></section></main>;
  const Health=()=> <main><Topbar title="Apple Health" subtitle="COMPANION SYNC"/><section className="hero card"><Watch/><h2>HealthKit companion ready</h2><p>The included iOS companion can read approved Apple Health categories. GitHub Pages itself cannot directly access HealthKit.</p></section></main>;
  const pages={home:<Home/>,workout:<Workout/>,skills:<Skills/>,history:<History/>,progress:<Progress/>,health:<Health/>};
  const nav=[['home','Today',Activity],['workout','Train',Dumbbell],['skills','Skills',Sparkles],['history','History',CalendarDays],['progress','Progress',BarChart3],['health','Health',Watch]];
  return <div className="app"><aside><div className="brand">FORM<small>MOVE WITH INTENT</small></div>{nav.map(([id,label,Icon])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}><Icon/>{label}</button>)}</aside><div className="content">{pages[tab]}</div><nav className="bottom">{nav.slice(0,5).map(([id,label,Icon])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}><Icon/><small>{label}</small></button>)}</nav></div>;
}
createRoot(document.getElementById('root')).render(<App/>);
