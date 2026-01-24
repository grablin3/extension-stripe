# Stripe Payments Extension

This extension adds Stripe payment integration with support for subscriptions, one-time payments, and webhook handling.

## Prerequisites

1. **Stripe Account**: Create a Stripe account at https://stripe.com
2. **API Keys**: Get your API keys from the Stripe Dashboard

## Setup Instructions

### 1. Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > API Keys**
3. Copy your keys:
   - **Publishable Key** (pk_test_... or pk_live_...)
   - **Secret Key** (sk_test_... or sk_live_...)

### 2. Configure Webhooks

1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
5. Click **Add endpoint**
6. Copy the **Signing secret** (whsec_...)

### 3. Create Products and Prices

1. Go to **Products** in Stripe Dashboard
2. Create your subscription plans:
   - Free tier (if applicable)
   - Pro tier
   - Enterprise tier
3. Note down the **Price IDs** (price_...) for each plan

### 4. Configure Environment Variables

Set these environment variables in your deployment:

```bash
# Backend (ops layer)
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Local Development

### Testing with Stripe CLI

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhooks to localhost:
   ```bash
   stripe listen --forward-to localhost:8080/api/stripe/webhook
   ```
4. The CLI will display a webhook signing secret - use this for local testing

### Test Card Numbers

Use these test card numbers in development:

| Number | Description |
|--------|-------------|
| 4242424242424242 | Succeeds |
| 4000000000000002 | Declined |
| 4000002500003155 | Requires 3D Secure |

## Architecture

### Spring Boot

- `StripeConfig` - Stripe SDK configuration
- `StripeWebhookController` - Handles incoming webhooks with signature verification
- `SubscriptionController` - REST endpoints for checkout and portal sessions
- `SubscriptionEntity` - JPA entity for subscription data
- `StripeService` - Core Stripe SDK operations

### React

- `CheckoutButton` - Initiates Stripe Checkout
- `PricingTable` - Displays pricing plans
- `CustomerPortalButton` - Opens Stripe Customer Portal
- `useStripe` - Hook for Stripe operations

### Django

- `Subscription` model - Subscription data
- `StripeWebhookView` - Webhook handling
- `SubscriptionView` - REST endpoints

## Security

1. **Webhook Signature Verification**: All webhooks are verified using the signing secret
2. **Idempotency**: Payment events are tracked to prevent duplicate processing
3. **PCI Compliance**: Raw card numbers are never handled - Stripe Elements/Checkout handles all card data

## Troubleshooting

### Webhook Signature Invalid

- Ensure `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint
- For local testing, use the CLI-provided secret
- Check that the raw request body is passed to verification (not parsed JSON)

### Checkout Session Not Creating

- Verify `STRIPE_API_KEY` is set correctly
- Check that the price ID exists in your Stripe account
- Ensure success/cancel URLs are valid

### Customer Portal Not Working

- Enable Customer Portal in Stripe Dashboard settings
- Configure allowed actions in portal settings

## Resources

- [Stripe Documentation](https://docs.stripe.com)
- [Stripe Java SDK](https://github.com/stripe/stripe-java)
- [Stripe React](https://docs.stripe.com/stripe-js/react)
- [Webhook Best Practices](https://docs.stripe.com/webhooks/best-practices)
