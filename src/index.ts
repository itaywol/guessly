import { DefaultComperators, builtInComperators } from "./comperators"
import { isComperators, isUsageComperators } from "./typeGuards"
import { BuiltInComperators, Comperator, Comperators, MatchingEngine, UsageComperators } from "./types"


function comperatorsFieldsExistsInObject<T extends {}>(object: T, comperators: Partial<Comperators<T>>): boolean {
	const fieldsForTest = Object.keys(comperators)
	for (const field of fieldsForTest) {
		if (!(field in object)) {
			return false
		}
	}

	return true
}


export function NewMatchingEngine<T extends {}>(args: { goal: T, comperators: Partial<UsageComperators<T>> | Partial<Comperators<T>> }): MatchingEngine<T> {
	const { goal, comperators } = args

	const localBuiltInComperators: BuiltInComperators<T> = builtInComperators

	let comperatorsToUse: Partial<Comperators<T>> = {}

	if (typeof goal !== "object" && Object.entries(goal).length === 0) {
		throw new Error("NewMatchingEngine: provided goal parameter is empty or isn't an object")
	}


	if (isUsageComperators(comperators)) {
		const entries = Object.entries<DefaultComperators>(comperators)
		if (entries.length === 0) {
			throw new Error("NewMatchingEngine: must provide at least one usage comperator or comperator in comperators argument")
		}

		for (const [field, comperatorKey] of entries) {
			if (typeof comperatorKey === "string" && comperatorKey in builtInComperators) {
				comperatorsToUse = { ...comperatorsToUse, [field]: localBuiltInComperators[comperatorKey] }
			}
		}
	}

	if (isComperators(comperators)) {
		comperatorsToUse = comperators
	}

	if (Object.entries(comperatorsToUse).length === 0) {
		throw new Error("NewMatchingEngine: couldn't create valid comperators dictionary for matching")
	}

	if (!comperatorsFieldsExistsInObject(goal, comperatorsToUse)) {
		throw new Error("NewMatchingEngine: not all comperators fields are existing in the provided goal object")
	}

	return {
		async match(pick) {
			if (!comperatorsFieldsExistsInObject(pick, comperatorsToUse)) {
				throw new Error(`match: not all comperators fields are existing the provided pick object`)
			}

			const definitions: [keyof T, Comperator<T>][] = Object.entries(comperatorsToUse) as [keyof T, Comperator<T>][]

			const results = await Promise.all(definitions.map(async ([field, comperator]) => await comperator(field, pick, goal)))

			return results
		}
	}
}
