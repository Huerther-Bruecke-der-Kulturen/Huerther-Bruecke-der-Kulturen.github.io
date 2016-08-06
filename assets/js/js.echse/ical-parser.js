/*
 * @section DESCRIPTION
 *
 * This is a poor mans ics parser that reads calendar data as exported
 * from e.g. the google calendar and creates an array of events of the
 * form [{date, date_text,name,descripion,location},...] which can be
 * used in e.g. clndr.
 *
 * @version 1.0.0
 * @date: 2016-07-22
 *
 * @author: Sebastian Schmittner <sebastian@schmittner.pw>
 * @copyright: 2016 Sebastian Schmittner
 *
 * @section LICENSE
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License
 * as published by the Free Software Foundation; either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License and a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */


"use strict";

var ICAL_PARSER = {};

(function(){
    "use strict";

    var ical_string="";

    /*
      This function invokes the parser (asynchroneously). The
      resulting events array is passed to the given handler (chaining).

      options (all mandatory)
      url          for the ics file 
      handle       function(events) called after reading events from file
    */
    function ics_to_event(url, handle){
        $.ajax({
            url: url,
            dataType:"text",
            success: function(data, textStatus, jqXHR){
                parse_ics(data, handle);
            },
            error: function(data, textStatus, jqXHR){
                console.log("ajax err");
                console.log(data);
                console.log(textStatus);
                console.log(jqXHR);
            }

        });
    }

    /*
      Parse the ics file given by url (caution, cross site scripting
      protection will usually block non-local access). Render the
      event list and paste a list of all future events into the
      target_element (appending).
    */
    ICAL_PARSER.render = function (url, target_element)
    {
	var render_events = function(events)
	{
	    events.sort(function(a,b)
			{
			    if(a.date == b.date)
				return 0;
			    else if (a.date > b.date)
				return 1;
			    return -1;
			});
	    
	    var list = $("<ul></ul>").addClass("event-ul");
	    
	    for(var i = 0; i < events.length; i++)
	    {
		//skip past events
		var now = moment();
		if(moment.max(moment(events[i].date), now) === now)
		    continue;
		
		var item = $("<li title='" + events[i].descripion + "'></li>").addClass('event-item');
                var date = $("<div></div>").addClass('event-item-date');
		if(events[i].date_text != undefined)
		    date.html( events[i].date_text +":");
		
		var name = $("<div></div>").addClass('event-item-name');
		if(events[i].name != undefined)
		    name.html( events[i].name);
		
		var location = $("<div></div>").addClass('event-item-location');
		if(events[i].location != undefined)
		    location.html( events[i].location);
		
		item.append(date).append(name).append(location);
		list.append(item);
	    }
	    target_element.append(list);
	}

	ics_to_event(url, render_events);
    }

    function escape(string)
    {
        var re = string;
        re = re.replace(/\\,/g , ",");
        return re;
    }

    function parse_ics(data, handle){

        var events=[];
        var lines = data.split("\n");
        var len = lines.length;
        var in_event=false;
        var date="";
        var description="";
        var location="";
        var name="";

        for (var i = 0; i < len; i++)
        {
            if(!in_event && lines[i].trim() != "BEGIN:VEVENT")
            {
                continue;
            }

            if(lines[i].trim() == "BEGIN:VEVENT")
            {
                date="";
                description="";
                location="";
                name="";
                in_event = true;
                continue;
            }

            if(lines[i].trim() == "END:VEVENT")
            {
                name = escape(name);
                description = escape(description);
                location = escape(location);
                var date_text = moment(date).format('l');
                events.push({
                    date: date,
                    date_text:date_text,
                    name: name,
                    descripion: description,
                    location: location
                });
                in_event = false;
                continue;
            }

            //concat wrapped lines
            for(var j=i+1; j < len; j++)
            {
                if(lines[j].charAt[0] == " "){
                    lines[i] = lines[i].trim() + lines[j].trim();
                }else{
                    break;
                }
            }

            var parts = lines[i].trim().split(":");
            for(var j=2;j<parts.length;j++)
            {
                parts[1] = parts[1].trim() + ": " + parts[j].trim();
            }
            if(parts[0] == "DTSTART" || parts[0] == "DTSTART;VALUE=DATE")
            {
                date = parts[1].trim();
            }
            else if(parts[0] == "DESCRIPTION")
            {
                description = parts[1].trim();
            }
            else if(parts[0] == "LOCATION")
            {
                location = parts[1].trim();
            }
            else if(parts[0] == "SUMMARY")
            {
                name = parts[1].trim();
            }

        }
        //      console.log(events);
        handle(events);
    }


}());
