export interface SiteStats {
  totalPosts: number;
  totalWords: number;
  totalCategories: number;
  totalTags: number;
  totalImages: number;
}

let siteStatsCache: SiteStats | null = null;

export const getSiteStats = async (): Promise<SiteStats> => {
  if (siteStatsCache) {
    return siteStatsCache;
  }

  const data = await import('../../generated/site-stats.json');
  siteStatsCache = data.default as SiteStats;
  return siteStatsCache;
};
