/**
 * @param {string} input
 * @param {GoogleAppsScript.Drive.FolderIterator} childFolders
 */
export default function generateAccountID(input: string, childFolders: GoogleAppsScript.Drive.FolderIterator) {
    console.log("generating account ID for " + input);

    var accountName = input;

    var shortEnoughToSkip = input.length <= 4;

    if (!shortEnoughToSkip) {
        var capsOnly = extractCaps(accountName);
        var shorthandAccountName: string;

        // console.log("length: " + capsOnly.length);

        if (capsOnly.length <= 1) {
            shorthandAccountName = disemvowelIfLessThan(accountName, 4);
        } else {
            shorthandAccountName = capsOnly;
        }

        // console.log({ shorthandAccountName });

        if (shorthandAccountName.length >= 5) {
            // console.log("before truncation: " + shorthandAccountName);
            shorthandAccountName = truncate(shorthandAccountName);
        }
    } else shorthandAccountName = input;

    var highestAccountNumber = incrementAccountNumber(childFolders);

    var paddedNumber = pad(highestAccountNumber, 4);

    return paddedNumber + DELIMITER_IN_KEY + shorthandAccountName.toUpperCase();

    // return shorthandAccountName.toUpperCase() + DELIMITER + paddedNumber

	/**
	 * @param {number} a the number to convert
	 * @param {number} b number of resulting characters
	 */
    function pad(a: number, b: number) {
        return (1e15 + a + "").slice(-b);
    }

	/**
	 * @param {String} str
	 * @param {number} lessThan
	 */
    function disemvowelIfLessThan(str: string, lessThan: number): string {
        if (str.length < lessThan) return str;
        var regex = /[aeiou\s]/g;
        var strDead = str.replace(regex, "");

        var firstLetterIsVowel = regex.test(str.charAt(0));
        if (firstLetterIsVowel) return str.charAt(0) + strDead;

        return strDead;
    }

	/**
	 * @param {GoogleAppsScript.Drive.FolderIterator} folderNames
	 */
    function incrementAccountNumber(folderNames: GoogleAppsScript.Drive.FolderIterator) {
        var parsed = [];
        // console.log(folderNames);
        // var x = folderNames.length;

        while (folderNames.hasNext()) {
            var childFolder = folderNames.next();
            var prefixedAccountNumber = childFolder.getName().match(/^\d+?\D/gim);
            if (prefixedAccountNumber) parsed.push(parseInt(prefixedAccountNumber.shift()));
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
        var length = string.length;

        if (length >= 5) {
            // console.log({ preTruncated: string });
            var truncated = string.slice(0, length - 2) + string.slice(length - 1, string.length);
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
        var firstLetter = input.charAt(0);
        var notCapitalized = firstLetterIsNotCapitalized(firstLetter);

        var caps = input.match(/[A-Z]/gm);

        if (caps) {
            var extracted = caps.join().replace(/,/gim, "");

            if (notCapitalized) {
                extracted = firstLetter.toUpperCase().concat(extracted);
            }

            // console.log(caps);

            if (extracted.length >= 1) return extracted;
        }
        return "";
    }

	/**
	 * @param {string} firstLetter
	 */
    function firstLetterIsNotCapitalized(firstLetter: string) {
        if (firstLetter == firstLetter.toLowerCase()) {
            // The character is lowercase
            var notCapitalized = true;
        } else {
            // The character is uppercase
            var notCapitalized = false;
        }
        return notCapitalized;
    }
}