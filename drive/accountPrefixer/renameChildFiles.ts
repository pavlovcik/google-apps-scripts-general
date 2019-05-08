import getChildFolders from "./getChildFolders";

/**
 * Renames child files recursively.
 * @param cwd Current Working Directory.
 * @param accountID Set account ID.
 * @param REGEX_FOR_PREFIX Recognized pattern for account IDs.
 * @param RENAME_PERMISSIONS_ENABLED Permissions to make persisting changes to Drive.
 * @param DELIMITER_AFTER_KEY What seperates the account ID with the account name.
 * @param DELIMITER_IN_KEY
 * @param FANCY_ACCOUNT_NAMES
 */
export default function renameChildFiles(
    cwd: GoogleAppsScript.Drive.Folder,
    accountID: string,
    REGEX_FOR_PREFIX: RegExp,
    RENAME_PERMISSIONS_ENABLED: boolean,
    DELIMITER_AFTER_KEY: string,
    DELIMITER_IN_KEY: string,
    FANCY_ACCOUNT_NAMES: boolean
) {

    if (accountID) {
        console.log(`Account ID has been set for '${cwd.getName()}' (so name generation should not happen!)`);
    } else {
        console.log(`Account ID has NOT been set for '${cwd.getName()}' (so name generation should happen!)`);
    }
    // console.log(`Congrats for getting to the rename module!`);

    const selectedFolderChildFiles = cwd.getFiles();

    while (selectedFolderChildFiles.hasNext()) {
        const childFile = selectedFolderChildFiles.next();
        const childFileName = childFile.getName();


        const idWithDelimiter = accountID + DELIMITER_AFTER_KEY;

        if (!REGEX_FOR_PREFIX.test(childFileName)) {    //  If the name of the FILE isn't prefixed.
            console.log(`The file to be renamed is '${childFileName}' because it lacks a prefix.`);
            try {   //  Requires permissions to rename.
                console.log(`Adding the prefix '${idWithDelimiter}' to filename '${childFileName}'.`);
                if (RENAME_PERMISSIONS_ENABLED) {
                    childFile.setName(idWithDelimiter + childFileName);
                }
            } catch (e) {
                console.error(`Can not rename ` + childFileName + e);
            }
        } else {
            const childFileName = childFile.getName();
            const accountName = childFileName.replace(REGEX_FOR_PREFIX, ``);
            const expectedName = idWithDelimiter + accountName;

            if (childFileName != expectedName) {
                console.log(`The file to be renamed is '${childFileName}' because it is incorrectly prefixed.`);
                if (RENAME_PERMISSIONS_ENABLED) {
                    childFile.setName(expectedName);
                }
            } else {
                console.log(`The filename is OK of '${childFileName}'.`);
            }

        }
    }

    getChildFolders(
        cwd,
        accountID,
        REGEX_FOR_PREFIX,
        RENAME_PERMISSIONS_ENABLED,
        DELIMITER_AFTER_KEY,
        DELIMITER_IN_KEY,
        FANCY_ACCOUNT_NAMES
    );

}