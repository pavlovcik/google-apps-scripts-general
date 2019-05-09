import renameChildFiles from "./renameChildFiles";
import generateAccountID from "./generateAccountID";

/**
 * Gets child folders, recursively.
 * @param rootFolder A current working directory to get account folders from.
 * @param registeredAccountID This is for subfolders under a parent folder with a recognized account ID.
 * @param RFP REGEX_FOR_PREFIX - Regular expression used to parse the account ID. This can be for either normal or fancy mode.
 * @param RPE RENAME_PERMISSIONS_ENABLED - Empowers the software to make persisting changes to disk (Drive).
 * @param DAK DELIMITER_AFTER_KEY - Character to separate the account ID and the account name.
 * @param DIK DELIMITER_IN_KEY - Character to separate the account number and the account shorthand name within the account ID.
 * @param FAN fancyAccountNames - Enables account shorthand name in account ID.
 *
 * @returns {void}
 */
export default function getChildFolders(
	rootFolder: GoogleAppsScript.Drive.Folder,
	registeredAccountID: string,
	RFP: RegExp,
	RPE: boolean,
	DAK: string,
	DIK: string,
	FAN: boolean,
	globalMaxAccountNumberCount: number
): void {
	const accountFolders = rootFolder.getFolders();
	const accountFoldersFreshIterator = rootFolder.getFolders(); //  Needs to be a fresh iterator for generating an account ID
	// const accountFoldersFreshIterator2 = rootFolder.getFolders(); //  This is getting ridiculous.

	while (accountFolders.hasNext()) {
		const accountFolder = accountFolders.next();
		const folderName = accountFolder.getName();

		const matchesForAccountID = registeredAccountID
			? registeredAccountID.match(RFP)
			: folderName.match(RFP);

		console.log(`

registeredAccountID: '${registeredAccountID}'
RFP: '${RFP}'
folderName: '${folderName}'
matchesForAccountID: '${matchesForAccountID}'
`);

		// console.log(`

		//     Getting child folders of '${folderName}'. Owned by '${registeredAccountID ||
		// 	folderName}'
		//     registeredAccountID: '${registeredAccountID}'
		//     folderName: '${folderName}'
		//     `);

		addressAccountPrefix(matchesForAccountID, accountFolder);
	}

	function addressAccountPrefix(
		matchesForAccountID: RegExpMatchArray,
		accountFolder: GoogleAppsScript.Drive.Folder
	) {
		let accountID: string;
		if (matchesForAccountID) {
			//  Has an account ID in the parent folder
			accountID = matchesForAccountID.shift(); //  Still includes delimiter after prefix!!!
			accountID = accountID.slice(0, accountID.indexOf(DAK)); //  delimiter after prefix it should be the first symbol of its kind at the beginning.
			console.log(`Has an account ID '${accountID}'  in the parent folder.`);
		} else {
			// Does not have an account ID
			console.log(
				`Does not have an account id... what is the value of registeredAccountID: ${registeredAccountID}`
			);
			accountID =
				registeredAccountID ||
				generateAccountID(
					accountFolder,
					accountFoldersFreshIterator,
					RFP,
					RPE,
					DAK,
					DIK,
					FAN,
					// accountFoldersFreshIterator2
					globalMaxAccountNumberCount
				);
		}
		const isNullAccount = /^0000/.test(accountID);
		if (isNullAccount) {
			//  Do not rename child files if null account `0000`
			console.log(`Ignored because account number 0000.`);
		} else {
			renameChildFiles(accountFolder, accountID, RFP, RPE, DAK, DIK, FAN, globalMaxAccountNumberCount);
		}
	}
}
