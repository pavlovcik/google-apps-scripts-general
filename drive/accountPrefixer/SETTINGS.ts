let writePermissionsEnabled = true; //	Global killswitch for allowing writes to disk (Drive).

let FOLDERS = {
	TEST: `1RFP4KVW83Ki55Q6YDPo7BBAaN1e3xde7`,
	CONFLUENCE: `1fckUZPA-easiiEk-367CwK99mc-UZDKW`
	// personal: `1sEVOnqwKmYTZMeBsWXiNYFvbHYfGWvwQ`,
	// inventum: `0B3hiA5zCI0EDcEcxbnY0anMyLU0`
};

// KEY refers to Account Identifier, which can be either
// shorthandAccountNamesCY MODE e.g. source folder name: `Inventum Digital` converts to `0086-ID Inventum Digital`
// NORMAL MODE e.g. `Inventum Digital` converts to `0086 Inventum Digital`

//	WARNING: SPECIAL CHARACTERS MUST BE DOUBLE ESCAPED!

let openID = `\\[`; //	Wrapper symbol to denote ends of Account Identifier e.g. `[1234-ID] Inventum Digital`
let accountNumberLength = 2;
let delimiterInID = `-`; //	Only in shorthandAccountNamesCY mode, what seperates the account number from account shorthand within the Account Identifier
let closeID = `\\]`;
let delimiterAfterID = ` `; //  Seperator between Account Identifier, and Account Name. e.g. `1234-ID Inventum Digital`

let shorthandAccountNameSupport = true;
let minAccountNumber = 0;

export default { FOLDERS, writePermissionsEnabled, openID, delimiterInID, accountNumberLength, closeID, delimiterAfterID, shorthandAccountNameSupport, minAccountNumber };