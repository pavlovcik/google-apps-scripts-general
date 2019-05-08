import generateAccountID from "./generateAccountID";

/**
 * @param {string} folderId
 * @param {RegExp} REGEX_FOR_PREFIX
 */
export default function handleUnprefixedAccounts(
    folderId: string,
    REGEX_FOR_PREFIX: RegExp,
    RENAME_PERMISSIONS_ENABLED: boolean,
    DELIMITER_AFTER_KEY: string
) {
    var watchDirectory = DriveApp.getFolderById(folderId);
    var childFolders = watchDirectory.getFolders();

    while (childFolders.hasNext()) {
        var childFolder = childFolders.next();
        var childFolderName = childFolder.getName();
        var parsingAccountID = childFolderName.match(REGEX_FOR_PREFIX);

        if (!parsingAccountID) {
            // Means that there's no name for the parent folder ... time to generate one?
            var accountID = generateAccountID(childFolder.getName(), childFolders);
            console.log("GENERATED ACCOUNT ID: " + accountID);
            if (RENAME_PERMISSIONS_ENABLED) childFolder.setName(accountID + DELIMITER_AFTER_KEY + childFolder.getName());
        }
    }
}