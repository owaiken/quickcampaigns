from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import (
    CampaignViewSet, CampaignCreativeViewSet, 
    FacebookAdAccountViewSet, UserCreditViewSet
)

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
]
