import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { faCommentAlt, faFireFlameCurved, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { PageTitle, PageTitleIcon } from '../styles';
import { ThumbnailContainer, ThumbnailImage, VideoTitle, VideoStats, LikesDislikes, ChannelInfo, ChannelAvatar, PaginationControls, Button, VideosGrid } from '../styles';
import { PageContainer } from './styles';
import { useFetchTrendingVideos } from '../hooks/useFetchTrendingVideos';

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
  const { videos, nextPageToken, prevPageToken, fetchTrendingVideos } = useFetchTrendingVideos();

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
