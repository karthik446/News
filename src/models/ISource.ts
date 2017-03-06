export interface IUrlstoLogos {
    small: string;
    medium: string;
    large: string;
}

export interface ISource {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
    sortBysAvailable: Array<string>;
    urlsToLogos: IUrlstoLogos
}