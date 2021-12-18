
declare namespace process {
    var versions: {
        electron: `${number}/${number}/${number}`;
    }
}

export const defaultHeight = "100px"

const electronMajorVersion = process.versions?.electron?.split('.')[0]
export const doesSupportAspectRatio = +(electronMajorVersion) >= 12;