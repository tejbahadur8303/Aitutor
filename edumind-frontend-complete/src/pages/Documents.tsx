import { useEffect, useState } from "react";
import { FileText, FolderOpen, RefreshCw, Search } from "lucide-react";
import { api } from "../api/axios";

export default function Documents(){
 const [docs,setDocs]=useState<any[]>([]);const [loading,setLoading]=useState(true);const [q,setQ]=useState("");
 const load=()=>{setLoading(true);api.get("/documents").then(r=>setDocs(r.data.data||[])).catch(()=>setDocs([])).finally(()=>setLoading(false));};
 useEffect(load,[]);
 const filtered=docs.filter(d=>`${d.title||""} ${d.fileName||""} ${d.subject||""}`.toLowerCase().includes(q.toLowerCase()));
 return <div><div className="page-title"><span className="eyebrow">KNOWLEDGE BASE</span><h1>Study Materials</h1><p>View the documents available to your AI Tutor.</p></div><div className="toolbar"><div className="search"><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search materials"/></div><button className="secondary-btn" onClick={load}><RefreshCw size={16}/> Refresh</button></div><div className="panel">{loading?<div className="empty"><div className="spinner"/><span>Loading materials...</span></div>:filtered.length?filtered.map(d=><div className="document-row" key={d._id}><div className="row-icon"><FileText/></div><div><b>{d.title||d.fileName||"Untitled document"}</b><small>{d.subject||"General"} · {d.fileName||"Document"} · {d.status||"READY"}</small></div><span className={`status ${String(d.status||"READY").toLowerCase()}`}>{d.status||"READY"}</span></div>):<div className="empty"><FolderOpen size={32}/><b>No documents found</b><span>Your current backend document route is read-only and returns an empty list until upload/indexing is implemented.</span></div>}</div></div>
}