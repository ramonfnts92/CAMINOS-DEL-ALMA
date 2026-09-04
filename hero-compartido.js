(() => {
  const heroes = document.querySelectorAll('[data-shared-hero]');

  heroes.forEach(hero => {
    const slides = [...hero.querySelectorAll('.shared-hero__photo')];
    const controls = hero.querySelector('.shared-hero__controls');
    const dots = [...hero.querySelectorAll('.shared-hero__dot')];
    const ready = new Set();
    const failed = new Set();

    let current = 0;
    let timer = null;

    const updateControls = () => {
      controls.hidden = ready.size < 2;

      dots.forEach((dot, index) => {
        dot.disabled = !ready.has(index);
        dot.setAttribute('aria-pressed', String(index === current));
      });
    };

    const showSlide = index => {
      if (!ready.has(index)) return;

      current = index;
      slides.forEach((slide, position) => {
        slide.classList.toggle('is-active', position === current);
      });
      updateControls();
    };

    const nextSlide = () => {
      for (let offset = 1; offset <= slides.length; offset += 1) {
        const index = (current + offset) % slides.length;

        if (ready.has(index)) {
          showSlide(index);
          return;
        }
      }
    };

    const schedule = () => {
      window.clearInterval(timer);
      timer = null;

      if (!document.hidden && ready.size > 1) {
        timer = window.setInterval(nextSlide, 5000);
      }
    };

    const imageLoaded = index => {
      ready.add(index);
      failed.delete(index);

      if (failed.has(current)) showSlide(index);

      updateControls();
      schedule();
    };

    const imageFailed = index => {
      ready.delete(index);
      failed.add(index);
      slides[index].classList.remove('is-active');

      if (current === index && ready.size > 0) {
        showSlide(ready.values().next().value);
      }

      updateControls();
      schedule();
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        schedule();
      });
    });

    document.addEventListener('visibilitychange', schedule);

    slides.forEach((slide, index) => {
      slide.addEventListener('load', () => imageLoaded(index));
      slide.addEventListener('error', () => imageFailed(index));

      if (slide.complete) {
        if (slide.naturalWidth > 0) imageLoaded(index);
        else imageFailed(index);
      }
    });
  });
})();
