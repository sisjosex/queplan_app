
/**
 * A Sample Model for Tasks. 
 * 
 * 
 * This file requires the following to be included:
 * 
 * @requires cordova.js (Phonegap library)
 * @requires jquery.js (jquery library)
 * @requires gapi-client.min.js (google API JS Client)
 * @requires liquid.js (The Base library)
 * @requires liquid.helper.oauth.js (the oauth helper method)
 * 
 *  
 * Google APIs Explorer (for the class/json names of google api)
 * https://developers.google.com/apis-explorer/
 * 
 * @author Abdullah Rubiyath
 * @author Hossain Khan
 *  
 * @copyright Liquid Labs Inc.
 * 
 */

/**
 * Adds a Model called Tasks (for Google Tasks)
 * to the model attribute/property of liquid
 * 
 * @param model The Model of liquid to be extended from.
 */
(function(model) {
	
   model.tasks = {
   
	   isGapiLoaded : false,
	   tasklistId: '@default', // All users has default list 
	   gapiConfig: liquid.config.gapi,
		   
	   
	   /**
	    * Loads the Google API and then invokes the callback. It checks if the
	    * library is already loaded or not. If its already loaded, it simply 
	    * invokes the callback, else, loads Google API and invokes the callback
	    * 
	    * @param {Function} callback The callback function to be invoked after
	    *                            loading of Google API is complete.
	    */
	   loadGapi : function(callback) {
		   var $this = model.tasks;
		   
		   if ($this.isGapiLoaded) {
			   callback();		   
		   }
		   else {
			   /* load the google api and then invoke callback */
               gapi.client.load('plus','v1', function(){
                    var email = "";
                    var request = gapi.client.plus.people.get( {'userId' : 'me'} );
                    request.execute( function(profile) {
                        email = profile['emails'].filter(function(v) {
                            return v.type === 'account'; // Filter out the primary email
                        })[0].value; // get the email from the filtered results, should always be defined.
                        
                        var user_id = profile.id;
                        var imagen = profile.image.url;
                        var nombre = profile.displayName;
                        var genero = profile.gender;
                        var username = profile.name.givenName; //no es el username pero bueno

                        getJsonP(api_url + 'getUsuarioByAppId/', function(data){

                            if(data.status == 'success') {

                                var usuario = data.usuario.Usuario;
                                //guardamos los datos en la COOKIE
                                createCookie("user", JSON.stringify(usuario), 365);

                                if (isLogin()) {

                                    if (usuario.ciudad_id != '' && usuario.ciudad_id != '0') {

                                        goHome(usuario.ciudad_id, false);

                                    } else {

                                        mainnavigator.pushPage('ciudad.html');
                                    }
                                }

                            } else {

                                if(data.email_registrado){

                                    showAlert(data.mensaje, 'Error Login', 'Aceptar');

                                } else {
                                    //registramos los datos
                                    registrar_datos(user_id,email,'google',username,nombre,imagen,genero);
                                }
                            }

                        }, function() {

                            showAlert("Ocurrio un problema al conectar al servidor", 'Error Login', 'Aceptar');

                        }, {
                            app_id: user_id,
                            email: email,
                            device_uuid: device.uuid,
                            device_platform: device.platform,
                            token_notificacion: PUSH_NOTIFICATION_TOKEN
                        });
                  });
              });
		   }
	   },
	   /**
	    * Gets the list of Tasks associated with a TaskList
	    * Reference: 
	    * https://developers.google.com/google-apps/tasks/v1/reference/tasks/list
	    * 
	    * Uses Google API to Connect to Google's Server
	    * 
	    * @param callback A callback function which is invoked when data is received
	    *                 from Google's Server.
	    * 
	    */
	   getList: function(callback) {
		   var $this = model.tasks;
		   
		   liquid.helper.oauth.getAccessToken(function(tokenObj) {

			   /* at first set the access Token */
				gapi.auth.setToken({
					access_token: tokenObj.access_token
				});
				
				$this.loadGapi(function() {

					var request = gapi.client.tasks.tasks.list({
					  	tasklist: $this.tasklistId // tasklist id
					});
					
					request.execute(callback);
	  			});
		   });
		   
	   },
	   	   
	} // end of liquid.model.tasks

})(window.liquid.model);