import { defaultHeight } from "src/constant";
import { AspectRatioType } from "src/types/aspect-ratio";

export interface IResizableIframeContainerOutput {
    iframeContainer: HTMLElement,
    outputHtml: () => string,
    updateAspectRatio: (aspectRatio: AspectRatioType) => void,
    resetToDefaultWidth: () => void,
}


export function createIframeContainerEl(contentEl: HTMLElement, url: string): IResizableIframeContainerOutput{
	// Inline styling to make sure that the created iframe will keep the style even without the plugin

	// This container can be resized
	const iframeContainer = contentEl.createEl('div');
	iframeContainer.className = "iframe_container space-x"
	iframeContainer.style.overflow = 'auto';
	iframeContainer.style.resize = 'both';
	iframeContainer.style.height = defaultHeight;

	// This container enforce the aspect ratio. i.e. it's height is based on the width * ratio
	const ratioContainer = iframeContainer.createEl('div');
	ratioContainer.style.display = 'block'
	ratioContainer.style.position = 'relative';
	ratioContainer.style.width = '100%';
	// The height is determined by the padding which respect the ratio
	// See https://www.benmarshall.me/responsive-iframes/
	ratioContainer.style.height = "0px";
	ratioContainer.style.setProperty('--aspect-ratio', '9/16');
	ratioContainer.style.paddingBottom = 'calc(var(--aspect-ratio) * 100%)';

	const iframe = ratioContainer.createEl('iframe');
	iframe.src = url;
	iframe.allow = "fullscreen"
	iframe.style.position = 'absolute';
	iframe.style.top = '0px';
	iframe.style.left = '0px';
	iframe.style.height = '100%';
	iframe.style.width = '100%';

	// Recompute the iframe height with the ratio to avoid any empty space
	iframeContainer.style.height = ratioContainer.offsetHeight + 'px';

	return {
        iframeContainer,
        updateAspectRatio: (value) => {
            if (value === 'none') {
                ratioContainer.style.paddingBottom = '0px';
                ratioContainer.style.height = '100%';
            } else {
                ratioContainer.style.paddingBottom = 'calc(var(--aspect-ratio) * 100%)';
                ratioContainer.style.height = '0px';
            }
            ratioContainer.style.setProperty('--aspect-ratio', value);
        },
        outputHtml: () => {
			iframeContainer.className = "";
			// Recompute the height to remove the possible empty space
			iframeContainer.style.height = ratioContainer.offsetHeight + 'px';
			return ratioContainer.outerHTML;

        },
        resetToDefaultWidth: () => {

            iframeContainer.style.width = '100%';
            iframeContainer.style.height = ratioContainer.offsetHeight + 'px';
        },
	};
}