# ✅ Updated views.py with support for unique DM group creation and clean registration
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics, permissions, status, serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Channel, Message, Workspace, DirectMessageGroup
from .serializers import ChannelSerializer, MessageSerializer, WorkspaceSerializer, DirectMessageGroupSerializer, UserSerializer

# ✅ USER REGISTRATION VIEW
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response({'detail': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    refresh = RefreshToken.for_user(user)
    return Response({
        'detail': 'User registered successfully.',
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }, status=status.HTTP_201_CREATED)

# ✅ GET USERS (for DM selection)
@api_view(['GET'])
def get_users(request):
    users = User.objects.all().values('id', 'username', 'email')
    return Response(list(users))

# ✅ RETURN CURRENT USER
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# ✅ STATIC HTML VIEW (optional)
def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name,
        'username': request.user.username
    })

# ✅ CHAIN CHANNEL FILTER
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def chain_channels(request):
    channels = Channel.objects.filter(is_chain=True)
    serializer = ChannelSerializer(channels, many=True)
    return Response(serializer.data)

# ✅ WORKSPACE VIEWS
class WorkspaceListCreateView(generics.ListCreateAPIView):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

class WorkspaceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

# ✅ CHANNEL VIEWS
class ChannelListCreateView(generics.ListCreateAPIView):
    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        workspace_id = self.request.query_params.get('workspace_id')
        if workspace_id:
            return Channel.objects.filter(workspace_id=workspace_id)
        return Channel.objects.all()

    def perform_create(self, serializer):
        workspace_id = self.request.data.get('workspace')
        if workspace_id:
            try:
                workspace = Workspace.objects.get(id=workspace_id)
                serializer.save(workspace=workspace)
            except Workspace.DoesNotExist:
                raise serializers.ValidationError({'workspace': 'Invalid workspace ID'})
        else:
            raise serializers.ValidationError({'workspace': 'Workspace ID is required'})

class ChannelRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticated]

# ✅ DIRECT MESSAGE GROUP VIEWS
class DirectMessageGroupListCreateView(generics.ListCreateAPIView):
    serializer_class = DirectMessageGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return DirectMessageGroup.objects.filter(participants=user)

    def create(self, request, *args, **kwargs):
        participant_ids = request.data.get('participants', [])
        user = request.user

        if not participant_ids:
            return Response({'error': 'No participants provided.'}, status=400)

        # Include current user in the participants list
        all_ids = list(set(participant_ids + [user.id]))
        users = User.objects.filter(id__in=all_ids)

        # Check for existing group
        for group in DirectMessageGroup.objects.all():
            if set(group.participants.values_list('id', flat=True)) == set(all_ids):
                serializer = self.get_serializer(group)
                return Response(serializer.data, status=200)

        group = DirectMessageGroup.objects.create()
        group.participants.set(users)
        serializer = self.get_serializer(group)
        return Response(serializer.data, status=201)

class DirectMessageGroupRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DirectMessageGroup.objects.all()
    serializer_class = DirectMessageGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

# ✅ MESSAGE VIEWS (CHANNEL AND DM)
class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        channel_id = self.kwargs.get('channel_id')
        dm_group_id = self.kwargs.get('dm_group_id')

        if channel_id:
            return Message.objects.filter(channel_id=channel_id)
        elif dm_group_id:
            return Message.objects.filter(dm_group_id=dm_group_id)
        return Message.objects.none()

    def perform_create(self, serializer):
        channel_id = self.kwargs.get('channel_id')
        dm_group_id = self.kwargs.get('dm_group_id')

        if channel_id:
            serializer.save(sender=self.request.user, channel_id=channel_id)
        elif dm_group_id:
            serializer.save(sender=self.request.user, dm_group_id=dm_group_id)

class DMMessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        dm_group_id = self.kwargs.get('dm_group_id')
        return Message.objects.filter(dm_group_id=dm_group_id).order_by('-timestamp')

    def perform_create(self, serializer):
        dm_group_id = self.kwargs.get('dm_group_id')
        serializer.save(sender=self.request.user, dm_group_id=dm_group_id)

class MessageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

