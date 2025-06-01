"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
var calendar_app_1 = require("@/components/calendar-app");
function Home() {
    return (<main className="min-h-screen bg-white">
      <calendar_app_1.CalendarApp />
    </main>);
}
