<?php
header("content-type: image/png");
echo file_get_contents("http://meteoinfo.by/radar/UKBB/UKBB_latest.png");
?>