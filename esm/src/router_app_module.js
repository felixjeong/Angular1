/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppModule, AppModuleFactoryLoader, ApplicationRef, ComponentResolver, Injector, SystemJsAppModuleLoader } from '@angular/core';
import { ROUTER_CONFIGURATION, setupRouter } from './common_router_providers';
import { RouterLink, RouterLinkWithHref } from './directives/router_link';
import { RouterLinkActive } from './directives/router_link_active';
import { RouterOutlet } from './directives/router_outlet';
import { Router } from './router';
import { ROUTES } from './router_config_loader';
import { RouterOutletMap } from './router_outlet_map';
import { ActivatedRoute } from './router_state';
import { DefaultUrlSerializer, UrlSerializer } from './url_tree';
/**
 * @stable
 */
export const ROUTER_DIRECTIVES = [RouterOutlet, RouterLink, RouterLinkWithHref, RouterLinkActive];
export class RouterAppModule {
    constructor(injector) {
        this.injector = injector;
        setTimeout(() => {
            const appRef = injector.get(ApplicationRef);
            if (appRef.componentTypes.length == 0) {
                appRef.registerBootstrapListener(() => { injector.get(Router).initialNavigation(); });
            }
            else {
                injector.get(Router).initialNavigation();
            }
        }, 0);
    }
}
/** @nocollapse */
RouterAppModule.decorators = [
    { type: AppModule, args: [{
                directives: ROUTER_DIRECTIVES,
                providers: [
                    Location, { provide: LocationStrategy, useClass: PathLocationStrategy },
                    { provide: UrlSerializer, useClass: DefaultUrlSerializer }, {
                        provide: Router,
                        useFactory: setupRouter,
                        deps: [
                            ApplicationRef, ComponentResolver, UrlSerializer, RouterOutletMap, Location, Injector,
                            AppModuleFactoryLoader, ROUTES, ROUTER_CONFIGURATION
                        ]
                    },
                    RouterOutletMap,
                    { provide: ActivatedRoute, useFactory: (r) => r.routerState.root, deps: [Router] },
                    { provide: AppModuleFactoryLoader, useClass: SystemJsAppModuleLoader },
                    { provide: ROUTER_CONFIGURATION, useValue: { enableTracing: false } }
                ]
            },] },
];
/** @nocollapse */
RouterAppModule.ctorParameters = [
    { type: Injector, },
];
//# sourceMappingURL=router_app_module.js.map