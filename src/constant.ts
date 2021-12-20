
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace process {
    let versions: {
        electron: `${number}/${number}/${number}`;
    }
}

export const defaultHeight = "100px"

const electronMajorVersion = process.versions?.electron?.split('.')[0]
export const doesSupportAspectRatio = +(electronMajorVersion) >= 12;
