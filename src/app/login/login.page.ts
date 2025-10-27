import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    if (!this.email || !this.password) {
      return;
    }

    try {
      await this.auth.login();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
}
