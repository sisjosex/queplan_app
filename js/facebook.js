function loginFacebookConnect() {
    openFB.login(
        function (response) {
            if (response.status === 'connected') {
                alert('connected');

                FB_LOGIN_SUCCESS = true;
                openFB.api({
                    path: '/me',
                    success: function (data) {
                        var app_id = data.id;
                        var first_name = data.first_name;
                        var last_name = data.last_name;
                        var username = data.username;
                        var nombre = data.name;
                        var email = data.email;
                        var genero = data.gender;
                        var imagen = "";

                        //verificamos si este usuario no se logeo con anterioridad, si no lo hizo lo creamos como nuevo, si lo hizo solo actualizamos su estado logeado a 1
                        getJsonPBackground(BASE_URL + 'getUsuarioByAppId/', function (data) {

                            if (data.status == 'success') {
                                var usuario = data.usuario;
                                //guardamos los datos en la COOKIE
                                createCookie("user", JSON.stringify(usuario), 365);
                                //mandamos directo al home si es que la cookie se creo correctamente
                                if (isLogin()) {
                                    mainnavigator.pushPage('ciudad.html');
                                }
                            } else {

                                if (data.status == 'fail') {

                                    showAlert(data.mensaje, 'Error Login', 'Aceptar');

                                } else {
                                    //registramos los datos
                                    registrar_datos(app_id, email, 'facebook', username, nombre, imagen, genero);
                                    //registrar_datos(100000614903708, "steven.alvarez.v@gmail.com",'facebook',"johsteven","Jhonny Esteban Alvarez Villazante","http://profile.ak.fbcdn.net/hprofile-ak-ash2/371352_100000614903708_518504752_q.jpg","male");
                                }
                            }

                        }, function () {

                            showAlert("Ocurrio un problema al conectar al servidor", 'Error Login', 'Aceptar');
                        }, {
                            app_id: app_id,
                            email: email,
                            uuid: device.uuid,
                            platform: device.platform,
                            token_notificacion: PUSH_NOTIFICATION_TOKEN
                        });

                    },
                    error: errorHandler
                });
            } else {
                showAlert('Facebook login failed: ' + response.error, 'Error Login', 'Aceptar');
            }
        }, {scope: 'email,offline_access,read_stream,publish_stream'});
}

function logoutFacebookConnect() {
    openFB.logout(
        function () {
            FB_LOGIN_SUCCESS = false;
        },
        errorHandler);
}

//shareFacebookWallPost
function shareFacebookWallPost(subtitulo, descripcion, imagen) {
    openFB.api({
        method: 'POST',
        path: '/me/feed',
        params: {
            message: descripcion
        },
        success: function () {
            showAlert("Se ha publicado tu Post!.", "Enhorabuena", "Aceptar");
        },
        error: errorHandler
    });
}
