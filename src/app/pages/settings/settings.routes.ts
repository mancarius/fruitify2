import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

export default [
  // Settings
  {
    path: '',
    title: 'Settings',
    pathMatch: 'full',
    component: SettingsComponent
  },

  // Media
  {
    path: 'media-provider',
    title: 'Media Provider',
    pathMatch: 'full',
    loadComponent: async () => {
      const c = await import('./pages/media-provider/media-provider.component');
      return c.MediaProviderComponent;
    }
  },
] satisfies Routes;