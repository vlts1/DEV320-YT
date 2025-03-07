import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { faCommentAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

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

const ThumbnailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  background-color: #202020;
  padding: 10px;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 320px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
`;

const VideoTitle = styled.h3`
  margin: 10px 0;
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-align: left;
  cursor: pointer;
`;

const VideoStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
  color: gray;
  margin: 5px 0;
`;

const LikesDislikes = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
`;

const ChannelInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  font-size: 14px;
  color: white;
`;

const ChannelAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #181818;
  padding: 10px 0;
  z-index: 1000;
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

interface VideoThumbnailProps {
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelAvatar: string;
  views: string;
  likes: string;
  commentCount: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ title, thumbnailUrl, channelTitle, channelAvatar, views, likes, commentCount }) => (
  <ThumbnailContainer>
    <ThumbnailImage src={thumbnailUrl} alt={title} />
    <VideoTitle>{title}</VideoTitle>
    <VideoStats>
      <span>{views} views</span>
      <LikesDislikes>
        <FontAwesomeIcon icon={faThumbsUp} /> {likes}
        <FontAwesomeIcon icon={faCommentAlt} /> {commentCount}
      </LikesDislikes>
    </VideoStats>
    <ChannelInfo>
      <ChannelAvatar src={channelAvatar} alt={channelTitle} />
      {channelTitle}
    </ChannelInfo>
  </ThumbnailContainer>
);

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  justify-content: center;
  padding: 20px;
  max-width: 100vw;
  overflow-x: hidden;
`;

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelAvatar: string;
  views: string;
  likes: string;
  commentCount: string;
}

export const TrendingVideosPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageToken, setPrevPageToken] = useState<string | null>(null);


  const fetchTrendingVideos = async (pageToken?: string) => {
    try {
      const apiKey = import.meta.env.VITE_YT_API_KEY;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=12&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`
      );
      const data = await response.json();

      const videosData = data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        channelAvatar: item.snippet.thumbnails.default.url,
        views: item.statistics.viewCount.toLocaleString(),
        likes: item.statistics.likeCount ? item.statistics.likeCount.toLocaleString() : '0',
        commentCount: item.statistics.commentCount ? item.statistics.commentCount.toLocaleString() : '0',
      }));

      data.items.map((item: any) => ( console.log(item) ));

      setVideos(videosData);
      setNextPageToken(data.nextPageToken || null);
      setPrevPageToken(data.prevPageToken || null);

    } catch (error) {
      console.error('Error fetching trending videos:', error);
    }
  };

  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  return (
    <PageContainer>
      <div style={{height: "20px"}}></div>
      <h1>YT Clone by Team 6</h1>
      <VideosGrid>
        {videos.map((video) => (
          <VideoThumbnail
            key={video.id}
            title={video.title}
            thumbnailUrl={video.thumbnailUrl}
            channelTitle={video.channelTitle}
            channelAvatar={video.channelAvatar}
            views={video.views}
            likes={video.likes}
            commentCount={video.commentCount}
          />
        ))}
      </VideosGrid>
      <PaginationControls>
        <Button onClick={() => fetchTrendingVideos(prevPageToken!)} disabled={!prevPageToken}>
          Previous
        </Button>
        <Button onClick={() => fetchTrendingVideos(nextPageToken!)} disabled={!nextPageToken}>
          Next
        </Button>
      </PaginationControls>
    </PageContainer>
  );
};