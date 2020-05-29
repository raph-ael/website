<?php
use \Phalcon\Mvc\Micro;
require_once('../../vendor/autoload.php');
require_once('../../api/config.php');

$app = new Micro();

$prefix = '/api/v1';

$app->get($prefix . '/test', function () {

    echo "<h1>Hallo Welt</h1>";

});

$app->handle(
    $_SERVER["REQUEST_URI"]
);
