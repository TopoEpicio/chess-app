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
    icon: 'target',
    subs: [],
  },
  phases: {
    key: 'phases',
    title: 'Fasi di Gioco',
    icon: 'book',
    subs: [
      { key: 'opening', name: 'Apertura', icon: 'sunrise', theme: 'opening', desc: 'Prime 12 mosse, teoria e trappole' },
      { key: 'middlegame', name: 'Mediogioco', icon: 'swords', theme: 'middlegame', desc: 'Tattica complessa, attacchi al re' },
      { key: 'endgame', name: 'Finale', icon: 'flag', theme: 'endgame', desc: 'Tecnica di finale, promozioni' },
      { key: 'rook_endgame', name: 'Finale di Torri', icon: 'castle', theme: 'rook_endgame', desc: 'Torri vs pedoni' },
      { key: 'bishop_endgame', name: 'Finale di Alfieri', icon: 'cross', theme: 'bishop_endgame', desc: 'Alfieri stesso/opposto colore' },
      { key: 'pawn_endgame', name: 'Finale di Pedoni', icon: 'chevron-up', theme: 'pawn_endgame', desc: 'Corse pedonali, opposizione' },
      { key: 'knight_endgame', name: 'Finale di Cavalli', icon: 'knight', theme: 'knight_endgame', desc: 'Manovre cavalli' },
      { key: 'queen_endgame', name: 'Finale di Donne', icon: 'crown', theme: 'queen_endgame', desc: 'Scacco perpetuo' },
      { key: 'queen_rook_endgame', name: 'Donna + Torri', icon: 'queen-rook', theme: 'queen_rook_endgame', desc: 'Finali complessi' },
    ],
  },
  motifs: {
    key: 'motifs',
    title: 'Motivi Tattici',
    icon: 'zap',
    subs: [
      { key: 'fork', name: 'Forcella', icon: 'git-fork', theme: 'fork', desc: 'Attacco doppio (solitamente cavallo)' },
      { key: 'pin', name: 'Inchiodatura', icon: 'pin', theme: 'pin', desc: 'Pezzo inchiodato a pezzo di valore' },
      { key: 'skewer', name: 'Infilata', icon: 'arrow-up-right', theme: 'skewer', desc: 'Pezzo di valore costretto a muovere' },
      { key: 'double_attack', name: 'Doppio Attacco', icon: 'crosshair', theme: 'double_attack', desc: 'Due minacce simultanee' },
      { key: 'discovered_attack', name: 'Attacco di Scoperta', icon: 'eye', theme: 'discovered_attack', desc: 'Scoprendo un pezzo se ne attacca un altro' },
      { key: 'double_check', name: 'Doppio Scacco', icon: 'double-zap', theme: 'double_check', desc: 'Scacco da due pezzi' },
      { key: 'exposed_king', name: 'Re Esposto', icon: 'crown', theme: 'exposed_king', desc: 'Re vulnerabile ad attacchi' },
      { key: 'hanging_piece', name: 'Pezzo Sospeso', icon: 'target', theme: 'hanging_piece', desc: 'Pezzo non difeso catturabile' },
      { key: 'kingside_attack', name: 'Attacco lato Re', icon: 'swords', theme: 'kingside_attack', desc: 'Attacco al re arroccato' },
      { key: 'sacrifice', name: 'Sacrificio', icon: 'gift', theme: 'sacrifice', desc: 'Dare materiale per vantaggio' },
      { key: 'trapped_piece', name: 'Pezzo Intrappolato', icon: 'ban', theme: 'trapped_piece', desc: 'Pezzo senza case di fuga' },
      { key: 'advanced_pawn', name: 'Pedone Avanzato', icon: 'arrow-up', theme: 'advanced_pawn', desc: 'Pedone passato minaccioso' },
    ],
  },
  mates: {
    key: 'mates',
    title: 'Scacco Matto',
    icon: 'flag',
    subs: [
      { key: 'mate_in_1', name: 'Matto in 1', icon: 'one', theme: 'mate_in_1', desc: 'Matto immediato' },
      { key: 'mate_in_2', name: 'Matto in 2', icon: 'two', theme: 'mate_in_2', desc: 'Matto forzato in due mosse' },
      { key: 'mate_in_3', name: 'Matto in 3', icon: 'three', theme: 'mate_in_3', desc: 'Matto forzato in tre mosse' },
      { key: 'mate_in_4', name: 'Matto in 4', icon: 'four', theme: 'mate_in_4', desc: 'Matto in quattro mosse' },
      { key: 'mate_in_5', name: 'Matto in 5', icon: 'five', theme: 'mate_in_5', desc: 'Matto in cinque mosse' },
      { key: 'checkmate', name: 'Matto Generico', icon: 'flag', theme: 'checkmate', desc: 'Matto lunghezza variabile' },
    ],
  },
  'mate-themes': {
    key: 'mate-themes',
    title: 'Temi di Matto',
    icon: 'palette',
    subs: [
      { key: 'back_rank_mate', name: 'Matto di Rigida', icon: 'door-open', theme: 'back_rank_mate', desc: 'Sulla prima traversa' },
      { key: 'smothered_mate', name: 'Matto Soffocato', icon: 'meh', theme: 'smothered_mate', desc: 'Cavallo dà matto a re circondato' },
      { key: 'anastasia_mate', name: 'Matto Anastasia', icon: 'crown', theme: 'anastasia_mate', desc: 'Torre + cavallo' },
      { key: 'arabian_mate', name: 'Matto Arabo', icon: 'castle', theme: 'arabian_mate', desc: 'Torre + cavallo classico' },
      { key: 'boden_mate', name: 'Matto Boden', icon: 'cross', theme: 'boden_mate', desc: 'Due alfieri' },
      { key: 'opera_mate', name: 'Matto Opera', icon: 'music', theme: 'opera_mate', desc: 'Dalla partita dell\'Opera' },
      { key: 'hook_mate', name: 'Matto Uncino', icon: 'anchor', theme: 'hook_mate', desc: 'Torre + cavallo + pedone' },
      { key: 'vukovic_mate', name: 'Matto Vukovic', icon: 'castle', theme: 'vukovic_mate', desc: 'Torre protetta da alfiere' },
      { key: 'double_bishop_mate', name: 'Doppio Alfiere', icon: 'cross', theme: 'double_bishop_mate', desc: 'Due alfieri coordinati' },
      { key: 'epaulette_mate', name: 'Matto Epaulette', icon: 'shield', theme: 'epaulette_mate', desc: 'Re bloccato da pezzi ai lati' },
      { key: 'corner_mate', name: 'Matto d\'Angolo', icon: 'corner', theme: 'corner_mate', desc: 'Matto nell\'angolo' },
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

const MATE_THEME_KEYS = new Set([
  'mate_in_1', 'mate_in_2', 'mate_in_3', 'mate_in_4', 'mate_in_5', 'checkmate',
  'back_rank_mate', 'smothered_mate', 'anastasia_mate', 'arabian_mate',
  'boden_mate', 'opera_mate', 'hook_mate', 'vukovic_mate',
  'double_bishop_mate', 'epaulette_mate', 'corner_mate',
])

export const MATE_THEMES: ReadonlySet<string> = MATE_THEME_KEYS

export function getThemeLabel(theme: string): string {
  const labelMap: Record<string, string> = {
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
    opening: 'Apertura',
    middlegame: 'Mediogioco',
    endgame: 'Finale',
    rook_endgame: 'Finale di Torri',
    bishop_endgame: 'Finale di Alfieri',
    pawn_endgame: 'Finale di Pedoni',
    knight_endgame: 'Finale di Cavalli',
    queen_endgame: 'Finale di Donne',
    queen_rook_endgame: 'Donna + Torri',
    mate_in_1: 'Matto in 1',
    mate_in_2: 'Matto in 2',
    mate_in_3: 'Matto in 3',
    mate_in_4: 'Matto in 4',
    mate_in_5: 'Matto in 5',
    checkmate: 'Matto',
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
    corner_mate: "Matto d'Angolo",
  }
  return labelMap[theme] ?? theme
}
