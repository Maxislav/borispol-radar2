"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defaultSetting(req, res) {
    res.send({
        'title1': "Borispol",
        'title2': "Infrared",
        'title3': "Visible",
        'url1': "https://meteoinfo.by/radar/UKBB/UKBB_latest.png",
        'url2': "http://www.sat24.com/image2.ashx?region=eu&ir=true",
        'url3': "http://www.sat24.com/image2.ashx?region=eu"
    });
}
exports.defaultSetting = defaultSetting;
/*
<?php
/!**
 * Created by PhpStorm.
 * User: mars
 * Date: 31.07.15
 * Time: 14:48
 *!/
$setting = array(
    'title1' => "Borispol",
    'title2' => "Infrared",
    'title3' => "Visible",
    'url1' => "http://meteoinfo.by/radar/UKBB/UKBB_latest.png",
    'url2' => "http://www.sat24.com/image2.ashx?region=eu&ir=true",
    'url3' => "http://www.sat24.com/image2.ashx?region=eu"
);

echo json_encode($setting);*/
//# sourceMappingURL=settingborispolradar.js.map