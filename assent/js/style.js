
document.addEventListener('DOMContentLoaded', () => {

  // Anno corrente nel footer
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Tema chiaro / scuro ----------
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const THEME_KEY = 'atelier-theme';

  // Applica il tema con i color mode di Bootstrap (data-bs-theme su <html>)
  function applyTheme(theme) {
    root.setAttribute('data-bs-theme', theme);

    // L'icona mostra il tema a cui si passa cliccando
    const next = theme === 'dark' ? 'chiaro' : 'scuro';
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', `Passa al tema ${next}`);
    themeToggle.setAttribute('title', `Passa al tema ${next}`);
  }

  // Tema iniziale: quello salvato, altrimenti quello del sistema operativo
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}

  if (savedTheme !== 'light' && savedTheme !== 'dark') {
    savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  applyTheme(savedTheme);

  // Click sul bottone: inverte il tema e lo salva
  themeToggle.addEventListener('click', () => {
    const newTheme = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    try { localStorage.setItem(THEME_KEY, newTheme); } catch (e) {}
  });

  // Chiude il menu mobile quando si clicca un link
  const navCollapse = document.getElementById('mainNav');
  const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false });
  document.querySelectorAll('#mainNav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse.classList.contains('show')) bsCollapse.hide();
    });
  });

  // Template dello spinner (definito in index.html).
  // Se nella pagina manca, lo creiamo qui, così il form funziona comunque.
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

  // Validazione + invio simulato di un form
  function handleForm(form, onSuccess) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const btn = form.querySelector('[type="submit"]');

      // Copia del contenuto originale del bottone, per ripristinarlo dopo
      const originalContent = Array.from(btn.childNodes, node => node.cloneNode(true));

      // Copia del contenuto "in caricamento" dal <template>
      const loadingContent = spinnerTemplate.content.cloneNode(true);

      btn.disabled = true;
      btn.replaceChildren(loadingContent);

      // Simulazione di una richiesta al server
      setTimeout(() => {
        btn.disabled = false;
        btn.replaceChildren(...originalContent);
        form.reset();
        form.classList.remove('was-validated');
        onSuccess();
      }, 1000);
    });
  }

  // Form "Contattaci"
  const contactForm = document.getElementById('contactForm');
  const contactAlert = document.getElementById('contactAlert');
  handleForm(contactForm, () => {
    contactAlert.classList.remove('d-none');
    setTimeout(() => contactAlert.classList.add('d-none'), 4000);
  });

  // Form nella modale "Inizia un progetto"
  const projectModalEl = document.getElementById('projectModal');
  const projectModal = bootstrap.Modal.getOrCreateInstance(projectModalEl);
  const projectForm = document.getElementById('projectForm');
  const projectFormWrap = document.getElementById('projectFormWrap');
  const projectSuccess = document.getElementById('projectSuccess');

  handleForm(projectForm, () => {
    projectFormWrap.classList.add('d-none');
    projectSuccess.classList.remove('d-none');
  });

  // Quando la modale si chiude, torna allo stato iniziale
  projectModalEl.addEventListener('hidden.bs.modal', () => {
    projectFormWrap.classList.remove('d-none');
    projectSuccess.classList.add('d-none');
    projectForm.reset();
    projectForm.classList.remove('was-validated');
  });

  // Il bottone "Chiudi" nel messaggio di conferma
  document.getElementById('projectDone').addEventListener('click', () => projectModal.hide());
});