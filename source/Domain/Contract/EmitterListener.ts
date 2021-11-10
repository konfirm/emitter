import { Emission } from "./Emission";

export interface EmitterListener<T extends { [K in Emission['type']]: Emission }> {
	on(type: keyof T, listener: (emission: T[typeof type]) => void): void;
	once(type: keyof T, listener: (emission: T[typeof type]) => void): void;
	off(type: keyof T, listener: (emission: T[typeof type]) => void): void;
}
