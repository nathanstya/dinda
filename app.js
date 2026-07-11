// App logic for "Selamat Tidur Dinda" Interactive Mobile Web App

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const statusTime = document.getElementById('status-time');
  const starfield = document.getElementById('starfield');
  const webBgStars = document.getElementById('web-bg-stars');
  const interactiveMoon = document.getElementById('interactive-moon');
  const skyContainer = document.getElementById('sky-container');
  const wavingBear = document.getElementById('waving-bear');
  const interactiveTeddy = document.getElementById('interactive-teddy');
  const loveToast = document.getElementById('love-toast');
  const petalsContainer = document.getElementById('petals-container');
  
  // Dock Buttons
  const btnHeart = document.getElementById('btn-heart');
  const btnStar = document.getElementById('btn-star');
  const btnLetter = document.getElementById('btn-letter');
  const btnFlower = document.getElementById('btn-flower');
  
  // Modal Elements
  const letterModal = document.getElementById('letter-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const envelope = document.getElementById('envelope');
  const envelopeLetter = document.getElementById('envelope-letter');
  
  // --- 1. Real-time Status Bar Clock ---
  function updateClock() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    statusTime.textContent = `${hours}:${minutes}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // --- 2. Dynamic Twinkling Stars Generation ---
  function generateStars(container, count, isFullBg = false) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      const size = Math.random() * 2.5 + 1; // 1px to 3.5px
      const top = Math.random() * (isFullBg ? 100 : 60); // only top 60% of phone screen
      const left = Math.random() * 100;
      const duration = Math.random() * 2 + 1.5; // 1.5s to 3.5s
      const delay = Math.random() * 2;
      
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${top}%`;
      star.style.left = `${left}%`;
      star.style.animation = `twinkle ${duration}s ease-in-out ${delay}s infinite`;
      
      container.appendChild(star);
    }
  }
  // Generate stars inside phone screen
  generateStars(starfield, 45, false);
  // Generate stars in the browser desktop background
  generateStars(webBgStars, 80, true);

  // --- 3. Moon click: Sky Color Change (🌙 Bulan -> mengubah warna langit) ---
  const skyGradients = ['sky-midnight', 'sky-purple', 'sky-violet', 'sky-aurora'];
  let currentSkyIndex = 0;

  interactiveMoon.addEventListener('click', (e) => {
    // Visual feedback
    interactiveMoon.style.transform = 'scale(0.85)';
    setTimeout(() => {
      interactiveMoon.style.transform = '';
    }, 150);

    // Play soft click sound
    playTing(800, 0.15, 'triangle'); 

    // Cycle index
    currentSkyIndex = (currentSkyIndex + 1) % skyGradients.length;
    
    // Switch active class
    const gradients = skyContainer.querySelectorAll('.sky-gradient');
    gradients.forEach(grad => grad.classList.remove('active-sky'));
    
    const targetGradId = skyGradients[currentSkyIndex];
    document.getElementById(targetGradId).classList.add('active-sky');

    // Create moon sparkle rings
    createSparkleRing(e.clientX, e.clientY, '#fffdec');
  });

  // --- 4. Star Click Sound: synthesized Web Audio (⭐ Bintang -> suara "ting") ---
  // Web Audio Context setup (will initialize on user interaction)
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTing(freq = 1320, duration = 0.4, type = 'sine') {
    initAudio();
    if (!audioCtx) return;
    
    // Resume context if suspended (browser autoplays policies)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Bell envelope
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  // Bind sound to ⭐ button
  btnStar.addEventListener('click', (e) => {
    // Play sound
    playTing(1320, 0.5, 'sine'); // Clean crystalline bell sound

    // Visual effect: sparkle explosion from button
    const rect = btnStar.getBoundingClientRect();
    createSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
  });

  // Let the user tap the starfield inside the screen to play "ting" too!
  starfield.addEventListener('click', (e) => {
    // Play random high pitch bells
    const pitches = [1046.50, 1174.66, 1318.51, 1396.91, 1567.98, 1760.00]; // Pentatonic notes C6 - A6
    const randomPitch = pitches[Math.floor(Math.random() * pitches.length)];
    playTing(randomPitch, 0.4, 'sine');
    
    // Sparkle effect at touch position
    createSparkles(e.clientX, e.clientY, 5);
  });

  // --- 5. Heart Interaction (❤️ Hati -> muncul "Aku sayang kamu 🤍") ---
  let toastTimeout = null;

  btnHeart.addEventListener('click', (e) => {
    // 1. Show floating text
    loveToast.classList.add('show');
    
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      loveToast.classList.remove('show');
    }, 2500);

    // 2. Play sound
    playTing(523.25, 0.35, 'triangle'); // Warm soft sound

    // 3. Heart particle explosion
    const rect = btnHeart.getBoundingClientRect();
    createHearts(rect.left + rect.width / 2, rect.top, 6);
  });

  function createHearts(startX, startY, count) {
    const screen = document.getElementById('phone-screen');
    const screenRect = screen.getBoundingClientRect();

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'love-heart-particle';
      heart.textContent = Math.random() > 0.5 ? '❤️' : '💖';
      
      // Calculate coordinates relative to phone screen container
      const relX = startX - screenRect.left;
      const relY = startY - screenRect.top;
      
      heart.style.left = `${relX}px`;
      heart.style.top = `${relY}px`;
      
      // Random directions
      const xDir = (Math.random() * 80 - 40) + 'px';
      const rotation = (Math.random() * 90 - 45) + 'deg';
      heart.style.setProperty('--x-dir', xDir);
      heart.style.setProperty('--rot', rotation);
      
      screen.appendChild(heart);
      
      // Remove after animation finishes
      setTimeout(() => heart.remove(), 1500);
    }
  }

  // --- 6. Teddy Bounce (🧸 Boneka -> lompat-lompat) ---
  interactiveTeddy.addEventListener('click', () => {
    if (interactiveTeddy.classList.contains('teddy-jump')) return;
    
    // Play funny bounce sound
    playTing(330, 0.25, 'triangle'); 
    setTimeout(() => playTing(440, 0.25, 'triangle'), 100);

    // Trigger animation
    interactiveTeddy.classList.add('teddy-jump');
    
    // Remove class on animation end
    interactiveTeddy.addEventListener('animationend', () => {
      interactiveTeddy.classList.remove('teddy-jump');
    }, { once: true });
  });

  // --- 7. Rose Petals Falling (🌹 Bunga -> kelopak berjatuhan) ---
  btnFlower.addEventListener('click', () => {
    // Sound effect
    playTing(659.25, 0.3, 'sine');
    
    // Spawn 20 falling petals
    const petalColors = ['#ff8ca3', '#ff6b8b', '#ff4d6d', '#ffccd5'];
    for (let i = 0; i < 24; i++) {
      setTimeout(() => {
        createPetal(petalColors[Math.floor(Math.random() * petalColors.length)]);
      }, i * 80);
    }
  });

  function createPetal(color) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    const randomLeft = Math.random() * 100; // % position
    const sizeWidth = Math.random() * 6 + 8; // 8px to 14px
    const sizeHeight = sizeWidth * 0.8;
    const duration = Math.random() * 1.5 + 2.5; // 2.5s to 4s
    const drift = (Math.random() * 100 - 50) + 'px';
    
    petal.style.backgroundColor = color;
    petal.style.left = `${randomLeft}%`;
    petal.style.width = `${sizeWidth}px`;
    petal.style.height = `${sizeHeight}px`;
    petal.style.setProperty('--x-drift', drift);
    petal.style.animation = `fallPetal ${duration}s linear forwards`;
    
    petalsContainer.appendChild(petal);
    
    setTimeout(() => petal.remove(), duration * 1000);
  }

  // --- 8. Envelope Modal (💌 Surat -> membuka pesan rahasia) ---
  btnLetter.addEventListener('click', () => {
    playTing(587.33, 0.3, 'sine');
    letterModal.classList.add('show');
  });

  // Open envelope on click
  envelope.addEventListener('click', (e) => {
    // Prevent letter container clicks from re-triggering envelope clicks if bubble propagation occurs
    if (e.target.closest('#envelope-letter')) return;

    const flap = envelope.querySelector('.envelope-flap');
    const isClosed = !envelopeLetter.classList.contains('slide-up');

    if (isClosed) {
      playTing(440, 0.15, 'sine');
      setTimeout(() => playTing(880, 0.35, 'sine'), 100);
      
      flap.classList.add('envelope-open-flap');
      envelopeLetter.classList.add('slide-up');
    } else {
      playTing(330, 0.25, 'sine');
      envelopeLetter.classList.remove('slide-up');
      setTimeout(() => {
        flap.classList.remove('envelope-open-flap');
      }, 350); // wait until letter slides down before closing flap
    }
  });

  // Close Modal
  btnCloseModal.addEventListener('click', () => {
    playTing(300, 0.2, 'triangle');
    letterModal.classList.remove('show');
    
    // Reset envelope states
    const flap = envelope.querySelector('.envelope-flap');
    envelopeLetter.classList.remove('slide-up');
    flap.classList.remove('envelope-open-flap');
  });

  // Close modal when clicking outside modal-content
  letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) {
      btnCloseModal.click();
    }
  });

  // --- Visual Helper Functions ---
  // Sparkle generator for ⭐ and tap starfield
  function createSparkles(x, y, count) {
    const screen = document.getElementById('phone-screen');
    const screenRect = screen.getBoundingClientRect();
    
    // Check if within bounds of phone screen
    const relX = x - screenRect.left;
    const relY = y - screenRect.top;

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'star-sparkle';
      
      sparkle.style.left = `${relX}px`;
      sparkle.style.top = `${relY}px`;
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 45 + 15;
      const xDir = Math.cos(angle) * velocity + 'px';
      const yDir = Math.sin(angle) * velocity + 'px';
      
      sparkle.style.setProperty('--x-dir', xDir);
      sparkle.style.setProperty('--y-dir', yDir);
      
      screen.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 800);
    }
  }

  // Sparkle ring for Moon clicked
  function createSparkleRing(x, y, color) {
    const screen = document.getElementById('phone-screen');
    const screenRect = screen.getBoundingClientRect();
    const relX = x - screenRect.left;
    const relY = y - screenRect.top;

    const count = 12;
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'star-sparkle';
      sparkle.style.backgroundColor = color;
      sparkle.style.boxShadow = `0 0 6px ${color}`;
      
      sparkle.style.left = `${relX}px`;
      sparkle.style.top = `${relY}px`;
      
      const angle = (i / count) * Math.PI * 2;
      const velocity = 35;
      const xDir = Math.cos(angle) * velocity + 'px';
      const yDir = Math.sin(angle) * velocity + 'px';
      
      sparkle.style.setProperty('--x-dir', xDir);
      sparkle.style.setProperty('--y-dir', yDir);
      
      screen.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    }
  }
});
