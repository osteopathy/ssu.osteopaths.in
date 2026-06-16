import { text } from "drizzle-orm/sqlite-core";
import { createTable, id, timestamps, date } from "../../../../utils";
import { userTable } from "../../../user";
import { serviceProviderTable } from "../index";
import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { serviceProviderDateWiseScheduleTable } from "../date_wise_schedule";

// Pending: The initial state, awaiting processing.
// Accepted: The request has been approved.
// Rejected: The request has been denied.
// Cancelled: The request was accepted but subsequently withdrawn by either party.
// Completed: The appointment has taken place.
// No-Show: The appointment was accepted, but the requesting party did not attend.

// export type WithdrawnReason =
//   | 'AnotherRequestAccepted'
//   | 'UserCancelled'
//   | 'ServiceProviderCancelled'
//   | 'UserNoLongerNeedsService'
//   | 'ServiceProviderUnavailable'
//   | 'Other'
//   | 'unknown';

export const WithDrawReasons = {
	AnotherRequestAccepted: "Another Request is Accepted by ...",
	UserCancelled: "User Cancelled",
	unknown: "unknown"
};

export const serviceProviderAppointmentRequestTable = createTable(
	"service_provider_appointment_request",
	{
		id,
		userId: text("user_id").references(() => userTable.id, { onDelete: "cascade" }),
		serviceProviderId: text("service_provider_id").references(() => serviceProviderTable.id),
		dateWiseScheduleId: text("date_wise_schedule_id").references(
			() => serviceProviderDateWiseScheduleTable.id
		),
		date: date("date"), // %dd/%mm/%yyyy
		startAt: text("start_at"), // user preferred start time
		endAt: text("end_at"), // user preferred availability time
		note: text("note"),
		status: text("status", { enum: ["idle", "accepted", "withdrawn"] }),
		withdrawnReason: text("withdrawn_reason"),
		...timestamps
	}
);

export type ServiceProviderAppointmentRequest = InferSelectModel<
	typeof serviceProviderAppointmentRequestTable
>;
export type InsertServiceProviderAppointmentRequest = InferInsertModel<
	typeof serviceProviderAppointmentRequestTable
>;

export const serviceProviderAppointmentRequestRelation = relations(
	serviceProviderAppointmentRequestTable,
	({ one }) => ({
		user: one(userTable, {
			fields: [serviceProviderAppointmentRequestTable.userId],
			references: [userTable.id]
		}),
		serviceProvider: one(serviceProviderTable, {
			fields: [serviceProviderAppointmentRequestTable.serviceProviderId],
			references: [serviceProviderTable.id]
		}),
		dateWiseSchedule: one(serviceProviderDateWiseScheduleTable, {
			fields: [serviceProviderAppointmentRequestTable.dateWiseScheduleId],
			references: [serviceProviderDateWiseScheduleTable.id]
		})
	})
);
