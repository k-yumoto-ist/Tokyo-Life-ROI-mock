import { useEffect, useMemo, useState } from "react";
import type { VersionKey } from "../../../config/versions";
import { type FinalActionStatus, type FinalBurden, type FinalChoiceRecord, type FinalPriority, type FinalRevisitIntent, type FinalSatisfaction, type FinalState, type FinalTodayContext } from "../../../data/finalMockData";
import { createChoiceRecord, createDemoFinalState, getFinalDashboardSummary, readFinalState, recommendFinalCandidates, resetFinalState, saveFinalState, type FinalRecommendation } from "../../../lib/finalRecommendation";
import { FinalBottomNav, type FinalTab } from "./FinalBottomNav";
import { FinalHeader } from "./FinalHeader";
import { FinalHistoryScreen } from "./FinalHistoryScreen";
import { FinalHomeScreen } from "./FinalHomeScreen";
import { FinalLearnedScreen } from "./FinalLearnedScreen";
import { FinalLoadingScreen } from "./FinalLoadingScreen";
import { FinalMyRoiScreen } from "./FinalMyRoiScreen";
import { FinalPlanSheet } from "./FinalPlanSheet";
import { FinalPriorityScreen } from "./FinalPriorityScreen";
import { FinalRecommendationsScreen } from "./FinalRecommendationsScreen";
import { FinalReflectionScreen } from "./FinalReflectionScreen";
import { FinalSelectedScreen } from "./FinalSelectedScreen";
import { FinalSettingsScreen } from "./FinalSettingsScreen";

type FinalFlow = "home" | "priority" | "loading" | "results" | "selected" | "reflection" | "learned" | "history" | "roi" | "settings";
type Props = { currentVersion: VersionKey; onVersionChange: (version: VersionKey) => void };

function createContext(prompt: string, priorities: FinalPriority[]): FinalTodayContext {
  return { prompt, priorities, timeWindow: "日曜の午後・2時間", budget: 5000, origin: "新宿駅周辺", weather: "hot" };
}

export function FinalVersion({ currentVersion, onVersionChange }: Props) {
  const [state, setState] = useState<FinalState>(() => readFinalState());
  const [flow, setFlow] = useState<FinalFlow>("home");
  const [prompt, setPrompt] = useState(state.lastPrompt || "");
  const [priorities, setPriorities] = useState<FinalPriority[]>(state.lastPriorities);
  const [recommendations, setRecommendations] = useState<FinalRecommendation[]>([]);
  const [selected, setSelected] = useState<FinalRecommendation | null>(null);
  const [detail, setDetail] = useState<FinalRecommendation | null>(null);
  const [lastRecord, setLastRecord] = useState<FinalChoiceRecord | null>(null);
  const [toast, setToast] = useState("");
  const context = useMemo(() => createContext(prompt, priorities), [prompt, priorities]);
  const focused = ["priority", "loading", "results", "selected", "reflection", "learned", "settings"].includes(flow);

  useEffect(() => saveFinalState(state), [state]);
  useEffect(() => {
    if (flow !== "loading") return;
    const timer = window.setTimeout(() => {
      setRecommendations(recommendFinalCandidates(context, state));
      setFlow("results");
    }, 1450);
    return () => window.clearTimeout(timer);
  }, [flow, context, state]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1700);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function startPriorities() {
    if (!prompt.trim()) return;
    setFlow("priority");
  }
  function startDemo() {
    const demo = createDemoFinalState();
    setState(demo);
    setPrompt(demo.lastPrompt);
    setPriorities(demo.lastPriorities);
    setFlow("priority");
  }
  function updateStateWithRecord(record: FinalChoiceRecord) {
    const next = { ...state, history: [...state.history, record], lastPrompt: prompt, lastPriorities: priorities };
    setState(next);
    setLastRecord(record);
  }
  function recordAction(status: FinalActionStatus, feedback?: { satisfaction: FinalSatisfaction; burden: FinalBurden; revisitIntent: FinalRevisitIntent; reasons: string[] }) {
    if (!selected) return;
    const record = createChoiceRecord({ candidateId: selected.candidate.id, comparedIds: recommendations.map((item) => item.candidate.id), context, status, predictedQol: selected.predictedQol, predictedRoi: selected.predictedRoi, ...feedback });
    updateStateWithRecord(record);
    setFlow("learned");
  }
  function navigate(tab: FinalTab) {
    setFlow(tab);
    setDetail(null);
  }
  function resetAll() {
    const next = resetFinalState();
    setState(next);
    setPrompt("");
    setPriorities([]);
    setRecommendations([]);
    setSelected(null);
    setFlow("home");
  }

  const navActive: FinalTab = flow === "history" ? "history" : flow === "roi" || flow === "settings" ? "roi" : "home";
  const summary = `${context.timeWindow}・予算${context.budget.toLocaleString("ja-JP")}円以内`;
  const wellbeing = getFinalDashboardSummary(state.history);
  return (
    <div className="final-app">
      {flow !== "loading" && <FinalHeader currentVersion={currentVersion} onVersionChange={onVersionChange} onProfile={() => setFlow("settings")} onBack={flow === "priority" ? () => setFlow("home") : flow === "results" ? () => setFlow("priority") : undefined} />}
      {flow === "home" && <FinalHomeScreen prompt={prompt} onPromptChange={setPrompt} historyCount={state.history.length} latestInsight={state.history[state.history.length - 1]?.qolInsight} wellbeing={wellbeing} onNext={startPriorities} onDemo={startDemo} />}
      {flow === "priority" && <FinalPriorityScreen selected={priorities} summary={prompt} onToggle={(priority) => setPriorities((current) => current.includes(priority) ? current.filter((item) => item !== priority) : current.length < 3 ? [...current, priority] : current)} onSubmit={() => setFlow("loading")} />}
      {flow === "loading" && <FinalLoadingScreen />}
      {flow === "results" && <FinalRecommendationsScreen recommendations={recommendations} contextSummary={summary} onDetails={setDetail} onChoose={(item) => { setSelected(item); setFlow("selected"); }} />}
      {flow === "selected" && selected && <FinalSelectedScreen recommendation={selected} onBack={() => setFlow("results")} onVisited={() => setFlow("reflection")} onSkipped={() => recordAction("skipped")} onChanged={() => recordAction("changed")} onToast={setToast} />}
      {flow === "reflection" && selected && <FinalReflectionScreen recommendation={selected} onSave={(feedback) => recordAction("visited", feedback)} />}
      {flow === "learned" && lastRecord && <FinalLearnedScreen record={lastRecord} cityPoint={selected?.candidate.cityPoint ?? 0} onMyRoi={() => setFlow("roi")} onHome={() => setFlow("home")} />}
      {flow === "history" && <FinalHistoryScreen history={state.history} />}
      {flow === "roi" && <FinalMyRoiScreen history={state.history} onSettings={() => setFlow("settings")} onHistory={() => setFlow("history")} />}
      {flow === "settings" && <FinalSettingsScreen profile={state.profile} onBack={() => setFlow("roi")} onReset={resetAll} onSave={(profile) => { setState((current) => ({ ...current, profile })); setToast("個人設定を保存しました"); setFlow("roi"); }} />}
      {detail && <FinalPlanSheet recommendation={detail} onClose={() => setDetail(null)} onChoose={() => { setSelected(detail); setDetail(null); setFlow("selected"); }} />}
      {!focused && <FinalBottomNav active={navActive} onChange={navigate} />}
      {toast && <div className="final-toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}
