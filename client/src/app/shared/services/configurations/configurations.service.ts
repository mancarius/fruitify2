import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_BASE_PATHNAME } from "@tokens";

export type EnvironmentConfigs = {
  pexelsApiKey: string;
  unsplashApiKey: string;
};

@Injectable({
  providedIn: "root"
})
export class EnvironmentConfigService {
  readonly #baseUrl = inject(API_BASE_PATHNAME);

  readonly #http = inject(HttpClient);

  /**
   * Fetches the configuration settings from the server.
   *
   * @returns An Observable containing the configuration settings.
   */
  public getConfigs(env: 'prod' | 'dev' = 'dev') {
    const url = `${this.#baseUrl}/configs`;
    return this.#http.get<EnvironmentConfigs>(url, { params: { env } });
  }
}
