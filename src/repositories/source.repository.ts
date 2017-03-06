import { ISource } from "../models/models";
import _ from 'lodash';

export class SourceRepository {

    maptoSources(objects: any[]): Array<ISource> {
        if (objects.length) {
            return _.map(objects, (item) => {

            })
        }
    }
}