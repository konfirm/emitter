import { EmissionInterface } from "./EmissionInterface";

export interface EmitterListenerInterface<T extends { [K in EmissionInterface['type']]: EmissionInterface }> {
	on(type: keyof T, listener: (emission: T[typeof type]) => void): void;
	once(type: keyof T, listener: (emission: T[typeof type]) => void): void;
	off(type: keyof T, listener: (emission: T[typeof type]) => void): void;
}
