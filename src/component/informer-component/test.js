!function(e) {
    function o(e, o) {
        for (var r = [], t = new RegExp("(^| )" + o + "( |$)"), n = e.getElementsByTagName("*"), l = 0, i = n.length; l < i; l++)
            !/^#/.test(o) && t.test(n[l].className) ? r.push(n[l]) : /^#/.test(o) && t.test("#" + n[l].id) && r.push(n[l]);
        return r
    }
    function t(e, t) {
        return n(e) && f.test(t) ? e.getElementById(RegExp.$1) ? [e.getElementById(RegExp.$1)] : [] : 1 !== e.nodeType && 9 !== e.nodeType ? [] : (!m.test(t) || /MSIE\s8\.\d+/gi.test(navigator.userAgent) || /MSIE\s7\.\d+/gi.test(navigator.userAgent) ? g.test(t) ? r = e.getElementsByTagName(t) : /MSIE\s7\.\d+/gi.test(navigator.userAgent) ? r = o(e, t.replace(/^\./, "")) : r = e.querySelectorAll(t) : r = e.getElementsByClassName(RegExp.$1),
            r)
    }
    function n(e) {
        return null != e && e.nodeType == e.DOCUMENT_NODE
    }
    function l(o, r, n) {
        var l = document.getElementById(e.cont);
        if (void 0 !== t(l, o)[0])
            for (var i = 0, a = t(l, o).length; i < a; i++)
                void 0 !== t(l, o)[i] && (t(l, o)[i].style[r] = n)
    }
    function i(e, o, r) {
        e.addEventListener ? e.addEventListener(o, function(e) {
            "function" == typeof r && r(e)
        }, !1) : e.attachEvent("on" + o, function(e) {
            "function" == typeof r && r(e)
        })
    }
    function a(e) {
        var o = document
            , r = window
            , n = o.getElementById(e.cont)
            , a = t(n, ".gsLinks")[0]
            , d = t(n, ".gsIContent")[0]
            , c = "";
        if (e.w && (n.style.width = e.w + "px"),
        e.h && (n.style.height = e.h + "px"),
            e.d) {
            var u = o.createElement("div")
                , m = "#fff";
            if (void 0 !== e.d.city_id && a) {
                n.style.fontFamily = e.d.fontFace,
                    n.style.height = "auto",
                    d.innerHTML = e.d.informer,
                    e.d.borderRadio ? (n.style.border = "1px solid #" + e.d.borderColor,
                        n.style.width = e.w - 2 + "px") : n.style.border = "0px";
                var f = e.d.informerOneBGColor
                    , g = e.d.informerTwoBGColor;
                if (void 0 !== e.d.informerTransparentBGOne && "1" === e.d.informerTransparentBGOne && (f = "transparent"),
                void 0 !== e.d.informerTransparentBGTwo && "1" === e.d.informerTransparentBGTwo && (g = "transparent"),
                    e.d.current) {
                    var T = t(n, "#gs-moduleCurrentBlock")[0];
                    T.innerHTML = e.d.current,
                        l(".secondaryWrap", "backgroundColor", f),
                        l(".secondaryWrap", "color", e.d.informerOneTextColor),
                        l(".head", "backgroundColor", g),
                        l(".head", "color", e.d.informerTwoTextColor),
                        l(".gsAddInfo2", "backgroundColor", g),
                        l(".gsAddInfo2", "color", e.d.informerTwoTextColor),
                        c = t(n, "#gs-moduleCurrentBlock")[0],
                        i(c, "click", s)
                }
                if (e.d.forecast) {
                    var y = t(n, "#gs-moduleForecastBlock")[0];
                    y.innerHTML = e.d.forecast.tpl.table,
                        l(".gsCityF", "backgroundColor", g),
                        l(".gsCityF", "color", e.d.informerTwoTextColor),
                        l("#colsDays", "backgroundColor", f),
                        l("#colsDays", "color", e.d.informerOneTextColor),
                        l("#colsData", "backgroundColor", f),
                        l("#colsData", "color", e.d.informerOneTextColor),
                        c = t(n, "#gs-moduleForecastBlock")[0],
                        i(c, "click", s)
                }
                if (e.d.tourism) {
                    var C = t(n, "#gs-moduleTourismBlock")[0];
                    C.innerHTML = e.d.tourism,
                        l(".tr-1", "backgroundColor", f),
                        l(".tr-1", "color", e.d.informerOneTextColor),
                        l(".tr-2", "backgroundColor", g),
                        l(".tr-2", "color", e.d.informerTwoTextColor),
                        l(".link-a-1", "color", e.d.informerOneTextColor),
                        l(".link-a-2", "color", e.d.informerTwoTextColor),
                    void 0 !== e.d.informerTourismTextColor && l("#tHead", "color", e.d.informerTourismTextColor);
                    for (var v = 0, p = t(n, ".link-a-1").length; v < p; v++)
                        void 0 !== t(n, ".link-a-1")[v] && (c = t(n, ".link-a-1")[v],
                            i(c, "mouseenter", function(o) {
                                o.srcElement.style.color = e.d.moduleTourism.moduleTourismTextHoverColorOne
                            }),
                            c = t(n, ".link-a-1")[v],
                            i(c, "mouseleave", function(o) {
                                o.srcElement.style.color = e.d.informerOneTextColor
                            }),
                            c = t(n, ".link-a-1")[v],
                            i(c, "click", s)),
                        void 0 !== t(n, ".link-a-2")[v] && (c = t(n, ".link-a-2")[v],
                            i(c, "mouseenter", function(o) {
                                o.srcElement.style.color = e.d.moduleTourism.moduleTourismTextHoverColorTwo
                            }),
                            c = t(n, ".link-a-2")[v],
                            i(c, "mouseleave", function(o) {
                                o.srcElement.style.color = e.d.informerTwoTextColor
                            }),
                            c = t(n, ".link-a-2")[v],
                            i(c, "click", s))
                }
                "transparent" === f && "transparent" === g && (l("#tHead", "backgroundColor", "transparent"),
                    m = "transparent")
            } else
                n.style.textAlign = "center",
                    i(d, "click", function(e) {
                        s(e),
                            r.open("", "_blank").location.href = "https://www.gismeteo.ua/"
                    }),
                    u.innerHTML = e.d.html,
                    d.insertBefore(u.firstChild, a);
            l(".gsLinks", "backgroundColor", m);
            var k = t(n, ".leftCol > a > span")[0];
            if (void 0 !== k) {
                var h = k.innerText || null;
                null !== h && (k.innerHTML = '<b class="gis-blue">' + h.substr(0, 3) + "</b><b>" + h.substr(3, h.length) + "</b>")
            }
        }
    }
    function d(e) {
        function o() {
            r || (delete T[t],
                document.body.removeChild(n))
        }
        var r = !1
            , t = "f" + String(Math.random()).slice(2);
        e += ~e.indexOf("?") ? "&" : "?",
            e += "callback=_registry" + t,
            T[t] = function(e) {
                r = !0,
                    delete T[t],
                    document.body.removeChild(n)
            }
        ;
        var n = document.createElement("script");
        n.onreadystatechange = function() {
            "complete" != this.readyState && "loaded" != this.readyState || (this.onreadystatechange = null,
                setTimeout(o, 0))
        }
            ,
            n.onload = n.onerror = o,
            n.src = e,
            document.body.appendChild(n)
    }
    function s(o) {
        d("https://www.gismeteo.ua/ajax/constructor/informer-setClick/?hash=" + e.hash)
    }
    var c = []
        , u = (c.slice,
        /complete|loaded|interactive/)
        , m = /^\.([\w-]+)$/
        , f = /^#([\w-]*)$/
        , g = /^[\w-]+$/;
    u.test(document.readyState) ? a(e) : document.addEventListener("DOMContentLoaded", function() {
        a(e)
    }, !1);
    var T = {}
}({
    "hash": "Qmw1fy8cwa3o0A",
    "cont": "gsInformerID-Qmw1fy8cwa3o0A",
    "w": "240",
    "h": "227",
    "d": {
        "informer": "<a alt=\"\u041f\u043e\u0433\u043e\u0434\u0430 \u0432 \u041a\u0438\u0435\u0432\u0435\" title=\"\u041f\u043e\u0433\u043e\u0434\u0430 \u0432 \u041a\u0438\u0435\u0432\u0435\" target=\"_blank\" href=\"https:\/\/www.gismeteo.ua\/weather-kyiv-4944\/\" class=\"nolink\"><div id=\"gs-moduleCurrentBlock\"><\/div><div id=\"gs-moduleForecastBlock\"><\/div><\/a><div class=\"gsLinks\"><table><tr><td><div class=\"leftCol\"><a href=\"https:\/\/www.gismeteo.ua\/\" target=\"_blank\" title=\"\u041f\u043e\u0433\u043e\u0434\u0430 \u0432 \u041a\u0438\u0435\u0432\u0435\"><img alt=\"\u041f\u043e\u0433\u043e\u0434\u0430 \u0432 \u041a\u0438\u0435\u0432\u0435\" src=\"https:\/\/www.gismeteo.ua\/assets\/flat-ui\/img\/logo-mini2.png\" align=\"middle\" border=\"0\" width=\"11\" height=\"16\"\/><img src=\"https:\/\/www.gismeteo.ua\/assets\/flat-ui\/img\/informer\/gismeteo.svg\" border=\"0\" align=\"middle\" style=\"left: 5px; top:1px\"><\/a><\/div><div class=\"rightCol\"><a href=\"https:\/\/www.gismeteo.ua\/weather-kyiv-4944\/2-weeks\/\" target=\"_blank\" title=\"\u041f\u043e\u0433\u043e\u0434\u0430 \u0432 \u041a\u0438\u0435\u0432\u0435 \u043d\u0430 2 \u043d\u0435\u0434\u0435\u043b\u0438\"><img src=\"https:\/\/www.gismeteo.ua\/assets\/flat-ui\/img\/informer\/forecast-2weeks.ru.svg\" border=\"0\" align=\"middle\" style=\"top:auto\" alt=\"\u041f\u043e\u0433\u043e\u0434\u0430 \u0432 \u041a\u0438\u0435\u0432\u0435 \u043d\u0430 2 \u043d\u0435\u0434\u0435\u043b\u0438\"><\/a><\/div><\/td><\/tr><\/table><\/div>",
        "current": "<div class=\"gsInfoWrapper\"><div class=\"main_wrap\" id=\"main_wrap\"><div class=\"secondaryWrap\"><table><tr><td align=\"left\" style=\"text-align:left\" width=\"33%\" nowrap><div class=\"gsCity\"><span>\u041a\u0438\u0435\u0432<\/span><\/div><\/td><td align=\"center\" style=\"text-align:center\" width=\"34%\"><div class=\"gsWeatherIcon \"><img src=\"https:\/\/www.gismeteo.ua\/assets\/flat-ui\/img\/icons\/weather\/clip_art\/d0.png\" alt=\"\u042f\u0441\u043d\u043e\" title=\"\u042f\u0441\u043d\u043e\" height=\"55px\" \/><\/div><\/td><td align=\"right\" style=\"text-align:right\" width=\"33%\" nowrap><div class=\"gsTemp\"><nobr><span class=\"paddingRight\">+14<span class=\"tsp\">&nbsp;<\/span>&deg;C<\/span><\/nobr><\/div><\/td><\/tr><\/table><\/div><\/div><\/div><div class=\"gsAddInfo2 padding\"><div class=\"gsAddInfo\">\u042f\u0441\u043d\u043e<\/div><div class=\"gsAddInfo3\"><span id=\"windAddInfo\">6<i class=\"tsp\">&nbsp;<\/i>\u043c\/\u0441,&nbsp;\u044e\u0437<\/span> <span id=\"pressAddInfo\">749&nbsp;\u043c\u043c \u0440\u0442.\u00a0\u0441\u0442.<\/span> <span id=\"humidityAddInfo\">41<i class=\"tsp\">&nbsp;<\/i>%&nbsp;\u0432\u043b\u0430\u0436\u043d.<\/span><\/div><\/div>",
        "forecast": {
            "columnstd": "<td class=\"col h24\" align=\"center\"><div class=\"dtime\"><span class=\"time\">\u0412\u0435\u0447\u0435\u0440<\/span><\/div><span class=\"s_icon sunny \"><img src=\"https:\/\/www.gismeteo.ua\/assets\/flat-ui\/img\/icons\/weather\/clip_art\/small\/d0.png\" width=\"34px\" alt=\"\u042f\u0441\u043d\u043e\" title=\"\u042f\u0441\u043d\u043e\" \/><\/span><span class=\"temperature\" id=\"colTemp\">+8<\/span><div class=\"centralized\"><div><span class=\"wind\">3<i class=\"tsp\">&nbsp;<\/i>\u043c\/\u0441<\/span><\/div><div><span class=\"pressure\">751<\/span><\/div><div><span class=\"wet\">67<i class=\"tsp\">&nbsp;<\/i>%<\/span><\/div><\/div><\/td><td class=\"col h24\" align=\"center\"><div class=\"dtime\"><span class=\"time\">\u041d\u043e\u0447\u044c<\/span><\/div><span class=\"s_icon sunny \"><img src=\"https:\/\/www.gismeteo.ua\/assets\/flat-ui\/img\/icons\/weather\/clip_art\/small\/n0.png\" width=\"34px\" alt=\"\u042f\u0441\u043d\u043e\" title=\"\u042f\u0441\u043d\u043e\" \/><\/span><span class=\"temperature\" id=\"colTemp\">+4<\/span><div class=\"centralized\"><div><span class=\"wind\">3<i class=\"tsp\">&nbsp;<\/i>\u043c\/\u0441<\/span><\/div><div><span class=\"pressure\">750<\/span><\/div><div><span class=\"wet\">81<i class=\"tsp\">&nbsp;<\/i>%<\/span><\/div><\/div><\/td><td class=\"col h24\" align=\"center\"><div class=\"dtime\"><span class=\"time\">\u0423\u0442\u0440\u043e<\/span><\/div><span class=\"s_icon sunny \"><img src=\"https:\/\/www.gismeteo.ua\/assets\/flat-ui\/img\/icons\/weather\/clip_art\/small\/d3.png\" width=\"34px\" alt=\"\u041f\u0430\u0441\u043c\u0443\u0440\u043d\u043e\" title=\"\u041f\u0430\u0441\u043c\u0443\u0440\u043d\u043e\" \/><\/span><span class=\"temperature\" id=\"colTemp\">+6<\/span><div class=\"centralized\"><div><span class=\"wind\">4<i class=\"tsp\">&nbsp;<\/i>\u043c\/\u0441<\/span><\/div><div><span class=\"pressure\">749<\/span><\/div><div><span class=\"wet\">83<i class=\"tsp\">&nbsp;<\/i>%<\/span><\/div><\/div><\/td><td class=\"col h24\" align=\"center\"><div class=\"dtime\"><span class=\"time\">\u0414\u0435\u043d\u044c<\/span><\/div><span class=\"s_icon sunny \"><img src=\"https:\/\/www.gismeteo.ua\/assets\/flat-ui\/img\/icons\/weather\/clip_art\/small\/d11.png\" width=\"34px\" alt=\"\u041e\u0431\u043b\u0430\u0447\u043d\u043e, \u043d\u0435\u0431\u043e\u043b\u044c\u0448\u043e\u0439 \u0434\u043e\u0436\u0434\u044c\" title=\"\u041e\u0431\u043b\u0430\u0447\u043d\u043e, \u043d\u0435\u0431\u043e\u043b\u044c\u0448\u043e\u0439 \u0434\u043e\u0436\u0434\u044c\" \/><\/span><span class=\"temperature\" id=\"colTemp\">+13<\/span><div class=\"centralized\"><div><span class=\"wind\">4<i class=\"tsp\">&nbsp;<\/i>\u043c\/\u0441<\/span><\/div><div><span class=\"pressure\">748<\/span><\/div><div><span class=\"wet\">72<i class=\"tsp\">&nbsp;<\/i>%<\/span><\/div><\/div><\/td>",
            "tpl": {
                "table": "<div class=\"cols_1\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td id=\"colsDays\" colspan=\"4\"><div class=\"cols_1 cols\"><div class=\"col_h today\" style=\"width:24.9%\">\u041f\u0442, 15<\/div><div class=\"col_h tomorrow\" style=\"width:74.7%\">\u0421\u0431, 16 \u043e\u043a\u0442\u044f\u0431\u0440\u044f<\/div><\/div><\/td><\/tr><tr id=\"colsData\"><td class=\"col h24\" align=\"center\"><div class=\"dtime\"><span class=\"time\">\u0412\u0435\u0447\u0435\u0440<\/span><\/div><span class=\"s_icon sunny \"><img src=\"https:\/\/www.gismeteo.ua\/assets\/flat-ui\/img\/icons\/weather\/clip_art\/small\/d0.png\" width=\"34px\" alt=\"\u042f\u0441\u043d\u043e\" title=\"\u042f\u0441\u043d\u043e\" \/><\/span><span class=\"temperature\" id=\"colTemp\">+8<\/span><div class=\"centralized\"><div><span class=\"wind\">3<i class=\"tsp\">&nbsp;<\/i>\u043c\/\u0441<\/span><\/div><div><span class=\"pressure\">751<\/span><\/div><div><span class=\"wet\">67<i class=\"tsp\">&nbsp;<\/i>%<\/span><\/div><\/div><\/td><td class=\"col h24\" align=\"center\"><div class=\"dtime\"><span class=\"time\">\u041d\u043e\u0447\u044c<\/span><\/div><span class=\"s_icon sunny \"><img src=\"https:\/\/www.gismeteo.ua\/assets\/flat-ui\/img\/icons\/weather\/clip_art\/small\/n0.png\" width=\"34px\" alt=\"\u042f\u0441\u043d\u043e\" title=\"\u042f\u0441\u043d\u043e\" \/><\/span><span class=\"temperature\" id=\"colTemp\">+4<\/span><div class=\"centralized\"><div><span class=\"wind\">3<i class=\"tsp\">&nbsp;<\/i>\u043c\/\u0441<\/span><\/div><div><span class=\"pressure\">750<\/span><\/div><div><span class=\"wet\">81<i class=\"tsp\">&nbsp;<\/i>%<\/span><\/div><\/div><\/td><td class=\"col h24\" align=\"center\"><div class=\"dtime\"><span class=\"time\">\u0423\u0442\u0440\u043e<\/span><\/div><span class=\"s_icon sunny \"><img src=\"https:\/\/www.gismeteo.ua\/assets\/flat-ui\/img\/icons\/weather\/clip_art\/small\/d3.png\" width=\"34px\" alt=\"\u041f\u0430\u0441\u043c\u0443\u0440\u043d\u043e\" title=\"\u041f\u0430\u0441\u043c\u0443\u0440\u043d\u043e\" \/><\/span><span class=\"temperature\" id=\"colTemp\">+6<\/span><div class=\"centralized\"><div><span class=\"wind\">4<i class=\"tsp\">&nbsp;<\/i>\u043c\/\u0441<\/span><\/div><div><span class=\"pressure\">749<\/span><\/div><div><span class=\"wet\">83<i class=\"tsp\">&nbsp;<\/i>%<\/span><\/div><\/div><\/td><td class=\"col h24\" align=\"center\"><div class=\"dtime\"><span class=\"time\">\u0414\u0435\u043d\u044c<\/span><\/div><span class=\"s_icon sunny \"><img src=\"https:\/\/www.gismeteo.ua\/assets\/flat-ui\/img\/icons\/weather\/clip_art\/small\/d11.png\" width=\"34px\" alt=\"\u041e\u0431\u043b\u0430\u0447\u043d\u043e, \u043d\u0435\u0431\u043e\u043b\u044c\u0448\u043e\u0439 \u0434\u043e\u0436\u0434\u044c\" title=\"\u041e\u0431\u043b\u0430\u0447\u043d\u043e, \u043d\u0435\u0431\u043e\u043b\u044c\u0448\u043e\u0439 \u0434\u043e\u0436\u0434\u044c\" \/><\/span><span class=\"temperature\" id=\"colTemp\">+13<\/span><div class=\"centralized\"><div><span class=\"wind\">4<i class=\"tsp\">&nbsp;<\/i>\u043c\/\u0441<\/span><\/div><div><span class=\"pressure\">748<\/span><\/div><div><span class=\"wet\">72<i class=\"tsp\">&nbsp;<\/i>%<\/span><\/div><\/div><\/td><\/tr><\/table><\/div>"
            }
        },
        "tourism": "",
        "tpl": "standart",
        "city_id": "4944",
        "borderRadio": "1",
        "borderColor": "d2e8ff",
        "informerTransparentBGOne": null,
        "informerTransparentBGTwo": null,
        "informerTourismTextColor": "#7a7a7a",
        "informerOneBGColor": "#d2e8ff",
        "informerOneTextColor": "#000000",
        "informerTwoBGColor": "#ffffff",
        "informerTwoTextColor": "#000000",
        "fontFace": "Arial",
        "width": "240",
        "height": "227",
        "heightGraph": "",
        "widthRadio": "undefined",
        "moduleTourism": {
            "moduleTourismTextHoverColorOne": "#ff0000",
            "moduleTourismTextHoverColorTwo": "#ff0000"
        },
        "tplModule": "single",
        "lang_ver": "ru",
        "dom_ver": "ua",
        "domain": "www.gismeteo.ua"
    }
});
