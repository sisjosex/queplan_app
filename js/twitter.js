   
/* REGISTRO TWITTER FUNCTION */
//loginTwitterConnect
function loginTwitterConnect() {
    cb.__call(
    	"oauth_requestToken",
    		{oauth_callback: "http://web.queplanmadrid.es/"},
    		function (reply) {
    			// nailed it!
       			cb.setToken(reply.oauth_token, reply.oauth_token_secret);
       			cb.__call(
    			"oauth_authorize",	{},
    			function (auth_url) {
    			    var ingreso_correcto = true;
    				window.plugins.ChildBrowser.showWebPage(auth_url, { showLocationBar : false }); // This opens the Twitter authorization / sign in page
            		window.plugins.ChildBrowser.onLocationChange = function(loc){
            			if (loc.indexOf("http://web.queplanmadrid.es/?") >= 0 && ingreso_correcto) {
            			    ingreso_correcto = false;
                            //close ChildBrowser
                            window.plugins.ChildBrowser.close();
                            
                			// Parse the returned URL
                            var params = loc.toString().split("&");
                            var verifier = params[1].toString();
                            var parameter = verifier.split("="); //oauth_verifier
                            
                    	    //mostramos loading
                            showLoadingCustom('Redireccionando, espere por favor...');
                            
                        	cb.__call(
                               	"oauth_accessToken", {oauth_verifier: parameter[1]},
                               	function (reply) {
                            	   	cb.setToken(reply.oauth_token, reply.oauth_token_secret);
                                    
                                    //almacenamos el oauth_token y oauth_token_secret en la db del dispositivo
                                   	localStorage.accessToken = reply.oauth_token;
                                   	localStorage.tokenSecret = reply.oauth_token_secret;
                                    
                                    //obtenemos el nombre y el id del usuario de su twitter
                                    var user_id = reply.user_id;
                                    var user_screen_name = reply.screen_name;
                                    var email = '';
                                    
                            	    //mostramos loading
                                    showLoadingCustom('Validando datos...');
                                    
                                    //verificamos si este usuario no se logeo con anterioridad, si no lo hizo lo creamos como nuevo, si lo hizo solo actualizamos su estado logeado a 1
                                	$.getJSON(BASE_URL_APP + 'usuarios/mobileGetUsuarioByAppId/'+user_id+'/'+email+'/'+device.uuid+'/'+device.platform+'/'+PUSH_NOTIFICATION_TOKEN, function(data) {
                                        //ocultamos el loading
                                        $.mobile.loading( 'hide' );
                                	    if(data.success){
                                	        var usuario = data.usuario.Usuario;
                                            //guardamos los datos en la COOKIE
                                	        createCookie("user", JSON.stringify(usuario), 365);
                                            //mandamos directo al home si es que la cookie se creo correctamente
                                            if(isLogin()){
                                                $.mobile.changePage('#home');
                                            }
                                        }else{
                                            if(data.email_registrado){
                                                showAlert(data.mensaje, 'Error Login', 'Aceptar');
                                            }else{
                                                //registramos los datos
                                                registrar_datos(user_id,email,'twitter',user_screen_name,"","","");                                                
                                            }
                                        }
                                	});
                                }
                            );
            			}
            		}; // When the ChildBrowser URL changes we need to track that
       			}
    		);
    	}
    );
}


//shareTwitterWallPost
function shareTwitterWallPost(subtitulo, descripcion, imagen) {
    
    descripcion+= " via @QuePlanMadrid";
    
    // check if we already have access tokens
    if(localStorage.accessToken && localStorage.tokenSecret) {
    	// then directly setToken() and read the timeline
    	cb.setToken(localStorage.accessToken, localStorage.tokenSecret);
        cb.__call(
            "statuses_update",
            {"status": descripcion},
            function (reply) {
                //alert(JSON.stringify(reply));
            }
        );
    } else { // authorize the user and ask her to get the pin.
        cb.__call(
        	"oauth_requestToken",
        		{oauth_callback: "http://web.queplanmadrid.es/"},
        		function (reply) {
        			// nailed it!
           			cb.setToken(reply.oauth_token, reply.oauth_token_secret);
           			cb.__call(
        			"oauth_authorize",	{},
        			function (auth_url) {
        			    var ingreso_correcto = true;
        				window.plugins.ChildBrowser.showWebPage(auth_url, { showLocationBar : false }); // This opens the Twitter authorization / sign in page
                		window.plugins.ChildBrowser.onLocationChange = function(loc){
                			if (loc.indexOf("http://web.queplanmadrid.es/?") >= 0 && ingreso_correcto) {
                			    ingreso_correcto = false;
                                //close ChildBrowser
                                window.plugins.ChildBrowser.close();
                                
                    			// Parse the returned URL
                                var params = loc.toString().split("&");
                                var verifier = params[1].toString();
                                var parameter = verifier.split("="); //oauth_verifier
                                                                
                            	cb.__call(
                                   	"oauth_accessToken", {oauth_verifier: parameter[1]},
                                   	function (reply) {
                                	   	cb.setToken(reply.oauth_token, reply.oauth_token_secret);
                                        
                                        //almacenamos el oauth_token y oauth_token_secret en la db del dispositivo
                                       	localStorage.accessToken = reply.oauth_token;
                                       	localStorage.tokenSecret = reply.oauth_token_secret;
                                        
                                        //publicamos en twitter
                                        cb.__call(
                                            "statuses_update",
                                            {"status": descripcion},
                                            function (reply) {
                                                //alert(JSON.stringify(reply));
                                            }
                                        );
                                    }
                                );
                			}
                		}; // When the ChildBrowser URL changes we need to track that
           			}
        		);
        	}
        );
    }
}