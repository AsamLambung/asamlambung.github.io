// DISABLE RIGHT CLICK
document.addEventListener('contextmenu', event => {
  if (event.target.closest('.allow-right-click')) return; // let right-click happen
  event.preventDefault(); // block everywhere else
});

// MUSIC BUTTON TOGGLE
const toggleBtn = document.getElementById('music-toggle');
const music = document.getElementById('bg-music');
let isPlaying = false;

window.addEventListener('load', () => {
  music.muted = true;
  music.volume = 0;
  music.play().then(() => {
    isPlaying = true;
    music.muted = false;
    toggleBtn.classList.remove('paused');
    toggleBtn.classList.add('playing');
    toggleBtn.classList.add('animated');
    toggleBtn.setAttribute('aria-pressed', 'true');

    let vol = 0;
    const fadeIn = setInterval(() => {
      if (vol < 1) {
        vol += 0.02;
        music.volume = Math.min(vol, 1);
      } else {
        clearInterval(fadeIn);
      }
    }, 100);
  }).catch(err => {
    toggleBtn.classList.add('paused');
    toggleBtn.classList.remove('playing');
    toggleBtn.classList.remove('animated');
    toggleBtn.setAttribute('aria-pressed', 'false');
    console.log("Autoplay blocked:", err.message);
  });
});

toggleBtn.addEventListener('click', () => {
  if (isPlaying) {
    music.pause();
    toggleBtn.classList.add('paused');
    toggleBtn.classList.remove('playing');
    toggleBtn.classList.remove('animated');
  } else {
    music.play().then(() => {
      music.muted = false;
      music.volume = 1;
      toggleBtn.classList.remove('paused');
      toggleBtn.classList.add('playing');
      toggleBtn.classList.add('animated');
    }).catch(err => {
      console.warn("Manual play failed:", err.message);
    });
  }
  isPlaying = !isPlaying;
  toggleBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
});

// BURGER MENU TOGGLE
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

burger.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});

burger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    navMenu.classList.toggle('show');
  }
});

// HEADER HIDE ON SCROLL
let lastScrollTop = 0;
const header = document.querySelector('.main-header');
const upThreshold = 20;

window.addEventListener('scroll', function () {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    header.style.transform = 'translateY(-100%)';
  } else if (lastScrollTop - currentScroll > upThreshold) {
    header.style.transform = 'translateY(0)';
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// HERO ZOOM SCROLL
const heroImage = document.querySelector('.hero-image');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const maxScroll = 1500;
  const progress = Math.min(scrollY / maxScroll, 1);
  const scale = 1 - progress * 0.3;
  const translateY = progress * 500;
  const rawOpacity = 1 - Math.pow(progress, 2.5);
  const opacity = Math.max(rawOpacity, 0);
  heroImage.style.transform = `scale(${scale}) translateY(${translateY}px)`;
  heroImage.style.opacity = opacity;
});

// AUTOPLAY #1
const preview = document.getElementById("previewVideo");
const iframe = document.getElementById("videoIframe");
const playOverlay = document.getElementById("playOverlay");
const closeBtn = document.getElementById("closeBtn");

playOverlay.addEventListener("click", () => {
  iframe.src = "https://www.youtube.com/embed/P4m__tGuAq4?autoplay=1&rel=0&controls=1";
  preview.style.display = "none";
  iframe.style.display = "block";
  playOverlay.style.display = "none";
  closeBtn.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  iframe.src = "";
  iframe.style.display = "none";
  preview.style.display = "block";
  playOverlay.style.display = "block";
  closeBtn.style.display = "none";
});

// PAUSE VIDEO WHEN OFFSCREEN
const videos = document.querySelectorAll('video');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play();
    } else {
      video.pause();
    }
  });
}, {
  threshold: 0.5
});
videos.forEach(video => observer.observe(video));

// RESPONSIVE VIDEO SOURCES
function setVideoSources() {
  const videos = document.querySelectorAll('.responsive-video');
  const isMobile = window.innerWidth <= 768;

  videos.forEach(video => {
    const source = video.querySelector('source');
    const desktopSrc = video.getAttribute('data-src-desktop');
    const mobileSrc = video.getAttribute('data-src-mobile');
    const desiredSrc = isMobile ? mobileSrc : desktopSrc;

    if (!source.src.includes(desiredSrc)) {
      source.src = desiredSrc;
      video.load();
      video.play();
    }
  });
}
window.addEventListener('DOMContentLoaded', setVideoSources);
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(setVideoSources, 300);
});

// NEWSLETTER SUBMIT HANDLER
const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(newsletterForm);
    try {
      const res = await fetch(newsletterForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });
      if (res.ok) {
        window.location.href = "https://pramanathay.framer.media/thanks";
      } else {
        alert("❌ Something went wrong. Try again!");
      }
    } catch (err) {
      alert("❌ Network error.");
    }
  });
}

// SCRIBBLE IMAGE ON INTERSECTION
  document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.scribble-trigger');
  const scribbles = document.querySelectorAll('.scribble');

  triggers.forEach(trigger => {
    const scribbleId = trigger.dataset.target;
    const scribble = document.getElementById(scribbleId);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          scribble.classList.remove('hidden');
          scribble.classList.add('show');

          setTimeout(() => {
            scribble.classList.remove('show');
            scribble.classList.add('hidden');
          }, 750);
        }
      });
    }, {
      threshold: 0.5
    });

    observer.observe(trigger);
  });
});

// COOKIN TEXT SCROLL EFFECT
  const cookinText = document.querySelector('.fullscreen-text-subtext');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const offsetY = scrollY * 0.3; // tweak this for faster/slower movement

    cookinText.style.transform = `translateX(50%) translateY(-${offsetY}px)`;
  });

 
  document.getElementById("secret-link").addEventListener("click", () => {
    window.open("https://drive.google.com/drive/folders/1P1znApJKlESTNS2le_bd5dbs_vkb1yV8", "_blank");
  });

// LENIS SMOOTH SCROLL
const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
