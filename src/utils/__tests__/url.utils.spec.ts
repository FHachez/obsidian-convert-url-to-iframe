import { isUrl } from "../url.utils";

describe('isUrl', () => {
	const inputToExpectedOutput = [
		["Quotes at vault/test.md", false],
		["https://github.com/", true],
		["https://www.youtube.com/watch?v=FY7DtKMBxBw", true],
	]
	it.each(inputToExpectedOutput)('should correctly parse "%s"', (input: string, expected) => {
		const output = isUrl(input);

		expect(output).toStrictEqual(expected)
	})
})
