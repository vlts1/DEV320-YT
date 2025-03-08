import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { faCheck, faCommentAlt, faStar, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FavoritesManager } from '../FavoritesManager';
import { PageContainer, VideoTitle, VideoStats, LikesComments, Button, ChannelInfo, ChannelAvatar, CommentsContainer, CommentHeader, CommentAvatar, PaginationControls } from './styles';

interface VideoData {
  title: string;
  channelTitle: string;
  channelAvatar: string;
  views: string;
  likes: string;
  commentCount: string;
}

interface CommentData {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
}

const VideoFrame = styled.iframe`
  width: 80%;
  max-width: 1200px;
  height: 450px;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
`;

const Comment = styled.div`
  background-color: #222;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

export const VideoPlayer: React.FC = () => {
  const favoritesManager = new FavoritesManager();

  const { videoId } = useParams<{ videoId: string }>();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const [isFavorite, setIsFavorite] = useState(() => 
    favoritesManager.getFavorites().includes(videoId!)
  );
  
  const toggleFavorite = () => {
    favoritesManager.toggleFavorite(videoId!);
    setIsFavorite(favoritesManager.getFavorites().includes(videoId!));
  };

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const apiKey = import.meta.env.VITE_YT_API_KEY;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
        );
        const data = await response.json();
        const video = data.items[0];
        console.log(data);
        setVideoData({
          title: video.snippet.title,
          channelTitle: video.snippet.channelTitle,
          channelAvatar: video.snippet.thumbnails.default.url,
          views: video.statistics.viewCount.toLocaleString(),
          likes: video.statistics.likeCount ? video.statistics.likeCount.toLocaleString() : '0',
          commentCount: video.statistics.commentCount ? video.statistics.commentCount.toLocaleString() : '0',
        });
      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };

    const fetchComments = async (pageToken?: string) => {
      try {
        const apiKey = import.meta.env.VITE_YT_API_KEY;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=5&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`
        );
        const data = await response.json();
        
        if (response.status === 403) {
          setComments([{ id: 'error', author: 'Error', authorAvatar: '', text: 'Comments are disabled for this video.' }]);
          return;
        }

        setComments(prevComments => [...prevComments, ...data.items.map((item: any) => ({
          id: item.id,
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          authorAvatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
          text: item.snippet.topLevelComment.snippet.textDisplay,
        }))]);
        setNextPageToken(data.nextPageToken || null);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchVideoDetails();
    fetchComments();
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
                  const fetchMoreComments = async () => {
                    try {
                      const apiKey = import.meta.env.VITE_YT_API_KEY;
                      const response = await fetch(
                        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=5&pageToken=${nextPageToken}&key=${apiKey}`
                      );
                      const data = await response.json();
                      setComments(prevComments => [...prevComments, ...data.items.map((item: any) => ({
                        id: item.id,
                        author: item.snippet.topLevelComment.snippet.authorDisplayName,
                        authorAvatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
                        text: item.snippet.topLevelComment.snippet.textDisplay,
                      }))]);
                      setNextPageToken(data.nextPageToken || null);
                    } catch (error) {
                      console.error('Error fetching more comments:', error);
                    }
                  };
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