from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    plan_type = models.CharField(max_length=30, default="default plan")

    def __str__(self):
        return self.username
