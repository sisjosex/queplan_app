var module = ons.bootstrap();

angular.module('MyApp', []);

var calendar;

var currentDate = '';


var currentSession;

var selectedDate = '';
var current_page = '';
var current_seccion_id = '';

var applicationParams = '';

var currentSessionFromNotification = null;

window.onresize = function () {
    resizeCardCarousel();
};


//REALIZAMOS EL CHECK-IN
function checkIn(urlamigable) {
    //volvemos a recalcular la ubicacion 
    getLocationGPS();

    //verficamos que este logeado porque solo si lo esta podemos dejarle que haga check-in
    if (isLogin()) {
        var user = COOKIE;
        var me = user.id;

        getJsonP(api_url + 'checkIn/', function(data) {

            if (data) {

                if (data.status == 'success') {

                    var imagen = app_url + 'img/logo_oficial.png';

                    //re-escribimos la cookie con los puntos totales
                    reWriteCookie("user", "puntos_acumulados", data.total_puntos_acumulados);
                    reWriteCookie("user", "Puntos", data.puntos);

                    //mostramos el mensaje de success y al cerrar mostramos la pantalla de compartir
                    //que puede ser de facebook o twitter
                    navigator.notification.alert(
                        data.mensaje,           // message
                        function () {
                            if (user.registrado_mediante == "facebook") {

                                 /*setTimeout(function(){
                                 shareFacebookWallPost(data.subtitulo, data.descripcion, imagen);
                                 },500);*/

                            } else if (user.registrado_mediante == "twitter") {
                                /*setTimeout(function () {
                                    shareTwitterWallPost(data.subtitulo, data.descripcion, imagen);
                                }, 500);*/
                            }
                        },         // callback
                        "AQU\u00CD ESTOY!", // title
                        "Aceptar"               // buttonName
                    );

                } else {

                    showAlert(data.mensaje, "AQU\u00CD ESTOY NO DISPONIBLE", "Aceptar");
                }
            }

        }, function() {



        }, {

            usuario_id: me,
            urlamigable: urlamigable

        });

        $.getJSON(BASE_URL + 'checkIn/' + me + '/' + urlamigable, function (data) {

            if (data) {
                //ocultamos loading
                $.mobile.loading('hide');

                if (data.success) {
                    var imagen = BASE_URL_APP + 'img/logo_oficial.png';

                    //re-escribimos la cookie con los puntos totales
                    reWriteCookie("user", "puntos_acumulados", data.total_puntos_acumulados);
                    reWriteCookie("user", "Puntos", data.puntos);

                    //mostramos el mensaje de success y al cerrar mostramos la pantalla de compartir
                    //que puede ser de facebook o twitter
                    navigator.notification.alert(
                        data.mensaje,           // message
                        function () {
                            if (user.registrado_mediante == "facebook") {
                                /*
                                 setTimeout(function(){
                                 shareFacebookWallPost(data.subtitulo, data.descripcion, imagen);
                                 },500);
                                 */
                            } else if (user.registrado_mediante == "twitter") {
                                /*setTimeout(function () {
                                    shareTwitterWallPost(data.subtitulo, data.descripcion, imagen);
                                }, 500);*/
                            }
                        },         // callback
                        "AQU\u00CD ESTOY!", // title
                        "Aceptar"               // buttonName
                    );

                } else {
                    showAlert(data.mensaje, "AQU\u00CD ESTOY NO DISPONIBLE", "Aceptar");
                }
            }
        });

    } else if (LOGIN_INVITADO) {
        alertaInvitado();
    }
}


function registrar_datos(app_id, email, registrado_mediante, username, nombre, imagen, genero) {

    getJsonP(api_url + 'newRegistro/', function (data) {

        if (data.status == 'success') {

            var usuario = data.usuario;
            var usuario_id = usuario.id;

            //una vez creado guardamos en cookies su datos importantes
            createCookie("user", JSON.stringify(usuario), 365);

            //una vez registrado los datos, mandamos a la home
            mainnavigator.pushPage('ciudad.html');

        } else {

            showAlert('Ha ocurrido un error al momento de registrarse!, por favor intente de nuevo', 'Error', 'Aceptar');
        }

    }, function () {

        showAlert("error", 'registrar_datos', 'Aceptar');

    }, {
        u_app_id: app_id,
        u_email: email,
        u_login_con: registrado_mediante,
        u_username: username,
        u_nombre: nombre,
        u_imagen: imagen,
        u_genero: genero,
        d_plataforma: device.platform,
        d_version: device.version,
        d_uuid: device.uuid,
        d_name: device.name,
        u_token_notificacion: PUSH_NOTIFICATION_TOKEN,
        ciudad_id: ciudad_seleccionada
    });
}

function comprarRecompensa(local_id, recompensa_id) {

    if (current_page != 'comprar') {

        current_page = 'comprar';
        setTimeout(function(){current_page = '';}, 100);

        //verficamos que este logeado porque solo si lo esta podemos dejarle que haga la compra de la recompensa
        if (isLogin()) {
            var user = COOKIE;
            var me = user.id;

            //showLoadingCustom('Compra de recompensa, en progreso...');
            modal.show();

            getJsonP(api_url + 'comprarRecompensa/', function (data) {

                if (data) {

                    //ocultamos loading
                    //$.mobile.loading( 'hide' );

                    if (data.success) {
                        var imagen = BASE_URL_APP + 'img/logo_oficial.png';

                        //re-escribimos la cookie con los puntos restantes
                        reWriteCookie("user", "puntos_acumulados", data.total_puntos_restantes);
                        reWriteCookie("user", "Puntos", data.puntos);

                        showAlert(data.mensaje, "Compra Realizada!", "Aceptar", function () {

                            if (user.registrado_mediante == "facebook") {

                                /*setTimeout(function () {
                                    shareFacebookWallPost(data.subtitulo, data.descripcion, imagen);
                                }, 500);*/

                            } else if (user.registrado_mediante == "twitter") {
                                /*setTimeout(function () {
                                    shareTwitterWallPost(data.subtitulo, data.descripcion, imagen);
                                }, 500);*/
                            }
                        });

                    } else {
                        showAlert(data.mensaje, "Compra no disponible", "Aceptar");
                    }
                }

            }, function () {

            }, {usuario_id: me, local_id: local_id, recompensa_id: recompensa_id});

        } else if (LOGIN_INVITADO) {
            alertaInvitado();
        }

    }
}

function logout() {
    if (isLogin()) {
        navigator.notification.confirm(
            "Estas seguro que quieres salir?", // message
            function (buttonIndex) {
                //1:aceptar,2:cancelar
                if (buttonIndex == 1) {

                    var user = COOKIE;
                    var me = user.id;

                    getJsonP(api_url + 'logout/', function (data) {

                        if (data) {

                            //ocultamos loading
                            if (data.status == 'success') {

                                //logout de fb y tw
                                logoutFacebookConnect();

                                eraseCookie("user");
                                window.location.reload();

                            } else {

                                showAlert(data.mensaje, "Error", "Aceptar");
                            }
                        }
                    }, function () {

                    }, {usuario_id: me});
                }
            },            // callback to invoke with index of button pressed
            'Salir',           // title
            'Aceptar,Cancelar'         // buttonLabels
        );
    } else if (LOGIN_INVITADO) {
        alertaInvitado();
    }
}

function mobileCheckDistance() {
    //volvemos a recalcular la ubicacion 
    getLocationGPS();

    if (isLogin()) {
        var user = COOKIE;
        var app_id = user.app_id;

        getJsonPBackground(api_url + 'checkDistance/', function(data) {



        }, function() {

        }, {
            app_id: app_id,
            latitude: LATITUDE,
            longitude: LONGITUDE
        });
    }
}

//verificamos si hay notificaciones pendiente de mostrar
function verifyNotification() {
    //si tiene una notificacion pendiente la mostramos
    if (HAVE_NOTIFICATION) {
        setTimeout(function () {
            showNotification(EVENT, TYPE_NOTIFICATION);
        }, 800);
        HAVE_NOTIFICATION = false;
    }
}

//showNotification
function showNotification(event, type) {
    var message = type == "android" ? event.message : event.alert;
    var seccion = type == "android" ? event.payload.seccion : event.seccion;
    var seccion_id = type == "android" ? event.payload.seccion_id : event.seccion_id;

    navigator.notification.alert(
        message,
        function () {
            redirectToPage(seccion, seccion_id);
        },
        "Alert",
        "Aceptar"
    );
}

//redirectToPage
function redirectToPage(seccion, id) {
    var page = "";
    var options = {};
    var url = api_url;

    if (seccion == "local") {

        page = "guia.html"

        if (id == "") {

            current_page = '';

            goToGuia();

        } else {

            getJsonP(api_url + 'getLocales/', function (data) {

                if(data.status == 'success') {

                    mainnavigator.pushPage('local.html', {current_local: data.items});

                } else {

                    showAlert('No existe el local para mostrar', 'Mensaje', 'Aceptar');

                    current_page = '';
                }


            }, function () {
            }, {ciudad_id: ciudad_seleccionada, local_id: id});
        }
    } else if (seccion == "plan") {

        page = "planes.html";

        if (id == "") {

            goToPlanes();

        } else {

            getJsonP(api_url + 'getPlanes/', function (data) {

                if(data.status == 'success') {

                    mainnavigator.pushPage('plan.html', {current_plan: data.items});

                } else {

                    showAlert('No existe el plan para mostrar', 'Mensaje', 'Aceptar');
                }

            }, function () {
            }, {ciudad_id: ciudad_seleccionada, plan_id: id});

        }

    } else if (seccion == "recompensa") {

        page = "recompesas.html";

        if (id == "") {

            goToRecompensas();

        } else {

            getJsonP(api_url + 'getRecompensas/', function (data) {

                if(data.status == 'success') {

                    mainnavigator.pushPage('recompensa.html', {current_recompensa: data.items});

                } else {

                    showAlert('No existe el plan para mostrar', 'Mensaje', 'Aceptar');
                }

            }, function () {
            }, {ciudad_id: ciudad_seleccionada, recompensa_id: id});
        }

    } else if (seccion == "menu") {

        if (id == "") {

            gotoMenuDiario();

        } else {

            getJsonP(api_url + 'getMenuDiario/', function (data) {

                if(data.status == 'success') {

                    mainnavigator.pushPage('menu_detalle.html', {current_menu: data.items});

                } else {

                    showAlert('No existe el menu para mostrar', 'Mensaje', 'Aceptar');
                }

            }, function () {
            }, {ciudad_id: ciudad_seleccionada, menu_id: id});
        }

    } else if (seccion == "guia") {

        if (id == "") {

            goToGuia();

        } else {

            gotoLocalesFromId(id);
        }
    }

}

function loginInvitado() {
    if (current_page != 'ciudad.html') {

        current_page = 'ciudad.html';
        setTimeout(function(){current_page = '';}, 100);

        LOGIN_INVITADO = true;
        mainnavigator.pushPage('ciudad.html');
    }
}

function loginEmail() {

    if (current_page != 'email.html') {

        current_page = 'email.html';
        setTimeout(function(){current_page = '';}, 100);

        mainnavigator.pushPage('email.html');
    }
}

function goHome(ciudad_id, save) {

    if(current_page != 'home.html') {

        current_page = 'home.html';
        setTimeout(function(){current_page = '';}, 100);

        CIUDAD_ID = ciudad_seleccionada = ciudad_id;

        //se guarda la ciudad
        if (isLogin()) {

            if(save == undefined) {
                var user = COOKIE;
                var me = user.id;

                getJsonP(api_url + 'setCiudad/', function (data) {

                    if (data) {

                        if (data.status == 'success') {

                            mainnavigator.pushPage('home.html');

                            //showAlert(data.mensaje, "Aviso", "Aceptar");
                            //re-escribimos la cookie con la nueva ciudad
                            reWriteCookie("user", "ciudad_id", data.ciudad_id);

                        } else {

                            showAlert(data.mensaje, "Error", "Aceptar");
                        }
                    }

                }, function () {

                }, {usuario_id: me, ciudad_id: CIUDAD_ID});

            } else {

                mainnavigator.pushPage('home.html');
            }

        } else if(LOGIN_INVITADO) {

            mainnavigator.pushPage('home.html');
        }
    }
}

function alertaInvitado() {

    showAlert(
        "Hemos detectado que est\u00E1s navegando como invitado, para ingresar a esta secci\u00F3n debes hacer login",
        "INVITADO",
        "Aceptar",
        function () {

            window.location.reload();
        }
    );
}


//Pagar Recompensa
function pagar_recompensa(id) {
    navigator.notification.confirm(
        "\u00BFSeguro que quieres VALIDAR? S\u00F3lo el responsable del local puede hacer este proceso. Si validas sin estar en el local perder\u00E1s tu recompensa.", // message
        function (buttonIndex) {
            //1:aceptar,2:cancelar
            if (buttonIndex == 1) {
                showLoadingCustom('Espere por favor...');

                getJsonP(api_url + 'setPagado/', function(data){

                    if (data) {

                        if (data.status == 'success') {

                            $('#recompensa_' + id).removeClass('button').html('');

                            showAlert(data.mensaje, "Aviso", "Aceptar");

                        } else {

                            showAlert(data.mensaje, "Error", "Aceptar");
                        }
                    }

                }, function() {

                }, {
                    id: id
                });
            }
        },            // callback to invoke with index of button pressed
        'Validar Recompensa',           // title
        'Aceptar,Cancelar'         // buttonLabels
    );
}


function getValidarDeviceUuid( device_uuid, token_notificacion) {

    getJsonPBackground(api_url + 'validarDeviceUuid/', function(data) {

        if (data.status == 'success') {

            getLocationGPS();

            APP_INITIALIZED = true;
            var usuario = data.usuario;
            //guardamos los datos en la COOKIE
            createCookie("user", JSON.stringify(usuario), 365);

            var usuario_ciudad = data.usuario.ciudad_id;
            //usuario_ciudad = '0';
            if (usuario_ciudad != '' && usuario_ciudad != '0') {
                CIUDAD_ID = ciudad_seleccionada = usuario_ciudad;

                if (isLogin()) {
                    mainnavigator.pushPage('home.html', {})
                }

            } else {

                mainnavigator.pushPage('ciudad.html', {});

            }

        } else {

            mainnavigator.pushPage('registro.html', {});
        }

    }, function() {

        showAlert('Problema al contactar con el servidor', 'Error', 'Aceptar');

    }, {
        device_uuid: device_uuid,
        token_notificacion: token_notificacion
    });
}

function isLogin() {
    var res = false;
    var cookie_user = $.parseJSON(readCookie("user"));
    if (cookie_user !== null) {
        res = true;
        COOKIE = cookie_user;
        ciudad_seleccionada = cookie_user.ciudad_id;
    } else {
        REDIREC_TO = window.location.href;
    }
    return res;
}

//redirectLogin
function redirectLogin() {
    $("#view").find(".ui-header").fadeIn("slow");
    $("#view").find(".ui-content").fadeIn("slow");
    $.mobile.changePage('#view');
}

var scanning = false;

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        //pause
        document.addEventListener("pause", this.onPause, false);
        //resume
        document.addEventListener("resume", this.onResume, false);
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {

        //Inicializamos el api de facebook
        openFB.init({appId: '537875786305519'});

        //Inicializamos el api de twitter
        cb.setConsumerKey(consumer_key, consumer_secret);

        //Iniciamos el intervalo de mostrar la notificaion local
        this.initIntervalNotificacion();

        //Inicializamos el pushNotification
        var pushNotification;

        try {

            pushNotification = window.plugins.pushNotification;

        } catch (error) {
        }

        if (pushNotification != undefined) {

            if (device.platform == 'android' || device.platform == 'Android') {
                //alert("Register called android");
                pushNotification.register(this.successHandler, this.errorHandler, {
                    "senderID": "629734064389",
                    "ecb": "app.onNotificationGCM"
                });
            }
            else {
                //alert("Register called ios");
                pushNotification.register(this.tokenHandler, this.errorHandler, {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true",
                    "ecb": "app.onNotificationAPN"
                });
            }

        } else {

            getLocationGPS();

            if (isLogin()) {

                var user = COOKIE;

                if ($.trim(user.email) == "") {

                    mainnavigator.pushPage("perfil.html", {animation: 'none'});

                } else {

                    CIUDAD_ID = ciudad_seleccionada = user.ciudad_id;

                    if(ciudad_seleccionada == '' || ciudad_seleccionada == '0') {

                        mainnavigator.pushPage('ciudad.html');

                    } else {

                        mainnavigator.pushPage('home.html');

                    }
                }

            } else {

                mainnavigator.pushPage("registro.html", {animation: 'none'});
            }
        }
    },
    // result contains any message sent from the plugin call
    successHandler: function (result) {
        //console.log("Regid " + result);
        //alert('Callback Success! Result = '+result);
    },
    errorHandler: function (error) {
        alert(error);
    },
    tokenHandler: function (result) {

        PUSH_NOTIFICATION_REGISTER = 'ios';

        //solo si no se lleno antes con el token llenamos, porque viene otro tipo de mensajes igual
        if (PUSH_NOTIFICATION_TOKEN == 0) {
            PUSH_NOTIFICATION_TOKEN = result;
            //alert(PUSH_NOTIFICATION_TOKEN);
            //mandamos a guardar el token para las notificaciones solo si no se guardo antes

            if (!APP_INITIALIZED) {
                getValidarDeviceUuid(device.uuid, PUSH_NOTIFICATION_TOKEN);
            }
        }
        //console.log("Regid " + result);
        //alert('Callback Success! Result = '+result);
    },
    onNotificationGCM: function (e) {
        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    PUSH_NOTIFICATION_REGISTER = 'android';
                    PUSH_NOTIFICATION_TOKEN = e.regid;
                    //console.log("Regid " + e.regid);
                    //alert('registration id = '+e.regid);

                    //mandamos a guardar el token para las notificaciones solo si no se guardo antes
                    if (!APP_INITIALIZED) {
                        getValidarDeviceUuid(device.uuid, PUSH_NOTIFICATION_TOKEN);
                    }
                }
                break;

            case 'message':
                // this is the actual push notification. its format depends on the data model from the push server
                //alert('message = '+e.message+' msgcnt = '+e.msgcnt);
                if (APP_INITIALIZED) {
                    showNotification(e, 'android');
                } else {
                    HAVE_NOTIFICATION = true;
                    TYPE_NOTIFICATION = 'android';
                    EVENT = e;
                }
                break;

            case 'error':
                alert('GCM error = ' + e.msg);
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }
    },
    onNotificationAPN: function (event) {
        if (event.alert) {
            if (APP_INITIALIZED) {
                showNotification(event, 'ios');
            } else {
                HAVE_NOTIFICATION = true;
                TYPE_NOTIFICATION = 'ios';
                EVENT = event;
            }
        }
        /*
         if (event.badge) {
         window.plugins.pushNotification.setApplicationIconBadgeNumber(this.successHandler, this.errorHandler, event.badge);
         }
         if (event.sound) {
         var snd = new Media(event.sound);
         snd.play();
         }
         */
    },
    onPause: function () {
        app.stopIntervalNotificacion();
    },
    onResume: function () {
        app.initIntervalNotificacion();
    },
    initIntervalNotificacion: function () {
        INTERVAL = setInterval(function () {
            mobileCheckDistance();
        }, 30000); // 300000 - 5min, 30000 - 30seg
    },
    stopIntervalNotificacion: function () {
        clearInterval(INTERVAL);
    },
    scan: function () {

        if(!scanning) {

            scanning = true;

            if (isLogin()) {

                cordova.plugins.barcodeScanner.scan(
                    function (result) {

                        scanning = false;

                        if (result.format == "QR_CODE") {

                            if (result.text != "") {

                                var params = (result.text).toString().split("/");
                                var urlamigable = params[params.length - 1].toString();
                                //Mandamos al checkIn
                                checkIn(urlamigable);

                            } else {
                                showAlert("Scanner failed, please try again.", "Error", "Aceptar");
                            }

                        } else if (result.cancelled) {

                            //showAlert("Scanner Cancelled.", "Error", "Aceptar");
                        }
                    },
                    function (error) {

                        scanning = false;

                        alert("Scanning failed: " + error);
                    }
                );

                /*var scanner = cordova.require("cordova/plugin/BarcodeScanner");
                 scanner.scan(function (result) {

                 if (result.format == "QR_CODE") {

                 if (result.text != "") {
                 var params = (result.text).toString().split("/");
                 var urlamigable = params[params.length - 1].toString();
                 //Mandamos al checkIn
                 checkIn(urlamigable);
                 } else {
                 showAlert("Scanner failed, please try again.", "Error", "Aceptar");
                 }

                 } else if (result.cancelled) {
                 showAlert("Scanner Cancelled.", "Error", "Aceptar");
                 }

                 }, function (error) {
                 alert("Scanning failed: ", error);
                 });*/

            } else if (LOGIN_INVITADO) {

                alertaInvitado();
            }
        }
    }
};

function resizeCardCarousel() {
    /*
     thumb_width = window.innerWidth;
     thumb_height = window.innerHeight - $('#main_content').offsetHeight();

     $('#home_images').height(thumb_height);*/

    refreshHomeScroll();
}

function imageLoaded(index) {
    if (index == 0) {
        setInterval(function () {

            if (homeImages.getActiveCarouselItemIndex() < homeImages._getCarouselItemCount() - 1) {

                homeImages.next();

            } else {

                homeImages.setActiveCarouselItemIndex(0);
            }

        }, 5000);
    }
}

function onError() {
}

function openEmail(email) {

    window.open('mailto:' + email + '?subject=Contacto&body=');
}

function gotoMaps(seccion) {

    openExternalLink('https://www.google.com/maps/place/'+seccion.latitud+','+seccion.longitud+'/@'+seccion.latitud+','+seccion.longitud+'z/data=!3m1!4b1')
}

function gotoLink(url) {

    openExternalLink(url);
}

function goToContacto() {

    splash.pushPage('contacto.html', {});
}

function goToPlanes(local_id) {

    if (current_page != 'planes.html') {

        current_page = 'planes.html';
        setTimeout(function(){current_page = '';}, 100);

        getJsonP(api_url + 'getPlanes/', function (data) {

            if(data.list != false) {

                mainnavigator.pushPage('planes.html', {current_list: data});

            } else {

                showAlert('No existen planes para mostrar', 'Mensaje', 'Aceptar');
            }


        }, function () {
        }, {ciudad_id: ciudad_seleccionada, local_id: local_id});

    }
}

function gotoComoFunciona() {

    if (current_page != 'como_funciona.html') {

        current_page = 'como_funciona.html';
        setTimeout(function(){current_page = '';}, 100);

        mainnavigator.pushPage('como_funciona.html', {});
    }
}

function gotoQuieroParticipar() {

    if (current_page != 'quiero_participar.html') {

        current_page = 'quiero_participar.html';
        setTimeout(function(){current_page = '';}, 100);

        mainnavigator.pushPage('quiero_participar.html', {});
    }
}

function goToGuia() {

    if (current_page != 'guias.html') {

        current_page = 'guias.html';
        setTimeout(function(){current_page = '';}, 100);

        getJsonP(api_url + 'getCategorias/', function (data) {

            mainnavigator.pushPage('guias.html', {current_list: data});

        }, function () {
        }, {ciudad_id: ciudad_seleccionada});
    }
}

function goToRecompensas() {

    if (current_page != 'recompensas.html') {

        current_page = 'recompensas.html';
        setTimeout(function(){current_page = '';}, 100);

        getJsonP(api_url + 'getRecompensas/', function (data) {

            mainnavigator.pushPage('recompensas.html', {current_list: data});

        }, function () {
        }, {ciudad_id: ciudad_seleccionada, usuario_id: !LOGIN_INVITADO ? COOKIE.id : ''});
    }
}

function gotoMenuDiario() {

    if (current_page != 'menu.html') {

        current_page = 'menu.html';
        setTimeout(function(){current_page = '';}, 100);

        getJsonP(api_url + 'getMenuDiario/', function (data) {

            mainnavigator.pushPage('menu.html', {current_list: data});

        }, function () {
        }, {ciudad_id: ciudad_seleccionada});
    }
}

function goToPlanesDetalle(id, current_list) {

    mainnavigator.pushPage('plan.html', {id: id, current_plan: current_list[id]});
}

function procesarRegistro(element, event, type) {

    if (current_page != 'ciudad.html') {

        current_page = 'ciudad.html';
        setTimeout(function(){current_page = '';}, 100);

        mainnavigator.pushPage('ciudad.html');
    }
}

function elegirCiudad(ciudad_id) {

    ciudad_seleccionada = CIUDAD_ID = ciudad_id;

    //ciudad_seleccionada = applicationParams.ciudades[ciudad_images.getActiveCarouselItemIndex()].id;

    goHome(ciudad_seleccionada);
}

function loadApplicationParams(callback) {

    try {
        StatusBar.hide();
    } catch (error) {
    }

    getJsonPBackground(api_url + 'getParams/', function (data) {

        applicationParams = data;

        callback();

    }, function () {


    }, {});
}

function refreshHomeScroll() {

    scrolls['homeScroll'].refresh();
}


function refreshGuiasScroll(img) {

    $(img).css('visibility', 'visible');

    scrolls['guiasScroll'].refresh();
}

function refreshPlanesScroll() {

    scrolls['planesScroll'].refresh();
}

function refreshRecompensasScroll() {

    scrolls['recompensasScroll'].refresh();
}

closeDetailSession = function () {

    popPage('guest_info.html');

    currentSessionFromNotification = null;


    ;
}

actionCall = function (phone) {

    phonedialer.dial(
        phone,
        function (err) {
            if (err == "empty") {
                alert("Unknown phone number");
            }
            else alert("Dialer Error:" + err);
        },
        function (success) {
            //alert('Dialing succeeded');
        }
    );
};

function onSliderCiudadIMGLoad(img, index) {

    var src = $(img).attr('src');
    var container = $(img).parent();

    var image = new Image();
    image.src = src;

    image.onload = function () {

        container.parent().find('ons-icon').remove();

        container.html('');
        container.addClass('noopaque');

        container.css('background-image', "url('" + src + "')");
        container.css('background-repeat', "no-repeat");
        container.css('background-position', "center center");

        var width = image.width;
        var height = image.height;
        var factor = 1;

        if (window.innerWidth > width) {
            factor = window.innerWidth / width;
            width = width * factor;
            height = height * factor;
        }

        if (window.innerHeight > height) {

            factor = (window.innerHeight) / height;
            width = width * factor;
            height = height * factor;
        }

        if (window.innerWidth < width) {

            factor = window.innerHeight / height;
            width = width * factor;
            height = window.innerHeight;

            if (window.innerWidth - width > 0) {
                factor = window.innerWidth / width;
                width = window.innerWidth;
                height = height * factor;
            }


        } else if (window.innerHeight < height) {

            factor = window.innerWidth / width;
            width = window.innerWidth;
            height = height * factor;

            if (window.innerHeight - height > 0) {
                factor = window.innerHeight / height;
                height = window.innerHeight;
                width = width * factor;
            }
        }

        container.css('background-size', parseInt(width) + "px" + " " + parseInt(height) + "px");

        container.removeClass('noopaque');
    }
}

function onSliderHomeIMGLoad(img, index) {

    var src = $(img).attr('src');
    var container = $(img).parent();

    var outerWidth = $(img).parent().outerWidth();
    var outerHeight = $(img).parent().outerHeight();

    var image = new Image();

    container.parent().find('ons-icon').remove();

    container.html('');
    container.addClass('noopaque');

    image.onload = function(event) {

        container.css('background-image', "url('" + src + "')");
        container.css('background-repeat', "no-repeat");
        container.css('background-position', "center center");

        var width = image.width;
        var height = image.height;
        var factor = 1;

        if (outerWidth > width) {
            factor = outerWidth / width;
            width = width * factor;
            height = height * factor;
        }

        if (outerHeight > height) {

            factor = (outerHeight) / height;
            width = width * factor;
            height = height * factor;
        }

        if (outerWidth < width) {
            factor = outerHeight / height;
            width = width * factor;
            height = outerHeight;

            if (outerWidth - width > 0) {
                factor = outerWidth / width;
                width = outerWidth;
                height = height * factor;
            }


        } else if (outerHeight < height) {
            factor = outerWidth / width;
            width = outerWidth;
            height = height * factor;

            if (outerHeight - height > 0) {
                factor = outerHeight / height;
                height = outerHeight;
                width = width * factor;
            }
        }

        width = parseInt(width + "");
        height = parseInt(height + "");

        container.css('background-size', (width) + "px" + " " + (height) + "px");

        container.removeClass('noopaque');
    }

    image.src = src;
}

function adaptImage(img, index) {

    var src = $(img).attr('src');
    var container = $(img).parent();

    var outerWidth = $(img).parent().outerWidth();
    var outerHeight = $(img).parent().outerHeight();

    var image = new Image();

    container.parent().find('ons-icon').remove();

    container.html('');
    container.addClass('noopaque');

    image.onload = function(event) {

        container.css('background-image', "url('" + src + "')");
        container.css('background-repeat', "no-repeat");
        container.css('background-position', "0 0");

        var width = image.width;
        var height = image.height;

        if(width > height) {

            width = '100%';
            height = 'auto';

        } else {

            width = 'auto';
            height = '100%';
        }

        container.css('background-size', (width) + "" + " " + (height) + "");

        container.removeClass('noopaque');
    }

    image.src = src;
}

function infoAction() {
    actionCall('918538002');
}


var NavigatorController;
module.controller('NavigatorController', function ($scope) {
    ons.ready(function () {

        NavigatorController = this;

        try {
            StatusBar.hide();
        } catch (error) {
        }

        loadApplicationParams(function () {

            /*getLocationGPS();*/

            app.onDeviceReady();
        });

    })
});

var RegistroController;
module.controller('RegistroController', function ($scope) {
    ons.ready(function () {

        RegistroController = this;

        initScroll('registro_scroll');

        try {
            navigator.splashscreen.hide();
        } catch (error) {
        }

    })
});

var ciudadController;
module.controller('ciudadController', function ($scope) {
    ons.ready(function () {

        CiudadController = this;

        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#ciudad_images')[0], applicationParams.ciudades, 'slider_ciudades');
        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#ciudadPaginator')[0], applicationParams.ciudades, 'slider_paginator');

        $(mainnavigator.getCurrentPage().element[0]).find('#ciudadPaginator > div:first-child').addClass('selected');


        CiudadController.carouselPostChange = function () {
            $(mainnavigator.getCurrentPage().element[0]).find('#ciudadPaginator > div').removeClass('selected');
            $(mainnavigator.getCurrentPage().element[0]).find('#ciudadPaginator > div:nth-child(' + (ciudad_images.getActiveCarouselItemIndex() + 1) + ')').addClass('selected');
        };

        setTimeout(function () {

            ciudad_images.on('postchange', CiudadController.carouselPostChange);

        }, 100);

        $(mainnavigator.getCurrentPage().element[0]).find('#ciudadPage .ciudad_slide').each(function() {

            $(this).on('click', function() {
                elegirCiudad( $(this).attr('rel') );
            });

        });

    })
});


var HomeController;
var height;
module.controller('HomeController', function ($scope) {
    ons.ready(function () {

        HomeController = $scope;

        try {
            StatusBar.hide();
        } catch (error) {
        }

        setTimeout(function () {

            var factor = window.innerWidth / 320;

            var footerHeight = factor * $('#homeFooter').outerHeight();

            $('#homeFooter .banner').height(footerHeight + 8);
            $('#homeHeader').height(footerHeight - 8);

            $('#homeHeader').css('min-height', (footerHeight - 8) + 'px');

            /*$('.header-logo').width($('.header-logo').width() * factor);
             $('.header-logo').height($('.header-logo').height() * factor);*/

            height = $(window).height() - ( $('#homeScroll').outerHeight() + $('#homeFooter').outerHeight() + $('#homeHeader').outerHeight() - 1 );

            height = height - 12 - 8;

            console.log('sliderH: ' + height);

            $('#homeImages').height(height);
            $('#homeToolbar').height(height);

            $('#homePage .page__content').css('top', (height + $('#homeHeader').outerHeight() ) + 'px');

            $('#home_slider_paginator > li:nth-child(1)').addClass('selected');

            loadIntoTemplate('#homeImages', applicationParams.slider, 'slider_images');

            loadIntoTemplate('#homePaginator', applicationParams.slider, 'slider_paginator');

            if ($.trim(applicationParams.banner.url) != '' ) {

                $('#homeBanner').find('a').attr('rel', applicationParams.banner.url);

                $('#homeBanner').find('a').on('click', function() {

                    openExternalLink($(this).attr('rel'));
                });
            } else if( $.trim(applicationParams.banner.section) != '' ) {

                $('#homeBanner').find('a').on('click', function() {

                    redirectToPage(applicationParams.banner.section, applicationParams.banner.section_id);
                });
            }

            $('#homePage .home-slide').each(function() {

                if ($.trim($(this).attr('url')) != '' ) {

                    $(this).on('click', function() {

                        openExternalLink($(this).attr('url'));
                    });
                } else if( $.trim($(this).attr('section')) != '' ) {

                    $(this).on('click', function() {

                        redirectToPage($(this).attr('section'), $(this).attr('section_id'));
                    });
                }

            });

            if ($.trim(applicationParams.banner.image) != '' ) {

                $('#homeBanner').find('img').attr('src', applicationParams.banner.image);
            }

            $('#homePaginator > div:first-child').addClass('selected');


            HomeController.carouselPostChange = function () {
                $('#homePaginator > div').removeClass('selected');
                $('#homePaginator > div:nth-child(' + (homeImages.getActiveCarouselItemIndex() + 1) + ')').addClass('selected');
            };

            setTimeout(function () {

                homeImages.on('postchange', HomeController.carouselPostChange);

            }, 100);

            ons.compile($('#homeImages')[0]);

            initScroll('homeScroll');

            setTimeout(function () {

                try {
                    navigator.splashscreen.hide();
                } catch (error) {
                }

            }, 1000);


        }, 100);

    });
});

var PlanesController;
var counterPlanes = 0;
module.controller('PlanesController', function ($scope) {
    ons.ready(function () {

        var current_list = mainnavigator.getCurrentPage().options.current_list;

        PlanesController = this;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;

        $(mainnavigator.getCurrentPage().element[0]).find('#planesHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#planesHeader').css('min-height', (footerHeight - 8) + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (footerHeight - 8) + 'px');

        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#planes_content')[0], current_list.items, 'planes_list');

        $(mainnavigator.getCurrentPage().element[0]).find('.list-item-container').height((window.innerHeight - (51 * factor)) / 3);

        $(mainnavigator.getCurrentPage().element[0]).find('.list-item-container').on('click', function(){
            gotoPlanDetalle( $(this).attr('rel'), current_list );
        });

        ons.compile( $(mainnavigator.getCurrentPage().element[0]).find('#planes_content')[0] );

        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#planesScroll').attr('id', 'planesScroll' + counterPlanes);

        initScroll('planesScroll' + counterPlanes);

    })
});

function gotoPlanDetalle(index, current_list) {

    if (current_page != 'plan.html') {

        current_page = 'plan.html';
        setTimeout(function(){current_page = '';}, 100);

        mainnavigator.pushPage('plan.html', {current_plan: current_list.items[index]});
    }
}


var PlanController;
module.controller('PlanController', function ($scope) {
    ons.ready(function () {

        PlanController = this;

        var current_plan = mainnavigator.getCurrentPage().options.current_plan;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#planHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#planHeader').css('min-height', (footerHeight - 8) + 'px');

        footerHeight = factor * $(mainnavigator.getCurrentPage().element[0]).find('#planFooter').outerHeight();

        $(mainnavigator.getCurrentPage().element[0]).find('#planFooter .banner').height(footerHeight);

        /*$('.header-logo').width($('.header-logo').width() * factor);
         $('.header-logo').height($('.header-logo').height() * factor);*/

        height = $(window).height() - ( 200 * factor + $(mainnavigator.getCurrentPage().element[0]).find('#planFooter').outerHeight() + $(mainnavigator.getCurrentPage().element[0]).find('#planHeader').outerHeight() - 1 );

        $(mainnavigator.getCurrentPage().element[0]).find('#planImages').height(height);
        $(mainnavigator.getCurrentPage().element[0]).find('#planToolbar').height(height);

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (height + $(mainnavigator.getCurrentPage().element[0]).find('#planHeader').outerHeight() ) + 'px');
        //$('#planPage .page__content').css('bottom', (footerHeight +'px') );

        //$('#planScroll').height($('#planScroll').height() - footerHeight);

        $(mainnavigator.getCurrentPage().element[0]).find('#planList').css('padding-bottom', footerHeight + 'px');


        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#planImages')[0], current_plan.images, 'slider_plan');
        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#planPaginator')[0], current_plan.images, 'slider_paginator');

        if (current_plan.condicion) {
            $(mainnavigator.getCurrentPage().element[0]).find('#planCondicion').html('<h4 class="rosa">Condición</h4><p align="left">' + current_plan.condicion + '</p>');
        }

        if (current_plan.como_reservar) {
            $(mainnavigator.getCurrentPage().element[0]).find('#planComoReservar').html('<h4 class="rosa">Como Reservar</h4><p align="left">' + current_plan.como_reservar + '</p>');
        }

        $(mainnavigator.getCurrentPage().element[0]).find('#planLlamar').on('click', function () {
            actionCall(current_plan.telefono);
        });

        $(mainnavigator.getCurrentPage().element[0]).find('#planVerLocal').on('click', function () {

            mainnavigator.pushPage('local.html', {current_local: current_plan});
        });

        $(mainnavigator.getCurrentPage().element[0]).find('#planMaps').on('click', function () {

            gotoMaps(current_plan);
        });


        $(mainnavigator.getCurrentPage().element[0]).find('#planPaginator > div:first-child').addClass('selected');

        $(mainnavigator.getCurrentPage().element[0]).find('#planDescripcion').html(current_plan.descripcion);
        $(mainnavigator.getCurrentPage().element[0]).find('#planDireccion').html(current_plan.direccion);

        PlanController.carouselPostChange = function () {
            $(mainnavigator.getCurrentPage().element[0]).find('#planPaginator > div').removeClass('selected');
            $(mainnavigator.getCurrentPage().element[0]).find('#planPaginator > div:nth-child(' + (planImages.getActiveCarouselItemIndex() + 1) + ')').addClass('selected');
        };

        setTimeout(function () {

            planImages.on('postchange', PlanController.carouselPostChange);

        }, 1000);

        ons.compile($(mainnavigator.getCurrentPage().element[0]).find('#plan_content')[0]);

        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#planScroll').attr('id', 'planScroll' + counterPlanes);

        initScroll('planScroll' + counterPlanes);

    })
});


var LocalController;
module.controller('LocalController', function ($scope) {
    ons.ready(function () {

        LocalController = this;

        var current_local = mainnavigator.getCurrentPage().options.current_local;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#localHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#localHeader').css('min-height', (footerHeight - 8) + 'px');

        footerHeight = factor * $(mainnavigator.getCurrentPage().element[0]).find('#localFooter').outerHeight();

        $(mainnavigator.getCurrentPage().element[0]).find('#localFooter .banner').height(footerHeight);

        /*$(mainnavigator.getCurrentPage().element[0]).find('.header-logo').width($(mainnavigator.getCurrentPage().element[0]).find('.header-logo').width() * factor);
         $(mainnavigator.getCurrentPage().element[0]).find('.header-logo').height($(mainnavigator.getCurrentPage().element[0]).find('.header-logo').height() * factor);*/

        height = $(window).height() - ( 200 * factor + $(mainnavigator.getCurrentPage().element[0]).find('#localFooter').outerHeight() + $(mainnavigator.getCurrentPage().element[0]).find('#localHeader').outerHeight() - 1 );

        $(mainnavigator.getCurrentPage().element[0]).find('#localImages').height(height);
        $(mainnavigator.getCurrentPage().element[0]).find('#localToolbar').height(height);

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (height + $(mainnavigator.getCurrentPage().element[0]).find('#localHeader').outerHeight() ) + 'px');
        //$(mainnavigator.getCurrentPage().element[0]).find('#localPage .page__content').css('bottom', (footerHeight +'px') );

        //$(mainnavigator.getCurrentPage().element[0]).find('#localScroll').height($(mainnavigator.getCurrentPage().element[0]).find('#localScroll').height() - footerHeight);

        $(mainnavigator.getCurrentPage().element[0]).find('#localList').css('padding-bottom', footerHeight + 'px');


        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#localImages')[0], current_local.local_images, 'slider_local');
        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#localPaginator')[0], current_local.local_images, 'slider_paginator');

        if (current_local.condicion) {
            $(mainnavigator.getCurrentPage().element[0]).find('#localCondicion').html('<h4>Condición</h4><p align="left">' + current_local.condicion + '</p>');
        }

        if (current_local.como_reservar) {
            $(mainnavigator.getCurrentPage().element[0]).find('#localComoReservar').html('<h4>Como Reservar</h4><p align="left">' + current_local.como_reservar + '</p>');
        }

        $(mainnavigator.getCurrentPage().element[0]).find('#localLlamar').on('click', function () {
            actionCall(current_local.telefono);
        });

        if(current_local.planes > 0) {

            $(mainnavigator.getCurrentPage().element[0]).find('#localVerPlanes').find('.count').text(current_local.planes);

        } else {

            $(mainnavigator.getCurrentPage().element[0]).find('#localVerPlanes').find('.count').remove();
        }

        $(mainnavigator.getCurrentPage().element[0]).find('#localVerPlanes').on('click', function () {

            goToPlanes(current_local.local_id);
        });

        $(mainnavigator.getCurrentPage().element[0]).find('#localMaps').on('click', function () {

            gotoMaps(current_local);
        });

        $(mainnavigator.getCurrentPage().element[0]).find('#localWeb').on('click', function () {

            gotoLink(current_local.web);
        });

        if( $.trim(current_local.web) == '' ) {
            $('#localMaps').hide();
        }

        if( $.trim(current_local.facebook) == '' ) {
            $('#localFacebook').hide();
        }

        if( $.trim(current_local.twitter) == '' ) {
            $('#localTwitter').hide();
        }

        $(mainnavigator.getCurrentPage().element[0]).find('#localFacebook').on('click', function () {

            gotoLink(current_local.facebook);
        });

        $(mainnavigator.getCurrentPage().element[0]).find('#localTwitter').on('click', function () {

            gotoLink(current_local.twitter);
        });


        $(mainnavigator.getCurrentPage().element[0]).find('#localPaginator > div:first-child').addClass('selected');

        $(mainnavigator.getCurrentPage().element[0]).find('#localDescripcion').html(current_local.local_descripcion);
        $(mainnavigator.getCurrentPage().element[0]).find('#localDireccion').html(current_local.direccion);

        LocalController.carouselPostChange = function () {
            $(mainnavigator.getCurrentPage().element[0]).find('#localPaginator > div').removeClass('selected');
            $(mainnavigator.getCurrentPage().element[0]).find('#localPaginator > div:nth-child(' + (localImages.getActiveCarouselItemIndex() + 1) + ')').addClass('selected');
        };

        setTimeout(function () {

            localImages.on('postchange', LocalController.carouselPostChange);

        }, 1000);

        ons.compile($(mainnavigator.getCurrentPage().element[0]).find('#local_content')[0]);

        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#localScroll').attr('id', 'localScroll' + counterPlanes);

        initScroll('localScroll' + counterPlanes);

    })
});


var GuiasController;
module.controller('GuiasController', function ($scope) {
    ons.ready(function () {

        GuiasController = this;

        var current_list = mainnavigator.getCurrentPage().options.current_list;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#guiasHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#guiasHeader').css('min-height', (footerHeight - 8) + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (footerHeight - 8) + 'px');

        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#guias_content')[0], current_list.items, 'guias_list');

        $(mainnavigator.getCurrentPage().element[0]).find('.list-item-container').on('click', function(){
            gotoLocales( $(this).attr('rel'), current_list );
        });

        ons.compile($(mainnavigator.getCurrentPage().element[0]).find('#guias_content')[0]);


        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#guiasScroll').attr('id', 'guiasScroll' + counterPlanes);

        initScroll('guiasScroll' + counterPlanes);

    })
});


var ComoFuncionaController;
module.controller('ComoFuncionaController', function ($scope) {
    ons.ready(function () {

        ComoFuncionaController = this;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#como_funcionaHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#como_funcionaHeader').css('min-height', (footerHeight - 8) + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (footerHeight - 8) + 'px');

        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#como_funciona_content')[0], applicationParams.como_funciona, 'como_funciona_list');

        ons.compile($(mainnavigator.getCurrentPage().element[0]).find('#como_funciona_content')[0]);


        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#como_funcionaScroll').attr('id', 'como_funcionaScroll' + counterPlanes);

        initScroll('como_funcionaScroll' + counterPlanes);

    })
});

function refreshComoFuncionaScroll(img) {

    $(img).css('visibility', 'visible');

    scrolls.como_funcionaScroll.refresh();
}

function gotoComofuncionaDetalle(index, current_list) {
    if (current_page != 'como_funciona_detalle.html') {

        current_page = 'como_funciona_detalle.html';
        setTimeout(function(){current_page = '';}, 100);

        current_como_funciona = applicationParams.como_funciona[index];

        mainnavigator.pushPage('como_funciona_detalle.html');
    }
}

var ComoFuncionaDetalleController;
var current_como_funciona;
module.controller('ComoFuncionaDetalleController', function ($scope) {
    ons.ready(function () {

        ComoFuncionaDetalleController = this;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#como_funciona_detalleHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#como_funciona_detalleHeader').css('min-height', (footerHeight - 8) + 'px');

        footerHeight = factor * $(mainnavigator.getCurrentPage().element[0]).find('#como_funciona_detalleHeader').outerHeight();


        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (footerHeight - 8) + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('#como_funciona_detalleHeader').height(footerHeight);

        $(mainnavigator.getCurrentPage().element[0]).find('#como_funciona_detalle_title').html(current_como_funciona.title);

        $(mainnavigator.getCurrentPage().element[0]).find('#como_funciona_detalleDescripcion').html(current_como_funciona.descripcion);

        ons.compile($(mainnavigator.getCurrentPage().element[0]).find('#como_funciona_detalleScroll')[0]);

        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#como_funciona_detalleScroll').attr('id', 'como_funciona_detalleScroll' + counterPlanes);

        initScroll('como_funciona_detalleScroll' + counterPlanes);

    })
});


var QuieroParticiparController;
module.controller('QuieroParticiparController', function ($scope) {
    ons.ready(function () {

        QuieroParticiparController = this;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#quiero_participarHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#quiero_participarHeader').css('min-height', (footerHeight - 8) + 'px');

        footerHeight = factor * $(mainnavigator.getCurrentPage().element[0]).find('#quiero_participarHeader').outerHeight();


        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (footerHeight - 8) + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('#quiero_participarHeader').height(footerHeight);

        $(mainnavigator.getCurrentPage().element[0]).find('#quiero_participar_title').html(applicationParams.quiero_participar.title);

        $(mainnavigator.getCurrentPage().element[0]).find('#quiero_participarDescripcion').html(applicationParams.quiero_participar.descripcion);

        ons.compile($(mainnavigator.getCurrentPage().element[0]).find('#quiero_participarScroll')[0]);

        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#quiero_participarScroll').attr('id', 'quiero_participarScroll' + counterPlanes);

        initScroll('quiero_participarScroll' + counterPlanes);

    })
});

function gotoLocales(index, current_list) {

    if (current_page != 'locales.html') {

        current_page = 'locales.html';
        setTimeout(function(){current_page = '';}, 100);

        current_categoria = current_list.items[index];

        getJsonP(api_url + 'getLocales/', function (data) {

            mainnavigator.pushPage('locales.html', {current_list: data});

        }, function () {
        }, {categoria_id: current_categoria.id, ciudad_id: ciudad_seleccionada});
    }
}

function gotoLocalesFromId(categoria_id) {

    if (current_page != 'locales.html') {

        current_page = 'locales.html';
        setTimeout(function(){current_page = '';}, 100);

        getJsonP(api_url + 'getLocales/', function (data) {

            mainnavigator.pushPage('locales.html', {current_list: data});

        }, function () {
        }, {categoria_id: categoria_id, ciudad_id: ciudad_seleccionada});
    }
}

function gotoGuiaDetalle(index, current_list) {

    if (current_page != 'local.html') {

        current_page = 'local.html';
        setTimeout(function(){current_page = '';}, 100);

        mainnavigator.pushPage('local.html', {current_local: current_list.items[index]});
    }
}

function refreshLocalesScroll() {
    scrolls.localesScroll.refresh();
}


module.controller('LocalesController', function ($scope) {
    ons.ready(function () {

        LocalesController = this;

        var current_list = mainnavigator.getCurrentPage().options.current_list;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#localesHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#localesHeader').css('min-height', (footerHeight - 8) + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (footerHeight - 8) + 'px');

        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#locales_content')[0], current_list.items, 'locales_list');

        $(mainnavigator.getCurrentPage().element[0]).find('.list-item-container').on('click', function(){
            gotoGuiaDetalle( $(this).attr('rel'), current_list );
        });

        ons.compile($(mainnavigator.getCurrentPage().element[0]).find('#locales_content')[0]);

        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#localesScroll').attr('id', 'localesScroll' + counterPlanes);

        initScroll('localesScroll' + counterPlanes);

    })
});


var GuiaController;
var current_categoria;
module.controller('GuiaController', function ($scope) {
    ons.ready(function () {

        GuiaController = this;

        var current_guia = mainnavigator.getCurrentPage().options.current_local;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#guiaHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#guiaHeader').css('min-height', (footerHeight - 8) + 'px');

        footerHeight = factor * $(mainnavigator.getCurrentPage().element[0]).find('#guiaFooter').outerHeight();

        $(mainnavigator.getCurrentPage().element[0]).find('#guiaFooter .banner').height(footerHeight);
        $(mainnavigator.getCurrentPage().element[0]).find('#guiaHeader').height(footerHeight);

        height = $(window).height() - ( 200 * factor + $(mainnavigator.getCurrentPage().element[0]).find('#guiaFooter').outerHeight() + $(mainnavigator.getCurrentPage().element[0]).find('#guiaHeader').outerHeight() - 1 );

        $(mainnavigator.getCurrentPage().element[0]).find('#guiaImages').height(height);
        $(mainnavigator.getCurrentPage().element[0]).find('#guiaToolbar').height(height);

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (height + $(mainnavigator.getCurrentPage().element[0]).find('#guiaHeader').outerHeight() ) + 'px');
        //$('#guiaPage .page__content').css('bottom', (footerHeight +'px') );

        //$('#guiaScroll').height($('#guiaScroll').height() - footerHeight);

        $(mainnavigator.getCurrentPage().element[0]).find('#guiaList').css('padding-bottom', footerHeight + 'px');


        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (footerHeight - 8) + 'px');


        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#guiaImages')[0], current_guia.images, 'slider_guia');
        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#guiaPaginator')[0], current_guia.images, 'slider_paginator');

        $(mainnavigator.getCurrentPage().element[0]).find('#guiaPaginator > div:first-child').addClass('selected');

        $(mainnavigator.getCurrentPage().element[0]).find('#guiaDescripcion').html(current_guia.descripcion);
        $(mainnavigator.getCurrentPage().element[0]).find('#guiaDireccion').html(current_guia.direccion);

        GuiaController.carouselPostChange = function () {
            $(mainnavigator.getCurrentPage().element[0]).find('#guiaPaginator > div').removeClass('selected');
            $(mainnavigator.getCurrentPage().element[0]).find('#guiaPaginator > div:nth-child(' + (guiaImages.getActiveCarouselItemIndex() + 1) + ')').addClass('selected');
        };

        setTimeout(function () {

            guiaImages.on('postchange', GuiaController.carouselPostChange);

        }, 1000);

        ons.compile($(mainnavigator.getCurrentPage().element[0]).find('#guia_content')[0]);


        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#guiaScroll').attr('id', 'guiaScroll' + counterPlanes);

        initScroll('guiaScroll' + counterPlanes);

    })
});

var MenuController;
module.controller('MenuController', function ($scope) {
    ons.ready(function () {

        MenuController = this;

        var current_list = mainnavigator.getCurrentPage().options.current_list;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#menuHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#menuHeader').css('min-height', (footerHeight - 8) + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (footerHeight - 8) + 'px');

        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#menu_content')[0], current_list.items, 'menu_list');

        $(mainnavigator.getCurrentPage().element[0]).find('.list-item-container').on('click', function(){
            gotoMenuDetalle( $(this).attr('rel'), current_list );
        });

        ons.compile($(mainnavigator.getCurrentPage().element[0]).find('#menu_content')[0]);

        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#menuScroll').attr('id', 'menuScroll' + counterPlanes);

        initScroll('menuScroll' + counterPlanes);

    })
});

var current_menu;
function gotoMenuDetalle(index, current_list) {

    if (current_page != 'menu_detalle.html') {

        current_page = 'menu_detalle.html';
        setTimeout(function(){current_page = '';}, 100);

        mainnavigator.pushPage('menu_detalle.html', {current_menu: current_list.items[index]});
    }
}

function refreshMenuScroll() {
    scrolls.menuScroll.refresh();
}

var MenuDetalleController;
module.controller('MenuDetalleController', function ($scope) {
    ons.ready(function () {

        MenuDetalleController = this;

        var current_menu = mainnavigator.getCurrentPage().options.current_menu;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleHeader').css('min-height', (footerHeight - 8) + 'px');

        footerHeight = factor * $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleFooter').outerHeight();

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (footerHeight - 8) + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleFooter .banner').height(footerHeight);
        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleHeader').height(footerHeight);

        var str = "";
        for (var i in current_menu.content) {

            if ($.trim(current_menu.content[i]) != '') {

                str += "<h3>" + i + "</h3>";
                str += '<div class="menu_platos">' + current_menu.content[i] + '</div>';
            }
        }

        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleList').css('padding-bottom', footerHeight + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('#menuDetalleLogo').attr('src', current_menu.imagen);

        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleCotent').html(str);

        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleFecha').html(current_menu.fecha);
        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleNombre').html(current_menu.title);

        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleDescripcion').html(current_menu.descripcion);
        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleDireccion').html(current_menu.direccion);

        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleLlamar').on('click', function () {

            actionCall(current_menu.telefono);

        });

        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleVerLocal').on('click', function () {

            mainnavigator.pushPage('local.html', {current_local: current_menu});
        });

        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleMaps').on('click', function () {

            gotoMaps(current_menu);
        });

        ons.compile($(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleScroll')[0]);

        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#menu_detalleScroll').attr('id', 'menu_detalleScroll' + counterPlanes);

        initScroll('menu_detalleScroll' + counterPlanes);

    })
});


var RecompensasController;
module.controller('RecompensasController', function ($scope) {
    ons.ready(function () {

        RecompensasController = this;

        var current_list = mainnavigator.getCurrentPage().options.current_list;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#recompensasHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#recompensasHeader').css('min-height', (footerHeight - 8) + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('#recompensasPage .page__content').css('top', (footerHeight - 8) + 'px');

        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#recompensas_content'), current_list.items, 'recompensas_list_content');

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (footerHeight - 8) + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('.list-item-container').on('click', function(){
            gotoRecompensaDetalle( $(this).attr('rel'), current_list );
        });

        var i = 0;
        $(mainnavigator.getCurrentPage().element[0]).find('.list-item-container').each( function() {

            if(current_list.items[i].gane_recompensa) {

                $(this).find('.validar').addClass('button').append('Validar');
                $(this).find('.validar').attr('rel', current_list.items[i].gane_recompensa);
                $(this).find('.validar').attr('id', 'recompensa_' + current_list.items[i].gane_recompensa);

                $(this).find('.validar').on('click', function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    pagar_recompensa($(this).attr('id'), this);
                });
            } else {

                $(this).find('.validar').removeClass('button');
            }

            i ++;
        });

        ons.compile($(mainnavigator.getCurrentPage().element[0]).find('#recompensas_content')[0]);

        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#recompensasScroll').attr('id', 'recompensasScroll' + counterPlanes);

        initScroll('recompensasScroll' + counterPlanes);

    })
});

function goBackFromProfile() {
    var user = COOKIE;

    if( isLogin() ) {

        if( $.trim(user.email) == '' ) {

            showAlert("Hemos detectado que no tienes un email asociado a tu cuenta. Para poder seguir por favor debes rellenar tu email, as\u00ED cuando ganes una recompensa podremos estar en contacto. Gracias", "Aviso", "Aceptar");

        } else {

            mainnavigator.popPage('perfil.html');
        }

    } else if( LOGIN_INVITADO ) {

        mainnavigator.popPage('perfil.html');
    }
}

function pagar_recompensa(id, element){
    navigator.notification.confirm(
        "\u00BFSeguro que quieres VALIDAR? S\u00F3lo el responsable del local puede hacer este proceso. Si validas sin estar en el local perder\u00E1s tu recompensa.", // message
        function(buttonIndex){
            //1:aceptar,2:cancelar
            if(buttonIndex == 1){

                getJsonP(api_url + 'setPagado/', function(data) {

                    if(data){

                        if(data.status == 'success'){

                            $(element).html('');

                            showAlert(data.mensaje, "Aviso", "Aceptar");
                        }else{
                            showAlert(data.mensaje, "Error", "Aceptar");
                        }
                    }

                }, function() {

                }, {
                    id: id
                });

                $.getJSON(BASE_URL_APP + 'usuarios_recompensas/mobileSetPagado/'+id, function(data) {

                    if(data){
                        //ocultamos loading
                        $.mobile.loading( 'hide' );

                        if(data.success){
                            var element = $("#"+id+".validar_recompensa")
                            element.hide();
                            element.parent().parent().find(".ui-icon-arrow-r").css("top","50%");
                            showAlert(data.mensaje, "Aviso", "Aceptar");
                        }else{
                            showAlert(data.mensaje, "Error", "Aceptar");
                        }
                    }
                });
            }
        },            // callback to invoke with index of button pressed
        'Validar Recompensa',           // title
        'Aceptar,Cancelar'         // buttonLabels
    );
}

function gotoRecompensaDetalle(index, current_list) {

    if (current_page != 'recompensa.html') {

        current_page = 'recompensa.html';
        setTimeout(function(){current_page = '';}, 100);

        mainnavigator.pushPage('recompensa.html', {current_recompensa: current_list.items[index]});
    }
}

var RecompensaController;
module.controller('RecompensaController', function ($scope) {
    ons.ready(function () {

        current_page = 'recompensa.html';
        setTimeout(function(){current_page = '';}, 100);

        var current_recompensa = mainnavigator.getCurrentPage().options.current_recompensa;

        RecompensaController = this;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaHeader').css('min-height', (footerHeight - 8) + 'px');

        footerHeight = factor * $(mainnavigator.getCurrentPage().element[0]).find('#recompensaFooter').outerHeight();

        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaFooter .banner').height(footerHeight);

        /*$('.header-logo').width($('.header-logo').width() * factor);
         $('.header-logo').height($('.header-logo').height() * factor);*/

        height = $(window).height() - ( 200 * factor + $(mainnavigator.getCurrentPage().element[0]).find('#recompensaFooter').outerHeight() + $(mainnavigator.getCurrentPage().element[0]).find('#recompensaHeader').outerHeight() - 1 );

        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaImages').height(height);
        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaToolbar').height(height);

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (height + $('#recompensaHeader').outerHeight() ) + 'px');
        //$('#recompensaPage .page__content').css('bottom', (footerHeight +'px') );

        //$('#recompensaScroll').height($('#recompensaScroll').height() - footerHeight);

        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaList').css('padding-bottom', footerHeight + 'px');


        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#recompensaImages')[0], current_recompensa.images, 'slider_recompensa');
        loadIntoTemplate($(mainnavigator.getCurrentPage().element[0]).find('#recompensaPaginator')[0], current_recompensa.images, 'slider_paginator');

        if (current_recompensa.condicion != '') {
            $(mainnavigator.getCurrentPage().element[0]).find('#recompensaCondicion').html('<h4>Condición</h4><p align="left">' + current_recompensa.condicion + '</p>');
        }

        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaComprar').on('click', function () {

            comprarRecompensa(current_recompensa.local_id, current_recompensa.id);
        });

        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaLlamar').on('click', function () {

            actionCall(current_recompensa.telefono);

        });

        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaVerLocal').on('click', function () {

            mainnavigator.pushPage('local.html', {current_local: current_recompensa});
        });

        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaMaps').on('click', function () {

            gotoMaps(current_recompensa);
        });


        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaPaginator > div:first-child').addClass('selected');

        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaDescripcion').html(current_recompensa.descripcion);
        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaDireccion').html(current_recompensa.direccion);

        RecompensaController.carouselPostChange = function () {
            $(mainnavigator.getCurrentPage().element[0]).find('#recompensaPaginator > div').removeClass('selected');
            $(mainnavigator.getCurrentPage().element[0]).find('#recompensaPaginator > div:nth-child(' + (recompensaImages.getActiveCarouselItemIndex() + 1) + ')').addClass('selected');
        };

        setTimeout(function () {

            recompensaImages.on('postchange', RecompensaController.carouselPostChange);

        }, 1000);

        ons.compile($(mainnavigator.getCurrentPage().element[0]).find('#recompensa_content')[0]);

        counterPlanes += 1;

        $(mainnavigator.getCurrentPage().element[0]).find('#recompensaScroll').attr('id', 'recompensaScroll' + counterPlanes);

        initScroll('recompensaScroll' + counterPlanes);

    })
});

function gotoPerfil() {

    if(current_page != 'perfil.html') {

        current_page = 'perfil.html';
        setTimeout(function(){current_page = '';}, 100);

        mainnavigator.pushPage('perfil.html');
    }
}

var PerfilController;
var recibir_alertas;
module.controller('PerfilController', function ($scope) {
    ons.ready(function () {

        setTimeout(function () {

            try {
                navigator.splashscreen.hide();
            } catch (error) {
            }

        }, 1000);

        var user = COOKIE;

        PerfilController = this;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#perfilHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#perfilHeader').css('min-height', (footerHeight - 8) + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (footerHeight - 8) + 'px');

        if(isLogin()) {

            recibir_alertas = user.recibir_alertas == '1';

            $(mainnavigator.getCurrentPage().element[0]).find('.login_options').find("."+user.registrado_mediante).parent().show();

            initScroll('perfilScroll');

            if ($.trim(user.email) == "") {
                showAlert("Hemos detectado que no tienes un email asociado a tu cuenta. Para poder seguir por favor debes rellenar tu email, as\u00ED cuando ganes una recompensa podremos estar en contacto. Gracias", "Aviso", "Aceptar");
            }

            if(recibir_alertas) {

                $(mainnavigator.getCurrentPage().element[0]).find('#btnAlertas .text').text('DESACTIVAR NOTIFICACIONES');

            } else {

                $(mainnavigator.getCurrentPage().element[0]).find('#btnAlertas .text').text('ACTIVAR NOTIFICACIONES');

            }

            $(mainnavigator.getCurrentPage().element[0]).find('#user_email').val(user.email);

            $(mainnavigator.getCurrentPage().element[0]).find('#userPoints').html(user.puntos_acumulados + ' Puntos' + '<i class="down_arrow"></i>');

            var toggling = false;
            $(mainnavigator.getCurrentPage().element[0]).find('#userPoints').on('click', function() {

                if(!toggling) {

                    toggling = true;

                    $(mainnavigator.getCurrentPage().element[0]).find('#points_list').slideToggle(200, function () {

                        refreshPerfilScroll();

                        toggling = false;
                    });

                    $(mainnavigator.getCurrentPage().element[0]).find('.down_arrow').toggleClass('up');
                }
            });

            for(var i in applicationParams.ciudades) {

                var selected = (applicationParams.ciudades[i].id == CIUDAD_ID) ? 'selected="selected"' : '' ;

                $(mainnavigator.getCurrentPage().element[0]).find('#perfil_ciudad').append('<option value="' + applicationParams.ciudades[i].id + '" ' + selected + ' >' +
                    applicationParams.ciudades[i].title + '</option>');
            }

            $(mainnavigator.getCurrentPage().element[0]).find('#perfil_ciudad').parent().find('.text').text( $(mainnavigator.getCurrentPage().element[0]).find('#perfil_ciudad option:selected').text() );
            $(mainnavigator.getCurrentPage().element[0]).find('#perfil_ciudad option:selected').text();

            refreshZonasAndPoints();

        } else if(LOGIN_INVITADO){

            alertaInvitado();
        }
    });
});

function saveAlertas() {

    if(!configurando_alertas) {

        configurando_alertas = true;

        var user = COOKIE;
        var data = $('#zonas').serializeArray();

        data.push({
            name: 'usuario_id',
            value: user.id
        });

        getJsonP(api_url + 'saveAlertas/', function (data) {

            configurando_alertas = false;

            if (data.status == 'success') {

                showAlert(data.mensaje, "Aviso", "Aceptar");

            } else {

                showAlert(data.mensaje, "Error", "Aceptar");

            }

        }, function () {

            configurando_alertas = false;

        }, data);
    }
}

function refreshZonasAndPoints() {

    reloadZonas();
}

var configurando_alertas = false;
function ActivarDesactivarAlertas() {

    if(!configurando_alertas) {

        configurando_alertas = true;

        var user = COOKIE;

        if (recibir_alertas) {

            navigator.notification.confirm(
                "Estas seguro que quieres dejar de recibir alertas?", // message
                function (buttonIndex) {

                    configurando_alertas = false;

                    //1:aceptar,2:cancelar
                    if (buttonIndex == 1) {
                        showLoadingCustom('Espere por favor...');

                        getJsonP(api_url + 'setAlerta/', function (data) {

                            if (data) {
                                if (data.status == 'success') {

                                    recibir_alertas = data.recibir_alertas;

                                    if (recibir_alertas) {

                                        $('#btnAlertas .text').text('Dejar de recibir alertas');

                                    } else {

                                        $('#btnAlertas .text').text('Recibir alertas');

                                    }
                                    //re-escribimos la cookie con el nuevo recibir_alertas
                                    reWriteCookie("user", "recibir_alertas", data.recibir_alertas);
                                    showAlert(data.mensaje, "Aviso", "Aceptar");

                                } else {

                                    showAlert(data.mensaje, "Error", "Aceptar");
                                }
                            }

                        }, function () {

                        }, {
                            usuario_id: user.id
                        });
                    }
                },            // callback to invoke with index of button pressed
                'Salir',           // title
                'Aceptar,Cancelar'         // buttonLabels
            );

        } else {

            getJsonP(api_url + 'setAlerta/', function (data) {

                configurando_alertas = false;

                if (data) {

                    if (data.status == 'success') {
                        recibir_alertas = data.recibir_alertas;

                        if (recibir_alertas) {
                            $('#btnAlertas .text').text('Dejar de recibir alertas');
                        } else {
                            $('#btnAlertas .text').text('Recibir alertas');
                        }

                        //re-escribimos la cookie con el nuevo recibir_alertas
                        reWriteCookie("user", "recibir_alertas", data.recibir_alertas);
                        showAlert(data.mensaje, "Aviso", "Aceptar");
                    } else {
                        showAlert(data.mensaje, "Error", "Aceptar");
                    }
                }

            }, function () {

                configurando_alertas = false;

            }, {
                usuario_id: user.id
            });
        }

    }
}

var editando_email = false;
function cambiarEmail() {

    if(!editando_email) {

        editando_email = true;

        var user = COOKIE;
        var email = $.trim($("#user_email").val());

        if (valEmail(email)) {

            getJsonP(api_url + 'changeEmail/', function (data) {

                if (data.status == 'success') {

                    showAlert(data.mensaje, "Aviso", "Aceptar", function(){ editando_email = false; });

                    COOKIE.email = data.new_email;

                    //re-escribimos la cookie con el nuevo email
                    reWriteCookie("user", "email", data.new_email);

                } else {

                    showAlert(data.mensaje, "Error", "Aceptar", function(){ editando_email = false; });
                }

            }, function () {

            }, {
                usuario_id: user.id,
                email: email
            });

        } else {

            showAlert("Por favor ingrese un email valido!.", "Mensaje", "Aceptar", function(){ editando_email = false; });
        }
    }
}

function cambiarCiudad(dropdown, event) {

    var user = COOKIE;

    ciudad_seleccionada = $(dropdown).val();

    getJsonP(api_url + 'setCiudad/', function(data) {

        if( data.status == 'success' ){

            showAlert(data.mensaje, "Aviso", "Aceptar");

            CIUDAD_ID = ciudad_seleccionada = data.ciudad_id;

            $('#perfil_ciudad').parent().find('.text').text( $('#perfil_ciudad option:selected').text() );
            $('#perfil_ciudad option:selected').text();

            //re-escribimos la cookie con la nueva ciudad
            reWriteCookie("user","ciudad_id",data.ciudad_id);

            $('#zonas').html('');

            reloadZonas();

        } else {

            showAlert(data.mensaje, "Error", "Aceptar");
        }

    }, function() {

    }, {
        usuario_id: user.id,
        ciudad_id: $(dropdown).val()
    });
}

function reloadZonas() {

    var user = COOKIE;

    $('#zonas').html('');

    getJsonP(api_url + 'getZonas/', function(data) {
        if(data.items){

            //mostramos loading
            var alertas = data.alertas;
            var html = "";

            if(data.items.length){

                $.each(data.items, function(index, item) {

                    var checked='';

                    if(alertas == false) {

                        checked='checked="checked"';

                    } else if (item.recibir == true) {

                        checked = 'checked="checked"';
                    }

                    var str = '<label class="checkbox btn">'+
                        '<input name="zonas[]" type="checkbox" class="" value="' + item.id + '" ' + checked + ' >'+
                    '<div class="checkbox__checkmark"></div>'+
                    '<span class="ons-checkbox-inner text fixed4">' + item.title + '</span>'+
                    '</label>';

                    $('#zonas').append(str);

                });

            } else {

            }

            $('#points_list').html('');

            if(data.puntos.length) {

                $.each(data.puntos, function(index, item) {

                    var str = '<div class="point_row"><span class="text">' + item.local_title + '</span><b>' + item.puntos + ' Puntos</b></div>';

                    $('#points_list').append(str);

                });
            }

            refreshPerfilScroll();
        }
    }, function() {

    }, {
        usuario_id: user.id,
        ciudad_id: CIUDAD_ID
    });
}

function refreshPerfilScroll() {
    scrolls.perfilScroll.refresh();
}

var EmailController;
var operacion_registro = false;
module.controller('EmailController', function ($scope) {
    ons.ready(function () {

        EmailController = this;

        var factor = window.innerWidth / 320;

        var footerHeight = factor * 60;
        $(mainnavigator.getCurrentPage().element[0]).find('#emailHeader').height(footerHeight - 8);
        $(mainnavigator.getCurrentPage().element[0]).find('#emailHeader').css('min-height', (footerHeight - 8) + 'px');

        $(mainnavigator.getCurrentPage().element[0]).find('.page__content').css('top', (footerHeight - 8) + 'px');

        initScroll('emailScroll');


        $(mainnavigator.getCurrentPage().element[0]).find('#btnRegistrarse').on('click', function () {

            autentificarUsuario('registro');
        });

        $(mainnavigator.getCurrentPage().element[0]).find('#btnAcceder').on('click', function () {

            autentificarUsuario('accedor');
        });
    });
});


function autentificarUsuario(boton) {

    if(!operacion_registro) {

        operacion_registro = true;

        var email = $.trim($('#email_email').val());
        var password = $.trim($('#email_password').val());
        var codigo = $.trim($('#email_codigo').val());

        if (email == '') {
            showAlert('Email es requerido', 'Error', 'Aceptar', function(){ operacion_registro = false; });
            return;
        }

        if (!/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$/.exec(email)) {
            showAlert('Email inválido', 'Error', 'Aceptar', function(){ operacion_registro = false; });
            return;
        }

        if (password == '') {
            showAlert('Password es requerido', 'Error', 'Aceptar', function(){ operacion_registro = false; });
            return;
        }

        if ($('#btnRegistrarse').css('visibility') == 'hidden' && codigo == '') {
            showAlert('Codigo es requerido', 'Error', 'Aceptar', function(){ operacion_registro = false; });
            return;
        }

        if (boton == 'registro') { // Nuevo registro

            var data;

            try {

                data = {
                    u_email: email,
                    u_password: password,
                    u_login_con: 'email',
                    d_plataforma: device ? device.platform: 'ios',
                    d_version: device ? device.version : '7',
                    d_uuid: device ? device.uuid : 'asdasd',
                    d_name: devide ? device.name : 'iPhone',
                    u_token_notificacion: PUSH_NOTIFICATION_TOKEN
                };

            } catch(error) {

                data = {
                    u_email: email,
                    u_password: password,
                    u_login_con: 'email'
                };
            }



            getJsonP(api_url + 'newRegistro/', function (data) {

                operacion_registro = false;

                if (data.status == 'success') {

                    $("#codigo_validacion").show();
                    $('#btnRegistrarse').hide();
                    showAlert(data.mensaje, 'Aviso', 'Aceptar');

                } else {

                    showAlert(data.mensaje, 'Error', 'Aceptar');
                }

            }, function () {

                operacion_registro = false;

            }, data);

        } else { // Logueo

            getJsonP(api_url + 'login/', function (data) {

                operacion_registro = false;

                if (data.status == 'success' && data.validado) {

                    var usuario = data.usuario;

                    //guardamos los datos en la COOKIE
                    createCookie("user", JSON.stringify(usuario), 365);

                    //mandamos directo al home si es que la cookie se creo correctamente
                    if (isLogin()) {

                        $('#email_email').val('');
                        $('#email_password').val('');
                        $('#email_codigo').val('');

                        $('#btnRegistrarse').css('visibility', 'hidden');
                        $("#codigo_validacion").hide();

                        if(usuario.ciudad_id != '' || usuario.ciudad_id != '0') {

                            mainnavigator.popPage('email.html');
                            goHome(usuario.ciudad_id, false);

                        } else {

                            mainnavigator.pushPage('ciudad.html');
                        }
                    }

                } else {

                    if (data.status == 'success' && data.validado == false) {

                        $('#btnRegistrarse').show();
                        $("#codigo_validacion").show();

                        if (data.codigo_validacion != "") {

                            showAlert("El c\u00F3digo de confirmaci\u00F3n, que introdujo es err\u00F3neo. Por favor verifique o ingrese nuevamente el c\u00F3digo de confirmaci\u00F3n.", 'Aviso', 'Aceptar');

                        } else {

                            showAlert(data.mensaje, 'Aviso', 'Aceptar');
                        }
                    } else {

                        showAlert(data.mensaje, 'Error', 'Aceptar');
                    }
                }

            }, function () {

                operacion_registro = false;

            }, {
                email: email,
                password: password,
                codigo_validacion: codigo
            });
        }
    }
}


function compare(a, b) {
    if (parseInt(moment(a.date, "YYYY-MM-DD").format("x")) > parseInt(moment(b.date, "YYYY-MM-DD").format("x")))
        return 1;
    return 0;
}


function getArrayAsObjects(array, width, height) {
    var result = [];

    width = width * 2;
    height = height * 2;

    for (var i in array) {
        result.push({list_image: array[i]});
    }

    return result;
}


function alert(message, title, button, callback) {
    ons.notification.alert({
        message: message,
        // or messageHTML: '<div>Message in HTML</div>',
        title: title ? title : 'Mensaje',
        buttonLabel: button ? button : 'OK',
        animation: 'default', // or 'none'
        // modifier: 'optional-modifier'
        callback: callback ? callback : function () {
            // Alert button is closed!
        }
    });
}


function fixGuestListItem(height) {

    $('#styleguest').remove();

    $('body').append(
        '<style id="styleguest" type="text/css">' +
        '.guest_list_item {' +
        'position:relative;' +
        'height:' + (height) + 'px;' +
        '}' +
        '</style>'
    );
}

function fixModalBottomHeight(height) {

    $('#stylemodal').remove();

    $('body').append('<style id="stylemodal" type="text/css">.bottom-dialog .dialog {min-height: ' + height + ';}</style>');
}

var scrolls = {};
function initScroll(div) {

    if (!scrolls[div]) {

        scrolls[div] = new iScroll(div, {
            momentum: true,
            hScrollbar: false,
            vScrollbar: false,
            click: true,
            tap: true,
            checkDOMChanges: true
        });

    } else {

        scrolls[div].scrollTo(0, 0);
        setTimeout(function () {
            scrolls[div].destroy();
            scrolls[div] = new iScroll(div, {
                momentum: true,
                hScrollbar: false,
                vScrollbar: false,
                click: true,
                tap: true,
                checkDOMChanges: true
            });
        }, 10);
    }
}

function updateContent(el, data) {
    el.innerHTML = data;
}

function getLabels() {
    return labels[applicationLanguage];
}

function requestFocus(input, event) {
    $(input).focus();
}

$(document).unbind('click').on('click', 'a[target="_blank"]', function (ev) {
    var url;

    url = $(this).attr('href');

    openExternalLink(url, ev);
});

var currentLink;
var isExternalShowing = false;
function openExternalLink(url, e) {

    if(!isExternalShowing) {

        isExternalShowing = true;
        setTimeout(function(){ isExternalShowing = false; }, 100);

        currentLink = url;

        try {

            window.plugins.ChildBrowser.showWebPage(url,
                {showLocationBar: true});

            window.plugins.ChildBrowser.onClose = function () {
                isExternalShowing = false;
            };

        } catch (error) {

            window.open(url, '_blank', 'location=yes,closebuttoncaption=Salir');
            //splash.pushPage('external.html', {});
        }

        if (e != undefined) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
}

function openPdf(url) {
    try {

        window.plugins.ChildBrowser.showWebPage(url,
            {showLocationBar: true});

    } catch (error) {

        window.open(url, '_system');
        //splash.pushPage('external.html', {});
    }
}