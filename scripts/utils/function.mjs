//fonction de validation du mail
export function emailValidation(unMail) {
    const regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (unMail && regEx) {
        if (!regEx.test(unMail)) {
            return false;
        } else {
            return true;
        }
    }
    else {
        return false;
    }
}