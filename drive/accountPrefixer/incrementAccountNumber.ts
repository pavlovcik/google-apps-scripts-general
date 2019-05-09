export interface IIncrementAccountNumber {
	siblingFolders: GoogleAppsScript.Drive.FolderIterator;
	minAccountNumber: number;
}

/**
 * Increments account numbers based on the highest account number in the root directory.
 * This will return a 0 if no value was derived.
 *
 * @param {IIncrementAccountNumber} { siblingFolders, siblingFoldersCLONE, regex, afterID, inID, shorthandAccountNames }
 * @returns {number} The highest account number in without padded zeros e.g. <number>80 for <string>"0080"
 */
export default function incrementAccountNumber({
	siblingFolders,
	minAccountNumber
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

	if (minAccountNumber) parsed.push(minAccountNumber); //	Important to include from earlier searches...although this will yield the same account number for two accounts with no numbers!!!
	parsed.sort((a, b) => a - b);
	if (parsed.length) return parsed.pop() + 1;
	else return 0;
}
