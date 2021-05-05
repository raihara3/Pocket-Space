class AudioMedia {
  public stream: MediaStream | null

  constructor() {
    this.stream = null
  }

  async get() {
    this.stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
    })
  }

  get getTrack() {
    if(!this.stream) return
    return this.stream.getAudioTracks()[0]
  }

  switching() {
    if(!this.stream) return false
    const enabled = this.stream.getAudioTracks()[0].enabled
    this.stream.getAudioTracks()[0].enabled = !enabled
    return !enabled
  }
}

export default AudioMedia
