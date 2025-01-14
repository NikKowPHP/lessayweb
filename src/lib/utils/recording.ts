export class RecordingHelper {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startTime: number = 0;
  private duration: number = 0;

  /**
   * Start recording audio
   * @returns Promise that resolves when recording starts
   */
  async startRecording(): Promise<void> {
    try {
      this.chunks = [];
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(this.stream);
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      // Set start time when recording begins
      this.startTime = Date.now();
      this.mediaRecorder.start();
      return Promise.resolve();
    } catch (error) {
      console.error('Error starting recording:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Stop recording and get the audio blob
   * @returns Promise resolving to the recorded audio Blob
   */
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        // Calculate final duration when recording stops
        this.duration = Math.round((Date.now() - this.startTime) / 1000);
        
        const audioBlob = new Blob(this.chunks, { type: 'audio/webm' });
        this.chunks = [];
        
        // Stop all tracks
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
        
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Get current recording duration in seconds
   * @returns number of seconds recorded
   */
  getCurrentDuration(): number {
    if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
      return this.duration;
    }
    return Math.round((Date.now() - this.startTime) / 1000);
  }

  /**
   * Get final recording duration in seconds
   * @returns number of seconds recorded
   */
  getFinalDuration(): number {
    return this.duration;
  }

  /**
   * Converts a Blob to base64 string
   */
  static convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
