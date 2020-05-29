import api from './api';
const app = {
    init: () => {
        
        const $qs = (selector) => {
            return document.querySelector(selector);
        };
        const $id = (selector) => {
            return document.getElementById(selector);
        };

        let $form = $qs('form.contactform');
        let $form_msg_wait = $qs('.page-right .infobox.wait');
        let $form_msg_ready = $qs('.page-right .infobox.ready');

        let $input_name = $id('inputName');
        let $input_email = $id('inputEmail');
        let $input_message = $id('inputMessage');

        let btn_contact = $id('btn-contact');

        let btn_right = $qs('.call-to-action.contact');
        let btn_right_icon = btn_right.querySelector('i');

        let btn_left = $qs('.call-to-action.about');
        let btn_left_icon = btn_left.querySelector('i');

        let layout = $id('splitlayout');
        let page_left = $qs('.page-left');
        let page_right = $qs('.page-right');

        function triggerRight() {

            if($form.classList.contains('hidden')) {
                $form.classList.remove('hidden');
                $form_msg_ready.classList.add('hidden');
                $form_msg_wait.classList.add('hidden');
            }

            if(layout.classList.contains('reset-layout')) {
                layout.classList.remove('reset-layout');
                layout.classList.add('open-right');
                btn_right_icon.setAttribute('class', 'i-times fa-2x');
            }
            else {
                layout.classList.add('reset-layout');
                layout.classList.remove('open-right');
                btn_right_icon.setAttribute('class', 'i-envelope fa-2x');
            }
        }

        function triggerLeft() {
            if(layout.classList.contains('reset-layout')) {
                layout.classList.remove('reset-layout');
                layout.classList.add('open-left');
                btn_left_icon.setAttribute('class', 'i-times fa-2x');
            }
            else {
                layout.classList.remove('open-left');
                layout.classList.add('reset-layout');
                btn_left_icon.setAttribute('class', 'i-info fa-2x');
            }
        }

        btn_right.addEventListener('click', function(event) {
            event.preventDefault();

            triggerRight();
        });

        btn_left.addEventListener('click', function(event) {
            event.preventDefault();

            triggerLeft();
        });

        btn_contact.addEventListener('click', function(event) {
            event.preventDefault();

            if(screen.width <= 766) {
                page_right.scrollIntoView(true);
            }
            else {
                triggerRight();
            }

        });

        /*
         * contact form
         */

        $form.addEventListener('submit', function(ev) {
            ev.preventDefault();

            $form.classList.add('hidden');
            $form_msg_wait.classList.remove('hidden');

            let data = {
                name: $input_name.value,
                email: $input_email.value,
                message: $input_message.value
            };

            api.post('contact.php', data,{

                success: () => {

                    $form_msg_wait.classList.add('hidden');
                    $form_msg_ready.classList.remove('hidden');
                    $form.reset();

                },
                error: () => {
                    alert('Das Formular konnte nicht gesendet werden');
                }

            });

        });

    }
};

export default app;