# accounts/admin.py

from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "role",
        "is_active",
        "is_staff",
    )

    list_filter = (
        "role",
        "is_active",
        "is_staff",
    )

    search_fields = (
        "username",
        "email",
    )

    ordering = ("id",)

    # Fields shown in detail page
    fieldsets = (
        ("Basic Info", {
            "fields": ("username", "email", "password")
        }),

        ("Personal Info", {
            "fields": ("address", "contact_number", "dob", "profile_photo")
        }),

        ("Permissions", {
            "fields": ("role", "is_active", "is_staff", "is_superuser")
        }),
    )