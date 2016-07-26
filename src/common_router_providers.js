/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var common_1 = require('@angular/common');
var core_1 = require('@angular/core');
var router_1 = require('./router');
var router_config_loader_1 = require('./router_config_loader');
var router_outlet_map_1 = require('./router_outlet_map');
var router_state_1 = require('./router_state');
var url_tree_1 = require('./url_tree');
exports.ROUTER_CONFIGURATION = new core_1.OpaqueToken('ROUTER_CONFIGURATION');
function setupRouter(ref, resolver, urlSerializer, outletMap, location, injector, loader, config, opts) {
    if (ref.componentTypes.length == 0) {
        throw new Error('Bootstrap at least one component before injecting Router.');
    }
    var componentType = ref.componentTypes[0];
    var r = new router_1.Router(componentType, resolver, urlSerializer, outletMap, location, injector, loader, config);
    ref.registerDisposeListener(function () { return r.dispose(); });
    if (opts.enableTracing) {
        r.events.subscribe(function (e) {
            console.group("Router Event: " + e.constructor.name);
            console.log(e.toString());
            console.log(e);
            console.groupEnd();
        });
    }
    return r;
}
exports.setupRouter = setupRouter;
function rootRoute(router) {
    return router.routerState.root;
}
exports.rootRoute = rootRoute;
function setupRouterInitializer(injector) {
    // https://github.com/angular/angular/issues/9101
    // Delay the router instantiation to avoid circular dependency (ApplicationRef ->
    // APP_INITIALIZER -> Router)
    setTimeout(function () {
        var appRef = injector.get(core_1.ApplicationRef);
        if (appRef.componentTypes.length == 0) {
            appRef.registerBootstrapListener(function () { injector.get(router_1.Router).initialNavigation(); });
        }
        else {
            injector.get(router_1.Router).initialNavigation();
        }
    }, 0);
    return function () { return null; };
}
exports.setupRouterInitializer = setupRouterInitializer;
/**
 * An array of {@link Provider}s. To use the router, you must add this to your application.
 *
 * ### Example
 *
 * ```
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * class AppCmp {
 *   // ...
 * }
 *
 * const config = [
 *   {path: 'home', component: Home}
 * ];
 *
 * bootstrap(AppCmp, [provideRouter(config)]);
 * ```
 *
 * @deprecated use RouterModule instead
 */
function provideRouter(routes, config) {
    return [
        { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes },
        { provide: router_config_loader_1.ROUTES, useExisting: router_config_loader_1.ROUTER_CONFIG }, { provide: router_config_loader_1.ROUTER_CONFIG, useValue: routes },
        { provide: exports.ROUTER_CONFIGURATION, useValue: config }, common_1.Location,
        { provide: common_1.LocationStrategy, useClass: common_1.PathLocationStrategy },
        { provide: url_tree_1.UrlSerializer, useClass: url_tree_1.DefaultUrlSerializer },
        {
            provide: router_1.Router,
            useFactory: setupRouter,
            deps: [
                core_1.ApplicationRef, core_1.ComponentResolver, url_tree_1.UrlSerializer, router_outlet_map_1.RouterOutletMap, common_1.Location, core_1.Injector,
                core_1.NgModuleFactoryLoader, router_config_loader_1.ROUTES, exports.ROUTER_CONFIGURATION
            ]
        },
        router_outlet_map_1.RouterOutletMap, { provide: router_state_1.ActivatedRoute, useFactory: rootRoute, deps: [router_1.Router] },
        // Trigger initial navigation
        { provide: core_1.APP_INITIALIZER, multi: true, useFactory: setupRouterInitializer, deps: [core_1.Injector] },
        { provide: core_1.NgModuleFactoryLoader, useClass: core_1.SystemJsNgModuleLoader }
    ];
}
exports.provideRouter = provideRouter;
/**
 * Router configuration.
 *
 * ### Example
 *
 * ```
 * @NgModule({providers: [
 *   provideRoutes([{path: 'home', component: Home}])
 * ]})
 * class LazyLoadedModule {
 *   // ...
 * }
 * ```
 *
 * @experimental
 */
function provideRoutes(routes) {
    return [
        { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes },
        { provide: router_config_loader_1.ROUTES, useValue: routes }
    ];
}
exports.provideRoutes = provideRoutes;
/**
 * Router configuration.
 *
 * ### Example
 *
 * ```
 * @NgModule({providers: [
 *   provideRouterOptions({enableTracing: true})
 * ]})
 * class LazyLoadedModule {
 *   // ...
 * }
 * ```
 *
 * @experimental
 */
function provideRouterConfig(config) {
    return { provide: exports.ROUTER_CONFIGURATION, useValue: config };
}
exports.provideRouterConfig = provideRouterConfig;
//# sourceMappingURL=common_router_providers.js.map