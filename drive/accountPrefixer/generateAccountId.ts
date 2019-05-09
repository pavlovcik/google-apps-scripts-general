import "google-apps-script";
import incrementAccountNumber from "./incrementAccountNumber";
/**
 *
 * @interface IGenerateAccountID
 *
 * @param {GoogleAppsScript.Drive.Folder} accountFolder Current working directory.
 * @param {GoogleAppsScript.Drive.FolderIterator} accountFolders Sibling folders.
 * @param {boolean} RFP REGEX_FOR_PREFIX - Regular expression used to parse the account ID. This can be for either normal or fancy mode.
 * @param {string} RPE RENAME_PERMISSIONS_ENABLED - Empowers the software to make persisting changes to disk (Drive).
 * @param {string} DAK DELIMITER_AFTER_KEY - Character to separate the account ID and the account name.
 * @param {boolean} DIK DELIMITER_IN_KEY - Character to separate the account number and the account shorthand name within the account ID.
 * @param {number} FAN fancyAccountNames - Enables account shorthand name in account ID.
 */
interface IGenerateAccountID {
	accountFolder: GoogleAppsScript.Drive.Folder;
	accountFolders: GoogleAppsScript.Drive.FolderIterator;
	RPE: boolean;
	DAK: string;
	DIK: string;
	FAN: boolean;
	minAccountNumber: number;
	OW?: string;
	CW?: string;
	AMOUNT_OF_DIGITS_IN_ACCOUNT_NUMBER: number;
}

/**
 *
 * @description Generates an account ID
 * @author Alexander Pavlovcik
 *
 * @export
 * @param {IGenerateAccountID}
 * @returns {string} A generated account id.
 */
export default function generateAccountID({
	accountFolder,
	accountFolders,
	RPE,
	DAK,
	DIK,
	FAN,
	minAccountNumber,
	OW,
	CW,
	AMOUNT_OF_DIGITS_IN_ACCOUNT_NUMBER
}: IGenerateAccountID): string {
	if (OW) OW = OW.replace(/\\/gim, "");
	//	Remove all character escapes because this keeps breaking.
	else OW = "";

	if (CW) CW = CW.replace(/\\/gim, "");
	//	Remove all character escapes because this keeps breaking.
	else CW = "";

	const folderName = accountFolder.getName();
	console.log(`Generating account ID for '${folderName}'`);
	let shorthandAccountName: string = generateShorthandAccountName(folderName);

	const highestAccountNumber = incrementAccountNumber({
		siblingFolders: accountFolders,
		minAccountNumber
	});

	const paddedNumber = pad(
		highestAccountNumber,
		AMOUNT_OF_DIGITS_IN_ACCOUNT_NUMBER
	);

	const RENDER = FAN
		? OW + paddedNumber + DIK + shorthandAccountName.toUpperCase() + CW
		: paddedNumber;

	if (RPE) {
		let accountFolderName: string;
		if (FAN) {
			accountFolderName =
				OW + //	@TODO: Document // "["
				paddedNumber + //  "0000"
				DIK + //  "-"
				shorthandAccountName.toUpperCase() + //  "ID"
				CW + //	@TODO: Document // "]"
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
			const truncated =
				string.slice(0, length - 2) + string.slice(length - 1, string.length);
			return truncate(truncated);
		} else {
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
