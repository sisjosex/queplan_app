var templates = {

    planes_list: '<div class="list-item-container loading" rel="%index%">'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="full-screen animate"><img onload="onSliderIMGLoad(this, %index%, \'planesScroll\')" src="%imagen%" /></div>'+
    '<div class="overlay title">' +
        '<div>%title%</div>' +
        '<span class="distance">%distancia%</span>'+
        '<span class="button validar">VALIDAR<i>por el responsable del local</i></span>'+
    '</div>'+
    '</div>',

    recompensas_list_content: '<div class="list-item-container loading" rel="%index%">'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="full-screen animate"><img onload="onSliderIMGLoad(this, %index%, \'recompensasScroll\')" src="%imagen%" /></div>'+
    '<div class="overlay title">' +
        '<div>%title%</div>' +
        '<span class="points">%costo%</span>'+
        '<span class="button validar">VALIDAR<i>por el responsable del local</i></span>'+
    '</div>'+
    '</div>',

    guias_list:
    '<ons-list-item modifier="chevron" class="list-item-container guias-list loading" rel="%index%">'+
    '<div class="list-item-left">'+
    '<img src="%imagen%" class="avator" onload="refreshGuiasScroll(this)">'+
    '</div>'+
    '<div class="list-item-right">'+
    '<div class="list-item-content como_funciona_list">'+
    '<div class="name">%title%</div>'+
    '</div>'+
    '</div>'+
    '</ons-list-item>',

    como_funciona_list:
    '<ons-list-item modifier="chevron" class="list-item-container guias-list loading" onclick="gotoComofuncionaDetalle(%index%)">'+
    '<div class="list-item-left few">'+
    '<img src="%imagen%" class="avator" onload="refreshComoFuncionaScroll(this)">'+
    '</div>'+
    '<div class="list-item-right">'+
    '<div class="list-item-content como_funciona_list">'+
    '<div class="name">%title%</div>'+
    '</div>'+
    '</div>'+
    '</ons-list-item>',

    locales_list:
    '<ons-list-item modifier="chevron" class="list-item-container locales-list planes-list loading" rel="%index%">'+
    '<div class="list-item-left">'+
    '<div class="full-screen animate"><img src="%imagen%" class="avator" onload="adaptImage(this, %index%)"/></div>'+
    '</div>'+
    '<div class="list-item-right">'+
    '<div class="list-item-content">'+
    '<div>%local_title%</div>' +
    '<span class="distance">%distancia%</span>'+
    '</div>'+
    '</div>'+
    '</ons-list-item>',

    menu_list:
    '<ons-list-item modifier="chevron" class="list-item-container locales-list planes-list loading" rel="%index%">'+
    '<div class="list-item-left">'+
    '<div class="full-screen animate"><img src="%imagen%" class="avator" onload="adaptImage(this, %index%)"/></div>'+
    '</div>'+
    '<div class="list-item-right">'+
    '<div class="list-item-content">'+
    '<div>%local_title%</div>' +
    '<span class="distance">%distancia%</span>'+
    '</div>'+
    '</div>'+
    '</ons-list-item>',

    btn_subir: '<div class="subir_container"><div class="button nobutton subir" onclick="subir(event)"></div></div>',

    btn_pdf: '<div class="pdf_container"><div class="button nobutton pdf" onclick="openPdf(\'http://lasterrazasdebecerril.es/noticias/forceDowload/%pdf%\')"></div></div>',

    btn_pdf_grupo: '<div class="button nobutton pdf grupo" onclick="openPdf(\'http://lasterrazasdebecerril.es/paginas/forceDowload/%pdf%\')"></div>',

    vino_list_detail: '<div class="price-row"><div class="name">%nombre%</div><div class="price">%precio%</div></div>',

    slider_images: '' +
        '<ons-carousel-item class="item-bg detail home-slide session-item loading" url="%url%" section="%section%" section_id="%section_id%">'+
            '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
            '<div class="full-screen animate"><img onload="onSliderHomeIMGLoad(this, %index%); imageLoaded(%index%);" src="%image%" /></div>'+
            '<div class="title">%title%</div>'+
        '</ons-carousel-item>',

    slider_plan: '' +
    '<ons-carousel-item class="item-bg detail session-item loading">'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="full-screen animate"><img onload="onSliderIMGLoad(this, %index%)" src="%imagen%" /></div>'+
    '<div class="title">%title%<br/>%local_title%<span class="distance right">%distancia%</span></div>'+
    '</ons-carousel-item>',

    slider_local: '' +
    '<ons-carousel-item class="item-bg detail session-item loading">'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="full-screen animate"><img onload="onSliderIMGLoad(this, %index%)" src="%imagen%" /></div>'+
    '<div class="title">%local_title%<span class="distance right">%distancia%</span></div>'+
    '</ons-carousel-item>',

    slider_video: '' +
    '<ons-carousel-item class="item-bg detail session-item loading">'+
    //'<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    //'<div class="full-screen animate"><img onload="onSliderIMGLoad(this, 0)" src="" /></div>'+
        '<iframe src="" width="100%" height="100%" frameborder="0" allowfullscreen scrolling="no" onload="hidePreloader(this)"></iframe>'+
    //'<ons-icon icon="fa-play" spin="false" class="fa fa-play-circle-o" style="font-size: 72px;position: absolute;top: 50%;color: #ea5a96;left: 50%;margin-left: -27px;margin-top: -36px;"></ons-icon>'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="title">%local_title%<span class="distance right">%distancia%</span></div>'+
    '</ons-carousel-item>',

    iframe_player:
    '<iframe src="" width="100%" height="100%" frameborder="0" allowfullscreen scrolling="no" onload="hidePreloader(this)"></iframe>'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>',

    slider_player_navigator:
    '<div style="position:absolute;left:0;right:0;top:50%;">'+
        '<ons-icon icon="fa-play" spin="false" class="fa fa-play-circle-o" style="font-size: 32px;position:absolute;left:0;"></ons-icon>'+
        '<ons-icon icon="fa-play" spin="false" class="fa fa-play-circle-o" style="font-size: 32px;position:absolute;right:0;"></ons-icon>'+
    '</div>',

    slider_recompensa: '' +
    '<ons-carousel-item class="item-bg detail session-item loading">'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="full-screen animate"><img onload="adaptImage(this, %index%)" src="%imagen%" /></div>'+
    '<div class="title">%title%</div>'+
    '</ons-carousel-item>',

    slider_guia: '' +
    '<ons-carousel-item class="item-bg detail session-item loading">'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="full-screen animate"><img onload="adaptImage(this, %index%)" src="%imagen%" /></div>'+
    '<div class="title">%title%</div>'+
    '</ons-carousel-item>',

    slider_paginator: '' +
        '<div class="paginator-item"><div class="paginator-item-content"></div></div>',

    slider_ciudades: '' +
    '<ons-carousel-item class="item-bg ciudad_slide detail session-item loading" rel="%id%" onclick="elegirCiudad(%id%, event)">'+
        '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
        '<div class="full-screen animate"><img onload="onSliderCiudadIMGLoad(this, %index%)" src="%image%" /></div>'+
        '<div class="title">%title%</div>'+
    '</ons-carousel-item>',

    guest_paginator: '<li class="carousel-page %selected%"></li>',

    club_paginator: '<li class="carousel-page %selected%"></li>',

    life_paginator: '<li class="carousel-page %selected%"></li>',

    promo_paginator: '<li class="carousel-page %selected%"></li>',

    //zonas_tabs: '<div class="button nobutton" onclick="filtrarLocalesByZona(%id%)"><div class="zonas_icon"><img src="%imagen%" onload="adaptImage(this, %index%)" /></div><div class="text">%title%</div></div>'

    zonas_tabs:
    '<ons-carousel-item class="tab-item">' +
        '<div onclick="filtrarLocalesByZona(%id%)" class="button nobutton">'+
            '<div class="zonas_icon"><img src="%imagen%" onload="adaptImage(this, %index%)" /></div><div class="text">%title%</div>'+
        '</div>'+
    '</ons-carousel-item>',

    banner_items:
        '<ons-carousel-item >'+
            '<div class="banner-img" url="%url%" section="%section%" section_id="%section_id%"><img onload="bannerLoaded(%index%)" src="%image%" /></div>'+
        '</ons-carousel-item>',

    planes_page: '<div id="planesScroll" class="scrollable"> <div id="planesList" class="scroll-content"> <ons-list id="planes_content"> </ons-list> </div> </div>'
};




function loadIntoTemplate(div, data, template, labels, height) {

    var container = $(div);
    var content = '', cal = '', str = '';

    for(var i in data) {

        cal = data[i];
        var str = templates[template].replaceAll('%index%', i);

        for(var j in cal) {

            if(j != 'items') {
                str = str.replaceAll('%' + j + '%', cal[j]);
            }
        }

        if(labels != undefined) {

            for(var j in labels) {

                str = str.replaceAll('{' + j + '}', labels[j]);
            }
        }

        if(data[i].images && data[i].images.length > 0) {

            if(height !== undefined) {

                str = str.replaceAll('%first_image%', thumb_url.replaceAll('%width%', $(window).width()).replaceAll('%height%', height) + data[i].images[0]);

            } else {

                str = str.replaceAll('%first_image%', data[i].images[0]);
            }
        }

        if(data[i].items && data[i].items.length > 0) {

            tmp = loadIntoTemplateReturn(data[i].items, 'list_single', labels);

            str = str.replaceAll('%items%', tmp);
        }

        content = content + " " + str;

        delete str;
    }

    if(content !== '') {

        content = $(content);

        container.html('');

        container.append(content);

        try {
            ons.compile(content[0]);

        } catch (error){}
    }
}

function loadIntoTemplateReturn(data, template, labels) {

    var content = '', cal = '', str = '';

    for(var i in data) {

        cal = data[i];
        var str = templates[template].replaceAll('%index%', i);

        for(var j in cal) {

            str = str.replaceAll('%' + j + '%', cal[j]);
        }

        if(labels != undefined) {

            for(var j in labels) {

                str = str.replaceAll('{' + j + '}', labels[j]);
            }
        }

        if(data[i].images && data[i].images.length > 0) {

            if(height !== undefined) {

                str = str.replaceAll('%first_image%', thumb_url.replaceAll('%width%', $(window).width()).replaceAll('%height%', height) + data[i].images[0]);

            } else {

                str = str.replaceAll('%first_image%', data[i].images[0]);
            }
        }

        content = content + " " + str;

        delete str;
    }

    return content;
}

function loadIntoTemplateSingle(div, data, template, labels) {

    var container = $(div);
    var content = '', cal = '', str = '';


    cal = data[i];
    var str = templates[template].replaceAll('%index%', i);

    if(data != undefined) {
        for (var j in data) {

            str = str.replaceAll('%' + j + '%', data[j]);
        }
    }

    if(labels != undefined) {

        for(var j in labels) {

            str = str.replaceAll('{' + j + '}', labels[j]);
        }
    }

    content = content + " " + str;

    delete str;


    if(content !== '') {

        content = $(content);

        container.html('');

        container.append(content);

        ons.compile(content[0]);
    }
}
