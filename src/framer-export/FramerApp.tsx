import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

// ==================== TYPES ====================
type TabType = "home" | "leads" | "agenda" | "perfil"

// ==================== MOCK DATA ====================
const corretor = { id: "1", nome: "Carlos Silva", cargo: "Corretor Senior", ranking: 3, vendas: 12, meta: 15, comissoes: 45000, taxaConversao: 23, tempoMedioFechamento: 45 }
const leads = [
  { id: "1", nome: "Ana Costa", telefone: "(11) 99999-1111", status: "quente", interesse: "Apartamento 3 quartos", ultimoContato: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "2", nome: "Bruno Santos", telefone: "(11) 99999-2222", status: "morno", interesse: "Casa com quintal", ultimoContato: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: "3", nome: "Carla Oliveira", telefone: "(11) 99999-3333", status: "novo", interesse: "Studio", ultimoContato: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
]
const compromissos = [
  { id: "1", tipo: "visita", cliente: "Ana Costa", data: new Date().toISOString().split("T")[0], hora: "10:00", endereco: "Rua Augusta, 1500", status: "confirmado", imovel: "Apt 3q" },
  { id: "2", tipo: "ligacao", cliente: "Bruno Santos", data: new Date().toISOString().split("T")[0], hora: "14:00", endereco: null, status: "pendente", imovel: null },
]
const imoveis = [
  { id: "1", titulo: "Apartamento Jardins", preco: 750000, bairro: "Jardins", quartos: 3, area: 120, foto: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", novo: true, baixouPreco: false },
  { id: "2", titulo: "Casa Vila Madalena", preco: 1200000, bairro: "Vila Madalena", quartos: 4, area: 200, foto: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", novo: false, baixouPreco: true },
]

// ==================== UTILITIES ====================
const getGreeting = () => { const h = new Date().getHours(); return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite" }
const getRankingBadge = (r) => r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : `#${r}`
const getStatusColor = (s) => ({ quente: "#ef4444", morno: "#f59e0b", novo: "#3b82f6", negociando: "#8b5cf6" }[s] || "#6b7280")
const getStatusLabel = (s) => ({ quente: "Quente", morno: "Morno", novo: "Novo", negociando: "Negociando" }[s] || s)
const formatCurrency = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v)
const getTimeSince = (d) => { const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000); return h < 24 ? `${h}h` : `${Math.floor(h/24)}d` }

// ==================== STYLES ====================
const S = {
  device: { width: "100%", height: "100%", backgroundColor: "#0a0a0a", borderRadius: 44, overflow: "hidden", position: "relative" as const, fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" },
  island: { position: "absolute" as const, top: 8, left: "50%", transform: "translateX(-50%)", width: 100, height: 28, backgroundColor: "#000", borderRadius: 14, zIndex: 100 },
  tabBar: { position: "absolute" as const, bottom: 0, left: 0, right: 0, height: 80, backgroundColor: "rgba(23,23,23,0.95)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "space-around", paddingBottom: 20, borderTop: "1px solid rgba(255,255,255,0.1)" },
  newBtn: { width: 56, height: 56, borderRadius: 28, background: "linear-gradient(135deg, #3b82f6, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(59,130,246,0.4)", marginTop: -20 },
}

// ==================== ICONS (inline SVG) ====================
const Icon = ({ d, active = false, color = "#fff" }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#3b82f6" : color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>

// ==================== MAIN COMPONENT ====================
export default function FramerApp() {
  const [tab, setTab] = React.useState<TabType>("home")
  const [showActions, setShowActions] = React.useState(false)
  const [modal, setModal] = React.useState<string | null>(null)
  const [detail, setDetail] = React.useState<any>(null)

  const Card = ({ children, style = {} }) => <div style={{ padding: 16, backgroundColor: "#171717", borderRadius: 12, marginBottom: 8, ...style }}>{children}</div>

  const StatusBar = () => (
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px 0" }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
      <div style={{ display: "flex", gap: 4 }}>
        <svg width="20" height="12" viewBox="0 0 20 12" fill="#fff"><rect x="0" y="0" width="16" height="12" rx="3" stroke="#fff" fill="none"/><rect x="2" y="2" width="10" height="8" fill="#fff"/><rect x="17" y="4" width="2" height="4" rx="1" fill="#fff"/></svg>
      </div>
    </div>
  )

  const TabBar = () => (
    <nav style={S.tabBar}>
      {[{id:"home",l:"Início"},{id:"leads",l:"Leads"}].map(t => (
        <button key={t.id} onClick={() => setTab(t.id as TabType)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tab === t.id ? "#3b82f6" : "#737373"} strokeWidth="2"><path d={t.id === "home" ? "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" : "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"}/></svg>
          <span style={{ fontSize: 10, color: tab === t.id ? "#3b82f6" : "#737373" }}>{t.l}</span>
        </button>
      ))}
      <button onClick={() => setShowActions(true)} style={S.newBtn}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
      {[{id:"agenda",l:"Agenda"},{id:"perfil",l:"Perfil"}].map(t => (
        <button key={t.id} onClick={() => setTab(t.id as TabType)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tab === t.id ? "#3b82f6" : "#737373"} strokeWidth="2"><path d={t.id === "agenda" ? "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18" : "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"}/>{t.id === "perfil" && <circle cx="12" cy="7" r="4"/>}</svg>
          <span style={{ fontSize: 10, color: tab === t.id ? "#3b82f6" : "#737373" }}>{t.l}</span>
        </button>
      ))}
    </nav>
  )

  const Sheet = ({ open, onClose, title, children }) => open ? (
    <React.Fragment>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 200 }}/>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#171717", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, zIndex: 201, maxHeight: "75%", overflow: "auto" }}>
        <div style={{ width: 40, height: 4, backgroundColor: "#404040", borderRadius: 2, margin: "0 auto 16px" }}/>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#262626", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="16" height="16" viewBox="0 0 24 24" stroke="#a3a3a3" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        {children}
      </div>
    </React.Fragment>
  ) : null

  const QuickActions = () => (
    <Sheet open={showActions} onClose={() => setShowActions(false)} title="Ação Rápida">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[{l:"Lead",c:"#3b82f6",a:"lead"},{l:"Visita",c:"#22c55e",a:"visita"},{l:"Imóvel",c:"#f59e0b",a:"imovel"},{l:"Proposta",c:"#8b5cf6",a:"proposta"},{l:"Ligação",c:"#737373",a:"ligacao"},{l:"Check-in",c:"#ef4444",a:"checkin"}].map(i => (
          <button key={i.a} onClick={() => { setShowActions(false); setModal(i.a) }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 12, backgroundColor: "#262626", borderRadius: 12, border: "none", cursor: "pointer" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: i.c, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="20" height="20" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
            <span style={{ fontSize: 11, color: "#fff" }}>{i.l}</span>
          </button>
        ))}
      </div>
    </Sheet>
  )

  const FormModal = () => (
    <Sheet open={!!modal} onClose={() => setModal(null)} title={modal === "lead" ? "Novo Lead" : modal === "visita" ? "Agendar Visita" : modal === "imovel" ? "Novo Imóvel" : "Formulário"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input placeholder="Nome" style={{ padding: 14, backgroundColor: "#262626", border: "1px solid #404040", borderRadius: 10, color: "#fff", fontSize: 14 }}/>
        <input placeholder="Telefone" style={{ padding: 14, backgroundColor: "#262626", border: "1px solid #404040", borderRadius: 10, color: "#fff", fontSize: 14 }}/>
        <button onClick={() => setModal(null)} style={{ padding: 14, backgroundColor: "#3b82f6", borderRadius: 10, border: "none", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Salvar</button>
      </div>
    </Sheet>
  )

  const DetailSheet = () => detail ? (
    <Sheet open={!!detail} onClose={() => setDetail(null)} title={detail.cliente}>
      <Card><p style={{ color: "#fff", margin: 0 }}>{detail.hora} • {detail.endereco || "Sem local"}</p></Card>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button style={{ flex: 1, padding: 12, backgroundColor: "#25D366", borderRadius: 10, border: "none", color: "#fff", fontWeight: 600 }}>WhatsApp</button>
        <button style={{ flex: 1, padding: 12, backgroundColor: "#3b82f6", borderRadius: 10, border: "none", color: "#fff", fontWeight: 600 }}>Ligar</button>
      </div>
    </Sheet>
  ) : null

  const Home = () => (
    <div style={{ padding: 20, paddingBottom: 100 }}>
      <p style={{ fontSize: 14, color: "#a3a3a3", margin: 0 }}>{getGreeting()}</p>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "4px 0 20px" }}>{corretor.nome}</h1>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", marginBottom: 20 }}>
        {[{t:"Vendas",v:corretor.vendas},{t:"Conversão",v:`${corretor.taxaConversao}%`},{t:"Comissões",v:formatCurrency(corretor.comissoes)}].map(k => <Card key={k.t} style={{ minWidth: 120 }}><p style={{ fontSize: 12, color: "#a3a3a3", margin: 0 }}>{k.t}</p><p style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "4px 0 0" }}>{k.v}</p></Card>)}
      </div>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: "0 0 12px" }}>Compromissos</h2>
      {compromissos.map(c => <Card key={c.id}><div onClick={() => setDetail(c)} style={{ cursor: "pointer" }}><p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{c.cliente}</p><p style={{ fontSize: 12, color: "#a3a3a3", margin: "4px 0 0" }}>{c.hora} • {c.tipo}</p></div></Card>)}
    </div>
  )

  const Leads = () => (
    <div style={{ padding: 20, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>Leads</h1>
      {leads.map(l => <Card key={l.id}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600 }}>{l.nome[0]}</div><div style={{ flex: 1 }}><p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{l.nome}</p><p style={{ fontSize: 12, color: "#a3a3a3", margin: "2px 0 0" }}>{l.interesse}</p></div><div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: getStatusColor(l.status) }}/></div></Card>)}
    </div>
  )

  const Agenda = () => (
    <div style={{ padding: 20, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>Agenda</h1>
      {compromissos.map(c => <Card key={c.id}><div onClick={() => setDetail(c)} style={{ cursor: "pointer" }}><p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{c.cliente}</p><p style={{ fontSize: 12, color: "#a3a3a3", margin: "4px 0 0" }}>{c.hora} • {c.endereco || c.tipo}</p></div></Card>)}
    </div>
  )

  const Perfil = () => (
    <div style={{ padding: 20, paddingBottom: 100, textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 600, color: "#fff", margin: "0 auto 12px" }}>CS</div>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>{corretor.nome}</h1>
      <p style={{ fontSize: 14, color: "#a3a3a3", margin: "4px 0" }}>{corretor.cargo}</p>
      <div style={{ display: "inline-flex", gap: 4, padding: "6px 12px", backgroundColor: "#262626", borderRadius: 20, marginTop: 8 }}><span>{getRankingBadge(corretor.ranking)}</span><span style={{ fontSize: 12, color: "#fff" }}>#{corretor.ranking}</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24, textAlign: "center" }}>
        <Card><p style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>{corretor.vendas}</p><p style={{ fontSize: 12, color: "#a3a3a3" }}>Vendas</p></Card>
        <Card><p style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>{corretor.taxaConversao}%</p><p style={{ fontSize: 12, color: "#a3a3a3" }}>Conversão</p></Card>
      </div>
    </div>
  )

  return (
    <div style={S.device}>
      <div style={S.island}/>
      <StatusBar/>
      <main style={{ height: "calc(100% - 44px)", overflow: "auto" }}>
        {tab === "home" && <Home/>}
        {tab === "leads" && <Leads/>}
        {tab === "agenda" && <Agenda/>}
        {tab === "perfil" && <Perfil/>}
      </main>
      <TabBar/>
      <QuickActions/>
      <FormModal/>
      <DetailSheet/>
    </div>
  )
}

FramerApp.defaultProps = { width: 390, height: 844 }
addPropertyControls(FramerApp, {})
