import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModuleRef } from '@angular/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import './styles/main.scss';

if (environment.production) {
    enableProdMode();
}

export function main(): void {
    let modulePromise: Promise<NgModuleRef<AppModule>> = null;

    if (module['hot']) {
        module['hot'].accept();
        // module['hot'].accept('./app/header/header.component.ts',function(){
        //     debugger;
        // });
        // module['hot'].accept('./mainIndex.js',function(){
        //     debugger;
        // });
    }

    modulePromise = platformBrowserDynamic().bootstrapModule(AppModule);
    modulePromise.catch(err => console.log(err));
}

if (document.readyState !== 'complete') {
    //debugger
}
main();

// switch (document.readyState) {
//     case 'loading':
//         document.addEventListener('DOMContentLoaded', _domReadyHandler, false);
//         break;
//     case 'interactive':
//     case 'complete':
//     default:
//         main();
// }

// function _domReadyHandler() {
//     document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
//     main();
// }