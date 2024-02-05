import type { Appointment, Osteopath } from "$lib/db/schema"

export const bookAppointment = async (calendarId:string | undefined | null, userId:string, osteopath:{
    gmail:string,
    id: string
} ,appointment:Appointment) => {
    if(calendarId) {
        const res = await fetch('/book', {
            method: 'POST',
            body: JSON.stringify({
                duration: appointment.duration,
                startTime: appointment.startTime, 
                date: appointment.date, 
                userId,
                osteopathGmail: osteopath.gmail, 
                osteopathId:osteopath.id, 
                calendarId,
                appointmentId:appointment.id
            })
        })
    }
    return {}
}