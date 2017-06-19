ngx-Form with file upload to file system, image path stored to Mongo. Project is built using the MEA2N/MEAN2 stack. This project could be used as an angular2-seed.

Live Demo: [ngx-Form](http://ngxform.ntonas.pro) *Admin panel is disabled, please register using your own credentials*

[![NPM](https://nodei.co/npm/ngx-form.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ngx-form/)

## TODO
1. Fix some small bugs in backend file deletion
2. Fix form deletion from table (fix forms.splice)

# ngx-Form

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.1.2.

The goal of this project is to submit a form with one file upload and two text fields. The form is submitted to back end, the file is stored in the `uploads/forms/:userID` and then the file name (string) is stored in MongoDB among the two text fields. At the end, the form ID is assinged to the signed in user ID (via Ref) for later viewing all the form fields and file in the front end. User profile image is stored at `uploads/profiles/:userID`.

## Prerequisites
1. MongoDB installed and running (http://mongodb.org)
2. Node.js and NPM installed (http://nodejs.org)
3. [ImageMagick](http://www.imagemagick.org/script/index.php) or [GraphicsMagick](http://www.graphicsmagick.org/) installed,
more info in [gm](https://github.com/aheckmann/gm) page on how to install depending your Operating System. If installing ImageMagick on Windows, please check "Install Legacy Utitities (e.g. convert") during installation otherwise node will report errors.

## Specs
1. User login/signup using JSON Web Token (jwt) with Passport.
2. User password reset via email (nodemailer & SendGrid) using HTML templates (welcome email included upon user registration).
3. Toastr Notifications (& Error Handling).
4. Multipart form submission with image preview before upload (some of the upload logic is taken from primeng ui).
5. Storing images to file system.
6. Storing image path to MongoDB among text fields.
7. Triple check if image is actually a file by checking it's mime type in both back end and in front end (`gm` in back end checks if file is an image too by reading first bytes of the file, need to fix this to not allow form to be submitted at all).
8. Double check for the image size in both back end and front end, file limit now is 5.000.000 bytes (5MB).
9. Image resize server side using [GraphicsMagick](https://github.com/aheckmann/gm).
10. Form deletion among the file from filesystem, user forms array is updated too.
11. Edit form, user can edit the text inputs and the image or update only the image or update only the text fields.
12. Admin area, admin can edit or delete all forms in database.
13. User Profile area, user can upload a profile picture, change his password, view profile info like email, user id, role and joined date.
14. Cron job to delete images from `uploads/tmp` folder when image age is greater than 1 hour. Cron runs every 1 hour, in order to enable cron you have to run `node cron.js`.

## Packages Used
`Angular-cli v1.1.2` <br />
`Angular v4.2.3` <br />
`Webpack` <br />
`Node used in development v8.1.2` <br/>
`MongoDB used in development v3.4.1` <br/>
`Mongoose v4.10.7` <br />
`Express v4.15.3` <br />
`angular2-jwt v0.1.27` (for checking the expiration date of the jwt token, user role (admin or user)) and for using AuthHttp wrapper.<br />
`jsonwebtoken v7.4.1` <br />
`Multer v1.3.0` <br />
`ng2-toastr v4.1.0` <br />
`gm v1.23.0` <br />
`Passport v0.3.2` <br />
`Passport-jwt v2.2.1` <br />
`Bcrypt v1.0.2` <br />
`Node-schedule v1.2.3` <br />
`Find-remove v1.0.1` <br />
`BootStrap 3`  (css is included in `assets` folder) <br/>
`Font Awesome` (css is included in `assets` folder) <br/>
`Glyphicons`   (found in `fonts` folder under `assets`) <br/>

## Installing Dependecies
1. Clone this repo from Git
2. Run `npm install` in your command line.
3. Edit `config.js` in `/server/config` folder.
4. Run `node seed.js` to insert the admin user into database and create uploads folder. Admin email is `test@test.com` and password is `testpass`.  Make sure mongod is running.
5. After login navigate to `localhost:3000/#/admin` to access admin panel.

## Building the Angular app
Run `ng build`

A new `dist` folder will be created with all files needed to run the Angular 2 app in front end.

If you want to make changes on the Angular app and auto-refresh the `dist` folder then run the following command in your terminal:
 `ng build --watch`

## Running the server
Run `npm start` <br />
If you want to make changes on the Server and auto refresh the back end code then run: `nodemon npm start`. If you don't have nodemon installed, run `npm install nodemon -g`. <br />
If you want to execute the cron job in order to clean up `/uploads/tmp` folder every 1 hour for files that their age is greater than 1 hour, run `node cron.js`.

## Viewing the App
Open your favourite web browser and point to `http://localhost:3000`

Enjoy!

## Help with angular-cli
To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
