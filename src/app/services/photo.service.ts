import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation, Position  } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';

export interface SavedPhoto {
  filepath: string;
  webPath?: string;
  lat?: number;
  lng?: number;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private readonly storageKey = 'photos';
  photos: SavedPhoto[] = [];

  async loadPhotos() {
    const res = await Preferences.get({ key: this.storageKey });
    this.photos = res.value ? JSON.parse(res.value) : [];
  }

  async savePhotos() {
    await Preferences.set({ key: this.storageKey, value: JSON.stringify(this.photos) });
  }

  async capturePhoto() {
    if (!('capacitor' in window)) {
      return new Promise<void>(async (resolve, reject) => {
        try {
          const video = document.createElement('video');
          video.autoplay = true;

          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = stream;
          document.body.appendChild(video);

          setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

            stream.getTracks().forEach(track => track.stop());
            video.remove();

            const newPhoto: SavedPhoto = {
              filepath: '',
              webPath: canvas.toDataURL('image/png'),
              lat: undefined,
              lng: undefined,
              timestamp: new Date().toLocaleString()
            };
            this.photos.unshift(newPhoto);
            this.savePhotos();
            resolve();
          }, 2000);

        } catch (err) {
          console.error('Error accessing webcam', err);
          reject(err);
        }
      });
    } else {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 90
      });

const coords: Position | null = await Geolocation.getCurrentPosition().catch(() => null);

      const newPhoto: SavedPhoto = {
        filepath: image.webPath || '',
        webPath: image.webPath,
        lat: coords?.coords.latitude,
        lng: coords?.coords.longitude,
        timestamp: new Date().toLocaleString(),
      };

      this.photos.unshift(newPhoto);
      await this.savePhotos();
    }
  }

  async removePhoto(index: number) {
    this.photos.splice(index, 1);
    await this.savePhotos();
  }
}