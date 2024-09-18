const URL = "http://ajax1.lmsoft.cz/procedure.php"

async function getCall(url){
    try {
        const response = await fetch(URL + url,  {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Access-Control-Allow-Origin' : '*',
                'Authorization': "Basic " + btoa('caffe:kafe')
            }
        });
        if (!response.ok) {
            // Handle non-OK responses (e.g., 404, 500, etc.)
            return { success: false, message: 'Error: ${response.status}', status: response.status };
        }
        const data = await response.json();

        // Process the data as needed
        return { success: true, data };
    } catch (error) {
    // Handle any other errors (e.g., network issues)
        return { success: false, message: 'Error: ${error.message}', status:0 };
    }

}

async function postCall(url, body){
    try {
        const response = await fetch(URL + url,  {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                'Access-Control-Allow-Origin' : '*',
                'Authorization': "Basic " + btoa('caffe:kafe')
            }
            ,body: body
        });
        if (!response.ok) {
            // Handle non-OK responses (e.g., 404, 500, etc.)
            return { success: false, message: 'Error: ${response.status}', status: response.status };
        }
        const data = await response.json();
        if(data.msg === -1){
            return { success: false, message: 'Error: data wrong format', status: response.status };    
        }
        // Process the data as needed
        return { success: true };
    } catch (error) {
    // Handle any other errors (e.g., network issues)
        return { success: false, message: 'Error: ${error.message}', status:0 };
    }

}

function serialize(form) {
    var field, s = [];
    if (typeof form == 'object' && form.nodeName === "FORM") {
        var len = form.elements.length;
        for (var i=0; i<len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    for (var j=form.elements[i].options.length-1; j>=0; j--) {
                        if(field.options[j].selected)
                            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                }
            }
        }
    }
    return s.join('&').replace(/%20/g, '+');
}

function validate(str){
    return str.includes("user");
}

export {
    getCall, postCall,serialize, validate,
  };