import { Comperators, UsageComperators } from "./types"

export function isUsageComperators<T extends {}>(x: Partial<Comperators<T>> | Partial<UsageComperators<T>>): x is UsageComperators<T> {
	return typeof (Object.values(x)?.[0]) === "string" || false
}

export function isComperators<T extends {}>(x: Partial<Comperators<T>> | Partial<UsageComperators<T>>): x is Comperators<T> {
	return typeof (Object.values(x)?.[0]) === "function" || false
}