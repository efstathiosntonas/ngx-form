import {Component} from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'main-page',
  templateUrl: 'mainPage.component.html',
  styleUrls: ['mainPage.component.css']
})

export class MainPageComponent {
  constructor(private _authService: AuthService){}

  isLoggedIn() {
    return this._authService.isLoggedIn();
  }
}
