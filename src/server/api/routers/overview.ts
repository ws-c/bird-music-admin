import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

// 类型定义
export type TotalStats = {
  songs: {
    total: number;
    lastMonthChange: number;
  };
  albums: {
    total: number;
    lastMonthChange: number;
  };
  artists: {
    total: number;
    lastMonthChange: number;
  };
  playlists: {
    total: number;
    lastMonthChange: number;
  };
  users: {
    total: number;
    monthlyGrowth: Array<{
      month: string;
      count: number;
    }>;
  };
  playCounts: {
    total: number;
    monthlyTrend: Array<{
      month: string;
      count: number;
    }>;
  };
};

// 获取时间范围的工具函数
const getLastMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  return { start, end };
};

export const OverviewRouter = createTRPCRouter({
  getTotalStats: protectedProcedure.query(async ({ ctx }): Promise<TotalStats> => {
    // 获取时间范围
    const lastMonth = getLastMonthRange();

    // 并行查询所有数据
    const [
      totalSongs,
      lastMonthSongs,
      totalAlbums,
      lastMonthAlbums,
      totalArtists,
      lastMonthArtists,
      totalPlaylists,
      lastMonthPlaylists,
      totalUsers,
      monthlyGrowth,
      totalPlayCount,
      monthlyPlayCounts,
    ] = await Promise.all([
      // 歌曲总量
      ctx.prisma.songs.count(),
      // 上月新增歌曲
      ctx.prisma.songs.count({
        where: {
          create_time: {
            gte: lastMonth.start,
            lte: lastMonth.end,
          },
        },
      }),

      // 专辑总量
      ctx.prisma.albums.count(),
      // 上月新增专辑
      ctx.prisma.albums.count({
        where: {
          create_time: {
            gte: lastMonth.start,
            lte: lastMonth.end,
          },
        },
      }),

      // 艺人总量
      ctx.prisma.artists.count(),
      // 上月新增艺人
      ctx.prisma.artists.count({
        where: {
          create_time: {
            gte: lastMonth.start,
            lte: lastMonth.end,
          },
        },
      }),

      // 歌单总量
      ctx.prisma.playlist.count(),
      // 上月新增歌单
      ctx.prisma.playlist.count({
        where: {
          create_time: {
            gte: lastMonth.start,
            lte: lastMonth.end,
          },
        },
      }),

      // 用户总量
      ctx.prisma.users.count(),
      ctx.prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT
        DATE_FORMAT(create_time, '%Y-%m') AS month,
        COUNT(*) AS count
      FROM users
      WHERE create_time >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(create_time, '%Y-%m')
      ORDER BY month ASC
    `,
      // 播放量
      ctx.prisma.songs.aggregate({
        _sum: {
          play_count: true,
        },
      }),
      // 过去12个月每月播放量（从聚合表查询）
      ctx.prisma.$queryRaw<{ month: string; count: bigint }[]>`
            WITH months AS (
              SELECT DATE_FORMAT(DATE_SUB(NOW(), INTERVAL n MONTH), '%Y-%m') AS month
              FROM (
                SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
                UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
                UNION SELECT 10 UNION SELECT 11
              ) AS seq
            )
            SELECT 
              m.month,
              COALESCE(SUM(sms.play_count), 0) AS count
            FROM months m
            LEFT JOIN song_monthly_stat sms
              ON DATE_FORMAT(CONCAT(sms.year, '-', sms.month, '-01'), '%Y-%m') = m.month
            GROUP BY m.month
            ORDER BY m.month ASC
          `,
    ]);

    // 计算增长率
    const calculateChange = (lastMonthCount: number, total: number) => {
      const base = total - lastMonthCount;
      if (base === 0) return lastMonthCount > 0 ? 100 : 0;
      return (lastMonthCount / base) * 100;
    };
    // 生成完整月份序列
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toISOString().slice(0, 7);
    }).reverse();

    return {
      songs: {
        total: totalSongs,
        lastMonthChange: calculateChange(lastMonthSongs, totalSongs),
      },
      albums: {
        total: totalAlbums,
        lastMonthChange: calculateChange(lastMonthAlbums, totalAlbums),
      },
      artists: {
        total: totalArtists,
        lastMonthChange: calculateChange(lastMonthArtists, totalArtists),
      },
      playlists: {
        total: totalPlaylists,
        lastMonthChange: calculateChange(lastMonthPlaylists, totalPlaylists),
      },
      users: {
        total: totalUsers,
        monthlyGrowth: months.map((month) => {
          const found = monthlyGrowth.find((m) => m.month === month);
          return {
            month,
            count: found ? Number(found.count) : 0,
          };
        }),
      },
      playCounts: {
        total: totalPlayCount._sum.play_count || 0,
        monthlyTrend: monthlyPlayCounts.map((p) => ({
          month: p.month,
          count: Number(p.count),
        })),
      },
    };
  }),
});
