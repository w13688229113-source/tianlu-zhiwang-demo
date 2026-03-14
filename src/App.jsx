import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Wind,
  Mountain,
  Route,
  BatteryMedium,
  AlertTriangle,
  Cpu,
  MapPinned,
  Package,
  Radar,
  TimerReset,
  Zap,
  Snowflake,
  Trees,
  CloudRain,
  Plane,
  Warehouse,
  Settings2,
  PencilLine,
} from "lucide-react";

const baseOrchards = [
  { id: "O1", name: "盐源县苹果园A", altitude: 2350, risk: "中", distance: 18, produce: "苹果", color: "from-red-400 to-red-500", x: 14, y: 24 },
  { id: "O2", name: "会理石榴园B", altitude: 2120, risk: "低", distance: 12, produce: "石榴", color: "from-pink-400 to-rose-500", x: 34, y: 42 },
  { id: "O3", name: "德昌蓝莓园C", altitude: 2480, risk: "高", distance: 22, produce: "蓝莓", color: "from-indigo-400 to-blue-500", x: 56, y: 20 },
  { id: "O4", name: "冕宁樱桃园D", altitude: 2260, risk: "中", distance: 15, produce: "樱桃", color: "from-rose-400 to-red-400", x: 26, y: 14 },
];

const baseHubs = [
  { id: "H1", name: "县级冷链接驳中心", altitude: 1580, x: 79, y: 72 },
  { id: "H2", name: "乡镇前置集散点", altitude: 1710, x: 66, y: 58 },
];

const initialOrders = [
  { id: "TL-001", orchard: "盐源县苹果园A", hub: "县级冷链接驳中心", weight: 18, priority: "高", eta: 26, status: "待分配" },
  { id: "TL-002", orchard: "会理石榴园B", hub: "乡镇前置集散点", weight: 12, priority: "中", eta: 19, status: "待分配" },
  { id: "TL-003", orchard: "德昌蓝莓园C", hub: "县级冷链接驳中心", weight: 8, priority: "高", eta: 31, status: "待分配" },
  { id: "TL-004", orchard: "冕宁樱桃园D", hub: "县级冷链接驳中心", weight: 10, priority: "低", eta: 22, status: "待分配" },
];

const initialDrones = [
  { id: "UAV-01", model: "山鹰M1", battery: 82, load: 20, status: "待命", area: "北线" },
  { id: "UAV-02", model: "山鹰M2", battery: 64, load: 15, status: "执行中", area: "西线" },
  { id: "UAV-03", model: "山鹰M1", battery: 91, load: 25, status: "待命", area: "东线" },
  { id: "UAV-04", model: "山鹰L", battery: 48, load: 10, status: "充电中", area: "南线" },
];

const weatherModes = {
  stable: { name: "稳定天气", wind: "3级", visibility: "良好", risk: "低", penalty: 0, icon: Wind },
  gust: { name: "峡谷突发风切变", wind: "6级", visibility: "一般", risk: "高", penalty: 9, icon: AlertTriangle },
  rain: { name: "局部短时降雨", wind: "4级", visibility: "中", risk: "中", penalty: 5, icon: CloudRain },
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ children, className = "" }) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}

function CardHeader({ children, className = "" }) {
  return <div className={cn("px-6 pt-6", className)}>{children}</div>;
}

function CardTitle({ children, className = "" }) {
  return <h3 className={cn("text-lg font-semibold text-slate-900", className)}>{children}</h3>;
}

function CardContent({ children, className = "" }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

function Button({
  children,
  onClick,
  className = "",
  variant = "default",
  type = "button",
}) {
  const styles =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      : "border border-slate-900 bg-slate-900 text-white hover:bg-slate-800";

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition",
        styles,
        className
      )}
    >
      {children}
    </button>
  );
}

function Badge({ children, className = "", variant = "default" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variant === "outline" ? "border border-slate-300 bg-white text-slate-700" : "",
        className
      )}
    >
      {children}
    </span>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500",
        props.className || ""
      )}
    />
  );
}

function Progress({ value, className = "" }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-200", className)}>
      <div
        className="h-full rounded-full bg-slate-800 transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function Alert({ children, className = "" }) {
  return <div className={cn("rounded-3xl border p-5", className)}>{children}</div>;
}

function AlertTitle({ children, className = "" }) {
  return <div className={cn("font-semibold", className)}>{children}</div>;
}

function AlertDescription({ children, className = "" }) {
  return <div className={cn("mt-1 text-sm", className)}>{children}</div>;
}

function StatCard({ title, value, icon: Icon, sub }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500">{title}</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
            <div className="mt-1 text-xs text-slate-500">{sub}</div>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function riskBadge(level) {
  if (level === "高") return "bg-red-100 text-red-700";
  if (level === "中") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

function priorityScore(priority) {
  return priority === "高" ? 30 : priority === "中" ? 18 : 8;
}

function scheduleOrders(orders, drones, orchards, weather, emergency) {
  const available = drones
    .filter((d) => d.status !== "充电中")
    .map((d) => ({ ...d, freeBattery: d.battery }));

  const rankedOrders = [...orders]
    .map((o) => {
      const orchard = orchards.find((x) => x.name === o.orchard);
      const extra = emergency === o.id ? 25 : 0;
      const terrainBonus = orchard?.risk === "高" ? 8 : orchard?.risk === "中" ? 4 : 1;
      return {
        ...o,
        score: priorityScore(o.priority) + (orchard?.distance || 10) + terrainBonus + extra,
        terrainRisk: orchard?.risk || "低",
      };
    })
    .sort((a, b) => b.score - a.score);

  const results = rankedOrders.map((order) => {
    const orchard = orchards.find((x) => x.name === order.orchard);
    const terrainPenalty = orchard?.risk === "高" ? 6 : orchard?.risk === "中" ? 3 : 0;
    const needBattery = Math.min(
      58,
      Math.round((orchard?.distance || 15) * 1.5 + weather.penalty + terrainPenalty + order.weight * 0.7)
    );
    const candidates = available
      .filter((d) => d.load >= order.weight && d.freeBattery >= needBattery)
      .sort((a, b) => b.freeBattery - a.freeBattery);

    if (!candidates.length) {
      return {
        ...order,
        assign: "人工兜底/延后发运",
        route: `${order.orchard} → 临时中转点 → ${order.hub}`,
        eta: order.eta + weather.penalty + 12,
        batteryCost: needBattery,
        status: "待人工处理",
      };
    }

    const chosen = candidates[0];
    chosen.freeBattery -= needBattery;
    return {
      ...order,
      assign: chosen.id,
      route: `${order.orchard} → 山脊航路 → ${order.hub}`,
      eta: order.eta + weather.penalty + terrainPenalty,
      batteryCost: needBattery,
      status: emergency === order.id ? "优先执行" : "已分配",
    };
  });

  const updatedDrones = drones.map((d) => {
    const used = results.filter((r) => r.assign === d.id).reduce((sum, r) => sum + r.batteryCost, 0);
    const state = used > 0 ? "任务已编排" : d.status;
    return {
      ...d,
      batteryAfter: Math.max(0, d.battery - used),
      dispatchCount: results.filter((r) => r.assign === d.id).length,
      status: state,
    };
  });

  return { results, updatedDrones };
}

function ScenicTwinView({ orchards, hubs, results, weather }) {
  const WeatherIcon = weather.icon || Wind;
  return (
    <div className="relative h-[460px] overflow-hidden rounded-3xl border bg-gradient-to-b from-sky-100 via-emerald-50 to-lime-50 p-4">
      <div className="absolute inset-x-0 top-0 h-24 bg-white/25" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-emerald-300/35 to-transparent" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="mount1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="mount2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <path d="M0 70 L12 46 L20 57 L30 32 L42 56 L52 24 L67 54 L79 38 L100 66 L100 100 L0 100 Z" fill="url(#mount1)" />
        <path d="M0 77 L8 58 L16 66 L28 44 L38 70 L51 35 L61 63 L74 49 L89 72 L100 62 L100 100 L0 100 Z" fill="url(#mount2)" />
        <path d="M8 87 C18 77, 26 78, 39 84 S61 92, 74 82 S92 77, 100 86" stroke="#0ea5e9" strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity="0.7" />
      </svg>

      <div className="absolute right-4 top-4 flex items-center gap-2 rounded-2xl border bg-white/80 px-3 py-2 text-xs shadow-sm backdrop-blur">
        <WeatherIcon className="h-4 w-4 text-slate-700" />
        当前气象：{weather.name}
      </div>

      <div className="absolute left-4 top-4 rounded-2xl border bg-white/80 px-3 py-2 text-xs shadow-sm backdrop-blur">
        场景：高山果园 → 山脊航路 → 冷链接驳中心
      </div>

      {orchards.map((o) => (
        <motion.div
          key={o.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute"
          style={{ left: `${o.x}%`, top: `${o.y}%` }}
        >
          <div className="rounded-2xl border bg-white/90 px-3 py-2 shadow-md backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${o.color} text-white`}>
                <Trees className="h-4 w-4" />
              </div>
              <div>
                <div>{o.name}</div>
                <div className="text-[11px] font-normal text-slate-500">{o.produce} · 海拔 {o.altitude}m</div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge className={riskBadge(o.risk)}>{o.risk}风险</Badge>
              <Badge variant="outline">距中心 {o.distance}km</Badge>
            </div>
          </div>
        </motion.div>
      ))}

      {hubs.map((h) => (
        <div key={h.id} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
          <div className="rounded-2xl border bg-slate-900 px-3 py-2 text-white shadow-md">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Snowflake className="h-4 w-4" />
              {h.name}
            </div>
            <div className="mt-1 text-[11px] text-slate-300">冷链中转 / 海拔 {h.altitude}m</div>
          </div>
        </div>
      ))}

      {results.slice(0, 4).map((r, i) => {
        const orchard = orchards.find((o) => o.name === r.orchard);
        const hub = hubs.find((h) => h.name === r.hub);
        if (!orchard || !hub) return null;
        return (
          <React.Fragment key={r.id}>
            <div
              className="absolute h-px origin-left border-t-2 border-dashed border-sky-500/80"
              style={{
                left: `${orchard.x + 8}%`,
                top: `${orchard.y + 9}%`,
                width: `${Math.max(10, hub.x - orchard.x - 3)}%`,
                transform: `rotate(${i % 2 === 0 ? 20 : 13}deg)`,
              }}
            />
            <motion.div
              animate={{ x: [0, 18, 0], y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3.4 + i, ease: "easeInOut" }}
              className="absolute"
              style={{ left: `${orchard.x + 24}%`, top: `${orchard.y + 8}%` }}
            >
              <div className="rounded-full border bg-white p-2 shadow-sm">
                <Plane className="h-4 w-4 text-sky-700" />
              </div>
            </motion.div>
          </React.Fragment>
        );
      })}

      <div className="absolute bottom-4 left-4 right-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border bg-white/85 p-3 text-xs text-slate-600 shadow-sm">果园端：采后打包、任务发起、待起飞。</div>
        <div className="rounded-2xl border bg-white/85 p-3 text-xs text-slate-600 shadow-sm">空中端：山脊优先航路、避开峡谷突风区。</div>
        <div className="rounded-2xl border bg-white/85 p-3 text-xs text-slate-600 shadow-sm">中心端：冷链接驳、分拨、电商发货衔接。</div>
      </div>
    </div>
  );
}

export default function TianluZhiwangDemo() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState(initialOrders);
  const [drones, setDrones] = useState(initialDrones);
  const [orchards, setOrchards] = useState(baseOrchards);
  const [weatherKey, setWeatherKey] = useState("stable");
  const [weatherState, setWeatherState] = useState(weatherModes.stable);
  const [emergency, setEmergency] = useState("");
  const [newOrder, setNewOrder] = useState({ orchard: baseOrchards[0].name, hub: baseHubs[0].name, weight: 10, priority: "中" });

  const { results, updatedDrones } = useMemo(
    () => scheduleOrders(orders, drones, orchards, weatherState, emergency),
    [orders, drones, orchards, weatherState, emergency]
  );

  const totalTasks = results.filter((r) => r.status !== "待人工处理").length;
  const avgEta = results.length ? Math.round(results.reduce((s, r) => s + r.eta, 0) / results.length) : 0;
  const lowBatteryCount = updatedDrones.filter((d) => d.batteryAfter <= 30).length;

  const applyWeatherMode = (key) => {
    setWeatherKey(key);
    setWeatherState(weatherModes[key]);
  };

  const addOrder = () => {
    const nextId = `TL-${String(orders.length + 1).padStart(3, "0")}`;
    setOrders((prev) => [
      ...prev,
      {
        id: nextId,
        orchard: newOrder.orchard,
        hub: newOrder.hub,
        weight: Number(newOrder.weight),
        priority: newOrder.priority,
        eta: 20,
        status: "待分配",
      },
    ]);
  };

  const updateOrder = (id, field, value) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: field === "weight" || field === "eta" ? Number(value) : value } : o)));
  };

  const updateDrone = (id, field, value) => {
    setDrones((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: field === "battery" || field === "load" ? Number(value) : value } : d)));
  };

  const updateOrchard = (id, field, value) => {
    setOrchards((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: field === "altitude" || field === "distance" ? Number(value) : value } : o)));
  };

  const resetDemo = () => {
    setOrders(initialOrders);
    setDrones(initialDrones);
    setOrchards(baseOrchards);
    setEmergency("");
    setWeatherKey("stable");
    setWeatherState(weatherModes.stable);
    setNewOrder({ orchard: baseOrchards[0].name, hub: baseHubs[0].name, weight: 10, priority: "中" });
  };

  const TabButton = ({ value, label }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "rounded-2xl px-4 py-3 text-sm font-medium transition",
        activeTab === value
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-600 hover:bg-slate-50"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-lg"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                <Cpu className="h-4 w-4" /> AI多智能体协同演示系统
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">天路智网 Demo</h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-200">
                面向高山农业低空物流场景，演示高山果园、无人机运力、冷链接驳中心与调度中枢之间的协同决策。新增了实时参数控制台，可直接修改订单、气象、无人机与果园参数。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:w-[380px]">
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-xs text-slate-300">当前运行模式</div>
                <div className="mt-2 text-lg font-semibold">{weatherState.name}</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-xs text-slate-300">系统建议</div>
                <div className="mt-2 text-lg font-semibold">优先高时效订单</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="今日接入订单" value={`${orders.length} 单`} icon={Package} sub="覆盖高山果园与集散中心" />
          <StatCard title="成功自动编排" value={`${totalTasks} 单`} icon={Route} sub="AI调度中枢已完成任务分配" />
          <StatCard title="平均运输时长" value={`${avgEta} 分钟`} icon={Truck} sub="结合天气与地形动态估算" />
          <StatCard title="低电量风险无人机" value={`${lowBatteryCount} 架`} icon={BatteryMedium} sub="建议优先回收或补能" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            <TabButton value="dashboard" label="驾驶舱" />
            <TabButton value="orders" label="订单接入" />
            <TabButton value="dispatch" label="智能调度" />
            <TabButton value="reroute" label="动态重调度" />
            <TabButton value="controls" label="实时控制台" />
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><MapPinned className="h-5 w-5" /> 高山果园低空物流数字孪生视图</CardTitle>
              </CardHeader>
              <CardContent>
                <ScenicTwinView orchards={orchards} hubs={baseHubs} results={results} weather={weatherState} />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Wind className="h-5 w-5" /> 微气象状态</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(weatherModes).map(([key, item]) => (
                      <Button key={key} variant={weatherKey === key ? "default" : "outline"} className="rounded-2xl" onClick={() => applyWeatherMode(key)}>
                        {item.name}
                      </Button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-slate-50 p-3">风力：<span className="font-medium">{weatherState.wind}</span></div>
                    <div className="rounded-2xl bg-slate-50 p-3">能见度：<span className="font-medium">{weatherState.visibility}</span></div>
                    <div className="rounded-2xl bg-slate-50 p-3">风险：<span className="font-medium">{weatherState.risk}</span></div>
                    <div className="rounded-2xl bg-slate-50 p-3">延时修正：<span className="font-medium">+{weatherState.penalty} 分钟</span></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Radar className="h-5 w-5" /> 多智能体运行状态</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-3">订单智能体：识别时效、重量与优先级，实时进入任务池。</div>
                  <div className="rounded-2xl bg-slate-50 p-3">气象智能体：监控山谷风、降雨、能见度与延时修正。</div>
                  <div className="rounded-2xl bg-slate-50 p-3">无人机智能体：上报载重、电量、可达航线与状态。</div>
                  <div className="rounded-2xl bg-slate-50 p-3">调度中枢智能体：综合地形、距离、天气、优先级后输出最优编排。</div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Warehouse className="h-5 w-5" /> 产品链路说明</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-3">果园端：农户/合作社发起运输需求。</div>
                  <div className="rounded-2xl bg-slate-50 p-3">低空端：无人机完成短驳和快速转运。</div>
                  <div className="rounded-2xl bg-slate-50 p-3">中心端：冷链接驳、分拨与电商发货衔接。</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">新增运输订单</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 text-sm text-slate-500">起点果园</div>
                  <div className="grid grid-cols-2 gap-2">
                    {orchards.map((o) => (
                      <Button key={o.id} variant={newOrder.orchard === o.name ? "default" : "outline"} className="justify-start rounded-2xl" onClick={() => setNewOrder((p) => ({ ...p, orchard: o.name }))}>
                        {o.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-sm text-slate-500">目的地</div>
                  <div className="flex gap-2">
                    {baseHubs.map((h) => (
                      <Button key={h.id} variant={newOrder.hub === h.name ? "default" : "outline"} className="rounded-2xl" onClick={() => setNewOrder((p) => ({ ...p, hub: h.name }))}>
                        {h.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-2 text-sm text-slate-500">货重（kg）</div>
                    <Input type="number" value={newOrder.weight} onChange={(e) => setNewOrder((p) => ({ ...p, weight: e.target.value }))} className="rounded-2xl" />
                  </div>
                  <div>
                    <div className="mb-2 text-sm text-slate-500">优先级</div>
                    <div className="flex gap-2">
                      {["高","中","低"].map((p) => (
                        <Button key={p} variant={newOrder.priority === p ? "default" : "outline"} className="rounded-2xl" onClick={() => setNewOrder((prev) => ({ ...prev, priority: p }))}>{p}</Button>
                      ))}
                    </div>
                  </div>
                </div>
                <Button className="w-full rounded-2xl" onClick={addOrder}>提交订单并进入调度池</Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">订单任务池（可在控制台实时修改）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-medium">{o.id} · {o.orchard}</div>
                        <div className="mt-1 text-sm text-slate-500">{o.hub} · {o.weight}kg · 预计基础时长 {o.eta} 分钟</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={riskBadge(o.priority)}>{o.priority}优先</Badge>
                        <Badge variant="outline">{o.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "dispatch" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">智能调度结果</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.map((r) => (
                  <div key={r.id} className="rounded-2xl border p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-medium">{r.id} → {r.assign}</div>
                        <div className="mt-1 text-sm text-slate-500">{r.route}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={riskBadge(r.terrainRisk)}>{r.terrainRisk}地形风险</Badge>
                        <Badge variant="outline">{r.status}</Badge>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                      <div className="rounded-2xl bg-slate-50 p-3">货重：{r.weight}kg</div>
                      <div className="rounded-2xl bg-slate-50 p-3">时长：{r.eta}分钟</div>
                      <div className="rounded-2xl bg-slate-50 p-3">电量消耗：{r.batteryCost}%</div>
                      <div className="rounded-2xl bg-slate-50 p-3">优先级：{r.priority}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">无人机资源池</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {updatedDrones.map((d) => (
                  <div key={d.id} className="rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{d.id} · {d.model}</div>
                        <div className="mt-1 text-sm text-slate-500">区域：{d.area} · 最大载重 {d.load}kg</div>
                      </div>
                      <Badge variant="outline">{d.status}</Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>剩余电量</span>
                        <span>{d.batteryAfter}%</span>
                      </div>
                      <Progress value={d.batteryAfter} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>已编排任务 {d.dispatchCount || 0} 个</span>
                        <span>{d.batteryAfter <= 30 ? "建议优先补能" : "状态稳定"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "reroute" && (
          <div className="space-y-6">
            <Alert className="border-amber-200 bg-amber-50 text-amber-900">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700" />
                <div>
                  <AlertTitle>动态重调度演示</AlertTitle>
                  <AlertDescription className="text-amber-800">
                    通过模拟风切变、订单插队、低电量等突发事件，展示系统如何在不依赖人工派单的情况下完成实时重算与资源重配置。
                  </AlertDescription>
                </div>
              </div>
            </Alert>

            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">触发重调度事件</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start rounded-2xl" variant={weatherKey === "gust" ? "default" : "outline"} onClick={() => applyWeatherMode("gust")}>
                    <Wind className="mr-2 h-4 w-4" /> 触发峡谷突发风切变
                  </Button>
                  <Button className="w-full justify-start rounded-2xl" variant="outline" onClick={() => setEmergency("TL-003")}>
                    <Zap className="mr-2 h-4 w-4" /> 将 TL-003 提升为紧急订单
                  </Button>
                  <Button className="w-full justify-start rounded-2xl" variant="outline" onClick={() => setDrones((prev) => prev.map((d) => d.id === "UAV-03" ? { ...d, battery: 29 } : d))}>
                    <BatteryMedium className="mr-2 h-4 w-4" /> 模拟 UAV-03 低电量告警
                  </Button>
                  <Button className="w-full rounded-2xl" onClick={resetDemo}>
                    <TimerReset className="mr-2 h-4 w-4" /> 恢复默认演示状态
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">重调度后系统解释</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6">
                    当前天气模式：<span className="font-medium">{weatherState.name}</span>。气象智能体已更新区域风险，调度中枢将自动提高高优先级订单的资源占用权重，并对高海拔果园线路进行惩罚修正。
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6">
                    当前紧急订单：<span className="font-medium">{emergency || "无"}</span>。如有紧急订单，系统优先保障时效，将低优先级任务后置或转交人工兜底。
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6">
                    当前低电量无人机：<span className="font-medium">{updatedDrones.filter((d) => d.batteryAfter <= 30).map((d) => d.id).join("、") || "无"}</span>。系统已降低其可分配权重，避免执行高风险长距离任务。
                  </div>
                  <div className="rounded-2xl border border-dashed p-4 text-sm text-slate-600">
                    答辩建议：这里可以重点讲“不是简单派单，而是订单智能体、无人机智能体、气象智能体和调度中枢智能体在统一规则下协同决策”，突出项目的AI属性和数字新基建定位。
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "controls" && (
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Settings2 className="h-5 w-5" /> 气象参数实时修改</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-2 text-sm text-slate-500">风力描述</div>
                    <Input value={weatherState.wind} onChange={(e) => setWeatherState((prev) => ({ ...prev, wind: e.target.value }))} />
                  </div>
                  <div>
                    <div className="mb-2 text-sm text-slate-500">能见度</div>
                    <Input value={weatherState.visibility} onChange={(e) => setWeatherState((prev) => ({ ...prev, visibility: e.target.value }))} />
                  </div>
                  <div>
                    <div className="mb-2 text-sm text-slate-500">风险等级</div>
                    <Input value={weatherState.risk} onChange={(e) => setWeatherState((prev) => ({ ...prev, risk: e.target.value }))} />
                  </div>
                  <div>
                    <div className="mb-2 text-sm text-slate-500">延时修正（分钟）</div>
                    <Input type="number" value={weatherState.penalty} onChange={(e) => setWeatherState((prev) => ({ ...prev, penalty: Number(e.target.value) }))} />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Plane className="h-5 w-5" /> 无人机资源实时修改</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {drones.map((d) => (
                    <div key={d.id} className="rounded-2xl border p-4">
                      <div className="mb-3 font-medium">{d.id} · {d.model}</div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <div className="mb-1 text-xs text-slate-500">电量</div>
                          <Input type="number" value={d.battery} onChange={(e) => updateDrone(d.id, "battery", e.target.value)} />
                        </div>
                        <div>
                          <div className="mb-1 text-xs text-slate-500">载重上限</div>
                          <Input type="number" value={d.load} onChange={(e) => updateDrone(d.id, "load", e.target.value)} />
                        </div>
                        <div>
                          <div className="mb-1 text-xs text-slate-500">状态</div>
                          <Input value={d.status} onChange={(e) => updateDrone(d.id, "status", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><PencilLine className="h-5 w-5" /> 订单任务实时修改</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="rounded-2xl border p-4">
                      <div className="mb-3 font-medium">{o.id} · {o.orchard}</div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <div className="mb-1 text-xs text-slate-500">货重</div>
                          <Input type="number" value={o.weight} onChange={(e) => updateOrder(o.id, "weight", e.target.value)} />
                        </div>
                        <div>
                          <div className="mb-1 text-xs text-slate-500">基础时长</div>
                          <Input type="number" value={o.eta} onChange={(e) => updateOrder(o.id, "eta", e.target.value)} />
                        </div>
                        <div>
                          <div className="mb-1 text-xs text-slate-500">优先级</div>
                          <Input value={o.priority} onChange={(e) => updateOrder(o.id, "priority", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Mountain className="h-5 w-5" /> 果园场景实时修改</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orchards.map((o) => (
                    <div key={o.id} className="rounded-2xl border p-4">
                      <div className="mb-3 font-medium">{o.name}</div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <div className="mb-1 text-xs text-slate-500">海拔</div>
                          <Input type="number" value={o.altitude} onChange={(e) => updateOrchard(o.id, "altitude", e.target.value)} />
                        </div>
                        <div>
                          <div className="mb-1 text-xs text-slate-500">距离</div>
                          <Input type="number" value={o.distance} onChange={(e) => updateOrchard(o.id, "distance", e.target.value)} />
                        </div>
                        <div>
                          <div className="mb-1 text-xs text-slate-500">风险</div>
                          <Input value={o.risk} onChange={(e) => updateOrchard(o.id, "risk", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}