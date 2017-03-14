import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {FormService} from '../form/form.service';


@Component({
  selector: 'app-mainpage',
  templateUrl: './mainPage.component.html',
  styleUrls: ['./mainPage.component.css']
})


export class MainPageComponent implements OnInit {
  fetchedForms = [];
  constructor(
    private authService: AuthService,
    private formService: FormService
  ) {
  }

  ngOnInit() {
    this.formService.getSingleFormPerPostition('centerLeft')
      .subscribe(
        forms => this.fetchedForms = forms.forms,
        error => console.log(error));
  }

  // check if user is logged in by asking the authentication service, we use this function in html file *ngIf directive
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
