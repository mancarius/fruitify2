import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FruitPreviewComponent } from './fruit-preview.component';
import { FruitPreviewStore } from './fruit-preview.store';
import { signal } from '@angular/core';

fdescribe(FruitPreviewComponent.name, () => {
  let component: FruitPreviewComponent;
  let fixture: ComponentFixture<FruitPreviewComponent>;
  const mockComponentStore = { vm: () => {}, setFruit: () => {} } as any;

  beforeEach(() => {
    TestBed.overrideComponent(FruitPreviewComponent, {
      add: {
        providers: [{ provide: FruitPreviewStore, useValue: mockComponentStore }],
      },
      remove: {
        providers: [FruitPreviewStore],
      },
    });

    fixture = TestBed.createComponent(FruitPreviewComponent);
    component = fixture.componentInstance;
    component['vm'] = signal({ fruitName: '', imgUrl: "image.jpg", imgAlt: "example", error: null, loaded: true });
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display the image if not loaded', () => {
    // Arrange
    component['vm'] = signal({ fruitName: '', imgUrl: '', imgAlt: "example", error: null, loaded: false });
    // Act
    fixture.detectChanges();
    // Assert
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeNull();
  });

  it('should set the fruit img url and alt', () => {
    // Arrange
    const fruitName = 'Apple';
    const imgUrl = 'apple.jpg';
    component['vm'] = signal({ fruitName, imgUrl, imgAlt: "example", error: null, loaded: true });
    // Act
    fixture.detectChanges();
    // Assert
    const img = fixture.nativeElement.querySelector('img');
    console.log(fixture.nativeElement);
    expect(img.src).toContain(imgUrl);
    expect(img.alt).toEqual('example');
  });

  it('should set the fruit name', () => {
    // Arrange
    const fruitName = 'Apple';
    component['vm'] = signal({ fruitName, imgUrl: "image.jpg", imgAlt: "example", error: null, loaded: true });
    // Act
    fixture.detectChanges();
    // Assert
    const name = fixture.nativeElement.querySelector('.fruit-preview__name');
    expect(name.textContent).toContain(fruitName);
  });

  it('should scale the image on hover', () => {
    // Arrange
    const img = fixture.nativeElement.querySelector('img');
    // Act
    img.dispatchEvent(new Event('mouseover'));
    fixture.detectChanges();
    // Assert
    expect(img.style.transform).toContain('scale(1.2)');
  });

  it('should reset the image scale on mouseout', () => {
    // Arrange
    const img = fixture.nativeElement.querySelector('img');
    img.style.transform = 'scale(1.2)';
    // Act
    img.dispatchEvent(new Event('mouseout'));
    fixture.detectChanges();
    // Assert
    expect(img.style.transform).toEqual('');
  });
});
