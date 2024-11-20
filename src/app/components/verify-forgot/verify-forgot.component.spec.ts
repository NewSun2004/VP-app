import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyForgotComponent } from './verify-forgot.component';

describe('VerifyForgotComponent', () => {
  let component: VerifyForgotComponent;
  let fixture: ComponentFixture<VerifyForgotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyForgotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
