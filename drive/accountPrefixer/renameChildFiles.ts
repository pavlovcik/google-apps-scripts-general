import getChildFolders from "./getChildFolders";

interface IRenameChildFiles {
	accountFolder: GoogleAppsScript.Drive.Folder;
	accountID: string;
	REGEX_FOR_PREFIX: RegExp;
	RENAME_PERMISSIONS_ENABLED: boolean;
	DELIMITER_AFTER_KEY: string;
	DELIMITER_IN_KEY: string;
	fancyAccountNames: boolean;
	globalMaxAccountNumberCount: number;
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
	REGEX_FOR_PREFIX,
	RENAME_PERMISSIONS_ENABLED,
	DELIMITER_AFTER_KEY,
	DELIMITER_IN_KEY,
	fancyAccountNames,
	globalMaxAccountNumberCount
}: IRenameChildFiles) {
	const selectedFolderChildFiles = accountFolder.getFiles();
	const idWithDelimiter = accountID + DELIMITER_AFTER_KEY;

	while (selectedFolderChildFiles.hasNext()) {
		const childFile = selectedFolderChildFiles.next();
		const childFileName = childFile.getName();

		if (!REGEX_FOR_PREFIX.test(childFileName)) {
			//  If the name of the FILE isn't prefixed.
			console.log(
				`The file to be renamed is '${childFileName}' because it lacks a prefix.`
			);
			try {
				//  Requires permissions to rename.
				console.log(
					`Adding the prefix '${idWithDelimiter}' to filename '${childFileName}'.`
				);
				if (RENAME_PERMISSIONS_ENABLED) {
					childFile.setName(idWithDelimiter + childFileName);
				}
			} catch (e) {
				console.error(`Can not rename ` + childFileName + e);
			}
		} else {
			const accountFolderName = childFileName.replace(REGEX_FOR_PREFIX, ``);
			const expectedName = idWithDelimiter + accountFolderName;

			if (childFileName != expectedName) {
				console.log(`

					The file to be renamed is '${childFileName}' because it is incorrectly prefixed.
					The expected name is '${expectedName}'
					(idWithDelimiter: '${idWithDelimiter}'  + accountName: '${accountFolderName}')
					`);
				if (RENAME_PERMISSIONS_ENABLED) {
					childFile.setName(expectedName);
				}
			} else {
				console.log(`The filename is OK of '${childFileName}'.`);
			}
		}
	}

	getChildFolders({
		rootFolder: accountFolder,
		registeredAccountID: accountID,
		RFP: REGEX_FOR_PREFIX,
		RPE: RENAME_PERMISSIONS_ENABLED,
		DAK: DELIMITER_AFTER_KEY,
		DIK: DELIMITER_IN_KEY,
		FAN: fancyAccountNames,
		globalMaxAccountNumberCount: globalMaxAccountNumberCount
	});
}
