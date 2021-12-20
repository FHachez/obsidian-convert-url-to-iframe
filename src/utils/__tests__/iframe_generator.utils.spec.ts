import * as DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom';

import { getIframeGeneratorFromSanitize} from '../iframe_generator.utils';

describe('getIframeNode', () => {
	const getIframe = getIframeGeneratorFromSanitize(DOMPurify(new JSDOM('').window as unknown as Window).sanitize);

	const inputToExpectedOutput = [
		["https://github.com/", '<iframe src=https://github.com/ allow="fullscreen" style="height:100%;width:100%; aspect-ratio=16/9;"></iframe>'],
		["https://www.youtube.com/watch?v=zU2-QMP5e5g", '<iframe src="https://www.youtube.com/embed/zU2-QMP5e5g?feature=oembed" height="113" width="200"></iframe>'],
		["https://soundcloud.com/marshmellomusic/sets/marshmello-x-lil-dusty-g", '<iframe src="https://w.soundcloud.com/player/?visual=true&amp;url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F1338967234&amp;show_artwork=true" height="450" width="100%"></iframe>'],
	]
	it.each(inputToExpectedOutput)('should correctly parse "%s"', async (input: string, expected) => {
		const output = await getIframe(input);

		expect(output).toStrictEqual(expected)
	})
})
