import { EmissionInterface } from "./EmissionInterface";

export type EmissionMap<T extends { [K in EmissionInterface['type']]: EmissionInterface }> = {
	[K in keyof T]: EmissionInterface;
}
