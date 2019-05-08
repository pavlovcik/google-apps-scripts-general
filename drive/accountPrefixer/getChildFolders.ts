import renameChildFiles from "./renameChildFiles";
import generateAccountID from "./generateAccountID";

/**
 * Gets child folders, recursively.
 * @param cwd cwd A current working directory to get child folders of.
 * @param claimedByAccountID claimedByAccountID This is for subfolders under a parent folder with a recognized account ID.
 * @param REGEX_FOR_PREFIX
 * @param RENAME_PERMISSIONS_ENABLED
 * @param DELIMITER_AFTER_KEY
 * @param DELIMITER_IN_KEY
 * @param FANCY_ACCOUNT_NAMES
 */
export default function getChildFolders(
    cwd: GoogleAppsScript.Drive.Folder,
    claimedByAccountID: string,
    REGEX_FOR_PREFIX: RegExp,
    RENAME_PERMISSIONS_ENABLED: boolean,
    DELIMITER_AFTER_KEY: string,
    DELIMITER_IN_KEY: string,
    FANCY_ACCOUNT_NAMES: boolean
) {

    const childFolders = cwd.getFolders();

    while (childFolders.hasNext()) {
        const childFolder = childFolders.next();
        const childFolderName = childFolder.getName();

        // console.log({ childFolderName });

        const matchesForAccountID = claimedByAccountID
            ? claimedByAccountID.match(REGEX_FOR_PREFIX)
            : childFolderName.match(REGEX_FOR_PREFIX);

        // console.log({
        //     childFolderName,
        //     "regex": childFolderName.match(REGEX_FOR_PREFIX)
        //     // parsingAccountID,
        //     // claimedByAccountID,
        //     // REGEX_FOR_PREFIX
        // });

        let accountID: string;

        if (matchesForAccountID) { //  Has an account ID in the parent folder

            // console.log(`A match!`);

            accountID = matchesForAccountID.shift();
            const nullAccount = /^0000/.test(accountID);

            if (nullAccount) continue;  //  Ignore this account
            else renameChildFiles(
                childFolder,
                accountID,
                REGEX_FOR_PREFIX,
                RENAME_PERMISSIONS_ENABLED,
                DELIMITER_AFTER_KEY,
                DELIMITER_IN_KEY,
                FANCY_ACCOUNT_NAMES
            );

        } else {

            // console.log(`No match!`);

            accountID = generateAccountID(
                childFolderName,
                childFolders,
                DELIMITER_IN_KEY,
                FANCY_ACCOUNT_NAMES
            );

            renameChildFiles(
                childFolder,
                accountID,
                REGEX_FOR_PREFIX,
                RENAME_PERMISSIONS_ENABLED,
                DELIMITER_AFTER_KEY,
                DELIMITER_IN_KEY,
                FANCY_ACCOUNT_NAMES
            );

        }

    }
    // return childFolders
}