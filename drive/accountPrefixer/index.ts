import "google-apps-script";
import getChildFolders from "./getChildFolders";
const RENAME_PERMISSIONS_ENABLED = true;

// KEY refers to Account Identifier, which can be either
// FANCY MODE e.g. source folder name: `Inventum Digital` converts to `0086-ID Inventum Digital`
// NORMAL MODE e.g. `Inventum Digital` converts to `0086 Inventum Digital`
const DELIMITER_AFTER_KEY = ` `; //  Seperator between Account Identifier, and Account Name. e.g. `1234-ID Inventum Digital`
const DELIMITER_IN_KEY = `-`; //	Only in FANCY mode, what seperates the account number from account shorthand within the Account Identifier

const OPEN_WRAPPER = `\\[`; //	Wrapper symbol to denote ends of Account Identifier e.g. `[1234-ID] Inventum Digital`
const CLOSE_WRAPPER = `\\]`;

let REGEX_FOR_PREFIX_NUMERIC = new RegExp(`^[0-9]{4}` + DELIMITER_AFTER_KEY); //  NORMAL Account Identification parser. NUMBERS only.
let REGEX_FOR_PREFIX_ALPHANUMERIC = new RegExp(
	OPEN_WRAPPER +
		`[0-9]{4}` +
		DELIMITER_IN_KEY +
		`\\w{1,4}` +
		CLOSE_WRAPPER +
		DELIMITER_AFTER_KEY
); //  FANCY Account Identification parser. ALPHANUMERIC.

const FOLDERS = {
	test: `1k3lFXrewKN4GIUHzRLI-JLw04Q9BcUZ3`,
	test2: `1hBMXfHxrYMrGH6SlZ7saGlqcxw3oUNqR`
	// personal: `1sEVOnqwKmYTZMeBsWXiNYFvbHYfGWvwQ`,
	// inventum: `0B3hiA5zCI0EDcEcxbnY0anMyLU0`
};

let fancyAccountNames = false;
let globalMaxAccountNumberCount = 0;
/**
 * The Steadfast Appropriator ensures that project files are prefixed with their account ID.
 * Aside from adding (or modifying existing) account IDs, it should be able to recognize client facing folders
 * And not rename those files, as the prefixes are not very pretty.
 *
 * @todo should be able to generate account IDs by removing vowels and prefixing
 * with the highest incremented integer, that is, if an account ID hasn't been already assigned.
 */

function SteadfastAppropriator() {
	fancyAccountNames = true;
	console.log(`===== EXECUTION BEGIN =====`);
	// console.log(`===== folders.inventum =====`);
	// getFolderTree(folders.inventum);
	// console.log(`===== folders.personal =====`);
	// getFolderTree(folders.personal);
	console.log(`===== folders.test =====`);
	getChildFolders({
		rootFolder: DriveApp.getFolderById(FOLDERS.test),
		// registeredAccountID:	 void 0,
		RFP: fancyAccountNames
			? REGEX_FOR_PREFIX_ALPHANUMERIC
			: REGEX_FOR_PREFIX_NUMERIC,
		RPE: RENAME_PERMISSIONS_ENABLED,
		DAK: DELIMITER_AFTER_KEY,
		DIK: DELIMITER_IN_KEY,
		FAN: fancyAccountNames,
		globalMaxAccountNumberCount,
		OW: OPEN_WRAPPER, // @TODO: document this all the way down the code.
		CW: CLOSE_WRAPPER // @TODO: document this all the way down the code.
	});

	console.log(`===== folders.test2 =====`);
	getChildFolders({
		rootFolder: DriveApp.getFolderById(FOLDERS.test2),
		// registeredAccountID:	 void 0,
		RFP: fancyAccountNames
			? REGEX_FOR_PREFIX_ALPHANUMERIC
			: REGEX_FOR_PREFIX_NUMERIC,
		RPE: RENAME_PERMISSIONS_ENABLED,
		DAK: DELIMITER_AFTER_KEY,
		DIK: DELIMITER_IN_KEY,
		FAN: fancyAccountNames,
		globalMaxAccountNumberCount,
		OW: OPEN_WRAPPER, // @TODO: document this all the way down the code.
		CW: CLOSE_WRAPPER // @TODO: document this all the way down the code.
	});
	console.log(`===== EXECUTION COMPLETE =====`);
}
