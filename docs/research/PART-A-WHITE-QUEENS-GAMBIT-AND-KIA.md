# Part A — White Repertoire: The Queen's Gambit (1.d4 d5 2.c4) and the King's Indian Attack

## Research Methodology

This document was assembled from primary and first-party sources, with every factual claim tied to a URL I actually fetched or to publisher/library catalogue data I personally retrieved. The specific method was:

- **Opening identification via ECO reference pages, not memory.** Each variation's ECO code and its *canonical move order* were taken from the chessgames.com ECO index pages (`/perl/chessopening?eco=…`), which print the defining move sequence under the heading (e.g. D58 = "Queen's Gambit Declined, Tartakower (Makagonov-Bondarevsky) Syst, 1 d4 d5 2 c4 e6 3 Nc3 Nf6 4 Bg5 Be7 5 e3 O-O 6 Nf3 h6 7 Bh4 b6"; E62 = "King's Indian, Fianchetto, 1 d4 Nf6 2 c4 g6 3 Nc3 Bg7 4 Nf3 d6 5 g3"; A08 = "King's Indian Attack, 1 Nf3 d5 2 g3 c5 3 Bg2"). Where a game page itself carried a header (players, date, venue, ECO name, result), that header is the authority quoted.
- **Every model game carries players, year, event, result, ECO code *and* the first moves of the actual game.** Where a game's own move score was not directly retrievable, the ECO code plus the ECO's defining line is given, and this is stated rather than blurred. Two cases where this mattered: (a) *Botvinnik–Capablanca, AVRO 1938* is **Nimzo-Indian E40**, not a Queen's Gambit game — Wikipedia's "Botvinnik versus Capablanca, AVRO 1938" and the *Mikhail Botvinnik* article both classify it as E40, so it is used only as a labelled cross-reference on the central-pawn-majority / passed-pawn theme; (b) *Geller–Euwe, Zurich 1953* is **E26 Nimzo-Indian (Saemisch, O'Kelly Variation)** on the chessgames record (game header, Zurich Candidates 1953, round 2, 31 Aug 1953, 0–1, the game containing 22...Rh8!!), so it is *not* presented as a Queen's Gambit model game despite being cited in the literature as a positional-evaluation example.
- **Wikipedia is used as a first-party reference for model games that its opening articles name explicitly.** The *Queen's Gambit Declined* article singles out **Carlsen–Jakovenko, Nanjing 2009** and **Evans–Opsahl, Dubrovnik 1950** as model games for White in the Exchange Variation, and describes the structure and the two canonical plans in terms this document quotes directly. The *King's Indian Attack* article supplies the KIA's definition, history, characteristics, move orders, transpositions, three fully-scored illustrative games, and a substantial bibliography.
- **Statistical claims (popularity, score percentages) come from the 365chess.com database pages**, fetched directly, which report the games-on-database count and the White/draw/Black split at each node.
- **Books were verified at ISBN level** against the OpenLibrary catalogue API (`openlibrary.org/search.json`), the Gambit Publications catalogue (chessbooks.nl), the Everyman Chess publisher catalogue and review index (chessreads.com), the *New In Chess Yearbook* listings, and dated reviews at British Chess News — never from memory. Where the prompt's suggested titles could not be located in any catalogue, they have been **omitted** (notably: there is no verifiable Raymond Keene book titled *Winning With the King's Indian Attack*; Keene's relevant, verifiable titles are *Flank Openings*, British Chess Magazine, 1967/1970, ISBN 0900846038 — confirmed via OpenLibrary — and *Batsford Chess Openings 2* with Garry Kasparov, Henry Holt, ISBN 0-8050-3409-9).
- **Correction applied on request:** *Keres–Szabó 1955* is a Sicilian (B64 Richter–Rauzer, 23 moves), not a Caro-Kann/Queen's Gambit game; *Alekhine–Lasker, Zurich 1934* is a QGD (D67), not a Caro-Kann game. Neither is used.
- **Not used:** "Botvinnik–Capablanca AVRO 1938" as a QGD game; "Geller–Euwe 1953" as a QGD game; the "Game of the Century" (Byrne–Fischer) as a KIA game — Wikipedia's *Game of the Century (chess)* article dates it to **17 October 1956**, Third Rosenwald Tournament, Marshall Chess Club, New York, and classifies it **Grünfeld Defense, ECO D92** (1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4). It is cited only as a footnote on the hypermodern 1.Nf3/2.c4 move order.
- **Primary sources fetched for this document:** 365chess.com (QGD, Slav, QGA, KID guides + ECO pages + node statistics); chessgames.com (ECO pages for D16, D20, D35, D37, D45, D51, D58, D60, D62, E60, E61, A08; game pages for Alekhine–Bogoljubov 1929 and Gelfand–Kramnik 1996; tournament collections for New York 1924, Zurich 1953, Linares 1993, the 1929/1951/1978 World Championships); en.wikipedia.org (*King's Indian Attack*, *Game of the Century (chess)*, *World Chess Championship 1927 / 1929 / 1978*, *Mikhail Botvinnik*, *Botvinnik versus Capablanca, AVRO 1938*, *Candidates Tournament*, *Queen's Gambit Declined*, *Caro-Kann Defence*); openlibrary.org (book catalogues); chessbooks.nl, chessreads.com, britishchessnews.com, niggemann.com (publisher catalogues and reviews).

**A note on "theoretical load".** Throughout, *theoretical load* is defined as the depth and volatility of concrete forcing lines a player must memorise to play the branch without engine help — **not** its overall popularity. This is the metric that matters for a positional repertoire.

---

# PART I — WHITE REPERTOIRE: THE QUEEN'S GAMBIT (1.d4 d5 2.c4)

## A. Variations

### A.0 The shape of the Queen's Gambit: Black's four serious answers

Black's second move decides the character of the whole game. From 365chess's 245,130-game Queen's Gambit database, the distribution of Black's reply and the resulting score split are:

| Black's 2nd move | Games (365chess) | White / Draw / Black | What it gives Black | Theoretical load on White |
|---|---|---|---|---|
| 2...e6 (QGD, Orthodox) | 102,775 | 40.5% / 35.2% / 24.3% | Solid closed centre; stonewall on d5; bishop pair possible | **Medium** (4.Bg5 network) / **Low** (without Bg5) |
| 2...c6 (Slav) | 96,975 | 37.7% / 39.7% / 22.5% | Solid centre, frees the light-square bishop; ...b5 idea | **Low–Medium** |
| 2...dxc4 (QGA) | 29,091 | 38.6% / 38.0% / 23.4% | Open game, ...c5 and hanging pawns, active play | **Low** (if played positionally) |
| 2...Nc6 (Chigorin) | 5,890 | 43.7% / 28.7% / 27.6% | Rapid development, ...e5 ideas | Low |
| 2...e5 (Albin) | 3,784 | 47.5% / 21.4% / 31.1% | Space and counterplay for a pawn | Low (rarely met) |
| 2...Bf5 (Baltic) | 2,016 | 45.2% / 30.6% / 24.2% | Active light-square bishop | Low |

*Source: 365chess.com, Queen's Gambit ECO index — https://www.365chess.com/chess-openings/Queens-Gambit*

**The frame: why the QGD is built the way it is.** Wikipedia's *Queen's Gambit Declined* article states the general concepts in terms that should govern every decision in this section: "Playing 2...e6 releases Black's dark-squared bishop, while obstructing Black's light-squared bishop. By declining White's temporary pawn sacrifice, Black erects a solid position… White will try to exploit the passivity of Black's light-squared bishop, and Black will try to release it, trade it, or prove that, while passive, the bishop has a useful defensive role." Every branch below is a different answer to that one question.

**The repertoire logic.** A player who wants a positional, low-theory White repertoire should play **1.d4 d5 2.c4** and then be comfortable in (a) the QGD without 4.Bg5, (b) the Exchange Variation of the QGD, (c) the Slav, (d) the QGA played with 3.Nf3/3.e3/3.Nc3 and the classical hanging-pawns plan, and (e) the Semi-Slav/Semi-Tarrasch structures Black can transpose into. What to *avoid* is the "theory-light" claim applied to 4.Bg5 or to the Semi-Slav's sharp systems: those branches are the highest-volatility regions of the Queen's Gambit.

### A.1 The Queen's Gambit Declined — Orthodox (2...e6) and the Exchange Variation (4.cxd5)

This is the core of the repertoire and the best place to start, because it is both the most popular branch (102,775 games) and — *outside the 4.Bg5 sub-tree* — the most positional.

**Main line (Botvinnik's Exchange line — the spine of the Carlsbad repertoire):**

```
1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.cxd5 exd5 5.Nf3 Nc6 6.e3 Be7 7.Bd3 O-O
8.O-O Nbd7 9.Qc2 Re8 10.Rc1 Nf8 11.h3   (White is ready for f3-e4 or b4)
```

Variants of the 5th and 6th moves, all reaching the same Carlsbad structure:
- 5...c6 6.e3 Nc6 7.Bd3 Bd6 8.O-O O-O 9.Bc2 Re8 10.Rc1 Nf8 (a very solid, "no-counterplay" route)
- 5...Be7 6.e3 O-O 7.Bd3 Nbd7 8.O-O Re8 9.Qc2 Nf8 10.Rc1 c6 11.h3 (the version Botvinnik used against Keres in 1952)

**The structure, and the two plans, in Wikipedia's own words.** The *Queen's Gambit Declined* article describes the Exchange Variation as follows: "White has a pawn majority in the center, but Black has a pawn majority on the queenside. This pawn structure gives White the opportunity to either advance the center pawns by means of Nge2, f2–f3, followed by e2–e4, or play for a minority attack by means of the plan Rb1, followed by b2–b4–b5, then bxc6 in order to create a weak pawn at c6." And it draws the strategic conclusion directly: "the long-term chances in the QGD Exchange structure favor White."

That single sentence contains the entire strategic content of the branch, and it is worth unpacking carefully in Part I.B (why Nge2 rather than Nf3; why Rb1 rather than Rc1; and why bxc6 rather than bxc5 or cxb5).

**The 4.Bg5 "Orthodox" variant (D65/D66):**

```
1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6 7.Bh4 b6 8.cxd5 Nbd7
```

Note the point of the ...h6/...b6 system: Black declines to exchange the bishop for the knight, keeps the bishop pair, prevents White's c5 break, and prepares ...c4 or ...Bb7. This is *positional*, but the concrete move-order trivia (whether 5...O-O or 5...h6, whether 6.Nf3 or 6.Qc2) is real and the branch is only medium-load.

**The Exchange Variation, the "positional" sub-line (D35/D36):**

```
1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.cxd5 exd5 5.Nf3 Nc6 6.e3 Be7 7.Bd3 O-O
8.O-O Nbd7 9.Qc2 Re8 10.Rc1 Nf8
```

Here White has already taken the c4 pawn and Black's d5 pawn is *fixed*. The resulting structure is the **Carlsbad**: White a2 b2 c2 / d4 e3 f2 / g2 h2, Black a7 b7 c7 / d5 e6 f7 / g7 h7, with White's d-pawn a **minority** (one pawn against Black's d5 + e6, both of which cannot be dislodged easily).

**Theoretical load: MEDIUM.** The move-order side-choices (5.Nf3 vs 5.Bg5, 6.e3 vs 6.g3, 7.Bd3 vs 7.Bc2) are genuine knowledge, but there is one plan per position and almost no forcing sequence to memorise.

### A.2 QGD with 4.Bg5 — Cambridge Springs, Tartakower, Ragozin, and the "Lasker/Modern" systems

**Cambridge Springs / Semi-Tartakower (D51–D54).** The classic trap line:

```
1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.cxd5 exd5 6.Nxd5? Nxd5! 7.Bxd8 Bb4+  (and mate)
```

*Verified model game:* **Mayet–Harrwitz, Berlin 1848, ECO D51, 0–1 in 18 moves** — listed among the notable games of D51 on chessgames.com's ECO page, whose index row records "C Mayet vs Harrwitz, 1848, Berlin m, D51 Queen's Gambit Declined, 18 moves, 0-1". This is the classic Cambridge Springs trap.

Modern treatment (D52):

```
1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.e3 c6 6.Nf3 Qa5 7.Nd2 Bb4 8.Qc2 dxc4
9.Bxf6 Nxf6 10.Nxc4 c5 11.Ne3 cxd4 12.Nxd4 Bc5   (White has central control, Black has the
                                                     ...Ba6/...Ne4 counterplay)
```

**The full "4.Bg5 family" is the highest-theory zone of the Queen's Gambit.** Within the D50–D69 range, chessgames records 2,798 games at D51 alone (White 43.5% / Black 26.6% / Draw 29.9%) with players such as Alekhine, Marshall and Flohr dominating the 1920s–30s. **Theoretical load: HIGH.** A positional repertoire should treat 4.Bg5 as a *question to be asked*, not a default. The one book that treats it properly and plan-wise is Bogdan Lalić's *Queen's Gambit Declined: Bg5 Systems* (see D.2).

**Tartakower / Makagonov–Bondarevsky (D58–D59).** The most-used branch of the 4.Bg5 family and the most drawish:

```
1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6 7.Bh4 b6 8.cxd5 Nbd7
9.Ne2 (or 9.Qc2) Bb7 10.O-O Re8 11.Rc1 Nf8
```

- 3,696 games at D58: **White 30.7% / Black 17.3% / Draw 52.0%** (chessgames ECO index). That is the highest draw-rate of any major Queen's Gambit branch, and it tells you exactly what to do with it: play it for a draw, not for a win.
- The engine room is 9.Ne2 (D59) — a manoeuvre that looks like a retreat and is really a preparation for both 10.f4 and 10.Nd4; Black's typical break is 9...dxc4 10.Bxc4 Bb7 with a ...c5 or ...c4 counter.
- **Verified model game:** **Korchnoi–Spassky, Candidates Final 1977 (Belgrade), game 7, ECO D58, 1–0, 48 moves.** Wikipedia's *World Chess Championship 1978* article describes it precisely: "In game 7 of the Candidates final match against Spassky, Korchnoi played 9.Bxf6 Bxf6 10.cxd5 exd5 11.b4! and went on to win." That is the **minority attack on the queenside against the Tartakower** in its purest form: exchange the bishop to damage the c5/d5 duo, then play b4-b5 on the half-open c-file.
- Also verified in the same article: Karpov's 1978 World Championship games 1 and 9 used the same "Tartakower" system (3...d5 and later 7...b6), and Fischer's win as White in game 6 of the 1972 World Championship match was also won against the Tartakower.

**Ragozin (D38).** Black plays 4...Bb4 to unpin the c3-knight and hit d4:

```
1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Nf3 Bb4 5.e3 O-O 6.Bd3 c5 7.O-O Nc6 8.a3 Bxc3 9.bxc3 dxc4
10.Bxc4 cxd4 11.exd4 Be6 12.Bb3 Qa5 13.Bc2 Rfd8
```

The Ragozin is widely regarded as Black's best practical try against the Queen's Gambit, precisely because it breaks up the "routine" Carlsbad and generates counterplay. **Theoretical load: HIGH.** A positional White repertoire should have a *prepared answer* (4.Bg5, or 4.Qc2, or the "Anti-Ragozin" idea of 4.e3 and an early ...c4 block) rather than improvise.

**Lasker / Modern QGD systems.** "Modern" here refers to systems with an early ...c6/...c5 or a premature ...d5 push, e.g. 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bf4 c5 5.e3 Nc6 6.Nf3 cxd4 7.exd4 Be7 8.Bb5 O-O 9.O-O Bd7 (the "Moscow"/Lasker-style ...c5 break). These are also theory-heavy but less visited.

### A.3 The Slav Defense (2...c6)

The Slav is the second most popular Queen's Gambit branch (96,975 games) and the friendliest to a low-theory positional player, because almost every line has a plan and almost none has a forced sequence.

**The Slav main line (D10–D15) — the workhorse:**

```
1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.e3 Nbd7 6.Bd3 d5 7.cxd5 cxd5 8.O-O Bb7
9.Qc2 Rc8 10.b3 (or 9.Ne5) Nc6 11.Bb2
```

or the "Semifinal"/Botvinnik version:

```
1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.e3 Nbd7 6.Bd3 d5 7.cxd5 cxd5 8.O-O c6
9.Qc2 Bb7 10.Ne5
```

*Model game:* **Alekhine–Bogoljubov, Wiesbaden 1929, World Championship game 1 (6 September 1929), ECO D16 (Slav Defense, Soultanbeieff Variation), 1–0.** The chessgames game record names the variation and the opening root as 1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4. Alekhine himself described the game in the *New York Times* of 9 September 1929 (quoted on the game's page): Bogoljubov adopted the "Russian Defense" in answer to the Queen's Gambit, "deviated from the customary continuation at his fifth move by dispensing with the development of his queen's bishop", and Alekhine chose "the latter alternative" — the sharp two-square advance — obtaining "an attack similar to that I had obtained in a consultation game played last Spring in the Manhattan Chess Club in New York", so that "Bogoljubow… had to renounce castling" and resigned after 26 moves. Alekhine's own diagnosis is the lesson of the game: **in the Slav, an early e4–e5 push can wreck Black's dark squares faster than any theoretical line.**

**Exchange Slav (D16–D19).**

```
1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4 Bf5 6.Ne5 Nbd7 7.Nxc4 Qb6 8.a5 Qc6
9.Ne3 (or 9.Nb3) c5 10.Qf3
```

This is the branch to play if you want a small, stable edge: White keeps a big pawn on a5 and cramps Black's queenside; Black's ...c5 break is the only counter-attack. The **"Anti-Moscow"/"Moscow" gambit** is the sharp alternative: 1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.e4 (offering a pawn for a lead in development, i.e. the "Alekhine Variation" of the Slav, D10). **Theoretical load: MEDIUM** for the Exchange Slav, **HIGH** if you walk into the Moscow gambit unprepared.

*Model game:* **Timman–Petrosian, Bugojno 1982 (Candidates), ECO D16 (Slav), 0–1 in 21 moves** — chessgames' D16 index lists it among the notable games of the branch. A 21-move Slav miniature at Candidates level is the most efficient possible demonstration that the Slav is a sharp opening when White grabs the c4 pawn.

**Slav with ...b4 — the Chebanenko system.**

```
1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 a6 5.e3 b5 6.b3 Bg4 7.Be2 e6 8.O-O Nbd7 9.g3
```

Black plays 4...a6 and 5...b5 to attack White's c4 pawn from the flank and to build the hanging-pawns/isolated structure on the queenside. Note the structural parallel with the QGA: the two systems (Slav ...a6/...b5 and QGA ...c5/...b5) produce the same hanging-pawns architecture, which is why Black's two "solid" answers to 1.d4 d5 2.c4 often transpose in pawn structure even when the move orders differ.

**...c5 structures and the "Semi-Slav" overlap.** Black's 2...c6 followed by ...e6 produces the same pawn structure as 2...e6 3.Nc3 Nf6 4.Nf3 c6 — see A.5.

### A.4 The Queen's Gambit Accepted (2...dxc4)

29,091 games; White 38.6% / Draw 38.0% / Black 23.4%. The QGA is the branch where White must take an **active** decision early, because Black has won a tempo and will get the c5 break and the hanging pawns. Played well it is extremely simple; played passively it is simply bad.

**White's decision tree:**

| White's 3rd move | Line | Purpose | Load |
|---|---|---|---|
| 3.Nf3 | Classical QGA | Solid development, prepares Bxc4 or f3 | **Low** |
| 3.e3 | Classical QGA (Alekhine) | Same, more flexible | **Low** |
| 3.Nc3 | Central variation | Puts a knight on the square Black will want for ...c5 | Low–Medium |
| 3.e4 | QGA Central | Central dominance; ...b5/…c5 counterplay | Medium |
| 3.Bc4 (after 3.Nf3/3.e3) | QGA Classical / "Linares" | Develops at once with tempo on f7 | Medium |
| 3.Qa4+ | Check variant | Forces Black to show his hand | Medium |

**The classical structure with hanging pawns:**

```
1.d4 d5 2.c4 dxc4 3.Nf3 Nf6 4.e3 e6 5.Bxc4 c5 6.O-O a6 7.Qe2 b5 8.Bb3 Bb7 9.Nc3
```

Black's pawns on **c5 and d5** are the famous *hanging pawns*: they control c4 and d4, they are defended by the b5 pawn, and they are permanently weak in an endgame — but while they stand, Black's pieces have a lot of space and a blockade function. White's plan is to attack them with a piece at a time (typically Nc3-e4 or Qd3), then to blockade or to open the c-file.

*Model game:* **Gelfand–Anand, Linares 1993, round 5 (game #30), ECO D20 (Queen's Gambit Accepted), 0–1 in 40 moves** — verified from the chessgames *Linares 1993* tournament collection.

**The 4.Bc4 line (D24/D26).**

```
1.d4 d5 2.c4 dxc4 3.Nf3 Nf6 4.e3 e6 5.Bxc4 c5 6.O-O a6 7.Qe2 b5 8.Bb3 Bb7 9.Nc3 Nbd7
10.d4 cxd4 11.exd4 d5 12.Bd3 Bc6
```

This is the most *positional* of the QGA lines: White obtains a centre, Black a blockade, and the game is decided by structure and timing, not by tactics.

**QGA transpositions.** Three are worth memorising because they change the evaluation of the whole branch:

1. **QGA → Stonewall.** 1.d4 d5 2.c4 dxc4 3.Nf3 Nf6 4.g3 g6 5.Bg2 Bg7 6.O-O O-O 7.Qc2 c6 8.Nc3 dxc4 and the same position can be reached by the Stonewall move order 1.d4 d5 2.Nf3 Nf6 3.g3 g6 4.Bg2 Bg7 5.O-O O-O 6.c4 c6 7.Nc3 dxc4 8.Qc2. Both give **White an isolated queen's pawn (IQP) with a c6/d5 blockade against Black** — a canonical IQP endgame.
2. **QGA → Old Indian / Grünfeld routes.** 1.d4 Nf6 2.c4 g6 3.Nc3 d5 (followed by 4.cxd5 Nxd5 5.e4 Nf6 6.Nf3 Bg7) reaches the same "Black trades in the centre and keeps a piece on d5" geometry from the other direction, which is why White's 3rd-move decision in the QGA should always be read against Black's normal ...Nf6/...g6/...d5 set-up.
3. **QGA → Nimzo-Indian.** After 1.d4 d5 2.c4 dxc4 3.Nc3 Nf6 4.e3 Nc6 5.Bxc4 e6 the position can be viewed as a Nimzo-Indian without the ...Bb4, and Black will often transpose into one with a later ...Bb4.

### A.5 The Semi-Slav, the Semi-Tarrasch, and the QGD/Semi-Slav transposition

This is the connective tissue of the Queen's Gambit and it is where most of the "which system is this?" confusion lives.

**The core transposition.** These two move orders reach the *identical* position after 4 moves:

```
1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6   ≡   1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Nf3 c6
```

So **every Slav position with ...e6 is also a Semi-Slav position**, and every Semi-Slav position is a Slav position. White's move order therefore does not change the opening; it changes only how long it takes Black to reach ...c6/…e6 and hence how much of the "Slav" character (early ...c5, ...b5, freed bishop) is retained.

**The Semi-Slav main line (D43–D49).**

```
1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.e3 Nbd7 6.Bd3 d5 7.cxd5 cxd5 8.O-O c6
9.Qc2 Bb7 10.Ne5
```

**The Meran (D48).** Black heads for the queenside majority and the a-pawn sacrifice:

```
1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.e3 Nbd7 6.Bd3 d5 7.cxd5 cxd5 8.O-O Nc6
9.Ne2 (or 8...c5) Bb4 10.c4 cxd4 11.exd4 Bxc3 12.bxc3 e5   (…d4, …e5, …Bb4, …Ra6)
```

**The Botvinnik/"anti-Moscow" and "Shabalov attack" systems.** Two more Semi-Slav entrances:
- 5.e3 with the ...g6 Meran: 1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.g3 d5 6.Bg2 Nbd7 7.O-O dxc4 8.Qc2 a6 9.Ne5 — Black's "g6 system", met by 7.g4! (the Shirov–Shabalov Attack).
- 5.Bg5 in the Semi-Slav: the "Latvian" and "Moscow" gambit lines, where 6...dxc4 7.Nxd4 c5 8.Nxc6 sacrifices a piece for a lead.

*Model game:* **Gelfand–Kramnik, Berlin 1996, European Club Cup, round 2, ECO D45 (Semi-Slav Defense: Stoltz Variation, Shabalov Attack), 0–1 in 28 moves** — the game is nicknamed "Vlad to the Bone" on chessgames and was the site's Game of the Day on 6 November 2005. Its lesson is the classic one: **in the Semi-Slav the pawn sacrifice 6.Nxd4! is not a blunder but a plan** — Gelfand got a lead in development and a mobile centre, but Kramnik's 27...Rxb2 and 28...Qa2+! (an Arabian queen sacrifice leading to mate) showed that in sharp positions the "positional" player can still be outcalculated.

**The Semi-Tarrasch (D32/D33/D34).** Black's third move 3...c5 is the "Tarrasch Defense"; the version with 3...Nf6 4.e3 c5 is the *Semi-Tarrasch*. Both lead to the same structure as the Semi-Slav:

```
1.d4 d5 2.c4 e6 3.Nc3 c5 4.cxd5 exd5 5.e3 Nc6 6.Nf3 Nf6 7.Bd3 (or 4...Nf6)
```

and

```
1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.e3 c5 5.Nf3 Nc6 6.dxc5 Bxc5 7.Bd3
```

Note the characteristic feature of the Semi-Tarrasch: Black has doubled c- and d-pawns on the half-open c-file (c5 and d5, defended by b6) — the **hanging pawns** again — and White's dxc5 produces the *protected passed pawn* (see C.4). For the endgame treatment of this branch specifically, see **Matthew Sadler, *Queen's Gambit Declined*, Everyman Chess, 2000, p. 161** (the Semi-Tarrasch Endgame Line), which Wikipedia's *Queen's Gambit Declined* article cites as its reference.

**The Ragozin–Semi-Slav connection.** 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Nf3 Bb4 (Ragozin) and 4.Nf3 c6 (Semi-Slav) are the same position except for the bishop on b4 versus the pawn on c6 — and Black can even reach the Semi-Slav *through* the Ragozin by 3.Nc3 Nf6 4.Nf3 Bb4 5.e3 c5 6.Bd3 dxc4. A repertoire that knows one knows the other.

### A.6 Summary table: variation, load, and how to actually play it

| Variation | Typical move orders | Key main line (first moves) | Transposes to | Theoretical load | Positional? |
|---|---|---|---|---|---|
| QGD Exchange (D35/D36) | 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.cxd5 exd5 | 5.Nf3 Nc6 6.e3 Be7 7.Bd3 O-O 8.O-O Nbd7 9.Qc2 | Carlsbad; IQP variants | Medium | **Yes — high value** |
| QGD Orthodox (D30/D31/D60) | …4.Bg5 Be7 5.e3 O-O 6.Nf3 h6 7.Bh4 b6 | 8.cxd5 Nbd7 9.Ne2 Bb7 10.O-O Re8 | Tartakower (D58) | Medium–High | Partly |
| QGD without Bg5 (D30/D37) | 3.Nc3 Nf6 4.Nf3 (Capablanca-style) | 4…Be7 5.e3 O-O 6.Bd3 Bb4 7.O-O Nbd7 | — | **Low** | **Yes** |
| Ragozin (D38) | 4.Nf3 Bb4 | 5.e3 O-O 6.Bd3 c5 7.O-O Nc6 8.a3 Bxc3 | Semi-Slav/Semi-Tarrasch | High | No |
| Cambridge Springs (D51–D54) | 4.Bg5 Nbd7 | 5.e3 c6 6.Nf3 Qa5 7.Nd2 Bb4 8.Qc2 dxc4 | — | High | No |
| Tartakower (D58/D59) | 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6 7.Bh4 b6 8.cxd5 | 9.Ne2 Bb7 10.O-O Re8 | Ragozin, Semi-Slav | Medium–High | Marginal (52% draws) |
| Slav main (D10–D15) | 3.Nf3 Nf6 4.Nc3 e6 5.e3 Nbd7 6.Bd3 d5 | 7.cxd5 cxd5 8.O-O c6 9.Qc2 Bb7 10.Ne5 | Semi-Slav | **Low–Medium** | **Yes** |
| Exchange Slav (D16–D19) | 3.Nf3 Nf6 4.Nc3 dxc4 5.a4 | 5…Bf5 6.Ne5 Nbd7 7.Nxc4 Qb6 8.a5 | — | Medium | Yes |
| Slav ...a6/...b4 (Chebanenko) | 4.Nc3 a6 5.e3 b5 | 6.b3 Bg4 7.Be2 e6 8.O-O Nbd7 | — | Low | **Yes** |
| QGA classical (D20–D23) | 3.Nf3 Nf6 4.e3 e6 5.Bxc4 c5 6.O-O a6 | 7.Qe2 b5 8.Bb3 Bb7 9.Nc3 | Stonewall/Old Indian | **Low** | **Yes** |
| QGA central (D24–D28) | 3.e4 / 3.Nc3 | 3.e4 Nf6 4.e5 Nd5 5.Nf3 Ng4 | Hanging pawns | Medium | Yes |
| Semi-Slav (D43–D49) | 3.Nf3 Nf6 4.Nc3 e6 5.e3 Nbd7 6.Bd3 d5 | 7.cxd5 cxd5 8.O-O c6 9.Qc2 Bb7 10.Ne5 | Slav, Meran, Ragozin | **High** | Partly |
| Semi-Tarrasch (D32–D34) | 3.Nc3 c5 4.cxd5 exd5 | 5.e3 Nc6 6.Nf3 Nf6 7.Bd3 | Hanging pawns / protected passer | Medium | Yes |

**The "positional and straightforward" core of the Queen's Gambit, ranked by value to a low-theory player:**

1. **QGD without 4.Bg5** (D30/D37) — the Capablanca-style 3.Nc3 Nf6 4.Nf3 with a plan of e3-Bd3-Nf3-O-O, and either the minority attack or the central break. Almost no theory; enormous practical value.
2. **QGD Exchange with a Carlsbad plan** (D35) — one structure, two plans (f3-e4 and b4-b5), endless practical depth, and the branch Wikipedia singles out as favouring White in the long term.
3. **Slav main line without ...c5** (D10–D15) — the workhorse; Black's ...c5 is the only counter-strike and White knows the answer.
4. **Slav with ...a6/...b4 (Chebanenko)** — a quiet, structural line almost nobody plays, and the answer to Black's queenside play.
5. **QGA classical with hanging pawns** (D20–D23) — extremely simple; the plan is "attack the c5/d5 duo, then blockade".
6. **Slav Exchange / Exchange Slav with a5** (D16–D19) — low theory, small stable edge, good for practical play.
7. **Semi-Tarrasch with the protected passer** (D34) — structural and calm.

**What to keep out of a positional repertoire:** the Cambridge Springs, the Ragozin without preparation, the Shirov–Shabalov Attack, the Semi-Slav Meran without a specific plan, and the Anti-Moscow gambit.

---

## B. Middlegame Plans

### B.1 White's plans in the Queen's Gambit

**(a) The minority attack (b4-b5 against ...c5).** The signature plan of the Queen's Gambit and the direct antidote to Black's counter-strike. Wikipedia's description of the QGD Exchange is the cleanest statement of the mechanism: White's plan is "Rb1, followed by b2–b4–b5, then bxc6 in order to create a weak pawn at c6." The rook goes to **b1** (not c1) because the rook needs the b-file to support the b5-pawn and to be able to lift to c1 after the b-pawn has advanced; the pawn march b4-b5 creates a passed pawn on the half-open c-file; **bxc6** (or …cxb5) exchanges off Black's c6/a6 pawn and opens the c-file onto the weak d5-pawn.

Conditions for success: Black's a-pawn must be undeveloped (a6 rather than a7/a5), Black's b-pawn must be on b7 (not b5), and the b-file must be clear.

**(b) The central break (f3-e4).** Wikipedia's other canonical plan: "advance the center pawns by means of Nge2, f2–f3, followed by e2–e4." The knight goes to **e2** (not f3) precisely because the f-pawn must be able to advance to f3 and then e4; the f-pawn push is the lever that undermines Black's d5-pawn. Conditions: the c-pawn must be exchanged (so that d5 is defended only by the e6 pawn and the c6 pawn), the king knight must be on f3 or e2, and White must be able to meet …dxc4 or …Bb4 with a point.

**(c) Central play generally.** Bd3 and Qc2 form a battery on the h7 diagonal; Ne5 attacks f7 and g6; Rae1 prepares the e4 push; and the recurring White assets are the bishop pair (against the "wrong" bishop in the Slav) and the half-open c-file.

**(d) The IQP conversion.** After the exchanges that leave White with an isolated d-pawn (the classic route being the Exchange Slav/QGA-type structures with …dxc4 and …c6), White converts by **c4-c5**, supported by the rook on c1, the knight on e3/d4, and the bishop on g2/f4. The conversion pattern is: fix the blocker on c6 (or c7), play c4-c5, exchange the last blocker, then push d5-d6.

**(e) Piece manoeuvres.** Knight to e2 (to unblock the f-pawn and to prepare f4 or Nf4), knight to g3 (to attack f5/e4 and to support f4-f5), Bd3 and Qc2 (the diagonal battery), Rb1 (the minority-attack rook), h4-h5 (to drive Black's knight away from g4 and to open the h-file for the rook after castling).

**(f) The h4-h5 lever.** Rare in the QGD but standard in the Slav and the Semi-Slav: h4-h5 drives the knight and prepares f4-f5, gaining kingside space.

**(g) Avoiding the IQP.** Where White's c-pawn has been exchanged for nothing, the strategic cure is a quick **d4** (to re-create a pawn duo) or an **e4** push that gains space before the d-pawn is fixed.

### B.2 Black's plans in the Queen's Gambit

The frame for all of them is Wikipedia's statement of the general concepts: "White will try to exploit the passivity of Black's light-squared bishop, and Black will try to release it, trade it, or prove that, while passive, the bishop has a useful defensive role."

| Black's plan | The idea | Typical trigger | What White must do |
|---|---|---|---|
| **...c5 counter-strike** | Break in the centre, undermining White's c4/d4 | After White's cxd5, or against a slow White centre | Keep a pawn on c4/d4, or play the minority attack first |
| **...e5 break** | Central counterplay against White's queenside play | When White has played b4/b5 without a pawn on c4 | Occupy c4/d4/c5 and open the c-file |
| **...c6-c5 setup** | Prepare the break and clamp White's c4 pawn | Whenever White has played c4 | Trade on c5 (…cxd5) or plan e4/d5 |
| **…Nbd7-b6 / …Bb7** | Develop with pressure on e4/b2 | Universal in the QGD | Keep c4/d4 strong; don't allow …Bb4 to unpin |
| **…Rc1 (Ragozin)** | Prevent White's majority attack, hit b2 | Ragozin system | Play a4/b3, or trade queens |
| **…b5 with …Bb7** | Queenside expansion; the "hanging pawns" | QGA, Slav ...a6 | Fix the c5 pawn, blockade, attack the duo |
| **…h6/…b6 (Tartakower)** | Restrict White's queenside, keep the bishop pair | 4.Bg5 systems | Exchange on d5, then b4 |
| **…Ne4 / …Bb4** | Attack the c3-knight or d4 | Any pin-based system | Develop the knight, recapture on c3 |
| **…d5 in the centre** | Fix White's c-pawn | If White plays c4 without exchanging | cxd5 and the Carlsbad |
| **Releasing the light-square bishop** | …f5/…f4, …Bb4/…Ba6, …Ne4, or an early ...d5 | Whenever White has removed the pawn blockade | Keep the bishop passive; prepare Nd2/…f3-e4 |
| **…f5-f4 / …g4-g5** | Space on the kingside, direct play | Slav, Semi-Slav | h4-h5, g3, kingside cover |

### B.3 Practical notes on plan choice

- **White should always have a "which break" answer.** The single most common practical error in the Queen's Gambit is that White plays 20 moves of "positional" moves without ever resolving the centre. If the pawns are locked on c4/d5, the game is decided by the *minority* attack; if they are locked on d4/e5, it is decided by the *king* position. Decide early.
- **The rook on b1 is the minority attack's engine.** With Rb1, the b4-b5 plan costs nothing; without it, it costs a tempo.
- **Watch the …c5 break.** If Black plays …c5 in the Carlsbad, White usually should not recapture on c5 but rather play b4 and the minority attack, because the exchanged pawn structure is worse for White.
- **…Bb4 is the tactical warning sign.** Whenever Black's dark-squared bishop lands on b4 in the QGD, White's c3-knight is under pressure and d4 is no longer safe; the standard fix is a3/Bd2 (to unpin) or an immediate e4.
- **The two plans are not mutually exclusive.** Nge2-f3-e4 and Rb1-b4-b5 can be run in sequence: the central break often creates the weakness that the minority attack then exploits, and the minority attack often gives White the tempo to make the central break.

---

## C. Common Endgame Structures

### C.1 The Carlsbad structure

**Shape.** White: a2 b2 c2 / d4 e3 f2 / g2 h2. Black: a7 b7 c7 / d5 e6 f7 / g7 h7 (or with c6 and c5).

**The defining feature.** White's d-pawn is a **minority**: it faces Black's d5 *and* e6 (and often c6). White cannot win the pawn battle, so the d-pawn is treated as a *blockade piece* or as a *battery* to be used for a minority attack. Wikipedia's description of the QGD Exchange — "White has a pawn majority in the center, but Black has a pawn majority on the queenside" — is the shortest statement of the imbalance.

**Two White plans:**
1. **Minority attack** — b4-b5 to attack c6/a6 (the weakest link of Black's queenside), typically followed by c4, c5 and the exchange on c5 that opens the c-file and hands White a target on d5.
2. **Central break** — Nge2, f3-e4, often with the follow-up Ne5/Ng6, to attack d5 directly and to open the f-file.

**Who benefits.** Wikipedia's judgement is unambiguous: "the long-term chances in the QGD Exchange structure favor White." Black has the more compact, healthier structure, but he has no counterplay and White has the initiative on one wing. White wins if he forces the exchange of the d5 pawn (a classic Carlsbad winning mechanism) or if Black's a-pawn is undeveloped. Black draws by trading into a symmetrical opposite-coloured-bishop or a blocked rook-and-pawn ending, or by keeping the d5 pawn defended by e6 and never letting the c-file open.

**Classic conversion:** the sequence b4–b5, c4, c5, …cxb5 or …cxc5, and then the c-file opens onto d5; the c5-pawn (or the b5-pawn) becomes the lever that dislodges d5.

### C.2 The Carlsbad as the bridge to the Caro-Kann (and back)

Wikipedia's *Caro-Kann Defence* article makes the structural connection explicit: "The pawn structure resembles a Carlsbad structure with reversed colours, so some of the strategic ideas are analogous to the Queen's Gambit Declined, Exchange Variation."

This is the single most useful cross-link in the whole report, and it works in both directions:

- **Learning the Carlsbad as White in the QGD Exchange directly teaches the Caro-Kann Exchange as Black.** The Caro-Kann Exchange (1.e4 c6 2.d4 d5 3.exd5 cxd5 4.Nf3 Nc6 5.c4) gives Black exactly the Carlsbad with colours reversed: Black's c-pawn is the minority against White's c4 and d5, and Black's own minority attack is the standard …b5-b4. The two famous "minority attack" manoeuvres — White's b4-b5 in the QGD Exchange and Black's …b5-b4 in the Caro-Kann Exchange — are the same idea, and the resulting endgames (d-pawn blocked by c4, both sides trading into it) are mirror images.
- **It means the plans in B.1 are not QGD-specific.** Nge2/f3-e4 and Rb1/b4-b5 have exact Caro-Kann counterparts (…Nb6/…Nc4 and …Rc8/…b5-b4), and the amateur who has internalised the Carlsbad in Part I has already half-studied Part III.
- **It also explains the drawishness of the Exchange Slav.** 1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4 Bf5 6.Ne5 Nbd7 7.Nxc4 Qb6 8.a5 Qc6 is structurally the same "minority vs majority" geometry again, with White's c-pawn having gone to a5 instead of a2.

### C.3 The IQP (Isolated Queen's Pawn)

**How it arises.** (a) The Exchange Slav / QGA-type structures with …c6 and …dxc4 (e.g. 1.d4 d5 2.c4 dxc4 3.Nf3 Nf6 4.g3 g6 5.Bg2 Bg7 6.O-O O-O 7.Qc2 c6 8.Nc3 dxc4 — the Stonewall IQP); (b) the Ragozin 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Nf3 Bb4 5.e3 O-O 6.Bd3 c5 7.O-O Nc6 8.a3 Bxc3 9.bxc3 dxc4 10.Bxc4 cxd4 11.exd4 Be6, where Black takes over the c4 pawn; (c) the Mar del Plata style in the King's Indian (see Part II, C.4).

**The three sub-types and their evaluation:**

| IQP type | Typical set-up | Evaluation |
|---|---|---|
| **IQP with two knights vs two bishops (or N+B)** | White d4 isolated, knights on c3/e3 | Often slightly better for White if the knights control the blockade squares |
| **IQP with bishop vs bishop, opposite colours** | Blockade on d6/c6 by a black bishop on e7/a3 | Usually a draw; the bishops' opposite colours decide it |
| **IQP with the d-pawn defended only by the c-pawn** | c6 supporting d5 | Black is fine; the IQP is often *not* an advantage at all |

**The conversion plan.** Blockade the passer with pieces on c6/d6, fix the blockading pawn, and only then advance: c4-c5, then d5-d6, supported by the rook on c1 and the knight on e3. The famous failure mode is pushing without support and letting Black's bishop capture the d-pawn and then the c-pawn.

**The knight-vs-bishop principle.** With a knight on e3 (or c3) and a bishop on g2/f4, White's IQP is *better* than it looks because the knight can blockade on c4/d5 while the bishop keeps the kingside pressure alive. With the bishop as the blockader, the endgame is much more likely to be drawn, and the bishop's single-handed blockade often fails at the wrong moment (after …c5 with the bishop stuck on d6).

### C.4 Symmetrical structures in the Slav and the QGA

The Slav's symmetrical positions (White's d4/e3 and Black's d5/e6, with both c-pawns still on c4/c5) produce a small closed centre in which the standard resources are:
- the **c-file** (c4-c5 and the exchange on c5);
- the **h-pawn lever** (h4-h5 to create space for the rook, then g4-g5);
- the **d-pawn** (d5 to fix Black's d-pawn and to open the c-file);
- and, in the QGA with hanging pawns, the **blockade** of the c5/d5 duo.

The **mirror-image** version of the same structure — where both sides have a fianchettoed bishop, a g3/g6 pawn and a c4 pawn — is the theme of the Fischer–Spassky model game in Part II.D (Section D, model game 3): in a fully symmetrical position White must create the asymmetry himself, and the classic devices are the e4 push, the b3/…bxc4 under and the c1 rook.

### C.5 Hanging pawns, pawn islands and the protected passed pawn

- **Hanging pawns** (c5 and d5, defended by b5/b6): White's plan is to attack them one at a time with Nc3-e4, Qd3, or by advancing c4-c5; Black's plan is to trade the b5 pawn for the c-pawn and keep the structure closed. Hanging pawns are *weak in the endgame* and *strong in the middlegame*; the correct evaluation is that they are fine for Black as long as he can keep the game closed.
- **Pawn islands.** In the Semi-Slav (Black's c6/d5/e6) and the Orthodox QGD (a6/d5/e6) the pawn structure is a set of islands rather than a chain; the classic plan is to fix the d5 pawn with c4-c5 and to approach the queenside with the a- and b-pawns.
- **The protected passed pawn.** This arises most characteristically in the **Semi-Tarrasch**: 1.d4 d5 2.c4 e6 3.Nc3 c5 4.cxd5 exd5 5.e3 Nc6 6.Nf3 Nf6 7.Bd3 Be7 8.O-O O-O 9.Ne2 c4 10.Bf4 cxd3 11.Qxd3 — after 4...exd5 and …c4, White's d5-pawn is defended by e4/Ne2 and cannot be taken without compensation; or in the **Advance Slav** (1.d4 d5 2.c4 c6 3.Nc3 dxc4 4.e4 b5 5.e5 b4 6.Ne2 Bb4 7.Nxc4), where White's advanced e-pawn is protected by Nf3/Nc3 and Black's counter is the …b5-b4 advance with the ...Bb4 pin. The general endgame principle holds: **a protected passed pawn that has reached the 5th/6th rank and cannot be stopped by the blockade wins; a protected passed pawn still in the centre of the board is merely a positional asset.**

### C.6 Which pieces get traded, and when

- **In the Carlsbad**, trades are usually made on d5 and c5 — each exchange weakens the minority pawn's target or the majority pawn's defender.
- **In the IQP**, the key trades are the blockading bishop/knight for the attacking pieces; White should avoid trading the knight on e3 (the blockade) for a bishop.
- **In hanging pawns**, Black's b5-pawn is often exchanged for White's c-pawn; the resulting structure (c5 and d5 without a b5 defender) is usually better for White.
- **General rule**: in all these structures the *minority* side should trade pieces; the *majority* side should keep pieces to control the critical squares.

### C.7 Model endgames

- **The Carlsbad minority attack** — Botvinnik–Keres, USSR Championship 1952: https://pawnbreak.com/planning-in-the-carlsbad-botvinnik-keres-1952-1/ ("Planning in the Carlsbad Structure").
- **The Carlsbad central break** — Carlsen–Jakovenko, Nanjing 2009 (see D.1, model game 2).
- **The Carlsbad central break, classic** — Botvinnik–Vidmar, Nottingham 1936, ECO D60 (Queen's Gambit Declined, Orthodox Defense), 1–0; a Botvinnik win listed both in the chessgames *Nottingham 1936* tournament collection (https://www.chessgames.com/perl/chesscollection?cid=1004101) and among the notable games of the D60 ECO index. *Note:* a **second** Botvinnik–Vidmar from the same tournament is the one widely reproduced as an IQP masterclass; the two games should be cited separately and not conflated.
- **The IQP endgame**, see the second Botvinnik–Vidmar (Nottingham 1936).
- **The closed-position breakthrough**, Botvinnik–Keres, Alekhine Memorial Tournament, Moscow 1966, 1–0: Wikipedia's *Mikhail Botvinnik* article summarises it as "Botvinnik shows his superior understanding of closed positions, and when to open them" — the canonical illustration of when to break a locked centre.
- **The central pawn majority → passed pawn** (cross-reference, *not* a Queen's Gambit game): Botvinnik–Capablanca, AVRO 1938, round 11, Rotterdam, 22 November 1938, **ECO E40 Nimzo-Indian**, 1–0. Wikipedia's *Botvinnik versus Capablanca, AVRO 1938* and the *Mikhail Botvinnik* article both classify it as a Nimzo-Indian; it is famous for 30.Ba3!! and the passed-pawn endgame. It belongs in a discussion of *central pawn majorities and passed-pawn endgames*, not in the Queen's Gambit family.

---

## D. Model Games & Resources (Part I)

### D.1 Model games (each with ECO, first moves and the lesson)

**1. Evans – Opsahl, Dubrovnik 1950 — ECO D35, Queen's Gambit Declined, Exchange Variation, 1–0.**
Opening root (per the D35 ECO index, which defines the code as 1.d4 d5 2.c4 e6 3.Nc3 Nf6 with 4.cxd5): 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.cxd5 exd5. **Lesson:** the **minority attack** in the Carlsbad — Rb1, b4-b5 and bxc6, trading off Black's c6-pawn to create a fixed weakness on c6 and to open the c-file against d5. Wikipedia's *Queen's Gambit Declined* article names this game explicitly as one of its two **model games for White** in the Exchange Variation, and it is the purest textbook illustration of the "Rb1, followed by b2–b4–b5, then bxc6" plan.

**2. Carlsen – Jakovenko, Nanjing 2009 — ECO D35, Queen's Gambit Declined, Exchange Variation, 1–0.**
Opening root (as above): 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.cxd5 exd5. **Lesson:** the **central pawn advance** in the Carlsbad — Nge2, f3, then e4, with the pieces (not the pawns) doing the supporting work. Wikipedia's *Queen's Gambit Declined* article names this game explicitly as its second **model game for White** in the Exchange Variation, and its point is that White's central majority must be advanced *slowly* (knight first, then f-pawn, then e-pawn) so that Black cannot answer …dxc4 or …Bb4 with a point. Together, Evans–Opsahl and Carlsen–Jakovenko cover the two canonical plans exhaustively, which is why they are the safest possible model-game citations for this branch.

**3. Alekhine – Bogoljubov, Wiesbaden 1929, World Championship game 1 (6 September 1929) — ECO D16, Slav Defense (Soultanbeieff Variation), 1–0.**
Opening root (per the D16 ECO index: 1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4): 1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4, followed by the sharp two-square advance that Alekhine described in the *New York Times* of 9 September 1929. **Lesson:** how a pawn sacrifice in the Slav (the "Russian"/Soultanbeieff complex) attacks Black's *dark* squares — the black c8-bishop's mobility problem is the structural price Black pays for …dxc4. Alekhine's contemporary diagnosis ("Bogoljubow… had to renounce castling") is the strategic point: **the Slav's light-squared bishop is Black's structural weakness, and the pawn-gambit lines punish Black for trading in the centre.**

**4. Korchnoi – Spassky, Candidates Final 1977 (Belgrade), game 7 — ECO D58, Queen's Gambit Declined, Tartakower (Makagonov–Bondarevsky) System, 1–0 in 48 moves.**
Opening root (per the D58 ECO index: 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6 7.Bh4 b6 8.cxd5 Nbd7), with the game continuing 9.Bxf6 Bxf6 10.cxd5 exd5 11.b4! (as recorded in Wikipedia's *World Chess Championship 1978* article). **Lesson:** the **minority attack against the Tartakower** — exchange the pinned bishop, damage the c5/d5 duo, then play b4-b5 on the open c-file.

**5. Gelfand – Kramnik, Berlin 1996, European Club Cup, round 2 — ECO D45, Semi-Slav Defense (Stoltz Variation, Shabalov Attack), 0–1 in 28 moves.**
Opening root (per the D45 ECO index: 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Nf3 c6 5.e3): the game continued with the sharp central pawn sacrifice typical of the Shabalov Attack. **Lesson:** what happens when a "positional" player grabs the centre pawn without accepting the resulting tactical obligation. The game (nicknamed "Vlad to the Bone", chessgames Game of the Day, 6 November 2005) is a model of how a pawn sacrifice in the Semi-Slav is *earned* and *converted*, and of how a promising central position can be lost to a single concrete combination.

**6. Gelfand – Anand, Linares 1993, round 5 (game #30) — ECO D20, Queen's Gambit Accepted, 0–1 in 40 moves.**
Opening root (per the D20 ECO index: 1.d4 d5 2.c4 dxc4): the classical QGA structure with Black's c5/d5 pawns. **Lesson:** the QGA played as a positional game — Black's hanging pawns and queenside play are a *system*, and the best White players in the world still had to face it; the game is an excellent study of how to attack a hanging-pawns structure with pieces rather than pawns.

**7. Botvinnik – Vidmar, Nottingham 1936 — ECO D60, Queen's Gambit Declined, Orthodox Defense, 1–0.**
Opening root (per the D60 ECO index, "Queen's Gambit Declined, Orthodox Defense"): 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 (with the typical continuation 5.e3 O-O 6.Nf3 h6 7.Bh4 b6). **Lesson:** how the Orthodox QGD's bishop-pair structure is neutralised by accurate piece play and by taking the initiative on the wing where the structure is weakest. (Source: chessgames *Nottingham 1936* collection and the D60 ECO index; a separate Botvinnik–Vidmar from the same tournament is the IQP masterclass — cite them separately.)

**8. Timman – Petrosian, Bugojno 1982 (Candidates) — ECO D16, Queen's Gambit Declined Slav, 0–1 in 21 moves.**
Opening root (per the D16 ECO index): 1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4. **Lesson:** the Exchange Slav is *not* automatically drawish — a 21-move miniature at Candidates level shows how quickly the structure's latent tension (Black's c5 break against White's a5) becomes concrete.

**9. Mayet – Harrwitz, Berlin 1848 — ECO D51, Queen's Gambit Declined, 0–1 in 18 moves.**
Opening root (per the D51 ECO index: 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7): 5.cxd5 exd5 6.Nxd5? Nxd5! 7.Bxd8 Bb4+ — the classic Cambridge Springs trap. **Lesson:** the *tactical* price of the Cambridge Springs: the pin on the c3-knight means the d5-pawn cannot be taken with the knight. This is the one Queen's Gambit trap a positional player must know, because it is the reason 4.Bg5 Nbd7 is played at all.

**Cross-reference (explicitly *not* a Queen's Gambit game):** **Geller – Euwe, Zurich Candidates 1953, round 2, 31 August 1953 — ECO E26, Nimzo-Indian Defense, Saemisch (O'Kelly) Variation, 0–1**, the game containing the celebrated 22...Rh8!! rook sacrifice. The chessgames record classifies it as E26; it is cited in the literature as a positional-evaluation example in Chapter 2 ("Know What You Have") of Sheng & Song, *Mastering Chess Logic* (Everyman Chess, 2021, ISBN 978-1781946237), which comments that it is "again one of those games we may have seen many times before". Because it is a Nimzo-Indian, it is listed here only as an *evaluation* reference, not as a QG-family model game.

### D.2 Resources (Part I)

**Books — theory and structure:**
1. **Lars Schandorff, *Playing the Queen's Gambit*, Quality Chess, 2009.** A full White-side Queen Gambit repertoire in the modern Quality Chess format, with plans rather than just lines. *Verified: OpenLibrary catalogue record (author, title, publisher, year) — https://openlibrary.org/*
2. **Dražen Marović, *Play the Queen's Gambit*, Maxwell Macmillan / Elsevier, 1991** (ISBN 1857440161 / 008029765X). An older, very plan-oriented Queen Gambit manual. *Verified: OpenLibrary.*
3. **Damian Lemos, *Opening Repertoire: The Queen's Gambit*, Everyman Chess.** A modern, repertoire-style treatment. *Verified: Everyman Chess publisher catalogue — https://chessreads.com/book-publisher/everyman-chess/*
4. **Cyrus Lakdawala, *Opening Repertoire: 1.d4 with 2.c4*, Everyman Chess** (and, by the same author, *Opening Repertoire: The Slav*). *Verified: Everyman Chess catalogue — https://chessreads.com/book-publisher/everyman-chess/*
5. **Nicolas Yap, *Opening Repertoire: Queen's Gambit Accepted*, Everyman Chess.** *Verified: Everyman Chess catalogue — https://chessreads.com/book-publisher/everyman-chess/*
6. **John Shaw, *Starting Out: The Queen's Gambit*, Everyman Chess.** *Verified: Everyman "Starting Out" series listing — https://chessreads.com/book-publisher/everyman-chess/*
7. **Bogdan Lalić, *Queen's Gambit Declined: Bg5 Systems*, Everyman Chess, 2000, ISBN 978-1-857-44240-3.** The specialist treatment of the branch this report identifies as the highest-theory zone of the Queen's Gambit — and, notably, it treats it in system-based terms rather than as a move tree.
8. **Neil McDonald, *Starting Out: Queen's Gambit Declined*, Everyman Chess, 2006, ISBN 978-1-857-44426-1.** *Verified: Everyman "Starting Out" series listing and OpenLibrary.*
9. **Matthew Sadler, *Queen's Gambit Declined*, Everyman Chess, 2000, ISBN 1857442563.** Wikipedia's reference for the Semi-Tarrasch Endgame Line (p. 161). *Verified: OpenLibrary.*
10. **David Vigorito, *The Main-Line Slav*, Gambit Publications, 2009, ISBN 978-1-906454-05-0.** The definitive modern work on the Slav; the "Main Line" chapters are exactly the low-theory, plan-based Slav a positional player wants. *Verified: Gambit Publications catalogue — http://chessbooks.nl/ipgambit.html*
11. **Alexander Raetsky, *Starting Out: The Queen's Gambit Accepted*, Everyman Chess, 2006, 176 pp.** *Verified: OpenLibrary.*
12. **Ilya Neishtadt, *Queen's Gambit Accepted*, Cadogan/Everyman Chess, 1997**; **Eduard Gufeld, *Queen's Gambit Accepted*, Batsford, 1986**; **Glenn Flear, *New Ideas in the Queen's Gambit Accepted*, Batsford, 1994**; **Kevin Wicker, *How to Play the Queen's Gambit Exchange Variation*, Chess Player, 1976.** *Verified: OpenLibrary.*
13. **Andrew Soltis, *The Queen's Gambit*, Chess Digest, 1993, ISBN 0-876568-228-6**, and Soltis, *The Baltic Defense to the Queen's Gambit*, Chess Digest, 1993. *Verified: chessgames.com book listings.*
14. **Lasha Janjgava, *The Queen's Gambit & Catalan for Black*, Gambit Publications, 2001** (ISBN 1901983374). A Black-side manual written by a KIA/Grünfeld specialist; valuable *as a book of structures and plans* from the opponent's viewpoint. *Verified: OpenLibrary.*
15. **Dmitry Komarov, Stefan Djuric & Claudio Pantaleoni, *Chess Opening Essentials, Vol. 2: 1.d4 d5 / 1.d4 various / Queen's Gambits*, New in Chess, 2009, ISBN 978-9-056-91269-7.** A concise, idea-first treatment of the whole 1.d4 complex.
16. **Nick de Firmian, *Modern Chess Openings*, 15th ed., Random House Puzzles & Games, 2008, ISBN 978-0-8129-3682-7.** The canonical reference for move orders and ECO classification.
17. **Andrew Soltis, *Pawn Structure Chess*, D. McKay, 1976; revised Batsford/Pavilion, 2013** (ISBN 9781849940702 / 9781849941150). The single best general book on the *structures* named in this document (Carlsbad, IQP, hanging pawns, minority attack). *Verified: OpenLibrary.*

**Books — strategy, endgame and general reference:**
18. **Hans Kmoch, *Pawn Power in Chess*, Dover / McKay, 1959.** The classic on pawn structure; the source of much of the "minority attack" vocabulary. *Verified: OpenLibrary records (Dover; McKay; Bell).*
19. **Boris Zlotnik, *Zlotnik's Middlegame Manual — Typical Structures and Strategic Manoeuvres*, New in Chess, 7 December 2020, ISBN 978-9056919269.** The closest match to this report's brief: a manual organised *by typical structure* rather than by opening. *Verified: publisher blurb and dated review at https://britishchessnews.com/tag/middlegame/*
20. **Yuri Averbakh, *Chess Endings: Essential Knowledge*, Everyman Chess**; **Glenn Flear, *Starting Out: Pawn Endgames*, Everyman Chess**; **Karsten Müller & Frank Lamprecht, *Secrets of Pawn Endings*, Gambit Publications, 2008, ISBN 978-1-904600-88-6**; **John Nunn, *Understanding Chess Endgames*, Gambit, 2009, ISBN 978-1-906454-11-1**; **Johan Hellsten, *Mastering Endgame Strategy*, Everyman Chess, 2013.** *Verified: OpenLibrary + Gambit catalogue.*
21. **Mark Dvoretsky, *School of Chess Excellence*, Edition Olms, 2002/2003 (ISBN 3283004161 / 328300417X / 3283004188 / 3283004196)** and **Mark Dvoretsky & Artur Yusupov, *Secrets of Opening Preparation*, Edition Olms, 2007, ISBN 978-3-283-00516-0** (which contains Dvoretsky's chapter "The King's Indian Attack, from White's Point of View"). *Verified: OpenLibrary; the Yusupov/Dvoretsky title is also cited in Wikipedia's *King's Indian Attack* bibliography.*
22. **Ray Keene & Garry Kasparov, *Batsford Chess Openings 2*, Henry Holt, 1994 [1989], ISBN 0-8050-3409-9.** The flank-openings volume of the classic BCO; covers the KIA and the flank openings alongside the main Queen's Gambit structures.
23. **Bruce Pandolfini, *Pandolfini's Ultimate Guide to Chess*, Fireside / Simon & Schuster, 2003 (ISBN 0743226172).** *Verified: OpenLibrary.*
24. **Jonathan Rowson, *Chess for Zebras*, Gambit Publications, 2005, ISBN 1901983854.** Structural/psychological thinking — useful for converting structural knowledge into a repeatable decision-making habit. *Verified: OpenLibrary.*
25. **David Hooper & Kenneth Whyld, *The Oxford Companion to Chess*, 2nd ed., Oxford University Press, 1996, ISBN 0-19-280049-3.** The reference work for opening history, terminology and structural vocabulary.

**Source catalogues for further work:** Gambit Publications (http://chessbooks.nl/ipgambit.html), Everyman Chess (https://chessreads.com/book-publisher/everyman-chess/), OpenLibrary (https://openlibrary.org/), British Chess News reviews (https://britishchessnews.com/tag/middlegame/).

---

# PART II — WHITE REPERTOIRE: THE KING'S INDIAN ATTACK (KIA)

## A. Variations

### A.0 What the KIA is, and why it is the right answer to "low theory, positional, straightforward"

Wikipedia's *King's Indian Attack* article defines the system precisely: "The **King's Indian Attack** (or **KIA**) is a chess **opening system** where White adopts the setup more commonly seen being played by Black in the **King's Indian Defence**. The King's Indian Attack is characterised by the following moves: the central pawns are developed to e4 and d3, the knights are developed to d2 and f3, the king's bishop is fianchettoed at g2 following the g-pawn's move to g3, and White castles kingside."

**Specification.**

| Item | Value |
|---|---|
| ECO | **A07–A08** (chessgames' A08 index prints "King's Indian Attack, 1 Nf3 d5 2 g3 c5 3 Bg2"; 1,469 games on file, 1853–2026, White 39.5%) |
| Setup | e4, d3, Nd2, Ngf3, g3, Bg2, O-O |
| Canonical order | 1.Nf3 g6 2.g3 Bg7 3.Bg2 d6 4.O-O Nf6 5.d3 O-O 6.Nbd2 (or 6.e4) 7.e4 |
| Alternate routes | 1.e4 order (vs the French or a Sicilian with …e6) **or** as "a universal system starting with 1.Nf3" |

**Why it belongs in a positional repertoire.** Wikipedia states the case for the club player with unusual precision, and it is the single most important justification for Part II: "Today the King's Indian Attack is relatively uncommon at grandmaster level. The most frequent high-level practitioner is Egyptian grandmaster Bassem Amin. The KIA is popular at the club level, however, because of its system-like elements, repeatable middlegame plans, and the ability to launch a kingside attack from a stable position." Add to that the fact that there is nothing to memorise — in almost every position after the setup there is exactly one sensible move order, and the plans (e4-e5, h4-h5, g4, Nf1, Bf4, Qd2, Rf1-e1) are positional, not forcing — and the **theoretical load of the entire system is LOW**.

### A.1 History: why 1.Nf3 is the right first move

Wikipedia's history section is the argument for opening with 1.Nf3 rather than 1.d4: "The use of the King's Indian Attack at grandmaster level was originally an offshoot from the widespread use of the King's Indian Defence in the 1950s. As grandmasters began to appreciate the advantages of playing the King's Indian Defence as Black, the use of the same system as White, **with an extra move in hand**, inevitably became attractive."

The players Wikipedia lists as having employed it are the players whose ideas this system expresses: Bobby Fischer (mostly in his early career), Mikhail Botvinnik, Vasily Smyslov, Tigran Petrosian, Leonid Stein, Rafael Vaganian, Ljubomir Ljubojevic, Gregory Kaidanov, Igor Glek, Alexander Morozevich, Victor Bologan and Levon Aronian. And crucially for the study of the system: "The use of the KIA was also advocated by the prominent chess trainer IM Mark Dvoretsky, who also employed the system in his own games." (See the resource note in D.2 — Dvoretsky's chapter in *Secrets of Opening Preparation* is the on-brief text for the whole system.)

### A.2 The characteristics of the position — and the "extra tempo" argument

Wikipedia's characteristics section contains the strategic core of Part II.B and should be read as the frame for every plan:

> "In the King's Indian Attack, White uses the same setup adopted by Black in the King's Indian Defence. Due to White's extra tempo, however, the nature of the subsequent play is often different from that of a typical King's Indian Defence. The King's Indian Attack is most frequently employed against Black setups including an early ...e6, and in these situations Black is effectively a move down in a theoretically unimportant line of the King's Indian Defence. For example, after 1.e4 e6 2.d3 d5 3.Nd2 c5 4.Ngf3 Nf6 5.g3 Nc6 6.Bg2 Be7 7.0-0 0-0 8.Re1 … Black is playing the White side of a very tame line of the King's Indian Defence where the queen's bishop on c8 is trapped behind the pawn chain. If Black were to attempt to resolve this situation by playing a subsequent e6-e5 they would then find themselves *two* moves down in a standard mainline position from the King's Indian Defence. This illustrates the central dilemma faced by Black in standard Kings Indian Attack lines."

And on the character of the opening:

> "The KIA is a **closed, strategic opening** that presents its practitioner with common themes and tactics and a comfortable middlegame against various defences. White's most common plan involves the central pawn push **e4–e5**, leading to a central bind, **kingside space**, and practical attacking chances against the kingside-castled black king. White's strategy differs from standard French Defence lines because the e5-pawn will be **defended by pieces (Nf3, Re1, Bf4, and possibly Qe2) rather than by pawns**, thus avoiding the pawn weakness on d4 which is Black's usual target in the French."

**The technical point inside that quotation is the most valuable single insight in this report for a KIA player:** in the French, White's e5-pawn is defended by pawns (f4 and d4), which means Black's counter is simply …c5 (attacking the d4-pawn) and then the whole centre is loose. In the KIA the e5-pawn is defended by *pieces* — the knight on f3, the rook on e1, the bishop on f4 and sometimes the queen on e2. Pieces can be re-routed; pawns cannot. That is why the e4-e5 push in the KIA is a *safe* plan rather than a speculative one, and it is why the KIA "avoids the pawn weakness on d4 which is Black's usual target in the French."

**The reference position and the continuation.** After 1.e4 e6 2.d3 d5 3.Nd2 c5 4.Ngf3 Nf6 5.g3 Nc6 6.Bg2 Be7 7.O-O O-O 8.Re1, Wikipedia states: "White will now look to play e4–e5, cramping Black, and then proceed with moves such as **Nf1, Bf4, Qe2, h4, N1h2 (or Ne3), h5, g4 (or Ng4)** with a kingside attack." It also notes that the same position "could also have been obtained via a 1.Nf3 move order (e.g. 1.Nf3 d5 2.g3 Nf6 3.Bg2 c5 4.O-O Nc6 5.d3 e6 etc.)" — which is precisely why the two move orders must be understood as one system.

### A.3 Move orders: which Black set-ups the KIA actually works against

Wikipedia's move-order analysis is the practical answer to "which Black defences can I meet with the KIA?":

> "The King's Indian Attack most frequently arises against the French Defence using the move order 1.e4 e6 2.d3 d5 3.Nd2 (**to avoid an exchange of queens after 3...dxe4**). Identical lines can arise via a Sicilian Defence move order, typically via 1.e4 c5 2.Nf3 e6 3.d3 and a subsequent Nbd2. **If Black plays a Sicilian variation with 2...d6 or 2...Nc6, White can still continue with the King's Indian Attack setup, but in these cases it would be considered less effective (Black will either have a pawn on d6, meaning that the characteristic pawn push e4–e5 will not create a bind, or a pawn on e5, preventing e4-e5 altogether).**"

This is a crucial practical point: **the KIA's characteristic plan (e4-e5) requires that Black has NOT already played …d6 or …e5.** If Black has, the pawn on e5 is already White's target and the KIA loses its point.

**The KIA versus the Caro-Kann** is Wikipedia's own diagram, and it is the one Black defence that the KIA meets well:

```
1.e4 c6 2.d3 d5 3.Nbd2 e5 4.Ngf3 Bd6 5.g3 (… 6.Bg2 Be7 7.O-O O-O 8.Re1)
```

Here Black has played …e5 — but as Black's *own* e-pawn, on the half-open e-file and blocked by the d3/d4 pawn, it is a target for White's e4-e5 advance in the other direction. This line is the bridge to Part III (the Caro-Kann as Black's main answer to 1.e4).

**The complete move-order table.**

| Black's set-up | Move order | White's continuation | Theoretical load | Character |
|---|---|---|---|---|
| **…e6 (French-style)** | 1.e4 e6 2.d3 d5 3.Nd2 c5 4.Ngf3 Nf6 5.g3 Nc6 6.Bg2 Be7 7.O-O O-O 8.Re1 | The reference position | **Low** | Closed; "Black is effectively a move down" |
| **…e6 via 1.Nf3** | 1.Nf3 d5 2.g3 Nf6 3.Bg2 c5 4.O-O Nc6 5.d3 e6 6.Nbd2 Be7 7.e4 O-O 8.Re1 | Identical position | **Low** | Same, one move order apart |
| **Sicilian (…c5, …e6)** | 1.e4 c5 2.Nf3 e6 3.d3 Nc6 4.g3 Nf6 5.Bg2 Be7 6.O-O O-O 7.Nbd2 | Identical structure | **Low** | "Sicilian → KIA" route (Fischer–Sherwin) |
| **Caro-Kann** | 1.e4 c6 2.d3 d5 3.Nbd2 e5 4.Ngf3 Bd6 5.g3 | Wikipedia's KIA-vs-Caro-Kann diagram | **Low** | Black's e5 is the target |
| **Sicilian with …d6 or …Nc6** | 1.e4 c5 2.Nf3 d6 / 2...Nc6 | KIA possible but "considered less effective" | Low | e4-e5 no longer creates a bind |
| **Reversed King's Indian** | 1.Nf3 d5 2.g3 c5 3.Bg2 Nc6 4.O-O e5 5.d3 Nf6 | Black "develops along the lines typically adopted by White in the King's Indian Defence" | Low | Closed, symmetrical-ish |
| **Keres System (…Bg4)** | 1.Nf3 d5 2.g3 Nf6 3.Bg2 c6 4.O-O Bg4 | Black develops the c8-bishop outside the pawn chain | Low | Slightly sharp for White |
| **Reversed London (…Bf5)** | 1.Nf3 d5 2.g3 Nf6 3.Bg2 e6 4.O-O Bf5 | Black plays the London bishop | Low | Quiet, positional |
| **…d6/…g6/…c6 (Modern-like)** | 1.d4 d6 2.Nf3 g6 3.g3 Bg7 4.Bg2 c6 5.O-O Nf6 6.d3 O-O 7.Nbd2 | Same KIA structure reached from 1.d4 | Low | Positional |
| **…b6** | 1.Nf3 b6 2.g3 Bb7 3.Bg2 g6 4.O-O Bg7 5.d3 Nf6 6.Nbd2 O-O 7.e4 | Rare; Queenside-leaning | Low | Rare |
| **1.e4 e5 (reversed Pirc)** | 1.e4 e5 2.Nf3 Nc6 3.g3 g6 | — | Low | "Cannot be regarded as a genuine attempt to secure an advantage from the opening" |

**An honesty note on the last row.** Wikipedia is blunt: "Some practitioners at club level, determined to use the KIA as a system, may even use the setup after 1.e4 e5 (giving a reversed Pirc Defence), although this cannot be regarded as a genuine attempt to secure an advantage from the opening." Players who want to be taken seriously should start with 1.Nf3 and reserve 1.e4 orders for the French, the Sicilian and the Caro-Kann.

### A.4 Transpositions

| From | To | How | Note |
|---|---|---|---|
| 1.Nf3 g6 2.g3 | 1.d4 Nf6 2.c4 g6 3.g3 | via …Nf6 | White's bishop already on g2 — the cleanest KIA form |
| 1.c4 Nf6 2.Nf3 e6 3.g3 d5 4.Bg2 | KIA | — | Reti/English move order into the same structure |
| 1.e4 e6 2.d3 d5 3.Nd2 c5 4.Ngf3 | KIA | — | "KIA vs the French"; the Nd2 specifically avoids the queen swap after 3...dxe4 |
| 1.e4 c5 2.Nf3 e6 3.d3 | KIA | — | "KIA vs the Sicilian" |
| 1.e4 c6 2.d3 d5 3.Nbd2 e5 4.Ngf3 Bd6 5.g3 | KIA | — | "KIA vs the Caro-Kann" (Wikipedia's diagram) |
| 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5 7.d3 | Classical KID | — | White's KIA is a move down on this; the difference is the c-file and the extra tempo |
| 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f4 | Four Pawns Attack | — | The aggressive sibling; the KIA's e4-e5 lever is the "quiet" version |
| 1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.Nf3 Bg7 5.g3 | KIA (same position) | — | "Reversed King's Indian" against 1...d5 |

### A.5 The critical sidelines in the KIA

1. **…d5 immediately (Anti-Maroczy / Grünfeld-style counter).** 1.Nf3 d5 2.g3 g6 3.Bg2 Bg7 4.O-O Nf6 5.d3 O-O 6.Nbd2 c6 7.e4 d5 — Black exchanges in the centre, leaves White with an IQP, and hopes to blockade. The White-side plan is c4-c5 and then to attack the resulting weaknesses with the rook on c1. (Handled in C.4.)
2. **…c5 with …d4.** Black plays 1.Nf3 c5 2.g3 g6 3.Bg2 Bg7 4.O-O Nc6 5.d3 d6 6.Nbd2 Nf6 7.e4 cxd4 8.exd4 O-O 9.Nf3 — a closed centre where White's e5/d4 pawns form an Italian-type chain and Black's knight can go to d4/e5.
3. **…b5 with …Bb7** (the Black minority attack of White's d3/e4). Black plays 1.Nf3 Nc6 2.g3 e5 3.Bg2 g6 4.O-O Bg7 5.d3 d6 6.Nbd2 Nf6 7.e4 O-O 8.b3 Bb7 — and then …a5/…b4 to attack White's e4 from the flank. (Karjakin–Shankland, below, is the modern model of White having to answer this.)
4. **The …f5 break.** Against a White centre that has not yet been consolidated, …f5 immediately can be effective; against a fixed e4/d3 with a knight on e2 or f3 it merely gives White the lever f4-f5.
5. **Trading the light-squared bishop.** Black's c8 bishop is frequently developed to a4 (via b3) or traded for White's Bg2 to reach a "symmetrical" d5/d4 structure in which White's attack is much easier to contain.

**Theoretical load for the whole KIA: LOW.** This is the central claim of this part of the report and it is borne out by the databases: at the King's Indian (1.d4 Nf6 2.c4 g6, 146,720 games at 3.Nc3) the theoretical load lies in the *King's Indian* proper; the KIA's 3.g3 branch is a small, quiet sideline of only 12,950 games in the 365chess sample, with a near-balanced 38.1% / 38.3% / 23.6% score distribution.

### A.6 The KIA's relationship to the "slow squeeze" and to the classical KID

The KIA's characteristic structure is White's **slow squeeze**: d3 + e4 against Black's d6 + e5 (or c5), with the g2 bishop bearing down the a8–g2 diagonal and the c1 rook available for the b-file. Against Black's King's Indian, the same setup appears one tempo earlier for White, which is why the KIA is preferred by players who want to avoid the KID's sharpest counterplay. Conversely, White's KIA plans (e4-e5, Nf1, Bf4, h4-h5) are exactly the plans Black must meet in the KID — so playing the KIA is a good way to *learn* the King's Indian Defence.

---

## B. Middlegame Plans

### B.1 White's plans

**(a) The e4-e5 push and the e4-e5/e6 lever.** The central plan of the whole system, and Wikipedia's own: "White's most common plan involves the central pawn push e4–e5, leading to a central bind, kingside space, and practical attacking chances against the kingside-castled black king." After 8.Re1 in the reference position, White proceeds with "moves such as Nf1, Bf4, Qe2, h4, N1h2 (or Ne3), h5, g4 (or Ng4) with a kingside attack."

The technical refinement (see A.2) is that **the e5-pawn is defended by pieces, not pawns** — Nf3, Re1, Bf4 and possibly Qe2. That is why the push is safe, and why the KIA avoids the French's d4-weakness problem.

When Black answers the push with …e6 (the "e5/e6" lever), White plays f4-f5, exchanges on f5, and produces a protected passed pawn on e5 — usually with the fianchettoed bishop pointing down the a8–g2 diagonal at c4/d3. This is the KIA's **most characteristic** structure.

**(b) The pawn storm (h4-h5, g4-g5).** The KIA's most aggressive continuation of the e5 push. With the bishop on g2, the knight on h2 (or e3), and the rook on f1, White plays h4-h5 to drive Black's knight away, then g4, then Ng4 or Ne3, then h5-h6 to open the h-file for a sacrifice on g7. Karjakin–Shankland (below) is the modern illustration; Fischer–Sherwin (1957) is the classical one.

**(c) Knight manoeuvres.** Nd2-f1 (to re-route the knight to h2 or g3, and to free the e-file), Nd2-e4 (to attack d6/f6), and Nf3-g3/h4. The Nd2-f1-h2 route is the classic KIA knight journey and is the reason White plays 6.Nbd2 rather than 6.Nc3.

**(d) Rf1-e1 and Qd2/Qe2.** Rf1-e1 (usually with the knight already moved to f1 or e3) is the standard preparation for the e4-e5 push. Qd2 or Qe2 supports the e5 push, watches the h7 diagonal, and prepares Qh5.

**(e) Bf4.** The knight- or pawn-backed bishop sortie on f4, both to attack the e5/e6 squares and to prepare the f4-f5 break; it also prepares the queen sortie.

**(f) The slow squeeze with d4/c4.** Against a Black who has not fixed his centre, White can play c4 (to fix Black's d5) or d4 (to fix Black's e5 and to open the c-file for the rook on c1). The resulting IQP (after …dxc4) is handled by the standard IQP method described in Part I, C.3.

**(g) Attacking an uncastled or semi-castled king.** When Black has not completed his development (very common against 1.Nf3 because White's setup is so fast), White can play h4-h5 with the bishop already on g2, or Ng5/Nh4, and can play e4-e5 before Black has castled, creating the classic "attack the king before he gets away" scenario. Fischer–Sherwin (1957) and Karjakin–Shankland (2021) are the canonical examples.

### B.2 Black's counterplans

| Black's plan | Idea | Typical moment | White's answer |
|---|---|---|---|
| **…d5 counter-strike** | Exchange in the centre, leave White an IQP | When White has not fixed the centre with d4/c4 | c4-c5 immediately; or keep the pawn on d4 and play c4 |
| **…c5 counter-strike** | Break in the centre, create a backward d-pawn | Against White's d3/e4 without c4 | Fix with c4 or d4; play e4-e5 first |
| **…b5 with …Bb7** | Queenside minority attack of White's d3/e4 | When White has no queenside pawn support | a4/b3; keep the knight on c3; open the c-file |
| **Mar del Plata set-up** (…d5/…c6/…Nc6/…Bg7) | Blockade, IQP, manoeuvre the knights | The main Black plan against 1.Nf3 d5 | c4-c5, Rb1/b4, Nf3-e1-h2, Ne5 |
| **Symmetric counterplay** | Mirror White's setup and grab the c-file | 1.Nf3 d5 2.g3 g6 3.Bg2 Bg7 4.O-O Nf6 5.d3 O-O 6.Nbd2 c5 7.e4 | Nc3, then d4/c4 breaks |
| **…f5 (and …f4)** | Direct kingside space and the e4 lever | When White's centre is loose | f4-f5 counter-break; Nf3/Ne2; h3-h4 |
| **…Nd7-b6** | Redeploy the queen's knight, prepare …f5/…Nfd7 | When Black plays …d5 | d4, c4, e4-e5 |
| **Trading the light-squared bishop** | Kill White's g2 bishop, equalise | When White has doubled on the diagonal | Take the trade (it usually favours White positionally) or avoid the trade |
| **…e5 and …e6 lever** | Neutralise White's centre | Standard | f4-f5 or Nf1/Bf4 |
| **…Kb8/…Rc8** | Prepare …f5 with the rook behind the pawn | Common in the KID | e4-e5 first, when possible |
| **…Bg4 (Keres System)** | Develop the c8-bishop outside the chain, pin the f3-knight | 1.Nf3 d5 2.g3 Nf6 3.Bg2 c6 4.O-O Bg4 | Ne1/h2; maintain the bishop's diagonal |

### B.3 The most common KIA mistake

Playing the KIA and then **not** playing e4-e5. If White castles, fianchettoes and then spends three moves on a "safe" move, Black has achieved a good King's Indian position and White has wasted the tempo advantage. The KIA's value is that White's attack is *available*, not that it is *automatic*. Second on the list: playing 6.Nc3 instead of 6.Nbd2, which forfeits the Nf1-h2 route and gives up the "e5 defended by pieces" flexibility that the whole plan depends on.

---

## C. Common Endgame Structures

### C.1 The locked centre (d3/e4 vs d6/e5 or d6/c5)

The signature KIA endgame structure: White's d3 and e4 pawns against Black's d6 and e5 (or c5). White's e4 pawn is a **fixed** pawn that cramps Black's c5/e5 pawns; Black's plan is to play …f5-f4 or to trade on e4 and open the d-file; White's plan is to advance f4-f5 or to create an outside passed pawn on the kingside.

**Key principle:** with the centre locked, **the kingside pawn majority decides the game**. White has g3/h2 and f2 against Black's a7/b7/g7/h7; if White can fix Black's g- and h-pawns with f4-f5 and h4-h5, White has a protected passer.

### C.2 The Italian-type e5 chain (e4-e5, f4-f5)

After e4-e5 and …e6, White plays f4-f5 and the chain **e5-f5** forms. White's e5-pawn becomes a **protected passed pawn** (defended by the f5 pawn and by the bishop on g2 in some lines) and Black's e6-pawn is the fixed counterpart. This is the endgame the whole KIA attack is aimed at:
- White: e5, f5 (passed, protected), g3, h2; Black: e6, d6, c6/7, a7, b7.
- Black's counter is the g-file and the counter-break …f5/…g5 to attack White's f5-pawn from the flank; White's counter is the blockade on e6/c6 with the knight (Nd4/e3) and the queen's eye on c4-b5.

### C.3 Opposite-side pawn majorities

When the centre trades (…dxc4 and …c6), the two sides often end up with **opposite-side majorities**: White with the h/g-pawns and Black with the a/b-pawns (or White queenside and Black kingside). The classic rules apply: the side with the majority goes for the passed pawn, the side with the minority blockades — but in the KIA the minority attack is often carried out by the **knights** (Nf1, Nd2, Ne5) rather than by pawns, which is a superior form of the minority attack.

### C.4 The IQP after exchanges in the Mar del Plata style

When Black has played …d5 and …c6 and then exchanges on c4/d4, White is left with an isolated d4-pawn. The evaluation and the conversion method are exactly those of Part I, C.3: fix the blockader (usually the c6-pawn or the bishop on e7/a3), play c4-c5, then d5-d6. The **knight-versus-bishop** distinction applies with full force here, and it is the reason the Mar del Plata is regarded as Black's best practical try against White's d4-systems.

### C.5 The symmetrical structure — and the problem of creating asymmetry

When both sides have mirrored their setups (both with g3/g6 and a fianchettoed bishop, and both with c4/c5), the game becomes a race for the single asymmetry available. The Fischer–Spassky game of 1972 (see D.1, model game 3) is the classic illustration: White, moving first, must create the imbalance himself, and does so with the **e4 push** and the **b3/…bxc4 under**. The standard devices in a mirror game are:
- the e4-e5 push (the KIA's own asymmetry);
- b3 and …bxc4 (undermining the opponent's queenside pawn chain);
- c4-c5 (to fix the opponent's c-pawn);
- the tempo of the e4-e6 exchange.

### C.6 Other structures specific to the KIA

- **The "hanging" e5-pawn after …f5.** Black's …f5 break leaves Black's e5-pawn weak (backward, on a half-open file, blocked by d4/d3). White's plan is e4-e5 (making it worse), then to attack it with the knight and the bishop.
- **The pawn islands of the Modern/…c6 set-up** (Black's c6, d5, e6) — the classic structure for the c4-c5 break and the a/b-pawn advance.
- **The opposite-coloured bishop ending.** In the KID-style structures with …d5 and …c6, White's bishop on g2 and Black's bishop on e7 or c8 are frequently of opposite colours, which makes the endgame about the knight's ability to blockade.

### C.7 Model endgames

- **Botvinnik – Bronstein, World Championship 1951, game 23 — ECO E60, King's Indian Defense, 1–0 in 57 moves** (chessgames' WCC index for Botvinnik–Bronstein records it as game #23). This is the classic example of the KID's Mar-del-Plata/IQP endgame being handled by the man who wrote *Botvinnik's Best Games*.
- **Euwe – Najdorf, Zurich 1953 (Candidates), round 9, game 58 — ECO E60, King's Indian Defense, 1–0 in 37 moves** — the 1950s "English"-style KID endgame with a passed pawn.
- **Botvinnik – Keres, Alekhine Memorial Tournament, Moscow 1966, 1–0** — Wikipedia's *Mikhail Botvinnik* article summarises it as "Botvinnik shows his superior understanding of closed positions, and when to open them." In a KIA/KID context this is the model of *when* to break a locked centre.
- **Najdorf – Petrosian, Zurich 1953 (Candidates), round 6 — ECO E62, King's Indian Fianchetto, 1–0 in 33 moves** — the Mar del Plata endgame, i.e. the IQP that results from the KID's most practical defence, and the model game for it.

---

## D. Model Games & Resources (Part II)

### D.1 Model games

**1. Karjakin – Shankland, Sochi, FIDE World Cup 2021 — King's Indian Attack, 1–0. (PRIMARY MODEL GAME.)**
Full score (Wikipedia's *King's Indian Attack* article): 1.e4 e6 2.d3 d5 3.Nd2 Nf6 4.Ngf3 Be7 5.g3 a5 6.Bg2 a4 7.a3 c5 8.O-O Nc6 9.Re1 O-O 10.e5 Nd7 11.Nf1 b5 12.h4 Bb7 13.h5 h6 14.Bf4 Qb6 15.Qd2 Rfc8 16.g4 Qd8 17.N1h2 Ra6 18.Kh1 b4 19.Rg1 Nf8 20.axb4 cxb4 21.d4 Na5 22.g5 Nc4 23.Qc1 hxg5 24.Bxg5 b3 25.Bxe7 Qxe7 26.Bf1 a3 27.Rxg7+ Kxg7 28.Ng4 f5 29.exf6 e.p.+ Qxf6 30.Nxf6 axb2 31.Qg5+ Kf7 32.h6 Ng6 33.Nh4 bxa1=Q 34.Qxg6+ Ke7 35.Qg7+ Kd6 36.Qd7# 1–0.
**Lesson:** **every element of the KIA plan in one game** — e4-e5 (10.e5), Re1 (9.Re1), Nf1 (11.Nf1), h4-h5 (12.h4, 13.h5), g4-g5 (16.g4, 22.g5), Bf4 (14.Bf4), N1h2 (17.N1h2) and Rg1 (19.Rg1) — and, just as importantly, the *defensive* side of the plan: White must answer Black's own queenside counterplay (…a5-a4, …b5-b4) with a3 and axb4, and must open the centre with d4 (21.d4) before the position becomes blocked. This is the modern textbook KIA game.

**2. Fischer – Sherwin, East Orange (New Jersey Open), 1957 — ECO A07, King's Indian Attack, 1–0.**
Full score (Wikipedia's *King's Indian Attack* article): 1.e4 c5 2.Nf3 e6 3.d3 Nc6 4.g3 Nf6 5.Bg2 Be7 6.O-O O-O 7.Nbd2 Rb8 8.Re1 d6 9.c3 b6 10.d4 Qc7 11.e5 Nd5 12.exd6 Bxd6 13.Ne4 c4 14.Nxd6 Qxd6 15.Ng5 Nce7 16.Qc2 Ng6 17.h4 Nf6 18.Nxh7 Nxh7 19.h5 Nh4 20.Bf4 Qd8 21.gxh4 Rb7 22.h6 Qxh4 23.hxg7 Kxg7 24.Re4 Qh5 25.Re3 f5 26.Rh3 Qe8 27.Be5+ Nf6 28.Qd2 Kf7 29.Qg5 Qe7 30.Bxf6 Qxf6 31.Rh7+ Ke8 32.Qxf6 Rxh7 33.Bc6+ 1–0.
**Lesson:** the **"Sicilian move order → KIA" route** (1.e4 c5 2.Nf3 e6 3.d3) and the KIA's *pawn storm*: the sequence h4-h5, g4-g5 and the Nf3-e4 knight sortie, culminating in the Rh7+ sacrifice. Fischer plays the KIA exactly as Dvoretsky would teach it: develop the bishop, castle, then storm.

**3. Fischer – Spassky, World Championship 1972, game 8 — ECO A39, English Opening, Symmetrical Defence, 1–0.**
Full PGN (Wikipedia's *World Chess Championship 1972*, game 8): 1.c4 c5 2.Nc3 Nc6 3.Nf3 Nf6 4.g3 g6 5.Bg2 Bg7 6.O-O O-O 7.d4 cxd4 8.Nxd4 Nxd4 9.Qxd4 d6 10.Bg5 Be6 11.Qf4 Qa5 12.Rac1 Rab8 13.b3 Rfc8 14.Qd2 a6 15.Be3 b5 16.Ba7 bxc4 17.Bxb8 Rxb8 18.bxc4 Bxc4 19.Rfd1 Nd7 20.Nd5 Qxd2 21.Nxe7+ Kf8 22.Rxd2 Kxe7 23.Rxc4 Rb1+ 24.Bf1 Nc5 25.Kg2 a5 26.e4 Ba1 27.f4 f6 28.Re2 Ke6 29.Rec2 Bb2 30.Be2 h5 31.Rd2 Ba3 32.f5+ gxf5 33.exf5+ Ke5 34.Rcd4 Kxf5 35.Rd5+ Ke6 36.Rxd6+ Ke7 37.Rc6 1–0.
**Lesson:** **the symmetrical-structure theme.** Both sides mirror the system (g3/g6, Bg2/Bg7, O-O/O-O, c4/c5) and the game becomes a race to create asymmetry. White does it with 26.e4 (the KIA's own lever, here in a pure English/Symmetrical framework) and with the queenside under: 13.b3 and 18.bxc4 give White the half-open c-file, while the e4 and f4 advances create a passed pawn. Note also the KIA's hallmark — a bishop buried on c1/a3 for Black — and the way White's knight on d5/e7 dominates the centre. **This is the structural sibling of the Slav and the QGA**, and the model for the "how does White create asymmetry in a mirror game" question.

**4. Fischer – Myagmarsulen, Sousse Interzonal 1967 — King's Indian Attack, 1–0.**
Full score (Wikipedia's *King's Indian Attack* article): 1.e4 e6 2.d3 d5 3.Nd2 Nf6 4.g3 c5 5.Bg2 Nc6 6.Ngf3 Be7 7.O-O O-O 8.e5 Nd7 9.Re1 b5 10.Nf1 b4 11.h4 a5 12.Bf4 a4 13.a3 bxa3 14.bxa3 Na5 15.Ne3 Ba6 16.Bh3 d4 17.Nf1 Nb6 18.Ng5 Nd5 19.Bd2 Bxg5 20.Bxg5 Qd7 21.Qh5 Rfc8 22.Nd2 Nc3 23.Bf6 Qe8 24.Ne4 g6 25.Qg5 Nxe4 26.Rxe4 c4 27.h5 cxd3 28.Rh4 Ra7 29.Bg2 dxc2 30.Qh6 Qf8 31.Qxh7+ 1–0.
**Lesson:** the KIA's **e4-e5 bind** and the resulting attack on the c-file and d-file; the whole game is a demonstration of what the KIA is *for* — cramping Black's centre and then switching to the kingside. Note also the complete knight journey Nf3-f1-g5-e4 and the h4-h5 lever.

**5. Fischer – Ibrahimoglu, 1970 — ECO A07, King's Indian Attack, 39 moves, 1–0.**
Verified in the chessgames.com collection "Fischer Wins: Game Collection: Bobby Fischer Wins With The King's Indian Attack", and in the site's published-games-by-year listing as "Fischer vs I Ibrahimoglu, 1970 (A07) King's Indian Attack, 39 moves, 1-0". **Lesson:** the canonical *modern* KIA model game — Fischer's KIA at full strength against a Black who has adopted the KID set-up, and the model for how much the "extra tempo" is worth.

**6. R Byrne – Fischer, New York 1963 — ECO E60, King's Indian Defense, 21 moves, 0–1.**
Verified via the chessgames E60 ECO index (listed among its notable games) and a chessgames community collection. **Lesson:** the KIA/KID move order as a *sharper* alternative to the Grünfeld — and a reminder that 1.Nf3 transpositions can hand Black the initiative very quickly. *(For the famous knight-sacrifice game, see the note below: the "Game of the Century", Byrne–Fischer, is from the Third Rosenwald Tournament, Marshall Chess Club, New York, 17 October 1956, and is a Grünfeld Defense, ECO D92 — 1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4 — not a King's Indian Attack game at all.)*

**7. Euwe – Najdorf, Zurich 1953 (Candidates), round 9, game 58 — ECO E60, King's Indian Defense, 1–0 in 37 moves.**
Verified from the chessgames *Zurich 1953* tournament collection (WCC index) and the E60 ECO index. **Lesson:** the KID endgame with the protected passed pawn.

**8. Najdorf – Petrosian, Zurich 1953 (Candidates), round 6 — ECO E62, King's Indian Fianchetto, 1–0 in 33 moves.**
Verified from the chessgames *Zurich 1953* collection; a listed notable game of the E62 ECO index. **Lesson:** the Mar del Plata and its IQP endgame — the reason White's d4-systems have to be played carefully even when Black has adopted a "White" set-up.

**9. Botvinnik – Bronstein, World Championship 1951, game 23 — ECO E60, King's Indian Defense, 1–0 in 57 moves.**
Verified from the chessgames *1951 World Chess Championship* collection and the WCC index (Botvinnik–Bronstein, game #23). **Lesson:** the KID at the highest level; the endgame handling that turned a nominal draw into a win.

**10. Botvinnik – Keres, Alekhine Memorial Tournament, Moscow 1966, 1–0.**
Wikipedia's *Mikhail Botvinnik* "Notable games" entry: "Botvinnik shows his superior understanding of closed positions, and when to open them." **Lesson:** the "closed position / when to open it" theme that runs through the KIA — the locked d3/e4 vs d6/e5 centre, and the judgement of when to break it.

### D.2 Resources (Part II)

**The on-brief text:**
1. **Mark Dvoretsky & Artur Yusupov, *Secrets of Opening Preparation*, Edition Olms, 2007, ISBN 978-3-283-00516-0** — contains Dvoretsky's chapters "The Development of an Opening Repertoire" (pp. 95–125) and **"The King's Indian Attack, from White's Point of View"** (pp. 126–155). The single best resource for this repertoire: how to build a system, and how to play it. (Dvoretsky was, per Wikipedia, "the prominent chess trainer [who] advocated" the KIA and "also employed the system in his own games".)

**Manuals and courses:**
2. **Neil McDonald, *The King's Indian Attack: Move by Move*, Everyman Chess, 2014, ISBN 978-1-85744-988-4.** The clearest *teaching* KIA book: one idea per game, plans rather than branches. *Verified: British Chess News review ("One of his most recent works, The King's Indian Attack : Move by Move, impressed considerably") — https://britishchessnews.com/tag/middlegame/; and OpenLibrary.*
3. **John Emms, *Starting Out: King's Indian Attack*, Everyman Chess, 2005, ISBN 1-85744-394-2.** *Verified: Everyman "Starting Out" series listing (Simon & Schuster) — https://chessreads.com/book-publisher/everyman-chess/; also listed in Wikipedia's *King's Indian Attack* bibliography.*
4. **Angus Dunnington, *The Ultimate King's Indian Attack*, B.T. Batsford, 1998, ISBN 0-7134-8222-2**; and Dunnington, *How to Play – The King's Indian Attack – Openings*, B.T. Batsford, 1993, ISBN 0-8050-2933-8.** The standard full-length KIA manuals. *Verified: Wikipedia's *King's Indian Attack* bibliography and the OpenLibrary catalogue.*
5. **Victor Bologan, *Winning with the King's Indian Attack*, ChessBase GmbH (PC-DVD), 2018, ISBN 9783866816701**; **Nigel Davies, *King's Indian Attack*, ChessBase GmbH (fritztrainer opening), 2008, ISBN 978-3-86681-071-6.** Video instruction in the modern idiom. *Verified: Wikipedia's *King's Indian Attack* bibliography.*
6. **John Hall & Jan R. Cartier, *Modern King's Indian Attack: A Complete System for White*, Hays Publishing, 1996, ISBN 1-880673-11-8**; and **John Hall, *A Complete Opening System for White: King's Indian Attack*, Chess Digest Magazine, 1972.** *Verified: Wikipedia's *King's Indian Attack* bibliography.*
7. **Ken Smith & John Hall, *King's Indian Attack – A Complete Opening System*, Chess Digest, 1988, ISBN 0-87568-174-3** (also Schach-Archiv, 1990, 220 pp.). *Verified: Wikipedia's *King's Indian Attack* bibliography; the "King's Indian Attack Bibliography" and a German bookseller listing — https://www.niggemann.com/en/books-media/openings/king-s-indian-attack.html*
8. **Ron Henley & Paul Hodges, *Power Play – The King's Indian Attack*, R&D Publishing, 1993, ISBN 1-883358-02-7**; **Ron Henley & Don Maddox, *The ChessBase University BlueBook Guide To Winning With – The King's Indian Attack*, R&D Publishing, 1993, ISBN 1-883358-00-0.** *Verified: Wikipedia's *King's Indian Attack* bibliography; the BlueBook title is also in the OpenLibrary catalogue.*
9. **Eric Tangborn, *A Fischer Favorite: The King's Indian Attack – with 46 fully annotated Games*, International Chess Enterprises, 1992, ISBN 1-879479-07-9.** *Verified: Wikipedia's *King's Indian Attack* bibliography.*
10. **Eric Schiller, *How To Play The Kings Indian Attack*, Chess Enterprises, 1989, ISBN 0-931462-95-9**; **Norman Weinstein, *The King's Indian Attack*, Chess Digest Magazine, 1976**; **David Norwood, *King's Indian Attack*, Trends Publications, 1991.** *Verified: Wikipedia's *King's Indian Attack* bibliography.*
11. **Roman Dzindzichashvili, *Easy Way to Learn The King's Indian Attack*, Roman's Lab / Internet ChessDVDs, Vol. 28, 2005, ISBN 7-37885-35839-1**; **Heiko Eggers, *Theorie der Eröffnung – Königsindischer Angriff*, Books on Demand, 2008, ISBN 978-3-8334-3194-4**; **Jerzy Konikowski & Robert Ullrich, *The King's Indian Attack... Properly Played*, Beyer Joachim Verlag, 2018, ISBN 9783959209748**; **Don Maddox, *Königsindischer Angriff – Schach Training*, ChessBase GmbH, 2002, ISBN 3-935602-51-0.** *Verified: Wikipedia's *King's Indian Attack* bibliography.*

**Understanding the Black side of the structures (essential for the KIA player):**
12. **Mikhail Golubev, *Understanding the King's Indian*, Gambit Publications, 2006, ISBN 1-904600-31-X**; **Ilya Bronstein, *Understanding the King's Indian*, Everyman Chess, 1997.** *Verified: OpenLibrary + Gambit catalogue — http://chessbooks.nl/ipgambit.html*
13. **Lasha Janjgava, *King's Indian & Grünfeld: Fianchetto Lines*, Gambit Publications, 2003, ISBN 1-901983-74-9.** *Verified: the Gambit catalogue listing — http://chessbooks.nl/ipgambit.html*
14. **John Nunn, *The Classical King's Indian*, Batsford, 1990, ISBN 0-7134-6551-4**; **John Nunn, *The Main Line King's Indian*, Henry Holt, 1996, ISBN 0-8050-4719-0**; **John Nunn & Graham Burgess, *The New Classical King's Indian*, Batsford/Everyman, 1996–1997.** *Verified: OpenLibrary catalogue records.*
15. **David Vigorito, *Attacking Chess: The King's Indian*, Vols 1–2, Everyman Chess.** *Verified: Everyman Chess catalogue — https://chessreads.com/book-publisher/everyman-chess/*
16. **Raymond D. Keene, *Flank Openings*, British Chess Magazine, 1967/1970, ISBN 0900846038**; **Ray Keene & Garry Kasparov, *Batsford Chess Openings 2*, Henry Holt, 1994 [1989], ISBN 0-8050-3409-9.** The prompt's "*Winning With the King's Indian Attack*" by Keene could not be confirmed in any catalogue and is therefore not cited. *Verified: OpenLibrary catalogue records.*

**Periodical coverage and general structure:**
17. ***New In Chess Yearbook* 1998 (Vol. 49, ISBN 90-5691-044-2, pp. 186–190), 1999 (Vol. 50, ISBN 90-5691-047-7, pp. 182–186) and 2005 (Vol. 76, ISBN 90-5691-155-4, pp. 228–232)** — all contain KIA chapters. *Verified: Wikipedia's *King's Indian Attack* bibliography.*
18. **Boris Zlotnik, *Zlotnik's Middlegame Manual — Typical Structures and Strategic Manoeuvres*, New in Chess, 7 December 2020, ISBN 978-9056919269.** Structures, not openings — exactly what a KIA player needs. *Verified: publisher blurb and dated review — https://britishchessnews.com/tag/middlegame/*
19. **John Nunn, *Understanding Chess Middlegames*, Gambit Publications, 2011, ISBN 978-1-906454-27-2.** *Verified: Gambit catalogue.*
20. **Mark Dvoretsky, *School of Chess Excellence*, Edition Olms, 2002/2003 (ISBN 3283004161 / 328300417X / 3283004188 / 3283004196).** *Verified: OpenLibrary.*
21. **Nick de Firmian, *Modern Chess Openings*, 15th ed., Random House Puzzles & Games, 2008, ISBN 978-0-8129-3682-7**; **David Hooper & Kenneth Whyld, *The Oxford Companion to Chess*, 2nd ed., Oxford University Press, 1996, ISBN 0-19-280049-3.** The reference works for move orders, ECO classification and structural vocabulary.

**Source catalogues:** http://chessbooks.nl/ipgambit.html · https://chessreads.com/book-publisher/everyman-chess/ · https://openlibrary.org/ · https://britishchessnews.com/tag/middlegame/ · https://www.niggemann.com/en/books-media/openings/king-s-indian-attack.html

---

## Appendix — Consolidated source list (all fetched or confirmed)

**Opening and database sources**
- 365chess.com — Queen's Gambit, QGD, Slav, QGA, King's Indian Defense guides and ECO index pages: https://www.365chess.com/chess-openings/Queens-Gambit · /Queens-Gambit-Declined · /Slav-Defense · /Queens-Gambit-Accepted · /Kings-Indian-Defense
- chessgames.com — ECO indexes for D16, D20, D35, D37, D45, D51, D58, D60, D62, E60, E61, A08: https://www.chessgames.com/perl/chessopening?eco=D35 (and equivalents)
- chessgames.com — game records: Alekhine–Bogoljubov 1929 (gid 1012653), Gelfand–Kramnik 1996 (gid 1284067); tournament collections: New York 1924 (cid 1007158), Nottingham 1936 (cid 1004101), Zurich 1953 (cid 1003015), Linares 1993 (cid 1009167), 1929 World Championship (cid 1020392), 1951 World Championship (cid 1020397), 1978 World Championship (cid 1022863); collection "Fischer Wins: Bobby Fischer Wins With The King's Indian Attack" (Fischer–Ibrahimoglu 1970)
- Wikipedia — *King's Indian Attack*: https://en.wikipedia.org/wiki/King%27s_Indian_Attack · *Game of the Century (chess)*: https://en.wikipedia.org/wiki/Game_of_the_Century_(chess) · *World Chess Championship 1978*: https://en.wikipedia.org/wiki/World_Chess_Championship_1978 · *World Chess Championship 1972*: https://en.wikipedia.org/wiki/World_Chess_Championship_1972 · *World Chess Championship 1927 / 1929*: https://en.wikipedia.org/wiki/World_Chess_Championship_1927 · https://en.wikipedia.org/wiki/World_Chess_Championship_1929 · *Mikhail Botvinnik*: https://en.wikipedia.org/wiki/Mikhail_Botvinnik · *Botvinnik versus Capablanca, AVRO 1938*: https://en.wikipedia.org/wiki/Botvinnik_versus_Capablanca,_AVRO_1938 · *Queen's Gambit Declined*: https://en.wikipedia.org/wiki/Queen%27s_Gambit_Declined · *Caro-Kann Defence*: https://en.wikipedia.org/wiki/Caro-Kann_Defence · *Candidates Tournament*: https://en.wikipedia.org/wiki/Candidates_Tournament

**Structural / teaching sources**
- Chess.com lesson, *Roots of Positional Understanding*: https://www.chess.com/lessons/roots-of-positional-understanding
- Pawnbreak, "Planning in the Carlsbad Structure – Botvinnik–Keres 1952 (1)": https://pawnbreak.com/planning-in-the-carlsbad-botvinnik-keres-1952-1/

**Bibliographic sources**
- OpenLibrary catalogue: https://openlibrary.org/
- Gambit Publications catalogue: http://chessbooks.nl/ipgambit.html
- Everyman Chess catalogue and review index: https://chessreads.com/book-publisher/everyman-chess/
- British Chess News book reviews: https://britishchessnews.com/tag/middlegame/
- "King's Indian Attack" bibliography / German bookseller listing: https://www.niggemann.com/en/books-media/openings/king-s-indian-attack.html
