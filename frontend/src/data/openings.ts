import { Chess } from 'chess.js'

export interface OpeningVariation {
  name: string
  moves: string[]
  fen: string
}

export interface Opening {
  id: string
  name: string
  fen: string
  eco?: string
  variations: OpeningVariation[]
}

function computeFens(moves: string[], boardOnly = true): string {
  const game = new Chess()
  for (const m of moves) game.move(m)
  const fen = game.fen()
  return boardOnly ? fen.split(' ')[0] : fen
}

interface RawOpening {
  id: string
  name: string
  eco?: string
  variations: { name: string; moves: string[] }[]
}

const RAW_OPENINGS: RawOpening[] = [
  // --- Open Games (1.e4 e5) ---
  {
    id: 'italian-game',
    name: 'Italian Game',
    eco: 'C50',
    variations: [
      { name: 'Italian Game', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'] },
      { name: 'Italian Game: Two Knights Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'] },
    ],
  },
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez',
    eco: 'C60',
    variations: [
      { name: 'Ruy Lopez: Closed Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7'] },
      { name: 'Ruy Lopez: Morphy Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6'] },
      { name: 'Ruy Lopez: Exchange Variation', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Bxc6', 'dxc6'] },
      { name: 'Ruy Lopez: Open Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Nxe4'] },
      { name: 'Ruy Lopez: Berlin Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6'] },
    ],
  },
  {
    id: 'scotch-game',
    name: 'Scotch Game',
    eco: 'C45',
    variations: [
      { name: 'Scotch Game', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4'] },
    ],
  },
  {
    id: 'four-knights',
    name: 'Four Knights Game',
    eco: 'C47',
    variations: [
      { name: 'Four Knights Game', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6'] },
      { name: 'Four Knights: Spanish Variation', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6', 'Bb5'] },
    ],
  },
  {
    id: 'kings-gambit',
    name: "King's Gambit",
    eco: 'C30',
    variations: [
      { name: "King's Gambit Accepted", moves: ['e4', 'e5', 'f4', 'exf4'] },
      { name: "King's Gambit Declined", moves: ['e4', 'e5', 'f4', 'Bc5'] },
      { name: "King's Gambit: Falkbeer Countergambit", moves: ['e4', 'e5', 'f4', 'd5'] },
    ],
  },
  {
    id: 'philidor',
    name: 'Philidor Defense',
    eco: 'C41',
    variations: [
      { name: 'Philidor Defense', moves: ['e4', 'e5', 'Nf3', 'd6'] },
    ],
  },
  {
    id: 'petrov',
    name: 'Petrov Defense',
    eco: 'C42',
    variations: [
      { name: 'Petrov Defense', moves: ['e4', 'e5', 'Nf3', 'Nf6'] },
      { name: 'Petrov: Classical Attack', moves: ['e4', 'e5', 'Nf3', 'Nf6', 'Nxe5', 'd6', 'Nf3', 'Nxe4'] },
    ],
  },
  {
    id: 'vienna-game',
    name: 'Vienna Game',
    eco: 'C25',
    variations: [
      { name: 'Vienna Game', moves: ['e4', 'e5', 'Nc3'] },
    ],
  },
  {
    id: 'bishop-opening',
    name: "Bishop's Opening",
    eco: 'C24',
    variations: [
      { name: "Bishop's Opening", moves: ['e4', 'e5', 'Bc4'] },
    ],
  },
  {
    id: 'center-game',
    name: 'Center Game',
    eco: 'C22',
    variations: [
      { name: 'Center Game', moves: ['e4', 'e5', 'd4', 'exd4', 'Qxd4'] },
    ],
  },
  {
    id: 'ponziani',
    name: 'Ponziani Opening',
    eco: 'C44',
    variations: [
      { name: 'Ponziani Opening', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'c3'] },
    ],
  },
  {
    id: 'evans-gambit',
    name: "Evans Gambit",
    eco: 'C51',
    variations: [
      { name: "Evans Gambit Accepted", moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4', 'Bxb4'] },
      { name: "Evans Gambit Declined", moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4', 'Bb6'] },
    ],
  },
  {
    id: 'hungarian-defense',
    name: 'Hungarian Defense',
    eco: 'C50',
    variations: [
      { name: 'Hungarian Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Be7'] },
    ],
  },
  {
    id: 'greek-gift',
    name: 'Greco Gambit',
    eco: 'C54',
    variations: [
      { name: 'Greco Gambit', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'O-O', 'Nf6', 'd4'] },
    ],
  },

  // --- Sicilian Defense ---
  {
    id: 'sicilian-defense',
    name: 'Sicilian Defense',
    eco: 'B20',
    variations: [
      { name: 'Sicilian Defense', moves: ['e4', 'c5'] },
    ],
  },
  {
    id: 'sicilian-open',
    name: 'Sicilian Defense: Open Sicilian',
    eco: 'B30',
    variations: [
      { name: 'Open Sicilian', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4'] },
      { name: 'Open Sicilian: Najdorf Variation', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'] },
      { name: 'Open Sicilian: Dragon Variation', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'] },
      { name: 'Open Sicilian: Classical Variation', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'Nc6'] },
      { name: 'Open Sicilian: Scheveningen Variation', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'e6'] },
      { name: 'Open Sicilian: Kan Variation', moves: ['e4', 'c5', 'Nf3', 'e6', 'd4', 'cxd4', 'Nxd4', 'a6'] },
      { name: 'Open Sicilian: Taimanov Variation', moves: ['e4', 'c5', 'Nf3', 'e6', 'd4', 'cxd4', 'Nxd4', 'Nc6'] },
      { name: 'Open Sicilian: Richter-Rauzer', moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'd6', 'Bg5'] },
      { name: 'Open Sicilian: Sozin Attack', moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'd6', 'Bc4'] },
    ],
  },
  {
    id: 'sicilian-alapin',
    name: 'Sicilian Defense: Alapin Variation',
    eco: 'B22',
    variations: [
      { name: 'Alapin Variation', moves: ['e4', 'c5', 'c3'] },
    ],
  },
  {
    id: 'sicilian-grand-prix',
    name: 'Sicilian Defense: Grand Prix Attack',
    eco: 'B23',
    variations: [
      { name: 'Grand Prix Attack', moves: ['e4', 'c5', 'Nc3', 'Nc6', 'f4'] },
    ],
  },
  {
    id: 'sicilian-smith-morra',
    name: 'Sicilian Defense: Smith-Morra Gambit',
    eco: 'B21',
    variations: [
      { name: 'Smith-Morra Gambit Accepted', moves: ['e4', 'c5', 'd4', 'cxd4', 'c3', 'dxc3'] },
    ],
  },
  {
    id: 'sicilian-accelerated-dragon',
    name: 'Sicilian Defense: Accelerated Dragon',
    eco: 'B34',
    variations: [
      { name: 'Accelerated Dragon', moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'g6'] },
    ],
  },
  {
    id: 'sicilian-pin',
    name: 'Sicilian Defense: Pin Variation',
    eco: 'B40',
    variations: [
      { name: 'Pin Variation', moves: ['e4', 'c5', 'Nf3', 'e6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'Bb4'] },
    ],
  },

  // --- French Defense ---
  {
    id: 'french-defense',
    name: 'French Defense',
    eco: 'C00',
    variations: [
      { name: 'French Defense', moves: ['e4', 'e6'] },
    ],
  },
  {
    id: 'french-classical',
    name: 'French Defense: Classical Variation',
    eco: 'C13',
    variations: [
      { name: 'Classical Variation', moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6'] },
    ],
  },
  {
    id: 'french-winawer',
    name: 'French Defense: Winawer Variation',
    eco: 'C15',
    variations: [
      { name: 'Winawer Variation', moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4'] },
    ],
  },
  {
    id: 'french-advance',
    name: 'French Defense: Advance Variation',
    eco: 'C02',
    variations: [
      { name: 'Advance Variation', moves: ['e4', 'e6', 'd4', 'd5', 'e5'] },
    ],
  },
  {
    id: 'french-tarrasch',
    name: 'French Defense: Tarrasch Variation',
    eco: 'C03',
    variations: [
      { name: 'Tarrasch Variation', moves: ['e4', 'e6', 'd4', 'd5', 'Nd2'] },
    ],
  },
  {
    id: 'french-exchange',
    name: 'French Defense: Exchange Variation',
    eco: 'C01',
    variations: [
      { name: 'Exchange Variation', moves: ['e4', 'e6', 'd4', 'd5', 'exd5', 'exd5'] },
    ],
  },

  // --- Caro-Kann Defense ---
  {
    id: 'caro-kann',
    name: 'Caro-Kann Defense',
    eco: 'B10',
    variations: [
      { name: 'Caro-Kann Defense', moves: ['e4', 'c6'] },
    ],
  },
  {
    id: 'caro-kann-classical',
    name: 'Caro-Kann Defense: Classical Variation',
    eco: 'B18',
    variations: [
      { name: 'Classical Variation', moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5'] },
    ],
  },
  {
    id: 'caro-kann-advance',
    name: 'Caro-Kann Defense: Advance Variation',
    eco: 'B12',
    variations: [
      { name: 'Advance Variation', moves: ['e4', 'c6', 'd4', 'd5', 'e5'] },
    ],
  },
  {
    id: 'caro-kann-exchange',
    name: 'Caro-Kann Defense: Exchange Variation',
    eco: 'B13',
    variations: [
      { name: 'Exchange Variation', moves: ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5'] },
    ],
  },
  {
    id: 'caro-kann-panov',
    name: 'Caro-Kann Defense: Panov-Botvinnik Attack',
    eco: 'B14',
    variations: [
      { name: 'Panov-Botvinnik Attack', moves: ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5', 'c4'] },
    ],
  },

  // --- Pirc / Modern ---
  {
    id: 'pirc-defense',
    name: 'Pirc Defense',
    eco: 'B07',
    variations: [
      { name: 'Pirc Defense', moves: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6'] },
    ],
  },
  {
    id: 'modern-defense',
    name: 'Modern Defense',
    eco: 'B06',
    variations: [
      { name: 'Modern Defense', moves: ['e4', 'g6', 'd4', 'Bg7'] },
    ],
  },

  // --- Alekhine ---
  {
    id: 'alekhine-defense',
    name: "Alekhine's Defense",
    eco: 'B02',
    variations: [
      { name: "Alekhine's Defense", moves: ['e4', 'Nf6'] },
    ],
  },

  // --- Scandinavian ---
  {
    id: 'scandinavian-defense',
    name: 'Scandinavian Defense',
    eco: 'B01',
    variations: [
      { name: 'Scandinavian Defense', moves: ['e4', 'd5'] },
      { name: 'Scandinavian: Main Line', moves: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5'] },
    ],
  },

  // --- Queen's Pawn Games ---
  {
    id: 'queens-gambit',
    name: "Queen's Gambit",
    eco: 'D06',
    variations: [
      { name: "Queen's Gambit", moves: ['d4', 'd5', 'c4'] },
    ],
  },
  {
    id: 'queens-gambit-accepted',
    name: "Queen's Gambit Accepted",
    eco: 'D20',
    variations: [
      { name: "Queen's Gambit Accepted", moves: ['d4', 'd5', 'c4', 'dxc4'] },
    ],
  },
  {
    id: 'queens-gambit-declined',
    name: "Queen's Gambit Declined",
    eco: 'D30',
    variations: [
      { name: "Queen's Gambit Declined", moves: ['d4', 'd5', 'c4', 'e6'] },
      { name: "QGD: Orthodox Defense", moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7'] },
      { name: "QGD: Lasker Defense", moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'h6', 'Bh4', 'Ne4'] },
      { name: "QGD: Tartakower Defense", moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'b6'] },
      { name: "QGD: Exchange Variation", moves: ['d4', 'd5', 'c4', 'e6', 'cxd5', 'exd5'] },
    ],
  },
  {
    id: 'slav-defense',
    name: 'Slav Defense',
    eco: 'D10',
    variations: [
      { name: 'Slav Defense', moves: ['d4', 'd5', 'c4', 'c6'] },
      { name: 'Slav: Exchange Variation', moves: ['d4', 'd5', 'c4', 'c6', 'cxd5', 'cxd5'] },
      { name: 'Slav: Meran Variation', moves: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'e6', 'e3', 'Nbd7', 'Bd3', 'dxc4', 'Bxc4', 'b5'] },
      { name: 'Slav: Semi-Slav', moves: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'e6'] },
    ],
  },
  {
    id: 'queens-indian',
    name: "Queen's Indian Defense",
    eco: 'E12',
    variations: [
      { name: "Queen's Indian Defense", moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6'] },
    ],
  },
  {
    id: 'nimzo-indian',
    name: 'Nimzo-Indian Defense',
    eco: 'E20',
    variations: [
      { name: 'Nimzo-Indian Defense', moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'] },
    ],
  },
  {
    id: 'kings-indian',
    name: "King's Indian Defense",
    eco: 'E60',
    variations: [
      { name: "King's Indian Defense", moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'] },
      { name: "KID: Classical Variation", moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O', 'Be2', 'e5'] },
      { name: "KID: Sämisch Variation", moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'f3'] },
      { name: "KID: Fianchetto Variation", moves: ['d4', 'Nf6', 'c4', 'g6', 'Nf3', 'Bg7', 'g3'] },
      { name: "KID: Four Pawns Attack", moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'f4'] },
    ],
  },
  {
    id: 'grunfeld',
    name: 'Grünfeld Defense',
    eco: 'D80',
    variations: [
      { name: 'Grünfeld Defense', moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5'] },
      { name: 'Grünfeld: Exchange Variation', moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'cxd5', 'Nxd5', 'e4', 'Nxc3', 'bxc3', 'Bg7'] },
      { name: 'Grünfeld: Russian Variation', moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'Nf3', 'Bg7', 'Qb3'] },
    ],
  },
  {
    id: 'benoni',
    name: 'Benoni Defense',
    eco: 'A56',
    variations: [
      { name: 'Benoni Defense', moves: ['d4', 'Nf6', 'c4', 'c5', 'd5'] },
      { name: 'Modern Benoni', moves: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'e6'] },
    ],
  },
  {
    id: 'budapest-gambit',
    name: 'Budapest Gambit',
    eco: 'A52',
    variations: [
      { name: 'Budapest Gambit', moves: ['d4', 'Nf6', 'c4', 'e5'] },
    ],
  },
  {
    id: 'albin-countergambit',
    name: 'Albin Countergambit',
    eco: 'D08',
    variations: [
      { name: 'Albin Countergambit', moves: ['d4', 'd5', 'c4', 'e5'] },
    ],
  },
  {
    id: 'dutch-defense',
    name: 'Dutch Defense',
    eco: 'A80',
    variations: [
      { name: 'Dutch Defense', moves: ['d4', 'f5'] },
      { name: 'Dutch: Stonewall Variation', moves: ['d4', 'f5', 'c4', 'Nf6', 'g3', 'e6', 'Bg2', 'd5'] },
      { name: 'Dutch: Leningrad Variation', moves: ['d4', 'f5', 'g3', 'Nf6', 'Bg2', 'g6'] },
    ],
  },
  {
    id: 'english-opening',
    name: 'English Opening',
    eco: 'A10',
    variations: [
      { name: 'English Opening', moves: ['c4'] },
    ],
  },
  {
    id: 'reti-opening',
    name: "Réti Opening",
    eco: 'A04',
    variations: [
      { name: "Réti Opening", moves: ['Nf3', 'd5', 'c4'] },
    ],
  },
  {
    id: 'kings-indian-attack',
    name: "King's Indian Attack",
    eco: 'A05',
    variations: [
      { name: "King's Indian Attack", moves: ['Nf3', 'd5', 'g3'] },
    ],
  },
  {
    id: 'catalan',
    name: 'Catalan Opening',
    eco: 'E04',
    variations: [
      { name: 'Catalan Opening', moves: ['d4', 'Nf6', 'c4', 'e6', 'g3', 'd5', 'Bg2'] },
      { name: 'Catalan: Open', moves: ['d4', 'Nf6', 'c4', 'e6', 'g3', 'd5', 'Bg2', 'dxc4'] },
      { name: 'Catalan: Closed', moves: ['d4', 'Nf6', 'c4', 'e6', 'g3', 'd5', 'Bg2', 'Be7'] },
    ],
  },
  {
    id: 'bogo-indian',
    name: 'Bogo-Indian Defense',
    eco: 'E11',
    variations: [
      { name: 'Bogo-Indian Defense', moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'Bb4+'] },
    ],
  },
  {
    id: 'trompowsky',
    name: 'Trompowsky Attack',
    eco: 'A45',
    variations: [
      { name: 'Trompowsky Attack', moves: ['d4', 'Nf6', 'Bg5'] },
    ],
  },
  {
    id: 'london-system',
    name: 'London System',
    eco: 'A46',
    variations: [
      { name: 'London System', moves: ['d4', 'Nf6', 'Nf3', 'd5', 'Bf4'] },
      { name: 'London System: Main Line', moves: ['d4', 'Nf6', 'Nf3', 'd5', 'Bf4', 'e6', 'e3', 'c5', 'c3'] },
    ],
  },
  {
    id: 'colle-system',
    name: 'Colle System',
    eco: 'A47',
    variations: [
      { name: 'Colle System', moves: ['d4', 'Nf6', 'Nf3', 'e6', 'e3'] },
    ],
  },
  {
    id: 'veresov',
    name: 'Veresov Attack',
    eco: 'A46',
    variations: [
      { name: 'Veresov Attack', moves: ['d4', 'Nf6', 'Nc3', 'd5', 'Bg5'] },
    ],
  },
  {
    id: 'blackmar-diemer',
    name: 'Blackmar-Diemer Gambit',
    eco: 'D00',
    variations: [
      { name: 'Blackmar-Diemer Gambit', moves: ['d4', 'd5', 'e4', 'dxe4', 'Nc3'] },
    ],
  },

  // --- Flank Openings ---
  {
    id: 'bird-opening',
    name: "Bird's Opening",
    eco: 'A02',
    variations: [
      { name: "Bird's Opening", moves: ['f4'] },
    ],
  },
  {
    id: 'benko-gambit',
    name: 'Benko Gambit',
    eco: 'A57',
    variations: [
      { name: 'Benko Gambit Accepted', moves: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'b5', 'cxb5', 'a6'] },
      { name: 'Benko Gambit Declined', moves: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'b5', 'Nf3'] },
    ],
  },
  {
    id: 'englund-gambit',
    name: 'Englund Gambit',
    eco: 'A40',
    variations: [
      { name: 'Englund Gambit', moves: ['d4', 'e5'] },
    ],
  },
  {
    id: 'polish-opening',
    name: "Polish Opening",
    eco: 'A00',
    variations: [
      { name: "Polish Opening (Sokolsky)", moves: ['b4'] },
    ],
  },
  {
    id: 'orangs-outang',
    name: "Orangutan Opening",
    eco: 'A00',
    variations: [
      { name: "Orangutan", moves: ['b4', 'e5', 'Bb2', 'Bxb4', 'Bxe5'] },
    ],
  },
  {
    id: 'larsen-opening',
    name: "Larsen's Opening",
    eco: 'A01',
    variations: [
      { name: "Larsen's Opening", moves: ['b3'] },
    ],
  },
  {
    id: 'grob-opening',
    name: "Grob's Opening",
    eco: 'A00',
    variations: [
      { name: "Grob's Opening", moves: ['g4'] },
    ],
  },
  {
    id: 'ware-opening',
    name: "Ware Opening",
    eco: 'A00',
    variations: [
      { name: "Ware Opening", moves: ['a4'] },
    ],
  },
  {
    id: 'hungarian-opening',
    name: "Hungarian Opening",
    eco: 'A00',
    variations: [
      { name: "Hungarian Opening", moves: ['g3'] },
    ],
  },

  // --- Indian Defenses ---
  {
    id: 'kings-indian-vs-colle',
    name: "King's Indian Defense (vs Colle)",
    eco: 'E60',
    variations: [
      { name: "KID: Early Deviation", moves: ['d4', 'Nf6', 'Nf3', 'g6', 'Bf4', 'Bg7'] },
    ],
  },
  {
    id: 'old-indian',
    name: 'Old Indian Defense',
    eco: 'A53',
    variations: [
      { name: 'Old Indian Defense', moves: ['d4', 'Nf6', 'c4', 'd6'] },
    ],
  },
  {
    id: 'czech-benoni',
    name: 'Czech Benoni',
    eco: 'A56',
    variations: [
      { name: 'Czech Benoni', moves: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'e5'] },
    ],
  },

  // --- Caro-Kann additional ---
  {
    id: 'caro-kann-gurgenidze',
    name: 'Caro-Kann: Gurgenidze System',
    eco: 'B12',
    variations: [
      { name: 'Gurgenidze System', moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'b5'] },
    ],
  },
  {
    id: 'caro-kann-two-knights',
    name: 'Caro-Kann: Two Knights Variation',
    eco: 'B10',
    variations: [
      { name: 'Two Knights Variation', moves: ['e4', 'c6', 'Nc3', 'd5', 'Nf3'] },
    ],
  },

  // --- Sicilian additional ---
  {
    id: 'sicilian-kalashnikov',
    name: 'Sicilian Defense: Kalashnikov Variation',
    eco: 'B32',
    variations: [
      { name: 'Kalashnikov Variation', moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'e5'] },
    ],
  },
  {
    id: 'sicilian-sveshnikov',
    name: 'Sicilian Defense: Sveshnikov Variation',
    eco: 'B33',
    variations: [
      { name: 'Sveshnikov Variation', moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'e5'] },
    ],
  },
  {
    id: 'sicilian-prins',
    name: 'Sicilian Defense: Prins Variation',
    eco: 'B33',
    variations: [
      { name: 'Prins Variation', moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'd6', 'Bg5', 'e6', 'Qd3'] },
    ],
  },
  {
    id: 'sicilian-owsl',
    name: 'Sicilian Defense: OWSM Variation',
    eco: 'B39',
    variations: [
      { name: 'OWSM Variation', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Bg5', 'Nbd7'] },
    ],
  },

  // --- French additional ---
  {
    id: 'french-rubinstein',
    name: 'French Defense: Rubinstein Variation',
    eco: 'C10',
    variations: [
      { name: 'Rubinstein Variation', moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4'] },
    ],
  },
  {
    id: 'french-macCutcheon',
    name: 'French Defense: MacCutcheon Variation',
    eco: 'C12',
    variations: [
      { name: 'MacCutcheon Variation', moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6', 'Bg5', 'Bb4'] },
    ],
  },
  {
    id: 'french-steinitz',
    name: 'French Defense: Steinitz Variation',
    eco: 'C11',
    variations: [
      { name: 'Steinitz Variation', moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6', 'e5'] },
    ],
  },

  // --- Italian additional ---
  {
    id: 'italian-giuoco-piano',
    name: 'Italian Game: Giuoco Piano',
    eco: 'C50',
    variations: [
      { name: 'Giuoco Piano', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'] },
      { name: 'Giuoco Pianissimo', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'd3', 'Nf6'] },
    ],
  },
  {
    id: 'italian-moller',
    name: 'Italian Game: Møller Attack',
    eco: 'C54',
    variations: [
      { name: 'Møller Attack', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'd4', 'exd4', 'O-O', 'Nf6', 'e5', 'd5', 'exf6', 'dxc4', 'Re1+', 'Be6', 'Ng5'] },
    ],
  },
  {
    id: 'italian-knight-attack',
    name: 'Italian Game: Knight Attack',
    eco: 'C55',
    variations: [
      { name: 'Knight Attack', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5'] },
    ],
  },

  // --- Ruy Lopez additional ---
  {
    id: 'ruy-lopez-marshall',
    name: 'Ruy Lopez: Marshall Attack',
    eco: 'C89',
    variations: [
      { name: 'Marshall Attack', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'O-O', 'c3', 'd5'] },
    ],
  },
  {
    id: 'ruy-lopez-archangel',
    name: 'Ruy Lopez: Archangel Defense',
    eco: 'C78',
    variations: [
      { name: 'Archangel Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'b5', 'Bb3', 'Bb7'] },
    ],
  },
  {
    id: 'ruy-lopez-steinitz',
    name: 'Ruy Lopez: Steinitz Defense',
    eco: 'C62',
    variations: [
      { name: 'Steinitz Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'd6'] },
    ],
  },
  {
    id: 'ruy-lopez-chigorin',
    name: 'Ruy Lopez: Chigorin Defense',
    eco: 'C98',
    variations: [
      { name: 'Chigorin Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O', 'h3', 'Na5', 'Bc2', 'c5', 'd4', 'Qc7', 'Nbd2', 'Rd8'] },
    ],
  },
  {
    id: 'ruy-lopez-ziegler',
    name: 'Ruy Lopez: Ziegler Defense',
    eco: 'C65',
    variations: [
      { name: 'Ziegler Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nge7'] },
    ],
  },

  // --- Queen's Pawn additional ---
  {
    id: 'queens-gambit-cambridge-springs',
    name: "Queen's Gambit Declined: Cambridge Springs",
    eco: 'D52',
    variations: [
      { name: 'Cambridge Springs Variation', moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Nbd7', 'e3', 'c6', 'Nf3', 'Qa5'] },
    ],
  },
  {
    id: 'queens-gambit-vienna',
    name: "Queen's Gambit Declined: Vienna Variation",
    eco: 'D37',
    variations: [
      { name: 'Vienna Variation', moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'd5', 'Nc3', 'Bb4'] },
    ],
  },
  {
    id: 'queens-gambit-semi-tarrasch',
    name: "Queen's Gambit: Semi-Tarrasch",
    eco: 'D40',
    variations: [
      { name: 'Semi-Tarrasch', moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Nf3', 'c5'] },
    ],
  },
  {
    id: 'queens-gambit-tarrasch',
    name: "Queen's Gambit: Tarrasch Defense",
    eco: 'D32',
    variations: [
      { name: 'Tarrasch Defense', moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'c5'] },
    ],
  },
  {
    id: 'queens-gambit-chigorin',
    name: "Queen's Gambit: Chigorin Defense",
    eco: 'D07',
    variations: [
      { name: 'Chigorin Defense', moves: ['d4', 'd5', 'c4', 'Nc6'] },
    ],
  },
  {
    id: 'alekhine-chasin',
    name: "Alekhine's Defense: Chasin Variation",
    eco: 'B03',
    variations: [
      { name: 'Chasin Variation', moves: ['e4', 'Nf6', 'e5', 'Nd5', 'c4', 'Nb6', 'd4', 'd6', 'e6'] },
    ],
  },
  {
    id: 'alekhine-four-pawns',
    name: "Alekhine's Defense: Four Pawns Attack",
    eco: 'B03',
    variations: [
      { name: 'Four Pawns Attack', moves: ['e4', 'Nf6', 'e5', 'Nd5', 'd4', 'd6', 'c4', 'Nb6', 'f4'] },
    ],
  },
  {
    id: 'alekhine-exchange',
    name: "Alekhine's Defense: Exchange Variation",
    eco: 'B03',
    variations: [
      { name: 'Exchange Variation', moves: ['e4', 'Nf6', 'e5', 'Nd5', 'c4', 'Nb6', 'd4', 'd6', 'exd6'] },
    ],
  },
  {
    id: 'scotch-mieses',
    name: 'Scotch Game: Mieses Variation',
    eco: 'C45',
    variations: [
      { name: 'Mieses Variation', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Nf6', 'Nxc6', 'bxc6', 'e5', 'Qe7'] },
    ],
  },
  {
    id: 'scotch-classical',
    name: 'Scotch Game: Classical Variation',
    eco: 'C45',
    variations: [
      { name: 'Classical Variation', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Bc5'] },
    ],
  },
  {
    id: 'philidor-hanham',
    name: 'Philidor Defense: Hanham Variation',
    eco: 'C41',
    variations: [
      { name: 'Hanham Variation', moves: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Nd7'] },
    ],
  },
  {
    id: 'petrov-steinitz',
    name: 'Petrov Defense: Steinitz Variation',
    eco: 'C42',
    variations: [
      { name: 'Steinitz Variation', moves: ['e4', 'e5', 'Nf3', 'Nf6', 'd4', 'd6'] },
    ],
  },
  {
    id: 'petrov-three-knights',
    name: 'Petrov Defense: Three Knights Game',
    eco: 'C42',
    variations: [
      { name: 'Three Knights Game', moves: ['e4', 'e5', 'Nf3', 'Nf6', 'Nc3'] },
    ],
  },

  // --- English additional ---
  {
    id: 'english-symmetrical',
    name: 'English Opening: Symmetrical Variation',
    eco: 'A30',
    variations: [
      { name: 'Symmetrical Variation', moves: ['c4', 'c5'] },
    ],
  },
  {
    id: 'english-four-knights',
    name: 'English Opening: Four Knights Variation',
    eco: 'A28',
    variations: [
      { name: 'Four Knights Variation', moves: ['c4', 'e5', 'Nc3', 'Nf6', 'Nf3', 'Nc6'] },
    ],
  },
  {
    id: 'english-kings',
    name: 'English Opening: King\'s English Variation',
    eco: 'A21',
    variations: [
      { name: "King's English", moves: ['c4', 'e5'] },
    ],
  },
  {
    id: 'english-dragon',
    name: 'English Opening: Dragon Variation',
    eco: 'A28',
    variations: [
      { name: 'Dragon Variation', moves: ['c4', 'e5', 'Nc3', 'Nf6', 'g3', 'g6'] },
    ],
  },

  // --- Nimzo additional ---
  {
    id: 'nimzo-samisch',
    name: 'Nimzo-Indian Defense: Sämisch Variation',
    eco: 'E26',
    variations: [
      { name: 'Sämisch Variation', moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'a3', 'Bxc3+', 'bxc3'] },
    ],
  },
  {
    id: 'nimzo-rubinstein',
    name: 'Nimzo-Indian Defense: Rubinstein Variation',
    eco: 'E21',
    variations: [
      { name: 'Rubinstein Variation', moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'e3'] },
    ],
  },
  {
    id: 'nimzo-classical',
    name: 'Nimzo-Indian Defense: Classical Variation',
    eco: 'E32',
    variations: [
      { name: 'Classical Variation', moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'Qc2'] },
    ],
  },

  // --- KID additional ---
  {
    id: 'kid-bayonet',
    name: "King's Indian Defense: Bayonet Attack",
    eco: 'E97',
    variations: [
      { name: 'Bayonet Attack', moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O', 'Be2', 'e5', 'O-O', 'Nc6', 'd5', 'Ne7', 'b4'] },
    ],
  },
  {
    id: 'kid-averbakh',
    name: "King's Indian Defense: Averbakh Variation",
    eco: 'E70',
    variations: [
      { name: 'Averbakh Variation', moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Bg5'] },
    ],
  },
  {
    id: 'kid-panno',
    name: "King's Indian Defense: Panno Variation",
    eco: 'E73',
    variations: [
      { name: 'Panno Variation', moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Be2', 'O-O', 'Bg5', 'Nc6'] },
    ],
  },
  {
    id: 'grunfeld-three-knights',
    name: 'Grünfeld Defense: Three Knights Variation',
    eco: 'D90',
    variations: [
      { name: 'Three Knights Variation', moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'Nf3'] },
    ],
  },

  // --- Modern additional ---
  {
    id: 'modern-pseudo-austrian',
    name: 'Modern Defense: Pseudo-Austrian Attack',
    eco: 'B06',
    variations: [
      { name: 'Pseudo-Austrian Attack', moves: ['e4', 'g6', 'd4', 'Bg7', 'f4'] },
    ],
  },
  {
    id: 'modern-averbakh',
    name: 'Modern Defense: Averbakh Variation',
    eco: 'B06',
    variations: [
      { name: 'Averbakh Variation', moves: ['e4', 'g6', 'd4', 'Bg7', 'c4'] },
    ],
  },

  // --- Pirc additional ---
  {
    id: 'pirc-austrian',
    name: 'Pirc Defense: Austrian Attack',
    eco: 'B08',
    variations: [
      { name: 'Austrian Attack', moves: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6', 'f4'] },
    ],
  },
  {
    id: 'pirc-classical',
    name: 'Pirc Defense: Classical Variation',
    eco: 'B08',
    variations: [
      { name: 'Classical Variation', moves: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6', 'Nf3', 'Bg7', 'Be2', 'O-O'] },
    ],
  },

  // --- Dutch additional ---
  {
    id: 'dutch-staunton',
    name: 'Dutch Defense: Staunton Gambit',
    eco: 'A82',
    variations: [
      { name: 'Staunton Gambit', moves: ['d4', 'f5', 'e4', 'fxe4', 'Nc3', 'Nf6', 'Bg5'] },
    ],
  },
  {
    id: 'dutch-classical',
    name: 'Dutch Defense: Classical Variation',
    eco: 'A85',
    variations: [
      { name: 'Classical Variation', moves: ['d4', 'f5', 'c4', 'Nf6', 'Nc3', 'e6', 'Nf3', 'Be7'] },
    ],
  },

  // --- Benoni additional ---
  {
    id: 'benoni-classical',
    name: 'Benoni Defense: Classical Variation',
    eco: 'A70',
    variations: [
      { name: 'Classical Variation', moves: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'e6', 'Nc3', 'exd5', 'cxd5', 'd6'] },
    ],
  },
  {
    id: 'benoni-fianchetto',
    name: 'Benoni Defense: Fianchetto Variation',
    eco: 'A62',
    variations: [
      { name: 'Fianchetto Variation', moves: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'e6', 'Nf3', 'exd5', 'cxd5', 'd6', 'g3'] },
    ],
  },

  // --- Slav additional ---
  {
    id: 'slav-botvinnik',
    name: 'Slav Defense: Botvinnik Variation',
    eco: 'D44',
    variations: [
      { name: 'Botvinnik Variation', moves: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'e6', 'Bg5', 'dxc4', 'e4', 'b5', 'e5', 'h6', 'Bh4', 'g5', 'exf6', 'gxh4', 'Ne5'] },
    ],
  },
  {
    id: 'slav-krause',
    name: 'Slav Defense: Krause Variation',
    eco: 'D11',
    variations: [
      { name: 'Krause Variation', moves: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'e3', 'Bf5'] },
    ],
  },
  {
    id: 'slav-chebanenko',
    name: 'Slav Defense: Chebanenko Variation',
    eco: 'D10',
    variations: [
      { name: 'Chebanenko Variation', moves: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'a6'] },
    ],
  },
  {
    id: 'slav-winawer',
    name: 'Slav Defense: Winawer Countergambit',
    eco: 'D10',
    variations: [
      { name: 'Winawer Countergambit', moves: ['d4', 'd5', 'c4', 'c6', 'Nc3', 'e5'] },
    ],
  },
  {
    id: 'queens-indian-classical',
    name: "Queen's Indian Defense: Classical Variation",
    eco: 'E14',
    variations: [
      { name: 'Classical Variation', moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6', 'e3', 'Bb7', 'Bd3'] },
    ],
  },
  {
    id: 'queens-indian-petrosian',
    name: "Queen's Indian Defense: Petrosian Variation",
    eco: 'E12',
    variations: [
      { name: 'Petrosian Variation', moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6', 'a3', 'Bb7', 'Nc3'] },
    ],
  },
  {
    id: 'kings-gambit-kieseritzky',
    name: "King's Gambit: Kieseritzky Gambit",
    eco: 'C39',
    variations: [
      { name: 'Kieseritzky Gambit', moves: ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'g5', 'h4', 'g4', 'Ng5'] },
    ],
  },
  {
    id: 'kings-gambit-allgaier',
    name: "King's Gambit: Allgaier Gambit",
    eco: 'C39',
    variations: [
      { name: 'Allgaier Gambit', moves: ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'g5', 'h4', 'g4', 'Ng1'] },
    ],
  },
  {
    id: 'kings-gambit-muzio',
    name: "King's Gambit: Muzio Gambit",
    eco: 'C37',
    variations: [
      { name: 'Muzio Gambit', moves: ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'g5', 'Bc4', 'g4', 'O-O', 'gxf3', 'Qxf3'] },
    ],
  },
  {
    id: 'kings-gambit-cunningham',
    name: "King's Gambit: Cunningham Defense",
    eco: 'C31',
    variations: [
      { name: 'Cunningham Defense', moves: ['e4', 'e5', 'f4', 'Bc5', 'Nf3', 'd6'] },
    ],
  },
  {
    id: 'italian-two-knights',
    name: 'Italian Game: Two Knights Defense',
    eco: 'C56',
    variations: [
      { name: 'Two Knights Defense: Main Line', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Na5', 'Bb5+', 'c6', 'dxc6', 'bxc6', 'Be2', 'h6'] },
    ],
  },
  {
    id: 'italian-two-knights-polish',
    name: 'Italian Game: Two Knights Defense (Polish Variation)',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'd4'],
    eco: 'C55',
    variations: [
      { name: 'Two Knights: Polish Variation', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'd4'] },
    ],
  },
  {
    id: 'evans-gambit-main',
    name: "Evans Gambit: Main Line",
    eco: 'C52',
    variations: [
      { name: 'Evans Gambit Main Line', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4', 'Bxb4', 'c3', 'Ba5', 'd4', 'exd4', 'O-O', 'Nge7'] },
    ],
  },
  {
    id: 'evans-gambit-compromised',
    name: "Evans Gambit: Compromised Defense",
    eco: 'C51',
    variations: [
      { name: 'Compromised Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4', 'Bxb4', 'c3', 'Be7'] },
    ],
  },
  {
    id: 'hungarian-defense-classical',
    name: 'Hungarian Defense: Classical Variation',
    eco: 'C50',
    variations: [
      { name: 'Hungarian Defense Classical', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Be7', 'd4', 'exd4', 'Nxd4', 'Nxd4', 'Qxd4'] },
    ],
  },
  {
    id: 'scotch-gambit',
    name: 'Scotch Gambit',
    eco: 'C44',
    variations: [
      { name: 'Scotch Gambit', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Bc4'] },
    ],
  },
  {
    id: 'vienna-slav',
    name: 'Vienna Game: Slav Defense',
    eco: 'C27',
    variations: [
      { name: 'Vienna Slav', moves: ['e4', 'e5', 'Nc3', 'Nc6', 'Bc4', 'Nf6', 'd3', 'Bb4', 'Bd2', 'd5'] },
    ],
  },
  {
    id: 'vienna-max-lange',
    name: 'Vienna Game: Max Lange Defense',
    eco: 'C26',
    variations: [
      { name: 'Max Lange Defense', moves: ['e4', 'e5', 'Nc3', 'Nf6', 'Bc4', 'Bb4', 'd3', 'Nc6'] },
    ],
  },
  {
    id: 'philidor-exchange',
    name: 'Philidor Defense: Exchange Variation',
    eco: 'C41',
    variations: [
      { name: 'Philidor Exchange', moves: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'exd4', 'Qxd4'] },
    ],
  },
]

function buildOpenings(): Opening[] {
  return RAW_OPENINGS.map((raw) => {
    const variations = raw.variations.map((v) => ({
      name: v.name,
      moves: v.moves,
      fen: computeFens(v.moves),
    }))
    return {
      id: raw.id,
      name: raw.name,
      eco: raw.eco,
      fen: variations[0].fen,
      variations,
    }
  })
}

export const openings: Opening[] = buildOpenings()

export function findOpeningByFen(fen: string): Opening | undefined {
  const boardFen = fen.split(' ')[0]
  return openings.find((o) => o.fen === boardFen || o.variations.some((v) => v.fen === boardFen))
}

export function findOpeningVariation(fen: string): { opening: Opening; variation: OpeningVariation } | undefined {
  const boardFen = fen.split(' ')[0]
  for (const opening of openings) {
    const variation = opening.variations.find((v) => v.fen === boardFen)
    if (variation) return { opening, variation }
  }
  return undefined
}

export function searchOpenings(query: string): Opening[] {
  if (!query) return openings
  const q = query.toLowerCase()
  return openings.filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.variations.some((v) => v.name.toLowerCase().includes(q)),
  )
}
