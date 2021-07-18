import { App, DropdownComponent, Modal } from 'obsidian';


const defaultHeight = "300px"

export class ConfigureIframeModal extends Modal {
	url: string;
	sucess: boolean;
	generatedIframe: string;
	editor: any;

	constructor(app: App, url: string, editor: any) {
		super(app);
		this.url = url;
		this.editor = editor;

		// Allow the modal to grow in width
		this.containerEl.className += ' iframe__modal';
	}

	onOpen() {
		let { contentEl } = this;

		const container = contentEl.createEl('div');
		container.className = 'iframe__modal__container';

		const title = contentEl.createEl('h2');
		title.innerText = "This is how the iframe is going to look";

		const subTitle = contentEl.createEl('div');
		subTitle.innerText = "To choose the size, drag the bottom right";

		const {iframeContainer, iframeAspectRatioContainer } = createIframeContainerEl(contentEl, this.url);
		const widthCheckbox = createShouldUseDefaultWidthCheckbox(iframeContainer, iframeAspectRatioContainer);
		const aspectRatioInput = createAspectRatioInput(iframeAspectRatioContainer);

		const cancelButton = contentEl.createEl('button');
		cancelButton.setText('Cancel');
		cancelButton.onclick = (e) => {
			e.preventDefault();
			this.close();
		};

		const okButton = contentEl.createEl('button');
		okButton.setText('OK');
		okButton.className = 'mod-warning';
		okButton.onclick = (e) => {
			e.preventDefault();

			iframeContainer.className = "";
			// Recompute the height to remove the possible empty space
			iframeContainer.style.height = iframeAspectRatioContainer.offsetHeight + 'px';
			const generatedIframe = iframeAspectRatioContainer.outerHTML;
			this.editor.replaceSelection(generatedIframe);
			this.close();
		};


		const buttonContainer = contentEl.createEl('div');
		buttonContainer.className = 'button__container space-x';
		buttonContainer.appendChild(okButton);
		buttonContainer.appendChild(cancelButton);

		container.appendChild(title);
		container.appendChild(subTitle);
		container.appendChild(aspectRatioInput);
		container.appendChild(widthCheckbox);
		container.appendChild(iframeContainer);
		container.appendChild(buttonContainer);
		contentEl.appendChild(container);
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}

export function createIframeContainerEl(contentEl: HTMLElement, url: string): { iframeContainer: HTMLElement, iframeAspectRatioContainer: HTMLElement } {
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
		iframeAspectRatioContainer: ratioContainer
	};
}


export function createShouldUseDefaultWidthCheckbox(iframeContainer: HTMLElement, iframeAspectRatioContainer: HTMLElement): HTMLDivElement {
	const name = "shouldUseDefaultWidth";
	const checkboxContainer = iframeContainer.createEl('div');
	checkboxContainer.className = 'space-x'

	const label = checkboxContainer.createEl('button');
	label.setAttribute('for', name);
	label.innerText = 'Match the note width';

	label.onclick = (e) => {
		iframeContainer.style.width = '100%';
		iframeContainer.style.height = iframeAspectRatioContainer.offsetHeight + 'px';
	}

	return checkboxContainer;
}


export function createAspectRatioInput(iframeRatioContainer: HTMLElement): HTMLDivElement {
	const aspectRatioInputContainer = iframeRatioContainer.createEl('div');
	const heightInputName = "heightValue";
	aspectRatioInputContainer.className = "space-x"

	const heightInputLabel = aspectRatioInputContainer.createEl('label');
	heightInputLabel.setAttribute('for', heightInputName);
	heightInputLabel.innerText = 'Aspect Ratio: ';

	const ratioInput = new DropdownComponent(aspectRatioInputContainer)
	ratioInput.addOptions({
		'9/16': '16/9', 
		'3/4': '4/3', 
		'none': 'none' 
	})

	ratioInput.onChange((value) => {
		if (value === 'none') {
			iframeRatioContainer.style.paddingBottom = '0px';
			iframeRatioContainer.style.height = '100%';
		} else {
			iframeRatioContainer.style.paddingBottom = 'calc(var(--aspect-ratio) * 100%)';
			iframeRatioContainer.style.height = '0px';
		}
		iframeRatioContainer.style.setProperty('--aspect-ratio', value);
	})

	return aspectRatioInputContainer;
}
