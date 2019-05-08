import renameChildFiles from "./renameChildFiles";

/**
 * Gets child folders, recursively.
 * @param cwd cwd A current working directory to get child folders of.
 * @param claimedByAccountID claimedByAccountID This is for subfolders under a parent folder with a recognized account ID.
 * @param REGEX_FOR_PREFIX
 * @param RENAME_PERMISSIONS_ENABLED
 * @param DELIMITER_AFTER_KEY
 * @returns {boolean}
 */
export default function getChildFolders(
    cwd: GoogleAppsScript.Drive.Folder,
    claimedByAccountID: string,
    REGEX_FOR_PREFIX: RegExp,
    RENAME_PERMISSIONS_ENABLED: boolean,
    DELIMITER_AFTER_KEY: string
): boolean {
    const childFolders = cwd.getFolders();
    while (childFolders.hasNext()) {
        const childFolder = childFolders.next();
        const childFolderName = childFolder.getName();

        console.log({ childFolderName });

        const parsingAccountID = claimedByAccountID
            ? claimedByAccountID.match(REGEX_FOR_PREFIX)
            : childFolderName.match(REGEX_FOR_PREFIX);

        let accountID: string;

        if (parsingAccountID) { //  Has an account ID in the parent folder
            accountID = parsingAccountID.shift();
            const nullAccount = /^0000/.test(accountID);
            if (nullAccount) continue;  //  Ignore this account
            else return renameChildFiles(
                childFolder,
                accountID,
                REGEX_FOR_PREFIX,
                RENAME_PERMISSIONS_ENABLED,
                DELIMITER_AFTER_KEY
            );
        }
    }
    return true
}