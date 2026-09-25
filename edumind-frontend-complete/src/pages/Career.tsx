import { ArrowRight, Briefcase, Code2, Database, Globe2, Lightbulb, ShieldCheck } from "lucide-react";
const paths=[
 {title:"Software Development",icon:Code2,skills:["DSA","React","Node.js","Git"]},
 {title:"Data & AI",icon:Lightbulb,skills:["Python","Statistics","ML","SQL"]},
 {title:"Cyber Security",icon:ShieldCheck,skills:["Networking","Linux","Security","Python"]},
 {title:"Cloud & DevOps",icon:Globe2,skills:["Linux","Docker","Cloud","CI/CD"]}
];
export default function Career(){return <div><div className="page-title"><span className="eyebrow">CAREER EXPLORER</span><h1>Career Guidance</h1><p>Explore common technology paths and the skills that support them.</p></div><div className="career-grid">{paths.map(p=><div className="career-card" key={p.title}><div className="career-icon"><p.icon/></div><h3>{p.title}</h3><div className="skill-list">{p.skills.map(s=><span key={s}>{s}</span>)}</div><button className="text-link">Explore path <ArrowRight size={15}/></button></div>)}</div><div className="info-note"><Briefcase size={18}/><span>This page is a frontend career-guidance module. Personalized AI career recommendations can be connected to a dedicated backend endpoint later.</span></div></div>}