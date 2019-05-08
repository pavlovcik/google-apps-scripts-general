import renameChildFiles from "./renameChildFiles";
import generateAccountID from "./generateAccountID";

/**
 * Gets child folders, recursively.
 * @param cwd A current working directory to get child folders of.
 * @param claimedByAccountID This is for subfolders under a parent folder with a recognized account ID.
 * @param rfp REGEX_FOR_PREFIX
 * @param rpe RENAME_PERMISSIONS_ENABLED
 * @param dak DELIMITER_AFTER_KEY
 * @param dik DELIMITER_IN_KEY
 * @param fan FANCY_ACCOUNT_NAMES
 */
export default function getChildFolders(
    cwd: GoogleAppsScript.Drive.Folder,
    claimedByAccountID: string,
    rfp: RegExp,
    rpe: boolean,
    dak: string,
    dik: string,
    fan: boolean
) {
    const childFolders = cwd.getFolders();

    while (childFolders.hasNext()) {
        const childFolder = childFolders.next();
        const childFolderName = childFolder.getName();
        const matchesForAccountID = claimedByAccountID
            ? claimedByAccountID.match(rfp)
            : childFolderName.match(rfp);

        console.log(
            `Getting child folders of '${childFolderName}'. Owned by '${claimedByAccountID || childFolderName}'`
        );

        let accountID: string;

        if (matchesForAccountID) {
            //  Has an account ID in the parent folder

            accountID = matchesForAccountID.shift();
            console.log(`Has an account ID '${accountID}'  in the parent folder.`);

            const nullAccount = /^0000/.test(accountID);
            if (nullAccount) {
                //  Ignore this account
                console.log(`Ignored because account number 0000.`);
                continue;
            } else {

                // renameChildFiles(childFolder, accountID, rfp, rpe, dak, dik, fan);
            }

        } else {
            // Does not have an account ID
            console.log(`Does not have an account id... what is the value of claimedByAccountID: ${claimedByAccountID}`);
            accountID = claimedByAccountID || generateAccountID(childFolderName, childFolders, dik, fan);
        }

        console.log(`Renaming`);
        renameChildFiles(childFolder, accountID, rfp, rpe, dak, dik, fan);
    }


}
