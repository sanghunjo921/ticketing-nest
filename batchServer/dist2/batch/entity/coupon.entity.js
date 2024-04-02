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
exports.Coupon = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let Coupon = class Coupon {
};
exports.Coupon = Coupon;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Coupon.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
        nullable: false,
    }),
    __metadata("design:type", String)
], Coupon.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 6,
        scale: 2,
        nullable: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.ValidateIf)((coupon) => coupon.isPercentage === true),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.ValidateIf)((coupon) => coupon.isPercentage === false),
    (0, class_validator_1.Max)(100000),
    __metadata("design:type", Number)
], Coupon.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        nullable: false,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
    }),
    __metadata("design:type", Number)
], Coupon.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Coupon.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Coupon.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.coupons),
    __metadata("design:type", Array)
], Coupon.prototype, "users", void 0);
exports.Coupon = Coupon = __decorate([
    (0, typeorm_1.Entity)()
], Coupon);
//# sourceMappingURL=coupon.entity.js.map