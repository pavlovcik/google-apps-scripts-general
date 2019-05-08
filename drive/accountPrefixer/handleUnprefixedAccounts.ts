import generateAccountID from "./generateAccountID";

/**
 * @param {string} folderId
 * @param {RegExp} REGEX_FOR_PREFIX
 */
export default function handleUnprefixedAccounts(
    folderId: string,
    REGEX_FOR_PREFIX: RegExp,
    RENAME_PERMISSIONS_ENABLED: boolean,
    DELIMITER_AFTER_KEY: string,
    DELIMITER_IN_KEY: string,
    FANCY_ACCOUNT_NAMES: boolean
) {
    const watchDirectory = DriveApp.getFolderById(folderId);
    const childFolders = watchDirectory.getFolders();

    while (childFolders.hasNext()) {
        const childFolder = childFolders.next();
        const childFolderName = childFolder.getName();
        const parsingAccountID = childFolderName.match(REGEX_FOR_PREFIX);

        if (!parsingAccountID) {
            // Means that there's no name for the parent folder ... time to generate one?
            const accountID = generateAccountID(
                childFolder.getName(),
                childFolders,
                DELIMITER_IN_KEY,
                FANCY_ACCOUNT_NAMES
            );
            console.log(`GENERATED ACCOUNT ID: ${accountID}`);
            if (RENAME_PERMISSIONS_ENABLED) childFolder.setName(accountID + DELIMITER_AFTER_KEY + childFolder.getName());
        }
    }
}