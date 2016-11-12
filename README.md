CAUTION: This is a work in progress, do not use in dev enviroment.

The design is minimal, later on i will make it much better and more beatiful.

IDE used: WebStorm 2016.3 RC

## TODO
1. ~~Create upload logic in Angular2~~ Done, the form is submitted by leveraging XHR, all images are saved at `uploadsForlder/user._id` path so every user has it's own folder seperated by id.
2. ~~Reset user password via email using a token~~ Done, the app uses SendGrid, the free plan is good for starting up.
3. Add an upload progress bar
4. Resize the image before storing to file system
5. Add a new menu link for a new page, 'My Forms' in order to display user's submitted forms
6. Better styling



# Angular 2 Form

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.18.

The aim of this project is to submit a form with one file upload and two text fields. The form is submitted to back end, the file is stored in the `uploadsFolder` and then the file path/url is stored in MongoDB among the two text fields. At the end, the form ID is assinged to the signed in user ID (via Ref) for later viewing all the form fields and file in the front end.

## Specs
1. User login/signup using Json Web Token(jwt)
2. User password reset via email (nodemailer & SendGrid)
3. Toastr Notifications (& Error Handling)
4. Multipart form submission
5. Storing images to file system
6. Storing image path to MongoDB among text fields

## Packages Used
`Angular v2.1.2` <br/>
`Webpack` <br/>
`Node v6.9.1` <br/>
`MongoDB v3.2.10` <br/>
`Multer` <br/>
`ng2-toastr v1.3.0` <br/>
`BootStrap 3`  (css is included in `assets` folder) <br/>
`Font Awesome` (css is included in `assets` folder) <br/>
`Glyphicons`   (found in `fonts` folder under `assets`) <br/>


## Installing Dependecies
Run `npm install` in your command line.

## Building the Angular2 app
Run `ng build`

A new `dist` folder will be created with all files needed to run the Angular 2 app in front end.

If you want to make changes on the Angular2 app and auto-refresh the `dist` folder then run the following command in your terminal:
 `ng build --watch`

## Running the server
Run `npm start`
If you want to make changes on the Server and auto refresh the back end code then run: `nodemon npm start`

## Viewing the App
Open your favourite web browser and point to `http://localhost:3000`

Enjoy!

## Help with angular-cli
To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
