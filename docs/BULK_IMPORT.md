# Bulk Import — Formato

La funzione **Importa blocchi** (presente nelle sezioni Puzzle e Partite) permette di inserire più puzzle e/o partite in una sola volta, separando ogni blocco con una riga vuota.

---

## Puzzle

```
fen: <FEN della posizione>
moves: <lista mosse separate da spazio>
theme: <tema1, tema2, ...>     # opzionale, default auto-detect
themes: <tema1, tema2, ...>    # alias per theme
difficulty: <1-10>
phase: <opening|middlegame|endgame>
```

**Campi obbligatori:** `fen`, `moves` (o `solution`)

**Campi opzionali:**
- `theme` / `themes` — default: auto-rilevamento (se la posizione è di scaccomatto imposta `checkmate`, altrimenti `fork`)
- `difficulty` — calcolata automaticamente se omessa
- `phase` — default `"middlegame"`

**Temi multipli:** separa più temi con virgola. Es: `theme: fork, pin`

Il tema può essere in camelCase (`backrankMate`, `arabMate`) o snake_case (`back_rank_mate`, `arabian_mate`). Viene normalizzato automaticamente.

**Temi validi:** `fork`, `pin`, `skewer`, `double_attack`, `discovered_attack`, `checkmate`, `mate_in_1`, `mate_in_2`, `mate_in_3`, `mate_in_4`, `mate_in_5`, `back_rank_mate`, `smothered_mate`, `anastasia_mate`, `arabian_mate`, `boden_mate`, `opera_mate`, `hook_mate`, `vukovic_mate`, `double_bishop_mate`, `epaulette_mate`, `corner_mate`, `endgame`, `middlegame`, `opening`, ecc.

**Esempio:**

```
fen: rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1
moves: e7e6 d2d4 d7d5
theme: fork
difficulty: 3

fen: 6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1
moves: Kh1 Kg7 Kg1 Kf7 Kh1 Ke7 Kg1 Kd7
theme: endgame

fen: 3r2k1/pp3ppp/8/2b5/8/1P3P2/PB3P1P/3R2K1 w - - 0 1
solution: Bxf7+ Kxf7 Ng5+ Kg8 Ne6
themes: fork, pin
difficulty: 6
```

---

## Partita (PGN)

Formato PGN standard con tag `[Event "..." ]` opzionali. Il testo viene riconosciuto automaticamente se inizia con `[Event` o con un numero di mossa (es. `1. e4`).

**Esempio:**

```
[Event "Partita informale"]
[White "Giocatore1"]
[Black "Giocatore2"]

1. e4 e5 2. Cf3 Cc6 3. Ac4 Cf6 4. O-O
```

**Esempio senza tag:**

```
1. d4 d5 2. c4 e6 3. Cc3 Cf6 4. Ag5
```

---

## Riconoscimento automatico

A ogni blocco viene assegnato automaticamente un tipo:

| Tipo | Riconosciuto quando... |
|------|------------------------|
| `puzzle` | La prima riga inizia con `fen:` |
| `game` | La prima riga inizia con `[Event` oppure contiene un numero di mossa (es. `1.` / `1...`) |
| `unknown` | Nessuna delle condizioni sopra |

I blocchi marcati `unknown` vengono proposti come `puzzle` ma è possibile cambiarli manualmente nella schermata di anteprima.

---

## Note tecniche

- `moves:` e `solution:` sono intercambiabili — il parser accetta entrambi i nomi di campo
- I numeri di mossa nel campo `moves`/`solution` vengono ignorati (es. `1. Bxf7+ Kxf7 2. Ng5+` → `["Bxf7+", "Kxf7", "Ng5+"]`)
- Se la posizione FEN è di scaccomatto e nessun tema è specificato, viene automaticamente impostato `theme: checkmate`
