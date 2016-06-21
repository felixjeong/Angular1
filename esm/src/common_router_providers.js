"use strict";
const common_1 = require('@angular/common');
const core_1 = require('@angular/core');
const router_1 = require('./router');
const router_outlet_map_1 = require('./router_outlet_map');
const router_state_1 = require('./router_state');
const url_tree_1 = require('./url_tree');
exports.ROUTER_CONFIG = new core_1.OpaqueToken('ROUTER_CONFIG');
exports.ROUTER_OPTIONS = new core_1.OpaqueToken('ROUTER_OPTIONS');
function setupRouter(ref, resolver, urlSerializer, outletMap, location, injector, config, opts) {
    if (ref.componentTypes.length == 0) {
        throw new Error('Bootstrap at least one component before injecting Router.');
    }
    const componentType = ref.componentTypes[0];
    const r = new router_1.Router(componentType, resolver, urlSerializer, outletMap, location, injector, config);
    ref.registerDisposeListener(() => r.dispose());
    if (opts.enableTracing) {
        r.events.subscribe(e => {
            console.group(`Router Event: ${e.constructor.name}`);
            console.log(e.toString());
            console.log(e);
            console.groupEnd();
        });
    }
    return r;
}
exports.setupRouter = setupRouter;
function setupRouterInitializer(injector) {
    // https://github.com/angular/angular/issues/9101
    // Delay the router instantiation to avoid circular dependency (ApplicationRef ->
    // APP_INITIALIZER -> Router)
    setTimeout(() => {
        const appRef = injector.get(core_1.ApplicationRef);
        if (appRef.componentTypes.length == 0) {
            appRef.registerBootstrapListener(() => { injector.get(router_1.Router).initialNavigation(); });
        }
        else {
            injector.get(router_1.Router).initialNavigation();
        }
    }, 0);
    return () => null;
}
exports.setupRouterInitializer = setupRouterInitializer;
/**
 * A list of {@link Provider}s. To use the router, you must add this to your application.
 *
 * ### Example
 *
 * ```
 * @Component({directives: [ROUTER_DIRECTIVES]})
 * class AppCmp {
 *   // ...
 * }
 *
 * const router = [
 *   {path: '/home', component: Home}
 * ];
 *
 * bootstrap(AppCmp, [provideRouter(router)]);
 * ```
 */
function provideRouter(_config, _opts) {
    return [
        { provide: exports.ROUTER_CONFIG, useValue: _config }, { provide: exports.ROUTER_OPTIONS, useValue: _opts },
        common_1.Location, { provide: common_1.LocationStrategy, useClass: common_1.PathLocationStrategy },
        { provide: url_tree_1.UrlSerializer, useClass: url_tree_1.DefaultUrlSerializer },
        {
            provide: router_1.Router,
            useFactory: setupRouter,
            deps: [
                core_1.ApplicationRef, core_1.ComponentResolver, url_tree_1.UrlSerializer, router_outlet_map_1.RouterOutletMap, common_1.Location, core_1.Injector,
                exports.ROUTER_CONFIG, exports.ROUTER_OPTIONS
            ]
        },
        router_outlet_map_1.RouterOutletMap,
        { provide: router_state_1.ActivatedRoute, useFactory: (r) => r.routerState.root, deps: [router_1.Router] },
        // Trigger initial navigation
        { provide: core_1.APP_INITIALIZER, multi: true, useFactory: setupRouterInitializer, deps: [core_1.Injector] }
    ];
}
exports.provideRouter = provideRouter;
//# sourceMappingURL=common_router_providers.js.map