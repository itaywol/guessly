import { BuiltInComperators, Comperator } from "./types";

export type DefaultComperators = "NumericEquality"|"NumericEqualityAbsCloseness" | "StringEquality" | "StringEqualityWithInclusionCloseness"

export const builtInComperators: BuiltInComperators<any> = {
	"NumericEqualityAbsCloseness": (f, a, b) => ({ field: f, match: a[f] === b[f], closeness: Math.abs(+a[f] - (+b[f])) }),
	"NumericEquality": (f, a, b) => ({ field: f, match: a[f] === b[f], closeness: (+a[f] - (+b[f])) }),
	"StringEquality": (f, a, b) => ({ field: f, match: a[f] === b[f] }),
	"StringEqualityWithInclusionCloseness": (f, a, b) => ({ field: f, match: a[f] === b[f], closeness: b[f] === a[f] ? 2 : typeof b[f] === "string" && typeof a[f] === "string" && b[f].toLowerCase().includes(a[f].toLowerCase()) ? 1 : 0 }),
}

export const stringComperatorCombinatoricalCloseness:<T extends {}>(groupingField:keyof T)=>Comperator<T> = (gf)=>(f,a,b)=>({field:f,match:a[f]===b[f],closeness:a[f]===b[f] ? 2 : a[gf]===b[gf] ? 1 : 0})