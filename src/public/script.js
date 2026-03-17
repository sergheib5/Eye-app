document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const restartBtn = document.getElementById('restart-btn');
  const stopBtn = document.getElementById('stop-btn');
  const muteBtn = document.getElementById('mute-btn');
  const randomSessionBtn = document.getElementById('random-session-btn');
  const startOverlay = document.getElementById('start-overlay');
  const endOverlay = document.getElementById('end-overlay');
  const target = document.getElementById('exercise-target');
  const timerDisplay = document.getElementById('timer');
  const speedBtns = document.querySelectorAll('.speed-btn');
  const exerciseSelect = document.getElementById('exercise-select');
  const container = document.querySelector('.app-viewport');
  const sessionInfo = document.getElementById('session-info');
  const progressText = document.getElementById('progress-text');
  const hudBottom = document.querySelector('.hud-bottom');

  const SINGLE_EXERCISE_DURATION = 60; 
  const RANDOM_EXERCISE_DURATION = 20; 
  let timeRemaining = SINGLE_EXERCISE_DURATION;
  let timerInterval = null;
  let isRunning = false;
  let isSessionMode = false;
  let sessionQueue = [];
  let sessionIndex = 0;
  let inactivityTimeout = null;
  let isMuted = false;

  // Load Config from server
  fetch('/config')
    .then(res => res.json())
    .then(config => {
      setSpeed(config.speed || 1);
    });

  function setSpeed(multiplier) {
    const newSpeed = 4 * multiplier;
    target.style.setProperty('--anim-speed', `${newSpeed}s`);
    
    // Update UI buttons
    speedBtns.forEach(btn => {
      btn.classList.remove('active');
      if (parseFloat(btn.dataset.speed) === multiplier) {
        btn.classList.add('active');
      }
    });

    // Save to server
    fetch('/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speed: multiplier })
    });
  }

  const patterns = ['infinity', 'circle', 'z-pattern', 'triangle', 'cross', 'zoom'];
  const themes = ['theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-yellow'];

  function updateTargetVisuals(pattern, themeIndex) {
    target.classList.remove('animating', ...patterns, ...themes);
    
    // Force DOM reflow to restart CSS animations reliably
    void target.offsetWidth;

    const themeClass = themes[themeIndex % themes.length];
    target.classList.add('animating', pattern, themeClass);
    
    // Update instruction text based on pattern
    const instruction = document.getElementById('instruction-text');
    if (pattern === 'zoom') {
      instruction.innerText = "Focus on the dot. As it grows, imagine it's coming closer. As it shrinks, imagine it's moving far away.";
    } else {
      instruction.innerText = "Follow the moving dot with your eyes, keeping your head completely still.";
    }
  }

  // Handle speed changes
  speedBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const speedMultiplier = parseFloat(e.target.dataset.speed);
      setSpeed(speedMultiplier);
    });
  });

  // Audio Chime Logic
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function playChime(type) {
    if (isMuted) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'start') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.2);
    }
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }

  // Handle Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    wakeHUD();
    if (e.code === 'Space') {
      e.preventDefault();
      if (isRunning) {
        stopExercise();
      } else if (!startOverlay.classList.contains('hidden') || !endOverlay.classList.contains('hidden')) {
        startExerciseOrSession();
      }
    }
  });

  // Handle Mouse Idle / HUD Hiding
  function wakeHUD() {
    hudBottom.classList.remove('hud-hidden');
    clearTimeout(inactivityTimeout);
    
    if (isRunning) {
      inactivityTimeout = setTimeout(() => {
        if (isRunning) {
          hudBottom.classList.add('hud-hidden');
        }
      }, 2500);
    }
  }

  window.addEventListener('mousemove', wakeHUD);
  window.addEventListener('touchstart', wakeHUD);

  function startExercise(pattern = null, duration = SINGLE_EXERCISE_DURATION) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playChime('start');
    
    isRunning = true;
    timeRemaining = duration;
    timerDisplay.innerText = timeRemaining;
    
    startOverlay.classList.add('hidden');
    endOverlay.classList.add('hidden');
    stopBtn.classList.remove('hidden');
    container.classList.add('is-running');
    wakeHUD(); // Trigger initial timeout countdown
    
    const selectedPattern = pattern || exerciseSelect.value;
    const themeIdx = pattern ? patterns.indexOf(pattern) : patterns.indexOf(selectedPattern);
    
    updateTargetVisuals(selectedPattern, themeIdx >= 0 ? themeIdx : 0);

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeRemaining--;
      timerDisplay.innerText = timeRemaining;

      if (timeRemaining <= 0) {
        playChime('end');
        if (isSessionMode) {
          nextInSession();
        } else {
          endExercise();
        }
      }
    }, 1000);
  }

  function shuffleSession() {
    isSessionMode = true;
    sessionQueue = [...patterns].sort(() => Math.random() - 0.5);
    sessionIndex = 0;
    
    sessionInfo.classList.remove('hidden');
    updateProgress();
  }

  function startSequentialSession() {
    isSessionMode = true;
    sessionQueue = [...patterns];
    sessionIndex = 0;
    
    sessionInfo.classList.remove('hidden');
    updateProgress();
  }

  function startExerciseOrSession() {
    if (isSessionMode) {
      startExercise(sessionQueue[sessionIndex], RANDOM_EXERCISE_DURATION);
    } else {
      const selected = exerciseSelect.value;
      if (selected === 'all') {
        startSequentialSession();
        startExercise(sessionQueue[sessionIndex], RANDOM_EXERCISE_DURATION);
      } else {
        startExercise(selected, SINGLE_EXERCISE_DURATION);
      }
    }
  }

  function nextInSession() {
    sessionIndex++;
    if (sessionIndex < sessionQueue.length) {
      updateProgress();
      startExercise(sessionQueue[sessionIndex], RANDOM_EXERCISE_DURATION);
    } else {
      endExercise();
    }
  }

  function updateProgress() {
    progressText.innerText = `${sessionIndex + 1}/${sessionQueue.length}`;
  }

  function endExercise() {
    isRunning = false;
    isSessionMode = false;
    clearInterval(timerInterval);
    target.classList.remove('animating');
    endOverlay.classList.remove('hidden');
    sessionInfo.classList.add('hidden');
    stopBtn.classList.add('hidden');
    container.classList.remove('is-running');
    hudBottom.classList.remove('hud-hidden');
    clearTimeout(inactivityTimeout);
  }

  function stopExercise() {
    isRunning = false;
    isSessionMode = false;
    clearInterval(timerInterval);
    target.classList.remove('animating', ...patterns, ...themes);
    startOverlay.classList.remove('hidden');
    endOverlay.classList.add('hidden');
    sessionInfo.classList.add('hidden');
    stopBtn.classList.add('hidden');
    container.classList.remove('is-running');
    hudBottom.classList.remove('hud-hidden');
    clearTimeout(inactivityTimeout);
  }

  startBtn.addEventListener('click', () => {
    startExerciseOrSession();
  });

  stopBtn.addEventListener('click', stopExercise);

  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.classList.toggle('is-muted');
  });

  randomSessionBtn.addEventListener('click', () => {
    shuffleSession();
  });
  
  restartBtn.addEventListener('click', () => {
    if (sessionQueue.length > 0) {
      // Re-run the exact same type of session
      if (exerciseSelect.value === 'all' && !isSessionMode && sessionQueue.length === patterns.length) {
          startSequentialSession();
      } else {
          // If we had a custom shuffled queue, shuffle again
          shuffleSession();
      }
      startExerciseOrSession();
    } else {
      isSessionMode = false;
      startExercise(exerciseSelect.value === 'all' ? null : exerciseSelect.value);
    }
  });
});
