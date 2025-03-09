import { useEffect, useState } from "react";
import { Video } from "../types";

export const useFetchFavoriteVideos = (videoIds: string[]) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteVideos = async () => {
      if (videoIds.length === 0) return;
      setLoading(true);
      setError(null);

      try {
        const apiKey = import.meta.env.VITE_YT_API_KEY;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(",")}&key=${apiKey}`
        );
        const data = await response.json();
        if (!data.items) throw new Error("Failed to fetch favorite videos");

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
      } catch (err) {
        console.error("Error fetching favorite videos:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteVideos();
  }, [videoIds]);

  return { videos, loading, error };
};
