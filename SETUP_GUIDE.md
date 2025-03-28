# QuickCampaigns Setup Guide

This guide will walk you through setting up your QuickCampaigns application with your existing Supabase, Redis, and Amazon S3 resources, and deploying it to Vercel.

## 1. Configure Environment Variables

### Backend Environment Setup

1. Edit the `/server/.env.local` file with your actual credentials:

```
# Django Configuration
DEBUG=True
SECRET_KEY=your-secure-secret-key-replace-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Supabase PostgreSQL Configuration
DB_ENGINE=django.db.backends.postgresql
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_supabase_password
DB_HOST=your_supabase_host.supabase.co
DB_PORT=5432

# Redis Configuration
REDIS_URL=your_redis_endpoint

# AWS S3 Configuration
USE_S3=True
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_STORAGE_BUCKET_NAME=your_bucket_name
AWS_S3_REGION_NAME=your_bucket_region
```

### Frontend Environment Setup

1. Edit the `/client/.env` file:

```
# For local development
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production with Vercel (uncomment when deploying)
# NEXT_PUBLIC_API_URL=https://your-django-backend-url.com
```

## 2. Deploy the Django Backend

You have two options for deploying the Django backend:

### Option 1: Deploy to a Platform like Heroku or Railway

1. Create an account on Heroku or Railway if you don't have one
2. Install the Heroku CLI (if using Heroku):
   ```
   brew install heroku/brew/heroku
   ```
3. Log in to Heroku:
   ```
   heroku login
   ```
4. Create a new app:
   ```
   heroku create quickcampaigns-api
   ```
5. Set up environment variables:
   ```
   heroku config:set SECRET_KEY=your-secure-secret-key
   heroku config:set POSTGRES_DB=postgres
   heroku config:set POSTGRES_USER=postgres
   heroku config:set POSTGRES_PASSWORD=your_supabase_password
   heroku config:set DB_HOST=your_supabase_host.supabase.co
   heroku config:set DB_PORT=5432
   heroku config:set REDIS_URL=your_redis_endpoint
   heroku config:set USE_S3=True
   heroku config:set AWS_ACCESS_KEY_ID=your_aws_access_key
   heroku config:set AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   heroku config:set AWS_STORAGE_BUCKET_NAME=your_bucket_name
   heroku config:set AWS_S3_REGION_NAME=your_bucket_region
   ```
6. Deploy the Django backend:
   ```
   cd /Users/aj/Downloads/django-nextjs-boilerplate
   git subtree push --prefix server heroku main
   ```

### Option 2: Deploy to a VPS like DigitalOcean

1. Create a Droplet on DigitalOcean
2. SSH into your Droplet
3. Clone your repository
4. Set up environment variables
5. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
6. Run migrations:
   ```
   python manage.py migrate
   ```
7. Set up Gunicorn and Nginx

## 3. Deploy the Next.js Frontend to Vercel

1. Push your code to a GitHub repository
2. Log in to Vercel and create a new project
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: client
   - Build Command: npm run build
   - Output Directory: .next
5. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-django-backend-url.com
   ```
6. Deploy the project

## 4. Connect to Your Existing Resources

### Supabase Connection

1. Make sure your Django settings are configured to use Supabase:
   ```python
   DATABASES = {
       "default": {
           "ENGINE": "django.db.backends.postgresql",
           "NAME": os.environ.get("POSTGRES_DB", "postgres"),
           "USER": os.environ.get("POSTGRES_USER", "postgres"),
           "PASSWORD": os.environ.get("POSTGRES_PASSWORD", ""),
           "HOST": os.environ.get("DB_HOST", ""),
           "PORT": os.environ.get("DB_PORT", "5432"),
           "OPTIONS": {
               "sslmode": "require"
           }
       }
   }
   ```

2. Run migrations to set up your database schema:
   ```
   python manage.py migrate
   ```

### Redis Connection

1. Make sure your Django settings are configured to use Redis:
   ```python
   CACHES = {
       "default": {
           "BACKEND": "django_redis.cache.RedisCache",
           "LOCATION": os.environ.get("REDIS_URL", "redis://localhost:6379/0"),
           "OPTIONS": {
               "CLIENT_CLASS": "django_redis.client.DefaultClient",
           }
       }
   }
   
   # Session configuration
   SESSION_ENGINE = "django.contrib.sessions.backends.cache"
   SESSION_CACHE_ALIAS = "default"
   ```

### Amazon S3 Connection

1. Make sure your Django settings are configured to use S3:
   ```python
   if os.environ.get('USE_S3', 'False') == 'True':
       # AWS Settings
       AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
       AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
       AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
       AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', 'us-east-1')
       AWS_DEFAULT_ACL = 'private'
       AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
       AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
       
       # S3 Static Settings
       STATIC_LOCATION = 'static'
       STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{STATIC_LOCATION}/'
       STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
       
       # S3 Media Settings
       MEDIA_LOCATION = 'media'
       MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{MEDIA_LOCATION}/'
       DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
   ```

## 5. Local Development Setup

For local development, you can use SQLite instead of connecting to Supabase:

1. Set `USE_SQLITE=True` in your environment variables
2. Run the Django development server:
   ```
   cd /Users/aj/Downloads/django-nextjs-boilerplate/server
   python manage.py runserver
   ```
3. Run the Next.js development server:
   ```
   cd /Users/aj/Downloads/django-nextjs-boilerplate/client
   npm install
   npm run dev
   ```

## 6. Testing Your Setup

1. Test the Django backend API:
   ```
   curl http://localhost:8000/swagger/
   ```
2. Test the Next.js frontend:
   ```
   open http://localhost:3000
   ```

## 7. Troubleshooting

### Database Connection Issues

If you're having trouble connecting to Supabase:

1. Verify your connection string and credentials
2. Make sure your Supabase project allows connections from your IP address
3. Check if SSL is required (it usually is)

### S3 Connection Issues

If you're having trouble with S3:

1. Verify your AWS credentials
2. Check bucket permissions
3. Make sure CORS is configured correctly

### Redis Connection Issues

If you're having trouble with Redis:

1. Verify your Redis endpoint
2. Check if authentication is required
3. Make sure your Redis instance allows connections from your application

## 8. Next Steps

After setting up your application:

1. Create a superuser for the Django admin:
   ```
   python manage.py createsuperuser
   ```
2. Configure Facebook API integration
3. Set up Stripe for payment processing
4. Implement user authentication flows
5. Test campaign creation and management
