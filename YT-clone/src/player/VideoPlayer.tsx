import { useEffect, useState } from 'react';
import { faCheck, faCommentAlt, faStar, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FavoritesManager } from '../FavoritesManager';
import { PageContainer, VideoTitle, VideoStats, LikesComments, Button, ChannelInfo, ChannelAvatar, CommentsContainer, CommentHeader, CommentAvatar, PaginationControls, VideoFrame,Comment } from './styles';
import { useFetchComments } from '../hooks/useFetchComments';

interface VideoData {
  title: string;
  channelTitle: string;
  channelAvatar: string;
  views: string;
  likes: string;
  commentCount: string;
}

export const VideoPlayer: React.FC = () => {
  const favoritesManager = new FavoritesManager();

  const { videoId } = useParams<{ videoId: string }>();
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  const [isFavorite, setIsFavorite] = useState(() => 
    favoritesManager.getFavorites().includes(videoId!)
  );
  
  const toggleFavorite = () => {
    favoritesManager.toggleFavorite(videoId!);
    setIsFavorite(favoritesManager.getFavorites().includes(videoId!));
  };

  const { comments, nextPageToken, fetchMoreComments } = useFetchComments(videoId!);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const apiKey = import.meta.env.VITE_YT_API_KEY;
        
        const videoDetailsresponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
        );
        const videoDetails = await videoDetailsresponse.json();
        const video = videoDetails.items[0];
        const channelId = video.snippet.channelId;

        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`
        );
        const channelData = await channelResponse.json();
        const channelAvatar = channelData.items[0]?.snippet.thumbnails.default.url || "";

        setVideoData({
          title:         video.snippet.title,
          channelTitle:  video.snippet.channelTitle,
          channelAvatar: channelAvatar,
          views:         video.statistics.viewCount.toLocaleString(),
          likes:         video.statistics.likeCount ? video.statistics.likeCount.toLocaleString() : "0",
          commentCount:  video.statistics.commentCount ? video.statistics.commentCount.toLocaleString() : "0",
        });
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  return (
    <PageContainer>
      {videoData && (
        <>
          <VideoFrame src={`https://www.youtube.com/embed/${videoId}`} allowFullScreen></VideoFrame>
          <VideoTitle>{videoData.title}</VideoTitle>
          <VideoStats>
            <p>{videoData.views} views</p>
            <LikesComments>
                <Button onClick={() => toggleFavorite()}>
                    <FontAwesomeIcon icon={isFavorite ? faCheck : faStar} /> {isFavorite ? "Remove" : "Favorite"}
                </Button>
                <FontAwesomeIcon icon={faThumbsUp} /> {videoData.likes}
                <FontAwesomeIcon icon={faCommentAlt} /> {videoData.commentCount}
            </LikesComments>
          </VideoStats>
          <ChannelInfo>
            <ChannelAvatar src={videoData.channelAvatar} alt={videoData.channelTitle} />
            {videoData.channelTitle}
          </ChannelInfo>
          <CommentsContainer>
            <h3>Comments</h3>
            { (comments.length > 0 && comments[0].id !== "error") ? comments.map(comment => (
              <Comment key={comment.id}>
                <CommentHeader>
                  <CommentAvatar src={comment.authorAvatar} alt={comment.author} />
                  {comment.author}
                </CommentHeader>
                <p dangerouslySetInnerHTML={{ __html: comment.text }}></p>
              </Comment>
            )) : <p>Comments are disabled</p>}
            <PaginationControls>
            <Button onClick={() => {
                if (nextPageToken) {
                  fetchMoreComments();
                }
              }} disabled={!nextPageToken || comments[0].id === "error"}>Load More</Button>
            </PaginationControls>
          </CommentsContainer>
        </>
      )}
    </PageContainer>
  );
};