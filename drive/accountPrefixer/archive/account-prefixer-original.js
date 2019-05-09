
var folders = {
  test: "1LDIkYDZGrb6tBi3vZYv3shkXvGK49W5b",
  personal: "1sEVOnqwKmYTZMeBsWXiNYFvbHYfGWvwQ",
  inventum: "0B3hiA5zCI0EDcEcxbnY0anMyLU0"
};

var folderId = folders.test;
var root_number = '';
var regex = new RegExp("^[0-9]{4}");

function getFolderTree(folderId, listAll) {
  var parentFolder = DriveApp.getFolderById(folderId);
  getChildFolders(parentFolder.getName(), parentFolder, listAll);
};

function getChildFolders(parentName, parent, listAll) {
  var childFolders = parent.getFolders();
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    var account_number = childFolder.getName().match(regex);

    if (account_number != null) {
      account_number = account_number.shift();
      if (account_number == '0000') continue;
      root_number = account_number;
    } else account_number = root_number

    var files = childFolder.getFiles();
    while (listAll & files.hasNext()) {
      var childFile = files.next();
      var file_name = childFile.getName();
      if (regex.test(file_name) && account_number == file_name.match(regex).shift()) {
        // Logger.log('Good2go!');
      } else if (!regex.test(file_name)) {
        // Logger.log('no digit prefix');
        try {
          childFile.setName(account_number + ' ' + file_name)
        } catch (e) {
          Logger.log('Can not rename ' + file_name);
        }
      } else {
        // Logger.log('wrong prefix');
        var working_name = file_name.replace(regex, '');
        childFile.setName(account_number + working_name);
      }
    }
    getChildFolders(parentName + "/" + childFolder.getName(), childFolder, listAll, account_number);
  }
};

function account_prefixer() {
  getFolderTree(folderId, true);
}