import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {AdminService} from "../admin/services/admin.service";
import {ProfileService} from "../user/profile/profile.service";

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private userId: string = localStorage.getItem('userId');
  fetchedUser: any[] = [];

  constructor(private _authService: AuthService, private adminService: AdminService, private profileService: ProfileService, private authService:AuthService) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.profileService.getUserDetails(this.userId)
        .subscribe(
          (data => {
            const userArray = [];
            for (let key in data) {
              userArray.push(data[key]);
            }
            this.fetchedUser = userArray;
          })
        );
    }
  }

  // check if user is logged in by asking our authentication service, we use this function in html file *ngIf directive
  isLoggedIn() {
    return this._authService.isLoggedIn();
  }

  // this calls the logout function from our authentication service, it's activated when user clicks logout in front end.
  // It's called by the (click)='logout()' when the user presses the button
  logout() {
    return this._authService.logout();
  }

  isAdmin() {
    return this.adminService.isAdmin();
  }
}
