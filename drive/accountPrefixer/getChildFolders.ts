import renameChildFiles from "./renameChildFiles";
import generateAccountID from "./generateAccountID";

interface IGetChildFolders {
	rootFolder: GoogleAppsScript.Drive.Folder;
	registeredAccountID?: string;
	RFP: RegExp;
	RPE: boolean;
	DAK: string;
	DIK: string;
	FAN: boolean;
	globalMaxAccountNumberCount: number;
	OW: string;
	CW: string;
}

/**
 *
 * @description
 * @param rootFolder A current working directory to get account folders from.
 * @param registeredAccountID This is for subfolders under a parent folder with a recognized account ID.
 * @param RFP REGEX_FOR_PREFIX - Regular expression used to parse the account ID. This can be for either normal or fancy mode.
 * @param RPE RENAME_PERMISSIONS_ENABLED - Empowers the software to make persisting changes to disk (Drive).
 * @param DAK DELIMITER_AFTER_KEY - Character to separate the account ID and the account name.
 * @param DIK DELIMITER_IN_KEY - Character to separate the account number and the account shorthand name within the account ID.
 * @param FAN fancyAccountNames - Enables account shorthand name in account ID.
 * @param globalMaxAccountNumberCount Attempts to keep track of the highest account number counted.
 *
 * @export
 *
 * @param {IGetChildFolders} {
 * 	rootFolder,
 * 	registeredAccountID,
 * 	RFP,
 * 	RPE,
 * 	DAK,
 * 	DIK,
 * 	FAN,
 * 	globalMaxAccountNumberCount
 * }
 */
export default function getChildFolders({
	rootFolder,
	registeredAccountID,
	RFP,
	RPE,
	DAK,
	DIK,
	FAN,
	globalMaxAccountNumberCount,
	OW,
	CW
}: IGetChildFolders): void {
	const accountFolders = rootFolder.getFolders();
	const accountFoldersFreshIterator = rootFolder.getFolders(); //  Needs to be a fresh iterator for generating an account ID

	while (accountFolders.hasNext()) {
		const accountFolder = accountFolders.next();
		const folderName = accountFolder.getName();
		const matchesForAccountID = registeredAccountID
			? registeredAccountID.match(RFP)
			: folderName.match(RFP);

		if (matchesForAccountID && matchesForAccountID[0]) {
			var test = matchesForAccountID[0];
		}

		console.log(`

		RFP: ${RFP}
		matchesForAccountID[0]: ${test}
		registeredAccountID: ${registeredAccountID}
		`);

		addressAccountPrefix(matchesForAccountID, accountFolder);
	}

	function addressAccountPrefix(
		matchesForAccountID: RegExpMatchArray,
		accountFolder: GoogleAppsScript.Drive.Folder
	) {
		let accountID: string;
		if (matchesForAccountID) {
			//  Has an account ID in the parent folder
			accountID = matchesForAccountID.shift();
			accountID = accountID.slice(0, accountID.indexOf(DAK));
			console.log(`Has an account ID '${accountID}'  in the parent folder.`);
		} else {
			// Does not have an account ID
			console.log(
				`Does not have an account id... what is the value of registeredAccountID: ${registeredAccountID}`
			);
			accountID =
				registeredAccountID ||
				generateAccountID({
					accountFolder,
					accountFolders: accountFoldersFreshIterator,
					RPE,
					DAK,
					DIK,
					FAN,
					globalMaxAccountNumberCount,
					OW,
					CW
				});
		}
		const isNullAccount = new RegExp("0{4}" + DIK).test(accountID); //	"0{4}" four zeros, and before delimiter in key
		if (isNullAccount) {
			//  Do not rename child files if null account `0000`
			console.log(`Ignored because account number 0000.`);
		} else {
			renameChildFiles({
				accountFolder,
				accountID,
				REGEX_FOR_PREFIX: RFP,
				RENAME_PERMISSIONS_ENABLED: RPE,
				DELIMITER_AFTER_KEY: DAK,
				DELIMITER_IN_KEY: DIK,
				fancyAccountNames: FAN,
				globalMaxAccountNumberCount,
				OW,
				CW
			});
		}
	}
}
