import React, { useState, useEffect, useCallback } from 'react';
import { TrafficAnalyticsData, TrafficBucket } from '../types/index.ts';
import { api } from '../api/client.ts';
import {
  Users,
  Clock,
  Calendar,
  CalendarDays,
  CalendarRange,
  Smartphone,
  Monitor,
  RefreshCw,
  Activity,
  Eye,
  TrendingUp,
} from 'lucide-react';

type TimeframeKey = 'hourly' | 'daily' | 'weekly' | 'monthly';

export const SiteTrafficAnalytics: React.FC = () => {
  const [data, setData] = useState<TrafficAnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeKey>('hourly');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState<TrafficBucket | null>(null);

  const loadTraffic = useCallback(async () => {
    try {
      const report = await api.getTrafficAnalytics();
      setData(report);
    } catch {
      // handled gracefully in ApiClient
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTraffic();
    const interval = setInterval(loadTraffic, 15000);
    return () => clearInterval(interval);
  }, [loadTraffic]);

  useEffect(() => {
    if (!data) return;
    const list = data[timeframe];
    if (list.length > 0) {
      setSelectedBucket(list[list.length - 1]);
    }
  }, [timeframe, data]);

  const buckets: TrafficBucket[] = data ? data[timeframe] : [];
  const maxVisits = Math.max(1, ...buckets.map((b) => Math.max(b.totalVisits, b.uniqueVisitors)));

  const totalDevices =
    (data?.summary.allTime.mobileCount || 0) + (data?.summary.allTime.desktopCount || 0);
  const mobilePct =
    totalDevices > 0
      ? Math.round(((data?.summary.allTime.mobileCount || 0) / totalDevices) * 100)
      : 0;

  const formatTimeAgo = (iso: string) => {
    const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900/85 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-stone-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Visitor &amp; Usage Telemetry</span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-0.5">
            People Using Banda Services (Hourly · Daily · Weekly · Monthly)
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Tracks unique visitors, total page sessions, mobile vs desktop split, and active sections in real time.
          </p>
        </div>

        <button
          onClick={loadTraffic}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-stone-200 bg-stone-950 hover:bg-stone-800 border border-stone-700 rounded-xl cursor-pointer transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Stats</span>
        </button>
      </div>

      {/* 5 Live Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-stone-900/85 backdrop-blur-xl p-4 rounded-2xl border border-emerald-500/30 shadow-xl">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-emerald-400 mb-1">
            <span>Active Now</span>
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-serif font-bold text-white font-mono tabular-nums">
            {data?.summary.activeNow ?? 1}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Online last 5 mins</div>
        </div>

        <div className="bg-stone-900/85 backdrop-blur-xl p-4 rounded-2xl border border-stone-800 shadow-xl">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-amber-400 mb-1">
            <span>Every Hour</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-serif font-bold text-white font-mono tabular-nums">
            {data?.summary.currentHour.uniqueVisitors ?? 0}{' '}
            <span className="text-xs font-sans font-normal text-stone-400">people</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {data?.summary.currentHour.totalVisits ?? 0} visits this hour
          </div>
        </div>

        <div className="bg-stone-900/85 backdrop-blur-xl p-4 rounded-2xl border border-stone-800 shadow-xl">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-sky-400 mb-1">
            <span>Every Day</span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-serif font-bold text-white font-mono tabular-nums">
            {data?.summary.today.uniqueVisitors ?? 0}{' '}
            <span className="text-xs font-sans font-normal text-stone-400">people</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {data?.summary.today.totalVisits ?? 0} visits today
          </div>
        </div>

        <div className="bg-stone-900/85 backdrop-blur-xl p-4 rounded-2xl border border-stone-800 shadow-xl">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-purple-400 mb-1">
            <span>Every Week</span>
            <CalendarDays className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-serif font-bold text-white font-mono tabular-nums">
            {data?.summary.thisWeek.uniqueVisitors ?? 0}{' '}
            <span className="text-xs font-sans font-normal text-stone-400">people</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {data?.summary.thisWeek.totalVisits ?? 0} visits (7d)
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-stone-900/85 backdrop-blur-xl p-4 rounded-2xl border border-stone-800 shadow-xl">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-rose-400 mb-1">
            <span>Every Month</span>
            <CalendarRange className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-serif font-bold text-white font-mono tabular-nums">
            {data?.summary.thisMonth.uniqueVisitors ?? 0}{' '}
            <span className="text-xs font-sans font-normal text-stone-400">people</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {data?.summary.thisMonth.totalVisits ?? 0} visits (30d)
          </div>
        </div>
      </div>

      {/* Interactive Timeframe Chart & Breakdown */}
      <div className="bg-stone-900/85 backdrop-blur-xl rounded-2xl border border-stone-800 p-4 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Traffic Breakdown Over Time</span>
            </h4>
            <p className="text-xs text-stone-400">
              Tap or hover any bar to inspect exact people &amp; device counts for that period.
            </p>
          </div>

          {/* 4 Timeframe Switcher Pills */}
          <div className="grid grid-cols-4 gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 w-full md:w-auto">
            {(
              [
                { id: 'hourly', label: 'Hourly' },
                { id: 'daily', label: 'Daily' },
                { id: 'weekly', label: 'Weekly' },
                { id: 'monthly', label: 'Monthly' },
              ] as Array<{ id: TimeframeKey; label: string }>
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === tab.id
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Period Detail Banner */}
        {selectedBucket && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-stone-950/90 border border-stone-800 text-xs">
            <div>
              <div className="text-[10px] font-mono uppercase text-stone-400">Selected Period</div>
              <div className="font-bold text-amber-300 mt-0.5">{selectedBucket.label}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-stone-400">Unique People</div>
              <div className="font-mono font-bold text-white mt-0.5">
                {selectedBucket.uniqueVisitors} users
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-stone-400">Total Page Views</div>
              <div className="font-mono font-bold text-emerald-400 mt-0.5">
                {selectedBucket.totalVisits} visits
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-stone-400">Phone vs Desktop</div>
              <div className="font-mono text-stone-200 mt-0.5">
                {selectedBucket.mobileCount} phone · {selectedBucket.desktopCount} web
              </div>
            </div>
          </div>
        )}

        {/* Responsive Bar Chart */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[560px] h-48 flex items-end gap-1.5 sm:gap-2 pt-4 px-2 bg-stone-950/60 rounded-xl border border-stone-800/80">
            {buckets.map((bucket) => {
              const visitHeight = Math.max(
                bucket.totalVisits > 0 ? 12 : 3,
                Math.round((bucket.totalVisits / maxVisits) * 140)
              );
              const uniqueHeight = Math.max(
                bucket.uniqueVisitors > 0 ? 10 : 2,
                Math.round((bucket.uniqueVisitors / maxVisits) * 140)
              );
              const isSelected = selectedBucket?.key === bucket.key;

              return (
                <button
                  key={bucket.key}
                  type="button"
                  onClick={() => setSelectedBucket(bucket)}
                  onMouseEnter={() => setSelectedBucket(bucket)}
                  className={`flex-1 flex flex-col items-center justify-end gap-1.5 py-2 px-0.5 rounded-lg transition-colors cursor-pointer group ${
                    isSelected ? 'bg-stone-800/70' : 'hover:bg-stone-800/40'
                  }`}
                >
                  <div className="w-full flex items-end justify-center gap-0.5 h-[142px]">
                    <div
                      style={{ height: `${visitHeight}px` }}
                      className={`w-2.5 sm:w-3 rounded-t transition-all ${
                        bucket.totalVisits > 0
                          ? 'bg-amber-400/85 group-hover:bg-amber-300'
                          : 'bg-stone-800/60'
                      }`}
                      title={`${bucket.label}: ${bucket.totalVisits} total visits`}
                    />
                    <div
                      style={{ height: `${uniqueHeight}px` }}
                      className={`w-2.5 sm:w-3 rounded-t transition-all ${
                        bucket.uniqueVisitors > 0
                          ? 'bg-emerald-400/90 group-hover:bg-emerald-300'
                          : 'bg-stone-800/40'
                      }`}
                      title={`${bucket.label}: ${bucket.uniqueVisitors} unique people`}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-stone-400 truncate max-w-full px-0.5">
                    {bucket.label.replace('Now ', '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block" />
              Total Visits
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 inline-block" />
              Unique People
            </span>
          </div>
          <span className="font-mono text-[10px]">
            All-Time Logged Visits: {data?.summary.allTime.totalVisits ?? 0} ({data?.summary.allTime.uniqueVisitors ?? 0} people)
          </span>
        </div>
      </div>

      {/* Bottom Grid: Device Split + Top Pages + Live Recent Visitors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Device & Top Sections */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900/85 backdrop-blur-xl rounded-2xl border border-stone-800 p-4 sm:p-5 shadow-xl space-y-3">
            <h4 className="text-sm font-serif font-bold text-white">Device Access Split</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-mono font-bold text-white text-sm">
                    {data?.summary.allTime.mobileCount ?? 0} ({mobilePct}%)
                  </div>
                  <div className="text-[11px] text-stone-400">Phone Users</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2.5">
                <Monitor className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-mono font-bold text-white text-sm">
                    {data?.summary.allTime.desktopCount ?? 0} ({totalDevices > 0 ? 100 - mobilePct : 0}%)
                  </div>
                  <div className="text-[11px] text-stone-400">Desktop Users</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-900/85 backdrop-blur-xl rounded-2xl border border-stone-800 p-4 sm:p-5 shadow-xl space-y-3">
            <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Most Visited Sections</span>
            </h4>
            <div className="space-y-2">
              {(data?.topSections || []).slice(0, 5).map((sec) => (
                <div
                  key={sec.tab}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-stone-950/80 border border-stone-800"
                >
                  <span className="text-stone-200 font-medium">{sec.label}</span>
                  <span className="font-mono font-bold text-amber-300">{sec.count} views</span>
                </div>
              ))}
              {(!data?.topSections || data.topSections.length === 0) && (
                <div className="text-xs text-stone-400 py-2">Listening for live page activity...</div>
              )}
            </div>
          </div>
        </div>

        {/* Recent People Active on Site */}
        <div className="lg:col-span-7 bg-stone-900/85 backdrop-blur-xl rounded-2xl border border-stone-800 p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-serif font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Recent Visitors &amp; Active Users</span>
            </h4>
            <span className="text-[11px] font-mono text-stone-400">
              Latest {data?.recentVisitors.length ?? 0} people
            </span>
          </div>

          <div className="divide-y divide-stone-800 max-h-80 overflow-y-auto pr-1">
            {(data?.recentVisitors || []).map((vis) => (
              <div
                key={vis.visitorId}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center shrink-0">
                    {vis.deviceType === 'mobile' ? (
                      <Smartphone className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Monitor className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate flex items-center gap-1.5">
                      <span className="truncate">{vis.userName}</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-stone-950 border border-stone-800 text-stone-400 shrink-0">
                        {vis.userRole}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 truncate">
                      Viewing <span className="text-amber-300">{vis.tabLabel}</span> · {vis.totalActions}{' '}
                      {vis.totalActions === 1 ? 'view' : 'views'}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] font-mono text-emerald-400">
                    {formatTimeAgo(vis.lastSeenAt)}
                  </div>
                  <div className="text-[10px] text-stone-500 capitalize">{vis.deviceType}</div>
                </div>
              </div>
            ))}
            {(!data?.recentVisitors || data.recentVisitors.length === 0) && (
              <div className="py-6 text-center text-xs text-stone-400">
                Active visitor logs will appear here automatically as people open the app.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
