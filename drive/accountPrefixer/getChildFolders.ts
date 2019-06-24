import renameChildFiles from "./renameChildFiles";
import generateAccountID from "./generateAccountID";
import { default as settings } from "./settings";

export interface IGetChildFolders {
	rootFolder: GoogleAppsScript.Drive.Folder;
	registeredAccountID?: string;
	regex: RegExp;
	writePermissions: boolean;
	afterID: string;
	inID: string;
	shorthandAccountNames: boolean;
	minAccountNumber: number;
	openID: string;
	closeID: string;
	accountNumberLength: number;
}

/**
 *
 * @description
 * @param rootFolder A current working directory to get account folders from.
 * @param registeredAccountID This is for subfolders under a parent folder with a recognized account ID.
 * @param regex regexForAccountID - Regular expression used to parse the account ID. This can be for either normal or fancy mode.
 * @param writePermissions writePermissionsEnabled - Empowers the software to make persisting changes to disk (Drive).
 * @param afterID delimiterAfterID - Character to separate the account ID and the account name.
 * @param inID delimiterInID - Character to separate the account number and the account shorthand name within the account ID.
 * @param shorthandAccountNames shorthandAccountNameSupport - Enables account shorthand name in account ID.
 * @param minAccountNumber Start the count at this number. Normally should be 0
 *
 * @export
 *
 * @param {IGetChildFolders} {
 * 	rootFolder,
 * 	registeredAccountID,
 * 	regex,
 * 	writePermissions,
 * 	afterID,
 * 	inID,
 * 	shorthandAccountNames,
 * 	minAccountNumber
 * }
 */
export default function getChildFolders({ rootFolder, registeredAccountID, regex, writePermissions, afterID, inID, shorthandAccountNames, minAccountNumber, openID, closeID, accountNumberLength }: IGetChildFolders): void {
	const accountFolders = rootFolder.getFolders();
	const accountFoldersFreshIterator = rootFolder.getFolders(); //  Needs to be a fresh iterator for generating an account ID

	while (accountFolders.hasNext()) {
		const accountFolder = accountFolders.next();
		const folderName = accountFolder.getName();
		const matchesForAccountID = registeredAccountID
			? registeredAccountID.match(regex)
			: folderName.match(regex);

		if (matchesForAccountID && matchesForAccountID[0]) {
			var test = matchesForAccountID[0];
		}

		console.log(`

		regex: ${regex}
		matchesForAccountID[0]: ${test}
		registeredAccountID: ${registeredAccountID}
		`);

		addressAccountPrefix(matchesForAccountID, accountFolder);
	}

	function addressAccountPrefix(matchesForAccountID: RegExpMatchArray, accountFolder: GoogleAppsScript.Drive.Folder) {
		let accountID: string;
		if (matchesForAccountID) {
			//  Has an account ID in the parent folder
			accountID = matchesForAccountID.shift();
			accountID = accountID.slice(0, accountID.indexOf(afterID));
			console.log(`Has an account ID '${accountID}'  in the parent folder.`);
		} else {
			// Does not have an account ID
			// console.log(
			// 	`Does not have an account id... what is the value of registeredAccountID: ${registeredAccountID}`
			// );
			accountID =
				registeredAccountID ||
				generateAccountID({ accountFolder, accountFolders: accountFoldersFreshIterator, writePermissions, afterID, inID, shorthandAccountNames, minAccountNumber, openID, closeID, accountNumberLength });
		}
		const isNullAccount = new RegExp(
			`0+?` +
				(shorthandAccountNameSupport ? inID : afterID)
		).test(accountID); //	"0{?}" variable zeros, and before delimiter in key or after key if not fancy mode

		if (isNullAccount) {
			//  Do not rename child files if null account `0000`
			console.log(`Ignored because account number signifies null e.g. "0000".`);
		} else {
			renameChildFiles({ accountFolder, accountID, regexForAccountID: regex, writePermissionsEnabled: writePermissions, delimiterAfterID: afterID, delimiterInID: inID, shorthandAccountNameSupport: shorthandAccountNames, minAccountNumber, openID, closeID, accountNumberLength });
		}
	}
}
