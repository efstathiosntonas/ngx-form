import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Renderer, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {BASE_URL, FORMS_API_URL} from '../config/config';
import {ModalComponent} from 'ng2-bs3-modal/components/modal';
import {FormService} from './form.service';
import {Form} from './form.model';

@Component({
  selector   : 'app-form',
  templateUrl: './form.component.html',
  styleUrls  : ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {

  // setting up the form
  myForm: FormGroup;
  textInputOne: FormControl;
  textInputTwo: FormControl;

  // get the Auth Token from localStorage in order to Authenticate to back end while submitting the form
  token: string                        = localStorage.getItem('id_token');
  url: string                          = `${FORMS_API_URL}/image`;
  imageUrl: string                     = `${BASE_URL}/uploads/tmp/`;
  maxSize: number                      = 5000000;
  invalidFileSizeMessage: string       = '{0}: Invalid file size, ';
  invalidFileSizeMessageDetail: string = 'Maximum upload size is {0}.';
  public files: File[];
  public progress: number              = 0;
  public submitStarted: boolean;
  public imageReady                    = false;
  public imagePath: string;
  name: string;
  onClear: EventEmitter<any>           = new EventEmitter();

  @ViewChild('textOne') textOne: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('imageDeleteModal') imageDeleteModal: ModalComponent;

  deleteImage() {
    this.imageDeleteModal.dismiss();
    this.formService.deleteImage(this.imagePath)
      .subscribe(data => {
      });
    this.imageReady = false;
    this.clear();
  }

  dismissImageDelete() {
    this.imageDeleteModal.close();
  }

  constructor(private fb: FormBuilder,
              private toastr: ToastsManager,
              private router: Router,
              private renderer: Renderer,
              private authService: AuthService,
              private formService: FormService) {
  }

  // event fired when the user selects an image
  onFileSelect(event) {
    this.clear();
    this.submitStarted = true;
    let files          = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (this.validate(file)) {
        if (this.isImage(file)) {
          this.files.push(files[i]);
          let xhr      = new XMLHttpRequest();
          let formData = new FormData();

          for (let i = 0; i < this.files.length; i++) {
            formData.append('fileUp', this.files[i], this.files[i].name);
          }
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              this.progress = 0;
              if (xhr.status === 201) {
                this.imagePath     = xhr.response.replace(/^"|"$/g, '');
                this.imageReady    = true;
                this.submitStarted = false;
              } else if (xhr.status !== 201) {
                this.toastr.error('There was a problem, please try again later');
                this.submitStarted = false;
                this.clear();
              }
              this.clear();
            }
          };
          xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
            if (e.lengthComputable) {
              this.progress = Math.round((e.loaded * 100) / e.total);
            }
          }, false);

          xhr.open('POST', this.url, true);
          xhr.setRequestHeader('Authorization', 'JWT ' + this.token);
          xhr.send(formData);

        }
      } else if (!this.isImage(file)) {
        this.toastr.error('Only images are allowed');
      }
    }
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
    return this.files && this.files.length > 0;
  }

  // clears the form
  clear() {
    this.files = [];
    this.onClear.emit();
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
      this.submitStarted = false;
      this.clear();
      return false;
    }
    return true;
  }

// format the size to display it in toastr in case the user uploaded a file bigger than 5MB
  formatSize(bytes) {
    if (bytes === 0) {
      return '0 B';
    }
    let k     = 1000,
        dm    = 3,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i     = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  ngOnInit() {
    this.files        = [];
    this.textInputOne = new FormControl('', Validators.required);
    this.textInputTwo = new FormControl('', Validators.required);

    this.myForm = this.fb.group({
      textInputOne: this.textInputOne,
      textInputTwo: this.textInputTwo
    });
  }

  // focus on first input box after the view is initialized
  ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.textOne.nativeElement, 'focus', []);
    }, 50);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  // submit the form to back end

  submitForm() {
    this.submitStarted = true;
    const newForm      = new Form(
      this.myForm.value.textInputOne,
      this.myForm.value.textInputTwo,
      this.imagePath
    );
    if (this.imageReady) {
      this.formService.submitNewForm(newForm)
        .subscribe(
          data => {
            this.router.navigateByUrl('/user/forms');
            this.toastr.success('Form submitted successfully');
          },
          error => {
            this.submitStarted = false;
            this.toastr.error('There was an error, please try again later');
          });
    } else {
      this.submitStarted = false;
      this.toastr.info('Please select an image', 'Attention', {toastLife: 5000});
    }
  }
}
