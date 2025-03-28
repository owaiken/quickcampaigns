# Deployment Guide for QuickCampaigns

This guide provides step-by-step instructions for deploying the QuickCampaigns application, including the Django backend and Next.js frontend.

## Backend Deployment

### Prerequisites
- PostgreSQL database
- AWS S3 bucket for file storage
- Stripe account for payment processing
- Redis instance for caching and task queue

### Database Setup

1. Create a PostgreSQL database for your application:

```sql
CREATE DATABASE quickcampaigns;
CREATE USER quickcampaigns_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE quickcampaigns TO quickcampaigns_user;
```

2. Configure database connection pooling with PgBouncer for scalability:

```bash
# Install PgBouncer
sudo apt-get install pgbouncer

# Configure PgBouncer
sudo nano /etc/pgbouncer/pgbouncer.ini

# Add your database configuration
[databases]
quickcampaigns = host=127.0.0.1 port=5432 dbname=quickcampaigns user=quickcampaigns_user password=your_secure_password

# Set pooling parameters
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 100
```

### AWS S3 Setup

1. Create an S3 bucket for storing campaign creatives and user files
2. Create an IAM user with programmatic access and attach the S3FullAccess policy
3. Note the access key and secret key for configuration

### Environment Variables

Set up the following environment variables for your Django backend:

```
# Django
DEBUG=False
SECRET_KEY=your-secure-secret-key
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# Database
DB_ENGINE=django.db.backends.postgresql
POSTGRES_DB=quickcampaigns
POSTGRES_USER=quickcampaigns_user
POSTGRES_PASSWORD=your_secure_password
DB_HOST=your-db-host
DB_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/0

# AWS
USE_S3=True
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=us-east-1

# Stripe
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### Deploying the Django Backend

You can deploy the Django backend using a service like Heroku, AWS Elastic Beanstalk, or DigitalOcean App Platform:

#### Heroku Deployment

1. Install the Heroku CLI and log in:
```bash
heroku login
```

2. Create a new Heroku app:
```bash
heroku create quickcampaigns-api
```

3. Add PostgreSQL and Redis add-ons:
```bash
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
```

4. Set the environment variables:
```bash
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secure-secret-key
# Set all other environment variables
```

5. Deploy the application:
```bash
git push heroku master
```

6. Run migrations:
```bash
heroku run python manage.py migrate
```

## Frontend Deployment on Vercel

### Prerequisites
- Vercel account
- Git repository with your project

### Steps to Deploy on Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Log in to Vercel and create a new project by importing your Git repository

3. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: client
   - Build Command: npm run build
   - Output Directory: .next

4. Set environment variables:
```
NEXT_PUBLIC_API_URL=https://your-django-backend-url.com
```

5. Deploy the project

### Updating the Vercel Configuration

The `vercel.json` file in the client directory already includes the necessary configuration for routing API requests to your Django backend. Make sure to update the API URL in the configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-django-backend-url.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-django-backend-url.com"
  }
}
```

## Database Schema and Security

The database schema is defined in the Django models and includes:

1. **User Management**:
   - Django's built-in User model for authentication
   - JWT-based authentication for secure API access

2. **Campaign Management**:
   - Campaign model for storing campaign details
   - CampaignCreative model for storing campaign creative files
   - FacebookAdAccount model for storing Facebook ad account connections

3. **Credit System**:
   - UserCredit model for tracking user credit balances
   - CreditTransaction model for recording credit purchases and usage

### Security Considerations

1. **Data Protection**:
   - All user data is stored securely in the PostgreSQL database
   - File uploads are stored in private AWS S3 buckets
   - JWT tokens are used for authentication with short expiration times

2. **Payment Security**:
   - Stripe is used for secure payment processing
   - No credit card information is stored in our database
   - Webhook signatures are verified for all Stripe events

3. **API Security**:
   - All API endpoints require authentication
   - Rate limiting is implemented to prevent abuse
   - CORS is configured to allow only the frontend domain

## Scaling Considerations

The application is designed to handle 1000+ concurrent users with:

1. **Database Optimization**:
   - Indexes on frequently queried fields
   - Connection pooling with PgBouncer
   - Read replicas for high-traffic deployments

2. **Caching**:
   - Redis for session storage and frequently accessed data
   - Cache timeouts configured based on data volatility

3. **Asynchronous Processing**:
   - Celery for campaign creation and background tasks
   - Task queues for handling Facebook API interactions

4. **File Storage**:
   - AWS S3 for all user-generated content
   - CloudFront CDN for fast content delivery

5. **Monitoring and Logging**:
   - Comprehensive logging for debugging
   - Performance monitoring for identifying bottlenecks
