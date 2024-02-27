"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGuest = exports.createAndGetGuest = exports.findGuest = void 0;
const superUserSchema_1 = __importDefault(require("../models/superUserSchema"));
const findGuest = (guestToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guest = yield superUserSchema_1.default.findOne({ guestToken });
        return Promise.resolve(guest);
    }
    catch (err) {
        return Promise.reject(err);
    }
});
exports.findGuest = findGuest;
const createAndGetGuest = (guestToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield superUserSchema_1.default.insertMany([{ guestToken, position: 'guest' }]);
        const guest = yield superUserSchema_1.default.findOne({ guestToken });
        return Promise.resolve(guest);
    }
    catch (err) {
        return Promise.reject(false);
    }
});
exports.createAndGetGuest = createAndGetGuest;
const updateGuest = (guestToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield superUserSchema_1.default.updateOne({ guestToken }, { $set: { status: false } });
        return Promise.resolve(true);
    }
    catch (error) {
        return Promise.reject(false);
    }
});
exports.updateGuest = updateGuest;
