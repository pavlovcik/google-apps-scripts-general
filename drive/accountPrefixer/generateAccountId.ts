
export default function generateAccountID(
    folder: GoogleAppsScript.Drive.Folder,
    siblingFolders: GoogleAppsScript.Drive.FolderIterator,
    RENAME_PERMISSIONS_ENABLED: boolean,
    DELIMITER_AFTER_KEY: string,
    DELIMITER_IN_KEY: string,
    FANCY_ACCOUNT_NAMES: boolean,
): string {

    const folderName = folder.getName();
    console.log(`Generating account ID for '${folderName}'`);

    const accountName = folderName;
    const shortEnoughToSkip = folderName.length <= 4;
    let shorthandAccountName: string;

    if (!shortEnoughToSkip) {
        const capsOnly = extractCaps(accountName);

        if (capsOnly.length <= 1) {
            shorthandAccountName = disemvowelIfLessThan(accountName, 4);
        } else {
            shorthandAccountName = capsOnly;
        }

        // console.log({ shorthandAccountName });

        if (shorthandAccountName.length >= 5) {
            // console.log(`before truncation: ` + shorthandAccountName);
            shorthandAccountName = truncate(shorthandAccountName);
        }
    } else shorthandAccountName = folderName;

    const highestAccountNumber = incrementAccountNumber(siblingFolders);
    const paddedNumber = pad(highestAccountNumber, 4);

    const RENDER = FANCY_ACCOUNT_NAMES
        ? paddedNumber + DELIMITER_IN_KEY + shorthandAccountName.toUpperCase()
        : paddedNumber;

    console.log(`Rendered account ID: ${RENDER}`);
    console.log(`

    paddedNumber: '${paddedNumber}';
    DELIMITER_AFTER_KEY: '${DELIMITER_AFTER_KEY}';
    folderName: '${folderName}'

    `);

    console.log(`The folder to be renamed is '${folder}' because it lacks an account ID.`);
    if (RENAME_PERMISSIONS_ENABLED) {
        folder.setName(paddedNumber + DELIMITER_AFTER_KEY + folderName);
    }

    return RENDER;

	/**
	 * @param {number} a the number to convert
	 * @param {number} b number of resulting characters
	 */
    function pad(a: number, b: number) {
        return (1e15 + a + ``).slice(-b);
    }

	/**
	 * @param {String} str
	 * @param {number} lessThan
	 */
    function disemvowelIfLessThan(str: string, lessThan: number): string {
        if (str.length < lessThan) return str;
        const regex = /[aeiou\s]/g;
        const strDead = str.replace(regex, ``);

        const firstLetterIsVowel = regex.test(str.charAt(0));
        if (firstLetterIsVowel) return str.charAt(0) + strDead;

        return strDead;
    }

	/**
	 * @param {GoogleAppsScript.Drive.FolderIterator} siblingFolders
	 */
    function incrementAccountNumber(
        siblingFolders: GoogleAppsScript.Drive.FolderIterator
    ) {
        const parsed = [];

        let buffer = JSON.stringify(siblingFolders);

        while (siblingFolders.hasNext()) {
            const siblingFolder = siblingFolders.next();
            const siblingFolderName = siblingFolder.getName();
            let patternFound = siblingFolderName.match(/^\d+?\D/g);

            if (patternFound) {
                let prefixedAccountNumberParsedString: string = patternFound.shift();
                parsed.push(+(prefixedAccountNumberParsedString));

                console.log(`

                "parsed1-raw": ${prefixedAccountNumberParsedString};
                "parsed2-integer": ${+(prefixedAccountNumberParsedString)};
                "parsed3-buffer": ${JSON.stringify(parsed)};
                Folder Name: '${siblingFolderName}';
`);
            }
        }

        parsed.sort(function sortNumber(a, b) {
            return a - b;
        });

        if (parsed.length) return parsed.pop() + 1;
        else return 0;
    }

	/**
	 * @param {string} string
	 */
    function truncate(string: string) {
        const length = string.length;

        if (length >= 5) {
            // console.log({ preTruncated: string });
            const truncated =
                string.slice(0, length - 2) + string.slice(length - 1, string.length);
            // console.log({ truncated });

            return truncate(truncated);
        } else {
            // console.log({ caps: string });

            return string;
        }
    }

	/**
	 * @param {String} input
	 */
    function extractCaps(input: string) {
        const firstLetter = input.charAt(0);
        const notCapitalized = firstLetterIsNotCapitalized(firstLetter);
        const caps = input.match(/[A-Z]/gm);

        let extracted: string;
        if (caps) {
            extracted = caps.join().replace(/,/gim, ``);

            if (notCapitalized) {
                extracted = firstLetter.toUpperCase().concat(extracted);
            }

            // console.log(caps);

            if (extracted.length >= 1) return extracted;
        }
        return ``;
    }

	/**
	 * @param {string} firstLetter
	 */
    function firstLetterIsNotCapitalized(firstLetter: string) {
        let notCapitalized: boolean;
        if (firstLetter == firstLetter.toLowerCase()) {
            // The character is lowercase
            notCapitalized = true;
        } else {
            // The character is uppercase
            notCapitalized = false;
        }
        return notCapitalized;
    }
}
