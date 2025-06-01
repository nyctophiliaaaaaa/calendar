"use client"

import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarHeaderProps {
  currentDate: Date
  view: "day" | "week" | "month"
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onDateClick?: (date: Date) => void
}

export function CalendarHeader({ currentDate, view, onPrevious, onNext, onToday, onDateClick }: CalendarHeaderProps) {
  const actualToday = new Date(2025, 5, 1) // June 1, 2025

  const renderWeekView = () => {
    if (view !== "day" && view !== "week") return null

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
    const days = []

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i)
      const isCurrentDay = isSameDay(day, currentDate)

      days.push(
        <div key={i} className="flex flex-col items-center">
          <div className="text-gray-500 text-base mb-3">{format(day, "EEE")}</div>
          <button
            onClick={() => onDateClick?.(day)}
            className={`
              flex items-center justify-center w-12 h-12 rounded-full text-lg font-medium transition-colors
              ${isCurrentDay ? "bg-rose-500 text-white" : "text-gray-800 hover:bg-gray-100"}
            `}
          >
            {format(day, "d")}
          </button>
        </div>,
      )
    }

    return (
      <div className="mt-8">
        <div className="flex items-center justify-between px-4">
          <Button variant="ghost" onClick={onPrevious} size="icon" className="text-rose-500 hover:bg-transparent">
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="flex justify-between w-full px-8 mx-auto">{days}</div>

          <Button variant="ghost" onClick={onNext} size="icon" className="text-rose-500 hover:bg-transparent">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="text-center text-gray-700 text-lg mt-8 border-t border-gray-100 pt-4">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </div>
      </div>
    )
  }

  const getHeaderText = () => {
    return format(currentDate, "MMMM yyyy")
  }

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold text-gray-900">{getHeaderText()}</h1>
        <div className="flex items-center gap-2">
          {view === "month" && (
            <>
              <Button variant="ghost" onClick={onPrevious} size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={onNext} size="icon">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
          {/* Removed the duplicate Today button from here */}
        </div>
      </div>
      {renderWeekView()}
    </div>
  )
}
