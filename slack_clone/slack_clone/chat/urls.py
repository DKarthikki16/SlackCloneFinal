from django.urls import path
from .views import chain_channels
from .views import (
    register_user, get_users, get_me,
    WorkspaceListCreateView, WorkspaceRetrieveUpdateDestroyView,
    ChannelListCreateView, ChannelRetrieveUpdateDestroyView,
    DirectMessageGroupListCreateView, DirectMessageGroupRetrieveUpdateDestroyView,
    MessageListCreateView, MessageRetrieveUpdateDestroyView,
    DMMessageListCreateView  # ✅ for direct messages
)

urlpatterns = [
    # User Registration and Listing
    path('register/', register_user, name='register'),
    path('users/', get_users, name='user-list'),

    # Workspace
    path('workspaces/', WorkspaceListCreateView.as_view(), name='workspace-list'),
    path('workspaces/<int:pk>/', WorkspaceRetrieveUpdateDestroyView.as_view(), name='workspace-detail'),

    # Channels
    path('channels/', ChannelListCreateView.as_view(), name='channel-list'),
    path('channels/<int:pk>/', ChannelRetrieveUpdateDestroyView.as_view(), name='channel-detail'),
    path('channels/<int:channel_id>/messages/', MessageListCreateView.as_view(), name='channel-messages'),

    # Direct Messages
    path('dm-groups/', DirectMessageGroupListCreateView.as_view(), name='dmgroup-list'),
    path('dm-groups/<int:pk>/', DirectMessageGroupRetrieveUpdateDestroyView.as_view(), name='dmgroup-detail'),
    path('dm-groups/<int:dm_group_id>/messages/', DMMessageListCreateView.as_view(), name='dm-messages'),  # ✅ DM messages

    # General Message APIs (used for both DM and channel messages)
    path('messages/channel/<int:channel_id>/', MessageListCreateView.as_view(), name='channel-messages-alt'),
    path('messages/dm/<int:dm_group_id>/', DMMessageListCreateView.as_view(), name='dm-messages-alt'),  # ✅ DM again
    path('messages/<int:pk>/', MessageRetrieveUpdateDestroyView.as_view(), name='message-detail'),
    path('api/chain_channels/', chain_channels),
    path('me/', get_me, name='me'),

]
