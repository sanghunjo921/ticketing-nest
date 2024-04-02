"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Membership = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["PROVIDER"] = "provider";
    Role["CONSUMER"] = "consumer";
})(Role || (exports.Role = Role = {}));
var Membership;
(function (Membership) {
    Membership["PLATINUM"] = "platinum";
    Membership["GOLD"] = "gold";
    Membership["SILVER"] = "silver";
    Membership["BRONZE"] = "bronze";
})(Membership || (exports.Membership = Membership = {}));
//# sourceMappingURL=user.enum.js.map