import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const CLASSES = [
  { id: "fisica", name: "Física", icon: "💪", color: "#ef4444", stat: "Fuerza" },
  { id: "mental", name: "Mental", icon: "🧠", color: "#8b5cf6", stat: "Mente" },
  { id: "financiera", name: "Financiera", icon: "💰", color: "#f59e0b", stat: "Riqueza" },
  { id: "social", name: "Social", icon: "🤝", color: "#06b6d4", stat: "Carisma" },
  { id: "tecnica", name: "Técnica/Maker", icon: "🔧", color: "#10b981", stat: "Técnica" },
  { id: "nutricion", name: "Nutrición", icon: "🍎", color: "#84cc16", stat: "Vitalidad" },
  { id: "descanso", name: "Descanso", icon: "😴", color: "#6366f1", stat: "Recuperación" },
  { id: "creatividad", name: "Creatividad", icon: "🎨", color: "#ec4899", stat: "Ingenio" },
  { id: "habitos", name: "Hábitos", icon: "🌱", color: "#14b8a6", stat: "Disciplina" },
];

const FOCUS_MODES = [
  { id: "normal", name: "Normal", icon: "⚖️", desc: "Equilibrado", weights: null },
  { id: "examenes", name: "Exámenes", icon: "🎓", desc: "Estudio al máximo", weights: { tecnica: 3, mental: 2, descanso: 2, nutricion: 1 } },
  { id: "atletico", name: "Atleta", icon: "🏃", desc: "Rendimiento físico", weights: { fisica: 3, nutricion: 2, descanso: 2 } },
  { id: "finanzas", name: "Finanzas", icon: "💸", desc: "Control económico", weights: { financiera: 3, habitos: 2, mental: 1 } },
  { id: "nutricion_m", name: "Nutrición", icon: "🥗", desc: "Salud y alimentación", weights: { nutricion: 3, descanso: 2, fisica: 2 } },
  { id: "recovery", name: "Recovery", icon: "🧘", desc: "Descanso total", weights: { descanso: 3, mental: 2, habitos: 1 } },
  { id: "creativo", name: "Creativo", icon: "✨", desc: "Expresión máxima", weights: { creatividad: 3, mental: 2, social: 1 } },
];

const TASKS_POOL = {
  fisica: [
    { id: "f1", text: "30 min de ejercicio cardiovascular", xp: 40, freq: "daily" },
    { id: "f2", text: "Sesión de pesas/fuerza", xp: 45, freq: "daily" },
    { id: "f3", text: "10,000 pasos hoy", xp: 35, freq: "daily" },
    { id: "f4", text: "Rutina de movilidad o estiramientos", xp: 25, freq: "daily" },
    { id: "f5", text: "Reto semanal: correr 5km", xp: 120, freq: "weekly" },
    { id: "f6", text: "Reto mensual: completar 20 sesiones de ejercicio", xp: 400, freq: "monthly" },
  ],
  mental: [
    { id: "m1", text: "Leer 20 páginas de un libro", xp: 35, freq: "daily" },
    { id: "m2", text: "Meditación o respiración consciente (10 min)", xp: 30, freq: "daily" },
    { id: "m3", text: "Resolver un problema o puzzle", xp: 40, freq: "daily" },
    { id: "m4", text: "Journaling: escribe 3 reflexiones del día", xp: 30, freq: "daily" },
    { id: "m5", text: "Reto semanal: terminar un capítulo completo", xp: 100, freq: "weekly" },
    { id: "m6", text: "Reto mensual: leer un libro completo", xp: 350, freq: "monthly" },
  ],
  financiera: [
    { id: "fin1", text: "Registrar todos los gastos del día", xp: 30, freq: "daily" },
    { id: "fin2", text: "Revisar presupuesto semanal", xp: 40, freq: "daily" },
    { id: "fin3", text: "No gastar en cosas no planeadas", xp: 35, freq: "daily" },
    { id: "fin4", text: "Reto semanal: ahorrar una cantidad fija", xp: 110, freq: "weekly" },
    { id: "fin5", text: "Reto mensual: revisar y ajustar presupuesto mensual", xp: 300, freq: "monthly" },
  ],
  social: [
    { id: "s1", text: "Tener una conversación significativa con alguien", xp: 30, freq: "daily" },
    { id: "s2", text: "Ayudar a alguien con algo concreto", xp: 40, freq: "daily" },
    { id: "s3", text: "Contactar a un amigo o familiar que no has visto", xp: 35, freq: "daily" },
    { id: "s4", text: "Reto semanal: organizar o asistir a un evento social", xp: 100, freq: "weekly" },
    { id: "s5", text: "Reto mensual: fortalecer 3 relaciones importantes", xp: 280, freq: "monthly" },
  ],
  tecnica: [
    { id: "t1", text: "Trabajar 1h en un proyecto técnico o académico", xp: 45, freq: "daily" },
    { id: "t2", text: "Aprender un concepto nuevo en tu área", xp: 40, freq: "daily" },
    { id: "t3", text: "Documentar o revisar algo que aprendiste", xp: 30, freq: "daily" },
    { id: "t4", text: "Reto semanal: completar una sección de proyecto", xp: 130, freq: "weekly" },
    { id: "t5", text: "Reto mensual: entregar o finalizar un proyecto", xp: 450, freq: "monthly" },
  ],
  nutricion: [
    { id: "n1", text: "Tomar al menos 2L de agua", xp: 25, freq: "daily" },
    { id: "n2", text: "Comer 3 comidas balanceadas", xp: 35, freq: "daily" },
    { id: "n3", text: "Evitar ultraprocesados todo el día", xp: 40, freq: "daily" },
    { id: "n4", text: "Incluir verduras en cada comida", xp: 30, freq: "daily" },
    { id: "n5", text: "Reto semanal: meal prep para la semana", xp: 120, freq: "weekly" },
    { id: "n6", text: "Reto mensual: 30 días sin refresco", xp: 350, freq: "monthly" },
  ],
  descanso: [
    { id: "d1", text: "Dormir 7-8 horas", xp: 35, freq: "daily" },
    { id: "d2", text: "Apagar pantallas 30 min antes de dormir", xp: 30, freq: "daily" },
    { id: "d3", text: "Tomar un descanso activo de 10 min", xp: 20, freq: "daily" },
    { id: "d4", text: "Reto semanal: mantener horario de sueño constante", xp: 100, freq: "weekly" },
  ],
  creatividad: [
    { id: "c1", text: "Dedicar 30 min a un proyecto creativo", xp: 40, freq: "daily" },
    { id: "c2", text: "Sketching, dibujo o diseño libre", xp: 35, freq: "daily" },
    { id: "c3", text: "Escribir una idea nueva (invención, mejora, solución)", xp: 35, freq: "daily" },
    { id: "c4", text: "Reto semanal: terminar una pieza creativa", xp: 115, freq: "weekly" },
    { id: "c5", text: "Reto mensual: crear y compartir algo con alguien", xp: 300, freq: "monthly" },
  ],
  habitos: [
    { id: "h1", text: "Hacer tu cama al levantarte", xp: 15, freq: "daily" },
    { id: "h2", text: "Mantener tu espacio ordenado", xp: 20, freq: "daily" },
    { id: "h3", text: "Revisar y planear el día siguiente antes de dormir", xp: 25, freq: "daily" },
    { id: "h4", text: "Cumplir tu rutina matutina completa", xp: 30, freq: "daily" },
    { id: "h5", text: "Reto semanal: 7 días con rutina matutina completa", xp: 150, freq: "weekly" },
  ],
};

const TITLES = [
  { min: 0, title: "Novato" },
  { min: 200, title: "Aprendiz" },
  { min: 500, title: "Iniciado" },
  { min: 1000, title: "Veterano" },
  { min: 2000, title: "Experto" },
  { min: 4000, title: "Maestro" },
  { min: 8000, title: "Leyenda" },
];

function getTitle(xp) {
  let t = TITLES[0].title;
  for (const tier of TITLES) if (xp >= tier.min) t = tier.title;
  return t;
}

function getDynamicTitle(stats) {
  const top = Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 2);
  const labels = { fisica: "Atlético", mental: "Estratega", financiera: "Capitalista", social: "Carismático", tecnica: "Ingeniero", nutricion: "Saludable", descanso: "Equilibrado", creatividad: "Creativo", habitos: "Disciplinado" };
  if (top[0][1] === 0) return "El Desconocido";
  const a = labels[top[0][0]] || "";
  const b = top[1] && top[1][1] > 0 ? labels[top[1][0]] : null;
  return b ? `El ${a} ${b}` : `El ${a}`;
}

function xpForLevel(lvl) { return 100 * lvl * lvl; }
function levelFromXp(xp) {
  let l = 1;
  while (xpForLevel(l + 1) <= xp) l++;
  return l;
}

const defaultState = () => ({
  totalXp: 0,
  classXp: Object.fromEntries(CLASSES.map(c => [c.id, 0])),
  streak: 0,
  lastCheckin: null,
  focusMode: "normal",
  completedTasks: {},
  debtTasks: [],
  history: [],
  dailyTaskSet: {},
  lastTaskReset: null,
  achievements: [],
  quests: [],
  questSuggestions: [],
  completedQuests: [],
});

function loadState() {
  try {
    const s = localStorage.getItem("life_rpg_v2");
    return s ? { ...defaultState(), ...JSON.parse(s) } : defaultState();
  } catch { return defaultState(); }
}

function saveState(s) {
  try { localStorage.setItem("life_rpg_v2", JSON.stringify(s)); } catch {}
}

function getTodayKey() { return new Date().toISOString().split("T")[0]; }

function pickDailyTasks(focusMode, existingSet, todayKey) {
  if (existingSet && existingSet.date === todayKey) return existingSet;
  const mode = FOCUS_MODES.find(m => m.id === focusMode) || FOCUS_MODES[0];
  const weights = mode.weights;
  const result = [];
  CLASSES.forEach(cls => {
    const pool = (TASKS_POOL[cls.id] || []).filter(t => t.freq === "daily");
    if (!pool.length) return;
    let count = weights ? (weights[cls.id] ? Math.min(weights[cls.id], pool.length) : (Object.values(weights).includes(cls.id) ? 0 : 1)) : 1;
    if (!weights) count = 1;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < count && i < shuffled.length; i++) result.push(shuffled[i]);
  });
  const weekly = Object.values(TASKS_POOL).flat().filter(t => t.freq === "weekly");
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 1) result.push(...weekly.slice(0, 2));
  const monthly = Object.values(TASKS_POOL).flat().filter(t => t.freq === "monthly");
  const dayOfMonth = new Date().getDate();
  if (dayOfMonth === 1) result.push(...monthly.slice(0, 1));
  return { date: todayKey, tasks: result };
}

// NOTA IMPORTANTE PARA PWA:
// En el artefacto original las llamadas a la IA usaban fetch a api.anthropic.com directo,
// pero eso NO funciona fuera de Claude (problemas de CORS + API key).
// Para la PWA tienes 2 opciones:
//   1. Eliminar las funciones de IA por ahora (la app funciona sin ellas)
//   2. Más adelante, crear un backend simple con Vercel Functions que llame a la API de Anthropic
// Por defecto, las funciones de IA están desactivadas con un mensaje.

export default function App() {
  const [state, setState] = useState(loadState);
  const [view, setView] = useState("home");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [notification, setNotification] = useState(null);
  const [newQuestText, setNewQuestText] = useState("");
  const [newQuestClass, setNewQuestClass] = useState("tecnica");
  const recognitionRef = useRef(null);

  const todayKey = getTodayKey();

  useEffect(() => {
    setState(prev => {
      const dailyTaskSet = pickDailyTasks(prev.focusMode, prev.dailyTaskSet, todayKey);
      let streak = prev.streak;
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yKey = yesterday.toISOString().split("T")[0];
      if (prev.lastCheckin === null) streak = 0;
      else if (prev.lastCheckin !== todayKey && prev.lastCheckin !== yKey) streak = 0;
      return { ...prev, dailyTaskSet, streak };
    });
  }, []);

  useEffect(() => { saveState(state); }, [state]);

  function notify(msg, color = "#10b981") {
    setNotification({ msg, color });
    setTimeout(() => setNotification(null), 3000);
  }

  function toggleTask(task) {
    const key = `${todayKey}_${task.id}`;
    const isDone = !!state.completedTasks[key];
    const cls = CLASSES.find(c => (TASKS_POOL[c.id] || []).some(t => t.id === task.id)) || CLASSES.find(c => c.id === task.class);
    if (isDone) {
      setState(prev => {
        const newClassXp = { ...prev.classXp };
        if (cls) newClassXp[cls.id] = Math.max(0, (newClassXp[cls.id] || 0) - task.xp);
        const newCompleted = { ...prev.completedTasks };
        delete newCompleted[key];
        const newHistory = (prev.history || []).filter(h => !(h.date === todayKey && h.task === task.text));
        return { ...prev, totalXp: Math.max(0, prev.totalXp - task.xp), classXp: newClassXp, completedTasks: newCompleted, history: newHistory };
      });
      notify(`-${task.xp} XP · tarea desmarcada`, "#f59e0b");
    } else {
      setState(prev => {
        const newClassXp = { ...prev.classXp };
        if (cls) newClassXp[cls.id] = (newClassXp[cls.id] || 0) + task.xp;
        const newCompleted = { ...prev.completedTasks, [key]: true };
        const newHistory = [...(prev.history || []), { date: todayKey, xp: task.xp, task: task.text, class: cls?.id }];
        let streak = prev.streak;
        if (prev.lastCheckin !== todayKey) streak = (prev.lastCheckin === new Date(Date.now() - 86400000).toISOString().split("T")[0]) ? streak + 1 : 1;
        return { ...prev, totalXp: prev.totalXp + task.xp, classXp: newClassXp, completedTasks: newCompleted, history: newHistory, lastCheckin: todayKey, streak };
      });
      notify(`+${task.xp} XP — ${task.text.slice(0, 30)}...`);
    }
  }

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { notify("Tu navegador no soporta micrófono", "#ef4444"); return; }
    const rec = new SR();
    rec.lang = "es-MX";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      // Búsqueda simple de palabras clave (sin IA por ahora en PWA)
      const tasks = state.dailyTaskSet?.tasks || [];
      const lower = text.toLowerCase();
      const matched = tasks.filter(t => {
        const words = t.text.toLowerCase().split(" ").filter(w => w.length > 4);
        return words.some(w => lower.includes(w));
      });
      if (matched.length) {
        matched.forEach(t => { if (!state.completedTasks[`${todayKey}_${t.id}`]) toggleTask(t); });
        notify(`${matched.length} tarea(s) marcadas por voz`);
      } else notify("No identifiqué tareas. Intenta con más detalle.", "#f59e0b");
    };
    rec.onerror = () => { setListening(false); notify("Error con el micrófono", "#ef4444"); };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  function addQuest(text, classId) {
    if (!text.trim()) return;
    const quest = { id: `q_${Date.now()}`, text: text.trim(), class: classId, xp: 500, created: todayKey, completed: false };
    setState(prev => ({ ...prev, quests: [...prev.quests, quest] }));
    setNewQuestText("");
    notify("Misión principal agregada");
  }

  function completeQuest(questId) {
    const quest = state.quests.find(q => q.id === questId);
    if (!quest) return;
    setState(prev => {
      const newClassXp = { ...prev.classXp };
      newClassXp[quest.class] = (newClassXp[quest.class] || 0) + quest.xp;
      return {
        ...prev,
        totalXp: prev.totalXp + quest.xp,
        classXp: newClassXp,
        quests: prev.quests.map(q => q.id === questId ? { ...q, completed: true, completedDate: todayKey } : q),
        completedQuests: [...prev.completedQuests, { ...quest, completedDate: todayKey }],
        history: [...prev.history, { date: todayKey, xp: quest.xp, task: `🏆 ${quest.text}`, class: quest.class }],
      };
    });
    notify(`🏆 Misión completada · +${quest.xp} XP`);
  }

  function exportData() {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `life-rpg-backup-${todayKey}.json`;
    a.click();
    notify("Backup descargado");
  }

  function importData(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        setState({ ...defaultState(), ...parsed });
        notify("Backup importado correctamente");
      } catch { notify("Archivo inválido", "#ef4444"); }
    };
    reader.readAsText(file);
  }

  const level = levelFromXp(state.totalXp);
  const xpForNext = xpForLevel(level + 1);
  const xpInLevel = state.totalXp - xpForLevel(level);
  const xpNeeded = xpForNext - xpForLevel(level);
  const pct = Math.min(100, (xpInLevel / xpNeeded) * 100);
  const todayTasks = state.dailyTaskSet?.tasks || [];
  const todayDone = todayTasks.filter(t => state.completedTasks[`${todayKey}_${t.id}`]).length;
  const focusModeObj = FOCUS_MODES.find(m => m.id === state.focusMode) || FOCUS_MODES[0];
  const radarData = CLASSES.map(c => ({ subject: c.icon, A: state.classXp[c.id] || 0 }));
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const k = d.toISOString().split("T")[0];
    const xp = (state.history || []).filter(h => h.date === k).reduce((s, h) => s + h.xp, 0);
    return { day: d.toLocaleDateString("es", { weekday: "short" }), xp };
  });
  const completedCount = Object.keys(state.completedTasks).length;

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Segoe UI', sans-serif", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      {notification && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: notification.color, color: "#fff", padding: "10px 20px", borderRadius: 12, zIndex: 999, fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", maxWidth: 340, textAlign: "center" }}>{notification.msg}</div>
      )}

      <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", padding: "20px 16px 16px", borderBottom: "1px solid #3730a3" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#a5b4fc", letterSpacing: 2, textTransform: "uppercase" }}>Life RPG</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{getDynamicTitle(state.classXp)}</div>
            <div style={{ fontSize: 12, color: "#c7d2fe" }}>Nivel {level} · {getTitle(state.totalXp)} · {state.totalXp} XP</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28 }}>🔥</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24" }}>{state.streak}</div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>días</div>
          </div>
        </div>
        <div style={{ marginTop: 10, background: "#1e1b4b", borderRadius: 8, height: 8, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #6366f1, #a855f7)", transition: "width 0.5s" }} />
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{xpInLevel}/{xpNeeded} XP → Nivel {level + 1}</div>
      </div>

      <div style={{ display: "flex", background: "#13111e", borderBottom: "1px solid #1e1b4b" }}>
        {[["home", "🏠", "Inicio"], ["tasks", "📋", "Tareas"], ["quests", "🏆", "Misiones"], ["stats", "📊", "Stats"], ["modes", "⚡", "Modo"]].map(([id, icon, label]) => (
          <button key={id} onClick={() => setView(id)} style={{ flex: 1, padding: "10px 4px", background: view === id ? "#1e1b4b" : "transparent", border: "none", color: view === id ? "#a5b4fc" : "#64748b", cursor: "pointer", fontSize: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>{label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px", paddingBottom: 80 }}>
        {view === "home" && (
          <div>
            <div style={{ background: "#1e1b4b", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid #3730a3" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Modo: {focusModeObj.icon} {focusModeObj.name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{todayDone}/{todayTasks.length}</div>
              </div>
              <div style={{ background: "#0f0f1a", borderRadius: 8, height: 6 }}>
                <div style={{ width: `${todayTasks.length ? (todayDone / todayTasks.length) * 100 : 0}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #6366f1)", borderRadius: 8 }} />
              </div>
            </div>

            <div style={{ background: "#1e1b4b", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid #3730a3", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Check-in por voz</div>
              <button onClick={startListening} disabled={listening} style={{ background: listening ? "#ef4444" : "#10b981", border: "none", borderRadius: 50, width: 64, height: 64, fontSize: 28, cursor: "pointer" }}>
                {listening ? "🎙️" : "🎤"}
              </button>
              {transcript && <div style={{ marginTop: 8, fontSize: 12, color: "#94a3b8" }}>"{transcript}"</div>}
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "#a5b4fc" }}>Tareas de hoy</div>
            {todayTasks.map(task => {
              const done = !!state.completedTasks[`${todayKey}_${task.id}`];
              const cls = CLASSES.find(c => (TASKS_POOL[c.id] || []).some(t => t.id === task.id));
              return (
                <div key={task.id} onClick={() => toggleTask(task)} style={{ background: done ? "#064e3b" : "#13111e", border: `1px solid ${done ? "#10b981" : "#1e1b4b"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, opacity: done ? 0.7 : 1 }}>
                  <span style={{ fontSize: 20 }}>{done ? "✅" : cls?.icon || "⭐"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, textDecoration: done ? "line-through" : "none" }}>{task.text}</div>
                    <div style={{ fontSize: 11, color: cls?.color || "#94a3b8" }}>{cls?.name} · +{task.xp} XP</div>
                  </div>
                </div>
              );
            })}

            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 16, marginBottom: 10, color: "#a5b4fc" }}>Progreso por clase</div>
            {CLASSES.map(cls => {
              const xp = state.classXp[cls.id] || 0;
              const lvl = levelFromXp(xp);
              const pctBar = Math.min(100, ((xp - xpForLevel(lvl)) / (xpForLevel(lvl + 1) - xpForLevel(lvl))) * 100);
              return (
                <div key={cls.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span>{cls.icon} {cls.name}</span><span style={{ color: "#94a3b8" }}>Nv.{lvl} · {xp} XP</span>
                  </div>
                  <div style={{ background: "#1e1b4b", borderRadius: 4, height: 4, marginTop: 3 }}>
                    <div style={{ width: `${pctBar}%`, height: "100%", background: cls.color, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "tasks" && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#a5b4fc" }}>Tareas de hoy</div>
            {todayTasks.map(task => {
              const done = !!state.completedTasks[`${todayKey}_${task.id}`];
              const cls = CLASSES.find(c => (TASKS_POOL[c.id] || []).some(t => t.id === task.id));
              return (
                <div key={task.id} onClick={() => toggleTask(task)} style={{ background: done ? "#064e3b" : "#13111e", border: `1px solid ${done ? "#10b981" : "#1e1b4b"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, opacity: done ? 0.75 : 1 }}>
                  <span style={{ fontSize: 22 }}>{done ? "✅" : cls?.icon || "⭐"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, textDecoration: done ? "line-through" : "none" }}>{task.text}</div>
                    <div style={{ fontSize: 11, color: cls?.color }}>{cls?.name} · +{task.xp} XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "quests" && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: "#a5b4fc" }}>🏆 Misiones principales</div>
            <div style={{ background: "#1e1b4b", borderRadius: 12, padding: 12, marginBottom: 16 }}>
              <input value={newQuestText} onChange={(e) => setNewQuestText(e.target.value)} placeholder="ej. Dominar reactores electroquímicos" style={{ width: "100%", background: "#0f0f1a", border: "1px solid #3730a3", borderRadius: 8, padding: "8px 10px", color: "#e2e8f0", fontSize: 13, marginBottom: 8, boxSizing: "border-box" }} />
              <select value={newQuestClass} onChange={(e) => setNewQuestClass(e.target.value)} style={{ width: "100%", background: "#0f0f1a", border: "1px solid #3730a3", borderRadius: 8, padding: "8px 10px", color: "#e2e8f0", fontSize: 13, marginBottom: 8 }}>
                {CLASSES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
              <button onClick={() => addQuest(newQuestText, newQuestClass)} style={{ width: "100%", background: "#6366f1", border: "none", borderRadius: 8, padding: "8px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Agregar misión</button>
            </div>
            {state.quests.filter(q => !q.completed).map(q => {
              const cls = CLASSES.find(c => c.id === q.class);
              return (
                <div key={q.id} style={{ background: "#13111e", border: `1px solid ${cls?.color}`, borderRadius: 12, padding: 12, marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{cls?.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{q.text}</div>
                      <div style={{ fontSize: 11, color: cls?.color }}>{cls?.name} · +{q.xp} XP</div>
                    </div>
                  </div>
                  <button onClick={() => completeQuest(q.id)} style={{ width: "100%", background: "#10b981", border: "none", borderRadius: 8, padding: "8px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 10 }}>✅ Completada</button>
                </div>
              );
            })}
          </div>
        )}

        {view === "stats" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[["🏆", "Nivel", level], ["⚡", "XP", state.totalXp], ["🔥", "Racha", `${state.streak}d`], ["✅", "Tareas", completedCount], ["📊", "Clases", CLASSES.length], ["🎯", "Misiones", state.completedQuests?.length || 0]].map(([icon, label, val]) => (
                <div key={label} style={{ background: "#1e1b4b", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20 }}>{icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#a5b4fc" }}>{val}</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#1e1b4b", borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>XP últimos 7 días</div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={last7}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: "#0f0f1a", border: "1px solid #3730a3", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#a855f7", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: "#1e1b4b", borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Radar de stats</div>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#3730a3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <button onClick={exportData} style={{ width: "100%", background: "#10b981", border: "none", borderRadius: 8, color: "#fff", padding: "10px", cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>💾 Exportar backup</button>
            <label style={{ display: "block", marginBottom: 16 }}>
              <input type="file" accept="application/json" onChange={importData} style={{ display: "none" }} />
              <div style={{ width: "100%", background: "#3730a3", border: "none", borderRadius: 8, color: "#fff", padding: "10px", cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "center", boxSizing: "border-box" }}>📥 Importar backup</div>
            </label>

            <button onClick={() => { if (window.confirm("⚠️ Esto borrará TODO. ¿Continuar?")) { setState(defaultState()); notify("Reseteado", "#f59e0b"); } }} style={{ background: "#1e1b4b", border: "1px solid #ef4444", borderRadius: 8, color: "#ef4444", padding: "8px 16px", cursor: "pointer", width: "100%", fontSize: 12 }}>⚠️ Borrar todo</button>
          </div>
        )}

        {view === "modes" && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: "#a5b4fc" }}>Modo Enfoque</div>
            {FOCUS_MODES.map(mode => (
              <div key={mode.id} onClick={() => {
                const newTaskSet = pickDailyTasks(mode.id, null, todayKey);
                setState(prev => ({ ...prev, focusMode: mode.id, dailyTaskSet: newTaskSet }));
                notify(`✓ Modo ${mode.name} activado`);
              }} style={{ background: state.focusMode === mode.id ? "#1e1b4b" : "#13111e", border: `1px solid ${state.focusMode === mode.id ? "#6366f1" : "#1e1b4b"}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>{mode.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{mode.name} {state.focusMode === mode.id ? "✓" : ""}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{mode.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
