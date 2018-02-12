var default_content="";
var lasturl="";
var cname="cc";
var cc="";
var jsonPrice= "currency.json";
var coursePrice=1;
var interestedCourse="";
var currencySelected ="";
var email="";

$(document).ready(function(){

    
	checkURL();
   	$('ul li a').click(function (e){
            checkURL(this.hash);
    });
    
	default_content = $('#pageContent').html();
	setInterval("checkURL()",250);
});

function checkURL(hash)
{
	if(!hash) hash=window.location.hash;
	if(hash != lasturl)
	{
		lasturl=hash;
		// FIX - if we've used the history buttons to return to the homepage,
		// fill the pageContent with the default_content
		if(hash==""){
                $('#pageContent').html(default_content);
        }
        else{
                if(hash=="#courselist"){   
                    loadCourseList();
                }
                else{
                    if(hash == "#courseSchedule"){   
                        loadCourseSchedule();
                    }
                    else{
                          clearContent();
                          loadPage(hash);
                    }
 		      }
            }
     }
}

function loadPage(url)
{
	url=url.replace('#page','');
    $('#loading').css('visibility','visible');
	$.ajax({
        asyn:"false",
		type: "POST",
		url: "load_page.py",
		data: 'page='+url,
		dataType: "html",
		success: function(msg){
            
        if(parseInt(msg)!=0)
            { 	
                $('#pageContent').html(msg);
                $('#loading').css('visibility','hidden');
                $('#dropdown').hide(); 
                $('#currencyLabel').hide();
			}
		}

    });
}

// LOAD COURSE LIST

function loadCourseList() {
    
  $('#loading').css('visibility','visible');
  
  var jsonURL = "courseList.json";
  $.getJSON(jsonURL, function (json) { 
        var imgList= "<ul class=\"courses\">";
        $.each(json.courses, function () {
            imgList += '<li><img src= "' + this.imgPath + '"><h3><a href="javascript:openSelectedCourse(\''+this.name+'\')">'+this.name+'</a></h3><h3 class="cost"> SGD ' + this.price + '</h3> </li>';
        });
        imgList+='</ul>'
        $('#pageContent').html(imgList);
   });
}
 
function openSelectedCourse(title)
{  
        $('#loading').css('visibility','visible');
        var jsonURL = "courseList.json";
        interestedCourse = title;
        
        $.getJSON(jsonURL, function (json)
        { 
            var display;
            $.each(json.courses, function () {
                if (this.name == title){
                     display = '<table cellpadding="5px"><tr><td><img src= "' + this.imgPath + '"></td><td>'+this.summary+'</td></tr><tr><td>'+this.name+'</td><td id = "intCourseTotalCost">SGD '+ this.price + '</td></tr></table>';
                     coursePrice = this.price;
                }
                $("#pageContent").css("width","80%");
                $("#pageContent").html(display);
                $('table').attr("id","intCourse")
                $('#intCourseTotalCost').css('background-color','yellow');
            });
         });
       loadCurrency();
}

function loadCurrency() 
{ 
    $('#loading').css('visibility','visible');
    var jsonPrice= "currency.json";
    
    $.getJSON(jsonPrice, function (json){ 
        var dropdownList= "<select class=\"currencies\">";
        $.each(json.currencies, function () {
            dropdownList += '<option value="' + this.code + '">'+ this.country +'</option>';
        });
        dropdownList+='</select>'
        $('#currencyLabel').show();
        $('#dropdown').show();
        $('#currencyLabel').html("Currency");
        $('#dropdown').html(dropdownList);
        $('#loading').css('visibility','hidden');
       
        changedrop();
        loadCoursePrice();
        createLink();
  });
   
}
 

function loadCoursePrice()
{
     $('#loading').css('visibility','visible');
    //To avoid problem its better to use document always to fetch a aparticular value from select element
    
    $(document).on('change keyup', '#drop', function(e) {
         currencySelected = $('#drop :selected').text();
         setCookie(cname,currencySelected,60);
         $('#dropdown').on('click',calPrice(cname));
    });
   
}

function calPrice(cname)
{ 
   $('#loading').css('visibility','visible');
   $("#intCourseTotalCost").html("SGD");
   var jsonPrice= "currency.json";
   cookie_name = getCookie(cname); 
   var courseCost;
   var cr;                  //conversion rate;
   
   $.getJSON(jsonPrice, function (json){
       
         $.each(json.currencies, function ()  {
            
            if (cookie_name == this.country){
                cr =this.conversion;
                courseCost = coursePrice*cr;
                $("#intCourseTotalCost").html('<tr id="price"><td></td><td>'+this.code+' '+ courseCost +' </td></tr>'); 
            }
         });  
  });
    
}

function createLink(){
    $('#loading').css('visibility','visible');
    var $input = $('<input type="button" id="ContactABC" value="Contact US for more details" />'); 
    $input.appendTo($("#pageContent"));
    $('#ContactABC') .css("margin-top","100px")
                    .css("margin-left","700px")
                    .css("width","400px")
                    .css("font-size","1.4em")
                    .css("height","50px")
                    .css("border-color","white")
                    .css("background-color","yellow");
    $("#ContactABC").focusin(function(){
    $( "#ContactABC" ).css( "color","red");
    }) ;
    $("#ContactABC").on('click',function(e){
        loadForm();
        e.preventDefault();
    });
}

                                                           

function loadForm(){   
    $('#loading').css('visibility','visible');
    loadPage("#page5");
    $('#dropdown').hide(); 
    $('#currencyLabel').hide();
 }


function checkform(){
    $('#loading').css('visibility','visible');
    if(ValidationForm()){
        var uname = $("#name").val();
        var email = $("#email").val();
        var course = $("#frm_intCourse").val();
        alert("name = "+uname+"\nemail  ="+email+"\nHidden Course ="+course);
        
        setTimeout(function() { window.location.hash ="page8"});
    }
    else{
        alert("Access denied. Valid username and email is required.");
        return false;
    }
    return;
}
     
  function ValidationForm(){ 
    $('#frm_intCourse').attr('value',interestedCourse);
    
    var isValidForm = validateName()

    if(isValidForm){
        isValidForm = validateEmail();
        }
      
        return isValidForm;
    }

        function validateName()
        {   
            var name = $("#name").val();
            var namelength=name.length;
            var alphaExp = /^[0-9a-zA-Z]+$/;
            if (name==""){
                    $('#dis').text(" All fields are mandatory *");
                   $('#name').focus();
                    return false;
                   }
               else{
                   if ((namelength < 4)|| (namelength >20))
                       { $('#dis').text(" length of username bwtween 4 and 20  *");
                       $('#name').focus();
                       return false;
                       }

                    else{
                        if (alphaExp.test(name))  {
                            return true;
                            } 
                        else {
                                $('#dis').text("onlt uppercase lowercase and number are allowed in username"); // This segment displays the validation rule for address.
                                $('#name').focus();
                                return false;
                            }
                        }

                    }   
            return;
        }


            function validemail(email) {
                  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                  return re.test(email);
                }

            function validateEmail() {
                $("#dis").text("");
                  email = $("#email").val();
                  if (validemail(email)) {
                    $("#comment").focus();
                    return true;
                  } else {
                    $("#dis").text(" Enter valid email !");
                    $("#dis")
                        .css("color", "red")
                        .css("padding-left","20px");
                    $("#email").focus();
                      return false;
                  }
                 return ; 
                }
function setCookie(cname, cvalue, exdays) {
    $('#loading').css('visibility','visible');
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
   $('#loading').css('visibility','visible');
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function clearContent()
{   
    $("#dropdown").toggle(false);
    $('#currencyLabel').toggle("false");
    $('#currencyLabel div').html(''); 
}
function changedrop()
{  // $("select").css( "border", "9px solid hsl(26, 70%, 22%)");
    $("select").css( "width", "100px");
    $("select").attr("id","drop");
    $('#intCourse p').css("color","red");
   
}

// LOAD COURSE SCHEDULE

function loadCourseSchedule()
{
$('#loading').css('visibility','visible');
  
  var jsonURL = "courseList.json";
  $.getJSON(jsonURL, function (json) { 
        var imgList= "<ul class=\"courses\">";
        $.each(json.courses, function () {
            imgList += '<li><img src= "' + this.imgPath + '"><h3><a href="javascript:openChosenCourse(\''+this.name+'\')">'+this.name+'</a></h3></li>';
        });
        imgList+='</ul>'
        $('#pageContent').html(imgList);
   });
    
  $('#loading').css('visibility','hidden');
  return ;
}

function openChosenCourse(name)
    {  $('#loading').css('visibility','visible');
        var jsonURL = "courseDetails.json";
        var id ;
        $.getJSON(jsonURL, function (json)
        { 
            var display;
            $.each(json.courseslist, function () {
                if (this.name == name){
                     display = '<table cellpadding="5px"><tr><td><a href=' +this.link+ '><img src= "' + this.imgPath + '" /><h3>Click The link  To See Course Schedule<h3></a></td><td>'+this.summary+'</td></tr></table>';
                     id = this.id;
                }
                
                    
                $("#pageContent").css("width","80%")
                                 .css("border","0px");
                
                $("#pageContent").html(display);

                $('table').attr("id","coursedetails");
                $('table').css("width","100%");
                $('table').css("border","0px");
                $('img').css("text-align","left");
                $('td').css("padding-left","30px");
                
                $('table').attr("id","chosenCourse")
                $('#chosenCourse p').attr('value',"CourseSchedule");
                $('#chosenCourse p').attr('id',"CourseSchedule");
            });
         });
        return;
    }

//SITE MAP
function home()
{ 
    $("#pageContent").load("pages/page_1.html");
    return;
}
function aboutUs()
{ 
    $("#pageContent").load("pages/page_2.html");
    return;
}
function contactUs()
{
  $("#pageContent").load("pages/page_4.html"); 
    return;
}
function siteMap()
{
  $("#pageContent").load("pages/page_6.html"); 
    return;
}
function privacyPolicy()
{
  $("#pageContent").load("pages/page_7.html"); 
    return;
}

            



