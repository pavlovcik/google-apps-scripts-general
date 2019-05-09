import "google-apps-script";
import getChildFolders from "./getChildFolders";
import {
	FOLDERS,
	writePermissionsEnabled,
	delimiterAfterID,
	delimiterInID,
	accountNumberLength,
	openID,
	closeID,
	minAccountNumber,
	shorthandAccountNameSupport
} from "./SETTINGS";

let shorthandAccountNames = shorthandAccountNameSupport; //	Weird bug

const regexForAccountID = new RegExp(
	openID +
		`[0-9]{${accountNumberLength}}` +
		(shorthandAccountNames ? delimiterInID : ``) +
		(shorthandAccountNames ? `\\w{1,4}` : ``) +
		closeID +
		delimiterAfterID
);

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
		regex: regexForAccountID,
		writePermissions: writePermissionsEnabled,
		afterID: delimiterAfterID,
		inID: delimiterInID,
		shorthandAccountNames: shorthandAccountNames,
		minAccountNumber,
		openID: openID, // @TODO: document this all the way down the code.
		closeID: closeID, // @TODO: document this all the way down the code.
		accountNumberLength
	});

	console.log(`===== FOLDERS.CONFLUENCE =====`);
	shorthandAccountNames = true;
	getChildFolders({
		rootFolder: DriveApp.getFolderById(FOLDERS.CONFLUENCE),
		registeredAccountID: void 0,
		regex: regexForAccountID,
		writePermissions: writePermissionsEnabled,
		afterID: delimiterAfterID,
		inID: delimiterInID,
		shorthandAccountNames: shorthandAccountNames,
		minAccountNumber,
		openID: openID, // @TODO: document this all the way down the code.
		closeID: closeID, // @TODO: document this all the way down the code.
		accountNumberLength
	});

	console.log(`===== EXECUTION COMPLETE =====`);
}

// const regexForAccountID_NUMERIC = new RegExp(
// 	openID +
// 		`[0-9]{${accountNumberLength}}` +
// 		closeID +
// 		delimiterAfterID
// ); //  NORMAL Account Identification parser. NUMBERS only.

// const regexForAccountID_ALPHANUMERIC = new RegExp(
// 	openID +
// 		`[0-9]{${accountNumberLength}}` +
// 		delimiterInID +
// 		`\\w{1,4}` +
// 		closeID +
// 		delimiterAfterID
// ); //  shorthandAccountNamesCY Account Identification parser. ALPHANUMERIC.
