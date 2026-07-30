---

# SPECIFICA DI IMPLEMENTAZIONE
## Piattaforma di studio delle aperture scacchistiche
### Corsi interattivi · Repertori personali · Ripetizione dilazionata

**Versione** 1.0 · **Data** 29 luglio 2026 · **Stato** Pronta per lo sviluppo
**Stack** TypeScript · React · chess.js · Stockfish · IndexedDB

---

## Indice

1. Scopo del documento e visione del prodotto
2. Principi architetturali
3. Strato di dominio — Il motore dell'albero
4. Strato di dominio — Il motore SRS
5. Strato di contenuto — Il sistema dei corsi
6. Strato di contenuto — Repertorio e builder
7. Pipeline dei contenuti (offline)
8. Strato di presentazione (React)
9. Persistenza e gestione dello stato
10. Piano di costruzione
11. Rischi e punti critici
12. Decisioni aperte
A. Glossario
B. Conversione in PDF

---

## 1. Scopo del documento e visione del prodotto

### 1.1 A chi serve questo documento

Questo documento è la fonte di verità per costruire la piattaforma. Uno sviluppatore deve poterlo leggere e sapere, per ogni sottosistema, cosa costruire, perché, e come verificare di averlo fatto bene. Le sezioni 3 e 4 sono il cuore tecnico; la sezione 10 dice in che ordine costruire.

### 1.2 Il problema

Chi studia le aperture oggi ha due esperienze separate e scollegate. Da un lato i corsi (video, libri, piattaforme didattiche) che trasmettono comprensione ma non garantiscono memorizzazione. Dall'altro i trainer a ripetizione dilazionata (tipo ChessBook o il MoveTrainer di Chessable) che fanno memorizzare ma partono da repertori che l'utente deve già avere o comprare. Nessuno collega bene i due mondi: **imparare un'apertura in un corso e trasformarla, con un gesto, nel proprio repertorio allenabile**.

### 1.3 La soluzione

Una piattaforma dove:
- l'utente principiante segue corsi interattivi ricchi (teoria, quiz, partite modello, video);
- l'utente di qualsiasi livello costruisce il proprio repertorio su un editor scacchiera-centrico;
- un unico motore di memorizzazione allena sia i corsi che i repertori;
- un corso può essere clonato in repertorio in qualsiasi momento, facendo da ponte tra apprendimento e possesso.

### 1.4 Posizionamento

| Prodotto | Forza | Limite che colmiamo |
|---|---|---|
| ChessBook | Repertori + SRS | Corsi poveri, poco didattici |
| Chessable | Corsi + MoveTrainer | Repertori per lo più preconfezionati e a pagamento |
| Lichess Explorer | Esplorazione gratuita | Nessun allenamento, nessuna didattica |
| **Noi** | Corsi ricchi → repertorio personale → SRS unico | — |

### 1.5 Utenti target

Dal principiante assoluto al maestro. Questo impone che ogni corso abbia una profondità scalabile (moduli dal livello base al livello teorico avanzato) e che l'interfaccia non dia nulla per scontato nei primi livelli.

---

## 2. Principi architetturali

### 2.1 L'albero è l'unico oggetto

Tutta la piattaforma ruota attorno a una sola struttura dati: **l'albero di mosse**. Un corso è un albero curato con un involucro didattico. Un repertorio è un insieme di alberi posseduti dall'utente. Una carta da allenare è una vista derivata di un albero. Non esistono strutture parallele: chi capisce questo capisce l'intero sistema.

### 2.2 Architettura a strati e regola delle dipendenze

```
┌──────────────────────────────────────────────────────┐
│  PRESENTAZIONE  (React)                              │
│  Scacchiera · Lezioni · Builder · Sessioni · Stats   │
├──────────────────────────────────────────────────────┤
│  CONTENUTO                                           │
│  Corsi (alberi curati)  ·  Repertori (alberi utente) │
├──────────────────────────────────────────────────────┤
│  DOMINIO  (logica pura — zero React, zero storage)   │
│  Motore Albero · Motore SRS · chess.js               │
├──────────────────────────────────────────────────────┤
│  PERSISTENZA                                         │
│  Repository → IndexedDB (locale) → cloud (futuro)    │
└──────────────────────────────────────────────────────┘
```

**Regola:** ogni strato dipende solo da quello immediatamente sottostante, mai da quello sopra, mai "di lato" verso l'alto. Il dominio non sa di essere in React né di essere salvato. La presentazione non parla mai direttamente con IndexedDB. Questa regola è la garanzia di testabilità e di futura evoluzione (es. passaggio al cloud) senza riscritture.

### 2.3 Derivare, non duplicare

Le carte SRS non si salvano come entità indipendenti con una copia delle mosse: si **derivano** dall'albero ogni volta che serve, e dell'albero condividono il destino. Se l'utente cancella un ramo, le carte di quel ramo spariscono automaticamente. Questo elimina un'intera classe di bug di inconsistenza.

### 2.4 Contenuti separati dall'utente

I dati "di biblioteca" (le 1360+ aperture, i corsi) sono in sola lettura per l'utente e distribuiti come file statici. I dati "dell'utente" (repertori, progressi, stato SRS) sono scrivibili e vivono in IndexedDB. I due mondi non si mescolano mai nello stesso archivio.

---

## 3. Strato di dominio — Il motore dell'albero

### 3.1 La rappresentazione piatta

L'albero **non** è un oggetto annidato. È un dizionario di nodi indicizzati per ID univoco, dove ogni nodo conosce il genitore e i figli tramite i rispettivi ID.

Motivi, in ordine di importanza:

1. **Ricerca O(1).** Trovare un nodo non richiede attraversamento. Con decine di migliaia di nodi totali è la differenza tra un'interfaccia fluida e una lenta.
2. **Aggiornamenti locali.** Modificare un commento o un weight tocca un solo oggetto. La serializzazione e il rilevamento delle modifiche sono banali.
3. **Serializzazione senza ricorsione.** Il dizionario piatto si converte in JSON e si salva in IndexedDB senza funzioni ricorsive, senza rischi di stack overflow su alberi profondi.
4. **Reattività granulare.** In React si può memorizzare per singolo nodo: cambia un nodo, si ri-renderizza solo quel ramo.

### 3.2 Anatomia di un nodo

Ogni nodo rappresenta **la posizione dopo una mossa** e contiene:

| Campo | Significato | Note |
|---|---|---|
| Identificatore | Chiave univoca del nodo | Generata alla creazione, mai riutilizzata |
| Mossa | La mossa in notazione SAN che porta a questa posizione | Nulla per la radice |
| FEN | La posizione risultante, completa | Generata da chess.js, mai a mano |
| Genitore | ID del nodo padre | Unico (albero puro, vedi 3.6) |
| Figli | Lista di ID dei nodi figlio | Più figli = varianti alternative |
| Linea principale | Flag booleano | Distingue la continuazione raccomandata dalle diramazioni |
| Commento | Testo libero opzionale | Annotazione didattica o personale |
| Valutazione | Numero (pedoni) opzionale | Inserita dalla pipeline, leggibile dall'utente |
| Weight | Intero da 1 a 5 | Importanza ai fini dell'allenamento (vedi 4.5) |
| Mosse accettate | Lista di SAN opzionale | Alternative considerate corrette (vedi 4.6) |
| Provenienza | Riferimento opzionale a corso/nodo d'origine | Popolato dalla clonazione (vedi 5.5) |

### 3.3 Il FEN come identità e la sua normalizzazione

Il FEN è l'impronta digitale della posizione. Ma il FEN completo contiene anche due contatori — l'orologio dei 50 colpi e il numero della mossa — che **variano a seconda dell'ordine di mosse** con cui si arriva alla stessa posizione. Usarli per confrontare posizioni produrrebbe falsi "diversi".

**Regola di normalizzazione.** Per ogni confronto, deduplicazione o ricerca per posizione, si usano solo i **primi quattro campi** del FEN: disposizione dei pezzi, colore a cui tocca, diritti di arrocco, casa en passant. Gli ultimi due campi si scartano. Questa funzione di normalizzazione deve esistere in **un solo punto** del motore ed essere usata ovunque, senza eccezioni.

### 3.4 Il ruolo di chess.js

Il motore non implementa le regole degli scacchi. Si appoggia a chess.js come oracolo di legalità e come generatore di FEN. Per aggiungere una mossa: si carica il FEN del genitore in un'istanza chess.js, si applica la mossa (validandola), si legge il FEN risultante, si crea il nodo con quel FEN. Questo garantisce che ogni nodo dell'albero sia una posizione legale e che arrocco, en passant e promozioni siano gestiti correttamente.

### 3.5 Catalogo delle operazioni

Il motore è l'unico punto attraverso cui l'albero viene letto e modificato. Ogni operazione di modifica è **immutabile**: restituisce il nuovo stato senza alterare quello passato, così React e la persistenza possono rilevare i cambiamenti.

**Crea albero.** Parte da una radice (posizione iniziale o un FEN arbitrario). Restituisce un albero con un solo nodo.

**Aggiungi mossa.** Riceve l'ID di un nodo e una mossa SAN. Comportamento: valida la mossa tramite chess.js; se il nodo ha già un figlio con quella mossa, restituisce quel figlio (nessuna duplicazione); se ha figli ma con mosse diverse, crea un nuovo figlio come diramazione; se non ha figli, crea il figlio come linea principale. Caso limite: mossa illegale → errore descrittivo, albero invariato.

**Elimina sottoalbero.** Riceve l'ID di un nodo. Rimuove quel nodo e tutti i discendenti, e aggiorna la lista dei figli del genitore. Caso limite: eliminazione della radice → rifiutata (l'albero non può essere svuotato così; si elimina l'intero albero con un'altra operazione). Effetto collaterale: le carte SRS che puntavano ai nodi eliminati vengono invalidate alla successiva rigenerazione (vedi 4.8).

**Promuovi a linea principale.** Riceve l'ID di un nodo figlio. Imposta quel figlio come linea principale e declassa il precedente. Serve quando l'utente cambia idea su quale sia la continuazione raccomandata.

**Percorso dalla radice.** Riceve l'ID di un nodo e restituisce la sequenza di mosse dalla radice a quel nodo. È ciò che l'interfaccia mostra come "lista delle mosse". Costo: proporzionale alla profondità, non alla dimensione dell'albero.

**Trova per FEN.** Riceve un FEN normalizzato e restituisce il nodo corrispondente, se esiste. È l'operazione che permette di collegare i nodi dei corsi alle voci dell'esploratore e di rilevare le trasposizioni.

**Figli e continuazioni.** Restituisce i figli di un nodo (le varianti già presenti) e, separatamente, le continuazioni legali secondo chess.js (le mosse giocabili ma non ancora nell'albero). L'editor del repertorio usa entrambe per mostrare cosa c'è e cosa si può aggiungere.

**Aggiorna metadati.** Modifica commento, weight, valutazione o mosse accettate di un singolo nodo. Operazione a basso costo, usata di continuo nell'editor.

**Clona albero.** Copia profonda: crea nuovi ID per ogni nodo, ricostruisce i collegamenti genitore/figli, e su ogni nodo copia un riferimento di provenienza che punta al nodo d'origine. L'albero risultante è completamente indipendente: modificarlo non tocca l'originale e viceversa. Vedi 5.5 per la semantica completa.

**Importa da PGN.** Trasforma un PGN in albero. Vedi la sezione 6.4 per la pipeline dettagliata e i casi limite.

**Serializza / deserializza.** Converte l'albero in JSON piatto e viceversa. Unica via di ingresso e uscita verso la persistenza.

### 3.6 Trasposizioni: la decisione

Una stessa posizione può essere raggiunta con ordini di mosse diversi. Due le strade: albero puro (un genitore per nodo, posizioni duplicate) o grafo (più genitori, nessuna duplicazione ma navigazione ambigua).

> **DECISIONE.** Per l'MVP si usa l'**albero puro**, accettando la duplicazione dei nodi, ma si **deduplicano le carte a livello di FEN normalizzato** (vedi 4.3). L'utente non allena mai due volte la stessa posizione anche se compare in due rami. Il grafo resta un'evoluzione futura, solo se il feedback lo richiederà.

---

## 4. Strato di dominio — Il motore SRS

### 4.1 Le carte sono una vista, non un'entità

Non esiste un archivio di carte create a mano. Una carta è il risultato di una funzione di derivazione che riceve un albero e un colore ("il mio colore") e produce l'insieme delle posizioni da allenare.

### 4.2 La funzione di derivazione

In parole: si scorrono tutti i nodi dell'albero; si selezionano quelli in cui **tocca al mio colore** e che hanno **almeno un figlio** (cioè il repertorio prevede una risposta); per ciascuno si crea una carta contenente il FEN della posizione (quella in cui tocca a me), la mossa della linea principale come risposta attesa, l'insieme delle mosse accettate, e il weight del nodo.

Due conseguenze fondamentali:
- quando l'utente costruisce un repertorio, l'allenamento **appare automaticamente**;
- quando un corso viene clonato, le carte nascono subito dall'albero clonato.

### 4.3 Deduplicazione delle carte

Poiché l'albero puro può contenere la stessa posizione in due rami (trasposizione), la derivazione **raggruppa per FEN normalizzato**: una sola carta per posizione distinta. Le mosse accettate della carta sono l'unione delle risposte dei nodi che condividono quel FEN. Questo è il meccanismo che rende innocua la duplicazione dell'albero puro.

### 4.4 Lo stato di ogni carta

Ogni carta mantiene il proprio stato di memorizzazione:

| Campo | Significato |
|---|---|
| Intervallo | Giorni fino alla prossima revisione |
| Facilità | Moltiplicatore di crescita, iniziale 2.5, range 1.3–3.0 |
| Corrette consecutive | Contatore azzerato a ogni errore |
| Dimenticanze | Contatore storico, mai azzerato |
| Scadenza | Data della prossima revisione |
| Revisioni totali / corrette totali | Per le statistiche |

### 4.5 Le regole di pianificazione

Dopo ogni risposta:

**Corretta.** Le corrette consecutive aumentano. L'intervallo segue la curva: prima riuscita → 1 giorno; seconda → 3 giorni; dalla terza in poi → intervallo precedente × facilità. La facilità cresce di un piccolo passo a ogni successo, con tetto a 3.0.

**Sbagliata.** Le corrette consecutive si azzerano. L'intervallo torna a 0 (la carta va rivista subito o al massimo domani). La facilità diminuisce di un passo, con pavimento a 1.3 — questo evita il cosiddetto "ease hell" dei sistemi tipo Anki, dove la facilità crolla e la carta non si dirada mai più. Le dimenticanze aumentano di uno.

**Esempio numerico.** Una carta con facilità 2.5 e weight 3:

| Giorno | Esito | Intervallo risultante | Prossima scadenza |
|---|---|---|---|
| 0 | corretta | 1 | giorno 1 |
| 1 | corretta | 3 | giorno 4 |
| 4 | corretta | 3 × 2.5 ≈ 8 | giorno 12 |
| 12 | corretta | 8 × 2.58 ≈ 21 | giorno 33 |
| 33 | **sbagliata** | 0, facilità → 2.46 | oggi/domani |
| 34 | corretta | 1 (si ricomincia) | giorno 35 |

### 4.6 L'effetto del weight

Dopo aver calcolato l'intervallo con le regole precedenti, lo si moltiplica per un fattore derivato dal weight:

| Weight | Fattore | Effetto |
|---|---|---|
| 5 (critica) | × 0.6 | ripasso più fitto |
| 4 | × 0.8 | |
| 3 (normale) | × 1.0 | neutro |
| 2 | × 1.2 | |
| 1 (marginale) | × 1.4 | ripasso più rado |

Nei corsi il weight lo imposta l'autore in fase di cura. Nel repertorio è suggerito automaticamente (linea principale = 5, diramazioni via via più basse) ma l'utente può modificarlo nodo per nodo.

### 4.7 Le tre categorie di feedback

Quando l'utente gioca una mossa in allenamento, gli esiti sono **tre**, e l'interfaccia deve distinguerli:

1. **Corretta** — la mossa è tra le accettate. Conferma positiva, si procede.
2. **Legale ma non nel repertorio** — la mossa è giocabile ma non è quella studiata. Feedback neutro (ambra, non rosso) con spiegazione: "legale, ma il tuo repertorio prevede X". È il caso didatticamente più prezioso.
3. **Illegale o errore** — feedback negativo, mostra la mossa corretta.

### 4.8 Costruzione di una sessione di studio

Ogni apertura di "Allenati":

1. **Raccolta.** Si prendono tutte le carte scadute, ma **solo dalle fonti attive**: le voci di repertorio marcate "in studio" e i moduli dei corsi attivi. (Realizza la scelta di limitare la sessione a ciò che si sta studiando.)
2. **Nuove carte.** Si introducono al massimo N carte nuove al giorno (default 20, configurabile), ripartite tra le fonti attive, nell'ordine dei moduli. Questo evita il sovraccarico al cold start.
3. **Mescolamento.** Le carte di fonti diverse si alternano (interleaving) anziché in blocchi monolitici: più faticoso, ma memorizza meglio.
4. **Riaccodamento.** Una carta sbagliata durante la sessione viene riproposta più tardi nella stessa sessione, finché non ottiene almeno una risposta corretta.
5. **Tetto.** La sessione ha una lunghezza massima configurabile; le carte scadute oltre il tetto slittano a domani senza penalità.

### 4.9 Ciclo di vita di una carta

**Nascita** — derivata dall'albero quando esiste un nodo con una risposta per il mio colore. **Apprendimento** — le prime esposizioni (intervallo 1, poi 3 giorni). **Revisione** — intervalli crescenti. **Maturità** — intervalli lunghi; la carta appare raramente. **Lapse** — un errore la riporta all'apprendimento. **Pensionamento** — quando il nodo corrispondente viene eliminato dal repertorio o la voce di repertorio viene disattivata: la carta non viene più derivata e il suo stato storico confluisce nelle statistiche.

### 4.10 Statistiche da tracciare

Ritenzione nel tempo (percentuale di risposte corrette sulle revisioni), carte per fase (nuove / in apprendimento / mature), punti deboli per apertura (le carte con più dimenticanze), tempo medio per risposta. Sono la base dell'area Progressi.

---

## 5. Strato di contenuto — Il sistema dei corsi

### 5.1 Struttura

Un corso è un albero curato più un involucro didattico: una lista ordinata di **moduli**; ogni modulo ha titolo, difficoltà, ordine, e una lista di **lezioni**; ogni lezione ha un tipo e un riferimento a uno o più ID di nodo dell'albero. È questo riferimento il collante tra didattica e scacchiera.

### 5.2 I quattro tipi di lezione

**Teoria.** Testo esplicativo affiancato da una sequenza di mosse sulla scacchiera, con frecce e case evidenziate. L'utente scorre le mosse avanti e indietro. Nessun punteggio. Serve a trasmettere comprensione: il "perché", non solo il "cosa". Contenuto richiesto: testo, sequenza di mosse, annotazioni visive (frecce/case).

**Indovina la mossa.** La lezione punta a un nodo specifico. La scacchiera mostra la posizione, l'utente gioca la mossa, il sistema valuta contro le mosse accettate di quel nodo (curate dall'autore). Queste carte confluiscono anche nell'SRS: la prima esposizione avviene nella lezione, i ripassi nelle sessioni di studio. È il ponte naturale tra corso e allenamento. Contenuto richiesto: nodo di riferimento, insieme delle mosse accettate, testo di spiegazione per corretto/errato.

**Quiz posizionale.** Domanda a risposta multipla su una posizione: non "quale mossa" ma "qual è il piano", "cosa c'è di sbagliato", "quale struttura conviene". La scacchiera mostra la posizione, le opzioni sono testuali, dopo la risposta appare la spiegazione. I **distrattori** (risposte sbagliate) devono essere plausibili: è lì che il quiz ha valore, e vanno scritti a mano. Contenuto richiesto: domanda, 3–4 opzioni con indicazione della corretta, spiegazione.

**Partita modello.** Un PGN reale che scorre automaticamente con annotazioni testuali. Nei punti critici la partita **si ferma** e incorpora un indovina-la-mossa o un quiz, poi riprende. Non è una partita da guardare: è una partita da giocare a tratti. Le pause sono definite in cura come posizioni specifiche del PGN. Contenuto richiesto: PGN, lista di punti di pausa con tipo di interazione, annotazioni.

### 5.3 Come nasce un corso

L'albero del corso si costruisce con la pipeline offline (sezione 7). L'involucro didattico (moduli, lezioni, testi, quiz, video) si crea in fase di cura. Le carte indovina-la-mossa si generano automaticamente dall'albero; quiz e teoria richiedono scrittura manuale.

### 5.4 Scalabilità per livello

Ogni corso è diviso in moduli ordinati per difficoltà, dal base ("perché questa mossa") all'avanzato ("teoria e novità"). Un principiante parte dal modulo 1; un giocatore esperto entra direttamente dai moduli alti o salta al repertorio. Questo realizza il target "principiante → GM" senza prodotti separati.

### 5.5 La clonazione in repertorio

Quando l'utente clona un corso:

1. Si esegue una **copia profonda** dell'albero: nuovi ID per tutti i nodi. Le modifiche dell'utente non toccano mai il corso originale; gli aggiornamenti del corso non rompono il repertorio.
2. Durante la copia, ogni nodo riceve un **riferimento di provenienza** (quale corso, quale nodo d'origine).
3. La provenienza abilita due funzioni: "torna alla lezione" da qualsiasi nodo del repertorio, e in futuro "riallinea al corso aggiornato" che mostra le differenze tra il corso evoluto e la copia dell'utente.
4. Il repertorio risultante è una nuova voce con il colore dell'utente già impostato e le carte SRS già derivabili.

> **DECISIONE.** La clonazione è una **copia con provenienza**, non un riferimento vivo. Motivo: l'utente deve poter potare e personalizzare senza paura di "rompere" qualcosa, e il corso deve poter evolvere senza effetti collaterali sui repertori.

---

## 6. Strato di contenuto — Repertorio e builder

### 6.1 Il repertorio

Un repertorio è una lista di **voci**, ognuna delle quali è: un albero, un'etichetta ("Bianco vs 1.e4"), il colore dell'utente, e un flag "attivo" che decide se le sue carte entrano nelle sessioni di studio. Un utente ha tipicamente 2–4 voci (Bianco vs 1.e4, Bianco vs 1.d4, Nero vs 1.e4, Nero vs 1.d4).

### 6.2 Il builder: modello di interazione

Il builder è **scacchiera-centrico**: l'utente non compila moduli, gioca mosse. Dalla posizione corrente vede le continuazioni già presenti (evidenziate) e può giocarne di nuove per estendere l'albero. Un pannello laterale mostra l'albero delle varianti: seleziona, annota, elimina, promuove, pesa. Ogni nodo mostra il proprio weight modificabile.

### 6.3 Le operazioni, in dettaglio

**Estendere.** Gioca una mossa da una foglia → il motore crea il nodo figlio. È l'operazione più frequente.

**Diramare.** Gioca una mossa alternativa da un nodo che ha già un figlio → crea un secondo figlio. L'interfaccia deve rendere chiaro che si sta creando una variante, non sostituendo la linea.

**Potare.** Seleziona un nodo ed elimina → cancella l'intero sottoalbero. Le carte SRS dei nodi eliminati spariscono alla rigenerazione. L'interfaccia deve chiedere conferma mostrando quante carte verranno rimosse.

**Annotare.** Aggiunge un commento testuale a un nodo.

**Pesare.** Imposta il weight; il sistema suggerisce un valore automatico in base alla profondità e al fatto che sia linea principale, ma l'utente decide.

**Promuovere.** Cambia quale diramazione è la linea principale.

**Clonare da corso.** Vedi 5.5.

### 6.4 Import PGN: pipeline e casi limite

L'utente incolla un PGN; il sistema lo trasforma in albero. Passi:

1. **Parsing** del PGN in una struttura di mosse con varianti annidate (RAV), commenti e NAG.
2. **Percorso** della linea principale; a ogni mossa, aggiungi-mossa sul motore (che valida e genera i FEN).
3. **Diramazioni**: le varianti annidate diventano diramazioni nel punto giusto.
4. **Commenti**: i commenti del PGN diventano annotazioni sui nodi.

Casi limite da gestire con grazia (senza bloccare l'import):
- **mosse illegali** → scartare quel ramo e segnalare, non fallire tutto;
- **NAG e simboli di annotazione** (!, ?, +−) → mappare in valutazione/commento o scartare;
- **ordini di mosse alternativi** → gestire come trasposizioni (albero puro, vedi 3.6);
- **PGN troncati o malformati** → importare la parte valida e segnalare;
- **intestazioni multiple** → usare quelle rilevanti (Evento, Giocatori, Risultato) come metadati.

La regola d'oro: **importare ciò che si capisce, segnalare ciò che si scarta**, mai fallire in blocco.

### 6.5 Assegnazione dei weight

Alla creazione o import, il weight è suggerito: linea principale nei primi livelli = 5, via via più basso per diramazioni profonde e linee secondarie. L'utente può modificare ogni valore. Il motore SRS usa il weight corrente al momento della derivazione.

---

## 7. Pipeline dei contenuti (offline)

Questo processo **non gira nell'app**. È un flusso separato, eseguito sul machine dell'autore o su un server, che produce i JSON dei corsi da pubblicare.

### 7.1 Fonti

| Fonte | Uso |
|---|---|
| Lichess Opening Explorer | Mosse principali e frequenze per posizione |
| Lichess Games / broadcast | Partite di master per un dato ECO |
| Stockfish | Valutazioni, mosse migliori, errori |
| PGN pubblici (The Week in Chess, Caissa) | Corpus di partite da filtrare |

### 7.2 Le quattro fasi

**Raccolta.** Per l'intervallo ECO di un modulo, scarica le partite di master filtrando per rating (es. > 2200) e recenza (es. ultimi 10 anni), preferendo quelle decisive.

**Analisi.** Ogni partita passa sotto Stockfish; le posizioni vengono classificate:
- mossa nettamente prevalente → candidata **indovina la mossa**;
- forte cambiamento di valutazione (> 1.5 pedoni) → momento critico per **partita modello**;
- errore ricorrente a livello di club → materiale per **quiz** ("cosa c'è di sbagliato?").

L'analisi produce un grezzo enorme: migliaia di posizioni candidate.

**Cura.** L'autore sceglie le migliori, scrive le spiegazioni, inventa i distrattori dei quiz, calibra la difficoltà, decide le mosse accettate e i weight, seleziona i video. L'analisi dice *dove* guardare; la cura decide *cosa* insegnare.

**Assemblaggio.** Uno script serializza il materiale curato nel formato dell'albero e dei moduli, pronto per la pubblicazione.

### 7.3 Perché separata

Mantenere la pipeline fuori dall'app permette di pubblicare e aggiornare corsi senza toccare il codice, e di far girare Stockfish alla profondità desiderata senza vincoli di browser.

---

## 8. Strato di presentazione (React)

### 8.1 Le cinque aree

| Area | Ruolo |
|---|---|
| Esploratore | Vista "biblioteca" sul DB dei contenuti: cerca per nome/ECO, naviga le varianti |
| Corsi | Catalogo → dettaglio → moduli → player delle lezioni |
| Repertorio | Elenco delle voci + builder scacchiera-centrico |
| Allenamento | Sessione quotidiana guidata dall'SRS |
| Progressi | Ritenzione, carte per fase, punti deboli per apertura |

Navigazione: barra laterale su desktop, tab in basso su mobile.

### 8.2 La scacchiera come componente unico

Non quattro scacchiere diverse: **un componente configurabile** con modalità:
- **visualizzazione** — navigazione libera (esploratore, teoria);
- **indovina** — input attivo, valuta la mossa giocata (lezioni, allenamento);
- **modifica** — per il builder;
- **riproduzione** — per le partite modello, con pause.

Stessa scacchiera ovunque = coerenza visiva e meno codice.

### 8.3 Feedback percettivo

L'allenamento deve sentirsi vivo. Requisiti da passare allo sviluppatore:

- **Corretta** — il pezzo si assesta con movimento morbido, la casa di destinazione pulsa brevemente di verde.
- **Sbagliata** — leggero tremito, lampo rosso, poi la mossa corretta appare come freccia o pezzo fantasma.
- **Legale ma non nel repertorio** — indicatore ambra, nessun suono punitivo, spiegazione testuale.
- **Frecce e case evidenziate** — per piani e case chiave durante teoria e annotazioni.
- **Suoni** — discreti e disattivabili per cattura, scacco, corretto, errato.

Questi dettagli non sono decorazione: sono il meccanismo con cui l'utente impara senza rileggere spiegazioni ogni volta.

### 8.4 Responsive e accessibilità

La scacchiera deve ridimensionarsi fluidamente; i pannelli (varianti, annotazioni) collassano su mobile. Tastiera: navigazione delle mosse con le frecce, invio per confermare. Contrasto sufficiente per i colori di feedback (non affidarsi solo al colore: aggiungere sempre un'etichetta testuale).

---

## 9. Persistenza e gestione dello stato

### 9.1 Due basi dati distinte

**DB dei contenuti** — le 1360+ aperture e i corsi. Sola lettura per l'utente. Inizialmente file JSON statici nel bundle o su CDN; non serve un database vero.

**DB dell'utente** — repertori, stato SRS, progressi, impostazioni. Scrivibile, personale, deve sopravvivere a ricaricamenti e aggiornamenti.

### 9.2 Schema di IndexedDB (concettuale)

Collezioni principali: **alberi** (uno per repertorio/voce, con l'elenco dei nodi serializzato), **voci di repertorio** (etichetta, colore, attivo), **stato carte** (per ogni carta: FEN normalizzato + stato SRS — è l'unica cosa che si salva dell'allenamento, perché le carte si ri-derivano dall'albero), **progressi** (eventi di revisione per le statistiche), **impostazioni** (soglie giornaliere, preferenze).

Nota chiave: **non si salvano le carte come entità**, solo il loro stato indicizzato per FEN normalizzato. Alla rigenerazione, lo stato viene riassociato alle carte derivate. Questo è il punto dove la scelta "derivare, non duplicare" (2.3) si concretizza nella persistenza.

### 9.3 Il pattern Repository

L'app React non tocca mai IndexedDB. Parla con uno strato repository che espone operazioni di alto livello: salva albero, leggi carte scadute, registra una revisione, leggi impostazioni. Quando in futuro si aggiungerà account e sincronizzazione cloud, si sostituirà solo l'implementazione del repository: il resto dell'app non se ne accorgerà.

### 9.4 Stato in React

La logica di dominio (albero, SRS) sta **fuori** da React, in moduli puri e testabili. React vi accede tramite uno store leggero che tiene lo stato corrente (albero aperto, sessione attiva, progressi) e lo sincronizza col repository. I componenti leggono lo store e invocano operazioni del dominio; non contengono logica di business.

---

## 10. Piano di costruzione

Non costruire "l'app": costruire strati che si sbloccano a vicenda. Ogni milestone produce qualcosa di funzionante e testabile.

| Milestone | Contenuto | Definizione di "fatto" |
|---|---|---|
| **A — Dominio e scacchiera** | Motore dell'albero + chess.js + componente scacchiera | Aggiungere mosse, creare diramazioni, navigare un albero sulla scacchiera; test unitari sul motore |
| **B — Esploratore** | DB dei contenuti collegato ad albero + scacchiera | L'utente cerca e naviga le 1360 aperture |
| **C — SRS e allenamento** | Motore SRS, sessione, interfaccia con i tre feedback | Allenare un albero manuale; le carte scadono e si ripropongono secondo la curva |
| **D — Corsi + primo corso** | Struttura corsi/moduli/lezioni, 4 tipi di lezione, clonazione | Un utente segue l'Italiana, fa quiz, clona in repertorio, lo allena |
| **E — MVP** | Siciliana + Gambetto di Donna + Progressi | Lancio pubblico |
| **F — Builder (Fase 2)** | Editor scacchiera-centrico, import PGN, weight | L'utente costruisce e allena un repertorio da zero |
| **G — Condivisione (Fase 3)** | Pubblicare/sottoscrivere repertori | Richiede cloud |

**Dipendenze:** A sblocca B, C, D. C è necessario per D. D è necessario per E. F dipende da A+C (il builder usa albero e SRS). G dipende dal cloud.

---

## 11. Rischi e punti critici

**Coerenza carte–albero.** Quando l'utente pota un ramo, le carte devono sparire. Poiché le carte si derivano e lo stato si indicizza per FEN, la soluzione è rigenerare e riassociare lo stato alle carte sopravvissute. Verificare con test che lo stato di una carta non vada perso quando l'albero viene modificato in punti non correlati.

**Cold start dell'SRS.** Clonare un corso produce centinaia di carte "nuove". La soglia giornaliera di carte nuove (default 20) evita il sovraccarico: vanno introdotte un po' alla volta, nell'ordine dei moduli.

**Performance su alberi grandi.** Struttura piatta, memorizzazione per nodo, liste di varianti virtualizzate (non renderizzare mille righe insieme).

**Parsing dei PGN.** Commenti, varianti annidate, NAG, ordini alternativi: scartare con grazia ciò che non si interpreta, mai bloccare l'import.

**En passant nella normalizzazione.** Raro nelle posizioni d'apertura, ma presente in alcune linee tattiche. La regola dei quattro campi lo gestisce correttamente; assicurarsi che la funzione di normalizzazione sia unica e usata ovunque.

---

## 12. Decisioni aperte

| Decisione | Raccomandazione | Impatto se cambiata |
|---|---|---|
| Semantica della clonazione | Copia con provenienza | Riferimento vivo = riscrittura della gestione aggiornamenti |
| Trasposizioni | Albero puro + dedup carte | Grafo = complessità di navigazione e visualizzazione |
| Storage | IndexedDB locale, repository astratto | Cloud immediato = anticipare autenticazione e sincronizzazione |
| Soglie SRS | 20 nuove/giorno, facilità 1.3–3.0 | Regolabili in seguito senza cambiamenti strutturali |

Le prime due vanno fissate **prima** della Milestone A. Le altre sono raffinatebili in corsa.

---

## A. Glossario

- **Albero** — struttura di mosse con una radice e diramazioni; l'oggetto fondamentale.
- **Nodo** — una posizione (dopo una mossa) con i suoi metadati.
- **FEN** — notazione che descrive una posizione sulla scacchiera.
- **SAN** — notazione algebrica standard delle mosse (es. Nf3, e4).
- **SRS** — Spaced Repetition System, ripetizione dilazionata.
- **Carta** — una posizione da allenare, derivata dall'albero.
- **Weight** — importanza di una posizione (1–5), regola la frequenza di ripasso.
- **Repertorio** — l'insieme delle aperture scelte dall'utente.
- **Trasposizione** — raggiungere la stessa posizione con ordini di mosse diversi.
- **ECO** — classificazione enciclopedica delle aperture (A00–E99).