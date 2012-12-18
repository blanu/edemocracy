function remove(arr, from, to)
{
  var rest = arr.slice((to || from) + 1 || arr.length);
  arr.length = from < 0 ? arr.length + from : from;
  return arr.push.apply(arr, rest);
}

jQuery.fn.justtext = function() {
   
    return $(this)  .clone()
            .children()
            .remove()
            .end()
            .text();
 
};

var attendeesStat=0;
var membersStat=0;
var quorumStat=0;
var majorityStat=0;
var checkStat=false;

var members=[];
var absentee=[];

function makeParticipant(text)
{
  return '<li class="participant"><button class="deleteParticipant" value="'+text+'">X</button> <span class="participantName">'+text+'</span> <button class="queueParticipant">+</button></li>';
}

function makeQueue(text)
{
  return '<li class="participant"><button class="deleteItem" value="'+text+'">X</button> <span class="participantName">'+text+'</span> <button class="dequeueParticipant">v</button></li>';
}

function makeHistory(text)
{
  return '<li class="participant"><button class="deleteItem" value="'+text+'">X</button> <span class="participantName">'+text+'</span></li>';
}

function deleteItem()
{
  $(this).parent().remove();
}

function deleteParticipant()
{
  log(participants);
  var text=$(this).next().text();
  log(text);
  var index=jQuery.inArray(text, participants);
  log(index);
  if(index!=-1)
  {
    participants.splice(index, 1);
  }
  log(participants);

  deleteItem();
  addParticipants();
}

function queueParticipant(button)
{
  var text=$(this).prev().text();
  log('queue '+text);
  $('#queue').append(makeQueue(text));  
  activateButtons();
}

function dequeueParticipant(button)
{
  var text=$(this).prev().text();
  log('dequeue '+text);
  $(this).parent().remove();
  $('#history').append(makeHistory(text));  
  activateButtons();
}

function activateButtons()
{
  $('.deleteParticipant').unbind('click');
  $('.deleteParticipant').click(deleteParticipant);
  
  $('.deleteItem').unbind('click');
  $('.deleteItem').click(deleteItem);

  $('.queueParticipant').unbind('click');
  $('.queueParticipant').click(queueParticipant);

  $('.dequeueParticipant').unbind('click');
  $('.dequeueParticipant').click(dequeueParticipant);
  $('.dequeueParticipant').hide();
  $('.dequeueParticipant').first().show();
}

function add(text)
{
  log('adding participant '+text);
  $('#participants').append(makeParticipant(text));
  activateButtons();
}

function addParticipants()
{
  $('#participants').empty();

  participants=participants.sort();
  for(var i=0; i<participants.length; i++)
  {
    var p=participants[i];
    add(p);
  }
}

function addParticipant()
{
  var text=$('#addParticipantField').val();
  participants.push(text);
  log(participants);
  addParticipants();
  $('#addParticipantField').val('');

  return false;
}

function memberClick()
{
    console.log("clicked");
    if($(this).hasClass('memberCheckbox'))
    {
        console.log('is member');
        if($(this).is(':checked'))
        {
            attendeesStat=attendeesStat+1;
            revealAbsenteeCheckbox($(this).parent());
        }
        else
        {
            attendeesStat=attendeesStat-1;            
        }

        if(attendeesStat>=quorumStat)
        {
          checkStat=true;
        }
        else
        {
          checkStat=false;
        }
        
        $('#membersStat').empty().append(membersStat);
        $('#quorumStat').empty().append(quorumStat);
        $('#majorityStat').empty().append(majorityStat);
        $('#attendeesStat').empty().append(attendeesStat);
        
        if(checkStat)
        {
            $('#checkStat').empty().append('<span class="checkYes">Yes</span>');
        }
        else
        {
            $('#checkStat').empty().append('<span class="checkNo">No</span>');            
        }
    }
}

function memberOn()
{
    revealAbsenteeCheckbox(this);
}

function revealAbsenteeCheckbox(li)
{
    if($(li).find('.memberCheckbox').is(':checked'))
    {
        var memberName=$(li).justtext();
        console.log('absentee:');
        console.log(absentee);
        if($.inArray(memberName, absentee)!=-1)
        {
            $(li).find('.absentee').empty().append('Absentee vote? <input class="absenteeCheckbox" type="checkbox" checked="yes"/>');        
        }
        else
        {
            $(li).find('.absentee').empty().append('Absentee vote? <input class="absenteeCheckbox" type="checkbox"/>');
        }
        
        $('.absenteeCheckbox').click(absenteeClick);
    }
}

function memberOff()
{
    var memberName=$(this).justtext();
    console.log('off: '+memberName);
    if($.inArray(memberName, absentee)!=-1 && $(this).find('.memberCheckbox').is(':checked'))
    {
        $(this).find('.absentee').empty().append('<span class="absenteeText">Absentee</span>');
    }
    else
    {
        $(this).find('.absentee').empty();        
    }
}

function absenteeClick()
{
    var memberName=$(this).parent().parent().justtext();
    if($(this).is(':checked'))
    {
        absentee.push(memberName);
    }
    else
    {
        var index=$.inArray(memberName, absentee);
        if(index!=-1)
        {
            remove(absentee, index);
        }
    }
}    
    
function getMembers()
{
  $(this).contents().find('#mw-content-text ul').first().find('li').each(gotMember);
  initDisplay();
}

function gotMember()
{
  var name=$(this).text().replace("\n", '');
  members.push(name);
}

function init()
{
//  $.get('/memberList/', gotMembers);

  var iframe=$('#memberList iframe');
  iframe.load(getMembers);
}

function initDisplay()
{
  members.sort();
  for(var memberNum in members)
  {
      var member=members[memberNum];
      if(member.substring(member.length-1, member.length)=='@')
      {
          $('#members').append('<li class="nonquorum"><input class="nonquorumCheckbox" type="checkbox"/>'+member+'<span class="absentee"/></li>');
      }
      else if(member.substring(member.length-1, member.length)=='$')
      {
          $('#members').append('<li class="nonquorum"><input class="nonquorumCheckbox" type="checkbox"/>'+member+'<span class="absentee"/></li>');          
      }
      else
      {
          $('#members').append('<li class="member"><input class="memberCheckbox" type="checkbox"/>'+member+'<span class="absentee"/></li>');          
          membersStat=membersStat+1;
          quorumStat=Math.round(membersStat/3);          
          majorityStat=Math.round((membersStat/2)+1);
      }
  }

  $('#quorumStat').empty().append(quorumStat);
  $('#majorityStat').empty().append(majorityStat);
  $('#attendeesStat').empty().append(attendeesStat);
  $('#membersStat').empty().append(membersStat);
  $('.memberCheckbox').click(memberClick);
  $('li').hover(memberOn, memberOff);
}

$(document).ready(init);
