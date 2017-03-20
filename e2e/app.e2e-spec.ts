import { Ng2FormsDemoPage } from './app.po';

describe('ng2-forms-demo App', function() {
  let page: Ng2FormsDemoPage;

  beforeEach(() => {
    page = new Ng2FormsDemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
