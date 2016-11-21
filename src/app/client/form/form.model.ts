export class Form {

  constructor(public textInput1: string, public textInput2: string, public fileUp?: string, public userId?: string, public formId?: string) {

    this.textInput1 = textInput1;
    this.textInput2 = textInput2;
    this.fileUp = fileUp;
    this.userId = userId;
    this.formId = formId;
  }
}
