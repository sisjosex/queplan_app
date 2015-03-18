var templates = {

    carta_list_content: '<div class="price-row"><div class="name">%nombre%</div><div class="price">%precio%€</div></div>',

    list_single: '<div class="price-row vinos_list"><div class="name">%nombre%</div><div class="price">%precio%€</div></div>',

    fotos_list_content: '<div class="galeria-item button nobutton" onclick="goToFoto(%index%)"><img src="http://lasterrazasdebecerril.es/img/fotos/thumbnails/%url%" onload="refreshGaleriaScroll()"></div>',

    carta_list_vino_content: '<h4><div class="name">%nombre%</div></h4>'+
    '<div class="menu_grupo_content">'+
    '%items%</div>',

    page_list_content: '<div class="horizontal"><div class="title">%nombre%</div> <div class="description">%descripcion%</div>'+
    '<figure><img src="http://lasterrazasdebecerril.es/img/fotos/%url%" alt="" onload="refreshPageScroll()"/></figure></div>',

    grupo_list_content: '<div class="price-row"><div class="name">%nombre%</div><div class="price">%precio%€</div>' +
    '</div>'+
    '<div class="menu_grupo_content">'+
    '%descripcion%</div>',

    planes_list_content: '<ons-list-item modifier="chevron" class="list-item-container" onclick="gotoPlanDetalle(%index%)">'+
'<div class="list-item-left">'+
        '<img src="%imagen%" class="avator">'+
'</div>'+
        '<div class="list-item-right">'+
'<div class="list-item-content">'+
        '<div class="name">%title%</div>'+
        '</div>'+
        '</div>'+
            '</ons-list-item>',

    novedades_list_content: '<ons-list-item class="list__item--tappable list__item__line-height" modifier="chevron" onclick="goToNovedadDetalle(%index%, event)">' +
                            '<div class="arrow">' +
                            '<div class="list-item novedades">' +
                                '<div class="image"></div>' +
                            '<div class="list_title"><p><img align="left" src="http://lasterrazasdebecerril.es/img/novedades/thumbnails/%imagen%" onload="refreshNovedadesScroll()"/><span class="novedad_titulo">%nombre%</span><span class="novedad_fecha">%fecha%</span><span class="short_desc">%descripcion_cut%</span></p></div>' +
                            '</div></div></ons-list-item>',

    planes_list:
        '<ons-list-item class="list__item--tappable list__item__line-height" modifier="chevron" onclick="goToPlanesDetalle(%index%, event)">' +
            '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
            '<div class="full-screen animate"><img onload="onSliderHomeIMGLoad(this, %index%)" src="%list_image%" /></div>'+
            '<div class="title">%title%</div>'+
            '<div class="distance">%distance%</div>'+
        '</ons-list-item>',

    guias_list:
    '<ons-list-item modifier="chevron" class="list-item-container" onclick="gotoLocales(%index%)">'+
    '<div class="list-item-left">'+
    '<img src="%imagen%" class="avator" onload="refreshGuiasScroll()">'+
    '</div>'+
    '<div class="list-item-right">'+
    '<div class="list-item-content">'+
    '<div class="name">%title%</div>'+
    '</div>'+
    '</div>'+
    '</ons-list-item>',

    locales_list:
    '<ons-list-item modifier="chevron" class="list-item-container" onclick="gotoGuiaDetalle(%index%)">'+
    '<div class="list-item-left">'+
    '<img src="%imagen%" class="avator" onload="refreshLocalesScroll()">'+
    '</div>'+
    '<div class="list-item-right">'+
    '<div class="list-item-content">'+
    '<div class="name">%title%</div>'+
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
            '<div class="full-screen animate"><img onload="onSliderHomeIMGLoad(this, %index%)" src="%list_image%" /></div>'+
            '<div class="title">%title%</div>'+
        '</ons-carousel-item>',

    slider_plan: '' +
    '<ons-carousel-item class="item-bg detail session-item loading">'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="full-screen animate"><img onload="onSliderHomeIMGLoad(this, %index%)" src="%imagen%" /></div>'+
    '<div class="title">%title%</div>'+
    '</ons-carousel-item>',

    slider_guia: '' +
    '<ons-carousel-item class="item-bg detail session-item loading">'+
    '<ons-icon icon="ion-loading-c" spin="true" class="ons-icon ons-icon--ion ion-loading-c fa-lg"></ons-icon>'+
    '<div class="full-screen animate"><img onload="onSliderHomeIMGLoad(this, %index%)" src="%imagen%" /></div>'+
    '<div class="title">%title%</div>'+
    '</ons-carousel-item>',

    slider_paginator: '' +
        '<div class="paginator-item"><div class="paginator-item-content"></div></div>',

    slider_ciudades: '' +
    '<ons-carousel-item class="item-bg detail session-item loading">'+
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
