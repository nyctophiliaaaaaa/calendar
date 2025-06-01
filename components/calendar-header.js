"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarHeader = CalendarHeader;
var date_fns_1 = require("date-fns");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
function CalendarHeader(_a) {
    var currentDate = _a.currentDate, view = _a.view, onPrevious = _a.onPrevious, onNext = _a.onNext, onToday = _a.onToday, onDateClick = _a.onDateClick;
    var actualToday = new Date(2025, 5, 1); // June 1, 2025
    var renderWeekView = function () {
        if (view !== "day" && view !== "week")
            return null;
        var weekStart = (0, date_fns_1.startOfWeek)(currentDate, { weekStartsOn: 0 });
        var days = [];
        var _loop_1 = function (i) {
            var day = (0, date_fns_1.addDays)(weekStart, i);
            var isCurrentDay = (0, date_fns_1.isSameDay)(day, currentDate);
            days.push(<div key={i} className="flex flex-col items-center">
          <div className="text-gray-500 text-base mb-3">{(0, date_fns_1.format)(day, "EEE")}</div>
          <button onClick={function () { return onDateClick === null || onDateClick === void 0 ? void 0 : onDateClick(day); }} className={"\n              flex items-center justify-center w-12 h-12 rounded-full text-lg font-medium transition-colors\n              ".concat(isCurrentDay ? "bg-rose-500 text-white" : "text-gray-800 hover:bg-gray-100", "\n            ")}>
            {(0, date_fns_1.format)(day, "d")}
          </button>
        </div>);
        };
        for (var i = 0; i < 7; i++) {
            _loop_1(i);
        }
        return (<div className="mt-8">
        <div className="flex items-center justify-between px-4">
          <button_1.Button variant="ghost" onClick={onPrevious} size="icon" className="text-rose-500 hover:bg-transparent">
            <lucide_react_1.ChevronLeft className="h-6 w-6"/>
          </button_1.Button>

          <div className="flex justify-between w-full px-8 mx-auto">{days}</div>

          <button_1.Button variant="ghost" onClick={onNext} size="icon" className="text-rose-500 hover:bg-transparent">
            <lucide_react_1.ChevronRight className="h-6 w-6"/>
          </button_1.Button>
        </div>

        <div className="text-center text-gray-700 text-lg mt-8 border-t border-gray-100 pt-4">
          {(0, date_fns_1.format)(currentDate, "EEEE, MMMM d, yyyy")}
        </div>
      </div>);
    };
    var getHeaderText = function () {
        return (0, date_fns_1.format)(currentDate, "MMMM yyyy");
    };
    return (<div className="px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold text-gray-900">{getHeaderText()}</h1>
        <div className="flex items-center gap-2">
          {view === "month" && (<>
              <button_1.Button variant="ghost" onClick={onPrevious} size="icon">
                <lucide_react_1.ChevronLeft className="h-5 w-5"/>
              </button_1.Button>
              <button_1.Button variant="ghost" onClick={onNext} size="icon">
                <lucide_react_1.ChevronRight className="h-5 w-5"/>
              </button_1.Button>
            </>)}
          {/* Removed the duplicate Today button from here */}
        </div>
      </div>
      {renderWeekView()}
    </div>);
}
