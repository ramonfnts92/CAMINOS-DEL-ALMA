(() => {
  const root = document.querySelector('.encuentros');
  if (!root) return;
  const slides = [...root.querySelectorAll('.encuentros-slide')];
  const modal = document.querySelector('.encuentros-modal');
  const large = modal.querySelector('img');
  const pause = root.querySelector('[data-enc-pause]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, timer, paused = reduced.matches, visible = true;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-current', i === current);
      slide.inert = i !== current;
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    const count = `${current + 1} / ${slides.length}`;
    root.querySelector('.encuentros-counter').textContent = count;
    modal.querySelector('[data-enc-modal-count]').textContent = count;
    if (modal.open) {
      const photo = slides[current].querySelector('img');
      large.src = photo.src;
      large.alt = photo.alt;
    }
  }
  function schedule() {
    clearInterval(timer);
    pause.textContent = paused ? 'Reproducir' : 'Pausar';
    pause.setAttribute('aria-label', paused ? 'Reproducir carrusel' : 'Pausar carrusel');
    if (!paused && !document.hidden && !modal.open && visible && !root.contains(document.activeElement)) {
      timer = setInterval(() => show(current + 1), 5000);
    }
  }
  function move(offset) { show(current + offset); schedule(); }
  root.querySelector('[data-enc-prev]').addEventListener('click', () => move(-1));
  root.querySelector('[data-enc-next]').addEventListener('click', () => move(1));
  pause.addEventListener('click', () => { paused = !paused; schedule(); });
  slides.forEach((slide, i) => slide.querySelector('button').addEventListener('click', () => {
    modal.showModal(); show(i); schedule();
  }));
  modal.querySelector('[data-enc-close]').addEventListener('click', () => modal.close());
  modal.querySelector('[data-enc-modal-prev]').addEventListener('click', () => move(-1));
  modal.querySelector('[data-enc-modal-next]').addEventListener('click', () => move(1));
  modal.addEventListener('close', schedule);
  modal.addEventListener('click', e => {
    if (e.target !== modal) return;
    const r = modal.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) modal.close();
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); }
  });
  root.addEventListener('focusin', schedule);
  root.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', e => { paused = e.matches; schedule(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; schedule();
  }).observe(root);
  show(0); schedule();
})();
