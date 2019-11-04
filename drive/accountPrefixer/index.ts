import "google-apps-script";
import getChildFolders from "./getChildFolders";
import clone from "./clone.js";

import { FOLDERS, writePermissionsEnabled, delimiterAfterID, delimiterInID, accountNumberLength, openID, closeID, minAccountNumber, shorthandAccountNameSupport } from "./SETTINGS";

const regexForAccountID = new RegExp(
	openID +
	`[0-9]+?` +
	(shorthandAccountNameSupport ? delimiterInID : ``) +	//	If generating shorthand name, add delimiter, or else skip it.
	(shorthandAccountNameSupport ? `\\w+?` : ``) +	//	Regex to look for the generated (alphabetical only) generated name.
	closeID +
	delimiterAfterID
);

/**
 * The Steadfast Appropriator ensures that project files are prefixed with their account ID.
 * Aside from adding (or modifying existing) account IDs, it should be able to recognize client facing FOLDERS
 * And not rename those files, as the prefixes are not very pretty.
 *
 * @TODO: should be able to generate account IDs by removing vowels and prefixing
 * with the highest incremented integer, that is, if an account ID hasn't been already assigned.
 */

let defaultSettings = {
	rootFolder: null,
	writePermissions: writePermissionsEnabled,
	shorthandAccountNames: shorthandAccountNameSupport,
	accountNumberLength,
	// registeredAccountID: void 0,
	regex: regexForAccountID,
	openID: openID, // @TODO: document this all the way down the code.
	inID: delimiterInID,
	closeID: closeID, // @TODO: document this all the way down the code.
	afterID: delimiterAfterID,
	minAccountNumber
};

function SteadfastAppropriator() {

	console.log(`===== EXECUTION BEGIN =====`);
	let settings = { shanghai: clone(defaultSettings) };

	console.log(`===== Inventum 上海 Folder =====`);
	settings.shanghai.rootFolder = DriveApp.getFolderById(FOLDERS.inventum_shanghai);
	console.log(settings.shanghai);
	getChildFolders(settings.shanghai);

	// console.log(`===== Personal Consulting Folder =====`);
	// settings.personalConsulting.rootFolder = DriveApp.getFolderById(FOLDERS.personal);
	// console.log(settings.personalConsulting);
	// getChildFolders(settings.personalConsulting);
	console.log(`===== EXECUTION COMPLETE =====`);
}
