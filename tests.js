/**
 * Genesis3 Module Test Configuration - Stripe Payments Extension
 *
 * Tests the complete Stripe payment integration including:
 * - Spring Boot subscription management and webhooks
 * - React checkout components and hooks
 * - Django REST Framework webhook handling
 * - Database migrations
 * - Security (webhook signature verification)
 */

module.exports = {
  moduleId: 'extension-stripe',
  moduleName: 'Stripe Payments',

  scenarios: [
    {
      name: 'stripe-spring-subscriptions',
      description: 'Spring Boot with subscription support and webhooks',
      dependencies: ['extension-rdbms'],
      config: {
        moduleId: 'stripe-spring',
        kind: 'extension',
        type: 'stripe',
        providers: ['spring'],
        enabled: true,
        fieldValues: {
          enableSubscriptions: true,
          enableCustomerPortal: true,
          webhookEndpoint: '/api/stripe/webhook'
        }
      },
      expectedFiles: [
        // Configuration
        'backend/src/main/java/com/example/config/StripeConfig.java',
        'backend/src/main/resources/application-stripe.yaml',
        // Controllers
        'backend/src/main/java/com/example/controller/StripeWebhookController.java',
        'backend/src/main/java/com/example/controller/SubscriptionController.java',
        // JPA Entities
        'backend/src/main/java/com/example/jpa/entity/SubscriptionEntity.java',
        'backend/src/main/java/com/example/jpa/entity/PlanConfigEntity.java',
        'backend/src/main/java/com/example/jpa/entity/PaymentEventEntity.java',
        // Repositories
        'backend/src/main/java/com/example/jpa/repository/SubscriptionRepository.java',
        'backend/src/main/java/com/example/jpa/repository/PlanConfigRepository.java',
        'backend/src/main/java/com/example/jpa/repository/PaymentEventRepository.java',
        // Enums
        'backend/src/main/java/com/example/jpa/enumtype/SubscriptionStatus.java',
        // Services
        'backend/src/main/java/com/example/service/StripeService.java',
        'backend/src/main/java/com/example/service/SubscriptionService.java',
        // Request/Response Models
        'backend/src/main/java/com/example/model/req/CreateCheckoutRequest.java',
        'backend/src/main/java/com/example/model/req/CreatePortalSessionRequest.java',
        'backend/src/main/java/com/example/model/rsp/CheckoutSessionResponse.java',
        'backend/src/main/java/com/example/model/rsp/SubscriptionResponse.java',
        'backend/src/main/java/com/example/model/rsp/PortalSessionResponse.java',
        'backend/src/main/java/com/example/model/rsp/PlanResponse.java',
        // Database Migrations
        'backend/src/main/resources/db/changelog/changes/020-create-stripe-tables.yaml'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/controller/StripeWebhookController.java',
          contains: [
            'Webhook.constructEvent',
            'SignatureVerificationException',
            '@Profile("stripe")',
            'Stripe-Signature',
            'idempotency'
          ]
        },
        {
          file: 'backend/src/main/java/com/example/jpa/entity/SubscriptionEntity.java',
          contains: [
            '@Entity',
            '@Table(name = "subscriptions")',
            'stripeSubscriptionId',
            'stripeCustomerId',
            'SubscriptionStatus',
            'extends BaseEntity'
          ]
        },
        {
          file: 'backend/src/main/java/com/example/service/StripeService.java',
          contains: [
            '@Service',
            '@Profile("stripe")',
            'createSubscriptionCheckoutSession',
            'Session.create'
          ]
        },
        {
          file: 'backend/src/main/java/com/example/config/StripeConfig.java',
          contains: [
            '@Configuration',
            '@Profile("stripe")',
            'Stripe.apiKey'
          ]
        },
        {
          file: 'backend/src/main/resources/application-stripe.yaml',
          contains: [
            'stripe:',
            'api-key:',
            'webhook:',
            'secret:'
          ]
        }
      ]
    },
    {
      name: 'stripe-spring-one-time-payments',
      description: 'Spring Boot with one-time payments enabled',
      dependencies: ['extension-rdbms'],
      config: {
        moduleId: 'stripe-spring-payments',
        kind: 'extension',
        type: 'stripe',
        providers: ['spring'],
        enabled: true,
        fieldValues: {
          enableSubscriptions: false,
          enableOneTimePayments: true,
          enableCustomerPortal: false
        }
      },
      expectedFiles: [
        'backend/src/main/java/com/example/service/StripeService.java',
        'backend/src/main/java/com/example/controller/SubscriptionController.java'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/service/StripeService.java',
          contains: [
            'createPaymentCheckoutSession',
            'Mode.PAYMENT'
          ]
        }
      ]
    },
    {
      name: 'stripe-react-checkout',
      description: 'React frontend with Stripe checkout components',
      dependencies: [],
      config: {
        moduleId: 'stripe-react',
        kind: 'extension',
        type: 'stripe',
        providers: ['react'],
        enabled: true,
        fieldValues: {
          enableSubscriptions: true
        }
      },
      expectedFiles: [
        'frontend/src/components/stripe/CheckoutButton.tsx',
        'frontend/src/components/stripe/PricingTable.tsx',
        'frontend/src/components/stripe/CustomerPortalButton.tsx',
        'frontend/src/components/stripe/index.ts',
        'frontend/src/hooks/useStripe.ts',
        'frontend/src/pages/PricingPage.tsx',
        'frontend/.env'
      ],
      fileContentChecks: [
        {
          file: 'frontend/src/hooks/useStripe.ts',
          contains: [
            'loadStripe',
            'VITE_STRIPE_PUBLISHABLE_KEY',
            'createCheckoutSession',
            'createPortalSession'
          ]
        },
        {
          file: 'frontend/src/components/stripe/CheckoutButton.tsx',
          contains: [
            'useStripe',
            'priceId',
            'handleClick'
          ]
        },
        {
          file: 'frontend/src/components/stripe/PricingTable.tsx',
          contains: [
            'getPlans',
            'CheckoutButton',
            'formatPrice'
          ]
        },
        {
          file: 'frontend/.env',
          contains: [
            'VITE_STRIPE_PUBLISHABLE_KEY'
          ]
        }
      ]
    },
    {
      name: 'stripe-drf-webhooks',
      description: 'Django REST Framework with webhook handling',
      dependencies: ['extension-rdbms'],
      config: {
        moduleId: 'stripe-drf',
        kind: 'extension',
        type: 'stripe',
        providers: ['drf'],
        enabled: true,
        fieldValues: {
          enableSubscriptions: true,
          enableCustomerPortal: true
        }
      },
      expectedFiles: [
        'backend/app_stripe/__init__.py',
        'backend/app_stripe/apps.py',
        'backend/app_stripe/models.py',
        'backend/app_stripe/views.py',
        'backend/app_stripe/serializers.py',
        'backend/app_stripe/urls.py',
        'backend/app_stripe/migrations/__init__.py',
        'backend/app_stripe/migrations/0001_initial.py'
      ],
      fileContentChecks: [
        {
          file: 'backend/app_stripe/views.py',
          contains: [
            'stripe.Webhook.construct_event',
            'HTTP_STRIPE_SIGNATURE',
            'csrf_exempt',
            'SignatureVerificationException',
            'PaymentEvent.objects.filter'
          ]
        },
        {
          file: 'backend/app_stripe/models.py',
          contains: [
            'class Subscription(models.Model)',
            'stripe_subscription_id',
            'stripe_customer_id',
            'SubscriptionStatus',
            'class PaymentEvent(models.Model)',
            'stripe_event_id'
          ]
        },
        {
          file: 'backend/app_stripe/serializers.py',
          contains: [
            'SubscriptionSerializer',
            'PlanConfigSerializer',
            'CreateCheckoutSessionSerializer'
          ]
        },
        {
          file: 'backend/app_stripe/urls.py',
          contains: [
            'webhook',
            'create-checkout-session',
            'create-portal-session',
            'subscription'
          ]
        }
      ]
    },
    {
      name: 'stripe-full-stack',
      description: 'Full stack Stripe integration with all features',
      dependencies: ['extension-rdbms'],
      config: {
        moduleId: 'stripe-full',
        kind: 'extension',
        type: 'stripe',
        providers: ['spring', 'react'],
        enabled: true,
        fieldValues: {
          enableSubscriptions: true,
          enableOneTimePayments: true,
          enableCustomerPortal: true,
          webhookEndpoint: '/api/stripe/webhook'
        }
      },
      expectedFiles: [
        // Backend
        'backend/src/main/java/com/example/controller/StripeWebhookController.java',
        'backend/src/main/java/com/example/controller/SubscriptionController.java',
        'backend/src/main/java/com/example/service/StripeService.java',
        // Frontend
        'frontend/src/components/stripe/CheckoutButton.tsx',
        'frontend/src/components/stripe/PricingTable.tsx',
        'frontend/src/components/stripe/CustomerPortalButton.tsx',
        'frontend/src/hooks/useStripe.ts'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/service/StripeService.java',
          contains: [
            'createSubscriptionCheckoutSession',
            'createPaymentCheckoutSession',
            'createPortalSession'
          ]
        }
      ]
    }
  ],

  templateValidations: [
    {
      name: 'webhook-signature-verification-spring',
      template: 'extension-stripe/code-spring/src/main/java/{{packagePath}}/controller/StripeWebhookController.java.mustache',
      contains: ['Webhook.constructEvent', 'SignatureVerificationException'],
      reason: 'Security: Must verify webhook signatures to prevent spoofing'
    },
    {
      name: 'webhook-signature-verification-drf',
      template: 'extension-stripe/code-drf/app_stripe/views.py.mustache',
      contains: ['stripe.Webhook.construct_event', 'SignatureVerificationException'],
      reason: 'Security: Must verify webhook signatures to prevent spoofing'
    },
    {
      name: 'idempotency-handling-spring',
      template: 'extension-stripe/code-spring/src/main/java/{{packagePath}}/controller/StripeWebhookController.java.mustache',
      contains: ['existsByStripeEventId', 'PaymentEventEntity'],
      reason: 'Reliability: Must handle duplicate webhook deliveries'
    },
    {
      name: 'idempotency-handling-drf',
      template: 'extension-stripe/code-drf/app_stripe/views.py.mustache',
      contains: ['PaymentEvent.objects.filter', 'stripe_event_id'],
      reason: 'Reliability: Must handle duplicate webhook deliveries'
    },
    {
      name: 'stripe-profile-annotation-spring',
      template: 'extension-stripe/code-spring/src/main/java/{{packagePath}}/config/StripeConfig.java.mustache',
      contains: ['@Profile("stripe")'],
      reason: 'Configuration: Stripe beans should only load when profile is active'
    },
    {
      name: 'frontend-uses-publishable-key',
      template: 'extension-stripe/code-react/src/hooks/useStripe.ts.mustache',
      contains: ['VITE_STRIPE_PUBLISHABLE_KEY'],
      notContains: ['STRIPE_API_KEY', 'sk_'],
      reason: 'Security: Frontend must never access secret API key'
    }
  ]
};
