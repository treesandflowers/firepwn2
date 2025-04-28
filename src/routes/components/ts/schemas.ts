import * as z from "zod";

export const available_operations = ["get", "set", "update", "delete"] as const;

export const firebase_config_schema = z.object({
	apiKey: z.string().min(1),
	projectId: z.string().min(1),
	appId: z.string().min(1),
	databaseURL: z.string().optional()
});

export const firestore_fields_schema = z.discriminatedUnion("method", [
	z.object({
		collection: z.string().min(1),
		documentId: z.string().optional(),
		data: z.string().optional(),
		method: z.literal("get")
	}),

	z.object({
		collection: z.string().min(1),
		documentId: z.string().min(1),
		data: z.string().min(1),
		method: z.enum(["set", "update"])
	}),

	z.object({
		collection: z.string().min(1),
		documentId: z.string().min(1),
		data: z.string().optional(),
		method: z.literal("delete")
	})
]);

export const rtdb_fields_schema = z.discriminatedUnion("method", [
	z.object({
		path: z.string().min(1),
		data: z.string().optional(),
		method: z.literal(["get", "delete"])
	}),

	z.object({
		path: z.string().min(1),
		data: z.string().min(1),
		method: z.enum(["set", "update"])
	})
]);

export const firebase_auth_schema = z.object({
	email: z.email(),
	password: z.string().min(6)
});
