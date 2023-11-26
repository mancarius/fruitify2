export type ApiAuthConfig = {
  addTo: "headers";
  key: string,
  authorizationType: string;
  value: string;
} | {
  addTo: "params";
  key: string;
  authorizationType: never;
  value: string;
}