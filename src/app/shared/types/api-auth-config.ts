export type ApiAuthConfig = {
  match: string;
  addTo: "headers";
  key: string,
  authorizationType: string;
  value: string;
} | {
  match: string;
  addTo: "params";
  key: string;
  authorizationType: never;
  value: string;
}