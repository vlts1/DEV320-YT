import { useEffect, useState } from "react";
import { Video } from "../types";

export const useFetchTrendingVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageToken, setPrevPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingVideos = async (pageToken?: string) => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_YT_API_KEY;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=12&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ""}`
      );
      const data = await response.json();
      if (!data.items) throw new Error("Failed to fetch trending videos");

      const channelIds = data.items.map((item: any) => item.snippet.channelId).join(",");

      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${apiKey}`
      );
      const channelData = await channelResponse.json();

      const channelAvatars: Record<string, string> = {};
      channelData.items.forEach((channel: any) => {
        channelAvatars[channel.id] = channel.snippet.thumbnails.default.url;
      });

      const videosData = data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        channelAvatar: channelAvatars[item.snippet.channelId] || "",
        views: item.statistics.viewCount?.toLocaleString() || "0",
        likes: item.statistics.likeCount?.toLocaleString() || "0",
        commentCount: item.statistics.commentCount?.toLocaleString() || "0",
      }));

      setVideos(videosData);
      setNextPageToken(data.nextPageToken || null);
      setPrevPageToken(data.prevPageToken || null);
    } catch (err) {
      console.error("Error fetching trending videos:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  return { videos, loading, error, nextPageToken, prevPageToken, fetchTrendingVideos };
};
