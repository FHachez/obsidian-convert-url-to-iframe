import { DropdownComponent } from "obsidian";
import { AspectRatioType } from "src/types/aspect-ratio";

export function createAspectRatioInput(iframeRatioContainer: HTMLElement, onAspectRatioUpdate: (aspectRatio: AspectRatioType) => void): HTMLDivElement {
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

	ratioInput.onChange(onAspectRatioUpdate)

	return aspectRatioInputContainer;
}