import "google-apps-script";
import getChildFolders from "./getChildFolders";
import { default as settings } from "./settings";

let shorthandAccountNames = settings.shorthandAccountNameSupport; //	Weird bug

const regexForAccountID = new RegExp(
	settings.openID +
	`[0-9]{${settings.accountNumberLength}}` +
	(shorthandAccountNames ? settings.delimiterInID : ``) +
	(shorthandAccountNames ? `\\w{1,4}` : ``) +
	settings.closeID +
	settings.delimiterAfterID
);

/**
 * The Steadfast Appropriator ensures that project files are prefixed with their account ID.
 * Aside from adding (or modifying existing) account IDs, it should be able to recognize client facing FOLDERS
 * And not rename those files, as the prefixes are not very pretty.
 *
 * @TODO: should be able to generate account IDs by removing vowels and prefixing
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
		rootFolder: DriveApp.getFolderById(settings.FOLDERS.TEST),
		// registeredAccountID: void 0,
		regex: regexForAccountID,
		writePermissions: settings.writePermissionsEnabled,
		afterID: settings.delimiterAfterID,
		inID: settings.delimiterInID,
		shorthandAccountNames,
		minAccountNumber: settings.minAccountNumber,
		openID: settings.openID, // @TODO: document this all the way down the code.
		closeID: settings.closeID, // @TODO: document this all the way down the code.
		accountNumberLength: settings.accountNumberLength
	});

	console.log(`===== FOLDERS.CONFLUENCE =====`);
	shorthandAccountNames = true;
	getChildFolders({
		rootFolder: DriveApp.getFolderById(settings.FOLDERS.CONFLUENCE),
		// registeredAccountID: void 0,
		regex: regexForAccountID,
		writePermissions: settings.writePermissionsEnabled,
		afterID: settings.delimiterAfterID,
		inID: settings.delimiterInID,
		shorthandAccountNames,
		minAccountNumber: settings.minAccountNumber,
		openID: settings.openID, // @TODO: document this all the way down the code.
		closeID: settings.closeID, // @TODO: document this all the way down the code.
		accountNumberLength: settings.accountNumberLength
	});

	console.log(`===== EXECUTION COMPLETE =====`);
}
