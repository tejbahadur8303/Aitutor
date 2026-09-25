import { FormEvent, useState } from "react";
import { Save, User } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { api } from "../api/axios";

export default function Profile(){
 const user=useAuthStore(s=>s.user);const [name,setName]=useState(user?.name||"");const [grade,setGrade]=useState(user?.grade||"");const [message,setMessage]=useState("");
 async function save(e:FormEvent){e.preventDefault();setMessage("Profile update API is not present in the current backend. Your login profile remains unchanged.");try{await api.get("/auth/me")}catch{}}
 return <div><div className="page-title"><span className="eyebrow">ACCOUNT</span><h1>Your Profile</h1><p>Manage your student information.</p></div><div className="profile-grid"><div className="profile-card"><div className="profile-avatar"><User size={34}/></div><h2>{user?.name||"Student"}</h2><p>{user?.email}</p><span className="role-chip">{user?.role||"STUDENT"}</span></div><form className="panel profile-form" onSubmit={save}><h3>Personal information</h3><label>Full name<input value={name} onChange={e=>setName(e.target.value)}/></label><label>Email<input value={user?.email||""} disabled/></label><label>Grade / Year<input value={grade} onChange={e=>setGrade(e.target.value)} placeholder="B.Tech CSE"/></label><label>Subjects<input value={(user?.subjects||[]).join(", ")} disabled/></label>{message&&<div className="alert info">{message}</div>}<button className="primary-btn"><Save size={16}/> Save changes</button></form></div></div>
}