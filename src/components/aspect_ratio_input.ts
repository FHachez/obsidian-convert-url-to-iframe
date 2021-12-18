import { DropdownComponent } from "obsidian";
import { AspectRatioType } from "src/types/aspect-ratio";

export function createAspectRatioInput(iframeRatioContainer: HTMLElement, onAspectRatioUpdate: (aspectRatio: AspectRatioType) => void): HTMLDivElement {
	const aspectRatioInputContainer = iframeRatioContainer.createEl('div');
	const heightInputName = "heightValue";
	aspectRatioInputContainer.className = "space-y"

	const heightInputLabel = aspectRatioInputContainer.createEl('label');
	heightInputLabel.setAttribute('for', heightInputName);
	heightInputLabel.innerText = 'Aspect Ratio: ';

	const ratioInput = new DropdownComponent(aspectRatioInputContainer)
	ratioInput.addOptions({
		'16/9': '16/9', 
		'4/3': '4/3', 
        '1/1': '1/1',
		'none': 'none' 
	})

	ratioInput.onChange(onAspectRatioUpdate)

	return aspectRatioInputContainer;
}