"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X } from "lucide-react"

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

interface NewEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: any) => { success: boolean; error?: string }
}

// Color options for events
const EVENT_COLORS = [
  { name: "Coral", value: "bg-[#FF6961] border-[#FF6961] border-opacity-50 text-white", color: "#FF6961" },
  { name: "Lavender", value: "bg-[#B19CD9] border-[#B19CD9] border-opacity-50 text-white", color: "#B19CD9" },
  { name: "Mint", value: "bg-[#77DD77] border-[#77DD77] border-opacity-50 text-white", color: "#77DD77" },
  { name: "Peach", value: "bg-[#FFB347] border-[#FFB347] border-opacity-50 text-white", color: "#FFB347" },
  { name: "Sky Blue", value: "bg-[#87CEEB] border-[#87CEEB] border-opacity-50 text-white", color: "#87CEEB" },
  { name: "Rose", value: "bg-[#F8BBD9] border-[#F8BBD9] border-opacity-50 text-gray-800", color: "#F8BBD9" },
  { name: "Lemon", value: "bg-[#FDFD96] border-[#FDFD96] border-opacity-50 text-gray-800", color: "#FDFD96" },
  { name: "Sage", value: "bg-[#9CAF88] border-[#9CAF88] border-opacity-50 text-white", color: "#9CAF88" },
]

export function NewEventModal({ isOpen, onClose, onSave }: NewEventModalProps) {
  const [title, setTitle] = useState("")
  const [allDay, setAllDay] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [repeat, setRepeat] = useState("never")
  const [notes, setNotes] = useState("")
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodoText, setNewTodoText] = useState("")
  const [selectedColor, setSelectedColor] = useState(EVENT_COLORS[0]) // Default to coral
  const [error, setError] = useState("")

  const handleSave = () => {
    // Clear any previous errors
    setError("")

    // Basic validation
    if (!title.trim()) {
      setError("Title is required.")
      return
    }

    if (!startDate) {
      setError("Start date is required.")
      return
    }

    if (!endDate) {
      setError("End date is required.")
      return
    }

    if (!allDay) {
      if (!startTime) {
        setError("Start time is required.")
        return
      }
      if (!endTime) {
        setError("End time is required.")
        return
      }
    }

    // Combine date and time for datetime-local format
    let startDateTime, endDateTime

    if (allDay) {
      // For all-day events, use the date with default times
      startDateTime = `${startDate}T00:00`
      endDateTime = `${endDate}T23:59`
    } else {
      // Combine date and time
      startDateTime = `${startDate}T${startTime}`
      endDateTime = `${endDate}T${endTime}`
    }

    const eventData = {
      title,
      allDay,
      startDate: startDateTime,
      endDate: endDateTime,
      repeat,
      notes,
      todos,
      color: selectedColor.value,
    }

    const result = onSave(eventData)

    if (result.success) {
      handleCancel()
    } else {
      setError(result.error || "Failed to save event.")
    }
  }

  const handleCancel = () => {
    // Reset form
    setTitle("")
    setAllDay(false)
    setStartDate("")
    setStartTime("")
    setEndDate("")
    setEndTime("")
    setRepeat("never")
    setNotes("")
    setTodos([])
    setNewTodoText("")
    setSelectedColor(EVENT_COLORS[0])
    setError("")
    onClose()
  }

  // Set default times when switching from all-day to timed event
  const handleAllDayToggle = (checked: boolean) => {
    setAllDay(checked)
    if (!checked && !startTime && !endTime) {
      // Set default times if none are set
      setStartTime("09:00")
      setEndTime("10:00")
    }
  }

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
      }
      setTodos([...todos, newTodo])
      setNewTodoText("")
    }
  }

  const removeTodo = (todoId: string) => {
    setTodos(todos.filter((todo) => todo.id !== todoId))
  }

  const toggleTodo = (todoId: string) => {
    setTodos(todos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      {/* Modal */}
      <div className="bg-white w-80 h-full shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 px-0"
          >
            Cancel
          </Button>
          <h2 className="text-lg font-medium text-gray-900">New Event</h2>
          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-0"
            variant="ghost"
          >
            Add
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Title */}
          <div>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-0 border-b border-gray-200 rounded-none px-0 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-gray-400"
            />
          </div>

          {/* Color Selection */}
          <div>
            <Label className="text-base text-gray-700 block mb-3">Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {EVENT_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105
                    ${selectedColor.name === color.name ? "border-gray-800 ring-2 ring-gray-300" : "border-gray-200"}
                  `}
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">Selected: {selectedColor.name}</p>
          </div>

          {/* All day toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="all-day" className="text-base text-gray-700">
              All day
            </Label>
            <Switch
              id="all-day"
              checked={allDay}
              onCheckedChange={handleAllDayToggle}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          {/* Start date and time */}
          <div>
            <Label className="text-base text-gray-700 block mb-2">Starts</Label>
            <div className="space-y-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-0 border-b border-gray-200 rounded-none px-0 text-base focus-visible:ring-0 focus-visible:border-gray-400"
              />
              {!allDay && (
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border-0 border-b border-gray-200 rounded-none px-0 text-base focus-visible:ring-0 focus-visible:border-gray-400"
                />
              )}
            </div>
          </div>

          {/* End date and time */}
          <div>
            <Label className="text-base text-gray-700 block mb-2">Ends</Label>
            <div className="space-y-2">
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-0 border-b border-gray-200 rounded-none px-0 text-base focus-visible:ring-0 focus-visible:border-gray-400"
              />
              {!allDay && (
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border-0 border-b border-gray-200 rounded-none px-0 text-base focus-visible:ring-0 focus-visible:border-gray-400"
                />
              )}
            </div>
          </div>

          {/* Repeat */}
          <div>
            <Label className="text-base text-gray-700 block mb-2">Repeat</Label>
            <Select value={repeat} onValueChange={setRepeat}>
              <SelectTrigger className="border-0 border-b border-gray-200 rounded-none px-0 text-base focus:ring-0 focus:border-gray-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Attachment */}
          <div>
            <Button
              variant="ghost"
              className="text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-0 h-auto py-2 justify-start"
            >
              Add Attachment...
            </Button>
          </div>

          {/* TO DO Lists */}
          <div>
            <Label className="text-base text-gray-700 block mb-3">TO DO Lists</Label>

            {/* Existing todos */}
            <div className="space-y-2 mb-3">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-2 group">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <span className={`flex-1 text-sm ${todo.completed ? "line-through text-gray-500" : "text-gray-700"}`}>
                    {todo.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add new todo */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add a task..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-0 border-b border-gray-200 rounded-none px-0 text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-gray-400"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={addTodo}
                disabled={!newTodoText.trim()}
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Textarea
              placeholder="NOTES"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-0 border-b border-gray-200 rounded-none px-0 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-gray-400 resize-none min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Backdrop - click to close */}
      <div className="flex-1" onClick={onClose} />
    </div>
  )
}
