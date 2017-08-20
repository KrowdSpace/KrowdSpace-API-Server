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
        
        let projG = <extras.mongodb_extra.MongoDBDataGetter> this.dataG['projects_getter'];

        let rid = await projG.get({none: false});

        let pKSC = projG.collection.count({platform:"kickstarter"});
        let pIDC = projG.collection.count({platform:"indiegogo"});
        let tC = projG.collection.count({});

        let ksC = await pKSC,
            idC = await pIDC,
            tc = await tC;

        let projR = await projG.agg([
            {$match: {}},
            {$group: {
                _id: "$platform",
                raisedAmount: { $sum: "$project_data.meta_data.raised" },
                rewardAmmount: { $sum: "$project_data.info_data.reward_ammount" }
            }, }
        ]);
        
        totalProjects = tc;

        this.end(rest, {success: true, data: { totalProjects, ksTotal: ksC, igTotal: idC, platforms: [...projR.data]} });
    }
}

export default [
    StatsURL,
];