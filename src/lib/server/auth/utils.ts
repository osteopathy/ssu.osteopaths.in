import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { generateRandomString, type RandomReader } from "@oslojs/crypto/random";
import { userSessionTable, userTable, type User, type UserSession } from "$lib/database/schema";
import { db } from "$lib/database";
import { eq } from "drizzle-orm";
import { studentTable, type Student } from "$lib/database/schema/student";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const AUTH_USER_COLUMNS = [
	"id",
	"googleId",
	"email",
	"phone",
	"picture",
	"universityMail",
	"status",
	"name",
	"role",
	"createdAt",
	"updatedAt"
] as const;
let userTableColumnsPromise: Promise<Set<string>> | null = null;

const toNullableString = (value: unknown): string | null => {
	return typeof value === "string" ? value : null;
};

const toNullableDate = (value: unknown): Date | null => {
	return value instanceof Date ? value : null;
};

const toUserRole = (value: unknown): User["role"] => {
	if (
		value === "user" ||
		value === "student" ||
		value === "service_provider" ||
		value === "guest"
	) {
		return value;
	}

	return "user";
};

const toUserStatus = (value: unknown): User["status"] => {
	if (value === "verified" || value === "idle") {
		return value;
	}

	return "idle";
};

const toAuthUser = (row: Record<string, unknown>): User => {
	return {
		id: String(row.id),
		googleId: toNullableString(row.googleId),
		email: toNullableString(row.email),
		phone: toNullableString(row.phone),
		picture: toNullableString(row.picture),
		universityMail: toNullableString(row.universityMail),
		status: toUserStatus(row.status),
		name: toNullableString(row.name),
		role: toUserRole(row.role),
		metadata: null,
		createdAt: toNullableDate(row.createdAt),
		updatedAt: toNullableDate(row.updatedAt)
	};
};

const getUserTableColumns = async (): Promise<Set<string>> => {
	if (userTableColumnsPromise === null) {
		userTableColumnsPromise = db.$client
			.execute({
				sql: "PRAGMA table_info(`user`)",
				args: []
			})
			.then((result) => {
				return new Set(
					result.rows
						.map((row) => {
							const tableInfoRow = row as Record<string, unknown>;
							return typeof tableInfoRow.name === "string" ? tableInfoRow.name : null;
						})
						.filter((column): column is string => column !== null)
				);
			});
	}

	return userTableColumnsPromise;
};

type UserLookupColumn = "id" | "googleId" | "universityMail";

const getAuthUser = async (lookupColumn: UserLookupColumn, value: string): Promise<User | null> => {
	const columns = await getUserTableColumns();
	if (!columns.has("id") || !columns.has(lookupColumn)) {
		return null;
	}

	const selectedColumns = AUTH_USER_COLUMNS.filter((column) => columns.has(column));

	const query = await db.$client.execute({
		sql: `SELECT ${selectedColumns.map((column) => `\`${column}\``).join(", ")} FROM \`user\` WHERE \`${lookupColumn}\` = ? LIMIT 1`,
		args: [value]
	});

	const row = (query.rows[0] ?? null) as Record<string, unknown> | null;
	if (!row) {
		return null;
	}

	return toAuthUser(row);
};

export const updateGoogleAccount = async (id: string, googleUserId: string, email: string) => {
	return db
		.update(userTable)
		.set({
			googleId: googleUserId,
			email
		})
		.where(eq(userTable.id, id));
};

export const updateUniversityMail = async (id: string, universityMail: string) => {
	return db
		.update(userTable)
		.set({
			universityMail,
			status: "verified"
		})
		.where(eq(userTable.id, id));
};

export const connectStudent = async (
	userId: string,
	universityMail: string,
	name: string,
	batch: string,
	course: string
): Promise<Student | null> => {
	const random: RandomReader = {
		read(bytes: Uint8Array): void {
			crypto.getRandomValues(bytes);
		}
	};

	const studentId = generateRandomString(random, alphabet, 10);

	const user = await db
		.update(userTable)
		.set({
			universityMail,
			name,
			metadata: {
				student_id: studentId
			},
			role: "student",
			status: "verified"
		})
		.where(eq(userTable.id, userId));

	const student =
		(
			await db
				.insert(studentTable)
				.values({
					id: studentId,
					userId: userId,
					batch,
					course
				})
				.returning()
		)[0] ?? null;

	return student;
};

export const getUserFromGoogleId = async (value: string): Promise<User | null> => {
	return await getAuthUser("googleId", value);
};

export const getUserFromUniversityMail = async (value: string): Promise<User | null> => {
	return await getAuthUser("universityMail", value);
};

export const createUser = async (
	googleId: string,
	name: string,
	email: string,
	picture: string,
	role: "user" | "student" = "user",
	status: "idle" | "verified" = "idle"
): Promise<User> => {
	const createdUser = (
		await db
			.insert(userTable)
			.values({ googleId, name, email, picture, role, status })
			.returning({ id: userTable.id })
	)[0];
	const user = await getAuthUser("id", createdUser.id);
	if (user === null) {
		throw new Error("[Auth] Failed to fetch newly created user");
	}
	return user;
};

export const createUserWithUniversityMail = async (
	universityMail: string,
	name: string,
	picture: string
): Promise<User> => {
	const createdUser = (
		await db
			.insert(userTable)
			.values({ universityMail, name, status: "verified", role: "user", picture })
			.returning({ id: userTable.id })
	)[0];
	const user = await getAuthUser("id", createdUser.id);
	if (user === null) {
		throw new Error("[Auth] Failed to fetch newly created university user");
	}
	return user;
};

export const createStudent = async (
	universityMail: string,
	name: string,
	picture: string,
	batch: string,
	course: string
) => {
	const random: RandomReader = {
		read(bytes: Uint8Array): void {
			crypto.getRandomValues(bytes);
		}
	};

	const studentId = generateRandomString(random, alphabet, 10);
	const userId = generateRandomString(random, alphabet, 10);

	const [user, student] = await db.batch([
		db.insert(userTable).values({
			id: userId,
			universityMail,
			name,
			role: "student",
			picture,
			metadata: {
				student_id: studentId
			},
			status: "verified"
		}),
		db.insert(studentTable).values({ id: studentId, batch, course, userId: userId })
	]);

	return {
		id: studentId,
		userId: userId,
		picture,
		batch,
		course
	};
};

export const createSession = async (
	token: string,
	userId: string
): Promise<Omit<UserSession, "user" | "createdAt" | "updatedAt">> => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const session = (
		await db
			.insert(userSessionTable)
			.values({
				id: sessionId,
				userId,
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
			})
			.onConflictDoUpdate({
				target: userSessionTable.id,
				set: { expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) }
			})
			.returning()
	)[0];

	return {
		id: session.id,
		userId: session.userId,
		expiresAt: session.expiresAt
	};
};
