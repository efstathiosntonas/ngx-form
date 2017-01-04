import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
//import {CompanieService} from './companie.service';
import {RegionService} from '../region/region.service';
//import {RegionComponent} from '../region/region.component';
//import {Companie} from './companie.model';
import {ChangeDetectionStrategy, Input} from "@angular/core";
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastsManager} from 'ng2-toastr';
import { Inject, forwardRef} from '@angular/core';




@Component({
  selector: 'app-companie',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],

})
export class MapComponent implements OnInit {

    title: string = 'My first angular2-google-maps project';
    lat: number = 51.678418;
    lng: number = 7.809007;

  constructor(
    private toastr: ToastsManager
  ) {

  }

  ngOnInit() {


  }
}
