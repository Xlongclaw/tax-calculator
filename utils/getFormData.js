const getFormData = (selector) =>{
    $(selector).serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});
}

export default "Hello"