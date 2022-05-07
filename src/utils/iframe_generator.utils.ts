import { hasProvider, extract, VideoTypeData} from 'oembed-parser'
import * as DOMPurify from 'dompurify'



const buildDefaultIframe = (url: string) => {
    return `<iframe src=${url} allow="fullscreen" allowfullscreen style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>`
}

export const getIframeGeneratorFromSanitize = (sanitize: typeof DOMPurify.sanitize) => async (url: string): Promise<string> => {
    const defaultHtml = buildDefaultIframe(url);
    if (!hasProvider(url)) {
        return defaultHtml
    }

    try {
        // Get the Oemb
        const oembedData = await extract(url);

        if(oembedData && oembedData.type !== 'rich' && oembedData.type !=='video') {
            throw new Error('Not a rich or video type:' + oembedData )
        }
        
        // Both Rich and Video types have an html property
        const html = (oembedData as VideoTypeData)?.html;

        // We only allow an iframe
        const cleanedHtml = sanitize(html, { ALLOWED_TAGS: ["iframe"]})

        if(!cleanedHtml.startsWith('<iframe')) {
            // It would mess up our handling of iframe for the resizing and aspec ratio
            throw new Error('Not an iframe, we currently do not support this: ' + html )
        }

        return cleanedHtml
    } catch (e) {
        console.warn(`Could not get oembed data for ${url}`, e);
        return defaultHtml
    }
}

export const getIframe = getIframeGeneratorFromSanitize(DOMPurify.sanitize);

