import {Component} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: 'mainPage.component.html',
  styleUrls: ['mainPage.component.css']
})

export class MainPageComponent {
  constructor(private _authService: AuthService) {
  }

  // check if user is logged in by asking the authentication service, we use this function in html file *ngIf directive
  isLoggedIn() {
    return this._authService.isLoggedIn();
  }
}
