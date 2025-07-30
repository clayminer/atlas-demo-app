"use client";

import { useState, useEffect } from "react";
import { useCustomerFeatures } from "@runonatlas/next/client";
import { DiceUsageTracker, DiceRoll } from "@/lib/dice-usage-tracker";
import { useMockAuth } from "@/lib/mock-auth";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

const DiceIcon = ({ value, isRolling }: { value: number; isRolling: boolean }) => {
  const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const Icon = icons[value - 1] || Dice1;
  
  return (
    <div
      style={{
        display: 'inline-block',
        animation: isRolling ? 'spin 0.5s ease-in-out' : 'none',
        margin: '0 8px'
      }}
    >
      <Icon 
        size={48} 
        style={{ 
          color: '#667eea',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }} 
      />
    </div>
  );
};

interface DiceRollsFeatureProps {
  onUpgradeClick?: () => void;
}

export function DiceRollsFeature({ onUpgradeClick }: DiceRollsFeatureProps) {
  const { user } = useMockAuth();
  const { features, isLoading: isLoadingFeatures } = useCustomerFeatures();
  
  // Debug Atlas response
  console.log('🔍 DiceRolls - features:', features);
  console.log('🔍 DiceRolls - isLoading:', isLoadingFeatures);
  
  const diceRollsFeature = features?.find(f => f.id === 'dice-rolls');
  
  const [diceCount, setDiceCount] = useState(2);
  const [currentRoll, setCurrentRoll] = useState<number[]>([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [recentRolls, setRecentRolls] = useState<DiceRoll[]>([]);
  const [usageCount, setUsageCount] = useState(0);
  
  console.log('🔍 DiceRolls - diceRollsFeature:', diceRollsFeature);
  console.log('🔍 DiceRolls - usageCount:', usageCount);
  
  // Check access based on Atlas feature data
  const isIncluded = diceRollsFeature?.included;
  const limit = diceRollsFeature?.limit;
  const hasUnlimitedRolls = limit === null || limit === undefined;
  const hasUsageRemaining = hasUnlimitedRolls || usageCount < limit;
  const hasAccess = isIncluded && hasUsageRemaining;
  
  console.log('🔍 DiceRolls - isIncluded:', isIncluded);
  console.log('🔍 DiceRolls - limit:', limit);
  console.log('🔍 DiceRolls - hasUnlimitedRolls:', hasUnlimitedRolls);
  console.log('🔍 DiceRolls - hasUsageRemaining:', hasUsageRemaining);
  console.log('🔍 DiceRolls - hasAccess:', hasAccess);

  const remainingRolls = hasUnlimitedRolls ? null : Math.max(0, (limit || 0) - usageCount);

  useEffect(() => {
    if (user) {
      const count = DiceUsageTracker.getRollCount(user.id);
      const recent = DiceUsageTracker.getRecentRolls(user.id, 5);
      setUsageCount(count);
      setRecentRolls(recent);
    }
  }, [user]);

  if (isLoadingFeatures) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>🎲</div>
        <div>Loading dice roll limits...</div>
      </div>
    );
  }

  const rollDice = async () => {
    if (!user || !hasAccess || isRolling) return;

    setIsRolling(true);
    
    // Animate the roll for 1 second
    const rollAnimation = setInterval(() => {
      setCurrentRoll(Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1));
    }, 100);

    setTimeout(() => {
      clearInterval(rollAnimation);
      
      // Final roll result
      const finalResult = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
      setCurrentRoll(finalResult);
      
      // Save the roll
      try {
        const newRoll = DiceUsageTracker.addRoll(user.id, finalResult);
        const updatedCount = DiceUsageTracker.getRollCount(user.id);
        const updatedRecent = DiceUsageTracker.getRecentRolls(user.id, 5);
        
        setUsageCount(updatedCount);
        setRecentRolls(updatedRecent);
      } catch (error) {
        console.error('Failed to save dice roll:', error);
      }
      
      setIsRolling(false);
    }, 1000);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDiceSum = (dice: number[]) => dice.reduce((sum, die) => sum + die, 0);

  if (!isIncluded) {
    return (
      <div style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎲</div>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#dc2626',
          marginBottom: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Dice Rolls Not Available
        </h3>
        <p style={{
          fontSize: '16px',
          color: '#7f1d1d',
          marginBottom: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Upgrade your plan to access dice rolling features.
        </p>
        <button
          onClick={onUpgradeClick}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            border: 'none',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
          }}
        >
          Upgrade Plan
        </button>
      </div>
    );
  }

  if (!hasUsageRemaining) {
    return (
      <div style={{
        backgroundColor: '#fefbf2',
        border: '1px solid #fcd34d',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎲</div>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#d97706',
          marginBottom: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Dice Roll Limit Reached
        </h3>
        <p style={{
          fontSize: '16px',
          color: '#92400e',
          marginBottom: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          You've used all {limit} of your dice rolls this month. Upgrade your plan for more!
        </p>
        <button
          onClick={onUpgradeClick}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            border: 'none',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
          }}
        >
          Upgrade Plan
        </button>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '8px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          🎲 Dice Rolls
        </h3>
        <div style={{
          fontSize: '16px',
          color: '#6b7280',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {hasUnlimitedRolls ? (
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>
              ∞ Unlimited rolls this month
            </span>
          ) : (
            <span>
              <strong>{usageCount}</strong> of <strong>{limit}</strong> rolls used this month
              {remainingRolls !== null && (
                <span style={{ 
                  color: remainingRolls > 0 ? '#10b981' : '#dc2626',
                  fontWeight: 'bold',
                  marginLeft: '8px'
                }}>
                  ({remainingRolls} remaining)
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Usage Progress Bar (only show if not unlimited) */}
      {!hasUnlimitedRolls && limit && (
        <div style={{
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          height: '8px',
          marginBottom: '32px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              backgroundColor: usageCount >= limit ? '#dc2626' : '#667eea',
              height: '100%',
              width: `${Math.min((usageCount / limit) * 100, 100)}%`,
              transition: 'width 0.3s ease',
              borderRadius: '8px'
            }}
          />
        </div>
      )}

      {/* Dice Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <label style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#374151',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Number of dice:
        </label>
        <select
          value={diceCount}
          onChange={(e) => {
            const newCount = parseInt(e.target.value);
            setDiceCount(newCount);
            setCurrentRoll(Array.from({ length: newCount }, () => 1));
          }}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '2px solid #e5e7eb',
            fontSize: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: 'white'
          }}
        >
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {/* Dice Display */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        {currentRoll.map((die, index) => (
          <DiceIcon key={index} value={die} isRolling={isRolling} />
        ))}
      </div>

      {/* Roll Sum */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Total: {getDiceSum(currentRoll)}
        </div>
      </div>

      {/* Roll Button */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <button
          onClick={rollDice}
          disabled={isRolling || (!hasUnlimitedRolls && remainingRolls === 0)}
          style={{
            background: (isRolling || (!hasUnlimitedRolls && remainingRolls === 0))
              ? '#e5e7eb'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            color: (isRolling || (!hasUnlimitedRolls && remainingRolls === 0))
              ? '#9ca3af'
              : 'white',
            padding: '16px 48px',
            borderRadius: '16px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: (isRolling || (!hasUnlimitedRolls && remainingRolls === 0))
              ? 'not-allowed'
              : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: (isRolling || (!hasUnlimitedRolls && remainingRolls === 0))
              ? 'none'
              : '0 8px 25px rgba(102, 126, 234, 0.3)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
          onMouseEnter={(e) => {
            if (!isRolling && (hasUnlimitedRolls || remainingRolls! > 0)) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isRolling && (hasUnlimitedRolls || remainingRolls! > 0)) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
            }
          }}
        >
          {isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
        </button>
      </div>

      {/* Recent Rolls History */}
      {recentRolls.length > 0 && (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h4 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Recent Rolls
          </h4>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {recentRolls.map((roll) => (
              <div
                key={roll.rollId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '14px',
                  color: '#6b7280',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                <span>
                  {roll.result.join(', ')} (Sum: {getDiceSum(roll.result)})
                </span>
                <span>{formatTimestamp(roll.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}