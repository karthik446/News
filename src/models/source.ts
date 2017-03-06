import { ISource, IUrlstoLogos } from "./isource";
/**
 * Source Class
 */
export class Source implements ISource {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
    sortBysAvailable: string[];
    urlsToLogos: IUrlstoLogos;
}