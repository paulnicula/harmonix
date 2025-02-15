from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.conf import settings
import os
import uuid
import subprocess
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.contrib.auth import get_user_model
from audiomanager.models import MusicTrack, Playlist

CustomUser = get_user_model()


def resize_image(image, size=(300, 300)):
    img = Image.open(image)
    img.thumbnail(size, Image.Resampling.LANCZOS)
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    buffer.seek(0)
    return InMemoryUploadedFile(buffer, 'ImageField', image.name, 'image/jpeg', buffer.tell(), None)


class UploadMusicView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'audio_file' not in request.FILES:
            return Response({"status": "error", "message": "No audio file in the request"}, status=400)

        audio_file = request.FILES.get('audio_file')
        image_file = request.FILES.get('image')

        if image_file:
            try:
                image_file = resize_image(image_file)
            except Exception as e:
                return Response({"status": "error", "message": f"Image processing error: {str(e)}"}, status=500)

        song_id = str(uuid.uuid4())

        base_location = settings.MEDIA_ROOT
        hls_folder = os.path.join(base_location, 'hls', song_id)
        os.makedirs(hls_folder, exist_ok=True)

        audio_file.name = f"{song_id}_{audio_file.name}"
        audio_path = os.path.join(base_location, 'music', audio_file.name)
        with open(audio_path, 'wb+') as destination:
            for chunk in audio_file.chunks():
                destination.write(chunk)

        m3u8_dest = os.path.join(hls_folder, "playlist.m3u8")
        seg_dest = os.path.join(hls_folder, "segment%d.ts")
        ffmpeg_command = [
            "ffmpeg",
            "-i", audio_path,
            "-vn", "-ac", "2",
            "-acodec", "aac",
            "-f", "segment",
            "-segment_format", "mpegts",
            "-segment_time", "10",
            "-segment_list", m3u8_dest,
            seg_dest
        ]

        try:
            subprocess.run(ffmpeg_command, check=True, text=True, capture_output=True)
        except subprocess.CalledProcessError as e:
            return Response({"status": "error", "message": f"FFmpeg error: {e.stderr}"}, status=500)

        hls_url = request.build_absolute_uri(f"/media/hls/{song_id}/playlist.m3u8")

        music_track = MusicTrack.objects.create(
            artist_name=request.POST.get('artist_name', ''),
            audio_name=request.POST.get('audio_name', ''),
            audio_file=audio_file,
            image=image_file if image_file else None,
            hls_file=hls_url,
            genre=request.POST.get('genre', '')
        )

        return Response({"status": "success", "song_id": song_id})


class ToggleFavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, track_id):
        user = request.user
        try:
            track = MusicTrack.objects.get(id=track_id)
        except MusicTrack.DoesNotExist:
            return Response({'status': 'error', 'message': 'Track not found'}, status=status.HTTP_404_NOT_FOUND)

        if user in track.favorited_by.all():
            track.favorited_by.remove(user)
            return Response({'status': 'unfavorited', 'track_id': track_id})
        else:
            track.favorited_by.add(user)
            return Response({'status': 'favorited', 'track_id': track_id})


class ListMusicView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        tracks = MusicTrack.objects.all()
        user = request.user if request.user.is_authenticated else None

        music_list = [{
            'id': track.id,
            'artist_name': track.artist_name,
            'audio_name': track.audio_name,
            'audio_file': request.build_absolute_uri(track.audio_file.url),
            'image': request.build_absolute_uri(track.image.url) if track.image else None,
            'hls_file': track.hls_file,
            'is_favorited': user in track.favorited_by.all() if user else False,
            'genre': track.genre
        } for track in tracks]

        return Response({'music_list': music_list})


class GetFavoritesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        favorites = user.favorite_tracks.all()

        favorite_list = [{
            'id': track.id,
            'artist_name': track.artist_name,
            'audio_name': track.audio_name,
            'audio_file': request.build_absolute_uri(track.audio_file.url),
            'image': request.build_absolute_uri(track.image.url) if track.image else None,
            'hls_file': track.hls_file,
            'is_favorited': True,
            'genre': track.genre
        } for track in favorites]

        return Response({'music_list': favorite_list})


class SongsByGenreView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, genre):
        try:
            tracks = MusicTrack.objects.filter(genre=genre)
            user = request.user if request.user.is_authenticated else None

            music_list = [{
                'id': track.id,
                'artist_name': track.artist_name,
                'audio_name': track.audio_name,
                'audio_file': request.build_absolute_uri(track.audio_file.url),
                'image': request.build_absolute_uri(track.image.url) if track.image else None,
                'hls_file': track.hls_file,
                'is_favorited': user in track.favorited_by.all() if user else False,
                'genre': track.genre
            } for track in tracks]

            return Response({'music_list': music_list})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PlaylistCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        playlist_name = request.data.get('name', '').strip()
        if not playlist_name:
            return Response({"status": "error", "message": "Playlist name is required"}, status=400)

        playlist = Playlist.objects.create(name=playlist_name, user=request.user)
        return Response({"status": "success", "playlist_id": playlist.id}, status=201)


class PlaylistDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, playlist_id):
        try:
            playlist = Playlist.objects.get(id=playlist_id, user=request.user)
            tracks = playlist.tracks.all()

            music_list = [{
                'id': track.id,
                'artist_name': track.artist_name,
                'audio_name': track.audio_name,
                'audio_file': request.build_absolute_uri(track.audio_file.url),
                'image': request.build_absolute_uri(track.image.url) if track.image else None,
                'hls_file': track.hls_file,
                'is_favorited': request.user in track.favorited_by.all(),
                'genre': track.genre
            } for track in tracks]

            return Response({'playlist_name': playlist.name, 'music_list': music_list}, status=200)
        except Playlist.DoesNotExist:
            return Response({'status': 'error', 'message': 'Playlist not found'}, status=404)


class AddToPlaylistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, playlist_id):
        track_id = request.data.get('track_id')

        try:
            playlist = Playlist.objects.get(id=playlist_id, user=request.user)
            track = MusicTrack.objects.get(id=track_id)
            playlist.tracks.add(track)
            return Response({"status": "success", "message": "Track added to playlist"}, status=200)
        except Playlist.DoesNotExist:
            return Response({'status': 'error', 'message': 'Playlist not found'}, status=404)
        except MusicTrack.DoesNotExist:
            return Response({'status': 'error', 'message': 'Track not found'}, status=404)


class RemoveFromPlaylistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, playlist_id):
        track_id = request.data.get('track_id')
        playlist = Playlist.objects.get(id=playlist_id, user=request.user)
        track = MusicTrack.objects.get(id=track_id)
        playlist.tracks.remove(track)
        return Response({"status": "success", "message": "Track removed from playlist"}, status=200)


class DeletePlaylistView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, playlist_id):
        try:
            playlist = Playlist.objects.get(id=playlist_id, user=request.user)
            playlist.delete()
            return Response({"status": "success", "message": "Playlist deleted successfully"},
                            status=status.HTTP_200_OK)
        except Playlist.DoesNotExist:
            return Response({"status": "error", "message": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)


class UserPlaylistsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        playlists = Playlist.objects.filter(user=user)

        playlist_data = [{
            'id': playlist.id,
            'name': playlist.name,
            'tracks': [{
                'id': track.id,
                'artist_name': track.artist_name,
                'audio_name': track.audio_name,
                'audio_file': request.build_absolute_uri(track.audio_file.url),
                'image': request.build_absolute_uri(track.image.url) if track.image else None,
                'hls_file': track.hls_file,
                'is_favorited': user in track.favorited_by.all(),
                'genre': track.genre
            } for track in playlist.tracks.all()]
        } for playlist in playlists]

        return Response({'playlists': playlist_data}, status=status.HTTP_200_OK)


class SearchSongsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user
        query = request.GET.get('query', '')
        if query:
            tracks = MusicTrack.objects.filter(
                Q(artist_name__icontains=query) |
                Q(audio_name__icontains=query)
            )
            music_list = [{
                'id': track.id,
                'artist_name': track.artist_name,
                'audio_name': track.audio_name,
                'audio_file': request.build_absolute_uri(track.audio_file.url),
                'image': request.build_absolute_uri(track.image.url) if track.image else None,
                'hls_file': track.hls_file,
                'is_favorited': user in track.favorited_by.all() if user else False,
                'genre': track.genre
            } for track in tracks]
            return Response({'music_list': music_list})
        return Response({'music_list': []})