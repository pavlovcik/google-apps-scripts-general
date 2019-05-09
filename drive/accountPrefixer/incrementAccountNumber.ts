/**
 *
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
	// siblingFoldersCLONE: GoogleAppsScript.Drive.FolderIterator;
	// RFP: RegExp;
	// DAK: string;
	// DIK: string;
	// FAN: boolean;
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
}: // RFP,
// DAK,
// DIK,
// FAN
IIncrementAccountNumber): number {
	const parsed: number[] = [];
	// let siblingFolderNames: string[] = allSiblingFolderNames(siblingFoldersCLONE);

	while (siblingFolders.hasNext()) {
		const currentFolder = siblingFolders.next();
		const currentFolderName = currentFolder.getName();

		// console.log(`

		// Checking sibling folder names...
		// siblingFolders: ${JSON.stringify(siblingFolderNames)}
		// `);

		let parsedAccounts = currentFolderName.match(/^[0-9]+/); //  Parse continuous string of numbers from beginning

		// console.log(`

		//     siblingFolderName: ${siblingFolderName}
		//     parsedPrefix: ${parsedPrefix}
		//     parsed: ${parsed}
		//     `);

		if (parsedAccounts) {
			//	Regex array!
			let prefixedAccountNumberParsed: string = parsedAccounts.shift();
			parsed.push(+prefixedAccountNumberParsed);

			// 			console.log(`

			//                 "parsed1-raw": ${prefixedAccountNumberParsedString};
			//                 "parsed2-integer": ${+prefixedAccountNumberParsedString};
			//                 "parsed3-buffer": ${JSON.stringify(parsed)};
			//                 Folder Name: '${siblingFolderName}';

			// `);
		} else {
			//	No account number found!
		}
	}

	if (globalMaxAccountNumberCount) parsed.push(globalMaxAccountNumberCount); //	Important to include from earlier searches...although this will yield the same account number for two accounts with no numbers!!!
	parsed.sort((a, b) => a - b);
	if (parsed.length) return parsed.pop() + 1;
	else return 0;

	// /**
	//  * Lists the sibling folder names.
	//  * @TODO: remove
	//  *
	//  * @returns {string[]} Array of folder names.
	//  */
	// function allSiblingFolderNames(
	// 	sfca: GoogleAppsScript.Drive.FolderIterator
	// ): string[] {
	// 	let buffer = [];
	// 	while (sfca.hasNext()) {
	// 		const sfc = siblingFoldersCLONE.next();
	// 		const sfcn = sfc.getName();
	// 		if (sfcn && sfcn.length) buffer.push(sfcn);
	// 		else buffer.push(null);
	// 	}
	// 	return buffer;
	// }
}
