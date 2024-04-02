"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discountRateInstances = exports.DiscountRate = void 0;
const typeorm_1 = require("typeorm");
const discountRate_enum_1 = require("../type/discountRate.enum");
const user_entity_1 = require("./user.entity");
const discountRates = {
    platinum: 0.1,
    gold: 0.08,
    silver: 0.05,
    bronze: 0.03,
};
let DiscountRate = class DiscountRate {
};
exports.DiscountRate = DiscountRate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DiscountRate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: Object.values(discountRate_enum_1.MembershipLevel),
        unique: true,
    }),
    __metadata("design:type", String)
], DiscountRate.prototype, "membershipLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], DiscountRate.prototype, "discountRatio", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.discountRate),
    __metadata("design:type", Array)
], DiscountRate.prototype, "users", void 0);
exports.DiscountRate = DiscountRate = __decorate([
    (0, typeorm_1.Entity)()
], DiscountRate);
exports.discountRateInstances = Object.keys(discountRates).map((membershipLevel) => ({
    membershipLevel,
    discountRatio: discountRates[membershipLevel],
}));
//# sourceMappingURL=discountRate.entity.js.map