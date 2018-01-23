import './styles/main.styl';

import './rxjs-imports';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './modules/app/app.module';
import { decorateModuleRef } from './modules/app/app.environment';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(decorateModuleRef)
  .catch((err) => console.error(err)); // tslint:disable-line:no-console

