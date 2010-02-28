if(typeof console === "undefined"){
    console = {};
    console.log = function(msg){
    };
}

function count(obj){
    var count = 0;
    for (k in obj) if (obj.hasOwnProperty(k)) count++;
    return count;
}

var userAnswers = {};

var questions = null;

var testAnswers = null;

var fieldAnswers = null;

var notLoadedJSON = 3; //counter of the JSON parts that haven't been loaded

function render(){
    if(notLoadedJSON > 0){
        return;
    }
    $('.loading').remove();

    $('.question:first').show();

    $('<div/>', {
        'class': 'check',
        text: 'Перевірити'
    }).appendTo($('body')).hide().click(function(){
        $('.check').hide();
        var table = $('<table/>').appendTo($('body'));
        var positiveAnswersCount = 0;
        var fieldAnswersCount = {};
        for(field in fieldAnswers){
            fieldAnswersCount[field] = 0;
        }

        for(n in userAnswers){
            var res = null;
            if(userAnswers[n] == testAnswers[n]){
                positiveAnswersCount++;
                res = 'positive';
            }
            else {
                res = 'negative';
            }
            
            var adiv = $('<div/>', {
                'class': res,
                text: questions[n][userAnswers[n]]
            }).appendTo($('body'));

            for(field in fieldAnswers){
                if(fieldAnswers[field][n]){
                    $('<div/>', {
                        'class': 'field',
                        text: field
                    }).appendTo(adiv);
                    console.log(field);
                    if(userAnswers[n]==fieldAnswers[field][n]){
                        fieldAnswersCount[field]++;
                    }
                }
            }
            console.log(res+questions[n][userAnswers[n]]);
        }
        console.log(fieldAnswersCount);
        var tr = $('<tr/>').appendTo(table);
        $('<td/>', {text: 'Общий показатель самоактуализации'}).appendTo(tr);
        $('<td/>', {text: Math.round(100*positiveAnswersCount/count(testAnswers)) + ' %'}).appendTo(tr);
        console.log("Total: " + Math.round(100*positiveAnswersCount/count(testAnswers)) + " %");
        for(field in fieldAnswers){
            var tr = $('<tr/>').appendTo(table);
            $('<td/>', {text: field}).appendTo(tr);
            $('<td/>', {text: Math.round(100*fieldAnswersCount[field]/count(fieldAnswers[field])) + ' %'}).appendTo(tr);
            console.log(field+": "+Math.round(100*fieldAnswersCount[field]/count(fieldAnswers[field])) + " %");
        }
    });
}

$(document).ready(function(){
    $.getJSON('./questions.json', function(data) {
        notLoadedJSON--;
        questions = data;
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
                    userAnswers[question_number] = variant;
                    if(qdiv.children('.forward').length==0){
                        var forward = $('<div/>', {
                            text: ' >>>',
                            'class': 'forward'
                        });
                        forward.appendTo(qdiv);
                        forward.hover(
                            function(){
                                $(this).addClass('hover');
                            },
                            function(){
                                $(this).removeClass('hover');
                            }
                        );
                        forward.click(function() {
                            qdiv.hide();
                            qdiv.next().show();
                        });
                    }
                    qdiv.next().show();
                });
            });
            if(qdiv.prev('.question').length != 0){
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
        $('.answer,.back').hover(
            function(){
                $(this).addClass('hover');
            },
            function(){
                $(this).removeClass('hover');
            }
        );
        render();
    });

    $.getJSON('./answers.json', function(data) {
        notLoadedJSON--;
        testAnswers = data;
        render();
    });

    $.getJSON('./field_answers.json', function(data) {
        notLoadedJSON--;
        fieldAnswers = data;
        render();
    });
});
