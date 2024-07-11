import { expect, test } from "vitest"
import { builtInComperators, stringComperatorCombinatoricalCloseness } from "./comperators"
import { NewMatchingEngine } from "./index"

test("Should throw on engine creation", async () => {
	expect(() => NewMatchingEngine<{ field: number }>({ goal: { field: 2 }, comperators: {} })).toThrow()
	expect(() => NewMatchingEngine<{ field: number }>({ goal: {} as any, comperators: 2 as any })).toThrow()
	expect(() => NewMatchingEngine<{ field: number }>({ goal: {} as any, comperators: { field: "NumericEquality" } })).toThrow()
	expect(() => NewMatchingEngine<{ field: number }>({ goal: 2 as any, comperators: { field: "NumericEquality" } })).toThrow()
})

test("Should throw on executing match", async () => {
	const engine = NewMatchingEngine<{ field: number }>({ goal: { field: 2 }, comperators: { field: "NumericEquality" } })

	let invocation = async () => await engine.match({} as any)
	await expect(invocation).rejects.toThrow()

	invocation = async () => await engine.match("blabla" as any)
	await expect(invocation).rejects.toThrow()

	invocation = async () => await engine.match(2 as any)
	await expect(invocation).rejects.toThrow()
})

test('NumericEquality comperator', async () => {
	const engine = NewMatchingEngine<{ field: number }>({ goal: { field: 2 }, comperators: { field: "NumericEquality" } })

	expect(await engine.match({ field: 2 })).toEqual([{ field: "field", match: true, closeness: 0 }])
	expect(await engine.match({ field: 4 })).toEqual([{ field: "field", match: false, closeness: 2 }])
	expect(await engine.match({ field: 0 })).toEqual([{ field: "field", match: false, closeness: 2 }])
	expect(await engine.match({ field: -2 })).toEqual([{ field: "field", match: false, closeness: 4 }])
})

test('StringEquality comperator', async () => {
	const engine = NewMatchingEngine<{ field: string }>({ goal: { field: "goat" }, comperators: { field: "StringEquality" } })

	expect(await engine.match({ field: "goat" })).toEqual([{ field: "field", match: true }])
	expect(await engine.match({ field: "lola" })).toEqual([{ field: "field", match: false }])
})

test('StringEquality and NumbericEquality comperators', async () => {
	const engine = NewMatchingEngine<{ country: string, debutYear: number }>({ goal: { country: "netherlands", debutYear: 2012 }, comperators: { country: "StringEquality", debutYear: "NumericEquality" } })

	expect(await engine.match({ country: "netherlands", debutYear: 2012 })).toEqual([{ field: "country", match: true }, { field: "debutYear", match: true, closeness: 0 }])

	expect(await engine.match({ country: "israel", debutYear: 2010 })).toEqual([{ field: "country", match: false }, { field: "debutYear", match: false, closeness: 2 }])

	expect(await engine.match({ country: "netherlands", debutYear: 2010 })).toEqual([{ field: "country", match: true }, { field: "debutYear", match: false, closeness: 2 }])
})

test('StringEqualityWithInclusionCloseness comperator', async () => {
	const engine = NewMatchingEngine<{ field: string }>({ goal: { field: "goat" }, comperators: { field: "StringEqualityWithInclusionCloseness" } })

	expect(await engine.match({ field: "goat" })).toEqual([{ field: "field", match: true, closeness: 2 }])
	expect(await engine.match({ field: "at" })).toEqual([{ field: "field", match: false, closeness: 1 }])
	expect(await engine.match({ field: "ap" })).toEqual([{ field: "field", match: false, closeness: 0 }])
})

test('NumericEquality comperator with externally supplied comperator definition',async()=>{
	const engine = NewMatchingEngine<{year:number}>({goal:{year:2024},comperators:{year:builtInComperators["NumericEquality"]}})

expect(await engine.match({ year: 2024 })).toEqual([{ field: "year", match: true, closeness: 0 }])
expect(await engine.match({ year: 2022 })).toEqual([{ field: "year", match: false, closeness: 2 }])
})

test('String Combinator Comperator',async()=>{
	const engine = NewMatchingEngine<{group:string,subgroup:string}>({goal:{group:"asia",subgroup:"russia"},comperators:{subgroup:stringComperatorCombinatoricalCloseness("group")}})

	expect(await engine.match({ group: "asia",subgroup:"russia"})).toEqual([{ field: "subgroup", match: true, closeness: 2 }])
	expect(await engine.match({ group: "asia",subgroup:"isreal"})).toEqual([{ field: "subgroup", match: false, closeness: 1 }])
	expect(await engine.match({ group: "africa",subgroup:"egypt"})).toEqual([{ field: "subgroup", match: false, closeness: 0 }])
})
