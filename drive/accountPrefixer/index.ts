import "google-apps-script";
import handleUnprefixedAccounts from "./handleUnprefixedAccounts";
import getChildFolders from "./getChildFolders";

const RENAME_PERMISSIONS_ENABLED = false;
const DELIMITER_AFTER_KEY = " ";
const DELIMITER_IN_KEY = "-"; //  Between account ID and name. e.g. "0001 Inventum Digital, Inc."
const REGEX_FOR_PREFIX = new RegExp("^[A-Z0-9]{4}" + DELIMITER_IN_KEY); //  Capital letters or numbers with a delimiter in front e.g. "AB01 "
// const REGEX_FOR_PREFIX = new RegExp("\d{4}" + DELIMITER_IN_KEY + "\S{1,4}" + DELIMITER_AFTER_KEY); //  Capital letters or numbers with a delimiter in front e.g. "AB01 "

const FOLDERS = {
	test: "1LDIkYDZGrb6tBi3vZYv3shkXvGK49W5b",
	personal: "1sEVOnqwKmYTZMeBsWXiNYFvbHYfGWvwQ",
	inventum: "0B3hiA5zCI0EDcEcxbnY0anMyLU0"
};

/**
 * The Steadfast Appropriator ensures that project files are prefixed with their account ID.
 * Aside from adding (or modifying existing) account IDs, it should be able to recognize client facing folders
 * And not rename those files, as the prefixes are not very pretty.
 */

function SteadfastAppropriator() {
	console.log("===== EXECUTION BEGIN =====");
	// console.log("===== folders.inventum =====");
	// getFolderTree(folders.inventum);
	// console.log("===== folders.personal =====");
	// getFolderTree(folders.personal);
	console.log("===== folders.test =====");
	crawlFolderTree(FOLDERS.test);
	console.log("===== EXECUTION COMPLETE =====");
}

/**
 * Creative Titler
 * @todo should be able to generate account IDs by removing vowels and prefixing
 * with the highest incremented integer, that is, if an account ID hasn't been already assigned.
 */
function CreativeTitler() {
	//  ironically with the least creative name
	console.log("===== EXECUTION BEGIN =====");
	// console.log("===== folders.inventum =====");
	// titler2(folders.inventum);
	// console.log("===== folders.personal =====");
	// titler2(folders.personal);
	console.log("===== folders.test =====");

	handleUnprefixedAccounts(FOLDERS.test, REGEX_FOR_PREFIX, RENAME_PERMISSIONS_ENABLED, DELIMITER_AFTER_KEY);

	console.log("===== EXECUTION COMPLETE =====");
}

/**
 * Crawls a folder's tree
 * @param folderId
 */
function crawlFolderTree(folderId: string) {
	return getChildFolders(
		DriveApp.getFolderById(folderId),
		undefined,
		REGEX_FOR_PREFIX,
		RENAME_PERMISSIONS_ENABLED,
		DELIMITER_AFTER_KEY
	);
}
