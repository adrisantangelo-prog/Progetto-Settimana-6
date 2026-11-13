
// ---------- Dati dei lavori ----------

// Elenco dei progetti mostrati nella sezione "Lavori".
// Per aggiungere un lavoro basta aggiungere un oggetto qui: la card si crea da sola.
const lavori = [
  {
    id: 1,
    titolo: 'Casa sul lago',
    categoria: 'residenziale',
    luogo: 'Como',
    anno: 2025,
    mq: 220,
    icona: '🏡',
    descrizione: 'Villa unifamiliare affacciata sul lago, con grandi vetrate e una terrazza che segue il profilo della collina.'
  },
  {
    id: 2,
    titolo: 'Loft Navigli',
    categoria: 'interni',
    luogo: 'Milano',
    anno: 2024,
    mq: 95,
    icona: '🛋️',
    descrizione: 'Ex laboratorio trasformato in abitazione open space, con arredi su misura in rovere e acciaio.'
  },
  {
    id: 3,
    titolo: 'Cascina Rossa',
    categoria: 'ristrutturazione',
    luogo: 'Lodi',
    anno: 2023,
    mq: 340,
    icona: '🧱',
    descrizione: 'Recupero di una cascina ottocentesca: consolidamento delle murature, nuovi solai in legno e impianti a basso consumo.'
  },
  {
    id: 4,
    titolo: 'Showroom Forma',
    categoria: 'commerciale',
    luogo: 'Milano',
    anno: 2025,
    mq: 180,
    icona: '🏬',
    descrizione: 'Spazio espositivo per un marchio di design, con percorsi di luce che guidano il visitatore tra i prodotti.'
  },
  {
    id: 5,
    titolo: 'Appartamento Brera',
    categoria: 'interni',
    luogo: 'Milano',
    anno: 2023,
    mq: 110,
    icona: '🪑',
    descrizione: 'Interni di un appartamento d\'epoca: pavimenti originali restaurati e cucina contemporanea in pietra.'
  },
  {
    id: 6,
    titolo: 'Villa delle Querce',
    categoria: 'residenziale',
    luogo: 'Bergamo',
    anno: 2024,
    mq: 280,
    icona: '🌳',
    descrizione: 'Casa immersa nel verde, progettata attorno a un cortile interno che porta luce in tutti gli ambienti.'
  },
  {
    id: 7,
    titolo: 'Uffici Studio Lumen',
    categoria: 'commerciale',
    luogo: 'Torino',
    anno: 2022,
    mq: 420,
    icona: '🏢',
    descrizione: 'Sede di una società di consulenza: postazioni flessibili, sale riunioni acustiche e una caffetteria condivisa.'
  },
  {
    id: 8,
    titolo: 'Palazzina Liberty',
    categoria: 'ristrutturazione',
    luogo: 'Monza',
    anno: 2025,
    mq: 600,
    icona: '🏛️',
    descrizione: 'Restauro delle facciate e riorganizzazione interna di una palazzina Liberty in sei appartamenti.'
  }
];

// Categorie valide (usate per il colore delle card e per i filtri)
const categorieAmmesse = ['residenziale', 'interni', 'ristrutturazione', 'commerciale'];

// Collega ogni categoria alla voce corrispondente del form "Inizia un progetto"
const tipoProgettoPerCategoria = {
  residenziale: 'Residenziale',
  interni: 'Interior design',
  ristrutturazione: 'Ristrutturazione',
  commerciale: 'Spazi commerciali'
};


// Il codice parte quando l'HTML è stato caricato, così tutti gli elementi esistono già
document.addEventListener('DOMContentLoaded', () => {

  // ---------- Anno nel footer ----------

  // Inserisce l'anno corrente nel copyright
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }


  // ---------- Tema chiaro / scuro ----------

  // Il tema usa i color mode di Bootstrap: data-bs-theme="light" o "dark" su <html>
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const THEME_KEY = 'atelier-theme';

  // Applica il tema alla pagina e aggiorna icona e testi del bottone
  function applyTheme(theme) {
    root.setAttribute('data-bs-theme', theme);

    // L'icona mostra il tema in cui si passa cliccando
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';

    const next = theme === 'dark' ? 'chiaro' : 'scuro';
    themeToggle.setAttribute('aria-label', `Passa al tema ${next}`);
    themeToggle.setAttribute('title', `Passa al tema ${next}`);
  }

  // Legge il tema salvato; se non c'è usa quello del sistema operativo
  // (try/catch: in navigazione privata localStorage può non essere disponibile)
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(THEME_KEY);
  } catch (e) {}

  if (savedTheme !== 'light' && savedTheme !== 'dark') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    savedTheme = systemPrefersDark ? 'dark' : 'light';
  }

  applyTheme(savedTheme);

  // Al click cambia tema e lo salva
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    applyTheme(newTheme);

    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch (e) {}
  });


  // ---------- Menu mobile ----------

  // Chiude il menu mobile quando si clicca un link
  const navCollapse = document.getElementById('mainNav');
  const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false });

  // La classe "show" indica che il menu è aperto (succede solo su mobile)
  document.querySelectorAll('#mainNav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse.classList.contains('show')) {
        bsCollapse.hide();
      }
    });
  });


  // ---------- Spinner ----------

  // Prende il template dello spinner dall'HTML; se manca lo crea
  // con createElement (niente innerHTML)
  let spinnerTemplate = document.getElementById('spinnerTemplate');

  if (!spinnerTemplate) {
    spinnerTemplate = document.createElement('template');

    const spinner = document.createElement('span');
    spinner.className = 'spinner-border spinner-border-sm me-2';
    spinner.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.textContent = 'Invio…';

    spinnerTemplate.content.append(spinner, text);
  }


  // ---------- Gestione form ----------

  // Valida il form, mostra lo spinner, simula l'invio e poi esegue onSuccess
  function handleForm(form, onSuccess) {
    form.addEventListener('submit', (e) => {
      // Blocca l'invio standard, che ricaricherebbe la pagina
      e.preventDefault();

      // Se ci sono campi non validi mostra gli errori e si ferma
      // (was-validated fa comparire bordi rossi e messaggi di Bootstrap)
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const btn = form.querySelector('[type="submit"]');

      // Salva il contenuto del bottone e lo sostituisce con lo spinner
      const originalContent = Array.from(btn.childNodes, node => node.cloneNode(true));
      const loadingContent = spinnerTemplate.content.cloneNode(true);

      // Disabilita il bottone per evitare doppi click
      btn.disabled = true;
      btn.replaceChildren(loadingContent);

      // Simula l'invio: dopo 1 secondo ripristina bottone e form
      setTimeout(() => {
        btn.disabled = false;
        btn.replaceChildren(...originalContent);

        form.reset();
        form.classList.remove('was-validated');

        onSuccess();
      }, 1000);
    });
  }


  // ---------- Form "Contattaci" ----------

  const contactForm = document.getElementById('contactForm');
  const contactAlert = document.getElementById('contactAlert');

  // Dopo l'invio mostra l'avviso di conferma per 4 secondi
  handleForm(contactForm, () => {
    contactAlert.classList.remove('d-none');
    setTimeout(() => contactAlert.classList.add('d-none'), 4000);
  });


  // ---------- Modale "Inizia un progetto" ----------

  const projectModalEl = document.getElementById('projectModal');
  const projectModal = bootstrap.Modal.getOrCreateInstance(projectModalEl);
  const projectForm = document.getElementById('projectForm');
  const projectFormWrap = document.getElementById('projectFormWrap');
  const projectSuccess = document.getElementById('projectSuccess');

  // Dopo l'invio nasconde il form e mostra la conferma
  handleForm(projectForm, () => {
    projectFormWrap.classList.add('d-none');
    projectSuccess.classList.remove('d-none');
  });

  // Quando la modale si chiude (X, Annulla, Esc o click fuori),
  // riporta il form allo stato iniziale
  projectModalEl.addEventListener('hidden.bs.modal', () => {
    projectFormWrap.classList.remove('d-none');
    projectSuccess.classList.add('d-none');
    projectForm.reset();
    projectForm.classList.remove('was-validated');
  });

  // Il bottone "Chiudi" della conferma chiude la modale
  document.getElementById('projectDone').addEventListener('click', () => {
    projectModal.hide();
  });


  // ---------- Lavori ----------
  // Le card non sono scritte nell'HTML: vengono create da JavaScript
  // copiando i <template> e riempiendoli con i dati dell'array "lavori"

  const lavoriContainer = document.getElementById('lavori-container');
  const modalsContainer = document.getElementById('modals-container');
  const tplCard = document.getElementById('tpl-card');
  const tplModal = document.getElementById('tpl-modal');
  const filtri = document.getElementById('filtri');
  const contatore = document.getElementById('contatore');
  const contatoreTotale = document.getElementById('contatore-totale');

  // Formatta la superficie, es. 1200 → "1.200 m²"
  function formattaMq(mq) {
    return `${Number(mq).toLocaleString('it-IT')} m²`;
  }

  // Crea una card a partire dal template e la riempie con i dati del lavoro
  function creaCard(lavoro, idModale, categoria) {
    // Copia il contenuto del template (cloneNode(true) copia anche i figli)
    const card = tplCard.content.cloneNode(true);

    // data-categoria decide il colore della card (vedi style.css)

    card.querySelector('.lavoro-card').dataset.categoria = categoria;
    card.querySelector('.lavoro-icona').textContent = lavoro.icona;
    card.querySelector('.badge-categoria').textContent = categoria;
    card.querySelector('.card-title').textContent = lavoro.titolo;
    card.querySelector('.lavoro-meta').textContent = `${lavoro.luogo} · ${lavoro.anno} · ${formattaMq(lavoro.mq)}`;
    card.querySelector('.lavoro-descrizione').textContent = lavoro.descrizione;

    // Collega il bottone alla sua modale
    card.querySelector('button').setAttribute('data-bs-target', `#${idModale}`);

    return card;
  }

  // Crea la modale di dettaglio a partire dal template
  function creaModale(lavoro, idModale, categoria) {
    const modal = tplModal.content.cloneNode(true);
    const idTitolo = `${idModale}-titolo`;

    // id univoco della modale + collegamento al titolo per gli screen reader
    const modalEl = modal.querySelector('.modal');
    modalEl.id = idModale;
    modalEl.setAttribute('aria-labelledby', idTitolo);

    modal.querySelector('.colore-categoria').dataset.categoria = categoria;
    modal.querySelector('.modal-title').id = idTitolo;
    modal.querySelector('.modal-title').textContent = lavoro.titolo;
    modal.querySelector('.lavoro-icona').textContent = lavoro.icona;
    modal.querySelector('.badge-categoria').textContent = categoria;
    modal.querySelector('.lavoro-luogo').textContent = lavoro.luogo;
    modal.querySelector('.lavoro-anno').textContent = lavoro.anno;
    modal.querySelector('.lavoro-mq').textContent = formattaMq(lavoro.mq);
    modal.querySelector('.lavoro-descrizione').textContent = lavoro.descrizione;

    // Il bottone "Richiedi un progetto simile" si ricorda la categoria
    modal.querySelector('.lavoro-richiedi').dataset.categoria = categoria;

    return modal;
  }

  // Disegna le card (e le loro modali) per la lista ricevuta
  function renderLavori(lista) {
    // Svuota griglia e modali del render precedente
    lavoriContainer.replaceChildren();
    modalsContainer.replaceChildren();

    lista.forEach((lavoro) => {
      // l'id della modale usa l'id del lavoro: resta lo stesso anche dopo un filtro
      const idModale = `lavoro-${lavoro.id}`;
      // Usa la categoria solo se è tra quelle previste
      const categoria = categorieAmmesse.includes(lavoro.categoria) ? lavoro.categoria : '';

      lavoriContainer.appendChild(creaCard(lavoro, idModale, categoria));
      modalsContainer.appendChild(creaModale(lavoro, idModale, categoria));
    });

    // Messaggio se nessun lavoro corrisponde al filtro
    if (lista.length === 0) {
      const vuoto = document.createElement('p');
      vuoto.className = 'text-secondary text-center small';
      vuoto.textContent = 'Nessun lavoro in questa categoria.';
      lavoriContainer.appendChild(vuoto);
    }

    // Aggiorna il contatore
    contatore.textContent = lista.length;
    contatoreTotale.textContent = lavori.length;
  }

  // Restituisce i lavori della categoria scelta ("tutti" = nessun filtro)
  function filtraLavori(categoria) {
    if (categoria === 'tutti') return lavori;
    return lavori.filter((lavoro) => lavoro.categoria === categoria);
  }

  // Filtri: un solo listener sul contenitore (event delegation)
  filtri.addEventListener('click', (e) => {
    // closest trova il bottone anche se il click arriva su un elemento interno
    const bottone = e.target.closest('[data-categoria]');
    if (!bottone) return; // click nello spazio tra i bottoni

    // Evidenzia il filtro attivo
    filtri.querySelectorAll('[data-categoria]').forEach((b) => {
      const attivo = b === bottone;
      b.classList.toggle('active', attivo);
      b.setAttribute('aria-pressed', String(attivo));
    });

    // Ridisegna la griglia con i soli lavori della categoria scelta
    renderLavori(filtraLavori(bottone.dataset.categoria));
  });

  // "Richiedi un progetto simile": chiude la modale del lavoro
  // e apre "Inizia un progetto" con il tipo già selezionato
  modalsContainer.addEventListener('click', (e) => {
    const bottone = e.target.closest('.lavoro-richiedi');
    if (!bottone) return;

    const modaleLavoroEl = bottone.closest('.modal');
    const modaleLavoro = bootstrap.Modal.getOrCreateInstance(modaleLavoroEl);

    // Bootstrap non apre due modali insieme: la seconda si apre solo
    // quando la prima è chiusa del tutto ({ once: true } = una sola volta)
    modaleLavoroEl.addEventListener('hidden.bs.modal', () => {
      const tipo = tipoProgettoPerCategoria[bottone.dataset.categoria];
      if (tipo) document.getElementById('pTipo').value = tipo; // preseleziona il tipo nel form
      projectModal.show();
    }, { once: true });

    modaleLavoro.hide();
  });

  // Primo render con tutti i lavori
  renderLavori(lavori);

});