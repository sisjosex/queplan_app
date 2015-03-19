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

window.onresize = function(){
    resizeCardCarousel();
};


//REALIZAMOS EL CHECK-IN
function checkIn(urlamigable){
    //volvemos a recalcular la ubicacion 
    getLocationGPS();
    
    //verficamos que este logeado porque solo si lo esta podemos dejarle que haga check-in
    if(isLogin()){
        var user = COOKIE;
        var me = user.id;
        
        showLoadingCustom('Estoy Aqu\u00ED, en progreso...');
        
    	$.getJSON(BASE_URL + 'checkIn/'+me+'/'+urlamigable, function(data) {
            
            if(data){
                //ocultamos loading
                $.mobile.loading( 'hide' );
                
                if(data.success){
                    var imagen = BASE_URL_APP+'img/logo_oficial.png';
                    
                    //re-escribimos la cookie con los puntos totales
                    reWriteCookie("user","puntos_acumulados",data.total_puntos_acumulados);
		    reWriteCookie("user","Puntos",data.puntos);
                    
                    //mostramos el mensaje de success y al cerrar mostramos la pantalla de compartir
                    //que puede ser de facebook o twitter
                    navigator.notification.alert(
                        data.mensaje,           // message
                        function(){
                            if(user.registrado_mediante == "facebook"){
                                /*
                                setTimeout(function(){
                                    shareFacebookWallPost(data.subtitulo, data.descripcion, imagen);
                                },500);
                                */
                            }else if(user.registrado_mediante == "twitter"){
                                setTimeout(function(){
                                    shareTwitterWallPost(data.subtitulo, data.descripcion, imagen);
                                },500);
                            }
                        },         // callback
                        "AQU\u00CD ESTOY!", // title
                        "Aceptar"               // buttonName
                    );
                    
                }else{
                    showAlert(data.mensaje, "AQU\u00CD ESTOY NO DISPONIBLE", "Aceptar");
                }
            }
    	});
    
    }else if(LOGIN_INVITADO){
        alertaInvitado();
    }
}


function registrar_datos(app_id, email, registrado_mediante, username, nombre, imagen, genero){

    getJsonP(api_url + 'newRegistro/', function() {

        var success = data.status == 'success';
        if(success){
            var usuario = data.usuario;
            var usuario_id = usuario.id;

            //una vez creado guardamos en cookies su datos importantes
            createCookie("user", JSON.stringify(usuario), 365);

            //una vez registrado los datos, mandamos a la home
            mainnavigator.pushPage('ciudad.html');

        }else{
            showAlert('Ha ocurrido un error al momento de registrarse!, por favor intente de nuevo', 'Error', 'Aceptar');
        }

    }, function() {

        showAlert("error", 'registrar_datos', 'Aceptar');

    }, {
        u_app_id:app_id,
        u_email:email,
        u_login_con:registrado_mediante,
        u_username:username,
        u_nombre:nombre,
        u_imagen:imagen,
        u_genero:genero,
        d_plataforma:device.platform,
        d_version:device.version,
        d_uuid:device.uuid,
        d_name:device.name,
        u_token_notificacion:PUSH_NOTIFICATION_TOKEN,
        ciudad_id: ciudad_seleccionada
    });
}

function comprarRecompensa(local_id, recompensa_id){
    //verficamos que este logeado porque solo si lo esta podemos dejarle que haga la compra de la recompensa
    if(isLogin()){
        var user = COOKIE;
        var me = user.id;
        
        showLoadingCustom('Compra de recompensa, en progreso...');
        
    	$.getJSON(BASE_URL_APP + 'recompensas/comprarRecompensa/'+me+'/'+local_id+'/'+recompensa_id, function(data) {
            
            if(data){
                //ocultamos loading
                $.mobile.loading( 'hide' );
                
                if(data.success){
                    var imagen = BASE_URL_APP+'img/logo_oficial.png';
                    
                    //re-escribimos la cookie con los puntos restantes
                    reWriteCookie("user","puntos_acumulados",data.total_puntos_restantes);
                    reWriteCookie("user","Puntos",data.puntos);
                    
                    //mostramos el mensaje de success y al cerrar mostramos la pantalla de compartir
                    //que puede ser de facebook o twitter
                    navigator.notification.alert(
                        data.mensaje,           // message
                        function(){
                            if(user.registrado_mediante == "facebook"){
                                /*
                                setTimeout(function(){
                                    shareFacebookWallPost(data.subtitulo, data.descripcion, imagen);
                                },500);
                                */
                            }else if(user.registrado_mediante == "twitter"){
                                setTimeout(function(){
                                    shareTwitterWallPost(data.subtitulo, data.descripcion, imagen);
                                },500);
                            }
                        },         // callback
                        "Compra Realizada!",    // title
                        "Aceptar"               // buttonName
                    );
                    
                }else{
                    showAlert(data.mensaje, "Compra no disponible", "Aceptar");
                }
            }
    	});
    
    }else if(LOGIN_INVITADO){
        alertaInvitado();
    }
}

function logout(){
    if(isLogin()){
        navigator.notification.confirm(
            "Estas seguro que quieres salir?", // message
            function(buttonIndex){
                //1:aceptar,2:cancelar
                if(buttonIndex == 1){
                    showLoadingCustom('Espere por favor...');
                    
                    var user = COOKIE;
                    var me = user.id;
                    
                	$.getJSON(BASE_URL_APP + 'logout/'+me, function(data) {
                        
                        if(data){
                            //ocultamos loading
                            $.mobile.loading( 'hide' );
                            
                            if(data.success){
                                //logout de fb y tw
                                logoutFacebookConnect();
                                
                                eraseCookie("user");
                                redirectLogin();
                            }else{
                                showAlert(data.mensaje, "Error", "Aceptar");
                            }
                        }
                	});
                }
            },            // callback to invoke with index of button pressed
        'Salir',           // title
        'Aceptar,Cancelar'         // buttonLabels
        );
    }else if(LOGIN_INVITADO){
        alertaInvitado();
    }
}

function mobileCheckDistance(){
    //volvemos a recalcular la ubicacion 
    getLocationGPS();
        
    if(isLogin()){
        var user = COOKIE;
        var app_id = user.app_id;
        
        //verificamos si esta a distancia para que se le envie una alerta automatica
    	$.getJSON(BASE_URL_APP + 'checkDistance/'+app_id+'/'+LATITUDE+"/"+LONGITUDE, function(data) {
    	   //respuesta
    	   if(data){
    	       //alert(JSON.stringify(data))
    	       //console.log(data);
    	   }
        });
    }
}

//verificamos si hay notificaciones pendiente de mostrar
function verifyNotification(){
    //si tiene una notificacion pendiente la mostramos
    if(HAVE_NOTIFICATION){
        setTimeout(function(){
            showNotification(EVENT, TYPE_NOTIFICATION);
        },800);
        HAVE_NOTIFICATION = false;
    }
}

//showNotification
function showNotification(event, type){
    var message = type == "android" ? event.message : event.alert;
    var seccion = type == "android" ? event.payload.seccion : event.seccion;
    var seccion_id = type == "android" ? event.payload.seccion_id : event.seccion_id;
    
    navigator.notification.alert(
        message,
        function(){
            redirectToPage(seccion, seccion_id);
        },
        "Alert",
        "Aceptar"
    );
}

//redirectToPage
function redirectToPage(seccion, id){
    var page = "";
    if(seccion == "local"){
        page = "#guia"
        if(id != ""){
            page = "local_descripcion.html?id="+id;
        }        
    }else if(seccion == "plan"){
        page = "planes.html";
        if(id != ""){
            page = "plan_descripcion.html?id="+id;
        }
    }else if(seccion == "recompensa"){
        page = "#recompesas";
        if(id != ""){
            page = "recompensa_descripcion.html?id="+id;
        }
    }
    
    if(seccion != ""){
        setTimeout(function(){
            $.mobile.changePage(page);
        },400);
    }else{
        //TODO
    }
}

function loginInvitado(){
    LOGIN_INVITADO = true;
    mainnavigator.pushPage('ciudad.html');
}

function goHome(ciudad_id){
    CIUDAD_ID = ciudad_id;
    
    //se guarda la ciudad
    if(isLogin()){
        var user = COOKIE;
        var me = user.id;
        
    	$.getJSON(BASE_URL_APP + 'usuarios/mobileSetCiudad/'+me+"/"+CIUDAD_ID, function(data) {
            
            if(data){
                if(data.success){
                    //showAlert(data.mensaje, "Aviso", "Aceptar");
                    //re-escribimos la cookie con la nueva ciudad
                    reWriteCookie("user","ciudad_id",data.ciudad_id);
                }else{
                    //showAlert(data.mensaje, "Error", "Aceptar");
                }
            }
    	});
    }
    
    $.mobile.changePage('#home');
}

function alertaInvitado(){
    navigator.notification.alert(
        "Hemos detectado que est\u00E1s navegando como invitado, para ingresar a esta secci\u00F3n debes hacer login",           // message
        function(){
            $.mobile.changePage('#view');
        },         // callback
        "INVITADO", // title
        "Aceptar"               // buttonName
    );
}

//REGISTRAMOS LOS DATOS CUANDO SE REALIZA EL REGISTRO CON EMAL
function registrar_email(container, email, password){
    $.ajax({
        data: {u_email:email, u_password:password, u_login_con:'email', d_plataforma:device.platform, d_version:device.version, d_uuid:device.uuid, d_name:device.name, u_token_notificacion:PUSH_NOTIFICATION_TOKEN},
        type: "POST",
        url: BASE_URL_APP + 'usuarios/mobileNewRegistro',
        dataType: "html",
        success: function(data){
            //ocultamos el loading
            $.mobile.loading( 'hide' );
            data = $.parseJSON(data);
            
            var success = data.success;
            if(success){
                container.find(".codigovalidacion").show();
                container.find(".registrarse").hide();
                showAlert(data.mensaje, 'Aviso', 'Aceptar');
            }else{
                showAlert(data.mensaje, 'Error', 'Aceptar');
            }
        },
        beforeSend : function(){
            //mostramos loading
            showLoadingCustom('Guardando datos...');
        }
    });
}

//LOGIN PARA EL REGISTRO POR EMAIL
function login_email(container, formulario){
    $.ajax({
        data: formulario.serialize(), 
        type: "POST",
        url: BASE_URL_APP + 'usuarios/mobileLogin',
        dataType: "html",
        success: function(data){
            //ocultamos el loading
            $.mobile.loading( 'hide' );
            data = $.parseJSON(data);
            
            var success = data.success;
            var validado = data.validado;
            if(success && validado){
    	        var usuario = data.usuario.Usuario;
                //guardamos los datos en la COOKIE
    	        createCookie("user", JSON.stringify(usuario), 365);
                //mandamos directo al home si es que la cookie se creo correctamente
                if(isLogin()){
                    document.getElementById("form_registro_email").reset();
                    container.find(".registrarse").hide();
                    container.find(".codigovalidacion").hide();
                    $.mobile.changePage('#ciudades');
                }
            }else{
                if(success == true && validado == false){
                    container.find(".codigovalidacion").show();
                    container.find(".registrarse").hide();
                    if(data.codigo_validacion != ""){
                        showAlert("El c\u00F3digo de confirmaci\u00F3n, que introdujo es err\u00F3neo. Por favor verifique o ingrese nuevamente el c\u00F3digo de confirmaci\u00F3n.", 'Aviso', 'Aceptar');
                    }else{
                        showAlert(data.mensaje, 'Aviso', 'Aceptar');
                    }
                }else{
                    showAlert(data.mensaje, 'Error', 'Aceptar');
                }
            }
        },
        beforeSend : function(){
            //mostramos loading
            showLoadingCustom('Validando datos...');
        }
    });
}

//Pagar Recompensa
function pagar_recompensa(id){
    navigator.notification.confirm(
        "\u00BFSeguro que quieres VALIDAR? S\u00F3lo el responsable del local puede hacer este proceso. Si validas sin estar en el local perder\u00E1s tu recompensa.", // message
        function(buttonIndex){
            //1:aceptar,2:cancelar
            if(buttonIndex == 1){
                showLoadingCustom('Espere por favor...');
                
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


function getValidarDeviceUuid(parent_id, device_uuid, token_notificacion){
    var parent = $("#"+parent_id);
        
	$.getJSON(BASE_URL_APP + 'usuarios/validarDeviceUuid/'+device_uuid+'/'+token_notificacion, function(data) {
	    //mostramos loading
        $.mobile.loading('show');
       	   
	    if(data.success){
	        APP_INITIALIZED = true;
	        var usuario = data.usuario;
            //guardamos los datos en la COOKIE
	        createCookie("user", JSON.stringify(usuario), 365);
            //mandamos directo al home si es que la cookie se creo correctamente y tiene ciudad_id seleccionada
            //sino le pedimos que se logee con fb o tw
            //recuperamos los datos de ciudad
            var usuario_ciudad = data.usuario.Usuario.ciudad_id;
            //usuario_ciudad = '0';
            if(usuario_ciudad && usuario_ciudad!='0'){
                CIUDAD_ID = usuario_ciudad;
                if(isLogin()){
                    $.mobile.changePage('#home');
                }
            }else{
                $.mobile.changePage('#ciudades');
            }
        }else{
            //ocultamos loading
            $.mobile.loading( 'hide' );
            parent.find(".ui-header").fadeIn("slow");
            parent.find(".ui-content").fadeIn("slow");
        }
	});
}

function isLogin(){
    var res = false;
    var cookie_user = $.parseJSON(readCookie("user"));
    if(cookie_user !== null){
        res = true;
        COOKIE = cookie_user;
    }else{
        REDIREC_TO = window.location.href;
    }
    return res;
}

//redirectLogin
function redirectLogin(){
    $("#view").find(".ui-header").fadeIn("slow");
    $("#view").find(".ui-content").fadeIn("slow");
    $.mobile.changePage('#view');
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //pause
        document.addEventListener("pause", this.onPause, false);
        //resume
        document.addEventListener("resume", this.onResume, false);        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //Hide the statusbar
        try {
            StatusBar.hide();
        }catch(error){}

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

        } catch(error){}

        if(pushNotification != undefined) {

            if (device.platform == 'android' || devi+ce.platform == 'Android') {
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
        }
    },
    // result contains any message sent from the plugin call
    successHandler: function(result) {
        //console.log("Regid " + result);
        //alert('Callback Success! Result = '+result);
    },
    errorHandler:function(error) {
        alert(error);
    },
    tokenHandler:function(result) {
        PUSH_NOTIFICATION_REGISTER = 'ios';
        
        //solo si no se lleno antes con el token llenamos, porque viene otro tipo de mensajes igual
        if(PUSH_NOTIFICATION_TOKEN == 0){
            PUSH_NOTIFICATION_TOKEN = result;
            //alert(PUSH_NOTIFICATION_TOKEN);
            //mandamos a guardar el token para las notificaciones solo si no se guardo antes
            if(!APP_INITIALIZED){
                getValidarDeviceUuid("view", device.uuid, PUSH_NOTIFICATION_TOKEN);
            }
        }
        //console.log("Regid " + result);
        //alert('Callback Success! Result = '+result);
    },    
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    PUSH_NOTIFICATION_REGISTER = 'android';
                    PUSH_NOTIFICATION_TOKEN = e.regid;
                    //console.log("Regid " + e.regid);
                    //alert('registration id = '+e.regid);
                    
                    //mandamos a guardar el token para las notificaciones solo si no se guardo antes
                    if(!APP_INITIALIZED){
                        getValidarDeviceUuid("view", device.uuid, PUSH_NOTIFICATION_TOKEN);
                    }
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              //alert('message = '+e.message+' msgcnt = '+e.msgcnt);
                if(APP_INITIALIZED){
                    showNotification(e,'android');
                }else{
                    HAVE_NOTIFICATION = true;
                    TYPE_NOTIFICATION = 'android';
                    EVENT = e;
                }
            break;
 
            case 'error':
                alert('GCM error = '+e.msg);
            break;
 
            default:
                alert('An unknown GCM event has occurred');
            break;
        }
    },
    onNotificationAPN: function(event) {
        if (event.alert) {
            if(APP_INITIALIZED){
                showNotification(event,'ios');
            }else{
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
    onPause: function(){
        app.stopIntervalNotificacion();
    },
    onResume: function(){
        app.initIntervalNotificacion();
    },    
    initIntervalNotificacion: function(){
        INTERVAL = setInterval(function(){
            mobileCheckDistance();
        },30000); // 300000 - 5min, 30000 - 30seg
    },
    stopIntervalNotificacion: function(){
        clearInterval(INTERVAL);
    },
    scan: function() {
        if(isLogin()){
            var scanner = cordova.require("cordova/plugin/BarcodeScanner");
            scanner.scan( function (result) {
                if(result.format == "QR_CODE"){
                    if(result.text != ""){
                        var params = (result.text).toString().split("/");
                        var urlamigable = params[params.length-1].toString();
                        //Mandamos al checkIn
                        checkIn(urlamigable);
                    }else{
                        showAlert("Scanner failed, please try again.","Error","Aceptar");
                    }
                }else if(result.cancelled){
                    showAlert("Scanner Cancelled.","Error","Aceptar");
                }
            }, function (error) {
                alert("Scanning failed: ", error);
            } );
        }else if(LOGIN_INVITADO){
            alertaInvitado();
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
    if(index == 0) {
        setInterval(function(){

            if(homeSlider.getActiveCarouselItemIndex() < homeSlider._getCarouselItemCount() - 1) {

                homeSlider.next();

            } else {

                homeSlider.setActiveCarouselItemIndex(0);
            }

        }, 5000);
    }
}

function onError() {}

var current_list = [];

function openEmail(email) {

    window.open('mailto:'+email+'?subject=Contacto&body=');
}

function goToLocalizacion() {

    splash.pushPage('localizacion.html', {});
}

function goToCartaDetalle(section) {

    $('#carta_list').html('');

    loadIntoTemplate('#carta_list', carta_data[section], 'carta_list_content');

    scrolls['carta_scroll'].refresh();
}

function goToContacto() {

    splash.pushPage('contacto.html', {});
}

function goToPlanes() {

    if(current_page != 'planes.html') {

        current_page = 'planes.html';

        getJsonP(api_url + 'getPlanes/', function (data) {

            current_list = data;

            mainnavigator.pushPage('planes.html', {});

            if (current_list.list) {
            }

        }, function () {
        }, {ciudad_id: ciudad_seleccionada});

    }
}

function goToGuia() {

    if(current_page != 'guias.html') {

        current_page = 'guias.html';

        getJsonP(api_url + 'getCategorias/', function (data) {

            current_list = data;

            mainnavigator.pushPage('guias.html', {});

            if (current_list.list) {
            }

        }, function () {
        }, {ciudad_id: ciudad_seleccionada});
    }
}

function goToRecompensas() {

    if(current_page != 'recompensas.html') {

        current_page = 'recompensas.html';

        getJsonP(api_url + 'getRecompensas/', function(data){

            current_list = data;

            mainnavigator.pushPage('recompensas.html', {});

            if(current_list.list) {
            }

        }, function(){}, {ciudad_id: ciudad_seleccionada});
    }
}

function gotoMenuDiario() {

    getJsonP(api_url + 'getMenuDiario/', function(data){

        current_list = data;

        mainnavigator.pushPage('menu.html', {});

        if(current_list.list) {
        }

    }, function(){}, {ciudad_id: ciudad_seleccionada});
}

var currentPlan;
function goToPlanesDetalle(id) {

    currentPlan = current_list[id];

    mainnavigator.pushPage('plan.html', {id: id});
}

function procesarRegistro(element, event, type) {

    if(current_page != 'ciudad.html') {

        current_page = 'ciudad.html';
        mainnavigator.pushPage('ciudad.html');
    }
}

function elegirCiudad(element, event) {

    ciudad_seleccionada = applicationParams.ciudades[ciudad_images.getActiveCarouselItemIndex()].id;

    mainnavigator.pushPage('home.html');
}

function loadApplicationParams(callback) {

    try {
        StatusBar.hide();
    }catch(error){}

    getJsonPBackground(api_url + 'getParams/', function(data){

        applicationParams = data;

        callback();

    }, function(){



    }, {});
}

function refreshHomeScroll() {

    scrolls['homeScroll'].refresh();
}


function refreshGuiasScroll() {

    scrolls['guiasScroll'].refresh();
}

function refreshPlanesScroll() {

    scrolls['planesScroll'].refresh();
}

function refreshRecompensasScroll() {

    scrolls['recompensasScroll'].refresh();
}

closeDetailSession = function() {

    popPage('guest_info.html');

    currentSessionFromNotification=null;


;}

actionCall = function(phone) {

    phonedialer.dial(
        phone,
        function(err) {
            if (err == "empty") {
                alert("Unknown phone number");
            }
            else alert("Dialer Error:" + err);
        },
        function(success) {
            //alert('Dialing succeeded');
        }
    );
};

function onSliderCiudadIMGLoad(img, index) {

    var src = $(img).attr('src');
    var container = $(img).parent();

    var image = new Image();
    image.src=src;

    image.onload = function() {

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

            factor = (window.innerHeight)/height;
            width = width * factor;
            height = height * factor;
        }

        if (window.innerWidth < width ) {

            factor = window.innerHeight/height;
            width = width * factor;
            height = window.innerHeight;

            if(window.innerWidth - width > 0) {
                factor = window.innerWidth / width;
                width = window.innerWidth;
                height = height * factor;
            }


        } else if (window.innerHeight < height ) {

            factor = window.innerWidth / width;
            width = window.innerWidth;
            height = height * factor;

            if(window.innerHeight - height > 0) {
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

    var image = new Image();
    image.src=src;

    image.onload = function() {

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

        if ($('#homeImages').outerHeight() > height) {

            factor = ($('#homeImages').outerHeight())/height;
            width = width * factor;
            height = height * factor;
        }

        if (window.innerWidth < width ) {
            factor = $('#homeImages').outerHeight()/height;
            width = width * factor;
            height = $('#homeImages').outerHeight();

            if(window.innerWidth - width > 0) {
                factor = window.innerWidth / width;
                width = window.innerWidth;
                height = height * factor;
            }


        } else if ($('#homeImages').outerHeight() < height ) {
            factor = window.innerWidth / width;
            width = window.innerWidth;
            height = height * factor;

            if($('#homeImages').outerHeight() - height > 0) {
                factor = $('#homeImages').outerHeight() / height;
                height = $('#homeImages').outerHeight();
                width = width * factor;
            }
        }

        width = parseInt(width+"");
        height = parseInt(height+"");

        container.css('background-size', (width) + "px" + " " + (height) + "px");

        container.removeClass('noopaque');
    }
}

function infoAction() {
    actionCall('918538002');
}


var NavigatorController;
module.controller('NavigatorController', function($scope) {
    ons.ready(function() {

        NavigatorController = this;

        loadApplicationParams(function(){
			
			getLocationGPS();
			
			if(isLogin()){
				
				var user = COOKIE;

				if($.trim(user.email) == ""){
					mainnavigator.pushPage("perfil.html", {animation:'none'});
				}
				
			} else {
				
				mainnavigator.pushPage("registro.html", {animation:'none'});
			}
			
			app.onDeviceReady();
        });

    })
});

var RegistroController;
module.controller('RegistroController', function($scope) {
    ons.ready(function() {

        RegistroController = this;

        initScroll('registro_scroll');

        try { navigator.splashscreen.hide(); } catch(error){}

    })
});

var ciudadController;
module.controller('ciudadController', function($scope) {
    ons.ready(function() {

        CiudadController = this;

        loadIntoTemplate('#ciudad_images', applicationParams.ciudades, 'slider_ciudades');

    })
});


var HomeController;
var height;
module.controller('HomeController', function($scope) {
    ons.ready(function() {

        HomeController = $scope;

        try {
            StatusBar.hide();
        }catch(error){}

        setTimeout(function() {

            var factor = window.innerWidth/320;

            var footerHeight = factor*$('#homeFooter').outerHeight();

            $('#homeFooter .banner').height( footerHeight );
            $('#homeHeader').height( footerHeight -8 );

            $('#homeHeader').css( 'min-height', (footerHeight-8) + 'px' );

            console.log(factor);

            /*$('.header-logo').width($('.header-logo').width() * factor);
            $('.header-logo').height($('.header-logo').height() * factor);*/

            height = $(window).height() - ( $('#homeScroll').outerHeight() + $('#homeFooter').outerHeight() + $('#homeHeader').outerHeight() - 1 );

            $('#homeImages').height( height );
            $('#homeToolbar').height( height );

            $('#homePage .page__content').css('top', (height + $('#homeHeader').outerHeight() )+'px');

            loadApplicationParams(function(){

                current_page = 'main.html';

                $('#home_slider_paginator > li:nth-child(1)').addClass('selected');

                loadIntoTemplate('#homeImages', applicationParams.slider, 'slider_images');

                loadIntoTemplate('#homePaginator', applicationParams.slider, 'slider_paginator');

                $('#homePaginator > div:first-child').addClass('selected');


                HomeController.carouselPostChange = function() {
                    $('#homePaginator > div').removeClass('selected');
                    $('#homePaginator > div:nth-child(' + (homeImages.getActiveCarouselItemIndex()+1) + ')').addClass('selected');
                };

                setTimeout(function(){

                    homeImages.on('postchange', HomeController.carouselPostChange);

                }, 1000);

                ons.compile($('#homeImages')[0]);

                //ons.compile($('#homeScroll')[0]);

                initScroll('homeScroll');

                //refreshHomeScroll();

                setTimeout(function(){

                    try { navigator.splashscreen.hide(); } catch(error){}

                }, 1000);


                //registerNotifications();

            });

        }, 100);

    });
});

var PlanesController;
module.controller('PlanesController', function($scope) {
    ons.ready(function() {

        current_page = 'planes.html';

        PlanesController = this;

        var factor = window.innerWidth/320;

        var footerHeight = factor*60;
        $('#planesHeader').height( footerHeight -8 );
        $('#planesHeader').css( 'min-height', (footerHeight-8) + 'px' );

        loadIntoTemplate('#planes_content', current_list.items, 'planes_list_content');

        ons.compile($('#planes_content')[0]);

        initScroll('planesScroll');

    })
});

function gotoPlanDetalle(index) {

    if(current_page != 'plan.html') {

        current_page = 'plan.html';

        current_plan = current_list.items[index];

        mainnavigator.pushPage('plan.html');
    }
}



var PlanController;
var current_plan;
module.controller('PlanController', function($scope) {
    ons.ready(function() {

        PlanController = this;

        var factor = window.innerWidth/320;

        var footerHeight = factor*60;
        $('#planHeader').height( footerHeight -8 );
        $('#planHeader').css( 'min-height', (footerHeight-8) + 'px' );

        footerHeight = factor*$('#planFooter').outerHeight();

        $('#planFooter .banner').height( footerHeight );

        /*$('.header-logo').width($('.header-logo').width() * factor);
         $('.header-logo').height($('.header-logo').height() * factor);*/

        height = $(window).height() - ( 200*factor + $('#planFooter').outerHeight() + $('#planHeader').outerHeight() - 1 );

        $('#planImages').height( height );
        $('#planToolbar').height( height );

        $('#planPage .page__content').css('top', (height + $('#planHeader').outerHeight() )+'px');
        //$('#planPage .page__content').css('bottom', (footerHeight +'px') );

        //$('#planScroll').height($('#planScroll').height() - footerHeight);

        $('#planList').css('padding-bottom', footerHeight+'px');


        loadIntoTemplate('#planImages', current_plan.images, 'slider_plan');
        loadIntoTemplate('#planPaginator', current_plan.images, 'slider_paginator');

        $('#planPaginator > div:first-child').addClass('selected');

        $('#planDescripcion').html(current_plan.descripcion);
        $('#planDireccion').html(current_plan.direccion);

        PlanController.carouselPostChange = function() {
            $('#planPaginator > div').removeClass('selected');
            $('#planPaginator > div:nth-child(' + (planImages.getActiveCarouselItemIndex()+1) + ')').addClass('selected');
        };

        setTimeout(function(){

            planImages.on('postchange', PlanController.carouselPostChange);

        }, 1000);

        ons.compile($('#plan_content')[0]);

        initScroll('planScroll');

    })
});

var GuiasController;
module.controller('GuiasController', function($scope) {
    ons.ready(function() {

        current_page = 'guias.html';

        GuiasController = this;

        var factor = window.innerWidth/320;

        var footerHeight = factor*60;
        $('#guiasHeader').height( footerHeight -8 );
        $('#guiasHeader').css( 'min-height', (footerHeight-8) + 'px' );

        loadIntoTemplate('#guias_content', current_list.items, 'guias_list');

        ons.compile($('#guias_content')[0]);

        initScroll('guiasScroll');

    })
});

function gotoLocales(index) {

    if(current_page != 'locales.html') {

        current_page = 'locales.html';

        current_categoria = current_list.items[index];

        getJsonP(api_url + 'getLocales/', function(data){

            list_locales = data;

            mainnavigator.pushPage('locales.html');

        }, function(){}, {categoria_id: current_categoria.id, ciudad_id: ciudad_seleccionada});
    }
}

function gotoGuiaDetalle(index) {

    if(current_page != 'guia.html') {

        current_page = 'guia.html';

        current_guia = list_locales.items[index];

        mainnavigator.pushPage('guia.html');
    }
}

function refreshLocalesScroll() {
    scrolls.localesScroll.refresh();
}

var LocalesController;
module.controller('LocalesController', function($scope) {
    ons.ready(function() {

        current_page = 'locales.html';

        LocalesController = this;

        var factor = window.innerWidth/320;

        var footerHeight = factor*60;
        $('#localesHeader').height( footerHeight -8 );
        $('#localesHeader').css( 'min-height', (footerHeight-8) + 'px' );

        loadIntoTemplate('#locales_content', list_locales.items, 'locales_list');

        ons.compile($('#locales_content')[0]);

        initScroll('localesScroll');

    })
});



var GuiaController;
var current_categoria;
var current_guia;
var list_locales;
module.controller('GuiaController', function($scope) {
    ons.ready(function() {

        GuiaController = this;

        var factor = window.innerWidth/320;

        var footerHeight = factor*60;
        $('#guiaHeader').height( footerHeight -8 );
        $('#guiaHeader').css( 'min-height', (footerHeight-8) + 'px' );

        footerHeight = factor*$('#guiaFooter').outerHeight();

        $('#guiaFooter .banner').height( footerHeight );
        $('#guiaHeader').height( footerHeight );

        /*$('.header-logo').width($('.header-logo').width() * factor);
         $('.header-logo').height($('.header-logo').height() * factor);*/

        height = $(window).height() - ( 200*factor + $('#guiaFooter').outerHeight() + $('#guiaHeader').outerHeight() - 1 );

        $('#guiaImages').height( height );
        $('#guiaToolbar').height( height );

        $('#guiaPage .page__content').css('top', (height + $('#guiaHeader').outerHeight() )+'px');
        //$('#guiaPage .page__content').css('bottom', (footerHeight +'px') );

        //$('#guiaScroll').height($('#guiaScroll').height() - footerHeight);

        $('#guiaList').css('padding-bottom', footerHeight+'px');


        loadIntoTemplate('#guiaImages', current_guia.images, 'slider_guia');
        loadIntoTemplate('#guiaPaginator', current_guia.images, 'slider_paginator');

        $('#guiaPaginator > div:first-child').addClass('selected');

        $('#guiaDescripcion').html(current_guia.descripcion);
        $('#guiaDireccion').html(current_guia.direccion);

        GuiaController.carouselPostChange = function() {
            $('#guiaPaginator > div').removeClass('selected');
            $('#guiaPaginator > div:nth-child(' + (guiaImages.getActiveCarouselItemIndex()+1) + ')').addClass('selected');
        };

        setTimeout(function(){

            guiaImages.on('postchange', GuiaController.carouselPostChange);

        }, 1000);

        ons.compile($('#guia_content')[0]);

        initScroll('guiaScroll');

    })
});

var MenuController;
module.controller('MenuController', function($scope) {
    ons.ready(function() {

        MenuController = this;
        current_page = 'locales.html';

        var factor = window.innerWidth/320;

        var footerHeight = factor*60;
        $('#menuHeader').height( footerHeight -8 );
        $('#menuHeader').css( 'min-height', (footerHeight-8) + 'px' );

        loadIntoTemplate('#menu_content', current_list.items, 'menu_list');

        ons.compile($('#menu_content')[0]);

        initScroll('menuScroll');

    })
});

var current_menu;
function gotoMenuDetalle(index) {

    if(current_page != 'menu_detalle.html') {

        current_page = 'menu_detalle.html';

        current_menu = current_list.items[index];

        mainnavigator.pushPage('menu_detalle.html');
    }
}

function refreshMenuScroll() {
    scrolls.menuScroll.refresh();
}

var MenuDetalleController;
module.controller('MenuDetalleController', function($scope) {
    ons.ready(function() {

        MenuDetalleController = this;

        var factor = window.innerWidth/320;

        var footerHeight = factor*60;
        $('#menu_detalleHeader').height( footerHeight -8 );
        $('#menu_detalleHeader').css( 'min-height', (footerHeight-8) + 'px' );

        footerHeight = factor*$('#menu_detalleFooter').outerHeight();

        $('#menu_detalleFooter .banner').height( footerHeight );
        $('#menu_detalleHeader').height( footerHeight );

        var str = "";
        for(var i in current_menu.content) {
            str += "<h3>"+i+"</h3>";
            str += '<div class="menu_platos">'+current_menu.content[i]+'</div>';
        }

        $('#menu_detalleList').css('padding-bottom', footerHeight+'px');

        $('#menu_detalleCotent').html(str);

        $('#menu_detalleFecha').html(current_menu.fecha);
        $('#menu_detalleNombre').html(current_menu.title);

        $('#menu_detalleDescripcion').html(current_menu.descripcion);
        $('#menu_detalleDireccion').html(current_menu.direccion);

        ons.compile($('#menu_detalle_content')[0]);

        initScroll('menu_detalleScroll');

    })
});



var RecompensasController;
module.controller('RecompensasController', function($scope) {
    ons.ready(function() {

        current_page = 'recompensas.html';

        RecompensasController = this;

        var factor = window.innerWidth/320;

        var footerHeight = factor*60;
        $('#recompensasHeader').height( footerHeight -8 );
        $('#recompensasHeader').css( 'min-height', (footerHeight-8) + 'px' );

        loadIntoTemplate('#recompensas_content', current_list.items, 'recompensas_list_content');

        ons.compile($('#recompensas_content')[0]);

        initScroll('recompensasScroll');

    })
});

function gotoRecompensaDetalle(index) {

    if(current_page != 'recompensa.html') {

        current_page = 'recompensa.html';

        current_recompensa = current_list.items[index];

        mainnavigator.pushPage('recompensa.html');
    }
}

var RecompensaController;
var current_recompensa;
module.controller('RecompensaController', function($scope) {
    ons.ready(function() {

        current_page = 'recompensa.html';

        RecompensaController = this;

        var factor = window.innerWidth/320;

        var footerHeight = factor*60;
        $('#recompensaHeader').height( footerHeight -8 );
        $('#recompensaHeader').css( 'min-height', (footerHeight-8) + 'px' );

        footerHeight = factor*$('#recompensaFooter').outerHeight();

        $('#recompensaFooter .banner').height( footerHeight );

        /*$('.header-logo').width($('.header-logo').width() * factor);
         $('.header-logo').height($('.header-logo').height() * factor);*/

        height = $(window).height() - ( 200*factor + $('#recompensaFooter').outerHeight() + $('#recompensaHeader').outerHeight() - 1 );

        $('#recompensaImages').height( height );
        $('#recompensaToolbar').height( height );

        $('#recompensaPage .page__content').css('top', (height + $('#recompensaHeader').outerHeight() )+'px');
        //$('#recompensaPage .page__content').css('bottom', (footerHeight +'px') );

        //$('#recompensaScroll').height($('#recompensaScroll').height() - footerHeight);

        $('#recompensaList').css('padding-bottom', footerHeight+'px');


        loadIntoTemplate('#recompensaImages', current_recompensa.images, 'slider_recompensa');
        loadIntoTemplate('#recompensaPaginator', current_recompensa.images, 'slider_paginator');

        $('#recompensaPaginator > div:first-child').addClass('selected');

        $('#recompensaDescripcion').html(current_recompensa.descripcion);
        $('#recompensaDireccion').html(current_recompensa.direccion);

        RecompensaController.carouselPostChange = function() {
            $('#recompensaPaginator > div').removeClass('selected');
            $('#recompensaPaginator > div:nth-child(' + (recompensaImages.getActiveCarouselItemIndex()+1) + ')').addClass('selected');
        };

        setTimeout(function(){

            recompensaImages.on('postchange', RecompensaController.carouselPostChange);

        }, 1000);

        ons.compile($('#recompensa_content')[0]);

        initScroll('recompensaScroll');

    })
});


function compare(a,b) {
    if (parseInt(moment(a.date, "YYYY-MM-DD").format("x")) > parseInt(moment(b.date, "YYYY-MM-DD").format("x")))
        return 1;
    return 0;
}


function getArrayAsObjects(array, width, height) {
    var result = [];

    width = width*2;
    height = height*2;

    for(var i in array) {
        result.push({list_image:array[i]});
    }

    return result;
}


function alert(message) {
    ons.notification.alert({
        message: message,
        // or messageHTML: '<div>Message in HTML</div>',
        title: 'Mensaje',
        buttonLabel: 'OK',
        animation: 'default', // or 'none'
        // modifier: 'optional-modifier'
        callback: function() {
            // Alert button is closed!
        }
    });
}


function fixGuestListItem(height) {

    $('#styleguest').remove();

    $('body').append(
        '<style id="styleguest" type="text/css">'+
        '.guest_list_item {'+
        'position:relative;'+
        'height:'+(height)+'px;'+
        '}'+
        '</style>'
    );
}

function fixModalBottomHeight(height){

    $('#stylemodal').remove();

    $('body').append('<style id="stylemodal" type="text/css">.bottom-dialog .dialog {min-height: ' + height + ';}</style>');
}

var scrolls = {};
function initScroll(div) {

    if(!scrolls[div]) {

        scrolls[div] = new iScroll(div, {momentum:true, hScrollbar:false, vScrollbar:false, click: true, tap: true, checkDOMChanges: true});

    } else {

        scrolls[div].scrollTo(0,0);
        setTimeout(function(){
            scrolls[div].destroy();
            scrolls[div] = new iScroll(div, {momentum:true, hScrollbar:false, vScrollbar:false, click: true, tap: true, checkDOMChanges: true});
        }, 10);
    }
}

function updateContent (el, data) {
    el.innerHTML = data;
}

function getLabels() {
    return labels[applicationLanguage];
}

function requestFocus(input, event) {
    $(input).focus();
}

function sendContactForm(input, event) {

    var nombre =$('#contacto_nombre').val();
    var telefono =$('#contacto_telefono').val();
    var email =$('#contacto_email').val();
    var mensaje =$('#contacto_mensaje').val();

    if(nombre == '') {
        alert('Nombre es requerido');
        return;
    }

    if(email == '') {
        alert('Email es requerido');
        return;
    }

    if(!/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$/.exec(email)) {
        alert('Email inválido');
        return;
    }

    if(mensaje == '') {
        alert('Mensaje es requerido');
        return;
    }

    getJsonP(api_url + 'enviar_contacto', function(data){

        alert(data.message);

        if(data.status == 'success') {

            $('#contacto_nombre').val('');
            $('#contacto_telefono').val('');
            $('#contacto_email').val('');
            $('#contacto_mensaje').val('');
        }

    }, function(){}, {
        name: $('#contacto_nombre').val(),
        phone: $('#contacto_telefono').val(),
        email: $('#contacto_email').val(),
        mensaje: $('#contacto_mensaje').val()
    });
}

$(document).unbind('click').on('click', 'a[target="_blank"]', function(ev) {
    var url;

    url = $(this).attr('href');

    openExternalLink(url, ev);
});

var currentLink;
var isExternalShowing = false;
function openExternalLink(url, e) {

    currentLink = url;

    try {

        window.plugins.ChildBrowser.showWebPage(url,
            { showLocationBar: true });

        window.plugins.ChildBrowser.onClose = function () {
            isExternalShowing = false;
        };

    } catch(error) {

        window.open(url, '_system');
        //splash.pushPage('external.html', {});
    }

    if (e != undefined) {
        e.stopPropagation();
        e.preventDefault();
    }
}

function openPdf(url) {
    try {

        window.plugins.ChildBrowser.showWebPage(url,
            { showLocationBar: true });

    } catch(error) {

        window.open(url, '_system');
        //splash.pushPage('external.html', {});
    }
}