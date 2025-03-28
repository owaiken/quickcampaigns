from rest_framework import serializers
from .models import Campaign, CampaignCreative, FacebookAdAccount, UserCredit, CreditTransaction


class FacebookAdAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacebookAdAccount
        fields = ['id', 'account_id', 'name', 'is_active', 'created_at']
        read_only_fields = ['created_at']


class CampaignCreativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignCreative
        fields = ['id', 'file', 'file_type', 'file_name', 'file_size', 'created_at']
        read_only_fields = ['created_at']


class CampaignSerializer(serializers.ModelSerializer):
    creatives = CampaignCreativeSerializer(many=True, read_only=True)
    
    class Meta:
        model = Campaign
        fields = [
            'id', 'name', 'objective', 'status', 'budget', 
            'start_date', 'end_date', 'target_audience', 
            'facebook_campaign_id', 'created_at', 'updated_at',
            'creatives'
        ]
        read_only_fields = ['created_at', 'updated_at', 'facebook_campaign_id']


class UserCreditSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCredit
        fields = ['balance', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class CreditTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTransaction
        fields = [
            'id', 'amount', 'transaction_type', 'description',
            'stripe_payment_id', 'campaign', 'created_at'
        ]
        read_only_fields = ['created_at']
