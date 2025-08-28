import { User } from "next-auth";

export interface UserStats {
  toysCount: number;
  exchangesCount: number;
  avgRating: number;
  memberSince: string;
}

export interface Activity {
  type: 'post' | 'exchange' | 'message';
  action: string;
  toy: string;
  time: Date | string;
}

export interface UserProfile extends User {
  stats?: UserStats;
}