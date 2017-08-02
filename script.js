/**
 * MyFrom constuctor
 * @constructor
 */
function MyForm() {
};
/**
 * Validate form data
 * @returns {{isValid: boolean, errorFields: Array}}
 */
MyForm.validate = function (data) {
    var isValid = true, errorFields = [],
        form = document.querySelector('#myForm');

    for (var key in data) {
        var formItem = form.querySelector('input[type=text][name=' + key + ']');
        if (!data.hasOwnProperty(key) || formItem === null) {
            continue;
        }
        var value = data[key];
        switch (key) {
            case "phone":
                var pattern = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
                var val = value.split(''), sum = 0;
                val.map(function (i) {
                    i = parseInt(i, 10);
                    if (i > 0) {
                        sum += i;
                    }
                });
                if (pattern.test(value) && sum < 30) {
                    formItem.classList.remove('error');
                } else {
                    formItem.classList.add('error');
                    isValid = false;
                    errorFields.push(key);
                }
                break;
            case "email":
                var pattern = /^([A-Za-z0-9_\-\.])+\@(ya.ru|yandex.ru|yandex.by|yandex.ua|yandex.kz|yandex.com)$/;
                if (pattern.test(value)) {
                    formItem.classList.remove('error');
                } else {
                    formItem.classList.add('error');
                    isValid = false;
                    errorFields.push(key);
                }
                break;
        }
    }
    return {
        isValid: isValid,
        errorFields: errorFields
    }
};
/**
 * Get orm data
 * @returns {{}}
 */
MyForm.getData = function () {
    var data = {},
        form = document.querySelector('#myForm');
    var formData = form.querySelectorAll('input[type=text]');
    for (var i = 0; i < formData.length; i++) {
        var formItem = formData[i];
        data[formItem.name] = formItem.value;
    }
    return data;
};
/**
 * Set form data
 * @param data
 */
MyForm.setData = function (data) {
    var form = document.querySelector('#myForm');
    for (var key in data) {
        if (!data.hasOwnProperty(key)) {
            continue;
        }
        var value = data[key];
        var formItem = form.querySelector('input[type=text][name=' + key + ']');
        if (formItem === null) {
            continue;
        }
        formItem.value = value;
    }
};
/**
 * Submit form data
 */
MyForm.submit = function () {
    var form = document.querySelector('#myForm');
    var action = form.getAttribute('action');
    var resultBlock = document.querySelector('#resultContainer');
    if (!MyForm.validate(MyForm.getData()).isValid) {
        return false;
    }
    var submitBtn = form.querySelector('#submitButton');
    submitBtn.setAttribute('disabled','disabled');
    var xhr = new XMLHttpRequest(),
        DONE = 4; // readyState 4 means the request is done.
    xhr.open('POST', action);
    xhr.send(new FormData(document.forms.myForm));
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== DONE) {
            return false;
        }
        var result = JSON.parse(xhr.responseText);
        if (result.status == "success" || result.status == "error") {
            submitBtn.removeAttribute('disabled');
        }
        resultBlock.innerHTML = "Status: " + result.status;
        if (typeof result.reason !== typeof undefined) {
            resultBlock.innerHTML += "<br>Reason: " + result.reason;
        }
        if (typeof result.timeout !== typeof undefined) {
            resultBlock.innerHTML += "<br>Retry in: " + result.timeout;
            setTimeout(MyForm.submit, result.timeout);
        }
    };
};

document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector('#myForm');
    form.onsubmit = function () {
        MyForm.submit();
        return false;
    };
});