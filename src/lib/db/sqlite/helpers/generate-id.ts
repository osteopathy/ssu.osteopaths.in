import { text } from 'drizzle-orm/sqlite-core';
import { generateId as luciaGenId } from 'lucia';

export const genId = (column_name: string = 'id') => {
	return text(column_name)
		.primaryKey()
		.$default(() => luciaGenId(15));
};
