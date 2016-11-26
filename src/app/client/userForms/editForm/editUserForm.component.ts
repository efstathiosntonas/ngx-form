import {Component, OnInit, EventEmitter, Renderer, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormService} from "../../form/form.service";
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";
import {ToastsManager} from "ng2-toastr";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-edit-user-form',
  templateUrl: 'editUserForm.component.html',
  styleUrls: ['editUserForm.component.css']
})
export class EditUserFormComponent implements OnInit, AfterViewInit {

  onClear: EventEmitter<any> = new EventEmitter();

  fetchedForm: any[] = [];
  myForm: FormGroup;
  textInput1: FormControl;
  textInput2: FormControl;

  authToken: string = localStorage.getItem('token');
  url: string = 'http://localhost:3000/uploads/edit/';
  maxSize: number = 5000000;
  invalidFileSizeMessage: string = '{0}: Invalid file size, ';
  invalidFileSizeMessageDetail: string = 'Maximum upload size is {0}.';
  public files: File[];
  public progress: number = 0;
  private submitStarted: boolean;
  @ViewChild('textOne') textOne: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private formService: FormService, private toastr: ToastsManager, private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer, private renderer: Renderer) {
  }

  ngOnInit() {

    let formId = this.route.snapshot.params['id'];
    this.formService.getSingleForm(formId)
      .subscribe(
        data => {
          const formArray = [];
          for (let key in data) {
            formArray.push(data[key])
          }
          this.fetchedForm = formArray;
        }
      );

    this.textInput1 = new FormControl('', Validators.required);
    this.textInput2 = new FormControl('', Validators.required);

    this.myForm = this._fb.group({
      textInput1: this.textInput1,
      textInput2: this.textInput2
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.textOne.nativeElement, 'focus', []);
    }, 50);
  }

  cancel() {
    this.router.navigate(['user/forms']);
  }

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

  clear() {
    this.files = [];
    this.onClear.emit();
  }

  isImage(file: File): boolean {
    if (!file.type.match('image/*')) {
      this.toastr.error('Only images are allowed');
      return false;
    }
    return true;
  }

  hasFiles(): boolean {
    if(typeof this.files != 'number') {
      return this.files && this.files.length > 0;
    }
  }

  remove(index: number) {
    this.files.splice(index, 1);
    this.fileInput.nativeElement.value = '';
  }

  validate(file: File): boolean {
    if (this.maxSize && file.size > this.maxSize) {
      this.toastr.error(this.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.maxSize)),
        this.invalidFileSizeMessage.replace('{0}', file.name));
      return false;
    }
    return true;
  }

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

  onSubmitEditedForm() {
    this.submitStarted = true;
    let formId = this.route.snapshot.params['id'];
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    if(typeof this.files === 'object') {
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
          this.router.navigateByUrl('/user/forms');
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
    xhr.setRequestHeader('Authorization', this.authToken);
    xhr.send(formData);
    console.log(xhr);
  }
}
