"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
require("./globals.css");
exports.metadata = {
    title: 'Kalendaryo',
    description: '',
    generator: '',
};
function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="en">
      <body>{children}</body>
    </html>);
}
