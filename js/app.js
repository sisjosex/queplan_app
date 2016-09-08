var API_URL = 'http://web.queplanmadrid.es/api2/';
var WEB_URL = 'http://web.queplanmadrid.es/';

var module = ons.bootstrap('MyApp', ['services', 'ngSanitize']);

var applicationLanguage = 'es';
var user;
var user_storage_key = 'queplanapp_user';
var currentNavigator = undefined;

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

            PhotoViewer.show(url);
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

        $rootScope.openPage = function(id, type) {

        };


        $rootScope.goToLocal = function (id, type) {

            if(type == undefined || type == 'restaurant') {

                mainNavigator.pushPage('local_restaurant.html', {data:{local_id: id}});

            } else if(type == 'shopping') {

                mainNavigator.pushPage('local_shop.html', {data:{local_id: id}});

            } else if(type == 'other') {

                mainNavigator.pushPage('local_other.html', {data:{local_id: id}});
            }
        };

        $scope.goToPlan = function(plan_id) {

            mainNavigator.pushPage('plan.html', {data:{plan_id: plan_id}});
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

        $scope.deviceReady = false;

        if (document.location.protocol == 'http:') {

            API_URL = 'http://web.queplanmadrid.es/api2/';

            setTimeout(onDeviceReady, 500);

        } else {

            API_URL = 'http://web.queplanmadrid.es/api2/';

            document.addEventListener("deviceready", onDeviceReady, false);
        }

        function onDeviceReady() {

            $scope.$apply(function () {

                document.addEventListener("online", onOnline, false);
                document.addEventListener("offline", onOffline, false);

                $scope.deviceReady = true;

                localStorage.setItem('lang', applicationLanguage);


                $rootScope.authenticate(function () {

                    if (getUser().ciudad_id == '0') {

                        mainNavigator.pushPage('cities.html', {animation: 'none'});

                    } else {

                        mainNavigator.pushPage('home.html', {animation: 'none'});
                    }
                });

                try {
                    StatusBar.hide();
                } catch (error) {
                }

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

        $scope.gotoDailyMenus = function() {
            mainNavigator.pushPage('daily_menus.html');
        };

        $scope.gotoComoFunciona = function() {
            mainNavigator.pushPage('como_funciona.html');
        };

        $scope.test = function () {
            console.log('test');
        };

        try {
            navigator.splashscreen.hide();
        } catch (error) {
        }

        $scope.current_carousel_index = 0;

        setTimeout(function () {

            $(mainNavigator.topPage).find('.preview').each(function () {
                new ImageLoader($(this), new Image());
            });

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

        }, 200);

    });
});

module.controller('Cities', function ($scope, service) {

    ons.ready(function () {

        $scope.user = getUser();

        $scope.setCity = function (id) {

            modal.show();

            service.setCity({usuario_id: $scope.user.id, ciudad_id: id}, function (result) {

                if (result.status == 'success') {

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
                new ImageLoader($(this), new Image());
            });

        }, 200);

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

module.controller('DailyMenus', function ($scope, service) {

    ons.ready(function () {

        $scope.menus = [];
        $scope.categories = [];
        $scope.category_id = '';
        $scope.menu_type = '';

        $scope.search = function(category_id) {

            $scope.category_id = category_id;

            rightSplitter.toggle();

            $scope.getMenus();
        };

        $scope.filterByType = function(type) {

            $scope.menu_type = type;

            $scope.getMenus();
        };

        $scope.goToMenuDetail = function(menu) {

            mainNavigator.pushPage('menu_detail.html', {data:{menu: menu}});
        };

        $scope.getMenus = function () {

            modal.show();

            service.getMenus({usuario_id: getUser().id, ciudad_id: getUser().ciudad_id, category_id: $scope.category_id, menu_type: $scope.menu_type}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

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

        $scope.filterByType = function(type) {

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

            list.addEventListener("scroll", function(event) {

                if(list.scrollTop > 200) {

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

        $scope.filterByType = function(type) {

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

            list.addEventListener("scroll", function(event) {

                if(list.scrollTop > 200) {

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

        $scope.search = function(category_id) {

            $scope.category_id = category_id;

            rightSplitter.toggle();

            $scope.getMenus();
        };

        $scope.filterByType = function(type) {

            $scope.menu_type = type;

            $scope.getMenus();
        };

        $scope.getPlans = function () {

            modal.show();

            service.getPlans({usuario_id: getUser().id, ciudad_id: getUser().ciudad_id, category_id: $scope.category_id, menu_type: $scope.menu_type}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.plans = result.items;
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

            list.addEventListener("scroll", function(event) {

                if(list.scrollTop > 150) {

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

        $scope.goToComoFuncionaDetalle = function(index) {

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

        $scope.goToGuiaDetail = function(menu) {

            if(menu.subcategory == 0) {
                mainNavigator.pushPage('locals.html', {data:{category_id: menu.id}});
            } else {
                mainNavigator.pushPage('guia.html', {data:{category_id: menu.id}});
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

        $scope.redirectToLocalDetail = function(local) {

            $scope.goToLocal(local.local_id, local.type);
        };

        $scope.getLocals = function () {

            modal.show();

            service.getLocals({category_id: $scope.category_id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();
                    $scope.locals = result.data;

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
