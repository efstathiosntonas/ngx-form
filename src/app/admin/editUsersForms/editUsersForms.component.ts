import {Component, OnInit, EventEmitter, ElementRef, ViewChild, Renderer, AfterViewInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr';
import {Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {AdminService} from '../services/admin.service';

@Component({
  selector: 'app-edit-users-forms',
  templateUrl: './editUsersForms.component.html',
  styleUrls: ['./editUsersForms.component.css']
})
export class EditUsersFormsComponent implements OnInit, AfterViewInit {

  onClear: EventEmitter<any> = new EventEmitter();

  fetchedForm: any[] = [];
  myForm: FormGroup;
  textInput1: FormControl;
  textInput2: FormControl;

  jwt: string = localStorage.getItem('id_token');
  url: string = '/admin/edit/';
  maxSize: number = 5000000;
  invalidFileSizeMessage: string = '{0}: Invalid file size, ';
  invalidFileSizeMessageDetail: string = 'Maximum upload size is {0}.';
  public files: File[];
  public progress: number = 0;
  private submitStarted: boolean;
  @ViewChild('textOne') textOne: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private adminService: AdminService, private toastr: ToastsManager, private _fb: FormBuilder,
              private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer,
              private renderer: Renderer) {
  }

  ngOnInit() {
    // grabbing the form id from the url
    let formId = this.route.snapshot.params['id'];
    this.adminService.getSingleForm(formId)
      .subscribe(
        (data => {
          const formArray = [];
          for (let key in data) {
            formArray.push(data[key]);
          }
          this.fetchedForm = formArray;
        })
      );

    this.textInput1 = new FormControl('', Validators.required);
    this.textInput2 = new FormControl('', Validators.required);

    this.myForm = this._fb.group({
      textInput1: this.textInput1,
      textInput2: this.textInput2
    });
  }

  // focus on first input box after the view is initialized
  ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.textOne.nativeElement, 'focus', []);
    }, 50);
  }

  // cancel and return to the user's forms page
  cancel() {
    this.router.navigate(['user/forms']);
  }

  // event fired when the user selects an image
  onFileSelect(event) {
    this.clear();
    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (this.validate(file)) {
        if (this.isImage(file)) {
          file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
          this.files.push(files[i]);
        }
      } else if (!this.isImage(file)) {
        this.toastr.error('Only images are allowed');
      }
    }
  }

  // clears the form
  clear() {
    this.files = [];
    this.onClear.emit();
  }

  // check if the image is actually an image by checking the mime type
  isImage(file: File): boolean {
    if (!file.type.match('image/*')) {
      this.toastr.error('Only images are allowed');
      return false;
    }
    return true;
  }

  // check if the form has files ready to be uploaded
  hasFiles(): boolean {
    if (typeof this.files !== 'number') {
      return this.files && this.files.length > 0;
    }
  }

  // remove the image from the preview
  remove(index: number) {
    this.files.splice(index, 1);
    this.fileInput.nativeElement.value = '';
  }

  // check the image file size
  validate(file: File): boolean {
    if (this.maxSize && file.size > this.maxSize) {
      this.toastr.error(this.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.maxSize)),
        this.invalidFileSizeMessage.replace('{0}', file.name));
      return false;
    }
    return true;
  }

// format the size to display it in toastr in case the user uploaded a file bigger than 5MB
  formatSize(bytes) {
    if (bytes === 0) {
      return '0 B';
    }
    let k = 1000,
      dm = 3,
      sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // submit the form to back end
  onSubmitEditedForm() {
    this.submitStarted = true;
    let formId = this.route.snapshot.params['id'];
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    // checking if the user tries to upload a new image, if he does then the new image will be uploaded
    if (typeof this.files === 'object') {
      for (let i = 0; i < this.files.length; i++) {
        formData.append('fileUp', this.files[i], this.files[i].name);
      }
    }
    xhr.upload.addEventListener('progress', (event: ProgressEvent) => {
      if (event.lengthComputable) {
        this.progress = Math.round((event.loaded * 100) / event.total);
      }
    }, false);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        this.progress = 0;
        if (xhr.status === 201) {
          this.router.navigateByUrl('/admin');
          this.toastr.success('Form edited successfully');
        } else if (xhr.status !== 201) {
          this.toastr.error('There was an error!');
        }
        this.clear();
      }
    };
    xhr.open('PATCH', this.url + formId, true);
    formData.append('textInput1', this.myForm.value.textInput1);
    formData.append('textInput2', this.myForm.value.textInput2);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Authorization', this.jwt);
    xhr.send(formData);
    console.log(xhr);
  }
}
