from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class FacebookAdAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='facebook_accounts')
    account_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    access_token = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.account_id})"


class Campaign(models.Model):
    OBJECTIVE_CHOICES = [
        ('website', 'Website Conversions'),
        ('lead', 'Lead Form Campaign'),
        ('traffic', 'Traffic Campaign'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('error', 'Error'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='campaigns')
    facebook_account = models.ForeignKey(FacebookAdAccount, on_delete=models.SET_NULL, null=True, blank=True, related_name='campaigns')
    name = models.CharField(max_length=255)
    objective = models.CharField(max_length=50, choices=OBJECTIVE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    target_audience = models.TextField(null=True, blank=True)
    facebook_campaign_id = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class CampaignCreative(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='creatives')
    file = models.FileField(upload_to='campaign_creatives/%Y/%m/%d/')
    file_type = models.CharField(max_length=50)
    file_name = models.CharField(max_length=255)
    file_size = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file_name} - {self.campaign.name}"


class UserCredit(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='credits')
    balance = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.balance} credits"


class CreditTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('purchase', 'Purchase'),
        ('usage', 'Campaign Usage'),
        ('refund', 'Refund'),
        ('bonus', 'Bonus Credits'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='credit_transactions')
    amount = models.IntegerField()
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    description = models.TextField(null=True, blank=True)
    stripe_payment_id = models.CharField(max_length=100, null=True, blank=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True, blank=True, related_name='credit_transactions')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.transaction_type} - {self.amount} credits"
