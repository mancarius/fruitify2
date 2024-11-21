import { assertInInjectionContext, inject } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

/**
 * Registers custom SVG icons to be used within the application.
 *
 * This function ensures that the custom SVG icons are available for use
 * by injecting the necessary services and adding the SVG icon to the
 * MatIconRegistry.
 *
 * @throws Will throw an error if called outside of an injection context.
 */
export function registerCustomSvgIcons(): void {
  assertInInjectionContext(registerCustomSvgIcons);

  const safeResourceUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    'assets/icons/github.svg'
  );

  inject(MatIconRegistry).addSvgIcon('github', safeResourceUrl);
}
