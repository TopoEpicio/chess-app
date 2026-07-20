# Formato per Importare Repertorio (Testo Studio)

## Struttura Generale

```
# Nome Apertura

## Nome Variazione
1. e4 [annotazione opzionale] e5 [annotazione]
2. Cf3 Cc6
3. Bb5 [attacca il cavallo]
> Piano: pedone in e4, sviluppo alfiere in b5

## Altra Variazione
1. d4 d5
2. c4 [gambetto di donna] dxc4
> Idea: recuperare pedone con e3
```

## Regole

1. **`# Titolo`** — Nome dell'apertura (una sola riga all'inizio)
2. **`## Nome Variazione`** — Ogni sezione è una variazione da importare
3. **Mosse** — In formato SAN standard (es. `e4`, `Cf3`, `O-O`, `exd5`)
4. **`[annotazione]`** — Dopo una mossa, tra parentesi quadre, viene salvata come annotazione del nodo
5. **`> testo`** — Righe che iniziano con `>` sono note/piano della variazione (non importate come mosse)
6. **Numeri di mossa** — Opzionali, vengono ignorati dal parser (`1.`, `2...`, ecc.)

## Esempio Completo

```
# Italiana (Giuoco Piano)

## Variazione Classica
1. e4 [controllo centro] e5 [simmetrico]
2. Cf3 [sviluppo e attacco e5] Cc6
3. Bc4 [alfiere attivo] Bc5
4. c3 [prepara d4] Nf6
5. d4 [apertura centro] exd4
6. cxd4 Bb4+
7. Bd2 Bxd2+
8. Nbxd2 d5
9. exd5 Nxd5
10. O-O [re sicuro] O-O
> Piano: sviluppo rapido, centro pedonale, arrocco corto
```



## Suggerimenti

- Usa annotazioni brevi e descrittive `[idea tattica]`
- Puoi separare le idee strategiche con `>`
- Una variazione per sezione `##` — l'import permette di scegliere quale importare
- Il parser genera automaticamente i FEN e calcola i depth
