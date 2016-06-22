import { LocationStrategy } from '@angular/common';
import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { Router } from '../router';
import { ActivatedRoute } from '../router_state';
export class RouterLink {
    /**
     * @internal
     */
    constructor(router, route, locationStrategy) {
        this.router = router;
        this.route = route;
        this.locationStrategy = locationStrategy;
        this.commands = [];
    }
    set routerLink(data) {
        if (Array.isArray(data)) {
            this.commands = data;
        }
        else {
            this.commands = [data];
        }
    }
    ngOnChanges(changes) { this.updateTargetUrlAndHref(); }
    onClick(button, ctrlKey, metaKey) {
        if (button !== 0 || ctrlKey || metaKey) {
            return true;
        }
        if (typeof this.target === 'string' && this.target != '_self') {
            return true;
        }
        this.router.navigateByUrl(this.urlTree);
        return false;
    }
    updateTargetUrlAndHref() {
        this.urlTree = this.router.createUrlTree(this.commands, { relativeTo: this.route, queryParams: this.queryParams, fragment: this.fragment });
        if (this.urlTree) {
            this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
        }
    }
}
/** @nocollapse */
RouterLink.decorators = [
    { type: Directive, args: [{ selector: '[routerLink]' },] },
];
/** @nocollapse */
RouterLink.ctorParameters = [
    { type: Router, },
    { type: ActivatedRoute, },
    { type: LocationStrategy, },
];
/** @nocollapse */
RouterLink.propDecorators = {
    'target': [{ type: Input },],
    'queryParams': [{ type: Input },],
    'fragment': [{ type: Input },],
    'href': [{ type: HostBinding },],
    'routerLink': [{ type: Input },],
    'onClick': [{ type: HostListener, args: ['click', ['$event.button', '$event.ctrlKey', '$event.metaKey'],] },],
};
//# sourceMappingURL=router_link.js.map