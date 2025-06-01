"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek, isSameDay, startOfDay, endOfDay } from "date-fns"
import type { Event } from "@/components/calendar-app"

interface WeekViewProps {
  currentDate: Date
  selectedDate: Date
  events: Event[]
  onDateClick?: (date: Date) => void
  onEventClick?: (event: Event) => void
}

export function WeekView({ currentDate, selectedDate, events, onDateClick, onEventClick }: WeekViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Get current day in Philippines time
  const now = new Date()
  const philippinesTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }))

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour === 12) return "12 NN"
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`
  }

  // Check if an event spans multiple days
  const isMultiDayEvent = (event: Event) => {
    return !isSameDay(event.start, event.end)
  }

  // Simplified event filtering - check if event occurs on this day
  const getEventsForDay = (day: Date) => {
    const dayStart = startOfDay(day)
    const dayEnd = endOfDay(day)

    return events.filter((event) => {
      // Event starts on this day
      const startsOnDay = isSameDay(event.start, day)

      // Event ends on this day
      const endsOnDay = isSameDay(event.end, day)

      // Event spans across this day (starts before and ends after)
      const spansDay = event.start < dayStart && event.end > dayEnd

      // Event overlaps with this day
      const overlapsDay = event.start <= dayEnd && event.end >= dayStart

      return startsOnDay || endsOnDay || spansDay || overlapsDay
    })
  }

  // Get event position for a specific day
  const getEventPosition = (event: Event, day: Date) => {
    const dayStart = startOfDay(day)
    const dayEnd = endOfDay(day)

    // Determine the effective start and end times for this day
    let effectiveStart = event.start
    let effectiveEnd = event.end

    // If event starts before this day, use day start
    if (event.start < dayStart) {
      effectiveStart = dayStart
    }

    // If event ends after this day, use day end
    if (event.end > dayEnd) {
      effectiveEnd = dayEnd
    }

    // Calculate position based on effective times
    const startHour = effectiveStart.getHours() + effectiveStart.getMinutes() / 60
    const endHour = effectiveEnd.getHours() + effectiveEnd.getMinutes() / 60
    const duration = endHour - startHour

    // Ensure minimum duration for visibility
    const minDuration = 0.5 // 30 minutes minimum
    const finalDuration = Math.max(duration, minDuration)

    return {
      top: `${startHour * 60}px`,
      height: `${finalDuration * 60}px`,
    }
  }

  const getCurrentTimePosition = () => {
    const hours = philippinesTime.getHours()
    const minutes = philippinesTime.getMinutes()
    return {
      top: `${hours * 60 + minutes}px`,
    }
  }

  // Find which day column represents today
  const todayColumnIndex = days.findIndex((day) => isSameDay(day, philippinesTime))

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

    for (const [className, color] of Object.entries(colorMap)) {
      if (colorClass.includes(className)) {
        return color
      }
    }
    return "#FF6961" // Default coral color
  }

  // Debug logging
  useEffect(() => {
    console.log("Week View - Total events:", events.length)
    days.forEach((day, index) => {
      const dayEvents = getEventsForDay(day)
      console.log(`${format(day, "EEE MMM d")}: ${dayEvents.length} events`)
      dayEvents.forEach((event) => {
        console.log(`  - ${event.title}: ${format(event.start, "HH:mm")} - ${format(event.end, "HH:mm")}`)
      })
    })
  }, [events, currentDate])

  return (
    <div className="h-full bg-white overflow-auto">
      {/* Day headers */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="grid grid-cols-8">
          {/* Empty cell for time column */}
          <div className="border-r border-gray-200"></div>

          {/* Day headers */}
          {days.map((day, i) => {
            const isToday = isSameDay(day, philippinesTime)
            const isSelected = isSameDay(day, selectedDate)
            const dayEvents = getEventsForDay(day)

            return (
              <div key={i} className="text-center py-4 border-r border-gray-200 last:border-r-0">
                <div className="text-sm text-gray-600 mb-1">{format(day, "EEE")}</div>
                <button
                  onClick={() => onDateClick?.(day)}
                  className={`
                    inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors hover:bg-gray-100
                    ${isSelected ? "bg-rose-500 text-white hover:bg-rose-600" : "text-gray-800"}
                  `}
                >
                  {format(day, "d")}
                </button>
                {/* Debug: Show event count */}
                {dayEvents.length > 0 && <div className="text-xs text-blue-500 mt-1">{dayEvents.length} events</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Time grid */}
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 h-[60px]">
            {/* Time label */}
            <div className="border-r border-b border-gray-200 flex items-start justify-end pr-3 pt-1">
              <span className="text-sm text-gray-500">{formatHour(hour)}</span>
            </div>

            {/* Day columns */}
            {days.map((day, dayIndex) => (
              <div key={dayIndex} className="border-r border-b border-gray-200 last:border-r-0 relative">
                {/* Grid cell content */}
              </div>
            ))}
          </div>
        ))}

        {/* Current time indicator */}
        {todayColumnIndex !== -1 && (
          <div
            className="absolute border-t-2 border-rose-500 z-20"
            style={{
              ...getCurrentTimePosition(),
              left: `${((todayColumnIndex + 1) / 8) * 100}%`,
              width: `${(1 / 8) * 100}%`,
            }}
          >
            <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-rose-500"></div>
          </div>
        )}

        {/* Events - Render all events for all days */}
        {days.map((day, dayIndex) => {
          const dayEvents = getEventsForDay(day)

          return dayEvents.map((event, eventIndex) => {
            const position = getEventPosition(event, day)
            const backgroundColor = getBackgroundColor(event.color)
            const isMultiDay = isMultiDayEvent(event)
            const isStartDay = isSameDay(event.start, day)

            return (
              <div
                key={`week-event-${day.getTime()}-${event.id}-${eventIndex}`}
                onClick={() => onEventClick?.(event)}
                className="absolute rounded-md shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 z-10"
                style={{
                  top: position.top,
                  height: position.height,
                  left: `${((dayIndex + 1) / 8) * 100 + 0.5}%`,
                  width: `${(1 / 8) * 100 - 2}%`,
                  backgroundColor: backgroundColor,
                  marginLeft: `${eventIndex * 3}px`,
                }}
              >
                {/* Content */}
                <div className="p-1 h-full flex flex-col justify-start text-white text-xs">
                  <div className="font-semibold truncate drop-shadow-sm">{event.title}</div>
                  {isStartDay && (
                    <div className="truncate opacity-90 drop-shadow-sm">{format(event.start, "h:mm a")}</div>
                  )}
                </div>

                {/* Left border accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{
                    backgroundColor: backgroundColor,
                    filter: "brightness(0.7)",
                  }}
                />
              </div>
            )
          })
        })}
      </div>
    </div>
  )
}
