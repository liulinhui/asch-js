var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js");

function calculateFee(amount) {
    var min = constants.fees.send;
    var fee = parseFloat((amount * 0.0001).toFixed(0));
    return fee < min ? min : fee;
}

function createTransaction(recipientId, amount, secret, secondSecret) {
	var transaction = {
		type: 0,
		amount: amount,
		fee: constants.fees.send,
		recipientId: recipientId,
		timestamp: slots.getTime() - constants.clientDriftSeconds,
		asset: {}
	};

	var keys = crypto.getKeys(secret);
	transaction.senderPublicKey = keys.publicKey;

	crypto.sign(transaction, keys);

	if (secondSecret) {
		var secondKeys = crypto.getKeys(secondSecret);
		crypto.secondSign(transaction, secondKeys);
	}

	transaction.id = crypto.getId(transaction);
	return transaction;
}

module.exports = {
	createTransaction: createTransaction,
	calculateFee: calculateFee
}
