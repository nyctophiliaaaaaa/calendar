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
exports.DayView = DayView;
var react_1 = require("react");
var date_fns_1 = require("date-fns");
function DayView(_a) {
    var currentDate = _a.currentDate, selectedDate = _a.selectedDate, events = _a.events, onEventClick = _a.onEventClick;
    var _b = (0, react_1.useState)(new Date()), currentTime = _b[0], setCurrentTime = _b[1];
    (0, react_1.useEffect)(function () {
        var timer = setInterval(function () {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return function () { return clearInterval(timer); };
    }, []);
    var hours = Array.from({ length: 24 }, function (_, i) { return i; });
    // Check if we're viewing today (current day in Philippines time)
    var now = new Date();
    var philippinesTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
    var isToday = (0, date_fns_1.isSameDay)(selectedDate, philippinesTime);
    // Get events for the selected day, including multi-day events
    var getDayEvents = function () {
        return events.filter(function (event) {
            // Check if the event occurs on the selected day
            var selectedDayStart = (0, date_fns_1.startOfDay)(selectedDate);
            var selectedDayEnd = (0, date_fns_1.endOfDay)(selectedDate);
            return ((0, date_fns_1.isWithinInterval)(event.start, { start: selectedDayStart, end: selectedDayEnd }) ||
                (0, date_fns_1.isWithinInterval)(event.end, { start: selectedDayStart, end: selectedDayEnd }) ||
                (event.start <= selectedDayStart && event.end >= selectedDayEnd));
        });
    };
    var dayEvents = getDayEvents();
    var formatHour = function (hour) {
        if (hour === 0)
            return "12 AM";
        if (hour === 12)
            return "12 NN";
        return hour < 12 ? "".concat(hour, " AM") : "".concat(hour - 12, " PM");
    };
    var getEventPosition = function (event) {
        // For multi-day events that start before the selected day
        var eventStart = (0, date_fns_1.isSameDay)(event.start, selectedDate) ? event.start : (0, date_fns_1.startOfDay)(selectedDate);
        // For multi-day events that end after the selected day
        var eventEnd = (0, date_fns_1.isSameDay)(event.end, selectedDate) ? event.end : (0, date_fns_1.endOfDay)(selectedDate);
        var startHour = eventStart.getHours() + eventStart.getMinutes() / 60;
        var endHour = eventEnd.getHours() + eventEnd.getMinutes() / 60;
        var duration = endHour - startHour;
        return {
            top: "".concat(startHour * 60, "px"),
            height: "".concat(Math.max(duration * 60, 30), "px"), // Ensure minimum visibility
        };
    };
    var isMultiDayEvent = function (event) {
        return !(0, date_fns_1.isSameDay)(event.start, event.end);
    };
    var getCurrentTimePosition = function () {
        // Get current Philippines time
        var now = new Date();
        var philippinesTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
        var hours = philippinesTime.getHours();
        var minutes = philippinesTime.getMinutes();
        return {
            top: "".concat(hours * 60 + minutes, "px"),
        };
    };
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
        // Find the background color in the class string
        for (var _i = 0, _a = Object.entries(colorMap); _i < _a.length; _i++) {
            var _b = _a[_i], className = _b[0], color = _b[1];
            if (colorClass.includes(className)) {
                return color;
            }
        }
        return "#FF6961"; // Default coral color
    };
    return (<div className="relative h-full overflow-y-auto bg-white">
      <div className="relative min-h-full">
        <div className="absolute top-0 left-0 w-20 h-full border-r border-gray-200 bg-white z-10">
          {hours.map(function (hour) { return (<div key={hour} className="h-[60px] border-b border-gray-100 flex items-start justify-end pr-3 pt-1">
              <span className="text-sm text-gray-500">{formatHour(hour)}</span>
            </div>); })}
        </div>

        <div className="ml-20 relative">
          {hours.map(function (hour) { return (<div key={hour} className="h-[60px] border-b border-gray-100">
              <div className="w-full h-full"></div>
            </div>); })}

          {/* Current time indicator - show current Philippines time when viewing today */}
          {isToday && (<div className="absolute left-0 right-0 border-t-2 border-rose-500 z-20" style={getCurrentTimePosition()}>
              <div className="absolute -left-2 -top-1.5 w-3 h-3 rounded-full bg-rose-500"></div>
            </div>)}

          {/* Events - Full solid color coverage for time blocks */}
          {dayEvents.map(function (event, index) {
            var position = getEventPosition(event);
            var isMultiDay = isMultiDayEvent(event);
            var backgroundColor = getBackgroundColor(event.color);
            return (<div key={event.id} onClick={function () { return onEventClick === null || onEventClick === void 0 ? void 0 : onEventClick(event); }} className="absolute left-1 right-1 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.01] z-10 border border-white/20" style={__assign(__assign({}, position), { marginLeft: "".concat(index * 6, "px"), backgroundColor: backgroundColor })}>
                {/* Solid color overlay to ensure full coverage */}
                <div className="absolute inset-0 rounded-lg" style={{
                    backgroundColor: backgroundColor,
                    opacity: 0.95,
                }}/>

                {/* Content layer */}
                <div className="relative p-3 h-full flex flex-col justify-start text-white">
                  <div className="text-sm font-bold truncate drop-shadow-md">{event.title}</div>
                  <div className="text-xs mt-1 truncate drop-shadow-md opacity-95">
                    {isMultiDay ? (<>
                        {(0, date_fns_1.format)(event.start, "MMM d")} - {(0, date_fns_1.format)(event.end, "MMM d")}
                      </>) : (<>
                        {(0, date_fns_1.format)(event.start, "h:mm a")} - {(0, date_fns_1.format)(event.end, "h:mm a")}
                      </>)}
                  </div>
                </div>

                {/* Left accent border */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{
                    backgroundColor: backgroundColor,
                    filter: "brightness(0.8)", // Darker shade for accent
                }}/>
              </div>);
        })}
        </div>
      </div>
    </div>);
}
