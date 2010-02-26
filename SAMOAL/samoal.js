var answers = {};


$(document).ready(function(){
    if(!console){
        console = {};
        console.log = function(msg){
            alert(msg);
        };
    }
    $.getJSON('./questions.json', function(data) {
        $.each(data, function(question_number, value) { 
            var qdiv = $('<div/>', {
                'class': 'question'
            });
            qdiv.append($('<h4/>', {
                text: question_number
            }));
            qdiv.appendTo($('body'));
            $.each(value, function(variant, question){
                var adiv = $('<div/>', {
                    text: question,
                    'class': 'answer'
                });
                adiv.appendTo(qdiv);
                adiv.click(function() {
                    qdiv.hide();
                    //remove checked status from the previously checked item
                    qdiv.children('div.answer').removeClass('checked');
                    adiv.addClass('checked');
                    answers[question_number] = variant;
                    if(qdiv.children('.forward').length==0){
                        var forward = $('<div/>', {
                            text: ' >>>',
                            'class': 'forward'
                        });
                        forward.appendTo(qdiv);
                        forward.click(function() {
                            qdiv.hide();
                            qdiv.next().show();
                        });
                    }
                    qdiv.next().show();
                });
            });
            if(qdiv.prev().length != 0){
                var back = $('<div/>', {
                    text: '<<< ',
                    'class': 'back'
                });
                back.appendTo(qdiv);
                back.click(function() {
                    qdiv.hide();
                    qdiv.prev().show();
                });
            }
        });
        $('.question:first').show();
        $('.answer').hover(
            function(){
                $(this).addClass('hover');
            },
            function(){
                $(this).removeClass('hover');
            }
        );
    });
});
