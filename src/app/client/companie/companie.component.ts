import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {CompanieService} from './companie.service';
import {ChangeDetectionStrategy, Input} from "@angular/core";



@Component({
  selector: 'app-companie',
  templateUrl: 'companie.component.html',
  styleUrls: ['companie.component.css'],

})


export class CompanieComponent implements OnInit {
  private fetchedCompanies : Array<CompanieComponent> = [];
  loading: boolean;
  paginationData = {
    currentPage:1,
    itemsPerPage:0,
    totalItems:0
  };

  constructor(
    private companieService: CompanieService
  ) {
    this.getCompanies(this.paginationData.currentPage);
  }

  getPage(page: number) {
    this.loading = true;
    this.getCompanies(page);
  }

  getCompanies(page) {
    this.companieService.getCompanies(page)
      .subscribe(
        res => {
        //  console.log("companies");
        //  console.log(res);
          this.paginationData = res.paginationData;
          this.fetchedCompanies =  res.data
          this.loading = false;
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.getCompanies(1) ;

  }

  onEdit() {

  }


}
