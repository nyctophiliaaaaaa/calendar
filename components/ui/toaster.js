"use client";
"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toaster = Toaster;
var use_toast_1 = require("@/hooks/use-toast");
var toast_1 = require("@/components/ui/toast");
function Toaster() {
    var toasts = (0, use_toast_1.useToast)().toasts;
    return (<toast_1.ToastProvider>
      {toasts.map(function (_a) {
            var id = _a.id, title = _a.title, description = _a.description, action = _a.action, props = __rest(_a, ["id", "title", "description", "action"]);
            return (<toast_1.Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <toast_1.ToastTitle>{title}</toast_1.ToastTitle>}
              {description && (<toast_1.ToastDescription>{description}</toast_1.ToastDescription>)}
            </div>
            {action}
            <toast_1.ToastClose />
          </toast_1.Toast>);
        })}
      <toast_1.ToastViewport />
    </toast_1.ToastProvider>);
}
