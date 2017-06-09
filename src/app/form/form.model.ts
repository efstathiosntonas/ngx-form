export class Form {

  constructor(public textInputOne: string, public textInputTwo: string,
              public fileUp?: string, public userId?: string, public formId?: string) {

    this.textInputOne = textInputOne;
    this.textInputTwo = textInputTwo;
    this.fileUp       = fileUp;
    this.userId       = userId;
    this.formId       = formId;
  }
}
