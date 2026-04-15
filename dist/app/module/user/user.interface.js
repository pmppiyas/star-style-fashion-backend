"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["BUYER"] = "BUYER";
})(Role || (exports.Role = Role = {}));
var IStatus;
(function (IStatus) {
    IStatus["ACTIVE"] = "ACTIVE";
    IStatus["INACTIVE"] = "INACTIVE";
    IStatus["SUSPEND"] = "SUSPEND";
})(IStatus || (exports.IStatus = IStatus = {}));
