import "google-apps-script";
import getChildFolders from "./getChildFolders";
const RENAME_PERMISSIONS_ENABLED = true;

const DELIMITER_AFTER_KEY = ` `;
const DELIMITER_IN_KEY = `-`; //  Between account ID and name. e.g. `0001 Inventum Digital, Inc.`

let REGEX_FOR_PREFIX_NUMERIC = new RegExp(`^[0-9]{4}` + DELIMITER_AFTER_KEY); //  Numbers with a delimiter in front e.g. `0001 `
let REGEX_FOR_PREFIX_ALPHANUMERIC = new RegExp(
	`[0-9]{4}` + DELIMITER_IN_KEY + `[0-9A-Za-z]{1,4}` + DELIMITER_AFTER_KEY
); //  Capital letters or numbers with a delimiter in front e.g. `0001-ABXY  `


const FOLDERS = {
	test: `1pFbF1sisQlHs9OatzuRAcXGSwg47Gb8X`
	// personal: `1sEVOnqwKmYTZMeBsWXiNYFvbHYfGWvwQ`,
	// inventum: `0B3hiA5zCI0EDcEcxbnY0anMyLU0`
};

let fancyAccountNames = false; //	This would include the numerical prefix, along with the shortened text e.g. `Inventum Digital` >> `0086-ID Inventum Digital`
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
	crawlFolderTree(FOLDERS.test);
	console.log(`===== EXECUTION COMPLETE =====`);
}

/**
 * Crawls a folder's tree
 * @param folderId
 */
function crawlFolderTree(folderId: string) {
	return getChildFolders(
		DriveApp.getFolderById(folderId),
		void 0,
		fancyAccountNames
			? REGEX_FOR_PREFIX_ALPHANUMERIC
			: REGEX_FOR_PREFIX_NUMERIC,
		RENAME_PERMISSIONS_ENABLED,
		DELIMITER_AFTER_KEY,
		DELIMITER_IN_KEY,
		fancyAccountNames,
		globalMaxAccountNumberCount
	);
}
