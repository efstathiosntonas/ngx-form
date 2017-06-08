import {ToastOptions} from 'ng2-toastr';

export class CustomOption extends ToastOptions {
  animate = 'flyRight'; // you can override any options available
  newestOnTop = false;
  showCloseButton = true;
  positionClass    = 'toast-top-right';
  preventDuplicates= true;
  showMethod       = 'fadeIn';
  hideMethod       = 'fadeOut';
  showEasing       = 'swing';
  hideEasing       = 'linear';
  onclick          = null;
}
