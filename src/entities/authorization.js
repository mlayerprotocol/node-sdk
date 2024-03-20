"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorization = exports.SignatureData = void 0;
var helper_1 = require("../helper");
var base_1 = require("./base");
var SignatureData = /** @class */ (function () {
    function SignatureData(type, publicKey, signature) {
        this.type = type;
        this.publicKey = publicKey;
        this.signature = signature;
        type = '';
        publicKey = '';
        signature = '';
    }
    /**
     * @override
     * @returns {IAuthorization}
     */
    SignatureData.prototype.asPayload = function () {
        return {
            ty: this.type,
            pubK: this.publicKey,
            sig: this.signature,
        };
    };
    return SignatureData;
}());
exports.SignatureData = SignatureData;
var Authorization = /** @class */ (function (_super) {
    __extends(Authorization, _super);
    function Authorization() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.account = '';
        _this.agent = '';
        _this.grantor = '';
        _this.privilege = 0;
        _this.topicIds = '';
        _this.signatureData = new SignatureData('', '', '');
        return _this;
    }
    /**
     * @override
     * @returns {IAuthorization}
     */
    Authorization.prototype.asPayload = function () {
        return {
            agt: this.agent,
            acct: this.account,
            gr: this.grantor,
            privi: this.privilege,
            topIds: this.topicIds,
            ts: this.timestamp,
            du: this.duration,
            sigD: this.signatureData.asPayload(),
        };
    };
    /**
     * @override
     * @returns {Buffer}
     */
    Authorization.prototype.encodeBytes = function () {
        return helper_1.Utils.encodeBytes({ type: 'hex', value: this.account }, { type: 'address', value: this.agent }, { type: 'string', value: this.topicIds }, { type: 'int', value: this.privilege }, { type: 'int', value: this.duration }, { type: 'int', value: this.timestamp });
    };
    return Authorization;
}(base_1.BaseEntity));
exports.Authorization = Authorization;
