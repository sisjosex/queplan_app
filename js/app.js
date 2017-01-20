var API_URL = 'http://web.queplanmadrid.es/api2/';
var WEB_URL = 'http://web.queplanmadrid.es/';

var module = ons.bootstrap('MyApp', ['services', 'ngSanitize']);

var applicationLanguage = 'es';
var user;
var user_storage_key = 'queplanapp_user';
var currentNavigator = undefined;
var token_notificacion;
var onesignal_id;
var latitude;
var longitude;
var lang = {
    en: {
        yes: 'Yes',
        no: 'No',
        confirmation: 'Confirmation',
        name_required: 'Name is required',
        email_required: 'Email is required',
        email_invalid: 'Email is invalid',
        password_required: 'Password is required',
        password_old_required: 'Old password is required',
        message: 'Message',
        login: 'Login',
        email: 'Email',
        password: 'Password',
        there_was_an_error: 'There was an error when loading data',
        are_sure_to_logout: 'Are you sure that want logout ?',
        today: 'Today',
        all: 'All',
        welcome: 'Welcome',
        meetings: 'My Meetings',
        profile: 'Profile',
        back: 'Back',
        call_to: 'Call',
        send_email: 'Send email'
    },
    es: {
        yes: 'Si',
        no: 'No',
        confirmation: 'Confirmación',
        name_required: 'Nombre es requerido',
        email_required: 'Email es requerido',
        email_invalid: 'Email es inválido',
        password_required: 'Password es requerido',
        password_old_required: 'Contraseña anterior es requerida',
        message: 'Mensage',
        login: 'Ingresar',
        email: 'Email',
        password: 'Contraseña',
        there_was_an_error: 'Ocurrio un problema al cargar los datos',
        are_sure_to_logout: 'Esta seguro que quieres salir ?',
        today: 'Hoy',
        all: 'Todas',
        welcome: 'Bienvenido',
        meetings: 'Mis Reuniones',
        profile: 'Perfil',
        back: 'Atras',
        call_to: 'Llamar',
        send_email: 'Enviar email'
    }
};

module.controller('MainNavigatorController', function ($scope, $rootScope, service, $sce) {

    ons.ready(function () {

        $rootScope.params = {
            banner: {},
            banners: [],
            ciudades: [],
            como_funciona: [],
            quiero_participar: {},
            slider: [],
            usuario: {},
        };

        $rootScope.playVideo = function (video_id) {

            YoutubeVideoPlayer.openVideo(video_id);
        };

        $rootScope.showImage = function (url) {

            //PhotoViewer.show(url, '', {share:false, done: 'Cerrar'});
        };

        $rootScope.showImage2 = function (url) {

            PhotoViewer.show(url, '', {share:false, done: 'Cerrar'});
        };

        $rootScope.call = function (phone) {

            if (phone) {

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
            }
        };

        $rootScope.share = function (data, type) {

            if (type == 'plan') {

                var html = data.descripcion;
                var div = document.createElement("div");
                div.innerHTML = html;

                //window.plugins.socialsharing.share('Message and link', null, null, 'http://www.x-services.nl');

                //window.plugins.socialsharing.share(data.title + ' ' + div.innerText, null, data.image, null);

                /*window.plugins.socialsharing.shareViaFacebook(data.title + ' ' + div.innerText, null, null, function() {

                }, function(errormsg) {
                    //alert(errormsg);
                });*/

                window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(data.title + ' ' + div.innerText, null /* img */, null /* url */, 'Post!', function() {
                    console.log('share ok');
                }, function(errormsg){
                    alert(errormsg);
                });

                /*var options = {
                    message: data.title + ' ' + div.innerText, // not supported on some apps (Facebook, Instagram)
                    subject: data.fecha, // fi. for email
                    files: [data.image],
                    //files: ['', ''], // an array of filenames either locally or remotely
                    //url: 'http://web.queplanmadrid.es/',
                    chooserTitle: 'Comparte este plan' // Android only, you can override the default share sheet title
                };

                var onSuccess = function (result) {
                    console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                    console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                };

                var onError = function (msg) {
                    console.log("Sharing failed with message: " + msg);
                };

                window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

                */
            }
        };

        $rootScope.initGeolocation = function () {

            var onSuccess = function (position) {
                console.log('Latitude: ' + position.coords.latitude + '\n' +
                    'Longitude: ' + position.coords.longitude + '\n' +
                    'Altitude: ' + position.coords.altitude + '\n' +
                    'Accuracy: ' + position.coords.accuracy + '\n' +
                    'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                    'Heading: ' + position.coords.heading + '\n' +
                    'Speed: ' + position.coords.speed + '\n' +
                    'Timestamp: ' + position.timestamp + '\n');

                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                localStorage.setItem('latitude', latitude);
                localStorage.setItem('longitude', longitude);
            };

            // notificar si esta cerca de algun local
            var onSuccessTracking = function (position) {

                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                localStorage.setItem('latitude', latitude);
                localStorage.setItem('longitude', longitude);

                service.checkDistance({usuario_id: getUser().id}, function (result) {

                    if (result.status == 'success') {

                        //alert(result.mensaje);

                    } else {

                        //alert(result.mensaje);
                    }

                }, function (error) {
                })
            };

            // onError Callback receives a PositionError object
            //
            function onError(error) {
                console.log('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);

            var watchId = navigator.geolocation.watchPosition(onSuccessTracking,
                onError,
                {timeout: 30000});
        };

        $rootScope.shareByEmail = function (message) {

            shareByEmail(message, function () {
            });
        };

        $rootScope.shareBySMS = function (message) {
            shareBySMS(message, function () {
            });
        };

        $rootScope.shareByWhatsApp = function (message) {
            shareByWhatsApp(message, function () {
            });
        };

        $rootScope.shareByFacebook = function (message) {
            shareByFacebook(message, function () {
            });
        };

        $rootScope.shareBy = function (message, url) {
            shareBy(message, url);
        };

        $rootScope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        $rootScope.openPage = function (url) {
            var ref = window.open(url, '_blank', 'location=no,closebuttoncaption=Cerrar');
        };

        $rootScope.openLocation = function (data) {
            /*
             z is the zoom level (1-20)
             t is the map type ("m" map, "k" satellite, "h" hybrid, "p" terrain, "e" GoogleEarth)
             q is the search query, if it is prefixed by loc: then google assumes it is a lat lon separated by a +
             */
            var ref = window.open('http://maps.google.com/maps?z=12&t=m&q=loc:' + data.latitud + '+' + data.longitud, '_blank', 'location=no,closebuttoncaption=Cerrar');
        };

        $rootScope.loQuiero = function (plan_id, local_id) {

            service.loQuiero({promocion_id: plan_id, local_id: local_id, usuario_id: getUser().id}, function (result) {

                if (result.status == 'success') {

                    alert(result.mensaje);

                } else {

                    alert(result.mensaje);
                }

            }, function (error) {
            })
        };


        $rootScope.registerPushNotifications = function () {

            var notificationOpenedCallback = function(data) {

                data = data.notification.payload.additionalData;

                console.log(data);

                var message = data.message;
                var seccion = data.seccion;
                var seccion_id = data.seccion_id;

                console.log(data);

                if (data.seccion) {

                    /*confirm(message, function (result) {
                        if (result == 0) {
                            $rootScope.redirectToPage(data.seccion, data.seccion_id);
                        }
                    });*/

                    $rootScope.redirectToPage(data.seccion, data.seccion_id);

                } else {

                    alert(message);
                }
            };

            window.plugins.OneSignal
                .startInit("4f0e2abf-c329-4f06-b3cd-64b54eaa05cc", "671857502263")
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

            window.plugins.OneSignal.getIds(function(ids) {
                console.log('getIds: ' + JSON.stringify(ids));
                //alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);

                token_notificacion = ids.pushToken;
                onesignal_id = ids.userId;

                localStorage.setItem('queplan_push_token', token_notificacion);

                $rootScope.authenticate(function () {
                });
            });

            /*if (window.PushNotification) {

                var push = PushNotification.init({
                    android: {
                        senderID: "51393321226"
                    },
                    ios: {
                        alert: "true",
                        badge: true,
                        sound: 'false'
                    }
                });

                push.on('registration', function (token) {

                    token_notificacion = token.registrationId;

                    localStorage.getItem('queplan_push_token', token_notificacion);

                    $rootScope.authenticate(function () {
                    });
                });

                push.on('notification', function (data) {

                    var message = data.message;
                    var seccion = data.seccion;
                    var seccion_id = data.seccion_id;

                    console.log(data);

                    if (data.additionalData.seccion) {

                        confirm(message, function (result) {
                            if (result == 0) {
                                $rootScope.redirectToPage(data.additionalData.seccion, data.additionalData.seccion_id);
                            }
                        });

                    } else {

                        alert(message);
                    }

                });

                push.on('error', function (e) {
                    console.log(e.message);
                });
            }*/
        };


        $rootScope.redirectToPage = function (seccion, id) {

            if (!id || id == undefined || id == null || id == '') {
                id = '';
            }

            if (seccion == "local") {

                if (id == "") {

                    id = '1';

                    current_page = '';

                    mainNavigator.pushPage('locals.html', {data: {category_id: id}});

                } else {

                    $rootScope.goToLocal(id, 'restaurant');
                }

            } else if (seccion == "plan") {

                if (id == "") {

                    mainNavigator.pushPage('plans.html');

                } else {


                    $rootScope.goToPlan(id);
                }

            } else if (seccion == "menu") {

                if (id == "") {

                    mainNavigator.pushPage('daily_menus.html');

                } else {

                    mainNavigator.pushPage('menu_detail.html', {
                        data: {
                            menu: {
                                id: id
                            }
                        }
                    });
                }

            } else if (seccion == "guia") {

                if (id == "") {

                    mainNavigator.pushPage('guia.html');

                } else {

                    mainNavigator.pushPage('locals.html', {data: {category_id: id}});
                }
            }
        };


        $rootScope.goToLocal = function (id, type) {

            if (type == undefined || type == 'restaurant') {

                mainNavigator.pushPage('local_restaurant.html', {data: {local_id: id}});

            } else if (type == 'shopping') {

                mainNavigator.pushPage('local_shop.html', {data: {local_id: id}});

            } else if (type == 'other') {

                mainNavigator.pushPage('local_other.html', {data: {local_id: id}});
            }
        };

        $scope.goToPlan = function (plan_id) {

            mainNavigator.pushPage('plan.html', {data: {plan_id: plan_id}});
        };

        $rootScope.goToPlan = function (id) {
            mainNavigator.pushPage('plan.html', {data: {id: id}});
        };


        $rootScope.authenticate = function (callback) {

            service.authenticate({usuario_id: getUser() ? getUser().id : ''}, function (result) {

                if (result.status == 'success') {

                    console.log(result);

                    saveUser(result.usuario);

                    $rootScope.params = result;

                    setTimeout(function () {
                        $rootScope.$digest();
                    }, 500);

                    callback();

                } else {

                    alert('No se pudo conectar con el servidor');
                }

            }, function (error) {
            })
        };

        $rootScope.initAppsFlyer = function () {

            if (window.plugins && window.plugins.appsFlyer) {

                var args = {};
                var devKey = "oTH8LDt5vHrRbhXqKHBeBP";   // your AppsFlyer devKey
                //args.push(devKey);
                args['devKey'] = devKey;
                var userAgent = window.navigator.userAgent.toLowerCase();

                if (/iphone|ipad|ipod/.test(userAgent)) {
                    var appId = "766049348";            // your ios app id in app store
                    //args.push(appId);
                    args['appId'] = appId;
                }
                window.plugins.appsFlyer.initSdk(args, function () {

                    console.log('app flyer initialized - success');

                }, function () {

                    console.log('app flyer initialized - falied');
                });
            }

        };

        $scope.deviceReady = false;

        if (document.location.protocol == 'http:') {

            //API_URL = 'http://localhost/queplan/admin/api2/';
            API_URL = 'http://web.queplanmadrid.es/api2/';

            setTimeout(onDeviceReady, 500);

        } else {

            API_URL = 'http://web.queplanmadrid.es/api2/';

            document.addEventListener("deviceready", onDeviceReady, false);
        }

        function onDeviceReady() {

            //StatusBar.show();

            $scope.$apply(function () {

                document.addEventListener("online", onOnline, false);
                document.addEventListener("offline", onOffline, false);

                $scope.deviceReady = true;

                localStorage.setItem('lang', applicationLanguage);


                token_notificacion = localStorage.getItem('queplan_push_token');
                latitude = localStorage.getItem('latitude');
                longitude = localStorage.getItem('longitude');

                $rootScope.authenticate(function () {

                    if (getUser().ciudad_id == '0') {

                        mainNavigator.pushPage('cities.html', {animation: 'none'});

                    } else {

                        mainNavigator.pushPage('home.html', {animation: 'none'});
                    }

                    $rootScope.registerPushNotifications();
                });

                $rootScope.initGeolocation();

                $rootScope.initAppsFlyer();

                /*try {
                 StatusBar.hide();
                 } catch (error) {
                 }*/

            });
        }

        function onOnline() {
            $rootScope.online = true;
        }

        function onOffline() {
            $rootScope.online = false;
        }

    });
});

function onResize() {


}


var homeSliderInterval = false;
module.controller('Home', function ($rootScope, $scope) {

    ons.ready(function () {

        $scope.labels = lang[applicationLanguage];

        $scope.goToPlans = function () {
            mainNavigator.pushPage('plans.html');
        };

        $scope.goToNotifications = function () {
            mainNavigator.pushPage('notifications.html', {animation: 'fade'});
        };

        $scope.goToProfile = function () {
            mainNavigator.pushPage('profile.html');
        };

        $scope.goToGuia = function () {
            mainNavigator.pushPage('guia.html');
        };

        $scope.gotoDailyMenus = function () {
            mainNavigator.pushPage('daily_menus.html');
        };

        $scope.gotoComoFunciona = function () {
            mainNavigator.pushPage('como_funciona.html');
        };

        $scope.test = function () {
            console.log('test');
        };


        $scope.current_carousel_index = 0;


        setTimeout(function () {

            //$(mainNavigator.topPage).show();

            $('.preview').each(function () {
                new ImageLoader($(this), new Image(), function () {

                    homeCarousel.on('postchange', function () {

                        $scope.current_carousel_index = homeCarousel.getActiveIndex();
                        $scope.$digest();
                    });

                    if (!homeSliderInterval) {
                        homeSliderInterval = true;

                        setInterval(function () {
                            if (homeCarousel.getActiveIndex() + 1 == $rootScope.params.slider.length) {

                                homeCarousel.first();

                            } else {

                                homeCarousel.next();
                            }

                        }, 5000);
                    }

                    try {
                        navigator.splashscreen.hide();
                    } catch (error) {
                    }
                });
            });
        }, 1000);

    });
});

var ciudadesIntervals = false;
module.controller('Cities', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.user = getUser();

        $scope.setCity = function (id) {

            modal.show();

            service.setCity({usuario_id: $scope.user.id, ciudad_id: id}, function (result) {

                if (result.status == 'success') {

                    saveUser(result.user);

                    $rootScope.authenticate(function () {
                    });

                    modal.hide();

                    mainNavigator.pushPage('home.html');

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        setTimeout(function () {

            $(mainNavigator.topPage).find('.preview').each(function () {
                new ImageLoader($(this), new Image(), function(){

                    try {
                        navigator.splashscreen.hide();
                    } catch (error) {
                    }
                });
            });

        }, 1000);

    });
});

module.controller('Notifications', function ($scope, service) {

    ons.ready(function () {

        $scope.notifications = [];

        $scope.getNotifications = function () {

            modal.show();

            service.getNotifications({usuario_id: getUser().id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.notifications = result.data;

                    setTimeout(function () {

                        $(mainNavigator.topPage).find('.preview').each(function () {
                            new ImageLoader($(this), new Image());
                        });

                    }, 200);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        setTimeout(function () {
            $scope.getNotifications();
        }, 600);
    });
});

module.controller('Profile', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.labels = lang[applicationLanguage];

        $scope.alertas_on_off_text = '';

        $scope.city_id = getUser().ciudad_id;
        $scope.city_name = '';

        if ($scope.city_id != '') {

            for (var i in $rootScope.params.ciudades) {
                if ($rootScope.params.ciudades[i].id == $scope.city_id) {

                    $scope.city_name = $rootScope.params.ciudades[i].title;
                }
            }

        } else {

            $scope.city_name = 'Selecciona tu Ciudad';
        }

        if (getUser().recibir_alertas) {

            $scope.alertas_on_off_text = 'Dejar de recibir notificaciones';

        } else {

            $scope.alertas_on_off_text = 'Recibir notificaciones';
        }

        $scope.goToGalerias = function (id, type) {

            mainNavigator.pushPage('galerias.html');
        };

        $scope.setCity = function () {

            modal.show();

            service.setCity({usuario_id: getUser().id, ciudad_id: $scope.city_id}, function (result) {

                if (result.status == 'success') {

                    $rootScope.authenticate(function () {

                        modal.hide();

                        $scope.city_id = getUser().ciudad_id;

                        for (var i in $rootScope.params.ciudades) {

                            if ($rootScope.params.ciudades[i].id == $scope.city_id) {

                                $scope.city_name = $rootScope.params.ciudades[i].title;
                            }
                        }

                        setTimeout(function () {
                            $('.home .preview').each(function () {
                                new ImageLoader($(this), new Image());
                            });
                        }, 200);

                        alert(result.mensaje);
                    });

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.onOffNotifications = function () {

            modal.show();

            service.onOffNotifications({usuario_id: getUser().id}, function (result) {

                if (result.status == 'success') {

                    user = getUser();
                    user.recibir_alertas = result.recibir_alertas;
                    saveUser(user);

                    if (result.recibir_alertas) {

                        $scope.alertas_on_off_text = 'Dejar de recibir notificaciones';

                    } else {

                        $scope.alertas_on_off_text = 'Recibir notificaciones';

                    }

                    modal.hide();

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        }

    });
});

module.controller('Galerias', function ($scope, service) {

    ons.ready(function () {

        $scope.galerias = [];

        $scope.goToGaleriaDetalle = function(galeria) {

            mainNavigator.pushPage('galeria_detalle.html', {data: {galeria: galeria}});
        };

        $scope.getGalerias = function () {

            modal.show();

            service.getGalerias({
                usuario_id: getUser().id,
                ciudad_id: getUser().ciudad_id
            }, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    if (result.data.length == 0) {

                        alert('¡Ups! No hay galerias en estos momentos.');
                    }

                    $scope.galerias = result.data;

                    setTimeout(function () {

                        $(mainNavigator.topPage).find('.preview').each(function () {
                            new ImageLoader($(this), new Image());
                        });

                    }, 200);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        setTimeout(function () {
            $scope.getGalerias();
        }, 600);
    });
});

module.controller('GaleriaDetalle', function ($scope, service) {

    ons.ready(function () {

        $scope.galeria = mainNavigator.pages[mainNavigator.pages.length - 1].data.galeria;

        $scope.fotos = [];

        $scope.getFotosGaleria = function () {

            modal.show();

            service.getFotosGaleria({
                usuario_id: getUser().id,
                ciudad_id: getUser().ciudad_id,
                galeria_id: $scope.galeria.id
            }, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    if (result.data.length == 0) {

                        alert('¡Ups! No hay fotos en estos momentos.');
                    }

                    $scope.fotos = result.data;

                    setTimeout(function () {

                        $(mainNavigator.topPage).find('.preview').each(function () {
                            new ImageLoader($(this), new Image());
                        });

                    }, 200);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        setTimeout(function () {
            $scope.getFotosGaleria();
        }, 600);
    });
});

module.controller('DailyMenus', function ($scope, service) {

    ons.ready(function () {

        $scope.menus = [];
        $scope.categories = [];
        $scope.category_id = '';
        $scope.menu_type = '';

        $scope.search = function (category_id) {

            $scope.category_id = category_id;

            rightSplitter.toggle();

            $scope.getMenus();
        };

        $scope.filterByType = function (type) {

            $scope.menu_type = type;

            $scope.getMenus();
        };

        $scope.goToMenuDetail = function (menu) {

            mainNavigator.pushPage('menu_detail.html', {data: {menu: menu}});
        };

        $scope.getMenus = function () {

            modal.show();

            service.getMenus({
                usuario_id: getUser().id,
                ciudad_id: getUser().ciudad_id,
                category_id: $scope.category_id,
                menu_type: $scope.menu_type
            }, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    if (result.items.length == 0) {

                        if ($scope.category_id != '') {

                            alert(' ¡Ups! Todavía no tenemos ningún restaurante de esta categoría. ¡Prueba en otra!');

                        } else {

                            if ($scope.menu_type == 'menu') {

                                alert('¡Ups! Nuestros clientes hoy no han subido el menú del día. Puedes llamar al local para consultarlo.');

                            } else if ($scope.menu_type == 'carta') {

                                alert('¡Ups! No hay ninguna carta online en estos momentos.');

                            } else {

                                alert('¡Ups! Nuestros clientes hoy no han subido el menú del día. Puedes llamar al local para consultarlo.');
                            }
                        }
                    }

                    $scope.menus = result.items;
                    $scope.categories = result.categorias;

                    setTimeout(function () {

                        $(mainNavigator.topPage).find('.preview').each(function () {
                            new ImageLoader($(this), new Image());
                        });

                    }, 200);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        setTimeout(function () {
            $scope.getMenus();
        }, 600);
    });
});

module.controller('MenuDetail', function ($scope, service) {

    ons.ready(function () {

        $scope.menu_type = 'menu';

        $scope.menu = mainNavigator.pages[mainNavigator.pages.length - 1].data.menu;

        $scope.filterByType = function (type) {

            var existMenus;

            try {

                existMenus = $scope.menu.menu && ($scope.menu.menu.content.primeros != '' || $scope.menu.menu.content.segundos != '' || $scope.menu.menu.content.postres);

            } catch(error) {

                existMenus = false;
            }

            var existsCarta = $scope.menu.carta.length > 0;

            if (type == 'menu' && !existMenus) {

                alert('¡Ups! Este restaurante todavía no ha subido el menú del día.');

            } else if (type == 'carta' && !existsCarta) {

                alert(' ¡Ups! Este restaurante todavía no tiene disponible su carta online.');
            }

            $scope.menu_type = type;
        };

        $scope.getMenuDetail = function () {

            modal.show();

            service.getMenuDetail({usuario_id: getUser().id, local_id: $scope.menu.id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.menu = result.data;

                    setTimeout(function () {

                        $(mainNavigator.topPage).find('.preview').each(function () {
                            new ImageLoader($(this), new Image());
                        });

                    }, 200);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.getMenuDetail();

        setTimeout(function () {

            var fixed = mainNavigator.topPage.querySelector('.fixed');

            var list = mainNavigator.topPage.querySelector(".page__content");

            list.addEventListener("scroll", function (event) {

                if (list.scrollTop > 200) {

                    $(mainNavigator.topPage).addClass('scrolled');

                } else {

                    $(mainNavigator.topPage).removeClass('scrolled');
                }

            });

        }, 200);
    });
});

module.controller('Local', function ($scope, service) {

    ons.ready(function () {

        $scope.menu_type = 'menu';
        $scope.section = 'info';

        $scope.current_carousel_index = 0;

        $scope.local_id = mainNavigator.pages[mainNavigator.pages.length - 1].data.local_id;

        $scope.filterByType = function (type) {

            var existMenus;

            try {

                existMenus = $scope.local.menu && ($scope.local.menu.content.primeros != '' || $scope.local.menu.content.segundos != '' || $scope.local.menu.content.postres);

            } catch(error){

                existMenus = false;
            }
            var existsCarta = $scope.local.carta.length > 0;

            if (type == 'menu' && !existMenus) {

                alert('¡Ups! Este restaurante todavía no ha subido el menú del día.');

            } else if (type == 'carta' && !existsCarta) {

                alert(' ¡Ups! Este restaurante todavía no tiene disponible su carta online.');
            }

            $scope.section = type;
        };

        $scope.getLocal = function () {

            modal.show();

            service.getLocal({usuario_id: getUser().id, local_id: $scope.local_id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.local = result.data;

                    setTimeout(function () {

                        $(mainNavigator.topPage).find('.preview').each(function () {
                            new ImageLoader($(this), new Image());
                        });

                    }, 200);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.getLocal();

        setTimeout(function () {

            homeCarousel.on('postchange', function () {

                $scope.current_carousel_index = localCarousel.getActiveIndex();
                $scope.$digest();
            });

            var fixed = mainNavigator.topPage.querySelector('.fixed');

            var list = mainNavigator.topPage.querySelector(".page__content");

            list.addEventListener("scroll", function (event) {

                if (list.scrollTop > 200) {

                    $(mainNavigator.topPage).addClass('scrolled');

                } else {

                    $(mainNavigator.topPage).removeClass('scrolled');
                }

            });

        }, 200);
    });
});

module.controller('Plans', function ($scope, service) {

    ons.ready(function () {

        $scope.plans = [];
        $scope.categories = [];
        $scope.category_id = '';
        $scope.menu_type = '';

        $scope.search = function (category_id) {

            $scope.category_id = category_id;

            rightSplitter.toggle();

            $scope.getPlans();
        };

        $scope.filterByType = function (type) {

            $scope.menu_type = type;

            $scope.getMenus();
        };

        $scope.getPlans = function () {

            modal.show();

            service.getPlans({
                usuario_id: getUser().id,
                ciudad_id: getUser().ciudad_id,
                category_id: $scope.category_id,
                menu_type: $scope.menu_type
            }, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    if (result.items.length == 0) {
                        alert('Lo sentimos, no tenemos planes para mostrar  ');
                    }

                    $scope.plans = result.items;
                    if ($scope.categories.length == 0) {
                        $scope.categories = result.categorias;
                    }

                    setTimeout(function () {

                        $(mainNavigator.topPage).find('.preview').each(function () {
                            new ImageLoader($(this), new Image());
                        });

                    }, 200);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        setTimeout(function () {
            $scope.getPlans();
        }, 600);
    });
});

module.controller('Plan', function ($scope, service) {

    ons.ready(function () {

        $scope.plan_id = mainNavigator.pages[mainNavigator.pages.length - 1].data.plan_id;
        $scope.plan = {};

        $scope.getPlanDetail = function () {

            modal.show();

            service.getPlanDetail({usuario_id: getUser().id, plan_id: $scope.plan_id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.plan = result.items;

                    setTimeout(function () {

                        $(mainNavigator.topPage).find('.preview').each(function () {
                            new ImageLoader($(this), new Image());
                        });

                    }, 200);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.getPlanDetail();

        setTimeout(function () {

            var fixed = mainNavigator.topPage.querySelector('.fixed');

            var list = mainNavigator.topPage.querySelector(".page__content");

            list.addEventListener("scroll", function (event) {

                if (list.scrollTop > 150) {

                    $(mainNavigator.topPage).addClass('scrolled');

                } else {

                    $(mainNavigator.topPage).removeClass('scrolled');
                }

            });

        }, 200);
    });
});

module.controller('ComoFunciona', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.como_funciona = $rootScope.params.como_funciona;

        $scope.goToComoFuncionaDetalle = function (index) {

            mainNavigator.pushPage('como_funciona_detalle.html', {data: {index: index}});
        };

    });
});

module.controller('ComoFuncionaDetalle', function ($rootScope, $scope, service) {

    ons.ready(function () {

        $scope.como_funciona = $rootScope.params.como_funciona[mainNavigator.pages[mainNavigator.pages.length - 1].data.index];
    });
});

module.controller('Guia', function ($scope, service) {

    ons.ready(function () {

        $scope.guia = [];
        $scope.category_id = mainNavigator.pages[mainNavigator.pages.length - 1].data ? mainNavigator.pages[mainNavigator.pages.length - 1].data.category_id : '';

        $scope.goToGuiaDetail = function (menu) {

            if (menu.subcategory == 0) {
                mainNavigator.pushPage('locals.html', {data: {category_id: menu.id}});
            } else {
                mainNavigator.pushPage('guia.html', {data: {category_id: menu.id}});
            }
        };

        $scope.getGuia = function () {

            modal.show();

            service.getGuia({category_id: $scope.category_id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();
                    $scope.guia = result.data;

                    setTimeout(function () {

                        $(mainNavigator.topPage).find('.preview').each(function () {
                            new ImageLoader($(this), new Image());
                        });

                    }, 200);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        setTimeout(function () {
            $scope.getGuia();
        }, 600);
    });
});

module.controller('Locals', function ($scope, service) {

    ons.ready(function () {

        $scope.locals = [];
        $scope.category_id = mainNavigator.pages[mainNavigator.pages.length - 1].data ? mainNavigator.pages[mainNavigator.pages.length - 1].data.category_id : '';

        $scope.redirectToLocalDetail = function (local) {

            $scope.goToLocal(local.local_id, local.type);
        };

        $scope.getLocals = function () {

            modal.show();

            service.getLocals({category_id: $scope.category_id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();
                    $scope.locals = result.data;

                    if (result.data.length == 0) {
                        alert(' ¡Ups! Todavía no tenemos ningún restaurante de esta categoría. ¡Prueba en otra!');
                    }

                    setTimeout(function () {

                        $(mainNavigator.topPage).find('.preview').each(function () {
                            new ImageLoader($(this), new Image());
                        });

                    }, 200);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        setTimeout(function () {
            $scope.getLocals();
        }, 600);
    });
});

function getUser() {

    //if (user == undefined) {

    if (localStorage.getItem(user_storage_key) != null && localStorage.getItem(user_storage_key) != undefined && localStorage.getItem(user_storage_key) != '' && localStorage.getItem(user_storage_key) != 'undefined') {

        user = JSON.parse(localStorage.getItem(user_storage_key));

    } else {

        user = undefined;
    }
    //}

    return user;
}

function saveUser(user) {

    localStorage.setItem(user_storage_key, JSON.stringify(user));

    user = JSON.parse(localStorage.getItem(user_storage_key));
}

function deleteUser() {

    localStorage.setItem(user_storage_key, undefined);
}

function updateLanguage(l) {

    applicationLanguage = l;

    if (scopeLogin != undefined) {

        scopeLogin.labels = lang[applicationLanguage];
        scopeLogin.$apply();
    }

    if (scopeMeetings != undefined) {

        scopeMeetings.labels = lang[applicationLanguage];
        scopeMeetings.$apply();
    }

    moment.locale(applicationLanguage);

    localStorage.setItem('lang', applicationLanguage);
}

function alert(message, callback) {
    ons.notification.alert({
        message: message,
        // or messageHTML: '<div>Message in HTML</div>',
        title: 'Mensaje',
        buttonLabel: 'OK',
        animation: 'default', // or 'none'
        // modifier: 'optional-modifier'
        callback: function () {
            callback ? callback() : '';
        }
    });
}

function confirm(message, callback) {
    ons.notification.confirm({
        message: message,
        // or messageHTML: '<div>Message in HTML</div>',
        title: ('Confirmación'),
        buttonLabels: [t('yes'), t('no')],
        animation: 'default', // or 'none'
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            // -1: Cancel
            // 0-: Button index from the left
            if (index == 0) {
                callback ? callback(index) : '';
            }
        }
    });
}

function t(label) {

    if (lang[applicationLanguage][label] == undefined) {
        return label;
    } else {
        return lang[applicationLanguage][label]
    }
}

function getUserOrAppId() {

    user = getUser();

    if (!user) {

        return app_id;

    } else {

        return user.app_id;
    }
}

function shareByEmail(message, callback) {

    window.plugins.socialsharing.shareViaEmail(
        message, // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
        '¿Cocinamos?',
        null, // TO: must be null or an array
        null, // CC: must be null or an array
        null, // BCC: must be null or an array
        [], // FILES: can be null, a string, or an array
        callback, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
        function (error) {
            alert(error)
        } // called when sh*t hits the fan
    );
}

function shareBySMS(message, callback) {
    window.plugins.socialsharing.shareViaSMS(message, null /* see the note below */, callback, function (msg) {
        alert('error: ' + msg)
    });
}

function shareByWhatsApp(message, callback) {
    window.plugins.socialsharing.shareViaWhatsApp(message, null /* img */, null /* url */, callback, function (errormsg) {
        alert(errormsg)
    });
}

function shareByFacebook(message, callback) {
    window.plugins.socialsharing.shareViaFacebook(message, null /* img */, null /* url */, callback, function (errormsg) {
        alert(errormsg)
    })
}

function shareBy(message, img) {
    window.plugins.socialsharing.share(
        message,
        'Compartir',
        [img],
        WEB_URL);
}
