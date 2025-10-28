import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export interface SavedPhoto {
  webPath?: string;
  lat?: number;
  lng?: number;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  photos: SavedPhoto[] = [];
  private readonly storageKey = 'photos';

  async loadPhotos() {
    const res = await Preferences.get({ key: this.storageKey });
    this.photos = res.value ? JSON.parse(res.value) : [];
  }

  async savePhotos() {
    await Preferences.set({ key: this.storageKey, value: JSON.stringify(this.photos) });
  }

  private async getLocation() {
    try {
      const pos = await Geolocation.getCurrentPosition();
      return { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch {
      return { lat: undefined, lng: undefined };
    }
  }

  async capturePhoto() {
    if (Capacitor.getPlatform() === 'web') {
      await this.captureUsingWebcam();
    } else {
      await this.handleCamera(CameraSource.Camera);
    }
  }

  async selectImage() {
    await this.handleCamera(CameraSource.Photos);
  }

  private async handleCamera(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source,
        quality: 90,
      });
      const loc = await this.getLocation();

      const newPhoto: SavedPhoto = {
        webPath: image.webPath,
        lat: loc.lat,
        lng: loc.lng,
        timestamp: new Date().toLocaleString(),
      };

      this.photos.unshift(newPhoto);
      await this.savePhotos();
    } catch (err) {
      console.error('Error:', err);
    }
  }

  private async captureUsingWebcam() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const video = document.createElement('video');
        video.autoplay = true;
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        document.body.appendChild(video);

        setTimeout(async () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          const base64Image = canvas.toDataURL('image/png');

          stream.getTracks().forEach(t => t.stop());
          video.remove();

          const loc = await this.getLocation();

          const newPhoto: SavedPhoto = {
            webPath: base64Image,
            lat: loc.lat,
            lng: loc.lng,
            timestamp: new Date().toLocaleString(),
          };

          this.photos.unshift(newPhoto);
          await this.savePhotos();
          resolve();
        }, 2000);
      } catch (err) {
        console.error('Webcam error:', err);
        reject(err);
      }
    });
  }

  async removePhoto(index: number) {
    this.photos.splice(index, 1);
    await this.savePhotos();
  }
}