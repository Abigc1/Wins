import { FolderData } from "./types";

export const FOLDERS: FolderData[] = [
  {
    id: "2-00-odds-1",
    name: "2.00 ODDS 1",
    bookingCode: "VV-200-1-XYZ",
    matches: [
      { 
        id: "1", 
        time: "18:00", 
        matchName: "Arsenal vs Chelsea", 
        homeTeam: "Arsenal",
        awayTeam: "Chelsea",
        prediction: "Home Win", 
        odds: "1.55",
        lineups: {
          home: ["Raya", "White", "Saliba", "Gabriel", "Zinchenko", "Rice", "Odegaard", "Havertz", "Saka", "Jesus", "Martinelli"],
          away: ["Sanchez", "James", "Disasi", "Silva", "Colwill", "Caicedo", "Enzo", "Gallagher", "Palmer", "Jackson", "Sterling"]
        },
        recentForm: {
          home: ["W", "W", "D", "W", "L"],
          away: ["L", "D", "W", "L", "W"]
        },
        h2h: [
          { date: "21 Oct 2023", score: "2 - 2", result: "Draw" },
          { date: "02 May 2023", score: "3 - 1", result: "Arsenal Win" }
        ],
        stats: {
          home: { avgGoals: "2.4", defensiveRecord: "0.8", winRate: "75%" },
          away: { avgGoals: "1.6", defensiveRecord: "1.2", winRate: "45%" }
        }
      },
      { 
        id: "2", 
        time: "20:45", 
        matchName: "Real Madrid vs Barcelona", 
        homeTeam: "Real Madrid",
        awayTeam: "Barcelona",
        prediction: "Over 2.5", 
        odds: "1.45",
        lineups: {
          home: ["Lunin", "Carvajal", "Rudiger", "Nacho", "Mendy", "Valverde", "Kroos", "Camavinga", "Bellingham", "Rodrygo", "Vinicius"],
          away: ["Ter Stegen", "Kounde", "Araujo", "Cubarsi", "Cancelo", "Gundogan", "Christensen", "De Jong", "Yamal", "Lewandowski", "Raphinha"]
        },
        recentForm: {
          home: ["W", "W", "W", "D", "W"],
          away: ["W", "L", "W", "W", "W"]
        },
        h2h: [
          { date: "14 Jan 2024", score: "4 - 1", result: "Real Madrid Win" },
          { date: "28 Oct 2023", score: "1 - 2", result: "Real Madrid Win" }
        ],
        stats: {
          home: { avgGoals: "2.8", defensiveRecord: "0.9", winRate: "82%" },
          away: { avgGoals: "2.1", defensiveRecord: "1.1", winRate: "68%" }
        }
      },
    ],
    history: [
      { id: "h1", time: "Yesterday", matchName: "Man Utd vs Fulham", homeTeam: "Man Utd", awayTeam: "Fulham", prediction: "Home Win", odds: "1.50" },
      { id: "h2", time: "2 days ago", matchName: "Luton vs Everton", homeTeam: "Luton", awayTeam: "Everton", prediction: "Under 2.5", odds: "1.75" },
      { id: "h1-old", time: "10 days ago", matchName: "Liverpool vs Spurs", homeTeam: "Liverpool", awayTeam: "Spurs", prediction: "Home Win", odds: "1.60" },
    ]
  },
  {
    id: "2-00-odds-2",
    name: "2.00 ODDS 2",
    bookingCode: "VV-200-2-ABC",
    matches: [
      { id: "3", time: "15:00", matchName: "Man City vs Liverpool", homeTeam: "Man City", awayTeam: "Liverpool", prediction: "BTTS", odds: "1.60" },
      { id: "4", time: "17:30", matchName: "Bayern vs Dortmund", homeTeam: "Bayern", awayTeam: "Dortmund", prediction: "Home Win", odds: "1.40" },
    ],
    history: [
      { id: "h3", time: "Yesterday", matchName: "Milan vs Juventus", homeTeam: "Milan", awayTeam: "Juventus", prediction: "Draw", odds: "3.20" },
    ]
  },
  {
    id: "bet-of-day-1",
    name: "BET OF DAY 1",
    bookingCode: "VV-BOD-1-GOLD",
    matches: [
      { id: "5", time: "21:00", matchName: "PSG vs Marseille", homeTeam: "PSG", awayTeam: "Marseille", prediction: "Home Win", odds: "1.35" },
    ],
    history: [
      { id: "h4", time: "Yesterday", matchName: "Porto vs Benfica", homeTeam: "Porto", awayTeam: "Benfica", prediction: "Over 2.5", odds: "1.80" },
    ]
  },
  {
    id: "bet-of-day-2",
    name: "BET OF DAY 2",
    bookingCode: "VV-BOD-2-SILVER",
    matches: [
      { id: "6", time: "19:00", matchName: "Inter vs Milan", homeTeam: "Inter", awayTeam: "Milan", prediction: "Draw or Away", odds: "1.50" },
    ],
    history: [
      { id: "h5", time: "Yesterday", matchName: "Roma vs Lazio", homeTeam: "Roma", awayTeam: "Lazio", prediction: "Under 2.5", odds: "1.65" },
    ]
  },
  {
    id: "breakfast-1",
    name: "BREAKFAST TICKET 1",
    bookingCode: "VV-BF-1-SUN",
    matches: [
      { id: "7", time: "10:00", matchName: "Tokyo FC vs Yokohama", homeTeam: "Tokyo FC", awayTeam: "Yokohama", prediction: "Over 1.5", odds: "1.30" },
    ],
    history: [
      { id: "h6", time: "Yesterday", matchName: "Nagoya vs Kobe", homeTeam: "Nagoya", awayTeam: "Kobe", prediction: "BTTS", odds: "1.90" },
    ]
  },
  {
    id: "breakfast-2",
    name: "BREAKFAST TICKET 2",
    bookingCode: "VV-BF-2-MOON",
    matches: [
      { id: "8", time: "11:30", matchName: "Sydney FC vs Perth Glory", homeTeam: "Sydney FC", awayTeam: "Perth Glory", prediction: "Home Win", odds: "1.85" },
    ],
    history: [
      { id: "h7", time: "Yesterday", matchName: "Melbourne vs Adelaide", homeTeam: "Melbourne", awayTeam: "Adelaide", prediction: "Over 2.5", odds: "1.60" },
    ]
  },
  {
    id: "rollover-1-53-1",
    name: "FREE 1.53 ODDS 1",
    bookingCode: "VV-ROLL-153-1",
    matches: [
      { id: "9", time: "16:00", matchName: "Ajax vs PSV", homeTeam: "Ajax", awayTeam: "PSV", prediction: "Over 2.5", odds: "1.53" },
    ],
    history: [
      { id: "h8", time: "Yesterday", matchName: "Feyenoord vs AZ", homeTeam: "Feyenoord", awayTeam: "AZ", prediction: "Home Win", odds: "1.53" },
    ]
  },
  {
    id: "rollover-1-53-2",
    name: "FREE 1.53 ODDS 2",
    bookingCode: "VV-ROLL-153-2",
    matches: [
      { id: "10", time: "14:00", matchName: "Benfica vs Porto", homeTeam: "Benfica", awayTeam: "Porto", prediction: "Home Win", odds: "1.53" },
    ],
    history: [
      { id: "h9", time: "Yesterday", matchName: "Braga vs Sporting", homeTeam: "Braga", awayTeam: "Sporting", prediction: "Over 2.5", odds: "1.53" },
    ]
  },
  {
    id: "rollover-1-30-1",
    name: "FREE 1.30 ODDS 1",
    bookingCode: "VV-ROLL-130-1",
    matches: [
      { id: "11", time: "20:00", matchName: "Napoli vs Roma", homeTeam: "Napoli", awayTeam: "Roma", prediction: "Over 1.5", odds: "1.30" },
    ],
    history: [
      { id: "h10", time: "Yesterday", matchName: "Lazio vs Verona", homeTeam: "Lazio", awayTeam: "Verona", prediction: "Home Win", odds: "1.30" },
    ]
  },
  {
    id: "rollover-1-30-2",
    name: "FREE 1.30 ODDS 2",
    bookingCode: "VV-ROLL-130-2",
    matches: [
      { id: "12", time: "22:00", matchName: "Sporting vs Braga", homeTeam: "Sporting", awayTeam: "Braga", prediction: "Home Win", odds: "1.30" },
    ],
    history: [
      { id: "h11", time: "Yesterday", matchName: "Porto vs Estoril", homeTeam: "Porto", awayTeam: "Estoril", prediction: "Home Win", odds: "1.30" },
    ]
  },
  {
    id: "investment-1",
    name: "INVESTMENT TICKET 1",
    bookingCode: "VV-INV-1-SECURE",
    matches: [
      { id: "13", time: "19:30", matchName: "Juventus vs Lazio", homeTeam: "Juventus", awayTeam: "Lazio", prediction: "Under 3.5", odds: "1.25" },
      { id: "14", time: "21:00", matchName: "Atletico vs Sevilla", homeTeam: "Atletico", awayTeam: "Sevilla", prediction: "Home Win", odds: "1.65" },
    ],
    history: [
      { id: "h12", time: "Yesterday", matchName: "Real Madrid vs Girona", homeTeam: "Real Madrid", awayTeam: "Girona", prediction: "Home Win", odds: "1.40" },
    ]
  },
  {
    id: "investment-2",
    name: "INVESTMENT TICKET 2",
    bookingCode: "VV-INV-2-PROFIT",
    matches: [
      { id: "15", time: "18:30", matchName: "Leverkusen vs Leipzig", homeTeam: "Leverkusen", awayTeam: "Leipzig", prediction: "BTTS", odds: "1.55" },
      { id: "16", time: "20:00", matchName: "Monaco vs Lyon", homeTeam: "Monaco", awayTeam: "Lyon", prediction: "Over 2.5", odds: "1.70" },
    ],
    history: [
      { id: "h13", time: "Yesterday", matchName: "Nice vs Lille", homeTeam: "Nice", awayTeam: "Lille", prediction: "Under 2.5", odds: "1.60" },
    ]
  }
];
