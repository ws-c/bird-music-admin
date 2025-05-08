import React from "react";

import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Card,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Overview } from "@/components/dashboard/overview";
import { Album, ListMusic, Music, Speaker } from "lucide-react";
import { PlayCount } from "@/components/dashboard/play-count";
import { api } from "@/utils/api";
import { type TotalStats } from "@/server/api/routers/overview";
import { Loading } from "@/components/common/loading";
const Home = () => {
  const { data, isLoading, error } =
    api.overview.getTotalStats.useQuery<TotalStats>(undefined, {
      staleTime: 60 * 1000, // 1分钟缓存
    });
  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  console.log(data);
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">仪表盘</h2>
          {/* <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button size="sm">Download</Button>
          </div> */}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          {/* <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
          </TabsList> */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl">歌曲总数</CardTitle>
                  <Music />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.songs.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {data.songs.lastMonthChange.toFixed(1)}% 较上月
                  </p>
                </CardContent>
              </Card>

              {/* 专辑统计 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl">专辑总数</CardTitle>
                  <Album />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold ">{data.albums.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {data.albums.lastMonthChange.toFixed(1)}% 较上月
                  </p>
                </CardContent>
              </Card>

              {/* 艺人统计 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl">艺人总数</CardTitle>
                  <Speaker />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.artists.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {data.artists.lastMonthChange.toFixed(1)}% 较上月
                  </p>
                </CardContent>
              </Card>

              {/* 歌单统计 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl">歌单总数</CardTitle>
                  <ListMusic />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.playlists.total}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {data.playlists.lastMonthChange.toFixed(1)}% 较上月
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle className="text-2xl">用户量</CardTitle>
                  <CardDescription>
                    总计有
                    {data.users.total}位用户
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview data={data.users.monthlyGrowth} />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle className="text-2xl">播放量</CardTitle>
                  <CardDescription>
                    总计播放了{data.playCounts.total}首歌曲
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PlayCount data={data.playCounts.monthlyTrend} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
