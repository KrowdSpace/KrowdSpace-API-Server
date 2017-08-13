import {RestURL, safeJSON} from '@otter-co/ottlib';
import * as superE from '@otter-co/ottlib';

namespace extras 
{
    export namespace mongodb_extra 
    {
        export class MongoDBDataGetter extends superE.extras.mongodb_extra.MongoDBDataGetter {};
    }
}

export class StatsURL extends RestURL implements RestURL
{
    public static url = "/v1/stats";
    public static type = "post";

    public async onLoad(rest, data, cooks)
    {
        let totalProjects = 0,
            totalRewards = 0,
            totalRaised = 0;
        
        extras.mongodb_extra.MongoDBDataGetter;
        
        let projG = <extras.mongodb_extra.MongoDBDataGetter> this.dataG['projects_getter'];

        let pCount = await projG.collection.count({});

        let projR = await projG.agg([
            {$match: {}},
            {$group: {
                _id: "$platform",
                raisedAmount: { $sum: "$project_data.meta_data.raised" },
                rewardAmmount: { $sum: "$project_data.info_data.reward_ammount" }
            }, }
        ]);
        
        totalProjects = pCount;

        this.end(rest, {success: true, data: { totalProjects, projR} });
    }
}

export default [
    StatsURL,
];