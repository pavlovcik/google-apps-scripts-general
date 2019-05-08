import getChildFolders from "./getChildFolders";

/**
 * Renames child files recursively.
 * @param cwd Current Working Directory.
 * @param accountID Set account ID.
 * @param REGEX_FOR_PREFIX Recognized pattern for account IDs.
 * @param RENAME_PERMISSIONS_ENABLED Permissions to make persisting changes to Drive.
 * @param DELIMITER_AFTER_KEY What seperates the account ID with the account name.
 * @returns getChildFolders
 */
export default function renameChildFiles(
    cwd: GoogleAppsScript.Drive.Folder,
    accountID: string,
    REGEX_FOR_PREFIX: RegExp,
    RENAME_PERMISSIONS_ENABLED: boolean,
    DELIMITER_AFTER_KEY: string
) {

    const selectedFolderChildFiles = cwd.getFiles();

    while (selectedFolderChildFiles.hasNext()) {
        const childFile = selectedFolderChildFiles.next();
        const childFileName = childFile.getName();

        console.log({ childFileName });

        if (!REGEX_FOR_PREFIX.test(childFileName)) {    //  If the name of the FILE isn't prefixed.
            console.log(`The name of the file '${childFileName}' is NOT prefixed.`);
            try {   //  Requires permissions to rename.
                console.log(`Adding the prefix '${accountID}' to filename '${childFileName}'.`);
                if (RENAME_PERMISSIONS_ENABLED) {
                    childFile.setName(accountID + DELIMITER_AFTER_KEY + childFileName);
                }
            } catch (e) {
                console.error(`Can not rename ` + childFileName + e);
            }
        } else {
            const childFileName = childFile.getName();
            const accountName = childFileName.replace(REGEX_FOR_PREFIX, ``);
            const expectedName = accountID + DELIMITER_AFTER_KEY + accountName;
            console.log(`The name of the file '${childFileName}' is prefixed.`);

            if (childFileName != expectedName) {
                console.log(`But the prefix is incorrect.`);
                if (RENAME_PERMISSIONS_ENABLED) {
                    childFile.setName(expectedName);
                }
            } else {
                console.log(`The filename is OK and left as is.`);
            }

        }
    }

    return getChildFolders(
        cwd,
        accountID,
        REGEX_FOR_PREFIX,
        RENAME_PERMISSIONS_ENABLED,
        DELIMITER_AFTER_KEY
    );
}