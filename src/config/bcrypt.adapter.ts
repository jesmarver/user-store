import { compareSync, genSaltSync, hashSync } from "bcryptjs"


export const bcryptAdapter = {

    hash: (password: string) => {
        const salt = genSaltSync();
        return hashSync(password, salt);
    },
    comapre: (password: string, hashed: string) => {
        return compareSync(password, hashed);
    }
}