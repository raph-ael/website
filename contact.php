<?php

file_put_contents('../../messages.json',file_get_contents('php://input'),FILE_APPEND);
exit();
