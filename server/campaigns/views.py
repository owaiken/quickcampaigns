from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
import logging
from .models import Campaign, CampaignCreative, FacebookAdAccount, UserCredit, CreditTransaction
from .serializers import (
    CampaignSerializer, CampaignCreativeSerializer, 
    FacebookAdAccountSerializer, UserCreditSerializer,
    CreditTransactionSerializer
)
from .services.facebook_service import FacebookService

logger = logging.getLogger(__name__)


class FacebookAdAccountViewSet(viewsets.ModelViewSet):
    serializer_class = FacebookAdAccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return FacebookAdAccount.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def connect(self, request):
        """Connect a Facebook Ad Account using OAuth"""
        # This would be implemented with the Facebook Marketing API
        # For now, we'll simulate a successful connection
        account_data = {
            'user': request.user,
            'account_id': 'fb_123456789',
            'name': 'My Facebook Ad Account',
            'is_active': True,
            'access_token': 'simulated_access_token'
        }
        
        # Check if account already exists
        existing_account = FacebookAdAccount.objects.filter(
            user=request.user, 
            account_id=account_data['account_id']
        ).first()
        
        if existing_account:
            serializer = self.get_serializer(existing_account)
            return Response(serializer.data)
        
        # Create new account
        account = FacebookAdAccount.objects.create(**account_data)
        serializer = self.get_serializer(account)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CampaignViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Campaign.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def launch(self, request, pk=None):
        """Launch a campaign to Facebook Ads"""
        campaign = self.get_object()
        
        # Check if user has enough credits
        try:
            user_credit = UserCredit.objects.get(user=request.user)
            if user_credit.balance < 1:  # Assuming 1 credit per campaign
                return Response(
                    {"detail": "Insufficient credits to launch campaign."},
                    status=status.HTTP_402_PAYMENT_REQUIRED
                )
        except UserCredit.DoesNotExist:
            return Response(
                {"detail": "No credits available. Please purchase credits."},
                status=status.HTTP_402_PAYMENT_REQUIRED
            )
        
        try:
            # Get user's Facebook ad account
            fb_account = FacebookAdAccount.objects.filter(user=request.user, is_active=True).first()
            
            if not fb_account:
                return Response(
                    {"detail": "No connected Facebook ad account found. Please connect your Facebook account first."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create Facebook campaign using the user's Facebook account
            fb_service = FacebookService(
                access_token=fb_account.access_token,
                ad_account_id=fb_account.account_id.replace('act_', '')  # Remove 'act_' prefix if present
            )
            
            facebook_campaign_id = fb_service.create_campaign(
                name=campaign.name,
                objective=campaign.objective,
                daily_budget=str(campaign.budget),
                start_time=campaign.start_date.isoformat(),
                end_time=campaign.end_date.isoformat() if campaign.end_date else None,
                status='ACTIVE'
            )
            
            # Update campaign with Facebook ID
            campaign.status = 'active'
            campaign.facebook_campaign_id = facebook_campaign_id
            campaign.save()
            
            # Deduct credits
            user_credit.balance -= 1
            user_credit.save()
            
            # Record the transaction
            CreditTransaction.objects.create(
                user=request.user,
                amount=-1,
                transaction_type='usage',
                description=f"Credit used for campaign: {campaign.name}",
                campaign=campaign
            )
            
            logger.info(f"Successfully launched campaign {campaign.id} to Facebook with ID {facebook_campaign_id}")
            
            serializer = self.get_serializer(campaign)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Error launching campaign to Facebook: {str(e)}")
            return Response(
                {"detail": f"Error launching campaign: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CampaignCreativeViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignCreativeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        campaign_id = self.kwargs.get('campaign_pk')
        return CampaignCreative.objects.filter(
            campaign_id=campaign_id,
            campaign__user=self.request.user
        )
    
    def perform_create(self, serializer):
        campaign_id = self.kwargs.get('campaign_pk')
        campaign = Campaign.objects.get(id=campaign_id, user=self.request.user)
        serializer.save(campaign=campaign)


class UserCreditViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserCreditSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserCredit.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def purchase(self, request):
        """Purchase credits using Stripe"""
        # This would be implemented with the Stripe API
        # For now, we'll simulate a successful purchase
        amount = request.data.get('amount', 10)
        
        user_credit, created = UserCredit.objects.get_or_create(user=request.user)
        user_credit.balance += amount
        user_credit.save()
        
        # Record the transaction
        CreditTransaction.objects.create(
            user=request.user,
            amount=amount,
            transaction_type='purchase',
            description=f"Purchased {amount} credits",
            stripe_payment_id='simulated_payment_id'
        )
        
        serializer = self.get_serializer(user_credit)
        return Response(serializer.data)
