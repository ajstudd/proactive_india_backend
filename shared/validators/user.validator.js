"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi_1 = __importDefault(require("@/helpers/Joi"));
const register = Joi_1.default.object({
    phone: Joi_1.default.string()
        .pattern(/^[0-9]{10}$/)
        .optional()
        .messages({
        'string.pattern.base': 'Phone number must be a 10 digit number',
    }),
    email: Joi_1.default.string().email().optional(),
    name: Joi_1.default.string().required(),
    password: Joi_1.default.string().required(),
    role: Joi_1.default.string()
        .valid('ADMIN', 'USER', 'CONTRACTOR', 'GOVERNMENT')
        .default('USER'),
    contractorLicense: Joi_1.default.string().when('role', {
        is: 'CONTRACTOR',
        then: Joi_1.default.string().required().messages({
            'any.required': 'Contractor license is required when role is CONTRACTOR',
        }),
        otherwise: Joi_1.default.forbidden().messages({
            'any.unknown': 'Contractor license can only be provided when role is CONTRACTOR',
        }),
    }),
});
const update = Joi_1.default.object({
    email: Joi_1.default.string().email().optional(),
    name: Joi_1.default.string().optional(),
});
const userPhoneLoginPayload = Joi_1.default.object({
    email: Joi_1.default.string().email().required(),
});
const userEmailLoginPayload = Joi_1.default.object({
    phone: Joi_1.default.string().phoneNumber({ format: 'e164' }).required(),
});
const userEmailAndPasswordPayload = Joi_1.default.object({
    email: Joi_1.default.string().email().required(),
    password: Joi_1.default.string().required(),
});
const login = Joi_1.default.alternatives()
    .try(userPhoneLoginPayload, userEmailLoginPayload, userEmailAndPasswordPayload)
    .required();
const userPhoneVerifyPayload = Joi_1.default.object({
    phone: Joi_1.default.string().phoneNumber({ format: 'e164' }).required(),
    otp: Joi_1.default.string().required(),
});
const userEmailVerifyPayload = Joi_1.default.object({
    email: Joi_1.default.string().email().required(),
    otp: Joi_1.default.string().required(),
});
const verifyOtp = Joi_1.default.alternatives()
    .try(userPhoneVerifyPayload, userEmailVerifyPayload)
    .required();
const editProfile = Joi_1.default.object({
    name: Joi_1.default.string().optional(),
    email: Joi_1.default.string().email().optional(),
    phone: Joi_1.default.string().phoneNumber({ format: 'e164' }).optional(),
    password: Joi_1.default.string().min(6).optional(),
    photo: Joi_1.default.string().optional(), // ID of uploaded image
});
const verifyEmailChange = Joi_1.default.object({
    token: Joi_1.default.string().required(),
    email: Joi_1.default.string().email().required(),
});
const resetPassword = Joi_1.default.object({
    oldPassword: Joi_1.default.string().required(),
    newPassword: Joi_1.default.string().min(6).required(),
});
const searchQuery = Joi_1.default.object({
    query: Joi_1.default.string().min(1).required(),
    limit: Joi_1.default.number().integer().min(1).max(100).optional(),
    page: Joi_1.default.number().integer().min(1).optional(),
}).unknown(true); // Allow unknown query parameters
exports.default = {
    register,
    login,
    update,
    verifyOtp,
    editProfile,
    verifyEmailChange,
    resetPassword,
    searchQuery,
};
