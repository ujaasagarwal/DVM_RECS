document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logo");
  const edition = document.getElementById("edition");
  const loco = document.getElementById("locomotive");
  const v1 = document.getElementById("v1");
  const v2 = document.getElementById("v2");
  const v3 = document.getElementById("v3");

  const text = document.querySelector(".text-1");
  const text1 = document.querySelector(".text-2");
  const text2 = document.querySelector(".text-3");
  const text3 = document.querySelector(".text-4");
  const text4 = document.querySelector(".text-5");

  const img = document.querySelector("#train_image");
  const scrollDir = document.querySelector(".scroll-dir");

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
      targetY: 0,
      flip: 1
    });
  }

  createScrollAnimation(logo, y => ({ x: y * 0.5, y: 0 }), 0.1);
  createScrollAnimation(edition, y => ({ x: -y * 0.5, y: 0 }), 0.1);
  createScrollAnimation(loco, y => ({ x: 0, y: -y * 0.4 }), 0.12);
  createScrollAnimation(v1, y => ({ x: 0, y: -y * 0.15 }), 0.12);
  createScrollAnimation(v2, y => ({ x: 0, y: -y * 0.4 }), 0.12);
  createScrollAnimation(v3, y => ({ x: 0, y: -y * 0.2 }), 0.12);

  let prevScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    scrollAnimations.forEach(anim => {
      if (anim.element.id === "train_image") return;
      const pos = anim.onScroll(scrollY) || {};
      if (pos.x !== undefined) anim.targetX = pos.x;
      if (pos.y !== undefined) anim.targetY = pos.y;
    });
    prevScrollY = scrollY;
  });



  if (scrollDir) {
    let activated = false;
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !activated) {
          activated = true;
          const startY = scrollDir.offsetTop - window.innerHeight * 0.8;

          if (text) createScrollAnimation(text, y => ({ x: Math.max(0, y - startY) * 2.8, y: -Math.max(0, y - startY) * 1.8 }), 0.12);
          if (text1) createScrollAnimation(text1, y => ({ x: Math.max(0, y - startY) * 2.8, y: 0 }), 0.12);
          if (text2) createScrollAnimation(text2, y => ({ x: 0, y: -(Math.max(0, y - startY) * 2.8) }), 0.12);
          if (text3) createScrollAnimation(text3, y => ({ x: Math.max(0, y - startY) * 2.8, y: Math.max(0, y - startY) * 0.8 }), 0.12);
          if (text4) createScrollAnimation(text4, y => ({ x: Math.max(0, y - startY) * 4, y: 0 }), 0.12);
        }
      });
    }, { threshold: 0.3 }).observe(scrollDir);
  }

  function registerParallax(containerId, imgSelector, textSelector, speed) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pImg = container.querySelector(imgSelector);
    const pTxt = container.querySelector(textSelector);

    createScrollAnimation(pImg, y => {
      const start = container.offsetTop;
      return y < start ? { x: 0, y: 0 } : { x: 0, y: -(y - start) * speed };
    }, 0.08);

    if (pTxt) {
      createScrollAnimation(pTxt, y => {
        const start = container.offsetTop;
        return y < start ? { x: -50, y: 0 } : { x: -50, y: -(y - start) * speed };
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

  document.querySelectorAll(".points li").forEach(li => liObserver.observe(li));

  const orbitalObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("orbital-show");
        orbitalObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".orbital").forEach(el => orbitalObserver.observe(el));

  function animateScroll() {
    scrollAnimations.forEach(anim => {
      anim.currentX += (anim.targetX - anim.currentX) * anim.easing;
      anim.currentY += (anim.targetY - anim.currentY) * anim.easing;
      let transform = `translate(${anim.currentX}px, ${anim.currentY}px)`;
      if (anim.element.id === "train_image") transform += ` scaleX(${anim.flip})`;
      anim.element.style.transform = transform;
    });
    requestAnimationFrame(animateScroll);
  }

  animateScroll();
});

const fixedSlide = document.querySelector(".fixed-slide");
const fixedMedia = document.querySelector(".fixed-media");
const fixedContent = document.querySelector(".fixed-content");

if (fixedSlide && fixedMedia && fixedContent) {
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const start = fixedSlide.offsetTop;
    const end = start + fixedSlide.offsetHeight - window.innerHeight;
    const mid = (start + end) / 2;

    if (scrollY < start || scrollY > end) {
      fixedMedia.style.opacity = "0";
      fixedContent.style.opacity = "0";
      fixedMedia.style.clipPath = "inset(100% 0 0 0)";
      return;
    }

    fixedMedia.style.opacity = "1";
    fixedContent.style.opacity = "1";

    const progress = scrollY <= mid
      ? (scrollY - start) / (mid - start)
      : (scrollY - mid) / (end - mid);

    fixedMedia.style.clipPath = scrollY <= mid
      ? `inset(${100 - progress * 100}% 0 0 0)`
      : `inset(0 0 ${progress * 100}% 0)`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const train = document.getElementById("train_image");
  if (!train) return;

  // Train state
  const trainAnim = {
    element: train,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    speed: 0.08, // lerp speed
  };

  let lastScrollY = window.scrollY;
  let started = false;

  // Initial styles
  train.style.position = "relative";
  train.style.opacity = "0"; // hidden initially
  train.style.willChange = "transform";

  // Start animation only when train is mostly visible
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.9 && !started) {
          started = true;
          train.style.opacity = "1"; // make visible
          lastScrollY = window.scrollY;
          observer.disconnect();
        }
      });
    },
    { threshold: 1 } // 90% visibility
  );

  observer.observe(train);

  // Scroll listener
  window.addEventListener("scroll", () => {
    if (!started) return;

    const scrollY = window.scrollY;
    const delta = scrollY - lastScrollY;

    if (delta === 0) return;

    // Diagonal movement factors
    const DIAG_X = 0.5; // horizontal speed
    const DIAG_Y = 1; // vertical speed

    // Scroll down → increase target, scroll up → decrease target
    trainAnim.targetX += delta * DIAG_X;
    trainAnim.targetY += delta * DIAG_Y;

    lastScrollY = scrollY;
  });
  
  // Animation loop
  function animateTrain() {
    if (started) {
      let fl=0;
      // smooth lerp toward target
      trainAnim.x += (trainAnim.targetX - trainAnim.x) * trainAnim.speed;
      trainAnim.y += (trainAnim.targetY - trainAnim.y) * trainAnim.speed;
      if(trainAnim.targetY - trainAnim.y<0) fl=540;
      trainAnim.element.style.transform =
        `translate(${trainAnim.x}px, ${trainAnim.y}px) rotateX(${fl}deg)`;
    }

    requestAnimationFrame(animateTrain);
  }

  animateTrain();
});
