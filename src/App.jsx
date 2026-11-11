import {createContext,useContext,useEffect,useRef,useState} from 'react'
import {HashRouter,Routes,Route,NavLink,Navigate,useNavigate,useSearchParams} from 'react-router-dom'
import {Home,Layers,Play,BookOpen,Terminal,BarChart3,Settings as Cog,Sun,Moon,Check,X,Copy,Clock,Leaf,Menu,Search} from 'lucide-react'
import {TOPICS,QUESTIONS} from './data/questions'
import {LEARN,SHELL} from './data/content'

const C=createContext(),KEY='mm-v1';
const def={att:0,ok:0,best:0,hist:[],done:[],theme:'dark'};
const load=()=>{try{return {...def,...JSON.parse(localStorage.getItem(KEY))}}catch{return def}};
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const mm=s=>`${Math.floor(Math.max(s,0)/60)}:${String(Math.max(s,0)%60).padStart(2,'0')}`;
const L='ABCD';

const hl=c=>c.split(/("[^"]*"|\$\w+|\b\d+\b|\b(?:db|show|use|dbs|collections)\b)/).map((p,i)=>/^"/.test(p)?<span key={i} className="hs">{p}</span>:/^\$/.test(p)?<span key={i} className="ho">{p}</span>:/^\d+$/.test(p)?<span key={i} className="hn">{p}</span>:/^(db|show|use|dbs|collections)$/.test(p)?<span key={i} className="hk">{p}</span>:p);

function Code({c}){const {say}=useContext(C);
 return <div className="cp"><pre className="code">{hl(c)}</pre><button className="btn sm ghost" onClick={()=>navigator.clipboard.writeText(c).then(()=>say('Copied!')).catch(()=>say('Copy failed'))}><Copy size={14}/> Copy</button></div>}

function Count({v}){const t=parseInt(v)||0,[n,setN]=useState(0);
 useEffect(()=>{let k=0;const id=setInterval(()=>{k++;setN(Math.round(t*k/20));if(k>=20)clearInterval(id)},25);return()=>clearInterval(id)},[t]);
 return <>{n}{String(v).endsWith('%')?'%':''}</>}

function Cats({q=''}){const nav=useNavigate(),{st}=useContext(C);
 return <div className="grid">{TOPICS.map((t,i)=>t.toLowerCase().includes(q.toLowerCase())&&<button key={i} className="glass card" onClick={()=>nav('/setup?t='+i)}><small>{String(i+1).padStart(2,'0')}</small><b>{t}</b><span>{QUESTIONS.filter(x=>x.topic===i).length} questions{st.done.includes(i)?' · ✓ completed':''}</span></button>)}</div>}

function Dash(){const {st}=useContext(C),nav=useNavigate(),acc=st.att?Math.round(st.ok/st.att*100):0;
 const S=[['Total Questions',QUESTIONS.length],['Attempted',st.att],['Correct',st.ok],['Incorrect',st.att-st.ok],['Accuracy',acc+'%'],['Best Score',st.best+'%']];
 return <div className="pg"><section className="hero glass"><div><span className="chip">Aptech Exam Prep</span><h1>Master MongoDB from <em>Beginner</em> to Intermediate</h1><p>Learn MongoDB. Practice Smart. Ace Your Aptech Exams. Prepare for modular examinations with practice mode, timed exams and instant explanations.</p><div className="row"><button className="btn" onClick={()=>nav('/learn')}>Start Learning</button><button className="btn ghost" onClick={()=>nav('/setup')}>Take Practice Test</button></div></div><div className="leaf"><i/><i/><i/><Leaf size={64}/></div></section>
 <div className="stats">{S.map(([k,v])=><div className="glass stat" key={k}><b><Count v={v}/></b><span>{k}</span></div>)}</div>
 <h2>Learning Categories</h2><Cats/></div>}

function Topics(){const [q,setQ]=useState('');
 return <div className="pg"><h1>Learning <em>Categories</em></h1><label className="srch"><Search size={16}/><input placeholder="Search topics..." value={q} onChange={e=>setQ(e.target.value)}/></label><Cats q={q}/></div>}

function Setup(){const {start}=useContext(C),[p]=useSearchParams();
 const [c,setC]=useState({mode:'practice',topic:p.get('t')??'all',level:'all',n:'10',random:true,mins:20});
 const set=(k,v)=>setC(o=>({...o,[k]:v})),quick=c.mode==='quick',ns=quick?['10','20','30']:['10','20','30','50','all'];
 const n=ns.includes(c.n)?c.n:'10';
 return <div className="pg"><h1>Quiz <em>Setup</em></h1><div className="glass form">
 <div className="seg">{[['practice','Practice'],['exam','Examination'],['quick','Quick Practice']].map(([k,t])=><button key={k} className={'btn '+(c.mode===k?'':'ghost')} onClick={()=>set('mode',k)}>{t}</button>)}</div>
 <label>Category<select value={c.topic} onChange={e=>set('topic',e.target.value)}><option value="all">All Topics</option>{TOPICS.map((t,i)=><option key={i} value={i}>{t}</option>)}</select></label>
 <label>Difficulty<select value={c.level} onChange={e=>set('level',e.target.value)}><option value="all">All Levels</option><option value="0">Beginner</option><option value="1">Intermediate</option></select></label>
 <label>Number of questions<select value={n} onChange={e=>set('n',e.target.value)}>{ns.map(x=><option key={x} value={x}>{x==='all'?'All Questions':x}</option>)}</select></label>
 {!quick&&<label>Question order<select value={c.random?'r':'s'} onChange={e=>set('random',e.target.value==='r')}><option value="r">Random</option><option value="s">Sequential</option></select></label>}
 {c.mode==='exam'&&<label>Timer (minutes)<input type="number" min="1" max="180" value={c.mins} onChange={e=>set('mins',Math.max(1,+e.target.value||1))}/></label>}
 <button className="btn" onClick={()=>start({...c,n})}>Start Quiz</button></div></div>}

function Quiz({s,finish}){
 const [i,setI]=useState(0),[ans,setAns]=useState({}),[left,setLeft]=useState(s.secs),end=useRef(false);
 const exam=s.mode==='exam',q=s.qs[i],a=ans[i],shown=!exam&&a!==undefined;
 const submit=()=>{if(end.current)return;end.current=true;finish(s,ans,Math.round((Date.now()-s.t0)/1000))};
 useEffect(()=>{if(!exam)return;const t=setInterval(()=>setLeft(l=>l-1),1000);return()=>clearInterval(t)},[exam]);
 useEffect(()=>{if(exam&&left<=0)submit()},[left]);
 const pick=k=>{if(shown)return;setAns(o=>({...o,[i]:k}))};
 return <div className="pg"><div className="qtop glass"><span>Question {i+1} of {s.qs.length} · {TOPICS[q.topic]} · {q.level?'Intermediate':'Beginner'}</span>{exam&&<span className={'tmr '+(left<60?'low':'')}><Clock size={16}/>{mm(left)}</span>}</div>
 <div className="bar"><i style={{width:Object.keys(ans).length/s.qs.length*100+'%'}}/></div>
 <div className="glass qcard" key={i}><h2>{q.q}</h2>
 {q.o.map((o,k)=>{let cls='opt';if(shown){if(o.ok)cls+=' good';else if(k===a)cls+=' bad'}else if(exam&&k===a)cls+=' sel';
  return <button key={k} className={cls} disabled={shown} onClick={()=>pick(k)}><b>{L[k]}</b><span>{o.t}</span>{shown&&o.ok&&<Check/>}{shown&&k===a&&!o.ok&&<X/>}</button>})}
 {shown&&<div className={'fb '+(a===q.a?'good':'bad')}><b>{a===q.a?'Correct Answer!':'Incorrect Answer!'}</b>{a!==q.a&&<p>Correct answer: {L[q.a]}. {q.o[q.a].t}</p>}<p>{q.e}</p></div>}</div>
 <div className="row between"><button className="btn ghost" disabled={!i} onClick={()=>setI(i-1)}>Previous</button>{i<s.qs.length-1?<button className="btn" onClick={()=>setI(i+1)}>Next</button>:<button className="btn" onClick={submit}>{exam?'Submit Examination':'Finish Quiz'}</button>}</div>
 <div className="pal glass">{s.qs.map((_,k)=><button key={k} className={(ans[k]!==undefined?'ans ':'')+(k===i?'cur':'')} onClick={()=>setI(k)}>{k+1}</button>)}{exam&&<button className="btn sm" onClick={submit}>Submit</button>}</div></div>}

function Results({r,start}){const nav=useNavigate(),[f,setF]=useState('all'),[p,setP]=useState(0);
 useEffect(()=>{const t=setTimeout(()=>setP(r?r.pct:0),60);return()=>clearTimeout(t)},[r]);
 if(!r)return <Navigate to="/progress"/>;
 const g=r.pct>=90?'Excellent!':r.pct>=80?'Very Good!':r.pct>=60?'Good Work!':'Keep Practicing!',R=2*Math.PI*52;
 const weak=[...new Set(r.qs.filter((q,i)=>r.ans[i]!==q.a).map(q=>q.topic))];
 const list=r.qs.map((q,i)=>({q,i,u:r.ans[i]})).filter(({q,u})=>f==='all'||(f==='ok'&&u===q.a)||(f==='bad'&&u!==undefined&&u!==q.a)||(f==='none'&&u===undefined));
 const S=[['Total',r.qs.length],['Attempted',r.att],['Correct',r.ok],['Incorrect',r.att-r.ok],['Unanswered',r.qs.length-r.att]];
 return <div className="pg"><div className="glass res"><div className="rn"><svg className="ring" viewBox="0 0 120 120"><circle className="bg" cx="60" cy="60" r="52"/><circle className="fg" cx="60" cy="60" r="52" strokeDasharray={R} strokeDashoffset={R*(1-p/100)}/></svg><b>{r.pct}%</b></div>
 <div><h1><em>{g}</em></h1><p>Time taken: {mm(r.time)} · Mode: {r.mode==='exam'?'Examination':'Practice'}</p><div className="row">{S.map(([k,v])=><span className="chip" key={k}>{k}: {v}</span>)}</div>
 <div className="row"><button className="btn" onClick={()=>start(r.cfg)}>Retake Quiz</button>{weak.length>0&&<button className="btn ghost" onClick={()=>start({...r.cfg,topics:weak,topic:'all',level:'all',n:'all'})}>Practice Weak Topics</button>}<button className="btn ghost" onClick={()=>setF('bad')}>Review Incorrect</button><button className="btn ghost" onClick={()=>nav('/')}>Dashboard</button></div></div></div>
 <h2>Answer Review</h2><div className="seg">{[['all','All'],['ok','Correct'],['bad','Incorrect'],['none','Unanswered']].map(([k,t])=><button key={k} className={'btn sm '+(f===k?'':'ghost')} onClick={()=>setF(k)}>{t}</button>)}</div><br/>
 {list.length===0&&<p>No questions in this filter.</p>}
 {list.map(({q,i,u})=><div key={i} className={'glass rv '+(u===undefined?'na':'')}><b>{i+1}. {q.q}</b><p>{u===undefined?'Unanswered':u===q.a?'✓ Correct':'✗ Incorrect'}</p>{q.o.map((o,k)=><div key={k} className={'opt '+(o.ok?'good':k===u?'bad':'')}><b>{L[k]}</b><span>{o.t}</span>{k===u&&<em>Your answer</em>}</div>)}<p>{q.e}</p></div>)}</div>}

function Learn(){return <div className="pg"><h1>MongoDB <em>Learning</em></h1>{LEARN.map(x=><div className="glass rv" key={x.t}><h3>{x.t}</h3><p><b>Definition:</b> {x.d}</p><p><b>Example:</b> {x.ex}</p><Code c={x.c}/><p><b>Exam points:</b> {x.p}</p></div>)}</div>}
function ShellRef(){return <div className="pg"><h1>Shell <em>Reference</em></h1><p>Educational examples only. Nothing runs against a real database.</p><br/>{SHELL.map(([c,d])=><div className="glass rv" key={c}><Code c={c}/><p>{d}</p></div>)}</div>}

function Progress(){const {st}=useContext(C);
 return <div className="pg"><h1>Your <em>Progress</em></h1><div className="stats"><div className="glass stat"><b>{st.att}</b><span>Attempted</span></div><div className="glass stat"><b>{st.ok}</b><span>Correct</span></div><div className="glass stat"><b>{st.best}%</b><span>Best score</span></div><div className="glass stat"><b>{st.done.length}/20</b><span>Topics completed</span></div></div>
 <h2>Quiz History</h2>{st.hist.length===0&&<p>No quizzes yet.</p>}{st.hist.map((h,i)=><div className="glass rv" key={i}><b>{h.pct}%</b> · {h.ok}/{h.n} correct · {h.m} · {new Date(h.d).toLocaleString()}</div>)}</div>}

function Prefs(){const {st,setSt,say}=useContext(C),[ask,setAsk]=useState(false);
 return <div className="pg"><h1><em>Settings</em></h1><div className="glass form"><button className="btn" onClick={()=>setSt(p=>({...p,theme:p.theme==='dark'?'light':'dark'}))}>Switch to {st.theme==='dark'?'light':'dark'} theme</button><button className="btn ghost" onClick={()=>setAsk(true)}>Reset Progress</button></div>
 {ask&&<div className="modal"><div className="glass"><h3>Reset all progress?</h3><p>This deletes your scores and history.</p><div className="row"><button className="btn" onClick={()=>{setSt({...def,theme:st.theme});setAsk(false);say('Progress reset')}}>Yes, reset</button><button className="btn ghost" onClick={()=>setAsk(false)}>Cancel</button></div></div></div>}</div>}

const NAV=[['/','Dashboard',Home],['/categories','Topics',Layers],['/setup','Quiz',Play],['/learn','Learn',BookOpen],['/shell','Shell',Terminal],['/progress','Progress',BarChart3],['/settings','Settings',Cog]];

function Shell(){const nav=useNavigate(),[st,setSt]=useState(load),[sess,setSess]=useState(null),[res,setRes]=useState(null),[toast,setToast]=useState(''),[open,setOpen]=useState(false);
 useEffect(()=>{localStorage.setItem(KEY,JSON.stringify(st));document.documentElement.dataset.theme=st.theme},[st]);
 const say=m=>{setToast(m);setTimeout(()=>setToast(''),2200)};
 const start=c=>{const quick=c.mode==='quick';
  let pool=QUESTIONS.filter(q=>(c.topics?c.topics.includes(q.topic):c.topic==='all'||q.topic===+c.topic)&&(c.level==='all'||q.level===+c.level));
  if(c.random||quick)pool=shuf(pool);
  pool=pool.slice(0,c.n==='all'?pool.length:+c.n);
  if(!pool.length)return say('No questions match these settings');
  const qs=pool.map(q=>{const o=shuf(q.o.map((t,k)=>({t,ok:k===0})));return {...q,o,a:o.findIndex(x=>x.ok)}});
  setRes(null);setSess({mode:quick?'practice':c.mode,qs,secs:(c.mins||20)*60,t0:Date.now(),cfg:c});nav('/quiz')};
 const finish=(s,ans,time)=>{const ok=s.qs.filter((q,i)=>ans[i]===q.a).length,att=Object.keys(ans).length,pct=Math.round(ok/s.qs.length*100);
  setSt(p=>({...p,att:p.att+att,ok:p.ok+ok,best:Math.max(p.best,pct),hist:[{d:Date.now(),m:s.mode,n:s.qs.length,ok,pct},...p.hist].slice(0,30),done:pct>=60?[...new Set([...p.done,...s.qs.map(q=>q.topic)])]:p.done}));
  setRes({...s,ans,time,ok,att,pct});setSess(null);nav('/results')};
 return <C.Provider value={{st,setSt,start,say}}><div className="aurora"/>
 <aside className={'side glass '+(open?'open':'')} onClick={()=>setOpen(false)}><div className="logo"><Leaf/>MongoDB Mastery</div>{NAV.map(([to,t,I])=><NavLink key={to} to={to} end><I size={18}/>{t}</NavLink>)}</aside>
 <main><header className="top glass"><button className="ib burger" onClick={()=>setOpen(!open)}><Menu/></button><b>Learn. Practice. Ace.</b><button className="ib" onClick={()=>setSt(p=>({...p,theme:p.theme==='dark'?'light':'dark'}))}>{st.theme==='dark'?<Sun/>:<Moon/>}</button></header>
 <Routes><Route path="/" element={<Dash/>}/><Route path="/categories" element={<Topics/>}/><Route path="/setup" element={<Setup/>}/>
 <Route path="/quiz" element={sess?<Quiz key={sess.t0} s={sess} finish={finish}/>:<Navigate to="/setup"/>}/><Route path="/results" element={<Results r={res} start={start}/>}/>
 <Route path="/learn" element={<Learn/>}/><Route path="/shell" element={<ShellRef/>}/><Route path="/progress" element={<Progress/>}/><Route path="/settings" element={<Prefs/>}/><Route path="*" element={<Navigate to="/"/>}/></Routes></main>
 {toast&&<div className="toast glass">{toast}</div>}</C.Provider>}

export default function App(){return <HashRouter><Shell/></HashRouter>}
