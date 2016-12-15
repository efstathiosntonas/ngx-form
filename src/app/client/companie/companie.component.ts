import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {CompanieService} from './companie.service';
import {ChangeDetectionStrategy, Input} from "@angular/core";
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ngbd-modal-content',
  templateUrl: 'companieEditModal.component.html',
})
export class NgbdModalContent {
  companie = [];
  constructor(public activeModal: NgbActiveModal) {}
}






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
    private modalService: NgbModal
  ) {
    this.getCompanies(this.paginationData.currentPage);
  }

  onEdit(id: string) {

    const modalRef = this.modalService.open(NgbdModalContent);
    //modalRef.componentInstance.name = id;

    this.companieService.getCompanie(id)
      .subscribe(
        res => {
          modalRef.componentInstance.companie = res;
        },
        error => {
          console.log(error);
        }
      );

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


}
