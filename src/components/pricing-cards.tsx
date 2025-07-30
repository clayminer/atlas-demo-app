"use client";

import { Check, Crown, Zap, Star, Rocket } from "lucide-react";

const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "$9",
    period: "/month",
    description: "Perfect for individuals getting started",
    features: [
      "Access to Basic Feature",
      "Standard support",
      "Basic analytics",
      "Up to 5 projects"
    ],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    iconBg: '#f0f4ff',
    iconColor: '#667eea',
    shadowColor: 'rgba(102, 126, 234, 0.3)',
    icon: Zap,
    buttonText: "Get Basic",
    popular: false
  },
  {
    id: "premium", 
    name: "Premium",
    price: "$29",
    period: "/month",
    description: "Ideal for growing teams and businesses",
    features: [
      "Access to Basic Feature",
      "Access to Premium Feature", 
      "Priority support",
      "Advanced analytics",
      "Up to 25 projects",
      "Team collaboration"
    ],
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    iconBg: '#fdf2f8',
    iconColor: '#f093fb',
    shadowColor: 'rgba(240, 147, 251, 0.3)',
    icon: Star,
    buttonText: "Get Premium",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large organizations with advanced needs",
    features: [
      "Access to all features",
      "24/7 dedicated support",
      "Custom analytics dashboard",
      "Unlimited projects",
      "Advanced team management",
      "Custom integrations",
      "SLA guarantee"
    ],
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    iconBg: '#f0f9ff',
    iconColor: '#4facfe',
    shadowColor: 'rgba(79, 172, 254, 0.3)',
    icon: Rocket,
    buttonText: "Get Enterprise",
    popular: false
  }
];

interface PricingCardsProps {
  onSubscribe?: (planId: string) => void;
}

export function PricingCards({ onSubscribe }: PricingCardsProps) {
  const handleSubscribe = (planId: string) => {
    if (onSubscribe) {
      onSubscribe(planId);
    } else {
      alert(`Subscribing to ${planId} plan! In a real app, this would redirect to Atlas checkout.`);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '24px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      padding: '48px'
    }}>
      {/* Header Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '48px'
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Choose Your Plan
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Select the perfect plan for your needs. Upgrade or downgrade at any time.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {pricingPlans.map((plan) => {
          const IconComponent = plan.icon;
          
          return (
            <div key={plan.id} style={{
              position: 'relative',
              backgroundColor: '#f9fafb',
              borderRadius: '20px',
              border: plan.popular ? '2px solid #f093fb' : '1px solid #e5e7eb',
              padding: '32px',
              textAlign: 'center',
              transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}>
              {/* Popular Badge */}
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#f093fb',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Crown size={14} />
                  MOST POPULAR
                </div>
              )}

              {/* Icon Section */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: plan.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
              }}>
                <IconComponent 
                  size={32}
                  style={{ color: plan.iconColor }}
                />
              </div>

              {/* Plan Name */}
              <h3 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '8px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                {plan.name}
              </h3>

              {/* Price */}
              <div style={{
                marginBottom: '16px'
              }}>
                <span style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {plan.price}
                </span>
                <span style={{
                  fontSize: '18px',
                  color: '#6b7280',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                marginBottom: '32px',
                lineHeight: '1.5',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                {plan.description}
              </p>

              {/* Features List */}
              <div style={{
                textAlign: 'left',
                marginBottom: '32px'
              }}>
                {plan.features.map((feature, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: plan.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={12} color="white" />
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subscribe Button */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  borderRadius: '16px',
                  border: 'none',
                  background: plan.gradient,
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 8px 25px ${plan.shadowColor}`,
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 15px 35px ${plan.shadowColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${plan.shadowColor}`;
                }}
              >
                {plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div style={{
        textAlign: 'center',
        marginTop: '48px',
        padding: '24px',
        backgroundColor: '#f9fafb',
        borderRadius: '16px',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          margin: 0
        }}>
          All plans include a 14-day free trial. No credit card required. Cancel anytime.
        </p>
      </div>
    </div>
  );
}