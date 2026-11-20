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
  {
    id: "a00-amar-opening",
    name: "Amar Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-amar-opening-paris-gambit",
    name: "Amar Opening: Paris Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-amar-opening-paris-gambit-gent-gambit",
    name: "Amar Opening: Paris Gambit, Gent Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-amsterdam-attack",
    name: "Amsterdam Attack",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-anderssen-s-opening",
    name: "Anderssen",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-anderssen-s-opening-polish-gambit",
    name: "Anderssen",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-barnes-opening",
    name: "Barnes Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-barnes-opening-fool-s-mate",
    name: "Barnes Opening: Fool",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-barnes-opening-gedult-gambit",
    name: "Barnes Opening: Gedult Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-barnes-opening-hammerschlag",
    name: "Barnes Opening: Hammerschlag",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-clemenz-opening",
    name: "Clemenz Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-clemenz-opening-spike-lee-gambit",
    name: "Clemenz Opening: Spike Lee Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-creepy-crawly-formation-classical-defense",
    name: "Creepy Crawly Formation: Classical Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-formation-hippopotamus-attack",
    name: "Formation: Hippopotamus Attack",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-formation-shy-attack",
    name: "Formation: Shy Attack",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-global-opening",
    name: "Global Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "grob-opening",
    name: "Grob",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening",
    name: "Grob Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-alessi-gambit",
    name: "Grob Opening: Alessi Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-double-grob",
    name: "Grob Opening: Double Grob",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-double-grob-coca-cola-gambit",
    name: "Grob Opening: Double Grob, Coca-Cola Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-grob-gambit",
    name: "Grob Opening: Grob Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-grob-gambit-declined",
    name: "Grob Opening: Grob Gambit Declined",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-grob-gambit-basman-gambit",
    name: "Grob Opening: Grob Gambit, Basman Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-grob-gambit-fritz-gambit",
    name: "Grob Opening: Grob Gambit, Fritz Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-grob-gambit-fritz-gambit-romford-countergambit",
    name: "Grob Opening: Grob Gambit, Fritz Gambit, Romford Countergambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-grob-gambit-keres-gambit",
    name: "Grob Opening: Grob Gambit, Keres Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-grob-gambit-richter-grob-gambit",
    name: "Grob Opening: Grob Gambit, Richter-Grob Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-keene-defense",
    name: "Grob Opening: Keene Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-keene-defense-main-line",
    name: "Grob Opening: Keene Defense, Main Line",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-london-defense",
    name: "Grob Opening: London Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-romford-countergambit",
    name: "Grob Opening: Romford Countergambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-spike-attack",
    name: "Grob Opening: Spike Attack",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-spike-hurst-attack",
    name: "Grob Opening: Spike, Hurst Attack",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-zilbermints-gambit",
    name: "Grob Opening: Zilbermints Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-zilbermints-gambit-schiller-defense",
    name: "Grob Opening: Zilbermints Gambit, Schiller Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-grob-opening-zilbermints-gambit-zilbermints-hartlaub-gambit",
    name: "Grob Opening: Zilbermints Gambit, Zilbermints-Hartlaub Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening",
    name: "Hungarian Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-asten-gambit",
    name: "Hungarian Opening: Asten Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-burk-gambit",
    name: "Hungarian Opening: Burk Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-b-cker-gambit",
    name: "Hungarian Opening: Bücker Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-catalan-formation",
    name: "Hungarian Opening: Catalan Formation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-dutch-defense",
    name: "Hungarian Opening: Dutch Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-indian-defense",
    name: "Hungarian Opening: Indian Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-myers-defense",
    name: "Hungarian Opening: Myers Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-pachman-gambit",
    name: "Hungarian Opening: Pachman Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-paris-gambit",
    name: "Hungarian Opening: Paris Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-reversed-alekhine",
    name: "Hungarian Opening: Reversed Alekhine",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-reversed-brooklyn-defense-brooklyn-benko-gambit",
    name: "Hungarian Opening: Reversed Brooklyn Defense, Brooklyn Benko Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-reversed-modern-defense",
    name: "Hungarian Opening: Reversed Modern Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-reversed-norwegian-defense",
    name: "Hungarian Opening: Reversed Norwegian Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-sicilian-invitation",
    name: "Hungarian Opening: Sicilian Invitation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-slav-formation",
    name: "Hungarian Opening: Slav Formation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-symmetrical-variation",
    name: "Hungarian Opening: Symmetrical Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-van-kuijk-gambit",
    name: "Hungarian Opening: Van Kuijk Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-hungarian-opening-winterberg-gambit",
    name: "Hungarian Opening: Winterberg Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-k-das-opening",
    name: "Kádas Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-k-das-opening-beginner-s-trap",
    name: "Kádas Opening: Beginner",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-k-das-opening-koola-koola-variation",
    name: "Kádas Opening: Koola-Koola Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-k-das-opening-k-das-gambit",
    name: "Kádas Opening: Kádas Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-k-das-opening-myers-variation",
    name: "Kádas Opening: Myers Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-k-das-opening-schneider-gambit",
    name: "Kádas Opening: Schneider Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-k-das-opening-steinbok-gambit",
    name: "Kádas Opening: Steinbok Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-lasker-simul-special",
    name: "Lasker Simul Special",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-mieses-opening",
    name: "Mieses Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-mieses-opening-myers-spike-attack",
    name: "Mieses Opening: Myers Spike Attack",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-mieses-opening-reversed-rat",
    name: "Mieses Opening: Reversed Rat",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-mieses-opening-venezolana-variation",
    name: "Mieses Opening: Venezolana Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "orangs-outang",
    name: "Orangutan Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening",
    name: "Polish Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-with-d5",
    name: "Polish Opening, with d5",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-baltic-defense",
    name: "Polish Opening: Baltic Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-birmingham-gambit",
    name: "Polish Opening: Birmingham Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-bugayev-advance-variation",
    name: "Polish Opening: Bugayev Advance Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-bugayev-attack",
    name: "Polish Opening: Bugayev Attack",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-czech-defense",
    name: "Polish Opening: Czech Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-dutch-defense",
    name: "Polish Opening: Dutch Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-german-defense",
    name: "Polish Opening: German Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-grigorian-variation",
    name: "Polish Opening: Grigorian Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-karniewski-variation",
    name: "Polish Opening: Karniewski Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-king-s-indian-variation",
    name: "Polish Opening: King",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-king-s-indian-variation-schiffler-attack",
    name: "Polish Opening: King",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-king-s-indian-variation-sokolsky-attack",
    name: "Polish Opening: King",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-myers-variation",
    name: "Polish Opening: Myers Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-outflank-variation",
    name: "Polish Opening: Outflank Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-outflank-variation-schuehler-gambit",
    name: "Polish Opening: Outflank Variation, Schuehler Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-queen-s-indian-variation",
    name: "Polish Opening: Queen",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-queenside-defense",
    name: "Polish Opening: Queenside Defense",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-rooks-swap-line",
    name: "Polish Opening: Rooks Swap Line",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-schiffler-sokolsky-variation",
    name: "Polish Opening: Schiffler-Sokolsky Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-schuehler-gambit",
    name: "Polish Opening: Schuehler Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-symmetrical-variation",
    name: "Polish Opening: Symmetrical Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-tartakower-gambit",
    name: "Polish Opening: Tartakower Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-polish-opening-wolferts-gambit",
    name: "Polish Opening: Wolferts Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-saragossa-opening",
    name: "Saragossa Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-sodium-attack",
    name: "Sodium Attack",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-sodium-attack-celadon-variation",
    name: "Sodium Attack: Celadon Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-sodium-attack-chenoboskion-variation",
    name: "Sodium Attack: Chenoboskion Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-sodium-attack-durkin-gambit",
    name: "Sodium Attack: Durkin Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-valencia-opening",
    name: "Valencia Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-t-kruijs-opening",
    name: "Van",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-t-kruijs-opening-bouncing-bishop-variation",
    name: "Van",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-t-kruijs-opening-keoni-hiva-gambit-akahi-variation",
    name: "Van",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-t-kruijs-opening-keoni-hiva-gambit-alua-variation",
    name: "Van",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-t-kruijs-opening-keoni-hiva-gambit-ekolu-variation",
    name: "Van",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening",
    name: "Van Geet Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-battambang-variation",
    name: "Van Geet Opening: Battambang Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-billockus-johansen-gambit",
    name: "Van Geet Opening: Billockus-Johansen Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-damhaug-gambit",
    name: "Van Geet Opening: Damhaug Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-dougherty-gambit",
    name: "Van Geet Opening: Dougherty Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-dunst-perrenet-gambit",
    name: "Van Geet Opening: Dunst-Perrenet Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-d-sseldorf-gambit",
    name: "Van Geet Opening: Düsseldorf Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-gladbacher-gambit",
    name: "Van Geet Opening: Gladbacher Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-hector-gambit",
    name: "Van Geet Opening: Hector Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-hergert-gambit",
    name: "Van Geet Opening: Hergert Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-hulsemann-gambit",
    name: "Van Geet Opening: Hulsemann Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-jendrossek-gambit",
    name: "Van Geet Opening: Jendrossek Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-kluever-gambit",
    name: "Van Geet Opening: Kluever Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-laroche-gambit",
    name: "Van Geet Opening: Laroche Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-liebig-gambit",
    name: "Van Geet Opening: Liebig Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-melleby-gambit",
    name: "Van Geet Opening: Melleby Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-myers-attack",
    name: "Van Geet Opening: Myers Attack",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-napoleon-attack",
    name: "Van Geet Opening: Napoleon Attack",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-novosibirsk-variation",
    name: "Van Geet Opening: Novosibirsk Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-nowokunski-gambit",
    name: "Van Geet Opening: Nowokunski Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-pfeiffer-gambit",
    name: "Van Geet Opening: Pfeiffer Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-pfeiffer-gambit-sleipnir-countergambit",
    name: "Van Geet Opening: Pfeiffer Gambit, Sleipnir Countergambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-reversed-nimzowitsch",
    name: "Van Geet Opening: Reversed Nimzowitsch",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-reversed-scandinavian",
    name: "Van Geet Opening: Reversed Scandinavian",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-sicilian-two-knights",
    name: "Van Geet Opening: Sicilian Two Knights",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-sleipnir-gambit",
    name: "Van Geet Opening: Sleipnir Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-twyble-attack",
    name: "Van Geet Opening: Twyble Attack",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-t-bingen-gambit",
    name: "Van Geet Opening: Tübingen Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-venezolana-variation",
    name: "Van Geet Opening: Venezolana Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-van-geet-opening-warsteiner-gambit",
    name: "Van Geet Opening: Warsteiner Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-ware-opening",
    name: "Ware Opening",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-ware-opening-cologne-gambit",
    name: "Ware Opening: Cologne Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-ware-opening-crab-variation",
    name: "Ware Opening: Crab Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-ware-opening-meadow-hay-trap",
    name: "Ware Opening: Meadow Hay Trap",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-ware-opening-symmetric-variation",
    name: "Ware Opening: Symmetric Variation",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-ware-opening-ware-gambit",
    name: "Ware Opening: Ware Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "a00-ware-opening-wing-gambit",
    name: "Ware Opening: Wing Gambit",
    eco: "A00",
    variations: [

    ],
  },

  {
    id: "larsen-opening",
    name: "Larsen",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "a01-nimzo-larsen-attack",
    name: "Nimzo-Larsen Attack",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "a01-nimzo-larsen-attack-classical-variation",
    name: "Nimzo-Larsen Attack: Classical Variation",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "a01-nimzo-larsen-attack-dutch-variation",
    name: "Nimzo-Larsen Attack: Dutch Variation",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "a01-nimzo-larsen-attack-english-variation",
    name: "Nimzo-Larsen Attack: English Variation",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "a01-nimzo-larsen-attack-graz-attack",
    name: "Nimzo-Larsen Attack: Graz Attack",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "a01-nimzo-larsen-attack-indian-variation",
    name: "Nimzo-Larsen Attack: Indian Variation",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "a01-nimzo-larsen-attack-modern-variation",
    name: "Nimzo-Larsen Attack: Modern Variation",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "a01-nimzo-larsen-attack-pachman-gambit",
    name: "Nimzo-Larsen Attack: Pachman Gambit",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "a01-nimzo-larsen-attack-polish-variation",
    name: "Nimzo-Larsen Attack: Polish Variation",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "a01-nimzo-larsen-attack-ringelbach-gambit",
    name: "Nimzo-Larsen Attack: Ringelbach Gambit",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "a01-nimzo-larsen-attack-spike-variation",
    name: "Nimzo-Larsen Attack: Spike Variation",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "a01-nimzo-larsen-attack-symmetrical-variation",
    name: "Nimzo-Larsen Attack: Symmetrical Variation",
    eco: "A01",
    variations: [

    ],
  },

  {
    id: "bird-opening",
    name: "Bird",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening",
    name: "Bird Opening",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-batavo-polish-attack",
    name: "Bird Opening: Batavo-Polish Attack",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-double-duck-formation",
    name: "Bird Opening: Double Duck Formation",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-from-s-gambit",
    name: "Bird Opening: From",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-from-s-gambit-bahr-gambit",
    name: "Bird Opening: From",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-from-s-gambit-langheld-gambit",
    name: "Bird Opening: From",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-from-s-gambit-lasker-variation",
    name: "Bird Opening: From",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-from-s-gambit-lipke-variation",
    name: "Bird Opening: From",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-hobbs-gambit",
    name: "Bird Opening: Hobbs Gambit",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-hobbs-zilbermints-gambit",
    name: "Bird Opening: Hobbs-Zilbermints Gambit",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-horsefly-defense",
    name: "Bird Opening: Horsefly Defense",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-lasker-gambit",
    name: "Bird Opening: Lasker Gambit",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-mujannah",
    name: "Bird Opening: Mujannah",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-myers-defense",
    name: "Bird Opening: Myers Defense",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-platz-gambit",
    name: "Bird Opening: Platz Gambit",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-schlechter-gambit",
    name: "Bird Opening: Schlechter Gambit",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-siegener-gambit",
    name: "Bird Opening: Siegener Gambit",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-swiss-gambit",
    name: "Bird Opening: Swiss Gambit",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a02-bird-opening-wagner-zwitersch-gambit",
    name: "Bird Opening: Wagner-Zwitersch Gambit",
    eco: "A02",
    variations: [

    ],
  },

  {
    id: "a03-bird-opening-dutch-variation",
    name: "Bird Opening: Dutch Variation",
    eco: "A03",
    variations: [

    ],
  },

  {
    id: "a03-bird-opening-dutch-variation-dudweiler-gambit",
    name: "Bird Opening: Dutch Variation, Dudweiler Gambit",
    eco: "A03",
    variations: [

    ],
  },

  {
    id: "a03-bird-opening-lasker-variation",
    name: "Bird Opening: Lasker Variation",
    eco: "A03",
    variations: [

    ],
  },

  {
    id: "a03-bird-opening-sturm-gambit",
    name: "Bird Opening: Sturm Gambit",
    eco: "A03",
    variations: [

    ],
  },

  {
    id: "a03-bird-opening-thomas-gambit",
    name: "Bird Opening: Thomas Gambit",
    eco: "A03",
    variations: [

    ],
  },

  {
    id: "a03-bird-opening-williams-gambit",
    name: "Bird Opening: Williams Gambit",
    eco: "A03",
    variations: [

    ],
  },

  {
    id: "a03-bird-opening-williams-zilbermints-gambit",
    name: "Bird Opening: Williams-Zilbermints Gambit",
    eco: "A03",
    variations: [

    ],
  },

  {
    id: "a04-colle-system-rhamphorhynchus-variation",
    name: "Colle System: Rhamphorhynchus Variation",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-modern-defense-semi-averbakh-variation-polish-variation",
    name: "Modern Defense: Semi-Averbakh Variation, Polish Variation",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-modern-defense-semi-averbakh-variation-pterodactyl-variation",
    name: "Modern Defense: Semi-Averbakh Variation, Pterodactyl Variation",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-modern-defense-semi-averbakh-variation-pterodactyl-variation-accepted",
    name: "Modern Defense: Semi-Averbakh Variation, Pterodactyl Variation Accepted",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "reti-opening",
    name: "Réti Opening",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-defense-kingside-variation",
    name: "Zukertort Defense: Kingside Variation",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-defense-sicilian-knight-variation",
    name: "Zukertort Defense: Sicilian Knight Variation",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening",
    name: "Zukertort Opening",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-arctic-defense",
    name: "Zukertort Opening: Arctic Defense",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-arctic-defense-drunken-knight-variation",
    name: "Zukertort Opening: Arctic Defense, Drunken Knight Variation",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-basman-defense",
    name: "Zukertort Opening: Basman Defense",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-black-mustang-defense",
    name: "Zukertort Opening: Black Mustang Defense",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-drunken-cavalry-variation",
    name: "Zukertort Opening: Drunken Cavalry Variation",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-dutch-variation",
    name: "Zukertort Opening: Dutch Variation",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-herrstrom-gambit",
    name: "Zukertort Opening: Herrstrom Gambit",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-kingside-fianchetto",
    name: "Zukertort Opening: Kingside Fianchetto",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-lisitsyn-gambit",
    name: "Zukertort Opening: Lisitsyn Gambit",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-lisitsyn-gambit-deferred",
    name: "Zukertort Opening: Lisitsyn Gambit Deferred",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-pirc-invitation",
    name: "Zukertort Opening: Pirc Invitation",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-polish-defense",
    name: "Zukertort Opening: Polish Defense",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-queen-s-gambit-invitation",
    name: "Zukertort Opening: Queen",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-queenside-fianchetto-variation",
    name: "Zukertort Opening: Queenside Fianchetto Variation",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-ross-gambit",
    name: "Zukertort Opening: Ross Gambit",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-shabalov-gambit",
    name: "Zukertort Opening: Shabalov Gambit",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-sicilian-invitation",
    name: "Zukertort Opening: Sicilian Invitation",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-slav-invitation",
    name: "Zukertort Opening: Slav Invitation",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-speelsmet-gambit",
    name: "Zukertort Opening: Speelsmet Gambit",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-st-george-defense",
    name: "Zukertort Opening: St. George Defense",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-the-walrus",
    name: "Zukertort Opening: The Walrus",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-vos-gambit",
    name: "Zukertort Opening: Vos Gambit",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-wade-defense",
    name: "Zukertort Opening: Wade Defense",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a04-zukertort-opening-ware-defense",
    name: "Zukertort Opening: Ware Defense",
    eco: "A04",
    variations: [

    ],
  },

  {
    id: "a05-king-s-indian-attack",
    name: "King",
    eco: "A05",
    variations: [

    ],
  },

  {
    id: "a05-king-s-indian-attack-smyslov-variation",
    name: "King",
    eco: "A05",
    variations: [

    ],
  },

  {
    id: "a05-king-s-indian-attack-spassky-variation",
    name: "King",
    eco: "A05",
    variations: [

    ],
  },

  {
    id: "a05-king-s-indian-attack-symmetrical-defense",
    name: "King",
    eco: "A05",
    variations: [

    ],
  },

  {
    id: "a05-king-s-indian-attack-wahls-defense",
    name: "King",
    eco: "A05",
    variations: [

    ],
  },

  {
    id: "a05-polish-opening-zukertort-system",
    name: "Polish Opening: Zukertort System",
    eco: "A05",
    variations: [

    ],
  },

  {
    id: "a05-zukertort-opening",
    name: "Zukertort Opening",
    eco: "A05",
    variations: [

    ],
  },

  {
    id: "a05-zukertort-opening-double-fianchetto-attack",
    name: "Zukertort Opening: Double Fianchetto Attack",
    eco: "A05",
    variations: [

    ],
  },

  {
    id: "a05-zukertort-opening-lemberger-gambit",
    name: "Zukertort Opening: Lemberger Gambit",
    eco: "A05",
    variations: [

    ],
  },

  {
    id: "a05-zukertort-opening-myers-polish-attack",
    name: "Zukertort Opening: Myers Polish Attack",
    eco: "A05",
    variations: [

    ],
  },

  {
    id: "a05-zukertort-opening-nimzo-larsen-variation",
    name: "Zukertort Opening: Nimzo-Larsen Variation",
    eco: "A05",
    variations: [

    ],
  },

  {
    id: "a05-zukertort-opening-quiet-system",
    name: "Zukertort Opening: Quiet System",
    eco: "A05",
    variations: [

    ],
  },

  {
    id: "a06-nimzo-larsen-attack-classical-variation",
    name: "Nimzo-Larsen Attack: Classical Variation",
    eco: "A06",
    variations: [

    ],
  },

  {
    id: "a06-nimzo-larsen-attack-norfolk-gambit",
    name: "Nimzo-Larsen Attack: Norfolk Gambit",
    eco: "A06",
    variations: [

    ],
  },

  {
    id: "a06-zukertort-opening",
    name: "Zukertort Opening",
    eco: "A06",
    variations: [

    ],
  },

  {
    id: "a06-zukertort-opening-ampel-variation",
    name: "Zukertort Opening: Ampel Variation",
    eco: "A06",
    variations: [

    ],
  },

  {
    id: "a06-zukertort-opening-old-indian-attack",
    name: "Zukertort Opening: Old Indian Attack",
    eco: "A06",
    variations: [

    ],
  },

  {
    id: "a06-zukertort-opening-pachman-gambit",
    name: "Zukertort Opening: Pachman Gambit",
    eco: "A06",
    variations: [

    ],
  },

  {
    id: "a06-zukertort-opening-regina-nu-gambit",
    name: "Zukertort Opening: Regina-Nu Gambit",
    eco: "A06",
    variations: [

    ],
  },

  {
    id: "a06-zukertort-opening-reversed-mexican-defense",
    name: "Zukertort Opening: Reversed Mexican Defense",
    eco: "A06",
    variations: [

    ],
  },

  {
    id: "a06-zukertort-opening-santasiere-s-folly",
    name: "Zukertort Opening: Santasiere",
    eco: "A06",
    variations: [

    ],
  },

  {
    id: "a06-zukertort-opening-tennison-gambit",
    name: "Zukertort Opening: Tennison Gambit",
    eco: "A06",
    variations: [

    ],
  },

  {
    id: "a06-zukertort-opening-tennison-gambit-brigg-s-trap",
    name: "Zukertort Opening: Tennison Gambit, Brigg",
    eco: "A06",
    variations: [

    ],
  },

  {
    id: "a06-zukertort-opening-the-potato",
    name: "Zukertort Opening: The Potato",
    eco: "A06",
    variations: [

    ],
  },

  {
    id: "a07-hungarian-opening-wiedenhagen-beta-gambit",
    name: "Hungarian Opening: Wiedenhagen-Beta Gambit",
    eco: "A07",
    variations: [

    ],
  },

  {
    id: "a07-king-s-indian-attack",
    name: "King",
    eco: "A07",
    variations: [

    ],
  },

  {
    id: "a07-king-s-indian-attack-with-bf5",
    name: "King",
    eco: "A07",
    variations: [

    ],
  },

  {
    id: "a07-king-s-indian-attack-with-e6",
    name: "King",
    eco: "A07",
    variations: [

    ],
  },

  {
    id: "a07-king-s-indian-attack-double-fianchetto",
    name: "King",
    eco: "A07",
    variations: [

    ],
  },

  {
    id: "a07-king-s-indian-attack-keres-variation",
    name: "King",
    eco: "A07",
    variations: [

    ],
  },

  {
    id: "a07-king-s-indian-attack-omega-delta-gambit",
    name: "King",
    eco: "A07",
    variations: [

    ],
  },

  {
    id: "a07-king-s-indian-attack-pachman-system",
    name: "King",
    eco: "A07",
    variations: [

    ],
  },

  {
    id: "a07-king-s-indian-attack-sicilian-variation",
    name: "King",
    eco: "A07",
    variations: [

    ],
  },

  {
    id: "a07-king-s-indian-attack-yugoslav-variation",
    name: "King",
    eco: "A07",
    variations: [

    ],
  },

  {
    id: "a08-king-s-indian-attack-french-variation",
    name: "King",
    eco: "A08",
    variations: [

    ],
  },

  {
    id: "a08-king-s-indian-attack-sicilian-variation",
    name: "King",
    eco: "A08",
    variations: [

    ],
  },

  {
    id: "a08-zukertort-opening-reversed-gr-nfeld",
    name: "Zukertort Opening: Reversed Grünfeld",
    eco: "A08",
    variations: [

    ],
  },

  {
    id: "a09-r-ti-opening",
    name: "Réti Opening",
    eco: "A09",
    variations: [

    ],
  },

  {
    id: "a09-r-ti-opening-advance-variation",
    name: "Réti Opening: Advance Variation",
    eco: "A09",
    variations: [

    ],
  },

  {
    id: "a09-r-ti-opening-advance-variation-michel-gambit",
    name: "Réti Opening: Advance Variation, Michel Gambit",
    eco: "A09",
    variations: [

    ],
  },

  {
    id: "a09-r-ti-opening-advance-variation-navara-gambit",
    name: "Réti Opening: Advance Variation, Navara Gambit",
    eco: "A09",
    variations: [

    ],
  },

  {
    id: "a09-r-ti-opening-penguin-variation",
    name: "Réti Opening: Penguin Variation",
    eco: "A09",
    variations: [

    ],
  },

  {
    id: "a09-r-ti-opening-reversed-blumenfeld-gambit",
    name: "Réti Opening: Reversed Blumenfeld Gambit",
    eco: "A09",
    variations: [

    ],
  },

  {
    id: "a09-r-ti-opening-r-ti-accepted",
    name: "Réti Opening: Réti Accepted",
    eco: "A09",
    variations: [

    ],
  },

  {
    id: "a09-r-ti-opening-r-ti-gambit-keres-variation",
    name: "Réti Opening: Réti Gambit, Keres Variation",
    eco: "A09",
    variations: [

    ],
  },

  {
    id: "a09-r-ti-opening-zilbermints-gambit",
    name: "Réti Opening: Zilbermints Gambit",
    eco: "A09",
    variations: [

    ],
  },

  {
    id: "a10-english-opening",
    name: "English Opening",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-achilles-omega-gambit",
    name: "English Opening: Achilles-Omega Gambit",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-adorjan-defense",
    name: "English Opening: Adorjan Defense",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-anglo-dutch-defense",
    name: "English Opening: Anglo-Dutch Defense",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-anglo-dutch-defense-hickmann-gambit",
    name: "English Opening: Anglo-Dutch Defense, Hickmann Gambit",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-anglo-dutch-variation-chabanon-gambit",
    name: "English Opening: Anglo-Dutch Variation, Chabanon Gambit",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-anglo-dutch-variation-ferenc-gambit",
    name: "English Opening: Anglo-Dutch Variation, Ferenc Gambit",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-anglo-lithuanian-variation",
    name: "English Opening: Anglo-Lithuanian Variation",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-anglo-scandinavian-defense",
    name: "English Opening: Anglo-Scandinavian Defense",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-anglo-scandinavian-defense-l-hn-gambit",
    name: "English Opening: Anglo-Scandinavian Defense, Löhn Gambit",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-anglo-scandinavian-defense-malvinas-variation",
    name: "English Opening: Anglo-Scandinavian Defense, Malvinas Variation",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-anglo-scandinavian-defense-schulz-gambit",
    name: "English Opening: Anglo-Scandinavian Defense, Schulz Gambit",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-great-snake-variation",
    name: "English Opening: Great Snake Variation",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-jaenisch-gambit",
    name: "English Opening: Jaenisch Gambit",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-king-s-english-variation-botvinnik-system-prickly-pawn-pass-system",
    name: "English Opening: King\'s English Variation",

    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-myers-defense",
    name: "English Opening: Myers Defense",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-myers-gambit",
    name: "English Opening: Myers Gambit",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-porcupine-variation",
    name: "English Opening: Porcupine Variation",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-wade-gambit",
    name: "English Opening: Wade Gambit",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a10-english-opening-zilbermints-gambit",
    name: "English Opening: Zilbermints Gambit",
    eco: "A10",
    variations: [

    ],
  },

  {
    id: "a11-english-opening-caro-kann-defensive-system",
    name: "English Opening: Caro-Kann Defensive System",
    eco: "A11",
    variations: [

    ],
  },

  {
    id: "a11-r-ti-opening-anglo-slav-variation-gurevich-system",
    name: "Réti Opening: Anglo-Slav Variation, Gurevich System",
    eco: "A11",
    variations: [

    ],
  },

  {
    id: "a11-r-ti-opening-anglo-slav-variation-with-g3",
    name: "Réti Opening: Anglo-Slav Variation, with g3",
    eco: "A11",
    variations: [

    ],
  },

  {
    id: "a12-r-ti-opening-anglo-slav-variation",
    name: "Réti Opening: Anglo-Slav Variation",
    eco: "A12",
    variations: [

    ],
  },

  {
    id: "a12-r-ti-opening-anglo-slav-variation-bled-variation",
    name: "Réti Opening: Anglo-Slav Variation, Bled Variation",
    eco: "A12",
    variations: [

    ],
  },

  {
    id: "a12-r-ti-opening-anglo-slav-variation-bogoljubow-variation",
    name: "Réti Opening: Anglo-Slav Variation, Bogoljubow Variation",
    eco: "A12",
    variations: [

    ],
  },

  {
    id: "a12-r-ti-opening-anglo-slav-variation-capablanca-variation",
    name: "Réti Opening: Anglo-Slav Variation, Capablanca Variation",
    eco: "A12",
    variations: [

    ],
  },

  {
    id: "a12-r-ti-opening-anglo-slav-variation-london-defensive-system",
    name: "Réti Opening: Anglo-Slav Variation, London Defensive System",
    eco: "A12",
    variations: [

    ],
  },

  {
    id: "a12-r-ti-opening-anglo-slav-variation-new-york-system",
    name: "Réti Opening: Anglo-Slav Variation, New York System",
    eco: "A12",
    variations: [

    ],
  },

  {
    id: "a12-r-ti-opening-anglo-slav-variation-torre-system",
    name: "Réti Opening: Anglo-Slav Variation, Torre System",
    eco: "A12",
    variations: [

    ],
  },

  {
    id: "a12-r-ti-opening-anglo-slav-variation-with-dxc4",
    name: "Réti Opening: Anglo-Slav Variation, with dxc4",
    eco: "A12",
    variations: [

    ],
  },

  {
    id: "a13-english-opening-agincourt-defense",
    name: "English Opening: Agincourt Defense",
    eco: "A13",
    variations: [

    ],
  },

  {
    id: "a13-english-opening-agincourt-defense-bogoljubow-defense",
    name: "English Opening: Agincourt Defense, Bogoljubow Defense",
    eco: "A13",
    variations: [

    ],
  },

  {
    id: "a13-english-opening-agincourt-defense-catalan-defense",
    name: "English Opening: Agincourt Defense, Catalan Defense",
    eco: "A13",
    variations: [

    ],
  },

  {
    id: "a13-english-opening-agincourt-defense-catalan-defense-accepted",
    name: "English Opening: Agincourt Defense, Catalan Defense Accepted",
    eco: "A13",
    variations: [

    ],
  },

  {
    id: "a13-english-opening-agincourt-defense-catalan-defense-semi-slav-defense",
    name: "English Opening: Agincourt Defense, Catalan Defense, Semi-Slav Defense",
    eco: "A13",
    variations: [

    ],
  },

  {
    id: "a13-english-opening-agincourt-defense-kurajica-defense",
    name: "English Opening: Agincourt Defense, Kurajica Defense",
    eco: "A13",
    variations: [

    ],
  },

  {
    id: "a13-english-opening-agincourt-defense-tarrasch-defense",
    name: "English Opening: Agincourt Defense, Tarrasch Defense",
    eco: "A13",
    variations: [

    ],
  },

  {
    id: "a13-english-opening-agincourt-defense-wimpy-system",
    name: "English Opening: Agincourt Defense, Wimpy System",
    eco: "A13",
    variations: [

    ],
  },

  {
    id: "a13-english-opening-neo-catalan",
    name: "English Opening: Neo-Catalan",
    eco: "A13",
    variations: [

    ],
  },

  {
    id: "a13-english-opening-neo-catalan-declined",
    name: "English Opening: Neo-Catalan Declined",
    eco: "A13",
    variations: [

    ],
  },

  {
    id: "a13-english-opening-romanishin-gambit",
    name: "English Opening: Romanishin Gambit",
    eco: "A13",
    variations: [

    ],
  },

  {
    id: "a14-english-opening-agincourt-defense-keres-defense",
    name: "English Opening: Agincourt Defense, Keres Defense",
    eco: "A14",
    variations: [

    ],
  },

  {
    id: "a14-english-opening-agincourt-defense-neo-catalan-declined",
    name: "English Opening: Agincourt Defense, Neo-Catalan Declined",
    eco: "A14",
    variations: [

    ],
  },

  {
    id: "a14-english-opening-agincourt-defense-neo-catalan-declined-early-b3",
    name: "English Opening: Agincourt Defense, Neo-Catalan Declined, Early b3",
    eco: "A14",
    variations: [

    ],
  },

  {
    id: "a14-r-ti-opening-anglo-slav-variation",
    name: "Réti Opening: Anglo-Slav Variation",
    eco: "A14",
    variations: [

    ],
  },

  {
    id: "a14-r-ti-opening-anglo-slav-variation-bogoljubow-variation-stonewall-line",
    name: "Réti Opening: Anglo-Slav Variation, Bogoljubow Variation, Stonewall Line",
    eco: "A14",
    variations: [

    ],
  },

  {
    id: "a15-english-opening-anglo-indian-defense",
    name: "English Opening: Anglo-Indian Defense",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a15-english-opening-anglo-indian-defense-anti-anti-gr-nfeld",
    name: "English Opening: Anglo-Indian Defense, Anti-Anti-Grünfeld",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a15-english-opening-anglo-indian-defense-gr-nfeld-formation",
    name: "English Opening: Anglo-Indian Defense, Grünfeld Formation",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a15-english-opening-anglo-indian-defense-king-s-indian-formation",
    name: "English Opening: Anglo-Indian Defense, King",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a15-english-opening-anglo-indian-defense-king-s-indian-formation-double-fianchetto",
    name: "English Opening: Anglo-Indian Defense, King",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a15-english-opening-anglo-indian-defense-king-s-knight-variation",
    name: "English Opening: Anglo-Indian Defense, King",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a15-english-opening-anglo-indian-defense-old-indian-formation",
    name: "English Opening: Anglo-Indian Defense, Old Indian Formation",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a15-english-opening-anglo-indian-defense-queen-s-indian-formation",
    name: "English Opening: Anglo-Indian Defense, Queen",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a15-english-opening-anglo-indian-defense-romanishin-variation",
    name: "English Opening: Anglo-Indian Defense, Romanishin Variation",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a15-english-opening-anglo-indian-defense-scandinavian-defense",
    name: "English Opening: Anglo-Indian Defense, Scandinavian Defense",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a15-english-opening-anglo-indian-defense-scandinavian-defense-exchange-variation",
    name: "English Opening: Anglo-Indian Defense, Scandinavian Defense, Exchange Variation",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a15-english-opening-anglo-indian-defense-slav-formation",
    name: "English Opening: Anglo-Indian Defense, Slav Formation",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a15-english-orangutan",
    name: "English Orangutan",
    eco: "A15",
    variations: [

    ],
  },

  {
    id: "a16-english-opening-anglo-gr-nfeld-defense",
    name: "English Opening: Anglo-Grünfeld Defense",
    eco: "A16",
    variations: [

    ],
  },

  {
    id: "a16-english-opening-anglo-gr-nfeld-defense-korchnoi-variation",
    name: "English Opening: Anglo-Grünfeld Defense, Korchnoi Variation",
    eco: "A16",
    variations: [

    ],
  },

  {
    id: "a16-english-opening-anglo-indian-defense-anglo-gr-nfeld-variation",
    name: "English Opening: Anglo-Indian Defense, Anglo-Grünfeld Variation",
    eco: "A16",
    variations: [

    ],
  },

  {
    id: "a16-english-opening-anglo-indian-defense-queen-s-knight-variation",
    name: "English Opening: Anglo-Indian Defense, Queen",
    eco: "A16",
    variations: [

    ],
  },

  {
    id: "a17-english-opening-anglo-indian-defense",
    name: "English Opening: Anglo-Indian Defense",
    eco: "A17",
    variations: [

    ],
  },

  {
    id: "a17-english-opening-anglo-indian-defense-hedgehog-system",
    name: "English Opening: Anglo-Indian Defense, Hedgehog System",
    eco: "A17",
    variations: [

    ],
  },

  {
    id: "a17-english-opening-anglo-indian-defense-nimzo-english",
    name: "English Opening: Anglo-Indian Defense, Nimzo-English",
    eco: "A17",
    variations: [

    ],
  },

  {
    id: "a17-english-opening-anglo-indian-defense-queen-s-indian-formation",
    name: "English Opening: Anglo-Indian Defense, Queen",
    eco: "A17",
    variations: [

    ],
  },

  {
    id: "a17-english-opening-anglo-indian-defense-queen-s-indian-variation",
    name: "English Opening: Anglo-Indian Defense, Queen",
    eco: "A17",
    variations: [

    ],
  },

  {
    id: "a17-english-opening-anglo-indian-defense-zvjaginsev-krasenkow-attack",
    name: "English Opening: Anglo-Indian Defense, Zvjaginsev-Krasenkow Attack",
    eco: "A17",
    variations: [

    ],
  },

  {
    id: "a18-english-opening-mikenas-carls-variation",
    name: "English Opening: Mikenas-Carls Variation",
    eco: "A18",
    variations: [

    ],
  },

  {
    id: "a19-english-opening-anglo-indian-defense-flohr-mikenas-carls-variation-nei-gambit",
    name: "English Opening: Anglo-Indian Defense, Flohr-Mikenas-Carls Variation, Nei Gambit",
    eco: "A19",
    variations: [

    ],
  },

  {
    id: "a19-english-opening-mikenas-carls-sicilian",
    name: "English Opening: Mikenas-Carls, Sicilian",
    eco: "A19",
    variations: [

    ],
  },

  {
    id: "a20-english-opening-drill-variation",
    name: "English Opening: Drill Variation",
    eco: "A20",
    variations: [

    ],
  },

  {
    id: "a20-english-opening-king-s-english-variation",
    name: "English Opening: King\'s English Variation",

    eco: "A20",
    variations: [

    ],
  },

  {
    id: "a20-english-opening-king-s-english-variation-kahiko-hula-gambit",
    name: "English Opening: King\'s English Variation",

    eco: "A20",
    variations: [

    ],
  },

  {
    id: "a20-english-opening-king-s-english-variation-nimzowitsch-variation",
    name: "English Opening: King\'s English Variation",

    eco: "A20",
    variations: [

    ],
  },

  {
    id: "a20-english-opening-king-s-english-variation-nimzowitsch-flohr-variation",
    name: "English Opening: King\'s English Variation",

    eco: "A20",
    variations: [

    ],
  },

  {
    id: "a21-english-opening-king-s-english-variation",
    name: "English Opening: King\'s English Variation",

    eco: "A21",
    variations: [

    ],
  },

  {
    id: "a21-english-opening-king-s-english-variation-keres-defense",
    name: "English Opening: King\'s English Variation",

    eco: "A21",
    variations: [

    ],
  },

  {
    id: "a21-english-opening-king-s-english-variation-kramnik-shirov-counterattack",
    name: "English Opening: King\'s English Variation",

    eco: "A21",
    variations: [

    ],
  },

  {
    id: "a21-english-opening-king-s-english-variation-reversed-sicilian",
    name: "English Opening: King\'s English Variation",

    eco: "A21",
    variations: [

    ],
  },

  {
    id: "a21-english-opening-king-s-english-variation-smyslov-defense",
    name: "English Opening: King\'s English Variation",

    eco: "A21",
    variations: [

    ],
  },

  {
    id: "a21-english-opening-king-s-english-variation-troger-defense",
    name: "English Opening: King\'s English Variation",

    eco: "A21",
    variations: [

    ],
  },

  

  {
    id: "a22-english-opening-carls-bremen-system",
    name: "English Opening: Carls-Bremen System",
    eco: "A22",
    variations: [

    ],
  },

  {
    id: "a22-english-opening-king-s-english-variation-adhiban-gambit",
    name: "English Opening: King\'s English Variation",

    eco: "A22",
    variations: [

    ],
  },

  {
    id: "a22-english-opening-king-s-english-variation-bellon-gambit",
    name: "English Opening: King\'s English Variation",

    eco: "A22",
    variations: [

    ],
  },

  {
    id: "a22-english-opening-king-s-english-variation-two-knights-variation",
    name: "English Opening: King\'s English Variation",

    eco: "A22",
    variations: [

    ],
  },

  {
    id: "a22-english-opening-king-s-english-variation-two-knights-variation-reversed-dragon",
    name: "English Opening: King\'s English Variation",

    eco: "A22",
    variations: [

    ],
  },

  {
    id: "a22-english-opening-king-s-english-variation-two-knights-variation-smyslov-system",
    name: "English Opening: King\'s English Variation",

    eco: "A22",
    variations: [

    ],
  },

  {
    id: "a22-english-opening-king-s-english-erbenheimer-gambit",
    name: "English Opening: King\'s English Variation",

    eco: "A22",
    variations: [

    ],
  },

  {
    id: "a22-english-opening-king-s-english-mazedonisch",
    name: "English Opening: King\'s English Variation",

    eco: "A22",
    variations: [

    ],
  },

  {
    id: "a23-english-opening-king-s-english-variation-two-knights-variation-keres-variation",
    name: "English Opening: King\'s English Variation",

    eco: "A23",
    variations: [

    ],
  },

  {
    id: "a24-english-opening-king-s-english-variation-two-knights-variation-fianchetto-line",
    name: "English Opening: King\'s English Variation",

    eco: "A24",
    variations: [

    ],
  },

  {
    id: "a25-english-opening-closed-taimanov-variation",
    name: "English Opening: Closed, Taimanov Variation",
    eco: "A25",
    variations: [

    ],
  },

  {
    id: "a25-english-opening-king-s-english-variation-bremen-hort-variation",
    name: "English Opening: King\'s English Variation",

    eco: "A25",
    variations: [

    ],
  },

  {
    id: "a25-english-opening-king-s-english-variation-closed-system",
    name: "English Opening: King\'s English Variation",

    eco: "A25",
    variations: [

    ],
  },

  {
    id: "a25-english-opening-king-s-english-variation-hungarian-attack",
    name: "English Opening: King\'s English Variation",

    eco: "A25",
    variations: [

    ],
  },

  {
    id: "a25-english-opening-king-s-english-variation-reversed-closed-sicilian",
    name: "English Opening: King\'s English Variation",

    eco: "A25",
    variations: [

    ],
  },

  {
    id: "a25-english-opening-king-s-english-variation-taimanov-variation",
    name: "English Opening: King\'s English Variation",

    eco: "A25",
    variations: [

    ],
  },

  {
    id: "a26-english-opening-king-s-english-variation-botvinnik-system",
    name: "English Opening: King\'s English Variation",

    eco: "A26",
    variations: [

    ],
  },

  {
    id: "a26-english-opening-king-s-english-variation-closed-system-full-symmetry",
    name: "English Opening: King\'s English Variation",

    eco: "A26",
    variations: [

    ],
  },

  {
    id: "a27-english-opening-king-s-english-variation-three-knights-system",
    name: "English Opening: King\'s English Variation",

    eco: "A27",
    variations: [

    ],
  },

  {
    id: "english-dragon",
    name: "English Opening: Dragon Variation",
    eco: "A28",
    variations: [

    ],
  },

  {
    id: "a28-english-opening-four-knights-system-nimzowitsch-variation",
    name: "English Opening: Four Knights System, Nimzowitsch Variation",
    eco: "A28",
    variations: [

    ],
  },

  {
    id: "english-four-knights",
    name: "English Opening: Four Knights Variation",
    eco: "A28",
    variations: [

    ],
  },

  {
    id: "a28-english-opening-king-s-english-variation-four-knights-variation",
    name: "English Opening: King\'s English Variation",

    eco: "A28",
    variations: [

    ],
  },

  {
    id: "a28-english-opening-king-s-english-variation-four-knights-variation-bradley-beach-variation",
    name: "English Opening: King\'s English Variation",

    eco: "A28",
    variations: [

    ],
  },

  {
    id: "a28-english-opening-king-s-english-variation-four-knights-variation-flexible-line",
    name: "English Opening: King\'s English Variation",

    eco: "A28",
    variations: [

    ],
  },

  {
    id: "a28-english-opening-king-s-english-variation-four-knights-variation-korchnoi-line",
    name: "English Opening: King\'s English Variation",

    eco: "A28",
    variations: [

    ],
  },

  {
    id: "a28-english-opening-king-s-english-variation-four-knights-variation-quiet-line",
    name: "English Opening: King\'s English Variation",

    eco: "A28",
    variations: [

    ],
  },

  {
    id: "a29-english-opening-king-s-english-variation-four-knights-variation-fianchetto-line",
    name: "English Opening: King\'s English Variation",

    eco: "A29",
    variations: [

    ],
  },

  {
    id: "a29-english-opening-king-s-english-variation-four-knights-variation-fianchetto-line-delayed-nc6",
    name: "English Opening: King\'s English Variation",

    eco: "A29",
    variations: [

    ],
  },

  {
    id: "a29-english-opening-king-s-english-variation-four-knights-variation-fianchetto-line-with-d6",
    name: "English Opening: King\'s English Variation",

    eco: "A29",
    variations: [

    ],
  },

  {
    id: "a29-english-opening-king-s-english-variation-four-knights-variation-fianchetto-line-with-d6-be7",
    name: "English Opening: King\'s English Variation",

    eco: "A29",
    variations: [

    ],
  },

  {
    id: "a29-english-opening-king-s-english-variation-four-knights-variation-fianchetto-line-with-d6-a6",
    name: "English Opening: King\'s English Variation",

    eco: "A29",
    variations: [

    ],
  },

  {
    id: "a29-english-opening-king-s-english-variation-four-knights-variation-fianchetto-line-with-d6-h6",
    name: "English Opening: King\'s English Variation",

    eco: "A29",
    variations: [

    ],
  },

  {
    id: "a29-english-opening-king-s-english-variation-four-knights-variation-fianchetto-line-with-bc5",
    name: "English Opening: King\'s English Variation",

    eco: "A29",
    variations: [

    ],
  },

  {
    id: "a29-english-opening-king-s-english-variation-four-knights-variation-fianchetto-line-with-nb6",
    name: "English Opening: King\'s English Variation",

    eco: "A29",
    variations: [

    ],
  },

  {
    id: "a30-english-opening-symmetrical-variation",
    name: "English Opening: Symmetrical Variation",
    eco: "A30",
    variations: [

    ],
  },

  {
    id: "a30-english-opening-symmetrical-variation-hedgehog-defense",
    name: "English Opening: Symmetrical Variation, Hedgehog Defense",
    eco: "A30",
    variations: [

    ],
  },

  {
    id: "a30-english-opening-symmetrical-variation-napolitano-gambit",
    name: "English Opening: Symmetrical Variation, Napolitano Gambit",
    eco: "A30",
    variations: [

    ],
  },

  {
    id: "a30-english-opening-symmetrical-hedgehog-flexible-formation",
    name: "English Opening: Symmetrical, Hedgehog, Flexible Formation",
    eco: "A30",
    variations: [

    ],
  },

  {
    id: "a30-english-opening-wing-gambit",
    name: "English Opening: Wing Gambit",
    eco: "A30",
    variations: [

    ],
  },

  {
    id: "a31-english-opening-symmetrical-variation-anti-benoni-variation",
    name: "English Opening: Symmetrical Variation, Anti-Benoni Variation",
    eco: "A31",
    variations: [

    ],
  },

  {
    id: "a31-english-opening-symmetrical-variation-anti-benoni-variation-kasparov-vaganian-gambit",
    name: "English Opening: Symmetrical Variation, Anti-Benoni Variation, Kasparov-Vaganian Gambit",
    eco: "A31",
    variations: [

    ],
  },

  {
    id: "a32-english-opening-symmetrical-variation-anti-benoni-variation-spielmann-defense",
    name: "English Opening: Symmetrical Variation, Anti-Benoni Variation, Spielmann Defense",
    eco: "A32",
    variations: [

    ],
  },

  {
    id: "a33-english-opening-symmetrical-variation-anti-benoni-variation-geller-variation",
    name: "English Opening: Symmetrical Variation, Anti-Benoni Variation, Geller Variation",
    eco: "A33",
    variations: [

    ],
  },

  {
    id: "a33-english-opening-symmetrical-variation-anti-benoni-variation-spielmann-defense",
    name: "English Opening: Symmetrical Variation, Anti-Benoni Variation, Spielmann Defense",
    eco: "A33",
    variations: [

    ],
  },

  {
    id: "a34-english-opening-symmetrical-variation",
    name: "English Opening: Symmetrical Variation",
    eco: "A34",
    variations: [

    ],
  },

  {
    id: "a34-english-opening-symmetrical-variation-fianchetto-variation",
    name: "English Opening: Symmetrical Variation, Fianchetto Variation",
    eco: "A34",
    variations: [

    ],
  },

  {
    id: "a34-english-opening-symmetrical-variation-normal-variation",
    name: "English Opening: Symmetrical Variation, Normal Variation",
    eco: "A34",
    variations: [

    ],
  },

  {
    id: "a34-english-opening-symmetrical-variation-rubinstein-variation",
    name: "English Opening: Symmetrical Variation, Rubinstein Variation",
    eco: "A34",
    variations: [

    ],
  },

  {
    id: "a34-english-opening-symmetrical-variation-three-knights-variation",
    name: "English Opening: Symmetrical Variation, Three Knights Variation",
    eco: "A34",
    variations: [

    ],
  },

  {
    id: "a35-english-opening-symmetrical-variation",
    name: "English Opening: Symmetrical Variation",
    eco: "A35",
    variations: [

    ],
  },

  {
    id: "a35-english-opening-symmetrical-variation-four-knights-variation",
    name: "English Opening: Symmetrical Variation, Four Knights Variation",
    eco: "A35",
    variations: [

    ],
  },

  {
    id: "a35-english-opening-symmetrical-variation-four-knights-variation-keres-parma-system",
    name: "English Opening: Symmetrical Variation, Four Knights Variation, Keres-Parma System",
    eco: "A35",
    variations: [

    ],
  },

  {
    id: "a35-english-opening-symmetrical-variation-two-knights-variation",
    name: "English Opening: Symmetrical Variation, Two Knights Variation",
    eco: "A35",
    variations: [

    ],
  },

  {
    id: "a36-english-opening-symmetrical-variation-botvinnik-system",
    name: "English Opening: Symmetrical Variation, Botvinnik System",
    eco: "A36",
    variations: [

    ],
  },

  {
    id: "a36-english-opening-symmetrical-variation-botvinnik-system-reversed-with-e3",
    name: "English Opening: Symmetrical Variation, Botvinnik System Reversed, with e3",
    eco: "A36",
    variations: [

    ],
  },

  {
    id: "a36-english-opening-symmetrical-variation-two-knights-fianchetto-variation",
    name: "English Opening: Symmetrical Variation, Two Knights, Fianchetto Variation",
    eco: "A36",
    variations: [

    ],
  },

  {
    id: "a36-english-opening-symmetrical-variation-ultra-symmetrical-variation",
    name: "English Opening: Symmetrical Variation, Ultra-Symmetrical Variation",
    eco: "A36",
    variations: [

    ],
  },

  {
    id: "a37-english-opening-symmetrical-variation-botvinnik-system-reversed-with-nf3",
    name: "English Opening: Symmetrical Variation, Botvinnik System Reversed, with Nf3",
    eco: "A37",
    variations: [

    ],
  },

  {
    id: "a37-english-opening-symmetrical-variation-three-knights-fianchetto-variation",
    name: "English Opening: Symmetrical Variation, Three Knights, Fianchetto Variation",
    eco: "A37",
    variations: [

    ],
  },

  {
    id: "a38-english-opening-symmetrical-variation-double-fianchetto",
    name: "English Opening: Symmetrical Variation, Double Fianchetto",
    eco: "A38",
    variations: [

    ],
  },

  {
    id: "a38-english-opening-symmetrical-variation-duchamp-variation",
    name: "English Opening: Symmetrical Variation, Duchamp Variation",
    eco: "A38",
    variations: [

    ],
  },

  {
    id: "a38-english-opening-symmetrical-variation-full-symmetry-line",
    name: "English Opening: Symmetrical Variation, Full Symmetry Line",
    eco: "A38",
    variations: [

    ],
  },

  {
    id: "a39-english-opening-symmetrical-variation-mecking-variation",
    name: "English Opening: Symmetrical Variation, Mecking Variation",
    eco: "A39",
    variations: [

    ],
  },

  {
    id: "a40-australian-defense",
    name: "Australian Defense",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-benoni-defense-franco-sicilian-hybrid",
    name: "Benoni Defense: Franco-Sicilian Hybrid",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-borg-defense-borg-gambit",
    name: "Borg Defense: Borg Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-colle-system-pterodactyl-variation",
    name: "Colle System: Pterodactyl Variation",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-colle-system-siroccopteryx-variation",
    name: "Colle System: Siroccopteryx Variation",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-english-defense",
    name: "English Defense",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-english-defense-eastbourne-gambit",
    name: "English Defense: Eastbourne Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-english-defense-hartlaub-gambit-accepted",
    name: "English Defense: Hartlaub Gambit Accepted",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-english-defense-hartlaub-gambit-declined",
    name: "English Defense: Hartlaub Gambit Declined",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-english-defense-perrin-variation",
    name: "English Defense: Perrin Variation",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-english-defense-poli-gambit",
    name: "English Defense: Poli Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit",
    name: "Englund Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-declined",
    name: "Englund Gambit Declined",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-declined-diemer-counterattack",
    name: "Englund Gambit Declined: Diemer Counterattack",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-declined-reversed-alekhine",
    name: "Englund Gambit Declined: Reversed Alekhine",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-declined-reversed-brooklyn",
    name: "Englund Gambit Declined: Reversed Brooklyn",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-declined-reversed-french",
    name: "Englund Gambit Declined: Reversed French",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-declined-reversed-krebs",
    name: "Englund Gambit Declined: Reversed Krebs",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-declined-reversed-mokele-mbembe",
    name: "Englund Gambit Declined: Reversed Mokele Mbembe",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-felbecker-gambit",
    name: "Englund Gambit: Felbecker Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-hartlaub-charlick-gambit",
    name: "Englund Gambit: Hartlaub-Charlick Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-main-line",
    name: "Englund Gambit: Main Line",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-mosquito-gambit",
    name: "Englund Gambit: Mosquito Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-soller-gambit",
    name: "Englund Gambit: Soller Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-soller-gambit-deferred",
    name: "Englund Gambit: Soller Gambit Deferred",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-stockholm-variation",
    name: "Englund Gambit: Stockholm Variation",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-englund-gambit-zilbermints-gambit",
    name: "Englund Gambit: Zilbermints Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-horwitz-defense",
    name: "Horwitz Defense",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-horwitz-defense-zilbermints-gambit",
    name: "Horwitz Defense: Zilbermints Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-kangaroo-defense",
    name: "Kangaroo Defense",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-kangaroo-defense-keres-defense-transpositional-variation",
    name: "Kangaroo Defense: Keres Defense, Transpositional Variation",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-mikenas-defense",
    name: "Mikenas Defense",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-mikenas-defense-cannstatter-variation",
    name: "Mikenas Defense: Cannstatter Variation",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-mikenas-defense-lithuanian-variation",
    name: "Mikenas Defense: Lithuanian Variation",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-mikenas-defense-pozarek-gambit",
    name: "Mikenas Defense: Pozarek Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-modern-defense-beefeater-variation",
    name: "Modern Defense: Beefeater Variation",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-modern-defense-lizard-defense-pirc-diemer-gambit",
    name: "Modern Defense: Lizard Defense, Pirc-Diemer Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-montevideo-defense",
    name: "Montevideo Defense",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-polish-defense",
    name: "Polish Defense",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-polish-defense-spassky-gambit-accepted",
    name: "Polish Defense: Spassky Gambit Accepted",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-pterodactyl-defense-central-benoni-beefeater-pterodactyl",
    name: "Pterodactyl Defense: Central, Benoni Beefeater Pterodactyl",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-pterodactyl-defense-central-benoni-pterodactyl",
    name: "Pterodactyl Defense: Central, Benoni Pterodactyl",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-pterodactyl-defense-fianchetto-queen-benoni-pterodactyl",
    name: "Pterodactyl Defense: Fianchetto, Queen Benoni Pterodactyl",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-pterodactyl-defense-fianchetto-queen-pteranodon",
    name: "Pterodactyl Defense: Fianchetto, Queen Pteranodon",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-pterodactyl-defense-fianchetto-queen-pterodactyl",
    name: "Pterodactyl Defense: Fianchetto, Queen Pterodactyl",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-pterodactyl-defense-queen-pterodactyl-quiet-line",
    name: "Pterodactyl Defense: Queen Pterodactyl, Quiet Line",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-queen-s-pawn-game",
    name: "Queen",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-queen-s-pawn-game-anglo-slav-opening",
    name: "Queen",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-queen-s-pawn-game-modern-defense",
    name: "Queen",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-slav-indian-kudischewitsch-gambit",
    name: "Slav Indian: Kudischewitsch Gambit",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a40-zaire-defense",
    name: "Zaire Defense",
    eco: "A40",
    variations: [

    ],
  },

  {
    id: "a41-modern-defense",
    name: "Modern Defense",
    eco: "A41",
    variations: [

    ],
  },

  {
    id: "a41-modern-defense-neo-modern-defense",
    name: "Modern Defense: Neo-Modern Defense",
    eco: "A41",
    variations: [

    ],
  },

  {
    id: "a41-old-indian-defense",
    name: "Old Indian Defense",
    eco: "A41",
    variations: [

    ],
  },

  {
    id: "a41-queen-s-pawn-game",
    name: "Queen",
    eco: "A41",
    variations: [

    ],
  },

  {
    id: "a41-queen-s-pawn-game-rossolimo-variation",
    name: "Queen",
    eco: "A41",
    variations: [

    ],
  },

  {
    id: "a41-rat-defense-english-rat",
    name: "Rat Defense: English Rat",
    eco: "A41",
    variations: [

    ],
  },

  {
    id: "a41-rat-defense-english-rat-lisbon-gambit",
    name: "Rat Defense: English Rat, Lisbon Gambit",
    eco: "A41",
    variations: [

    ],
  },

  {
    id: "a41-rat-defense-english-rat-pounds-gambit",
    name: "Rat Defense: English Rat, Pounds Gambit",
    eco: "A41",
    variations: [

    ],
  },

  {
    id: "a41-robatsch-defense-rossolimo-variation",
    name: "Robatsch Defense: Rossolimo Variation",
    eco: "A41",
    variations: [

    ],
  },

  {
    id: "a41-wade-defense",
    name: "Wade Defense",
    eco: "A41",
    variations: [

    ],
  },

  {
    id: "a41-zukertort-opening-wade-defense-chigorin-plan",
    name: "Zukertort Opening: Wade Defense, Chigorin Plan",
    eco: "A41",
    variations: [

    ],
  },

  {
    id: "a42-modern-defense-averbakh-system",
    name: "Modern Defense: Averbakh System",
    eco: "A42",
    variations: [

    ],
  },

  {
    id: "a42-modern-defense-averbakh-variation-pseudo-s-misch",
    name: "Modern Defense: Averbakh Variation, Pseudo-Sämisch",
    eco: "A42",
    variations: [

    ],
  },

  {
    id: "a42-modern-defense-kotov-variation",
    name: "Modern Defense: Kotov Variation",
    eco: "A42",
    variations: [

    ],
  },

  {
    id: "a42-modern-defense-randspringer-variation",
    name: "Modern Defense: Randspringer Variation",
    eco: "A42",
    variations: [

    ],
  },

  {
    id: "a42-pterodactyl-defense",
    name: "Pterodactyl Defense",
    eco: "A42",
    variations: [

    ],
  },

  {
    id: "a42-pterodactyl-defense-central-bogolubovia",
    name: "Pterodactyl Defense: Central, Bogolubovia",
    eco: "A42",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-benoni-gambit-accepted",
    name: "Benoni Defense: Benoni Gambit Accepted",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-benoni-gambit-schlenker-defense",
    name: "Benoni Defense: Benoni Gambit, Schlenker Defense",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-benoni-indian-defense",
    name: "Benoni Defense: Benoni-Indian Defense",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-benoni-indian-defense-kingside-move-order",
    name: "Benoni Defense: Benoni-Indian Defense, Kingside Move Order",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-benoni-staunton-gambit",
    name: "Benoni Defense: Benoni-Staunton Gambit",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-cormorant-gambit",
    name: "Benoni Defense: Cormorant Gambit",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-french-benoni",
    name: "Benoni Defense: French Benoni",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-hawk-variation",
    name: "Benoni Defense: Hawk Variation",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-old-benoni",
    name: "Benoni Defense: Old Benoni",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-old-benoni-mujannah-formation",
    name: "Benoni Defense: Old Benoni, Mujannah Formation",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-old-benoni-schmid-variation",
    name: "Benoni Defense: Old Benoni, Schmid Variation",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-snail-variation",
    name: "Benoni Defense: Snail Variation",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-woozle",
    name: "Benoni Defense: Woozle",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-zilbermints-benoni-gambit",
    name: "Benoni Defense: Zilbermints-Benoni Gambit",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-benoni-defense-zilbermints-benoni-gambit-tamarkin-countergambit",
    name: "Benoni Defense: Zilbermints-Benoni Gambit, Tamarkin Countergambit",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-indian-defense-pseudo-benko",
    name: "Indian Defense: Pseudo-Benko",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a43-queen-s-pawn-game-liedmann-gambit",
    name: "Queen",
    eco: "A43",
    variations: [

    ],
  },

  {
    id: "a44-benoni-defense-old-benoni",
    name: "Benoni Defense: Old Benoni",
    eco: "A44",
    variations: [

    ],
  },

  {
    id: "a44-benoni-defense-semi-benoni",
    name: "Benoni Defense: Semi-Benoni",
    eco: "A44",
    variations: [

    ],
  },

  {
    id: "a45-amazon-attack-siberian-attack",
    name: "Amazon Attack: Siberian Attack",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-basque-opening",
    name: "Basque Opening",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-canard-opening",
    name: "Canard Opening",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense",
    name: "Indian Defense",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-accelerated-london-system",
    name: "Indian Defense: Accelerated London System",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-gedult-attack",
    name: "Indian Defense: Gedult Attack",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-gibbins-weidenhagen-gambit",
    name: "Indian Defense: Gibbins-Weidenhagen Gambit",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-gibbins-weidenhagen-gambit-accepted",
    name: "Indian Defense: Gibbins-Weidenhagen Gambit Accepted",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-gibbins-weidenhagen-gambit-maltese-falcon",
    name: "Indian Defense: Gibbins-Weidenhagen Gambit, Maltese Falcon",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-gibbins-weidenhagen-gambit-oshima-defense",
    name: "Indian Defense: Gibbins-Weidenhagen Gambit, Oshima Defense",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-gibbins-weidenhagen-gambit-stummer-gambit",
    name: "Indian Defense: Gibbins-Weidenhagen Gambit, Stummer Gambit",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-lazard-gambit",
    name: "Indian Defense: Lazard Gambit",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-maddigan-gambit",
    name: "Indian Defense: Maddigan Gambit",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-omega-gambit",
    name: "Indian Defense: Omega Gambit",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-omega-gambit-arafat-gambit",
    name: "Indian Defense: Omega Gambit, Arafat Gambit",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-paleface-attack-blackmar-diemer-gambit-deferred",
    name: "Indian Defense: Paleface Attack, Blackmar-Diemer Gambit Deferred",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-pawn-push-variation",
    name: "Indian Defense: Pawn Push Variation",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-reversed-chigorin-defense",
    name: "Indian Defense: Reversed Chigorin Defense",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-indian-defense-tartakower-attack",
    name: "Indian Defense: Tartakower Attack",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-paleface-attack",
    name: "Paleface Attack",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-queen-s-pawn-game-chigorin-variation",
    name: "Queen",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-queen-s-pawn-game-veresov-richter-attack",
    name: "Queen",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-trompowsky-attack",
    name: "Trompowsky Attack",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-trompowsky-attack-borg-variation",
    name: "Trompowsky Attack: Borg Variation",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-trompowsky-attack-classical-defense",
    name: "Trompowsky Attack: Classical Defense",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-trompowsky-attack-classical-defense-big-center-variation",
    name: "Trompowsky Attack: Classical Defense, Big Center Variation",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-trompowsky-attack-edge-variation",
    name: "Trompowsky Attack: Edge Variation",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-trompowsky-attack-edge-variation-hergert-gambit",
    name: "Trompowsky Attack: Edge Variation, Hergert Gambit",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-trompowsky-attack-poisoned-pawn-variation",
    name: "Trompowsky Attack: Poisoned Pawn Variation",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-trompowsky-attack-raptor-variation",
    name: "Trompowsky Attack: Raptor Variation",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a45-trompowsky-attack-raptor-variation-hergert-gambit",
    name: "Trompowsky Attack: Raptor Variation, Hergert Gambit",
    eco: "A45",
    variations: [

    ],
  },

  {
    id: "a46-d-ry-defense",
    name: "Döry Defense",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-indian-defense-czech-indian",
    name: "Indian Defense: Czech-Indian",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-indian-defense-knights-variation",
    name: "Indian Defense: Knights Variation",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-indian-defense-knights-variation-alburt-miles-variation",
    name: "Indian Defense: Knights Variation, Alburt-Miles Variation",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-indian-defense-london-system",
    name: "Indian Defense: London System",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-indian-defense-polish-variation",
    name: "Indian Defense: Polish Variation",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-indian-defense-spielmann-indian",
    name: "Indian Defense: Spielmann-Indian",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-indian-defense-wade-tartakower-defense",
    name: "Indian Defense: Wade-Tartakower Defense",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "london-system",
    name: "London System",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-queen-s-pawn-game-torre-attack-breyer-variation",
    name: "Queen",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-queen-s-pawn-game-veresov-attack-classical-defense",
    name: "Queen",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-torre-attack-classical-defense",
    name: "Torre Attack: Classical Defense",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-torre-attack-classical-defense-nimzowitsch-variation",
    name: "Torre Attack: Classical Defense, Nimzowitsch Variation",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-torre-attack-classical-defense-petrosian-gambit",
    name: "Torre Attack: Classical Defense, Petrosian Gambit",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-torre-attack-wagner-gambit",
    name: "Torre Attack: Wagner Gambit",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "veresov",
    name: "Veresov Attack",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "a46-yusupov-rubinstein-system",
    name: "Yusupov-Rubinstein System",
    eco: "A46",
    variations: [

    ],
  },

  {
    id: "colle-system",
    name: "Colle System",
    eco: "A47",
    variations: [

    ],
  },

  {
    id: "a47-indian-defense-schnepper-gambit",
    name: "Indian Defense: Schnepper Gambit",
    eco: "A47",
    variations: [

    ],
  },

  {
    id: "a47-marienbad-system",
    name: "Marienbad System",
    eco: "A47",
    variations: [

    ],
  },

  {
    id: "a47-marienbad-system-berg-variation",
    name: "Marienbad System: Berg Variation",
    eco: "A47",
    variations: [

    ],
  },

  {
    id: "a47-pseudo-queen-s-indian-defense",
    name: "Pseudo Queen",
    eco: "A47",
    variations: [

    ],
  },

  {
    id: "a48-east-indian-defense",
    name: "East Indian Defense",
    eco: "A48",
    variations: [

    ],
  },

  {
    id: "a48-indian-defense-colle-system-king-s-indian-variation",
    name: "Indian Defense: Colle System, King",
    eco: "A48",
    variations: [

    ],
  },

  {
    id: "a48-london-system",
    name: "London System",
    eco: "A48",
    variations: [

    ],
  },

  {
    id: "a48-london-system-with-bd3",
    name: "London System, with Bd3",
    eco: "A48",
    variations: [

    ],
  },

  {
    id: "a48-london-system-with-be2",
    name: "London System, with Be2",
    eco: "A48",
    variations: [

    ],
  },

  {
    id: "a48-queen-s-pawn-game-barry-attack",
    name: "Queen",
    eco: "A48",
    variations: [

    ],
  },

  {
    id: "a48-queen-s-pawn-game-barry-attack-gr-nfeld-variation",
    name: "Queen",
    eco: "A48",
    variations: [

    ],
  },

  {
    id: "a48-queen-s-pawn-game-barry-attack-tarzan-attack",
    name: "Queen",
    eco: "A48",
    variations: [

    ],
  },

  {
    id: "a48-queen-s-pawn-game-torre-attack-gr-nfeld-variation-main-line",
    name: "Queen",
    eco: "A48",
    variations: [

    ],
  },

  {
    id: "a48-torre-attack-fianchetto-defense",
    name: "Torre Attack: Fianchetto Defense",
    eco: "A48",
    variations: [

    ],
  },

  {
    id: "a48-torre-attack-fianchetto-defense-euwe-variation",
    name: "Torre Attack: Fianchetto Defense, Euwe Variation",
    eco: "A48",
    variations: [

    ],
  },

  {
    id: "a49-indian-defense-przepiorka-variation",
    name: "Indian Defense: Przepiorka Variation",
    eco: "A49",
    variations: [

    ],
  },

  {
    id: "a50-indian-defense-medusa-gambit",
    name: "Indian Defense: Medusa Gambit",
    eco: "A50",
    variations: [

    ],
  },

  {
    id: "a50-indian-defense-normal-variation",
    name: "Indian Defense: Normal Variation",
    eco: "A50",
    variations: [

    ],
  },

  {
    id: "a50-indian-defense-pyrenees-gambit",
    name: "Indian Defense: Pyrenees Gambit",
    eco: "A50",
    variations: [

    ],
  },

  {
    id: "a50-mexican-defense",
    name: "Mexican Defense",
    eco: "A50",
    variations: [

    ],
  },

  {
    id: "a50-mexican-defense-horsefly-gambit",
    name: "Mexican Defense: Horsefly Gambit",
    eco: "A50",
    variations: [

    ],
  },

  {
    id: "a50-queen-s-indian-accelerated",
    name: "Queen",
    eco: "A50",
    variations: [

    ],
  },

  {
    id: "a50-slav-indian",
    name: "Slav Indian",
    eco: "A50",
    variations: [

    ],
  },

  {
    id: "a51-indian-defense-budapest-gambit",
    name: "Indian Defense: Budapest Gambit",
    eco: "A51",
    variations: [

    ],
  },

  {
    id: "a51-indian-defense-budapest-gambit-accepted",
    name: "Indian Defense: Budapest Gambit Accepted",
    eco: "A51",
    variations: [

    ],
  },

  {
    id: "a51-indian-defense-budapest-gambit-accepted-fajarowicz-defense",
    name: "Indian Defense: Budapest Gambit Accepted, Fajarowicz Defense",
    eco: "A51",
    variations: [

    ],
  },

  {
    id: "a51-indian-defense-budapest-gambit-accepted-fajarowicz-defense-bonsdorf-variation",
    name: "Indian Defense: Budapest Gambit Accepted, Fajarowicz Defense, Bonsdorf Variation",
    eco: "A51",
    variations: [

    ],
  },

  {
    id: "a51-indian-defense-budapest-gambit-accepted-fajarowicz-defense-steiner-variation",
    name: "Indian Defense: Budapest Gambit Accepted, Fajarowicz Defense, Steiner Variation",
    eco: "A51",
    variations: [

    ],
  },

  {
    id: "budapest-gambit",
    name: "Budapest Gambit",
    eco: "A52",
    variations: [

    ],
  },

  {
    id: "a52-indian-defense-budapest-gambit-accepted-main-line",
    name: "Indian Defense: Budapest Gambit Accepted, Main Line",
    eco: "A52",
    variations: [

    ],
  },

  {
    id: "a52-indian-defense-budapest-gambit-accepted-main-line-adler-variation",
    name: "Indian Defense: Budapest Gambit Accepted, Main Line, Adler Variation",
    eco: "A52",
    variations: [

    ],
  },

  {
    id: "a52-indian-defense-budapest-gambit-accepted-main-line-alekhine-variation",
    name: "Indian Defense: Budapest Gambit Accepted, Main Line, Alekhine Variation",
    eco: "A52",
    variations: [

    ],
  },

  {
    id: "a52-indian-defense-budapest-gambit-accepted-main-line-alekhine-variation-abonyi-variation",
    name: "Indian Defense: Budapest Gambit Accepted, Main Line, Alekhine Variation, Abonyi Variation",
    eco: "A52",
    variations: [

    ],
  },

  {
    id: "a52-indian-defense-budapest-gambit-accepted-main-line-alekhine-variation-tartakower-defense",
    name: "Indian Defense: Budapest Gambit Accepted, Main Line, Alekhine Variation, Tartakower Defense",
    eco: "A52",
    variations: [

    ],
  },

  {
    id: "a52-indian-defense-budapest-gambit-accepted-main-line-rubinstein-variation",
    name: "Indian Defense: Budapest Gambit Accepted, Main Line, Rubinstein Variation",
    eco: "A52",
    variations: [

    ],
  },

  {
    id: "a53-old-indian-defense",
    name: "Old Indian Defense",
    eco: "A53",
    variations: [

    ],
  },

  {
    id: "a53-old-indian-defense-aged-gibbon-gambit",
    name: "Old Indian Defense: Aged Gibbon Gambit",
    eco: "A53",
    variations: [

    ],
  },

  {
    id: "a53-old-indian-defense-czech-variation-with-nc3",
    name: "Old Indian Defense: Czech Variation, with Nc3",
    eco: "A53",
    variations: [

    ],
  },

  {
    id: "a53-old-indian-defense-czech-variation-with-nf3",
    name: "Old Indian Defense: Czech Variation, with Nf3",
    eco: "A53",
    variations: [

    ],
  },

  {
    id: "a53-old-indian-defense-janowski-variation",
    name: "Old Indian Defense: Janowski Variation",
    eco: "A53",
    variations: [

    ],
  },

  {
    id: "a53-old-indian-defense-janowski-variation-fianchetto-variation",
    name: "Old Indian Defense: Janowski Variation, Fianchetto Variation",
    eco: "A53",
    variations: [

    ],
  },

  {
    id: "a53-old-indian-defense-janowski-variation-grinberg-gambit",
    name: "Old Indian Defense: Janowski Variation, Grinberg Gambit",
    eco: "A53",
    variations: [

    ],
  },

  {
    id: "a53-old-indian-defense-janowski-variation-main-line",
    name: "Old Indian Defense: Janowski Variation, Main Line",
    eco: "A53",
    variations: [

    ],
  },

  {
    id: "a54-old-indian-defense-duz-khotimirsky-variation",
    name: "Old Indian Defense: Duz-Khotimirsky Variation",
    eco: "A54",
    variations: [

    ],
  },

  {
    id: "a54-old-indian-defense-tartakower-indian",
    name: "Old Indian Defense: Tartakower-Indian",
    eco: "A54",
    variations: [

    ],
  },

  {
    id: "a54-old-indian-defense-two-knights-variation",
    name: "Old Indian Defense: Two Knights Variation",
    eco: "A54",
    variations: [

    ],
  },

  {
    id: "a54-old-indian-defense-ukrainian-variation",
    name: "Old Indian Defense: Ukrainian Variation",
    eco: "A54",
    variations: [

    ],
  },

  {
    id: "a55-old-indian-defense-normal-variation",
    name: "Old Indian Defense: Normal Variation",
    eco: "A55",
    variations: [

    ],
  },

  {
    id: "a56-benoni-defense",
    name: "Benoni Defense",
    eco: "A56",
    variations: [

    ],
  },

  {
    id: "a56-benoni-defense-czech-benoni-defense",
    name: "Benoni Defense: Czech Benoni Defense",
    eco: "A56",
    variations: [

    ],
  },

  {
    id: "a56-benoni-defense-hrom-dka-system",
    name: "Benoni Defense: Hromádka System",
    eco: "A56",
    variations: [

    ],
  },

  {
    id: "a56-benoni-defense-king-s-indian-system",
    name: "Benoni Defense: King",
    eco: "A56",
    variations: [

    ],
  },

  {
    id: "a56-benoni-defense-weenink-variation",
    name: "Benoni Defense: Weenink Variation",
    eco: "A56",
    variations: [

    ],
  },

  {
    id: "czech-benoni",
    name: "Czech Benoni",
    eco: "A56",
    variations: [

    ],
  },

  {
    id: "a56-gr-nfeld-defense-three-knights-variation-burille-variation-reversed-tarrasch",
    name: "Grünfeld Defense: Three Knights Variation, Burille Variation, Reversed Tarrasch",
    eco: "A56",
    variations: [

    ],
  },

  {
    id: "a56-vulture-defense",
    name: "Vulture Defense",
    eco: "A56",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit",
    name: "Benko Gambit",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-accepted",
    name: "Benko Gambit Accepted",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-accepted-dlugy-variation",
    name: "Benko Gambit Accepted: Dlugy Variation",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-accepted-modern-variation",
    name: "Benko Gambit Accepted: Modern Variation",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-accepted-pawn-return-variation",
    name: "Benko Gambit Accepted: Pawn Return Variation",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-declined-bishop-attack",
    name: "Benko Gambit Declined: Bishop Attack",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-declined-hj-rring-countergambit",
    name: "Benko Gambit Declined: Hjørring Countergambit",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-declined-main-line",
    name: "Benko Gambit Declined: Main Line",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-declined-pseudo-s-misch",
    name: "Benko Gambit Declined: Pseudo-Sämisch",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-declined-quiet-line",
    name: "Benko Gambit Declined: Quiet Line",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-declined-sosonko-variation",
    name: "Benko Gambit Declined: Sosonko Variation",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-mutkin-countergambit",
    name: "Benko Gambit: Mutkin Countergambit",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-nescafe-frappe-attack",
    name: "Benko Gambit: Nescafe Frappe Attack",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-zaitsev-system",
    name: "Benko Gambit: Zaitsev System",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a57-benko-gambit-zaitsev-variation-nescafe-frappe-attack",
    name: "Benko Gambit: Zaitsev Variation, Nescafe Frappe Attack",
    eco: "A57",
    variations: [

    ],
  },

  {
    id: "a58-benko-gambit-accepted-central-storming-variation",
    name: "Benko Gambit Accepted: Central Storming Variation",
    eco: "A58",
    variations: [

    ],
  },

  {
    id: "a58-benko-gambit-accepted-fianchetto-variation",
    name: "Benko Gambit Accepted: Fianchetto Variation",
    eco: "A58",
    variations: [

    ],
  },

  {
    id: "a58-benko-gambit-accepted-fully-accepted-variation",
    name: "Benko Gambit Accepted: Fully Accepted Variation",
    eco: "A58",
    variations: [

    ],
  },

  {
    id: "a58-benko-gambit-fianchetto-variation",
    name: "Benko Gambit: Fianchetto Variation",
    eco: "A58",
    variations: [

    ],
  },

  {
    id: "a58-benko-gambit-nd2-variation",
    name: "Benko Gambit: Nd2 Variation",
    eco: "A58",
    variations: [

    ],
  },

  {
    id: "a59-benko-gambit",
    name: "Benko Gambit",
    eco: "A59",
    variations: [

    ],
  },

  {
    id: "a59-benko-gambit-accepted-king-walk-variation",
    name: "Benko Gambit Accepted: King Walk Variation",
    eco: "A59",
    variations: [

    ],
  },

  {
    id: "a59-benko-gambit-accepted-yugoslav",
    name: "Benko Gambit Accepted: Yugoslav",
    eco: "A59",
    variations: [

    ],
  },

  {
    id: "a60-benoni-defense-modern-variation",
    name: "Benoni Defense: Modern Variation",
    eco: "A60",
    variations: [

    ],
  },

  {
    id: "a60-benoni-defense-modern-variation-snake-variation",
    name: "Benoni Defense: Modern Variation, Snake Variation",
    eco: "A60",
    variations: [

    ],
  },

  {
    id: "a61-benoni-defense",
    name: "Benoni Defense",
    eco: "A61",
    variations: [

    ],
  },

  {
    id: "a61-benoni-defense-fianchetto-variation",
    name: "Benoni Defense: Fianchetto Variation",
    eco: "A61",
    variations: [

    ],
  },

  {
    id: "a61-benoni-defense-knight-s-tour-variation",
    name: "Benoni Defense: Knight",
    eco: "A61",
    variations: [

    ],
  },

  {
    id: "a61-benoni-defense-uhlmann-variation",
    name: "Benoni Defense: Uhlmann Variation",
    eco: "A61",
    variations: [

    ],
  },

  {
    id: "a62-benoni-defense-fianchetto-variation",
    name: "Benoni Defense: Fianchetto Variation",
    eco: "A62",
    variations: [

    ],
  },

  {
    id: "a63-benoni-defense-fianchetto-variation-hastings-defense",
    name: "Benoni Defense: Fianchetto Variation, Hastings Defense",
    eco: "A63",
    variations: [

    ],
  },

  {
    id: "a64-benoni-defense-fianchetto-variation-hastings-defense-main-line",
    name: "Benoni Defense: Fianchetto Variation, Hastings Defense, Main Line",
    eco: "A64",
    variations: [

    ],
  },

  {
    id: "a65-benoni-defense-king-s-pawn-line",
    name: "Benoni Defense: King",
    eco: "A65",
    variations: [

    ],
  },

  {
    id: "a65-benoni-defense-king-s-pawn-line-with-be3",
    name: "Benoni Defense: King",
    eco: "A65",
    variations: [

    ],
  },

  {
    id: "a65-benoni-defense-king-s-pawn-line-with-bg5",
    name: "Benoni Defense: King",
    eco: "A65",
    variations: [

    ],
  },

  {
    id: "a65-benoni-defense-king-s-pawn-line-with-nge2",
    name: "Benoni Defense: King",
    eco: "A65",
    variations: [

    ],
  },

  {
    id: "a66-benoni-defense-mikenas-variation",
    name: "Benoni Defense: Mikenas Variation",
    eco: "A66",
    variations: [

    ],
  },

  {
    id: "a66-benoni-defense-pawn-storm-variation",
    name: "Benoni Defense: Pawn Storm Variation",
    eco: "A66",
    variations: [

    ],
  },

  {
    id: "a67-benoni-defense-taimanov-variation",
    name: "Benoni Defense: Taimanov Variation",
    eco: "A67",
    variations: [

    ],
  },

  {
    id: "a68-benoni-defense-four-pawns-attack",
    name: "Benoni Defense: Four Pawns Attack",
    eco: "A68",
    variations: [

    ],
  },

  {
    id: "a69-benoni-defense-four-pawns-attack-main-line",
    name: "Benoni Defense: Four Pawns Attack, Main Line",
    eco: "A69",
    variations: [

    ],
  },

  {
    id: "a70-benoni-defense-classical-variation",
    name: "Benoni Defense: Classical Variation",
    eco: "A70",
    variations: [

    ],
  },

  {
    id: "a70-benoni-defense-classical-variation-new-york-variation",
    name: "Benoni Defense: Classical Variation, New York Variation",
    eco: "A70",
    variations: [

    ],
  },

  {
    id: "a70-benoni-defense-classical-variation-traditional-variation",
    name: "Benoni Defense: Classical Variation, Traditional Variation",
    eco: "A70",
    variations: [

    ],
  },

  {
    id: "a71-benoni-defense-classical-variation-averbakh-grivas-attack",
    name: "Benoni Defense: Classical Variation, Averbakh-Grivas Attack",
    eco: "A71",
    variations: [

    ],
  },

  {
    id: "a72-benoni-defense-classical-variation",
    name: "Benoni Defense: Classical Variation",
    eco: "A72",
    variations: [

    ],
  },

  {
    id: "a73-benoni-defense-classical-variation-main-line",
    name: "Benoni Defense: Classical Variation, Main Line",
    eco: "A73",
    variations: [

    ],
  },

  {
    id: "a74-benoni-defense-classical-variation-full-line",
    name: "Benoni Defense: Classical Variation, Full Line",
    eco: "A74",
    variations: [

    ],
  },

  {
    id: "a75-benoni-defense-classical-variation-argentine-counterattack",
    name: "Benoni Defense: Classical Variation, Argentine Counterattack",
    eco: "A75",
    variations: [

    ],
  },

  {
    id: "a76-benoni-defense-classical-variation-czerniak-defense",
    name: "Benoni Defense: Classical Variation, Czerniak Defense",
    eco: "A76",
    variations: [

    ],
  },

  {
    id: "a77-benoni-defense-classical-variation-czerniak-defense-tal-line",
    name: "Benoni Defense: Classical Variation, Czerniak Defense, Tal Line",
    eco: "A77",
    variations: [

    ],
  },

  {
    id: "a78-benoni-defense-classical-variation-czerniak-defense",
    name: "Benoni Defense: Classical Variation, Czerniak Defense",
    eco: "A78",
    variations: [

    ],
  },

  {
    id: "a79-benoni-defense-classical-variation-czerniak-defense",
    name: "Benoni Defense: Classical Variation, Czerniak Defense",
    eco: "A79",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense",
    name: "Dutch Defense",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-alapin-variation",
    name: "Dutch Defense: Alapin Variation",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-barcza-variation",
    name: "Dutch Defense: Barcza Variation",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-hevendehl-gambit",
    name: "Dutch Defense: Hevendehl Gambit",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-hopton-attack",
    name: "Dutch Defense: Hopton Attack",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-janzen-korchnoi-gambit",
    name: "Dutch Defense: Janzen-Korchnoi Gambit",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-kingfisher-gambit",
    name: "Dutch Defense: Kingfisher Gambit",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-korchnoi-attack",
    name: "Dutch Defense: Korchnoi Attack",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-krejcik-gambit",
    name: "Dutch Defense: Krejcik Gambit",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-krejcik-gambit-tate-gambit",
    name: "Dutch Defense: Krejcik Gambit, Tate Gambit",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-manhattan-gambit-anti-classical-line",
    name: "Dutch Defense: Manhattan Gambit, Anti-Classical Line",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-manhattan-gambit-anti-leningrad",
    name: "Dutch Defense: Manhattan Gambit, Anti-Leningrad",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-manhattan-gambit-anti-modern",
    name: "Dutch Defense: Manhattan Gambit, Anti-Modern",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-manhattan-gambit-anti-stonewall",
    name: "Dutch Defense: Manhattan Gambit, Anti-Stonewall",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-omega-isis-gambit",
    name: "Dutch Defense: Omega-Isis Gambit",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-raphael-variation",
    name: "Dutch Defense: Raphael Variation",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-senechaud-gambit",
    name: "Dutch Defense: Senechaud Gambit",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-dutch-defense-spielmann-gambit",
    name: "Dutch Defense: Spielmann Gambit",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a80-queen-s-pawn-game-veresov-attack-dutch-system",
    name: "Queen",
    eco: "A80",
    variations: [

    ],
  },

  {
    id: "a81-dutch-defense-blackburne-variation",
    name: "Dutch Defense: Blackburne Variation",
    eco: "A81",
    variations: [

    ],
  },

  {
    id: "a81-dutch-defense-fianchetto-attack",
    name: "Dutch Defense: Fianchetto Attack",
    eco: "A81",
    variations: [

    ],
  },

  {
    id: "a81-dutch-defense-leningrad-variation-carlsbad-variation",
    name: "Dutch Defense: Leningrad Variation, Carlsbad Variation",
    eco: "A81",
    variations: [

    ],
  },

  {
    id: "a81-dutch-defense-leningrad-basman-system",
    name: "Dutch Defense: Leningrad, Basman System",
    eco: "A81",
    variations: [

    ],
  },

  {
    id: "a81-dutch-defense-semi-leningrad-variation",
    name: "Dutch Defense: Semi-Leningrad Variation",
    eco: "A81",
    variations: [

    ],
  },

  {
    id: "a82-dutch-defense-blackmar-s-second-gambit",
    name: "Dutch Defense: Blackmar",
    eco: "A82",
    variations: [

    ],
  },

  {
    id: "a82-dutch-defense-staunton-gambit",
    name: "Dutch Defense: Staunton Gambit",
    eco: "A82",
    variations: [

    ],
  },

  {
    id: "a82-dutch-defense-staunton-gambit-accepted",
    name: "Dutch Defense: Staunton Gambit Accepted",
    eco: "A82",
    variations: [

    ],
  },

  {
    id: "a82-dutch-defense-staunton-gambit-american-attack",
    name: "Dutch Defense: Staunton Gambit, American Attack",
    eco: "A82",
    variations: [

    ],
  },

  {
    id: "a82-dutch-defense-staunton-gambit-tartakower-variation",
    name: "Dutch Defense: Staunton Gambit, Tartakower Variation",
    eco: "A82",
    variations: [

    ],
  },

  {
    id: "a82-rat-defense-balogh-defense",
    name: "Rat Defense: Balogh Defense",
    eco: "A82",
    variations: [

    ],
  },

  {
    id: "a83-dutch-defense-staunton-gambit",
    name: "Dutch Defense: Staunton Gambit",
    eco: "A83",
    variations: [

    ],
  },

  {
    id: "a83-dutch-defense-staunton-gambit-alekhine-variation",
    name: "Dutch Defense: Staunton Gambit, Alekhine Variation",
    eco: "A83",
    variations: [

    ],
  },

  {
    id: "a83-dutch-defense-staunton-gambit-chigorin-variation",
    name: "Dutch Defense: Staunton Gambit, Chigorin Variation",
    eco: "A83",
    variations: [

    ],
  },

  {
    id: "a83-dutch-defense-staunton-gambit-lasker-variation",
    name: "Dutch Defense: Staunton Gambit, Lasker Variation",
    eco: "A83",
    variations: [

    ],
  },

  {
    id: "a83-dutch-defense-staunton-gambit-nimzowitsch-variation",
    name: "Dutch Defense: Staunton Gambit, Nimzowitsch Variation",
    eco: "A83",
    variations: [

    ],
  },

  {
    id: "a84-dutch-defense",
    name: "Dutch Defense",
    eco: "A84",
    variations: [

    ],
  },

  {
    id: "a84-dutch-defense-bellon-gambit",
    name: "Dutch Defense: Bellon Gambit",
    eco: "A84",
    variations: [

    ],
  },

  {
    id: "a84-dutch-defense-bladel-variation",
    name: "Dutch Defense: Bladel Variation",
    eco: "A84",
    variations: [

    ],
  },

  {
    id: "a84-dutch-defense-classical-variation",
    name: "Dutch Defense: Classical Variation",
    eco: "A84",
    variations: [

    ],
  },

  {
    id: "a84-dutch-defense-krause-variation",
    name: "Dutch Defense: Krause Variation",
    eco: "A84",
    variations: [

    ],
  },

  {
    id: "a84-dutch-defense-normal-variation",
    name: "Dutch Defense: Normal Variation",
    eco: "A84",
    variations: [

    ],
  },

  {
    id: "a84-dutch-defense-rubinstein-variation",
    name: "Dutch Defense: Rubinstein Variation",
    eco: "A84",
    variations: [

    ],
  },

  {
    id: "dutch-classical",
    name: "Dutch Defense: Classical Variation",
    eco: "A85",
    variations: [

    ],
  },

  {
    id: "a85-dutch-defense-queen-s-knight-variation",
    name: "Dutch Defense: Queen",
    eco: "A85",
    variations: [

    ],
  },

  {
    id: "a86-dutch-defense-fianchetto-variation",
    name: "Dutch Defense: Fianchetto Variation",
    eco: "A86",
    variations: [

    ],
  },

  {
    id: "a86-dutch-defense-hort-antoshin-system",
    name: "Dutch Defense: Hort-Antoshin System",
    eco: "A86",
    variations: [

    ],
  },

  {
    id: "a86-dutch-defense-leningrad-variation",
    name: "Dutch Defense: Leningrad Variation",
    eco: "A86",
    variations: [

    ],
  },

  {
    id: "a87-dutch-defense-leningrad-variation",
    name: "Dutch Defense: Leningrad Variation",
    eco: "A87",
    variations: [

    ],
  },

  {
    id: "a88-dutch-defense-leningrad-variation-warsaw-variation",
    name: "Dutch Defense: Leningrad Variation, Warsaw Variation",
    eco: "A88",
    variations: [

    ],
  },

  {
    id: "a89-dutch-defense-leningrad-variation-matulovic-variation",
    name: "Dutch Defense: Leningrad Variation, Matulovic Variation",
    eco: "A89",
    variations: [

    ],
  },

  {
    id: "a90-dutch-defense-classical-variation",
    name: "Dutch Defense: Classical Variation",
    eco: "A90",
    variations: [

    ],
  },

  {
    id: "a90-dutch-defense-nimzo-dutch-variation",
    name: "Dutch Defense: Nimzo-Dutch Variation",
    eco: "A90",
    variations: [

    ],
  },

  {
    id: "a90-dutch-defense-nimzo-dutch-variation-alekhine-variation",
    name: "Dutch Defense: Nimzo-Dutch Variation, Alekhine Variation",
    eco: "A90",
    variations: [

    ],
  },

  {
    id: "a90-dutch-defense-stonewall-variation-modern-variation",
    name: "Dutch Defense: Stonewall Variation, Modern Variation",
    eco: "A90",
    variations: [

    ],
  },

  {
    id: "a91-dutch-defense-classical-variation",
    name: "Dutch Defense: Classical Variation",
    eco: "A91",
    variations: [

    ],
  },

  {
    id: "a91-dutch-defense-classical-variation-blackburne-attack",
    name: "Dutch Defense: Classical Variation, Blackburne Attack",
    eco: "A91",
    variations: [

    ],
  },

  {
    id: "a92-dutch-defense-alekhine-variation",
    name: "Dutch Defense: Alekhine Variation",
    eco: "A92",
    variations: [

    ],
  },

  {
    id: "a92-dutch-defense-classical-variation",
    name: "Dutch Defense: Classical Variation",
    eco: "A92",
    variations: [

    ],
  },

  {
    id: "a92-dutch-defense-stonewall-variation",
    name: "Dutch Defense: Stonewall Variation",
    eco: "A92",
    variations: [

    ],
  },

  {
    id: "a93-dutch-defense-stonewall-variation-botvinnik-variation",
    name: "Dutch Defense: Stonewall Variation, Botvinnik Variation",
    eco: "A93",
    variations: [

    ],
  },

  {
    id: "a94-dutch-defense-stonewall-variation",
    name: "Dutch Defense: Stonewall Variation",
    eco: "A94",
    variations: [

    ],
  },

  {
    id: "a95-dutch-defense-stonewall-variation",
    name: "Dutch Defense: Stonewall Variation",
    eco: "A95",
    variations: [

    ],
  },

  {
    id: "a95-dutch-defense-stonewall-variation-chekhover-variation",
    name: "Dutch Defense: Stonewall Variation, Chekhover Variation",
    eco: "A95",
    variations: [

    ],
  },

  {
    id: "a96-dutch-defense-classical-variation",
    name: "Dutch Defense: Classical Variation",
    eco: "A96",
    variations: [

    ],
  },

  {
    id: "a96-dutch-defense-classical-variation-buenos-aires-variation",
    name: "Dutch Defense: Classical Variation, Buenos Aires Variation",
    eco: "A96",
    variations: [

    ],
  },

  {
    id: "a96-dutch-defense-classical-variation-huisl-variation",
    name: "Dutch Defense: Classical Variation, Huisl Variation",
    eco: "A96",
    variations: [

    ],
  },

  {
    id: "a97-dutch-defense-classical-variation-ilyin-zhenevsky-variation",
    name: "Dutch Defense: Classical Variation, Ilyin-Zhenevsky Variation",
    eco: "A97",
    variations: [

    ],
  },

  {
    id: "a97-dutch-defense-classical-variation-ilyin-zhenevsky-variation-winter-variation",
    name: "Dutch Defense: Classical Variation, Ilyin-Zhenevsky Variation, Winter Variation",
    eco: "A97",
    variations: [

    ],
  },

  {
    id: "a98-dutch-defense-classical-variation-ilyin-zhenevsky-variation-alatortsev-lisitsyn-line",
    name: "Dutch Defense: Classical Variation, Ilyin-Zhenevsky Variation, Alatortsev-Lisitsyn Line",
    eco: "A98",
    variations: [

    ],
  },

  {
    id: "a99-dutch-defense-classical-variation-ilyin-zhenevsky-variation-modern-main-line",
    name: "Dutch Defense: Classical Variation, Ilyin-Zhenevsky Variation, Modern Main Line",
    eco: "A99",
    variations: [

    ],
  },

  {
    id: "b00-barnes-defense",
    name: "Barnes Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-borg-defense",
    name: "Borg Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-borg-defense-borg-gambit",
    name: "Borg Defense: Borg Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-borg-defense-troon-gambit",
    name: "Borg Defense: Troon Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-borg-defense-zilbermints-gambit",
    name: "Borg Defense: Zilbermints Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-carr-defense",
    name: "Carr Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-carr-defense-zilbermints-gambit",
    name: "Carr Defense: Zilbermints Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-duras-gambit",
    name: "Duras Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-fried-fox-defense",
    name: "Fried Fox Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-goldsmith-defense",
    name: "Goldsmith Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-goldsmith-defense-picklepuss-defense",
    name: "Goldsmith Defense: Picklepuss Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-hippopotamus-defense",
    name: "Hippopotamus Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-king-s-pawn-game",
    name: "King",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-lemming-defense",
    name: "Lemming Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-lion-defense-lion-s-jaw",
    name: "Lion Defense: Lion",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense",
    name: "Nimzowitsch Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-breyer-variation",
    name: "Nimzowitsch Defense: Breyer Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-colorado-countergambit",
    name: "Nimzowitsch Defense: Colorado Countergambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-colorado-countergambit-accepted",
    name: "Nimzowitsch Defense: Colorado Countergambit Accepted",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-declined-variation",
    name: "Nimzowitsch Defense: Declined Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-el-columpio-defense",
    name: "Nimzowitsch Defense: El Columpio Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-el-columpio-defense-el-columpio-gambit",
    name: "Nimzowitsch Defense: El Columpio Defense, El Columpio Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-el-columpio-defense-exchange-variation",
    name: "Nimzowitsch Defense: El Columpio Defense, Exchange Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-el-columpio-defense-pin-variation",
    name: "Nimzowitsch Defense: El Columpio Defense, Pin Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-franco-nimzowitsch-variation",
    name: "Nimzowitsch Defense: Franco-Nimzowitsch Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-french-connection",
    name: "Nimzowitsch Defense: French Connection",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-hornung-gambit",
    name: "Nimzowitsch Defense: Hornung Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-kennedy-variation",
    name: "Nimzowitsch Defense: Kennedy Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-kennedy-variation-bielefelder-gambit",
    name: "Nimzowitsch Defense: Kennedy Variation, Bielefelder Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-kennedy-variation-hammer-gambit",
    name: "Nimzowitsch Defense: Kennedy Variation, Hammer Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-kennedy-variation-herford-gambit",
    name: "Nimzowitsch Defense: Kennedy Variation, Herford Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-kennedy-variation-keres-attack",
    name: "Nimzowitsch Defense: Kennedy Variation, Keres Attack",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-kennedy-variation-linksspringer-variation",
    name: "Nimzowitsch Defense: Kennedy Variation, Linksspringer Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-kennedy-variation-main-line",
    name: "Nimzowitsch Defense: Kennedy Variation, Main Line",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-kennedy-variation-paulsen-attack",
    name: "Nimzowitsch Defense: Kennedy Variation, Paulsen Attack",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-kennedy-variation-riemann-defense",
    name: "Nimzowitsch Defense: Kennedy Variation, Riemann Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-kennedy-variation-de-smet-gambit",
    name: "Nimzowitsch Defense: Kennedy Variation, de Smet Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-mikenas-variation",
    name: "Nimzowitsch Defense: Mikenas Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-neo-mongoloid-defense",
    name: "Nimzowitsch Defense: Neo-Mongoloid Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-pirc-connection",
    name: "Nimzowitsch Defense: Pirc Connection",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-pseudo-spanish-variation",
    name: "Nimzowitsch Defense: Pseudo-Spanish Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-scandinavian-variation",
    name: "Nimzowitsch Defense: Scandinavian Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-scandinavian-variation-aachen-gambit",
    name: "Nimzowitsch Defense: Scandinavian Variation, Aachen Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-scandinavian-variation-advance-variation",
    name: "Nimzowitsch Defense: Scandinavian Variation, Advance Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-scandinavian-variation-bogoljubow-variation",
    name: "Nimzowitsch Defense: Scandinavian Variation, Bogoljubow Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-scandinavian-variation-bogoljubow-variation-brandics-gambit",
    name: "Nimzowitsch Defense: Scandinavian Variation, Bogoljubow Variation, Brandics Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-scandinavian-variation-bogoljubow-variation-erben-gambit",
    name: "Nimzowitsch Defense: Scandinavian Variation, Bogoljubow Variation, Erben Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-scandinavian-variation-bogoljubow-variation-heinola-deppe-gambit",
    name: "Nimzowitsch Defense: Scandinavian Variation, Bogoljubow Variation, Heinola-Deppe Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-scandinavian-variation-bogoljubow-variation-nimzowitsch-gambit",
    name: "Nimzowitsch Defense: Scandinavian Variation, Bogoljubow Variation, Nimzowitsch Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-scandinavian-variation-bogoljubow-variation-richter-gambit",
    name: "Nimzowitsch Defense: Scandinavian Variation, Bogoljubow Variation, Richter Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-scandinavian-variation-bogoljubow-variation-vehre-variation",
    name: "Nimzowitsch Defense: Scandinavian Variation, Bogoljubow Variation, Vehre Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-scandinavian-variation-exchange-variation",
    name: "Nimzowitsch Defense: Scandinavian Variation, Exchange Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-scandinavian-variation-exchange-variation-marshall-gambit",
    name: "Nimzowitsch Defense: Scandinavian Variation, Exchange Variation, Marshall Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-wheeler-gambit",
    name: "Nimzowitsch Defense: Wheeler Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-williams-variation",
    name: "Nimzowitsch Defense: Williams Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-nimzowitsch-defense-woodchuck-variation",
    name: "Nimzowitsch Defense: Woodchuck Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-owen-defense",
    name: "Owen Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-owen-defense-guatemala-defense",
    name: "Owen Defense: Guatemala Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-owen-defense-hekili-loa-gambit",
    name: "Owen Defense: Hekili-Loa Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-owen-defense-matovinsky-gambit",
    name: "Owen Defense: Matovinsky Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-owen-defense-naselwaus-gambit",
    name: "Owen Defense: Naselwaus Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-owen-defense-smith-gambit",
    name: "Owen Defense: Smith Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-owen-defense-unicorn-variation",
    name: "Owen Defense: Unicorn Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-owen-defense-wind-gambit",
    name: "Owen Defense: Wind Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-pirc-defense",
    name: "Pirc Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-pirc-defense-roscher-gambit",
    name: "Pirc Defense: Roscher Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-rat-defense-antal-defense",
    name: "Rat Defense: Antal Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-rat-defense-fuller-gambit",
    name: "Rat Defense: Fuller Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-rat-defense-harmonist",
    name: "Rat Defense: Harmonist",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-rat-defense-petruccioli-attack",
    name: "Rat Defense: Petruccioli Attack",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-rat-defense-spike-attack",
    name: "Rat Defense: Spike Attack",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-st-george-defense",
    name: "St. George Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-st-george-defense-polish-variation",
    name: "St. George Defense: Polish Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-st-george-defense-san-jorge-variation",
    name: "St. George Defense: San Jorge Variation",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-st-george-defense-zilbermints-gambit",
    name: "St. George Defense: Zilbermints Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-van-geet-opening-berlin-gambit",
    name: "Van Geet Opening: Berlin Gambit",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-ware-defense",
    name: "Ware Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b00-ware-defense-snagglepuss-defense",
    name: "Ware Defense: Snagglepuss Defense",
    eco: "B00",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense",
    name: "Scandinavian Defense",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-anderssen-counterattack",
    name: "Scandinavian Defense: Anderssen Counterattack",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-anderssen-counterattack-collijn-variation",
    name: "Scandinavian Defense: Anderssen Counterattack, Collijn Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-anderssen-counterattack-goteborg-system",
    name: "Scandinavian Defense: Anderssen Counterattack, Goteborg System",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-anderssen-counterattack-orthodox-attack",
    name: "Scandinavian Defense: Anderssen Counterattack, Orthodox Attack",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-blackburne-gambit",
    name: "Scandinavian Defense: Blackburne Gambit",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-blackburne-kloosterboer-gambit",
    name: "Scandinavian Defense: Blackburne-Kloosterboer Gambit",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-boehnke-gambit",
    name: "Scandinavian Defense: Boehnke Gambit",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-bronstein-variation",
    name: "Scandinavian Defense: Bronstein Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-classical-variation",
    name: "Scandinavian Defense: Classical Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-gr-nfeld-variation",
    name: "Scandinavian Defense: Grünfeld Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-gubinsky-melts-defense",
    name: "Scandinavian Defense: Gubinsky-Melts Defense",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-icelandic-palme-gambit",
    name: "Scandinavian Defense: Icelandic-Palme Gambit",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-kiel-variation",
    name: "Scandinavian Defense: Kiel Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-kloosterboer-gambit",
    name: "Scandinavian Defense: Kloosterboer Gambit",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-k-das-gambit",
    name: "Scandinavian Defense: Kádas Gambit",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-lasker-variation",
    name: "Scandinavian Defense: Lasker Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-main-line",
    name: "Scandinavian Defense: Main Line",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-main-line-leonhardt-gambit",
    name: "Scandinavian Defense: Main Line, Leonhardt Gambit",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-main-line-mieses-variation",
    name: "Scandinavian Defense: Main Line, Mieses Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-marshall-variation",
    name: "Scandinavian Defense: Marshall Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-mieses-kotr-variation",
    name: "Scandinavian Defense: Mieses-Kotrč Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-modern-variation",
    name: "Scandinavian Defense: Modern Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-modern-variation-gipslis-variation",
    name: "Scandinavian Defense: Modern Variation, Gipslis Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-modern-variation-wing-gambit",
    name: "Scandinavian Defense: Modern Variation, Wing Gambit",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-panov-transfer",
    name: "Scandinavian Defense: Panov Transfer",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-portuguese-gambit",
    name: "Scandinavian Defense: Portuguese Gambit",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-portuguese-gambit-banker-variation",
    name: "Scandinavian Defense: Portuguese Gambit, Banker Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-portuguese-gambit-classical-variation",
    name: "Scandinavian Defense: Portuguese Gambit, Classical Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-portuguese-gambit-correspondence-refutation",
    name: "Scandinavian Defense: Portuguese Gambit, Correspondence Refutation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-portuguese-gambit-elbow-variation",
    name: "Scandinavian Defense: Portuguese Gambit, Elbow Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-portuguese-gambit-jadoul-variation",
    name: "Scandinavian Defense: Portuguese Gambit, Jadoul Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-portuguese-gambit-lusophobe-variation",
    name: "Scandinavian Defense: Portuguese Gambit, Lusophobe Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-portuguese-gambit-melbourne-shuffle-variation",
    name: "Scandinavian Defense: Portuguese Gambit, Melbourne Shuffle Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-portuguese-gambit-wuss-variation",
    name: "Scandinavian Defense: Portuguese Gambit, Wuss Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-richter-variation",
    name: "Scandinavian Defense: Richter Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-schiller-pytel-variation",
    name: "Scandinavian Defense: Schiller-Pytel Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-schiller-pytel-variation-modern-variation",
    name: "Scandinavian Defense: Schiller-Pytel Variation, Modern Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-valencian-variation",
    name: "Scandinavian Defense: Valencian Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-valencian-variation-ilundain-variation",
    name: "Scandinavian Defense: Valencian Variation, Ilundain Variation",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-valencian-variation-main-line",
    name: "Scandinavian Defense: Valencian Variation, Main Line",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-scandinavian-defense-zilbermints-gambit",
    name: "Scandinavian Defense: Zilbermints Gambit",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "b01-van-geet-opening-gr-nfeld-defense",
    name: "Van Geet Opening: Grünfeld Defense",
    eco: "B01",
    variations: [

    ],
  },

  {
    id: "alekhine-defense",
    name: "Alekhine",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense",
    name: "Alekhine Defense",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-brooklyn-variation",
    name: "Alekhine Defense: Brooklyn Variation",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-brooklyn-variation-everglades-variation",
    name: "Alekhine Defense: Brooklyn Variation, Everglades Variation",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-buckley-attack",
    name: "Alekhine Defense: Buckley Attack",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-hunt-variation-lasker-simul-gambit",
    name: "Alekhine Defense: Hunt Variation, Lasker Simul Gambit",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-hunt-variation-matsukevich-gambit",
    name: "Alekhine Defense: Hunt Variation, Matsukevich Gambit",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-hunt-variation-mikenas-gambit",
    name: "Alekhine Defense: Hunt Variation, Mikenas Gambit",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-kmoch-variation",
    name: "Alekhine Defense: Kmoch Variation",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-krejcik-variation",
    name: "Alekhine Defense: Krejcik Variation",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-krejcik-variation-krejcik-gambit",
    name: "Alekhine Defense: Krejcik Variation, Krejcik Gambit",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-mar-czy-variation",
    name: "Alekhine Defense: Maróczy Variation",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-mokele-mbembe",
    name: "Alekhine Defense: Mokele Mbembe",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-mokele-mbembe-modern-line",
    name: "Alekhine Defense: Mokele Mbembe, Modern Line",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-mokele-mbembe-vavra-defense",
    name: "Alekhine Defense: Mokele Mbembe, Vavra Defense",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-normal-variation",
    name: "Alekhine Defense: Normal Variation",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-scandinavian-variation",
    name: "Alekhine Defense: Scandinavian Variation",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-scandinavian-variation-geschev-gambit",
    name: "Alekhine Defense: Scandinavian Variation, Geschev Gambit",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-scandinavian-variation-myers-gambit",
    name: "Alekhine Defense: Scandinavian Variation, Myers Gambit",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-spielmann-gambit",
    name: "Alekhine Defense: Spielmann Gambit",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-steiner-variation",
    name: "Alekhine Defense: Steiner Variation",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-s-misch-attack",
    name: "Alekhine Defense: Sämisch Attack",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-the-squirrel",
    name: "Alekhine Defense: The Squirrel",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-two-pawns-attack",
    name: "Alekhine Defense: Two Pawns Attack",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-two-pawns-attack-lasker-variation",
    name: "Alekhine Defense: Two Pawns Attack, Lasker Variation",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-two-pawns-attack-mikenas-variation",
    name: "Alekhine Defense: Two Pawns Attack, Mikenas Variation",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-two-pawns-attack-tate-variation",
    name: "Alekhine Defense: Two Pawns Attack, Tate Variation",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "b02-alekhine-defense-welling-variation",
    name: "Alekhine Defense: Welling Variation",
    eco: "B02",
    variations: [

    ],
  },

  {
    id: "alekhine-chasin",
    name: "Alekhine",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense",
    name: "Alekhine Defense",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-balogh-variation",
    name: "Alekhine Defense: Balogh Variation",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-exchange-variation",
    name: "Alekhine Defense: Exchange Variation",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-exchange-variation-karpov-variation",
    name: "Alekhine Defense: Exchange Variation, Karpov Variation",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-exchange-variation-voronezh-variation",
    name: "Alekhine Defense: Exchange Variation, Voronezh Variation",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-four-pawns-attack",
    name: "Alekhine Defense: Four Pawns Attack",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-four-pawns-attack-cambridge-gambit",
    name: "Alekhine Defense: Four Pawns Attack, Cambridge Gambit",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-four-pawns-attack-fianchetto-variation",
    name: "Alekhine Defense: Four Pawns Attack, Fianchetto Variation",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-four-pawns-attack-ilyin-zhenevsky-variation",
    name: "Alekhine Defense: Four Pawns Attack, Ilyin-Zhenevsky Variation",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-four-pawns-attack-korchnoi-variation",
    name: "Alekhine Defense: Four Pawns Attack, Korchnoi Variation",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-four-pawns-attack-main-line",
    name: "Alekhine Defense: Four Pawns Attack, Main Line",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-four-pawns-attack-tartakower-variation",
    name: "Alekhine Defense: Four Pawns Attack, Tartakower Variation",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-four-pawns-attack-trifunovic-variation",
    name: "Alekhine Defense: Four Pawns Attack, Trifunovic Variation",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-hunt-variation",
    name: "Alekhine Defense: Hunt Variation",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-modern-variation-alekhine-gambit",
    name: "Alekhine Defense: Modern Variation, Alekhine Gambit",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b03-alekhine-defense-o-sullivan-gambit",
    name: "Alekhine Defense: O",
    eco: "B03",
    variations: [

    ],
  },

  {
    id: "b04-alekhine-defense-modern-variation",
    name: "Alekhine Defense: Modern Variation",
    eco: "B04",
    variations: [

    ],
  },

  {
    id: "b04-alekhine-defense-modern-variation-alburt-variation",
    name: "Alekhine Defense: Modern Variation, Alburt Variation",
    eco: "B04",
    variations: [

    ],
  },

  {
    id: "b04-alekhine-defense-modern-variation-keres-variation",
    name: "Alekhine Defense: Modern Variation, Keres Variation",
    eco: "B04",
    variations: [

    ],
  },

  {
    id: "b04-alekhine-defense-modern-variation-larsen-variation",
    name: "Alekhine Defense: Modern Variation, Larsen Variation",
    eco: "B04",
    variations: [

    ],
  },

  {
    id: "b04-alekhine-defense-modern-variation-larsen-haakert-variation",
    name: "Alekhine Defense: Modern Variation, Larsen-Haakert Variation",
    eco: "B04",
    variations: [

    ],
  },

  {
    id: "b04-alekhine-defense-modern-variation-schmid-variation",
    name: "Alekhine Defense: Modern Variation, Schmid Variation",
    eco: "B04",
    variations: [

    ],
  },

  {
    id: "b05-alekhine-defense-modern-variation-alekhine-variation",
    name: "Alekhine Defense: Modern Variation, Alekhine Variation",
    eco: "B05",
    variations: [

    ],
  },

  {
    id: "b05-alekhine-defense-modern-variation-flohr-variation",
    name: "Alekhine Defense: Modern Variation, Flohr Variation",
    eco: "B05",
    variations: [

    ],
  },

  {
    id: "b05-alekhine-defense-modern-variation-main-line",
    name: "Alekhine Defense: Modern Variation, Main Line",
    eco: "B05",
    variations: [

    ],
  },

  {
    id: "b05-alekhine-defense-modern-variation-panov-variation",
    name: "Alekhine Defense: Modern Variation, Panov Variation",
    eco: "B05",
    variations: [

    ],
  },

  {
    id: "b05-alekhine-defense-modern-variation-vitolins-attack",
    name: "Alekhine Defense: Modern Variation, Vitolins Attack",
    eco: "B05",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense",
    name: "Modern Defense",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-anti-modern",
    name: "Modern Defense: Anti-Modern",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "modern-averbakh",
    name: "Modern Defense: Averbakh Variation",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-bishop-attack",
    name: "Modern Defense: Bishop Attack",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-bishop-attack-b-cker-gambit",
    name: "Modern Defense: Bishop Attack, Bücker Gambit",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-bishop-attack-monkey-s-bum",
    name: "Modern Defense: Bishop Attack, Monkey",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-dunworthy-variation",
    name: "Modern Defense: Dunworthy Variation",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-fianchetto-gambit",
    name: "Modern Defense: Fianchetto Gambit",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-gurgenidze-defense",
    name: "Modern Defense: Gurgenidze Defense",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-lizard-defense-mittenberger-gambit",
    name: "Modern Defense: Lizard Defense, Mittenberger Gambit",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-masur-gambit",
    name: "Modern Defense: Masur Gambit",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-modern-pterodactyl",
    name: "Modern Defense: Modern Pterodactyl",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-mongredien-defense-with-nc3",
    name: "Modern Defense: Mongredien Defense, with Nc3",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-mongredien-defense-with-nf3",
    name: "Modern Defense: Mongredien Defense, with Nf3",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-norwegian-defense",
    name: "Modern Defense: Norwegian Defense",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-norwegian-defense-norwegian-gambit",
    name: "Modern Defense: Norwegian Defense, Norwegian Gambit",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-pseudo-austrian-attack",
    name: "Modern Defense: Pseudo-Austrian Attack",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-semi-averbakh-variation-pterodactyl-variation-declined",
    name: "Modern Defense: Semi-Averbakh Variation, Pterodactyl Variation Declined",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-standard-defense",
    name: "Modern Defense: Standard Defense",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-standard-line",
    name: "Modern Defense: Standard Line",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-three-pawns-attack",
    name: "Modern Defense: Three Pawns Attack",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-two-knights-variation",
    name: "Modern Defense: Two Knights Variation",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-two-knights-variation-suttles-variation",
    name: "Modern Defense: Two Knights Variation, Suttles Variation",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-two-knights-variation-suttles-variation-tal-gambit",
    name: "Modern Defense: Two Knights Variation, Suttles Variation, Tal Gambit",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-westermann-gambit",
    name: "Modern Defense: Westermann Gambit",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-modern-defense-wind-gambit",
    name: "Modern Defense: Wind Gambit",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-austrian-austriadactylus-western",
    name: "Pterodactyl Defense: Austrian, Austriadactylus Western",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-austrian-grand-prix-pterodactyl",
    name: "Pterodactyl Defense: Austrian, Grand Prix Pterodactyl",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-austrian-pteranodon",
    name: "Pterodactyl Defense: Austrian, Pteranodon",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-central-anhanguera",
    name: "Pterodactyl Defense: Central, Anhanguera",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-central-benoni-quetzalcoatlus",
    name: "Pterodactyl Defense: Central, Benoni Quetzalcoatlus",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-central-quetzalcoatlus-gambit",
    name: "Pterodactyl Defense: Central, Quetzalcoatlus Gambit",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-eastern-anhanguera",
    name: "Pterodactyl Defense: Eastern, Anhanguera",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-eastern-benoni",
    name: "Pterodactyl Defense: Eastern, Benoni",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-eastern-benoni-pteranodon",
    name: "Pterodactyl Defense: Eastern, Benoni Pteranodon",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-eastern-benoni-pterodactyl",
    name: "Pterodactyl Defense: Eastern, Benoni Pterodactyl",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-eastern-pteranodon",
    name: "Pterodactyl Defense: Eastern, Pteranodon",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-eastern-rhamphorhynchus",
    name: "Pterodactyl Defense: Eastern, Rhamphorhynchus",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-fianchetto-king-pterodactyl",
    name: "Pterodactyl Defense: Fianchetto, King Pterodactyl",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-fianchetto-rhamphorhynchus",
    name: "Pterodactyl Defense: Fianchetto, Rhamphorhynchus",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-sicilian-quetzalcoatlus",
    name: "Pterodactyl Defense: Sicilian, Quetzalcoatlus",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-sicilian-siroccopteryx",
    name: "Pterodactyl Defense: Sicilian, Siroccopteryx",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-western-anhanguera",
    name: "Pterodactyl Defense: Western, Anhanguera",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-pterodactyl-defense-western-siroccopteryx",
    name: "Pterodactyl Defense: Western, Siroccopteryx",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b06-rat-defense-accelerated-gurgenidze",
    name: "Rat Defense: Accelerated Gurgenidze",
    eco: "B06",
    variations: [

    ],
  },

  {
    id: "b07-czech-defense",
    name: "Czech Defense",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-king-s-pawn-game-mar-czy-defense",
    name: "King",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-lion-defense",
    name: "Lion Defense",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-lion-defense-anti-philidor",
    name: "Lion Defense: Anti-Philidor",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-lion-defense-anti-philidor-lion-s-cave",
    name: "Lion Defense: Anti-Philidor, Lion",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-lion-defense-anti-philidor-lion-s-cave-lion-claw-gambit",
    name: "Lion Defense: Anti-Philidor, Lion",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-lion-defense-bayonet-attack",
    name: "Lion Defense: Bayonet Attack",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-modern-defense-geller-s-system",
    name: "Modern Defense: Geller",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-pirc-defense",
    name: "Pirc Defense",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-pirc-defense-150-attack",
    name: "Pirc Defense: 150 Attack",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-pirc-defense-150-attack-inner-doll-defense",
    name: "Pirc Defense: 150 Attack, Inner Doll Defense",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-pirc-defense-150-attack-sveshnikov-jansa-attack",
    name: "Pirc Defense: 150 Attack, Sveshnikov-Jansa Attack",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-pirc-defense-bayonet-attack",
    name: "Pirc Defense: Bayonet Attack",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-pirc-defense-byrne-variation",
    name: "Pirc Defense: Byrne Variation",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-pirc-defense-chinese-variation",
    name: "Pirc Defense: Chinese Variation",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-pirc-defense-kholmov-system",
    name: "Pirc Defense: Kholmov System",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "b07-pirc-defense-sveshnikov-system",
    name: "Pirc Defense: Sveshnikov System",
    eco: "B07",
    variations: [

    ],
  },

  {
    id: "pirc-austrian",
    name: "Pirc Defense: Austrian Attack",
    eco: "B08",
    variations: [

    ],
  },

  {
    id: "b08-pirc-defense-classical-variation",
    name: "Pirc Defense: Classical Variation",
    eco: "B08",
    variations: [

    ],
  },

  {
    id: "b08-pirc-defense-classical-variation-quiet-system",
    name: "Pirc Defense: Classical Variation, Quiet System",
    eco: "B08",
    variations: [

    ],
  },

  {
    id: "b08-pirc-defense-classical-variation-quiet-system-chigorin-line",
    name: "Pirc Defense: Classical Variation, Quiet System, Chigorin Line",
    eco: "B08",
    variations: [

    ],
  },

  {
    id: "b08-pirc-defense-classical-variation-quiet-system-czech-defense",
    name: "Pirc Defense: Classical Variation, Quiet System, Czech Defense",
    eco: "B08",
    variations: [

    ],
  },

  {
    id: "b08-pirc-defense-classical-variation-quiet-system-parma-defense",
    name: "Pirc Defense: Classical Variation, Quiet System, Parma Defense",
    eco: "B08",
    variations: [

    ],
  },

  {
    id: "b08-pirc-defense-classical-variation-schlechter-variation",
    name: "Pirc Defense: Classical Variation, Schlechter Variation",
    eco: "B08",
    variations: [

    ],
  },

  {
    id: "b09-pirc-defense-austrian-attack",
    name: "Pirc Defense: Austrian Attack",
    eco: "B09",
    variations: [

    ],
  },

  {
    id: "b09-pirc-defense-austrian-attack-dragon-formation",
    name: "Pirc Defense: Austrian Attack, Dragon Formation",
    eco: "B09",
    variations: [

    ],
  },

  {
    id: "b09-pirc-defense-austrian-attack-kurajica-variation",
    name: "Pirc Defense: Austrian Attack, Kurajica Variation",
    eco: "B09",
    variations: [

    ],
  },

  {
    id: "b09-pirc-defense-austrian-attack-ljubojevic-variation",
    name: "Pirc Defense: Austrian Attack, Ljubojevic Variation",
    eco: "B09",
    variations: [

    ],
  },

  {
    id: "b09-pirc-defense-austrian-attack-unzicker-attack",
    name: "Pirc Defense: Austrian Attack, Unzicker Attack",
    eco: "B09",
    variations: [

    ],
  },

  {
    id: "b09-pirc-defense-austrian-attack-unzicker-attack-bronstein-variation",
    name: "Pirc Defense: Austrian Attack, Unzicker Attack, Bronstein Variation",
    eco: "B09",
    variations: [

    ],
  },

  {
    id: "b09-pirc-defense-austrian-attack-weiss-variation",
    name: "Pirc Defense: Austrian Attack, Weiss Variation",
    eco: "B09",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense",
    name: "Caro-Kann Defense",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-accelerated-panov-attack",
    name: "Caro-Kann Defense: Accelerated Panov Attack",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-accelerated-panov-attack-modern-variation",
    name: "Caro-Kann Defense: Accelerated Panov Attack, Modern Variation",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-accelerated-panov-attack-open-variation",
    name: "Caro-Kann Defense: Accelerated Panov Attack, Open Variation",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-accelerated-panov-attack-pseudo-scandinavian",
    name: "Caro-Kann Defense: Accelerated Panov Attack, Pseudo-Scandinavian",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-accelerated-panov-attack-van-weersel-attack",
    name: "Caro-Kann Defense: Accelerated Panov Attack, Van Weersel Attack",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-apocalypse-attack",
    name: "Caro-Kann Defense: Apocalypse Attack",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-breyer-variation",
    name: "Caro-Kann Defense: Breyer Variation",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-breyer-variation-stein-attack",
    name: "Caro-Kann Defense: Breyer Variation, Stein Attack",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-dinic-gambit",
    name: "Caro-Kann Defense: Dinic Gambit",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-endgame-offer",
    name: "Caro-Kann Defense: Endgame Offer",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-endgame-variation",
    name: "Caro-Kann Defense: Endgame Variation",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-euwe-attack",
    name: "Caro-Kann Defense: Euwe Attack",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-goldman-variation",
    name: "Caro-Kann Defense: Goldman Variation",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-hector-gambit",
    name: "Caro-Kann Defense: Hector Gambit",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-hillbilly-attack",
    name: "Caro-Kann Defense: Hillbilly Attack",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-hillbilly-attack-schaeffer-gambit",
    name: "Caro-Kann Defense: Hillbilly Attack, Schaeffer Gambit",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-labahn-attack",
    name: "Caro-Kann Defense: Labahn Attack",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-labahn-attack-double-gambit",
    name: "Caro-Kann Defense: Labahn Attack, Double Gambit",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-labahn-attack-polish-variation",
    name: "Caro-Kann Defense: Labahn Attack, Polish Variation",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-scorpion-horus-gambit",
    name: "Caro-Kann Defense: Scorpion-Horus Gambit",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-spike-variation",
    name: "Caro-Kann Defense: Spike Variation",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-spike-variation-scorpion-grob-gambit",
    name: "Caro-Kann Defense: Spike Variation, Scorpion-Grob Gambit",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-st-patrick-s-attack",
    name: "Caro-Kann Defense: St. Patrick",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-toikkanen-gambit",
    name: "Caro-Kann Defense: Toikkanen Gambit",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b10-caro-kann-defense-two-knights-attack",
    name: "Caro-Kann Defense: Two Knights Attack",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "caro-kann-two-knights",
    name: "Caro-Kann: Two Knights Variation",
    eco: "B10",
    variations: [

    ],
  },

  {
    id: "b11-caro-kann-defense-two-knights-attack-mindeno-variation",
    name: "Caro-Kann Defense: Two Knights Attack, Mindeno Variation",
    eco: "B11",
    variations: [

    ],
  },

  {
    id: "b11-caro-kann-defense-two-knights-attack-mindeno-variation-exchange-line",
    name: "Caro-Kann Defense: Two Knights Attack, Mindeno Variation, Exchange Line",
    eco: "B11",
    variations: [

    ],
  },

  {
    id: "b11-caro-kann-defense-two-knights-attack-mindeno-variation-retreat-line",
    name: "Caro-Kann Defense: Two Knights Attack, Mindeno Variation, Retreat Line",
    eco: "B11",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense",
    name: "Caro-Kann Defense",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-advance-variation",
    name: "Caro-Kann Defense: Advance Variation",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-advance-variation-bayonet-attack",
    name: "Caro-Kann Defense: Advance Variation, Bayonet Attack",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-advance-variation-botvinnik-carls-defense",
    name: "Caro-Kann Defense: Advance Variation, Botvinnik-Carls Defense",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-advance-variation-bronstein-variation",
    name: "Caro-Kann Defense: Advance Variation, Bronstein Variation",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-advance-variation-prins-attack",
    name: "Caro-Kann Defense: Advance Variation, Prins Attack",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-advance-variation-short-variation",
    name: "Caro-Kann Defense: Advance Variation, Short Variation",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-advance-variation-tal-variation",
    name: "Caro-Kann Defense: Advance Variation, Tal Variation",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-advance-variation-van-der-wiel-attack",
    name: "Caro-Kann Defense: Advance Variation, Van der Wiel Attack",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-advance-variation-van-der-wiel-attack-dreyev-defense",
    name: "Caro-Kann Defense: Advance Variation, Van der Wiel Attack, Dreyev Defense",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-advance-short-variation",
    name: "Caro-Kann Defense: Advance, Short Variation",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-de-bruycker-defense",
    name: "Caro-Kann Defense: De Bruycker Defense",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-edinburgh-variation",
    name: "Caro-Kann Defense: Edinburgh Variation",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-mar-czy-variation",
    name: "Caro-Kann Defense: Maróczy Variation",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-mar-czy-variation-mar-czy-gambit",
    name: "Caro-Kann Defense: Maróczy Variation, Maróczy Gambit",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-masi-variation",
    name: "Caro-Kann Defense: Masi Variation",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-massachusetts-defense",
    name: "Caro-Kann Defense: Massachusetts Defense",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-mieses-attack-landau-gambit",
    name: "Caro-Kann Defense: Mieses Attack, Landau Gambit",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-mieses-gambit",
    name: "Caro-Kann Defense: Mieses Gambit",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-modern-variation",
    name: "Caro-Kann Defense: Modern Variation",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b12-caro-kann-defense-ulysses-gambit",
    name: "Caro-Kann Defense: Ulysses Gambit",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "caro-kann-gurgenidze",
    name: "Caro-Kann: Gurgenidze System",
    eco: "B12",
    variations: [

    ],
  },

  {
    id: "b13-caro-kann-defense-exchange-variation",
    name: "Caro-Kann Defense: Exchange Variation",
    eco: "B13",
    variations: [

    ],
  },

  {
    id: "b13-caro-kann-defense-exchange-variation-bulla-attack",
    name: "Caro-Kann Defense: Exchange Variation, Bulla Attack",
    eco: "B13",
    variations: [

    ],
  },

  {
    id: "b13-caro-kann-defense-exchange-variation-rubinstein-variation",
    name: "Caro-Kann Defense: Exchange Variation, Rubinstein Variation",
    eco: "B13",
    variations: [

    ],
  },

  {
    id: "b13-caro-kann-defense-panov-attack",
    name: "Caro-Kann Defense: Panov Attack",
    eco: "B13",
    variations: [

    ],
  },

  {
    id: "b13-caro-kann-defense-panov-attack-gunderam-attack",
    name: "Caro-Kann Defense: Panov Attack, Gunderam Attack",
    eco: "B13",
    variations: [

    ],
  },

  {
    id: "b13-caro-kann-defense-panov-attack-modern-defense",
    name: "Caro-Kann Defense: Panov Attack, Modern Defense",
    eco: "B13",
    variations: [

    ],
  },

  {
    id: "b13-caro-kann-defense-panov-attack-modern-defense-carlsbad-line",
    name: "Caro-Kann Defense: Panov Attack, Modern Defense, Carlsbad Line",
    eco: "B13",
    variations: [

    ],
  },

  {
    id: "b13-caro-kann-defense-panov-attack-modern-defense-czerniak-line",
    name: "Caro-Kann Defense: Panov Attack, Modern Defense, Czerniak Line",
    eco: "B13",
    variations: [

    ],
  },

  {
    id: "b13-caro-kann-defense-panov-attack-modern-defense-mieses-line",
    name: "Caro-Kann Defense: Panov Attack, Modern Defense, Mieses Line",
    eco: "B13",
    variations: [

    ],
  },

  {
    id: "b13-caro-kann-defense-panov-attack-modern-defense-reifir-spielmann-line",
    name: "Caro-Kann Defense: Panov Attack, Modern Defense, Reifir-Spielmann Line",
    eco: "B13",
    variations: [

    ],
  },

  {
    id: "b13-caro-kann-defense-panov-botvinnik-herzog-defense",
    name: "Caro-Kann Defense: Panov-Botvinnik, Herzog Defense",
    eco: "B13",
    variations: [

    ],
  },

  {
    id: "b14-caro-kann-defense-panov-attack",
    name: "Caro-Kann Defense: Panov Attack",
    eco: "B14",
    variations: [

    ],
  },

  {
    id: "b14-caro-kann-defense-panov-attack-fianchetto-defense",
    name: "Caro-Kann Defense: Panov Attack, Fianchetto Defense",
    eco: "B14",
    variations: [

    ],
  },

  {
    id: "b14-caro-kann-defense-panov-attack-fianchetto-defense-fianchetto-gambit",
    name: "Caro-Kann Defense: Panov Attack, Fianchetto Defense, Fianchetto Gambit",
    eco: "B14",
    variations: [

    ],
  },

  {
    id: "b14-caro-kann-defense-panov-attack-main-line",
    name: "Caro-Kann Defense: Panov Attack, Main Line",
    eco: "B14",
    variations: [

    ],
  },

  {
    id: "caro-kann-panov",
    name: "Caro-Kann Defense: Panov-Botvinnik Attack",
    eco: "B14",
    variations: [

    ],
  },

  {
    id: "b15-caro-kann-defense",
    name: "Caro-Kann Defense",
    eco: "B15",
    variations: [

    ],
  },

  {
    id: "b15-caro-kann-defense-alekhine-gambit",
    name: "Caro-Kann Defense: Alekhine Gambit",
    eco: "B15",
    variations: [

    ],
  },

  {
    id: "b15-caro-kann-defense-alien-gambit",
    name: "Caro-Kann Defense: Alien Gambit",
    eco: "B15",
    variations: [

    ],
  },

  {
    id: "b15-caro-kann-defense-campomanes-attack",
    name: "Caro-Kann Defense: Campomanes Attack",
    eco: "B15",
    variations: [

    ],
  },

  {
    id: "b15-caro-kann-defense-forgacs-variation",
    name: "Caro-Kann Defense: Forgacs Variation",
    eco: "B15",
    variations: [

    ],
  },

  {
    id: "b15-caro-kann-defense-gurgenidze-counterattack",
    name: "Caro-Kann Defense: Gurgenidze Counterattack",
    eco: "B15",
    variations: [

    ],
  },

  {
    id: "b15-caro-kann-defense-gurgenidze-system",
    name: "Caro-Kann Defense: Gurgenidze System",
    eco: "B15",
    variations: [

    ],
  },

  {
    id: "b15-caro-kann-defense-main-line",
    name: "Caro-Kann Defense: Main Line",
    eco: "B15",
    variations: [

    ],
  },

  {
    id: "b15-caro-kann-defense-rasa-studier-gambit",
    name: "Caro-Kann Defense: Rasa-Studier Gambit",
    eco: "B15",
    variations: [

    ],
  },

  {
    id: "b15-caro-kann-defense-tartakower-variation",
    name: "Caro-Kann Defense: Tartakower Variation",
    eco: "B15",
    variations: [

    ],
  },

  {
    id: "b15-caro-kann-defense-tartakower-variation-perlis-line",
    name: "Caro-Kann Defense: Tartakower Variation, Perlis Line",
    eco: "B15",
    variations: [

    ],
  },

  {
    id: "b15-caro-kann-defense-von-hennig-gambit",
    name: "Caro-Kann Defense: von Hennig Gambit",
    eco: "B15",
    variations: [

    ],
  },

  {
    id: "b16-caro-kann-defense-bronstein-larsen-variation",
    name: "Caro-Kann Defense: Bronstein-Larsen Variation",
    eco: "B16",
    variations: [

    ],
  },

  {
    id: "b16-caro-kann-defense-finnish-variation",
    name: "Caro-Kann Defense: Finnish Variation",
    eco: "B16",
    variations: [

    ],
  },

  {
    id: "b17-caro-kann-defense-karpov-variation",
    name: "Caro-Kann Defense: Karpov Variation",
    eco: "B17",
    variations: [

    ],
  },

  {
    id: "b17-caro-kann-defense-karpov-variation-modern-main-line",
    name: "Caro-Kann Defense: Karpov Variation, Modern Main Line",
    eco: "B17",
    variations: [

    ],
  },

  {
    id: "b17-caro-kann-defense-karpov-variation-modern-variation",
    name: "Caro-Kann Defense: Karpov Variation, Modern Variation",
    eco: "B17",
    variations: [

    ],
  },

  {
    id: "b17-caro-kann-defense-karpov-variation-modern-variation-ivanchuk-defense",
    name: "Caro-Kann Defense: Karpov Variation, Modern Variation, Ivanchuk Defense",
    eco: "B17",
    variations: [

    ],
  },

  {
    id: "b17-caro-kann-defense-karpov-variation-modern-variation-kasparov-attack",
    name: "Caro-Kann Defense: Karpov Variation, Modern Variation, Kasparov Attack",
    eco: "B17",
    variations: [

    ],
  },

  {
    id: "b17-caro-kann-defense-karpov-variation-smyslov-variation",
    name: "Caro-Kann Defense: Karpov Variation, Smyslov Variation",
    eco: "B17",
    variations: [

    ],
  },

  {
    id: "b17-caro-kann-defense-karpov-variation-smyslov-variation-main-line",
    name: "Caro-Kann Defense: Karpov Variation, Smyslov Variation, Main Line",
    eco: "B17",
    variations: [

    ],
  },

  {
    id: "b17-caro-kann-defense-karpov-variation-tiviakov-fischer-attack",
    name: "Caro-Kann Defense: Karpov Variation, Tiviakov-Fischer Attack",
    eco: "B17",
    variations: [

    ],
  },

  {
    id: "b18-caro-kann-defense-classical-variation",
    name: "Caro-Kann Defense: Classical Variation",
    eco: "B18",
    variations: [

    ],
  },

  {
    id: "b18-caro-kann-defense-classical-variation-flohr-variation",
    name: "Caro-Kann Defense: Classical Variation, Flohr Variation",
    eco: "B18",
    variations: [

    ],
  },

  {
    id: "b18-caro-kann-defense-classical-variation-main-line",
    name: "Caro-Kann Defense: Classical Variation, Main Line",
    eco: "B18",
    variations: [

    ],
  },

  {
    id: "b18-caro-kann-defense-classical-variation-mar-czy-attack",
    name: "Caro-Kann Defense: Classical Variation, Maróczy Attack",
    eco: "B18",
    variations: [

    ],
  },

  {
    id: "b18-caro-kann-defense-martian-gambit",
    name: "Caro-Kann Defense: Martian Gambit",
    eco: "B18",
    variations: [

    ],
  },

  {
    id: "b19-caro-kann-defense-classical-variation",
    name: "Caro-Kann Defense: Classical Variation",
    eco: "B19",
    variations: [

    ],
  },

  {
    id: "b19-caro-kann-defense-classical-variation-lobron-system",
    name: "Caro-Kann Defense: Classical Variation, Lobron System",
    eco: "B19",
    variations: [

    ],
  },

  {
    id: "b19-caro-kann-defense-classical-variation-seirawan-variation",
    name: "Caro-Kann Defense: Classical Variation, Seirawan Variation",
    eco: "B19",
    variations: [

    ],
  },

  {
    id: "b19-caro-kann-defense-classical-variation-spassky-variation",
    name: "Caro-Kann Defense: Classical Variation, Spassky Variation",
    eco: "B19",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense",
    name: "Sicilian Defense",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-amazon-attack",
    name: "Sicilian Defense: Amazon Attack",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-big-clamp-formation",
    name: "Sicilian Defense: Big Clamp Formation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-bowdler-attack",
    name: "Sicilian Defense: Bowdler Attack",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-brick-variation",
    name: "Sicilian Defense: Brick Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-czerniak-attack",
    name: "Sicilian Defense: Czerniak Attack",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-czerniak-attack-queen-fianchetto-variation",
    name: "Sicilian Defense: Czerniak Attack, Queen Fianchetto Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-euwe-attack-prins-gambit",
    name: "Sicilian Defense: Euwe Attack, Prins Gambit",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-gloria-variation",
    name: "Sicilian Defense: Gloria Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-grob-variation",
    name: "Sicilian Defense: Grob Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-keres-variation",
    name: "Sicilian Defense: Keres Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-king-david-s-opening",
    name: "Sicilian Defense: King David",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-kronberger-variation",
    name: "Sicilian Defense: Kronberger Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-kronberger-variation-nemeth-gambit",
    name: "Sicilian Defense: Kronberger Variation, Nemeth Gambit",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-lasker-dunne-attack",
    name: "Sicilian Defense: Lasker-Dunne Attack",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-mengarini-variation",
    name: "Sicilian Defense: Mengarini Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-myers-attack-with-a4",
    name: "Sicilian Defense: Myers Attack, with a4",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-myers-attack-with-h4",
    name: "Sicilian Defense: Myers Attack, with h4",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-staunton-cochrane-variation",
    name: "Sicilian Defense: Staunton-Cochrane Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-wing-gambit",
    name: "Sicilian Defense: Wing Gambit",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-wing-gambit-abrahams-variation",
    name: "Sicilian Defense: Wing Gambit, Abrahams Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-wing-gambit-carlsbad-variation",
    name: "Sicilian Defense: Wing Gambit, Carlsbad Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-wing-gambit-marienbad-variation",
    name: "Sicilian Defense: Wing Gambit, Marienbad Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-wing-gambit-marshall-variation",
    name: "Sicilian Defense: Wing Gambit, Marshall Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-wing-gambit-nanu-gambit",
    name: "Sicilian Defense: Wing Gambit, Nanu Gambit",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-wing-gambit-romanian-defense",
    name: "Sicilian Defense: Wing Gambit, Romanian Defense",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b20-sicilian-defense-wing-gambit-santasiere-variation",
    name: "Sicilian Defense: Wing Gambit, Santasiere Variation",
    eco: "B20",
    variations: [

    ],
  },

  {
    id: "b21-bird-opening-dutch-variation-batavo-gambit",
    name: "Bird Opening: Dutch Variation, Batavo Gambit",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-coles-sicilian-gambit",
    name: "Sicilian Defense: Coles Sicilian Gambit",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-halasz-gambit",
    name: "Sicilian Defense: Halasz Gambit",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-mcdonnell-attack",
    name: "Sicilian Defense: McDonnell Attack",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-mcdonnell-attack-tal-gambit",
    name: "Sicilian Defense: McDonnell Attack, Tal Gambit",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-mcdonnell-attack-toilet-variation",
    name: "Sicilian Defense: McDonnell Attack, Toilet Variation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-morphy-gambit",
    name: "Sicilian Defense: Morphy Gambit",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-morphy-gambit-andreaschek-gambit",
    name: "Sicilian Defense: Morphy Gambit, Andreaschek Gambit",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit",
    name: "Sicilian Defense: Smith-Morra Gambit",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-chicago-defense",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Chicago Defense",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-classical-formation",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Classical Formation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-danish-variation",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Danish Variation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-fianchetto-defense",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Fianchetto Defense",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-finegold-defense",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Finegold Defense",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-kan-formation",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Kan Formation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-larsen-defense",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Larsen Defense",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-morphy-defense",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Morphy Defense",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-morphy-defense-deferred",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Morphy Defense Deferred",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-paulsen-formation",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Paulsen Formation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-pin-defense",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Pin Defense",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-scheveningen-formation",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Scheveningen Formation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-siberian-variation",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Siberian Variation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-siberian-variation-siberian-trap",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Siberian Variation, Siberian Trap",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-sozin-formation",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Sozin Formation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-accepted-taimanov-formation",
    name: "Sicilian Defense: Smith-Morra Gambit Accepted, Taimanov Formation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-declined-alapin-formation",
    name: "Sicilian Defense: Smith-Morra Gambit Declined, Alapin Formation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-declined-center-formation",
    name: "Sicilian Defense: Smith-Morra Gambit Declined, Center Formation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-declined-dubois-variation",
    name: "Sicilian Defense: Smith-Morra Gambit Declined, Dubois Variation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-declined-push-variation",
    name: "Sicilian Defense: Smith-Morra Gambit Declined, Push Variation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-declined-scandinavian-formation",
    name: "Sicilian Defense: Smith-Morra Gambit Declined, Scandinavian Formation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b21-sicilian-defense-smith-morra-gambit-declined-wing-formation",
    name: "Sicilian Defense: Smith-Morra Gambit Declined, Wing Formation",
    eco: "B21",
    variations: [

    ],
  },

  {
    id: "b22-sicilian-defense-alapin-variation",
    name: "Sicilian Defense: Alapin Variation",
    eco: "B22",
    variations: [

    ],
  },

  {
    id: "b22-sicilian-defense-alapin-variation-anti-alapin-gambit",
    name: "Sicilian Defense: Alapin Variation, Anti-Alapin Gambit",
    eco: "B22",
    variations: [

    ],
  },

  {
    id: "b22-sicilian-defense-alapin-variation-barmen-defense",
    name: "Sicilian Defense: Alapin Variation, Barmen Defense",
    eco: "B22",
    variations: [

    ],
  },

  {
    id: "b22-sicilian-defense-alapin-variation-barmen-defense-central-exchange",
    name: "Sicilian Defense: Alapin Variation, Barmen Defense, Central Exchange",
    eco: "B22",
    variations: [

    ],
  },

  {
    id: "b22-sicilian-defense-alapin-variation-barmen-defense-endgame-variation",
    name: "Sicilian Defense: Alapin Variation, Barmen Defense, Endgame Variation",
    eco: "B22",
    variations: [

    ],
  },

  {
    id: "b22-sicilian-defense-alapin-variation-barmen-defense-milner-barry-attack",
    name: "Sicilian Defense: Alapin Variation, Barmen Defense, Milner-Barry Attack",
    eco: "B22",
    variations: [

    ],
  },

  {
    id: "b22-sicilian-defense-alapin-variation-barmen-defense-modern-line",
    name: "Sicilian Defense: Alapin Variation, Barmen Defense, Modern Line",
    eco: "B22",
    variations: [

    ],
  },

  {
    id: "b22-sicilian-defense-alapin-variation-smith-morra-declined",
    name: "Sicilian Defense: Alapin Variation, Smith-Morra Declined",
    eco: "B22",
    variations: [

    ],
  },

  {
    id: "b22-sicilian-defense-alapin-variation-stoltz-attack",
    name: "Sicilian Defense: Alapin Variation, Stoltz Attack",
    eco: "B22",
    variations: [

    ],
  },

  {
    id: "b22-sicilian-defense-alapin-variation-stoltz-attack-ivanchuk-line",
    name: "Sicilian Defense: Alapin Variation, Stoltz Attack, Ivanchuk Line",
    eco: "B22",
    variations: [

    ],
  },

  {
    id: "b22-sicilian-defense-delayed-alapin-variation",
    name: "Sicilian Defense: Delayed Alapin Variation",
    eco: "B22",
    variations: [

    ],
  },

  {
    id: "b22-sicilian-defense-heidenfeld-variation",
    name: "Sicilian Defense: Heidenfeld Variation",
    eco: "B22",
    variations: [

    ],
  },

  {
    id: "b23-sicilian-defense-closed",
    name: "Sicilian Defense: Closed",
    eco: "B23",
    variations: [

    ],
  },

  {
    id: "b23-sicilian-defense-closed-carlsen-variation",
    name: "Sicilian Defense: Closed, Carlsen Variation",
    eco: "B23",
    variations: [

    ],
  },

  {
    id: "b23-sicilian-defense-closed-chameleon-variation",
    name: "Sicilian Defense: Closed, Chameleon Variation",
    eco: "B23",
    variations: [

    ],
  },

  {
    id: "b23-sicilian-defense-closed-grob-attack",
    name: "Sicilian Defense: Closed, Grob Attack",
    eco: "B23",
    variations: [

    ],
  },

  {
    id: "b23-sicilian-defense-closed-korchnoi-defense",
    name: "Sicilian Defense: Closed, Korchnoi Defense",
    eco: "B23",
    variations: [

    ],
  },

  {
    id: "b23-sicilian-defense-closed-portland-attack",
    name: "Sicilian Defense: Closed, Portland Attack",
    eco: "B23",
    variations: [

    ],
  },

  {
    id: "b23-sicilian-defense-closed-traditional",
    name: "Sicilian Defense: Closed, Traditional",
    eco: "B23",
    variations: [

    ],
  },

  {
    id: "b23-sicilian-defense-grand-prix-attack",
    name: "Sicilian Defense: Grand Prix Attack",
    eco: "B23",
    variations: [

    ],
  },

  {
    id: "b23-sicilian-defense-grand-prix-attack-schofman-variation",
    name: "Sicilian Defense: Grand Prix Attack, Schofman Variation",
    eco: "B23",
    variations: [

    ],
  },

  {
    id: "b24-sicilian-defense-closed",
    name: "Sicilian Defense: Closed",
    eco: "B24",
    variations: [

    ],
  },

  {
    id: "b24-sicilian-defense-closed-fianchetto-variation",
    name: "Sicilian Defense: Closed, Fianchetto Variation",
    eco: "B24",
    variations: [

    ],
  },

  {
    id: "b24-sicilian-defense-closed-smyslov-variation",
    name: "Sicilian Defense: Closed, Smyslov Variation",
    eco: "B24",
    variations: [

    ],
  },

  {
    id: "b25-sicilian-defense-closed",
    name: "Sicilian Defense: Closed",
    eco: "B25",
    variations: [

    ],
  },

  {
    id: "b25-sicilian-defense-closed-botvinnik-defense-edge-variation",
    name: "Sicilian Defense: Closed, Botvinnik Defense, Edge Variation",
    eco: "B25",
    variations: [

    ],
  },

  {
    id: "b25-sicilian-defense-closed-botvinnik-defense-with-nge2",
    name: "Sicilian Defense: Closed, Botvinnik Defense, with Nge2",
    eco: "B25",
    variations: [

    ],
  },

  {
    id: "b25-sicilian-defense-closed-botvinnik-defense-with-f4",
    name: "Sicilian Defense: Closed, Botvinnik Defense, with f4",
    eco: "B25",
    variations: [

    ],
  },

  {
    id: "b26-sicilian-defense-closed",
    name: "Sicilian Defense: Closed",
    eco: "B26",
    variations: [

    ],
  },

  {
    id: "b27-modern-defense-pterodactyl-variation",
    name: "Modern Defense: Pterodactyl Variation",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-pterodactyl-defense-sicilian-anhanguera",
    name: "Pterodactyl Defense: Sicilian, Anhanguera",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-pterodactyl-defense-sicilian-benoni-gambit",
    name: "Pterodactyl Defense: Sicilian, Benoni Gambit",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-pterodactyl-defense-sicilian-pteranodon",
    name: "Pterodactyl Defense: Sicilian, Pteranodon",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-pterodactyl-defense-sicilian-rhamphorhynchus",
    name: "Pterodactyl Defense: Sicilian, Rhamphorhynchus",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-pterodactyl-defense-sicilian-unpin",
    name: "Pterodactyl Defense: Sicilian, Unpin",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-pterodactyl-defense-western-pterodactyl",
    name: "Pterodactyl Defense: Western, Pterodactyl",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-pterodactyl-defense-western-rhamphorhynchus",
    name: "Pterodactyl Defense: Western, Rhamphorhynchus",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense",
    name: "Sicilian Defense",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-acton-extension",
    name: "Sicilian Defense: Acton Extension",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-brussels-gambit",
    name: "Sicilian Defense: Brussels Gambit",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-b-cker-variation",
    name: "Sicilian Defense: Bücker Variation",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-double-dutch-gambit",
    name: "Sicilian Defense: Double-Dutch Gambit",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-frederico-variation",
    name: "Sicilian Defense: Frederico Variation",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-hyperaccelerated-dragon",
    name: "Sicilian Defense: Hyperaccelerated Dragon",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-hyperaccelerated-pterodactyl",
    name: "Sicilian Defense: Hyperaccelerated Pterodactyl",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-hyperaccelerated-pterodactyl-exchange-variation",
    name: "Sicilian Defense: Hyperaccelerated Pterodactyl, Exchange Variation",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-jalalabad-variation",
    name: "Sicilian Defense: Jalalabad Variation",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-katalimov-variation",
    name: "Sicilian Defense: Katalimov Variation",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-mongoose-variation",
    name: "Sicilian Defense: Mongoose Variation",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-polish-gambit",
    name: "Sicilian Defense: Polish Gambit",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b27-sicilian-defense-quinteros-variation",
    name: "Sicilian Defense: Quinteros Variation",
    eco: "B27",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-aronin-system",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-kieseritzky-system",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-mar-czy-bind",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-mar-czy-bind-paulsen-line",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-mar-czy-bind-robatsch-line",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-normal-system",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-normal-system-cortlever-gambit",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-normal-system-smith-morra-line",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-normal-system-taimanov-line",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-normal-system-zagorovsky-line",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-quiet-system",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-r-ti-system",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-venice-system",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-venice-system-barcza-line",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-venice-system-gambit-line",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-venice-system-ljubojevic-line",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-venice-system-steiner-line",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-wing-gambit",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b28-sicilian-defense-o-kelly-variation-yerevan-system",
    name: "Sicilian Defense: O",
    eco: "B28",
    variations: [

    ],
  },

  {
    id: "b29-sicilian-defense-nimzowitsch-variation",
    name: "Sicilian Defense: Nimzowitsch Variation",
    eco: "B29",
    variations: [

    ],
  },

  {
    id: "b29-sicilian-defense-nimzowitsch-variation-advance-variation",
    name: "Sicilian Defense: Nimzowitsch Variation, Advance Variation",
    eco: "B29",
    variations: [

    ],
  },

  {
    id: "b29-sicilian-defense-nimzowitsch-variation-closed-variation",
    name: "Sicilian Defense: Nimzowitsch Variation, Closed Variation",
    eco: "B29",
    variations: [

    ],
  },

  {
    id: "b29-sicilian-defense-nimzowitsch-variation-exchange-variation",
    name: "Sicilian Defense: Nimzowitsch Variation, Exchange Variation",
    eco: "B29",
    variations: [

    ],
  },

  {
    id: "b29-sicilian-defense-nimzowitsch-variation-main-line",
    name: "Sicilian Defense: Nimzowitsch Variation, Main Line",
    eco: "B29",
    variations: [

    ],
  },

  {
    id: "b30-sicilian-defense-closed-anti-sveshnikov-variation",
    name: "Sicilian Defense: Closed, Anti-Sveshnikov Variation",
    eco: "B30",
    variations: [

    ],
  },

  {
    id: "b30-sicilian-defense-closed-anti-sveshnikov-variation-kharlov-kramnik-line",
    name: "Sicilian Defense: Closed, Anti-Sveshnikov Variation, Kharlov-Kramnik Line",
    eco: "B30",
    variations: [

    ],
  },

  {
    id: "b30-sicilian-defense-closed-anti-sveshnikov-variation-with-nf6",
    name: "Sicilian Defense: Closed, Anti-Sveshnikov Variation, with Nf6",
    eco: "B30",
    variations: [

    ],
  },

  {
    id: "b30-sicilian-defense-closed-anti-sveshnikov-variation-with-d6",
    name: "Sicilian Defense: Closed, Anti-Sveshnikov Variation, with d6",
    eco: "B30",
    variations: [

    ],
  },

  {
    id: "b30-sicilian-defense-nyezhmetdinov-rossolimo-attack",
    name: "Sicilian Defense: Nyezhmetdinov-Rossolimo Attack",
    eco: "B30",
    variations: [

    ],
  },

  {
    id: "b30-sicilian-defense-nyezhmetdinov-rossolimo-attack-brooklyn-retreat-defense",
    name: "Sicilian Defense: Nyezhmetdinov-Rossolimo Attack, Brooklyn Retreat Defense",
    eco: "B30",
    variations: [

    ],
  },

  {
    id: "b30-sicilian-defense-nyezhmetdinov-rossolimo-attack-san-francisco-gambit",
    name: "Sicilian Defense: Nyezhmetdinov-Rossolimo Attack, San Francisco Gambit",
    eco: "B30",
    variations: [

    ],
  },

  {
    id: "b30-sicilian-defense-old-sicilian",
    name: "Sicilian Defense: Old Sicilian",
    eco: "B30",
    variations: [

    ],
  },

  {
    id: "sicilian-open",
    name: "Sicilian Defense: Open Sicilian",
    eco: "B30",
    variations: [

    ],
  },

  {
    id: "b30-sicilian-defense-portsmouth-gambit",
    name: "Sicilian Defense: Portsmouth Gambit",
    eco: "B30",
    variations: [

    ],
  },

  {
    id: "b31-sicilian-defense-nyezhmetdinov-rossolimo-attack-fianchetto-variation",
    name: "Sicilian Defense: Nyezhmetdinov-Rossolimo Attack, Fianchetto Variation",
    eco: "B31",
    variations: [

    ],
  },

  {
    id: "b31-sicilian-defense-nyezhmetdinov-rossolimo-attack-fianchetto-variation-gufeld-gambit",
    name: "Sicilian Defense: Nyezhmetdinov-Rossolimo Attack, Fianchetto Variation, Gufeld Gambit",
    eco: "B31",
    variations: [

    ],
  },

  {
    id: "b31-sicilian-defense-nyezhmetdinov-rossolimo-attack-fianchetto-variation-lutikov-gambit",
    name: "Sicilian Defense: Nyezhmetdinov-Rossolimo Attack, Fianchetto Variation, Lutikov Gambit",
    eco: "B31",
    variations: [

    ],
  },

  {
    id: "b31-sicilian-defense-nyezhmetdinov-rossolimo-attack-fianchetto-variation-totsky-attack",
    name: "Sicilian Defense: Nyezhmetdinov-Rossolimo Attack, Fianchetto Variation, Totsky Attack",
    eco: "B31",
    variations: [

    ],
  },

  {
    id: "b31-sicilian-defense-nyezhmetdinov-rossolimo-attack-gurgenidze-variation",
    name: "Sicilian Defense: Nyezhmetdinov-Rossolimo Attack, Gurgenidze Variation",
    eco: "B31",
    variations: [

    ],
  },

  {
    id: "b32-sicilian-defense-accelerated-dragon",
    name: "Sicilian Defense: Accelerated Dragon",
    eco: "B32",
    variations: [

    ],
  },

  {
    id: "b32-sicilian-defense-flohr-variation",
    name: "Sicilian Defense: Flohr Variation",
    eco: "B32",
    variations: [

    ],
  },

  {
    id: "b32-sicilian-defense-franco-sicilian-variation",
    name: "Sicilian Defense: Franco-Sicilian Variation",
    eco: "B32",
    variations: [

    ],
  },

  {
    id: "b32-sicilian-defense-godiva-variation",
    name: "Sicilian Defense: Godiva Variation",
    eco: "B32",
    variations: [

    ],
  },

  {
    id: "b32-sicilian-defense-kalashnikov-variation",
    name: "Sicilian Defense: Kalashnikov Variation",
    eco: "B32",
    variations: [

    ],
  },

  {
    id: "b32-sicilian-defense-l-wenthal-variation",
    name: "Sicilian Defense: Löwenthal Variation",
    eco: "B32",
    variations: [

    ],
  },

  {
    id: "b32-sicilian-defense-nimzo-american-variation",
    name: "Sicilian Defense: Nimzo-American Variation",
    eco: "B32",
    variations: [

    ],
  },

  {
    id: "b32-sicilian-defense-o-kelly-variation-mar-czy-bind-geller-line",
    name: "Sicilian Defense: O",
    eco: "B32",
    variations: [

    ],
  },

  {
    id: "b32-sicilian-defense-open",
    name: "Sicilian Defense: Open",
    eco: "B32",
    variations: [

    ],
  },

  {
    id: "b33-sicilian-defense-lasker-pelikan-variation",
    name: "Sicilian Defense: Lasker-Pelikan Variation",
    eco: "B33",
    variations: [

    ],
  },

  {
    id: "b33-sicilian-defense-lasker-pelikan-variation-bird-variation",
    name: "Sicilian Defense: Lasker-Pelikan Variation, Bird Variation",
    eco: "B33",
    variations: [

    ],
  },

  {
    id: "b33-sicilian-defense-lasker-pelikan-variation-exchange-variation",
    name: "Sicilian Defense: Lasker-Pelikan Variation, Exchange Variation",
    eco: "B33",
    variations: [

    ],
  },

  {
    id: "b33-sicilian-defense-lasker-pelikan-variation-retreat-variation",
    name: "Sicilian Defense: Lasker-Pelikan Variation, Retreat Variation",
    eco: "B33",
    variations: [

    ],
  },

  {
    id: "b33-sicilian-defense-lasker-pelikan-variation-schlechter-variation",
    name: "Sicilian Defense: Lasker-Pelikan Variation, Schlechter Variation",
    eco: "B33",
    variations: [

    ],
  },

  {
    id: "b33-sicilian-defense-lasker-pelikan-variation-sveshnikov-variation",
    name: "Sicilian Defense: Lasker-Pelikan Variation, Sveshnikov Variation",
    eco: "B33",
    variations: [

    ],
  },

  {
    id: "b33-sicilian-defense-lasker-pelikan-variation-sveshnikov-variation-chelyabinsk-variation",
    name: "Sicilian Defense: Lasker-Pelikan Variation, Sveshnikov Variation, Chelyabinsk Variation",
    eco: "B33",
    variations: [

    ],
  },

  {
    id: "b33-sicilian-defense-lasker-pelikan-variation-sveshnikov-variation-novosibirsk-variation",
    name: "Sicilian Defense: Lasker-Pelikan Variation, Sveshnikov Variation, Novosibirsk Variation",
    eco: "B33",
    variations: [

    ],
  },

  {
    id: "b33-sicilian-defense-lasker-pelikan-variation-sveshnikov-variation-peresypkin-s-sacrifice",
    name: "Sicilian Defense: Lasker-Pelikan Variation, Sveshnikov Variation, Peresypkin",
    eco: "B33",
    variations: [

    ],
  },

  {
    id: "b33-sicilian-defense-open",
    name: "Sicilian Defense: Open",
    eco: "B33",
    variations: [

    ],
  },

  {
    id: "sicilian-prins",
    name: "Sicilian Defense: Prins Variation",
    eco: "B33",
    variations: [

    ],
  },

  {
    id: "sicilian-sveshnikov",
    name: "Sicilian Defense: Sveshnikov Variation",
    eco: "B33",
    variations: [

    ],
  },

  {
    id: "sicilian-accelerated-dragon",
    name: "Sicilian Defense: Accelerated Dragon",
    eco: "B34",
    variations: [

    ],
  },

  {
    id: "b34-sicilian-defense-accelerated-dragon-exchange-variation",
    name: "Sicilian Defense: Accelerated Dragon, Exchange Variation",
    eco: "B34",
    variations: [

    ],
  },

  {
    id: "b34-sicilian-defense-accelerated-dragon-modern-variation",
    name: "Sicilian Defense: Accelerated Dragon, Modern Variation",
    eco: "B34",
    variations: [

    ],
  },

  {
    id: "b35-sicilian-defense-accelerated-dragon-modern-bc4-variation",
    name: "Sicilian Defense: Accelerated Dragon, Modern Bc4 Variation",
    eco: "B35",
    variations: [

    ],
  },

  {
    id: "b35-sicilian-defense-dragon-variation-modern-bc4-variation",
    name: "Sicilian Defense: Dragon Variation, Modern Bc4 Variation",
    eco: "B35",
    variations: [

    ],
  },

  {
    id: "b36-sicilian-defense-accelerated-dragon-mar-czy-bind",
    name: "Sicilian Defense: Accelerated Dragon, Maróczy Bind",
    eco: "B36",
    variations: [

    ],
  },

  {
    id: "b36-sicilian-defense-accelerated-dragon-mar-czy-bind-gurgenidze-variation",
    name: "Sicilian Defense: Accelerated Dragon, Maróczy Bind, Gurgenidze Variation",
    eco: "B36",
    variations: [

    ],
  },

  {
    id: "b37-sicilian-defense-accelerated-dragon-mar-czy-bind",
    name: "Sicilian Defense: Accelerated Dragon, Maróczy Bind",
    eco: "B37",
    variations: [

    ],
  },

  {
    id: "b37-sicilian-defense-accelerated-dragon-simagin-variation",
    name: "Sicilian Defense: Accelerated Dragon, Simagin Variation",
    eco: "B37",
    variations: [

    ],
  },

  {
    id: "b38-sicilian-defense-accelerated-dragon-mar-czy-bind",
    name: "Sicilian Defense: Accelerated Dragon, Maróczy Bind",
    eco: "B38",
    variations: [

    ],
  },

  {
    id: "b39-sicilian-defense-accelerated-dragon-mar-czy-bind-breyer-variation",
    name: "Sicilian Defense: Accelerated Dragon, Maróczy Bind, Breyer Variation",
    eco: "B39",
    variations: [

    ],
  },

  {
    id: "sicilian-owsl",
    name: "Sicilian Defense: OWSM Variation",
    eco: "B39",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-alapin-variation-sherzer-variation",
    name: "Sicilian Defense: Alapin Variation, Sherzer Variation",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-delayed-alapin-variation-with-e6",
    name: "Sicilian Defense: Delayed Alapin Variation, with e6",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-drazic-variation",
    name: "Sicilian Defense: Drazic Variation",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-french-variation",
    name: "Sicilian Defense: French Variation",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-french-variation-normal",
    name: "Sicilian Defense: French Variation, Normal",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-french-variation-open",
    name: "Sicilian Defense: French Variation, Open",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-french-variation-westerinen-attack",
    name: "Sicilian Defense: French Variation, Westerinen Attack",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-gaw-paw-variation",
    name: "Sicilian Defense: Gaw-Paw Variation",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-kan-variation-wing-attack-fianchetto-variation",
    name: "Sicilian Defense: Kan Variation, Wing Attack, Fianchetto Variation",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-kramnik-variation",
    name: "Sicilian Defense: Kramnik Variation",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-kveinis-variation",
    name: "Sicilian Defense: Kveinis Variation",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-marshall-counterattack",
    name: "Sicilian Defense: Marshall Counterattack",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-paulsen-basman-defense",
    name: "Sicilian Defense: Paulsen-Basman Defense",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-pin-variation",
    name: "Sicilian Defense: Pin Variation",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-pin-variation-jaffe-variation",
    name: "Sicilian Defense: Pin Variation, Jaffe Variation",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-pin-variation-koch-variation",
    name: "Sicilian Defense: Pin Variation, Koch Variation",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-smith-morra-gambit-deferred",
    name: "Sicilian Defense: Smith-Morra Gambit Deferred",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b40-sicilian-defense-wing-gambit-deferred",
    name: "Sicilian Defense: Wing Gambit Deferred",
    eco: "B40",
    variations: [

    ],
  },

  {
    id: "b41-sicilian-defense-kan-variation",
    name: "Sicilian Defense: Kan Variation",
    eco: "B41",
    variations: [

    ],
  },

  {
    id: "b41-sicilian-defense-kan-variation-mar-czy-bind-bronstein-variation",
    name: "Sicilian Defense: Kan Variation, Maróczy Bind, Bronstein Variation",
    eco: "B41",
    variations: [

    ],
  },

  {
    id: "b41-sicilian-defense-kan-variation-mar-czy-bind-hedgehog-variation",
    name: "Sicilian Defense: Kan Variation, Maróczy Bind, Hedgehog Variation",
    eco: "B41",
    variations: [

    ],
  },

  {
    id: "b41-sicilian-defense-kan-variation-mar-czy-bind-r-ti-variation",
    name: "Sicilian Defense: Kan Variation, Maróczy Bind, Réti Variation",
    eco: "B41",
    variations: [

    ],
  },

  {
    id: "b42-sicilian-defense-kan-variation-gipslis-variation",
    name: "Sicilian Defense: Kan Variation, Gipslis Variation",
    eco: "B42",
    variations: [

    ],
  },

  {
    id: "b42-sicilian-defense-kan-variation-modern-variation",
    name: "Sicilian Defense: Kan Variation, Modern Variation",
    eco: "B42",
    variations: [

    ],
  },

  {
    id: "b42-sicilian-defense-kan-variation-polugaevsky-variation",
    name: "Sicilian Defense: Kan Variation, Polugaevsky Variation",
    eco: "B42",
    variations: [

    ],
  },

  {
    id: "b42-sicilian-defense-kan-variation-swiss-cheese-variation",
    name: "Sicilian Defense: Kan Variation, Swiss Cheese Variation",
    eco: "B42",
    variations: [

    ],
  },

  {
    id: "b43-sicilian-defense-kan-variation-knight-variation",
    name: "Sicilian Defense: Kan Variation, Knight Variation",
    eco: "B43",
    variations: [

    ],
  },

  {
    id: "b43-sicilian-defense-kan-variation-wing-attack",
    name: "Sicilian Defense: Kan Variation, Wing Attack",
    eco: "B43",
    variations: [

    ],
  },

  {
    id: "b43-sicilian-defense-kan-variation-wing-attack-christiansen-s-dream",
    name: "Sicilian Defense: Kan Variation, Wing Attack, Christiansen",
    eco: "B43",
    variations: [

    ],
  },

  {
    id: "b43-sicilian-defense-kan-variation-wing-attack-spraggett-attack",
    name: "Sicilian Defense: Kan Variation, Wing Attack, Spraggett Attack",
    eco: "B43",
    variations: [

    ],
  },

  {
    id: "b44-sicilian-defense-taimanov-variation",
    name: "Sicilian Defense: Taimanov Variation",
    eco: "B44",
    variations: [

    ],
  },

  {
    id: "b44-sicilian-defense-taimanov-variation-gary-gambit",
    name: "Sicilian Defense: Taimanov Variation, Gary Gambit",
    eco: "B44",
    variations: [

    ],
  },

  {
    id: "b44-sicilian-defense-taimanov-variation-modern-line",
    name: "Sicilian Defense: Taimanov Variation, Modern Line",
    eco: "B44",
    variations: [

    ],
  },

  {
    id: "b44-sicilian-defense-taimanov-variation-sz-n-variation",
    name: "Sicilian Defense: Taimanov Variation, Szén Variation",
    eco: "B44",
    variations: [

    ],
  },

  {
    id: "b45-sicilian-defense-four-knights-variation",
    name: "Sicilian Defense: Four Knights Variation",
    eco: "B45",
    variations: [

    ],
  },

  {
    id: "b45-sicilian-defense-four-knights-variation-american-attack",
    name: "Sicilian Defense: Four Knights Variation, American Attack",
    eco: "B45",
    variations: [

    ],
  },

  {
    id: "b45-sicilian-defense-four-knights-variation-cobra-variation",
    name: "Sicilian Defense: Four Knights Variation, Cobra Variation",
    eco: "B45",
    variations: [

    ],
  },

  {
    id: "b45-sicilian-defense-four-knights-variation-exchange-variation",
    name: "Sicilian Defense: Four Knights Variation, Exchange Variation",
    eco: "B45",
    variations: [

    ],
  },

  {
    id: "b45-sicilian-defense-four-knights-variation-sveshnikov-transfer",
    name: "Sicilian Defense: Four Knights Variation, Sveshnikov Transfer",
    eco: "B45",
    variations: [

    ],
  },

  {
    id: "b45-sicilian-defense-taimanov-variation",
    name: "Sicilian Defense: Taimanov Variation",
    eco: "B45",
    variations: [

    ],
  },

  {
    id: "b46-sicilian-defense-taimanov-variation",
    name: "Sicilian Defense: Taimanov Variation",
    eco: "B46",
    variations: [

    ],
  },

  {
    id: "b47-sicilian-defense-taimanov-variation-bastrikov-variation",
    name: "Sicilian Defense: Taimanov Variation, Bastrikov Variation",
    eco: "B47",
    variations: [

    ],
  },

  {
    id: "b47-sicilian-defense-taimanov-variation-bastrikov-variation-ponomariov-gambit",
    name: "Sicilian Defense: Taimanov Variation, Bastrikov Variation, Ponomariov Gambit",
    eco: "B47",
    variations: [

    ],
  },

  {
    id: "b48-sicilian-defense-taimanov-variation-bastrikov-variation-english-attack",
    name: "Sicilian Defense: Taimanov Variation, Bastrikov Variation, English Attack",
    eco: "B48",
    variations: [

    ],
  },

  {
    id: "b49-sicilian-defense-taimanov-variation-bastrikov-variation",
    name: "Sicilian Defense: Taimanov Variation, Bastrikov Variation",
    eco: "B49",
    variations: [

    ],
  },

  {
    id: "b50-sicilian-defense",
    name: "Sicilian Defense",
    eco: "B50",
    variations: [

    ],
  },

  {
    id: "b50-sicilian-defense-delayed-alapin-variation-basman-palatnik-double-gambit",
    name: "Sicilian Defense: Delayed Alapin Variation, Basman-Palatnik Double Gambit",
    eco: "B50",
    variations: [

    ],
  },

  {
    id: "b50-sicilian-defense-delayed-alapin-variation-basman-palatnik-gambit",
    name: "Sicilian Defense: Delayed Alapin Variation, Basman-Palatnik Gambit",
    eco: "B50",
    variations: [

    ],
  },

  {
    id: "b50-sicilian-defense-delayed-alapin-variation-with-d6",
    name: "Sicilian Defense: Delayed Alapin Variation, with d6",
    eco: "B50",
    variations: [

    ],
  },

  {
    id: "b50-sicilian-defense-kopec-system",
    name: "Sicilian Defense: Kopec System",
    eco: "B50",
    variations: [

    ],
  },

  {
    id: "b50-sicilian-defense-kotov-gambit",
    name: "Sicilian Defense: Kotov Gambit",
    eco: "B50",
    variations: [

    ],
  },

  {
    id: "b50-sicilian-defense-modern-variations",
    name: "Sicilian Defense: Modern Variations",
    eco: "B50",
    variations: [

    ],
  },

  {
    id: "b50-sicilian-defense-modern-variations-anti-qxd4-move-order",
    name: "Sicilian Defense: Modern Variations, Anti-Qxd4 Move Order",
    eco: "B50",
    variations: [

    ],
  },

  {
    id: "b50-sicilian-defense-modern-variations-anti-qxd4-move-order-accepted",
    name: "Sicilian Defense: Modern Variations, Anti-Qxd4 Move Order Accepted",
    eco: "B50",
    variations: [

    ],
  },

  {
    id: "b50-sicilian-defense-modern-variations-tartakower",
    name: "Sicilian Defense: Modern Variations, Tartakower",
    eco: "B50",
    variations: [

    ],
  },

  {
    id: "b50-sicilian-defense-wing-gambit-deferred-variation",
    name: "Sicilian Defense: Wing Gambit, Deferred Variation",
    eco: "B50",
    variations: [

    ],
  },

  {
    id: "b51-sicilian-defense-moscow-variation",
    name: "Sicilian Defense: Moscow Variation",
    eco: "B51",
    variations: [

    ],
  },

  {
    id: "b51-sicilian-defense-moscow-variation-dorfman-gambit",
    name: "Sicilian Defense: Moscow Variation, Dorfman Gambit",
    eco: "B51",
    variations: [

    ],
  },

  {
    id: "b51-sicilian-defense-moscow-variation-moscow-gambit",
    name: "Sicilian Defense: Moscow Variation, Moscow Gambit",
    eco: "B51",
    variations: [

    ],
  },

  {
    id: "b52-sicilian-defense-moscow-variation-haag-gambit",
    name: "Sicilian Defense: Moscow Variation, Haag Gambit",
    eco: "B52",
    variations: [

    ],
  },

  {
    id: "b52-sicilian-defense-moscow-variation-main-line",
    name: "Sicilian Defense: Moscow Variation, Main Line",
    eco: "B52",
    variations: [

    ],
  },

  {
    id: "b52-sicilian-defense-moscow-variation-sokolsky-variation",
    name: "Sicilian Defense: Moscow Variation, Sokolsky Variation",
    eco: "B52",
    variations: [

    ],
  },

  {
    id: "b53-sicilian-defense-chekhover-variation",
    name: "Sicilian Defense: Chekhover Variation",
    eco: "B53",
    variations: [

    ],
  },

  {
    id: "b53-sicilian-defense-chekhover-variation-zaitsev-defense",
    name: "Sicilian Defense: Chekhover Variation, Zaitsev Defense",
    eco: "B53",
    variations: [

    ],
  },

  {
    id: "b54-sicilian-defense-dragon-variation-accelerated-dragon",
    name: "Sicilian Defense: Dragon Variation, Accelerated Dragon",
    eco: "B54",
    variations: [

    ],
  },

  {
    id: "b54-sicilian-defense-modern-variations-ginsberg-gambit",
    name: "Sicilian Defense: Modern Variations, Ginsberg Gambit",
    eco: "B54",
    variations: [

    ],
  },

  {
    id: "b54-sicilian-defense-modern-variations-main-line",
    name: "Sicilian Defense: Modern Variations, Main Line",
    eco: "B54",
    variations: [

    ],
  },

  {
    id: "b54-sicilian-defense-prins-variation",
    name: "Sicilian Defense: Prins Variation",
    eco: "B54",
    variations: [

    ],
  },

  {
    id: "b55-sicilian-defense-prins-variation-venice-attack",
    name: "Sicilian Defense: Prins Variation, Venice Attack",
    eco: "B55",
    variations: [

    ],
  },

  {
    id: "b56-sicilian-defense-classical-variation",
    name: "Sicilian Defense: Classical Variation",
    eco: "B56",
    variations: [

    ],
  },

  {
    id: "b56-sicilian-defense-classical-variation-fianchetto-variation",
    name: "Sicilian Defense: Classical Variation, Fianchetto Variation",
    eco: "B56",
    variations: [

    ],
  },

  {
    id: "b56-sicilian-defense-kupreichik-variation",
    name: "Sicilian Defense: Kupreichik Variation",
    eco: "B56",
    variations: [

    ],
  },

  {
    id: "b56-sicilian-defense-spielmann-variation",
    name: "Sicilian Defense: Spielmann Variation",
    eco: "B56",
    variations: [

    ],
  },

  {
    id: "b56-sicilian-defense-venice-attack",
    name: "Sicilian Defense: Venice Attack",
    eco: "B56",
    variations: [

    ],
  },

  {
    id: "b57-sicilian-defense-classical-variation-anti-sozin-variation",
    name: "Sicilian Defense: Classical Variation, Anti-Sozin Variation",
    eco: "B57",
    variations: [

    ],
  },

  {
    id: "b57-sicilian-defense-classical-variation-sozin-attack",
    name: "Sicilian Defense: Classical Variation, Sozin Attack",
    eco: "B57",
    variations: [

    ],
  },

  {
    id: "b57-sicilian-defense-magnus-smith-trap",
    name: "Sicilian Defense: Magnus Smith Trap",
    eco: "B57",
    variations: [

    ],
  },

  {
    id: "b58-sicilian-defense-boleslavsky-variation",
    name: "Sicilian Defense: Boleslavsky Variation",
    eco: "B58",
    variations: [

    ],
  },

  {
    id: "b58-sicilian-defense-boleslavsky-variation-louma-variation",
    name: "Sicilian Defense: Boleslavsky Variation, Louma Variation",
    eco: "B58",
    variations: [

    ],
  },

  {
    id: "b58-sicilian-defense-classical-variation",
    name: "Sicilian Defense: Classical Variation",
    eco: "B58",
    variations: [

    ],
  },

  {
    id: "b58-sicilian-defense-classical-variation-dragon-transfer",
    name: "Sicilian Defense: Classical Variation, Dragon Transfer",
    eco: "B58",
    variations: [

    ],
  },

  {
    id: "b59-sicilian-defense-boleslavsky-variation",
    name: "Sicilian Defense: Boleslavsky Variation",
    eco: "B59",
    variations: [

    ],
  },

  {
    id: "b60-sicilian-defense-richter-rauzer-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation",
    eco: "B60",
    variations: [

    ],
  },

  {
    id: "b60-sicilian-defense-richter-rauzer-variation-dragon-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Dragon Variation",
    eco: "B60",
    variations: [

    ],
  },

  {
    id: "b60-sicilian-defense-richter-rauzer-variation-modern-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Modern Variation",
    eco: "B60",
    variations: [

    ],
  },

  {
    id: "b61-sicilian-defense-richter-rauzer-variation-modern-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Modern Variation",
    eco: "B61",
    variations: [

    ],
  },

  {
    id: "b62-sicilian-defense-richter-rauzer-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation",
    eco: "B62",
    variations: [

    ],
  },

  {
    id: "b62-sicilian-defense-richter-rauzer-variation-exchange-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Exchange Variation",
    eco: "B62",
    variations: [

    ],
  },

  {
    id: "b62-sicilian-defense-richter-rauzer-variation-podebrady-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Podebrady Variation",
    eco: "B62",
    variations: [

    ],
  },

  {
    id: "b62-sicilian-defense-richter-rauzer-variation-vitolins-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Vitolins Variation",
    eco: "B62",
    variations: [

    ],
  },

  {
    id: "b63-sicilian-defense-richter-rauzer-variation-classical-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Classical Variation",
    eco: "B63",
    variations: [

    ],
  },

  {
    id: "b63-sicilian-defense-richter-rauzer-variation-classical-variation-kantscher-line",
    name: "Sicilian Defense: Richter-Rauzer Variation, Classical Variation, Kantscher Line",
    eco: "B63",
    variations: [

    ],
  },

  {
    id: "b63-sicilian-defense-richter-rauzer-variation-ivanov-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Ivanov Variation",
    eco: "B63",
    variations: [

    ],
  },

  {
    id: "b63-sicilian-defense-richter-rauzer-variation-traditional-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Traditional Variation",
    eco: "B63",
    variations: [

    ],
  },

  {
    id: "b64-sicilian-defense-richter-rauzer-variation-classical-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Classical Variation",
    eco: "B64",
    variations: [

    ],
  },

  {
    id: "b65-sicilian-defense-richter-rauzer-variation-classical-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Classical Variation",
    eco: "B65",
    variations: [

    ],
  },

  {
    id: "b65-sicilian-defense-richter-rauzer-variation-rauzer-attack",
    name: "Sicilian Defense: Richter-Rauzer Variation, Rauzer Attack",
    eco: "B65",
    variations: [

    ],
  },

  {
    id: "b66-sicilian-defense-richter-rauzer-variation-neo-modern-variation-early-deviations",
    name: "Sicilian Defense: Richter-Rauzer Variation, Neo-Modern Variation, Early Deviations",
    eco: "B66",
    variations: [

    ],
  },

  {
    id: "b67-sicilian-defense-richter-rauzer-variation-neo-modern-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Neo-Modern Variation",
    eco: "B67",
    variations: [

    ],
  },

  {
    id: "b68-sicilian-defense-richter-rauzer-variation-neo-modern-variation",
    name: "Sicilian Defense: Richter-Rauzer Variation, Neo-Modern Variation",
    eco: "B68",
    variations: [

    ],
  },

  {
    id: "b69-sicilian-defense-richter-rauzer-variation-neo-modern-variation-nyezhmetdinov-attack",
    name: "Sicilian Defense: Richter-Rauzer Variation, Neo-Modern Variation, Nyezhmetdinov Attack",
    eco: "B69",
    variations: [

    ],
  },

  {
    id: "b70-sicilian-defense-dragon-variation",
    name: "Sicilian Defense: Dragon Variation",
    eco: "B70",
    variations: [

    ],
  },

  {
    id: "b70-sicilian-defense-dragon-variation-classical-variation",
    name: "Sicilian Defense: Dragon Variation, Classical Variation",
    eco: "B70",
    variations: [

    ],
  },

  {
    id: "b70-sicilian-defense-dragon-variation-fianchetto-variation",
    name: "Sicilian Defense: Dragon Variation, Fianchetto Variation",
    eco: "B70",
    variations: [

    ],
  },

  {
    id: "b71-sicilian-defense-dragon-variation-levenfish-variation",
    name: "Sicilian Defense: Dragon Variation, Levenfish Variation",
    eco: "B71",
    variations: [

    ],
  },

  {
    id: "b71-sicilian-defense-dragon-variation-levenfish-variation-main-line",
    name: "Sicilian Defense: Dragon Variation, Levenfish Variation, Main Line",
    eco: "B71",
    variations: [

    ],
  },

  {
    id: "b72-sicilian-defense-dragon-variation",
    name: "Sicilian Defense: Dragon Variation",
    eco: "B72",
    variations: [

    ],
  },

  {
    id: "b72-sicilian-defense-dragon-variation-classical-variation",
    name: "Sicilian Defense: Dragon Variation, Classical Variation",
    eco: "B72",
    variations: [

    ],
  },

  {
    id: "b72-sicilian-defense-dragon-variation-classical-variation-amsterdam-variation",
    name: "Sicilian Defense: Dragon Variation, Classical Variation, Amsterdam Variation",
    eco: "B72",
    variations: [

    ],
  },

  {
    id: "b72-sicilian-defense-dragon-variation-classical-variation-grigoriev-variation",
    name: "Sicilian Defense: Dragon Variation, Classical Variation, Grigoriev Variation",
    eco: "B72",
    variations: [

    ],
  },

  {
    id: "b73-sicilian-defense-dragon-variation-classical-variation",
    name: "Sicilian Defense: Dragon Variation, Classical Variation",
    eco: "B73",
    variations: [

    ],
  },

  {
    id: "b73-sicilian-defense-dragon-variation-classical-variation-battery-variation",
    name: "Sicilian Defense: Dragon Variation, Classical Variation, Battery Variation",
    eco: "B73",
    variations: [

    ],
  },

  {
    id: "b73-sicilian-defense-dragon-variation-classical-variation-zollner-gambit",
    name: "Sicilian Defense: Dragon Variation, Classical Variation, Zollner Gambit",
    eco: "B73",
    variations: [

    ],
  },

  {
    id: "b74-sicilian-defense-dragon-variation-classical-variation-alekhine-line",
    name: "Sicilian Defense: Dragon Variation, Classical Variation, Alekhine Line",
    eco: "B74",
    variations: [

    ],
  },

  {
    id: "b74-sicilian-defense-dragon-variation-classical-variation-bernard-defense",
    name: "Sicilian Defense: Dragon Variation, Classical Variation, Bernard Defense",
    eco: "B74",
    variations: [

    ],
  },

  {
    id: "b74-sicilian-defense-dragon-variation-classical-variation-mar-czy-line",
    name: "Sicilian Defense: Dragon Variation, Classical Variation, Maróczy Line",
    eco: "B74",
    variations: [

    ],
  },

  {
    id: "b74-sicilian-defense-dragon-variation-classical-variation-normal-line",
    name: "Sicilian Defense: Dragon Variation, Classical Variation, Normal Line",
    eco: "B74",
    variations: [

    ],
  },

  {
    id: "b74-sicilian-defense-dragon-variation-classical-variation-spielmann-variation",
    name: "Sicilian Defense: Dragon Variation, Classical Variation, Spielmann Variation",
    eco: "B74",
    variations: [

    ],
  },

  {
    id: "b74-sicilian-defense-dragon-variation-classical-variation-stockholm-attack",
    name: "Sicilian Defense: Dragon Variation, Classical Variation, Stockholm Attack",
    eco: "B74",
    variations: [

    ],
  },

  {
    id: "b74-sicilian-defense-dragon-variation-classical-variation-tartakower-line",
    name: "Sicilian Defense: Dragon Variation, Classical Variation, Tartakower Line",
    eco: "B74",
    variations: [

    ],
  },

  {
    id: "b75-sicilian-defense-dragon-variation-yugoslav-attack-belezky-line",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Belezky Line",
    eco: "B75",
    variations: [

    ],
  },

  {
    id: "b75-sicilian-defense-dragon-variation-yugoslav-attack-early-deviations",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Early Deviations",
    eco: "B75",
    variations: [

    ],
  },

  {
    id: "b75-sicilian-defense-dragon-variation-yugoslav-attack-hungarian-dragon",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Hungarian Dragon",
    eco: "B75",
    variations: [

    ],
  },

  {
    id: "b76-sicilian-defense-dragon-variation-yugoslav-attack",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack",
    eco: "B76",
    variations: [

    ],
  },

  {
    id: "b76-sicilian-defense-dragon-variation-yugoslav-attack-modern-line",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Modern Line",
    eco: "B76",
    variations: [

    ],
  },

  {
    id: "b76-sicilian-defense-dragon-variation-yugoslav-attack-panov-variation",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Panov Variation",
    eco: "B76",
    variations: [

    ],
  },

  {
    id: "b77-sicilian-defense-dragon-variation-yugoslav-attack-byrne-variation",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Byrne Variation",
    eco: "B77",
    variations: [

    ],
  },

  {
    id: "b77-sicilian-defense-dragon-variation-yugoslav-attack-czerniak-variation",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Czerniak Variation",
    eco: "B77",
    variations: [

    ],
  },

  {
    id: "b77-sicilian-defense-dragon-variation-yugoslav-attack-main-line",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Main Line",
    eco: "B77",
    variations: [

    ],
  },

  {
    id: "b77-sicilian-defense-dragon-variation-yugoslav-attack-sosonko-variation",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Sosonko Variation",
    eco: "B77",
    variations: [

    ],
  },

  {
    id: "b78-sicilian-defense-dragon-variation-yugoslav-attack",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack",
    eco: "B78",
    variations: [

    ],
  },

  {
    id: "b78-sicilian-defense-dragon-variation-yugoslav-attack-chinese-dragon",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Chinese Dragon",
    eco: "B78",
    variations: [

    ],
  },

  {
    id: "b78-sicilian-defense-dragon-variation-yugoslav-attack-old-line",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Old Line",
    eco: "B78",
    variations: [

    ],
  },

  {
    id: "b78-sicilian-defense-dragon-variation-yugoslav-attack-topalov-variation",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Topalov Variation",
    eco: "B78",
    variations: [

    ],
  },

  {
    id: "b79-sicilian-defense-dragon-variation-yugoslav-attack",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack",
    eco: "B79",
    variations: [

    ],
  },

  {
    id: "b79-sicilian-defense-dragon-variation-yugoslav-attack-soltis-variation",
    name: "Sicilian Defense: Dragon Variation, Yugoslav Attack, Soltis Variation",
    eco: "B79",
    variations: [

    ],
  },

  {
    id: "b80-sicilian-defense-scheveningen-variation",
    name: "Sicilian Defense: Scheveningen Variation",
    eco: "B80",
    variations: [

    ],
  },

  {
    id: "b80-sicilian-defense-scheveningen-variation-english-attack-with-qd2",
    name: "Sicilian Defense: Scheveningen Variation, English Attack, with Qd2",
    eco: "B80",
    variations: [

    ],
  },

  {
    id: "b80-sicilian-defense-scheveningen-variation-fianchetto-variation",
    name: "Sicilian Defense: Scheveningen Variation, Fianchetto Variation",
    eco: "B80",
    variations: [

    ],
  },

  {
    id: "b80-sicilian-defense-scheveningen-variation-vitolins-variation",
    name: "Sicilian Defense: Scheveningen Variation, Vitolins Variation",
    eco: "B80",
    variations: [

    ],
  },

  {
    id: "b81-sicilian-defense-scheveningen-variation-keres-attack",
    name: "Sicilian Defense: Scheveningen Variation, Keres Attack",
    eco: "B81",
    variations: [

    ],
  },

  {
    id: "b82-sicilian-defense-scheveningen-variation-matanovic-attack",
    name: "Sicilian Defense: Scheveningen Variation, Matanovic Attack",
    eco: "B82",
    variations: [

    ],
  },

  {
    id: "b82-sicilian-defense-scheveningen-variation-tal-variation",
    name: "Sicilian Defense: Scheveningen Variation, Tal Variation",
    eco: "B82",
    variations: [

    ],
  },

  {
    id: "b83-sicilian-defense-scheveningen-variation-classical-variation",
    name: "Sicilian Defense: Scheveningen Variation, Classical Variation",
    eco: "B83",
    variations: [

    ],
  },

  {
    id: "b83-sicilian-defense-scheveningen-variation-modern-variation",
    name: "Sicilian Defense: Scheveningen Variation, Modern Variation",
    eco: "B83",
    variations: [

    ],
  },

  {
    id: "b84-sicilian-defense-najdorf-variation-scheveningen-variation",
    name: "Sicilian Defense: Najdorf Variation, Scheveningen Variation",
    eco: "B84",
    variations: [

    ],
  },

  {
    id: "b84-sicilian-defense-scheveningen-variation-classical-variation",
    name: "Sicilian Defense: Scheveningen Variation, Classical Variation",
    eco: "B84",
    variations: [

    ],
  },

  {
    id: "b85-sicilian-defense-scheveningen-variation-classical-main-line",
    name: "Sicilian Defense: Scheveningen Variation, Classical Main Line",
    eco: "B85",
    variations: [

    ],
  },

  {
    id: "b85-sicilian-defense-scheveningen-variation-classical-variation-paulsen-variation",
    name: "Sicilian Defense: Scheveningen Variation, Classical Variation, Paulsen Variation",
    eco: "B85",
    variations: [

    ],
  },

  {
    id: "b86-sicilian-defense-sozin-attack",
    name: "Sicilian Defense: Sozin Attack",
    eco: "B86",
    variations: [

    ],
  },

  {
    id: "b87-sicilian-defense-sozin-attack-flank-variation",
    name: "Sicilian Defense: Sozin Attack, Flank Variation",
    eco: "B87",
    variations: [

    ],
  },

  {
    id: "b88-sicilian-defense-sozin-attack-fischer-variation",
    name: "Sicilian Defense: Sozin Attack, Fischer Variation",
    eco: "B88",
    variations: [

    ],
  },

  {
    id: "b88-sicilian-defense-sozin-attack-leonhardt-variation",
    name: "Sicilian Defense: Sozin Attack, Leonhardt Variation",
    eco: "B88",
    variations: [

    ],
  },

  {
    id: "b89-sicilian-defense-sozin-attack-main-line",
    name: "Sicilian Defense: Sozin Attack, Main Line",
    eco: "B89",
    variations: [

    ],
  },

  {
    id: "b89-sicilian-defense-sozin-attack-main-line-sherbakov-variation",
    name: "Sicilian Defense: Sozin Attack, Main Line, Sherbakov Variation",
    eco: "B89",
    variations: [

    ],
  },

  {
    id: "b89-sicilian-defense-velimirovic-attack",
    name: "Sicilian Defense: Velimirovic Attack",
    eco: "B89",
    variations: [

    ],
  },

  {
    id: "b90-sicilian-defense-najdorf-variation",
    name: "Sicilian Defense: Najdorf Variation",
    eco: "B90",
    variations: [

    ],
  },

  {
    id: "b90-sicilian-defense-najdorf-variation-adams-attack",
    name: "Sicilian Defense: Najdorf Variation, Adams Attack",
    eco: "B90",
    variations: [

    ],
  },

  {
    id: "b90-sicilian-defense-najdorf-variation-dekker-gambit",
    name: "Sicilian Defense: Najdorf Variation, Dekker Gambit",
    eco: "B90",
    variations: [

    ],
  },

  {
    id: "b90-sicilian-defense-najdorf-variation-english-attack",
    name: "Sicilian Defense: Najdorf Variation, English Attack",
    eco: "B90",
    variations: [

    ],
  },

  {
    id: "b90-sicilian-defense-najdorf-variation-english-attack-anti-english",
    name: "Sicilian Defense: Najdorf Variation, English Attack, Anti-English",
    eco: "B90",
    variations: [

    ],
  },

  {
    id: "b90-sicilian-defense-najdorf-variation-lipnitsky-attack",
    name: "Sicilian Defense: Najdorf Variation, Lipnitsky Attack",
    eco: "B90",
    variations: [

    ],
  },

  {
    id: "b90-sicilian-defense-najdorf-variation-petroni-attack",
    name: "Sicilian Defense: Najdorf Variation, Petronić Attack",
    eco: "B90",
    variations: [

    ],
  },

  {
    id: "b90-sicilian-defense-najdorf-variation-yates-variation",
    name: "Sicilian Defense: Najdorf Variation, Yates Variation",
    eco: "B90",
    variations: [

    ],
  },

  {
    id: "b90-sicilian-defense-scheveningen-variation-delayed-keres-attack",
    name: "Sicilian Defense: Scheveningen Variation, Delayed Keres Attack",
    eco: "B90",
    variations: [

    ],
  },

  {
    id: "b90-sicilian-defense-scheveningen-variation-delayed-keres-attack-perenyi-gambit",
    name: "Sicilian Defense: Scheveningen Variation, Delayed Keres Attack, Perenyi Gambit",
    eco: "B90",
    variations: [

    ],
  },

  {
    id: "b90-sicilian-defense-scheveningen-variation-english-attack-with-f3",
    name: "Sicilian Defense: Scheveningen Variation, English Attack, with f3",
    eco: "B90",
    variations: [

    ],
  },

  {
    id: "b91-sicilian-defense-najdorf-variation-zagreb-variation",
    name: "Sicilian Defense: Najdorf Variation, Zagreb Variation",
    eco: "B91",
    variations: [

    ],
  },

  {
    id: "b92-sicilian-defense-najdorf-variation-opocensky-variation",
    name: "Sicilian Defense: Najdorf Variation, Opocensky Variation",
    eco: "B92",
    variations: [

    ],
  },

  {
    id: "b92-sicilian-defense-najdorf-variation-opocensky-variation-modern-line",
    name: "Sicilian Defense: Najdorf Variation, Opocensky Variation, Modern Line",
    eco: "B92",
    variations: [

    ],
  },

  {
    id: "b92-sicilian-defense-najdorf-variation-opocensky-variation-traditional-line",
    name: "Sicilian Defense: Najdorf Variation, Opocensky Variation, Traditional Line",
    eco: "B92",
    variations: [

    ],
  },

  {
    id: "b93-sicilian-defense-najdorf-variation-amsterdam-variation",
    name: "Sicilian Defense: Najdorf Variation, Amsterdam Variation",
    eco: "B93",
    variations: [

    ],
  },

  {
    id: "b94-sicilian-defense-najdorf-variation",
    name: "Sicilian Defense: Najdorf Variation",
    eco: "B94",
    variations: [

    ],
  },

  {
    id: "b94-sicilian-defense-najdorf-variation-ivkov-variation",
    name: "Sicilian Defense: Najdorf Variation, Ivkov Variation",
    eco: "B94",
    variations: [

    ],
  },

  {
    id: "b95-sicilian-defense-najdorf-variation",
    name: "Sicilian Defense: Najdorf Variation",
    eco: "B95",
    variations: [

    ],
  },

  {
    id: "b96-sicilian-defense-najdorf-variation",
    name: "Sicilian Defense: Najdorf Variation",
    eco: "B96",
    variations: [

    ],
  },

  {
    id: "b96-sicilian-defense-najdorf-variation-neo-classical-defense",
    name: "Sicilian Defense: Najdorf Variation, Neo-Classical Defense",
    eco: "B96",
    variations: [

    ],
  },

  {
    id: "b96-sicilian-defense-najdorf-variation-polugaevsky-variation",
    name: "Sicilian Defense: Najdorf Variation, Polugaevsky Variation",
    eco: "B96",
    variations: [

    ],
  },

  {
    id: "b96-sicilian-defense-najdorf-variation-polugaevsky-variation-simagin-line",
    name: "Sicilian Defense: Najdorf Variation, Polugaevsky Variation, Simagin Line",
    eco: "B96",
    variations: [

    ],
  },

  {
    id: "b97-sicilian-defense-najdorf-variation-poisoned-pawn-accepted",
    name: "Sicilian Defense: Najdorf Variation, Poisoned Pawn Accepted",
    eco: "B97",
    variations: [

    ],
  },

  {
    id: "b97-sicilian-defense-najdorf-variation-poisoned-pawn-variation",
    name: "Sicilian Defense: Najdorf Variation, Poisoned Pawn Variation",
    eco: "B97",
    variations: [

    ],
  },

  {
    id: "b98-sicilian-defense-najdorf-variation",
    name: "Sicilian Defense: Najdorf Variation",
    eco: "B98",
    variations: [

    ],
  },

  {
    id: "b98-sicilian-defense-najdorf-variation-browne-variation",
    name: "Sicilian Defense: Najdorf Variation, Browne Variation",
    eco: "B98",
    variations: [

    ],
  },

  {
    id: "b98-sicilian-defense-najdorf-variation-goteborg-variation",
    name: "Sicilian Defense: Najdorf Variation, Goteborg Variation",
    eco: "B98",
    variations: [

    ],
  },

  {
    id: "b98-sicilian-defense-najdorf-variation-traditional-line",
    name: "Sicilian Defense: Najdorf Variation, Traditional Line",
    eco: "B98",
    variations: [

    ],
  },

  {
    id: "b99-sicilian-defense-najdorf-variation-main-line",
    name: "Sicilian Defense: Najdorf Variation, Main Line",
    eco: "B99",
    variations: [

    ],
  },

  {
    id: "c00-french-defense",
    name: "French Defense",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-alapin-gambit",
    name: "French Defense: Alapin Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-baeuerle-gambit",
    name: "French Defense: Baeuerle Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-banzai-leong-gambit",
    name: "French Defense: Banzai-Leong Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-banzai-leong-gambit-pinova-gambit",
    name: "French Defense: Banzai-Leong Gambit, Pinova Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-bird-invitation",
    name: "French Defense: Bird Invitation",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-carlson-gambit",
    name: "French Defense: Carlson Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-chigorin-variation",
    name: "French Defense: Chigorin Variation",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-diemer-duhm-gambit",
    name: "French Defense: Diemer-Duhm Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-diemer-duhm-gambit-accepted",
    name: "French Defense: Diemer-Duhm Gambit Accepted",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-franco-hiva-gambit",
    name: "French Defense: Franco-Hiva Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-franco-hiva-gambit-accepted",
    name: "French Defense: Franco-Hiva Gambit Accepted",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-franco-sicilian-defense",
    name: "French Defense: Franco-Sicilian Defense",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-hoffmann-gambit",
    name: "French Defense: Hoffmann Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-horwitz-attack",
    name: "French Defense: Horwitz Attack",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-horwitz-attack-papa-ticulat-gambit",
    name: "French Defense: Horwitz Attack, Papa-Ticulat Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-king-s-indian-attack",
    name: "French Defense: King",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-king-s-indian-attack-franco-hiva-gambit",
    name: "French Defense: King",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-knight-variation",
    name: "French Defense: Knight Variation",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-knight-variation-franco-hiva-gambit",
    name: "French Defense: Knight Variation, Franco-Hiva Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-la-bourdonnais-variation",
    name: "French Defense: La Bourdonnais Variation",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-la-bourdonnais-variation-reuter-gambit",
    name: "French Defense: La Bourdonnais Variation, Reuter Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-mediterranean-defense",
    name: "French Defense: Mediterranean Defense",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-morphy-gambit",
    name: "French Defense: Morphy Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-normal-variation",
    name: "French Defense: Normal Variation",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-orthoschnapp-gambit",
    name: "French Defense: Orthoschnapp Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-pelikan-variation",
    name: "French Defense: Pelikan Variation",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-perseus-gambit",
    name: "French Defense: Perseus Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-queen-s-knight",
    name: "French Defense: Queen",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-reversed-philidor-formation",
    name: "French Defense: Reversed Philidor Formation",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-r-ti-spielmann-attack",
    name: "French Defense: Réti-Spielmann Attack",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-schlechter-variation",
    name: "French Defense: Schlechter Variation",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-st-george-defense",
    name: "French Defense: St. George Defense",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-st-george-defense-sanky-george-gambit",
    name: "French Defense: St. George Defense, Sanky-George Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-st-george-defense-st-george-gambit",
    name: "French Defense: St. George Defense, St. George Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-st-george-defense-three-pawn-attack",
    name: "French Defense: St. George Defense, Three Pawn Attack",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-st-george-defense-traditional-line",
    name: "French Defense: St. George Defense, Traditional Line",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-steiner-variation",
    name: "French Defense: Steiner Variation",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-steinitz-attack",
    name: "French Defense: Steinitz Attack",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-two-knights-variation",
    name: "French Defense: Two Knights Variation",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-french-defense-wing-gambit",
    name: "French Defense: Wing Gambit",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c00-rat-defense-small-center-defense",
    name: "Rat Defense: Small Center Defense",
    eco: "C00",
    variations: [

    ],
  },

  {
    id: "c01-french-defense-exchange-variation",
    name: "French Defense: Exchange Variation",
    eco: "C01",
    variations: [

    ],
  },

  {
    id: "c01-french-defense-exchange-variation-bogoljubow-variation",
    name: "French Defense: Exchange Variation, Bogoljubow Variation",
    eco: "C01",
    variations: [

    ],
  },

  {
    id: "c01-french-defense-exchange-variation-monte-carlo-variation",
    name: "French Defense: Exchange Variation, Monte Carlo Variation",
    eco: "C01",
    variations: [

    ],
  },

  {
    id: "c01-french-defense-exchange-variation-svenonius-variation",
    name: "French Defense: Exchange Variation, Svenonius Variation",
    eco: "C01",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation",
    name: "French Defense: Advance Variation",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-euwe-variation",
    name: "French Defense: Advance Variation, Euwe Variation",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-extended-bishop-swap",
    name: "French Defense: Advance Variation, Extended Bishop Swap",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-frenkel-gambit",
    name: "French Defense: Advance Variation, Frenkel Gambit",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-kupreichik-variation",
    name: "French Defense: Advance Variation, Kupreichik Variation",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-lputian-variation",
    name: "French Defense: Advance Variation, Lputian Variation",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-main-line",
    name: "French Defense: Advance Variation, Main Line",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-milner-barry-gambit",
    name: "French Defense: Advance Variation, Milner-Barry Gambit",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-milner-barry-gambit-hector-variation",
    name: "French Defense: Advance Variation, Milner-Barry Gambit, Hector Variation",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-milner-barry-gambit-main-line",
    name: "French Defense: Advance Variation, Milner-Barry Gambit, Main Line",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-milner-barry-gambit-s-rensen-variation",
    name: "French Defense: Advance Variation, Milner-Barry Gambit, Sørensen Variation",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-nimzowitsch-attack",
    name: "French Defense: Advance Variation, Nimzowitsch Attack",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-nimzowitsch-gambit",
    name: "French Defense: Advance Variation, Nimzowitsch Gambit",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-nimzowitsch-system",
    name: "French Defense: Advance Variation, Nimzowitsch System",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-paulsen-attack",
    name: "French Defense: Advance Variation, Paulsen Attack",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-ruisdonk-gambit",
    name: "French Defense: Advance Variation, Ruisdonk Gambit",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-steinitz-variation",
    name: "French Defense: Advance Variation, Steinitz Variation",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c02-french-defense-advance-variation-wade-variation",
    name: "French Defense: Advance Variation, Wade Variation",
    eco: "C02",
    variations: [

    ],
  },

  {
    id: "c03-french-defense-tarrasch-variation",
    name: "French Defense: Tarrasch Variation",
    eco: "C03",
    variations: [

    ],
  },

  {
    id: "c03-french-defense-tarrasch-variation-guimard-defense",
    name: "French Defense: Tarrasch Variation, Guimard Defense",
    eco: "C03",
    variations: [

    ],
  },

  {
    id: "c03-french-defense-tarrasch-variation-guimard-defense-thunderbunny-variation",
    name: "French Defense: Tarrasch Variation, Guimard Defense, Thunderbunny Variation",
    eco: "C03",
    variations: [

    ],
  },

  {
    id: "c03-french-defense-tarrasch-variation-haberditz-variation",
    name: "French Defense: Tarrasch Variation, Haberditz Variation",
    eco: "C03",
    variations: [

    ],
  },

  {
    id: "c03-french-defense-tarrasch-variation-modern-system",
    name: "French Defense: Tarrasch Variation, Modern System",
    eco: "C03",
    variations: [

    ],
  },

  {
    id: "c03-french-defense-tarrasch-variation-morozevich-variation",
    name: "French Defense: Tarrasch Variation, Morozevich Variation",
    eco: "C03",
    variations: [

    ],
  },

  {
    id: "c04-french-defense-tarrasch-variation-guimard-defense-main-line",
    name: "French Defense: Tarrasch Variation, Guimard Defense, Main Line",
    eco: "C04",
    variations: [

    ],
  },

  {
    id: "c05-french-defense-tarrasch-variation-botvinnik-variation",
    name: "French Defense: Tarrasch Variation, Botvinnik Variation",
    eco: "C05",
    variations: [

    ],
  },

  {
    id: "c05-french-defense-tarrasch-variation-closed-variation",
    name: "French Defense: Tarrasch Variation, Closed Variation",
    eco: "C05",
    variations: [

    ],
  },

  {
    id: "c05-french-defense-tarrasch-variation-pawn-center-variation",
    name: "French Defense: Tarrasch Variation, Pawn Center Variation",
    eco: "C05",
    variations: [

    ],
  },

  {
    id: "c06-french-defense-tarrasch-variation-closed-variation-main-line",
    name: "French Defense: Tarrasch Variation, Closed Variation, Main Line",
    eco: "C06",
    variations: [

    ],
  },

  {
    id: "c06-french-defense-tarrasch-variation-leningrad-variation",
    name: "French Defense: Tarrasch Variation, Leningrad Variation",
    eco: "C06",
    variations: [

    ],
  },

  {
    id: "c07-french-defense-tarrasch-variation-chistyakov-defense",
    name: "French Defense: Tarrasch Variation, Chistyakov Defense",
    eco: "C07",
    variations: [

    ],
  },

  {
    id: "c07-french-defense-tarrasch-variation-chistyakov-defense-modern-line",
    name: "French Defense: Tarrasch Variation, Chistyakov Defense, Modern Line",
    eco: "C07",
    variations: [

    ],
  },

  {
    id: "c07-french-defense-tarrasch-variation-eliskases-variation",
    name: "French Defense: Tarrasch Variation, Eliskases Variation",
    eco: "C07",
    variations: [

    ],
  },

  {
    id: "c07-french-defense-tarrasch-variation-open-system",
    name: "French Defense: Tarrasch Variation, Open System",
    eco: "C07",
    variations: [

    ],
  },

  {
    id: "c07-french-defense-tarrasch-variation-open-system-euwe-keres-line",
    name: "French Defense: Tarrasch Variation, Open System, Euwe-Keres Line",
    eco: "C07",
    variations: [

    ],
  },

  {
    id: "c07-french-defense-tarrasch-variation-open-system-shaposhnikov-gambit",
    name: "French Defense: Tarrasch Variation, Open System, Shaposhnikov Gambit",
    eco: "C07",
    variations: [

    ],
  },

  {
    id: "c07-french-defense-tarrasch-variation-open-system-s-chting-line",
    name: "French Defense: Tarrasch Variation, Open System, Süchting Line",
    eco: "C07",
    variations: [

    ],
  },

  {
    id: "c08-french-defense-tarrasch-variation-open-system",
    name: "French Defense: Tarrasch Variation, Open System",
    eco: "C08",
    variations: [

    ],
  },

  {
    id: "c08-french-defense-tarrasch-variation-open-system-advance-line",
    name: "French Defense: Tarrasch Variation, Open System, Advance Line",
    eco: "C08",
    variations: [

    ],
  },

  {
    id: "c09-french-defense-tarrasch-variation-open-system-main-line",
    name: "French Defense: Tarrasch Variation, Open System, Main Line",
    eco: "C09",
    variations: [

    ],
  },

  {
    id: "c10-french-defense-hecht-reefschl-ger-variation",
    name: "French Defense: Hecht-Reefschläger Variation",
    eco: "C10",
    variations: [

    ],
  },

  {
    id: "c10-french-defense-marshall-gambit",
    name: "French Defense: Marshall Gambit",
    eco: "C10",
    variations: [

    ],
  },

  {
    id: "c10-french-defense-paulsen-variation",
    name: "French Defense: Paulsen Variation",
    eco: "C10",
    variations: [

    ],
  },

  {
    id: "c10-french-defense-rubinstein-variation",
    name: "French Defense: Rubinstein Variation",
    eco: "C10",
    variations: [

    ],
  },

  {
    id: "c10-french-defense-rubinstein-variation-blackburne-defense",
    name: "French Defense: Rubinstein Variation, Blackburne Defense",
    eco: "C10",
    variations: [

    ],
  },

  {
    id: "c10-french-defense-rubinstein-variation-capablanca-line",
    name: "French Defense: Rubinstein Variation, Capablanca Line",
    eco: "C10",
    variations: [

    ],
  },

  {
    id: "c10-french-defense-rubinstein-variation-ellis-gambit",
    name: "French Defense: Rubinstein Variation, Ellis Gambit",
    eco: "C10",
    variations: [

    ],
  },

  {
    id: "c10-french-defense-rubinstein-variation-fort-knox-variation",
    name: "French Defense: Rubinstein Variation, Fort Knox Variation",
    eco: "C10",
    variations: [

    ],
  },

  {
    id: "c10-french-defense-rubinstein-variation-kasparov-attack",
    name: "French Defense: Rubinstein Variation, Kasparov Attack",
    eco: "C10",
    variations: [

    ],
  },

  {
    id: "c10-french-defense-rubinstein-variation-maric-variation",
    name: "French Defense: Rubinstein Variation, Maric Variation",
    eco: "C10",
    variations: [

    ],
  },

  {
    id: "c11-french-defense-classical-variation",
    name: "French Defense: Classical Variation",
    eco: "C11",
    variations: [

    ],
  },

  {
    id: "c11-french-defense-classical-variation-delayed-exchange-variation",
    name: "French Defense: Classical Variation, Delayed Exchange Variation",
    eco: "C11",
    variations: [

    ],
  },

  {
    id: "c11-french-defense-classical-variation-shirov-anand-variation",
    name: "French Defense: Classical Variation, Shirov-Anand Variation",
    eco: "C11",
    variations: [

    ],
  },

  {
    id: "c11-french-defense-classical-variation-steinitz-variation",
    name: "French Defense: Classical Variation, Steinitz Variation",
    eco: "C11",
    variations: [

    ],
  },

  {
    id: "c11-french-defense-classical-variation-swiss-variation",
    name: "French Defense: Classical Variation, Swiss Variation",
    eco: "C11",
    variations: [

    ],
  },

  {
    id: "c11-french-defense-henneberger-variation",
    name: "French Defense: Henneberger Variation",
    eco: "C11",
    variations: [

    ],
  },

  {
    id: "c11-french-defense-steinitz-variation",
    name: "French Defense: Steinitz Variation",
    eco: "C11",
    variations: [

    ],
  },

  {
    id: "c11-french-defense-steinitz-variation-boleslavsky-variation",
    name: "French Defense: Steinitz Variation, Boleslavsky Variation",
    eco: "C11",
    variations: [

    ],
  },

  {
    id: "c11-french-defense-steinitz-variation-bradford-attack-variation",
    name: "French Defense: Steinitz Variation, Bradford Attack Variation",
    eco: "C11",
    variations: [

    ],
  },

  {
    id: "c11-french-defense-steinitz-variation-brodsky-jones-variation",
    name: "French Defense: Steinitz Variation, Brodsky-Jones Variation",
    eco: "C11",
    variations: [

    ],
  },

  {
    id: "c11-french-defense-steinitz-variation-gledhill-attack",
    name: "French Defense: Steinitz Variation, Gledhill Attack",
    eco: "C11",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-classical-4-bg5",
    name: "French Defense: Classical, 4. Bg5",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "french-macCutcheon",
    name: "French Defense: MacCutcheon Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-mccutcheon-variation",
    name: "French Defense: McCutcheon Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-mccutcheon-variation-advance-variation",
    name: "French Defense: McCutcheon Variation, Advance Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-mccutcheon-variation-bernstein-variation",
    name: "French Defense: McCutcheon Variation, Bernstein Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-mccutcheon-variation-bogoljubow-variation",
    name: "French Defense: McCutcheon Variation, Bogoljubow Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-mccutcheon-variation-chigorin-variation",
    name: "French Defense: McCutcheon Variation, Chigorin Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-mccutcheon-variation-dr-olland-variation",
    name: "French Defense: McCutcheon Variation, Dr. Olland Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-mccutcheon-variation-duras-variation",
    name: "French Defense: McCutcheon Variation, Duras Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-mccutcheon-variation-exchange-variation",
    name: "French Defense: McCutcheon Variation, Exchange Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-mccutcheon-variation-grigoriev-variation",
    name: "French Defense: McCutcheon Variation, Grigoriev Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-mccutcheon-variation-janowski-variation",
    name: "French Defense: McCutcheon Variation, Janowski Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-mccutcheon-variation-lasker-variation",
    name: "French Defense: McCutcheon Variation, Lasker Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c12-french-defense-mccutcheon-variation-tartakower-variation",
    name: "French Defense: McCutcheon Variation, Tartakower Variation",
    eco: "C12",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-alekhine-chatard-attack",
    name: "French Defense: Alekhine-Chatard Attack",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-alekhine-chatard-attack-albin-chatard-gambit",
    name: "French Defense: Alekhine-Chatard Attack, Albin-Chatard Gambit",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-alekhine-chatard-attack-breyer-variation",
    name: "French Defense: Alekhine-Chatard Attack, Breyer Variation",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-alekhine-chatard-attack-mar-czy-variation",
    name: "French Defense: Alekhine-Chatard Attack, Maróczy Variation",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-alekhine-chatard-attack-spielmann-variation",
    name: "French Defense: Alekhine-Chatard Attack, Spielmann Variation",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-alekhine-chatard-attack-teichmann-variation",
    name: "French Defense: Alekhine-Chatard Attack, Teichmann Variation",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-classical-variation",
    name: "French Defense: Classical Variation",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-classical-variation-burn-variation",
    name: "French Defense: Classical Variation, Burn Variation",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-classical-variation-burn-variation-main-line",
    name: "French Defense: Classical Variation, Burn Variation, Main Line",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-classical-variation-burn-variation-morozevich-line",
    name: "French Defense: Classical Variation, Burn Variation, Morozevich Line",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-classical-variation-frankfurt-variation",
    name: "French Defense: Classical Variation, Frankfurt Variation",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-classical-variation-normal-variation",
    name: "French Defense: Classical Variation, Normal Variation",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-classical-variation-richter-attack",
    name: "French Defense: Classical Variation, Richter Attack",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-classical-variation-tartakower-variation",
    name: "French Defense: Classical Variation, Tartakower Variation",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c13-french-defense-classical-variation-vistaneckis-variation",
    name: "French Defense: Classical Variation, Vistaneckis Variation",
    eco: "C13",
    variations: [

    ],
  },

  {
    id: "c14-french-defense-classical-variation",
    name: "French Defense: Classical Variation",
    eco: "C14",
    variations: [

    ],
  },

  {
    id: "c14-french-defense-classical-variation-alapin-variation",
    name: "French Defense: Classical Variation, Alapin Variation",
    eco: "C14",
    variations: [

    ],
  },

  {
    id: "c14-french-defense-classical-variation-pollock-variation",
    name: "French Defense: Classical Variation, Pollock Variation",
    eco: "C14",
    variations: [

    ],
  },

  {
    id: "c14-french-defense-classical-variation-rubinstein-variation",
    name: "French Defense: Classical Variation, Rubinstein Variation",
    eco: "C14",
    variations: [

    ],
  },

  {
    id: "c14-french-defense-classical-variation-stahlberg-variation",
    name: "French Defense: Classical Variation, Stahlberg Variation",
    eco: "C14",
    variations: [

    ],
  },

  {
    id: "c14-french-defense-classical-variation-steinitz-variation",
    name: "French Defense: Classical Variation, Steinitz Variation",
    eco: "C14",
    variations: [

    ],
  },

  {
    id: "c14-french-defense-classical-variation-tarrasch-variation",
    name: "French Defense: Classical Variation, Tarrasch Variation",
    eco: "C14",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-mccutcheon-variation-wolf-gambit",
    name: "French Defense: McCutcheon Variation, Wolf Gambit",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation",
    name: "French Defense: Winawer Variation",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation-alekhine-gambit-accepted",
    name: "French Defense: Winawer Variation, Alekhine Gambit Accepted",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation-alekhine-gambit-alatortsev-variation",
    name: "French Defense: Winawer Variation, Alekhine Gambit, Alatortsev Variation",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation-alekhine-gambit-kan-variation",
    name: "French Defense: Winawer Variation, Alekhine Gambit, Kan Variation",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation-alekhine-mar-czy-gambit",
    name: "French Defense: Winawer Variation, Alekhine-Maróczy Gambit",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation-delayed-exchange-variation",
    name: "French Defense: Winawer Variation, Delayed Exchange Variation",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation-exchange-variation-canal-attack",
    name: "French Defense: Winawer Variation, Exchange Variation, Canal Attack",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation-fingerslip-variation",
    name: "French Defense: Winawer Variation, Fingerslip Variation",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation-fingerslip-variation-kunin-double-gambit",
    name: "French Defense: Winawer Variation, Fingerslip Variation, Kunin Double Gambit",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation-fingerslip-variation-main-line",
    name: "French Defense: Winawer Variation, Fingerslip Variation, Main Line",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation-fingerslip-variation-schwarz-s-line",
    name: "French Defense: Winawer Variation, Fingerslip Variation, Schwarz",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation-kondratiyev-variation",
    name: "French Defense: Winawer Variation, Kondratiyev Variation",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c15-french-defense-winawer-variation-winckelmann-reimer-gambit",
    name: "French Defense: Winawer Variation, Winckelmann-Reimer Gambit",
    eco: "C15",
    variations: [

    ],
  },

  {
    id: "c16-french-defense-winawer-variation-advance-variation",
    name: "French Defense: Winawer Variation, Advance Variation",
    eco: "C16",
    variations: [

    ],
  },

  {
    id: "c16-french-defense-winawer-variation-petrosian-variation",
    name: "French Defense: Winawer Variation, Petrosian Variation",
    eco: "C16",
    variations: [

    ],
  },

  {
    id: "c17-french-defense-winawer-variation-advance-variation",
    name: "French Defense: Winawer Variation, Advance Variation",
    eco: "C17",
    variations: [

    ],
  },

  {
    id: "c17-french-defense-winawer-variation-advance-variation-moscow-variation",
    name: "French Defense: Winawer Variation, Advance Variation, Moscow Variation",
    eco: "C17",
    variations: [

    ],
  },

  {
    id: "c17-french-defense-winawer-variation-bogoljubow-variation",
    name: "French Defense: Winawer Variation, Bogoljubow Variation",
    eco: "C17",
    variations: [

    ],
  },

  {
    id: "c17-french-defense-winawer-variation-bogoljubow-variation-icelandic-defense",
    name: "French Defense: Winawer Variation, Bogoljubow Variation, Icelandic Defense",
    eco: "C17",
    variations: [

    ],
  },

  {
    id: "c17-french-defense-winawer-variation-mar-czy-wallis-variation",
    name: "French Defense: Winawer Variation, Maróczy-Wallis Variation",
    eco: "C17",
    variations: [

    ],
  },

  {
    id: "c17-french-defense-winawer-variation-retreat-variation",
    name: "French Defense: Winawer Variation, Retreat Variation",
    eco: "C17",
    variations: [

    ],
  },

  {
    id: "c17-french-defense-winawer-variation-retreat-variation-armenian-line",
    name: "French Defense: Winawer Variation, Retreat Variation, Armenian Line",
    eco: "C17",
    variations: [

    ],
  },

  {
    id: "c18-french-defense-winawer-variation-advance-variation",
    name: "French Defense: Winawer Variation, Advance Variation",
    eco: "C18",
    variations: [

    ],
  },

  {
    id: "c18-french-defense-winawer-variation-advance-variation-with-bd3",
    name: "French Defense: Winawer Variation, Advance Variation, with Bd3",
    eco: "C18",
    variations: [

    ],
  },

  {
    id: "c18-french-defense-winawer-variation-advance-variation-with-h4",
    name: "French Defense: Winawer Variation, Advance Variation, with h4",
    eco: "C18",
    variations: [

    ],
  },

  {
    id: "c18-french-defense-winawer-variation-classical-variation",
    name: "French Defense: Winawer Variation, Classical Variation",
    eco: "C18",
    variations: [

    ],
  },

  {
    id: "c18-french-defense-winawer-variation-eingorn-variation",
    name: "French Defense: Winawer Variation, Eingorn Variation",
    eco: "C18",
    variations: [

    ],
  },

  {
    id: "c18-french-defense-winawer-variation-poisoned-pawn-variation",
    name: "French Defense: Winawer Variation, Poisoned Pawn Variation",
    eco: "C18",
    variations: [

    ],
  },

  {
    id: "c18-french-defense-winawer-variation-poisoned-pawn-variation-declined",
    name: "French Defense: Winawer Variation, Poisoned Pawn Variation Declined",
    eco: "C18",
    variations: [

    ],
  },

  {
    id: "c18-french-defense-winawer-variation-poisoned-pawn-variation-main-line",
    name: "French Defense: Winawer Variation, Poisoned Pawn Variation, Main Line",
    eco: "C18",
    variations: [

    ],
  },

  {
    id: "c18-french-defense-winawer-variation-poisoned-pawn-variation-paoli-variation",
    name: "French Defense: Winawer Variation, Poisoned Pawn Variation, Paoli Variation",
    eco: "C18",
    variations: [

    ],
  },

  {
    id: "c18-french-defense-winawer-variation-portisch-hook-variation",
    name: "French Defense: Winawer Variation, Portisch-Hook Variation",
    eco: "C18",
    variations: [

    ],
  },

  {
    id: "c18-french-defense-winawer-variation-warsaw-variation",
    name: "French Defense: Winawer Variation, Warsaw Variation",
    eco: "C18",
    variations: [

    ],
  },

  {
    id: "c19-french-defense-winawer-variation-advance-variation-smyslov-variation",
    name: "French Defense: Winawer Variation, Advance Variation, Smyslov Variation",
    eco: "C19",
    variations: [

    ],
  },

  {
    id: "c19-french-defense-winawer-variation-positional-variation",
    name: "French Defense: Winawer Variation, Positional Variation",
    eco: "C19",
    variations: [

    ],
  },

  {
    id: "c20-barnes-opening-walkerling",
    name: "Barnes Opening: Walkerling",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-bongcloud-attack",
    name: "Bongcloud Attack",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-center-game",
    name: "Center Game",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-english-opening-the-whale",
    name: "English Opening: The Whale",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-alapin-opening",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-bavarian-gambit",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-beyer-gambit",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-clam-variation-king-s-gambit-reversed",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-clam-variation-radisch-gambit",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-king-s-head-opening",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-leonardis-variation",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-macleod-attack",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-macleod-attack-lasa-gambit",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-macleod-attack-norwalde-gambit",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-mengarini-s-opening",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-napoleon-attack",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-philidor-gambit",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-tortoise-opening",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-wayward-queen-attack",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-wayward-queen-attack-kiddie-countergambit",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-wayward-queen-attack-mellon-gambit",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-game-weber-gambit",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-opening",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-opening-speers",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-king-s-pawn-opening-van-hooydoon-gambit",
    name: "King",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-portuguese-opening",
    name: "Portuguese Opening",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-portuguese-opening-miguel-gambit",
    name: "Portuguese Opening: Miguel Gambit",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c20-portuguese-opening-portuguese-gambit",
    name: "Portuguese Opening: Portuguese Gambit",
    eco: "C20",
    variations: [

    ],
  },

  {
    id: "c21-center-game",
    name: "Center Game",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-center-game-accepted",
    name: "Center Game Accepted",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-center-game-halasz-mcdonnell-gambit",
    name: "Center Game: Halasz-McDonnell Gambit",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-center-game-halasz-mcdonnell-gambit-crocodile-variation",
    name: "Center Game: Halasz-McDonnell Gambit, Crocodile Variation",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-center-game-kieseritzky-variation",
    name: "Center Game: Kieseritzky Variation",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-center-game-lanc-arnold-gambit",
    name: "Center Game: Lanc-Arnold Gambit",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-center-game-lanc-arnold-gambit-schippler-gambit",
    name: "Center Game: Lanc-Arnold Gambit, Schippler Gambit",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-center-game-ross-gambit",
    name: "Center Game: Ross Gambit",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-center-game-von-der-lasa-gambit",
    name: "Center Game: von der Lasa Gambit",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-danish-gambit",
    name: "Danish Gambit",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-danish-gambit-accepted",
    name: "Danish Gambit Accepted",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-danish-gambit-accepted-chigorin-defense",
    name: "Danish Gambit Accepted: Chigorin Defense",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-danish-gambit-accepted-classical-defense",
    name: "Danish Gambit Accepted: Classical Defense",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-danish-gambit-accepted-copenhagen-defense",
    name: "Danish Gambit Accepted: Copenhagen Defense",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-danish-gambit-accepted-schlechter-defense",
    name: "Danish Gambit Accepted: Schlechter Defense",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-danish-gambit-accepted-svenonius-defense",
    name: "Danish Gambit Accepted: Svenonius Defense",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "c21-danish-gambit-declined-s-rensen-defense",
    name: "Danish Gambit Declined: Sörensen Defense",
    eco: "C21",
    variations: [

    ],
  },

  {
    id: "center-game",
    name: "Center Game",
    eco: "C22",
    variations: [

    ],
  },

  {
    id: "c22-center-game-berger-variation",
    name: "Center Game: Berger Variation",
    eco: "C22",
    variations: [

    ],
  },

  {
    id: "c22-center-game-charousek-variation",
    name: "Center Game: Charousek Variation",
    eco: "C22",
    variations: [

    ],
  },

  {
    id: "c22-center-game-hall-variation",
    name: "Center Game: Hall Variation",
    eco: "C22",
    variations: [

    ],
  },

  {
    id: "c22-center-game-kupreichik-variation",
    name: "Center Game: Kupreichik Variation",
    eco: "C22",
    variations: [

    ],
  },

  {
    id: "c22-center-game-normal-variation",
    name: "Center Game: Normal Variation",
    eco: "C22",
    variations: [

    ],
  },

  {
    id: "c22-center-game-paulsen-attack-variation",
    name: "Center Game: Paulsen Attack Variation",
    eco: "C22",
    variations: [

    ],
  },

  {
    id: "c22-center-game-l-hermet-variation",
    name: "Center Game: l",
    eco: "C22",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-anderssen-gambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-boi-variation",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-calabrese-countergambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-calabrese-countergambit-jaenisch-variation",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-four-pawns-gambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-khan-gambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-lewis-countergambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-lewis-countergambit-walker-variation",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-lewis-gambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-lisitsyn-variation",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-lopez-gambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-lopez-variation",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-lopez-variation-lopez-gambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-mcdonnell-gambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-mcdonnell-gambit-la-bourdonnais-denker-gambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-mcdonnell-gambit-mcdonnell-double-gambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-philidor-counterattack",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-philidor-variation",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-pratt-variation",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-stein-gambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-thorold-gambit",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c23-bishop-s-opening-del-rio-variation",
    name: "Bishop",
    eco: "C23",
    variations: [

    ],
  },

  {
    id: "c24-bishop-s-opening-berlin-defense",
    name: "Bishop",
    eco: "C24",
    variations: [

    ],
  },

  {
    id: "c24-bishop-s-opening-berlin-defense-greco-gambit",
    name: "Bishop",
    eco: "C24",
    variations: [

    ],
  },

  {
    id: "c24-bishop-s-opening-kitchener-folly",
    name: "Bishop",
    eco: "C24",
    variations: [

    ],
  },

  {
    id: "c24-bishop-s-opening-krejcik-gambit",
    name: "Bishop",
    eco: "C24",
    variations: [

    ],
  },

  {
    id: "c24-bishop-s-opening-pachman-gambit",
    name: "Bishop",
    eco: "C24",
    variations: [

    ],
  },

  {
    id: "c24-bishop-s-opening-paulsen-defense",
    name: "Bishop",
    eco: "C24",
    variations: [

    ],
  },

  {
    id: "c24-bishop-s-opening-ponziani-gambit",
    name: "Bishop",
    eco: "C24",
    variations: [

    ],
  },

  {
    id: "c24-bishop-s-opening-urusov-gambit-panov-variation",
    name: "Bishop",
    eco: "C24",
    variations: [

    ],
  },

  {
    id: "c24-bishop-s-opening-vienna-hybrid",
    name: "Bishop",
    eco: "C24",
    variations: [

    ],
  },

  {
    id: "c24-bishop-s-opening-warsaw-gambit",
    name: "Bishop",
    eco: "C24",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense",
    name: "Vienna Gambit, with Max Lange Defense",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-cunningham-defense",
    name: "Vienna Gambit, with Max Lange Defense: Cunningham Defense",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-hamppe-allgaier-gambit",
    name: "Vienna Gambit, with Max Lange Defense: Hamppe-Allgaier Gambit",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-hamppe-allgaier-gambit-alapin-variation",
    name: "Vienna Gambit, with Max Lange Defense: Hamppe-Allgaier Gambit, Alapin Variation",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-hamppe-allgaier-gambit-thorold-variation",
    name: "Vienna Gambit, with Max Lange Defense: Hamppe-Allgaier Gambit, Thorold Variation",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-hamppe-muzio-gambit",
    name: "Vienna Gambit, with Max Lange Defense: Hamppe-Muzio Gambit",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-knight-variation",
    name: "Vienna Gambit, with Max Lange Defense: Knight Variation",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-pierce-gambit",
    name: "Vienna Gambit, with Max Lange Defense: Pierce Gambit",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-quelle-gambit",
    name: "Vienna Gambit, with Max Lange Defense: Quelle Gambit",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-steinitz-gambit",
    name: "Vienna Gambit, with Max Lange Defense: Steinitz Gambit",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-steinitz-gambit-fraser-minckwitz-defense",
    name: "Vienna Gambit, with Max Lange Defense: Steinitz Gambit, Fraser-Minckwitz Defense",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-steinitz-gambit-main-line",
    name: "Vienna Gambit, with Max Lange Defense: Steinitz Gambit, Main Line",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-steinitz-gambit-paulsen-defense",
    name: "Vienna Gambit, with Max Lange Defense: Steinitz Gambit, Paulsen Defense",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-steinitz-gambit-s-rensen-defense",
    name: "Vienna Gambit, with Max Lange Defense: Steinitz Gambit, Sörensen Defense",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-gambit-with-max-lange-defense-steinitz-gambit-zukertort-defense",
    name: "Vienna Gambit, with Max Lange Defense: Steinitz Gambit, Zukertort Defense",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game",
    name: "Vienna Game",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-anderssen-defense",
    name: "Vienna Game: Anderssen Defense",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-fyfe-gambit",
    name: "Vienna Game: Fyfe Gambit",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-giraffe-attack",
    name: "Vienna Game: Giraffe Attack",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-hamppe-meitner-variation",
    name: "Vienna Game: Hamppe-Meitner Variation",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-hamppe-muzio-gambit",
    name: "Vienna Game: Hamppe-Muzio Gambit",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-hamppe-muzio-dubois-variation",
    name: "Vienna Game: Hamppe-Muzio, Dubois Variation",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-max-lange-defense",
    name: "Vienna Game: Max Lange Defense",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-omaha-gambit",
    name: "Vienna Game: Omaha Gambit",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-paulsen-variation",
    name: "Vienna Game: Paulsen Variation",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-paulsen-variation-mariotti-gambit",
    name: "Vienna Game: Paulsen Variation, Mariotti Gambit",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-philidor-countergambit",
    name: "Vienna Game: Philidor Countergambit",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-pierce-gambit-rushmere-attack",
    name: "Vienna Game: Pierce Gambit, Rushmere Attack",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-stanley-variation-meitner-mieses-gambit",
    name: "Vienna Game: Stanley Variation, Meitner-Mieses Gambit",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c25-vienna-game-zhuravlev-countergambit",
    name: "Vienna Game: Zhuravlev Countergambit",
    eco: "C25",
    variations: [

    ],
  },

  {
    id: "c26-bishop-s-opening-horwitz-gambit",
    name: "Bishop",
    eco: "C26",
    variations: [

    ],
  },

  {
    id: "c26-bishop-s-opening-vienna-hybrid-spielmann-attack",
    name: "Bishop",
    eco: "C26",
    variations: [

    ],
  },

  {
    id: "c26-vienna-game-falkbeer-variation",
    name: "Vienna Game: Falkbeer Variation",
    eco: "C26",
    variations: [

    ],
  },

  {
    id: "vienna-max-lange",
    name: "Vienna Game: Max Lange Defense",
    eco: "C26",
    variations: [

    ],
  },

  {
    id: "c26-vienna-game-mengarini-variation",
    name: "Vienna Game: Mengarini Variation",
    eco: "C26",
    variations: [

    ],
  },

  {
    id: "c26-vienna-game-mieses-variation",
    name: "Vienna Game: Mieses Variation",
    eco: "C26",
    variations: [

    ],
  },

  {
    id: "c26-vienna-game-mieses-variation-erben-gambit",
    name: "Vienna Game: Mieses Variation, Erben Gambit",
    eco: "C26",
    variations: [

    ],
  },

  {
    id: "c26-vienna-game-paulsen-variation-pollock-gambit",
    name: "Vienna Game: Paulsen Variation, Pollock Gambit",
    eco: "C26",
    variations: [

    ],
  },

  {
    id: "c26-vienna-game-stanley-variation",
    name: "Vienna Game: Stanley Variation",
    eco: "C26",
    variations: [

    ],
  },

  {
    id: "c26-vienna-game-stanley-variation-eifel-gambit",
    name: "Vienna Game: Stanley Variation, Eifel Gambit",
    eco: "C26",
    variations: [

    ],
  },

  {
    id: "c26-vienna-game-stanley-variation-reversed-spanish",
    name: "Vienna Game: Stanley Variation, Reversed Spanish",
    eco: "C26",
    variations: [

    ],
  },

  {
    id: "c27-bishop-s-opening-boden-kieseritzky-gambit",
    name: "Bishop",
    eco: "C27",
    variations: [

    ],
  },

  {
    id: "c27-bishop-s-opening-boden-kieseritzky-gambit-lichtenhein-defense",
    name: "Bishop",
    eco: "C27",
    variations: [

    ],
  },

  {
    id: "c27-vienna-game-adams-gambit",
    name: "Vienna Game: Adams",
    eco: "C27",
    variations: [

    ],
  },

  {
    id: "c27-vienna-game-frankenstein-dracula-variation",
    name: "Vienna Game: Frankenstein-Dracula Variation",
    eco: "C27",
    variations: [

    ],
  },

  {
    id: "vienna-slav",
    name: "Vienna Game: Slav Defense",
    eco: "C27",
    variations: [

    ],
  },

  {
    id: "c27-vienna-game-stanley-variation-alekhine-variation",
    name: "Vienna Game: Stanley Variation, Alekhine Variation",
    eco: "C27",
    variations: [

    ],
  },

  {
    id: "c27-vienna-game-stanley-variation-frankenstein-dracula-variation",
    name: "Vienna Game: Stanley Variation, Frankenstein-Dracula Variation",
    eco: "C27",
    variations: [

    ],
  },

  {
    id: "c27-vienna-game-stanley-variation-monster-declined",
    name: "Vienna Game: Stanley Variation, Monster Declined",
    eco: "C27",
    variations: [

    ],
  },

  {
    id: "c28-bishop-s-opening-vienna-hybrid-hrom-dka-variation",
    name: "Bishop",
    eco: "C28",
    variations: [

    ],
  },

  {
    id: "c28-vienna-game-stanley-variation-bronstein-gambit",
    name: "Vienna Game: Stanley Variation, Bronstein Gambit",
    eco: "C28",
    variations: [

    ],
  },

  {
    id: "c28-vienna-game-stanley-variation-three-knights-variation",
    name: "Vienna Game: Stanley Variation, Three Knights Variation",
    eco: "C28",
    variations: [

    ],
  },

  {
    id: "c29-vienna-game-heyde-variation",
    name: "Vienna Game: Heyde Variation",
    eco: "C29",
    variations: [

    ],
  },

  {
    id: "c29-vienna-game-vienna-gambit",
    name: "Vienna Game: Vienna Gambit",
    eco: "C29",
    variations: [

    ],
  },

  {
    id: "c29-vienna-game-vienna-gambit-bardeleben-variation",
    name: "Vienna Game: Vienna Gambit, Bardeleben Variation",
    eco: "C29",
    variations: [

    ],
  },

  {
    id: "c29-vienna-game-vienna-gambit-breyer-variation",
    name: "Vienna Game: Vienna Gambit, Breyer Variation",
    eco: "C29",
    variations: [

    ],
  },

  {
    id: "c29-vienna-game-vienna-gambit-kaufmann-variation",
    name: "Vienna Game: Vienna Gambit, Kaufmann Variation",
    eco: "C29",
    variations: [

    ],
  },

  {
    id: "c29-vienna-game-vienna-gambit-main-line",
    name: "Vienna Game: Vienna Gambit, Main Line",
    eco: "C29",
    variations: [

    ],
  },

  {
    id: "c29-vienna-game-vienna-gambit-modern-variation",
    name: "Vienna Game: Vienna Gambit, Modern Variation",
    eco: "C29",
    variations: [

    ],
  },

  {
    id: "c29-vienna-game-vienna-gambit-paulsen-attack",
    name: "Vienna Game: Vienna Gambit, Paulsen Attack",
    eco: "C29",
    variations: [

    ],
  },

  {
    id: "c29-vienna-game-vienna-gambit-steinitz-variation",
    name: "Vienna Game: Vienna Gambit, Steinitz Variation",
    eco: "C29",
    variations: [

    ],
  },

  {
    id: "c29-vienna-game-vienna-gambit-wurzburger-trap",
    name: "Vienna Game: Vienna Gambit, Wurzburger Trap",
    eco: "C29",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-classical-variation",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-classical-variation-euwe-attack",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-classical-variation-rotlewi-countergambit",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-classical-variation-rubinstein-countergambit",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-classical-variation-walthoffen-attack",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-classical-hanham-variation",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-classical-r-ti-variation",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-classical-soldatenkov-variation",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-classical-svenonius-variation",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-hobbs-zilbermints-gambit",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-keene-defense",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-keene-s-defense",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-mafia-defense",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-miles-defense",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-norwalde-variation",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-norwalde-variation-b-cker-gambit",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-norwalde-variation-schubert-variation",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-panteldakis-countergambit",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-panteldakis-countergambit-greco-variation",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-panteldakis-countergambit-pawn-sacrifice-line",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-panteldakis-countergambit-schiller-s-defense",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-panteldakis-countergambit-shirazi-line",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-panteldakis-countergambit-symmetrical-variation",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-petrov-s-defense",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-queen-s-knight-defense",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-senechaud-countergambit",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-soller-zilbermints-gambit",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-zilbermints-double-countergambit",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c30-king-s-gambit-declined-zilbermints-double-gambit",
    name: "King",
    eco: "C30",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-accepted",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-anderssen-attack",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-blackburne-attack",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-charousek-gambit",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-charousek-gambit-morphy-defense",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-hinrichsen-gambit",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-miles-gambit",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-milner-barry-variation",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-modern-transfer",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-nimzowitsch-marshall-countergambit",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-pickler-gambit",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-rubinstein-variation",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-king-s-gambit-declined-falkbeer-countergambit-staunton-line",
    name: "King",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c31-van-geet-opening-gr-nfeld-defense-steiner-gambit",
    name: "Van Geet Opening: Grünfeld Defense, Steiner Gambit",
    eco: "C31",
    variations: [

    ],
  },

  {
    id: "c32-king-s-gambit-declined-falkbeer-countergambit-alapin-variation",
    name: "King",
    eco: "C32",
    variations: [

    ],
  },

  {
    id: "c32-king-s-gambit-declined-falkbeer-countergambit-charousek-gambit",
    name: "King",
    eco: "C32",
    variations: [

    ],
  },

  {
    id: "c32-king-s-gambit-declined-falkbeer-countergambit-charousek-gambit-accepted",
    name: "King",
    eco: "C32",
    variations: [

    ],
  },

  {
    id: "c32-king-s-gambit-declined-falkbeer-countergambit-charousek-gambit-keres-variation",
    name: "King",
    eco: "C32",
    variations: [

    ],
  },

  {
    id: "c32-king-s-gambit-declined-falkbeer-countergambit-charousek-gambit-main-line",
    name: "King",
    eco: "C32",
    variations: [

    ],
  },

  {
    id: "c32-king-s-gambit-declined-falkbeer-countergambit-charousek-gambit-old-line",
    name: "King",
    eco: "C32",
    variations: [

    ],
  },

  {
    id: "c32-king-s-gambit-declined-falkbeer-countergambit-charousek-variation",
    name: "King",
    eco: "C32",
    variations: [

    ],
  },

  {
    id: "c32-king-s-gambit-declined-falkbeer-countergambit-tarrasch-variation",
    name: "King",
    eco: "C32",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-basman-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-anderssen-defense",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-anderssen-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-bledow-countergambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-bledow-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-boden-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-bogoljubow-defense",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-bogoljubow-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-boren-svenonius-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-bryan-countergambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-chigorin-s-attack",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-classical-defense",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-classical-defense-cozio-attack",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-cozio-defense",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-cozio-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-first-jaenisch-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-fraser-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-gianutio-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-greco-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-grimm-attack",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-kieseritzky-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-lopez-defense",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-lopez-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-maurian-defense",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-mcdonnell-attack",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-paulsen-attack",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-bishop-s-gambit-steinitz-defense",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-breyer-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-carrera-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-dodo-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-eisenberg-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-gaga-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-lopez-gianutio-countergambit-hein-variation",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-mason-keres-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-orsini-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-paris-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-schurig-gambit-with-bb5",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-schurig-gambit-with-bd3",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-stamma-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-tartakower-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-tartakower-gambit-weiss-defense",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-tumbleweed",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c33-king-s-gambit-accepted-villemson-gambit",
    name: "King",
    eco: "C33",
    variations: [

    ],
  },

  {
    id: "c34-king-s-gambit-accepted-becker-defense",
    name: "King",
    eco: "C34",
    variations: [

    ],
  },

  {
    id: "c34-king-s-gambit-accepted-bonsch-osmolovsky-variation",
    name: "King",
    eco: "C34",
    variations: [

    ],
  },

  {
    id: "c34-king-s-gambit-accepted-fischer-defense",
    name: "King",
    eco: "C34",
    variations: [

    ],
  },

  {
    id: "c34-king-s-gambit-accepted-fischer-defense-schulder-gambit",
    name: "King",
    eco: "C34",
    variations: [

    ],
  },

  {
    id: "c34-king-s-gambit-accepted-fischer-defense-spanish-variation",
    name: "King",
    eco: "C34",
    variations: [

    ],
  },

  {
    id: "c34-king-s-gambit-accepted-gianutio-countergambit",
    name: "King",
    eco: "C34",
    variations: [

    ],
  },

  {
    id: "c34-king-s-gambit-accepted-greco-gambit",
    name: "King",
    eco: "C34",
    variations: [

    ],
  },

  {
    id: "c34-king-s-gambit-accepted-king-s-knight-s-gambit",
    name: "King",
    eco: "C34",
    variations: [

    ],
  },

  {
    id: "c34-king-s-gambit-accepted-macleod-defense",
    name: "King",
    eco: "C34",
    variations: [

    ],
  },

  {
    id: "c34-king-s-gambit-accepted-schallopp-defense",
    name: "King",
    eco: "C34",
    variations: [

    ],
  },

  {
    id: "c34-king-s-gambit-accepted-schallopp-defense-tashkent-attack",
    name: "King",
    eco: "C34",
    variations: [

    ],
  },

  {
    id: "c34-king-s-gambit-accepted-wagenbach-defense",
    name: "King",
    eco: "C34",
    variations: [

    ],
  },

  {
    id: "c35-king-s-gambit-accepted-cunningham-defense",
    name: "King",
    eco: "C35",
    variations: [

    ],
  },

  {
    id: "c35-king-s-gambit-accepted-cunningham-defense-bertin-gambit",
    name: "King",
    eco: "C35",
    variations: [

    ],
  },

  {
    id: "c35-king-s-gambit-accepted-cunningham-defense-mccormick-defense",
    name: "King",
    eco: "C35",
    variations: [

    ],
  },

  {
    id: "c36-king-s-gambit-accepted-abbazia-defense",
    name: "King",
    eco: "C36",
    variations: [

    ],
  },

  {
    id: "c36-king-s-gambit-accepted-abbazia-defense-main-line",
    name: "King",
    eco: "C36",
    variations: [

    ],
  },

  {
    id: "c36-king-s-gambit-accepted-modern-defense",
    name: "King",
    eco: "C36",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-australian-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-blachly-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-double-muzio-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-double-muzio-gambit-baldwin-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-double-muzio-gambit-bello-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-double-muzio-gambit-paulsen-defense",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-double-muzio-gambit-young-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-ghulam-kassim-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-king-s-knight-s-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-kotov-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-lolli-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-lolli-gambit-young-variation",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-mcdonnell-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-middleton-countergambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-muzio-gambit-accepted-from-s-defense",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-muzio-gambit-brentano-defense",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-muzio-gambit-holloway-defense",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-muzio-gambit-kling-and-horwitz-counterattack",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-muzio-gambit-sarratt-defense",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-muzio-gambit-wild-muzio-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-quaade-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-rosentreter-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-rosentreter-gambit-bird-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-rosentreter-gambit-s-rensen-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-rosentreter-gambit-testa-variation",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-salvio-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-salvio-gambit-anderssen-counterattack",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-salvio-gambit-cochrane-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-salvio-gambit-santa-maria-defense",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-salvio-gambit-silberschmidt-defense",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-salvio-gambit-viennese-variation",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-silberschmidt-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c37-king-s-gambit-accepted-s-rensen-gambit",
    name: "King",
    eco: "C37",
    variations: [

    ],
  },

  {
    id: "c38-king-s-gambit-accepted-greco-gambit",
    name: "King",
    eco: "C38",
    variations: [

    ],
  },

  {
    id: "c38-king-s-gambit-accepted-hanstein-gambit",
    name: "King",
    eco: "C38",
    variations: [

    ],
  },

  {
    id: "c38-king-s-gambit-accepted-mayet-gambit",
    name: "King",
    eco: "C38",
    variations: [

    ],
  },

  {
    id: "c38-king-s-gambit-accepted-philidor-gambit",
    name: "King",
    eco: "C38",
    variations: [

    ],
  },

  {
    id: "c38-king-s-gambit-accepted-philidor-gambit-schultz-variation",
    name: "King",
    eco: "C38",
    variations: [

    ],
  },

  {
    id: "c38-king-s-gambit-accepted-traditional-variation",
    name: "King",
    eco: "C38",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-allgaier-gambit",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-allgaier-gambit-thorold-attack",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-allgaier-gambit-urusov-attack",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-allgaier-blackburne-gambit",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-allgaier-cook-variation",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-allgaier-horny-defense",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-allgaier-schlechter-defense",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-allgaier-urusov-attack",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-anderssen-defense",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-anderssen-cordel-gambit",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-berlin-defense",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-berlin-defense-rubinstein-variation",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-berlin-defense-de-riviere-variation",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-brentano-defense",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-brentano-defense-caro-variation",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-cotter-gambit",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-kolisch-defense",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-long-whip",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-neumann-defense",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-paulsen-defense",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-paulsen-defense-deferred",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-rice-gambit",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-gambit-rosenthal-defense",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-long-whip-defense-jaenisch-variation",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-polerio-defense",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-rice-gambit",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-kieseritzky-salvio-defense-cozio-variation",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c39-king-s-gambit-accepted-king-s-knight-s-gambit",
    name: "King",
    eco: "C39",
    variations: [

    ],
  },

  {
    id: "c40-elephant-gambit",
    name: "Elephant Gambit",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-elephant-gambit-mar-czy-gambit",
    name: "Elephant Gambit: Maróczy Gambit",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-elephant-gambit-paulsen-countergambit",
    name: "Elephant Gambit: Paulsen Countergambit",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-elephant-gambit-wasp-variation",
    name: "Elephant Gambit: Wasp Variation",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-gunderam-defense",
    name: "Gunderam Defense",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-king-s-knight-opening",
    name: "King",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-king-s-pawn-game-busch-gass-gambit",
    name: "King",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-king-s-pawn-game-busch-gass-gambit-chiodini-gambit",
    name: "King",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-king-s-pawn-game-damiano-defense",
    name: "King",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-king-s-pawn-game-damiano-defense-damiano-gambit",
    name: "King",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-king-s-pawn-game-damiano-defense-damiano-gambit-chigorin-gambit",
    name: "King",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-king-s-pawn-game-gunderam-defense-gunderam-gambit",
    name: "King",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-king-s-pawn-game-gunderam-gambit",
    name: "King",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-king-s-pawn-game-la-bourdonnais-gambit",
    name: "King",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-king-s-pawn-game-mcconnell-defense",
    name: "King",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit",
    name: "Latvian Gambit",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-accepted",
    name: "Latvian Gambit Accepted",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-accepted-bilguer-variation",
    name: "Latvian Gambit Accepted: Bilguer Variation",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-accepted-bronstein-attack",
    name: "Latvian Gambit Accepted: Bronstein Attack",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-accepted-bronstein-gambit",
    name: "Latvian Gambit Accepted: Bronstein Gambit",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-accepted-foltys-variation",
    name: "Latvian Gambit Accepted: Foltys Variation",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-accepted-foltys-leonhardt-variation",
    name: "Latvian Gambit Accepted: Foltys-Leonhardt Variation",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-accepted-leonhardt-variation",
    name: "Latvian Gambit Accepted: Leonhardt Variation",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-accepted-main-line",
    name: "Latvian Gambit Accepted: Main Line",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-accepted-nimzowitsch-attack",
    name: "Latvian Gambit Accepted: Nimzowitsch Attack",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-behting-variation",
    name: "Latvian Gambit: Behting Variation",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-corkscrew-countergambit",
    name: "Latvian Gambit: Corkscrew Countergambit",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-corkscrew-gambit",
    name: "Latvian Gambit: Corkscrew Gambit",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-diepstraten-countergambit",
    name: "Latvian Gambit: Diepstraten Countergambit",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-fraser-defense",
    name: "Latvian Gambit: Fraser Defense",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-greco-variation",
    name: "Latvian Gambit: Greco Variation",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-lobster-gambit",
    name: "Latvian Gambit: Lobster Gambit",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-mason-countergambit",
    name: "Latvian Gambit: Mason Countergambit",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-mayet-attack",
    name: "Latvian Gambit: Mayet Attack",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-mayet-attack-morgado-defense",
    name: "Latvian Gambit: Mayet Attack, Morgado Defense",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-mayet-attack-poisoned-pawn-variation",
    name: "Latvian Gambit: Mayet Attack, Poisoned Pawn Variation",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-mayet-attack-polerio-svedenborg-variation",
    name: "Latvian Gambit: Mayet Attack, Polerio-Svedenborg Variation",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-mayet-attack-strautins-gambit",
    name: "Latvian Gambit: Mayet Attack, Strautins Gambit",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-mlotkowski-variation",
    name: "Latvian Gambit: Mlotkowski Variation",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c40-latvian-gambit-senechaud-gambit",
    name: "Latvian Gambit: Senechaud Gambit",
    eco: "C40",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense",
    name: "Philidor Defense",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-albin-blackburne-gambit",
    name: "Philidor Defense: Albin-Blackburne Gambit",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-berger-variation",
    name: "Philidor Defense: Berger Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-bird-gambit",
    name: "Philidor Defense: Bird Gambit",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-boden-variation",
    name: "Philidor Defense: Boden Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-exchange-variation",
    name: "Philidor Defense: Exchange Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-hanham-variation",
    name: "Philidor Defense: Hanham Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-hanham-variation-delmar-variation",
    name: "Philidor Defense: Hanham Variation, Delmar Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-hanham-variation-krause-variation",
    name: "Philidor Defense: Hanham Variation, Krause Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-hanham-variation-schlechter-variation",
    name: "Philidor Defense: Hanham Variation, Schlechter Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-hanham-variation-sharp-variation",
    name: "Philidor Defense: Hanham Variation, Sharp Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-hanham-variation-steiner-variation",
    name: "Philidor Defense: Hanham Variation, Steiner Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-hanham-kmoch-variation",
    name: "Philidor Defense: Hanham, Kmoch Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-larsen-variation",
    name: "Philidor Defense: Larsen Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-lion-variation",
    name: "Philidor Defense: Lion Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-lion-variation-bishop-sacrifice",
    name: "Philidor Defense: Lion Variation, Bishop Sacrifice",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-lion-variation-delayed-bishop-sacrifice",
    name: "Philidor Defense: Lion Variation, Delayed Bishop Sacrifice",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-lion-variation-forcing-line",
    name: "Philidor Defense: Lion Variation, Forcing Line",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-lion-variation-lion-s-claw-with-bc4-and-h6",
    name: "Philidor Defense: Lion Variation, Lion",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-lion-variation-lion-s-claw-with-be2-and-c6",
    name: "Philidor Defense: Lion Variation, Lion",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-lion-variation-shirov-gambit",
    name: "Philidor Defense: Lion Variation, Shirov Gambit",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-lion-variation-sozin-variation",
    name: "Philidor Defense: Lion Variation, Sozin Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-lopez-countergambit",
    name: "Philidor Defense: Lopez Countergambit",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-lopez-countergambit-jaenisch-variation",
    name: "Philidor Defense: Lopez Countergambit, Jaenisch Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-morphy-gambit",
    name: "Philidor Defense: Morphy Gambit",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-nimzowitsch-variation",
    name: "Philidor Defense: Nimzowitsch Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-nimzowitsch-variation-klein-variation",
    name: "Philidor Defense: Nimzowitsch Variation, Klein Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-nimzowitsch-variation-rellstab-variation",
    name: "Philidor Defense: Nimzowitsch Variation, Rellstab Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-nimzowitsch-variation-sokolsky-variation",
    name: "Philidor Defense: Nimzowitsch Variation, Sokolsky Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-nimzowitsch-larobok-variation",
    name: "Philidor Defense: Nimzowitsch, Larobok Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-nimzowitsch-locock-variation",
    name: "Philidor Defense: Nimzowitsch, Locock Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-paulsen-attack",
    name: "Philidor Defense: Paulsen Attack",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-philidor-countergambit",
    name: "Philidor Defense: Philidor Countergambit",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-philidor-countergambit-berger-variation",
    name: "Philidor Defense: Philidor Countergambit, Berger Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-philidor-countergambit-zukertort-variation",
    name: "Philidor Defense: Philidor Countergambit, Zukertort Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-philidor-countergambit-del-rio-attack",
    name: "Philidor Defense: Philidor Countergambit, del Rio Attack",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-philidor-gambit",
    name: "Philidor Defense: Philidor Gambit",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c41-philidor-defense-steinitz-variation",
    name: "Philidor Defense: Steinitz Variation",
    eco: "C41",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-berger-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-chigorin-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-chigorin-variation-browne-attack",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-chigorin-variation-main-line",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-closed-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-jaenisch-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-krause-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-marshall-trap",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-marshall-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-marshall-variation-chinese-gambit",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-mar-czy-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-mason-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-mason-showalter-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-staunton-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-classical-attack-tarrasch-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-cochrane-gambit",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-cochrane-gambit-bishop-check-line",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-cochrane-gambit-center-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-cozio-attack",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-damiano-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-damiano-variation-kholmov-gambit",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-french-attack",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-italian-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-karklins-martinovsky-variation",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-kaufmann-attack",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-millennium-attack",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-moody-gambit",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-nimzowitsch-attack",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-paulsen-attack",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-stafford-gambit",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-stafford-gambit-accepted",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c42-petrov-s-defense-three-knights-game",
    name: "Petrov",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "petrov",
    name: "Petrov Defense",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "petrov-steinitz",
    name: "Petrov Defense: Steinitz Variation",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "petrov-three-knights",
    name: "Petrov Defense: Three Knights Game",
    eco: "C42",
    variations: [

    ],
  },

  {
    id: "c43-bishop-s-opening-urusov-gambit",
    name: "Bishop",
    eco: "C43",
    variations: [

    ],
  },

  {
    id: "c43-bishop-s-opening-urusov-gambit-keidansky-gambit",
    name: "Bishop",
    eco: "C43",
    variations: [

    ],
  },

  {
    id: "c43-petrov-s-defense-modern-attack",
    name: "Petrov",
    eco: "C43",
    variations: [

    ],
  },

  {
    id: "c43-petrov-s-defense-modern-attack-bardeleben-variation",
    name: "Petrov",
    eco: "C43",
    variations: [

    ],
  },

  {
    id: "c43-petrov-s-defense-modern-attack-center-attack",
    name: "Petrov",
    eco: "C43",
    variations: [

    ],
  },

  {
    id: "c43-petrov-s-defense-modern-attack-center-variation",
    name: "Petrov",
    eco: "C43",
    variations: [

    ],
  },

  {
    id: "c43-petrov-s-defense-modern-attack-murrey-variation",
    name: "Petrov",
    eco: "C43",
    variations: [

    ],
  },

  {
    id: "c43-petrov-s-defense-modern-attack-steinitz-variation",
    name: "Petrov",
    eco: "C43",
    variations: [

    ],
  },

  {
    id: "c43-petrov-s-defense-modern-attack-symmetrical-variation",
    name: "Petrov",
    eco: "C43",
    variations: [

    ],
  },

  {
    id: "c43-petrov-s-defense-modern-attack-tal-gambit",
    name: "Petrov",
    eco: "C43",
    variations: [

    ],
  },

  {
    id: "c43-petrov-s-defense-modern-attack-trifunovic-variation",
    name: "Petrov",
    eco: "C43",
    variations: [

    ],
  },

  {
    id: "c44-dresden-opening-the-goblin",
    name: "Dresden Opening: The Goblin",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-irish-gambit",
    name: "Irish Gambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-king-s-knight-opening-konstantinopolsky",
    name: "King",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-king-s-knight-opening-normal-variation",
    name: "King",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-king-s-pawn-game-dresden-opening",
    name: "King",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-king-s-pawn-game-pachman-wing-gambit",
    name: "King",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-king-s-pawn-game-schulze-m-ller-gambit",
    name: "King",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-king-s-pawn-game-tayler-opening",
    name: "King",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-king-s-pawn-game-tayler-opening-basman-gambit",
    name: "King",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-king-s-pawn-game-tayler-opening-inverted-hanham",
    name: "King",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-latvian-gambit-clam-gambit",
    name: "Latvian Gambit: Clam Gambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening",
    name: "Ponziani Opening",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening-caro-gambit",
    name: "Ponziani Opening: Caro Gambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening-jaenisch-counterattack",
    name: "Ponziani Opening: Jaenisch Counterattack",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening-leonhardt-variation",
    name: "Ponziani Opening: Leonhardt Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening-neumann-gambit",
    name: "Ponziani Opening: Neumann Gambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening-ponziani-countergambit",
    name: "Ponziani Opening: Ponziani Countergambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening-ponziani-countergambit-schmidt-attack",
    name: "Ponziani Opening: Ponziani Countergambit, Schmidt Attack",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening-romanishin-variation",
    name: "Ponziani Opening: Romanishin Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening-r-ti-variation",
    name: "Ponziani Opening: Réti Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening-spanish-variation",
    name: "Ponziani Opening: Spanish Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening-spanish-variation-harrwitz-attack-nikitin-gambit",
    name: "Ponziani Opening: Spanish Variation, Harrwitz Attack, Nikitin Gambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening-steinitz-variation",
    name: "Ponziani Opening: Steinitz Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-ponziani-opening-vukovic-gambit",
    name: "Ponziani Opening: Vukovic Gambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "scotch-gambit",
    name: "Scotch Gambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game",
    name: "Scotch Game",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-benima-defense",
    name: "Scotch Game: Benima Defense",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-cochrane-variation",
    name: "Scotch Game: Cochrane Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-cochrane-shumov-defense",
    name: "Scotch Game: Cochrane-Shumov Defense",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-g-ring-gambit",
    name: "Scotch Game: Göring Gambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-g-ring-gambit-bardeleben-variation",
    name: "Scotch Game: Göring Gambit, Bardeleben Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-g-ring-gambit-double-pawn-sacrifice",
    name: "Scotch Game: Göring Gambit, Double Pawn Sacrifice",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-g-ring-gambit-main-line",
    name: "Scotch Game: Göring Gambit, Main Line",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-hanneken-variation",
    name: "Scotch Game: Hanneken Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-haxo-gambit",
    name: "Scotch Game: Haxo Gambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-lolli-variation",
    name: "Scotch Game: Lolli Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-napoleon-gambit",
    name: "Scotch Game: Napoleon Gambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-relfsson-gambit",
    name: "Scotch Game: Relfsson Gambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-scotch-gambit",
    name: "Scotch Game: Scotch Gambit",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-scotch-gambit-advance-variation",
    name: "Scotch Game: Scotch Gambit, Advance Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-scotch-gambit-cochrane-anderssen-variation",
    name: "Scotch Game: Scotch Gambit, Cochrane-Anderssen Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-scotch-gambit-dubois-r-ti-defense",
    name: "Scotch Game: Scotch Gambit, Dubois Réti Defense",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-scotch-gambit-g-ring-gambit-declined",
    name: "Scotch Game: Scotch Gambit, Göring Gambit Declined",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-scotch-gambit-kingside-variation",
    name: "Scotch Game: Scotch Gambit, Kingside Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-scotch-gambit-london-defense",
    name: "Scotch Game: Scotch Gambit, London Defense",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-scotch-gambit-sarratt-variation",
    name: "Scotch Game: Scotch Gambit, Sarratt Variation",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-sea-cadet-mate",
    name: "Scotch Game: Sea-Cadet Mate",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c44-scotch-game-vitzthum-attack",
    name: "Scotch Game: Vitzthum Attack",
    eco: "C44",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game",
    name: "Scotch Game",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-alekhine-gambit",
    name: "Scotch Game: Alekhine Gambit",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-blumenfeld-attack",
    name: "Scotch Game: Blumenfeld Attack",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-braune-variation",
    name: "Scotch Game: Braune Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-classical-variation",
    name: "Scotch Game: Classical Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-classical-variation-blackburne-attack",
    name: "Scotch Game: Classical Variation, Blackburne Attack",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-classical-variation-intermezzo-variation",
    name: "Scotch Game: Classical Variation, Intermezzo Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-classical-variation-millennium-variation",
    name: "Scotch Game: Classical Variation, Millennium Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-fraser-variation",
    name: "Scotch Game: Fraser Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-ghulam-kassim-variation",
    name: "Scotch Game: Ghulam-Kassim Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-gottschall-variation",
    name: "Scotch Game: Gottschall Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-horwitz-attack",
    name: "Scotch Game: Horwitz Attack",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-horwitz-attack-blackburne-variation",
    name: "Scotch Game: Horwitz Attack, Blackburne Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-malaniuk-variation",
    name: "Scotch Game: Malaniuk Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-meitner-variation",
    name: "Scotch Game: Meitner Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-mieses-variation",
    name: "Scotch Game: Mieses Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-modern-defense",
    name: "Scotch Game: Modern Defense",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-paulsen-attack",
    name: "Scotch Game: Paulsen Attack",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-paulsen-variation",
    name: "Scotch Game: Paulsen Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-paulsen-gunsberg-defense",
    name: "Scotch Game: Paulsen, Gunsberg Defense",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-potter-variation",
    name: "Scotch Game: Potter Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-romanishin-variation",
    name: "Scotch Game: Romanishin Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-rosenthal-variation",
    name: "Scotch Game: Rosenthal Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-schmidt-variation",
    name: "Scotch Game: Schmidt Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-steinitz-variation",
    name: "Scotch Game: Steinitz Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c45-scotch-game-tartakower-variation",
    name: "Scotch Game: Tartakower Variation",
    eco: "C45",
    variations: [

    ],
  },

  {
    id: "c46-three-knights-opening",
    name: "Three Knights Opening",
    eco: "C46",
    variations: [

    ],
  },

  {
    id: "c46-three-knights-opening-schlechter-variation",
    name: "Three Knights Opening: Schlechter Variation",
    eco: "C46",
    variations: [

    ],
  },

  {
    id: "c46-three-knights-opening-steinitz-defense",
    name: "Three Knights Opening: Steinitz Defense",
    eco: "C46",
    variations: [

    ],
  },

  {
    id: "c46-three-knights-opening-steinitz-rosenthal-variation",
    name: "Three Knights Opening: Steinitz-Rosenthal Variation",
    eco: "C46",
    variations: [

    ],
  },

  {
    id: "c46-three-knights-opening-winawer-defense",
    name: "Three Knights Opening: Winawer Defense",
    eco: "C46",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game",
    name: "Four Knights Game",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-glek-system",
    name: "Four Knights Game: Glek System",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-gunsberg-variation",
    name: "Four Knights Game: Gunsberg Variation",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-gunsberg-variation-provincial-opening",
    name: "Four Knights Game: Gunsberg Variation, Provincial Opening",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-halloween-gambit",
    name: "Four Knights Game: Halloween Gambit",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-halloween-gambit-oldtimer-variation",
    name: "Four Knights Game: Halloween Gambit, Oldtimer Variation",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-halloween-gambit-plasma-variation",
    name: "Four Knights Game: Halloween Gambit, Plasma Variation",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-italian-variation",
    name: "Four Knights Game: Italian Variation",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-italian-variation-noa-gambit",
    name: "Four Knights Game: Italian Variation, Noa Gambit",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-naroditsky-variation",
    name: "Four Knights Game: Naroditsky Variation",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-scotch-variation",
    name: "Four Knights Game: Scotch Variation",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-scotch-variation-accepted",
    name: "Four Knights Game: Scotch Variation Accepted",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-scotch-variation-accepted-main-line",
    name: "Four Knights Game: Scotch Variation Accepted, Main Line",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-scotch-variation-belgrade-gambit",
    name: "Four Knights Game: Scotch Variation, Belgrade Gambit",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-scotch-variation-belgrade-gambit-modern-defense",
    name: "Four Knights Game: Scotch Variation, Belgrade Gambit, Modern Defense",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-scotch-variation-krause-gambit",
    name: "Four Knights Game: Scotch Variation, Krause Gambit",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-scotch-variation-krause-gambit-leonhardt-defense",
    name: "Four Knights Game: Scotch Variation, Krause Gambit, Leonhardt Defense",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-scotch-variation-oxford-gambit",
    name: "Four Knights Game: Scotch Variation, Oxford Gambit",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c47-four-knights-game-scotch-variation-schmid-defense",
    name: "Four Knights Game: Scotch Variation, Schmid Defense",
    eco: "C47",
    variations: [

    ],
  },

  {
    id: "c48-four-knights-game-spanish-variation",
    name: "Four Knights Game: Spanish Variation",
    eco: "C48",
    variations: [

    ],
  },

  {
    id: "c48-four-knights-game-spanish-variation-bardeleben-variation",
    name: "Four Knights Game: Spanish Variation, Bardeleben Variation",
    eco: "C48",
    variations: [

    ],
  },

  {
    id: "c48-four-knights-game-spanish-variation-classical-variation",
    name: "Four Knights Game: Spanish Variation, Classical Variation",
    eco: "C48",
    variations: [

    ],
  },

  {
    id: "c48-four-knights-game-spanish-variation-ranken-variation",
    name: "Four Knights Game: Spanish Variation, Ranken Variation",
    eco: "C48",
    variations: [

    ],
  },

  {
    id: "c48-four-knights-game-spanish-variation-rubinstein-variation",
    name: "Four Knights Game: Spanish Variation, Rubinstein Variation",
    eco: "C48",
    variations: [

    ],
  },

  {
    id: "c48-four-knights-game-spanish-variation-rubinstein-variation-accepted",
    name: "Four Knights Game: Spanish Variation, Rubinstein Variation Accepted",
    eco: "C48",
    variations: [

    ],
  },

  {
    id: "c48-four-knights-game-spanish-variation-rubinstein-variation-henneberger-variation",
    name: "Four Knights Game: Spanish Variation, Rubinstein Variation, Henneberger Variation",
    eco: "C48",
    variations: [

    ],
  },

  {
    id: "c48-four-knights-game-spanish-variation-rubinstein-variation-marshall-gambit",
    name: "Four Knights Game: Spanish Variation, Rubinstein Variation, Marshall Gambit",
    eco: "C48",
    variations: [

    ],
  },

  {
    id: "c48-four-knights-game-spanish-variation-rubinstein-variation-marshall-variation",
    name: "Four Knights Game: Spanish Variation, Rubinstein Variation, Marshall Variation",
    eco: "C48",
    variations: [

    ],
  },

  {
    id: "c48-four-knights-game-spanish-variation-rubinstein-variation-mar-czy-variation",
    name: "Four Knights Game: Spanish Variation, Rubinstein Variation, Maróczy Variation",
    eco: "C48",
    variations: [

    ],
  },

  {
    id: "c48-four-knights-game-spanish-variation-spielmann-variation",
    name: "Four Knights Game: Spanish Variation, Spielmann Variation",
    eco: "C48",
    variations: [

    ],
  },

  {
    id: "c49-four-knights-game-spanish-variation",
    name: "Four Knights Game: Spanish Variation",
    eco: "C49",
    variations: [

    ],
  },

  {
    id: "c49-four-knights-game-spanish-variation-alatortsev-variation",
    name: "Four Knights Game: Spanish Variation, Alatortsev Variation",
    eco: "C49",
    variations: [

    ],
  },

  {
    id: "c49-four-knights-game-spanish-variation-double-spanish",
    name: "Four Knights Game: Spanish Variation, Double Spanish",
    eco: "C49",
    variations: [

    ],
  },

  {
    id: "c49-four-knights-game-spanish-variation-gunsberg-counterattack",
    name: "Four Knights Game: Spanish Variation, Gunsberg Counterattack",
    eco: "C49",
    variations: [

    ],
  },

  {
    id: "c49-four-knights-game-spanish-variation-janowski-variation",
    name: "Four Knights Game: Spanish Variation, Janowski Variation",
    eco: "C49",
    variations: [

    ],
  },

  {
    id: "c49-four-knights-game-spanish-variation-nimzowitsch-variation",
    name: "Four Knights Game: Spanish Variation, Nimzowitsch Variation",
    eco: "C49",
    variations: [

    ],
  },

  {
    id: "c49-four-knights-game-spanish-variation-svenonius-variation",
    name: "Four Knights Game: Spanish Variation, Svenonius Variation",
    eco: "C49",
    variations: [

    ],
  },

  {
    id: "c49-four-knights-game-spanish-variation-symmetrical-variation",
    name: "Four Knights Game: Spanish Variation, Symmetrical Variation",
    eco: "C49",
    variations: [

    ],
  },

  {
    id: "c49-four-knights-game-spanish-variation-symmetrical-variation-blake-variation",
    name: "Four Knights Game: Spanish Variation, Symmetrical Variation, Blake Variation",
    eco: "C49",
    variations: [

    ],
  },

  {
    id: "c49-four-knights-game-spanish-variation-symmetrical-variation-metger-unpin",
    name: "Four Knights Game: Spanish Variation, Symmetrical Variation, Metger Unpin",
    eco: "C49",
    variations: [

    ],
  },

  {
    id: "c49-four-knights-game-spanish-variation-symmetrical-variation-tarrasch-variation",
    name: "Four Knights Game: Spanish Variation, Symmetrical Variation, Tarrasch Variation",
    eco: "C49",
    variations: [

    ],
  },

  {
    id: "c50-four-knights-game-italian-variation",
    name: "Four Knights Game: Italian Variation",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "hungarian-defense",
    name: "Hungarian Defense",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "hungarian-defense-classical",
    name: "Hungarian Defense: Classical Variation",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game",
    name: "Italian Game",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-anti-fried-liver-defense",
    name: "Italian Game: Anti-Fried Liver Defense",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-blackburne-kosti-gambit",
    name: "Italian Game: Blackburne-Kostić Gambit",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-classical-variation-albin-gambit",
    name: "Italian Game: Classical Variation, Albin Gambit",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-deutz-gambit",
    name: "Italian Game: Deutz Gambit",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-giuoco-pianissimo",
    name: "Italian Game: Giuoco Pianissimo",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-giuoco-pianissimo-canal-variation",
    name: "Italian Game: Giuoco Pianissimo, Canal Variation",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-giuoco-pianissimo-dubois-variation",
    name: "Italian Game: Giuoco Pianissimo, Dubois Variation",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-giuoco-pianissimo-italian-four-knights-variation",
    name: "Italian Game: Giuoco Pianissimo, Italian Four Knights Variation",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-giuoco-pianissimo-lucchini-gambit",
    name: "Italian Game: Giuoco Pianissimo, Lucchini Gambit",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-giuoco-pianissimo-normal",
    name: "Italian Game: Giuoco Pianissimo, Normal",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-giuoco-piano",
    name: "Italian Game: Giuoco Piano",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-hungarian-defense",
    name: "Italian Game: Hungarian Defense",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-hungarian-defense-tartakower-variation",
    name: "Italian Game: Hungarian Defense, Tartakower Variation",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-jerome-gambit",
    name: "Italian Game: Jerome Gambit",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-paris-defense",
    name: "Italian Game: Paris Defense",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-rosentreter-gambit",
    name: "Italian Game: Rosentreter Gambit",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "c50-italian-game-rousseau-gambit",
    name: "Italian Game: Rousseau Gambit",
    eco: "C50",
    variations: [

    ],
  },

  {
    id: "evans-gambit",
    name: "Evans Gambit",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "evans-gambit-compromised",
    name: "Evans Gambit: Compromised Defense",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit",
    name: "Italian Game: Evans Gambit",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-accepted",
    name: "Italian Game: Evans Gambit Accepted",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-declined",
    name: "Italian Game: Evans Gambit Declined",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-declined-cordel-variation",
    name: "Italian Game: Evans Gambit Declined, Cordel Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-declined-hicken-variation",
    name: "Italian Game: Evans Gambit Declined, Hicken Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-declined-hirschbach-variation",
    name: "Italian Game: Evans Gambit Declined, Hirschbach Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-declined-lange-variation",
    name: "Italian Game: Evans Gambit Declined, Lange Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-declined-pavlov-variation",
    name: "Italian Game: Evans Gambit Declined, Pavlov Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-declined-showalter-variation",
    name: "Italian Game: Evans Gambit Declined, Showalter Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-declined-vasquez-variation",
    name: "Italian Game: Evans Gambit Declined, Vasquez Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-anderssen-variation",
    name: "Italian Game: Evans Gambit, Anderssen Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-anderssen-variation-cordel-line",
    name: "Italian Game: Evans Gambit, Anderssen Variation, Cordel Line",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-fontaine-countergambit",
    name: "Italian Game: Evans Gambit, Fontaine Countergambit",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-fraser-attack",
    name: "Italian Game: Evans Gambit, Fraser Attack",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-fraser-mortimer-attack",
    name: "Italian Game: Evans Gambit, Fraser-Mortimer Attack",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-g-ring-attack",
    name: "Italian Game: Evans Gambit, Göring Attack",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-harding-variation",
    name: "Italian Game: Evans Gambit, Harding Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-hein-countergambit",
    name: "Italian Game: Evans Gambit, Hein Countergambit",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-mayet-defense",
    name: "Italian Game: Evans Gambit, Mayet Defense",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-mcdonnell-defense",
    name: "Italian Game: Evans Gambit, McDonnell Defense",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-mcdonnell-defense-main-line",
    name: "Italian Game: Evans Gambit, McDonnell Defense, Main Line",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-morphy-attack",
    name: "Italian Game: Evans Gambit, Morphy Attack",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-mortimer-evans-gambit",
    name: "Italian Game: Evans Gambit, Mortimer-Evans Gambit",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-paulsen-variation",
    name: "Italian Game: Evans Gambit, Paulsen Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-steinitz-variation",
    name: "Italian Game: Evans Gambit, Steinitz Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-stone-ware-variation",
    name: "Italian Game: Evans Gambit, Stone-Ware Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "c51-italian-game-evans-gambit-ulvestad-variation",
    name: "Italian Game: Evans Gambit, Ulvestad Variation",
    eco: "C51",
    variations: [

    ],
  },

  {
    id: "evans-gambit-main",
    name: "Evans Gambit: Main Line",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit",
    name: "Italian Game: Evans Gambit",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-alapin-steinitz-variation",
    name: "Italian Game: Evans Gambit, Alapin-Steinitz Variation",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-anderssen-defense",
    name: "Italian Game: Evans Gambit, Anderssen Defense",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-bronstein-defense",
    name: "Italian Game: Evans Gambit, Bronstein Defense",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-compromised-defense",
    name: "Italian Game: Evans Gambit, Compromised Defense",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-compromised-defense-main-line",
    name: "Italian Game: Evans Gambit, Compromised Defense, Main Line",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-compromised-defense-potter-variation",
    name: "Italian Game: Evans Gambit, Compromised Defense, Potter Variation",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-dufresne-defense",
    name: "Italian Game: Evans Gambit, Dufresne Defense",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-johner-defense",
    name: "Italian Game: Evans Gambit, Johner Defense",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-laroche-variation",
    name: "Italian Game: Evans Gambit, Laroche Variation",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-lasker-defense",
    name: "Italian Game: Evans Gambit, Lasker Defense",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-leonhardt-countergambit",
    name: "Italian Game: Evans Gambit, Leonhardt Countergambit",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-levenfish-variation",
    name: "Italian Game: Evans Gambit, Levenfish Variation",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-main-line",
    name: "Italian Game: Evans Gambit, Main Line",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-mieses-defense",
    name: "Italian Game: Evans Gambit, Mieses Defense",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-pierce-defense",
    name: "Italian Game: Evans Gambit, Pierce Defense",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-richardson-attack",
    name: "Italian Game: Evans Gambit, Richardson Attack",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-sanders-alapin-variation",
    name: "Italian Game: Evans Gambit, Sanders-Alapin Variation",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-slow-variation",
    name: "Italian Game: Evans Gambit, Slow Variation",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-sokolsky-variation",
    name: "Italian Game: Evans Gambit, Sokolsky Variation",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-tartakower-attack",
    name: "Italian Game: Evans Gambit, Tartakower Attack",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c52-italian-game-evans-gambit-waller-attack",
    name: "Italian Game: Evans Gambit, Waller Attack",
    eco: "C52",
    variations: [

    ],
  },

  {
    id: "c53-italian-game-bird-s-attack",
    name: "Italian Game: Bird",
    eco: "C53",
    variations: [

    ],
  },

  {
    id: "c53-italian-game-classical-variation",
    name: "Italian Game: Classical Variation",
    eco: "C53",
    variations: [

    ],
  },

  {
    id: "c53-italian-game-classical-variation-center-holding-variation",
    name: "Italian Game: Classical Variation, Center Holding Variation",
    eco: "C53",
    variations: [

    ],
  },

  {
    id: "c53-italian-game-classical-variation-closed-variation",
    name: "Italian Game: Classical Variation, Closed Variation",
    eco: "C53",
    variations: [

    ],
  },

  {
    id: "c53-italian-game-classical-variation-eisinger-variation",
    name: "Italian Game: Classical Variation, Eisinger Variation",
    eco: "C53",
    variations: [

    ],
  },

  {
    id: "c53-italian-game-classical-variation-la-bourdonnais-variation",
    name: "Italian Game: Classical Variation, La Bourdonnais Variation",
    eco: "C53",
    variations: [

    ],
  },

  {
    id: "c53-italian-game-classical-variation-mestel-variation",
    name: "Italian Game: Classical Variation, Mestel Variation",
    eco: "C53",
    variations: [

    ],
  },

  {
    id: "c53-italian-game-classical-variation-tarrasch-variation",
    name: "Italian Game: Classical Variation, Tarrasch Variation",
    eco: "C53",
    variations: [

    ],
  },

  {
    id: "greek-gift",
    name: "Greco Gambit",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation",
    name: "Italian Game: Classical Variation",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-center-attack",
    name: "Italian Game: Classical Variation, Center Attack",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-ghulam-kassim-variation",
    name: "Italian Game: Classical Variation, Ghulam-Kassim Variation",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-giuoco-pianissimo",
    name: "Italian Game: Classical Variation, Giuoco Pianissimo",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-giuoco-pianissimo-albin-variation",
    name: "Italian Game: Classical Variation, Giuoco Pianissimo, Albin Variation",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-giuoco-pianissimo-main-line",
    name: "Italian Game: Classical Variation, Giuoco Pianissimo, Main Line",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-giuoco-pianissimo-with-a4-a5",
    name: "Italian Game: Classical Variation, Giuoco Pianissimo, with a4 a5",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-giuoco-pianissimo-with-a5",
    name: "Italian Game: Classical Variation, Giuoco Pianissimo, with a5",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-giuoco-pianissimo-with-a6",
    name: "Italian Game: Classical Variation, Giuoco Pianissimo, with a6",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-giuoco-pianissimo-with-h6",
    name: "Italian Game: Classical Variation, Giuoco Pianissimo, with h6",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-greco-gambit-anderssen-variation",
    name: "Italian Game: Classical Variation, Greco Gambit, Anderssen Variation",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-greco-gambit-dubov-italian",
    name: "Italian Game: Classical Variation, Greco Gambit, Dubov Italian",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-greco-gambit-greco-variation",
    name: "Italian Game: Classical Variation, Greco Gambit, Greco Variation",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-greco-gambit-main-line",
    name: "Italian Game: Classical Variation, Greco Gambit, Main Line",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-greco-gambit-modern-line",
    name: "Italian Game: Classical Variation, Greco Gambit, Modern Line",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-greco-gambit-moeller-bayonet-attack",
    name: "Italian Game: Classical Variation, Greco Gambit, Moeller-Bayonet Attack",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-greco-gambit-moeller-therkatz-attack",
    name: "Italian Game: Classical Variation, Greco Gambit, Moeller-Therkatz Attack",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-greco-gambit-traditional-line",
    name: "Italian Game: Classical Variation, Greco Gambit, Traditional Line",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-classical-variation-with-d5",
    name: "Italian Game: Classical Variation, with d5",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-giuoco-piano-aitken-variation",
    name: "Italian Game: Giuoco Piano, Aitken Variation",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-giuoco-piano-bernstein-variation",
    name: "Italian Game: Giuoco Piano, Bernstein Variation",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-giuoco-piano-cracow-variation",
    name: "Italian Game: Giuoco Piano, Cracow Variation",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-giuoco-piano-greco-s-attack",
    name: "Italian Game: Giuoco Piano, Greco",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-giuoco-piano-holzhausen-attack",
    name: "Italian Game: Giuoco Piano, Holzhausen Attack",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-giuoco-piano-krause-variation",
    name: "Italian Game: Giuoco Piano, Krause Variation",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-giuoco-piano-rosentreter-variation",
    name: "Italian Game: Giuoco Piano, Rosentreter Variation",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-giuoco-piano-steinitz-variation",
    name: "Italian Game: Giuoco Piano, Steinitz Variation",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "c54-italian-game-giuoco-piano-therkatz-herzog-variation",
    name: "Italian Game: Giuoco Piano, Therkatz-Herzog Variation",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "italian-moller",
    name: "Italian Game: Møller Attack",
    eco: "C54",
    variations: [

    ],
  },

  {
    id: "italian-knight-attack",
    name: "Italian Game: Knight Attack",
    eco: "C55",
    variations: [

    ],
  },

  {
    id: "c55-italian-game-two-knights-defense",
    name: "Italian Game: Two Knights Defense",
    eco: "C55",
    variations: [

    ],
  },

  {
    id: "italian-two-knights-polish",
    name: "Italian Game: Two Knights Defense (Polish Variation)",
    eco: "C55",
    variations: [

    ],
  },

  {
    id: "c55-italian-game-two-knights-defense-modern-bishop-s-opening",
    name: "Italian Game: Two Knights Defense, Modern Bishop",
    eco: "C55",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit",
    name: "Italian Game: Scotch Gambit",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit-anderssen-attack",
    name: "Italian Game: Scotch Gambit, Anderssen Attack",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit-anderssen-attack-main-line",
    name: "Italian Game: Scotch Gambit, Anderssen Attack, Main Line",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit-canal-variation",
    name: "Italian Game: Scotch Gambit, Canal Variation",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit-double-gambit-accepted",
    name: "Italian Game: Scotch Gambit, Double Gambit Accepted",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit-janowski-defense",
    name: "Italian Game: Scotch Gambit, Janowski Defense",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit-max-lange-attack",
    name: "Italian Game: Scotch Gambit, Max Lange Attack",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit-max-lange-attack-accepted",
    name: "Italian Game: Scotch Gambit, Max Lange Attack Accepted",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit-max-lange-attack-long-variation",
    name: "Italian Game: Scotch Gambit, Max Lange Attack, Long Variation",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit-max-lange-attack-spielmann-defense",
    name: "Italian Game: Scotch Gambit, Max Lange Attack, Spielmann Defense",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit-nakhmanson-gambit",
    name: "Italian Game: Scotch Gambit, Nakhmanson Gambit",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit-walbrodt-baird-gambit",
    name: "Italian Game: Scotch Gambit, Walbrodt-Baird Gambit",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-gambit-de-riviere-defense",
    name: "Italian Game: Scotch Gambit, de Riviere Defense",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-scotch-invitation-declined",
    name: "Italian Game: Scotch Invitation Declined",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "italian-two-knights",
    name: "Italian Game: Two Knights Defense",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-two-knights-defense-keidansky-variation",
    name: "Italian Game: Two Knights Defense, Keidansky Variation",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-two-knights-defense-max-lange-attack",
    name: "Italian Game: Two Knights Defense, Max Lange Attack",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-two-knights-defense-max-lange-attack-berger-variation",
    name: "Italian Game: Two Knights Defense, Max Lange Attack, Berger Variation",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-two-knights-defense-max-lange-attack-krause-variation",
    name: "Italian Game: Two Knights Defense, Max Lange Attack, Krause Variation",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-two-knights-defense-max-lange-attack-loman-defense",
    name: "Italian Game: Two Knights Defense, Max Lange Attack, Loman Defense",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-two-knights-defense-max-lange-attack-rubinstein-variation",
    name: "Italian Game: Two Knights Defense, Max Lange Attack, Rubinstein Variation",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-two-knights-defense-open-variation",
    name: "Italian Game: Two Knights Defense, Open Variation",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-two-knights-defense-perreux-variation",
    name: "Italian Game: Two Knights Defense, Perreux Variation",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c56-italian-game-two-knights-defense-yurdansky-attack",
    name: "Italian Game: Two Knights Defense, Yurdansky Attack",
    eco: "C56",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-fegatello-attack-leonhardt-variation",
    name: "Italian Game: Two Knights Defense, Fegatello Attack, Leonhardt Variation",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-fried-liver-attack",
    name: "Italian Game: Two Knights Defense, Fried Liver Attack",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-fritz-variation",
    name: "Italian Game: Two Knights Defense, Fritz Variation",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-fritz-gruber-variation",
    name: "Italian Game: Two Knights Defense, Fritz, Gruber Variation",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-kloss-gambit",
    name: "Italian Game: Two Knights Defense, Kloss Gambit",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-knight-attack",
    name: "Italian Game: Two Knights Defense, Knight Attack",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-knight-attack-normal-variation",
    name: "Italian Game: Two Knights Defense, Knight Attack, Normal Variation",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-lolli-attack",
    name: "Italian Game: Two Knights Defense, Lolli Attack",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-pincus-variation",
    name: "Italian Game: Two Knights Defense, Pincus Variation",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-ponziani-steinitz-gambit",
    name: "Italian Game: Two Knights Defense, Ponziani-Steinitz Gambit",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-traxler-counterattack",
    name: "Italian Game: Two Knights Defense, Traxler Counterattack",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-traxler-counterattack-bishop-sacrifice-line",
    name: "Italian Game: Two Knights Defense, Traxler Counterattack, Bishop Sacrifice Line",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-traxler-counterattack-king-march-line",
    name: "Italian Game: Two Knights Defense, Traxler Counterattack, King March Line",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-traxler-counterattack-knight-sacrifice-line",
    name: "Italian Game: Two Knights Defense, Traxler Counterattack, Knight Sacrifice Line",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-traxler-variation-trencianske-teplice-gambit",
    name: "Italian Game: Two Knights Defense, Traxler Variation, Trencianske-Teplice Gambit",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-ulvestad-variation",
    name: "Italian Game: Two Knights Defense, Ulvestad Variation",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c57-italian-game-two-knights-defense-ulvestad-variation-kurkin-gambit",
    name: "Italian Game: Two Knights Defense, Ulvestad Variation, Kurkin Gambit",
    eco: "C57",
    variations: [

    ],
  },

  {
    id: "c58-italian-game-two-knights-defense",
    name: "Italian Game: Two Knights Defense",
    eco: "C58",
    variations: [

    ],
  },

  {
    id: "c58-italian-game-two-knights-defense-blackburne-variation",
    name: "Italian Game: Two Knights Defense, Blackburne Variation",
    eco: "C58",
    variations: [

    ],
  },

  {
    id: "c58-italian-game-two-knights-defense-colman-variation",
    name: "Italian Game: Two Knights Defense, Colman Variation",
    eco: "C58",
    variations: [

    ],
  },

  {
    id: "c58-italian-game-two-knights-defense-mar-czy-variation",
    name: "Italian Game: Two Knights Defense, Maróczy Variation",
    eco: "C58",
    variations: [

    ],
  },

  {
    id: "c58-italian-game-two-knights-defense-paoli-variation",
    name: "Italian Game: Two Knights Defense, Paoli Variation",
    eco: "C58",
    variations: [

    ],
  },

  {
    id: "c58-italian-game-two-knights-defense-polerio-defense",
    name: "Italian Game: Two Knights Defense, Polerio Defense",
    eco: "C58",
    variations: [

    ],
  },

  {
    id: "c58-italian-game-two-knights-defense-polerio-defense-bishop-check-line",
    name: "Italian Game: Two Knights Defense, Polerio Defense, Bishop Check Line",
    eco: "C58",
    variations: [

    ],
  },

  {
    id: "c58-italian-game-two-knights-defense-polerio-defense-bogoljubow-variation",
    name: "Italian Game: Two Knights Defense, Polerio Defense, Bogoljubow Variation",
    eco: "C58",
    variations: [

    ],
  },

  {
    id: "c58-italian-game-two-knights-defense-polerio-defense-kieseritzky-variation",
    name: "Italian Game: Two Knights Defense, Polerio Defense, Kieseritzky Variation",
    eco: "C58",
    variations: [

    ],
  },

  {
    id: "c58-italian-game-two-knights-defense-polerio-defense-yankovich-variation",
    name: "Italian Game: Two Knights Defense, Polerio Defense, Yankovich Variation",
    eco: "C58",
    variations: [

    ],
  },

  {
    id: "c59-italian-game-two-knights-defense-knorre-variation",
    name: "Italian Game: Two Knights Defense, Knorre Variation",
    eco: "C59",
    variations: [

    ],
  },

  {
    id: "c59-italian-game-two-knights-defense-polerio-defense-g-ring-variation",
    name: "Italian Game: Two Knights Defense, Polerio Defense, Göring Variation",
    eco: "C59",
    variations: [

    ],
  },

  {
    id: "c59-italian-game-two-knights-defense-polerio-defense-suhle-defense",
    name: "Italian Game: Two Knights Defense, Polerio Defense, Suhle Defense",
    eco: "C59",
    variations: [

    ],
  },

  {
    id: "c59-italian-game-two-knights-defense-steinitz-variation",
    name: "Italian Game: Two Knights Defense, Steinitz Variation",
    eco: "C59",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez",
    name: "Ruy Lopez",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-alapin-defense",
    name: "Ruy Lopez: Alapin Defense",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-alapin-defense-alapin-gambit",
    name: "Ruy Lopez: Alapin Defense, Alapin Gambit",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-brentano-gambit",
    name: "Ruy Lopez: Brentano Gambit",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-bulgarian-variation",
    name: "Ruy Lopez: Bulgarian Variation",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-cozio-defense",
    name: "Ruy Lopez: Cozio Defense",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-cozio-defense-paulsen-variation",
    name: "Ruy Lopez: Cozio Defense, Paulsen Variation",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-cozio-defense-tartakower-gambit",
    name: "Ruy Lopez: Cozio Defense, Tartakower Gambit",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-fianchetto-defense",
    name: "Ruy Lopez: Fianchetto Defense",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-fianchetto-defense-kevitz-gambit",
    name: "Ruy Lopez: Fianchetto Defense, Kevitz Gambit",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-lucena-variation",
    name: "Ruy Lopez: Lucena Variation",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-n-rnberg-variation",
    name: "Ruy Lopez: Nürnberg Variation",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-pollock-defense",
    name: "Ruy Lopez: Pollock Defense",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-retreat-variation",
    name: "Ruy Lopez: Retreat Variation",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-rotary-albany-gambit",
    name: "Ruy Lopez: Rotary-Albany Gambit",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-spanish-countergambit",
    name: "Ruy Lopez: Spanish Countergambit",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-spanish-countergambit-harding-countergambit-fricke-gambit",
    name: "Ruy Lopez: Spanish Countergambit, Harding Countergambit, Fricke Gambit",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-spanish-countergambit-harding-gambit",
    name: "Ruy Lopez: Spanish Countergambit, Harding Gambit",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c60-ruy-lopez-vinogradov-variation",
    name: "Ruy Lopez: Vinogradov Variation",
    eco: "C60",
    variations: [

    ],
  },

  {
    id: "c61-ruy-lopez-bird-variation",
    name: "Ruy Lopez: Bird Variation",
    eco: "C61",
    variations: [

    ],
  },

  {
    id: "c61-ruy-lopez-bird-variation-paulsen-variation",
    name: "Ruy Lopez: Bird Variation, Paulsen Variation",
    eco: "C61",
    variations: [

    ],
  },

  {
    id: "c62-ruy-lopez-steinitz-defense",
    name: "Ruy Lopez: Steinitz Defense",
    eco: "C62",
    variations: [

    ],
  },

  {
    id: "c62-ruy-lopez-steinitz-defense-center-gambit",
    name: "Ruy Lopez: Steinitz Defense, Center Gambit",
    eco: "C62",
    variations: [

    ],
  },

  {
    id: "c62-ruy-lopez-steinitz-defense-nimzowitsch-attack",
    name: "Ruy Lopez: Steinitz Defense, Nimzowitsch Attack",
    eco: "C62",
    variations: [

    ],
  },

  {
    id: "c62-ruy-lopez-steinitz-defense-semi-duras-variation",
    name: "Ruy Lopez: Steinitz Defense, Semi-Duras Variation",
    eco: "C62",
    variations: [

    ],
  },

  {
    id: "c63-ruy-lopez-schliemann-defense",
    name: "Ruy Lopez: Schliemann Defense",
    eco: "C63",
    variations: [

    ],
  },

  {
    id: "c63-ruy-lopez-schliemann-defense-classical-variation",
    name: "Ruy Lopez: Schliemann Defense, Classical Variation",
    eco: "C63",
    variations: [

    ],
  },

  {
    id: "c63-ruy-lopez-schliemann-defense-dyckhoff-variation",
    name: "Ruy Lopez: Schliemann Defense, Dyckhoff Variation",
    eco: "C63",
    variations: [

    ],
  },

  {
    id: "c63-ruy-lopez-schliemann-defense-exchange-variation",
    name: "Ruy Lopez: Schliemann Defense, Exchange Variation",
    eco: "C63",
    variations: [

    ],
  },

  {
    id: "c63-ruy-lopez-schliemann-defense-jaenisch-gambit-accepted",
    name: "Ruy Lopez: Schliemann Defense, Jaenisch Gambit Accepted",
    eco: "C63",
    variations: [

    ],
  },

  {
    id: "c63-ruy-lopez-schliemann-defense-kosti-defense",
    name: "Ruy Lopez: Schliemann Defense, Kostić Defense",
    eco: "C63",
    variations: [

    ],
  },

  {
    id: "c63-ruy-lopez-schliemann-defense-m-hring-variation",
    name: "Ruy Lopez: Schliemann Defense, Möhring Variation",
    eco: "C63",
    variations: [

    ],
  },

  {
    id: "c63-ruy-lopez-schliemann-defense-sch-nemann-attack",
    name: "Ruy Lopez: Schliemann Defense, Schönemann Attack",
    eco: "C63",
    variations: [

    ],
  },

  {
    id: "c63-ruy-lopez-schliemann-defense-tartakower-variation",
    name: "Ruy Lopez: Schliemann Defense, Tartakower Variation",
    eco: "C63",
    variations: [

    ],
  },

  {
    id: "c64-ruy-lopez-classical-defense-benelux-variation",
    name: "Ruy Lopez: Classical Defense, Benelux Variation",
    eco: "C64",
    variations: [

    ],
  },

  {
    id: "c64-ruy-lopez-classical-defense-boden-variation",
    name: "Ruy Lopez: Classical Defense, Boden Variation",
    eco: "C64",
    variations: [

    ],
  },

  {
    id: "c64-ruy-lopez-classical-defense-zaitsev-variation",
    name: "Ruy Lopez: Classical Defense, Zaitsev Variation",
    eco: "C64",
    variations: [

    ],
  },

  {
    id: "c64-ruy-lopez-classical-variation",
    name: "Ruy Lopez: Classical Variation",
    eco: "C64",
    variations: [

    ],
  },

  {
    id: "c64-ruy-lopez-classical-variation-central-variation",
    name: "Ruy Lopez: Classical Variation, Central Variation",
    eco: "C64",
    variations: [

    ],
  },

  {
    id: "c64-ruy-lopez-classical-variation-charousek-variation",
    name: "Ruy Lopez: Classical Variation, Charousek Variation",
    eco: "C64",
    variations: [

    ],
  },

  {
    id: "c64-ruy-lopez-classical-variation-cordel-gambit",
    name: "Ruy Lopez: Classical Variation, Cordel Gambit",
    eco: "C64",
    variations: [

    ],
  },

  {
    id: "c64-ruy-lopez-classical-variation-konikowski-gambit",
    name: "Ruy Lopez: Classical Variation, Konikowski Gambit",
    eco: "C64",
    variations: [

    ],
  },

  {
    id: "c64-ruy-lopez-classical-variation-modern-main-line",
    name: "Ruy Lopez: Classical Variation, Modern Main Line",
    eco: "C64",
    variations: [

    ],
  },

  {
    id: "c64-ruy-lopez-classical-variation-spanish-wing-gambit",
    name: "Ruy Lopez: Classical Variation, Spanish Wing Gambit",
    eco: "C64",
    variations: [

    ],
  },

  {
    id: "c65-ruy-lopez-berlin-defense",
    name: "Ruy Lopez: Berlin Defense",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "c65-ruy-lopez-berlin-defense-anti-berlin-variation",
    name: "Ruy Lopez: Berlin Defense, Anti-Berlin Variation",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "c65-ruy-lopez-berlin-defense-anti-berlin-variation-anderssen-variation",
    name: "Ruy Lopez: Berlin Defense, Anti-Berlin Variation, Anderssen Variation",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "c65-ruy-lopez-berlin-defense-anti-berlin-variation-duras-variation",
    name: "Ruy Lopez: Berlin Defense, Anti-Berlin Variation, Duras Variation",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "c65-ruy-lopez-berlin-defense-anti-berlin-variation-kaufmann-variation",
    name: "Ruy Lopez: Berlin Defense, Anti-Berlin Variation, Kaufmann Variation",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "c65-ruy-lopez-berlin-defense-anti-berlin-variation-mortimer-trap",
    name: "Ruy Lopez: Berlin Defense, Anti-Berlin Variation, Mortimer Trap",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "c65-ruy-lopez-berlin-defense-anti-berlin-variation-mortimer-variation",
    name: "Ruy Lopez: Berlin Defense, Anti-Berlin Variation, Mortimer Variation",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "c65-ruy-lopez-berlin-defense-beverwijk-variation",
    name: "Ruy Lopez: Berlin Defense, Beverwijk Variation",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "c65-ruy-lopez-berlin-defense-fishing-pole-variation",
    name: "Ruy Lopez: Berlin Defense, Fishing Pole Variation",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "c65-ruy-lopez-berlin-defense-nyholm-attack",
    name: "Ruy Lopez: Berlin Defense, Nyholm Attack",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "c65-ruy-lopez-classical-variation-zukertort-gambit",
    name: "Ruy Lopez: Classical Variation, Zukertort Gambit",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "c65-ruy-lopez-halloween-attack",
    name: "Ruy Lopez: Halloween Attack",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "ruy-lopez-ziegler",
    name: "Ruy Lopez: Ziegler Defense",
    eco: "C65",
    variations: [

    ],
  },

  {
    id: "c66-ruy-lopez-berlin-defense-closed-bernstein-variation",
    name: "Ruy Lopez: Berlin Defense, Closed Bernstein Variation",
    eco: "C66",
    variations: [

    ],
  },

  {
    id: "c66-ruy-lopez-berlin-defense-closed-showalter-variation",
    name: "Ruy Lopez: Berlin Defense, Closed Showalter Variation",
    eco: "C66",
    variations: [

    ],
  },

  {
    id: "c66-ruy-lopez-berlin-defense-closed-wolf-variation",
    name: "Ruy Lopez: Berlin Defense, Closed Wolf Variation",
    eco: "C66",
    variations: [

    ],
  },

  {
    id: "c66-ruy-lopez-berlin-defense-hedgehog-variation",
    name: "Ruy Lopez: Berlin Defense, Hedgehog Variation",
    eco: "C66",
    variations: [

    ],
  },

  {
    id: "c66-ruy-lopez-berlin-defense-improved-steinitz-defense",
    name: "Ruy Lopez: Berlin Defense, Improved Steinitz Defense",
    eco: "C66",
    variations: [

    ],
  },

  {
    id: "c66-ruy-lopez-berlin-defense-tarrasch-trap",
    name: "Ruy Lopez: Berlin Defense, Tarrasch Trap",
    eco: "C66",
    variations: [

    ],
  },

  {
    id: "c66-ruy-lopez-closed-berlin-defense-chigorin-variation",
    name: "Ruy Lopez: Closed Berlin Defense, Chigorin Variation",
    eco: "C66",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-berlin-wall",
    name: "Ruy Lopez: Berlin Defense, Berlin Wall",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-cordel-variation",
    name: "Ruy Lopez: Berlin Defense, Cordel Variation",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-minckwitz-variation",
    name: "Ruy Lopez: Berlin Defense, Minckwitz Variation",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-pillsbury-variation",
    name: "Ruy Lopez: Berlin Defense, Pillsbury Variation",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-rio-gambit-accepted",
    name: "Ruy Lopez: Berlin Defense, Rio Gambit Accepted",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-rio-de-janeiro-variation",
    name: "Ruy Lopez: Berlin Defense, Rio de Janeiro Variation",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-rosenthal-variation",
    name: "Ruy Lopez: Berlin Defense, Rosenthal Variation",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-trifunovic-variation",
    name: "Ruy Lopez: Berlin Defense, Trifunovic Variation",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-winawer-attack",
    name: "Ruy Lopez: Berlin Defense, Winawer Attack",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-zukertort-variation",
    name: "Ruy Lopez: Berlin Defense, Zukertort Variation",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-l-hermet-variation",
    name: "Ruy Lopez: Berlin Defense, l",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-l-hermet-variation-berlin-wall-defense",
    name: "Ruy Lopez: Berlin Defense, l",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-berlin-defense-l-hermet-variation-westerinen-line",
    name: "Ruy Lopez: Berlin Defense, l",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-open-berlin-defense-showalter-variation",
    name: "Ruy Lopez: Open Berlin Defense, Showalter Variation",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c67-ruy-lopez-open-berlin-defense-l-hermet-variation",
    name: "Ruy Lopez: Open Berlin Defense, l",
    eco: "C67",
    variations: [

    ],
  },

  {
    id: "c68-ruy-lopez-exchange-variation",
    name: "Ruy Lopez: Exchange Variation",
    eco: "C68",
    variations: [

    ],
  },

  {
    id: "c68-ruy-lopez-exchange-variation-alekhine-variation",
    name: "Ruy Lopez: Exchange Variation, Alekhine Variation",
    eco: "C68",
    variations: [

    ],
  },

  {
    id: "c68-ruy-lopez-exchange-variation-keres-variation",
    name: "Ruy Lopez: Exchange Variation, Keres Variation",
    eco: "C68",
    variations: [

    ],
  },

  {
    id: "c68-ruy-lopez-exchange-variation-lutikov-variation",
    name: "Ruy Lopez: Exchange Variation, Lutikov Variation",
    eco: "C68",
    variations: [

    ],
  },

  {
    id: "c68-ruy-lopez-exchange-variation-romanovsky-variation",
    name: "Ruy Lopez: Exchange Variation, Romanovsky Variation",
    eco: "C68",
    variations: [

    ],
  },

  {
    id: "c68-ruy-lopez-exchange-alekhine-variation",
    name: "Ruy Lopez: Exchange, Alekhine Variation",
    eco: "C68",
    variations: [

    ],
  },

  {
    id: "c69-ruy-lopez-exchange-variation-alapin-gambit",
    name: "Ruy Lopez: Exchange Variation, Alapin Gambit",
    eco: "C69",
    variations: [

    ],
  },

  {
    id: "c69-ruy-lopez-exchange-variation-bronstein-variation",
    name: "Ruy Lopez: Exchange Variation, Bronstein Variation",
    eco: "C69",
    variations: [

    ],
  },

  {
    id: "c69-ruy-lopez-exchange-variation-gligoric-variation",
    name: "Ruy Lopez: Exchange Variation, Gligoric Variation",
    eco: "C69",
    variations: [

    ],
  },

  {
    id: "c69-ruy-lopez-exchange-variation-king-s-bishop-variation",
    name: "Ruy Lopez: Exchange Variation, King",
    eco: "C69",
    variations: [

    ],
  },

  {
    id: "c69-ruy-lopez-exchange-variation-normal-variation",
    name: "Ruy Lopez: Exchange Variation, Normal Variation",
    eco: "C69",
    variations: [

    ],
  },

  {
    id: "c70-ruy-lopez-bird-s-defense-deferred",
    name: "Ruy Lopez: Bird",
    eco: "C70",
    variations: [

    ],
  },

  {
    id: "c70-ruy-lopez-morphy-defense",
    name: "Ruy Lopez: Morphy Defense",
    eco: "C70",
    variations: [

    ],
  },

  {
    id: "c70-ruy-lopez-morphy-defense-alapin-s-defense-deferred",
    name: "Ruy Lopez: Morphy Defense, Alapin",
    eco: "C70",
    variations: [

    ],
  },

  {
    id: "c70-ruy-lopez-morphy-defense-caro-variation",
    name: "Ruy Lopez: Morphy Defense, Caro Variation",
    eco: "C70",
    variations: [

    ],
  },

  {
    id: "c70-ruy-lopez-morphy-defense-classical-defense-deferred",
    name: "Ruy Lopez: Morphy Defense, Classical Defense Deferred",
    eco: "C70",
    variations: [

    ],
  },

  {
    id: "c70-ruy-lopez-morphy-defense-cozio-defense",
    name: "Ruy Lopez: Morphy Defense, Cozio Defense",
    eco: "C70",
    variations: [

    ],
  },

  {
    id: "c70-ruy-lopez-morphy-defense-fianchetto-defense-deferred",
    name: "Ruy Lopez: Morphy Defense, Fianchetto Defense Deferred",
    eco: "C70",
    variations: [

    ],
  },

  {
    id: "c70-ruy-lopez-morphy-defense-graz-variation",
    name: "Ruy Lopez: Morphy Defense, Graz Variation",
    eco: "C70",
    variations: [

    ],
  },

  {
    id: "c70-ruy-lopez-morphy-defense-norwegian-variation",
    name: "Ruy Lopez: Morphy Defense, Norwegian Variation",
    eco: "C70",
    variations: [

    ],
  },

  {
    id: "c70-ruy-lopez-morphy-defense-norwegian-variation-nightingale-gambit",
    name: "Ruy Lopez: Morphy Defense, Norwegian Variation, Nightingale Gambit",
    eco: "C70",
    variations: [

    ],
  },

  {
    id: "c70-ruy-lopez-morphy-defense-schliemann-defense-deferred",
    name: "Ruy Lopez: Morphy Defense, Schliemann Defense Deferred",
    eco: "C70",
    variations: [

    ],
  },

  {
    id: "c70-ruy-lopez-morphy-defense-schliemann-defense-deferred-jaenisch-gambit-deferred",
    name: "Ruy Lopez: Morphy Defense, Schliemann Defense Deferred, Jaenisch Gambit Deferred",
    eco: "C70",
    variations: [

    ],
  },

  {
    id: "c71-ruy-lopez-morphy-defense-modern-steinitz-defense",
    name: "Ruy Lopez: Morphy Defense, Modern Steinitz Defense",
    eco: "C71",
    variations: [

    ],
  },

  {
    id: "c71-ruy-lopez-noah-s-ark-trap",
    name: "Ruy Lopez: Noah",
    eco: "C71",
    variations: [

    ],
  },

  {
    id: "c72-ruy-lopez-closed-kecskemet-variation",
    name: "Ruy Lopez: Closed, Kecskemet Variation",
    eco: "C72",
    variations: [

    ],
  },

  {
    id: "c72-ruy-lopez-morphy-defense-modern-steinitz-defense",
    name: "Ruy Lopez: Morphy Defense, Modern Steinitz Defense",
    eco: "C72",
    variations: [

    ],
  },

  {
    id: "c73-ruy-lopez-morphy-defense-modern-steinitz-defense",
    name: "Ruy Lopez: Morphy Defense, Modern Steinitz Defense",
    eco: "C73",
    variations: [

    ],
  },

  {
    id: "c74-ruy-lopez-morphy-defense-modern-steinitz-defense",
    name: "Ruy Lopez: Morphy Defense, Modern Steinitz Defense",
    eco: "C74",
    variations: [

    ],
  },

  {
    id: "c74-ruy-lopez-morphy-defense-modern-steinitz-defense-siesta-variation",
    name: "Ruy Lopez: Morphy Defense, Modern Steinitz Defense, Siesta Variation",
    eco: "C74",
    variations: [

    ],
  },

  {
    id: "c75-ruy-lopez-morphy-defense-modern-steinitz-defense",
    name: "Ruy Lopez: Morphy Defense, Modern Steinitz Defense",
    eco: "C75",
    variations: [

    ],
  },

  {
    id: "c76-ruy-lopez-morphy-defense-modern-steinitz-defense-fianchetto-variation",
    name: "Ruy Lopez: Morphy Defense, Modern Steinitz Defense, Fianchetto Variation",
    eco: "C76",
    variations: [

    ],
  },

  {
    id: "c77-ruy-lopez-morphy-defense-anderssen-variation",
    name: "Ruy Lopez: Morphy Defense, Anderssen Variation",
    eco: "C77",
    variations: [

    ],
  },

  {
    id: "c77-ruy-lopez-morphy-defense-bayreuth-variation",
    name: "Ruy Lopez: Morphy Defense, Bayreuth Variation",
    eco: "C77",
    variations: [

    ],
  },

  {
    id: "c77-ruy-lopez-morphy-defense-duras-variation",
    name: "Ruy Lopez: Morphy Defense, Duras Variation",
    eco: "C77",
    variations: [

    ],
  },

  {
    id: "c77-ruy-lopez-morphy-defense-jaffe-gambit",
    name: "Ruy Lopez: Morphy Defense, Jaffe Gambit",
    eco: "C77",
    variations: [

    ],
  },

  {
    id: "c77-ruy-lopez-morphy-defense-mackenzie-variation",
    name: "Ruy Lopez: Morphy Defense, Mackenzie Variation",
    eco: "C77",
    variations: [

    ],
  },

  {
    id: "c77-ruy-lopez-morphy-defense-tarrasch-variation",
    name: "Ruy Lopez: Morphy Defense, Tarrasch Variation",
    eco: "C77",
    variations: [

    ],
  },

  {
    id: "c77-ruy-lopez-morphy-defense-wormald-attack",
    name: "Ruy Lopez: Morphy Defense, Wormald Attack",
    eco: "C77",
    variations: [

    ],
  },

  {
    id: "c77-ruy-lopez-wormald-attack-gr-nfeld-variation",
    name: "Ruy Lopez: Wormald Attack, Grünfeld Variation",
    eco: "C77",
    variations: [

    ],
  },

  {
    id: "ruy-lopez-archangel",
    name: "Ruy Lopez: Archangel Defense",
    eco: "C78",
    variations: [

    ],
  },

  {
    id: "c78-ruy-lopez-brix-variation",
    name: "Ruy Lopez: Brix Variation",
    eco: "C78",
    variations: [

    ],
  },

  {
    id: "c78-ruy-lopez-central-countergambit",
    name: "Ruy Lopez: Central Countergambit",
    eco: "C78",
    variations: [

    ],
  },

  {
    id: "c78-ruy-lopez-morphy-defense",
    name: "Ruy Lopez: Morphy Defense",
    eco: "C78",
    variations: [

    ],
  },

  {
    id: "c78-ruy-lopez-morphy-defense-arkhangelsk-variation",
    name: "Ruy Lopez: Morphy Defense, Arkhangelsk Variation",
    eco: "C78",
    variations: [

    ],
  },

  {
    id: "c78-ruy-lopez-morphy-defense-m-ller-variation",
    name: "Ruy Lopez: Morphy Defense, Møller Variation",
    eco: "C78",
    variations: [

    ],
  },

  {
    id: "c78-ruy-lopez-morphy-defense-neo-arkhangelsk-variation",
    name: "Ruy Lopez: Morphy Defense, Neo-Arkhangelsk Variation",
    eco: "C78",
    variations: [

    ],
  },

  {
    id: "c78-ruy-lopez-morphy-defense-wing-attack",
    name: "Ruy Lopez: Morphy Defense, Wing Attack",
    eco: "C78",
    variations: [

    ],
  },

  {
    id: "c78-ruy-lopez-rabinovich-variation",
    name: "Ruy Lopez: Rabinovich Variation",
    eco: "C78",
    variations: [

    ],
  },

  {
    id: "c79-ruy-lopez-morphy-defense-steinitz-deferred",
    name: "Ruy Lopez: Morphy Defense, Steinitz Deferred",
    eco: "C79",
    variations: [

    ],
  },

  {
    id: "c79-ruy-lopez-steinitz-defense-deferred-boleslavsky-variation",
    name: "Ruy Lopez: Steinitz Defense Deferred, Boleslavsky Variation",
    eco: "C79",
    variations: [

    ],
  },

  {
    id: "c79-ruy-lopez-steinitz-defense-deferred-lipnitsky-variation",
    name: "Ruy Lopez: Steinitz Defense Deferred, Lipnitsky Variation",
    eco: "C79",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-morphy-defense-tartakower-variation",
    name: "Ruy Lopez: Morphy Defense, Tartakower Variation",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open",
    name: "Ruy Lopez: Open",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-berger-variation",
    name: "Ruy Lopez: Open, Berger Variation",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-bernstein-variation",
    name: "Ruy Lopez: Open, Bernstein Variation",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-bernstein-variation-luther-line",
    name: "Ruy Lopez: Open, Bernstein Variation, Luther Line",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-friess-attack",
    name: "Ruy Lopez: Open, Friess Attack",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-harksen-gambit",
    name: "Ruy Lopez: Open, Harksen Gambit",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-karpov-gambit",
    name: "Ruy Lopez: Open, Karpov Gambit",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-knorre-variation",
    name: "Ruy Lopez: Open, Knorre Variation",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-main-line",
    name: "Ruy Lopez: Open, Main Line",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-richter-variation",
    name: "Ruy Lopez: Open, Richter Variation",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-riga-variation",
    name: "Ruy Lopez: Open, Riga Variation",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-schlechter-defense",
    name: "Ruy Lopez: Open, Schlechter Defense",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-skipworth-gambit",
    name: "Ruy Lopez: Open, Skipworth Gambit",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c80-ruy-lopez-open-zukertort-variation",
    name: "Ruy Lopez: Open, Zukertort Variation",
    eco: "C80",
    variations: [

    ],
  },

  {
    id: "c81-ruy-lopez-open-howell-attack",
    name: "Ruy Lopez: Open, Howell Attack",
    eco: "C81",
    variations: [

    ],
  },

  {
    id: "c81-ruy-lopez-open-howell-attack-ekstrom-variation",
    name: "Ruy Lopez: Open, Howell Attack, Ekstrom Variation",
    eco: "C81",
    variations: [

    ],
  },

  {
    id: "c82-ruy-lopez-open",
    name: "Ruy Lopez: Open",
    eco: "C82",
    variations: [

    ],
  },

  {
    id: "c82-ruy-lopez-open-berlin-variation",
    name: "Ruy Lopez: Open, Berlin Variation",
    eco: "C82",
    variations: [

    ],
  },

  {
    id: "c82-ruy-lopez-open-dilworth-variation",
    name: "Ruy Lopez: Open, Dilworth Variation",
    eco: "C82",
    variations: [

    ],
  },

  {
    id: "c82-ruy-lopez-open-italian-variation",
    name: "Ruy Lopez: Open, Italian Variation",
    eco: "C82",
    variations: [

    ],
  },

  {
    id: "c82-ruy-lopez-open-motzko-attack",
    name: "Ruy Lopez: Open, Motzko Attack",
    eco: "C82",
    variations: [

    ],
  },

  {
    id: "c82-ruy-lopez-open-motzko-attack-nenarokov-variation",
    name: "Ruy Lopez: Open, Motzko Attack, Nenarokov Variation",
    eco: "C82",
    variations: [

    ],
  },

  {
    id: "c82-ruy-lopez-open-st-petersburg-variation",
    name: "Ruy Lopez: Open, St. Petersburg Variation",
    eco: "C82",
    variations: [

    ],
  },

  {
    id: "c83-ruy-lopez-open-breslau-variation",
    name: "Ruy Lopez: Open, Breslau Variation",
    eco: "C83",
    variations: [

    ],
  },

  {
    id: "c83-ruy-lopez-open-classical-defense",
    name: "Ruy Lopez: Open, Classical Defense",
    eco: "C83",
    variations: [

    ],
  },

  {
    id: "c83-ruy-lopez-open-classical-defense-main-line",
    name: "Ruy Lopez: Open, Classical Defense, Main Line",
    eco: "C83",
    variations: [

    ],
  },

  {
    id: "c83-ruy-lopez-open-malkin-variation",
    name: "Ruy Lopez: Open, Malkin Variation",
    eco: "C83",
    variations: [

    ],
  },

  {
    id: "c83-ruy-lopez-open-tarrasch-trap",
    name: "Ruy Lopez: Open, Tarrasch Trap",
    eco: "C83",
    variations: [

    ],
  },

  {
    id: "c84-ruy-lopez-closed",
    name: "Ruy Lopez: Closed",
    eco: "C84",
    variations: [

    ],
  },

  {
    id: "c84-ruy-lopez-closed-basque-gambit",
    name: "Ruy Lopez: Closed, Basque Gambit",
    eco: "C84",
    variations: [

    ],
  },

  {
    id: "c84-ruy-lopez-closed-center-attack",
    name: "Ruy Lopez: Closed, Center Attack",
    eco: "C84",
    variations: [

    ],
  },

  {
    id: "c84-ruy-lopez-closed-center-attack-basque-gambit",
    name: "Ruy Lopez: Closed, Center Attack, Basque Gambit",
    eco: "C84",
    variations: [

    ],
  },

  {
    id: "c84-ruy-lopez-closed-martinez-variation",
    name: "Ruy Lopez: Closed, Martinez Variation",
    eco: "C84",
    variations: [

    ],
  },

  {
    id: "c84-ruy-lopez-closed-morphy-attack",
    name: "Ruy Lopez: Closed, Morphy Attack",
    eco: "C84",
    variations: [

    ],
  },

  {
    id: "c85-ruy-lopez-closed-delayed-exchange",
    name: "Ruy Lopez: Closed, Delayed Exchange",
    eco: "C85",
    variations: [

    ],
  },

  {
    id: "c86-ruy-lopez-closed-worrall-attack",
    name: "Ruy Lopez: Closed, Worrall Attack",
    eco: "C86",
    variations: [

    ],
  },

  {
    id: "c86-ruy-lopez-closed-worrall-attack-castling-line",
    name: "Ruy Lopez: Closed, Worrall Attack, Castling Line",
    eco: "C86",
    variations: [

    ],
  },

  {
    id: "c86-ruy-lopez-closed-worrall-attack-delayed-castling-line",
    name: "Ruy Lopez: Closed, Worrall Attack, Delayed Castling Line",
    eco: "C86",
    variations: [

    ],
  },

  {
    id: "c87-ruy-lopez-closed-averbakh-variation",
    name: "Ruy Lopez: Closed, Averbakh Variation",
    eco: "C87",
    variations: [

    ],
  },

  {
    id: "c88-ruy-lopez-closed",
    name: "Ruy Lopez: Closed",
    eco: "C88",
    variations: [

    ],
  },

  {
    id: "c88-ruy-lopez-closed-alekhine-gambit",
    name: "Ruy Lopez: Closed, Alekhine Gambit",
    eco: "C88",
    variations: [

    ],
  },

  {
    id: "c88-ruy-lopez-closed-anti-marshall",
    name: "Ruy Lopez: Closed, Anti-Marshall",
    eco: "C88",
    variations: [

    ],
  },

  {
    id: "c88-ruy-lopez-closed-balla-variation",
    name: "Ruy Lopez: Closed, Balla Variation",
    eco: "C88",
    variations: [

    ],
  },

  {
    id: "c88-ruy-lopez-closed-leonhardt-variation",
    name: "Ruy Lopez: Closed, Leonhardt Variation",
    eco: "C88",
    variations: [

    ],
  },

  {
    id: "c88-ruy-lopez-closed-rosen-attack",
    name: "Ruy Lopez: Closed, Rosen Attack",
    eco: "C88",
    variations: [

    ],
  },

  {
    id: "c88-ruy-lopez-closed-trajkovic-counterattack",
    name: "Ruy Lopez: Closed, Trajkovic Counterattack",
    eco: "C88",
    variations: [

    ],
  },

  {
    id: "c88-ruy-lopez-noah-s-ark-trap",
    name: "Ruy Lopez: Noah",
    eco: "C88",
    variations: [

    ],
  },

  {
    id: "c89-ruy-lopez-marshall-attack",
    name: "Ruy Lopez: Marshall Attack",
    eco: "C89",
    variations: [

    ],
  },

  {
    id: "c89-ruy-lopez-marshall-attack-main-line",
    name: "Ruy Lopez: Marshall Attack, Main Line",
    eco: "C89",
    variations: [

    ],
  },

  {
    id: "c89-ruy-lopez-marshall-attack-main-line-spassky-variation",
    name: "Ruy Lopez: Marshall Attack, Main Line, Spassky Variation",
    eco: "C89",
    variations: [

    ],
  },

  {
    id: "c89-ruy-lopez-marshall-attack-modern-main-line",
    name: "Ruy Lopez: Marshall Attack, Modern Main Line",
    eco: "C89",
    variations: [

    ],
  },

  {
    id: "c89-ruy-lopez-marshall-attack-modern-variation",
    name: "Ruy Lopez: Marshall Attack, Modern Variation",
    eco: "C89",
    variations: [

    ],
  },

  {
    id: "c89-ruy-lopez-marshall-attack-original-marshall-attack",
    name: "Ruy Lopez: Marshall Attack, Original Marshall Attack",
    eco: "C89",
    variations: [

    ],
  },

  {
    id: "c89-ruy-lopez-marshall-attack-re3-variation",
    name: "Ruy Lopez: Marshall Attack, Re3 Variation",
    eco: "C89",
    variations: [

    ],
  },

  {
    id: "c89-ruy-lopez-marshall-attack-steiner-variation",
    name: "Ruy Lopez: Marshall Attack, Steiner Variation",
    eco: "C89",
    variations: [

    ],
  },

  {
    id: "c90-ruy-lopez-closed",
    name: "Ruy Lopez: Closed",
    eco: "C90",
    variations: [

    ],
  },

  {
    id: "c90-ruy-lopez-closed-lutikov-variation",
    name: "Ruy Lopez: Closed, Lutikov Variation",
    eco: "C90",
    variations: [

    ],
  },

  {
    id: "c90-ruy-lopez-closed-pilnik-variation",
    name: "Ruy Lopez: Closed, Pilnik Variation",
    eco: "C90",
    variations: [

    ],
  },

  {
    id: "c90-ruy-lopez-closed-suetin-variation",
    name: "Ruy Lopez: Closed, Suetin Variation",
    eco: "C90",
    variations: [

    ],
  },

  {
    id: "c91-ruy-lopez-closed-bogoljubow-variation",
    name: "Ruy Lopez: Closed, Bogoljubow Variation",
    eco: "C91",
    variations: [

    ],
  },

  {
    id: "c91-ruy-lopez-closed-yates-variation",
    name: "Ruy Lopez: Closed, Yates Variation",
    eco: "C91",
    variations: [

    ],
  },

  {
    id: "c91-ruy-lopez-closed-yates-variation-short-attack",
    name: "Ruy Lopez: Closed, Yates Variation, Short Attack",
    eco: "C91",
    variations: [

    ],
  },

  {
    id: "c92-ruy-lopez-closed",
    name: "Ruy Lopez: Closed",
    eco: "C92",
    variations: [

    ],
  },

  {
    id: "c92-ruy-lopez-closed-flohr-system",
    name: "Ruy Lopez: Closed, Flohr System",
    eco: "C92",
    variations: [

    ],
  },

  {
    id: "c92-ruy-lopez-closed-karpov-variation",
    name: "Ruy Lopez: Closed, Karpov Variation",
    eco: "C92",
    variations: [

    ],
  },

  {
    id: "c92-ruy-lopez-closed-kholmov-variation",
    name: "Ruy Lopez: Closed, Kholmov Variation",
    eco: "C92",
    variations: [

    ],
  },

  {
    id: "c92-ruy-lopez-closed-smyslov-breyer-zaitsev-hybrid",
    name: "Ruy Lopez: Closed, Smyslov-Breyer-Zaitsev Hybrid",
    eco: "C92",
    variations: [

    ],
  },

  {
    id: "c92-ruy-lopez-closed-zaitsev-system",
    name: "Ruy Lopez: Closed, Zaitsev System",
    eco: "C92",
    variations: [

    ],
  },

  {
    id: "c93-ruy-lopez-closed-smyslov-defense",
    name: "Ruy Lopez: Closed, Smyslov Defense",
    eco: "C93",
    variations: [

    ],
  },

  {
    id: "c94-ruy-lopez-closed-breyer-defense",
    name: "Ruy Lopez: Closed, Breyer Defense",
    eco: "C94",
    variations: [

    ],
  },

  {
    id: "c94-ruy-lopez-closed-breyer-defense-quiet-variation",
    name: "Ruy Lopez: Closed, Breyer Defense, Quiet Variation",
    eco: "C94",
    variations: [

    ],
  },

  {
    id: "c95-ruy-lopez-closed-breyer",
    name: "Ruy Lopez: Closed, Breyer",
    eco: "C95",
    variations: [

    ],
  },

  {
    id: "c95-ruy-lopez-closed-breyer-defense",
    name: "Ruy Lopez: Closed, Breyer Defense",
    eco: "C95",
    variations: [

    ],
  },

  {
    id: "c95-ruy-lopez-closed-breyer-defense-zaitsev-hybrid",
    name: "Ruy Lopez: Closed, Breyer Defense, Zaitsev Hybrid",
    eco: "C95",
    variations: [

    ],
  },

  {
    id: "c96-ruy-lopez-closed-borisenko-variation",
    name: "Ruy Lopez: Closed, Borisenko Variation",
    eco: "C96",
    variations: [

    ],
  },

  {
    id: "c96-ruy-lopez-closed-chigorin-defense",
    name: "Ruy Lopez: Closed, Chigorin Defense",
    eco: "C96",
    variations: [

    ],
  },

  {
    id: "c96-ruy-lopez-closed-chigorin-defense-gajewski-gambit",
    name: "Ruy Lopez: Closed, Chigorin Defense, Gajewski Gambit",
    eco: "C96",
    variations: [

    ],
  },

  {
    id: "c96-ruy-lopez-closed-keres-defense",
    name: "Ruy Lopez: Closed, Keres Defense",
    eco: "C96",
    variations: [

    ],
  },

  {
    id: "c96-ruy-lopez-closed-rossolimo-defense",
    name: "Ruy Lopez: Closed, Rossolimo Defense",
    eco: "C96",
    variations: [

    ],
  },

  {
    id: "c97-ruy-lopez-closed-chigorin-defense",
    name: "Ruy Lopez: Closed, Chigorin Defense",
    eco: "C97",
    variations: [

    ],
  },

  {
    id: "c97-ruy-lopez-closed-chigorin-yugoslav-system",
    name: "Ruy Lopez: Closed, Chigorin, Yugoslav System",
    eco: "C97",
    variations: [

    ],
  },

  {
    id: "ruy-lopez-chigorin",
    name: "Ruy Lopez: Chigorin Defense",
    eco: "C98",
    variations: [

    ],
  },

  {
    id: "c98-ruy-lopez-closed-chigorin-defense",
    name: "Ruy Lopez: Closed, Chigorin Defense",
    eco: "C98",
    variations: [

    ],
  },

  {
    id: "c99-ruy-lopez-closed-chigorin-defense-panov-system",
    name: "Ruy Lopez: Closed, Chigorin Defense, Panov System",
    eco: "C99",
    variations: [

    ],
  },

  {
    id: "d00-amazon-attack",
    name: "Amazon Attack",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit",
    name: "Blackmar-Diemer Gambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted",
    name: "Blackmar-Diemer Gambit Accepted",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-bogoljubow-defense",
    name: "Blackmar-Diemer Gambit Accepted: Bogoljubow Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-bogoljubow-defense-kloss-attack",
    name: "Blackmar-Diemer Gambit Accepted: Bogoljubow Defense, Kloss Attack",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-bogoljubow-defense-mad-dog-attack",
    name: "Blackmar-Diemer Gambit Accepted: Bogoljubow Defense, Mad Dog Attack",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-bogoljubow-defense-nimzowitsch-attack",
    name: "Blackmar-Diemer Gambit Accepted: Bogoljubow Defense, Nimzowitsch Attack",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-bogoljubow-defense-studier-attack",
    name: "Blackmar-Diemer Gambit Accepted: Bogoljubow Defense, Studier Attack",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-euwe-defense",
    name: "Blackmar-Diemer Gambit Accepted: Euwe Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-euwe-defense-duthilleul-gambit",
    name: "Blackmar-Diemer Gambit Accepted: Euwe Defense, Duthilleul Gambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-euwe-defense-zilbermints-gambit",
    name: "Blackmar-Diemer Gambit Accepted: Euwe Defense, Zilbermints Gambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-gunderam-defense",
    name: "Blackmar-Diemer Gambit Accepted: Gunderam Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-gunderam-defense-stader-variation",
    name: "Blackmar-Diemer Gambit Accepted: Gunderam Defense, Stader Variation",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-holwell-defense",
    name: "Blackmar-Diemer Gambit Accepted: Holwell Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-kaulich-defense",
    name: "Blackmar-Diemer Gambit Accepted: Kaulich Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-pietrowsky-defense",
    name: "Blackmar-Diemer Gambit Accepted: Pietrowsky Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-ritter-defense",
    name: "Blackmar-Diemer Gambit Accepted: Ritter Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-ryder-gambit",
    name: "Blackmar-Diemer Gambit Accepted: Ryder Gambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-schlutter-defense",
    name: "Blackmar-Diemer Gambit Accepted: Schlutter Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-teichmann-defense",
    name: "Blackmar-Diemer Gambit Accepted: Teichmann Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-teichmann-defense-ciesielski-variation",
    name: "Blackmar-Diemer Gambit Accepted: Teichmann Defense, Ciesielski Variation",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-teichmann-defense-classical-variation",
    name: "Blackmar-Diemer Gambit Accepted: Teichmann Defense, Classical Variation",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-teichmann-defense-seidel-hall-attack",
    name: "Blackmar-Diemer Gambit Accepted: Teichmann Defense, Seidel-Hall Attack",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-accepted-ziegler-defense",
    name: "Blackmar-Diemer Gambit Accepted: Ziegler Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-declined-brombacher-countergambit",
    name: "Blackmar-Diemer Gambit Declined: Brombacher Countergambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-declined-elbert-countergambit",
    name: "Blackmar-Diemer Gambit Declined: Elbert Countergambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-declined-gedult-defense",
    name: "Blackmar-Diemer Gambit Declined: Gedult Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-declined-lamb-defense",
    name: "Blackmar-Diemer Gambit Declined: Lamb Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-declined-langeheinicke-defense",
    name: "Blackmar-Diemer Gambit Declined: Langeheinicke Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-declined-o-kelly-defense",
    name: "Blackmar-Diemer Gambit Declined: O",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-declined-vienna-defense",
    name: "Blackmar-Diemer Gambit Declined: Vienna Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-declined-weinsbach-defense",
    name: "Blackmar-Diemer Gambit Declined: Weinsbach Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-declined-weinsbach-defense-pfrang-gambit",
    name: "Blackmar-Diemer Gambit Declined: Weinsbach Defense, Pfrang Gambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-blackmar-gambit",
    name: "Blackmar-Diemer Gambit: Blackmar Gambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-diemer-rosenberg-attack",
    name: "Blackmar-Diemer Gambit: Diemer-Rosenberg Attack",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-fritz-attack",
    name: "Blackmar-Diemer Gambit: Fritz Attack",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-lemberger-countergambit",
    name: "Blackmar-Diemer Gambit: Lemberger Countergambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-lemberger-countergambit-endgame-variation",
    name: "Blackmar-Diemer Gambit: Lemberger Countergambit, Endgame Variation",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-lemberger-countergambit-lange-gambit",
    name: "Blackmar-Diemer Gambit: Lemberger Countergambit, Lange Gambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-lemberger-countergambit-rasmussen-attack",
    name: "Blackmar-Diemer Gambit: Lemberger Countergambit, Rasmussen Attack",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-lemberger-countergambit-sneiders-attack",
    name: "Blackmar-Diemer Gambit: Lemberger Countergambit, Sneiders Attack",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-lemberger-countergambit-soller-attack",
    name: "Blackmar-Diemer Gambit: Lemberger Countergambit, Soller Attack",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-netherlands-variation",
    name: "Blackmar-Diemer Gambit: Netherlands Variation",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-rasa-studier-gambit",
    name: "Blackmar-Diemer Gambit: Rasa-Studier Gambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-reversed-albin-countergambit",
    name: "Blackmar-Diemer Gambit: Reversed Albin Countergambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-zeller-defense",
    name: "Blackmar-Diemer Gambit: Zeller Defense",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-zeller-defense-soller-attack",
    name: "Blackmar-Diemer Gambit: Zeller Defense, Soller Attack",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-von-popiel-gambit",
    name: "Blackmar-Diemer Gambit: von Popiel Gambit",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-blackmar-diemer-gambit-von-popiel-gambit-zilbermints-variation",
    name: "Blackmar-Diemer Gambit: von Popiel Gambit, Zilbermints Variation",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-accelerated-london-system",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-accelerated-london-system-steinitz-countergambit",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-accelerated-london-system-steinitz-countergambit-accepted",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-accelerated-london-system-steinitz-countergambit-morris-countergambit",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-accelerated-london-system-steinitz-countergambit-morris-countergambit-accepted",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-chigorin-variation",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-chigorin-variation-alburt-defense",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-chigorin-variation-anti-veresov",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-chigorin-variation-fianchetto-defense",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-chigorin-variation-irish-gambit",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-chigorin-variation-shaviliuk-gambit",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-chigorin-variation-shropshire-defense",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-h-bsch-gambit",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-levitsky-attack",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-levitsky-attack-welling-variation",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-mason-attack",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-stonewall-attack",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d00-queen-s-pawn-game-zurich-gambit",
    name: "Queen",
    eco: "D00",
    variations: [

    ],
  },

  {
    id: "d01-rapport-jobava-system",
    name: "Rapport-Jobava System",
    eco: "D01",
    variations: [

    ],
  },

  {
    id: "d01-rapport-jobava-system-with-e6",
    name: "Rapport-Jobava System, with e6",
    eco: "D01",
    variations: [

    ],
  },

  {
    id: "d01-richter-veresov-attack",
    name: "Richter-Veresov Attack",
    eco: "D01",
    variations: [

    ],
  },

  {
    id: "d01-richter-veresov-attack-boyce-defense",
    name: "Richter-Veresov Attack: Boyce Defense",
    eco: "D01",
    variations: [

    ],
  },

  {
    id: "d01-richter-veresov-attack-malich-gambit",
    name: "Richter-Veresov Attack: Malich Gambit",
    eco: "D01",
    variations: [

    ],
  },

  {
    id: "d01-richter-veresov-attack-richter-variation",
    name: "Richter-Veresov Attack: Richter Variation",
    eco: "D01",
    variations: [

    ],
  },

  {
    id: "d01-richter-veresov-attack-two-knights-system",
    name: "Richter-Veresov Attack: Two Knights System",
    eco: "D01",
    variations: [

    ],
  },

  {
    id: "d01-richter-veresov-attack-two-knights-system-gr-nfeld-defense",
    name: "Richter-Veresov Attack: Two Knights System, Grünfeld Defense",
    eco: "D01",
    variations: [

    ],
  },

  {
    id: "d01-richter-veresov-attack-veresov-variation",
    name: "Richter-Veresov Attack: Veresov Variation",
    eco: "D01",
    variations: [

    ],
  },

  {
    id: "d02-london-system-poisoned-pawn-variation",
    name: "London System: Poisoned Pawn Variation",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-gambit-declined-baltic-defense-pseudo-slav",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-pawn-game-anti-torre",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-pawn-game-chandler-gambit",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-pawn-game-chigorin-variation",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-pawn-game-krause-variation",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-pawn-game-levitsky-attack-euwe-variation-modern-line",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-pawn-game-london-system",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-pawn-game-london-system-pterodactyl-variation",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-pawn-game-london-system-with-e6",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-pawn-game-symmetrical-variation",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-pawn-game-symmetrical-variation-pseudo-catalan",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-pawn-game-zilbermints-countergambit",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d02-queen-s-pawn-game-zukertort-variation",
    name: "Queen",
    eco: "D02",
    variations: [

    ],
  },

  {
    id: "d03-queen-s-pawn-game-torre-attack",
    name: "Queen",
    eco: "D03",
    variations: [

    ],
  },

  {
    id: "d03-queen-s-pawn-game-torre-attack-gossip-variation",
    name: "Queen",
    eco: "D03",
    variations: [

    ],
  },

  {
    id: "d03-queen-s-pawn-game-torre-attack-gr-nfeld-variation",
    name: "Queen",
    eco: "D03",
    variations: [

    ],
  },

  {
    id: "d04-queen-s-pawn-game-colle-system",
    name: "Queen",
    eco: "D04",
    variations: [

    ],
  },

  {
    id: "d04-queen-s-pawn-game-colle-system-anti-colle",
    name: "Queen",
    eco: "D04",
    variations: [

    ],
  },

  {
    id: "d04-queen-s-pawn-game-colle-system-gr-nfeld-formation",
    name: "Queen",
    eco: "D04",
    variations: [

    ],
  },

  {
    id: "d05-queen-s-pawn-game-colle-system",
    name: "Queen",
    eco: "D05",
    variations: [

    ],
  },

  {
    id: "d05-queen-s-pawn-game-colle-system-traditional-colle",
    name: "Queen",
    eco: "D05",
    variations: [

    ],
  },

  {
    id: "d05-queen-s-pawn-game-zukertort-variation",
    name: "Queen",
    eco: "D05",
    variations: [

    ],
  },

  {
    id: "d05-rubinstein-opening",
    name: "Rubinstein Opening",
    eco: "D05",
    variations: [

    ],
  },

  {
    id: "d05-rubinstein-opening-bogoljubow-defense",
    name: "Rubinstein Opening: Bogoljubow Defense",
    eco: "D05",
    variations: [

    ],
  },

  {
    id: "d05-rubinstein-opening-classical-defense",
    name: "Rubinstein Opening: Classical Defense",
    eco: "D05",
    variations: [

    ],
  },

  {
    id: "d05-rubinstein-opening-semi-slav-defense",
    name: "Rubinstein Opening: Semi-Slav Defense",
    eco: "D05",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit-declined-austrian-attack-salvio-countergambit",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit-declined-austrian-defense",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit-declined-austrian-defense-gusev-countergambit",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit-declined-austrian-defense-haberditz-variation",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit-declined-baltic-defense",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit-declined-baltic-defense-argentinian-gambit",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit-declined-baltic-defense-pseudo-chigorin",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit-declined-baltic-defense-queen-attack",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit-declined-baltic-defense-queen-attack-deferred",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit-declined-marshall-defense",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit-declined-marshall-defense-tan-gambit",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d06-queen-s-gambit-declined-zilbermints-gambit",
    name: "Queen",
    eco: "D06",
    variations: [

    ],
  },

  {
    id: "d07-queen-s-gambit-declined-chigorin-defense",
    name: "Queen",
    eco: "D07",
    variations: [

    ],
  },

  {
    id: "d07-queen-s-gambit-declined-chigorin-defense-exchange-variation",
    name: "Queen",
    eco: "D07",
    variations: [

    ],
  },

  {
    id: "d07-queen-s-gambit-declined-chigorin-defense-exchange-variation-costa-s-line",
    name: "Queen",
    eco: "D07",
    variations: [

    ],
  },

  {
    id: "d07-queen-s-gambit-declined-chigorin-defense-janowski-variation",
    name: "Queen",
    eco: "D07",
    variations: [

    ],
  },

  {
    id: "d07-queen-s-gambit-declined-chigorin-defense-lazard-gambit",
    name: "Queen",
    eco: "D07",
    variations: [

    ],
  },

  {
    id: "d07-queen-s-gambit-declined-chigorin-defense-main-line",
    name: "Queen",
    eco: "D07",
    variations: [

    ],
  },

  {
    id: "d07-queen-s-gambit-declined-chigorin-defense-main-line-alekhine-variation",
    name: "Queen",
    eco: "D07",
    variations: [

    ],
  },

  {
    id: "d07-queen-s-gambit-declined-chigorin-defense-modern-gambit",
    name: "Queen",
    eco: "D07",
    variations: [

    ],
  },

  {
    id: "d07-queen-s-gambit-declined-chigorin-defense-tartakower-gambit",
    name: "Queen",
    eco: "D07",
    variations: [

    ],
  },

  {
    id: "albin-countergambit",
    name: "Albin Countergambit",
    eco: "D08",
    variations: [

    ],
  },

  {
    id: "d08-queen-s-gambit-declined-albin-countergambit",
    name: "Queen",
    eco: "D08",
    variations: [

    ],
  },

  {
    id: "d08-queen-s-gambit-declined-albin-countergambit-balogh-variation",
    name: "Queen",
    eco: "D08",
    variations: [

    ],
  },

  {
    id: "d08-queen-s-gambit-declined-albin-countergambit-janowski-variation",
    name: "Queen",
    eco: "D08",
    variations: [

    ],
  },

  {
    id: "d08-queen-s-gambit-declined-albin-countergambit-krenosz-variation",
    name: "Queen",
    eco: "D08",
    variations: [

    ],
  },

  {
    id: "d08-queen-s-gambit-declined-albin-countergambit-lasker-trap",
    name: "Queen",
    eco: "D08",
    variations: [

    ],
  },

  {
    id: "d08-queen-s-gambit-declined-albin-countergambit-modern-line",
    name: "Queen",
    eco: "D08",
    variations: [

    ],
  },

  {
    id: "d08-queen-s-gambit-declined-albin-countergambit-normal-line",
    name: "Queen",
    eco: "D08",
    variations: [

    ],
  },

  {
    id: "d08-queen-s-gambit-declined-albin-countergambit-spassky-variation",
    name: "Queen",
    eco: "D08",
    variations: [

    ],
  },

  {
    id: "d08-queen-s-gambit-declined-albin-countergambit-tartakower-defense",
    name: "Queen",
    eco: "D08",
    variations: [

    ],
  },

  {
    id: "d09-queen-s-gambit-declined-albin-countergambit-fianchetto-variation",
    name: "Queen",
    eco: "D09",
    variations: [

    ],
  },

  {
    id: "d09-queen-s-gambit-declined-albin-countergambit-fianchetto-variation-be6-line",
    name: "Queen",
    eco: "D09",
    variations: [

    ],
  },

  {
    id: "d09-queen-s-gambit-declined-albin-countergambit-fianchetto-variation-bf5-line",
    name: "Queen",
    eco: "D09",
    variations: [

    ],
  },

  {
    id: "d09-queen-s-gambit-declined-albin-countergambit-fianchetto-variation-bg4-line",
    name: "Queen",
    eco: "D09",
    variations: [

    ],
  },

  {
    id: "d10-slav-defense",
    name: "Slav Defense",
    eco: "D10",
    variations: [

    ],
  },

  {
    id: "slav-chebanenko",
    name: "Slav Defense: Chebanenko Variation",
    eco: "D10",
    variations: [

    ],
  },

  {
    id: "d10-slav-defense-diemer-gambit",
    name: "Slav Defense: Diemer Gambit",
    eco: "D10",
    variations: [

    ],
  },

  {
    id: "d10-slav-defense-exchange-variation",
    name: "Slav Defense: Exchange Variation",
    eco: "D10",
    variations: [

    ],
  },

  {
    id: "d10-slav-defense-exchange-variation-boor-attack",
    name: "Slav Defense: Exchange Variation, Boor Attack",
    eco: "D10",
    variations: [

    ],
  },

  {
    id: "d10-slav-defense-slav-gambit-alekhine-attack",
    name: "Slav Defense: Slav Gambit, Alekhine Attack",
    eco: "D10",
    variations: [

    ],
  },

  {
    id: "d10-slav-defense-winawer-countergambit",
    name: "Slav Defense: Winawer Countergambit",
    eco: "D10",
    variations: [

    ],
  },

  {
    id: "d10-slav-defense-winawer-countergambit-anti-winawer-gambit",
    name: "Slav Defense: Winawer Countergambit, Anti-Winawer Gambit",
    eco: "D10",
    variations: [

    ],
  },

  {
    id: "d11-slav-defense-bonet-gambit",
    name: "Slav Defense: Bonet Gambit",
    eco: "D11",
    variations: [

    ],
  },

  {
    id: "d11-slav-defense-breyer-variation",
    name: "Slav Defense: Breyer Variation",
    eco: "D11",
    variations: [

    ],
  },

  {
    id: "slav-krause",
    name: "Slav Defense: Krause Variation",
    eco: "D11",
    variations: [

    ],
  },

  {
    id: "d11-slav-defense-modern-line",
    name: "Slav Defense: Modern Line",
    eco: "D11",
    variations: [

    ],
  },

  {
    id: "d11-slav-defense-quiet-variation",
    name: "Slav Defense: Quiet Variation",
    eco: "D11",
    variations: [

    ],
  },

  {
    id: "d11-slav-defense-quiet-variation-pin-defense",
    name: "Slav Defense: Quiet Variation, Pin Defense",
    eco: "D11",
    variations: [

    ],
  },

  {
    id: "d12-slav-defense-quiet-variation-amsterdam-variation",
    name: "Slav Defense: Quiet Variation, Amsterdam Variation",
    eco: "D12",
    variations: [

    ],
  },

  {
    id: "d12-slav-defense-quiet-variation-landau-variation",
    name: "Slav Defense: Quiet Variation, Landau Variation",
    eco: "D12",
    variations: [

    ],
  },

  {
    id: "d12-slav-defense-quiet-variation-schallopp-defense",
    name: "Slav Defense: Quiet Variation, Schallopp Defense",
    eco: "D12",
    variations: [

    ],
  },

  {
    id: "d13-slav-defense-exchange-variation",
    name: "Slav Defense: Exchange Variation",
    eco: "D13",
    variations: [

    ],
  },

  {
    id: "d13-slav-defense-exchange-variation-schallopp-variation",
    name: "Slav Defense: Exchange Variation, Schallopp Variation",
    eco: "D13",
    variations: [

    ],
  },

  {
    id: "d14-slav-defense-exchange-variation-symmetrical-line",
    name: "Slav Defense: Exchange Variation, Symmetrical Line",
    eco: "D14",
    variations: [

    ],
  },

  {
    id: "d14-slav-defense-exchange-variation-trifunovic-variation",
    name: "Slav Defense: Exchange Variation, Trifunovic Variation",
    eco: "D14",
    variations: [

    ],
  },

  {
    id: "d15-slav-defense-alekhine-variation",
    name: "Slav Defense: Alekhine Variation",
    eco: "D15",
    variations: [

    ],
  },

  {
    id: "d15-slav-defense-chebanenko-variation",
    name: "Slav Defense: Chebanenko Variation",
    eco: "D15",
    variations: [

    ],
  },

  {
    id: "d15-slav-defense-chebanenko-variation-advance-system",
    name: "Slav Defense: Chebanenko Variation, Advance System",
    eco: "D15",
    variations: [

    ],
  },

  {
    id: "d15-slav-defense-geller-gambit",
    name: "Slav Defense: Geller Gambit",
    eco: "D15",
    variations: [

    ],
  },

  {
    id: "d15-slav-defense-schlechter-variation",
    name: "Slav Defense: Schlechter Variation",
    eco: "D15",
    variations: [

    ],
  },

  {
    id: "d15-slav-defense-s-chting-variation",
    name: "Slav Defense: Süchting Variation",
    eco: "D15",
    variations: [

    ],
  },

  {
    id: "d15-slav-defense-three-knights-variation",
    name: "Slav Defense: Three Knights Variation",
    eco: "D15",
    variations: [

    ],
  },

  {
    id: "d15-slav-defense-two-knights-attack",
    name: "Slav Defense: Two Knights Attack",
    eco: "D15",
    variations: [

    ],
  },

  {
    id: "d16-slav-defense-alapin-variation",
    name: "Slav Defense: Alapin Variation",
    eco: "D16",
    variations: [

    ],
  },

  {
    id: "d16-slav-defense-smyslov-variation",
    name: "Slav Defense: Smyslov Variation",
    eco: "D16",
    variations: [

    ],
  },

  {
    id: "d16-slav-defense-soultanbeieff-variation",
    name: "Slav Defense: Soultanbeieff Variation",
    eco: "D16",
    variations: [

    ],
  },

  {
    id: "d16-slav-defense-steiner-variation",
    name: "Slav Defense: Steiner Variation",
    eco: "D16",
    variations: [

    ],
  },

  {
    id: "d17-slav-defense-czech-variation",
    name: "Slav Defense: Czech Variation",
    eco: "D17",
    variations: [

    ],
  },

  {
    id: "d17-slav-defense-czech-variation-bled-attack",
    name: "Slav Defense: Czech Variation, Bled Attack",
    eco: "D17",
    variations: [

    ],
  },

  {
    id: "d17-slav-defense-czech-variation-carlsbad-variation",
    name: "Slav Defense: Czech Variation, Carlsbad Variation",
    eco: "D17",
    variations: [

    ],
  },

  {
    id: "d17-slav-defense-czech-variation-carlsbad-variation-morozevich-variation",
    name: "Slav Defense: Czech Variation, Carlsbad Variation, Morozevich Variation",
    eco: "D17",
    variations: [

    ],
  },

  {
    id: "d17-slav-defense-czech-variation-krause-attack",
    name: "Slav Defense: Czech Variation, Krause Attack",
    eco: "D17",
    variations: [

    ],
  },

  {
    id: "d17-slav-defense-czech-variation-krause-attack-fazekas-gambit",
    name: "Slav Defense: Czech Variation, Krause Attack, Fazekas Gambit",
    eco: "D17",
    variations: [

    ],
  },

  {
    id: "d17-slav-defense-czech-variation-wiesbaden-variation",
    name: "Slav Defense: Czech Variation, Wiesbaden Variation",
    eco: "D17",
    variations: [

    ],
  },

  {
    id: "d17-slav-defense-czech-variation-wiesbaden-variation-sharp-line",
    name: "Slav Defense: Czech Variation, Wiesbaden Variation, Sharp Line",
    eco: "D17",
    variations: [

    ],
  },

  {
    id: "d18-slav-defense-czech-variation-classical-system",
    name: "Slav Defense: Czech Variation, Classical System",
    eco: "D18",
    variations: [

    ],
  },

  {
    id: "d18-slav-defense-czech-variation-lasker-variation",
    name: "Slav Defense: Czech Variation, Lasker Variation",
    eco: "D18",
    variations: [

    ],
  },

  {
    id: "d19-slav-defense-czech-variation-classical-system-main-line",
    name: "Slav Defense: Czech Variation, Classical System, Main Line",
    eco: "D19",
    variations: [

    ],
  },

  {
    id: "d19-slav-defense-czech-variation-dutch-variation",
    name: "Slav Defense: Czech Variation, Dutch Variation",
    eco: "D19",
    variations: [

    ],
  },

  {
    id: "d19-slav-defense-czech-variation-dutch-variation-s-misch-variation",
    name: "Slav Defense: Czech Variation, Dutch Variation, Sämisch Variation",
    eco: "D19",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-accelerated-mannheim-variation",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-central-variation-alekhine-system",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-central-variation-greco-variation",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-central-variation-mcdonnell-defense",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-central-variation-mcdonnell-defense-somov-gambit",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-central-variation-modern-defense",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-central-variation-rubinstein-defense",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-central-variation-rubinstein-defense-yefimov-gambit",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-linares-variation",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-old-variation",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-old-variation-billinger-gambit",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-old-variation-christensen-gambit",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-old-variation-korchnoi-gambit",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-old-variation-novikov-gambit",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-saduleto-variation",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d20-queen-s-gambit-accepted-schwartz-defense",
    name: "Queen",
    eco: "D20",
    variations: [

    ],
  },

  {
    id: "d21-queen-s-gambit-accepted-alekhine-defense-borisenko-furman-variation",
    name: "Queen",
    eco: "D21",
    variations: [

    ],
  },

  {
    id: "d21-queen-s-gambit-accepted-godes-variation",
    name: "Queen",
    eco: "D21",
    variations: [

    ],
  },

  {
    id: "d21-queen-s-gambit-accepted-gunsberg-defense",
    name: "Queen",
    eco: "D21",
    variations: [

    ],
  },

  {
    id: "d21-queen-s-gambit-accepted-normal-variation",
    name: "Queen",
    eco: "D21",
    variations: [

    ],
  },

  {
    id: "d21-queen-s-gambit-accepted-rosenthal-variation",
    name: "Queen",
    eco: "D21",
    variations: [

    ],
  },

  {
    id: "d21-queen-s-gambit-accepted-slav-gambit",
    name: "Queen",
    eco: "D21",
    variations: [

    ],
  },

  {
    id: "d22-queen-s-gambit-accepted-alekhine-defense",
    name: "Queen",
    eco: "D22",
    variations: [

    ],
  },

  {
    id: "d22-queen-s-gambit-accepted-alekhine-defense-alatortsev-variation",
    name: "Queen",
    eco: "D22",
    variations: [

    ],
  },

  {
    id: "d22-queen-s-gambit-accepted-alekhine-defense-haberditz-variation",
    name: "Queen",
    eco: "D22",
    variations: [

    ],
  },

  {
    id: "d23-queen-s-gambit-accepted",
    name: "Queen",
    eco: "D23",
    variations: [

    ],
  },

  {
    id: "d23-queen-s-gambit-accepted-mannheim-variation",
    name: "Queen",
    eco: "D23",
    variations: [

    ],
  },

  {
    id: "d24-queen-s-gambit-accepted",
    name: "Queen",
    eco: "D24",
    variations: [

    ],
  },

  {
    id: "d24-queen-s-gambit-accepted-bogoljubow-defense",
    name: "Queen",
    eco: "D24",
    variations: [

    ],
  },

  {
    id: "d24-queen-s-gambit-accepted-gunsberg-defense-prianishenmo-gambit",
    name: "Queen",
    eco: "D24",
    variations: [

    ],
  },

  {
    id: "d24-queen-s-gambit-accepted-showalter-variation",
    name: "Queen",
    eco: "D24",
    variations: [

    ],
  },

  {
    id: "d25-queen-s-gambit-accepted-janowski-larsen-variation",
    name: "Queen",
    eco: "D25",
    variations: [

    ],
  },

  {
    id: "d25-queen-s-gambit-accepted-normal-variation",
    name: "Queen",
    eco: "D25",
    variations: [

    ],
  },

  {
    id: "d25-queen-s-gambit-accepted-smyslov-variation",
    name: "Queen",
    eco: "D25",
    variations: [

    ],
  },

  {
    id: "d25-queen-s-gambit-accepted-winawer-defense",
    name: "Queen",
    eco: "D25",
    variations: [

    ],
  },

  {
    id: "d26-queen-s-gambit-accepted-classical-defense",
    name: "Queen",
    eco: "D26",
    variations: [

    ],
  },

  {
    id: "d26-queen-s-gambit-accepted-classical-defense-normal-line",
    name: "Queen",
    eco: "D26",
    variations: [

    ],
  },

  {
    id: "d26-queen-s-gambit-accepted-classical-defense-steinitz-variation-development-variation",
    name: "Queen",
    eco: "D26",
    variations: [

    ],
  },

  {
    id: "d26-queen-s-gambit-accepted-classical-defense-steinitz-variation-exchange-variation",
    name: "Queen",
    eco: "D26",
    variations: [

    ],
  },

  {
    id: "d26-queen-s-gambit-accepted-classical-furman-variation",
    name: "Queen",
    eco: "D26",
    variations: [

    ],
  },

  {
    id: "d26-queen-s-gambit-accepted-normal-variation-a6-sideline",
    name: "Queen",
    eco: "D26",
    variations: [

    ],
  },

  {
    id: "d26-queen-s-gambit-accepted-normal-variation-traditional-system",
    name: "Queen",
    eco: "D26",
    variations: [

    ],
  },

  {
    id: "d27-queen-s-gambit-accepted-classical-defense-main-line",
    name: "Queen",
    eco: "D27",
    variations: [

    ],
  },

  {
    id: "d27-queen-s-gambit-accepted-classical-defense-rubinstein-variation",
    name: "Queen",
    eco: "D27",
    variations: [

    ],
  },

  {
    id: "d27-queen-s-gambit-accepted-classical-defense-russian-gambit",
    name: "Queen",
    eco: "D27",
    variations: [

    ],
  },

  {
    id: "d27-queen-s-gambit-accepted-furman-variation",
    name: "Queen",
    eco: "D27",
    variations: [

    ],
  },

  {
    id: "d28-queen-s-gambit-accepted-classical-defense-alekhine-system",
    name: "Queen",
    eco: "D28",
    variations: [

    ],
  },

  {
    id: "d28-queen-s-gambit-accepted-classical-flohr-variation",
    name: "Queen",
    eco: "D28",
    variations: [

    ],
  },

  {
    id: "d29-queen-s-gambit-accepted-classical-defense-alekhine-system-main-line",
    name: "Queen",
    eco: "D29",
    variations: [

    ],
  },

  {
    id: "d29-queen-s-gambit-accepted-classical-defense-alekhine-system-smyslov-variation",
    name: "Queen",
    eco: "D29",
    variations: [

    ],
  },

  {
    id: "d30-queen-s-gambit-declined",
    name: "Queen",
    eco: "D30",
    variations: [

    ],
  },

  {
    id: "d30-queen-s-gambit-declined-capablanca-variation",
    name: "Queen",
    eco: "D30",
    variations: [

    ],
  },

  {
    id: "d30-queen-s-gambit-declined-semmering-variation",
    name: "Queen",
    eco: "D30",
    variations: [

    ],
  },

  {
    id: "d30-queen-s-gambit-declined-spielmann-variation",
    name: "Queen",
    eco: "D30",
    variations: [

    ],
  },

  {
    id: "d30-queen-s-gambit-declined-stonewall-variation",
    name: "Queen",
    eco: "D30",
    variations: [

    ],
  },

  {
    id: "d30-queen-s-gambit-declined-tarrasch-defense-pseudo-tarrasch",
    name: "Queen",
    eco: "D30",
    variations: [

    ],
  },

  {
    id: "d30-queen-s-gambit-declined-tarrasch-defense-pseudo-tarrasch-bishop-attack",
    name: "Queen",
    eco: "D30",
    variations: [

    ],
  },

  {
    id: "d30-queen-s-gambit-declined-traditional-variation",
    name: "Queen",
    eco: "D30",
    variations: [

    ],
  },

  {
    id: "d30-queen-s-gambit-declined-vienna-variation",
    name: "Queen",
    eco: "D30",
    variations: [

    ],
  },

  {
    id: "d30-semi-slav-defense-quiet-variation",
    name: "Semi-Slav Defense: Quiet Variation",
    eco: "D30",
    variations: [

    ],
  },

  {
    id: "d31-queen-s-gambit-declined-alapin-variation",
    name: "Queen",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-queen-s-gambit-declined-charousek-variation",
    name: "Queen",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-queen-s-gambit-declined-charousek-variation-miladinovic-gambit",
    name: "Queen",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-queen-s-gambit-declined-janowski-variation",
    name: "Queen",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-queen-s-gambit-declined-queen-s-knight-variation",
    name: "Queen",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-queen-s-gambit-declined-semi-slav-abrahams-variation",
    name: "Queen",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-queen-s-gambit-declined-semi-slav-junge-variation",
    name: "Queen",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-queen-s-gambit-declined-semi-slav-koomen-variation",
    name: "Queen",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-accelerated-move-order",
    name: "Semi-Slav Defense: Accelerated Move Order",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-anti-noteboom-stonewall-variation",
    name: "Semi-Slav Defense: Anti-Noteboom, Stonewall Variation",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-anti-noteboom-stonewall-variation-portisch-gambit",
    name: "Semi-Slav Defense: Anti-Noteboom, Stonewall Variation, Portisch Gambit",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-gunderam-gambit",
    name: "Semi-Slav Defense: Gunderam Gambit",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-marshall-gambit",
    name: "Semi-Slav Defense: Marshall Gambit",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-marshall-gambit-forgotten-variation",
    name: "Semi-Slav Defense: Marshall Gambit, Forgotten Variation",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-marshall-gambit-main-line",
    name: "Semi-Slav Defense: Marshall Gambit, Main Line",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-marshall-gambit-tolush-variation",
    name: "Semi-Slav Defense: Marshall Gambit, Tolush Variation",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-noteboom-variation",
    name: "Semi-Slav Defense: Noteboom Variation",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-noteboom-variation-abrahams-variation",
    name: "Semi-Slav Defense: Noteboom Variation, Abrahams Variation",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-noteboom-variation-anti-noteboom-gambit",
    name: "Semi-Slav Defense: Noteboom Variation, Anti-Noteboom Gambit",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-noteboom-variation-anti-noteboom-variation",
    name: "Semi-Slav Defense: Noteboom Variation, Anti-Noteboom Variation",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d31-semi-slav-defense-noteboom-variation-anti-noteboom-variation-belyavsky-line",
    name: "Semi-Slav Defense: Noteboom Variation, Anti-Noteboom Variation, Belyavsky Line",
    eco: "D31",
    variations: [

    ],
  },

  {
    id: "d32-queen-s-gambit-declined-tarrasch-defense",
    name: "Queen",
    eco: "D32",
    variations: [

    ],
  },

  {
    id: "d32-tarrasch-defense",
    name: "Tarrasch Defense",
    eco: "D32",
    variations: [

    ],
  },

  {
    id: "d32-tarrasch-defense-gr-nfeld-gambit",
    name: "Tarrasch Defense: Grünfeld Gambit",
    eco: "D32",
    variations: [

    ],
  },

  {
    id: "d32-tarrasch-defense-marshall-gambit",
    name: "Tarrasch Defense: Marshall Gambit",
    eco: "D32",
    variations: [

    ],
  },

  {
    id: "d32-tarrasch-defense-schara-gambit",
    name: "Tarrasch Defense: Schara Gambit",
    eco: "D32",
    variations: [

    ],
  },

  {
    id: "d32-tarrasch-defense-symmetrical-variation",
    name: "Tarrasch Defense: Symmetrical Variation",
    eco: "D32",
    variations: [

    ],
  },

  {
    id: "d32-tarrasch-defense-tarrasch-gambit",
    name: "Tarrasch Defense: Tarrasch Gambit",
    eco: "D32",
    variations: [

    ],
  },

  {
    id: "d32-tarrasch-defense-two-knights-variation",
    name: "Tarrasch Defense: Two Knights Variation",
    eco: "D32",
    variations: [

    ],
  },

  {
    id: "d32-tarrasch-defense-von-hennig-gambit",
    name: "Tarrasch Defense: von Hennig Gambit",
    eco: "D32",
    variations: [

    ],
  },

  {
    id: "d33-tarrasch-defense-dubov-tarrasch",
    name: "Tarrasch Defense: Dubov Tarrasch",
    eco: "D33",
    variations: [

    ],
  },

  {
    id: "d33-tarrasch-defense-prague-variation",
    name: "Tarrasch Defense: Prague Variation",
    eco: "D33",
    variations: [

    ],
  },

  {
    id: "d33-tarrasch-defense-rubinstein-system",
    name: "Tarrasch Defense: Rubinstein System",
    eco: "D33",
    variations: [

    ],
  },

  {
    id: "d33-tarrasch-defense-swedish-variation",
    name: "Tarrasch Defense: Swedish Variation",
    eco: "D33",
    variations: [

    ],
  },

  {
    id: "d33-tarrasch-defense-swedish-variation-central-break",
    name: "Tarrasch Defense: Swedish Variation, Central Break",
    eco: "D33",
    variations: [

    ],
  },

  {
    id: "d33-tarrasch-defense-wagner-variation",
    name: "Tarrasch Defense: Wagner Variation",
    eco: "D33",
    variations: [

    ],
  },

  {
    id: "d34-queen-s-gambit-declined-tarrasch-defense-stoltz-variation",
    name: "Queen",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d34-tarrasch-defense-classical-variation",
    name: "Tarrasch Defense: Classical Variation",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d34-tarrasch-defense-classical-variation-advance-variation",
    name: "Tarrasch Defense: Classical Variation, Advance Variation",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d34-tarrasch-defense-classical-variation-bogoljubow-variation",
    name: "Tarrasch Defense: Classical Variation, Bogoljubow Variation",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d34-tarrasch-defense-classical-variation-carlsbad-variation",
    name: "Tarrasch Defense: Classical Variation, Carlsbad Variation",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d34-tarrasch-defense-classical-variation-chandler-variation",
    name: "Tarrasch Defense: Classical Variation, Chandler Variation",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d34-tarrasch-defense-classical-variation-classical-tarrasch-gambit",
    name: "Tarrasch Defense: Classical Variation, Classical Tarrasch Gambit",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d34-tarrasch-defense-classical-variation-endgame-variation",
    name: "Tarrasch Defense: Classical Variation, Endgame Variation",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d34-tarrasch-defense-classical-variation-main-line",
    name: "Tarrasch Defense: Classical Variation, Main Line",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d34-tarrasch-defense-classical-variation-petursson-variation",
    name: "Tarrasch Defense: Classical Variation, Petursson Variation",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d34-tarrasch-defense-classical-variation-r-ti-variation",
    name: "Tarrasch Defense: Classical Variation, Réti Variation",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d34-tarrasch-defense-classical-variation-spassky-variation",
    name: "Tarrasch Defense: Classical Variation, Spassky Variation",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d34-tarrasch-defense-prague-variation-main-line",
    name: "Tarrasch Defense: Prague Variation, Main Line",
    eco: "D34",
    variations: [

    ],
  },

  {
    id: "d35-queen-s-gambit-declined-exchange-variation",
    name: "Queen",
    eco: "D35",
    variations: [

    ],
  },

  {
    id: "d35-queen-s-gambit-declined-exchange-variation-carlsen-variation",
    name: "Queen",
    eco: "D35",
    variations: [

    ],
  },

  {
    id: "d35-queen-s-gambit-declined-exchange-variation-chameleon-variation",
    name: "Queen",
    eco: "D35",
    variations: [

    ],
  },

  {
    id: "d35-queen-s-gambit-declined-exchange-variation-positional-variation",
    name: "Queen",
    eco: "D35",
    variations: [

    ],
  },

  {
    id: "d35-queen-s-gambit-declined-exchange-variation-s-misch-variation",
    name: "Queen",
    eco: "D35",
    variations: [

    ],
  },

  {
    id: "d35-queen-s-gambit-declined-harrwitz-attack",
    name: "Queen",
    eco: "D35",
    variations: [

    ],
  },

  {
    id: "d35-queen-s-gambit-declined-normal-defense",
    name: "Queen",
    eco: "D35",
    variations: [

    ],
  },

  {
    id: "d36-queen-s-gambit-declined-exchange-variation-reshevsky-variation",
    name: "Queen",
    eco: "D36",
    variations: [

    ],
  },

  {
    id: "d37-queen-s-gambit-declined-barmen-variation",
    name: "Queen",
    eco: "D37",
    variations: [

    ],
  },

  {
    id: "d37-queen-s-gambit-declined-harrwitz-attack",
    name: "Queen",
    eco: "D37",
    variations: [

    ],
  },

  {
    id: "d37-queen-s-gambit-declined-harrwitz-attack-fianchetto-defense",
    name: "Queen",
    eco: "D37",
    variations: [

    ],
  },

  {
    id: "d37-queen-s-gambit-declined-harrwitz-attack-main-line",
    name: "Queen",
    eco: "D37",
    variations: [

    ],
  },

  {
    id: "d37-queen-s-gambit-declined-harrwitz-attack-orthodox-defense",
    name: "Queen",
    eco: "D37",
    variations: [

    ],
  },

  {
    id: "d37-queen-s-gambit-declined-harrwitz-attack-two-knights-defense",
    name: "Queen",
    eco: "D37",
    variations: [

    ],
  },

  {
    id: "d37-queen-s-gambit-declined-harrwitz-attack-two-knights-defense-blockade-line",
    name: "Queen",
    eco: "D37",
    variations: [

    ],
  },

  {
    id: "d37-queen-s-gambit-declined-knight-defense-alekhine-gambit",
    name: "Queen",
    eco: "D37",
    variations: [

    ],
  },

  {
    id: "d37-queen-s-gambit-declined-miles-variation",
    name: "Queen",
    eco: "D37",
    variations: [

    ],
  },

  {
    id: "d37-queen-s-gambit-declined-three-knights-variation",
    name: "Queen",
    eco: "D37",
    variations: [

    ],
  },

  {
    id: "d37-queen-s-gambit-declined-three-knights-vienna-variation",
    name: "Queen",
    eco: "D37",
    variations: [

    ],
  },

  {
    id: "d37-queen-s-gambit-declined-vienna-variation-quiet-variation",
    name: "Queen",
    eco: "D37",
    variations: [

    ],
  },

  {
    id: "d38-queen-s-gambit-declined-ragozin-defense",
    name: "Queen",
    eco: "D38",
    variations: [

    ],
  },

  {
    id: "d38-queen-s-gambit-declined-ragozin-defense-alekhine-variation",
    name: "Queen",
    eco: "D38",
    variations: [

    ],
  },

  {
    id: "d38-queen-s-gambit-declined-westphalian-variation",
    name: "Queen",
    eco: "D38",
    variations: [

    ],
  },

  {
    id: "d39-queen-s-gambit-declined-ragozin-defense-vienna-variation",
    name: "Queen",
    eco: "D39",
    variations: [

    ],
  },

  {
    id: "d40-queen-s-gambit-declined-semi-tarrasch-defense",
    name: "Queen",
    eco: "D40",
    variations: [

    ],
  },

  {
    id: "d40-queen-s-gambit-declined-semi-tarrasch-defense-levenfish-variation",
    name: "Queen",
    eco: "D40",
    variations: [

    ],
  },

  {
    id: "d40-queen-s-gambit-declined-semi-tarrasch-defense-pillsbury-variation",
    name: "Queen",
    eco: "D40",
    variations: [

    ],
  },

  {
    id: "d40-queen-s-gambit-declined-semi-tarrasch-defense-symmetrical-variation",
    name: "Queen",
    eco: "D40",
    variations: [

    ],
  },

  {
    id: "d40-queen-s-gambit-declined-semi-tarrasch-defense-with-e3",
    name: "Queen",
    eco: "D40",
    variations: [

    ],
  },

  {
    id: "d41-queen-s-gambit-declined-semi-tarrasch-defense",
    name: "Queen",
    eco: "D41",
    variations: [

    ],
  },

  {
    id: "d41-queen-s-gambit-declined-semi-tarrasch-defense-endgame-variation",
    name: "Queen",
    eco: "D41",
    variations: [

    ],
  },

  {
    id: "d41-queen-s-gambit-declined-semi-tarrasch-defense-exchange-variation",
    name: "Queen",
    eco: "D41",
    variations: [

    ],
  },

  {
    id: "d41-queen-s-gambit-declined-semi-tarrasch-defense-kmoch-variation",
    name: "Queen",
    eco: "D41",
    variations: [

    ],
  },

  {
    id: "d41-queen-s-gambit-declined-semi-tarrasch-defense-pillsbury-variation",
    name: "Queen",
    eco: "D41",
    variations: [

    ],
  },

  {
    id: "d41-queen-s-gambit-declined-semi-tarrasch-defense-san-sebastian-variation",
    name: "Queen",
    eco: "D41",
    variations: [

    ],
  },

  {
    id: "d42-queen-s-gambit-declined-semi-tarrasch-defense-main-line",
    name: "Queen",
    eco: "D42",
    variations: [

    ],
  },

  {
    id: "d43-semi-slav-defense",
    name: "Semi-Slav Defense",
    eco: "D43",
    variations: [

    ],
  },

  {
    id: "d43-semi-slav-defense-anti-moscow-gambit",
    name: "Semi-Slav Defense: Anti-Moscow Gambit",
    eco: "D43",
    variations: [

    ],
  },

  {
    id: "d43-semi-slav-defense-hastings-variation",
    name: "Semi-Slav Defense: Hastings Variation",
    eco: "D43",
    variations: [

    ],
  },

  {
    id: "d43-semi-slav-defense-moscow-variation",
    name: "Semi-Slav Defense: Moscow Variation",
    eco: "D43",
    variations: [

    ],
  },

  {
    id: "d44-semi-slav-defense-accepted",
    name: "Semi-Slav Defense Accepted",
    eco: "D44",
    variations: [

    ],
  },

  {
    id: "d44-semi-slav-defense-botvinnik-variation",
    name: "Semi-Slav Defense: Botvinnik Variation",
    eco: "D44",
    variations: [

    ],
  },

  {
    id: "d44-semi-slav-defense-botvinnik-variation-alatortsev-system",
    name: "Semi-Slav Defense: Botvinnik Variation, Alatortsev System",
    eco: "D44",
    variations: [

    ],
  },

  {
    id: "d44-semi-slav-defense-botvinnik-variation-ekstrom-variation",
    name: "Semi-Slav Defense: Botvinnik Variation, Ekstrom Variation",
    eco: "D44",
    variations: [

    ],
  },

  {
    id: "d44-semi-slav-defense-botvinnik-variation-lilienthal-variation",
    name: "Semi-Slav Defense: Botvinnik Variation, Lilienthal Variation",
    eco: "D44",
    variations: [

    ],
  },

  {
    id: "d44-semi-slav-defense-botvinnik-variation-szabo-variation",
    name: "Semi-Slav Defense: Botvinnik Variation, Szabo Variation",
    eco: "D44",
    variations: [

    ],
  },

  {
    id: "slav-botvinnik",
    name: "Slav Defense: Botvinnik Variation",
    eco: "D44",
    variations: [

    ],
  },

  {
    id: "d45-semi-slav-defense-accelerated-meran-variation",
    name: "Semi-Slav Defense: Accelerated Meran Variation",
    eco: "D45",
    variations: [

    ],
  },

  {
    id: "d45-semi-slav-defense-main-line",
    name: "Semi-Slav Defense: Main Line",
    eco: "D45",
    variations: [

    ],
  },

  {
    id: "d45-semi-slav-defense-normal-variation",
    name: "Semi-Slav Defense: Normal Variation",
    eco: "D45",
    variations: [

    ],
  },

  {
    id: "d45-semi-slav-defense-rubinstein-system",
    name: "Semi-Slav Defense: Rubinstein System",
    eco: "D45",
    variations: [

    ],
  },

  {
    id: "d45-semi-slav-defense-stoltz-variation",
    name: "Semi-Slav Defense: Stoltz Variation",
    eco: "D45",
    variations: [

    ],
  },

  {
    id: "d45-semi-slav-defense-stoltz-variation-center-variation",
    name: "Semi-Slav Defense: Stoltz Variation, Center Variation",
    eco: "D45",
    variations: [

    ],
  },

  {
    id: "d45-semi-slav-defense-stoltz-variation-center-variation-mikhalchishin-line",
    name: "Semi-Slav Defense: Stoltz Variation, Center Variation, Mikhalchishin Line",
    eco: "D45",
    variations: [

    ],
  },

  {
    id: "d45-semi-slav-defense-stoltz-variation-shabalov-attack",
    name: "Semi-Slav Defense: Stoltz Variation, Shabalov Attack",
    eco: "D45",
    variations: [

    ],
  },

  {
    id: "d45-semi-slav-defense-stonewall-defense",
    name: "Semi-Slav Defense: Stonewall Defense",
    eco: "D45",
    variations: [

    ],
  },

  {
    id: "d46-semi-slav-defense-bogoljubow-variation",
    name: "Semi-Slav Defense: Bogoljubow Variation",
    eco: "D46",
    variations: [

    ],
  },

  {
    id: "d46-semi-slav-defense-chigorin-defense",
    name: "Semi-Slav Defense: Chigorin Defense",
    eco: "D46",
    variations: [

    ],
  },

  {
    id: "d46-semi-slav-defense-main-line",
    name: "Semi-Slav Defense: Main Line",
    eco: "D46",
    variations: [

    ],
  },

  {
    id: "d46-semi-slav-defense-romih-variation",
    name: "Semi-Slav Defense: Romih Variation",
    eco: "D46",
    variations: [

    ],
  },

  {
    id: "d47-semi-slav-defense-meran-variation",
    name: "Semi-Slav Defense: Meran Variation",
    eco: "D47",
    variations: [

    ],
  },

  {
    id: "d47-semi-slav-defense-meran-variation-lundin-variation",
    name: "Semi-Slav Defense: Meran Variation, Lundin Variation",
    eco: "D47",
    variations: [

    ],
  },

  {
    id: "d47-semi-slav-defense-meran-variation-wade-variation",
    name: "Semi-Slav Defense: Meran Variation, Wade Variation",
    eco: "D47",
    variations: [

    ],
  },

  {
    id: "d47-semi-slav-defense-meran-variation-wade-variation-kaidanov-gambit",
    name: "Semi-Slav Defense: Meran Variation, Wade Variation, Kaidanov Gambit",
    eco: "D47",
    variations: [

    ],
  },

  {
    id: "d47-semi-slav-defense-meran-variation-wade-variation-larsen-variation",
    name: "Semi-Slav Defense: Meran Variation, Wade Variation, Larsen Variation",
    eco: "D47",
    variations: [

    ],
  },

  {
    id: "d47-semi-slav-defense-semi-meran-variation",
    name: "Semi-Slav Defense: Semi-Meran Variation",
    eco: "D47",
    variations: [

    ],
  },

  {
    id: "d48-semi-slav-defense-meran-variation",
    name: "Semi-Slav Defense: Meran Variation",
    eco: "D48",
    variations: [

    ],
  },

  {
    id: "d48-semi-slav-defense-meran-variation-old-variation",
    name: "Semi-Slav Defense: Meran Variation, Old Variation",
    eco: "D48",
    variations: [

    ],
  },

  {
    id: "d48-semi-slav-defense-meran-variation-pirc-variation",
    name: "Semi-Slav Defense: Meran Variation, Pirc Variation",
    eco: "D48",
    variations: [

    ],
  },

  {
    id: "d48-semi-slav-defense-meran-variation-reynolds-variation",
    name: "Semi-Slav Defense: Meran Variation, Reynolds",
    eco: "D48",
    variations: [

    ],
  },

  {
    id: "d49-semi-slav-defense-meran-variation-blumenfeld-variation",
    name: "Semi-Slav Defense: Meran Variation, Blumenfeld Variation",
    eco: "D49",
    variations: [

    ],
  },

  {
    id: "d49-semi-slav-defense-meran-variation-rabinovich-variation",
    name: "Semi-Slav Defense: Meran Variation, Rabinovich Variation",
    eco: "D49",
    variations: [

    ],
  },

  {
    id: "d49-semi-slav-defense-meran-variation-rellstab-attack",
    name: "Semi-Slav Defense: Meran Variation, Rellstab Attack",
    eco: "D49",
    variations: [

    ],
  },

  {
    id: "d49-semi-slav-defense-meran-variation-sozin-variation",
    name: "Semi-Slav Defense: Meran Variation, Sozin Variation",
    eco: "D49",
    variations: [

    ],
  },

  {
    id: "d49-semi-slav-defense-meran-variation-stahlberg-variation",
    name: "Semi-Slav Defense: Meran Variation, Stahlberg Variation",
    eco: "D49",
    variations: [

    ],
  },

  {
    id: "d50-queen-s-gambit-declined-been-koomen-variation",
    name: "Queen",
    eco: "D50",
    variations: [

    ],
  },

  {
    id: "d50-queen-s-gambit-declined-modern-variation",
    name: "Queen",
    eco: "D50",
    variations: [

    ],
  },

  {
    id: "d50-queen-s-gambit-declined-pseudo-tarrasch-variation",
    name: "Queen",
    eco: "D50",
    variations: [

    ],
  },

  {
    id: "d50-queen-s-gambit-declined-pseudo-tarrasch-variation-canal-variation",
    name: "Queen",
    eco: "D50",
    variations: [

    ],
  },

  {
    id: "d50-queen-s-gambit-declined-pseudo-tarrasch-variation-primitive-pillsbury-variation",
    name: "Queen",
    eco: "D50",
    variations: [

    ],
  },

  {
    id: "d50-queen-s-gambit-declined-semi-tarrasch-defense-krause-variation",
    name: "Queen",
    eco: "D50",
    variations: [

    ],
  },

  {
    id: "d51-queen-s-gambit-declined-alekhine-variation",
    name: "Queen",
    eco: "D51",
    variations: [

    ],
  },

  {
    id: "d51-queen-s-gambit-declined-capablanca-variation-anti-cambridge-springs-variation",
    name: "Queen",
    eco: "D51",
    variations: [

    ],
  },

  {
    id: "d51-queen-s-gambit-declined-manhattan-variation",
    name: "Queen",
    eco: "D51",
    variations: [

    ],
  },

  {
    id: "d51-queen-s-gambit-declined-modern-variation-knight-defense",
    name: "Queen",
    eco: "D51",
    variations: [

    ],
  },

  {
    id: "d51-queen-s-gambit-declined-rochlin-variation",
    name: "Queen",
    eco: "D51",
    variations: [

    ],
  },

  {
    id: "d52-queen-s-gambit-declined",
    name: "Queen",
    eco: "D52",
    variations: [

    ],
  },

  {
    id: "d52-queen-s-gambit-declined-cambridge-springs-defense",
    name: "Queen",
    eco: "D52",
    variations: [

    ],
  },

  {
    id: "d52-queen-s-gambit-declined-cambridge-springs-defense-argentine-variation",
    name: "Queen",
    eco: "D52",
    variations: [

    ],
  },

  {
    id: "d52-queen-s-gambit-declined-cambridge-springs-defense-bogoljubow-variation",
    name: "Queen",
    eco: "D52",
    variations: [

    ],
  },

  {
    id: "d52-queen-s-gambit-declined-cambridge-springs-defense-capablanca-variation",
    name: "Queen",
    eco: "D52",
    variations: [

    ],
  },

  {
    id: "d52-queen-s-gambit-declined-cambridge-springs-defense-rubinstein-variation",
    name: "Queen",
    eco: "D52",
    variations: [

    ],
  },

  {
    id: "d52-queen-s-gambit-declined-cambridge-springs-defense-yugoslav-variation",
    name: "Queen",
    eco: "D52",
    variations: [

    ],
  },

  {
    id: "d53-queen-s-gambit-declined",
    name: "Queen",
    eco: "D53",
    variations: [

    ],
  },

  {
    id: "d53-queen-s-gambit-declined-lasker-defense",
    name: "Queen",
    eco: "D53",
    variations: [

    ],
  },

  {
    id: "d53-queen-s-gambit-declined-modern-variation-heral-variation",
    name: "Queen",
    eco: "D53",
    variations: [

    ],
  },

  {
    id: "d53-queen-s-gambit-declined-uhlmann-variation",
    name: "Queen",
    eco: "D53",
    variations: [

    ],
  },

  {
    id: "d54-queen-s-gambit-declined-neo-orthodox-variation",
    name: "Queen",
    eco: "D54",
    variations: [

    ],
  },

  {
    id: "d55-queen-s-gambit-declined-anti-tartakower-variation",
    name: "Queen",
    eco: "D55",
    variations: [

    ],
  },

  {
    id: "d55-queen-s-gambit-declined-anti-tartakower-variation-petrosian-variation",
    name: "Queen",
    eco: "D55",
    variations: [

    ],
  },

  {
    id: "d55-queen-s-gambit-declined-modern-variation-normal-line",
    name: "Queen",
    eco: "D55",
    variations: [

    ],
  },

  {
    id: "d55-queen-s-gambit-declined-neo-orthodox-variation",
    name: "Queen",
    eco: "D55",
    variations: [

    ],
  },

  {
    id: "d55-queen-s-gambit-declined-neo-orthodox-variation-main-line",
    name: "Queen",
    eco: "D55",
    variations: [

    ],
  },

  {
    id: "d55-queen-s-gambit-declined-pillsbury-attack",
    name: "Queen",
    eco: "D55",
    variations: [

    ],
  },

  {
    id: "d56-queen-s-gambit-declined",
    name: "Queen",
    eco: "D56",
    variations: [

    ],
  },

  {
    id: "d56-queen-s-gambit-declined-lasker-defense",
    name: "Queen",
    eco: "D56",
    variations: [

    ],
  },

  {
    id: "d56-queen-s-gambit-declined-lasker-defense-russian-variation",
    name: "Queen",
    eco: "D56",
    variations: [

    ],
  },

  {
    id: "d56-queen-s-gambit-declined-lasker-defense-teichmann-variation",
    name: "Queen",
    eco: "D56",
    variations: [

    ],
  },

  {
    id: "d57-queen-s-gambit-declined-lasker-defense-bernstein-variation",
    name: "Queen",
    eco: "D57",
    variations: [

    ],
  },

  {
    id: "d57-queen-s-gambit-declined-lasker-defense-bernstein-variation-mar-del-plata-gambit",
    name: "Queen",
    eco: "D57",
    variations: [

    ],
  },

  {
    id: "d57-queen-s-gambit-declined-lasker-defense-main-line",
    name: "Queen",
    eco: "D57",
    variations: [

    ],
  },

  {
    id: "d58-queen-s-gambit-declined-tartakower-defense",
    name: "Queen",
    eco: "D58",
    variations: [

    ],
  },

  {
    id: "d58-queen-s-gambit-declined-tartakower-defense-exchange-variation",
    name: "Queen",
    eco: "D58",
    variations: [

    ],
  },

  {
    id: "d59-queen-s-gambit-declined-tartakower-defense",
    name: "Queen",
    eco: "D59",
    variations: [

    ],
  },

  {
    id: "d59-queen-s-gambit-declined-tartakower-defense-makogonov-exchange-variation",
    name: "Queen",
    eco: "D59",
    variations: [

    ],
  },

  {
    id: "d60-queen-s-gambit-declined-orthodox-defense",
    name: "Queen",
    eco: "D60",
    variations: [

    ],
  },

  {
    id: "d60-queen-s-gambit-declined-orthodox-defense-botvinnik-variation",
    name: "Queen",
    eco: "D60",
    variations: [

    ],
  },

  {
    id: "d60-queen-s-gambit-declined-orthodox-defense-rauzer-variation",
    name: "Queen",
    eco: "D60",
    variations: [

    ],
  },

  {
    id: "d61-queen-s-gambit-declined-orthodox-defense-rubinstein-variation",
    name: "Queen",
    eco: "D61",
    variations: [

    ],
  },

  {
    id: "d62-queen-s-gambit-declined-orthodox-defense-rubinstein-variation-flohr-line",
    name: "Queen",
    eco: "D62",
    variations: [

    ],
  },

  {
    id: "d63-queen-s-gambit-declined-orthodox-defense-capablanca-variation",
    name: "Queen",
    eco: "D63",
    variations: [

    ],
  },

  {
    id: "d63-queen-s-gambit-declined-orthodox-defense-henneberger-variation",
    name: "Queen",
    eco: "D63",
    variations: [

    ],
  },

  {
    id: "d63-queen-s-gambit-declined-orthodox-defense-main-line",
    name: "Queen",
    eco: "D63",
    variations: [

    ],
  },

  {
    id: "d63-queen-s-gambit-declined-orthodox-defense-pillsbury-variation",
    name: "Queen",
    eco: "D63",
    variations: [

    ],
  },

  {
    id: "d63-queen-s-gambit-declined-orthodox-defense-swiss-carlsbad-variation",
    name: "Queen",
    eco: "D63",
    variations: [

    ],
  },

  {
    id: "d64-queen-s-gambit-declined-orthodox-defense-rubinstein-attack",
    name: "Queen",
    eco: "D64",
    variations: [

    ],
  },

  {
    id: "d65-queen-s-gambit-declined-orthodox-defense-rubinstein-attack",
    name: "Queen",
    eco: "D65",
    variations: [

    ],
  },

  {
    id: "d66-queen-s-gambit-declined-orthodox-defense-bd3-line",
    name: "Queen",
    eco: "D66",
    variations: [

    ],
  },

  {
    id: "d66-queen-s-gambit-declined-orthodox-defense-fianchetto-variation",
    name: "Queen",
    eco: "D66",
    variations: [

    ],
  },

  {
    id: "d67-queen-s-gambit-declined-orthodox-defense-alekhine-variation",
    name: "Queen",
    eco: "D67",
    variations: [

    ],
  },

  {
    id: "d67-queen-s-gambit-declined-orthodox-defense-bd3-line",
    name: "Queen",
    eco: "D67",
    variations: [

    ],
  },

  {
    id: "d67-queen-s-gambit-declined-orthodox-defense-capablanca-system",
    name: "Queen",
    eco: "D67",
    variations: [

    ],
  },

  {
    id: "d67-queen-s-gambit-declined-orthodox-defense-janowski-variation",
    name: "Queen",
    eco: "D67",
    variations: [

    ],
  },

  {
    id: "d67-queen-s-gambit-declined-orthodox-defense-main-line",
    name: "Queen",
    eco: "D67",
    variations: [

    ],
  },

  {
    id: "d68-queen-s-gambit-declined-orthodox-defense-classical-variation",
    name: "Queen",
    eco: "D68",
    variations: [

    ],
  },

  {
    id: "d69-queen-s-gambit-declined-orthodox-defense-classical-variation",
    name: "Queen",
    eco: "D69",
    variations: [

    ],
  },

  {
    id: "d70-neo-gr-nfeld-defense-goglidze-attack",
    name: "Neo-Grünfeld Defense: Goglidze Attack",
    eco: "D70",
    variations: [

    ],
  },

  {
    id: "d70-neo-gr-nfeld-defense-with-nf3",
    name: "Neo-Grünfeld Defense: with Nf3",
    eco: "D70",
    variations: [

    ],
  },

  {
    id: "d70-neo-gr-nfeld-defense-with-g3",
    name: "Neo-Grünfeld Defense: with g3",
    eco: "D70",
    variations: [

    ],
  },

  {
    id: "d71-neo-gr-nfeld-defense-exchange-variation",
    name: "Neo-Grünfeld Defense: Exchange Variation",
    eco: "D71",
    variations: [

    ],
  },

  {
    id: "d72-neo-gr-nfeld-defense-with-g3",
    name: "Neo-Grünfeld Defense: with g3",
    eco: "D72",
    variations: [

    ],
  },

  {
    id: "d73-neo-gr-nfeld-defense-with-g3",
    name: "Neo-Grünfeld Defense: with g3",
    eco: "D73",
    variations: [

    ],
  },

  {
    id: "d74-neo-gr-nfeld-defense-delayed-exchange-variation",
    name: "Neo-Grünfeld Defense: Delayed Exchange Variation",
    eco: "D74",
    variations: [

    ],
  },

  {
    id: "d75-neo-gr-nfeld-defense-delayed-exchange-variation",
    name: "Neo-Grünfeld Defense: Delayed Exchange Variation",
    eco: "D75",
    variations: [

    ],
  },

  {
    id: "d76-neo-gr-nfeld-defense-delayed-exchange-variation",
    name: "Neo-Grünfeld Defense: Delayed Exchange Variation",
    eco: "D76",
    variations: [

    ],
  },

  {
    id: "d77-neo-gr-nfeld-defense-classical-variation",
    name: "Neo-Grünfeld Defense: Classical Variation",
    eco: "D77",
    variations: [

    ],
  },

  {
    id: "d77-neo-gr-nfeld-defense-classical-variation-modern-defense",
    name: "Neo-Grünfeld Defense: Classical Variation, Modern Defense",
    eco: "D77",
    variations: [

    ],
  },

  {
    id: "d77-neo-gr-nfeld-defense-classical-variation-polgar-variation",
    name: "Neo-Grünfeld Defense: Classical Variation, Polgar Variation",
    eco: "D77",
    variations: [

    ],
  },

  {
    id: "d78-neo-gr-nfeld-defense-classical-variation-original-defense",
    name: "Neo-Grünfeld Defense: Classical Variation, Original Defense",
    eco: "D78",
    variations: [

    ],
  },

  {
    id: "d79-neo-gr-nfeld-defense-ultra-delayed-exchange-variation",
    name: "Neo-Grünfeld Defense: Ultra-Delayed Exchange Variation",
    eco: "D79",
    variations: [

    ],
  },

  {
    id: "d80-gr-nfeld-defense",
    name: "Grünfeld Defense",
    eco: "D80",
    variations: [

    ],
  },

  {
    id: "d80-gr-nfeld-defense-gibbon-gambit",
    name: "Grünfeld Defense: Gibbon Gambit",
    eco: "D80",
    variations: [

    ],
  },

  {
    id: "d80-gr-nfeld-defense-lundin-variation",
    name: "Grünfeld Defense: Lundin Variation",
    eco: "D80",
    variations: [

    ],
  },

  {
    id: "d80-gr-nfeld-defense-lutikov-variation",
    name: "Grünfeld Defense: Lutikov Variation",
    eco: "D80",
    variations: [

    ],
  },

  {
    id: "d80-gr-nfeld-defense-lutikov-variation-murrey-attack",
    name: "Grünfeld Defense: Lutikov Variation, Murrey Attack",
    eco: "D80",
    variations: [

    ],
  },

  {
    id: "d80-gr-nfeld-defense-stockholm-variation",
    name: "Grünfeld Defense: Stockholm Variation",
    eco: "D80",
    variations: [

    ],
  },

  {
    id: "d80-gr-nfeld-defense-zaitsev-gambit",
    name: "Grünfeld Defense: Zaitsev Gambit",
    eco: "D80",
    variations: [

    ],
  },

  {
    id: "d81-gr-nfeld-defense-russian-variation-accelerated-variation",
    name: "Grünfeld Defense: Russian Variation, Accelerated Variation",
    eco: "D81",
    variations: [

    ],
  },

  {
    id: "d82-gr-nfeld-defense-brinckmann-attack",
    name: "Grünfeld Defense: Brinckmann Attack",
    eco: "D82",
    variations: [

    ],
  },

  {
    id: "d83-gr-nfeld-defense-brinckmann-attack-gr-nfeld-gambit",
    name: "Grünfeld Defense: Brinckmann Attack, Grünfeld Gambit",
    eco: "D83",
    variations: [

    ],
  },

  {
    id: "d83-gr-nfeld-defense-brinckmann-attack-gr-nfeld-gambit-botvinnik-variation",
    name: "Grünfeld Defense: Brinckmann Attack, Grünfeld Gambit, Botvinnik Variation",
    eco: "D83",
    variations: [

    ],
  },

  {
    id: "d83-gr-nfeld-defense-brinckmann-attack-gr-nfeld-gambit-capablanca-variation",
    name: "Grünfeld Defense: Brinckmann Attack, Grünfeld Gambit, Capablanca Variation",
    eco: "D83",
    variations: [

    ],
  },

  {
    id: "d83-gr-nfeld-defense-brinckmann-attack-reshevsky-gambit",
    name: "Grünfeld Defense: Brinckmann Attack, Reshevsky Gambit",
    eco: "D83",
    variations: [

    ],
  },

  {
    id: "d84-gr-nfeld-defense-brinckmann-attack-gr-nfeld-gambit-accepted",
    name: "Grünfeld Defense: Brinckmann Attack, Grünfeld Gambit Accepted",
    eco: "D84",
    variations: [

    ],
  },

  {
    id: "d85-gr-nfeld-defense-exchange-variation",
    name: "Grünfeld Defense: Exchange Variation",
    eco: "D85",
    variations: [

    ],
  },

  {
    id: "d85-gr-nfeld-defense-exchange-variation-modern-exchange-variation",
    name: "Grünfeld Defense: Exchange Variation, Modern Exchange Variation",
    eco: "D85",
    variations: [

    ],
  },

  {
    id: "d85-gr-nfeld-defense-exchange-variation-modern-exchange-variation-kramnik-s-line",
    name: "Grünfeld Defense: Exchange Variation, Modern Exchange Variation, Kramnik",
    eco: "D85",
    variations: [

    ],
  },

  {
    id: "d85-gr-nfeld-defense-exchange-variation-modern-exchange-variation-pawn-grab-line",
    name: "Grünfeld Defense: Exchange Variation, Modern Exchange Variation, Pawn Grab Line",
    eco: "D85",
    variations: [

    ],
  },

  {
    id: "d85-gr-nfeld-defense-exchange-variation-nadanian-attack",
    name: "Grünfeld Defense: Exchange Variation, Nadanian Attack",
    eco: "D85",
    variations: [

    ],
  },

  {
    id: "d86-gr-nfeld-defense-exchange-variation-classical-variation",
    name: "Grünfeld Defense: Exchange Variation, Classical Variation",
    eco: "D86",
    variations: [

    ],
  },

  {
    id: "d86-gr-nfeld-defense-exchange-variation-larsen-variation",
    name: "Grünfeld Defense: Exchange Variation, Larsen Variation",
    eco: "D86",
    variations: [

    ],
  },

  {
    id: "d86-gr-nfeld-defense-exchange-variation-simagin-s-improved-variation",
    name: "Grünfeld Defense: Exchange Variation, Simagin",
    eco: "D86",
    variations: [

    ],
  },

  {
    id: "d86-gr-nfeld-defense-exchange-variation-simagin-s-lesser-variation",
    name: "Grünfeld Defense: Exchange Variation, Simagin",
    eco: "D86",
    variations: [

    ],
  },

  {
    id: "d87-gr-nfeld-defense-exchange-variation-seville-variation",
    name: "Grünfeld Defense: Exchange Variation, Seville Variation",
    eco: "D87",
    variations: [

    ],
  },

  {
    id: "d87-gr-nfeld-defense-exchange-variation-spassky-variation",
    name: "Grünfeld Defense: Exchange Variation, Spassky Variation",
    eco: "D87",
    variations: [

    ],
  },

  {
    id: "d88-gr-nfeld-defense-exchange-variation-spassky-variation",
    name: "Grünfeld Defense: Exchange Variation, Spassky Variation",
    eco: "D88",
    variations: [

    ],
  },

  {
    id: "d89-gr-nfeld-defense-exchange-variation-sokolsky-variation",
    name: "Grünfeld Defense: Exchange Variation, Sokolsky Variation",
    eco: "D89",
    variations: [

    ],
  },

  {
    id: "d89-gr-nfeld-defense-exchange-variation-spassky-variation",
    name: "Grünfeld Defense: Exchange Variation, Spassky Variation",
    eco: "D89",
    variations: [

    ],
  },

  {
    id: "d90-gr-nfeld-defense-flohr-variation",
    name: "Grünfeld Defense: Flohr Variation",
    eco: "D90",
    variations: [

    ],
  },

  {
    id: "d90-gr-nfeld-defense-three-knights-variation",
    name: "Grünfeld Defense: Three Knights Variation",
    eco: "D90",
    variations: [

    ],
  },

  {
    id: "d91-gr-nfeld-defense-three-knights-variation-petrosian-system",
    name: "Grünfeld Defense: Three Knights Variation, Petrosian System",
    eco: "D91",
    variations: [

    ],
  },

  {
    id: "d92-gr-nfeld-defense-three-knights-variation-hungarian-attack",
    name: "Grünfeld Defense: Three Knights Variation, Hungarian Attack",
    eco: "D92",
    variations: [

    ],
  },

  {
    id: "d93-gr-nfeld-defense-three-knights-variation-hungarian-variation",
    name: "Grünfeld Defense: Three Knights Variation, Hungarian Variation",
    eco: "D93",
    variations: [

    ],
  },

  {
    id: "d94-gr-nfeld-defense-flohr-defense",
    name: "Grünfeld Defense: Flohr Defense",
    eco: "D94",
    variations: [

    ],
  },

  {
    id: "d94-gr-nfeld-defense-makogonov-variation",
    name: "Grünfeld Defense: Makogonov Variation",
    eco: "D94",
    variations: [

    ],
  },

  {
    id: "d94-gr-nfeld-defense-opocensky-variation",
    name: "Grünfeld Defense: Opocensky Variation",
    eco: "D94",
    variations: [

    ],
  },

  {
    id: "d94-gr-nfeld-defense-smyslov-defense",
    name: "Grünfeld Defense: Smyslov Defense",
    eco: "D94",
    variations: [

    ],
  },

  {
    id: "d94-gr-nfeld-defense-three-knights-variation-burille-variation",
    name: "Grünfeld Defense: Three Knights Variation, Burille Variation",
    eco: "D94",
    variations: [

    ],
  },

  {
    id: "d94-gr-nfeld-defense-three-knights-variation-paris-variation",
    name: "Grünfeld Defense: Three Knights Variation, Paris Variation",
    eco: "D94",
    variations: [

    ],
  },

  {
    id: "d95-gr-nfeld-defense-botvinnik-variation",
    name: "Grünfeld Defense: Botvinnik Variation",
    eco: "D95",
    variations: [

    ],
  },

  {
    id: "d95-gr-nfeld-defense-pachman-variation",
    name: "Grünfeld Defense: Pachman Variation",
    eco: "D95",
    variations: [

    ],
  },

  {
    id: "d95-gr-nfeld-defense-three-knights-variation-vienna-variation",
    name: "Grünfeld Defense: Three Knights Variation, Vienna Variation",
    eco: "D95",
    variations: [

    ],
  },

  {
    id: "d96-gr-nfeld-defense-russian-variation",
    name: "Grünfeld Defense: Russian Variation",
    eco: "D96",
    variations: [

    ],
  },

  {
    id: "d97-gr-nfeld-defense-russian-variation",
    name: "Grünfeld Defense: Russian Variation",
    eco: "D97",
    variations: [

    ],
  },

  {
    id: "d97-gr-nfeld-defense-russian-variation-byrne-variation",
    name: "Grünfeld Defense: Russian Variation, Byrne Variation",
    eco: "D97",
    variations: [

    ],
  },

  {
    id: "d97-gr-nfeld-defense-russian-variation-hungarian-variation",
    name: "Grünfeld Defense: Russian Variation, Hungarian Variation",
    eco: "D97",
    variations: [

    ],
  },

  {
    id: "d97-gr-nfeld-defense-russian-variation-levenfish-variation",
    name: "Grünfeld Defense: Russian Variation, Levenfish Variation",
    eco: "D97",
    variations: [

    ],
  },

  {
    id: "d97-gr-nfeld-defense-russian-variation-prins-variation",
    name: "Grünfeld Defense: Russian Variation, Prins Variation",
    eco: "D97",
    variations: [

    ],
  },

  {
    id: "d97-gr-nfeld-defense-russian-variation-szabo-variation",
    name: "Grünfeld Defense: Russian Variation, Szabo Variation",
    eco: "D97",
    variations: [

    ],
  },

  {
    id: "d98-gr-nfeld-defense-russian-variation-keres-variation",
    name: "Grünfeld Defense: Russian Variation, Keres Variation",
    eco: "D98",
    variations: [

    ],
  },

  {
    id: "d98-gr-nfeld-defense-russian-variation-smyslov-variation",
    name: "Grünfeld Defense: Russian Variation, Smyslov Variation",
    eco: "D98",
    variations: [

    ],
  },

  {
    id: "d99-gr-nfeld-defense-russian-variation-smyslov-variation",
    name: "Grünfeld Defense: Russian Variation, Smyslov Variation",
    eco: "D99",
    variations: [

    ],
  },

  {
    id: "d99-gr-nfeld-defense-russian-variation-yugoslav-variation",
    name: "Grünfeld Defense: Russian Variation, Yugoslav Variation",
    eco: "D99",
    variations: [

    ],
  },

  {
    id: "e00-catalan-opening",
    name: "Catalan Opening",
    eco: "E00",
    variations: [

    ],
  },

  {
    id: "e00-catalan-opening-hungarian-gambit",
    name: "Catalan Opening: Hungarian Gambit",
    eco: "E00",
    variations: [

    ],
  },

  {
    id: "e00-indian-defense",
    name: "Indian Defense",
    eco: "E00",
    variations: [

    ],
  },

  {
    id: "e00-indian-defense-devin-gambit",
    name: "Indian Defense: Devin Gambit",
    eco: "E00",
    variations: [

    ],
  },

  {
    id: "e00-indian-defense-seirawan-attack",
    name: "Indian Defense: Seirawan Attack",
    eco: "E00",
    variations: [

    ],
  },

  {
    id: "e01-catalan-opening-open-defense",
    name: "Catalan Opening: Open Defense",
    eco: "E01",
    variations: [

    ],
  },

  {
    id: "e01-catalan-opening-tarrasch-defense",
    name: "Catalan Opening: Tarrasch Defense",
    eco: "E01",
    variations: [

    ],
  },

  {
    id: "e02-catalan-opening-open-defense",
    name: "Catalan Opening: Open Defense",
    eco: "E02",
    variations: [

    ],
  },

  {
    id: "e03-catalan-opening-open-defense",
    name: "Catalan Opening: Open Defense",
    eco: "E03",
    variations: [

    ],
  },

  {
    id: "e03-catalan-opening-open-defense-alekhine-variation",
    name: "Catalan Opening: Open Defense, Alekhine Variation",
    eco: "E03",
    variations: [

    ],
  },

  {
    id: "catalan",
    name: "Catalan Opening",
    eco: "E04",
    variations: [

    ],
  },

  {
    id: "e04-catalan-opening-open-defense",
    name: "Catalan Opening: Open Defense",
    eco: "E04",
    variations: [

    ],
  },

  {
    id: "e04-catalan-opening-open-defense-modern-sharp-variation",
    name: "Catalan Opening: Open Defense, Modern Sharp Variation",
    eco: "E04",
    variations: [

    ],
  },

  {
    id: "e05-catalan-opening-open-defense-classical-line",
    name: "Catalan Opening: Open Defense, Classical Line",
    eco: "E05",
    variations: [

    ],
  },

  {
    id: "e06-catalan-opening-closed",
    name: "Catalan Opening: Closed",
    eco: "E06",
    variations: [

    ],
  },

  {
    id: "e07-catalan-opening-closed",
    name: "Catalan Opening: Closed",
    eco: "E07",
    variations: [

    ],
  },

  {
    id: "e07-catalan-opening-closed-botvinnik-variation",
    name: "Catalan Opening: Closed, Botvinnik Variation",
    eco: "E07",
    variations: [

    ],
  },

  {
    id: "e08-catalan-opening-closed",
    name: "Catalan Opening: Closed",
    eco: "E08",
    variations: [

    ],
  },

  {
    id: "e08-catalan-opening-closed-spassky-gambit",
    name: "Catalan Opening: Closed, Spassky Gambit",
    eco: "E08",
    variations: [

    ],
  },

  {
    id: "e08-catalan-opening-closed-zagoryansky-variation",
    name: "Catalan Opening: Closed, Zagoryansky Variation",
    eco: "E08",
    variations: [

    ],
  },

  {
    id: "e09-catalan-opening-closed-variation-rabinovich-variation",
    name: "Catalan Opening: Closed Variation, Rabinovich Variation",
    eco: "E09",
    variations: [

    ],
  },

  {
    id: "e09-catalan-opening-closed-variation-traditional-variation",
    name: "Catalan Opening: Closed Variation, Traditional Variation",
    eco: "E09",
    variations: [

    ],
  },

  {
    id: "e09-catalan-opening-closed-main-line",
    name: "Catalan Opening: Closed, Main Line",
    eco: "E09",
    variations: [

    ],
  },

  {
    id: "e09-catalan-opening-closed-sokolsky-variation",
    name: "Catalan Opening: Closed, Sokolsky Variation",
    eco: "E09",
    variations: [

    ],
  },

  {
    id: "e10-blumenfeld-countergambit",
    name: "Blumenfeld Countergambit",
    eco: "E10",
    variations: [

    ],
  },

  {
    id: "e10-blumenfeld-countergambit-accepted",
    name: "Blumenfeld Countergambit Accepted",
    eco: "E10",
    variations: [

    ],
  },

  {
    id: "e10-blumenfeld-countergambit-duz-khotimirsky-variation",
    name: "Blumenfeld Countergambit: Duz-Khotimirsky Variation",
    eco: "E10",
    variations: [

    ],
  },

  {
    id: "e10-blumenfeld-countergambit-spielmann-variation",
    name: "Blumenfeld Countergambit: Spielmann Variation",
    eco: "E10",
    variations: [

    ],
  },

  {
    id: "e10-indian-defense-anti-nimzo-indian",
    name: "Indian Defense: Anti-Nimzo-Indian",
    eco: "E10",
    variations: [

    ],
  },

  {
    id: "e10-indian-defense-dzindzi-indian-defense",
    name: "Indian Defense: Dzindzi-Indian Defense",
    eco: "E10",
    variations: [

    ],
  },

  {
    id: "e10-indian-defense-d-ry-indian",
    name: "Indian Defense: Döry Indian",
    eco: "E10",
    variations: [

    ],
  },

  {
    id: "e11-bogo-indian-defense",
    name: "Bogo-Indian Defense",
    eco: "E11",
    variations: [

    ],
  },

  {
    id: "e11-bogo-indian-defense-exchange-variation",
    name: "Bogo-Indian Defense: Exchange Variation",
    eco: "E11",
    variations: [

    ],
  },

  {
    id: "e11-bogo-indian-defense-gr-nfeld-variation",
    name: "Bogo-Indian Defense: Grünfeld Variation",
    eco: "E11",
    variations: [

    ],
  },

  {
    id: "e11-bogo-indian-defense-haiti-variation",
    name: "Bogo-Indian Defense: Haiti Variation",
    eco: "E11",
    variations: [

    ],
  },

  {
    id: "e11-bogo-indian-defense-monticelli-trap",
    name: "Bogo-Indian Defense: Monticelli Trap",
    eco: "E11",
    variations: [

    ],
  },

  {
    id: "e11-bogo-indian-defense-new-england-variation",
    name: "Bogo-Indian Defense: New England Variation",
    eco: "E11",
    variations: [

    ],
  },

  {
    id: "e11-bogo-indian-defense-nimzowitsch-variation",
    name: "Bogo-Indian Defense: Nimzowitsch Variation",
    eco: "E11",
    variations: [

    ],
  },

  {
    id: "e11-bogo-indian-defense-retreat-variation",
    name: "Bogo-Indian Defense: Retreat Variation",
    eco: "E11",
    variations: [

    ],
  },

  {
    id: "e11-bogo-indian-defense-vitolins-variation",
    name: "Bogo-Indian Defense: Vitolins Variation",
    eco: "E11",
    variations: [

    ],
  },

  {
    id: "e11-bogo-indian-defense-wade-smyslov-variation",
    name: "Bogo-Indian Defense: Wade-Smyslov Variation",
    eco: "E11",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-variation",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-variation-botvinnik-attack",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-petrosian-variation",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-petrosian-variation-andersson-variation",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-petrosian-variation-classical-variation",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-petrosian-variation-hedgehog-variation",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-petrosian-variation-kasparov-attack",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-petrosian-variation-main-line",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-petrosian-variation-marco-defense",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-petrosian-variation-modern-variation",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-petrosian-variation-petrosian-attack",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-petrosian-variation-polovodin-gambit",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-petrosian-variation-rashkovsky-attack",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-kasparov-petrosian-variation-romanishin-attack",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-miles-variation",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-petrosian-variation",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e12-queen-s-indian-defense-petrosian-variation-farago-defense",
    name: "Queen",
    eco: "E12",
    variations: [

    ],
  },

  {
    id: "e13-queen-s-indian-defense-kasparov-variation",
    name: "Queen",
    eco: "E13",
    variations: [

    ],
  },

  {
    id: "e14-queen-s-indian-defense-with-e3",
    name: "Queen",
    eco: "E14",
    variations: [

    ],
  },

  {
    id: "e14-queen-s-indian-defense-with-e3-bb4-line",
    name: "Queen",
    eco: "E14",
    variations: [

    ],
  },

  {
    id: "e14-queen-s-indian-defense-averbakh-variation",
    name: "Queen",
    eco: "E14",
    variations: [

    ],
  },

  {
    id: "e14-queen-s-indian-defense-spassky-system",
    name: "Queen",
    eco: "E14",
    variations: [

    ],
  },

  {
    id: "e14-queen-s-indian-defense-spassky-system3",
    name: "Queen",
    eco: "E14",
    variations: [

    ],
  },

  {
    id: "e15-queen-s-indian-defense-buerger-variation",
    name: "Queen",
    eco: "E15",
    variations: [

    ],
  },

  {
    id: "e15-queen-s-indian-defense-fianchetto-variation",
    name: "Queen",
    eco: "E15",
    variations: [

    ],
  },

  {
    id: "e15-queen-s-indian-defense-fianchetto-variation-check-variation",
    name: "Queen",
    eco: "E15",
    variations: [

    ],
  },

  {
    id: "e15-queen-s-indian-defense-fianchetto-variation-check-variation-intermezzo-line",
    name: "Queen",
    eco: "E15",
    variations: [

    ],
  },

  {
    id: "e15-queen-s-indian-defense-fianchetto-variation-check-variation-modern-line",
    name: "Queen",
    eco: "E15",
    variations: [

    ],
  },

  {
    id: "e15-queen-s-indian-defense-fianchetto-variation-nimzowitsch-variation",
    name: "Queen",
    eco: "E15",
    variations: [

    ],
  },

  {
    id: "e15-queen-s-indian-defense-fianchetto-variation-nimzowitsch-variation-nimzowitsch-attack",
    name: "Queen",
    eco: "E15",
    variations: [

    ],
  },

  {
    id: "e15-queen-s-indian-defense-fianchetto-variation-nimzowitsch-variation-quiet-line",
    name: "Queen",
    eco: "E15",
    variations: [

    ],
  },

  {
    id: "e15-queen-s-indian-defense-fianchetto-variation-nimzowitsch-variation-timman-s-line",
    name: "Queen",
    eco: "E15",
    variations: [

    ],
  },

  {
    id: "e15-queen-s-indian-defense-fianchetto-variation-rubinstein-variation",
    name: "Queen",
    eco: "E15",
    variations: [

    ],
  },

  {
    id: "e15-queen-s-indian-defense-fianchetto-variation-s-misch-variation",
    name: "Queen",
    eco: "E15",
    variations: [

    ],
  },

  {
    id: "e15-queen-s-indian-defense-fianchetto-variation-traditional-line",
    name: "Queen",
    eco: "E15",
    variations: [

    ],
  },

  {
    id: "e16-queen-s-indian-defense-capablanca-variation",
    name: "Queen",
    eco: "E16",
    variations: [

    ],
  },

  {
    id: "e16-queen-s-indian-defense-riumin-variation",
    name: "Queen",
    eco: "E16",
    variations: [

    ],
  },

  {
    id: "e16-queen-s-indian-defense-yates-variation",
    name: "Queen",
    eco: "E16",
    variations: [

    ],
  },

  {
    id: "e17-queen-s-indian-defense-anti-queen-s-indian-system",
    name: "Queen",
    eco: "E17",
    variations: [

    ],
  },

  {
    id: "e17-queen-s-indian-defense-classical-variation",
    name: "Queen",
    eco: "E17",
    variations: [

    ],
  },

  {
    id: "e17-queen-s-indian-defense-classical-variation-polugaevsky-gambit",
    name: "Queen",
    eco: "E17",
    variations: [

    ],
  },

  {
    id: "e17-queen-s-indian-defense-classical-variation-taimanov-gambit",
    name: "Queen",
    eco: "E17",
    variations: [

    ],
  },

  {
    id: "e17-queen-s-indian-defense-euwe-variation",
    name: "Queen",
    eco: "E17",
    variations: [

    ],
  },

  {
    id: "e17-queen-s-indian-defense-fianchetto-variation-kramnik-variation",
    name: "Queen",
    eco: "E17",
    variations: [

    ],
  },

  {
    id: "e17-queen-s-indian-defense-opocensky-variation",
    name: "Queen",
    eco: "E17",
    variations: [

    ],
  },

  {
    id: "e17-queen-s-indian-defense-traditional-variation",
    name: "Queen",
    eco: "E17",
    variations: [

    ],
  },

  {
    id: "e18-queen-s-indian-defense-classical-variation-tiviakov-defense",
    name: "Queen",
    eco: "E18",
    variations: [

    ],
  },

  {
    id: "e18-queen-s-indian-defense-classical-variation-traditional-variation",
    name: "Queen",
    eco: "E18",
    variations: [

    ],
  },

  {
    id: "e18-queen-s-indian-defense-classical-variation-traditional-variation-nimzowitsch-line",
    name: "Queen",
    eco: "E18",
    variations: [

    ],
  },

  {
    id: "e19-queen-s-indian-defense-classical-variation-traditional-variation-main-line",
    name: "Queen",
    eco: "E19",
    variations: [

    ],
  },

  {
    id: "e20-nimzo-indian-defense",
    name: "Nimzo-Indian Defense",
    eco: "E20",
    variations: [

    ],
  },

  {
    id: "e20-nimzo-indian-defense-dilworth-gambit",
    name: "Nimzo-Indian Defense: Dilworth Gambit",
    eco: "E20",
    variations: [

    ],
  },

  {
    id: "e20-nimzo-indian-defense-kmoch-variation",
    name: "Nimzo-Indian Defense: Kmoch Variation",
    eco: "E20",
    variations: [

    ],
  },

  {
    id: "e20-nimzo-indian-defense-mikenas-attack",
    name: "Nimzo-Indian Defense: Mikenas Attack",
    eco: "E20",
    variations: [

    ],
  },

  {
    id: "e20-nimzo-indian-defense-romanishin-variation",
    name: "Nimzo-Indian Defense: Romanishin Variation",
    eco: "E20",
    variations: [

    ],
  },

  {
    id: "e20-nimzo-indian-defense-romanishin-variation-english-hybrid",
    name: "Nimzo-Indian Defense: Romanishin Variation, English Hybrid",
    eco: "E20",
    variations: [

    ],
  },

  {
    id: "nimzo-rubinstein",
    name: "Nimzo-Indian Defense: Rubinstein Variation",
    eco: "E21",
    variations: [

    ],
  },

  {
    id: "e21-nimzo-indian-defense-three-knights-variation",
    name: "Nimzo-Indian Defense: Three Knights Variation",
    eco: "E21",
    variations: [

    ],
  },

  {
    id: "e21-nimzo-indian-defense-three-knights-variation-euwe-variation",
    name: "Nimzo-Indian Defense: Three Knights Variation, Euwe Variation",
    eco: "E21",
    variations: [

    ],
  },

  {
    id: "e21-nimzo-indian-defense-three-knights-variation-korchnoi-variation",
    name: "Nimzo-Indian Defense: Three Knights Variation, Korchnoi Variation",
    eco: "E21",
    variations: [

    ],
  },

  {
    id: "e21-nimzo-indian-defense-three-knights-variation-shocron-gambit",
    name: "Nimzo-Indian Defense: Three Knights Variation, Shocron Gambit",
    eco: "E21",
    variations: [

    ],
  },

  {
    id: "e22-nimzo-indian-defense-spielmann-variation",
    name: "Nimzo-Indian Defense: Spielmann Variation",
    eco: "E22",
    variations: [

    ],
  },

  {
    id: "e23-nimzo-indian-defense-spielmann-variation-carlsbad-variation",
    name: "Nimzo-Indian Defense: Spielmann Variation, Carlsbad Variation",
    eco: "E23",
    variations: [

    ],
  },

  {
    id: "e23-nimzo-indian-defense-spielmann-variation-romanovsky-gambit",
    name: "Nimzo-Indian Defense: Spielmann Variation, Romanovsky Gambit",
    eco: "E23",
    variations: [

    ],
  },

  {
    id: "e23-nimzo-indian-defense-spielmann-variation-stahlberg-variation",
    name: "Nimzo-Indian Defense: Spielmann Variation, Stahlberg Variation",
    eco: "E23",
    variations: [

    ],
  },

  {
    id: "e24-nimzo-indian-defense-s-misch-variation",
    name: "Nimzo-Indian Defense: Sämisch Variation",
    eco: "E24",
    variations: [

    ],
  },

  {
    id: "e24-nimzo-indian-defense-s-misch-variation-botvinnik-variation",
    name: "Nimzo-Indian Defense: Sämisch Variation, Botvinnik Variation",
    eco: "E24",
    variations: [

    ],
  },

  {
    id: "e25-nimzo-indian-defense-s-misch-variation",
    name: "Nimzo-Indian Defense: Sämisch Variation",
    eco: "E25",
    variations: [

    ],
  },

  {
    id: "e25-nimzo-indian-defense-s-misch-variation-keres-variation",
    name: "Nimzo-Indian Defense: Sämisch Variation, Keres Variation",
    eco: "E25",
    variations: [

    ],
  },

  {
    id: "e25-nimzo-indian-defense-s-misch-variation-romanovsky-variation",
    name: "Nimzo-Indian Defense: Sämisch Variation, Romanovsky Variation",
    eco: "E25",
    variations: [

    ],
  },

  {
    id: "e26-nimzo-indian-defense-s-misch-variation",
    name: "Nimzo-Indian Defense: Sämisch Variation",
    eco: "E26",
    variations: [

    ],
  },

  {
    id: "e26-nimzo-indian-defense-s-misch-variation-o-kelly-variation",
    name: "Nimzo-Indian Defense: Sämisch Variation, O",
    eco: "E26",
    variations: [

    ],
  },

  {
    id: "e27-nimzo-indian-defense-s-misch-variation",
    name: "Nimzo-Indian Defense: Sämisch Variation",
    eco: "E27",
    variations: [

    ],
  },

  {
    id: "e28-nimzo-indian-defense-s-misch-variation",
    name: "Nimzo-Indian Defense: Sämisch Variation",
    eco: "E28",
    variations: [

    ],
  },

  {
    id: "e29-nimzo-indian-defense-s-misch-variation",
    name: "Nimzo-Indian Defense: Sämisch Variation",
    eco: "E29",
    variations: [

    ],
  },

  {
    id: "e29-nimzo-indian-defense-s-misch-variation-capablanca-variation",
    name: "Nimzo-Indian Defense: Sämisch Variation, Capablanca Variation",
    eco: "E29",
    variations: [

    ],
  },

  {
    id: "e30-nimzo-indian-defense-leningrad-variation",
    name: "Nimzo-Indian Defense: Leningrad Variation",
    eco: "E30",
    variations: [

    ],
  },

  {
    id: "e30-nimzo-indian-defense-leningrad-variation-averbakh-gambit",
    name: "Nimzo-Indian Defense: Leningrad Variation, Averbakh Gambit",
    eco: "E30",
    variations: [

    ],
  },

  {
    id: "e31-nimzo-indian-defense-leningrad-variation-benoni-defense",
    name: "Nimzo-Indian Defense: Leningrad Variation, Benoni Defense",
    eco: "E31",
    variations: [

    ],
  },

  {
    id: "e32-nimzo-indian-defense-classical-variation",
    name: "Nimzo-Indian Defense: Classical Variation",
    eco: "E32",
    variations: [

    ],
  },

  {
    id: "e32-nimzo-indian-defense-classical-variation-keres-defense",
    name: "Nimzo-Indian Defense: Classical Variation, Keres Defense",
    eco: "E32",
    variations: [

    ],
  },

  {
    id: "e32-nimzo-indian-defense-classical-variation-vitolins-adorjan-gambit",
    name: "Nimzo-Indian Defense: Classical Variation, Vitolins-Adorjan Gambit",
    eco: "E32",
    variations: [

    ],
  },

  {
    id: "e33-nimzo-indian-defense-classical-variation-milner-barry-variation",
    name: "Nimzo-Indian Defense: Classical Variation, Milner-Barry Variation",
    eco: "E33",
    variations: [

    ],
  },

  {
    id: "e33-nimzo-indian-defense-classical-variation-zurich-variation",
    name: "Nimzo-Indian Defense: Classical Variation, Zurich Variation",
    eco: "E33",
    variations: [

    ],
  },

  {
    id: "e34-nimzo-indian-defense-classical-variation-belyavsky-gambit",
    name: "Nimzo-Indian Defense: Classical Variation, Belyavsky Gambit",
    eco: "E34",
    variations: [

    ],
  },

  {
    id: "e34-nimzo-indian-defense-classical-variation-noa-variation",
    name: "Nimzo-Indian Defense: Classical Variation, Noa Variation",
    eco: "E34",
    variations: [

    ],
  },

  {
    id: "e35-nimzo-indian-defense-classical-variation-noa-variation",
    name: "Nimzo-Indian Defense: Classical Variation, Noa Variation",
    eco: "E35",
    variations: [

    ],
  },

  {
    id: "e36-nimzo-indian-defense-classical-variation-noa-variation",
    name: "Nimzo-Indian Defense: Classical Variation, Noa Variation",
    eco: "E36",
    variations: [

    ],
  },

  {
    id: "e36-nimzo-indian-defense-classical-variation-noa-variation-botvinnik-variation",
    name: "Nimzo-Indian Defense: Classical Variation, Noa Variation, Botvinnik Variation",
    eco: "E36",
    variations: [

    ],
  },

  {
    id: "e36-nimzo-indian-defense-classical-variation-noa-variation-main-line",
    name: "Nimzo-Indian Defense: Classical Variation, Noa Variation, Main Line",
    eco: "E36",
    variations: [

    ],
  },

  {
    id: "e36-nimzo-indian-defense-classical-variation-romanishin-gambit",
    name: "Nimzo-Indian Defense: Classical Variation, Romanishin Gambit",
    eco: "E36",
    variations: [

    ],
  },

  {
    id: "e37-nimzo-indian-defense-classical-variation-modern-variation",
    name: "Nimzo-Indian Defense: Classical Variation, Modern Variation",
    eco: "E37",
    variations: [

    ],
  },

  {
    id: "e37-nimzo-indian-defense-classical-variation-noa-variation",
    name: "Nimzo-Indian Defense: Classical Variation, Noa Variation",
    eco: "E37",
    variations: [

    ],
  },

  {
    id: "e37-nimzo-indian-defense-classical-variation-noa-variation-san-remo-variation",
    name: "Nimzo-Indian Defense: Classical Variation, Noa Variation, San Remo Variation",
    eco: "E37",
    variations: [

    ],
  },

  {
    id: "e38-nimzo-indian-defense-classical-variation-berlin-variation",
    name: "Nimzo-Indian Defense: Classical Variation, Berlin Variation",
    eco: "E38",
    variations: [

    ],
  },

  {
    id: "e38-nimzo-indian-defense-classical-variation-berlin-variation-steiner-variation",
    name: "Nimzo-Indian Defense: Classical Variation, Berlin Variation, Steiner Variation",
    eco: "E38",
    variations: [

    ],
  },

  {
    id: "e39-nimzo-indian-defense-classical-variation-berlin-variation-macieja-system",
    name: "Nimzo-Indian Defense: Classical Variation, Berlin Variation, Macieja System",
    eco: "E39",
    variations: [

    ],
  },

  {
    id: "e39-nimzo-indian-defense-classical-variation-berlin-variation-pirc-variation",
    name: "Nimzo-Indian Defense: Classical Variation, Berlin Variation, Pirc Variation",
    eco: "E39",
    variations: [

    ],
  },

  {
    id: "e40-nimzo-indian-defense-rubinstein-system",
    name: "Nimzo-Indian Defense: Rubinstein System",
    eco: "E40",
    variations: [

    ],
  },

  {
    id: "e40-nimzo-indian-defense-rubinstein-system-taimanov-variation",
    name: "Nimzo-Indian Defense: Rubinstein System, Taimanov Variation",
    eco: "E40",
    variations: [

    ],
  },

  {
    id: "e41-nimzo-indian-defense-rubinstein-system",
    name: "Nimzo-Indian Defense: Rubinstein System",
    eco: "E41",
    variations: [

    ],
  },

  {
    id: "e41-nimzo-indian-defense-rubinstein-system-h-bner-variation",
    name: "Nimzo-Indian Defense: Rubinstein System, Hübner Variation",
    eco: "E41",
    variations: [

    ],
  },

  {
    id: "e42-nimzo-indian-defense-rubinstein-system-rubinstein-variation",
    name: "Nimzo-Indian Defense: Rubinstein System, Rubinstein Variation",
    eco: "E42",
    variations: [

    ],
  },

  {
    id: "e42-nimzo-indian-defense-rubinstein-system-rubinstein-variation-main-line",
    name: "Nimzo-Indian Defense: Rubinstein System, Rubinstein Variation, Main Line",
    eco: "E42",
    variations: [

    ],
  },

  {
    id: "e42-nimzo-indian-defense-rubinstein-system-rubinstein-variation-sherbakov-attack",
    name: "Nimzo-Indian Defense: Rubinstein System, Rubinstein Variation, Sherbakov Attack",
    eco: "E42",
    variations: [

    ],
  },

  {
    id: "e43-nimzo-indian-defense-st-petersburg-variation",
    name: "Nimzo-Indian Defense: St. Petersburg Variation",
    eco: "E43",
    variations: [

    ],
  },

  {
    id: "e43-nimzo-indian-defense-st-petersburg-variation-with-ne4",
    name: "Nimzo-Indian Defense: St. Petersburg Variation, with Ne4",
    eco: "E43",
    variations: [

    ],
  },

  {
    id: "e44-nimzo-indian-defense-st-petersburg-variation",
    name: "Nimzo-Indian Defense: St. Petersburg Variation",
    eco: "E44",
    variations: [

    ],
  },

  {
    id: "e44-nimzo-indian-defense-st-petersburg-variation-american-variation",
    name: "Nimzo-Indian Defense: St. Petersburg Variation, American Variation",
    eco: "E44",
    variations: [

    ],
  },

  {
    id: "e44-nimzo-indian-defense-st-petersburg-variation-romanishin-psakhis-variation",
    name: "Nimzo-Indian Defense: St. Petersburg Variation, Romanishin-Psakhis Variation",
    eco: "E44",
    variations: [

    ],
  },

  {
    id: "e45-nimzo-indian-defense-st-petersburg-variation-fischer-variation",
    name: "Nimzo-Indian Defense: St. Petersburg Variation, Fischer Variation",
    eco: "E45",
    variations: [

    ],
  },

  {
    id: "e46-nimzo-indian-defense-normal-variation",
    name: "Nimzo-Indian Defense: Normal Variation",
    eco: "E46",
    variations: [

    ],
  },

  {
    id: "e46-nimzo-indian-defense-reshevsky-variation",
    name: "Nimzo-Indian Defense: Reshevsky Variation",
    eco: "E46",
    variations: [

    ],
  },

  {
    id: "e46-nimzo-indian-defense-simagin-variation",
    name: "Nimzo-Indian Defense: Simagin Variation",
    eco: "E46",
    variations: [

    ],
  },

  {
    id: "e47-nimzo-indian-defense-normal-variation",
    name: "Nimzo-Indian Defense: Normal Variation",
    eco: "E47",
    variations: [

    ],
  },

  {
    id: "e48-nimzo-indian-defense-normal-variation-classical-defense",
    name: "Nimzo-Indian Defense: Normal Variation, Classical Defense",
    eco: "E48",
    variations: [

    ],
  },

  {
    id: "e48-nimzo-indian-defense-ragozin-defense",
    name: "Nimzo-Indian Defense: Ragozin Defense",
    eco: "E48",
    variations: [

    ],
  },

  {
    id: "e49-nimzo-indian-defense-normal-variation-botvinnik-system",
    name: "Nimzo-Indian Defense: Normal Variation, Botvinnik System",
    eco: "E49",
    variations: [

    ],
  },

  {
    id: "e50-nimzo-indian-defense",
    name: "Nimzo-Indian Defense",
    eco: "E50",
    variations: [

    ],
  },

  {
    id: "e51-nimzo-indian-defense-normal-variation-ragozin-variation",
    name: "Nimzo-Indian Defense: Normal Variation, Ragozin Variation",
    eco: "E51",
    variations: [

    ],
  },

  {
    id: "e51-nimzo-indian-defense-normal-variation-s-misch-deferred",
    name: "Nimzo-Indian Defense: Normal Variation, Sämisch Deferred",
    eco: "E51",
    variations: [

    ],
  },

  {
    id: "e51-nimzo-indian-defense-ragozin-variation",
    name: "Nimzo-Indian Defense: Ragozin Variation",
    eco: "E51",
    variations: [

    ],
  },

  {
    id: "e52-nimzo-indian-defense-normal-variation-schlechter-defense",
    name: "Nimzo-Indian Defense: Normal Variation, Schlechter Defense",
    eco: "E52",
    variations: [

    ],
  },

  {
    id: "e53-nimzo-indian-defense-normal-variation-gligoric-system",
    name: "Nimzo-Indian Defense: Normal Variation, Gligoric System",
    eco: "E53",
    variations: [

    ],
  },

  {
    id: "e53-nimzo-indian-defense-normal-variation-gligoric-system-keres-variation",
    name: "Nimzo-Indian Defense: Normal Variation, Gligoric System, Keres Variation",
    eco: "E53",
    variations: [

    ],
  },

  {
    id: "e54-nimzo-indian-defense-normal-variation-gligoric-system-exchange-variation",
    name: "Nimzo-Indian Defense: Normal Variation, Gligoric System, Exchange Variation",
    eco: "E54",
    variations: [

    ],
  },

  {
    id: "e54-nimzo-indian-defense-normal-variation-gligoric-system-smyslov-variation",
    name: "Nimzo-Indian Defense: Normal Variation, Gligoric System, Smyslov Variation",
    eco: "E54",
    variations: [

    ],
  },

  {
    id: "e55-nimzo-indian-defense-normal-variation-gligoric-system-bronstein-variation",
    name: "Nimzo-Indian Defense: Normal Variation, Gligoric System, Bronstein Variation",
    eco: "E55",
    variations: [

    ],
  },

  {
    id: "e56-nimzo-indian-defense-normal-variation-gligoric-system-bernstein-defense",
    name: "Nimzo-Indian Defense: Normal Variation, Gligoric System, Bernstein Defense",
    eco: "E56",
    variations: [

    ],
  },

  {
    id: "e57-nimzo-indian-defense-normal-variation-gligoric-system-bernstein-defense",
    name: "Nimzo-Indian Defense: Normal Variation, Gligoric System, Bernstein Defense",
    eco: "E57",
    variations: [

    ],
  },

  {
    id: "e58-nimzo-indian-defense-normal-variation-bernstein-defense-exchange-line",
    name: "Nimzo-Indian Defense: Normal Variation, Bernstein Defense, Exchange Line",
    eco: "E58",
    variations: [

    ],
  },

  {
    id: "e59-nimzo-indian-defense-normal-variation-bernstein-defense",
    name: "Nimzo-Indian Defense: Normal Variation, Bernstein Defense",
    eco: "E59",
    variations: [

    ],
  },

  {
    id: "e60-gr-nfeld-defense-counterthrust-variation",
    name: "Grünfeld Defense: Counterthrust Variation",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-indian-defense-anti-gr-nfeld-adorjan-gambit",
    name: "Indian Defense: Anti-Grünfeld, Adorjan Gambit",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-indian-defense-anti-gr-nfeld-advance-variation",
    name: "Indian Defense: Anti-Grünfeld, Advance Variation",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-indian-defense-anti-gr-nfeld-alekhine-variation",
    name: "Indian Defense: Anti-Grünfeld, Alekhine Variation",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-indian-defense-anti-gr-nfeld-alekhine-variation-leko-gambit",
    name: "Indian Defense: Anti-Grünfeld, Alekhine Variation, Leko Gambit",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-indian-defense-anti-gr-nfeld-basman-williams-attack",
    name: "Indian Defense: Anti-Grünfeld, Basman-Williams Attack",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-indian-defense-west-indian-defense",
    name: "Indian Defense: West Indian Defense",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-king-s-indian-defense-fianchetto-variation",
    name: "King",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-king-s-indian-defense-fianchetto-variation-immediate-fianchetto",
    name: "King",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-king-s-indian-defense-normal-variation-king-s-knight-variation",
    name: "King",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-king-s-indian-defense-santasiere-variation",
    name: "King",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-king-s-indian-defense-semi-classical-variation-benoni-variation",
    name: "King",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-king-s-indian-defense-semi-classical-variation-hollywood-variation",
    name: "King",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e60-queen-s-pawn-mengarini-attack",
    name: "Queen",
    eco: "E60",
    variations: [

    ],
  },

  {
    id: "e61-king-s-indian-defense",
    name: "King",
    eco: "E61",
    variations: [

    ],
  },

  {
    id: "e61-king-s-indian-defense-fianchetto-variation-benjamin-defense",
    name: "King",
    eco: "E61",
    variations: [

    ],
  },

  {
    id: "e61-king-s-indian-defense-semi-classical-variation",
    name: "King",
    eco: "E61",
    variations: [

    ],
  },

  {
    id: "e61-king-s-indian-defense-semi-classical-variation-exchange-variation",
    name: "King",
    eco: "E61",
    variations: [

    ],
  },

  {
    id: "e61-king-s-indian-defense-semi-classical-variation-queenside-storm-line",
    name: "King",
    eco: "E61",
    variations: [

    ],
  },

  {
    id: "e61-king-s-indian-defense-smyslov-variation",
    name: "King",
    eco: "E61",
    variations: [

    ],
  },

  {
    id: "e62-king-s-indian-defense-fianchetto-variation-carlsbad-variation",
    name: "King",
    eco: "E62",
    variations: [

    ],
  },

  {
    id: "e62-king-s-indian-defense-fianchetto-variation-delayed-fianchetto",
    name: "King",
    eco: "E62",
    variations: [

    ],
  },

  {
    id: "e62-king-s-indian-defense-fianchetto-variation-kavalek-defense",
    name: "King",
    eco: "E62",
    variations: [

    ],
  },

  {
    id: "e62-king-s-indian-defense-fianchetto-variation-larsen-defense",
    name: "King",
    eco: "E62",
    variations: [

    ],
  },

  {
    id: "e62-king-s-indian-defense-fianchetto-variation-lesser-simagin-spassky",
    name: "King",
    eco: "E62",
    variations: [

    ],
  },

  {
    id: "e62-king-s-indian-defense-fianchetto-variation-simagin-variation",
    name: "King",
    eco: "E62",
    variations: [

    ],
  },

  {
    id: "e62-king-s-indian-defense-fianchetto-variation-uhlmann-szabo-system",
    name: "King",
    eco: "E62",
    variations: [

    ],
  },

  {
    id: "e63-king-s-indian-defense-fianchetto-variation-panno-variation",
    name: "King",
    eco: "E63",
    variations: [

    ],
  },

  {
    id: "e63-king-s-indian-defense-fianchetto-variation-panno-variation-blockade-line",
    name: "King",
    eco: "E63",
    variations: [

    ],
  },

  {
    id: "e63-king-s-indian-defense-fianchetto-variation-panno-variation-donner-line",
    name: "King",
    eco: "E63",
    variations: [

    ],
  },

  {
    id: "e63-king-s-indian-defense-fianchetto-variation-panno-variation-korchnoi-line",
    name: "King",
    eco: "E63",
    variations: [

    ],
  },

  {
    id: "e64-king-s-indian-defense-fianchetto-variation-double-fianchetto-attack",
    name: "King",
    eco: "E64",
    variations: [

    ],
  },

  {
    id: "e64-king-s-indian-defense-fianchetto-variation-hungarian-variation",
    name: "King",
    eco: "E64",
    variations: [

    ],
  },

  {
    id: "e64-king-s-indian-defense-fianchetto-variation-pterodactyl-variation",
    name: "King",
    eco: "E64",
    variations: [

    ],
  },

  {
    id: "e64-king-s-indian-defense-fianchetto-variation-yugoslav-system",
    name: "King",
    eco: "E64",
    variations: [

    ],
  },

  {
    id: "e64-king-s-indian-defense-fianchetto-variation-yugoslav-variation-rare-line",
    name: "King",
    eco: "E64",
    variations: [

    ],
  },

  {
    id: "e65-king-s-indian-defense-fianchetto-variation-yugoslav-variation",
    name: "King",
    eco: "E65",
    variations: [

    ],
  },

  {
    id: "e65-king-s-indian-defense-fianchetto-variation-yugoslav-variation-exchange-line",
    name: "King",
    eco: "E65",
    variations: [

    ],
  },

  {
    id: "e66-king-s-indian-defense-fianchetto-variation-yugoslav-variation-advance-line",
    name: "King",
    eco: "E66",
    variations: [

    ],
  },

  {
    id: "e67-king-s-indian-defense-fianchetto-variation-classical-fianchetto",
    name: "King",
    eco: "E67",
    variations: [

    ],
  },

  {
    id: "e67-king-s-indian-defense-fianchetto-variation-debrecen-defense",
    name: "King",
    eco: "E67",
    variations: [

    ],
  },

  {
    id: "e68-king-s-indian-defense-fianchetto-variation-classical-variation",
    name: "King",
    eco: "E68",
    variations: [

    ],
  },

  {
    id: "e68-king-s-indian-defense-fianchetto-variation-long-variation",
    name: "King",
    eco: "E68",
    variations: [

    ],
  },

  {
    id: "e69-king-s-indian-defense-fianchetto-variation-classical-main-line",
    name: "King",
    eco: "E69",
    variations: [

    ],
  },

  {
    id: "e70-king-s-indian-defense-accelerated-averbakh-variation",
    name: "King",
    eco: "E70",
    variations: [

    ],
  },

  {
    id: "e70-king-s-indian-defense-kramer-variation",
    name: "King",
    eco: "E70",
    variations: [

    ],
  },

  {
    id: "e70-king-s-indian-defense-normal-variation",
    name: "King",
    eco: "E70",
    variations: [

    ],
  },

  {
    id: "e71-king-s-indian-defense-karpov-system",
    name: "King",
    eco: "E71",
    variations: [

    ],
  },

  {
    id: "e71-king-s-indian-defense-makogonov-variation",
    name: "King",
    eco: "E71",
    variations: [

    ],
  },

  {
    id: "e72-king-s-indian-defense-normal-variation-deferred-fianchetto",
    name: "King",
    eco: "E72",
    variations: [

    ],
  },

  {
    id: "e72-king-s-indian-defense-pomar-system",
    name: "King",
    eco: "E72",
    variations: [

    ],
  },

  {
    id: "e73-king-s-indian-defense-averbakh-variation",
    name: "King",
    eco: "E73",
    variations: [

    ],
  },

  {
    id: "e73-king-s-indian-defense-averbakh-variation-flexible-defense",
    name: "King",
    eco: "E73",
    variations: [

    ],
  },

  {
    id: "e73-king-s-indian-defense-averbakh-variation-geller-defense",
    name: "King",
    eco: "E73",
    variations: [

    ],
  },

  {
    id: "e73-king-s-indian-defense-averbakh-variation-modern-defense",
    name: "King",
    eco: "E73",
    variations: [

    ],
  },

  {
    id: "e73-king-s-indian-defense-averbakh-variation-modern-defense-burgess-line",
    name: "King",
    eco: "E73",
    variations: [

    ],
  },

  {
    id: "e73-king-s-indian-defense-averbakh-variation-nc6-defense",
    name: "King",
    eco: "E73",
    variations: [

    ],
  },

  {
    id: "e73-king-s-indian-defense-averbakh-variation-spanish-defense",
    name: "King",
    eco: "E73",
    variations: [

    ],
  },

  {
    id: "e73-king-s-indian-defense-normal-variation-standard-development",
    name: "King",
    eco: "E73",
    variations: [

    ],
  },

  {
    id: "e73-king-s-indian-defense-semi-averbakh-system",
    name: "King",
    eco: "E73",
    variations: [

    ],
  },

  {
    id: "e74-king-s-indian-defense-averbakh-variation-benoni-defense",
    name: "King",
    eco: "E74",
    variations: [

    ],
  },

  {
    id: "e74-king-s-indian-defense-averbakh-variation-benoni-defense-advance-variation",
    name: "King",
    eco: "E74",
    variations: [

    ],
  },

  {
    id: "e74-king-s-indian-defense-averbakh-variation-benoni-defense-exchange-variation",
    name: "King",
    eco: "E74",
    variations: [

    ],
  },

  {
    id: "e75-king-s-indian-defense-averbakh-variation-main-line",
    name: "King",
    eco: "E75",
    variations: [

    ],
  },

  {
    id: "e76-king-s-indian-defense-four-pawns-attack",
    name: "King",
    eco: "E76",
    variations: [

    ],
  },

  {
    id: "e76-king-s-indian-defense-four-pawns-attack-dynamic-attack",
    name: "King",
    eco: "E76",
    variations: [

    ],
  },

  {
    id: "e76-king-s-indian-defense-four-pawns-attack-modern-defense",
    name: "King",
    eco: "E76",
    variations: [

    ],
  },

  {
    id: "e77-king-s-indian-defense-four-pawns-attack",
    name: "King",
    eco: "E77",
    variations: [

    ],
  },

  {
    id: "e77-king-s-indian-defense-four-pawns-attack-florentine-gambit",
    name: "King",
    eco: "E77",
    variations: [

    ],
  },

  {
    id: "e77-king-s-indian-defense-four-pawns-attack-normal-attack",
    name: "King",
    eco: "E77",
    variations: [

    ],
  },

  {
    id: "e77-king-s-indian-defense-six-pawns-attack",
    name: "King",
    eco: "E77",
    variations: [

    ],
  },

  {
    id: "e78-king-s-indian-defense-four-pawns-attack-fluid-attack",
    name: "King",
    eco: "E78",
    variations: [

    ],
  },

  {
    id: "e79-king-s-indian-defense-four-pawns-attack-exchange-variation",
    name: "King",
    eco: "E79",
    variations: [

    ],
  },

  {
    id: "e80-king-s-indian-defense-s-misch-variation",
    name: "King",
    eco: "E80",
    variations: [

    ],
  },

  {
    id: "e81-king-s-indian-defense-steiner-attack",
    name: "King",
    eco: "E81",
    variations: [

    ],
  },

  {
    id: "e81-king-s-indian-defense-s-misch-variation-bobotsov-korchnoi-petrosian-variation",
    name: "King",
    eco: "E81",
    variations: [

    ],
  },

  {
    id: "e81-king-s-indian-defense-s-misch-variation-byrne-defense",
    name: "King",
    eco: "E81",
    variations: [

    ],
  },

  {
    id: "e81-king-s-indian-defense-s-misch-variation-normal-defense",
    name: "King",
    eco: "E81",
    variations: [

    ],
  },

  {
    id: "e81-king-s-indian-defense-s-misch-variation-s-misch-gambit",
    name: "King",
    eco: "E81",
    variations: [

    ],
  },

  {
    id: "e81-king-s-indian-defense-s-misch-variation-s-misch-gambit-accepted",
    name: "King",
    eco: "E81",
    variations: [

    ],
  },

  {
    id: "e82-king-s-indian-defense-s-misch-variation-double-fianchetto",
    name: "King",
    eco: "E82",
    variations: [

    ],
  },

  {
    id: "e83-king-s-indian-defense-s-misch-variation-panno-formation",
    name: "King",
    eco: "E83",
    variations: [

    ],
  },

  {
    id: "e83-king-s-indian-defense-s-misch-variation-ruban-variation",
    name: "King",
    eco: "E83",
    variations: [

    ],
  },

  {
    id: "e83-king-s-indian-defense-s-misch-variation-yates-defense",
    name: "King",
    eco: "E83",
    variations: [

    ],
  },

  {
    id: "e84-king-s-indian-defense-s-misch-variation-panno-main-line",
    name: "King",
    eco: "E84",
    variations: [

    ],
  },

  {
    id: "e85-king-s-indian-defense-s-misch-variation-orthodox-variation",
    name: "King",
    eco: "E85",
    variations: [

    ],
  },

  {
    id: "e86-king-s-indian-defense-s-misch-variation",
    name: "King",
    eco: "E86",
    variations: [

    ],
  },

  {
    id: "e87-king-s-indian-defense-s-misch-variation-bronstein-defense",
    name: "King",
    eco: "E87",
    variations: [

    ],
  },

  {
    id: "e87-king-s-indian-defense-s-misch-variation-closed-variation",
    name: "King",
    eco: "E87",
    variations: [

    ],
  },

  {
    id: "e87-king-s-indian-defense-s-misch-variation-orthodox-variation-bronstein-variation",
    name: "King",
    eco: "E87",
    variations: [

    ],
  },

  {
    id: "e88-king-s-indian-defense-s-misch-variation-closed-variation",
    name: "King",
    eco: "E88",
    variations: [

    ],
  },

  {
    id: "e89-king-s-indian-defense-s-misch-variation-closed-variation-main-line",
    name: "King",
    eco: "E89",
    variations: [

    ],
  },

  {
    id: "e90-king-s-indian-defense-larsen-variation",
    name: "King",
    eco: "E90",
    variations: [

    ],
  },

  {
    id: "e90-king-s-indian-defense-normal-variation-rare-defenses",
    name: "King",
    eco: "E90",
    variations: [

    ],
  },

  {
    id: "e90-king-s-indian-defense-zinnowitz-variation",
    name: "King",
    eco: "E90",
    variations: [

    ],
  },

  {
    id: "e91-king-s-indian-defense-kazakh-variation",
    name: "King",
    eco: "E91",
    variations: [

    ],
  },

  {
    id: "e91-king-s-indian-defense-orthodox-variation",
    name: "King",
    eco: "E91",
    variations: [

    ],
  },

  {
    id: "e92-king-s-indian-defense-exchange-variation",
    name: "King",
    eco: "E92",
    variations: [

    ],
  },

  {
    id: "e92-king-s-indian-defense-orthodox-variation",
    name: "King",
    eco: "E92",
    variations: [

    ],
  },

  {
    id: "e92-king-s-indian-defense-orthodox-variation-gligoric-taimanov-system",
    name: "King",
    eco: "E92",
    variations: [

    ],
  },

  {
    id: "e92-king-s-indian-defense-petrosian-variation",
    name: "King",
    eco: "E92",
    variations: [

    ],
  },

  {
    id: "e92-king-s-indian-defense-petrosian-variation-stein-defense",
    name: "King",
    eco: "E92",
    variations: [

    ],
  },

  {
    id: "e93-king-s-indian-defense-petrosian-variation-keres-defense",
    name: "King",
    eco: "E93",
    variations: [

    ],
  },

  {
    id: "e93-king-s-indian-defense-petrosian-variation-normal-defense",
    name: "King",
    eco: "E93",
    variations: [

    ],
  },

  {
    id: "e94-king-s-indian-defense-orthodox-variation",
    name: "King",
    eco: "E94",
    variations: [

    ],
  },

  {
    id: "e94-king-s-indian-defense-orthodox-variation-donner-defense",
    name: "King",
    eco: "E94",
    variations: [

    ],
  },

  {
    id: "e94-king-s-indian-defense-orthodox-variation-glek-defense",
    name: "King",
    eco: "E94",
    variations: [

    ],
  },

  {
    id: "e94-king-s-indian-defense-orthodox-variation-positional-defense",
    name: "King",
    eco: "E94",
    variations: [

    ],
  },

  {
    id: "e94-king-s-indian-defense-orthodox-variation-positional-defense-closed-line",
    name: "King",
    eco: "E94",
    variations: [

    ],
  },

  {
    id: "e94-king-s-indian-defense-orthodox-variation-ukrainian-defense",
    name: "King",
    eco: "E94",
    variations: [

    ],
  },

  {
    id: "e95-king-s-indian-defense-orthodox-variation",
    name: "King",
    eco: "E95",
    variations: [

    ],
  },

  {
    id: "e96-king-s-indian-defense-orthodox-variation-positional-defense-main-line",
    name: "King",
    eco: "E96",
    variations: [

    ],
  },

  {
    id: "e97-king-s-indian-defense-orthodox-variation-aronin-taimanov-defense",
    name: "King",
    eco: "E97",
    variations: [

    ],
  },

  {
    id: "e97-king-s-indian-defense-orthodox-variation-bayonet-attack",
    name: "King",
    eco: "E97",
    variations: [

    ],
  },

  {
    id: "e97-king-s-indian-defense-orthodox-variation-bayonet-attack-sokolov-s-line",
    name: "King",
    eco: "E97",
    variations: [

    ],
  },

  {
    id: "e97-king-s-indian-defense-orthodox-variation-bayonet-attack-yepishin-s-line",
    name: "King",
    eco: "E97",
    variations: [

    ],
  },

  {
    id: "e97-king-s-indian-defense-orthodox-variation-korchnoi-attack",
    name: "King",
    eco: "E97",
    variations: [

    ],
  },

  {
    id: "e97-king-s-indian-defense-orthodox-variation-modern-system",
    name: "King",
    eco: "E97",
    variations: [

    ],
  },

  {
    id: "e98-king-s-indian-defense-orthodox-variation-classical-system",
    name: "King",
    eco: "E98",
    variations: [

    ],
  },

  {
    id: "e98-king-s-indian-defense-orthodox-variation-classical-system-kozul-gambit",
    name: "King",
    eco: "E98",
    variations: [

    ],
  },

  {
    id: "e98-king-s-indian-defense-orthodox-variation-classical-system-neo-classical-line",
    name: "King",
    eco: "E98",
    variations: [

    ],
  },

  {
    id: "e99-king-s-indian-defense-orthodox-variation-classical-system-benko-attack",
    name: "King",
    eco: "E99",
    variations: [

    ],
  },

  {
    id: "e99-king-s-indian-defense-orthodox-variation-classical-system-traditional-line",
    name: "King",
    eco: "E99",
    variations: [

    ],
  }


];

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
