/*
   Event Handler HOOKS and Implementations.
   
   =================================================================================================
   BEGIN EVENT HOOK & HANDLING USING JS
   =================================================================================================
   
   Demo showing how to implement Google API with oAuth.
   
   Disclaimer: The code below is just another Javascript Spaghetti code. To avoid such spaghetti code, please look into 
   something like backbone.js to make the actual App :)! 
 */


function loginGoogleConnect() {

    if(!conectando) {
        conectando = true;


        var oAuth = liquid.helper.oauth;
        liquid.helper.oauth.authorize(authorizeWindowChange);

        if (oAuth.isAuthorized()) {
            //TODO
        }
    }
}

function authorizeWindowChange(uriLocation) {

    conectando = false;

    //console.log("Location Changed: " + uriLocation); 
	var oAuth = liquid.helper.oauth;
	
	// oAuth process is successful!	
    if (oAuth.requestStatus == oAuth.status.SUCCESS) {
        var authCode = oAuth.authCode;

        // have the authCode, now save the refreshToken and start Page TaskList
        oAuth.saveRefreshToken({ 
        	  	auth_code: oAuth.authCode
        	  }, function() {
        	       //mostramos loading
                    modal.show();
                   
        	       liquid.model.tasks.getList(function(data) {
        	           //alert(JSON.stringify(data)); // debug JSON response data
                   });
        	  });
        
    } 
    else if (oAuth.requestStatus == oAuth.status.ERROR) 
    {
    	console.log("ERROR - status received = oAuth.status.ERROR");
    } 
    else {
        // do nothing, since user can be visiting different urls
    }
}

(function() {
    //TODO
})();