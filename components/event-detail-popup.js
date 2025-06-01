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
exports.EventDetailPopup = EventDetailPopup;
var react_1 = require("react");
var date_fns_1 = require("date-fns");
var button_1 = require("@/components/ui/button");
var checkbox_1 = require("@/components/ui/checkbox");
var input_1 = require("@/components/ui/input");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
function EventDetailPopup(_a) {
    var event = _a.event, isOpen = _a.isOpen, onClose = _a.onClose, onDelete = _a.onDelete, onUpdateEvent = _a.onUpdateEvent;
    var _b = (0, react_1.useState)(false), isEditing = _b[0], setIsEditing = _b[1];
    var _c = (0, react_1.useState)(""), title = _c[0], setTitle = _c[1];
    var _d = (0, react_1.useState)(""), description = _d[0], setDescription = _d[1];
    var _e = (0, react_1.useState)([]), todos = _e[0], setTodos = _e[1];
    var _f = (0, react_1.useState)(""), meetingNotes = _f[0], setMeetingNotes = _f[1];
    var _g = (0, react_1.useState)("10"), reminderTime = _g[0], setReminderTime = _g[1];
    var _h = (0, react_1.useState)(""), startDate = _h[0], setStartDate = _h[1];
    var _j = (0, react_1.useState)(""), startTime = _j[0], setStartTime = _j[1];
    var _k = (0, react_1.useState)(""), endDate = _k[0], setEndDate = _k[1];
    var _l = (0, react_1.useState)(""), endTime = _l[0], setEndTime = _l[1];
    // Initialize form when event changes
    (0, react_1.useEffect)(function () {
        if (event) {
            setTitle(event.title);
            setDescription(event.description || "");
            setTodos(event.todos || []);
            setMeetingNotes(event.meetingNotes || "");
            setReminderTime(event.reminderTime || "10");
            // Format dates and times for inputs
            var startDateTime = new Date(event.start);
            var endDateTime = new Date(event.end);
            setStartDate((0, date_fns_1.format)(startDateTime, "yyyy-MM-dd"));
            setStartTime((0, date_fns_1.format)(startDateTime, "HH:mm"));
            setEndDate((0, date_fns_1.format)(endDateTime, "yyyy-MM-dd"));
            setEndTime((0, date_fns_1.format)(endDateTime, "HH:mm"));
        }
    }, [event]);
    if (!isOpen || !event)
        return null;
    var handleDelete = function () {
        if (window.confirm("Are you sure you want to delete \"".concat(event.title, "\"?"))) {
            onDelete(event.id);
            onClose();
        }
    };
    var toggleTodo = function (todoId) {
        var updatedTodos = todos.map(function (todo) { return (todo.id === todoId ? __assign(__assign({}, todo), { completed: !todo.completed }) : todo); });
        setTodos(updatedTodos);
        // Update the event with the new todos immediately
        var updatedEvent = __assign(__assign({}, event), { todos: updatedTodos });
        onUpdateEvent(updatedEvent);
    };
    var handleSave = function () {
        // Combine date and time to create new Date objects
        var newStartDateTime = new Date("".concat(startDate, "T").concat(startTime));
        var newEndDateTime = new Date("".concat(endDate, "T").concat(endTime));
        var updatedEvent = __assign(__assign({}, event), { title: title, description: description, todos: todos, meetingNotes: meetingNotes, reminderTime: reminderTime, start: newStartDateTime, end: newEndDateTime });
        onUpdateEvent(updatedEvent);
        setIsEditing(false);
    };
    var handleEdit = function () {
        setIsEditing(true);
        // Reset form values to current event values
        setTitle(event.title);
        setDescription(event.description || "");
        setTodos(event.todos || []);
        setMeetingNotes(event.meetingNotes || "");
        setReminderTime(event.reminderTime || "10");
    };
    var formatEventDateTime = function (start, end) {
        var startDate = (0, date_fns_1.format)(start, "EEEE, MMMM d");
        var startTime = (0, date_fns_1.format)(start, "h:mm");
        var endTime = (0, date_fns_1.format)(end, "h:mma");
        return "".concat(startDate, " - ").concat(startTime, " - ").concat(endTime);
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header with action buttons */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            {isEditing ? (<button_1.Button variant="ghost" size="icon" onClick={handleSave} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                <lucide_react_1.Save className="h-4 w-4"/>
              </button_1.Button>) : (<button_1.Button variant="ghost" size="icon" onClick={handleEdit} className="text-gray-600 hover:text-gray-800 hover:bg-gray-100">
                <lucide_react_1.Edit className="h-4 w-4"/>
              </button_1.Button>)}
            <button_1.Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <lucide_react_1.Trash2 className="h-4 w-4"/>
            </button_1.Button>
          </div>
          <button_1.Button variant="ghost" size="icon" onClick={onClose} className="text-gray-600 hover:text-gray-800 hover:bg-gray-100">
            <lucide_react_1.X className="h-4 w-4"/>
          </button_1.Button>
        </div>

        {/* Event details */}
        <div className="p-4 space-y-4">
          {/* Event title with color indicator */}
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            {isEditing ? (<input_1.Input value={title} onChange={function (e) { return setTitle(e.target.value); }} className="border-gray-300 text-gray-800 text-xl font-medium focus-visible:ring-blue-500"/>) : (<h2 className="text-xl font-medium text-gray-800">{event.title}</h2>)}
          </div>

          {/* Date and time - Editable */}
          <div className="space-y-3">
            {isEditing ? (<div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Start Date & Time</label>
                  <div className="flex gap-2">
                    <input_1.Input type="date" value={startDate} onChange={function (e) { return setStartDate(e.target.value); }} className="flex-1 text-sm"/>
                    <input_1.Input type="time" value={startTime} onChange={function (e) { return setStartTime(e.target.value); }} className="flex-1 text-sm"/>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">End Date & Time</label>
                  <div className="flex gap-2">
                    <input_1.Input type="date" value={endDate} onChange={function (e) { return setEndDate(e.target.value); }} className="flex-1 text-sm"/>
                    <input_1.Input type="time" value={endTime} onChange={function (e) { return setEndTime(e.target.value); }} className="flex-1 text-sm"/>
                  </div>
                </div>
              </div>) : (<p className="text-gray-600 text-sm">{formatEventDateTime(event.start, event.end)}</p>)}
          </div>

          {/* Additional details */}
          <div className="space-y-3 pt-2">
            {/* Meeting notes - Editable */}
            <div className="flex items-start gap-3">
              <lucide_react_1.FileText className="h-5 w-5 text-gray-500 mt-0.5"/>
              <div className="flex-1">
                <p className="text-gray-800 text-sm font-medium mb-2">Meeting notes</p>
                {isEditing ? (<textarea_1.Textarea value={meetingNotes} onChange={function (e) { return setMeetingNotes(e.target.value); }} placeholder="Add meeting notes..." className="border-gray-300 text-gray-700 text-sm min-h-[80px] focus-visible:ring-blue-500"/>) : (<p className="text-gray-600 text-sm">
                    {event.meetingNotes || "Start a new document to capture notes"}
                  </p>)}
              </div>
            </div>

            {/* Reminder - Editable */}
            <div className="flex items-start gap-3">
              <lucide_react_1.Bell className="h-5 w-5 text-gray-500 mt-0.5"/>
              <div className="flex-1">
                <p className="text-gray-800 text-sm font-medium mb-2">Reminder</p>
                {isEditing ? (<select_1.Select value={reminderTime} onValueChange={setReminderTime}>
                    <select_1.SelectTrigger className="w-full text-sm">
                      <select_1.SelectValue />
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="0">At time of event</select_1.SelectItem>
                      <select_1.SelectItem value="5">5 minutes before</select_1.SelectItem>
                      <select_1.SelectItem value="10">10 minutes before</select_1.SelectItem>
                      <select_1.SelectItem value="15">15 minutes before</select_1.SelectItem>
                      <select_1.SelectItem value="30">30 minutes before</select_1.SelectItem>
                      <select_1.SelectItem value="60">1 hour before</select_1.SelectItem>
                      <select_1.SelectItem value="120">2 hours before</select_1.SelectItem>
                      <select_1.SelectItem value="1440">1 day before</select_1.SelectItem>
                    </select_1.SelectContent>
                  </select_1.Select>) : (<p className="text-gray-600 text-sm">
                    {reminderTime === "0"
                ? "At time of event"
                : reminderTime === "60"
                    ? "1 hour before"
                    : reminderTime === "120"
                        ? "2 hours before"
                        : reminderTime === "1440"
                            ? "1 day before"
                            : "".concat(reminderTime, " minutes before")}
                  </p>)}
              </div>
            </div>

            {/* TO DO Lists - Always show, regardless of editing state */}
            <div className="flex items-start gap-3">
              <lucide_react_1.CheckSquare className="h-5 w-5 text-gray-500 mt-0.5"/>
              <div className="flex-1">
                <p className="text-gray-800 text-sm mb-3 font-medium">TO DO Lists</p>
                {todos && todos.length > 0 ? (<div className="space-y-3">
                    {todos.map(function (todo) { return (<div key={todo.id} className="flex items-center gap-3 group">
                        <checkbox_1.Checkbox checked={todo.completed} onCheckedChange={function () { return toggleTodo(todo.id); }} className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 cursor-pointer h-4 w-4"/>
                        <span className={"text-sm transition-all duration-200 ".concat(todo.completed ? "line-through text-gray-400" : "text-gray-700 hover:text-gray-900")}>
                          {todo.text}
                        </span>
                      </div>); })}
                  </div>) : (<p className="text-gray-500 text-sm italic">No tasks added yet</p>)}
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3 pt-2">
              <lucide_react_1.FileText className="h-5 w-5 text-gray-500 mt-0.5"/>
              <div className="flex-1">
                <p className="text-gray-800 text-sm font-medium mb-2">Description</p>
                {isEditing ? (<textarea_1.Textarea value={description} onChange={function (e) { return setDescription(e.target.value); }} placeholder="Add a description..." className="border-gray-300 text-gray-700 text-sm min-h-[80px] focus-visible:ring-blue-500"/>) : (<p className="text-gray-600 text-sm">{event.description || "No description"}</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
