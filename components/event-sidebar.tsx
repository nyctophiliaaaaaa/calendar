"use client"

import type React from "react"

import { format, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface Event {
  id: string
  title: string
  start: Date
  end: Date
  color: string
  description?: string
}

interface EventSidebarProps {
  selectedDate: Date
  events: Event[]
  onNewEvent: () => void
  onDeleteEvent: (eventId: string) => void
  onEventClick: (event: Event) => void
}

export function EventSidebar({ selectedDate, events, onNewEvent, onDeleteEvent, onEventClick }: EventSidebarProps) {
  // Filter events for the selected date
  const dayEvents = events.filter((event) => isSameDay(event.start, selectedDate))

  const formatEventTime = (start: Date, end: Date) => {
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`
  }

  const handleDeleteEvent = (e: React.MouseEvent, eventId: string, eventTitle: string) => {
    e.stopPropagation() // Prevent event click when deleting
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      onDeleteEvent(eventId)
    }
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Today</h2>
      </div>

      {/* Events Content */}
      <div className="flex-1 p-6">
        {dayEvents.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-gray-400 font-medium">No Events</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className={`p-4 rounded-lg border ${event.color} shadow-sm relative group cursor-pointer hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{formatEventTime(event.start, event.end)}</p>
                    {event.description && <p className="text-sm text-gray-700">{event.description}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteEvent(e, event.id, event.title)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
