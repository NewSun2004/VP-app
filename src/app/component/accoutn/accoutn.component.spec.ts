import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoutnComponent } from './accoutn.component';

describe('AccoutnComponent', () => {
  let component: AccoutnComponent;
  let fixture: ComponentFixture<AccoutnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccoutnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccoutnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
