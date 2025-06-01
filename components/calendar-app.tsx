"use client"

import { useState } from "react"
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CalendarHeader } from "@/components/calendar-header"
import { DayView } from "@/components/day-view"
import { WeekView } from "@/components/week-view"
import { MonthView } from "@/components/month-view"
import { NewEventModal } from "@/components/new-event-modal"
import { EventSidebar } from "@/components/event-sidebar"
import { EventDetailPopup } from "@/components/event-detail-popup"
import { Menu, Plus, ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

type ViewType = "day" | "week" | "month"

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export interface Event {
  id: string
  title: string
  start: Date
  end: Date
  color: string
  description?: string
  todos?: TodoItem[]
  meetingNotes?: string
  reminderTime?: string
  repeat?: string
  originalDate?: Date // Store the original date for recurring events
}

export function CalendarApp() {
  // Set today to June 1, 2025 as requested
  const actualToday = new Date(2025, 5, 1) // June 1, 2025 (month is 0-indexed)
  const [currentDate, setCurrentDate] = useState<Date>(actualToday)
  const [selectedDate, setSelectedDate] = useState<Date>(actualToday)
  const [view, setView] = useState<ViewType>("month")
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([]) // Initialize with empty array - no preset events
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false)

  const goToToday = () => {
    setCurrentDate(actualToday)
    setSelectedDate(actualToday)
  }

  const handleDateClick = (date: Date) => {
    setCurrentDate(date)
    setSelectedDate(date)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsEventDetailOpen(true)
  }

  const goToNextPeriod = () => {
    if (view === "day") {
      setCurrentDate(addDays(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  const goToPreviousPeriod = () => {
    if (view === "day") {
      setCurrentDate(subDays(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      setCurrentDate(subMonths(currentDate, 1))
    }
  }

  const handleSignOut = () => {
    setIsLogoutPopupOpen(true)
  }

  const handleConfirmLogout = () => {
    // Add actual sign out logic here
    console.log("User confirmed logout")
    setIsLogoutPopupOpen(false)
    // You can add redirect logic or other logout actions here
  }

  const handleNewEvent = () => {
    setIsNewEventModalOpen(true)
  }

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    setSelectedEvent(updatedEvent)
  }

  const handleEditEvent = (event: Event) => {
    // For now, just open the new event modal
    // In a full implementation, you'd populate the modal with existing event data
    setIsNewEventModalOpen(true)
  }

  // Function to generate recurring events
  const generateRecurringEvents = (baseEvent: Event, repeatType: string): Event[] => {
    if (repeatType === "never") {
      return [baseEvent]
    }

    const recurringEvents: Event[] = [baseEvent]
    const maxOccurrences = 52 // Limit to 52 occurrences to prevent infinite events

    for (let i = 1; i < maxOccurrences; i++) {
      let newStartDate: Date
      let newEndDate: Date

      const duration = baseEvent.end.getTime() - baseEvent.start.getTime()

      switch (repeatType) {
        case "daily":
          newStartDate = addDays(baseEvent.start, i)
          newEndDate = new Date(newStartDate.getTime() + duration)
          break

        case "weekly":
          newStartDate = addWeeks(baseEvent.start, i)
          newEndDate = new Date(newStartDate.getTime() + duration)
          break

        case "monthly":
          newStartDate = addMonths(baseEvent.start, i)
          newEndDate = new Date(newStartDate.getTime() + duration)
          break

        case "yearly":
          newStartDate = addYears(baseEvent.start, i)
          newEndDate = new Date(newStartDate.getTime() + duration)
          break

        default:
          continue
      }

      // Create recurring event
      const recurringEvent: Event = {
        ...baseEvent,
        id: `${baseEvent.id}-recurring-${i}`,
        start: newStartDate,
        end: newEndDate,
        originalDate: baseEvent.start, // Keep reference to original date
      }

      recurringEvents.push(recurringEvent)
    }

    return recurringEvents
  }

  // Function to check if two time periods overlap
  const checkTimeOverlap = (start1: Date, end1: Date, start2: Date, end2: Date): boolean => {
    return start1 < end2 && start2 < end1
  }

  // Function to validate if a new event overlaps with existing events
  const validateEventTime = (newStart: Date, newEnd: Date): { isValid: boolean; conflictingEvent?: Event } => {
    for (const existingEvent of events) {
      if (checkTimeOverlap(newStart, newEnd, existingEvent.start, existingEvent.end)) {
        return {
          isValid: false,
          conflictingEvent: existingEvent,
        }
      }
    }
    return { isValid: true }
  }

  const handleSaveEvent = (eventData: any) => {
    const newStart = new Date(eventData.startDate)
    const newEnd = new Date(eventData.endDate)

    // Validate that end time is after start time
    if (newEnd <= newStart) {
      alert("End time must be after start time.")
      return { success: false, error: "End time must be after start time." }
    }

    // Check for overlapping events (only for the base event, not recurring ones)
    const validation = validateEventTime(newStart, newEnd)

    if (!validation.isValid && validation.conflictingEvent) {
      const conflictStart = validation.conflictingEvent.start.toLocaleString()
      const conflictEnd = validation.conflictingEvent.end.toLocaleString()
      alert(
        `This event overlaps with "${validation.conflictingEvent.title}" (${conflictStart} - ${conflictEnd}). Please choose a different time.`,
      )
      return { success: false, error: "Event time conflicts with existing event." }
    }

    // Create base event
    const baseEvent: Event = {
      id: Date.now().toString(),
      title: eventData.title,
      start: newStart,
      end: newEnd,
      color: eventData.color,
      description: eventData.notes,
      todos: eventData.todos || [],
      meetingNotes: "",
      reminderTime: "10",
      repeat: eventData.repeat,
      originalDate: newStart,
    }

    // Generate recurring events based on repeat setting
    const allEvents = generateRecurringEvents(baseEvent, eventData.repeat)

    // Add all events to the calendar
    setEvents((prev) => [...prev, ...allEvents])

    // Open the sidebar to show the new event
    setIsSidebarOpen(true)

    return { success: true }
  }

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-white">
      {/* Event Sidebar - only show when isSidebarOpen is true */}
      {isSidebarOpen && (
        <EventSidebar
          selectedDate={selectedDate}
          events={events}
          onNewEvent={handleNewEvent}
          onDeleteEvent={handleDeleteEvent}
          onEventClick={handleEventClick}
        />
      )}

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSidebar}
              className="text-gray-600 hover:bg-gray-300 h-10 w-10"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewEvent}
              className="text-red-500 hover:bg-gray-300 h-10 w-10"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full flex overflow-hidden">
              <Button
                variant={view === "day" ? "default" : "ghost"}
                onClick={() => setView("day")}
                className={`rounded-l-full px-6 py-2 text-sm ${view === "day" ? "bg-white text-white sm:text-gray-800 shadow-sm" : "bg-transparent text-gray-600"}`}
              >
                Day
              </Button>
              <Button
                variant={view === "week" ? "default" : "ghost"}
                onClick={() => setView("week")}
                className={`px-6 py-2 text-sm ${view === "week" ? "bg-white text-white sm:text-gray-800 shadow-sm" : "bg-transparent text-gray-600"}`}
              >
                Week
              </Button>
              <Button
                variant={view === "month" ? "default" : "ghost"}
                onClick={() => setView("month")}
                className={`rounded-r-full px-6 py-2 text-sm ${view === "month" ? "bg-white text-white sm:text-gray-800 shadow-sm" : "bg-transparent text-gray-600"}`}
              >
                Month
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">U</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700">username@gmail.com</span>
            </div>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-gray-300 text-gray-600">U</AvatarFallback>
              </Avatar>
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={goToToday} className="text-red-500 hover:bg-gray-300">
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-gray-600 hover:bg-gray-300 h-8 w-8"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Calendar Header - only show for day view */}
        {view === "day" && (
          <CalendarHeader
            currentDate={currentDate}
            view={view}
            onPrevious={goToPreviousPeriod}
            onNext={goToNextPeriod}
            onToday={goToToday}
            onDateClick={handleDateClick}
          />
        )}

        {/* Month/Year header for week and month views */}
        {(view === "week" || view === "month") && (
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-gray-900">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={goToPreviousPeriod} size="icon">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="ghost" onClick={goToNextPeriod} size="icon">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Content */}
        <div className="flex-1 overflow-hidden">
          {view === "day" && (
            <DayView
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={events}
              onEventClick={handleEventClick}
            />
          )}
          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          )}
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      </div>

      {/* New Event Modal */}
      <NewEventModal
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onSave={handleSaveEvent}
      />

      {/* Event Detail Popup */}
      <EventDetailPopup
        event={selectedEvent}
        isOpen={isEventDetailOpen}
        onClose={() => setIsEventDetailOpen(false)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onUpdateEvent={handleUpdateEvent}
      />

      {/* Logout Confirmation Popup */}
      {isLogoutPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Log Out</h2>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>

              {/* User info */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-gray-300 text-gray-600">U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">User</p>
                  <p className="text-sm text-gray-500">username@gmail.com</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsLogoutPopupOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleConfirmLogout} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
