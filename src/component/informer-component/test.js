function Informer_Qmw1fy8cwa3o0A(n, e, r, i, t) {
    function b(n, e) {
        for (var r = 0, i = n.firstChild; i;) {
            if (1 == i.nodeType) {
                if (r == e) return i;
                r++
            }
            i = i.nextSibling
        }
    }

    var l = document.getElementById(e), f = b(l, 0), s = b(f, 0), u = (s.clientHeight, s.innerHTML);
    t && (s.innerHTML = u + t.html);
    var H = b(b(b(b(b(b(b(b(f, 1), 0), 0), 0), 0), 0), 0), 1);
    H.innerHTML = "<b class='blue'>" + H.innerHTML.substr(0, 3) + "</b><b>" + H.innerHTML.substr(3, H.innerHTML.length) + "</b>"
}

new Informer_Qmw1fy8cwa3o0A("Qmw1fy8cwa3o0A", "gsInformerID-Qmw1fy8cwa3o0A", "240", "227", {
    "html": "<div class='error'><span style='font-size:11px;'>\u0412\u0430\u0448 \u0438\u043d\u0444\u043e\u0440\u043c\u0435\u0440 \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c<br \/> \u043d\u0430 \u0434\u0440\u0443\u0433\u043e\u043c \u0434\u043e\u043c\u0435\u043d\u0435.<\/span><\/div>",
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
    "moduleTourism": {"moduleTourismTextHoverColorOne": "#ff0000", "moduleTourismTextHoverColorTwo": "#ff0000"},
    "tplModule": "single",
    "tpl": "standart",
    "lang_ver": "ru",
    "dom_ver": "ua",
    "domain": "www.gismeteo.ua"
});
