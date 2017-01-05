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
import {AgmCoreModule} from 'angular2-google-maps/core';
import { MouseEvent } from "angular2-google-maps/core";


@Component({
  selector: 'app-companie',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],

})
export class MapComponent implements OnInit {

    zoom: number = 8;
    lat: number = 51.673858;
    lng: number = 7.815982;


    markers: marker[] = [
  	  {
  		  lat: 51.673858,
  		  lng: 7.815982,
  		  label: 'A',
  		  draggable: true
  	  },
  	  {
  		  lat: 51.373858,
  		  lng: 7.215982,
  		  label: 'B',
  		  draggable: false
  	  },
  	  {
  		  lat: 51.723858,
  		  lng: 7.895982,
  		  label: 'C',
  		  draggable: true
  	  }
    ]


    constructor(
      private toastr: ToastsManager
    ) {}

    clickedMarker(label: string, index: number) {
      console.log(`clicked the marker: ${label || index}`)
    }



  mapClicked($event: MouseEvent) {

    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      label: "New position",
      draggable: true

    });
  }



  markerDragEnd(m: marker, $event: MouseEvent) {
    let markerSected: marker;
    markerSected = this.markers.filter(function (marker) { return marker.label == m.label })[0];
    markerSected.lat = $event.coords.lat;
    markerSected.lng = $event.coords.lng;

  }

  ngOnInit() {
  }
}


// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}
