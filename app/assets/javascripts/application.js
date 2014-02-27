// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require turbolinks
//= require jquery
//= require jquery_ujs
//= require handlebars.runtime
//= require_tree ./templates
//= require_tree .



$(document).on('ready page:load', function(){

  $("#cbtn").on('click',function(e){
    e.preventDefault();
    $("#content").empty();
    $.get("/getcontacts.json").done(function(data){
      var contacts = $("<div id=\"contacts\"><h1>Contacts</h1><button><a href=\"/newcontact\">Add contact</a></button></div>");
      var confirmed = $("<div id=\"confirmed_contacts\"></div>");
      var inc = $("<div id=\"inc_contacts\"><h3>Pending incoming</h3></div>");
      var out = $("<div id=\"out_contacts\"><h3>Pending outgoing</h3></div>");

          $(data.confirmed_contacts).each(function(index, contact){
            var contactHTML = HandlebarsTemplates.confirmedcontacts(contact);
              confirmed.append(contactHTML);
          });

          $(data.inc_pending_contacts).each(function(index, contact){
            var contactHTML = HandlebarsTemplates.incpendingcontacts(contact);
              inc.append(contactHTML);
          });
          $(data.out_pending_contacts).each(function(index, contact){
            var contactHTML = HandlebarsTemplates.outpendingcontacts(contact);
              out.append(contactHTML);
          });
          contacts.append(confirmed);
          contacts.append(inc);
          contacts.append(out);

      $("#content").append(contacts);
      });
  });

  $("#pbtn").on('click',function(e){
    e.preventDefault();
    $("#content").empty();
    var id = $("#user_id").data('id');
    $.get("/contact/"+id+".json").done(function(data){
            var profileHTML = HandlebarsTemplates.uprofile(data);
              $("#content").append(profileHTML);
    }); 
  });

  $("#ibtn").on('click', function(e){
      e.preventDefault();
      $("#content").empty();
      $.get("/invites.json").done(function(data){

        var invites = $("<div id=\"invites\"><h2>Invites</h2><button id=\"incbtn\">incoming</button>   <button id=\"outbtn\">outgoing</button></div>");
        var inc = $("<div id=\"inc_invites\"> </div>");
        var out = $("<div id=\"out_invites\"> </div>");

        $(data.inc_invites).each(function(index, invite){
          maketime.apply(invite);
          var inviteHTML = HandlebarsTemplates.incinvites(invite);
          inc.append(inviteHTML);
          invites.append(inc); 
          $("#content").append(invites);
        });

        $(data.out_invites).each(function(index, invite){
          maketime.apply(invite);
          var inviteHTML = HandlebarsTemplates.outinvites(invite);
          out.append(inviteHTML);
          out.hide();
          invites.append(out); 
        });
      });
  });

  $("#ebtn").on('click', function(e){
    e.preventDefault();
    showmeets();
  }); 



  

      $("#content").on('click',"#incbtn", function(e){
          e.preventDefault();
          e.stopPropagation();
          $("#out_invites").hide();
          $("#inc_invites").show();
      });

      $("#content").on('click', "#outbtn", function(e){
        e.preventDefault();
        e.stopPropagation();
        $("#inc_invites").hide();
        $("#out_invites").show();
      });

      $("#content").on('click', ".inc_invite", function(){
        var id = $(this).data('id');
        $.get("/invites/"+id+".json").done(function(data){
         maketime.apply(data);
            var incinviteHTML = HandlebarsTemplates.incinvite(data);
              $("#content").empty();
              $("#content").append(incinviteHTML);
        });
      });

      $("#content").on('click', ".out_invite", function(){
        var id = $(this).data('id');
        $.get("/invites/"+id+".json").done(function(data){
          maketime.apply(data);
            var outinviteHTML = HandlebarsTemplates.outinvite(data);
              $("#content").empty();
              $("#content").append(outinviteHTML);
        });
      });

      $("#content").on('click', ".meet", function(){
        var id= $(this).data('id');
        $.get("/meets/"+id+".json").done(function(data){
          maketime.apply(data);
          var meetHTML = HandlebarsTemplates.meet(data);
          $("#content").empty();
          $("#content").append(meetHTML);
        });
      });

      $("#content").on('click', ".c_con", function(){
        var id= $(this).data('id');
        $.get("/contact/"+id+".json").done(function(data){
          var contactHTML= HandlebarsTemplates.contact(data);
          $("#content").empty();
          $("#content").append(contactHTML);
        });
      });




    function maketime() {
    var a_p = "";
    var t = new Date(this.time);
    var curr_hour = t.getHours()+8;
    if (curr_hour < 12)
       {a_p = "AM";}
    else
       {a_p = "PM";}
    if (curr_hour === 0)
       {curr_hour = 12;}
    if (curr_hour > 12)
       {curr_hour = curr_hour - 12;}
    var curr_min = t.getMinutes();
    var time = curr_hour + ":" + curr_min + " " + a_p;

    var m_names = new Array("Jan", "Feb", "Mar", 
    "Apr", "May", "Jun", "Jul", "Aug", "Sep", 
    "Oct", "Nov", "Dec");

    var d = new Date(this.date);
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    var date = m_names[curr_month] + " " + curr_date;

    this.showtime = time;
    this.showdate = date;
    }





    function showmeets(){
    // e.preventDefault();
    $("#content").empty();
    var meets = $("<div id=\"meets\"><a href=\"/contacts\"><button id=\"newmeetbtn\"> New Meet </button></a></div>");
    var meet_list = $("<div id=\"meet_container\"> </div>");
    $.get("/meets.json").done(function(data){
      $(data).each(function(index, meet){
        
      maketime.apply(meet);

      var meetsHTML = HandlebarsTemplates.meets(meet);
        meet_list.append(meetsHTML);
      });

        meets.append(meet_list);
      $("#content").append(meets);
    });
  }


  $('#content').on('click', '#addbio', function(){
    $('div#profile').empty();
    $('div#profile').append("<h2>Bio</h2><textarea id=\"bio\" cols=\"30\" rows=\"7\"></textarea><br><button id=\"biosubmit\">Submit</button>");
  });

  $('#content').on('click', '#biosubmit', function(){
    var bio_text = $('#bio').val();
    var data = { bio : bio_text };
    var id = $('#user_id').data('id');
    $.ajax({
      method: "post",
      url: "/users/" + id + "/updatebio",
      data: data
    });
  });


  showmeets();




});
