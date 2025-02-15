from django.urls import path

from audiomanager.views import UploadMusicView, ListMusicView, ToggleFavoriteView, GetFavoritesView, SongsByGenreView, \
    PlaylistCreateView, PlaylistDetailView, RemoveFromPlaylistView, AddToPlaylistView, UserPlaylistsView, \
    SearchSongsView, DeletePlaylistView

urlpatterns = [
    path('upload_music/', UploadMusicView.as_view(), name='upload_music'),
    path('list_music/', ListMusicView.as_view(), name='list_music'),
    path('toggle_favorite/<int:track_id>/', ToggleFavoriteView.as_view(), name='toggle_favorite'),
    path('get_favorites/', GetFavoritesView.as_view(), name='get_favorites'),
    path('songs_by_genre/<str:genre>/', SongsByGenreView.as_view(), name='songs_by_genre'),
    path('playlists/create/', PlaylistCreateView.as_view(), name='create_playlist'),
    path('playlists/<int:playlist_id>/', PlaylistDetailView.as_view(), name='playlist_detail'),
    path('playlists/<int:playlist_id>/add/', AddToPlaylistView.as_view(), name='add_to_playlist'),
    path('playlists/<int:playlist_id>/remove/', RemoveFromPlaylistView.as_view(), name='remove_from_playlist'),
    path('playlists/<int:playlist_id>/delete/', DeletePlaylistView.as_view(), name='delete_playlist'),
    path('playlists/', UserPlaylistsView.as_view(), name='user_playlists'),
    path('search_songs/', SearchSongsView.as_view(), name='search_songs'),
]
