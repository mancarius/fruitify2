import { Component, input } from "@angular/core";
import { Fruit } from "@shared/types";
import { FruitPreviewComponent } from "../fruit-preview/fruit-preview.component";
import { FruitPreviewPlaceholderComponent } from "@shared/components/fruit-preview-placeholder/fruit-preview-placeholder.component";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { EncodeToPathSegmentPipe } from "@pipes";

@Component({
    selector: "app-fruit-list",
    imports: [
        FruitPreviewComponent,
        FruitPreviewPlaceholderComponent,
        RouterLink,
        RouterLinkActive,
        EncodeToPathSegmentPipe,
    ],
    host: {
        class: "block",
    },
    template: `
    <ul
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      @for (fruit of fruits(); track fruit.id) {
        <li class="aspect-[3/2] flex flex-col">
          @let ariaLabel = "Navigate to " + fruit.name + " detail";
          <a
            class="grow flex"
            [routerLink]="['/fruit', fruit.name | encodeToPathSegment]"
            [queryParams]="{ fruitId: fruit.id }"
            routerLinkActive="active"
            [attr.aria-label]="ariaLabel"
          >
            @defer (on viewport) {
              <app-fruit-preview
                class="grow flex justify-center items-center"
                [fruit]="fruit"
                data-testid="fruit-preview"
              ></app-fruit-preview>
            } @loading (after 100ms; minimum 1s) {
              <app-fruit-preview-placeholder
                class="grow"
                data-testid="fruit-preview-loading-placeholder"
              ></app-fruit-preview-placeholder>
            } @placeholder (minimum 500ms) {
              <app-fruit-preview-placeholder
                class="grow"
                data-testid="fruit-preview-placeholder"
              ></app-fruit-preview-placeholder>
            }
          </a>
        </li>
      } @empty {
        <li class="col-span-full">
          <p
            class="text-center bg-white/80 text-black dark:bg-gray-900/80 dark:text-white w-fit px-2 m-0 mx-auto"
            data-testid="no-fruits-message"
          >
            No fruits found
          </p>
        </li>
      }
    </ul>
  `
})
export class FruitListComponent {
  fruits = input.required<Fruit[]>();
}
