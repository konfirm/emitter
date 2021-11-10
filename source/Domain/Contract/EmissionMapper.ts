import { Emission } from "./Emission";

export type EmissionMapper<T extends Emission> = {
	[K in T['type']]: T;
};
