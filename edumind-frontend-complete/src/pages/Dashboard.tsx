import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, CalendarDays, CheckCircle2, Clock3, FileText, MessageCircle, Sparkles, Target, TrendingUp } from "lucide-react";
import { api } from "../api/axios";
import { useAuthStore } from "../store/authStore";

type Doc = { _id?: string; title?: string; subject?: string; status?: string; fileName?: string };

const features = [
  {to:"/tutor", icon:MessageCircle, title:"AI Tutor", text:"Ask doubts and get step-by-step explanations."},
  {to:"/quizzes", icon:Brain, title:"Quiz Generator", text:"Create topic-wise MCQs with AI."},
  {to:"/study-planner", icon:CalendarDays, title:"Study Planner", text:"Organize your study time and goals."},
  {to:"/progress", icon:TrendingUp, title:"Progress", text:"Track your learning and quiz performance."},
  {to:"/documents", icon:FileText, title:"Study Materials", text:"Manage your notes and learning resources."},
  {to:"/career", icon:Target, title:"Career Guidance", text:"Explore skills and a practical learning path."}
];

export default function Dashboard(){
  const user=useAuthStore(s=>s.user); const [docs,setDocs]=useState<Doc[]>([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{api.get("/documents").then(r=>setDocs(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false));},[]);
  const first=(user?.name||"Student").split(" ")[0];
  return <div>
    <div className="hero">
      <div><span className="eyebrow">STUDENT DASHBOARD</span><h1>Welcome back, {first} <span>👋</span></h1><p>Continue learning and make progress today.</p></div>
      <Link className="primary-btn" to="/tutor"><Sparkles size={17}/> Ask AI Tutor</Link>
    </div>
    <div className="stats-grid">
      <div className="stat-card"><div className="stat-icon teal"><FileText/></div><div><span>Study Materials</span><strong>{loading?"—":docs.length}</strong></div></div>
      <div className="stat-card"><div className="stat-icon purple"><Brain/></div><div><span>Quiz Sessions</span><strong>0</strong></div></div>
      <div className="stat-card"><div className="stat-icon orange"><Clock3/></div><div><span>Study Hours</span><strong>0h</strong></div></div>
      <div className="stat-card"><div className="stat-icon green"><CheckCircle2/></div><div><span>Goals Completed</span><strong>0</strong></div></div>
    </div>
    <div className="section-head"><div><h2>Learning tools</h2><p>Everything you need in one place.</p></div></div>
    <div className="feature-grid">{features.map(({to,icon:Icon,title,text})=><Link to={to} className="feature-card" key={to}><div className="feature-icon"><Icon/></div><div><h3>{title}</h3><p>{text}</p></div><ArrowRight className="feature-arrow" size={18}/></Link>)}</div>
    <div className="dashboard-bottom">
      <div className="panel"><div className="panel-head"><div><h3>Recent materials</h3><p>Your latest learning resources.</p></div><Link to="/documents">View all</Link></div>
        {docs.length?docs.slice(0,4).map(d=><div className="list-row" key={d._id}><div className="row-icon"><FileText size={17}/></div><div><b>{d.title||d.fileName||"Untitled document"}</b><small>{d.subject||"General"} · {d.status||"READY"}</small></div></div>):<div className="empty"><FileText size={28}/><b>No study materials yet</b><span>Open Study Materials to add resources.</span><Link to="/documents" className="text-link">Open materials →</Link></div>}
      </div>
      <div className="panel goal-panel"><div className="panel-head"><div><h3>Today's focus</h3><p>Build a consistent routine.</p></div><Target size={20}/></div><div className="focus-ring"><div><strong>0%</strong><span>completed</span></div></div><Link to="/study-planner" className="secondary-btn full">Open Study Planner</Link></div>
    </div>
  </div>
}