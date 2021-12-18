
import { Notice, Plugin } from 'obsidian';

import { isUrl, updateUrlIfYoutube } from './utils/url_converter';
import { ConfigureIframeModal } from './configure_iframe_modal';

export default class FormatNotionPlugin extends Plugin {
	async onload() {
		console.log('Loading obsidian-convert-url-to-iframe');
		this.addCommand({
			id: "url-to-iframe",
			name: "URL to iframe/preview",
			callback: () => this.urlToIframe(),
			hotkeys: [
				{
					modifiers: ["Alt"],
					key: "i",
				},
			],
		});
	}

	urlToIframe(): void {
		const activeLeaf: any = this.app.workspace.activeLeaf;
		const editor = activeLeaf.view.sourceMode.cmEditor;
		const selectedText = editor.somethingSelected()
			? editor.getSelection()
			: false;

		if (selectedText && isUrl(selectedText)) {
			const url = updateUrlIfYoutube(selectedText)
			const modal = new ConfigureIframeModal(this.app, url, editor)
			modal.open();
		} else {
			new Notice('Select a URL to convert to an iframe.');
		}
	}
}
