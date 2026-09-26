import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen, Brain, CalendarDays, ChevronLeft, ChevronRight, FileText,
  GraduationCap, LayoutDashboard, LogOut, Menu, MessageCircle, Moon,
  Settings, Target, TrendingUp, User, X
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import LogoMark from "../components/LogoMark";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tutor", label: "AI Tutor", icon: MessageCircle },
  { to: "/quizzes", label: "Quiz Generator", icon: Brain },
  { to: "/courses", label: "My Courses", icon: BookOpen },
  { to: "/study-planner", label: "Study Planner", icon: CalendarDays },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/documents", label: "Study Materials", icon: FileText },
  { to: "/career", label: "Career Guidance", icon: Target },
  { to: "/profile", label: "Profile", icon: User }
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [dark, setDark] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobile ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><LogoMark size={19}/></div>
          {!collapsed && <div><strong>EduMind</strong><span>AI Learning</span></div>}
          <button className="icon-btn mobile-close" onClick={() => setMobile(false)}><X size={19}/></button>
        </div>

        <div className="nav-title">{!collapsed && "LEARNING"}</div>
        <nav className="nav">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setMobile(false)}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              title={collapsed ? label : undefined}>
              <Icon size={19}/><span>{!collapsed && label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {!collapsed && <div className="mini-card">
            <GraduationCap size={20}/>
            <div><b>Keep learning</b><small>Small progress every day.</small></div>
          </div>}
          <button className="nav-item" onClick={() => setDark((v) => !v)}>
            <Moon size={19}/><span>{!collapsed && (dark ? "Light Mode" : "Dark Mode")}</span>
          </button>
          <button className="nav-item logout" onClick={signOut}>
            <LogOut size={19}/><span>{!collapsed && "Logout"}</span>
          </button>
        </div>
      </aside>

      {mobile && <div className="overlay" onClick={() => setMobile(false)} />}

      <section className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobile(true)}><Menu size={21}/></button>
          <button className="collapse-btn" onClick={() => setCollapsed((v) => !v)}>
            {collapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
          </button>
          <div className="top-spacer" />
          <div className="top-user">
            <div className="avatar">{(user?.name || "S").slice(0,1).toUpperCase()}</div>
            <div className="top-user-text"><b>{user?.name || "Student"}</b><span>{user?.role || "Student"}</span></div>
          </div>
        </header>
        <main className="content"><Outlet /></main>
      </section>
    </div>
  );
}