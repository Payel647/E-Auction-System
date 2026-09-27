from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()

    serializer_class = RegisterSerializer


class ProfileView(generics.RetrieveAPIView):

    serializer_class = RegisterSerializer

    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user