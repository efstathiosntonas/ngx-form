import {Component, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(public toastr: ToastsManager, public vRef: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vRef);
  }
}
