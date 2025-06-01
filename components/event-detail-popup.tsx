"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Trash2, FileText, Bell, CheckSquare, Save, Edit } from "lucide-react"
import type { Event } from "@/components/calendar-app"

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

interface EventDetailPopupProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
  onUpdateEvent: (updatedEvent: Event) => void
}

export function EventDetailPopup({ event, isOpen, onClose, onDelete, onUpdateEvent }: EventDetailPopupProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [meetingNotes, setMeetingNotes] = useState("")
  const [reminderTime, setReminderTime] = useState("10")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")

  // Initialize form when event changes
  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description || "")
      setTodos(event.todos || [])
      setMeetingNotes(event.meetingNotes || "")
      setReminderTime(event.reminderTime || "10")

      // Format dates and times for inputs
      const startDateTime = new Date(event.start)
      const endDateTime = new Date(event.end)

      setStartDate(format(startDateTime, "yyyy-MM-dd"))
      setStartTime(format(startDateTime, "HH:mm"))
      setEndDate(format(endDateTime, "yyyy-MM-dd"))
      setEndTime(format(endDateTime, "HH:mm"))
    }
  }, [event])

  if (!isOpen || !event) return null

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      onDelete(event.id)
      onClose()
    }
  }

  const toggleTodo = (todoId: string) => {
    const updatedTodos = todos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo))
    setTodos(updatedTodos)

    // Update the event with the new todos immediately
    const updatedEvent = {
      ...event,
      todos: updatedTodos,
    }
    onUpdateEvent(updatedEvent)
  }

  const handleSave = () => {
    // Combine date and time to create new Date objects
    const newStartDateTime = new Date(`${startDate}T${startTime}`)
    const newEndDateTime = new Date(`${endDate}T${endTime}`)

    const updatedEvent = {
      ...event,
      title,
      description,
      todos,
      meetingNotes,
      reminderTime,
      start: newStartDateTime,
      end: newEndDateTime,
    }
    onUpdateEvent(updatedEvent)
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
    // Reset form values to current event values
    setTitle(event.title)
    setDescription(event.description || "")
    setTodos(event.todos || [])
    setMeetingNotes(event.meetingNotes || "")
    setReminderTime(event.reminderTime || "10")
  }

  const formatEventDateTime = (start: Date, end: Date) => {
    const startDate = format(start, "EEEE, MMMM d")
    const startTime = format(start, "h:mm")
    const endTime = format(end, "h:mma")
    return `${startDate} - ${startTime} - ${endTime}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header with action buttons */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Save className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Event details */}
        <div className="p-4 space-y-4">
          {/* Event title with color indicator */}
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-300 text-gray-800 text-xl font-medium focus-visible:ring-blue-500"
              />
            ) : (
              <h2 className="text-xl font-medium text-gray-800">{event.title}</h2>
            )}
          </div>

          {/* Date and time - Editable */}
          <div className="space-y-3">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Start Date & Time</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="flex-1 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">End Date & Time</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="flex-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">{formatEventDateTime(event.start, event.end)}</p>
            )}
          </div>

          {/* Additional details */}
          <div className="space-y-3 pt-2">
            {/* Meeting notes - Editable */}
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-800 text-sm font-medium mb-2">Meeting notes</p>
                {isEditing ? (
                  <Textarea
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    placeholder="Add meeting notes..."
                    className="border-gray-300 text-gray-700 text-sm min-h-[80px] focus-visible:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-600 text-sm">
                    {event.meetingNotes || "Start a new document to capture notes"}
                  </p>
                )}
              </div>
            </div>

            {/* Reminder - Editable */}
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-800 text-sm font-medium mb-2">Reminder</p>
                {isEditing ? (
                  <Select value={reminderTime} onValueChange={setReminderTime}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">At time of event</SelectItem>
                      <SelectItem value="5">5 minutes before</SelectItem>
                      <SelectItem value="10">10 minutes before</SelectItem>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                      <SelectItem value="120">2 hours before</SelectItem>
                      <SelectItem value="1440">1 day before</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-600 text-sm">
                    {reminderTime === "0"
                      ? "At time of event"
                      : reminderTime === "60"
                        ? "1 hour before"
                        : reminderTime === "120"
                          ? "2 hours before"
                          : reminderTime === "1440"
                            ? "1 day before"
                            : `${reminderTime} minutes before`}
                  </p>
                )}
              </div>
            </div>

            {/* TO DO Lists - Always show, regardless of editing state */}
            <div className="flex items-start gap-3">
              <CheckSquare className="h-5 w-5 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-800 text-sm mb-3 font-medium">TO DO Lists</p>
                {todos && todos.length > 0 ? (
                  <div className="space-y-3">
                    {todos.map((todo) => (
                      <div key={todo.id} className="flex items-center gap-3 group">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 cursor-pointer h-4 w-4"
                        />
                        <span
                          className={`text-sm transition-all duration-200 ${
                            todo.completed ? "line-through text-gray-400" : "text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          {todo.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No tasks added yet</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3 pt-2">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-800 text-sm font-medium mb-2">Description</p>
                {isEditing ? (
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description..."
                    className="border-gray-300 text-gray-700 text-sm min-h-[80px] focus-visible:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-600 text-sm">{event.description || "No description"}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
