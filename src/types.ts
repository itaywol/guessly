
type MatchingResult<T extends {}> = {
	field: keyof T
	match: boolean
	closeness?: number | string | boolean
}

export type Comperator<T extends {}> = (field: keyof T, a: T, b: T) => MatchingResult<T> | Promise<MatchingResult<T>>

export type Comperators<T extends {}> = Record<keyof T, Comperator<T>>

export type DefaultComperators = "NumericEquality" | "StringEquality" | "StringEqualityWithInclusionCloseness"

export type BuiltInComperators<T extends {}> = Record<DefaultComperators, Comperator<T>>

export type UsageComperators<T extends {}> = Record<keyof T, DefaultComperators>

export interface MatchingEngine<T extends {}> {
	match(pick: T): MatchingResult<T>[] | Promise<MatchingResult<T>[]>
}