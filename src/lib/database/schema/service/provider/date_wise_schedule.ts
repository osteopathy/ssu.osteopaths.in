import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { serviceProviderTable } from ".";
import { createTable, date, id, timestamps } from "../../../utils";
import { serviceProviderAppointmentRequestTable } from "./appointment/request";

export const serviceProviderDateWiseScheduleTable = createTable(
	"service_provider_date_wise_schedule",
	{
		id,
		serviceProviderId: text("service_provider_id").references(() => serviceProviderTable.id),
		date: date("date"), // %dd/%mm/%yyyy
		startAt: text("start_at"),
		endAt: text("end_at"),
		disabled: integer("disabled", { mode: "boolean" }),
		...timestamps
	}
);

export type ServiceProviderDateWiseSchedule = InferSelectModel<
	typeof serviceProviderDateWiseScheduleTable
>;
export type InsertServiceProviderDateWiseSchedule = InferInsertModel<
	typeof serviceProviderDateWiseScheduleTable
>;

export const serviceProviderDateWiseScheduleRelation = relations(
	serviceProviderDateWiseScheduleTable,
	({ one, many }) => ({
		serviceProvider: one(serviceProviderTable, {
			fields: [serviceProviderDateWiseScheduleTable.serviceProviderId],
			references: [serviceProviderTable.id]
		}),
		requests: many(serviceProviderAppointmentRequestTable)
	})
);
