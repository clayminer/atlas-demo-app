"use client";

export interface DiceRoll {
  timestamp: number;
  result: number[];
  rollId: string;
}

export interface UserDiceData {
  userId: string;
  rolls: DiceRoll[];
}

const STORAGE_KEY = 'atlas-dice-rolls';

export class DiceUsageTracker {
  private static getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}`;
  }

  private static getStorageKey(userId: string): string {
    return `${STORAGE_KEY}-${userId}-${this.getCurrentMonth()}`;
  }

  static getUserRolls(userId: string): DiceRoll[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.getStorageKey(userId));
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getRollCount(userId: string): number {
    return this.getUserRolls(userId).length;
  }

  static addRoll(userId: string, result: number[]): DiceRoll {
    if (typeof window === 'undefined') {
      throw new Error('Cannot add roll on server side');
    }

    const roll: DiceRoll = {
      timestamp: Date.now(),
      result,
      rollId: `roll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    const existingRolls = this.getUserRolls(userId);
    const updatedRolls = [...existingRolls, roll];

    try {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(updatedRolls));
    } catch (error) {
      console.error('Failed to save dice roll:', error);
      throw new Error('Failed to save dice roll');
    }

    return roll;
  }

  static getRecentRolls(userId: string, limit: number = 5): DiceRoll[] {
    return this.getUserRolls(userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  static clearUserRolls(userId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.getStorageKey(userId));
    } catch (error) {
      console.error('Failed to clear dice rolls:', error);
    }
  }

  // Helper function for development/testing
  static debugUserData(userId: string): void {
    console.log('Current month key:', this.getCurrentMonth());
    console.log('Storage key:', this.getStorageKey(userId));
    console.log('Roll count:', this.getRollCount(userId));
    console.log('Recent rolls:', this.getRecentRolls(userId, 3));
  }
}