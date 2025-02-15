from django.db import models
from django.conf import settings

class MusicTrack(models.Model):
    artist_name = models.CharField(max_length=255)
    audio_name = models.CharField(max_length=255)
    audio_file = models.FileField(upload_to='music/')
    image = models.ImageField(upload_to='images/')
    hls_file = models.URLField(blank=True, null=True)
    favorited_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='favorite_tracks', blank=True)
    genre = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.artist_name} - {self.audio_name}"

class Playlist(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='playlists')
    tracks = models.ManyToManyField(MusicTrack, related_name='playlists', blank=True)

    def __str__(self):
        return self.name
