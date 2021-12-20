
import { Editor, MarkdownView, Menu, Notice, Plugin } from 'obsidian';

import { getIframe} from './utils/iframe_generator.utils';
import { ConfigureIframeModal } from './configure_iframe_modal';
import { isUrl } from './utils/url.utils';

export default class FormatNotionPlugin extends Plugin {
	async onload() {
		console.log('Loading obsidian-convert-url-to-iframe');
		this.addCommand({
			id: "url-to-iframe",
			name: "URL to Preview/Iframe",
			callback: () => this.urlToIframe(),
			hotkeys: [
				{
					modifiers: ["Alt"],
					key: "i",
				},
			],
		});

		// Editor mode (right click on text)
		this.registerEvent(this.app.workspace.on('editor-menu',
			(menu: Menu, _: Editor, view: MarkdownView) => {
				const url = this.getCleanedUrl();
				if (url) {
					menu.addItem((item) => {
						item.setTitle("Url to Preview/Iframe")
							.setIcon("create-new")
							.onClick((_) => {
								this.urlToIframe(url);
							});
					});
				}
			}));

	}

	async urlToIframe(inputUrl?: string): Promise<void> {
		const activeLeaf: any = this.app.workspace.activeLeaf;
		const editor = activeLeaf.view.sourceMode.cmEditor;

		const url = inputUrl || this.getCleanedUrl()

		if (url) {
			const iframeHtml = await getIframe(url)
			const modal = new ConfigureIframeModal(this.app, iframeHtml, editor)
			modal.open();
		} else {
			new Notice('Select a URL to convert to an preview/iframe.');
		}
	}

	private getCleanedUrl(): string {
		const activeLeaf: any = this.app.workspace.activeLeaf;
		const editor = activeLeaf.view.sourceMode.cmEditor;
		const selectedText: string = editor.somethingSelected() ? editor.getSelection() : null;
		const cleanedText = selectedText?.trim();

		if (selectedText && isUrl(cleanedText)) {
			return cleanedText
		}
		return null;
	}

}
