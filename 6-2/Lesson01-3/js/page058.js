$(function(){
    "use strict";
    var $dragItem = $('.compass');

    $dragItem.draggable({
        containment: 'parent',
    });
})
