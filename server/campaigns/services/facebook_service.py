"""
Facebook Marketing API Service for QuickCampaigns
"""
import os
import logging
from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.campaign import Campaign
from facebook_business.adobjects.adset import AdSet
from facebook_business.adobjects.ad import Ad
from facebook_business.adobjects.adcreative import AdCreative
from facebook_business.exceptions import FacebookRequestError

logger = logging.getLogger(__name__)

class FacebookService:
    """
    Service class for interacting with the Facebook Marketing API
    """
    def __init__(self, access_token=None, ad_account_id=None):
        """
        Initialize the Facebook API with credentials
        
        Args:
            access_token: Optional user-specific access token. If not provided, uses system token
            ad_account_id: Optional ad account ID. If not provided, uses system account
        """
        self.app_id = os.environ.get('FACEBOOK_APP_ID')
        self.app_secret = os.environ.get('FACEBOOK_APP_SECRET')
        
        # Use provided token or fall back to system token
        self.access_token = access_token or os.environ.get('FACEBOOK_ACCESS_TOKEN')
        
        # Use provided ad account or fall back to system account
        self.ad_account_id = ad_account_id or os.environ.get('FACEBOOK_AD_ACCOUNT_ID')
        
        # Initialize the Facebook API
        FacebookAdsApi.init(self.app_id, self.app_secret, self.access_token)
        self.ad_account = AdAccount(f'act_{self.ad_account_id}')
    
    def create_campaign(self, name, objective, daily_budget, start_time, end_time=None, status='PAUSED'):
        """
        Create a Facebook ad campaign
        
        Args:
            name: Campaign name
            objective: Campaign objective (e.g., LINK_CLICKS, CONVERSIONS)
            daily_budget: Daily budget in cents (e.g., 1000 for $10)
            start_time: Start time in ISO format
            end_time: Optional end time in ISO format
            status: Campaign status (ACTIVE, PAUSED)
        
        Returns:
            Campaign ID
        """
        try:
            # Map Django model objective to Facebook objective
            fb_objective_map = {
                'website': 'CONVERSIONS',
                'lead': 'LEAD_GENERATION',
                'traffic': 'TRAFFIC',
            }
            
            fb_objective = fb_objective_map.get(objective, 'CONVERSIONS')
            
            params = {
                'name': name,
                'objective': fb_objective,
                'status': status,
                'special_ad_categories': [],
                'daily_budget': int(float(daily_budget) * 100),  # Convert to cents
                'start_time': start_time,
            }
            
            if end_time:
                params['end_time'] = end_time
            
            campaign = self.ad_account.create_campaign(params=params)
            logger.info(f"Created Facebook campaign: {name} with ID: {campaign['id']}")
            return campaign['id']
            
        except FacebookRequestError as e:
            logger.error(f"Facebook API error: {str(e)}")
            raise
    
    def get_campaign(self, campaign_id):
        """
        Get campaign details
        
        Args:
            campaign_id: Facebook campaign ID
            
        Returns:
            Campaign object
        """
        try:
            campaign = Campaign(campaign_id)
            campaign.remote_read()
            return campaign
        except FacebookRequestError as e:
            logger.error(f"Facebook API error: {str(e)}")
            raise
    
    def create_ad_set(self, campaign_id, name, targeting, optimization_goal, 
                     bid_amount, start_time, end_time=None, status='PAUSED'):
        """
        Create an ad set within a campaign
        
        Args:
            campaign_id: Facebook campaign ID
            name: Ad set name
            targeting: Dictionary of targeting options
            optimization_goal: Optimization goal (e.g., LINK_CLICKS)
            bid_amount: Bid amount in cents
            start_time: Start time in ISO format
            end_time: Optional end time in ISO format
            status: Ad set status (ACTIVE, PAUSED)
            
        Returns:
            Ad set ID
        """
        try:
            params = {
                'name': name,
                'campaign_id': campaign_id,
                'optimization_goal': optimization_goal,
                'billing_event': 'IMPRESSIONS',
                'bid_amount': bid_amount,
                'targeting': targeting,
                'status': status,
                'start_time': start_time,
            }
            
            if end_time:
                params['end_time'] = end_time
            
            ad_set = self.ad_account.create_ad_set(params=params)
            logger.info(f"Created Facebook ad set: {name} with ID: {ad_set['id']}")
            return ad_set['id']
            
        except FacebookRequestError as e:
            logger.error(f"Facebook API error: {str(e)}")
            raise
    
    def create_ad_creative(self, name, image_url, page_id, message, headline, description, link_url):
        """
        Create an ad creative
        
        Args:
            name: Creative name
            image_url: URL of the image to use
            page_id: Facebook page ID
            message: Ad message
            headline: Ad headline
            description: Ad description
            link_url: URL to link to
            
        Returns:
            Ad creative ID
        """
        try:
            params = {
                'name': name,
                'object_story_spec': {
                    'page_id': page_id,
                    'link_data': {
                        'image_url': image_url,
                        'message': message,
                        'link': link_url,
                        'name': headline,
                        'description': description,
                    }
                }
            }
            
            creative = self.ad_account.create_ad_creative(params=params)
            logger.info(f"Created Facebook ad creative: {name} with ID: {creative['id']}")
            return creative['id']
            
        except FacebookRequestError as e:
            logger.error(f"Facebook API error: {str(e)}")
            raise
    
    def create_ad(self, name, ad_set_id, creative_id, status='PAUSED'):
        """
        Create an ad
        
        Args:
            name: Ad name
            ad_set_id: Ad set ID
            creative_id: Ad creative ID
            status: Ad status (ACTIVE, PAUSED)
            
        Returns:
            Ad ID
        """
        try:
            params = {
                'name': name,
                'adset_id': ad_set_id,
                'creative': {'creative_id': creative_id},
                'status': status,
            }
            
            ad = self.ad_account.create_ad(params=params)
            logger.info(f"Created Facebook ad: {name} with ID: {ad['id']}")
            return ad['id']
            
        except FacebookRequestError as e:
            logger.error(f"Facebook API error: {str(e)}")
            raise
