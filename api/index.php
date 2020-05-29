<?php
use \Phalcon\Mvc\Micro;
error_reporting(E_ALL);
ini_set('error_reporting', 1);
require_once('../../vendor/autoload.php');
require_once('../../api/config.php');
require_once('../../api/bot.php');
require_once('../../api/mailer.php');

$app = new Micro();

$prefix = '/api/v1';

$app->get($prefix . '/test', function () {

    $bot = new Bot();
    $bot->sendMe('Test');

});

$app->post($prefix . '/contact', function() {
    $json = file_get_contents('php://input');
    //echo $json . "\n"; die();
    $data = json_decode($json, true);
    //echo $json . "\n";
    //print_r($data);

    $message = 'Nachricht von der Webseite' . "\n" . 'Name: ' . $data['name'] . "\n" . 'E-Mail: ' . $data['email'] . "\n\n" . 'Nachricht: ' . "\n" .  $data['message'];

    $bot = new Bot();
    $bot->sendMe($message);

    $mailer = new Mailer();
    $mailer->mailMe($data['message'], $data['email'], $data['name']);
});

$app->handle(
    $_SERVER["REQUEST_URI"]
);
