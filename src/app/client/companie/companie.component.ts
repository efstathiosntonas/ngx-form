import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {CompanieService} from './companie.service';
import {ChangeDetectionStrategy, Input} from "@angular/core";
import { ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';



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
    private companieService: CompanieService,
    overlay: Overlay,
    vcRef: ViewContainerRef,
    public modal: Modal
  ) {
    this.getCompanies(this.paginationData.currentPage);
    overlay.defaultViewContainer = vcRef;
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
    this.modal.alert()
        .size('lg')
        .showClose(true)
        .title('A simple Alert style modal window')
        .body(`
            <h4>Alert is a classic (title/body/footer) 1 button modal window that
            does not block.</h4>
            <b>Configuration:</b>
            <ul>
                <li>Non blocking (click anywhere outside to dismiss)</li>
                <li>Size large</li>
                <li>Dismissed with default keyboard key (ESC)</li>
                <li>Close wth button click</li>
                <li>HTML content</li>
            </ul>`)
        .open();
  }


}
