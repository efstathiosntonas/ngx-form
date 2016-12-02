import {Component, OnInit, AfterViewInit} from '@angular/core';
import {AdminService} from '../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: 'adminPage.component.html',
  styleUrls: ['adminPage.component.css']
})
export class AdminPageComponent implements OnInit {

  fetchedForms = [];

  constructor(private adminService: AdminService) {
  }

  ngOnInit() {
    this.adminService.getUserForms()
      .subscribe(
        forms => this.fetchedForms = forms,
        error => {
          console.log(error);
        }
      );
  }

  onDelete(formId) {
    this.adminService.deleteForm(formId)
      .subscribe();
  }
}
