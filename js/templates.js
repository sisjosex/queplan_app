var templates = {

    planes_list: '<div class="list-item-container loading" rel="%index%">'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="full-screen animate"><img onload="onSliderHomeIMGLoad(this, %index%, \'planesScroll\')" src="%imagen%" /></div>'+
    '<div class="overlay title">' +
        '<div>%title%</div>' +
        '<span class="distance">%distancia%</span>'+
    '</div>'+
    '</div>',

    recompensas_list_content:
    '<ons-list-item modifier="chevron" class="list-item-container loading planes-list" rel="%index%">'+
    '<div class="list-item-left">'+
    '<div class="full-screen animate"><img src="%imagen%" class="avator" onload="adaptImage(this, %index%)"/></div>'+
    '</div>'+
    '<div class="list-item-right">'+
    '<div class="list-item-content">'+
    '<div class="name">%title%</div>'+
    '<span class="points">%costo%</span>'+
    '<div class="button validar"></div>'+
    '</div>'+
    '</div>'+
    '</ons-list-item>',

    guias_list:
    '<ons-list-item modifier="chevron" class="list-item-container loading" rel="%index%">'+
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
    '<ons-list-item modifier="chevron" class="list-item-container loading" onclick="gotoComofuncionaDetalle(%index%)">'+
    '<div class="list-item-left">'+
    '<img src="%imagen%" class="avator" onload="refreshComoFuncionaScroll(this)">'+
    '</div>'+
    '<div class="list-item-right">'+
    '<div class="list-item-content como_funciona_list">'+
    '<div class="name">%title%</div>'+
    '</div>'+
    '</div>'+
    '</ons-list-item>',

    locales_list:
    '<ons-list-item modifier="chevron" class="list-item-container planes-list loading" rel="%index%">'+
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
    '<ons-list-item modifier="chevron" class="list-item-container planes-list loading" rel="%index%">'+
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
        '<ons-carousel-item class="item-bg detail session-item loading">'+
            '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
            '<div class="full-screen animate"><img onload="onSliderHomeIMGLoad(this, %index%); imageLoaded(%index%);" src="%list_image%" /></div>'+
            '<div class="title">%title%</div>'+
        '</ons-carousel-item>',

    slider_plan: '' +
    '<ons-carousel-item class="item-bg detail session-item loading">'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="full-screen animate"><img onload="onSliderHomeIMGLoad(this, %index%)" src="%imagen%" /></div>'+
    '<div class="title">%title%<br/>%local_title%<span class="distance right">%distancia%</span></div>'+
    '</ons-carousel-item>',

    slider_local: '' +
    '<ons-carousel-item class="item-bg detail session-item loading">'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="full-screen animate"><img onload="onSliderHomeIMGLoad(this, %index%)" src="%imagen%" /></div>'+
    '<div class="title">%local_title%<span class="distance right">%distancia%</span></div>'+
    '</ons-carousel-item>',

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
    '<ons-carousel-item class="item-bg ciudad_slide detail session-item loading" rel="%id%">'+
        '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
        '<div class="full-screen animate"><img onload="onSliderCiudadIMGLoad(this, %index%)" src="%image%" /></div>'+
        '<div class="title">%title%</div>'+
    '</ons-carousel-item>',

    guest_paginator: '<li class="carousel-page %selected%"></li>',

    club_paginator: '<li class="carousel-page %selected%"></li>',

    life_paginator: '<li class="carousel-page %selected%"></li>',

    promo_paginator: '<li class="carousel-page %selected%"></li>'
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
