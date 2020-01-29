var objects = [];

function fillButtons() {
    function rest(t, wh) {
        var i = $(wh).index();
        objects[i] = t;
        var c = t.category;
        $(wh).html(c);
    }
    $("#divni").children(".butto").each(function () {
        callAPI(rest, this);
        $(this).mouseenter(hover);
        $(this).mouseleave(leave);
        $(this).click(clickAns);
    });
    $("#popupButtonDiv").children(".popupButton").each(function () {
        $(this).click(answerClicked);
        $(this).mouseenter(answerHover);
        $(this).mouseleave(answerLeave);
    });
}

function answerHover() {
    $(this).css({
        "background-color": "whitesmoke"
    });
}

function answerLeave() {
    var who = this.id;
    switch (who) {
        case "popupButton1":
            $(this).css({
                "background-color": "yellow",
            });
            break;
        case "popupButton2":
            $(this).css({
                "background-color": "red",
            });
            break;
        case "popupButton3":
            $(this).css({
                "background-color": "green",
            });
            break;
        case "popupButton4":
            $(this).css({
                "background-color": "blue",
            });
            break;
    }
}

function answerClicked() {
    $("#popup").css({
        "display": "none"
    });
    if ($(this).text() == correctAnswer) {
        setCounter(1);
        changeMessage(1);
    } else {
        setCounter(-1);
        changeMessage(0);
    }
}

function setCounter(i) {
    var value = parseInt($("#counter").text()) + i;
    $("#counter").html(value);
}

function changeMessage(b) {
    function enlarge(){
        $("#message").animate({
            "padding-top" : "0em",
            "font-size":"7vw"
        }, 500, function(){
            reverse(b);
        });
    }
    function reverse(b){
        $("#message").animate({
            "padding-top" : "0.5em",
            "font-size":"5vw"
        }, 500);
        if(!b){
            function hidePopup(){
                $("#popupAnswer").css({
                    "display":"none"
                });
            }
            $("#popupAnswer").css({
                "display":"block"
            });
            $("#popupCorrectAnswer").html(correctAnswer);
            setTimeout(hidePopup, 1500);
        }
    }
    $("#message").css({
        "display": "block"
    }
    );
    if (b) {
        $("#message").css({
            "color": "green"
        });
        $("#message").html("+1");
        enlarge();
    } else {
        $("#message").css({
            "color": "red"
        });
        $("#message").html("-1");
        enlarge();
    }
}

function setPopupButtons(i) {
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }
    var incorrect = objects[i].incorrect_answers;
    var l = [objects[i].correct_answer, incorrect[0], incorrect[1], incorrect[2]];
    shuffle(l);
    var index = 0;
    $("#popupQuestion").html(objects[i].question);
    $("#popupButtonDiv").children(".popupButton").each(function () {
        $(this).html(l[index++]);
    });
    $("html, body").animate({ scrollTop: 0 }, "slow");
}

function clickAns() {
    function restAPI(t, wh) {
        var i = $(wh).index();
        objects[i] = t;
        var c = t.category;
        $(wh).html(c);
        $(wh).mouseenter(hover);
        $(wh).mouseleave(leave);
        $(wh).click(clickAns);
    }
    function addToEnd() {
        var btn = $("<button>", { "class": "butto" });
        callAPI(restAPI, btn);
        $("#divni").append($(btn));
    }
    function rem(i) {
        function rest() {
            objects.splice(i, 1);
            $(who).remove();
            addToEnd();
        }
        var who = $("#divni").children().eq(i);

        $(who).animate(
            {
                "height": "toggle",
                "font-size": "0px"
            }, 500, function () { rest(); }
        );

    }
    var i = $(this).index();
    correctAnswer = objects[i].correct_answer;
    $("#popup").css({
        "display": "unset"
    });
    setPopupButtons(i);
    window.setTimeout(function () { rem(i); }, 1000);
}

function hover() {
    $(this).animate({
        "font-size": "1.5vw",
        "margin": "0vw",
        "width": "22vw",
        "height": "22vw"
    });
    $(this).css({
        "background-color": "black",
        "color": "darkgrey"
    });
    var i = $(this).index();
    $(this).html(objects[i].question);
}

function leave() {
    $(this).animate({
        "font-size": "2vw",
        "margin": "1vw",
        "width": "20vw",
        "height": "20vw"
    });
    $(this).css({
        "background-color": "darkgrey",
        "color": "black"
    });
    var i = $(this).index();
    $(this).html(objects[i].category);
}

window.addEventListener("load", load, false);
function load() {
    fillButtons();
}

function callAPI(rest, who) {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://opentdb.com/api.php?amount=1&type=multiple', true);
    request.onload = function () {
        var data = JSON.parse(this.response);
        var t = data.results[0];
        rest(t, who);
    }
    request.send();
}