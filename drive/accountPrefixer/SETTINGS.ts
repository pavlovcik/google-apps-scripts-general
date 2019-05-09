const FOLDERS = {
	TEST: `1RFP4KVW83Ki55Q6YDPo7BBAaN1e3xde7`,
	CONFLUENCE: `1fckUZPA-easiiEk-367CwK99mc-UZDKW`
	// personal: `1sEVOnqwKmYTZMeBsWXiNYFvbHYfGWvwQ`,
	// inventum: `0B3hiA5zCI0EDcEcxbnY0anMyLU0`
};
const RENAME_PERMISSIONS_ENABLED = true;
// KEY refers to Account Identifier, which can be either
// FANCY MODE e.g. source folder name: `Inventum Digital` converts to `0086-ID Inventum Digital`
// NORMAL MODE e.g. `Inventum Digital` converts to `0086 Inventum Digital`

//	WARNING: SPECIAL CHARACTERS MUST BE DOUBLE ESCAPED!

const OPEN_WRAPPER = `\\[`; //	Wrapper symbol to denote ends of Account Identifier e.g. `[1234-ID] Inventum Digital`
// const OPEN_WRAPPER = `\\w\\d`; //	Wrapper symbol to denote ends of Account Identifier e.g. `[1234-ID] Inventum Digital`

const AMOUNT_OF_DIGITS_IN_ACCOUNT_NUMBER = 2;

const DELIMITER_IN_KEY = `-`; //	Only in FANCY mode, what seperates the account number from account shorthand within the Account Identifier
// const DELIMITER_IN_KEY = ``; //	Only in FANCY mode, what seperates the account number from account shorthand within the Account Identifier

const CLOSE_WRAPPER = `\\]`;
// const CLOSE_WRAPPER = ``;

const DELIMITER_AFTER_KEY = ` `; //  Seperator between Account Identifier, and Account Name. e.g. `1234-ID Inventum Digital`


const fancyAccountNames = true;
const minAccountNumber = 0;

export {
	FOLDERS,
	RENAME_PERMISSIONS_ENABLED,
	OPEN_WRAPPER,
	DELIMITER_IN_KEY,
	AMOUNT_OF_DIGITS_IN_ACCOUNT_NUMBER,
	CLOSE_WRAPPER,
	DELIMITER_AFTER_KEY,

	fancyAccountNames,
	minAccountNumber
};
