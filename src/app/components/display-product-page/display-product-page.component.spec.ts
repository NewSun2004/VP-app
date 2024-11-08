import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayProductPageComponent } from './display-product-page.component';

describe('DisplayProductPageComponent', () => {
  let component: DisplayProductPageComponent;
  let fixture: ComponentFixture<DisplayProductPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayProductPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
