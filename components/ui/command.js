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
exports.CommandSeparator = exports.CommandShortcut = exports.CommandItem = exports.CommandGroup = exports.CommandEmpty = exports.CommandList = exports.CommandInput = exports.CommandDialog = exports.Command = void 0;
var React = require("react");
var cmdk_1 = require("cmdk");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var dialog_1 = require("@/components/ui/dialog");
var Command = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command ref={ref} className={(0, utils_1.cn)("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className)} {...props}/>);
});
exports.Command = Command;
Command.displayName = cmdk_1.Command.displayName;
var CommandDialog = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (<dialog_1.Dialog {...props}>
      <dialog_1.DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
};
exports.CommandDialog = CommandDialog;
var CommandInput = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <lucide_react_1.Search className="mr-2 h-4 w-4 shrink-0 opacity-50"/>
    <cmdk_1.Command.Input ref={ref} className={(0, utils_1.cn)("flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}/>
  </div>);
});
exports.CommandInput = CommandInput;
CommandInput.displayName = cmdk_1.Command.Input.displayName;
var CommandList = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command.List ref={ref} className={(0, utils_1.cn)("max-h-[300px] overflow-y-auto overflow-x-hidden", className)} {...props}/>);
});
exports.CommandList = CommandList;
CommandList.displayName = cmdk_1.Command.List.displayName;
var CommandEmpty = React.forwardRef(function (props, ref) { return (<cmdk_1.Command.Empty ref={ref} className="py-6 text-center text-sm" {...props}/>); });
exports.CommandEmpty = CommandEmpty;
CommandEmpty.displayName = cmdk_1.Command.Empty.displayName;
var CommandGroup = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command.Group ref={ref} className={(0, utils_1.cn)("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className)} {...props}/>);
});
exports.CommandGroup = CommandGroup;
CommandGroup.displayName = cmdk_1.Command.Group.displayName;
var CommandSeparator = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command.Separator ref={ref} className={(0, utils_1.cn)("-mx-1 h-px bg-border", className)} {...props}/>);
});
exports.CommandSeparator = CommandSeparator;
CommandSeparator.displayName = cmdk_1.Command.Separator.displayName;
var CommandItem = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<cmdk_1.Command.Item ref={ref} className={(0, utils_1.cn)("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className)} {...props}/>);
});
exports.CommandItem = CommandItem;
CommandItem.displayName = cmdk_1.Command.Item.displayName;
var CommandShortcut = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<span className={(0, utils_1.cn)("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props}/>);
};
exports.CommandShortcut = CommandShortcut;
CommandShortcut.displayName = "CommandShortcut";
