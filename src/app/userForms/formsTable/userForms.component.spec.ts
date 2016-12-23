/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {UserFormsComponent} from './userForms.component';

describe('userFormComponent', () => {
  let component: UserFormsComponent;
  let fixture: ComponentFixture<UserFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserFormsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
