var api_url = 'http://web.queplanmadrid.es/api/';
var app_url  = 'http://www.queplanmadrid.es/';
var img_url = 'http://www.queplanmadrid.es/img/';
var thumb_url = 'http://web.queplanmadrid.es/helpers/timthumb.php?w=%width%&h=%height%&src=';

var ciudad_seleccionada=0;

/*
var api_url = 'http://lasterrazasdebecerril.es/services/app/api/';
var img_url = 'http://lasterrazasdebecerril.es/';
var thumb_url = 'http://lasterrazasdebecerril.es/services/app/api/helpers/timthumb.php?w=%width%&h=%height%&src=';
*/

var applicationLanguage = 'es';

var conectando = false;

var userData = null;

try {
    userData = (localStorage.getItem("user") !== null || localStorage.getItem("user") !== undefined) ? JSON.parse(localStorage.getItem("user")) : null;
}catch(error) {
    userData = null;
}


var TOKEN_PUSH_NOTIFICATION = 0;

try {
    TOKEN_PUSH_NOTIFICATION = (localStorage.getItem("push_token") !== null || localStorage.getItem("push_token") !== undefined) ? JSON.parse(localStorage.getItem("push_token")) : 0;;
} catch(error) {
    TOKEN_PUSH_NOTIFICATION = 0;
}

var DEVICE_UUID = (localStorage.getItem("uuid") !== null || localStorage.getItem("uuid") !== undefined) ? JSON.parse(localStorage.getItem("uuid")) : 0;

var offline_data = undefined;

try {
    offline_data = (localStorage.getItem("offline_data") !== null || localStorage.getItem("offline_data") !== undefined) ? JSON.parse(localStorage.getItem("offline_data")) : null;
    if(offline_data == null) {
        offline_data = undefined;
    }
} catch(error) {
    offline_data = undefined;
}

var fileSystem;

var isonline = false;




/************************************ GLOBAL VARIABLES *******************************************************/
var FB_LOGIN_SUCCESS = false;
var TW_LOGIN_SUCCESS = false;
var APP_INITIALIZED = false;
var COOKIE = '';
var REDIREC_TO = '';
var LATITUDE = 0;
var LONGITUDE = 0;
var PUSH_NOTIFICATION_REGISTER = '';
var PUSH_NOTIFICATION_TOKEN = 0;
var INTERVAL;
var LOGIN_INVITADO = false;
var CIUDAD_ID = 0; //NADA;

/* notificacion */
var HAVE_NOTIFICATION = false;
var TYPE_NOTIFICATION = '';
var EVENT = '';

//Twitter Codebird
var cb = new Codebird; // we will require this everywhere

//var consumer_key = 'pPrzITObRT4z0VoBAtag'; //YOUR Twitter CONSUMER_KEY
//var consumer_secret = '1L8V3qJwdDocLD653uYhgxU5TtIm45pdAhyE022EBLw'; //// YOUR Twitter CONSUMER_SECRET

var consumer_key = 'pPrzITObRT4z0VoBAtag'; //YOUR Twitter CONSUMER_KEY
var consumer_secret = '1L8V3qJwdDocLD653uYhgxU5TtIm45pdAhyE022EBLw'; //// YOUR Twitter CONSUMER_SECRET



$(document).ready(function() {
    document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
});
