import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FruitsSearchComponent } from './fruits-search.component';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FruitsSearchComponent, FormsModule, ReactiveFormsModule],
  template: `<app-fruits-search [formControl]="searchControl"></app-fruits-search>`
})
class TestHostComponent {
  protected searchControl = new FormControl();

  ngOnInit() {
    this.searchControl.valueChanges
      .subscribe(value => this.onSearchValueChange(value));
  }

  public onSearchValueChange(value: Event | string | null) {}
}

describe('FruitsSearchComponent', () => {
  let testHost: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let searchInput: HTMLInputElement;
  let searchButton: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitsSearchComponent, TestHostComponent, NoopAnimationsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    fixture.detectChanges();
    searchInput = fixture.nativeElement.querySelector('input[type="search"]');
    searchButton = fixture.nativeElement.querySelector('button[type="submit"]');
  });

  it('should create', () => {
    expect(testHost).toBeTruthy();
  });

  it('should populate html input with component input value', waitForAsync(() => {
    testHost['searchControl'].setValue('banana');

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(searchInput.value).toBe('banana');
    });
  }));

  it('should emit change event when form submit', waitForAsync(() => {
    spyOn(testHost, 'onSearchValueChange');
    testHost['searchControl'].setValue('apple');

    fixture.detectChanges();
    searchButton.click();

    fixture.whenStable().then(() => {
      expect(testHost.onSearchValueChange).toHaveBeenCalledWith('apple');
    });
  }));

  it('should be disabled when control is disabled', waitForAsync(() => {
    testHost['searchControl'].disable();

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(searchInput.disabled).toBeTrue();
      expect(searchButton.disabled).toBeTrue();
    });
  }));
});

