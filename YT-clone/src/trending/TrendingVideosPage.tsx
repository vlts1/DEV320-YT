import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faCommentAlt, faFireFlameCurved, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { PageTitle, PageTitleIcon } from '../styles';
import { ThumbnailContainer, ThumbnailImage, VideoTitle, VideoStats, LikesDislikes, ChannelInfo, ChannelAvatar, PageContainer, PaginationControls, Button, VideosGrid } from './styles';

interface VideoThumbnailProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelAvatar: string;
  views: string;
  likes: string;
  commentCount: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ id, title, thumbnailUrl, channelTitle, channelAvatar, views, likes, commentCount }) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/play/${id}`);

  return (
    <ThumbnailContainer onClick={handleClick}>
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
};

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
        id:            item.id,
        title:         item.snippet.title,
        thumbnailUrl:  item.snippet.thumbnails.medium.url,
        channelTitle:  item.snippet.channelTitle,
        channelAvatar: item.snippet.channelThumbnailUrl || item.snippet.thumbnails.high.url,
        views:         item.statistics.viewCount.toLocaleString(),
        likes:         item.statistics.likeCount ? item.statistics.likeCount.toLocaleString() : '0',
        commentCount:  item.statistics.commentCount ? item.statistics.commentCount.toLocaleString() : '0',
      }));

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
      <PageTitle>Trending<PageTitleIcon icon={faFireFlameCurved}/></PageTitle>
      <VideosGrid>
        {videos.map((video) => (
          <VideoThumbnail key={video.id} {...video} />
        ))}
      </VideosGrid>
      <div style={{height: "5rem"}}></div>
      <PaginationControls>
        <Button onClick={() => fetchTrendingVideos(prevPageToken!)} disabled={!prevPageToken}>Previous</Button>
        <Button onClick={() => fetchTrendingVideos(nextPageToken!)} disabled={!nextPageToken}>Next</Button>
      </PaginationControls>
    </PageContainer>
  );
};
