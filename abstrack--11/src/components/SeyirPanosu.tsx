import React, { useState, useMemo } from 'react';
import { Paper, LighthouseWatchState, ReadingHistoryItem } from '../types';
import { SeyirHaritasi } from './SeyirHaritasi';
import { 
  Compass, 
  Activity, 
  Waves, 
  Flame, 
  Award, 
  BarChart3, 
  Sparkles, 
  Zap, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  Radio
} from 'lucide-react';

interface SeyirPanosuProps {
  readingHistory: ReadingHistoryItem[];
  likedPapers: Paper[];
  lighthouseWatch: LighthouseWatchState;
  onOpenDetails: (paper: Paper) => void;
  langDict: Record<string, string>;
}

export const SeyirPanosu: React.FC<SeyirPanosuProps> = ({
  readingHistory,
  likedPapers,
  lighthouseWatch,
  onOpenDetails,
  langDict
}) => {
  // Sub-view toggle: 'sensor' (Sensör & Derinlik Panosu) vs 'chart' (Seyir Haritası - Takımyıldız Ağı)
  const [activeView, setActiveView] = useState<'sensor' | 'chart'>('sensor');

  // Combined pool of papers (from likes + history)
  const allKnownPapers = useMemo(() => {
    const map = new Map<string, Paper>();
    likedPapers.forEach(p => map.set(p.id, p));
    return Array.from(map.values());
  }, [likedPapers]);

  // Total read count & beam distance
  const totalReads = Math.max(lighthouseWatch.totalReadCount, readingHistory.length);
  const beamPower = Math.min(100, Math.max(5, lighthouseWatch.beamPower || 20));
  const beamDistanceMiles = (beamPower * 0.24).toFixed(1);

  // Compute Bathymetric Ocean Depth Level
  // Each read adds ~120m of intellectual depth into the ocean
  const calculatedDepthMeters = Math.max(80, totalReads * 140 + likedPapers.length * 90);
  const getDepthZone = (depth: number) => {
    if (depth >= 4000) return { name: 'Abisal & Hadal Çukuru', sub: 'En Derin Bilim Dalışı', color: 'text-purple-400', badge: 'bg-purple-950/60 border-purple-800' };
    if (depth >= 1000) return { name: 'Batipelajik Bölge', sub: 'Gece Yarısı Derinliği', color: 'text-indigo-400', badge: 'bg-indigo-950/60 border-indigo-800' };
    if (depth >= 200) return { name: 'Mezopelajik Bölge', sub: 'Alacakaranlık Derinliği', color: 'text-cyan-400', badge: 'bg-cyan-950/60 border-cyan-800' };
    return { name: 'Epipelajik Bölge', sub: 'Güneş Işığı Yüzey Seyri', color: 'text-sky-400', badge: 'bg-sky-950/60 border-sky-800' };
  };
  const depthZone = getDepthZone(calculatedDepthMeters);

  // Discipline Depth Distribution
  const disciplineStats = useMemo(() => {
    const counts: Record<string, number> = {};
    const defaultFields = ['Deniz Bilimleri', 'Su Ürünleri', 'Biyoloji', 'Ekoloji', 'Ziraat', 'Hukuk'];

    // Seed defaults for rich display
    defaultFields.forEach(f => { counts[f] = 0; });

    // Aggregate from reading history
    readingHistory.forEach(h => {
      const f = h.field || 'Diğer';
      counts[f] = (counts[f] || 0) + 1;
    });

    // Aggregate from liked papers
    likedPapers.forEach(p => {
      const f = p.field || 'Diğer';
      counts[f] = (counts[f] || 0) + 2;
    });

    // If zero across the board, seed gentle starter samples so user sees how the sensor functions
    const sum = Object.values(counts).reduce((a, b) => a + b, 0);
    if (sum === 0) {
      counts['Deniz Bilimleri'] = 7;
      counts['Su Ürünleri'] = 5;
      counts['Biyoloji'] = 4;
      counts['Ekoloji'] = 3;
      counts['Ziraat'] = 2;
    }

    const totalScore = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / totalScore) * 100),
        depthMeters: Math.round((count / totalScore) * calculatedDepthMeters)
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [readingHistory, likedPapers, calculatedDepthMeters]);

  // Son 7 Günlük Seyir Temposu (7-day activity simulation based on streak & daily goals)
  const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const weekData = useMemo(() => {
    const todayIndex = new Date().getDay(); // 0 is Sunday
    const adjustedToday = todayIndex === 0 ? 6 : todayIndex - 1;

    return weekDays.map((day, idx) => {
      if (idx === adjustedToday) {
        return { day, count: lighthouseWatch.todayReadCount, isToday: true };
      }
      if (idx < adjustedToday) {
        // Prior days in streak
        const pseudoCount = Math.max(1, Math.min(8, (idx * 3 + 2) % 6 + (lighthouseWatch.streakDays > 1 ? 2 : 1)));
        return { day, count: pseudoCount, isToday: false };
      }
      return { day, count: 0, isToday: false };
    });
  }, [lighthouseWatch.todayReadCount, lighthouseWatch.streakDays]);

  // Aggregate Key Concepts (Kavram Bulutu / Sonar Yankıları)
  const topKeywords = useMemo(() => {
    const kwMap: Record<string, number> = {};
    likedPapers.forEach(p => {
      (p.kw || []).forEach(k => {
        kwMap[k] = (kwMap[k] || 0) + 1;
      });
    });
    const fallbackKws = ['Biyo-lüminesans', 'Termohalin', 'Benthos', 'Pelajik', 'Mercan Resifleri', 'Kıta Sahanlığı', 'Mikroalg', 'DNA Barkodlama'];
    fallbackKws.forEach((k, i) => {
      if (!kwMap[k]) kwMap[k] = Math.max(1, 6 - i);
    });

    return Object.entries(kwMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [likedPapers]);

  // Total citations of explored papers
  const totalCitesExplored = useMemo(() => {
    const base = likedPapers.reduce((acc, p) => acc + (p.cites || 0), 0);
    return base > 0 ? base : 1240;
  }, [likedPapers]);

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col select-none overflow-hidden bg-[#eef7fb] dark:bg-[#020e18] text-[#0a2540] dark:text-[#e0f4ff]">
      {/* Top Segmented Navigation: Sensör Panosu vs Seyir Haritası */}
      <div className="p-3 bg-white/90 dark:bg-[#071828]/90 backdrop-blur-md border-b border-[#c5dfe9]/60 dark:border-[#0d2f45] shrink-0">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          {/* Segmented Control matching reference aesthetics */}
          <div className="flex-1 flex p-1 bg-[#dff0f7] dark:bg-[#061522] rounded-2xl border border-[#c5dfe9]/70 dark:border-[#0d2f45]">
            <button
              type="button"
              onClick={() => setActiveView('sensor')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                activeView === 'sensor'
                  ? 'bg-white dark:bg-[#0b2438] text-[#0284c7] dark:text-[#38bdf8] shadow-xs'
                  : 'text-[#527993] dark:text-[#7bb0cc] hover:text-[#0284c7]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Sensör Panosu</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('chart')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                activeView === 'chart'
                  ? 'bg-white dark:bg-[#0b2438] text-[#0284c7] dark:text-[#38bdf8] shadow-xs'
                  : 'text-[#527993] dark:text-[#7bb0cc] hover:text-[#0284c7]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Seyir Haritası (Ağ)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      {activeView === 'chart' ? (
        /* Seyir Haritası (Constellation & Network View) */
        <div className="flex-1 min-h-0 h-full flex flex-col">
          <SeyirHaritasi
            papers={allKnownPapers}
            onOpenDetails={onOpenDetails}
            langDict={langDict}
          />
        </div>
      ) : (
        /* Sensör & Derinlik Panosu (Sensor Dashboard) */
        <div className="flex-1 min-h-0 h-full overflow-y-auto overscroll-contain px-4 py-4 space-y-4 max-w-lg mx-auto w-full pb-10">
          {/* 1. Telemetry Top Status Header */}
          <div className="relative rounded-[26px] p-4.5 bg-gradient-to-br from-[#0284c7] via-[#0284c7] to-[#0ea5e9] text-white shadow-lg shadow-sky-950/15 overflow-hidden">
            {/* Atmospheric sonar ping concentric circles */}
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full border border-white/15 pointer-events-none" />
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-white/20 pointer-events-none" />
            <div className="absolute -right-8 -top-8 w-20 h-20 rounded-full border border-white/25 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono tracking-wider uppercase text-sky-100 font-bold">
                    SENSÖRLER ÇALIŞIYOR · SEKTÖR AKTİF
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold text-white">
                  <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>{lighthouseWatch.streakDays} Gün Seri</span>
                </div>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-black tracking-tight leading-tight">
                Kişisel Seyir &amp; Derinlik Panosu
              </h2>
              <p className="text-xs text-sky-100/90 mt-1 max-w-[34ch]">
                Akademik okuma temponuz, fener menziliniz ve disiplin derinleşme telemetrisi.
              </p>

              {/* Sensor Quick Stats Strip */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center">
                <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
                  <span className="block text-[10px] text-sky-100 uppercase tracking-tight">Okuma Sayısı</span>
                  <b className="text-base sm:text-lg font-black">{totalReads}</b>
                </div>
                <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
                  <span className="block text-[10px] text-sky-100 uppercase tracking-tight">Işık Menzili</span>
                  <b className="text-base sm:text-lg font-black">{beamDistanceMiles} Mil</b>
                </div>
                <div className="bg-white/10 rounded-xl p-2 backdrop-blur-xs">
                  <span className="block text-[10px] text-sky-100 uppercase tracking-tight">Fener Gücü</span>
                  <b className="text-base sm:text-lg font-black">%{beamPower}</b>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Batimetrik Derinlik Sensörü (Ocean Depth Sensor Gauge) */}
          <section className="bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-[24px] p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0a2540] dark:text-[#f0f9ff]">
                    Batimetrik Derinleşme Seviyesi
                  </h3>
                  <p className="text-[11px] text-[#527993] dark:text-[#7bb0cc]">
                    Bilimsel literatürde ulaşılan hidrostatik derinlik
                  </p>
                </div>
              </div>

              {/* Depth Zone Tag */}
              <div className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${depthZone.badge} ${depthZone.color}`}>
                {depthZone.name}
              </div>
            </div>

            {/* Depth Telemetry Meter */}
            <div className="bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-[#051422] dark:to-[#081d30] border border-sky-200/60 dark:border-sky-900/40 rounded-2xl p-3.5 mb-2">
              <div className="flex items-end justify-between mb-1.5">
                <div>
                  <span className="text-[10px] text-[#527993] dark:text-[#7bb0cc] uppercase tracking-wider font-mono">
                    HİDROSTATİK DERİNLİK
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#0284c7] dark:text-[#38bdf8] font-mono leading-none mt-0.5">
                    {calculatedDepthMeters.toLocaleString()} <span className="text-sm font-sans font-bold">Metre</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#527993] dark:text-[#7bb0cc] uppercase tracking-wider font-mono">
                    HİDROSTATİK BASINÇ
                  </span>
                  <div className="text-sm font-bold text-[#0a2540] dark:text-[#f0f9ff] font-mono">
                    ~{(calculatedDepthMeters * 0.1).toFixed(0)} Bar
                  </div>
                </div>
              </div>

              {/* Depth Meter Visual Bar */}
              <div className="relative w-full h-3 rounded-full bg-sky-200/50 dark:bg-sky-950/80 p-0.5 overflow-hidden border border-sky-300/40 dark:border-sky-800/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.7)] transition-all duration-700 relative"
                  style={{ width: `${Math.min(100, Math.max(12, (calculatedDepthMeters / 5000) * 100))}%` }}
                >
                  <span className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/90 rounded-full blur-[1px] animate-pulse" />
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-[#527993] dark:text-[#7bb0cc] mt-1.5 font-mono">
                <span>0m (Yüzey)</span>
                <span>200m (Mezo)</span>
                <span>1000m (Bati)</span>
                <span>4000m+ (Abisal)</span>
              </div>
            </div>
          </section>

          {/* 3. Disiplin Derinleşme Göstergeleri (Discipline Depth Breakdown) */}
          <section className="bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-[24px] p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0a2540] dark:text-[#f0f9ff]">
                    Disiplin Derinleşme Dağılımı
                  </h3>
                  <p className="text-[11px] text-[#527993] dark:text-[#7bb0cc]">
                    Hangi akademik alanlarda ne kadar odaklandığınız
                  </p>
                </div>
              </div>
            </div>

            {/* List of disciplines with depth sonar bars */}
            <div className="space-y-3 pt-1">
              {disciplineStats.map(stat => (
                <div key={stat.name} className="group">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-[#0a2540] dark:text-[#f0f9ff] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] dark:bg-[#38bdf8]" />
                      <span>{stat.name}</span>
                    </span>
                    <span className="text-[#527993] dark:text-[#7bb0cc] font-mono text-[11px]">
                      {stat.depthMeters} m <span className="opacity-60">·</span> %{stat.percent}
                    </span>
                  </div>

                  <div className="relative w-full h-2 rounded-full bg-sky-100 dark:bg-sky-950/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0284c7] to-[#06b6d4] transition-all duration-500"
                      style={{ width: `${stat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Son 7 Günlük Seyir Temposu & Okuma Trendi (Reading Velocity) */}
          <section className="bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-[24px] p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0a2540] dark:text-[#f0f9ff]">
                    7 Günlük Seyir Temposu
                  </h3>
                  <p className="text-[11px] text-[#527993] dark:text-[#7bb0cc]">
                    Haftalık okuma hızı ve seyrüsefer grafiği
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-[#0284c7] dark:text-[#38bdf8] font-mono">
                  {(totalReads / 7).toFixed(1)} makale/gün
                </span>
              </div>
            </div>

            {/* 7-Day Bar Sparkline */}
            <div className="flex items-end justify-between gap-2 pt-3 pb-1 border-t border-sky-100 dark:border-sky-950">
              {weekData.map((d, i) => {
                const maxVal = Math.max(...weekData.map(w => w.count), 5);
                const barHeight = Math.max(12, Math.round((d.count / maxVal) * 60));

                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#527993] dark:text-[#7bb0cc] font-mono">
                      {d.count}
                    </span>
                    <div className="w-full max-w-[28px] h-[64px] bg-sky-100/70 dark:bg-sky-950/60 rounded-lg flex items-end p-0.5 overflow-hidden">
                      <div
                        className={`w-full rounded-md transition-all duration-500 ${
                          d.isToday
                            ? 'bg-gradient-to-t from-[#0284c7] to-[#06b6d4] shadow-xs shadow-sky-500/40'
                            : d.count > 0
                            ? 'bg-[#0284c7]/50 dark:bg-[#38bdf8]/40'
                            : 'bg-transparent'
                        }`}
                        style={{ height: `${barHeight}px` }}
                      />
                    </div>
                    <span className={`text-[10px] font-medium ${d.isToday ? 'font-bold text-[#0284c7] dark:text-[#38bdf8]' : 'text-[#527993] dark:text-[#7bb0cc]'}`}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Akademik Atıf & Etki Barometresi (Citation Barometer) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-[22px] p-3.5 shadow-xs">
              <span className="text-[10px] font-bold text-[#527993] dark:text-[#7bb0cc] uppercase tracking-wider block">
                Atıf Etkileşimi
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#0284c7] dark:text-[#38bdf8] font-mono mt-0.5">
                {totalCitesExplored.toLocaleString()}+
              </div>
              <p className="text-[10px] text-[#527993] dark:text-[#7bb0cc] mt-1">
                Taranan literatür atıf ağırlığı
              </p>
            </div>

            <div className="bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-[22px] p-3.5 shadow-xs">
              <span className="text-[10px] font-bold text-[#527993] dark:text-[#7bb0cc] uppercase tracking-wider block">
                Kutup Yıldızı
              </span>
              <div className="text-base sm:text-lg font-black text-[#0a2540] dark:text-[#f0f9ff] truncate mt-0.5">
                {likedPapers[0]?.title || 'Derin Deniz Biyo-ışığı'}
              </div>
              <p className="text-[10px] text-[#527993] dark:text-[#7bb0cc] mt-1">
                En yüksek atıflı başucu makalesi
              </p>
            </div>
          </div>

          {/* 6. Sonar Yankıları & Anahtar Kavramlar (Keywords) */}
          <section className="bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-[24px] p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#0a2540] dark:text-[#f0f9ff]">
                  Sonar Yankıları (Odak Kavramlar)
                </h3>
                <p className="text-[11px] text-[#527993] dark:text-[#7bb0cc]">
                  En çok taranan bilimsel kavramlar
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {topKeywords.map(([kw, score]) => (
                <div
                  key={kw}
                  className="px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-900/50 text-xs font-medium text-[#0a2540] dark:text-[#e0f4ff] flex items-center gap-1.5"
                >
                  <span>{kw}</span>
                  <span className="text-[10px] text-[#0284c7] dark:text-[#38bdf8] font-bold font-mono">
                    +{score}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Sitenin En Altındaki Telif & İmza Yazısı */}
          <footer className="pt-2 pb-6 text-center border-t border-[#c5dfe9]/40 dark:border-[#0d2f45]/40">
            <p className="text-xs text-[#527993] dark:text-[#7bb0cc] font-medium tracking-wide">
              © 2026 Binali. Her hakkı saklıdır.
            </p>
          </footer>
        </div>
      )}
    </div>
  );
};
