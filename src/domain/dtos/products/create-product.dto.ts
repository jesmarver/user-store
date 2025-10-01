import { Validators } from "../../../config";


export class CreateProductDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string, // ID
        public readonly category: string, // ID
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateProductDto?] {
        const {
            name,
            available,
            price,
            description,
            user,
            category,
        } = object;

        if (!name) return ['Missing name']
        if (!user) return ['Missing user']
        if (!Validators.isMongoId(user)) return ['Invalid User ID'];
        if (!category) return ['Missing category']
        if (!Validators.isMongoId(category)) return ['Invalid Category ID'];

        return [undefined, new CreateProductDto(name, !!available, price, description, user, category)];
    }
}