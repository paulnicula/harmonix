from rest_framework import serializers

from audiomanager.models import MusicTrack


class MusicTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = MusicTrack
        fields = '__all__'
