import "google-apps-script";
import incrementAccountNumber from "./incrementAccountNumber";

/**
 * @description Generates an account ID
 * @author Alexander Pavlovcik
 *
 * @param accountFolder Current working directory.
 * @param accountFolders Sibling folders.
 * @param RFP REGEX_FOR_PREFIX - Regular expression used to parse the account ID. This can be for either normal or fancy mode.
 * @param RPE RENAME_PERMISSIONS_ENABLED - Empowers the software to make persisting changes to disk (Drive).
 * @param DAK DELIMITER_AFTER_KEY - Character to separate the account ID and the account name.
 * @param DIK DELIMITER_IN_KEY - Character to separate the account number and the account shorthand name within the account ID.
 * @param FAN fancyAccountNames - Enables account shorthand name in account ID.
 * globalMaxAccountNumberCount
 *
 * @returns {string} A generated account id.
 */
export default function generateAccountID(
	accountFolder: GoogleAppsScript.Drive.Folder,
	accountFolders: GoogleAppsScript.Drive.FolderIterator,
	RFP: RegExp,
	RPE: boolean,
	DAK: string,
	DIK: string,
	FAN: boolean,
	// accountFoldersFreshIterator2: GoogleAppsScript.Drive.FolderIterator // @TODO: add to definition
	globalMaxAccountNumberCount: number
): string {
	const folderName = accountFolder.getName();
	console.log(`Generating account ID for '${folderName}'`);

	let shorthandAccountName: string = generateShorthandAccountName(folderName);



/**
 *  Handle logic for highest account number in a special manner because
 * Google Apps Scripts shares variable memory in a very strange manner.
 *
 * Basically this requires a manual verification before clobbering the value.
 */

	const highestAccountNumber = incrementAccountNumber({
		siblingFolders: accountFolders,
		globalMaxAccountNumberCount
		// siblingFoldersCLONE: accountFoldersFreshIterator2
		// RFP,
		// DAK,
		// DIK,
		// FAN
	});

	console.log(`

	highestAccountNumber: ${highestAccountNumber}
	globalMaxAccountNumberCount: ${globalMaxAccountNumberCount}
	`);

	const paddedNumber = pad(highestAccountNumber, 4);

	const RENDER = FAN
		? paddedNumber + DIK + shorthandAccountName.toUpperCase()
		: paddedNumber;

	console.log(`Rendered account ID: ${RENDER}`);
	console.log(`

    paddedNumber: '${paddedNumber}';
    DELIMITER_AFTER_KEY: '${DAK}';
    folderName: '${folderName}'

    `);

	console.log(
		`The folder '${folderName}' will be renamed because it lacks an account ID.`
	);
	if (RPE) {
		let accountFolderName: string;
		if (FAN) {
			accountFolderName =
				paddedNumber + //  "0000"
				DIK + //  "-"
				shorthandAccountName.toUpperCase() + //  "ID"
				DAK + //  " "
				folderName; //  "Inventum Digital"
		} else {
			accountFolderName =
				paddedNumber + //  "0000"
				DAK + //  " "
				folderName; //  "Inventum Digital"
		}
		accountFolder.setName(accountFolderName);
	}

	return RENDER;

	function generateShorthandAccountName(folderName: string): string {
		const accountName = folderName;
		const shortEnoughToSkip = folderName.length <= 4;

		let shorthandAccountName: string;
		if (!shortEnoughToSkip) {
			const accountNameCapitalLetters = extractCaps(accountName);
			if (accountNameCapitalLetters.length <= 1) {
				shorthandAccountName = removeVowels(accountName, 4);
			} else {
				shorthandAccountName = accountNameCapitalLetters;
			}
			if (shorthandAccountName.length >= 5) {
				shorthandAccountName = truncate(shorthandAccountName);
			}
		} else {
			shorthandAccountName = folderName;
		}
		return shorthandAccountName;
	}

	/**
	 * @param {number} a the number to convert
	 * @param {number} b number of resulting characters
	 */
	function pad(a: number, b: number): string {
		return (1e15 + a + ``).slice(-b);
	}

	/**
	 * @param {String} str
	 * @param {number} lessThan
	 */
	function removeVowels(str: string, lessThan: number): string {
		if (str.length < lessThan) return str;
		const regex = /[aeiou\s]/g;
		const strDead = str.replace(regex, ``);

		const firstLetterIsVowel = regex.test(str.charAt(0));
		if (firstLetterIsVowel) return str.charAt(0) + strDead;

		return strDead;
	}

	/**
	 * @param {string} string
	 */
	function truncate(string: string) {
		const length = string.length;

		if (length >= 5) {
			// console.log({ preTruncated: string });
			const truncated =
				string.slice(0, length - 2) + string.slice(length - 1, string.length);
			// console.log({ truncated });

			return truncate(truncated);
		} else {
			// console.log({ caps: string });

			return string;
		}
	}

	/**
	 * @param {String} input
	 */
	function extractCaps(input: string) {
		const firstLetter = input.charAt(0);
		const notCapitalized = firstLetterIsNotCapitalized(firstLetter);
		const caps = input.match(/[A-Z]/gm);

		let extracted: string;
		if (caps) {
			extracted = caps.join().replace(/,/gim, ``);

			if (notCapitalized) {
				extracted = firstLetter.toUpperCase().concat(extracted);
			}

			// console.log(caps);

			if (extracted.length >= 1) return extracted;
		}
		return ``;
	}

	/**
	 * @param {string} firstLetter
	 */
	function firstLetterIsNotCapitalized(firstLetter: string) {
		let notCapitalized: boolean;
		if (firstLetter == firstLetter.toLowerCase()) {
			// The character is lowercase
			notCapitalized = true;
		} else {
			// The character is uppercase
			notCapitalized = false;
		}
		return notCapitalized;
	}
}
