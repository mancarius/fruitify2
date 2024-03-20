import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedFruitsComponent } from './related-fruits.component';

describe('RelatedFruitsComponent', () => {
  let component: RelatedFruitsComponent;
  let fixture: ComponentFixture<RelatedFruitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedFruitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RelatedFruitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
