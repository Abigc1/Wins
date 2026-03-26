/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MatchDetail {
  id: string;
  time: string;
  matchName: string;
  homeTeam?: string;
  awayTeam?: string;
  prediction: string;
  odds: string;
  lineups?: {
    home: string[];
    away: string[];
  };
  recentForm?: {
    home: string[]; // e.g., ['W', 'D', 'W', 'L', 'W']
    away: string[];
  };
  h2h?: {
    date: string;
    score: string;
    result: string;
  }[];
  stats?: {
    home: {
      avgGoals: string;
      defensiveRecord: string;
      winRate: string;
    };
    away: {
      avgGoals: string;
      defensiveRecord: string;
      winRate: string;
    };
  };
}

export interface FolderData {
  id: string;
  name: string;
  matches: MatchDetail[];
  history: MatchDetail[];
  bookingCode: string;
}
