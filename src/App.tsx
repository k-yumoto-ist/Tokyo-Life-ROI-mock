import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/common/Header";
import { BottomNavigation } from "./components/common/BottomNavigation";
import { SimpleVersion } from "./components/versions/SimpleVersion";
import { FormVersion } from "./components/versions/FormVersion";
import { ChatVersion } from "./components/versions/ChatVersion";
import { normalizeVersion, versions, type VersionKey } from "./config/versions";

type Tab = "home" | "roi" | "settings";

function readVersionFromUrl() {
  return normalizeVersion(new URLSearchParams(window.location.search).get("version"));
}

export default function App() {
  const [version, setVersion] = useState<VersionKey>(() => readVersionFromUrl());
  const [tab, setTab] = useState<Tab>("home");

  useEffect(() => {
    const onPopState = () => {
      setVersion(readVersionFromUrl());
      setTab("home");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const CurrentVersion = useMemo(() => {
    if (version === "form") return FormVersion;
    if (version === "chat") return ChatVersion;
    return SimpleVersion;
  }, [version]);

  function changeVersion(nextVersion: VersionKey) {
    const url = new URL(window.location.href);
    url.searchParams.set("version", nextVersion);
    window.history.pushState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
    setVersion(nextVersion);
    setTab("home");
  }

  return (
    <div className="min-h-[100dvh] bg-[#edf7ff] text-ink">
      <main className="app-shell">
        <div className="phone-surface">
          <section className="screen-content home-hero prototype-screen">
            <Header version={version} onVersionChange={changeVersion} />
            {tab === "home" && <CurrentVersion />}
            {tab === "roi" && <MyRoiPanel />}
            {tab === "settings" && <SettingsPanel currentVersion={version} />}
          </section>
          <BottomNavigation active={tab} onChange={setTab} />
        </div>
      </main>
    </div>
  );
}

function MyRoiPanel() {
  return (
    <section className="version-panel">
      <h2 className="version-title">My ROI</h2>
      <article className="summary-card">
        <p>12回の選択をサポート</p>
        <div className="summary-grid">
          <strong>94分<span>時間短縮</span></strong>
          <strong>3,800円<span>節約</span></strong>
          <strong>4.2<span>平均満足度</span></strong>
          <strong>6回<span>混雑回避</span></strong>
        </div>
      </article>
      <article className="insight-mini">
        <h3>平日は時間重視</h3>
        <p>安さより時短を選ぶ傾向があります。</p>
      </article>
      <article className="insight-mini">
        <h3>空いている選択の満足度が高め</h3>
        <p>混雑が少ない候補では満足度が0.8高くなっています。</p>
      </article>
    </section>
  );
}

function SettingsPanel({ currentVersion }: { currentVersion: VersionKey }) {
  const estimatedHourlyValue = 3200;
  const [hourlyValue, setHourlyValue] = useState(3200);
  const [family, setFamily] = useState("家族4人");
  const [mobility, setMobility] = useState("電車中心");

  return (
    <section className="version-panel">
      <h2 className="version-title">設定</h2>
      <article className="summary-card">
        <p>現在の試作</p>
        <h3>{versions[currentVersion].label}</h3>
        <span>{versions[currentVersion].description}</span>
      </article>
      <article className="summary-card">
        <p>時間価値</p>
        <h3>現在の設定：{hourlyValue.toLocaleString("ja-JP")}円/h</h3>
        <span>推定時間価値：{estimatedHourlyValue.toLocaleString("ja-JP")}円/h</span>
        <div className="setting-controls">
          <button onClick={() => setHourlyValue((value) => Math.max(500, value - 500))}>-500</button>
          <button onClick={() => setHourlyValue((value) => value + 500)}>+500</button>
          <button onClick={() => setHourlyValue(estimatedHourlyValue)}>推定値に戻す</button>
        </div>
      </article>
      <article className="summary-card">
        <p>基本プロフィール</p>
        <div className="setting-controls">
          {["ひとり", "家族4人", "子どもあり"].map((item) => (
            <button key={item} className={family === item ? "is-active" : ""} onClick={() => setFamily(item)}>{item}</button>
          ))}
        </div>
        <div className="setting-controls">
          {["電車中心", "車も使う", "徒歩少なめ"].map((item) => (
            <button key={item} className={mobility === item ? "is-active" : ""} onClick={() => setMobility(item)}>{item}</button>
          ))}
        </div>
        <span>{family}・{mobility}・混雑回避を重視</span>
      </article>
      <article className="summary-card">
        <p>データ利用</p>
        <span>現在は固定モックデータです。将来は交通、天気、混雑、施設情報と接続します。</span>
      </article>
    </section>
  );
}
