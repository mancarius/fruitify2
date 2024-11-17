import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaProviderComponent } from './media-provider.component';
import { mediaProviderStore } from './media-provider.store';
import { By } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection, Provider, signal } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MEDIA_SERVICE_CONFIG_TOKEN } from '@tokens';
import { MEDIA_SERVICE_PROVIDERS } from '@shared/constants';
import { MatListOptionHarness } from '@angular/material/list/testing';


describe('MediaProviderComponent', () => {
  let component: MediaProviderComponent;
  let fixture: ComponentFixture<MediaProviderComponent>;
  let loader: HarnessLoader;
  const setup = async (providers: Provider[]) => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        mediaProviderStore,
        ...providers
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MediaProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('when there are no media providers', () => {
    beforeEach(async () => setup([
      {
        provide: MEDIA_SERVICE_CONFIG_TOKEN,
        useValue: signal({
          provider: 'provider',
        })
      },
      {
        provide: MEDIA_SERVICE_PROVIDERS,
        useValue: {}
      }
    ]));

    it('should display a message when there are no providers', () => {
      const message = fixture.debugElement.query(By.css('[data-testid="no-providers"]'))?.nativeElement;
      expect(message)
        .withContext('A message should be displayed when there are no providers')
        .toBeTruthy();
    });

  });

  describe('when there are providers', () => {
    beforeEach(async () => {
      await setup([
        {
          provide: MEDIA_SERVICE_CONFIG_TOKEN,
          useValue: signal({
            provider: 'provider1',
          })
        },
        {
          provide: MEDIA_SERVICE_PROVIDERS,
          useValue: {
            pexels: {
              name: 'pexels',
              link: 'https://www.provider1.com',
              description: 'Provider 1 description'
            },
            unsplash: {
              name: 'unsplash',
              link: 'https://www.provider2.com',
              description: 'Provider 2 description'
            }
          }
        }]);

      loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should display a list of providers', async () => {
      const providedProvidersMap = TestBed.inject(MEDIA_SERVICE_PROVIDERS);
      const expectedProvidersLength = Object.keys(providedProvidersMap).length;
      const listItems = await loader.getAllHarnesses(MatListOptionHarness);
      expect(listItems.length)
        .withContext('There should be a list of providers')
        .toBe(expectedProvidersLength);
    });

    it('should update the selected provider in the store when a provider is selected', async () => {
      const oldProvider = TestBed.inject(MEDIA_SERVICE_CONFIG_TOKEN)();
      const listItem = await loader.getHarness(MatListOptionHarness.with({ selected: false }));
      await listItem.select();
      const newProvider = TestBed.inject(MEDIA_SERVICE_CONFIG_TOKEN)();
      expect(newProvider)
        .withContext('The provider should be updated in the store')
        .not.toEqual(oldProvider);
    });

    it('should select the correct provider option based on token value', async () => {
      component.setProvider({
        source: {
          selectedOptions: {
            selected: [{
              value: 'unsplash'
            }]
          }
        }
      } as any);

      fixture.detectChanges();
      await fixture.whenStable();

      const selectedListItem = await loader.getHarness(MatListOptionHarness.with({ selected: true }));
      const selectedTitle = await selectedListItem.getTitle();

      expect(selectedTitle)
        .withContext('The correct provider should be selected')
        .toContain('unsplash');
    });
  });
});
