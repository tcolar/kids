// Single page offline kids Math, no server or web access needed.
// Rely on Html5 for sounds
// Thibaut Colar.

// TODO: Count down timer.
// TODO: Max digit for mult (and additions ? )
// TODO: Divisions ?

// Globals
var good = new Audio("Cat.mp3");
var bad = new Audio("SeaLion.mp3");
var score = 0; // Aggregated user score
var answer1; // Answer lines
var answer2; // Might be multiple if intermediate lines
var answer3; // For example for ultiplications
var answer4; // Answer4 is always tthe "final" answer (total)
var curOp = -1;

$( document ).ready(function() {
  // Initialize options form upon page load
  for(i=0; i!=10; i++) {
    $("#add_ld").append("<option value="+i+">"+i+"</option>");
    $("#add_td").append("<option value="+i+">"+i+"</option>");
    $("#sub_ld").append("<option value="+i+">"+i+"</option>");
    $("#sub_td").append("<option value="+i+">"+i+"</option>");
    $("#mul_ld").append("<option value="+i+">"+i+"</option>");
    $("#mul_td").append("<option value="+i+">"+i+"</option>");
    if(i>0) {
      $("#add_min").append("<option value="+i+">"+i+"</option>");
      $("#add_max").append("<option value="+i+">"+i+"</option>");
      $("#sub_min").append("<option value="+i+">"+i+"</option>");
      $("#sub_max").append("<option value="+i+">"+i+"</option>");
    }
    if(i <= 6) {
      $("#mul_top").append("<option value="+i+">"+i+"</option>");
    }
    if(i <= 3) {
      $("#mul_bottom").append("<option value="+i+">"+i+"</option>");
    }
  }
  $("#add_min").val("3");
  $("#add_max").val("5");
  $("#add_ld").val("0");
  $("#add_td").val("9");
  $("#sub_min").val("3");
  $("#sub_max").val("5");
  $("#sub_ld").val("0");
  $("#sub_td").val("9");
  $("#mul_top").val("3");
  $("#mul_bottom").val("2");
  $("#mul_ld").val("0");
  $("#mul_td").val("9");
});

// Setup and layout a new math operation for the user to solve
function next() {
  nextOp();
  // handle user answers
  $( ".answer" ).keyup(function(evt) {
    answer(evt);
  });
  //console.log(answer4);
}

// Display a new math operation according to enabled options
function nextOp() {
  curOp++;
  if(curOp > 2 ) {
    curOp = 0;
  }
  var loopCheck = false;
  if(curOp == 0) {
    loopCheck = true;
    if($("#additions").is(":checked")){
      addition();
    } else {
      curOp++;
    }
  }
  if(curOp == 1) {
    if($("#substractions").is(":checked")){
      substraction();
    } else {
      curOp++;
    }
  }
  if(curOp == 2) {
    if($("#multiplications").is(":checked")){
      multiplication();
    } else {
      curOp++;
      if(! loopCheck)
      {
        nextOp(); // wrap around
      }
    }
  }
}

// Prepare and layout an addition
function addition() {
  var n1 = nb($("#add_min").val(), $("#add_max").val(), $("#add_ld").val(), $("#add_td").val());
  var n2 = nb($("#add_min").val(), $("#add_max").val(), $("#add_ld").val(), $("#add_td").val());
  var n3 = 0;
  var n4 = 0;
  var lines = $("#add_nbs").val();
  var html = "";
  html += layoutCarryOver();
  html += layoutLine("", n1);
  html += layoutLine("+", n2);
  if(lines >= 3){
    n3 = nb($("#add_min").val(), $("#add_max").val(), $("#add_ld").val(), $("#add_td").val());
    html += layoutLine("+", n3);
  }
  if(lines >= 4){
    n4 = nb($("#add_min").val(), $("#add_max").val(), $("#add_ld").val(), $("#add_td").val());
    html += layoutLine("+", n4);
  }
  html += layoutAnswerLine("a-4", "=");
  answer4 = "" + (n1 + n2 + n3 + n4);
  $("#operation").html(html);
  $("#a-4-9").select();
}

function substraction(){
  var n1 = nb($("#sub_min").val(), $("#sub_max").val(), $("#sub_ld").val(), $("#sub_td").val());
  var n2 = nb($("#sub_min").val(), $("#sub_max").val(), $("#sub_ld").val(), $("#sub_td").val());
  // Always substract smaller number from larger number
  if(n2 > n1) {
    var tmp = n1;
    n1 = n2;
    n2 = tmp;
  }
  answer4 = "" + (n1 - n2);
  var html = "";
  html += layoutCarryOver();
  html += layoutLine("", n1);
  html += layoutLine("-", n2);
  html += layoutAnswerLine("a-4", "=");
  $("#operation").html(html);
  $("#a-4-9").select();
}

function multiplication() {
  var base = nb($("#mul_top").val(), $("#mul_top").val(), $("#mul_ld").val(), $("#mul_td").val());
  var scale = nb($("#mul_bottom").val(), $("#mul_bottom").val(), $("#mul_ld").val(), $("#mul_td").val());
  var html = "";
  html += layoutCarryOver();
  html += layoutLine("", base);
  html += layoutLine("x", scale);
  var s = "" + scale
  var l = s.length
  for(j=0 ; j < l; j++){
    html += layoutAnswerLine(("a-"+(j+1)), "");
    if(j == 0){
      answer1 = "" + (base * s[l - 1]);
    }
    else if(j == 1){
      answer2 = "" + (10 * base * s[l - 2]);
    }
    else if(j == 2){
      answer3 = "" + (100 * base * s[l - 3]);
    }
  }
  html += layoutAnswerLine("a-4", "=");
  answer4 = "" + (base * scale);
  $("#operation").html(html);
  $("#a-1-9").select();
}

//input line for user to use t put carryovers (optional)
function layoutCarryOver() {
  var html = "<tr><td></td>";
  for(i=0; i!= 10; i++) {
    html += "<td><input size=1/></td>";
  }
  return html + "</tr>";
}

// Layout a line of the operation
function layoutLine(label, val) {
  var html = "<tr><td class='op'>"+label+"</td>";
  var nb = "" + val;
  for(i=0; i!= 10; i++) {
    if( nb.length >= 10 - i) {
      html += "<td>"+nb[nb.length - (10 - i)]+"</td>";
    } else {
      html += "<td>&nbsp;</td>";
    }
  }
  return html + "</tr>";
}

// Layout a answer lien where the user will type his answer
function layoutAnswerLine(id, label) {
  var html = "<tr><td class='op'>"+label+"</td>";
  for(i=0; i!= 10; i++) {
    html += "<td><input class='answer' id='"+(id+"-"+i)+"' size=1/></td>";
  }
  return html + "</tr>";
}

// Less effieint than nb2 but more flexible
function nb(minDigits, maxDigits, lowestDigit, highestDigit) {
  if(maxDigits < minDigits) {
    maxDigits = minDigits;
  }
  var nb = 0;
  var min = parseInt(minDigits);
  var max = parseInt(maxDigits);
  var high = parseInt(highestDigit);
  var low = parseInt(lowestDigit);
  var digits = min + Math.floor(Math.random() * (max - min + 1));
  console.log(digits);
  for(i = 0; i < digits; i++) {
    nb += Math.pow(10, i) * (low + Math.floor(Math.random() * (high - low + 1)));
  }
  console.log(nb);
  return nb;
}

// Number with given number of min/max digits
function nb2(minDigits, maxDigits) {
  if(maxDigits < minDigits) {
    maxDigits = minDigits;
  }
  var exp1 = Math.pow(10, minDigits - 1)
  var exp2 = Math.pow(10, maxDigits)
  var nb = Math.floor(Math.random() * (exp2 - exp1)) + exp1;
  if(maxDigits > minDigits) {
    var divider = Math.floor(Math.random() * (maxDigits - minDigits + 1))
    nb = Math.floor(nb / Math.pow(10, divider));
  }
  return nb;
}

// Handle a user answer (single digit)
function answer(evt) {
  var elem = $("#" + evt.currentTarget.id);
  var val = elem.val();//""+evt.currentTarget.value;
  var parts = elem.attr('id').split("-");
  var ans = answer4;
  if(parts[1] == "3"){
    ans = answer3;
  } else if(parts[1] == "2"){
    ans = answer2;
  } else if(parts[1] == "1"){
    ans = answer1;
  }
  var id = parseInt(parts[2]);
  if(val.length == 0){
    return
  }
  if( 10 - id < ans.len) {
    return;
  }
  var expected = ans[ans.length - (10 - id)];
  if(val == expected) {
    elem.css("background-color", "#ccffcc");
    good.play();
    $("#" + parts[0] + "-" + parts[1] + "-" + (id - 1)).select();
    var comp = ""
    for(i=0 ;i!=10; i++){
      comp += $("#" + parts[0] + "-" + parts[1] + "-" + i).val()
    }
    if(comp == ans){
      score += ans.length;
      if(parts[1] == "4") {
        // Check if this is the complete final answer, if so then give a new problem
        next();
      } else {
        // otherwise move on to next line
        var line = parseInt(parts[1]) + 1;
        var nextBox = $("#" + parts[0] + "-" + line + "-9");
        if( ! nextBox.length){ // if run out of intermediate lines go to total line
          var nextBox = $("#" + parts[0] + "-4-9");
        }
        nextBox.select();
      }
    }
  } else {
    score -= 2;
    elem.css("background-color", "ffcccc");
    bad.play();
  }
  $("#score").text(score);
}