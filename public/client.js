document.addEventListener('DOMContentLoaded', () => {
  const joinButton = document.getElementById('joinButton');
  const statusElement = document.getElementById('status');
  const overlay = document.getElementById('overlay');
  const container = document.querySelector('.container');

  if (typeof timesync === 'undefined') {
    console.error('Timesync library is not loaded. Please check your setup and try again.');
    statusElement.textContent = 'Error: Timesync library not loaded';
    return;
  }

  const ts = timesync.create({
    server: '/timesync',
    interval: 10000
  });

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const socket = new WebSocket(`${protocol}://${window.location.host}`);

  let isReady = false;
  let speechSynthesis = window.speechSynthesis;
  let assignedVoice = null;
  let uniqueColor;
  let animationFrameId;

  function generateUniqueColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
  }

  function goFullscreen() {
    const docElm = document.documentElement;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) { // Firefox
      docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullscreen) { // Chrome, Safari and Opera
      docElm.webkitRequestFullscreen();
    } else if (docElm.msRequestFullscreen) { // IE/Edge
      docElm.msRequestFullscreen();
    }
  }

  joinButton.addEventListener('click', () => {
    if (socket.readyState === WebSocket.OPEN) {
      goFullscreen();
      socket.send(JSON.stringify({ type: 'join' }));
      isReady = true;
      joinButton.disabled = true;
      statusElement.textContent = 'Waiting for voice assignment...';
      
      // iOS requires user interaction to enable audio
      speechSynthesis.speak(new SpeechSynthesisUtterance(''));

      // Show overlay and hide container
      overlay.style.display = 'block';
      container.style.display = 'none';

      // Generate unique color for this client
      uniqueColor = generateUniqueColor();
    } else {
      console.error('WebSocket is not open');
      statusElement.textContent = 'Error: Could not connect to server';
    }
  });

  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'voice-assignment') {
        assignedVoice = data.voice;
        console.log(`Assigned voice: ${assignedVoice}. Waiting for playback...`);
      } else if (data.type === 'playback') {
        const { phrase, time: playbackTime } = data;

        const now = ts.now();
        const delay = playbackTime - now;

        if (delay > 0) {
          console.log(`Scheduling playback of "${phrase}" in ${delay} ms`);
          setTimeout(() => playPhrase(phrase), delay);
        } else {
          console.error('Received playback time is in the past');
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  function playPhrase(phrase) {
    const utterance = new SpeechSynthesisUtterance(phrase);
    
    if (assignedVoice) {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === assignedVoice);
      if (voice) {
        utterance.voice = voice;
      } else {
        console.warn(`Assigned voice "${assignedVoice}" not found. Using default voice.`);
      }
    }

    utterance.onstart = () => {
      startVisualization();
    };

    utterance.onend = () => {
      stopVisualization();
    };

    utterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event);
      stopVisualization();
    };
    
    speechSynthesis.speak(utterance);
  }

  function startVisualization() {
    let opacity = 0;
    let increasing = true;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      if (increasing) {
        opacity += 0.05;
        if (opacity >= 1) {
          opacity = 1;
          increasing = false;
        }
      } else {
        opacity -= 0.05;
        if (opacity <= 0) {
          opacity = 0;
          increasing = true;
        }
      }

      overlay.style.backgroundColor = uniqueColor;
      overlay.style.opacity = opacity;
    }

    animate();
  }

  function stopVisualization() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    overlay.style.backgroundColor = 'black';
    overlay.style.opacity = 1;
  }

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
  });

  socket.addEventListener('close', () => {
    console.log('WebSocket connection closed');
    overlay.style.display = 'none';
    container.style.display = 'block';
    joinButton.disabled = false;
    isReady = false;
    stopVisualization();
  });
});