import type { FirebaseApp } from "firebase/app";
import type { DocumentData } from "firebase/firestore";
import type z from "zod";

import type {
	firebase_auth_schema,
	firebase_config_schema,
	firestore_fields_schema,
	rtdb_fields_schema
} from "./schemas";

export interface PropBase {
	firebase_instance?: FirebaseApp | null;
	is_firebase_initialized?: boolean;
}

export interface Response {
	response: DocumentData | DocumentData[] | undefined | null;
	highlighted: string | undefined | null;
	loading: boolean;
}

export enum TabState {
	ProjectSettings = "Project Settings",
	Firestore = "Firestore",
	RTDB = "RTDB"
}

export enum AuthMethod {
	SignIn,
	SignUp,
	Google,
	Apple,
	Facebook,
	Twitter,
	Github
}

export type FirebaseConfig = z.infer<typeof firebase_config_schema>;
export type FirebaseAuth = z.infer<typeof firebase_auth_schema>;
export type FirestoreFields = z.infer<typeof firestore_fields_schema>;
export type RtdbFields = z.infer<typeof rtdb_fields_schema>;
