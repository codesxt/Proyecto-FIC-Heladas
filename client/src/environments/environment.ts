// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production        : false,
  oldApiUrl         : "https://heladas.utalca.cl/heladas",
  apiUrl            : 'http://localhost:3100',
  hoboUpload        : 'http://localhost:3100/api/v1/hoboupload',
  miniStationUpload : 'http://localhost:3100/api/v1/ministationupload',
  agrometModelsUpload : 'http://localhost:3100/api/v1/agrometmodels'
};
