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
      visible: true,
      flip: 1,
    });
  }

  // Header Parallax
  createScrollAnimation(logo, y => ({ x: y * 0.5, y: 0 }), 0.1);
  createScrollAnimation(edition, y => ({ x: -y * 0.5, y: 0 }), 0.1);
  createScrollAnimation(loco, y => ({ x: 0, y: -y * 0.4 }), 0.12);
  createScrollAnimation(v1, y => ({ x: 0, y: -y * 0.15 }), 0.12);
  createScrollAnimation(v2, y => ({ x: 0, y: -y * 0.4 }), 0.12);
  createScrollAnimation(v3, y => ({ x: 0, y: -y * 0.2 }), 0.12);

  if (img) {
    createScrollAnimation(img, () => ({}), 0.12);
    const trainAnim = scrollAnimations.find(a => a.element === img);
    let prevScrollY = window.scrollY;
    
    // Position tracking
    let trainPosX = 0;
    let trainPosY = 0;
    let hasIntersected = false;

    // --- TRAIN INTERSECTION OBSERVER ---
    const trainObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          hasIntersected = true; // Lock the start trigger
          img.style.opacity = "1";
        }
        trainAnim.visible = entry.isIntersecting;
      });
    }, { 
      rootMargin: '1200px', // Massive margin: keeps train alive during long diagonal trips
      threshold: 0.01 
    });
    
    trainObserver.observe(img);

    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      const delta = scrollY - prevScrollY;

      scrollAnimations.forEach(anim => {
        if (anim.element.id === "train_image") {
          // Locked Diagonal: Only moves once user hits the trigger point
          if (hasIntersected) {
            trainPosX += delta * 1.5; 
            trainPosY -= delta * 0.6;

            anim.targetX = trainPosX;
            anim.targetY = trainPosY;
            
            // Lateral Inversion: Flip based on scroll direction
            if (delta > 0) anim.flip = 1;
            else if (delta < 0) anim.flip = -1;
          }
        } else {
          const pos = anim.onScroll(scrollY) || {};
          if (pos.x !== undefined) anim.targetX = pos.x;
          if (pos.y !== undefined) anim.targetY = pos.y;
        }
      });
      prevScrollY = scrollY;
    });
  }

  if (scrollDir) {
    let activated = false;
    const observer = new IntersectionObserver(entries => {
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
    }, { threshold: 0.3 });
    observer.observe(scrollDir);
  }

  function animateScroll() {
    scrollAnimations.forEach(anim => {
      anim.currentX += (anim.targetX - anim.currentX) * anim.easing;
      anim.currentY += (anim.targetY - anim.currentY) * anim.easing;
      
      let transform = `translate(${anim.currentX}px, ${anim.currentY}px)`;
      if (anim.element.id === "train_image") {
        transform += ` scaleX(${anim.flip})`;
      }
      anim.element.style.transform = transform;
    });
    requestAnimationFrame(animateScroll);
  }
  animateScroll();

  function registerParallax(containerId, imgSelector, textSelector, speed) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const pImg = container.querySelector(imgSelector);
    const pTxt = container.querySelector(textSelector);
    createScrollAnimation(pImg, scrollY => {
      const start = container.offsetTop;
      return scrollY < start ? { x: 0, y: 0 } : { x: 0, y: -(scrollY - start) * speed };
    }, 0.08);
    if (pTxt) {
      createScrollAnimation(pTxt, scrollY => {
        const start = container.offsetTop;
        return scrollY < start ? { x: -50, y: 0 } : { x: -50, y: -(scrollY - start) * speed };
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
    new IntersectionObserver(entries => { if (entries[0].isIntersecting) line.classList.add("draw"); }, { threshold: 0.3 }).observe(line);
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
    let progress = scrollY <= mid ? (scrollY - start) / (mid - start) : (scrollY - mid) / (end - mid);
    fixedMedia.style.clipPath = scrollY <= mid ? `inset(${100 - progress * 100}% 0 0 0)` : `inset(0 0 ${progress * 100}% 0)`;
  });
}