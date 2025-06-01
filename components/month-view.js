"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthView = MonthView;
var date_fns_1 = require("date-fns");
function MonthView(_a) {
    var currentDate = _a.currentDate, events = _a.events, onDateClick = _a.onDateClick, onEventClick = _a.onEventClick;
    var actualToday = new Date(2025, 5, 1); // June 1, 2025
    var monthStart = (0, date_fns_1.startOfMonth)(currentDate);
    var monthEnd = (0, date_fns_1.endOfMonth)(currentDate);
    // Get the start and end of the calendar view (including partial weeks)
    var calendarStart = (0, date_fns_1.startOfWeek)(monthStart, { weekStartsOn: 0 });
    var calendarEnd = (0, date_fns_1.endOfWeek)(monthEnd, { weekStartsOn: 0 });
    var days = (0, date_fns_1.eachDayOfInterval)({ start: calendarStart, end: calendarEnd });
    // Group days into weeks
    var weeks = [];
    for (var i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }
    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // Get events for a specific day (single day events only)
    var getSingleDayEventsForDay = function (day) {
        return events.filter(function (event) {
            var isSingleDay = (0, date_fns_1.isSameDay)(event.start, event.end);
            return isSingleDay && (0, date_fns_1.isSameDay)(event.start, day);
        });
    };
    // Get multi-day events that span across days
    var getMultiDayEvents = function () {
        return events.filter(function (event) { return !(0, date_fns_1.isSameDay)(event.start, event.end); });
    };
    // Calculate which days a multi-day event spans in the current calendar view
    var getEventSpanForWeek = function (event, week) {
        var eventStart = event.start;
        var eventEnd = event.end;
        var spans = [];
        var currentSpanStart = null;
        var currentSpanLength = 0;
        for (var i = 0; i < week.length; i++) {
            var day = week[i];
            var dayStart = (0, date_fns_1.startOfDay)(day);
            var dayEnd = (0, date_fns_1.endOfDay)(day);
            // Check if event overlaps with this day
            var overlaps = (0, date_fns_1.isWithinInterval)(dayStart, { start: eventStart, end: eventEnd }) ||
                (0, date_fns_1.isWithinInterval)(dayEnd, { start: eventStart, end: eventEnd }) ||
                (eventStart <= dayStart && eventEnd >= dayEnd);
            if (overlaps) {
                if (currentSpanStart === null) {
                    currentSpanStart = i;
                    currentSpanLength = 1;
                }
                else {
                    currentSpanLength++;
                }
            }
            else {
                if (currentSpanStart !== null) {
                    spans.push({
                        start: currentSpanStart,
                        length: currentSpanLength,
                        event: event
                    });
                    currentSpanStart = null;
                    currentSpanLength = 0;
                }
            }
        }
        // Handle case where span goes to end of week
        if (currentSpanStart !== null) {
            spans.push({
                start: currentSpanStart,
                length: currentSpanLength,
                event: event
            });
        }
        return spans;
    };
    var handleEventClick = function (e, event) {
        e.stopPropagation(); // Prevent date click when clicking on event
        onEventClick === null || onEventClick === void 0 ? void 0 : onEventClick(event);
    };
    return (<div className="h-full bg-white overflow-auto">
      {/* Day headers - no borders */}
      <div className="grid grid-cols-7 sticky top-0 bg-white z-10">
        {dayNames.map(function (dayName, index) { return (<div key={dayName} className={"\n              text-right text-sm font-medium py-4 pr-3 text-gray-800\n              ".concat(index === 0 || index === 6 ? "text-gray-500" : "", "\n            ")}>
            {dayName}
          </div>); })}
      </div>

      {/* Calendar grid */}
      <div className="grid">
        {weeks.map(function (week, weekIndex) { return (<div key={weekIndex} className="relative">
            {/* Day cells */}
            <div className="grid grid-cols-7 border-t border-gray-200">
              {week.map(function (day, dayIndex) {
                var isCurrentMonth = (0, date_fns_1.isSameMonth)(day, currentDate);
                var isSelected = (0, date_fns_1.isSameDay)(day, actualToday);
                var isWeekend = dayIndex === 0 || dayIndex === 6;
                var dayEvents = getSingleDayEventsForDay(day);
                return (<button key={dayIndex} onClick={function () { return onDateClick === null || onDateClick === void 0 ? void 0 : onDateClick(day); }} className={"\n                      min-h-[120px] border-r border-gray-200 last:border-r-0 p-0 text-left hover:bg-gray-50 transition-colors relative\n                      ".concat(isCurrentMonth ? (isWeekend ? "bg-gray-100" : "bg-white") : "bg-gray-100", "\n                    ")}>
                    <div className="absolute top-2 right-2">
                      <span className={"\n                          text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full\n                          ".concat(isSelected ? "bg-rose-500 text-white" : "", "\n                          ").concat(!isCurrentMonth ? "text-gray-400" : "text-gray-800", "\n                        ")}>
                        {(0, date_fns_1.format)(day, "d")}
                      </span>
                    </div>

                    {/* Single day events */}
                    <div className="mt-8 px-2">
                      {dayEvents.slice(0, 3).map(function (event) { return (<div key={event.id} onClick={function (e) { return handleEventClick(e, event); }} className={"mb-1 text-xs truncate rounded px-1 py-0.5 ".concat(event.color, " cursor-pointer hover:opacity-80 transition-opacity")}>
                          {event.title}
                        </div>); })}
                      {dayEvents.length > 3 && (<div className="text-xs text-gray-500 pl-1">+{dayEvents.length - 3} more</div>)}
                    </div>
                  </button>);
            })}
            </div>

            {/* Multi-day events overlay */}
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: '120px' }}>
              {getMultiDayEvents().map(function (event) {
                var spans = getEventSpanForWeek(event, week);
                return spans.map(function (span, spanIndex) { return (<div key={"".concat(event.id, "-").concat(spanIndex)} onClick={function (e) { return handleEventClick(e, event); }} className={"absolute rounded px-2 py-1 text-xs font-medium truncate ".concat(event.color, " cursor-pointer hover:opacity-80 transition-opacity pointer-events-auto")} style={{
                        left: "".concat((span.start / 7) * 100, "%"),
                        width: "".concat((span.length / 7) * 100, "%"),
                        top: '32px', // Position below the date number
                        height: '20px',
                        zIndex: 5
                    }}>
                    {event.title}
                  </div>); });
            })}
            </div>
          </div>); })}
      </div>
    </div>);
}
