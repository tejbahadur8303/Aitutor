import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bot, History, MessageCircle, Send, Sparkles, User } from "lucide-react";
import { api } from "../api/axios";

type Msg={role:"user"|"assistant";content:string;sources?:{title?:string;page?:number}[]};

export default function Tutor(){
  const {id}=useParams(); const [messages,setMessages]=useState<Msg[]>([]); const [text,setText]=useState(""); const [loading,setLoading]=useState(false); const [conversationId,setConversationId]=useState(id||""); const [history,setHistory]=useState<any[]>([]);
  const end=useRef<HTMLDivElement>(null);
  useEffect(()=>{api.get("/tutor/conversations").then(r=>setHistory(r.data.data||[])).catch(()=>{});},[]);
  useEffect(()=>{if(id){api.get(`/tutor/conversations/${id}/messages`).then(r=>setMessages(r.data.data||[])).catch(()=>{});}},[id]);
  useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);

  async function send(e:FormEvent){e.preventDefault();if(!text.trim()||loading)return;const q=text.trim();setText("");setMessages(m=>[...m,{role:"user",content:q}]);setLoading(true);
    try{const r=await api.post("/tutor/chat",{message:q,conversationId:conversationId||undefined});setConversationId(r.data.data.conversationId);setMessages(m=>[...m,{role:"assistant",content:r.data.data.answer,sources:r.data.data.sources||[]}]);}
    catch(err:any){setMessages(m=>[...m,{role:"assistant",content:err.response?.data?.message||"I couldn't answer right now. Please check the backend and try again."}]);}
    finally{setLoading(false);}
  }
  return <div className="tutor-layout">
    <aside className="history"><div className="history-head"><b><History size={17}/> Conversations</b></div><Link className="new-chat" to="/tutor"><MessageCircle size={16}/> New conversation</Link>{history.map(c=><Link key={c._id} to={`/tutor/${c._id}`} className={`history-item ${conversationId===c._id?"selected":""}`}>{c.title||"New conversation"}</Link>)}</aside>
    <section className="chat">
      <div className="page-title compact"><div><span className="eyebrow">AI LEARNING ASSISTANT</span><h1>AI Tutor <span className="live-dot">●</span></h1><p>Ask questions, revise concepts, or explain a topic in simple language.</p></div><div className="ai-badge"><Sparkles size={16}/> EduMind AI</div></div>
      <div className="chat-window">
        {!messages.length?<div className="welcome-chat"><div className="big-ai"><Bot size={30}/></div><h2>What would you like to learn?</h2><p>Try a question like “Explain binary search with an example.”</p><div className="suggestions">{["Explain recursion simply","Give me a DSA quiz","Explain DBMS normalization","Help me prepare for an interview"].map(s=><button key={s} onClick={()=>setText(s)}>{s}</button>)}</div></div>:messages.map((m,i)=><div className={`message ${m.role}`} key={i}><div className="message-avatar">{m.role==="assistant"?<Bot size={17}/>:<User size={17}/>}</div><div className="bubble"><div className="message-role">{m.role==="assistant"?"EduMind AI":"You"}</div><p>{m.content}</p>{m.sources?.length?<div className="sources">{m.sources.map((s,j)=><span key={j}>{s.title||"Source"}{s.page?` · p.${s.page}`:""}</span>)}</div>:null}</div></div>)}
        {loading&&<div className="message assistant"><div className="message-avatar"><Bot size={17}/></div><div className="bubble"><div className="typing"><i/><i/><i/></div></div></div>}<div ref={end}/>
      </div>
      <form className="chat-input" onSubmit={send}><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Ask your AI tutor..." rows={1} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void send(e);}}}/><button disabled={loading||!text.trim()}><Send size={18}/></button></form>
    </section>
  </div>
}