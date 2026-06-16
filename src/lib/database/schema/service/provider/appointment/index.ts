import { text } from "drizzle-orm/sqlite-core";
import { createTable, date, id, timestamps } from "../../../../utils";
import { serviceProviderTable } from "..";
import { userTable } from "../../../user";
import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { serviceProviderAppointmentRequestTable } from "./request";

export const serviceProviderAppointmentTable = createTable("service_provider_appointment", {
	id,
	userId: text("user_id").references(() => userTable.id, { onDelete: "cascade" }),
	serviceProviderId: text("service_provider_id").references(() => serviceProviderTable.id),
	date: date("date"), // %dd/%mm/%yyyy
	startAt: text("start_at"),
	endAt: text("end_at"),
	location: text("location"),
	status: text("status"),
	appointmentRequestId: text("request_id").references(
		() => serviceProviderAppointmentRequestTable.id
	),
	...timestamps
});

export type ServiceProviderAppointment = InferSelectModel<typeof serviceProviderAppointmentTable>;
export type InsertServiceProviderAppointment = InferInsertModel<
	typeof serviceProviderAppointmentTable
>;

export const serviceProviderAppointmentRelation = relations(
	serviceProviderAppointmentTable,
	({ one }) => ({
		user: one(userTable, {
			fields: [serviceProviderAppointmentTable.userId],
			references: [userTable.id]
		}),
		serviceProvider: one(serviceProviderTable, {
			fields: [serviceProviderAppointmentTable.serviceProviderId],
			references: [serviceProviderTable.id]
		}),
		appointmentRequest: one(serviceProviderAppointmentRequestTable, {
			fields: [serviceProviderAppointmentTable.appointmentRequestId],
			references: [serviceProviderAppointmentRequestTable.id]
		})
	})
);
