String.prototype.replaceAll = function (t, r) {
    o = this;
    c = true;
    if (c == 1) {
        cs = "g"
    } else {
        cs = "gi"
    }
    var mp = new RegExp(t, cs);
    ns = o.replace(mp, r);
    return ns;
}

function initFiles() {

    try {

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    } catch (error) {
    }
}

function read(path, success) {
    console.log('reading ' + path);
    fileSystem.root.getFile(path, {create: true, exclusive: false}, function (entry) {
        var file = {entry: entry};
        file.entry.file(function (dbFile) {
            var dbEntries = [];
            var reader = new FileReader();
            reader.onloadend = function (evt) {
                var textArray = evt.target.result.split("\n");

                dbEntries = textArray.concat(dbEntries);

                success(dbEntries.join());
            }
            reader.readAsText(dbFile);
        }, fail);
    }, fail);
}

function write(path, content) {
    fileSystem.root.getFile(path, {create: true, exclusive: false}, function (entry) {
        var file = {entry: entry};
        file.entry.createWriter(function (writer) {
            writer.onwrite = function (evt) {
                console.log('writed ' + path);
            };

            writer.write(content);
        }, fail);
    }, fail);
}


function convertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image;
    //img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);

        var filename = url.split("/")[url.split("/").length - 1];

        var dataURL = canvas.toDataURL(outputFormat || 'image/' + filename.split('.')[filename.split('.').length - 1]);
        callback.call(this, dataURL, img, url);
        // Clean up
        canvas = null;
    };
    img.src = url;
}

function storeImages(data) {

    if (data !== undefined) {

        for (var i in data) {

            var section = data[i];

            if (section && section.length > 0) {

                for (var k in section) {

                    var section_row = section[k];

                    if (section_row.images) {

                        for (var j in section_row.images) {
                            var url = section_row.images[j];

                            convertImgToBase64(url, function (content, img, url2) {

                                var filename = url2.split("/")[url2.split("/").length - 1];

                                write(filename, content);

                            });

                            continue;
                        }
                    }
                }
            }

        }
    }
}

function gotFS(fs) {

    fileSystem = fs;
}

function fail() {

}

function readText() {
    if (file.entry) {
        file.entry.file(function (dbFile) {
            var reader = new FileReader();
            reader.onloadend = function (evt) {
                var textArray = evt.target.result.split("\n");

                dbEntries = textArray.concat(dbEntries);

                $('definitions').innerHTML = dbEntries.join('');
            }
            reader.readAsText(dbFile);
        }, failCB("FileReader"));
    }

    return false;
}

window.fadeIn = function (obj, index) {

    $(obj).parent().css('background-image', "url('" + $(obj).attr('src') + "')");
    $(obj).parent().css('background-size', "auto 100%");

    $(obj).parent().find('*').remove();

    imageLoaded(index);
};

window.onfailImage = function (element) {

    var url2 = $(element).attr('src');

    var filename = url2.split("/")[url2.split("/").length - 1];

    read(filename, function (content) {

        var extension = 'image/' + filename.split('.')[filename.split('.').length - 1];

        $(element).attr('src', "data:image/" + extension + ";base64," + content);

    });
};


function downloadFile() {

    fileSystem.root.getFile(
        "dummy.html", {create: true, exclusive: false},
        function gotFileEntry(fileEntry) {
            var sPath = fileEntry.fullPath.replace("dummy.html", "");
            var fileTransfer = new FileTransfer();
            fileEntry.remove();
            fileTransfer.download(
                "http://www.w3.org/2011/web-apps-ws/papers/Nitobi.pdf",
                sPath + "theFile.pdf",
                function (theFile) {
                    console.log("download complete: " + theFile.toURI());
                    showLink(theFile.toURI());
                },
                function (error) {
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("upload error code: " + error.code);
                }
            );
        },
        fail);
}