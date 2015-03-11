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

function resizeCardCarousel() {
    thumb_width = window.innerWidth;
    thumb_height = window.innerHeight - $('#main_content').offsetHeight();

    $('#home_images').height(thumb_height);

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
var carta_data = {};
function goToCarta() {

    getJsonP(api_url + 'get_carta', function(data){

        carta_data = data;

        splash.pushPage('carta.html', {});

    }, function(){}, {});
}

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

function goToNovedadDetalle(index, event) {

    current_noticia = current_list.list[index];

    splash.pushPage('noticia.html', {});

    event.stopPropagation();
}

function goToVinosCategoria(id) {

    getJsonP(api_url + 'get_categoria_vinos', function(data){

        current_list = data;

        splash.pushPage('vinos.html', {id: id});

        if(current_list.list) {


        }

    }, function(){}, {id: id});
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

    scrolls['main_scroll'].refresh();
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

function infoAction() {
    actionCall('918538002');
}


var scopeLocalizacionController;
var map;
module.controller('LocalizacionController', function($scope){

    ons.ready(function(){

        var latLong = new google.maps.LatLng(40.71535,-3.98943);

        map = new google.maps.Map(document.getElementById('map'), {
            center: latLong,
            zoom: 18,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var marker = new google.maps.Marker({
            map: map,
            //position: new google.maps.LatLng(lat, lng),
            title: "move this marker",
            //icon: image,
            //shadow: shadow,
            //shape: shape
            position: latLong,
            animation:google.maps.Animation.DROP,
            draggable:false
        });

        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent("<p style='color:red;font-weight:bold;'><img width='150' src='img/logo.png'/></p>");
        infowindow.open(map,marker);

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });

    });
});


var scopeHomeController;
var height;
module.controller('HomeController', function($scope) {
    ons.ready(function() {

        scopeHomeController = $scope;

        try {
            StatusBar.hide();
        }catch(error){}

        scopeSplashController = $scope;

        setTimeout(function() {

            height = $(window).height() - ( $('#main_content').outerHeight() + $('#home-footer').outerHeight() - 1 );
            $('#home_images').height( height );
            $('#homePage .page__content').css('top', height+'px');

            loadApplicationParams(function(){

                current_page = 'main.html';

                $('#home_slider_paginator > li:nth-child(1)').addClass('selected');

                console.log(applicationParams.slider);

                loadIntoTemplate('#home_images', applicationParams.slider, 'slider_images');

                ons.compile($('#home_images')[0]);

                ons.compile($('#main_scroll')[0]);

                initScroll('main_scroll');

                refreshHomeScroll();

                setTimeout(function(){

                    refreshHomeScroll();

                    /*height = $(window).height() - ( $('#main_content').height() + $('#horario').height() - 6 - 15 );
                    $('#home_images').height( height );
                    $('#homePage .page__content').css('top', height+'px');*/

                    try { navigator.splashscreen.hide(); } catch(error){}

                }, 1000);


                registerNotifications();

            });

        }, 100);

    });
});


function compare(a,b) {
    if (parseInt(moment(a.date, "YYYY-MM-DD").format("x")) > parseInt(moment(b.date, "YYYY-MM-DD").format("x")))
        return 1;
    return 0;
}

var scopeCartaController;
module.controller('CartaController', function($scope) {
    ons.ready(function() {

        scopeCartaController = this;

        current_page = 'carta.html';

        $scope.labels = getLabels();

        loadIntoTemplate('#carta_list', carta_data.entrante, 'carta_list_content');

        ons.compile($('#carta_scroll')[0]);

        initScroll('carta_scroll');

    });
});

var scopeGaleriaController;
module.controller('GaleriaController', function($scope) {
    ons.ready(function() {

        scopeCartaController = this;

        current_page = 'galeria.html';

        if(splash.getCurrentPage().options.galeria_id == '3') {

            $('#galeria_title').html('Galeria<br><span class="subsubtitle">(salones)</span>');

        } else {

            $('#galeria_title').html('Galeria<br><span class="subsubtitle">(platos comida)</span>');
        }

        $('#galeria_content').html('');

        loadIntoTemplate('#galeria_content', current_list.list, 'fotos_list_content');

        ons.compile($('#galeria_scroll')[0]);

        initScroll('galeria_scroll');

    });
});

var scopeFotoController;
var gesturableImg;
module.controller('FotoController', function($scope) {
    ons.ready(function() {

        scopeFotoController = this;

        current_page = 'foto.html';

        $('#foto_image').attr('src', 'http://lasterrazasdebecerril.es/img/fotos/' + current_foto.url);

    });
});

var PageController;
module.controller('PageController', function($scope) {
    ons.ready(function() {

        scopeVinosController = this;

        current_page = 'page.html';

        $scope.labels = getLabels();

        loadIntoTemplate('#page_content', current_list.list, 'page_list_content');

        $('#page_content').append(templates.btn_subir);

        $('#page_content a').each(function(){

            var href = $(this).attr('href');
            $(this).attr('href', 'javascript: void(0)');

            $(this).on('click', function(e){
                openExternalLink(href, e);
            });

        });

        ons.compile($('#page_content')[0]);

        initScroll('page_scroll');

    });
});

var scopeNovedadesController;
module.controller('NovedadesController', function($scope) {
    ons.ready(function() {

        scopeNovedadesController = this;

        current_page = 'novedades.html';

        $scope.labels = getLabels();

        loadIntoTemplate('#novedades_content', current_list.list, 'novedades_list_content');

        $('#novedades_content').append(templates.btn_subir);

        ons.compile($('#novedades_content')[0]);

        initScroll('novedades_scroll');

    });
});

var scopeNoticiaController;
module.controller('NoticiaController', function($scope) {
    ons.ready(function() {

        scopeNoticiaController = this;

        //current_page = 'noticia.html';

        $scope.labels = getLabels();

        $('#noticia_image').attr('src', 'http://lasterrazasdebecerril.es/img/novedades/' + current_noticia.imagen);
        $('#noticia_title').html(current_noticia.nombre);
        $('#noticia_description').html(current_noticia.descripcion);

        $('#noticia_description a').each(function(){

            var href = $(this).attr('href');
            $(this).attr('href', 'javascript: void(0)');
            $(this).attr('target', '_self');
            $(this).unbind('click');
            //$(this).attr('onclick', 'openExternalLink(this.href, event)');
            $(this).addClass('button');
            $(this).addClass('nobutton');
            $(this).addClass('linkbutton');
            $(this).on('click', function(e){
                openExternalLink(href, e);
            });

        });

        if(current_noticia.pdf != null && current_noticia.pdf != undefined && current_noticia.pdf != '' && current_noticia.pdf != 'null') {
            $('#noticia_description').append(templates.btn_pdf.replaceAll('%pdf%', current_noticia.pdf));
        }

        if(current_noticia)

        initScroll('noticia_scroll');

    });
});


function getArrayAsObjects(array, width, height) {
    var result = [];

    width = width*2;
    height = height*2;

    for(var i in array) {
        result.push({list_image:array[i]});
    }

    return result;
}

function getJsonP(url, callback_success, callback_error, data) {

    if(data === undefined) {
        data = {};
    }


    if(data.lang === undefined) {
        data.lang = applicationLanguage;
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