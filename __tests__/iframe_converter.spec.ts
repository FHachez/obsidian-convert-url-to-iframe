import { isUrl, updateUrlIfYoutube } from '../iframe_converter';

describe('updateUrlIfYoutube', () => {
	const inputToExpectedOutput = [
		["https://github.com/", "https://github.com/"],
		["https://www.youtube.com/embed/FY7D_KM-xBw", "https://www.youtube.com/embed/FY7D_KM-xBw"],
		["https://www.youtube.com/watch?v=FY7DtKMBxBw", "https://www.youtube.com/embed/FY7DtKMBxBw"],
		["https://www.youtube.co.uk/watch?v=FY7DtKMBxBw", "https://www.youtube.co.uk/embed/FY7DtKMBxBw"],
		["https://www.youtube.com/watch?v=FY7D_KM-xBw", "https://www.youtube.com/embed/FY7D_KM-xBw"],
		["https://www.youtube.com/embed/FY7DtKMBxBw", "https://www.youtube.com/embed/FY7DtKMBxBw"],
		["https://youtu.be/FKh8hjJNhWc?t=10027", "https://www.youtube.be/embed/FKh8hjJNhWc?start=10027"],
		["https://youtu.co.uk/FKh8hjJNhWc?t=10027", "https://www.youtube.co.uk/embed/FKh8hjJNhWc?start=10027"],
		["https://www.youtube.com/watch?v=DLMkT_FHczU&ab_channel=HughJeffreysHughJeffreys", "https://www.youtube.com/embed/DLMkT_FHczU"]
	]
	it.each(inputToExpectedOutput)('should correctly parse "%s"', (input: string, expected) => {
		const output = updateUrlIfYoutube(input);

		expect(output).toStrictEqual(expected)
	})
})

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
