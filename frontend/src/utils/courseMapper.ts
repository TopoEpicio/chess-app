import type { Opening } from '../data/openings'
import type { OpeningCourse, CourseSide, CourseStyle, CourseDifficulty } from '../types/studio'

interface CourseMeta {
  side: CourseSide
  style: CourseStyle
  difficulty: CourseDifficulty
  description: string
  coachNote: string
}

const COURSE_META: Record<string, CourseMeta> = {
  'italian-game': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Impara l\'Apertura Italiana, classica e solida per il Bianco.',
    coachNote: 'L\'idea centrale dell\'Italiano è puntare l\'alfiere su c4 contro f7, il punto più debole del Nero.',
  },
  'italian-giuoco-piano': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Il Giuoco Piano: sviluppo tranquillo e controllo del centro.',
    coachNote: 'Con d3 e mantieni la tensione centrale, aspettando il momento giusto per rompere.',
  },
  'italian-moller': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'L\'Attacco Møller: un gambetto aggressivo nell\'Italiana.',
    coachNote: 'Il sacrificio in d4 apre linee per un attacco diretto al re nero.',
  },
  'italian-knight-attack': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'L\'Attacco di Cavallo con Ng5 minaccia subito f7.',
    coachNote: 'Ng5 minaccia il classico attacco con Bxf7+; il Nero deve rispondere con d5.',
  },
  'italian-two-knights': {
    side: 'white', style: 'aggressivo', difficulty: 'difficile',
    description: 'La Difesa dei Due Cavalli: linea tagliente per il Bianco.',
    coachNote: 'Dopo Ng5 d5, il Bianco sacrifica un pedone per un attacco violento.',
  },
  'italian-two-knights-polish': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'La Variante Polacca della Difesa dei Due Cavalli.',
    coachNote: 'Con d4 invece di Ng5, il Bianco gioca in modo più posizionale.',
  },
  'ruy-lopez': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'La Spagnola: apertura classica per eccellenza.',
    coachNote: 'Bb5 mette pressione sul cavallo che difende e5. È un\'apertura ricchissima di piani.',
  },
  'ruy-lopez-marshall': {
    side: 'black', style: 'aggressivo', difficulty: 'difficile',
    description: 'Il Contro-Gambetto Marshall: attacco diretto al Bianco.',
    coachNote: 'Il Nero sacrifica un pedone in d5 per ottenere un attacco travolgente.',
  },
  'ruy-lopez-archangel': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Difesa Arcangelo: sviluppo armonioso del Nero.',
    coachNote: 'Bb7 fianchetto subito, puntando sulla grande diagonale.',
  },
  'ruy-lopez-steinitz': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Difesa Steinitz: solida ma passiva.',
    coachNote: 'd6 difende e5 ma blocca l\'alfiere re. Piano: ...e6, ...Nge7.',
  },
  'ruy-lopez-chigorin': {
    side: 'black', style: 'posizionale', difficulty: 'difficile',
    description: 'Difesa Chigorin: una delle linee più profonde della Spagnola.',
    coachNote: 'Il Nero manovra con Na5 e c5 per attaccare il centro bianco.',
  },
  'ruy-lopez-ziegler': {
    side: 'black', style: 'posizionale', difficulty: 'facile',
    description: 'Difesa Ziegler: sviluppo non convenzionale.',
    coachNote: 'Nge7 invece di Nf6, meno comune ma giocabile.',
  },
  'scotch-game': {
    side: 'white', style: 'tattico', difficulty: 'facile',
    description: 'La Partita Scozzese: apertura diretta e tattica.',
    coachNote: 'd4 apre il centro subito. Ottima per giocatori che amano il gioco aperto.',
  },
  'scotch-mieses': {
    side: 'white', style: 'tattico', difficulty: 'media',
    description: 'Variante Mieses della Scozzese.',
    coachNote: 'Nxc6 e e5 creano una struttura pedonale interessante.',
  },
  'scotch-classical': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Variante Classica della Scozzese.',
    coachNote: 'Bc5 sviluppa e attacca il cavallo in d4. Occhio all\'alfiere.',
  },
  'scotch-gambit': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Gambetto Scozzese: sviluppo rapido e attacco.',
    coachNote: 'Bc4 invece di Nxd4, sacrificando il pedone per sviluppo.',
  },
  'four-knights': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'La Partita dei Quattro Cavalli: sviluppo simmetrico.',
    coachNote: 'Apertura tranquilla, trova piani con Bb5 o d4.',
  },
  'kings-gambit': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Il Gambetto di Re: sacrificio per dominio centrale.',
    coachNote: 'f4 sacrifica un pedone per controllare d4 e aprire linee.',
  },
  'kings-gambit-kieseritzky': {
    side: 'white', style: 'aggressivo', difficulty: 'difficile',
    description: 'Gambetto Kieseritzky: linea tagliente del Gambetto di Re.',
    coachNote: 'h4 spinge via il pedone g e prepara Ng5.',
  },
  'kings-gambit-allgaier': {
    side: 'white', style: 'aggressivo', difficulty: 'difficile',
    description: 'Gambetto Allgaier: sacrificio di cavallo per attacco.',
    coachNote: 'Ng1 è un ritiro che sacrifica comunque il cavallo.',
  },
  'kings-gambit-muzio': {
    side: 'white', style: 'aggressivo', difficulty: 'difficile',
    description: 'Gambetto Muzio: attacco violentissimo del Bianco.',
    coachNote: 'O-O sacrifica il cavallo per tre pedoni e sviluppo massiccio.',
  },
  'kings-gambit-cunningham': {
    side: 'black', style: 'difensivo', difficulty: 'media',
    description: 'Difesa Cunningham contro il Gambetto di Re.',
    coachNote: 'Bc5 impedisce l\'arrocco e prepara ...d6.',
  },
  'philidor': {
    side: 'black', style: 'difensivo', difficulty: 'facile',
    description: 'Difesa Philidor: solida ma passiva.',
    coachNote: 'd6 difende e5 ma blocca l\'alfiere. Piano: ...Nf6, ...Be7.',
  },
  'philidor-hanham': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Variante Hanham della Philidor.',
    coachNote: 'Nd7 prepara ...c6 per sostenere d5.',
  },
  'philidor-exchange': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Variante di Scambio della Philidor.',
    coachNote: 'Qxd4 recupera il pedone ma sviluppa presto la donna.',
  },
  'petrov': {
    side: 'black', style: 'tattico', difficulty: 'media',
    description: 'Difesa Russa: simmetria e contrattacco.',
    coachNote: 'Nf6 copia la mossa del Bianco, cercando semplificazione.',
  },
  'petrov-steinitz': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Variante Steinitz della Russa.',
    coachNote: 'd4 d6 rinvia la cattura in e4.',
  },
  'petrov-three-knights': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Tre Cavalli dalla Russa.',
    coachNote: 'Nc3 cambia natura, si entra in una partita di manovra.',
  },
  'vienna-game': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Partita Viennese: sviluppo flessibile.',
    coachNote: 'Nc3 senza d4 ancora, Bianco flessibile.',
  },
  'vienna-slav': {
    side: 'black', style: 'difensivo', difficulty: 'media',
    description: 'Difesa Slav nella Viennese.',
    coachNote: 'Nero combina sviluppo con ...d5.',
  },
  'vienna-max-lange': {
    side: 'black', style: 'tattico', difficulty: 'media',
    description: 'Difesa Max Lange della Viennese.',
    coachNote: 'Bb4 inchioda il cavallo e prepara ...d5.',
  },
  'bishop-opening': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Apertura di Alfiere: semplice e diretta.',
    coachNote: 'Bc4 punta su f7. Segui con c3 e d4.',
  },
  'center-game': {
    side: 'white', style: 'tattico', difficulty: 'facile',
    description: 'Apertura di Centro: sviluppo rapido della donna.',
    coachNote: 'Qxd4 recupera subito ma la donna è esposta.',
  },
  'ponziani': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Apertura Ponziani: c3 al terzo turno.',
    coachNote: 'c3 prepara d4. Sviluppo solido ma lento.',
  },
  'evans-gambit': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Gambetto Evans: sacrificio per attacco travolgente.',
    coachNote: 'b4 sacrifica un pedone per guadagnare tempi di sviluppo.',
  },
  'evans-gambit-main': {
    side: 'white', style: 'aggressivo', difficulty: 'difficile',
    description: 'Linea Principale del Gambetto Evans.',
    coachNote: 'O-O dopo c3 e d4 apre linee per l\'attacco.',
  },
  'evans-gambit-compromised': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Difesa Compromessa del Gambetto Evans.',
    coachNote: 'Be7 invece di Ba5, più solido ma meno attivo.',
  },
  'hungarian-defense': {
    side: 'black', style: 'difensivo', difficulty: 'facile',
    description: 'Difesa Ungherese: solida ma passiva.',
    coachNote: 'Be7 è meno attivo di Bc5 ma più sicuro.',
  },
  'hungarian-defense-classical': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Variante Classica contro l\'Ungherese.',
    coachNote: 'd4 apre il centro con vantaggio di spazio.',
  },
  'greek-gift': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Gambetto Greco: attacco diretto con d4.',
    coachNote: 'O-O e d4 sacrificano per aprire linee.',
  },
  'sicilian-defense': {
    side: 'black', style: 'tattico', difficulty: 'media',
    description: 'La Siciliana: risposta asimmetrica a e4.',
    coachNote: 'c5 combatte per il centro senza simmetria. Imparala bene!',
  },
  'sicilian-open': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Siciliana Aperta: le linee principali.',
    coachNote: 'La Siciliana Aperta offre al Nero controgioco su c5 e d5.',
  },
  'sicilian-alapin': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Variante Alapin: c3 prepara d4.',
    coachNote: 'c3 è solido, Bianco costruisce un centro pedonale.',
  },
  'sicilian-grand-prix': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Attacco Grand Prix: f4 pressione su f7.',
    coachNote: 'f4 minaccia di aprire linee contro l\'arrocco nero.',
  },
  'sicilian-smith-morra': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Gambetto Smith-Morra: sacrificio per sviluppo.',
    coachNote: 'c3 e d4 offrono un pedone per sviluppo rapidissimo.',
  },
  'sicilian-accelerated-dragon': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Dragone Accelerato: fianchetto senza d6.',
    coachNote: 'g6 senza d6, più rapido ma meno solido.',
  },
  'sicilian-pin': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Variante Pin: inchiodatura del cavallo.',
    coachNote: 'Bb4 inchioda Nc3 e mette pressione.',
  },
  'sicilian-kalashnikov': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Variante Kalashnikov: e5 spinta audace.',
    coachNote: 'e5 guadagna spazio ma indebolisce d5.',
  },
  'sicilian-sveshnikov': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Variante Sveshnikov: una delle più taglienti.',
    coachNote: 'e5 spinge subito. La struttura pedonale è molto complessa.',
  },
  'sicilian-prins': {
    side: 'white', style: 'aggressivo', difficulty: 'difficile',
    description: 'Variante Prins: attacco con Qd3.',
    coachNote: 'Bg5 e Qd3 preparano un attacco diretto.',
  },
  'sicilian-owsl': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Variante OWSM: sviluppo classico.',
    coachNote: 'Bg5 è la mossa classica, inchioda il cavallo.',
  },
  'french-defense': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Difesa Francese: solida e posizionale.',
    coachNote: 'e6 senza d5 subito. Preparati per la catena pedonale.',
  },
  'french-classical': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Variante Classica della Francese.',
    coachNote: 'Nf6 attacca subito e4 con la catena.',
  },
  'french-winawer': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Variante Winawer: inchiodatura del cavallo.',
    coachNote: 'Bb4 crea tensioni. Una delle linee più taglienti.',
  },
  'french-advance': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Variante Avanzata della Francese.',
    coachNote: 'e5 blocca il centro. Bianco ha spazio.',
  },
  'french-tarrasch': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Variante Tarrasch: Nd2 evita l\'inchiodatura.',
    coachNote: 'Nd2 preserva l\'alfiere. Sviluppo solido.',
  },
  'french-exchange': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Variante di Scambio della Francese.',
    coachNote: 'exd5 semplifica. Pari e patte.',
  },
  'french-rubinstein': {
    side: 'black', style: 'posizionale', difficulty: 'facile',
    description: 'Variante Rubinstein: semplificazione.',
    coachNote: 'dxe4 semplifica subito il centro.',
  },
  'french-macCutcheon': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Variante MacCutcheon: attacco audace.',
    coachNote: 'Bb4 dopo Nf6, doppia inchiodatura.',
  },
  'french-steinitz': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Variante Steinitz: e5 blocca.',
    coachNote: 'e5 guadagna spazio. Ora attacca.',
  },
  'caro-kann': {
    side: 'black', style: 'posizionale', difficulty: 'facile',
    description: 'Difesa Caro-Kann: c6 per sostenere d5.',
    coachNote: 'c6 prepara d5 senza bloccare l\'alfiere.',
  },
  'caro-kann-classical': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Variante Classica della Caro-Kann.',
    coachNote: 'Bf5 sviluppa prima di ...e6.',
  },
  'caro-kann-advance': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Variante Avanzata della Caro-Kann.',
    coachNote: 'e5 spazio. Attenzione a ...c5.',
  },
  'caro-kann-exchange': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Variante di Scambio della Caro-Kann.',
    coachNote: 'exd5 apre per il Bianco.',
  },
  'caro-kann-panov': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Attacco Panov-Botvinnik: c4 aggressiva.',
    coachNote: 'c4 attacca il centro e apre linee.',
  },
  'caro-kann-gurgenidze': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Sistema Gurgenidze: b5 sorprendente.',
    coachNote: 'b5 punta ad attaccare sull\'ala di donna.',
  },
  'caro-kann-two-knights': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Variante dei Due Cavalli.',
    coachNote: 'Nc3 e Nf3, sviluppo classico della Caro-Kann.',
  },
  'pirc-defense': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Difesa Pirc: fianchetto del re.',
    coachNote: 'd6 e Nf6 prima del fianchetto. Attacco differito.',
  },
  'pirc-austrian': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Attacco Austriaco contro la Pirc.',
    coachNote: 'f4 attacco diretto contro la Pirc.',
  },
  'pirc-classical': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Variante Classica contro la Pirc.',
    coachNote: 'Sviluppo classico con Nf3 e Be2.',
  },
  'modern-defense': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Difesa Moderna: g6 e Bg7.',
    coachNote: 'g6 prima di ...d6 o ...Nf6. Ipermoderna.',
  },
  'modern-pseudo-austrian': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Pseudo-Austriaco contro la Moderna.',
    coachNote: 'f4 attacco diretto.',
  },
  'modern-averbakh': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Sistema Averbakh contro la Moderna.',
    coachNote: 'c4 controllo centrale.',
  },
  'alekhine-defense': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Difesa Alekhine: provocazione.',
    coachNote: 'Nf6 provoca e5 per poi minare il centro.',
  },
  'alekhine-chasin': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Variante Chasin dell\'Alekhine.',
    coachNote: 'e6 prepara ...d6.',
  },
  'alekhine-four-pawns': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Attacco dei Quattro Pedoni.',
    coachNote: 'f4 max espansione.',
  },
  'alekhine-exchange': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Variante di Scambio.',
    coachNote: 'exd6 semplifica.',
  },
  'scandinavian-defense': {
    side: 'black', style: 'tattico', difficulty: 'facile',
    description: 'Difesa Scandinava: d5 immediato.',
    coachNote: 'd5 attacca subito e4. La donna esce ma è sicura.',
  },
  'queens-gambit': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Il Gambetto di Donna: apertura classica.',
    coachNote: 'c4 attacca il centro. Il pedone è recuperabile.',
  },
  'queens-gambit-accepted': {
    side: 'black', style: 'tattico', difficulty: 'media',
    description: 'Gambetto di Donna Accettato.',
    coachNote: 'dxc4 prende il pedone ma perde il centro.',
  },
  'queens-gambit-declined': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Gambetto di Donna Declinato: solido.',
    coachNote: 'e6 sorregge d5. La difesa più solida del QG.',
  },
  'queens-gambit-cambridge-springs': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Cambridge Springs: contrattacco.',
    coachNote: 'Qa5 inchioda e attacca.',
  },
  'queens-gambit-vienna': {
    side: 'black', style: 'posizionale', difficulty: 'difficile',
    description: 'Variante Vienna del QGD.',
    coachNote: 'Bb4 inchioda il cavallo.',
  },
  'queens-gambit-semi-tarrasch': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Semi-Tarrasch: c5 attivo.',
    coachNote: 'c5 combatte per il centro.',
  },
  'queens-gambit-tarrasch': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Difesa Tarrasch: c5 sfida.',
    coachNote: 'c5 sfida il centro bianco.',
  },
  'queens-gambit-chigorin': {
    side: 'black', style: 'tattico', difficulty: 'media',
    description: 'Difesa Chigorin: Nc6 originale.',
    coachNote: 'Nc6 sviluppa senza e6.',
  },
  'slav-defense': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Difesa Slav: c6 senza e6.',
    coachNote: 'c6 difende d5 senza bloccare l\'alfiere.',
  },
  'slav-botvinnik': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Variante Botvinnik della Slav.',
    coachNote: 'Complessa variante con sacrifici.',
  },
  'slav-krause': {
    side: 'black', style: 'posizionale', difficulty: 'facile',
    description: 'Variante Krause della Slav.',
    coachNote: 'Bf5 sviluppa l\'alfiere fuori dalla catena.',
  },
  'slav-chebanenko': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Variante Chebanenko: a6.',
    coachNote: 'a6 prepara ...b5.',
  },
  'slav-winawer': {
    side: 'black', style: 'tattico', difficulty: 'media',
    description: 'Controgambetto Winawer: e5.',
    coachNote: 'e5 rompe subito il centro.',
  },
  'queens-indian': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Difesa Indiana di Donna.',
    coachNote: 'b6 fianchetto sul lato di donna.',
  },
  'queens-indian-classical': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Variante Classica (e3).',
    coachNote: 'e3 sviluppa con Bd3.',
  },
  'queens-indian-petrosian': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Variante Petrosian: a3.',
    coachNote: 'a3 previene ...Bb4.',
  },
  'nimzo-indian': {
    side: 'black', style: 'posizionale', difficulty: 'difficile',
    description: 'Difesa Nimzo-Indiana: inchiodatura.',
    coachNote: 'Bb4 inchioda il cavallo. Una delle più profonde.',
  },
  'nimzo-samisch': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Variante Sämisch: doppio pedone.',
    coachNote: 'a3 e bxc3, doppio pedone ma coppia degli alfieri.',
  },
  'nimzo-rubinstein': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Variante Rubinstein: e3.',
    coachNote: 'e3 solido, evita complicazioni.',
  },
  'nimzo-classical': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Variante Classica: Qc2.',
    coachNote: 'Qc2 difende il cavallo senza inchiodatura.',
  },
  'kings-indian': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Difesa Indiana di Re: fianchetto dinamico.',
    coachNote: 'g6 e Bg7, attacco differito sul centro.',
  },
  'kings-indian-attack': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Attacco Indiano di Re contro qualsiasi.',
    coachNote: 'Nf3 g3 Bg7. Sistematico contro tutto.',
  },
  'kid-bayonet': {
    side: 'white', style: 'aggressivo', difficulty: 'difficile',
    description: 'Attacco Bayonet: b4.',
    coachNote: 'b4 attacca sull\'ala di donna.',
  },
  'kid-averbakh': {
    side: 'white', style: 'posizionale', difficulty: 'difficile',
    description: 'Variante Averbakh: Bg5.',
    coachNote: 'Bg5 inchioda.',
  },
  'kid-panno': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Variante Panno: Nc6.',
    coachNote: 'Nc6 sviluppo attivo.',
  },
  'kings-indian-vs-colle': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Indiana di Re contro il Colle.',
    coachNote: 'g6 fianchetto.',
  },
  'grunfeld': {
    side: 'black', style: 'tattico', difficulty: 'difficile',
    description: 'Difesa Grünfeld: d5 provocatorio.',
    coachNote: 'd5 sfida subito il centro bianco.',
  },
  'grunfeld-three-knights': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Tre Cavalli contro la Grünfeld.',
    coachNote: 'Nf3 senza e4 ancora.',
  },
  'benoni': {
    side: 'black', style: 'tattico', difficulty: 'media',
    description: 'Difesa Benoni: asimmetrica.',
    coachNote: 'c5 rompe il centro.',
  },
  'benoni-classical': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Variante Classica della Benoni.',
    coachNote: 'Sviluppo classico.',
  },
  'benoni-fianchetto': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Fianchetto contro la Benoni.',
    coachNote: 'g3 fianchetto.',
  },
  'czech-benoni': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Benoni Ceca: e5.',
    coachNote: 'e5 blocca.',
  },
  'dutch-defense': {
    side: 'black', style: 'tattico', difficulty: 'media',
    description: 'Difesa Olandese: f5.',
    coachNote: 'f5 controlla e4.',
  },
  'dutch-staunton': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Gambetto Staunton: e4.',
    coachNote: 'e4 attacco diretto.',
  },
  'dutch-classical': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Variante Classica.',
    coachNote: 'Sviluppo solido.',
  },
  'english-opening': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Apertura Inglese: flessibile.',
    coachNote: 'c4 senza d4, massima flessibilità.',
  },
  'english-symmetrical': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Simmetrica: c5.',
    coachNote: 'c5 copia il Bianco.',
  },
  'english-four-knights': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Quattro Cavalli Inglese.',
    coachNote: 'Sviluppo normale con e5.',
  },
  'english-kings': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Inglese del Re: c4 e5.',
    coachNote: 'c4 e5, ibrido.',
  },
  'english-dragon': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Dragone Inglese.',
    coachNote: 'g6 fianchetto.',
  },
  'reti-opening': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Apertura Réti: ipermoderna.',
    coachNote: 'Nf3 e poi fianchetto.',
  },
  'london-system': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Sistema Londra: semplice e robusto.',
    coachNote: 'Bf4 indipendente da ...d5. Sistema universale.',
  },
  'london-system-main': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Linea Principale del Sistema Londra.',
    coachNote: 'e3 e c3 costruiscono un muro.',
  },
  'colle-system': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Sistema Colle: e3 e Bd3.',
    coachNote: 'e3 e sviluppo classico.',
  },
  'veresov': {
    side: 'white', style: 'tattico', difficulty: 'media',
    description: 'Attacco Veresov: Nc3 e Bg5.',
    coachNote: 'Nc3 e Bg5 senza d4.',
  },
  'blackmar-diemer': {
    side: 'white', style: 'aggressivo', difficulty: 'media',
    description: 'Gambetto Blackmar-Diemer.',
    coachNote: 'e4 e Nc3 sacrificano.',
  },
  'bird-opening': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Apertura Bird: f4.',
    coachNote: 'f4 olandese rovesciato.',
  },
  'benko-gambit': {
    side: 'black', style: 'aggressivo', difficulty: 'media',
    description: 'Gambetto Benko: sacrificio di pedone.',
    coachNote: 'b5 sacrificio per iniziativa.',
  },
  'budapest-gambit': {
    side: 'black', style: 'tattico', difficulty: 'media',
    description: 'Gambetto Budapest: e5.',
    coachNote: 'e5 gambetto.',
  },
  'albin-countergambit': {
    side: 'black', style: 'aggressivo', difficulty: 'media',
    description: 'Controgambetto Albin: e5.',
    coachNote: 'e5 sorpresa.',
  },
  'englund-gambit': {
    side: 'black', style: 'aggressivo', difficulty: 'facile',
    description: 'Gambetto Englund: e5.',
    coachNote: 'e5 semplice.',
  },
  'polish-opening': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Apertura Polacca: b4.',
    coachNote: 'b4 fianchetto.',
  },
  'orangs-outang': {
    side: 'white', style: 'aggressivo', difficulty: 'facile',
    description: 'Apertura Orangutan: b4.',
    coachNote: 'b4 originale.',
  },
  'larsen-opening': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Apertura Larsen: b3.',
    coachNote: 'b3 fianchetto.',
  },
  'grob-opening': {
    side: 'white', style: 'aggressivo', difficulty: 'facile',
    description: 'Apertura Grob: g4.',
    coachNote: 'g4 aggressiva.',
  },
  'ware-opening': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Apertura Ware: a4.',
    coachNote: 'a4 laterale.',
  },
  'hungarian-opening': {
    side: 'white', style: 'posizionale', difficulty: 'facile',
    description: 'Apertura Ungherese: g3.',
    coachNote: 'g3 fianchetto.',
  },
  'old-indian': {
    side: 'black', style: 'posizionale', difficulty: 'facile',
    description: 'Indiana Vecchia: d6.',
    coachNote: 'd6 senza fianchetto.',
  },
  'trompowsky': {
    side: 'white', style: 'tattico', difficulty: 'media',
    description: 'Attacco Trompowsky: Bg5.',
    coachNote: 'Bg5 inchioda subito.',
  },
  'catalan': {
    side: 'white', style: 'posizionale', difficulty: 'media',
    description: 'Apertura Catalana: g3.',
    coachNote: 'g3 e Bg2, pressione sull\'ala di donna.',
  },
  'bogo-indian': {
    side: 'black', style: 'posizionale', difficulty: 'media',
    description: 'Difesa Bogo-Indiana: Bb4+.',
    coachNote: 'Bb4+ dà scacco.',
  },
}

function inferSide(fen: string): CourseSide {
  return fen.includes(' w ') ? 'white' : 'black'
}

function inferStyle(id: string): CourseStyle {
  return COURSE_META[id]?.style ?? 'posizionale'
}

function inferDifficulty(id: string): CourseDifficulty {
  return COURSE_META[id]?.difficulty ?? 'media'
}

function inferDescription(id: string, name: string): string {
  return COURSE_META[id]?.description ?? `Corso su ${name}.`
}

function inferCoachNote(id: string): string {
  return COURSE_META[id]?.coachNote ?? 'Studia le varianti principali e i piani tipici.'
}

const COURSES_BY_SIDE: Record<string, CourseSide> = {
  'french-defense': 'black',
  'french-classical': 'black',
  'french-winawer': 'black',
  'french-advance': 'black',
  'french-tarrasch': 'black',
  'french-exchange': 'black',
  'french-rubinstein': 'black',
  'french-macCutcheon': 'black',
  'french-steinitz': 'black',
  'caro-kann': 'black',
  'caro-kann-classical': 'black',
  'caro-kann-advance': 'black',
  'caro-kann-exchange': 'black',
  'caro-kann-panov': 'black',
  'caro-kann-gurgenidze': 'black',
  'caro-kann-two-knights': 'black',
  'sicilian-defense': 'black',
  'sicilian-open': 'black',
  'sicilian-alapin': 'black',
  'sicilian-grand-prix': 'black',
  'sicilian-smith-morra': 'black',
  'sicilian-accelerated-dragon': 'black',
  'sicilian-pin': 'black',
  'sicilian-kalashnikov': 'black',
  'sicilian-sveshnikov': 'black',
  'sicilian-prins': 'black',
  'sicilian-owsl': 'black',
  'pirc-defense': 'black',
  'pirc-austrian': 'black',
  'pirc-classical': 'black',
  'modern-defense': 'black',
  'modern-pseudo-austrian': 'black',
  'modern-averbakh': 'black',
  'alekhine-defense': 'black',
  'alekhine-chasin': 'black',
  'alekhine-four-pawns': 'black',
  'alekhine-exchange': 'black',
  'scandinavian-defense': 'black',
  'queens-gambit': 'white',
  'queens-gambit-accepted': 'white',
  'queens-gambit-declined': 'white',
  'queens-gambit-cambridge-springs': 'white',
  'queens-gambit-vienna': 'white',
  'queens-gambit-semi-tarrasch': 'white',
  'queens-gambit-tarrasch': 'white',
  'queens-gambit-chigorin': 'white',
  'slav-defense': 'black',
  'slav-botvinnik': 'black',
  'slav-krause': 'black',
  'slav-chebanenko': 'black',
  'slav-winawer': 'black',
  'queens-indian': 'black',
  'queens-indian-classical': 'black',
  'queens-indian-petrosian': 'black',
  'nimzo-indian': 'black',
  'nimzo-samisch': 'black',
  'nimzo-rubinstein': 'black',
  'nimzo-classical': 'black',
  'kings-indian': 'black',
  'kings-indian-attack': 'white',
  'kid-bayonet': 'white',
  'kid-averbakh': 'white',
  'kid-panno': 'white',
  'kings-indian-vs-colle': 'black',
  'grunfeld': 'black',
  'grunfeld-three-knights': 'black',
  'benoni': 'black',
  'benoni-classical': 'black',
  'benoni-fianchetto': 'black',
  'czech-benoni': 'black',
  'dutch-defense': 'black',
  'dutch-staunton': 'black',
  'dutch-classical': 'black',
  'english-opening': 'white',
  'english-symmetrical': 'black',
  'english-four-knights': 'white',
  'english-kings': 'white',
  'english-dragon': 'white',
  'philidor': 'black',
  'philidor-hanham': 'black',
  'philidor-exchange': 'white',
  'petrov': 'black',
  'petrov-steinitz': 'black',
  'petrov-three-knights': 'white',
  'vienna-game': 'white',
  'vienna-slav': 'white',
  'vienna-max-lange': 'white',
  'evans-gambit': 'white',
  'evans-gambit-main': 'white',
  'evans-gambit-compromised': 'white',
  'hungarian-defense': 'black',
  'hungarian-defense-classical': 'black',
  'greek-gift': 'white',
  'scotch-game': 'white',
  'scotch-mieses': 'white',
  'scotch-classical': 'white',
  'scotch-gambit': 'white',
  'italian-game': 'white',
  'italian-giuoco-piano': 'white',
  'italian-moller': 'white',
  'italian-knight-attack': 'white',
  'italian-two-knights': 'white',
  'italian-two-knights-polish': 'white',
  'ruy-lopez': 'white',
  'ruy-lopez-marshall': 'black',
  'ruy-lopez-archangel': 'black',
  'ruy-lopez-steinitz': 'black',
  'ruy-lopez-chigorin': 'black',
  'ruy-lopez-ziegler': 'black',
  'bishop-opening': 'white',
  'center-game': 'white',
  'ponziani': 'white',
  'four-knights': 'white',
  'kings-gambit': 'white',
  'kings-gambit-kieseritzky': 'white',
  'kings-gambit-allgaier': 'white',
  'kings-gambit-muzio': 'white',
  'kings-gambit-cunningham': 'black',
  'london-system': 'white',
  'catalan': 'white',
  'reti-opening': 'white',
  'colle-system': 'white',
  'veresov': 'white',
  'blackmar-diemer': 'white',
  'bird-opening': 'white',
  'benko-gambit': 'black',
  'budapest-gambit': 'black',
  'albin-countergambit': 'black',
  'englund-gambit': 'black',
  'polish-opening': 'white',
  'orangs-outang': 'white',
  'larsen-opening': 'white',
  'grob-opening': 'white',
  'ware-opening': 'white',
  'hungarian-opening': 'white',
  'old-indian': 'black',
  'trompowsky': 'white',
  'bogo-indian': 'black',
}

export function mapOpeningToCourse(opening: Opening): OpeningCourse {
  const id = opening.id
  return {
    id,
    name: opening.name,
    eco: opening.eco ?? '',
    side: COURSES_BY_SIDE[id] ?? inferSide(opening.fen),
    style: inferStyle(id),
    difficulty: inferDifficulty(id),
    description: inferDescription(id, opening.name),
    thumbnailId: id,
    coachNote: inferCoachNote(id),
    variations: opening.variations.map((v) => ({
      id: `${id}-${v.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: v.name,
      moves: v.moves,
      fen: v.fen,
    })),
  }
}

export function mapOpeningsToCourses(openings: Opening[]): OpeningCourse[] {
  return openings.map(mapOpeningToCourse)
}

const FAMILY_PREFIXES: { prefix: string; nameKey: string }[] = [
  { prefix: 'kings-gambit', nameKey: 'family.kingsGambit' },
  { prefix: 'kings-indian', nameKey: 'family.kingsIndian' },
  { prefix: 'queens-indian', nameKey: 'family.queensIndian' },
  { prefix: 'queens-gambit', nameKey: 'family.queensGambit' },
  { prefix: 'ruy-lopez', nameKey: 'family.ruyLopez' },
  { prefix: 'caro-kann', nameKey: 'family.caroKann' },
  { prefix: 'four-knights', nameKey: 'family.fourKnights' },
  { prefix: 'hungarian-opening', nameKey: 'family.hungarian' },
  { prefix: 'hungarian-defense', nameKey: 'family.hungarian' },
  { prefix: 'old-indian', nameKey: 'family.oldIndian' },
  { prefix: 'sicilian', nameKey: 'family.sicilian' },
  { prefix: 'italian', nameKey: 'family.italian' },
  { prefix: 'scotch', nameKey: 'family.scotch' },
  { prefix: 'vienna', nameKey: 'family.vienna' },
  { prefix: 'philidor', nameKey: 'family.philidor' },
  { prefix: 'petrov', nameKey: 'family.petrov' },
  { prefix: 'french', nameKey: 'family.french' },
  { prefix: 'caro', nameKey: 'family.caroKann' },
  { prefix: 'pirc', nameKey: 'family.pirc' },
  { prefix: 'modern', nameKey: 'family.modern' },
  { prefix: 'alekhine', nameKey: 'family.alekhine' },
  { prefix: 'scandinavian', nameKey: 'family.scandinavian' },
  { prefix: 'slav', nameKey: 'family.slav' },
  { prefix: 'nimzo', nameKey: 'family.nimzo' },
  { prefix: 'bogo', nameKey: 'family.bogo' },
  { prefix: 'grunfeld', nameKey: 'family.grunfeld' },
  { prefix: 'benoni', nameKey: 'family.benoni' },
  { prefix: 'dutch', nameKey: 'family.dutch' },
  { prefix: 'english', nameKey: 'family.english' },
  { prefix: 'reti', nameKey: 'family.reti' },
  { prefix: 'london', nameKey: 'family.london' },
  { prefix: 'colle', nameKey: 'family.colle' },
  { prefix: 'veresov', nameKey: 'family.veresov' },
  { prefix: 'blackmar', nameKey: 'family.blackmar' },
  { prefix: 'bird', nameKey: 'family.bird' },
  { prefix: 'benko', nameKey: 'family.benko' },
  { prefix: 'budapest', nameKey: 'family.budapest' },
  { prefix: 'albin', nameKey: 'family.albin' },
  { prefix: 'englund', nameKey: 'family.englund' },
  { prefix: 'polish', nameKey: 'family.polish' },
  { prefix: 'larsen', nameKey: 'family.larsen' },
  { prefix: 'grob', nameKey: 'family.grob' },
  { prefix: 'ware', nameKey: 'family.ware' },
  { prefix: 'hungarian', nameKey: 'family.hungarian' },
  { prefix: 'bishop', nameKey: 'family.bishop' },
  { prefix: 'center', nameKey: 'family.center' },
  { prefix: 'ponziani', nameKey: 'family.ponziani' },
  { prefix: 'evans', nameKey: 'family.evans' },
  { prefix: 'four', nameKey: 'family.fourKnights' },
  { prefix: 'greek', nameKey: 'family.greek' },
  { prefix: 'old', nameKey: 'family.oldIndian' },
  { prefix: 'trompowsky', nameKey: 'family.trompowsky' },
  { prefix: 'catalan', nameKey: 'family.catalan' },
  { prefix: 'orangs', nameKey: 'family.orangs' },
  { prefix: 'kings', nameKey: 'family.kings' },
  { prefix: 'queens', nameKey: 'family.queens' },
]

const SORTED_PREFIXES = [...FAMILY_PREFIXES].sort((a, b) => b.prefix.length - a.prefix.length)

function findFamilyKey(courseId: string): string {
  for (const fp of SORTED_PREFIXES) {
    if (courseId.startsWith(fp.prefix)) return fp.nameKey
  }
  return 'family.other'
}

export function groupOpeningsByFamily(courses: OpeningCourse[]): Record<string, OpeningCourse[]> {
  const groups: Record<string, OpeningCourse[]> = {}
  for (const course of courses) {
    const key = findFamilyKey(course.id)
    if (!groups[key]) groups[key] = []
    groups[key].push(course)
  }
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => a.eco.localeCompare(b.eco))
  }
  return groups
}

export function getFamilyNameKey(courseId: string): string {
  return findFamilyKey(courseId)
}
