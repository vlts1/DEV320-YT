import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { faCheck, faCommentAlt, faStar, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FavoritesManager } from '../FavoritesManager';

const PageContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  padding: 20px;
  text-align: center;
  background-color: #181818;
  color: white;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
`;

const VideoFrame = styled.iframe`
  width: 80%;
  max-width: 1200px;
  height: 450px;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
`;

const VideoTitle = styled.h2`
  font-size: 20px;
  margin: 15px auto;
  margin-bottom: 0;
  text-align: left;
  width: 80%;
  max-width: 1200px;
`;

const VideoStats = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: gray;
`;

const LikesComments = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
`;

const ChannelInfo = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  color: white;
  margin-top: 0px;
`;

const ChannelAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const CommentsContainer = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 20px auto;
  text-align: left;
  margin-top: 2.5rem;
  text-align: left;
`;

const Comment = styled.div`
  background-color: #222;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
`;

const CommentAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 5px;
  margin: 5px;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #cc0000;
  }

  &:disabled {
    background-color: #444;
    cursor: not-allowed;
  }
`;

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
        console.log(data);
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
            {comments.map(comment => (
              <Comment key={comment.id}>
                <CommentHeader>
                  <CommentAvatar src={comment.authorAvatar} alt={comment.author} />
                  {comment.author}
                </CommentHeader>
                <p dangerouslySetInnerHTML={{ __html: comment.text }}></p>
              </Comment>
            ))}
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
              }} disabled={!nextPageToken}>Load More</Button>
            </PaginationControls>
          </CommentsContainer>
        </>
      )}
    </PageContainer>
  );
};

