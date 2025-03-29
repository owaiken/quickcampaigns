from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import (
    CampaignViewSet, CampaignCreativeViewSet, 
    FacebookAdAccountViewSet, UserCreditViewSet
)
from .auth import facebook_login, facebook_callback, facebook_accounts, disconnect_facebook

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')
router.register(r'facebook-accounts', FacebookAdAccountViewSet, basename='facebook-account')
router.register(r'credits', UserCreditViewSet, basename='credit')

# Nested routes for campaign creatives
campaigns_router = routers.NestedSimpleRouter(router, r'campaigns', lookup='campaign')
campaigns_router.register(r'creatives', CampaignCreativeViewSet, basename='campaign-creative')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(campaigns_router.urls)),
    
    # Facebook OAuth endpoints
    path('auth/facebook/login/', facebook_login, name='facebook-login'),
    path('auth/facebook/callback/', facebook_callback, name='facebook-callback'),
    path('auth/facebook/accounts/', facebook_accounts, name='facebook-accounts'),
    path('auth/facebook/disconnect/<int:account_id>/', disconnect_facebook, name='facebook-disconnect'),
]
