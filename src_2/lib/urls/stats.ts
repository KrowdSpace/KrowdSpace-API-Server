import {RestURL, safeJSON} from '@otter-co/ottlib';

export class StatsURL extends RestURL implements RestURL
{
    public static url = "/v1/stats";
    public static type = "post";

    public async onLoad(rest, data, cooks)
    {
        let totalProjects = 0,
            totalRewards = 0,
            totalRaised = 0;
        
        let projG = this.dataG['projects_getter'];

        let projR = await projG.aggregate([
            {$match: {}},
            {$group: {_id: "$platform"}, }
        ]).catch(err=>err);
        
        this.end(rest, {success: true, data: { totalProjects, totalRewards, totalRaised } });
    }
}

export default [
    StatsURL,
];