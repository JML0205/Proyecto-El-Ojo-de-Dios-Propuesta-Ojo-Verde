import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Flame,
  Gauge,
  Leaf,
  MapPin,
  Radio,
  Satellite,
  Search,
  ShieldAlert,
  Sparkles,
  ThermometerSun,
  Trees,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import colombiaSatellite from "@/assets/colombia-satellite.jpg";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Priority = "Alta" | "Media" | "Baja";
type Status = "Nueva" | "Por verificar" | "Confirmada" | "Descartada";

type AlertRecord = {
  id: string;
  location: string;
  department: string;
  coordinates: string;
  time: string;
  ageMinutes: number;
  priority: Priority;
  status: Status;
  confidence: number;
  factors: { label: string; value: string; icon: typeof Flame }[];
  markerClass: string;
};

const initialAlerts: [AlertRecord, ...AlertRecord[]] = [
  {
    id: "OV-260921-084",
    location: "Vereda El Hato, La Calera",
    department: "Cundinamarca",
    coordinates: "4.7216° N, 73.9694° O",
    time: "12:08",
    ageMinutes: 16,
    priority: "Alta",
    status: "Por verificar",
    confidence: 88,
    markerClass: "marker-cundinamarca",
    factors: [
      { label: "Intensidad térmica", value: "Elevada", icon: ThermometerSun },
      { label: "Cercanía a bosque", value: "1,2 km", icon: Trees },
      { label: "Temperatura ambiente", value: "31 °C", icon: Gauge },
      { label: "Cercanía a población", value: "3,8 km", icon: Users },
    ],
  },
  {
    id: "OV-260921-079",
    location: "Sector Alto del Vino, La Vega",
    department: "Cundinamarca",
    coordinates: "5.0118° N, 74.3376° O",
    time: "11:54",
    ageMinutes: 30,
    priority: "Media",
    status: "Nueva",
    confidence: 71,
    markerClass: "marker-cundinamarca-two",
    factors: [
      { label: "Intensidad térmica", value: "Moderada", icon: ThermometerSun },
      { label: "Cercanía a bosque seco", value: "2,6 km", icon: Trees },
      { label: "Temperatura ambiente", value: "29 °C", icon: Gauge },
      { label: "Cercanía a población", value: "5,1 km", icon: Users },
    ],
  },
  {
    id: "OV-260921-067",
    location: "Vereda La Cabaña, Los Santos",
    department: "Santander",
    coordinates: "6.7518° N, 73.0992° O",
    time: "11:37",
    ageMinutes: 47,
    priority: "Alta",
    status: "Nueva",
    confidence: 92,
    markerClass: "marker-santander",
    factors: [
      { label: "Intensidad térmica", value: "Muy elevada", icon: ThermometerSun },
      { label: "Cercanía a bosque seco", value: "0,7 km", icon: Trees },
      { label: "Temperatura ambiente", value: "34 °C", icon: Gauge },
      { label: "Cercanía a población", value: "2,2 km", icon: Users },
    ],
  },
  {
    id: "OV-260921-052",
    location: "Inspección Apiay, Villavicencio",
    department: "Meta",
    coordinates: "4.0551° N, 73.5627° O",
    time: "11:18",
    ageMinutes: 66,
    priority: "Media",
    status: "Por verificar",
    confidence: 76,
    markerClass: "marker-meta",
    factors: [
      { label: "Intensidad térmica", value: "Moderada", icon: ThermometerSun },
      { label: "Cercanía a bosque", value: "4,3 km", icon: Trees },
      { label: "Temperatura ambiente", value: "32 °C", icon: Gauge },
      { label: "Cercanía a población", value: "6,9 km", icon: Users },
    ],
  },
  {
    id: "OV-260921-041",
    location: "Corregimiento Mingueo, Dibulla",
    department: "La Guajira",
    coordinates: "11.1914° N, 73.2331° O",
    time: "10:59",
    ageMinutes: 85,
    priority: "Baja",
    status: "Descartada",
    confidence: 54,
    markerClass: "marker-guajira",
    factors: [
      { label: "Intensidad térmica", value: "Baja", icon: ThermometerSun },
      { label: "Cercanía a bosque seco", value: "8,1 km", icon: Trees },
      { label: "Temperatura ambiente", value: "36 °C", icon: Gauge },
      { label: "Cercanía a población", value: "11 km", icon: Users },
    ],
  },
];

const defaultAlert = initialAlerts[0];

const priorityStyles: Record<Priority, string> = {
  Alta: "bg-priority-high-soft text-priority-high border-priority-high/20",
  Media: "bg-priority-medium-soft text-priority-medium-ink border-priority-medium/25",
  Baja: "bg-priority-low-soft text-priority-low-ink border-priority-low/20",
};

const priorityDot: Record<Priority, string> = {
  Alta: "bg-priority-high",
  Media: "bg-priority-medium",
  Baja: "bg-priority-low",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ojo Verde | Monitoreo ambiental" },
      {
        name: "description",
        content:
          "Prototipo académico para priorizar y verificar señales satelitales de posibles focos de calor en Colombia.",
      },
      { property: "og:title", content: "Ojo Verde | Monitoreo ambiental" },
      {
        property: "og:description",
        content: "Monitoreo y respuesta temprana ante posibles incendios forestales en Colombia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OjoVerdeDashboard,
});

function OjoVerdeDashboard() {
  const [alerts, setAlerts] = useState<AlertRecord[]>(initialAlerts);
  const [department, setDepartment] = useState("Cundinamarca");
  const [priority, setPriority] = useState<"Todas" | Priority>("Todas");
  const [status, setStatus] = useState<"Todos" | Status>("Todos");
  const [selectedId, setSelectedId] = useState(defaultAlert.id);
  const [draftStatus, setDraftStatus] = useState<Status>(defaultAlert.status);
  const [saved, setSaved] = useState(false);

  const visibleAlerts = useMemo(
    () =>
      alerts.filter(
        (alert) =>
          (department === "Nacional" || alert.department === department) &&
          (priority === "Todas" || alert.priority === priority) &&
          (status === "Todos" || alert.status === status),
      ),
    [alerts, department, priority, status],
  );

  const selectedAlert = alerts.find((alert) => alert.id === selectedId) ?? defaultAlert;

  function selectAlert(alert: AlertRecord) {
    setSelectedId(alert.id);
    setDraftStatus(alert.status);
    setSaved(false);
  }

  function saveDecision() {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === selectedAlert.id ? { ...alert, status: draftStatus } : alert,
      ),
    );
    setSaved(true);
  }

  const highCount = visibleAlerts.filter((alert) => alert.priority === "Alta").length;
  const pendingCount = visibleAlerts.filter(
    (alert) => alert.status === "Nueva" || alert.status === "Por verificar",
  ).length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-header-border bg-header text-header-foreground">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-md bg-brand-green text-header-foreground shadow-brand">
              <Leaf className="size-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="font-display text-2xl font-bold">Ojo Verde</h1>
                <span className="rounded-sm border border-header-border px-1.5 py-0.5 text-[10px] font-bold uppercase text-header-muted">
                  Académico
                </span>
              </div>
              <p className="text-xs text-header-muted sm:text-sm">
                Monitoreo y respuesta temprana ante incendios forestales
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-56">
              <label className="mb-1 block text-[11px] font-semibold uppercase text-header-muted">
                Departamento
              </label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="border-header-border bg-header-elevated text-header-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Cundinamarca", "Santander", "Meta", "La Guajira", "Nacional"].map(
                    (item) => (
                      <SelectItem value={item} key={item}>
                        {item === "Nacional" ? "Vista nacional" : item}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pb-2 text-xs text-header-muted">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-green opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-green" />
              </span>
              Última actualización: datos simulados
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-warning-border bg-warning-soft text-warning-ink">
        <div className="mx-auto flex max-w-[1600px] items-start gap-3 px-4 py-3 sm:items-center sm:px-6 lg:px-8">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 sm:mt-0" aria-hidden="true" />
          <p className="text-sm font-semibold">
            Una alerta no equivale a un incendio confirmado.
            <span className="ml-1 font-normal">Las alertas requieren verificación humana.</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <section aria-labelledby="summary-title">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="section-kicker">Panorama operativo</p>
              <h2 id="summary-title" className="font-display text-xl font-bold">
                Señales bajo observación
              </h2>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">21 sep 2026 · 12:24</span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryCard icon={Radio} label="Alertas visibles" value={visibleAlerts.length} note={department} />
            <SummaryCard icon={Flame} label="Prioridad alta" value={highCount} note="Atención inmediata" tone="high" />
            <SummaryCard icon={Search} label="Por verificar" value={pendingCount} note="Decisión pendiente" tone="medium" />
            <SummaryCard icon={Clock3} label="Antigüedad de datos" value="16 min" note="Ventana más reciente" />
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.75fr)]" aria-label="Centro de monitoreo">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-panel">
            <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="section-kicker">Vista geoespacial</p>
                <h2 className="font-display text-lg font-bold">Mapa de señales priorizadas</h2>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-medium text-muted-foreground" aria-label="Leyenda">
                {(["Alta", "Media", "Baja"] as Priority[]).map((item) => (
                  <span className="flex items-center gap-1.5" key={item}>
                    <span className={cn("size-2.5 rounded-full", priorityDot[item])} /> {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="map-stage relative min-h-[440px] overflow-hidden sm:min-h-[600px]">
              <div className="map-grid absolute inset-0" />
              <div className="absolute left-4 top-4 z-20 rounded-md border border-map-border bg-map-overlay px-3 py-2 text-xs text-map-foreground backdrop-blur-sm">
                <span className="flex items-center gap-2 font-semibold">
                  <Satellite className="size-4 text-brand-green" /> Capa satelital simulada
                </span>
              </div>

              <div className="colombia-map" aria-label="Mapa estilizado de Colombia">
                <img
                  src={colombiaSatellite}
                  alt="Textura satelital simulada del territorio colombiano"
                  width={1024}
                  height={1024}
                  className="size-full object-cover"
                />
              </div>

              {alerts.map((alert) => {
                const inScope = department === "Nacional" || alert.department === department;
                return (
                  <button
                    key={alert.id}
                    type="button"
                    className={cn(
                      "map-marker group absolute z-20",
                      alert.markerClass,
                      !inScope && "pointer-events-none opacity-20",
                    )}
                    onClick={() => selectAlert(alert)}
                    aria-label={`Ver alerta ${alert.id} en ${alert.location}`}
                  >
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-full border-2 border-map-marker-ring shadow-marker transition-transform group-hover:scale-110",
                        priorityDot[alert.priority],
                        selectedId === alert.id && "ring-4 ring-map-focus",
                      )}
                    >
                      <Flame className="size-4 text-map-marker-icon" />
                    </span>
                    <span className="marker-label">{alert.location.split(",")[1]?.trim()}</span>
                  </button>
                );
              })}

              <div className="absolute bottom-4 left-4 z-20 max-w-xs rounded-md border border-map-border bg-map-overlay px-3 py-2 text-[11px] leading-relaxed text-map-muted backdrop-blur-sm">
                Representación orientativa. Sin precisión cartográfica y sin conexión a fuentes en tiempo real.
              </div>
            </div>
          </div>

          <aside className="flex min-h-[560px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-panel" aria-labelledby="alerts-title">
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-kicker">Bandeja operativa</p>
                  <h2 id="alerts-title" className="font-display text-lg font-bold">Alertas</h2>
                </div>
                <span className="rounded-sm bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                  {visibleAlerts.length} visibles
                </span>
              </div>

              <div className="mt-4 flex gap-1 overflow-x-auto pb-1" aria-label="Filtrar por prioridad">
                {(["Todas", "Alta", "Media", "Baja"] as const).map((item) => (
                  <Button
                    key={item}
                    type="button"
                    size="sm"
                    variant={priority === item ? "default" : "ghost"}
                    onClick={() => setPriority(item)}
                    aria-pressed={priority === item}
                    className="shrink-0"
                  >
                    {item}
                  </Button>
                ))}
              </div>
              <div className="mt-2">
                <Select value={status} onValueChange={(value) => setStatus(value as "Todos" | Status)}>
                  <SelectTrigger aria-label="Filtrar por estado" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos los estados</SelectItem>
                    {(["Nueva", "Por verificar", "Confirmada", "Descartada"] as Status[]).map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="max-h-[560px] flex-1 overflow-y-auto" aria-live="polite">
              {visibleAlerts.length > 0 ? (
                visibleAlerts.map((alert) => (
                  <AlertListItem
                    key={alert.id}
                    alert={alert}
                    selected={selectedId === alert.id}
                    onSelect={() => selectAlert(alert)}
                  />
                ))
              ) : (
                <div className="grid min-h-52 place-items-center p-8 text-center">
                  <div>
                    <CircleDot className="mx-auto size-7 text-muted-foreground" />
                    <p className="mt-3 text-sm font-semibold">No hay señales con estos filtros</p>
                    <p className="mt-1 text-xs text-muted-foreground">Prueba otra prioridad o estado.</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </section>

        <section className="mt-4 overflow-hidden rounded-lg border border-border bg-card shadow-panel" aria-labelledby="detail-title">
          <div className="grid lg:grid-cols-[1.1fr_1fr_0.8fr]">
            <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="section-kicker">Ficha de detalle</p>
                  <h2 id="detail-title" className="mt-1 font-mono text-lg font-bold">{selectedAlert.id}</h2>
                </div>
                <PriorityBadge priority={selectedAlert.priority} />
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <DetailRow icon={MapPin} label="Ubicación" value={selectedAlert.location} />
                <DetailRow icon={CircleDot} label="Coordenadas simuladas" value={selectedAlert.coordinates} />
                <DetailRow icon={Clock3} label="Observación" value={`21 sep 2026 · ${selectedAlert.time}`} />
                <DetailRow icon={Satellite} label="Fuente prevista" value="NASA FIRMS" />
              </div>
              <div className="mt-5 rounded-md bg-muted p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">Nivel de confianza</span>
                  <span className="font-mono font-bold">{selectedAlert.confidence}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-brand-green" style={{ width: `${selectedAlert.confidence}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Estimación simulada, no constituye confirmación.</p>
              </div>
            </div>

            <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
              <p className="section-kicker">Priorización transparente</p>
              <h3 className="mt-1 font-display text-base font-bold">Factores considerados</h3>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {selectedAlert.factors.map((factor) => (
                  <div key={factor.label} className="rounded-md border border-border bg-background p-3">
                    <factor.icon className="size-4 text-brand-green-strong" />
                    <p className="mt-3 text-xs text-muted-foreground">{factor.label}</p>
                    <p className="mt-0.5 text-sm font-bold">{factor.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5">
              <p className="section-kicker">Decisión operativa</p>
              <h3 className="mt-1 font-display text-base font-bold">Registrar verificación</h3>
              <label className="mt-5 block text-xs font-semibold text-muted-foreground" htmlFor="decision-status">
                Estado de la alerta
              </label>
              <Select value={draftStatus} onValueChange={(value) => { setDraftStatus(value as Status); setSaved(false); }}>
                <SelectTrigger id="decision-status" className="mt-2 h-11 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Nueva", "Por verificar", "Confirmada", "Descartada"] as Status[]).map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="mt-3 h-11 w-full" onClick={saveDecision}>
                {saved ? <Check /> : <ShieldAlert />}
                {saved ? "Decisión guardada" : "Guardar decisión"}
              </Button>
              <div className="mt-4 flex gap-2 rounded-md border border-info-border bg-info-soft p-3 text-xs leading-relaxed text-info-ink">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <p>La decisión final pertenece al operador humano y debe apoyarse en verificación en territorio.</p>
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />
      </div>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span className="flex items-center gap-2 font-semibold text-foreground"><Leaf className="size-4 text-brand-green-strong" /> Ojo Verde · Prototipo académico</span>
          <span>Todos los datos, ubicaciones y resultados son simulados.</span>
        </div>
      </footer>
    </main>
  );
}

function SummaryCard({ icon: Icon, label, value, note, tone = "default" }: { icon: typeof Radio; label: string; value: number | string; note: string; tone?: "default" | "high" | "medium" }) {
  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-panel sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{label}</p>
          <p className="mt-2 font-mono text-2xl font-bold sm:text-3xl">{value}</p>
        </div>
        <span className={cn("grid size-9 place-items-center rounded-md", tone === "high" ? "bg-priority-high-soft text-priority-high" : tone === "medium" ? "bg-priority-medium-soft text-priority-medium-ink" : "bg-brand-soft text-brand-green-strong")}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 truncate text-[11px] text-muted-foreground">{note}</p>
    </article>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={cn("inline-flex rounded-sm border px-2 py-1 text-[11px] font-bold", priorityStyles[priority])}>{priority}</span>;
}

function AlertListItem({ alert, selected, onSelect }: { alert: AlertRecord; selected: boolean; onSelect: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onSelect}
      className={cn("h-auto w-full justify-start rounded-none border-b border-border px-4 py-4 text-left whitespace-normal hover:bg-muted/70", selected && "border-l-[3px] border-l-brand-green bg-brand-soft")}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-muted-foreground">{alert.id}</span>
          <PriorityBadge priority={alert.priority} />
        </div>
        <p className="mt-2 truncate text-sm font-bold text-foreground">{alert.location}</p>
        <p className="mt-1 text-xs text-muted-foreground">{alert.department}</p>
        <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Clock3 className="size-3" /> {alert.time}</span>
          <span className="flex items-center gap-1 font-semibold text-foreground"><span className={cn("size-1.5 rounded-full", alert.status === "Confirmada" ? "bg-priority-high" : alert.status === "Descartada" ? "bg-muted-foreground" : "bg-priority-medium")} />{alert.status}</span>
        </div>
      </div>
      <ChevronRight className="ml-2 size-4 shrink-0 text-muted-foreground" />
    </Button>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[20px_1fr] gap-x-2">
      <Icon className="mt-0.5 size-4 text-brand-green-strong" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-semibold">{value}</p>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Satellite, title: "Se consultan señales", text: "Se recopilan observaciones satelitales de posibles focos de calor." },
    { icon: Sparkles, title: "Se prioriza", text: "Reglas transparentes ordenan las señales según factores observables." },
    { icon: ShieldAlert, title: "El coordinador verifica", text: "Una persona revisa el contexto y registra su decisión responsable." },
    { icon: Trees, title: "Evolución futura", text: "Se podrán integrar clima, rutas y cámaras debidamente autorizadas." },
  ];
  return (
    <section className="py-12" aria-labelledby="how-title">
      <div className="mb-6">
        <p className="section-kicker">Proceso responsable</p>
        <h2 id="how-title" className="font-display text-2xl font-bold">Cómo funciona</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <article key={step.title} className="relative border-l-2 border-brand-green pl-5">
            <span className="font-mono text-xs font-bold text-brand-green-strong">PASO {index + 1}</span>
            <step.icon className="mt-4 size-5 text-brand-green-strong" />
            <h3 className="mt-3 font-display text-base font-bold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}