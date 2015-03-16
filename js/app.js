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

function goToPlanes() {

    getJsonP(api_url + 'getPlanes/', function(data){

        current_list = data;

        mainnavigator.pushPage('planes.html', {});

        if(current_list.list) {
        }

    }, function(){}, {});
}

function gotoMenuDiario() {

    getJsonP(api_url + 'getMenuDiario/', function(data){

        current_list = data;

        mainnavigator.pushPage('menu.html', {});

        if(current_list.list) {
        }

    }, function(){}, {});
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

            mainnavigator.pushPage("registro.html", {animation:'none'});
        });

    })
});

var RegistroController;
module.controller('RegistroController', function($scope) {
    ons.ready(function() {

        RegistroController = this;

        initScroll('registro_scroll');

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
            $('#homeHeader').height( footerHeight );

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


                registerNotifications();

            });

        }, 100);

    });
});

var PlanesController;
module.controller('PlanesController', function($scope) {
    ons.ready(function() {

        PlanesController = this;

        //loadIntoTemplate('#planes_content', applicationParams.planes, 'list_planes');

        var factor = window.innerWidth/320;

        $('#planesHeader').css('max-height',  factor*60 );
        //$('#planesHeader').height( factor*$('#planesHeader').outerHeight() );

    })
});

var MenuController;
module.controller('MenuController', function($scope) {
    ons.ready(function() {

        MenuController = this;

        //loadIntoTemplate('#planes_content', applicationParams.planes, 'list_planes');

        var factor = window.innerWidth/320;

        $('#menuHeader').css('max-height',  factor*60 );
        //$('#planesHeader').height( factor*$('#planesHeader').outerHeight() );

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