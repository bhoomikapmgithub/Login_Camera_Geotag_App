import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly key = 'user_logged_in';

  async login() {
    await Preferences.set({ key: this.key, value: 'true' });
  }

  async logout() {
    await Preferences.remove({ key: this.key });
  }

  async isLoggedIn(): Promise<boolean> {
    const res = await Preferences.get({ key: this.key });
    return res.value === 'true';
  }
}