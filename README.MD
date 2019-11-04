# Google Apps Scripts

## Steadfast Appropriator

This bot is designed to uniquely prefix all account related files with an ID that is easy to search globally. There are a few options for its behavior under the `settings.ts` object.

### Project Setup

```bash
npm run-script login # Be sure to login as the Steadfast Appropriator or else when invoked from CLI it will show personal account making the changes.

npm run-script watch # Automatically deploys and executes upon file changes.

npm run-script logs # Steams execution logs from Google Cloud
```

### Options of significance in `settings.ts`

```typescript
let openID = `\\[`; //	Wrapper symbol to denote ends of Account Identifier e.g. `[1234-ID] Inventum Digital`
let accountNumberLength = 4;
let delimiterInID = `-`; //	Only in shorthandAccountNames mode, what seperates the account number from account shorthand within the Account Identifier
let closeID = `\\]`;
let delimiterAfterID = ` `; //  Seperator between Account Identifier, and Account Name. e.g. `1234-ID Inventum Digital`

let shorthandAccountNameSupport = true;
let minAccountNumber = 0;
```

`shorthandAccountNameSupport` will generate the acronym-like ID (such as `TA` for `Test Account`)

`minAccountNumber` should be set to `0` as a failsafe to ignore renaming all the files should it not find another baseline account number in the folder, or if there are any unexpected scenarios.

### WARNINGS

It is important to handle it with care when starting out a new folder. Do not add multiple unprefixed files when starting a new directory. This is how one should start a new example directory, please note the numbers in the IDs, the letters don't matter:

+ `[000-ABC] Archive`
  + Has special ID prefix and suffix, "[", "]" AND numerical value of 0. It is ignored in processing, meaning, its files within will not be touched/renamed. The bot will compute the value of 0 in the folder name and ignore it and its contents.
+ `[080-DUM] Dummy Account`
  + The base account number for the incrementing logic. This can be an empty folder to serve as a placeholder for the first time use only. Now the bot knows that the next folder it should come across without a recognized prefix should have an numerical ID value of "081".
+ `Real Account`
  + Real account without a prefix. This will be turned into something like "[081-RA] Real Account".

It is designed to be constantly running and as a consequence will NOT properly handle two or more new and unprefixed accounts in the target directory. It will simply prefix any new folders beyond the first encountered with a numerical value of 0 and consequently ignore the contents within as a failsafe. It sucks when the bot does something wrong and renames all of your files into crazy mashed up prefixes! This failsafe mitigates these issues.

### TODO

Check when the folder was created and automatically numerically prefix correctly.
