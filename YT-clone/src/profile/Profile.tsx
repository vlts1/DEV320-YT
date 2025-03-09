import { faHeartBroken, faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { PageTitle, PageTitleIcon } from "../styles";
import { FavoritesManager } from "../FavoritesManager";
import { useNavigate } from "react-router-dom";
import { ChannelAvatar, ChannelInfo, LikesDislikes, ThumbnailContainer, ThumbnailImage, VideoStats, VideoTitle } from "../styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";
import styled from "styled-components";
import { useFetchFavoriteVideos } from "../hooks/useFetchFavoriteVideos";

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
    const favoriteIds = favoritesManager.getFavorites();
    const { videos } = useFetchFavoriteVideos(favoriteIds);

    return (
        <div>
            <PageTitle>Profile<PageTitleIcon icon={faStar}/></PageTitle>
            {<VideosGrid>
                {videos.map((video) => (
                  <VideoThumbnail key={video.id} {...video} />
                ))}
              </VideosGrid>}
        </div>
    );
};
