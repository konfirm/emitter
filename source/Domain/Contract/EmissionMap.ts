import { Emission } from "./Emission";

export type EmissionMap<T extends { [K in Emission['type']]: Emission }> = {
	[K in keyof T]: Emission;
}
