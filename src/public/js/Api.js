var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export var RequestMethod;
(function (RequestMethod) {
    RequestMethod["get"] = "GET";
    RequestMethod["post"] = "POST";
    RequestMethod["patch"] = "PATCH";
    RequestMethod["put"] = "PUT";
    RequestMethod["delete"] = "DELETE";
})(RequestMethod || (RequestMethod = {}));
export default class Api {
    constructor(controller) {
        this.controller = controller;
        this.prefix = 'api';
    }
    makeRequest(method, route, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!route.startsWith('/'))
                route = '/' + route;
            try {
                const response = yield fetch(`${this.prefix}/${this.controller}${route}`, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: body ? JSON.stringify(body) : undefined
                });
                const json = yield response.json();
                return json;
            }
            catch (error) {
                if (error instanceof Error)
                    alert(error.message);
            }
        });
    }
}
