# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

# accounts/models.py

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )

    email = models.EmailField(unique=True)   # ✅ ADD THIS

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    address = models.TextField(blank=True)
    contact_number = models.CharField(max_length=15, blank=True)
    dob = models.DateField(null=True, blank=True)
    profile_photo = models.ImageField(upload_to='profiles/', null=True, blank=True)