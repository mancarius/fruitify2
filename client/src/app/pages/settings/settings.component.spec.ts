import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { Component, provideExperimentalZonelessChangeDetection, Provider, signal } from '@angular/core';
import { MEDIA_SERVICE_CONFIG_TOKEN } from '@tokens';
import { provideRouter, Router } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatNavListItemHarness } from '@angular/material/list/testing';

@Component({
    selector: 'mock-component',
    template: '',
    standalone: false
})
class MockComponent { }

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let loader: HarnessLoader;

  let createComponent = async (providers: Provider[] = []) => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([
          { path: '**', component: SettingsComponent },
          { path: 'settings/media-provider', component: MockComponent }
        ]),
        ...providers,
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  };

  describe('with provider config', () => {

    beforeEach(async () => {
      await createComponent([
        { provide: MEDIA_SERVICE_CONFIG_TOKEN, useValue: signal({ provider: 'test' }) }
      ]);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render provider item', async () => {
      const listItem = await loader.getHarness(MatNavListItemHarness.with({ title: 'Provider' }));
      const providerValue = await listItem.getSecondaryText();
      expect(providerValue)
        .withContext('Expected to render provider value')
        .toBe('test');
    });

    it('should activate media-provider route on provider click', async () => {
      const listItem = await loader.getHarness(MatNavListItemHarness.with({ title: 'Provider' }));
      await listItem.click();
      expect(TestBed.inject(Router).url)
        .withContext('Expected to navigate to media-provider route')
        .toEqual('/settings/media-provider');
    });

    it('should update provider value when config changes', async () => {
      const newProvider = 'newProvider' as any;
      const configSignal = TestBed.inject(MEDIA_SERVICE_CONFIG_TOKEN);
      configSignal.set({ provider: newProvider } as any);
      fixture.detectChanges();
      const listItem = await loader.getHarness(MatNavListItemHarness.with({ title: 'Provider' }));
      const providerValue = await listItem.getSecondaryText();
      expect(providerValue)
        .withContext('Expected to render updated provider value')
        .toBe(newProvider);
    });

  });

  describe('without provider config', () => {

    beforeEach(async () => {
      await createComponent([
        { provide: MEDIA_SERVICE_CONFIG_TOKEN, useValue: signal(null) }
      ]);
    });

    it('should display default provider value when config is missing', async () => {
      fixture.detectChanges();
      const listItem = await loader.getHarness(MatNavListItemHarness.with({ title: 'Provider' }));
      const providerValue = await listItem.getSecondaryText();
      expect(providerValue)
        .withContext('Expected to render default provider value')
        .toBe('Unknown');
    });

  });
});
