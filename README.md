# ATELIER - Landing page studio di architettura

Questa repository contiene il codice sorgente della landing page di **Atelier**, uno studio di architettura con sede a Milano. Il sito presenta lo studio e i suoi servizi e permette ai clienti di mettersi in contatto tramite un form o di avviare la richiesta di un nuovo progetto da una finestra modale.

---

## Indice
- [Funzionalità](#funzionalità)
- [Tecnologie utilizzate](#tecnologie-utilizzate)
- [Come eseguire il progetto in locale](#come-eseguire-il-progetto-in-locale)
- [Struttura del progetto](#struttura-del-progetto)
- [Architettura](#architettura)
- [Albero del DOM](#albero-del-dom)
- [Come funziona](#come-funziona)
- [Aspetto grafico](#aspetto-grafico)
- [Convenzioni di codice](#convenzioni-di-codice)


## Funzionalità

Il sito è una pagina unica, responsive, divisa in sei sezioni:

1. **Navbar**: logo, link alle sezioni e bottone per cambiare tema.
2. **Hero**: titolo, sottotitolo e pulsante **Inizia un progetto**.
3. **I nostri servizi**: sei card con icona, titolo e descrizione.
4. **I nostri lavori**: portfolio dei progetti, filtrabile per categoria.
5. **Contattaci**: form di contatto.
6. **Footer**: indirizzo, link rapidi e contatti.

**Funzionalità principali:**

- **Portfolio generato da un array**: le card dei lavori e le loro modali di dettaglio vengono create da JavaScript a partire dall'array `lavori`.
- **Filtri per categoria**: Tutti, Residenziale, Interni, Ristrutturazione e Commerciale, con un contatore dei lavori mostrati.
- **Colore per categoria**: ogni categoria ha un suo colore, usato per il bordo della card, la copertina e il badge.
- **Richiedi un progetto simile**: dalla modale di un lavoro si apre il form "Inizia un progetto" con il tipo già selezionato.
- **Tema chiaro / scuro**: un bottone nella navbar cambia il tema della pagina e ricorda la scelta per le visite successive.
- **Menu responsive**: su smartphone i link si raccolgono in un menu hamburger, che si chiude da solo quando si sceglie una voce.
- **Modale "Inizia un progetto"**: una finestra con un form dedicato per richiedere un progetto, indicando tipo e budget.
- **Validazione dei form**: i campi obbligatori vengono controllati prima dell'invio e gli errori sono mostrati sotto ogni campo.
- **Spinner di invio**: durante l'invio il bottone mostra un'animazione di caricamento e si disabilita.
- **Messaggi di conferma**: dopo l'invio compare un avviso nel form "Contattaci" o un messaggio di conferma nella modale.
- **Anno automatico**: l'anno del copyright nel footer si aggiorna da solo.


## Tecnologie utilizzate

- **HTML5**: struttura semantica della pagina (`nav`, `header`, `section`, `footer`).
- **Bootstrap 5.3**: layout, griglia responsive e componenti (navbar, card, form, modale), caricati da CDN.
- **CSS3**: personalizzazione di Bootstrap con tecniche avanzate (variabili CSS, override delle variabili dei componenti, `clamp()`, transizioni e trasformazioni).
- **JavaScript (ES6+)**: generazione delle card dei lavori da un array, filtri, tema chiaro/scuro, validazione e invio dei form, gestione delle modali e del menu mobile.


## Come eseguire il progetto in locale

1. **Scarica i file** e mettili tutti nella stessa cartella.

2. **Apri l'applicazione**:
   apri il file `index.html` direttamente nel browser oppure usa un'estensione come **Live Server** su VS Code.

> È necessaria una connessione a internet per caricare Bootstrap dalla CDN.

---

## Struttura del progetto

```text
.
├── index.html     pagina unica con navbar, hero, servizi, lavori, form, footer, modale e template
├── style.css      stile personalizzato
├── script.js      tutte le funzionalità interattive
└── README.md
```

L'ordine di caricamento dei file è importante:

```html
<!-- nel <head> -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="style.css" rel="stylesheet">

<!-- in fondo al <body> -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="script.js"></script>
```

- `style.css` va dopo Bootstrap, così le regole personalizzate hanno la precedenza.
- `script.js` va dopo Bootstrap, perché usa gli oggetti `bootstrap.Collapse` e `bootstrap.Modal`.

---

## Architettura

Il progetto separa nettamente i tre livelli:

1. **HTML con Bootstrap**: tutta la struttura e il layout sono costruiti con le classi e i componenti di Bootstrap. La modale e il menu hamburger si aprono tramite gli attributi `data-bs-toggle` e `data-bs-target`, senza JavaScript personalizzato.
2. **CSS**: `style.css` personalizza Bootstrap senza modificarne i file originali, ridefinendo colori, ombre e stati.
3. **JavaScript**: `script.js` aggiunge il comportamento. Tutto il codice parte all'evento `DOMContentLoaded`, quando l'HTML è stato letto completamente.

Lo **stato** della pagina è minimo:

- i **lavori** sono oggetti nell'array `lavori`: la funzione `renderLavori` li trasforma in card e modali, e viene richiamata a ogni cambio di filtro;
- il **tema** è salvato nell'attributo `data-bs-theme` del tag `<html>` e in `localStorage`, con la chiave `atelier-theme`;
- la **visibilità** di avvisi, form e messaggi di conferma è gestita aggiungendo e togliendo la classe `d-none` di Bootstrap;
- lo **stato di validazione** dei form è gestito con la classe `was-validated`.

---

## Albero del DOM

```html
<html data-bs-theme="light|dark">
<body>

  <!-- Navbar -->
  <nav class="navbar navbar-atelier sticky-top">
    <a class="navbar-brand">Atelier</a>
    <button id="themeToggle" class="theme-toggle">
      <span class="theme-icon">🌙|☀️</span>
    </button>
    <button class="navbar-toggler"></button>
    <div id="mainNav" class="collapse navbar-collapse">
      <ul class="navbar-nav">
        <li><a class="nav-link" href="#studio">Studio</a></li>
        <li><a class="nav-link" href="#servizi">Servizi</a></li>
        <li><a class="nav-link" href="#contatti">Contatti</a></li>
      </ul>
    </div>
  </nav>

  <!-- Hero -->
  <header id="studio" class="hero">
    <h1>Architettura per spazi che parlano</h1>
    <p>...</p>
    <button class="btn btn-brand" data-bs-toggle="modal" data-bs-target="#projectModal">Inizia un progetto</button>
  </header>

  <!-- Servizi -->
  <section id="servizi">
    <h2 class="section-title">I nostri servizi</h2>
    <div class="row">
      <div class="col-md-6 col-lg-4">          <!-- x6 -->
        <div class="card service-card">
          <div class="icon">🏠</div>
          <h3 class="card-title">...</h3>
          <p class="card-text">...</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Lavori -->
  <section id="lavori">
    <h2 class="section-title">I nostri lavori</h2>
    <div id="filtri">
      <button class="btn btn-filtro active" data-categoria="tutti">Tutti</button>
      <button class="btn btn-filtro" data-categoria="residenziale">Residenziale</button>
      <!-- ... interni, ristrutturazione, commerciale -->
    </div>
    <p>Mostrati: <span id="contatore">8</span> su <span id="contatore-totale">8</span></p>
    <div id="lavori-container" class="row">
      <!-- card generate da JavaScript -->
    </div>
  </section>

  <!-- Contatti -->
  <section id="contatti" class="bg-light">
    <h2 class="section-title">Contattaci</h2>
    <div id="contactAlert" class="alert alert-success d-none">...</div>
    <form id="contactForm" novalidate>
      <input id="nome"> <input id="email"> <select id="tipo"> <textarea id="messaggio">
      <button type="submit" class="btn btn-brand">Invia</button>
    </form>
  </section>

  <!-- Footer -->
  <footer class="footer-atelier">
    <!-- tre colonne: Atelier, Link, Contatti -->
    <p>© <span id="year">2026</span> Atelier — tutti i diritti riservati</p>
  </footer>

  <!-- Modale -->
  <div id="projectModal" class="modal modal-atelier">
    <div id="projectFormWrap">
      <form id="projectForm" novalidate>
        <input id="pNome"> <input id="pEmail"> <select id="pTipo"> <select id="pBudget">
        <textarea id="pDescrizione"> <input type="checkbox" id="pPrivacy">
        <button type="submit" class="btn btn-brand">Invia richiesta</button>
      </form>
    </div>
    <div id="projectSuccess" class="d-none">
      <h3>Richiesta inviata!</h3>
      <button id="projectDone">Chiudi</button>
    </div>
  </div>

  <!-- Modali dei lavori, generate da JavaScript -->
  <div id="modals-container"></div>

  <!-- Modello della card di un lavoro -->
  <template id="tpl-card">
    <div class="col-12 col-md-6 col-lg-4">
      <article class="card lavoro-card colore-categoria border-0 border-top border-4 shadow-sm" data-categoria="...">
        <div class="ratio ratio-16x9 lavoro-cover"><div><span class="lavoro-icona display-4"></span></div></div>
        <span class="badge badge-categoria"></span>
        <h3 class="card-title"></h3>
        <p class="lavoro-meta"></p>
        <p class="lavoro-descrizione"></p>
        <button class="btn btn-brand" data-bs-toggle="modal" data-bs-target="#lavoro-X">Scopri il progetto</button>
      </article>
    </div>
  </template>

  <!-- Modello della modale di dettaglio -->
  <template id="tpl-modal">
    <div class="modal modal-atelier" id="lavoro-X">
      <div class="modal-content colore-categoria" data-categoria="...">
        <h2 class="modal-title"></h2>
        <div class="ratio ratio-21x9 lavoro-cover"><div><span class="lavoro-icona display-3"></span></div></div>
        <dl> <dd class="lavoro-luogo"> <dd class="lavoro-anno"> <dd class="lavoro-mq"> </dl>
        <p class="lavoro-descrizione"></p>
        <button class="btn btn-brand lavoro-richiedi">Richiedi un progetto simile</button>
      </div>
    </div>
  </template>

  <!-- Modello dello spinner, clonato da script.js -->
  <template id="spinnerTemplate">
    <span class="spinner-border spinner-border-sm"></span>
    <span>Invio…</span>
  </template>

</body>
</html>
```

---

## Come funziona

### 1. Anno nel footer

All'apertura della pagina lo script cerca lo `span` con id `year` e ci scrive l'anno corrente, ricavato con `new Date().getFullYear()`.

### 2. Tema chiaro / scuro

Il tema usa i *color mode* di Bootstrap 5.3: basta impostare `data-bs-theme="light"` o `"dark"` sul tag `<html>` e tutti i componenti cambiano colore.

#### Funzione `applyTheme`

La funzione `applyTheme` riceve il tema da applicare (`"light"` o `"dark"`) e:
- imposta l'attributo `data-bs-theme` sul tag `<html>`;
- cambia l'icona del bottone: 🌙 nel tema chiaro e ☀️ in quello scuro, cioè mostra il tema in cui si passa cliccando;
- aggiorna gli attributi `aria-label` e `title` del bottone, per gli screen reader e il tooltip.

#### Tema iniziale

All'avvio lo script legge da `localStorage` il tema scelto l'ultima volta. Se non c'è un tema salvato, usa quello del sistema operativo tramite `matchMedia('(prefers-color-scheme: dark)')`, poi chiama `applyTheme`.

#### Click sul bottone

Al click lo script legge il tema attuale da `data-bs-theme`, passa a quello opposto con `applyTheme` e lo salva in `localStorage` con il metodo `setItem`.

La lettura e la scrittura di `localStorage` sono dentro un `try/catch`: se il browser le blocca, ad esempio in navigazione privata, il tema cambia comunque ma non viene ricordato.

### 3. Menu mobile

Su smartphone il menu si apre con il bottone hamburger. Lo script aggiunge, con `forEach`, un evento `click` a ogni link del menu: se il menu è aperto (classe `show`), lo chiude con il metodo `hide` dell'oggetto `bootstrap.Collapse`.

### 4. Spinner di invio

Il contenuto del bottone durante l'invio è scritto in `index.html` dentro il `<template id="spinnerTemplate">`. Un `<template>` non viene mostrato nella pagina: serve come modello da copiare.

Se il template non è presente, lo script lo costruisce con `document.createElement`, così i form funzionano comunque. In tutto il codice non viene usato `innerHTML`.

### 5. Gestione dei form

#### Funzione `handleForm`

La funzione `handleForm` riceve un form e una funzione `onSuccess` da eseguire quando l'invio va a buon fine. È usata da entrambi i form della pagina. All'evento `submit`:
- blocca l'invio standard del browser con `preventDefault`, così la pagina non si ricarica;
- controlla i campi con il metodo `checkValidity`. Se un campo non è valido, aggiunge la classe `was-validated`, Bootstrap mostra i bordi rossi e i messaggi di errore, e la funzione si ferma;
- se è tutto valido, salva una copia del contenuto del bottone con `cloneNode(true)`;
- disabilita il bottone e ci inserisce una copia dello spinner presa dal template, con `cloneNode(true)` e `replaceChildren`;
- dopo un secondo, tramite `setTimeout`, rimette il contenuto originale del bottone, lo riabilita, svuota il form con `reset`, toglie la classe `was-validated` e chiama `onSuccess`.

I form hanno l'attributo `novalidate` nell'HTML: così il browser non mostra i suoi fumetti di errore e si usano i messaggi di Bootstrap.

#### Form "Contattaci"

`handleForm` viene collegata al form `contactForm`. A invio riuscito toglie la classe `d-none` all'avviso verde `contactAlert` e, dopo 4 secondi, la rimette per nasconderlo.

Campi obbligatori: nome, email valida, messaggio.

### 6. Modale "Inizia un progetto"

La modale si apre dal pulsante della hero grazie agli attributi di Bootstrap, senza codice personalizzato.

- **Invio**: `handleForm` viene collegata al form `projectForm`. A invio riuscito nasconde il contenitore del form `projectFormWrap` e mostra il messaggio di conferma `projectSuccess`.
- **Reset**: lo script ascolta l'evento Bootstrap `hidden.bs.modal`, che scatta quando la modale ha finito di chiudersi in qualunque modo (X, Annulla, tasto Esc o click fuori). Rimette il form visibile, nasconde la conferma, svuota i campi e toglie gli errori.
- **Bottone "Chiudi"**: il bottone `projectDone` del messaggio di conferma chiude la modale con il metodo `hide` dell'oggetto `bootstrap.Modal`.

Campi obbligatori: nome, email valida, descrizione e casella della privacy.

### 7. Sezione "I nostri lavori"

I lavori sono oggetti in un array chiamato `lavori`. Ogni oggetto ha un `id`, un titolo, una categoria, il luogo, l'anno, la superficie in metri quadri, un'icona e una descrizione:

```js
{
  id: 3,
  titolo: 'Cascina Rossa',
  categoria: 'ristrutturazione',
  luogo: 'Lodi',
  anno: 2023,
  mq: 340,
  icona: '🧱',
  descrizione: 'Recupero di una cascina ottocentesca: ...'
}
```

L'array `categorieAmmesse` contiene le categorie valide. L'oggetto `tipoProgettoPerCategoria` collega ogni categoria alla voce corrispondente del form "Inizia un progetto".

#### Funzione `formattaMq`

Riceve un numero e lo restituisce formattato all'italiana con l'unità di misura, ad esempio `1200` diventa `"1.200 m²"`, tramite il metodo `toLocaleString`.

#### Funzione `creaCard`

Copia il template `tpl-card` con `cloneNode(true)` e lo riempie con i dati del lavoro tramite `textContent`. Imposta l'attributo `data-categoria`, che decide il colore della card, e collega il bottone **Scopri il progetto** alla sua modale con l'attributo `data-bs-target`.

#### Funzione `creaModale`

Copia il template `tpl-modal` e lo riempie con titolo, icona, categoria, luogo, anno, superficie e descrizione. Assegna alla modale un `id` univoco, ricavato dall'`id` del lavoro (`lavoro-3`), così la modale resta collegata alla card anche dopo un filtro.

#### Funzione `renderLavori`

Riceve una lista di lavori e la disegna:
- svuota la griglia e il contenitore delle modali con `replaceChildren`;
- con `forEach` crea, per ogni lavoro, la card e la modale e le aggiunge alla pagina con `appendChild`;
- controlla che la categoria sia tra quelle ammesse con il metodo `includes`;
- se la lista è vuota mostra il messaggio "Nessun lavoro in questa categoria";
- aggiorna il contatore "Mostrati: X su Y".

#### Funzione `filtraLavori`

Riceve una categoria e restituisce i lavori corrispondenti con il metodo `filter`. Con la categoria `"tutti"` restituisce l'array completo.

#### Filtri

I bottoni dei filtri hanno un solo listener, messo sul contenitore `filtri` (*event delegation*). Al click il metodo `closest` trova il bottone cliccato. Lo script evidenzia il filtro attivo con la classe `active` e l'attributo `aria-pressed`, poi chiama `renderLavori` con il risultato di `filtraLavori`.

#### Richiedi un progetto simile

Anche questo bottone usa l'event delegation, sul contenitore `modals-container`. Al click:
- chiude la modale del lavoro;
- quando la chiusura è terminata, cioè all'evento `hidden.bs.modal` ascoltato una sola volta con `{ once: true }`, imposta nel campo **Tipo di progetto** la voce collegata alla categoria e apre la modale "Inizia un progetto".

Bootstrap non permette di aprire due modali insieme: per questo la seconda si apre solo dopo che la prima si è chiusa del tutto.

### 8. Personalizzazione CSS

`style.css` usa alcune tecniche avanzate per adattare Bootstrap allo stile di Atelier:

- **Variabili CSS**: i colori del brand e le ombre delle card sono definiti una sola volta in `:root` e riutilizzati con `var()`.
- **Override delle variabili di Bootstrap**: la classe `btn-brand` ridefinisce le variabili interne dei bottoni (`--bs-btn-bg`, `--bs-btn-hover-bg`, `--bs-btn-active-bg`…) invece di riscrivere il bottone da zero.
- **Colori HSL**: il colore hover dei bottoni è lo stesso marrone con la luminosità abbassata dal 35% al 27%.
- **Colore per categoria con una sola variabile**: card e modali dei lavori hanno la classe `colore-categoria` e la variabile `--colore-cat`, ridefinita per categoria con i selettori `.colore-categoria[data-categoria="..."]`. Copertina, badge e intestazione della modale la riutilizzano. Il bordo superiore è fatto con le classi Bootstrap `border-top border-4`: basta collegare `--bs-border-color` a `--colore-cat` e Bootstrap lo colora da solo.
- **`color-mix()` e `linear-gradient`**: la copertina delle card è una sfumatura tra il colore della categoria e una sua versione schiarita, calcolata dal browser con `color-mix()`.
- **Classi Bootstrap al posto del CSS**: nella sezione dei lavori bordi, ombre, angoli, tipografia e layout sono fatti con le classi di Bootstrap (`border-0`, `shadow-sm`, `overflow-hidden`, `ratio ratio-16x9`, `d-flex`, `display-4`, `fs-5`, `fw-bold`, `text-capitalize`, `text-body-secondary`). Le copertine mantengono le proporzioni 16:9, o 21:9 nella modale, con il componente `ratio`. In `style.css` resta solo ciò che Bootstrap non offre: i colori per categoria, la sfumatura e il sollevamento all'hover.
- **Animazioni ridotte**: con `@media (prefers-reduced-motion: reduce)` le card non si muovono all'hover per chi ha disattivato le animazioni nel sistema operativo.
- **Selettori di attributo**: le regole `[data-bs-theme="dark"]` correggono il tema scuro dove Bootstrap non si adatta da solo, come la sezione `bg-light` e le ombre delle card.
- **Tipografia fluida**: il titolo della hero usa `clamp()` per crescere con lo schermo restando tra un minimo e un massimo.
- **Transizioni e trasformazioni**: le card si sollevano all'hover con `transform: translateY(-4px)` e il cambio di tema sfuma con `transition`.
- **Flexbox**: la hero è centrata verticalmente con `display: flex` e `align-items: center`.
- **Stati dei form**: le regole `:focus` e `:checked` sostituiscono il blu di Bootstrap con il marrone del brand.

---

## Aspetto grafico

Il sito ha uno stile caldo ed essenziale, costruito su una palette di marroni.

| Elemento | Colore |
|---|---|
| Bottoni, hero | `hsl(20, 30%, 35%)` |
| Hover dei bottoni | `hsl(20, 30%, 27%)` |
| Navbar e footer | `hsl(20, 20%, 15%)` |
| Link del footer all'hover | `hsl(40, 30%, 90%)` |
| Sezione contatti | `#F8F9FA` (`bg-light`) |

In alto si trova una navbar scura con il nome **Atelier** a sinistra e i link alle sezioni a destra, che resta fissa durante lo scroll. Sotto, la hero marrone occupa gran parte dello schermo, con il titolo e il pulsante **Inizia un progetto** al centro. Il pulsante ha lo stesso colore della hero e si scurisce al passaggio del mouse.

La sezione dei servizi mostra sei card bianche con angoli arrotondati e una leggera ombra. Al passaggio del mouse ogni card si solleva e l'ombra diventa più marcata. Le card si dispongono su tre colonne su desktop, due su tablet e una su smartphone.

La sezione dei lavori mostra in alto i bottoni dei filtri, con bordo marrone, che si riempiono di colore quando sono attivi. Ogni card ha una copertina sfumata nel colore della sua categoria, con un'icona al centro: marrone per i progetti residenziali, ocra per gli interni, terracotta per le ristrutturazioni e grigio ardesia per gli spazi commerciali. Lo stesso colore compare nel bordo superiore, nel badge e nell'intestazione della modale di dettaglio.

Il form di contatto è centrato su uno sfondo grigio chiaro. Quando si clicca un campo, il bordo e l'alone diventano marroni. Il footer scuro chiude la pagina su tre colonne, con i link che si schiariscono al passaggio del mouse.

Nel tema scuro gli sfondi delle sezioni, delle card e dei campi diventano scuri, mentre navbar, hero, bottoni e footer mantengono i colori del brand.

---

## Convenzioni di codice

- **Variabili e funzioni in inglese**, con nomi intuitivi.
- **Commenti brevi** che descrivono cosa fa ogni funzione o blocco.
- Solo `const` e `let`, mai `var`.
- `getElementById`, `querySelector` e `querySelectorAll` per il DOM.
- `addEventListener`, mai `onclick` inline nell'HTML.
- Nessun uso di `innerHTML`: gli elementi vengono creati con `createElement` o copiati da un `<template>` con `cloneNode`.
- Nessun CSS o JavaScript scritto dentro `index.html`: ogni linguaggio sta nel suo file.