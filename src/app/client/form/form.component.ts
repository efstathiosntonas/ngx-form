import {Component, OnInit, EventEmitter, ViewChild, ElementRef, AfterViewInit, Renderer} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-form',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {

  // setting up the form
  myForm: FormGroup;
  textInput1: FormControl;
  textInput2: FormControl;

  // get the Auth Token from localStorage in order to Authenticate to back end while submitting the form
  authToken: string = localStorage.getItem('token');
  url: string = 'http://localhost:3000/uploads';
  maxSize: number = 5000000;
  invalidFileSizeMessage: string = '{0}: Invalid file size, ';
  invalidFileSizeMessageDetail: string = 'Maximum upload size is {0}.';
  public files: File[];
  public progress: number = 0;
  private submitStarted: boolean;
  @ViewChild('textOne') textOne: ElementRef;

  name: string;
  onClear: EventEmitter<any> = new EventEmitter();

  constructor(private _fb: FormBuilder, private toastr: ToastsManager, private router: Router, private sanitizer: DomSanitizer, private renderer: Renderer) {}

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

  isImage(file: File): boolean {
    if (!file.type.match('image/*')) {
      this.toastr.error('Only images are allowed');
      return false;
    }
    return true;
  }

  hasFiles(): boolean {
    return this.files && this.files.length > 0;
  }

  onImageLoad(img: any) {
    window.URL.revokeObjectURL(img.src);
    console.log(window.URL.revokeObjectURL(img.src))
  }

  clear() {
    this.files = [];
    this.onClear.emit();
  }

  remove(index: number) {
    this.files.splice(index, 1);
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

   // TODO  sample code to resize image before uploading to reduce bandwidth from server
  // resizeImage(file) {
  //  let  reader = new FileReader();
  //   reader.onloadend = function() {
  //     let tempImg = new Image();
  //     tempImg.src = reader.result;
  //     console.log(tempImg.src)
  //     tempImg.onload = function() {
  //
  //       let MAX_WIDTH = 400;
  //       let MAX_HEIGHT = 300;
  //       let tempW = tempImg.width;
  //       let tempH = tempImg.height;
  //       if (tempW > tempH) {
  //         if (tempW > MAX_WIDTH) {
  //           tempH *= MAX_WIDTH / tempW;
  //           tempW = MAX_WIDTH;
  //         }
  //       } else {
  //         if (tempH > MAX_HEIGHT) {
  //           tempW *= MAX_HEIGHT / tempH;
  //           tempH = MAX_HEIGHT;
  //         }
  //       }
  //
  //       let canvas = document.createElement('canvas');
  //       canvas.width = tempW;
  //       canvas.height = tempH;
  //       let ctx = canvas.getContext('2d');
  //       ctx.drawImage(this, 0, 0, tempW, tempH);
  //       let dataURL = canvas.toDataURL('image/jpeg');
  //     }
  //
  //   };
  //   reader.readAsArrayBuffer(file);
  // }

  ngOnInit() {
    this.files = [];
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

  onSubmit() {
    this.submitStarted = true;
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      formData.append('fileUp', this.files[i], this.files[i].name);
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
          this.toastr.success('Form submitted successfully');
        } else if(xhr.status !== 201) {
          this.toastr.error('There was an error!');
        }
        this.clear();
      }
    };
    xhr.open('POST', this.url, true);
    formData.append('textInput1', this.myForm.value.textInput1);
    formData.append('textInput2', this.myForm.value.textInput2);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Authorization', this.authToken);
    xhr.send(formData);
    console.log(xhr);
  }
}
