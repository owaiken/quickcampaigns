"""
Facebook OAuth authentication for QuickCampaigns
"""
import os
import logging
import requests
from django.conf import settings
from django.http import HttpResponseRedirect
from django.urls import reverse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import FacebookAdAccount

logger = logging.getLogger(__name__)

@api_view(['GET'])
def facebook_login(request):
    """
    Redirect the user to Facebook OAuth login page
    """
    app_id = os.environ.get('FACEBOOK_APP_ID')
    redirect_uri = request.build_absolute_uri(reverse('facebook-callback'))
    
    # Define the permissions we need
    scope = 'ads_management,ads_read,business_management'
    
    # Build the authorization URL
    auth_url = (
        f"https://www.facebook.com/v17.0/dialog/oauth?"
        f"client_id={app_id}&redirect_uri={redirect_uri}&"
        f"scope={scope}&response_type=code"
    )
    
    return HttpResponseRedirect(auth_url)

@api_view(['GET'])
def facebook_callback(request):
    """
    Handle the callback from Facebook OAuth
    """
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    if error:
        logger.error(f"Facebook OAuth error: {error}")
        return Response(
            {"detail": f"Facebook authorization failed: {error}"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not code:
        logger.error("No code provided in Facebook callback")
        return Response(
            {"detail": "No authorization code provided"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Exchange code for access token
        app_id = os.environ.get('FACEBOOK_APP_ID')
        app_secret = os.environ.get('FACEBOOK_APP_SECRET')
        redirect_uri = request.build_absolute_uri(reverse('facebook-callback'))
        
        response = requests.get(
            'https://graph.facebook.com/v17.0/oauth/access_token',
            params={
                'client_id': app_id,
                'client_secret': app_secret,
                'redirect_uri': redirect_uri,
                'code': code
            }
        )
        
        if response.status_code != 200:
            logger.error(f"Error exchanging code for token: {response.text}")
            return Response(
                {"detail": "Failed to exchange code for access token"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = response.json()
        access_token = data.get('access_token')
        
        # Get user's ad accounts
        ad_accounts_response = requests.get(
            'https://graph.facebook.com/v17.0/me/adaccounts',
            params={
                'access_token': access_token,
                'fields': 'id,name,account_status'
            }
        )
        
        if ad_accounts_response.status_code != 200:
            logger.error(f"Error fetching ad accounts: {ad_accounts_response.text}")
            return Response(
                {"detail": "Failed to fetch Facebook ad accounts"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ad_accounts = ad_accounts_response.json().get('data', [])
        
        if not ad_accounts:
            return Response(
                {"detail": "No ad accounts found for this Facebook user"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # For now, just use the first ad account
        ad_account = ad_accounts[0]
        account_id = ad_account['id']
        account_name = ad_account['name']
        
        # Get or create user if not authenticated
        if request.user.is_authenticated:
            user = request.user
        else:
            # For demo purposes, use the first user or create a demo user
            # In production, you would handle this differently
            User = get_user_model()
            user, created = User.objects.get_or_create(
                email='demo@example.com',
                defaults={'username': 'demo_user'}
            )
            
        # Save or update the Facebook ad account
        fb_account, created = FacebookAdAccount.objects.update_or_create(
            user=user,
            account_id=account_id,
            defaults={
                'name': account_name,
                'access_token': access_token,
                'is_active': True
            }
        )
        
        logger.info(f"{'Created' if created else 'Updated'} Facebook ad account for user {request.user.id}")
        
        # Redirect to the dashboard with success message
        frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
        return HttpResponseRedirect(f"{frontend_url}/main?facebook_connected=true")
        
    except Exception as e:
        logger.exception(f"Error in Facebook callback: {str(e)}")
        return Response(
            {"detail": f"Error processing Facebook authorization: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def facebook_accounts(request):
    """
    Get the user's connected Facebook ad accounts
    """
    if request.user.is_authenticated:
        accounts = FacebookAdAccount.objects.filter(user=request.user)
    else:
        # For demo purposes, return all accounts
        # In production, you would handle this differently
        accounts = FacebookAdAccount.objects.all()[:5]
    
    result = []
    for account in accounts:
        result.append({
            'id': account.id,
            'account_id': account.account_id,
            'name': account.name,
            'is_active': account.is_active,
            'created_at': account.created_at
        })
    
    return Response(result)

@api_view(['DELETE'])
def disconnect_facebook(request, account_id):
    """
    Disconnect a Facebook ad account
    """
    try:
        if request.user.is_authenticated:
            account = FacebookAdAccount.objects.get(id=account_id, user=request.user)
        else:
            # For demo purposes, allow disconnecting any account
            # In production, you would handle this differently
            account = FacebookAdAccount.objects.get(id=account_id)
            
        account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except FacebookAdAccount.DoesNotExist:
        return Response(
            {"detail": "Facebook ad account not found"},
            status=status.HTTP_404_NOT_FOUND
        )
