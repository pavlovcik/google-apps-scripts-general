import "google-apps-script";
import getChildFolders from "./getChildFolders";
import {
	FOLDERS,
	RENAME_PERMISSIONS_ENABLED,
	DELIMITER_AFTER_KEY,
	DELIMITER_IN_KEY,
	AMOUNT_OF_DIGITS_IN_ACCOUNT_NUMBER,
	OPEN_WRAPPER,
	CLOSE_WRAPPER,
	minAccountNumber,
	fancyAccountNames
} from "./SETTINGS";


const REGEX_FOR_PREFIX_NUMERIC = new RegExp(
	OPEN_WRAPPER +
		`[0-9]{${AMOUNT_OF_DIGITS_IN_ACCOUNT_NUMBER}}` +
		CLOSE_WRAPPER +
		DELIMITER_AFTER_KEY
); //  NORMAL Account Identification parser. NUMBERS only.

const REGEX_FOR_PREFIX_ALPHANUMERIC = new RegExp(
	OPEN_WRAPPER +
		`[0-9]{${AMOUNT_OF_DIGITS_IN_ACCOUNT_NUMBER}}` +
		DELIMITER_IN_KEY +
		`\\w{1,4}` +
		CLOSE_WRAPPER +
		DELIMITER_AFTER_KEY
); //  FANCY Account Identification parser. ALPHANUMERIC.

let FAN = fancyAccountNames; //	Weird bug

/**
 * The Steadfast Appropriator ensures that project files are prefixed with their account ID.
 * Aside from adding (or modifying existing) account IDs, it should be able to recognize client facing FOLDERS
 * And not rename those files, as the prefixes are not very pretty.
 *
 * @todo should be able to generate account IDs by removing vowels and prefixing
 * with the highest incremented integer, that is, if an account ID hasn't been already assigned.
 */

function SteadfastAppropriator() {
	console.log(`===== EXECUTION BEGIN =====`);
	// console.log(`===== FOLDERS.inventum =====`);
	// getFolderTree(FOLDERS.inventum);
	// console.log(`===== FOLDERS.personal =====`);
	// getFolderTree(FOLDERS.personal);
	console.log(`===== FOLDERS.TEST =====`);

	getChildFolders({
		rootFolder: DriveApp.getFolderById(FOLDERS.TEST),
		registeredAccountID: void 0,
		RFP: FAN ? REGEX_FOR_PREFIX_ALPHANUMERIC : REGEX_FOR_PREFIX_NUMERIC,
		RPE: RENAME_PERMISSIONS_ENABLED,
		DAK: DELIMITER_AFTER_KEY,
		DIK: DELIMITER_IN_KEY,
		FAN: FAN,
		minAccountNumber,
		OW: OPEN_WRAPPER, // @TODO: document this all the way down the code.
		CW: CLOSE_WRAPPER, // @TODO: document this all the way down the code.
		AMOUNT_OF_DIGITS_IN_ACCOUNT_NUMBER
	});

	console.log(`===== FOLDERS.CONFLUENCE =====`);
	FAN = true;
	getChildFolders({
		rootFolder: DriveApp.getFolderById(FOLDERS.CONFLUENCE),
		registeredAccountID: void 0,
		RFP: FAN ? REGEX_FOR_PREFIX_ALPHANUMERIC : REGEX_FOR_PREFIX_NUMERIC,
		RPE: RENAME_PERMISSIONS_ENABLED,
		DAK: DELIMITER_AFTER_KEY,
		DIK: DELIMITER_IN_KEY,
		FAN: FAN,
		minAccountNumber,
		OW: OPEN_WRAPPER, // @TODO: document this all the way down the code.
		CW: CLOSE_WRAPPER, // @TODO: document this all the way down the code.
		AMOUNT_OF_DIGITS_IN_ACCOUNT_NUMBER
	});

	console.log(`===== EXECUTION COMPLETE =====`);
}
