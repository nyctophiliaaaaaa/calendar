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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarApp = CalendarApp;
var react_1 = require("react");
var date_fns_1 = require("date-fns");
var avatar_1 = require("@/components/ui/avatar");
var button_1 = require("@/components/ui/button");
var calendar_header_1 = require("@/components/calendar-header");
var day_view_1 = require("@/components/day-view");
var week_view_1 = require("@/components/week-view");
var month_view_1 = require("@/components/month-view");
var new_event_modal_1 = require("@/components/new-event-modal");
var event_sidebar_1 = require("@/components/event-sidebar");
var event_detail_popup_1 = require("@/components/event-detail-popup");
var lucide_react_1 = require("lucide-react");
var use_media_query_1 = require("@/hooks/use-media-query");
function CalendarApp() {
    // Set today to June 1, 2025 as requested
    var actualToday = new Date(2025, 5, 1); // June 1, 2025 (month is 0-indexed)
    var _a = (0, react_1.useState)(actualToday), currentDate = _a[0], setCurrentDate = _a[1];
    var _b = (0, react_1.useState)(actualToday), selectedDate = _b[0], setSelectedDate = _b[1];
    var _c = (0, react_1.useState)("month"), view = _c[0], setView = _c[1];
    var _d = (0, react_1.useState)(false), isNewEventModalOpen = _d[0], setIsNewEventModalOpen = _d[1];
    var _e = (0, react_1.useState)(false), isSidebarOpen = _e[0], setIsSidebarOpen = _e[1];
    var _f = (0, react_1.useState)(null), selectedEvent = _f[0], setSelectedEvent = _f[1];
    var _g = (0, react_1.useState)(false), isEventDetailOpen = _g[0], setIsEventDetailOpen = _g[1];
    var _h = (0, react_1.useState)([]), events = _h[0], setEvents = _h[1]; // Initialize with empty array - no preset events
    var isMobile = (0, use_media_query_1.useMediaQuery)("(max-width: 640px)");
    var _j = (0, react_1.useState)(false), isLogoutPopupOpen = _j[0], setIsLogoutPopupOpen = _j[1];
    var goToToday = function () {
        setCurrentDate(actualToday);
        setSelectedDate(actualToday);
    };
    var handleDateClick = function (date) {
        setCurrentDate(date);
        setSelectedDate(date);
    };
    var handleEventClick = function (event) {
        setSelectedEvent(event);
        setIsEventDetailOpen(true);
    };
    var goToNextPeriod = function () {
        if (view === "day") {
            setCurrentDate((0, date_fns_1.addDays)(currentDate, 1));
        }
        else if (view === "week") {
            setCurrentDate((0, date_fns_1.addWeeks)(currentDate, 1));
        }
        else {
            setCurrentDate((0, date_fns_1.addMonths)(currentDate, 1));
        }
    };
    var goToPreviousPeriod = function () {
        if (view === "day") {
            setCurrentDate((0, date_fns_1.subDays)(currentDate, 1));
        }
        else if (view === "week") {
            setCurrentDate((0, date_fns_1.subWeeks)(currentDate, 1));
        }
        else {
            setCurrentDate((0, date_fns_1.subMonths)(currentDate, 1));
        }
    };
    var handleSignOut = function () {
        setIsLogoutPopupOpen(true);
    };
    var handleConfirmLogout = function () {
        // Add actual sign out logic here
        console.log("User confirmed logout");
        setIsLogoutPopupOpen(false);
        // You can add redirect logic or other logout actions here
    };
    var handleNewEvent = function () {
        setIsNewEventModalOpen(true);
    };
    var handleToggleSidebar = function () {
        setIsSidebarOpen(!isSidebarOpen);
    };
    var handleDeleteEvent = function (eventId) {
        setEvents(function (prev) { return prev.filter(function (event) { return event.id !== eventId; }); });
    };
    var handleUpdateEvent = function (updatedEvent) {
        setEvents(function (prev) { return prev.map(function (event) { return (event.id === updatedEvent.id ? updatedEvent : event); }); });
        setSelectedEvent(updatedEvent);
    };
    var handleEditEvent = function (event) {
        // For now, just open the new event modal
        // In a full implementation, you'd populate the modal with existing event data
        setIsNewEventModalOpen(true);
    };
    // Function to generate recurring events
    var generateRecurringEvents = function (baseEvent, repeatType) {
        if (repeatType === "never") {
            return [baseEvent];
        }
        var recurringEvents = [baseEvent];
        var maxOccurrences = 52; // Limit to 52 occurrences to prevent infinite events
        for (var i = 1; i < maxOccurrences; i++) {
            var newStartDate = void 0;
            var newEndDate = void 0;
            var duration = baseEvent.end.getTime() - baseEvent.start.getTime();
            switch (repeatType) {
                case "daily":
                    newStartDate = (0, date_fns_1.addDays)(baseEvent.start, i);
                    newEndDate = new Date(newStartDate.getTime() + duration);
                    break;
                case "weekly":
                    newStartDate = (0, date_fns_1.addWeeks)(baseEvent.start, i);
                    newEndDate = new Date(newStartDate.getTime() + duration);
                    break;
                case "monthly":
                    newStartDate = (0, date_fns_1.addMonths)(baseEvent.start, i);
                    newEndDate = new Date(newStartDate.getTime() + duration);
                    break;
                case "yearly":
                    newStartDate = (0, date_fns_1.addYears)(baseEvent.start, i);
                    newEndDate = new Date(newStartDate.getTime() + duration);
                    break;
                default:
                    continue;
            }
            // Create recurring event
            var recurringEvent = __assign(__assign({}, baseEvent), { id: "".concat(baseEvent.id, "-recurring-").concat(i), start: newStartDate, end: newEndDate, originalDate: baseEvent.start });
            recurringEvents.push(recurringEvent);
        }
        return recurringEvents;
    };
    // Function to check if two time periods overlap
    var checkTimeOverlap = function (start1, end1, start2, end2) {
        return start1 < end2 && start2 < end1;
    };
    // Function to validate if a new event overlaps with existing events
    var validateEventTime = function (newStart, newEnd) {
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var existingEvent = events_1[_i];
            if (checkTimeOverlap(newStart, newEnd, existingEvent.start, existingEvent.end)) {
                return {
                    isValid: false,
                    conflictingEvent: existingEvent,
                };
            }
        }
        return { isValid: true };
    };
    var handleSaveEvent = function (eventData) {
        var newStart = new Date(eventData.startDate);
        var newEnd = new Date(eventData.endDate);
        // Validate that end time is after start time
        if (newEnd <= newStart) {
            alert("End time must be after start time.");
            return { success: false, error: "End time must be after start time." };
        }
        // Check for overlapping events (only for the base event, not recurring ones)
        var validation = validateEventTime(newStart, newEnd);
        if (!validation.isValid && validation.conflictingEvent) {
            var conflictStart = validation.conflictingEvent.start.toLocaleString();
            var conflictEnd = validation.conflictingEvent.end.toLocaleString();
            alert("This event overlaps with \"".concat(validation.conflictingEvent.title, "\" (").concat(conflictStart, " - ").concat(conflictEnd, "). Please choose a different time."));
            return { success: false, error: "Event time conflicts with existing event." };
        }
        // Create base event
        var baseEvent = {
            id: Date.now().toString(),
            title: eventData.title,
            start: newStart,
            end: newEnd,
            color: eventData.color,
            description: eventData.notes,
            todos: eventData.todos || [],
            meetingNotes: "",
            reminderTime: "10",
            repeat: eventData.repeat,
            originalDate: newStart,
        };
        // Generate recurring events based on repeat setting
        var allEvents = generateRecurringEvents(baseEvent, eventData.repeat);
        // Add all events to the calendar
        setEvents(function (prev) { return __spreadArray(__spreadArray([], prev, true), allEvents, true); });
        // Open the sidebar to show the new event
        setIsSidebarOpen(true);
        return { success: true };
    };
    return (<div className="flex h-screen max-h-screen overflow-hidden bg-white">
      {/* Event Sidebar - only show when isSidebarOpen is true */}
      {isSidebarOpen && (<event_sidebar_1.EventSidebar selectedDate={selectedDate} events={events} onNewEvent={handleNewEvent} onDeleteEvent={handleDeleteEvent} onEventClick={handleEventClick}/>)}

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button_1.Button variant="ghost" size="icon" onClick={handleToggleSidebar} className="text-gray-600 hover:bg-gray-300 h-10 w-10">
              <lucide_react_1.Menu className="h-5 w-5"/>
            </button_1.Button>
            <button_1.Button variant="ghost" size="icon" onClick={handleNewEvent} className="text-red-500 hover:bg-gray-300 h-10 w-10">
              <lucide_react_1.Plus className="h-5 w-5"/>
            </button_1.Button>
          </div>

          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full flex overflow-hidden">
              <button_1.Button variant={view === "day" ? "default" : "ghost"} onClick={function () { return setView("day"); }} className={"rounded-l-full px-6 py-2 text-sm ".concat(view === "day" ? "bg-white text-white sm:text-gray-800 shadow-sm" : "bg-transparent text-gray-600")}>
                Day
              </button_1.Button>
              <button_1.Button variant={view === "week" ? "default" : "ghost"} onClick={function () { return setView("week"); }} className={"px-6 py-2 text-sm ".concat(view === "week" ? "bg-white text-white sm:text-gray-800 shadow-sm" : "bg-transparent text-gray-600")}>
                Week
              </button_1.Button>
              <button_1.Button variant={view === "month" ? "default" : "ghost"} onClick={function () { return setView("month"); }} className={"rounded-r-full px-6 py-2 text-sm ".concat(view === "month" ? "bg-white text-white sm:text-gray-800 shadow-sm" : "bg-transparent text-gray-600")}>
                Month
              </button_1.Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
              <avatar_1.Avatar className="h-8 w-8">
                <avatar_1.AvatarImage src="/placeholder-user.jpg"/>
                <avatar_1.AvatarFallback className="bg-gray-300 text-gray-600 text-sm">U</avatar_1.AvatarFallback>
              </avatar_1.Avatar>
              <span className="text-sm text-gray-700">username@gmail.com</span>
            </div>
            <button_1.Button variant="ghost" size="icon" className="sm:hidden">
              <avatar_1.Avatar className="h-8 w-8">
                <avatar_1.AvatarImage src="/placeholder-user.jpg"/>
                <avatar_1.AvatarFallback className="bg-gray-300 text-gray-600">U</avatar_1.AvatarFallback>
              </avatar_1.Avatar>
            </button_1.Button>
            <div className="flex items-center gap-3">
              <button_1.Button variant="ghost" onClick={goToToday} className="text-red-500 hover:bg-gray-300">
                Today
              </button_1.Button>
              <button_1.Button variant="ghost" size="icon" onClick={handleSignOut} className="text-gray-600 hover:bg-gray-300 h-8 w-8">
                <lucide_react_1.LogOut className="h-5 w-5"/>
              </button_1.Button>
            </div>
          </div>
        </header>

        {/* Calendar Header - only show for day view */}
        {view === "day" && (<calendar_header_1.CalendarHeader currentDate={currentDate} view={view} onPrevious={goToPreviousPeriod} onNext={goToNextPeriod} onToday={goToToday} onDateClick={handleDateClick}/>)}

        {/* Month/Year header for week and month views */}
        {(view === "week" || view === "month") && (<div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-gray-900">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h1>
              <div className="flex items-center gap-2">
                <button_1.Button variant="ghost" onClick={goToPreviousPeriod} size="icon">
                  <lucide_react_1.ChevronLeft className="h-5 w-5"/>
                </button_1.Button>
                <button_1.Button variant="ghost" onClick={goToNextPeriod} size="icon">
                  <lucide_react_1.ChevronRight className="h-5 w-5"/>
                </button_1.Button>
              </div>
            </div>
          </div>)}

        {/* Calendar Content */}
        <div className="flex-1 overflow-hidden">
          {view === "day" && (<day_view_1.DayView currentDate={currentDate} selectedDate={selectedDate} events={events} onEventClick={handleEventClick}/>)}
          {view === "week" && (<week_view_1.WeekView currentDate={currentDate} selectedDate={selectedDate} events={events} onDateClick={handleDateClick} onEventClick={handleEventClick}/>)}
          {view === "month" && (<month_view_1.MonthView currentDate={currentDate} events={events} onDateClick={handleDateClick} onEventClick={handleEventClick}/>)}
        </div>
      </div>

      {/* New Event Modal */}
      <new_event_modal_1.NewEventModal isOpen={isNewEventModalOpen} onClose={function () { return setIsNewEventModalOpen(false); }} onSave={handleSaveEvent}/>

      {/* Event Detail Popup */}
      <event_detail_popup_1.EventDetailPopup event={selectedEvent} isOpen={isEventDetailOpen} onClose={function () { return setIsEventDetailOpen(false); }} onEdit={handleEditEvent} onDelete={handleDeleteEvent} onUpdateEvent={handleUpdateEvent}/>

      {/* Logout Confirmation Popup */}
      {isLogoutPopupOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Log Out</h2>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>

              {/* User info */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 mb-6">
                <avatar_1.Avatar className="h-10 w-10">
                  <avatar_1.AvatarImage src="/placeholder-user.jpg"/>
                  <avatar_1.AvatarFallback className="bg-gray-300 text-gray-600">U</avatar_1.AvatarFallback>
                </avatar_1.Avatar>
                <div>
                  <p className="font-medium text-gray-900">User</p>
                  <p className="text-sm text-gray-500">username@gmail.com</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button_1.Button variant="outline" onClick={function () { return setIsLogoutPopupOpen(false); }} className="flex-1">
                  Cancel
                </button_1.Button>
                <button_1.Button onClick={handleConfirmLogout} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                  Log Out
                </button_1.Button>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
}
