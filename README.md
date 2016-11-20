[![Build Status](https://travis-ci.org/predatorkill/ng2-forms-demo.svg?branch=master)](https://travis-ci.org/predatorkill/ng2-forms-demo)<br/>
CAUTION: This is a work in progress, do not use in dev enviroment.

Project is built using the MEA2N/MEAN2 stack

Design is minimal, later on i will make it much better and more beatiful.

IDE used: WebStorm 2016.3 RC

## TODO
1. ~~Create upload logic in Angular2~~ Done, the form is submitted by leveraging XHR, all images are saved at `uploadsForlder/user._id` path so every user has it's own folder seperated by id.
2. ~~Reset user password via email using a token~~ Done, the app uses SendGrid, the free plan is good for starting up.
3. ~~Redirect user to the `MyForms` page after submitting the form (see #6 below)~~ Done, the user now is redirected to a new page with a table of his forms
4. ~~Add an upload progress bar.~~ Done, in local enviroments the speed is so high that you almost can't see the progress loading.
5. ~~Resize the image before storing to file system.~~ Done, see Prerequisites below in order to install `gm`, needs a little bit more tweaking
6. ~~Add a new menu link for a new page, `MyForms` in order to display user's submitted forms.~~ Done, link added on menu
7. Better styling.
8. ~Right now, front end is capable of uploading only 1 file, I will later fix back end in order to support multiple files~ Only one file for now
9. Form deletion among the assosiated images from file system



# Angular 2 Form

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.18.

The goal of this project is to submit a form with one file upload and two text fields. The form is submitted to back end, the file is stored in the `uploadsFolder` and then the file path/url is stored in MongoDB among the two text fields. At the end, the form ID is assinged to the signed in user ID (via Ref) for later viewing all the form fields and file in the front end.

##Prerequisites
1. MongoDB installed and running (http://mongodb.org)
2. Node.js and NPM installed (http://nodejs.org)
3. [ImageMagick](http://www.imagemagick.org/script/index.php) or [GraphicsMagick](http://www.graphicsmagick.org/) installed,
more info in [gm](https://github.com/aheckmann/gm) page on how to install depending your Operating System.


## Specs
1. User login/signup using JSON Web Token (jwt)
2. User password reset via email (nodemailer & SendGrid)
3. Toastr Notifications (& Error Handling)
4. Multipart form submission with image preview before upload (some of the upload logic is taken from primeng ui).
5. Storing images to file system
6. Storing image path to MongoDB among text fields
7. Double check if image is actually a file by checking it's mime type in both back end and in front end
8. Double check for the image size in both back end and front end, file limit now is 5.000.000 bytes (5MB)
9. Image resize server side using [GraphicsMagick](https://github.com/aheckmann/gm)

## Packages Used
`Angular-cli v1.0.0-beta.18` <br />
`Angular v2.1.2` <br />
`Webpack` <br />
`Node v6.9.1` <br/>
`MongoDB v3.2.10` <br/>
`Mongoose v4.6.8` <br />
`Express v4.14.0` <br />
`Multer v1.2.0` <br />
`ng2-toastr v1.3.0` <br />
`ng2-progress-bar 0.0.5` <br />
`gm v1.23.0` <br />
`BootStrap 3`  (css is included in `assets` folder) <br/>
`Font Awesome` (css is included in `assets` folder) <br/>
`Glyphicons`   (found in `fonts` folder under `assets`) <br/>


## Installing Dependecies
1. Clone this repo from Git
2. Run `npm install` in your command line 

## Building the Angular2 app
Run `ng build`

A new `dist` folder will be created with all files needed to run the Angular 2 app in front end.

If you want to make changes on the Angular2 app and auto-refresh the `dist` folder then run the following command in your terminal:
 `ng build --watch`

## Running the server
Run `npm start`
If you want to make changes on the Server and auto refresh the back end code then run: `nodemon npm start`. If you don't have nodemon installed, run `npm install nodemon -g`.

## Viewing the App
Open your favourite web browser and point to `http://localhost:3000`

Enjoy!

## Help with angular-cli
To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Preview of the app
##Empty Form
![Form before entering text](https://cloud.githubusercontent.com/assets/717975/20238425/053567f6-a8f4-11e6-99cb-15403426fcf5.png)
###Form with preview image (image is responsive)
![Form after entering text and selecting an image](https://cloud.githubusercontent.com/assets/717975/20238426/0538a132-a8f4-11e6-87f1-61c871acfea6.png)
###Server Response in console logs
![Server response after submitting form](https://cloud.githubusercontent.com/assets/717975/20238428/053e95ec-a8f4-11e6-93ab-04258e359e13.png)
###Users document in MongoDB with forms array ref
![Users document in MongoDB](https://cloud.githubusercontent.com/assets/717975/20238429/05423e68-a8f4-11e6-9a2c-c2791ef0a4e9.png)
###Forms Document in MongoDB with ref to the user._id (owner field)
![Forms submitted by the user with unique file name, and user._id Ref `owner`](https://cloud.githubusercontent.com/assets/717975/20238427/053d1df2-a8f4-11e6-9b2a-616eafa3f517.png)
###User submitted forms page
![User submitted forms page](https://cloud.githubusercontent.com/assets/717975/20337121/ac494ac2-abd7-11e6-842d-af9983b80c1b.png)
