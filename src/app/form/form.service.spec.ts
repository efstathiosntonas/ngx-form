/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormService} from './form.service';

describe('Service: FormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormService]
    });
  });

  it('should ...', inject([FormService], (service: FormService) => {
    expect(service).toBeTruthy();
  }));
});
