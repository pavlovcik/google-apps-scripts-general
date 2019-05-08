import renameChildFiles from "./renameChildFiles";
import generateAccountID from "./generateAccountID";

/**
 * Gets child folders, recursively.
 * @param rootFolder A current working directory to get account folders from.
 * @param claimedByAccountID This is for subfolders under a parent folder with a recognized account ID.
 * @param rfp REGEX_FOR_PREFIX
 * @param rpe RENAME_PERMISSIONS_ENABLED
 * @param dak DELIMITER_AFTER_KEY
 * @param dik DELIMITER_IN_KEY
 * @param fan FANCY_ACCOUNT_NAMES
 */
export default function getChildFolders(
    rootFolder: GoogleAppsScript.Drive.Folder,
    claimedByAccountID: string,
    rfp: RegExp,
    rpe: boolean,
    dak: string,
    dik: string,
    fan: boolean
) {
    const accountFolders = rootFolder.getFolders();
    const accountFoldersFreshIterator = rootFolder.getFolders(); //  Needs to be a fresh iterator for generating an account ID

    while (accountFolders.hasNext()) {
        const accountFolder = accountFolders.next();
        const accountFolderName = accountFolder.getName();
        const matchesForAccountID = claimedByAccountID
            ? claimedByAccountID.match(rfp)
            : accountFolderName.match(rfp);

        console.log(
            `
            Getting child folders of '${accountFolderName}'. Owned by '${claimedByAccountID || accountFolderName}'
            claimedByAccountID: '${claimedByAccountID}'
            accountFolderName: '${accountFolderName}'
            `
        );

        let accountID: string;

        if (matchesForAccountID) {  //  Has an account ID in the parent folder
            accountID = matchesForAccountID.shift();    //  Still includes delimiter after prefix!!!
            accountID = accountID.slice(0, accountID.indexOf(dak))  //  delimiter after prefix it should be the first symbol of its kind at the beginning.
            console.log(`Has an account ID '${accountID}'  in the parent folder.`);
        } else {
            // Does not have an account ID
            // console.log(`Does not have an account id... what is the value of claimedByAccountID: ${claimedByAccountID}`);
            accountID = claimedByAccountID || generateAccountID(accountFolder, accountFoldersFreshIterator, rpe, dak, dik, fan);
        }

        const isNullAccount = /^0000/.test(accountID);
        if (isNullAccount) { //  Do not rename child files if null account `0000`
            console.log(`Ignored because account number 0000.`);
        } else {
            renameChildFiles(accountFolder, accountID, rfp, rpe, dak, dik, fan);
        }
    }


}
