<?php
class Bot extends \TelegramBot\Api\BotApi {

    public function __construct() {
        parent::__construct(Config::$bot_token);
    }

    public function sendMe($message) {
        $this->sendMessage(Config::$bot_chat_id, $message);
    }

}
