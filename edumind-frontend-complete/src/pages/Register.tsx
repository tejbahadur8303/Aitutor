import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { api } from "../api/axios";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [grade,setGrade]=useState(""); const [subjects,setSubjects]=useState("");
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  const login=useAuthStore(s=>s.login); const navigate=useNavigate();

  async function submit(e:FormEvent){
    e.preventDefault(); setError(""); setLoading(true);
    try{
      const res=await api.post("/auth/register",{name,email,password,grade,subjects:subjects.split(",").map(s=>s.trim()).filter(Boolean),role:"STUDENT"});
      login(res.data.data); navigate("/dashboard",{replace:true});
    }catch(err:any){setError(err.response?.data?.message||"Registration failed.");}
    finally{setLoading(false);}
  }
  return <div className="auth-page"><div className="auth-art">
    <div className="auth-brand"><div className="brand-mark"><Sparkles size={19}/></div><b>EduMind AI</b></div>
    <div className="auth-copy"><span className="eyebrow">START TODAY</span><h1>Build your own<br/><em>learning path.</em></h1><p>Get an AI tutor, smart quizzes and a study plan designed around your goals.</p></div>
  </div><div className="auth-panel"><form className="auth-form" onSubmit={submit}>
    <div className="mobile-brand"><Sparkles size={20}/> EduMind AI</div><span className="eyebrow">CREATE ACCOUNT</span><h2>Join EduMind AI</h2><p className="muted">Set up your student profile.</p>
    {error&&<div className="alert error">{error}</div>}
    <label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required/></label>
    <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></label>
    <div className="two-col"><label>Grade / Year<input value={grade} onChange={e=>setGrade(e.target.value)} placeholder="B.Tech CSE"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" minLength={6} required/></label></div>
    <label>Subjects <input value={subjects} onChange={e=>setSubjects(e.target.value)} placeholder="DSA, DBMS, OS"/></label>
    <button className="primary-btn full" disabled={loading}>{loading?"Creating...":"Create Account"}</button>
    <p className="auth-foot">Already registered? <Link to="/login">Sign in</Link></p>
  </form></div></div>
}