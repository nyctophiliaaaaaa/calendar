"use client"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  differenceInDays,
  addDays,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns"
import type { Event } from "@/components/calendar-app"

interface MonthViewProps {
  currentDate: Date
  events: Event[]
  onDateClick?: (date: Date) => void
  onEventClick?: (event: Event) => void
}

export function MonthView({ currentDate, events, onDateClick, onEventClick }: MonthViewProps) {
  const actualToday = new Date(2025, 5, 1) // June 1, 2025

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // Get the start and end of the calendar view (including partial weeks)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Group days into weeks
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Get events for a specific day (single day events only)
  const getSingleDayEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const isSingleDay = isSameDay(event.start, event.end)
      return isSingleDay && isSameDay(event.start, day)
    })
  }

  // Get multi-day events that span across days
  const getMultiDayEvents = () => {
    return events.filter((event) => !isSameDay(event.start, event.end))
  }

  // Calculate which days a multi-day event spans in the current calendar view
  const getEventSpanForWeek = (event: Event, week: Date[]) => {
    const eventStart = event.start
    const eventEnd = event.end
    
    const spans = []
    let currentSpanStart = null
    let currentSpanLength = 0

    for (let i = 0; i < week.length; i++) {
      const day = week[i]
      const dayStart = startOfDay(day)
      const dayEnd = endOfDay(day)

      // Check if event overlaps with this day
      const overlaps = isWithinInterval(dayStart, { start: eventStart, end: eventEnd }) ||
                     isWithinInterval(dayEnd, { start: eventStart, end: eventEnd }) ||
                     (eventStart <= dayStart && eventEnd >= dayEnd)

      if (overlaps) {
        if (currentSpanStart === null) {
          currentSpanStart = i
          currentSpanLength = 1
        } else {
          currentSpanLength++
        }
      } else {
        if (currentSpanStart !== null) {
          spans.push({
            start: currentSpanStart,
            length: currentSpanLength,
            event: event
          })
          currentSpanStart = null
          currentSpanLength = 0
        }
      }
    }

    // Handle case where span goes to end of week
    if (currentSpanStart !== null) {
      spans.push({
        start: currentSpanStart,
        length: currentSpanLength,
        event: event
      })
    }

    return spans
  }

  const handleEventClick = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation() // Prevent date click when clicking on event
    onEventClick?.(event)
  }

  return (
    <div className="h-full bg-white overflow-auto">
      {/* Day headers - no borders */}
      <div className="grid grid-cols-7 sticky top-0 bg-white z-10">
        {dayNames.map((dayName, index) => (
          <div
            key={dayName}
            className={`
              text-right text-sm font-medium py-4 pr-3 text-gray-800
              ${index === 0 || index === 6 ? "text-gray-500" : ""}
            `}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="relative">
            {/* Day cells */}
            <div className="grid grid-cols-7 border-t border-gray-200">
              {week.map((day, dayIndex) => {
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isSelected = isSameDay(day, actualToday)
                const isWeekend = dayIndex === 0 || dayIndex === 6
                const dayEvents = getSingleDayEventsForDay(day)

                return (
                  <button
                    key={dayIndex}
                    onClick={() => onDateClick?.(day)}
                    className={`
                      min-h-[120px] border-r border-gray-200 last:border-r-0 p-0 text-left hover:bg-gray-50 transition-colors relative
                      ${isCurrentMonth ? (isWeekend ? "bg-gray-100" : "bg-white") : "bg-gray-100"}
                    `}
                  >
                    <div className="absolute top-2 right-2">
                      <span
                        className={`
                          text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
                          ${isSelected ? "bg-rose-500 text-white" : ""}
                          ${!isCurrentMonth ? "text-gray-400" : "text-gray-800"}
                        `}
                      >
                        {format(day, "d")}
                      </span>
                    </div>

                    {/* Single day events */}
                    <div className="mt-8 px-2">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          onClick={(e) => handleEventClick(e, event)}
                          className={`mb-1 text-xs truncate rounded px-1 py-0.5 ${event.color} cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 pl-1">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Multi-day events overlay */}
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: '120px' }}>
              {getMultiDayEvents().map((event) => {
                const spans = getEventSpanForWeek(event, week)
                return spans.map((span, spanIndex) => (
                  <div
                    key={`${event.id}-${spanIndex}`}
                    onClick={(e) => handleEventClick(e, event)}
                    className={`absolute rounded px-2 py-1 text-xs font-medium truncate ${event.color} cursor-pointer hover:opacity-80 transition-opacity pointer-events-auto`}
                    style={{
                      left: `${(span.start / 7) * 100}%`,
                      width: `${(span.length / 7) * 100}%`,
                      top: '32px', // Position below the date number
                      height: '20px',
                      zIndex: 5
                    }}
                  >
                    {event.title}
                  </div>
                ))
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
