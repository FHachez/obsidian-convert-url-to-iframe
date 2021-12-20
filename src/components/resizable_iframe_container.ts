import { defaultHeight } from "src/constant";
import { AspectRatioType } from "src/types/aspect-ratio";
import { addAspectRatio, swapRatio } from "src/utils/ratio.utils";

export interface IResizableIframeContainerOutput {
    iframeContainer: HTMLElement,
    outputHtml: () => string,
    updateAspectRatio: (aspectRatio: AspectRatioType) => void,
    resetToDefaultWidth: () => void,
}


export function createIframeContainerEl(contentEl: HTMLElement, iframeHtml: string): IResizableIframeContainerOutput{
	// Container to keep a min height for the iframe to keep the content visible
	const iframeContainer = contentEl.createEl('div');
	iframeContainer.className = "iframe__container space-y"

	// Inline styling to make sure that the created iframe will keep the style even without the plugin
	const fragment = document.createElement('template');
	fragment.innerHTML = iframeHtml;

	const  iframe = fragment.content.firstChild as HTMLIFrameElement;
	iframeContainer.appendChild(iframe);

	console.log(iframe.outerHTML)
	addAspectRatio(iframe);

    const resetToDefaultWidth= () => {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
        };
	
	resetToDefaultWidth();

	console.log(iframeHtml, iframe)

	return {
        iframeContainer,
        updateAspectRatio: (value) => {
            if (value === 'none') {
            	iframe.style.removeProperty('aspect-ratio');
            } else {
            	iframe.style.setProperty('aspect-ratio', value);
				resetToDefaultWidth();
            }
        },
        outputHtml: () => {
			return iframe.outerHTML;

        },
        resetToDefaultWidth,
	};
}

// Electron < 12 doesn't support the aspect ratio. We need to use a fancy div container with a padding bottom
export function createIframeContainerElLegacy(contentEl: HTMLElement, url: string): IResizableIframeContainerOutput{
	// Inline styling to make sure that the created iframe will keep the style even without the plugin

	// This container can be resized
	const iframeContainer = contentEl.createEl('div');
	iframeContainer.className = "iframe__container__legacy space-y"
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
            ratioContainer.style.setProperty('--aspect-ratio', swapRatio(value));
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
