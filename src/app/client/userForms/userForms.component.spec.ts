/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {userFormComponent} from './userForms.component';

describe('userFormComponent', () => {
  let component: userFormComponent;
  let fixture: ComponentFixture<userFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [userFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(userFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
