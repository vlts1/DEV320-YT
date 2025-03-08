export class FavoritesManager {
  private storageKey = "favoriteVideos";

  constructor() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  getFavorites(): string[] {
    const favorites = localStorage.getItem(this.storageKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  toggleFavorite(videoId: string): void {
    let favorites = this.getFavorites();
    
    if (favorites.includes(videoId)) {
      favorites = favorites.filter(id => id !== videoId);
    } else {
      favorites.push(videoId);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }
}