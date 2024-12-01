import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { FruitsSearchComponent } from './fruits-search.component';
import { Component, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatInputHarness } from '@angular/material/input/testing';

@Component({
    imports: [FruitsSearchComponent, FormsModule, ReactiveFormsModule],
    template: `<app-fruits-search [formControl]="searchControl"></app-fruits-search>`
})
class TestHostComponent {
  protected searchControl = new FormControl();

  ngOnInit() {
    this.searchControl.valueChanges
      .subscribe(value => this.onSearchValueChange(value));
  }

  public onSearchValueChange(value: any) { }
}

describe('FruitsSearchComponent', () => {
  let testHost: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let searchInput: HTMLInputElement;
  let searchButton: HTMLButtonElement;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FruitsSearchComponent, TestHostComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideNoopAnimations()
      ],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    fixture.detectChanges();
    searchInput = fixture.nativeElement.querySelector('input[type="search"]');
    searchButton = fixture.nativeElement.querySelector('button[type="submit"]');
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(testHost).toBeTruthy();
  });


  it('should set default context correctly', () => {
    expect(testHost['searchControl'].value).toEqual(null);
  });

  it('should change context when a new option is selected', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();

    await options[1].click();
    searchButton.click();

    // Select the second option, e.g., "order"
    await fixture.whenStable();

    const input = await loader.getHarness(MatInputHarness);
    const inputPlaceholder = await input.getPlaceholder();

    expect(inputPlaceholder).toBe('Search fruits by order');
  });

  it('should change input value when form control value changes', async () => {
    testHost['searchControl'].setValue({ name: 'banana' });

    await fixture.whenStable();

    expect(searchInput.value).toBe('banana');
  });

  it('should emit correct value on form submit', async () => {
    spyOn(testHost, 'onSearchValueChange');
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();
    await options[0].click();

    await fixture.whenStable();

    const input = await loader.getHarness(MatInputHarness);
    await input.setValue('apple');

    searchButton.click();

    await fixture.whenStable();

    expect(testHost.onSearchValueChange).toHaveBeenCalledWith({ name: 'apple' });
  });

  it('should disable form controls when control is disabled', async () => {
    testHost['searchControl'].disable();

    await fixture.whenStable();

    expect(searchInput.disabled).toBeTrue();
    expect(searchButton.disabled).toBeTrue();
  });

});
