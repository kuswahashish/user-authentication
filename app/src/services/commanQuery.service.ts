import { record } from "zod";

class commonQuery {
    private model;

    constructor(model: any) {
        this.model = model;
    }

    /* CREATE/SAVE/ADD DATA IN TABLE */
    async create(data: Record<string, any>): Promise<any> {
        try {
            const createdItem = await this.model.create(data);
            return createdItem;
        } catch (error) {
            throw error;
        }
    };

    /* GET ALL DATA FROM TABLE */
    async getAllData(): Promise<any[]> {
        try {
            const items = await this.model.find().lean();
            return items;
        } catch (error) {
            throw error;
        }
    };

    /* GET SPECIFIC DATA AS FILTER FROM TABLE */
    async getData(filter = {}, projection = {}): Promise<any[]> {
        try {
            const items = await this.model.findOne(filter, projection)
            return items;
        } catch (error) {
            throw error;
        }
    };

    /* GET DATA BY ID FROM TABLE */
    async getDataById(id: string): Promise<any | null> {
        try {
            const item = await this.model.findById(id);
            return item;
        } catch (error) {
            throw error;
        }
    };

    /* DELETE DATA BY ID FROM TABLE */
    async deleteDataById(id: string): Promise<any | null> {
        try {
            const item = await this.model.findByIdAndDelete(id);
            return item;
        } catch (error) {
            throw error;
        }
    };

    /* DELETE DATA BY CONDITION FROM TABLE */
    async deleteData(condition: any): Promise<any | null> {
        try {
            const item = await this.model.deleteOne(condition);
            return item;
        } catch (error) {
            throw error;
        }
    };

    /* DELETE Y DATA BY CONDITION FROM TABLE */
    async deleteManyData(condition: any): Promise<any | null> {
        try {
            const item = await this.model.deleteMany(condition);
            return item;
        } catch (error) {
            throw error;
        }
    };
    /* UPDATE DATA IN TABLE */
    async updateData(id: string, data: Record<string, any>,): Promise<any | null> {
        try {
            const item = await this.model.findByIdAndUpdate(id, data, { new: true })
            return item;
        } catch (error) {
            throw error;
        }
    };

    /* JOIN WITH ANOTHER MODEL USING LOOKUP (MongoDB) */
    async lookupData(pipeline: any[]): Promise<any[]> {
        try {
            console.log(pipeline, "pipeline");

            const results = await this.model.aggregate(pipeline).exec();
            return results;
        } catch (error) {
            throw error;
        }
    }

    /* UPDATE DATA IN TABLE FOR THE DELETE ITEM FROM CART*/
    async findAndUpdateOperation(filter: any, operation: Record<string, any>,): Promise<any | null> {
        try {
            const item = await this.model.findOneAndUpdate(filter, operation, { new: true })
            return item;
        } catch (error) {
            throw error;
        }
    };

}

export default commonQuery;