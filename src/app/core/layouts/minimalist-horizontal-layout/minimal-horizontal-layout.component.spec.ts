import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimalHorizontalLayoutComponent } from './minimal-horizontal-layout.component';

describe('MinimalistHorizontalLayoutComponent', () => {
  let component: MinimalHorizontalLayoutComponent;
  let fixture: ComponentFixture<MinimalHorizontalLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinimalHorizontalLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinimalHorizontalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
