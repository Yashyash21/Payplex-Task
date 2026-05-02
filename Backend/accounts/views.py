# accounts/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer
from .permissions import IsAdmin

# Register
from rest_framework.permissions import AllowAny

class RegisterView(APIView):
    permission_classes = [AllowAny]   # ✅ FIX

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"msg": "User registered"})

# accounts/views.py

from django.contrib.auth import get_user_model

User = get_user_model()

class LoginView(APIView):
    permission_classes = [AllowAny]   # ✅ important

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found")

        if not user.check_password(password):
            raise AuthenticationFailed("Invalid password")

        if not user.is_active:
            raise AuthenticationFailed("Account inactive")

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "role": user.role,
            "username": user.username,
            "email": user.email
        })

# Profile
# accounts/views.py
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        u = request.user

        return Response({
            "username": u.username,
            "email": u.email,
            "address": u.address,
            "contact_number": u.contact_number,
            "dob": u.dob,
            "profile_photo": u.profile_photo.url if u.profile_photo else None,
            "status": u.is_active,
            "role": u.role
        })

# Admin: All Users
# accounts/views.py
class AllUsersView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        users = User.objects.all()

        data = []
        for u in users:
            data.append({
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "contact_number": u.contact_number,
                "address": u.address,
                "dob": u.dob,
                "profile_photo": u.profile_photo.url if u.profile_photo else None,
                "is_active": u.is_active,
                "role": u.role
            })

        return Response(data)

# Admin: Toggle Active
class ToggleUserStatus(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        user = User.objects.get(id=user_id)
        user.is_active = not user.is_active
        user.save()
        return Response({"status": user.is_active})