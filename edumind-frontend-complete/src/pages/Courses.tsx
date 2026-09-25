import { BookOpen, Code2, Database, Layers3, Plus, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

const courses=[
 {title:"Data Structures & Algorithms",subject:"Computer Science",progress:32,icon:Code2,lessons:24},
 {title:"Database Management Systems",subject:"Computer Science",progress:18,icon:Database,lessons:16},
 {title:"Operating Systems",subject:"Computer Science",progress:8,icon:Layers3,lessons:20}
];
export default function Courses(){return <div><div className="page-title"><span className="eyebrow">LEARNING LIBRARY</span><h1>My Courses</h1><p>Keep your courses organized and continue where you left off.</p></div><div className="course-actions"><Link to="/study-planner" className="secondary-btn"><Plus size={17}/> Add to study plan</Link></div><div className="course-grid">{courses.map(c=><div className="course-card" key={c.title}><div className="course-cover"><c.icon size={34}/><span>CS</span></div><div className="course-body"><span className="tag">{c.subject}</span><h3>{c.title}</h3><div className="progress-line"><i style={{width:`${c.progress}%`}}/></div><div className="course-meta"><span>{c.progress}% complete</span><span>{c.lessons} lessons</span></div><button className="secondary-btn full"><PlayCircle size={16}/> Continue learning</button></div></div>)}</div><div className="info-note"><BookOpen size={18}/><span>These starter course cards are frontend content. Connect a course API when your backend course routes are added.</span></div></div>}