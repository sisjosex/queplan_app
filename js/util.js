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

function getLocationGPS(){
	navigator.geolocation.getCurrentPosition( 
        function(location){
            LATITUDE = location.coords.latitude;
            LONGITUDE = location.coords.longitude;
        }, 
        function(){
            //showAlert("No se puede obtener la localizacion", "Error", "Aceptar");
        }, {enableHighAccuracy:true} );
}

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var radlon1 = Math.PI * lon1/180
	var radlon2 = Math.PI * lon2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}


function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
    //window.cookie = name+"="+value+expires+";path=/";

    localStorage.setItem(name, value);
}

function readCookie(name) {
    /*var nameEQ = name + "=";
    var ca=0;
    if(localStorage)
        var ca = window.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;*/

    return localStorage.getItem(name);
}

function reWriteCookie(name,attr,value) {

    //var cookie_name = readCookie(name);
    var cookie_name = localStorage.getItem(name);

    var parseData = $.parseJSON(cookie_name);
    parseData[attr] = value;
    var stringify = JSON.stringify(parseData)

    //window.cookie = name+"="+stringify;

    localStorage.setItem(name, stringify);
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function formatDate(date){
    var format = date.split("-");
    return format[2]+"/"+format[1]+"/"+format[0];
}

function check_network() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    confirm('Connection type:\n ' + states[networkState]);
}

function showConfirm(message, title, callback) {
    navigator.notification.confirm(
         message, // message
         callback,            // callback to invoke with index of button pressed
         title,           // title
         'Aceptar,Cancelar'         // buttonLabels
    );
}

function showAlert(message, title, buttom, callback) {
    try {

        navigator.notification.alert(
            message,  // message
            callback,         // callback
            title,            // title
            buttom                  // buttonName
        );

    } catch(error) {

        alert(message, title, buttom, callback);
    }
}

function valEmail(valor){
    if(!/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$/.exec(valor)) {
        return false; 
    }else{
        return true; 
    } 
}

function htmlspecialchars_decode (string, quote_style) {
  // http://kevin.vanzonneveld.net
  // +   original by: Mirek Slugen
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Mateusz "loonquawl" Zalega
  // +      input by: ReverseSyntax
  // +      input by: Slawomir Kaniecki
  // +      input by: Scott Cariss
  // +      input by: Francois
  // +   bugfixed by: Onno Marsman
  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Ratheous
  // +      input by: Mailfaker (http://www.weedem.fr/)
  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
  // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
  // *     returns 1: '<p>this -> &quot;</p>'
  // *     example 2: htmlspecialchars_decode("&amp;quot;");
  // *     returns 2: '&quot;'
  var optTemp = 0,
    i = 0,
    noquotes = false;
  if (typeof quote_style === 'undefined') {
    quote_style = 2;
  }
  string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  };
  if (quote_style === 0) {
    noquotes = true;
  }
  if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
    quote_style = [].concat(quote_style);
    for (i = 0; i < quote_style.length; i++) {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[quote_style[i]] === 0) {
        noquotes = true;
      } else if (OPTS[quote_style[i]]) {
        optTemp = optTemp | OPTS[quote_style[i]];
      }
    }
    quote_style = optTemp;
  }
  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
    // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
  }
  if (!noquotes) {
    string = string.replace(/&quot;/g, '"');
  }
  // Put this in last place to avoid escape being double-decoded
  string = string.replace(/&amp;/g, '&');

  return string;
}

function getUrl(href) {
    var vars = [], hash;
    var hashes = href.slice(href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}



function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$( window ).on( "orientationchange", function( event ) {
    //callbackOrientationChange(event.orientation, $.mobile.activePage.attr('id'));
});




function getJsonP(url, callback_success, callback_error, data) {

    if(data === undefined) {
        data = {};
    }


    if(data.lang === undefined) {
        data.lang = applicationLanguage;
        data.lat1 = LATITUDE;
        data.lon1 = LONGITUDE;
        data.ciudad_id = ciudad_seleccionada;
    }

    modal.show();

    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType: 'JSONp',
        timeout: 30000,
        async:true,
        success: function(data) {

            modal.hide();

            callback_success(data);
        },
        error: function(data) {

            modal.hide();

            callback_error(data);
        }
    });
}


function getJsonPBackground(url, callback_success, callback_error, data) {

    if(data === undefined) {
        data = {};
    }


    if(data.lang === undefined) {
        data.lang = applicationLanguage;
    }

    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType: 'JSONp',
        timeout: 30000,
        async:true,
        success: function(data) {

            modal.hide();

            callback_success(data);
        },
        error: function(data) {

            modal.hide();

            callback_error(data);
        }
    });
}