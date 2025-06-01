"use client"

import { useState, useEffect } from "react"
import { format, isSameDay, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import type { Event } from "@/components/calendar-app"

interface DayViewProps {
  currentDate: Date
  selectedDate: Date
  events: Event[]
  onEventClick?: (event: Event) => void
}

export function DayView({ currentDate, selectedDate, events, onEventClick }: DayViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Check if we're viewing today (current day in Philippines time)
  const now = new Date()
  const philippinesTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }))
  const isToday = isSameDay(selectedDate, philippinesTime)

  // Get events for the selected day, including multi-day events
  const getDayEvents = () => {
    return events.filter((event) => {
      // Check if the event occurs on the selected day
      const selectedDayStart = startOfDay(selectedDate)
      const selectedDayEnd = endOfDay(selectedDate)

      return (
        isWithinInterval(event.start, { start: selectedDayStart, end: selectedDayEnd }) ||
        isWithinInterval(event.end, { start: selectedDayStart, end: selectedDayEnd }) ||
        (event.start <= selectedDayStart && event.end >= selectedDayEnd)
      )
    })
  }

  const dayEvents = getDayEvents()

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour === 12) return "12 NN"
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`
  }

  const getEventPosition = (event: Event) => {
    // For multi-day events that start before the selected day
    const eventStart = isSameDay(event.start, selectedDate) ? event.start : startOfDay(selectedDate)

    // For multi-day events that end after the selected day
    const eventEnd = isSameDay(event.end, selectedDate) ? event.end : endOfDay(selectedDate)

    const startHour = eventStart.getHours() + eventStart.getMinutes() / 60
    const endHour = eventEnd.getHours() + eventEnd.getMinutes() / 60
    const duration = endHour - startHour

    return {
      top: `${startHour * 60}px`,
      height: `${Math.max(duration * 60, 30)}px`, // Ensure minimum visibility
    }
  }

  const isMultiDayEvent = (event: Event) => {
    return !isSameDay(event.start, event.end)
  }

  const getCurrentTimePosition = () => {
    // Get current Philippines time
    const now = new Date()
    const philippinesTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }))
    const hours = philippinesTime.getHours()
    const minutes = philippinesTime.getMinutes()
    return {
      top: `${hours * 60 + minutes}px`,
    }
  }

  // Extract background color from the event color class
  const getBackgroundColor = (colorClass: string) => {
    const colorMap: { [key: string]: string } = {
      "bg-[#FF6961]": "#FF6961", // Coral
      "bg-[#B19CD9]": "#B19CD9", // Lavender
      "bg-[#77DD77]": "#77DD77", // Mint
      "bg-[#FFB347]": "#FFB347", // Peach
      "bg-[#87CEEB]": "#87CEEB", // Sky Blue
      "bg-[#F8BBD9]": "#F8BBD9", // Rose
      "bg-[#FDFD96]": "#FDFD96", // Lemon
      "bg-[#9CAF88]": "#9CAF88", // Sage
    }

    // Find the background color in the class string
    for (const [className, color] of Object.entries(colorMap)) {
      if (colorClass.includes(className)) {
        return color
      }
    }
    return "#FF6961" // Default coral color
  }

  return (
    <div className="relative h-full overflow-y-auto bg-white">
      <div className="relative min-h-full">
        <div className="absolute top-0 left-0 w-20 h-full border-r border-gray-200 bg-white z-10">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b border-gray-100 flex items-start justify-end pr-3 pt-1">
              <span className="text-sm text-gray-500">{formatHour(hour)}</span>
            </div>
          ))}
        </div>

        <div className="ml-20 relative">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b border-gray-100">
              <div className="w-full h-full"></div>
            </div>
          ))}

          {/* Current time indicator - show current Philippines time when viewing today */}
          {isToday && (
            <div className="absolute left-0 right-0 border-t-2 border-rose-500 z-20" style={getCurrentTimePosition()}>
              <div className="absolute -left-2 -top-1.5 w-3 h-3 rounded-full bg-rose-500"></div>
            </div>
          )}

          {/* Events - Full solid color coverage for time blocks */}
          {dayEvents.map((event, index) => {
            const position = getEventPosition(event)
            const isMultiDay = isMultiDayEvent(event)
            const backgroundColor = getBackgroundColor(event.color)

            return (
              <div
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className="absolute left-1 right-1 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.01] z-10 border border-white/20"
                style={{
                  ...position,
                  marginLeft: `${index * 6}px`, // Offset for overlapping events
                  backgroundColor: backgroundColor,
                }}
              >
                {/* Solid color overlay to ensure full coverage */}
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    backgroundColor: backgroundColor,
                    opacity: 0.95,
                  }}
                />

                {/* Content layer */}
                <div className="relative p-3 h-full flex flex-col justify-start text-white">
                  <div className="text-sm font-bold truncate drop-shadow-md">{event.title}</div>
                  <div className="text-xs mt-1 truncate drop-shadow-md opacity-95">
                    {isMultiDay ? (
                      <>
                        {format(event.start, "MMM d")} - {format(event.end, "MMM d")}
                      </>
                    ) : (
                      <>
                        {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                      </>
                    )}
                  </div>
                </div>

                {/* Left accent border */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                  style={{
                    backgroundColor: backgroundColor,
                    filter: "brightness(0.8)", // Darker shade for accent
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
