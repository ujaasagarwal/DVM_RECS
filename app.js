document.addEventListener("DOMContentLoaded", () => {

  const logo = document.getElementById("logo");
  const edition = document.getElementById("edition");
  const loco = document.getElementById("locomotive");
  const v1 = document.getElementById("v1");
  const v2 = document.getElementById("v2");
  const v3 = document.getElementById("v3");
  const text = document.querySelector(".text-1");
  const text2 = document.querySelector(".text-3");
  const text1 = document.querySelector(".text-2");
  const text3 = document.querySelector(".text-4");
  const text4 = document.querySelector(".text-5");

  
  const scrollAnimations = [];



  function createScrollAnimation(element, onScroll, easing = 0.1) {
    if (!element) return;

    scrollAnimations.push({
      element,
      onScroll,
      easing,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0
    });
  }

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    scrollAnimations.forEach(anim => {
      const pos = anim.onScroll(scrollY) || {};
      anim.targetX = pos.x || 0;
      anim.targetY = pos.y || 0;
    });
  });

  function animateScroll() {
    scrollAnimations.forEach(anim => {
      anim.currentX += (anim.targetX - anim.currentX) * anim.easing;
      anim.currentY += (anim.targetY - anim.currentY) * anim.easing;
      anim.element.style.transform =
        `translate(${anim.currentX}px, ${anim.currentY}px)`;
    });

    requestAnimationFrame(animateScroll);
  }

  animateScroll();



  createScrollAnimation(logo, y => ({ x: y * 0.5, y: 0 }), 0.1);
  createScrollAnimation(edition, y => ({ x: -y * 0.5, y: 0 }), 0.1);
  createScrollAnimation(loco, y => ({ x: 0, y: -y * 0.4 }), 0.12);
  createScrollAnimation(v1, y => ({ x: 0, y: -y * 0.15 }), 0.12);
  createScrollAnimation(v2, y => ({ x: 0, y: -y * 0.4 }), 0.12);
  createScrollAnimation(v3, y => ({ x: 0, y: -y * 0.2 }), 0.12);




  function registerParallax(containerId, imgSelector, textSelector, speed) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const img = container.querySelector(imgSelector);
    const txt = container.querySelector(textSelector);

    createScrollAnimation(img, scrollY => {
      const start = container.offsetTop;
      if (scrollY < start) return { x: 0, y: 0 };
      return { x: 0, y: -(scrollY - start) * speed };
    }, 0.08);

    if (txt) {
      createScrollAnimation(txt, scrollY => {
        const start = container.offsetTop;
        if (scrollY < start) return { x: -50, y: 0 };
        return { x: -50, y: -(scrollY - start) * speed };
      }, 0.08);
    }
  }

  registerParallax("speed-image", "img", ".speed2x", 0.5);
  registerParallax("speed-image-1", "img", ".speed4x", 1.2);
  registerParallax("speed-image-2", "img", ".speed6x", 1.8);



  const appearObserver = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add("appear"));
  }, { threshold: 0.4 });

  ["one", "two", "three", "four"].forEach(id => {
    const el = document.getElementById(id);
    if (el) appearObserver.observe(el);
  });

  const line = document.querySelector(".line");
  if (line) {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) line.classList.add("draw");
    }, { threshold: 0.3 }).observe(line);
  }

  const liObserver = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add("draw-line"));
  }, { threshold: 0.5 });

  document.querySelectorAll(".points li").forEach(li =>
    liObserver.observe(li)
  );



  const orbitalObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("orbital-show");
        orbitalObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".orbital").forEach(el =>
    orbitalObserver.observe(el)
  );



  if (text) {
    let textAnimated = false;

    const textObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !textAnimated) {
          textAnimated = true;

          const startY = window.scrollY;

          createScrollAnimation(text, y => ({
            x: (y - startY) * 2.8,
            y: -(y - startY) * 1.8
          }), 0.12);

          textObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    textObserver.observe(text);
  }


  if (text1) {
    let textAnimated = false;

    const textObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !textAnimated) {
          textAnimated = true;

          const startY = window.scrollY;

          createScrollAnimation(text1, y => ({
            x: (y - startY) * 2.8,
            y: 0
          }), 0.12);

          textObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    textObserver.observe(text1);
  }


  if (text2) {
    let textAnimated = false;

    const textObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !textAnimated) {
          textAnimated = true;

          const startY = window.scrollY;

          createScrollAnimation(text2, y => ({
            x: 0,
            y: -((y - startY) * 2.8),
          }), 0.12);

          textObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    textObserver.observe(text2);
  }
  if (text3) {
    let textAnimated = false;

    const textObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !textAnimated) {
          textAnimated = true;

          const startY = window.scrollY;

          createScrollAnimation(text3, y => ({
            x: ((y - startY) * 2.8),
            y: ((y - startY) * 0.8)
          }), 0.12);

          textObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    textObserver.observe(text3);
  }

  if (text4) {
    let textAnimated = false;

    const textObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !textAnimated) {
          textAnimated = true;

          const startY = window.scrollY;

          createScrollAnimation(text4, y => ({
           x: (y - startY) * 4,
            y: 0
           
          }), 0.12);

          textObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    textObserver.observe(text4);
  }

});
const fixedSlide = document.querySelector(".fixed-slide");
const fixedMedia = document.querySelector(".fixed-media");
const fixedImg = fixedMedia ? fixedMedia.querySelector("img") : null;
const fixedContent = document.querySelector(".fixed-content");

if (fixedSlide && fixedMedia && fixedImg && fixedContent) {
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    const start = fixedSlide.offsetTop;
    const end = start + fixedSlide.offsetHeight - window.innerHeight;
    const mid = (start + end) / 2;

    if (scrollY < start || scrollY > end) {
      fixedMedia.style.opacity = "0";
      fixedContent.style.opacity = "0";
      fixedImg.style.filter = "blur(20px)";
      fixedMedia.style.clipPath = "inset(100% 0 0 0)";
      return;
    }

    fixedMedia.style.opacity = "1";
    fixedContent.style.opacity = "1";

    let progress;

    if (scrollY <= mid) {
      progress = (scrollY - start) / (mid - start);
      fixedMedia.style.clipPath = `inset(${100 - progress * 100}% 0 0 0)`;
    } else {
      progress = (scrollY - mid) / (end - mid);
      fixedMedia.style.clipPath = `inset(0 0 ${progress * 100}% 0)`;
    }

    fixedImg.style.filter = `blur(${20 - progress * 20}px)`;
  });
}
