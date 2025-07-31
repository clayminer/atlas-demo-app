"use client";

import { useCustomerFeatures } from "@runonatlas/next/client";
import { Lock, Zap, Star, Rocket } from "lucide-react";

const features = [
  {
    id: "feature-1",
    name: "Basic Feature", 
    description: "Essential functionality for all users",
    buttonText: "Basic Action",
    icon: Zap,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    iconBg: '#f0f4ff',
    iconColor: '#667eea',
    shadowColor: 'rgba(102, 126, 234, 0.3)'
  },
  {
    id: "feature-2",
    name: "Premium Feature",
    description: "Advanced tools for premium users", 
    buttonText: "Premium Action",
    icon: Star,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    iconBg: '#fdf2f8',
    iconColor: '#f093fb',
    shadowColor: 'rgba(240, 147, 251, 0.3)'
  },
  {
    id: "feature-3",
    name: "Enterprise Feature",
    description: "Powerful features for enterprise clients",
    buttonText: "Enterprise Action", 
    icon: Rocket,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    iconBg: '#f0f9ff',
    iconColor: '#4facfe',
    shadowColor: 'rgba(79, 172, 254, 0.3)'
  }
];

interface AtlasButtonsProps {
  onUpgradeClick?: () => void;
}

export function AtlasButtons({ onUpgradeClick }: AtlasButtonsProps) {
  const { features: customerFeatures, isLoading } = useCustomerFeatures();
  
  console.log('🔍 This user has access to: ', customerFeatures);


  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <div>Loading Atlas features...</div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      {features.map((feature) => {
        const IconComponent = feature.icon;
        const atlasFeature = customerFeatures?.find(cf => cf.id === feature.id);
        const hasAccess = atlasFeature?.included && atlasFeature?.allowed;
        
        console.log(`🔍 Feature ${feature.id} - atlasFeature:`, atlasFeature, 'hasAccess:', hasAccess);
        
        return (
          <div key={feature.id} style={{
            textAlign: 'center',
            padding: '32px',
            backgroundColor: '#f9fafb',
            borderRadius: '20px',
            border: '1px solid #e5e7eb'
          }}>
            {/* Icon Section */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: feature.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
            }}>
              <IconComponent 
                size={32}
                style={{ color: feature.iconColor }}
              />
            </div>

            {/* Content Section */}
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '12px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {feature.name}
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '32px',
              lineHeight: '1.5',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {feature.description}
            </p>

            {/* Button Section */}
            {hasAccess ? (
              <button
                onClick={() => alert(`${feature.name} activated!`)}
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  borderRadius: '16px',
                  border: 'none',
                  background: feature.gradient,
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 8px 25px ${feature.shadowColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 15px 35px ${feature.shadowColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${feature.shadowColor}`;
                }}
              >
                <IconComponent size={20} />
                {feature.buttonText}
              </button>
            ) : (
              <button
                onClick={onUpgradeClick}
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  borderRadius: '16px',
                  border: '2px solid #f59e0b',
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fde68a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Lock size={20} />
                Upgrade
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}