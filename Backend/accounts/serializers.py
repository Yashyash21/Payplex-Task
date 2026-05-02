# accounts/serializers.py
from rest_framework import serializers
from .models import User

# accounts/serializers.py

from rest_framework import serializers
from .models import User
# accounts/serializers.py

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "confirm_password",
            "address",
            "contact_number",
            "dob",
            "profile_photo"
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.role = "user"
        user.save()

        return user