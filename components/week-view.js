"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekView = WeekView;
var react_1 = require("react");
var date_fns_1 = require("date-fns");
function WeekView(_a) {
    var currentDate = _a.currentDate, selectedDate = _a.selectedDate, events = _a.events, onDateClick = _a.onDateClick, onEventClick = _a.onEventClick;
    var _b = (0, react_1.useState)(new Date()), currentTime = _b[0], setCurrentTime = _b[1];
    (0, react_1.useEffect)(function () {
        var timer = setInterval(function () {
            setCurrentTime(new Date());
        }, 60000);
        return function () { return clearInterval(timer); };
    }, []);
    var hours = Array.from({ length: 24 }, function (_, i) { return i; });
    var weekStart = (0, date_fns_1.startOfWeek)(currentDate, { weekStartsOn: 0 });
    var days = Array.from({ length: 7 }, function (_, i) { return (0, date_fns_1.addDays)(weekStart, i); });
    // Get current day in Philippines time
    var now = new Date();
    var philippinesTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
    var formatHour = function (hour) {
        if (hour === 0)
            return "12 AM";
        if (hour === 12)
            return "12 NN";
        return hour < 12 ? "".concat(hour, " AM") : "".concat(hour - 12, " PM");
    };
    // Check if an event spans multiple days
    var isMultiDayEvent = function (event) {
        return !(0, date_fns_1.isSameDay)(event.start, event.end);
    };
    // Simplified event filtering - check if event occurs on this day
    var getEventsForDay = function (day) {
        var dayStart = (0, date_fns_1.startOfDay)(day);
        var dayEnd = (0, date_fns_1.endOfDay)(day);
        return events.filter(function (event) {
            // Event starts on this day
            var startsOnDay = (0, date_fns_1.isSameDay)(event.start, day);
            // Event ends on this day
            var endsOnDay = (0, date_fns_1.isSameDay)(event.end, day);
            // Event spans across this day (starts before and ends after)
            var spansDay = event.start < dayStart && event.end > dayEnd;
            // Event overlaps with this day
            var overlapsDay = event.start <= dayEnd && event.end >= dayStart;
            return startsOnDay || endsOnDay || spansDay || overlapsDay;
        });
    };
    // Get event position for a specific day
    var getEventPosition = function (event, day) {
        var dayStart = (0, date_fns_1.startOfDay)(day);
        var dayEnd = (0, date_fns_1.endOfDay)(day);
        // Determine the effective start and end times for this day
        var effectiveStart = event.start;
        var effectiveEnd = event.end;
        // If event starts before this day, use day start
        if (event.start < dayStart) {
            effectiveStart = dayStart;
        }
        // If event ends after this day, use day end
        if (event.end > dayEnd) {
            effectiveEnd = dayEnd;
        }
        // Calculate position based on effective times
        var startHour = effectiveStart.getHours() + effectiveStart.getMinutes() / 60;
        var endHour = effectiveEnd.getHours() + effectiveEnd.getMinutes() / 60;
        var duration = endHour - startHour;
        // Ensure minimum duration for visibility
        var minDuration = 0.5; // 30 minutes minimum
        var finalDuration = Math.max(duration, minDuration);
        return {
            top: "".concat(startHour * 60, "px"),
            height: "".concat(finalDuration * 60, "px"),
        };
    };
    var getCurrentTimePosition = function () {
        var hours = philippinesTime.getHours();
        var minutes = philippinesTime.getMinutes();
        return {
            top: "".concat(hours * 60 + minutes, "px"),
        };
    };
    // Find which day column represents today
    var todayColumnIndex = days.findIndex(function (day) { return (0, date_fns_1.isSameDay)(day, philippinesTime); });
    // Extract background color from the event color class
    var getBackgroundColor = function (colorClass) {
        var colorMap = {
            "bg-[#FF6961]": "#FF6961", // Coral
            "bg-[#B19CD9]": "#B19CD9", // Lavender
            "bg-[#77DD77]": "#77DD77", // Mint
            "bg-[#FFB347]": "#FFB347", // Peach
            "bg-[#87CEEB]": "#87CEEB", // Sky Blue
            "bg-[#F8BBD9]": "#F8BBD9", // Rose
            "bg-[#FDFD96]": "#FDFD96", // Lemon
            "bg-[#9CAF88]": "#9CAF88", // Sage
        };
        for (var _i = 0, _a = Object.entries(colorMap); _i < _a.length; _i++) {
            var _b = _a[_i], className = _b[0], color = _b[1];
            if (colorClass.includes(className)) {
                return color;
            }
        }
        return "#FF6961"; // Default coral color
    };
    // Debug logging
    (0, react_1.useEffect)(function () {
        console.log("Week View - Total events:", events.length);
        days.forEach(function (day, index) {
            var dayEvents = getEventsForDay(day);
            console.log("".concat((0, date_fns_1.format)(day, "EEE MMM d"), ": ").concat(dayEvents.length, " events"));
            dayEvents.forEach(function (event) {
                console.log("  - ".concat(event.title, ": ").concat((0, date_fns_1.format)(event.start, "HH:mm"), " - ").concat((0, date_fns_1.format)(event.end, "HH:mm")));
            });
        });
    }, [events, currentDate]);
    return (<div className="h-full bg-white overflow-auto">
      {/* Day headers */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="grid grid-cols-8">
          {/* Empty cell for time column */}
          <div className="border-r border-gray-200"></div>

          {/* Day headers */}
          {days.map(function (day, i) {
            var isToday = (0, date_fns_1.isSameDay)(day, philippinesTime);
            var isSelected = (0, date_fns_1.isSameDay)(day, selectedDate);
            var dayEvents = getEventsForDay(day);
            return (<div key={i} className="text-center py-4 border-r border-gray-200 last:border-r-0">
                <div className="text-sm text-gray-600 mb-1">{(0, date_fns_1.format)(day, "EEE")}</div>
                <button onClick={function () { return onDateClick === null || onDateClick === void 0 ? void 0 : onDateClick(day); }} className={"\n                    inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors hover:bg-gray-100\n                    ".concat(isSelected ? "bg-rose-500 text-white hover:bg-rose-600" : "text-gray-800", "\n                  ")}>
                  {(0, date_fns_1.format)(day, "d")}
                </button>
                {/* Debug: Show event count */}
                {dayEvents.length > 0 && <div className="text-xs text-blue-500 mt-1">{dayEvents.length} events</div>}
              </div>);
        })}
        </div>
      </div>

      {/* Time grid */}
      <div className="relative">
        {hours.map(function (hour) { return (<div key={hour} className="grid grid-cols-8 h-[60px]">
            {/* Time label */}
            <div className="border-r border-b border-gray-200 flex items-start justify-end pr-3 pt-1">
              <span className="text-sm text-gray-500">{formatHour(hour)}</span>
            </div>

            {/* Day columns */}
            {days.map(function (day, dayIndex) { return (<div key={dayIndex} className="border-r border-b border-gray-200 last:border-r-0 relative">
                {/* Grid cell content */}
              </div>); })}
          </div>); })}

        {/* Current time indicator */}
        {todayColumnIndex !== -1 && (<div className="absolute border-t-2 border-rose-500 z-20" style={__assign(__assign({}, getCurrentTimePosition()), { left: "".concat(((todayColumnIndex + 1) / 8) * 100, "%"), width: "".concat((1 / 8) * 100, "%") })}>
            <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-rose-500"></div>
          </div>)}

        {/* Events - Render all events for all days */}
        {days.map(function (day, dayIndex) {
            var dayEvents = getEventsForDay(day);
            return dayEvents.map(function (event, eventIndex) {
                var position = getEventPosition(event, day);
                var backgroundColor = getBackgroundColor(event.color);
                var isMultiDay = isMultiDayEvent(event);
                var isStartDay = (0, date_fns_1.isSameDay)(event.start, day);
                return (<div key={"week-event-".concat(day.getTime(), "-").concat(event.id, "-").concat(eventIndex)} onClick={function () { return onEventClick === null || onEventClick === void 0 ? void 0 : onEventClick(event); }} className="absolute rounded-md shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 z-10" style={{
                        top: position.top,
                        height: position.height,
                        left: "".concat(((dayIndex + 1) / 8) * 100 + 0.5, "%"),
                        width: "".concat((1 / 8) * 100 - 2, "%"),
                        backgroundColor: backgroundColor,
                        marginLeft: "".concat(eventIndex * 3, "px"),
                    }}>
                {/* Content */}
                <div className="p-1 h-full flex flex-col justify-start text-white text-xs">
                  <div className="font-semibold truncate drop-shadow-sm">{event.title}</div>
                  {isStartDay && (<div className="truncate opacity-90 drop-shadow-sm">{(0, date_fns_1.format)(event.start, "h:mm a")}</div>)}
                </div>

                {/* Left border accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{
                        backgroundColor: backgroundColor,
                        filter: "brightness(0.7)",
                    }}/>
              </div>);
            });
        })}
      </div>
    </div>);
}
