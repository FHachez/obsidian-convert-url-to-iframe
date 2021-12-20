import { AspectRatioType } from "src/types/aspect-ratio";

export const swapRatio = (ratio: AspectRatioType) => {
    if('none' === ratio) {
        return ratio;
    }

    const [a,b] = ratio.split('/');
    return `${b}/${a}`;``
}

export const addAspectRatio = (iframe: HTMLIFrameElement): HTMLIFrameElement => {
    console.log(JSON.stringify(iframe.style), iframe.style.aspectRatio.toString())
    if (iframe?.style.getPropertyValue('aspect-ratio') || iframe?.style.aspectRatio) {
        return iframe
    }

    const ratio = iframe.offsetWidth/ iframe.offsetHeight;
    iframe.style.setProperty('aspect-ratio', ratio.toString());
    console.log('Set ratio', iframe.offsetWidth, iframe.offsetHeight, 'computed', ratio);

    return iframe
}
