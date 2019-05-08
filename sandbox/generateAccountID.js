// var otherFolderNames = [
//     "0000 Unofficial",
//     "0071 Sandblock",
//     "0072 Adara",
//     "0073 Lockholm Ventures",
//     "0074 Well",
//     "0075 Lancellot",
//     "0076 ICOBackers",
//     "0077 Universal Coin International",
//     "0078 Distributed Business Accelerator",
//     "0079 Renegade Studios",
//     "0080 CitizenChain"
// ];

// var testAccountNames = [
//     "Inventum Digital",
//     "Inventum Bioengineering Technologies",
//     "Box Coin",
//     "CINDX",
//     "Equiti",
//     "GoGo Live",
//     "Hongbao",
//     "Host.Games",
//     "INNIT",
//     "Like Protocol",
//     "MeFy",
//     "Mentor Global Consultants",
//     "Nabu Token",
//     "Paragon",
//     "ProQ",
//     "Qiibee",
//     "Secova",
//     "Terra Virtua",
//     "TMMG",
//     "TontineTrust",
//     "Zangll",
//     "Unofficial",
//     "Sandblock",
//     "Adara",
//     "Lockholm Ventures",
//     "Well",
//     "Lancellot",
//     "ICOBackers",
//     "Universal Coin International",
//     "Distributed Business Accelerator",
//     "Renegade Studios",
//     "CitizenChain",
//     "Akira",
//     "MonkeyBars",
//     "TGProductions Website",
//     "Bar1 Wordpress",
//     "MonkeyBars",
//     "TGProductions",
//     "MonkeyBars Website",
//     "Whitelabel SaaS",
//     "Tour & Smile",
//     "MonkeyBars BCBS",
//     "401K Rewards",
//     "RevenueNOW",
//     "BlackTieTuxes",
//     "Devvela",
//     "Big Wig",
//     "Menoni And Mecogni",
//     "JustGreatTickets",
//     "EnterLuck",
//     "Celeste, Marketing",
//     "Celeste, Photo",
//     "Chimtek",
//     "KYB",
//     "Kickstarter",
//     "Meier Marketing",
//     "Elysia Root Cakes",
//     "Gearhead Workspace",
//     "Timber Pointe Golf",
//     "MAVA Style",
//     "Treasury Strategies Inc",
//     "Chi-Rogi",
//     "Specless",
//     "Denison",
//     "Exult Securities",
//     "Specless",
//     "Pink Hippo Productions, Cronus",
//     "Specless",
//     "Mission Measurement",
//     "Charu",
//     "Lion Expedited LLC",
//     "Bizi",
//     "Technori",
//     "Brandless",
//     "Braceunder",
//     "Jonathan Goldsmith",
//     "Airmap",
//     "Ibarra Group",
//     "Contractful",
//     "Ben Karbin",
//     "CNC Exchange",
//     "Goodbye Tomorrow",
//     "Starchup",
//     "Kryo Cloud",
//     "Allec Isaac REEM",
//     "AppointmentsIQ",
//     "Baxter",
//     "Binfer",
//     "BitPoint Network",
//     "blockSHIP",
//     "brisp.nl",
//     "Bruce Gaynes",
//     "debt buying ico",
//     "DHS Drug Route Calc",
//     "Digital Kitchen",
//     "Exceed Group",
//     "Gemstra",
//     "IDx",
//     "Jessica Lian",
//     "Kryo Mining",
//     "Loyola",
//     "Medium Rare",
//     "Moment",
//     "Neurensic",
//     "New Alchemy",
//     "OrbitUT",
//     "Quants.ONE",
//     "Ricoh",
//     "Sergey's Misc Projects",
//     "Shrey Sheth",
//     "The Battleground",
//     "Thresholds"
// ];

// var DELIMITER = "-";

// if (!process.argv[2] && testAccountNames.length) {
//     var x = testAccountNames.length;
//     while (x--) console.log("\t" + generateName(testAccountNames[x]) + "\t>\t" + testAccountNames[x]);
// } else {
//     console.log(generateName(process.argv[2]));
// }


/**
 * @param {string} input
 */
function generateName(input) {
    var accountName = input;

    var shortEnoughToSkip = (input.length <= 4);

    if (!shortEnoughToSkip) {

        var capsOnly = extractCaps(accountName);
        var shorthandAccountName;

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

    var highestAccountNumber = incrementAccountNumber(otherFolderNames);

    var paddedNumber = pad(highestAccountNumber, 4);

    return paddedNumber + DELIMITER + shorthandAccountName.toUpperCase();
    // return shorthandAccountName.toUpperCase() + DELIMITER + paddedNumber

	/**
	 * @param {number} a the number to convert
	 * @param {number} b number of resulting characters
	 */
    function pad(a, b) {
        return (1e15 + a + "").slice(-b);
    }

    /**
     * @param {String} str
     * @param {number} lessThan
     */
    function disemvowelIfLessThan(str, lessThan) {
        if (str.length < lessThan) return str
        var regex = /[aeiou\s]/g;
        var strDead = str.replace(regex, "");

        var firstLetterIsVowel = regex.test(str.charAt(0));
        if (firstLetterIsVowel) return str.charAt(0) + strDead;

        return strDead;
    }

	/**
	 * @param {string[]} folderNames
	 */
    function incrementAccountNumber(folderNames) {
        var parsed = [];
        // console.log(folderNames);
        var x = folderNames.length;
        while (x--) {
            var prefixedAccountNumber = folderNames[x].match(/^\d+?\D/gim);
            if (prefixedAccountNumber) parsed.push(parseInt(prefixedAccountNumber.shift()));
            // else console.error(prefixedAccountNumber);
        }
        parsed.sort(function sortNumber(a, b) {
            return a - b;
        });
        // console.log(parsed);
        return parsed.pop() + 1;
    }

	/**
	 * @param {string} string
	 */
    function truncate(string) {
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
    function extractCaps(input) {
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
    function firstLetterIsNotCapitalized(firstLetter) {
        if (firstLetter == firstLetter.toLowerCase()) {
            // The character is lowercase
            var notCapitalized = true;
        }
        else {
            // The character is uppercase
            var notCapitalized = false;
        }
        return notCapitalized;
    }

    // /**
    //  * @param {string} word
    //  */
    // function firstSyllable(word) {
        // var hints = syllables(word);
        // if (hints.length) {
            // var firstHint = hints.shift();
            // var secondHint = hints.shift();
            // return word.substring(0, word.indexOf(secondHint));
        // }
    // }
//
    // /**
    //  * @description Simple syllable count. Definitely not perfect, but its good enough for this usecase!
    //  * @param {String} word
    //  */
    // function syllables(word) {
//
        // word = word.toLowerCase();
        // if (word.length <= 3) { return 1; }
        // word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        // word = word.replace(/^y/, '');
        // return word.match(/[aeiouy]{1,2}/g);
    // }
}
