class AudioManager {
  constructor() {
    this.audioContext = null;        // 用户交互后初始化
    this.soundBuffers = {};
    this.bgMusic = null;             // HTMLAudioElement
    this.settings = {
      sfxEnabled: false,
      bgmEnabled: false,
      sfxVolume: 0.5,
      bgmVolume: 0.5,
      bgmUrl: ''
    };
  }

  // 必须在用户首次点击页面后调用（解决自动播放策略）
  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // 预加载音效文件
  async loadSound(name, url) {
    if (!this.audioContext) return;
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.soundBuffers[name] = audioBuffer;
  }

  async preloadEffects() {
    // 等待用户激活 AudioContext 后再调用
    await this.loadSound('hover', '../mus/shortMus/snd_him_quick.ogg');
    await this.loadSound('click', '../mus/shortMus/click.ogg');
  }
  playSound(name) {
  if (!this.settings.sfxEnabled) return;
  if (!this.audioContext) return;
  const buffer = this.soundBuffers[name];
  if (!buffer) return;

  const source = this.audioContext.createBufferSource();
  source.buffer = buffer;
  
  const gainNode = this.audioContext.createGain();
  gainNode.gain.value = this.settings.sfxVolume;
  
  source.connect(gainNode);
  gainNode.connect(this.audioContext.destination);
  source.start();
}
}