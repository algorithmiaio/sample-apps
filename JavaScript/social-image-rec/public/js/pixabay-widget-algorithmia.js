/*
    Pixabay Image Gallery Widget v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-PixabayWidget
    License: http://www.opensource.org/licenses/mit-license.php

    settings:
        // default values
        var pixabayWidget = { class_name: '', ... };
    public methods:
        // reload widget(s) after DOM changes
        new initPixabayWidget();
*/

(function(){
    var cache = {}, counter = 0, o = {
        class_name: 'pixabay_widget',
        row_height: 170,
        per_page: 20,
        max_rows: 0,
        truncate: true,
        lang: 'en',
        image_type: 'all', // 'photo', 'illustration'
        safesearch: false,
        editors_choice: false,
        order: 'popular', // 'latest'
        target: '', // '_blank'
        navpos: 'bottom', // position of branding and pagination: false, 'bottom', 'top'
        branding: true,
        prev: '◄ PREV',
        next: 'NEXT ►'
    }
    if (typeof pixabayWidget === 'object') {
        for (var k in pixabayWidget) { if (Object.prototype.hasOwnProperty.call(pixabayWidget, k)) o[k]=pixabayWidget[k]; }
    }

    if (!('key' in o)) {
        console.log('API key missing: Your Pixabay API key must be defined as "key" in the pixabayWidget configuration array.');
        return false;
    }

    styles = (
        '** .noselect { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }'+
        '** a, ** b { color: #4e99c7; text-decoration: none; font-weight: normal; cursor: pointer; transition: .3s; }'+
        '** a:hover, ** b:hover { opacity: .7; }'+
        '** a img { border: 0; }'+
        '** **_nav { clear: both; padding: 3px 7px; font: normal 12px arial, sans-serif; color: #777; }'+
        '** **_nav span { color: #ddd; cursor: default; }'+
        '** .branding { float: right; }'+
        '**.flex_grid { overflow: hidden; }'+
        '**.flex_grid .item { float: left; margin: 1px; box-sizing: content-box; overflow: hidden; position: relative;  }'+
        '**.flex_grid .item img { display: block; width: auto; height: 100%; background: #fff; transition: .3s; }'+
        '**.flex_grid .item img:hover { opacity: .85; }').replace(/\*\*/g, '.'+o.class_name);
    var el = document.createElement('style'); el.type = 'text/css';
    if (el.styleSheet) el.styleSheet.cssText = styles; //IE
    else el.appendChild(document.createTextNode(styles));
    document.getElementsByTagName('head')[0].appendChild(el);

    // JavaScript flexImages v1.0.2
    var flexImages=function(){function e(e){function t(e,r,n,i){function o(e){n.maxRows&&g>n.maxRows||n.truncate&&e&&g>1?c[a][0].style.display="none":(c[a][4]&&(c[a][3].setAttribute("src",c[a][4]),c[a][4]=""),c[a][0].style.width=l+"px",c[a][0].style.height=h+"px",c[a][0].style.display="block")}for(var a,l,s,d,f=1,g=1,u=e.clientWidth-2,c=[],m=0,h=n.rowHeight,w=0;w<r.length;w++)if(c.push(r[w]),m+=r[w][2]+n.margin,m>=u){var p=c.length*n.margin;for(f=(u-p)/(m-p),h=Math.ceil(n.rowHeight*f),s=0,l,a=0;a<c.length;a++)l=Math.ceil(c[a][2]*f),s+=l+n.margin,s>u&&(l-=s-u),o();c=[],m=0,g++}for(a=0;a<c.length;a++)l=Math.floor(c[a][2]*f),d=Math.floor(n.rowHeight*f),o(!0);i||u==e.clientWidth||t(e,r,n,!0)}if(document.querySelector){var r={selector:0,container:".item",object:"img",rowHeight:180,maxRows:0,truncate:0};for(var n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);for(var i="object"==typeof r.selector?[r.selector]:document.querySelectorAll(r.selector),o=0;o<i.length;o++){var a=i[o],l=a.querySelectorAll(r.container),s=[],d=(new Date).getTime();if(l.length){var f=window.getComputedStyle?getComputedStyle(l[0],null):l[0].currentStyle;r.margin=(parseInt(f.marginLeft)||0)+(parseInt(f.marginRight)||0)+(Math.round(parseFloat(f.borderLeftWidth))||0)+(Math.round(parseFloat(f.borderRightWidth))||0);for(var g=0;g<l.length;g++){var u=l[g],c=parseInt(u.getAttribute("data-w")),m=c*(r.rowHeight/parseInt(u.getAttribute("data-h"))),h=u.querySelector(r.object);s.push([u,c,m,h,h.getAttribute("data-src")])}t(a,s,r);var w=function(){t(a,s,r)};document.addEventListener?(window["flexImages_listener"+d]=w,window.removeEventListener("resize",window["flexImages_listener"+a.getAttribute("data-flex-t")]),delete window["flexImages_listener"+a.getAttribute("data-flex-t")],window.addEventListener("resize",window["flexImages_listener"+d])):a.onresize=w,a.setAttribute("data-flex-t",d)}}}}return e}();!function(){"function"==typeof define&&define.amd?define("flexImages",function(){return flexImages}):"undefined"!=typeof module&&module.exports?module.exports=flexImages:window.flexImages=flexImages}();

    function escapeHTML(s){return s?s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):'';}
    function toTitleCase(s){ return s.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); }

    function callback_name(f, node, page, per_page, url){
        var fname = 'pxw_callback_'+counter;
        window[fname] = function(data){ f(data, node, page, per_page, url); try { delete window[fname]; } catch(e){} };
        counter++;
        return fname;
    }

    APIResponse = function(data, n, page, per_page, url){
        var nav = '', html = '',
            rh = parseInt(n.getAttribute('data-row-height'))||o.row_height,
            mr = parseInt(n.getAttribute('data-max-rows'))||o.max_rows,
            tr = n.getAttribute('data-truncate')||o.truncate,
            target = n.getAttribute('data-target')||o.target,
            br = n.getAttribute('data-branding')||o.branding,
            prev = n.getAttribute('data-prev')||o.prev,
            next = n.getAttribute('data-next')||o.next,
            navpos = n.getAttribute('data-navpos')||o.navpos;

        if (rh < 30 || rh > 180) rh = 170;
        if (tr == 'false') tr = 0; else if (tr == 'true') tr = 1;
        if (br == 'false') br = 0; else if (br == 'true') br = 1;

        if (data != false) { // prefilled widget?
            cache[url] = data;

            // pagination and branding
            var is_paginated = data.totalHits > per_page && prev && next;
            if (is_paginated || br) {
                nav += '<div class="noselect '+o.class_name+'_nav">';
                if (br) nav += '<div class="branding">Powered by <a href="https://pixabay.com/" target="'+target+'">Pixabay</a></div>';
                if (is_paginated) {
                    if (page > 1) nav += '<b class="'+o.class_name+'_prev">'+prev+'&nbsp;</b>';
                    else nav += '<span>'+prev+'&nbsp;</span>';
                    if (page*per_page < data.totalHits) nav += '<b class="'+o.class_name+'_next">&nbsp; '+next+'</b>';
                    else nav += '<span>&nbsp; '+next+'</span>';
                }
                nav += '</div>';
            }

            if (navpos == 'top') html = nav;
            // flexImages markup
            for (var i=0,hits=data.hits;i<hits.length;i++) {
                var w = hits[i].previewWidth, h = hits[i].previewHeight, src = hits[i].previewURL;
                if (rh > h-10) w = w*(180/(h+1)), h = 180, src = src.replace('_150', '__180');
                html += '<div class="item" data-w="'+w+'" data-h="'+h+'"><a title="'+escapeHTML(toTitleCase(hits[i].tags))+'" href="'+hits[i].pageURL+'" target="'+target+'"><img src="https://pixabay.com/static/img/blank.gif" data-src="'+src+'"></a></div>';
            }
            if (navpos == 'bottom') html += nav;

            n.innerHTML = html;
        }
        if (n.className.indexOf('flex_grid')<0) n.className += ' flex_grid';
        new flexImages({selector: n, rowHeight: rh, maxRows: mr, truncate: tr});
    }

    function closest(el, selector) { // IE9+
        var match = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
        while (el) { if (match.bind(el)(selector)) return el; else el = el.parentElement; }
    }

    if (document.addEventListener)
        document.addEventListener('click', function(e){
            var next = 0;
            if (e.target.className==o.class_name+'_prev') next = -1;
            else if (e.target.className==o.class_name+'_next') next = 1;
            if (next) {
                var n = closest(e.target, '.'+o.class_name), p = (parseInt(n.getAttribute('data-page')) || 1)+next;
                if (p) { n.setAttribute('data-page', p); init(); }
                e.preventDefault();
            }
        });
    else
        o.prev = '', o.next = '';

    function attrs_to_str(n){
        var s = '';
        for (var i=0,attrs=n.attributes;i<attrs.length;i++)
            if (attrs[i].name != 'data-attrstr' && attrs[i].name != 'data-prefilled') s += attrs[i].name+attrs[i].value;
        return s;
    }

    function init(){
        for (var i=0,widgets=document.querySelectorAll('.'+o.class_name);i<widgets.length;i++) {
            var n = widgets[i];
            // skip rendered widgets if not changed
            if (attrs_to_str(n) != n.getAttribute('data-attrstr')) {
                n.setAttribute('data-attrstr', attrs_to_str(n));
                var page = (parseInt(n.getAttribute('data-page'))||1),
                    per_page = (parseInt(n.getAttribute('data-per-page'))||o.per_page),
                    q = n.getAttribute('data-search')||'',
                    user = n.getAttribute('data-user')||'';
                per_page = per_page > 100 ? 100 : per_page;
                if (user) q = 'user:'+user+' '+q;
                var url = 'https://pixabay.com/api/?key='+o.key+'&lang='+(n.getAttribute('data-lang')||o.lang)+'&order='+(n.getAttribute('data-order')||o.order)+'&image_type='+(n.getAttribute('data-image-type')||o.image_type)+'&safesearch='+(n.getAttribute('data-safesearch')||o.safesearch)+'&editors_choice='+(n.getAttribute('data-editors-choice')||o.editors_choice)+'&per_page='+per_page+'&page='+page+'&q='+encodeURIComponent(q);
                if (n.getAttribute('data-prefilled')) { n.removeAttribute('data-prefilled'); APIResponse(false, n, page, per_page, url); }
                else if (url in cache) APIResponse(cache[url], n, page, per_page, url);
                else { var script = document.createElement('script'); script.src = url+'&callback='+callback_name(APIResponse, n, page, per_page, url); document.body.appendChild(script); }
            }
        }
    }

    // public method: new initPixabayWidget();
    this.initPixabayWidget = init;

    if (!/bot|crawl|spider/i.test(navigator.userAgent)) {
        if (document.readyState!='loading') init();
        else if (document.addEventListener) document.addEventListener('DOMContentLoaded', init);
        else document.attachEvent('onreadystatechange', function(){ if (document.readyState=='complete') init(); });
    }
}());
