import { Router } from 'express';
import { db, VisitDoc } from '../db.js';
import { optionalJWT, AuthRequest } from '../auth.js';

const router = Router();

const TAB_LABELS: Record<string, string> = {
  explore: 'Home & Salons',
  nail_art: 'Nail Art Studio',
  hair_gallery: 'Hair & Braids',
  gps: 'Live GPS Tracker',
  loyalty: 'Privilege Club',
  reviews: 'Client Reviews',
  provider: 'Stylist Mode',
  admin: 'Admin Portal',
};

function startOfHour(d: Date): Date {
  const copy = new Date(d);
  copy.setMinutes(0, 0, 0);
  return copy;
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function startOfWeek(d: Date): Date {
  const copy = startOfDay(d);
  const day = copy.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday start
  copy.setDate(copy.getDate() + diff);
  return copy;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

export function aggregateTraffic(visits: VisitDoc[], nowInput: Date = new Date()) {
  const now = nowInput.getTime();
  const fiveMinsAgo = now - 5 * 60 * 1000;
  const oneHourAgo = now - 60 * 60 * 1000;
  const todayStart = startOfDay(nowInput).getTime();
  const weekStart = now - 7 * 24 * 60 * 60 * 1000;
  const monthStart = now - 30 * 24 * 60 * 60 * 1000;

  const uniqueInRange = (minTs: number, maxTs: number = Infinity) => {
    const filtered = visits.filter((v) => {
      const ts = new Date(v.updatedAt || v.createdAt).getTime();
      return ts >= minTs && ts < maxTs;
    });
    const unique = new Set(filtered.map((v) => v.visitorId));
    return {
      uniqueVisitors: unique.size,
      totalVisits: filtered.length,
      mobileCount: filtered.filter((v) => v.deviceType === 'mobile').length,
      desktopCount: filtered.filter((v) => v.deviceType === 'desktop').length,
    };
  };

  // 1. Hourly (last 24 hours)
  const currentHourStart = startOfHour(nowInput);
  const hourly = [];
  for (let i = 23; i >= 0; i--) {
    const bucketStart = new Date(currentHourStart.getTime() - i * 60 * 60 * 1000);
    const bucketEnd = new Date(bucketStart.getTime() + 60 * 60 * 1000);
    const stats = uniqueInRange(bucketStart.getTime(), bucketEnd.getTime());
    const hh = String(bucketStart.getHours()).padStart(2, '0') + ':00';
    hourly.push({
      key: bucketStart.toISOString(),
      label: i === 0 ? `Now (${hh})` : hh,
      ...stats,
    });
  }

  // 2. Daily (last 14 days)
  const currentDayStart = startOfDay(nowInput);
  const daily = [];
  for (let i = 13; i >= 0; i--) {
    const bucketStart = new Date(currentDayStart.getTime() - i * 24 * 60 * 60 * 1000);
    const bucketEnd = new Date(bucketStart.getTime() + 24 * 60 * 60 * 1000);
    const stats = uniqueInRange(bucketStart.getTime(), bucketEnd.getTime());
    const label =
      i === 0
        ? 'Today'
        : i === 1
        ? 'Yesterday'
        : bucketStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    daily.push({
      key: bucketStart.toISOString(),
      label,
      ...stats,
    });
  }

  // 3. Weekly (last 8 weeks)
  const currentWeekStart = startOfWeek(nowInput);
  const weekly = [];
  for (let i = 7; i >= 0; i--) {
    const bucketStart = new Date(currentWeekStart.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const bucketEnd = new Date(bucketStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const stats = uniqueInRange(bucketStart.getTime(), bucketEnd.getTime());
    const label =
      i === 0
        ? 'This Week'
        : i === 1
        ? 'Last Week'
        : `Wk ${bucketStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    weekly.push({
      key: bucketStart.toISOString(),
      label,
      ...stats,
    });
  }

  // 4. Monthly (last 12 months)
  const currentMonthStart = startOfMonth(nowInput);
  const monthly = [];
  for (let i = 11; i >= 0; i--) {
    const bucketStart = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - i, 1);
    const bucketEnd = new Date(bucketStart.getFullYear(), bucketStart.getMonth() + 1, 1);
    const stats = uniqueInRange(bucketStart.getTime(), bucketEnd.getTime());
    const label = bucketStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    monthly.push({
      key: bucketStart.toISOString(),
      label,
      ...stats,
    });
  }

  // Top sections
  const sectionCounts: Record<string, number> = {};
  for (const v of visits) {
    const t = v.tab || 'explore';
    sectionCounts[t] = (sectionCounts[t] || 0) + 1;
  }
  const topSections = Object.entries(sectionCounts)
    .map(([tab, count]) => ({
      tab,
      label: TAB_LABELS[tab] || tab,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Recent unique visitors (last 20 active)
  const visitorMap = new Map<
    string,
    {
      visitorId: string;
      userName: string;
      userRole: string;
      deviceType: 'mobile' | 'desktop';
      tab: string;
      tabLabel: string;
      lastSeenAt: string;
      totalActions: number;
    }
  >();

  const sortedDesc = [...visits].sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt).getTime() -
      new Date(a.updatedAt || a.createdAt).getTime()
  );

  for (const v of sortedDesc) {
    const existing = visitorMap.get(v.visitorId);
    if (!existing) {
      visitorMap.set(v.visitorId, {
        visitorId: v.visitorId,
        userName: v.userName || 'Kampala Guest',
        userRole: v.userRole || 'guest',
        deviceType: v.deviceType || 'desktop',
        tab: v.tab || 'explore',
        tabLabel: TAB_LABELS[v.tab || 'explore'] || v.tab || 'Home',
        lastSeenAt: v.updatedAt || v.createdAt,
        totalActions: 1,
      });
    } else {
      existing.totalActions += 1;
      if (existing.userName === 'Kampala Guest' && v.userName) {
        existing.userName = v.userName;
        existing.userRole = v.userRole || existing.userRole;
      }
    }
  }

  const allStats = uniqueInRange(0);

  return {
    summary: {
      activeNow: uniqueInRange(fiveMinsAgo).uniqueVisitors,
      currentHour: uniqueInRange(oneHourAgo),
      today: uniqueInRange(todayStart),
      thisWeek: uniqueInRange(weekStart),
      thisMonth: uniqueInRange(monthStart),
      allTime: allStats,
    },
    hourly,
    daily,
    weekly,
    monthly,
    topSections,
    recentVisitors: Array.from(visitorMap.values()).slice(0, 20),
    generatedAt: nowInput.toISOString(),
  };
}

// POST /api/analytics/visit — record page/tab visit or active session heartbeat
router.post('/visit', optionalJWT, async (req: AuthRequest, res) => {
  try {
    const { visitorId, tab = 'explore', deviceType, userName, userRole, userId } = req.body || {};
    if (!visitorId || typeof visitorId !== 'string') {
      return res.status(400).json({ error: 'visitorId is required' });
    }

    const ua = req.headers['user-agent'] || '';
    const detectedDevice: 'mobile' | 'desktop' =
      deviceType === 'mobile' || deviceType === 'desktop'
        ? deviceType
        : /Mobile|Android|iPhone|iPad/i.test(ua)
        ? 'mobile'
        : 'desktop';

    const resolvedUserId = req.user?._id || userId;
    const resolvedUserName = req.user?.name || userName;
    const resolvedUserRole = req.user?.role || userRole;

    // Deduplicate rapid pings within 25 seconds for the same visitor & tab by updating timestamp
    const recent = await db.visits.find({ visitorId, tab });
    const now = Date.now();
    const latestMatch = recent.sort(
      (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
    )[0];

    if (latestMatch && now - new Date(latestMatch.updatedAt || latestMatch.createdAt).getTime() < 25000) {
      const updated = await db.visits.updateOne(latestMatch._id, {
        userId: resolvedUserId || latestMatch.userId,
        userName: resolvedUserName || latestMatch.userName,
        userRole: resolvedUserRole || latestMatch.userRole,
        deviceType: detectedDevice,
      });
      return res.json({ recorded: true, visit: updated });
    }

    const visit = await db.visits.insertOne({
      visitorId,
      userId: resolvedUserId,
      userName: resolvedUserName,
      userRole: resolvedUserRole,
      deviceType: detectedDevice,
      tab,
      userAgent: ua.slice(0, 180),
    });

    res.status(201).json({ recorded: true, visit });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record visit', details: err.message });
  }
});

// GET /api/analytics/traffic — hourly, daily, weekly, and monthly visitor counts
router.get('/traffic', async (_req, res) => {
  try {
    const visits = await db.visits.find();
    const report = aggregateTraffic(visits);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to aggregate site traffic', details: err.message });
  }
});

export default router;
