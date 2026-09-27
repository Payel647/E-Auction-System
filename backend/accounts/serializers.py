from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True, # it is a parameter that specifies that the password field should only be used for writing data (creating or updating) and should not be included in the serialized representation when reading data (retrieving user information). This is important for security reasons, as you don't want to expose users' passwords in API responses.
        min_length=6
    )

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "password",
            "role",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        return user