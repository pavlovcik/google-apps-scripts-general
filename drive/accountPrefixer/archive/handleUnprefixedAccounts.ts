import generateAccountID from "./generateAccountID";

/**
 * @param {string} folderId
 * @param {RegExp} regexForAccountID
 */
export default function handleUnprefixedAccounts(
    folderId: string,
    regexForAccountID: RegExp,
    writePermissionsEnabled: boolean,
    delimiterAfterID: string,
    delimiterInID: string,
    shorthandAccountNameSupport: boolean
) {
    const watchDirectory = DriveApp.getFolderById(folderId);
    const childFolders = watchDirectory.getFolders();

    while (childFolders.hasNext()) {
        const childFolder = childFolders.next();
        const childFolderName = childFolder.getName();
        const parsingAccountID = childFolderName.match(regexForAccountID);

        if (!parsingAccountID) {
            // Means that there's no name for the parent folder ... time to generate one?
            const accountID = generateAccountID(
                childFolder,
                childFolders,
                regexForAccountID,
                writePermissionsEnabled,
                delimiterAfterID,
                delimiterInID,
                shorthandAccountNameSupport,
                void 0
            );
            console.log(`GENERATED ACCOUNT ID: ${accountID}`);
            if (writePermissionsEnabled) childFolder.setName(accountID + delimiterAfterID + childFolder.getName());
        }
    }
}