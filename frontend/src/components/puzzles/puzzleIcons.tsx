import type { ReactNode } from 'react'
import {
  Target, BookOpen, Zap, Flag, Palette,
  Sun, Crosshair, Castle, Cross, ChevronUp, Crown,
  GitFork, Pin, ArrowUpRight, Eye, Gift, Ban, ArrowUp,
  Swords, DoorOpen, Meh, Music, Anchor, Shield,
  CornerDownRight,
} from 'lucide-react'

const ICON_SIZE = 28

export const CATEGORY_ICONS: Record<string, ReactNode> = {
  target: <Target size={ICON_SIZE} />,
  book: <BookOpen size={ICON_SIZE} />,
  zap: <Zap size={ICON_SIZE} />,
  flag: <Flag size={ICON_SIZE} />,
  palette: <Palette size={ICON_SIZE} />,
}

export const SUBCATEGORY_ICONS: Record<string, ReactNode> = {
  sunrise: <Sun size={ICON_SIZE} />,
  swords: <Swords size={ICON_SIZE} />,
  flag: <Flag size={ICON_SIZE} />,
  castle: <Castle size={ICON_SIZE} />,
  cross: <Cross size={ICON_SIZE} />,
  'chevron-up': <ChevronUp size={ICON_SIZE} />,
  knight: <Crosshair size={ICON_SIZE} />,
  crown: <Crown size={ICON_SIZE} />,
  'queen-rook': <Crown size={ICON_SIZE} />,
  'git-fork': <GitFork size={ICON_SIZE} />,
  pin: <Pin size={ICON_SIZE} />,
  'arrow-up-right': <ArrowUpRight size={ICON_SIZE} />,
  crosshair: <Crosshair size={ICON_SIZE} />,
  eye: <Eye size={ICON_SIZE} />,
  'double-zap': <Zap size={ICON_SIZE} />,
  target: <Target size={ICON_SIZE} />,
  gift: <Gift size={ICON_SIZE} />,
  ban: <Ban size={ICON_SIZE} />,
  'arrow-up': <ArrowUp size={ICON_SIZE} />,
  one: <Zap size={ICON_SIZE} />,
  two: <Zap size={ICON_SIZE} />,
  three: <Zap size={ICON_SIZE} />,
  four: <Zap size={ICON_SIZE} />,
  five: <Zap size={ICON_SIZE} />,
  'door-open': <DoorOpen size={ICON_SIZE} />,
  meh: <Meh size={ICON_SIZE} />,
  music: <Music size={ICON_SIZE} />,
  anchor: <Anchor size={ICON_SIZE} />,
  shield: <Shield size={ICON_SIZE} />,
  corner: <CornerDownRight size={ICON_SIZE} />,
}

export function getPuzzleIcon(iconKey: string): ReactNode | null {
  return SUBCATEGORY_ICONS[iconKey] ?? CATEGORY_ICONS[iconKey] ?? null
}
