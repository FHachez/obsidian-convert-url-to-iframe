import { AspectRatioType } from "src/types/aspect-ratio";

export const swapRatio = (ratio: AspectRatioType) => {
    if('none' === ratio) {
        return ratio;
    }

    const [a,b] = ratio.split('/');
    return `${b}/${a}`;``
}
