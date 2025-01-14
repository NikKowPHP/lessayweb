export class RecordingHelper {
  /**
   * Converts a Blob to base64 string, removing the data URL prefix
   * @param blob The audio Blob to convert
   * @returns Promise resolving to base64 string without data URL prefix
   */
  static convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        // Remove the data URL prefix (e.g., "data:audio/wav;base64,")
        const base64Data = base64String.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
}
