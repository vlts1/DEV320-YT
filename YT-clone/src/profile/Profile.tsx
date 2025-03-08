import { faHeartBroken, faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { PageTitle, PageTitleIcon } from "../styles";
import { FavoritesManager } from "../FavoritesManager";
import { useNavigate } from "react-router-dom";
import { ChannelAvatar, ChannelInfo, LikesDislikes, ThumbnailContainer, ThumbnailImage, VideoStats, VideoTitle } from "../styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import styled from "styled-components";

const favoritesManager = new FavoritesManager();

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 320px);
  gap: 20px;
  justify-content: center;
  padding: 20px;
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

const VideoThumbnail: React.FC<Video> = ({ id, title, thumbnailUrl, channelTitle, channelAvatar, views, likes, commentCount }) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/play/${id}`);
  const handleRemoveFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    favoritesManager.toggleFavorite(id);
    window.location.reload();
  };

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
      <div style={{height: "100%"}}></div>
      <button onClick={handleRemoveFavorite} style={{ marginTop: '10px', cursor: 'pointer', color: 'red' }}>
        <FontAwesomeIcon icon={faHeartBroken} /> Remove
      </button>
    </ThumbnailContainer>
  );
};

export const Profile = () => {
    const [videos, setVideos] = useState<Video[]>([]);
  
    useEffect(() => {
      const fetchFavoriteVideos = async () => {
        const apiKey = import.meta.env.VITE_YT_API_KEY;
        const favoriteIds = favoritesManager.getFavorites();
        if (favoriteIds.length === 0) return;
  
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${favoriteIds.join(',')}&key=${apiKey}`
          );
          const data = await response.json();
          
          const videosData = data.items.map((item: any) => ({
            id: item.id,
            title: item.snippet.title,
            thumbnailUrl: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
            channelAvatar: item.snippet.thumbnails.high.url,
            views: item.statistics.viewCount.toLocaleString(),
            likes: item.statistics.likeCount ? item.statistics.likeCount.toLocaleString() : '0',
            commentCount: item.statistics.commentCount ? item.statistics.commentCount.toLocaleString() : '0',
          }));
  
          setVideos(videosData);
        } catch (error) {
          console.error('Error fetching favorite videos:', error);
        }
      };
  
      fetchFavoriteVideos();
    }, []);  

    return (
        <div>
            <PageTitle>Profile<PageTitleIcon icon={faStar}/></PageTitle>
            {videos.length > 0 ? (
              <VideosGrid>
                {videos.map((video) => (
                  <VideoThumbnail key={video.id} {...video} />
                ))}
              </VideosGrid>
            ) : (
              <p>No favorite videos yet.</p>
            )}
        </div>
    );
};