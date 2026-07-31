import type { Course, Module, Lesson } from '../domain/course/types'

type Locale = 'en' | 'it' | 'es' | 'fr'

export type { Locale }

interface CourseTranslations {
  title: string
  description: string
  modules: ModuleTranslations[]
}

interface ModuleTranslations {
  title: string
  description?: string
  lessons: LessonTranslations[]
}

interface LessonTranslations {
  title: string
  content?: string
  question?: string
  options?: { text: string; correct?: boolean }[]
  hints?: string[]
}

const translations: Record<Locale, Record<string, CourseTranslations>> = {
  en: {
    'caro-kann': {
      title: 'Caro-Kann Defense',
      description: 'Master the Caro-Kann Defense (B10-B19) — one of the most solid and respected responses to 1.e4. Learn the Classical, Advance, Exchange, and Panov structures.',
      modules: [
        {
          title: 'Introduction & Basic Principles',
          description: 'Understand the Caro-Kann philosophy',
          lessons: [
            {
              title: 'Why the Caro-Kann?',
              content: `## Why the Caro-Kann?\n\nThe Caro-Kann Defense is a solid, reliable opening for Black against 1.e4. It begins with 1...c6, preparing to challenge the center with ...d5.\n\n**Key advantages:**\n- The light-squared bishop stays active outside the pawn chain\n- Few weaknesses, few quick losses\n- Structurally sound positions\n- Less theory than the Sicilian\n\n## The Basic Idea\n\nAfter 1.e4 c6 2.d4 d5, Black has a solid pawn structure that controls the center. The goal is to complete development and counterattack.`,
              hints: [
                'After 1.e4, what is the characteristic Caro-Kann move?',
                'Black wants to challenge the center on move 2',
              ],
            },
            {
              title: 'Caro-Kann Basic Moves',
              nodeId: 'caro-intro-basic',
            },
          ],
        },
        {
          title: 'Classical Variation',
          description: 'The main line after 3.Nc3',
          lessons: [
            {
              title: 'Classical Overview',
              content: `## Classical Variation (3.Nc3)\n\nAfter 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4, Black has several options:\n\n- **4...Bf5** (Classical Main)\n- **4...Nd7** (Karpov/Main Line)\n- **4...Nf6** (Bronstein)\n\nThe Classical variation is the most popular and well-studied line.`,
            },
          ],
        },
        {
          title: 'Advance Variation',
          description: 'How to handle 3.e5',
          lessons: [
            {
              title: 'Against the Advance',
              content: `## Advance Variation (3.e5)\n\nWhen White plays 3.e5, they grab space on the kingside. Black's best response is to strike at the base of the pawn chain with ...c5.\n\n**Key ideas:**\n- Play ...c5 to challenge d4\n- Develop pieces actively\n- Look for counterplay on the queenside`,
            },
          ],
        },
        {
          title: 'Exchange & Panov',
          description: 'The 3.exd5 lines',
          lessons: [
            {
              title: 'Exchange Variation',
              content: `## Exchange Variation (3.exd5 cxd5)\n\nAfter the exchange, White often plays Bd3 and c3 to build a solid center. Black equalizes with natural development: ...Nc6, ...Nf6, ...Bg4.\n\n**Key plans for Black:**\n- Develop pieces naturally\n- Trade the light-squared bishop if possible\n- Look for counterplay with ...e5`,
            },
          ],
        },
        {
          title: 'Fantasy & Other Lines',
          description: 'Rare but interesting lines',
          lessons: [
            {
              title: 'Fantasy Variation',
              content: `## Fantasy Variation (3.f3)\n\nThe Fantasy Variation is rare but interesting. After 3.f3 dxe4 4.fxe4, White has a strong center but weakens the kingside.\n\n**How to respond:**\n- Develop quickly\n- Attack the weakened kingside\n- Don't be afraid to take risks`,
            },
          ],
        },
      ],
    },
    'sicilian-najdorf': {
      title: 'Sicilian Najdorf',
      description: 'Master the Sicilian Najdorf (B90-B99) — one of the most popular and theoretically rich openings. Learn the key ideas and main lines.',
      modules: [
        {
          title: 'Introduction to the Najdorf',
          description: 'Key ideas and move order',
          lessons: [
            {
              title: 'Why Play the Najdorf?',
              content: `## Why Play the Sicilian Najdorf?\n\nThe Sicilian Najdorf (1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5 6.Bg5) is one of the most popular and theoretically rich openings in chess.\n\n**Key features:**\n- Rich strategic and tactical possibilities\n- Active piece play for Black\n- Complex middlegames\n- Trusted by world champions`,
            },
          ],
        },
      ],
    },
    'italian-game': {
      title: 'Italian Game',
      description: 'Master the Italian Game from the basics — learn the key ideas, main lines, and strategic plans.',
      modules: [
        {
          title: 'Introduction to the Italian Game',
          description: 'Understand the key ideas behind the Italian Game',
          lessons: [
            {
              title: 'Why Play the Italian Game?',
              content: `## Why Play the Italian Game?\n\nThe Italian Game (1.e4 e5 2.Nf3 Nc6 3.Bc4) is one of the oldest and most popular openings in chess. It's a great choice for players who want to learn chess principles.\n\n**Key ideas:**\n- Control the center\n- Develop pieces actively\n- Prepare for a kingside attack\n- Learn basic tactical themes`,
            },
          ],
        },
      ],
    },
  },
  it: {
    'caro-kann': {
      title: 'Difesa Caro-Kann',
      description: 'Padroneggia la Difesa Caro-Kann (B10-B19) — una delle risposte più solide e rispettate a 1.e4. Impara le strutture Classica, Advance, Exchange e Panov.',
      modules: [
        {
          title: 'Introduzione e Principi Base',
          description: 'Comprendere la filosofia della Caro-Kann',
          lessons: [
            {
              title: 'Perché la Caro-Kann?',
              content: `## Perché la Caro-Kann?\n\nLa Difesa Caro-Kann è una apertura solida e affidabile per Nero contro 1.e4. Inizia con 1...c6, preparando a sfidare il centro con ...d5.\n\n**Vantaggi principali:**\n- L'alfiere di case chiare rimane attivo fuori dalla catena di pedoni\n- Poche debolezze, poche perdite rapide\n- Posizioni strutturalmente solide\n- Meno teoria della Siciliana\n\n## L'idea di base\n\nDopo 1.e4 c6 2.d4 d5, Nero ha una struttura di pedoni solida che controlla il centro. L'obiettivo è completare lo sviluppo e controattaccare.`,
              hints: [
                'Dopo 1.e4, qual è la mossa caratteristica della Caro-Kann?',
                'Nero vuole sfidare il centro al secondo movimento',
              ],
            },
          ],
        },
      ],
    },
    'sicilian-najdorf': {
      title: 'Siciliana Najdorf',
      description: 'Padroneggia la Siciliana Najdorf (B90-B99) — una delle aperture più popolari e ricche teoricamente.',
      modules: [
        {
          title: 'Introduzione alla Najdorf',
          description: 'Idée chiave e ordine di mosse',
          lessons: [
            {
              title: 'Perché giocare la Najdorf?',
              content: `## Perché giocare la Siciliana Najdorf?\n\nLa Siciliana Najdorf (1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5 6.Bg5) è una delle aperture più popolari e ricche teoricamente negli scacchi.`,
            },
          ],
        },
      ],
    },
    'italian-game': {
      title: 'Gioco Italiano',
      description: 'Padroneggia il Gioco Italiano dalle basi — impara le idee chiave, le linee principali e i piani strategici.',
      modules: [
        {
          title: 'Introduzione al Gioco Italiano',
          description: 'Comprendere le idee chiave dietro il Gioco Italiano',
          lessons: [
            {
              title: 'Perché giocare il Gioco Italiano?',
              content: `## Perché giocare il Gioco Italiano?\n\nIl Gioco Italiano (1.e4 e5 2.Nf3 Nc6 3.Bc4) è una delle aperture più antiche e popolari negli scacchi.`,
            },
          ],
        },
      ],
    },
  },
  es: {
    'caro-kann': {
      title: 'Defensa Caro-Kann',
      description: 'Domina la Defensa Caro-Kann (B10-B19) — una de las respuestas más sólidas y respetadas a 1.e4. Aprende las estructuras Clásica, Advance, Exchange y Panov.',
      modules: [
        {
          title: 'Introducción y Principios Básicos',
          description: 'Comprende la filosofía de la Caro-Kann',
          lessons: [
            {
              title: '¿Por qué la Caro-Kann?',
              content: `## ¿Por qué la Caro-Kann?\n\nLa Defensa Caro-Kann es una apertura sólida y fiable para las Negras contra 1.e4. Comienza con 1...c6, preparando Desafiar el centro con ...d5.\n\n**Ventajas clave:**\n- El alfil de casillas claras permanece activo fuera de la cadena de peones\n- Pocas debilidades, pocas pérdidas rápidas\n- Posiciones estructuralmente sólidas\n- Menos teoría que la Siciliana`,
            },
          ],
        },
      ],
    },
    'sicilian-najdorf': {
      title: 'Siciliana Najdorf',
      description: 'Domina la Siciliana Najdorf (B90-B99) — una de las aperturas más populares y ricas teóricamente.',
      modules: [
        {
          title: 'Introducción a la Najdorf',
          description: 'Ideas clave y orden de jugadas',
          lessons: [
            {
              title: '¿Por qué jugar la Najdorf?',
              content: `## ¿Por qué jugar la Siciliana Najdorf?\n\nLa Siciliana Najdorf (1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5 6.Bg5) es una de las aperturas más populares y ricas teóricamente en ajedrez.`,
            },
          ],
        },
      ],
    },
    'italian-game': {
      title: 'Juego Italiano',
      description: 'Domina el Juego Italiano desde lo básico — aprende las ideas clave, las líneas principales y los planes estratégicos.',
      modules: [
        {
          title: 'Introducción al Juego Italiano',
          description: 'Comprende las ideas clave detrás del Juego Italiano',
          lessons: [
            {
              title: '¿Por qué jugar el Juego Italiano?',
              content: `## ¿Por qué jugar el Juego Italiano?\n\nEl Juego Italiano (1.e4 e5 2.Nf3 Nc6 3.Bc4) es una de las aperturas más antiguas y populares en ajedrez.`,
            },
          ],
        },
      ],
    },
  },
  fr: {
    'caro-kann': {
      title: 'Défense Caro-Kann',
      description: 'Maîtrisez la Défense Caro-Kann (B10-B19) — l\'une des réponses les plus solides et respectées à 1.e4. Apprenez les structures Classique, Advance, Exchange et Panov.',
      modules: [
        {
          title: 'Introduction et Principes de Base',
          description: 'Comprenez la philosophie de la Caro-Kann',
          lessons: [
            {
              title: 'Pourquoi la Caro-Kann ?',
              content: `## Pourquoi la Caro-Kann ?\n\nLa Défense Caro-Kann est une ouverture solide et fiable pour les Noirs contre 1.e4. Elle commence par 1...c6, préparant à contester le centre avec ...d5.\n\n**Avantages clés :**\n- Le fou des cases blanches reste actif hors de la chaîne de pions\n- Peu de faiblesses, peu de pertes rapides\n- Positions structurellement solides\n- Moins de théorie que la Sicilienne`,
            },
          ],
        },
      ],
    },
    'sicilian-najdorf': {
      title: 'Sicilienne Najdorf',
      description: 'Maîtrisez la Sicilienne Najdorf (B90-B99) — l\'une des ouvertures les plus populaires et riches théoriquement.',
      modules: [
        {
          title: 'Introduction à la Najdorf',
          description: 'Idées clés et ordre des coups',
          lessons: [
            {
              title: 'Pourquoi jouer la Najdorf ?',
              content: `## Pourquoi jouer la Sicilienne Najdorf ?\n\nLa Sicilienne Najdorf (1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5 6.Bg5) est l\'une des ouvertures les plus populaires et riches théoriquement aux échecs.`,
            },
          ],
        },
      ],
    },
    'italian-game': {
      title: 'Partie Italienne',
      description: 'Maîtrisez la Partie Italienne dès les bases — apprenez les idées clés, les lignes principales et les plans stratégiques.',
      modules: [
        {
          title: 'Introduction à la Partie Italienne',
          description: 'Comprenez les idées clés derrière la Partie Italienne',
          lessons: [
            {
              title: 'Pourquoi jouer la Partie Italienne ?',
              content: `## Pourquoi jouer la Partie Italienne ?\n\nLa Partie Italienne (1.e4 e5 2.Nf3 Nc6 3.Bc4) est l\'une des ouvertures les plus anciennes et les plus populaires aux échecs.`,
            },
          ],
        },
      ],
    },
  },
}

export function getCourseTranslation(courseId: string, locale: Locale): CourseTranslations | null {
  return translations[locale]?.[courseId] || null
}

export function getAvailableLocales(): Locale[] {
  return ['en', 'it', 'es', 'fr']
}
