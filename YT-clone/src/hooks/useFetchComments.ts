import { useEffect, useState } from "react";

interface CommentData {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
}

export const useFetchComments = (videoId: string) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async (pageToken?: string) => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_YT_API_KEY;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=5&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ""}`
      );
      const data = await response.json();

      if (response.status === 403) {
        setComments([{ id: "error", author: "Error", authorAvatar: "", text: "Comments are disabled for this video." }]);
        return;
      }

      setComments(prevComments => [
        ...prevComments,
        ...data.items.map((item: any) => ({
          id: item.id,
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          authorAvatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
          text: item.snippet.topLevelComment.snippet.textDisplay,
        })),
      ]);

      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  return { comments, nextPageToken, loading, error, fetchMoreComments: () => fetchComments(nextPageToken ?? undefined) };
};
