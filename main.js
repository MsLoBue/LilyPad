import { useState } from "react";

const BUILT_INS = [
  {
    id: "plans", emoji: "📋", label: "Plans Changed",
    color: "#E8512A", lightBg: "#FFF0EB",
    gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
    intro: "It's okay that things changed. Your feelings make total sense. Let's get through this together. 💛",
    steps: [
      { emoji: "🫁", title: "Breathe first", desc: "Take 3 slow breaths before anything else. In through your nose for 4 counts, out through your mouth for 6." },
      { emoji: "💬", title: "Name it out loud", desc: "Say to yourself: \"This is hard, and that's okay.\" You don't have to feel fine about the change right away." },
      { emoji: "🔍", title: "Find one anchor", desc: "Name one thing that is still the same. Your phone is still here. The people who care about you still do." },
      { emoji: "📝", title: "Make it concrete", desc: "Say or write the new plan step by step. Your brain feels safer when chaos has a shape." },
      { emoji: "🌈", title: "Ride it out", desc: "This feeling of overwhelm will pass — it always has, every single time before." }
    ]
  },
  {
    id: "overstim", emoji: "🔊", label: "Overstimulated",
    color: "#C47D00", lightBg: "#FFF8E6",
    gradient: "linear-gradient(135deg, #F7971E 0%, #FFD200 100%)",
    intro: "Too much input at once. Let's turn things down, one sense at a time. 🧡",
    steps: [
      { emoji: "🙉", title: "Cut input NOW", desc: "Cover your ears, close your eyes, dim your screen — do all three if you can." },
      { emoji: "🖐️", title: "5-4-3-2-1 grounding", desc: "5 things you see · 4 you can touch · 3 sounds you hear · 2 smells · 1 thing you taste." },
      { emoji: "🌬️", title: "Box breathing", desc: "IN for 4... hold 4... OUT for 4... hold 4. Repeat 3 times. This slows your nervous system down." },
      { emoji: "🧊", title: "Cold reset", desc: "Hold something cold or splash cold water on your face. It physically resets your stress response." },
      { emoji: "🤫", title: "Find quiet", desc: "Move to the quietest spot nearby. Even 60 seconds of quiet really helps." }
    ]
  },
  {
    id: "panic", emoji: "🏫", label: "Back to Class",
    color: "#0A7A65", lightBg: "#E8FAF5",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    intro: "You got through something really hard. Now let's ease you back — at your own pace. 💚",
    steps: [
      { emoji: "💪", title: "You survived it", desc: "The panic is over. Your body is safe right now. The shaky feeling is just the aftermath — it fades." },
      { emoji: "🌬️", title: "Recovery breaths", desc: "3 slow deep breaths — not to calm down, just to tell your body it's safe now." },
      { emoji: "🪞", title: "Quick body check", desc: "Shoulders down. Jaw unclenched. Hands open. Just fix what you can notice right now." },
      { emoji: "✊", title: "Your choice, your strength", desc: "Say: \"I'm going back because I choose to.\" You're not being forced — you're being genuinely brave." },
      { emoji: "👣", title: "Walk back slowly", desc: "Slow pace, eyes forward. You don't owe anyone an explanation." }
    ]
  },
  {
    id: "exec", emoji: "🧠", label: "Can't Start Task",
    color: "#4A56CC", lightBg: "#F0EEFF",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    intro: "Your brain isn't broken — it's just stuck. Let's find the tiny door in. 💗",
    steps: [
      { emoji: "🎯", title: "Name just the first move", desc: "Not the whole task — just the first physical action. Open the notebook. Click the doc. Pick up the pencil." },
      { emoji: "⏱️", title: "Only 2 minutes", desc: "Set a timer for 2 minutes. That's all you have to do. You can stop after — but you probably won't." },
      { emoji: "📍", title: "Place your body", desc: "Decide: sitting, standing, at your desk? Get there first. Your body leads your brain." },
      { emoji: "🧹", title: "Move one tiny thing", desc: "Clear one object from your workspace. Just one. You've already started." },
      { emoji: "🏁", title: "Start the easy part", desc: "Start with the easiest piece, not the \"right\" one. Done imperfectly beats not started — every time." }
    ]
  }
];

const GRADIENT_OPTS = [
  { label: "Hot Pink 💗",     gradient: "linear-gradient(135deg, #FF6FB5 0%, #FF2D78 100%)", color: "#D01E6A", lightBg: "#FFE8F3" },
  { label: "Sunny Yellow ☀️", gradient: "linear-gradient(135deg, #FFE44D 0%, #FFB300 100%)", color: "#A87000", lightBg: "#FFFAE0" },
  { label: "Sky Blue 🩵",     gradient: "linear-gradient(135deg, #74EBD5 0%, #5B86E5 100%)", color: "#3A6CC4", lightBg: "#EEF4FF" },
  { label: "Mint 🌿",          gradient: "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)", color: "#1A9968", lightBg: "#E8FAF2" },
  { label: "Lavender 💜",     gradient: "linear-gradient(135deg, #C77DFF 0%, #7B2FBE 100%)", color: "#7B2FBE", lightBg: "#F5EEFF" },
  { label: "Coral 🍑",         gradient: "linear-gradient(135deg, #FFB347 0%, #FF6B6B 100%)", color: "#D44F4F", lightBg: "#FFF0EE" },
];

const TRIG_EMOJIS  = ["💭","😤","😰","🥴","🌀","💔","😩","🤯","😣","⚡","🔥","❄️","💢","🎭","📚","🏠","🚌","👥","🎵","🍽️","💻","🌙","😱","💡","🎯","🧩","🌧️","💬","🫶","😶"];
const STEP_EMOJIS  = ["✨","🌬️","🫁","🖐️","💬","🧊","🌈","💪","🎯","⏱️","📝","🔍","🤫","🪞","👣","🎵","💧","☀️","🌸","🦋","🧘","🎶","🏃","🤝","📖"];

/* ─── tiny helpers ─── */
function ProgressDots({ total, current }) {
  return (
    <div style={{ display:"flex", gap:5, justifyContent:"center", margin:"0 0 6px" }}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{ width:i===current?18:7, height:7, borderRadius:4,
          background:i===current?"#fff":"rgba(255,255,255,0.4)", transition:"all .3s" }} />
      ))}
    </div>
  );
}

function Lbl({ children }) {
  return <p style={{ fontSize:12, fontWeight:800, color:"#FF2D78", textTransform:"uppercase",
    letterSpacing:1, margin:"0 0 10px" }}>{children}</p>;
}

const inputBase = {
  width:"100%", padding:"12px 14px", borderRadius:12,
  border:"2px solid #F0F0F0", fontSize:15, fontFamily:"inherit",
  outline:"none", background:"#fff", color:"#1a1a1a", boxSizing:"border-box"
};

/* ─── screens ─── */
function HomeScreen({ triggers, onSelect, onAdd, onDelete }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflowY:"auto",
      background:"linear-gradient(175deg,#FF2222 0%,#FF7700 18%,#FFE000 34%,#22CC44 50%,#2266FF 68%,#7722FF 100%)" }}>
      <div style={{ height:58 }} />
      <div style={{ padding:"8px 24px 20px", textAlign:"center" }}>
        <div style={{ fontSize:52, lineHeight:1, marginBottom:6 }}>🌈</div>
        <h1 style={{ color:"#fff", fontSize:30, fontWeight:900, margin:"0 0 6px",
          textShadow:"0 2px 12px rgba(0,0,0,0.3)", letterSpacing:-0.5 }}>Hey Lily! 💗</h1>
        <p style={{ color:"rgba(255,255,255,0.92)", fontSize:15, margin:0,
          textShadow:"0 1px 6px rgba(0,0,0,0.2)", fontWeight:500 }}>What do you need help with right now?</p>
      </div>
      <div style={{ flex:1, background:"rgba(255,255,255,0.18)", backdropFilter:"blur(24px)",
        borderRadius:"32px 32px 0 0", padding:"22px 18px 48px", display:"flex", flexDirection:"column", gap:12 }}>
        <p style={{ color:"rgba(255,255,255,0.92)", fontSize:12, fontWeight:800, textAlign:"center",
          margin:"0 0 4px", letterSpacing:1.2, textTransform:"uppercase" }}>Tap what's happening</p>

        {triggers.map(t => (
          <div key={t.id} style={{ position:"relative" }}>
            <button onClick={()=>onSelect(t.id)} style={{
              background:t.gradient, border:"none", borderRadius:22, padding:"16px 18px",
              display:"flex", alignItems:"center", gap:14, cursor:"pointer",
              boxShadow:"0 4px 20px rgba(0,0,0,0.18)", textAlign:"left", width:"100%" }}>
              <span style={{ fontSize:34, lineHeight:1, flexShrink:0 }}>{t.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ color:"#fff", fontSize:17, fontWeight:800 }}>{t.label}</div>
                <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12, marginTop:2 }}>
                  {t.steps.length} steps · just for you{t.custom ? " ✨" : ""}
                </div>
              </div>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:22, flexShrink:0 }}>›</span>
            </button>
            {t.custom && (
              <button onClick={()=>onDelete(t.id)} style={{
                position:"absolute", top:-7, right:-7, width:24, height:24,
                borderRadius:"50%", background:"#fff", border:"2px solid rgba(0,0,0,0.1)",
                fontSize:11, cursor:"pointer", color:"#888", fontWeight:900,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 2px 6px rgba(0,0,0,0.15)" }}>✕</button>
            )}
          </div>
        ))}

        {/* Add button */}
        <button onClick={onAdd} style={{
          background:"linear-gradient(135deg,#FF6FB5 0%,#FF2D78 100%)",
          border:"none", borderRadius:22, padding:"15px 18px",
          display:"flex", alignItems:"center", gap:14, cursor:"pointer",
          boxShadow:"0 4px 24px rgba(255,45,120,0.45)", textAlign:"left", width:"100%" }}>
          <span style={{ fontSize:34, lineHeight:1, flexShrink:0 }}>✨</span>
          <div style={{ flex:1 }}>
            <div style={{ color:"#fff", fontSize:17, fontWeight:800 }}>Add your own trigger</div>
            <div style={{ color:"rgba(255,255,255,0.85)", fontSize:12, marginTop:2 }}>You know yourself best, Lily 💗</div>
          </div>
          <span style={{ color:"rgba(255,255,255,0.85)", fontSize:26, flexShrink:0, fontWeight:300 }}>+</span>
        </button>
        <p style={{ textAlign:"center", color:"rgba(255,255,255,0.7)", fontSize:12, margin:"4px 0 0" }}>Made with love, just for you 💗</p>
      </div>
    </div>
  );
}

function TriggerScreen({ trigger, onBack, onStep, favorites }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#F5F5F7", overflowY:"auto" }}>
      <div style={{ background:trigger.gradient, padding:"56px 22px 28px", flexShrink:0 }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.28)", border:"none", borderRadius:20,
          padding:"6px 14px", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:600, marginBottom:14 }}>← Home</button>
        <div style={{ fontSize:42 }}>{trigger.emoji}</div>
        <h2 style={{ color:"#fff", fontSize:24, fontWeight:900, margin:"8px 0 6px", letterSpacing:-0.3 }}>{trigger.label}</h2>
        <p style={{ color:"rgba(255,255,255,0.92)", fontSize:14, margin:0, lineHeight:1.5 }}>{trigger.intro}</p>
      </div>
      <div style={{ padding:"18px 18px 40px" }}>
        <p style={{ fontSize:12, fontWeight:700, color:"#999", textTransform:"uppercase", letterSpacing:1, margin:"0 0 12px" }}>
          Your coping steps — tap any to open
        </p>
        {trigger.steps.map((step, i) => {
          const fav = favorites[`${trigger.id}-${i}`];
          return (
            <div key={i} onClick={()=>onStep(i)} style={{
              background:"#fff", borderRadius:18, padding:"14px", marginBottom:10,
              display:"flex", alignItems:"center", gap:12, cursor:"pointer",
              boxShadow:"0 2px 10px rgba(0,0,0,0.06)",
              border:`2px solid ${fav ? trigger.color : "transparent"}` }}>
              <div style={{ width:46, height:46, borderRadius:14, background:trigger.lightBg,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{step.emoji}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:15, fontWeight:700, color:"#1a1a1a" }}>
                  <span style={{ color:trigger.color }}>{i+1}. </span>{step.title}
                </div>
                <div style={{ fontSize:12, color:"#888", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{step.desc}</div>
              </div>
              <span style={{ fontSize:20, color:fav?"#FFD700":"#ddd", flexShrink:0 }}>★</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepScreen({ trigger, step, stepIdx, total, onBack, onNext, onPrev, isFav, toggleFav }) {
  const [done, setDone] = useState(false);
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      <div style={{ background:trigger.gradient, padding:"56px 22px 22px", flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.28)", border:"none", borderRadius:20,
            padding:"6px 14px", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:600 }}>← Steps</button>
          <button onClick={toggleFav} style={{
            background:isFav?"rgba(255,215,0,0.3)":"rgba(255,255,255,0.2)",
            border:`1.5px solid ${isFav?"#FFD700":"rgba(255,255,255,0.5)"}`,
            borderRadius:20, padding:"5px 13px", cursor:"pointer",
            color:isFav?"#FFD700":"#fff", fontSize:13, fontWeight:700
          }}>{isFav?"★ Saved!":"☆ Save"}</button>
        </div>
        <ProgressDots total={total} current={stepIdx} />
        <div style={{ color:"rgba(255,255,255,0.85)", fontSize:13, fontWeight:600, textAlign:"center" }}>
          Step {stepIdx+1} of {total}
        </div>
      </div>
      <div style={{ flex:1, padding:"22px 22px 0", overflowY:"auto", background:"#F5F5F7" }}>
        <div style={{ fontSize:66, textAlign:"center", background:trigger.lightBg,
          borderRadius:26, padding:"22px 0", marginBottom:20 }}>{step.emoji}</div>
        <h3 style={{ fontSize:23, fontWeight:900, color:"#1a1a1a", margin:"0 0 10px", letterSpacing:-0.3 }}>{step.title}</h3>
        <p style={{ fontSize:16, color:"#444", lineHeight:1.65, margin:"0 0 22px" }}>{step.desc}</p>
        <button onClick={()=>setDone(d=>!d)} style={{
          width:"100%", padding:"15px",
          background:done?trigger.gradient:"#EBEBF0",
          border:"none", borderRadius:16,
          color:done?"#fff":"#666", fontSize:16, fontWeight:700,
          cursor:"pointer", transition:"all .25s", marginBottom:4 }}>
          {done?"✓ Done with this step!":"Mark as done"}
        </button>
      </div>
      <div style={{ padding:"12px 22px 38px", background:"#F5F5F7", display:"flex", gap:10, flexShrink:0 }}>
        {onPrev && (
          <button onClick={onPrev} style={{ flex:1, padding:"14px", background:"#EBEBF0",
            border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", color:"#444" }}>← Prev</button>
        )}
        <button onClick={onNext||onBack} style={{ flex:2, padding:"14px", background:trigger.gradient,
          border:"none", borderRadius:14, fontSize:15, fontWeight:800, cursor:"pointer", color:"#fff" }}>
          {onNext?"Next step →":"✓ All done! 🌈"}
        </button>
      </div>
    </div>
  );
}

function CreateScreen({ onBack, onSave }) {
  const [label, setLabel]     = useState("");
  const [tEmoji, setTEmoji]   = useState("💭");
  const [colorIdx, setColorIdx] = useState(0);
  const [steps, setSteps]     = useState([{ emoji:"✨", title:"", desc:"" }]);

  const addStep    = () => steps.length < 5 && setSteps(s=>[...s,{emoji:"✨",title:"",desc:""}]);
  const removeStep = i => steps.length > 1 && setSteps(s=>s.filter((_,idx)=>idx!==i));
  const upStep     = (i,f,v) => setSteps(s=>s.map((st,idx)=>idx===i?{...st,[f]:v}:st));
  const canSave    = label.trim() && steps.every(s=>s.title.trim());

  const save = () => {
    if (!canSave) return;
    const g = GRADIENT_OPTS[colorIdx];
    onSave({
      id:`custom_${Date.now()}`, emoji:tEmoji, label:label.trim(),
      color:g.color, lightBg:g.lightBg, gradient:g.gradient, custom:true,
      intro:"You added this one yourself — because you know what you need. That takes real self-awareness, Lily. 💗",
      steps: steps.map(s=>({
        emoji:s.emoji, title:s.title.trim(),
        desc:s.desc.trim()||"Take it one breath at a time. You've got this."
      }))
    });
  };

  const preview = GRADIENT_OPTS[colorIdx];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#F5F5F7", overflowY:"auto" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#FF6FB5 0%,#FF2D78 100%)", padding:"56px 22px 24px", flexShrink:0 }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.28)", border:"none", borderRadius:20,
          padding:"6px 14px", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:600, marginBottom:14 }}>← Back</button>
        <div style={{ fontSize:40 }}>✨</div>
        <h2 style={{ color:"#fff", fontSize:24, fontWeight:900, margin:"8px 0 4px" }}>Add Your Own</h2>
        <p style={{ color:"rgba(255,255,255,0.9)", fontSize:14, margin:0, lineHeight:1.4 }}>
          You know yourself best, Lily. Add whatever you need. 💗
        </p>
      </div>

      <div style={{ padding:"20px 18px 50px" }}>

        {/* Name */}
        <div style={{ marginBottom:20 }}>
          <Lbl>What's the trigger?</Lbl>
          <input value={label} onChange={e=>setLabel(e.target.value)}
            placeholder="e.g. Feeling misunderstood…" maxLength={32}
            style={inputBase} />
        </div>

        {/* Trigger emoji */}
        <div style={{ marginBottom:20 }}>
          <Lbl>Pick an emoji for it</Lbl>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {TRIG_EMOJIS.map(em=>(
              <button key={em} onClick={()=>setTEmoji(em)} style={{
                width:40, height:40, borderRadius:11,
                border:`2px solid ${tEmoji===em?"#FF2D78":"#EBEBEB"}`,
                background:tEmoji===em?"#FFE8F3":"#fff",
                fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{em}</button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div style={{ marginBottom:20 }}>
          <Lbl>Choose a color</Lbl>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:10 }}>
            {GRADIENT_OPTS.map((g,i)=>(
              <button key={i} onClick={()=>setColorIdx(i)} style={{
                padding:"7px 12px", borderRadius:20,
                border:`2.5px solid ${colorIdx===i?"rgba(0,0,0,0.45)":"transparent"}`,
                background:g.gradient, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>{g.label}</button>
            ))}
          </div>
          {/* Live preview */}
          <div style={{ padding:"12px 16px", borderRadius:16, background:preview.gradient,
            display:"flex", alignItems:"center", gap:12, boxShadow:"0 3px 14px rgba(0,0,0,0.15)" }}>
            <span style={{ fontSize:28 }}>{tEmoji}</span>
            <span style={{ color:"#fff", fontWeight:800, fontSize:16 }}>{label||"Your trigger"}</span>
          </div>
        </div>

        {/* Steps */}
        <div style={{ marginBottom:20 }}>
          <Lbl>Coping steps — {steps.length} of 5 max</Lbl>
          {steps.map((step,i)=>(
            <div key={i} style={{ background:"#fff", borderRadius:16, padding:"14px",
              marginBottom:10, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <span style={{ color:"#FF2D78", fontWeight:800, fontSize:13 }}>STEP {i+1}</span>
                {steps.length>1 && (
                  <button onClick={()=>removeStep(i)} style={{ background:"#FFF0F5", border:"none",
                    borderRadius:8, padding:"3px 10px", color:"#FF2D78", cursor:"pointer", fontSize:13, fontWeight:700 }}>Remove</button>
                )}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                {STEP_EMOJIS.map(em=>(
                  <button key={em} onClick={()=>upStep(i,"emoji",em)} style={{
                    width:32, height:32, borderRadius:9,
                    border:`1.5px solid ${step.emoji===em?"#FF2D78":"#EBEBEB"}`,
                    background:step.emoji===em?"#FFE8F3":"#fff",
                    fontSize:17, cursor:"pointer" }}>{em}</button>
                ))}
              </div>
              <input value={step.title} onChange={e=>upStep(i,"title",e.target.value)}
                placeholder="Step title (required)" maxLength={40}
                style={{ ...inputBase, marginBottom:8, padding:"10px 12px", fontSize:14, borderRadius:10 }} />
              <textarea value={step.desc} onChange={e=>upStep(i,"desc",e.target.value)}
                placeholder="What to do or remember (optional)" maxLength={200} rows={2}
                style={{ ...inputBase, padding:"10px 12px", fontSize:14, borderRadius:10, resize:"none" }} />
            </div>
          ))}
          {steps.length<5 && (
            <button onClick={addStep} style={{ width:"100%", padding:"12px", background:"#fff",
              border:"2px dashed #FFB3D4", borderRadius:14, color:"#FF2D78",
              fontSize:14, fontWeight:700, cursor:"pointer" }}>+ Add another step</button>
          )}
        </div>

        <button onClick={save} disabled={!canSave} style={{
          width:"100%", padding:"16px",
          background:canSave?"linear-gradient(135deg,#FF6FB5 0%,#FF2D78 100%)":"#EBEBF0",
          border:"none", borderRadius:16,
          color:canSave?"#fff":"#bbb", fontSize:17, fontWeight:800,
          cursor:canSave?"pointer":"default",
          boxShadow:canSave?"0 4px 20px rgba(255,45,120,0.35)":"none" }}>
          {canSave?"Save My Trigger 💖":"Add a name + step titles to save"}
        </button>
      </div>
    </div>
  );
}

/* ─── main ─── */
export default function LilyCalmKit() {
  const [screen, setScreen]   = useState("home");
  const [activeId, setActiveId] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [favorites, setFavorites]   = useState({});
  const [custom, setCustom]         = useState([]);

  const all     = [...BUILT_INS, ...custom];
  const trigger = all.find(t=>t.id===activeId);

  const toggleFav = (id,i) => {
    const k=`${id}-${i}`;
    setFavorites(f=>({...f,[k]:!f[k]}));
  };

  const goTrigger = id => { setActiveId(id); setActiveStep(0); setScreen("trigger"); };
  const goStep    = i  => { setActiveStep(i); setScreen("step"); };

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh",
      background:"radial-gradient(ellipse at center,#2a1060 0%,#0d0d1a 100%)",
      fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',sans-serif" }}>
      <div style={{ width:390, height:844, background:"#fff", borderRadius:54, overflow:"hidden",
        position:"relative", display:"flex", flexDirection:"column",
        boxShadow:"0 50px 100px rgba(0,0,0,0.6),0 0 0 11px #1c1c1e,0 0 0 13px #3a3a3c,0 0 60px rgba(255,45,120,0.25)" }}>

        {/* Dynamic Island */}
        <div style={{ position:"absolute", top:13, left:"50%", transform:"translateX(-50%)",
          width:118, height:34, background:"#000", borderRadius:20, zIndex:30 }} />

        {screen==="home"    && <HomeScreen triggers={all} onSelect={goTrigger}
          onAdd={()=>setScreen("create")} onDelete={id=>setCustom(c=>c.filter(t=>t.id!==id))} />}
        {screen==="trigger" && trigger && <TriggerScreen trigger={trigger}
          onBack={()=>setScreen("home")} onStep={goStep} favorites={favorites} />}
        {screen==="step"    && trigger && <StepScreen key={`${activeId}-${activeStep}`}
          trigger={trigger} step={trigger.steps[activeStep]} stepIdx={activeStep}
          total={trigger.steps.length} onBack={()=>setScreen("trigger")}
          onNext={activeStep<trigger.steps.length-1?()=>setActiveStep(s=>s+1):null}
          onPrev={activeStep>0?()=>setActiveStep(s=>s-1):null}
          isFav={favorites[`${activeId}-${activeStep}`]}
          toggleFav={()=>toggleFav(activeId,activeStep)} />}
        {screen==="create"  && <CreateScreen onBack={()=>setScreen("home")}
          onSave={t=>{ setCustom(c=>[...c,t]); setScreen("home"); }} />}

        {/* Home indicator */}
        <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)",
          width:134, height:5, background:"#000", borderRadius:3, opacity:0.2, zIndex:30 }} />
      </div>
    </div>
  );
}
