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
exports.NewEventModal = NewEventModal;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var switch_1 = require("@/components/ui/switch");
var select_1 = require("@/components/ui/select");
var textarea_1 = require("@/components/ui/textarea");
var checkbox_1 = require("@/components/ui/checkbox");
var lucide_react_1 = require("lucide-react");
// Color options for events
var EVENT_COLORS = [
    { name: "Coral", value: "bg-[#FF6961] border-[#FF6961] border-opacity-50 text-white", color: "#FF6961" },
    { name: "Lavender", value: "bg-[#B19CD9] border-[#B19CD9] border-opacity-50 text-white", color: "#B19CD9" },
    { name: "Mint", value: "bg-[#77DD77] border-[#77DD77] border-opacity-50 text-white", color: "#77DD77" },
    { name: "Peach", value: "bg-[#FFB347] border-[#FFB347] border-opacity-50 text-white", color: "#FFB347" },
    { name: "Sky Blue", value: "bg-[#87CEEB] border-[#87CEEB] border-opacity-50 text-white", color: "#87CEEB" },
    { name: "Rose", value: "bg-[#F8BBD9] border-[#F8BBD9] border-opacity-50 text-gray-800", color: "#F8BBD9" },
    { name: "Lemon", value: "bg-[#FDFD96] border-[#FDFD96] border-opacity-50 text-gray-800", color: "#FDFD96" },
    { name: "Sage", value: "bg-[#9CAF88] border-[#9CAF88] border-opacity-50 text-white", color: "#9CAF88" },
];
function NewEventModal(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onSave = _a.onSave;
    var _b = (0, react_1.useState)(""), title = _b[0], setTitle = _b[1];
    var _c = (0, react_1.useState)(false), allDay = _c[0], setAllDay = _c[1];
    var _d = (0, react_1.useState)(""), startDate = _d[0], setStartDate = _d[1];
    var _e = (0, react_1.useState)(""), startTime = _e[0], setStartTime = _e[1];
    var _f = (0, react_1.useState)(""), endDate = _f[0], setEndDate = _f[1];
    var _g = (0, react_1.useState)(""), endTime = _g[0], setEndTime = _g[1];
    var _h = (0, react_1.useState)("never"), repeat = _h[0], setRepeat = _h[1];
    var _j = (0, react_1.useState)(""), notes = _j[0], setNotes = _j[1];
    var _k = (0, react_1.useState)([]), todos = _k[0], setTodos = _k[1];
    var _l = (0, react_1.useState)(""), newTodoText = _l[0], setNewTodoText = _l[1];
    var _m = (0, react_1.useState)(EVENT_COLORS[0]), selectedColor = _m[0], setSelectedColor = _m[1]; // Default to coral
    var _o = (0, react_1.useState)(""), error = _o[0], setError = _o[1];
    var handleSave = function () {
        // Clear any previous errors
        setError("");
        // Basic validation
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }
        if (!startDate) {
            setError("Start date is required.");
            return;
        }
        if (!endDate) {
            setError("End date is required.");
            return;
        }
        if (!allDay) {
            if (!startTime) {
                setError("Start time is required.");
                return;
            }
            if (!endTime) {
                setError("End time is required.");
                return;
            }
        }
        // Combine date and time for datetime-local format
        var startDateTime, endDateTime;
        if (allDay) {
            // For all-day events, use the date with default times
            startDateTime = "".concat(startDate, "T00:00");
            endDateTime = "".concat(endDate, "T23:59");
        }
        else {
            // Combine date and time
            startDateTime = "".concat(startDate, "T").concat(startTime);
            endDateTime = "".concat(endDate, "T").concat(endTime);
        }
        var eventData = {
            title: title,
            allDay: allDay,
            startDate: startDateTime,
            endDate: endDateTime,
            repeat: repeat,
            notes: notes,
            todos: todos,
            color: selectedColor.value,
        };
        var result = onSave(eventData);
        if (result.success) {
            handleCancel();
        }
        else {
            setError(result.error || "Failed to save event.");
        }
    };
    var handleCancel = function () {
        // Reset form
        setTitle("");
        setAllDay(false);
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
        setRepeat("never");
        setNotes("");
        setTodos([]);
        setNewTodoText("");
        setSelectedColor(EVENT_COLORS[0]);
        setError("");
        onClose();
    };
    // Set default times when switching from all-day to timed event
    var handleAllDayToggle = function (checked) {
        setAllDay(checked);
        if (!checked && !startTime && !endTime) {
            // Set default times if none are set
            setStartTime("09:00");
            setEndTime("10:00");
        }
    };
    var addTodo = function () {
        if (newTodoText.trim()) {
            var newTodo = {
                id: Date.now().toString(),
                text: newTodoText.trim(),
                completed: false,
            };
            setTodos(__spreadArray(__spreadArray([], todos, true), [newTodo], false));
            setNewTodoText("");
        }
    };
    var removeTodo = function (todoId) {
        setTodos(todos.filter(function (todo) { return todo.id !== todoId; }));
    };
    var toggleTodo = function (todoId) {
        setTodos(todos.map(function (todo) { return (todo.id === todoId ? __assign(__assign({}, todo), { completed: !todo.completed }) : todo); }));
    };
    var handleKeyPress = function (e) {
        if (e.key === "Enter") {
            addTodo();
        }
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      {/* Modal */}
      <div className="bg-white w-80 h-full shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button_1.Button variant="ghost" onClick={handleCancel} className="text-red-500 hover:text-red-600 hover:bg-red-50 px-0">
            Cancel
          </button_1.Button>
          <h2 className="text-lg font-medium text-gray-900">New Event</h2>
          <button_1.Button onClick={handleSave} disabled={!title.trim()} className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-0" variant="ghost">
            Add
          </button_1.Button>
        </div>

        {/* Error Message */}
        {error && (<div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>)}

        {/* Form Content */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Title */}
          <div>
            <input_1.Input placeholder="Title" value={title} onChange={function (e) { return setTitle(e.target.value); }} className="border-0 border-b border-gray-200 rounded-none px-0 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-gray-400"/>
          </div>

          {/* Color Selection */}
          <div>
            <label_1.Label className="text-base text-gray-700 block mb-3">Color</label_1.Label>
            <div className="grid grid-cols-4 gap-2">
              {EVENT_COLORS.map(function (color) { return (<button key={color.name} type="button" onClick={function () { return setSelectedColor(color); }} className={"\n                    w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105\n                    ".concat(selectedColor.name === color.name ? "border-gray-800 ring-2 ring-gray-300" : "border-gray-200", "\n                  ")} style={{ backgroundColor: color.color }} title={color.name}/>); })}
            </div>
            <p className="text-sm text-gray-500 mt-2">Selected: {selectedColor.name}</p>
          </div>

          {/* All day toggle */}
          <div className="flex items-center justify-between">
            <label_1.Label htmlFor="all-day" className="text-base text-gray-700">
              All day
            </label_1.Label>
            <switch_1.Switch id="all-day" checked={allDay} onCheckedChange={handleAllDayToggle} className="data-[state=checked]:bg-green-500"/>
          </div>

          {/* Start date and time */}
          <div>
            <label_1.Label className="text-base text-gray-700 block mb-2">Starts</label_1.Label>
            <div className="space-y-2">
              <input_1.Input type="date" value={startDate} onChange={function (e) { return setStartDate(e.target.value); }} className="border-0 border-b border-gray-200 rounded-none px-0 text-base focus-visible:ring-0 focus-visible:border-gray-400"/>
              {!allDay && (<input_1.Input type="time" value={startTime} onChange={function (e) { return setStartTime(e.target.value); }} className="border-0 border-b border-gray-200 rounded-none px-0 text-base focus-visible:ring-0 focus-visible:border-gray-400"/>)}
            </div>
          </div>

          {/* End date and time */}
          <div>
            <label_1.Label className="text-base text-gray-700 block mb-2">Ends</label_1.Label>
            <div className="space-y-2">
              <input_1.Input type="date" value={endDate} onChange={function (e) { return setEndDate(e.target.value); }} className="border-0 border-b border-gray-200 rounded-none px-0 text-base focus-visible:ring-0 focus-visible:border-gray-400"/>
              {!allDay && (<input_1.Input type="time" value={endTime} onChange={function (e) { return setEndTime(e.target.value); }} className="border-0 border-b border-gray-200 rounded-none px-0 text-base focus-visible:ring-0 focus-visible:border-gray-400"/>)}
            </div>
          </div>

          {/* Repeat */}
          <div>
            <label_1.Label className="text-base text-gray-700 block mb-2">Repeat</label_1.Label>
            <select_1.Select value={repeat} onValueChange={setRepeat}>
              <select_1.SelectTrigger className="border-0 border-b border-gray-200 rounded-none px-0 text-base focus:ring-0 focus:border-gray-400">
                <select_1.SelectValue />
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="never">Never</select_1.SelectItem>
                <select_1.SelectItem value="daily">Daily</select_1.SelectItem>
                <select_1.SelectItem value="weekly">Weekly</select_1.SelectItem>
                <select_1.SelectItem value="monthly">Monthly</select_1.SelectItem>
                <select_1.SelectItem value="yearly">Yearly</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>

          {/* Add Attachment */}
          <div>
            <button_1.Button variant="ghost" className="text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-0 h-auto py-2 justify-start">
              Add Attachment...
            </button_1.Button>
          </div>

          {/* TO DO Lists */}
          <div>
            <label_1.Label className="text-base text-gray-700 block mb-3">TO DO Lists</label_1.Label>

            {/* Existing todos */}
            <div className="space-y-2 mb-3">
              {todos.map(function (todo) { return (<div key={todo.id} className="flex items-center gap-2 group">
                  <checkbox_1.Checkbox checked={todo.completed} onCheckedChange={function () { return toggleTodo(todo.id); }} className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"/>
                  <span className={"flex-1 text-sm ".concat(todo.completed ? "line-through text-gray-500" : "text-gray-700")}>
                    {todo.text}
                  </span>
                  <button_1.Button variant="ghost" size="icon" onClick={function () { return removeTodo(todo.id); }} className="opacity-0 group-hover:opacity-100 h-6 w-6 text-gray-400 hover:text-red-500">
                    <lucide_react_1.X className="h-3 w-3"/>
                  </button_1.Button>
                </div>); })}
            </div>

            {/* Add new todo */}
            <div className="flex items-center gap-2">
              <input_1.Input placeholder="Add a task..." value={newTodoText} onChange={function (e) { return setNewTodoText(e.target.value); }} onKeyPress={handleKeyPress} className="border-0 border-b border-gray-200 rounded-none px-0 text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-gray-400"/>
              <button_1.Button variant="ghost" size="icon" onClick={addTodo} disabled={!newTodoText.trim()} className="h-6 w-6 text-gray-400 hover:text-gray-600">
                <lucide_react_1.Plus className="h-3 w-3"/>
              </button_1.Button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <textarea_1.Textarea placeholder="NOTES" value={notes} onChange={function (e) { return setNotes(e.target.value); }} className="border-0 border-b border-gray-200 rounded-none px-0 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-gray-400 resize-none min-h-[80px]"/>
          </div>
        </div>
      </div>

      {/* Backdrop - click to close */}
      <div className="flex-1" onClick={onClose}/>
    </div>);
}
