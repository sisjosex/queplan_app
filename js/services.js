

angular.module("services", []).factory("service", [ "$http", "$q", function($http, $q) {
    return {
        authenticate: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'validarDeviceUuid/?callback=JSON_CALLBACK', params: checkParams(params)}).success(success).error(error);
        },
        setCity: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'setCiudad/?callback=JSON_CALLBACK', params: checkParams(params)}).success(success).error(error);
        },
        getNotifications: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getAlertas/?callback=JSON_CALLBACK', params: checkParams(params)}).success(success).error(error);
        },
        onOffNotifications: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'setAlerta/?callback=JSON_CALLBACK', params: checkParams(params)}).success(success).error(error);
        },
        getMenus: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getMenuDiario/?callback=JSON_CALLBACK', params: checkParams(params)}).success(success).error(error);
        },
        getMenuDetail: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getMenuDiarioDetalle/?callback=JSON_CALLBACK', params: checkParams(params)}).success(success).error(error);
        },
        getLocal: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getLocals/?callback=JSON_CALLBACK', params: checkParams(params)}).success(success).error(error);
        },
        getPlans: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getPlans/?callback=JSON_CALLBACK', params: checkParams(params)}).success(success).error(error);
        },
        getPlanDetail: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getPlans/?callback=JSON_CALLBACK', params: checkParams(params)}).success(success).error(error);
        },
        getGuia: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getGuia/?callback=JSON_CALLBACK', params: checkParams(params)}).success(success).error(error);
        },
        getLocals: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getLocals/?callback=JSON_CALLBACK', params: checkParams(params)}).success(success).error(error);
        },
        loQuiero: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'loQuiero/?callback=JSON_CALLBACK', params: checkParams(params)}).success(success).error(error);
        },
    };
} ]);

function checkParams(params) {

    try {

        device;

    } catch(error) {

        device = {
            platform: 'ios',
            version: '9.0',
            platform: 'iphone',
            uuid: 'ASDASDASD'
        }
    }

    params.lang = applicationLanguage;
    params.d_plataforma = device.platform;
    params.d_version = device.version;
    params.d_name = device.platform === 'android' || device.platform === 'Android' ? 'android' : 'iphone';
    params.device_uuid = device.uuid;

    if(getUser()) {
        if(!params.ciudad_id) {

            params.ciudad_id = getUser().ciudad_id;
        }

        if(!params.usuario_id) {

            params.usuario_id = getUser().usuario_id;
        }
    }

    return params;
}