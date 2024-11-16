import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySearchProductComponent } from './display-search-product.component';

describe('DisplaySearchProductComponent', () => {
  let component: DisplaySearchProductComponent;
  let fixture: ComponentFixture<DisplaySearchProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaySearchProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaySearchProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
