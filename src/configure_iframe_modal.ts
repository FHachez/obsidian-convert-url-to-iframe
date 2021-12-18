import { App, DropdownComponent, Modal } from 'obsidian';
import { createAspectRatioInput } from './components/aspect_ratio_input';
import { createIframeContainerEl } from './components/resizable_iframe_container';



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
		subTitle.innerText = "To choose the size, drag the <strong>bottom right</strong> (the iframe won't respect the note width)";

		const {iframeContainer, outputHtml, resetToDefaultWidth, updateAspectRatio } = createIframeContainerEl(contentEl, this.url);
		const widthCheckbox = createShouldUseDefaultWidthCheckbox(container, resetToDefaultWidth);
		const aspectRatioInput = createAspectRatioInput(container ,updateAspectRatio);

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

			this.editor.replaceSelection(outputHtml());
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


export function createShouldUseDefaultWidthCheckbox(container: HTMLElement, onClick: () => void): HTMLDivElement {
	const name = "shouldUseDefaultWidth";
	const checkboxContainer = container.createEl('div');
	checkboxContainer.className = 'space-x'

	const label = checkboxContainer.createEl('button');
	label.setAttribute('for', name);
	label.innerText = 'Match the note width (reset the size)';

	label.onclick = onClick;

	return checkboxContainer;
};

