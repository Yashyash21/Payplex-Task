# accounts/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('users/', AllUsersView.as_view()),
    path('toggle/<int:user_id>/', ToggleUserStatus.as_view()),
]