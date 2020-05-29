<?php
use Snipworks\Smtp\Email;

class Mailer {
    private $mail;
    public function __construct() {
        $this->mail = new Email(Config::$smtp_host, Config::$smtp_port);
        $this->mail->setProtocol(Email::SSL);
        $this->mail->setLogin(Config::$smtp_login, Config::$smtp_password);
    }

    public function mailMe($message, $from_email = 'noreply@geldfrei.net', $from_name = null, $subject = 'Website Kontakt') {
        $this->mail->addTo(Config::$smtp_email, Config::$smtp_name);
        $this->mail->setFrom($from_email, $from_name);
        $this->mail->setSubject($subject);
        $message = nl2br($message);
        $message = strip_tags($message);
        $this->mail->setHtmlMessage($message);

        if($this->mail->send()){
            return true;
        } 
        return false;
    }
}
