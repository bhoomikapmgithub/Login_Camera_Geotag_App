import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PhotoService } from '../services/photo.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HomePage {
  placeholder = 'assets/placeholder.png';

  constructor(
    public ps: PhotoService,
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async ionViewWillEnter() {
    await this.ps.loadPhotos();
  }

  async capture() {
    await this.ps.capturePhoto();
  }

  // 🗑 Confirm before deleting a photo
  async remove(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Photo',
      message: 'Are you sure you want to delete this photo?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.ps.removePhoto(index);
          },
        },
      ],
    });
    await alert.present();
  }

  // 🚪 Confirm before logout
  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          handler: async () => {
            await this.auth.logout();
            this.router.navigateByUrl('/login', { replaceUrl: true });
          },
        },
      ],
    });
    await alert.present();
  }

  get photos() {
    return this.ps.photos;
  }
}