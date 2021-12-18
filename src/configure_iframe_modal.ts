import { App, Modal } from 'obsidian';
import { createAspectRatioInput } from './components/aspect_ratio_input';
import { createIframeContainerEl, createIframeContainerElLegacy } from './components/resizable_iframe_container';
import { doesSupportAspectRatio } from './constant';



export class ConfigureIframeModal extends Modal {
	url: string;
	editor: any;

	constructor(app: App, url: string, editor: any) {
		super(app);
		this.url = url;
		this.editor = editor;

		// Allow the modal to grow in width
		this.containerEl.className += ' iframe__modal';
	}

	onOpen() {
		const { contentEl } = this;

		const container = contentEl.createEl('div');
		container.className = 'iframe__modal__container';

		const title = contentEl.createEl('h2');
		title.innerText = "This is how the link is going to look";

		const subTitle = contentEl.createEl('div');
		const outdatedObsidianWarning = doesSupportAspectRatio? "": "</br><strong>For the best experience, please re-download Obsidian to get the latest Electron version</strong>.";
		subTitle.innerHTML = "To choose the size, drag the <strong>bottom right</strong> (the preview won't respect the note width)." + outdatedObsidianWarning;

		// Electron < 12 doesn't support the aspect ratio. We need to use a fancy div container with a padding bottom
		const { iframeContainer, outputHtml, resetToDefaultWidth, updateAspectRatio } = doesSupportAspectRatio ?
			createIframeContainerEl(contentEl, this.url) : createIframeContainerElLegacy(contentEl, this.url);
		const widthCheckbox = createShouldUseDefaultWidthButton(container, resetToDefaultWidth);
		const aspectRatioInput = createAspectRatioInput(container ,updateAspectRatio);


		const buttonContainer = contentEl.createEl('div');
		buttonContainer.className = 'button__container space-y';

		const cancelButton = buttonContainer.createEl('button');
		cancelButton.setText('Cancel');
		cancelButton.onclick = (e) => {
			e.preventDefault();
			this.close();
		};

		const okButton = buttonContainer.createEl('button');
		okButton.setText('OK');
		okButton.className = 'mod-warning';
		okButton.onclick = (e) => {
			e.preventDefault();

			this.editor.replaceSelection(outputHtml());
			this.close();
		};


		container.appendChild(title);
		container.appendChild(subTitle);
		container.appendChild(aspectRatioInput);
		container.appendChild(widthCheckbox);
		container.appendChild(iframeContainer);
		container.appendChild(buttonContainer);
		contentEl.appendChild(container);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}


export function createShouldUseDefaultWidthButton(container: HTMLElement, onClick: () => void): HTMLDivElement {
	const name = "shouldUseDefaultWidth";
	const checkboxContainer = container.createEl('div');
	checkboxContainer.className = 'space-y'

	const label = checkboxContainer.createEl('button');
	label.setAttribute('for', name);
	label.innerText = 'Match the note width (reset the size)';

	label.onclick = onClick;

	return checkboxContainer;
};

