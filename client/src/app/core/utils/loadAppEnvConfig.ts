import { environment } from "@env/environment";
import { EnvironmentConfigService } from "@shared/services/configurations/configurations.service";
import { Observable, tap } from "rxjs";

/**
 * Loads the application environment configuration from the server.
 *
 * @param {ConfigurationService} configService - The service used to fetch configuration settings.
 * @returns {() => Observable<void>} A function that returns an observable which updates the environment settings.
 */
export function loadAppEnvConfig(configService: EnvironmentConfigService): () => Observable<any> {
  const env = environment.production ? "prod" : "dev";

  return () => configService.getConfigs(env).pipe(
    tap((configs) => {
      for (let [key, value] of Object.entries(configs)) {
        if (environment.hasOwnProperty(key)) {
          Reflect.set(environment, key, value);
        }
      }
    })
  );
}
