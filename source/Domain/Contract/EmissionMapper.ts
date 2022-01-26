import { EmissionInterface } from "./EmissionInterface";

export type EmissionMapper<T extends EmissionInterface> = {
	[K in T['type']]: T;
};
