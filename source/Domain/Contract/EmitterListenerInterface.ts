import { EmissionInterface } from "./EmissionInterface";

export interface EmitterListenerInterface<T extends { [K in EmissionInterface['type']]: EmissionInterface }> {
	on<K extends keyof T>(type: K, listener: (emission: T[K]) => void): void;
	once<K extends keyof T>(type: K, listener: (emission: T[K]) => void): void;
	off<K extends keyof T>(type: K, listener: (emission: T[K]) => void): void;
}
