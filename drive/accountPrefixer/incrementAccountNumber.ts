/**
 *
 * @export
 * @interface IIncrementAccountNumber
 * @param {GoogleAppsScript.Drive.FolderIterator} siblingFolders
 * @param {RegExp} RFP REGEX_FOR_PREFIX - Regular expression used to parse the account ID. This can be for either normal or fancy mode.
 * @param {string} DAK DELIMITER_AFTER_KEY - Character to separate the account ID and the account name.
 * @param {string} DIK DELIMITER_IN_KEY - Character to separate the account number and the account shorthand name within the account ID.
 * @param {boolean} FAN fancyAccountNames - Enables account shorthand name in account ID.
 */
export interface IIncrementAccountNumber {
	siblingFolders: GoogleAppsScript.Drive.FolderIterator;
	globalMaxAccountNumberCount: number;
}

/**
 * Increments account numbers based on the highest account number in the root directory.
 * This will return a 0 if no value was derived.
 *
 * @param {IIncrementAccountNumber} { siblingFolders, siblingFoldersCLONE, RFP, DAK, DIK, FAN }
 * @returns {number} The highest account number in without padded zeros e.g. <number>80 for <string>"0080"
 */
export default function incrementAccountNumber({
	siblingFolders,
	globalMaxAccountNumberCount
}: IIncrementAccountNumber): number {
	const parsed: number[] = [];

	while (siblingFolders.hasNext()) {
		const currentFolder = siblingFolders.next();
		const currentFolderName = currentFolder.getName();

		let parsedAccounts = currentFolderName.match(/^[0-9]+/); //  Parse continuous string of numbers from beginning

		if (parsedAccounts) {
			//	Regex array!
			let prefixedAccountNumberParsed: string = parsedAccounts.shift();
			parsed.push(+prefixedAccountNumberParsed);
		}
	}

	if (globalMaxAccountNumberCount) parsed.push(globalMaxAccountNumberCount); //	Important to include from earlier searches...although this will yield the same account number for two accounts with no numbers!!!
	parsed.sort((a, b) => a - b);
	if (parsed.length) return parsed.pop() + 1;
	else return 0;
}
