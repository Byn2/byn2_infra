const { lookupMobileOperator } = require('mobile-operator-lookup');

const { monime_code } = lookupMobileOperator('+232777777777');
console.log('monime_code', monime_code);