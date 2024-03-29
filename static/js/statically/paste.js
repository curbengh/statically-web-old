(function(win, doc, undef) {

    var debugBox = doc.querySelector('#debug');

    win.STATICALLY_PASTE_DATA = {
        'https?:\\/\\/cdn\\.staticall?y\\.(?:com|io)\\/\\S+': function(value) {
            debugBox.style.display = value ? 'block' : 'none';
            debugBox.children[0].innerHTML = 'Debugging&hellip;';
            value && fetch('https://apis.marsble.com/http2/v1/check?api_key=1fdba1ef633460c72972aaa993d61b&url=' + value).then(response => {
                if (!response.ok) {
                    console.log('Failed to fetch data from Marsble API.');
                    return;
                }
                return response.json();
            }).then(json => {
                let headers = json.raw,
                    out = '<strong>HTTP2: ' + (json.http2 ? 'Yes' : 'No') + '</strong>';
                for (const key in headers) {
                    out += '\n' + headers[key];
                }
                debugBox.children[0].innerHTML = out;
            });
            return "";
        }
    };

    let input = doc.querySelector('#input'),
        output = doc.querySelector('#output'), debounce;

    function paste(e) {
        debounce && clearTimeout(debounce);
        debounce = setTimeout(() => {
            let tasks = win.STATICALLY_PASTE_DATA, r;
            for (let i in tasks) {
                if (this.value.match(r = new RegExp('^' + i + '$'))) {
                    setValue(this.value.replace(r, tasks[i]));
                    return;
                }
            }
            this.value && setError() || setDefault();
        }, 500);
    }

    function setError() {
        input.classList.add('error');
        input.classList.remove('success');
    }

    function setSuccess() {
        input.classList.remove('error');
        input.classList.add('success');
        output.readonly = false;
        if (typeof jQuery !== "undefined") {
            jQuery(output.parentNode).stop(true, true).fadeIn();
        } else {
            output.parentNode.style.display = 'block';
        }
        output.readonly = true;
        output.focus();
        output.select();
    }

    function setDefault() {
        input.classList.remove('error');
        input.classList.remove('success');
        if (typeof jQuery !== "undefined") {
            jQuery(output.parentNode).stop(true, true).fadeOut();
        } else {
            output.parentNode.style.display = 'none';
        }
    }

    function setValue(v) {
        output.value = v;
        setSuccess();
    }

    win.STATICALLY_PASTE_TOOLS = {
        setError: setError,
        setSuccess: setSuccess,
        setDefault: setDefault,
        setValue: setValue
    };

    input.addEventListener("blur", paste, false);
    input.addEventListener("cut", paste, false);
    // input.addEventListener("keyup", paste, false);
    input.addEventListener("paste", paste, false);

    output.addEventListener("focus", () => {
        output.focus();
        output.select();
    }, false);

})(window, document);