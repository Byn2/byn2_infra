"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobile_operator_lookup_1 = require("mobile-operator-lookup");
var monime_code = (0, mobile_operator_lookup_1.lookupMobileOperator)('+232777777777').monime_code;
console.log('monime_code', monime_code);
