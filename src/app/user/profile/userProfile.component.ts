import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {ProfileService} from './profile.service';
import {UserProfile} from './userProfile.model';
import {Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {BASE_URL, USER_API_URL} from '../../config/config';

@Component({
  selector   : 'app-userprofile',
  templateUrl: './userProfile.component.html',
  styleUrls  : ['./userProfile.component.css']
})
export class UserProfileComponent implements OnInit {
  private userId: string                       = localStorage.getItem('userId');
  private token: string                        = localStorage.getItem('id_token');
          url: string                          = `${USER_API_URL}/image`;
          imageUrl: string                     = `${BASE_URL}/uploads/tmp/`;
          user: UserProfile;
          fetchedUser: any[]                   = [];
          maxSize: number                      = 5000000;
          invalidFileSizeMessage: string       = '{0}: Invalid file size, ';
          invalidFileSizeMessageDetail: string = 'Maximum upload size is {0}.';
          onClear: EventEmitter<any>           = new EventEmitter();
  public files: File[];
  public progress: number                      = 0;
  public submitStarted: boolean;
          imagePath: string;
          imageReady                           = false;
          oldImage                             = true;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('profileImage') profileImage: ElementRef;

  constructor(private profileService: ProfileService,
              private router: Router,
              private toastr: ToastsManager) {
  }

  ngOnInit() {
    this.files = [];
    this.profileService.getUserDetails(this.userId)
      .subscribe(
        (data => {
          const userArray = [];
          for (let key in data) {
            userArray.push(data[key]);
          }
          this.fetchedUser = userArray;
        })
      );
  }

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
                this.oldImage      = false;
                this.submitStarted = false;
              } else if (xhr.status !== 201) {
                this.toastr.error('There was an error, please try again later');
                this.submitStarted = false;
                this.oldImage      = true;
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
          console.log(formData);
        }
      } else if (!this.isImage(file)) {
        this.toastr.error('Only images allowed');
        this.clear();
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
}

