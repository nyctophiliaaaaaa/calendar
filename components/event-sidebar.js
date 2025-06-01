"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSidebar = EventSidebar;
var date_fns_1 = require("date-fns");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
function EventSidebar(_a) {
    var selectedDate = _a.selectedDate, events = _a.events, onNewEvent = _a.onNewEvent, onDeleteEvent = _a.onDeleteEvent, onEventClick = _a.onEventClick;
    // Filter events for the selected date
    var dayEvents = events.filter(function (event) { return (0, date_fns_1.isSameDay)(event.start, selectedDate); });
    var formatEventTime = function (start, end) {
        return "".concat((0, date_fns_1.format)(start, "h:mm a"), " - ").concat((0, date_fns_1.format)(end, "h:mm a"));
    };
    var handleDeleteEvent = function (e, eventId, eventTitle) {
        e.stopPropagation(); // Prevent event click when deleting
        if (window.confirm("Are you sure you want to delete \"".concat(eventTitle, "\"?"))) {
            onDeleteEvent(eventId);
        }
    };
    return (<div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Today</h2>
      </div>

      {/* Events Content */}
      <div className="flex-1 p-6">
        {dayEvents.length === 0 ? (<div className="text-center">
            <p className="text-xl text-gray-400 font-medium">No Events</p>
          </div>) : (<div className="space-y-4">
            {dayEvents.map(function (event) { return (<div key={event.id} onClick={function () { return onEventClick(event); }} className={"p-4 rounded-lg border ".concat(event.color, " shadow-sm relative group cursor-pointer hover:shadow-md transition-shadow")}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{formatEventTime(event.start, event.end)}</p>
                    {event.description && <p className="text-sm text-gray-700">{event.description}</p>}
                  </div>
                  <button_1.Button variant="ghost" size="icon" onClick={function (e) { return handleDeleteEvent(e, event.id, event.title); }} className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                    <lucide_react_1.Trash2 className="h-4 w-4"/>
                  </button_1.Button>
                </div>
              </div>); })}
          </div>)}
      </div>
    </div>);
}
