export interface SubcategoryDef {
  key: string
  name: string
  icon: string
  theme?: string
  phase?: string
  desc: string
}

export interface CategoryDef {
  key: string
  title: string
  icon: string
  subs: SubcategoryDef[]
}

export const CATEGORIES: Record<string, CategoryDef> = {
  mix: {
    key: 'mix',
    title: 'Mix',
    icon: '🎯',
    subs: [],
  },
  phases: {
    key: 'phases',
    title: 'Fasi di Gioco',
    icon: '📚',
    subs: [
      { key: 'opening', name: 'Apertura', icon: '🌅', theme: 'opening', desc: 'Prime 12 mosse, teoria e trappole' },
      { key: 'middlegame', name: 'Mediogioco', icon: '⚔️', theme: 'middlegame', desc: 'Tattica complessa, attacchi al re' },
      { key: 'endgame', name: 'Finale', icon: '🏁', theme: 'endgame', desc: 'Tecnica di finale, promozioni' },
      { key: 'rook_endgame', name: 'Finale di Torri', icon: '🏰', theme: 'rook_endgame', desc: 'Torri vs pedoni' },
      { key: 'bishop_endgame', name: 'Finale di Alfieri', icon: '⛪', theme: 'bishop_endgame', desc: 'Alfieri stesso/opposto colore' },
      { key: 'pawn_endgame', name: 'Finale di Pedoni', icon: '♟️', theme: 'pawn_endgame', desc: 'Corse pedonali, opposizione' },
      { key: 'knight_endgame', name: 'Finale di Cavalli', icon: '🐎', theme: 'knight_endgame', desc: 'Manovre cavalli' },
      { key: 'queen_endgame', name: 'Finale di Donne', icon: '👑', theme: 'queen_endgame', desc: 'Scacco perpetuo' },
      { key: 'queen_rook_endgame', name: 'Donna + Torri', icon: '👑🏰', theme: 'queen_rook_endgame', desc: 'Finali complessi' },
    ],
  },
  motifs: {
    key: 'motifs',
    title: 'Motivi Tattici',
    icon: '⚡',
    subs: [
      { key: 'fork', name: 'Forcella', icon: '⚡', theme: 'fork', desc: 'Attacco doppio (solitamente cavallo)' },
      { key: 'pin', name: 'Inchiodatura', icon: '📌', theme: 'pin', desc: 'Pezzo inchiodato a pezzo di valore' },
      { key: 'skewer', name: 'Infilata', icon: '🔱', theme: 'skewer', desc: 'Pezzo di valore costretto a muovere' },
      { key: 'double_attack', name: 'Doppio Attacco', icon: '🎯', theme: 'double_attack', desc: 'Due minacce simultanee' },
      { key: 'discovered_attack', name: 'Attacco di Scoperta', icon: '👁', theme: 'discovered_attack', desc: 'Scoprendo un pezzo se ne attacca un altro' },
      { key: 'double_check', name: 'Doppio Scacco', icon: '⚡⚡', theme: 'double_check', desc: 'Scacco da due pezzi' },
      { key: 'exposed_king', name: 'Re Esposto', icon: '👑', theme: 'exposed_king', desc: 'Re vulnerabile ad attacchi' },
      { key: 'hanging_piece', name: 'Pezzo Sospeso', icon: '🎯', theme: 'hanging_piece', desc: 'Pezzo non difeso catturabile' },
      { key: 'kingside_attack', name: 'Attacco lato Re', icon: '⚔️', theme: 'kingside_attack', desc: 'Attacco al re arroccato' },
      { key: 'sacrifice', name: 'Sacrificio', icon: '🎁', theme: 'sacrifice', desc: 'Dare materiale per vantaggio' },
      { key: 'trapped_piece', name: 'Pezzo Intrappolato', icon: '🕸️', theme: 'trapped_piece', desc: 'Pezzo senza case di fuga' },
      { key: 'advanced_pawn', name: 'Pedone Avanzato', icon: '⬆️', theme: 'advanced_pawn', desc: 'Pedone passato minaccioso' },
    ],
  },
  mates: {
    key: 'mates',
    title: 'Scacco Matto',
    icon: '🏁',
    subs: [
      { key: 'mate_in_1', name: 'Matto in 1', icon: '1️⃣', theme: 'mate_in_1', desc: 'Matto immediato' },
      { key: 'mate_in_2', name: 'Matto in 2', icon: '2️⃣', theme: 'mate_in_2', desc: 'Matto forzato in due mosse' },
      { key: 'mate_in_3', name: 'Matto in 3', icon: '3️⃣', theme: 'mate_in_3', desc: 'Matto forzato in tre mosse' },
      { key: 'mate_in_4', name: 'Matto in 4', icon: '4️⃣', theme: 'mate_in_4', desc: 'Matto in quattro mosse' },
      { key: 'mate_in_5', name: 'Matto in 5', icon: '5️⃣', theme: 'mate_in_5', desc: 'Matto in cinque mosse' },
      { key: 'checkmate', name: 'Matto Generico', icon: '🏁', theme: 'checkmate', desc: 'Matto lunghezza variabile' },
    ],
  },
  'mate-themes': {
    key: 'mate-themes',
    title: 'Temi di Matto',
    icon: '🎨',
    subs: [
      { key: 'back_rank_mate', name: 'Matto di Rigida', icon: '🚪', theme: 'back_rank_mate', desc: 'Sulla prima traversa' },
      { key: 'smothered_mate', name: 'Matto Soffocato', icon: '😷', theme: 'smothered_mate', desc: 'Cavallo dà matto a re circondato' },
      { key: 'anastasia_mate', name: 'Matto Anastasia', icon: '👸', theme: 'anastasia_mate', desc: 'Torre + cavallo' },
      { key: 'arabian_mate', name: 'Matto Arabo', icon: '🏜️', theme: 'arabian_mate', desc: 'Torre + cavallo classico' },
      { key: 'boden_mate', name: 'Matto Boden', icon: '⛪', theme: 'boden_mate', desc: 'Due alfieri' },
      { key: 'opera_mate', name: 'Matto Opera', icon: '🎭', theme: 'opera_mate', desc: 'Dalla partita dell\'Opera' },
      { key: 'hook_mate', name: 'Matto Uncino', icon: '🪝', theme: 'hook_mate', desc: 'Torre + cavallo + pedone' },
      { key: 'vukovic_mate', name: 'Matto Vukovic', icon: '🏰', theme: 'vukovic_mate', desc: 'Torre protetta da alfiere' },
      { key: 'double_bishop_mate', name: 'Doppio Alfiere', icon: '⛪⛪', theme: 'double_bishop_mate', desc: 'Due alfieri coordinati' },
      { key: 'epaulette_mate', name: 'Matto Epaulette', icon: '🎖️', theme: 'epaulette_mate', desc: 'Re bloccato da pezzi ai lati' },
      { key: 'corner_mate', name: 'Matto d\'Angolo', icon: '📐', theme: 'corner_mate', desc: 'Matto nell\'angolo' },
    ],
  },
}

export const CATEGORY_KEYS = Object.keys(CATEGORIES)

export function getCategory(key: string): CategoryDef | undefined {
  return CATEGORIES[key]
}

export function getSubcategory(catKey: string, subKey: string): SubcategoryDef | undefined {
  return CATEGORIES[catKey]?.subs?.find(s => s.key === subKey)
}

export function getThemeLabel(theme: string): string {
  const map: Record<string, string> = {
    fork: 'Forcella',
    pin: 'Inchiodatura',
    skewer: 'Infilata',
    double_attack: 'Doppio Attacco',
    discovered_attack: 'Attacco di Scoperta',
    double_check: 'Doppio Scacco',
    exposed_king: 'Re Esposto',
    hanging_piece: 'Pezzo Sospeso',
    kingside_attack: 'Attacco lato Re',
    sacrifice: 'Sacrificio',
    trapped_piece: 'Pezzo Intrappolato',
    advanced_pawn: 'Pedone Avanzato',
    checkmate: 'Matto',
    mate_in_1: 'Matto in 1',
    mate_in_2: 'Matto in 2',
    mate_in_3: 'Matto in 3',
    mate_in_4: 'Matto in 4',
    mate_in_5: 'Matto in 5',
    opening: 'Apertura',
    middlegame: 'Mediogioco',
    endgame: 'Finale',
    rook_endgame: 'Finale di Torri',
    bishop_endgame: 'Finale di Alfieri',
    pawn_endgame: 'Finale di Pedoni',
    knight_endgame: 'Finale di Cavalli',
    queen_endgame: 'Finale di Donne',
    queen_rook_endgame: 'Donna + Torri',
    back_rank_mate: 'Matto di Rigida',
    smothered_mate: 'Matto Soffocato',
    anastasia_mate: 'Matto Anastasia',
    arabian_mate: 'Matto Arabo',
    boden_mate: 'Matto Boden',
    opera_mate: 'Matto Opera',
    hook_mate: 'Matto Uncino',
    vukovic_mate: 'Matto Vukovic',
    double_bishop_mate: 'Doppio Alfiere',
    epaulette_mate: 'Matto Epaulette',
    corner_mate: 'Matto d\'Angolo',
  }
  return map[theme] ?? theme.replace(/_/g, ' ')
}

export const MATE_THEMES = new Set([
  'checkmate',
  'mate_in_1', 'mate_in_2', 'mate_in_3', 'mate_in_4', 'mate_in_5',
  'back_rank_mate', 'smothered_mate', 'anastasia_mate', 'arabian_mate',
  'boden_mate', 'opera_mate', 'hook_mate', 'vukovic_mate',
  'double_bishop_mate', 'epaulette_mate', 'corner_mate',
])
