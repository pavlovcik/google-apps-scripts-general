import getChildFolders from "./getChildFolders";

export interface IRenameChildFiles {
	accountFolder: GoogleAppsScript.Drive.Folder;
	accountID?: string;
	regexForAccountID: RegExp;
	writePermissionsEnabled: boolean;
	delimiterAfterID: string;
	delimiterInID: string;
	shorthandAccountNameSupport: boolean;
	minAccountNumber: number;
	openID?: string;
	closeID?: string;
	accountNumberLength: number;
}

/**
 * Renames files recursively
 *
 * @export
 * @param {IRenameChildFiles}
 */
export default function renameChildFiles({
	accountFolder,
	accountID,
	regexForAccountID,
	writePermissionsEnabled,
	delimiterAfterID,
	delimiterInID,
	shorthandAccountNameSupport,
	minAccountNumber,
	openID,
	closeID,
	accountNumberLength
}: IRenameChildFiles) {
	const selectedFolderChildFiles = accountFolder.getFiles();

	if (openID) openID = openID.replace(/\\/gim, "");
	//	Remove all character escapes because this keeps breaking.
	else openID = "";

	if (closeID) closeID = closeID.replace(/\\/gim, "");
	//	Remove all character escapes because this keeps breaking.
	else closeID = "";

	const idWithDelimiter = accountID + delimiterAfterID;

	console.log(`

		idWithDelimiter: '${idWithDelimiter}'
		accountID: '${accountID}'
		openID: '${openID}'
		closeID: '${closeID}'
`);

	renameChildFilesCORE(
		selectedFolderChildFiles,
		regexForAccountID,
		idWithDelimiter,
		writePermissionsEnabled
	);

	getChildFolders({
		rootFolder: accountFolder,
		registeredAccountID: accountID,
		regex: regexForAccountID,
		writePermissions: writePermissionsEnabled,
		afterID: delimiterAfterID,
		inID: delimiterInID,
		shorthandAccountNames: shorthandAccountNameSupport,
		minAccountNumber,
		openID,
		closeID,
		accountNumberLength
	});
}
function renameChildFilesCORE(
	siblingFiles: GoogleAppsScript.Drive.FileIterator,
	regexForAccountID: RegExp,
	idWithDelimiter: string,
	writePermissionsEnabled: boolean
) {
	while (siblingFiles.hasNext()) {
		const currentFile = siblingFiles.next();
		const currentFileName = currentFile.getName();

		if (!regexForAccountID.test(currentFileName)) {
			//  If the name of the FILE isn't prefixed.
			console.log(
				`The file to be renamed is '${currentFileName}' because it lacks a prefix.`
			);
			try {
				//  Requires permissions to rename.
				console.log(
					`Adding the prefix '${idWithDelimiter}' to filename '${currentFileName}'.`
				);
				if (writePermissionsEnabled) {
					currentFile.setName(idWithDelimiter + currentFileName);
				}
			} catch (e) {
				console.error(`Can not rename ` + currentFileName + e);
			}
		} else {
			// Filename is prefixed incorrectly

			const currentFileNameWithoutID = currentFileName.replace(
				regexForAccountID,
				``
			);
			const correctedName = idWithDelimiter + currentFileNameWithoutID;

			if (currentFileName != correctedName) {
				console.log(`

					The file to be renamed is '${currentFileName}' because it is incorrectly prefixed.
					The expected name is '${correctedName}'
					(idWithDelimiter: '${idWithDelimiter}'  + accountName: '${currentFileNameWithoutID}')
					`);

				if (writePermissionsEnabled) {
					currentFile.setName(correctedName);
				}
			} else {
				console.log(`The filename is OK of '${currentFileName}'.`);
			}
		}
	}
}
