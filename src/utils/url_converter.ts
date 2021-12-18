export function updateUrlIfYoutube(url: string) {
    // Youtube url format: 
    // - youtube.com/.../?...&v=[Video Id]
    // - youtu.com/[Video Id]
    // - youtube.com/embed => don't do anything it's already an embed link
    const youtubeIdRegex = /(youtube(?<top_domain1>(\.\w{2,3}){1,2})\/([^\/]+\/.+\/|.*[?&]v=)|youtu(?<top_domain2>(\.\w{2,3}){1,2})\/)(?<id>[a-zA-Z0-9_-]{11})/gi;
    const id = youtubeIdRegex.exec(url)

    if (id) {
        const urlParameterMatches = url.match(/\?([^&]+)/);
        const urlParameters = new URLSearchParams(
            urlParameterMatches ? urlParameterMatches[0] : ''
        )

        // We need to remove the `v` parameter which contains the video id since we put it in the url
        urlParameters.delete('v')

        if (urlParameters.has('t')) {
            urlParameters.set('start', urlParameters.get('t'));
            urlParameters.delete('t')
        }

        const parameters = urlParameters.toString().length > 0 ? `?${urlParameters.toString()}` : '';
        const topDomain = id.groups['top_domain1'] || id.groups['top_domain2'] || ".com";

        return `https://www.youtube${topDomain}/embed/${id.groups['id']}${parameters}`;
    }
    return url;
}

export function isUrl(text: string): boolean {
    const urlRegex = new RegExp(
        "^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$"
    );
    return urlRegex.test(text);
}