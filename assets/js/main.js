/* ============================================================
   Charter Boat Miami — interactions
   Edit CONTACT below to change the email or marina everywhere
   on the site at once.
   ============================================================ */

const CONTACT = {
  email:    'info@charterboatmiami.net',
  marina:   'Departing Miami Beach \u00b7 exact dock confirmed on booking',
  // Optional: paste a form endpoint (e.g. https://formspree.io/f/xxxxxxx)
  // to receive enquiries by email. Leave empty to fall back to the
  // visitor's own mail client.
  formEndpoint: ''
};

/* ---------- apply contact details across the page ---------- */
(function applyContact() {
  document.querySelectorAll('[data-contact]').forEach((el) => {
    const kind = el.dataset.contact;
    if (kind === 'email') {
      el.textContent = CONTACT.email;
      if (el.tagName === 'A') el.href = 'mailto:' + CONTACT.email;
    } else if (kind === 'marina') {
      el.textContent = CONTACT.marina;
    }
  });
})();

/* ---------- header state on scroll ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- mobile navigation ---------- */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

nav.addEventListener('click', (e) => {
  if (e.target.tagName !== 'A') return;
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
  }
});

/* ---------- reveal on scroll ----------
   A plain sweep rather than IntersectionObserver: IO can miss elements that
   pass through the viewport between two frames (fast scrolling, or landing on
   a #hash deep in the page), which would leave whole sections invisible. */
const revealables = [...document.querySelectorAll('.reveal')];
let ticking = false;

function sweep(factor) {
  ticking = false;
  const limit = window.innerHeight * (factor || 0.92);
  let shown = 0;
  for (let i = revealables.length - 1; i >= 0; i--) {
    const el = revealables[i];
    if (el.getBoundingClientRect().top < limit) {
      el.style.transitionDelay = Math.min(shown++ * 70, 280) + 'ms';
      el.classList.add('in');
      revealables.splice(i, 1);
    }
  }
  if (!revealables.length) {
    window.removeEventListener('scroll', queue);
    window.removeEventListener('resize', queue);
  }
}

function queue() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(function () { sweep(); });
}

/* Landing on a #hash jumps the page after load, and that jump fires no scroll
   event — so re-sweep a few times, with the threshold opened to the full
   viewport, or the section you linked to can sit there invisible. */
function settle() {
  [0, 120, 400, 1000].forEach(function (t) {
    setTimeout(function () { sweep(1.05); }, t);
  });
}

window.addEventListener('scroll', queue, { passive: true });
window.addEventListener('resize', queue);
window.addEventListener('hashchange', settle);
window.addEventListener('load', settle);
sweep();

/* ---------- card buttons prefill the booking form ---------- */
const charterSelect = document.getElementById('charterSelect');
document.querySelectorAll('[data-prefill]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const wanted = btn.dataset.prefill;
    const match = [...charterSelect.options].find((o) => o.value === wanted || o.text === wanted);
    if (match) charterSelect.value = match.value;
  });
});

/* ---------- booking form ---------- */
const form = document.getElementById('bookForm');
const status = document.getElementById('formStatus');
const waBtn = document.getElementById('waBtn');

function readForm() {
  const d = Object.fromEntries(new FormData(form).entries());
  return {
    name: (d.name || '').trim(),
    phone: (d.phone || '').trim() || 'not given',
    email: (d.email || '').trim(),
    date: d.date || 'flexible',
    guests: d.guests || 'not specified',
    charter: d.charter || '',
    notes: (d.notes || '').trim() || '—'
  };
}

function composeMessage(d) {
  return [
    'Charter enquiry — charterboatmiami.net',
    '',
    'Name: ' + d.name,
    'Phone: ' + d.phone,
    'Email: ' + d.email,
    'Date: ' + d.date,
    'Guests: ' + d.guests,
    'Charter: ' + d.charter,
    'Notes: ' + d.notes
  ].join('\n');
}

function setStatus(text, kind) {
  status.textContent = text;
  status.className = 'form-status' + (kind ? ' ' + kind : '');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    setStatus('Please fill in your name and email.', 'err');
    return;
  }

  const data = readForm();
  const submitBtn = form.querySelector('button[type="submit"]');

  if (CONTACT.formEndpoint) {
    submitBtn.disabled = true;
    setStatus('Sending…');
    try {
      const res = await fetch(CONTACT.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });
      if (!res.ok) throw new Error('Request failed: ' + res.status);
      form.reset();
      setStatus('Thank you — your request is in. We usually reply within a couple of hours.', 'ok');
    } catch (err) {
      setStatus('That did not go through. Please email ' + CONTACT.email + ' directly.', 'err');
    } finally {
      submitBtn.disabled = false;
    }
    return;
  }

  // No endpoint configured — hand off to the visitor's mail client.
  const subject = 'Charter enquiry — ' + data.charter + ' — ' + data.date;
  window.location.href =
    'mailto:' + CONTACT.email +
    '?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(composeMessage(data));
  setStatus('Opening your email app… if nothing happens, write to ' + CONTACT.email + '.', 'ok');
});

/* ---------- footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
